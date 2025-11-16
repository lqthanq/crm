import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Feature } from './feature.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeatureRepository extends Repository<Feature> {
    constructor(@InjectRepository(Feature) readonly repository: Repository<Feature>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
