# Realtime voice — plan, cost, and what's genuinely required

_2026-08-15 · Phase 2/3/11 of the closure. Researched against current (2026)
LiveKit + realtime-provider documentation. Sources linked inline._

## What already works (do not rebuild)

- The AI patient is real (`npm run sim:live-proof`, verified live, provider
  groq in `ai_usage_log`).
- Text and voice share ONE session/turns (the same `/api/practice/sim/turn`).
- The immersive `VoiceConversation` screen: one orb, the loop
  (listen → speak → patient speaks → hand the mic back), tap + best-effort
  voice barge-in, live transcript.
- Browser STT/TTS deliver this today at **$0, no new infra**.

## What realtime voice adds (the gap)

| Capability | Browser path today | Realtime (LiveKit) path |
|---|---|---|
| Latency | 1–2 s (STT→HTTP→TTS) | 200–500 ms (streaming) |
| Barge-in | tap + best-effort voice | native adaptive interruption |
| Echo cancellation / VAD | none | built-in |
| Streaming | no | yes |

## The decision (smallest correct architecture)

**LiveKit Agents** is the fit: open-source (Apache-2.0), Node.js SDK
(`@livekit/agents`), native WebRTC on mobile browsers, adaptive interruption
handling, and **LiveKit Inference** (STT/LLM/TTS through LiveKit, no separate
third-party keys). It needs:

1. **A LiveKit project** — cloud **free "Build" tier: $0/month, no credit
   card**, hard caps (stop service, no overage): **1,000 agent-session
   minutes/mo**, 5,000 WebRTC min, $2.50 inference credits, **5 concurrent
   agent sessions**.
2. **A worker host** — the agent is a persistent process (NOT serverless).
   Smallest option: **Fly.io free tier** (3 × shared-cpu-1x 256MB VMs, ~$0) or
   a local dev worker. One worker comfortably handles the 5 concurrent cap.

## Cost model — 50 students, realistic concurrency (1–10)

A "session" ≈ the time the agent is in the room (call it **12 min** for a
patient consult).

| Concurrent | Sessions/hr | Agent minutes/mo (20 days × ~1 session) | Free tier? |
|---|---|---|---|
| 1 | 5 | 50 students × 12 min = **600 min/mo** | ✅ under 1,000 |
| 3 | 15 | same 600 (per-student, not concurrent) | ✅ |
| 5 | 25 | same | ✅ (at the 5-session cap) |
| 10 | 50 | same | ⚠ over cap → Ship $50/mo OR self-host |

**Conclusion:** the free Build tier covers the whole cohort (600 of 1,000
minutes; 5 concurrent is more than enough for a class of 50 practising at
staggered times). Inference beyond the $2.50 credit is the real variable —
use the existing **GROQ key for the LLM** (already $0, no-train) so the
worker's LLM costs nothing; STT/TTS via LiveKit Inference or the free tiers.

**Chatterbox note:** the brief suggested Chatterbox-Turbo/Nano — not in use
(the TTS chain is browser speechSynthesis + the synthesized voice chain).
Realtime TTS would use LiveKit Inference's provider; a CPU/GPU benchmark is
only relevant if self-hosting TTS, which this plan doesn't require at this
scale.

## Genuinely required from Kavya (when you want realtime live)

Only to ENABLE the realtime path (the current browser voice works today):

1. Create a LiveKit Cloud account (livekit.io, free Build plan, no card).
2. Create a project → Settings → keys → copy the API key + secret.
3. Add to `.env.local` (never commit):
   ```
   LIVEKIT_URL=wss://<project>.livekit.cloud
   LIVEKIT_API_KEY=
   LIVEKIT_API_SECRET=
   ```
4. Provision one small worker host (Fly.io free tier or any 256MB VPS) for
   the agent worker.

Then I build: the `/api/livekit/token` route, the agent worker (Node) that
calls the existing patient engine (same session/state), and the LiveKit
client in `VoiceConversation` — a focused change, not a rewrite.

## FREE_ONLY posture

Until a realtime provider is provisioned, the app runs **free-only**: browser
STT/TTS + the GROQ no-train LLM + the honest fallback markers (AI LIVE /
AI ERROR / FALLBACK are logged internally; students only ever see the patient
or a graceful recovery). No paid provider is auto-enabled. `AI_ENABLED=false`
forces the deterministic fixture patient with a clear internal marker.

## Sources

- [LiveKit Pricing (free Build tier, caps)](https://www.usagepricing.com/blueprint/livekit) · [LiveKit free tier 2026](https://agentdeals.dev/vendor/livekit)
- [LiveKit Agents framework](https://llm-explorer.com/agent/livekit-agents) · [Node.js agents (@livekit/agents)](https://github.com/secureonelabs/livekit-agents-js)
- [Adaptive interruption handling (barge-in)](https://docs.livekit.io/agents/logic/turns/adaptive-interruption-handling/) · [Turn detection blog](https://livekit.com/blog/turn-detection-and-interruption-handling)
- [LiveKit + Next.js reference implementation](https://github.com/bilalzulfiqar-pk/ai-voice-agent)
