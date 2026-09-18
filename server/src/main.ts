import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envConfig } from './common/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: envConfig.corsOrigin,
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  await app.listen(envConfig.port);
  console.log(`Enterprise ERP Backend running on http://localhost:${envConfig.port}`);
  console.log(`Allowed CORS origin: ${envConfig.corsOrigin}`);
}

bootstrap();
