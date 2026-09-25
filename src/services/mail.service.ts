import nodemailer from 'nodemailer';

// SCHEMAS
import { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_PASS, MAIL_USER } from "../schemas/env.schema.js";
import type { Email, Code } from '../schemas/user.schema.js';

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
    logger: false,
    debug: false,
});

export const sendCode = async (toEmail: Email, code: Code) => {
    const mailOptions = {
        from: '"SellBySell" <kumpon.mail@yandex.ru>',
        to: toEmail,
        subject: 'SellBySell | Код подтверждения',
        html: `<p>Ваш код: <b>${code}</b></p>
        <p>Код действителен в течение 15 минут.</p>`
    };

    try {
        await transporter.verify();
        const info = await transporter.sendMail(mailOptions);
        console.log(info.messageId, info.response);
    } catch (err) {
        throw err;
    }
};