/**
 * Challenge 1.3.2 — Singleton vs. Instance Passing
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 1, Challenge 1.3.2)
 *
 * Starting point (the anti-pattern — Logger accessed as a hidden global
 * dependency):
 *
 *   class OrderService {
 *     submit(order: Order) {
 *       Logger.getInstance().info(`Order submitted: ${order.id}`);
 *     }
 *   }
 *
 * TODO:
 * - refactor `OrderService` so `Logger` is passed through the constructor
 *   (Dependency Injection) instead of reached via `Logger.getInstance()`
 * - write a `FakeLogger` that just pushes messages to an array
 * - a check that injects the `FakeLogger` and confirms the right message
 *   was logged
 * - one sentence (as a comment) explaining why the injected version is
 *   easier to test
 *
 * Focus: recognize when Singleton is a trap and when it's truly needed —
 * contrast with 1-3-1-safe-singleton-config-store.ts, a case where it is.
 */
import assert from 'node:assert';

interface Order {
  id: string;
}

interface Logger {
  info(message: string): void;
}

class FakeLogger implements Logger {
  messages: string[] = [];

  info(message: string): void {
    this.messages.push(message);
    console.log(`Message ${message} added to logs.`);
  }
}

export class OrderService {
  constructor(private logger: Logger) {}

  submit(order: Order): void {
    const message = `Order submitted: ${order.id}`;
    this.logger.info(message);
  }
}

const fakeLogger = new FakeLogger();
const orderService = new OrderService(fakeLogger);

orderService.submit({ id: 'order-123' });

assert.strictEqual(fakeLogger.messages.length, 1);
assert.strictEqual(fakeLogger.messages[0], 'Order submitted: order-123');
console.log('🎉 OrderService logs through the injected Logger');
