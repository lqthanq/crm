import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { TenantBaseEntity } from '../entities/internal';
import { CrudService } from './crud.service';
import { ICrudService } from './icrud.service';
import { ID } from 'src/contracts';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { RequestContext } from '../context';

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

    /**
     * Finds entities that match given find options.
     */
    public async find(filter?: FindManyOptions<T>): Promise<T[]> {
        return await super.find(this.findManyWithTenant(filter));
    }

    /**
     * Define find many options when retrieving data with tenant.
     */
    private findManyWithTenant(filter?: FindManyOptions<T>): FindManyOptions<T> {
        const user = RequestContext.currentUser();
        if (!user || !user.tenantId) {
            return filter as FindManyOptions<T>;
        }

        // TODO:

        return filter as FindManyOptions<T>;
    }

    /**
     * Saves a given entity in the database.
     */
    public async save(entity: DeepPartial<T>): Promise<T> {
        const tenantId = RequestContext.currentTenantId();

        return await super.save({
            ...entity,
            ...(this.repository.metadata?.hasColumnWithPropertyPath('tenantId')
                ? { tenant: { id: tenantId }, tenantId }
                : {}),
        });
    }
}
