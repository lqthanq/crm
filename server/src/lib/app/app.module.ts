import { Module, OnModuleInit } from '@nestjs/common';
import { SeederModule } from '../core/seeds/seeder.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CoreModule } from '../core/core.module';
import { ClsModule, ClsService } from 'nestjs-cls';
import moment from 'moment';
import { ELanguages } from 'src/contracts';
import { RequestContext } from '../core';

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: { mount: false },
        }),
        AuthModule,
        CoreModule,
        UserModule,
        SeederModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements OnModuleInit {
    constructor(private readonly clsService: ClsService) {
        // Set Monday as start of the week
        moment.updateLocale(ELanguages.ENGLISH, {
            week: { dow: 1 },
        });
    }

    onModuleInit() {
        // Set the ClsService in RequestContext on time on app start before any request
        RequestContext.setClsService(this.clsService);
        console.log('AppModule initialized, ClsService set in RequestContext');
    }
}
