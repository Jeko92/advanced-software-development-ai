import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AuctionCard } from '@/components/auctions/auction-card'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { getSession } from '@/lib/auth/session'
import { watchlistService } from '@/lib/services/watchlist-service'

export default async function WatchlistPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const watchlist = await watchlistService.getWatchlist()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground">Watchlist</h1>
        <p className="text-muted-foreground mt-2">Auctions you&apos;re keeping an eye on.</p>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">Your watchlist is empty</p>
            <Link href="/auctions" className="text-sm text-foreground hover:underline mt-2">
              Browse auctions
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {watchlist.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
