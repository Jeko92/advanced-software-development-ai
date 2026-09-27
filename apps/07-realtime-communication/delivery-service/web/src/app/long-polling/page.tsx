'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { OrderStatusCard } from '@/components/order-status-card';
import { NetworkStatsCard } from '@/components/network-stats-card';
import type { CreatedOrder, OrderSnapshot, PollResponse } from '@/lib/types';

export default function LongPollingPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [history, setHistory] = useState<PollResponse[]>([]);

  const isRunning = orderId !== null && !order?.isFinal;

  const handleStart = () => {
    const apiUrl = process.env['NEXT_PUBLIC_API_URL'];
    setOrderId(null);
    setOrder(null);
    setRequestCount(0);
    setHistory([]);
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
    const controller = new AbortController();

    const waitForUpdate = async (since: number): Promise<void> => {
      setRequestCount((count) => count + 1);
      try {
        const response = await fetch(
          `${apiUrl}/api/orders/${orderId}/updates?since=${since}`,
          { signal: controller.signal },
        );

        if (response.status === 204) {
          setHistory((prev) => [...prev, null]);
          await waitForUpdate(since);
          return;
        }
        if (!response.ok) return;

        const updated = (await response.json()) as OrderSnapshot;
        setOrder(updated);
        setHistory((prev) => [...prev, updated.stageIndex]);

        if (updated.isFinal) {
          return;
        }
        await waitForUpdate(updated.stageIndex);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(error);
      }
    };

    void waitForUpdate(-1);
    return () => controller.abort();
  }, [orderId]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-2xl font-semibold">Long Polling</h1>

      <Button onClick={handleStart} disabled={isRunning}>
        Start delivery
      </Button>

      {order && (
        <OrderStatusCard
          order={order}
          note={
            order.isFinal
              ? 'Delivered — no more requests will be sent.'
              : undefined
          }
        />
      )}

      {orderId && (
        <NetworkStatsCard requestCount={requestCount} history={history} />
      )}
    </main>
  );
}
