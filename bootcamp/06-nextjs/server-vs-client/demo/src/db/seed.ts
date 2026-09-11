import { getDB } from './dataSource';
import { CategorySchema } from './entities/category';
import { MenuItemSchema } from './entities/menuItem';
import { categories, menuItems } from './fixtures';

const db = await getDB();
const categoryRepo = db.getRepository(CategorySchema);
const menuItemRepo = db.getRepository(MenuItemSchema);

// Categories first: the menu items need their real (database) ids.
const savedCategories = new Map<string, number>();

for (const category of categories) {
  const existing = await categoryRepo.findOneBy({ name: category.name });
  const saved = await categoryRepo.save({
    name: category.name,
    ...(existing && { id: existing.id }),
  });
  savedCategories.set(saved.name, saved.id);
}

for (const item of menuItems) {
  const existing = await menuItemRepo.findOneBy({ name: item.name });
  const categoryId = item.category && savedCategories.get(item.category.name);

  await menuItemRepo.save({
    ...item,
    ...(existing && { id: existing.id }),
    ...(categoryId && { category: { id: categoryId } }),
  });
}

console.log(
  `Seeded ${categories.length} categories and ${menuItems.length} menu items.`,
);

await db.destroy();
