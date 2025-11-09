import { ApiProperty } from '@nestjs/swagger';
import { EFeatures, IFeature, IFeatureOrganization } from 'src/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { FeatureOrganization } from './feature-organization.entity';
import { BaseEntity } from '../core/entities/internal';

@Entity()
export class Feature extends BaseEntity implements IFeature {
    @ApiProperty({ type: () => String })
    @Index()
    @Column()
    name: string;

    @ApiProperty({ type: () => String })
    @Index()
    @Column()
    code: EFeatures;

    @ApiProperty({ type: () => String })
    @Column({ default: false })
    isPaid?: boolean;

    @ApiProperty({ type: () => String })
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ type: () => String })
    @Column()
    link: string;

    @ApiProperty({ type: () => String })
    @Column({ nullable: true })
    status: string;

    isEnabled?: boolean;

    @ManyToOne(() => Feature, (it) => it.children, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    parent: IFeature;

    @ApiProperty({ type: () => String })
    @RelationId((it: Feature) => it.parent)
    @Index()
    @Column({ nullable: true })
    parentId?: string;

    @OneToMany(() => FeatureOrganization, (it) => it.feature, {
        cascade: true,
    })
    @JoinColumn()
    featureOrganizations?: IFeatureOrganization[];

    @OneToMany(() => Feature, (it) => it.parent, {
        cascade: true,
    })
    @JoinColumn({ name: 'parentId' })
    children: IFeature[];
}
