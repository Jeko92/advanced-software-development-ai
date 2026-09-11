import Link from 'next/link';
import { getDeliveryById } from '@/lib/services/deliveryService';

const DeliveryDetailPage = async ({
  params,
}: PageProps<'/deliveries/[id]'>) => {
  const { id } = await params;
  const delivery = await getDeliveryById(id);

  if (!delivery) {
    throw new Error(`No delivery request found with id "${id}".`);
  }

  return (
    <div>
      <h1>Delivery {delivery.id}</h1>
      <p>
        From {delivery.pickup} to {delivery.destination}
      </p>
      <p>Status: {delivery.status}</p>
      <Link href="/deliveries">Back to all deliveries</Link>
    </div>
  );
};

export default DeliveryDetailPage;
