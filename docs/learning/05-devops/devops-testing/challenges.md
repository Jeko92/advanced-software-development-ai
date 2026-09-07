# DevOps Testing - Challenges

## Prerequisites: Vitest & NestJS Configuration

Before you begin with the tasks, you need to set up a specific configuration for Vitest.

```bash
npm i --save-dev vitest unplugin-swc @swc/core @vitest/coverage-v8
```

NestJS relies heavily on TypeScript decorators (like `@Injectable()` or `@Controller()`) and dependency injection metadata. Vitest's default compiler (esbuild) does not support these out of the box. To make Vitest understand your NestJS code, you must configure it to use the SWC compiler via a `vitest.config.ts` file.

```typescript
//vitest.config.ts
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
    },
  },
});
```

Additionally, you will need a separate configuration file (e.g., `vitest.config.e2e.ts`) for your E2E tests. This is a best practice to ensure your heavy, database-dependent E2E tests run completely isolated from your fast, lightweight unit tests.

```typescript
//vitest.config.e2e.ts
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
  },
  plugins: [swc.vite()],
});
```

Run E2E tests with:

```bash
vitest run --config ./vitest.config.e2e.ts
```

For further settings, please refer to the Vitest sections in the [NestJS documentation](https://docs.nestjs.com/recipes/swc#vitest).

> _Note: NestJS v12 (expected Q3 2026) is planned to introduce Vitest as the default test runner out of the box. Once released, this manual setup step will likely no longer be required._

## Task 1: Unit Testing the Service Layer

Write unit tests for your `ThreadService` and `CommentService`. Since unit tests must run in complete isolation, do not connect to your real database.

Instead, inject a mocked TypeORM repository. Your mock object (`const mockThreadRepository = { ... }`) only needs to include the methods your service actually calls. Just map those specific methods to `vi.fn()`; there is no need to stub the entire repository interface.

Implement at least the following test cases (you are, of course, free to write as many tests as you like):

- Test that calling `findAll` returns an array of threads provided by your mock repository.
- Test that calling `findOne` with a valid ID returns the correct thread object.
- Test that calling `findOne` with an ID that does not exist throws a NotFoundException.
- Test that calling `create` successfully passes the DTO to the repository's save method and returns the new thread.
- Test that calling `remove` triggers the repository's delete method with the correct ID.
- Test that creating a `Comment` correctly associates it with a `Thread` ID before saving it to the repository.

It is possible that your methods have different names; please adapt these test cases accordingly.

## Task 2: Integration Testing the Controllers

Move one layer up. Write integration tests for the `ThreadController`.

For these tests, use the real Controller and the real Service, but keep the database repository mocked. Use Supertest to make simulated HTTP requests against this hybrid setup. This proves that your routing, validation, and status codes work without touching the disk.

Implement at least the following test cases (you are, of course, free to write as many tests as you like):

- Send a `POST /threads` request with a valid body and verify it returns a `201 Created` status code.
- Send a `POST /threads` request with missing required fields (e.g., no title) and verify it returns a `400 Bad Request` status code.
- Send a `GET /threads/:id` request with a valid ID and verify it returns a `200 OK` along with the mocked thread payload.
- Send a `GET /threads/:id` request for a non-existent thread and verify the controller correctly surfaces a `404 Not Found` status to the client.

It is possible that your routes have different names; please adapt these test cases accordingly.

## Task 3: End-to-End (E2E) Testing

End-to-end tests prove that the entire system from the HTTP router down to the SQLite file works in harmony.

Create a dedicated E2E testing environment. Configure `TypeOrmModule` in your testing setup to use a completely separate database (e.g., an in-memory SQLite database) so your tests do not pollute your development data. Run them using the dedicated configuration: `vitest run --config ./vitest.config.e2e.ts`.

Implement the following test cases:

- The Full Lifecycle: Write a test that sends a `POST` to create a Thread, extracts the generated UUID from the response, sends a `POST` to add a Comment to that Thread, and finally sends a `GET` to fetch the Thread. Assert that both the Thread data and the attached Comment are returned together.
- The Error Path: Send a `GET` request to a randomly generated UUID that definitely does not exist in the test database, and verify the application safely returns a `404` without crashing.

## Task 4: Optional

If you finish the core testing pyramid early, strengthen your test suite by focusing on malicious inputs and unexpected database failures:

- Repository Failure States: Add a unit test to check what happens if `repository.save()` throws an unexpected error (e.g., a database lock). Force the mock to fail (`mockRepository.save.mockRejectedValue(new Error('DB Offline'))`) and ensure your service handles it gracefully.
- Malicious Payloads: In your E2E tests, submit a `POST /threads` request where the `title` is 50,000 characters long, or where the `id` is explicitly provided in the payload to try and overwrite an existing record. Assert that your application cleanly rejects these requests.
