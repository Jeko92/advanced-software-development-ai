# Next.js Ecosystem - Ecosystem Overview

React is a rendering library and not much more. It gives you components, state, and a way to describe what the screen should look like, then stops. It has no opinion on how you fetch data, how you style a component, how you share state across distant parts of the tree, or how you handle a form. Next.js adds routing, server rendering, and a build pipeline on top, but it stays just as hands-off about the rest. That gap is filled by a large ecosystem of third-party libraries, and for most jobs there is more than one popular option.

## Example Libraries

This list contains some of the most popular third-party libraries for Next.js as well as some specialized example libraries like react leaflet or the monaco editor. If you need a UI element, it is very likely that a library / package exists for it.

| Concern        | Library                                                              | What it does                                                                                                |
| -------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Data fetching  | [SWR](https://swr.vercel.app/)                                       | React hooks for fetching, caching, and revalidating server data. Its main hook is `useSWR`.                 |
| Data fetching  | [TanStack Query](https://tanstack.com/query/latest)                  | A larger alternative to SWR with more control over caching, mutations, and background refetching.           |
| Global state   | [Redux Toolkit](https://redux-toolkit.js.org/)                       | The current standard way to use Redux: one central store with predictable, typed updates.                   |
| Global state   | [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) | A small store you read through a hook, with no provider to wrap your app in.                                |
| Forms          | [react-hook-form](https://react-hook-form.com/)                      | Form state and validation built on refs, so the form does not re-render on every keystroke.                 |
| Validation     | [Zod](https://zod.dev/)                                              | Schema validation for form input and API responses, with TypeScript types inferred from the schema.         |
| Authentication | [Better Auth](https://www.better-auth.com/)                          | Framework-agnostic authentication for TypeScript: sessions, email and password, and social login providers. |
| Animation      | [Motion](https://motion.dev/)                                        | Declarative animations, transitions, and gestures for React (formerly Framer Motion).                       |
| 3D rendering   | [React Three Fiber](https://r3f.docs.pmnd.rs/)                       | A React renderer for Three.js, so you describe 3D scenes with components instead of imperative calls.       |
| Maps           | [React Leaflet](https://react-leaflet.js.org/)                       | React components for Leaflet, for interactive maps with markers, layers, and tiles.                         |
| Code editor    | [Monaco Editor](https://github.com/suren-atoyan/monaco-react)        | The editor that powers VS Code, embeddable in the browser for in-app code editing.                          |

We will look at two libraries a bit closer together: react-hook-form for collecting and validating form input, and Zustand for sharing data across the app.

## Resources

- [Next.js documentation](https://nextjs.org/docs)
- [React documentation](https://react.dev/)
