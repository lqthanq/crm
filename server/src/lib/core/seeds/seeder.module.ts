import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config';
import { SeedDataService } from './seed-data.service';

@Module({
    imports: [ConfigModule],
    providers: [SeedDataService],
    exports: [SeedDataService],
})
export class SeederModule {}
