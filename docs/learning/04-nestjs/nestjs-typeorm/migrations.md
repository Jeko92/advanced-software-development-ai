# NestJS TypeORM - Database Migrations

During early prototyping, `synchronize: true` feels like magic. You add a property to your TypeScript class, save the file, and the column instantly appears in your database.

In a production environment, `synchronize: true` is a threat to your personal or company data. If you rename a property from `firstName` to `givenName`, TypeORM does not inherently understand your intent. It simply sees that `firstName` is missing and `givenName` is new. Its response is to execute a `DROP COLUMN` followed by an `ADD COLUMN`. The moment that executes against a live database, every user's name is permanently deleted.

A database cannot safely guess how its schema should evolve. We manage this evolution deliberately using migrations.

A migration is a version-controlled TypeScript file containing explicit instructions on how to alter the database schema (the `up` method) and how to undo that exact change (the `down` method). Instead of a moving target, your database schema becomes a strictly ordered, repeatable sequence of applied scripts.

## The CLI Disconnect: `data-source.ts`

To generate and run migrations, we use the TypeORM CLI. However, there is a fundamental architectural problem: the CLI is a standalone Node script. It knows nothing about NestJS, your `AppModule`, or the `@nestjs/config` DI container you set up earlier.

You must provide the CLI with its own dedicated configuration file, typically placed at the project root (`src/data-source.ts`).

```typescript
// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Boardgame } from "./boardgame/boardgame.entity";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "/data/boardgames.sqlite",
  entities: [Boardgame],
  migrations: ["src/migrations/*.ts"],
  synchronize: false, // Absolutely critical to disable this here
});
```

Because your running NestJS app and the TypeORM CLI now share the same entities but load credentials differently, you must ensure they point to the exact same SQLite database file.

> _If you are using the remote Postgres setup from the excursion, you would use `dotenv.config()` here to load your connection credentials)._

## Wrapping the CLI in `package.json`

The raw TypeORM CLI requires heavily nested flags and direct execution via `ts-node` to read your TypeScript files. Add these shortcut scripts to your `package.json` to streamline your workflow:

```json
{
  "scripts": {
    "typeorm": "ts-node ./node_modules/typeorm/cli.js -d ./src/data-source.ts",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert"
  }
}
```

> _(Note: The `--` passes the subsequent arguments directly to the underlying `typeorm` script, bypassing `npm`'s own argument parser.)_

## Generating and Reviewing Migrations

When you alter your `Boardgame` entity, perhaps adding a `publishedYear` column, you ask TypeORM to calculate the difference between your code and the current database schema:

```bash
npm run migration:generate -- src/migrations/AddPublishedYear
```

TypeORM connects to the database, inspects the active schema, diffs it against your entity files, and generates a timestamped file like `1716000000000-AddPublishedYear.ts`:

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublishedYear1716000000000 implements MigrationInterface {
  name = "AddPublishedYear1716000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "boardgames" ADD "publishedYear" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "boardgames" DROP COLUMN "publishedYear"`,
    );
  }
}
```

> _Never blindly execute an auto-generated migration. The CLI is a calculator, not an engineer._

If you rename a column in your entity, the generated migration will almost always output a `DROP COLUMN` and an `ADD COLUMN`. You must manually intervene, open the generated file, and replace those two destructive statements with a single, safe `ALTER TABLE "boardgames" RENAME COLUMN "oldName" TO "newName"`.

## Running and Reverting

Apply your pending migrations:

```typescript
npm run migration:run
```

Under the hood, TypeORM creates a tracking table named `migrations`. It cross-references the files in your `src/migrations` folder against this table, executing the `up` method of any script that hasn't run yet.

SQLite has a major advantage over databases like MySQL here: it fully supports DDL (Data Definition Language) transactions. If a migration fails halfway through because of a syntax error, SQLite automatically rolls back the entire transaction. Your database is never left in a corrupted, half-migrated state.

If you realize a migration was flawed immediately after running it, you can roll it back:

```
npm run migration:revert
```

This triggers the `down` method of the most recently applied migration and deletes its record from the tracking table.
