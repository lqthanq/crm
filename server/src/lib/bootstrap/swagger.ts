import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = async (app: INestApplication): Promise<string> => {
    const config = new DocumentBuilder()
        .setTitle('CRM API')
        .setDescription('CRM API documentation')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        })
        .build();

    const document = SwaggerModule.createDocument(app, config);

    const swaggerPath = 'docs';

    SwaggerModule.setup(swaggerPath, app, document);

    return Promise.resolve(swaggerPath);
};
