This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

The menu service currently reads from an in-memory fixtures array
(`src/db/fixtures.ts`), not a database — see "Database" below. No
Postgres container is required to run the app as-is.

From the repo root, run the development server:

```bash
pnpm dev --filter @bootcamp/nextjs-app-router-demo
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database

`src/db/data-source.ts` and `src/db/entities/menuItem.ts` set up a
TypeORM `DataSource` for Postgres (via `compose.yaml`), but nothing in
`src/services/menuService.ts` currently calls `getDB()` — it imports
`menuItems` straight from `src/db/fixtures.ts` and returns that
in-memory array. The TypeORM scaffolding is unused, dead code as it
stands; the data is mocked. If you want a real Postgres instance
available anyway (e.g. to build on this scaffolding):

```bash
cp .env.example .env
docker compose up -d
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
