import { getDB } from '@/db/dataSource';
import { MenuItemSchema } from '@/db/entities/menuItem';
import type { MenuItem } from '@/db/entities/menuItem';
import { ILike } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';

export type QueryOptions = {
  query?: string | undefined;
  categoryId?: number | undefined;
};

export async function getAllMenuItems({
  query,
  categoryId,
}: QueryOptions = {}): Promise<MenuItem[]> {
  const db = await getDB();

  const where: FindOptionsWhere<MenuItem> = {};

  if (query) {
    where.name = ILike(`%${query}%`);
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  return db.getRepository(MenuItemSchema).find({
    where,
    relations: { category: true },
  });
}

export async function saveMenuItem(item: Omit<MenuItem, 'id' | 'category'>) {
  const db = await getDB();
  return db.getRepository(MenuItemSchema).save(item);
}

export async function removeMenuItem(id: number) {
  const db = await getDB();
  return await db.getRepository(MenuItemSchema).delete({ id });
}

export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  const db = await getDB();
  return db
    .getRepository(MenuItemSchema)
    .findOne({ where: { id }, relations: { category: true } });
}

export async function checkMenuItem(id: number): Promise<boolean> {
  const db = await getDB();
  return db.getRepository(MenuItemSchema).existsBy({ id });
}
