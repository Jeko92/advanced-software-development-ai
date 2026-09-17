"use client"

import { useEffect, useState } from 'react'
import { displayCountdown, getCountdownDescription, isDeadlinePassed } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface CountdownDisplayProps {
  endDate: string
  showDescription?: boolean
  className?: string
  onEnd?: () => void
}

export function CountdownDisplay({
  endDate,
  showDescription = false,
  className,
  onEnd,
}: CountdownDisplayProps) {
  const [countdown, setCountdown] = useState<string>(displayCountdown(endDate))
  const [description, setDescription] = useState<string>(getCountdownDescription(endDate))
  const [hasEnded, setHasEnded] = useState<boolean>(isDeadlinePassed(endDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const ended = isDeadlinePassed(endDate)
      if (ended && !hasEnded) {
        setHasEnded(true)
        onEnd?.()
      }
      setCountdown(displayCountdown(endDate))
      setDescription(getCountdownDescription(endDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate, hasEnded, onEnd])

  if (hasEnded) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>
        Ended
      </span>
    )
  }

  if (showDescription) {
    return (
      <span
        className={cn(
          'text-sm font-medium',
          {
            'text-warning': description.includes('soon') || description.includes('hour'),
            'text-muted-foreground': !description.includes('soon') && !description.includes('hour'),
          },
          className
        )}
      >
        {description}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'text-sm font-mono',
        {
          'text-warning': countdown.includes('h') || countdown.includes('m'),
          'text-muted-foreground': !countdown.includes('h') && !countdown.includes('m'),
        },
        className
      )}
    >
      {countdown}
    </span>
  )
}

interface CountdownBadgeProps {
  endDate: string
  className?: string
}

export function CountdownBadge({ endDate, className }: CountdownBadgeProps) {
  const [countdown, setCountdown] = useState<string>(displayCountdown(endDate))
  const [hasEnded, setHasEnded] = useState<boolean>(isDeadlinePassed(endDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const ended = isDeadlinePassed(endDate)
      if (ended && !hasEnded) {
        setHasEnded(true)
      }
      setCountdown(displayCountdown(endDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate, hasEnded])

  if (hasEnded) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground',
          className
        )}
      >
        Ended
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-warning/10 text-warning': countdown.includes('h') || countdown.includes('m'),
          'bg-muted/50 text-muted-foreground': !countdown.includes('h') && !countdown.includes('m'),
        },
        className
      )}
    >
      {countdown}
    </span>
  )
}
