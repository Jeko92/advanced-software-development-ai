import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="font-heading text-4xl">Page not found</h1>
      <p className="max-w-[40ch] text-muted-foreground">
        There&apos;s no page at this address. It may have moved, or the link
        might be off.
      </p>
      <Button variant="brand" asChild className="mt-2">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
