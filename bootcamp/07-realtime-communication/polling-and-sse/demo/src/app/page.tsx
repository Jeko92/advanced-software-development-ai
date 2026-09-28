import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 gap-3 items-start justify-center px-10 bg-zinc-50 font-sans">
      <h1 className="text-2xl font-bold">Polling Methods</h1>
      <div className="flex flex-col gap-3">
        <Link href="/short-polling">Short Polling</Link>
        <Link href="/long-polling">Long Polling</Link>
        <Link href="/server-sent-events">Server Sent Events</Link>
      </div>
    </div>
  );
}
