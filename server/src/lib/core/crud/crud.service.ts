import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { BaseEntity } from '../entities/internal';
import { ICrudService } from './icrud.service';
import { parseFindCountOptions } from './utils';
import { ID } from 'src/contracts';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class CrudService<T extends BaseEntity> implements ICrudService<T> {
    constructor(protected readonly repository: Repository<T>) {}

    public async count(options?: FindManyOptions<T>) {
        const ormOptions = parseFindCountOptions(options as FindManyOptions);
        return await this.repository.count(ormOptions);
    }

    public async findOneByIdString(id: ID, options?: FindOneOptions<T>): Promise<T> {
        const record = await this.repository.findOne({
            where: {
                id,
                ...(options && options.where ? options.where : {}),
            },
            ...(options && options.select ? { select: options.select } : {}),
            ...(options && options.relations ? { relations: options.relations } : {}),
            ...(options && options.order ? { order: options.order } : {}),
            ...(options && options.withDeleted ? { withDeleted: options.withDeleted } : {}),
        } as FindOneOptions<T>);
        if (!record) {
            throw new NotFoundException(`The requested record was not found`);
        }

        return record;
    }

    /**
     * Updates entity partially.
     */
    public async update(
        id: string | FindOptionsWhere<T>,
        partialEntity: QueryDeepPartialEntity<T>,
    ): Promise<T | UpdateResult> {
        try {
            return await this.repository.update(id, partialEntity);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    /**
     * Find first entity that matches given where condition.
     */
    public async findOneByWhereOptions(options: FindOptionsWhere<T>): Promise<T | null> {
        const record = this.repository.findOneBy(options);
        if (!record) {
            throw new NotFoundException(`The requested record was not found`);
        }

        return record;
    }
}
