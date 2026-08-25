/**
 * Challenge 3.2 — Observer vs. Direct Calls
 *
 * Source: bootcamp/03-software-design/design-patterns/Design_Patterns_Coding_Challenges.md
 *         (Part 3, Challenge 3.2)
 *
 * Starting point (write this first, then refactor it below):
 *
 *   class OrderProcessor {
 *     constructor(
 *       private inventory: InventoryService,
 *       private billing: BillingService,
 *       private shipping: ShippingService,
 *     ) {}
 *     complete(order: Order) {
 *       this.inventory.reserve(order.items);
 *       this.billing.charge(order.total);
 *       this.shipping.schedule(order.address);
 *     }
 *   }
 *
 * TODO:
 * - refactor to an event bus: `OrderProcessor` emits `order.completed`
 *   instead of calling the three services directly
 * - `InventoryService`, `BillingService`, `ShippingService` each subscribe
 *   to that event
 * - add a fourth reaction (`LoyaltyService` awarding points) and confirm it
 *   required zero changes to `OrderProcessor`
 *
 * Focus: Observer removes the need to modify the subject when new listeners
 * appear.
 */
import assert from 'node:assert';

type Order = {
  id: string;
  items: string[];
  total: number;
  address: string;
};

type OrderEvent = { type: 'order.completed'; order: Order };

type Listener = (event: OrderEvent) => void;

class OrderBus {
  private listeners: Listener[] = [];

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  emit(event: OrderEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

class OrderProcessor {
  constructor(private readonly bus: OrderBus) {}

  complete(order: Order): void {
    this.bus.emit({ type: 'order.completed', order });
  }
}

// ---- The original three reactions, now subscribers instead of collaborators

class InventoryService {
  readonly reserved: string[][] = [];

  handle = (event: OrderEvent): void => {
    this.reserved.push(event.order.items);
    console.log(`[inventory] Reserved items for order ${event.order.id}`);
  };
}

class BillingService {
  readonly charged: number[] = [];

  handle = (event: OrderEvent): void => {
    this.charged.push(event.order.total);
    console.log(
      `[billing] Charged ${event.order.total} for order ${event.order.id}`,
    );
  };
}

class ShippingService {
  readonly scheduled: string[] = [];

  handle = (event: OrderEvent): void => {
    this.scheduled.push(event.order.address);
    console.log(`[shipping] Scheduled shipment to ${event.order.address}`);
  };
}

// ---- The fourth reaction, added later with zero changes to OrderProcessor

class LoyaltyService {
  readonly pointsAwarded: number[] = [];

  handle = (event: OrderEvent): void => {
    const points = Math.floor(event.order.total);
    this.pointsAwarded.push(points);
    console.log(
      `[loyalty] Awarded ${points} points for order ${event.order.id}`,
    );
  };
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const bus = new OrderBus();
  const processor = new OrderProcessor(bus);

  const inventory = new InventoryService();
  const billing = new BillingService();
  const shipping = new ShippingService();

  bus.subscribe(inventory.handle);
  bus.subscribe(billing.handle);
  bus.subscribe(shipping.handle);

  const firstOrder: Order = {
    id: 'order-1',
    items: ['widget', 'gadget'],
    total: 42,
    address: '123 Main St',
  };

  processor.complete(firstOrder);

  assert.deepStrictEqual(inventory.reserved, [firstOrder.items]);
  assert.deepStrictEqual(billing.charged, [firstOrder.total]);
  assert.deepStrictEqual(shipping.scheduled, [firstOrder.address]);
  console.log(
    'Test passed: all three original services reacted to order.completed\n',
  );

  // Add the fourth reaction — no changes to OrderProcessor or OrderBus.
  const loyalty = new LoyaltyService();
  bus.subscribe(loyalty.handle);

  const secondOrder: Order = {
    id: 'order-2',
    items: ['thingamajig'],
    total: 99,
    address: '456 Side St',
  };

  processor.complete(secondOrder);

  assert.deepStrictEqual(inventory.reserved, [
    firstOrder.items,
    secondOrder.items,
  ]);
  assert.deepStrictEqual(loyalty.pointsAwarded, [99]);
  console.log(
    '\nTest passed: LoyaltyService reacted too, with zero changes to OrderProcessor',
  );

  console.log(
    '🎉 Observer let a new subscriber appear without touching the subject',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
