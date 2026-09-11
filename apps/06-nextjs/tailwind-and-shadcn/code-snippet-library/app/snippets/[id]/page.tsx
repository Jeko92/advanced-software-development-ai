import Link from 'next/link';
import { getSnippetById } from '@/lib/services/snippetsService';
import { LanguageBadge } from '@/components/LanguageBadge';
import { CopySnippetButton } from '@/components/CopySnippetButton';
import { Button } from '@/components/ui/button';

const SnippetDetailPage = async ({ params }: PageProps<'/snippets/[id]'>) => {
  const { id } = await params;
  const snippet = await getSnippetById(id);

  if (!snippet) {
    throw new Error(`No snippet found with id "${id}".`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">{snippet.title}</h1>
          <p className="text-muted-foreground">{snippet.description}</p>
        </div>
        <LanguageBadge language={snippet.language} />
      </div>
      <div className="overflow-hidden rounded-2xl bg-code text-code-foreground">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-xs text-white/60">{snippet.language}</span>
          <CopySnippetButton code={snippet.code} />
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-sm">
          <code>{snippet.code}</code>
        </pre>
      </div>
      <Button variant="outline" asChild className="self-start">
        <Link href="/snippets">Back to all snippets</Link>
      </Button>
    </div>
  );
};

export default SnippetDetailPage;
