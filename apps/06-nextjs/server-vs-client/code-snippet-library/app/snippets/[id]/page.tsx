import Link from 'next/link';
import { getSnippetById } from '@/lib/services/snippetsService';

const SnippetDetailPage = async ({ params }: PageProps<'/snippets/[id]'>) => {
  const { id } = await params;
  const snippet = await getSnippetById(id);

  if (!snippet) {
    throw new Error(`No snippet found with id "${id}".`);
  }

  return (
    <div>
      <h1>{snippet.title}</h1>
      <p>{snippet.language}</p>
      <p>{snippet.description}</p>
      <pre>
        <code>{snippet.code}</code>
      </pre>
      <Link href="/snippets">Back to all snippets</Link>
    </div>
  );
};

export default SnippetDetailPage;
