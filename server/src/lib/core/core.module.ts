import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RequestContextMiddleware } from './context';

@Module({
    imports: [DatabaseModule],
    controllers: [],
    providers: [],
})
export class CoreModule implements NestModule {
    /**
     * Configures middleware for the application
     */
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestContextMiddleware).forRoutes('*');
    }
}
