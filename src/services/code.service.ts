import { randomInt } from "node:crypto";

export const generateCode = (length: number): string => {
    let code = '';

    for (let i = 0; i < length; i++) {
        code += String(randomInt(0, 10));
    }

    return code;
};