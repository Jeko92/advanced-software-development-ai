import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Nav } from '@/components/nav.tsx';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Delivery Service',
  description:
    'Real-Time Communication challenge — order status via short polling, long polling, and SSE.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: extensions like Dark Reader add attributes to
    // <html> before React hydrates. Only affects this element's attributes.
    <html
      lang="en"
      className={cn('font-sans', geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen">
          <Nav />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
