import type { Metadata } from 'next';
import { Geist, Geist_Mono, Oxanium, Inter } from 'next/font/google';
import './globals.css';
import { cookies } from 'next/headers';
import ToggleThemeButton from '@/components/ToggleThemeButton';
import { cn } from '@/lib/utils';

const oxaniumHeading = Oxanium({
  subsets: ['latin'],
  variable: '--font-heading',
});

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Coffee Nerds',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const store = await cookies();
  const theme = store.get('theme')?.value ?? 'light';
  console.log('theme: ', theme);

  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        theme === 'dark' && 'dark',
        'font-sans',
        inter.variable,
        oxaniumHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <header className="flex-row">
          <h1>Coffee Nerds</h1>
          <ToggleThemeButton />
        </header>
        {children}
      </body>
    </html>
  );
}
