# NestJS Basics 1 - NestJS Overview

NestJS is a TypeScript-first framework for building server-side Node.js
applications. It runs on top of Express by default, so the HTTP layer you
already know is still there, but NestJS adds a defined application structure, a
built-in dependency injection system, and a set of conventions enforced through
TypeScript decorators. Those conventions are what make it scale predictably: the
patterns you use in a small project carry over when the project grows.

Express leaves almost every structural decision to you. Where does routing logic
go? How do components get access to shared services? How is the application
initialized? These questions have no built-in answers. NestJS answers all of
them, and it does so consistently across every project that uses it. That is why
teams tend to reach for it once an Express codebase gets hard to navigate.

## Core building blocks

NestJS organizes every application around three types of classes. You will see
all three in the minimal example later in this session.

**Modules** are organizational units. Every NestJS application has at least one:
the root module. A module declares which controllers and providers belong to it.
When the framework starts up, it reads the module to know what to instantiate
and how to wire it together.

**Controllers** handle incoming HTTP requests. You have already seen this
pattern in the MVC architecture of your express projects. In NestJS, a
controller is a class decorated with `@Controller()`. Its methods are decorated
with route decorators like `@Get()` or `@Post()` that map HTTP requests to
handler functions.

**Providers** are classes the framework manages and can inject into other
components. Services are the most common kind of provider. A class becomes a
provider when it is decorated with `@Injectable()` and registered in a module.

## Architectural philosophy

A common way to structure a backend is by technical role: one folder for all
controllers, one for all services, one for all repositories. This is sometimes
called a layered architecture because the separation runs across the application
by layer rather than through it by feature.

NestJS encourages a different approach. Each module groups everything that
belongs to a feature: its controller, its service, and its data access. One can
think of the modules as vertical slices of the application, which are internally
layered.

A layered structure for a project with users and products looks like this:

```
src/
  controllers/
    user.controller.ts
    product.controller.ts
  services/
    user.service.ts
    product.service.ts
  repositories/
    user.repository.ts
    product.repository.ts
```

The same project organized with NestJS modules:

```
src/
  users/
    users.controller.ts
    users.service.ts
    users.module.ts
  products/
    products.controller.ts
    products.service.ts
    products.module.ts
  app.module.ts
```

With the layered approach, tracing a single feature means reading across several
folders. With vertical slices, every file for a feature is in one place. Adding
or changing a feature touches one module, not three layers.

Modules enforce this boundary explicitly. A NestJS module declares what it
exports and what it imports from other modules. Other modules cannot reach into
it unless it allows them to. That is harder to guarantee with a plain folder
structure, where any file can import any other.

In summary, NestJS's design philosophy encourages a modular monolith
architecture with vertical slices and explicit module boundaries.

## Resources

[NestJS documentation](https://docs.nestjs.com/)
