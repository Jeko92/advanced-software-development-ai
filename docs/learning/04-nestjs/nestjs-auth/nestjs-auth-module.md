# NestJS Auth - Building the Auth Module

A NestJS application handles authentication through a dedicated `AuthModule`. This module is the single place where login logic lives. It validates credentials, issues tokens, and defines the rules for how incoming JWTs are verified on protected requests.

NestJS delegates the mechanics of authentication to Passport, a Node.js authentication library. Passport works with interchangeable strategies; each strategy is a class that defines how a specific kind of credential should be handled. This session uses two:

- `LocalStrategy` runs once on login. It receives the username and password the client submits and validates them against the database.
- `JwtStrategy` runs on every subsequent request to a protected route. It extracts the JWT from the request header, verifies the signature, and returns the user data that becomes available as `req.user` in the route handler.

The two strategies handle different moments in the same flow: the user proves who they are once (`LocalStrategy`), and then the server trusts the signed token on every follow-up request (`JwtStrategy`) without checking the database again.

## Package installation

Install the required packages:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-local passport-jwt
npm install --save-dev @types/passport-jwt @types/passport-local
```

- `@nestjs/jwt` provides `JwtService`, which signs and verifies tokens.
- `@nestjs/passport` is the NestJS adapter for Passport.
- `passport` is the base library.
- `passport-local` is the strategy for username/password login.
- `passport-jwt` is the strategy for JWT verification.

> The corresponding `@types` packages provide TypeScript type definitions and are only needed during development.

Generate the auth module, service, and controller:

```bash
nest g module auth
nest g service auth
nest g controller auth
```

## AuthModule configuration

The AuthModule holds every piece of authentication logic: The AuthService for verifying credentials and issuing tokens, the LocalStrategy for login, and the JwtStrategy for subsequent requests as well as the controller and the auth endpoints. None of exist jet, we will create them in the next steps.
`AuthModule` also imports the library modules `PassportModule` and `JwtModule`.

```typescript
// src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

`JwtModule.register()` takes two configuration values:

- `secret`: the key used to sign and verify tokens. Always read this from an environment variable; hardcoding a secret in source code is a security risk.
- `signOptions.expiresIn`: how long a token remains valid. Accepts a number of seconds or a string like `'1d'` for one day. Shorter values reduce the window of exposure if a token is stolen.

`UsersModule` is imported so that `UsersService` is available for injection inside `AuthService`. Both strategies are listed as providers so NestJS can instantiate and inject them. `JwtModule` is exported so other modules can inject `JwtService` if needed.

## Extend the `UserService`

Our `UserService` needs a `findByUserName` method which is required by the `LocalStrategy`:

```typescript
// src/users/users.service.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  // ...
  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }
}
```

## AuthService

`AuthService` has two responsibilities: verifying credentials and issuing tokens.

```typescript
// src/auth/auth.service.ts
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

`validateUser` fetches the user by username and uses `bcrypt.compare` to check the submitted password against the stored hash. Passwords must always be stored as bcrypt hashes, never in plain text. If validation succeeds, the password field is removed from the result before it is attached to `req.user`.

`login` builds the JWT payload from the validated user and signs it with `JwtService.sign()`. The `sub` claim holds the user's database ID, following the JWT convention of using `sub` for the subject identifier.

## Authentication Strategies

Passport uses strategies to handle different authentication flows. Each strategy is a class that defines how a specific kind of credential should be handled. We need two strategies: One "local" strategy for login that does not depend on a JWT (since the token is generated after a successful login), and one "JWT" strategy for subsequent requests.

### LocalStrategy

`LocalStrategy` runs when a request hits the login endpoint. It calls `AuthService.validateUser()` with the submitted username and password. If validation fails, it throws `UnauthorizedException`. If it succeeds, it returns the user object, which Passport then attaches to `req.user`.

```typescript
// src/auth/local.strategy.ts
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }
}
```

### JwtStrategy

`JwtStrategy` runs on every request to a protected route. It extracts the JWT from the `Authorization` header, verifies the signature against the same secret used to sign it, and checks the expiration. If the token is valid, its `validate()` method is called with the decoded payload. The return value is attached to `req.user` in the route handler.

```typescript
// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
```

The three configuration options:

- `jwtFromRequest`: where to look for the token. `fromAuthHeaderAsBearerToken()` reads `Authorization: Bearer <token>`, which is the standard location.
- `ignoreExpiration`: when `false`, tokens past their `exp` claim are rejected automatically. Always keep this `false` in production.
- `secretOrKey`: must match the secret in `JwtModule.register()`.

`validate()` receives the already-decoded payload and returns only the fields that route handlers need: the user's ID, username, and roles. This trimmed object is what `req.user` contains in every handler that runs behind a JWT guard.

With `LocalStrategy` and `JwtStrategy` in place, the auth module can issue tokens and verify them.

By default, `passport-local` reads `username` and `password` fields from the request body. If your login form uses different field names, pass `usernameField` or `passwordField` as options to `super()`.

## AuthController

`AuthController` exposes the login endpoint. The `@UseGuards(AuthGuard('local'))` decorator triggers `LocalStrategy`, which validates the credentials before the handler runs (more on AuthGuards in the next chapter). On success, the guard attaches `req.user` with the validated user object to the request, and `AuthService.login()` returns the signed token.

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Body } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req, @Body() _loginDto: LoginDto) {
    return this.authService.login(req.user);
  }
}
```

`LoginDto` validates the incoming request body before Passport processes it:

```typescript
// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

## Security considerations

1. The `JWT_SECRET` environment variable must be a long, randomly generated string. A short or guessable secret makes it possible to forge valid tokens. Store it in a secrets manager or environment configuration, not in version-controlled files.

2. Set a short expiration time on tokens. Setting the expiration to hours rather than days reduces the damage if a token is stolen. For longer sessions, implement a refresh token flow: a long-lived token stored server-side that can be exchanged for a new short-lived access token without re-login.

3. Passwords must be stored as bcrypt hashes with a work factor of 10 or higher. bcrypt is intentionally slow, which makes brute-force attacks expensive. Never use MD5, SHA-1, or SHA-256 for passwords.

4. Run all traffic over HTTPS in production. Without transport encryption, tokens in `Authorization` headers are readable to anyone on the network path.
