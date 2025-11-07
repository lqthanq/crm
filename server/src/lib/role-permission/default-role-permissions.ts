import { EPermissions, ERoles } from 'src/contracts';

export const DEFAULT_ROLE_PERMISSIONS = [
    {
        role: ERoles.SUPER_ADMIN,
        defaultEnabledPermissions: [
            EPermissions.ADMIN_DASHBOARD_VIEW,
            EPermissions.TEAM_DASHBOARD,
            EPermissions.ORG_CANDIDATES_INTERVIEW_EDIT,
            EPermissions.ORG_CANDIDATES_INTERVIEW_VIEW,
            EPermissions.ORG_CANDIDATES_DOCUMENTS_VIEW,
        ],
    },
    {
        role: ERoles.DATA_ENTRY,
        defaultEnabledPermissions: [
            EPermissions.ORG_PAYMENT_VIEW,
            EPermissions.ORG_PAYMENT_ADD_EDIT,

            EPermissions.PLUGIN_VIEW,
        ],
    },
    {
        role: ERoles.INTERVIEWER,
        defaultEnabledPermissions: [
            EPermissions.ORG_CANDIDATES_INTERVIEW_EDIT,
            EPermissions.ORG_CANDIDATES_INTERVIEW_VIEW,
            EPermissions.ORG_CANDIDATES_DOCUMENTS_VIEW,

            EPermissions.PLUGIN_VIEW,
        ],
    },
];
