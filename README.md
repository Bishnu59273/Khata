# Khata

A daily income/profit tracker for a CSC (Common Service Centre) shop. Every transaction
records what the customer paid, what the service actually cost, and the resulting profit —
so daily profit is visible, not just cash collected.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS, i18next (English/Hindi/Bengali, default Bengali)
- **Backend**: Node.js + Express + TypeScript
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
2. Open the SQL editor and run `backend/supabase/migrations/0001_init.sql`.
3. (Optional, for local testing) Run `backend/supabase/seed.sql` to insert a handful of sample services.
4. In your Supabase project settings, copy the **Project URL** and the **service_role key**
   (Settings → API). The service_role key must never be exposed to the frontend or committed to git.

### 2. Backend

```
cd backend
cp .env.example .env
# fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
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

Open the printed local URL (typically `http://localhost:5173`).

## Notes

- **Translations**: the Hindi (`hi`) and Bengali (`bn`) locale files under
  `frontend/src/i18n/locales/` currently hold the same English placeholder text as `en`, so the
  UI works out of the box. Replace them with real translations before this goes in front of the
  actual end user — the key structure is already in place, only the values need to change.
- **RLS**: all three tables have Row Level Security enabled with no policies for `anon`/`authenticated`,
  which denies all access by default. Only the backend, using the `service_role` key (which bypasses
  RLS), can read or write data. The frontend never talks to Supabase directly.
- **API auth gap**: the Express API itself has no authentication layer yet. This is fine for local
  development, but before deploying it publicly (e.g. to Render), add a shared-secret header check
  so the REST endpoints aren't wide open to anyone who finds the URL.
- **Deployment** (not set up yet): the frontend is intended for Vercel and the backend for Render,
  each pointed at its respective subfolder as the project root.
