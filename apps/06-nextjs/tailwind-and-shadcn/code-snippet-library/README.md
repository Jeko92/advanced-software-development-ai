# Tailwind & shadcn/ui — Code Snippet Library (starter)

A copy of `apps/06-nextjs/server-vs-client/code-snippet-library`,
scaffolded as the starting point for the Tailwind & shadcn/ui chapter's
challenges — see
`../../../../docs/learning/06-nextjs/tailwind-and-shadcn/challenges.md`.

Everything from the Server vs Client version is already here and working:
the `/snippets` list, `/snippets/[id]` detail page, `/snippets/new` form,
the `SnippetFilter` client component, the snippets API route, and a
Prisma/Postgres-backed `snippetsService`. Nothing has been restyled yet —
the app has no styling tool set up at all. That's on you.

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

This continues the Code Snippet Library and mirrors the Kiki's challenges
— see `challenges.md`'s "Code Snippet Library" section:

1. **Set up Tailwind exactly as in the Kiki's challenge** — install the
   packages, add `postcss.config.mjs`, replace `globals.css` with the
   Tailwind import.
2. **Run `npx shadcn@latest init`**, then add
   `button card select input label`.
3. **Render each snippet in a `Card`.**
4. **Replace the new-snippet link** with a `Button asChild` around a
   `<Link>`.
5. **Replace the native language `<select>`** in `SnippetFilter` with
   shadcn's `Select`.
6. **Replace the form fields** with `Input` and `Label`, keeping the
   `name` attributes intact.
7. **Browse the component catalogue** and see what else you can add.
