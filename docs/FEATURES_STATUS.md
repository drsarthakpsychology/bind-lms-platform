# Features and status

Status on 2026-11-14, from the code, the live `feature_flags` table, the Vercel variables and the reports in `docs/releases`, `docs/qa`, `docs/security` and `docs/design`.

Status words:

- **Live**: on `main` (vibhapsychology.com) and open to students.
- **Test link only**: on `admin-redesign`, not yet merged to `main`.
- **Flag off**: built, hidden by a feature flag or a code switch.
- **Partial**: works, but a part is missing or not running.
- **Not built**: planned or stubbed only.

## Students

| Feature | Where | Status | Notes |
|---|---|---|---|
| Login, setup link, one device at a time, paused and expired screens | `/login`, `/setup`, `src/lib/auth` | Live | Turnstile bot check off (no key) |
| Home and "today" | `/dashboard`, `/today` | Live | |
| Lectures (HLS video, resume, mark complete, next) | `/courses/[courseId]/lessons/[lessonId]` | Live | 17 lectures, all HLS on R2. Continue opens the first unfinished lecture, not the last watched one (QA Study report) |
| Course materials | `/courses/[courseId]/materials/[id]` | Live | 1 file today |
| Assignments (text, files, audio) | lesson page | Live | 0 submission files so far |
| Attention checks during lectures | lesson page | Live | |
| Doubts board | `/doubts` | Live | Follow-up email cron not running (see crons) |
| Notifications | `/notifications` | Live | |
| Study modules (39 modules, levels, checkpoints, module tests) | `/study` | Live (flag `learn` unlocked) | Module tests graded on the server |
| Study map, placement | `/study/map`, `/study/placement` | Live | |
| Notes and reference | `/study/notes`, `/study/reference` | Live | |
| Exam Prep (subjects, sets, mocks, long answers, interview) | `/prep` | Live | Exam tracks and onboarding switched off in code (`EXAM_TRACKS_ENABLED`, `PREP_ONBOARDING_ENABLED` false) |
| Games: Daily case, Duel, Criteria sort, Blitz, MSE Lab, Ward Week, Rx Detective, Escape Room, Comorbid | `/games/*` | Live | Several games still ship answers in the browser; the server re-grades and caps XP (security audit residual) |
| Lab | `/games/lab` | Live (flag `lab` unlocked) | |
| Ethics and law | `/practice/ethics` | Live (flag `ethics` unlocked) | |
| Detective, scenarios, terms, daily practice | `/practice/detective`, `/scenarios`, `/terms`, `/daily` | Live | AI case tab in Daily uses Groq |
| Medicines (psychopharm) | `/tools/psychopharm` | Partial | Runs in test mode (`NEXT_PUBLIC_PSYCH_MODE` unset): students see draft and in-review pages with a badge |
| Achievements, badges, certificates | `/achievements` | Live | Monthly merit certificates need the monthly cron (not running) |
| Leaderboard, leagues, standing notes | `/leaderboard`, `/progress` | Partial | Points save on play. Weekly league close and standing notes need the standing cron (not running) |
| Wall (case of the week) | `/wall` | Live (no flag) | |
| Journey, record, reflect, passport pages | `/journey`, `/record`, `/reflect`, `/passport` | Live pages; passport data comes from `skills_passport` tools that are off |
| Settings (theme, colour-blind mode) | `/settings` | Live | |
| Free public tools | `/free` | Live | |
| Certificate check | `/verify/[id]` | Live | |
| Waitlist and public forms | `/waitlist`, `/f/[slug]` | Live | |
| Phone layout pass (bottom actions in thumb reach, 44 px taps, bottom sheets, tab bar steps aside while typing, dialogs fit the screen) | many | **Test link only** | 26 commits on `admin-redesign` (`docs/design/MOBILE_UX_RESEARCH_2026_11.md`). One related fix (`a95eff32`, page bottom under the tab bar) is on `main` only |

## Practice layer (all built, all flag off)

| Flag | Feature |
|---|---|
| `consulting_room` | Simulated patient interview (AI), grading, debrief, rewind, voice |
| `personalised_patients` | Patients tuned to the student |
| `mse` | MSE practice levels |
| `judgment` | Judgment calls (SCT) |
| `osce` | OSCE stations |
| `formulation` | Formulation Forge and wall |
| `rounds` | Spaced review cards |
| `decoder` | Idiom decoder |
| `journal` | Journal and AI help |
| `checkin` | Weekly check-in |
| `two_minute_clinic` | Daily two-minute clinic |
| `supervision` | Supervision hours and sign-off |
| `skills_passport` | Skills Passport and PDF |
| `weak_spots` | Weak spots view |
| `peer_roleplay` | Peer role-play |
| `case_library` | Case library and notes |
| `landmark` | Landmark studies |
| `knowledge_tutor` | Knowledge tutor (book search and AI answers) |
| `learning_profile` | Learning profile |
| `modules` | Modules access layer (no content editor; earlier notes call it safe to retire) |

Turning one on is an admin choice at `/admin/flags`. Many need AI keys and voice settings that are not set (see `docs/architecture/INTEGRATIONS.md`). The browser blocks the microphone (`Permissions-Policy: microphone=()` in `next.config.ts`), so voice features need that header changed first.

## Admins

| Feature | Where | Status |
|---|---|---|
| Admin home, five sections with tabs | `/admin` | Live |
| Students: add, CSV import, setup emails, pause, delete, reset | `/admin/students`, `/admin/roster` | Live |
| Cohorts, sharing lectures with cohorts, single-lesson access | `/admin/cohorts` | Live |
| People and CRM stages | `/admin/people`, `/admin/enquiries` | Live |
| Access (scope and per-feature blocks) | `/admin/access` | Live |
| Courses, lessons, video upload, materials, assignments | `/admin/courses` | Live. HLS encoding is a separate step (`scripts/publish-lecture.ts`) |
| Submissions review | `/admin/submissions` | Live |
| Doubts and inbox (with AI draft answers) | `/admin/doubts`, `/admin/inbox` | Live |
| Emails: campaigns, compose, delivery tracking, inbound replies, retries | `/admin/emails` | Live |
| Notifications to students | `/admin/emails` | Live |
| Forms builder | `/admin/forms` | Live |
| Achievements and credentials, custom certificates | `/admin/achievements`, `/admin/credentials` | Live |
| Activity and learning reports, CSV downloads | `/admin/activity`, `/admin/learning`, `/admin/pulse` | Live |
| Feature flags | `/admin/flags` | Live |
| Infra page | `/admin/infra` | Partial: history needs the infra snapshot job, which needs `CRON_SECRET` |
| Admin management (super admin and view admin) | `/admin/management` | Live |
| Master password | `/admin/tools` | Live |
| Medicines editor and review | `/admin/psychopharm`, `/admin/psychopharm-review` | Live for editors and reviewers |
| AI cases review, sim review, calibration, cards, idioms, corpus, triage, wall reports, supervision, checkins | `/admin/*` | Built; most serve practice features that are flag off |

## Platform and operations

| Item | Status | Notes |
|---|---|---|
| Vercel crons (standing, monthly, doubt follow-up) | **Not running** | `CRON_SECRET` missing in Vercel, endpoints answer 401 |
| GitHub cron calls (keepalive, infra snapshot, alumni, scheduled release) | **Not running (app side)** | Same cause. The keepalive matters: the Free plan pauses an idle database |
| Nightly database backup and weekly check | Running if the GitHub secrets are set | Does not use `CRON_SECRET` |
| Uptime check | Running if the GitHub secrets are set | |
| Daily reminder emails | Not built | `send-reminders` returns `not_configured` |
| `ai_usage_log` pruning | Not scheduled | `?task=prune-logs` exists, no workflow calls it |
| Sentry, PostHog | Off | No keys set |
| Payments | Not built | Enrolment is admin-driven |
| Older certificate action prints the student email as the name | Known issue | `admin/students/certificate-action.ts`. The newer credentials system uses names |
| Skew Protection | Owner step | Recommended in `docs/qa/DATA_SAVING_2026_11.md` |
| Rotate the Supabase secret key pasted into chat | Owner step | From the release notes |
| Book files | Owner step | Upload by hand to R2 `vibha-books-private`; no app code reads it yet |

## Deferred to a later phase (content generation)

Per the owner's brief, these wait until the application work is done:

- Growing the question banks (Exam Prep, study checkpoints, module tests).
- Writing and refining long answers.
- Library growth (more books and cases in the knowledge layer and case library).
- Editing and refining study content, sim case and character text (the stored text still has old dashes; `scripts/upsert-characters.ts` would rewrite it in the live database).
- The open fact check on esketamine nasal spray marketing approval in India.

## Pending owner decisions

1. Set `CRON_SECRET` and `GAMES_SECRET` in Vercel.
2. Merge `main` into `admin-redesign`, then review and merge the phone layout pass.
3. Run `supabase/migrations_pending/2026_11_14_scaling_indexes.sql`.
4. Decide on `NEXT_PUBLIC_PSYCH_MODE=production`.
5. Delete the unused Vercel variables `R2_DIRECT_STREAMING`, `DEMO_SUPPRESS_EMAIL`, `DEMO_ACHIEVEMENTS_USER_ID`.
6. Plan for the cost items in `docs/SCALABILITY_30_TO_300.md` before 300 students.
