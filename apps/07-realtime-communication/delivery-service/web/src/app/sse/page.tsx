'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { OrderStatusCard } from '@/components/order-status-card';
import { NetworkStatsCard } from '@/components/network-stats-card';
import type {
  ConnectionState,
  CreatedOrder,
  OrderSnapshot,
  PollResponse,
} from '@/lib/types';

const MAX_RECONNECT_ATTEMPTS = 5;

export default function SsePage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [history, setHistory] = useState<PollResponse[]>([]);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('connecting');

  const isRunning =
    orderId !== null && !order?.isFinal && connectionState !== 'offline';

  const handleStart = () => {
    const apiUrl = process.env['NEXT_PUBLIC_API_URL'];
    setOrderId(null);
    setOrder(null);
    setConnectionCount(0);
    setHistory([]);
    setConnectionState('connecting');
    fetch(`${apiUrl}/api/orders`, { method: 'POST' })
      .then((res) => res.json() as Promise<CreatedOrder>)
      .then((created) => {
        setOrder(created);
        setOrderId(created.id);
      });
  };

  useEffect(() => {
    if (!orderId) return;

    const apiUrl = process.env['NEXT_PUBLIC_API_URL'];

    const source = new EventSource(`${apiUrl}/api/orders/${orderId}/stream`);
    let failedAttempts = 0;

    source.onopen = () => {
      failedAttempts = 0;
      setConnectionCount((count) => count + 1);
      setConnectionState('live');
    };
    source.onmessage = (event) => {
      const updated = JSON.parse(event.data as string) as OrderSnapshot;
      setOrder(updated);
      setHistory((prev) => [...prev, updated.stageIndex]);
      if (updated.isFinal) {
        source.close();
        setConnectionState('closed');
      }
    };
    source.onerror = () => {
      if (source.readyState === EventSource.CLOSED) {
        setConnectionState('offline');
        return;
      }

      failedAttempts += 1;
      if (failedAttempts > MAX_RECONNECT_ATTEMPTS) {
        source.close();
        setConnectionState('offline');
        return;
      }
      setConnectionState('reconnecting');
    };
    return () => source.close();
  }, [orderId]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-2xl font-semibold">Server-Sent Events</h1>

      <Button onClick={handleStart} disabled={isRunning}>
        Start delivery
      </Button>

      {order && (
        <OrderStatusCard
          order={order}
          connectionState={connectionState}
          note={
            order.isFinal
              ? 'Delivered — the connection was closed by both sides.'
              : undefined
          }
        />
      )}

      {orderId && (
        <NetworkStatsCard
          requestCount={connectionCount}
          requestLabel="Connections opened"
          history={history}
        />
      )}
    </main>
  );
}
