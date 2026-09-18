'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { placeOfferAction } from '@/lib/actions/offer-actions'
import { displayPrice } from '@/lib/formatters'

interface OfferFormProps {
  auctionId: string
  currentPrice: number
  isAuthenticated: boolean
  isSeller: boolean
  isOpen: boolean
}

interface OfferFormValues {
  amount: number
}

export function OfferForm({ auctionId, currentPrice, isAuthenticated, isSeller, isOpen }: OfferFormProps) {
  const [optimisticPrice, setOptimisticPrice] = useOptimistic(currentPrice)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<OfferFormValues>()

  const onSubmit = (values: OfferFormValues) => {
    setServerError(null)
    startTransition(async () => {
      setOptimisticPrice(values.amount)
      const result = await placeOfferAction(auctionId, values.amount)
      if (result.error) {
        setServerError(result.error)
      } else {
        reset()
      }
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-4">Sign in to place an offer</p>
        <Button asChild className="w-full">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (isSeller) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">You are the seller of this auction</p>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">This auction has ended</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Your Offer</label>
        <span className="text-xs text-muted-foreground">Current: {displayPrice(optimisticPrice)}</span>
      </div>
      <Input
        type="number"
        step="1"
        placeholder={String(optimisticPrice + 1)}
        className="text-lg"
        {...register('amount', {
          required: 'Enter an offer amount',
          valueAsNumber: true,
          validate: (value) =>
            value > optimisticPrice || `Offer must be higher than ${displayPrice(optimisticPrice)}`,
        })}
      />
      {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Placing Offer...' : 'Place Offer'}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Offers are binding and must exceed the current price
      </p>
    </form>
  )
}
