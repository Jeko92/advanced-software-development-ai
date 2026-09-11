import Link from 'next/link';
import { getAllDeliveries } from '@/lib/services/deliveryService';

export const DeliveriesPage = async () => {
  const deliveries = await getAllDeliveries();

  return (
    <div>
      <h1>All Deliveries</h1>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            <Link href={`/deliveries/${delivery.id}`}>
              {delivery.pickup} to {delivery.destination} ({delivery.status})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveriesPage;
