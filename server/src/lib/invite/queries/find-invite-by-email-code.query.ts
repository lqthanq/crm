import { IQuery } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm';
import { Invite } from '../invite.entity';

export class FindInviteByEmailCodeQuery implements IQuery {
    constructor(public readonly params: FindOptionsWhere<Invite>) {}
}
