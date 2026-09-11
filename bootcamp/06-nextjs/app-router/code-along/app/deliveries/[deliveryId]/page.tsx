import {
  getAllDeliveries,
  getDeliveryById,
} from '@/lib/services/deliveriesService';

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
      <div>
        <h1>Delivery {deliveryId} not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Delivery {deliveryId}</h1>
      <p>
        From {delivery.pickup} to {delivery.destination}
      </p>
      <p>Status: {delivery.status}</p>
    </div>
  );
};

export default DeliveryDetailPage;
