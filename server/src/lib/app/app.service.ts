import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SeedDataService } from '../core/seeds/seed-data.service';

@Injectable()
export class AppService {
    constructor(
        @Inject(forwardRef(() => SeedDataService))
        private readonly seedDataService: SeedDataService,
    ) {}

    async seedDBIfEmpty() {
        console.log('from seed');
        await this.seedDataService.runDefaultSeed();
    }
}
