import { getDeliveryById } from '@/lib/services/deliveriesService';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ deliveryId: string }> },
) {
  const { deliveryId } = await params;
  const delivery = await getDeliveryById(deliveryId);

  if (!delivery) {
    return Response.json({ error: 'Delivery not found' }, { status: 404 });
  }

  return Response.json(delivery);
}
