'use client';

import { useState } from 'react';
import { addDelivery } from '@/lib/actions/deliveries';

export const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)}>New delivery</button>;
  }

  return (
    <form
      action={async (formData: FormData) => {
        await addDelivery(formData);
        setIsOpen(false);
      }}
    >
      <input name="pickup" placeholder="Pickup" required />
      <input name="destination" placeholder="Destination" required />
      <button type="submit">Create request</button>
      <button type="button" onClick={() => setIsOpen(false)}>
        Cancel
      </button>
    </form>
  );
};
