import { EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { Organization } from './organization.entity';

@EventSubscriber()
export class OrganizationSubscriber extends BaseEntityEventSubscriber<Organization> {
    listenTo() {
        return Organization;
    }
}
