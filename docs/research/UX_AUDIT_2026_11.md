# Student and admin UX audit, November 2026

Branch `agent/audit` from `admin-redesign` at b9322ad. Audit only: no app code was changed.

How this was checked: every student route under `src/app/(dashboard)` was read. Six screens were rendered to static HTML with sample data and screenshotted at 360, 768 and 1280 px (Daily case opened from Practice, Coach opened from Exam Prep, Rx Detective, the Practice hub with the live switches, the Games hub, a Study section). The live database was queried read-only for tables, switches and content rows. No personal data was read.

Priorities: **P0** broken or a dead end for a real student. **P1** confusing (wrong place, wrong back target, contradicts the approved plan). **P2** polish.

---

## Top findings

| # | P | Finding | Where |
|---|---|---|---|
| 1 | P0 | Three of the four main Practice skills are switched off on the live database: AI patient interview (`consulting_room`), MSE (`mse`) and Formulation (`formulation`). A student sees one main tile (Daily case). Also off: Judgment, Two-minute clinic, OSCE, Peer role-play, Weak spots, Landmark cases, Case library. | `feature_flags` table; hub filter `src/components/practice/practice-hub.tsx:76-86` |
| 2 | P0 | **Journal** is in the student menu but its switch (`journal`) is off, so the link opens "Not unlocked yet". The menu does not hide items whose switch is off. | `src/components/navigation/nav-config.ts:25`; gate `src/app/(dashboard)/reflect/page.tsx` |
| 3 | P0 | Both footer links on the Practice hub are dead ends: **Skills Passport** (`skills_passport` off) and **Supervision log and check-in** (`supervision` and `checkin` both off, `/record` redirects to "Not unlocked yet"). | `src/components/practice/practice-hub.tsx:200-206`; `src/app/(dashboard)/record/page.tsx:21-25` |
| 4 | P0 | Saved questions do not work: table `prep_answers` is not on the live database. Effects: Save button hidden, Saved list always empty, per-question right/wrong history (Smart practice "missed before", per-subject % right) falls back or stays empty. | `supabase/migrations_pending/2026_11_prep_bank.sql`; `src/lib/prep/answers.ts` |
| 5 | P1 | Practice tools live under `/games/...`, so opening them from Practice lights **Games** in the sidebar and the Back button says "Back to Games": Daily case, Clinic detective, What would you do, Say it clinically. Screenshot confirmed for Daily case. | `practice-hub.tsx:37,44-46`; `src/components/study/back.tsx:13,17`; `src/app/(dashboard)/games/daily/page.tsx:19` |
| 6 | P1 | Exam Prep's Smart practice sends students to `/games/coach`, `/games/quizzes`, `/games/revise`; Games lights up and Back goes to Games. The page comment says these "old addresses come here", but they do not redirect. | `src/app/(dashboard)/prep/smart/page.tsx:16,49-51` |
| 7 | P1 | Every activity (14 pages) has an always-on side panel on desktop: Back, "You're in", purpose, "How to use it" list, "When you finish, you'll go back to games". It never goes away after first use and takes 19rem beside the game. | `src/components/study/activity-frame.tsx:26-38` |
| 8 | P1 | Study is called "Notes" in four places while the menu says Study, and there are three different things called notes (the module course, the one-page summaries at `/study/notes`, the student's own notes). | `src/app/(dashboard)/study/page.tsx:8`; `src/components/study/course.tsx:84-85`; back labels `study/notes/page.tsx:30`, `study/reference/page.tsx:25`, `study/map/page.tsx:34`, `study/placement/page.tsx:30`; `back.tsx:15` |
| 9 | P1 | Games hub shows **MSE Lab** and **Criteria sort**, which are not on the approved games list, and links out to Exam Prep ("Coach and quizzes are in Smart practice") and to Psychology Lab. With Practice MSE off, the only MSE practice a student can reach is inside Games. | `src/components/learn/learn-home.tsx:33-39,108-124` |
| 10 | P1 | Quiz path still locks lessons ("Clear lesson N first"), against the "no locks" rule. | `learn-home.tsx:144,175-193` |
| 11 | P1 | Five ten-question runners do similar jobs: topic sets `/prep/[s]/[t]`, Smart practice `/prep/smart`, weak-topic practice `/study/map/practice` (where Home and Progress send weak topics), Quiz path `/games/play`, Coach `/games/coach`. | `src/lib/progress/strengths-core.ts:122`; `prep/smart/page.tsx` |
| 12 | P1 | Focused work keeps the full chrome. At 1280px the Study reader shows the full app sidebar, a 17rem contents rail and the text (three columns). On phones, the bottom tab bar stays on Daily case, Rx, Ward, Blitz, Duel, Sort, Escape, Comorbid, MSE Lab, Exam Prep topic sets and Smart practice. | `src/components/navigation/sidebar-gate.tsx:18-39`; `bottom-tab-bar.tsx:83-85` |
| 13 | P1 | Old Practice address `/practice/rounds` redirects to `/games`. | `src/app/(dashboard)/practice/rounds/page.tsx:5` |
| 14 | P1 | Rx Detective, MSE Lab, Ward Week, Escape Room and Comorbid have no link out to Study, Medicines or Quick Reference after an answer. Rx Detective keeps its own 21-drug list, separate from Medicines (52). | `src/app/(dashboard)/games/rx/rx-detective.tsx`; `src/lib/games-sims/rx/content.ts` |
| 15 | P1 | Student notes and bookmarks are saved only on the device ("Saved on this device"), so they vanish on another phone or laptop. The plan says notes live inside each topic. | `src/components/study/marks.tsx:100,153` |

---

## 1. Clutter, page by page

| Page | On screen now | Not relevant to the task | Recommendation |
|---|---|---|---|
| Home `/dashboard` | Continue card, goal, strengths and weak spots, WhatsApp line | "Points come from Study checks and games." under the goal, every visit (`dashboard/home-view.tsx:82`) | Remove the line. Home is otherwise close to plan. |
| Study `/study` | Header "Notes / Your notes, module by module", Continue card, progress link, your marks list, all 40 modules | Header says Notes; the marks list sits above the modules (`course.tsx:84-96`) | Rename to Study. Fold "Your marks" into a collapsed row under the modules. |
| Study module `/study/[m]` | Four steps, write task, practise activities, Lab experiments, one-page note link, test | Lab cards and the note card compete with the next step (`course.tsx:374-380`, `marks.tsx:217`) | Keep one next step; put Lab and the one-page note under a "More for this module" fold. |
| Study section `/study/[m]/[s]` | Contents rail, header, Core tag, part meter, Student/Clinician toggle, Bookmark, My note, text | The view toggle and both mark buttons sit above the first paragraph on every section (`reader.tsx:263-264`) | Move toggle and marks into one small toolbar row at the end of the header, or a "..." menu. Auto-collapse the app sidebar (see 4). |
| Exam Prep `/prep` | Long title, four exam chips, Continue, four tools, subjects | Exam chips and the long title on every visit (`prep/ui.tsx:19-37`) | Show title and chips once; later visits: short title only. |
| Smart practice | Runner plus "More ways to practise" with three Games links | The three links (`prep/smart/page.tsx:43-60`) | Move Coach and Quiz path under Exam Prep addresses or drop them; see 3. |
| Practice `/practice` | Main tile(s), "Think like a clinician", "More tools", footer links | Footer links that open locked screens (`practice-hub.tsx:200-206`) | Hide links whose switch is off. |
| Games `/games` | Eight game tiles, footer: Quiz leaderboard, "Coach and quizzes are in Smart practice", Psychology Lab | MSE Lab, Criteria sort, the Smart practice link, the Lab link (`learn-home.tsx:33-39,108-124`) | Six games only (plan). Move MSE Lab to Practice MSE, Criteria sort to Exam Prep or Practice, Lab and Casebook to Practice or Study. |
| Every activity page (14) | Side panel with purpose and how-to | All of it after first use (`activity-frame.tsx:26-38`) | See 2. |
| Duel | Score rules card above the lobby plus the side panel how-to | Same rules twice (`games/duel/duel-game.tsx:152,214-232`) | One "?" icon. |
| Quiz path | Back "Games", title, subtitle about locks, units, badges, daily goal picker | Badges grid and daily goal picker belong in Achievements and Progress (`learn-home.tsx:203-238`) | Remove from this page. |
| One-page notes `/study/notes` | Chai mascot, title, count, Continue card with instruction, progress box, cards by week | "Read it, then take the quiz at the bottom"; "Review on the Learn page" points to a page that no longer exists (`notes-index.tsx:35,40`) | Cut both lines; fix the stale reference. |
| Note view `/study/notes/[id]` | Note, Say it clinically terms, next steps, quiz leaderboard link, prev/next | "Quizzing right after reading is how it sticks." and the leaderboard link (`note-view.tsx:176-182`) | Remove both. |
| Not unlocked page | Long text naming the raw switch key ("consulting room is built and waiting...") and "Back to practice" | Raw key, long text, wrong back target when opened from Journal or Passport (`practice/not-available/page.tsx:36,48-61`) | One line, real tool name, Back to wherever the student came from. Better: never link to it (see 6). |
| Sidebar | Menu plus footer "Press / to search" | The footer hint, already shown in the top search bar (`app-sidebar.tsx:62-64`, `top-bar.tsx:97`) | Remove the sidebar footer. |
| More menu | Progress, Doubts, Achievements, Leaderboard, Journal, Wall, My journey | Wall and My journey are not in the approved More list; Progress, Achievements and My journey overlap | Merge My journey into Progress; keep Wall only if the owner wants it. |
| Leaderboards | `/leaderboard`, `/leaderboard/overall`, `/leaderboard/shop`, `/games/leaderboard` | Four boards and a shop | One Leaderboard page with tabs. |

## 2. Instructions that repeat or never go away

No show-once mechanism exists anywhere in the app today. Recommended single pattern: a `seen` map in the student's saved learning state (`learn_progress`, already server-backed via `saveLearnState`) so "seen once" holds across devices; a small "?" icon reopens the help.

| Text | File | Recommendation |
|---|---|---|
| ActivityFrame "You're in" purpose card and "How to use it" list, 14 pages: Coach, Daily case, MSE Lab, Clinic detective, What would you do, Say it clinically, Criteria sort, Rx Detective, Ward Week, Blitz, Duel, Escape, Comorbid, Play | `components/study/activity-frame.tsx:28-37`, text in each `games/*/page.tsx` | Show once as a short overlay on first visit; afterwards a "?" icon in the activity's top row. Remove the side panel; the activity gets the full width. |
| "When you finish, you'll go back to games." | `activity-frame.tsx:37` | Remove. |
| Duel score rules card | `games/duel/duel-game.tsx:214-232` | Into the "?" help. |
| "Each lesson opens after the one before. Three stars for a clean round." | `components/learn/learn-home.tsx:144` | Remove with the locks. |
| "Read it, then take the quiz at the bottom" | `components/learn/notes-index.tsx:35` | Remove. |
| "Keep them fresh with Review on the Learn page." | `notes-index.tsx:40` | Remove (stale). |
| "Quizzing right after reading is how it sticks." | `components/learn/note-view.tsx:176` | Remove. |
| "Points come from Study checks and games." | `dashboard/home-view.tsx:82` | Remove or "?" on the goal. |
| Study Continue sub-lines "Spaced re-tests are what make it stick", "Now that you've moved on, see what stuck" | `components/study/course.tsx:23,31` | Remove; title alone is enough. |
| "Only you see this. Saved on this device." in every My note box | `components/study/marks.tsx:100,153` | Show once; and save to the server (see 6). |
| "Short experiments you run on yourself, linked to this module." | `marks.tsx:217` | Remove. |
| Exam chips and the long Exam Prep title | `prep/ui.tsx:19-37` | Show once. |
| Mock marking paragraph | `prep/mock/page.tsx:70` | Keep: it is needed before a mock. Shorten to one line. |
| Consulting room safety sheet | `practice/consulting-room/case-picker.tsx:245` | Keep for safety, but show once per student, not every visit. |
| "Press / to search" | `components/navigation/app-sidebar.tsx:62-64` | Remove. |
| "Staff preview: answers are not saved." | `prep/page.tsx`, `prep/runner.tsx:146` | Fine (admin only). |

## 3. Practice and Games sending students to the wrong place

Root cause: most Practice and Exam Prep activities still live under `/games/...`. Menu highlighting is a plain prefix match, so any `/games/...` address lights Games (`components/navigation/nav-items.tsx:97-102`, same logic in `bottom-tab-bar.tsx:101-104`). The default Back target is Games (`components/study/back.tsx:13,17`).

Recommended fix: give each tool an address under the section it belongs to (`/practice/daily`, `/practice/detective`, `/practice/scenarios`, `/practice/terms`; `/prep/coach`, `/prep/quizzes`, `/prep/revise`, `/prep/play`) with permanent redirects from the old `/games/...` addresses, and pass an explicit `fallback` on each ActivityFrame. Adding `match` lists alone will not work: the prefix rule still lights Games.

| From | File:line | Goes to now | Correct target |
|---|---|---|---|
| Practice hub, Daily case tile | `components/practice/practice-hub.tsx:37` | `/games/daily` (Games lit) | `/practice/daily` |
| Practice hub, Clinic detective, What would you do, Say it clinically | `practice-hub.tsx:44-46` | `/games/detective`, `/games/scenarios`, `/games/terms` | `/practice/...` |
| Daily case Back | `games/daily/page.tsx:19` | `/games`, "Back to Games" | `/practice` |
| Detective, Scenarios, Terms, Coach Back (no fallback, default) | `components/study/back.tsx:13,17` | `/games` | Practice for the first three, Exam Prep for Coach |
| Back label when opened from Study | `back.tsx:15` | "Back to Notes" | "Back to Study" |
| Home Continue (Daily case) | `dashboard/next-step.ts:69`; `dashboard/page.tsx:80` | `/games/daily` | `/practice/daily` |
| Smart practice links | `prep/smart/page.tsx:49-51` | `/games/coach`, `/games/quizzes`, `/games/revise` | `/prep/...` or remove |
| Quiz path Back | `components/learn/learn-home.tsx:137` | `/games`, label "Games" | `/prep/smart` |
| Quiz path lesson links | `learn-home.tsx:178` | `/games/play?...&from=/games/quizzes` | `/prep/play?...` |
| Revise Back and empty state | `components/revise/revise-home.tsx:125,156` | `/games`, "Play a game" | `/prep/smart` |
| Revise items | `lib/revise/plan.ts:259,332,351` | `/games/coach`, `/games/play?mode=review` | `/prep/...` |
| Study module activities | `lib/study/activities.ts:6-10` | `/games/play`, `/games/coach`, `/games/detective`, `/games/scenarios`, `/games/terms` | New addresses; Back already returns to the module via `?from=` |
| One-page note quiz and practise | `components/learn/note-view.tsx:16,126` | `/games/play`, `/games/coach`, `/games/scenarios`, `/games/terms` | New addresses with `?from=/study/notes/<id>` |
| Weak spots drill | `practice/weak-spots/weak-spots-view.tsx:73` | `/games/play?mode=review` | `/prep/play?mode=review` |
| Old Practice address | `practice/rounds/page.tsx:5` | `/games` | `/practice` |
| Games hub link to Exam Prep | `learn-home.tsx:115-117` | `/prep/smart` (a Games user is sent into Exam Prep) | Remove |
| Games hub Lab link; Lab and Casebook back links | `learn-home.tsx:118-122`; `components/lab/lab-home.tsx:68`; `components/casebook/casebook-index.tsx:58`; `components/casebook/case-view.tsx:37` | `/games/lab`, Back to `/games` | Lab under Study or Practice; Casebook under Practice |
| Lab links from a Study module | `components/study/marks.tsx:221`; `lib/lab/entries.ts:11-14` | `/games/lab/...` (Games lit while in Study) | Follow the Lab's new home |
| "Not unlocked" Back | `practice/not-available/page.tsx:36,61` | Always `/practice` | Where the student came from |
| Search palette entries | `lib/search/palette.ts:44,48-50` | `/games/...` | Follow the moves |
| Medicines tools `/tools/psychopharm/*` | `nav-config.ts:16` | No menu item lights | Add `match: ["/tools/psychopharm"]` to Medicines |

## 4. Sidebar and headers during focused work

Today: the sidebar is hidden only on lesson and material pages and in the patient session (`sidebar-gate.tsx:18-30`); on tablets it steps aside only for the Study reader (`sidebar-gate.tsx:37-39`). At 1280px and above the full labelled sidebar always shows. The phone bottom bar hides on `/games/play|coach|detective|scenarios|terms|lab/`, the Study reader and the mock runner only (`bottom-tab-bar.tsx:83-85`).

Recommend a "focus" route list used by both the sidebar and the bottom bar. On those routes: sidebar shows as the icon rail when the student's preference is "auto" (keep an explicit "full" choice), the bottom tab bar is hidden on phones, and the page's own Back row is the only navigation.

Focus routes:
- Study reader and checkpoints: `/study/[m]/[s]`, `/study/[m]/checkpoint/[n]`, `/study/notes/[id]`, `/study/reference/[slug]`
- Exam Prep runners: `/prep/[subject]/[topic]`, `/prep/smart`, `/prep/saved`, `/prep/wrong`, `/prep/mock/[spec]`, `/prep/interview`, `/study/map/practice`
- Every single game and practice tool (not the hubs): `/games/<game>`, `/practice/<tool>`, Coach, Quiz play
- Already handled, keep: lesson and material pages, the patient session

With the ActivityFrame side panel removed (section 2), games get the full content width.

## 5. Game notes and learning sections

What exists:
- **One-page summaries** (`/study/notes`, 41 notes, `src/lib/learn/notes`): grouped by cohort week ("Weeks 1 to 2 ..."), each with sections, "Say it clinically" terms and a quiz that opens Quiz path or Coach. 21 of 40 Study modules link their note.
- **Quick Reference A to Z** (`/study/reference`, 53 disorders plus medicines and terms): the "Learn this" target from Daily case, Duel, Criteria sort, Clinic detective (`lib/games/ui/learn-link.tsx`). Blitz has its own "Learn this" (`games/blitz/blitz-game.tsx:460`).
- **Study modules** (40 modules, 1,051 sections): the "Learn this" target from Exam Prep questions (`lib/prep/bank.ts:44-60`) and Daily case's "Study this topic".
- **Medicines** (52 entries) and the older `/tools/psychopharm` pages (152 drug rows in the database).
- **In-game explanations**: Rx Detective "why" with animation, MSE Lab feedback, Ward Week "why it was strong or weak". None of these link out.

Problems:
1. Four libraries (one-page notes, Quick Reference, Study modules, Medicines) with no shared map; the one-page notes are ordered by cohort week, Study by module number, Exam Prep by exam subject. A student cannot tell which one to open.
2. Rx Detective, MSE Lab, Ward Week, Escape and Comorbid end an answer without a link to the topic.
3. Rx Detective has its own 21 drugs (`lib/games-sims/rx/content.ts:27`) separate from Medicines (`lib/meds`, 52); facts can drift apart.
4. Notes quiz goes to Quiz path or Coach (Games lit, locked lessons), not to the Exam Prep set for the same topic.
5. "Learn this" in Duel and Detective can open in a new tab; on phones a new tab is easy to lose.

Recommendations:
1. One rule: **Study module section** is the home for every topic. The one-page note becomes the module's "Summary" tab (drop week grouping, order by module). Quick Reference stays as the A to Z lookup and every entry links to its module section.
2. Every game answer card gets the same two links: "Learn this" (module section) and "Practise this" (the Exam Prep topic set). For medicines: link to the Medicines entry.
3. Make Rx Detective read from `lib/meds` so there is one medicine source.
4. Notes quiz opens the Exam Prep topic set (`/prep/[subject]/[topic]`) for that topic.
5. Exam Prep topic page already links "Learn" (`prep/[subject]/[topic]/page.tsx:97`); add the reverse on each Study section: "10 exam questions on this".

## 6. Not yet live for a real student

Checked against the live database on 7 Nov 2026 (read-only). Every table the app code reads exists **except `prep_answers`**. (`videos` is a storage bucket, not a table.) All other files in `supabase/migrations_pending` that create tables are applied.

| Feature | Why it is not working end to end | Fix |
|---|---|---|
| Saved questions, per-question history | `prep_answers` table missing | Run `2026_11_prep_bank.sql` |
| AI patient interview (Consulting room) | Switch `consulting_room` off (71 cases ready in `sim_cases`) | Turn on in What's live; check AI provider keys |
| MSE (Practice) | Switch `mse` off (30 rows in `mse_stimuli`) | Turn on |
| Formulation | Switch `formulation` off; only 1 row in `formulation_cases` (6 in code) | Turn on; add cases |
| Journal (in the menu) | Switch `journal` off | Turn on, or hide menu items whose switch is off |
| Skills Passport, Supervision log, Check-in (hub footer) | `skills_passport`, `supervision`, `checkin` off | Hide links when off |
| Judgment, Two-minute clinic, OSCE, Peer role-play, Weak spots, Landmark, Case library | Switches off | Decide per tool; the hub hides them, so students never see them |
| Daily case "AI case" | `ai_cases` has 0 rows; generation needs `AI_ENABLED` and a provider key (Groq, Cerebras or NVIDIA) on Preview (known) | Set keys; seed approved AI cases |
| Rounds, Decoder, Modules, Knowledge tutor, Learning profile, Personalised patients | Switches off; old addresses redirect | Fine if intended |
| Student notes and bookmarks | Saved in the browser only (`components/study/marks.tsx`) | Store in `learn_progress` or a notes table |
| Admin previewing a switched-off tool | `requireFeature` has no admin bypass (`src/lib/flags.ts`), so the owner also sees "Not unlocked yet" | Let admins in student view open off tools with a "Hidden from students" strip |
| Lab, Casebook | Switch `lab` unlocked; works, but filed under Games | Move (section 3) |

Admin side: login details can be sent from the Inbox (`admin/inbox/login-finder.tsx`) and the student list (`admin/students/login-quick.tsx`, `student-table.tsx`), as the plan asks. The What's live page (`admin/flags`) is where the switches above are turned on; consider showing on that page which switched-off tools are still linked from the student menu.

## 7. Suggested order of work

1. P0: run `2026_11_prep_bank.sql`; turn on (or hide) Consulting room, MSE, Formulation, Journal; hide links to switched-off tools (menu, hub footer).
2. P1: move Practice and Exam Prep tools out of `/games` with redirects; fix every Back target in section 3.
3. P1: remove the ActivityFrame side panel; add show-once help and a "?" icon.
4. P1: focus routes for sidebar and bottom bar.
5. P1: rename Study consistently; merge the four learning libraries around Study sections.
6. P2: the remaining clutter in section 1.
