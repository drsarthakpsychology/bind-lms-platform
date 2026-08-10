# NEEDS KAVYA — morning shopping list

Specific, actionable. One line each. NOT a stop sign.

- Paste `GEMINI_API_KEY` (aistudio.google.com, free, no card) → enables content generation
- Paste `GROQ_API_KEY` (console.groq.com, free) → enables voice-mode STT/TTS speed
- Paste `CEREBRAS_API_KEY` (cloud.cerebras.ai, free) → bulk corpus processing
- Paste `OPENROUTER_API_KEY` (openrouter.ai, free) → overflow lane
- OPTIONAL: `ANTHROPIC_API_KEY` (paid) → routes student-session + journal calls to no-train provider. Until then those features show the honest "needs a no-train provider" message.
- Record 20 anonymised composite cases from your practice → `/admin/corpus/dictate` (highest-value corpus source)
- Approve the drafted cases in the admin review queue (they land `approved: false`)
- Approve the SCT items / cards / MSE stimuli in the review queues
- Enable the commented Firecrawl/Playwright MCP entry in `.mcp.json` for future corpus runs
- Apply `src/migrations_pending/practice_layer_*.sql` to a dev branch (the MCP `create_branch` needs a cost-confirmation ID I couldn't mint; migrations are written and reviewable but not yet applied — run `npm run apply-migrations` against a dev branch)
