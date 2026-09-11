import Link from 'next/link';
import { getAllSnippets } from '@/lib/services/snippetsService';

export const SnippetsPage = async () => {
  const snippets = await getAllSnippets();

  return (
    <div>
      <h1>Code Snippets</h1>
      <ul>
        {snippets.map((snippet) => (
          <li key={snippet.id}>
            <h2>
              <Link href={`/snippets/${snippet.id}`}>{snippet.title}</Link>
            </h2>
            <p>{snippet.language}</p>
            <p>{snippet.description}</p>
            <pre>
              <code>{snippet.code}</code>
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SnippetsPage;
