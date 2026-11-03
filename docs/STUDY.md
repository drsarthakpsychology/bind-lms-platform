# Notes and Games

Students see two learning sections in the main menu: **Notes** (`/study`) and **Games** (`/games`). Menu order: Home, Lectures, Notes, Games, Practice (on phones, Practice moves into "More"). Both appear only when the "Learn" switch in Admin → Content → What's live is set to Unlocked.

## Notes: how a student moves through it
1. **/study**: one "Continue" card that always opens the single next step, then the 23 modules in curriculum order (about 85 hours), with about 290 case questions in checkpoints plus every module test.
2. **/study/[module]**: four steps, the current one highlighted:
   1. Read the notes (every section). After every block of about three sections, a **checkpoint** quiz opens once the student has moved on to the next section (not straight after reading). It comes before more reading: case questions first, then say-it-aloud cards (`src/lib/study/checkpoints.ts`).
   2. Write it out on paper (tick when done).
   3. Practise: the module's games. Each opens and then returns to the module.
   4. Test: the module test. Re-tests are scheduled 3, 7 and 21 days later and show up first on the Continue card when due.
3. **/study/[module]/[section]**: the reader.
   - Each section is split into short parts (`src/lib/study/chunk.ts`): a new part at each sub-heading, or after about 200 words.
   - **Phones**: one part per screen, with a fixed Back / Next bar at the bottom. Nothing else on screen.
   - **Desktop**: contents column on the left; parts appear one after another with a "Continue" button, so the student is never faced with a wall of text.
   - Tables become stacked cards on phones.
   - Self-checks are never inside the reading, and recall questions are not asked the moment a section ends; they wait for the checkpoint. The module test has its own start screen and shows one question at a time, with answers at the end.
4. **/study/notes**: one-page summaries for quick revision.

Study time is counted only while the page is open and the student is active, saved every minute.

## Games
- **/games**: the hub. One lime "Play now" card (review due, else the next quiz, else Coach), then all games as calm white cards.
- Games: Coach, Quiz path (`/games/quizzes`), Clinic detective, What would you do?, Say it clinically, 60-second blitz, and Progress (`/games/progress`).
- Games opened from a module carry `?from=/study/<module>` and their Back button returns there.

## Content
- One file per module in `src/content/study/` (Module 1 is split into three parts).
- Written in a small Markdown dialect, parsed by `src/lib/study/parse.ts`:
  - `# Part` and `## 1.2 Title [core|extra]`, `### sub-heading`
  - Blocks: `:::define`, `:::word`, `:::trap`, `:::mnemonic`, `:::example`, `:::sounds`, `:::analogy`, `:::note`, `:::safety`.
  - `:::recall` (question `||` answer), `:::viva` (question `::` answer), `:::mcq` (`Q:`, options, `- *correct`, `> why`).
  - An `:::mcq` inside a reading section is a checkpoint case question (hidden from the reading). The section titled "Module test" is the module test.
- `src/lib/study/study.test.ts` checks every module: it parses, has a test, has no maths symbols and no book names, every question has one correct answer, and no self-test leaks into the reading.
- Module 1 (Interview and MSE) is the VIBHA study notes. The other modules follow the same format and depth.

## Logo
Every VIBHA logo links to `/go/home`: signed-in students go to their dashboard (admins to /admin); everyone else goes to the homepage.

## Old addresses
- `/study/coach`, `/study/play`, `/study/detective`, `/study/scenarios`, `/study/terms`, `/study/progress`, `/study/activities` → `/games/...`
- `/practice/learn/*` → `/games/*`; `/practice/notes/*` → `/study/notes/*`
