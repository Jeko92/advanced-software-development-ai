import { EntitySchema } from 'typeorm';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  priceCents: string;
  imageUrl?: string;
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
  },
});
