'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type HealthResponse = {
  status: string;
  service: string;
  database: { connected: boolean };
  timestamp: string;
};

export default function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env['NEXT_PUBLIC_API_URL'];
    fetch(`${apiUrl}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<HealthResponse>;
      })
      .then(setHealth)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Unknown error'),
      );
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-2xl font-semibold">Real-Time Playground</h1>
      <p className="text-sm text-gray-600">
        Scaffold check: does this Next.js app reach the NestJS API, which in
        turn reaches Postgres?
      </p>
      {error && <p className="text-red-600">Error: {error}</p>}
      {!error && !health && <p>Loading…</p>}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle>Health check</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="font-medium">Status</dt>
              <dd>{health.status}</dd>
              <dt className="font-medium">Service</dt>
              <dd>{health.service}</dd>
              <dt className="font-medium">Database connected</dt>
              <dd>{String(health.database.connected)}</dd>
              <dt className="font-medium">Timestamp</dt>
              <dd>{health.timestamp}</dd>
            </dl>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
