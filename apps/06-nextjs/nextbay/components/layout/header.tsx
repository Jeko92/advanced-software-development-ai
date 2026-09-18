"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { logoutAction } from '@/lib/actions/auth-actions'
import { UserAvatar } from '@/components/common/user-avatar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const [isPending, startTransition] = useTransition()

  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')
  const isAuthPage = pathname === '/login' || pathname === '/register'

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/auctions', label: 'Auctions' },
    { href: '/#how-it-works', label: 'How it works' },
  ]

  const dashboardNavLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/auctions', label: 'My Auctions' },
    { href: '/dashboard/offers', label: 'My Offers' },
    { href: '/dashboard/watchlist', label: 'Watchlist' },
    ...(user?.roles.includes('admin') ? [{ href: '/admin', label: 'Admin' }] : []),
  ]

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction()
    })
  }

  if (isAuthPage) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>DarkBay</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {(isDashboard ? dashboardNavLinks : navLinks).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <UserAvatar user={user} size="sm" />
                <span className="text-sm font-medium text-foreground">{user.username}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isPending} className="text-sm">
                {isPending ? 'Signing out...' : 'Sign out'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
