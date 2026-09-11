import { addDelivery } from '@/lib/actions/deliveries';

const NewDeliveryPage = () => {
  return (
    <form action={addDelivery}>
      <input name="pickup" placeholder="Pickup" />
      <input name="destination" placeholder="Destination" />
      <button type="submit">Create Delivery Request </button>
    </form>
  );
};

export default NewDeliveryPage;
