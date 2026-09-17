import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { getSession } from '@/lib/auth/session'
import { displayDate, displayPrice } from '@/lib/formatters'
import { offersService } from '@/lib/services/offers-service'
import { cn } from '@/lib/utils'

export default async function MyOffersPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const offers = await offersService.getMyOffers()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground">My Offers</h1>
        <p className="text-muted-foreground mt-2">Bids you&apos;ve placed across every auction.</p>

        {offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">You haven&apos;t placed any offers yet</p>
            <Link href="/auctions" className="text-sm text-foreground hover:underline mt-2">
              Browse auctions
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mt-6">
            {offers.map((offer) => (
              <Link
                key={offer.id}
                href={`/auctions/${offer.auction.id}`}
                className={cn(
                  'flex items-center justify-between gap-4 p-4 rounded-lg border border-border transition-colors hover:bg-muted/50',
                  offer.isWinning && 'bg-success/5 border-success/20'
                )}
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{offer.auction.title}</p>
                  <p className="text-sm text-muted-foreground">Placed {displayDate(offer.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-foreground">{displayPrice(offer.amount)}</p>
                  <p className={cn('text-xs', offer.isWinning ? 'text-success' : 'text-muted-foreground')}>
                    {offer.isWinning ? 'Winning' : 'Outbid'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
