import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrganizationTeamCreateCommand } from '../organization-team.create.command';
import { OrganizationTeamService } from '../../organization-team.service';
import { IOrganizationTeam } from 'src/contracts';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(OrganizationTeamCreateCommand)
export class OrganizationTeamCreateHandler implements ICommandHandler<OrganizationTeamCreateCommand> {
    constructor(private readonly _organizationTeamService: OrganizationTeamService) {}

    public async execute(command: OrganizationTeamCreateCommand): Promise<IOrganizationTeam> {
        try {
            const { input } = command;
            const team = await this._organizationTeamService.create(input);

            // Execute related commands in the background

            return team;
        } catch (error) {
            throw new BadRequestException(`Error while creating organization team: ${error.message}`);
        }
    }
}
