import { ICommand } from "@nestjs/cqrs";
import { IEmployeeCreateInput } from "src/contracts";

export class EmployeeCreateCommand implements ICommand {
    static readonly type = '[Employee] Create';

    constructor(
        public readonly input: IEmployeeCreateInput
    ) {}
}