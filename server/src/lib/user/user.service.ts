import { UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { TenantAwareCrudService } from '../core/crud';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { ID } from 'src/contracts';
import { freshTimestamp } from '../core';

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
}
