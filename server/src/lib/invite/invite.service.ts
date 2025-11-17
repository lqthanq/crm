import { BadRequestException, Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { Invite } from './invite.entity';
import { InviteRepository } from './invite.repository';
import { FindOptionsWhere, IsNull, MoreThanOrEqual, SelectQueryBuilder } from 'typeorm';
import { EInviteStatus } from 'src/contracts';

@Injectable()
export class InviteService extends TenantAwareCrudService<Invite> {
    constructor(readonly inviteRepository: InviteRepository) {
        super(inviteRepository);
    }

    /**
     * Validate invited by code
     *
     * @param where
     * @returns
     */
    async validateByCode(where: FindOptionsWhere<Invite>): Promise<Invite> {
        const { email, code } = where;

        try {
            const query = this.repository.createQueryBuilder(this.tableName);
            query.setFindOptions({
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    organization: {
                        name: true,
                    },
                },
                relations: {
                    organization: true,
                },
            });

            query.where((qb: SelectQueryBuilder<Invite>) => {
                qb.andWhere({
                    email,
                    code,
                    status: EInviteStatus.INVITED,
                });

                qb.andWhere([
                    {
                        expireDate: MoreThanOrEqual(new Date()),
                    },
                    {
                        expireDate: IsNull(),
                    },
                ]);
            });

            return await query.getOneOrFail();
        } catch (error) {
            console.error(`Cant validate code '${code}' for email '${email}'`, error);
            throw new BadRequestException();
        }
    }
}
