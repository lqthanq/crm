import { ICommand } from '@nestjs/cqrs';
import { IEntitySubscriptionCreateInput } from 'src/contracts';

export class EntitySubscriptionCreateCommand implements ICommand {
    static readonly type = '[Subscription] Create';

    constructor(public readonly input: IEntitySubscriptionCreateInput) {}
}
