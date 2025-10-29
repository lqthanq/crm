export function isPlainObject(item: unknown): boolean {
    return !!item && typeof item === 'object' && !Array.isArray(item);
}
