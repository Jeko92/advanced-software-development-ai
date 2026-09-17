'use client'

import { Button } from '@/components/ui/button'

export default function AuctionsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-lg font-medium text-foreground">Couldn&apos;t load auctions</p>
      <p className="text-sm text-muted-foreground max-w-sm">
        DarkBay might be waking up from a nap (Render free tier) or briefly unavailable. Try again in a moment.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
