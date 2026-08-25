/**
 * Decorator — wrapping an existing method or object to add behaviour around
 * it (logging, timing, caching, retrying, permission checks) without
 * touching the method's own body.
 *
 * Handout: docs/learning/03-software-design/software-design-patterns/structural-patterns.md
 *          ("Decorators")
 *
 * Recreate the `@measure` timing decorator example.
 *
 * TODO:
 * - a `measure` class-method decorator function: receives the original
 *   method + a `ClassMethodDecoratorContext`, returns a replacement that
 *   times the call and logs `[measure] <name> took <ms>ms`
 * - apply `@measure` to a method on some class (a repository method or a
 *   slow loop both work) and show the timing log
 *
 * The handout is explicit that in practice you'd reach for an existing
 * decorator rather than write one from scratch — this file is about
 * understanding the mechanism, not something you'd ship.
 */
export const measure = <This, Args extends unknown[], Return>(
  originalMethod: (this: This, ...args: Args) => Return | Promise<Return>,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return | Promise<Return>
  >,
) => {
  const name = String(context.name);
  // `await`-ed even for sync methods, so this also measures the true
  // elapsed time of an async method (including whatever it awaits
  // internally) rather than just the time to return a pending Promise.
  return async function (this: This, ...args: Args): Promise<Return> {
    const start = performance.now();
    // Logged in `finally` so a call that throws (e.g. one that exhausted
    // an inner @retry) still gets timed instead of silently skipping the
    // log on its way out.
    try {
      return await originalMethod.call(this, ...args);
    } finally {
      const elapsed = performance.now() - start;
      console.log(`[measure] ${name} took ${elapsed.toFixed(2)}ms`);
    }
  };
};

class Counter {
  @measure
  countToMillion() {
    let count = 0;
    console.log('starting.');
    while (count < 1000000) {
      count++;
    }
    console.log('finished.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void new Counter().countToMillion();
}
