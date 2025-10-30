import { ITenant } from 'src/contracts';
import { BaseEntity } from '../core/entities/internal';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_STANDARD_WORK_HOURS_PER_DAY } from 'src/constants';

@Entity()
export class Tenant extends BaseEntity implements ITenant {
    @ApiProperty({ type: () => String })
    @Index()
    @Column()
    name?: string;

    @ApiPropertyOptional({ type: () => String })
    @Column()
    logo?: string;

    @ApiPropertyOptional({
        type: () => Number,
        description: 'Standard work hours per day for the tenant',
        minimum: 1,
        maximum: 24,
    })
    @IsOptional()
    @IsNumber()
    @Max(24, { message: 'Standard work hours per day cannot exceed 24 hours' })
    @Min(1, { message: 'Standard work hours per day must be at least 1 hour' })
    @Column({ nullable: true, default: DEFAULT_STANDARD_WORK_HOURS_PER_DAY })
    standardWorkHoursPerDay?: number;
}
