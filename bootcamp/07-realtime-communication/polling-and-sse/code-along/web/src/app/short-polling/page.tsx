'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type ExportJob = {
  status: 'RUNNING' | 'DONE';
  progress: number;
  downloadUrl: string | undefined;
};

const DEFAULT_POLL_INTERVAL_IN_MS = 3000;

export default function ShortPollingPage() {
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<ExportJob | null>(null);
  const [polledValues, setPolledValues] = useState<number[]>([]);
  const [pollIntervalMs, setPollIntervalMs] = useState(
    DEFAULT_POLL_INTERVAL_IN_MS,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

    const tick = async () => {
      const apiUrl = process.env['NEXT_PUBLIC_API_URL'];
      await fetch(`${apiUrl}/jobs/${jobId}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          return res.json() as Promise<ExportJob>;
        })
        .then((job) => {
          setJob(job);
          setPolledValues((prev) => [...prev, job.progress]);
          if (job.status === 'DONE' && intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        });
    };

    intervalRef.current = setInterval(() => void tick(), pollIntervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [jobId, pollIntervalMs]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-2xl font-semibold">Short Polling</h1>

      <div className="flex items-center gap-4">
        <Button onClick={() => void handleStart()} disabled={isRunning}>
          Start export
        </Button>

        <div className="flex flex-1 items-center gap-3">
          <span className="text-sm text-muted-foreground">Poll every</span>
          <Slider
            className="max-w-40"
            value={[pollIntervalMs]}
            min={500}
            max={5000}
            step={500}
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
                Job finished — polling stopped. (There&#39;s no real file behind
                this demo, so no download link either — see the guide&#39;s note
                on why.)
              </p>
            )}

            <div>
              <p className="mb-1 text-xs text-muted-foreground">
                Every polled value, in order. Red = same value as the previous
                poll — a wasted request that told us nothing new.
              </p>
              <div className="grid grid-cols-8 gap-1">
                {polledValues.map((value, index) => (
                  <div
                    key={index}
                    className={cn(
                      'rounded-sm bg-muted py-1 text-center text-xs tabular-nums',
                      polledValues[index - 1] === value &&
                        'bg-destructive/30 text-destructive',
                    )}
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
