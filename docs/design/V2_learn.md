# V2 Learn screens (behind `ui_v2`)

Every screen below is the new composition shown only when the `ui_v2` switch is on
(`src/lib/ui/v2.ts`). The old screen is untouched behind the switch. Same loaders, same
server actions, same saving.

## How the switch reaches the screens

- Server pages ask `learnV2()` (`src/components/learn-v2/server.ts`) or `uiV2For(flags, role)`.
- Shared client parts (test runner, card deck, note toolbar, lecture controls, submission
  form) read `useUiV2()` (`src/components/learn-v2/ui-v2.tsx`). The page wraps its screen in
  `<UiV2 on>`. One set of logic, two sets of markup.
- The reader's state lives in one hook, `useReading` (`src/components/study/reader.tsx`),
  used by the old reader and by `reader-v2.tsx`.

## Screens

| Screen | Route | New composition |
|---|---|---|
| Lectures list | `/courses` | `LecturesListV2`: one Continue, courses as rows with a progress line |
| Course | `/courses/[id]` | `CourseV2`: editorial list of lectures by week; Continue on top (phone) or in a right column (desktop); Materials and Assignments as tabs of rows |
| Lecture | `/courses/[id]/lessons/[id]` | `LessonScreenV2`: video edge to edge on phones (sticky while watching, whole screen on a phone's side), title under it, About / Materials / Assignment tabs, Previous / Next pinned low, quiet lecture list on desktop |
| Assignment | same, `?tab=assignment` | brief as reading text, due date, drop zone, files as rows |
| Study home | `/study` | `StudyHomeV2`: one Continue, three shelves as compact rows (two columns on desktop) |
| Module | `/study/[module]` | `ModuleViewV2`: next step, four steps in one row, each step a plain section; parts fold to one line |
| Section reader | `/study/[module]/[section]` | `SectionReaderV2`: reading type 17/28 and 18/30 on a 65 to 68ch line, call-outs without boxes, one toolbar row, section list in a bottom sheet (phone) or a quiet rail (desktop) |
| Checkpoint, module test | `/study/[module]/checkpoint/[n]`, test section | one question per screen, options as large rows, ThumbBar pinned, verdict as a full-width ink band, review as rows |
| Summaries | `/study/notes`, `/study/notes/[id]` | rows by week; editorial note page |

## Local parts (not in `src/components/ds`)

`src/components/learn-v2/parts.tsx`: `Crumb` (quiet way back), `ProgressLine`, `TabRow`
(underlined tabs, links or buttons), `Choices` (text filter), `Quiet` (empty line),
`NextStep` (label, title, thin line, the one lime button). These are candidates to move
into the ds once other areas need them.

## References studied

Screenrove (captured 2026-10-22):
- `skillshare-class-lessons` https://screenrove.com/skillshare/flows#skillshare-class-lessons : lecture list as dense rows under the video, the playing row marked.
- `codecademy-lesson-syllabus` https://screenrove.com/codecademy/flows#codecademy-lesson-syllabus : syllabus rows grouped by part, hairlines, a status mark on the right.
- `codecademy-product-my-learning` https://screenrove.com/codecademy/product/codecademy-product-my-learning : courses as rows with a small progress bar.
- `preply-quiz-goal` https://screenrove.com/preply/flows#preply-quiz-goal : one question per screen, options as 56px rows, one button under them.

UI by Made Good Designs:
- Video player, mobile minimal `10a7a8683380` https://madegooddesigns.com/inspiration/ui/video-player-mobile-minimal-10a7a8683380 : video on top, title, then description and an up-next list.
- Language lesson question, mobile minimal `38e82ffda622` https://madegooddesigns.com/inspiration/ui/language-lesson-question-mobile-minimal-38e82ffda622 : thin progress on top, check button in thumb reach.

Principles taken, not looks: rows over cards, one action per screen, status as a small mark
on the right, the video owns the top of the phone.

## Checks

Harness and scripts: `scratchpad/v2learn-shots/` (build.mjs, entry.tsx, shot.mjs, axe.mjs, sum.py).
- Layout defect detector at 320, 360, 390, 412, 768, 1024, 1440, light and dark: zero defects
  in the Learn content. What is left is outside this area: the top bar's 9px tagline and the
  search key hint (foundation), and the video player's Retry button in its error state (36px
  tall; the player was out of bounds for this pass).
- axe: no serious or critical issues on any v2 Learn screen, light and dark, 390 and 1440.
- Phone landscape (844x390): the lecture video fills the screen; Previous / Next sit under it.
