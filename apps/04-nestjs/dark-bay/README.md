# DarkBay

An underground marketplace API where users list items for auction and bid
against each other. Sellers post an auction with a starting price and an end
date (defaults to +3 days if omitted); other users compete by placing offers.
A bid is only valid if it meets the starting price and strictly beats the
current highest offer, and only while the auction is still open. No
frontend — this is a pure JSON REST API, built with NestJS.

This is Recap Project 3 of neuefische's Advanced Software Development with AI
bootcamp ([intro](https://wd-bootcamp.github.io/asd-curriculum/recap-project-3/intro.html),
[challenges](https://wd-bootcamp.github.io/asd-curriculum/recap-project-3/challenges.html)).

## Tech Stack

- **Framework:** NestJS (CommonJS, strict TypeScript)
- **Database:** SQLite via `better-sqlite3` + TypeORM
- **Auth:** Passport + `@nestjs/jwt`, global guard with `@Public()` opt-out
- **Docs:** `@nestjs/swagger` (OpenAPI, CLI plugin enabled)

## Getting Started

```bash
pnpm install
cp .env.example .env   # fill in a real JWT_SECRET
pnpm migration:run      # creates the SQLite database at DB_FILE
pnpm dev                 # boot the app on http://localhost:3000
```

Swagger docs (with a bearer-token dialog for protected endpoints) are served
at `/api` outside production.

Optional: `pnpm db:seed` creates a fixed admin/user pair (`admin`/`admin12345`,
`seeduser`/`user12345`) for exercising role-based access by hand. It refuses
to run when `NODE_ENV=production`.

## Entity-relationship diagrams

`docs/erd/` has two versions, both as `.mmd` (Mermaid source), `.svg`, and
`.png`:

- `darkbay.*` — the conceptual domain model (`User`, `Auction`, `Offer`,
  `Watchlist`)
- `darkbay-db.*` — the actual generated schema, introspected from the live
  SQLite database (lowercase table names, TypeORM's real column types)

## API Notes

- **`GET /auctions` filtering:** `?min-price=`/`?max-price=` use hyphenated
  query keys (matching the brief) even though the DTO fields are camelCase
  (`minPrice`/`maxPrice`) — bound via `class-transformer`'s `@Expose({ name:
'min-price' })` rather than a separate `@Query('min-price')` param.
- **Price filtering is against `startingPrice`**, not the current/highest
  bid. `startingPrice` is a real column, so filtering it is a direct `where`
  clause; filtering by current price would need a subquery or a computed
  value per auction. Documented simplification, not an oversight.

## Database Migrations

Schema changes are managed with real TypeORM migrations, not `synchronize`
(which is off). All migration commands run through the CLI data source at
`src/db/data-source.ts` via the CommonJS-flavored `typeorm-ts-node-commonjs`
runner (required since this project is CommonJS, not ESM).

- **Fresh clone:** after `pnpm install`, run `pnpm migration:run` to create
  a working database at the path in `DB_FILE` before starting the app.
- **After changing an entity:** run
  `pnpm migration:generate src/db/migrations/<Name>` to have TypeORM
  diff your entities against the current schema and generate the migration
  file, review the generated SQL, then `pnpm migration:run` to apply it.
- **Undo the last migration:** `pnpm migration:revert`.
