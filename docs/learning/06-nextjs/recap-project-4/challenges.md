# Recap Project 4 - Challenges

## Prerequisites

Run DarkBay locally first (your own or the starter). The `npm run start:dev` will start the server on port 3030. Get te starter template here:

```bash
npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/recap-project-4/darkbay backend
```

## 1 Project Setup and the Service Layer

Your first objective is a running Next.js application that can reach DarkBay through a single, server-side module.

- Scaffold a new project with `create-next-app` using TypeScript and the App Router.
- Store the DarkBay base URL in an environment variable in `.env`, for example `DARKBAY_API_URL=http://localhost:3030`. Read it on the server, never hardcode it in components.
- Create an `auctionsService` module under `lib/` that groups all auction related `fetch` calls. Give it small typed functions like `getAuctions()` and `getAuctionById(id)` that build the request, call DarkBay, and return parsed data.
- **Design question:** Why route every backend call through one server-side module instead of calling `fetch` inside each component? Think about where your API URL and, later, your auth token need to live.

_Resource:_ [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)

## 2 Browsing Auctions

Build the front page: a list of auctions that visitors can filter and page through, with no login required.

- Make the auction list an async server component that fetches through your service layer and renders the results directly.
- Add a `loading.tsx` so the route shows a fallback while data arrives.
- **Design question:** The filter and page values come from `searchParams` on the server. What do you gain by keeping that state in the URL rather than in client-side `useState`?

_Resource:_ [Next.js Pages and Layouts](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

## 3 Auction Detail and Bid History

Each auction needs its own page showing the full listing and the offers placed so far.

- Create a dynamic route with a `[id]` folder. Read the segment from the `params` prop and fetch that single auction plus its offers through the service layer.
- Render the item details, the current price, the end date.
- On the list page, link each list item to its detail page with `next/link`.
- Handle a missing auction. If DarkBay returns a 404 for an unknown id, show a not-found page, add an `error.tsx` boundary for unexpected failures.
- **Design question:** A user can type any id into the URL. Where do you catch the case where that auction does not exist, and what does the user see?

_Resource:_ [Next.js Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

## 4 Styling with Tailwind and shadcn/ui

Turn the working app into something people want to use.

- Set up Tailwind CSS, then initialize shadcn/ui with `npx shadcn@latest init`.
- Add the components you need with `npx shadcn@latest add`, for example `button`, `card`, `input`, and `select`. Build the auction card pages with the components.
- Make the layout responsive and support a dark mode, fitting for an underground marketplace.
- Continue using shadcn to style the upcoming elements.

_Resource:_ [shadcn/ui Installation](https://ui.shadcn.com/docs/installation/next)

## 5 Authentication

Give users a way to sign in so they can place bids, auctions, and manage their account.

- Create a authActions file in your `/lib` folder where you create the `loginAction`, `registerAction`, and `logoutAction` functions.
- Build login and register pages including the respective forms. Use a server action on your own Next.js server for the form action.
- In that handler, call DarkBay's login endpoint, take the returned JWT, and store it in an httpOnly cookie using `cookies()` from `next/headers`. Add a logout function that clears the cookie.
- Create a `fetchAPI` function that reads the token from the cookie with `cookies()`. It receives the path as well as the an options object as the arguments and calls fetch by passing those values into it. Additionally, it adds the JWT token to the request headers as `Authorization: Bearer ${token}` if the token exists.
- Update your service layer by replacing the plain `fetch` calls with `fetchAPI`.
- Reflect auth state in the UI: show login and register links to guests, and a logout button plus the user's actions to signed-in users. Create a `isAuthenticated` function to check if a user is logged in (by reading the cookie). Call it on the server and use it to conditionally render the UI.
- **Security question:** Why store the JWT in an httpOnly cookie read on the server, rather than in `localStorage` where client code can reach it?

_Resource:_ [Next.js cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)

## 6 Protected Actions

With a token in place, let signed-in users create auctions and place bids.

- Build a create-auction form and a place-a-bid form. Submit them with server functions (`"use server"`) wired to the form's `action`, so the mutation runs on the server.
- After a successful write, call `revalidatePath` for the affected route so the list or detail page reflects the new state without a manual refresh.
- Surface DarkBay's rejections. A bid below the current price or on a closed auction comes back as a specific status code; turn that into a clear message instead of a generic error.
- **Business rule:** DarkBay derives the seller and bidder identity from the verified token. Your forms must not send a `seller` or `bidder` field. Where does that identity come from now?

_Resource:_ [Next.js Server Actions and Mutations](https://nextjs.org/docs/app/getting-started/updating-data)

## 7 Deployment to Vercel

Ship the app and connect it to your live backend. The full walkthrough lives in [deployment.md](deployment.md).

- Push your repository to GitHub and import it into Vercel.
- Set your environment variables in the Vercel project, pointing `DARKBAY_API_URL` at your DarkBay backend on Render. If you don't have a running Render instance, checkout the devops ci/cd session.
- Open the deployed URL and confirm browsing, login, and bidding all work against the live backend.

_Resource:_ [Deploying on Vercel](https://nextjs.org/docs/app/getting-started/deploying)

## Bonus Challenges

Pick one or more once the main build works.

- **searchParams:** Wire DarkBay's query options to the URL: `?status=open|closed`, `?min-price` and `?max-price`, sorting by end date, and pagination. Read these from the page's `searchParams` and forward them to the API.
- **react-hook-form everywhere:** Refactor the auction and bid forms to react-hook-form with typed values and validation rules, and share field components through `FormProvider`.
- **Global state with zustand:** Move auth state or a watchlist into a zustand store so components subscribe only to the slice they use.
- **Watchlist:** Surface DarkBay's watchlist feature. Let signed-in users add or remove an auction and view a dedicated watchlist page.
- **Open or closed badge:** Read the auction's derived status and show an "open" or "closed" badge on the card and detail page.
- **Admin delete:** If the logged-in user is an admin, show a delete control on listings and call the protected delete endpoint.
- **Optimistic bidding:** Show the new highest bid immediately on submit, then reconcile with the server's response.
- **Dark mode toggle:** Add a switch that flips the theme and remembers the choice.
- **Skeleton loaders:** Replace plain loading text with skeleton placeholders shaped like the auction cards.
