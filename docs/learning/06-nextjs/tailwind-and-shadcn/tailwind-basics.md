# Next.js Tailwind and shadcn - Tailwind Basics

When you style a component the traditional way, the rules live in a separate CSS file and you connect them with a class name you invented, like `.delivery-card`. Two files now describe one component, and you jump between them to read it. Tailwind takes a different route. You style an element by putting many small, single-purpose classes directly on it, and you never open a CSS file to do it.

## Utility-first styling

The idea behind utlity-first styling that Tailwind uses is to create many small classes that do one thing only. `p-4` sets padding, `flex` sets `display: flex`, `text-center` centers text. You build a design by combining them on the element itself:

```tsx
<div className="flex gap-4 rounded-lg border p-4">
  <h2 className="text-lg font-semibold">Bakery to Clock Tower</h2>
</div>
```

Reading that `<div>` tells you everything about how it looks without opening another file. The styles travel with the markup, so when you delete the component, its styles leave with it.

Tailwinds class naming conventions look cryptic at first, but they follow a consistent system. `p` is padding, `m` is margin, `text` covers font size and color, and the number after the dash is a step on a fixed spacing scale rather than a pixel value. Once you learn the pattern for one property, the rest read the same way.

Creating all these classes by hand would be extremely tedious, and having a giant stylesheet with all possible combinations that tailwind offers would be impractical. Instead, Tailwind generates these classes from the CSS you write by scanning all files in your project for the class names it recognizes. From that scan, a minimal but flexible style sheet is generated and injected into your HTML.

## Adding Tailwind to the project

Adding tailwinds config to the existing Next.js project takes three steps.

First, install Tailwind and its PostCSS plugin. PostCSS is the tool Next.js already uses to process your CSS, and the plugin is what lets it understand Tailwind:

```bash
npm install tailwindcss @tailwindcss/postcss postcss
```

Second, register the plugin so Next.js runs Tailwind over your styles. Create `postcss.config.mjs` in the project root:

```js
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

Third, pull Tailwind into your global stylesheet. Open `app/globals.css`, remove the old starter styles, and replace the whole file with a single import:

```css
@import "tailwindcss";
```

That one line generates every utility class. Because `globals.css` is already imported in `app/layout.tsx` from the earlier sessions, the classes are now available in every component. Start the dev server and add a `className="text-3xl font-bold"` to a heading to confirm it works.

## Important utility classes

Tailwind has a utility for nearly every CSS property, far more than anyone memorizes. You learn the handful you reach for daily and look up the rest in the docs, which are searchable by the CSS property you have in mind. These are the groups worth knowing by name:

| Group | Examples | What they do |
| --- | --- | --- |
| Layout | `flex`, `grid`, `block`, `hidden` | Set the display mode |
| Grid columns | `grid-cols-3`, `grid-cols-1` | Shape a grid into that many columns |
| Padding and margin | `p-4`, `m-4` | Padding (`p`) or margin (`m`) on all four sides |
| Side modifiers | `px-4`, `py-2`, `pt-4`, `mb-2` | Add `x` for left and right, `y` for top and bottom, or `t`/`b`/`l`/`r` for a single side |
| Negative values | `-mt-3`, `-top-3` | Prefix any value with `-` to make it negative, for pulling an element the other way |
| Gap | `gap-4` | Space between children in a flex or grid container |
| Sizing | `w-full`, `h-screen`, `max-w-md` | Width and height; named sizes like `md` (28rem) and `lg` (32rem) come from a scale |
| Color | `bg-blue-500`, `text-gray-700`, `border-gray-200` | Background, text, and border color; the number is a shade from 50 (lightest) to 950 (darkest) |
| Typography | `text-lg`, `font-semibold`, `text-center` | Font size, weight, and alignment |
| Borders and corners | `border`, `border-2`, `rounded-lg`, `shadow-sm` | Border presence and width, rounded corners, and shadow |

Tailwind has great [docs](https://tailwindcss.com/docs/styling-with-utility-classes) which will help you get started. Keep them open and search for the property; the class names map onto CSS closely enough that they become predictable fast.

## State and responsive variants

A utility on its own applies all the time. But what about optional styling like hover and media queries for different screen sizes? Tailwind handles this with a prefix in front of the utility, called a variant.

State variants apply a utility in response to interaction. `hover:bg-blue-600` changes the background only while the pointer is over the element, and `focus:ring-2` adds a ring only while an input is focused:

```tsx
<button className="bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
  Accept delivery
</button>
```

Responsive variants apply a utility only at or above a screen width. Tailwind is mobile-first, so an unprefixed utility applies everywhere and a prefixed one takes over on larger screens. Here the list is a single column by default and becomes three columns from the medium breakpoint up:

```tsx
<ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
```

The breakpoint prefixes go `sm:`, `md:`, `lg:`, `xl:`. There is also a `dark:` variant that applies a utility only in dark mode, which we use at the end of the session once the theming is in place.

> :bulb: Variants combine. `md:hover:bg-blue-600` applies the hover background only on medium screens and up.

## Resources

[Styling with utility classes](https://tailwindcss.com/docs/styling-with-utility-classes)

[Hover, focus, and other states](https://tailwindcss.com/docs/hover-focus-and-other-states)

[Responsive design](https://tailwindcss.com/docs/responsive-design)
