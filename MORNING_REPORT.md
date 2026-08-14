# Morning Report — 2026-08-14

## Ship it
T90–T190 driven per your two directives ("complete the queue" + "do best, not
cheapest-to-reverse"). **89 of 100 tasks complete**, everything committed on
`feat/mobile-design-system` (nothing pushed to main). 493 tests green, build OK.

Best things to click:
1. **The patient disclosure fix** — live sessions used to open any sensitive
   fact (incl. self-harm) at trust≥3 no matter what was asked. Now the authored
   gates actually gate: a self-harm fact only opens when the student clearly
   asks; empathy facts after validation/reflections. Start a Consulting Room
   session and watch the farmer hold his risk until asked clearly.
2. **The admin home** (/admin) — "what needs you today" with live counts,
   instead of decorative stats. /admin flags is now "What's live", /admin/rights
   is "Book licences", the pulse is "Cohort progress" in plain words.
3. **Voice loop** — voice mode now has "Type instead" (was one-way), shows
   Listening/Thinking/Speaking, and speaks the patient's reply back
   automatically. Try it in the Consulting Room.

## The audit (T91)
`docs/PRODUCT_SIMPLIFICATION_AUDIT.md` — 165 findings from a 64-agent fan-out,
46 confirmed priority-1, all fixed. The five recurring problems: jargon,
internal architecture leaked to users, dead features, duplication,
over-explanation. Codified in `docs/PLAIN_LANGUAGE.md` so it doesn't regress.

## Needs you (from NEEDS_KAVYA)
The 11 deferred tasks are all human- or build-gated:
- **T151** — video QA on a real phone (the Playwright matrix is green; physical-device rotation/orientation needs a human thumb).
- **T171/T172** — the AI-patient eval dataset + model-regression harness: I can build the harness but it needs a live no-train key to run; the deterministic fixture engine is already the oracle to compare against.
- **T103/T104** — the one-reusable-content-editor build (big; worth its own session).
- **T105** — card reorder needs a sort column (schema decision).
- **T116/T118/T122/T123** — wiring the rich story layer (voice_profile, contradictions, affect_rules) into the live patient prompts + behavioural difficulty + live-LLM eval.

## Numbers
~35 commits tonight · 799 total on the branch · 493 tests (+7 for the disclosure
gates) · lint 0 · tsc clean · build OK · Supabase: one additive migration
(quality-signal columns) applied live, advisors clean of new findings.

## The one line
The product is simpler to read (plain language everywhere), safer to teach
(disclosure gates that hold), and faster to act on (one shared resume engine).
The remaining work is the deep-content builds, not the polish.
