import { IOrganization } from 'src/contracts';
import { ECurrencies } from 'src/contracts/currency.model';

export const DEFAULT_ORGANIZATIONS: IOrganization[] = [
    {
        name: 'Default Company',
        isDefault: true,
        currency: ECurrencies.USD,
        totalEmployees: 1,
    },
];
