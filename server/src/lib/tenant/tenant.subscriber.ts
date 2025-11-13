import { EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { Tenant } from './tenant.entity';

@EventSubscriber()
export class TenantSubscriber extends BaseEntityEventSubscriber<Tenant> {
    listenTo() {
        return Tenant;
    }
}
