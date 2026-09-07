# DevOps Testing - End-to-End Testing

Integration tests verify boundaries, but they still mock the edges. Passing an integration test does not guarantee the application boots successfully, global pipes function correctly, or module wiring is complete.

End-to-end (E2E) tests fill this gap. They launch the fully assembled NestJS application and simulate real HTTP traffic. If a required provider is missing from `AppModule` or a global validation pipe rejects a payload, the E2E test will expose the failure because it exercises the exact same request lifecycle your users experience.

## The Tradeoff

Running the entire stack is resource-intensive. E2E tests take longer to execute and are highly sensitive to minor structural changes. Altering a route path or adding a required DTO field can break tests completely unrelated to your current task.

Consequently, keep E2E suites focused. Target the critical user journeys, the primary routes and most severe failure states, rather than attempting to cover every conceivable edge case.

## Full Application Bootstrap

Instead of targeting individual controllers, E2E tests import the root `AppModule`. We configure the test database using an in-memory SQLite instance to prevent polluting your local development data

```typescript
// test/app.e2e-spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { AppModule } from "../src/app.module";

describe("App (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // This pulls in the entire application tree
    }).compile();

    app = module.createNestApplication();

    // Mirror your main.ts setup here
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
});
```

The call to `app.useGlobalPipes(new ValidationPipe())` is vital. If your production main.ts registers global middleware, interceptors, or pipes, you must duplicate that configuration in your E2E setup. Otherwise, you are testing a fundamentally different application.

We use beforeAll and afterAll to ensure the server boots exactly once per suite, keeping execution times manageable.

## HTTP Assertions with Supertest

Supertest sends simulated traffic against the active server instance. You chain HTTP methods, paths, and payloads, concluding with `.expect()` assertions to validate the outcome.

Building on the bootstrap above, a test covering user creation and retrieval looks like this:

```typescript
it("creates a user and fetches them successfully", async () => {
  // Simulate a POST request to create the resource
  const response = await request(app.getHttpServer())
    .post("/users")
    .send({ name: "Alice", email: "alice@example.com" })
    .expect(201);

  // Assert the dynamic response structure
  expect(response.body).toMatchObject({
    id: expect.any(Number),
    name: "Alice",
    email: "alice@example.com",
  });

  const createdId = response.body.id;

  // Simulate a GET request to verify persistence
  return request(app.getHttpServer())
    .get(`/users/${createdId}`)
    .expect(200)
    .expect({ id: createdId, name: "Alice", email: "alice@example.com" });
});

it("returns a 404 status for an unknown user ID", () => {
  return request(app.getHttpServer()).get("/users/99999").expect(404);
});
```

Using `toMatchObject` is highly effective here. It verifies the response contains the specific fields you care about without demanding a strict, exact match on dynamically generated data like database IDs or creation timestamps.

## Scope and Execution

Push complex logic branching and edge cases down to your unit tests. Your E2E suite should act as a high-level sanity check covering:

- The happy paths for primary resources (Create, Read, Update, Delete).
- Basic authentication barriers (e.g., accessing a protected route without a token).
- Standard validation rejections (e.g., submitting a malformed payload returns a 400).

Because we standardized on Vitest, you can execute your E2E suite by targeting the `test/` directory directly using the Vitest CLI:

```bash
npx vitest run ./test
```

Many teams map this to a specific NPM script in `package.json` to keep the execution of the slower E2E tests separate from their lightning-fast unit test runs.

## Resources

[NestJS E2E Testing Documentation](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing)

[Supertest on GitHub](https://github.com/ladjs/supertest)
