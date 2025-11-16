import { SetMetadata } from '@nestjs/common';
import { FEATURE_METADATA } from 'src/constants';
import { EFeatures } from 'src/contracts';

export const FeatureFlag = (feature: EFeatures) => SetMetadata(FEATURE_METADATA, feature);
