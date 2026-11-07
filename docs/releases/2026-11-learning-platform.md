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

## Exam preparation

- One section, "Psychology Entrance & Competitive Exam Preparation" (CUET-PG, UGC-NET, clinical psychology entrances), with one shared curriculum. Exam-specific tracks are built but switched off (`EXAM_TRACKS_ENABLED`).
- About 3,740 questions across 20 subjects in six exam formats, and about 260 interview questions with model answers.
- Statements are numbered 1 to n to match options such as "1 and 2 only".
- Answer keys are spread so no option can be guessed; `src/content/prep/balance.test.ts` fails if one option holds more than 40 percent of a question type.

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
