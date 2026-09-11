import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { Delivery } from '@/lib/services/deliveriesService';

const statusBadge = cva('rounded-full px-2 py-1 text-sm font-medium', {
  variants: {
    status: {
      pending: 'bg-gray-200 text-gray-800',
      'in-transit': 'bg-yellow-200 text-yellow-800',
      delivered: 'bg-green-200 text-green-800',
    },
  },
  defaultVariants: { status: 'pending' },
});

export const StatusBadge = ({
  status,
  className,
}: {
  status: Delivery['status'];
  className?: string;
}) => {
  return (
    <span className={cn(statusBadge({ status }), className)}>{status}</span>
  );
};
