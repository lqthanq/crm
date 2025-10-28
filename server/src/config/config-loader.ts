import { IApplicationPluginConfig } from 'src/common';
import { defaultConfiguration } from './default-config';

let currentAppConfig: IApplicationPluginConfig = { ...defaultConfiguration };

export function getConfig(): Readonly<IApplicationPluginConfig> {
    return Object.freeze({ ...currentAppConfig });
}
