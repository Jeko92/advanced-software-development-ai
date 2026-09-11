# Next.js Tailwind and shadcn - shadcn/ui Components

With shadcn initialized, you add components one at a time, only the ones you need. Each `add` command copies a component's source into `components/ui`, where you import it like any local component and style it with the Tailwind you already know.

## Adding Components

You pull in a component with the CLI, naming the one you want:

```bash
npx shadcn@latest add button
```

You find the new component in `components/ui/button.tsx`, and shadcn installs any dependencies it needs. From now on this component is just a file you import with the `@/` alias:

```tsx
import { Button } from "@/components/ui/button";
```

You add components as you reach for them, so the folder only ever holds what the app actually uses. Let's take a look at a few common components that make up every app.

## Button

The `Button` renders a styled, accessible button and accepts a `variant` prop that switches its appearance. The variants come predefined in the component file: `default`, `secondary`, `outline`, `ghost`, and `destructive`. A delete action reads well as `destructive`, which gives it the danger color:

```tsx
import { Button } from "@/components/ui/button";

<Button>Accept</Button>
<Button variant="outline">Details</Button>
<Button variant="destructive">Cancel delivery</Button>
```

There is one prop worth knowing early. `asChild` passes the button’s styles on to its child element, instead of rendering the actual `<button>` element. In the context of Next.js, this is how you make a  `<Link>` look like a button while staying a real link, which matters for navigation and accessibility:

```tsx
import Link from "next/link";

<Button asChild>
  <Link href="/deliveries/new">New delivery</Link>
</Button>;
```

## Card

`Card` is a set of layout components for a bordered, padded container, the right shape for one delivery in a list. It comes as a family: `Card` is the wrapper, with `CardHeader`, `CardTitle`, `CardContent`, and `CardFooter` for the regions inside it.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Bakery to Clock Tower</CardTitle>
  </CardHeader>
  <CardContent>Status: active</CardContent>
</Card>;
```

You compose the parts you need and leave out the ones you do not. The card already carries its border, padding, and background color from the theme tokens, so it looks right with no extra classes, and you add Tailwind utilities when you want to adjust it.

## Select

The native `<select>` in the deliveries filter works but cannot be styled to match the rest of the app, and it looks different in every browser. Shadcn's `Select` replaces it with a fully styled dropdown that still behaves correctly for keyboard and screen-reader users. It is built from several parts that mirror how a dropdown is structured:

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

<Select value={status} onValueChange={setStatus}>
  <SelectTrigger>
    <SelectValue placeholder="Filter by status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="fulfilled">Fulfilled</SelectItem>
  </SelectContent>
</Select>;
```

The parts map onto the pieces of a dropdown:

- `SelectTrigger` is the box the user clicks, with `SelectValue` showing the current choice or a placeholder
- `SelectContent` is the panel that opens, holding one `SelectItem` per option
- `value` and `onValueChange` on the outer `Select` control the selection, replacing the native `value` and `onChange`

One thing carries over from the previous session: `Select` uses state and click handling, so it only works inside a client component. The `DeliveryFilter` from before already has `"use client"` at the top, which is exactly where this belongs. Swapping the native `<select>` for this one is a drop-in change inside that existing client component.

## Inputs for the form

The new-delivery form used bare `<input>` elements. `Input` and `Label` give them consistent styling and tie the label to its field for accessibility:

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="grid gap-2">
  <Label htmlFor="pickup">Pickup</Label>
  <Input id="pickup" name="pickup" placeholder="Bakery" />
</div>;
```

## Editing a component

When you take a look inside a component, the view can be a bit daunting at the beginning. If you look closely, you can make out all the tailwind classes used to style the elements as well as the `cn` helper and `cva` variants. The content of the Button component for example should look something like this:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center (... and so on)",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted (...)",
        secondary: "bg-secondary text-secondary-foreground (...)",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted (...)",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 (...)",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "(...)",
        xs: "(...)",
        sm: "(...)",
        lg: "(...)",
        "icon-xs": "(...)",
        "icon-sm": "(...)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

As an example, we can extend the `buttonVariants` with a new token for the `brand` variant:

```tsx

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center (... and so on)",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        brand: "bg-brand text-brand-foreground hover:bg-brand/80",
        ...
      }
  });
```

Now `<Button variant="brand">` works across the app (remember to re-add the `brand` color variables to the globals.css if they got overwritten).

## Resources

[Button](https://ui.shadcn.com/docs/components/button)

[Card](https://ui.shadcn.com/docs/components/card)

[Select](https://ui.shadcn.com/docs/components/select)

[Input](https://ui.shadcn.com/docs/components/input)
