/**
 * Challenge 4.1 — Bonus: Build a Tiny E-Commerce Module
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Bonus: Integration Challenge, Challenge 4.1)
 *
 * Combines patterns from all three categories into one coherent module.
 * Where a pattern was already built elsewhere in this package, it's
 * imported and reused rather than rewritten — noted per pattern below.
 *
 * TODO — Creational:
 * - Factory for the right `PaymentProcessor`
 * - Builder for a complex `Order` object (gift wrap, discount code,
 *   shipping method, all optional)
 * - Singleton `RateLimiter` guarding the payment API
 *
 * TODO — Structural:
 * - Repository `OrderRepository` (SQL + in-memory)
 * - Dependency Injection wiring `OrderService` with its repository, payment
 *   processor, and notifier
 * - Decorator adding logging and retry logic to the repository methods
 *
 * TODO — Behavioural:
 * - Observer: `OrderService` emits `order.placed`; `InventoryService`,
 *   `EmailService`, `AnalyticsService` react independently
 * - Strategy: `PricingService` switches between `StandardPricing` and
 *   `BlackFridayPricing`
 * - State Machine for the `Order` lifecycle: `pending` → `paid` →
 *   `shipped` → `delivered`, with cancellation rules
 *
 * TODO — wiring:
 * - a `main()` composition root wiring everything for "production"
 * - a separate composition root using in-memory fakes, for testing
 */
import assert from 'node:assert';
import { Pool } from 'pg';

// Reused instead of rewritten:
import {
  PaymentProcessorFactory,
  type PaymentMethod,
  type Receipt,
} from '../part-1-creational/1-1-1-payment-method-factory';
import { measure } from '../../patterns/structural/decorator';
import { retry } from '../part-2-structural/2-4-decorator-retry-logic';
import {
  EmailNotifier,
  type Notifier,
} from '../part-2-structural/2-3-manual-dependency-injection';

// =============================================================================
// Creational
// =============================================================================

// ---- Builder: Order ----------------------------------------------------------

type ShippingMethod = 'standard' | 'express';

type Order = {
  id: string;
  items: string[];
  amount: number;
  giftWrap?: boolean;
  discountCode?: string;
  shippingMethod?: ShippingMethod;
};

class OrderBuilder {
  private id: string | undefined;
  private items: string[] = [];
  private amount: number | undefined;
  private giftWrap: boolean | undefined;
  private discountCode: string | undefined;
  private shippingMethod: ShippingMethod | undefined;

  withId(id: string): this {
    this.id = id;
    return this;
  }

  addItem(item: string): this {
    this.items.push(item);
    return this;
  }

  withAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  withGiftWrap(): this {
    this.giftWrap = true;
    return this;
  }

  withDiscountCode(code: string): this {
    this.discountCode = code;
    return this;
  }

  withShippingMethod(method: ShippingMethod): this {
    this.shippingMethod = method;
    return this;
  }

  build(): Order {
    if (!this.id) {
      throw new Error('Order requires an id.');
    }
    if (this.items.length === 0) {
      throw new Error('Order requires at least one item.');
    }
    if (this.amount === undefined) {
      throw new Error('Order requires an amount.');
    }

    return {
      id: this.id,
      items: [...this.items],
      amount: this.amount,
      ...(this.giftWrap !== undefined ? { giftWrap: this.giftWrap } : {}),
      ...(this.discountCode !== undefined
        ? { discountCode: this.discountCode }
        : {}),
      ...(this.shippingMethod !== undefined
        ? { shippingMethod: this.shippingMethod }
        : {}),
    };
  }
}

// ---- Singleton: RateLimiter ---------------------------------------------------

// Same shape as AudioEngine/ConfigStore (../../patterns/creational) — a
// real, shared, process-wide resource (the payment API's rate budget)
// that must not be duplicated per caller.
class RateLimiter {
  private static instance: RateLimiter | null = null;
  private callTimestamps: number[] = [];

  private constructor(
    private readonly maxCallsPerWindow: number,
    private readonly windowMs: number,
  ) {}

  static initialize(maxCallsPerWindow: number, windowMs: number): RateLimiter {
    if (this.instance) {
      throw new Error('RateLimiter is already initialized');
    }
    this.instance = new RateLimiter(maxCallsPerWindow, windowMs);
    return this.instance;
  }

  static getInstance(): RateLimiter {
    if (!this.instance) {
      throw new Error('RateLimiter must be initialized first');
    }
    return this.instance;
  }

  allow(): boolean {
    const now = Date.now();
    this.callTimestamps = this.callTimestamps.filter(
      (timestamp) => now - timestamp < this.windowMs,
    );

    if (this.callTimestamps.length >= this.maxCallsPerWindow) {
      return false;
    }

    this.callTimestamps.push(now);
    return true;
  }
}

// =============================================================================
// Structural
// =============================================================================

// ---- Repository: OrderRepository, decorated with @measure + @retry ---------

interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}

class SqlOrderRepository implements OrderRepository {
  constructor(private readonly db: Pool) {}

  @measure
  @retry(3, 100)
  async save(order: Order): Promise<void> {
    // language=PostgreSQL
    // noinspection SqlResolve,SqlNoDataSourceInspection
    await this.db.query('INSERT INTO orders (id, payload) VALUES ($1, $2)', [
      order.id,
      JSON.stringify(order),
    ]);
  }

  @measure
  @retry(3, 100)
  async findById(id: string): Promise<Order | null> {
    // language=PostgreSQL
    // noinspection SqlResolve,SqlNoDataSourceInspection
    const { rows } = await this.db.query<{ payload: string }>(
      'SELECT payload FROM orders WHERE id = $1',
      [id],
    );
    const row = rows[0];
    return row ? (JSON.parse(row.payload) as Order) : null;
  }
}

class InMemoryOrderRepository implements OrderRepository {
  constructor(private readonly db: Map<string, Order> = new Map()) {}

  async save(order: Order): Promise<void> {
    this.db.set(order.id, order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.db.get(id) ?? null;
  }
}

// ---- Dependency Injection: OrderService --------------------------------------

type OrderPlacedEvent = { type: 'order.placed'; order: Order };
type OrderListener = (event: OrderPlacedEvent) => void;

class OrderEventBus {
  private listeners: OrderListener[] = [];

  subscribe(listener: OrderListener): void {
    this.listeners.push(listener);
  }

  emit(event: OrderPlacedEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

// OrderService depends only on interfaces/singleton accessors — never
// constructs a repository, processor, or notifier itself.
class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly paymentProcessor: {
      charge(
        amount: number,
        description: string,
        items: string[],
      ): Promise<Receipt>;
    },
    private readonly notifier: Notifier,
    private readonly bus: OrderEventBus,
    private readonly rateLimiter: RateLimiter,
  ) {}

  async placeOrder(order: Order): Promise<Receipt> {
    if (!this.rateLimiter.allow()) {
      throw new Error('Rate limit exceeded for payment API');
    }

    const receipt = await this.paymentProcessor.charge(
      order.amount,
      `Order ${order.id}`,
      order.items,
    );

    await this.repo.save(order);
    this.notifier.send(`Order ${order.id} placed successfully`);
    this.bus.emit({ type: 'order.placed', order });

    return receipt;
  }
}

// =============================================================================
// Behavioural
// =============================================================================

// ---- Observer: independent reactions to order.placed ------------------------

class InventoryService {
  handle = (event: OrderPlacedEvent): void => {
    console.log(
      `[inventory] Reserving items for order ${event.order.id}: ${event.order.items.join(', ')}`,
    );
  };
}

class EmailService {
  handle = (event: OrderPlacedEvent): void => {
    console.log(`[email] Sending confirmation for order ${event.order.id}`);
  };
}

class AnalyticsService {
  ordersTracked = 0;

  handle = (event: OrderPlacedEvent): void => {
    this.ordersTracked++;
    console.log(
      `[analytics] Tracked order ${event.order.id} (total: ${this.ordersTracked})`,
    );
  };
}

// ---- Strategy: PricingService -------------------------------------------------

interface PricingStrategy {
  price(baseAmount: number): number;
}

class StandardPricing implements PricingStrategy {
  price(baseAmount: number): number {
    return baseAmount;
  }
}

class BlackFridayPricing implements PricingStrategy {
  price(baseAmount: number): number {
    return Math.round(baseAmount * 0.7 * 100) / 100; // 30% off
  }
}

class PricingService {
  constructor(private strategy: PricingStrategy) {}

  setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
  }

  calculate(baseAmount: number): number {
    return this.strategy.price(baseAmount);
  }
}

// ---- State Machine: Order lifecycle -------------------------------------------

type OrderLifecycleState =
  'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
type OrderLifecycleEvent = 'pay' | 'ship' | 'deliver' | 'cancel';

const orderLifecycleTransitions: Record<
  OrderLifecycleState,
  Partial<Record<OrderLifecycleEvent, OrderLifecycleState>>
> = {
  pending: { pay: 'paid', cancel: 'cancelled' },
  paid: { ship: 'shipped', cancel: 'cancelled' },
  shipped: { deliver: 'delivered' }, // no cancelling once it has shipped
  delivered: {},
  cancelled: {},
};

class OrderLifecycle {
  private state: OrderLifecycleState = 'pending';

  getState(): OrderLifecycleState {
    return this.state;
  }

  transition(event: OrderLifecycleEvent): void {
    const next = orderLifecycleTransitions[this.state][event];
    if (!next) {
      throw new Error(`Illegal transition: ${event} from ${this.state}`);
    }
    this.state = next;
  }
}

// =============================================================================
// Composition roots
// =============================================================================

async function main(): Promise<void> {
  console.log('=== PRODUCTION composition root ===');

  RateLimiter.initialize(3, 60_000); // 3 payment calls per minute, total

  const pgPool = new Pool({
    connectionString: 'postgres://localhost:5432/app',
  });
  const orderRepo = new SqlOrderRepository(pgPool);
  const paymentProcessor = new PaymentProcessorFactory().create(
    'stripe' as PaymentMethod,
  );
  const notifier = new EmailNotifier();
  const bus = new OrderEventBus();

  bus.subscribe(new InventoryService().handle);
  bus.subscribe(new EmailService().handle);
  const analytics = new AnalyticsService();
  bus.subscribe(analytics.handle);

  const pricing = new PricingService(new StandardPricing());
  const orderService = new OrderService(
    orderRepo,
    paymentProcessor,
    notifier,
    bus,
    RateLimiter.getInstance(),
  );

  const productionOrder = new OrderBuilder()
    .withId('order-prod-1')
    .addItem('wireless mouse')
    .addItem('mechanical keyboard')
    .withAmount(pricing.calculate(150))
    .withGiftWrap()
    .withShippingMethod('express')
    .build();

  const lifecycle = new OrderLifecycle();

  try {
    await orderService.placeOrder(productionOrder);
    lifecycle.transition('pay');
    console.log('Order lifecycle ->', lifecycle.getState());
  } catch (error) {
    console.log(
      'Production placeOrder failed, as expected without a real database:',
      (error as Error).message,
    );
  } finally {
    await pgPool.end();
  }

  console.log('\n--- Switching PricingService to Black Friday at runtime ---');
  pricing.setStrategy(new BlackFridayPricing());
  console.log(
    'Black Friday price for a base amount of 150 ->',
    pricing.calculate(150),
  );

  await composeTest();

  console.log('\n=== RateLimiter guard (isolated) ===');
  const limiter = RateLimiter.getInstance();
  // One slot was already used by the production order above, and one by
  // composeTest() below — one slot remains before the limit of 3 kicks in.
  assert.strictEqual(limiter.allow(), true);
  assert.strictEqual(limiter.allow(), false);
  console.log(
    'Test passed: RateLimiter allowed calls up to its limit, then blocked the next one',
  );

  console.log(
    '\n🎉 All nine patterns wired together — Creational, Structural, Behavioural',
  );
}

async function composeTest(): Promise<void> {
  console.log('\n=== TEST composition root (in-memory fakes) ===');

  const orderRepo = new InMemoryOrderRepository();
  const paymentProcessor = new PaymentProcessorFactory().create('bank');

  // A fake notifier, capturing messages instead of touching real I/O —
  // same trick as composeTest() in 2-3-manual-dependency-injection.ts.
  const sentMessages: string[] = [];
  const fakeNotifier: Notifier = {
    send: (message) => sentMessages.push(message),
  };

  const bus = new OrderEventBus();
  const analytics = new AnalyticsService();
  bus.subscribe(analytics.handle);

  const pricing = new PricingService(new StandardPricing());
  const orderService = new OrderService(
    orderRepo,
    paymentProcessor,
    fakeNotifier,
    bus,
    RateLimiter.getInstance(),
  );

  const testOrder = new OrderBuilder()
    .withId('order-test-1')
    .addItem('unit test widget')
    .withAmount(pricing.calculate(50))
    .withDiscountCode('SAVE10')
    .build();

  const receipt = await orderService.placeOrder(testOrder);
  assert.strictEqual(receipt.status, 'PENDING'); // bank transfers are PENDING
  assert.strictEqual(sentMessages.length, 1);
  assert.strictEqual(analytics.ordersTracked, 1);

  const saved = await orderRepo.findById(testOrder.id);
  assert.deepStrictEqual(saved, testOrder);
  console.log(
    'Test passed: OrderService works end to end with in-memory fakes, no real I/O',
  );

  const lifecycle = new OrderLifecycle();
  lifecycle.transition('pay');
  lifecycle.transition('ship');
  lifecycle.transition('deliver');
  assert.strictEqual(lifecycle.getState(), 'delivered');

  assert.throws(
    () => lifecycle.transition('cancel'),
    /Illegal transition: cancel from delivered/,
  );
  console.log(
    'Test passed: order lifecycle reached delivered, and cannot be cancelled afterward',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
