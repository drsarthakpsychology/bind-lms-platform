# QA: Study, Exam Prep, Lectures, Home (November 2026)

Branch `agent/qastudy`. Tested by reading the code, component tests (vitest, jsdom), and a real browser (Playwright on a built harness of the checkpoint page with the real MSE module content).

## The student's report

"I'm on the MSE module but I'm getting the same quiz at every checkpoint."

What was going on:

1. **A skipped checkpoint came back after every section.** When a student finished a section, the reader sent them to the *first* open checkpoint not yet taken (`src/components/study/reader.tsx`, `finish()`). Continue on the module page and on Home did the same (`dueCheckpoint` in `src/lib/study/checkpoints.ts`). If a student left checkpoint 1 without finishing it, every later "checkpoint" was checkpoint 1 again: the same quiz each time. Pressing "Next" on a section they had already finished did it too.
2. **The level check was copied into a checkpoint.** A "Check yourself" level check (15 questions on the whole level) is a section, so its questions went into the checkpoint that held it. In the MSE module, checkpoint 2 was 2 questions of its own plus the 15 level check questions the student had just answered. Checkpoint 10 was the same. Those questions were about other blocks, not this checkpoint's sections. This happened in every module with level checks (80 level checks, 1215 questions).
3. **Retakes asked everything again.** A checkpoint retake re-asked the questions already answered right (they only moved to the end).

It was not a shared pool: each checkpoint's own questions were already separate. The answer-history ordering (`src/lib/history`) was not at fault either.

## Findings

| # | Severity | Area | What was wrong | Fix | Commit |
|---|---|---|---|---|---|
| 1 | High | Study, checkpoints | A skipped or half-done checkpoint was sent again after every later section, and Continue kept pointing at it (the reported "same quiz at every checkpoint"). | After a section, only the checkpoint that this finish has just opened is offered (`openedCheckpoint`). Continue suggests the most recent open checkpoint and drops ones the student has read past (they stay on the module page). | a3258d1 |
| 2 | High | Study, checkpoints | Level check questions were copied into checkpoints, so one checkpoint repeated the level check just taken, about other blocks. All modules. | A checkpoint takes questions only from its own teaching sections. Level checks keep their own questions. A question written twice is asked once. | a3258d1 |
| 3 | High | Study, checkpoints | A retake re-asked questions already answered right. | A sitting asks never-seen questions first, then missed ones, and none already right. "Try the missed ones again" asks only what is still wrong. When every question is right, the student goes straight to the cards. | a3258d1 |
| 4 | High | Study, scores and certificate | `recordTest` kept the best right count but replaced the total. If a test changed size (for example 18 of 20, then 5 of 15), it saved "18 of 15", which reads as over 100% and passes the 80% certificate rule. | Best and total are saved together, and the better percentage wins. Right counts above the total are clamped. | a3258d1 |
| 5 | Medium | Study, checkpoints | A checkpoint retake scored only the questions in that round. | The saved score is how many of all the checkpoint's questions are right now. | a3258d1 |
| 6 | Medium | Study, tests | A fast double tap on Submit could save a test twice and count two tries. | Submit saves once per sitting. | a3258d1 |
| 7 | High | Study, saving | When the browser copy and the server copy were merged on load, only one copy's test scores were kept. A checkpoint taken in this browser (no new XP, so the server copy won the tie) or a module test taken on another device could disappear. The checkpoint then came back, and the module test showed as untaken. | Test and checkpoint scores are merged from both copies, best of each. | c639258 |
| 8 | Medium | Study, re-tests | The 3, 7 and 21 day re-tests counted attempts, not days. Three tries on day one (to reach 80%) jumped straight to the 21-day re-test. Revise had the same rule. | Tests also store how many different days they were taken on, and the schedule uses that. Old records fall back to their tries. | 192bcbf |
| 9 | High | Exam Prep, topic sets | "Go through again" kept every answer from the last round, so each question opened with its answer and explanation already showing. The end score also mixed in the old round. | Answers clear on a new round, and the score counts only that round. | a45f08f |
| 10 | Medium | Exam Prep, mocks | Two submits of one mock (a second tab, or the timer and the button at once) both recorded every answer to the student model and the answer book. | The attempt row updates only once. A second submit gets the stored result and records nothing. | a45f08f |
| 11 | Low | Smart practice | "More questions" did nothing if the new pick happened to be the same set: the student stayed on the score screen. | It always starts the set afresh. | 084909d |
| 12 | Low | Lectures | "Complete and Continue" redirected to whatever address the call carried, including another site. | Only addresses on this site. Anything else goes to the course page. | f15b6ca |
| 13 | Low | Study, checkpoints | The help button on a checkpoint said "Pass mark: 80%. Your best score counts." Checkpoints have no pass mark. | No pass mark help on checkpoints. | fb54011 |
| 14 | Low | Home | The strongest and weakest topics ignored checkpoint and level check scores, because their keys (`module~cp2`, `module@starting`) are not module ids. Study work before the module test never showed on Home. | They count for their module. | 9bc6770 |
| 15 | Low | Certificates, IST | Certificates and credentials issued before 05:30 IST showed the previous day's date (UTC day). | The issue date is the IST day. | 94d87b9 |

## Tests added

- `src/lib/study/checkpoints.test.ts`
  - In the MSE modules, different checkpoints ask different questions, and none come from a level check.
  - In every module, a checkpoint asks only about its own teaching sections, never repeats a level check, and never repeats another checkpoint's question.
  - A student reading straight through without taking any checkpoint is never offered the same checkpoint twice, and each one offered is a different quiz.
  - Finishing an already finished section again does not lead back to an old checkpoint.
  - Continue suggests the checkpoint just behind the student, not one they have read past.
  - A retake drops right answers, puts never-seen ones first, and is empty when every answer is right.
  - Best and total stay together when a test changes size.
  - Re-tests count days, not attempts.
  - The first four fail on the old rules. This was checked by putting the old rules back.
- `src/components/study/checkpoint.test.tsx`: the real checkpoint screen skips a question already right, saves "2 of 3" for the whole checkpoint, saves once on a double tap, retries only the missed one, then says every question is right.
- `src/app/(dashboard)/prep/runner.test.tsx`: "Go through again" shows no answer and does not count the last round.
- `src/lib/learn/store.test.ts`: test scores survive the browser and server copy merge in both directions.
- `src/lib/progress/strengths-core.test.ts`: checkpoint and level check scores count for their module.

Browser check: the checkpoint page, built with the real MSE content, was played in Chromium at 390 px. Checkpoints 1, 2, 3 and 10 open on different questions (3, 2, 4 and 2 of their own). A retake after all-wrong answers asks all 3 again, and the intro shows "Your best so far: 0 of 3". There were no page errors.

## Checked, no problem found

- Answer-history ordering (`src/lib/history/order.ts`): candidates are only the ones passed in, so it cannot mix checkpoints.
- Module test: answers and explanations show only after Submit. Submit stays disabled until every question is answered.
- Certificate rule (`src/lib/achievements/certificate.ts`): every module test at 80% or more, exact (no rounding up). This is correct now that best and total can no longer drift apart (finding 4).
- Exam Prep practice: the answer is checked on the server and is never in the page before answering. Diagrams show only after answering.
- Mock: the client has a submit lock. The server scores against the stored paper.
- Lecture progress: positions are clamped on the server, and completion is sticky.
- Learn days and streaks use the IST day (`istToday`).
- After the checkpoint key and history key changes: there are no empty checkpoints and no clashing question keys in any module.

## Left as it is, and why

- **Lectures, Continue:** Continue opens the first lecture not completed. If a student skipped one and is half way through a later one, Continue does not resume the later one. Fixing this needs a "last watched" time, and `progress.updated_at` is still an optional migration.
- **Lectures, final lesson:** The "Course complete!" toast shows before the server confirms. It also shows when earlier lessons are not complete. This is a copy and flow change, so it is left for the owner.
- **Study map practice:** The browser gets the answer so it can give instant feedback, and the server grades again. This is by design, as noted in the code.
- **Module tests:** A few questions appear in both a section and its module test (for example interview-mse 2.10 and the module test). The module test is always the full set, so this is left alone.
- **Other UTC dates outside my area:** the practice passport PDF (`src/app/api/practice/passport/pdf/route.ts:52`), admin enquiries (`src/app/(dashboard)/admin/enquiries/page.tsx:47`) and the supervision log default date.
- **Long answers:** Not reviewed in depth. Another agent owns them.
