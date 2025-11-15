import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmployeeCreateCommand } from '../employee.create.command';
import { UserService } from 'src/lib/user/user.service';
import { EmployeeService } from '../../employee.service';
import { IEmployee } from 'src/contracts';
import { isEmpty } from 'src/utils';

@CommandHandler(EmployeeCreateCommand)
export class EmployeeCreateHandler implements ICommandHandler<EmployeeCreateCommand> {
    constructor(
        private readonly _userService: UserService,
        private readonly _employeeService: EmployeeService,
    ) {}

    /**
     * Execute the employee creation command.
     *
     * @param command
     */
    public async execute(command: EmployeeCreateCommand): Promise<IEmployee | void> {
        const { input } = command;
        const { organizationId } = input;

        // TODO:
        if (isEmpty(input.userId)) {
        } else {
            try {
                const user = await this._userService.findOneByIdString(input.userId!);

                // 1. Create employee for specific user
                return await this._employeeService.create({
                    ...input,
                    user,
                    organizationId,
                    organization: { id: organizationId },
                });
            } catch (error) {
                console.log('Error while creating employee for existing user', error);
            }
        }
    }
}
