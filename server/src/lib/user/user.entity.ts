import { IUser, ELanguages } from 'src/contracts';
import { TenantBaseEntity } from '../core/entities/internal';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
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

    @ApiPropertyOptional({ type: () => Date })
    @IsOptional()
    @Exclude({ toPlainOnly: true })
    @Column({ nullable: true, insert: false })
    emailVerifiedAt?: Date;

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

    name?: string;

    isEmailVerified?: boolean;
}
