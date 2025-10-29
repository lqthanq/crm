import { MiddlewareConsumer, Module, NestModule, OnApplicationShutdown } from '@nestjs/common';
import { AppModule } from '../app/app.module';
import { ConfigModule } from 'src/config';

@Module({
    imports: [ConfigModule, AppModule],
})
export class BootstrapModule implements NestModule, OnApplicationShutdown {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply().forRoutes('*');
    }

    async onApplicationShutdown(signal: string) {
        if (signal) {
            //
            console.log(`[LOGGER] Received shutdown signal: ${signal}`);

            if (signal === 'SIGTERM') {
                console.log(`[LOGGER] SIGTERM shutting down. Please await...`);
            }
        }
    }
}
