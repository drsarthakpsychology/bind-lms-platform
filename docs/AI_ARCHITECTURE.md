# AI Architecture — Lumen Practice Layer

Last updated: 2026-08-10.

## We are not fine-tuning the model

Fine-tuning needs thousands of labelled examples, costs real money, isn't
offered on free tiers, and freezes improvements into a binary you can't edit
when Dr. Sarthak says "an Indian patient wouldn't phrase it that way."

What actually produces the effect, in descending order of impact:

1. **Structured case models** (`sim_cases` JSONB) — an explicit clinical spec
   per patient, not a vibe prompt. The biggest lever by a distance.
2. **Retrieval over the curated corpus** — the patient's phrasing, comorbidity
   patterns and help-seeking behaviour grounded in real case literature.
3. **Few-shot exemplars** — 3–5 gold-standard exchanges per archetype,
   approved by Dr. Sarthak, injected into the patient prompt.
4. **Scoring as a separate model call** with schema-validated JSON output.
5. **The feedback loop** — every faculty correction of an AI score is stored
   in `scoring_corrections` and injected as few-shot examples into future
   scoring calls. This is what makes it improve over months, and it costs
   nothing. Built from day one, even before there are corrections to inject.

The knowledge base IS the training.

## The router

`src/lib/ai/router.ts` — a registry of providers with automatic failover.
Free tiers are rate-limited, not rate-free; stacking independent limits is how
we get real capacity.

- On 429 / 5xx / timeout → fail over immediately to the next provider, log it,
  never surface an error to the student.
- Backoff per provider, but never block the user — go sideways, not to sleep.
- Swapping in a paid key is a one-line env change.

Providers: Gemini (best free quality, 1M context), Groq (voice-mode speed),
Cerebras (bulk corpus), OpenRouter (overflow lane), Anthropic (optional paid,
student-facing when present).

## The data-policy split

`assertProviderAllowed(workload, provider)` throws before any request leaves
the server. Workloads that contain student data (sim turns, debrief scoring,
journal support) may only route to providers with `trainsOnData === false`.
Covered by a mandatory unit test. See `docs/DATA_POLICY.md`.

## Cost model

The token-heavy work (drafting cases, corpus processing, embeddings) is free
tier. The sensitive work (student sessions, journal) needs one modest paid
key. Projected spend for a 30-student cohort: low tens of dollars a month.
The $10 OpenRouter credit is the highest-leverage spend — it lifts the
free-model cap from 50/day to 1,000/day and unlocks a paid fallback lane.

## Embeddings

`src/lib/ai/embed.ts` is the only embedding entry point. Always halfvec(384),
never vector(1536): 3000 docs × 10 chunks at 1536 dims is ~184 MB — the naive
schema kills the free tier. At 384 halfvec dims it's ~23 MB. Matryoshka:
request the full dimension, truncate to 384, L2-renormalise. Tested.
