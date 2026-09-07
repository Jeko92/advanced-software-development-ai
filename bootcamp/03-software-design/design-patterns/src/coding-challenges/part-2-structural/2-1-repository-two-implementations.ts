/**
 * Challenge 2.1 — Repository Interface + Two Implementations
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 2, Challenge 2.1)
 *
 * TODO:
 * - `UserRepository` interface — `findById(id)`, `findByEmail(email)`,
 *   `save(user)`, `delete(id)`
 * - `SqlUserRepository implements UserRepository` (a mock SQL client is
 *   fine)
 * - `InMemoryUserRepository implements UserRepository`, backed by a
 *   `Map<number, User>`
 * - `UserService` depending only on the `UserRepository` interface
 * - instantiate the same `UserService` once with each repository and show
 *   it behaves the same either way
 *
 * Focus: the service knows what it needs, not how data is stored.
 */
import { DatabaseSync } from 'node:sqlite';

type User = {
  id: string;
  username: string;
  email: string;
};

interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

class SqlUserRepository implements UserRepository {
  constructor(private readonly db: DatabaseSync) {}

  async findById(id: string): Promise<User | null> {
    // language=SQLite
    // noinspection SqlResolve,SqlNoDataSourceInspection
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as
      User | undefined;

    return row ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    // language=SQLite
    // noinspection SqlResolve,SqlNoDataSourceInspection
    const row = this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as User | undefined;

    return row ?? null;
  }

  async save(user: User): Promise<void> {
    const existing = await this.findById(user.id);

    if (existing) {
      // language=SQLite
      // noinspection SqlResolve,SqlNoDataSourceInspection
      this.db
        .prepare('UPDATE users SET username = ?, email = ? WHERE id = ?')
        .run(user.username, user.email, user.id);
      return;
    }

    // language=SQLite
    // noinspection SqlResolve,SqlNoDataSourceInspection
    this.db
      .prepare('INSERT INTO users (id, username, email) VALUES (?, ?, ?)')
      .run(user.id, user.username, user.email);
  }

  async delete(id: string): Promise<void> {
    // language=SQLite
    // noinspection SqlResolve,SqlNoDataSourceInspection
    this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }
}

class InMemoryUserRepository implements UserRepository {
  constructor(private readonly db: Map<string, User> = new Map()) {}

  async findById(id: string): Promise<User | null> {
    return this.db.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return [...this.db.values()].find((user) => user.email === email) ?? null;
  }

  async save(user: User): Promise<void> {
    this.db.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.db.delete(id);
  }
}

// ---- Service: depends only on UserRepository -----------------------------

class UserService {
  constructor(private readonly repo: UserRepository) {}

  async registerUser(user: User): Promise<void> {
    await this.repo.save(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }

  async removeUser(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

// ---- Demonstration: same UserService, two repositories -------------------

async function demonstrateUserService(
  service: UserService,
  label: string,
): Promise<void> {
  console.log(`\n=== ${label} ===`);

  const alice: User = { id: '1', username: 'alice', email: 'alice@example.com' };
  const bob: User = { id: '2', username: 'bob', email: 'bob@example.com' };

  await service.registerUser(alice);
  await service.registerUser(bob);
  console.log('registered ->', alice.username, bob.username);

  const foundById = await service.getUserById('1');
  console.log('getUserById(1) ->', foundById);

  const foundByEmail = await service.getUserByEmail('bob@example.com');
  console.log('getUserByEmail(bob@example.com) ->', foundByEmail);

  await service.removeUser('1');
  const afterRemoval = await service.getUserById('1');
  console.log('getUserById(1) after removeUser ->', afterRemoval);
}

async function main(): Promise<void> {
  await demonstrateUserService(
    new UserService(new InMemoryUserRepository()),
    'UserService + InMemoryUserRepository',
  );

  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  await demonstrateUserService(
    new UserService(new SqlUserRepository(db)),
    'UserService + SqlUserRepository',
  );
}

void main();
