# Exploratory QA across the platform, November 2026

Branch `agent/qa2`. A second tester walking the whole platform as many kinds of student: brand new, lecture only, alumni, blocked, admin previewing, second device, long text, slow or no connection, Back and Forward, refresh, two tabs, midnight in India, session lost mid-activity.

How it was tested: reading every flow, component and unit tests (`gate.sh vitest`), type checks (`gate.sh tsc`), eslint on changed files, and read-only queries on the live database (which showed 99 of 111 badge notices still unread, confirming finding 3). The live site cannot be reached from the shell.

Not covered here (other agents): data saving and Mark complete, phone bottom scrolling and mobile layout, hand-drawn diagrams, security audit, answer keys for four games, case freshness. Study, Exam Prep and Games were already covered by the two earlier reports.

Severity: **High** (a student is stuck, loses work, or sees someone else's private text), **Medium** (wrong number, silent failure, confusing step), **Low** (copy, polish, guard).

## Fixed

| # | Sev | Where | What was wrong | How to see it (before) | Fix | Commit |
|---|---|---|---|---|---|---|
| 1 | High | Lecture-only accounts | `/notifications/<id>` and `/achievements` were not allowed (`src/lib/auth/scope.ts`), so every message, doubt answer and certificate notice sent them home. They could never read a message. | Lecture-only student, tap any Alert. | Both are allowed. Test added. | a313db7 |
| 2 | Medium | Bell count | Opening one notice marked it read, but the bell (in the shared layout) kept the old number until a full reload. | Tap a notice, go back: count unchanged. | `RefreshShell` redraws the layout once after marking. Mark all read revalidates the layout. | 9dd1dd8 |
| 3 | Medium | Bell count, achievements | Badge and certificate notices link to `/achievements`, which never marked them read. On the live data 99 of 111 badge notices are unread. | Earn a badge, open it from the bell: count never drops. | Opening My Achievements reads them and redraws the bell. | 7c4962d |
| 4 | Low | Notifications list | "Achievements: N new" counted every unread notice, messages included. New badges had no dot. Own replies on own wall posts were listed as news. | 2 unread messages, 0 new badges: "2 new" under Achievements. | Each section counts its own; dot added; own replies dropped. | 9dd1dd8 |
| 5 | Medium | My Achievements | Share links read `window.location` while rendering, which throws on the server; the page fell back to a client render with an error. | Any student with a badge (console: "switched to client rendering"). | Site address comes from the server. Server render test added. | 7c4962d |
| 6 | Low | My Achievements | Draft and revoked badges said "Issued" and offered LinkedIn sharing; Up next listed earned badges; dates were bare numeric in UTC; PDF button gave no feedback and the new tab was often blocked on phones after the wait. | | State shown, share only when issued, India dates, "Preparing…", same-tab fallback. | 7c4962d |
| 7 | High | Journal | The unsaved draft used one key for the whole browser (`journal:draft`). On a shared phone the next student opened the previous student's private draft. | Student A types, logs out; B opens Journal. | Draft kept per student; old key removed. | de979ca |
| 8 | Medium | Journal | Shares were only in page memory: after a reload the entry lost "shared" and could not be revoked. Errors read "unauthorized", "slow down". | Share, reload, open the entry. | Live shares load with the page; plain error words. | de979ca |
| 9 | Medium | Doubts | The writer of a private concern could read the team's reply but had no box to answer back (the admin inbox already expects that follow-up). | Send a concern, admin replies. | Writer gets "Add to your message". | 3f7e517 |
| 10 | Medium | Doubts | Errors from Mark as solved, This helped, Reclassify showed only inside the answer box (absent on concerns); buttons had no busy state; a dropped line threw. | | Errors under the thread, buttons wait, failures caught. | 3f7e517 |
| 11 | Low | Doubts | "Unanswered" listed doubts that had answers. Every empty filter said "Be the first to ask". Unhiding a solved doubt made it open again. Failed status saves were silent. | | Fixed each. Component tests added. | 3f7e517 |
| 12 | High | Set password (recovery link) | After saving, it sent the student to `/dashboard`, but that link never sets the app's sign-in cookie, so they bounced to a bare sign-in page. It also allowed 8 characters where setup needs 12. | Use a recovery link. | Signs the link out, opens sign in with "Password set" and the email filled; same password rule. | 2ebed3b |
| 13 | High (latent) | Sign in, Turnstile | Turnstile loads with `render=explicit` but was never rendered, and its callback was a function in a `data-` attribute (React drops it). Setting the keys (NEEDS_KAVYA.md) would lock everyone out. | Set the two Turnstile keys. | Rendered by hand, reset after a failed try. | 2ebed3b |
| 14 | Low | Sign in | A wrong password emptied the email box (React resets a form after its action). | | Email returned with the error. | 2ebed3b |
| 15 | Medium | Second device, session lost | Signed in on another device: kicked to sign in with no reason. Moving between pages after the session ended (replaced, expired, paused) showed an empty page, because the layout only checks on a full load and 16 pages returned `null`. | Sign in on phone, then click a link on the laptop. | Pages redirect via `leaveWithoutSession`; sign in says "opened on another device". | 9fe9798 |
| 16 | Medium | Search, lecture-only | Search offered Practice, Medicines, Study modules and more; each pick sent them home silently. | | Offers only what the account can open. Test added. | dc765c1 |
| 17 | Medium | Search, Back button | A tap on a result navigated twice (link plus `router.push`), so Back seemed to do nothing. | Search, pick, press Back. | One navigation; modifier clicks still open a tab. | dc765c1 |
| 18 | Low | Search | Keywords matched inside words ("experience" found Games, "internet" found Exam Prep). Tab left the open dialog; focus was not returned; keyboard hints showed on phones. | | Whole-word keywords, Tab trap, focus return, hints hidden on touch. | dc765c1 |
| 19 | Medium | Weekly check-in, midnight IST | The week was worked out on the server's UTC clock: a check-in before 05:30 IST on Monday was filed under last week and overwrote it. The browser's week was trusted. | Check in at 01:00 IST Monday. | India week on page and save; the save ignores the browser's week. | 9ee2d47 |
| 20 | Low | Dates, IST | Supervision log defaulted to yesterday before 05:30 IST; passport PDF date was UTC and printed the email instead of the name; passport, formulation wall, role-play, assignment and doubt dates were bare or UTC; `formatRelativeTime` used the server day. | | `formatDateIST` added in `src/lib/format.ts` and used. Tests added. | 9ee2d47, 7c4962d |
| 21 | High | First-login details, connection drop | Server calls in transitions threw to the error page on a dropped line. The details form is drawn over every page from the layout, so a brand-new student on a weak line saw the whole app fail. Same in the WhatsApp prompt, leaderboard name and XP shop. | Go offline, press Submit. | Calls caught, plain message, page kept. | f29cfc06 |
| 22 | Low | Settings | Wall shortcut shown when the Wall is switched off; "Course modules ... locked ones say why" for Lectures; notifications described as wall replies only; role "View_admin"; Log out gave no feedback. | | Fixed; `LogoutButton` shows "Logging out…". | 44ef022 |
| 23 | Low | Notification page | A batchmate's doubt answer opened as "From the VIBHA team". | | Names the writer. | 44ef022 |
| 24 | Low | Leaderboard | "1 players", "1 students"; on the bottom tier it said a 0-point week drops you a tier. | | Fixed copy. | 654a4f40 |

## Checked, no problem found

- Forms (`/f/<slug>`): validation, closed forms, honeypot, rate limits, keyboard and labels.
- 404 and error pages: one way on, Sentry reporting, retry; policy links on the public pages all resolve.
- Email preview gate (`previewBlocks`): preview sites send only to the approved address; credential mails fail closed.
- Reactions switch: per device, wrapped storage, the shown reaction respects it.
- Leaderboard week and reset: Monday 00:00 IST.
- Logout clears the database token; learn progress in the browser is kept per student.

## Left, and why

| Sev | Where | What | Why left |
|---|---|---|---|
| Medium | Layout guards (agent/sec) | Lecture-only, access blocks and blocked status are checked in the layout, which only runs on a full load. Pages without their own check can be reached by moving inside the app. Search no longer leads there (16), and pages without a session now redirect (15), but scope and blocks are not rechecked per page. | Security agent's area. A per-page or `proxy.ts` check is needed. |
| Low | Public home | A paused student still has a sign-in session, so the home page sends them to `/dashboard` and then `/paused`; they cannot see the public page or sign out from there. | Needs a decision: add Sign out to the paused page. |
| Low | Doubts, admin view | `/doubts` treats a view-only admin as admin, `/doubts/<id>` does not, so they see concern titles they cannot open. | Admin edge; owner to decide what view-only admins see. |
| Low | Notifications | The student is not told when an admin replies to a concern by email only. | Product choice. |
| Low | Dates | Some relative times are worked out with `Date.now()` during render (doubts, journal), so the server and the phone can disagree for a second ("just now" vs "1 min ago"). | Harmless text mismatch. |

## Tests added

- `src/lib/auth/guards.test.ts`: lecture-only may open a message and My Achievements.
- `src/lib/auth/session-redirect.test.ts`: each lost session goes to its page.
- `src/lib/format.test.ts`: India day for relative and plain dates.
- `src/lib/search/palette.test.ts`: whole-word keywords; lecture-only offered only its places.
- `src/app/(dashboard)/achievements/achievements-client.test.tsx`: renders on the server; badge states; Up next.
- `src/app/(dashboard)/doubts/doubts-ui.test.tsx`: Unanswered, empty filters, concern reply, errors shown.
