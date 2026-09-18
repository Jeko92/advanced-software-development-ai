import { fetchAPI } from '@/lib/api/fetch-api'
import type { Auction } from '@/types'

export const watchlistService = {
  getWatchlist(): Promise<Auction[]> {
    return fetchAPI<Auction[]>('/watchlist')
  },
  addToWatchlist(auctionId: string): Promise<void> {
    return fetchAPI<void>(`/watchlist/${auctionId}`, { method: 'POST' })
  },
  removeFromWatchlist(auctionId: string): Promise<void> {
    return fetchAPI<void>(`/watchlist/${auctionId}`, { method: 'DELETE' })
  },
}
