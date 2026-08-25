# Software Design Paradigms - OOP Design Principles

Learning class syntax is not enough. A codebase does not become well designed just because it uses `class`, `private`, or `extends`. Whether responsibilities are placed in sensible locations is what design principles help you check. The three principles in this chapter are closely related, but they operate at slightly different levels. SRP focuses on one unit of code. DRY focuses on repeated knowledge. Separation of concerns focuses on system structure.

## Single responsibility principle

The single responsibility principle says that a unit of code should only have a single reason to change. That unit might be a function, a class, or a module.

```typescript
function registerUser(username: string, email: string) {
  if (!email.includes("@")) {
    throw new Error("Invalid email.");
  }

  const userRecord = {
    id: crypto.randomUUID(),
    username,
    email,
  };

  return saveToDatabase(userRecord);
}
```

This function mixes validation, record creation, and persistence. That does not always make it broken, but it does mean one function now might change for several different reasons.

A clearer split looks like this:

```typescript
function validateEmail(email: string): void {
  if (!email.includes("@")) {
    throw new Error("Invalid email.");
  }
}

function buildUserRecord(username: string, email: string) {
  return {
    id: crypto.randomUUID(),
    username,
    email,
  };
}

function registerUser(username: string, email: string) {
  validateEmail(email);
  const userRecord = buildUserRecord(username, email);

  return saveToDatabase(userRecord);
}
```

By separating subtasks into different functions, each unit of code is more predictable and easier to maintain.

## Don't repeat yourself

DRY means the same knowledge should not be maintained in several places by hand.

```typescript
interface ProductRecord {
  id: number;
  name: string;
  price: number;
  inventory: number;
  supplierId: string;
}

type ProductCard = Pick<ProductRecord, "id" | "name" | "price">;
type ProductCreatePayload = Omit<ProductRecord, "id" | "supplierId">;
```

This is better than redefining the same product fields in several interfaces. If the source structure changes, the derived types change with it.

DRY does not mean "never repeat any code shape." Sometimes repeating two simple lines is better than creating too many abstractions. The actual problem is repeated knowledge that can diverge.

## Separation of concerns

Separation of concerns works at a larger level than SRP. It is about dividing a system into parts with different responsibilities.

In an Express application, a common split looks like this:

- controllers handle HTTP input and output
- services contain business logic
- repositories handle database access

```typescript
async function createUserController(req: Request, res: Response) {
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
}
```

The controller should not also build SQL queries. The repository should not decide HTTP status codes. That is separation of concerns.

TypeScript can make these boundaries clearer by letting one layer depend on a contract instead of a concrete implementation.

```typescript
interface UserService {
  createUser(username: string): Promise<User>;
}

class SqlUserService implements UserService {
  async createUser(username: string): Promise<User> {
    return userRepository.save({ username });
  }
}

async function createUserController(
  req: Request,
  res: Response,
  userService: UserService,
) {
  const newUser = await userService.createUser(req.body.username);
  res.status(201).json(newUser);
}
```

In this setup, the controller depends on the `UserService` contract. It does not need to know whether the actual implementation talks to SQL, an API, or a test double. That is one way TypeScript supports separation of concerns.

## SRP versus separation of concerns

The two are easy to confuse.

- SRP asks whether one unit is doing too many jobs
- separation of concerns asks whether the system is divided into sensible parts

A service class can respect separation of concerns by staying out of HTTP code, but still violate SRP if one method inside it handles validation, billing, email sending, and audit logging all at once.

## Principles as diagnostic tools

These principles help you ask better questions. They are not laws that force one exact design.

Use them to check your code:

- is this responsibility in the right place
- am I repeating knowledge or just repeating syntax
- will a junior developer understand where to look when behavior changes

## Resources

[Martin Fowler: Code Smell](https://martinfowler.com/bliki/CodeSmell.html)

[Refactoring Guru: DRY](https://refactoring.guru/refactoring/what-is-dry)
