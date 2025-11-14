import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ID, ITenant } from 'src/contracts';
import { RequestContext } from 'src/lib/core';
import { isEmpty } from 'src/utils';

/**
 * Validates whether the sepecified tenant belongs to the current user.
 */
@ValidatorConstraint({ name: 'IsTenantBelongsToUser', async: true })
@Injectable()
export class TenantBelongsToUserConstraint implements ValidatorConstraintInterface {
    /**
     * Validates whether the specified tenant belongs to the current user.
     *
     * @param value
     * @param validationArguments
     */
    validate(value: ID | ITenant): boolean | Promise<boolean> {
        if (isEmpty(value)) return true;

        const currentTenantId = RequestContext.currentTenantId();

        return typeof value === 'string' ? value === currentTenantId : value.id === currentTenantId;
    }

    /**
     * Gets the default message when validation for the "IsTenantBelongsToUser" constraint fails.
     *
     * @param validationArguments
     */
    defaultMessage?(validationArguments?: ValidationArguments | undefined): string {
        const { value } = validationArguments || { value: '' };

        return `The user is not associated with the requested tenant. Received tenant details: ${JSON.stringify(value)}`;
    }
}
