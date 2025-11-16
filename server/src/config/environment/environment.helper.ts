import * as dotenv from 'dotenv';
dotenv.config();

export const isFeatureEnabled = (featureKey: string): boolean => {
    return process.env[featureKey] === 'false' ? false : true;
};
