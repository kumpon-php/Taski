import type { Request, Response, NextFunction } from 'express';

// SERVICES
import {
    create,
    login,
    verify,
    me,
    changePassword,
    changeName,
    logout,
    newCode
    } from '../services/user.service.js';

// ADDITIONAL
import { generateCode } from '../services/code.service.js';
import { refresh, REFRESH_COOKIE } from '../services/token.service.js';
import { setRefreshCookie, clearRefreshCookie } from '../services/token.service.js';

// SCHEMAS
import {
    userSchema,
    loginSchema,
    verificationSchema,
    changePasswordSchema,
    changeNameSchema,
    emailSchema
    } from '../schemas/user.schema.js';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = userSchema.safeParse(req.body);

        if (!parsed.success) return res.status(400).json({ code: 400, error: parsed.error.flatten().fieldErrors });

        const code = generateCode(6);

        const user = await create(code, parsed.data);
        return res.status(201).json({ code: 201, ...user });

    } catch (err) {
        next(err);
    }
};

export const newCodeRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = emailSchema.safeParse(req.body.email);

        if (!parsed.success) return res.status(400).json({ code: 400, error: parsed.error.issues[0].message });

        const code = generateCode(6);
        const data = { code, email: parsed.data };

        const ok = await newCode(data);
        return res.status(200).json({ code: 200, ...ok });

    } catch (err) {
        next(err);
    }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = verificationSchema.safeParse(req.body);

        if (!parsed.success) return res.status(400).json({ code: 400, error: parsed.error.flatten().fieldErrors });

        const verified = await verify(parsed.data);
        return res.status(200).json({ code: 200, ...verified });

    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = loginSchema.safeParse(req.body);

        if (!parsed.success) return res.status(400).json({ code: 400, error: parsed.error.flatten().fieldErrors });

        const tokens = await login(parsed.data);
        setRefreshCookie(res, tokens.refreshToken);
        return res.status(200).json({ code: 200, accessToken: tokens.accessToken });

    } catch (err) {
        next(err);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await me(req.id!);
        return res.status(200).json({ code: 200, ...user });

    } catch (err) {
        next(err);
    }
};

export const changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = changePasswordSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ code: 400, error: parsed.error.flatten().fieldErrors });

        const ok = await changePassword(req.id!, parsed.data);
        setRefreshCookie(res, ok.refreshToken);
        return res.status(200).json({ code: 200, ok: true, accessToken: ok.accessToken });

    } catch (err) {
        next(err);
    }
};

export const changeUserName = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = changeNameSchema.safeParse(req.body);

        if (!parsed.success) return res.status(400).json({ code: 400, error: parsed.error.flatten().fieldErrors });

        const ok = await changeName(req.id!, parsed.data);
        return res.status(200).json({ code: 200, ...ok });

    } catch (err) {
        next(err);
    }
};

export const refreshUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies[REFRESH_COOKIE];
        if (!token) return res.status(400).json({ code: 400, error: 'Не удалось получить токен' });

        const tokens = await refresh(token);
        setRefreshCookie(res, tokens.refreshToken);
        return res.status(200).json({ code: 200, accessToken: tokens.accessToken });

    } catch (err) {
        next(err);
    }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const ok = await logout(req.id!);
        clearRefreshCookie(res);
        return res.status(200).json({ code: 200, ...ok });

    } catch (err) {
        next(err);
    }
};