import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { TenantOrganizationBaseEntity } from '../core/entities/tenant-organization-base.entity';
import { EInviteStatus, IInvite, IUser } from 'src/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { User } from '../user/user.entity';

@Entity()
export class Invite extends TenantOrganizationBaseEntity implements IInvite {
    @ApiProperty({ type: () => String })
    @IsNotEmpty()
    @IsString()
    @Column()
    token: string;

    @ApiProperty({ type: () => String })
    @IsEmail()
    @Column()
    email: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Column({ nullable: true })
    fullName?: string;

    @ApiPropertyOptional({ type: () => String, enum: EInviteStatus })
    @IsNotEmpty()
    @IsEnum(EInviteStatus)
    @Column()
    status: EInviteStatus;

    @ApiPropertyOptional({ type: () => Date })
    @IsOptional()
    @Column({ nullable: true })
    expireDate: Date;

    @Exclude({ toPlainOnly: true })
    @Column({ nullable: true })
    code?: string;

    isExpired?: boolean;

    @ManyToOne(() => User, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    invitedByUser?: IUser;

    @RelationId((invite: Invite) => invite.invitedByUser)
    @Index()
    @Column({ nullable: true })
    invitedByUserId?: string;
}
