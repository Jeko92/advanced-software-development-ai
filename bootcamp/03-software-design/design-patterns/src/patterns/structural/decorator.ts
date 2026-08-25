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
const measure = <This, Args extends unknown[], Return>(
  originalMethod: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
) => {
  const name = String(context.name);
  return function (this: This, ...args: Args): Return {
    const start = performance.now();
    const result = originalMethod.call(this, ...args);
    const elapsed = performance.now() - start;
    console.log(`[measure] ${name} took ${elapsed.toFixed(2)}ms`);
    return result;
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

new Counter().countToMillion();
// new Counter().countToMillion();
