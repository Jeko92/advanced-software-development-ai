# Tailwind & shadcn/ui — Code-Along

Kiki's Delivery Service, continued from `server-vs-client/code-along`. Same
app, same `deliveriesService`, same `/`, `/deliveries`, and
`/deliveries/[deliveryId]` routes — Tailwind v4 is already wired up
(`postcss.config.mjs` + `@import "tailwindcss";` in `app/globals.css`), but
not a single utility class has been applied yet. This package is the
starting point for the Tailwind & shadcn/ui chapter, to be extended with:

- utility classes for layout, spacing, color, and typography across the
  existing pages and components
- state and responsive variants (`hover:`, `md:`, …)
- custom design tokens defined in an `@theme` block
- shadcn/ui initialized via its CLI, replacing bare HTML elements with
  `Button`, `Card`, `Select`, `Input`, and `Label`
- a light/dark mode toggle using the `dark:` variant and shadcn's
  CSS-variable theming

See `../../../../docs/learning/06-nextjs/tailwind-and-shadcn/challenges.md`
for the full step-by-step, and the other handouts in that folder for the
concepts behind each piece before diving in.

## Setup

```bash
pnpm install
cp .env.example .env   # once you get to the Postgres step
```

Pick **one** of the two workflows below — don't run both at once, they fight
over port 3000 and disagree about what `DB_HOST`/`DB_PORT` should be.

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
