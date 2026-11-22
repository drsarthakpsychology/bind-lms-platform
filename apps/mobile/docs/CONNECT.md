# To connect: everything the phone app still needs from the server

One list, by area, of what still runs on sample data or waits for a server
part. It joins the area notes (`CONNECT-badmin.md`, `CONNECT-bauth.md`,
`CONNECT-bclinic.md`, `CONNECT-blab.md`, `CONNECT-blearn.md`, `CONNECT-bme.md`,
`CONNECT-bnotes.md`, `CONNECT-bpractise.md`), which stay for their detail.
Updated when the areas were joined (22 Nov 2026).

Sample data always lives in a `mock.ts` (or `mock-data.json`) beside the
screen and is marked. Admin screens on sample data also show the line "...
shows sample data. It is not connected to the live site yet." (`MockNote`).

## Admin

Sample data: `src/admin/screens/mock.ts`. To connect a screen: swap
`useSample(X)` for a query in `src/admin/api.ts`, remove its `MockNote`, and
delete what it used from `mock.ts`.

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| What is live (feature switches) | `src/admin/screens/switches.tsx` `SwitchesScreen` | Every feature switch with its state, a one-line description, its limit, who used it in 7 days. Writes: set state, set limit | `src/app/(dashboard)/admin/flags/page.tsx`, `flag-toggle.tsx`, `src/lib/flags.ts` |
| Teaching hub | `src/admin/screens/teaching.tsx` `TeachingScreen` | Modules with students, finished count, sections, review date; practice sets with tries, average score, hardest topic; flagged and not reviewed counts | `content/`, `src/lib/study`, `learn_progress`, `answer_history`, `/admin/learning` |
| Class results for a module | `teaching.tsx` `TeachingModuleScreen` | Per section: finished, average minutes, first-try checkpoint score, the most missed question | `learn_progress`, `answer_history`, `src/lib/insights/load.ts` |
| Answer key (section or checkpoint) | `teaching.tsx` `AnswerKeyScreen` | Question, options, right option, explanation, first-try share, most picked wrong option. Writes: flag with a note, clear, mark reviewed | `src/lib/study`, `answer_history`; flag and review marks need a new table |
| Practice set answer key | `teaching.tsx` `PracticeSetScreen` | The same for practice cases, games and mocks | `src/lib/practice/tools.ts`, `content/`, `prep_answers`, `games2_results` |
| Learning insights | `src/admin/screens/insights.tsx` `InsightsScreen` | Active students per day, minutes per student, sections read, answers, first-try share, hardest topics, where students stop, who has gone quiet | `src/app/(dashboard)/admin/learning/page.tsx`, `loadLearningInsights` in `src/lib/insights/load.ts` |
| Wall reports | `src/admin/screens/queues.tsx` `WallReportsScreen` | Reported posts with text, author, reporter, reason, time, state. Writes: keep, remove post | `src/app/(dashboard)/admin/wall-reports/page.tsx`, `wall-reports-list.tsx` |
| Failed emails | `queues.tsx` `FailedEmailsScreen` | Failed sends for 7 days with address, name, subject, reason, tries. Writes: send one again, send all again | `src/app/(dashboard)/admin/emails/page.tsx` (`loadOpenFailures` in `src/lib/email/failed`), `failed-list.tsx`, `retry-actions.ts` |
| Add a student | `src/admin/screens/access.tsx` `AddStudentScreen` | Cohort list. Write: create one or many students, cohort, access preset, send login link | `src/app/(dashboard)/admin/students/**`, `/admin/roster` |
| Access for many | `access.tsx` `BulkAccessScreen` | Cohorts with counts. Writes: section switches for a cohort or picked students, full or lectures only, pause and resume | `src/app/(dashboard)/admin/access/access-manager.tsx`, `actions.ts`, `src/lib/access` |
| Student page, Access tab, section switches | `access.tsx` `StudentSections` | This student's six section switches. Write: open or close one | as above, per student (`access_blocks`) |
| Student page, Record tab | `access.tsx` `StudentRecord` | Study progress by module, weak areas, attendance totals, cases logged against the target | `learn_progress`, `answer_history`, clinic attendance and OPD logs |

Now real: Leaderboard (`GET /leaderboards/:board`, every student, cohort,
search, sort, pages) and Test mode (switch, open as test student, reset). The
board rows carry no student id, so a row does not open the student page; add
an id to the admin board rows to make that possible.

Not built on purpose: uploading or editing courses and lectures.

## Signing in and first run

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Setup link, Forgot password | `src/screens/auth/setup.tsx`, `forgot.tsx` | The welcome email link must open the app (app links) | `app.config.ts`, `app/+native-intent.tsx`, website `/.well-known` files |
| First run, notifications | `src/screens/auth/permissions.tsx` | The Firebase file and the Expo project id in the release build | `src/push/index.ts`, `.github/workflows/app-android.yml` |
| Lectures-only page | `src/screens/auth/scope.tsx` | The list of closed parts is kept in the app (`FULL_ONLY`); read it from `/me` if the server sends it | the `scope` refusal in the app API |

## Clinic (student)

All screens read real data. Before release the two-step scan routes
`/clinic/scan/identify` and `/clinic/scan/confirm` must be live on the server,
or every scan says "That code did not work".

## Learn

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Lecture page, Chapters tab | `src/screens/lecture/lecture.tsx`, sample in `src/screens/lecture/mock.ts` (`mockChapters`) | `chapters: { at, title }[]` on `GET /lectures/:lessonId` | Not on the website yet |
| Lecture page, My notes tab | same files (`MOCK_NOTES`) | Per-student notes pinned to a time: `GET` and `PUT /lectures/:lessonId/notes` | Not on the website; copy `src/app/api/app/v1/study/marks/route.ts` |

## Practise

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Full case player (`/case/full`, mock builds only) | `src/practise/player/rich.tsx`, sample in `src/practise/player/mock.ts` | Rich cases in `src/practise/player/types.ts`, keys sent only after each answer | Not built yet (`src/lib/practice/rich/*`) |
| Pick-one practice steps | `src/practise/player/step.tsx` | Live already; hints, per-option reasons and common errors show once the banks carry them | Content work |
| Hub levels | `src/practise/hub.tsx` (`LEVEL_OF`) | A level per tool from the server | `src/lib/practice/ladder.ts` |
| Hub numbers, board rank | `src/practise/hub.tsx` `Numbers` | A rank field on the hub's League row | `src/app/(dashboard)/leaderboard/*` |
| Quest moment | `src/practise/quest.tsx` | Works; a quest id per practice record would show it at once | `src/lib/quests/*` |

## Read and reason, and wellbeing (Practise tab)

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Psychology Lab, home and experiment | `src/lab/screens.tsx`, data in `src/lab/mock.ts` (`mock-data.json`); runs kept on the phone (`src/lab/progress.ts`) | `GET /lab` behind the `lab` switch, `GET /lab/:id`, `POST /lab/:id/run`, `/check`, `/reflect` | `src/lib/lab/experiments.ts`, `experiments2.ts`, `src/app/(dashboard)/games/lab/gate.ts`, `src/lib/learn/engine.ts` |
| Lab reflection | `src/lab/screens.tsx` | A text box saved with `recordLabReflection` | `src/components/lab/experiment-view.tsx` |
| Lab scoring | `src/lab/scoring.ts`, `scoring2.ts` | Nothing; keep the copies in step with the website | `src/lib/lab/scoring.ts`, `scoring2.ts` |
| Casebook | `src/casebook/screens.tsx`, sample in `src/casebook/mock.ts` (`mock-data.json`, 15 activities) | `GET /casebook` behind the `lab` switch, `GET /casebook/:id`, adaptive rounds | `src/content/casebook/*.ts`, `src/lib/casebook/rounds.ts`, `src/components/casebook/case-player.tsx` |
| Saved cases, best scores | `src/casebook/progress.ts` (on the phone only) | Saved cases and results in the learn state | `src/lib/learn/engine.ts` |
| Mock interview | `src/interview/screen.tsx`, sample in `src/interview/mock.ts` | `GET /prep/interview`, reveal, feedback, saving the session (written on branch `agent/appaudit`, not merged) | `src/app/(dashboard)/prep/interview/*`, `src/lib/prep/interview.ts`, `src/lib/prep/bank.ts` |
| Ethics | `src/ethics/screens.tsx` | Real data (`GET /practise/tools/ethics`) | done |
| Self-checks, Calm | `src/selfcheck/*`, `src/calm/*` | Complete on the phone, nothing stored. To open them signed out, add `selfcheck` and `calm` to `PUBLIC` in `src/nav/guard.ts`. Calm bubbles is not built | `src/lib/free/tests.ts`, `src/lib/free/calm.ts` |

The Practise tab shows Lab and Casebook to everyone on Practise; once `GET
/lab` exists, hide them when the `lab` switch is off.

## Notes tab

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Medicines, by how they work | `src/library/list.tsx`, sample in `src/library/mock.ts` | Groups of medicine ids per target. `GET /library/reference` already answers `byMechanism`; add a hook and match slugs to ids | `src/lib/app-api/library.ts`, `mechanismIndex()` in `src/lib/psychopharm/store.ts` |
| Pinned and recently opened | `src/library/pins.ts` (on the phone only) | A saved list per student | the learn state store (`src/lib/learn`) |
| Quick reference card, extra slots | `src/screens/reference/reference.tsx` | Threshold, onset, settings, impairment, types, lesson link on `GET /library/terms/:slug` | Not on the website yet |
| Revision notes search | `src/screens/notes/notes.tsx` | Search inside the note text | `src/lib/search/everything.ts` (titles only today) |
| Revision notes filter chips | `src/screens/notes/notes.tsx` | A topic and a type per note | `src/lib/learn/notes/types.ts` |
| Note page, Practise this | `src/screens/notes/notes.tsx` | The note's own quiz, scenarios and lesson on `GET /study/notes/:id` | `src/components/learn/note-view.tsx` |
| Medicine page, related practice | `src/library/medicine.tsx` | Practice tied to a medicine | None yet |

## Search

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Search | `src/search/screen.tsx` | Real data from the phone plus `GET /search`. The browser build's mock server has no `/search`. Lab and Casebook results come from their sample files until those have an API | `src/lib/search/engine.ts`, `src/lib/search/everything.ts` |

## Me

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| One certificate | `src/screens/me/certificate.tsx` (`CertificatePage`) | A student route that returns the certificate's drawing; then use `CertDrawing` | the admin preview, `src/admin/cert-drawing.tsx` |
| Settings, profile | `src/screens/me/settings.tsx` (`EditProfile`) | Only if name changes are wanted: `PATCH /me` with `name` | `src/app/api/app/v1/me/route.ts` |

Now done: the colour-blind setting changes the colours (right blue, wrong
orange); notification settings and the class wall tile need nothing.

## Browser build only

The mock server signs in before it applies `?mock=`, and every tab's data is
fetched the moment the account opens, so `?mock=error` and `?mock=new` with
`?as=` show the normal data. Use the jest tests for those states.
