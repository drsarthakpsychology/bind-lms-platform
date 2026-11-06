# Module: Practice tools & AI
> Verified against `main` @ `b2a9698`. Existing deeper notes: `docs/AI_ARCHITECTURE.md`, `docs/PRACTICE_TOOLS.md`, `docs/PRACTICE_LAYER.md`, `docs/AI_PATIENT_ARCHITECTURE.md`.

## Tool catalogue
Single source: `src/lib/practice/tools.ts` (`PRACTICE_TOOLS`) used by the hub and dashboard. Each tool has a flag key in `src/lib/flags.ts`: `consulting_room, decoder, mse, judgment, rounds, journal, formulation, osce, ethics, case_library, landmark, peer_roleplay, two_minute_clinic, supervision, skills_passport, weak_spots, checkin, modules, knowledge_tutor, learn, lab`. States: `off` hidden · `live` visible but locked · `unlocked`. Enforced per route by `requireFeature()`; admin toggle `/admin/flags` → `/api/admin/flags`; cached 30 s.
## Simulated patient (Consulting Room)
`src/lib/sim/*` (actor, director, engine, gates, moves, delivery, turn-service, characters, cases/volume-*), API `/api/practice/sim/{session,turn,rewind,debrief}`, tables `sim_cases, sim_sessions, sim_turns, sim_scores, sim_branches, scoring_corrections`. Safety/guards: `src/lib/ai/guards.ts`, `sim-safety.test.ts`. Ownership check on every route (`session.user_id === user.id`).
## Other tools
MSE (`/api/practice/mse/*`, `src/lib/mse`, `practice/mse.ts`), OSCE, SCT/Judgment, Formulation (+anonymous wall), Rounds (spaced repetition via `ts-fsrs`, `cards/card_reviews`), Journal (+`journal_shares`), Check-in, Two-minute clinic, Supervision & sign-off, Skills passport (PDF), Weak spots, Library notes, Idioms, Corpus dictation, Peer role-play (`pair_*`), Knowledge tutor (RAG).
## AI router (`src/lib/ai/router.ts`)
Workloads `chat, stream, json, vision, audio, embed`, each with an ordered provider list; chat/stream/json start with Groq, then no-train fallbacks (Cerebras, SambaNova), then Gemini/OpenRouter/OpenCode/OmniRoute/DeepSeek/Anthropic. Health + circuit tracking: `ai/health.ts`, table `provider_health`; usage: `ai_usage_log` (pruned by cron `prune-logs`); response cache: `ai_response_cache`. `AI_ENABLED` and `AI_FIXTURE_FALLBACK` env switches exist (semantics: read `src/lib/ai/client.ts`, `UNVERIFIED` for production values). Which provider keys are set in production is `UNVERIFIED`.
## Voice
`src/lib/voice/*`, `/api/practice/voice/{stt,synthesis}`, `/api/livekit/token`, `livekit-agent/agent.ts`, TTS backends (Chatterbox, Qwen, MiMo, Kokoro, ElevenLabs via env). Deepgram STT exists via env but engines were removed as dead code (`docs/DEAD_CODE.md`).
## Knowledge/RAG
`src/lib/knowledge/*`, `/api/knowledge/{search,ask,concepts}`, `match_corpus_chunks`, `search_corpus_keyword`, corpus ingestion scripts (`scripts/corpus`, `scripts/knowledge`). Data licensing tracked in `rights_registry` (`docs/rights-requests`).
## Risks
Largest and most flag-dependent part of the app; many tables referenced here have DDL only in `src/migrations_pending/*` — confirm they exist in production before enabling a tool.
