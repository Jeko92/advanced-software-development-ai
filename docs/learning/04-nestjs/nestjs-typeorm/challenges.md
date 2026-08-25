# NestJS TypeORM - Challenges

## Cyber Chat: Add a Persistent Storage

Until now, Cyber Chat has relied on in-memory arrays. Every time you restart the development server, all threads and comments vanish. In this challenge, you will rip out those volatile repositories and wire the application to a persistent SQLite database.

### Task 1: Set Up the Database

- Bring the SQLite driver and TypeORM dependencies into your existing Cyber Chat project.
- Configure the connection in your root `AppModule`.
- Create a new SQLite database file.

### Task 2: Modeling the Domain

- Translate your domain into TypeORM entities. You will need a `Thread` and a `Comment`. Reuse the object shape that you defined in the previous challenge.

- Design the `Thread` entity:
  - A UUId primary key.
  - A standard string `title` and a text `body`.
  - An auto-managed `createdAt` timestamp.
  - A simple string `author` (a placeholder for a future user system).

- Design the `Comment` entity:
  - A UUId primary key.
  - A standard string `body`.
  - An auto-managed `createdAt` timestamp.
  - A simple string `author` (a placeholder for a future user system).

<details>
  <summary>Hint:</summary>

The Comment Entity needs a [relational decorator](https://typeorm.io/docs/relations/many-to-one-one-to-many-relations/) pointing back to the `Thread` it belongs to.

</details>

### Task 3: Replace the old Repositories

- Delete your custom in-memory repository classes.
- Update your `ThreadService` and `CommentService` to inject TypeORM's generic `Repository`.
- Refactor your business logic to use the database methods instead of array manipulation.

<details>
<summary>Hint:</summary>

Did you remember to add the `TypeORMModule.forFeature([Entity])` method to your Comment and Thread Modules?

</details>

### Task 4: The Initial Migration (Optional)

- Disable `synchronize`.
- Set up your `src/data-source.ts` file and add the TypeORM CLI scripts to your `package.json`.
- Generate your first schema migration, review the generated SQL, and execute the run command to build your database tables.
