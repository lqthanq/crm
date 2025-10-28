import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { coreEntities } from './lib/core';
import { createDefaultEmailTemplates } from './lib/email-template/email-template.seed';

const options: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'crm',
    username: 'postgres',
    password: 'Thang@1102',
    logging: ['query', 'error'],
    logger: 'advanced-console',
    synchronize: true,
    entities: coreEntities,
};

async function bootstrap() {
    let dataSource = new DataSource(options);
    dataSource = await dataSource.initialize();

    console.log('dataSource', dataSource.isInitialized);

    await createDefaultEmailTemplates(dataSource)


    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
