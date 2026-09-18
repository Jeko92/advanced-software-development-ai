'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState(searchParams.get('status') ?? 'all')
  const [minPrice, setMinPrice] = useState(searchParams.get('min-price') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max-price') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'default')

  const applyFilters = () => {
    const query = new URLSearchParams()
    if (status !== 'all') query.set('status', status)
    if (minPrice) query.set('min-price', minPrice)
    if (maxPrice) query.set('max-price', maxPrice)
    if (sort !== 'default') query.set('sort', sort)
    router.push(`/auctions?${query.toString()}`)
  }

  const clearFilters = () => {
    setStatus('all')
    setMinPrice('')
    setMaxPrice('')
    setSort('default')
    router.push('/auctions')
  }

  return (
    <div className="bg-card border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Filters</h2>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-foreground mb-2 block">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground mb-2 block">Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-foreground mb-2 block">Sort by end date</Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="ending-soon">Ending soon</SelectItem>
              <SelectItem value="ending-late">Ending latest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button size="sm" variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
