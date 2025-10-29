import { isEmpty } from './is-empty';
import { isPlainObject } from './is-plain-object';
import { isClassInstance } from './is-class-instance';

export function deepClone<T extends string | number | any[] | object>(input: T): T {
    if (!isPlainObject(input) || isEmpty(input)) {
        return input;
    }

    if (Array.isArray(input)) {
        const output = input.map((item: T) => deepClone(item));
        return output as T;
    }

    if (isClassInstance(input)) {
        return input;
    }

    const output: object = {};
    for (const key in input as object) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
            output[key] = deepClone(input[key]) as T;
        }
    }

    return output as T;
}
