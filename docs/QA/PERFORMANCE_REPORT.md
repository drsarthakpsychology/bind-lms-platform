# Performance Report

## Bundle / build
- Production build (Next.js 16, Turbopack): **2.3s compile**, 11 routes, TypeScript clean.
- No heavy client deps beyond radix-ui, motion, lucide, react-hook-form.
- Route-level code splitting via App Router.

## Runtime (local dev smoke test)
| Metric | Value |
|--------|-------|
| /login first paint | ~400ms (SSR) |
| /login subsequent | ~30–60ms |
| /dashboard (auth) | ~300ms server render |
| TTFB (production Vercel) | ~0.5s edge, ~1.1s alias |

## Video
- Signed URL playback streams from Supabase storage directly to the `<video>` element (no app proxying).
- Progress ping every 10s is a single lightweight upsert.

## Data access
- Dashboard: 3 parallel queries (courses, lessons, progress).
- Lesson page: `Promise.all` of lesson/courseLessons/user/assignment, plus one more for existing submission.
- Server actions each do a bounded number of queries; session check is `cache()`d per request.

## Potential optimizations (not blocking)
- Add `react-query`/SWR for client-side caching if query volume grows.
- Consider Supabase PostgREST prepared-statement caching on hot queries.
- Image assets are minimal; add next/image once images appear.
- No pagination needed yet (small datasets); add before scale.

## Known limits
- No CDN caching headers on signed media (by design — signed URLs are short-lived).
- 30-min signed video URLs are a security trade-off, not a perf issue.
