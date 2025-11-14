import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsUUID } from 'class-validator';
import { IBasePerTenantEntityModel, ID, ITenant } from 'src/contracts';
import { IsTenantBelongsToUser } from 'src/lib/shared/validators';

export class TenantBaseDTO implements IBasePerTenantEntityModel {
    @ApiPropertyOptional({ type: () => Object })
    @IsOptional()
    @IsObject()
    @IsTenantBelongsToUser()
    readonly tenant: ITenant;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @IsUUID()
    @IsTenantBelongsToUser()
    readonly tenantId: ID;
}
