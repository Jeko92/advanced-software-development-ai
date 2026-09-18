import Link from 'next/link'
import Image from 'next/image'
import { Auction } from '@/types'
import { StatusBadge } from '@/components/common/status-badge'
import { PriceDisplay } from '@/components/common/price-display'
import { CountdownBadge } from '@/components/common/countdown-display'
import { UserAvatar } from '@/components/common/user-avatar'
import { getDecorativeImage } from '@/lib/decorative-images'
import { cn } from '@/lib/utils'

interface AuctionCardProps {
  auction: Auction
  className?: string
}

export function AuctionCard({ auction, className }: AuctionCardProps) {
  return (
    <Link
      href={`/auctions/${auction.id}`}
      className={cn(
        'group relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-200 hover:shadow-md block',
        className
      )}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        <Image
          src={getDecorativeImage(auction.id)}
          alt={auction.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={auction.status} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {auction.status === 'open' && (
          <div className="absolute bottom-3 right-3 z-10">
            <CountdownBadge endDate={auction.endDate} />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {auction.title}
          </h3>
          <PriceDisplay amount={auction.currentPrice} variant="small" />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <UserAvatar user={auction.seller} size="sm" />
          <span className="text-muted-foreground truncate">{auction.seller.username}</span>
        </div>
      </div>
    </Link>
  )
}
