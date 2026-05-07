// This file is deprecated. The app now uses a Client-Side BYOK architecture.
export default async function handler(req, res) {
  return res.status(410).json({ error: "This endpoint is deprecated. Please use the client-side Gemini integration." });
}
