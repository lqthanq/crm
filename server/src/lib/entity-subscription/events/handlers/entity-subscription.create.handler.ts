import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateEntitySubscriptionEvent } from '../entity-subscription.create.event';
import { IEntitySubscription } from 'src/contracts';
import { BadRequestException } from '@nestjs/common';
import { EntitySubscriptionCreateCommand } from '../../commands';

@EventsHandler(CreateEntitySubscriptionEvent)
export class CreateEntitySubscriptionHandler implements IEventHandler<CreateEntitySubscriptionEvent> {
    constructor(private readonly commandBus: CommandBus) {}

    async handle(event: CreateEntitySubscriptionEvent): Promise<IEntitySubscription> {
        try {
            const { entity, entityId, employeeId, type, organizationId, tenantId } = event.input;

            // Execute the subscription creation command.
            const subscription = await this.commandBus.execute(
                new EntitySubscriptionCreateCommand({
                    entity,
                    entityId,
                    employeeId,
                    type,
                    organizationId,
                    tenantId,
                }),
            );

            return subscription;
        } catch (error) {
            console.log(`Error while creating subscription: ${error.message}`, error);
            throw new BadRequestException('Failed to create subscription', error);
        }
    }
}
