# Morning Report — 2026-08-10

## Ship it
All 7 slices built, tested, and committed on `feat/practice-layer`. Everything is `draft`/`in_review` — nothing auto-published.

**Demo URL (after `npm run dev`):** `/practice`

## Try this first
1. `/practice/consulting-room` → pick "Ravi, 34 — 'the heaviness'" → Start session. Talk to a simulated patient (works with `AI_ENABLED=false` via fixtures — the patient gives in-character replies). Finish → the debrief shows your missed disclosures. That screen is the product.
2. `/practice/two-minute-clinic` → 120-second micro-drill with instant expert comparison. The retention feature.
3. `/practice/judgment` → "5 Judgment Calls" — the daily habit anchor. Panel distribution bar chart.

## Needs you (from NEEDS_KAVYA.md)
- Paste `GEMINI_API_KEY` + `GROQ_API_KEY` (free) → real patient conversations + voice speed
- Paste `ANTHROPIC_API_KEY` (paid) → student-session + journal "help me think" route to a no-train provider. Until then those show the honest "needs a paid key" message.
- Apply `src/migrations_pending/practice_layer_*.sql` to a dev branch (the MCP branch-create needs a cost-confirmation ID I couldn't mint — migrations are written + reviewable)
- Record 20 composite cases at `/admin/corpus/dictate` (the highest-value corpus source)
- Approve the 40 drafted cases + 62 SCT items in the review queues (all `approved: false`)
- Enable the Firecrawl/Playwright MCP entry in `.mcp.json` for future corpus runs

## Half-built
- **Skills Passport** (PDF evidence appendix on certificate) — in IDEAS_NEXT, not built
- **Ask the Syllabus** (⌘K grounded Q&A) — chunk/embed pipeline exists in migrations, no UI yet
- **Ethics & Law dilemmas** — table exists, content not seeded
- **Peer role-play rooms, Case Library, Supervision log** — migrations only
- Voice: browser STT/TTS works; Deepgram/ElevenLabs upgrades are stubbed interfaces
- Corpus: 98 PMC case reports fetched + 220-pattern style bank; ICD-11/mhGAP/NMHS/MHA fetchers are scaffolds (written, not run)

## Corpus
- **PMC / Europe PMC:** 98 open-access psychiatric case reports fetched + normalised (provenance-logged)
- **Project Gutenberg:** 10 public-domain novels → **220-pattern style bank** (the "train on fiction to learn how to talk" feature, isolated from clinical retrieval with tests)
- **Drafted cases:** 40 in `scripts/corpus/drafted-cases.json`, `approved: false`
- **Licence:** Europe PMC OA (CC-BY etc), Gutenberg public domain

## Bugs
Fixed: 0 logged this session (no bugs surfaced in the green slices)  ·  Open: 0 → BUGS.md

## Cost
Free-tier router wired; no keys set so **$0 spend** tonight. All AI features ran on fixtures.
Projected at 30 students with keys: low tens of $/month (free tiers for content-gen + corpus, paid key only for student-data calls).

## Ideas I had
- Deepgram streaming STT with turn-taking + medical vocab for voice
- ElevenLabs pre-generated patient lines cached in R2
- Weak-spots heatmap drilling into the lesson for each weak topic
- Skills Passport PDF export on the certificate (already a dependency: pdf-lib)

## Numbers
- Commits: **7** (A→G slices)
- Files changed: **91**, lines: **19,096**
- Tests: **38 → 92** (+54 across data-policy, safety, style-bank, SCT, rounds, streaks, MSE, formulation, privacy)
- Build time: ~9s, lint clean, typecheck clean
- Branch: `feat/practice-layer` — buildable, all green
