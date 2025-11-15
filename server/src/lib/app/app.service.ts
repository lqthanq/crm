import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SeedDataService } from '../core/seeds/seed-data.service';
import { UserService } from '../user/user.service';
import chalk from 'chalk';
import { User } from '../user/user.entity';

@Injectable()
export class AppService {
    public count: number = 0;

    constructor(
        @Inject(forwardRef(() => SeedDataService))
        private readonly seedDataService: SeedDataService,

        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}

    /**
     * Seed DB if no users exists
     */
    async seedDBIfEmpty() {
        this.count = await this.userService.countFast();
        console.log(chalk.magenta(`Found ${this.count} users in DB`));

        if (this.count === 0) {
            await this.seedDataService.runDefaultSeed();
        }
    }
}
