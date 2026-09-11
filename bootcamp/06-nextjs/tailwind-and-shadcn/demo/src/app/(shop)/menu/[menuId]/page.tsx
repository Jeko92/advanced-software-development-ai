import { checkMenuItem, getMenuItemById } from '@/services/menuService';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loadingContent';
import DeleteMenuItemButton from '@/components/DeleteMenuItemButton';

export default async function DetailsPage({
  params,
}: PageProps<'/menu/[menuId]'>) {
  const { menuId } = await params;

  // cheap database check
  if (!(await checkMenuItem(Number(menuId)))) {
    return notFound();
  }

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <PageContent id={Number(menuId)} />
      </Suspense>
      <DeleteMenuItemButton id={Number(menuId)} />
    </main>
  );
}

async function PageContent({ id }: { id: number }) {
  const menuItem = await getMenuItemById(Number(id)); // heavy work, takes long

  if (!menuItem) {
    throw new Error('something went wrong');
  }

  return (
    <>
      <h1>Details for {menuItem.name}</h1>
      <Image
        className="menu-item-image"
        src={menuItem.imageUrl ?? '/images/menu/default.svg'}
        alt={menuItem.name}
        width={160}
        height={120}
        loading="eager"
      />
      <p>{menuItem.description}</p>
      <p>${menuItem.priceCents / 100}</p>
      <Link href="/menu">← Back to the Menu</Link>
    </>
  );
}
