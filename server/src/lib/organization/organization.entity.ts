import { IOrganization } from "src/contracts";
import { TenantBaseEntity } from "../core/entities/internal";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, Index } from "typeorm";

export class Organization extends TenantBaseEntity implements IOrganization {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @Index()
    @Column()
    name: string;

    @Index()
    @Column('boolean', { default: false })
    is_default: boolean;
}