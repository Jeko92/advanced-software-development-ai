# NestJS Basics 1 - Intro

## Learning objectives

- Explain what NestJS is and how it differs from Express
- Understand what decorators are and the TypeScript configuration they require
- Understand Inversion of Control and how NestJS implements dependency injection
- Read and reason about a minimal NestJS application

## Overview

Express gives you a request/response cycle and not much else. Routing,
middleware, structure — you decide all of it. For small projects this freedom
works well, but in a large team and a codebase that a single developer can no
longer overview by themselves, a more structured approach is required. With it,
different teams make different choices about where logic lives, how components
find their dependencies, and how files are organized. The result is applications
that are hard to navigate and harder to test.

NestJS is a Node.js framework built on top of Express (or optionally Fastify)
that answers those questions upfront. It defines a clear structure based on
three building blocks — Modules, Controllers, and Providers — and it enforces
that structure through TypeScript decorators. A `@Controller()` is a controller.
An `@Injectable()` class is a provider that the framework can manage and supply
to other components automatically.

That automatic supply of dependencies is done via a dependency injection
framework, and it is the central concept to understand in this session. In
NestJS, a class does not create the things it depends on. It declares what it
needs in its constructor, and the framework resolves and provides them. This
makes components loosely coupled: they do not know or care how their
dependencies are constructed, only that they exist.

Decorators are the language feature that makes all of this work. They are
annotations placed on a class or method that NestJS reads at startup to
understand what role each piece plays and how to wire everything together.
Getting comfortable with decorators is the main challenge of this session. Once
the pattern clicks, the rest of the framework follows naturally.

The session ends with a minimal but complete NestJS application: one service,
one controller, and one module, all running in a single file. Modules, services,
and repositories get a thorough treatment in the next session.
