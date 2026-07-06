# Khata

**Khata** (Hindi/Bengali for "ledger") is a daily income and profit tracker built for small
service shops in India — CSCs (Common Service Centres), cyber cafés, Xerox/DTP shops, and
similar counters that resell government or utility services (printing, form filling, bill
payments, ID card services, etc.) for a fixed customer charge, while paying a smaller portal/
vendor cost to actually deliver the service.

The gap Khata closes: most shop owners only track cash collected, not what they actually paid
out to third-party portals for each service — so they don't have a clear, day-to-day view of
real profit. Khata records both sides of every transaction (what the customer paid vs. what the
service cost) and turns the difference into a profit figure you can see at a glance.

## What you can do with it

- **Run one login per shop, multiple staff.** Sign up once to create a shop account; the shop
  owns all of its services, transactions, and expenses. Authentication is a simple email +
  password login backed by an httpOnly session cookie.
- **Define your services once.** Each service (e.g. "Xerox", "Passport Photo", "Aadhaar Update")
  has a name (English/Hindi/Bengali), an emoji icon, a default customer charge, and a default
  portal cost. Profit per unit is shown automatically.
- **Log a transaction in two taps.** Pick a service, and its default charge/cost are pre-filled.
  Adjust the quantity to record several units of the same service in one entry (e.g. 100 Xerox
  copies) instead of adding the same transaction 100 times — the charge and cost scale
  automatically, and can still be overridden by hand (discounts, custom pricing, etc.).
- **See today at a glance.** The dashboard shows today's profit, total collected, total cost, and
  transaction count, plus a preview of today's transactions (first 25, with a "Show all" link to
  the full list once there are more).
- **Browse full history with pagination.** The "All Transactions" page paginates 50 rows at a
  time instead of loading the entire history at once.
- **Run reports over a date range.** Today / this week / this month / a custom range, with
  totals and a 7-day profit trend chart.
- **Track expenses** separately from service transactions (rent, electricity, stationery, etc.).
- **Use it in English, Hindi, or Bengali** — the UI language is switchable and defaults to
  English.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS, i18next (English/Hindi/Bengali, default English)
- **Backend**: Node.js + Express + TypeScript, JWT-based sessions in a signed httpOnly cookie
- **Database**: PostgreSQL via Supabase, accessed only from the backend using the `service_role` key

## Project layout

```
backend/    Express API + Supabase migrations
frontend/   React app
```

Each is an independent Node project — see their own `.env.example` for required configuration.

## First-time setup

### 1. Create the Supabase project and schema

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run every file in `backend/supabase/migrations/` **in order**
   (`0001_init.sql`, `0002_auth_and_multitenancy.sql`, `0003_service_emoji.sql`,
   `0004_transaction_quantity.sql`). There is no migration-runner CLI wired up yet — apply each
   one manually.
3. (Optional, for local testing) Run `backend/supabase/seed.sql` to insert a handful of sample
   services. Note that migration `0002` truncates `services`/`transactions`/`expenses` as part of
   adding multi-tenancy, so seed *after* running all migrations.
4. In your Supabase project settings, copy the **Project URL** and the **service_role key**
   (Settings → API). The service_role key must never be exposed to the frontend or committed to git.

### 2. Backend

```
cd backend
cp .env.example .env
# fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and JWT_SECRET in .env
npm install
npm run dev
```

The API listens on `http://localhost:4000` by default.

### 3. Frontend

```
cd frontend
cp .env.example .env
# VITE_API_BASE_URL defaults to http://localhost:4000/api, adjust if needed
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). Sign up to create your shop
account, then add your services before logging transactions.

## Notes

- **RLS**: all tables have Row Level Security enabled with no policies for `anon`/`authenticated`,
  which denies all access by default. Only the backend, using the `service_role` key (which bypasses
  RLS), can read or write data. The frontend never talks to Supabase directly.
- **Multi-tenancy**: every service, transaction, and expense row is scoped to a `shop_id`. The
  backend derives `shop_id` from the signed session cookie on every request, so shops can never
  see or modify each other's data.
- **Health check**: `GET /health` (outside the `/api` prefix, no auth) returns `200 {"status":"ok"}`.
  Point an uptime monitor (e.g. UptimeRobot) at it every 5 minutes to keep a free-tier Render
  instance from idling out.
- **Deployment**: the frontend is intended for Vercel and the backend for Render, each pointed at
  its respective subfolder as the project root.
