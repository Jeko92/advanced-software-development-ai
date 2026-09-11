import { createDelivery } from '@/lib/services/deliveriesService';
import { revalidatePath } from 'next/cache';

const NewDeliveryPage = () => {
  async function addDelivery(formData: FormData) {
    'use server';

    const pickup = formData.get('pickup') as string;
    const destination = formData.get('destination') as string;

    await createDelivery({ pickup, destination });
    revalidatePath('/deliveries');
  }

  return (
    <form action={addDelivery}>
      <input name="pickup" placeholder="Pickup" />
      <input name="destination" placeholder="Destination" />
      <button type="submit">Create request</button>
    </form>
  );
};

export default NewDeliveryPage;
