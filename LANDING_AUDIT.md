# LANDING AUDIT — VIBHA School of Psychology public site

Phase 1 findings, verified against the repo at HEAD. The public site must not
break anything behind it; this is the map of what's there.

## Framework & architecture
- **Next.js 16** (App Router). `proxy.ts` is the middleware (narrowed role-based
  edge routing). Per AGENTS.md, APIs/conventions may differ from training data —
  read `node_modules/next/dist/docs/` before touching routing/caching/metadata.
- **Tailwind v4, CSS-first.** NO `tailwind.config.ts`. Tokens live in
  `src/app/globals.css` under `@theme inline`. External snippets assuming a
  config file will fail silently.
- Route groups: `(dashboard)` holds the whole LMS (student + admin). Non-dashboard
  routes: `/` (root), `/login`, `/expired`, `/verify/[certificateId]`.
- Server components by default; `"use client"` only where interactivity needs it.

## Entry point (the one change point)
- `src/app/page.tsx` is a 5-line server component:
  ```ts
  const session = await getSession();
  redirect(session.status === "ok" ? "/dashboard" : "/login");
  ```
  Authenticated → `/dashboard`. Anonymous → currently `/login`. The landing page
  replaces the `/login` redirect for anonymous users. Auth guards live in the
  route-group layouts via `src/lib/auth/guards.ts` (requireSession/requireAdmin),
  NOT in this file — changing it structurally cannot weaken protection.

## Authentication
- `src/lib/auth/session.ts` — getSession returns `{ status, profile }`. Statuses:
  ok / unauthenticated / expired / session_replaced.
- `src/lib/auth/guards.ts` — `requireSession()` → Profile or null,
  `requireAdmin()` → Profile or null, `isAlumni()`. Applied in `(dashboard)/layout.tsx`
  and `admin/layout.tsx` (admin role gate redirects to /dashboard).
- `/login` is self-contained (reads BRAND, LoginForm). Untouched by this build.

## Design system (the visual contract)
- **Palette** (globals.css `:root`): `--background #fff6ef` cream, `--foreground #1e1e14`
  ink, `--card #fffdf9` paper, `--primary #f4a261` peach, `--secondary/--accent #ffe6d5`
  soft peach, `--muted #fff6ef`, `--border/--input #1e1e14` ink rules, `--ring #f4a261`,
  `--hard-shadow-color #1e1e14`. Status tones (success/warn/danger) are separate.
- **`@theme inline`** maps tokens to Tailwind namespaces (`bg-card`, `text-ink`,
  `border-border`, `bg-primary`…). No new colours.
- **Language**: neo-brutalist pastel. 2px ink borders, hard offset shadows
  (`hard-shadow-sm/md/flat` utilities), 6px radii (`rounded-md`), 8px grid spacing.
- Typography scale: `text-h1`, `text-h2`, `text-base`, `text-small`, `text-caption`,
  `text-eyebrow` (uppercase tracking-wide). Font stack in globals.css (system-first).

## Components (reusable / dashboard-specific)
- `src/components/ui/` — shadcn/ui vendored: button, card, badge, input, textarea,
  label, form, sheet, dialog, tabs, select, table, separator, skeleton, sonner, etc.
- `button.tsx` — `buttonVariants` CVA: variant (default/secondary/outline/ghost/
  destructive/link) + size. Card has `cardVariants` (interactive/raised).
- `src/components/` — app-shell, navigation (sidebar/mobile-nav/bottom-tab-bar/
  nav-config), search palette, practice/*. None are needed on the public site
  except design-system primitives + theme toggle pattern.
- `src/components/design-system/` — PageHeader, StatCard, EmptyState.

## Assets & branding
- `src/lib/brand.ts` — SINGLE source of truth. Now `VIBHA School of Psychology` /
  shortName `VIBHA` / tagline / description / parent `VIBHA Healing Centre` /
  lead `Dr. Sarthak Dave, MBBS, MD (Psychiatry)`. Every render site reads BRAND.*.
- Login, app-shell, sidebar, mobile-nav all render `BRAND.shortName`/`name` — a
  one-file rename propagates everywhere.
- Favicon: `src/app/favicon.ico` carries an outdated glyph — replace with a
  VIBHA mark. No logo assets; hero uses typography + ink-line abstraction.
- No faculty/outcomes/statistics data exists in the repo — the "Who is building
  this" section must not fabricate any.

## Config
- `package.json`: `motion` installed (use it, no new animation lib). `lucide-react`
  icons. `zod` for validation. `@supabase/supabase-js`.
- `next.config` + `.env.example` standard. `rate-limit.ts` exists for the /enquire
  guard. No email provider is wired (no resend package) — the /enquire
  confirmation is honest in-app copy; admin notification is deferred (no provider).
- Invite-only: NO signup/apply/waitlist route exists. CTA must be honest → `/enquire`.

## Rename scope
- User-facing name sources: `brand.ts`, `passport-pdf.ts` footer (now BRAND.name),
  `landmark/cases.ts` comment. All render sites already use BRAND.*.
- Docs/seeds/e2e/migrations are being swept to the new name by a subagent (test email
  `Test@vibha.test` must stay in sync across seed + e2e).
