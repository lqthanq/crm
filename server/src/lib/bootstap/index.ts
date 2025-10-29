import { INestApplication, Type } from '@nestjs/common';
import chalk from 'chalk';
import { EntitySubscriberInterface } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { IApiServerConfigurationOptions, IApplicationPluginConfig } from 'src/common';
import { defineConfig, getConfig } from 'src/config';

import { coreEntities } from '../core/entities';
import { coreSubscribers } from '../core/subscribers';
import { AppModule } from '../app/app.module';
import { AppService } from '../app/app.service';

export async function bootstrap(pluginConfig?: Partial<IApplicationPluginConfig>): Promise<INestApplication | void> {
    console.time(chalk.yellow('✅ Total Application Bootstrap Time'));

    await preBootstrapApplicationConfig(pluginConfig!);

    console.time(chalk.yellow('✔ Create NestJS Application Time'));
    const { BootstrapModule } = await import('./bootstrap.module');

    const app = await NestFactory.create<NestExpressApplication>(BootstrapModule, {
        logger: ['log', 'error', 'debug', 'verbose'],
        bufferLogs: true,
    });

    console.timeEnd(chalk.yellow('✔ Create NestJS Application Time'));

    app.set('query parser', 'extended');

    app.set('trust proxy', true);

    // Starts listening for shutdown hooks
    app.enableShutdownHooks();

    // Handle uncaught exceptions and unhandled rejections
    process.on('uncaughtException', handleUncaughtException);
    process.on('unhandledRejection', handleUnhandledRejection);

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    const service = app.select(AppModule).get(AppService);

    console.log('get service');
    await service.seedDBIfEmpty();

    // Start the server
    const { port = 3000, host = '0.0.0.0' } = pluginConfig?.apiConfigOptions as IApiServerConfigurationOptions;
    console.log(chalk.green(`Configured Host: ${host}`));
    console.log(chalk.green(`Configured Port: ${port}`));

    await app.listen(port, host, () => {
        console.log(`Application is running on http://${host}:${port}`);
    });

    console.timeEnd(chalk.yellow('✅ Total Application Bootstrap Time'));

    return app;
}

export async function preBootstrapApplicationConfig(applicationConfig: Partial<IApplicationPluginConfig>) {
    console.time(chalk.yellow('✅ Pre Bootstrap Application Config Time'));

    if (Object.keys(applicationConfig).length > 0) {
        await defineConfig(applicationConfig);
    }

    logDBConfig();

    await defineConfig({
        dbConnectionOptions: {
            entities: coreEntities,
            subscribers: coreSubscribers,
        },
    });

    console.timeEnd(chalk.yellow('✅ Pre Bootstrap Application Config Time'));
}

export function preBootstrapRegisterEntities(config: Partial<IApplicationPluginConfig>): Array<Type<any>> {
    return coreEntities;
}

function logDBConfig() {
    const config = getConfig();
    console.log(chalk.green(`DB Config: ${JSON.stringify(config.dbConnectionOptions)}`));
}

/**
 * Handle uncaught exceptions
 */
function handleUncaughtException(error: Error) {
    console.error('Uncaught Exception Handler in Bootstrap:', error);
    setTimeout(() => {
        process.exit(1);
    }, 3000);
}

/**
 * Handles unhandled rejections.
 */
function handleUnhandledRejection(reason: any, promise: Promise<any>) {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}
