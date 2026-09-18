import { Suspense } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AuctionCard } from '@/components/auctions/auction-card'
import { FilterBar } from '@/components/auctions/filter-bar'
import { Skeleton } from '@/components/ui/skeleton'
import { auctionsService } from '@/lib/services/auctions-service'
import { cn } from '@/lib/utils'
import type { AuctionStatus, AuctionSort } from '@/types'

interface AuctionsPageProps {
  searchParams: Promise<{
    status?: string
    'min-price'?: string
    'max-price'?: string
    sort?: string
    page?: string
  }>
}

function parseStatus(value?: string): AuctionStatus | undefined {
  return value === 'open' || value === 'closed' ? value : undefined
}

function parseSort(value?: string): AuctionSort | undefined {
  return value === 'ending-soon' || value === 'ending-late' ? value : undefined
}

function parseNumber(value?: string): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export default async function AuctionsPage({ searchParams }: AuctionsPageProps) {
  const params = await searchParams
  const page = parseNumber(params.page) ?? 1

  const { data: auctions, meta } = await auctionsService.getAuctions({
    page,
    limit: 12,
    status: parseStatus(params.status),
    minPrice: parseNumber(params['min-price']),
    maxPrice: parseNumber(params['max-price']),
    sort: parseSort(params.sort),
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
              <FilterBar />
            </Suspense>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Auctions</h1>
                <p className="text-muted-foreground text-sm">{meta.total} auctions found</p>
              </div>
            </div>

            {auctions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No auctions match your filters</p>
                <Link href="/auctions" className="text-sm text-foreground hover:underline mt-2">
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}

            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pageNumber) => {
                  const query = new URLSearchParams()
                  if (params.status) query.set('status', params.status)
                  if (params['min-price']) query.set('min-price', params['min-price'])
                  if (params['max-price']) query.set('max-price', params['max-price'])
                  if (params.sort) query.set('sort', params.sort)
                  query.set('page', String(pageNumber))
                  return (
                    <Link
                      key={pageNumber}
                      href={`/auctions?${query.toString()}`}
                      className={cn(
                        'w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium border border-border',
                        pageNumber === meta.page
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {pageNumber}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
