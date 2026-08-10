# NIGHT LOG — Lumen Practice Layer v2

Reverse-chron. One entry per slice: what shipped, decisions, commit hash.
Protocol: never stop, never ask, keep the branch buildable.

## 2026-08-10

### Slice C — Voice mode (commit 57b524b)
- src/lib/voice/: Web Speech STT (en-IN, editable interim, Safari permission notice, Firefox fallback) + speechSynthesis TTS (voice-by-demographic, affect-driven rate/pitch).
- useVoiceSession: push-to-talk, silence meter, iOS gesture requirement.
- VoiceInput component: hold-to-talk mic, editable transcript, patient-speak.
- useVoiceMetrics + delivery panel in debrief (silence tolerance, interruptions, QPM, filler rate).
- Consulting Room session has voice/text toggle.
- 48 tests, lint clean, build green.

### Slice B — Consulting Room flagship (commit 79588b7)
- 8 hand-built Indian-context sim cases (incl. the no-disorder over-diagnosis trap).
- Structured sim_cases JSONB model (Part 6.1): identity, history, cognitive model, disclosure gates, resistance, affect rules, red flags, context pack, few-shot.
- Session start / turn / debrief API routes; turns persisted per turn (drop-safe).
- Streaming chat UI with SIMULATION badge, timer, difficulty hint.
- Debrief: schema-validated scoring, 3 verbatim quotes + better alternative, missed-disclosures reveal.
- Safety: student input only in user turns, patient ignores in-message instructions, data-policy guard, rate limit, session turn ceiling. 6 new tests.
- 48 tests pass, lint clean, build green.

### Slice A — Foundation (commit 0207707)
- `src/lib/ai/`: provider router (Gemini/Groq/Cerebras/OpenRouter/Anthropic, failover on 429/5xx/timeout, exponential backoff, never blocks), guards with the data-policy split (`assertProviderAllowed` + 4-test mandatory suite), Zod schemas, deterministic fixtures. `AI_ENABLED=false` fully works.
- 4 migration files → ~35 tables (sim_cases/sessions/turns/scores, SCT, formulation, MSE, OSCE, cards, streaks/quests/cohort, journal/checkins/wall, corpus+pgvector, competencies, supervision, ai_usage_log). RLS everywhere; journal owner-only (no admin path); sct_expert_responses admin-only; wall anonymous never exposes author_id.
- `/practice` hub + student nav entry (stethoscope icon).
- `.env.example` + AI env vars documented.
- 42 tests pass (+4 data-policy), lint clean, build green.

## Decisions
- Dev-branch application of migrations deferred to Kavya (MCP create_branch needs cost-confirmation ID I can't mint). Migrations written + reviewable in src/migrations_pending/.
- Style bank: fiction contributes conversational texture only.
- Created `feat/practice-layer` branch (carries the psychopharm work from earlier).
- Q-batch answered: 1y 2a 3y 4y — voice yes, free-tier router, data-policy split enforced, open-access clinical corpus.
- User instruction received mid-build: "train on fictional books to learn how to talk" → style-layer approach from Part 4.3 (public-domain conversational texture, isolated from clinical retrieval).

## Decisions
- **Build order**: A (Foundation) → B (Consulting Room) → C (Voice) → D (Corpus) → E/F/G as time allows. Brief says finish B+C completely before D if short.
- **Data policy**: free tiers never see student data. Enforced in code via `assertProviderAllowed` + mandatory test.
- **Style bank**: fiction contributes conversational texture only (style layer), never clinical content. Enforced in retrieval.
