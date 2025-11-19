import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { RequestContext } from 'src/lib/core';
import { OrganizationTeamRepository } from 'src/lib/organization-team/organization-team.repository';
import { isEmpty } from 'src/utils';
import { Not } from 'typeorm';

@ValidatorConstraint({ name: 'IsTeamAlreadyExist', async: true })
@Injectable()
export class TeamAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(readonly organizationTeamRepository: OrganizationTeamRepository) {}

    /**
     * Validates if a given name is not already in use in the specified organization.
     *
     * @param name
     * @param args
     * @returns
     */
    async validate(name: any, args: ValidationArguments): Promise<boolean> {
        if (isEmpty(name)) {
            return true;
        }

        const payload = args.object as { organizationId?: string; organization?: { id: string }; id?: string };
        const organizationId = payload.organizationId || payload.organization?.id;

        if (!organizationId) {
            // Validation is irrelevant without an organization ID
            return true;
        }

        const tenantId = RequestContext.currentTenantId();
        const queryConditions: Record<string, any> = { name, organizationId, tenantId };

        if (payload.id) {
            queryConditions.id = Not(payload.id); // Exclude current entity from check
        }

        try {
            return !(await this.organizationTeamRepository.findOneByOrFail(queryConditions));
        } catch (error) {
            // Not existing team found.
            return true;
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const { value } = validationArguments || { value: '' };

        return `The team name '${value}' is already in use. Please choose a different name.`;
    }
}
