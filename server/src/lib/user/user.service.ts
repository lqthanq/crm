import { Brackets, SelectQueryBuilder, UpdateResult, WhereExpressionBuilder } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { ID } from 'src/contracts';
import { freshTimestamp } from '../core';
import { JwtPayload } from 'jsonwebtoken';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class UserService extends TenantAwareCrudService<User> {
    constructor(readonly userRepository: UserRepository) {
        super(userRepository);
    }

    /**
     * Counts the total number of records in the current repository/table.
     */
    public async countFast(): Promise<number> {
        return await super.count();
    }

    /**
     * Sets the current refresh token for the user
     */
    async setCurrentRefreshToken(refreshToken: string, userId: ID): Promise<UpdateResult | void> {
        try {
            // Hash the refresh token using bcrypt if refreshToken is provided
            if (refreshToken) {
                refreshToken = await bcrypt.hash(refreshToken, 10);
            }

            return await this.repository.update(userId, { refreshToken });
        } catch (error) {
            console.error('Error while setting current refresh token:', error);
        }
    }

    /**
     * Update the last login time after user logged in
     */
    async setUserLastLoginTimestamp(userId: ID): Promise<UpdateResult | void> {
        try {
            const lastLoginAt = new Date();
            const id = userId;

            return await this.repository.update(id, { lastLoginAt });
        } catch (error) {
            console.log('Error while updating last login time', error);
        }
    }

    /**
     * Retrieves a user with the given ID if it exists.
     *
     * @param id
     * @returns
     */
    async getIfExists(id: string): Promise<User | null> {
        return await this.repository.findOneBy({ id });
    }

    /**
     * Marked email as verified for user
     *
     * @param id
     * @returns
     */
    public async markEmailAsVerified(id: ID) {
        return await this.repository.update(
            { id },
            {
                emailVerifiedAt: freshTimestamp(),
                emailToken: null,
                code: null,
                codeExpireAt: null,
            },
        );
    }

    /**
     * Get user if refresh token matches
     *
     * @param refreshToken
     * @param payload
     * @returns
     */
    async getUserIfRefreshTokenMatches(refreshToken: string, payload: JwtPayload) {
        try {
            const { id, email, tenantId, role } = payload;

            const query = this.repository.createQueryBuilder('user');

            query.setFindOptions({
                join: {
                    // TODO: relations?
                    alias: 'user',
                    leftJoin: { role: 'user.role ' },
                },
            });

            query.where((query: SelectQueryBuilder<User>) => {
                query.andWhere(
                    new Brackets((web: WhereExpressionBuilder) => {
                        web.andWhere(`"${query.alias}"."id" = :id`, { id });
                        web.andWhere(`"${query.alias}"."email" = :email`, { email });
                    }),
                );

                query.andWhere(
                    new Brackets((web: WhereExpressionBuilder) => {
                        if (isNotEmpty(tenantId)) {
                            web.andWhere(`"${query.alias}"."tenantId" = :tenantId`, { tenantId });
                        }

                        if (isNotEmpty(role)) {
                            web.andWhere(`"role"."name" = :role`, { role });
                        }
                    }),
                );

                query.orderBy(`"${query.alias}"."createdAt"`, 'DESC');
            });

            const user = await query.getOneOrFail();
            const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken!);

            if (isRefreshTokenMatching) {
                return user;
            }

            throw new UnauthorizedException();
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
