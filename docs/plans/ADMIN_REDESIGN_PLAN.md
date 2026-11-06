# Admin dashboard redesign — plan
> Status: **BUILT on branch `admin-redesign`** (2026-11-06) — VERIFIED in code, tests and screen checks; not merged to `main`. Items under §6 "Later" remain PROPOSED. Base: branch `testing` @ `036327f` + `main` @ `b2a9698` + `docs-ssot-architecture`. Work branch: `admin-redesign`. Nothing merges to `main` without the owner saying "merge".
> Source of requirements: the owner's dictation and prompt of 2026-11-06 (every point is listed in §9 so nothing is dropped).

## 1. What is there today (checked in code and in the live database, read-only)
- Admin sidebar has 6 places: **Home, Mail, Content, People, Review, System** (`src/components/navigation/nav-config.ts` → `ADMIN_SECTIONS`). People alone has 9 tabs.
- The live database already has everything from the `testing` branch: roll numbers (`profiles.roll_number`, `VIBHA-000123`), Achievements + Credentials, the student notifications table, Super Admin / View Admin roles, the admin audit log.
- 121 students, 16,179 page visits recorded (`page_visits`), lecture progress pinged every 10 s while a video plays (`video-player.tsx`).
- **Mail failures: 176 open.** 134 custom emails ("daily sending quota reached"), 39 nudges + 2 credential emails ("only 10 requests per second"), 1 credential email ("domain not verified"). All 134 custom ones still have their HTML stored, the 39 nudges have their text stored, so all can be re-sent safely.
- A "Retry failed credentials" button exists in code (`emails/retry-failed.tsx`) but is **not shown anywhere**. Custom emails sent now no longer save their HTML (`logEmailSend` writes only `body_text`), so they could not be retried.
- Student notifications only allow badge/certificate types (`notifications.type` check, `credential_id` required) — an admin message cannot be stored yet.

## 2. Problems found
| # | Problem | Where |
|---|---|---|
| P1 | Same job in many places: **add students** (Home → Cohorts, Students, Admin tools bulk import, Cohort "add people", Mail → Logins); **login/lock/link state** (Mail → Logins, Students, Cohort members, Pipeline "login not set up", Access page, per-person access page) | many |
| P2 | Students table scrolls sideways on laptops; roll number not shown in Cohorts, Pipeline, Activity, Mail | `students/student-directory.tsx` |
| P3 | Login words differ by screen ("Signed in", "Set up", "Not signed in", "No number", "Pending", "Locked") | as above |
| P4 | Activity is a ranking table; no "who is on right now / today", no cohort comparison, no per-student timeline of lecture start/finish, no proof a student is actually watching | `admin/activity` |
| P5 | Failed mail can only be cleared, not retried; sends burst past the 10/second limit | `emails/*`, `lib/nudge/send.ts`, `lib/auth/roster.ts` |
| P6 | Compose is HTML-code only | `emails/compose-tab.tsx` |
| P7 | Nudge = email only; no way to send an in-app notification | `lib/nudge`, `/notifications` |
| P8 | Student-only things in admin menu: Study cards (AI flash-card review queue for the Rounds tool), Check-ins (anonymous weekly wellbeing trends), "Ask your batch" form on Doubts | nav-config, `/doubts` |
| P9 | Cohort page = one long screen; cohort calendar hidden in Admin tools | `admin/cohorts/[id]` |
| P10 | Enquiries live separately from the Pipeline even though the Pipeline already has an "Enquiries" filter | `admin/enquiries`, `admin/people` |
| P11 | Certificates only from eligibility rules; no "type a name + text, issue, email it" | `admin/achievements` |
| P12 | Home is a list of 8 to-dos + 6 shortcuts, not cohort-aware; not tuned for phones | `admin/page.tsx` |

## 3. One home for every job (canonical locations)
| Job | The one place | Other places only link to it |
|---|---|---|
| Add students (one, many, CSV) + choose cohort + access | **Students → Add students** (one dialog, three ways) | Home, Cohort, Pipeline buttons open the same dialog |
| Account & login state | one helper `accountStatus()` → one chip everywhere: *No account · Invited · Link expired · Set up, never signed in · Active · Locked · Expired* | |
| Lock / unlock, new setup link, reset password, scope, sections on/off | **Student profile → Access & login** | bulk version stays at Students list (select → actions) |
| Credentials of a student | **Student profile → Credentials**, and **Credentials** page search by roll number | |
| Cohort membership & which lectures a cohort sees | **Cohort workspace** | |
| Messages to students (email or notification) | **Messages** | "Message" buttons pre-fill recipients |

## 4. New admin menu
| Sidebar | Tabs | Changes |
|---|---|---|
| **Home** | – | command centre (§5.1) |
| **Students** | All students · Access (bulk) | list without sideways scroll + profile page with tabs: Overview, Access & login, Learning & activity, Credentials, Messages |
| **Cohorts** | list → workspace tabs: Overview, Members, Lectures, Progress, Messages, Settings (incl. calendar) | |
| **Activity** | Live · Cohorts · Falling behind · Learning insights · Wellbeing (anonymous check-ins) | |
| **Pipeline** | Everyone · Enquiries · Follow-up due · No reply · Joined | enquiries page folded in (old URL redirects) |
| **Messages** | Inbox · Compose email · Notifications · Sent · Failed | "Logins" folder moves to Students (old link redirects) |
| **Content** | Courses & lectures · What's live · Medicines | Study cards leave the menu (it is the review queue for Rounds, which is already retired; page kept, linked at the foot of What's live) |
| **Review** | Needs a look · Submissions · Doubts (reply only) · Sign-offs · Wall reports (only when something is reported) | Practice sessions folded into "Needs a look" |
| **Credentials** | Find by roll number · Issue certificate · Badges & templates | |
| **System** | Usage & limits (with provider detail) · Admin management · Support key | bulk import → Students; cohort calendar → Cohort settings |
No page or data is deleted; every moved page keeps a redirect from its old address.

## 5. Module by module
### 5.1 Home
Top: one-line "N things need you" + **Add students / New course / Message** buttons. Row of 4 numbers: students, active today, on right now, never signed in. "Needs you" list (only non-zero items): concerns, inbox replies, follow-ups due, failed emails (with **Retry**), submissions to grade, sessions flagged, quiet 7+ days, not started. Per-cohort cards: members, active this week, lectures finished %. Recent activity (last 8 events). Phones: one column, buttons stay at top.
### 5.2 Messages
- Compose email with three modes: **Plain text**, **Formatted** (toolbar: heading, bold, italic, link, bulleted/numbered list, quote, button-link; no code needed), **HTML** (current editor). Live preview (desktop/phone width) + automatic plain-text version. Send test to me. Recipients picker unchanged (students, course, one cohort).
- Every send stores its HTML and text so it can be retried.
- **Failed**: reason in plain words ("Daily limit reached — try tomorrow", "Too fast — will retry slowly", "Domain not verified"), attempts so far, last try. **Retry one · Retry selected · Retry all**. Safeguards: skip anyone who already got the same subject later; credential emails get a fresh link; sends paced to ≤ 4/second and stop when the daily limit is hit; every retry logged as a new row linked to the original; originals marked retried. **Clear** stays.
- **Notifications** (new): write like a chat or formatted, pick students / cohort, optional "also email it". Students see a bell count, open it full screen, mark read, close; admin sees read counts.
- Nudges (quiet students) send email **and** a notification.
### 5.3 Students
List: name + roll number, cohort chips, account chip, last active, lectures finished, mobile ✓/✗. Columns that don't fit collapse into the row's details drawer — no sideways scroll at any width; cards on phones; sticky header; filters (cohort, account status, active/quiet, no mobile); search by name/email/roll/mobile; select rows → lock, unlock, send setup link, set access, message, add to cohort, export CSV.
Profile page tabs as in §4 (merges today's Activity person page, Access person page, Logins row).
### 5.4 Cohorts
Workspace with tabs; Overview shows members, active this week, completion, falling-behind count, quick actions (add people, message cohort, share lectures). Settings: name, course, dates, calendar generator (moved from Admin tools).
### 5.5 Activity
- **Live**: on right now (heartbeat < 5 min), watching a lecture now (progress ping < 1 min, with lecture name), signed in today, not seen 7+ days.
- **Cohorts**: side-by-side cohort cards + 14-day trend line.
- **Falling behind**: students with lectures available but not finished, sorted by gap; one-tap message.
- **Student timeline** (profile → Learning & activity): sign-ins, lecture started / % / finished, notes and games, assignments, credentials, with times.
- **Still watching? check** (needs owner OK, §8): at a random moment every 12–20 minutes of playback, a small "Still watching? Yes" card; video pauses if no tap in 60 s; minutes after a missed check don't count as watched. Admin sees "attention checks answered 18/20" per student and per lecture.
- Honest labels: "on now" = live heartbeat, "watched" = measured seconds, "estimated" where it is.
### 5.6 Pipeline & enquiries
One list with stages (New enquiry → Contacted → Follow-up → Joined) and the enquiry message, phone/WhatsApp, college, next follow-up shown in a side panel; quick actions: call, WhatsApp, email, set follow-up, convert to student (opens Add students pre-filled).
### 5.7 Content
What's live: grouped cards (Lectures & Notes, Games, Practice tools, Medicines) each with a clear three-way switch Off / Coming soon / Open and a one-line description; search; "what students see" preview text. Courses & lectures: untouched except spacing on phones.
### 5.8 Review
Doubts for admin: reply/resolve view, filter by cohort, no "ask" box. Practice sessions inside Needs a look. Wall reports tab hidden when empty.
### 5.9 Credentials
Search by roll number/name/email → everything that student earned (badges, certificates) with status, issue date, verify link, download, **revoke** (with reason) and **re-issue**. **Issue a certificate**: pick student (by roll number) or type a name, title, description/reason, date, signature (existing upload), preview PDF, issue → optional email to the student + notification.
### 5.10 System
Usage & limits with per-provider table (calls, failures, last error, speed) from `provider_health` / `ai_usage_log`. Admin management and Support key unchanged.

## 6. My extra ideas (proposed; built only where marked)
1. **Built in this round:** quick search everywhere (Ctrl/⌘ K) — type a name or roll number, jump to the student.
2. **Built:** CSV export of any student list view.
3. **Built:** "Needs attention" flags on a student (never signed in, no mobile, quiet 7+ days, behind on lectures, email failing).
4. Later: saved groups ("Cohort 2 · quiet") to message in one tap.
5. Later: audit log viewer (who locked whom, who issued what) — table already exists.
6. Later: scheduled emails/notifications.
7. Later: per-lecture drop-off chart (where students stop watching).
8. Later: weekly summary email to the admin.

## 7. Phases
1. Foundations: `accountStatus()`, roll number everywhere, Resend pacing, new menu + redirects.
2. Messages: compose modes, store HTML, Failed retry, Notifications (after DB step).
3. Students list + profile, one Add students dialog.
4. Activity (+ still-watching check after OK).
5. Cohort workspace, Pipeline/enquiries, What's live, Review cleanup.
6. Credentials: lookup, custom certificate, email.
7. Home, System detail, quick search, phone pass, docs + changelog, preview link.

## 8. Decisions (log)
| # | Question | Status |
|---|---|---|
| D1 | Still-watching check | **Owner 2026-11-06: pause after 60 s unanswered; random every 12–20 min; missed minutes not counted** |
| D2 | Admin notifications + email | **Owner 2026-11-06: one DB step OK; 'Also email it' tick box chosen each time** |
| D3 | Study cards, Check-ins, Practice sessions, admin "ask" box leave the menu | decided by audit (pages kept) |
| D4 | Build on `testing` (has Achievements, roll numbers, admin roles) not `main` | decided: `testing` is what the owner uses; preview link before any merge |

## 9. Testing & safety
Type check, lint, all unit tests + new tests (account status, retry dedupe/pacing, attention check timing, roll search). Screens checked at phone (390), tablet (768), laptop (1280/1366) and desktop (1536) widths on a local mock — never against live data. No data deleted, every DB change additive and run by the owner. Vercel preview link before merge.

## 10. Every point from the dictation (checklist)
Home stays informative + add student/course kept, phone layout, breathing space · Compose HTML **and** text · Sent kept · Logins redesigned and de-duplicated · Failed: **retry** next to clear · What's live better design · Study cards removed from admin (verified student feature) · Medicines reachable in Content · Pipeline stages clear · Cohort pages less cluttered, add people / new cohort kept · Students: one dashboard, roll numbers everywhere, no sideways scroll, one login/access model · Credentials by roll number · Access grant/revoke clear · Activity = students' activity, live, completion, still-watching check · Enquiries better · Nudge = email + notification · Notification composer (chat-like or formatted), open/close works · Learning = per-student facts for admin · Check-ins explained or moved · Review/submissions kept · Practice sessions de-emphasised · Doubts = reply, not ask · Wall reports only when needed · System: detailed provider health · Admin tools moved to where they belong · Support key, Admin management kept · Achievements: admin sees, revokes, changes; custom certificate designer, assign + email · Docs and architecture updated after.
