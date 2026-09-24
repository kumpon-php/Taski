export class AppError extends Error {
    codeStatus: number;
    constructor(message: string, codeStatus: number) {
        super(message);
        this.codeStatus = codeStatus;
        this.name = 'AppError';
    }
};

// USER ERRORS

export class EmailTakenError extends AppError {
    constructor() {
        super('Такой e-mail уже зарегистрирован', 409);
        this.name = 'EmailTakenError';
    }
};

export class InvalidCodeError extends AppError {
    constructor() {
        super('Некорректный код подтвеждения', 400);
        this.name = 'InvalidCodeError';
    }
};

export class CodeExpiredError extends AppError {
    constructor() {
        super('Код подтверждения истек', 400);
        this.name = 'CodeExpiredError';
    }
};

export class UserAlreadyVerifiedError extends AppError {
    constructor() {
        super('Пользователь уже подтвержен', 400);
        this.name = 'UserAlreadyVerifiedError';
    }
}

export class UserNotVerifiedError extends AppError {
    constructor() {
        super('Пользователь не подтвержден', 401);
        this.name = 'UserNotVerifiedError';
    }
};

export class WrongCredentialsError extends AppError {
    constructor() {
        super('Неправильный логин или пароль', 401);
        this.name = 'WrongCredentialsError';
    }
};

export class UnauthorizedError extends AppError {
    constructor() {
        super('Не авторизован', 401);
        this.name = 'UnauthorizedError';
    }
};

export class UserNotFoundError extends AppError {
    constructor() {
        super('Пользователь не найден', 404);
        this.name = 'UserNotFoundError';
    }
};

export class WrongOldPasswordError extends AppError {
    constructor() {
        super('Неправильный актуальный пароль', 401);
        this.name = 'WrongOldPasswordError';
    }
};

export class BadPasswordError extends AppError {
    constructor() {
        super('Новый пароль совпадает с предыдущим', 400);
        this.name = 'BadPasswordError';
    }
};

export class BadNameError extends AppError {
    constructor() {
        super('Новое имя совпадает с предыдущим', 400);
        this.name = 'BadNameError';
    }
};

export class InvalidTokenError extends AppError {
    constructor() {
        super('Некорректный или истекший токен', 401);
        this.name = 'InvalidTokenError';
    }
};

// TASK ERRORS

export class TaskNotFoundError extends AppError {
    constructor() {
        super('Задача не найдена', 404);
        this.name = 'TaskNotFoundError';
    }
};