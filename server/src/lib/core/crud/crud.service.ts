import {
    DeepPartial,
    DeleteResult,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    Repository,
    SaveOptions,
    UpdateResult,
} from 'typeorm';
import { BaseEntity } from '../entities/internal';
import { ICriteria, ICrudService } from './icrud.service';
import { parseFindCountOptions } from './utils';
import { ID, IPagination } from 'src/contracts';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class CrudService<T extends BaseEntity> implements ICrudService<T> {
    constructor(protected readonly repository: Repository<T>) {}

    public async count(options?: FindManyOptions<T>) {
        const ormOptions = parseFindCountOptions(options as FindManyOptions);
        return await this.repository.count(ormOptions);
    }

    public async countBy(options?: FindOptionsWhere<T>): Promise<number> {
        const ormOptions = parseFindCountOptions<T>({ where: options });
        return await this.repository.count(ormOptions);
    }

    /**
     * Finds first entity by a given find options.
     * If entity was not found in the database - returns null
     *
     * @param id
     * @param options
     * @returns
     */
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
    public async update(id: ICriteria<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<T | UpdateResult> {
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

    /**
     * Finds entities that match given find options.
     */
    public async find(options?: FindManyOptions<T>): Promise<T[]> {
        return await this.repository.find(options);
    }

    /**
     * Creates a new entity or update an existing one based on the provided entity data.
     */
    public async create(partialEntity: DeepPartial<T>): Promise<T> {
        try {
            const newEntity = this.repository.create(partialEntity);
            return await this.repository.save(newEntity);
        } catch (error) {
            console.error('Error in crud service create method:', error);
            throw new BadRequestException(error);
        }
    }

    /**
     * Saves a given entity in the database
     */
    public async save(entity: DeepPartial<T>): Promise<T> {
        try {
            return await this.repository.save(entity);
        } catch (error) {
            console.error('Error in crud service save method;', error);
            throw new BadRequestException(error);
        }
    }

    /**
     * Finds entities that match given find options.
     */
    public async findAll(options: FindManyOptions<T>): Promise<IPagination<T>> {
        const [items, total] = await this.repository.findAndCount(options);

        return { items, total };
    }

    /**
     * Finds entities that match given find options.
     * Also counts all entities that match given conditions.
     *
     * @param options
     * @returns
     */
    public async paginate(options?: FindManyOptions<T>): Promise<IPagination<T>> {
        try {
            const [items, total] = await this.repository.findAndCount({
                skip: options && options.skip ? options.take! * (options.skip - 1) : 0,
                take: options && options.take ? options.take : 10,

                ...(options && options.select ? { select: options.select } : {}),
                ...(options && options.relations ? { relations: options.relations } : {}),
                ...(options && options.where ? { where: options.where } : {}),
                ...(options && options.order ? { order: options.order } : {}),
                ...(options && options.withDeleted ? { withDeleted: options.withDeleted } : {}),
            });

            return { items, total };
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error);
        }
    }

    /**
     * Deletes a record based on the given criteria.
     *
     * @param id
     * @returns
     */
    public async delete(id: ICriteria<T>): Promise<DeleteResult> {
        try {
            return await this.repository.delete(id);
        } catch (error) {
            throw new NotFoundException(`The record was not found`, error);
        }
    }

    /**
     * Softly deletes entities by a given criteria
     * @param id
     * @returns
     */
    public async softDelete(id: ICriteria<T>): Promise<UpdateResult | T> {
        try {
            return await this.repository.softDelete(id);
        } catch (error) {
            throw new NotFoundException(`The record was not found or could not be soft-deleted`, error);
        }
    }

    /**
     * Softly removes an entity from the database
     * @param id
     * @param options
     * @param saveOptions
     * @returns
     */
    public async softRemove(id: ID, options?: FindOneOptions<T>, saveOptions?: SaveOptions): Promise<T> {
        try {
            const entity = await this.findOneByIdString(id, options);

            return await this.repository.softRemove(entity, saveOptions);
        } catch (error) {
            throw new NotFoundException(`An error occurred during soft removal: ${error.message}`, error);
        }
    }

    /**
     * Soft-recover a previously soft-deleted entity.
     *
     * @param id
     * @param options
     * @param saveOptions
     * @returns
     */
    public async softRecover(id: ID, options?: FindOneOptions<T>, saveOptions?: SaveOptions): Promise<T> {
        try {
            const entity = await this.findOneByIdString(id, options);

            return await this.repository.recover(entity, saveOptions);
        } catch (error) {
            throw new NotFoundException(`An error occurred during restoring entity: ${error.message}`);
        }
    }
}
