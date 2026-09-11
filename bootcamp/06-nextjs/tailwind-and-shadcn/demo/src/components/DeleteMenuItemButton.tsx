import { deleteMenuItem } from '@/app/(shop)/menu/actions';

export default function DeleteMenuItemButton({ id }: { id: number }) {
  // async function handleDelete() {
  //   "use server";
  //   await deleteMenuItem(id);
  // }

  // return (
  //   <form action={deleteMenuItem.bind(null, id)}>
  //     <button>Delete</button>
  //   </form>
  // );

  return (
    <form action={deleteMenuItem}>
      <input type="hidden" name="id" value={id} />
      <button>Delete</button>
    </form>
  );
}
