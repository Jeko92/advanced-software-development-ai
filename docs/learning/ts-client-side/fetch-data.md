# TypeScript Client-Side - Fetch API

When making HTTP requests using the `fetch` API, it returns a `Response` object. However, calling `.json()` on it results in an `any` type. TypeScript cannot infer the shape of data that is asynchronously fetched over the network at runtime. Therefore, the parsed value carries no type information until you explicitly assert it.

Without additional type information, every property you access on fetched data is untyped. TypeScript will not warn you if you misspell a field name or access a property that does not exist on the response. Any typo or structural mismatch becomes a silent runtime bug rather than a compile-time error.

The standard approach is to define what the data looks like using a TypeScript `interface`, annotate your function's return type to match, and use type assertion to tell the compiler that the parsed JSON conforms to that shape.

## Defining data shapes

An `interface` describes the structure of an object: its property names and their types. For a fetch call, you define an interface that matches the JSON structure you expect from the API.

```typescript
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}
```

This interface is a compile-time contract. TypeScript uses it to validate that you only access properties that exist on `User` objects. It does not validate the actual network response at runtime. If the API returns something different, TypeScript will not catch it.

## Typing async functions

As mentioned previously, we handle asynchronous data when fetching data from a web server. Therefore an `async` function always wraps its return value in a Promise. To type-annotate this, you use the Promise<Type> syntax, where `Type` corresponds to the interface you defined (more on this later). Because `response.json()` returns an untyped value (`any`), you also need to connect the parsed `JSON` to your interface using a type assertion.

```typescript
async function fetchAllUsers(url: string): Promise<User[]> {
  const response = await fetch(url);
  const data = await response.json();

  return data as User[];
}
```

The two parts of this function:

- The return type `Promise<User[]>` declares the exact shape of the data the function will eventually produce.
- `data as User[]` asserts the parsed JSON as the expected shape, ensuring TypeScript can type-check all downstream usage.

Now, when you `await` the function call, TypeScript treats the result as `User[]`. Accessing the `name` property, as shown below, works perfectly since it exists on the `User` interface. However, trying to access `age` will trigger a compiler error because no such property is defined.

```typescript
const users = await fetchAllUsers("https://jsonplaceholder.typicode.com/users");

console.log(users[0].name);
console.log(users[0].age); // Compiler error - User interface has no 'age' property
```

## Resources

[MDN: Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

[TypeScript handbook: Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
