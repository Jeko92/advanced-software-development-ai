# Next.js Server vs Client - Postgres in Next.js

Up to now the deliveries have lived in an array inside the mock `deliveriesService`. That was enough to build pages against, but it has one fatal flaw: the array resets every time the server restarts. A new request added through the form is gone the moment you redeploy or the server reboots, because the data only exists in memory.

A real application stores its data in a database, where it survives restarts and can be shared across multiple server instances. PostgreSQL is a widely used relational database, and in this chapter we will connect to it using the `postgres` client library and a handful of simple SQL queries.

You are already familiar with ORMs such as TypeORM, and using an ORM would be a perfectly valid choice. However, TypeORM does not fit well with Next.js's design philosophy, and introducing another ORM would distract from the concepts we want to focus on. Since the curriculum is already packed, we have decided to work directly with SQL instead. This keeps the setup small and lets us concentrate on how server components, server functions, and route handlers interact with the database.

## Connecting with the postgres client

After installing the `postgres` package, you create a client from a connection string. The connection string holds the database address, username, and password, so it is a secret and belongs in an environment variable, not in your code. Next.js reads variables from a `.env` file, so you add the database URL there:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/kikis
```

Then create the client once in its own module and export it, so the whole app shares a single connection pool rather than opening a new one on every query:

```typescript
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export default sql;
```

`process.env.DATABASE_URL` reads the variable from `.env`. The trailing `!` is a TypeScript non-null assertion: it tells the compiler the value is definitely set, since `process.env` values are typed as possibly `undefined`. This module only ever runs on the server, so the connection string stays out of the browser bundle and the password is never exposed.

## Initilizing the database

The first time we connect to our database, it is completely empty and has no tables yet. To ensure that the database is initialized, we run a script that creates the `deliveries` table. This script is placed in a special file directly at the root of our project called `instrumentation.ts`. The function we export is recognized by NextJS and is run exactly once during the server startup:

```ts
// instrumentation.ts

import { sql } from "./lib/db";

export async function register() {
  await sql`
    CREATE TABLE IF NOT EXISTS deliveries (
      id SERIAL PRIMARY KEY,
      pickup TEXT NOT NULL,
      destination TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `;
}
```

## Querying with tagged templates

The exported `sql` is a tagged template function. You call it by writing a query inside backticks, and it returns the matching rows. This replaces the mock service from the last session: the function names and types stay the same, but the bodies now read from Postgres.

```typescript
import sql from "@/lib/db";

export type DeliveryStatus = "active" | "accepted" | "denied" | "fulfilled";

export type DeliveryRequest = {
  id: string;
  pickup: string;
  destination: string;
  status: DeliveryStatus;
};

export async function getAllDeliveries(): Promise<DeliveryRequest[]> {
  return sql<DeliveryRequest[]>`SELECT * FROM deliveries`;
}

export async function getDeliveryById(
  id: string,
): Promise<DeliveryRequest | null> {
  const [delivery] = await sql<DeliveryRequest[]>`
    SELECT * FROM deliveries WHERE id = ${id}
  `;
  return delivery ?? null;
}
```

A few things worth noting:

- The query runs asynchronously and returns an array of rows, so `getAllDeliveries` can return the call directly while the pages that use it `await` the result, exactly as they did with the mock
- `sql<DeliveryRequest[]>` is the generic that tells TypeScript what shape each row has, so the rest of your code keeps its types
- `getDeliveryById` destructures the first row with `const [delivery]`, since a lookup by id returns at most one, and falls back to `null` when the array is empty

## Values in tagged templates are safe from injection

The `${id}` inside the query looks like ordinary string interpolation, but it is not, and the difference matters for security. If you built a query by gluing strings together, like `"SELECT * FROM deliveries WHERE id = " + id`, then a caller could pass an `id` that closes your query and appends their own SQL. That attack is called SQL injection, and it can read or destroy your whole database.

The tagged template avoids it. The `postgres` client does not paste `${id}` into the query text. It sends the SQL and the value to the database as two separate things: the query, with a placeholder where the value goes, and the value itself, marked as data. The database treats that value strictly as a value and never as SQL to run, so there is nothing a malicious `id` can break out of. You get the convenience of writing the value inline with the safety of keeping it out of the query text.

## Inserting data

Writing follows the same pattern. `createDelivery`, the function the form's server function calls, inserts a row and returns the created record:

```typescript
export async function createDelivery(
  delivery: Pick<DeliveryRequest, "pickup" | "destination">,
): Promise<DeliveryRequest> {
  const [created] = await sql<
    DeliveryRequest[]
  >`     INSERT INTO deliveries (pickup, destination, status)
    VALUES (${delivery.pickup}, ${delivery.destination}, 'active')
    RETURNING *
  `;
  return created;
}
```

How the insert is built:

- The argument is typed `Pick<DeliveryRequest, "pickup" | "destination">`, because the caller supplies only those two fields; the database generates the `id` and the function sets the starting `status`
- `${delivery.pickup}` and `${delivery.destination}` are sent as separate values, so the same injection safety applies to writes as to reads
- `RETURNING *` asks Postgres to hand back the full row it just created, including the generated `id`, which is why the function can return a complete `DeliveryRequest`

With this in place, a delivery created through the form persists in the database, and the deliveries list reads it back on the next render.

## Resources

[postgres (npm)](https://www.npmjs.com/package/postgres)

[Environment variables in Next.js](https://nextjs.org/docs/app/guides/environment-variables)
