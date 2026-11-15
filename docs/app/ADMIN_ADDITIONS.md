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
