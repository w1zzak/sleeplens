import { ChatMessage } from "@prisma/client"
import { prisma } from "../lib/prisma"
import { geminiModel } from "../lib/gemini"

export const sendChatMessage = async (userId: string, userMessage: string): Promise<string> => {
    try {

        // 2. Obtener los ultimos 7 sleep logs (para el contexto)
        const recentSleepLogs = await prisma.sleepLog.findMany({
            where: { userId },
            orderBy: { bedtime: 'desc' },
            take: 7,
        });

        // 3. Construir el system prompt con ese contexto
        const contextSummary = recentSleepLogs.map(log =>
            `Fecha: ${log.bedtime.toLocaleDateString()}, Durmió: ${log.duration}h, Calidad: ${log.quality}/5, ` +
            `Estrés: ${log.stress}/5, Cafeína: ${log.caffeine ? 'Sí' : 'No'}, Ejercicio: ${log.exercise ? 'Sí' : 'No'}, ` +
            `Notas: ${log.notes || 'Sin notas'}`
        ).reverse().join('\n');


        const sleepContext = recentSleepLogs.length > 0 ?
            `ESTADO ACTUAL DEL USUARIO (Últimos 7 días):\n${contextSummary}`
            : `El usuario aún no tiene registros de sueño. Puedes orientarlo sobre cómo empezar a trackear su sueño.`;

        const systemPrompt = `
        Eres SleepLens AI, un experto en medicina del sueño y bienestar.
        Tu objetivo es ayudar al usuario a mejorar su descanso basándote en sus datos.

        ${sleepContext}

        REGLAS:
        1. Sé empático pero profesional.
        2. Si detectas patrones (ej: el café baja la calidad), menciónalo.
        3. No des diagnósticos médicos, da consejos de higiene del sueño.
        4. Mantén las respuestas concisas (2-3 párrafos max)
        5. Responde siempre en el idioma en que el usuario te escriba.
        `
        // 4. Obtener los últimos 20 chat messages de la DB
        const historyMessages = await prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        const formattedHistory = historyMessages.reverse() // Los ponemos en orden: viejo -> nuevo

        // 5. Construir el array contents mapeando los roles
        const chatHistory = formattedHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model', // Traducimos assistant -> model para Gemini
            parts: [{ text: msg.content }] // Metemos el texto en el formato que pide Gemini
        }))

        // 6. Llamar a Gemini
        const result = await geminiModel.generateContent({
            systemInstruction: systemPrompt,
            contents: [
                ...chatHistory,
                { role: 'user', parts: [{ text: userMessage }] }
            ]
        });
        const aiResponse = result.response.text();

        // 7. Guardar ambos mensajes en la BD
        await prisma.chatMessage.create({
            data: {
                userId,
                role: 'user',
                content: userMessage,
            },
        });

        await prisma.chatMessage.create({
            data: {
                userId,
                role: 'assistant', // O 'model' si prefieres mantener la consistencia
                content: aiResponse
            }
        });

        return aiResponse;

    } catch (error) {
        console.error('Error in sendChatMessage:', error);
        throw new Error('Error al comunicarse con la IA');
    }
}

export const getChatHistory = async (userId: string): Promise<ChatMessage[]> => {
    try {
        return await prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            take: 50
        })
    } catch (error) {
        console.error('Error in getChatHistory:', error);
        throw new Error('Error al recuperar el historial de chat');
    }
}