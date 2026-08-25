# Dolphins Blog SQL — OOP Refactor

A small server-rendered blog (Express + Nunjucks + SQLite) refactored from a
functional, free-function style into a layered, class-based design —
**Controller → Service → Repository**, with an interface per repository so
services depend on a contract instead of a concrete SQLite implementation.
Public blog, an admin panel (create/edit/delete posts and authors, image
uploads), and a JSON API live side by side behind the same `App` instance.

## Requirements

- Node.js 20.6+ (the dev/start scripts rely on the native `--env-file` flag)
- pnpm

## Setup

Copy `.env.example` to `.env` and fill in `ADMIN_PASS` and `COOKIE_SECRET`
(both required, no insecure default). `DB_PATH` already defaults to
`db/blog.db` — no `.db` file is checked in; it's created automatically on
first connect, and seeded with sample data by the `db:seed` script below.

## Running from the monorepo root

This app is a pnpm workspace package (`@bootcamp/dolphins-blog-sql-oop`).
From the repository root:

```bash
pnpm install
pnpm --filter @bootcamp/dolphins-blog-sql-oop db:seed   # sample authors + posts
pnpm --filter @bootcamp/dolphins-blog-sql-oop dev        # http://localhost:3000
```

Or `cd` into this folder and drop the `--filter`:

```bash
cd apps/03-software-design/dolphins-blog-sql-oop
pnpm run db:seed
pnpm run dev
```

Other scripts (same two ways to run them):

| Script                            | What it does                                       |
| ---------------------------------- | --------------------------------------------------- |
| `dev`                               | Build the client bundle, then run with `tsx --watch` |
| `build`                             | Type-check + compile server and client bundle        |
| `start`                             | Run the compiled `dist/app.js` (after `build`)        |
| `db:seed`                           | (Re)seed `db/blog.db` from `db/seeddb.sql`            |
| `typecheck`                         | `tsc --noEmit`                                        |
| `lint` / `lint:fix`                 | ESLint                                                |
| `format:check` / `format:write`     | Prettier                                              |

## Testing the app

- **Manually**: `http://localhost:3000` for the public blog,
  `http://localhost:3000/admin` for the admin panel (log in with
  `ADMIN_PASS` from your `.env`), `http://localhost:3000/api/posts/*` for
  the JSON API (also accepts HTTP Basic Auth for the mutating routes).
- **Bruno collection**: `bruno/` has a ready-made request collection
  covering every route — public pages, admin CRUD (posts + authors, incl.
  image upload), auth (login/logout, wrong password, unauthenticated
  access), and the JSON API. Open Bruno → "Open Collection" → this folder,
  select the `local` environment.
- There's no automated test suite for this app — the Bruno collection is
  the regression net.

## Running independently (outside the monorepo)

If you copy just this folder out of the monorepo instead of cloning the
whole repository, three `devDependencies` won't resolve — they point at
internal workspace packages:

```json
"@bootcamp/eslint-config": "workspace:*",
"@bootcamp/prettier-config": "workspace:*",
"@bootcamp/tsconfig": "workspace:*",
```

To make the project self-contained:

1. **Drop those three lines** from `package.json`'s `devDependencies`.

2. **`tsconfig.json`** — replace
   `"extends": ["@bootcamp/tsconfig/node.json", "@bootcamp/tsconfig/dom.json"]`
   with the compiler options directly:

   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "NodeNext",
       "moduleResolution": "NodeNext",
       "lib": ["ES2022", "DOM"],
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "resolveJsonModule": true,
       "allowImportingTsExtensions": true,
       "rewriteRelativeImportExtensions": true,
       "rootDir": "./src",
       "outDir": "./dist"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

   Do the same for `tsconfig.client.json` (its own `rootDir`/`outDir` for
   the browser-side scripts, no `"types": ["node"]`).

3. **`eslint.config.mjs`** — replace the `@bootcamp/eslint-config` import
   with a standalone flat config (`typescript-eslint`'s recommended config
   plus `eslint-config-prettier` to turn off formatting-related rules is
   enough to get the same effect).

4. **`prettier.config.mjs`** — replace the `@bootcamp/prettier-config`
   import with the settings directly:

   ```js
   export default {
     singleQuote: true,
     semi: true,
     trailingComma: 'all',
     printWidth: 80,
     tabWidth: 2,
     endOfLine: 'lf',
     bracketSpacing: true,
     plugins: [
       'prettier-plugin-jinja-template',
       'prettier-plugin-sql',
       'prettier-plugin-embed',
     ],
     overrides: [{ files: ['*.njk'], options: { parser: 'jinja-template' } }],
   };
   ```

5. `pnpm install` inside the folder (nothing points outside it anymore),
   then everything under "Running from the monorepo root" above works the
   same way, minus the `--filter` flag.

## What's inside

- `src/app.ts` — composition root: builds the dependency graph
  (`Database` → repositories → services → controllers/middlewares) and
  hands the finished routers to `App`.
- `src/core/App.ts` — the Express app itself (view engine, static assets,
  global middleware, route mounting).
- `src/entities/`, `src/repositories/`, `src/services/`, `src/controllers/`
  — the layered Post/Author/Auth features: an interface plus a concrete
  repository/service per feature, controllers as classes with
  arrow-function handler properties (so `this` stays bound when Express
  calls them directly).
- `src/middlewares/` — `AuthMiddleware`, `UploadMiddleware`,
  `ErrorHandlerMiddleware`.
- `src/routes/` — route factory functions, each taking already-constructed
  controller/middleware instances rather than reaching for globals.
- `src/views/` — Nunjucks templates.
- `db/seeddb.sql` — schema + sample authors/posts; `db/blog.db` itself is
  generated at runtime, not checked in.
