# To connect: Lab, Casebook, Ethics, interview, self-checks, calm, Search

Built in the Layers look by the "blab" builder (21 Nov 2026). This lists what
each screen shows today and what it needs from the server later. Nothing here
changed the API client, the server routes, the website or the database.

## Routes added (please list them in `app/_layout.tsx`)

The foundation owns `app/_layout.tsx`, so these screens hide the stack header
themselves (`OwnHeader` in `src/lab/shell.tsx`). Listing them gives the right
opening motion from the first frame.

| Route | Screen | Motion kind |
|---|---|---|
| `search` (already listed) | `src/search/screen.tsx` | overlay |
| `lab/index`, `lab/[id]` | `src/lab/screens.tsx` | `growOr(..., m.push)`, header hidden |
| `casebook/index`, `casebook/saved`, `casebook/[id]` | `src/casebook/screens.tsx` | `growOr(..., m.push)`, header hidden |
| `ethics/index` | `src/ethics/screens.tsx` | `growOr(..., m.push)`, header hidden |
| `ethics/[id]` | `src/ethics/screens.tsx` | `growOr(..., m.play)`, header hidden |
| `interview/index` | `src/interview/screen.tsx` | `growOr(..., m.push)`, header hidden |
| `selfcheck/index`, `selfcheck/[id]` | `src/selfcheck/screens.tsx` | `growOr(..., m.push)`, header hidden |
| `calm/index`, `calm/[id]` | `src/calm/screens.tsx`, `src/calm/breath.tsx` | `growOr(..., m.push)`, header hidden |

Also for `src/nav/targets.ts`: website `/games/lab` to `/lab`, `/games/lab/cases` to
`/casebook`, `/practice/ethics` to `/ethics`, `/prep/interview` to `/interview`,
`/free` to `/selfcheck`, `/free/calm/*` to `/calm/*`.

## To connect

| Screen | File | Today | What it needs | Website code that has it |
|---|---|---|---|---|
| Psychology Lab, home and experiment | `src/lab/screens.tsx`, data in `src/lab/mock.ts` (`mock-data.json`) | All 12 experiments copied from the website on 21 Nov 2026 (no educator-only notes). Runs and check scores are kept on the phone (`src/lab/progress.ts`). | `GET /lab` (catalogue, behind the `lab` switch, with what this student has run), `GET /lab/:id`, `POST /lab/:id/run` and `/check` and `/reflect` to save into the learn state. | `src/lib/lab/experiments.ts`, `experiments2.ts`, `src/app/(dashboard)/games/lab/gate.ts` (`requireLab`), `src/lib/learn/engine.ts` (`recordLabRun`, `recordLabCheck`, `recordLabReflection`) |
| Lab runners | `src/lab/runners-a.tsx`, `runners-b.tsx`, `scoring.ts`, `scoring2.ts` | Run fully on the phone. `scoring*.ts` are copies of the website's files. | Nothing to run. Keep the scoring copies in step (a test like the search engine's "same file" check would do it). | `src/lib/lab/scoring.ts`, `scoring2.ts`, `src/components/lab/runners/*` |
| Reflection on an experiment | `src/lab/screens.tsx` ("Think about it") | Shows the prompt only; nothing is written. | A text box saved with `recordLabReflection`. | `src/components/lab/experiment-view.tsx` |
| Casebook: browse, case page, player | `src/casebook/screens.tsx`, data in `src/casebook/mock.ts` (`mock-data.json`) | A sample: 15 activities, two of each of the eight formats, at most 12 items each. | `GET /casebook` (list, behind the `lab` switch) and `GET /casebook/:id` with all items; adaptive rounds (`buildRound`, `nextTier`). | `src/content/casebook/*.ts`, `src/lib/casebook/rounds.ts`, `validate.ts`, `src/components/casebook/case-player.tsx` |
| Your saved cases, best scores | `src/casebook/progress.ts` | On the phone only (`vibha.recent.casebook-saved`, `vibha.casebook.best`). | Saved cases and results in the learn state, so they follow the student to the website. | `src/content/casebook/index.ts` (`caseKey`), `src/lib/learn/engine.ts` |
| Ethics | `src/ethics/screens.tsx` | REAL DATA: `GET /practise/tools/ethics` (the day's three dilemmas and the quick check). Answers go to the answer history (`noteAnswers`). | Nothing. The older `/case/ethics` screen can now point here. | `src/lib/app-api/practise.ts` |
| Mock interview | `src/interview/screen.tsx`, data in `src/interview/mock.ts` | A sample of 14 questions with their model answers, on the phone. The round is not saved. No AI feedback. | `GET /prep/interview` (five questions, no answers), `interviewReveal` (rubric after answering), `interviewFeedback`, and saving the session. The server side was written on branch `agent/appaudit` (`src/app/api/app/v1/prep/interview/route.ts`, `src/lib/app-api/prep.ts`) but never merged. | `src/app/(dashboard)/prep/interview/*`, `src/lib/prep/interview.ts`, `src/lib/prep/bank.ts`, `loadInterviewHistory` in `src/lib/prep/server.ts` |
| Self-checks | `src/selfcheck/screens.tsx`, `tests.ts` | Complete. The six questionnaires are a copy of the website's file; scoring is on the phone and nothing is stored, as on the website. | Nothing to connect. Keep `tests.ts` in step with the website. To open them to signed-out visitors, add `selfcheck` and `calm` to `PUBLIC` in `src/nav/guard.ts`. | `src/lib/free/tests.ts`, `src/components/free/test-runner.tsx` |
| Calm | `src/calm/*` | Complete: breathing, grounding, muscle relaxation, worry sorter. Nothing is stored. The website's fifth one (calm bubbles) is not built. | Nothing to connect. | `src/lib/free/calm.ts`, `src/components/free/calm-tools.tsx` |
| Search | `src/search/screen.tsx` | REAL DATA: lists already on the phone (lectures, modules, notes, quick reference, medicines with brand names) searched with the website's typo-tolerant engine, plus `GET /search` once typing pauses. | The mock server (`src/api/mock/server.ts`) has no `/search`, so the browser build shows the phone's results only. The handler exists unsaved on branch `agent/search`. Lab and Casebook results come from the mock files until those have an API. | `src/lib/search/engine.ts` (the app's copy is `src/search/engine.ts`, byte for byte), `src/lib/search/everything.ts` |

## Left for other builders

- `src/screens/search/search.tsx` is the old search screen. The route no longer uses it; four older tests still import it. Delete both together.
- `/case/ethics` (the older tool screen) still works; Search and the entry card open `/ethics`.
- Entry cards live in `src/lab/entries.tsx` (`PractiseExtras`, `WellbeingExtras`, or one card at a time). They are not placed on any tab yet.
