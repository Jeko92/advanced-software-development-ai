import { DeliveryStatus } from '../lib/generated/prisma/client';
import type { Prisma } from '../lib/generated/prisma/client';

export const deliveries: Prisma.DeliveryCreateInput[] = [
  {
    pickup: 'Bakery on Main St',
    destination: 'Ocean View Apartments',
    status: DeliveryStatus.ACTIVE,
  },
  {
    pickup: 'Harbour Fish Market',
    destination: "Lighthouse Keeper's Cottage",
    status: DeliveryStatus.ACCEPTED,
  },
  {
    pickup: 'Old Bookshop',
    destination: 'Clock Tower Apartments',
    status: DeliveryStatus.DENIED,
  },
  {
    pickup: 'Flower Stall',
    destination: 'Town Hall',
    status: DeliveryStatus.FULFILLED,
  },
  {
    pickup: "Herbalist's Shop",
    destination: 'Hillside Cafe',
    status: DeliveryStatus.ACTIVE,
  },
  {
    pickup: 'Cheese Monger',
    destination: 'Train Station',
    status: DeliveryStatus.ACCEPTED,
  },
  {
    pickup: 'Candle Maker',
    destination: 'Windmill Cottage',
    status: DeliveryStatus.DENIED,
  },
  {
    pickup: 'Pastry Shop',
    destination: 'Harbour Lighthouse',
    status: DeliveryStatus.FULFILLED,
  },
];
