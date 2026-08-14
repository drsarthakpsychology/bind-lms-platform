# QUEUE
# Format is STRICT. Unchecked: "- [ ]" with exactly one space. Done: "- [x]".
# The Stop hook only blocks while unchecked items exist. This is the fuel.

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