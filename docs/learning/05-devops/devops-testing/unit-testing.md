# DevOps Testing - Unit Testing with NestJS

## The Dependency Problem

Testing pure functions like our `calculateDiscount` or `calculateLateFee` helper are straightforward because they only depend on their inputs. NestJS services rarely afford us that luxury. A typical service requires a database connection, external APIs, or other injected providers to function.

Instantiating a service manually with new `UserService()` demands that you pass a real database connection into the constructor. Providing a live database ruins the isolation of a unit test. Your suite would slow down drastically, and a test failure might simply indicate that the database server is offline rather than exposing a logical bug.

The solution is to test the service in a controlled sandbox using fake dependencies.

## The Testing Sandbox

NestJS provides a dedicated package called `@nestjs/testing` to recreate its Dependency Injection (DI) system without booting a web server. We configure a minimal module, register only the pieces we want to test, and swap out the dangerous dependencies with harmless substitutes.

Consider a `UserService` that interacts with a database to retrieve user information:

```typescript
// user.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  isAdult(age: number): boolean {
    return age >= 18;
  }

  async getUserName(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user.name;
  }
}
```

## Mock Injection and State Isolation

Because this service injects a TypeORM repository, we need to bypass the real database during testing. We use Vitest to create a "mock", an imposter object that mimics the repository's shape but executes zero real logic.

Instead of building a complex fake class from scratch, Vitest provides `vi.fn()`. This utility generates a trackable function where we control the exact return value and verify its execution history.

Here is how to inject a mock in place of the real repository:

```typescript
// user.service.spec.ts
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UserService } from "./user.service";
import { User } from "./user.entity";

const mockUserRepository = {
  findOne: vi.fn(),
  save: vi.fn(),
};

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });
});
```

The `beforeEach` block runs before every individual test case. We compile the testing module fresh every time to guarantee absolute state isolation. If one test alters the mock's behavior, the next test starts with a clean slate, preventing unpredictable cross-test pollution.

Notice the DI configuration. `getRepositoryToken(User)` asks NestJS for the exact internal identification string it uses for the User repository. The `useValue` property forces the module to inject our `mockUserRepository` whenever that string is requested.

## Controlling the Mock: Happy and Unhappy Paths

With the sandbox compiled successfully, we can write the actual test cases.

Database queries are asynchronous. When we mock a repository method like `findOne`, we cannot simply return a static object. We must return a Promise. Calling `.mockResolvedValue(fakeUser)` programs our fake function to instantly return our dummy data as a resolved Promise, perfectly simulating a successful database query without touching a hard drive.

Here is how we test both a successful retrieval (the happy path) and a missing record (the unhappy path):

```typescript
// user.service.spec.ts
describe('UserService', () => {
...
    beforeEach(async () => {
    ...
    });

    it("retrieves a user's name successfully", async () => {
        // Arrange: Program the mock to return a specific user
        const testUser = { id: 1, name: "Alice", email: "alice@example.com" };
        mockUserRepository.findOne.mockResolvedValue(testUser);

        // Act: Call the service method
        const result = await service.getUserName(1);

        // Assert: Verify the mock was called correctly and the output matches
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(result).toBe("Alice");
    });

    it("throws a NotFoundException when the user does not exist", async () => {
        // Arrange: Program the mock to simulate a missing database record
        mockUserRepository.findOne.mockResolvedValue(null);

        // Act & Assert: Expect the promise to reject with a specific error
        await expect(service.getUserName(99)).rejects.toThrow(NotFoundException);
    });
});
```

Services spend a significant portion of their execution time handling missing data, invalid states, or unauthorized access. A robust test suite validates these failure states just as rigorously as the success scenarios.

## Common Vitest Mock Utilities

You will rely on a handful of core Vitest utilities to manipulate dependencies across your test suites. Refer to the documentation if necessary. Here is a short excerpt:

| Method                           | Purpose                                                                       |
| :------------------------------- | :---------------------------------------------------------------------------- |
| `vi.fn()`                        | Creates a mock function that tracks all calls and arguments                   |
| `.mockResolvedValue(value)`      | Makes the mock return a resolved Promise (for async methods)                  |
| `.mockReturnValue(value)`        | Makes the mock return a synchronous value                                     |
| `vi.spyOn(object, 'method')`     | Wraps an existing method to track calls without destroying its original logic |
| `.toHaveBeenCalledWith(...args)` | Asserts the mock was executed with the specified arguments                    |

## Resources

[NestJS Testing documentation](https://docs.nestjs.com/fundamentals/testing)

[Vitest Mock Functions](https://vitest.dev/guide/learn/mock-functions.html)
