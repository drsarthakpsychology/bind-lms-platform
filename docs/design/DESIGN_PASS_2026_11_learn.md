# Design pass, November 2026: the daily learning screens

Area: Home (/dashboard), Study (course home, module page, section reader), Exam Prep lists, Progress, Leaderboard, and the shared motion tokens they use. Refinement inside the committed Neo-Brutalist world (ink borders, hard shadows, lime = the one action, blue = current/selected). No learning logic, data or checkpoint rules changed.

Gumroad note: the owner wrote "Gummble"; read as Gumroad, the best known neo-brutalist pastel product. It confirms the direction already in use (flat fills, 2px ink, hard shadows, one loud action per screen); no layout was taken from it.

## How it was checked

- Fixture harness (esbuild + Tailwind, real page components, stubbed Supabase/session) at 390 and 1280, then 320x568, 360x780, 430x932 and 844x390 landscape, light and dark, reduced motion. Each run checks for sideways scroll and tap targets under 24px: none found on the changed screens.
- Screenrove was the main reference tool (search_screens, build_recipe, check_my_ui, suggest_polish, get_motion_guidelines). Mobbin and Made Good Designs were not needed beyond that; Screenrove covered every screen type here.

## Problems found (before), worst first

1. **Study home was a 50-row wall.** One column of full-width cards, each with an empty "0% complete" bar. 5,600px tall on a phone, 4,900px on a laptop with most of the width empty. (src/components/study/course.tsx, StudyHome)
2. **Module page buried steps 2 to 4.** "Read the notes" listed all 45 sections, so Write, Practise and Test sat 4,000px down. (course.tsx, ModuleView)
3. **Three different "Continue" cards.** Home: white button. Study: ink button on wide screens, bare arrow on phones under 400px. Progress: arrow only, no button. Same job, three looks.
4. **Phone Continue buttons out of thumb reach.** Home's was a small fit-width button; Study hid the button entirely on narrow phones.
5. **Empty progress shown as progress.** Day one showed a "0% complete" bar on every module, on the module header and as Progress's page title ("0% complete").
6. **Reader controls took four rows before the first sentence on phones.** View switch on its own row, Bookmark and My note on another. (src/components/study/marks.tsx, SectionMarks)
7. **"New" on every Exam Prep row.** Every subject and topic said "New" until answered: a word with no information that made lists noisy. (src/app/(dashboard)/prep/ui.tsx, pctText)
8. **Zero counts on empty boards.** "Your group · 0 players", "Top 10 and you · 0 students": small counts that make the place look empty. (leaderboard/page.tsx)
9. **Bare text empty states** on Progress (strengths) and the subject page, where Home already uses the shared EmptyState row.
10. **Home loading skeleton did not match Home** (three equal tiles from the group fallback), so the page jumped when it landed.
11. **Motion tokens were not wired.** `duration-fast`, `duration-base`, `duration-slow`, `duration-slower` are used in 66 files but Tailwind has no `--duration-*` namespace, so they compiled to nothing and every press used the 200ms default. (src/app/globals.css)
12. **Home's Continue card on wide screens** had its words centred in a tall card next to the goal card, leaving a lime band with nothing in it.

## What changed

| Screen | Change | Reference (Screenrove id, product, capture date) |
|---|---|---|
| Study home | Modules in three shelves (Clinical 1-29 plus pharmacokinetics, Going deeper 30s, Psychology 40s), two-column grid from 768px, compact tiles. Bar and % only on started modules; "Done" and a check on finished ones; "You are here" on the current one. Summaries and Certificate move to header buttons. Course bar only once above 0%. | codecademy-lesson-syllabus (Codecademy, 2026-10-22): grouped syllabus, current item emphasis. codecademy-product-my-learning (Codecademy, 2026-10-22): compact rows, small meter. duolingo-course (Duolingo, check_my_ui match): bordered tile grid. plane-modules (Plane, check_my_ui match): progress only as a small marker. |
| Module page | Step strip (Read, Write, Practise, Test) under the Continue card, with done/now state, each a jump link. Reading list folds by part: the current part open, others one line each with "x of y read" once started. Header bar hidden at 0%. "What you will learn" gets a chevron. Page 5,800 to 3,100px on phones. | codecademy-lesson-syllabus (Codecademy, 2026-10-22): collapsed module groups with the current one open. |
| Continue cards (Home, Study, module, Progress) | One shape: icon tile, eyebrow, title, then an ink button. Phones: full-width 48px button under the words. Home wide: words top, button bottom. | duolingo-product-correct (Duolingo, 2026-09-24): one wide bottom action. codecademy-product-skills (Codecademy, 2026-10-22): continue item leads the page. |
| Reader (phones) | View switch and two 44px icon buttons (Bookmark, My note, named for screen readers, words from 640px) in one row. Reading starts a row sooner. | raindrop-product-reader (Raindrop.io, 2026-10-22), medium-product-article (Medium, 2026-10-22): compact icon toolbar above the text. |
| Progress | Title "Your progress"; a two-number panel (course done %, tests passed of total, pass mark). Next test card matches the Continue card with a "Take the test" button. Strengths empty state uses the shared row. Module list summary gets a chevron; Journey link becomes a row card. | codecademy-product-skills (Codecademy, 2026-10-22): skills summary over an empty-state panel. |
| Exam Prep | No "New" label; the right side shows "% right" only after answering. Subject empty states use the shared EmptyState row. | linear-product-my-issues (Linear, 2026-09-20): calm list, no status noise. |
| Leaderboard | Player/student counts hidden when 0 or 1; empty boards show a dashed slot row instead of bare grey text. | linear-product-projects (Linear, 2026-09-20): calm empty list. |
| Home loading | Skeleton in Home's own shape (header, Continue beside goal, topics row). | interior-skeleton-swap (suggest_polish addition). |
| Motion tokens | `@utility duration-fast/base/slow/slower` wired to the tokens, so presses run at 120ms as designed and section moves at 400ms. Progress fills use transform scaleX over 600ms with the out-expo ease (enough time to see the bar fill), and none under reduced motion. | get_motion_guidelines: 100-160ms press feedback, ease-out for enters, transform/opacity only. |

check_my_ui after the change: Home matched duolingo-product-learn and duolingo-product-streak (one action, goal and streak on the same screen); Study matched duolingo-course and plane-modules (tile grid, progress as a small marker). Neither flagged a missing block.

## Kept as it was (on purpose)

- RefreshOnSave on Home, Study, Progress; save-notes "Couldn't save, retrying"; OnceHint how-to lines (Exam Prep, Doubts); reaction stickers; hand-drawn diagrams; "Show answer" on long answers; checkpoint and test logic.
- Course/lectures page: already in good shape (continue card with thumbnail, progress card, week chips, lecture tiles). Not changed; the video player was out of scope.

## Left for others / later

- App shell (mobux): at 320px the avatar in the top bar is clipped at the right edge; in 844x390 landscape the top bar takes 56px of 390. Not changed here.
- Passport fixture showed "0/0" competencies when the list is empty; worth a guard in passport.tsx when there is no competency data.
- Doubts filter chips scroll sideways at 390 with the last chip cut; reads as scrollable but has no edge fade.
- Journey shows eight zero tiles for a new student; a single "your numbers fill in as you study" state would be calmer.
