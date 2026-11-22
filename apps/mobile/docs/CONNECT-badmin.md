# To connect: admin side (area builder "badmin")

Screens built in full with sample data because the phone app has no API for
them yet. The sample data lives in one file,
`src/admin/screens/mock.ts` (it starts with the MOCK DATA comment). Every one
of these screens shows the line "... shows sample data. It is not connected to
the live site yet." (`MockNote`, `src/admin/ui.tsx`) until it is connected.
When a screen is connected: swap `useSample(X)` for a real query hook in
`src/admin/api.ts`, remove its `MockNote`, and delete what it used from `mock.ts`.

## To connect

| Screen | File | What data it needs | Website code that has it |
|---|---|---|---|
| What is live (feature switches) | `src/admin/screens/switches.tsx` `SwitchesScreen` | Every feature flag with its state (off, live, unlocked), a one-line description, its limit (value, min, max, unit) where it has one, students who used it in the last 7 days and the last few names. A write: set state, set limit | `src/app/(dashboard)/admin/flags/page.tsx`, `flag-toggle.tsx`, `src/lib/flags.ts` (`feature_flags` table). Usage counts: `page_visits` / learning events. Limits are in each tool's settings (clinic allowances, OPD settings) |
| Teaching hub | `src/admin/screens/teaching.tsx` `TeachingScreen` | Study modules with students, finished-all count, sections, review date; practice sets with tries, average score, hardest topic; counts of flagged and not-reviewed questions | Module files under `content/` and `src/lib/study`; class progress in `learn_progress`; answers in `answer_history`; `/admin/learning` page |
| Class results for a module | `teaching.tsx` `TeachingModuleScreen` (`/admin/teaching/[module]`) | Per section: finished, average minutes, first-try checkpoint score; the question most got wrong | `learn_progress`, `answer_history`, `src/lib/insights/load.ts` |
| Answer key (section or checkpoint) | `teaching.tsx` `AnswerKeyScreen` (`/admin/teaching/section/[id]`) | Full question, options, correct option, explanation, share right at first try, most-picked wrong option; reading text opening; flag note, reviewed by and when. Writes: flag with a note, clear flag, mark reviewed | Study module content files (`src/lib/study`), `answer_history`. Flag and review marks need a new table (roles audit P2: "flag for correction, last reviewed by and when") |
| Practice set answer key | `teaching.tsx` `PracticeSetScreen` (`/admin/teaching/practice/[id]`) | Same as the answer key, for practice cases, games and mocks | `src/lib/practice/tools.ts`, `content/` practice data, `prep_answers`, `games2_results` |
| Full leaderboard | `src/admin/screens/insights.tsx` `AdminLeaderboardScreen` (`/admin/leaderboard`) | Every student on each board (this week, all time, games, practice) with full name, cohort, points, games, streak | The app already has the admin board through `src/practise/board.tsx` (`LeaderboardAdmin`); connect by reading that endpoint per board here |
| Learning insights | `insights.tsx` `InsightsScreen` (`/admin/insights`) | Active students per day for 7 days, minutes per student, sections read, questions answered, first-try right share, hardest topics with answer counts, where students stop, who has gone quiet | `src/app/(dashboard)/admin/learning/page.tsx`, `src/lib/insights/load.ts` |
| Wall reports | `src/admin/screens/queues.tsx` `WallReportsScreen` (`/admin/wall-reports`) | Reported posts with text, author, reporter, reason, time, state. Writes: keep, remove post | `src/app/(dashboard)/admin/wall-reports/page.tsx`, `wall-reports-list.tsx` |
| Failed emails | `queues.tsx` `FailedEmailsScreen` (`/admin/failed-emails`) | Failed sends for 7 days: address, name, student id, subject, reason, what to do, time, tries. Writes: send one again, send all again | `src/app/(dashboard)/admin/emails/failed-list.tsx`, `retry-actions.ts` |
| Add a student | `src/admin/screens/access.tsx` `AddStudentScreen` (`/admin/students/new`) | Cohort list. Write: create one or many students (name, email, mobile, roll), cohort, access preset, send login link | `src/app/(dashboard)/admin/students/**` (add student), `/admin/roster` |
| Access for many | `access.tsx` `BulkAccessScreen` (`/admin/access`, `?ids=` from People) | Cohorts with counts. Writes: per-section switches for a cohort or picked students; scope full or lectures-only; pause and resume many | `src/app/(dashboard)/admin/access/access-manager.tsx`, `actions.ts`, `src/lib/access` (`access_blocks`), `profiles.scope`, `profiles.status` |
| Student page, Access tab: section switches | `access.tsx` `StudentSections` (inside `/student/[id]?tab=access`) | This student's six section switches. Write: open or close one | Same as above, per student (`access_blocks`) |
| Student page, Record tab | `access.tsx` `StudentRecord` (`/student/[id]?tab=record`) | Study progress by module with checkpoint score, weak areas, attendance totals and the last sessions, cases logged against the target and the last cases | `learn_progress`, `answer_history`, clinic attendance and OPD logs (`/admin/clinic/trackers/[userId]`) |

Already real (no sample data): Home (needs attention, numbers, cohorts), the
clinic (today, session, Show code, timetable, leave, allowances, OPD,
trackers), People list and student page (Overview, Access login and phone,
Activity, Credentials, Messages), Announcements, Doubts, Review, Cohorts,
Enquiries, Forms, Certificates, System, Admin alerts, Test mode (switch, open,
reset).

Not built on purpose: uploading or editing courses and lectures (website only;
Teaching links to it).
