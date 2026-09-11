'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <Button variant="outline" onClick={() => setIsDark((current) => !current)}>
      {isDark ? 'Light mode' : 'Dark mode'}
    </Button>
  );
};
