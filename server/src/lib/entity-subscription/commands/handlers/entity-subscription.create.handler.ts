import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntitySubscriptionCreateCommand } from '../entity-subscription.create.command';
import { EntitySubscriptionService } from '../../entity-subscription.service';
import { IEntitySubscription } from 'src/contracts';

@CommandHandler(EntitySubscriptionCreateCommand)
export class EntitySubscriptionCreateHandler implements ICommandHandler<EntitySubscriptionCreateCommand> {
    constructor(private readonly entitySubscriptionService: EntitySubscriptionService) {}

    public async execute(command: EntitySubscriptionCreateCommand): Promise<IEntitySubscription> {
        const { input } = command;

        return await this.entitySubscriptionService.create(input);
    }
}
