'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { CreateAuctionInput } from '@/types'
import { auctionsService } from '@/lib/services/auctions-service'
import { ApiError } from '@/lib/api/fetch-api'

export async function deleteAuctionAction(auctionId: string): Promise<{ error?: string }> {
  try {
    await auctionsService.deleteAuction(auctionId)
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message }
    }
    return { error: 'Failed to delete auction. Please try again.' }
  }
  revalidatePath('/auctions')
  redirect('/auctions')
}

export async function createAuctionAction(input: CreateAuctionInput): Promise<{ error?: string }> {
  let auctionId: string
  try {
    const auction = await auctionsService.createAuction(input)
    auctionId = auction.id
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message }
    }
    return { error: 'Failed to create auction. Please try again.' }
  }
  revalidatePath('/auctions')
  redirect(`/auctions/${auctionId}`)
}
