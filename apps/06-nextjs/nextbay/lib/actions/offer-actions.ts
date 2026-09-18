'use server'

import { revalidatePath } from 'next/cache'
import { offersService } from '@/lib/services/offers-service'
import { ApiError } from '@/lib/api/fetch-api'

export async function placeOfferAction(auctionId: string, amount: number): Promise<{ error?: string }> {
  try {
    await offersService.placeOffer(auctionId, amount)
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message }
    }
    return { error: 'Failed to place offer. Please try again.' }
  }
  revalidatePath(`/auctions/${auctionId}`)
  return {}
}
