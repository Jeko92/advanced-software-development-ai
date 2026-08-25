# NestJS RESTful Design - Request and Response DTOs

A DTO (Data Transfer Object) is a plain class whose only job is to describe the shape of data crossing a boundary. The boundary in question is the HTTP edge of the API: a request body coming in or a response going out. DTOs carry no business logic. They are just typed fields with decorators attached.

Two distinct DTOs sit at each endpoint that accepts or returns a structured payload. The request DTO defines what the client is allowed to send. The response DTO defines what the server is willing to return. Conflating the two, or returning the entity directly, is one of the most common shortcuts that bites a junior team six months in. The entity carries internal fields (created timestamps, soft-delete flags, internal status enums, sometimes password hashes) that have no business being part of the public API. And the moment the database schema changes, every client breaks.

Request DTOs and response DTOs solve different problems and use different libraries. Request DTOs lean on `class-validator` to reject bad input before it ever reaches a handler. Response DTOs lean on `class-transformer` to whitelist the fields that ship to the client. Both libraries are decorator-driven, and both come pre-wired into NestJS once `class-validator` and `class-transformer` are installed alongside `@nestjs/common`.

The example continues with the Concert resource. The endpoints already exist (POST, PATCH, GET). The DTOs below give each endpoint a precise contract for which fields it accepts and which fields it returns, with the rules attached to the class rather than scattered through controller code.

## Request DTOs and validation decorators

A request DTO is a class with `class-validator` decorators on its fields. Each decorator declares a rule the incoming JSON must satisfy.

```typescript
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsPositive,
  IsIn,
  MaxLength,
} from "class-validator";

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  artist: string;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsDateString()
  date: string;

  @IsPositive()
  ticketPrice: number;

  @IsIn(["rock", "jazz", "classical", "electronic", "pop"])
  genre: string;
}
```

Each decorator is one isolated check. A field can carry several stacked on it. The framework runs them all and collects every failure into one response. The decorators that come up most often:

- `@IsString()`, `@IsNumber()`, `@IsBoolean()` for the primitive type checks.
- `@IsNotEmpty()` to reject empty strings and null values.
- `@MaxLength(n)`, `@Min(n)`, `@Max(n)` for size and range constraints.
- `@IsEmail()`, `@IsUUID()`, `@IsDateString()`, `@IsUrl()` for format checks on common patterns.
- `@IsIn([...])` to restrict a string to a fixed set of values.
- `@IsOptional()` for fields that may or may not be present.

Notice what is missing from `CreateConcertDto`: the `id`. A client creating a concert does not get to choose the primary key. The database assigns it. The DTO encodes that rule by not exposing the field at all. The same logic applies to `createdAt` or any other server-generated field. Derived data does not belong on a request DTO.

The validation only runs when NestJS's `ValidationPipe` is enabled. The short version: configure the pipe once in `main.ts`, and every controller method that takes a DTO-typed `@Body()` parameter is automatically validated. Pipes get their own file.

## PartialType for update endpoints

A PATCH endpoint should accept a subset of the fields that the create endpoint requires. Rewriting every decorator with `@IsOptional()` would be tedious and error-prone, so NestJS ships a helper for the common case:

```typescript
import { PartialType } from "@nestjs/mapped-types";
import { CreateConcertDto } from "./create-concert.dto";

export class UpdateConcertDto extends PartialType(CreateConcertDto) {}
```

`PartialType` returns a class with every field of the parent DTO marked as optional. The validation rules carry over: a `genre` provided in a PATCH still has to be one of the allowed values. The rules just no longer fire when the field is absent.

This pattern is standard across NestJS codebases. A `CreateXxxDto` paired with `UpdateXxxDto = PartialType(CreateXxxDto)` removes a pile of boilerplate and keeps the two DTOs in sync whenever new fields get added.

## Response DTOs and the leaky-entity problem

Returning a TypeORM entity straight from a controller method ships every column the database knows about to the client. For the Concert entity, that is harmless. For a `User` entity with a `passwordHash` column, an `internalNotes` column, or a `lastSeenIp` column, it is a data leak.

Even when no field is genuinely sensitive, returning the entity directly creates a coupling problem. The day the schema gains a `legacyMigrationToken` column, every client consuming the API receives a new field they did not ask for. Adding columns to the database becomes a breaking change for the public API.

A response DTO is the explicit contract for what the API will return. It is a class with `class-transformer` decorators that declare which fields are allowed through the serializer:

```typescript
import { Expose, Type } from "class-transformer";

export class ConcertResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  artist: string;

  @Expose()
  venue: string;

  @Expose()
  @Type(() => Date)
  date: Date;

  @Expose()
  ticketPrice: number;

  @Expose()
  genre: string;
}
```

The whitelist approach is what makes this safe. `@Expose()` opts a field in. Any column on the entity that does not appear on the DTO is dropped on the way out. Adding `internalNotes` to the entity later does not accidentally publish it. The DTO has to explicitly say yes.

`@Type(() => Date)` tells `class-transformer` to construct a real `Date` from the underlying column value. Without it, the field stays whatever the database driver returned, which may be a string.

## ClassSerializerInterceptor and serializing responses

`class-transformer` only runs when something invokes it. NestJS provides `ClassSerializerInterceptor` for that. Register it globally in `main.ts`:

```typescript
import { NestFactory, Reflector } from "@nestjs/core";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

`excludeExtraneousValues: true` is the option that activates the whitelist behavior. Without it, every field on the source object flows through, and `@Expose()` becomes cosmetic. With it, only fields decorated with `@Expose()` survive the serialization step.

The cleanest pattern for a junior-friendly codebase is to map explicitly in the service using `plainToInstance`:

```typescript
import { plainToInstance } from "class-transformer";
import { ConcertResponseDto } from "./dto/concert-response.dto";

// inside ConcertsService
async findOne(id: string): Promise<ConcertResponseDto | null> {
  const concert = await this.concertsRepository.findOneBy({ id });
  if (!concert) return null;
  return plainToInstance(ConcertResponseDto, concert, {
    excludeExtraneousValues: true,
  });
}
```

`plainToInstance` constructs a `ConcertResponseDto` from the entity and applies the same whitelist rule. The result is a plain object containing only the seven fields the DTO opted in. Whatever else the entity carries stays inside the service boundary.

> **_:exclamation: Watch out:_** Forgetting `excludeExtraneousValues: true` is the most common DTO bug in NestJS codebases. The pipeline still appears to work because the response is well-formed, but every field on the entity sneaks through. A `User.passwordHash` lands in the JSON response and no test catches it because the DTO class itself looks correct. Set the option in both the interceptor configuration and in every `plainToInstance` call.

## Resources

[class-validator, validation decorators](https://github.com/typestack/class-validator#validation-decorators)

[NestJS docs, Validation](https://docs.nestjs.com/techniques/validation)

[NestJS docs, Mapped types](https://docs.nestjs.com/openapi/mapped-types)
