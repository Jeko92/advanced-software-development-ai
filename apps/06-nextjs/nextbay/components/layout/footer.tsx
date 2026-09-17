"use client"

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { href: '/auctions', label: 'Auctions' },
      { href: '/#how-it-works', label: 'How it works' },
      { href: '/#featured', label: 'Featured' },
    ],
  }

  return (
    <footer
      className={cn(
        'border-t border-border/40 bg-background',
        className
      )}
    >
      <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>DarkBay</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A curated auction marketplace for discovering rare objects and premium collectibles.
            </p>
            <div className="mt-6">
              <p className="text-xs text-muted-foreground/50">
                &copy; {currentYear} DarkBay. All rights reserved.
              </p>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground/50 text-center sm:text-left">
            DarkBay is a premium auction marketplace. All items are carefully curated and authenticated.
          </p>
        </div>
      </div>
    </footer>
  )
}
