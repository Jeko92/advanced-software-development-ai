# Next.js Tailwind and shadcn - Challenges

## Code Along

These challenges continue the Kiki's Delivery Service app from the previous session. Start from where that session left off.

### Add Tailwind to the project

The app has no styling tool set up. Add Tailwind so utility classes work everywhere.

- Install `tailwindcss`, `@tailwindcss/postcss`, and `postcss`
- Create `postcss.config.mjs` in the root and register the `@tailwindcss/postcss` plugin
- Replace the contents of `app/globals.css` with a single `@import "tailwindcss";` line
- Add `className="text-3xl text-red-500"` to a heading and confirm it changes in the browser

### Set up shadcn/ui

Bring in shadcn so you can use their components.

- Run `npx shadcn@latest init` from the project root and answer its prompts
- Look at what changed: the new `components.json`, the CSS variables added to `globals.css`, and `lib/utils.ts` with the `cn` helper
- Confirm the app still runs and looks the same, since nothing has been added to a page yet

### Replace bare elements with shadcn components

Swap the plain HTML elements for shadcn components, styling the app properly.

- Add the components you need: `npx shadcn@latest add button card select input label`
- Render each delivery inside a `Card`, using `CardHeader`, `CardTitle`, and `CardContent`
- Replace the link to `/deliveries/new` with a `Button` using `asChild` around a Next.js `<Link>`
- In the `DeliveryFilter` client component, replace the native `<select>` with shadcn's `Select`, wiring `value` and `onValueChange` to the existing state
- In the new-delivery form, replace the inputs with `Input` and `Label`, keeping the `name` attributes the server function reads
- Confirm the filter still filters and the form still creates a delivery

### Add a custom button variant

Use the fact that you own the component code to add a brand variant.

- Open `components/ui/button.tsx` and find the list of variants
- Add a `brand` variant that uses your `bg-brand` and `hover:bg-brand-muted` tokens
- Use `<Button variant="brand">` somewhere in the app and confirm it renders with your color

### Add dark mode

Finish by letting the app switch between light and dark. shadcn already wrote the dark color values during init, so this is about adding a way to turn them on.

- Install [`next-themes`](https://www.npmjs.com/package/next-themes) and wrap the app in its `ThemeProvider` in `app/layout.tsx`.
- Add a button somewhere in the layout that toggles between light and dark using the `useTheme` hook.
- Confirm every shadcn component, the cards, and your brand elements all switch when you toggle, without any extra styling work

## Code Snippet Library

This continues the Code Snippet Library from the previous session: a Next.js project with the `snippetsService` backed by Postgres, a `/snippets` list, a `/snippets/[id]` detail page, a `/snippets/new` form, and a client component that filters by language.

- Set up Tailwind exactly as in the Kiki's challenge: install the packages, add `postcss.config.mjs`, and replace `globals.css` with the Tailwind import
- Run `npx shadcn@latest init`, then add `button card select input label`
- Render each snippet in a `Card`
- Replace the new-snippet link with a `Button` using `asChild` and a `<Link>`
- Replace the native language `<select>` in the filter client component with shadcn's `Select`
- Replace the form fields with `Input` and `Label`, keeping the `name` attributes intact
- Browse the component catalogue and see what else you can add to style your app.
