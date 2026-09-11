import { EntitySchema } from 'typeorm';
import type { MenuItem } from './menuItem';

export interface Category {
  id: number;
  name: string;
  color: string;
  menuItems?: MenuItem[];
}

export const CategorySchema = new EntitySchema<Category>({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: { type: Number, primary: true, generated: true },
    name: { type: String, length: 60, unique: true },
    color: { type: String, length: 7, nullable: true },
  },
  relations: {
    menuItems: {
      target: 'MenuItem',
      type: 'one-to-many',
      inverseSide: 'category',
    },
  },
});
