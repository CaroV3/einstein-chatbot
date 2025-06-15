import express from "express";
import cors from "cors";
import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import {extractDateFromText } from "./dateParser.js";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import * as dotenv from "dotenv";
dotenv.config({ path: '../.env' });


let vectorStore;

const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME,
});

// Laad vectordata bij opstarten
async function loadVectorStore() {
    vectorStore = await FaissStore.load("vectordatabase", embeddings);
    console.log("Vectordata geladen");
}

await loadVectorStore();

const model = new AzureChatOpenAI({ temperature: 0.2,   azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY});

const app = express();
app.use(cors());
app.use(express.json());


app.post("/ask", async (req, res) => {
    const prompt = req.body.message;
    const history = req.body.history || [];

    let documentContext = "";

    if (vectorStore) {
        const relevantDocs = await vectorStore.similaritySearch(prompt, 3);
        documentContext = relevantDocs.map(doc => doc.pageContent).join("\n\n");
        console.log("Document context gebruikt voor prompt:\n", documentContext);
    }

    // const parsedDate = extractDateFromText(prompt);
    // if (parsedDate) {
    //     console.log("Gevonden datum in prompt:", parsedDate.toISOString().split("T")[0]);
    //     // Hier kun je: planetService aanroepen, embedding maken, context genereren, etc.
    //
    // } else {
    //     console.log("Geen datum gevonden in prompt.");
    // }
    //
    // let planetContext = "";
    // if (parsedDate) {
    //     try {
    //         const { texts } = await getPlanetEmbeddingTextForDate(parsedDate);
    //         planetContext = texts.join(" ");  // Combineer alle planetenstanden in één tekst
    //     } catch (error) {
    //         console.error("Fout bij ophalen planeten:", error);
    //     }
    // }

    const modernWords = ["TikTok", "iPhone", "Snapchat", "rap", "graffiti", "blockchain", "wifi", "EDM", "techno", "Instagram", "sushi", "apps"];
    const containsModernWords = modernWords.some(word => prompt.toLowerCase().includes(word.toLowerCase()));

    let systemPrompt = "Je bent Albert Einstein. Je bent vriendelijk, slim, filosofisch en een beetje trots. " +
        "Je spreekt met een moderne gebruiker uit de 21e eeuw en geeft deze gebruiker geschiedenislessen vanuit jouw perspectief en leven. " +
        "Jij bent Einstein – niet de gebruiker.\n" +
        "\n" +
        "Je antwoordt als Einstein, met voorbeelden uit zijn leven en tijd. " +
        "Je leefde van 1879 tot en met 1955 en mag alleen inhoudelijke kennis gebruiken uit dat tijdperk en daarvoor. " +
        "Je kent geen feitelijke informatie van na 1955.\n" +
        "\n" +
        "Als je iets wordt gevraagd dat na jouw tijd is ontstaan (zoals moderne muziekgenres, technologie of cultuur), " +
        "stel dan eerst een vriendelijke tegenvraag waarin je vraagt wat het is. " +
        "Daarna mag je reflecteren vanuit jouw tijdsbeeld, maar noem geen feiten of jaartallen van ná 1955, tenzij ze door de gebruiker zelf zijn genoemd.\n" +
        "\n" +
        "Als een onderwerp al eerder besproken is, verwijs er dan naar. Stel geen vragen opnieuw en geef geen uitleg die de gebruiker al gaf. " +
        "Laat merken dat je de gebruiker begrijpt, onthoudt en voortbouwt op eerdere gesprekken door zinnen te gebruiken zoals 'ik kan me herinneren dat je eerder zei...' " +
        "of 'Zoals je eerder zei...'.\n" +
        "\n" +
        "Beantwoord vragen in 3 tot 4 zinnen. Schrijf in duidelijke taal, zonder overdreven AI-formuleringen. Je spreekt als een echte persoon." +
        "" +
        "Bedenk voor je antwoord geeft: hoe zou Einstein dit gezegd hebben, en geef daarna pas antwoord.\n";

    if (containsModernWords) {
        systemPrompt += " Onthoud: je kent moderne termen zoals TikTok, rapmuziek, sushi en smartphones niet. " +
            "Vraag de gebruiker dan wat het is en maak eventueel een grapje erbij zodat het natuurlijk overkomt. " +
            "Je geeft NOOIT inhoudelijke informatie over moderne onderwerpen, tenzij de gebruiker ze eerst uitlegt. " +
            "Hier is informatie over de stand van de planeten op de gevraagde datum:\\n\ ";
    }

    const chatHistory = [
        ["system", systemPrompt + "\n\nGebruik deze extra context:\n" + documentContext],
        ...history,
        ["human", prompt]
    ];


    try {
        const result = await model.invoke(chatHistory);
        const aiResponse = result.content;
        res.json({ message: aiResponse });
    } catch (error) {
        console.error("Fout tijdens promptverwerking:");
        console.error(error); // Log de volledige error, inclusief stacktrace
        res.status(500).json({ error: "Er is iets misgegaan met de AI-verwerking." });
    }
});

app.listen(3000, () => console.log("Server is running on port 3000"));