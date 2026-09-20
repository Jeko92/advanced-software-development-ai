'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

type ExportJob = {
  status: 'RUNNING' | 'DONE';
  progress: number;
  downloadUrl: string | undefined;
};

export default function LongPollingPage() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<ExportJob | null>(null);
  const [polledValues, setPolledValues] = useState<number[]>([]);

  const isRunning = jobId !== null;

  const handleStart = async () => {
    const apiUrl = `${process.env['NEXT_PUBLIC_API_URL']}/jobs`;
    setJob(null);
    setPolledValues([]);
    fetch(apiUrl, { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<{ id: string }>;
      })
      .then((job) => setJobId(job.id));
  };

  useEffect(() => {
    if (!jobId) return;

    const controller = new AbortController();

    const waitForUpdate = async (since: number): Promise<void> => {
      const apiUrl = process.env['NEXT_PUBLIC_API_URL'];
      let res: Response;
      try {
        res = await fetch(
          `${apiUrl}/jobs/${jobId}/updates?since=${since}`,
          { signal: controller.signal },
        );
      } catch {
        return;
      }

      if (res.status === 204) {
        await waitForUpdate(since);
        return;
      }

      const updated = (await res.json()) as ExportJob;
      setJob(updated);
      setPolledValues((prev) => [...prev, updated.progress]);

      if (updated.status === 'DONE') return;

      await waitForUpdate(updated.progress);
    };

    void waitForUpdate(-1);

    return () => {
      controller.abort();
    };
  }, [jobId]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-2xl font-semibold">Long Polling</h1>

      <Button onClick={() => void handleStart()} disabled={isRunning}>
        Start export
      </Button>

      {job && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Export status
              <Badge variant={job.status === 'DONE' ? 'default' : 'secondary'}>
                {job.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Progress value={job.progress} />
            <p className="text-sm text-muted-foreground">{job.progress}%</p>
            {job.status === 'DONE' && (
              <p className="text-sm text-muted-foreground">
                Job finished — no more requests will be sent.
              </p>
            )}

            <div>
              <p className="mb-1 text-xs text-muted-foreground">
                Every value the server actually sent back, in order. Unlike
                short polling, there are no duplicates here — each request
                only resolves once there is something new to report.
              </p>
              <div className="grid grid-cols-8 gap-1">
                {polledValues.map((value, index) => (
                  <div
                    key={index}
                    className="rounded-sm bg-muted py-1 text-center text-xs tabular-nums"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
