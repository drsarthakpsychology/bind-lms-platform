# Known Limitations

Honest, documented boundaries. None block this release, but each is a real
constraint to revisit.

## Functional
1. **Assignment upload formats beyond text/audio** are selectable in the
   admin builder but not yet functional on the student side. The student
   panel shows an honest "also accepted" notice until those upload paths ship.
2. **No enrollment table** — `is_published` is the visibility gate (documented
   in schema.sql). All students see all published courses.
3. **No automated tests** (unit/E2E). Tooling (Playwright/Vitest) not installed;
   adding is recommended before large-scale changes.
4. **No pagination** on lists — fine at small scale, needed before growth.

## Media / DRM
5. **Browser content cannot be made impossible to capture.** Signed URLs,
   no-download controls, PiP disable, and the dynamic watermark are practical
   deterrents, not DRM. A determined user can screen-record.
6. **Signed video URL window is 30 minutes** — long enough to be shared if a
   student extracts it mid-session. Per-user-bound short URLs or HLS tokens are
   a future hardening step.
7. **Native `<video>` controls** are browser-provided; their exact keyboard/ARIA
   behavior is not fully controllable.

## Infrastructure
8. **Supabase pending migrations** (`assignment_multi_submission_types.sql`,
   `submissions_insert_published_course.sql`) must be applied in the dashboard
   before multi-select assignment types + RLS tightening take effect in
   production.
9. **DNS quirk on this Mac** — the Supabase project hostname occasionally
   resolves to a slow IP. Refreshing usually recovers. App is unaffected on
   normal networks.
10. **No rate limiting** on login/submission endpoints yet (Upstash Redis
    recommended at scale).
11. **No error monitoring** (Sentry recommended for production).

## Scope (not built by design)
- Payments/subscriptions (architecture reserved)
- Certificates (admin-approval flow designed, not implemented)
- AI tutor, quizzes, analytics, multi-tenant organizations
- In-browser recording (voice/screen)
