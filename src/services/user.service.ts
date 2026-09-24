import { db } from '../db';

// TYPES
import type {
    UserDto,
    UserLogin,
    Code,
    Email,
    ChangePassword,
    ChangeName,
    VerificationData
    } from '../schemas/user.schema';

// ERRORS
import {
    EmailTakenError,
    InvalidCodeError,
    CodeExpiredError,
    UserAlreadyVerifiedError,
    WrongCredentialsError,
    UserNotVerifiedError,
    UnauthorizedError,
    UserNotFoundError,
    WrongOldPasswordError,
    BadPasswordError,
    BadNameError
    } from '../errors/app.errors';

// ADDITIONAL
import bcrypt from 'bcrypt';
import { enqueueCode } from '../mail.queue';
import { signJWT, generateRefreshToken, createTokenHash, saveToken, refresh } from './token.service';
import { Temporal } from 'temporal-polyfill';

export const create = async (code: Code, data: UserDto) => {
    try {

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await db.transaction(async (tx) => {
            const user = await tx.orm.public.User.create({
                name: data.name,
                email: data.email,
                passwordHash
            });

            const codeHash = await bcrypt.hash(code, 10);

            const expiresAt = Temporal.Now.instant().add({ minutes: 15 });
            await tx.orm.public.Code.create({ userEmail: data.email, codeHash, expiresAt });

            return user;
        });

        enqueueCode(data.email, code);

        return { id: user.id, email: user.email };

    } catch (err: any) {
        if (err.sqlState === '23505') throw new EmailTakenError();
        throw err;
    }
};

export const verify = async (data: VerificationData) => {
    
    const getUserCode = await db.orm.public.Code
        .where({ userEmail: data.email })
        .select('codeHash', 'expiresAt')
        .first();

    if (!getUserCode) throw new InvalidCodeError();

    const codeCompare = await bcrypt.compare(data.code, getUserCode.codeHash);

    if (!codeCompare) throw new InvalidCodeError();

    // DELETE CODE IF EXPIRED
    if (Temporal.Instant.compare(getUserCode.expiresAt, Temporal.Now.instant()) <= 0) {

        await db.orm.public.Code
            .where({ userEmail: data.email })
            .delete();
        
        throw new CodeExpiredError();
    }

    // VERIFY USER
    const user = await db.orm.public.User
        .where({ email: data.email })
        .select('id', 'verified')
        .first();
        
    if (!user) throw new UserNotFoundError();

    await db.orm.public.User
        .where({ id: user.id })
        .update({ verified: true });

    // DELETE CODE AFTER VERIFICATION
    await db.orm.public.Code
        .where({ userEmail: data.email })
        .deleteAll();

    return { verified: true };

};

export const newCode = async (data: VerificationData) => {
    const user = await db.orm.public.User
        .where({ email: data.email })
        .first();

    if (!user) throw new UserNotFoundError();
    if (user.verified) throw new UserAlreadyVerifiedError();

    // DELETE PREVIOUS CODES
    await db.orm.public.Code
        .where({ userEmail: data.email })
        .deleteAll();

    // SEND NEW CODE BY EMAIL
    enqueueCode(data.email, data.code);

    const codeHash = await bcrypt.hash(data.code, 10);
    const expiresAt = Temporal.Now.instant().add({ minutes: 15 });
    
    // SEND THE CODE TO DB
    await db.orm.public.Code.create({ userEmail: data.email, codeHash, expiresAt });

    return { ok: true };

};

export const login = async (data: UserLogin) => {
    const user = await db.orm.public.User
        .where({ email: data.email })
        .select('id', 'email', 'passwordHash', 'verified')
        .first();

    if (!user) throw new WrongCredentialsError();

    const comparedPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!comparedPassword) throw new WrongCredentialsError();
    if (!user.verified) throw new UserNotVerifiedError();

    const refreshToken = await generateRefreshToken();
    await saveToken(user.id, await createTokenHash(refreshToken));
    const accessToken = signJWT(user.id);

    return { accessToken, refreshToken };

};

export const me = async (id: number) => {
    const user = await db.orm.public.User
        .where({ id })
        .select('id', 'email', 'name')
        .first();

    if (!user) throw new UnauthorizedError();

    return user;
};

export const changePassword = async (id: number, data: ChangePassword) => {
    const currentPassword = await db.orm.public.User
        .where({ id })
        .select('passwordHash')
        .first();

    if (!currentPassword) throw new UserNotFoundError();
        
    const comparedPassword = await bcrypt.compare(data.oldPassword, currentPassword.passwordHash);
    if (!comparedPassword) throw new WrongOldPasswordError();

    const comparedPreviousPassword = await bcrypt.compare(data.newPassword, currentPassword.passwordHash);
    if (comparedPreviousPassword) throw new BadPasswordError();

    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    await db.orm.public.RefreshToken
        .where({ userId: id })
        .deleteAll();

    const tokens = {
        accessToken: signJWT(id),
        refreshToken: generateRefreshToken()
    };

    await saveToken(id, await createTokenHash(tokens.refreshToken));

    await db.orm.public.User
        .where({ id })
        .update({ passwordHash });

    return tokens;
    
};

export const changeName = async (id: number, data: ChangeName) => {
    const userName = await db.orm.public.User
        .where({ id })
        .select('id', 'name')
        .first();

    if (!userName) throw new UserNotFoundError();

    const newName = data.name;
    
    if (userName.name === newName) throw new BadNameError();

    await db.orm.public.User
        .where({ id: userName.id })
        .update({ name: newName });

    return { ok: true };
};

export const logout = async (userId: number) => {
    await db.orm.public.RefreshToken
        .where({ userId })
        .deleteAll();
    
    return { ok: true };
};