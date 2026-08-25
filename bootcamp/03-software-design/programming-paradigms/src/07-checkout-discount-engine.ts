interface Discountable {
  apply(price: number): number;
  describe(): string;
}

type DiscountType = 'percentage' | 'flat';

abstract class BaseDiscount implements Discountable {
  describe(): string {
    const kind = this.getDiscountType();
    const value = this.getDiscountValue();
    return this.#formatDescription(kind, value);
  }

  #formatDescription(kind: DiscountType, value: number): string {
    if (kind === 'percentage') {
      return `${value}% off.`;
    }

    return `$${value} off.`;
  }

  protected abstract computeDiscount(price: number): number;

  apply(price: number): number {
    console.log(this.describe());
    const computedDiscount = this.computeDiscount(price);
    return price - computedDiscount;
  }

  abstract getDiscountType(): DiscountType;
  abstract getDiscountValue(): number;
}

class PercentageDiscount extends BaseDiscount {
  percent: number;
  constructor(discount: number) {
    super();
    this.percent = discount;
  }

  override computeDiscount(price: number): number {
    return (price * this.percent) / 100;
  }

  override getDiscountType(): DiscountType {
    return 'percentage';
  }

  override getDiscountValue(): number {
    return this.percent;
  }
}

class FlatDiscount extends BaseDiscount {
  amount: number;
  constructor(discount: number) {
    super();
    this.amount = discount;
  }

  override computeDiscount(_price: number): number {
    return this.amount;
  }

  override getDiscountType(): 'percentage' | 'flat' {
    return 'flat';
  }

  override getDiscountValue(): number {
    return this.amount;
  }
}

class CheckoutService {
  #discounts: Discountable[];
  constructor(discounts: Discountable[]) {
    this.#discounts = discounts;
  }

  calculateFinalPrice(price: number): number {
    let afterDiscount: number = price;
    for (const discount of this.#discounts) {
      afterDiscount = discount.apply(afterDiscount);
    }

    console.log(`Final calculated price ${afterDiscount}`);
    return afterDiscount;
  }
}

const itemPrice = 100;

const checkoutService = new CheckoutService([
  new PercentageDiscount(10),
  new FlatDiscount(5),
]);
checkoutService.calculateFinalPrice(itemPrice);

const checkoutService2 = new CheckoutService([
  new FlatDiscount(5),
  new PercentageDiscount(20),
]);
checkoutService2.calculateFinalPrice(itemPrice);
