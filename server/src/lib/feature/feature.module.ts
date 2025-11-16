import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from './feature.entity';
import { FeatureService } from './feature.service';
import { FeatureRepository } from './feature.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Feature])],
    providers: [FeatureService, FeatureRepository],
    exports: [FeatureService],
})
export class FeatureModule {}
