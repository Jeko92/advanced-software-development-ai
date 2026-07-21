# TypeScript Challenges — JS to TS

These challenges are for students who are **comfortable with JavaScript** (variables, functions, arrays, objects, loops) but **new to TypeScript**.

Each challenge starts with plain JavaScript. Your job is to turn it into valid, strictly-typed TypeScript.

## Preparations

1. install typescript dependency with `npm i`
2. run the TypeScript-compilation to JavaScript with `npm run compile` which runs the command `tsc` (typescript-compiler)
3. check if challenge-01.js was created
4. execute the created JS file with node: `node src/challenge-01.js`

## How to work through the challenge

1. Create a new file in `src/`, e.g. `src/challenge-01.ts`
2. Paste the **Starting JavaScript** code from the challenge
3. Apply the **Tasks** — add types, interfaces, or fixes until `tsc` compiles without errors
4. Run `npm run compile` and confirm there are no type errors
5. Run the created JS-file with node

> **Tip:** With `strict: true` in this project, TypeScript will catch mistakes early. Read the error messages — they usually tell you exactly what to add or fix.

---

## Challenge 1 — Rename and annotate primitives

**Concepts:** `.ts` files, primitive types (`string`, `number`, `boolean`)
A `.ts` file is mostly JavaScript. TypeScript adds **type annotations** so the compiler can check your code before it runs.

### Starting with this JavaScript snippet

```js
const firstName = "Alex";
let age = 28;
const isStudent = true;

console.log(`${firstName} is ${age} years old.`);
console.log(`Student: ${isStudent}`);
```

### Tasks

1. Save the code as `src/challenge-01.ts`
2. Add explicit type annotations to all three `const` declarations
3. Run `npm run compile` and confirm there are no type errors
4. Run the created JS-file with node

---

## Challenge 2 — Type function parameters and return values

**Concepts:** function signatures, `void`, explicit return types
In JavaScript, any value can be passed to any function. TypeScript lets you **declare what a function expects and returns**.

### Starting JavaScript

```js
function greet(name) {
  return `Hello, ${name}!`;
}

function logMessage(message) {
  console.log(message);
}

function add(a, b) {
  return a + b;
}

console.log(greet("Sam"));
logMessage("Welcome to TypeScript");
console.log(add("5", "7"));
```

### Tasks

1. Save as `src/challenge-02.ts`
2. Check the errors VSCode/tsc is given you and solve the logic and type errors
3. Add an explicit return type to each function
4. Run `npm run compile` and confirm there are no type errors
5. Run the created JS-file with node

---

## Challenge 3 — Type arrays and array methods

**Concepts:** `string[]`, `number[]`, typed callbacks

Arrays in TypeScript hold **one kind of value** (unless you use unions — later).

### Starting JavaScript

```js
const fruits = ["apple", "banana", "cherry", 123];

function shoutAll(items) {
  return items.map((item) => item.toUpperCase());
}

function sum(numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(shoutAll(fruits));
console.log(sum([10, 20, 30]));
```

### Tasks

1. Save as `src/challenge-03.ts`
2. Type `fruits` accordingly
3. Type the parameters and return values of `shoutAll` and `sum` accordingly
4. Make sure `.map()` and `.reduce()` callbacks are correctly typed
5. Run `npm run compile` and confirm there are no type errors
6. Run the created JS-file with node

---

## Challenge 4 — Describe objects with an interface

**Concepts:** `interface`, object shapes, nested objects

JavaScript objects have any shape you want. TypeScript uses **interfaces** to describe what properties an object must have.

### Starting JavaScript

```js
const book = {
  title: "The Pragmatic Programmer",
  author: "Hunt & Thomas",
  pages: 352,
  published: 1999,
};

function printBookInfo(book) {
  console.log(`${book.title} by ${book.author} (${book.pages} pages)`);
}

printBookInfo(book);
```

### Tasks

1. Save as `src/challenge-04.ts`
2. Create an interface `Book` with `title`, `author`, `pages`, and `published` — use the correct primitive types
3. Type the `book` constant and the `printBookInfo` parameter accordingly
4. Try changing `book.pages = "many"` — confirm TypeScript catches it, then revert
5. Run `npm run compile` and confirm there are no type errors
6. Run the created JS-file with node

---

## Challenge 5 — Optional properties

**Concepts:** optional properties (`?`), `undefined`, strict null checks

Not every property is always present. TypeScript marks optional fields with `?`.

### Starting JavaScript

```js
const users = [
  { id: 1, name: "Kim", email: "kim@example.com" },
  { id: 2, name: "Lee" },
];

function formatUser(user) {
  // LOGIC here for a format like: Kim <kim@example.com>
}

users.forEach((user) => console.log(formatUser(user)));
```

### Tasks

1. Save as `src/challenge-05.ts`
2. One try only: Implement first the logic of formatUser without using TypeScript.
   If you solve it directly without any second try -> very good.
   If it fails initially, don't try again and go over to the next steps.
3. Create a `User` interface with the according properties
4. Type the `users` const accordingly
5. Type the `formatUser` function parameters and return type accordingly
6. Finish the implementation for the `formatUser` function, if needed.
7. Run `npm run compile` and confirm there are no type errors
8. Run the created JS-file with node
