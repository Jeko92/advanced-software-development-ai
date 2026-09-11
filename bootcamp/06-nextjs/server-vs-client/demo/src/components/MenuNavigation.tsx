import { getAllCategories } from '@/services/categoryService';
import Link from 'next/link';

export default async function MenuNavigation({
  activeCategoryId,
}: {
  activeCategoryId?: number | undefined;
}) {
  const categories = await getAllCategories();

  return (
    <nav>
      <ul className="navigation">
        <li>
          <Link
            className={
              activeCategoryId === undefined ? 'navigation-item__active' : ''
            }
            href="/menu"
          >
            All
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              className={
                activeCategoryId === category.id
                  ? 'navigation-item__active'
                  : ''
              }
              href={`/menu?category_id=${category.id}`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
