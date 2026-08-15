# Chatterbox-Turbo on AWS — scale-to-zero deploy + cost model

_2026-08-15 · Target: make the human Chatterbox voice live for 50 students
within ~$100 of AWS credits. FREE_ONLY: nothing provisioned beyond one tiny
gateway + one spot GPU; the GPU is OFF whenever no voice session is running._

## Architecture (scale-to-zero, per the actual usage)

```
Student → LiveKit → AI patient engine → Groq LLM → Chatterbox TTS → back

   ┌─────────────── ALWAYS-ON t3.nano gateway (~$4/mo, IAM role, no secrets)
   │   owns CHATTERBOX_URL · wakes the GPU on demand · stops it after 8 min idle
   ▼
   ┌─────────────── ONE g4dn.xlarge SPOT GPU (T4) — OFF when idle ($0 while stopped)
   │   boots ~2-3 min; first turn of a burst is served by the worker's
   │   natural Cartesia fallback so the student hears a human voice immediately
   └─────────────── Chatterbox-Turbo + OpenAI-compatible server
```

**NO voice users → NO GPU.** The gateway (a t3.nano) is the only always-on
component. It starts the GPU on the first synthesis request and stops it after
**8 minutes** without one (plus a 15-min self-stop safety net on the GPU).

## GPU choice: ONE g4dn.xlarge (1× NVIDIA T4, 16 GB VRAM)

- Chatterbox-Turbo (350 M) needs ~4–6 GB VRAM at Q4 → the T4 has room for the
  model **and** concurrent generations.
- g4dn.xlarge is the smallest NVIDIA GPU tier on AWS (no smaller T4 exists).
- Alternatives are more expensive: g6.xlarge (L4) ~$0.72/hr on-demand, p2/p3
  older + pricier. **g4dn.xlarge is the right call.**
- Spot (not on-demand) is the cost lever: typical ~$0.15–0.37/hr vs
  ~$0.53–0.74/hr on-demand.

## Cost model (ap-south-1 Mumbai — nearest to LiveKit Cloud "India South")

| Item | Value |
|---|---|
| Gateway | t3.nano on-demand, always-on, ~**$0.0052/hr ≈ $4/mo** |
| GPU | g4dn.xlarge SPOT, 1× T4 16 GB — **$0 while stopped** |
| GPU spot rate (budget for) | **$0.30/hr** when running |
| GPU EBS (60 GB gp3, while stopped) | ~$0.36/mo (still billed — the volume persists) |
| Deploy + E2E test + benchmark (≈10 GPU-hrs) | ~$3 |
| **Monthly (GPU on only during practice bursts)** | **~$30/mo** (@ ~85 GPU-hrs + $4 gateway) |
| **3-month estimate** | ~**$90 of the $100 credits** (gateway $12 + GPU ~$78) |
| Credit headroom | ~$10 |

**Why it fits:** 50 students × ~2.5 sessions/wk × ~35 min ≈ 73 student-hrs/wk
of conversation; the GPU is only billed while it is actually up (it idles to
zero after 8 min), so the practical spend is a few dozen GPU-hrs/month, not
24/7. If usage is lighter, the cost shrinks almost to the $4/mo gateway.

**Max practical concurrency on one T4:** ~10–15 simultaneous student streams
with good latency. Each synthesis is ~2–3.5 s GPU (single-step decoder), turns
are spaced ~10 s apart, and the semaphore caps concurrent generations at 4 —
comfortably above our 1–5 benchmark target.

## Deployment

### 1. Authentication (secure, browser-first — no secrets pasted into chat)

The AWS CLI needs a working profile. The preferred flow:

```bash
aws configure sso
# pick the region (ap-south-1), then your browser opens → log in →
# approve → back in the CLI, the profile is set. No keys are ever typed.
export AWS_PROFILE=<the-sso-profile>
aws sts get-caller-identity   # should print your account
```

(Alternative: `aws configure --profile plms` if you prefer long-term keys,
stored by the AWS CLI in `~/.aws/credentials` — never in the repo.)

### 2. One command to deploy

```bash
CHATTERBOX_AUTH_TOKEN=<a-long-secret> REGION=ap-south-1 \
  ./scripts/chatterbox-server/deploy.sh
```

The script creates the IAM roles + security groups, launches the **t3.nano
gateway** (always-on) and the **g4dn.xlarge SPOT GPU** (starts stopped), and
prints the gateway's public IP + the exact `CHATTERBOX_URL` / `CHATTERBOX_API_KEY`.

## Cutover (the LiveKit agent already supports this — no code changes)

```bash
# in .env.local
CHATTERBOX_URL=http://<gateway-ip>:4123
CHATTERBOX_API_KEY=<the-auth-token>

# restart the worker — it logs "[patient-agent] TTS primary: chatterbox …"
npx tsx livekit-agent/agent.ts dev
```

Health checks:
- `curl http://<gateway-ip>:4123/healthz` → gateway up, shows the GPU state.
- `curl http://<gateway-ip>:4123/status` → `gpu: stopped` until the first
  synthesis wakes it, then `running` → `warm`.

## When the credits run out

- **FREE_ONLY posture:** the deploy is one spot GPU + one t3.nano. When the
  credit balance hits ~$0, AWS stops/terminates only if a budget alarm fires —
  a `$10` + `$30` AWS Budgets alarm (recommended once credentials are live)
  alerts before anything unexpected bills.
- **The graceful degradation is already built in:** if the GPU/gateway is
  unreachable, the worker's `tts.FallbackAdapter` serves the natural Cartesia
  voice — students keep a human-sounding voice at $0; only Chatterbox's extra
  realism goes quiet. No outage, no dead air.

## Real end-to-end + benchmark (run once the server is reachable)

Student → LiveKit (WebRTC) → AI patient engine (Groq) → Chatterbox (T4) → audio.

Verify: natural voice, patient emotion (sighs/chuckles from affect), streaming
(first audio before synthesis ends), barge-in, text↔voice one session, memory
across turns, and multi-session. Benchmark 1 / 2 / 3 / 5 simultaneous users
(per-utterance latency + queue time).

## Keep FREE_ONLY / credit-only

- One spot instance only. No on-demand, no reserved, no extra instances.
- The deploy script prints the stop/terminate commands; stopping when idle is
  what keeps 3 months inside the $100.
- A billing alarm (`aws budgets`) is recommended once credentials are live.

## Sources

- [g4dn.xlarge pricing (us-east-1, on-demand $0.526/hr)](https://calculator.holori.com/aws/ec2/g4dn.xlarge?region=us-east-1)
- [AWS GPU pricing guide (spot ranges)](https://www.gpucloudlist.com/en/blog/aws-ec2-gpu-instances-guide)
- [T4 pricing comparison (DevZero)](https://www.devzero.dev/instances/gpu/t4)
- [g4dn.xlarge spot (Singapore, ~$0.32/hr)](https://calculator.holori.com/aws/ec2/g4dn.xlarge?os=Linux&upfront=no-upfront&region=ap-southeast-1)
- [g4dn.4xlarge spot Mumbai (~$0.31/hr)](https://sparecores.com/server/aws/g4dn.4xlarge)
