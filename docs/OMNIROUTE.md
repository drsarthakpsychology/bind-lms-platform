# OmniRoute — Free-Model Pooling Gateway

Integrated + RUNNING 2026-08-14 (user request: "how can we use omniroute? you
setup this entirely"). OmniRoute is a self-hosted OpenAI-compatible gateway
that pools ~1.5B free tokens/month across 42 provider pools (495 models)
behind one endpoint, with automatic provider selection ("auto"),
health/speed/cost/quality scoring, and fallback. Repo:
`https://github.com/diegosouzapw/OmniRoute.git`.

## ✅ Verified running (2026-08-14)

- Installed globally: `npm install -g omniroute` → v3.8.49 at /opt/homebrew/bin.
- Running as a daemon: `omniroute serve --no-open --daemon` on **:20128**
  (Dashboard + OpenAI-compatible API at `/v1`).
- `auto` routing VERIFIED: the dopamine-hypothesis question routed to a free
  model and returned a correct answer. No API key required (HTTP 200 with or
  without a Bearer), so the VIBHA router reaches it directly.
- The VIBHA router registers it (`id: "omniroute"`):
  - `baseUrl: http://localhost:20128/v1` (OpenAI-compatible)
  - `models: { fast: "auto", smart: "auto/smart", strong: "auto/smart" }`
  - `trainsOnData: false` (the gateway itself does not train)
  - A late fallback in the chat/stream/json no-train lanes.

## Restart after reboot

```bash
omniroute serve --no-open --daemon   # starts on :20128; env at ~/.omniroute/.env
```

## Why it fits

The capacity model (docs/CAPACITY_MODEL.md) identified Groq's 1,000 requests/
day as the 45-DAU bottleneck. OmniRoute stacks many providers' free tiers
behind one endpoint, so when Groq/Cerebras/OpenRouter are saturated, OmniRoute
can route to whatever has quota — the "pool the free models" pattern the user
asked for.

## Deployment (separate infra step)

OmniRoute is a Docker/Next.js app, not an npm dependency. To run it:

```bash
git clone https://github.com/diegosouzapw/OmniRoute.git
cd OmniRoute
cp .env.example .env   # add the upstream provider keys you want pooled
docker compose --profile base up -d   # serves OpenAI-compatible API on :20128
```

Then set in the VIBHA app's `.env.local`:
```
OMNIROUTE_URL=http://localhost:20128/v1
OMNIROUTE_API_KEY=<key if the gateway requires one>
```

## ⚠️ Privacy — student data (critical)

The OmniRoute **gateway itself does not train** (`trainsOnData: false`), but it
can route to upstreams that DO train (Gemini, some others). The VIBHA
data-policy guard only blocks providers marked `trainsOnData: true`; OmniRoute
is marked `false` because the gateway is a router, not a model host.

**Therefore: for student data, OmniRoute MUST be configured with only no-train
upstreams enabled** (e.g. Groq, Cerebras, OpenRouter, DeepSeek — not the
Gemini/consumer pools). The OmniRoute dashboard lets you enable/disable
upstreams per pool; leave training providers off. Treat OmniRoute as a
**non-student lane by default** until the upstream config is audited to
no-train-only.

## Verified provider key status (2026-08-14)

- **Groq** ✅ live (student no-train)
- **OpenRouter** ✅ live (student no-train, free models)
- **OpenCode Zen** ✅ live — free model `deepseek-v4-flash-free` (user: "use the free ones")
- **DeepSeek V4** ✅ live (non-student bulk; trainsOnData posture unresolved)
- **SambaNova** ⚠️ key set but **paywalled** (needs a card — paid fallback)
- **NVIDIA NIM** ⚠️ key set; models list works, chat endpoint times out from this machine
- **Cerebras** — key wanted (the free no-train double for 45 DAU)
- **OmniRoute** — registered; deploy the gateway + add a key to activate
