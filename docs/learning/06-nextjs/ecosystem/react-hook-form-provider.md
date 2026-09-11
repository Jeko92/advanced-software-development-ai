# Next.js Ecosystem - Form Provider

A form starts as one component. As it grows, you break it into smaller pieces. The moment you do that, a problem appears. `register`, `handleSubmit`, and `formState` all come from the `useForm` call in the parent. A child component that renders an input needs `register` to connect it and `formState.errors` to show validation messages, but it has no access to either. The usual answer is to pass them down as props. One level deep that is tolerable. Two or three levels deep, or across a field component reused in different forms, every input drags a list of form props behind it.

react-hook-form ships a context for exactly this. `FormProvider` takes the object `useForm` returns and puts it on React context. Any component rendered inside the provider reads the same form methods with `useFormContext`, without receiving them as props. The parent still owns the form: it calls `useForm`, decides the submit handler, and renders the `<form>` element. The children stop receiving `register` through props and pull it from context instead.

## `FormProvider`

The parent keeps the whole object `useForm` returns instead of destructuring it, then spreads that object onto `FormProvider`.

```tsx
import { FormProvider, useForm } from "react-hook-form";

type FormValues = {
  name: string;
  quantity: number;
};

function AddItemForm() {
  const methods = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NameField />
        <QuantityField />
        <button type="submit">Add item</button>
      </form>
    </FormProvider>
  );
}
```

- `methods` is the full return value of `useForm`. It holds `register`, `handleSubmit`, `formState`, and the rest, instead of pulling them out one by one.
- `<FormProvider {...methods}>` spreads that object onto the provider, so everything `useForm` produced is now on context for any descendant to read.
- `methods.handleSubmit(onSubmit)` still wires submission and validation. The parent owns the handler because it is the component that knows what to do with the submitted data.
- `<NameField />` and `<QuantityField />` don't take any props. They find what they need through context, so the parent's markup stays short even as the field components grow.

## `useFormContext`

A child component calls `useFormContext` to read the same methods the parent set up. It returns the identical object `useForm` returned, so `register` and `formState` work exactly as they did when they lived in the parent.

```tsx
import { useFormContext } from "react-hook-form";

function NameField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <>
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
    </>
  );
}
```

`useFormContext<FormValues>()` takes the same type argument as `useForm<FormValues>()`. Pass it the same type and `register` only accepts field names that exist on `FormValues`, while `errors` is typed against those fields. The field component now carries its own input, validation rules, and error message in one place, which is what makes it reusable.

`QuantityField` follows the same pattern with its own rules.

```tsx
function QuantityField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();

  return (
    <>
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
    </>
  );
}
```

## Resources

- [FormProvider and useFormContext](https://react-hook-form.com/docs/useformcontext)
- [FormProvider API reference](https://react-hook-form.com/docs/formprovider)
