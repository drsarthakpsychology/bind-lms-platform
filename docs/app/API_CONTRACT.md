# VIBHA app API contract (v1)

The one agreed interface between the mobile app (`apps/mobile`) and the website server. The server side lives in `src/app/api/app/v1/...`. The types live in `src/lib/app-api/contract.ts`, a plain file with no imports that the app copies as is. If this page and that file ever disagree, the file wins and this page is the bug.

Status words: **built** (the route exists and has tests) or **planned** (agreed shape, not written yet). This page is updated with every server commit.

Last updated: 2026-11-15.

## 1. Basics

- Base address: `https://vibhapsychology.com/api/app/v1` (in development, the dev server address plus `/api/app/v1`).
- JSON only, both ways. `Content-Type: application/json` on every request with a body. File bytes are the only exception (materials, submission files, video).
- No cookies. The website's cookie session and the app's token session are separate: the app and one web browser can be signed in together.
- Nothing secret is in the app. The app holds only the student's own access token and refresh token (in secure storage).

### Headers the app sends

| Header | When | Value |
|---|---|---|
| `Authorization` | every signed-in route | `Bearer <accessToken>` |
| `X-App-Device-Id` | every signed-in route, and video requests | The id the app made at first start. 16 to 80 characters: letters, digits, `.`, `-`, `_`. Keep it in secure storage and never change it |
| `X-App-Version` | every request | e.g. `1.0.0`. Below the server's minimum every route answers 426 `upgrade_required` |
| `X-App-Platform` | every request | `android` or `ios` |

### Answer shape

Every 2xx answer:

```ts
type ApiOk<T> = { ok: true; data: T };
```

Every other answer:

```ts
type ApiError = { ok: false; error: { code: ApiErrorCode; message: string; details?: Record<string, unknown> } };
```

`code` is stable: the app switches on it. `message` is plain English that can be shown as is.

| HTTP | `code` | Meaning | What the app does |
|---|---|---|---|
| 400 | `bad_request` | Body or query is wrong. `details.fields` may list the fields | Show the message |
| 401 | `invalid_credentials` | Wrong email or password | Show the message |
| 401 | `unauthenticated` | No token or a bad token | Go to sign-in |
| 401 | `token_expired` | Access token ran out | Call `/auth/refresh`, repeat the request once |
| 401 | `device_replaced` | Signed out: opened on another device | Clear tokens, show sign-in with that line |
| 401 | `device_required` | `X-App-Device-Id` missing or malformed | A bug in the app |
| 403 | `account_blocked` | Account paused | Keep tokens, show the paused screen. It lifts by itself |
| 403 | `account_expired` | Access ended | Clear tokens, show the ended screen |
| 403 | `scope` | Lectures-only account asked for more | Hide the section |
| 403 | `access_block` | Section switched off for this student | Hide the section |
| 403 | `feature_locked` | Shown as coming soon | Show coming soon |
| 403 | `feature_off` | Feature is off | Hide the section |
| 403 | `forbidden` | Not enrolled, not the owner, not an admin | Show the message |
| 403 | `device_limit` | Too many phone changes this month. `details.nextChangeAt` | Show the message and the support contact |
| 403 | `video_refused` | Video refused (rooted phone) | Show the message |
| 404 | `not_found` | | |
| 409 | `conflict` | Clashes with stored state (already graded) | Show the message, reload |
| 413 | `too_large` | | |
| 426 | `upgrade_required` | App too old. `details.minVersion`, `details.storeUrl` | Blocking update screen |
| 429 | `rate_limited` | Slow down. `details.retryAfterSeconds` when known | Back off |
| 500 | `server_error` | | Retry later |
| 503 | `unavailable` | A server part is not set up yet | Show the message |

### Lists

Lists that can grow take `?limit=` (default 30, max 100) and `?cursor=`. The answer is `Page<T> = { items: T[]; nextCursor: string | null }`. Pass `nextCursor` back as `cursor` for the next page. `null` means the end.

### Links

The server never gives the app a website path to parse. Anything tappable carries an `AppTarget` (`{ screen: "lecture", courseId, lessonId, web }` and so on, see `contract.ts`). `web` is the website path it came from. `screen: "unknown"` means the app has no screen for it yet.

### Security rules that hold on every route

- The same checks as the website session: role, paused or ended account, lectures-only scope, per-student switched-off sections, feature flags. One helper, `requireAppUser(req, gates)` in `src/lib/app-api/guard.ts`, runs them and reuses the website's own decision function (`decideApiAccess` in `src/lib/auth/api-gate.ts`).
- The one-phone rule: a signed-in request from a phone that is no longer the active one answers 401 `device_replaced`.
- Scores are never trusted from the app. Tests and checkpoints are graded on the server from the picks. Lecture progress is clamped on the server.
- Writes are rate limited per student (`rateLimitWrite`), sign-in per email and per network.
- The website's same-origin and cross-site checks do not apply to these routes (the app sends no browser origin). They are replaced by the bearer token plus the device id.

## 2. Routes

Auth column: **public** (no token), **bearer** (signed in, any role), **student** (bearer, plus the named section gate), **super admin**.

"Calls" names the existing website function the route runs. No logic is copied: where a website Server Action mixed logic with page redirects, the logic was moved to `src/lib` and both sides call it.

### 2.1 Public

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| planned | `GET /config` | public | none | `AppConfig` | `src/lib/app-api/config.ts` (constants plus `LEGAL`) |
| planned | `POST /public/request-invitation` | public, 5 a minute per network | `RequestInvitationBody` | `RequestInvitationResult` | `saveEnquiry` (moved out of `submitWaitlist`, `src/app/waitlist/actions.ts`) |
| planned | `GET /public/certificates/:certificateId` | public | none | `CertificateVerification` | the loader behind `/verify/[certificateId]` |

### 2.2 Auth and device

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| planned | `POST /auth/sign-in` | public, 10 a minute per email, 60 per network | `SignInBody` | `SignInResult` | Supabase `signInWithPassword`, then the same expiry and paused checks as `login` (`src/lib/auth/actions.ts`), then `registerDevice` |
| planned | `POST /auth/refresh` | public (refresh token in the body) | `RefreshBody` | `RefreshResult` | Supabase `refreshSession`, then the account and device checks |
| planned | `POST /auth/sign-out` | bearer | none | `SignOutResult` | Supabase admin `signOut` for this session; the phone row is marked signed out |
| planned | `POST /auth/setup/check` | public, 20 a minute per network | `SetupCheckBody` | `SetupCheckResult` | `checkSetupToken` (`src/lib/auth/setup.ts`) |
| planned | `POST /auth/setup/complete` | public, 20 a minute per network | `SetupCompleteBody` | `SetupCompleteResult` | `finishSetup` (`src/lib/auth/setup.ts`, moved out of `completeSetup`) |
| planned | `GET /devices` | bearer | none | `DeviceState` | `deviceState` (`src/lib/app-api/devices.ts`) |
| planned | `PUT /devices/current` | bearer | `UpdateDeviceBody` | `DeviceState` | `updateDevice` |
| planned | `POST /admin/devices/allow-change` | super admin | `AllowDeviceChangeBody` | `AllowDeviceChangeResult` | `allowDeviceChange` |

Sign-in errors: 401 `invalid_credentials`, 403 `account_blocked`, 403 `account_expired`, 403 `device_limit`, 429 `rate_limited`.

Sign-in notes:

- The admin master password does not work in the app (website only).
- The human check (Cloudflare Turnstile) is not part of app sign-in. It is not switched on for the website today either. If the owner switches it on, app sign-in stays protected by its rate limits only (owner decision, see the final notes).
- Setup links: the email link is `https://vibhapsychology.com/setup?token=...`. If the app is registered for that link (Android App Links), it reads `token`, calls `/auth/setup/check`, shows the new-password screen, calls `/auth/setup/complete`, then `/auth/sign-in`. Password rule: at least 12 characters (`src/lib/auth/password-policy.ts`); the server's message says what is wrong.

The one-phone rule:

- One active phone per student. Signing in on a new phone makes it the active one; the old phone's next request answers 401 `device_replaced`.
- A student may change phone 2 times in any 30 days. The first phone ever is free. After that, sign-in on another phone answers 403 `device_limit` until an admin allows it (`POST /admin/devices/allow-change`) or the oldest change is 30 days old.
- Admins and view admins are exempt from both rules.
- Before the owner runs `supabase/migrations_pending/2026_11_15_app_devices.sql`, nothing is enforced: `DeviceState.enforced` is `false`, everything else works.

### 2.3 Me

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| planned | `GET /me` | bearer | none | `Me` | `buildMe` (`src/lib/app-api/me.ts`): profile, `loadMyCohorts`, `loadMyBlocks`, `readFlags`, `lectureOnlyAllowed`, `blockedBy` |
| planned | `PATCH /me` | bearer | `UpdateMeBody` | `Me` | `saveMobileNumber`, `skipMobileNumber` (`(dashboard)/dashboard/actions.ts`) |

### 2.4 Home, courses, lectures

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| planned | `GET /home` | bearer | none | `Home` | `loadHomeModel` (`src/lib/home/model.ts`, moved out of the dashboard page): `loadCourseOverview`, `loadLearnState`, `getStrengthsWeaknesses`, `pickContinue`, `pickUpNext` |
| planned | `GET /courses` | student (`/courses`) | none | `CourseList` | `myCourses` (`src/lib/course/mine.ts`: `visibleCourseIds`) and `loadCourseOverview` |
| planned | `GET /courses/:courseId` | student (`/courses`) | none | `CourseDetail` | `canAccessCourse`, `loadCourseOverview` |
| planned | `GET /lectures/:lessonId` | student (`/courses`) | none | `LectureDetail` | `canAccessLesson`, `loadLectureDetail` (`src/lib/course/lecture.ts`) |
| planned | `POST /lectures/:lessonId/progress` | student (`/courses`), 240 a minute | `ProgressPingBody` | `ProgressPingResult` | `pingProgress` |
| planned | `POST /lectures/:lessonId/complete` | student (`/courses`) | none | `CompleteLectureResult` | the assignment rule of `completeAndAdvance`, then `markLessonComplete` |
| planned | `POST /save` | bearer, 240 a minute | `SaveBody` | `SaveResult` | `applySaves` (`src/lib/save/apply.ts`), the same function the website's `/api/save` runs: `pingProgress`, `markLessonComplete`, `saveLearnState`, `recordMyAnswers`, `storeLearnEvents` |

`POST /save` is the offline-safe path: the app keeps a queue on the phone and sends batches (up to 25 items, 256 KB). Each item answers `ok` (stored), `retry` (keep and send again) or `drop` (can never be stored). The direct progress and complete routes are for when the app is online and wants the answer now.

### 2.5 Video

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| planned | `POST /lectures/:lessonId/stream` | student (`/courses`), 60 a minute per student | `StreamAccessBody` | `StreamAccess` | `canAccessLesson`, `mintStreamToken` (app form, bound to user and device), `watermarkFor` |
| planned | `GET /api/media/stream/:lessonId/...?st=<token>` (not under `/api/app/v1`: the website's existing stream route) | the stream token, plus `X-App-Device-Id` | none | HLS playlists, AES-128 key, encrypted chunks, or MP4 bytes | the existing stream proxy, with an app branch: `checkAppStreamViewer` (`src/lib/media/app-viewer.ts`) |

How app video works (details in `docs/app/VIDEO_DELIVERY.md`):

- Same streams, same quality ladder, same AES-128 encryption on the way out, same key per viewer and lecture as the website.
- `StreamAccess.url` is a complete address with the token inside. Give it to the player unchanged, with `StreamAccess.headers` on every request the player makes.
- The token is tied to the student, the lecture and this phone. The server re-checks at most once a minute that the account is still fine and this phone is still the active one, so a paused student or a replaced phone stops within a minute.
- A native player cannot swap tokens in the middle of a lecture (the website player can). So the app token lasts for the lecture: one and a half times the lecture length plus 10 minutes, never under 30 minutes, never over 6 hours. Ask for a new one when resuming or when the player gets a 401.
- `watermark.text` (name and roll number) must be drawn moving over the video.
- `deviceCompromised: true` is refused with 403 `video_refused`.

### 2.6 Materials and assignments

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| planned | `GET /materials/:materialId` | student (`/courses`) | none | `Material` | `canAccessMaterial` |
| planned | `GET /materials/:materialId/file` | student (`/courses`) | none | the file bytes (`Range` supported) | `canAccessMaterial` and the same streaming as `/api/media/materials/:id` |
| planned | `GET /assignments` | student (`/courses`) | `?limit&cursor` | `Page<AssignmentRow>` | `loadCourseOverview` rows |
| planned | `GET /assignments/:assignmentId` | student (`/courses`) | none | `Assignment` | `loadAssignment` (`src/lib/course/assignment.ts`) |
| planned | `POST /assignments/:assignmentId/text` | student, 20 a minute | `SubmitTextBody` | `SubmitResult` | `submitTextAssignment` |
| planned | `POST /assignments/:assignmentId/uploads` | student, 30 a minute | `PrepareUploadBody` | `PrepareUploadResult` | `prepareSubmissionUpload` |
| planned | `POST /assignments/:assignmentId/files` | student, 20 a minute | `SubmitFilesBody` | `SubmitResult` | `submitWithFiles` |
| planned | `POST /assignments/:assignmentId/audio` | student, 20 a minute | `SubmitAudioBody` | `SubmitResult` | `submitAudioAssignment` |
| planned | `DELETE /assignments/:assignmentId/submission` | student | none | `UnsubmitResult` | `unsubmitAssignment` |
| planned | `GET /submissions/files/:fileId` | bearer (owner only) | none | the file bytes | the same check as `/api/media/submissions/:fileId` |

### 2.7 Study

All study routes: student, gate `/study` with flag `learn` (closed for lectures-only accounts, for students with Study switched off, and while the `learn` flag is not unlocked).

| Status | Method and path | Request | Response | Calls |
|---|---|---|---|---|
| planned | `GET /study/modules` | none | `StudyHome` | `MODULES`, `moduleStatus`, `courseNext`, `loadLearnState` |
| planned | `GET /study/modules/:moduleId` | none | `ModuleDetail` | `moduleById`, `moduleStatus`, `checkpoints`, `checkpointStatus`, `moduleNext`, `retestDue` |
| planned | `GET /study/modules/:moduleId/sections/:sectionId` | none | `SectionContent` | `sectionById`, `splitSection`, `checkpoints`, `laterSectionIds` |
| planned | `GET /study/state` | none | `LearnStateResult` | `loadLearnState` |
| planned | `PUT /study/state` | `SaveLearnStateBody` | `SaveLearnStateResult` | `saveLearnState` (clamp, `mergeCopies`, server-owned tests), then `loadLearnState` |
| planned | `GET /study/modules/:moduleId/checkpoints/:n` | none | `CheckpointContent` | `checkpoints`, `checkpointQuestions`, `checkpointRound`, `checkpointKnown`, `loadMyHistory` |
| planned | `POST /study/modules/:moduleId/checkpoints/:n/answers` | `SubmitPicksBody` | `CheckpointResult` | server grading with the same question set, `recordMyAnswers("study-check")`, `saveLearnState` |
| planned | `POST /study/modules/:moduleId/test` | `SubmitPicksBody` | `ModuleTestResult` | `submitModuleTest` (`gradeTest`, `withTestResult`) |
| planned | `GET /study/marks` | none | `MarksResult` | `pullMarks` |
| planned | `PUT /study/marks` | `SaveMarksBody` | `SaveMarksResult` | `pushMarks`, then `pullMarks` |
| planned | `GET /study/notes` | none | `RevisionNoteList` | the notes library in `src/lib/learn/notes` |
| planned | `GET /study/notes/:noteId` | none | `RevisionNote` | same |
| planned | `GET /study/figures/:figureId` | none | `Figure` | `FIGURES` (`src/components/study/figures/registry.ts`), drawn to standalone SVG on the server |

Test questions: the module test section and the checkpoints are sent as `TestQuestion` (`key`, `q`, `options`) with no answer. The app sends `{ picks: { [key]: optionIndex } }` and gets the score and a review (right answer and why) back. Practice questions inside ordinary sections are sent with their answers, as on the website.

Saving study state: the app keeps its own copy of `LearnState`, changes it as the student studies, and sends the whole copy with `PUT /study/state` (or through `POST /save`, kind `learn`). The server never takes the app's word for points: it clamps them, merges with the stored copy so marks never go backwards, keeps the server-graded test results, and answers the merged state. The app replaces its copy with the answer. Fields the app does not know must be sent back untouched.

### 2.8 Notifications and push

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| planned | `GET /notifications` | student (`/notifications`) | `?limit&cursor` | `NotificationList` | the query of the notifications page |
| planned | `GET /notifications/:id` | student (`/notifications`) | none | `NotificationDetail` | `openNotification` (`src/lib/notify/read.ts`, moved out of the page): marks read and opened |
| planned | `POST /notifications/read-all` | student (`/notifications`) | none | `ReadAllResult` | `markAllNotificationsRead` |
| planned | `GET /notifications/preferences` | bearer | none | `NotificationPrefs` | `loadPrefs` (`src/lib/app-api/prefs.ts`) |
| planned | `PUT /notifications/preferences` | bearer | `Partial<NotificationPrefs>` | `NotificationPrefs` | `savePrefs` |

Push:

- The app gets an Expo push token (`expo-notifications`) and stores it on its phone row with `PUT /devices/current { pushToken }`. `null` switches push off for that phone.
- Whenever the website writes a bell notification row (admin messages, nudges, doubt answers, achievements, certificates), `sendPush` (`src/lib/app-api/push.ts`) sends the same title and text to the student's active phone through the Expo push service. It never blocks or fails the notification itself.
- Every push carries `data: PushData` (`notificationId`, `type`, `target`). On tap the app opens `target`, or `GET /notifications/:id`.
- Preferences: `push` is the master switch; `messages`, `doubtReplies`, `achievements` filter by kind on the server. `studyReminder` and `studyReminderTime` are a local notification the app schedules itself.

### 2.9 Doubts

All: student, gate `/doubts` (open to lectures-only accounts; closed when Doubts is switched off for the student).

| Status | Method and path | Request | Response | Calls |
|---|---|---|---|---|
| planned | `GET /doubts` | `?cohort=&mine=1&limit&cursor` | `DoubtList` | `loadDoubts`, `doubtsReady` (`src/lib/doubts/data.ts`) |
| planned | `GET /doubts/:id` | none | `DoubtThread` | `loadDoubt` |
| planned | `POST /doubts` | `AskDoubtBody` | `AskDoubtResult` | `askDoubt` |
| planned | `POST /doubts/:id/replies` | `ReplyBody` | `DoubtActionResult` | `replyToDoubt` |
| planned | `POST /doubts/:id/replies/:replyId/vote` | `VoteBody` | `DoubtActionResult` | `voteReply` |
| planned | `POST /doubts/:id/solved` | `SolvedBody` | `DoubtActionResult` | `markSolved` |

### 2.10 Progress, achievements, certificates, settings

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| planned | `GET /progress` | bearer | none | `Progress` | `loadCourseOverview`, `loadLearnState`, `moduleStatus`, `getStrengthsWeaknesses` |
| planned | `GET /achievements` | student (`/achievements`) | none | `Achievements` | `loadMyAchievements` |
| planned | `GET /achievements/:credentialId/pdf` | student (`/achievements`) | none | `CertificatePdfLink` | `downloadMyCertificate` |
| planned | `GET /settings` | bearer | none | `Settings` | `buildMe`, `deviceState`, `loadPrefs`, `LEGAL` |

Settings are changed through the routes that own each part: `PATCH /me`, `PUT /devices/current`, `PUT /notifications/preferences`.

### 2.11 Later phases (not in this contract yet)

Phase 4 (Practise, Library) and Phase 5 (Admin) get their own sections when they start. Rule already agreed: game and practice rounds come as complete structured JSON (the same data objects the website's widgets use, each with a `kind` and a version), never HTML and never a web view.

## 3. Study content as data

The app draws everything natively. The server sends study content as structured JSON, never HTML. The version of this JSON is `CONTENT_SCHEMA_VERSION` (1). It is in `AppConfig.contentSchemaVersion` and in every `SectionContent`.

### 3.1 Text

`Inline` is a string with three marks only: `**bold**`, `*italic*`, and `` `term` `` (a glossary term). Nothing else, no HTML.

### 3.2 Blocks

`Block` in `contract.ts`, the same as the website's `Block` in `src/lib/study/types.ts`:

| `t` | Data | Draw as |
|---|---|---|
| `h3` | `text` | Sub-heading. A trailing `[core]` or `[extra]` is a tag, not text |
| `p` | `text` | Paragraph |
| `ul`, `ol` | `items: ListItem[]` (nested through `children`) | List |
| `table` | `head`, `rows` | Table (scroll sideways on a phone) |
| `box` | `kind: BoxKind`, `title?`, `blocks` | Call-out box. Kinds: `define`, `word`, `trap`, `mnemonic`, `example`, `sounds`, `analogy`, `note`, `safety` |
| `view` | `view: "student" or "clinician"`, `blocks` | Shown only in that reading view |
| `qa` | `q`, `level?`, `blocks` | Question with a full answer, answer folded |
| `widget` | `kind`, `v`, `data` | An interactive piece, see below |
| `recall`, `viva`, `mcq` | cards or questions | Not sent inside chunks: the server lifts them out into `SectionContent.recall`, `viva`, `mcq` |

### 3.3 Widgets

A widget block is `{ t: "widget", kind, v: 1, data }`. `v` is the version of that kind's data shape. The data type of each kind is `WidgetDataByKind[kind]` in `contract.ts`; each is the same object the website widget takes (`src/lib/study/types.ts`), and the website component named below is the reference for how it behaves.

Kinds whose data is everything the widget needs (the app can build these from the data alone):

| `kind` | Data type | What it is |
|---|---|---|
| `guess` | `GuessData` | Guess a number on a slider, then the real range |
| `decide` | `DecideData` | A scene and choices, each with a verdict and why |
| `sort` | `SortData` | Sort items into buckets |
| `build` | `BuildData` | Tick the symptoms present, check against the rule |
| `moodline` | `MoodlineData` | A mood chart and a question about it |
| `worked` | `WorkedData` | Worked example, step by step, then your turn |
| `reveal` | `RevealData` | Prompt, tap to show the answer |
| `flow` | `FlowData` | Chain, cycle or tree of nodes with details |
| `layers` | `LayersData` | Pyramid, rings, stack or iceberg |
| `timeline` | `TimelineData` | Put events in order (the app shuffles) |
| `compare` | `CompareData` | Two states side by side with a slider |
| `experiment` | `ExperimentData` | Predict each condition, then the real result |
| `thoughtrecord` | `ThoughtRecordData` | A CBT thought record filled step by step |
| `figure` | `FigureData` | A labelled drawing: fetch `GET /study/figures/:id` |

Kinds that are a scene with a small configuration (the data only sets options and captions; the scene itself, its steps and its numbers must be rebuilt natively from the website component):

| `kind` | Data type | Website reference |
|---|---|---|
| `synapse` | `SynapseData` | `src/components/study/widgets.tsx` |
| `curve` | `CurveData` (six kinds of curve) | `src/components/study/interactive.tsx` |
| `brainmap` | `BrainMapData` | `src/components/study/visuals.tsx` |
| `journey`, `neuron`, `pathways`, `receptor`, `conditioning`, `memoryflow`, `stress` | same-named `...Data` | `src/components/study/animations.tsx` |
| `attention`, `dissonance`, `conservation`, `release` | same-named `...Data` | `src/components/study/animations2.tsx` |
| `hypnogram`, `strange`, `illusion` | same-named `...Data` | `src/components/study/animations3.tsx` |
| `nervoussystem`, `brainexplorer`, `actionpotential`, `synapse3d`, `genogram`, `hpaloop`, `brainslicer`, `amesroom` | same-named `...Data` | `src/components/study/scenes/` (3D on the website) |

The file references above are where each widget is drawn on the website today; `src/components/study/widgets.tsx` holds the switch from `kind` to component. An unknown `kind` or a higher `v` than the app knows must be drawn as a plain "Open on the website" row, never crash.

### 3.4 Figures

`GET /study/figures/:id` answers a `Figure`: `viewBox`, `labels` (each with the point it names and a line about it), and the drawing as two standalone SVG documents (light and dark, colours already filled in, no stylesheet needed) for `react-native-svg`. Shapes carry `data-part="<label id>"` and lines `data-line="<label id>"`. `FigureData.focus` lists the labels to highlight; `quiz: true` hides the label names to test recall.

### 3.5 Messages

Notification bodies are sent as `MessageBlock[]` (paragraphs, headings, lists, with bold, italic and links), never HTML.

## 4. Database steps for the owner

| File | What it adds | Before it is run |
|---|---|---|
| `supabase/migrations_pending/2026_11_15_app_devices.sql` | `app_devices` (one row per phone), `app_device_changes` (the phone-change log and admin allowances), `app_notification_prefs` | Everything works; the one-phone rule and the change limit are not enforced, push is not sent, preferences stay on the phone |

## 5. Change rules

- Adding a field or a route is not a breaking change. The app must ignore fields it does not know.
- Removing or renaming a field, or changing a type, needs `/api/app/v2`, or a raised `minSupportedVersion`.
- Every change to a route lands in the same commit as the change to `contract.ts` and to this page.
