import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { Organization } from '../organization.entity';
import { IOrganizationCreateInput } from 'src/contracts';
import { ECurrencies } from 'src/contracts/currency.model';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateOrganizationDTO
    extends IntersectionType(PickType(Organization, ['name'] as const))
    implements IOrganizationCreateInput
{
    @ApiProperty({
        enum: ECurrencies,
        example: ECurrencies.USD,
        required: true,
    })
    @IsNotEmpty()
    @IsEnum(ECurrencies)
    readonly currency: ECurrencies;
}
