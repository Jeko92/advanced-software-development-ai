/**
 * Challenge 3.3 — Strategy: Shipping Cost Calculator
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 3, Challenge 3.3)
 *
 * TODO:
 * - `ShippingStrategy` interface — `calculate(weight: number, distance: number): number`
 * - `StandardShipping` (flat rate + per-kg fee), `ExpressShipping` (higher
 *   flat rate + per-kg fee + distance surcharge), `FreeShipping` (always 0)
 * - `Cart` class holding a `ShippingStrategy`, with `setStrategy()` and
 *   `checkout()`
 * - switch strategies at runtime on the same cart and show the different
 *   costs
 *
 * Focus: `Cart` delegates the calculation; it doesn't contain the formulas.
 */
import assert from 'node:assert';

interface ShippingStrategy {
  calculate(weight: number, distance: number): number;
}

class StandardShipping implements ShippingStrategy {
  private readonly flatRate = 5;
  private readonly perKgFee = 1.5;

  calculate(weight: number, _distance: number): number {
    return this.flatRate + weight * this.perKgFee;
  }
}

class ExpressShipping implements ShippingStrategy {
  private readonly flatRate = 15;
  private readonly perKgFee = 2.5;
  private readonly perKmSurcharge = 0.1;

  calculate(weight: number, distance: number): number {
    return (
      this.flatRate + weight * this.perKgFee + distance * this.perKmSurcharge
    );
  }
}

class FreeShipping implements ShippingStrategy {
  calculate(_weight: number, _distance: number): number {
    return 0;
  }
}

class Cart {
  constructor(private strategy: ShippingStrategy) {}

  setStrategy(strategy: ShippingStrategy): void {
    this.strategy = strategy;
  }

  checkout(weight: number, distance: number): number {
    return this.strategy.calculate(weight, distance);
  }
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const weight = 4; // kg
  const distance = 120; // km
  const cart = new Cart(new StandardShipping());

  const standardCost = cart.checkout(weight, distance);
  console.log('Standard shipping ->', standardCost);
  assert.strictEqual(standardCost, 5 + weight * 1.5);

  cart.setStrategy(new ExpressShipping());
  const expressCost = cart.checkout(weight, distance);
  console.log('Express shipping ->', expressCost);
  assert.strictEqual(expressCost, 15 + weight * 2.5 + distance * 0.1);

  cart.setStrategy(new FreeShipping());
  const freeCost = cart.checkout(weight, distance);
  console.log('Free shipping ->', freeCost);
  assert.strictEqual(freeCost, 0);

  assert.ok(expressCost > standardCost);
  assert.ok(standardCost > freeCost);
  console.log(
    '🎉 Same Cart, three different costs — Cart never contained a formula',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
