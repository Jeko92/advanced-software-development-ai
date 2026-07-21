# TypeScript Basics - Setup

When people say TypeScript is hard to start with, they are usually reacting to configuration noise, not the language itself. The setup feels heavy because TypeScript asks you to be explicit about how your project is compiled, where source files live, and what standards should be enforced. That can feel like extra work if you are used to plain JavaScript, where you can create a file and run it immediately. The upside is that this one-time setup gives your whole team a shared understanding for how code is written and compiled. Instead of every developer guessing build behavior, the project encodes those rules once and the compiler enforces them consistently.

A good setup has two goals. First, make the compiler available and predictable in every project. Second, lock in sensible defaults so errors are caught early. The `tsconfig.json` file in this session is the source of truth. It uses strict checks, modern Node module resolution, and explicit input and output directories. These settings reduce ambiguity and make build output easier to reason about.

## Project layout

The session configuration expects this structure:

```text
project-root/
  src/
  dist/
  tsconfig.json
```

The `src` folder is where your TypeScript files live, and the `dist` folder is location for the compiled output.

## TypeScript configuration

As mentioned before, when using `tsc` without arguments, it looks for a `tsconfig.json` file in the current directory or in any parent directory. The file should be named `tsconfig.json`. It defines how the compiler should compile your project. It has the following structure:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",

    "target": "esnext",
    "module": "esnext",
    "lib": ["esnext"],
    "types": [],

    "strict": true,

    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Key effects of these options:

- `rootDir` and `outDir` enforce a clean source-to-build mapping: TypeScript reads from `src` and writes compiled output to `dist`, keeping the two trees separate.
- `module` set to `NodeNext` tells the compiler to follow modern Node.js import behavior, where imports must use explicit file extensions and resolution follows the `exports` field in `package.json`.
- `lib` sets the available language features to `esnext`, which is the latest version of ECMAScript. Here we can extend this list with `dom` to include support for browser APIs later on.
- `target` defines the version of the output JavaScript to generate. We use `esnext`, which is the latest version of ECMAScript.
- `types` defines the list of type packages to include. For now we don't need any.
- `strict` enables a group of checks that catch the most common type mistakes, including implicit `any`, unchecked `null` and `undefined`, and unsafe type assertions.
- `esModuleInterop` makes CommonJS packages work with the standard `import x from "x"` syntax instead of requiring `import * as x from "x"`.
- `skipLibCheck` skips type-checking of `.d.ts` files in `node_modules`. This speeds up compilation and avoids errors from type packages that have minor internal inconsistencies.
- `resolveJsonModule` allows TypeScript to import `.json` files directly, with an inferred type based on the file's structure.
- `sourceMap` generates `.map` files alongside the compiled output. These link the JavaScript back to the original TypeScript source, so debuggers and stack traces point to the right file and line number.

## Resources

[TypeScript handbook - TypeScript tooling in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html)
[TSConfig reference](https://www.typescriptlang.org/tsconfig)
