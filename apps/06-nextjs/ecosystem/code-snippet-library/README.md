# Ecosystem — Code Snippet Library (starter)

A copy of `apps/06-nextjs/tailwind-and-shadcn/code-snippet-library`,
scaffolded as the starting point for the Ecosystem chapter's challenges —
see `../../../../docs/learning/06-nextjs/ecosystem/challenges.md`.

Everything from the Tailwind & shadcn/ui version is already here and
working: the `/snippets` list, `/snippets/[id]` detail page,
`/snippets/new` form, all styled with Tailwind and shadcn/ui components.
Nothing has been wired up for this chapter yet — no `react-hook-form`, no
Zustand, no Monaco. That's on you.

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

If `tailwind-and-shadcn/code-snippet-library`'s or
`kikis-delivery-service`'s `db` container is still up, stop it first —
they all default to host port `5433`.

## Commands

```bash
pnpm dev               # boot the app on http://localhost:3000
pnpm build              # production build
pnpm typecheck
pnpm lint
pnpm format:check
```

## Where to start

See `instructions.md` in this directory — it maps all three of
`challenges.md`'s "Code Snippet Library" exercises (a react-hook-form
create form, a persisted Zustand favorites feature, and a Monaco code
editor) onto this project's actual files, in order.
