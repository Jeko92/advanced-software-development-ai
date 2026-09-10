import type { Delivery } from '@/lib/services/deliveriesService';

const colorByStatus: Record<Delivery['status'], string> = {
  pending: 'gray',
  'in-transit': 'yellow',
  delivered: 'green',
};

export const StatusBadge = ({ status }: { status: Delivery['status'] }) => {
  return (
    <span style={{ backgroundColor: colorByStatus[status] }}>{status}</span>
  );
};
