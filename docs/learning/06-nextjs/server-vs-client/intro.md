# Next.js Server vs Client - Intro

## Learning objectives

- Contrast the traditional split into a separate frontend and backend with the way Next.js draws the server/client line inside one component tree
- Explain how a server component can render a client component through a plain import, with no fetch call or API endpoint in between
- Use the `"use client"` directive to move a component into the browser, and understand that it marks a boundary rather than tagging a single file
- Recognise which props can travel from a server component to a client component, and why they have to be serializable
- Write server functions with `"use server"`, both inline and in a dedicated file, to run server code in response to a user action
- Build API route handlers in a `route.ts` file, and decide when an HTTP endpoint fits better than a server function
- Query a PostgreSQL database from the server with the `postgres` client, using tagged template queries that are safe from SQL injection

## Overview

The previous session established that Next.js renders components on the server by default. That covers reading data and showing it, but without user interaction this won't feel like a real app. These involves code running in the browser (e.g. react to clicks, hold local state), code running on the server to save changes back to a database., and information passing between the two.

A traditional web app typically separates a frontend project that runs in the browser, a backend project that is executed on a server, and a network in between that you cross by hand with fetch calls and API endpoints. Instead of splitting the codebase into a frontend half and a backend half, Next.js handles everything inside a single component tree. Most components run on the server. The ones that need the browser opt in to become client components. A lot of the wiring you would normally write to cross the network is generated for you.

This session works through that boundary from both directions. First, what the boundary is and how Next.js lets a server component pull in a client component as if it were a normal import. Then client components themselves are discussed and the rule about which props can cross over to them. After that, we will look at the two ways code travels back to the server in response to a user action: server functions, which let you call server code as if it were a local function, and API route handlers, which give you a plain HTTP endpoint. The session closes by replacing the in-memory mock service from the last session with a real PostgreSQL database, queried directly with the `postgres` client.

## Resources

[Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
