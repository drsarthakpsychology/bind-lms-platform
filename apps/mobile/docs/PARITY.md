# Website to app parity: Learn, Lectures, Me (students and lecture-only accounts)

What a student or a lecture-only account does on the website outside Practise,
admin and the signed-out pages, and where it is in the app. Practise, games,
cases, Exam Prep and medicines are in the Practise agent's notes; admin and the
visitor screens in theirs.

Status words: **done** (native screen on the real server route), **built now**
(added in this round), **server added** (route added in this round), **off**
(switched off on the website too, nothing to build), **later** (not built, why
is given).

Website pages are under `src/app/(dashboard)`. Server routes are under
`/api/app/v1` (`src/app/api/app/v1`, documented in `docs/app/API_CONTRACT.md`).

## Learn

| Website | App screen | Server route | Status |
|---|---|---|---|
| `/learn` hub (Lectures, Modules, Notes, Quick reference) | Learn tab `src/screens/learn/hub.tsx` | `/courses`, `/study/modules` | done; Notes, Quick reference, Saved and Assignments rows built now |
| `/courses` | `/lectures` | `GET /courses` | done |
| `/courses/[courseId]` | `/course/[courseId]` | `GET /courses/:courseId` | done |
| `/courses/[c]/lessons/[l]` lecture page | `/lecture/[lessonId]` | `GET /lectures/:lessonId` | done |
| Protected player (HLS AES-128, per-viewer key, watermark name + roll number, capture block, pause on capture) | `src/lecture/player.tsx`, `watermark.tsx`, `modules/capture-guard` | `POST /lectures/:id/stream`, then the website's `/api/media/stream` | done (FLAG_SECURE for the whole app in `app/_layout.tsx`; picture hidden and paused while captured or mirrored; refused on rooted phones) |
| Resume where you left off | player starts at `StreamAccess.resumeSeconds` | `POST /lectures/:id/progress` (and the `/save` outbox when offline) | done |
| Mark as watched / Complete and continue | lecture screen button | `POST /lectures/:id/complete` | done (409 `needs_submission` says to hand the assignment in first) |
| Lecture materials (PDF, audio, image, links) | `/material/[id]` | `GET /materials/:id`, `GET /materials/:id/file` | done |
| Assignment hand-in (text, files, audio, take back) | lecture screen, Assignment tab `src/lecture/handin-ui.tsx` | `/assignments/:id/*` | done |
| Assignments list with due dates and scores | `/assignments` | `GET /assignments` | built now |
| `/study` modules | `/study` | `GET /study/modules` | done |
| `/study/[module]` | `/study/[moduleId]` | `GET /study/modules/:moduleId` | done |
| `/study/[module]/[section]` reader | `/study/[moduleId]/[sectionId]` | `GET /study/modules/:m/sections/:s` | done; Student and Clinician views (choice now kept on the phone), viva cards, bookmark that knows its state, and a private note per section built now |
| Section widgets (30+ kinds) and figures | `src/study/widgets`, figure widget draws the server SVG | `GET /study/figures/:id` | done (unknown kinds show a plain row, never crash) |
| Checkpoints | `/study/[m]/checkpoint/[n]` | `GET`/`POST /study/modules/:m/checkpoints/:n(/answers)` | done (graded on the server) |
| Module test and re-tests | `/study/[m]/test` | `POST /study/modules/:m/test` | done |
| Progress saving (read, points, last place) | `src/study/state.ts` | `PUT /study/state` (clamped and merged on the server), `/save` outbox | done |
| Bookmarks and notes | reader toolbar, `/saved` | `GET`/`PUT /study/marks` | built now (list of everything saved, with your notes) |
| `/study/notes` revision notes (summaries) | `/notes` | `GET /study/notes` | built now |
| `/study/notes/[id]` | `/notes/[id]` | `GET /study/notes/:noteId` | built now (Student and Clinician lines, say-it-clinically pairs, figures) |
| `/study/reference` Quick reference A to Z (glossary, disorders, medicines) | `/reference` | `GET /library/terms?q=` | built now |
| `/study/reference/[slug]` | `/reference/[slug]` | `GET /library/terms/:slug` | built now |
| `/study/placement` level check | none | none | off: `PREP_ONBOARDING_ENABLED` is false, the website sends it back to Study |
| `/study/map` learning map (Fix it, mix-ups, topic by skill) | `/map`, opened from Progress ("Your full map", as on the website) | `GET /study/map` | server added, built now (gate: flag `learn` and path `/study/map`, as `requireFeature("learn")`) |
| `/study/map/practice` rounds (mixed, or one topic) | `/map/practice?topic=` | `GET /study/map/practice`, `POST /study/map/practice/answers` (the website's `answerPractice`) | server added, built now |

## Me

| Website | App screen | Server route | Status |
|---|---|---|---|
| `/me` hub | Me tab `src/screens/me/me.tsx` | `GET /me` | done; My journey and Badges rows built now |
| `/progress` | `/progress` | `GET /progress` | done |
| `/journey` My journey (level, points, rank, hours, streak, practice) | `/journey` | `GET /journey` | server added, built now |
| `/achievements` certificates | `/certificates` | `GET /achievements` | done |
| `/achievements#badges` | `/certificates` (badges grid and what is still to earn) | `GET /achievements` | done |
| `/achievements/[id]` one certificate, download, share | `/certificate/[id]` | `GET /achievements/:id/pdf` | done |
| `/verify/[id]` | `/verify/[certificateId]` | `GET /public/certificates/:id` | done |
| `/leaderboard` | Practise agent's board screen | `GET /leaderboards/:board` | Practise agent |
| `/reflect` journal | none | none | off: flag `journal` is not unlocked on the website |
| `/doubts` | `/doubts` (lecture-only: Doubts tab) | `GET /doubts` | done |
| `/doubts/[id]` replies, votes, mark solved | `/doubt/[id]` | `GET /doubts/:id`, `POST .../replies`, `.../vote`, `.../solved` | done (the website has no attachments) |
| Ask a doubt | `/doubts/ask` | `POST /doubts` | done |
| `/wall` class wall (posts, replies, reactions, report, without names) | `/wall`, opened from Doubts when `DoubtList.wall` is true (same rule as the website: not admins, not lectures-only, not switched off) | `GET /wall`, `POST /wall/posts`, `/wall/posts/:postId/replies`, `/wall/reactions`, `/wall/reports` (shared `src/lib/wall/data.ts`) | server added, built now |
| `/notifications` | `/notifications` | `GET /notifications`, `POST /notifications/read-all` | done |
| `/notifications/[id]` | `/notification/[id]` | `GET /notifications/:id` | done |
| `/settings` | `/settings` | `GET /settings`, `PATCH /me`, `PUT /devices/current`, `PUT /notifications/preferences` | done |
| Delete my account request | Settings | `POST /me/deletion-request` | done |
| Search (header) | `/search` | the lists above, searched on the phone | done; notes and Quick reference added now |

## Lecture-only accounts

Tabs Home, Lectures, Doubts, Me. Study, notes, Quick reference, journey's
practice numbers and Practise are closed for them on the server (403 `scope`),
and the app hides those rows. Lectures, materials, assignments, doubts,
notifications, certificates and settings are the same as for students.

## Every answer is read through an adapter

`src/api/adapt-learn.ts` turns each answer in this area into the shape the
screens read, with every list an array and every missing field filled, so a
`null` or a field the server has not sent yet never throws while drawing.
