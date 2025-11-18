import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrganizationProjectCreateCommand } from '../organization-project.create.command';
import { OrganizationProjectService } from '../../organization-project.service';
import { IOrganizationProject } from 'src/contracts';

@CommandHandler(OrganizationProjectCreateCommand)
export class OrganizationProjectCreateHandler implements ICommandHandler<OrganizationProjectCreateCommand> {
    constructor(private readonly _organizationProjectService: OrganizationProjectService) {}

    public async execute(command: OrganizationProjectCreateCommand): Promise<IOrganizationProject> {
        const { input } = command;

        // Create the organization project using the input data
        const project = await this._organizationProjectService.create(input);

        // Initialize associated entities for created project

        return project;
    }
}
