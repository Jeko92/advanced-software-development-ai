# TypeScript Basics - ES Modules

As soon as your TypeScript code is split across files, modules stop being a nice-to-have and become the structure that keeps the project understandable. Without modules, every file feels like one large script where data and behavior leak into each other. With modules, each file can expose a clear public API and hide internal details. This is especially important in the setup used in this session, where `module` and `moduleResolution` are configured as `NodeNext`. That configuration follows modern Node.js module behavior and expects you to think carefully about what is exported, what is imported, and how paths are resolved at runtime. Many beginners learn `import` and `export` syntax quickly but still struggle with the practical distinction between type information and runtime values. They also run into path errors when module specifiers do not match emitted JavaScript behavior. ES modules solve these problems when used intentionally: they create explicit boundaries, reduce accidental coupling, and make refactoring safer because dependencies are visible in every file. Without modules, every file is effectively a script where names and values leak between files. With modules, each file controls exactly what it shares. Anything not exported is private to that file, which means internal details can change without breaking other parts of the project. Good module design creates stable seams between parts of the codebase — that is what makes larger TypeScript projects refactorable without everything breaking at once. The goal here is not to memorize every import pattern, but to build a reliable mental model for exporting, importing, and organizing TypeScript modules so your project stays predictable as it grows.

## Exporting values and types

Use exports to define what a module makes available to other files.

```typescript
// volunteer.ts
export interface Volunteer {
  id: number;
  name: string;
}

export function formatVolunteer(name: string): string {
  return name.trim().toUpperCase();
}
```

- `Volunteer` is a type export used at compile time.
- `formatVolunteer` is a value export used at runtime.
- Keeping both in one module is common when they model the same feature.

## Importing values with type-only imports

Use regular imports for runtime values and `import type` for compile-time-only references.

```typescript
import { formatVolunteer } from "./volunteer.js";
import type { Volunteer } from "./volunteer.js";

const lead: Volunteer = { id: 1, name: "Mina" };
console.log(formatVolunteer(lead.name));
```

- `formatVolunteer` stays in emitted JavaScript because it is executed.
- `Volunteer` is erased during compilation because it is type-only.
- This separation keeps runtime dependencies explicit.

## Module paths in NodeNext projects

In NodeNext setups, TypeScript source often imports local modules using `.js` file extensions.

```typescript
import { loadConfig } from "./config.js";
```

- Source files are `.ts`, but emitted files are `.js`.
- Using `.js` in import specifiers keeps runtime resolution consistent.
- Mismatched paths are a common cause of module-not-found runtime errors.

## Re-exporting module APIs

You can create a central module entrypoint to simplify imports.

```typescript
// index.ts
export { formatVolunteer } from "./volunteer.js";
export type { Volunteer } from "./volunteer.js";
```

- Re-exports reduce repetitive deep relative imports.
- `export type` keeps the type/value boundary clear.
- This pattern scales well when a folder exposes multiple related modules.

## Common module and import mistakes

These issues appear frequently in early TypeScript module setups.

**Importing runtime values when only type information is needed**

```typescript
// Both end up in the emitted JavaScript, even if formatVolunteer is never called
import { Volunteer, formatVolunteer } from "./volunteer.js";

const lead: Volunteer = { id: 1, name: "Mina" };
```

`Volunteer` is a type — it has no runtime representation. Importing it alongside a runtime value pulls an unnecessary dependency into the emitted JavaScript. Use `import type` for anything only referenced in type positions:

```typescript
import { formatVolunteer } from "./volunteer.js";
import type { Volunteer } from "./volunteer.js";
```

**Missing `.js` extensions in NodeNext projects**

```typescript
// Works during compilation but fails at runtime
import { formatVolunteer } from "./volunteer";
```

TypeScript compiles `.ts` files to `.js`. At runtime, Node.js looks for `.js` files. If the specifier has no extension, the lookup fails. Use `.js` in all local import paths, even though the source file is `.ts`:

```typescript
import { formatVolunteer } from "./volunteer.js";
```

**Duplicating type definitions across files**

```typescript
// volunteers.ts
interface Volunteer {
  id: number;
  name: string;
}

// reports.ts
interface Volunteer {
  id: number;
  name: string;
} // copied by hand
```

When the same shape is defined in multiple files, they drift apart as the project evolves. Define the type once and import it everywhere it is needed:

```typescript
import type { Volunteer } from "./volunteer.js";
```

## Resources

[TypeScript handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
[TypeScript handbook - Type-only imports and exports](https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports)
