import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CreateAuctionForm } from '@/components/auctions/create-auction-form'
import { getSession } from '@/lib/auth/session'

export default async function NewAuctionPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Create Auction</h1>
            <p className="text-muted-foreground mt-2">
              List your item on DarkBay for collectors worldwide to discover
            </p>
          </div>

          <CreateAuctionForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
