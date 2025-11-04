import { EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber extends BaseEntityEventSubscriber<User> {
    listenTo() {
        return User;
    }

    /**
     * Called after the entity is loaded from the database
     */
    async afterEntityLoad(entity: User): Promise<void> {
        try {
            // Combine first name and last name into a full name, if they exist.
            entity.name = [entity.firstName, entity.lastName].filter(Boolean).join(' ');

            // Set isEmailVerified to true if the emailVerifiedAt property exists and has a truthy value.
            if (Object.prototype.hasOwnProperty.call(entity, 'emailVerifiedAt')) {
                entity.isEmailVerified = !!entity.emailVerifiedAt;
            }
        } catch (error) {
            console.error('Error in UserSubscriber afterEntity hook:', error);
        }
    }
}
