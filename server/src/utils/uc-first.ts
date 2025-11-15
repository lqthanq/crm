export function ucFirst(str: string, force: boolean = true): string {
    str = force ? str.toLowerCase() : str;

    return str.replace(/^([a-zA-Z])/, (firstLetter) => firstLetter.toUpperCase());
}
