import { IApplicationPluginConfig } from 'src/common';
import { defaultConfiguration } from './default-config';
import { deepMerge } from 'src/utils';

let currentAppConfig: IApplicationPluginConfig = { ...defaultConfiguration };

export async function defineConfig(providedConfig: Partial<IApplicationPluginConfig>): Promise<void> {
    if (!providedConfig || typeof providedConfig !== 'object') {
        throw new Error('Invalid configuration provided. Expected a non-empty object.');
    }

    currentAppConfig = deepMerge(currentAppConfig, providedConfig);

    return Promise.resolve();
}

export function getConfig(): Readonly<IApplicationPluginConfig> {
    return Object.freeze({ ...currentAppConfig });
}
