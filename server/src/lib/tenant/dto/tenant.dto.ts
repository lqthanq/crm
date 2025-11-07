import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ITenant } from 'src/contracts';

export class TenantDTO implements ITenant {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    readonly name: string;
}
