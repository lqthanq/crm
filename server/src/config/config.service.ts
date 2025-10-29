import { Injectable, Logger } from '@nestjs/common';
import { environment } from './environment/environment';
import { IApplicationPluginConfig } from 'src/common';
import { getConfig } from './config-loader';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IEnvironment } from './environment/environment.interface';

@Injectable()
export class ConfigService {
    private readonly environment = environment;
    private readonly logger = new Logger(ConfigService.name);
    private config: Partial<IApplicationPluginConfig>;

    constructor() {
        void this.initConfig();
    }

    private async initConfig(): Promise<void> {
        this.config = getConfig();

        if (this.environment.env && Object.keys(this.environment.env).length > 0) {
            Object.entries(this.environment.env).forEach(([key, value]) => {
                process.env[key] = value;
            });
        }

        this.logger.log(`Is Production: ${this.environment.production}`);
        return Promise.resolve();
    }

    public getConfig(): Readonly<Partial<IApplicationPluginConfig>> {
        return Object.freeze({ ...this.config });
    }

    public getConfigValue<K extends keyof IApplicationPluginConfig>(key: K): Readonly<IApplicationPluginConfig[K]> {
        if (!(key in this.config)) {
            throw new Error(`Configuration key "${String(key)}" not found.`);
        }

        return this.config[key] as Readonly<IApplicationPluginConfig[K]>;
    }

    get dbConnectionOptions(): Readonly<TypeOrmModuleOptions> {
        return this.config.dbConnectionOptions ?? {};
    }

    get<K extends keyof IEnvironment>(key: K): IEnvironment[K] {
        if (!(key in this.environment)) {
            throw new Error(`Environment variable "${String(key)}" is not defined.`);
        }

        return this.environment[key];
    }
}
