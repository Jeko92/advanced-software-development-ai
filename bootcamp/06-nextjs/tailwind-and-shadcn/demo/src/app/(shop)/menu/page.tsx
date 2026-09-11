import MenuNavigation from '@/components/MenuNavigation';
import MenuSearchbar from '@/components/MenuSearchbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
            <Card>
              <CardHeader>
                <CardTitle>
                  <h2 className="font-bold">{item.name} </h2>
                  <span
                    className={`bg-[attr(data-bg_type(<color>))] px-2 py-1 rounded-full text-sm text-black/80 `}
                    data-bg={item.category.color}
                  >
                    {item.category.name}
                  </span>
                  <span
                    className={`bg-(--tag-bg) px-2 py-1 rounded-full text-sm text-black/80 `}
                    style={{ '--tag-bg': item.category.color }}
                  >
                    {item.category.name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/menu/${item.id}`}>more info →</Link>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </main>
  );
}
