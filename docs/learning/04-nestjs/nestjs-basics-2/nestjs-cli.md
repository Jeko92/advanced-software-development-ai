# NestJS Basics 2 - NestJS CLI

NestJS's biggest strength, its clear structure, can also be its biggest painpoint. Every new domain requires creating files manually, writing the class skeleton, applying the correct decorators, and updating the module's `@Module()` decorator to register the new class. To make this process more streamlined, the NestJS maintainers developed a cli tool called the NestJS CLI. It reduces the whole sequence to a few commands.

## Installation

Allthough the cli can be called withouth installing it via npx, it is recommended to install it globally using npm:

```bash
npm install -g @nestjs/cli
```

After that you can use the `nest` command to generate feature modules, services, and controllers.

## Generating feature modules

Running `nest g module`, `nest g service`, and `nest g controller` for the same feature name sets up a self-contained feature directory:

```bash
nest g module users
nest g service users
nest g controller users
```

The module command creates the directory and the module file. The service and controller commands add their files to the same directory:

```
src/
└── users/
    ├── users.module.ts
    ├── users.service.ts
    └── users.controller.ts
```

This naming convention is standard for every NestJS project. Stick to it when you create files manually.

## Automatic registration in the module

The CLI does more than placing files in the right location. When you generate a service or controller for a feature that already has a module, the CLI edits the module file to import and register the new class.

Before generating the service and controller, `users.module.ts` contains an empty scaffold:

```typescript
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class UsersModule {}
```

After running both generators, the imports and arrays are filled in:

```typescript
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

The import paths and array entries are written automatically. There is no manual step where you can forget to register a provider or mistype a path.

The one thing the CLI leaves to you is importing the feature module into `AppModule`. It has no way to infer which parent module should own a new feature, so you add that import manually:

```typescript
// src/app.module.ts
import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Resources

[NestJS CLI documentation](https://docs.nestjs.com/cli/overview)
