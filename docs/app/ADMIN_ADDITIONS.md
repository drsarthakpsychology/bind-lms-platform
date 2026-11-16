# Admin additions (15 November 2026)

For the mobile app agents. What the admin website can now do in Certificates,
Forms and People, and the server functions each screen calls. All of these are
Next.js Server Actions (or pure helpers they use). Every action that writes
checks for the Super Admin itself; a view-only admin gets an error string and
nothing is written. None of them are HTTP routes yet: an app endpoint should
call the same `src/lib` helper, not copy the logic.

## Certificates (one area: Issue, Issued, Types, Settings)

Old addresses redirect: `/admin/credentials` (Find & issue, `?student=`,
`?q=`, `?mode=anyone`) and `/admin/achievements` (Badges & certificate types).

| Capability | Screen | Server function | Helper it uses |
| --- | --- | --- | --- |
| Issue a certificate to one, several or a whole cohort (completion, provisional, special recognition, custom), with up to 3 signatories, expiry, course and module lines | Issue, Certificate | `issueStudioCertificates(input, replaces?)` in `admin/credentials/studio/actions.ts` | `issueCertificates` in `src/lib/certificates/issue.ts` |
| Correct a name and reissue (new id, old one revoked and points to the new) | Issued, row menu, Correct and reissue | `issueStudioCertificates(input, replaces)` | same |
| Give a badge by hand to one or many (already-holders skipped) | Issue, Badge | `awardBadge(achievementId, userIds)` in `admin/credentials/actions.ts` | `awardBadgeManually` in `src/lib/achievements/manual-award.ts` |
| Give every earned badge now | Issue, Badge | `awardAllBadges()` in `admin/achievements/actions.ts` | `src/lib/achievements` |
| Certificate for someone without an account, with PDF preview | Issue, No account | `previewCertificateToAnyone`, `issueCertificateToAnyone` | `src/lib/achievements/pdf.ts` |
| One list of every certificate and badge, filters by type, status, cohort, search | Issued | (page loader) | `filterIssued`, `countByType` in `src/lib/certificates/issued.ts` |
| Revoke with a reason (certificates and badges) | Issued, row menu | `revokeStudioCertificate(credentialId, reason)` | `revokeCertificate` in `src/lib/certificates/issue.ts` |
| Send again (bell notice, and email within the daily limit) | Issued, row menu | `resendStudioCertificate(credentialId, alsoEmail)` | `resendCertificate` |
| Send waiting certificate emails | Issued and Settings | `sendWaitingCertificateEmails()` | `drainEmailQueue` in `src/lib/certificates/server.ts` |
| Issue a course certificate draft | Issued, row menu | `issueCertificate(credentialId)` in `admin/achievements/actions.ts` | |
| Download the PDF | Issued | `GET /api/certificates/<id>/pdf` | `src/lib/certificates/pdf.ts` |
| Verify | public | `/verify/<id>` | `certStatus` in `src/lib/certificates/kinds.ts` |
| Badge and certificate types, their rules, on/off, course certificate drafts | Types | `listAchievements`, `saveAchievement`, `setAchievementEnabled`, `listCertificateEligible`, `createCertificateDraft`, `saveSignatureAsset` | |
| Default signatories (up to 3) | Settings | `saveDefaultSignatories(list)` in `admin/credentials/settings/actions.ts` | `cleanDefaultSignatories` in `src/lib/certificates/defaults.ts` (stored in `admin_settings`, key in `SIGNATORIES_KEY`) |
| Upload a signature image | Settings | `uploadSignatureImage(label, dataUrl)` | `saveSignatureAsset` |
| Monthly merit certificates | automatic, 1st of the month | `/api/cron/monthly` | `src/lib/achievements/merit.ts` (unchanged) |

## Forms: email the people who filled a form

| Capability | Screen | Server function | Helper |
| --- | --- | --- | --- |
| Email everyone, a picked few, or one person who answered a form; subject and body with `{first_name}`, `{name}`, `{email}`, `{form}`; a preview per person; shows how many go now and how many wait | Forms list (Email everyone), a form's answers (pick, Email, or the per-row Email) | `emailFormRespondents({ formId, submissionIds: string[] \| "all", subject, body })` in `admin/forms/email-actions.ts` | `sendPersonalEmails` in `src/lib/email/personal.ts`; merge and plan in `src/lib/email/personal-plan.ts` |
| Send this form's waiting emails | the answers page | `sendWaitingFormEmails(formId)` | `sendWaitingPersonal` |
| Who was emailed from a form (Emailed column and filter) | the answers page | (page loader) | `loadFormEmailed` in `src/lib/forms/emailed.ts` (reads `email_sends` with template id `form:<formId>`) |

Addresses come from the saved answers on the server, never from the caller.
Duplicates are emailed once. What is over today's allowance
(`RESEND_DAILY_LIMIT`, default 100) is saved in `email_sends` with status
`pending`, already merged, and goes out from "Send waiting emails".

## People: Pipeline, Enquiries, person record

| Capability | Screen | Server function | Helper |
| --- | --- | --- | --- |
| Quick views with counts: Not paid yet, Invited not joined, Enquired not converted, Went quiet (no contact in 7, 14 or 30 days), Joined | Pipeline, Enquiries | (page loader) | `inView`, `viewCounts`, `filterPipeline` in `src/lib/crm/views.ts` |
| Filters: stage, cohort, source, first-seen date range, last contact; search name, email, phone, college | Pipeline, Enquiries | (page loader) | `matchesFilters` in `src/lib/crm/views.ts` |
| Everyone with paid date, amount, cohorts, college, latest enquiry message | all three | (page loader) | `loadPipeline(admin)` in `src/lib/crm/people.ts` (returns `{ people, paymentReady, cohorts }`) |
| Mark paid (amount and note optional) or not paid | row menu, person record | `markPaid(email, paid, amount?, note?)` in `admin/people/actions.ts` | needs `2026_11_15_people_payment.sql`; before that returns `missingStep: true` and writes nothing |
| Send the login invite (makes the account first for an enquiry) | row menu, person record | `sendInvite(email, name)` | `sendCredentialEmails` in `src/lib/auth/roster.ts` |
| Email one person or a picked group | row Email, action bar, person record | `emailPeople({ emails, subject, body })` | `sendPersonalEmails` (template id `pipeline`); only addresses in the pipeline are emailed |
| Send waiting pipeline emails | Pipeline | `sendWaitingPeopleEmails()` | `sendWaitingPersonal(["pipeline"])` |
| WhatsApp one person, or links for a picked group with `{first_name}` filled | row, action bar, person record | `logWhatsApp(emails, text)` logs the contact | `waLink`, `waMessage` in `src/lib/crm/views.ts` |
| Add a note, move stage, follow-up | row menu, person record | `logActivity(email, "note", text)`, `setStage(email, stage)`, `setFollowUp(email, date)` | unchanged |

The view and filters live in the address (`?view=not_paid&cohort=<id>&quiet=30&stage=fee_shared&source=instagram&from=2026-11-01&to=2026-11-15&last=never&q=...`), so a view can be shared.

---

# App admin: server routes still needed (agent appadmin, 15 November 2026)

For agent appapi2. The app's admin screens are built and run against the mock
server (`apps/mobile/src/admin/mock.ts`, which answers in the server's shapes).
Against the real server a missing route answers 404 and that screen shows
"Coming in the next update"; nothing crashes. The app reads every answer
through `apps/mobile/src/admin/safe.ts`, so missing or null fields are fine.
Types for the routes below are in `apps/mobile/src/admin/extra.ts`; change them
there or in `contract-practise-admin.ts` and the app follows.

Auth words as in part two of the contract: **admin** = admin or view_admin
(read), **super admin** = admin only (every write). Every read with buttons
should carry `canWrite`.

## Already used by the app (built, or in your working copy)

`GET /admin/home`, `GET /admin/students`, `GET /admin/students/:id`,
lock, unlock, login-link, `POST /admin/devices/allow-change`,
`GET /admin/activity?view=`, `GET/POST /admin/messages` (the app sends
`{ to: "students" | "cohort" | "everyone", toId?, userIds?, title, body, alsoEmail }`),
`GET /admin/inbox`, `POST /admin/inbox/emails/:id/reply`, `/read`,
`GET /admin/doubts`, `POST /admin/doubts/:id/reply`, `/draft`, `/hide`,
`GET /doubts/:id` (an admin reading any doubt, including private concerns),
`GET /admin/submissions`, approve, grade, files, audio,
`GET /admin/certificates/studio`, `POST /admin/certificates/preview`, `/issue` (with `replaces`),
`/:id/revoke`, `/:id/resend`.

From your working copy of `contract-practise-admin.ts` (please keep these exact paths):
`GET /admin/certificates/issued?q=&type=&status=&cohort=&student=`,
`POST /admin/certificates/:id/issue-draft`, `POST /admin/certificates/send-waiting`,
`GET /admin/certificates/:id/pdf` (answer `AdminFileLink`),
`GET /admin/badges`, `POST /admin/badges/:id/award`, `POST /admin/badges/award-all`,
`GET /admin/forms`, `GET /admin/forms/:id?emailed=yes|no`, `POST /admin/forms/:id/email`,
`POST /admin/forms/:id/email/preview`, `POST /admin/forms/:id/email/send-waiting`.

People is now built on admin-redesign (`GET /admin/people` with views and counts,
stage, follow-up, activity, invite, paid, email, WhatsApp, send-waiting) and the
app uses those routes. One small ask there: `GET /admin/people/:key` for a
person's page with the full timeline (until then the app builds the page from
the person's row).

## Still needed (all built on 16 November: see part two of the contract, section 4)

| Method and path | Auth | Body | Answer (`apps/mobile/src/admin/extra.ts`) | Website function to call |
|---|---|---|---|---|
| `GET /admin/cohorts` | admin | | `{ items: CohortRow[] }` | cohorts page loader. Until then the app uses the cohort cards on `GET /admin/home` |
| `GET /admin/cohorts/:id` | admin | | `CohortDetail` (row + `people`, `messages`, `hoursWeek`, `sessions`) | cohort page loader. Until then the app builds it from Home and `GET /admin/students?cohort=` |
| `GET /admin/certificates/settings` | admin | | `StudioSettings { signatories (up to 3), emailOnIssue, replyTo, emailReady }` | `loadDefaultSignatories` (`admin_settings`, `SIGNATORIES_KEY`) |
| `PUT /admin/certificates/settings` | super admin | `Partial<StudioSettings>` | `StudioSettings` | `saveDefaultSignatories(list)` |
| `GET /admin/certificates/studio` | (built) | | please add `signatories` (the saved defaults) so the studio fills them in | `cleanDefaultSignatories` |
| `GET /admin/system` | admin | | `SystemData { ready, canWrite, legacyKeyOn, maxLive: 10, keys: SupportKeyView[], usage: { label, value, pct }[] }` | `loadSupportKeys` (views only: no salt, no hash), master setting `enabled`, infra numbers |
| `POST /admin/system/support-keys` | super admin, 10 a minute | `{ label }` | `NewSupportKey { plain, last4 }` (plain shown once) | `createSupportKey(label)` |
| `POST /admin/system/support-keys/:id/rotate` | super admin | none | `NewSupportKey` | `rotateSupportKey(id)` |
| `POST /admin/system/support-keys/:id/revoke` | super admin | none | `{ revoked: true }` | `revokeSupportKey(id)` |
| `POST /admin/system/legacy-key/revoke` | super admin | none | `{ revoked: true }` | `revokeLegacyKey()` |
| `GET /admin/students/:id/messages` | admin | | `{ items: StudentMessage[] }` (title, at, opened, from) | the student page's Messages panel |
| `GET /admin/doubts?student=:id` | admin | | `DoubtList` | add a `student` filter to the built route |
| `GET /admin/review/signoffs`, `POST /admin/review/signoffs/:id` | admin / super admin | `SignOffBody { decision, note? }` | `SignOffList`, `SignOff` | supervision sign-off loader and action |
| `GET /admin/push-preferences`, `PUT` | admin (each admin's own) | `Partial<AdminPushPrefs>` | `AdminPushPrefs { newDoubt, newEnquiry, fallingBehind }` | new, one row per admin in `admin_settings` |
| push | | | `PushData` gains `admin: "new_doubt" \| "new_enquiry" \| "falling_behind"` and `id` | the app opens the doubt, the person, or the student (`apps/mobile/src/admin/push.ts`) |

Small asks on built routes:

- `AdminSubmission`: add `studentName` (the app looks names up from the Students list until then).
- `POST /admin/students/:id/login-link`: optionally answer `{ sent, url, expiresAt }` so an admin can paste the link into WhatsApp (the app already shows a Share button when `url` is there).
- `GET /admin/inbox`: emails have no thread; that is fine (the app shows the one email and the reply box).
