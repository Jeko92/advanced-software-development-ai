# Server vs Client — Code-Along

Kiki's Delivery Service, continued from `app-router/code-along`. Same
app, same `deliveriesService`, same `/`, `/deliveries`, and
`/deliveries/[deliveryId]` routes — this package is the starting point
for the Server vs Client chapter's challenges, to be extended with:

- a `DeliveryFilter` **client component** (`"use client"`) that filters
  the list in the browser
- a `/deliveries/new` form backed by a **server function** (`"use server"`)
- that server function moved into its own `code-along/app/actions.ts` file
- an `code-along/app/api/deliveries/route.ts` **API route** (plus a `[id]` variant)
  exposing the deliveries as JSON
- swapping the in-memory `deliveriesService` array for a real
  **PostgreSQL** table via the `postgres` client

See `../../../../docs/learning/06-nextjs/server-vs-client/challenges.md` for the
full step-by-step, and
`../../../../docs/learning/06-nextjs/server-vs-client/concepts-explained.md` for the
mental models behind each piece before diving in.

## Setup

```bash
pnpm install
cp .env.example .env   # once you get to the Postgres step
```

## Commands

```bash
pnpm dev               # boot the app on http://localhost:3000
pnpm build              # production build
pnpm typecheck
pnpm lint
pnpm format:check
```
