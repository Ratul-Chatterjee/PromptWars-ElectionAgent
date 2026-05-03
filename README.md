# PromptWars - CivicGuide Election Assistant

CivicGuide is an intelligent, dynamic, and neutral Election Assistant built for the PromptWars challenge. It is designed to help users navigate the election process by providing clear instructions on voter registration, polling places, important dates, and general election mechanics.

## 🎯 Challenge Vertical & Persona
This solution is designed around the **"General Voter / First-Time Voter"** persona. The assistant adopts a friendly, accessible, and completely politically neutral tone. It breaks down complex electoral information into simple, actionable steps using a beautiful chat interface.

## ✨ Features
- **Smart Conversational Interface:** Powered by Google's Gemini 1.5 Flash.
- **Modern UI/UX:** Responsive design, glassmorphism elements, dynamic sidebar, and smooth micro-animations.
- **100% Secure Architecture:** Uses a Vercel Serverless Backend. The API key is fully hidden on the server and is never exposed to the frontend browser or committed to GitHub.
- **Lightning Fast & Lightweight:** Built with Vite and React, keeping the application payload incredibly small.

## 🚀 How to Run & Deploy

### Deploying Securely to Vercel (Recommended)
This application is architected to be deployed on Vercel, utilizing the `api/chat.js` folder for a secure serverless backend.

1. Create a GitHub repository and push this code (your `.env` file is ignored, so the API key will not be pushed).
2. Go to [Vercel](https://vercel.com/) and create a new project from your GitHub repository.
3. In the Vercel project configuration, go to **Settings > Environment Variables**.
4. Add a new variable:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `[Paste your Gemini API key from Google AI Studio]`
5. Deploy the app! Vercel will automatically build the Vite frontend and spin up the `/api/chat` serverless backend. Your app will work instantly for anyone, and your API key will remain 100% invisible.

### Local Development
To test both the frontend and the backend locally, you will need the Vercel CLI, as standard Vite does not run the serverless backend.

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. Link your project and run the local Vercel development server:
   ```bash
   vercel dev
   ```
3. Open the provided `localhost` link to test the chat interface.

## 🛠️ Built With
- React.js & Vite
- Node.js (Vercel Serverless Functions)
- Google Generative AI SDK (`@google/generative-ai`)
- Lucide React (Icons)
- React Markdown (Rich text rendering)
- Vanilla CSS (Tailored UI aesthetics)
