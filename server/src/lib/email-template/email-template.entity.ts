import { ApiPropertyOptional } from '@nestjs/swagger';
import type { IEmailTemplate } from 'src/contracts';
import { Column, Entity, Index } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';

@Entity()
export class EmailTemplate extends TenantOrganizationBaseEntity implements IEmailTemplate {
    @ApiPropertyOptional({ type: () => String })
    @Index()
    @Column()
    name: string;

    @ApiPropertyOptional({ type: () => String })
    @Index()
    @Column()
    languageCode: string;

    @ApiPropertyOptional({ type: () => String })
    @Column({ type: 'text', nullable: true })
    mjml: string;

    @ApiPropertyOptional({ type: () => String })
    @Column()
    hbs: string;

    title?: string;
}
