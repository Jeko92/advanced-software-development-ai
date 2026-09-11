'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Deliberate mount-detection effect: `theme` is always `undefined`
    // during SSR, so rendering it directly would mismatch whatever the
    // client resolves post-hydration (localStorage/system preference).
    // Deferring to a client-only render is next-themes' own documented
    // fix for this exact case.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" disabled>
        Toggle theme
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </Button>
  );
};
