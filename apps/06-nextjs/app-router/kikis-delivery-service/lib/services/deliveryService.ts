export type DeliveryStatus = 'active' | 'accepted' | 'denied' | 'fulfilled';

export type DeliveryRequest = {
  id: string;
  pickup: string;
  destination: string;
  status: DeliveryStatus;
};

const deliveries: DeliveryRequest[] = [
  { id: '1', pickup: 'Bakery', destination: 'Clock Tower', status: 'active' },
  {
    id: '2',
    pickup: 'Harbour',
    destination: 'Hillside Cafe',
    status: 'accepted',
  },
  { id: '3', pickup: 'Bookshop', destination: 'Lighthouse', status: 'denied' },
  {
    id: '4',
    pickup: 'Market Square',
    destination: 'Train Station',
    status: 'fulfilled',
  },
];

export async function getAllDeliveries(): Promise<DeliveryRequest[]> {
  return deliveries;
}

export async function getDeliveryById(
  id: string,
): Promise<DeliveryRequest | null> {
  return deliveries.find((d) => d.id === id) || null;
}
