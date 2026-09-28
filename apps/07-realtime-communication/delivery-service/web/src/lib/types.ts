export const STAGES = ['PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const;
export type OrderStatus = (typeof STAGES)[number];

export type OrderSnapshot = {
  status: OrderStatus;
  stageIndex: number;
  isFinal: boolean;
};

export type CreatedOrder = OrderSnapshot & { id: string };

export type PollResponse = number | null;

export const STAGE_LABELS: Record<OrderStatus, string> = {
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
};

/** What the SSE page knows about its EventSource connection. */
export type ConnectionState =
  | 'connecting'
  | 'live'
  | 'reconnecting'
  | 'offline'
  | 'closed';
