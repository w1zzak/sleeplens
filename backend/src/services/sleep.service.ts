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
