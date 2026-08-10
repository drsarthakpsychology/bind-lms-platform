# NEEDS KAVYA — morning shopping list

Specific, actionable. One line each. NOT a stop sign.

## API keys (free tiers, no card)
- Paste `NVIDIA_API_KEY` (build.nvidia.com, free, no card) → the strongest free tier for the Director/Actor + TTS. Add to `.env.local` as `NVIDIA_API_KEY`.
- Paste `GEMINI_API_KEY` (aistudio.google.com, free) → content generation + embeddings
- Paste `GROQ_API_KEY` (console.groq.com, free) → Director speed + Whisper STT
- OPTIONAL: `ANTHROPIC_API_KEY` (paid) → no-train provider for live student sessions + journal
- OPTIONAL: `ELEVENLABS` / `COSYVOICE` (free tier) → the v5 voice upgrade (currently on browser TTS)

## Content review
- Record 20 anonymised composite cases from your practice → `/admin/corpus/dictate` (the highest-value corpus source, still #1)
- Flip feature flags at `/admin/flags` to reveal the 9 built-but-off tools for the cohort when ready (live: Consulting Room, Decoder, MSE, Judgment, Rounds, Journal)
- Review the 60 authored cases in the admin queue (`approved: false`)

## Calibration
- Score transcripts at `/admin/calibration` — your blind scores train the AI scorer and give the "calibrated against a practising psychiatrist" line for the St. Xavier's MOU

## Infra
- Migrations applied to the main DB (modules, feature_flags, sim_branches, cohort_ended_at, supervision transfer). For future schema work use a Supabase dev branch.
- Enable the Firecrawl/Playwright MCP entry in `.mcp.json` for future corpus runs

## Live product to verify
- `/today` → the new front door (recommended card, quick/deep chips)
- `/practice` → the redesigned browse view (verb labels, state chips)
- `/practice/decode` → the flagship Presenting Complaint Decoder
- `/practice/consulting-room` → Director/Actor engine + retry from a debrief moment
- `/admin/calibration`, `/admin/flags`, `/admin/modules`, `/admin/pulse` → the four admin tools
