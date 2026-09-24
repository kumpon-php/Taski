import type { Request, Response, NextFunction } from 'express';
import { AppError } from "../errors/app.errors";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) return res.status(err.codeStatus).json({ code: err.codeStatus, error: err.message });

    console.error(err);
    return res.status(500).json({ code: 500, error: 'Неизвестная ошибка сервера. Попробуйте еще раз.' });
};