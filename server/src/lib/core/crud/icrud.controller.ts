import { IPagination } from 'src/contracts';
import { DeepPartial, DeleteResult, FindManyOptions, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface ICrudController<T> {
    /**
     * Counts entities that match given options.
     *
     * @param options
     */
    getCount(options: FindOptionsWhere<T>): Promise<number | void>;

    /**
     * Find entities that match given find options.
     * Also counts all entities that match give conditions.
     *
     * @param filter
     * @param options
     */
    pagination(filter: FindManyOptions<T>, ...options: any[]): Promise<IPagination<T>>;

    /**
     * Finds entities that match given find options.
     *
     * @param options
     */
    findAll(options: FindManyOptions<T>): Promise<IPagination<T>>;

    /**
     * Finds first entity by a given find options.
     * If entitiy was not found in the database - returns null.
     *
     * @param id
     * @param options
     */
    findById(id: any, ...options: any[]): Promise<T>;

    /**
     * Creates a new entity instance and copies all entity properties from this object into a new entity.
     *
     * @param entity
     */
    create(entity: DeepPartial<T>): Promise<T>;

    /**
     * Updates entity partially. Entity can be found by a given conditions
     *
     * @param id
     * @param entity
     * @param options
     */
    update(id: any, entity: QueryDeepPartialEntity<T>, ...options: any[]): Promise<UpdateResult | T>;

    /**
     * Deletes entities by a given criteria.
     * Does not check if entity exist in the ddatabse.
     *
     * @param id
     * @param options
     */
    delete(id: any, ...options: any[]): Promise<DeleteResult>;
}
