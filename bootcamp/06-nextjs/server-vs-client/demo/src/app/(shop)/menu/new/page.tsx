import CreateMenuItemForm from '@/components/CreateMenuItemForm';
import { getAllCategories } from '@/services/categoryService';
import Link from 'next/link';

export default async function CreateMenuItem() {
  const categories = await getAllCategories();
  return (
    <>
      <Link href="/menu">← Back to the Menu</Link>
      <CreateMenuItemForm categories={categories} />
    </>
  );
}
