import { Suspense } from 'react';
import Link from 'next/link';
import Loading from './loading';
import { getAllDeliveries } from '@/lib/services/deliveriesService';
import { DeliveryFilter } from '@/components/DeliveryFilter';
import { CreateButton } from '@/components/NewDeliveryForm';

const DeliveriesList = async () => {
  const deliveries = await getAllDeliveries();

  return <DeliveryFilter deliveries={deliveries} />;
};

const DeliveriesPage = () => {
  return (
    <div>
      <h1>All Deliveries</h1>
      <Link href="/deliveries/new">New delivery (full page)</Link>
      <CreateButton />
      <Suspense fallback={<Loading />}>
        <DeliveriesList />
      </Suspense>
    </div>
  );
};

export default DeliveriesPage;
