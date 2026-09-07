import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * One pipe, applied to every route, is what makes the DTOs binding rather
   * than decorative:
   *  - `whitelist` strips any property the DTO does not declare;
   *  - `forbidNonWhitelisted` upgrades that from silent stripping to a 400, so
   *    a client that sends `seller` learns it is not allowed to;
   *  - `transform` turns the incoming plain object into an instance of the DTO
   *    class, which is what makes `@Type(() => Number)` and default values work.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Swagger reads the same decorators the validation pipe does, so the docs
   * cannot drift from the rules the server actually enforces.
   *
   * `addBearerAuth()` is what puts the Authorize button in the UI: paste a JWT
   * once and every route marked `@ApiBearerAuth()` becomes testable in place.
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('DarkBay API')
    .setDescription(
      'An auction API. Browsing is public; listing an item and placing a bid require a bearer token from `POST /auth/login`.',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Paste the `accessToken` returned by /auth/login.',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    // Keeps the pasted token across page reloads.
    swaggerOptions: { persistAuthorization: true },
  });

  const port = app.get(ConfigService).get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`DarkBay API listening on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api`);
}
bootstrap();
