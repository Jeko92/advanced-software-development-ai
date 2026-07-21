# TypeScript Advanced Setup - tsx

`tsx` combines what `tsc --watch` and `nodemon` do separately into a single command. Transpilation — the process of converting TypeScript into JavaScript that Node.js can run — happens inside `tsx` without writing any files to disk. The result is passed directly to Node.js. No `dist` folder, no second process, no concurrently needed.

## Comparison with tsc + nodemon

|                    | tsc + nodemon                           | tsx watch             |
| :----------------- | :-------------------------------------- | :-------------------- |
| Processes          | Two (compiler + server)                 | One                   |
| Compilation output | Written to disk                         | In memory             |
| Speed              | Slower (disk I/O)                       | Faster (Esbuild)      |
| Module handling    | Manual CommonJS/ES Module configuration | Handled automatically |

## tsx configuration

Install `tsx` as a dev dependency with `npm install --save-dev tsx`, then replace the multi-script dev setup with a single entry in `package.json`.

The two scripts are intentionally separate, because `tsx` skips type analysis to stay fast:

- `start:dev` runs `tsx watch` against the entry file, monitoring the source directory and restarting the process on every save
- `typecheck` runs `tsc` with `--noEmit`, which performs full type checking without writing any output files. Type errors will not surface during `start:dev` unless you run this alongside it

```json
{
  "scripts": {
    "start:dev": "tsx watch src/index.ts",
    "typecheck": "tsc --noEmit --watch"
  },
  "devDependencies": {
    "tsx": "^4.0.0"
  }
}
```

## Esbuild and in-memory transpilation

`tsx` uses Esbuild under the hood. Esbuild is written in Go and focuses only on transpilation, not type analysis. Stripping TypeScript types is fast; full type checking is slow. By doing only the former, Esbuild processes files far quicker than `tsc`.

Rather than saving the compiled JavaScript to your project folder, `tsx` holds it temporarily in memory and passes it straight to the Node.js runtime. This cuts out the step of reading and writing files to disk, which is what makes `tsc + nodemon` restarts feel sluggish.

## `tsx` and client side code

Since `tsx` builds upon `node`, it cannot be used to compile client-side code. `tsx`, is designed only to execute server-side code. Typescript code for the client side needs to be compiled in the tranditional way, using `tsc` and `nodemon`.

## Resources

[tsx on GitHub](https://github.com/privatenumber/tsx)

[Esbuild documentation](https://esbuild.github.io/)
