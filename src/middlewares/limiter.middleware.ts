import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

export const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    handler: (req: Request, res: Response) => {
        return res.status(429).json({ code: 429, error: 'Слишком много попыток. Попробуйте позже.' });
    }
});

export const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 15,
    standardHeaders: true,
    handler: (req: Request, res: Response) => {
        return res.status(429).json({ code: 429, error: 'Слишком много попыток. Попробуйте позже.' })
    }
});

export const taskLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 15,
    standardHeaders: true,
    handler: (req: Request, res: Response) => {
        return res.status(429).json({ code: 429, error: 'Слишком много попыток. Попробуйте позже.' })
    }
});