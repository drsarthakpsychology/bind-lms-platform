# App API server speed (`/api/app/v1`)

Round 10, 16 Nov 2026. What made the app's screens wait on the server, what changed, and the numbers before and after.

## Where the time went

- **Region.** The functions run in Mumbai (`vercel.json` `regions: ["bom1"]`) and the database is in Mumbai too (Supabase `ap-south-1`). They are already side by side, so nothing to change there. Each database request still costs a network round trip of roughly 10 to 30 ms, and the Supabase Auth token check more.
- **Requests waiting for each other.** Almost every screen made its database requests one after another instead of together. The cost of a screen is the number of requests in its longest chain (the "serial depth"), not the total number.
- **The sign-in check on every request** waited for four requests in a row: the token check, then the profile, then the phone, then the switched-off sections.
- **Practise** counted 13 things in 9 separate steps, then made 3 more requests after that: 12 steps in a row.
- **Admin Home** made 10 steps in a row, and read the roster, the hidden accounts and 30 days of page visits (about 10,000 rows, about 300 ms in the database alone) two or three times per screen. Website route handlers have no React request cache, so `cache()` did not stop repeated reads in the app's routes.
- **Cold starts.** Live p75 times (Vercel, 9 to 16 Nov) show the first request on a fresh server instance costing far more than the rest (for example `/practise` p50 886 ms, `/home` p50 1074 ms, `/study/modules` p75 2124 ms but p50 186 ms). Part of a cold start is loading the code: `/practise` was loading every game's and tool's content just to draw the list.
- **Big answers.** `/practise/tools/wwyd` answers about 500 KB of JSON (the whole scenario bank) every time it opens. Gzip shrinks it on the wire, but it was sent in full on every open.
- **Indexes.** Checked every table the main screens read (`pg_indexes`, `EXPLAIN ANALYZE`). The tables are small and every per-student read already has a matching index. No new index is needed. One duplicate exists (`notifications_user_idx` and `notifications_user_created_idx` are the same index); dropping one is optional tidying, not speed, so no SQL file was added.

## What changed

1. **Sign-in check in one round trip** (`src/lib/app-api/guard.ts`). The token check, profile, phone and switched-off sections start together, keyed by the user id inside the token. Nothing read that way is used unless Supabase confirms the same id, the answers are still checked in the old order (bad token, no profile, paused, ended, replaced phone, gates), and the phone check writes nothing until the account has passed (`checkDevice` now takes the role as a promise). The token is still verified with Supabase on every request: no loosening. Tests: `src/lib/app-api/guard-parallel.test.ts`.
2. **Switched-off sections read once per request** (`src/lib/access/blocks.ts`), and the feature flags read shares one in-flight query (`src/lib/flags.ts`).
3. **Practise** (`src/lib/practice/practice-state.ts`, `src/lib/app-api/practise-hub.ts`). All 13 counts in one step; the last practice page and both hubs' new-case counts (one history read) start at the same time. The tab's code lives in its own file, so `/practise` no longer loads every tool's content on a cold start.
4. **One answer per request for shared reads** (`requestMemo` in `src/lib/app-api/context.ts`): the roster, the activity tables, the hidden accounts, a student's cohort access and cohort names. On the website, React's `cache()` keeps doing this as before.
5. **Admin Home** (`src/lib/admin/overview.ts`) starts every independent read at once. **Admin Students** reads the roster once instead of twice.
6. **Courses and Home** (`src/lib/course/mine.ts`, `src/components/course/course-overview.tsx`) start the cohort reads with the course reads instead of after them.
7. **ETag and 304** (`src/lib/app-api/respond.ts`, `route.ts`). Every successful JSON GET carries an `ETag`. When the app sends it back as `If-None-Match` and nothing changed, the answer is an empty 304. Answers stay `private, no-store`, so nothing between the server and the phone keeps a copy. This is what makes a repeat open of a big tool (500 KB) nearly free on mobile data. The app has to send the header for this to help (see API_CONTRACT.md, section 1).

## Numbers

Measured with `src/app/api/app/v1/perf.test.ts`: the real route code against a stand-in Supabase server that answers every request after 15 ms, so the serial depth is exact and the time shows what the waiting costs. "Cold" is a fresh server instance, "warm" the next request. Real round trips are about as long or longer, so real savings are at least this size per screen. Run it with `PERF_OUT=<file>` to print this table; the test fails if a screen's serial depth goes above these numbers again.

| Screen | Serial depth before (warm) | after (warm) | Queries before (warm) | after (warm) | Time at 15 ms per trip, before | after |
|---|---|---|---|---|---|---|
| `/home` | 6 | 3 | 23 | 21 | 140 ms | 68 ms |
| `/practise` | 12 | 2 | 20 | 18 | 193 ms | 37 ms |
| `/practise/tools/blitz` | 5 | 4 | 6 | 6 | 85 ms | 66 ms |
| `/practise/tools/wwyd` | 4 | 3 | 5 | 5 | 85 ms | 56 ms |
| `/prep` | 4 | 2 | 4 | 4 | 69 ms | 37 ms |
| `/study/modules` | 4 | 2 | 4 | 4 | 68 ms | 34 ms |
| `/study/state` | 4 | 2 | 4 | 4 | 68 ms | 35 ms |
| `/courses` | 7 | 3 | 16 | 14 | 117 ms | 54 ms |
| `/library/medicines` | 3 | 1 | 3 | 3 | 47 ms | 18 ms |
| `/me` | 3 | 2 | 5 | 5 | 49 ms | 34 ms |
| `/notifications` | 4 | 2 | 5 | 5 | 66 ms | 35 ms |
| `/leaderboards/quiz` | 4 | 3 | 7 | 7 | 65 ms | 49 ms |
| `/achievements` | 4 | 2 | 10 | 10 | 68 ms | 33 ms |
| `/admin/home` | 10 | 3 | 40 | 33 | 175 ms | 60 ms |
| `/admin/students` | 3 | 2 | 35 | 19 | 83 ms | 35 ms |

Cold (fresh instance) serial depth went down the same way: Practise 13 to 3, Admin Home 11 to 3, Home 7 to 3, Courses 8 to 3, the rest to 2 to 4.

Live before numbers (Vercel function duration, 9 to 16 Nov, few requests each, so cold starts weigh heavily): `/practise` p75 1115 ms, `/practise/tools/:tool` p75 1030 ms, `/home` p75 2273 ms, `/admin/home` p75 1161 ms, `/admin/students` p75 584 ms, `/prep` p75 795 ms. Compare the same query on the dashboard (Observability, Functions, filter `/api/app/v1`) a few days after this ships.

## Left for later

- **Admin activity in the database.** Admin screens still pull 30 days of page visits (about 10,000 rows) to work out "last seen". A small database view that answers one row per student would cut that read to a few hundred rows. It needs a database change and a careful match of the current numbers, so it is not in this round.
- **Cold starts.** Keeping big content out of routes that do not need it (as done for Practise) is the main lever. Study and Exam Prep need their content, so they stay as they are.
