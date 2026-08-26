# AI Patient + Voice — architecture audit & implementation plan

_2026-08-15 · the master implementation directive. What the code actually is,
what was broken, what is fixed, and what remains._

---

## The audit (directive point 35)

1. **Framework** — Next.js 16 (app router), React 19, Tailwind v4 (CSS-first,
   no tailwind.config), TypeScript strict.
2. **Frontend** — server components + client islands; a mobile-first design
   system (`src/components/mobile/*`, `ui/*`); immersive session exception for
   the patient sim.
3. **Backend** — Next.js API routes under `src/app/api/*`; server actions for
   forms; Supabase (Postgres) via `createClient` (RLS) + `createAdminClient`
   (service-role) for admin/engine work.
4. **Database** — Supabase Postgres (free tier). Sessions (`sim_sessions`),
   turns (`sim_turns` with a `state` column), scores (`sim_scores`),
   usage (`ai_usage_log`), cards, cases (`sim_cases.case_data` jsonb), etc.
5. **AI provider** — a multi-provider router (`src/lib/ai/router.ts`, 9
   providers, capability→priority, health failover, data-policy guard). Keys
   live in `.env.local`: GROQ, NVIDIA, OPENROUTER, DEEPSEEK (all set).
6. **Current AI integration** — `aiChat()` (server-only) with provider
   failover + JSON-schema repair. The patient engine is a **Director → Actor**
   split (`src/lib/sim/`): Director classifies + decides (JSON), Actor writes
   dialogue. Cases are authored `DepthCase` objects (facts, personality,
   register, disclosure gates, affect, contradictions, story).
7. **Patient architecture** — **this was the bug.** The engine is genuinely
   AI-driven (Director/Actor via `aiChat`), BUT it was gated behind
   `isEnabled()` = `AI_ENABLED === "true"`, and that env var was unset. So the
   deterministic **fixture engine** (scripted `fixture_lines`) ran even with
   keys configured. **Fixed:** `isEnabled()` is now key-aware, so a configured
   no-train key runs the real model; `AI_ENABLED=false` still forces fixtures.
   Verified live with `npm run sim:live-proof` — real GROQ responses in Ravi's
   Hinglish register, case-grounded, self-harm probe deflected, state carried
   across turns.
8. **Voice architecture** — browser Web Speech (STT) + `speechSynthesis`
   (TTS). The old UI was a mic button + speaker button + textarea + permission
   wall. **Rebuilt:** an immersive `VoiceConversation` screen (one orb action,
   conversational loop, tap-to-interrupt, live transcript) sharing the SAME
   session/turns as text.
9. **Text architecture** — the same turn engine. Text and voice already post
   to the same route → one conversation. Confirmed.
10. **Authentication** — Supabase Auth; `requireSession()` guard on every API
    route; admin routes gated by role. Nothing exposed client-side.
11. **Video** — custom player (HLS + watermark + resume + fullscreen on the
    wrapper). Landscape lock added; **needs a real-browser verification** that
    fullscreen fills the screen with no layout underneath (directive §18/§21).
12. **Admin architecture** — grouped nav (Review/Content/System), action-first
    home, plain-language labels. Already de-jargoned in the T91 pass.
13. **Mobile architecture** — one component tree, mobile-first responsive, the
    sim session as the one named immersive exception.
14. **Routing** — app router; `/practice/consulting-room/session/[id]` is the
    immersive sim. Bottom nav hides on immersive paths.
15. **Dependencies** — Next 16, Radix, motion, HLS, no heavy realtime stack.
16. **Reusable components** — `ui/*`, `mobile/*`, `sim/*`, design-system.
17. **Broken components found** — (a) AI gated off (fixed), (b) Director JSON
    reliability (fixed: lenient schema + fence stripping), (c) voice UI
    (rebuilt), (d) video fullscreen (verify).
18. **Why the patient was scripted** — `isEnabled()` strict `AI_ENABLED==="true"`
    + the var unset → fixture engine. Fixed + proven.
19. **Why voice was poor** — push-to-talk mic/speaker/textarea UI + the
    patient reply was only read if the student pressed the speaker. Rebuilt.
20. **Why mobile overlaps** — several fixed-position surfaces (bottom nav,
    composer, finish bar, video controls) + ad-hoc safe-area padding. Needs a
    central layout-primitive strategy (directive §19).

## What is fixed (committed, gate-green)

- The AI patient runs a real model (isEnabled key-aware; AI_ENABLED=true set).
- Director JSON reliability (lenient schema, fence stripping).
- The immersive voice screen (orb, loop, interruption, shared session).
- The "Scripted/AI" machinery pill removed from the student header.
- `npm run sim:live-proof` — the "test before claiming" proof.

## The plan (what remains)

1. **Structured patient truth** — ensure the `DepthCase` fields (facts,
   hidden facts, contradictions, personality, disclosure, learning objectives)
   are the explicit "world" the model reads, and that the state/memory (what
   was asked, disclosed, reacted to) is explicit. Largely present; wire the
   last gaps (voice_profile, learning objectives) into the prompts.
2. **Realtime voice** — evaluate LiveKit Agents vs. the current HTTP path. The
   current path (browser STT/TTS + the AI engine) delivers a conversational
   loop with tap-interrupt today; full WebRTC realtime (VAD, echo-cancelled
   barge-in, streaming) needs a LiveKit server + realtime keys. Decision: keep
   the working conversational loop now; add LiveKit behind the same session
   when realtime infra is provisioned.
3. **Learning profile + adaptive** — per-student signals (already computed for
   practice states) → a profile → quietly adapt case selection/difficulty.
   Never changes clinical truth.
4. **Video fullscreen + safe-area** — verify on real browsers; central layout
   primitives for the fixed surfaces.
5. **QA** — run the real conversation paths (the 17-step proof), the e2e
   matrix, and the mobile regression.

## Realtime voice — the evaluation + decision (directive §8/§24/§25)

Options weighed against the actual stack (serverless Next.js on Vercel, no
realtime-model key yet, free-tier budget):

| Option | Latency | Interrupt | Infra needed | Verdict |
|---|---|---|---|---|
| **Current (browser STT/TTS + HTTP AI engine, conversational loop)** | 1–2 s | tap + best-effort voice barge-in | none | **Chosen now.** Works today, $0, real AI, shared session. |
| LiveKit Agents (WebRTC, VAD, echo-cancelled barge-in) | 200–500 ms | native | a persistent agent server (Fly/Render/VPS) + a realtime model or a streaming STT→LLM→TTS pipeline + WebRTC | The upgrade path; not serverless-friendly. |
| OpenAI Realtime / Gemini Live (speech-to-speech) | <300 ms | native | a realtime-model key + a persistent socket server | Strong, but adds a paid realtime provider the app doesn't have a key for. |

**Decision:** keep the working conversational loop now (real AI, one session
for text+voice, tap + best-effort voice interruption) as the smallest correct
architecture under the current constraints. The session/engine boundary is
already clean, so LiveKit (or a realtime model) can be dropped in behind the
same turn engine without touching the student surface, once a persistent
server or a realtime key is provisioned. Revisit when either exists — the
realtime path is a one-route + one-component change, not a rewrite.

## The 17-step proof (directive §26)

Done so far (script-level): student opens Ravi → unexpected question →
real model generates → in Ravi's voice/register → uses case facts → not a
canned line → follow-up works → Ravi remembers (state carried). Remaining
steps (voice interruption, voice↔text switching in-browser, debrief from the
actual transcript, admin "view as student" using the same engine) are in QA.
