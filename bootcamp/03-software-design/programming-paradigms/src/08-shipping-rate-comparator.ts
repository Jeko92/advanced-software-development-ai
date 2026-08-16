interface RateQuotable {
  getQuote(weightKg: number, destination: string): number;
  getCarrierName(): string;
}

abstract class BaseCarrier implements RateQuotable {
  #formatQuoteLog(weightKg: number, destination: string): string {
    return `Quoting ${this.getCarrierName()} for ${weightKg}kg to ${destination}`;
  }

  abstract calculateRate(weightKg: number): number;

  getQuote(weightKg: number, destination: string): number {
    console.log(this.#formatQuoteLog(weightKg, destination));

    return this.calculateRate(weightKg);
  }

  abstract getCarrierName(): string;
}

class DhlCarrier extends BaseCarrier {
  override calculateRate(weightKg: number): number {
    return Math.round(weightKg * 1.15 * 100) / 100;
  }

  override getCarrierName(): string {
    return 'DHL';
  }
}
class UpsCarrier extends BaseCarrier {
  override calculateRate(weightKg: number): number {
    return Math.round(weightKg * 1.35 * 100) / 100;
  }

  override getCarrierName(): string {
    return 'UPS';
  }
}

class ShippingComparator {
  #rates: RateQuotable[];

  constructor(rates: RateQuotable[]) {
    this.#rates = rates;
  }

  findCheapest(
    weightKg: number,
    destination: string,
  ): { carrier: string; price: number } {
    if (this.#rates.length === 0) {
      throw new Error('No carrier rate quotables provided.');
    }

    return this.#rates
      .map((rate) => ({
        carrier: rate.getCarrierName(),
        price: rate.getQuote(weightKg, destination),
      }))
      .reduce((cheapest, current) =>
        current.price < cheapest.price ? current : cheapest,
      );
  }
}

const dhl = new DhlCarrier();
const ups = new UpsCarrier();
const comparator = new ShippingComparator([dhl, ups]);

const cheapest = comparator.findCheapest(3, 'Berlin');

console.log('--- Result ---');
console.log(
  `Cheapest carrier for 3kg to Berlin is ${cheapest.carrier} at $${cheapest.price}`,
);
