import { Request, Response } from "express";
import { sendChatMessage, getChatHistory } from "../services/ai.service";

export const chat = async (req: Request, res: Response): Promise<void> => {
    // Aqui irá la lógica para enviar un mensaje
    const userId = req.user?.userId

    if (!userId) {
        res.status(401).json({ error: 'No autorizado' })
        return
    }

    const { message } = req.body
    if (!message) {
        res.status(400).json({ error: 'Mensaje es requerido' })
        return
    }
    try {
        const response = await sendChatMessage(userId, message)
        res.status(200).json({ data: response })
    } catch (error: unknown) {
        console.error('Error in chat:', error)
        res.status(500).json({ error: 'Error al comunicarse con la IA' })
    }
}

export const getHistory = async (req: Request, res: Response): Promise<void> => {
    // Aqui irá la lógica para recuperar el historial
    const userId = req.user?.userId

    if (!userId) {
        res.status(401).json({ error: 'No autorizado' })
        return
    }
    try {
        const history = await getChatHistory(userId)
        res.status(200).json({ data: history })
    } catch (error: unknown) {
        console.error('Error in getHistory:', error)
        res.status(500).json({ error: 'Error al recuperar el historial' })
    }
}