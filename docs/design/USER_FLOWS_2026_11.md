# Student and admin journeys, November 2026

How a student moves through VIBHA, step by step, on branch `agent/flow`.
Each journey lists the steps as they are now, then what was wrong before this
pass and what changed. Markers used below:

- **DEAD END**: a screen with no way on.
- **LOOP**: the student goes round without getting anywhere.
- **TWO DOORS**: two entry points for one job, or one menu place that is not in the approved menu.
- **UNCLEAR NEXT**: more than one equal next step, or none named.
- **NO BACK**: no in-app way back on some screen size.
- **TOOL THINKING**: the student has to think about the product, not the subject (jargon, small counts, how-this-works text, a label that differs from the place tapped).

Status: **Fixed** (with the commit), or **Left** (with the reason).

The approved menu: Home, Study, Lectures, Medicines, Exam Prep, Practice,
Games, then More: Progress, Doubts, Achievements, Leaderboard, Journal. Phone
bottom bar: Home, Study, Lectures, Exam Prep, More.

The rule for every finished activity: one clear next step (the next part, the
next set, Play again, or Back to the hub). The rule for every Back link: it
says where it goes, "Back to <place>". Labels: plain verbs, no jargon, no
counts that make content look small, no how-this-works text.

---

## 1. First login, then Home

1. Login link or setup email, then `/set-password` (first time) or `/login`.
2. Sign in, then `/dashboard` (admins are sent on to `/admin`).
3. First visit only: the details form covers the page until it is submitted; it then refreshes in place.
4. Home: one Continue card, today's goal (with quests), strongest and weakest topics, a WhatsApp help line.

Before: a new student's Continue card already pointed at "Start studying" (good). The weakest-topic and Daily case cards carried how-to text ("Ten questions on your weakest topic", "Name it in as few clues as you can"): TOOL THINKING. An admin previewing the student side saw a lecture-only Home under a full-student menu: TWO DOORS.

Status: **Fixed** (69ac094): plain card copy; the admin preview shows a full student's Home.
**Left**: a deep link opened while signed out lands on Home after login, not on the link (would need a safe return-to parameter in the auth code; out of scope for a flow pass).

## 2. Home Continue, then where it lands

Order now (src/app/(dashboard)/dashboard/next-step.ts):

1. A Study re-test that is due.
2. A lecture stopped part-way ("Continue watching", Resume).
3. Study where the student stopped: the exact section, and in this browser the exact part.
4. The next lecture or assignment ("Up next" or "Start here", Watch).
5. Study's first section, for someone who has not started.
6. Weakest topic, Daily case, then Lectures.

Before: as soon as a student had watched any lecture, Continue always chose the next lecture, even when they had left off mid-way in Study: UNCLEAR NEXT. In Study it went to the first unread section of the last module, not the section they were reading (every module is open, so students jump ahead): LOOP back to section 1. The reader always opened on part 1.

Status: **Fixed** (69ac094, 38dd79f). Tests: next-step.test.ts, study.test.ts (resume), reader-resume.test.tsx.
**Left**: with both a lecture stopped part-way and an unfinished Study section, the lecture wins. Neither record has a time of day to compare, and adding one would change saved data.

## 3. Study: map, module, reader part, level check, next part, module test, certificate

1. Study (`/study`): "42% complete", one Continue card, the modules with "% complete" each, bookmarks and notes, one-page summaries.
2. Module (`/study/<m>`): Back to Study, banner with "% complete", Continue card, steps 1 to 4 (Read, Write, Practise, Test).
3. Reader (`/study/<m>/<s>`): Back to the module (phones: "Module 4"), contents, the parts with Next and Back, then Check yourself and the Finish button naming the next section.
4. Checkpoint, when one opens, then on to the next section (`?then=`).
5. Level check sections: the quiz, then the Finish button to the next section.
6. Last reading section: Finish goes back to the module's steps.
7. Module test: Start, questions, score and review, then Back to the module. The module page shows "Module complete" with Start Module N+1.
8. Certificate: Progress shows "Next for your certificate: Module N test" until every module test is passed at 80% or more.

Before: "40 modules, all open" and "22 sections" made the course look small: TOOL THINKING. Back links read "All modules", "Module 4 overview", "Module 4": inconsistent.

Status: **Fixed** (f36db5a, a1f38e1, 27ca7f1).
**Left**: the module test's own end screen still says "Back to the module" rather than naming the next module; the module page does that one step later. Kept to avoid touching the test runner's scoring screen.

## 4. Exam Prep: subject, topic, questions, explanation, next set; Long answers

1. Exam Prep: Continue (pick up where you left off) or Start here, four tools, Long answers, subjects.
2. Subject: Back to Exam Prep, topics.
3. Topic: Back to <subject>, set chips, ten questions each with its explanation and Learn this.
4. Set done: score, then **Next set**; on the last set **Next topic: <name>**; Go through again; Back to <subject>.
5. Long answers: subject, topic, one answer (plan, model answer, tick key points), Previous and Next; on the last answer **Back to <topic>**.

Before: the last set's main button was "Go through again" (LOOP); the next set button read "Set 2"; the last long answer had no forward link (DEAD END); runner Back read "All topics", "Exam Prep"; a new student's tile read "0 saved · 0 wrong".

Status: **Fixed** (7cbe2dd). Test: long.test.tsx.

## 5. Exam Prep mocks: start, finish, review

1. Mock tests (`/prep/mock`): Back to Exam Prep, pick a paper.
2. Paper (`/prep/mock/<spec>`): Back to Mock tests, timed questions, submit.
3. Result (`/prep/mock/result/<id>`): score, section breakdown with Learn links, review filtered by right, wrong, skipped; then **Take another mock**, Back to Exam Prep.

Before: the main button left Exam Prep's mocks ("Back to Exam Prep") and the second read "All mocks"; back links said "Mocks".

Status: **Fixed** (7cbe2dd, a1f38e1).

## 6. Practice: hub, tool, finish, next

1. Practice hub: four main skills, then smaller tools, each with one line.
2. Tool: **Back to Practice** at the top of every tool (or back to where the student came from, such as a Study module).
3. Finish: tool-specific; Daily case ends on Study this topic and Practise another case.

Before: Mental state exam, Judgment calls, Practise with a classmate and the AI patient interview hide the phone bar while in use and had no Back row (NO BACK on phones). Formulation, Ethics, OSCE, Landmark cases, Case library and Out of depth had no Back row either. Hub, search and page used different names for one tool ("MSE" and "Mental state exam", "Judgment" and "Judgment calls", "Peer role-play" and "Practise with a classmate", "Ethics & Law" and "Ethics and law"): TOOL THINKING. Medicines had a back link into Practice although it is its own menu place: TWO DOORS.

Status: **Fixed** (920c43c, a1f38e1, 27ca7f1).
**Left**: the show-once "How it works" tips on tools stay. They fold into a small button after the first visit; removing them is a content decision for the owner.

## 7. Games: hub, game, end screen, next

1. Games hub: Solo, With others, then the quiz leaderboard and the Lab.
2. Game: Back to Games at the top.
3. End screen: **Play again** first; then the game's own second step (Back to Games, Change mode, Pick another patient, Pick another room, Change opponent, Back to Duel).

Before: "Deal again", "Run it again", "Play this patient again", "Practice board", "All games", a bare "Back"; Criteria sort's main button left the game. The Ward Week tile read "20+ patients" (small, and out of date).

Status: **Fixed** (a2f9608).

## 8. Medicines: list, medicine, related Study

1. Medicines (`/practice/medicines`): search by name, brand, group or condition.
2. Medicine: Back to Medicines, doses, checks, interactions, Compare with.
3. **Learn it in Study: <module>** (only when Study is open for the student).

Before: no link from a medicine to Study (DEAD END for learning).

Status: **Fixed** (db93e56). Test: study-link.test.ts (every medicine maps to a module that exists).

## 9. Lectures

1. Lectures: one course opens straight away; several are listed.
2. Course: weeks, lectures, assignments.
3. Lecture: video, Previous and Next (arrow keys), the course playlist; the last lecture ends on Finish course.

Status: no change needed. The search entry that pointed every student at one fixed course was removed (0a8dede).

## 10. Search, in the top bar and with "/"

1. Top bar box (or the search icon on phones), Ctrl+K, or "/" when not typing.
2. Before typing: the menu's places in order.
3. Typing: places, tools, every Study module (by name and section titles), every medicine (by name and brand), the Quick Reference, Bookmarks and notes, Saved questions.
4. Enter or tap opens the pick.

Before: titled "Ask the syllabus" with "sim patient" as an example; it promised a case library that is switched off; it did not search topics or medicines although the box says "lectures, topics, medicines"; one hard-coded course link went to the same course for every student; labels did not match the hubs; hints had small counts ("10 questions", "90 seconds").

Status: **Fixed** (0a8dede, 920c43c). Tests: palette.test.ts.

## 11. Notes and bookmarks: where they are found again

1. In a section: Bookmark and My note.
2. Found again: the module's section list (icons), the Study page's "Bookmarks and notes" list, and now search ("Bookmarks and notes" opens `/study#marks` with the list open).
3. Exam Prep questions: Save, then Saved and wrong in Exam Prep, and now search ("Saved questions").

Status: **Fixed** (0a8dede).

## 12. Doubts: ask, then follow-up

1. Doubts: ask your batch, or a private concern.
2. After asking: the thread page opens (`/doubts/<id>`), with Back to Doubts.
3. Replies: the bell and Notifications, then the thread.
4. The batch Wall opens from the foot of Doubts (where the Wall is open).

Before: "All doubts"; the page title did not match the menu name; the Wall was a separate More place outside the approved menu (TWO DOORS).

Status: **Fixed** (a1f38e1, 27ca7f1).

## 13. Progress and Achievements

1. Progress: "% complete", the next module test for the certificate, strengths and weak spots, See your full map, the certificate list, **My journey**.
2. Your map (`/study/map`) and My journey now light Progress and go Back to Progress.
3. Achievements: badges and certificates.

Before: Your map's Back went to Study though it opens from Progress; My journey was a separate More place outside the approved menu (TWO DOORS).

Status: **Fixed** (a1f38e1, 27ca7f1).
**Left**: Achievements' empty lines ("No certificates yet.") do not link anywhere. A link to Progress would break for lecture-only accounts, which cannot open Progress; needs the account scope passed to that client component.

## 14. Phone bottom bar paths

1. Home, Study, Lectures, Exam Prep, More (Study off: Home, Lectures, Medicines, Practice). Lecture-only: Home, Lectures, Doubts, Alerts.
2. More opens the drawer with every menu place, Notifications, Settings, theme and Log out.
3. During a run (answering, reading, playing) the bar steps aside; the page's own Back row is the way out.

Before: four Practice tools hid the bar without having a Back row (see 6).

Status: **Fixed** (920c43c). Tests: sections.test.ts, routes.test.ts.

## 15. Empty states for a brand-new student

- Home: Continue says Start studying, Read 0.1; goal 0/40; "Your strongest and weakest topics show up here after a few quizzes."
- Study: 0% complete, Continue on the first section.
- Exam Prep: Start here; Saved and wrong reads "Questions to look at again" (was "0 saved · 0 wrong").
- Progress: "Answer a few questions in Study or Exam Prep and they show here."
- Bookmarks and notes: hidden until something is saved.
- Leaderboard: "Nobody has points yet this week."

Status: **Fixed** where noted (7cbe2dd); others already fine.

## 16. Admin: login, student list, a student's login details, back to the student view

1. Login, then `/admin`.
2. Students: the list, with Login links at the top.
3. A student: Back to Students, the header with Copy login, and the Access and login tab (send or copy the login link, lock).
4. Logins (`/admin/students/logins`): Back to Students.
5. Student view: the Student view button in the top bar (in the More drawer on phones); on the student side, "Back to admin".

Before: Back links read "Students".

Status: **Fixed** (920c43c).

## 17. Error and not-found pages

1. Not found (a mistyped or old address): "Page not found", **Back to Home** (each person's own start, through `/go/home`). Inside the app (a module, topic, medicine or doubt that does not exist) the menu stays, with Back to Home and Search.
2. Error: "Something went wrong", **Try again** and **Back to Home**.

Before: no not-found page at all (the framework default); the error page offered only Try again (LOOP when the error repeats).

Status: **Fixed** (d88f061). Checked on `next dev`: an unknown address returns 404 with this page.

---

## Links and routes

- No link in the menus, phone bars, search, hubs, Continue cards or Back buttons points to a missing page, and no source file links an address that moved (`/games/daily`, `/games/detective`, `/learn/...`, `/practice/learn`, `/study/activities`): `src/components/navigation/routes.test.ts` (ba46b80).
- Routes with no inbound link are all redirect stubs for old addresses (`/today`, `/games/progress`, `/prep/goal`, `/practice/check-in`, `/practice/modules`, `/practice/passport`, `/practice/supervision`); they are meant to have none.

## Commits on agent/flow

| Commit | Journey |
|---|---|
| a1f38e1 | Menu matches the approved list; Back links say where they go |
| 69ac094 | Home Continue resumes exactly |
| f36db5a | Study drops small counts |
| 7cbe2dd | Exam Prep: one way on after every set, mock and long answer |
| a2f9608 | Games end on Play again |
| db93e56 | Medicine to Study |
| 0a8dede | Search: topics, medicines, bookmarks, saved questions |
| d88f061 | Error and not-found pages |
| ba46b80 | Route and link tests |
| 920c43c | Practice tools' Back row; one name per tool; admin Back labels |
| 38dd79f | Phone reader Back label |
| 27ca7f1 | Merge of admin-redesign (visual pass), flow labels reapplied |
