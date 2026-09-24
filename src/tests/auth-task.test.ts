import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { runtime, db } from '../db';
import { create as createTask, getTask } from '../services/task.service';
import { UserNotFoundError, TaskNotFoundError, InvalidCodeError, UserAlreadyVerifiedError, UnauthorizedError } from '../errors/app.errors';
import { newCode, verify, me } from '../services/user.service';

import 'temporal-polyfill/global';

beforeAll(async () => {});

afterAll(async () => {
    await runtime.close();
});

const invalidData = {
    email: 'denis@kumpon.ru',
    code: '035627'
};

const validData = {
    email: 'kumpon.mail@yandex.ru',
    code: '000000'
}

it('Юзер не может запросить код для несуществующего e-mail', async () => {
    await expect(newCode(invalidData)).rejects.toBeInstanceOf(UserNotFoundError);
});

it('Подтвержденный юзер не может запросить код', async () => {
    await expect(newCode(validData)).rejects.toBeInstanceOf(UserAlreadyVerifiedError);
});

it('Некорректный код будет послан нахуй', async () => {
    await expect(verify(validData)).rejects.toBeInstanceOf(InvalidCodeError);
});

it('Несующествующий юзер будет послан нахуй', async () => {
    await expect(me(1)).rejects.toBeInstanceOf(UnauthorizedError);
});

// TASKS

const AId = 3;
const BId = 6;

it('B не может прочитать задачу A', async () => {
    const task = await createTask(AId, { title: '[AUTO-TEST] TEST', description: 'B не может читать задачу A' });
    await expect(getTask(BId, task.id)).rejects.toBeInstanceOf(TaskNotFoundError);
});