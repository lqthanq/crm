import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DataSource, EntityManager, EntitySchema, ObjectLiteral, ObjectType, Repository } from 'typeorm';

@Injectable()
export class ConnectionEntityManager {
    constructor(@InjectEntityManager() private entityManager: EntityManager) {}

    get rawEntityManager(): EntityManager {
        return this.entityManager;
    }

    get rawConnection(): DataSource {
        return this.entityManager.connection;
    }

    getRepository<Entity extends ObjectLiteral>(
        target: ObjectType<Entity> | EntitySchema<Entity> | string,
    ): Repository<Entity>;

    getRepository<Entity extends ObjectLiteral>(
        target?: ObjectType<Entity> | EntitySchema<Entity> | string,
    ): Repository<Entity> {
        return this.rawEntityManager.getRepository(target!);
    }
}
