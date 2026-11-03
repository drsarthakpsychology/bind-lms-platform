# Admin simplification audit: consolidating around cohorts and daily work

Status: **read-only audit and proposal.** No source file or database was
changed. Every claim about current behaviour cites the file it comes from.
Date: 2026-11-03. Branch: `feature/vibha-lms-transformation`.

This builds on, and does not repeat:
- `docs/PRODUCT_SIMPLIFICATION_AUDIT.md` (2026-08-14): copy, jargon and label
  fixes, most of which have shipped (e.g. "Usage & limits", "What's live",
  "Practice sessions").
- `ADMIN_AUDIT.md` (2026-08-26): rights removal, calibration, dictate.
- `docs/transformation/COHORT_PROPOSAL.md`: the cohort data model
  (enrolments, sessions, recordings, attendance, announcements). This audit
  is the **admin UI** half of that work. Anything below marked **[DB]**
  depends on that proposal; **[UI]** needs no schema change.

---

## 1. The short version

The admin area is not confusing because any one page is bad. It is confusing
because:

1. **There are four different admin menus.** The desktop sidebar uses
   `ADMIN_SECTIONS` (6 places, 21 visible tabs), the phone drawer uses the
   older `ADMIN_ITEMS` (20 links grouped "Launch / Review / Content /
   System", no Access, Activity or Learning), the phone bottom bar uses
   `ADMIN_TABS` (4 tabs), and the search palette has its own 12 admin entries
   with different names ("Infrastructure", "Sim session review", "Cohort
   check-ins"). Sources: `nav-config.ts:47-150`, `app-shell.tsx:43,87`,
   `bottom-tab-bar.tsx:34-39`, `palette.ts:46-59`.
2. **The cohort, the thing the owner thinks in, is not the organising idea.**
   It is the second of nine tabs under "People", which opens on a sales
   pipeline. Only one admin page (Access) can filter by cohort. Home,
   Progress, Activity, Learning, Mail, Review and Submissions all mix every
   cohort together.
3. **One student is spread over four pages:** `/admin/cohorts/student/[id]`
   ("Access & cohorts"), `/admin/activity/[id]`, `/admin/people/[key]`
   ("Pipeline record") and `/admin/access?q=` ("Switch sections"), glued by
   a row of links (`components/admin/person-links.tsx`).
4. **The same job has two or three doors that behave differently** (create a
   cohort, add students, move a student, email a group). Details in §4.
5. **Teaching a cohort (schedule, recording, attendance, announcement) has
   almost no home.** Scheduling is an `.ics` download in "Admin tools";
   attendance and announcements do not exist; recordings are uploaded in
   Content and then restricted by un-ticking in People.

---

## 2. Navigation inventory

### 2.1 The four menus side by side

| Page | Desktop sidebar (`ADMIN_SECTIONS`) | Phone drawer (`ADMIN_ITEMS`) | Phone bottom bar | Palette |
|---|---|---|---|---|
| `/admin` | Home | Home | Home | "Admin overview" |
| `/admin/emails` | Mail | Launch › Mail | Mail | Mail, Compose, Logins |
| `/admin/courses` | Content › Courses & lectures | Launch › Courses | (More) | Courses |
| `/admin/flags` | Content › What's live | Launch › What's live | (More) | What's live |
| `/admin/cards` | Content › Study cards | Content › Study cards | (More) | — |
| `/admin/psychopharm-review` | Content › Medicines | Content › Medication library | (More) | — |
| `/admin/people` | People › Pipeline (landing tab) | Launch › People pipeline | People | People pipeline |
| `/admin/cohorts` | People › Cohorts | Launch › Cohorts | People tab **not highlighted** | — |
| `/admin/students` | People › Students | Launch › Students | People | Students |
| `/admin/access` | People › Access | — | **not highlighted** | — |
| `/admin/activity` | People › Activity | — | People | Student activity |
| `/admin/enquiries` | People › Enquiries | **Review** › Enquiries | People | — |
| `/admin/pulse` | People › Progress | **System** › Cohort progress | People | — |
| `/admin/learning` | People › Learning | — | **not highlighted** | — |
| `/admin/checkins` | People › Check-ins | Review › Check-ins | People | Cohort check-ins |
| `/admin/triage` | Review › Needs a look (landing) | Review › Review triage | Review | — |
| `/admin/submissions` | Review › Submissions | Review › Submissions | Review | — |
| `/admin/sim-review` | Review › Practice sessions | Review › Practice sessions | Review | Sim session review |
| `/doubts` | Review › Doubts & concerns | — | — | — |
| `/admin/supervision` | Review › Sign-offs | Review › Sign-offs | Review | — |
| `/admin/wall-reports` | Review › Wall reports | Review › Wall reports | Review | — |
| `/admin/infra` | System › Usage & limits | System › Usage & limits | (More) | Infrastructure |
| `/admin/tools` | System › Admin tools | System › Admin tools | (More) | — |
| `/admin/modules` | hidden tab | absent (comment says skeleton) | — | — |
| `/admin/psychopharm` | hidden tab, **no page exists** | — | — | — |

Notes:
- "Enquiries" is under People on desktop and Review on phones; "Progress" is
  People on desktop and System on phones.
- `/doubts` is a student route, so the admin tab strip (rendered only by
  `admin/layout.tsx`) disappears when you open it from Review.
- The palette hard-codes one course, **"Pyschology Cohort 1"** (typo) with a
  fixed id (`palette.ts:42-44`). If the real course is titled like that, the
  course name and the cohort name are the same words, which will make
  "Psychology Cohort 2 → Course: Psychology Cohort 1" read as a mistake.
  Renaming the course (e.g. "Psychology programme") is a data edit for the
  owner, not a code change.

### 2.2 Every admin page

34 `page.tsx` files; 4 are redirect-only. "Commits" = commits touching the
folder; "Created" = first commit. Usage column explained in §3.

| Page | Purpose (one line) | Reads / writes | In nav? | Overlaps with |
|---|---|---|---|---|
| `/admin` | Overview: needs-attention list, 4 stats, shortcuts, storage warning | reads profiles, submissions, sim_scores, student_last_activity, crm_contacts, email_inbound, `infra_metrics` | Home | Progress (quiet students), Students ("not started") |
| `/admin/cohorts` | List cohorts; create one; add people by pasted emails | cohorts, cohort_members, profiles, credential_invites, course_enrollments; auth users | People tab | Course page "Students and cohorts"; Students; Admin tools import |
| `/admin/cohorts/[id]` | One cohort: People tab, Lectures tab (share by week), name/status/dates | cohorts, cohort_members, lesson_cohorts | via list | Course page panel |
| `/admin/cohorts/student/[id]` | One person: cohorts ticked, scope, extra lectures, re-ask details | cohort_members, lesson_grants, profiles.scope | via links | Access (scope), Activity/[id], People/[id] |
| `/admin/students` | Account list, lock/unlock all, create one student (email + expiry), certificate | profiles (status, expires_at), auth | People tab | Cohorts (add), Access (lock vs blocks), Pipeline |
| `/admin/access` | Bulk per-student scope, per-section switches, "start again" resets; **has a cohort filter** | profiles.scope, access_blocks, reset tables | People tab | What's live (global switches), Cohort student page (scope) |
| `/admin/people` | CRM pipeline of enquiries + students, follow-ups | enquiries, crm_contacts, crm_activities, email_sends, credential_invites, profiles | People landing tab | Enquiries, Students |
| `/admin/people/[id]` | One pipeline record, stage, log a call, convert to student | crm_* , enquiries | via list | person pages |
| `/admin/enquiries` | Raw list of website enquiries | enquiries | People tab | Pipeline (same rows) |
| `/admin/activity` | Time on platform, lectures watched, Learn, practice, heatmap, ranking (30 days) | page_visits, progress, etc. (`lib/analytics/activity.ts`) | People tab | Progress (quiet list), Learning |
| `/admin/activity/[id]` | One student's activity | same | via links | person pages |
| `/admin/pulse` ("Progress") | Quiet 7+ days, active now, check-in trend, one-tap nudge | student_last_activity, checkins_aggregate, loadActivity; nudge → Resend | People tab | Activity (same source), Check-ins (same view), Mail (nudge bypasses Mail log) |
| `/admin/learning` | Self-study insights + CSV | all students' Learn state (`lib/insights/load`) | People tab | Activity, Progress |
| `/admin/checkins` | Weekly workload/energy trends, no identifiers | checkins_aggregate | People tab | Progress (shows the same trend) |
| `/admin/emails` | Gmail-style Inbox / Sent / Logins / Failed / Compose | email_inbound, email_sends, credential_invites | Mail | Pulse nudge, Cohort "Send link", Students reset |
| `/admin/courses` | Course list + create | courses, lessons | Content | — |
| `/admin/courses/[id]` | Course editor: **Students and cohorts panel**, add lesson (upload video), weeks, materials, assignments, per-lesson status | courses, lessons, media_assets, lesson_cohorts (auto-share), assignments, course_enrollments, cohort_members | via list | Cohorts (create, move, enrol) |
| `/admin/flags` | Global three-state switch per tool (Hidden / Live / Unlock) | feature_flags | Content tab | Access (per-student blocks) |
| `/admin/cards` | Study-card review queue | cards | Content tab | — |
| `/admin/psychopharm-review` (+`[table]`) | Medication list / review queue | psych_* , medication_documents | Content tab | — |
| `/admin/psychopharm/editor/[drug]` | Per-drug editor | medication_documents | hidden | — |
| `/admin/modules` | Module publish/schedule/grants skeleton | modules, module_access | hidden | Courses; Cohort lecture sharing |
| `/admin/triage` ("Needs a look") | Up to 10 flagged practice sessions / quiz items | sim_scores, quiz_attempts, sim_sessions | Review landing | Practice sessions |
| `/admin/sim-review` | All practice-session transcripts and scores | sim_scores, sim_turns, scoring_corrections | Review tab | Triage |
| `/admin/submissions` | Grade assignment submissions | submissions, submission_files, assignments | Review tab | Home "Grade submissions" |
| `/admin/supervision` | Sign supervision hours | supervision_entries | Review tab | — |
| `/admin/wall-reports` | Resolve reported wall posts | wall_reports, wall_posts, wall_replies | Review tab | — |
| `/admin/infra` | Storage and AI usage | `infra_metrics` | System | Home warning strip |
| `/admin/tools` | CSV import (name,email, no cohort), cohort `.ics` generator, master password | auth, credential_invites, master_login_events | System | Cohorts add; Schedule (missing) |
| `/admin/roster` | **Redirect** → `/admin/emails?tab=credentials` (→ Logins) | — | hidden | still referenced in `students/bulk-import.ts` |
| `/admin/calibration` | **Redirect** → `/admin/courses` (feature removed 2026-11-02) | — | — | — |
| `/admin/corpus/dictate` | **Redirect** → `/admin/courses` | — | — | — |
| `/admin/idioms` | **Redirect** → `/admin/courses` | — | — | — |

Retired earlier and gone: `/admin/rights` (ADMIN_AUDIT.md). Listed in
`SYSTEM_MAP.md §3.4` but **no page exists**: `/admin/psychopharm`,
`/admin/psychopharm/editor` (only `/editor/[drug]` exists). SYSTEM_MAP §3.4
also omits cohorts, access, activity, people, learning and emails, so it is
out of date.

### 2.3 Overlap clusters (what a person actually trips over)

| Cluster | Pages | What differs | Verdict |
|---|---|---|---|
| **Who are my students** | Students, Cohorts › People, Access, Pipeline, Course page panel | Students = accounts + lock; Cohorts = membership; Access = sections; Pipeline = CRM; Course panel = enrolment + cohort dropdown | One **People** directory with a cohort column and filter; one person page |
| **How are they doing** | Progress (pulse), Activity, Learning, Check-ins, Home stats | Same underlying activity data cut four ways; none filter by cohort | One **Cohort › Overview** (falling behind first), with Activity/Learning as drill-downs |
| **What needs reviewing** | Triage, Practice sessions, Submissions, Sign-offs, Wall reports, Doubts, Home list | Different objects, but Home already merges them into one "Needs attention" list | One **Review inbox** with type filters; keep the specialised screens as the "open" view |
| **Adding people** | Cohorts paste, Cohort page paste, Admin tools CSV, Students single form, Course panel tick, Pipeline "convert" | Only cohort paste puts them in a cohort; CSV import has names but no cohort; paste has a cohort but no names | One **Add students** flow inside a cohort that accepts paste *or* CSV |
| **Switching things off** | What's live (global), Access (per student), Students (lock account), Cohort lecture sharing, Lesson status toggle, Modules | Five switches at different levels with different words | Keep, but name by level: "For everyone" (Settings), "For this cohort" (Cohort), "For this person" (Person page) |
| **Emailing** | Mail compose, Pulse nudge, Cohort "Send link", Students reset, Logins folder | Nudge calls Resend directly (`api/admin/nudge/route.ts`), so it never shows in Mail › Sent; Compose shortcuts are per **course**, not cohort (`emails/recipient-picker.tsx:35-66`) | Mail stays the inbox; cohort email becomes **Cohort › Announce**; nudge should log to `email_sends` |
| **Content vs tools** | Courses, Admin tools calendar, Modules | Scheduling sits in "tools"; Modules is a hidden skeleton | Schedule moves to the cohort; Admin tools → Settings |

---

## 3. Usage evidence

What can and cannot be shown:

- **No admin usage telemetry exists.** The visit tracker records students
  only (`src/app/api/visit/route.ts:17`), and the database could not be
  reached (Supabase connector failed), so no page can be called "used" or
  "unused" from data.
- **Git recency is misleading.** Every admin page except the four redirects
  was last touched on 2026-11-03 by one sweep (`817a397` "Security: admin
  pages check admin themselves…"), so `git log -1` says nothing about use.
- **Development activity** (commits per folder, a weak proxy for attention):
  students 21, courses 13, roster 8, flags 6, tools 6, emails 5, pulse 5,
  cohorts 4, cards 4, triage 4, submissions 4, supervision 4; everything else
  1–3. Cohorts, access, people, activity and learning were all created on
  2026-11-02/03, so they are days old.
- **Docs** (NIGHT_LOG, QUEUE, docs/) mention pages being **built or fixed**,
  not being **used**. The only owner-facing signals are named personas
  ("Kavya", "Dr. Sarthak") in ADMIN_AUDIT and the 2026-08 audit.
- **Unknown and important:** whether `2026_11_cohorts.sql` is applied in
  production. It is not in the approved migration list
  (COHORT_PROPOSAL §1). If it is not, `/admin/cohorts` shows "The cohort
  tables aren't in the database yet" (`cohorts/page.tsx:34-43`) and every
  cohort workflow below is unavailable. Confirm this first.

---

## 4. Workflows walked through the current code

Counts are desktop clicks from `/admin`, excluding typing. "Areas" = top-level
sidebar places visited.

### (a) Create "Psychology Cohort 2" — 3 clicks, works, two doors
1. Sidebar **People** → lands on **Pipeline** (a CRM, not cohorts).
2. Tab **Cohorts**. Right column "New cohort": name, start date, course
   (defaults to the first course alphabetically). No end date here.
3. **Create cohort** → opens the new cohort page.

Problems: the second door, Course page › Students and cohorts › new cohort
(`course-people.tsx:230-290`), has a checkbox "Also give them the N lectures
already in this course", which would hand Cohort 1's recordings to Cohort 2.
Status starts "Upcoming" in both. Home has a "Cohorts" shortcut (saves one
click).

### (b) Add 30 students — 4 clicks if you use the right door; 6+ otherwise
Best path: People › Cohorts › **Psychology Cohort 2** card › paste 30 emails
› choose "Lectures only / Full platform" (default **Full**) › keep "Email them
their login link" ticked › **Add 30 people**. Result list shows each email's
outcome. Also enrols them in the course (`cohorts/actions.ts:77-168`).

Problems:
- No names: names are derived from the email (`deriveName`). A CSV with
  names only works in **System › Admin tools**, which puts nobody in a cohort
  (`tools/bulk-import-form.tsx`), so a CSV import is two separate jobs in two
  areas.
- On the cohort *list* page the "Add people" box defaults to the **most
  recently created** cohort (`cohorts-ui.tsx:93`), silently.
- `/admin/students` "Add student" creates one account with no cohort and no
  course; such students fall back to "legacy" rules (`lib/cohorts/rules.ts`).

### (c) Schedule a live lecture for Cohort 2 — not possible in the app
- No table stores a session. `course_weeks` is not a table; weeks are a
  `week` integer on lessons (`src/migrations_pending/course_weeks.sql`, which
  also has the syntax error noted in COHORT_PROPOSAL §10).
- The only tool: System › Admin tools › "Cohort calendar": start date, time,
  weekdays, weeks, name (default **"Cohort One"**) › **Download calendar
  file** (`tools/cohort-calendar-form.tsx`, `/api/cohort-calendar`). 3 clicks,
  nothing saved, not linked to a cohort, no meeting link, students never see it.
- LiveKit exists only for the practice voice patient
  (`api/livekit/token`, `consulting-room`), not for lectures.
Dead end.

### (d) Upload the recording so only Cohort 2 sees it — ~12 clicks, 2 areas, by exclusion
1. Sidebar **Content** › course card › expand "Add a lesson" › choose file ›
   title, week › **Save** (5 clicks). Uploads straight to R2 and writes
   `media_assets` (`courses/[courseId]/actions.ts`).
2. The lesson is **auto-shared with every running or upcoming cohort of the
   course** (`actions.ts:224-231`), so Cohort 1 sees it too.
3. New lessons default to status **"live" = locked "yet to be live"**
   (`flags_lesson_status.sql:32`), so: toggle **Unlocked** (1–2 clicks).
4. Sidebar **People** › Cohorts › **Cohort 1** › **Lectures** tab › find it
   under its week › untick (5 clicks).
Nowhere on the upload form says which cohort will see it. Forgetting step 4
leaks the recording to Cohort 1. `scripts/publish-lecture.ts` (HLS ladder) is
CLI-only and optional.

### (e) Take attendance — does not exist
No table, page, action or migration (grep for attendance hits only teaching
content). Dead end. COHORT_PROPOSAL §10 proposes `attendance`.

### (f) Cohort 2's progress and who is falling behind — not possible per cohort
- Progress (`pulse`), Activity and Learning show **all students together**,
  with no cohort filter or column.
- The cohort page shows only "Logged in" and "Details in" pills.
- The only cohort filter is on **Access**, which shows permissions, not
  progress.
Workaround: open Cohort 2's people list and cross-check names against three
other pages by eye. Effectively a dead end.

### (g) Send Cohort 2 an announcement or email — ~35 clicks
Sidebar **Mail** › **Compose** › recipients: the one-tap shortcuts are per
**course** (`recipient-picker.tsx:35-66`), which would include Cohort 1, so
you tick 30 people one by one (or search each). No in-app announcement exists
(the student Notifications page is built from wall activity only). The
"Send nudge" on Progress is a different, unlogged email path.

### (h) Move one student from Cohort 1 to Cohort 2 — 4–6 clicks, history lost, two behaviours
- Path 1: People › Cohorts › Cohort 1 › student's **Access** › untick
  Cohort 1, tick Cohort 2. Each tick saves immediately
  (`setPersonCohorts`), so for a moment they are in neither or both.
- Path 2: Content › course › Students and cohorts › find student › change
  the cohort dropdown. No confirmation; it removes **all** their cohorts and
  adds one (`people-actions.ts:90-97`). Now that the owner has said students
  can be in several cohorts at once (COHORT_PROPOSAL §9), this path silently
  drops their other memberships. **Bug risk; flag, not fixed.**
- Either way the `cohort_members` row is deleted; there is no record they
  were ever in Cohort 1.

### (i) Mark Cohort 1 completed — 5 clicks, cosmetic only
People › Cohorts › Cohort 1 › "Edit name, status and dates" › Status
**Finished** › **Save**. Effect: the chip changes and new lessons stop being
auto-shared to it. Students keep full access. The alumni cron that makes
people read-only keys on `profiles.cohort_ended_at`
(`api/internal/cron/route.ts:64-76`), which nothing in the UI sets, so the
agreed "read-only alumni" outcome (COHORT_PROPOSAL §9, answer 6) does not
happen.

### Summary

| Workflow | Today (clicks / areas) | Cohort re-chosen? | Status |
|---|---|---|---|
| a. Create cohort | 3 / 1 | — | Works; second door can leak lectures |
| b. Add 30 students | 4 / 1 (paste) or 6+ / 2 (CSV) | Yes on CSV path | Works without names |
| c. Schedule live lecture | 3 / 1, nothing saved | Typed by hand | **Missing** |
| d. Upload recording for Cohort 2 only | ~12 / 2 | Yes, by un-ticking the *other* cohort | Works, error-prone |
| e. Attendance | — | — | **Missing** |
| f. Cohort progress | — | — | **Missing** (no filter) |
| g. Email Cohort 2 | ~35 / 1 | Ticked person by person | Painful |
| h. Move student | 4–6 / 1–2 | Yes | Works, loses history |
| i. Complete cohort | 5 / 1 | — | Cosmetic only |

---

## 5. Student side: lectures and recordings today

- `/courses` and `/dashboard` show the courses that hold lectures shared with
  any of the student's cohorts (`visibleCourseIds`, `lib/cohorts/access.ts`).
- Inside a course, lectures are filtered by `filterLessons`
  (`course-overview.tsx:3-4`) and grouped **by week only**. "Current week"
  is simply the week of the next unwatched lesson (`course-overview.tsx:164`),
  not a date.
- **No cohort name appears anywhere** on the student side (only the
  leaderboard and doubts are cohort-scoped behind the scenes).
- A student in Cohort 1 and Cohort 2 of the same course sees the **union**
  of both cohorts' lectures in one list, both recordings of "Week 3" side by
  side, told apart only by title. **They would not know which cohort a
  recording belongs to.** COHORT_PROPOSAL §10 covers the fix (cohort label
  and filter, `lessons.cohort_id`).
- Public and some default copy still says "Cohort One" (`src/lib/brand.ts`,
  calendar form default title).

---

## 6. Proposed admin structure

### 6.1 Seven places instead of 6 + 21 tabs (and four menus)

| Place | What it is for | Tabs |
|---|---|---|
| **Home** | Today, for the selected cohort | Needs attention (grading, reviews, quiet students, unread mail, follow-ups), today's sessions, quick actions |
| **Cohort** | Run one cohort (the switcher picks which) | Overview (progress, falling behind) · Students · Schedule & attendance · Recordings · Announce · Settings |
| **People** | Everyone, across cohorts | Students (one directory) · Leads (pipeline + enquiries) |
| **Content** | The shared curriculum | Courses & lectures · Study cards · Medicines · What's live |
| **Review** | One inbox of things to mark | All · Submissions · Practice sessions · Sign-offs · Doubts · Wall reports |
| **Mail** | Inbox, Sent, Logins, Failed | unchanged |
| **Settings** | Rarely used | Usage & limits · Admin tools (master password) · All cohorts list (archive) |

"Teaching" (schedule, recordings, attendance) lives **inside Cohort**,
because every one of those things belongs to exactly one cohort.

### 6.2 The global cohort switcher

- **Where:** in the top bar, left of search, on every admin page. A coloured
  chip: `● Psychology Cohort 2 ▾`. The colour is fixed per cohort
  (derived from its id, so no DB column is needed).
- **Menu:** "All cohorts", then cohorts grouped Running / Upcoming /
  Finished, then "+ New cohort".
- **State:** `?cohort=<id>` in the URL (shareable, back-button safe), copied
  onto internal admin links by a small link helper, and remembered in a
  cookie as the default for the next visit. One server helper
  (`resolveCohortFilter`, COHORT_PROPOSAL §5) turns it into member ids.
- **Behaviour:** pages that can filter, filter and say so in their header
  ("Progress · Psychology Cohort 2 · 30 students"). Pages that cannot (Mail
  inbox, Content, Settings) show the chip greyed with "All cohorts". The
  **Cohort** place under "All cohorts" shows the cohort list instead.
- **Safety:** any write that targets a cohort (add, move, upload, announce,
  complete) repeats the cohort name and a count in its button and
  confirmation ("Add 30 students to Psychology Cohort 2"). Cohort-only
  actions are disabled under "All cohorts" rather than guessing.
- **One menu source:** sidebar, phone drawer, bottom bar and palette are all
  generated from one config (today `ADMIN_SECTIONS`), so labels can't drift
  again. Phone bottom bar: Home · Cohort · Review · Mail · More.

### 6.3 Where every current page goes

| Current page | Goes to | Action | Needs |
|---|---|---|---|
| `/admin` | Home | Keep; filter by cohort; add "today's sessions" | [UI]; sessions [DB] |
| `/admin/cohorts` | Cohort (under "All cohorts") + Settings › All cohorts | Merge | [UI] |
| `/admin/cohorts/[id]` | Cohort › Students / Recordings / Settings | Merge (it becomes the workspace) | [UI] |
| `/admin/cohorts/student/[id]` | People › person page, "Cohorts & lectures" section | Merge | [UI] |
| `/admin/students` | People › Students | Merge with Access; add cohort column + filter | [UI] |
| `/admin/access` | People › Students (bulk bar) and person page | Merge; its cohort filter becomes the global one | [UI] |
| `/admin/activity` + `[id]` | Cohort › Overview (drill-down) and person page | Merge | [UI] |
| `/admin/pulse` | Cohort › Overview ("Falling behind") | Merge | [UI] |
| `/admin/learning` | Cohort › Overview › Self-study | Merge; query per cohort (perf) | [UI] |
| `/admin/checkins` | Cohort › Overview › Wellbeing | Merge; per-cohort trend needs view change with a minimum group size | [DB] (privacy) |
| `/admin/people` + `[id]` | People › Leads | Keep, rename "Leads" | [UI] |
| `/admin/enquiries` | People › Leads (filter "From website") | Merge | [UI] |
| `/admin/emails` | Mail | Keep | — |
| Pulse "Send nudge" | Mail (logged) | Merge; log to `email_sends` | [UI]+server action |
| `/admin/courses` + `[id]` | Content › Courses & lectures | Keep; **remove the Students and cohorts panel** after migration (see risks) | [UI] |
| Lesson upload | Cohort › Recordings (and Content for shared curriculum videos) | Add "Who can watch" cohort picker, default = switcher cohort; default status Unlocked | interim [UI]; `lessons.cohort_id` [DB] |
| `/admin/flags` | Content › What's live (label "For everyone") | Keep | — |
| `/admin/cards`, `/admin/psychopharm-review`, `/editor/[drug]` | Content | Keep | — |
| `/admin/modules` | — | Retire from nav (already hidden); keep route and table (cron `release-scheduled` uses `modules`) | — |
| `/admin/triage` | Review › All (top of inbox) | Merge into the inbox | [UI] |
| `/admin/sim-review`, `/admin/submissions`, `/admin/supervision`, `/admin/wall-reports`, `/doubts` | Review tabs, filtered by cohort | Keep; render Doubts inside admin chrome | [UI] |
| `/admin/infra` | Settings › Usage & limits | Move | [UI] |
| `/admin/tools` CSV import | Cohort › Students › Add (paste **or** CSV with names) | Merge | [UI]+server action |
| `/admin/tools` calendar | Cohort › Schedule | Replace (stored sessions) | [DB] |
| `/admin/tools` master password | Settings › Admin tools | Move | — |
| `/admin/roster`, `/calibration`, `/corpus/dictate`, `/idioms` | — | Keep as redirects (old links, emails, bookmarks); point the last three at `/admin` | — |
| Palette admin entries | Generated from nav config | Replace; fix "Pyschology" | [UI] |
| SYSTEM_MAP §3.4 | — | Update after the change | docs |

### 6.4 The one person page

People › *student* opens a single page with sections: Summary (cohorts,
status, last seen) · Cohorts & lectures (current page `cohorts/student`) ·
Activity (current `activity/[id]`) · Access (switches from `/admin/access`,
lock from Students) · Mail (their sends and replies) · Lead history (from
`people/[id]`) · **Cohort history** [DB]. The four old URLs redirect to the
matching section.

### 6.5 Target click counts (switcher already on Cohort 2)

| Workflow | Today | Target | Path | Needs |
|---|---|---|---|---|
| a. Create cohort | 3 | 3 | Switcher › New cohort › name, dates (course pre-filled) › Create (switcher moves to it) | [UI] |
| b. Add 30 students | 4–6+ | 4 | Cohort › Students › Add › paste or drop CSV › "Add 30 to Psychology Cohort 2" | [UI] |
| c. Schedule live lecture | impossible | 3 | Cohort › Schedule › New session (date, time, link, week) › Save; students see it on Home | [DB] `cohort_sessions` |
| d. Upload recording, Cohort 2 only | ~12, 2 areas | 4 (interim 6) | Cohort › Schedule › session › Upload recording (title/week/cohort pre-filled) › Publish | interim [UI]; full [DB] `lessons.cohort_id`, `session_id` |
| e. Attendance | impossible | 3 + ticks | Cohort › Schedule › session › Attendance (all present, tick absent) › Save | [DB] `attendance` |
| f. Who is falling behind | impossible | 1 | Cohort › Overview opens on "Falling behind (n)" | [UI] by current members; date-correct after transfers [DB] |
| g. Announce / email | ~35 | 3 | Cohort › Announce › write › "Send to 30 in Psychology Cohort 2" | email-only [UI]; in-app announcements [DB] |
| h. Move a student | 4–6, history lost | 4 | Person › Cohorts › Move to… › Cohort 2 + date › Confirm | [DB] `cohort_enrolments` (doing it in UI only keeps losing history) |
| i. Complete cohort | 5, cosmetic | 3 | Cohort › Settings › Mark completed › confirm ("28 become read-only alumni; 2 stay active, also in Cohort 3") | [DB] enrolment status + alumni rule |

---

## 7. What is pure UI and what needs the database

**Pure UI, can ship first (no schema change):**
1. One nav config feeding sidebar, drawer, bottom bar and palette; seven
   places; consistent labels.
2. Cohort switcher (URL + cookie + chip) and filtering of Home, Progress,
   Activity, Learning, Students, Review and Submissions by **current**
   `cohort_members`.
3. Cohort workspace tabs built from today's cohort page; Overview built from
   the existing Progress/Activity/Learning loaders filtered to members.
4. One person page composed from the four existing ones.
5. "Cohort" recipient group in Mail compose (reads `cohort_members`); nudge
   logged through the Mail sender.
6. Upload form "Who can watch" cohort picker writing `lesson_cohorts`
   (existing table), replacing silent auto-share; default status Unlocked.
7. CSV-with-names option in the cohort Add flow (reuses roster parser).
8. Review inbox merging the existing queues (Home already does this).

**Needs DB changes (all in COHORT_PROPOSAL §3 and §10):**
`cohort_enrolments` (move, withdraw, complete, history), `cohort_sessions`
(schedule), `attendance`, `cohort_announcements` (in-app), `lessons.cohort_id`
/ `session_id` (recording ownership and student labels), per-cohort
assessment due dates, date-based progress attribution, a per-cohort
check-ins view with a minimum group size.

**First, before any of it:** confirm `2026_11_cohorts.sql` is applied in
production (§3).

---

## 8. Risks: consolidations that could break things

| Change | Risk | Mitigation |
|---|---|---|
| Removing the Course page "Students and cohorts" panel | It is the only UI that writes `course_enrollments` for students **not in any cohort**, who still get access through enrolment (`rules.ts`, "legacy") | Keep until every student is in a cohort; the cohort list already warns "N students aren't in any cohort" |
| Replacing auto-share of new lectures | Cohort 1 currently gets new lectures without anyone ticking them | Default the picker to the switcher cohort (or all running cohorts under "All cohorts"), never to none |
| Course-page cohort dropdown (`moveCohort`) | Drops every other cohort membership; with multi-cohort students this removes access silently | Disable or confirm before the multi-cohort rollout |
| Merging Students + Access + cohort student page | Five different write paths (`profiles.status`, `profiles.scope`, `access_blocks`, `cohort_members`, `lesson_grants`) | Recompose UI only; keep every server action and its admin check |
| Moving the CSV import out of Admin tools | Must still create `credential_invites` and send setup links | Reuse `confirmBulkImport` / `addPeopleToCohort`, don't rewrite |
| Retiring redirect pages | `/admin/roster` is still referenced in `students/bulk-import.ts` and old emails | Keep redirects; they cost nothing |
| Removing Modules | `modules` is used by the `release-scheduled` cron | Hide only; do not drop the table |
| "Mark completed" making people alumni | Alumni role removes write access platform-wide; a student in two cohorts must not be downgraded | Only after enrolments exist; downgrade only people with no other active enrolment (proposal §9) |
| Per-cohort check-ins | `checkins_aggregate` is deliberately anonymous; small cohorts could re-identify students | Only show a cohort trend above a minimum response count |
| Learning insights per cohort | Currently loads every student's full Learn JSON | Query by member ids (also a speed-up) |
| Cookie-remembered cohort | Admin acts on a stale cohort | Chip always visible; every cohort write names the cohort in the button and confirm |
