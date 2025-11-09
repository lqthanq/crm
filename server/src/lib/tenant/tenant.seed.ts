import { DataSource } from 'typeorm';

import { Tenant } from './tenant.entity';
import { ITenant } from 'src/contracts';

export const createDefaultTenant = async (dataSource: DataSource, tenantName: string): Promise<Tenant> => {
    const tenant: ITenant = {
        name: tenantName,
    };

    await insertTenant(dataSource, tenant);
    return tenant;
};

const insertTenant = async (dataSource: DataSource, tenant: Tenant): Promise<Tenant> => {
    const repo = dataSource.getRepository(Tenant);

    const existedTenant = await repo.findOne({ where: { name: tenant.name } });

    if (existedTenant) return existedTenant;

    await dataSource.createQueryBuilder().insert().into(Tenant).values(tenant).execute();

    return tenant;
};
