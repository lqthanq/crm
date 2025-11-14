import { ArgumentMetadata, Injectable, NotAcceptableException, NotFoundException, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { isEmpty } from 'src/utils';

/**
 * UUID Validation Pipe
 */
@Injectable()
export class UUIDValidationPipe implements PipeTransform<string> {
    /**
     * When user requests an entity with invalid UUID we must return 404
     * error before reaching into the database.
     *
     * @param value
     * @param metadata
     * @returns
     */
    transform(value: string, metadata: ArgumentMetadata): string {
        if (isEmpty(value)) {
            throw new NotFoundException('Validation failed (uuid is expected)');
        }

        if (!isUUID(value)) {
            throw new NotAcceptableException('Validation failed (valid uuid is expected)');
        }

        return value;
    }
}
