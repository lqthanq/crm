import { IPagination } from 'src/contracts';
import { DeepPartial, DeleteResult, FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface ICrudService<T> {
    count(filter?: FindManyOptions<T>): Promise<number>;
    countBy(filter?: FindOptionsWhere<T>): Promise<number>;
    findAll(filter?: FindManyOptions<T>): Promise<IPagination<T>>;
    paginate(filter?: FindManyOptions<T>): Promise<IPagination<T>>;
    findOneByIdString(id: string, options?: FindOneOptions<T>): Promise<T>;

    findOneByWhereOptions(options: FindOptionsWhere<T>): Promise<T | null>;

    create(entity: DeepPartial<T>, ...options: any[]): Promise<T>;
    save(entity: DeepPartial<T>): Promise<T>;
    update(id: ICriteria<T>, entity: QueryDeepPartialEntity<T>, ...options: any): Promise<UpdateResult | T>;
    delete(id: ICriteria<T>, ...options: any[]): Promise<DeleteResult>;
    softDelete(id: ICriteria<T>, ...options: any[]): Promise<UpdateResult | T>;
    softRemove(id: string, ...options: any[]): Promise<T>;
    softRecover(id: string, ...options: any[]): Promise<T>;
}

export type ICriteria<T> = string | number | FindOptionsWhere<T>;
