'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Snippet } from '@/lib/services/snippetsService';

const languages: Snippet['language'][] = ['CSS', 'JavaScript', 'TypeScript'];

export const SnippetFilter = ({ snippets }: { snippets: Snippet[] }) => {
  const [language, setLanguage] = useState<Snippet['language'] | 'all'>('all');

  const visible =
    language === 'all'
      ? snippets
      : snippets.filter((snippet) => snippet.language === language);

  return (
    <div>
      <select
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value as Snippet['language'] | 'all')
        }
      >
        <option value="all">All</option>
        {languages.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ul>
        {visible.map((snippet) => (
          <li key={snippet.id}>
            <Link href={`/snippets/${snippet.id}`}>
              {snippet.title}, {snippet.description},{' '}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
