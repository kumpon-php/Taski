import { Router } from 'express';
import type { Request, Response } from 'express';

import { db } from '../db.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { pushSubscripeSchema, pushUnsubscribeSchema } from '../schemas/push.schema.js';

const pushRouter = Router();

pushRouter.get('/vapid-public', (req: Request, res: Response) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

pushRouter.post('/subscribe', authMiddleware, async (req: Request, res: Response) => {
    const { endpoint, keys } = req.body;
    const userId = req.id!;

    const existing = await db.orm.public.PushSubscription
        .where({ endpoint })
        .first();

    console.log(existing);

    if (existing) {
        if (existing.userId !== userId) {
            await db.orm.public.PushSubscription
                .where({ endpoint })
                .update({ userId, p246dh: keys.p246dh, auth: keys.auth });
        } else {
            console.log("[PUSH subscribe]", userId, endpoint.slice(0, 40));
            const row = await db.orm.public.PushSubscription.create({
                userId,
                endpoint,
                p246dh: keys.p246dh,
                auth: keys.auth
            });
            console.log("[PUSH saved]", row);
        }
    }

    res.status(201).json({ ok: true });
});

pushRouter.delete('/subscripe', authMiddleware, async (req: Request, res: Response) => {
    const { endpoint } = req.body;

    const userId = req.id;

    await db.orm.public.PushSubscription
        .where({ endpoint, userId })
        .delete();

    res.status(200).json({ ok: true });
});

export default pushRouter;