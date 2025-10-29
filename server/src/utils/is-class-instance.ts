import { isPlainObject } from './is-plain-object';

export function isClassInstance(item: any): boolean {
    return isPlainObject(item) && item.constructor.name !== 'Object';
}
