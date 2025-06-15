# 🧠 Einstein Chatbot

Een Node.js chatbot waarbij je praat met Albert Einstein. De chatbot gebruikt AI (via Azure OpenAI) in combinatie met vectorsearch (FAISS) om contextuele documenten te doorzoeken.

## 📦 Functionaliteit

- Chatten met een gesimuleerde Einstein
- Gebruikt context uit documenten (vectorsearch met LangChain)
- Houdt gespreksgeschiedenis bij

## 🚀 Installatie

1. **Clone de repository**
   ```bash
   git clone https://github.com/<jouwgebruikersnaam>/einstein-chatbot.git
   cd einstein-chatbot
   ```
2. **Installeer dependencies in de server map**
   ```bash
   cd server
   npm install

   ```
3. **Maak .env bestand aan.**
   
   Kopieer de gegevens .env.example en plak deze in je zelfgemaakte .env bestand. Je hoeft deze alleen aan te      vullen met de geheime API key
5. **Start de server.**
   Voer in in de terminal:
   ```bash
   cd server
   node server.js
   ```
6. **Open de frontend**

   Open client/index.html in je browser (bijv. via PhpStorm: rechterklik → "Open in Browser")

   Typ een vraag om met Einstein te chatten!

  
