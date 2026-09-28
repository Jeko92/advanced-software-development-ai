import type { Metadata } from 'next';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Nav } from '@/components/nav';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Real-Time Playground',
  description: 'Polling & SSE code-along scaffold',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen bg-white text-gray-900">
        <div className="flex min-h-screen">
          <Nav />
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
