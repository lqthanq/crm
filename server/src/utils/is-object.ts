export function isObject(val: unknown): val is object {
    return val !== null && val !== undefined && typeof val === 'object';
}
