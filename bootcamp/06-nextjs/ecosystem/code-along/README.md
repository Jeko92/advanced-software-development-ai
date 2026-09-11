# Ecosystem — Code-Along

Kiki's Delivery Service, continued from `tailwind-and-shadcn/code-along`.
Same app, same `deliveriesService`, same `/`, `/deliveries`, and
`/deliveries/[deliveryId]` routes, fully styled with Tailwind v4 and
shadcn/ui — but the "New delivery" form still submits raw `FormData` and
every piece of client state (`DeliveryFilter`'s status filter,
`ThemeToggle`'s dark-mode flag) still lives in a local `useState` that
forgets itself on every page load. This package is the starting point for
the Ecosystem chapter, to be extended with:

- `react-hook-form` replacing the manual `FormData` handling in
  `NewDeliveryForm`, with `register`, validation rules, and `formState.errors`
- `FormProvider`/`useFormContext` on the other "New delivery" form (the
  full-page one at `/deliveries/new`), split into field components that
  don't need form props passed down to them
- a Zustand store (`useRecentlyViewedStore`) written from the delivery
  detail page and read by a badge in the header — state shared between
  distant components without prop drilling
- the `persist` middleware (plus the SSR-safe rehydration wrapper) so the
  recently-viewed list survives a page refresh, and `immer` as an optional
  cleanup for the store's mutations

`IMPLEMENTATION_GUIDE.md` in this directory maps every code example from
`react-hook-form.md`, `react-hook-form-provider.md`, `zustand.md`, and
`zustand-middleware.md` onto this exact codebase. See
`../../../../docs/learning/06-nextjs/ecosystem/challenges.md` for this
chapter's separate exercises (a react-hook-form create form and a
persisted favorites feature, both for a different "Code Snippet Library"
app) — those aren't covered here, and the other handouts in that folder
cover the concepts behind each piece before diving in.

## Setup

```bash
pnpm install
cp .env.example .env   # once you get to the Postgres step
```

Pick **one** of the two workflows below — don't run both at once, they fight
over port 3000 and disagree about what `DB_HOST`/`DB_PORT` should be. If you
still have `tailwind-and-shadcn/code-along` running, stop it first — both
packages default to host port 3000 (app) and 5433 (Postgres).

### Workflow A: everything in Docker (recommended)

`docker-compose.yml` runs both the app and Postgres as containers on a
shared Docker network, where the app reaches the database at the service
name `db`. Your project directory is bind-mounted into the app container,
so edits on your machine hot-reload inside it — no extra setup needed.

```bash
docker compose up -d                        # starts app + db, http://localhost:3000
docker compose exec app npx prisma migrate deploy   # once, to create the tables
docker compose exec app pnpm db:seed                # once, to seed sample data
```

Keep `.env` as-is for this workflow: `DB_HOST=db`, `DB_PORT=5432`. That
`5432` is the database's port *inside* the Docker network — it has nothing
to do with the `5433` host-side mapping below, and changing it to `5433`
here breaks the app container's connection to `db`.

Useful follow-ups:

```bash
docker compose logs -f app   # tail the app's logs
docker compose restart app   # picked up a .env change but didn't reload
docker compose down          # stop and remove the containers
```

### Workflow B: Next.js on your machine, Postgres in Docker

Only start the `db` service, and point at it via its host-mapped port:

```bash
docker compose up -d db      # starts only Postgres, mapped to localhost:5433
```

Then in `.env`, use the host-facing address instead: `DB_HOST=localhost`,
`DB_PORT=5433`. Now the usual commands run directly on your machine:

```bash
pnpm dev          # http://localhost:3000
pnpm exec prisma migrate deploy   # once, to create the tables
pnpm db:seed                      # once, to seed sample data
```

## Commands

```bash
pnpm dev               # boot the app on http://localhost:3000
pnpm build              # production build
pnpm typecheck
pnpm lint
pnpm format:check
```
