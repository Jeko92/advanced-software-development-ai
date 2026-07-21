# TypeScript Advanced Setup - Nodemon and tsx

`tsx watch` covers most development workflows. You add nodemon when you need to watch files `tsx` ignores by default. `.env` files store environment variables like API keys and ports, and a server often needs to restart when those change. nodemon also lets you exclude specific paths from triggering restarts, or run custom scripts when the server restarts. In this setup, nodemon owns file watching and calls `tsx` to run the code on each restart. Install both with `npm install --save-dev tsx nodemon`.

## nodemon.json configuration

Each property in `nodemon.json` controls a different aspect of the file watching behaviour:

- `watch` lists the directories and files to monitor; including `.env` here means a change to environment variables triggers a restart, which `tsx watch` alone would miss
- `ext` defines the file extensions that count as a change
- `ignore` prevents test files from causing unnecessary restarts during development
- `exec` replaces nodemon's default `node` runner with `tsx`, so each restart executes the TypeScript entry file directly without a separate compile step

```json
// nodemon.json
{
  "watch": ["src", ".env"],
  "ext": "ts,json,env",
  "ignore": ["src/**/*.test.ts"],
  "exec": "tsx src/index.ts"
}
```

The `dev` script in `package.json` stays minimal. nodemon reads the config file automatically:

```json
// package.json
{
  "scripts": {
    "dev": "nodemon"
  }
}
```

## Advanced nodemon options

| Option   | Purpose                                                              |
| :------- | :------------------------------------------------------------------- |
| `watch`  | Directories and files to monitor, including non-TS files like `.env` |
| `ext`    | File extensions that trigger a restart                               |
| `ignore` | Paths to exclude, such as test files or build output                 |
| `exec`   | The command nodemon runs on each restart                             |

## Resources

[nodemon configuration options](https://github.com/remy/nodemon#config-files)
