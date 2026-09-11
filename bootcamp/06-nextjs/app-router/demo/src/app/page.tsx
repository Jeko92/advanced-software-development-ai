import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h1>Coffee Nerds</h1>
      <Link href="/menu">To the Menu</Link>
    </>
  );
}
