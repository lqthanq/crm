import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { TenantBaseEntity } from '../entities/internal';
import { CrudService } from './crud.service';
import { ICrudService } from './icrud.service';
import { ID } from 'src/contracts';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class TenantAwareCrudService<T extends TenantBaseEntity>
    extends CrudService<T>
    implements ICrudService<T>
{
    constructor(repository: Repository<T>) {
        super(repository);
    }

    public async count(options?: FindManyOptions<T>): Promise<number> {
        return await super.count();
    }

    public async findOneByIdString(id: ID, options?: FindOneOptions<T>): Promise<T> {
        //
        return await super.findOneByIdString(id);
    }

    public async update(
        id: string | FindOptionsWhere<T>,
        partialEntity: QueryDeepPartialEntity<T>,
    ): Promise<T | UpdateResult> {
        if (typeof id === 'string') {
            await this.findOneByIdString(id);
        }

        //

        return await super.update(id, partialEntity);
    }
}
