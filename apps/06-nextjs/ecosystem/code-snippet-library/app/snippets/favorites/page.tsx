'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFavoritesStore } from '@/lib/store/useFavoritesStore';
import { getSnippetsByIdsAction } from '@/lib/actions/snippets';
import type { Snippet } from '@/lib/services/snippetsService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LanguageBadge } from '@/components/LanguageBadge';
import { FavoriteButton } from '@/components/FavoriteButton';

const FavoritesPage = () => {
  const ids = useFavoritesStore((state) => state.ids);
  const [snippets, setSnippets] = useState<Snippet[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    getSnippetsByIdsAction(ids).then((result) => {
      if (!cancelled) {
        setSnippets(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (snippets === null) {
    return <p>Loading favorites...</p>;
  }

  if (snippets.length === 0) {
    return <p>No favorites yet. Star a snippet to see it here.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">Favorites</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {snippets.map((snippet) => (
          <li key={snippet.id}>
            <Link href={`/snippets/${snippet.id}`} className="block">
              <Card className="transition-colors hover:bg-brand/10">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="font-sans text-base font-semibold">
                    {snippet.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <LanguageBadge language={snippet.language} />
                    <FavoriteButton snippetId={snippet.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {snippet.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
