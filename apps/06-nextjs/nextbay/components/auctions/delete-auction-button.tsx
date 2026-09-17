'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { deleteAuctionAction } from '@/lib/actions/auction-actions'

export function DeleteAuctionButton({ auctionId }: { auctionId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const handleDelete = () => {
    setError(null)
    startTransition(async () => {
      const result = await deleteAuctionAction(auctionId)
      if (result?.error) {
        setError(result.error)
        setConfirming(false)
      }
    })
  }

  if (!confirming) {
    return (
      <Button
        variant="outline"
        className="w-full text-destructive hover:text-destructive"
        onClick={() => setConfirming(true)}
      >
        Delete Auction
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-foreground">Delete this auction? This cannot be undone.</p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={isPending}>
          {isPending ? 'Deleting...' : 'Confirm delete'}
        </Button>
        <Button variant="outline" onClick={() => setConfirming(false)} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
