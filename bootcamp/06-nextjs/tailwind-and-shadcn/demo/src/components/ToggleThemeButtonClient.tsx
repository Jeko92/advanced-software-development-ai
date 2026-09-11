'use client';

import { toggleTheme } from '@/actions/theme';

export default function ToggleThemeButton({ isDark }: { isDark: boolean }) {
  return (
    <button onClick={toggleTheme}>
      Toggle Theme to {isDark ? 'Light' : 'Dark'}
    </button>
  );
}
