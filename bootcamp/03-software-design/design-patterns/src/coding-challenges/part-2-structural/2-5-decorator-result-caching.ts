/**
 * Challenge 2.5 — Decorator: Result Caching
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 2, Challenge 2.5)
 *
 * TODO:
 * - a `cache(ttlMs: number)` class-method decorator that memoizes results
 *   in a `Map` keyed by `JSON.stringify(args)`
 * - within `ttlMs` of a call, the same arguments return the cached value
 *   instead of re-invoking the original method
 * - apply it to an expensive `calculatePrimes(max: number)` method
 * - call it twice with the same argument and show the timing difference
 *   between the first (uncached) and second (cached) call
 *
 * Focus: reusable behavior (caching) stays outside the business logic.
 */
import assert from 'node:assert';

type CacheEntry<Return> = {
  value: Return;
  expiresAt: number;
};

const cache = (ttlMs: number) => {
  return <This, Args extends unknown[], Return>(
    originalMethod: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >,
  ) => {
    const name = String(context.name);
    const store = new Map<string, CacheEntry<Return>>();

    return function (this: This, ...args: Args): Return {
      const key = JSON.stringify(args);
      const now = Date.now();
      const cached = store.get(key);

      if (cached && cached.expiresAt > now) {
        console.log(`[cache] ${name}(${key}) -> cache hit`);
        return cached.value;
      }

      const result = originalMethod.call(this, ...args);
      store.set(key, { value: result, expiresAt: now + ttlMs });
      console.log(`[cache] ${name}(${key}) -> cache miss, computed`);
      return result;
    };
  };
};

// ---- Expensive method the decorator is applied to -------------------------

class MathService {
  @cache(5000)
  calculatePrimes(max: number): number[] {
    const primes: number[] = [];

    for (let n = 2; n <= max; n++) {
      let isPrime = true;

      for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) {
          isPrime = false;
          break;
        }
      }

      if (isPrime) {
        primes.push(n);
      }
    }

    return primes;
  }
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const service = new MathService();
  const max = 300_000;

  const start1 = performance.now();
  const first = service.calculatePrimes(max);
  const elapsed1 = performance.now() - start1;
  console.log(
    `First call: found ${first.length} primes up to ${max} in ${elapsed1.toFixed(2)}ms`,
  );

  const start2 = performance.now();
  const second = service.calculatePrimes(max);
  const elapsed2 = performance.now() - start2;
  console.log(
    `Second call: found ${second.length} primes up to ${max} in ${elapsed2.toFixed(2)}ms (cached)`,
  );

  assert.deepStrictEqual(first, second);
  assert.ok(
    elapsed2 < elapsed1,
    'cached call should be faster than the original computation',
  );
  console.log(
    `🎉 Cached call was ${(elapsed1 / elapsed2).toFixed(0)}x faster and returned identical results`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
