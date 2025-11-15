import { ICommand } from '@nestjs/cqrs';
import { IOrganizationCreateInput } from 'src/contracts';

export class OrganizationCreateCommand implements ICommand {
    static readonly type = '[Organization] Create';

    constructor(public readonly input: IOrganizationCreateInput) {}
}
