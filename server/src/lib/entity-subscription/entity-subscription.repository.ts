import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntitySubscription } from './entity-subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EntitySubscriptionRepository extends Repository<EntitySubscription> {
    constructor(@InjectRepository(EntitySubscription) readonly repository: Repository<EntitySubscription>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
