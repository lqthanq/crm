import { Injectable } from '@nestjs/common';
import { CrudService } from '../core/crud';
import { Feature } from './feature.entity';
import { FeatureRepository } from './feature.repository';
import { EFeatures } from 'src/contracts';
import { toggleFeatures } from 'src/config/environment/environment';

@Injectable()
export class FeatureService extends CrudService<Feature> {
    constructor(readonly featureRepository: FeatureRepository) {
        super(featureRepository);
    }

    /**
     * Checks if the specified feature flag is enabled.
     * 
     * @param flag 
     * @returns 
     */
    public async isFeatureEnabled(flag: EFeatures): Promise<boolean> {
        try {
            const featureFlag = await super.findOneByWhereOptions({ code: flag });
            return featureFlag?.isEnabled!;
        } catch (error) {
            // Feature flag not found, fallback to default value
            return !!toggleFeatures[flag];
        }
    }
}
