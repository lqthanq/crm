import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitySubscription } from './entity-subscription.entity';
import { EntitySubscriptionService } from './entity-subscription.service';
import { EntitySubscriptionRepository } from './entity-subscription.repository';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';

@Global()
@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([EntitySubscription])],
    providers: [EntitySubscriptionService, EntitySubscriptionRepository, ...CommandHandlers, ...EventHandlers],
    exports: [EntitySubscriptionService],
})
export class EntitySubscriptionModule {}
