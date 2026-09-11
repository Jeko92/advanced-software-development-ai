import { menuItems } from '@/db/fixtures';
import type { MenuItem } from '@/db/fixtures';

export async function getAllMenuItems(): Promise<MenuItem[]> {
  return menuItems;
}

export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return menuItems.find((item) => item.id === id) ?? null;
}

export async function checkMenuItem(id: number) {
  return menuItems.findIndex((item) => item.id === id) !== -1;
}
