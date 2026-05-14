import { z } from 'zod';

export const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'El mensaje no puede estar vacío').max(1000, 'El mensaje es demasiado largo'),
  }),
});

export type ChatInput = z.infer<typeof chatSchema>['body'];