import { db } from '../db.js';

// TYPES
import type { TaskDto, TaskUpdate, TaskSearchOptions } from '../schemas/task.schema.js';

// ERRORS
import { TaskNotFoundError } from '../errors/app.errors.js';

export const create = async (userId: number, data: TaskDto) => {

    const task = await db.orm.public.Task.create({
        title: data.title,
        description: data.description ?? null,
        highPriority: data.highPriority ?? false,
        userId
    });

    return { id: task.id, createdAt: task.createdAt };
};

export const getTasks = async (userId: number, options: TaskSearchOptions) => {
    const tasks = await db.orm.public.Task
        .where({ userId, deleted: false })
        .select('id', 'title', 'description', 'done', 'createdAt', 'highPriority')
        .orderBy((t) => t.id.asc())
        .offset((options.page - 1) * options.limit)
        .limit(options.limit)
        .all();

    const total = await db.orm.public.Task
        .where({ userId, deleted: false })
        .aggregate((t) => ({ total: t.count() }));

    return {
        page: options.page,
        limit: options.limit,
        ...total,
        tasks
    };

};

export const getTask = async (userId: number, id: number) => {
    const task = await db.orm.public.Task
        .where({ userId, id, deleted: false })
        .select('id', 'title', 'description', 'done', 'createdAt', 'highPriority')
        .first();

    if (!task) throw new TaskNotFoundError();

    return task;
};

export const update = async (userId: number, id: number, data: TaskUpdate) => {
    const task = await db.orm.public.Task
        .where({ id, userId, deleted: false })
        .first();

    if (!task) throw new TaskNotFoundError();

    const updated = await db.orm.public.Task
        .where({ id: task.id })
        .select('id', 'title', 'description', 'done', 'highPriority', 'createdAt')
        .update({
            title: data!.title ?? task.title,
            description: data!.description ?? task.description,
            done: data!.done ?? task.done,
            highPriority: data?.highPriority ?? task.highPriority
        });

    return updated;
};

export const remove = async (userId: number, id: number) => {
    const task = await db.orm.public.Task
        .where({ userId, id, deleted: false })
        .first();

    if (!task) throw new TaskNotFoundError();

    await db.orm.public.Task
        .where({ id: task.id })
        .update({ deleted: true });

    return { id: task.id };
};