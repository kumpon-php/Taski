import type { Request, Response, NextFunction } from 'express';

// SCHEMAS
import {
    taskSchema,
    taskUpdateSchema,
    searchOptions
    } from '../schemas/task.schema.js';

// SERVICES
import {
    create,
    getTasks,
    getTask,
    update,
    remove
    } from '../services/task.service.js';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = taskSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ code: 400, error: parsed.error.flatten().fieldErrors });

        const task = await create(req.id!, parsed.data);
        return res.status(201).json({ code: 201, ...task });

    } catch (err) {
        next(err);
    }
};

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = searchOptions.safeParse(req.query);
        if (!parsed.success) return res.status(400).json({ code: 400, error: parsed.error.flatten().fieldErrors });

        const tasks = await getTasks(req.id!, parsed.data);
        return res.status(200).json({ code: 200, ...tasks });

    } catch (err) {
        next(err);
    }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const taskId = Number(req.params.id);
        if (!taskId) return res.status(400).json({ code: 400, error: 'Не удалось получить id задачи' });

        const task = await getTask(req.id!, taskId);
        return res.status(200).json({ code: 200, ...task });

    } catch (err) {
        next(err);
    }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const taskId = Number(req.params.id);
        if (!taskId) return res.status(400).json({ code: 400, error: 'Не удалось получить id задачи' });

        const parsed = taskUpdateSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ code: 400, error: parsed.error.flatten().fieldErrors });

        const updated = await update(req.id!, taskId, parsed.data);
        return res.status(200).json({ code: 200, ...updated });

    } catch (err) {
        next(err);
    }
};

export const removeTask = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const taskId = Number(req.params.id);
        if (!taskId) return res.status(400).json({ code: 400, error: 'Не удалось получить id задачи' });

        const removed = await remove(req.id!, taskId);
        return res.status(200).json({ code: 200, ...removed });

    } catch (err) {
        next(err);
    }
};