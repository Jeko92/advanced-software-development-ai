# TypeScript Advanced Setup - Nodemon

Node.js (versions < 25.9) can only execute JavaScript. When you write TypeScript, it has to be compiled into JavaScript before Node can run it. `nodemon` (Node Monitor) solves the development side of this: it watches your project files and restarts the Node process whenever a watched file changes. Without it, you stop and restart the server manually after every edit.

Because `nodemon` restarts Node, it needs to watch the compiled JavaScript output in `dist/`, not the TypeScript source. Two processes run at the same time: `tsc --watch` compiles changes from `src/` into `dist/`, and `nodemon` detects those `.js` changes and restarts Node.

## TypeScript configuration

`tsconfig.json` must be configured so the compiler writes its output to a known directory:

- `outDir` sets where compiled `.js` files go
- `rootDir` tells the compiler where to find the TypeScript source
- `esModuleInterop` allows you to import packages using the standard `import x from 'x'` syntax, even if the package was written in an older module format

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true
  }
}
```

`nodemon.json` controls what `nodemon` monitors and what command it runs on each restart. When you run `nodemon` without arguments, it reads this config file automatically:

- `watch` points to the compiled output directory
- `ext` restricts restarts to `.js` file changes only
- `exec` defines the command nodemon runs on each restart

```json
{
  "watch": ["dist"],
  "exec": "node dist/index.js",
  "ext": "js"
}
```

With both configs in place, run two processes:

```bash
tsc --watch   # terminal 1: watches src/, outputs to dist/
nodemon       # terminal 2: watches dist/, restarts node
```

## Resources

[nodemon documentation](https://nodemon.io/)
