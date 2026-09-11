# Implementation Guide — Tailwind & shadcn/ui on Kiki's Delivery Service

Every code example from the four handouts (`intro.md`, `tailwind-basics.md`,
`tailwind-custom-styles.md`, `shadcn-ui-setup.md`, `shadcn-ui-components.md`
— `challenges.md` excluded), mapped onto a concrete change in **this**
project. Work through the parts in order: each one builds on the files the
previous part touched, and a few things (a plain hover button, a
utility-classes-only badge) are deliberately superseded later, the same way
the chapters build on each other.

Tailwind is already installed and wired up (`postcss.config.mjs`,
`app/globals.css` → `@import 'tailwindcss';`, imported from
`app/layout.tsx`). Nothing in Part 1 needs a new dependency.

## At a glance

| Part | Handout | What lands where |
| --- | --- | --- |
| 1 | `tailwind-basics.md`, `tailwind-custom-styles.md` | Utility classes, variants, `@theme` tokens, arbitrary values — applied directly to today's bare HTML |
| 2 | `shadcn-ui-setup.md` | `npx shadcn init`, then `cn`/`cva` put to use in `StatusBadge` |
| 3 | `shadcn-ui-components.md` | `Button`, `Card`, `Select`, `Input`/`Label` replace bare elements; the `brand` token gets a real consumer |
| 4 | `intro.md` objective, mechanism from `shadcn-ui-setup.md` | Light/dark toggle |

---

## Part 1 — Tailwind on the bare HTML

### Step 1 — Home page: CSS Modules → utility classes

`tailwind-basics.md`'s opening argument is that styles-on-the-markup beat a
separate stylesheet with an invented class name — exactly the situation in
`app/page.tsx`, which still imports `page.module.css`. Its `.main` rule also
has genuinely bespoke pixel values (`padding: 120px 60px`, `48px 24px` on
mobile), which is precisely what arbitrary values (`tailwind-custom-styles.md`)
are for.

**File: `app/page.tsx`**

```tsx
import Link from 'next/link';
import { HomePage } from '@/components/HomePage';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#fafafa]">
      <main className="flex w-full max-w-[800px] flex-1 flex-col items-start justify-between bg-white px-[24px] py-[48px] md:px-[60px] md:py-[120px]">
        <nav className="flex gap-4">
          <Link href="/deliveries" className="text-blue-600 hover:underline">
            View all deliveries
          </Link>
        </nav>
        <HomePage />
      </main>
    </div>
  );
}
```

Drop the `page.module.css` import and delete the file — its styles leave
with it, the way the handout's opening paragraph describes. The `hover:underline`
on the link is a second, low-key example of the state-variant syntax
covered in Step 5.

### Step 2 — Typography and layout utilities on headings

Covers the "Typography" and "Layout" rows of the utility-classes table, and
doubles as the handout's own smoke test (`text-3xl font-bold`).

**File: `app/layout.tsx`**

```tsx
<header className="flex items-center p-4">
  <h1 className="text-3xl font-bold">Kiki&apos;s Delivery Service</h1>
</header>
```

**File: `components/HomePage.tsx`**

```tsx
export const HomePage = () => {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-bold">Kiki&apos;s Delivery Service</h1>
      <p className="text-gray-600">Fast, reliable deliveries across the city.</p>
      <Image
        src="/kiki.webp"
        alt="Kiki flying over the city on her broomstick, delivering a package"
        width={320}
        height={480}
        priority
      />
    </div>
  );
};
```

### Step 3 — Delivery list as a responsive grid of cards

This is the handout's opening example verbatim
(`flex gap-4 rounded-lg border p-4` / `text-lg font-semibold`), combined
with the responsive-grid example (`grid grid-cols-1 gap-4 md:grid-cols-3`).
The list of deliveries is the "Bakery to Clock Tower" card made real.

**File: `components/DeliveryFilter.tsx`**

```tsx
<ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
  {visible.map((delivery) => (
    <li key={delivery.id} className="rounded-lg border p-4">
      <Link href={`/deliveries/${delivery.id}`} className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">
          {delivery.pickup} to {delivery.destination}
        </h2>
        <StatusBadge status={delivery.status} />
      </Link>
    </li>
  ))}
</ul>
```

*(Superseded in Step 13, where the `<li>` becomes a shadcn `Card`.)*

### Step 4 — Color utilities on `StatusBadge`

The "Color" row of the utility table, and a component crying out for it —
`StatusBadge` currently sets its color with an inline `style`.

**File: `components/StatusBadge.tsx`**

```tsx
import type { Delivery } from '@/lib/services/deliveriesService';

const colorByStatus: Record<Delivery['status'], string> = {
  pending: 'bg-gray-200 text-gray-800',
  'in-transit': 'bg-yellow-200 text-yellow-800',
  delivered: 'bg-green-200 text-green-800',
};

export const StatusBadge = ({ status }: { status: Delivery['status'] }) => {
  return (
    <span
      className={`rounded-full px-2 py-1 text-sm font-medium ${colorByStatus[status]}`}
    >
      {status}
    </span>
  );
};
```

*(Superseded in Step 10, once `cn`/`cva` exist.)*

### Step 5 — A hover-state button

The exact `hover:` example from the handout, applied to the one plain
`<button>` in the app that toggles into a form.

**File: `components/NewDeliveryForm.tsx`**

```tsx
if (!isOpen) {
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      New delivery
    </button>
  );
}
```

*(Superseded in Step 6 — brand color — and again in Step 12, once it
becomes a shadcn `Button`.)*

### Step 6 — Brand theme tokens with `@theme`

Register the app's own color once, the same mechanism shadcn itself uses
for theming, then reuse it on the two elements that currently improvise
their own blue.

**File: `app/globals.css`**

```css
@import 'tailwindcss';

@theme {
  --color-brand: #7c3aed;
  --color-brand-muted: #a78bfa;
  --color-brand-foreground: #ffffff;
}
```

**File: `app/layout.tsx`** — give the header the brand background:

```tsx
<header className="flex items-center bg-brand p-4 text-brand-foreground">
  <h1 className="text-3xl font-bold">Kiki&apos;s Delivery Service</h1>
</header>
```

**File: `components/NewDeliveryForm.tsx`** — swap the ad-hoc blue from Step 5:

```tsx
className="rounded-md bg-brand px-4 py-2 text-brand-foreground hover:bg-brand-muted"
```

**File: `app/deliveries/page.tsx`** — the other "New delivery" entry point:

```tsx
<Link
  href="/deliveries/new"
  className="rounded-md bg-brand px-4 py-2 text-brand-foreground hover:bg-brand-muted"
>
  New delivery (full page)
</Link>
```

### Step 7 — Arbitrary values for a genuine one-off

Step 1 already used arbitrary values for the legacy padding. Here's a
second, different flavor from the handout's bullet list —
`grid-cols-[1fr_500px_2fr]` style column tracks — used exactly once for a
label/value layout that doesn't need a reusable token.

**File: `app/deliveries/[deliveryId]/page.tsx`**

```tsx
<div className="grid grid-cols-[120px_1fr] gap-2">
  <span className="font-semibold">From</span>
  <span>{delivery.pickup}</span>
  <span className="font-semibold">To</span>
  <span>{delivery.destination}</span>
  <span className="font-semibold">Status</span>
  <span>{delivery.status}</span>
</div>
```

This replaces the two `<p>` tags currently rendering that information.

### Step 8 — Custom variants: nothing to write yet

`@custom-variant theme-dark (&:where(.theme-dark *));` is the pattern —
but you won't hand-write one. `npx shadcn@latest init` in Part 2 generates
`@custom-variant dark (&:is(.dark *));` in `globals.css` for you, which is
this exact mechanism aimed at the `.dark` class. Step 17 points it out once
it exists.

---

## Part 2 — shadcn/ui setup

### Step 9 — Initialize shadcn

```bash
npx shadcn@latest init
```

Run from `bootcamp/06-nextjs/tailwind-and-shadcn/code-along`. Afterwards
you'll have `components.json`, a `lib/utils.ts` exporting `cn`, new
dependencies (`clsx`, `class-variance-authority`, `tailwind-merge`, plus
Radix/Base UI primitives), and `app/globals.css` extended with shadcn's
color variables and a `.dark` block.

⚠️ The CLI may rewrite `app/globals.css` wholesale. Check that the
`@theme` block from Step 6 is still there afterward, and re-add it right
after the `@import` line if it got clobbered — the handout calls out this
exact gotcha.

### Step 10 — Put `cn` and `cva` to work in `StatusBadge`

Rather than leaving `cn`/`cva` as library trivia, rebuild `StatusBadge`
with them — it's the same shape as the handout's own `badge` example,
just with `status` instead of `tone`.

**File: `components/StatusBadge.tsx`**

```tsx
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { Delivery } from '@/lib/services/deliveriesService';

const statusBadge = cva('rounded-full px-2 py-1 text-sm font-medium', {
  variants: {
    status: {
      pending: 'bg-gray-200 text-gray-800',
      'in-transit': 'bg-yellow-200 text-yellow-800',
      delivered: 'bg-green-200 text-green-800',
    },
  },
  defaultVariants: { status: 'pending' },
});

export const StatusBadge = ({
  status,
  className,
}: {
  status: Delivery['status'];
  className?: string;
}) => {
  return <span className={cn(statusBadge({ status }), className)}>{status}</span>;
};
```

`cva` replaces the `colorByStatus` lookup object from Step 4 with the
declarative `variants` shape from the handout. `cn` is what lets a caller
pass an extra `className` (e.g. from Step 3's `<li>`) without clobbering
the badge's own classes — exactly the conflict-resolution problem the
handout describes.

---

## Part 3 — Dropping in shadcn components

### Step 11 — `Button`

```bash
npx shadcn@latest add button
```

Replace every plain `<button>`/CTA `<Link>` in the app:

**File: `components/NewDeliveryForm.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addDelivery } from '@/lib/actions/deliveries';

export const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return <Button onClick={() => setIsOpen(true)}>New delivery</Button>;
  }

  return (
    <form
      action={async (formData: FormData) => {
        await addDelivery(formData);
        setIsOpen(false);
      }}
    >
      <input name="pickup" placeholder="Pickup" required />
      <input name="destination" placeholder="Destination" required />
      <Button type="submit">Create request</Button>
      <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
    </form>
  );
};
```

**File: `app/deliveries/page.tsx`** — the handout's `asChild` example,
verbatim, on the "New delivery (full page)" link:

```tsx
import { Button } from '@/components/ui/button';

<Button asChild>
  <Link href="/deliveries/new">New delivery (full page)</Link>
</Button>
```

**File: `app/deliveries/new/page.tsx`** — its submit button:

```tsx
<Button type="submit">Create request</Button>
```

**Files: `app/deliveries/error.tsx` and `app/deliveries/[deliveryId]/error.tsx`**
— the "Try again" buttons:

```tsx
<Button variant="outline" onClick={reset}>
  Try again
</Button>
```

The handout also shows `variant="destructive"` for a "Cancel delivery"
action — there's no cancel/delete feature in this app yet (the service
layer has no delete method), so there's nothing honest to wire it to. Keep
it in mind for if that feature gets added later.

### Step 12 — `Card`

```bash
npx shadcn@latest add card
```

Replaces the manual `rounded-lg border p-4` div from Step 3 — `Card`
brings its own border, padding, and background from the theme tokens, so
those utility classes come off.

**File: `components/DeliveryFilter.tsx`**

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
  {visible.map((delivery) => (
    <li key={delivery.id}>
      <Link href={`/deliveries/${delivery.id}`}>
        <Card>
          <CardHeader>
            <CardTitle>
              {delivery.pickup} to {delivery.destination}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge status={delivery.status} />
          </CardContent>
        </Card>
      </Link>
    </li>
  ))}
</ul>
```

### Step 13 — `Select`

```bash
npx shadcn@latest add select
```

The handout calls this a "drop-in change inside that existing client
component" — `DeliveryFilter` already has `'use client'`.

**File: `components/DeliveryFilter.tsx`**

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

<Select
  value={status}
  onValueChange={(value) => setStatus(value as Delivery['status'] | 'all')}
>
  <SelectTrigger>
    <SelectValue placeholder="Filter by status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    {statuses.map((s) => (
      <SelectItem key={s} value={s}>
        {s}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

Replaces the native `<select>`/`<option>` block entirely.

### Step 14 — `Input` and `Label`

```bash
npx shadcn@latest add input label
```

Apply to **both** delivery-creation forms — the client one and the
full-page server-action one.

**File: `components/NewDeliveryForm.tsx`**

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<form ...>
  <div className="grid gap-2">
    <Label htmlFor="pickup">Pickup</Label>
    <Input id="pickup" name="pickup" placeholder="Bakery" required />
  </div>
  <div className="grid gap-2">
    <Label htmlFor="destination">Destination</Label>
    <Input id="destination" name="destination" placeholder="Clock Tower" required />
  </div>
  <Button type="submit">Create request</Button>
  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
    Cancel
  </Button>
</form>
```

**File: `app/deliveries/new/page.tsx`** — same pattern:

```tsx
<div className="grid gap-2">
  <Label htmlFor="pickup">Pickup</Label>
  <Input id="pickup" name="pickup" placeholder="Bakery" />
</div>
<div className="grid gap-2">
  <Label htmlFor="destination">Destination</Label>
  <Input id="destination" name="destination" placeholder="Clock Tower" />
</div>
```

### Step 15 — Edit `Button` itself: a `brand` variant

The handout's "Editing a component" example, applied for real: give the
generated `Button` a `brand` variant built on the Step 6 tokens, then let
the two primary "New delivery" CTAs use it.

**File: `components/ui/button.tsx`** — inside `buttonVariants`'s
`variants.variant`:

```ts
variant: {
  default: 'bg-primary text-primary-foreground hover:bg-primary/80',
  brand: 'bg-brand text-brand-foreground hover:bg-brand/80',
  // ...outline, secondary, ghost, destructive, link stay as generated
},
```

**File: `components/NewDeliveryForm.tsx`**

```tsx
<Button variant="brand" onClick={() => setIsOpen(true)}>
  New delivery
</Button>
```

**File: `app/deliveries/page.tsx`**

```tsx
<Button variant="brand" asChild>
  <Link href="/deliveries/new">New delivery (full page)</Link>
</Button>
```

---

## Part 4 — Light/dark mode

This is `intro.md`'s closing learning objective. The handouts explain the
mechanism (`shadcn-ui-setup.md`'s `.dark`-class theming, `tailwind-basics.md`'s
`dark:` variant) but don't hand you toggle code — this part is the glue
that puts the mechanism to use.

### Step 16 — Confirm the `dark` custom variant exists

Open `app/globals.css` and find the line `npx shadcn@latest init` added:

```css
@custom-variant dark (&:is(.dark *));
```

This is Step 8's `@custom-variant` pattern, aimed at `.dark` instead of a
hand-rolled `.theme-dark`. It's why adding the class `dark` to `<html>`
flips every `dark:`-prefixed utility and every shadcn CSS variable at once
— nothing left to configure.

### Step 17 — A toggle button

**New file: `components/ThemeToggle.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <Button variant="outline" onClick={() => setIsDark((current) => !current)}>
      {isDark ? 'Light mode' : 'Dark mode'}
    </Button>
  );
};
```

**File: `app/layout.tsx`** — drop it into the header next to the title:

```tsx
<header className="flex items-center justify-between bg-brand p-4 text-brand-foreground">
  <h1 className="text-3xl font-bold">Kiki&apos;s Delivery Service</h1>
  <ThemeToggle />
</header>
```

That's every code example from the four handouts, each with a real home in
this codebase.
