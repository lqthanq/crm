import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface IApiServerConfigurationOptions {
    host?: string;

    port?: number | string;

    baseUrl?: string;
}

export interface IApplicationPluginConfig {
    apiConfigOptions: IApiServerConfigurationOptions;

    dbConnectionOptions: TypeOrmModuleOptions;
}
