import { z } from 'zod';

export const sleepLogFormSchema = z.object({
  bedtime: z.string().min(1, 'Bedtime es requerido'),
  wakeTime: z.string().min(1, 'WakeTime es requerido'),
  quality: z.coerce.number().int().min(1, 'La calidad debe ser al menos 1').max(5, 'La calidad máxima es 5'),
  notes: z.string().optional(),
  exercise: z.boolean().default(false),
  caffeine: z.boolean().default(false),
  alcohol: z.boolean().default(false),
  stress: z.coerce.number().int().min(1).max(5).default(1),
  screenTime: z.boolean().default(false),
});

export type SleepLogFormValues = z.infer<typeof sleepLogFormSchema>;
