# NestJS Basics 1 - First NestJS Project

This file builds the minimal NestJS application one piece at a time. It starts
with the entry point that boots the framework, adds the smallest setup that can
answer an HTTP request, and then refactors that setup to use a service. The
refactor is where dependency injection enters the picture.

All four pieces end up in a single file. Real projects split them across
folders, one file per class, but keeping everything together here makes the
wiring explicit. When `AppController` declares a dependency on `AppService`
later on, you can see `AppService` defined right above it.

## Installation and TypeScript configuration

Install the runtime and type dependencies:

```bash
npm install @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata
npm install --save-dev @types/node typescript ts-node
```

- `@nestjs/core` is the NestJS runtime and DI container.
- `@nestjs/common` provides the decorators: `@Injectable()`, `@Controller()`,
  `@Module()`, and the route decorators.
- `reflect-metadata` is a polyfill that NestJS uses alongside
  `emitDecoratorMetadata` to read constructor type information at runtime.

NestJS relies on a legacy implementation of TypeScript decorators, which means
they require two flags in `tsconfig.json` before they will work in your
application:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

- `experimentalDecorators` enables the legacy decorator implementation.
- `emitDecoratorMetadata` tells the compiler to include type information in the
  compiled output. NestJS reads this metadata at runtime to figure out the type
  of each constructor parameter and which provider to inject.

Without `emitDecoratorMetadata`, NestJS cannot resolve constructor dependencies,
and the DI system does not work.

## The bootstrap function and App Module

Every NestJS application starts the same way: a small asynchronous function
creates the app and tells it to listen for HTTP requests.

```ts
import { Module } from '@nestjs/common';
import { NestFactory } from "@nestjs/core";

@Module({
  controllers: [],
  providers: [],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3232);
  console.log(`Server is running on port ${await app.getUrl()}`);
}

bootstrap();
```

`NestFactory.create` takes a module class as its argument. It reads the module's
configuration, builds the DI container, instantiates the registered classes,
resolves their dependencies, and returns a ready-to-run application instance.
`app.listen(3232)` then starts the HTTP server on the given port.

`AppModule` is the global module where all parts of the application come
together. It is empty for now. Let's change that.

## AppController

NestJS needs something to route requests to. The simplest version of that is a
controller class with one route handler:

```ts
import { Controller, Get } from "@nestjs/common";

@Controller()
class AppController {
  @Get("/")
  showHello() {
    return "Hello World";
  }
}
```

`@Controller()` registers this class as a request handler and tells NestJS to
scan its methods for route decorators.

`@Get("/")` is the first decorator that is not used for dependency injection. It
registers the method `showHello` as the GET route handler for the `/` route.
NestJS calls this method when a matching request arrives and uses the return
value as the response body. The string `"Hello World"` is hardcoded inside the
method for now.

The controller exists, but NestJS still has no way to find it. We need to add it
to the AppModule as a controller:

```ts
import { Module } from "@nestjs/common";

@Module({
  controllers: [AppController],
  providers: [],
})
class AppModule {}
```

`@Module()` takes a configuration object. Here, only the `controllers` key is
set, with `AppController` listed inside. The class body is empty because all the
information NestJS needs lives in the decorator.

With this module in place, `NestFactory.create(AppModule)` in the bootstrap
function can do its job. NestJS reads the module, instantiates `AppController`,
registers its routes, and the server can answer a GET request at `/` with
`"Hello World"`.

## Adding the first provider

The application runs, but the message is glued to the route handler which is not
how we will build our applications in NestJS. Moving it into a service fixes
both problems and is the standard NestJS pattern.

The first step is the service class itself:

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
class AppService {
  generateMessage(): string {
    return "Hello World";
  }
}
```

`@Injectable()` registers `AppService` with the DI container. Without it, the
container does not know this class exists and cannot inject it anywhere. The
method that used to live in the controller now lives here.

The module needs to list `AppService` under `providers` so the container knows
it should be available for injection:

```ts
@Module({
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}
```

Now we can actually use the service in the controller. We simply add a
constructor parameter to the controller with `AppService` as the type
annotation. Important to note here is that classes in Typescript can also act as
types.

```ts

@Controller()
class AppController {
  constructor ( private readonly appService: AppService ) {
  }

  @Get("/")
  showHello () {
    return this.appService.generateMessage();
  }
}
```

The constructor parameter `private readonly appService: AppService` is the
dependency injection declaration. NestJS reads the `AppService` type annotation
at startup, finds the registered provider for that type, and injects the
instance.

## The complete application

Finally, our first NestJS application looks like this:

```ts
import { Controller, Get, Module, Injectable } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

@Injectable()
class AppService {
  generateMessage (): string {
    return "Hello World";
  }
}

@Controller()
class AppController {
  constructor ( private readonly appService: AppService ) {
  }

  @Get("/")
  showHello () {
    return this.appService.generateMessage();
  }
}

@Module({
  controllers: [ AppController ],
  providers: [ AppService ],
})
class AppModule {
}

async function bootstrap () {
  const app = await NestFactory.create(AppModule);
  await app.listen(3232);
  console.log(`Server is running on port ${await app.getUrl()}`);
}

bootstrap();
```

## Resources

[NestJS first steps](https://docs.nestjs.com/first-steps)
