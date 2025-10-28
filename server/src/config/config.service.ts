import { Injectable, Logger } from '@nestjs/common';
import { environment } from './environment/environment';
import { IApplicationPluginConfig } from 'src/common';
import { getConfig } from './config-loader';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

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

        Object.entries(this.environment.env!).forEach(([key, value]) => {
            process.env[key] = value;
        });

        this.logger.log(`Is Production: ${this.environment.production}`);
    }

    public getConfig(): Readonly<Partial<IApplicationPluginConfig>> {
        return Object.freeze({ ...this.config });
    }

    get dbConnectionOptions(): Readonly<TypeOrmModuleOptions> {
        return this.config.dbConnectionOptions ?? {};
    }
}
