'use client';

import { Button } from '@/components/ui/button.tsx';

const Error = ({
  error,
  reset,
}: {
  error: globalThis.Error;
  reset: () => void;
}) => {
  return (
    <div className="flex flex-col items-start gap-3">
      <h2 className="font-heading text-2xl">Could not load this delivery.</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </div>
  );
};

export default Error;
