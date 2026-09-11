# Next.js Tailwind and shadcn - Tailwind Custom Styles

Tailwind ships with a large color palette, but what if e.g. `blue-500` is not your brand color? The naive approach could be writing a more specific `bg-[#f4a261]` but cryptic expression throughout our entire project. That’s inconvenient, given that the brand color might change at some point. Tailwind lets you register your own names instead.

## Defining Tokens

The practical approach is to add custom values inside an `@theme` block in `globals.css`, right after the import. A theme variable is a CSS custom property with a Tailwind's name convention. In the following example we define a token like `--color-brand` once, which Tailwind reads to generate matching utilities:

```css
@import "tailwindcss";

@theme {
  --color-brand: #f4a261;
  --color-brand-muted: #f7c59f;
}
```

The prefix in the variable name tells Tailwind which kind of utility to generate. Because these start with `--color-`, Tailwind creates every color utility for them: `bg-brand`, `text-brand`, `border-brand` and so on. The part after `--color-` becomes the name you write in the class.

Now you use them like any other Tailwind color:

```tsx
<button className="bg-brand text-white hover:bg-brand-muted">
  New delivery
</button>
```

The same naming idea can be applied to other categories. `--spacing-*` adds spacing steps, `--font-*` adds font families, `--radius-*` adds border-radius sizes. The pattern is always the same: name the variable with the right prefix, and the utilities appear.

It is worth to understand what `@theme` actually produces. When Tailwind reads `--color-brand`, it does two things: it generates the `<color-category>-brand` style of utilities, and it also outputs the variable itself as a real CSS custom property on the page. So `--color-brand` exists in the browser as a live value you could read or change at runtime.

That second part is the interesting one. A utility like `bg-brand` does not contain the hex code directly; it points at the variable. Change the variable's value and every element using `bg-brand` updates at once, without rebuilding anything. This is exactly how we will implement a dark mode later: the utility names stay the same, and only the variable values swap.

## Arbitrary Values

Tailwinds naming system covers a lot of use cases, but sometimes they don't quite have what you need. A common example is a specific grid layout that cannot be reproduced by the standard tailwind utilities. Another example is a color you need only once. Registering a token for that would clutter your theme namespace. Tailwind has an escape hatch for these situations, called arbitrary values, written by putting the value in square brackets right after the utility prefix.

You keep the normal utility name and supply your own value inside the brackets. This value can be arbitrary valid css that fits the property you are targeting:

```tsx
<div className="h-[117px] bg-[#1da1f2] text-[15px]">
  Pinned to an exact size
</div>
```

Each of these is the same property the prefix controls, with a value Tailwind would not generate on its own. `h-[117px]` sets that exact height, `bg-[#1da1f2]` uses that exact color and `text-[15px]` sets that exact font size. The bracket syntax works on nearly every utility, including ones with more complex values:

- `grid-cols-[1fr_500px_2fr]` defines grid columns by hand, where underscores stand in for the spaces CSS would use, since a class name cannot contain a literal space
- `top-[117px]` and other position utilities take a one-off offset
- `bg-[var(--some-color)]` points a utility at a CSS variable directly, which is occasionally handy for a value that only exists at runtime

Keep in mind that an arbitrary value is a one-off by definition. When you copy `bg-[#f4a261]` to a second element, you probably have the duplication problem again, and that might be a signal for a `@theme` token instead. Put brackets on real exceptions; use tokens for anything you will write more than once.

## Custom Variants

Remember that a variant is e.g. the `hover:` or `md:` part that decides when a utility applies. Tailwind lets you invent your own variant prefixes with `@custom-variant`. A common case is a theme toggled by a class on a parent element:

```css
@custom-variant theme-dark (&:where(.theme-dark *));
```

That registers a `theme-dark:` prefix you can put on any utility, so `theme-dark:bg-black` applies only when the element sits inside something with the `theme-dark` class. You will rarely need to write these by hand early on, but it helps to know that you can even extend the set of prefixes with your own.

## Resources

[Theme variables](https://tailwindcss.com/docs/theme)

[Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles)

[Functions and directives](https://tailwindcss.com/docs/functions-and-directives#custom-variant)
