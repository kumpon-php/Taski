import { z } from 'zod';

export const pushSubscripeSchema = z.object({
    endpoint: z.string().url(),
    keys: z.object({
        p256dh: z.string().min(10),
        auth: z.string().min(8)
    }),
});

export const pushUnsubscribeSchema = z.object({
    endpoint: z.string().url(),
});

export type PushSubscripeInput = z.infer<typeof pushSubscripeSchema>;