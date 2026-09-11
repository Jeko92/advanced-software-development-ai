import { Cherry_Bomb_One, Figtree } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle.tsx';
import { RecentlyViewedBadge } from '@/components/RecentlyViewedBadge.tsx';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const cherryBomb = Cherry_Bomb_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading-family',
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className={cn(figtree.variable, cherryBomb.variable)}>
      <body className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between bg-brand p-4 text-brand-foreground">
          <h1 className="font-heading text-2xl">
            Kiki&apos;s Delivery Service
          </h1>
          <RecentlyViewedBadge />
          <ThemeToggle />
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t px-4 py-4 text-center text-sm text-muted-foreground">
          &copy; Kiki&apos;s Delivery Service {currentYear}
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
