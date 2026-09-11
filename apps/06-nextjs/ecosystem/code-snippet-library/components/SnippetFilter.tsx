'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Snippet } from '@/lib/services/snippetsService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { LanguageBadge } from '@/components/LanguageBadge';
import { FavoriteButton } from '@/components/FavoriteButton';

const languages: Snippet['language'][] = ['CSS', 'JavaScript', 'TypeScript'];

export const SnippetFilter = ({ snippets }: { snippets: Snippet[] }) => {
  const [language, setLanguage] = useState<Snippet['language'] | 'all'>('all');

  const visible =
    language === 'all'
      ? snippets
      : snippets.filter((snippet) => snippet.language === language);

  return (
    <div className="flex flex-col gap-6">
      <Select
        value={language}
        onValueChange={(value) =>
          setLanguage(value as Snippet['language'] | 'all')
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {languages.map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((snippet) => (
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
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    {snippet.description}
                  </p>
                  <pre className="max-h-24 overflow-hidden rounded-xl bg-code p-3 font-mono text-xs text-code-foreground">
                    <code>{snippet.code}</code>
                  </pre>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
