import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IFeature, IFeatureOrganization } from 'src/contracts';
import { Feature } from './feature.entity';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';

@Entity()
export class FeatureOrganization extends TenantOrganizationBaseEntity implements IFeatureOrganization {
    @Column({ default: true })
    isEnabled: boolean;

    @ApiProperty({ type: () => Feature })
    @ManyToOne(() => Feature, (it) => it.featureOrganizations, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    feature: IFeature;

    @ApiProperty({ type: () => String })
    @RelationId((it: FeatureOrganization) => it.feature)
    @IsString()
    @Index()
    @Column()
    featureId: IFeature['id'];
}
