# NestJS RESTful Design - Validation Pipes

A pipe is a class that NestJS runs against an incoming argument before the controller method receives it. The pipe can do one of two things: validate the argument (and throw if it fails) or transform it into something more useful, like a string into a number or a parsed JSON object into a DTO instance. Sitting between the request parser and the handler, pipes are the natural place to enforce input rules. By the time a handler runs, every value handed to it has already been checked or converted.

Without pipes configured, the validation decorators on a DTO are documentation. They describe what the field should look like, but nothing enforces the rules at runtime. The same gap exists for path parameters. Typing one as `number` is a TypeScript fiction; the value still arrives as a string and the database query fails with a confusing error message. Pipes are the runtime enforcement layer that closes both gaps.

Two pipes do almost all the work in practice. `ValidationPipe` covers request bodies. It converts the parsed JSON into an instance of the DTO class and runs the `class-validator` decorators on it. The parse pipes (`ParseUUIDPipe`, `ParseIntPipe`, `ParseBoolPipe`) cover path and query parameters where the raw value is a string and the handler needs something more specific. Configured once and applied where they belong, these two cover the request boundary for most CRUD APIs.

## Pipes in the request lifecycle

Pipes occupy a fixed slot in the NestJS request pipeline. Middleware runs first, handling concerns like body parsing and CORS. Guards run next, deciding whether the request is allowed through at all. Then pipes run on each argument the handler will receive. Interceptors wrap the handler in a pre/post sandwich, and the handler itself runs in the middle. Whatever it returns flows back through the interceptors and out as the response.

That position is what makes pipes the right place for input validation. They fire before any business logic, but after the request body has been parsed into a usable object. A pipe that throws a `BadRequestException` short-circuits the rest of the pipeline. The handler never runs, the database is never touched, and the client receives a 400 response with the validation failures as the message body.

Pipes only see one argument at a time. NestJS calls the pipe's `transform(value, metadata)` method once per decorated parameter. Whatever the pipe returns, or the exception it throws, is what the handler sees in that position.

## ValidationPipe and the global configuration

`ValidationPipe` handles every controller method that takes a DTO-typed parameter. Register it once in `main.ts`:

```typescript
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

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

  await app.listen(3000);
}
bootstrap();
```

Each option earns its place:

- `whitelist: true` strips properties that are not declared on the DTO. If a client sends `{ title, artist, hackerField: "x" }` and the DTO only declares `title` and `artist`, the extra field is silently dropped before the handler runs.
- `forbidNonWhitelisted: true` upgrades that silent drop into a 400 response that tells the client exactly which property was unexpected. Useful during development; defensible in production.
- `transform: true` converts the plain JSON object into an actual instance of the DTO class. Without this, `@Body() dto: CreateConcertDto` gives the handler a plain object that happens to share the DTO's property names, not a real instance of the class.
- `transformOptions: { enableImplicitConversion: true }` lets the pipe force primitive types based on TypeScript declarations. A query string `?page=2` arrives as `"2"`. With implicit conversion enabled, a DTO field declared as `page: number` receives the actual number `2`.

Once registered, `ValidationPipe` stays silent until it has work to do. The decorators on each DTO class are what tell it what to enforce.

> **_:exclamation: Watch out:_** `transform: true` is non-negotiable when DTOs are paired with `class-validator`. The validator can only check decorators on a class instance, and without `transform`, the body never becomes one. A DTO that looks well-decorated will fail to validate at runtime, and the bug is almost invisible because nothing throws. Set the option and forget it.

## Parse pipes for path and query parameters

Path and query parameters arrive as strings. The parse pipes convert them to richer types and reject malformed input in the same step.

```typescript
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  ParseIntPipe,
} from "@nestjs/common";

@Controller("concerts")
export class ConcertsController {
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    // id is guaranteed to be a syntactically valid UUID
  }

  @Get("by-year/:year")
  findByYear(@Param("year", ParseIntPipe) year: number) {
    // year is guaranteed to be an integer
  }
}
```

The built-ins:

- `ParseUUIDPipe` rejects any value that is not a syntactically valid UUID. A request to `/concerts/abc` returns a 400 before the handler runs.
- `ParseIntPipe` converts the string to a number. `/by-year/notanumber` produces a 400.
- `ParseBoolPipe` accepts `'true'`, `'false'`, `'1'`, `'0'` and returns the corresponding boolean.
- `ParseFloatPipe`, `ParseArrayPipe`, and `ParseEnumPipe` cover less common cases where the parameter is a decimal, a comma-separated list, or a value from a fixed set.

These pipes are scoped to a single argument. Stacking them onto each `@Param` or `@Query` that needs one is the right pattern. There is no global setting that auto-applies them based on the parameter's TypeScript type.

## Custom pipes when the built-ins are not enough

A custom pipe implements the `PipeTransform` interface and gets registered exactly like a built-in. The most common reason to write one is a domain rule that goes beyond syntactic validation. A `ConcertExistsPipe`, for example, could turn an incoming UUID into the loaded entity (failing with 404 if the ID is unknown), saving every handler the same boilerplate database lookup.

For most APIs, `ValidationPipe` and the parse pipes cover the request boundary completely. Reach for a custom pipe when the same check shows up in three or more handlers and the duplication starts to hurt.

## Resources

[NestJS docs, Pipes](https://docs.nestjs.com/pipes)

[NestJS docs, Validation](https://docs.nestjs.com/techniques/validation)
