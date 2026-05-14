import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY no está definido en las variables de entorno');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Usamos gemini-2.5-flash por ser el modelo más reciente, rápido y gratuito
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Modelo Pro opcional (si está disponible en tu región/cuenta)
export const geminiProModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
