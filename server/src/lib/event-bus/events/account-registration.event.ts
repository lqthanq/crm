import { User } from '../../core/entities/internal';
import { RequestContext } from '../../core/context';
import { BaseEvent } from '../base-event';

/**
 * Event class representing an account registration event.
 */
export class AccountRegistrationEvent extends BaseEvent {
    /**
     * Constructor for AccountRegistrationEvent
     */
    constructor(
        public readonly ctx: RequestContext,
        public readonly user: User,
    ) {
        super();
    }
}
