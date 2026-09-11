# Next.js App Router - Intro

## Learning objectives

- Explain what Next.js is and why a server-first full-stack framework solves problems that a client-only React app cannot
- Understand that Next.js organizes an app around components, where running on the server is the default
- Map URLs to files using the app folder and `page.tsx`
- Build dynamic routes that read their parameters from the URL
- Use the special files `layout.tsx`, `loading.tsx`, and `error.tsx`, and explain how `loading.tsx` connects to React Suspense
- Improve navigation, images, and fonts with the built-in `next/link`, `next/image`, and `next/font` tools

> 💡 This session has a code along challenge. Feel free to open it up and follow along with the handouts.

## Overview

The web development landscape has undergone a major shift in the last few years. From Classic Server Side Rendered Applications with PHP or Ruby on Rails to Single Page Applications (SPAs) with Angular or React, a new wave of frameworks has sprung up, which try to move more render workload back to the server without losing the interactive experience of a client-side app.

When talking about page rendering, we can classify 3 different models:

- Client-side rendering (CSR): the page is rendered on the client, the client receives the complete JS App code.
- Server-side rendering (SSR): the static parts of the page are rendered on the server, and the UI undergoes a hydration step on the client.
- Server Components: the UI elements are rendered on the server, and only the finished HTML is sent to the client.

A plain React app runs entirely in the browser. The server sends a near-empty HTML file and a bundle of JavaScript, and only after that JavaScript downloads and runs does the page render. The data the page needs is fetched afterwards, in a second round trip. This works, but it has costs: the first paint is slow and search engines see an empty page.

Next.js has switched from an SSR to a Server Component centric model in the last few years. Components render on the server first, and the browser receives finished HTML. This is the idea behind a server-first full-stack framework: the UI, the code that fetches data, and the routing all live in one project, and most of the work happens on the server before anything reaches the user.

Older versions of Next.js used the pages router, which would default to SSR. We will focus on the new App Router which uses server components by default instead. For interactive components, classic client components are needed, which will be discussed in the next session.

The App Router is built on a single idea: the folder structure inside an `app` directory defines the URLs of your application. A folder is a route, a `page.tsx` file makes it visible, and a small set of specially named files add layouts, loading states, and error handling around it.

We work through these ideas by building one example app across the whole session: the website for Kiki's Delivery Service, where customers can create delivery requests. Each concept extends the same app, so the routes and data you meet early on come back later.

## Resources

[Kikis Delivery Service](https://www.themoviedb.org/movie/16859)
[Next.js](https://nextjs.org/)
