import { GoogleGenerativeAI } from '@google/generative-ai';

const ELECTION_SYSTEM_INSTRUCTION = `
You are CivicGuide, an expert, friendly, and neutral Election Assistant.
Your goal is to help users understand the election process, timelines, and steps.
You must remain completely politically neutral. Never endorse a candidate or party.
Focus on the mechanics of voting: registration, finding polling places, required ID, mail-in ballots, and key dates.
Structure your answers with bullet points and clear steps when applicable.
If you don't know the specific rules for a user's local area, advise them to check their local election office website.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // The VITE_GEMINI_API_KEY environment variable will be read securely from the Vercel server.
  // It is NEVER exposed to the frontend browser.
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing on the server configuration.' });
  }

  try {
    const { message, history } = req.body;
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: ELECTION_SYSTEM_INSTRUCTION
    });

    // Format the conversation history for the Gemini API
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory
    });

    // Send the new message to the API
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // Send the generated reply back to our frontend
    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response from the AI service.' });
  }
}
