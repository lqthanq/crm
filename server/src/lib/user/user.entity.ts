import { IUser, ELanguages } from 'src/contracts';
import { TenantBaseEntity } from '../core/entities/internal';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends TenantBaseEntity implements IUser {
    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Index()
    @Column({ nullable: true })
    first_name?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsString()
    @Index()
    @Column({ nullable: true })
    last_name?: string;

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
    email_verified_at?: Date;

    @ApiPropertyOptional({ type: () => String, enum: ELanguages })
    @IsOptional()
    @IsEnum(ELanguages)
    @Column({ nullable: true, default: ELanguages.ENGLISH })
    preferred_language?: ELanguages;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Exclude({ toPlainOnly: true })
    @Column({ insert: false, nullable: true })
    email_token?: string;

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
    code_expire_at?: Date;
}
