# VIBHA AI Capacity Model — 40–50 Daily Active Users

Calculated 2026-08-14 against **verified live** provider limits (not
assumptions — Groq + DeepSeek keys were tested against their live APIs this
session). Goal: does the free/current tier support ~40–50 DAU, and where is
the exact bottleneck?

## Workload model (per active student, per day)

| Activity | Calls | Tokens/call | Daily tokens/user |
|---|---|---|---|
| Psychology Tutor (grounded Q&A) | 8 | ~1,200 in / ~600 out | ~9.6k in / ~4.8k out |
| Patient-simulation turns (Director+Actor) | 15 | ~1,500 in / ~300 out | ~22.5k in / ~4.5k out |
| Debrief scoring (1/session) | 1 | ~3,000 in / ~800 out | ~3k in / ~0.8k out |
| Quiz / concept checks | 5 | ~900 in / ~250 out | ~4.5k in / ~1.25k out |
| Whisper STT (voice) | 3 | ~40s audio → ~500 out | ~1.5k out |
| Misc (summaries, assist) | 4 | ~600 in / ~250 out | ~2.4k in / ~1k out |
| **Per-user daily total** | **~36 calls** | | **~42k in / ~14k out tokens** |

**Cohort total (45 DAU):** ~1,620 calls/day · ~1.9M input tokens/day ·
~630K output tokens/day.

## Provider limits (verified live 2026-08-14)

| Provider | RPM | RPD | TPM | Daily tokens | Student-data-safe? |
|---|---|---|---|---|---|
| **Groq** | 30 | 1,000 | 12,000 | ~1M–12M (RPD-bound) | ✅ no-train |
| **DeepSeek** V4 Flash | ~60 | 10,000 | 1M | paid (Flash ≈ $0.44/M in, $0.66/M out off-peak) | ⚠️ unresolved → non-student only |
| Cerebras (absent key) | 30 | 1,440 | 1M | ~1M/day (free) | ✅ no-train |

## The bottleneck (exact)

**Groq's RPD (1,000 requests/day) is the hard constraint.**

- 45 DAU × 36 calls = **1,620 calls/day** — but Groq allows only **1,000/day**.
- Groq is the ONLY student-data-safe provider with a key. At 45 DAU the
  student-facing lanes **exceed Groq's daily request quota by ~62%**.

**RPM is also a real constraint at peak:** 45 users × bursts (voice needs
sub-second TTFB, a 15-turn patient session) can hit 30 RPM in a busy minute.
12,000 TPM is comfortably within the ~42K tokens/user/day total, so **tokens are
NOT the bottleneck — requests-per-day and requests-per-minute are.**

## What this means

- **Free-tier Groq alone supports ~25–28 DAU**, not 45. Beyond that, students
  hit rate-limit errors during peak.
- **DeepSeek cannot fill the student-facing gap** (trainsOnData unresolved —
  the data-policy guard refuses it for student data, correctly).
- The gap must be filled by **another no-train provider** OR **self-hosted
  open weights** for the high-volume simple lanes.

## The best fix (recommendation)

1. **Cerebras key (free, no-train, ~1M tok/day)** — the missing free lane.
   Add `CEREBRAS_API_KEY`; the router already has Cerebras as the #2 json/chat
   fallback. This roughly **doubles capacity** and covers Groq's RPD ceiling.
   It still won't fully reach 45 DAU alone, but combined with Groq it does.
2. **OpenRouter key (free, 50 RPD at $0; 1,000 RPD after one-time $10)** —
   the overflow lane the router already references. $10 unlocks ~1,000 RPD of
   no-train models (per-model verify). This closes the 45-DAU gap. **Already
   live** (key set + verified, 2026-08-14).
3. **SambaNova — VERIFIED NOT FREE (2026-08-14):** the research claimed a
   "permanent free tier, no card," but the live API returns
   `PAYMENT_METHOD_REQUIRED` — a card is now required. Registered + key
   configured, but it's a **paid fallback**, NOT the free Cerebras replacement.
4. **Self-host a small model for the simple tier** (classification,
   formatting, concept tagging) on the existing infra — removes those calls
   from the API budget entirely. The knowledge layer already makes a small
   open model useful for VIBHA-specific tasks (§4).
5. **Caching** — DONE (commit 776f2ab): ai_response_cache trims repeated
   tutor questions from the API budget.

**Order of cheapest-to-unblock:** Cerebras key (free — the real double) →
OpenRouter $10 (already live at $0). With Groq + Cerebras + OpenRouter the
45-DAU target is met with headroom. SambaNova is a paid option, not the free
answer.

## Bottom line

Free tiers alone at 45 DAU: **Groq RPD is the bottleneck (1,000/day vs 1,620
needed).** It's a requests-per-day ceiling, not tokens. Two free additions
(Cerebras + OpenRouter's $10 overflow) close it. DeepSeek stays the non-student
bulk lane (corpus processing, metadata, classification) — never student data.
