# Lumen — Secure, Invite-Only Course Platform

Private course platform for serious learners. Invite-only accounts, no public
sign-up: an admin creates students directly via the Supabase Admin API, and each
account's access window is controlled server-side.

## What's built

- **Auth** — password sign-in via Supabase Auth; session refresh in the
  `src/proxy.ts` thin proxy (Next.js 16 renamed `middleware.ts` to `proxy.ts`
  and narrowed its role to lightweight, optimistic checks). Access-window
  enforcement (expiry + single active session) is done server-side in the
  protected route groups' layouts, not in the proxy.
- **Admin dashboard** (`/admin`) — overview stats, student management
  (create users directly, no sign-up form), course management (create/edit,
  lessons, video uploads, publish toggle), and an assignment-submission review
  queue (approve/reject).
- **Student experience** (`/dashboard`, `/courses/...`) — sidebar course
  player with a complete-and-continue flow, lesson video player, typed lesson
  notes, and assignment submission (text or recorded audio) with
  resubmit-while-pending.
- **Progression gate** — lesson completion is enforced server-side; students
  can't skip ahead past incomplete lessons or access unpublished courses
  (admins can preview drafts).
- **Design system — "Soft Brutalism"** — signal-orange on warm paper, 2px ink
  borders, hard offset shadows. Light/dark mode via `next-themes` (class-based).
  Shared component library in `src/components/` (shadcn-style UI primitives,
  navigation shell, design-system building blocks). Product identity in
  `src/lib/brand.ts`.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Supabase** (Auth + Postgres + Storage) with Row Level Security
- **Tailwind CSS v4** — CSS-first theming, no `tailwind.config.ts`; tokens live
  in `src/app/globals.css` under `@theme inline`
- **shadcn/ui** conventions — `components.json` and `src/lib/utils.ts`
- **react-hook-form + zod** for forms

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
   Part A creates the six core tables from the blueprint (`profiles`,
   `courses`, `lessons`, `progress`, `assignments`, `submissions`); Part B
   turns on Row Level Security with policies for every table, an `is_admin()`
   helper, and a trigger that auto-creates a `profiles` row whenever the Admin
   API creates a new auth user.

4. Set up storage buckets. The SQL in
   `supabase/migrations_pending/` creates a private storage bucket for audio
   submissions (same admin-only RLS pattern as the videos bucket).

5. Start the dev server:
   ```bash
   npm run dev
   ```

## Routes

| Route | Access |
| --- | --- |
| `/login` | Public — sign in |
| `/expired` | Public — shown when an access window has ended |
| `/dashboard` | Authenticated |
| `/courses/[courseId]` | Authenticated; published courses (admins preview drafts) |
| `/courses/[courseId]/lessons/[lessonId]` | Authenticated; progression-gated |
| `/admin` (+ students, courses, submissions) | Admins only |

## Known architecture note

There is no student-to-course **enrollment** table — `is_published = true` is
the visibility gate, so every authenticated student can see every published
course (and unpublished courses are invisible to non-admins, enforced in code).
That suits an "all students, all courses" cohort. For manual per-student
enrollment, uncomment the `course_enrollments` table in `supabase/schema.sql`
and swap the visibility policies for "published AND enrolled."

## Notes

- `proxy.ts` intentionally does **not** do DB-backed authorization — per
  current Next.js guidance, DB reads belong in the shared server-side checks
  called from each protected route group's `layout.tsx`.
- shadcn components are vendored into `src/components/ui/` (the build
  environment can't reach `ui.shadcn.com` at init time), so they can be edited
  directly without the CLI.
