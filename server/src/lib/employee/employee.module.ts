import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from './employee.repository';
import { UserModule } from '../user/user.module';
import { CommandHandlers } from './commands/handlers';
import { EmployeeController } from './employee.controller';
import { RolePermissionModule } from '../role-permission/role-permission.module';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([Employee]),
        forwardRef(() => UserModule),
        forwardRef(() => RolePermissionModule),
    ],
    controllers: [EmployeeController],
    providers: [EmployeeService, EmployeeRepository, ...CommandHandlers],
    exports: [EmployeeRepository]
})
export class EmployeeModule {}
