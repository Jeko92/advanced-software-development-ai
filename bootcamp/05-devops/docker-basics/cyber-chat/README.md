# Cyber Chat

A small Q&A/discussion-forum backend - users, threads, comments, JWT auth -
built with NestJS, TypeORM and SQLite. Used as a more realistic app to
containerize for the DevOps Docker Basics challenges (Swagger docs are
served at `/api`).

## Setup

```bash
pnpm install
cp .env.example .env
# fill in DATABASE_PATH (e.g. db/cyber-chat.db) and JWT_SECRET
# generate a secret with: openssl rand -hex 32
```

## Commands

```bash
pnpm dev               # boot the app on http://localhost:3000 (Swagger at /api)
pnpm build              # compile to dist/
pnpm start:prod         # run the compiled app (node dist/main.js)
pnpm typecheck
pnpm lint
pnpm lint:fix
pnpm format:check
pnpm format:write
```

No automated tests are included yet - `pnpm test`/`pnpm test:e2e` are wired
up (Jest) but there's nothing to run against.

## API surface

| Method | Path                    | Auth | Notes                              |
| ------ | ----------------------- | ---- | ----------------------------------- |
| POST   | `/auth/register`        | -    | `{ username, password }`            |
| POST   | `/auth/login`           | -    | `{ username, password }` → JWT      |
| GET    | `/threads`               | -    | list all threads                    |
| GET    | `/threads/:id`           | -    | thread + its comments               |
| POST   | `/threads`               | JWT  | create a thread                     |
| POST   | `/threads/:id/comments`  | JWT  | comment on a thread                 |
| DELETE | `/threads/:id`           | JWT  | author or `ADMIN` role only         |
| GET    | `/comments/:id`          | -    | fetch a comment                     |
| DELETE | `/comments/:id`          | JWT  | soft-delete a comment               |

Known limitation, carried over from the original scaffold and left as-is
(out of scope for the Docker exercise): passwords are stored and compared
in plaintext, no hashing. Don't reuse real credentials against this app.

## Containerizing it

Like `code-along`, the `Dockerfile` packages an **already-built** app - no
build step runs inside the container - and this package's `node_modules`
needs [`pnpm deploy`](https://pnpm.io/cli/deploy) first, for the same
pnpm-workspace-symlink reason (see `code-along/README.md` for the full
explanation).

This app additionally has a **native dependency**, `better-sqlite3`. Its
compiled binary targets whatever OS/arch it was installed on - your host,
not the container - so the Dockerfile rebuilds it for the image's platform
with `npm rebuild better-sqlite3` after `node_modules` is copied in. Skip
that step and you'll see `invalid ELF header` at startup.

```bash
# 1. Build the app and produce a self-contained copy for Docker
pnpm install
pnpm build
pnpm --filter . deploy --prod --legacy .deploy

# 2. Build the image (context is .deploy/, not this directory)
docker build -t cyber-chat .deploy

# 3. Run it
docker run --rm -p 3000:3000 --env-file .env cyber-chat
```

Then visit http://localhost:3000/api for the Swagger UI, or:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"secret123"}'
```

The SQLite database lives at `db/` inside the container (`DATABASE_PATH`
in `.env`) and is created fresh on first boot (`synchronize: true`) - it
does not persist across `docker run`s unless you mount a volume:

```bash
docker run --rm -p 3000:3000 --env-file .env \
  -v "$(pwd)/db:/app/db" \
  cyber-chat
```
