import { Button } from '@/components/ui/button';
import { createDelivery } from '@/lib/services/deliveriesService';
import { revalidatePath } from 'next/cache';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';

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
      <div className="grid gap-2">
        <Label htmlFor="pickup">Pickup</Label>
        <Input id="pickup" name="pickup" placeholder="Bakery" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="destination">Destination</Label>
        <Input id="destination" name="destination" placeholder="Clock Tower" />
      </div>
      <Button type="submit">Create request</Button>
    </form>
  );
};

export default NewDeliveryPage;
