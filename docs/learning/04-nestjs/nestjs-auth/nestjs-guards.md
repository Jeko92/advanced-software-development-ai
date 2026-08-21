# NestJS Auth - Protecting Routes with Guards

The previous chapter built the auth module: a login endpoint that issues signed JWTs, and a `JwtStrategy` that verifies them. But at this point, every route in the application still accepts any request. This can be changed by adding guards to your routes.

A guard is a class that runs before a route handler and decides whether to let the request through. Guards sit between middleware and interceptors in the NestJS request lifecycle. They have access to the full execution context, which means they can inspect the request, read metadata attached to the route handler or controller, and make decisions based on both.

## canActivate()

Every guard implements a single method: `canActivate(context: ExecutionContext)`. When this method returns `true`, the request proceeds. When it returns `false`, NestJS sends a `403 Forbidden` response. When it throws an exception (most commonly an `UnauthorizedException`) NestJS responds with the corresponding status code, in this case `401 Unauthorized`.

`ExecutionContext` provides access to the underlying HTTP request. For HTTP applications this is an Express request object, so you can read headers, body, params, and properties set by middleware.

Here is a simple custom guard that checks whether the authenticated user has an admin role:

```typescript
// src/common/guards/is-admin.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.roles?.includes("admin") ?? false;
  }
}
```

Returning `false` is enough to block the request with a `403` response. Note that it reads `request.user`, which means it assumes a prior guard has already authenticated the user and attached that data to the request.

## JwtAuthGuard

`JwtAuthGuard` is NestJS's bridge between a guard and a Passport strategy. It extends `AuthGuard('jwt')`, where the string `'jwt'` names the `JwtStrategy` configured in the previous chapter. When a request arrives, the guard hands off to that strategy, which extracts and verifies the token. If the token is valid, `JwtStrategy.validate()` runs and its return value is attached to `req.user`. If the token is missing or invalid, the guard throws `UnauthorizedException`.

```typescript
// src/auth/jwt-auth.guard.ts
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
```

Since `JwtAuthGuard` extends `AuthGuard('jwt')`, it automatically handles JWT authentication using the `JwtStrategy` configured in the previous chapter. There is nothing else to configure; everything else is predefined by `AuthGuard('jwt')`.

Apply it to a route using `@UseGuards()`:

```typescript
// src/quotes/quotes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";

@Controller("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  findAll() {
    return this.quotesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createQuoteDto: CreateQuoteDto, @Request() req) {
    return this.quotesService.create(createQuoteDto, req.user.userId);
  }
}
```

`GET /quotes` is open since no guard is applied. `POST /quotes` is protected: the guard runs before `create()` and `req.user` contains the user data from `JwtStrategy.validate()`: `userId`, `username`, and `roles`.

We already used a guard in the previous chapter. In the `AuthController`, we added the local strategy with `@UseGuards(AuthGuard("local"))`.

## Global guard

Applying `@UseGuards(JwtAuthGuard)` to every protected route works but becomes repetitive as the application grows. NestJS lets you register a guard globally so it applies to every route automatically.

The correct way to do this when the guard has dependencies (like `Reflector`, used in the next section) is through the `APP_GUARD` provider token in `AppModule`:

```typescript
// src/app.module.ts
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Module({
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
```

With a global guard in place, every route requires a valid JWT by default. This includes the login endpoint, which obviously cannot require a token to reach. The `@Public()` decorator handles this.

## The @Public decorator

`@Public()` is a custom decorator that marks specific routes as exempt from the global guard. It works by attaching metadata to the route handler. The guard reads that metadata on every request and skips the token check when it is present.

Create the decorator:

```typescript
// src/common/decorators/public.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

`SetMetadata` attaches a key-value pair to the route handler's metadata. The guard will read this key to decide whether to proceed with authentication.

Update `JwtAuthGuard` to check for the metadata before running the token verification:

```typescript
// src/auth/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../common/decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
```

`getAllAndOverride` checks both the method-level and class-level metadata and returns the first value found. When `isPublic` is `true`, the method returns `true` immediately; the token check is skipped entirely. For all other routes, `super.canActivate(context)` runs the standard JWT verification.

Apply `@Public()` to routes that should not require authentication:

```typescript
// src/quotes/quotes.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Public } from "../common/decorators/public.decorator";
import { QuotesService } from "./quotes.service";
import { CreateQuoteDto } from "./dto/create-quote.dto";

@Controller("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Public()
  @Get()
  findAll() {
    return this.quotesService.findAll();
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.quotesService.findOne(id);
  }

  @Post()
  create(@Body() createQuoteDto: CreateQuoteDto, @Request() req) {
    return this.quotesService.create(createQuoteDto, req.user.userId);
  }
}
```

Now `GET /quotes` and `GET /quotes/:id` are marked public. `POST /quotes` has no `@Public()` decorator, so the global `JwtAuthGuard` applies and the request must carry a valid JWT.

The same `@Public()` decorator goes on the login endpoint in `AuthController`, since the user cannot have a token before logging in.
