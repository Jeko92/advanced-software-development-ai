import { toggleTheme } from '@/actions/theme';
import { cookies } from 'next/headers';

export default async function ToggleThemeButton() {
  const store = await cookies();
  const theme = store.get('theme')?.value ?? 'light';
  return (
    <form action={toggleTheme}>
      <button>Toggle Theme to {theme === 'dark' ? 'Light' : 'Dark'}</button>
    </form>
  );
}
