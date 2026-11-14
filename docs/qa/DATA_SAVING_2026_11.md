# Data saving check, November 2026

Owner reports: "A lot of times students' information has not been getting
registered." and "Students marked lectures or notes complete, or read them,
but it did not update."

Branch `agent/dataflow`. Checked against the live database (read-only) and
the Vercel production logs for 7 November to 14 November 2026.

## What the evidence showed

- **The database refused almost nothing.** Supabase API logs for the week show
  no row level security, constraint or column errors on student writes. The
  only refusals were expected duplicates (`xp_ledger_once`, `hint_ledger`).
  So most lost work never reached the database at all.
- **Stale tabs after a deployment.** Vercel logged 328 warnings in 7 days; in
  the 100 newest, 79 were `Failed to find Server Action`, almost all `POST
  /courses/:id/lessons/:id` every 10 seconds. That is the lecture progress ping
  from a tab opened before a new deployment. Every Server Action id changes
  with each deployment, so that tab could save nothing until it was reloaded,
  and the failure was never shown. With several deployments a day this is the
  biggest single cause.
- **Older copies wiping newer marks.** The Learn state (Study sections done,
  notes read, tests, daily goal, streak) is one JSON row per student. Each save
  replaced it wholesale. A second open tab (its study timer saves every minute
  and on every tab switch) sent its older copy and wiped the section or note
  the student had just marked in another tab.
- **Server pages rendered before the save landed.** Home's Continue card,
  /progress, /journey, the course page and the lecture page read from the
  database. The mark's save left the browser 600 ms after the click, so the
  next page usually rendered the old value and kept it until a reload.
- Runtime errors: the only runtime error group was a Cloudflare R2 outage
  (`getObjectBuffer failed: ServiceUnavailable`, 11 times on 13 November),
  video only, not a save path.

## What changed for every save

- **Outbox** (`src/lib/save/outbox.ts`, `src/lib/save/client.ts`): student
  work is written to localStorage first, then sent. It leaves only when the
  server says it is stored (or can never be). Retries wait 2 s, 5 s, 15 s, 30 s,
  1 min, 2 min, then every 5 min; also on reconnect, when the tab is shown
  again, on leaving the page (beacon) and on the next page load. Saves are
  stamped with the student, so a shared computer never writes one student's
  work into another's record. Storage blocked or full: it carries on in memory.
- **`/api/save`**: a plain route, not a Server Action, so its address survives
  deployments. Answers per save: stored, try again, or drop.
- **"Couldn't save, retrying"** note (`src/components/save/save-status.tsx`),
  mounted once in the dashboard layout. Also "Sign in again to keep your work"
  when signed out, and "New version ready. Reload to keep saving." with a
  Reload button when a Server Action hits a newer deployment.
- **`trySave()`** for saves that still go straight to a Server Action or route:
  retried on a dropped connection or server error, with the note showing.
- **`withRetry()`** on the server (`src/lib/save/retry.ts`): passing database
  errors (connection, timeout, lock) are retried twice; lasting ones are not.
- **`RefreshOnSave`** on Home, /progress, /journey, the course page and the
  lecture page: refreshes the page when a save it shows has landed.
- **`deploymentId`** in `next.config.ts`: a tab from an old deployment reloads
  on its next page change.

## Each write path

| Path | Status before | Problem | Fix |
|---|---|---|---|
| Lecture progress (pingProgress) | Broken after deploys | Unawaited, failure ignored; stale tabs failed every 10 s; last seconds lost on leaving; no save on pause | Outbox via /api/save; saves on pause and on leaving; DB retry; failures logged |
| Lecture auto-complete at 90% | Saved, not shown | Page kept "Mark complete" until reload | pingProgress reports the moment a lecture completes; the lecture page refreshes |
| "Mark complete" / "Next lesson" | Silent failure | Write result ignored, student moved on anyway; a stale tab did nothing (promise rejected unseen) | Write checked and retried; on failure the mark is queued in the outbox and the student moves on; stale tab queues and loads fresh |
| Progress rows (table `progress`) | OK | RLS insert/update own, PK matches onConflict; `updated_at` trigger never created | Code sets `updated_at` on every write; migration adds the trigger |
| Study sections, checkpoints, module tests, learn state | Lost updates | Older copy replaced the stored one; local copy with work the server lacked was only sent with the next change; tab close inside the 600 ms wait lost it | Server joins the stored row (marks never go back); tabs share marks; copy sent on load when ahead; outbox; pagehide flush |
| One-page notes read | Lost updates | Same as learn state | Same fix |
| Module and course percentages, Home Continue card | Stale | Rendered before the save landed | RefreshOnSave |
| Study bookmarks and notes (study_marks) | OK | Browser copy re-sent on next load | No change |
| Prep answers, prep_seen, mocks | Mostly OK | Answer write failures swallowed; `md-psychiatry` goal fails the CHECK (goal picking is off today) | Retry and log on prep_answers; migration widens the CHECK |
| Answer history | Lossy | Fire and forget, `.catch(() => {})` | Outbox (kept until stored); server retry and logging |
| Learning events (learn_events) | Lossy | In-memory queue and beacon; a failed insert answered 204 and was dropped | Outbox; route answers 503 on failure so it is kept |
| Hints and XP (hint_ledger, xp_ledger) | OK | Writes report results explicitly; duplicates are the intended once-only guard | No change |
| Streaks and daily goal | Daily goal and Learn streak: see learn state. Clinic streak: wrong | Clinic route's "was yesterday" was a date string (always true), so a gap still grew the streak | Compared with today; IST helpers `nextDay`, `istWeekMonday` |
| Games: daily, sort, matches, blitz, games2 | OK | Service-role writes with checked errors; tables and unique keys match | No change |
| Game answers graded per answer (MSE lab, Escape, Rx), study map practice, quiz attempts | Lossy | `.catch(() => {})` | trySave |
| MSE, OSCE, formulation attempts | Feature off (0 rows ever, flags `off`) | OSCE and formulation saves swallowed failures | trySave; rate limit fix |
| Journal | OK (feature off) | Rate limit failed closed | rateLimitWrite |
| Weekly check-in | Broken on re-submit | No UPDATE policy on `checkins`, so the upsert's update was refused; week label used the UTC Monday (wrong before 5:30 am IST Monday) | Server key for the write; IST week worked out on the server; migration adds the policy |
| Doubts and replies | OK | Service-role writes; rate limit failed closed | rateLimitWrite |
| Library notes, SCT, rounds, competency, supervision, chain | OK | Rate limit failed closed (a counter outage answered "slow down" and dropped the work) | rateLimitWrite |
| Achievements | OK | Service role, awarded after the save | No change |
| Profile and settings (details, mobile) | OK | Trigger allows name and mobile; CHECK on mobile matches the code | No change |
| Tip dismissals | OK | Insert with ignoreDuplicates (no UPDATE policy needed); browser copy re-sent on load | No change |
| Supervision log date | Wrong date | Default used the UTC date | IST date |

Session and role checks: students, alumni and lecture-only accounts all pass
the save checks. Admin and view-admin previews deliberately save nothing to
the student model. A student signed in on a second device is signed out on the
first (by design); their unsent work now waits in the outbox and goes up when
they sign in again on that browser.

## Database step for the owner

`supabase/migrations_pending/2026_11_14_data_fixes.sql` (safe, idempotent):

1. `checkins_update_own` policy.
2. `prep_profile.goal` CHECK allows `md-psychiatry`.
3. `progress.updated_at` trigger.

The code works without it.

## Owner step in Vercel (recommended)

Turn on **Skew Protection** (Project, Settings, Advanced). Then a tab opened
before a deployment keeps talking to its own deployment, and no Server Action
call fails after a deploy at all. The code changes above cover the saves
either way.

## Left as is

- Journal content has two CHECKs (8000 and 20000 characters); the code allows
  8000, so they agree. Harmless, not changed.
- Other Server Actions in an old tab (prep check, game grading) still fail
  until reload; the student now sees the reload note instead of nothing.
