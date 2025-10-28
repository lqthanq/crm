import { ApplicationPluginConfig } from 'src/common';
import { typeOrmConnectionConfig } from 'src/config';

export const devConfig: ApplicationPluginConfig = {
    apiConfigOptions: {
        host: process.env.API_HOST,
        port: process.env.API_PORT,
        baseUrl: process.env.API_BASE_URL,
    },

    dbConnectionOptions: {
        retryAttempts: 100,
        retryDelay: 3000,
        ...typeOrmConnectionConfig,
    },
};
