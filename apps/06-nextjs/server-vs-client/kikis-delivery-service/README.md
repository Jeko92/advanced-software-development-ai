# Server vs Client — Kiki's Delivery Service (starter)

A copy of `apps/06-nextjs/app-router/kikis-delivery-service`, scaffolded as
the starting point for the Server vs Client chapter's challenges — see
`../../../../docs/learning/06-nextjs/server-vs-client/challenges.md`.

What's already here from the app-router version: the `deliveryService`
(in-memory array), and the `/`, `/deliveries`, and `/deliveries/[id]`
routes.

What's new in this package: a **Prisma** setup (schema, client, config,
optional Docker Postgres) wired up but not yet used — that's the last
challenge. Nothing in `app/` or `lib/services/` has been changed yet; that's
on you.

## Setup

```bash
pnpm install
cp .env.example .env
```

> `pnpm typecheck` fails until step 3 below (`prisma migrate dev`) has
> generated a client — `lib/prisma.ts` imports from `./generated/prisma/client`,
> which doesn't exist yet. That's expected on a fresh clone of this starter.

## Commands

```bash
pnpm dev               # boot the app on http://localhost:3000
pnpm build              # production build
pnpm typecheck
pnpm lint
pnpm format:check
```

## Where to start

Work through the "Code Along" challenges for Kiki's Delivery Service in
`challenges.md`, in order:

1. **Filter the deliveries with a client component**
2. **Add a "new delivery" form with a server function**
3. **Move the server function into its own file**
4. **Expose the deliveries as an API route**

Follow `challenges.md` directly for these four — the steps there apply to
this package as-is. Come back here for the fifth one.

## 5. Back the app with Postgres — with Prisma instead of `postgres`

`challenges.md` has you talk to Postgres with the raw `postgres` package.
This package swaps that for **Prisma**, which is already installed and
partially wired up for you:

- `prisma/schema.prisma` — has the `generator`/`datasource` blocks, but no
  model yet
- `lib/get-database-url.ts` — builds a connection string from the `DB_*`
  env vars
- `lib/prisma.ts` — a cached `PrismaClient` singleton (importable as
  `import { prisma } from '@/lib/prisma'`)
- `prisma.config.ts` — points the Prisma CLI at the schema, migrations
  folder, and (once you add one) a seed script
- `docker-compose.yml` / `Dockerfile` — an optional local Postgres, if you
  don't want to use a hosted one

### Steps

1. **Get a database.** Either:
   - Run `docker compose up db` in this folder (reads `DB_USER`,
     `DB_PASSWORD`, `DB_NAME` from `.env`), or
   - Get a free hosted one with `npx create-db` (this also fills in
     `.env` for you — you may need to adapt it to the `DB_USER` /
     `DB_PASSWORD` / `DB_HOST` / `DB_PORT` / `DB_NAME` shape `lib/get-database-url.ts`
     expects, rather than a single `DATABASE_URL`).

2. **Write the `Delivery` model.** Open `prisma/schema.prisma` and translate
   the `deliveries` table from `challenges.md` into a Prisma model — an
   `id`, `pickup`, `destination`, and `status`. Consider a Prisma `enum` for
   status instead of a plain string, since the four values
   (`active`/`accepted`/`denied`/`fulfilled`) are fixed.

3. **Migrate.** From this folder:

   ```bash
   pnpm exec prisma migrate dev --name add_delivery
   ```

   This creates the table, records a migration under `prisma/migrations/`,
   and generates the Prisma Client into `lib/generated/prisma` (gitignored —
   regenerated from the schema, never edited by hand).

4. **Seed it.** Create `prisma/seed.ts` (a small script that connects with
   `PrismaClient`/`PrismaPg` the same way `lib/prisma.ts` does, then calls
   `prisma.delivery.createMany()` with the four starter deliveries from
   `challenges.md`). Wire it up in `prisma.config.ts`'s `migrations.seed`
   (already pointed at `tsx prisma/seed.ts`), then run:

   ```bash
   pnpm run db:seed
   ```

5. **Rewrite `deliveryService`.** Replace the in-memory array in
   `lib/services/deliveryService.ts` with Prisma queries against
   `import { prisma } from '@/lib/prisma'` — `prisma.delivery.findMany()`,
   `prisma.delivery.findUnique()`, `prisma.delivery.create()` — keeping the
   same function names and signatures (`getAllDeliveries`,
   `getDeliveryById`, `createDelivery`) so the rest of the app doesn't need
   to change.

6. **Confirm.** The list, detail pages, filter, and form should all still
   work. Restart `pnpm dev` and confirm a delivery you created is still
   there.
