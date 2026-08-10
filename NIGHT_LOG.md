# NIGHT LOG — Lumen Practice Layer v2

Reverse-chron. One entry per slice: what shipped, decisions, commit hash.
Protocol: never stop, never ask, keep the branch buildable.

## 2026-08-10

### Slice 0 — branch + logs + brief intake
- Created `feat/practice-layer` branch (carries the psychopharm work from earlier).
- Q-batch answered: 1y 2a 3y 4y — voice yes, free-tier router, data-policy split enforced, open-access clinical corpus.
- User instruction received mid-build: "train on fictional books to learn how to talk" → style-layer approach from Part 4.3 (public-domain conversational texture, isolated from clinical retrieval).

## Decisions
- **Build order**: A (Foundation) → B (Consulting Room) → C (Voice) → D (Corpus) → E/F/G as time allows. Brief says finish B+C completely before D if short.
- **Data policy**: free tiers never see student data. Enforced in code via `assertProviderAllowed` + mandatory test.
- **Style bank**: fiction contributes conversational texture only (style layer), never clinical content. Enforced in retrieval.
