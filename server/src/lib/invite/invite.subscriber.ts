import { EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { Invite } from './invite.entity';
import moment from 'moment';
import { EInviteStatus } from 'src/contracts';

@EventSubscriber()
export class InviteSubscriber extends BaseEntityEventSubscriber<Invite> {
    listenTo() {
        return Invite;
    }

    async afterEntityLoad(entity: Invite): Promise<void> {
        try {
            if (Object.prototype.hasOwnProperty.call(entity, 'expireDate')) {
                entity.isExpired = entity.expireDate ? moment(entity.expireDate).isBefore(moment()) : false;
            }

            // Update the status based on the expiration
            entity.status = entity.isExpired ? EInviteStatus.EXPIRED : entity.status;
        } catch (error) {
            console.error('InviteSubscriber: An error occurred during the afterEntityLoad proces:', error);
        }
    }
}
