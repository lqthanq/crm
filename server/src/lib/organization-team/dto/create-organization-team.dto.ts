import { IOrganizationTeamCreateInput } from "src/contracts";
import { OrganizationTeamDTO } from "./organization-team.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsTeamAlreadyExist } from "src/lib/shared/validators";

export class CreateOrganizationTeamDTO extends OrganizationTeamDTO implements IOrganizationTeamCreateInput {
    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @IsTeamAlreadyExist()
    readonly name: string;
}