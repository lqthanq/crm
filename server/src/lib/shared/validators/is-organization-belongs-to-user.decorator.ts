import { ValidationOptions, registerDecorator } from 'class-validator';
import { OrganizationBelongsToUserConstraint } from './constraints';

/**
 * Organization should belings to user validation decorator
 *
 * @param validationOptions
 * @returns
 */
export const IsOrganizationBelongsToUser = (validationOptions?: ValidationOptions): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: OrganizationBelongsToUserConstraint,
        });
    };
};
