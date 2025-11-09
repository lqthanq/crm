import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import moment from 'moment';
import { DataSource, DataSourceOptions, EntityMetadata } from 'typeorm';

import { ConfigService, environment as env } from 'src/config';
import { createDefaultEmailTemplates } from 'src/lib/email-template/email-template.seed';
import { createDefaultFeatureToggle } from 'src/lib/feature/feature.seed';
import { ITenant } from 'src/contracts';
import { DEFAULT_TENANT } from 'src/lib/tenant/default-tenants';
import { createDefaultTenant } from 'src/lib/tenant/tenant.seed';

type IEntity = Pick<EntityMetadata, 'name' | 'tableName'>;

@Injectable()
export class SeedDataService {
    dataSource: DataSource;

    log = console.log;
    tenant: ITenant;

    constructor(private readonly configService: ConfigService) {}

    overrideDBConfig = {
        logging: 'all',
        logger: 'file',
    };

    public async runDefaultSeed() {
        try {
            await this.createConnection();

            await this.resetDatabase();

            await this.seedBasicDefaultData();

            await this.closeConnection();

            console.log('Database Default Seed Completed');
        } catch (error) {
            this.handleError(error);
        }
    }

    private async seedBasicDefaultData() {
        this.log(chalk.magenta(`🌱 SEEDING BASIC ${env.production ? 'PRODUCTION' : ''} DATABASE...`));

        await this.tryExecute('Default Email Template', createDefaultEmailTemplates(this.dataSource));

        // Default and internal tenant
        const tenantName = DEFAULT_TENANT;
        this.tenant = (await this.tryExecute('Tenant', createDefaultTenant(this.dataSource, tenantName))) as ITenant;

        await this.tryExecute('Default Feature Toggle', createDefaultFeatureToggle(this.dataSource, this.tenant));

        this.log(chalk.magenta(`✅ SEEDED BASIC ${env.production ? 'PRODUCTION' : ''} DATABASE...`));
    }

    private async createConnection() {
        if (!this.dataSource) {
            this.log('NOTE: DATABASE CONNECTION DOES NOT EXIST YET. NEW ONE WILL BE CREATED');
        }

        const { dbConnectionOptions } = this.configService;
        if (!this.dataSource || !this.dataSource.isInitialized) {
            try {
                this.log(chalk.green(`CONNECTING TO DATABASE...`));
                const options = {
                    ...dbConnectionOptions,
                    ...this.overrideDBConfig,
                } as DataSourceOptions;

                const dataSource = new DataSource(options);
                if (!dataSource.isInitialized) {
                    this.dataSource = await dataSource.initialize();
                    this.log(chalk.green(`✅ CONNECTED TO DATABASE!`));
                }
            } catch (error) {
                this.handleError(error, 'Unable to connect to database.');
            }
        }
    }

    private async resetDatabase() {
        this.log(chalk.green(`RESETTING DATABASE...`));

        const entities = await this.getEntities();
        if (entities) {
            await this.cleanAll(entities);
        }

        this.log(chalk.green(`✅ RESET DATABASE SUCCESSFUL`));
    }

    private async getEntities(): Promise<IEntity[] | undefined> {
        try {
            const entities: IEntity[] = [];

            this.dataSource.entityMetadatas.forEach((entity) =>
                entities.push({
                    name: entity.name,
                    tableName: entity.tableName,
                }),
            );

            return Promise.resolve(entities);
        } catch (error) {
            this.handleError(error, 'Unable to retrieve database metadata');
        }
    }

    private async cleanAll(entities: Array<IEntity>) {
        try {
            const manager = this.dataSource.manager;

            const tables = entities.map((entity) => '"' + entity.tableName + '"');
            const truncateSql = `TRUNCATE TABLE ${tables.join(',')} RESTART IDENTITY CASCADE;`;
            await manager.query(truncateSql);
        } catch (error) {
            this.handleError(error, 'Unable to clean database');
        }
    }

    private async closeConnection() {
        try {
            if (this.dataSource && this.dataSource.isInitialized) {
                await this.dataSource.destroy();
                this.log(chalk.green(`✅ DISCONNECTED TO DATABASE!`));
            }
        } catch (error) {
            this.log('NOTE: DATABASE CONNECTION DOES NOT EXIST YET. CANT CLOSE CONNECTION!');
        }
    }

    public tryExecute<T>(name: string, p: Promise<T>): Promise<T | void> {
        this.log(chalk.green(`${moment().format('DD.MM.YYYY HH:mm:ss')} SEEDING ${name}`));

        return (p as any).then(
            (x: T) => x,
            (error: Error) => {
                this.log(chalk.bgRed(`🛑 ERROR: ${error ? error.message : 'unknown'}`));
            },
        );
    }

    private handleError(error: Error, message?: string): void {
        this.log(chalk.bgRed(`🛑 ERROR: ${message ? message + '-> ' : ''} ${error ? error.message : ''}`));
        throw error;
    }
}
