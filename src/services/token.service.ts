import { db } from '../db.js';

import jwt from 'jsonwebtoken';
import { SECRET } from '../schemas/env.schema.js';

// ERRORS
import { InvalidTokenError } from '../errors/app.errors.js';

// TYPES
import type { Token } from '../schemas/token.schema.js';

// ADDITIONAL
import bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'node:crypto';
import { Temporal } from 'temporal-polyfill';

// COOKIE HELPERS
import type { Response } from 'express';

export const REFRESH_COOKIE = 'refreshToken';

export const setRefreshCookie = (res: Response, token: string) => {
    res.cookie(REFRESH_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/user',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const clearRefreshCookie = (res: Response) => {
    res.clearCookie(REFRESH_COOKIE, { path: '/user' });
};

// ACCESS TOKEN

type AccessPayload = {
    id: number,
};

export const signJWT = (id: number) => {
    return jwt.sign({ id }, SECRET, { expiresIn: '15m' });
};

export const verifyJWT = (token: Token) => {
    return jwt.verify(token, SECRET) as AccessPayload;
};

// REFRESH TOKEN

export const generateRefreshToken = () => {
    return randomBytes(32).toString('hex');
};

export const createTokenHash = async (rawToken: Token) => {
    return await createHash('sha256').update(rawToken).digest('hex');
};

export const saveToken = async (userId: number, tokenHash: Token) => {
    const expiresAt = Temporal.Now.instant().add({ hours: 24 * 7 });
    await db.orm.public.RefreshToken.create({ userId, tokenHash, expiresAt });
};

export const refresh = async (rawToken: Token) => {
    const currentTokenHash = await createTokenHash(rawToken);

    const token = await db.orm.public.RefreshToken
        .where({ tokenHash: currentTokenHash })
        .first();

    if (!token || token.revoked) throw new InvalidTokenError();

    if (Temporal.Instant.compare(token.expiresAt, Temporal.Now.instant()) <= 0) {
        await db.orm.public.RefreshToken
            .where({ id: token.id })
            .delete();

        throw new InvalidTokenError();
    }

    await db.orm.public.RefreshToken
        .where({ id: token.id })
        .update({ revoked: true });

    const accessToken = signJWT(token.userId);
    const refreshToken = generateRefreshToken();

    const tokenHash = await createTokenHash(refreshToken);
    await saveToken(token.userId, tokenHash);

    return { accessToken, refreshToken };

};