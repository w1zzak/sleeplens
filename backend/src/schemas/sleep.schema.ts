import { z } from 'zod';

export const sleepLogBaseSchema = z.object({
  date: z.string().datetime().optional(),
  bedtime: z.string().datetime({ message: 'Bedtime debe ser una fecha ISO válida' }),
  wakeTime: z.string().datetime({ message: 'WakeTime debe ser una fecha ISO válida' }),
  quality: z.number().int().min(1).max(5),
  notes: z.string().optional(),
  exercise: z.boolean().default(false),
  caffeine: z.boolean().default(false),
  alcohol: z.boolean().default(false),
  stress: z.number().int().min(1).max(5).default(1),
  screenTime: z.boolean().default(false),
});

export const createSleepLogSchema = z.object({
  body: sleepLogBaseSchema,
});

export const updateSleepLogSchema = z.object({
  body: sleepLogBaseSchema.partial(),
});

export type CreateSleepLogInput = z.infer<typeof createSleepLogSchema>['body'];
export type UpdateSleepLogInput = z.infer<typeof updateSleepLogSchema>['body'];
