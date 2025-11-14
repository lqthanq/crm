import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../core/entities/base.entity';
import { ICurrency } from 'src/contracts/currency.model';
import { IUser } from 'src/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Currency extends BaseEntity implements ICurrency {
    @ApiProperty({ type: () => String })
    @Index()
    @IsString()
    @IsNotEmpty()
    @Column({ nullable: false })
    isoCode: string;

    @ApiProperty({ type: () => String })
    @IsString()
    @IsNotEmpty()
    @Column({ nullable: false })
    currency: string;
}
