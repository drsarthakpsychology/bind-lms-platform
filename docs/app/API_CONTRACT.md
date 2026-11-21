# VIBHA app API contract (v1)

The one agreed interface between the mobile app (`apps/mobile`) and the website server. The server side lives in `src/app/api/app/v1/...`. The types live in `src/lib/app-api/contract.ts`, a plain file with no imports that the app copies as is. If this page and that file ever disagree, the file wins and this page is the bug.

Status words: **built** (the route exists and has tests) or **planned** (agreed shape, not written yet). This page is updated with every server commit.

Last updated: 2026-11-16.

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
| `If-None-Match` | optional, any GET | The `ETag` of the copy the app already holds. Unchanged: the answer is an empty `304` (keep showing the held copy) |

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

Every successful GET (the `{ ok: true }` JSON answers) carries an `ETag` and `Cache-Control: private, no-store`. Send it back as `If-None-Match` on the next GET of the same address with the same sign-in, and an unchanged answer comes back as `304` with no body. File, video and PDF routes answer as before.

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
| 404 | `not_found` | The thing is not there, or no route answers this path (any unknown `/api/app/v1/...` path answers this JSON, never an HTML page) | Route the app may not have yet: use its fallback or show "not on the server yet" |
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
| built | `GET /config` | public | none | `AppConfig` | `src/lib/app-api/config.ts` (constants plus `LEGAL`). `cohortLine` is the Welcome screen's line (`APP_RULES.cohortLine`; the `APP_COHORT_LINE` server setting overrides it, `none` hides it) |
| built | `GET /public/home` | public, cached (an hour on the CDN, a day stale while it refreshes; never refused for an old app) | none | `PublicHome` | `publicHome` (`src/lib/app-api/public-home.ts`): the homepage's own words from `src/components/home/content.ts`, the section headings of `home-page.tsx` (a test keeps them word for word), `BRAND`, `LEGAL`. For the Welcome screen. Leaves out which cohort is running, the free tools and the arcade |
| built | `POST /public/request-invitation` | public, 5 a minute per network (the website form's own counter) | `RequestInvitationBody` | `RequestInvitationResult` | `saveEnquiry` (`src/lib/enquiry.ts`, moved out of `submitWaitlist`, which calls it too); stored with `source: "app"` |
| built | `GET /public/certificates/:certificateId` | public, 60 a minute per network | none | `CertificateVerification` | `verifyCertificate` (`src/lib/app-api/achievements.ts`): `loadCredential`, `certStatus`, the facts of `/verify/[certificateId]` |

### 2.2 Auth and device

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `POST /auth/sign-in` | public, 10 a minute per email, 60 per network | `SignInBody` | `SignInResult` | Supabase `signInWithPassword`, then the same expiry and paused checks as `login` (`src/lib/auth/actions.ts`), then `registerDevice` |
| built | `POST /auth/refresh` | public (refresh token in the body) | `RefreshBody` | `RefreshResult` | Supabase `refreshSession`, then the account and device checks |
| built | `POST /auth/sign-out` | bearer | none | `SignOutResult` | Supabase admin `signOut` for this session; the phone row is marked signed out |
| built | `POST /auth/setup/check` | public, 20 a minute per network | `SetupCheckBody` | `SetupCheckResult` | `checkSetupToken` (`src/lib/auth/setup.ts`) |
| built | `POST /auth/setup/complete` | public, 20 a minute per network | `SetupCompleteBody` | `SetupCompleteResult` | `finishSetup` (`src/lib/auth/setup.ts`, moved out of `completeSetup`) |
| built | `GET /devices` | bearer | none | `DeviceState` | `deviceState` (`src/lib/app-api/devices.ts`) |
| built | `PUT /devices/current` | bearer | `UpdateDeviceBody` | `DeviceState` | `updateDevice` |
| built | `POST /admin/devices/allow-change` | super admin | `AllowDeviceChangeBody` | `AllowDeviceChangeResult` | `allowDeviceChange` |

Sign-in errors: 401 `invalid_credentials`, 403 `account_blocked`, 403 `account_expired`, 403 `device_limit`, 429 `rate_limited`.

Sign-in notes:

- The admin master password does not work in the app (website only).
- The human check (Cloudflare Turnstile) is not part of app sign-in. It is not switched on for the website today either. If the owner switches it on, app sign-in stays protected by its rate limits only (owner decision, see the final notes).
- Setup links: the email link is `https://vibhapsychology.com/setup?token=...`. If the app is registered for that link (Android App Links), it reads `token`, calls `/auth/setup/check`, shows the new-password screen, calls `/auth/setup/complete`, then `/auth/sign-in`. Password rule: at least 12 characters (`src/lib/auth/password-policy.ts`); the server's message says what is wrong.

The one-phone rule:

- One active phone per student. Signing in on a new phone makes it the active one; the old phone's next request answers 401 `device_replaced`.
- A student may change phone 2 times in any 30 days. The first phone ever is free. After that, sign-in on another phone answers 403 `device_limit` until an admin allows it (`POST /admin/devices/allow-change`) or the oldest change is 30 days old. Admins are exempt, and so are the emails in the server setting `APP_REVIEW_EMAILS` (comma list, for the store reviewers; not set means nobody): they get no change limit, but one phone at a time still applies.
- Admins and view admins are exempt from both rules.
- Before the owner runs `supabase/migrations_pending/2026_11_15_app_devices.sql`, nothing is enforced: `DeviceState.enforced` is `false`, everything else works.

### 2.3 Me

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `GET /me` | bearer | none | `Me` | `buildMe` (`src/lib/app-api/me.ts`): profile, `loadMyCohorts`, `loadMyBlocks`, `readFlags`, `lectureOnlyAllowed`, `blockedBy` |
| built | `PATCH /me` | bearer | `UpdateMeBody` | `Me` | `saveMobileNumber`, `skipMobileNumber` (`(dashboard)/dashboard/actions.ts`) |
| built | `POST /me/deletion-request` | bearer, 3 a minute | `DeletionRequestBody` | `DeletionRequestResult` | `requestDeletion` (`src/lib/app-api/deletion.ts`): stores the request in `app_deletion_requests` and sends the super admin a bell notice and push. Nothing is deleted automatically; a person handles it |

### 2.4 Home, courses, lectures

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `GET /home` | bearer | none | `Home` | `loadHomeModel` (`src/lib/home/model.ts`, moved out of the dashboard page, which now calls it too): `loadMyCourses`, `loadCourseOverview`, `loadLearnState`, `getStrengthsWeaknesses`, `pickContinue`, `pickUpNext`, `loadQuests` (`Home.quests`, the same three quests and points as the website's Home) |
| built | `GET /courses` | student (`/courses`) | none | `CourseList` | `loadMyCourses` (`src/lib/course/mine.ts`: published, enrolment or lectures-only, `visibleCourseIds`) and `loadCourseOverview` |
| built | `GET /courses/:courseId` | student (`/courses`) | none | `CourseDetail` | `loadMyCourses` (the course layout's rule), `loadCourseOverview` |
| built | `GET /lectures/:lessonId` | student (`/courses`) | none | `LectureDetail` | `loadLecture` (`src/lib/course/lecture.ts`): `canAccessLesson`, the lecture page's hidden/live and cohort rules, `lectureNeighbours` (`src/lib/course/lecture-order.ts`, shared with the lecture page) |
| built | `POST /lectures/:lessonId/progress` | student (`/courses`), 240 a minute | `ProgressPingBody` | `ProgressPingResult` | `pingProgress` |
| built | `POST /lectures/:lessonId/complete` | student (`/courses`), 60 a minute | none | `CompleteLectureResult` | `completionBlock` (`src/lib/course/complete.ts`, moved out of `completeAndAdvance`), then `markLessonComplete` |
| built | `POST /save` | bearer, 240 a minute | `SaveBody` | `SaveResult` | `applySaves` (`src/lib/save/apply.ts`), the same function the website's `/api/save` runs: `pingProgress`, `markLessonComplete`, `saveLearnState`, `recordMyAnswers`, `storeLearnEvents` |

Errors: a lecture not live yet answers 403 `feature_locked`; a lecture not shared with the student, hidden, or of a course they cannot open answers 404 `not_found` (as the website). `complete` answers 409 `conflict` with `details.reason: "needs_submission"` when the lecture needs its assignment handed in first.

`POST /save` is the offline-safe path: the app keeps a queue on the phone and sends batches (up to 25 items, 256 KB). Each item answers `ok` (stored), `retry` (keep and send again) or `drop` (can never be stored). The direct progress and complete routes are for when the app is online and wants the answer now.

### 2.5 Video

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `POST /lectures/:lessonId/stream` | student (`/courses`), 60 a minute per student, 120 per network (the website's own limits) | `StreamAccessBody` | `StreamAccess` | `appStreamAccess` (`src/lib/app-api/stream.ts`): `loadLecture`, `playbackMedia` (`src/lib/media/playback.ts`, moved out of `/api/media/playback`), `mintAppStreamToken` (`src/lib/media/app-stream-token.ts`), `watermarkFor` |
| built | `GET /api/media/stream/:lessonId/...?st=<token>` (not under `/api/app/v1`: the website's existing stream route) | the app stream token, plus `X-App-Device-Id` | none | HLS playlists, AES-128 key, encrypted chunks, or MP4 bytes (`Range` works) | the existing stream proxy, with an app branch: `checkAppStreamViewer` (`src/lib/media/app-viewer.ts`); everything after the viewer check is the website's code |

How app video works (details in `docs/app/VIDEO_DELIVERY.md`):

- Same streams, same quality ladder, same AES-128 encryption on the way out, same key per viewer and lecture as the website.
- `StreamAccess.url` is a complete address with the token inside. Give it to the player unchanged, with `StreamAccess.headers` on every request the player makes.
- The token is tied to the student, the lecture and this phone. The server re-checks at most once a minute that the account is still fine and this phone is still the active one, so a paused student or a replaced phone stops within a minute.
- A native player cannot swap tokens in the middle of a lecture (the website player can). So the app token lasts for the lecture: one and a half times the lecture length plus 10 minutes, never under 30 minutes, never over 6 hours. Ask for a new one when resuming or when the player gets a 401.
- `watermark.text` (name and roll number) must be drawn moving over the video.
- `deviceCompromised: true` is refused with 403 `video_refused`.
- The proxy answers plain JSON errors (`{ error }`, not the app envelope) because it is the website's route: 401 means ask `/stream` again (token ran out, other phone, signed out), 403 means paused or not allowed, 429 slow down.
- The server needs `SESSION_SECRET` (already set for the website). Without it `/stream` answers 503 `unavailable`.

### 2.6 Materials and assignments

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `GET /materials/:materialId` | student (`/courses`) | none | `Material` (with `courseId`, so the app can open `/courses/<courseId>/materials/<id>` on the website; also set on `LectureDetail.materials`) | `checkMaterial` (`src/lib/media/material-serve.ts`: the website's material rule, published, enrolment, cohort) |
| built | `GET /materials/:materialId/file` | student (`/courses`), 300 a minute | none | the file bytes (`Range` supported) | `serveMaterial`, the same function as `/api/media/materials/:id` |
| built | `GET /assignments` | student (`/courses`) | `?limit&cursor` | `Page<AssignmentRow>` | `loadMyCourses`, `loadCourseOverview` rows, plus due dates and scores (`assignmentRows`, `src/lib/app-api/assignments.ts`) |
| built | `GET /assignments/:assignmentId` | student (`/courses`) | none | `Assignment` | `loadAssignment` (`src/lib/course/assignment.ts`) |
| built | `POST /assignments/:assignmentId/text` | student, 20 a minute | `SubmitTextBody` | `SubmitResult` | `loadAssignment`, then `submitTextAssignment` |
| built | `POST /assignments/:assignmentId/uploads` | student, 30 a minute | `PrepareUploadBody` | `PrepareUploadResult` | `prepareSubmissionUpload` |
| built | `POST /assignments/:assignmentId/files` | student, 20 a minute | `SubmitFilesBody` | `SubmitResult` | `submitWithFiles` |
| built | `POST /assignments/:assignmentId/audio` | student, 20 a minute | `SubmitAudioBody` | `SubmitResult` | `submitAudioAssignment` |
| built | `DELETE /assignments/:assignmentId/submission` | student, 20 a minute | none | `UnsubmitResult` | `unsubmitAssignment` |
| built | `GET /submissions/files/:fileId` | bearer (owner only), 120 a minute | none | `SubmissionFileLink` (a 15 minute address) | `signSubmissionFile` (`src/lib/media/submission-file.ts`), the same function as `/api/media/submissions/:fileId` |

Handing in files: `POST .../uploads` once per file answers `uploadUrl` and `headers`; `PUT` the raw bytes there; then `POST .../files` with every `{ path, name }`. Audio is the same with one file and `POST .../audio`. Only paths the server made for this student and assignment are accepted. Errors: 409 `conflict` once graded, 400 `bad_request` for a file type the assignment does not take (the message names it), 404 when the assignment is not one the student can open.

### 2.7 Study

All study routes: student, gate `/study` with flag `learn` (closed for lectures-only accounts, for students with Study switched off, and while the `learn` flag is not unlocked).

| Status | Method and path | Request | Response | Calls |
|---|---|---|---|---|
| built | `GET /study/modules` | none | `StudyHome` | `MODULES`, `moduleStatus`, `courseNext`, `loadLearnState` |
| built | `GET /study/modules/:moduleId` | none | `ModuleDetail` | `moduleById`, `moduleStatus`, `checkpoints`, `checkpointStatus`, `moduleNext`, `retestDue` |
| built | `GET /study/modules/:moduleId/sections/:sectionId` | none | `SectionContent` | `sectionById`, `splitSection`, `checkpoints`, `laterSectionIds` |
| built | `GET /study/state` | none | `LearnStateResult` | `loadLearnState` |
| built | `PUT /study/state` | `SaveLearnStateBody` | `SaveLearnStateResult` | `saveLearnState` (clamp, `mergeCopies`, server-owned tests), then `loadLearnState` |
| built | `GET /study/modules/:moduleId/checkpoints/:n` | none | `CheckpointContent` | `checkpoints`, `checkpointQuestions`, `checkpointRound`, `checkpointKnown`, `loadMyHistory` |
| built | `POST /study/modules/:moduleId/checkpoints/:n/answers` | `SubmitPicksBody` | `CheckpointResult` | `gradeCheckpoint` (`src/lib/app-api/study.ts`): grades from `checkpointQuestions`, `recordHistory("study-check")`, `checkpointKnown`, then the website's `recordTest` through `saveLearnState` |
| built | `POST /study/modules/:moduleId/test` | `SubmitPicksBody` | `ModuleTestResult` | `submitModuleTest` (`gradeTest`, `withTestResult`); then `recordHistory("module-test")` and the attempt's points through `recordTest` and `saveLearnState` (clamped; the graded result is kept), as the website's test runner does |
| built | `GET /study/marks` | none | `MarksResult` | `pullMarks` |
| built | `PUT /study/marks` | `SaveMarksBody` | `SaveMarksResult` | `pushMarks`, then `pullMarks` |
| built | `GET /study/notes` | none | `RevisionNoteList` | `noteList` (`src/lib/app-api/notes.ts`): `NOTES`, `WEEK_BLOCKS` |
| built | `GET /study/notes/:noteId` | none | `RevisionNote` | `noteDetail`: the note, plus the figures the website places between its sections (`NOTE_FIGURES`) |
| built | `GET /study/figures/:figureId` | none | `Figure` | `figureData` (`src/lib/app-api/figure-svg.ts`): `FIGURES` (`src/components/study/figures/registry.ts`) drawn to standalone SVG on the server, the figure palette resolved for light and dark |

Writes are rate limited: state 120 a minute, checkpoint and test answers 30 a minute, marks 60 a minute. Study content is the same for everyone and comes from the website's code (no database read), so it is fast; only the learn state, history and marks are per student.

Test questions: the module test section and the checkpoints are sent as `TestQuestion` (`key`, `q`, `options`) with no answer. The app sends `{ picks: { [key]: optionIndex } }` and gets the score and a review (right answer and why) back. Practice questions inside ordinary sections are sent with their answers, as on the website.

Saving study state: the app keeps its own copy of `LearnState`, changes it as the student studies, and sends the whole copy with `PUT /study/state` (or through `POST /save`, kind `learn`). The server never takes the app's word for points: it clamps them, merges with the stored copy so marks never go backwards, keeps the server-graded test results, and answers the merged state. The app replaces its copy with the answer. Fields the app does not know must be sent back untouched.

### 2.8 Notifications and push

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `GET /notifications` | student (`/notifications`) | `?limit&cursor` | `NotificationList` | `listNotifications` (`src/lib/app-api/notifications.ts`): the notifications page's query, with the student's own client |
| built | `GET /notifications/:id` | student (`/notifications`) | none | `NotificationDetail` | `openNotification` (`src/lib/notify/read.ts`, moved out of the page, which calls it too): marks read and opened; `htmlToBlocks` (`src/lib/app-api/message-blocks.ts`) |
| built | `POST /notifications/read-all` | student (`/notifications`), 30 a minute | none | `ReadAllResult` | `markAllNotificationsRead` |
| built | `GET /notifications/preferences` | bearer | none | `NotificationPrefs` | `loadPrefs` (`src/lib/app-api/prefs.ts`) |
| built | `PUT /notifications/preferences` | bearer, 30 a minute | `Partial<NotificationPrefs>` (without `synced`; `studyReminderTime` is "HH:MM") | `NotificationPrefs` | `savePrefs` |

Push:

- The app gets an Expo push token (`expo-notifications`) and stores it on its phone row with `PUT /devices/current { pushToken }`. `null` switches push off for that phone.
- Whenever the website writes a bell notification row, `queuePush` (`src/lib/app-api/push.ts`) sends the same title and text to the student's active phone through the Expo push service, after the response. It never blocks or fails the notification itself. Built into: admin messages (`sendNotifications`), nudges, doubts (new doubt to admins, answers to the asker), achievements and certificates (`notifyCredential`, `emailCustomCertificate`, `notifyCertificate`).
- Android notification channels the app must create: `messages` and `achievements`.
- Server settings (optional): `EXPO_ACCESS_TOKEN` when the Expo project requires push security; `APP_PUSH_DISABLED=1` switches all push off.
- A token Expo answers `DeviceNotRegistered` for is cleared from the phone row.
- Every push carries `data: PushData` (`notificationId`, `type`, `target`). On tap the app opens `target`, or `GET /notifications/:id`.
- Preferences: `push` is the master switch; `messages`, `doubtReplies`, `achievements` filter by kind on the server. `studyReminder` and `studyReminderTime` are a local notification the app schedules itself.

### 2.9 Doubts

All: student, gate `/doubts` (open to lectures-only accounts; closed when Doubts is switched off for the student).

| Status | Method and path | Request | Response | Calls |
|---|---|---|---|---|
| built | `GET /doubts` | `?cohort=&mine=1&limit&cursor` | `DoubtList` (`wall`: the class wall is open for you, the website's rule: not admins, gate `/wall`) | `loadDoubts`, `doubtsReady` (`src/lib/doubts/data.ts`) |
| built | `GET /doubts/:id` | none | `DoubtThread` | `loadDoubt` |
| built | `POST /doubts` | `AskDoubtBody` | `AskDoubtResult` | `askDoubt` |
| built | `POST /doubts/:id/replies` | `ReplyBody` | `DoubtActionResult` | `replyToDoubt` |
| built | `POST /doubts/:id/replies/:replyId/vote` | `VoteBody` | `DoubtActionResult` | `voteReply` |
| built | `POST /doubts/:id/solved` | `SolvedBody` | `DoubtActionResult` | `markSolved` |

The website's doubt actions do their own rate limits (20 doubts, 40 answers, 60 votes a minute) and visibility checks; their answers are mapped to codes: 404 for a thread the student cannot see, 403 when only the asker may mark it solved, 429, 503 before the doubts database step. Every write answers the fresh thread (`DoubtActionResult`).

### 2.10 Progress, achievements, certificates, settings

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `GET /progress` | bearer | none | `Progress` | `loadProgress` (`src/lib/app-api/progress.ts`): `loadMyCourses`, `loadCourseOverview`, `loadLearnState`, `moduleStatus`, `getStrengthsWeaknesses`. `study`, `days` and `strengths` are empty when Study is closed for the account |
| built | `GET /achievements` | student (`/achievements`) | none | `Achievements` | `loadMyAchievements` |
| built | `GET /achievements/:credentialId/pdf` | student (`/achievements`), 30 a minute | none | `CertificatePdfLink` | `downloadMyCertificate` (409 `conflict` when not issued yet) |
| built | `GET /settings` | bearer | none | `Settings` | `buildMe`, `deviceState`, `loadPrefs`, `buildConfig` |
| built | `GET /journey` | bearer (gate `/journey`, open to lectures-only accounts as on the website) | none | `Journey` | `loadJourney` (`src/lib/journey/model.ts`, moved out of the `/journey` page, which calls it too): `loadMyBoard`, `normalise`, `levelFor`, `liveStreak`, lecture progress and practice counts |

Settings are changed through the routes that own each part: `PATCH /me`, `PUT /devices/current`, `PUT /notifications/preferences`.

### 2.10a Learning map and class wall

Map routes: bearer, gate `{ path: "/study/map", flag: "learn" }` (the website page calls `requireFeature("learn")`; closed to lectures-only accounts and when Study is switched off). Staff accounts get `learner: false`, an empty map, and rounds that are graded but not saved, as on the website.

| Status | Method and path | Request | Response | Calls |
|---|---|---|---|---|
| built | `GET /study/map` | none | `StudyMap` | `loadStudentMap` (`src/lib/learn/model/server.ts`) through `mapView` (`src/lib/app-api/learn-map.ts`) |
| built | `GET /study/map/practice` | `?topic=` (unknown topic: mixed practice), 30 a minute | `MapPractice` (answers and both explanations included, as the website sends them to the browser) | `loadPracticeSession`, `bankItem` |
| built | `POST /study/map/practice/answers` | `MapAnswerBody`, 120 a minute | `MapAnswerResult` (404 for an item not in the bank) | `answerPractice` (`src/app/(dashboard)/study/map/actions.ts`): graded on the server, saved to the model, answer history and events |

Wall routes: bearer, gate `{ path: "/wall" }` (closed to lectures-only accounts and when the Wall is switched off). Reads and writes run as the caller (row level security); authors are never sent. Same rate-limit keys as the website's `/api/practice/wall/*`, so web and app share one limit.

| Status | Method and path | Request | Response | Calls |
|---|---|---|---|---|
| built | `GET /wall` | none | `WallFeed` (50 newest, pinned first; `mine` is your own reactions) | `loadWall` (`src/lib/wall/data.ts`, shared with the website page) |
| built | `POST /wall/posts` | `WallWriteBody`, 15 a minute | `WallWriteResult` | `addWallPost` |
| built | `POST /wall/posts/:postId/replies` | `WallWriteBody`, 20 a minute | `WallWriteResult` | `addWallReply` |
| built | `POST /wall/reactions` | `WallReactBody` (exactly one of postId, replyId), 30 a minute | `WallReactResult` (the same reaction again takes it back) | `toggleWallReaction` |
| built | `POST /wall/reports` | `WallReportBody`, 10 a minute | `{ reported: true }` | `reportWall` |

### 2.11 Practise: games and practice rounds

This section is continued (and kept current) in `docs/app/API_CONTRACT_PRACTISE_ADMIN.md`, with its types in `src/lib/app-api/contract-practise-admin.ts`. Where the two disagree, that page wins. Everything below still works.

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `POST /play/:game/:action` | student, the game's own gate (below); moves 240 a minute | `PlayBody` (`{ args: [...] }`, at most the action's argument count, 128 KB) | `PlayResult` (`{ kind: "<game>.<action>", v: 1, data }`) | the website's own server action for that move (`PLAY` in `src/lib/app-api/play.ts`) |

Every move is dealt, checked and scored on the server by the website's existing code: signed run tokens, server-held answer keys, XP caps, answer history. The app sends exactly what the website's page sends to that action, and draws `data`, which is the same object the website's game screen draws. The app never grades and never sends a score. An action that answers `{ ok: false, error }` (or `{ error }`) becomes an error answer: 401 `unauthenticated` for "sign in again", 403 `forbidden` for "not open to you", otherwise 400 `bad_request` with the website's own words.

Each `kind`, its arguments, and the type of `data` (defined in the named file; the app copies these types next to `contract.ts`):

| `kind` | `args` | `data` type (file) | Gate |
|---|---|---|---|
| `blitz.start` | none | `StartResult` (`src/lib/games/blitz/server.ts`) | `/games/blitz`, flag `learn` |
| `blitz.answer` | `token, n, choice` | `AnswerResult` (same) | same |
| `blitz.finish` | `token` | `FinishResult` (same) | same |
| `sort.load` | `{ mode, tier, boardId? }` | `{ ok, view: SortView }` (`src/app/(dashboard)/games/sort/actions.ts`) | `/games/sort`, `learn` |
| `sort.check` | `{ mode, tier, boardId, placement, picks, tries }` | `CheckResult` (same) | same |
| `rx.deal` | `mode` | `RxDeal` (`src/app/(dashboard)/games/rx/actions.ts`) | `/games/rx`, `learn` |
| `rx.pick` | `{ token, value }` | `RxPick` (same) | same |
| `rx.finish` | `token` | `{ ok, xp }` | same |
| `mse.deal` | `level` | `MseDeal` (`src/app/(dashboard)/games/mse/actions.ts`) | `/games/mse`, `learn` |
| `mse.tag` | `{ token, domain, term }` | `MseTag` (same) | same |
| `ward.start` | `campaign` | `WardSolo` (`src/app/(dashboard)/games/ward/actions.ts`) | `/games/ward`, `learn` |
| `ward.resume` | `{ token?, campaign?, choices? }` | `WardSolo` | same |
| `ward.pick` | `{ token, option }` | `WardSolo` | same |
| `escape.start` | `room` | `PracticeResult` (`src/app/(dashboard)/games/escape/actions.ts`) | `/games/escape`, `learn` |
| `escape.resume` | `token` | `PracticeResult` | same |
| `escape.answer` | `{ token, stage, answer }` | `PracticeResult` | same |
| `detective.deal` | `family, seen` | `DealResult` (`src/app/(dashboard)/practice/detective/actions.ts`) | `/practice/detective`, `learn` |
| `detective.clue` | `token, round, n` | `{ ok, clue }` | same |
| `detective.clues` | `token, round` | `{ ok, clues }` | same |
| `detective.guess` | `token, round, guess, final` | `{ ok, right, answer }` | same |
| `daily.rest` | `{ mode, caseId?, log? }` | `{ ok, rest: CaseRest }` (`src/lib/games/daily/view.ts`) | `/practice/daily`, `learn` |
| `daily.move` | `{ mode, caseId?, log?, action? }` | `MoveResult` (same) | same |
| `daily.next` | `localHistory, current?` | `{ ok, caseId, target, recycled }` | same |
| `prep.check` | `{ id, choice, ms? }` | `PrepReveal & { correct }` (`src/lib/prep/view.ts`) | `/prep`, `learn` |
| `prep.reveal` | `qid` | `PrepReveal` | same |
| `prep.save` | `{ id, saved }` | `{ ok }` | same |
| `prep.mockStart` | `specId` | `MockPaperView` | same |
| `prep.mockSubmit` | the website's submit input | `MockResultView` (`src/lib/prep/results.ts`) | same |
| `prep.interviewReveal` | `qid` | `{ modelAnswer, mustCover, redFlags }` or `{ error }` | same |
| `prep.interviewFeedback` | `{ id, answer }` | `{ text }` or `{ error }` (AI; short answers and too many asks get a plain line) | same |
| `prep.interviewSave` | `{ items: [{ id, answer, covered, flags, feedback }] }` | `{ saved, score }` | same |
| `cases.progress` | `tool` | `ProgressSnapshot` (`src/lib/cases/progress-server.ts`): Done and New per case | `/practice`, `learn` |
| `cases.mark` | `tool, item, state` | `{ ok }` | same |

Planned (not built): the first screen of each game (the lists the website's page builds before the first move: boards, campaigns, rooms, case families, Exam Prep sets, the case library with Done and New), team modes (ward and escape teams, duels: these need live updates), comorbid (its rounds are dealt in the browser today, so it needs a server deal first), the Exam Prep long answers and interview practice, leaderboard and shop. Until then the app shows those games as "Open on the website".

### 2.12 Library

This section is continued (and kept current) in `docs/app/API_CONTRACT_PRACTISE_ADMIN.md`, with its types in `src/lib/app-api/contract-practise-admin.ts`. Where the two disagree, that page wins. Everything below still works.

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `GET /library/medicines` | student (`/practice/medicines`) | none | `MedicineList` | `MEDS`, `GROUPS`, `medIndex` (`src/lib/meds`) |
| built | `GET /library/medicines/:medId` | student (`/practice/medicines`) | none | `MedicinePage` | `medById`, `mechanismOf`, `medVisuals`, `halfLifeOf`, `medicineStudyLink` (`src/lib/meds/study-access.ts`, moved out of the medicine page) |
| planned | `GET /library/terms`, `GET /library/cases` | student | | | the glossary and the case library |

The medicine data is all medicine facts in the website's own shape (`Med`, `src/lib/meds/types.ts`). The app searches it on the phone (the same rule as `searchMeds`).

### 2.13 Admin

This section is continued (and kept current) in `docs/app/API_CONTRACT_PRACTISE_ADMIN.md`, with its types in `src/lib/app-api/contract-practise-admin.ts`. Where the two disagree, that page wins. Everything below still works.

Auth: **admin** means `admin` or `view_admin` (read); **super admin** means `admin` only (every write), the same split as the website (`requireAdmin`, `requireSuperAdmin`). Test and robot accounts are left out of every list, as on the website's admin pages.

| Status | Method and path | Auth | Request | Response | Calls |
|---|---|---|---|---|---|
| built | `GET /admin/home` | admin | none | `AdminHome` | `adminHome` (`src/lib/app-api/admin.ts`): `loadRoster`, `loadHiddenIds`, `loadLive`, `openComplaintCount` |
| built | `GET /admin/students` | admin | `?search&cohort&flag&limit&cursor` (default 50, max 200) | `AdminStudentList` | `loadRoster` rows, `filterStudents` |
| built | `GET /admin/students/:id` | admin | none | `AdminStudentProfile` | the roster row and `loadStudentDetail` (`src/lib/analytics/activity.ts`) |
| built | `POST /admin/students/:id/lock` | super admin, 60 a minute | `LockBody` | `LockResult` | `setAccountStatus(id, "blocked", reason)` (`src/app/(dashboard)/admin/students/actions.ts`) |
| built | `POST /admin/students/:id/unlock` | super admin, 60 a minute | none | `LockResult` | `setAccountStatus(id, "active")` |
| built | `GET /admin/activity` | admin | none | `PlayResult` with `kind: "admin.activity"`; `data` is `loadActivity()`'s answer plus `live` | `loadActivity`, `loadLive` |
| built | `GET /admin/messages` | admin | none | `MessageBatches` | `loadNotifyBatches` |
| built | `POST /admin/messages` | super admin, 10 a minute | `SendMessageBody` | `SendMessageResult` | `sendNotifications` (bell row, phone push, optional email through the paced sender) |
| built | `GET /admin/doubts` | admin | `?cohort&kind&limit&cursor` | `DoubtList` | `loadDoubts` as admin |
| built | `POST /admin/doubts/:id/hide` | super admin | `HideBody` | `{ hidden }` | `adminHideDoubt` |
| built | `POST /admin/devices/allow-change` | super admin | `AllowDeviceChangeBody` | `AllowDeviceChangeResult` | `allowDeviceChange` (section 2.2) |
| planned | `POST /admin/students/:id/login-link` | super admin | | | `issueSetupLink` (the website's login link panel mixes it with page code; needs extracting first) |
| planned | `GET /admin/inbox`, replies | admin | | | the enquiries inbox |
| planned | doubt answers as the team, review queues (`needsReview`) | admin | | | |
| planned | certificate studio actions (issue, revoke, re-send) | super admin | | | `src/lib/certificates/server.ts` |

Answers to doubts by the admin use the student route `POST /doubts/:id/replies` (it is open to admins).

### 2.14 Later phases

Phase 6 (iPhone) needs no new routes.

Clinic routes (schedule, QR attendance, leave, OPD cases): see `API_CONTRACT_CLINIC.md`.

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

How often each scene kind appears in the course today (count of `:::widget` in `src/content/study`, 15 Nov), to pick which to rebuild first: brainmap 65, journey 51, receptor 45, conditioning 21, release 19, pathways 14, neuron 13, hypnogram 10, stress 7, memoryflow 6, strange 5, illusion 5, nervoussystem 4, brainexplorer 4, hpaloop 3, dissonance 3, conservation 3, brainslicer 3, genogram 2, attention 2, actionpotential 2, synapse3d 1, amesroom 1. (The data-complete kinds: flow 482, sort 454, decide 420, figure 337, guess 236, compare 186, worked 132, layers 125, reveal 92, timeline 83, curve 81, build 25, moodline 18, synapse 17, experiment 12, thoughtrecord 10.)

The file references above are where each widget is drawn on the website today; `src/components/study/widgets.tsx` holds the switch from `kind` to component. An unknown `kind` or a higher `v` than the app knows must be drawn as a plain "Open on the website" row, never crash.

### 3.4 Figures

`GET /study/figures/:id` answers a `Figure`: `viewBox`, `labels` (each with the point it names and a line about it), and the drawing as two standalone SVG documents (light and dark, colours already filled in, no stylesheet needed) for `react-native-svg`. Shapes carry `data-part="<label id>"` and lines `data-line="<label id>"`. `FigureData.focus` lists the labels to highlight; `quiz: true` hides the label names to test recall.

### 3.5 Messages

Notification bodies are sent as `MessageBlock[]` (paragraphs, headings, lists, with bold, italic and links), never HTML.

## 4. Database steps for the owner

| File | What it adds | Before it is run |
|---|---|---|
| `supabase/migrations_pending/2026_11_15_app_deletion_requests.sql` | `app_deletion_requests` (account deletion requests from the app) | Requests still reach the super admin as a bell notice and push; only the stored list is missing |
| `supabase/migrations_pending/2026_11_15_app_devices.sql` | `app_devices` (one row per phone), `app_device_changes` (the phone-change log and admin allowances), `app_notification_prefs` | Everything works; the one-phone rule and the change limit are not enforced, push is not sent, preferences stay on the phone |
| `supabase/migrations_pending/2026_11_16_clinic.sql` | The clinic tables: timetable, sessions, QR secrets, attendance, leave, OPD settings, batches, case quotas, OPD days, case logs (routes in `API_CONTRACT_CLINIC.md`) | Every `/clinic/**` route answers 503 `unavailable` |

## 5. Change rules

- Adding a field or a route is not a breaking change. The app must ignore fields it does not know.
- Removing or renaming a field, or changing a type, needs `/api/app/v2`, or a raised `minSupportedVersion`.
- Every change to a route lands in the same commit as the change to `contract.ts` and to this page.
- `src/app/api/app/v1/route-sweep.test.ts` reads every request in apps/mobile and fails when one has no route, a missing method, a query key the route ignores or a body key its schema does not know. A call the app makes before its route exists goes in `PENDING` in `src/lib/app-api/route-sweep.ts`; a path built in a variable goes in `DYNAMIC` there.
- If the app ever gets an answer that is not JSON (an HTML page from a proxy, a 405 for a missing method), it shows a plain line saying so, not "check your internet".
