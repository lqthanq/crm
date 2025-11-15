import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsUUID } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';

import { EEntitySubscriptionType, ID, IEmployee, IEntitySubscription } from 'src/contracts';
import { BasePerEntityType } from '../core/entities/entity-type-base.entity';
import { Employee } from '../employee/employee.entity';

@Entity()
export class EntitySubscription extends BasePerEntityType implements IEntitySubscription {
    @ApiProperty({ type: () => String, enum: EEntitySubscriptionType })
    @IsNotEmpty()
    @IsEnum(EEntitySubscriptionType)
    @Index()
    @Column()
    type: EEntitySubscriptionType;

    @ApiProperty({ type: () => Employee })
    @IsOptional()
    @IsObject()
    @ManyToOne(() => Employee, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    employee?: IEmployee;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsUUID()
    @RelationId((it: EntitySubscription) => it.employee)
    @Index()
    @Column({ nullable: true })
    employeeId?: ID;

    constructor(input?: any) {
        super();

        if (input) {
            Object.assign(this, input);
        }
    }
}
