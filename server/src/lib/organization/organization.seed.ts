import { IOrganization, ITenant } from 'src/contracts';
import { DataSource } from 'typeorm';
import { Organization } from './organization.entity';

/**
 * Creates default organizations for a tenant.
 */
export const createDefaultOrganizations = async (
    dataSource: DataSource,
    tenant: ITenant,
    organizations: IOrganization[],
): Promise<Organization[]> => {
    if (!tenant) {
        throw new Error('Tenant is required to create default organizations');
    }

    const defaultOrganizations: IOrganization[] = [];
    for (const organization of organizations) {
        const { name, isDefault, currency } = organization;

        const defaultOrganization = new Organization({ name, isDefault, currency });
        defaultOrganizations.push(defaultOrganization);
    }

    await insertOrganizations(dataSource, defaultOrganizations);

    return defaultOrganizations;
};

/** Insert multiple organizations into the database */
const insertOrganizations = async (dataSource: DataSource, organizations: IOrganization[]): Promise<void> => {
    if (!organizations || organizations.length == 0) {
        throw new Error('The organizations array must not be empty.');
    }

    try {
        await dataSource.manager.save(organizations);
    } catch (error) {
        throw new Error(`Failed to insert organizations: ${error.message}`);
    }
};
