import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { TenantBaseEntity } from '../entities/internal';
import { CrudService } from './crud.service';
import { ICrudService } from './icrud.service';
import { ID, IUser } from 'src/contracts';
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
        return await super.count(this.findManyWithTenant(options));
    }

    /**
     * Finds first entity by a given find options with current tenant.
     *
     * @param id
     * @param options
     * @returns
     */
    public async findOneByIdString(id: ID, options?: FindOneOptions<T>): Promise<T> {
        return await super.findOneByIdString(id, this.findOneWithTenant(options));
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

    /**
     * Creates a new entity instance and copies all entity properties from this object into a new entity.
     * 
     * @param entity 
     * @returns 
     */
    public async create(entity: DeepPartial<T>): Promise<T> {
        const tenantId = RequestContext.currentTenantId();

        // employeeId

        return await super.create({
            ...entity,
            ...(this.repository.metadata?.hasColumnWithPropertyPath('tenantId')
                ? { tenant: { id: tenantId }, tenantId }
                : {}),
        });
    }

    private findOneWithTenant(filter?: FindOneOptions<T>): FindOneOptions<T> {
        const user = RequestContext.currentUser();

        if (!user || !user.tenantId) {
            return filter as FindOneOptions<T>;
        }

        if (!filter) {
            return {
                where: this.findConditionsWithTenantByUser(user),
            };
        }

        if (!filter.where) {
            return {
                ...filter,
                where: this.findConditionsWithTenantByUser(user),
            };
        }

        if (filter.where instanceof Object) {
            return {
                ...filter,
                where: this.findConditionsWithTenant(user, filter.where),
            };
        }

        return filter;
    }

    /**
     * Define find many options when retrieving data with tenant.
     */
    private findManyWithTenant(filter?: FindManyOptions<T>): FindManyOptions<T> {
        const user = RequestContext.currentUser();

        if (!user || !user.tenantId) {
            return filter as FindManyOptions<T>;
        }

        if (!filter) {
            return {
                where: this.findConditionsWithTenantByUser(user),
            };
        }

        if (!filter.where) {
            return {
                ...filter,
                where: this.findConditionsWithTenantByUser(user),
            };
        }

        if (filter.where instanceof Object) {
            return {
                ...filter,
                where: this.findConditionsWithTenant(user, filter.where),
            };
        }

        return filter;
    }

    /**
     * Define find conditiions when retrieving data with tenant by user
     *
     * @param user
     * @returns
     */
    private findConditionsWithTenantByUser(user: IUser): FindOptionsWhere<T> {
        return {
            ...(this.repository.metadata?.hasColumnWithPropertyPath('tenantId')
                ? {
                      tenant: {
                          id: user.tenantId,
                      },
                      tenantId: user.tenantId,
                  }
                : {}),
            // Find conditions with Employee by User
        } as FindOptionsWhere<T>;
    }

    /**
     * Define find conditions when retrieving data with tenant.
     *
     * @param user
     * @param where
     * @returns
     */
    private findConditionsWithTenant(
        user: IUser,
        where?: FindOptionsWhere<T>[] | FindOptionsWhere<T>,
    ): FindOptionsWhere<T>[] | FindOptionsWhere<T> {
        if (where && Array.isArray(where)) {
            const wheres: FindOptionsWhere<T>[] = [];
            where.forEach((options: FindOptionsWhere<T>) => {
                wheres.push({ ...options, ...this.findConditionsWithTenantByUser(user) });
            });

            return wheres;
        }

        return where
            ? { ...where, ...this.findConditionsWithTenantByUser(user) }
            : { ...this.findConditionsWithTenantByUser(user) };
    }
}
