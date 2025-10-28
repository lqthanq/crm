import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface ApiServerConfigurationOptions {
    host?: string;

    port?: number | string;

    baseUrl?: string;
}

export interface ApplicationPluginConfig {
    apiConfigOptions: ApiServerConfigurationOptions;

    dbConnectionOptions: TypeOrmModuleOptions;
}
