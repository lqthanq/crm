import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { EntitySubscription } from './entity-subscription.entity';
import { EntitySubscriptionRepository } from './entity-subscription.repository';
import { IEntitySubscription, IEntitySubscriptionCreateInput } from 'src/contracts';
import { RequestContext } from '../core/context';

@Injectable()
export class EntitySubscriptionService extends TenantAwareCrudService<EntitySubscription> {
    constructor(readonly entitySubscriptionRepository: EntitySubscriptionRepository) {
        super(entitySubscriptionRepository);
    }

    /**
     * Creates a new subscription for the specified entity and user.
     * @param input
     * @returns
     */
    async create(input: IEntitySubscriptionCreateInput): Promise<IEntitySubscription> {
        try {
            const tenantId = RequestContext.currentTenantId() ?? input.tenantId;
            const user = RequestContext.currentUser();
            const employeeId = user?.employeeId;

            const { entity, entityId, organizationId } = input;

            // Check if the subscription already exists
            try {
                const entitySubscription = await this.findOneByOptions({
                    where: { employeeId, entity, entityId, organizationId, tenantId },
                });

                if (entitySubscription) {
                    return entitySubscription;
                }
            } catch (e) {}

            // Create a new subscription if none exists
            return await super.create({ ...input, employeeId, tenantId });
        } catch (error) {
            console.log('Error creating subscription:', error);
            throw new BadRequestException('Failed to create subscription', error);
        }
    }
}
