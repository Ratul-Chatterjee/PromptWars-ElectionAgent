# CivicGuide - Election Education Assistant 🗳️

**A submission for Prompt Wars by Hack2Skill**

## 🏆 The Event & Problem Statement
This project was developed for **Prompt Wars**, a hackathon organized by **Hack2Skill**. 

**Problem Statement:** 
Create a smart, dynamic assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

## 🎯 Goal of the App
**CivicGuide** is an intelligent, dynamic, and completely neutral Election Education Assistant. Its primary goal is to democratize knowledge about the voting process. It acts as a personal tutor for the "General / First-Time Voter", breaking down complex electoral information—like voter registration requirements, finding polling places, understanding mail-in ballots, and important deadlines—into simple, actionable, and politically neutral steps. 

## ✨ Features
- **Smart Conversational Interface:** Powered by Google's cutting-edge Gemini 2.5 Flash model.
- **Strictly Educational & Neutral:** Guided by robust System Instructions to ensure it never endorses candidates or parties, focusing purely on civic mechanics.
- **Modern UI/UX:** Responsive design, glassmorphism elements, dynamic sidebar, and smooth micro-animations.
- **100% Secure Architecture:** Uses a Vercel Serverless Backend. The API key is fully hidden on the server and is never exposed to the frontend browser or committed to GitHub.

## 👥 How to Use This App
Using CivicGuide is incredibly simple:
1. **Open the App:** Visit the live Vercel deployment link.
2. **Select a Quick Topic:** Use the sidebar to instantly ask common questions like "Am I registered?", "Where do I vote?", or "Voter ID Laws".
3. **Chat Naturally:** Type any question you have about the democratic process into the chat box.
4. **Learn:** CivicGuide will provide you with step-by-step, factual guidance. *(Note: Always verify critical deadlines with your local election office).*

## 🚀 How to Run Locally

### Local Development
To test both the frontend and the backend locally, you will need the Vercel CLI, as standard Vite does not run the serverless backend.

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Link your project and run the local Vercel development server:
   ```bash
   vercel dev
   ```
4. Open the provided `localhost` link to test the chat interface.

## 🛠️ Built With
- **Frontend:** React.js & Vite
- **Backend:** Node.js (Vercel Serverless Functions)
- **AI:** Google Generative AI SDK (`@google/generative-ai`, `gemini-2.5-flash`)
- **Styling & UI:** Vanilla CSS, Lucide React, React Markdown
