import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface RecentlyViewedState {
  ids: string[];
  addView: (id: string) => void;
}

const MAX_RECENT = 5;

const recentlyViewedStore = create<RecentlyViewedState>()(
  immer(
    persist(
      (set) => ({
        ids: [],
        addView: (id) =>
          set((state) => {
            const existingIndex = state.ids.indexOf(id);
            if (existingIndex !== -1) {
              state.ids.splice(existingIndex, 1);
            }
            state.ids.unshift(id);
            if (state.ids.length > MAX_RECENT) {
              state.ids.length = MAX_RECENT;
            }
          }),
      }),
      {
        name: 'recently-viewed-storage',
        skipHydration: true,
      },
    ),
  ),
);

let rehydrated = false;

export function useRecentlyViewedStore<T>(
  selector: (state: RecentlyViewedState) => T,
): T {
  useEffect(() => {
    if (!rehydrated) {
      rehydrated = true;
      recentlyViewedStore.persist.rehydrate();
    }
  }, []);

  return recentlyViewedStore(selector);
}
