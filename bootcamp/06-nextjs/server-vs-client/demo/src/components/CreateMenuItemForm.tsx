'use client';
import { createMenuItem, type FormState } from '@/app/(shop)/menu/actions';
import type { Category } from '@/db/entities/category';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const initial: FormState = {};

export default function CreateMenuItemForm({
  categories,
}: {
  categories: Category[];
}) {
  const [state, handleCreateItem] = useActionState(
    (_prevState: FormState, formData: FormData) => {
      return createMenuItem(formData); // crossing the boundary to the server
    },
    initial,
  );

  return (
    <form action={handleCreateItem} className="menu-form">
      <div className="form-item">
        <label>
          Name
          <input name="name" defaultValue={state.values?.name} />
        </label>
        {state.errors?.name && <p role="alert">{state.errors.name}</p>}
      </div>

      <div className="form-item">
        <label>
          Description
          <textarea
            name="description"
            defaultValue={state.values?.description}
          />
        </label>
        {state.errors?.description && (
          <p role="alert">{state.errors.description}</p>
        )}
      </div>

      <div className="form-item">
        <label>
          Price
          <input name="price" defaultValue={state.values?.price} />
        </label>
        {state.errors?.price && <p role="alert">{state.errors.price}</p>}
      </div>

      <div className="form-item">
        <label>
          Category
          <select name="categoryId" defaultValue={state.values?.categoryId}>
            {categories?.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        {state.errors?.categoryId && (
          <p role="alert">{state.errors.categoryId}</p>
        )}
      </div>

      <SubmitButton />
      {state.success && <p role="status">Saved.</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Create'}
    </button>
  );
}
