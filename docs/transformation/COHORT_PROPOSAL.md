# Multi-cohort and unlimited content: current state and proposal

Status: **proposal only.** Nothing in this document has been implemented,
and no database change has been made. Every statement about the code cites
the file it comes from. The live database could not be inspected (the
Supabase connector failed to connect), so "exists" below means "exists in
code and migration files".

---

## 1. How cohorts work today

The platform already has a real cohort system (`docs/COHORTS.md`,
`supabase/migrations_pending/2026_11_cohorts.sql`):

| Piece | What exists |
|---|---|
| `cohorts` table | `name` (unique), `course_id`, `starts_on`, `ends_on`, `status` ∈ upcoming / active / ended |
| `cohort_members` | `(cohort_id, user_id)` primary key, `added_at`, `added_by`. **A student can already be in several cohorts.** |
| `lesson_cohorts` | which lectures each cohort may watch (Lectures tab: share by week / all / none) |
| `lesson_grants` | one extra lecture for one person |
| Admin UI | `/admin/cohorts` (list with member and lecture counts, create, add people by pasting emails with access level and login link), `/admin/cohorts/[id]` (members, lectures), `/admin/cohorts/student/[id]` (a person's cohorts, scope, extra lectures, details) |
| Rules | `src/lib/cohorts/rules.ts` (tested), enforced in the lecture list, lecture page, playback token and stream |
| Shared content | Notes, Games, Lab, Practice are shared by everyone; only **lectures** are per cohort |
| Leaderboard | already scoped to "your cohort" (`src/lib/standing/board.ts`) |

The migration is not in the `APPROVED` list of `scripts/apply-migrations.ts`;
the code tolerates the tables being missing (`tablesMissing` in
`src/lib/cohorts/admin-data.ts`). **Whether it is applied in production needs
confirming.**

## 2. What stops cohorts being managed independently today

1. **History is deleted, not kept.** Removing someone, or changing their
   cohorts, deletes the `cohort_members` row
   (`admin/cohorts/actions.ts:183` and `:200`). There is no record that a
   student was in Cohort 1, when they left, or that they transferred.
2. **No per-enrolment status.** A membership is either there or not; there
   is no enrolled / completed / withdrawn / transferred / deferred.
3. **Progress is per person, not per enrolment.** Lecture progress, test
   scores, Learn state, submissions and sim scores all key on `user_id`
   only. Cohort reports therefore show a person's *whole* history under
   whichever cohort they are in *now*; a student who repeats in Cohort 2
   carries Cohort 1's progress with them.
4. **Assessments and schedules are global.** Assignment due dates live on
   `assignments` (one per lesson) and the calendar is per course
   (`course_weeks`, `/api/cohort-calendar`); two cohorts on the same course
   cannot have different deadlines.
5. **No cohort filter across admin pages.** Only a few admin pages read
   cohort data (activity, access, students link to cohorts). Learning
   insights, Progress (pulse), submissions, check-ins, sim review and emails
   do not filter by cohort, and there is no shared "selected cohort" control.
6. **Programme vs course.** A cohort points at one `course` (the lecture
   container). Notes/Games/Practice are not part of any course. There is no
   "programme" entity; today, the course effectively is the programme.
7. **Public copy is hard-wired to "Cohort One"** (`src/lib/brand.ts`).

## 3. Proposed data model (additive; nothing dropped or renamed)

```
programmes (optional; see question 2)
  └─ courses (existing, reused across cohorts; never duplicated)
       └─ cohorts (existing) + programme_id, timezone, archived_at
            ├─ cohort_members (existing; becomes the CURRENT view)
            ├─ cohort_enrolments  NEW: one row per enrolment, never deleted
            │     id, cohort_id, user_id, status (enrolled|completed|withdrawn|transferred|deferred),
            │     enrolled_at, ended_at, ended_reason, transferred_to (enrolment id), changed_by
            ├─ cohort_schedule    NEW: per-cohort dates for weeks / live sessions
            ├─ cohort_assessment_overrides NEW: per-cohort due date / open / closed for an assignment
            └─ cohort_announcements NEW (or a cohort_id on the existing email log)
```

- `cohort_members` stays (every current check keeps working). It is kept in
  sync with "enrolments whose status is enrolled", by the same server
  actions, so nothing that reads it today changes.
- A one-time backfill creates an `enrolled` enrolment for every current
  member (Cohort 1). Additive; no row is updated or deleted.
- **Removing** a student sets `status = withdrawn` and `ended_at`.
  **Transferring** closes the old enrolment as `transferred` and opens a new
  one linked to it. **Completing** a cohort marks its enrolments
  `completed`. Nothing is ever deleted, so history is always available.
- **Progress per cohort** (recommended approach): keep progress per person
  (no change to how it is stored) and attribute it to an enrolment **by
  date**: activity between `enrolled_at` and `ended_at` belongs to that
  enrolment. Reports for Cohort 1 then show only what happened while the
  student was in Cohort 1. This avoids duplicating or migrating any
  progress table. (Alternative, heavier: add `enrolment_id` to progress
  tables. Not recommended now.)
- A database guard (unique partial index) prevents two *open* enrolments of
  the same person in the same cohort (duplicate enrolment).
- RLS: admin-only writes; students can read their own enrolments.

## 4. Admin UI changes

- **Cohorts dashboard** (`/admin/cohorts`, extended): cards for each cohort with
  live student count, status chip (Upcoming / Active / Completed /
  Archived), dates, progress summary; "New cohort" button; search.
- **Cohort view** (`/admin/cohorts/[id]`, extended) with tabs: Students
  (search, filter by status, bulk add, bulk move, transfer, withdraw),
  Progress, Assessments, Schedule, Announcements, Lectures (existing),
  History.
- **Global cohort switcher** in the admin header: "All cohorts" or one
  cohort, kept in the URL (`?cohort=`) and shown as a coloured chip on
  every page so actions are never applied to the wrong group. Pages that
  can be filtered read it; pages that cannot show "All cohorts".
- **Bulk actions** confirm with the cohort name and a count ("Move 12
  students from Cohort 1 to Cohort 2?").
- Student profile gains a **Cohort history** timeline.

## 5. How filtering would work across the platform

One server helper `resolveCohortFilter(searchParams)` returns either "all"
or `{ cohortId, userIds, from, to }` (members during the cohort's dates).
Each admin page passes it to its query:

| Page | Filtered by |
|---|---|
| Students / People | enrolments in the cohort (current, or include past) |
| Learning insights | members + activity dated inside the enrolment |
| Progress (pulse), activity | members |
| Submissions, check-ins, sim review, supervision | submitter is a member |
| Emails / announcements | recipients = members |
| Leaderboard (student side) | already per cohort |

## 6. Risks and migration concerns

- The base cohort migration's live status must be confirmed first.
- Students in several cohorts at once make "which cohort does this
  progress belong to" ambiguous; the date rule handles transfers but not
  true overlap (see question 1).
- Changing removal to "withdraw" changes admin behaviour; existing
  `removeFromCohort` callers must be updated together.
- Per-cohort due dates touch the submission and lateness logic
  (`is_late`), which needs careful tests.
- Learning insights currently loads every student's full Learn JSON; with
  several cohorts this should move to a per-cohort query (performance).
- All of this is additive and can ship behind the existing admin pages;
  nothing needs to be run destructively.

---

## 7. Unlimited content (Part 1): what limits exist today

There is **no cap on how much content can be authored**: modules, notes,
MCQs, Lab experiments and Casebook activities are data and can grow
freely. The limits that exist are about **how much is shown at once**, plus
one storage guard:

| Where | Limit | Kind | Proposal |
|---|---|---|---|
| Casebook rounds | 12 questions per round, sampled from the bank | screen/session size; whole bank rotates across plays | keep; let the student pick round length (12 / 24 / all) |
| Casebook library | 12 cards per page, "Show more" | pagination | keep |
| Revise "today" | 6 items / ~20 min | daily plan by design | make the length a student setting |
| Review player | 12 due questions per review | session size | keep; the rest come next session |
| **Learn state JSON** | **200 KB per student** (`study/actions.ts`) | storage guard | **real risk at scale**: per-question review cards grow with the bank. Propose moving review cards to their own table before the bank grows much larger |
| Content in code | Notes, quiz units, Lab and Casebook live in TypeScript files | authoring | admins cannot add questions without a developer; a content table + editor is the scalable path (see question 8) |

---

## 8. Questions for you

Recommendations are marked; nothing is assumed until you answer.

1. **Can a student be in two cohorts at the same time?** The code already
   allows it. *Recommendation: allow it only for a different programme;
   within one programme, one open enrolment at a time (transfer closes the
   old one).*
2. **Will there ever be more than one programme?** If not, we skip the
   `programmes` table and treat the course as the programme.
   *Recommendation: skip it for now; add later without breaking anything.*
3. **Do cohorts share the same curriculum?** *Recommendation: yes, one
   curriculum; cohorts differ only in which lectures are released and
   when.*
4. **Do schedules and assessment deadlines differ per cohort?**
   *Recommendation: yes for dates (per-cohort schedule and due dates), same
   assessments.*
5. **Transfers: does the student keep their progress?** *Recommendation:
   their progress always stays with them (it is their learning); reports
   for the old cohort keep showing what they did while in it.*
6. **When a cohort is completed:** do students keep access (read-only,
   alumni), keep full access, or lose access after a date? Is a
   certificate tied to cohort completion?
7. **Who can manage cohorts?** Only you (all admins equal, as today), or do
   you want roles (e.g. a faculty member who can see only their cohort)?
8. **Content authoring:** do you want admins to add and edit questions,
   cases and activities in the browser (a content editor with draft /
   published and versions), or is code-based content with developer help
   acceptable for now?
9. **Reporting:** which cohort reports matter most (completion, test
   scores, attendance, Lab/Casebook use, inactivity)? Is attendance tracked
   anywhere today (live sessions), or should it be added?

---

## 9. Answers received (2026-11-03)

| Question | Answer | Effect on the design |
|---|---|---|
| 1. Several cohorts at once? | **Several at once** | No "one open enrolment" rule. The duplicate guard only stops the *same* cohort twice. During an overlap, a student's activity counts in **each** cohort they are actively enrolled in; cohort reports say so ("also in Cohort 2"). |
| 3/4. Curriculum | **Same content, own dates** | One curriculum; per-cohort schedule, lecture release (exists) and assessment due dates (new). |
| 5. Transfers | **Keeps progress; history split** | Date-based attribution: old cohort keeps what happened before the transfer date, new cohort counts from it. |
| 6. Completion | **Read-only alumni** | Completing a cohort marks its enrolments `completed`. Students with no other active enrolment are moved to read-only access, reusing the existing alumni behaviour. Records stay. |

Still open: programmes (2), certificates on completion (6b), roles (7),
content editor (8), reports/attendance (9).

---

## 10. Cohort-specific recordings, live sessions and attendance (added after the second follow-up)

### What exists today
- A **lesson** (lecture) belongs to a **course**; its video lives in
  `media_assets` (R2, encrypted HLS). Which cohorts can watch it is a
  many-to-many share (`lesson_cohorts`).
- **New lessons are automatically shared with every running and upcoming
  cohort of the course** (`admin/courses/[courseId]/actions.ts:226-231`).
  Once Cohort 2 exists, a Cohort 1 recording would appear for Cohort 2
  unless someone un-ticks it. This is the main mixing risk.
- **Live sessions are not stored.** Scheduling is only an `.ics` generator
  (`/api/cohort-calendar`); nothing records "Cohort 2, Saturday 9:00,
  Module 3".
- **Attendance does not exist** anywhere in code or migrations.
- `src/migrations_pending/course_weeks.sql` has a syntax error
  (`alter table if not exists public.materials`), so that statement fails.

### Proposed model (additive)
Separate **what is taught** (shared curriculum) from **how a cohort was
taught** (its own sessions and recordings):

```
modules / course weeks (shared curriculum)
cohort_sessions   NEW  one live class: cohort_id, title, module/week (optional link to curriculum),
                       starts_at, ends_at, meeting link, status (scheduled|held|cancelled), created_by
recordings        =    existing lessons + media_assets, plus:
                       lessons.cohort_id (NEW, nullable) — set = belongs to that cohort only;
                       null = shared curriculum video (e.g. a pre-recorded explainer for everyone)
                       lessons.session_id (NEW, nullable) — the live class it came from
attendance        NEW  (session_id, user_id, status present|late|absent|excused, marked_by, marked_at)
announcements     NEW  cohort_id, title, body, published_at, sent_by (+ optional email)
```

- **Uploading a recording requires choosing its cohort** (pre-filled from
  the session it came from). Cohort recordings are visible only to members
  of that cohort; access is enforced in the same four places lecture
  access is enforced today (list, page, playback token, stream), plus a
  database check.
- The **auto-share-to-all-cohorts** behaviour is replaced: a cohort
  recording is shared with its own cohort only; a shared curriculum video
  is shared with all.
- Existing lessons are backfilled as **Cohort 1 recordings** (or shared, if
  you say some are curriculum videos). Nothing is deleted or moved in R2.
- **Students in several cohorts** see each recording labelled with its
  cohort ("Cohort 2 · Sat 14 Nov · Module 3") and can filter by cohort.
- **Completed cohorts keep everything:** sessions, recordings, attendance
  and announcements stay readable by the cohort's alumni and by admins.

### Questions specific to this
10. Are any existing lecture videos meant for **every** cohort (pre-recorded
    curriculum videos), or are all of them Cohort 1 class recordings?
11. Where do live classes happen (Zoom, Google Meet, in person, LiveKit in
    the app)? This decides whether attendance is marked by hand, imported,
    or captured automatically.
12. What counts as attendance: present/absent per session marked by an
    admin, or watch-time of the recording for those who missed it?
