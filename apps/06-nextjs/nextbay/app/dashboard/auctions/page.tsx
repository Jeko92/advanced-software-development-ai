import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AuctionCard } from '@/components/auctions/auction-card'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth/session'
import { auctionsService } from '@/lib/services/auctions-service'

export default async function MyAuctionsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const { data: auctions } = await auctionsService.getAuctions({
    sellerId: session.id,
    limit: 50,
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Auctions</h1>
            <p className="text-muted-foreground mt-2">Auctions you&apos;ve listed for sale.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/auctions/new">Create Auction</Link>
          </Button>
        </div>

        {auctions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">You haven&apos;t listed any auctions yet</p>
            <Link href="/dashboard/auctions/new" className="text-sm text-foreground hover:underline mt-2">
              Create your first auction
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
