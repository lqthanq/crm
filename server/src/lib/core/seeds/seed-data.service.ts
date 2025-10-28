import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config';
import { DataSource, DataSourceOptions, EntityMetadata } from 'typeorm';
import chalk from 'chalk';

type IEntity = Pick<EntityMetadata, 'name' | 'tableName'>;

@Injectable()
export class SeedDataService {
    dataSource: DataSource;

    log = console.log;

    constructor(private readonly configService: ConfigService) {}

    overrideDBConfig = {
        logging: 'all',
        logger: 'file',
    };

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

    private handleError(error: Error, message?: string): void {
        this.log(chalk.bgRed(`🛑 ERROR: ${message ? message + '-> ' : ''} ${error ? error.message : ''}`));
        throw error;
    }
}
