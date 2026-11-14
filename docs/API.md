# API reference

Every route handler (`route.ts`, 85 files) and every Server Action file (`"use server"`, 54 files) in the app, checked against commit `e4cb5ef0` on 2026-11-14.

How to read the auth column:

- **public**: no login.
- **session**: `getSession()` or `requireSession()`; any signed-in, active, not expired account on its current device.
- **student API**: `requireStudentApi()` in `src/lib/auth/api-guard.ts`. Session, no cross-site calls, lectures-only accounts refused, access blocks and the named feature flag checked. Failures: 401 signed out, 403 blocked, scope, flag or cross-site.
- **admin (read)**: `requireAdmin()`; super admin or view admin.
- **super admin**: `requireSuperAdmin()`; the one `admin` account.
- **cron**: `Authorization: Bearer $CRON_SECRET`. 401 when the secret is unset or wrong.
- **RL**: rate limited (DB limiter or per-server limiter, see `docs/architecture/BACKEND.md`).

All bodies are JSON unless noted. Inputs are checked with `zod`; a bad body returns 400.

## Route handlers

### Saving and tracking (students)

| Route | Method | Auth | Input | Output |
|---|---|---|---|---|
| `/api/save` | POST | session, RL 240/min | `{ owner, items: [{ id, kind: progress\|complete\|learn\|history\|events, payload }] }`, max 25 items, 256 KB | `{ results: [{ id, status: ok\|retry\|drop, data? }] }`. 401 signed out, 403 paused, 409 other account, 413 too large, 429 |
| `/api/visit` | POST | session (students only, others get 204) | `{ path, enteredAt, seconds }` (one slice of time on a page, at most 1,800 s) | 204 |
| `/api/learn/events` | POST | session (students and alumni, others 204) | Batch of learning events (`learnEventsSchema` in `src/lib/learn/events-store.ts`) | `{ ok }` |
| `/api/practice/quiz/attempt` | POST | student API, RL | `{ itemId, chosen, correct }` | `{ ok }` (failures are silent) |

### Video and files

| Route | Method | Auth | Input | Output |
|---|---|---|---|---|
| `/api/media/playback` | POST | session, same origin, RL 60/min per user and 120/min per IP, enrolment check | `{ lessonId }` | `{ token, streamUrl, mediaType: hls\|mp4, expiresIn: 300, resumeSeconds }`. 401, 403, 404, 429 |
| `/api/media/stream/:lessonId/...` | GET | stream token `?st=` plus session cookie, enrolment (cached per token), RL | Path: `master.m3u8`, variant playlists, `*.ts` chunks, `__key__`, or the MP4 itself (Range supported) | Rewritten playlist, AES-128 encrypted chunk, 16 byte key, or MP4 bytes |
| `/api/media/materials/:materialId` | GET, HEAD | session, same origin, RL, enrolment | none | The file, streamed |
| `/api/media/submissions/:fileId` | GET | session, same origin, owner only | none | The student's own file |
| `/api/practice/passport/pdf` | GET | student API (`skills_passport`) | none | PDF of the student's Skills Passport |

### Admin

| Route | Method | Auth | Input | Output |
|---|---|---|---|---|
| `/api/admin/flags` | POST | super admin | `{ key, status: off\|live\|unlocked }` | `{ ok }` |
| `/api/admin/modules` | POST | super admin | `{ action: publish\|schedule\|unpublish\|grant_cohort\|revoke, ... }` (module ids, cohort or student scope, release time) | `{ ok, ... }` |
| `/api/admin/nudge` | POST | super admin | `{ email, message? }` | `{ ok }` or `email-not-configured` |
| `/api/admin/nudge/bulk` | POST | super admin, 5 per 10 min | `{ userIds, subject, message }` | Counts sent and failed |
| `/api/admin/cards` | GET, POST, PATCH, DELETE | GET admin (read), others super admin | Card fields; PATCH can move a card up or down | Cards list or `{ ok }` |
| `/api/admin/idioms` | GET, PATCH, DELETE | GET admin, others super admin | PATCH `{ id, approved?, ... }`, DELETE `?id=` | Idiom list or `{ ok }` |
| `/api/admin/calibration` | POST | super admin | `{ dimension, ... }` calibration pair | `{ ok }` |
| `/api/admin/sim-corrections` | POST | super admin | `{ sessionId, comment, scoreChange? }` | `{ ok }` |
| `/api/admin/supervision-signoff` | POST | super admin | `{ entryId, decision }` | `{ ok }` |
| `/api/admin/wall-reports` | POST | super admin | `{ reportId, status }` | `{ ok }` |
| `/api/practice/wall/pin` | POST | super admin | `{ postId, pinned }` | `{ ok }` |
| `/api/admin/forms/:id/csv` | GET | admin (read) | none | CSV of every answer to one form |
| `/api/admin/learning/csv` | GET | admin (read) | none | CSV of self-study per student |
| `/api/cohort-calendar` | GET | admin (read) | `?startDate&startTime&weekdays&weeks&title` | `.ics` file |
| `/api/emails/seed` | POST | super admin | `{ templateId, ... }` | `{ subject, html }` for the compose editor |
| `/api/sim/health` | GET | admin (read) | none | One probe per configured AI provider with a fix hint |
| `/api/practice/corpus/dictate`, `/dictate/turn`, `/dictate/complete` | POST | session, then `role = 'admin'` check | Dictation text or session id | Next interviewer question, or a draft `sim_cases` row |

### Medicines (psychopharm)

| Route | Method | Auth | Input | Output |
|---|---|---|---|---|
| `/api/psychopharm/search` | GET | session | `?q=` | Matching generic names (from the reviewed static store) |
| `/api/psychopharm/bands` | GET | session | `?drug=` | Dose bands |
| `/api/psychopharm/document` | GET, PUT | session; PUT needs editor or reviewer (policy) | GET `?drug=`; PUT the document fields | Document (students see published only) |
| `/api/psychopharm/document/history` | GET | session, editor or reviewer | `?drug=` | Versions |
| `/api/psychopharm/document/history/rollback` | POST | session, editor or reviewer | `{ drug_id, version }` | New version |
| `/api/psychopharm/document/publish` | POST | session, admin or reviewer (enforced by `publish_medication_document`) | `{ drug, reason }` | `{ ok }` or the validation errors |
| `/api/psychopharm/review` | POST | session, reviewer | Review action on a field | `{ ok }` |

### Practice layer (most flags are off, see `docs/FEATURES_STATUS.md`)

All are student API with a feature flag and RL unless noted. Each one saves or reads the caller's own rows (row level security also enforces it).

| Route | Method | Flag | Does |
|---|---|---|---|
| `/api/practice/sim/session` | POST | `consulting_room` | Start a simulated patient session. `{ caseId }` to session and opening line |
| `/api/practice/sim/turn` | POST | `consulting_room` | One patient turn (AI). `{ sessionId, message }` to patient reply and state |
| `/api/practice/sim/grade`, `/sim/debrief` | POST | `consulting_room` | AI grading and debrief (no-train providers only) |
| `/api/practice/sim/rewind` | POST | `consulting_room` | Branch a session from an earlier turn |
| `/api/practice/chain` | POST | `consulting_room` | Next steps after a session |
| `/api/livekit/token` | POST | session (owns an active sim session) | LiveKit room token, 10 minutes |
| `/api/practice/voice/stt` | POST | `consulting_room`, `osce` or `knowledge_tutor` by page | Audio to text (Deepgram, Groq, NVIDIA, else 503) |
| `/api/practice/voice/synthesis` | POST | same as stt | Text to speech, cached in R2 |
| `/api/practice/mse/attempt`, `/mse/stimuli`, `/mse/transcripts` | POST, GET, GET | `mse` | MSE practice |
| `/api/practice/sct/attempt` | POST | `judgment` | Judgment call attempt |
| `/api/practice/osce/attempt` | POST | `osce` | OSCE self-assessment |
| `/api/practice/formulation/attempt`, `/formulation/wall` | POST, POST and GET | `formulation` | Formulation practice and peer wall |
| `/api/practice/rounds/review` | POST | `rounds` | Flashcard rating (FSRS on the server) |
| `/api/practice/idioms` | GET | `decoder` | Approved idioms |
| `/api/practice/journal`, `/journal/help`, `/journal/share` | POST; POST; POST, DELETE | `journal` | Journal, AI help (no-train only), share with faculty |
| `/api/practice/checkin` | POST | `checkin` | Weekly check-in |
| `/api/practice/clinic/complete` | POST | `two_minute_clinic` | Daily streak mark |
| `/api/practice/competency` | POST | `skills_passport` | Competency event |
| `/api/practice/supervision`, `/supervision/signoff` | POST | `supervision` | Log hours, ask for sign-off |
| `/api/practice/roleplay/session`, `/message`, `/messages` | POST, POST, GET | `peer_roleplay` | Peer role-play |
| `/api/practice/library/note` | POST, GET | `case_library` | Notes on corpus documents |
| `/api/practice/wall`, `/wall/reply`, `/wall/reaction`, `/wall/report` | POST | none (student API) | Case wall |
| `/api/knowledge/ask`, `/knowledge/search`, `/knowledge/concepts` | POST, GET, GET | `knowledge_tutor` | Knowledge tutor (AI, 30 asks a minute) |

### Games

| Route | Method | Auth | Input | Output |
|---|---|---|---|---|
| `/games/duel/live` | POST | `currentPlayer()` (session and full scope), per-server RL | `{ op: join\|queue\|leave\|bot\|poll\|answer\|quit, matchId?, round?, dx?, feature? }` | Duel state. Polled about once a second by each player |

Other games use Server Actions (below).

### Crons, webhooks, health and discovery

| Route | Method | Auth | Does |
|---|---|---|---|
| `/api/cron/standing` | GET | cron | Leagues, points, standing notes |
| `/api/cron/monthly` | GET | cron | Monthly certificates and champion titles |
| `/api/cron/doubt-followup` | GET | cron | Doubt answer notices and one follow-up email |
| `/api/internal/cron?task=` | GET | cron | `keepalive`, `prune-logs`, `infra-snapshot`, `alumni-transition`, `release-scheduled`, `send-reminders` (returns `not_configured`) |
| `/api/emails/resend` | POST | Svix signature with `RESEND_WEBHOOK_SECRET` | Delivery events update `email_sends`; inbound replies go to `email_inbound` |
| `/api/health` | GET | public | `{ status, database, storage }` with no secrets |
| `/go/home` | GET | session optional | Redirect: admins to `/admin`, students to `/dashboard`, others to `/` |
| `/.well-known/api-catalog`, `/.well-known/agent-card.json`, `/.well-known/oauth-protected-resource`, `/openapi.json`, `/auth.md` | GET | public | Machine-readable discovery documents. `/openapi.json` describes only the public surface |

## Server Actions

Server Actions are called from forms and buttons inside the app, not by URL. Their ids change on every deploy. A native app cannot call them (see `docs/NATIVE_APP_READINESS.md`).

### Public pages

| File | Actions | Auth |
|---|---|---|
| `src/lib/auth/actions.ts` | `login`, `logout` | public, RL (see `docs/architecture/AUTH.md`) |
| `src/app/setup/actions.ts` | `completeSetup` | setup token, RL 20/min per IP |
| `src/app/waitlist/actions.ts` | `submitWaitlist` | public, RL 5/min per IP |
| `src/app/f/[slug]/actions.ts` | `submitLinkForm` | public, RL 150/min per IP and 5 per 10 min per email |

### Students (session; full scope where it is a full-access feature)

| File | Actions |
|---|---|
| `(dashboard)/courses/[courseId]/lessons/[lessonId]/actions.ts` | `pingProgress`, `markLessonComplete`, `completeAndAdvance`, `submitTextAssignment`, `prepareSubmissionUpload`, `submitWithFiles`, `unsubmitAssignment`, `submitAudioAssignment`, `getSubmissionAudioUrl` |
| `(dashboard)/courses/[courseId]/lessons/[lessonId]/attention-actions.ts` | `recordAttentionCheck` |
| `(dashboard)/dashboard/actions.ts` | `saveMobileNumber`, `skipMobileNumber` |
| `(dashboard)/details-actions.ts` | `checkMyDetails`, `submitMyDetails` |
| `(dashboard)/doubts/actions.ts` | `askDoubt`, `replyToDoubt`, `voteReply`, `markSolved`, `reclassifyMine`; admin only: `adminHideDoubt`, `adminHideReply` |
| `(dashboard)/notifications/actions.ts` | `markAllNotificationsRead` |
| `(dashboard)/achievements/actions.ts` | `loadMyAchievements`, `downloadMyCertificate` |
| `(dashboard)/leaderboard/actions.ts` | `saveAlias`, `buyItem`, `wearLook` |
| `(dashboard)/study/actions.ts` | `loadLearnState`, `saveLearnState`, `submitModuleTest` (graded on the server) |
| `(dashboard)/study/map/actions.ts` | `answerPractice` |
| `(dashboard)/study/placement/actions.ts` | `submitPlacement` |
| `(dashboard)/prep/actions.ts` | `checkAnswer`, `revealAnswer`, `toggleSaved`, `startMock`, `submitMock`, `revealInterview`, `interviewFeedback`, `saveInterviewSession` |
| `(dashboard)/prep/long/actions.ts` | `longCardsFor` |
| `(dashboard)/practice/daily/actions.ts` | `dailyRest`, `dailyMove`, `nextPractice`, `nextAiCase`, `flagAiCaseAction` |
| `(dashboard)/practice/detective/actions.ts` | `dealDetective`, `detectiveClue`, `detectiveAllClues`, `detectiveGuess` |
| `(dashboard)/games/blitz/actions.ts` | `startBlitz`, `answerBlitz`, `finishBlitz` |
| `(dashboard)/games/sort/actions.ts` | `loadSort`, `checkSort` |
| `(dashboard)/games/escape/actions.ts` | `escapeView`, `createEscapeTeam`, `joinEscapeTeam`, `startEscapeTeam`, `answerEscape`, `gradeEscapePractice`, `finishEscapePractice` |
| `(dashboard)/games/ward/actions.ts` | `finishWardSolo`, `wardTeamView`, `createWardTeam`, `joinWardTeam`, `castWardVote` |
| `(dashboard)/games/rx/actions.ts` | `gradeRxAnswer`, `finishRxRun` |
| `(dashboard)/games/mse/actions.ts` | `submitMseExcerpt` |
| `(dashboard)/games/comorbid/actions.ts` | `finishComorbid` |
| `src/lib/history/actions.ts` | `loadMyHistory`, `recordMyAnswers` |
| `src/lib/hints/actions.ts` | `getHintStatus`, `buyHintsAction`, `askHint` |
| `src/lib/tips/actions.ts` | `loadTips`, `saveTips` |
| `src/lib/study/marks-actions.ts` | `pullMarks`, `pushMarks` |

Game actions resolve the player with `currentPlayer()` (`src/lib/games/server.ts`) or `currentUser()` (`src/lib/games-sims/server/results.ts`), which run `getSession()` and the scope check.

### Admins (every write needs super admin; loaders accept view admin)

| File | Actions |
|---|---|
| `admin/students/actions.ts` | `createStudent`, `deleteStudent`, `resetStudentPassword`, `setAccountStatus`, `setAllStudentsStatus` |
| `admin/students/bulk-import.ts` | `bulkImportStudents`, `previewRosterCsv`, `confirmBulkImport`, `sendCredentialEmailsAction`, `sendTestEmailAction`, `resetCredentialAction` |
| `admin/students/certificate-action.ts` | `issueCertificate` (older path: prints the email as the name) |
| `admin/cohorts/actions.ts` | `createCohort`, `updateCohort`, `addPeopleToCohort`, `addPeopleFromPaste`, `sendLoginLink`, `removeFromCohort`, `setPersonCohorts`, `setPersonScope`, `setCohortLessons`, `setPersonLesson`, `reopenDetails` |
| `admin/courses/actions.ts` | `createCourse`, `setCoursePublished`, `deleteCourse`, `renameCourse` |
| `admin/courses/[courseId]/actions.ts` | `enrollStudent`, `enrollStudents`, `unenrollStudent`, `prepareVideoUpload`, `createLessonWithVideo`, `attachVideoToLesson`, `deleteLesson`, `setLessonStatus`, `updateLesson`, `setAssignmentPublished`, `moveLesson`, `loadRoster` |
| `admin/courses/[courseId]/assignment-actions.ts` | `createAssignment`, `saveAssignment`, `autosaveAssignment`, `setAssignmentPublished`, `deleteAssignment` |
| `admin/courses/[courseId]/materials-actions.ts` | `prepareMaterialUpload`, `confirmMaterialUpload`, `deleteMaterial`, `renameMaterial`, `reorderMaterials`, `replaceMaterialFile`, `restoreMaterialPath`, `confirmMaterialReplace`, `createLinkMaterial` |
| `admin/courses/[courseId]/people-actions.ts` | `loadCoursePeople`, `addToCourse`, `removeFromCourse`, `changeCohortMembership`, `newCohortForCourse` |
| `admin/access/actions.ts` | `setScopeFor`, `setFeatureFor`, `resetFor` |
| `admin/achievements/actions.ts` | `listAchievements`, `saveAchievement`, `setAchievementEnabled`, `awardAllBadges`, `listCredentials`, `listCertificateEligible`, `createCertificateDraft`, `issueCertificate`, `revokeCredential`, `saveSignatureAsset`, `getCredentialDownload` |
| `admin/credentials/actions.ts` | `issueCustomCertificate`, `previewCustomCertificate`, `issueCertificateToAnyone`, `previewCertificateToAnyone` |
| `admin/emails/actions.ts` | `loadRecipientData`, `sendCampaignEmail`, `sendTestCampaignEmail`, `retryFailedCredentialSends` |
| `admin/emails/mail-actions.ts` | `replyToInbound`, `setArchived`, `markRead`, `clearFailed` |
| `admin/emails/notify-actions.ts` | `sendNotificationAction` |
| `admin/emails/retry-actions.ts` | `retryFailedEmails` |
| `admin/inbox/actions.ts` | `replyFromInbox`, `replyEmailFromInbox`, `draftDoubtAnswer` (AI draft, RL) |
| `admin/forms/actions.ts` | `createForm`, `updateForm`, `setFormOpen`, `duplicateForm`, `removeForm` |
| `admin/people/actions.ts` | `setStage`, `setFollowUp`, `logActivity`, `convertToStudent` |
| `admin/management/actions.ts` | `listAdmins`, `addAdmin`, `setAdminRole`, `removeAdmin`, `resendAdminInvite` |
| `admin/submissions/actions.ts` | `approveSubmission`, `getSubmissionAudioUrl`, `returnFeedback`, `getSubmissionFileUrl` |
| `admin/tools/master-actions.ts` | `setMasterPassword`, `setMasterEnabled` |
| `admin/ai-cases/actions.ts` | `setAiCaseStatusAction` |
| `(dashboard)/view-mode-actions.ts` | `setViewMode` (admin view or student view cookie) |

Paths above are under `src/app/`. Return shape for most actions: `{ ok: true, ... }` or `{ error: string }`, or a `useActionState` state object.
