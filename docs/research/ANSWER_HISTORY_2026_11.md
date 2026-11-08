# Answer history audit (November 2026)

Owner's ask: every quiz, game and practice tool keeps a record of what each
student answered and how, and a new round never starts from the exact same
place.

The rule every tool now follows (src/lib/history/order.ts):

1. items never seen, in a random order;
2. then items answered wrong, once their short gap is up (oldest due first);
3. then wrong ones not due yet, then items seen without a grade;
4. right ones last, oldest first, so they recycle in turn.

A round of n takes the first n. Missed items are spread out among the new
ones, and a round opens on a new item whenever one is in it.

## The shared pieces

| Piece | File | What it does |
| --- | --- | --- |
| Order (pure) | src/lib/history/order.ts | orderByHistory, pickRound, poolFor (for tools with their own mixing), leadWithUnseen, spreadOut, nextFresh, mergeHistory, nextRow |
| Server | src/lib/history/server.ts | record(userId, tool, itemId, correct), recordHistory (many), loadHistory, order(userId, tool, candidateIds). Service role. Fails open: no table or a failed query means empty history, random order, dropped writes |
| Viewer | src/lib/history/viewer.ts | orderForViewer, nextFreshForViewer for server-rendered rounds |
| Server actions | src/lib/history/actions.ts | loadMyHistory(tool), recordMyAnswers(tool, answers) for browser tools |
| Browser | src/lib/history/client.ts | localStorage copy per tool (try/catch, one copy per student), merged with the server copy; noteAnswer, pickRoundFor, orderFor, useHistoryPrefetch (effect sets no state) |
| Table | supabase/migrations_pending/2026_11_answer_history.sql | answer_history (user_id, tool, item, seen_count, last_correct, last_seen_at, next_due). RLS: own rows only (select, insert, update). Idempotent |
| Exam Prep adapter | src/lib/prep/history.ts | Prep keeps prep_answers and prep_seen; this reads them in the same shape. Prep does not write to answer_history |

## Tool by tool

| Tool | How it picked before | Already recorded? | Now |
| --- | --- | --- | --- |
| Exam Prep topic sets (question bank) | Fixed sets, opens at first unanswered; a finished set reopened at question 1 | Yes: prep_answers (last answer), prep_seen, learning engine | Finished set reopens at the first wrong one, else the oldest answer; the topic opens the first set with an unanswered, then a wrong one (src/lib/prep/progress.ts) |
| Exam Prep mocks | Fewest-seen first (prep_seen counts), mixed difficulty | prep_seen and the engine only; mock answers were not in prep_answers | Paper follows the history order per section, difficulty mix kept, right ones recycle oldest first; section opens on a new question. Submitted mock answers now also go into prep_answers (one batch upsert) |
| Smart practice (/prep/smart) | Goldilocks mix from weak subjects, right answers held back while enough others | Yes (prep_answers) | Pool = due reviews plus history order (new, wrong, right only when short); opens on a new question |
| Smart practice: Coach | relearn, due, similar, fresh (fresh in content order with a small offset) | Yes: per-concept seen/right/wrong in the learn state (learn_progress) | Fresh and similar concepts shuffled; session opens on a new concept with relearn and review ones spread out (src/lib/learn/adaptive.ts) |
| Smart practice: Quiz path / Play (lessons) | Lesson items in authored order, every time | Only wrong answers (srs) and lesson stars | Order picked on the server per request from the "learn" history (/prep/smart/play); every lesson answer recorded |
| Smart practice: Review | Due spaced-review items (wrong ones) | Yes (srs) | Unchanged by design (it is the wrong-ones list); answers also recorded to "learn" |
| Smart practice: Revise | Lists what to revisit; links to the tools | n/a | Unchanged (no picker) |
| Study map practice (/study/map/practice) | Goldilocks session, fresh random seed | Yes: learning engine (review_cards, item_stats) | Pool narrowed by the "learn" history (due reviews kept); opens on a new question; each answer recorded on the server |
| Study level checks | Section MCQs in authored order | Best score only | Each start and "Try again" reorders by the "study-check" history; answers recorded |
| Study checkpoints | Fixed seeded shuffle by checkpoint key: identical for everyone, every time | Best score only | Reordered on Start by the "study-check" history; answers recorded |
| Study module tests | Authored order | Best score only | Reordered on Start and Try again by "module-test" history; answers recorded |
| Daily case (today's case) | One case per day for everyone | Yes: daily_case_results | Unchanged by design (shared case of the day) |
| Daily case practice | Unseen first at the target level; once all played, random | Yes: daily_case_results | Once all are played: unsolved cases first (level aim kept), then solved ones strictly oldest first |
| Duel | Seeded random 5 with mixed topics | Yes: match_answers per round | Rounds from items neither player has seen (re-picked for both players when the match is claimed); each round's diagnosis answer recorded |
| Blitz | Seeded random deck per run | Run totals only (blitz_results) | Run deck (150 bank indexes, in the signed token) follows the history; every answer recorded after the response (never slows the timer). Old tokens and no history: seeded order as before |
| Criteria sort (practice) | Random board | Yes: sort_results | Boards never played first, then unsolved, solved ones last, read from sort_results |
| Criteria sort (daily) | One board per day | Yes | Unchanged by design |
| MSE Lab (/games/mse) | Random excerpt at the level | Yes: games2_results and the engine | Excerpt at the level by history order; recorded on the server and in the browser copy |
| MSE trainer level 1 (observe) | Index 0 in fixed order, every visit | Yes: /api/practice/mse/attempt | Order picked on the server from history (page is server-rendered); results recorded |
| MSE trainer level 2 (domain) | Random seed per visit | Yes (mse attempts) | Domain round by history order; results recorded |
| MSE trainer level 3 (confusable pairs) | Fixed order from the first pair | No | Pairs by history order; each pair recorded |
| MSE trainer level 4 (full MSE) | Index 0 in fixed order | Yes (mse attempts) | Order picked on the server; results recorded |
| MSE small things drill | Fixed short teaching list | No | Not changed (a short fixed walk-through, not a question bank) |
| Rx Detective | Random per kind | Engine only | Each kind's pool by history order; recorded in gradeRxAnswer and the browser copy |
| Ward Week | Student chooses one of three branching stories | Engine and games2_results | Every decision recorded ("ward"); no picker to change (the student chooses the story) |
| Escape Room | Student chooses a room; locks are a fixed sequence | Engine and games2_results | First try at each lock recorded ("escape"); stage order is the puzzle itself, so not reordered |
| Comorbid | Random diagnoses from the seed | Engine and games2_results | Player 1's diagnosis is the first by history order (sent as `prefer`, replayed the same on the server and for hints); win or loss recorded |
| Clinic detective | Random 8 cases | Learn state totals only | Round by history order, missed ones spread out; each case recorded |
| Two-minute clinic | Random start line, then sequential | No | Order picked on the server from history; Next walks it; each line recorded as seen |
| What would you do? | Random 5 scenarios | Learn state totals only | Round by history order; a scenario counts as right when every step took the best response |
| Say it clinically | Random 8 terms and 4 wordings | Learn state totals only | Both by history order, opens on a new one; each answer recorded |
| OSCE stations | Daily rotation list; random station button | Yes: /api/practice/osce/attempt | "Pick a random station" takes the first by history order; each station's result recorded (list order unchanged) |
| Formulation | Always opened on case 1 | Yes: /api/practice/formulation/attempt | With no case asked for, opens the first case by history order; result recorded |
| Landmark cases | Always case 1 first | No | Case order picked on the server from history; each case recorded as read on Next |
| Weak spots drill | Same 10 items in template order every time | No (rubrics come from sim_scores) | Drill by history order (top skills still first inside each group), missed ones spread out; each item recorded |
| Long answers | Browse list; Next = next in list | Drafts and ticks in the browser only | Opening and the self-mark (60 % of key points) recorded; Next goes to an answer not opened yet, then a missed one |
| Exam Prep interview | Unseen first (prep_interview_sessions) | Yes | Unchanged (already unseen first) |
| Quick checks (QuizCheck on several pages) | Fixed short slices, first item rendered on the server | Yes: /api/practice/quiz/attempt | Not changed: short fixed checks embedded in pages; reordering would need each page to pick on the server |

## Fail-open

Before the migration is pasted, every read of answer_history returns
"not ready" and every write is dropped. Server-picked rounds fall back to a
fresh random order per request. Browser tools still use the localStorage
copy, so a second round in the same browser already skips what was just
answered. Exam Prep needs no new table (prep_answers and prep_seen exist).

## Tests

- src/lib/history/order.test.ts: unseen first, right ones out until all seen, wrong ones back (due first), oldest right first on recycle, two rounds never open the same, spread-out, merge, no-history random.
- src/lib/history/server.test.ts: missing table and unreachable database fail open; ordering from stored rows; one idempotent upsert per item.
- src/lib/history/client.test.ts: browser copy, server sends, offline and blocked storage, another student's copy dropped.
- src/lib/history/tools.test.ts: Rx Detective, MSE Lab, MSE trainer domain round, Comorbid preference, walk-through Next.
- Per-tool pickers: src/lib/prep/history.test.ts (mocks, Smart practice, topic sets), src/lib/learn/model/student.test.ts (map practice), src/lib/learn/adaptive.test.ts (Coach), src/lib/games/daily/engine.test.ts, src/lib/games/blitz/engine.test.ts, src/lib/games/duel/engine.test.ts, src/lib/practice/weak-spots.test.ts.
