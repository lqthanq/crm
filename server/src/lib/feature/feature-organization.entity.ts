import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
import { IFeature, IFeatureOrganization } from 'src/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { Feature } from './feature.entity';
import { IsString } from 'class-validator';

@Entity()
export class FeatureOrganization extends TenantOrganizationBaseEntity implements IFeatureOrganization {
    @Column({ default: true })
    isEnabled: boolean;

    @ApiProperty({ type: () => String })
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
