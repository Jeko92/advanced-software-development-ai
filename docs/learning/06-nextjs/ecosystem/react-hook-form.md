# Next.js Ecosystem - react-hook-form

When you wire a form to `useState`, every keystroke triggers a re-render. Depending on your situation, this can lead to massive performance penalties.

react-hook-form tracks inputs through refs instead of state, so the component does not re-render while the user types. Re-renders happen when validation fires or the form submits. The hook returns a function called `register` for connecting inputs to the form, `handleSubmit` for wrapping submission with validation, and `formState` for reading errors and submission state.

## `useForm` and registering inputs

`useForm` sets up the form and returns the tools you need to connect it to your markup. The key return value for connecting inputs is `register`.

```tsx
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  quantity: number;
};

function AddItemForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Item name" />
      <input {...register("quantity")} type="number" placeholder="Quantity" />
      <button type="submit">Add item</button>
    </form>
  );
}
```

`FormValues` describes the shape of the data the form produces: a `name` string and a `quantity` number. Passing it as the type argument to `useForm<FormValues>()` is what gives you type safety across the rest of the hook. `register` now only accepts field names that exist on `FormValues`, and the `data` argument in `onSubmit` is typed as `FormValues` rather than `any`.

Spreading `{...register('name')}` onto an input element attaches the field name, a ref, and internal event handlers. You do not write `value` or `onChange` yourself. react-hook-form handles that through the ref. The string passed to `register` becomes the key for that field's value in the submitted data object.

## Validation rules

Validation rules are passed as the second argument to `register`. They run when the form is submitted and, after a first failed submission, as the user changes the field.

```tsx
<input
  {...register('name', {
    required: 'Item name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
  })}
  placeholder="Item name"
/>

<input
  {...register('quantity', {
    required: 'Quantity is required',
    min: { value: 1, message: 'Quantity must be at least 1' },
    valueAsNumber: true,
  })}
  type="number"
  placeholder="Quantity"
/>
```

The built-in rules are:

- `required` — marks the field as mandatory; the value you provide becomes the error message
- `minLength` / `maxLength` — enforce character length constraints on string inputs
- `min` / `max` — enforce numeric range constraints
- `pattern` — tests the value against a regular expression
- `valueAsNumber` — casts the raw DOM string to a number before validation and submission, which matters for `type="number"` inputs where the DOM always returns a string

## `handleSubmit`

`handleSubmit` is a wrapper you pass to the form's `onSubmit`. It runs validation first. If any field fails its rules, your handler is not called and the errors are written to `formState.errors`. If all fields pass, your handler receives a single object containing all the field values.

```tsx
function onSubmit(data: FormValues) {
  console.log(data);
  // { name: 'Coffee filters', quantity: 3 }
}

return <form onSubmit={handleSubmit(onSubmit)}>{/* ... */}</form>;
```

The keys in `data` match the strings you passed to each `register` call. If you registered a field as `register('name')`, the submitted value is at `data.name`.

## Displaying errors

Validation errors are available at `formState.errors`, an object keyed by field name. Each error has a `message` property containing the string you provided to the failing rule.

```tsx
function AddItemForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", {
          required: "Item name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
        })}
        placeholder="Item name"
      />
      {errors.name && <p>{errors.name.message}</p>}

      <input
        {...register("quantity", {
          required: "Quantity is required",
          min: { value: 1, message: "Quantity must be at least 1" },
          valueAsNumber: true,
        })}
        type="number"
        placeholder="Quantity"
      />
      {errors.quantity && <p>{errors.quantity.message}</p>}

      <button type="submit">Add item</button>
    </form>
  );
}
```

The error paragraph is only rendered when `errors.name` exists. When validation passes, the field's error entry is `undefined` and the element is not shown. In the next section, the `console.log` in `onSubmit` is replaced with a call to a Zustand store action that persists the submitted item.

## Resources

- [react-hook-form documentation](https://react-hook-form.com/)
- [useForm API reference](https://react-hook-form.com/docs/useform)
- [Built-in validation rules](https://react-hook-form.com/docs/useform/register)
