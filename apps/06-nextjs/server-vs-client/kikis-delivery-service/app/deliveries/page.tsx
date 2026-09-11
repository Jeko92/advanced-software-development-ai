import Link from 'next/link';
import { getAllDeliveries } from '@/lib/services/deliveryService';
import { DeliveryFilter } from '@/components/DeliveryFilter';
import { Suspense } from 'react';
import Loading from '@/app/deliveries/loading';

const DeliveriesList = async () => {
  const deliveries = await getAllDeliveries();

  return <DeliveryFilter deliveries={deliveries} />;
};

const DeliveriesPage = async () => {
  return (
    <div>
      <h1>All Deliveries</h1>
      <Link href="/deliveries/new">New delivery (full page)</Link>
      <Suspense fallback={<Loading />}>
        <DeliveriesList />
      </Suspense>
    </div>
  );
};

export default DeliveriesPage;
