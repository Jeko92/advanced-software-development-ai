import Link from 'next/link';
import styles from './page.module.css';
import { HomePage } from '@/components/HomePage';

export default function Home() {
  return (
    <div className={styles['page']}>
      <main className={styles['main']}>
        <HomePage />
        <nav>
          <Link href="/deliveries">View all deliveries</Link>
        </nav>
      </main>
    </div>
  );
}
