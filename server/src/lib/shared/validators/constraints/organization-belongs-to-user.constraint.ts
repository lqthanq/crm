import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ID, IOrganization } from 'src/contracts';
import { RequestContext } from 'src/lib/core';
import { UserOrganizationRepository } from 'src/lib/user-organization/user-organization.repository';
import { isEmpty } from 'src/utils';

/**
 * Validator constraint for checking if a user belongs to the organization
 */
@ValidatorConstraint({ name: 'IsOrganizationBelongsToUser', async: true })
@Injectable()
export class OrganizationBelongsToUserConstraint implements ValidatorConstraintInterface {
    constructor(readonly userOrganizationRepository: UserOrganizationRepository) {}

    /**
     * Validates if the user belongs to the organization.
     *
     * @param value
     * @param validationArguments
     */
    validate(value: ID | IOrganization): boolean | Promise<boolean> {
        if (isEmpty(value)) return true;

        const organizationId = typeof value === 'string' ? value : value.id;

        return this.checkOrganizationExistence(organizationId!);
    }

    /**
     * Gets the default error message when validation fails
     *
     */
    defaultMessage(): string {
        const userId = RequestContext.currentUserId();

        return `The user with ID ${userId} is not associated with the specified organization.`;
    }

    /**
     * Checks if the given organization exists for the current user in the database
     */
    async checkOrganizationExistence(organizationId: string): Promise<boolean> {
        const tenantId = RequestContext.currentTenantId();
        const userId = RequestContext.currentUserId();

        if (!tenantId || !userId) {
            return false;
        }

        try {
            await this.userOrganizationRepository.findOneByOrFail({ tenantId, userId, organizationId });
            return true;
        } catch {
            return false;
        }
    }
}
