import { SleepLog } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { CreateSleepLogInput, UpdateSleepLogInput } from '../schemas/sleep.schema';

/**
 * Calcula la duración entre dos fechas en horas
 */
const calculateDuration = (bedtime: string | Date, wakeTime: string | Date): number => {
  const start = new Date(bedtime).getTime();
  const end = new Date(wakeTime).getTime();
  const diffMs = end - start;
  
  // Si wakeTime es antes que bedtime, asumimos que cruzó la medianoche
  const adjustedDiff = diffMs < 0 ? diffMs + (24 * 60 * 60 * 1000) : diffMs;
  
  return Number((adjustedDiff / (1000 * 60 * 60)).toFixed(2));
};

export const createSleepLog = async (userId: string, data: CreateSleepLogInput): Promise<SleepLog> => {
  const duration = calculateDuration(data.bedtime, data.wakeTime);

  return prisma.sleepLog.create({
    data: {
      userId,
      date: data.date ? new Date(data.date) : new Date(),
      bedtime: new Date(data.bedtime),
      wakeTime: new Date(data.wakeTime),
      duration,
      quality: data.quality,
      notes: data.notes,
      exercise: data.exercise,
      caffeine: data.caffeine,
      alcohol: data.alcohol,
      stress: data.stress,
      screenTime: data.screenTime,
    },
  });
};

export const getSleepLogs = async (userId: string): Promise<SleepLog[]> => {
  return prisma.sleepLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
};

export const getSleepLogById = async (id: string, userId: string): Promise<SleepLog> => {
  const log = await prisma.sleepLog.findUnique({
    where: { id },
  });

  if (!log || log.userId !== userId) {
    throw new Error('Registro no encontrado o no autorizado');
  }

  return log;
};

export const updateSleepLog = async (id: string, userId: string, data: UpdateSleepLogInput): Promise<SleepLog> => {
  // Verificar existencia y autorización
  await getSleepLogById(id, userId);

  let duration: number | undefined = undefined;
  if (data.bedtime && data.wakeTime) {
    duration = calculateDuration(data.bedtime, data.wakeTime);
  }

  return prisma.sleepLog.update({
    where: { id },
    data: {
      ...(data.date && { date: new Date(data.date) }),
      ...(data.bedtime && { bedtime: new Date(data.bedtime) }),
      ...(data.wakeTime && { wakeTime: new Date(data.wakeTime) }),
      ...(duration !== undefined && { duration }),
      ...(data.quality !== undefined && { quality: data.quality }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.exercise !== undefined && { exercise: data.exercise }),
      ...(data.caffeine !== undefined && { caffeine: data.caffeine }),
      ...(data.alcohol !== undefined && { alcohol: data.alcohol }),
      ...(data.stress !== undefined && { stress: data.stress }),
      ...(data.screenTime !== undefined && { screenTime: data.screenTime }),
    },
  });
};

export const deleteSleepLog = async (id: string, userId: string): Promise<SleepLog> => {
  await getSleepLogById(id, userId);

  return prisma.sleepLog.delete({
    where: { id },
  });
};

export interface SleepStats {
  avgDuration: number;
  avgQuality: number;
  currentStreak: number;
}

export const getSleepStats = async (userId: string): Promise<SleepStats> => {
  const logs = await prisma.sleepLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  if (logs.length === 0) {
    return { avgDuration: 0, avgQuality: 0, currentStreak: 0 };
  }

  const totalQuality = logs.reduce((sum, log) => sum + log.quality, 0);
  const avgQuality = Number((totalQuality / logs.length).toFixed(1));

  const durationLogs = logs.filter(log => log.duration !== null);
  let avgDuration = 0;
  if (durationLogs.length > 0) {
    const totalDuration = durationLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    avgDuration = Number((totalDuration / durationLogs.length).toFixed(1));
  }

  // Calculate streak based on unique dates
  const logDates = Array.from(new Set(logs.map(log => {
    const d = new Date(log.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })));

  let streak = 0;
  let currentDate = new Date();
  
  let dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  // If no log today, check yesterday to see if streak is still alive
  if (!logDates.includes(dateString)) {
    currentDate.setDate(currentDate.getDate() - 1);
    dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  }

  while (logDates.includes(dateString)) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
    dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  }

  return {
    avgDuration,
    avgQuality,
    currentStreak: streak,
  };
};

export const getSleepHistory = async (userId: string, year: number, month: number): Promise<SleepLog[]> => {
  // month is 1-indexed (1 = January, 12 = December)
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return prisma.sleepLog.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: { date: 'asc' },
  });
};
