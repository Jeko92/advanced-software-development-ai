import Link from 'next/link';
import { getAllSnippets } from '@/lib/services/snippetsService';
import { SnippetFilter } from '@/components/SnippetFilter';
import { Suspense } from 'react';
import Loading from '@/app/snippets/loading';

const SnippetsList = async () => {
  const snippets = await getAllSnippets();

  return <SnippetFilter snippets={snippets} />;
};

const SnippetsPage = async () => {
  return (
    <div>
      <h1>Code Snippets</h1>
      <Link href="/snippets/new">New Snippet (full page)</Link>
      <Suspense fallback={<Loading />}>
        <SnippetsList />
      </Suspense>
    </div>
  );
};

export default SnippetsPage;
