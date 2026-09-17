'use client'

import { Heart } from 'lucide-react'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { toggleWatchlistAction } from '@/lib/actions/watchlist-actions'
import { cn } from '@/lib/utils'

interface WatchlistButtonProps {
  auctionId: string
  initialIsWatched: boolean
}

export function WatchlistButton({ auctionId, initialIsWatched }: WatchlistButtonProps) {
  const [isWatched, setIsWatched] = useState(initialIsWatched)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleToggle = () => {
    setError(null)
    const nextIsWatched = !isWatched
    startTransition(async () => {
      const result = await toggleWatchlistAction(auctionId, isWatched)
      if (result?.error) {
        setError(result.error)
        return
      }
      setIsWatched(nextIsWatched)
    })
  }

  return (
    <div>
      <Button variant="outline" className="w-full" onClick={handleToggle} disabled={isPending}>
        <Heart className={cn('w-4 h-4 mr-2', isWatched && 'fill-destructive text-destructive')} />
        {isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </Button>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
