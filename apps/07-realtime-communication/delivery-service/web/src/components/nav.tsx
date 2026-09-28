'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils.ts';

const links = [
  { href: '/', label: 'Home' },
  { href: '/short-polling', label: 'Short polling' },
  { href: '/long-polling', label: 'Long polling' },
  { href: '/sse', label: 'SSE' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0 border-r border-border p-4">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground',
              pathname === link.href && 'bg-muted font-medium text-foreground',
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
