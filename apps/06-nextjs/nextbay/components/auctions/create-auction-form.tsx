'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createAuctionAction } from '@/lib/actions/auction-actions'
import { cn } from '@/lib/utils'

interface CreateAuctionFormValues {
  title: string
  description: string
  startingPrice: number
  endDate: string
}

export function CreateAuctionForm() {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateAuctionFormValues>()

  const values = watch()

  const onSubmit = (formValues: CreateAuctionFormValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await createAuctionAction({
        title: formValues.title,
        description: formValues.description,
        startingPrice: Number(formValues.startingPrice),
        endDate: formValues.endDate ? new Date(formValues.endDate).toISOString() : undefined,
      })
      if (result?.error) {
        setServerError(result.error)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{serverError}</div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Auction Title</Label>
          <Input
            id="title"
            placeholder="Patek Philippe Nautilus 5711 - Stainless Steel"
            className={cn(errors.title && 'border-destructive')}
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'At least 3 characters' },
              maxLength: { value: 100, message: 'At most 100 characters' },
            })}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={6}
            placeholder="Describe your item in detail: brand, model, condition, history, and what makes it unique."
            className={cn(errors.description && 'border-destructive')}
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'At least 10 characters' },
            })}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startingPrice">Starting Price (EUR)</Label>
          <Input
            id="startingPrice"
            type="number"
            min="0"
            placeholder="10000"
            className={cn(errors.startingPrice && 'border-destructive')}
            {...register('startingPrice', {
              required: 'Starting price is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Must be zero or more' },
            })}
          />
          {errors.startingPrice && <p className="text-sm text-destructive">{errors.startingPrice.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (optional)</Label>
          <Input id="endDate" type="datetime-local" {...register('endDate')} />
          <p className="text-xs text-muted-foreground">Defaults to 3 days from now if left blank</p>
        </div>

        <Button type="submit" disabled={isPending} className="min-w-[200px]">
          {isPending ? 'Creating...' : 'Create Auction'}
        </Button>
      </form>

      <div className="mt-8 bg-card border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>
        <div className="border border-border rounded-lg p-4 bg-muted/50">
          <h4 className="font-semibold text-foreground truncate">{values.title || 'Auction Title'}</h4>
          <p className="text-sm text-muted-foreground">
            Starting Price: {values.startingPrice ? `€${Number(values.startingPrice).toLocaleString()}` : 'Not set'}
          </p>
        </div>
      </div>
    </>
  )
}
