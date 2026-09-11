import { getAllMenuItems } from '@/services/menuService';
import Link from 'next/link';

export default async function MenuPage() {
  const items = await getAllMenuItems();
  return (
    <main>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <article>
              <h2>{item.name}</h2>
              <Link href={`/menu/${item.id}`}>more info →</Link>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
