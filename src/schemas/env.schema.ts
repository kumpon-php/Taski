import 'dotenv/config';
import { z } from 'zod';

const env = z.object({
    PORT: z.coerce.number('EXPECTED NUMBER FOR PORT').min(1000, 'PORT IS TOO SMALL'),
    URL: z.coerce.string('EXPRECTED STRING FOR DB URL').min(10, 'DB URL IS TOO SHORT'),
    SECRET: z.coerce.string('EXPECTED STRING FOR JWT SECRET').min(20, 'SECRET IS TOO SHORT'),
    MAIL_HOST: z.coerce.string('EXPECTED STRING FOR MAIL HOST').min(10, 'MAIL HOST IS TOO SHORT'),
    MAIL_PORT: z.coerce.number('EXPECTED NUMBER FOR MAIL PORT').min(465, 'MAIL PORT IS TOO SMALL'),
    MAIL_USER: z.coerce.string('EXPECTED STRING FOR MAIL USER'),
    MAIL_PASS: z.coerce.string('EXPECTED STRING FOR MAIL PASSWORD').min(9, 'MAIL PASSWORD IS TOO SHORT'),
    MAIL_SECURE: z.coerce.boolean('EXPECTED TRUE/FALSE FOR MAIL SECURE'),
});

const CONFIG = env.parse({
    PORT: process.env.PORT,
    URL: process.env.DATABASE_URL,
    SECRET: process.env.JWT_SECRET,
    MAIL_HOST: process.env.SMTP_HOST,
    MAIL_PORT: process.env.SMTP_PORT,
    MAIL_SECURE: process.env.SMTP_SECURE,
    MAIL_USER: process.env.SMTP_USER,
    MAIL_PASS: process.env.SMTP_PASS,
});

export const {
    PORT,
    URL,
    SECRET,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_SECURE,
    MAIL_USER,
    MAIL_PASS
    } = CONFIG;