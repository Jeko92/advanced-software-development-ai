import { Cherry_Bomb_One, Figtree } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from '@/components/ThemeToggle';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const cherryBombOne = Cherry_Bomb_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-cherry-bomb-one',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <html
      lang="en"
      className={cn('font-sans', figtree.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="flex items-center justify-between bg-brand p-4 text-brand-foreground">
            <h1
              style={{ fontFamily: cherryBombOne.style.fontFamily }}
              className="font-heading text-2xl md:text-3xl"
            >
              Kiki&apos;s Delivery Service
            </h1>
            <ThemeToggle />
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t px-4 py-4 text-center text-sm text-muted-foreground">
            &copy; Kiki&apos;s Delivery Service {currentYear}
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
