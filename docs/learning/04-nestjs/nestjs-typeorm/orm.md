# NestJS TypeORM - The ORM Layer

Relational databases structure data in flat, two-dimensional grids linked by foreign keys. Application code relies on deeply nested, interconnected object graphs stored in memory. Moving data between these two environments forces a constant translation step.

This friction is called the object-relational impedance mismatch. When you query a database using a raw driver like `pg` (Postgres) or `better-sqlite3` (SQLite), you send a string of SQL and receive an array of untyped rows. The next step would be to write boilerplate code that instantiates classes, casts types, and maps foreign keys into nested arrays. The TypeScript compiler cannot verify these SQL strings, meaning schema changes would trigger runtime errors rather than compile-time warnings.

An Object-Relational Mapper (ORM) abstracts this translation work. We define the data structure once using a class, and the ORM derives the database schema, generates the necessary SQL queries, and automatically hydrates the returned rows back into fully typed objects. The following example shows the definition of a basic entity using TypeORM's decorators:

```typescript
// src/boardgames/entities/bordgame.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Boardgame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "int" })
  minPlayers: number;
}
```

We will take a closer loot at these decorators after some thoughts. For now, notice the paradigm: the class is the single source of truth. TypeORM reads this class metadata to build tables, validate inserts, and give you autocompletion when querying.

> 💡 When you are coming from the base Web bootcamp you already used an ORM, or more specific an ODM. Mongoose is an "Object Document Mapper" for MongoDB which does the same Job as an ORM for SQL databases. Though with MongoDB, the gap between the data model and the database is much smaller.

## The Database Tooling Landscape

ORMs are not the only way to talk to a database. When deciding how to build a data layer, engineering teams generally choose between three levels of abstraction:

**1. Raw Drivers (`pg`, `sqlite3`)**
You write pure SQL.

- _Pros:_ Maximum performance, total control over execution plans, zero abstraction overhead.

- _Cons:_ No type safety for the queries, heavy boilerplate to map results, vulnerable to SQL injection if parameters aren't bound correctly.

**2. Query Builders (Knex, Kysely)**
You write queries using JavaScript/TypeScript functions rather than raw strings.

- _Pros:_ SQL injection protection by default, programmable queries (e.g., conditionally adding `WHERE` clauses), solid type safety with modern tools like Kysely.

- _Cons:_ You still have to manually map the flat result sets into your application's object structures.

**3. ORMs (TypeORM, Prisma, MikroORM, Drizzle)**
You interact with methods on an object model, and the framework generates the SQL.

- _Pros:_ Drastically speeds up development for standard CRUD operations, handles complex table joins automatically, provides full type safety from the database to the API response.

- _Cons:_ The generated SQL can be inefficient. Complex aggregations or bulk operations often perform poorly compared to handwritten queries.

## Why TypeORM for NestJS?

While Prisma might currently be the most popular ORM in the wider JavaScript ecosystem, why does NestJS treat TypeORM as its default? The answer is architectural alignment.

NestJS is heavily inspired by Angular. Their shared philosophy around decorators, dependency injection, and architecture is also applied to TypeORM. Your data models are plain TypeScript classes annotated with decorators, matching the aesthetic and mental model of the rest of your NestJS codebase.

Furthermore, TypeORM implements two distinct ORM patterns: Active Record (where the entity itself has methods like `User.save()`) and Data Mapper. NestJS forces the Data Mapper pattern.

In the [Data Mapper pattern](https://typeorm.io/docs/guides/active-record-data-mapper/#what-is-the-data-mapper-pattern), the entity is just a dumb data container. A separate object (a Repository) handles the actual database operations (e.g. `repository.save(user)`). This perfectly suits NestJS because the Repository can be injected into any Service using the framework's dependency injection container, keeping your business logic strictly decoupled from your database connection.

## Resources

- [TypeORM documentation](https://typeorm.io/)
- [NestJS database chapter](https://docs.nestjs.com/techniques/database)
