import { Request, Response } from 'express';
import * as sleepService from '../services/sleep.service';
import { getErrorMessage } from '../lib/errors';

export const createSleepLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const log = await sleepService.createSleepLog(userId, req.body);
    res.status(201).json({ data: log });
  } catch (error: unknown) {
    console.error('Error in createSleepLog:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getSleepLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const logs = await sleepService.getSleepLogs(userId);
    res.status(200).json({ data: logs });
  } catch (error: unknown) {
    console.error('Error in getSleepLogs:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getSleepLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const log = await sleepService.getSleepLogById(req.params.id, userId);
    res.status(200).json({ data: log });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    if (message === 'Registro no encontrado o no autorizado') {
      res.status(404).json({ error: message });
      return;
    }
    console.error('Error in getSleepLogById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateSleepLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const log = await sleepService.updateSleepLog(req.params.id, userId, req.body);
    res.status(200).json({ data: log });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    if (message === 'Registro no encontrado o no autorizado') {
      res.status(404).json({ error: message });
      return;
    }
    console.error('Error in updateSleepLog:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteSleepLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    await sleepService.deleteSleepLog(req.params.id, userId);
    res.status(200).json({ data: { success: true } });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    if (message === 'Registro no encontrado o no autorizado') {
      res.status(404).json({ error: message });
      return;
    }
    console.error('Error in deleteSleepLog:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getSleepStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const stats = await sleepService.getSleepStats(userId);
    res.status(200).json({ data: stats });
  } catch (error: unknown) {
    console.error('Error in getSleepStats:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getSleepHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }

    const year = parseInt(req.query.year as string);
    const month = parseInt(req.query.month as string);

    if (isNaN(year) || isNaN(month)) {
      res.status(400).json({ error: 'Parámetros year y month son requeridos y deben ser números' });
      return;
    }

    const logs = await sleepService.getSleepHistory(userId, year, month);
    res.status(200).json({ data: logs });
  } catch (error: unknown) {
    console.error('Error in getSleepHistory:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
