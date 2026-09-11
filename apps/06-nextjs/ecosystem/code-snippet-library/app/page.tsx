import Link from 'next/link';
import { getAllSnippets } from '@/lib/services/snippetsService';
import { LanguageBadge } from '@/components/LanguageBadge';
import { Button } from '@/components/ui/button';

const Home = async () => {
  const snippets = await getAllSnippets();
  const [featured] = snippets;

  return (
    <section className="flex flex-col gap-6 px-6 py-16 md:px-16 md:py-24">
      <h1 className="text-3xl font-semibold md:text-4xl">
        Code Snippet Library
      </h1>
      <p className="max-w-[46ch] text-muted-foreground">
        {snippets.length} small, reusable pieces of code — saved once, copied
        whenever you need them again.
      </p>
      {featured && (
        <div className="max-w-160 overflow-hidden rounded-2xl bg-code text-code-foreground">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="text-sm font-medium">{featured.title}</span>
            <LanguageBadge language={featured.language} />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm">
            <code>{featured.code}</code>
          </pre>
        </div>
      )}
      <Button asChild size="lg" className="self-start">
        <Link href="/snippets">Browse snippets</Link>
      </Button>
    </section>
  );
};

export default Home;
