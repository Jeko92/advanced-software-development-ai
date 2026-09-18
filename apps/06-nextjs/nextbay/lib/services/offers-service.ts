import { fetchAPI } from '@/lib/api/fetch-api'
import type { MyOffer, Offer } from '@/types'

export const offersService = {
  getOffers(auctionId: string): Promise<Offer[]> {
    return fetchAPI<Offer[]>(`/auctions/${auctionId}/offers`)
  },
  placeOffer(auctionId: string, amount: number): Promise<Offer> {
    return fetchAPI<Offer>(`/auctions/${auctionId}/offers`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },
  getMyOffers(): Promise<MyOffer[]> {
    return fetchAPI<MyOffer[]>('/offers/mine')
  },
}
