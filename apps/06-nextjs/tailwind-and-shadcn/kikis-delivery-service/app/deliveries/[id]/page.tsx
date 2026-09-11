import Link from 'next/link';
import { getDeliveryById } from '@/lib/services/deliveryService';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';

const DeliveryDetailPage = async ({
  params,
}: PageProps<'/deliveries/[id]'>) => {
  const { id } = await params;
  const delivery = await getDeliveryById(id);

  if (!delivery) {
    throw new Error(`No delivery request found with id "${id}".`);
  }

  return (
    <div className="flex flex-col gap-6">
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
      <Button variant="outline" asChild className="self-start">
        <Link href="/deliveries">Back to all deliveries</Link>
      </Button>
    </div>
  );
};

export default DeliveryDetailPage;
