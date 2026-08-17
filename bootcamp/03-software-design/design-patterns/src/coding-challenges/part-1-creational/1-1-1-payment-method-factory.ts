/**
 * Challenge 1.1.1 — Payment Method Factory
 * (Design_Patterns_Coding_Challenges.md, Challenge 1.2 "Payment Method Factory")
 *
 * A checkout system supports multiple payment providers.
 *
 * TODO:
 * - `PaymentProcessor` interface:
 *     `charge(amount: number, description: string, items: string[]): Promise<Receipt>`
 * - `StripeProcessor`, `PaypalProcessor`, `BankTransferProcessor`
 *   implementing it, each returning a mock `Receipt`.
 * - A `PaymentProcessorFactory` whose `create(method: 'stripe' | 'paypal' | 'bank')`
 *   returns the right `PaymentProcessor`.
 * - `CheckoutService` that:
 *     1. asks the factory for a processor
 *     2. charges the customer through it
 *     3. returns the resulting `Receipt`
 *
 * `CheckoutService` must never instantiate a processor directly.
 *
 * Focus:
 * - Adding a fourth provider later should require changing only the factory
 *   and adding the new implementation.
 * - Default values for `description`/`items` belong in `CheckoutService`,
 *   not duplicated inside every processor.
 */
export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Receipt {
  transactionId: string;
  provider: 'stripe' | 'paypal' | 'bank';
  status: PaymentStatus;
  amount: number;
  currency: string;
  description: string;
  items: string[];
  createdAt: Date;
}

export interface PaymentProcessor {
  charge(
    amount: number,
    description: string,
    items: string[],
  ): Promise<Receipt>;
}

class StripeProcessor implements PaymentProcessor {
  async charge(
    amount: number,
    description: string,
    items: string[],
  ): Promise<Receipt> {
    console.log(`Processing €${amount} via Stripe API...`);

    return {
      transactionId: `ch_stripe_${Math.random().toString(36).substring(2, 11)}`,
      provider: 'stripe',
      status: 'SUCCESS',
      amount,
      currency: 'EUR',
      description,
      items,
      createdAt: new Date(),
    };
  }
}

class PaypalProcessor implements PaymentProcessor {
  async charge(
    amount: number,
    description: string,
    items: string[],
  ): Promise<Receipt> {
    console.log(`Processing €${amount} via PayPal API...`);

    return {
      transactionId: `PAYPAL-PAYID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      provider: 'paypal',
      status: 'SUCCESS',
      amount,
      currency: 'EUR',
      description,
      items,
      createdAt: new Date(),
    };
  }
}

class BankTransferProcessor implements PaymentProcessor {
  async charge(
    amount: number,
    description: string,
    items: string[],
  ): Promise<Receipt> {
    console.log(`Initiating SEPA Bank Transfer for €${amount}...`);

    return {
      transactionId: `SEPA-REF-${Math.floor(100000000 + Math.random() * 900000000)}`,
      provider: 'bank',
      status: 'PENDING', // Bank transfers typically take 1-3 days
      amount,
      currency: 'EUR',
      description,
      items,
      createdAt: new Date(),
    };
  }
}
type PaymentMethod = 'stripe' | 'paypal' | 'bank';

class PaymentProcessorFactory {
  create(method: PaymentMethod): PaymentProcessor {
    switch (method) {
      case 'stripe':
        return new StripeProcessor();
      case 'paypal':
        return new PaypalProcessor();
      case 'bank':
        return new BankTransferProcessor();
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }
}

class CheckoutService {
  constructor(private readonly processorFactory: PaymentProcessorFactory) {}

  async checkout(
    method: PaymentMethod,
    amount: number,
    description: string = 'E-commerce Purchase',
    items: string[] = ['mouse', 'keyboard'],
  ): Promise<Receipt> {
    const processor = this.processorFactory.create(method);
    return await processor.charge(amount, description, items);
  }
}

// --- Demo ---
const paymentProcessorFactory = new PaymentProcessorFactory();
const checkoutService = new CheckoutService(paymentProcessorFactory);

console.log('--- STRIPE CHECKOUT ---');
const stripeReceipt = await checkoutService.checkout(
  'stripe',
  200,
  'Developer Setup Order',
  ['monitor', 'desk'],
);
console.log(stripeReceipt);

console.log('\n--- PAYPAL CHECKOUT ---');
const paypalReceipt = await checkoutService.checkout(
  'paypal',
  300,
  'Audio Gear',
  ['headphones'],
);
console.log(paypalReceipt);

console.log('\n--- BANK TRANSFER CHECKOUT ---');
const bankReceipt = await checkoutService.checkout(
  'bank',
  500,
  'Office Furniture',
  ['standing desk'],
);
console.log(bankReceipt);
