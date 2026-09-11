import {
  getAllDeliveries,
  createDelivery,
} from '@/lib/services/deliveriesService';

export async function GET() {
  const deliveries = await getAllDeliveries();
  return Response.json(deliveries);
}

export async function POST(request: Request) {
  const body = await request.json();
  const delivery = await createDelivery(body);

  return Response.json(delivery, { status: 201 });
}
