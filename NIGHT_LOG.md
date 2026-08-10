# NIGHT LOG — Lumen Practice Layer v2

Reverse-chron. One entry per slice: what shipped, decisions, commit hash.
Protocol: never stop, never ask, keep the branch buildable.

## 2026-08-10 (v3 build)

### Slice A6 — Skills Passport progress view (v3)
- /practice/passport — 11 competencies, evidence from competency_events (fed by supervision tagging today). Per-competency evidence list, logged-hours summary. The PDF certificate appendix stays the deferred big item.
- 112 tests, lint clean, build green.

### Slice A5 — Deferred-build sweep (v3)
- **Ethics & Law dilemmas** (/practice/ethics): 6 grounded dilemmas (MHA 2017 advance directives + nominated representative, POCSO mandatory reporting, RCI scope, confidentiality, mature-minor consent). Consequence-first: commit to an action, then reveal the law. Fixed a dead hub link (card existed, no route). Deterministic daily set; no answer-position bias.
- **Weekly Check-in** (/practice/check-in): 30-sec non-clinical workload/energy/preparedness + free line; owner-write RLS, admin reads aggregate view only. One per week.
- **Supervision log** (/practice/supervision): log RCI-track contact hours (activity/hours/date/supervisor), tag a competency → also records a competency_event (source 'supervision') feeding the Skills Passport. Sign-off status tracker.
- **Case Library** (/practice/library): read-only browse of the 129 normalised PMC docs; title/content search, expand abstract, link out to PMC. No AI, no schema changes.
- 112 tests (+9: 5 ethics, 4 library), lint clean, build green.

### Slice A4 — Sim review closure (v3)
- /admin/sim-review comments now persist: POST /api/admin/sim-corrections (requireAdmin) → scoring_corrections (admin-only RLS)
- Faculty can correct the overall score (0–5); score-changing rows inject as few-shot "lessons" into future debriefs (the Part 3.4 feedback loop)
- Note-only reviews stored but filtered out of the scoring prompt (debrief route now filters via shouldInjectCorrection) — a pure note would render as `"{}" should be scored as: {}`
- Existing corrections pre-fill the comment + corrected-score on page load; edits accumulate
- Corpus: 41 psych-focused PMC queries run (suicide/self-harm/ED/ADHD/autism/personality/dissociative/somatic/delirium/substance/psychotropics/cultural), paginated to 3 pages, re-run dedup from disk; 139 reports fetched, normalise → 129 docs in pmc.json
- 103 tests (+5 sim-review), lint clean, build green

### Slice A3 — Infra discipline (v3)
- src/lib/ai/embed.ts: halfvec(384) embedding entry point, Matryoshka truncate + L2-renorm, fixture path, 6 tests
- Migrated corpus_chunks + transcript_chunks to halfvec(384) + halfvec_cosine_ops HNSW
- /admin/infra + infra_metrics() RPC (service_role only), 70% red banner, warning strip on /admin
- GitHub Actions crons (keepalive, infra-check, reminders) → /api/internal/cron with CRON_SECRET; prune-logs retention, infra-snapshot, send-reminders stub
- infra_snapshots table + size caps on text columns
- migrate-submissions-to-r2.ts for audio/PDF → R2
- Security audit ran clean (all tables RLS'd, anon blocked on sensitive tables)
- docs: INFRA_SETUP (upgrade triggers), DATA_POLICY, AI_ARCHITECTURE
- 98 tests, lint clean, build green

### Slice G — Rest (commit 41afdcc)
- /reflect: owner-only journal (no admin read path), "help me think" → no-train provider only, honest 503 if none.
- /wall: cohort wall, anonymous toggle, author_id never leaves server for students.
- Privacy tests (5): journal owner-only, sct admin-only, checkins aggregate-only, wall anonymous hidden, RLS enabled.
- Nav: Journal + Wall.
- 92 tests (+5), lint clean, build green.

### Slice F — Depth (commit 16cb463)
- MSE Trainer: 11 domains, controlled vocab, mood-vs-affect drill, describe-don't-diagnose (flags diagnostic terms).
- OSCE stations: 3 timed stations (risk, SSRI psychoeducation, breaking bad news), checklist + global rating.
- Formulation Forge: 5P grid sort with tap-to-select mobile fallback, narrative, diff-against-model.
- Skills Passport deferred to IDEAS_NEXT (biggest remaining F item; PDF export on certificate).
- 87 tests (+11), lint clean, build green.
- SCT Arena: 62+ items, panel scoring (modal=1.0, partial credit), distribution bar chart, "5 Judgment Calls" daily screen. sct_expert_responses admin-only RLS.
- Rounds: ts-fsrs v5.4.1 wrapper, daily queue capped 25, review UI.
- Streaks: IST rollover, 2 freezes/month + 1 manual grace, idempotent, no guilt notifications.
- Two-Minute Clinic: 120s one-liner micro-drill with expert comparison.
- 76 tests (+23), lint clean, build green.

### Slice D — Corpus engine (commit f2bdab3)
- scripts/corpus/: Europe PMC fetcher (98 OA case reports, provenance-logged), normaliser, case drafter (40 cases → admin queue, approved:false), Gutenberg fetcher (10 novels).
- STYLE BANK (220 conversational patterns from fiction) — the "learn how to talk" feature. Isolated: style_pattern='style', never served for clinical queries (enforced + 5 tests).
- /admin/corpus/dictate + API for Dr. Sarthak's composite cases.
- 53 tests, lint clean, build green.

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
