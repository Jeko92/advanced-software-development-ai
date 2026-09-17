import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth/session'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {session.username}</h1>
        <p className="text-muted-foreground mt-2">Manage your auctions and offers from here.</p>
        <div className="flex gap-3 mt-6">
          <Button asChild>
            <Link href="/dashboard/auctions/new">Create Auction</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auctions">Browse Auctions</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
