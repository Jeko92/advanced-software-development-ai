'use client';

import { useRecentlyViewedStore } from '@/lib/store/useRecentlyViewedStore';

export const RecentlyViewedBadge = () => {
  const count = useRecentlyViewedStore((state) => state.ids.length);

  if (count === 0) {
    return null;
  }

  return <span className="text-sm">👀 {count} recently viewed</span>;
};
