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
5. **Browser content cannot be made impossible to capture.** Segment proxy,
   AES-128 encryption, no-download controls, PiP disable, and the dynamic
   watermark are practical deterrents, not DRM. A determined technical user can
   still fetch the decryption key and reassemble the segments. DRM (Widevine/
   FairPlay) is the only real answer and is not enabled.
6. **Video now streams through an authenticated proxy, not a direct file.**
   R2 delivers segmented HLS; the stream proxy (`/api/media/stream/:lesson`)
   re-checks a 5-minute viewer-bound HMAC token + enrolment on every request,
   rewrites playlists to proxy URLs, and serves the AES-128 key only to
   authorized viewers. Existing assets without `--encrypt` are unencrypted but
   still proxy-gated. No storage key or signed URL reaches the browser.
7. **Native `<video>` controls** are browser-provided; their exact keyboard/ARIA
   behavior is not fully controllable.
8. **The rate limiter is DB-backed** (the `rate_limits` table) for the
   login/media-token endpoints, so the quota holds across serverless
   instances. The stream segment hot path uses a per-process fast limiter
   (generous abuse throttle, not a hard boundary). If DB writes become a
   bottleneck at scale, a shared store (Upstash/Redis) is the upgrade.
9. **No token-issuance audit table yet** — round 8's plan included one; it's a
   follow-up, not shipped.
10. **The stream proxy fetches objects server-side** (R2/S3 or Supabase
    Storage) and streams them back — this adds a hop versus a CDN edge. At
    large scale, a Cloudflare Worker or `R2_PUBLIC_URL` cache in front would
    reduce origin load.

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
