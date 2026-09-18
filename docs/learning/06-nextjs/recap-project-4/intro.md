# Recap Project 4 - NextBay

Welcome to **NextBay**, the storefront for the DarkBay marketplace. In recap project 3 you built DarkBay as a headless API. Now the API gets a face. NextBay is a Next.js application that lets people browse listings, follow a bidding war, sign in, and place their own offers from the browser.

You can point NextBay at your own DarkBay backend or use the provided starter. The starter is the finished version of DarkBay without the bonus features, so every endpoint you need already exists. Your job is the frontend and the layer that talks to the backend.

NextBay keeps a clear division of labor. DarkBay stays the single source of truth for data and business rules; a bid is still rejected on the server if it fails to beat the current price. NextBay reads from and writes to that API. The trick is _where_ those calls happen. Instead of fetching from inside every component in the browser, you funnel all backend communication through a thin service layer that runs on the Next.js server. Your server components call this layer directly and render finished HTML. The browser receives a page, not a waterfall of loading spinners.

Authentication follows the same server-side instinct. When a user logs in, a route handler exchanges their credentials with DarkBay for a JWT and stores that token in an httpOnly cookie. Browser JavaScript can never read it. On every protected request, your service layer pulls the token from the cookie and attaches it as an `Authorization` header. Browsing auctions stays public; creating an auction or placing a bid requires that cookie.

The look comes from Tailwind CSS for layout and shadcn/ui for ready-made components like buttons, cards, and form inputs. Where you need form handling or shared state, you may reach for react-hook-form and zustand, but neither is required. When the app works locally, you deploy it to Vercel and connect it to your DarkBay backend running on Render.
