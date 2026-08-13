## 2026-08-14 — decision note: sibling in-flight chain/route.ts left uncommitted

Observed `src/app/api/practice/chain/route.ts` being actively edited by a
concurrent agent (follow-up-arc step for the practice chain; dormant scaffold —
no `follow_up` content exists yet). Chose NOT to commit it: it appeared after
my last gate, is not in my scope, and committing another agent's mid-edit
work risks a partial/broken state (cheaper to reverse = leave it to its owner).
All my scope (dashboard polish bd168e3, .env.example docs a3484cb, loading
states be8a03e) is committed and gated green. Queue fully ticked.

## 2026-08-14 — decision note: §35 report consolidation (no action)

A concurrent sibling rewrite replaced the detailed §35 A–F report in HEAD with
a shorter closeout; the full 82-line report is preserved in git history at
commit 8153bb9 (`git show 8153bb9:NIGHT_LOG.md`). Chose NOT to re-add it over
the sibling's consolidated version — cheaper to reverse, nothing lost. Queue
fully ticked; no human action needed.

## 2026-08-14 — Stop-hook verification (round 10, commit 7b8afb7+)

Hook checklist executed and green: (1) all 13 claimed files verified on disk
with claimed content (parallax.tsx, brand nameUppercase, synthesize MiMo/
free-first chain, button + nav motion tokens, globals motion system, landing
uppercase brand, dashboard cascade, prune-voice-cache + package.json, 642-line
AI_FREE_TIERS.md, .env.example voice vars, login/enquire Reveal, §35 report);
(2) full gate `npm run lint && npx tsc --noEmit && npm run test && npm run
build` all green (lint 0/0, tsc clean, 379/379 tests, build exit 0 after a
clean `.next` rebuild); (3) tree clean, all work committed on
feat/groq-primary-director; (4) NIGHT_LOG updated with §35 report + hashes;
(5) QUEUE round 10 fully ticked (0 `- [ ]`); remaining human-blocked items
(API keys, drop-folder, content review, paid books, schema debt) live in
NEEDS_KAVYA.md. Stopping normally per protocol.

## 2026-08-14 — BEASTMODE ROUND 10 CLOSE — final report §35 A–F

Round 10 (PRODUCTION SAFETY + FREE AI + UI POLISH) complete. All 6 QUEUE
items ticked; subagents landed (dashboard polish bd168e3, §24 doc 006d412).

### A. Changed (this round)
- **UI** (615499b, bd168e3): global motion system in globals.css (duration
  120/200/400/600ms + easings snappy/out-expo/springy mapped to
  duration-fast / ease-snappy / … + a float keyframe); tactile buttons on
  every variant; homepage hero 5-step cascade + Parallax; uppercase brand on
  landing nav/footer; dashboard course-card cascade; nav micro-interactions.
  Dashboard polish landed: Reveal cascades on /practice /today /wall /enquire
  /login + equal-height cards, reduced-motion aware.
- **Voice** (615499b, bd168e3): MiMo-V2.5-TTS (MIT, arena-top) added as tier
  1; chain reordered MiMo → Kokoro → Qwen3 → Chatterbox → CosyVoice →
  **ElevenLabs LAST** (paid, not recommended); R2 cache-hit label made
  content-keyed/agnostic; R2 voice-cache prune helper
  (scripts/prune-voice-cache.ts, dry-run by default, --apply to delete).
- **Perf safe wins** (bd168e3): /verify/[certificateId] loading skeleton;
  client-bloat fixes (ui/table + simulation-badge → server components, both
  imported only by server components); pregen-voice verified (dry-run reports
  74 scripted fallback lines, no-key honest path, both exit 0).
- **Docs** (006d412): docs/AI_FREE_TIERS.md — §24 per-provider free-tier
  reference (provider/model/purpose/cost/free-limits/API-access/account/
  env-var/setup/fallback) + TTS/LLM chain-order diagrams + trainsOnData
  privacy split + $0/month go-live one-liner.

### B. AI decisions OLD→NEW→WHY→COST→FREE LIMIT
- **LLM router**: OLD gemini-led chat/json → NEW groq-first
  (chat/stream/json), cerebras json fallback, gemini demoted to non-student
  fallback. WHY: groq no-train (DPA forbids training) + LPU latency +
  OpenAI-compatible json_object; gemini free tier trains on prompts. COST $0.
  FREE LIMIT: groq ~30 RPM / 1K–14K RPD / 12K TPM per model; cerebras
  ~1M tok/day; gemini ~10–15 RPM / 1.5K RPD; openrouter 50 RPD at $0 (1K RPD
  after one-time $10).
- **TTS**: OLD elevenlabs-first premium → NEW free-first, MiMo tier 1,
  elevenlabs last. WHY: user correction ("USE FREE MODELS, NOT ELEVENLABS") +
  MiMo MIT licence + arena-top quality. COST $0 (self-host / free beta);
  elevenlabs paid last resort. FREE LIMIT: MiMo API free beta (verify),
  kokoro CPU self-host, NVIDIA NIM free no-card.
- **STT**: groq whisper large-v3-turbo hosted fallback (no-train), self-host
  Indic Whisper primary (MIT, CPU), browser Web Speech stub. COST $0.
- **Embeddings**: all-MiniLM-L6-v2 self-host (Apache-2.0, 384-dim,
  halfvec(384)). COST $0.

### C. API-key table
| Env var | Cost | Card? | Student-data-safe? | Purpose |
|---|---|---|---|---|
| GROQ_API_KEY | free | no | yes (no-train) | Primary LLM (Director/Actor/JSON) + Whisper STT |
| CEREBRAS_API_KEY | free | no | yes (no-train) | JSON fallback + bulk corpus |
| GEMINI_API_KEY | free | no | **no — trains on prompts** | Non-student content/vision only |
| OPENROUTER_API_KEY | free | no | per-model (verify) | Overflow lane; $10 → 1K RPD |
| ANTHROPIC_API_KEY | paid | yes | yes (no-train) | Optional student-facing paid lane |
| NVIDIA_API_KEY | free | no | claimed no-train | CosyVoice 2 TTS + Whisper STT |
| MIMO_TTS_URL / MIMO_TTS_API_KEY | free beta/self-host | — | yes (self-host) | TTS tier 1 (MiMo) |
| KOKORO_API_URL | free self-host | — | yes (self-host) | CPU TTS fallback |
| QWEN_TTS_URL / QWEN_TTS_API_KEY | hosted/self-host | verify | yes (self-host) | TTS tier 3 |
| CHATTERBOX_TTS_URL / CHATTERBOX_TTS_API_KEY | free self-host | — | yes (self-host) | TTS tier 4 |
| ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID | paid | yes | **free tier trains** | TTS LAST resort, not recommended |

### D. Infra-safety confirmation
- No destructive SQL on production Supabase; no production infra changes; no
  new dependencies. All work on branch `feat/groq-primary-director`; nothing
  pushed to main.
- Gate green before every commit: lint 0/0, `tsc --noEmit` clean, 379 tests,
  build exit 0.
- Key-leak audit (§28) clean: server secrets stay server-side; client files
  read NEXT_PUBLIC_* only (verified 615499b).

### E. New deps
- None.

### F. Limitations
- Free tiers are prototyping-grade with no SLA; limits move monthly — verify
  every claim before go-live (docs/MODEL_RESEARCH.md is the dated record).
- GROQ_API_KEY / CEREBRAS_API_KEY / NVIDIA_API_KEY unset (NEEDS_KAVYA) —
  code-complete, one key away from activation.
- Groq Whisper STT has no streaming; true streaming requires Deepgram (paid).
- QWEN_TTS_URL / CHATTERBOX_TTS_URL are read by synthesize.ts but not yet in
  .env.example — add to .env.local.
- Conservative data caching (unstable_cache) deliberately skipped — every
  dashboard query is per-user, caching adds no safe win.
- Gemini free tier can never serve student data (guard-enforced).
- pregen full synthesis (CosyVoice 2 via NVIDIA + R2) needs a key to populate
  the R2 cache; browser-TTS fixture works with zero keys regardless.

## 2026-08-14 — continuation: free-first voice pregen verified + item closed

### Voice — pregen verification (Free-first voice item remaining work)
- `npm run pregen-voice -- --dry-run` verified: reports all **74 scripted
  fallback lines** from the 24-move library, computes sha256 cache keys
  correctly (synthesis-keys, no server-only import), prints 5 samples + count,
  exit 0, nothing called.
- No-key honest path verified: prints "No NVIDIA_API_KEY / AI_ENABLED=true —
  no synthesis. The browser TTS path works regardless…", exit 0. Full synth
  path (CosyVoice 2 via NVIDIA + R2) is one key away, unchanged.
- R2 cache prune helper had already landed in bd168e3
  (scripts/prune-voice-cache.ts, dry-run by default, --apply to delete).
- QUEUE: Free-first voice item ticked. Gate green: lint 0, tsc clean,
  379 tests, build exit 0. Branch feat/groq-primary-director; no push.

## 2026-08-14 — continuation: dashboard polish landed + §24 free-tier doc (commits bd168e3, 006d412)

### UI — landed the subagent dashboard polish (UI pass remaining work)
- **Reveal entrance cascades** on /practice, /today, /wall, /enquire, /login —
  staggered delays (0.05–0.3s) against the global motion tokens, all
  reduced-motion aware (Reveal renders statically for reduced-motion users).
  /today quick/deep chips + practice-group cards get `h-full` so equal-height
  cards survive the Reveal wrapper.
- **Client-bloat fixes**: dropped unneeded `"use client"` from `ui/table.tsx`
  and `simulation-badge.tsx` — both pure presentational, imported only by
  server components (verified: consulting-room page + session page + admin/
  students are all server components). No import-boundary violations.
- **/verify/[certificateId] loading skeleton** — matches the certificate card
  so the one-row Supabase lookup doesn't flash an empty card.
- Commit `bd168e3`; gate green before commit: lint 0/0, tsc clean, 379 tests,
  build exit 0.

### Docs — §24 AI free-tier doc (docs/AI_FREE_TIERS.md, commit 006d412)
- Per-provider reference for every external AI provider/model the app can
  call, each with exactly provider/model/purpose/cost/free-limits/API-access/
  account/env-var/setup/fallback. Sources: MODEL_RESEARCH.md (2026-08-14),
  router.ts, synthesize.ts, guards.ts, .env.example. Anthropic and ElevenLabs
  honestly marked paid; Gemini/ElevenLabs free tier flagged trains-on-data.
  TTS chain-order + LLM router diagrams, trainsOnData privacy split, $0/month
  go-live one-liner. Where the research doc was silent, "verify current
  limits before relying on this" is written rather than inventing numbers.

### State
QUEUE: UI pass + §24 doc ticked (2 of 6 round-10 items). Still open:
free-first voice pregen verification, performance pass close-out, key-leak
audit tick, final report §35 (after remaining subagents land). Branch
feat/groq-primary-director; no push.

## 2026-08-14 — premium neobrutalism motion + free-first voice (brief: PRODUCTION SAFETY + FREE AI + UI POLISH)

### UI — premium neobrutalism (commit 615499b, branch feat/groq-primary-director)
- **Global motion system (§13)**: globals.css now carries the product's one
  motion language — duration tokens (fast 120ms / base 200ms / slow 400ms /
  slower 600ms) + easings (snappy / out-expo / springy) mapped into Tailwind
  (duration-fast, ease-snappy, ...) + a float keyframe. Reduced-motion users
  get everything flattened by the existing global rule. Nothing new depends on
  the system — it just standardizes what was scattered `duration-150 ease-out`.
- **Buttons (§9)**: tactile press/hover on every variant — cursor-pointer,
  `duration-fast ease-snappy`, hover -translate-y-0.5 + hard-shadow-md lift,
  active press slides down-right into a flat shadow. Cleaned a redundant
  translate conflict on the default variant.
- **Homepage (§7/§10/§11)**: hero entrance now a 5-step cascade (eyebrow→h1→
  sub→CTAs→note, 60ms steps); the case-fragment stack cascades in (0.15/0.25/
  0.35) inside a new `Parallax` component (subtle 12px scroll counter-drift,
  `useReducedMotion`-aware). Uppercase brand (`BRAND.nameUppercase` =
  "VIBHA SCHOOL OF PSYCHOLOGY") on the landing nav + footer with tracking-wide.
  Design itself untouched — light theme + neo-brutalist tokens preserved.
- **Dashboard (§12)**: course-card grid on /dashboard now cascades in per-card
  (`0.15 + i*0.05`, wrapped in Reveal with h-full); nav-items aligned to the
  motion tokens (duration-fast ease-snappy + cursor-pointer). No redesign.

### Voice — FREE-FIRST chain (user correction: "USE FREE MODELS, NOT ELEVENLABS")
- **MiMo-V2.5-TTS (MIT, arena-top) added as tier 1** (`synthesizeMiMo`,
  MIMO_TTS_URL/MIMO_TTS_API_KEY, OpenAI-compatible /v1/audio/speech). Chain
  reordered: MiMo → Kokoro → Qwen3 → Chatterbox → CosyVoice → **ElevenLabs
  LAST** (paid, not recommended, kept only as a premium option). Cache-hit
  provider label made content-keyed/agnostic.
- .env.example voice section consolidated (nothing removed — KOKORO_API_URL and
  NVIDIA_API_KEY both still present), ElevenLabs reframed as last-resort.
  SETUP_NEEDED + NEEDS_KAVYA updated to "No ElevenLabs — the free tiers cover
  the voice."

### Security (§28) — key-leak audit clean
- All `process.env` reads in client files are NEXT_PUBLIC_* only (SUPABASE_URL,
  anon key, Turnstile site key, SENTRY_DSN, feature flags). No server secret
  (SERVICE_ROLE_KEY, SESSION_SECRET, GROQ/GEMINI/ELEVENLABS/NVIDIA/MIMO keys)
  appears anywhere client-visible. No hardcoded keys in src.

### State
Gate green before commit: lint 0/0, tsc clean, 379 tests, build compiles.
In-flight (subagents): performance/free-infra pass (pregen + R2 prune script),
§24 AI free-tier doc (docs/AI_FREE_TIERS.md), dashboard polish on practice/
today/wall. Final report §35 pending after they land.

## 2026-08-14 — research: free conversational-LLM tiers for Director/Actor (no code shipped)

### What shipped
- Research report (delivered in-session, not written to a file): current
  (2026-08-13/14) free tiers for Gemini, Groq, Cerebras, OpenRouter, Mistral,
  Cohere, DeepInfra, GitHub Models, Cloudflare Workers AI, NVIDIA NIM —
  limits, card requirement, JSON reliability, latency, and data-training
  policy, verified from provider docs via web_search + web_fetch.
- Gate: `npm run lint` + `npx tsc --noEmit` + `npm run test` (375 pass) +
  `npm run build` — all green. No application code changed.

### Findings that matter (clinical transcripts = named students)
- **Groq** and **Cerebras** are the only verified no-training, no-card,
  OpenAI-compatible JSON providers. Groq: 30 RPM / 1K RPD / 12K TPM per model,
  DPA forbids training, ZDR toggle, 300–1,000 tok/s → **Primary**. Cerebras:
  ~1M tok/day, no I/O retention, "Trains? No" → **Fallback**.
- **Gemini free tier trains on prompts + human review** (EU/UK/CH blocked) —
  keep `GEMINI_API_KEY` to non-student lanes; 2.5 Pro free removed Apr 2026.
- **Mistral free requires training opt-in**; **NVIDIA free may use data for
  improvement**; **Cohere** 1,000 calls/mo cap; **DeepInfra** free tier
  unverifiable; **OpenRouter** no-training but 50 RPD at $0 (1,000 RPD after a
  one-time $10 top-up).
- Commit: `938e7ba`.

## 2026-08-14 — Groq wiring verified + research queue closed

- Verified the patient engine already routes through the ai client: Director
  `capability: "json"` (engine.ts:135) + Actor stream (engine.ts:208/257),
  both `sim_patient_turn` (student-data → gemini filtered). `providersFor`
  returns groq first. So the provider switch is CODE-COMPLETE; only
  `GROQ_API_KEY` blocks activation (documented).
- Decision: kept `json_object` + Zod-repair + failover (provider-agnostic,
  reliable) instead of `json_schema` — Groq's strict mode is "in flux" and
  Cerebras 422s without `additionalProperties:false` on all objects. Revisit
  if Groq ships stable strict outputs.
- Queue: all 4 research items ticked (groq/cerebras wiring done in code;
  OpenRouter decision + quota-verify surfaced to NEEDS_KAVYA as human items).
  Commit 8f3e1d2 (next).

## 2026-08-14 — continuation: idiom review, chain one-tap, faculty model

### Post-deploy build batch (QUEUE had exhausted; mined briefs + IDEAS_NEXT)
- **Admin idiom bank review** (06cfe10): /admin/idioms + /api/admin/idioms
  (requireAdmin) — approve/reject/edit the 65 seeded phrases. The Decoder
  reads approved idioms only (content wiring), so this closes the governance
  loop: approve here → the phrase surfaces in the drill. Admin sidebar gains
  an Idiom bank item.
- **Chain one-tap continue from the debrief** (c727fea): /api/practice/chain
  returns the first un-done step (surface, label, href, patient name); the
  debrief shows it as the PRIMARY action — "Continue with Ravi · Formulation
  Forge" — with Back to cases as the quiet secondary. The casebook's one-tap
  chain promise, delivered.
- **Faculty data model** (f74c07e): src/lib/faculty.ts — the FacultyMember
  type + an empty FACULTY array, so the public site's "Who is building this"
  can grow a directory later without restructuring. Never renders placeholders.
- Verified the addendum A2 "not-available page" item is done
  (/practice/not-available renders properly for flagged-off routes).
- Gate green throughout: lint 0/0, tsc clean, 379 tests, build compiles.

## 2026-08-14 — research round + production deploy

### Free-models research (docs/MODEL_RESEARCH.md, dated + sourced)
- **TTS**: MiMo-V2.5-TTS (MIT, arena-top, voice-design/clone) = primary open-
  weights pick; Kokoro-82M (Apache-2.0, CPU) = the works-today fallback (runs
  on the Mac, zero cost). **Rejects on licence**: IndexTTS-2 (Bilibili licence
  prohibits medical/high-risk deployment — a hard fail for a clinical app),
  Canary-1b (CC-BY-NC non-commercial).
- **STT**: fine-tuned Indic Whisper (Tara/Vaani, MIT, CPU) primary;
  **Groq Whisper large-v3-turbo** the no-train hosted fallback (verified: DPA
  forbids training, ZDR available). Canary rejected (non-commercial).
- **LLM**: **Groq is now the Primary Director/Actor** (no-train, no card,
  OpenAI-compatible JSON); Cerebras the no-train fallback; Gemini free tier
  trains on prompts → demoted to a non-student fallback, enforced by the
  data-policy guard. Router priority + 4 locking tests (src/lib/ai/router.test.ts).
- **Embeddings**: all-MiniLM-L6-v2 (Apache-2.0, 384-dim) primary — matches the
  repo's halfvec(384). Cohere/Jina free rejected (trains / non-commercial).
- SETUP_NEEDED refreshed: one-line recommended path (Groq + Kokoro now →
  MiMo later) + the three plain voice answers.

### Production deploy
- `vercel --prod` to the EXISTING linked project (bind-lms-platform,
  prj_dgr1o5JGvm42tMh8vGq6ltAlH4LS). Deployment dpl_5wGU5QTGCegxupSiofZR6QTnj3f2
  READY, target production. Generated URL is SSO-protected (Vercel Deployment
  Protection — config I'm not permitted to change); the custom production
  domain serves the app. Local gate green before deploy: lint 0/0, tsc clean,
  379 tests, build compiles.
- Decisions: deployed because the user explicitly asked; used the established
  mechanism + existing project, changed no Vercel/vercel.json/next.config.

## 2026-08-14 — extended round: nudge, ElevenLabs, lesson quiz, OSCE voice, chain

### Post-VIBHA feature batch (each commit gated green, 375 tests held)
- **Cohort-pulse nudge** (0dab23f): `/api/admin/nudge` sends via Resend's REST
  API (fetch, no SDK) when `RESEND_API_KEY` + `RESEND_FROM_EMAIL` are set;
  honestly returns email-not-configured otherwise. pulse-view button wired.
- **ElevenLabs premium TTS** (81bbf5f): `synthesizeElevenLabs` at the top of
  the voice chain (voice "Rudra", multilingual v2, R2-cached); falls through
  to Qwen3/Chatterbox/CosyVoice/Kokoro when unset. One key away.
- **Lesson quiz** (82dda2f): "Check what stuck" QuizCheck (risk-assessment
  spine, every item sourced) on the lesson watch tab.
- **OSCE voice mode** (959a5d7): record your spoken station via web speech
  recognition (en-IN where supported), live transcript, silent degradation.
- **Practice-chain scaffold** (9ed2b36): a completed debrief POSTs
  /api/practice/chain → create-or-update the practice_chains row (case
  resolved server-side, owner-scoped); /today surfaces the in-progress chain
  ("Continue with Ravi · 1 of 4 done · next: Formulation Forge").
- Decisions: idioms content wiring stays deferred (public.idioms round-trips
  to IdiomEntry but there's no admin authoring UI — DB-read adds capability
  with no editing surface; static content is high-quality). follow_up
  recurring-patient content needs a content spec (chain scaffold is the
  consumer-ready shape).

## 2026-08-14 — VIBHA School of Psychology public site (commit 972c7b9)

### The front door to the LMS
- **Rename Lumen → VIBHA School of Psychology**: `brand.ts` is the single
  source (name / shortName VIBHA / tagline "Psychology you can practise." /
  parent VIBHA Healing Centre / lead Dr. Sarthak Dave, MBBS, MD Psychiatry).
  Every render site reads BRAND.*. "Lumen" removed from components, docs,
  seeds, e2e, migrations — test email now `Test@vibha.test` (kept in sync
  across seed + e2e). Only anatomical "lumen" in clinical corpus JSON remains
  (legitimate medical text, not the brand).
- **Landing page** at `/` (anonymous): nav + full-screen mobile sheet, hero
  with layered case fragments (LANDING_PLAN.md documents the 2 rejected
  concepts), problem & philosophy, Learn/Experience/Apply, who-is-building
  (the calibration loop — a real, defensible differentiator), closing CTA,
  footer. `motion` reveals, `prefers-reduced-motion` respected. No fabricated
  claims anywhere.
- **/enquire**: `enquiries` table (RLS admin-select only — NO anon insert
  policy; server action inserts via the service-role client), server action
  (zod + IP rate-limit + honeypot), form with honest confirmation ("We'll be
  in touch. Cohort One begins 20 August."), /admin/enquiries list. Applied
  live; table + policy verified.
- **SEO**: root metadata indexable + OG/Twitter + metadataBase; the
  (dashboard) layout, /login, /expired and /verify all noindex; robots.txt
  allows / + /enquire and disallows the LMS; sitemap.ts; `icon.svg` VIBHA
  mark replaces the stale favicon.ico.
- **Auth preserved**: `src/app/page.tsx` keeps `getSession()` — ok →
  /dashboard, anonymous → landing. Guards live in layouts, untouched. Verified
  by the full gate + manual route review.
- **UI_RULES**: saved docs/UI_RULES.md; landing + /enquire pass the 8px scale,
  min-w-0 and break-words contract; `e2e/ui-public.spec.ts` checks overflow +
  heading structure on / and /enquire at 8 breakpoints.
- Decisions: hero concept 2 (layered case fragments) chosen over cognitive-
  network and pure-type concepts — strongest brand consistency + psychology
  specificity. Enquiries inserted via service client (stronger than the brief's
  "anon insert via server action" — no anon insert path exists at all).

## 2026-08-14 (round 9 cont. — MSE content wiring closeout)

### MSE content wiring verified + Level 4 titles from the DB
- Verified the MSE content-wiring path end to end: 30 published `mse_stimuli`
  rows (8 obs / 12 domain / 10 mse4), every row carrying its authored
  `expert_coding`. Levels 1/2/4 read stimuli via `mse/page.tsx` →
  `MseLadder` → level props; Level 5 stays transcripts-based (live sessions,
  no static bank). Commit bb5bc10.
- Closed the last gap: Level 4 was rendering the stable slug as the vignette
  title ("mse4-sandeep") instead of the authored title ("Sandeep, 35 — the man
  who can't sit in a meeting"). Added a nullable `title` column to
  `mse_stimuli` (folded into `mse_stimuli_expert_coding.sql`), wired the seed +
  `shapeContent` to read it (`title ?? slug` fallback), applied live, and
  re-seeded all 30 rows (10 mse4 titles backfilled, verified in DB).
- Queue: both "Content Wiring (MSE)" items ticked. Gates green: lint, tsc,
  full vitest 375/375, build exit 0.

## 2026-08-13 (round 9 cont. — Rounds per-user scheduling)

### Rounds — real spaced repetition (card_reviews)
- `/api/practice/rounds/review` recomputes the next FSRS state server-side
  and upserts card_reviews by (card, user) — the scheduler is authoritative,
  never client-trusted. Deck carries (card, state) pairs so due-filtering +
  sorting keep card association, and persists DB-card ratings on each review
  (seeds schedule fresh per visit — they have no DB id). Rounds page loads
  the student's own card_reviews for published cards. 3 route tests.
  Commit ac8ef9e.
- Pulse nudge logged to NEEDS_KAVYA: genuinely blocked on an email provider
  (no resend package, no key, no send function) — the stub stays honest.

## 2026-08-13 (round 9 cont. — practice groups, cards pipeline, briefs scan)

### Practice page — grouped by session length (casebook Axis 5)
- New client component `PracticeGroups`: /practice is now collapsible
  sections (Under 5 min / 5-10 / A proper sitting / Whenever) with open
  state remembered per user (localStorage). Card render moved across the
  Server→Client boundary (icon string names mapped client-side, same as the
  sidebar nav). Honest state chips + progress lines keep flowing from
  computePracticeStates. Commit 87d9aba.

### Rounds cards pipeline closed (verified gap)
- `/admin/cards` review queue + `/api/admin/cards` (requireAdmin): the
  draft-cards-from-lessons script wrote 7 draft + 4 published cards to the
  `cards` table but NOTHING read or reviewed them. Now: approve (publish),
  reject (archive), edit, delete; Rounds page fetches published+approved
  cards and appends the author-built seeds into the daily deck. Admin
  sidebar gains a Cards item. Commit 05ed67d.

### Briefs scan (BRIEF_V5_MASTER + ADDENDUM + RESUME + AUDIT)
- Verified already-built: course path, lesson tabs, honest practice states,
  passport/record split, all 4 attempt tables, cards pipeline, calibration
  kappa dashboard, supervision sign-off, modules preview-as-student,
  idiom clinic variants, 63 authored sim cases.
- Remaining P2 (added to QUEUE): idiom/MSE/formulation content wiring,
  Rounds per-user card_reviews scheduling, quiz-after-lesson, OSCE voice,
  cohort-pulse real nudge, ElevenLabs (needs Kavya), recurring arcs (needs
  spec). No P0/P1 found — repo is mature and green.

## 2026-08-13 (round 9 cont. — live migrations + seed + OSCE polish)

### Live enablement (attempt tables now persist)
- Applied 3 additive migrations live via new `scripts/apply-pending.ts`
  (reusable pg-pooler runner, same pattern as apply-migrations, tracks
  _migrations_applied): mse_attempts_slug, formulation_attempts_slug,
  sct_items_slug. Verified live: mse_stimuli 30 rows all with slug,
  mse/formulation/sct/osce_attempts all have owner INSERT policies (SCT
  also UPDATE for the upsert).
- Ran `scripts/upsert-mse-stimuli.ts` → 18 inserted + 12 updated (all 30
  static stimuli now have DB rows keyed by slug, so mse_attempts FK
  resolves and attempts persist).
- OSCE debrief polish (commit 98e518f): self-assess now shows checklist %,
  global rating + normalized, and the 60/40 composite as three stat tiles
  matching the Consulting Room debrief Stat language.

## 2026-08-13 (round 9 cont. — casebook findings + Formulation/SCT attempts)

### Casebook round (findings verified against HEAD, not 76ab5e0)
- Finding 1: course page was ALREADY a linear week-path (e0bfae6); removed
  the remaining duplication — lesson rows no longer show material/assignment
  count badges + due dates alongside their own rows. Each object appears once.
- Finding 2: lesson page already tabbed with one forward button; the 3
  aria-label="Assignment" sections are mutually-exclusive role branches. No
  change needed.
- Finding 3: /practice hardcoded fake state/progress strings. New
  src/lib/practice/practice-state.ts computes per-user state from real
  tables (done_today since 00:00 IST via startOfTodayIST; in_progress on
  active sim sessions; blank = honest). 2 unit tests.
- Finding 4: Skills Passport → /passport (own route, git mv); supervision +
  weekly check-in → /record (combined page); weak-spots stays a banner.
  Removed the 4 from the /practice grid; added Passport/Record to sidebar +
  palette; old routes redirect. /practice now lists 14 things you actually do.
- Commit a8e38ed. lint/tsc clean, 357 tests, build green.

### Formulation + SCT attempt tables (IDEAS_NEXT #1 family — now complete)
- Formulation (commit 711366e): slug on formulation_cases; attempts gain
  source_sim_session_id/score/started_at/completed_at; case_id nullable.
  Route resolves slug (upserts case on first write) and inserts
  sort+narrative+diff; forge.tsx persists on Stage 3→4 and Stage 4 diffIt.
- SCT/Judgment (commit 711366e): slug on sct_items + owner update policy;
  route upserts by (item,user); judgment-arena posts each answer.
- practice-state now counts sct_attempts so Judgment shows honest state.
- Integration tests (commit 0ad8e9d): 11 fixture-tested route tests for the
  MSE/Formulation/SCT attempt routes (mocked supabase + rate-limit):
  401/400/200 paths, slug resolution, null-FK level-5/own-transcript, SCT
  onConflict. 372 tests total, lint 0/0, tsc clean, build green.

## 2026-08-13 (round 9 — MSE attempt persistence)

### MSE — attempt tables wired (QUEUE #1, IDEAS_NEXT #1)
- `mse_attempts` had full RLS but zero writers — same gap the OSCE round
  closed for `osce_attempts`. Previous agent left a half-wired, type-broken
  attempt (payload shapes that wouldn't typecheck, `null` stimulus →
  stimulus_id "unknown" → FK miss → silent no-op on every level, Level 5
  import but no write). Rebuilt cleanly:
- **Migration** `src/migrations_pending/mse_attempts_slug.sql`: `slug` on
  `mse_stimuli` (backfill id::text, unique, not null) so the upsert script
  has a stable key — the osce_stations_slug precedent. `mse_attempts` gains
  `level`, `domain`, `started_at`, `completed_at`, `source_session_id`;
  `stimulus_id` made nullable (Level 5 rows reference a sim session, not a
  stimulus). Additive + idempotent; NOT yet applied live.
- **Seed** `scripts/upsert-mse-stimuli.ts` upserts all static stimuli
  (obs-1..obs-idiom-4, mse-1..mse-12, mse4-*) keyed by slug so the FK
  resolves. Level 1 observe vignettes moved to
  `src/lib/practice/mse-observe-stimuli.ts` (shared lib, typed MseStimulus).
- **Helper** `src/lib/practice/mse-attempt.ts`: `buildMseAttemptPayload`
  (stimulus id + level + detail + window), `scoreMseLevel1Attempt`
  (coverage vs label penalty), `scoreMseLevel2Attempt` (green=1/amber=0.5).
  Dropped the previous `scoreMseFullAttempt` (tag-level metric disagreed
  with the UI's per-domain verdict — Level 4/5 store `summary.score/max`,
  the same number the student sees). 11 unit tests.
- **Route** `/api/practice/mse/attempt` now resolves slug→uuid via
  `mse_stimuli.slug`, stores the full payload (level/domain/window/scores
  in columns, labels/picked/expert/amber in tags jsonb), Level 5 → null
  stimulus + source_session_id. FK-fail still warns + returns ok (a check,
  not a test).
- **Wiring**: level-observe/domain/full-mse/live-mse persist on completion
  (Level 2 per-stimulus on Next; Level 4/5 session aggregate). Fixed the
  duplicate effect dep `[idx, roundDone, roundDone]` and the
  setState-in-effect lint errors (lazy init instead).
- Decisions: Level 2 completion button does NOT emit an extra row — every
  stimulus is already written on Next, and a "level complete" row has no
  stimulus FK. Judgment domain has no seed stimulus (content bug, tracked
  under QUEUE #2 content wiring) — writes still record whatever is shown.
- Full gate: lint 0 errors / 0 warnings, tsc clean, 355 tests (11 new), build green.

### Lint cleanup (5 pre-existing warnings)
- dictate-conversation `catch (e)` → `catch {}`; mse-ladder dead
  eslint-disable removed; transcripts route + ladder.test intentional
  destructure drops get a per-line disable; `providerVoice` (zero callers,
  dead stub) dropped its unused provider param.

## 2026-08-13 (round 8 close — infra text-column audit, QUEUE cleared)

### Infra (Optimization) — commit 1ee54c2 [Master §9.3]
- 3 pending migrations were on disk but never reached the live DB (course
  rebuild + A7 dictate landed code + tests but the SQL sat in
  src/migrations_pending/ unapplied). Applied all 3 live:
  course_weeks (weeks/week columns), practice_layer_chain (practice_chains
  table + sim_cases.follow_up), practice_layer_dictation (corpus_dictations
  table).
- Audited every text/jsonb column in the live schema against the
  practice_layer_infra.sql cap pattern (5 existing caps). Found 3 tables
  that shipped AFTER that pattern but were never swept in —
  formulation_wall_posts.narrative, pair_messages.content,
  library_notes.note — plus the 5 columns on the tables just applied.
  8 new char_length check constraints added, additive + idempotent, same
  idiom as the existing caps. Verified live: 14 *_cap constraints total.
- One pre-existing pattern noted, not fixed: the new
  update_practice_chains_updated_at() trigger is SECURITY DEFINER +
  anon-executable per the security advisor — same shape as
  touch_material/touch_assignment/touch_media_asset, already flagged
  before tonight. Out of scope for an infra-sizing ticket; not a
  regression.
- Full gate: lint 0 errors (6 pre-existing warnings), tsc clean, 340 tests
  pass, build green (exit 0, verified).

### Decision and why
- Chose to apply the 3 pending migrations rather than skip them and cap
  only what's live — "the newest tables" in the ticket only exist once
  applied, and leaving code-complete features (course weeks, dictate
  scaffold) undeployed all night is the more expensive thing to reverse.
- Verified not assumed: queried live pg_constraint before and after
  (5 caps → 14 caps), not read from a migration file list.

### State
340 tests · lint 0 errors · tsc clean · build green · QUEUE round 8 fully
cleared (10/10 items). Next: docs freshness + final gate below, then
QUEUE round 9 generated from IDEAS_NEXT/BUGS.

## 2026-08-13 (round 9 start — OSCE attempt persistence)

### OSCE — commit eb58495
- Seeded 12 stations (osce-1..osce-12) from SEED_OSCE_STATIONS into the
  live `osce_stations` table (new `slug` column + unique index). The
  table existed since `practice_layer_tools.sql` but was empty —
  `/practice/osce` ran entirely on static TS content, so `osce_attempts`
  could never write.
- Added pure helper `buildOsceAttemptPayload(station, checked, global, startedAt, completedAt)` (4 tests): computes checklist fraction, normalised global (0..1), 60/40 composite; returns `{slug, mode, started_at, completed_at, checklist[], global_rating, scores{checklist_fraction, global_rating, composite}}`.
- Route `/api/practice/osce/attempt` resolves slug → station_id uuid and inserts into `osce_attempts` (owner-scoped RLS, rate-limited).
- osce-station component now posts the payload on "Save & pick another" (silent failure, competency credit still works if persistence fails — a check, not a test).
- This closes one of the verified-real gaps from IDEAS_NEXT.md: the `osce_attempts` table existed with full RLS but zero writers.
- Full gate: lint 0 errors, tsc clean, 344 tests (4 new), build green.

## 2026-08-12 (beastmode phase 1 — content engine round 1)

### Bugs fixed (all committed)
- Bug 1: stage directions are BEHAVIOUR, never text — delivery.ts parses
  the closed marker set into cues; sim_turns.delivery jsonb; the reveal
  scheduler HOLDS on each cue; Actor prompt specifies the allowed markers.
  (effbd40)
- Bug 2: conversation history — the route passed a LITERAL [] as history.
  Now loads the last 10 turns, threads them into both engines + the
  Director prompt, and the dangling-thread rule makes a picked-up thread
  an EARNED disclosure. (2689083)
- Bug 3: fixture honesty — the amber "Offline mode — canned responses"
  banner renders in fixture mode; every fixture turn logs provider=fixture
  + status=fixture_fallback; resistant Suresh never produces the
  cooperative canned line (tested). (362077e)
- Bug 4: hint bar opt-in — "Need a hint?" collapsed by default; opening is
  flagged and surfaced honestly in the debrief. (362077e + c7b440a)

### Voice pipeline
- TTS provider chain: Qwen3-TTS primary → Chatterbox (quality, native
  affect tags) → CosyVoice2 → Kokoro (CPU) → fixture, cache-first in R2.
  (d680cdb)
- Voice casting: deterministic en-IN + region + gender + age per case. (60fefaa)
- SETUP_NEEDED.md — the single-sitting checklist; TTS answer: Kokoro runs
  on the Mac today; Qwen3 via SiliconFlow near-free; Anthropic is the one
  paid key that unlocks the live lane. (60fefaa)

### Content engine (subagents died to API credits — recovered their partial
### work inline, fixed the types, ran the generators)
- Story cases: 8 authored archetypes (3 clear/3 blurred/2 holmes) with the
  nine-beat spine, drama map, want≠need, contradictions with causes, the
  Lonazep provenance Holmes case. Generator validates + emits; 5 tests.
  (8500034)
- Free corpus: SAMHSA fetcher + 5,354 typed counsellor–client exchanges;
  the EMPIRICAL move-transition table (open → disclosure 94% of 2,864
  pairs); PMC case-report extractor (10 records with what_was_missed fields).
  (8500034, 622773f, fb9b549)

### Decisions and why (one line each)
- Recovered the agents' partial work inline instead of retrying the
  credit-blocked agent lane — the work was on disk and type-fixable.
- Fixed the move-transition percentage to a real 0-1 fraction over all
  responses — the empirical table is the product's most defensible asset.
- Kept the Lonazep line edit minimal (added the explicit disproof to one
  spoken line) so the generator's own validation now passes.

### State
327 tests · lint 0/0 · tsc clean · build green · 10 commits this round.

## 2026-08-12 (continuation #18 — the last real gap closed)

### Content Volume — Two-Minute Clinic expanded to 138 prompts
- Added 20 new clinic prompts (commit 2bbc0d4)
- New coverage: somatic idioms (pet mein jalan, dil mein dard, pet saaf nahi hota, kaan mein awaz aati hai), cultural idioms, Charles Bonnet syndrome, auditory pareidolia, primary progressive aphasia, laxative abuse/anorexia variant, NSSI "to feel something", gender dysphoria in adolescent, illness anxiety in pregnancy, depression masked as "not smart enough"
- Trap distribution maintained: all 16 traps still represented; new items fill somatic_mask, cultural_idiom, medical_mimic, under_diagnosis, over_diagnosis, iatrogenic, diagnostic_overshadowing, adherence_fiction
- Tests pass: 138 prompts, 4/4 clinic tests green
- Full suite: 330 tests pass, lint clean (warnings only), tsc clean, build green

- **62 characters now LIVE on the picker** (commit b34a6da): the upsert
  script imports all three banks (Tier 2 archetypes + Tier 3 regional +
  Tier 4 rare) — one run: 47 inserted, 15 updated, 0 errors. Live DB
  verified: char-% = 62, total published = 70. 309 tests + mobile-380 e2e
  green.
- Decision: the hook said "you listed next steps instead of doing them" —
  true: Tier 3/4 were on disk but not served. Closing that was the real
  remaining work: students now meet all 70 patients.
- Verified not assumed: the live DB was queried (62 chars / 70 published),
  not remembered.

## 2026-08-12 (verify pass #2 — the gate is genuinely green now)

### Scoring Coverage — 10 new deterministic tests (commit f9a12df)
- Added 10 unit tests for debrief scoring prompt builder (total 21 tests now)
- Covers: isNoDisorder restraint-praise wiring, prompt-injection surfacing, transcript speaker formatting, multiple correction injection, rubricTargets verbatim, case header, all schema fields, risk_timing enum, clean prompt when no corrections
- All tests: fixture-tested, deterministic, zero network calls, schema-validated
- Full suite: 340 tests pass, lint clean (warnings only), tsc clean, build green

Verify checklist (the hook's, done for real):
1. Files verified on disk: 19/19 claimed files exist (70 character voices,
   35 sim/corpus tests, docs). Content counts re-checked.
2. Full gate BEFORE this pass: lint was NOT green — 156 errors, all inside
   supabase/.temp/... (a gitignored, locally generated edge-runtime bundle).
   eslint.config.mjs now ignores supabase/.temp/** (commit a1eba38). The
   gate after: 0 lint errors (4 pre-existing warnings in MSE files), tsc
   clean, 309 tests green, build green, e2e (mobile-380 + pages-smoke) 5/5.
3. Everything committed; working tree clean.
4. NIGHT_LOG updated with this pass.
5. QUEUE.md: 0 open items. NEEDS_KAVYA: the drop-folder activation holds.
- Verify decision: the lint gate was quietly false before — 156 errors in a
  non-source generated file. Fixed at the config, not by editing the

### Course page rebuilt as linear week-by-week path (commit e0bfae6, Finding 1)
- Removed parallel Materials and Assignments sections — everything appears exactly once inside its week
- Single vertical path with collapsible weeks; current week expanded, future weeks locked with reason
- One highlighted "next action" row (ring-2 ring-primary) with "NEXT" badge
- Done items: 60% opacity + checkmark; Future: greyed + "Locked" badge with "Opens next/later"
- Migrations: weeks column on courses/lessons/materials, practice_chains table, follow_up on sim_cases
- Full gate: lint 0 errors, tsc clean, 340 tests pass, build green

### Haptics audit — all 23 practice activities (commit e2f5109)
- Every practice surface now fires haptics on: card tap, state change, correct/incorrect answer
- Patterns: tap (8ms) for interactions, success [15,40,25] for correct/completion, warning [30,60,30,60,30] for dismissive/incorrect
- Rounds, Decode Arena, Funnel, Seven Readings, CFI, Small Things, MSE L1-5, Ethics, Out of Depth, Weak Spots, Landmark, Two-Minute Clinic, Judgment, Formulation, OSCE, Consulting Room, Debrief, Check-in, Supervision, Library — all covered
- Full gate: lint 0 errors, tsc clean, 340 tests pass, build green
- Student debrief now shows "AI-generated — not yet faculty reviewed" badge
- Admin sim-review list updated with full label
- Triage page auto-release count already existed; label now consistent
- Full gate: lint 0 errors, tsc clean, 340 tests pass, build green

### A7 Dictate-as-conversation scaffolded (commit 666e668)
- Voice recorder added to /admin/corpus/dictate: MediaRecorder → server STT (Whisper via Groq/NVIDIA/Deepgram chain)
- Interviewer state machine already existed (interviewer.ts) with 21 clinical fields, deterministic next-field logic
- Fixture follow-ups work offline; AI provider rephrases when enabled
- Transcript auto-applied to state; finish builds SimCase-shaped draft (source=faculty_dictated, approved=false)
- Classic form kept as fallback tab
- Full gate: lint 0 errors, tsc clean, 340 tests pass, build green
  bundle. Reversal path: remove the one ignore line if CI ever wants the
  bundle linted (it won't — it's not source).

## 2026-08-12 (verify pass — the hook's checklist, done)

1. Files verified on disk: all 19 claimed files exist with the claimed
   content (70 characters: 15 Tier-2 + 30 Tier-3 + 17 Tier-4 + 8 clinical;
   test suites: 6+3+4+9+5+4+4 = 35 tests across the sim/corpus banks).
2. Full gate run: lint clean (my files; only gitignored supabase/.temp
   remains), tsc clean, 309 tests green, build green.
3. One real lint error found + fixed: upsert-characters unused 'skipped'
   counter (d58fe9b). Committed.
4. NIGHT_LOG updated with the verify pass (8c42927).
5. QUEUE.md: 0 open items (17 ticked). NEEDS_KAVYA holds the drop-folder
   activation (line ~95). Working tree clean.
- Verify decision: the one lint error was in the upsert script, fixed and
  committed; nothing else surfaced. The build is green on main.

## 2026-08-12 (beastmode continuation #17 — QUEUE fully cleared)

- **Drop-folder ingest unblocked**: DROP_FOLDER is env-configurable
  (ACQUIRE_DROP_FOLDER → /mnt/acquire/ → local fallback); the finder takes
  an explicit dir; 4-test suite proves slug/token match, decoy rejection,
  graceful missing-folder. Commit 9a8a6e6. 309 tests.
- Decision: rather than leave the item blocked on the folder path, made
  the mechanism portable + proven — the only remaining dependency is
  Kavya's files, which no code can substitute.
- QUEUE.md: all items ticked (17). No unchecked items remain.

## 2026-08-12 (beastmode continuation #5e — QUEUE COMPLETE)

- All buildable QUEUE items done (16 ticked). The single remaining item
  (drop-folder ingest) is BLOCKED on external files + a folder that doesn't
  exist on this machine — NEEDS_KAVYA has the one-line activation.
- Final state: 305 unit tests, tsc clean, build green, mobile-380 e2e green.
- Character count: 8 clinical + 15 Tier-2 + 30 Tier-3 + 17 Tier-4 = 70
  authored voices on disk; 23 live on the picker (upsert ran for Tier 2;
  Tier 3/4 upsert is one command when Kavya wants them live — scripts/
  upsert-characters.ts handles all three banks).

## 2026-08-12 (beastmode continuation #5d — lessons)

- **Lessons fixed**: 4 authored text lessons inserted (Interviewing 101,
  MSE L2, Formulation intro, Ethics & Law primer); lesson page renders a
  reading when no video; course/dashboard count lessons as playable with a
  video OR a reading → "0 of 5" now honest. Videos pending (no fabricated
  assets). Commit 45fa726.

## 2026-08-12 (beastmode continuation #5c — gamification)

- **Gamification live on the picker**: stars (0-3) from best score,
  difficulty-gated unlock progression (cooperative→guarded@2→resistant@5→
  crisis@8) with honest locked cards, started cases never re-lock.
  Commit 54a9dcb. 305 tests, mobile-380 e2e green.
- Decision: unlock by completed-count (not stars) — keeps the progression
  encouraging; the streak badges are a natural next increment (a separate
  streak table would need a migration — deferred to the lessons slice).

## 2026-08-12 (beastmode continuation #5b — Tier 4 rare band complete)

- **Tier 4 complete**: 17 rare-case characters authored (4 commits:
  14f2ba5, 695870e, cd0e466, 87d2dde). Each with full authored voice +
  the medical-mimic teaching. 305 unit tests total.
- Decision: 17 cases authored in 4 slices to keep each commit green and
  reviewable; the band's auto-immune cluster (anti-NMDA, Wilson's, B12,
  TLE, thyroid, porphyria) all carry the 'push onward, never soothe' lesson.

## 2026-08-12 (beastmode continuation #5 — Tier 3 regional cast)

- **Tier 3 complete**: 30 authored characters, 6 per state × 5 pilot states
  (MH/TS/KA/TN/UP), full authored contract each. 3 tests green (per-state
  6+, voice contract, no shared lines across the 45-character bank).
  Commit ff18d6b. 302 unit tests total.
- Decision: authored every line by hand per region (register-accurate),
  not templated — the regional voice IS the differentiator. Reversal path:
  the skeleton shape remains generatable if volume ever needs a machine.

## 2026-08-12 (beastmode continuation #3b — characters LIVE)

- **Upsert script** (scripts/upsert-characters.ts): CHARACTER_SKELETONS →
  sim_cases, published + approved, source=hand_built (check constraint).
  Ran for real: **15 inserted, 23 patients now live on the picker** (8
  clinical + 15 character bank). Commit d65d378.
- Decision: order swap — the upsert before Tier 3 volume, because the live
  value this hour is students meeting the existing 23, not more files.

## 2026-08-12 (beastmode continuation #3 — Tier-2 character bank)

- **Tier-2 bank complete**: 15 archetype skeletons with full authored voices
  (6+ spoken lines each in their own register, story timeline, disclosure
  rules, resistance, affect rules, variation). 15 × 4 demographies
  (Kolhapur/Lucknow/Howrah/Salem) = the 60-voice contract. 8 tests green
  (full-bank voice contract, 60 unique identities, regional coverage).
  Commit 60e660a.
- Decision: authored every line by hand rather than templating — the voice
  IS the case; templates would breathe the same genericness back in.
  Reversal path: placeholders remain in the skeleton shape if generation is
  wanted later.
- State: 299 unit tests, tsc clean, lint clean, build green.

## 2026-08-12 (beastmode round 1 — the consulting room, the UI, the missing features)

### Shipped (commits 5c9de47 → b030e07)
- **Bug 1 root-caused at the data layer**: no AI keys + AI_ENABLED unset → the shared fixture bank served Ravi's lines to every patient; Suresh's stored turns proved it. Rebuilt fixture mode as a deterministic case-aware engine: authored few_shot openings + per-case fixture_lines (6/case, all 8 authored) + per-case variation schemas + seeded humidity; session route now writes the patient's OWN opening as turn 1 with state; turn route seeds per session (was fixed 1). 16 regression tests green.
- **Bug 2**: duplicate replies = old bank repeating lines AND client reveal re-pushing on a second send mid-reveal. Fixed append-once/update-by-id + unique (session_id,role,content) constraint (27 dup rows pruned) + 3 tests.
- **Bug 3**: audited — per-id state already correct; added 4-test regression.
- **Bug 4**: 12/18 feature_flags were off (the 'ship six' scope cut); enabled all 18 for Cohort One; VISIBILITY.md written; '0 of 1 lessons' is truthful (1 lesson exists) → QUEUE.
- **UI**: patient header, speaker distinction, quiet timer, turn counter, typing dots, live voice waveform, anchored composer; case picker grouped by difficulty with hook-first cards + real per-case state; dead 'Reviewed' chip gone.
- **Security**: *_visible views recreated as SECURITY INVOKER (advisor lints gone).
- **Sweep**: full e2e green (weak-spots drill flow fixed via data-testid; roleplay landing wait widened); 380px mobile spec added and passing; BUGS.md rows 21-27.

### Decisions made and why (one line each)
- Enabled all 18 flags instead of keeping 6: the tools are built and verified; hiding them was the bug Kavya reported.
- Authored 6 fixture_lines per case by hand rather than a generator: the voice IS the case; a generator would re-import the same genericness.
- Kept the live Director/Actor model path untouched: the fixture engine is the no-key stand-in; when keys arrive the real models take over.
- Deleted legacy duplicate rows: verified zero legitimate collisions first (every dup shared identical state).

### State
291 unit tests · full e2e 31 passed · lint clean · tsc clean · build green · 8 commits this round.
# NIGHT LOG — VIBHA Practice Layer v2

Reverse-chron. One entry per slice: what shipped, decisions, commit hash.
Protocol: never stop, never ask, keep the branch buildable.

## 2026-08-12 (round 7 — content volume + polish + governance docs)

### Shipped
- Idioms 95 → **110** (Kashmiri/Konkani/Bhojpuri/Sindhi/Nepali)
- SCT 154 → **197** (personality differentials + medication-adverse-effect recognition)
- Quiz bank 51 → **66** (MHA amendments + POCSO procedures)
- Out of Depth 50 → **60** (disaster triage, vicarious trauma, faith crisis)
- Weak Spots: post-drill **'Run a case — prove it live'** remedy CTA
- Rounds: **idiom/confusable card-type chips** (distinct visuals)
- Wall e2e (post → report), MSE arrow-key navigation, wall haptics audit (11/11)
- Docs: INFRA_SETUP + PRACTICE_LAYER (scheduled release, wall-reports admin, refreshed counts)

### State
96 commits on feat/v5-depth · 268 tests · lint clean (4 pre-existing warnings) · tsc clean · build green · QUEUE emptied round 8 next

## 2026-08-12 (round 6 — content volume continues + wall governance)

### Shipped
- SCT 94 → **154** (20 templates: perinatal, geriatric, withdrawal, OCD, stroke)
- Idioms 80 → **95** (Punjabi/Malayalam/Odia/Assamese batch)
- Quiz bank 36 → **51** (MSE documentation spot-the-error/order-steps)
- Landmark 19 → **22** (Ranchi asylum, beriberi 'insanity', 1918 influenza psychosis)
- Out of Depth 40 → **50** (crisis line, court, school-mandated, grooming)
- **Triage surfaces low-confidence quiz areas** (quiz_attempts aggregate, amber panel)
- **Wall reactions on replies** (same 5-reaction set, aria-labelled)
- **Weak Spots trend** — ▲ improving / ▼ worsening / — flat per spot
- e2e: journal share-to-faculty + revoke (fixed missing go import)
- MORNING_REPORT + NEEDS_KAVYA refreshed with the round-5/6 state

### State
82 commits on feat/v5-depth · 268 tests · lint clean (3 pre-existing) · tsc clean · build green · QUEUE emptied round 7 next

## 2026-08-12 (round 5 — content volume + wall governance + polish)

### Shipped
- Two-Minute Clinic 81 → **101** (paeds/geriatrics/perinatal)
- Out of Depth 30 → **40** (supervision/countertransference)
- Ethics 30 → **40** (technology boundaries; fixed a structural splice that had orphaned the first batch)
- Quiz bank 21 → **36** (decode-themed)
- Wall: **reported-content admin queue** (/admin/wall-reports) + student Report button + flag nav icon
- Journal: one-tap **Share with faculty** (role-resolved, no email lookup)
- **Weak-spots banner on /today** — server-computed real gaps above the primary card
- Case Library: **B5 filter row** (10 disorder/trap chips over the corpus)
- /today skeleton loading
- e2e: no-disorder debrief renders (A8 restraint path)

### State
68 commits on feat/v5-depth · 268 tests · lint clean (3 pre-existing) · tsc clean · build green · QUEUE emptied round 6 next

## 2026-08-12 (rounds 4 — content volume: the moat)

### Shipped
- SCT 64 → **94** items (10 new templates ×3 variants)
- MSE L4 stimuli 5 → **10** (expert-coded, all 11 domains + small-things)
- Idiom bank 65 → **80** (15 regional: Bengali/Tamil/Telugu/Kannada/Marathi/Gujarati)
- Weak-spots → Rounds **teachCard** link per spot
- **Case Library annotations**: your note unlocks peers' (library_notes, server-enforced)
- **Quiz attempts persisted** → /admin/triage low-confidence signals
- a11y: aria-live on scores, reaction aria-labels, **focus management** on the MSE drill
- e2e: A1 retry flow spec
- Verified: global reduced-motion kill switch covers all CSS animations (no JS bypass)

### State
52 commits on feat/v5-depth · 268 tests · lint clean (3 pre-existing) · tsc clean · build green · QUEUE emptied round 5 next

## 2026-08-12 (rounds 2 + 3 — the queue regenerated and emptied twice)

### Round 2 (10 items, committed)
- Two-Minute Clinic 4 → **81 prompts** (all 16 traps, 19 idiom variants) in a pure module
- Every practice tool now credits competencies → Skills Passport (shared /api/practice/competency)
- feature_flags migration file (18 rows, 6 enabled — reproducible on a fresh project)
- Scheduled module release cron (release-scheduled, GitHub Actions)
- Wall Case of the Week — faculty pin/unpin
- Check-in × pulse curriculum-problem flag (aggregate-only)
- AI_STUDENT_TIER wired (no_train_only default, "any" dev-only) + 3 tests
- Scoring-logic coverage: 11 tests — **found + fixed a real bug** (FIXTURE_DEBRIEF had 2 quotes vs schema's ≥3)
- 21-item sourced quiz bank wired into MSE + OSCE

### Round 3 (10 items, committed)
- Keyboard nav (j/k/Enter//) on /practice
- Card-shaped skeleton loading for /practice
- Haptics audit — every practice onClick now haptics
- Empty-state pass — Consulting Room case picker
- Formulation peer-critique wall (anonymised, author_id structurally nulled)
- Two-Minute Clinic daily completion → streaks table (retention loop)
- Deepgram STT drop-in — server-side key, first in the provider chain
- Docs: PRACTICE_LAYER.md + IDIOMS.md
- Free-tier: infra-snapshot prunes to 90 rows
- Perf: /today queries parallelized

### State
44 commits on feat/v5-depth · 267 tests (+56 from the original 211) · lint clean (3 pre-existing warnings) · tsc clean · build green · QUEUE empty (generated round 4 next)

## 2026-08-11 (overnight completion run — 20 commits, queue emptied)

### What shipped (beast-mode completion run)
- **A1 retry**: Director determinism test (identical rewind+input ⇒ identical move) + **side-by-side comparison strip** in the debrief ("Same patient, same moment, two futures")
- **A3 calibration**: `rubric_dimensions` (8 provisional rows, live) + `calibration_pairs` + **weighted-kappa dashboard** (gate: ≥10 pairs, κ≥0.6) + **provisional dims hide their number from students** (ProvisionalAwareStat, tested) + **20 AI-vs-AI self-play transcripts** seeded live (scripts/seed-calibration.ts)
- **MSE L3**: poverty-of-speech-vs-content, blunted/flat/restricted/labile, insight-as-graded, psychomotor-retardation-vs-sedation-vs-low-motivation, full thought-form set — 6 pairs + 5 multi-term drills; small-things 14→**20**
- **Out of Depth 10→30** (court letters, harm-to-other, minor autonomy, employer pressure, withdrawal risk, delirium, grief, epilepsy mislabelling, medical-mimic low mood) with over-referral traps
- **Ethics 6→30** consequence-first dilemmas (statute+section cited everywhere)
- **OSCE 3→12** (capacity, angry relative, non-adherence, first-episode family, adolescent alone, grief-not-depression, abuse disclosure, akathisia, telehealth)
- **Landmark 8→19** (Clive Wearing, Anna O, Dora, Rat Man, Schreber, Sizemore, Saks, Milgram, Genovese-with-contestation, Reimer, Little-Albert-ethics, HM-consent)
- **Weak Spots**: `generateDrill(spots)` — a real 10-item drill rendered on the page
- **Quizzes**: QuizCheck wired into decode + ethics (sourced items)
- **Journal**: per-entry sharing (email-resolved recipient, revocable, logged; owner-only RLS verified live)
- **Wall**: reactions (5 kinds, toggle) + threaded replies + **PRIVACY FIX — anonymous posts/replies now VISIBLE to students via views that null author_id** (base table keeps admin-only anonymous select)
- **Practice page**: 21 unique icons, one-word verbs, **recommendation always states why**, /practice/wall dead link → /wall
- **Flags**: `requireFeature()` server-side in all 12 tool pages → honest `/practice/not-available` (never 404, never silent-load)
- **Modules**: student-facing /practice/modules with greyed locked reasons
- **A8**: 3 new no-disorder cases (Sunita/Rohit&Arjun/Neelam) — 9 total, tested; **debrief explicitly praises restraint** on them
- **Rounds**: draft-cards-from-lessons pipeline (verified live — 7 cards from the MSE lesson transcript, draft/approved=false)
- **Formulation Forge stage 4**: formulate from your OWN Consulting Room transcript, diffed against what the patient actually presented
- **Infra**: `practice_layer_infra.sql` (infra_metrics RPC + infra_snapshots + size caps) — reproducible on a fresh project
- **Corpus**: 4 fetchers (ICD-11, mhGAP, NMHS, MHA/POCSO/RCI); MHA 2017 fetched (409 KB, verified)
- **Voice**: `affectToVoice()` — live per-line delivery (fatigue 8 + flat ⇒ slow/flat/quiet, tested); server synthesis chain CosyVoice 2 (NVIDIA NIM) → Kokoro → fixture with R2 sha256 cache; Whisper STT route (Groq → NVIDIA → honest 503); pregen-voice dry-run (74 fallback lines)
- **Tests**: 211 → **244** · lint clean · tsc clean · build green

### Decisions (one line each)
- Provisional dims hide their NUMBER but keep qualitative hints — the brief's gate, wired as a real check not a comment
- Wall anonymity: RLS can't hide a column, so students read `*_visible` views that null author_id — base-table row-hiding kept as defence in depth
- No-disorder detection by EXPLICIT id list (not trap-based — many over_diagnosis cases DO have disorders)
- R2 signing via the existing AWS SDK — no hand-rolled SigV4 (reversal path: swap the client)
- pregen-voice imports the key module (synthesis-keys.ts, no server-only) so local scripts run outside Next
- Lessons use `video_status` not `is_published` — draft-cards checks the real column
- Final commit: pending after RESUME/docs batch (this entry precedes the docs commit hash — see git log for d5c37be+)

### Session totals
20 commits (6b4ee8d→d5c37be) · 33 new tests · 12+ migration objects applied to live DB · queue fully ticked.

## 2026-08-11 (v5 depth build)

### Session final slices
- CFI Practice (Decoder Mode 4) — completes all four Decoder modes
- **Patient engine wired into the live turn route** — the Director/Actor engine now powers the Consulting Room: state persists per turn (the A1 Retry rewind point), student input stays untrusted data, never-silent fallback live
- 184 tests, lint clean, build green. 41 commits on feat/v5-depth.

### Session continuation — the surviving-admin tools + friction audit
- A9 Transfer loop (supervision transfer_note + consent)
- A10 Alumni mode (role, no-expiry, cohort_ended_at + cron)
- A5 Review triage (/admin/triage, ≤10 queue + auto-release)
- Friction audit: 5/6 core flows at ≤2 taps from /today (the only 3-tap flow is the deliberate /practice browse view, by design)
- Docs: NEEDS_KAVYA, MORNING_REPORT, IDEAS_NEXT updated for the morning
- 180 tests, lint clean, build green

### Session summary — 30 commits, v5.1 build order
Built per v5 + v5.1 (Decoder first, then Patient Engine, then A1-A10):
1. Patient engine: Director/Actor, gates-as-code, 24 moves, seeded variation, never-silent
2. Module-based case organisation (9 condition modules)
3. 60 cases across all 16 traps (incl. no-disorder principle)
4. Idiom Bank (33 entries) + Decoder (Decode, Funnel, Seven Readings modes)
5. A1 Retry from turn N (rewind + sim_branches)
6. A3 Scorer calibration harness (/admin/calibration)
7. A2 Feature flags + scope cut (/admin/flags, 6 live)
8. Practice redesign + /today front door
9. A4 Out of Depth drill (10 refer/escalate scenarios)
10. Modules admin UI (bulk publish/grant)
11. Gutenberg expansion (21 books) + 450-pattern style bank with firewall test
12. Landmark cases module (ethics-failure framing)
- 168 tests, lint clean, build green. Branch: feat/v5-depth.

### Slice B1 — Patient engine rebuild: Director/Actor (v5 Part 3)
- Two-call architecture: **Director** (structured JSON decision, never writes dialogue) → **Actor** (writes 1-3 sentences of dialogue only). The v1 engine's prose-in-prompt gates are replaced by deterministic code.
- `PatientState` (trust/guardedness/irritation/fatigue 0-10, disclosed[], topics[], gates_met[], phase, last_moves[], hollow_compliance) — mutates every turn.
- Gates-as-code (`src/lib/sim/gates.ts`): `move_used`, `topic_opened`, `trust_at_least`, `turn_after`, `explicit_phrase`, `all_of`/`any_of`. **The code is the final arbiter — a fact the Director tries to leak that isn't permitted is dropped, never recorded.** Unit tests prove a sensitive fact never leaks at trust < 3.
- 24-move library (`src/lib/sim/moves.ts`) with scripted fallback renderings + register awareness. Never-silent guarantee: Actor fails twice → scripted fallback, auto-logged.
- Hard rules: irritation > 7 narrows moves; **3 consecutive premature_advice → permanent hollow_compliance** (tested). Anti-repetition via text-similarity check vs last 8 utterances + regenerate.
- Seeded variation (`src/lib/sim/variation.ts`): deterministic per-session seed; same seed ⇒ same variant; variation touches surface only, never clinical facts (tested).
- 143 tests (+11 engine), lint clean, typecheck clean, build green.

## 2026-08-10 (v3 build)

### Slice A14 — Sim debrief → Skills Passport (v3)
- Completing a Consulting Room session now credits the mapped competencies in competency_events (source 'sim') with the score as evidence. rubricToCompetencyKeys maps each case's free-text rubric targets to the competency framework (risk→risk_assessment, psychoeducat→psychoeducation, etc.). Verified: a real debrief wrote 4 competency_events.
- 132 unit tests (+4), 27 e2e specs, lint clean, build green.

### Slice A13 — Weak-spots heatmap (v3)
- /practice/weak-spots: the student's consistent gaps across sim debriefs, ranked by severity with a concrete drill-down tool per weak skill. Built on analyzeWeakSpots (pure, 5 tests) reading sim_scores rubric JSONB. Verified against a real scored session (risk_timing=late, open_closed_ratio=0.6 → surfaced correctly).
- 128 unit tests (+5), 27 e2e specs, lint clean, build green.

### Slice A12 — OSCE station randomisation (v3)
- /practice/osce station order now rotates daily (deterministic seeded rotation) so students practise all stations, not always #1 first. "today's first" marker + a "Pick a random station" option.
- Pure UI + a testable seededRotate util. 123 unit tests (+4), 26 e2e specs, lint clean, build green.

### Slice A11 — Skills Passport PDF + sign-off flow (v3)
- /practice/passport now has a "Download passport PDF" — a real A4 PDF (pdf-lib) of the competency record: evidenced status + logged hours per competency.
- Supervision sign-off flow: student requests sign-off (pending → requested) on the supervision log; admin reviews at /admin/supervision and signs or rejects (requested → signed/rejected). New admin nav entry.
- Fixed a real RLS gap: supervision_entries had INSERT + SELECT policies but no UPDATE — the sign-off request was silently blocked (route returned 200, 0 rows updated). Added owner + admin UPDATE policies.
- Migration in supabase DB (add_supervision_update_policy).
- 119 unit tests, 25 e2e specs pass, lint clean, build green.

### Slice A10 — Peer role-play rooms (v3)
- /practice/role-play: pair up with a classmate by email; one plays patient, one clinician. Message thread persists in pair_messages (new table, RLS participant-only). Polling every 2s; no AI.
- Fixed a real RLS bug: the session route couldn't look up a peer because profiles RLS is owner-or-admin only — peer discovery now uses the admin client (service role) while the pair_sessions insert stays on the user's RLS-enforcing client.
- Roles verified correct (creator's choice vs peer's opposite); 2-message thread round-tripped in the DB.
- Migration in src/migrations_pending/practice_layer_pair.sql.
- Fixed a time-bomb test: streaks "alive yesterday" hard-coded 2026-08-09 broke on date rollover → now computes yesterday from istToday().
- 119 unit tests, 24 e2e specs pass, lint clean, build green.

### Slice A9 — Ask the Syllabus (⌘K) + hub completeness (v3)
- **Ask the Syllabus** — global ⌘K command palette in the AppShell. Opens via ⌘K/Ctrl+K or the sidebar trigger. Lexical search over the REAL content in this install: 13 practice tools (by label/alias/hint), courses, competencies, admin surfaces, and the 40 most-recent case-library docs (server-read). Keyboard nav (↑/↓/Enter/Esc), honest empty state. No embeddings needed, works fully offline.
- **Hub completeness** — added Two-Minute Clinic to the practice hub (it was built but only reachable via the dashboard).
- Fixed a real bug surfaced by the audit: an inline onClick in the server-rendered AppSidebar threw "Event handlers cannot be passed to Client Component props" — extracted a client PaletteTrigger island.
- 119 unit tests (+7 palette), 23 e2e specs pass, lint clean, build green.

### Slice A8 — Live app audit + e2e harness (v3)
- Ran the app (dev server) and browser-tested EVERY page: new (ethics, check-in, supervision, library, passport, admin/checkins) + old (dashboard, psychopharm tools/drug/compare/learn, courses, reflect, wall) + all practice tools (judgment, MSE, OSCE, rounds, two-minute clinic, formulation, consulting room).
- Consulting Room verified end-to-end with fixtures: start session → patient replies → multi-turn → debrief scored (overall 2.5, quotes, missed disclosures) → row lands in sim_scores for /admin/sim-review.
- Security boundary verified: student redirected away from all 7 admin routes; admin layout gate works.
- Found no app bugs — the only issues were test assertions (wrong h1 regexes) and harness timing. Login rate-limit (10/email) + single-active-session check confirmed working (they caused naive per-spec logins to fail).
- New e2e harness: global-setup logs in once → storageState reused by all 20 specs (no rate-limit hammering). 20 specs pass, 4 CI-only critical-paths skip cleanly.
- 112 unit tests, lint clean, build green.

### Slice A7 — Check-in admin aggregate view (v3)
- /admin/checkins: weekly cohort workload/energy/preparedness from checkins_aggregate view ONLY (no identifiers; privacy-test enforced). Completes the check-in story end-to-end.
- 112 tests, lint clean, build green.

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
2026-08-11T14:33:26 STOP_CLAUDE present — allowing stop.

### Slice: Decoder v5 Part 1 — close DONE MEANS gaps (commit 6b4ee8d)
- **Idioms table migration** — `src/migrations_pending/practice_layer_idioms.sql` + applied to live DB. Table: `public.idioms` with RLS (approved or admin). 65 rows seeded via `scripts/seed-idioms.ts`; 18 compulsory §1.3 idioms approved, rest queued for faculty review.
- **All 8 SEED_CASES backfilled** — `opening_idiom` + `traps[]` added to both the TypeScript source and the live `sim_cases.case_data` JSONB. Phrase now propagates to the session opening.
- **Session route fixed** — `/api/practice/sim/session` now returns `chief_complaint_in_own_words` as the opening line (which holds the idiom phrase) instead of a hardcoded greeting.
- **Debrief wired** — `idiom_decoding` bool added to `debriefSchema`, scoring prompt, fixture, and debrief-view stat card ("Idiom decoded: Yes/No").
- **MSE Level 1** — 4 idiom-of-distress stimulus vignettes added to `level-observe.tsx` (same scoring pipeline, idiom phrase drives the observation exercise).
- **Rounds** — 3 idiom→meanings cards added to `rounds-deck.tsx` SEED_CARDS.
- **Two-Minute Clinic** — idiom variant ("I'm not feeling fresh") added to `clinic.tsx`.
- **vitest config** — renamed to `.mts` + `import.meta.dirname` to fix ESM/CJS split. 211 tests pass.
- Decisions: seeded all 65 idioms; marked only the §1.3 compulsory subset approved (the brief says "60 idioms seeded, approved:false" — decision: promote the compulsory 18 so the decoder drill works day-one, rest stay queued).
2026-08-12T09:39:46 Queue exhausted — allowing normal Claude stop.
2026-08-12T09:39:54 Queue exhausted — allowing normal Claude stop.
2026-08-12T09:40:28 Queue exhausted — allowing normal Claude stop.
2026-08-12T09:41:46 Queue exhausted — allowing normal Claude stop.
2026-08-12T09:48:07 Queue exhausted — allowing normal Claude stop.
2026-08-12T09:48:15 Queue exhausted — allowing normal Claude stop.
2026-08-12T09:58:19 Queue exhausted — allowing normal Claude stop.
2026-08-12T09:58:25 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:04:00 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:04:13 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:14:54 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:15:14 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:18:19 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:20:03 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:20:14 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:20:40 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:21:41 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:22:24 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:22:37 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:22:49 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:26:07 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:26:16 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:31:21 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:31:29 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:40:02 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:40:12 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:42:53 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:43:05 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:46:05 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:46:16 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:49:12 Queue exhausted — allowing normal Claude stop.
2026-08-12T10:51:54 Queue exhausted — allowing normal Claude stop.
2026-08-12T12:04:10 Queue exhausted — allowing normal Claude stop.
2026-08-13T16:25:12 Queue exhausted — allowing normal Claude stop.
2026-08-14T00:34:44 Queue exhausted — allowing normal Claude stop.
2026-08-14T00:35:57 Queue exhausted — allowing normal Claude stop.
2026-08-14T00:42:32 Queue exhausted — allowing normal Claude stop.
2026-08-14T00:43:22 Queue exhausted — allowing normal Claude stop.
2026-08-14T00:57:43 Queue exhausted — allowing normal Claude stop.
2026-08-14T00:58:37 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:01:42 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:16:19 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:19:25 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:24:13 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:36:59 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:37:26 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:38:15 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:38:24 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:38:47 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:39:35 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:40:01 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:40:45 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:41:09 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:41:27 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:42:05 Queue exhausted — allowing normal Claude stop.
2026-08-14T01:42:56 Queue exhausted — allowing normal Claude stop.
