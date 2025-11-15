import { EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { OrganizationTeamEmployee } from './organization-team-employee.entity';

@EventSubscriber()
export class OrganizationTeamEmployeeSubscriber extends BaseEntityEventSubscriber<OrganizationTeamEmployee> {
    listenTo() {
        return OrganizationTeamEmployee;
    }
}
