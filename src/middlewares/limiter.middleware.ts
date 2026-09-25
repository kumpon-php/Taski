import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

export const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    handler: (req: Request, res: Response) => {
        return res.status(429).json({ code: 429, error: 'Слишком много попыток. Попробуйте позже.' });
    }
});