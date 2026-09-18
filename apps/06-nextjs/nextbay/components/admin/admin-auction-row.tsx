'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { PriceDisplay } from '@/components/common/price-display'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { adminDeleteAuctionAction } from '@/lib/actions/admin-actions'
import type { Auction } from '@/types'

export function AdminAuctionRow({ auction }: { auction: Auction }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const handleDelete = () => {
    setError(null)
    startTransition(async () => {
      const result = await adminDeleteAuctionAction(auction.id)
      if (result?.error) {
        setError(result.error)
        setConfirming(false)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border border-border sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <Link href={`/auctions/${auction.id}`} className="font-medium text-foreground hover:underline truncate block">
          {auction.title}
        </Link>
        <p className="text-sm text-muted-foreground">by {auction.seller.username}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusBadge status={auction.status} />
        <PriceDisplay amount={auction.currentPrice} variant="small" />
        {confirming ? (
          <>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
              {isPending ? 'Deleting...' : 'Confirm'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirming(false)} disabled={isPending}>
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirming(true)}
          >
            Delete
          </Button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
