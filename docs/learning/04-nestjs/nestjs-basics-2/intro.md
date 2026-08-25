# NestJS Basics 2 - Intro

## Learning objectives

- Use the NestJS CLI to scaffold feature modules with correct file structure and registration
- Organize application code into domain-specific modules using a feature-based folder structure
- Wire multiple modules together using the `imports` and `exports` arrays
- Build NestJS controllers that map HTTP routes to handler methods and delegate work to services
- Implement services to encapsulate business logic, separate from request handling
- Apply the repository pattern to keep data access logic out of services

## Overview

The previous session ran a minimal NestJS application: a module, a controller, and a hardcoded service in a single file. That was enough to see how the pieces fit together. This session covers how those pieces work in a real project.

The NestJS CLI is the first stop. Real projects are not built file by file; the CLI scaffolds feature directories, generates boilerplate, and registers new classes in their module automatically. Understanding what it produces saves you from reverse-engineering the conventions later.

After the CLI, the session works through the four pieces that appear in every NestJS feature. Modules group code by business domain and control what is visible to the rest of the app. Controllers receive HTTP requests and pass work to services, which apply the actual logic without touching HTTP. Repositories give data access its own class, separate from the service, so that swapping the storage layer does not require changing business rules.
