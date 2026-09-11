'use server';

import { createDelivery } from '@/lib/services/deliveriesService';
import { revalidatePath } from 'next/cache';

export async function addDelivery(formData: FormData) {
  const pickup = formData.get('pickup') as string;
  const destination = formData.get('destination') as string;

  await createDelivery({ pickup, destination });
  revalidatePath('/deliveries');
}

export async function addDeliveryFromObject(input: {
  pickup: string;
  destination: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const delivery = await createDelivery(input);
    revalidatePath('/deliveries');
    return { ok: true, id: delivery.id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
