"use client"

import { formatPrice, displayPriceNumber } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  amount: number
  currency?: string
  showOriginal?: boolean
  originalAmount?: number
  className?: string
  variant?: 'large' | 'medium' | 'small'
}

export function PriceDisplay({
  amount,
  currency = 'EUR',
  showOriginal,
  originalAmount,
  className,
  variant = 'medium',
}: PriceDisplayProps) {
  const getSizeClasses = () => {
    switch (variant) {
      case 'large':
        return 'text-2xl font-bold'
      case 'medium':
        return 'text-xl font-semibold'
      case 'small':
        return 'text-sm'
      default:
        return 'text-xl font-semibold'
    }
  }

  return (
    <div className={className}>
      <span className={cn('text-foreground', getSizeClasses())}>
        {formatPrice(amount, currency)}
      </span>
      {showOriginal && originalAmount && originalAmount !== amount && (
        <span className="ml-2 text-sm text-muted-foreground line-through">
          {formatPrice(originalAmount, currency)}
        </span>
      )}
    </div>
  )
}

interface PriceWithLabelProps {
  amount: number
  label: string
  currency?: string
  className?: string
}

export function PriceWithLabel({
  amount,
  label,
  currency = 'EUR',
  className,
}: PriceWithLabelProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="text-2xl font-bold text-foreground">
        {formatPrice(amount, currency)}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

interface PriceRangeProps {
  min: number
  max: number
  currency?: string
  className?: string
}

export function PriceRange({ min, max, currency = 'EUR', className }: PriceRangeProps) {
  return (
    <span className={className}>
      {formatPrice(min, currency)} - {formatPrice(max, currency)}
    </span>
  )
}
