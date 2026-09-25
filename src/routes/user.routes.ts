import { Router } from 'express';

// CONTROLLERS
import {
    createUser,
    verifyUser,
    loginUser,
    getMe,
    changeUserPassword,
    changeUserName,
    refreshUserToken,
    logoutUser,
    newCodeRequest
    } from '../controllers/user.controller.js';

// MIDDLEWARE
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { limiter } from '../middlewares/limiter.middleware.js';

const userRouter = Router();

userRouter.post('/', limiter, createUser);
userRouter.post('/verify', limiter, verifyUser);
userRouter.post('/login', limiter, loginUser);
userRouter.post('/refresh', limiter, refreshUserToken);
userRouter.post('/code', limiter, newCodeRequest);
// AUTHORIZED ONLY
userRouter.get('/me', authMiddleware, getMe);
userRouter.patch('/changePassword', authMiddleware, limiter, changeUserPassword);
userRouter.patch('/changeName', authMiddleware, changeUserName);
userRouter.post('/logout', authMiddleware, logoutUser);

export default userRouter;