import { FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface ICrudService<T> {
    count(filter?: FindManyOptions<T>): Promise<number>;

    findOneByIdString(id: string, options?: FindOneOptions<T>): Promise<T>;

    findOneByWhereOptions(options: FindOptionsWhere<T>): Promise<T | null>;

    update(id: IUpdateCriteria<T>, entity: QueryDeepPartialEntity<T>, ...options: any): Promise<UpdateResult | T>;
}

export type IUpdateCriteria<T> = string | number | FindOptionsWhere<T>;
