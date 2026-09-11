'use client';
import { createMenuItem, type FormState } from '@/app/(shop)/menu/actions';
import type { Category } from '@/db/entities/category';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Field, FieldLabel, FieldError, FieldGroup } from './ui/field';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

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
    <form action={handleCreateItem}>
      <FieldGroup>
        <Field data-invalid={state.errors?.name !== undefined}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            aria-invalid={state.errors?.name !== undefined}
            defaultValue={state.values?.name}
          />
          <FieldError>{state.errors?.name && state.errors.name}</FieldError>
        </Field>

        <Field className="group p-3 border border-black has-user-invalid:border-red-500">
          <FieldLabel className="flex flex-col gap-1">Description</FieldLabel>
          <Textarea
            name="description"
            className=" bg-accent py-1 px-2 rounded-sm"
            defaultValue={state.values?.description}
            minLength={3}
          />
          <FieldError>{state.errors?.description}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Price</FieldLabel>
          <Input
            name="price"
            defaultValue={state.values?.price}
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
          />
          <FieldError>{state.errors?.price}</FieldError>
        </Field>

        <div className="p-3 border border-black">
          <label className="flex flex-col gap-1">
            <span className="">Category</span>
            <select
              className="bg-accent py-1 px-2 rounded-sm"
              name="categoryId"
              defaultValue={state.values?.categoryId}
            >
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
      </FieldGroup>

      <SubmitButton />
      {state.success && <p role="status">Saved.</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="px-4 py-2 border-2 border-black rounded-md cursor-pointer"
      type="submit"
      disabled={pending}
    >
      {pending ? 'Saving…' : 'Create'}
    </button>
  );
}

/*
    <div
        className="group p-3 border-4 border-black has-user-invalid:border-red-500 has-focus:border-emerald-600  has-user-invalid:bg-red-200"
        data-state={state.errors?.name ? "error" : ""}
      >
        <label className="flex flex-col gap-1">
          <span className="group-hover:text-emerald-600">Name</span>
          <input
            name="name"
            className="bg-accent py-1 px-2 rounded-sm"
            defaultValue={state.values?.name}
            minLength={3}
          />
        </label>
        {state.errors?.name && <p role="alert">{state.errors.name}</p>}
      </div>

*/
