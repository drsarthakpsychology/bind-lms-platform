# Security Audit Report

OWASP-informed review of the current application. Status per finding.

## Summary
| # | Finding | Severity | Status |
|---|---------|----------|--------|
| SEC-01 | Missing security headers (CSP, X-Frame, nosniff) | Medium | FIXED |
| SEC-02 | RLS insert policy gap on submissions | Medium | FIXED (migration pending) |
| SEC-03 | Service role key exposure | Critical | ✅ NONE — server-only |
| SEC-04 | Authz on admin actions | High | ✅ PASS — all gate on requireAdmin() |
| SEC-05 | IDOR on lesson/course/submission access | High | ✅ PASS — checked server-side |
| SEC-06 | Signed URL window (30 min) | Low | Documented (practical DRM boundary) |
| SEC-07 | Secrets in repo / client bundle | Critical | ✅ PASS — .env.local gitignored; no NEXT_PUBLIC on service key |

## Details

### SEC-01 — Security headers ✅ FIXED
`next.config.ts` now serves CSP, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. Verified live on `/login`.

### SEC-02 — RLS insert gap ✅ FIXED (pending migration)
See BUG-004. New policy `submissions_insert_published_lesson` requires a published parent course (or admin).

### SEC-03 — Service role key ✅ PASS
Used only in `createAdminClient()` inside `"use server"` files (`admin/students/actions.ts`, `admin/submissions/actions.ts`, student lesson `actions.ts`). Never imported by a client component. `.env.local` is gitignored.

### SEC-04 — Admin action authorization ✅ PASS
`createStudent`, `approveSubmission`, `prepareVideoUpload`, `createLessonWithVideo`, `deleteLesson`, `attachVideoToLesson` all begin with `await requireAdmin()`, which re-validates the session (expiry + concurrent-session) server-side. Server Actions are independently invokable, so this close-the-loop is correct.

### SEC-05 — IDOR ✅ PASS
- `getPlaybackUrl(lessonId)` verifies the lesson's course is published (or caller is admin) before signing a URL.
- `submitTextAssignment` / `submitAudioAssignment` / `prepareSubmissionUpload` gate on `assertCanSubmit` (published course or admin).
- `getSubmissionAudioUrl` verifies `submission.user_id === profile.id` or admin.
- `completeAndAdvance` enforces the progression gate server-side.

### SEC-06 — Signed URL window ✅ Documented
Video URLs are signed for 30 min; audio for 15 min. A signed URL is itself the token (not per-user-bound). This is a practical deterrent, not DRM — documented honestly in `video-player.tsx`.

### SEC-07 — Secrets ✅ PASS
No hardcoded secrets; `.env.local` gitignored; service key not in client bundle.

## Recommended follow-ups (not blocking)
- Apply SEC-02 migration in the Supabase dashboard.
- Add rate limiting (Upstash Redis) for login/submission endpoints at scale.
- Add Sentry for production error monitoring.
