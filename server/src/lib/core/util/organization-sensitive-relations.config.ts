import { EPermissions } from 'src/contracts';
import { SensitiveRelationConfig } from '../decorators/sensitive-relations.decorator';

const sharedOrganizationRelations = {
    payments: EPermissions.ORG_PAYMENT_VIEW,
    invoice: EPermissions.ALL_ORG_VIEW,

    employees: {
        _self: EPermissions.ORG_EMPLOYEES_VIEW,
        user: EPermissions.ORG_USERS_VIEW,
    },
    featureOrganizations: EPermissions.ALL_ORG_VIEW,
};

export const ORGANIZATION_SENSITIVE_RELATIONS: SensitiveRelationConfig = {
    ...sharedOrganizationRelations,
    organization: {
        _self: null,
        ...sharedOrganizationRelations,
    },
};
