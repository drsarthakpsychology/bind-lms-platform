# Release notes: learning platform rebuild (November 2026)

Branch: `admin-redesign` (the test link). Nothing here is on the main site until the owner says "merge".
Decisions behind this work: docs/plans/STUDENT_LEARNING_PLAN.md.

## Study modules

- 39 modules, each with Starting, Beginner and Advanced levels. A level check at 80 percent opens the next level, and a student can test out.
- Student and Clinician views on every page. Doses and timings sit in the Clinician view or in guess reveals, never as week numbers in student prose.
- About 1,550 fully worked Q&As (short answer, step by step, tables, Indian or worked example) and a Module test in every module.
- About 2,480 visuals and interactions across the modules.
- No formal references, citations or dashes in student text. Guard tests enforce both.
- New modules this round include pharmacokinetics, research methods, statistics, NET Paper 1, social, personality theories, lifespan, sensation and perception, learning and memory, thinking and language, motivation and emotion, foundations and applied psychology.

## Widgets (author guide: docs/design/CONTENT_WIDGETS.md)

Original set: guess, decide, sort, build, moodline, worked, synapse, reveal, flow, curve, layers, brainmap.
Animated: journey (how a medicine travels), neuron, pathways, receptor.
Wave 2: conditioning, memoryflow, stress, timeline, compare.
Wave 3: attention, dissonance, conservation, experiment, release, thoughtrecord, hypnogram, strange, illusion.
All stop under reduced motion, describe every state in words and work on phone, tablet and desktop. The timeline shuffle never starts in the correct order.

## Real diagrams (8 November)

- `figure` widget: 107 hand-drawn labelled illustrations, each researched before drawing. 51 anatomy (brain surfaces and slices, deep structures, brainstem and cord, senses, chemical pathways, cortex maps, autonomic, HPA and endocrine, EEG, rTMS and ECT placement) and 56 clinical and psychology figures (medicines at the synapse, receptors, drug level curves, EEG and sleep, plotted curves, classic study set-ups such as the Skinner box, Strange Situation room, visual cliff, Milgram and Asch).
- Labels sit in the margins with leader lines to the exact part; tap to highlight and read what the part does; quiz mode hides names; zoom and pan on phones.
- About 340 placements in Study modules, and inside the one-page notes beside the section they explain (`src/lib/learn/notes/figures.ts`) plus a "See it" block.
- 1,561 Exam Prep questions show a picture after answering; every medicine page has extra pictures.

## Animation pacing and 3D

- One shared step player: every step-by-step widget opens on step one and waits for Next; Play holds each step for reading time (about 250 ms a word, never under 3 s) and stops off screen.
- 3D scenes: glowing pathways and travelling signals, tap ripples, a quick challenge per scene, optional sound, gentle idle motion that stops on first touch. Budgets in docs/research/3D_PERFORMANCE_2026_11.md.

## Exam preparation

- One section, "Psychology Entrance & Competitive Exam Preparation" (CUET-PG, UGC-NET, clinical psychology entrances), with one shared curriculum. Exam-specific tracks are built but switched off (`EXAM_TRACKS_ENABLED`).
- About 3,740 questions across 20 subjects in six exam formats, and about 260 interview questions with model answers.
- Statements are numbered 1 to n to match options such as "1 and 2 only".
- Answer keys are spread so no option can be guessed; `src/content/prep/balance.test.ts` fails if one option holds more than 40 percent of a question type.
- Starting checks and the track record (placement quiz, rank on mocks, past mocks list) are switched off with `PREP_ONBOARDING_ENABLED = false`; the code stays. Students go straight to subjects and tools.
- Long answers: every subject has a Questions tab and a Long answers tab. Hand-written model answers (5 to 20 marks) with a plan box, model answer, diagrams placed under the heading they explain, where marks are lost, and key points to tick. The Study module Q&As also appear there.

## Games

Daily case (with an AI case tab), Differential duel, Criteria sort, Blitz, MSE Lab, Ward Week, Rx Detective, Team Escape Room and Comorbid, all on the games page.
Server-paid games now move the daily goal and the streak without counting XP twice. The Quick thinker badge comes from Blitz (15 right in one round).

## AI

- AI practice cases, labelled "AI case", checked by rules, with a report button and an admin review page.
- Graded AI patient interview in the Consulting Room, with feedback on questions asked or missed, rapport, risk and the MSE.
- Every model output is cleaned of dashes, stock AI phrases and references (`src/lib/ai/student-text.ts`).

## Facts checked against outside sources

Mental Healthcare Act sections, RCI and RPwD Act facts, 2025 to 2026 drug decisions in Frontiers, and all 41 Indian brand names in Rx Detective. Still open: whether esketamine nasal spray has Indian marketing approval.

## Waiting on the owner

1. Approval to apply the pending database changes in `supabase/migrations_pending/` for this work: admin_redesign, learning_engine, custom_credentials, leagues, doubt_followups, games, games2, prep, ai_cases. Until then the features degrade quietly (results kept in the browser, team modes hidden).
2. The sim case and character text stored in the database still has old dashes. Re-running `scripts/upsert-characters.ts` updates it; this writes to the live database, so it waits for the same approval.
3. Book files go to the private R2 bucket `vibha-books-private` by hand from the Cloudflare dashboard.
4. Rotate the Supabase secret key that was pasted into chat.
