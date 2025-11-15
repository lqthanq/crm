import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { EmployeeDTO } from './employee.dto';
import { ID, IEmployeeCreateInput } from 'src/contracts';
import { UserInputDTO } from './user-input.dto';
import { IsNotEmpty, IsObject, IsUUID, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDTO extends IntersectionType(EmployeeDTO) implements IEmployeeCreateInput {
    @ApiPropertyOptional({ type: () => UserInputDTO })
    @ValidateIf((it) => !it.userId)
    @IsObject()
    @ValidateNested()
    @Type(() => UserInputDTO)
    readonly user: UserInputDTO;

    @ApiPropertyOptional({ type: () => String })
    @ValidateIf((it) => !it.user)
    @IsNotEmpty()
    @IsUUID()
    readonly userId: ID;
}
