'use client';

import { useEffect } from 'react';
import { useRecentlyViewedStore } from '@/lib/store/useRecentlyViewedStore';

export const RecordDeliveryView = ({ deliveryId }: { deliveryId: string }) => {
  const addView = useRecentlyViewedStore((state) => state.addView);

  useEffect(() => {
    addView(deliveryId);
  }, [deliveryId, addView]);

  return null;
};
