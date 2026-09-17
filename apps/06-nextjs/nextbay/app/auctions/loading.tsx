import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Skeleton className="h-96 rounded-xl" />
          </aside>
          <div className="flex-1">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                  <Skeleton className="aspect-[4/3] rounded-none" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
