'use client';

import { useFavoritesStore } from '@/lib/store/useFavoritesStore';
import { Button } from '@/components/ui/button';

export const FavoriteButton = ({ snippetId }: { snippetId: string }) => {
  const isFavorite = useFavoritesStore((state) =>
    state.ids.includes(snippetId),
  );
  const toggle = useFavoritesStore((state) => state.toggle);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={(event) => {
        event.preventDefault();
        toggle(snippetId);
      }}
    >
      {isFavorite ? '★ Favorited' : '☆ Favorite'}
    </Button>
  );
};
