import { EntityManager } from 'typeorm';
import { IEntityEventSubscriber } from './entity-event-subscriber.types';
import { EntityEventSubscriber } from './entity-event.subscriber';

export abstract class BaseEntityEventSubscriber<Entity = any>
    extends EntityEventSubscriber<Entity>
    implements IEntityEventSubscriber<Entity>
{
    listenTo(): Function | string | undefined {
        return;
    }

    async afterEntityLoad(entity: Entity, em?: EntityManager): Promise<void> {}
}
