import { FindManyOptions, Repository } from 'typeorm';
import { BaseEntity } from '../entities/internal';
import { ICrudService } from './icrud.service';
import { parseFindCountOptions } from './utils';

export abstract class CrudService<T extends BaseEntity> implements ICrudService<T> {
    constructor(protected readonly repository: Repository<T>) {}

    public async count(options?: FindManyOptions<T>) {
        const ormOptions = parseFindCountOptions(options as FindManyOptions);
        return await this.repository.count(ormOptions);
    }
}
