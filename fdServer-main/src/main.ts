import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Increase payload limit
  app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.setGlobalPrefix('api');
  app.enableCors();

  // Initiating Swagger
  const config = new DocumentBuilder()
    .setTitle('MarkTailor API')
    .setDescription('Contains API Definations for Retailer, GM and worker')
    .setVersion('1.0')
    .addTag('dev')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('server', app, document, {
    customSiteTitle: 'Backend Generator',
    customfavIcon: 'https://avatars.githubusercontent.com/u/6936373?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    logger.log(`Server is running on http://localhost:${port}`);
  });
}

bootstrap();
