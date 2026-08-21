# NestJS Auth - Challenges

## Cyber Chat: Implement JWT Authentication

The current chat has no security layer. Any person who knows the endpoints can use them. Add JWT-based authentication to make the API secure.

**Packages you'll need:**

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

### Task 1: Add a User Module

- Generate the module, service, and controller: `nest g module users`, `nest g service users`, `nest g controller users`
- Create a `User` entity with at least: `id`, `username` (unique), and `passwordHash`
- **Never store passwords in plain text**. Hash them with `bcrypt` before persisting (use a salt round of 10 or higher)
- Create a `createUser` service method that accepts `CreateUserDto` with `username` and `password` fields
- Expose a `findByUsername(username: string)` method on `UsersService` for the auth module to consume. export it from `UsersModule` so other modules can inject it
- Use a response DTO or a class-transformer `@Exclude()` decorator on `passwordHash` so it never leaks through serialization

### Task 2: Add an Auth Module

- Generate the module, service, and controller: `nest g module auth`, `nest g service auth`, `nest g controller auth`
- Import `UsersModule` into `AuthModule` so you can inject `UsersService`
- Configure `JwtModule` with `registerAsync()` to use `ConfigService` so the secret comes from `ConfigService` (not hardcoded). Set a sensible `expiresIn` like `'1h'`
- Create the local and JWT strategies:
  - Create a `LocalStrategy` extending `PassportStrategy(Strategy)` from `passport-local`:
  - Use `ExtractJwt.fromAuthHeaderAsBearerToken()`
  - The `validate()` method should return the user info that will be attached to `request.user`
  - Create a `JwtStrategy` extending `PassportStrategy(Strategy)` from `passport-jwt`
  - Use `ExtractJwt.fromAuthHeaderAsBearerToken()`
  - The `validate()` method should return the user info that will be attached to `request.user`
- Setup the `AuthService` to use the local and JWT strategies
  - Add a validateUser method that accepts `username` and `password` and calls `UsersService.findByUsername()`
  - Add a login method that accepts `user` and calls `this.jwtService.sign()`
- Create the `AuthController`:
  - Create a `register` endpoint that accepts a `CreateUserDto` (`username`, `password`) validated with class-validator and calls `UsersService.create()`
  - Create a `login` endpoint that accepts a `LoginDto` (`username`, `password`) validated with class-validator. It should call `this.authService.login()` with `req.user`.
  - Decorate the `login` endpoint with `@UseGuards(AuthGuard('local'))` to trigger the local strategy.
  - Create a `me` endpoint that returns the authenticated user.

### Task 3: Protect Routes with Guards

- Create a `JwtAuthGuard` extending `AuthGuard('jwt')`
- Apply the guard to all chat endpoints with `@UseGuards(JwtAuthGuard)`, either per-controller or per-route.
- `POST /auth/login` needs to use the local strategy and the user registration endpoint `POST /auth/login` should stay unprotected.

**Tip:** If most of your API should be protected, register `JwtAuthGuard` as a global guard in `AppModule` and use a `@Public()` custom decorator with `Reflector` to opt specific endpoints out (login, registration). This is cleaner than sprinkling `@UseGuards` everywhere.

### Task 4: Replace the dummy author with the authenticated user

- Update your threads and comments services to use the authenticated username instead of a dummy author. Adapt the method parameters if necessary.
- Make sure that only users who own a comment or thread can edit or delete it.

### Testing with API Client

Test if you can register, login, and get the authenticated user with your API client.
