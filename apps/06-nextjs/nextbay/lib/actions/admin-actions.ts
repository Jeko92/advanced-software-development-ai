'use server'

import { revalidatePath } from 'next/cache'
import { ApiError } from '@/lib/api/fetch-api'
import { auctionsService } from '@/lib/services/auctions-service'

export async function adminDeleteAuctionAction(auctionId: string): Promise<{ error?: string }> {
  try {
    await auctionsService.deleteAuction(auctionId)
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message }
    }
    return { error: 'Failed to delete auction. Please try again.' }
  }
  revalidatePath('/admin')
  return {}
}
