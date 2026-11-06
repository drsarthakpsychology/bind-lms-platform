# Module: Student experience
> Verified against `main` @ `b2a9698`.

| Area | Route(s) | Notes |
|---|---|---|
| Home | `/dashboard`, `/today` | lecture list, next action, streak, level card (`StandingCard`) |
| Lectures | `/courses/[id]`, `/courses/[id]/lessons/[id]`, `/materials/[id]` | player, materials, assignments; cohort filter chips |
| Notes | `/study`, `/study/notes`, `[module]` | reading + self-checks; XP into `learn_progress` |
| Games | `/games` (`coach, play, detective, scenarios, terms, quizzes, revise, lab, progress, leaderboard`) | Learn engine `src/lib/learn/*`; Lab/Casebook content in `src/content`, `src/lib/lab` |
| Practice | `/practice/*` (25 pages) | flat tool list from `src/lib/practice/tools.ts`; [PRACTICE_AND_AI](PRACTICE_AND_AI.md) |
| Medicines | `/practice/medicines`; `/tools/psychopharm` redirects | `src/lib/meds`, Student/Clinician view toggle, fast search |
| Leaderboards | `/leaderboard` (Overall), `/games/leaderboard` (Quiz), `/practice/leaderboard` (Rankings w/ weekly) | `src/lib/standing/*`, `src/lib/learn/leaderboard.ts`; Quiz board lists whole cohort |
| Doubts | `/doubts`, `/doubts/[id]` | per-cohort |
| My journey | `/journey` (also `/passport`, `/record`) | hours online, competencies, passport PDF |
| Wall / Journal | `/wall`, `/reflect`, `/notifications` | anonymous peer wall, private journal |
| Settings | `/settings` | account |
| First login | modal form over all pages until completed | `student_details` |
Points: notes/games XP + 1/min lecture + 25/lecture finished + 10/hour on VIBHA (`src/lib/standing/score.ts`); points cannot go negative (`Math.max(0, …)`).
Lectures-only accounts see Home, Lectures, Doubts, My journey only.
