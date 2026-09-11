import { getDB } from '@/db/dataSource';
import { CategorySchema } from '@/db/entities/category';

export async function getAllCategories() {
  const db = await getDB();
  return db.getRepository(CategorySchema).find();
}
