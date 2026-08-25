# NestJS Basics 1 - DI Framework

In a plain Express application, when a route handler needs a service it either
creates one directly with `new UserService()` or receives it through some manual
wiring you set up yourself. That works, but it ties the handler to a specific
implementation. If you want to test the handler in isolation, you have to swap
out the real service somehow. There is no standard way to do it, and as the
application grows, this gets harder to manage.

NestJS circumvents this problem with a dependency injection framework. Instead
of creating their own dependencies, components declare what they need, and the
framework supplies it. A controller says "I need a service of type `AppService`"
by listing it as a constructor parameter. NestJS finds the registered provider,
creates an instance if one does not exist yet, and passes it in automatically.

Decorators and the DI container are what make this work. Decorators tell NestJS
what role each class plays. The container is the runtime mechanism that reads
those roles, tracks instances, and resolves dependencies when components start
up.

## Decorators in TypeScript

We covered decorators already, but here is a quick summary for you: A decorator
is a function that gets applied to a class, method, or parameter at definition
time. You write it with an `@` symbol directly above the thing it decorates:

```ts
@Injectable()
class AppService {}
```

When TypeScript compiles this, it calls the `Injectable` function with
`AppService` as its argument. NestJS uses that call to register the class in its
internal container.

## Dependency injection in NestJS

The core idea of the dependency injection framework in NestJS is that the type
of a parameter in a constructor defines which class will be injected into that
parameter.

If a part of my application, for example a controller, needs the `AppService`
from above, we can just declare it as the type of one of its constructor
parameters:

```ts

@Controller()
class AppController {
  constructor ( private readonly appService: AppService ) {
  }
}
```

To make this magic work, we need to tell NestJS that `AppService` is actually
something it can inject into other classes. Here the `@Injectable()` decorator
comes into play. It tells NestJS that `AppService` is a provider, and that it
can be injected into other classes if they request it.

When NestJS uses `AppController` to create an instance, it will

1. Create an instance of `AppService`,
2. Call the `AppController` with the `AppService` instance as the argument for
   the `appService` parameter.

The DI framework handles the creation and delivery of every class instance for
us. We associate the dependency with the class type, and the framework does the
rest.

To maintain control over which Providers are actually accessible to which
controllers and services, NestJS require us to group providers and controllers
into modules. These modules define a list of providers and controllers that are
available to each other:

```ts

@Module({
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {
}
```

This empty class looks very strange at first, but it's decorator `@Module()`
abstracts away the details.

## How NestJS resolves dependencies

NestJS maintains a container, an internal registry of providers. When the
application starts, it reads every module and registers the providers listed
there. When it needs to instantiate a class, it inspects the constructor
parameters using the metadata emitted by `emitDecoratorMetadata` and resolves
each dependency from the registry.

Providers are created as singletons by default. If `AppController` and some
other component both declare a dependency on `AppService`, NestJS creates
exactly one `AppService` instance and shares it between them.

## Core decorators

**`@Injectable()`** marks a class as a provider. The container manages its
lifecycle and injects it wherever the type appears as a constructor dependency.
Every service you write will have this decorator.

**`@Controller()`** marks a class as a request handler. Controllers are
instantiated by the container and can receive injected providers in their
constructors, but they are registered under `controllers` in the module, not
`providers`. NestJS uses `@Controller()` to build the route map for the
application.

**`@Module()`** groups controllers and providers into a unit the framework can
load. It takes a configuration object with at least two keys: `controllers` and
`providers`. Every application has at least one module, the root module.

NestJS uses decorators for more than just dependency injection. We will see them
as route method decorators or parameter decorators in upcoming examples.

## Inversion of Control

The pattern underlying NestJS's DI system is called Inversion of Control. The
name describes what changes: normally your code creates the things it needs.
With IoC, that responsibility moves to the framework.

Imagine you need a cake. Without IoC, you go to the kitchen, gather every
ingredient, and bake it yourself. With IoC, you tell a baker what you want. The
baker handles everything; you receive the cake when you need it.

Your class does not call `new UserService()`. It declares
`constructor(private userService: UserService)`. The framework sees that
declaration, finds the registered provider for `UserService`, and delivers it.
You declare what you need; NestJS decides when and how to provide it.

## Resources

[TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)

[NestJS providers](https://docs.nestjs.com/providers)
