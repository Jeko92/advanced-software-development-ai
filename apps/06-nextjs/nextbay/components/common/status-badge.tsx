import { AuctionStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: AuctionStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        'text-xs font-medium px-2.5 py-0.5',
        status === 'open' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground',
        className
      )}
    >
      {status === 'open' ? 'Open' : 'Closed'}
    </Badge>
  )
}
