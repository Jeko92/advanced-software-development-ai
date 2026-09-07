# DevOps Testing - Integration Testing

Unit tests validate isolated logic. However, an application is a web of interconnected components. A perfectly functioning service method provides zero value if the HTTP controller dropping the payload misinterprets a route parameter or surfaces an incorrect status code. These failures occur at the boundaries between layers.

Integration tests verify that multiple components work correctly together. In a NestJS environment, this involves spinning up a real `INestApplication` instance, wiring together a real controller and its underlying service, and driving simulated HTTP requests through the stack using a library called Supertest.

> _Note:_ The repository layer is usually still mocked at this level, but now the focus is on the interaction between the HTTP and service layers, not on database behavior. When database interaction is the focus, the testing module can be configured with a real ORM connection backed by an in-memory SQLite database. No mocks are needed; the actual repository queries run against a real schema.

## Controller-Service Interaction

The setup relies on the same `Test.createTestingModule` you use for unit tests. The difference is the scope. We register both the controller and the service as real providers, but we stop the execution chain at the database layer by injecting a mock repository.

```typescript
// user.integration-spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from "supertest";
import { describe, beforeAll, afterAll, it, vi } from "vitest";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./user.entity";

const mockUserRepository = {
  find: vi.fn().mockResolvedValue([{ id: 1, name: "Alice" }]),
};

describe("UserController (integration)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it("GET /users retrieves an array of users successfully", async () => {
    return request(app.getHttpServer())
      .get("/users")
      .expect(200)
      .expect([{ id: 1, name: "Alice" }]);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

After compiling the module, `createNestApplication()` creates a running Nest application instance.

Notice the shift in testing lifecycle hooks. Booting an entire NestJS application carries a distinct performance cost. Instead of isolating every single test run with `beforeEach`, we use `beforeAll` to start the application once for the entire suite, and `afterAll` to tear it down cleanly.

`request(app.getHttpServer())` connects Supertest directly to the underlying Node HTTP server. The requests do not travel over an actual network port, making them incredibly fast while still exercising the complete routing and validation layers. The `.expect()` methods then chain together to assert both the HTTP status code and the response payload simultaneously.

## In-Memory Database Integration

Sometimes the boundary you need to verify is the database itself. You want to guarantee your TypeORM entities map correctly, custom queries return the expected rows, and constraints trigger appropriate errors.

Mocks cannot validate schema integrity. Instead, we swap the production database connection for an ephemeral, in-memory SQLite database. Because we execute the actual TypeORM queries against a real schema, we drop the `useValue` mock entirely.

```typescript
// user.db-integration-spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";
import { describe, beforeAll, afterAll, it } from "vitest";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./user.entity";

describe("UserService (database integration)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it("creates a user and retrieves them by ID", async () => {
    const newUser = { name: "Alice", email: "alice@example.com" };

    const createResponse = await request(app.getHttpServer())
      .post("/users")
      .send(newUser)
      .expect(201);

    const createdId = createResponse.body.id;

    return request(app.getHttpServer())
      .get(`/users/${createdId}`)
      .expect(200)
      .expect({ id: createdId, name: "Alice", email: "alice@example.com" });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

Setting `type: 'sqlite'` combined with `database: ':memory:'` instructs TypeORM to build a temporary database in RAM. It exists solely for the duration of the test execution and leaves no artifacts behind.

The `synchronize: true` flag forces TypeORM to automatically generate the SQL tables based on your entity definitions. Never enable this setting in a production environment or against a persistent shared database, as it aggressively overwrites existing data structures.

## Testing Authenticated Routes

Integration tests must handle application security. If a controller relies on a JWT guard, requests lacking a valid token face immediate rejection. Your test suite must simulate the login flow to acquire an authorization token before attempting to access protected endpoints.

```typescript
it("authenticates a user and accesses a protected route", async () => {
  // Authenticate to retrieve the token
  const loginResponse = await request(app.getHttpServer())
    .post("/auth/login")
    .send({ username: "alice", password: "secret" })
    .expect(200);

  const token = loginResponse.body.access_token;

  // Attach the token to the subsequent request
  return request(app.getHttpServer())
    .get("/auth/profile")
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
});
```

Supertest allows you to manipulate request headers using the `.set()` method. Extracting the token from the initial login response and injecting it into the authorization header of the subsequent request perfectly replicates a real client's authentication lifecycle.

## Resources

[NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)

[Supertest on GitHub](https://github.com/ladjs/supertest)

[TypeORM In-Memory Testing](https://typeorm.io/connection-options#sqlite-connection-options)
