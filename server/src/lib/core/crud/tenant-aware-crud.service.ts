import { FindManyOptions, Repository } from 'typeorm';
import { TenantBaseEntity } from '../entities/internal';
import { CrudService } from './crud.service';
import { ICrudService } from './icrud.service';

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
}
