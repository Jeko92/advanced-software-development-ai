# NestJS TypeORM - Entities

An entity is the definitive blueprint for a database table. It is a plain TypeScript class annotated with TypeORM decorators.

Because this single class serves multiple roles, your design choices here have long running consequences. The entity determines:

1. **The physical database schema:** TypeORM reads the decorators to generate `CREATE TABLE` and `ALTER TABLE` statements in SQL.
2. **Compile-time safety:** The class properties define the TypeScript types your services will use when interacting with the data.
3. **Runtime hydration:** When the underlying database driver returns a flat row of data, TypeORM intercepts this raw response. It references the metadata from your decorators (e.g., `@Column`) and uses this class structure to map the raw SQL values back into a fully typed JavaScript object.

A poorly configured column type here will spread `any` types or incorrect type assumptions throughout your entire service layer.

## Table Definition: `@Entity`

The `@Entity()` decorator marks a class as a managed database table. A plain class without this decorator is completely invisible to TypeORM.

```typescript
// src/boardgames/entities/bordgame.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("boardgames")
export class Boardgame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

By default, TypeORM uses the lowercased class name as the table name (e.g., `boardgame`). Passing a string to the decorator, like `@Entity("boardgames")`, explicitly sets the SQL table name. This decoupling allows your TypeScript code to use singular class names (`Boardgame`) while adhering to pluralized table naming conventions in the database.

## Primary Keys

Every relational database table requires a primary key to uniquely identify rows. TypeORM provides specific decorators for this.

- `@PrimaryGeneratedColumn()`: Defaults to an auto-incrementing integer.
- `@PrimaryGeneratedColumn("uuid")`: Instructs the driver to generate a UUID (Universally Unique Identifier) for new rows. UUIDs are highly recommended when exposing IDs to external clients via an API, as they prevent malicious users from guessing sequential IDs or scraping your database size.
- `@PrimaryColumn()`: Defines a primary key column but disables auto-generation. Your application code is strictly responsible for providing a unique value during the `INSERT` operation.

## Column Types and SQL Inference

The `@Column()` decorator maps a class property to a SQL column. If you provide no arguments, TypeORM infers the SQL type from the TypeScript type metadata: a TS `string` becomes a `varchar` (or `text`), `number` becomes `integer`, `boolean` becomes `boolean`, and `Date` becomes a `dateime` or `timestamp`.

However, TypeScript types are broad, while SQL types are highly specific. A TypeScript `number` could be an `integer`, a `float`, or a highly precise monetary value. When inference is too loose, you must configure the column explicitly:

```typescript
@Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
price?: number;
```

Common configuration options include:

- `type`: Forces a specific database data type. For example, overriding the default `integer` with `numeric` or `text`.
- `length`: Sets a hard limit on string length (e.g., `varchar(100)`). If omitted, TypeORM defaults to a standard length or uses `text` depending on the underlying database driver.
- `nullable`: Dictates whether the database accepts `NULL`. It defaults to `false`. If you set `nullable: true`, you must mark the TypeScript property as optional (using `?`) so the compiler forces your services to handle potential null checks.
- `unique`: Enforces a database-level unique constraint. The database will reject any `INSERT` or `UPDATE` that duplicates a value in this column.
- `default`: Provides a fallback value at the database level if the application omits the field during an insert.

For auditing and record-keeping, TypeORM provides two lifecycle decorators: `@CreateDateColumn()` and `@UpdateDateColumn()`. These automatically manage timestamps. TypeORM injects the current timestamp on `INSERT` for the former, and updates it on every `UPDATE` for the latter. You never manually set these fields in your application code.

## The `Boardgame` Entity

Here is the complete Boardgame entity we will use moving forward:

```typescript
// src/boardgames/entities/bordgame.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("boardgames")
export class Boardgame {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 120 })
  name: string;

  @Column({ type: "integer" })
  minPlayers: number;

  @Column({ type: "integer" })
  maxPlayers: number;

  @Column({ type: "integer" })
  playtimeMinutes: number;

  @Column({ type: "numeric", precision: 3, scale: 1 })
  complexity: number;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;
}
```

Notice the deliberate design choices:

- UUIDs for identity: The `id` is a UUID string, obscuring our database volume and preventing sequential ID guessing via API endpoints.
- Defensive constraints: `name` is capped at 120 characters to prevent malicious payloads from bloating the database.
- Precision typing: `complexity` uses the `numeric` type (3 total digits, 1 after the decimal point). Storing a BoardGameGeek weight rating like "3.4" as a standard floating-point number risks binary rounding errors. `numeric` guarantees exact precision.
- Timezone awareness: `createdAt` explicitly asks the database for a `timestamp with time zone`, avoiding painful localization bugs when deploying the application to servers in different regions.
