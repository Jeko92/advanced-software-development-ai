import Link from 'next/link';
import { getSnippetById } from '@/lib/services/snippetsService';
import { LanguageBadge } from '@/components/LanguageBadge';
import { SnippetCodeViewer } from '@/components/SnippetCodeViewer';
import { Button } from '@/components/ui/button';
import { FavoriteButton } from '@/components/FavoriteButton';

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
        <div className="flex items-center gap-2">
          <LanguageBadge language={snippet.language} />
          <FavoriteButton snippetId={snippet.id} />
        </div>
      </div>
      <SnippetCodeViewer code={snippet.code} language={snippet.language} />
      <Button variant="outline" asChild className="self-start">
        <Link href="/snippets">Back to all snippets</Link>
      </Button>
    </div>
  );
};

export default SnippetDetailPage;
