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
    deleted_at?: Date;
}

export abstract class AccessTimestamps extends SoftDeletableBaseEntity {
    @ApiPropertyOptional({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z',
        description: 'The creation timestamp of the entity.',
    })
    @CreateDateColumn()
    created_at?: Date;

    @ApiPropertyOptional({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z',
        description: 'The last update timestamp of the entity.',
    })
    @UpdateDateColumn()
    updated_at?: Date;

    static getCurrentDate(): Date {
        return new Date();
    }
}

export abstract class BaseEntityActionByUser extends AccessTimestamps {
    @ManyToOne(() => User, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    created_by_user?: IUser;

    @RelationId((it: BaseEntityActionByUser) => it.created_by_user)
    @Index()
    @Column({ nullable: true })
    created_by_user_id?: ID;

    @ManyToOne(() => User, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    updated_by_user?: IUser;

    @RelationId((it: BaseEntityActionByUser) => it.updated_by_user)
    @Index()
    @Column({ nullable: true })
    updated_by_user_id?: ID;

    @ManyToOne(() => User, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    deleted_by_user?: IUser;

    @RelationId((it: BaseEntityActionByUser) => it.deleted_by_user)
    @Index()
    @Column({ nullable: true })
    deleted_by_user_id?: ID;
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
    is_active?: boolean;

    @ApiPropertyOptional({
        type: Boolean,
        default: false,
    })
    @IsOptional()
    @IsBoolean()
    @Index()
    @Column({ nullable: true })
    is_archived?: boolean;

    @ApiPropertyOptional({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z',
    })
    @IsOptional()
    @IsDateString()
    @Column({ nullable: true })
    archived_at?: Date;
}
