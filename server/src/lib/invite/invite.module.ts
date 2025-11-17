import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invite } from './invite.entity';
import { InviteService } from './invite.service';
import { InviteRepository } from './invite.repository';
import { QueryHandlers } from './queries/handlers';
import { InviteController } from './invite.controller';

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([Invite])],
    controllers: [InviteController],
    providers: [InviteService, InviteRepository, ...QueryHandlers],
})
export class InviteModule {}
