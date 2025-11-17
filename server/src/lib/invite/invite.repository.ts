import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InviteRepository extends Repository<Invite> {
    constructor(@InjectRepository(Invite) readonly repository: Repository<Invite>) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
