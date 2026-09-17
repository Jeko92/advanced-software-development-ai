import { redirect } from 'next/navigation'
import { AdminAuctionRow } from '@/components/admin/admin-auction-row'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { getSession } from '@/lib/auth/session'
import { auctionsService } from '@/lib/services/auctions-service'

export default async function AdminPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (!session.roles.includes('admin')) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">Unauthorized</h1>
          <p className="text-muted-foreground mt-2">This page is only available to administrators.</p>
        </main>
        <Footer />
      </div>
    )
  }

  const { data: auctions } = await auctionsService.getAuctions({ limit: 50 })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground">Admin</h1>
        <p className="text-muted-foreground mt-2">
          Moderate every auction on the platform, regardless of who listed it.
        </p>

        {auctions.length === 0 ? (
          <p className="text-muted-foreground mt-6">No auctions yet.</p>
        ) : (
          <div className="space-y-3 mt-6">
            {auctions.map((auction) => (
              <AdminAuctionRow key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
