import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'src/config';
import { ConnectionEntityManager } from './connection-entity-manager';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                const dbConnectionOptions = configService.getConfigValue('dbConnectionOptions');
                return Promise.resolve(dbConnectionOptions);
            },
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
    ],
    providers: [ConnectionEntityManager],
    exports: [ConnectionEntityManager],
})
export class DatabaseModule {}
