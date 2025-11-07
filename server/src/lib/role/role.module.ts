import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { CommandHandlers } from './commands/handlers';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([Role])],
    providers: [RoleService, RoleRepository, ...CommandHandlers],
    exports: [RoleService, RoleRepository],
})
export class RoleModule {}
