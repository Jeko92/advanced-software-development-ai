import MyClientComponent from '@/components/MyClientComponent';
import MyServerComponent from '@/components/MyServerComponent';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h1>Coffee Nerds</h1>
      <Link href="/menu">To the Menu</Link>
      <MyClientComponent>
        <MyServerComponent value="value from server" />
      </MyClientComponent>
    </>
  );
}
