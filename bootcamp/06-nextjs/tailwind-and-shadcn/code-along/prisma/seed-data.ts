import { DeliveryStatus } from '../lib/generated/prisma/client';
import type { Prisma } from '../lib/generated/prisma/client';

export const deliveries: Prisma.DeliveryCreateInput[] = [
  {
    pickup: 'Bakery on Main St',
    destination: 'Ocean View Apartments',
    status: DeliveryStatus.DELIVERED,
  },
  {
    pickup: 'Corner Pharmacy',
    destination: 'Hilltop House',
    status: DeliveryStatus.IN_TRANSIT,
  },
  {
    pickup: 'Flower Shop',
    destination: 'Town Hall',
    status: DeliveryStatus.PENDING,
  },
];
