# Clinic API (schedule, QR attendance, leave, OPD cases)

Part of the app API v1 (see `API_CONTRACT.md` for headers, the answer shape and error codes). Types: the `Clinic*` block at the end of `src/lib/app-api/contract.ts` (copied to `apps/mobile/src/api/contract.ts`). Website code imports the same types from `src/lib/clinic/types.ts` and calls the server actions in `src/lib/clinic/actions.ts`, which answer the same shapes.

Database: `supabase/migrations_pending/2026_11_16_clinic.sql` (the owner pastes it). Before it runs, every clinic route answers 503 `unavailable` ("This isn't set up yet.").

Dates are `YYYY-MM-DD`, times `HH:MM`, clinic local time (India, UTC+05:30). Instants are ISO strings.

Status: **built** = route file exists with tests.

## Rules everyone can rely on

- A student acts only for themselves; the user id always comes from the token.
- `auth: "admin"` routes: Super Admin and View Admin can read. Every write is Super Admin only (View Admin gets 403 `forbidden`). `canWrite` in the overview says which.
- Cohort: student routes use the student's cohort (the one with a clinic set up, newest first). `?cohort=<id>` picks another of their own cohorts. Admin routes take `?cohort=` (GET) or `cohortId` (body); without it the first cohort is used.
- Session open window: from 30 minutes before start to 60 minutes after end. Scans and Show code work only then.
- QR text: `vibha-att:1:<sessionId>:<window>:<token>`. A new token every 30 seconds; the server accepts the current and the previous window. The 6-character code (letters and digits, no 0/O/1/I) changes with it.
- One scan per direction per session. Scanning without `direction` scans in first, then out.
- Late: scanned in after start + `lateMinutes` (OPD settings, default 10).
- Leave: one session = one leave. Early leave is free. Asking with no leaves left still works; the request carries `overLimit: true` and the admin decides. Approved leave marks the sessions "on leave".
- A missed assigned OPD day (day over, no scan, no approved leave, or the student logged "I was absent") becomes an approved `missed` leave (over the limit when none are left) and its cases go back to pending.
- Notices (bell and phone push, through the existing notify system): leave approved or rejected; a session added, moved or cancelled (when `notify` is not false); OPD days published; case log reminders.

## Student routes

| Method | Path | Body / query | Answer | Status |
|---|---|---|---|---|
| GET | `/clinic/today` | `?cohort=` | `ClinicToday` | planned |
| GET | `/clinic/week` | `?start=YYYY-MM-DD&cohort=` (start defaults to this Monday) | `ClinicWeek` | planned |
| POST | `/clinic/scan` | `ClinicScanBody` (`token` or `code`, optional `direction`) | `ClinicScanResult` | planned |
| GET | `/clinic/attendance` | `?cohort=` | `ClinicMyAttendance` | planned |
| GET | `/clinic/leave` | `?cohort=` | `ClinicMyLeave` | planned |
| POST | `/clinic/leave` | `ClinicLeaveBody` | `ClinicLeaveRequest` | planned |
| POST | `/clinic/leave/early` | `ClinicEarlyLeaveBody` | `ClinicLeaveRequest` | planned |
| DELETE | `/clinic/leave/:id` | | `{ cancelled: true }` (pending only) | planned |
| GET | `/clinic/opd` | `?cohort=` | `ClinicMyOpd` | planned |
| PUT | `/clinic/opd/batch` | `ClinicBatchBody` (first choice only; after that 409 `conflict`) | `ClinicMyOpd` | planned |
| POST | `/clinic/opd/logs` | `ClinicCaseLogBody` (assigned day, today or past; can be corrected) | `ClinicVisit` | planned |

Scan errors: 400 `bad_request` (code or token wrong, too old, already scanned that way, out before in), 403 `forbidden` (not in this session's cohort), 409 `conflict` (session not open), 429 `rate_limited`.

## Admin routes

| Method | Path | Body / query | Answer | Status |
|---|---|---|---|---|
| GET | `/clinic/admin/overview` | `?cohort=` | `ClinicAdminOverview` | planned |
| GET | `/clinic/admin/timetable` | `?cohort=` | `{ slots: ClinicSlot[] }` | planned |
| POST | `/clinic/admin/timetable` | `ClinicSlotBody` | `ClinicSlot` | planned |
| PUT | `/clinic/admin/timetable/:id` | `ClinicSlotBody` | `ClinicSlot` | planned |
| DELETE | `/clinic/admin/timetable/:id` | | `{ deleted: true }` (sessions already made stay) | planned |
| POST | `/clinic/admin/timetable/apply` | `ClinicApplyBody` (at most 120 days) | `ClinicApplyResult` | planned |
| GET | `/clinic/admin/sessions` | `?cohort=&from=&to=` (defaults: this week) | `{ sessions: ClinicSession[]; notes: { date: string; note: string }[] }` | planned |
| POST | `/clinic/admin/sessions` | `ClinicSessionBody` (one-off) | `ClinicSession` | planned |
| PATCH | `/clinic/admin/sessions/:id` | `ClinicSessionPatch` (move, edit, cancel, restore, note) | `ClinicSession` | planned |
| PUT | `/clinic/admin/notes` | `ClinicDayNoteBody` (empty note removes it) | `{ date: string; note: string \| null }` | planned |
| GET | `/clinic/admin/sessions/:id/code` | (call again when `refreshInMs` runs out) | `ClinicShowCode` | planned |
| GET | `/clinic/admin/sessions/:id/attendance` | | `ClinicLiveAttendance` | planned |
| POST | `/clinic/admin/sessions/:id/attendance` | `ClinicManualMarkBody` | `ClinicLiveAttendance` | planned |
| GET | `/clinic/admin/leave` | `?cohort=&status=pending\|approved\|rejected\|all` | `ClinicLeaveQueue` | planned |
| POST | `/clinic/admin/leave/:id` | `ClinicLeaveDecisionBody` | `ClinicLeaveRequest` | planned |
| GET | `/clinic/admin/allowances` | `?cohort=` | `ClinicAllowances` | planned |
| PUT | `/clinic/admin/allowances` | `ClinicAllowanceBody` (`set` or `add`; no `userIds` = whole cohort) | `ClinicAllowanceResult` | planned |
| GET | `/clinic/admin/opd/settings` | `?cohort=` | `ClinicOpdSettings` | planned |
| PUT | `/clinic/admin/opd/settings` | `ClinicOpdSettings` | `ClinicOpdSettings` | planned |
| GET | `/clinic/admin/opd/quotas` | `?cohort=` | `ClinicQuotas` | planned |
| PUT | `/clinic/admin/opd/quotas` | `ClinicQuotaBody` | `{ changed: number }` | planned |
| POST | `/clinic/admin/opd/extras` | `ClinicExtraBody` | `ClinicQuotaRow` | planned |
| PUT | `/clinic/admin/opd/batch` | `ClinicAdminBatchBody` | `{ batch: ClinicBatch }` | planned |
| POST | `/clinic/admin/opd/generate` | `ClinicGenerateBody` | `ClinicPlan` (the draft) | planned |
| GET | `/clinic/admin/opd/plan` | `?cohort=&state=draft\|published` | `ClinicPlan` | planned |
| POST | `/clinic/admin/opd/move` | `ClinicMoveBody` (409 `conflict` when the day is full and `force` is not set) | `ClinicPlan` | planned |
| POST | `/clinic/admin/opd/publish` | `ClinicPublishBody` | `ClinicPublishResult` | planned |
| DELETE | `/clinic/admin/opd/plan` | `?cohort=` (throws the draft away) | `{ deleted: number }` | planned |
| POST | `/clinic/admin/opd/remind` | `{ cohortId }` | `ClinicRemindResult` | planned |
| GET | `/clinic/admin/trackers` | `?cohort=` | `ClinicTrackers` | planned |
| GET | `/clinic/admin/students/:id` | `?cohort=` | `ClinicStudentDetail` | planned |

## The OPD generator (src/lib/clinic/opd.ts, `generatePlan`)

- Visits needed per student = ceil(pending cases / cases per visit). Pending = base + extras minus cases logged (an attended day with no log yet counts as cases per visit until logged; a missed day counts nothing).
- Candidate days: date range from the settings, from today on, weekday x batch with seats > 0, minus holidays, minus days whose OPD session for that batch is cancelled, minus the student's approved leave days, never two visits on one day, never before the student joined.
- Published visits from today on are kept (that is "Generate again": only the gaps are filled). A kept visit is dropped only if its day is now a holiday, cancelled or on approved leave, or the student needs fewer visits (the latest ones go first, never inside `freezeDays`).
- New visits are spread evenly over each student's remaining days and over the days' free seats. When seats run out the students left short are listed in `short`.
- The draft replaces any earlier draft. Publish swaps the published days from today on for the draft; past days never change.
