# Next.js Tailwind and shadcn - Intro

## Learning objectives

- Explain what utility-first styling is and how it differs from writing separate CSS files for your components
- Add Tailwind v4 to an existing Next.js project using the CSS-first setup
- Style components with the common utility classes for layout, spacing, color, and typography
- Apply state and responsive variants such as `hover:` and `md:` to change styles by interaction or screen size
- Define your own design tokens with `@theme` so a custom name like `bg-brand` becomes a usable utility
- Describe what shadcn/ui is, and why copying component code into your project differs from installing a component library
- Add shadcn/ui to an existing project with the CLI, and use the `cn()` helper it installs to combine classes safely
- Drop in `Button`, `Card`, `Select`, and form components, and edit them directly because the code is yours
- Switch the app between light and dark mode with the `dark:` variant and shadcn's CSS-variable theming

## Overview

The app from the previous session gets rendered on the server and has client side interactivity. It also looks like a plain HTML document from 1995, because not a single style has been written yet. We will fix that in this session.

We will look at two tools. The first is Tailwind, a way of styling by putting small classes directly on your elements, such as `flex`, `gap-4`, and `text-lg`, instead of writing CSS in a separate file and inventing class names for it. The second is shadcn/ui, a collection of ready-made components like buttons, cards, and dropdowns that you copy into your own project and can tweak as you like. shadcn is built on Tailwind, so the first half of the session sets up the foundation the second half stands on.

We start with Tailwind on its own: the idea behind utility classes, how to add it to the existing Next.js project, and the utilities you will reach for most often. From there you will extend Tailwind with your own color tokens, which is the same mechanism shadcn uses for theming. Then we bring in shadcn/ui, set it up, and replace the bare HTML elements in the Kiki's Delivery Service app with proper components. The session closes with dark mode, which the token system makes almost free once it is in place.

## Resources

[Tailwind CSS](https://tailwindcss.com/)

[shadcn/ui](https://ui.shadcn.com/)
