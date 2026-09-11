import MenuNavigation from '@/components/MenuNavigation';
import MenuSearchbar from '@/components/MenuSearchbar';
import { getAllMenuItems } from '@/services/menuService';
import Link from 'next/link';

interface QueryDto {
  query?: string | undefined;
  category_id?: string | undefined;
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<QueryDto>;
}) {
  const { query, category_id } = await searchParams;

  const items = await getAllMenuItems({
    categoryId: Number(category_id),
    query,
  });

  return (
    <main>
      <div className="flex-row">
        <MenuNavigation activeCategoryId={Number(category_id) || undefined} />
        <MenuSearchbar currentQuery={query} />
      </div>
      <Link href="/menu/new">New Item</Link>
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
