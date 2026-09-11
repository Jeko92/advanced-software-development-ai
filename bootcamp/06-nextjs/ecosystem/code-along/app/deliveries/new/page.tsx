'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { addDeliveryFromObject } from '@/lib/actions/deliveries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';

type FormValues = {
  pickup: string;
  destination: string;
};

const PickupField = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
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
  );
};

const DestinationField = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
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
        <p className="text-sm text-destructive">{errors.destination.message}</p>
      )}
    </div>
  );
};

const NewDeliveryPage = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const methods = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    const result = await addDeliveryFromObject(data);
    if (result.ok) {
      router.push('/deliveries');
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl">New delivery</h1>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid max-w-sm gap-4"
        >
          <PickupField />
          <DestinationField />
          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}
          <Button type="submit" className="self-start">
            Create request
          </Button>
        </form>
      </FormProvider>
      <Button variant="outline" asChild className="self-start">
        <Link href="/deliveries">Back to all deliveries</Link>
      </Button>
    </div>
  );
};

export default NewDeliveryPage;
