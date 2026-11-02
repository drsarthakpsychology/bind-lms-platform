# Study: the course

Study is the main learning section for students. It sits in the main menu (Home, Lectures, Study, Practice) and appears only when the "Learn" switch in Admin → Content → What's live is set to Unlocked.

## How a student moves through it
1. **/study**: one big "Continue" button that always opens the single next step, then the 22 modules in curriculum order.
2. **/study/[module]**: four steps, the current one highlighted:
   1. Read every section (each ends with a recall check).
   2. Write it out on paper (tick when done).
   3. Practise: the module's activities (Coach, quizzes, cases, Detective, clinical words). Each opens and then returns to the module.
   4. Test: the module test. Re-tests are scheduled 3, 7 and 21 days later and show up first on the Continue button when due.
3. **/study/[module]/[section]**: the reader. Contents column on desktop, drop-down on phones, one "next" button at the bottom.

Study time is counted only while the page is open and the student is active, saved every minute.

## Content
- One file per module in `src/content/study/` (Module 1 is split into three parts).
- Written in a small Markdown dialect, parsed by `src/lib/study/parse.ts`:
  - `# Part` and `## 1.2 Title [core|extra]`
  - Blocks: `:::define`, `:::word`, `:::trap`, `:::mnemonic`, `:::example`, `:::sounds`, `:::analogy`, `:::note`, `:::safety`.
  - `:::recall` (question `||` answer), `:::viva` (question `::` answer), `:::mcq` (`Q:`, options, `- *correct`, `> why`).
- `src/lib/study/study.test.ts` checks every module: it parses, has a test, has no maths symbols and no book names, and every question has one correct answer.
- Module 1 (Interview and MSE) is the VIBHA study notes. The other modules follow the same format, checked against DSM-5-TR, Kaplan & Sadock and Stahl.

## Old addresses
`/practice/learn/*` and `/practice/notes/*` redirect to `/study/*`.
