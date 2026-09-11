import {
  getAllDeliveries,
  getDeliveryById,
} from '@/lib/services/deliveriesService';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { RecordDeliveryView } from '@/components/RecordDeliveryView.tsx';

export const generateStaticParams = async () => {
  const deliveries = await getAllDeliveries();
  return deliveries.map((delivery) => ({ deliveryId: delivery.id }));
};

const DeliveryDetailPage = async ({
  params,
}: PageProps<'/deliveries/[deliveryId]'>) => {
  const { deliveryId } = await params;
  const delivery = await getDeliveryById(deliveryId);

  if (!delivery) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-3xl">Delivery not found</h1>
        <p className="text-muted-foreground">
          We couldn&apos;t find a delivery with id {deliveryId}.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <RecordDeliveryView deliveryId={delivery.id} />
      <h1 className="font-heading text-3xl">Delivery details</h1>
      <Card>
        <CardContent className="grid grid-cols-[120px_1fr] items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">
            Pickup
          </span>
          <span>{delivery.pickup}</span>
          <span className="text-sm font-semibold text-muted-foreground">
            Destination
          </span>
          <span>{delivery.destination}</span>
          <span className="text-sm font-semibold text-muted-foreground">
            Status
          </span>
          <StatusBadge
            status={delivery.status}
            className="justify-self-start"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryDetailPage;
