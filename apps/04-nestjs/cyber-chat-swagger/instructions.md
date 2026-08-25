# Swagger setup for cyber-chat-swagger

Step-by-step guide for the `challenges.md` exercise ("Document the Cyber Chat
API"), written against this project's actual files. This is a guide, not a
diff — you do the implementing.

## Starting point check

The copy from `cyber-chat-jwt-authentication` is a correct base:
`package.json`, `tsconfig.json`, `nest-cli.json`, `eslint.config.mjs` and the
Bruno collection are already aligned with the monorepo, no bun/npm leftovers,
no stray absolute imports. You can `pnpm install`, `pnpm migration:run`,
`pnpm seed`, `pnpm dev` today and it runs. Nothing needs fixing before you
start — except one thing the handout doesn't warn you about:

### ⚠️ Do not enable the `@nestjs/swagger` CLI plugin

`nestjs-swagger.md` and `challenges.md` both tell you to add
`"plugins": ["@nestjs/swagger"]` to `nest-cli.json` so DTO metadata is
inferred automatically. **Don't — it will crash this app at boot.**

Here's why: the plugin generates a static `_OPENAPI_METADATA_FACTORY()` on
every class it touches, and whenever a property's type is a class imported
from another file, it emits a lazy `require("../other-file", { with: {
"resolution-mode": "import" } })` instead of a normal import (this is how it
avoids ESM circular-import ordering issues). That codegen assumes CommonJS.
This repo's shared `@bootcamp/tsconfig` compiles to `NodeNext` +
`"type": "module"`, so at runtime Node throws:

```
ReferenceError: require is not defined in ES module scope
```

This project has several cross-file class properties that will trigger it:

- `Thread.comments: Comment[]` and `Thread.authorUser: User` (`src/threads/entities/threads.entity.ts`)
- `Comment.thread: Thread` and `Comment.authorUser: User` (`src/comments/entities/comments.entity.ts`)
- `ThreadWithCommentsResponseDto.comments: CommentResponseDto[]` (`src/threads/dto/thread-with-comments-response.dto.ts`)

I hit this exact failure earlier while adding Swagger to the `nestjs-swagger`
demo project and confirmed the only reliable fix is: **leave the plugin out
of `nest-cli.json`, and add `@ApiProperty()` decorators by hand everywhere.**
This is not a workaround of last resort — it's the documented fallback in
`nestjs-swagger.md` itself ("The plugin only runs when the Nest CLI build is
used... you have to fall back to manual decorators"), it's just that here the
trigger is the monorepo's ESM setup rather than a custom webpack build.

Practical effect: budget time for decorating every DTO property by hand
(Step 4 below) — there's no shortcut here.

## Step 1 — Install the package

```bash
cd apps/04-nestjs/cyber-chat-swagger
pnpm add @nestjs/swagger
```

## Step 2 — Bootstrap Swagger UI in `main.ts`

In `src/main.ts`, after `app.useGlobalInterceptors(...)` and before
`app.listen(...)`:

```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Cyber Chat API')
  .setDescription('Threads, comments, and users with JWT authentication')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

`addBearerAuth()` registers the `bearerAuth` security scheme — this is what
makes the "Authorize" button appear in Swagger UI. Nothing else in
`main.ts` needs to change.

## Step 3 — Leave `nest-cli.json` alone

Per the warning above, do **not** add a `plugins` array to
`nest-cli.json`. Leave it as:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

## Step 4 — Decorate every DTO with `@ApiProperty`

None of the DTOs currently have any `@ApiProperty`/`@ApiPropertyOptional`
decorators — they only carry `class-validator`/`class-transformer`
decorators. Without the CLI plugin, Swagger UI will show an empty `{}`
schema for any class with zero `@ApiProperty` decorators, so every field on
every DTO that's used in a request body or response needs one. Below is the
exact decorated form for every file — add the `@ApiProperty`/
`@ApiPropertyOptional` import and the decorator itself; everything else
(the existing validators, `!`, etc.) stays as-is.

### Request DTOs

**`src/threads/dto/create-thread.dto.ts`**

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateThreadDto {
  @ApiProperty({ maxLength: 150, example: 'Best encryption algorithm?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({
    maxLength: 4000,
    example: 'AES-256 vs ChaCha20 — what would you run in production?',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  body!: string;
}
```

**`src/comments/dto/create-comment.dto.ts`**

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ maxLength: 2000, example: 'ChaCha20, no contest.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  body!: string;
}
```

**`src/users/dto/create-user.dto.ts`**

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'neo' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ minLength: 8, format: 'password', example: 'wakeUpNeo123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
```

**`src/auth/dto/login.dto.ts`**

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ format: 'password', example: 'admin12345' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
```

**`src/common/dto/pagination-query.dto.ts`** — every field here is optional,
so use `@ApiPropertyOptional` (shorthand for `@ApiProperty({ required: false })`):

```ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;

  @ApiPropertyOptional({ enum: ['createdAt', '-createdAt'] })
  @IsOptional()
  @IsIn(['createdAt', '-createdAt'])
  sort?: 'createdAt' | '-createdAt';

  @ApiPropertyOptional({ description: 'Filter by author username' })
  @IsOptional()
  author?: string;

  @ApiPropertyOptional({
    format: 'date-time',
    description: 'Only return threads created on or after this date',
  })
  @IsOptional()
  startDate?: string;
}
```

`UpdateThreadDto`/`UpdateCommentDto`/`UpdateUserDto` extend
`PartialType(CreateXDto)` — `PartialType` copies the base class's
`@ApiProperty` metadata and flips `required` to `false` automatically, so
those three files need no changes once their base DTOs are decorated.

### Response DTOs (all currently only `@Expose()`/`@Type()`)

**`src/threads/dto/thread-response.dto.ts`**

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ThreadResponseDto {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Best encryption algorithm?' })
  @Expose()
  title!: string;

  @ApiProperty({
    example: 'AES-256 vs ChaCha20 — what would you run in production?',
  })
  @Expose()
  body!: string;

  @ApiProperty({ format: 'uuid' })
  @Expose()
  authorId!: string;

  @ApiProperty({ example: 'admin' })
  @Expose()
  author!: string;

  @ApiProperty({ format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
```

**`src/threads/dto/thread-with-comments-response.dto.ts`** — the parent's
fields are inherited automatically (no need to redeclare them); only the new
`comments` field needs its own `@ApiProperty`. The `() =>` lazy-factory form
is required for the cross-file `CommentResponseDto` reference — that's
normal, safe `@ApiProperty` usage and unrelated to the broken plugin codegen
warned about above:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { ThreadResponseDto } from './thread-response.dto.ts';
import { Expose, Type } from 'class-transformer';
import { CommentResponseDto } from '../../comments/dto/comment-response.dto.ts';

export class ThreadWithCommentsResponseDto extends ThreadResponseDto {
  @ApiProperty({ type: () => CommentResponseDto, isArray: true })
  @Expose()
  @Type(() => CommentResponseDto)
  comments!: CommentResponseDto[];
}
```

**`src/comments/dto/comment-response.dto.ts`**

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CommentResponseDto {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ format: 'uuid' })
  @Expose()
  threadId!: string;

  @ApiProperty({ example: 'ChaCha20, no contest.' })
  @Expose()
  body!: string;

  @ApiProperty({ format: 'uuid' })
  @Expose()
  authorId!: string;

  @ApiProperty({ example: 'admin' })
  @Expose()
  author!: string;

  @ApiProperty({ format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}
```

**`src/users/dto/user-response.dto.ts`**

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { UserRole } from '../entities/user.entity.ts';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'admin' })
  @Expose()
  username!: string;

  @ApiProperty({ enum: ['viewer', 'editor', 'admin'], isArray: true })
  @Expose()
  roles!: UserRole[];
}
```

## Step 5 — Give the paginated thread list a real response type

`ThreadsController.getAll()` (`src/threads/threads.controller.ts`) returns
whatever `ThreadsService.getAll()` builds: `{ data: ThreadResponseDto[],
meta: { page, limit, total, totalPages } }`. There's no class for that shape
today, and `@ApiOkResponse` needs a real type to point at. Add a small DTO,
e.g. `src/threads/dto/paginated-threads-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';
import { ThreadResponseDto } from './thread-response.dto.ts';

class PaginationMetaDto {
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty() total!: number;
  @ApiProperty() totalPages!: number;
}

export class PaginatedThreadsResponseDto {
  @ApiProperty({ type: () => ThreadResponseDto, isArray: true })
  data!: ThreadResponseDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
```

Use it in `@ApiOkResponse({ type: PaginatedThreadsResponseDto })` on
`getAll()` in Step 6.

## Step 6 — Decorate the controllers

Global guard note: `JwtAuthGuard` is applied app-wide via `APP_GUARD`
(`src/app.module.ts`), and only routes marked `@Public()` skip it — that's
`POST /auth/register` and `POST /auth/login`. Everything else already
requires a bearer token, so:

- Add `@ApiBearerAuth()` at the **class** level on `ThreadsController`,
  `CommentsController`, and `UsersController` (every route in each is
  protected).
- On `AuthController`, add `@ApiBearerAuth()` only to the `me()` method —
  `register`/`login` are `@Public()` and shouldn't show the lock icon.

For every handler, add one `@ApiOperation({ summary })` and at least one
success + one realistic error response. Route-by-route:

**`src/threads/threads.controller.ts`**
| Route | Decorators to add |
|---|---|
| `GET /threads` | `@ApiOperation`, `@ApiOkResponse({ type: PaginatedThreadsResponseDto })`, plus `@ApiQuery()` for each of `page`, `limit`, `sort`, `author`, `startDate` — **manual `@ApiQuery` is required here**: without the CLI plugin, `@Query() dto: PaginationQueryDto` does not auto-expand into documented query params the way a `@Body() dto` auto-documents a request body |
| `GET /threads/:id` | `@ApiOperation`, `@ApiOkResponse({ type: ThreadWithCommentsResponseDto })`, `@ApiNotFoundResponse` |
| `POST /threads` | `@ApiOperation`, `@ApiCreatedResponse({ type: ThreadResponseDto })`, `@ApiBadRequestResponse` |
| `PATCH /threads/:id` | `@ApiOperation`, `@ApiOkResponse({ type: ThreadResponseDto })`, `@ApiNotFoundResponse`, `@ApiForbiddenResponse` (ownership check can reject) |
| `POST /threads/:id/comments` | `@ApiOperation`, `@ApiCreatedResponse({ type: CommentResponseDto })`, `@ApiNotFoundResponse`, `@ApiBadRequestResponse` |
| `DELETE /threads/:id` | `@ApiOperation`, `@ApiNoContentResponse()` (204, no `type`), `@ApiNotFoundResponse`, `@ApiForbiddenResponse` |

**`src/comments/comments.controller.ts`**
| Route | Decorators to add |
|---|---|
| `GET /comments/:id` | `@ApiOperation`, `@ApiOkResponse({ type: CommentResponseDto })`, `@ApiNotFoundResponse` |
| `PATCH /comments/:id` | `@ApiOperation`, `@ApiOkResponse({ type: CommentResponseDto })`, `@ApiNotFoundResponse`, `@ApiForbiddenResponse` |
| `DELETE /comments/:id` | `@ApiOperation`, `@ApiNoContentResponse()`, `@ApiNotFoundResponse`, `@ApiForbiddenResponse` |

**`src/users/users.controller.ts`**
| Route | Decorators to add |
|---|---|
| `POST /users` | `@ApiOperation`, `@ApiCreatedResponse({ type: UserResponseDto })`, `@ApiBadRequestResponse` |
| `GET /users` | `@ApiOperation`, `@ApiOkResponse({ type: UserResponseDto, isArray: true })`, `@ApiForbiddenResponse` (viewer role is rejected — see `UsersService.findAll`) |
| `GET /users/:id` | `@ApiOperation`, `@ApiOkResponse({ type: UserResponseDto })`, `@ApiNotFoundResponse` |
| `PATCH /users/:id` | `@ApiOperation`, `@ApiOkResponse({ type: UserResponseDto })`, `@ApiNotFoundResponse`, `@ApiForbiddenResponse` |
| `DELETE /users/:id` | `@ApiOperation`, `@ApiNoContentResponse()`, `@ApiNotFoundResponse`, `@ApiForbiddenResponse` |

**`src/auth/auth.controller.ts`**
| Route | Decorators to add |
|---|---|
| `POST /auth/register` | `@ApiOperation`, `@ApiCreatedResponse({ type: UserResponseDto })`, `@ApiBadRequestResponse` |
| `POST /auth/login` | `@ApiOperation`, `@ApiOkResponse` with an inline schema or a small `LoginResponseDto` for `{ access_token: string }`, `@ApiUnauthorizedResponse` |
| `GET /auth/me` | `@ApiBearerAuth()`, `@ApiOperation`, `@ApiOkResponse` (returns `Omit<User, 'passwordHash'>` — reuse `UserResponseDto`, note it's slightly inaccurate in that the raw `req.user` isn't run through `plainToInstance`, but it's the closest existing type), `@ApiUnauthorizedResponse` |

`AppController.getHello()` is unprotected and trivial — a one-line
`@ApiOperation` is enough, no error responses to document.

`POST /auth/login`'s response is `{ access_token: string }`, which has no
existing DTO — add `src/auth/dto/login-response.dto.ts`:

```ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT bearer token' })
  access_token!: string;
}
```

## Step 7 — Verify in the browser

```bash
pnpm dev
```

- Open `http://localhost:3000/api` — every controller should be a
  collapsible section with no empty schemas.
- "Try it out" on `POST /auth/login` with a seeded user
  (`admin` / `admin12345` from `src/db/seed-data.ts`) and confirm you get a
  real `access_token` back.
- Click "Authorize", paste the token, and confirm `GET /threads` (or any
  protected route) now succeeds from the UI instead of 401ing.
- Skim `http://localhost:3000/api-json` and check that `ThreadResponseDto`,
  `CommentResponseDto`, etc. show up under `components/schemas` with actual
  properties, not `{}`.

## Step 8 — Housekeeping

```bash
pnpm lint
pnpm typecheck
pnpm format:check   # pnpm format:write if it complains
pnpm build           # rebuild and confirm no `require(` shows up in dist/**/*.js
```

The last check matters here specifically: if you ever do turn the CLI plugin
back on by mistake, `grep -rn "require(\"\.\./" dist/` will show you exactly
where it reappears before you even boot the app.

## Optional (from `challenges.md`)

- Paste `http://localhost:3000/api-json`'s contents into
  `editor.swagger.io` and confirm it validates with no errors.
- `npx @openapitools/openapi-generator-cli generate -i http://localhost:3000/api-json -g typescript-fetch -o ./client`
  and write a small script that calls one endpoint with the generated
  client.
