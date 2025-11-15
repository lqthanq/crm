import { EntityManager } from 'typeorm';

export interface IEntityEventSubscriber<Entity> {
    listenTo(): Function | string | undefined;

    beforeEntityCreate(entity: Entity, em?: EntityManager): Promise<void>;
    beforeEntityUpdate(entity: Entity, em?: EntityManager): Promise<void>;

    afterEntityCreate(entity: Entity, em?: EntityManager): Promise<void>;
    afterEntityLoad(entity: Entity, em?: EntityManager): Promise<void>;
    afterEntityUpdate(entity: Entity, em?: EntityManager): Promise<void>;
    afterEntityDelete(entity: Entity, em?: EntityManager): Promise<void>;
    afterEntitySoftRemove(entity: Entity, em?: EntityManager): Promise<void>;
}
