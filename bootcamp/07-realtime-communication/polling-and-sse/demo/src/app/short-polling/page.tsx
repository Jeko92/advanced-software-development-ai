'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { cn } from 'cn';
import { useEffect, useState } from 'react';

export default function Page() {
  const [isRunning, setIsRunning] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [fetchInterval, setFetchInterval] = useState(500);
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

    console.log(data.id);

    setJobId(data.id);
    resetProgress();
    setIsRunning(true);
  }

  async function stop() {
    setIsRunning(false);
    setJobId(null);
    resetProgress();

    fetch(`/api/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  const progress = fetchedValues.at(-1) ?? 0;

  useEffect(() => {
    if (!isRunning) return;

    async function fetchProgress() {
      try {
        const res = await fetch(`/api/jobs/${jobId}/short`);
        const data = await res.json();
        console.log(data);
        updateProgress(data.value);

        if (data.done) {
          setIsRunning(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchProgress();
    const interval = setInterval(fetchProgress, fetchInterval);
    return () => clearInterval(interval);
  }, [isRunning, fetchInterval, jobId]);

  return (
    <div className="p-2 flex flex-col gap-2">
      <Card>
        <CardContent className="flex flex-col items-start gap-2">
          <Progress value={progress}>
            <ProgressLabel>Short Polling</ProgressLabel>
            <ProgressValue />
          </Progress>
          <div className="flex w-full items-center gap-4">
            <Button onClick={isRunning ? stop : start}>
              {isRunning ? 'Stop' : 'Start'}
            </Button>
            <span className="ml-auto">Fetch Interval:</span>

            <Slider
              className="mx-0 max-w-xs"
              value={fetchInterval}
              min={100}
              max={1000}
              step={100}
              disabled={isRunning}
              onValueChange={(value) => setFetchInterval(value as number)}
            />
          </div>
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
