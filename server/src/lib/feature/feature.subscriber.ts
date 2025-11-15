import { EventSubscriber } from 'typeorm';
import { BaseEntityEventSubscriber } from '../core/entities/subscribers/base-entity-event.sunscriber';
import { Feature } from './feature.entity';

@EventSubscriber()
export class FeatureSubscriber extends BaseEntityEventSubscriber<Feature> {
    listenTo() {
        return Feature;
    }
}
