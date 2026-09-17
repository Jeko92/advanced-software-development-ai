# Backend Recap Project - Challenges

This is the recap project for the backend module. You build the Trail Guide application described in the intro: one Express app that serves a public website, an admin panel, and a JSON API, all backed by the same SQLite database and the same model layer.

The project is split into four parts. Work through them in order. Each part assumes the previous one is in place. The brief gives you the goal, the concrete deliverables, and a pointer back to the session that introduced the relevant tools. It does not give you finished code. Reach back into the earlier sessions when you need a reminder of the syntax.

## 1 Database and Setup

The goal of this part is to get a project skeleton running with a connected database, a working Nunjucks layout styled by pico.css, and a seeded SQLite file. By the end you should be able to run the dev server and see a "hello" page rendered through your base template, with the database open and ready for queries.

### Project setup

- Initialize a new npm project, install `express`, `nunjucks`, `sqlite`, `sqlite3`, `sanitize-html`, and the matching `@types/*` packages plus `tsx` and `typescript` as dev dependencies.
- Add a `tsconfig.json` and an npm `dev` script that runs `tsx watch src/app.ts`.
- Create an `.env` file holding `PORT`, `DB_PATH`, and `API_KEY`, plus a committed `.env.example`. Load it with `tsx --env-file=.env` (see the environment variables material from Backend Express Advanced).
- Set up the folder structure so the rest of the project has somewhere to land:

  ```
  src/
    app.ts
    routes/
    controllers/
    models/
    middleware/
  views/
    macros/
    admin/
  public/
  ```

- download the data folder including an empty database and the seed file via `ghcd`:
  ```bash
  npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/recap-project-2 data
  ```
  Then add a script called `db:seed` to your `../../../../package.json`:
  ```
  "db:seed": "sqlite3 data/trail-guide.db < data/seed.sql"
  ```

### Pico.css and the base template

- Add a `views/base.html` Nunjucks template with `<header>`, a `<main>` content block, and `<footer>`. Include pico.css from its CDN in the `<head>`.
- Configure Nunjucks against the `views/` folder in `app.ts` and set `views` as the view engine.
- Serve `public/` as a static directory for any images or extra CSS you add later.

Refer to Backend Template Engines for the `extends`/`block` setup.

### SQLite schema

- Look at the downloaded seed.sql file. It includes a database reset, table creation and data seeding for both tables.
- Run your `db:seed` script you created earlier to initialize the database with some dummy data. Since we know now that the database is setup correctly, we don't need to add a `CREATE TABLE IF NOT EXISTS` statement in our `dbConnect` function later.

### Database module and lifecycle

- Build `src/models/db.ts` with `connectDB`, `getDB`, and `closeDB`, reading the file path from `process.env.DB_PATH`.
- Call `connectDB()` in `app.ts` before `app.listen()`.
- Register `SIGINT` and `SIGTERM` handlers that call `closeDB()` before exiting.

Refer to Backend SQL Basics for the connection module shape and the shutdown handlers.

## 2 Website

The goal of this part is the read-only public site. By the end, anyone visiting the root URL can browse all trails, click into a trail detail page, and browse trails grouped by region. Every page extends the same base layout. Trail listings reuse a single Nunjucks macro.

### Models

- In `models/regionModel.ts`, expose `getAllRegions()` and `getRegionBySlug(slug)`.
- In `models/trailModel.ts`, expose `getAllTrails()`, `getTrailBySlug(slug)`, and `getTrailsByRegionId(regionId)`. Each function that returns a trail should `INNER JOIN` `regions` on `trails.region_id` so the result includes `region_name` and `region_country` alongside the trail columns.
- Use parameterized queries for every value coming from the URL or a request body. Do not interpolate strings into SQL.

Refer to Backend SQL Basics for the typed `db.all<T[]>` and `db.get<T>` patterns, and to Backend SQL Advanced for `INNER JOIN` syntax.

### Routes and controllers

- Create `routes/websiteRoutes.ts` with these routes, each mapped to a named controller function in `controllers/trailController.ts` or `controllers/regionController.ts`:
  - `GET /` lists all trails on the home page
  - `GET /trails/:slug` shows a single trail with its region info
  - `GET /regions` lists all regions
  - `GET /regions/:slug` shows a single region with its trails
- Mount the router in `app.ts` at the root path.
- Type the route params using Express generics (`Request<{ slug: string }>`) so the controller stays type-safe.

### Views

- Build `views/index.html`, `views/trail.html`, `views/regions.html`, and `views/region.html`. Each one extends `base.html` and fills the content block.
- Build `views/macros/trailCard.html` with a single `trailCard(trail)` macro that renders one trail as a pico.css `<article>` with a difficulty badge and a link to its detail page. Use this macro in both the home page and the region detail page.
- Keep formatting concerns (turning `created_at` into a readable date) in a util function that is used in the controller, not in the model or the template.

Refer to Backend MVC Pattern for the controller signature and the routes-to-controller mapping, and to Backend Template Engines for macros and `extends`/`block`.

### Request logger

- Add `middleware/logger.ts` that writes one line per request to `logs/access.log` after the response finishes. Each line should include timestamp, method, URL, and status.
- Register it in `app.ts` before the routers so it captures every request, including the API and admin routes you add later.

Refer to Backend Express Advanced for the logger middleware example with `res.on("finish", ...)`.

## 3 Admin Panel

The goal of this part is HTML-form-based CRUD for trails. By the end, an editor can list, create, edit, and delete trails through a separate set of pages mounted at `/admin`. The admin panel reuses the model functions from part 2 and adds three more for the write paths.

### Routes and controllers

- Create `routes/adminRoutes.ts` mounted at `/admin`, with handlers in `controllers/adminController.ts`:
  - `GET /admin` lists all trails with edit and delete buttons
  - `GET /admin/trails/new` and `POST /admin/trails`
  - `GET /admin/trails/:id/edit` and `POST /admin/trails/:id`
  - `POST /admin/trails/:id/delete`
- Each `POST` handler responds with a redirect back to `/admin` after the model call succeeds.
- For the add and edit forms, render a select drop down list of all available regions in the template. Make sure to get the regions from the database and render the select based on this data.

### Models

- Add `getTrailById(id)`, `addTrail(data)`, `updateTrail(id, data)`, and `deleteTrail(id)` to `trailModel.ts`. Use parameterized queries for every column. Make sure to update the slug based on the new title.

### Form parsing and sanitization

- Register `express.urlencoded({ extended: true })` in `app.ts` so `req.body` is populated for form submissions.

### Views

- Build `views/admin/list.html` (table of trails with action buttons) and `views/admin/form.html` (one form reused for both create and edit). Both extend `base.html`.

Refer to Backend MVC Pattern's admin CRUD challenge for the same pattern applied to a blog. The shape is identical here, only the entity changes.

## 4 Public REST API

The goal of this part is the JSON surface at `/api`. Read endpoints are open to anyone. Write endpoints require an `x-api-key` header that matches the value in `.env`. Controllers reuse the same model functions you already wrote — only the response format changes.

### Routes and controllers

- Create `routes/apiRoutes.ts` mounted at `/api`, with handlers split between `controllers/apiTrailController.ts` and `controllers/apiRegionController.ts`:
  - `GET /api/trails` returns all trails. Support optional `?region=<slug>` and `?difficulty=<easy|moderate|hard>` filters via `req.query`.
  - `GET /api/trails/:slug` returns a single trail joined with its region, or `404` if missing.
  - `GET /api/regions` returns all regions.
  - `GET /api/regions/:slug/trails` returns the trails belonging to one region, or `404` if the region does not exist.
  - `POST /api/trails` creates a trail from a JSON body. Respond with `201` and the created resource.
  - `PATCH /api/trails/:id` updates the given fields. Respond with `200` and the updated resource, or `404`.
  - `DELETE /api/trails/:id` deletes the trail. Respond with `204`, or `404` if it does not exist.
- Register `express.json()` in `app.ts`.

### API key middleware

- Add `middleware/apiKey.ts`. The middleware reads `req.header("x-api-key")` and compares it to `process.env.API_KEY`. If the header is missing or does not match, respond with `401` and a JSON error body. Otherwise call `next()`.
- Apply the middleware only to the write endpoints, not to the read endpoints. The cleanest way is to attach it directly to the `POST`, `PATCH`, and `DELETE` route definitions inside `apiRoutes.ts`.

### Validation and status codes

- Reject create and update bodies that are missing required fields with `400` and a JSON error message. A simple field-by-field check is enough — there is no need to introduce a validation library.
- Respond with `404` whenever a slug does not match an existing record.
- Respond with `204` for successful deletes (no body).

Refer to Backend Basics and Express for the status code conventions and `res.status().json()`, and to Backend Express Advanced for the middleware signature and `next()`.

## Bonus Challenges

Pick one or more if you finish the four parts early.

- **Tags as many-to-many.** Add a `tags` table and a `trail_tags` junction table. Let admins attach one or more tags to a trail. Expose the tag list on the trail detail page and as part of the JSON shape.
- **Search.** Add a `?q=` filter on `GET /api/trails` and on the home page that matches against the trail title using `LIKE '%...%'`.
- **Pagination.** Support `?page=` and `?pageSize=` on the home page and on `GET /api/trails`. Return `total`, `page`, and `pageSize` alongside the items in the API response.
- **rate limiting API acess** Track the number of write requests for the API key in memory and reject calls that exceed a threshold within a time window with `429`.
