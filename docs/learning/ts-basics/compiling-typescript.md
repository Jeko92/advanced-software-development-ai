# TypeScript Basics - Compiling Typescript

Typescrpt has one mayor drawback: the browser or Node.js cannot run your `.ts` files directly, because runtime engines only understand JavaScript, not TypeScript syntax. Instead, the Typescript code needs to be transformed into JavaScript first. This is the process performed by the so called typescript compiler `tsc`. During transpilation, the compiler checks types, reports problems, and finally creates the JavaScript output. Type information helps during development, but it is erased before runtime, which is why TypeScript gives you stronger feedback without adding runtime overhead.

There are three compilation workflows worth knowing from day one. The first is file-level compilation, useful for quick experiments and small examples. The second is project-level compilation driven by `tsconfig.json`, which is how real projects stay consistent. The third is watch mode, which removes manual repetition by recompiling on save so your feedback loop stays fast while coding. If you understand these three workflows, you can move from writing TypeScript to executing JavaScript reliably, and you can explain exactly why the build output looks the way it does.

## TypeScript toolchain

Install the compiler so the `tsc` command is available in your terminal:

```bash
npm install -g typescript
tsc -v
```

The first command installs the compiler, and the second verifies that your environment can execute it.

## Compiling a typescript file

In order to create an executeable JavaScript file, you need to compile your TypeScript source file into JavaScript. The `tsc` command line tool does just that:

```bash
tsc app.ts
node app.js
```

`tsc app.ts` emits `app.js` beside the source file. Running `node app.js` executes the compiled JavaScript.

When you pass a file directly to `tsc`, it ignores any `tsconfig.json` present in the project (you learn about the tsconfig in the next chapter). Default compiler settings apply, which means strict checks are off and module handling may differ from your project config. This is fine for quick throwaway scripts, but any code meant to run inside a real project structure should use project compilation instead.

Given this source file:

```typescript
// app.ts
const shelterName: string = "Sunflower Commons";
const catCount: number = 7;

function displayShelterInfo(shelterName: string, catCount: number): void {
  console.log(`${shelterName} has ${catCount} cats.`);
}
```

The compiler emits this JavaScript:

```javascript
// app.js
const shelterName = "Sunflower Commons";
const catCount = 7;

function displayShelterInfo(shelterName, catCount) {
  console.log(`${shelterName} has ${catCount} cats.`);
}
```

The type annotations are stripped entirely. The emitted file is plain JavaScript with no trace of TypeScript syntax.

## Project compilation

Typically, you want to compile a whole project at once. To do so, you need to use a `tsc` command with a `tsconfig.json` file.

```bash
tsc
```

Running `tsc` without arguments triggers a `tsconfig.json` lookup. The compiler searches from the current directory upward until it finds one. Once found, it reads the `include`, `exclude`, and `compilerOptions` fields to determine what to compile and how.

## Watch mode

Use watch mode for continuous feedback while editing:

```bash
tsc --watch
```

You can also use the short flag:

```bash
tsc -w
```

Watch mode keeps the compiler process alive and monitors the file system for changes to any included `.ts` file. When a change is detected, it recompiles only what is affected rather than rebuilding the entire project from scratch. Type errors are printed inline in the terminal as they appear, so you get feedback without manually re-running the compiler after every save.

This is the recommended mode during active development. You leave it running in a terminal pane and it reports problems as you write code, turning the compile step into a continuous background check rather than a manual gate.

## Resources

[TypeScript handbook - Compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
[TypeScript handbook - TypeScript compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html#using-the-cli)
