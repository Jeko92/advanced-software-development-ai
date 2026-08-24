# NestJS Auth — Code-Along

A hands-on practice project: one small REST API (Users, Quotes, Concerts,
API Keys, a read-only Partners API, an admin stats endpoint) implementing
six different ways to authenticate a request, each wired to the route(s)
where it actually makes sense rather than one mechanism used everywhere.

See `instructions.md` (Parts 1–11) and `oauth-instructions.md` (Part 12,
optional) for the step-by-step build log this was developed from.

## Authentication mechanisms implemented

| Mechanism | Route(s) | Guard | What it proves |
|---|---|---|---|
| Token-based (JWT) | `POST /auth/login`, `POST /quotes`, mutations on `/quotes/:id`, all of `/api-keys/*` (global default) | `JwtAuthGuard` | Stateless — server verifies a signature, no DB lookup, no server-side revocation |
| Session-based | `POST/DELETE /auth/session/*`, mutations on `/concerts/*` | `SessionAuthGuard` | Stateful — server tracks active sessions, revocable by deleting the session row |
| API key | `GET /partners/quotes`, `GET /partners/concerts` | `ApiKeyGuard` | Authenticates an application, not a person — no login, just a static secret per client |
| Basic auth | `GET /admin/stats` | `BasicAuthGuard` | Credentials sent (base64-encoded, not encrypted) on every single request |
| OAuth 2.0 — Google | `GET /auth/google`, `GET /auth/google/callback` | `GoogleAuthGuard` | Delegated auth — a third party verifies identity, this app never sees a password |
| OAuth 2.0 — GitHub | `GET /auth/github`, `GET /auth/github/callback` | `GithubAuthGuard` | Same as above, second provider, proves the pattern generalizes |

Every mechanism above ultimately funnels into the same two methods:
`AuthService.validateUser()` (password-based login: local, session, Basic)
or `UsersService.findOrCreateByEmail()` (OAuth: Google, GitHub) →
`AuthService.login()` mints the JWT. `IsAdminGuard` (role check) is shared
between the Concerts and Admin routes; nothing else is shared by design —
the point of this project is to build each mechanism for real, not to fake
four of them on top of one.

`GET` routes on `Users`, `Quotes`, and `Concerts` are intentionally public —
no guard needed to browse public data.

## Reproducing this project

```bash
git clone <this-repo>
cd bootcamp/04-nestjs/nestjs-auth/code-along
pnpm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Required? | Notes |
|---|---|---|
| `PORT` | optional | defaults to `3000` if unset |
| `DB_FILE` | **required** | e.g. `data/db.sqlite` — see the persistence note below if you run the app from more than one working directory |
| `JWT_SECRET` | **required** | see "Generating random secrets" below |
| `SESSION_SECRET` | **required** | see "Generating random secrets" below |
| `BCRYPT_SALT_ROUNDS` | optional | defaults to `12` if unset — not a secret, see below |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | only if testing Google OAuth | see "Google & GitHub OAuth" below |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` / `GITHUB_CALLBACK_URL` | only if testing GitHub OAuth | same |

Then build the database and seed it:

```bash
pnpm run migration:run
pnpm run db:seed
```

`db:seed` prints a seeded viewer (`viewer` / `viewer12345`) and admin
(`admin` / `admin12345`) account, plus a one-time raw API key — copy that
key immediately, it's only ever shown once (it's stored as a bcrypt hash,
not recoverable afterward).

Run it:

```bash
pnpm run dev     # nest start --watch
# or
pnpm run start   # single run, no watch
```

Verify everything works end-to-end with the bundled Bruno collection
(`nestjs-auth-code-along-bruno/`), using [Bruno](https://www.usebruno.com/)
or its CLI:

```bash
cd nestjs-auth-code-along-bruno
npx @usebruno/cli run --env local
```

## Why `data/db.sqlite` isn't committed

Three reasons, in order of how much they matter:

1. **It contains real secrets the moment you use the app for real** —
   bcrypt hashes of whatever passwords you test with, hashed API keys, and
   (if you complete the OAuth checkpoint below) your actual email address
   as a `username`. None of that belongs in git history, which is
   effectively permanent even if you delete the file in a later commit.
2. **It's fully reproducible from source** — `pnpm run migration:run` +
   `pnpm run db:seed` recreates an equivalent database from scratch in
   seconds. A generated artifact that cheap to rebuild doesn't need to be
   version-controlled; committing it would just create merge conflicts on
   a binary file for no benefit.
3. **Everyone doing this exercise gets their own data** — a shared,
   committed sqlite file would mean the second person to run the seed
   script either overwrites the first person's rows or hits unique-
   constraint errors on the seeded usernames.

`.gitignore` excludes `data/*.sqlite` and its `-wal`/`-shm`/`-journal`
siblings accordingly.

## Generating random secrets

`JWT_SECRET` and `SESSION_SECRET` both need to be long, unpredictable
strings — anyone who has them can forge a valid JWT or hijack a session.
Generate one with:

```bash
openssl rand -base64 32
```

Run it twice, once for each variable — **never reuse the same value for
both**, and never commit real values (`.env` is gitignored; `.env.example`
holds placeholders only).

`BCRYPT_SALT_ROUNDS` is different — it's not a secret at all (bcrypt embeds
the cost factor in plaintext inside every hash it produces), just a
performance/security tuning knob. `12` is the current OWASP-recommended
minimum; leave it unset to get that default, or lower it in a local/test
environment if hashing speed becomes annoying (never lower it in anything
resembling production).

## Google & GitHub OAuth — setup and how to prove it actually works

Full step-by-step build instructions (with code snippets) are in
`oauth-instructions.md`. Short version if you already have the code and
just need to configure + test it:

**1. Register OAuth apps and fill in `.env`:**
- Google: [Cloud Console](https://console.cloud.google.com/) → Credentials
  → OAuth client ID → redirect URI `http://localhost:3000/auth/google/callback`
- GitHub: Settings → Developer settings → OAuth Apps → New OAuth App →
  callback URL `http://localhost:3000/auth/github/callback`
- Copy each client ID/secret into `.env`'s six `GOOGLE_*`/`GITHUB_*` vars.

**2. Start the app**, then in a real browser (not curl/Bruno — this step
needs an actual consent screen):
```
http://localhost:3000/auth/google
```
Click **Allow**. You should land on `/auth/google/callback` and see raw
JSON: `{ "access_token": "eyJ..." }`. Repeat with
`http://localhost:3000/auth/github`.

**3. Prove the token is real** — copy it and hit any JWT-protected route:
```bash
curl -H "Authorization: Bearer <paste the access_token here>" \
  -X POST http://localhost:3000/quotes \
  -H "Content-Type: application/json" \
  -d '{"quote":"It works.","author":"OAuth"}'
```
`201 Created` confirms the token is valid and behaves exactly like one
issued by `POST /auth/login` — because it's built by the same
`AuthService.login()` call either way.

**4. Confirm the account was actually created (or reused) correctly:**
```bash
curl http://localhost:3000/users
```
Look for a row with `username` set to your real email and
`roles: ["viewer"]`. If you test both Google and GitHub with accounts that
share the same primary, verified email address, you should see **one** row,
not two — `UsersService.findOrCreateByEmail()` looks up by email
(case-normalized) before creating anything.

**A note on that last point:** matching across providers only works if
they report the *same* email. Google reliably does. GitHub only does if
your GitHub account's primary email is verified and matches — if it's
private or different, you'll correctly end up with a second `users` row
under whatever email GitHub does report (or a clear error if it can't find
one at all). That's expected, not a bug — it's the two providers genuinely
disagreeing about your identity, which this app can't resolve for you.

## Never commit

- `.env` (already gitignored)
- `data/*.sqlite` (already gitignored)
- Real OAuth client secrets, JWT/session secrets, or live tokens — check
  before committing anything under `nestjs-auth-code-along-bruno/`, since
  Bruno's runtime variables can occasionally get baked into a `.bru` file
  as a literal value instead of staying a `{{variable}}` reference.
