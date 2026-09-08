import { Suspense } from 'react';
import Link from 'next/link';
import { getAllDeliveries } from '@/lib/services/deliveriesService';
import Loading from './loading';

const DeliveriesList = async () => {
  const deliveries = await getAllDeliveries();

  return (
    <ul>
      {deliveries.map((delivery) => (
        <li key={delivery.id}>
          <Link href={`/deliveries/${delivery.id}`}>
            {delivery.pickup} to {delivery.destination} ({delivery.status})
          </Link>
        </li>
      ))}
    </ul>
  );
};

const DeliveriesPage = () => {
  return (
    <div>
      <h1>All Deliveries</h1>
      <Suspense fallback={<Loading />}>
        <DeliveriesList />
      </Suspense>
    </div>
  );
};

export default DeliveriesPage;
