# Software Design Paradigms - Functional Programming in TypeScript

Functional programming is a broad topic, but in TypeScript projects it often shows up in a practical form: functions receive values, transform them, and return new values without changing unrelated state. This style keeps data flow explicit and makes transformation logic easy to test in isolation from side effects such as database writes or HTTP responses.

## Pure functions

A pure function always gives the same output for the same input and does not change anything outside itself. That makes it easier to test because you only need to check the returned value.

This function breaks purity by going to the database to fetch extra data:

```typescript
async function toUserResponse(userId: number): Promise<UserResponse> {
  const row = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
  const role = await db.query("SELECT name FROM roles WHERE user_id = $1", [
    userId,
  ]);

  return {
    id: row.id,
    fullName: `${row.first_name} ${row.last_name}`,
    email: row.email,
    role: role.name,
  };
}
```

It is impure because the output depends on what the database currently holds, not only on the arguments. Two calls with the same `userId` may return different results if the database changes between them. It is also harder to test — you need a real or mocked database just to check the shape of the response.

This is a common pattern in service code instead:

```typescript
type UserRow = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type UserResponse = {
  id: number;
  fullName: string;
  email: string;
};

function toUserResponse(row: UserRow): UserResponse {
  return {
    id: row.id,
    fullName: `${row.first_name} ${row.last_name}`,
    email: row.email,
  };
}
```

The function above is useful because:

- it depends only on its input
- it does not read from Express, SQL, or the file system
- it turns one shape of data into another shape of data in a predictable way

That makes it a good building block inside a larger MVC application.

## Immutability

In a mutable style, a function receives an object and changes it in place. That can make bugs harder to track because the caller may still hold a reference to the same object.

```typescript
type Order = {
  id: number;
  status: "open" | "paid";
};

function markAsPaid(order: Order): void {
  order.status = "paid";
}

const order = { id: 1, status: "open" };
markAsPaid(order);
console.log(order.status); // "paid" — the original was silently changed
```

The caller passed `order` expecting to keep it unchanged, but the function mutated it in place. If anything else in the codebase still holds a reference to that object, it now sees `"paid"` without knowing why.

This version returns a new object instead of mutating the old one:

```typescript
type Order = {
  id: number;
  status: "open" | "paid";
};

function markAsPaid(order: Order): Order {
  return {
    ...order,
    status: "paid",
  };
}

const order = { id: 1, status: "open" };
const paidOrder = markAsPaid(order);
console.log(order); // not paid
console.log(paidOrder); // paid
```

This version returns a new object instead of mutating the old one. The change is visible at the call site, not hidden inside the function.

Immutability is a quite important concept in TypeScript because:

- function inputs stay easier to trust
- tests become simpler because state does not leak between steps
- you can compose transformations without wondering which function changed the original object

## Array and value transformations

Most day-to-day functional programming in TypeScript is array work and value transformations.

```typescript
type Product = {
  id: number;
  name: string;
  priceInCents: number;
  isActive: boolean;
};

const products: Product[] = [
  { id: 1, name: "Keyboard", priceInCents: 9900, isActive: true },
  { id: 2, name: "Mouse", priceInCents: 4900, isActive: false },
  { id: 3, name: "Monitor", priceInCents: 19900, isActive: true },
];

const activeProductNames = products
  .filter((product) => product.isActive)
  .map((product) => product.name);
```

You can often compare this to a `for` loop that mixes filtering, transformation, and mutation in one place. The loop is not wrong, but the pipeline is often easier to read once you know the pattern.

## Side effects at the edges

Functional code does not mean your application never causes side effects. A web server must write to the database, send responses, and log errors. The goal is to keep those side effects in a well known and isolated environment or module. This way, side effects are manageable and traceable.

```typescript
type CreateUserInput = {
  firstName: string;
  lastName: string;
};

function buildUserInsert(input: CreateUserInput) {
  return {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
  };
}

async function createUserHandler(req: Request, res: Response) {
  const userInsert = buildUserInsert(req.body);
  const savedUser = await userRepository.create(userInsert);

  res.status(201).json(savedUser);
}
```

The pure part and the side effects are separated as follows:

- `buildUserInsert` is pure transformation logic
- `createUserHandler` handles the side effects (write to database and respond to request)

This is one reason functional ideas fit well in MVC codebases.

## Mixing functional and object-oriented styles

In JavaScript and TypeScript, most real applications mix both styles. Functional programming works well for transformation, validation, and predictable business logic. Object-oriented programming is often a better fit when data and behavior need to stay attached to the same model. The skill is knowing which style fits the problem, not committing to one permanently over the other.

## Resources

[TypeScript Handbook: More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
[MDN: Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
