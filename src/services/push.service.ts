import webpush from 'web-push';
import { db } from '../db.js';

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export const sendPushToUser = async (userId: number, payload: {
    title: string, body: string, url?: string
}) => {
    const subs = await db.orm.public.PushSubscription
        .where({ userId })
        .all();

    const body = JSON.stringify(payload);

    await Promise.allSettled(
        subs.map(async (sub) => {
            try {
                await webpush.sendNotification({
                    endpoint: sub.endpoint,
                    keys: { p256dh: sub.p246dh, auth: sub.auth }
                },
            body);
            } catch (err: any) {
                const stale = err.statusCode === 410 || err.statusCode === 404;
                if (stale) {
                    await db.orm.public.PushSubscription
                        .where({ endpoint: sub.endpoint })
                        .delete();
                } else {
                    console.error('[PUSH]', err.statusCode, err.message);
                }
            }
        })
    );
}