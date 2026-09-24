import 'temporal-polyfill/global'; // FOR DATETIME PRISMA
import { db, runtime } from './db';
import { PORT } from './schemas/env.schema';

import express from 'express';
import type { Request, Response } from 'express';

// MIDDLEWARE
import { errorHandler } from './middlewares/errors.middleware';

// ADDITIONAL
import { startMailWorker } from './mail.queue';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';

const app = express();
app.use(helmet());
app.use(cors({
    origin: *,
    //credentials: true, UNCOMMENT IF FRONTEND EXISTS
}));

// ROUTES
import userRouter from './routes/user.routes';
import taskRouter from './routes/task.routes';

app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);
app.use('/task', taskRouter);

app.get('/alive', async (req: Request, res: Response) => {
    try {
        await db.orm.public.User.limit(1).all();
        return res.status(200).json({ code: 200, alive: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ code: 500, error: 'UNKNOWN ERROR | CHECK LOGS' });
    }
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ code: 404, error: 'not found' });
});

app.use(errorHandler);
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
startMailWorker();