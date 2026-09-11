import { addDelivery } from '@/lib/actions/deliveries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const NewDeliveryPage = () => {
  return (
    <form action={addDelivery}>
      <div className="grid gap-2">
        <Label htmlFor="pickup">Pickup</Label>
        <Input id="pickup" name="pickup" placeholder="Pickup" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          name="destination"
          placeholder="Destination"
          required
        />
      </div>
      <Button type="submit">Create Delivery Request</Button>
    </form>
  );
};

export default NewDeliveryPage;
