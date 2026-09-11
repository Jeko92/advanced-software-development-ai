'use client';

import { useState } from 'react';
import type { Delivery } from '@/lib/services/deliveriesService';
import { StatusBadge } from '@/components/StatusBadge';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const statuses: Delivery['status'][] = ['pending', 'in-transit', 'delivered'];

export const DeliveryFilter = ({ deliveries }: { deliveries: Delivery[] }) => {
  const [status, setStatus] = useState<Delivery['status'] | 'all'>('all');

  const visible =
    status === 'all'
      ? deliveries
      : deliveries.filter((delivery) => delivery.status === status);

  return (
    <div className="flex flex-col gap-6">
      <Select
        value={status}
        onValueChange={(value) =>
          setStatus(value as Delivery['status'] | 'all')
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((delivery) => (
          <li key={delivery.id}>
            <Link href={`/deliveries/${delivery.id}`} className="block">
              <Card className="transition-colors hover:bg-accent/40">
                <CardHeader>
                  <CardTitle className="font-sans text-lg font-semibold">
                    {delivery.pickup} to {delivery.destination}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StatusBadge status={delivery.status} />
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
