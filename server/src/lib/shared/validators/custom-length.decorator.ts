import {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from 'class-validator';

export function length(text: string, length: number): boolean {
    return typeof text === 'string' && typeof length === 'number' && text.length === length;
}

export const CustomLength = (length: number = 6, validationOptions?: ValidationOptions): PropertyDecorator => {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [length],
            validator: CustomLengthConstraint,
        });
    };
};

@ValidatorConstraint({ name: 'CustomLength', async: false })
export class CustomLengthConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments): boolean {
        if (!value) return true;

        return length(value, args.constraints[0]);
    }

    defaultMessage(validationArguments: ValidationArguments): string {
        const { value } = validationArguments;

        return `(${value}) is too short or too long`;
    }
}
