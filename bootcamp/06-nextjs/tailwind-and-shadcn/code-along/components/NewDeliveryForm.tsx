'use client';

import { useState } from 'react';
import { addDelivery } from '@/lib/actions/deliveries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';

export const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return <Button onClick={() => setIsOpen(true)}>New delivery</Button>;
  }

  return (
    <form
      action={async (formData: FormData) => {
        await addDelivery(formData);
        setIsOpen(false);
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="pickup">Pickup</Label>
        <Input id="pickup" name="pickup" placeholder="Bakery" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          name="destination"
          placeholder="Clock Tower"
          required
        />
      </div>
      <Button type="submit">Create request</Button>
      <Button variant="brand" onClick={() => setIsOpen(true)}>
        New delivery
      </Button>
    </form>
  );
};
