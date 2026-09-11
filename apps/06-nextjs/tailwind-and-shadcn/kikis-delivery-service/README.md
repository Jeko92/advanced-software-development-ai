# Tailwind & shadcn/ui — Kiki's Delivery Service (starter)

A copy of `apps/06-nextjs/server-vs-client/kikis-delivery-service`,
scaffolded as the starting point for the Tailwind & shadcn/ui chapter's
challenges — see
`../../../../docs/learning/06-nextjs/tailwind-and-shadcn/challenges.md`.

Everything from the Server vs Client version is already here and working:
the `/`, `/deliveries`, and `/deliveries/[id]` routes, the `DeliveryFilter`
client component, the `/deliveries/new` server-function form, the
`/api/deliveries` route, and a Prisma/Postgres-backed `deliveryService`.
Nothing has been restyled yet — the app has no styling tool set up at all.
That's on you.

## Setup

```bash
pnpm install
cp .env.example .env
```

The Prisma client is already generated (`lib/generated/prisma`), so
`pnpm typecheck` and `pnpm dev` work immediately. If you want the app
talking to a real database, either run `docker compose up db` in this
folder or get a free hosted one with `npx create-db`, then:

```bash
pnpm run db:migrate:deploy
pnpm run db:seed
```

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

1. **Add Tailwind to the project** — install `tailwindcss`,
   `@tailwindcss/postcss`, `postcss`; add `postcss.config.mjs`; replace
   `app/globals.css` with `@import "tailwindcss";`.
2. **Set up shadcn/ui** — `npx shadcn@latest init`.
3. **Replace bare elements with shadcn components** — `Card` for each
   delivery, a `Button asChild` around the `/deliveries/new` link, shadcn's
   `Select` in `DeliveryFilter`, `Input`/`Label` in the new-delivery form.
4. **Add a custom `brand` button variant** in `components/ui/button.tsx`.
5. **Add dark mode** with `next-themes` and a toggle in the layout.
