import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type, plainToClass } from 'class-transformer';
import { IsNotEmpty, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { parseObject, parseToBoolean } from 'src/utils';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';
import { TenantOrganizationBaseDTO } from './tenant-organization-base.dto';
import { PlainObject } from 'src/contracts';

/**
 * Base DTO for 'select' fields. Whay fields should be selected.
 */
export class FindSelectQueryDTO<T = any> {
    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => parseObject(value, parseToBoolean))
    readonly select?: FindOptionsSelect<T>;
}

/**
 * Base DTO for 'relations' to load
 */
export class FindRelationsQueryDTO<T = any> extends FindSelectQueryDTO<T> {
    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    readonly relations?: FindOptionsRelations<T>;
}

/**
 * Simple condition that should be applied to match entities.
 */
export class FindWhereQueryDTO<T> extends FindRelationsQueryDTO<T> {
    @ApiProperty({ type: Object })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => TenantOrganizationBaseDTO)
    @Transform(({ value }: TransformFnParams) => (value ? escapeQueryWithParameters(value) : {}))
    readonly where: FindOptionsWhere<T>;
}

/**
 * Base DTO for filtering options (ordering, soft-delete, etc..)
 */
export class FindOptionsQueryDTO<T> extends FindWhereQueryDTO<T> {
    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    readonly order?: FindOptionsOrder<T>;

    /**
     * Indicates if soft-deleted row should be included in entity result.
     */
    @ApiPropertyOptional({ type: 'boolean' })
    @IsOptional()
    @Transform(({ value }: TransformFnParams) => parseToBoolean(value))
    readonly withDeleted?: boolean;
}

/**
 * Base DTO for pagination (skip/take)
 */
export class PaginationQueryDTO<T> extends FindOptionsQueryDTO<T> {
    @ApiPropertyOptional({ type: () => 'number', minimum: 0, maximum: 100 })
    @IsOptional()
    @Min(0)
    @Max(100)
    @Transform((params: TransformFnParams) => Number.parseInt(params.value, 10))
    readonly take?: number;

    @ApiPropertyOptional({ type: () => 'number', minimum: 0 })
    @IsOptional()
    @Min(0)
    @Transform((params: TransformFnParams) => Number.parseInt(params.value, 10))
    readonly skip?: number;
}

export class BaseQueryDTO<T = any> extends PaginationQueryDTO<T> {}

/**
 * Funtion to escape query parameters and convert to DTO class.
 * @param nativeParameters
 * @returns
 */
export function escapeQueryWithParameters(nativeParameters: PlainObject): TenantOrganizationBaseDTO {
    // Convert native parameters based on the database connection type
    const builtParameters: PlainObject = convertNativeParameters(nativeParameters);

    return plainToClass(TenantOrganizationBaseDTO, builtParameters, { enableImplicitConversion: true });
}

/**
 * Parses the given value and converts it to a boolean using JSON.parse.
 */
export const parseBool = (value: any): boolean => Boolean(JSON.parse(value));

/**
 * Converts native parameters based on the database connection type.
 * @param parameters
 * @returns
 */
export const convertNativeParameters = (parameters: PlainObject): any => {
    try {
        if (Array.isArray(parameters)) {
            return parameters.map((item) => convertNativeParameters(item));
        }

        if (typeof parameters === 'object' && parameters !== null) {
            return Object.keys(parameters).reduce((acc, key) => {
                acc[key] = convertNativeParameters(parameters[key]);

                return acc;
            }, {});
        }

        return parseBool(parameters);
    } catch (error) {
        return parameters;
    }
};
