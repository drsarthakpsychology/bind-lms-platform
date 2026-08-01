# Bug Report

Tracked during the enterprise QA pass. Status: FIXED unless noted.

---

## BUG-001 — Dashboard 500 after login (RSC serialization error)

- **Severity:** Critical
- **Priority:** P0
- **Affected files:** `src/components/app-shell.tsx`, `src/components/navigation/mobile-nav.tsx`, `src/components/navigation/nav-items.tsx`, `src/components/navigation/nav-config.ts`
- **Affected users:** All authenticated users visiting `/dashboard` (and any authenticated route under the app shell)
- **Reproduction:** Log in, navigate to `/dashboard`. Server returns 500, error digest `1621801304`.
- **Expected:** Dashboard renders the course list.
- **Actual:** 500 with *"Functions cannot be passed directly to Client Components…"*.
- **Root cause:** Two unsafely-serialized values crossed the Server→Client boundary:
  1. `app-shell.tsx` built a `<form action={logout}>` (a Server Component element carrying a server-action reference) and passed it as a prop to the Client Component `MobileNav`.
  2. `nav-config.ts` stored Lucide icon *components* (functions) in `NavItem.icon` and passed the array into the Client Component `NavItems`.
- **Fix applied:**
  - `MobileNav` renders its own `<form action={logout}>` (imports the action directly — the supported pattern).
  - Icons referenced by string name (`"layoutDashboard"`, etc.), resolved through a `NAV_ICONS` map inside the client module graph.
- **Regression test:** Authenticated `/dashboard` and `/admin` return 200 with full nav. (T3/T4/T9)

---

## BUG-002 — Fullscreen video drops the watermark

- **Severity:** Medium
- **Priority:** P1
- **Affected files:** `video-player.tsx`, `watermark.tsx`
- **Affected users:** Students watching video in fullscreen.
- **Reproduction:** Enter fullscreen via native video control; watermark (email/IP/timestamp) disappears.
- **Expected:** Watermark stays visible in fullscreen.
- **Actual:** Watermark absent in fullscreen (only the `<video>` element is promoted).
- **Root cause:** Native fullscreen was applied to the `<video>`, leaving the sibling watermark behind.
- **Fix applied:** Fullscreen is requested on the **wrapper** (video + watermark) via an explicit fullscreen button; the wrapper contains both, so the watermark persists. `disablePictureInPicture` added.
- **Regression test:** T5.

---

## BUG-003 — No security headers served

- **Severity:** Medium
- **Priority:** P1
- **Affected files:** `next.config.ts`
- **Affected users:** All.
- **Reproduction:** Inspect response headers on any route.
- **Expected:** CSP, X-Frame-Options, nosniff, Referrer-Policy.
- **Actual:** None.
- **Root cause:** No `headers()` configured.
- **Fix applied:** Added `next.config.ts` headers for every route (see SECURITY_BUG_REPORT.md).
- **Regression test:** T16.

---

## BUG-004 — RLS insert policy allows submission to any assignment

- **Severity:** Medium (defense-in-depth)
- **Priority:** P1
- **Affected files:** `supabase/schema.sql`, new `supabase/migrations_pending/submissions_insert_published_course.sql`
- **Affected users:** N/A (exploit requires bypassing the app layer).
- **Reproduction:** Direct POST to `/rest/v1/submissions` with a valid anon JWT and an arbitrary assignment id in an unpublished course.
- **Expected:** Rejected.
- **Actual:** Allowed (policy only checked `auth.uid() = user_id`).
- **Root cause:** Insert policy didn't verify the parent assignment belongs to a published course.
- **Fix applied:** Migration adds a tighter insert policy requiring a published parent lesson (or admin). Awaiting application in the Supabase dashboard.
- **Regression test:** RLS review in SECURITY_BUG_REPORT.md.
