'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { OrderStatusCard } from '@/components/order-status-card';
import { NetworkStatsCard } from '@/components/network-stats-card';
import type { CreatedOrder, OrderSnapshot, PollResponse } from '@/lib/types';

const DEFAULT_POLL_INTERVAL_MS = 1000;

export default function ShortPollingPage() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderSnapshot | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [history, setHistory] = useState<PollResponse[]>([]);
  const [pollIntervalMs, setPollIntervalMs] = useState(
    DEFAULT_POLL_INTERVAL_MS,
  );

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

    const tick = async () => {
      setRequestCount((count) => count + 1);
      try {
        const response = await fetch(`${apiUrl}/api/orders/${orderId}`);
        if (!response.ok) return;

        const updated = (await response.json()) as OrderSnapshot;
        setOrder(updated);
        setHistory((prev) => [...prev, updated.stageIndex]);

        if (updated.isFinal) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(() => void tick(), pollIntervalMs);

    return () => clearInterval(intervalId);
  }, [orderId, pollIntervalMs]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-2xl font-semibold">Short Polling</h1>

      <div className="flex items-center gap-4">
        <Button onClick={handleStart} disabled={isRunning}>
          Start delivery
        </Button>

        <div className="flex flex-1 items-center gap-3">
          <span className="text-sm text-muted-foreground">Poll every</span>
          <Slider
            className="max-w-40"
            value={[pollIntervalMs]}
            min={250}
            max={5000}
            step={250}
            disabled={isRunning}
            onValueChange={(value) =>
              setPollIntervalMs(
                Array.isArray(value) ? (value[0] ?? pollIntervalMs) : value,
              )
            }
          />
          <span className="w-14 text-sm tabular-nums text-muted-foreground">
            {pollIntervalMs}ms
          </span>
        </div>
      </div>

      {order && (
        <OrderStatusCard
          order={order}
          note={order.isFinal ? 'Delivered — polling stopped.' : undefined}
        />
      )}

      {orderId && (
        <NetworkStatsCard requestCount={requestCount} history={history} />
      )}
    </main>
  );
}
