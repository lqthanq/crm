import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { UserEmailDTO } from "./user-email.dto";
import { IUserCreateInput } from "src/contracts";
import { IsOptional } from "class-validator";
import { Trimmed } from "src/lib/shared/decorators";

export class CreateUserDTO extends IntersectionType(UserEmailDTO) implements IUserCreateInput {
    @ApiPropertyOptional({ type: () => String})
    @IsOptional()
    @Trimmed()
    readonly firstName?: string;

    @ApiPropertyOptional({ type: () => String })
    @IsOptional()
    @Trimmed()
    readonly lastName?: string;
}