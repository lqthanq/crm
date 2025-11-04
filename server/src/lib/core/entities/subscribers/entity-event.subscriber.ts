import { EntityManager, EntitySubscriberInterface, LoadEvent } from 'typeorm';

export abstract class EntityEventSubscriber<Entity> implements EntitySubscriberInterface<Entity> {
    /**
     * Invoked when an entity is loaded in TypeORM
     */
    async afterLoad(entity: Entity, event?: LoadEvent<Entity>): Promise<void> {
        try {
            if (entity) {
                await this.afterEntityLoad(entity, event?.manager);
            }
        } catch (error) {
            console.error('EntityEventSubscriber: Error in afterLoad:', error);
        }
    }

    /**
     * Abstract method for processing after an entity is loaed. Implement in subclasses for custom behavior.
     */
    protected abstract afterEntityLoad(entity: Entity, em?: EntityManager): Promise<void>;
}
