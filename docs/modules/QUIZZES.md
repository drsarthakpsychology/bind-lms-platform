# Module: Quizzes, games & assessments
> Verified against `main` @ `b2a9698`. Flow: [ASSESSMENT_FLOW](../workflows/ASSESSMENT_FLOW.md).

## Two assessment families
1. **Learn engine (Notes/Games)** — `src/lib/learn/*` (engine: XP, levels, streaks, adaptive coaching, integrity checks), content in `src/lib/learn/content`, `src/content/study`, `src/content/casebook`; progress JSON per user in `learn_progress` (server-written; RLS migration `2026_11_learn_progress_server_writes.sql`). UI: `/games/{quizzes,play,coach,detective,scenarios,terms,revise,lab}`, notes checkpoints under `/study`.
2. **Practice assessments** — SCT/Judgment, MSE, OSCE, Formulation attempts with rubric scoring (`src/lib/practice/rubric.ts`, `ai/scoring.ts`), tables `*_attempts`.
Static quiz banks: `src/lib/quiz/{quiz-bank,phase1-bank}.ts` (`scoreQuiz`, `bestResponse`, `spotTheError`); API `/api/practice/quiz/attempt` → `quiz_attempts`.
Item counts reported at the 2026-11-03 audit: 76 quiz-bank items, 303 checkpoint MCQs, 36 Casebook games, 12 Lab experiments (`INFERRED`, not re-counted here).
## Leaderboards (two, by design — `src/lib/standing/boards.ts`)
- **Quiz leaderboard** `/games/leaderboard`: Learn XP, this week; shows the whole cohort (window 100).
- **Overall leaderboard** `/leaderboard`: level points all-time (`pointsFor`: XP + 1/lecture-minute + 25/finished lecture + 10/hour). Rankings with weekly + all-time at `/practice/leaderboard`.
Scores are floored at 0; there is **no penalty mechanism** (design decision pending with owner).
## Item quality
Item-bank audit: `docs/item-bank-audit.md`, `scripts/audit-item-bank.ts`; educator review of Lab/Casebook before unlocking `lab` is an owner TODO (`NEEDS_KAVYA.md`).
