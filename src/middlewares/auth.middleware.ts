import type { Request, Response, NextFunction } from 'express';

// ERRORS
import { UnauthorizedError } from '../errors/app.errors.js';

// SERVICES
import { verifyJWT } from '../services/token.service.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {

        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) throw new UnauthorizedError();

        const token = header.slice(7);
        if (!token) throw new UnauthorizedError();

        const id = verifyJWT(token).id;
        if (!id) throw new UnauthorizedError();

        req.id = id;
        next();

    } catch (err) {
        next(err);
    }
};