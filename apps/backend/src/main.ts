import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { formatValidationErrors } from '@/utils/format-validation-errors';

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

  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: formatValidationErrors,
    }),
  );

  setupApiDocumentation(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
