import { ALPHA_NUMERIC_CODE_LENGTH } from 'src/constants';

export function generateAlphaNumericCode(length: number = ALPHA_NUMERIC_CODE_LENGTH) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * characters.length);
        code += characters[index];
    }

    return code;
}
