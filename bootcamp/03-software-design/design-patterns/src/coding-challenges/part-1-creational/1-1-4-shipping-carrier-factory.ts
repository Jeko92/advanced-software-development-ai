/**
 * Challenge 1.1.4 — Shipping Carrier Factory
 * (extra practice rep of the Factory pattern — not in
 * Design_Patterns_Coding_Challenges.md, same shape as Challenge 1.2)
 *
 * An order system supports multiple shipping carriers.
 *
 * TODO:
 * - `ShippingCarrier` interface:
 *     `calculateRate(weightKg: number): number`
 *     `getTrackingUrl(trackingNumber: string): string`
 * - `DhlCarrier`, `UpsCarrier`, `FedexCarrier`
 *   implementing it
 * - `createCarrier(carrier: 'dhl' | 'ups' | 'fedex'): ShippingCarrier`
 *   factory function
 * - `ShippingService` that:
 *     1. asks the factory for a carrier
 *     2. calculates the shipping rate
 *     3. generates a tracking URL
 *
 * `ShippingService` must never instantiate a carrier directly.
 *
 * Focus:
 * - The service should operate entirely against the `ShippingCarrier`
 *   interface.
 * - It should not contain:
 *     `new DhlCarrier()`
 *     `new UpsCarrier()`
 *     `new FedexCarrier()`
 * - Adding `DpdCarrier` later should require changing only the factory
 *   and adding the new implementation.
 *
 * Extra challenge (done):
 * - Each carrier takes its own configuration object via its constructor
 *   (`DhlConfig`, `UpsConfig`, `FedexConfig`), so the factory — not the
 *   carrier class — owns the concrete rates and tracking URLs.
 */
interface ShippingCarrier {
  calculateRate(weightKg: number): number;
  getTrackingUrl(trackingNumber: string): string;
}

type Carrier = 'dhl' | 'ups' | 'fedex';

interface DhlConfig {
  ratePerKg: number;
  trackingBaseUrl: string;
}

class DhlCarrier implements ShippingCarrier {
  constructor(private readonly config: DhlConfig) {}

  calculateRate(weightKg: number): number {
    return Number((weightKg * this.config.ratePerKg).toFixed(2));
  }

  getTrackingUrl(trackingNumber: string): string {
    const url = `${this.config.trackingBaseUrl}${encodeURIComponent(trackingNumber)}`;
    console.log(
      `[DHL Service] Mock tracking URL generated for: ${trackingNumber}`,
    );
    return url;
  }
}

interface UpsConfig {
  ratePerKg: number;
  trackingBaseUrl: string;
}

class UpsCarrier implements ShippingCarrier {
  constructor(private readonly config: UpsConfig) {}

  calculateRate(weightKg: number): number {
    return Number((weightKg * this.config.ratePerKg).toFixed(2));
  }

  getTrackingUrl(trackingNumber: string): string {
    const url = `${this.config.trackingBaseUrl}${encodeURIComponent(trackingNumber)}`;
    console.log(
      `[UPS Service] Mock tracking URL generated for: ${trackingNumber}`,
    );
    return url;
  }
}

interface FedexConfig {
  ratePerKg: number;
  fuelSurchargePercent: number;
  trackingBaseUrl: string;
}

class FedexCarrier implements ShippingCarrier {
  constructor(private readonly config: FedexConfig) {}

  calculateRate(weightKg: number): number {
    const base = weightKg * this.config.ratePerKg;
    const withSurcharge = base * (1 + this.config.fuelSurchargePercent / 100);
    return Number(withSurcharge.toFixed(2));
  }

  getTrackingUrl(trackingNumber: string): string {
    const url = `${this.config.trackingBaseUrl}${encodeURIComponent(trackingNumber)}`;
    console.log(
      `[FedEx Service] Mock tracking URL generated for: ${trackingNumber}`,
    );
    return url;
  }
}

type CarrierFactory = (carrier: Carrier) => ShippingCarrier;

const createCarrier: CarrierFactory = (carrier) => {
  switch (carrier) {
    case 'dhl':
      return new DhlCarrier({
        ratePerKg: 1.2,
        trackingBaseUrl:
          'https://www.dhl.com/global-en/home/tracking.html?tracking-id=',
      });
    case 'ups':
      return new UpsCarrier({
        ratePerKg: 1.25,
        trackingBaseUrl: 'https://www.ups.com/track?tracknum=',
      });
    case 'fedex':
      return new FedexCarrier({
        ratePerKg: 1.3,
        fuelSurchargePercent: 11.5,
        trackingBaseUrl: 'https://www.fedex.com/fedextrack/?trknbr=',
      });
    default:
      throw new Error(`Carrier ${carrier} not found`);
  }
};

class ShippingService {
  constructor(private readonly carrierFactory: CarrierFactory) {}

  ship(
    carrier: Carrier,
    weightKg: number,
    trackingNumber: string,
  ): { rate: number; trackingUrl: string } {
    const shippingCarrier = this.carrierFactory(carrier);
    const rate = shippingCarrier.calculateRate(weightKg);
    const trackingUrl = shippingCarrier.getTrackingUrl(trackingNumber);

    return { rate, trackingUrl };
  }
}

const shippingService = new ShippingService(createCarrier);

console.log('DHL:', shippingService.ship('dhl', 5, '1234567890'));
console.log('UPS:', shippingService.ship('ups', 5, '1Z9999999999999999'));
console.log('FedEx:', shippingService.ship('fedex', 5, '987654321098'));
