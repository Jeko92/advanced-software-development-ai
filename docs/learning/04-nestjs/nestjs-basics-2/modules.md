# NestJS Basics 2 - Modules

A NestJS application starts from a single module called `AppModule` and grows outward. NestJS modules let you group everything related to a single business domain, for example users, products or orders, into its own self-contained unit. Each module owns its controllers, services, and repositories, and a file's location reflects the business concept it belongs to, not its technical role. This approach is called feature-based or domain-based structure, and it aligns with how NestJS's module system is designed to scale.

## Feature-based folder structure

A domain-based project has one folder per feature, each containing that feature's module, controller, service, and any supporting files:

```
src/
├── app.module.ts
├── main.ts
├── common/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   └── auth.service.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── entities/
└── products/
    ├── products.module.ts
    ├── products.controller.ts
    ├── products.service.ts
    └── entities/
```

The `common/` folder holds application-wide utilities that don't belong to any specific domain. Everything else lives in its feature folder.

Each feature folder can contain:

- A module file that declares what the feature provides and what it imports from elsewhere
- A controller that handles HTTP requests for that domain
- A service that holds the business logic for that domain
- A repository that handles data access for that domain
- An `entities/` subfolder for the data models belonging to that domain

## Imports and exports

Modules are isolated by default. A service defined in `UsersModule` cannot be injected into `ProductsModule` unless it is explicitly shared. Two arrays in `@Module()` control this:

- `exports` declares which of the module's own providers it makes available to other modules
- `imports` declares which other modules the current module depends on

For `UsersService` to be available outside `UsersModule`, it must appear in `exports`:

```typescript
// src/users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
```

For `ProductsModule` to use `UsersService`, it must list `UsersModule` in `imports`:

```typescript
// src/products/products.module.ts
import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [UsersModule],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
```

With `UsersModule` imported, NestJS's dependency injection system can resolve `UsersService` inside any provider within `ProductsModule`. As before, you declare it as a constructor parameter and NestJS provides the instance.

```typescript
// src/products/products.service.ts
import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class ProductsService {
  constructor(private readonly usersService: UsersService) {}

  getProductsWithOwners() {
    const users = this.usersService.getAllUsers();
    // ... business logic
  }
}
```

The pattern repeats for every feature: each module declares its own providers, exports what other modules need, and imports what it needs from others. The key point to remember here is that when a module needs a provider or service from another module, it must import that entire module and use the exported provider.

Finally, the `AppModule` imports all top-level feature modules to make the full application available at startup:

```typescript
// src/app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Resources

[NestJS Modules documentation](https://docs.nestjs.com/modules)
