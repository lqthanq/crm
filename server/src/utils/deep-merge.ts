import { deepClone } from './deep-clone';
import { isClassInstance } from './is-class-instance';
import { isPlainObject } from './is-plain-object';

export function deepMerge(target: any, source: any, depth = 0): any {
    if (!source || typeof source !== 'object') {
        return target;
    }

    // Clone target at depth 0 to void mutating original target
    if (depth === 0) {
        target = deepClone(target);
    }

    if (isPlainObject(target) && isPlainObject(source)) {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (isPlainObject(source[key])) {
                    if (!target[key]) {
                        target[key] = {};
                    }

                    if (!isClassInstance(source[key])) {
                        deepMerge(target[key], source[key], depth + 1);
                    } else {
                        target[key] = source[key];
                    }
                } else {
                    target[key] = source[key];
                }
            }
        }
    }

    return target;
}
