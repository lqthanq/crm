import { FindManyOptions } from "typeorm";

export interface ICrudService<T>{
    count(filter?: FindManyOptions<T>): Promise<number>;
}
