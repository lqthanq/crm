import { IEvent } from '@nestjs/cqrs';
import { IEntitySubscriptionCreateInput } from 'src/contracts';

export class CreateEntitySubscriptionEvent implements IEvent {
    constructor(readonly input: IEntitySubscriptionCreateInput) {}
}
