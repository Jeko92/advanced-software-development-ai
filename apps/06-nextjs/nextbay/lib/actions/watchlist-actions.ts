'use server'

import { revalidatePath } from 'next/cache'
import { ApiError } from '@/lib/api/fetch-api'
import { watchlistService } from '@/lib/services/watchlist-service'

export async function toggleWatchlistAction(
  auctionId: string,
  isCurrentlyWatched: boolean
): Promise<{ error?: string }> {
  try {
    if (isCurrentlyWatched) {
      await watchlistService.removeFromWatchlist(auctionId)
    } else {
      await watchlistService.addToWatchlist(auctionId)
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message }
    }
    return { error: 'Failed to update watchlist. Please try again.' }
  }
  revalidatePath(`/auctions/${auctionId}`)
  revalidatePath('/dashboard/watchlist')
  return {}
}
