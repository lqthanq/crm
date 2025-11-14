export const parseToBoolean = (value: any): boolean => {
    if (value === undefined || value === null) {
        return false;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'number') {
        return value !== 0;
    }

    if (typeof value === 'string') {
        const normalized = value.toLowerCase().trim();
        if (normalized === 'true' || normalized === '1') {
            return true;
        }

        if (normalized === 'false' || normalized === '0') {
            return false;
        }
    }

    return false;
};
