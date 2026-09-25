import { sendCode } from "./services/mail.service.js";

type Job = {
    email: string,
    code: string
};

const JOBS: Job[] = [];

export const enqueueCode = (email: string, code: string) => {
    JOBS.push({ email, code });
};

export const startMailWorker = () => {
    setInterval(async () => {
        const job = JOBS.shift();
        if (!job) return;

        try {
            await sendCode(job.email, job.code);
        } catch (err) {
            console.error(`[MAIL WORKER FAILED] ${job.email}`, err);
            JOBS.push(job);
        }

    }, 1000);
}