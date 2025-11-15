import { EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { OrganizationTeam } from './organization-team.entity';

@EventSubscriber()
export class OrganizationTeamSubscriber extends BaseEntityEventSubscriber<OrganizationTeam> {
    listenTo() {
        return OrganizationTeam;
    }
}
