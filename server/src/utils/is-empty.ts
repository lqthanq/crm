export function isEmpty(item: any): boolean {
    if (Array.isArray(item)) {
        const filteredArray = item.filter((val) => !isEmpty(val));

        return filteredArray.length === 0;
    } else if (item && typeof item === 'object') {
        const shallowCopy = { ...item };

        for (const key in shallowCopy) {
            if (shallowCopy[key] === null || shallowCopy[key] === undefined || shallowCopy[key] === '') {
                delete shallowCopy[key];
            }
        }

        return Object.keys(shallowCopy).length === 0;
    }

    const strValue = (item + '').toLowerCase();

    console.log('strValue', strValue);
    return !strValue || strValue === 'null' || strValue === 'undefined';
}
