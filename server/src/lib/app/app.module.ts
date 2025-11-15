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
import { TenantModule } from '../tenant/tenant.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '../core/interceptors/transform.interceptor';
import { CacheModule } from '@nestjs/cache-manager';
import { EmployeeModule } from '../employee/employee.module';
import { OrganizationModule } from '../organization/organization.module';

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: { mount: false },
        }),
        CacheModule.register({ isGlobal: true }),
        AuthModule,
        CoreModule,
        UserModule,
        SeederModule,
        TenantModule,
        EmployeeModule,
        OrganizationModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
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
