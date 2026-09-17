import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/auth/session";
import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DarkBay - Curated Auction Marketplace",
  description: "Discover rare objects and premium auctions at DarkBay. A curated marketplace for collectors and connoisseurs.",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  const session = await getSession()

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "scroll-smooth",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable,
        fraunces.variable
      )}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthHydrator user={session} />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
