# Next.js App Router - File Conventions

`page.tsx` is one filename from a set that the app router treats specially.

- `layout.tsx`
- `loading.tsx`
- `error.tsx`.

The others let you wrap a route segment with extra behaviour without writing any wiring code. For example, share the page layout, display a placeholder while the page loads or show a fallback if an error occurs. To use one of these features, add a file with the corresponding reserved name to a route segment folder. Next.js automatically detects it by name and applies its behavior to that route segment and any nested segments.

## layout.tsx

A layout defines UI that is shared across multiple pages. Unlike pages, layouts persist between navigations, so shared elements such as navigation bars, sidebars, and footers do not re-render each time the user moves between pages. A `layout.tsx` file receives the page it wraps as a `children` prop and renders it somewhere in its own markup.

Every Next.js app needs one root layout at `app/layout.tsx`. It is the outermost wrapper for the whole site, and it is the only place the `<html>` and `<body>` tags are written, since Next.js does not add them for you.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Kiki's Delivery Service</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
```

The important parts of this file:

- `children` is typed as `React.ReactNode`, the type for anything React can render, because the layout does not know in advance which page will be placed inside it
- The `<html>` and `<body>` tags appear here and only here in the whole app
- `{children}` marks the spot where the active page is rendered, so the header above it stays put across navigations

Multiple Layouts can be nested the same way folders do. A `layout.tsx` inside `app/deliveries/` wraps every page under `/deliveries`, and it renders inside the root layout rather than replacing it. That lets a section of the site add its own shared UI, such as a deliveries sidebar, on top of the site-wide header.

Let's build up a small model of the internal component structure of a route that Next creates for us. With the Layout in place, it looks like this:

```tsx
import Layout from "./layout";
import Page from "./page";

function Route() {
  return (
    <Layout>
      <Page params={params} />
    </Layout>
  );
}
```

Important to note is that we don't write this ourselves. Next.js finds the Layout and Page components independently and applies it to the page render.

## loading.tsx

When a Server Component fetches data while it renders, the page cannot appear until that data is ready. Without a placeholder, the user stares at the previous screen until everything finishes. A `loading.tsx` fills in the gap by giving Next.js something to show in the meantime. Whatever component it exports is displayed immediately while the page in the same folder is still being prepared.

```tsx
export default function Loading() {
  return <p>Loading deliveries...</p>;
}
```

The mechanism behind this is React Suspense. Suspense is a React feature that lets a component "wait" for something it needs, while React shows a fallback in its place until it is ready. When you add a `loading.tsx`, Next.js automatically wraps the matching page in a Suspense boundary and uses your loading component as that fallback. You do not write the `<Suspense>` tag yourself; the file's presence sets it up.

This connects to a behaviour called streaming. Rather than holding back the entire HTML response until the slowest data fetch finishes, the server can send the layout and the loading fallback right away, then send the finished page content the moment it is ready and swap it in. The user sees the shell of the page and a loading indicator almost instantly, instead of a blank screen.

Let`s extend our model of the internal component structure by the loading suspense boundary:

```tsx
import Layout from "./layout";
import Page from "./page";
import Loading from "./loading";

function Route() {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Page params={params} />
      </Suspense>
    </Layout>
  );
}
```

## error.tsx

If a page throws an error while rendering, something has to catch it so the whole app does not break. An `error.tsx` file defines that fallback for its segment. When the page or a component inside it throws, Next.js renders the error component instead, keeping the rest of the site, including the surrounding layout, intact.

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Could not load this delivery.</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

What the error file gives you:

- `error` is the thrown error, so you can show its message or log it
- `reset` is a function that tries to render the segment again, useful for recovering from a temporary failure without a full page reload
- The first line is the `"use client"` directive, which is required here

That last point is the one exception to this session's server-only focus. An error boundary has to run in the browser to catch errors and respond to the user clicking a button, so `error.tsx` must be a Client Component. Treat `"use client"` as a required line for this file for now.

Let`s add the error boundary to our small model as well:

```tsx
import Layout from "./layout";
import Page from "./page";
import Loading from "./loading";
import Error from "./error";

function Route() {
  return (
    <Layout>
      <ErrorBoundary fallback={<Error />}>
        <Suspense fallback={<Loading />}>
          <Page params={params} />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}
```

## Resources

[Layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

[Loading UI and streaming](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

[Error handling](https://nextjs.org/docs/app/getting-started/error-handling)
