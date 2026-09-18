import { Check } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DeleteAuctionButton } from '@/components/auctions/delete-auction-button'
import { OfferForm } from '@/components/auctions/offer-form'
import { WatchlistButton } from '@/components/auctions/watchlist-button'
import { CountdownDisplay } from '@/components/common/countdown-display'
import { PriceDisplay } from '@/components/common/price-display'
import { StatusBadge } from '@/components/common/status-badge'
import { UserWithName } from '@/components/common/user-avatar'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { ApiError } from '@/lib/api/fetch-api'
import { getSession } from '@/lib/auth/session'
import { displayDate, displayPrice } from '@/lib/formatters'
import { auctionsService } from '@/lib/services/auctions-service'
import { offersService } from '@/lib/services/offers-service'
import { watchlistService } from '@/lib/services/watchlist-service'
import { cn } from '@/lib/utils'
import type { Auction } from '@/types'

interface AuctionDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AuctionDetailPage({ params }: AuctionDetailPageProps) {
  const { id } = await params

  let auction: Auction
  try {
    auction = await auctionsService.getAuctionById(id)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound()
    }
    throw error
  }

  const [offers, session] = await Promise.all([offersService.getOffers(id), getSession()])
  const watchlist = session ? await watchlistService.getWatchlist() : []
  const isWatched = watchlist.some((watched) => watched.id === auction.id)

  const isSeller = session?.id === auction.seller.id
  const sortedOffers = [...offers].sort((a, b) => b.amount - a.amount)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/auctions" className="hover:text-foreground">Auctions</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{auction.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={auction.status} />
                    {auction.status === 'open' && <CountdownDisplay endDate={auction.endDate} showDescription />}
                  </div>
                  <h1 className="font-display text-3xl font-bold text-foreground">{auction.title}</h1>
                  <p className="text-muted-foreground mt-1">
                    by <span className="text-foreground font-medium">{auction.seller.username}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <PriceDisplay amount={auction.currentPrice} variant="large" />
                  {auction.currentPrice > auction.startingPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {displayPrice(auction.startingPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Ends</p>
                  <p className="font-medium text-foreground">{displayDate(auction.endDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Starting Price</p>
                  <p className="font-medium text-foreground">{displayPrice(auction.startingPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Offers</p>
                  <p className="font-medium text-foreground">{offers.length}</p>
                </div>
              </div>

              <div className="mt-8 bg-card border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{auction.description}</p>
              </div>

              <div className="mt-8 bg-card border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Offer History</h3>
                {sortedOffers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No offers yet</p>
                ) : (
                  <div className="space-y-3">
                    {sortedOffers.map((offer, index) => (
                      <div
                        key={offer.id}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg',
                          index === 0 ? 'bg-primary/5' : 'hover:bg-muted/50'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-foreground">{index + 1}.</span>
                          <UserWithName user={offer.bidder} size="sm" />
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{displayPrice(offer.amount)}</p>
                          <p className="text-xs text-muted-foreground">{displayDate(offer.createdAt)}</p>
                        </div>
                        {index === 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                            <Check className="w-3 h-3 mr-1" />
                            Highest
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border-border rounded-xl p-6 sticky top-24 space-y-6">
                <OfferForm
                  auctionId={auction.id}
                  currentPrice={auction.currentPrice}
                  isAuthenticated={session !== null}
                  isSeller={isSeller}
                  isOpen={auction.status === 'open'}
                />

                {session && <WatchlistButton auctionId={auction.id} initialIsWatched={isWatched} />}

                <div className="pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Seller</h4>
                  <UserWithName user={auction.seller} />
                </div>

                {isSeller && (
                  <div className="pt-6 border-t border-border">
                    <DeleteAuctionButton auctionId={auction.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
