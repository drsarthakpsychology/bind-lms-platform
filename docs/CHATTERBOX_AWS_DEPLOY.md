# Chatterbox-Turbo on AWS — cheapest practical deploy + cost model

_2026-08-15 · Target: make the human Chatterbox voice live for 50 students
within ~$100 of AWS credits. FREE_ONLY: nothing provisioned beyond a single
spot GPU; nothing runs outside the credit balance._

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
| Instance | g4dn.xlarge spot, 1× T4 16 GB |
| On-demand rate (ap-south-1) | ~$0.68–0.74/hr |
| **Spot rate (budget for)** | **$0.30/hr** (APAC spot runs a bit hotter than us-east-1; us-east-1 can be $0.10–0.20) |
| Deploy + E2E test + benchmark (≈10 hrs) | ~$3 |
| **Monthly (server on during practice hours only)** | ~$26 (@ ~86 hr/mo) |
| **3-month estimate** | ~$78 + ~$5 one-time = **~$83 of the $100 credits** |
| Credit headroom | ~$17 buffer |

**The schedule is the lever.** 24/7 spot (@ $0.30) would be ~$219/mo — that
blows the budget. The instance must be **stopped when students aren't
practising** (`aws ec2 stop-instances`). 50 students × ~2.5 sessions/wk ×
~35 min ≈ 73 student-hrs/wk of conversation; with a handful running in
parallel that's ~20 wall-clock hrs/wk the GPU needs to be up.

**Max practical concurrency on one T4:** ~10–15 simultaneous student streams
with good latency. Each synthesis is ~2–3.5 s GPU (single-step decoder), turns
are spaced ~10 s apart, and the semaphore caps concurrent generations at 4 —
comfortably above our 1–5 benchmark target.

## Deployment (one command, once credentials are live)

```bash
# requires: aws CLI + a working profile (AWS_PROFILE=<name> if not default)
CHATTERBOX_AUTH_TOKEN=<a-long-secret> REGION=ap-south-1 \
  ./scripts/chatterbox-server/deploy.sh
```

The script:
1. Picks the latest NVIDIA Deep-Learning AMI (Ubuntu 22.04, drivers + CUDA).
2. Creates a security group (TTS port 4123 open + token-gated; SSH from your IP).
3. Launches **one g4dn.xlarge SPOT** instance with user-data that installs
   Python 3.11 + CUDA torch + `chatterbox-ng` + pre-downloads the model +
   runs `scripts/chatterbox-server/main.py` (OpenAI-compatible `/v1/audio/speech`,
   SSE PCM16 — the exact format `livekit-agent/chatterbox-tts.ts` consumes).
4. Prints the public IP + the exact `CHATTERBOX_URL` / `CHATTERBOX_API_KEY`.

## Cutover (the LiveKit agent already supports this — no code changes)

```bash
# in .env.local
CHATTERBOX_URL=http://<public-ip>:4123
CHATTERBOX_API_KEY=<the-auth-token>

# restart the worker — it logs "[patient-agent] TTS primary: chatterbox …"
npx tsx livekit-agent/agent.ts dev
```

Health check: `curl http://<public-ip>:4123/healthz` → `{"ok":true,...}`

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
