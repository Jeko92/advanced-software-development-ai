import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
}

const favoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((favoriteId) => favoriteId !== id)
            : [...state.ids, id],
        })),
    }),
    {
      name: 'favorites-storage',
      skipHydration: true,
    },
  ),
);

let rehydrated = false;

export function useFavoritesStore<T>(
  selector: (state: FavoritesState) => T,
): T {
  useEffect(() => {
    if (!rehydrated) {
      rehydrated = true;
      favoritesStore.persist.rehydrate();
    }
  }, []);

  return favoritesStore(selector);
}
