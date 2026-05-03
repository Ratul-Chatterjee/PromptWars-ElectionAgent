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
  // SECURITY CHECK 1: Restrict to POST requests only
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  // SECURITY CHECK 2: Strict Input Validation & Type Checking
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message format.' });
  }
  if (!Array.isArray(history)) {
    return res.status(400).json({ error: 'Invalid history format.' });
  }

  // SECURITY CHECK 3: Payload Size Limits (Prevents Token Draining Attacks)
  // Limit user messages to 500 characters
  if (message.length > 500) {
    return res.status(400).json({ error: 'Message exceeds maximum length of 500 characters.' });
  }
  // Limit conversation history to the last 20 messages to save tokens
  if (history.length > 20) {
    return res.status(400).json({ error: 'Conversation history is too long. Please refresh to start a new chat.' });
  }

  // Securely retrieve the API key from Vercel's hidden environment variables
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing on the server configuration.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: ELECTION_SYSTEM_INSTRUCTION
    });

    // Clean and strictly format the history before sending to Google
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      // Ensure historical messages are also truncated if somehow manipulated
      parts: [{ text: String(msg.content).substring(0, 1000) }] 
    }));

    const chat = model.startChat({
      history: formattedHistory
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response from the AI service.' });
  }
}
