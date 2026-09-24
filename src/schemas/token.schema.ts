import { z } from 'zod';

// SCHEMAS

export const tokenSchema = z.coerce.string({ error: 'Не удалось получить токен' }).min(60, 'TOKEN IS TOO SHORT');

// TYPES

export type Token = z.infer<typeof tokenSchema>;