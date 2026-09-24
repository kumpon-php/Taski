import { z } from 'zod';

// SCHEMAS

export const taskSchema = z.object({
    title: z.coerce.string({ error: 'Не удалось получить название задачи' }).min(2, 'Минимальная длина названия задачи: 2 символа'),
    description: z.coerce.string({ error: 'Не удалось получить описание задачи' }).min(5, 'Минимальная длина описания задачи: 5 символов').optional(),
    highPriority: z.coerce.boolean({ error: 'Ожидалось true или false для приоритета задачи' }).optional(),
});

export const taskUpdateSchema = taskSchema.extend({
    done: z.coerce.boolean({ error: 'Ожидалось true или false для `done`' }).optional(),
}).optional();

export const searchOptions = z.object({
    page: z.coerce.number({ error: 'Не удалось получить page' }).int({ error: 'Некорректный параметр page' }).min(1, 'Некорректный параметр page').default(1),
    limit: z.coerce.number({ error: 'Не удалось получить limit' }).int({ error: 'Некорректный параметр limit' }).min(1, 'Некорректный параметр limit').max(50, 'Некорректный параметр limit').default(10),
});

// TYPES

export type TaskDto = z.infer<typeof taskSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;
export type TaskSearchOptions = z.infer<typeof searchOptions>;