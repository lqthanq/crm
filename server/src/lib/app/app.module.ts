import { Module, OnModuleInit } from '@nestjs/common';
import { SeederModule } from '../core/seeds/seeder.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CoreModule } from '../core/core.module';

@Module({
    imports: [AuthModule, CoreModule, UserModule, SeederModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements OnModuleInit {
    constructor() {}

    onModuleInit() {
        console.log('AppModule initialized, ClsService set in RequestContext');
    }
}
