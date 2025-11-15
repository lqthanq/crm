import { EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { Role } from './role.entity';

@EventSubscriber()
export class RoleSubscriber extends BaseEntityEventSubscriber<Role> {
    listenTo() {
        return Role;
    }
}
