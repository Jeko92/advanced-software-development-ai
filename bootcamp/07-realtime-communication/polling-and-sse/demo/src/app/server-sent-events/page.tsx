'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { cn } from 'cn';
import { useEffect, useState } from 'react';

export default function Page() {
  const [isRunning, setIsRunning] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [fetchedValues, setFetchedValues] = useState<number[]>([]);

  function updateProgress(value: number) {
    setFetchedValues((prev) => [...prev, value]);
  }

  function resetProgress() {
    setFetchedValues([]);
  }

  async function start() {
    const res = await fetch('/api/jobs', {
      method: 'POST',
    });
    const data = await res.json();

    setJobId(data.id);
    setIsRunning(true);
    resetProgress();
  }

  async function stop() {
    setIsRunning(false);
    resetProgress();

    fetch(`/api/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  const progress = fetchedValues.at(-1) ?? 0;

  useEffect(() => {
    if (!isRunning) return;

    const source = new EventSource(`/api/jobs/${jobId}/sse`);
    source.onopen = () => {
      setConnectionStatus('connected');
    };

    source.onerror = () => {
      if (source.readyState === EventSource.CONNECTING) {
        setConnectionStatus('disconnected');
      }
    };

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      updateProgress(data.value);

      if (data.done) {
        setIsRunning(false);
        source.close();
      }
    };

    return () => source.close();
  }, [isRunning, jobId]);

  return (
    <div className="p-2 flex flex-col gap-2">
      <Card>
        <CardContent className="flex flex-col items-start gap-2">
          <Progress value={progress}>
            <ProgressLabel
              className={cn([
                connectionStatus === 'disconnected' && 'text-destructive',
                connectionStatus === 'connected' && 'text-emerald-800',
              ])}
            >
              Server Sent Events {connectionStatus && `[${connectionStatus}]`}
            </ProgressLabel>
            <ProgressValue />
          </Progress>
          <Button onClick={isRunning ? stop : start}>
            {isRunning ? 'Stop' : 'Start'}
          </Button>
          <ul className="grid gap-0.5 grid-cols-12 w-full flex-wrap overflow-hidden rounded-md items-center">
            {fetchedValues.map((value, index) => (
              <li
                key={index}
                className={cn(
                  'text-center align-center py-2 bg-accent rounded-xs',
                  fetchedValues[index - 1] === value && 'bg-destructive/30',
                )}
              >
                {value}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
