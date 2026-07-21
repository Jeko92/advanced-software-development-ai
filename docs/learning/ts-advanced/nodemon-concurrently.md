# TypeScript Advanced Setup - Nodemon and Concurrently

The nodemon TypeScript setup requires two processes that run indefinitely: `tsc --watch` and `nodemon`. Because neither of them exits on its own, you cannot start them with `&&` - that operator waits for the first command to finish before running the second, so the second command would never start. `concurrently` solves this by running multiple commands at the same time in a single terminal. Install it as a dev dependency with `npm install --save-dev concurrently`.

## Configuration

Each process gets its own named script so it can run independently or as part of the combined `dev` command:

- `build:watch` runs the TypeScript compiler in watch mode
- `start:dev` starts nodemon against the compiled output
- `dev` passes both script invocations to `concurrently` as quoted strings

```json
// package.json
{
  "scripts": {
    "build:watch": "tsc --watch",
    "start:dev": "nodemon dist/index.js",
    "dev": "concurrently \"npm run build:watch\" \"npm run start:dev\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "nodemon": "^3.0.1"
  }
}
```

The quotes around each `npm run` command are escaped with `\"` because the entire `dev` script value is already wrapped in double quotes. `concurrently` receives each command as a separate argument and runs them in parallel.

Running `npm run dev` starts both processes. The terminal shows interleaved output from `tsc --watch` and `nodemon`, giving the full compile-and-restart cycle in one window.

## Resources

[concurrently on npm](https://www.npmjs.com/package/concurrently)
