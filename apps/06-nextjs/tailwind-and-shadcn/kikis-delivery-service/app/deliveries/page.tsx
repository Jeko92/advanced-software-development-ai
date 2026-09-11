import Link from 'next/link';
import { getAllDeliveries } from '@/lib/services/deliveryService';
import { DeliveryFilter } from '@/components/DeliveryFilter';
import { Suspense } from 'react';
import Loading from '@/app/deliveries/loading';
import { Button } from '@/components/ui/button.tsx';

const DeliveriesList = async () => {
  const deliveries = await getAllDeliveries();

  return <DeliveryFilter deliveries={deliveries} />;
};

const DeliveriesPage = async () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl">All deliveries</h1>
        <div className="flex items-center gap-3">
          <Button variant="brand" asChild>
            <Link href="/deliveries/new">New delivery (full page)</Link>
          </Button>
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <DeliveriesList />
      </Suspense>
    </div>
  );
};

export default DeliveriesPage;
