import { GoogleGenAI } from '@google/genai';

let ai = null;

export function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_key_here') {
      console.warn('⚠️  GEMINI_API_KEY not configured. AI features will be unavailable.');
      return null;
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}
