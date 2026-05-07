# CivicGuide - Election Education Assistant 🗳️

**A submission for Prompt Wars by Hack2Skill**

## 🏆 The Event & Problem Statement
This project was developed for **Prompt Wars**, a hackathon organized by **Hack2Skill**. 

**Problem Statement:** 
Create a smart, dynamic assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

## 🎯 Goal of the App
**CivicGuide** is an intelligent, dynamic, and completely neutral Election Education Assistant. Its primary goal is to democratize knowledge about the voting process. It acts as a personal tutor for the "General / First-Time Voter", breaking down complex electoral information—like voter registration requirements, finding polling places, understanding mail-in ballots, and important deadlines—into simple, actionable, and politically neutral steps. 

## 🛡️ Secure BYOK Architecture (Bring Your Own Key)
This version of CivicGuide uses a **Privacy-First Architecture**:
- **Zero Server Storage:** Your API key is never stored on our servers.
- **Local Control:** Your key is stored locally in your own browser's `localStorage`.
- **Client-Side AI:** All AI processing happens directly between your browser and Google's Gemini API.

## ✨ Features
- **Smart Conversational Interface:** Powered by Google's cutting-edge Gemini 2.5 Flash model.
- **Setup Wizard:** A user-friendly modal that guides you through getting your free API key.
- **Modern UI/UX:** Responsive design, glassmorphism elements, and smooth micro-animations.
- **Strictly Educational:** Neutral guidance on civic mechanics.

## 👥 How to Use This App
1. **Open the App:** Visit the live deployment.
2. **Setup AI:** Enter your Gemini API key in the setup modal.
3. **Tutorial:** Use the built-in guide within the app to learn how to get a free key from Google AI Studio.
4. **Chat & Learn:** Ask anything about the democratic process!

## 🚀 Local Development

1. **Clone the Repo.**
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Run Dev Server:**
   ```bash
   npm run dev
   ```
4. **Enter Key:** Paste your key in the app UI.

## 🛠️ Built With
- **Frontend:** React.js & Vite
- **AI:** Google Generative AI SDK (`gemini-2.5-flash`)
- **Icons:** Lucide React
- **Formatting:** React Markdown
