# NEEDS KAVYA — morning shopping list

Specific, actionable. One line each. NOT a stop sign.

## API keys (free tiers, no card)
- Paste `GEMINI_API_KEY` (aistudio.google.com, free) → enables content generation + corpus
- Paste `GROQ_API_KEY` (console.groq.com, free) → enables voice-mode speed
- Paste `CEREBRAS_API_KEY` (cloud.cerebras.ai, free) → bulk corpus processing
- Paste `OPENROUTER_API_KEY` (openrouter.ai, free) → overflow lane
- OPTIONAL: `ANTHROPIC_API_KEY` (paid) → routes student-session + journal calls to a no-train provider. Until then those features show the honest "needs a no-train provider" message.

## Content review (all seeded `approved: true` for the base set)
- Record 20 anonymised composite cases from your practice → `/admin/corpus/dictate` (highest-value corpus source)
- Review the 40 AI-drafted cases in the admin queue (they land `approved: false`)

## Infra
- Enable the commented Firecrawl/Playwright MCP entry in `.mcp.json` for future corpus runs
- Migrations ARE applied to the main DB (2026-08-10). For future schema work, use a Supabase dev branch.

## Live product to verify
- `/practice` → Consulting Room, Judgment, Rounds, MSE, OSCE, Formulation, Two-Minute Clinic
- `/reflect` (owner-only journal), `/wall` (cohort wall)
- `/admin/corpus/dictate` (faculty case dictation)
