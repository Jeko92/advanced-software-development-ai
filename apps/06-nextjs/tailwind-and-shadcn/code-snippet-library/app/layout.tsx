import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Code Snippet Library',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className={cn(inter.variable, jetBrainsMono.variable)}>
      <body className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <Link href="/" className="text-lg font-semibold">
            Code Snippet Library
          </Link>
          <Button asChild variant="outline">
            <Link href="/snippets">Snippets</Link>
          </Button>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
          &copy; Code Snippet Library {currentYear}
        </footer>
      </body>
    </html>
  );
}
