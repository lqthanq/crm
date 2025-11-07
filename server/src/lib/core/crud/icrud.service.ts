import { IPagination } from 'src/contracts';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface ICrudService<T> {
    count(filter?: FindManyOptions<T>): Promise<number>;

    findAll(filter?: FindManyOptions<T>): Promise<IPagination<T>>;

    findOneByIdString(id: string, options?: FindOneOptions<T>): Promise<T>;

    findOneByWhereOptions(options: FindOptionsWhere<T>): Promise<T | null>;

    create(entity: DeepPartial<T>, ...options: any[]): Promise<T>;
    save(entity: DeepPartial<T>): Promise<T>;
    update(id: IUpdateCriteria<T>, entity: QueryDeepPartialEntity<T>, ...options: any): Promise<UpdateResult | T>;
}

export type IUpdateCriteria<T> = string | number | FindOptionsWhere<T>;
