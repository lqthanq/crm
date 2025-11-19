import { ValidationOptions, registerDecorator } from 'class-validator';
import { TeamAlreadyExistConstraint } from './constraints';

export const IsTeamAlreadyExist = (validationOptions?: ValidationOptions): PropertyDecorator => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: TeamAlreadyExistConstraint,
        });
    };
};
