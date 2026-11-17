# EUROPE INTELLIGENCE (frontend prototype)

Two separate areas, each with its own sidebar, behind one login page:

| Area | Route | Who | Purpose |
| --- | --- | --- | --- |
| Login | `/login` | everyone | Single login for ADMIN and USER |
| Admin | `/admin/dashboard` | ADMIN | Dashboard Overview (`/` and `/admin` redirect here for ADMIN) |
| User Workspace | `/workspace/home` | USER, ADMIN | Home (`/` redirects here for USER) |
| User Workspace | `/workspace/overview` | USER, ADMIN | Dashboard Overview |

Authentication (users, roles, sessions) is real and stored in SQLite. Dashboard and Buyer Intent data are still
**simulated** and labelled as such in the UI ("Demo Data" badge, notice banner, "Simulated activity"). There is no AI
agent or automation engine yet.

## Run

Requires Node.js 24.7+ (uses the built-in `node:sqlite` and `crypto.argon2`).

```bash
npm install
cp .env.example .env.local   # then set DEFAULT_ADMIN_PASSWORD and DEFAULT_USER_PASSWORD
npm run dev        # http://localhost:3000/login
npm run typecheck
npm run build
```

## Authentication

- **Accounts**: on server start (`src/instrumentation.ts`) the default accounts `admin` (ADMIN) and `user_avs` (USER)
  are created if their username does not exist yet, using the passwords from `.env.local`. Existing accounts are
  never modified, so a changed password is kept. Passwords are hashed with Argon2id; no credentials live in the code.
- **Database**: `data/europe-intelligence.db` (git-ignored; override with `DATABASE_PATH`). Tables: `users`, `sessions`.
- **Sessions**: login sets an `ei_session` cookie (HttpOnly, SameSite=Lax, Secure in production) holding a random
  token. Only its SHA-256 is stored in `sessions`, with an 8 hour absolute expiry. Logout deletes the row.
- **Authorization** lives in `src/server/auth/dal.ts` and always reads the role from the database:
  - pages and layouts call `requireRole(...)`: no session goes to `/login`, an expired one to `/login?expired=1`,
    the wrong role to the user's own home (USER opening `/admin/*` lands on `/workspace/home`);
  - Route Handlers call `authorizeApi(...)`: 401 without a valid session, 403 for the wrong role.
  - `src/proxy.ts` only redirects requests without a session cookie to `/login` (optimistic, no database).
- **API**: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session` (any role),
  `GET /api/admin/users` (ADMIN only).

Every new protected page must call `requireRole` and every new protected Route Handler must call `authorizeApi`.

Stack: Next.js (App Router) + TypeScript, Tailwind CSS v4, shadcn/ui-style primitives (Radix), Lucide, Recharts.

## Adding this to an existing project

Copy `src/` (merge it in; nothing outside these files is touched) and install:

```bash
npm i lucide-react recharts clsx tailwind-merge class-variance-authority \
  @radix-ui/react-slot @radix-ui/react-dropdown-menu @radix-ui/react-tooltip @radix-ui/react-dialog geist
```

Merge the `:root` tokens and `@theme inline` block from `src/app/globals.css` into your global stylesheet.
If you use Tailwind v3, move the `@theme inline` colors into `tailwind.config` instead.

## Structure

```
src/
  app/                  layout.tsx (shell-free root), globals.css (brand tokens)
  app/page.tsx          / redirects by role (or to /login)
  app/login/            Login page (redirects signed-in users to their home)
  app/admin/            Admin layout (Admin sidebar, ADMIN only) and dashboard/page.tsx
  app/workspace/        User Workspace layout (workspace sidebar), overview/ and home/
  app/api/auth/         login, logout, session Route Handlers
  app/api/admin/users/  ADMIN-only user list
  proxy.ts              Redirects requests without a session cookie to /login
  instrumentation.ts    Creates the default accounts on server start
  server/db.ts          SQLite connection and schema (users, sessions)
  server/auth/          password (Argon2id), session, users, seed, dal (requireRole / authorizeApi)
  features/auth/        config (roles, role homes, cookie name), login form, logout button
  components/ui/        shadcn-style primitives: button, card, badge, table, dropdown-menu, tooltip,
                        input, select, textarea, sheet
  components/layout/    app-shell (sidebar state), sidebar, page-header, workspace-shell
  config/navigation.ts  Admin menu; only items with an href are functional
  config/workspace-navigation.ts  User Workspace menu (no admin or configuration entries)
  features/dashboard/
    types.ts            API contract: DashboardOverviewData
    api.ts              getDashboardOverview(range): swap the body for a real fetch later
    mock-data.ts        ALL simulated data lives here
    use-dashboard-overview.ts
    components/         KPI cards, charts, source cards, activity table, market snapshot
  lib/                  utils (cn), format helpers
```

## Connecting a real API later

1. Make an endpoint return `DashboardOverviewData` (see `types.ts`).
2. Replace the body of `getDashboardOverview` in `api.ts` with a `fetch`.
3. Return `dataStatus: "live"` from the API; the header badge switches from "Demo Data" automatically.
4. Delete `mock-data.ts`, the `SimulationNotice` and the "Simulated activity" badge.

## Buyer Intent Feed (User Workspace)

Route: `/workspace/home` (`/workspace` redirects there).

```
src/features/buyer-intents/
  types.ts          BuyerIntent (snake_case, same as the agreed data structure) + lead workflow types
  api.ts            listBuyerIntents(): swap the body for a real fetch; return dataStatus "live"
  mock-data.ts      26 FICTIONAL records (marked as demo in the UI; URLs use reserved .example domains)
  query.ts          filtering, sorting, paging (pure functions, can move server-side)
  format.ts         budget (original currency, never converted), UTC dates, safe URL parsing
  brand-logos.ts    centralized laptop-brand logo mapping
  lead-state.ts     save / status / notes / contact activity (localStorage for now)
  components/       table (exactly 7 columns), toolbar, detail drawer, logos, flags, copy button
```

- **Logos** are laptop manufacturers only, never the publishing platform. Geometry is stored locally in
  `brand-logos.ts` (Simple Icons, CC0; the Microsoft four-square mark for Microsoft Surface). Trademarks belong to
  their owners: confirm each brand's usage guidelines before production. Brands without an entry (currently
  Dynabook) show a neutral tile with the brand name; add an SVG path and its `viewBox` to `BRAND_LOGOS` and the logo
  appears automatically.
- **Budgets** keep their original currency and are never converted. Budget sorting groups by currency, then amount;
  records without a budget always sort last.
- **Country** is `null` (shown as "Unknown") when there is not enough evidence. Missing publication dates show
  "Unknown" and missing URLs show "Unavailable".
- **Lead workflow** (saved, status, notes, contact activity) is stored in the browser's localStorage until the backend
  exists. Replace the hook in `lead-state.ts` with API calls.
