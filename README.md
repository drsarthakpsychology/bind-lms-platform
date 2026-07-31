# PLMS — Secure, Invite-Only Course Platform

Prototype build following the Master Blueprint. Phase 1 (this scaffold):
project init, Tailwind v4 design tokens, Supabase client wiring, and the
database schema. Phases 2-5 (auth middleware, admin dashboard, student
player + watermark, assignments + PDF viewer) are not built yet.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the env template and fill in your Supabase project's values
   (Project Settings > API in the Supabase dashboard):
   ```bash
   cp .env.example .env.local
   ```

3. Run `supabase/schema.sql` in your Supabase project's SQL Editor.
   It creates the six core tables from the blueprint, then (Part B)
   turns on Row Level Security with policies for every table, an
   `is_admin()` helper, and a trigger that auto-creates a `profiles`
   row whenever the Admin API creates a new auth user.

   Before Phase 3, read the "ARCHITECTURE FLAG" comment in that file —
   the schema as specified has no student-to-course enrollment table,
   so right now any authenticated student can see any published course.

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Notes on this scaffold

- **Next.js 16 renamed `middleware.ts` to `proxy.ts`** and narrowed its
  role to lightweight, "optimistic" checks — no direct DB reads. `src/proxy.ts`
  refreshes the Supabase session and redirects fully-signed-out users away
  from `/dashboard` and `/admin`. The blueprint's `expires_at` and
  `active_session_token` checks (Part 3.2/3.3) need an actual database read
  against `profiles`, so per current Next.js guidance those belong in a
  shared server-side check called from each protected route group's
  `layout.tsx` in Phase 2 — not inside `proxy.ts` itself.
- **Tailwind v4** is CSS-first here — there's no `tailwind.config.ts`;
  theme tokens live in `src/app/globals.css` under `@theme inline`.
- **shadcn/ui**: the CLI (`init`/`add`) fetches component definitions from
  `ui.shadcn.com`, which this build environment couldn't reach, so
  `components.json` and `src/lib/utils.ts` were hand-written to match
  exactly what the CLI generates. `npx shadcn@latest add button` (etc.)
  should work normally once you're running this locally with full
  internet access.
