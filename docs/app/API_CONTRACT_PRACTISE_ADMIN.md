# VIBHA app API contract (v1): Practise, Library and Admin

Part two of the contract. Part one (`docs/app/API_CONTRACT.md`) has the basics that hold here too: base address, headers, the answer shape `{ ok, data }` and the error codes, paging (`?limit=&cursor=`, `Page<T>`), `AppTarget` links, and the security rules. The types for this part are in `src/lib/app-api/contract-practise-admin.ts` (a plain types file that imports only from `contract.ts`; the app copies it next to `contract.ts`). If this page and that file disagree, the file wins.

Status words: **built** (the route exists and has tests) or **planned** (agreed shape, not written yet).

Last updated: 2026-11-16 (admin round two: cohorts, certificate settings and types, no-account certificates, system and support keys, a student's messages, sign-offs, admin push, a person's record).

## 1. Rules for this part

- Every route runs through `appRoute` (`src/lib/app-api/route.ts`): the bearer guard, the one-phone rule, lectures-only scope, sections switched off per student, and feature flags, decided by the website's own `decideApiAccess`.
- No logic is copied. Each route calls the website's own function. Where a website page or Server Action mixed its logic with page code, the logic was moved to `src/lib` and the page now calls it too (listed under "Moved out" in each section). The website behaves exactly as before.
- Scores are never taken from the app. Games, Exam Prep questions and Judgment calls are graded on the server, with the website's signed run tokens, server-held answer keys and XP caps. The few self-check records (OSCE checklist, MSE and formulation compare) are stored exactly as the website stores them and never pay XP.
- Writes are rate limited per person. Lists page with `?limit=&cursor=`.
- Structured JSON only, never HTML.

## 2. Library

Gate: Medicines (`/practice/medicines`), and the reference (`/tools/psychopharm`); both close for lectures-only accounts and when Medicines is switched off for the student.

| Status | Method and path | Request | Response | Calls |
|---|---|---|---|---|
| built | `GET /library/medicines` | `?q=&group=` (`class` also accepted) | `MedicineList` | `medIndex`, `GROUPS`, `searchMeds` (`src/lib/meds`) |
| built | `GET /library/medicines/:medId` | none | `MedicinePage` | `medicinePage` (`src/lib/app-api/library.ts`): `medById`, `shownSections`, `splitTell`, `SECTION_NAMES`, `mechanismOf`, `medVisuals`, `halfLifeOf`, `medicineDiagrams`, `medicineStudyLink` |
| built | `GET /library/reference` | none | `ReferenceHome` | `drugList`, `mechanismIndex` (`src/lib/psychopharm/store.ts`) |
| built | `GET /library/reference/search` | `?q=` (120 a minute) | `ReferenceSearch` | `searchDrugs` |
| built | `GET /library/reference/:slug` | none | `ReferenceDrug` | `drugDetail`, `getPublishedMedicationDocument` |
| built | `GET /library/reference/compare` | `?drugs=a,b[,c,d,e]` | `ReferenceCompare` | `compareDrugs`, `COMPARE_FIELDS` |

The medicine page:

- `sections` is in the website's order and only has the sections the website shows for that medicine: Used for, Doses, Side effects, What to check, Interactions (when any), Serious: act the same day, Special groups, Switching and stopping (when any), How it works (always last, when there is anything to show). Every section has `points` (plain lines); the typed parts carry the rest (dose chips with the student and clinician words, the special-group facts, the targets table).
- `How it works` has `diagrams`: the exact list of hand-drawn pictures the website draws, in order, with everything each picture needs (`MedDiagram`: receptor, journey through the body, synapse, half-life or dose curve, dopamine pathways, compare, neuron, nervous system, brain map, a night of sleep). The website now draws from the same plan (`src/lib/meds/diagrams.ts`), so the two cannot drift. Interactive parts (the buttons under each picture) are the app's to rebuild natively, as on the website's sketches in `src/components/meds/sketch`.
- `summary.student` and `summary.clinician` are the two reading views. `raw` carries the website's own objects for anything else.

The reference:

- The reviewed document is sent when one is published; the website shows it instead of the curated view. Hidden blocks are left out. Sources, page numbers and review fields are never sent (students never see citations; the website shows them only in the editor).
- `notice` is the standing line the website shows under every reference page.

Moved out (website unchanged): the medicine page's section list and names (`shownSections`, `SECTION_NAMES`, `DOSE_NOTE`, `washoutLine` in `src/lib/meds/sections.ts`), the "How it works" picture plan (`src/lib/meds/diagrams.ts`, drawn by `MedicineSketches`), the compare page's fields (`src/lib/psychopharm/compare-fields.ts`).

Changes from the app's mock (`apps/mobile/src/api/extra.ts`): the paths are `/library/medicines` (not `/medicines`); the list's array is `rows` (not `items`); each row also has the mock's names (`className`, `keyDose`) and the list has `classes`. The page is the mock's `MedicineRow & { summary, sections }` with `summary` as `{ student, clinician }` (the website's two views) instead of one string; every section still has `points`.

Kept from the first version (commit 4016d0ae): the list's `rows` and every field of the first medicine page (`med`, `related`, `mechanism`, `visuals`, `halfLife`, `study`) are still sent, so nothing that read them breaks.

## 2b. Library: Quick reference and case library

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `GET /library/terms` | student, gate `/study/reference` with flag `learn` | `?q=` | `{ v, items: RefIndexItem[] }` | `referenceIndex` (`src/lib/reference/data.ts`), the Quick reference index (disorders, medicines, terms) |
| built | `GET /library/terms/:slug` | same | none | `{ v, entry }` | `referenceBySlug` |
| built | `GET /library/cases` | student, gate `/practice/library` with flag `case_library` (off on the website today) | `?q&tag&limit&cursor` | `{ v, filters, items, nextCursor, total }` | `getLibraryDocs`, `filterLibrary`, `filterLibraryByTag`, `LIBRARY_FILTERS` |
| built | `GET /library/cases/:id` | same | none | one case (title, source, licence, text) | `getLibraryDocs` |

## 3. Practise

Every Practise route checks the gate of the website page it stands for before anything runs: lectures-only accounts get 403 `scope` everywhere here; a student with Games or Practice (or one tool) switched off gets `access_block`; a flag that is `live` answers `feature_locked`, `off` answers `feature_off`. The website function then runs its own checks too.

### 3.1 Routes

| Status | Method and path | Request | Response | Calls |
|---|---|---|---|---|
| built | `GET /practise` | none | `PractiseHubData` | `practiseHub` (`src/lib/app-api/practise.ts`): `MAIN_TOOLS`, `THINK_TOOLS`, `MORE_TOOLS`, `shownTools`, `SOLO`, `WITH_OTHERS`, `computePracticeStates`, `lastPracticePlace`, `hubNewCases`, `BOARDS` |
| built | `GET /practise/tools/:tool` | none (120 a minute) | `PractiseTool` | the tool's loader in `TOOLS` (`src/lib/app-api/practise.ts`), below |
| built | `POST /play/:game/:action` | `PlayBody` | `PlayResult` | part one, section 2.11 (the website's server actions). Added here: ward and escape team modes, comorbid, league (below) |
| built | `POST /practise/records/:kind` | the website route's JSON (128 KB) | that route's JSON | `forwardJson` (`src/lib/app-api/forward.ts`) into the website's own route (120 a minute, then the route's own limit) |
| built | `POST /practise/duel` | `{ op, ...}` (the website's duel ops) | the website's duel answer (`{ kind: "queued" | "match" | "left", view }`) | the website's `/games/duel/live` route |
| built | `GET /leaderboards/:board` | `league`, `quiz`, `overall` | `Leaderboard` | `loadMyLeague`, `loadQuizBoard`, `loadMyBoard`, `loadMyCohorts`, `scopeLine` (`src/lib/app-api/boards.ts`) |
| built | `GET /leaderboards/games/:game` | `rx`, `mse`, `comorbid` | `Leaderboard` | `loadAccuracyBoard` |
| built | `GET /prep` | none | `PrepHome` | `loadHome` (`src/lib/prep/path.ts`), `longCount` |
| built | `GET /prep/subjects/:subject` | none | `PrepSubjectDetail` | `loadSubject`, `longTopicsFor` |
| built | `GET /prep/subjects/:subject/topics/:topic` | `?set=N` (from 1) | `PrepSet` | `loadTopicSet`, `toView` (no answers), `bankTopics`, `learnHrefForTopic` |
| built | `GET /prep/smart` | none | `PrepSet` | `loadSmart` |
| built | `GET /prep/lists/:list` | `saved` or `wrong`, `?page=N` | `PrepSet` with `page` | `loadList` |
| built | `GET /prep/mock` | none | `PrepMocks` | `PRACTICE_SPECS` (and `EXAM_SPECS` only when exam tracks are on, as the website), `loadMockHistory`; sources left out |
| built | `GET /prep/mock/result/:id` | none | `PrepMockResult` | `loadAttempt`, `standingFor` (`src/lib/prep/server.ts`), `resultView` (`src/lib/prep/results.ts`), as the website's `/prep/mock/result/:id`: own attempts only, the rank worked out again on each visit; `result` is null when the paper was never handed in (`src/lib/app-api/prep-mock.ts`) |
| built | `GET /prep/long`, `/prep/long/:subject`, `/prep/long/:subject/:topic`, `/prep/long/:subject/:topic/:id` | none | `PrepLong` | `longSubjects`, `longTopicsFor`, `longTopic` (`src/lib/prep/long-server.ts`) |
| built | `GET /leaderboards/shop` | none (gate `/leaderboard/shop`) | `XpShop` | `loadShop` (`src/lib/leagues/shop-data.ts`, moved out of the shop page, which calls it too), `SHOP`, `SHOP_READY`, `LOOKS`, `parseLook`. Buying and wearing: `POST /play/league/buy`, `/play/league/wear` |
| planned | Exam Prep mock interview | | | needs voice and the AI feedback; `revealInterview`, `interviewFeedback`, `saveInterviewSession` can be added to `PLAY` as `prep.*` when the app has a voice screen |
| planned | AI patient interview (Consulting Room), Practise with a classmate | | | voice, AI and live peers; shown as `play: "web"` |

Gates of the routes without a tool gate: `/practise` uses `/practise` (lectures-only closed); Exam Prep uses `/prep` with flag `learn`; boards use `/leaderboard` (league), `/games/leaderboard` with `learn` (quiz), `/leaderboard/overall` (overall), `/games/<game>` with `learn` (game boards); the duel uses `/games/duel` with `learn`.

### 3.2 Tools: first screen, moves and records

`GET /practise/tools/:tool` answers `PractiseTool`: `data` is the plain data the website page gives its game (the same objects), `cases` the case library with marks when the tool has one, `moves` the `POST /play` kinds the tool uses, `records` the `POST /practise/records` kinds. `study.state` means points go through `PUT /study/state` (clamped and merged on the server); `save.answers` means answer history goes through `POST /save` kind `answers` (part one).

| `tool` | Gate | `data` | `cases` | Moves and records |
|---|---|---|---|---|
| `blitz` | `/games/blitz`, `learn` | `{ bests }` (`loadBests`) | none | `blitz.start`, `blitz.answer`, `blitz.finish` |
| `sort` | `/games/sort`, `learn` | `{ initial }` (`loadSort` daily, basic) | none | `sort.load`, `sort.check` |
| `rx` | `/games/rx`, `learn` | `{ modes, board }` (`RX_MODES`, `loadAccuracyBoard`) | none | `rx.deal`, `rx.pick`, `rx.finish` |
| `mse-lab` | `/games/mse`, `learn` | `{ levels, board }` | none | `mse.deal`, `mse.tag` |
| `ward` | `/games/ward`, `learn` | `{ campaigns, teamsOn, teams }` (`campaignCards`, `teamsReady`, `myTeams`) | campaigns | `ward.start`, `ward.resume`, `ward.pick`, `ward.createTeam`, `ward.joinTeam`, `ward.teamView`, `ward.vote`, `cases.mark` |
| `escape` | `/games/escape`, `learn` | `{ rooms, teamsOn, teams }` (`roomCards`) | rooms | `escape.start`, `escape.resume`, `escape.answer`, `escape.createTeam`, `escape.joinTeam`, `escape.view`, `escape.startTeam`, `escape.answerTeam`, `cases.mark` |
| `duel` | `/games/duel`, `learn` | `{ profile, offlineItems }` (`profile`, `offlineRounds` when duels are not set up) | none | `POST /practise/duel` |
| `comorbid` | `/games/comorbid`, `learn` | `{ rules, board }` | none | `comorbid.state`, `comorbid.finish` |
| `daily` | `/practice/daily`, `learn` | `{ initial }` (`dailyMove` daily) | none | `daily.rest`, `daily.move`, `daily.next` |
| `detective` | `/practice/detective`, `learn` | `{ families, progress }` | marks come with each deal | `detective.deal`, `detective.clue`, `detective.clues`, `detective.guess`, `cases.mark` |
| `two-minute` | `/practice/two-minute-clinic`, `two_minute_clinic` | `{ start, clinics }` (`randomClinicStart`, `CLINICS`) | clinics (shuffled as the website) | `cases.mark`, `study.state`, `save.answers`; record `clinic` |
| `wwyd` | `/practice/scenarios`, `learn` | `{ scenarios, words }` | scenarios | `cases.mark`, `study.state`, `save.answers` |
| `terms` | `/practice/terms`, `learn` | `{ terms, sayIt }` (`ALL_TERMS`, `SAY_IT`) | none | `study.state`, `save.answers` |
| `judgment` | `/practice/judgment`, `judgment` | `{ items }` (the five seed items the website shows) | none | records `judgment` (scored on the server), `competency` |
| `ethics` | `/practice/ethics`, `ethics` | `{ dilemmas, quiz }` (`todaysDilemmas`, `ETHICS_QUIZ`) | none | record `quiz` |
| `out-of-depth` | `/practice/out-of-depth`, `ethics` | `{ scenarios }` | none | none |
| `landmark` | `/practice/landmark`, `landmark` | `{ cases }` (`LANDMARK_CASES`) | cases | `cases.mark`, `save.answers` |
| `osce` | `/practice/osce`, `osce` | `{ stations, quiz }` | stations | `cases.mark`, `save.answers`; records `osce`, `competency`, `quiz` |
| `mse` | `/practice/mse`, `mse` | `{ content, smallThings }` (`loadMseLadderContent`: every level's stimuli in fresh-case order; `SMALL_THINGS`, the small things walk) | inside `content` | `cases.mark`, `save.answers`; record `mse` |
| `formulation` | `/practice/formulation`, `formulation` | `{ cases }` (`loadFormulationCases`) | cases | `cases.mark`, `save.answers`; record `formulation` |
| `weak-spots` | `/practice/weak-spots`, `weak_spots` | `{ spots, drill, sessions }` (`loadWeakSpots`) | none | `save.answers` |

New `POST /play` kinds (part one's table has the rest):

| `kind` | `args` | `data` |
|---|---|---|
| `ward.createTeam` | `campaign` | `{ ok, teamId }` or `{ ok: false, reason }` |
| `ward.joinTeam` | `code` | the website's join answer |
| `ward.teamView` | `teamId` | `WardTeamView` (poll it) |
| `ward.vote` | `{ teamId, step, choice }` | `WardTeamView` |
| `escape.createTeam` | `room` | `{ ok, teamId }` |
| `escape.joinTeam` | `code` | the website's join answer |
| `escape.view` | `teamId` | `EscapeView` (poll it) |
| `escape.startTeam` | `teamId` | `EscapeView` |
| `escape.answerTeam` | `{ teamId, stage, answer }` | `{ view, ok }` |
| `comorbid.state` | `{ seed, mode, level, prefer?, moves }` | `{ ok, game }`: the game after those moves, replayed on the server by the shared rules (writes nothing) |
| `comorbid.finish` | the same, finished | `{ ok, xp }`: the website's `finishComorbid` replays and grades every move; the app never sends a score |
| `league.alias` | `name` | `{ error, alias }` |
| `league.buy` | `item` | the website's buy answer |
| `league.wear` | `kind, id` | `{ error, look }` |

Record kinds and the website route each one runs: `judgment` `/api/practice/sct/attempt` (scored on the server from its own copy of the item), `osce` `/api/practice/osce/attempt`, `mse` `/api/practice/mse/attempt`, `formulation` `/api/practice/formulation/attempt`, `clinic` `/api/practice/clinic/complete` (streak), `quiz` `/api/practice/quiz/attempt`, `competency` `/api/practice/competency`. The OSCE, MSE and formulation scores are the student's own self-check as on the website: stored for their history, never paying XP.

Moved out (website unchanged): the MSE trainer's content (`src/lib/practice/mse-content.ts`), the formulation case list (`src/lib/practice/formulation-load.ts`), weak spots (`src/lib/practice/weak-spots-load.ts`), the ethics quick check (`src/lib/practice/ethics-quiz.ts`), Rx Detective's modes (`RX_MODES` in `src/lib/games-sims/rx/rules.ts`).

Answers stay on the server exactly as on the website: the server-dealt games (Blitz, Sort, Rx, MSE Lab, Ward, Escape, Daily, Clinic detective, Exam Prep, Comorbid's grading, the duel) never send an answer before it is given. The tools whose whole case is in the browser on the website (What would you do, Say it clinically, Two-minute clinic, Landmark, OSCE, Ethics, Judgment items) send the same data to the app; their points still go through the server's clamp.

Leaderboards: every board is the student's own cohort only, first name and initial, as on the website. Other students' account ids are never sent.

Changes from the app's mock: the hub's arrays are the mock's `cases`, `games` and `prep`, with `boards`, `newCases` and `resume` added, and each row has `locked` and `play`. The mock's `GET /games/:id` with a whole quickfire round and `POST /games/:id/result { score }` are not built: they would trust a score from the phone. Games are played through their server-dealt moves instead (`POST /play`). The mock's `GET /cases/:id` (a case with every verdict inside) is the case-library tools above (the Daily case is server-dealt through `daily.*`). The mock's `PrepSet` with answers inside is `PrepSet` without answers, graded by `POST /play/prep/check`.

## 4. Admin

Auth: **admin** means `admin` or `view_admin` (read); **super admin** means `admin` only (every write), the same split as the website (`requireAdmin`, `requireSuperAdmin`). A student gets 403 `forbidden` on every route here; a view admin gets 403 `forbidden` on every write and nothing is written. The website actions these routes call also check the super admin themselves. Test and robot accounts are left out of every list, as on the website. Read answers carry `canWrite` where the screen has write buttons.

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `GET /admin/home` | admin | none | `AdminHomeData` | `adminHome` (`src/lib/app-api/admin.ts`): `loadAdminOverview` (moved out of the admin Home page), `loadLive`, `loadHiddenIds` |
| built | `GET /admin/students` | admin | `?search=` (or `q=`) `&cohort&flag&limit&cursor` (default 50, max 200) | `AdminStudentList` | `loadRoster` rows, `filterStudents` |
| built | `GET /admin/students/:id` | admin | none | `AdminStudent` | the roster row, `loadStudentDetail`, `studentDeviceState` (the app phone and changes used) |
| built | `POST /admin/students/:id/lock` | super admin, 60 a minute | `LockBody` | `LockResult` | `setAccountStatus(id, "blocked", reason)` |
| built | `POST /admin/students/:id/unlock` | super admin, 60 a minute | none | `LockResult` | `setAccountStatus(id, "active")` |
| built | `POST /admin/students/:id/login-link` | super admin, 20 a minute | none | `LoginLinkResult` | `sendLoginLink` (`admin/cohorts/actions.ts`), the website's "Email login link" |
| built | `POST /admin/devices/allow-change` | super admin | `AllowDeviceChangeBody` | `AllowDeviceChangeResult` | `allowDeviceChange` (part one, section 2.2): one more phone change for that student |
| built | `GET /admin/activity` | admin | `?view=live|behind|cohorts|all` (default `all`) | `AdminActivity` | `loadRoster`, `loadLive`, `isBehind`, and `loadActivity` for `all` |
| built | `GET /admin/messages` | admin | none | `AdminMessages` | `loadNotifyBatches`, `loadRecipientData` (the compose tab's recipients) |
| built | `POST /admin/messages` | super admin, 10 a minute | `AdminSendBody` | `AdminSendResult` | recipients from `loadRecipientData` (one student, picked students, a cohort, a course, everyone), then `sendNotificationAction` (bell, phone push, optional email) |
| built | `GET /admin/inbox` | admin | none | `AdminInbox` | `loadInbox` (`admin/inbox/data.ts`) |
| built | `POST /admin/inbox/emails/:id/reply` | super admin, 30 a minute | `AdminReplyBody` | `AdminReplyResult` | `replyEmailFromInbox` |
| built | `POST /admin/inbox/emails/:id/read` | super admin | none | `{ read: true }` | `markRead` |
| built | `GET /admin/doubts` | admin | `?cohort&kind&limit&cursor` | `DoubtList` (part one) | `loadDoubts` as admin |
| built | `POST /admin/doubts/:id/reply` | super admin (the reply action's own limit) | `AdminReplyBody` | `AdminReplyResult` | `replyFromInbox`: `replyToDoubt`, then the student's notice |
| built | `POST /admin/doubts/:id/draft` | super admin, 30 a minute | none | `AdminDraftResult` | `draftDoubtAnswer` (AI draft for the reply box; never posted) |
| built | `POST /admin/doubts/:id/hide` | super admin | `HideBody` | `{ hidden }` | `adminHideDoubt` |
| built | `GET /admin/submissions` | admin | `?status=pending|graded&course&assignment&limit&cursor` | `AdminSubmissions` | `loadSubmissionReview` (`src/lib/admin/submissions-review.ts`, moved out of the Submissions page) |
| built | `POST /admin/submissions/:id/approve` | super admin, 120 a minute | none | `ReviewResult` | `approveSubmission` |
| built | `POST /admin/submissions/:id/grade` | super admin, 120 a minute | `GradeBody` | `ReviewResult` | `returnFeedback` |
| built | `GET /admin/submissions/:id/files/:fileId` | admin, 120 a minute | none | `AdminFileLink` | `getSubmissionFileUrl` with the path looked up on the server |
| built | `GET /admin/submissions/:id/audio` | admin, 120 a minute | none | `AdminFileLink` | `getSubmissionAudioUrl` with the path looked up on the server |
| built | `GET /admin/certificates/studio` | admin | none | `StudioSetup` | `loadStudioSetup` (`src/lib/certificates/studio-data.ts`), `KIND_DEFAULTS` |
| built | `POST /admin/certificates/preview` | admin, 120 a minute | `StudioIssueBody & { showing? }` | `StudioPreview` | `previewDoc`, `studioProblems` (`src/lib/certificates/preview.ts`), `layoutCertificate` (the website's own certificate layout) |
| built | `POST /admin/certificates/issue` | super admin, 10 a minute | `StudioIssueBody` | `StudioIssueResult` | `issueStudioCertificates` (the studio's action; `replaces` makes it a correction) |
| built | `POST /admin/certificates/:id/revoke` | super admin, 30 a minute | `RevokeBody` | `{ revoked: true }` | `revokeStudioCertificate` |
| built | `POST /admin/certificates/:id/resend` | super admin, 30 a minute | `ResendBody` | `ResendResult` | `resendStudioCertificate` |
| built | `GET /admin/certificates/issued` | admin | `?q=` (or `search=`) `&type=` (or `kind=`) `&status&cohort&student&limit&cursor` (default 50, max 200) | `IssuedCertificates` | Certificates, Issued: every certificate and badge in one list. `loadIssued` (`src/lib/certificates/issued-load.ts`, moved out of the Issued page, which calls it too), `filterIssued`, `countByType`, `issuedStatusLine` (`src/lib/certificates/issued.ts`) |
| built | `POST /admin/certificates/:id/issue-draft` | super admin, 30 a minute | none | `IssueDraftResult` | `issueCertificate` (`admin/achievements/actions.ts`): a course certificate draft, its rule checked again |
| built | `GET /admin/certificates/:id/pdf` | admin, 120 a minute | none | `AdminFileLink` | `getCredentialDownload` (15 minute address) |
| built | `POST /admin/certificates/send-waiting` | super admin, 5 a minute | none | `SendWaitingResult` | `sendWaitingCertificateEmails` (`drainEmailQueue`) |
| built | `GET /admin/badges` | admin | none | `AdminBadges` | `listAchievements` (badges only) |
| built | `POST /admin/badges/:id/award` | super admin, 20 a minute | `AwardBadgeBody` (1 to 300 ids) | `AwardBadgeResult` | `awardBadge` (`awardBadgeManually`; already-holders skipped) |
| built | `POST /admin/badges/award-all` | super admin, 2 a minute | none | `AwardAllResult` | `awardAllBadges` |
| built | `GET /admin/forms` | admin | none | `AdminForms` | `loadForms` |
| built | `GET /admin/forms/:id` | admin | `?q&emailed=yes|no&limit&cursor` (default 50, max 500) | `AdminFormAnswers` | `loadForm`, `loadSubmissions`, `answerColumns`, `identityKeys`, `loadFormEmailed`, `emailAllowance`, `MERGE_FIELDS`, `PERSONAL_LIMITS` |
| built | `POST /admin/forms/:id/email` | super admin, 10 a minute | `FormEmailBody` | `PersonalEmailReport` | `emailFormRespondents` (`admin/forms/email-actions.ts`): addresses come from the saved answers on the server, duplicates once, the rest of today's allowance waits |
| built | `POST /admin/forms/:id/email/preview` | admin, 120 a minute | `FormEmailPreviewBody` | `EmailPreview` | `composeFor`, `unknownFields` (sends nothing) |
| built | `POST /admin/forms/:id/email/send-waiting` | super admin, 5 a minute | none | `FormSendWaitingResult` | `sendWaitingFormEmails` |
| built | `GET /admin/people` | admin | `?view=all|not_paid|invited|not_converted|quiet|joined&quiet=7|14|30&q&stage&cohort&source&from&to&last=week|month|older|never&enquiries=1&limit&cursor` (default 50, max 500) | `AdminPeople` | People, Pipeline (and Enquiries with `enquiries=1`): `loadPipeline` (`src/lib/crm/people.ts`), `filterPipeline`, `viewCounts`, `sourcesOf`, `waLink` (`src/lib/crm/views.ts`), `emailAllowance` |
| built | `POST /admin/people/:key/paid` | super admin, 120 a minute | `MarkPaidBody` | `MarkPaidResult` | `markPaid`. Before `2026_11_15_people_payment.sql` is pasted: 503 `unavailable` with `details.missingStep: true`, nothing written |
| built | `POST /admin/people/:key/invite` | super admin, 20 a minute | `InviteBody` | `InviteResult` | `sendInvite` (makes the account first for an enquiry) |
| built | `POST /admin/people/:key/stage` | super admin, 120 a minute | `StageBody` | `PersonSaved` | `setStage` |
| built | `POST /admin/people/:key/activity` | super admin, 120 a minute | `ActivityBody` | `PersonSaved` | `logActivity` |
| built | `POST /admin/people/:key/follow-up` | super admin, 120 a minute | `FollowUpBody` | `PersonSaved` | `setFollowUp` |
| built | `POST /admin/people/email` | super admin, 10 a minute | `PeopleEmailBody` | `PersonalEmailReport` | `emailPeople` (only people in the pipeline) |
| built | `POST /admin/people/email/send-waiting` | super admin, 5 a minute | none | `PeopleSendWaitingResult` | `sendWaitingPeopleEmails` |
| built | `POST /admin/people/whatsapp` | super admin, 30 a minute | `PeopleWhatsAppBody` | `PeopleWhatsAppResult` | `waMessage`, `waLink`, `logWhatsApp` (the app opens each link; the contact is logged) |
| built | `GET /admin/cohorts` | admin | none | `AdminCohorts` | `loadCohortSummaries`, `loadRoster`, `cohortFigures` (`src/lib/cohorts/figures.ts`, moved out of the cohort page) |
| built | `GET /admin/cohorts/:id` | admin | none | `AdminCohortDetail` | `loadCohort`, `loadRoster`, `cohortFigures`; `messages` are the bell batches that reached its members |
| built | `GET /admin/certificates/settings` | admin | none | `CertificateSettings` | `loadCertificateSettings` (`src/lib/certificates/settings-load.ts`, moved out of the Settings page, which calls it too) |
| built | `PUT /admin/certificates/settings` | super admin, 30 a minute | `CertificateSettingsBody` | `CertificateSettings` | `saveDefaultSignatories` |
| built | `POST /admin/certificates/signatures` | super admin, 10 a minute | `SignatureUploadBody` (PNG or JPEG data URL, 2 MB) | `CertificateSettings` | `uploadSignatureImage` |
| built | `POST /admin/certificates/anyone/preview` | super admin, 60 a minute | `AnyoneCertificateBody` | `AnyonePreview` (the PDF as base64; nothing saved or sent) | `previewCertificateToAnyone` |
| built | `POST /admin/certificates/anyone` | super admin, 10 a minute | `AnyoneCertificateBody` | `AnyoneIssueResult` | `issueCertificateToAnyone` (no account, no login; linked to a student when the email is one) |
| built | `GET /admin/certificates/types` | admin | none | `AdminCertTypes` | `listAchievements`, `moduleFacets`, `ruleText`, `isMadeForYou` (`src/lib/achievements/type-words.ts`, moved out of the Types screen) |
| built | `POST /admin/certificates/types`, `PUT /admin/certificates/types/:id` | super admin, 30 a minute | `CertTypeBody` | `{ id }` | `saveAchievement` |
| built | `POST /admin/certificates/types/:id/enabled` | super admin, 60 a minute | `CertTypeEnabledBody` | `{ enabled }` | `setAchievementEnabled` |
| built | `GET /admin/certificates/types/:id/eligible` | super admin, 6 a minute | none | `CertEligible` | `listCertificateEligible` |
| built | `POST /admin/certificates/types/:id/drafts` | super admin, 10 a minute | `CertDraftsBody` (1 to 100) | `CertDraftsResult` | `createCertificateDraft` for each |
| built | `POST /admin/certificates/types/:id/signature` | super admin, 10 a minute | `SignatureUploadBody` | `{ saved: true }` | `saveSignatureAsset` |
| built | `GET /admin/system` | admin | none | `AdminSystem` | `loadSupportState` (`src/lib/auth/support-state.ts`, moved out of the Support keys page: views only, never a key, salt or hash), `infra_metrics` with `src/lib/infra/limits.ts` |
| built | `POST /admin/system/support-keys` | super admin, 10 a minute (strict) | `{ label }` | `NewSupportKey` (shown once) | `createSupportKey` |
| built | `POST /admin/system/support-keys/:id/rotate` | super admin, 10 a minute (strict) | none | `NewSupportKey` | `rotateSupportKey` |
| built | `POST /admin/system/support-keys/:id/revoke` | super admin, 10 a minute (strict) | none | `{ revoked: true }` | `revokeSupportKey` |
| built | `POST /admin/system/legacy-key/revoke` | super admin, 10 a minute (strict) | none | `{ revoked: true }` | `revokeLegacyKey` |
| built | `GET /admin/students/:id/messages` | admin | none | `StudentMessages` | `loadStudentMessages` (`src/lib/people/student-messages.ts`, moved out of the student page's Messages tab) |
| built | `GET /admin/doubts?student=:id` | admin | | `DoubtList` | `loadDoubts` with `authorFilter` |
| built | `GET /admin/review/signoffs` | admin | none | `SignOffList` | `loadSignOffRequests` (`src/lib/admin/signoffs.ts`, moved out of the Sign-offs page) |
| built | `POST /admin/review/signoffs/:id` | super admin, 120 a minute | `SignOffBody` | `SignOffResult` (409 `conflict` when it is no longer waiting) | `decideSignOff` (also used by `/api/admin/supervision-signoff`) |
| built | `GET /admin/push-preferences`, `PUT` | admin (each admin's own, view admins too), 60 a minute | `Partial<AdminPushPrefs>` | `AdminPushPrefs` | `src/lib/app-api/admin-push.ts` (`admin_settings`, key `admin_push_prefs:<id>`) |
| built | `GET /admin/people/:key` | admin | none | `AdminPersonDetail` | `loadPipeline`, `loadTimeline`, `personFacts` (`src/lib/crm/person-facts.ts`, moved out of the person page) |

Notes:

- Admin Home is the website's Home: `todo` is its list of things to do (concerns, logins, emails, follow-ups, failed emails, grading, flagged practice sessions, quiet students, new students) with the same counts and words; `cohorts` its cohort cards; `live` who is on VIBHA now, with where they are. `needsLook` are the students the Students table flags (as table rows), `attention` the same students as the app's mock rows with the reason in words.
- A submission's files and recording are fetched by id. The app never sends a storage path.
- The certificate preview is the website's own layout, as drawing operations (`rect`, `line`, `path`, `stroke`, `image`, `text` in a `width` by `height` box) for react-native-svg. `problems` lists what still stops it being issued, in the studio's words.
- `loadStudioSetup` and `src/lib/certificates/preview.ts` are the same reads and the same preview as the website's studio page and screen. The website files were left as they are because the certificates rework (branch `agent/admincert`) is changing them now; that branch should switch the studio page to `loadStudioSetup` and the studio screen to `previewDoc`, `previewImages` and `studioProblems` so there is one copy.

Moved out (website unchanged): admin Home's numbers (`loadAdminOverview`, `src/lib/admin/overview.ts`), the Submissions review list (`loadSubmissionReview`, `src/lib/admin/submissions-review.ts`), the Issued list's read (`loadIssued`, `src/lib/certificates/issued-load.ts`).

Round two notes:

- `AdminSubmission` has `studentName` (full name, the email's first part when none is saved). `StudioSetup` has `signatories` (the saved defaults).
- Admin phone notices: `PushData` carries `admin` (`new_doubt`, `new_enquiry`, `falling_behind`) and `id` (the doubt id, the person key, the student id). A new doubt or concern pushes to each admin whose `newDoubt` is on (the bell row is written for every admin as before). A new enquiry pushes (no bell row, as on the website) to admins and view admins whose `newEnquiry` is on. `falling_behind` has its setting only: nothing sends it yet.
- No-account certificates use the website's older PDF template, so their preview is the PDF itself; the studio's preview is the drawing.

Certificates, Issued and Forms notes:

- One list for certificates and badges. Revoke (`POST /admin/certificates/:id/revoke`) works for both; resend and the PDF are certificates only (`hasPdf`). `canCorrect` rows are corrected with `POST /admin/certificates/issue` and `replaces`; `isDraft` rows are issued with `issue-draft`.
- `counts` are taken before the type filter, so the chips keep their numbers when one is chosen.
- People are named in addresses by `key` (the email, base64url, as the website's person pages), never by the email. The list gives each person's `key`.
- Form emails: merge fields `{first_name}`, `{name}`, `{email}`, `{form}`. The report names people, never addresses. Over today's allowance, emails wait (status pending) and go out from send-waiting. Email not set up answers 503 `unavailable`.

Kept from the first version (commit 9fea713d): `AdminHome.counts`, `needsLook` rows and `live`; `AdminStudentProfile.row` and `detail` (now also flat on `AdminStudent`); `GET /admin/activity`'s `kind` and `data`; `POST /admin/messages` with `{ userIds, title, text }`.

Changes from the app's mock: Home's `needsLook` in the mock is `attention` here; `today.lecturesWatched` is `null` (the website's Home does not count it); messages are sent with `to` and `toId` (the mock's `everyone | cohort | student`, plus `course` and `students`), and `body` is plain text.

## 5. Database steps

None of the app's own. Mark paid needs the website's `supabase/migrations_pending/2026_11_15_people_payment.sql` (from the People work); until it is pasted `paymentReady` is false and Mark paid answers 503 with `missingStep`.

Otherwise none. Every route in this part reads and writes the tables the website already uses, through the website's own functions. Routes that depend on a website step not run yet answer as the website does (for example the doubts board's `ready: false`, the studio's `ready: false`, notifications' 503 `unavailable`).
