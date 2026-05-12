import { Request, Response } from 'express';
import { registerService, loginService } from '../services/auth.service';
import { getErrorMessage } from '../lib/errors';

export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerService(req.body);
    res.status(201).json({ data: result });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    if (message === 'El correo electrónico ya está registrado') {
      res.status(400).json({ error: message });
      return;
    }
    console.error('Error in registerController:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginService(req.body);
    res.status(200).json({ data: result });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    if (message === 'Credenciales inválidas') {
      res.status(401).json({ error: message });
      return;
    }
    console.error('Error in loginController:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
