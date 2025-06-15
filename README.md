# 🧠 Einstein Chatbot

Een Node.js chatbot waarbij je praat met Albert Einstein. De chatbot gebruikt AI (via Azure OpenAI) in combinatie met vectorsearch (FAISS) om contextuele documenten te doorzoeken.

## 📦 Functionaliteit

- Chatten met een gesimuleerde Einstein
- Gebruikt context uit documenten (vectorsearch met LangChain)
- Houdt gespreksgeschiedenis bij
- Kan worden uitgebreid met planeteninfo of datumherkenning

## 🚀 Installatie

1. **Clone de repository**
   ```bash
   git clone https://github.com/<jouwgebruikersnaam>/einstein-chatbot.git
   cd einstein-chatbot
2.**installeer dependencies**
  npm install
3. **Maak een .env bestand aan**
  Voeg in de hoofdmap een .env bestand toe met de volgende inhoud:
  AZURE_OPENAI_API_KEY=je_api_key
  AZURE_EMBEDDING_DEPLOYMENT_NAME=je_embedding_deployment
4. **start de server**
  node server.js
  
