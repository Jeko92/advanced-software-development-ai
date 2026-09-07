# DevOps Testing - Test-Driven Development

Another special habit among most (~~aspiring~~) developers is to treat testing as an afterthought. Build a feature, verify it works manually, and eventually write a test to lock in the behavior afterwards. The concept of Test-Driven Development (TDD) reverses this workflow entirely.

It’s quite easy to understand (but challenging to master). Instead of writing code to solve a problem, you write a test that defines the expected outcome. Then, you write the exact amount of code necessary to make that test pass. This approach dictates how your functions will be used, what inputs they require and what outputs they return, rather than getting lost in the internal logic.

## The Red-Green-Refactor Cycle

TDD relies on a strict, continuous rhythm. You never write production code unless you have a failing test demanding it.

1. **Red: Write a failing test.**  
   Translate a single business requirement into code. Run the test suite. It will fail, and it should fail, because the underlying function does not exist or lacks the necessary logic. Seeing the failure confirms your test is actually validating something.

2. **Green: Make it pass.**  
   Write the simplest, most direct code to turn the test green. Do not worry about elegance or scalability here. Hardcode values if you have to. The only goal is to satisfy the test condition.

3. **Refactor: Clean up the mess.**  
   Now that the safety net is active, you can improve the code structure. Remove duplicates, extract helper functions, and apply better naming conventions. Because the tests run constantly in watch mode, you will know immediately if your cleanup breaks the logic.

By repeating this cycle, you are following the TDD paradigm.

## TDD in Action: The Library Late Fee

Let's build a function `calculateLateFee` to calculate library late fees using this cycle. The business rules dictate a fee of 2 for every day a book is overdue, capped at a maximum fee of 10.

First, define the initial expectation (Red). Create a file called `library.spec.ts`. You can do this in the previous directory or create a new one.

```typescript
// library.spec.ts
import { describe, it, expect } from "vitest";
import { calculateLateFee } from "./library";

describe("calculateLateFee", () => {
  it("charges 2 per day for overdue books", () => {
    const fee = calculateLateFee(3);
    expect(fee).toBe(6);
  });
});
```

Running this throws an error immediately because `calculateLateFee` does not exist. To silence the failing test, we create `library.ts` and write the most direct logic possible.

```typescript
// library.ts
export function calculateLateFee(daysOverdue: number): number {
  return daysOverdue * 2;
}
```

The test passes. We have no complex logic to refactor yet, so we move to the next requirement: the maximum cap. We add another test (Red) inside the test file.

```typescript
// library.spec.ts
import { expect, it } from "vitest";
import { calculateLateFee } from "./library";

it("caps the maximum late fee at 10", () => {
  const fee = calculateLateFee(7);
  expect(fee).toBe(10);
});
```

Vitest flags this as a failure. Seven days overdue currently returns 14, not 10. We return to the function and update the logic to make both tests pass (Green).

```typescript
// library.ts
export function calculateLateFee(daysOverdue: number): number {
  const fee = daysOverdue * 2;
  if (fee > 10) {
    return 10;
  }
  return fee;
}
```

The suite goes green. Now we evaluate the code structure (Refactor). The logic works, but we can make it more concise using JavaScript's built-in math utilities without changing the behavior.

```typescript
// library.ts
export function calculateLateFee(daysOverdue: number): number {
  return Math.min(daysOverdue * 2, 10);
}
```

The tests confirm the refactored code still perfectly fulfills the business requirements.

Letting tests dictate your implementation naturally yields high coverage and keeps you from over-engineering. Ultimately, your test suite becomes living documentation for the business logic
