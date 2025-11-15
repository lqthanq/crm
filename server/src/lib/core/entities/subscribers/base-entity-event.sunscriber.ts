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

    async beforeEntityCreate(entity: Entity, em?: EntityManager | undefined): Promise<void> {}
    async beforeEntityUpdate(entity: Entity, em?: EntityManager | undefined): Promise<void> {}

    async afterEntityCreate(entity: Entity, em?: EntityManager | undefined): Promise<void> {}
    async afterEntityLoad(entity: Entity, em?: EntityManager): Promise<void> {}
    async afterEntityUpdate(entity: Entity, em?: EntityManager): Promise<void> {}
    async afterEntityDelete(entity: Entity, em?: EntityManager): Promise<void> {}
    async afterEntitySoftRemove(entity: Entity, em?: EntityManager): Promise<void> {}
}
