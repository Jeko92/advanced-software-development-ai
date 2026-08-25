# NestJS Basics 2 - Repositories

A service that reads and writes data directly knows two things at once: the business rules of your application and the details of how data is stored. The repository pattern separates those concerns. A repository is a class dedicated entirely to data access for one specific model. It exposes a fixed set of methods like `findAll`, `findById`, `create`, `update`, `delete` and handles all the details of how data is fetched or persisted. The service calls those methods without knowing how they work.

## Data source abstraction

A repository is an `@Injectable()` class. Just like services, it is registered in the module's `providers` array and injected into services through their constructor. The distinction is in responsibility: a repository contains no business logic, only the operations needed to read and write data.

Let's refactor our previous example into a service plus a user repository.

```typescript
// src/users/user.repository.ts
import { Injectable } from "@nestjs/common";
import { User } from "./interfaces/user.interface";

@Injectable()
export class UserRepository {
  private users: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@example.com" },
  ];

  findAll(): User[] {
    return [...this.users];
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(data: UserPayload): User {
    const user: User = { id: Date.now().toString(), ...data };
    this.users.push(user);
    return user;
  }

  update(id: string, data: Partial<UserPayload>): User | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...data };
    return this.users[index];
  }

  delete(id: string): boolean {
    const before = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length < before;
  }
}
```

## Service and repository wiring

The service receives the repository through dependency injection and calls its methods without any knowledge of the storage mechanism. Focus on the parts that stay in the service: input validation, conflict resolution, and cross-cutting concerns like removing sessions and posts associated with a user when deleting a user entry.

```typescript
// src/users/user.service.ts
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "./interfaces/user.interface";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  getAllUsers(): User[] {
    return this.userRepository.findAll();
  }

  getUserById(id: string): User | undefined {
    return this.userRepository.findById(id);
  }

  addNewUser(name: string, email: string): User {
    if (!name || name.trim().length < 2) {
      throw new ValidationError("Name must be at least 2 characters");
    }

    if (!isValidEmail(email)) {
      throw new ValidationError("Invalid email format");
    }

    const existing = this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError(`User with email ${email} already exists`);
    }

    return this.userRepository.create({ name, email });
  }

  updateUser(id: string, name?: string, email?: string): User | undefined {
    if (name && name.trim().length < 2) {
      throw new ValidationError("Invalid name format");
    }

    if (email && !isValidEmail(email)) {
      throw new ValidationError("Invalid email format");
    }

    return this.userRepository.update(id, { name, email });
  }

  deleteUser(id: string): boolean {
    this.postRepository.deleteByAuthor(id);
    this.sessionRepository.deleteByUser(id);
    return this.userRepository.delete(id);
  }
}
```

For both the service and the repository to be available for injection, both must be registered under `providers` in the module:

```typescript
// src/users/users.module.ts
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UsersModule {}
```

## Resources

[Repository pattern — Martin Fowler](https://martinfowler.com/eaaCatalog/repository.html)
