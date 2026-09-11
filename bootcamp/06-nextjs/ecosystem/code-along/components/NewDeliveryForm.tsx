'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDeliveryFromObject } from '@/lib/actions/deliveries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';

type FormValues = {
  pickup: string;
  destination: string;
};

export const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  if (!isOpen) {
    return <Button onClick={() => setIsOpen(true)}>New delivery</Button>;
  }

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    const result = await addDeliveryFromObject(data);
    if (result.ok) {
      reset();
      setIsOpen(false);
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="pickup">Pickup</Label>
        <Input
          id="pickup"
          placeholder="Bakery"
          {...register('pickup', {
            required: 'Pickup is required',
            minLength: {
              value: 2,
              message: 'Pickup must be at least 2 characters',
            },
          })}
        />
        {errors.pickup && (
          <p className="text-sm text-destructive">{errors.pickup.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          placeholder="Clock Tower"
          {...register('destination', {
            required: 'Destination is required',
            minLength: {
              value: 2,
              message: 'Destination must be at least 2 characters',
            },
          })}
        />
        {errors.destination && (
          <p className="text-sm text-destructive">
            {errors.destination.message}
          </p>
        )}
      </div>
      {submitError && <p className="text-sm text-destructive">{submitError}</p>}
      <div className="flex gap-2">
        <Button type="submit">Create request</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
