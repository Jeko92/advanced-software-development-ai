export type Delivery = {
  id: string;
  pickup: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'delivered';
};

const deliveries: Delivery[] = [
  {
    id: '1',
    pickup: 'Bakery on Main St',
    destination: 'Ocean View Apartments',
    status: 'delivered',
  },
  {
    id: '2',
    pickup: 'Corner Pharmacy',
    destination: 'Hilltop House',
    status: 'in-transit',
  },
  {
    id: '3',
    pickup: 'Flower Shop',
    destination: 'Town Hall',
    status: 'pending',
  },
];

export const getAllDeliveries = async (): Promise<Delivery[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return deliveries;
};

export const getDeliveryById = async (
  id: string,
): Promise<Delivery | undefined> => {
  return deliveries.find((delivery) => delivery.id === id);
};
