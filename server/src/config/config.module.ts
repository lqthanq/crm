import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configs from './config';
import { ConfigService } from './config.service';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [...configs],
        }),
    ],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
