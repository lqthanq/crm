import { ucFirst } from './uc-first';

export function extractNameFromEmail(email: string): string {
    if (email) {
        const namePart = email.substring(0, email.lastIndexOf('@'));
        return ucFirst(namePart);
    }

    return '';
}
