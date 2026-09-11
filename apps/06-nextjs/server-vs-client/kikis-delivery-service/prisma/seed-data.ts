import { DeliveryStatus } from '../lib/generated/prisma/client';
import type { Prisma } from '../lib/generated/prisma/client';

export const deliveries: Prisma.DeliveryCreateInput[] = [
  {
    pickup: 'Bakery',
    destination: 'Clock Tower',
    status: DeliveryStatus.ACTIVE,
  },
  {
    pickup: 'Harbour',
    destination: 'Hillside Cafe',
    status: DeliveryStatus.ACCEPTED,
  },
  {
    pickup: 'Bookshop',
    destination: 'Lighthouse',
    status: DeliveryStatus.DENIED,
  },
  {
    pickup: 'Market Square',
    destination: 'Train Station',
    status: DeliveryStatus.FULFILLED,
  },
];
