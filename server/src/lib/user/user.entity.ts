import { IUser, ELanguages, IRole } from 'src/contracts';
import { Role, TenantBaseEntity } from '../core/entities/internal';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends TenantBaseEntity implements IUser {
    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Index()
    @Column({ nullable: true })
    firstName?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Index()
    @Column({ nullable: true })
    lastName?: string;

    @ApiPropertyOptional({ type: () => String, minLength: 3, maxLength: 100 })
    @IsOptional()
    @IsEmail()
    @Index()
    @Column({ nullable: true })
    email?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Column({ nullable: true })
    timezone?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Exclude({ toPlainOnly: true })
    @Column({ nullable: true })
    hash?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Exclude({ toPlainOnly: true })
    @Column({ insert: false, nullable: true })
    refreshToken?: string;

    @ApiPropertyOptional({ type: () => String, enum: ELanguages })
    @IsOptional()
    @IsEnum(ELanguages)
    @Column({ nullable: true, default: ELanguages.ENGLISH })
    preferredLanguage?: ELanguages;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Exclude({ toPlainOnly: true })
    @Column({ insert: false, nullable: true })
    emailToken?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Exclude({ toPlainOnly: true })
    @Column({ insert: false, nullable: true })
    code?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Exclude({ toPlainOnly: true })
    @Column({ insert: false, nullable: true })
    codeExpireAt?: Date;

    @ApiPropertyOptional({ type: () => Date })
    @IsOptional()
    @Exclude({ toPlainOnly: true })
    @Column({ nullable: true, insert: false })
    emailVerifiedAt?: Date;

    @ApiPropertyOptional({ type: () => Date })
    @IsOptional()
    @Column({ insert: false, nullable: true })
    lastLoginAt?: Date;

    name?: string;

    isEmailVerified?: boolean;

    @ManyToOne(() => Role, {
        nullable: true,

        onDelete: 'SET NULL',
    })
    @JoinColumn()
    role?: IRole;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsUUID()
    @RelationId((it: User) => it.role)
    @Index()
    @Column({ nullable: true })
    roleId?: string;
}
