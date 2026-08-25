interface PaymentProcessor {
  charge(customerId: string, amount: number): boolean;
  getProviderName(): string;
}

abstract class BasePaymentProcessor implements PaymentProcessor {
  abstract getProviderName(): string;
  abstract executeCharge(customerId: string, amount: number): boolean;

  charge(customerId: string, amount: number): boolean {
    this.logAttempt(customerId, amount);

    const successful = this.executeCharge(customerId, amount);

    console.log(
      successful
        ? `Charge succeeded via ${this.getProviderName()}`
        : `Charge failed via ${this.getProviderName()}`,
    );

    return successful;
  }

  protected logAttempt(customerId: string, amount: number): void {
    console.log(
      `Attempting to charge customer #${customerId} $${amount} via ${this.getProviderName()}`,
    );
  }
}

class StripeProcessor extends BasePaymentProcessor {
  override executeCharge(_customerId: string, _amount: number): boolean {
    return true;
  }

  override getProviderName(): string {
    return 'Stripe';
  }
}
class PaypalProcessor extends BasePaymentProcessor {
  override executeCharge(_customerId: string, amount: number): boolean {
    return amount <= 500;
  }

  override getProviderName(): string {
    return 'Paypal';
  }
}

class PaymentRouter {
  #processors: PaymentProcessor[];

  constructor(processors: PaymentProcessor[]) {
    this.#processors = processors;
  }

  chargeFirstAvailable(customerId: string, amount: number): boolean {
    for (const processor of this.#processors) {
      if (processor.charge(customerId, amount)) {
        return true;
      }
    }

    return false;
  }
}

const router = new PaymentRouter([
  new StripeProcessor(),
  new PaypalProcessor(),
]);

console.log(router.chargeFirstAvailable('C1', 50));

const router2 = new PaymentRouter([
  new StripeProcessor(),
  new PaypalProcessor(),
]);

console.log(router2.chargeFirstAvailable('C1', 600));

const router3 = new PaymentRouter([
  new PaypalProcessor(),
  new StripeProcessor(),
]);

console.log(router3.chargeFirstAvailable('C1', 600));
