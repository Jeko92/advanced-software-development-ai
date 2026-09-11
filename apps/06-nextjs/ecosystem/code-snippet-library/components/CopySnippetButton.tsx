'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const CopySnippetButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
};
