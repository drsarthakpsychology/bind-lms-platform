# Games and Practice QA, November 2026

Branch `agent/qagames`. Area: Games (Daily case and its practice tab, Duel, Blitz, Criteria sort, MSE Lab, Ward Week, Rx Detective, Escape Room, Comorbid), Practice tools (MSE trainer, OSCE, Formulation, Landmark, Clinic detective, What would you do, Say it clinically, Two-minute clinic, Weak spots, Check-in, Supervision, Skills passport), Medicines, and the hint system.

How it was tested: by reading every flow, by unit and component tests (`gate.sh vitest`), by type checks (`gate.sh tsc`), and by playing the Daily case in a phone browser (Playwright, 320, 360 and 390 px wide) against fixtures that run the real case rules. The live site and database could not be reached from the shell. One read-only query confirmed that every game table exists on the live database (`daily_case_results`, `hint_ledger`, `matches`, `ratings`, `games2_*`, `sort_results`, `blitz_results`, `xp_ledger`), so the "table missing" fallbacks are not live.

Severity: **Critical** (answers or hidden content shown, or a way to farm rewards), **High** (a student gets stuck or loses work), **Medium** (wrong, or cheatable with effort), **Low** (polish, or a guard).

## Fixed

| # | Severity | Where | What was wrong | Fix | Commit |
|---|---|---|---|---|---|
| 1 | Critical | Daily case, both tabs | After a case ended, the server sent every clue and every test result, and the board printed the unopened clues in full under "Unopened:" (the owner's screenshot). | The case view now carries only the clues and tests the student opened, even after the end. After the end, one small "Show the other clues" button asks the server (`dailyRest`) for the rest; the server refuses while the case is still being played. Tests check that no unopened clue or test result is in the view. | `e864e54` |
| 2 | Critical | Clinic detective | Every case, all four clues and the answer were in the browser code. After a case every unopened clue was printed. The hint sent the answer up from the browser. | The server now deals the run (answer history order). The browser gets the four options and clue 1, then each clue only when it opens, and the answer only when the guess is right or the last clue is used. The deal is a signed token whose case numbers are hidden by a secret mask (the token is readable, so it holds no ids or answers). The hint reads the answer from the token on the server. After a case, "Show the other clues" asks for the rest. Checked by bundling the client code: no detective clue text is left in it. | `c5bdf74` |
| 3 | Critical | Rx Detective, Ward Week, Comorbid, Escape Room | XP is paid once per run, but the run id comes from the browser, so calling the finish action again with new ids paid up to 200 XP each time, without end. | `payXp` now checks what the same game already paid today (India time) and stops at 400 XP a day per game. Tested. | `3bd1a31` |
| 4 | High | Hints, every game | Hints were hard to use: a small count chip and a separate small button, often away from the question (Daily case: one of four buttons, with the hint text in a box higher up; MSE Lab: beside "Change part" under the options; Comorbid and Ward: special labels). | One `HintButton` everywhere: "Hint" with "N left" on it (free plus spares), one tap uses one, a second fast tap does nothing, the hint shows right under the button, the cost is explained once (OnceHint `hint-cost`), and when none are left the "Get 3 hints for 30 XP" button or the "come back at midnight" line is on screen. Full width and 44 px tall on phones. Server rules unchanged (3 free a day in India time, spares capped at 10, wrong-answer help free, no hints in Duel or Blitz). Component tests added. | `8e4076e` |
| 5 | Medium | MSE trainer, small things drill | The reference card listed every moment's meaning, including the ones not reached yet. | The card lists only the moments already read; buttons are 44 px tall. | `c5bdf74` |
| 6 | High | Blitz | A failed answer (no connection) left every button locked until the clock ran out. A failed start or finish left the countdown or "finishing" screen up for good. | Each failure shows a short line and can be tried again. | `8b6bb7e` |
| 7 | High | Differential duel | A failed answer kept the round locked. | The round unlocks so the answer can be sent again. | `8b6bb7e` |
| 8 | High | Criteria sort, Daily case | A failed server call inside a transition threw to the error page. | A calm line instead; the board and tiles stay. | `8b6bb7e` |
| 9 | Medium | Escape Room, team | A lost connection counted as a wrong answer: shake, "+20 seconds" line and the "wrong" sticker. | It now says the answer was not sent; no penalty line, no sticker. | `8b6bb7e` |
| 10 | Medium | Escape Room | The free help after two misses sat behind a 36 px "Hint" toggle that closed again after every miss. | The help shows by itself once it opens (it is free). | `8b6bb7e` |
| 11 | Low | Rx Detective | A double tap could send the same answer to the server twice. | A guard per question. | `e12856f` |
| 12 | Low | Clinic detective, Say it clinically, What would you do | Answer handlers had no guard against counting one answer twice. In tests React re-renders between taps, so this was not reproduced; kept as a cheap guard. | Each answer counts once per question. | `e12856f` |
| 13 | Low | What would you do | Options were shuffled with `Math.random` during render. | Shuffled once per step. | `e12856f` |
| 14 | Low | Daily case, phones | On 320 to 375 px the tabs read "Toda..." and "A...". | Below 420 px the icons and the "Soon" tag drop; below 380 px the first tab reads "Today". | `9acd24a` |

## Checked and fine

- **Starting, playing, winning, losing, playing again:** Daily case (both tabs and practice "next case"), Blitz, Duel (bot and ranked), Criteria sort, MSE Lab, Rx, Ward (solo and team), Escape (practice and team), Comorbid, Clinic detective, What would you do, Say it clinically, Two-minute clinic, OSCE, Weak spots. Play again resets every piece of round state.
- **Scoring:** the Daily case score is worked out on the server (`scoreOf`) and the board shows the same numbers. Sort, Blitz and Duel score on the server. The games that run in the browser are graded again on the server before XP is paid.
- **Saving and reloading:** the Daily case, Sort, Blitz and Duel are stored on the server and come back after a reload. Ward solo resumes from the browser.
- **Answer history:** Daily practice, Sort, Blitz, Duel, MSE Lab, Rx, Escape, Comorbid, Clinic detective (now on the server), What would you do, Say it clinically, OSCE, Formulation, Landmark, Two-minute clinic and Weak spots all order by history (unseen first, missed next, solved last). Ward records history; its campaigns are picked by the student.
- **Reaction stickers:** every game and drill above shows answer and end stickers, and timed games (Blitz, Duel) keep them to the end screen.
- **How to play:** every game and practice tool has the how-to. It closes when Play is pressed, and it hides while Blitz's clock runs (that clock cannot pause).
- **Timers:** Blitz uses the server clock and clears its timers. Duel syncs to the server clock. Escape team time comes from the server. OSCE and Two-minute clinic clear their intervals.
- **Team and shared links:** Ward and Escape team views check that the viewer is in the team. A link opened by someone else shows "Team not found" with a way back.
- **No hints in Duel or Blitz:** no hint button there, and the server refuses them.
- **Page props:** no game passes answers in page props on the live site. Duel's offline fallback would, but it only runs when the duel tables are missing, and they exist.
- **Check-in, Supervision, Skills passport, Medicines:** forms disable while saving. Medicines search has an empty state.

## Left, and why

| Severity | Where | What | Why it is left |
|---|---|---|---|
| Medium | MSE Lab, Rx Detective, Ward Week, Escape Room | These games run in the browser. Their answer keys (right options, door answers) are in the page's JavaScript, not in the HTML or page props. The server grades again before XP is paid, and XP is now capped at 400 a day per game, but a student who digs through the JavaScript can find the right options and post a perfect accuracy board score. | Each needs the same rebuild Clinic detective got (deal on the server, check each answer there), about a day per game. Suggested order: Escape (team race board), Rx, MSE Lab, Ward. Comorbid is a card game against a bot; its rules are not secrets. |
| Low | Landmark, OSCE "Quick check", MSE "Quick check" | Self-check quizzes carry the right answer in page props. | No score, no XP, nothing saved: a self-check, not a test. |
| Low | Duel effort XP, Blitz learn credit | Credited by the browser into Learn state. | Learn saves are already clamped on the server (`clampLearnSave`). Ranked wins pay on the server. |
| Low | Rx, Escape practice | A reload loses the run in progress. | Runs are short; saving them is a separate feature. |
| Low | XP cap | Two finishes sent at the very same moment could both pass the daily cap once. | One extra run's XP at most. |

## Tests added

- `src/lib/games/daily/engine.test.ts`: unopened clues and tests never in the view, even after the end; `restOf` only after the end.
- `src/components/hints/hint-chip.test.tsx`: one button with the count, one tap spends one, the hint shows under the button, the cost line shows once, errors in place, buy button when out, phone size.
- `src/lib/learn/detective-deal.test.ts`: the deal sends options and clue 1 only, the token hides case numbers, the case is found only for the same student, the answer comes back only when right or over, history order and family are kept.
- `src/lib/games-sims/xp-cap.test.ts`: the daily ceiling.
- Updated `src/components/learn/finish-reaction.test.tsx` and `src/components/help/how-to-games.test.tsx` for the server-dealt Clinic detective.
