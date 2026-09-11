'use server';
import { cookies } from 'next/headers';

export async function toggleTheme() {
  const store = await cookies();
  const current = store.get('theme')?.value === 'dark' ? 'dark' : 'light';

  store.set('theme', current === 'dark' ? 'light' : 'dark');
}
