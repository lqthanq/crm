import { IOrganization } from 'src/contracts';
import { TenantBaseEntity } from '../core/entities/internal';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
import { ECurrencies } from 'src/contracts/currency.model';

@Entity()
export class Organization extends TenantBaseEntity implements IOrganization {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @Index()
    @Column()
    name: string;

    @Index()
    @Column('boolean', { default: false })
    isDefault: boolean;

    @ApiProperty({
        enum: ECurrencies,
        example: ECurrencies.USD,
        required: true,
        description: 'The currency used by the organization, must be one of the Currencies values',
    })
    @IsNotEmpty()
    @IsEnum(ECurrencies)
    @Index()
    @Column()
    currency: string;

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
