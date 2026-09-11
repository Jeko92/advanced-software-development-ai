# Next.js Tailwind and shadcn - shadcn/ui Setup

Tailwind styles your own elements well, but some components are genuinely hard to build. An accessible dropdown that handles keyboard navigation, focus trapping, and screen readers is hundreds of lines of careful work which have already been done by high quality libraries like Base UI or Radix UI. 

Instead of recreating all this work, we will introduce one very popular, open-source collection of reusable UI components called shadcn/ui. Perhaps you have heard of component libraries before and have already used them. Interestingly, the developers behind shadcn write about it: "This is not a component library. It is how you build your [own] component library". Let's explore.

## Owning the code instead of importing it

Traditional UI libraries provide you with predefined components that you drop into your project and use them without worrying about the underlying CSS. Most libraries implement the most common patterns, such as buttons, inputs, and dropdowns or even data tables and charts. For example, a well-known library like Material UI lives in `node_modules` and allows you to import a `<Button>`. But the styles and behaviour of this component are locked inside the package. 

Shadcn components are more like a highly sophisticated template that you adjust until it fits your use case perfectly. Every component becomes a `.tsx` file in your `components/ui` folder as part of your repository. The accessibility and behavior come from small, focused libraries underneath (Radix UI / Base UI for the interactive parts), but the component file sitting on top is yours to change. You get the hard parts solved and the styling left open with a solid default design.

Check out the list of [components](https://ui.shadcn.com/docs/components) shadcn provides for you. And if that is not enough, you can also browse the [directory](https://ui.shadcn.com/docs/directory) of 200+ community maintained component packages, all built with the same "copy and tweak" philosophy in mind.

## Initializing shadcn

Shadcn provides its own CLI, which you use to add it into an existing project. From the project root, run the init command:

```bash
npx shadcn@latest init
```

The CLI gives you a few options (such as which base color to use) and then sets the project up. Here is what it changes, so the new files are not a mystery:

- `components.json` appears in the root. This records your choices, such as where components should be written, so future `add` commands know what to do
- `app/globals.css` is extended with a block of CSS variables for colors, plus a dark-mode block. These are theme tokens in the same shape as the `@theme` values from the previous file
- `lib/utils.ts` appears, exporting a helper called `cn`
- A couple of small dependencies are installed, including `clsx`, `cva` and `tailwind-merge`

After init, the project still looks the same in the browser. Nothing has been added to a page yet. You have set up the ground for pulling in components.

## Theming with CSS variables

The variables shadcn wrote into `globals.css` are its entire color system, and they work just like the `@theme` tokens from the previous chapter. Each token is a CSS variable defined twice: once for light mode and once inside a `.dark` block for dark mode.

```css
:root {
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
}

.dark {
  --primary: oklch(0.92 0.004 286.32);
  --primary-foreground: oklch(0.21 0.006 285.885);
}
```

Because every component points at these variables, you restyle the whole app by editing values in one place. Change `--primary` and every `Button`, link, and accent that uses it updates. Add the `dark` class to the page and all the variables switch to their dark values at once.

> :bulb: The `foreground` naming is a shadcn convention: `--primary` is a background color, and `--primary-foreground` is the text color meant to sit on top of it.

Shadcn has a great [Theme Creator Web App](https://ui.shadcn.com/create?preset=b1z30o0hGK) to help you create your own color system. You can copy the CSS variables from there and drop them into your `globals.css`.

## The cn helper

Every shadcn component uses a helper named `cn`. It lives in `lib/utils.ts` and looks like this:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

It wraps two libraries that each fix one problem with building class strings.

`clsx` builds a class string from conditions. Rather than gluing strings together by hand, you pass it values and it keeps the truthy ones. This is how a component applies a class only when a prop is set:

```tsx
cn("rounded-md px-4", isActive && "bg-brand", isDisabled && "opacity-50");
```

When `isActive` is true and `isDisabled` is false, the result is `"rounded-md px-4 bg-brand"`. The false condition is dropped.

`tailwind-merge` resolves conflicts between Tailwind classes. Two classes that set the same CSS property will both end up in the HTML, and the regular CSS rules, not the order you wrote them, decide the winner, which is rarely what you intended. If a component has `px-4` built in and you pass `px-8` to override it, the string `"px-4 px-8"` is ambiguous. `tailwind-merge` knows these both set horizontal padding and keeps only the last, giving you `px-8`.

## Defining variants with cva

`cn` glues a class string together, but it does not decide which classes a component should use in the first place. A `Button` has several looks (`default`, `outline`, `destructive`) and several sizes, and each is its own set of Tailwind classes. Shadcn uses a small library for this, `class-variance-authority`, imported as `cva`.

`cva` lets you declare the class sets once as data and hands back a function that turns a choice of variant into the matching class string:

```ts
import { cva } from "class-variance-authority";

const badge = cva("rounded-full px-2 py-1 text-sm font-medium", {
  variants: {
    tone: {
      neutral: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      danger: "bg-red-100 text-red-800",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});
```

The call has three parts:

- The first argument is the base string, the classes that apply to every badge no matter the variant
- `variants` holds named groups of options. Here a single group `tone` maps each option to its own classes; a component can have several groups, such as a `variant` group and a `size` group
- `defaultVariants` picks the option to use when the caller does not pass one, so `badge()` with no argument still produces a styled element

You then call the returned function with the variant you want, and it gives you the full class string:

```ts
badge({ tone: "success" });
// "rounded-full px-2 py-1 text-sm font-medium bg-green-100 text-green-800"
```

## Resources

[shadcn/ui installation for Next.js](https://ui.shadcn.com/docs/installation/next)

[shadcn components](https://ui.shadcn.com/docs/components)

[community project directory](https://ui.shadcn.com/docs/directory)

[Theming](https://ui.shadcn.com/create?preset=b1z30o0hGK)
