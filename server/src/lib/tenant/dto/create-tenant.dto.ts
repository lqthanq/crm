import { ITenantCreateInput } from 'src/contracts';
import { TenantDTO } from './tenant.dto';

export class CreateTenantDTO extends TenantDTO implements ITenantCreateInput {}
