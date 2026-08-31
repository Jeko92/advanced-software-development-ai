# DevOps Testing - The Vanilla Experience

## Beyond Console Logs

Every developer starts "testing" the same way by placing several `console.log()` statements throughout the entire codebase and printing the result to the terminal. Then staring at the output and compare it against what you expected in your head.

That approach might work for short scripts. However, as an application scales, manual terminal checks become time consuming. Automated testing takes that mental load of "did this output match my expectation?" and formalizes it into code.

## Vitest

To write and run these automated checks, we need a testing framework. While Jest dominated the industry for years, Vitest has rapidly become the modern standard. It is exceptionally fast, handles TypeScript out of the box, and shares the exact same API as Jest. Learn one, and you are automatically able to use the other

Instead of just reading about it, let's build a quick sandbox.  
Open your terminal in a new, empty folder and initialize a basic project:

```bash
npm init -y
npm install -D vitest typescript
```

Testing frameworks provide three core utilities to structure your checks:

- `describe`: Groups related tests together under a specific context.
- `it` (or `test`): Defines a single, specific test scenario.
- `expect`: Makes a concrete assertion about the code's output.

## Writing Your First Test

Let's step outside the NestJS ecosystem entirely and test a plain TypeScript function. Create a file named `cart.ts` and add a helper that calculates a shopping cart's final price after applying a percentage discount.

```typescript
// cart.ts
export function calculateDiscount(price: number, percentage: number): number {
  if (price < 0 || percentage < 0) {
    throw new Error("Values cannot be negative");
  }
  return price - price * (percentage / 100);
}
```

Next, create the test file next to it named `cart.spec.ts`. This file imports the function and feeds it different inputs to verify its behavior.

```typescript
// cart.spec.ts
import { describe, it, expect } from "vitest";
import { calculateDiscount } from "./cart";

describe("calculateDiscount", () => {
  it("applies a standard 10% discount correctly", () => {
    const result = calculateDiscount(100, 10);
    expect(result).toBe(90);
  });

  it("handles a 0% discount by returning the original price", () => {
    const result = calculateDiscount(50, 0);
    expect(result).toBe(50);
  });

  it("throws an error when provided a negative price", () => {
    expect(() => calculateDiscount(-10, 20)).toThrow(
      "Values cannot be negative",
    );
  });
});
```

Notice the pattern. We establish the initial conditions and execute the function. Finally, we declare a strict expectation to lock in the behavior. If `calculateDiscount(100, 10)` ever returns anything other than `90`, Vitest instantly fails the test suite.

Run the test in watch mode by executing the following command in your terminal:

```bash
vitest
```

Add the keyword `run` if you want to run the test suite once without watching for file changes (e.g. within your CI \/ CD pipeline).
