import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const demos = [
  {
    href: '/short-polling',
    title: 'Short polling',
    description:
      'Client asks on a fixed timer; server always answers immediately.',
  },
  {
    href: '/long-polling',
    title: 'Long polling',
    description:
      'Client asks once; server holds the request until something changes.',
  },
  {
    href: '/sse',
    title: 'Server-Sent Events',
    description: 'One connection stays open; server pushes updates down it.',
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 p-8 font-sans">
      <h1 className="text-2xl font-semibold">Delivery Service</h1>
      <p className="text-sm text-muted-foreground">
        One order, tracked three ways. Pick a technique from the sidebar.
      </p>
      {demos.map((demo) => (
        <Link key={demo.href} href={demo.href}>
          <Card className="transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle>{demo.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {demo.description}
            </CardContent>
          </Card>
        </Link>
      ))}
    </main>
  );
}
