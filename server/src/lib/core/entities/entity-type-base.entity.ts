import { EBaseEntity, IBasePerEntityType, ID } from 'src/contracts';
import { TenantOrganizationBaseEntity } from './tenant-organization-base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Column, Index } from 'typeorm';

export abstract class BasePerEntityType extends TenantOrganizationBaseEntity implements IBasePerEntityType {
    @ApiProperty({ type: () => String, enum: EBaseEntity })
    @IsNotEmpty()
    @IsEnum(EBaseEntity)
    @Index()
    @Column()
    entity: EBaseEntity;

    @ApiProperty({ type: () => String })
    @IsNotEmpty()
    @IsUUID()
    @Index()
    @Column()
    entityId: ID;
}
