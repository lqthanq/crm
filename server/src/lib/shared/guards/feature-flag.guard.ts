import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { FEATURE_METADATA } from 'src/constants';
import { FeatureService } from 'src/lib/feature/feature.service';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly _reflector: Reflector,
        private readonly featureFlagService: FeatureService,
    ) {}

    async canActivate(context: ExecutionContext) {
        const targets = [context.getHandler(), context.getClass()];

        const flag = this._reflector.getAllAndOverride(FEATURE_METADATA, targets);

        console.log('Guard: FeatureFlag checking', flag);

        const cacheKey = `featureFlag_${flag}`;

        const fromCache = await this.cacheManager.get<boolean | null>(cacheKey);

        let isEnabled: boolean = false;

        if (fromCache === null) {
            isEnabled = await this.featureFlagService.isFeatureEnabled(flag);
            await this.cacheManager.set(cacheKey, isEnabled);
        } else {
            isEnabled = fromCache!;
        }

        // Check if the feature is enabled
        if (isEnabled) {
            console.log(`Guard: FeatureFlag ${flag} enabled`);
            return true;
        }

        // If the feature is not enabled, throw a NotFoundException
        const { method, url } = context.switchToHttp().getRequest();

        throw new NotFoundException(`Cannot ${method} ${url}`);
    }
}
