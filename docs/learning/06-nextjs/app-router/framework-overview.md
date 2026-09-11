# Next.js App Router - Framework Overview

A React application built with a tool like Vite typically relies on client-side rendering. The server sends a minimal HTML document, and the browser must download and execute JavaScript before the UI can be rendered. In many cases, data fetching occurs after the initial render, meaning users may encounter loading states before seeing complete content. A growing application means that the JavaScript bundles also grow increasing the amount of code that must be downloaded, parsed, and executed on the client. Finally, another downside of client-side rendering affects SEO and can make it more challenging because the initial HTML contains nearly a blank page.

Next.js is a framework built on top of React that changes this paradigm. Instead of rendering the UI entirely in the browser, components can be rendered on the server and sent to the client as finished HTML. Since the server can also communicate with databases and execute backend logic, the same project can handle the UI, data fetching, and routing. These front- and backend capabilities position Next.js as a full-stack framework.

## Server-first by Default

In the world of Next.js, there are two types of react components, depending on where they are executed. We differentiate between client and server components. For now, let’s focus on server components, as these are the default settings. This means that every component you write runs on the server unless you explicitly specify otherwise.

It is important to understand, and must be kept in mind. The server-side code is never sent to the client browser at all. The code is executed once and the resulting HTML page arrives already rendered, so the user sees content sooner and search engines get real HTML. Because Server Components run on the server, they can do server-only work directly (e.g. read from a database or call an API with a secret key). There is no separate round-trip to fetch relevant data. The component can retrieve everything it needs right from the database and embed this data directly into the HTML.

Server components have their limitations, resulting from the environment in which they run. They render once and are gone, so they cannot use browser-only features like click handlers, `useState`, or `useEffect`. Anything interactive needs a Client Component, which is the topic of the next session.

## Components decide where they run

Even though Next.js is a full-stack framework, it helps to drop one assumption early. A Next.js project is not divided into a frontend and a backend folder separated by a network boundary. It is organized around components. You build the app out of components the same way you would in any React project. Where a given component runs (server or in the browser), is a property of that component rather than a split along your whole codebase.

The magic line of code that turns a server component into a client component is `“use client”`. By adding this directive at the first line of its file, you explicitly opt it into the browser. You will see that directive once in this lesson, on the `error.tsx` file, where it is required. Apart from that, the mental model for the rest of this session is simple: you write components, and most of them run on the server. Learning what Client Components actually do, and how server and client components pass data to each other, is covered in the upcoming session.

## Resources

[Next.js documentation](https://nextjs.org/docs)

[Server Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
