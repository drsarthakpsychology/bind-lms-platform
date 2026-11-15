# What the app needs that is not in the contract yet

For the server side (branch `agent/appapi`). The app already has screens for
these; they run on the app's mock server today. The exact shapes are in
`apps/mobile/src/api/extra.ts` (copy them into `contract.ts` as they are, or
change them there and the app follows). Until a route exists on the server,
the app shows "Coming in the next update" on that screen, never an error.

Last updated: 2026-11-15.

## Small additions to built routes

| Where | What | Why |
|---|---|---|
| `GET /home` | optional `quests: QuestCard \| null` (today's three quests, `xpEach`, `xpBonus`, `spareBonus`, each quest with a `target`) | The Today line opens the quests in a sheet, as on the website's v2 Home |
| `GET /config` | optional `cohortLine: string \| null` ("Cohort Two · by invitation · starts December 2026") | The Welcome screen says it; today it is a constant in `apps/mobile/src/lib/brand.ts` |
| `POST /me/deletion-request` (new) | `DeletionRequestBody` → `DeletionRequestResult` | Settings has "Ask to delete my account" (Google Play requires a way to ask from inside the app). A person checks it; nothing is deleted automatically |

## Practise (phase 4)

| Method and path | Answer | Screen |
|---|---|---|
| `GET /practise` | `PractiseHubData` (cases, games, prep as rows with an `AppTarget`) | Practise tab |
| `GET /games/:id` | `GameRound` (`kind` + `v`, the whole round as data) | Game screen. Two kinds so far: `quickfire` (timed MCQs) and `match` (pairs) |
| `POST /games/:id/result` | `GameResultBody` → `GameResult` (best and points; the server checks the score) | Game over |
| `GET /cases/:id` | `CaseStudy` (presenting text, steps of choices with verdict and why, take-away) | Case screen |
| `GET /prep` | `{ subjects: PrepSubject[] }` | Exam Prep |
| `GET /prep/:subject` | `PrepSet` (MCQs with answers, like the website's question bank) | Exam Prep set |

## Library (phase 4)

| Method and path | Answer | Screen |
|---|---|---|
| `GET /medicines?q=&class=` | `MedicineList` (every medicine: name, class, key dose, brands; and the class list) | Library tab |
| `GET /medicines/:id` | `MedicinePage` (summary and sections of points, content unchanged from the website) | Medicine page |

## Admin (phase 5)

| Method and path | Answer | Screen |
|---|---|---|
| `GET /admin/home` | `AdminHomeData` (needs a look first, today's numbers) | Admin Home |
| `GET /admin/students?q=` | `AdminStudentList` | Students |
| `GET /admin/students/:id` | `AdminStudent` (progress, contact, phone changes, recent activity) | Student page |
| `GET /admin/activity` | `AdminActivity` | Activity |
| `GET /admin/messages` | `AdminMessages` | Messages |
| `POST /admin/messages` | `AdminSendBody` → `AdminSendResult` (writes the bell notification and sends the push) | New message |

`POST /admin/devices/allow-change` (already in the contract) is used by the student page.

## Study widgets

All 39 widget kinds are drawn natively (`apps/mobile/src/study/widgets/index.tsx`). No server change is needed. An unknown kind or a newer `v` still falls back to an "Open on the website" row.
