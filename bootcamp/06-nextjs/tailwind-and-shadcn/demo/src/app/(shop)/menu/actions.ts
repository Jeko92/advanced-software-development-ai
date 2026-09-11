'use server';
import { getAllCategories } from '@/services/categoryService';
import { removeMenuItem, saveMenuItem } from '@/services/menuService';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type FormState = {
  errors?: {
    name?: string;
    price?: string;
    description?: string;
    categoryId?: string;
  };
  values?: {
    name: string;
    price: number;
    description: string;
    categoryId: number;
  };
  success?: boolean;
};

export async function createMenuItem(formData: FormData): Promise<FormState> {
  const categories = await getAllCategories();

  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const categoryId = Number(formData.get('categoryId') ?? '');
  const price = Number(formData.get('price') ?? '');

  const errors: FormState['errors'] = {};
  if (name.length < 3) {
    errors.name = 'At least 3 characters.';
  }
  if (isNaN(price) || price <= 0) {
    errors.price = 'Not a valid price.';
  }
  if (description.length < 3) {
    errors.description = 'At least 3 characters.';
  }
  if (!categories.find((c) => c.id === Number(categoryId)))
    errors.categoryId = 'Category not found.';

  if (Object.keys(errors).length > 0) {
    return { errors, values: { name, price, description, categoryId } };
  }

  await saveMenuItem({
    name,
    priceCents: price * 100,
    description,
    categoryId,
  });
  revalidatePath('/menu');
  return { success: true };
}

export async function deleteMenuItem(formData: FormData) {
  const id = Number(formData.get('id') ?? '');
  if (isNaN(id)) return;

  await removeMenuItem(id);
  revalidatePath('/menu');
  redirect('/menu');
}
