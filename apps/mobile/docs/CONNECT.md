# To connect: everything the phone app still needs from the server

One list, by area, of what still runs on sample data or waits for a server
part. It joins the area notes (`CONNECT-badmin.md`, `CONNECT-bauth.md`,
`CONNECT-bclinic.md`, `CONNECT-blab.md`, `CONNECT-blearn.md`, `CONNECT-bme.md`,
`CONNECT-bnotes.md`, `CONNECT-bpractise.md`), which stay for their detail.
Updated when the areas were joined (22 Nov 2026).

Sample data always lives in a `mock.ts` (or `mock-data.json`) beside the
screen and is marked. The admin side has none left.

## Admin

Nothing on the admin side runs on sample data any more (22 Nov 2026). The
sample file and the "sample data" note are gone. Each screen below reads an
admin-gated app route that reuses the website's own server code; writes are
Super Admin only on the server. Client code: `src/admin/live.ts`. Browser
build answers: `src/admin/mock-live.ts`.

| Screen | File | Route | Website code it reuses |
|---|---|---|---|
| Learning tab (every student, and whole class) | `src/admin/screens/learning.tsx` `LearningScreen` | `GET /admin/learning` | `loadRoster`, `learn_progress`, `computeLearningInsights` |
| One student's learning, and the student page Learning tab | `learning.tsx` `LearnerScreen`, `StudentLearning` | `GET /admin/learning/:id` | as above |
| Admins | `src/admin/screens/admins.tsx` | `GET /admin/admins`, `POST /admin/admins/:id/role` | profiles roles, admin audit log |
| Failed emails (Send again, Clear, Clear all) | `src/admin/screens/queues.tsx` `FailedEmailsScreen` | `GET /admin/emails/failed`, `POST .../retry`, `POST .../clear` | `loadOpenFailures`, `retryFailedEmails`; Clear sets `dismissed_at` (2026_11_mail_clear.sql, already live) |
| Wall reports | `queues.tsx` `WallReportsScreen` | `GET /admin/wall-reports`, `POST /admin/wall-reports/:id/close` | the website's resolve (the post stays) |
| Features for students (was What is live) | `src/admin/screens/switches.tsx` | `GET /admin/switches`, `POST /admin/switches/:key` | `feature_flags`, as `/admin/flags` |
| Add students | `src/admin/screens/access.tsx` `AddStudentScreen` | `POST /admin/students/add` | `addPeopleToCohort` |
| Access for many | `access.tsx` `BulkAccessScreen` | `GET /admin/access`, `POST /admin/access` | `setScopeFor`, `setFeatureFor`, `setAccountStatus` |
| Student page, Access tab switches | `access.tsx` `StudentSections` | `GET` and `POST /admin/students/:id/access` | as above, per student (`access_blocks`) |

Removed on purpose: the Teaching answer keys and class results per section
(flags and review marks need a table the website does not have), the
supervision Sign-offs tab (supervision is switched off on the website; the
code is kept as `SupervisionSignOffs` in `review.tsx`), the Learning insights
screen (its real numbers are the Learning tab's Whole class view; old links
land there), attendance and cases on the student Record tab (attendance is
in Clinic trackers).

Still waiting: the leaderboard rows carry no student id, so a row does not
open the student page. Not built on purpose: uploading or editing courses and lectures.

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
