import { EntitySchema } from 'typeorm';
import type { Category } from './category';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string | null;
  category?: Category;
  categoryId?: number;
}

export const MenuItemSchema = new EntitySchema<MenuItem>({
  name: 'MenuItem',
  tableName: 'menu_items',
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String, length: 120 },
    priceCents: { type: 'decimal', precision: 10, scale: 2 },
    description: { type: String, length: 500 },
    imageUrl: { type: String, nullable: true },
    categoryId: { type: Number, name: 'category_id', nullable: true },
  },
  relations: {
    category: {
      target: 'Category',
      type: 'many-to-one',
      inverseSide: 'menuItems',
      joinColumn: { name: 'category_id' },
      nullable: true,
      onDelete: 'SET NULL',
    },
  },
});
