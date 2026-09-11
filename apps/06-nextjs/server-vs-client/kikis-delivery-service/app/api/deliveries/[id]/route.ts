import { getDeliveryById } from '@/lib/services/deliveryService';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const delivery = await getDeliveryById(id);

  if (!delivery) {
    return Response.json({ error: 'Delivery not found' }, { status: 404 });
  }

  return Response.json(delivery);
}
