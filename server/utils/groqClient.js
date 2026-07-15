import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

let groqClient = null;

export const getGroqClient = () => {
  if (!groqClient && process.env.GROQ_API_KEY) {
    try {
      groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    } catch (e) {
      console.error('Groq initialization error:', e);
    }
  }
  return groqClient;
};
