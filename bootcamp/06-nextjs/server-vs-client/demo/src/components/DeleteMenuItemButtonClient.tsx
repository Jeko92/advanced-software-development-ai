'use client';
import { deleteMenuItem } from '@/app/(shop)/menu/actions';

export default function DeleteMenuItemButton({ id }: { id: number }) {
  return (
    <button
      onClick={() => {
        const formData = new FormData();
        formData.set('id', String(id));
        void deleteMenuItem(formData);
      }}
    >
      Delete
    </button>
  );
}
