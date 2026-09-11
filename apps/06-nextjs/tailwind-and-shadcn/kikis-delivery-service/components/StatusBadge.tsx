import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { Delivery } from '@/lib/services/deliveryService';

const statusBadge = cva('rounded-full px-2 py-1 text-sm font-medium', {
  variants: {
    status: {
      active: 'bg-blue-200 text-blue-800',
      accepted: 'bg-yellow-200 text-yellow-800',
      denied: 'bg-red-200 text-red-800',
      fulfilled: 'bg-green-200 text-green-800',
    },
  },
  defaultVariants: { status: 'active' },
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
