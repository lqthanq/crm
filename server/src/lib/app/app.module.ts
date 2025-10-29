import { Module, OnModuleInit } from '@nestjs/common';
import { SeederModule } from '../core/seeds/seeder.module';
import { AppService } from './app.service';

@Module({
    imports: [SeederModule],
    providers: [AppService],
})
export class AppModule implements OnModuleInit {
    constructor() {}

    onModuleInit() {
        console.log('AppModule initialized, ClsService set in RequestContext');
    }
}
