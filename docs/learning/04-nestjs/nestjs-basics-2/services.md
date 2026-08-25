# NestJS Basics 2 - Services

Controllers handle the HTTP boundary: receive a request, return a response. A service on the other hand owns the business logic for one domain. For user management, that means knowing how to look up a user by ID, how to create one, and what to return when an update targets a record that does not exist.

The `UserService` below holds the user list in a private array. The next section introduces the repository pattern and explains why data access eventually deserves its own class.

## The @Injectable() Decorator

NestJS manages service instances and injects them where they are needed. For that to work, the class must be marked with `@Injectable()`:

```typescript
import { Injectable } from "@nestjs/common";
import { User } from "./interfaces/user.interface";

@Injectable()
export class UserService {
  private users: User[] = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@example.com" },
  ];

  getAllUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  addNewUser(name: string, email: string): User {
    const user: User = { id: Date.now().toString(), name, email };
    this.users.push(user);
    return user;
  }

  updateUser(id: string, name?: string, email?: string): User | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;
    if (name !== undefined) this.users[index].name = name;
    if (email !== undefined) this.users[index].email = email;
    return this.users[index];
  }

  deleteUser(id: string): boolean {
    const before = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return this.users.length < before;
  }
}
```

`@Injectable()` registers the class as a _provider_ in NestJS's dependency injection container. Services, repositories, and utility classes are all providers. By default, NestJS creates one instance per module and shares it across all injectors.

The controller calls into `UserService` through these methods:

- `getAllUsers` returns a shallow copy of the array, so callers cannot mutate the internal state
- `getUserById` returns `undefined` when no match is found; the controller handles that with a `NotFoundException`
- `addNewUser` generates an ID from the current timestamp and appends the record
- `updateUser` only applies fields that were actually passed; returns `undefined` if the ID does not exist
- `deleteUser` returns `true` if a record was removed, `false` if the ID was not found

A service must appear in the `providers` array of its module:

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
```

Without that entry, NestJS has no record of `UserService` in the module's injection scope. Any class that declares it as a constructor parameter will fail at startup with a "cannot find provider" error.

## Resources

[NestJS Providers documentation](https://docs.nestjs.com/providers)
