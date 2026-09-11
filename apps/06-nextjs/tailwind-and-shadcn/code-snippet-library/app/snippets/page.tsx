import Link from 'next/link';
import { getAllSnippets } from '@/lib/services/snippetsService';
import { SnippetFilter } from '@/components/SnippetFilter';
import { Suspense } from 'react';
import Loading from '@/app/snippets/loading';
import { Button } from '@/components/ui/button';

const SnippetsList = async () => {
  const snippets = await getAllSnippets();

  return <SnippetFilter snippets={snippets} />;
};

const SnippetsPage = async () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Code Snippets</h1>
        <Button asChild>
          <Link href="/snippets/new">New Snippet (full page)</Link>
        </Button>
      </div>
      <Suspense fallback={<Loading />}>
        <SnippetsList />
      </Suspense>
    </div>
  );
};

export default SnippetsPage;
