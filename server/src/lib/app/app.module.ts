import { Module, OnModuleInit } from '@nestjs/common';
import { SeederModule } from '../core/seeds/seeder.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
    imports: [SeederModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements OnModuleInit {
    constructor() {}

    onModuleInit() {
        console.log('AppModule initialized, ClsService set in RequestContext');
    }
}
