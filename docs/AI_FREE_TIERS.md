# AI Free Tiers — §24 Free API Access

Dense, copy-pasteable reference for **every** external AI provider/model the app
can call: how it is (or is not) free, how to get a key, what to set up, and what
happens when it rate-limits or dies.

Sources of truth (read before changing anything):
- `docs/MODEL_RESEARCH.md` — the 2026-08-14 research round (licences, data policies, limits)
- `src/lib/ai/router.ts` — `PROVIDERS` registry, `PROVIDER_PRIORITY`, `trainsOnData`
- `src/lib/voice/synthesize.ts` — the free-first TTS chain
- `src/lib/ai/guards.ts` — `assertProviderAllowed`, the data-policy guard
- `.env.example` — exact env var names

**Field rule of thumb:** free tiers are rate-limited, not rate-free, and the
limits move monthly. Where the research doc has a number, it is repeated here;
where it is silent, the field says **verify current limits before relying on
this**. Never send a named student's transcript to a provider that trains on
data — the guard enforces this in code and a mandatory unit test covers it.

---

## Chain order (text diagrams)

### TTS chain — the patient's voice

`src/lib/voice/synthesize.ts`, single entry point `synthesize()`. Cache-first,
then free tiers in order, paid last, browser stub always-on. Never throws.

```
AI_ENABLED=true?
  │ no ───────────────────────────────────────────────▶ [fixture]
  │ yes                                                  browser speechSynthesis
  │                                                      (en-IN + affect rate/pitch)
  ├─ 0. R2 cache hit (sha256 of text+voice+emotion+speed) ──▶ return cached mp3
  ├─ 1. MiMo-V2.5-TTS     (MIMO_TTS_URL)             MIT · free beta / self-host
  ├─ 2. Kokoro-82M        (KOKORO_API_URL)           Apache-2.0 · CPU self-host
  ├─ 3. Qwen3-TTS         (QWEN_TTS_URL)             hosted (SiliconFlow) / self-host vLLM
  ├─ 4. Chatterbox-Turbo  (CHATTERBOX_TTS_URL)       MIT · self-host
  ├─ 5. CosyVoice 2       (NVIDIA_API_KEY)           Apache-2.0 · NVIDIA NIM free
  ├─ 6. ElevenLabs        (ELEVENLABS_API_KEY)       PAID · last resort, not recommended
  └─ all fail ───────────────────────────────────────────▶ [fixture] browser speechSynthesis
```

Each tier is tried only if the previous returned `ok: false`. Every successful
synthesis is cached in R2 so the expensive provider call happens once per unique
line.

### LLM router — Director/Actor + JSON + vision/audio/embed

`src/lib/ai/router.ts`, `PROVIDER_PRIORITY`. Left-to-right = failover order on
429 / 5xx / timeout. All endpoints are OpenAI-compatible except none currently
use the native Gemini protocol.

```
capability   failover order
chat:        groq → gemini → cerebras → openrouter → anthropic
stream:      groq → gemini → cerebras → openrouter → anthropic
json:        groq → cerebras → openrouter → anthropic → gemini
vision:      gemini → anthropic → openrouter
audio:       gemini → groq
embed:       openrouter → gemini

Student-data lanes (sim_patient_turn / debrief_scoring / journal_support):
  the guard removes trainsOnData=true providers before routing →
  chat:   groq → cerebras → openrouter → anthropic
  json:   groq → cerebras → openrouter → anthropic
```

### Data-policy split (privacy first)

`assertProviderAllowed(workload, provider)` throws **before any request leaves
the server**. Workloads with student data may only route to
`trainsOnData === false` providers.

| Provider | `trainsOnData` | May serve student data? |
|---|---|---|
| Groq | `false` | Yes — DPA forbids training, ZDR available |
| Cerebras | `false` | Yes — inference-only |
| OpenRouter | `false` | Yes per registry — but real policy is per-upstream-model; verify before student data |
| Anthropic | `false` | Yes — no training on API data (paid) |
| Gemini (free tier) | `true` | **No** — free tier trains on prompts (human review); non-student content only |
| ElevenLabs (free tier) | `true` | **No** — free tier trains on data; keep voice cloning of real people out |
| NVIDIA NIM | claimed no-training | Official terms claim no training; self-host for certainty |
| MiMo / Kokoro / Qwen3 / Chatterbox (self-hosted) | N/A (your infra) | Yes — nothing leaves your server |

Workload classification (`guards.ts`):
- **Non-student:** `content_generation`, `corpus_processing`, `embeddings`.
- **Student data:** `sim_patient_turn`, `debrief_scoring`, `journal_support`.

`AI_STUDENT_TIER=no_train_only` (default, strict) refuses to serve student data
unless a no-train provider is available. `AI_STUDENT_TIER=any` is a **DEV-ONLY**
override — never set it in production.

---

## Groq — llama-3.3-70b (LLM, Director/Actor)

### Provider
Groq (GroqCloud) — LPU inference, OpenAI-compatible endpoint
`https://api.groq.com/openai/v1`.

### Model
`llama-3.3-70b-versatile` (registry `fast` and `smart`).

### Purpose
**Primary conversational LLM.** Sim Director (structured JSON) + Actor
(dialogue) + debrief scoring + journal support. This lane carries student data.

### Cost
Free API tier (hosted, not self-hosted). Not paid.

### Free limits
Research doc: ~30 RPM / 1K–14K RPD / ~12K TPM per model. Registry pins
`rpm 30, rpd 1000, tpm 12000`. Verify current limits before relying on this.

### API access
`console.groq.com` → API Keys → create key.

### Account requirements
Free account, no credit card. **No training** — the DPA forbids training on your
data; Zero Data Retention (ZDR) available on request. Commercial use allowed.

### Environment variable
`GROQ_API_KEY`

### Setup
Set `GROQ_API_KEY` and `AI_ENABLED=true`. Nothing else — Groq already leads the
`chat`, `stream`, and `json` priority orders.

### Fallback
On 429/5xx/timeout: `chat`/`stream` → Gemini (non-student lanes only) then
Cerebras; `json` → Cerebras. For student-data lanes Gemini is skipped by the
guard, so the next no-train tier is Cerebras.

---

## Groq — whisper-large-v3-turbo (STT, the student's voice)

### Provider
Groq (GroqCloud), same OpenAI-compatible endpoint.

### Model
`whisper-large-v3-turbo` (also `whisper-large-v3`). Same OpenAI checkpoints.

### Purpose
Hosted STT fallback for transcribing the student's speech. Wired as the STT
fallback in the repo.

### Cost
Free API tier.

### Free limits
No number in the research doc — Groq audio is metered separately from chat
tokens. Verify current limits before relying on this.

### API access
Same `console.groq.com` key as the LLM.

### Account requirements
Free account, no credit card. **No training** (DPA + ZDR). Commercial use OK.

### Environment variable
`GROQ_API_KEY` (shared with the LLM lane).

### Setup
Set `GROQ_API_KEY`. It is already the STT fallback.

### Fallback
**No streaming** — if true streaming is a hard requirement, the next tier is a
self-hosted Whisper (`whisper.cpp`/`faster-whisper`, MIT) or Deepgram Nova-3
(paid). Otherwise the stub is browser Web Speech with an editable interim
transcript.

---

## Cerebras

### Provider
Cerebras Inference — OpenAI-compatible endpoint `https://api.cerebras.ai/v1`.

### Model
`llama-3.3-70b` (registry `fast` and `smart`).

### Purpose
Bulk corpus processing + JSON fallback. No-train, so it can also serve
student-data lanes.

### Cost
Free API tier.

### Free limits
Research doc: ~1M tok/day. Registry pins `rpm 30, rpd 1440, tpm 1000000`.
Verify current limits before relying on this.

### API access
`cloud.cerebras.ai` → API Keys → create key.

### Account requirements
Free account, no credit card. Inference-only — **no training**. Commercial OK.

### Environment variable
`CEREBRAS_API_KEY`

### Setup
Set `CEREBRAS_API_KEY`. It is already third in `chat`/`stream` and second in
`json`.

### Fallback
`chat`/`stream` → OpenRouter; `json` → OpenRouter then Anthropic.

---

## Gemini (Google)

### Provider
Google Gemini API, OpenAI-compatible base URL
`https://generativelanguage.googleapis.com/v1beta/openai/`.

### Model
`gemini-2.0-flash` (`fast`), `gemini-2.5-flash` (`smart`), and
`text-embedding-004` (embed).

### Purpose
Best free-tier quality + 1M context; vision; content generation and corpus
processing. **Excluded from every student-data lane by the guard.**

### Cost
Free API tier (Google AI Studio). Not paid.

### Free limits
Research doc: ~10–15 RPM / ~1.5K RPD. Registry pins `rpm 10, rpd 1500,
tpm 1000000`. Verify current limits before relying on this.

### API access
`aistudio.google.com` → API Keys → create key.

### Account requirements
Google account, no credit card. **Critical: the free tier trains on prompts
(human review).** It must only ever receive non-student content. `assertProviderAllowed`
throws if a student workload is ever routed here.

### Environment variable
`GEMINI_API_KEY`

### Setup
Set `GEMINI_API_KEY`. It is second in `chat`/`stream`, last in `json` (a
non-student fallback lane), and first for `vision`/`audio`/`embed`.

### Fallback
`chat`/`stream` → Cerebras; `vision` → Anthropic.

---

## OpenRouter

### Provider
OpenRouter — aggregation layer, OpenAI-compatible endpoint
`https://openrouter.ai/api/v1`.

### Model
`meta-llama/llama-3.3-70b-instruct:free` (registry `fast` and `smart`).

### Purpose
Overflow lane — extra capacity when Groq/Cerebras are rate-limited. Also the
registry's `embed` provider.

### Cost
Free models at $0. Free tier = 50 RPD. A **one-time $10 credit** lifts the cap
to 1,000 RPD and unlocks paid models.

### Free limits
50 RPD at $0; ~1,000 RPD after the $10 one-time credit (research doc). Registry
pins `rpm 20, rpd 50, tpm 20000`. Verify current limits before relying on this.

### API access
`openrouter.ai` → create key.

### Account requirements
Free account, no credit card for the free tier. `trainsOnData: false` in the
registry, but the real data policy is per-upstream-model — verify before sending
student data through it. The $10 credit is the research doc's "highest-leverage
spend."

### Environment variable
`OPENROUTER_API_KEY`

### Setup
Set `OPENROUTER_API_KEY`. Optional: add $10 credit to raise the daily cap.

### Fallback
`chat`/`stream` → Anthropic; `json` → Anthropic then Gemini (non-student only).

---

## Anthropic (paid — not free)

### Provider
Anthropic — OpenAI-compatible endpoint `https://api.anthropic.com/v1`.

### Model
`claude-sonnet-4-5` (registry `fast` and `smart`).

### Purpose
Optional paid tier — the "gold" no-train lane, student-facing when a budget
exists.

### Cost
**Paid. There is no free tier.** Never treated as free in the chain.

### Free limits
None. Registry pins `rpm 50, rpd 1000, tpm 40000` as plan assumptions — verify
against your plan before relying on this.

### API access
`console.anthropic.com` → API Keys → create key.

### Account requirements
Paid account, credit card, commercial terms. `trainsOnData: false` — no training
on API data by default.

### Environment variable
`ANTHROPIC_API_KEY`

### Setup
Set `ANTHROPIC_API_KEY` when budget allows. It is a one-line env change to
activate the paid no-train lane; it is last in `chat`/`stream`/`json` priority.

### Fallback
It is the terminal router tier — nothing after it except fixture mode
(`AI_ENABLED=false` deterministic fixtures).

---

## NVIDIA NIM — CosyVoice 2 (TTS) and Whisper (STT)

### Provider
NVIDIA NIM on build.nvidia.com, endpoint `https://integrate.api.nvidia.com/v1`.

### Model
- TTS: `cosyvoice2-0.5b` (CosyVoice 2, Apache-2.0).
- STT: Whisper large-v3 hosted on NIM.

### Purpose
TTS tier for the patient's voice (inline emotion tags); hosted Whisper STT.

### Cost
Free API tier (no card). Not paid at the free tier.

### Free limits
No numbers in the research doc. Verify current limits before relying on this.

### API access
`build.nvidia.com` → create API key.

### Account requirements
NVIDIA account, no credit card. Official terms claim **no training**; for
absolute certainty over student audio, self-host the model instead.

### Environment variable
`NVIDIA_API_KEY`

### Setup
Set `NVIDIA_API_KEY`. CosyVoice 2 is the 5th TTS tier (used automatically when
MiMo/Kokoro/Qwen3/Chatterbox are unconfigured or fail). Whisper STT is a hosted
option for the transcript lane.

### Fallback
TTS chain → ElevenLabs (paid) then fixture. STT → self-hosted Whisper
(Indic fine-tune) then Groq Whisper then browser Web Speech stub.

---

## MiMo-V2.5-TTS

### Provider
Xiaomi MiMo — open weights (MIT) or the hosted free-beta API at `MIMO_TTS_URL`.

### Model
`mimo-v2.5-tts` (MiMo-V2.5-TTS, Xiaomi, Apr 2026).

### Purpose
**Recommended primary patient voice.** Top of the Artificial Analysis TTS arena
(~1233 Elo, tied), expressive + emotion-controllable, Indian-English capable,
voice-design and voice-clone variants for case voices.

### Cost
Free. MIT licence, weights open; the hosted API is a free beta. Self-hostable at
zero licence cost.

### Free limits
No numbers in the research doc for the API free beta. Verify current limits
before relying on this. Self-hosted = bounded by your hardware.

### API access
Point `MIMO_TTS_URL` at the Xiaomi API free beta, or self-host the MIT weights
behind an OpenAI-compatible `/v1/audio/speech` endpoint.

### Account requirements
Free-beta terms not pinned in the research doc — verify. Self-host requires no
account. MIT = commercial use allowed.

### Environment variable
`MIMO_TTS_URL`, `MIMO_TTS_API_KEY`

### Setup
Set `MIMO_TTS_URL` (and `MIMO_TTS_API_KEY` if the endpoint requires one). It is
the first tier tried in the TTS chain.

### Fallback
Kokoro-82M (CPU, self-host).

---

## Kokoro-82M (self-host)

### Provider
Self-hosted — your own infrastructure behind an OpenAI-compatible
`/v1/audio/speech` endpoint.

### Model
`Kokoro-82M`.

### Purpose
Zero-cost CPU TTS fallback — the honest "works today on the Mac" tier
(Apache-2.0, runs on CPU with no GPU).

### Cost
Free — self-hosted weights, Apache-2.0, runs on CPU.

### Free limits
N/A (self-hosted) — bounded only by your hardware. Verify current limits before
relying on this only if you use a third-party Kokoro host.

### API access
None needed — you run the endpoint.

### Account requirements
None. Apache-2.0 = commercial use allowed.

### Environment variable
`KOKORO_API_URL`

### Setup
Host Kokoro-82M behind an OpenAI-compatible `/v1/audio/speech` endpoint and set
`KOKORO_API_URL`. Second tier in the TTS chain.

### Fallback
Qwen3-TTS.

---

## Qwen3-TTS (SiliconFlow / self-host)

### Provider
Hosted via SiliconFlow, or self-hosted via vLLM at `QWEN_TTS_URL`.

### Model
`Qwen3-TTS`.

### Purpose
TTS tier: 10 languages, voice cloning, natural-language voice direction.
Distinct from the paid arena-leader `Qwen-Audio-3.0-TTS-Plus` (hosted, paid) —
do not confuse the two.

### Cost
Hosted SiliconFlow free tier (verify) or self-hosted open weights (free). The
arena-leader Plus variant is **paid** — never call it free.

### Free limits
Verify current limits before relying on this (SiliconFlow free tier; self-host =
hardware-bound).

### API access
SiliconFlow → create key; or self-host via vLLM and set `QWEN_TTS_URL`.

### Account requirements
SiliconFlow account — verify whether a card is required. Self-host = none.
Verify the open-weight licence for commercial use before relying on this.

### Environment variable
`QWEN_TTS_URL`, `QWEN_TTS_API_KEY` (read by `synthesize.ts`; add to `.env.local`
— not yet listed in `.env.example`).

### Setup
Point `QWEN_TTS_URL` at SiliconFlow or a self-hosted vLLM `/v1/audio/speech`
endpoint; set `QWEN_TTS_API_KEY` if required. Third TTS tier.

### Fallback
Chatterbox-Turbo.

---

## Chatterbox-Turbo

### Provider
Self-hosted OpenAI-compatible endpoint at `CHATTERBOX_TTS_URL`.

### Model
`Chatterbox-Turbo`.

### Purpose
Quality TTS tier with native `[laugh]` `[cough]` `[chuckle]` `[sob]` tags — the
affect states map directly onto these tags for emotional patient lines.

### Cost
Free — MIT licence, self-hosted weights.

### Free limits
N/A (self-hosted) — bounded by your hardware. Verify current limits before
relying on this only if you use a hosted Chatterbox.

### API access
None needed — you run the endpoint.

### Account requirements
None. MIT = commercial use allowed.

### Environment variable
`CHATTERBOX_TTS_URL`, `CHATTERBOX_TTS_API_KEY` (read by `synthesize.ts`; add to
`.env.local` — not yet listed in `.env.example`).

### Setup
Host Chatterbox-Turbo behind an OpenAI-compatible `/v1/audio/speech` endpoint
and set `CHATTERBOX_TTS_URL`. Fourth TTS tier.

### Fallback
CosyVoice 2 (NVIDIA NIM).

---

## ElevenLabs (paid — LAST RESORT, not recommended)

### Provider
ElevenLabs — `https://api.elevenlabs.io`.

### Model
`eleven_multilingual_v2` (v3 exists on newer plans).

### Purpose
Premium patient voice, en-IN. **Last resort** — kept only if premium voices are
specifically wanted.

### Cost
**Paid.** A small free tier exists but **trains on data** — never call it free,
and keep voice cloning of real people out of it.

### Free limits
Small free tier (verify current limits before relying on this); free tier trains
on data.

### API access
`elevenlabs.io` → API keys → create key.

### Account requirements
Paid account, credit card. Free tier trains on data — not student-data-compliant.

### Environment variable
`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`

### Setup
Set both vars. Only reached after every free TTS tier (MiMo → Kokoro → Qwen3 →
Chatterbox → CosyVoice) has failed.

### Fallback
After ElevenLabs the chain ends in fixture mode: browser speechSynthesis with
affect-mapped rate/pitch.

---

## Browser Web Speech (zero-key fallback)

### Provider
Browser Web Speech API (`speechSynthesis` / Web Speech STT) — on-device, no
network.

### Model
OS/browser voices (`en-IN` when available). Not a model you choose.

### Purpose
Always-on fixture mode: the patient line is rendered client-side with
affect-mapped rate/pitch; also the STT stub with an editable interim transcript.

### Cost
Free — zero key, zero egress, built into the browser.

### Free limits
No API limits; voice availability varies by OS/browser.

### API access
None.

### Account requirements
None.

### Environment variable
None. Activated by `AI_ENABLED=false` or when every provider tier fails.

### Setup
Nothing. It is the terminal fallback — the app is fully demoable with zero keys.

### Fallback
N/A — it is the terminal tier.

---

## Embeddings (for completeness)

The app's only embedding entry point is `src/lib/ai/embed.ts`, always
`halfvec(384)`. The primary is **all-MiniLM-L6-v2** (self-host, Apache-2.0, 384
dims, CPU ~2–3ms/text, no egress). The router's `embed` lane (OpenRouter →
Gemini) exists but is not the recommended path for course content. Rejected
embedding providers: Cohere embed-v4 trial (trains on trial data) and Jina
hosted free (non-commercial) — both in the research rejection log.

---

## Recommended minimum setup to go live with $0/month

Set `AI_ENABLED=true`, add a free **Groq** key (`GROQ_API_KEY` — no-train LLM for
student lanes) and a free **NVIDIA** key (`NVIDIA_API_KEY` — CosyVoice 2 TTS +
Whisper STT), self-host **Kokoro-82M** behind `KOKORO_API_URL` for a zero-cost
CPU TTS fallback, and rely on browser Web Speech as the always-on stub — the app
is demoable with zero keys even before that.

Optional (free) capacity: `CEREBRAS_API_KEY` and `OPENROUTER_API_KEY`
(50 RPD, or 1,000 RPD after the $10 one-time credit). Add `ANTHROPIC_API_KEY`
only when a paid no-train lane is budgeted.

---

## Verify before go-live checklist

- [ ] Re-check every free-tier limit (Groq, Cerebras, Gemini, OpenRouter, NIM,
      SiliconFlow) — the field moves monthly; the research doc is dated 2026-08-14.
- [ ] Confirm which providers still set `trainsOnData: false` — the guard
      (`src/lib/ai/guards.ts`) and its unit test must stay green.
- [ ] Confirm the Qwen3-TTS and Chatterbox env vars are added to `.env.local`
      (they are read by `synthesize.ts` but not yet in `.env.example`).
- [ ] Confirm the MiMo API free-beta terms before relying on it in production;
      the MIT weights make self-host the compliant fallback.
- [ ] Self-host Whisper (Indic fine-tune) for student audio if hosted NIM/Groq
      no-training guarantees are not acceptable.
