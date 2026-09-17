import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { AuctionCard } from '@/components/auctions/auction-card'
import { auctionsService } from '@/lib/services/auctions-service'
import { getDecorativeImage } from '@/lib/decorative-images'

export default async function HomePage() {
  const [{ data: auctions, meta: openMeta }, { meta: allMeta }] = await Promise.all([
    auctionsService.getAuctions({ status: 'open', sort: 'ending-soon', limit: 4 }),
    auctionsService.getAuctions({ limit: 1 }),
  ])

  const heroAuction = auctions[0]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="relative w-full h-[80vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card z-0" />

          {heroAuction && (
            <div className="absolute inset-0 z-0">
              <Image
                src={getDecorativeImage(heroAuction.id)}
                alt="Featured Auction"
                fill
                sizes="100vw"
                priority
                className="object-cover opacity-10 grayscale-100"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background z-10" />

          <div className="relative z-20 max-w-4xl mx-auto px-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
              Curated Auction Marketplace
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
              Discover Rare Objects
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore a carefully selected collection of premium items. Place your offer and own extraordinary pieces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/auctions">Explore auctions</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-w-[200px]">
                <Link href="/#how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{openMeta.total}</p>
                <p className="text-sm text-muted-foreground">Open Auctions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{allMeta.total}</p>
                <p className="text-sm text-muted-foreground">Total Listings</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background" id="featured">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Featured Auctions</h2>
                <p className="text-muted-foreground mt-1">Exceptional pieces. Exceptional opportunities.</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/auctions">View All Auctions</Link>
              </Button>
            </div>

            {auctions.length === 0 ? (
              <p className="text-muted-foreground">No open auctions right now — check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {auctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-muted/50" id="how-it-works">
          <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">How DarkBay Works</h2>
              <p className="text-muted-foreground mt-2">A simple, transparent process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Discover</h3>
                <p className="text-sm text-muted-foreground">
                  Browse a curated collection of rare objects and premium items.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Place an Offer</h3>
                <p className="text-sm text-muted-foreground">
                  Bid on items you love. Offers must exceed the current price.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Win the Object</h3>
                <p className="text-sm text-muted-foreground">
                  Highest offer at auction close wins. Simple and transparent.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="container max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">Ready to Discover Extraordinary Objects?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join DarkBay and start exploring the collection.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auctions">Explore Auctions</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
