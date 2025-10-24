import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, type INestApplication } from '@nestjs/common';

const setupApiDocumentation = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  setupApiDocumentation(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
