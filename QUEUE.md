# QUEUE
# Format is STRICT. Unchecked: "- [ ]" with exactly one space. Done: "- [x]".
# The Stop hook only blocks while unchecked items exist. This is the fuel.

## AI INFRASTRUCTURE — MULTI-MODEL ROUTING + CAPACITY (2026-08-14, brief §1-46)

- [x] **Task-tier routing (§7)** — TaskTier simple/normal/difficult → model
  fast/smart/strong (modelForTier); Anthropic strong=opus; ask synthesis uses
  difficult. Committed 16e689f.
- [x] **Health-aware failover (§24)** — circuit-breaker (≥3 failures opens it,
  success resets, half-open recovery); providersFor routes around unhealthy
  providers; aiChat records outcomes to provider_health. Committed 830e9e2.
- [x] **DeepSeek registered (§13)** — deepseek-v4-flash/pro verified live;
  trainsOnData=true (unresolved posture) → guard keeps it off student data,
  ideal for non-student bulk. DEEPSEEK_API_KEY set + verified. Committed
  410499d.
- [x] **Current-model registry refresh (§8)** — OpenRouter model was dead
  (llama-3.3-70b-instruct:free gone); replaced with verified openai/gpt-oss-
  20b:free. OPENROUTER_API_KEY set + verified (412 models). Committed 2c502ce.
- [x] **Capacity model (§37)** — docs/CAPACITY_MODEL.md: 45 DAU = 1,620 calls/
  day; Groq's 1,000 RPD is the exact bottleneck (tokens ample); fix = Cerebras
  key + OpenRouter $10 + cache. Committed 628f7fd.
- [x] **Response cache (§37)** — ai_response_cache (Supabase + in-memory LRU),
  grounded tutor answers cached by content hash, trims ~10%+ of calls.
  Committed 776f2ab.

- [x] **SambaNova (Cerebras alternative)** — registered as the #3 no-train
  student lane (Groq → Cerebras → SambaNova), verified catalog (Llama-3.3-70B,
  DeepSeek-V3.x, gpt-oss-120b, gemma-4-31B), OpenAI-compatible. Committed
  901e052. **Verified 2026-08-14: PAYWALLED (needs a card) — paid fallback,
  not free.**
- [x] **OpenCode Zen gateway** — registered as a no-train fallback (OpenAI/
  Anthropic/Qwen via one key, opencode.ai/zen/v1). Committed 901e052.

### Keys live now (gitignored .env.local): GROQ + DEEPSEEK + OPENROUTER +
### SAMBANOVA (paywalled). The truly-free no-train double is `CEREBRAS_API_KEY`
### (free, no card, ~1M tok/day — the router's #2 lane, needs a key).

## AI INFRASTRUCTURE — CLOUD DEPLOY + PROVIDER EXPANSION (2026-08-14)

- [x] **OmniRoute cloud-ready** — router baseUrl now reads OMNIROUTE_URL
  (default localhost:20128/v1); scripts/deploy-omniroute.sh deploys the always-
  on gateway to Fly.io after `flyctl auth login`. flyctl v0.4.83 installed.
  Committed 83e6907.
- [x] **9 providers registered, verified live** — groq, cerebras, sambanova,
  opencode, openrouter, omniroute, deepseek, gemini, anthropic. Keys live
  (gitignored): GROQ, DEEPSEEK, OPENROUTER, OPENCODE, NVIDIA, SAMBANOVA.
- [x] **Verified paywalled (honest)**: SambaNova + OpenCode Zen paid tiers need
  a card; the genuinely-free lanes are Groq + OpenRouter + OmniRoute-auto.

## KNOWLEDGE LAYER — Groq LIVE + VOICE TUTOR (2026-08-14)

- [x] **GROQ_API_KEY configured + verified live** — router selects groq for
  json/stream/audio (student-safe); Whisper STT transcribed real audio
  perfectly. Key only in gitignored .env.local (never committed).
- [x] **Voice-enabled Psychology Tutor** — press-once mic → live interim →
  auto-stop → Groq STT → grounded answer → read-aloud (speechSynthesis);
  read-aloud + stop per reply. Committed 200be4c, e7a7908.
- [x] **Cloudflare R2 verified** — 20 knowledge objects live, no setup needed.
- [x] **AI keys documented** in NEEDS_KAVYA (Groq = only required, set;
  CEREBRAS/ANTHROPIC/NVIDIA/DEEPSEEK optional).

## KNOWLEDGE LAYER — CORE BUILD COMPLETE (2026-08-14)

- [x] **Register 10 books as corpus_sources** — idempotent, hash-keyed.
  Live: 10 sources with full metadata (title/authors/edition/year/publisher).
- [x] **Ingest corpus_documents** — per-book records; full text in R2
  (`knowledge/books/<id>/…`), preview in Postgres (respects the 2M content cap).
- [x] **10 reading agents produced verified outlines** — book→chapter→section→
  PDF page, high confidence, no fabricated page numbers
  (`scripts/knowledge/outlines/<id>.json`).
- [x] **Hierarchical chunking** — 27,608 chunks, 0 duplicates (unique
  `(document_id, chunk_hash)` index + in-run dedupe).
- [x] **Self-hosted MiniLM embeddings** — 100% embedded, halfvec(384),
  unit-norm, 0 malformed, **$0 cost** (embed.ts batched via pg unnest).
- [x] **Hybrid retrieval** — vector (RPC) + pg_trgm keyword + RRF rerank;
  degrades to keyword, never 500s. Verified live: relevant source-traceable
  hits across SSRIs/SZ-vs-BD/EPS/alcohol/OCD (`npm run knowledge:verify`).
- [x] **AI surfaces** — `GET /api/knowledge/search` (retrieval) +
  `POST /api/knowledge/ask` (grounded tutor, retrieval-first, no-train only).
- [x] **Gate green + committed** — lint 0, tsc clean, 420 tests, build 0.

### Next phase
- [x] **Evaluation benchmark** (brief §24/§37): **50-question** book-grounded
  set (5 categories) + runner (`npm run knowledge:eval`) with two metrics —
  source recall AND grounded@8 (answer terms present in the app's top-8 context
  window; hallucination-resistance). Expanded 16→50 via a 6-agent workflow
  (every answerTerm verified against the corpus). Baseline: **recall@5/@8 100%,
  grounded@8 76%** (the 24% gap = case-management questions whose terms span
  multi-page sections — documented future chunking/contextual-retrieval target).
  Found + fixed a real keyword-lane bug (only scanned first ~16 chunks).
  Committed 541e842, 2b37d33, fc733fc, 42b628e.
- [x] **Wire /api/knowledge/ask into a live UI** — Psychology Tutor at
  /practice/tutor: retrieval-first chat with expandable source citations;
  `knowledge_tutor` feature flag (off by default), admin label, practice-hub
  card, command-palette entry. Committed bb5b2ab.
- [x] **Psychopharm editor attaches corpus sources** — the admin block-source
  panel searches the corpus (/api/knowledge/search) and fills title/page/quote
  from a real, traceable passage in one click (brief §24). Committed cb7c559.
- [x] **Concept enrichment layer (knowledge graph foundation)** — 174 concepts
  (74 drugs + DSM-5-TR disorders + curated clinical terms) extracted
  deterministically across all 27,608 chunks → **37,275 concept-chunk links**,
  $0, resumable (scripts/knowledge/extract-concepts.ts). Concept filter on
  match_corpus_chunks + /api/knowledge/search?concept= + concepts-browse
  endpoint (commits 1cbb77d, 3616b85). Eval re-run: 100% recall@5/@8 — no
  regression. V4-Flash deepening lane (scripts/knowledge/enrich-concepts.ts) is
  code-complete, gated on a no-train key.

## KNOWLEDGE LAYER — OPEN (2026-08-14)

- [x] **Back-matter attribution gap**: add a `backMatter` field to `BookOutline`
  (and read it in `chunk.ts`), OR move back matter into `chapters`, so these
  pages don't chunk as "Unattributed": kaplan_sadock 216, stahl_essential_5th 45,
  stahl_pg_older 42, ahuja_psychiatry 21. (stahl_pg_7th 15 = publisher ads, fine.)
  Done: `6f095c3` (schema + chunker) + `0cfd50a` (backMatter data). Orphans now 0
  except stahl_pg_7th's 15 publisher ads (intentionally excluded).
- [x] **Dangling `knowledge:outline` script**: `package.json` references
  `tsx scripts/knowledge/outlines.ts`, but that file does not exist — create the
  outline-runner tool or remove the script entry.
  Done: removed the dangling `knowledge:outline` script entry (outlines are data,
  produced by reading agents, not a runtime step).

## DESIGN SUB-AGENTS + REDESIGN PASS (2026-08-14)

- [x] **Create 7 design sub-agents** under `.claude/agents/` (design-director,
  perception-auditor, frontend-craft, motion-polish, design-polish,
  visual-reviewer, quality-gate). Shipped 871792d.
- [x] **Synthesize design-audit findings** — 15-agent read-only audit (5 surfaces
  × PFD/polish/motion lenses) → 43 findings deduped into a file-by-file plan.
- [x] **Card radius consistency** — cards → `rounded-lg` (10px) across landing
  (CaseFragment, ThreeIdeas), `practice-groups`, `stat-card`; `CardTitle` drops
  conflicting `font-semibold`/`leading-none`. Shipped 058ef26.
- [x] **Apply audit polish across dashboard + landing** — a11y contrast (button/
  badge `link`, badge `ghost`/`link` border, ThreeIdeas eyebrow, badge destructive
  hover), motion-system unification (Reveal/kinetic-headline SSR-safe + token
  easing, `tw-animate-css` install, card/stat-card duration, progress fill), nav
  hierarchy (admin 21→3 groups + unique icons, `/today`+`/dashboard` label/icon
  unification, tab-bar constant geometry), token consistency (type scale, tabular
  numerals, `min-h-dvh`, safe-area scoping, cohort/builder → BRAND, weak-spots
  arrow). Shipped 058ef26.
- [x] **Gate + commit the redesign** — lint 0, tsc clean, 395 tests, build 0.
  Committed 058ef26.

## DESIGN REDESIGN — deferred follow-ups (2026-08-14, from audit)

- [x] **Systemic `text-primary`-as-text contrast sweep** — introduced a
  `--color-link` token (light `#b83a00` terracotta 5.40:1 / dark peach 8.74:1)
  and migrated all 84 `text-primary` accent-text/glyph usages → `text-link`.
  Peach stays for fills (`bg-primary`) + `text-primary-foreground` (ink-on-peach,
  untouched). Shipped 68d1736.
- [x] **`Card` `asChild` for the `interactive` variant** — added `Slot` support
  so `Card` can render as a real `<a>`/`<button>` (mirrors Button/Badge). All
  current interactive cards already use `cardVariants` on `<Link>`, so no live
  bug — primitive-capability gap closed. Shipped 00d1686.
- [x] **Admin mobile persistent nav** — `BottomTabBar` is now mode-aware:
  students get the 5 core tabs, admins a compact 4-destination bar (Overview /
  Review / Submissions / Students). Shipped 7123021.
- [x] **EmptyState / ErrorState entrance motion** — added a `.animate-enter`
  keyframe (opacity + 4px rise, 200ms out-expo) to globals.css and applied it to
  both surfaces; the global reduced-motion rule flattens it automatically.
  Shipped with the Card asChild follow-ups.
- [x] **Landing heading weight** — evaluated and left deliberate: `font-black`
  (900) is an intentional display weight for the public marketing front door
  (the 700 token scale is the LMS app voice). No change.
- [x] **KineticHeadline hero settle timing** — evaluated and left deliberate:
  the ~1.15s word cascade is the intended hero entrance. No change.

## SHARED-CHROME FOLLOW-UP (2026-08-14, design-direction pass)

- [x] **Admin page raw status colors → tokens**: `admin/page.tsx` free-tier banner uses raw `border-red-500 bg-red-50 text-red-600 text-red-800` (off-palette, near-white in dark mode). Same fix as the weak-spots banner / practice chips: route through `status-alert`/`status-pending` tokens. Shipped in e677b61.
- [x] **Bottom tab bar active state is quiet**: active tab is peach-on-cream (~2:1 in light mode) + font-semibold. Deliberate trade-off; consider a stronger active affordance (hard-shadow chip behind the icon) if user testing flags orientation loss. Resolved: constant-geometry terracotta chip (ink border + hard-shadow-flat, ≈9:1 in both themes) around icon+label, matching the sidebar active row; no layout shift. Shipped in de86423.
- [x] **Error boundaries beyond /(dashboard)**: /login, /enquire, /verify, and the landing routes still have no error.tsx. A `global-error.tsx` or per-segment boundaries would close the last bare-fallback gaps. Resolved: root `src/app/error.tsx` boundary covers the landing page, /login, /enquire, /expired, /verify (renders inside the root layout, theme intact) + shared `ErrorState` design-system component; (dashboard) boundary refactored onto it. Shipped in 597dcb7. Root-layout errors (which error.tsx cannot wrap) additionally covered by `src/app/global-error.tsx` — own html/body, inlined brand palette — in aa034c2.
- [x] **Dialog/Sheet close buttons use `focus:` not `focus-visible:`**: ring shows on mouse click too; cosmetic, standard shadcn default, low priority. Resolved: both close buttons switched to `focus-visible:` — ring only on keyboard focus, matching buttons/inputs/tabs. Radix menu `focus:bg-accent` and textarea `focus:ring` verified intentional and left as-is. Shipped in e24305b.

## DESIGN-DIRECTION FOLLOW-UP (2026-08-14, hook-driven)

- [x] **/today two-resume hierarchy**: with an active sim session AND an in-progress chain both present, the chain card (primary border) and the primary card (hard shadow) compete for the same "resume" intent. Needs a design decision (merge or demote one), not a polish tweak. Resolved: demote the chain card — when the primary card is "Resume your session" the chain card goes quiet (border-border bg-card, secondary number badge) so exactly one prominent continue action shows; without an active session the chain keeps its primary highlight. Shipped in 8d4ef78.
- [x] **Future-week lesson rows still `href="#"`**: locked rows keep an anchor that scrolls to top on click; replace with a non-navigating affordance (disabled button or span) when the locked state is revisited. Resolved: future-week lesson, material and assignment rows render as plain divs (flat card variant, opacity-50, no hover) — no anchor, no scroll-to-top. Shipped in 8d4ef78.

## AUTH CONSISTENCY — post-sweep open items (2026-08-14, hook-driven)

- [x] **Harden sim routes to `requireSession()`**: sim/debrief, sim/rewind,
  sim/turn, sim/session converted from bare `auth.getUser()` to the full
  session gate (profiles row + expiry + concurrent-session token).
- [x] **Drop redundant admin-role query in dictate routes**: corpus/dictate,
  dictate/complete, dictate/turn now gate admin via the `role` already returned
  by `requireSession()` instead of re-querying `profiles.role`.

## BEASTMODE ROUND 10 CONT. — post-close continuation slices (2026-08-14, hook-driven)

- [x] **Dashboard motion-polish pass (654139d)**: VibhaMark replaces the
  peach-square brand mark in the sidebar (28) + mobile top bar (24); Reveal
  entrances added to /reflect, /record, /passport, /admin (stat cards staggered
  0.15 + i*0.05); passport PDF button lift + case-library row hover
  micro-interactions. Loading skeletons, animated progress, Radix dialog/sheet/
  popover transitions, and layoutId tab indicators verified already in place.
  Gate green (lint, tsc, 392 tests, build).
- [x] **Loading-state sweep (§12)**: added page-shaped loading.tsx skeletons for
  every dynamic route group missing one — reflect/wall/passport/record/admin
  (be8a03e) + courses/[courseId] + materials/[materialId] (b8472db). practice/
  today/(dashboard)/verify/lessons already had theirs. Audited the full scan:
  remaining "MISS" entries are covered by a parent group skeleton or are fast
  auth-redirect pages (/ and /login) where a skeleton would flash.
- [x] **Follow-up chain surfacing**: sim_cases.follow_up was read by nobody.
  Chain POST now selects it and extends steps with a trailing
  {surface: follow_up, status: pending} when content exists (946aeb1) — inert
  for all current data (no seeded follow_up), idempotent on existing chains,
  /today's consumer already renders it ("Continue with {patient} · Follow-up
  visit" → /practice/consulting-room). Content itself stays the Kavya-side
  clinical spec (NEEDS_KAVYA / IDEAS_NEXT). Follow-up session-creation mode
  deferred until the content shape exists.
- [x] **Verified complete**: modal/dropdown/popover transitions already ship
  via Radix data-state + Tailwind animate-in/out (no work needed). Full gate
  green on every commit (lint 0/0, tsc clean, 379 tests, build exit 0).

## BEASTMODE ROUND 10 — PRODUCTION SAFETY + FREE AI + UI POLISH (2026-08-14)

- [x] **Premium neobrutalism UI pass**: motion-system tokens in globals.css,
  tactile buttons, homepage hero cascade + Parallax, uppercase brand on landing
  nav/footer, dashboard course-card cascade, nav micro-interactions — committed
  615499b. Remaining: subagent dashboard polish on practice/today/wall must
  land + gate. Landed bd168e3 (Reveal cascades on /practice /today /wall
  /enquire /login + equal-height cards) — gate green. [brief §7-13]
- [x] **Free-first voice**: MiMo (MIT) added as tier 1, chain reordered with
  ElevenLabs LAST (paid, not recommended) — committed 615499b. R2 cache prune
  helper landed bd168e3 (scripts/prune-voice-cache.ts); pregen verified —
  dry-run reports 74 scripted fallback lines + no-key honest path, both exit 0.
  Gate green. [brief §15-27]
- [x] **§24 AI free-tier doc**: docs/AI_FREE_TIERS.md — per-provider table
  (provider/model/purpose/cost/free-limits/env-var/setup/fallback) + chain
  order + privacy note. Committed 006d412. [brief §24]
- [x] **Performance/efficiency tech-stack pass**: safe wins only — pregen
  --dry-run verified, R2 prune helper (prune-voice-cache.ts), /verify loading
  skeleton, client-bloat fixes (ui/table + simulation-badge → server
  components) — landed bd168e3; no production infra, no new deps. Conservative
  data caching (unstable_cache) skipped: every dashboard query is per-user.
  Gate green. [brief §29-30]
- [x] **Key-leak audit**: server secrets stay server-side — verified clean
  across client files; NEXT_PUBLIC_* only public-by-design vars. [brief §28]
- [x] **Final report §35 A-F**: changed / AI decisions OLD→NEW→WHY→COST→FREE
  LIMIT / API-key table / infra-safety confirmation / new deps / limitations —
  written to NIGHT_LOG.md at session end after subagents landed.

## RESEARCH ROUND — free LLM tier follow-ups (2026-08-14)

- [x] **Wire Groq as Primary Director/Actor provider**: registry now routes
  `json`/`chat`/`stream` to groq first (no-train → serves student data);
  engine uses capability "json" (Director) + stream (Actor) with workload
  `sim_patient_turn`; json_object + Zod-repair + failover path; 4 router tests.
  Only blocker: `GROQ_API_KEY` (in NEEDS_KAVYA). json_schema left as json_object
  — Groq's strict mode is "in flux" and Cerebras 422s without additionalProperties:false
  on all objects; the provider-agnostic Zod-repair path is the reliable choice. [research 2026-08-14]
- [x] **Wire Cerebras as Fallback Director/Actor provider**: already the
  no-train JSON fallback in the registry (second after groq). Needs
  `CEREBRAS_API_KEY` (in NEEDS_KAVYA). [research 2026-08-14]
- [x] **OpenRouter free-tier decision surfaced**: stays an overflow lane at 50
  RPD; the one-time $10 → 1,000 RPD choice is Kavya's call — surfaced in
  NEEDS_KAVYA. [research 2026-08-14]
- [x] **Quota re-verify at integration time**: surfaced in NEEDS_KAVYA as a
  go-live reminder — limits are account-dependent and moved through 2026. [research 2026-08-14]

## BEASTMODE ROUND 9 — attempt tables + content wiring + polish (2026-08-13)

- [x] **Attempt Tables (MSE)**: Wire `mse_attempts` write on MSE level completion (level-observe → level-domain → level-full-mse → level-live-mse) — follows `osce_attempts` pattern [IDEAS_NEXT #1]
- [x] **Attempt Tables (Formulation)**: Wire `formulation_attempts` write on Formulation Forge completion (5P grid + narrative + diff) [IDEAS_NEXT #1]
- [x] **Attempt Tables (SCT)**: Wire `sct_attempts` write on SCT Arena completion (panel scored) [IDEAS_NEXT #1]
- [x] **Content Wiring (MSE)**: Replace static TS stimuli in `level-observe/level-domain/level-full-mse/level-live-mse` with readers from live `mse_stimuli` table (seeded) [IDEAS_NEXT #2]
- [x] **Content Wiring (Formulation)**: Replace static TS cases in Formulation Forge with readers from live `formulation_cases` table (seeded) [IDEAS_NEXT #2]
- [x] **Content Wiring (Idioms)**: decode drill merges approved `public.idioms` with the static bank (new approvals appear, content never reduced); Rounds/Clinic use idioms via their own content structures [IDEAS_NEXT #2]
- [x] **ElevenLabs TTS**: Wire Kavya's ElevenLabs account (voice "Rudra") into the TTS provider chain as premium tier above Qwen3 [IDEAS_NEXT #3]
- [x] **Recurring Patient Arcs (scaffold)**: chain created on debrief, /today surfaces it; follow_up content still needs a spec [IDEAS_NEXT #4]
- [x] **Polish (OSCE Debrief)**: Ensure debrief shows checklist fraction, global rating, and composite with same visual language as Consulting Room debrief [polish]
- [x] **Tests**: Add 5 integration tests covering attempt-table writes for MSE/Formulation/SCT (fixture-tested, deterministic) [Master §11]

## BEASTMODE ROUND 9 cont. — briefs-verified gaps (2026-08-13)

- [x] **Content Wiring (Idioms)**: decode drill merges approved `public.idioms` with the static bank (new approvals appear, content never reduced); Rounds/Clinic use idioms via their own content structures [IDEAS_NEXT #2]
- [x] **Content Wiring (MSE)**: Replace static TS stimuli in level-observe/domain/full-mse/live-mse with readers from live `mse_stimuli` (now 30 seeded) [IDEAS_NEXT #2]
- [x] **Content Wiring (Formulation)**: Replace static SEED_FORMULATION in forge with readers from live `formulation_cases` [IDEAS_NEXT #2]
- [x] **Rounds per-user scheduling**: Persist reviews to `card_reviews` (deck reseeds state per visit today); due queue + history. Seeds have no DB id — scope to published cards [verified gap]
- [x] **Quiz after lesson completion**: QuizCheck is wired in decode/ethics/mse/osce but lessons have no quiz surface [briefs scan]
- [x] **OSCE voice mode**: voice delivery only in Consulting Room today; OSCE is "voice strongly preferred" but text-only [briefs scan]
- [x] **Cohort pulse nudge**: /admin/pulse nudge records intent but doesn't call the real nudge API [briefs scan]
- [x] **ElevenLabs TTS**: premium tier voice "Rudra" — needs Kavya's account keys [IDEAS_NEXT #3]
- [x] **Recurring Patient Arcs (scaffold)**: chain created on debrief, /today surfaces it; follow_up content still needs a spec [IDEAS_NEXT #4]
## DESIGN UI/UX PASS — "Make the UI UX Better" (2026-08-14, research-first)

- [x] **Research pass** — WebSearch on 2026 design trends + Neo-Brutalism
  (editorial neo-brutalism, calm interfaces, motion-that-explains, marquee
  tickers, scroll progress, accessibility-as-infrastructure). Documented
  before any code.
- [x] **Curriculum marquee ticker** — `marquee.tsx` between hero and Problem:
  two duplicated runs, -50% translate loop, pause on hover, static strip for
  reduced-motion via the global rule. Real curriculum terms, nothing
  fabricated. Shipped 846d1b0.
- [x] **Scroll-progress bar** — 2px ink fill along the sticky-nav top edge,
  RAF-throttled passive listeners; kept for reduced-motion (scroll state).
  Shipped 846d1b0.
- [x] **Live pulse dot** — peach `animate-live` ring on the hero cohort line.
  Shipped 846d1b0.
- [x] **LIVE verification** — deployed to vibhapsychology.com, fresh-browser
  checks: marquee animating (14 terms), progress 58.4% at 1400px scroll,
  pulse animating, all sections render, /enquire intact, 0 console errors,
  0 horizontal overflow. Full-page screenshot /tmp/plms-live-verify.png.

## Deferred — human actions, not code tasks (each has its NEEDS_KAVYA line)

The code queue is exhausted. Every remaining QUEUE item is a deferral: a
single specific human action, documented in NEEDS_KAVYA.md, that no code can
perform (interactive account auth, an unprovided key, a browser download).
They are kept here as a visible hand-off list — not as `- [ ]` work items,
because the buildable part of each is done and committed. When the human
completes one, tick it below.

- ✅ Deferred · **Vercel Security Checkpoint relaxation** — relax/bypass the
  checkpoint for authorized testing so the SharkVoid retest can validate
  admin/API surfaces (currently all challenge-blocked 403). Vercel → project
  → Settings → Security. (NEEDS_KAVYA: security retest access)
- ✅ Deferred · **DNS-AID agent records** — add `_a2a._agents.vibhapsychology.com
  IN SVCB ...` (and `_index._agents...`) at the DNS provider to finish the
  DNS for AI Discovery standard. Records documented in NIGHT_LOG; needs
  DNS-provider access, not code.
- ✅ Deferred · **MCP Server Card** — `/.well-known/mcp/server-card.json` can
  be published IF an MCP server is ever built; without one the card would be
  misleading. Parked intentionally.

- ✅ Deferred · **Main merge → main** — HELD on Kavya's "wait" (she paused the
  push). Branch `feat/groq-primary-director` is 120 commits ahead of main;
  origin/main is an ancestor (clean fast-forward). The 5-command sequence is
  in NIGHT_LOG.md; say the word and it lands. (MORNING_REPORT: branch state)
- ✅ Deferred · **Link-colour decision** — peach text (~1.9:1) on cream in
  ~90 files vs the terracotta `--color-link` token vs ink+underline. Brand
  call, flagged not changed. (NEEDS_KAVYA: design decision)
- ✅ Deferred · **Fly deploy** — `flyctl auth login` (interactive browser —
  only the account owner can authenticate) then
  `bash scripts/deploy-omniroute.sh`; set OMNIROUTE_URL to the resulting Fly
  URL. Everything else is deployed-ready. (NEEDS_KAVYA: "OmniRoute to cloud —
  one interactive step")
- ✅ Deferred · **CEREBRAS_API_KEY** — obtain from cloud.cerebras.ai (free, no
  card); the no-train double for the 45-DAU capacity target. (NEEDS_KAVYA:
  capacity keys)
- ✅ Deferred · **POCSO 2012 PDF** — India Code serves a JS shell to Node
  (verified 302 → Angular shell); the only reachable copies are third-party,
  which the corpus doesn't ingest. Browser download of Act 32 of 2012 to
  scripts/corpus/raw/statutes/pocso2012.pdf, then `npm run corpus:normalise`.
  (NEEDS_KAVYA: manual downloads)

Code-completable items are all done and committed, most recently:
- [x] **mhGAP/NMHS/POCSO/RCI manual downloads** — auto-resolved for mhGAP
  (Wayback 2024), NMHS (Wayback 2018), RCI (Samagra Shiksha Gujarat), MHA
  (live India Code): fetchers now fall back to verified Wayback/official
  mirrors, all four PDFs are in scripts/corpus/raw/ and normalised →
  scripts/corpus/normalised/{mhgap,nmhs,statutes}.json (verified clean: 0
  mojibake, 0 page-marker leaks, MHA 12 chapters intact). POCSO 2012 is the
  sole survivor — see the deferred list above. (commit acffb74)

## MOBILE-FIRST REBUILD (2026-08-14 — dashboard + patient sim)

Priority order: patient sim → nav → today → courses → practice → voice →
keyboard/safe-area → hierarchy → animation → polish. Backend/data/API contracts
UNTOUCHED. Preserve VIBHA identity; desktop must not regress.

- [x] T1  Mobile design system (src/components/mobile/: page, section, card,
  list-item, header, bottom-sheet, status-pill) on existing ui/ primitives
- [x] T2  Patient simulation — full-screen chat rebuild (session-view →
  SimulationHeader + ChatList + ChatComposer + NotesSheet + HintSheet; kill
  giant fixture banner → subtle status pill; single-row composer)
- [x] T3  Mobile navigation + header polish (bottom-tab-bar touch targets +
  active motion; contextual back headers)
- [x] T4  Today dashboard (mostly good — polish spacing + "one thing next")
- [x] T5  Courses — clean vertical lesson rows (kill nested week cards)
- [x] T6  Practice hub — category grouping, reduce boxes
- [x] T7  Assessment UI — question prominent, tappable answers, compact progress
- [x] T8  Journal + Wall — textarea/keyboard, compact posts/replies
- [x] T9  Material/lesson viewer error states + mobile controls
- [x] T10 Voice UX — tap-to-toggle conversational loop + explicit states
- [x] T11 Keyboard + safe-area handling (composer, inputs, bottom nav)
- [x] T12 Loading/empty/error states (skeletons, human copy)
- [x] T13 Accessibility (44px targets, contrast, reduced-motion, labels)
- [x] T14 Animation/motion (message arrival, sheet, active nav — reduced-motion safe)
- [x] T15 Patient conversational quality — wire disclosure gate depth +
  voice_profile + story/contradictions into turn route (smallest sensible change)
- [x] T16 Mobile testing matrix (320/360/375/390/412/430) + desktop regression
  (1280/1440) via Playwright
- [x] T17 Final mobile UX audit + visual QA
- [x] T18  Global progressive-disclosure audit — review every mobile route and
  component across the application; identify desktop-density patterns and
  redesign them around one meaningful cognitive task at a time; do not merely
  stack or shrink desktop content

- [x] T19  Mobile interaction-flow audit — for every major mobile feature define
  the primary goal, primary action, required information, next action, and
  secondary actions; remove competing actions from the initial viewport and
  reveal secondary functionality contextually

- [x] T20  Mobile-specific page compositions — wherever desktop composition is
  fundamentally different from the ideal mobile experience, create a dedicated
  mobile composition instead of forcing the desktop component through CSS;
  share data/business logic but allow mobile-specific interaction architecture

- [x] T21  Progressive forms — audit every form, intake flow, registration flow,
  profile flow, assessment flow, feedback flow, and administrative form on
  mobile; group related fields into meaningful steps rather than presenting
  long forms; preserve context, progress, validation, back navigation, and
  entered state

- [x] T22  Progressive assessments — apply the one-cognitive-task pattern to
  every assessment, quiz, MCQ, ordering task, matching task, scenario,
  reflection, and knowledge check; never assume that the desktop number of
  visible questions should be retained on mobile; implement focused sequential
  flows where appropriate

- [x] T23  Assessment flow engine — create/reuse a shared mobile interaction
  pattern for sequential assessment content so the same progressive behavior
  can be used across different assessment types instead of implementing
  separate one-off solutions for each screen

- [x] T24  Mobile lesson-flow redesign — audit lessons containing multiple
  sections, activities, resources, videos, questions, reflections, and
  exercises; progressively reveal content where appropriate and always make
  the current learning task and next action obvious

- [x] T25  Mobile reading/content flow — redesign long educational content for
  phone consumption using sections, chapters, progressive reading, contextual
  navigation, completion state, and clear continuation actions; eliminate
  unnecessary giant scrolling pages without hiding required content

- [x] T26  Mobile resource hierarchy — audit PDFs, documents, references,
  attachments, supplementary resources, transcripts, notes, and downloads;
  show the most relevant resource first and move secondary resources into
  contextual sections or sheets where appropriate

- [x] T27  Mobile course navigation — redesign course → module → week → lesson →
  activity hierarchy for focused navigation; preserve access to the complete
  curriculum while making the current lesson/activity the dominant mobile
  context

- [x] T28  Mobile "Continue" system — establish consistent contextual
  continuation actions across courses, lessons, assessments, practice,
  simulations, reflections, and other sequential experiences; "Continue"
  should always represent the actual next meaningful action

- [x] T29  Mobile completion states — create consistent completion experiences
  for lessons, sections, questions, assessments, practice sessions, cases, and
  courses; provide useful feedback and an obvious next action without adding
  unnecessary visual clutter

- [x] T30  Mobile practice flows — audit every practice tool and redesign dense
  multi-tool screens into focused task flows; expose the available practice
  categories without forcing every tool, description, and option onto one
  viewport

- [x] T31  Mobile clinical workflows — audit all clinical/educational
  workflows beyond patient chat, including case selection, case information,
  clinical questions, assessments, notes, debriefs, formulation, MSE,
  psychopharmacology, and other practice modules; apply focused progressive
  interactions throughout

- [x] T32  Mobile psychopharmacology experience — redesign medication browsing,
  medication details, comparisons, learning checks, and related educational
  interactions for mobile; prioritize one medication/concept at a time where
  appropriate and progressively expose secondary information

- [x] T33  Mobile case workflow — redesign Cases from discovery → case overview →
  preparation → patient interaction → notes → completion → debrief; keep the
  current task dominant and move secondary case metadata into contextual
  surfaces

- [x] T34  Mobile debrief architecture — redesign all post-practice feedback,
  reflection, scoring, missed opportunities, explanations, and recommendations
  into progressive sections; avoid presenting one enormous debrief page

- [x] T35  Mobile notes architecture — standardize contextual notes across
  lessons, cases, simulations, assessments, and resources using sheets or
  focused editors where appropriate; users must be able to return to their
  original context without losing state

- [x] T36  Mobile search experience — audit search wherever available; create a
  phone-first search flow with focused results, useful filters, progressive
  refinement, and contextual result details rather than dense desktop-style
  result grids

- [x] T37  Mobile filters and sorting — convert dense desktop filter panels into
  mobile bottom sheets or progressive filter flows; preserve all filtering
  capabilities without permanently consuming screen space

- [x] T38  Mobile tables and dense data — audit every table, comparison,
  statistics view, progress matrix, and dense information layout; replace
  desktop tables with appropriate mobile patterns such as stacked records,
  horizontal comparison only where genuinely necessary, progressive details,
  or focused item views

- [x] T39  Mobile dashboards beyond Today — audit every dashboard and analytics
  surface in the application; remove desktop dashboard density and redesign
  around the most important metric/action first, with deeper information
  progressively revealed

- [x] T40  Mobile progress architecture — standardize how course, lesson,
  assessment, practice, and program progress is communicated; keep progress
  visible enough to maintain orientation without allowing progress UI to
  dominate the screen

- [x] T41  Mobile profile/account flows — redesign profile, account,
  preferences, notifications, privacy, security, and settings into grouped
  progressive sections; avoid giant settings pages

- [x] T42  Mobile notification experience — redesign notifications around
  actionable information; prioritize what requires attention, group secondary
  notifications, and prevent notification lists from becoming visually dense

- [x] T43  Mobile modals → contextual surfaces — audit every modal currently
  used on mobile; convert suitable interactions into bottom sheets, inline
  expansion, full-screen focused flows, or contextual menus depending on task
  complexity

- [x] T44  Mobile navigation depth audit — identify unnecessary navigation
  layers and reduce the number of screens required to complete common actions;
  preserve clear back behavior and never sacrifice context for fewer screens

- [x] T45  Mobile contextual actions — move secondary actions such as notes,
  hints, sharing, reporting, metadata, references, and additional options into
  contextual controls instead of displaying them permanently

- [x] T46  Mobile multi-step state preservation — ensure partially completed
  assessments, forms, lessons, cases, simulations, reflections, and other
  workflows preserve state when navigating backward, opening a sheet, changing
  orientation, or temporarily leaving the screen

- [x] T47  Mobile interruption recovery — design what happens when a user
  receives a call, switches applications, locks the phone, loses network,
  refreshes, or returns later; restore the correct task/context without forcing
  the user to restart

- [x] T48  Mobile offline experience — audit all mobile functionality that can
  operate offline or encounter connectivity loss; provide clear but subtle
  offline states, preserve local progress where supported, and make recovery
  understandable

- [x] T49  Mobile network/loading strategy — audit all asynchronous mobile
  interactions; use skeletons or focused loading states where appropriate and
  prevent layout jumping; never make the user stare at an unexplained blank
  screen

- [x] T50  Mobile error recovery — standardize error handling across the entire
  mobile application; every failure should explain what happened in human
  language, preserve user state when possible, and provide an obvious recovery
  action

- [x] T51  Mobile empty-state system — create reusable intentional empty states
  for courses, practice, journal, wall, notifications, cases, search,
  assessments, and other areas; every empty state should explain what the user
  can do next

- [x] T52  Mobile confirmation patterns — audit unnecessary confirmation
  dialogs; remove confirmations where the action is reversible, use inline
  feedback where possible, and reserve disruptive confirmations for meaningful
  destructive or irreversible actions

- [x] T53  Mobile input architecture — audit every text field, textarea,
  selector, checkbox, radio, date input, upload control, and interactive form
  element; make every input comfortable for touch and correctly handle the
  mobile keyboard

- [x] T54  Mobile keyboard QA — test every input-heavy workflow with the
  software keyboard open; ensure focused fields, submit actions, textareas,
  bottom sheets, chat composers, and navigation remain usable and never become
  hidden behind the keyboard

- [x] T55  Mobile gesture audit — identify places where gestures can genuinely
  improve usability, such as dismissing sheets, navigating media, or moving
  through sequential content; use gestures selectively and always preserve
  obvious accessible controls

- [x] T56  Mobile swipe/step interactions — where sequential content benefits
  from swiping, implement it carefully alongside explicit Next/Back controls;
  never make a required action dependent solely on an undiscoverable gesture

- [x] T57  Mobile sticky-action audit — identify flows where the primary action
  should remain accessible while scrolling; implement contextual sticky
  actions without covering content or competing with the bottom navigation

- [x] T58  Mobile content truncation audit — remove ugly desktop truncation such
  as "Interviewing 101 — the firs..." throughout the application; redesign
  long titles/descriptions using appropriate wrapping, progressive disclosure,
  or detail views

- [x] T59  Mobile card-density audit — systematically identify cards nested
  inside cards, repeated borders, unnecessary shadows, and excessive containers
  across the entire application; simplify the visual hierarchy while
  preserving VIBHA's neo-brutalist character

- [x] T60  Mobile visual hierarchy pass — every screen must have a clear primary,
  secondary, and tertiary hierarchy; reduce competing typography, borders,
  labels, buttons, and accent colors so users immediately understand what
  matters

- [x] T61  Mobile design-language consistency — apply the established VIBHA
  mobile design system consistently across every route, including typography,
  spacing, borders, buttons, status pills, cards, sheets, inputs, navigation,
  chat, progress, and feedback

- [x] T62  Mobile animation system — standardize purposeful transitions for
  progressive content, Next actions, sheets, navigation, completion states,
  chat messages, voice states, loading, and feedback; keep animations subtle,
  performant, and reduced-motion safe

- [x] T63  Mobile micro-interaction pass — add small meaningful feedback for
  taps, selections, completion, saving, progress, navigation, and state
  changes; do not add decorative animation that increases cognitive load

- [x] T64  Mobile accessibility sweep — run the entire application against
  touch targets, semantic controls, labels, keyboard navigation, contrast,
  dynamic text, reduced motion, focus behavior, and screen-reader semantics;
  fix systemic issues rather than patching isolated screens

- [x] T65  Mobile typography sweep — audit every route for font size, line
  height, weight, wrapping, hierarchy, readable line length, and long-content
  behavior; eliminate tiny text and awkward wrapping

- [x] T66  Mobile safe-area sweep — audit every fixed, sticky, bottom, and
  full-screen element for safe-area handling across modern phones; verify
  bottom navigation, chat composer, sheets, voice UI, modals, and sticky
  actions

- [x] T67  Mobile scroll-behavior audit — remove accidental nested scrolling,
  unexpected horizontal scrolling, scroll trapping, scroll jumps, and
  unnecessarily long pages; ensure each scroll container has a clear purpose

- [x] T68  Mobile long-content strategy — test every screen with unusually
  long content, long names, long questions, long patient messages, long lesson
  titles, and large descriptions; ensure the progressive interaction model
  still works without overflow or broken layout

- [x] T69  Mobile media experience — audit video, audio, images, PDFs,
  transcripts, and other media; create mobile-specific controls and layouts
  where desktop media interfaces create unnecessary density

- [x] T70  Mobile upload/download flows — redesign file selection, upload
  progress, download actions, document previews, and failures for mobile;
  ensure users always understand the current state of a file operation

- [x] T71  Mobile authentication flow — audit login, signup, password reset,
  verification, session expiry, and authentication errors for phone-first
  interaction; minimize unnecessary fields and ensure keyboard behavior is
  correct

- [x] T72  Mobile onboarding flow — if onboarding exists, redesign it around
  focused steps and progressive disclosure; do not show a desktop-style
  onboarding dashboard on mobile

- [x] T73  Mobile permission flows — audit microphone, notification, storage,
  camera, and other browser permissions; explain permissions in context and
  provide a useful fallback when access is denied

- [x] T74  Mobile performance audit — identify unnecessary renders, oversized
  components, expensive animations, excessive network requests, heavy lists,
  chat rendering issues, and media loading problems; optimize the highest
  impact issues

- [x] T75  Mobile component consolidation — after the redesign, identify
  duplicate mobile components and one-off implementations; consolidate shared
  patterns into reusable primitives without forcing unrelated experiences into
  the same component

- [x] T76  Mobile route-by-route UX review — manually inspect every mobile route
  in the application and document whether it follows the core principles:
  focused task, progressive disclosure, clear hierarchy, obvious next action,
  contextual secondary actions, correct spacing, safe-area behavior, and
  preserved state

- [x] T77  Mobile workflow completion audit — test complete end-to-end journeys,
  not isolated pages: login → dashboard → course → lesson → assessment →
  practice → patient simulation → debrief → journal → wall; identify and fix
  friction between screens

- [x] T78  Mobile first-time-user audit — test the application as a user who has
  never seen it before; verify that navigation, terminology, actions, progress,
  and next steps are understandable without prior knowledge

- [x] T79  Mobile returning-user audit — test as an existing student with
  partially completed courses, unfinished assessments, previous journal
  entries, ongoing cases, and existing progress; ensure the interface
  intelligently surfaces continuation points

- [x] T80  Mobile interruption/return audit — begin important workflows, leave
  them midway, navigate elsewhere, return later, and verify that the
  application returns the user to the correct context

- [x] T81  Mobile regression matrix — systematically test 320/360/375/390/412/430
  widths across all major routes and interaction states; test portrait and
  relevant landscape states where applicable

- [x] T82  Desktop regression matrix — after all mobile-specific architectural
  changes, verify 1280/1440+ desktop layouts and all critical desktop
  interactions; fix only genuine regressions without compromising the mobile
  architecture

- [x] T83  Mobile visual comparison pass — compare the rebuilt experience
  against the current implementation and verify that the redesign has
  materially reduced clutter, unnecessary nesting, excessive scrolling, poor
  hierarchy, and desktop-density patterns

- [x] T84  Mobile UX red-team pass — intentionally try to break the experience:
  extremely long content, rapid taps, repeated Next actions, back/forward
  navigation, network failure, keyboard open, permission denial, empty data,
  incomplete data, slow loading, and interrupted sessions; fix everything
  discovered

- [x] T85  Mobile cognitive-load pass — review every major flow specifically for
  unnecessary decisions, simultaneous choices, visual noise, reading burden,
  repeated navigation, and unclear next actions; simplify wherever possible

- [x] T86  Mobile progressive-disclosure consistency pass — verify that the
  one-task-at-a-time philosophy is applied consistently across assessments,
  lessons, forms, practice, clinical workflows, documents, settings,
  dashboards, and other relevant experiences rather than being implemented as
  isolated patterns

- [x] T87  Mobile "what next?" audit — open every major screen with fresh eyes
  and verify that a user can identify the intended next action within seconds;
  redesign screens where multiple actions compete equally

- [x] T88  Mobile product polish pass — final pass for spacing, typography,
  icons, borders, button states, animations, transitions, loading, empty
  states, error states, copy, touch behavior, and visual consistency

- [x] T89  Mobile end-to-end QA — run the complete student journey from
  authentication through learning, assessment, practice, simulation, debrief,
  reflection, and community features; verify functionality, state persistence,
  responsiveness, and visual quality

- [x] T90  Final mobile-first acceptance audit — do not consider the work
  complete until the application genuinely feels designed for a phone rather
  than a desktop application resized for a phone; verify that progressive
  disclosure, focused tasks, contextual actions, clear next steps, mobile
  navigation, patient conversation, voice interaction, accessibility,
  performance, and visual polish are consistently implemented throughout the
  entire mobile web application

  - [x] T91  Product simplification reset — perform a full application-wide audit
  with one question: "Would a student or admin immediately understand this?"
  Remove, merge, rename, or hide anything that does not directly contribute to
  learning, practice, administration, content management, or required system
  operation; do not preserve features merely because they already exist

- [x] T92  Caveman UI principle — establish a permanent product-writing and UX
  rule: use the fewest words necessary; prefer simple words, obvious labels,
  direct actions, and familiar language; remove unnecessary jargon, academic
  phrasing, product terminology, internal engineering terminology, and
  unnecessarily sophisticated explanations from student and admin interfaces

- [x] T93  "Explain only when needed" rule — explanations should appear only
  when a user genuinely needs context to make a decision; remove decorative
  descriptions, repetitive helper text, unnecessary subtitles, redundant
  instructions, and explanatory paragraphs that do not improve the user's
  ability to complete the task

- [x] T94  Student versus admin separation — audit the entire application and
  strictly separate student-facing functionality from administrative,
  operational, calibration, infrastructure, rights, and internal tooling;
  students should see learning and practice; admins should see only the tools
  required to operate the programme

- [x] T95  Admin information architecture rebuild — redesign the admin
  navigation around real jobs an administrator needs to perform rather than
  around internal database concepts or engineering terminology

- [x] T96  Admin navigation simplification — remove unnecessary admin
  navigation items, merge overlapping areas, and move technical/internal
  functionality into appropriate backend or system-level locations where it
  does not need to be exposed in the primary admin UI

- [x] T97  Admin "real work" audit — define the actual daily admin jobs:
  manage courses, manage modules, manage cards, manage medication content,
  manage students, manage programme content, review learning activity, manage
  practice content, and perform necessary operational actions; design the
  admin around these jobs

- [x] T98  Remove unnecessary Rights UI — remove Rights, Casebook Rights, and
  similar internal permission concepts from the primary admin navigation if
  they are infrastructure-level concerns; keep the underlying permission
  system intact and move management to the appropriate backend/system area

- [x] T99  Remove unnecessary Passport UI — audit Passport and related internal
  concepts; if it does not represent a real task the administrator needs to
  perform, remove it from the visible admin experience without breaking the
  underlying functionality

- [x] T100  Cohort Pulse simplification — completely rewrite the Cohort Pulse
  interface using simple language; replace confusing terminology and fancy
  product language with direct information such as students active, students
  falling behind, recent activity, problems, and actions to take

- [x] T101  Admin dashboard rewrite — redesign the admin home around a small
  number of useful things that require attention; show what needs action first,
  then useful programme information; avoid decorative metrics and meaningless
  statistics

- [x] T102  Admin action-first hierarchy — every major admin page should answer
  three questions immediately: what am I looking at, what can I do here, and
  what should I do next

- [ ] T103  Admin content editor redesign — make content editing feel like a
  normal editor rather than an engineering control panel; an administrator
  should be able to open content, edit the title/body/options/media, save it,
  preview it, and publish it without understanding the underlying data model

- [ ] T104  Admin editor consistency — create one reusable editing philosophy
  across courses, modules, lessons, cards, assessments, medication content,
  practice scenarios, patient cases, and other editable programme content;
  do not create a different complicated editor for every content type

- [ ] T105  Card management rebuild — redesign Card Review so the admin can
  immediately understand what cards exist and can add, edit, duplicate,
  reorder, preview, archive, and delete cards; remove technical fields and
  internal metrics that do not help the admin perform these actions

- [x] T106  Card creation flow — create a simple "Add card" experience with the
  minimum fields necessary; show advanced configuration only when genuinely
  required; support preview before saving

- [x] T107  Card review language — remove confusing concepts such as unexplained
  seconds, internal scoring terminology, implementation terminology, or other
  values that do not have an obvious administrative purpose; if a value is
  required internally, hide it behind an appropriate advanced/system layer

- [x] T108  Psychopharmacology admin repair — fix the medication/psychopharma
  review route so it actually opens, loads, edits, saves, previews, and
  navigates correctly on both desktop and mobile; test the entire workflow
  rather than only fixing the visible button

- [x] T109  Psychopharmacology content architecture — ensure medication content
  can be managed cleanly without exposing unnecessary implementation details;
  separate student-facing educational content from admin editing controls

- [x] T110  Student medication experience — audit the student-facing
  psychopharmacology experience and ensure it presents information in a
  focused, understandable learning sequence rather than exposing a large
  database-like medication interface

- [x] T111  Data-driven calibration architecture — remove the requirement for
  the administrator to manually operate a visible scorer-calibration workflow
  as part of normal administration; calibration should be driven by collected
  programme data, approved reference examples, scoring outcomes, and other
  available evaluation data where appropriate

- [x] T112  Calibration automation — design the calibration system so that
  scoring quality can be evaluated and recalibrated using accumulated
  structured data rather than requiring the admin to manually open a
  calibration page for routine operation

- [x] T113  Calibration transparency — if calibration information must be
  visible to an administrator, expose only useful summaries such as status,
  quality, sample size, recent changes, and whether attention is needed;
  hide statistical/technical complexity unless explicitly requested

- [x] T114  Calibration safety boundary — do not silently modify production
  scoring behaviour based on unvalidated data; establish a reviewable process
  for evaluating calibration changes before they affect student scoring

- [x] T115  AI patient architecture rebuild — replace the current assumption
  that the patient is fundamentally a scripted conversation; the existing
  patient script/story should become the behavioural source material and
  constraints that guide an AI patient rather than being presented as the
  conversation engine itself

- [ ] T116  AI patient behavioural layer — design a structured patient
  behaviour/profile layer containing personality, presenting complaint,
  emotional state, communication style, relevant history, knowledge limits,
  disclosure patterns, sensitivities, contradictions, uncertainty, and other
  case-specific behavioural characteristics supported by the case data

- [x] T117  AI patient response engine — connect the configured AI provider to
  the patient simulation so the model generates responses dynamically while
  respecting the case's facts, personality, behavioural rules, disclosure
  depth, story, contradictions, and scenario boundaries

- [ ] T118  Patient prompt architecture — create a strong system-level patient
  instruction that tells the model how to behave as the patient, what it knows,
  what it does not know, when it should disclose information, how it should
  react emotionally, how it should respond to different interviewing styles,
  and how it should maintain consistency throughout the session

- [x] T119  Patient state persistence — maintain structured session state across
  turns so the AI patient remembers what the student has asked, what has
  already been disclosed, what has not been disclosed, emotional changes,
  contradictions, and important conversation context

- [x] T120  Patient realism layer — prevent robotic repetition, generic AI
  responses, unnatural verbosity, immediate disclosure of every case detail,
  and repetitive phrasing; responses should feel like a person responding in
  a conversation while remaining grounded in the case

- [x] T121  Patient response constraints — ensure the AI does not invent major
  clinical facts that contradict the configured case; distinguish between
  deliberate patient uncertainty/ambiguity and accidental model fabrication

- [ ] T122  Patient scenario difficulty — support configurable difficulty
  through behaviour rather than merely changing a difficulty number; examples
  include guarded patients, vague patients, emotional patients, inconsistent
  histories, over-detailed patients, reluctant disclosure, and other useful
  interviewing behaviours

- [ ] T123  Patient conversational quality testing — create automated and manual
  test scenarios that evaluate whether the AI patient remains in character,
  maintains case consistency, answers naturally, does not dump the entire case
  immediately, and responds appropriately to different student approaches

- [x] T124  Patient simulation fallback — retain a reliable fallback path if an
  AI provider fails, times out, reaches a limit, or becomes unavailable; the
  UI should clearly distinguish a real AI session from a scripted/offline
  fallback without making the normal experience feel broken

- [x] T125  Voice experience separation — redesign voice interaction as a
  dedicated focused experience rather than attaching a complicated voice
  control system underneath the existing chat interface

- [x] T126  Voice full-screen route — tapping the Voice button should open a
  dedicated voice conversation screen designed specifically for speaking;
  provide an obvious microphone state, current conversation, end-session
  control, and a simple way to return to typing

- [x] T127  Voice/type switching — allow the user to switch between voice and
  text with one obvious action; preserve the exact conversation state when
  switching modes

- [x] T128  Voice state clarity — clearly distinguish listening, processing,
  speaking, muted, permission denied, disconnected, and idle states using
  simple visual and textual feedback

- [x] T129  Voice conversation loop — implement a natural conversational loop
  where the student can speak, the system transcribes/processes the input,
  the AI responds, and the response can be spoken back without requiring the
  user to repeatedly navigate through complicated controls

- [x] T130  Voice permission UX — if microphone permission is blocked, provide
  one simple explanation and one clear recovery action; do not permanently
  consume a large portion of the conversation screen with browser-specific
  technical explanations

- [x] T131  Voice fallback to text — if voice cannot work, the student should
  immediately be able to continue typing without losing the conversation

- [x] T132  Patient conversation composer rebuild — make the normal patient
  conversation composer extremely simple: type, send, voice, and finish;
  remove unnecessary controls from the primary interaction area

- [x] T133  Patient conversation navigation — remove the persistent bottom
  navigation from the active patient conversation if it interferes with the
  conversation; the simulation should feel like a focused full-screen task

- [x] T134  Contextual simulation header — keep only essential information in
  the patient header: patient identity/context, session state, elapsed time if
  genuinely useful, and a simple menu for secondary actions

- [x] T135  Patient simulation secondary actions — move notes, hints, case
  information, settings, and other secondary functionality into contextual
  sheets or menus instead of competing with the conversation

- [x] T136  Mobile bottom navigation audit — redesign the bottom navigation so
  it never overlaps content, composers, buttons, sheets, or fixed controls;
  account for safe areas and keyboard height

- [x] T137  Bottom navigation scope — determine whether every route actually
  needs the bottom navigation; hide it automatically in immersive flows such
  as patient simulation, video playback, assessments, and other focused
  experiences where it creates interference

- [x] T138  Bottom navigation visual simplification — reduce visual weight,
  unnecessary borders, oversized active states, and excessive spacing while
  maintaining clear active/inactive states and comfortable touch targets

- [x] T139  Mobile resume architecture — identify every place where the same
  course, lesson, case, assessment, or practice item is repeatedly presented;
  replace repeated content blocks with one intelligent Resume/Continue entry
  point where appropriate

- [x] T140  Resume engine — create a shared "Continue where you left off"
  mechanism across courses, lessons, assessments, practice, patient cases,
  and other sequential experiences; calculate the actual next meaningful
  action rather than simply linking to the parent page

- [x] T141  Student home simplification — redesign the student dashboard around
  immediate action: what should I do now, what am I currently learning, and
  what can I practise; remove repeated promotional or informational blocks

- [x] T142  Student practice simplification — reduce the Practice area to a
  small number of understandable categories and useful actions; merge
  overlapping tools where appropriate and remove features that exist only
  because the underlying system can technically support them

- [x] T143  Student course simplification — make course progress and continuation
  immediately understandable; remove unnecessary nested cards, repeated
  descriptions, decorative labels, and overly detailed hierarchy

- [x] T144  Student assessment simplification — each assessment interaction
  should focus on the current question/task, available answers, progress, and
  next action; progressively reveal explanations and deeper feedback after the
  decision rather than displaying everything simultaneously

- [x] T145  Student explanation hierarchy — after an answer, show the useful
  explanation first; allow deeper reasoning, sources, references, or detailed
  discussion to expand only when useful

- [x] T146  Student learning feedback — redesign scores and feedback so a
  student understands what happened and what to do next without needing to
  interpret technical scoring terminology

- [x] T147  Mobile video player rebuild — create a genuinely phone-optimised
  video experience; support browser/full-screen APIs correctly and ensure
  full-screen video rotates to landscape when the device/browser allows it

- [x] T148  Video orientation handling — when a user enters video full-screen,
  implement appropriate orientation locking/request behaviour where supported;
  gracefully handle browsers that do not permit programmatic orientation
  changes

- [x] T149  Video learning controls — keep essential controls accessible while
  allowing immersive playback; avoid showing the normal dashboard navigation
  or unrelated application UI during full-screen learning

- [x] T150  Video resume behaviour — remember playback position and provide a
  simple Continue/Resume action when the student returns to a partially
  watched lesson

- [ ] T151  Video mobile QA — test playback, full-screen, rotation,
  orientation changes, browser restrictions, audio, captions/transcripts,
  playback position, network changes, and returning from full-screen on
  multiple mobile browsers

- [x] T152  Desktop/mobile architecture separation — explicitly decide which
  components should share business logic/data and which should have separate
  desktop and mobile presentation/interaction layers; do not force identical
  layouts across breakpoints

- [x] T153  Desktop admin optimisation — ensure the admin interface takes
  advantage of desktop space for real management work without importing mobile
  simplifications where they would hurt productivity

- [x] T154  Mobile admin optimisation — ensure the admin interface remains
  usable on a phone for quick actions, content edits, student checks, and
  operational tasks without attempting to reproduce the entire desktop admin
  workspace

- [x] T155  Responsive architecture audit — inspect every major component for
  whether it should reflow, transform, collapse, become a sheet, become a
  focused page, or use a completely different mobile interaction model

- [x] T156  Dark mode reassessment — review the current dark mode from scratch;
  if it does not look intentional, readable, and consistent with VIBHA's
  identity, redesign it rather than preserving it for completeness

- [x] T157  Dark mode scope decision — determine whether dark mode genuinely
  adds value to the product; if not, make the light theme the primary/default
  experience and avoid spending disproportionate effort maintaining a poor
  secondary theme

- [x] T158  Visual consistency audit — remove inconsistent icon styles,
  unnecessary decorative elements, arbitrary spacing, conflicting border
  treatments, excessive shadows, and components that visually look like they
  came from different products

- [x] T159  Copy audit across application — inspect every visible word in
  student and admin interfaces; replace technical, corporate, academic, vague,
  or AI-sounding copy with short, direct human language

- [x] T160  Remove AI-sounding language — eliminate unnecessary phrases such as
  "intelligent", "advanced", "adaptive", "calibration", "cohort pulse",
  "simulation engine", "behavioural layer", or other internal/marketing
  terminology from places where a normal user does not need those concepts

- [x] T161  Admin terminology dictionary — create a small approved vocabulary
  for admin UI labels and use it consistently; labels should describe the
  action or object in ordinary language

- [x] T162  Student terminology dictionary — create a small approved vocabulary
  for student-facing UI and avoid changing terminology between screens for the
  same concept

- [x] T163  Feature removal review — identify features that are technically
  impressive but do not materially improve learning, practice, teaching, or
  administration; recommend removing them rather than finding another place
  to display them

- [x] T164  Feature merging review — identify overlapping functionality and
  merge it into a single clearer workflow where possible; do not preserve
  multiple interfaces simply because they were built independently

- [x] T165  Backend versus UI boundary audit — move technical controls,
  infrastructure information, permissions internals, provider diagnostics,
  system configuration, logs, and engineering-only controls out of normal
  student/admin interfaces where they are not required for actual work

- [x] T166  Admin diagnostics boundary — retain technical diagnostics for
  developers/operators where needed but prevent them from polluting the normal
  administrator experience

- [x] T167  Student safety/quality UI boundary — keep necessary quality and
  learning safeguards functional while avoiding unnecessary warnings,
  technical implementation details, or internal system explanations in the
  student interface

- [x] T168  AI provider abstraction audit — verify that the patient simulation,
  voice system, and other AI features use a provider abstraction rather than
  hard-coding the interface to one provider; changing providers should not
  require rebuilding the student experience

- [x] T169  AI usage observability — provide internal operational visibility
  into AI failures, latency, provider availability, and usage where required,
  but keep these technical metrics out of the normal student/admin UI

- [x] T170  AI conversation quality monitoring — collect structured signals
  needed to identify poor patient responses, broken conversations, excessive
  repetition, hallucinated case facts, and provider failures so the system can
  improve over time

- [ ] T171  AI patient evaluation dataset — create a structured evaluation
  process using representative patient conversations and expected behavioural
  outcomes; use it to compare model/provider changes before deploying them

- [ ] T172  AI model regression testing — whenever the AI provider, model,
  prompt, patient behaviour configuration, or conversation architecture
  changes, run representative patient simulations and compare conversational
  quality before accepting the change

- [ ] T173  Patient prompt/version management — version patient behavioural
  instructions and scenario configurations so changes can be tracked,
  compared, rolled back, and evaluated without losing previous behaviour

- [x] T174  Patient case source-of-truth — ensure every AI patient has one
  authoritative structured case definition; the model should use that source
  rather than independently reconstructing the case from scattered UI data

- [x] T175  AI hallucination containment — implement structured grounding and
  validation around case facts; when the patient does not have a configured
  answer, the system should behave according to the case's uncertainty rules
  instead of inventing clinical history

- [x] T176  Conversation transcript quality — ensure transcripts are readable,
  correctly separated between student and patient, timestamped where useful,
  and preserved correctly for debriefing and learning analysis

- [x] T177  Debrief generated from actual session — ensure debriefs reference
  what the student actually said and what happened in the actual session
  rather than generating generic feedback unrelated to the conversation

- [x] T178  Student conversation debrief simplification — present the most
  useful feedback first: what you did well, what you missed, and what to try
  next; expose detailed analysis progressively

- [x] T179  Admin session review simplification — when an admin reviews a
  student's practice, show the actual useful learning information first;
  hide implementation metadata unless it is required for investigation

- [x] T180  End-to-end product cleanup — after implementing all preceding work,
  conduct a fresh route-by-route review and remove anything that has become
  redundant because of the new architecture

- [x] T181  "Would I use this?" audit — test the application from the
  perspective of an actual student and an actual programme administrator;
  document every moment where the interface causes confusion, unnecessary
  effort, unnecessary reading, or uncertainty

- [x] T182  Three-second comprehension test — for every major screen verify
  that the user can identify where they are, what the screen is for, and what
  they should do next within a few seconds without reading a large block of
  explanatory text

- [x] T183  One-primary-action rule — every major mobile screen should have
  one obvious primary action; secondary actions must visually and
  structurally remain secondary

- [x] T184  One-screen-one-job review — identify screens that attempt to do
  multiple unrelated jobs; split them into focused flows or progressively
  reveal secondary tasks rather than maintaining overloaded screens

- [x] T185  Final mobile navigation regression — test every route with the
  bottom navigation present, absent, keyboard open, keyboard closed, sheet
  open, full-screen mode, voice mode, video mode, and long content; verify no
  overlapping or inaccessible controls remain

- [x] T186  Final admin usability regression — test the complete admin workflow:
  login → dashboard → course → module → content editor → card creation →
  psychopharma → students → review/quality → save/publish; remove every
  unnecessary step discovered

- [x] T187  Final student usability regression — test:
  login → Today → Resume → Course → Lesson → Assessment → Practice → Patient
  Simulation → Voice → Debrief → Journal; verify every transition is obvious
  and no screen requires unnecessary explanation

- [x] T188  Final visual QA — inspect every major route on both desktop and
  mobile for spacing, hierarchy, typography, overflow, navigation,
  interaction states, loading, errors, empty states, animation, accessibility,
  and overall visual consistency

- [x] T189  Final performance QA — verify that the simplification work has not
  introduced unnecessary JavaScript, excessive network calls, expensive
  animations, large client bundles, slow route transitions, or unnecessary
  rendering

- [x] T190  Final product acceptance gate — the application is not complete
  merely because all features technically work; it must feel simple, calm,
  obvious, fast, focused, and purpose-built for psychology learning and
  practice; remove complexity rather than adding another explanation for it
