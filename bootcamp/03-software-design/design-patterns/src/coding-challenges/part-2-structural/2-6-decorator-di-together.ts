/**
 * Challenge 2.6 — Decorator + DI Together
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 2, Challenge 2.6)
 *
 * TODO:
 * - `DatabaseClient` interface — `query(sql: string)`
 * - `PostgresClient implements DatabaseClient`
 * - `LoggingClient` — an *object wrapper* decorator (not a TS `@decorator`)
 *   that wraps any `DatabaseClient` and logs every query before forwarding
 *   it to the wrapped client
 * - at a composition root, wrap `PostgresClient` with `LoggingClient`
 *   before injecting it into a `UserRepository`
 * - show the repository working unchanged, with queries now logged
 *
 * Focus: decorators can be plain objects too, and compose well with DI.
 */
import { Pool } from 'pg';

interface DatabaseClient {
  query(sql: string): Promise<unknown[]>;
}

class PostgresClient implements DatabaseClient {
  constructor(private readonly pool: Pool) {}

  async query(sql: string): Promise<unknown[]> {
    // language=PostgreSQL
    // noinspection SqlNoDataSourceInspection
    const { rows } = await this.pool.query(sql);
    return rows;
  }
}

class LoggingClient implements DatabaseClient {
  constructor(private readonly wrapped: DatabaseClient) {}

  async query(sql: string): Promise<unknown[]> {
    console.log(`[query] ${sql}`);
    return this.wrapped.query(sql);
  }
}

class UserRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findAll(): Promise<unknown[]> {
    return this.db.query('SELECT * FROM users');
  }
}

// ---- Composition root -----------------------------------------------------

async function main(): Promise<void> {
  const pgPool = new Pool({
    connectionString: 'postgres://localhost:5432/app',
  });

  const loggedClient = new LoggingClient(new PostgresClient(pgPool));
  const userRepository = new UserRepository(loggedClient);

  try {
    const users = await userRepository.findAll();
    console.log('findAll() ->', users);
  } catch (error) {
    console.log(
      'UserRepository failed, as expected without a real users table:',
      (error as Error).message,
    );
  } finally {
    await pgPool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
