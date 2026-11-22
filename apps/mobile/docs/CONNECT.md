# To connect: everything the phone app still needs from the server

One list, by area, of what still runs on sample data or waits for a server
part. It joins the area notes (`CONNECT-badmin.md`, `CONNECT-bauth.md`,
`CONNECT-bclinic.md`, `CONNECT-blab.md`, `CONNECT-blearn.md`, `CONNECT-bme.md`,
`CONNECT-bnotes.md`, `CONNECT-bpractise.md`), which stay for their detail.
Updated when the areas were joined (22 Nov 2026), then again when the
student screens left sample data (22 Nov 2026, round 2: see "Hidden until
the website has it" at the end).

No student screen runs on sample data any more. The browser build's mock
server (`src/api/mock`, loaded only when `EXPO_PUBLIC_API_MODE` is `mock`)
answers the same routes as the website. Admin sample data still lives in
`src/admin/screens/mock.ts`. Admin screens on sample data also show the line "...
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
| Lecture page, Chapters tab (hidden: `SHOWN.lectureChapters`) | `src/screens/lecture/lecture.tsx` | `chapters: { at, title }[]` on `GET /lectures/:lessonId` | Not on the website yet |
| Lecture page, My notes tab (hidden: `SHOWN.lectureNotes`) | same file | Per-student notes pinned to a time: `GET` and `PUT /lectures/:lessonId/notes` | Not on the website; copy `src/app/api/app/v1/study/marks/route.ts` |

## Practise

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Full case player (`/case/full`, hidden: `SHOWN.fullCasePlayer`) | `src/practise/player/rich.tsx`, design sample in `src/practise/player/mock.ts` | Rich cases in `src/practise/player/types.ts`, keys sent only after each answer | Not built yet (`src/lib/practice/rich/*`) |
| Pick-one practice steps | `src/practise/player/step.tsx` | Live already; hints, per-option reasons and common errors show once the banks carry them | Content work |
| Hub levels | `src/practise/hub.tsx` (`LEVEL_OF`) | A level per tool from the server | `src/lib/practice/ladder.ts` |
| Hub numbers, board rank | `src/practise/hub.tsx` `Numbers` | A rank field on the hub's League row | `src/app/(dashboard)/leaderboard/*` |
| Quest moment | `src/practise/quest.tsx` | Works; a quest id per practice record would show it at once | `src/lib/quests/*` |

## Read and reason, and wellbeing (Practise tab)

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Psychology Lab, home and experiment | `src/lab/screens.tsx`, `src/lab/data.ts` | Done: `GET /lab` (behind the `lab` switch), `POST /lab/:id/run`, `/check` (graded on the server), `/reflect` | `src/lib/app-api/lab.ts`, routes in `src/app/api/app/v1/lab` |
| Lab reflection | `src/lab/screens.tsx` | The reflection box is not drawn yet; `POST /lab/:id/reflect` is ready for it (the text stays on the phone, as on the website) | `src/components/lab/experiment-view.tsx` |
| Lab scoring | `src/lab/scoring.ts`, `scoring2.ts` | Nothing; keep the copies in step with the website | `src/lib/lab/scoring.ts`, `scoring2.ts` |
| Casebook | `src/casebook/screens.tsx` | Done: `GET /casebook`, `POST /casebook/:id/done` (score checked against the case, round level from the server). The phone's rounds do not use the level yet | `src/lib/app-api/lab.ts`, `src/lib/casebook/rounds.ts` |
| Saved cases (hidden: `SHOWN.savedCases`) | `src/casebook/progress.ts` | A saved list per student | Not on the website |
| Mock interview | `src/interview/screen.tsx` | Done: `GET /prep/interview`, `POST /play/prep/interviewReveal` and `interviewSave`. AI feedback (`interviewFeedback`) is on the server but its switch is off, so the app does not show it | `src/lib/app-api/prep.ts`, `src/app/(dashboard)/prep/actions.ts` |
| Ethics | `src/ethics/screens.tsx` | Real data (`GET /practise/tools/ethics`) | done |
| Self-checks, Calm | `src/selfcheck/*`, `src/calm/*` | Complete on the phone, nothing stored. To open them signed out, add `selfcheck` and `calm` to `PUBLIC` in `src/nav/guard.ts`. Calm bubbles is not built | `src/lib/free/tests.ts`, `src/lib/free/calm.ts` |

The Practise tab leaves out the Lab and Casebook cards when `GET /lab`
answers that the Lab is switched off or closed for the account.

## Notes tab

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Medicines, by how they work | `src/library/list.tsx` (`useByMechanism`) | Done: `GET /library/reference` `byMechanism`, matched by slug or name | `src/lib/app-api/library.ts` |
| Pinned and recently opened (hidden: `SHOWN.pins`) | `src/library/pins.ts` | A saved list per student | Not on the website |
| Quick reference card, extra slots | `src/screens/reference/reference.tsx` | Threshold, onset, settings, impairment, types, lesson link on `GET /library/terms/:slug` | Not on the website yet |
| Revision notes search | `src/screens/notes/notes.tsx` | Search inside the note text | `src/lib/search/everything.ts` (titles only today) |
| Revision notes filter chips | `src/screens/notes/notes.tsx` | A topic and a type per note | `src/lib/learn/notes/types.ts` |
| Note page, Practise this | `src/screens/notes/notes.tsx` | The note's own quiz, scenarios and lesson on `GET /study/notes/:id` | `src/components/learn/note-view.tsx` |
| Medicine page, related practice | `src/library/medicine.tsx` | Practice tied to a medicine | None yet |

## Search

| Screen | File | Data it needs | Website code that has it |
|---|---|---|---|
| Search | `src/search/screen.tsx` | Real data from the phone plus `GET /search`. The browser build's mock server has no `/search`. Lab and Casebook results come from `GET /lab` and `GET /casebook` | `src/lib/search/engine.ts`, `src/lib/search/everything.ts` |

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

## Hidden until the website has it

Built, switched off in `src/lib/shown.ts` (`SHOWN`), because the website has
no data for them. Set the line to `true` once the server part exists.

| Switch | What it hides | Needs |
|---|---|---|
| `lectureChapters` | Lecture page, Chapters tab | Chapters per lecture on the website |
| `lectureNotes` | Lecture page, My notes tab | Per-lecture notes on the website |
| `savedCases` | Casebook, Saved tab and the bookmark on a case | Saved cases on the website |
| `pins` | Pin buttons, Pinned and Recently opened in Notes | Pins on the website |
| `fullCasePlayer` | `/case/full` and its card on the Practise tab | Rich cases on the website |

The design gallery (`/kit`) opens only in the browser build on sample data
and in development (`designPages`), never in a release build.
