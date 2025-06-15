// embed.js
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { AzureOpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import * as dotenv from "dotenv";
dotenv.config();

console.log("API VERSION:", process.env.OPENAI_API_VERSION);

const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME, // als je die gebruikt
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
});


async function createVectorStore() {
    const loader = new PDFLoader('./The_Design_of_Everyday_Things_by_Don_Norman.pdf');
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1200,
        chunkOverlap: 200
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`${splitDocs.length} stukken gemaakt.`);

    const vectorStore = await FaissStore.fromDocuments(splitDocs, embeddings);
    await vectorStore.save("vectordatabase"); // sla op in een map genaamd vectordatabase
    console.log("Vectordatabase opgeslagen.");
}

createVectorStore();
