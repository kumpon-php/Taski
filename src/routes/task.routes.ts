import { Router } from 'express';

// MIDDLEWARE
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { taskLimiter } from '../middlewares/limiter.middleware.js';

// CONTROLLERS
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    removeTask
    } from '../controllers/task.controller.js';

const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.get('/', getAllTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.post('/', taskLimiter, createTask);
taskRouter.patch('/:id', updateTask);
taskRouter.delete('/:id', removeTask);

export default taskRouter;