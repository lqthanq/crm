import { EntityManager } from 'typeorm';

export interface IEntityEventSubscriber<Entity> {
    listenTo(): Function | string | undefined;

    afterEntityLoad(entity: Entity, em: EntityManager): Promise<void>;
}
