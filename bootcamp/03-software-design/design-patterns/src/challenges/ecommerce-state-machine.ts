/**
 * E-commerce State Machine — State Machine pattern
 *
 * Source: docs/learning/03-software-design/software-design-patterns/challenges.md
 *         ("E-commerce state machine")
 *
 * An `Order` class that manages its own lifecycle through a state machine.
 *
 * TODO:
 * - states: `Draft`, `Paid`, `Shipped`, `Delivered`, `Cancelled`
 * - events: `checkout`, `payment_received`, `dispatch`, `confirm_delivery`,
 *   `cancel`
 * - legal transitions:
 *   - `Draft` → `Paid` and `Draft` → `Cancelled`
 *   - `Paid` → `Shipped` and `Paid` → `Cancelled`
 *   - `Shipped` → `Delivered`
 * - an `Order` class with a `transition(event)` method (or one method per
 *   event) that throws on an illegal transition
 * - walk an order through a full legal lifecycle, then show an illegal
 *   transition throwing
 */
import assert from 'node:assert';

type OrderState = 'draft' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
type OrderEvent =
  'checkout' | 'payment_received' | 'dispatch' | 'confirm_delivery' | 'cancel';

const transitions: Record<
  OrderState,
  Partial<Record<OrderEvent, OrderState>>
> = {
  draft: { payment_received: 'paid', cancel: 'cancelled' },
  paid: { dispatch: 'shipped', cancel: 'cancelled' },
  shipped: { confirm_delivery: 'delivered' },
  delivered: {},
  cancelled: {},
};

class Order {
  // `checkout` turns a cart into an Order, so it's modeled as construction
  // rather than a `transition()` call: every Order starts life in Draft.
  private state: OrderState = 'draft';

  getState(): OrderState {
    return this.state;
  }

  transition(event: OrderEvent): void {
    const next = transitions[this.state][event];
    if (!next) {
      throw new Error(`Illegal transition: ${event} from ${this.state}`);
    }
    this.state = next;
  }
}

// ---- Demonstration ----------------------------------------------------------

function main(): void {
  const order = new Order(); // `checkout`: a cart becomes a Draft order
  assert.strictEqual(order.getState(), 'draft');
  console.log('checkout ->', order.getState());

  order.transition('payment_received');
  console.log('payment_received ->', order.getState());
  assert.strictEqual(order.getState(), 'paid');

  order.transition('dispatch');
  console.log('dispatch ->', order.getState());
  assert.strictEqual(order.getState(), 'shipped');

  order.transition('confirm_delivery');
  console.log('confirm_delivery ->', order.getState());
  assert.strictEqual(order.getState(), 'delivered');

  console.log(
    '\nTest passed: full legal lifecycle Draft -> Paid -> Shipped -> Delivered',
  );

  assert.throws(
    () => order.transition('cancel'),
    /Illegal transition: cancel from delivered/,
  );
  console.log(
    'Illegal transition caught: cannot cancel an already delivered order',
  );

  const cancelledOrder = new Order();
  cancelledOrder.transition('cancel');
  console.log('\ncancel ->', cancelledOrder.getState());
  assert.strictEqual(cancelledOrder.getState(), 'cancelled');

  assert.throws(
    () => cancelledOrder.transition('payment_received'),
    /Illegal transition: payment_received from cancelled/,
  );
  console.log('Illegal transition caught: cannot pay for a cancelled order');

  console.log(
    '🎉 Legal transitions succeeded, illegal ones threw a clear error',
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
