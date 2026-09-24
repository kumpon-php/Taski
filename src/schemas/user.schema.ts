import { z } from 'zod';

// SCHEMAS

export const userSchema = z.object({
    name: z.coerce.string({ error: 'Не было передано имя' }).min(2, 'Имя должно состоять минимум из двух символов').max(31, 'Максимальная длина имени: 31 символ'),
    email: z.email({ error: 'Некорректный e-mail' }),
    password: z.coerce.string({ error: 'Не был передан пароль' }).min(9, 'Минимальная длина пароля: 9 символов'),
});

export const loginSchema = z.object({
    email: z.email({ error: 'Не удалось получить e-mail' }),
    password: z.coerce.string({ error: 'Не удалось получить пароль' }),
});

export const codeSchema = z.coerce.string({ error: 'INCORRECT CODE' });

export const verificationSchema = z.object({
    code: z.coerce.string({ error: 'INCORRECT CODE' }),
    email: z.email({ error: 'Не удалось получить e-mail' }),
});

export const emailSchema = z.email({ error: 'Не удалось получить e-mail' });
export const idSchema = z.coerce.number({ error: 'Не удалось получить id' }).min(1, 'Минимальное значение для id: 1');

export const changePasswordSchema = z.object({
    oldPassword: z.coerce.string({ error: 'Не был передан пароль' }),
    newPassword: z.coerce.string({ error: 'Не был передан пароль' }).min(9, 'Минимальная длина пароля: 9 символов'),
});

export const changeNameSchema = z.object({
    name: z.coerce.string({ error: 'Не было передано имя' }).min(2, 'Имя должно состоять минимум из двух символов').max(31, 'Максимальная длина имени: 31 символ')
});

// TYPES

export type UserDto = z.infer<typeof userSchema>;
export type UserLogin = z.infer<typeof loginSchema>;
export type Code = z.infer<typeof codeSchema>;
export type VerificationData = z.infer<typeof verificationSchema>;
export type Email = z.infer<typeof emailSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type ChangeName = z.infer<typeof changeNameSchema>;