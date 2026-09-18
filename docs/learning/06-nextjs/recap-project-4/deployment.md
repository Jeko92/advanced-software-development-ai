# Recap Project 4 - Deployment

## Deploying to Vercel

Vercel is built by the team behind Next.js, so it recognizes a Next.js app without extra configuration. If not done already, create an account on Vercel, preferably with a GitHub OAuth connection. Push your repository to GitHub, then in the Vercel dashboard choose "Add New Project" and import that repository. Vercel detects the framework, runs the build, and gives you a live URL. Every later push to your main branch triggers a new deployment automatically, and pull requests get their own preview URLs so you can check changes before they go live.

The one thing Vercel cannot guess is anything secret or environment-specific, like where your backend lives. That comes next.

## Environment variables

Locally these sit in `.env`, which is not committed. Vercel needs its own copy, set under Project Settings, then Environment Variables. Two details matter here:

- **`DARKBAY_API_URL`** holds your backend's public address. Without the `NEXT_PUBLIC_` prefix, this value stays on the server, which is exactly what your service layer needs. Browser code never sees it.
- **`NEXT_PUBLIC_` prefix** exposes a variable to the browser bundle. Use it only for values that are safe to ship to the client, such as a public analytics key. Never give your API URL or any secret this prefix if it should stay server-side.

After adding or changing a variable, redeploy so the new value takes effect. Variables are read at build and run time, not patched into an existing deployment.

## Connecting to the Render backend

Your DarkBay API runs as a web service on Render with its own public URL, something like `https://darkbay.onrender.com`. Set `DARKBAY_API_URL` on Vercel to that address and your service layer will call the live backend instead of `localhost`.

Two quirks are worth planning for:

- **Cold starts:** Render's free tier sleeps a service after inactivity. The first request after a nap can take many seconds while the service wakes. Your `loading.tsx` states cover this, but don't be suprised if the first load takes a while to complete.
- **CORS:** Calls made from your Next.js server to Render are server-to-server and not subject to browser CORS rules. If you also call DarkBay directly from browser code, configure DarkBay to allow your Vercel domain as an origin. Since we are keeping calls in the server-side service layer we sidestep this issue entirely.

## Resources

[Deploying on Vercel](https://nextjs.org/docs/app/getting-started/deploying)

[Vercel Environment Variables](https://vercel.com/docs/environment-variables)

[Render Web Services](https://render.com/docs/web-services)
