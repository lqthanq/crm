import { IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IUser } from './user.model';

export enum EInviteStatus {
    INVITED = 'INVITED',
    EXPIRED = 'EXPIRED'
}

interface IInviteBase extends IBasePerTenantAndOrganizationEntityModel {
    email: string;
    token: string;
    code?: string;
    status: EInviteStatus;
    expireDate: Date;

    fullName?: string;
    isExpired?: boolean;
}

export interface IInvite extends IInviteBase {
    invitedByUser?: IUser;
    invitedByUserId?: ID;
}
