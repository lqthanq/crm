import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';
import type { IBaseEntityModel, ID, IUser } from 'src/contracts';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './internal';

export abstract class Model {
    constructor(input?: any) {
        if (input) {
            for (const [key, value] of Object.entries(input)) {
                (this as any)[key] = value;
            }
        }
    }
}

export abstract class SoftDeletableBaseEntity extends Model {
    @ApiPropertyOptional({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z',
    })
    @IsOptional()
    @IsDateString()
    @DeleteDateColumn()
    deletedAt?: Date;
}

export abstract class AccessTimestamps extends SoftDeletableBaseEntity {
    @ApiPropertyOptional({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z',
        description: 'The creation timestamp of the entity.',
    })
    @CreateDateColumn()
    createdAt?: Date;

    @ApiPropertyOptional({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z',
        description: 'The last update timestamp of the entity.',
    })
    @UpdateDateColumn()
    updatedAt?: Date;

    static getCurrentDate(): Date {
        return new Date();
    }
}

export abstract class BaseEntityActionByUser extends AccessTimestamps {
    @ManyToOne(() => User, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    createdByUser?: IUser;

    @RelationId((it: BaseEntityActionByUser) => it.createdByUser)
    @Index()
    @Column({ nullable: true })
    createdByUserId?: ID;

    @ManyToOne(() => User, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    updatedByUser?: IUser;

    @RelationId((it: BaseEntityActionByUser) => it.updatedByUser)
    @Index()
    @Column({ nullable: true })
    updatedByUserId?: ID;

    @ManyToOne(() => User, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    deletedByUser?: IUser;

    @RelationId((it: BaseEntityActionByUser) => it.deletedByUser)
    @Index()
    @Column({ nullable: true })
    deletedByUserId?: ID;
}

export abstract class BaseEntity extends BaseEntityActionByUser implements IBaseEntityModel {
    @ApiPropertyOptional({ type: () => String })
    @PrimaryGeneratedColumn('uuid')
    id?: ID;

    @ApiPropertyOptional({
        type: Boolean,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    @Index()
    @Column({ nullable: true })
    isActive?: boolean;

    @ApiPropertyOptional({
        type: Boolean,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    @Index()
    @Column({ nullable: true })
    isArchived?: boolean;

    @ApiPropertyOptional({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z',
    })
    @IsOptional()
    @IsDateString()
    @Column({ nullable: true })
    archivedAt?: Date;
}
