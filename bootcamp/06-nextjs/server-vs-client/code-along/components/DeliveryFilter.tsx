'use client';

import { useState } from 'react';
import type { Delivery } from '@/lib/services/deliveriesService';
import { StatusBadge } from '@/components/StatusBadge';
import Link from 'next/link';

const statuses: Delivery['status'][] = ['pending', 'in-transit', 'delivered'];

export const DeliveryFilter = ({ deliveries }: { deliveries: Delivery[] }) => {
  const [status, setStatus] = useState<Delivery['status'] | 'all'>('all');

  const visible =
    status === 'all'
      ? deliveries
      : deliveries.filter((delivery) => delivery.status === status);

  return (
    <div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as Delivery['status'] | 'all')}
      >
        <option value="all">All</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ul>
        {visible.map((delivery) => (
          <li key={delivery.id}>
            <Link href={`/deliveries/${delivery.id}`}>
              {delivery.pickup}, {delivery.destination},{' '}
              <StatusBadge status={delivery.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
