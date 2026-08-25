/**
 * Challenge 2.4 — Decorator: Retry Logic
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 2, Challenge 2.4)
 *
 * Same decorator mechanism as ../../patterns/structural/decorator.ts's
 * `@measure`, applied to a different concern.
 *
 * TODO:
 * - a `retry(maxAttempts: number, delayMs: number)` class-method decorator
 *   — if the decorated method throws, catch it, wait `delayMs`, and retry
 *   up to `maxAttempts` times
 * - apply `@retry(...)` to a `flakyApiCall()` method that fails randomly
 *   (e.g. `Math.random() < 0.7`)
 * - log each attempt and the final outcome (success or exhausted retries)
 *
 * Focus: decorators add cross-cutting behavior without touching the
 * original method body.
 */
const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const retry = (maxAttempts: number, delayMs: number) => {
  return <This, Args extends unknown[], Return>(
    originalMethod: (this: This, ...args: Args) => Return | Promise<Return>,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return | Promise<Return>
    >,
  ) => {
    const name = String(context.name);

    return async function (this: This, ...args: Args): Promise<Return> {
      let lastError: unknown;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const result = await originalMethod.call(this, ...args);
          console.log(`[retry] ${name} succeeded on attempt ${attempt}`);
          return result;
        } catch (error) {
          lastError = error;
          console.log(
            `[retry] ${name} attempt ${attempt} failed: ${(error as Error).message}`,
          );

          if (attempt < maxAttempts) {
            await sleep(delayMs);
          }
        }
      }

      console.log(`[retry] ${name} exhausted all ${maxAttempts} attempts`);
      throw lastError;
    };
  };
};

// ---- Scaffold: apply @retry to a method that fails randomly --------------

class ApiClient {
  @retry(4, 200)
  async flakyApiCall(): Promise<string> {
    if (Math.random() < 0.7) {
      throw new Error('Network error: request timed out');
    }
    return 'response data';
  }
}

async function main(): Promise<void> {
  try {
    const result = await new ApiClient().flakyApiCall();
    console.log('flakyApiCall succeeded ->', result);
  } catch (error) {
    console.log(
      'flakyApiCall failed after exhausting all retries:',
      (error as Error).message,
    );
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
