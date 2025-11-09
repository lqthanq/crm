import chalk from 'chalk';
import { DataSource } from 'typeorm';

import { IFeature, ITenant } from 'src/contracts';
import { DEFAULT_FEATURES } from './default-features';
import { FeatureOrganization } from './feature-organization.entity';
import { Feature } from './feature.entity';

/**
 * Creates default feature toggles and their hierarchical relationships
 */
export const createDefaultFeatureToggle = async (dataSource: DataSource, tenant: ITenant): Promise<IFeature[]> => {
    // Clean up existing features
    await cleanFeature(dataSource);

    for (const item of DEFAULT_FEATURES) {
        // Create the parent feature
        const feature: IFeature = await createFeature(item, tenant);
        const parent = await dataSource.manager.save(feature);

        // Process and save child features, if any
        if (item.children!?.length > 0) {
            const features = item.children?.map(async (child) => {
                const childFeature: IFeature = await createFeature(child, tenant);
                childFeature.parent = parent;
                return childFeature;
            }) as Promise<IFeature>[];

            const featureChildren = await Promise.all(features);

            await dataSource.manager.save(featureChildren);
        }
    }

    // Retrieve and return all created features
    return await dataSource.getRepository(Feature).find();
};

/**
 * Creates a new features entity for the provided tenant and configuration.
 */
async function createFeature(item: IFeature, tenant: ITenant): Promise<IFeature> {
    const { name, code, description, link, isEnabled, status } = item;

    const feature: IFeature = new Feature({
        name,
        code,
        description,
        link,
        status,
        featureOrganizations: [new FeatureOrganization({ isEnabled, tenant })],
    });

    return feature;
}

/**
 * Cleans up the `feature` and `feature_organization` tables and deletes associated images.
 */
async function cleanFeature(dataSource: DataSource): Promise<void> {
    await dataSource.query('TRUNCATE TABLE feature RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE feature_organization RESTART IDENTITY CASCADE');

    console.log(chalk.green('CLEANING UP FEATURES IMAGES...'));
}
