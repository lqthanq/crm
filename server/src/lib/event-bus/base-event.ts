import { ID } from "src/contracts";
import { v4 as uuid } from 'uuid';

/**
 * Abstract base class for representing events in an event-driven architecture.
 */
export abstract class BaseEvent {
    public readonly id: ID;

    public readonly createdAt: Date;

    constructor() {
        this.id = uuid();
        this.createdAt = new Date();
    }
}