import { prisma } from '@/lib/prisma';
import { DeliveryStatus as DbDeliveryStatus } from '@/lib/generated/prisma/client';
import type { Delivery as DbDelivery } from '@/lib/generated/prisma/client';

export type Delivery = {
  id: string;
  pickup: string;
  destination: string;
  status: 'active' | 'accepted' | 'denied' | 'fulfilled';
};

const statusFromDb: Record<DbDeliveryStatus, Delivery['status']> = {
  [DbDeliveryStatus.ACTIVE]: 'active',
  [DbDeliveryStatus.ACCEPTED]: 'accepted',
  [DbDeliveryStatus.DENIED]: 'denied',
  [DbDeliveryStatus.FULFILLED]: 'fulfilled',
};

const toDelivery = (delivery: DbDelivery): Delivery => ({
  id: delivery.id,
  pickup: delivery.pickup,
  destination: delivery.destination,
  status: statusFromDb[delivery.status],
});

export const getAllDeliveries = async (): Promise<Delivery[]> => {
  const deliveries = await prisma.delivery.findMany();
  return deliveries.map(toDelivery);
};

export const getDeliveryById = async (
  id: string,
): Promise<Delivery | undefined> => {
  const delivery = await prisma.delivery.findUnique({ where: { id } });
  return delivery ? toDelivery(delivery) : undefined;
};

export const createDelivery = async (input: {
  pickup: string;
  destination: string;
}): Promise<Delivery> => {
  const created = await prisma.delivery.create({
    data: {
      pickup: input.pickup,
      destination: input.destination,
    },
  });

  return toDelivery(created);
};
