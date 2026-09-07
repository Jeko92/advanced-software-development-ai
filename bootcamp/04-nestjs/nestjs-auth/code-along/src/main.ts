import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.ts';
import { TypeormSessionStore } from './auth/session/typeorm-session.store.ts';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const sessionSecret = process.env['SESSION_SECRET'];
  if (!sessionSecret) {
    throw new Error('Missing required environment variable: SESSION_SECRET');
  }

  app.use(
    session({
      store: app.get(TypeormSessionStore),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(process.env['PORT'] ?? 3000);
}
void bootstrap();
