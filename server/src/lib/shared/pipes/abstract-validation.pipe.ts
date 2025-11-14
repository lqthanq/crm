import { ArgumentMetadata, Injectable, Type, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

@Injectable()
export class AbstractValidationPipe extends ValidationPipe {
    constructor(
        protected readonly options: ValidationPipeOptions,
        private readonly targetTypes: {
            body?: Type<any>;
            query?: Type<any>;
            param?: Type<any>;
            custom?: Type<any>;
        },
    ) {
        super(options);
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        const targetType = this.targetTypes[metadata.type];

        console.log('[AbstractValidationPipe] targetType', targetType);
        if (!targetType) {
            return await super.transform(value, metadata);
        }

        return await super.transform(value, { ...metadata, metatype: targetType });
    }
}
