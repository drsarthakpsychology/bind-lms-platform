# NEEDS KAVYA — do this in one sitting (free ones first)

Every item: paste → something switches on → verify with one command. Free first.

## 🟢 Free — no card, no cost

### 1. `NVIDIA_API_KEY` — build.nvidia.com (free, no card, ≈40 RPM)
- **URL:** https://build.nvidia.com → sign in → any model page → "Get API Key" → copy
- **Switches on the moment you paste it (add to `.env.local`):**
  - **CosyVoice 2 server TTS** — `/api/practice/voice/synthesis` (emotion tags live)
  - **Whisper STT** `/api/practice/voice/stt` — full server transcription
  - **Director/Actor patient engine** — the real model instead of fixtures
  - **Debrief scoring** — real rubric scoring instead of fixtures
- **Verify:** `curl -s https://integrate.api.nvidia.com/v1/models -H "Authorization: Bearer $NVIDIA_API_KEY" | head -c 200`

### 2. `GROQ_API_KEY` — console.groq.com (free, no card)
- **URL:** https://console.groq.com/keys
- **Switches on:** Whisper STT (fast path, first in the chain) + fast Director lane
- **Verify:** `curl -s https://api.groq.com/openai/v1/models -H "Authorization: Bearer $GROQ_API_KEY" | head -c 200`

### 3. `GEMINI_API_KEY` — aistudio.google.com (free)
- **URL:** https://aistudio.google.com/apikey
- **Switches on:** content generation, embed lane, second Director/Actor provider
- **Verify:** `curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY" | head -c 200`

### 4. `CEREBRAS_API_KEY` — cloud.cerebras.ai (⚠️ now requires a card)
- **URL:** https://cloud.cerebras.ai/platform (API keys page)
- **Switches on:** bulk drafting lane (JSON capability priority)
- **NOTE (2026-08-14):** Cerebras now requires adding a payment method to issue
  a key ("we can't without adding payments") — so it is **not** the free
  no-train double it was researched as. See the "PAYWALLED" note at the bottom.
- **Verify:** `curl -s https://api.cerebras.ai/v1/models -H "Authorization: Bearer $CEREBRAS_API_KEY" | head -c 200`

### 5. `CLOUDFLARE_ACCOUNT_ID` + `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` + `R2_BUCKET_NAME` — dash.cloudflare.com (free 10 GB)
- **URL:** https://dash.cloudflare.com → R2 → create bucket `plms-media` (or reuse) → Manage API Tokens → create token with Object Read/Write on the bucket
- **Switches on:** voice synthesis cache (sha256-keyed objects in `voice/`), plus the pre-existing video/audio storage migration paths
- **Verify:** `npm run pregen-voice -- --dry-run` (dry-run needs no creds) then `npm run pregen-voice` once `NVIDIA_API_KEY` + R2 are both set

### 6. `CRON_SECRET` + `APP_URL` — generate locally, no cost
- **Generate:** `openssl rand -base64 32`
- **Switches on:** the GitHub Actions crons (keepalive, infra-check, alumni-transition) can authenticate to `/api/internal/cron`. Add as GitHub repo secrets + `.env.local`.
- **Verify:** after deploying, `curl -s -H "Authorization: Bearer $CRON_SECRET" https://<your-app>/api/internal/cron?task=keepalive`

## 🟡 Optional — nice but not blocking

### 7. `KOKORO_API_URL` — self-host Kokoro-82M (Apache 2.0, CPU)
- **URL:** https://github.com/hexgrad/kokoro (local install; expose an OpenAI-compatible `/v1/audio/speech`)
- **Switches on:** second TTS tier when NVIDIA is down
- **Verify:** `curl -s -X POST $KOKORO_API_URL/v1/audio/speech -H "Content-Type: application/json" -d '{"model":"kokoro","input":"hello","voice":"af_heart"}' -o /tmp/t.mp3 && ls -la /tmp/t.mp3`

### 8. `ANTHROPIC_API_KEY` — paid, no-train provider for live student sessions
- **URL:** https://console.anthropic.com
- **Switches on:** the strongest `trainsOnData === false` provider — live patient turns + debrief scoring + journal "help me think" route to it. Until a no-train key exists, **student-data workloads refuse non-compliant free tiers by design** (the data-policy guard).
- **Verify:** run a Consulting Room session and watch `/admin/infra` provider health

### 9. `ICD_CLIENT_ID` + `ICD_CLIENT_SECRET` — WHO ICD-11 API programmatic tier (free for research)
- **URL:** https://icd.who.int/icdapi (register for API access)
- **Switches on:** reliable ICD-11 chapter walking (the public browser tier 401s intermittently)
- **Verify:** `npm run corpus:icd11`

## 📝 Manual downloads — DONE (2026-08-14)

**All manual downloads are complete.** POCSO 2012 was the last one and is now
in the corpus:

- **POCSO 2012** — downloaded from the WBCPCR official mirror
  (`https://wbcpcr.org/pdf/acts/POCSO-Act-2012.pdf`, the Gazette of India copy,
  2.8 MB, verified `%PDF`). It's a **scanned** PDF (no text layer), so the
  normaliser OCRs it (`tesseract`, via `normalisePdf(..., { ocr: true })`).
  Result: **47,862 chars** of clean statute text (preamble, Chapter II
  definitions, offences, penalties, Special Court, child-in-need-of-care).
  Source URL recorded as `https://wbcpcr.org/pocso-act.php`. Only the Hindi
  Gazette header garbles — that's page furniture, stripped as usual.

Already auto-fetched (no action needed): WHO mhGAP-IG 2.0 (Wayback mirror),
NMHS main report (Wayback 2018 snapshot), RCI 1992 Act (official Samagra
Shiksha Gujarat mirror), MHA 2017 (live India Code, intermittent). All five
statutes + the reference reports are normalised into
`scripts/corpus/normalised/*.json` via `npm run corpus:normalise`.

## 🎙️ Content review — the highest-value asset

- **Dictate your 20 composite cases** → `/admin/corpus/dictate` (ten minutes talking beats an hour of typing; the interviewer state-machine fills the case spec)
- **Score calibration transcripts** → `/admin/calibration` (20 AI-vs-AI self-play sessions are seeded now — blind-score them; provisional dimensions hide from students until validated)
- **Review drafted flashcards** → `cards` table drafts (7 from the seeded MSE lesson transcript; approve the good ones)
- **Flip feature flags when ready** → `/admin/flags` (6 live — Consulting Room, Decoder, MSE, Judgment, Rounds, Journal; 12 built-but-off tools reveal on one click)
- **Validate the /enquire "You are…" default** → the form preselects "Student"; once real enquiries land, check the actual mix (early-career/practising may outnumber students). If skewed, change the default (PFD Finding 2; needs behavioral data, not a code guess)

## 🕵️ STRIX PENTEST — DONE (ran with your DeepSeek key)
- **Codebase scan** (`./src`, quick): **0 exploitable vulnerabilities**; the
  flagged service-role routes all enforce ownership in code. Report:
  `docs/SECURITY_AUDIT.md`. Re-run:
  `DOCKER_HOST=unix://$HOME/.docker/run/docker.sock ~/.strix/bin/strix -t ./src -m standard -n`.
- **Live-site scan** (`https://vibhapsychology.com`, standard): MEDIUM 1, INFO 1
  (report `strix_runs/vibhapsychology-com_4e69`). Triaged + fixed in code:
  - vuln-0001 stored-XSS in /enquire: **mitigated** — honeypot + IP rate-limit
    were already enforced; admin render escapes via React (no
    dangerouslySetInnerHTML). Added write-time `stripMarkup` sanitization
    (defense-in-depth) + 3 regression tests. NOT exploitable as submitted.
  - vuln-0002 login CAPTCHA/rate: **mostly false positive** — rate limit exists
    (10/email); Turnstile is fully wired but dormant. TWO config actions below.
  - vuln hygiene: sitemap served the internal `bind-lms-platform.vercel.app`
    hostname — code fallback fixed to `https://vibhapsychology.com`.
- **Config actions (2, one line each):**
  1. Turnstile keys: set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`
     in Vercel to activate the login CAPTCHA (widget + server verification are
     already coded). Get: dash.cloudflare.com → Turnstile.
  2. `NEXT_PUBLIC_APP_URL` in Vercel should be `https://vibhapsychology.com`
     (it is currently the internal vercel.app hostname → sitemap indexes the
     wrong domain).
- Cost: $0.93 (live) + $0.03 (codebase). Deeper pass: use a frontier model
  (openai/gpt-5.4) instead of deepseek-chat.

## 🔒 SECURITY AUDIT 2026-08-14 — ONE action to apply
- **Enable RLS on `_migrations_applied`** (the only public table with RLS off —
  anon key can read the migration ledger via REST). Fix is staged, ready:
  `npm run apply-pending` on `src/migrations_pending/rls_migrations_applied.sql`
  (a single `ALTER ... ENABLE ROW LEVEL SECURITY`; additive, no policies). Full
  report: `docs/SECURITY_AUDIT.md`. Everything else audited clean (secrets,
  middleware, RLS, headers, deps).
- **Auth-consistency sweep DONE**: every API route that used bare
  `auth.getUser()` now routes through `requireSession()` (profiles row + expiry
  + concurrent-session token). 42 routes hardened — including
  `sim/debrief|rewind|turn|session` and the dictate admin gate (de2d810).

## Reminder (already done this session)
- MHA 2017 full text: fetched 409 KB into `scripts/corpus/raw/statutes/` (gitignored).
- 65 idioms seeded (18 compulsory approved); 20 calibration transcripts; wall reactions/replies live; journal sharing live.
- Content volume rounds: idioms bank 95, SCT 154, quiz bank 51, out-of-depth 50, ethics 40, landmark 22, clinic 101.
- **Review the 7 drafted flashcards + 20 calibration transcripts + the new content batches** in the admin queues — approval is the human step the build cannot do.
## 🎁 NEW — the paid books (you said they're paid for)

**57 titles are already flipped to `licensed` in the registry** and the
ingester ran — 3 were acquired via the archive.org ladder (POCSO +
governance docs). The rest are retail-license titles with **no free copy**.
To make them land:

1. **Drop the purchased files (PDF/ePub) into `/mnt/acquire/`** — the watcher
   ingests them into the right layer automatically (ladder step 6, the
   catch-all). This is the highest-value single action: it turns your
   purchases into the patient-voice corpus.
2. OR **paste a purchased-account credential** (Kindle/Google Play/VitalSource
   download access) in `.env` — the ladder's step 2 reads it.

Until files exist on disk the registry honestly shows `acquisition_failed`
with the reason — that's the pipeline working, not a bug.

## 🗄️ Schema debt needing a product call (not a bug, not blocking)

- **`practice_chains` + `sim_cases.follow_up`** (multi-session "recurring
  patient" arcs) — table + column went live tonight but were authored as
  speculative scaffolding in an earlier round: zero cases have `follow_up`
  content, zero application code reads either. Building UI around an empty,
  unspecced concept isn't in the master brief, so it's parked rather than
  invented from nothing. If you want this feature, it needs: what a
  "follow-up session" actually contains, and one call to just delete the
  table if it turns out you don't.
- **`osce_stations` / `mse_stimuli` / `formulation_cases` / `public.idioms`**
  — four DB tables, full RLS, zero readers. OSCE/MSE/Formulation/the
  Decoder all ship their real content as static TS files instead (see
  `docs/PRACTICE_LAYER.md` § "Content: code vs DB"). Two options, your
  call: (1) wire a real admin-authoring flow so faculty can add OSCE
  stations etc. without a code change, or (2) drop the unused tables.
  Currently harmless either way — flagging so it doesn't sit unexplained.

## 🔊 Voice — FREE-FIRST (use Kokoro + MiMo, not ElevenLabs)

The synthesis chain is reordered free-first (`src/lib/voice/synthesize.ts`):
MiMo (MIT) → Kokoro (Apache, CPU) → Qwen3 → Chatterbox → CosyVoice → ElevenLabs
LAST. The zero-cost voice that works TODAY:
- **Kokoro-82M** (Apache-2.0, CPU, runs on the Mac) — set `KOKORO_API_URL` to a
  local OpenAI-compatible audio/speech server.
- **MiMo-V2.5-TTS** (MIT, arena-top) — set `MIMO_TTS_URL` (Xiaomi API free beta
  or self-host) for the best free quality.

ElevenLabs is NOT recommended (paid). It's only a last-resort tier if you
specifically want premium voices — `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID`.

## ✉️ Cohort-pulse one-tap nudge — one key away

The code path is BUILT: `/api/admin/nudge` sends via Resend's REST API (fetch,
no SDK) when configured, and the /admin/pulse button calls it. It only needs
two env vars to actually send:
- `RESEND_API_KEY` (Resend account)
- `RESEND_FROM_EMAIL` (e.g. "VIBHA School of Psychology <noreply@…>")

Until those exist it honestly returns `email-not-configured` and sends
nothing — it never claims a message went out.

## 🧠 Research-round decisions (2026-08-14)
- **OpenRouter**: free tier is 50 RPD — unusable for daily turns. One-time $10
  top-up permanently unlocks 1,000 RPD. Decide if that's worth it, or drop
  OpenRouter from the overflow lane. It's already a last-resort fallback.
- **Quota re-verify at go-live**: Gemini/Groq/Cerebras free quotas moved
  repeatedly through 2026 and are account-dependent — re-check each dashboard
  before wiring the keys to production.
- **json_schema**: intentionally NOT used — Groq's strict mode is in flux and
  Cerebras requires `additionalProperties:false` on every object (a known 422
  failure). The json_object + Zod-repair + failover path is provider-agnostic
  and reliable. Revisit if Groq ships stable strict outputs.

## 📥 THE ONE BLOCKING ITEM (drop-folder ingest)

The licensed ingester's ladder step 6 is `/mnt/acquire/` — the drop folder.
It does not exist on this machine (`ls /mnt/acquire` → No such file). To
activate the 57 paid titles:

1. `mkdir -p /mnt/acquire` (anywhere the ingester runs — on this Mac or the
   Linux box)
2. Drop the purchased PDFs/ePubs there (filename ≈ title slug)
3. `npm run corpus:licensed` — the watcher ingests them into the right
   layer, hashes, and marks them acquired.

Until a file exists in the folder, the registry honestly shows
`acquisition_failed` — that is the pipeline working, not a bug.

## 🧠 2026-08-14 free-tier research — read before adding keys

- **Gemini free tier is NOT safe for student data.** Google may train on
  free-tier prompts and human-review them (users outside EEA/UK/CH). The
  GEMINI_API_KEY item above lists "second Director/Actor provider" — restrict
  it to non-student lanes (content gen / embeddings) or use the billed API for
  any student turn. Free 2.5 Pro was removed Apr 2026.
- **Groq + Cerebras are the two verified no-training free providers** — Groq is
  the recommended Primary (DPA forbids training, ZDR available, 30 RPM / 1K RPD
  per model), Cerebras the Fallback (~1M tok/day). Both no card, both
  OpenAI-compatible JSON.
- **OpenRouter**: no-training but only 50 RPD at $0 — needs a one-time $10
  top-up to reach 1,000 RPD. Decide if that's acceptable.
- **NVIDIA free tier** may use request data for model improvement — fine for
  TTS/STT, not for student transcripts.

---

## 🎨 Design decision needed — link colour (from the 2026-08-14 design audit)

Peach `#f4a261` is used as a **text/link colour** in ~211 places on cream — that
is **~1.9:1 contrast**, below WCAG AA (4.5:1). The reusable `link` button/badge
variants are already fixed to ink in commit `058ef26`, but inline link labels
("Resume", "Practise", "All practice tools", …) still render peach-on-cream.

**Decision needed (pick one):**
- **(A)** Keep peach for **icons only**; introduce a `--color-link` token (deep
  terracotta, ≥4.5:1 on cream + dark) for link **text**. I then sweep the ~90
  files and migrate only the *text* usages (icons stay peach).
- **(B)** Ink links with an underline (`text-foreground`), no new colour.

This is a brand-accent call, so I won't change it unilaterally. Icons on peach
are decorative (low contrast is acceptable); *text* on peach is not.

---

## 🔐 Security — one-click dashboard toggle (not SQL-able)

**Enable "Leaked password protection"** — Supabase Dashboard → Authentication →
Providers → Email → toggle **"Prevent use of leaked passwords"** ON. Supabase
Auth then checks new/changed passwords against HaveIBeenPwned. Free, one click.
(Flagged by the security advisor; I can't flip it from SQL.)

**Known-accepted (no action):** the `pgvector` extension lives in the `public`
schema (standard install) — moving it risks breaking `vector`-typed columns.

---

## 🧠 Psychopharm content — clinician review (2026-08-14 enrichment)

I authored **146 enriched medication entries** (student plain-language summary +
clinical mechanism/uses/side-effects/monitoring) from **Stahl's Prescriber's
Guide 7th ed.** (`docs/psychopharm/extracted_mono_stahl7.json`) + web research,
and seeded them into `medication_documents` as **DRAFT**. Before they reach
students they need your clinical sign-off:

1. Open **/admin/psychopharm-review**, open a medication, check the content is
   accurate, then **Publish** it (the reviewer gate stays closed until you do).
2. Flag anything wrong and I'll correct it — I cross-referenced Stahl + FDA/NCBI
   and marked uncertainty, but can't substitute for your judgement.

Nothing is student-visible until you publish each drug, so there's no rush —
the drafts sit in the editor waiting for review.

---

## 📚 Knowledge corpus — Fish's Clinical Psychopathology index truncated

The source PDF for **Fish's Clinical Psychopathology, 3rd ed** (`scripts/
psychopharm/text/fish_psychopath.txt`) ends its Index at the **"C" section**
(`chorea`) on PDF page 136; PDF page 137 is blank. The printed Contents lists
`Index 132`, so the full A–Z index (D–Z) is missing from the cache. Not
blocking — all 9 chapters + both appendices are complete and already outlined
(`scripts/knowledge/outlines/fish_psychopath.json`), and the index is only a
lookup. If you can re-supply a complete scan/PDF, I'll re-run the extraction
and close the gap.

---

## 🧠 Knowledge layer — AI synthesis/quiz-generation keys (2026-08-14)

The **retrieval layer is live and $0** — 27,608 chunks across all 10 books,
100% embedded, hybrid search verified (100% recall@5/@8 on the eval set). The
Psychology Tutor (`/practice/tutor`, behind the `knowledge_tutor` flag) returns
**real book passages with source citations right now** — it only needs keys to
also add AI-written synthesis on top of the passages.

To unlock **AI synthesis** (grounded tutor answers + corpus quiz generation),
set any one **no-train** provider key — the retrieval-first design never sends
the corpus wholesale, only the top-k retrieved passages:

1. **`ANTHROPIC_API_KEY`** (paid, no-train) — the strongest student-data lane;
   unblocks the tutor's synthesis + grounded quiz generation immediately.
2. **`GROQ_API_KEY`** or **`CEREBRAS_API_KEY`** (free, no-train) — same effect,
   free-tier rate limits. `GROQ_API_KEY` also unlocks fast Whisper STT.

Until one of those is set, the tutor and psychopharm editor source-panel still
work fully on retrieval (real passages + citations); the `knowledge_tutor`
flag stays OFF so students don't hit a half-AI page. Flip it on after you set a
key and I'll verify the synthesis path end-to-end.

### To enable for students when ready
- Flip the **`knowledge_tutor`** flag at **/admin/flags** (Psychology Tutor) —
  off by default so the page is hidden until the AI synthesis lane is live.

---

## 🧠 Fine-tuning — one key from a domain base model (2026-08-14)

The user directed: "I want you to fine tune and build a base." The buildable
foundation is DONE and committed (80814d8): a deterministic fine-tuning dataset
(scripts/finetune/data/ — 50 grounded SFT examples + 2,000 source-prefixed
pretrain passages, $0, no model used to generate) + the runbook
docs/FINETUNING.md with the eval gate. The actual fine-tune JOB is blocked on a
provider key with fine-tuning support — set `DEEPSEEK_API_KEY` (DeepSeek V4 is
the session's model family; fine-tune API not yet publicly documented, so an
OpenAI-compatible key or a HuggingFace setup may be the practical path per the
runbook) and I'll run the fine-tune + eval gate.

---

## 🔑 AI backend keys — current status (2026-08-14)

**Everything works now with just `GROQ_API_KEY`** (your key, configured + verified
live: llama-3.3-70b-versatile + whisper STT). Cloudflare R2 + Supabase are also
already configured and verified — no setup needed.

Optional upgrades, only if/when you want them:
- **`CEREBRAS_API_KEY`** (free, no-train) — JSON fallback lane for redundancy.
- **`ANTHROPIC_API_KEY`** (paid, no-train) — strongest synthesis lane.
- **`NVIDIA_API_KEY`** (free) — CosyVoice 2 premium server TTS.
- **`DEEPSEEK_API_KEY`** — fine-tune the base model (see docs/FINETUNING.md).

To activate the live AI lanes end-to-end, set `AI_ENABLED=true` in `.env.local`
(Groq is no-train, so student data is safe). Currently AI_ENABLED is unset
(fixtures mode) — the voice tutor works on retrieval either way.

---

## 🔑 Capacity keys for 45-DAU target (2026-08-14 — from docs/CAPACITY_MODEL.md)

The bottleneck is **Groq's 1,000 requests/day** (45 DAU needs ~1,620/day).
DeepSeek can't serve student data (unresolved posture, guard-enforced). Two
free additions close the gap:

1. **CEREBRAS_API_KEY** — cloud.cerebras.ai (free, no-train, ~1M tok/day).
   WHY: the #2 no-train json/chat fallback the router already has. TASKS:
   second student-facing lane (patient sim, tutor). FREE: ~1M tok/day.
   NECESSARY: yes — it's the cheapest capacity double. OPEN-SOURCE ALT:
   self-host (heavier). ENV: `CEREBRAS_API_KEY`.
2. **OPENROUTER_API_KEY** — openrouter.ai. WHY: the overflow lane; $10 one-time
   → ~1,000 RPD of no-train models (50 RPD free). TASKS: overflow when
   Groq/Cerebras are saturated. NECESSARY: yes for full 45-DAU headroom.
   ENV: `OPENROUTER_API_KEY`.

Until those land, the app works (Groq covers ~25-28 DAU); the tutor + patient
sim + voice all function today.

---

## 🔑 Cerebras alternative + OpenCode (2026-08-14, user request)

- **`SAMBANOVA_API_KEY`** — cloud.sambanova.ai (free, no card, no-train). The
  best Cerebras alternative for the student-facing fallback lane (verified:
  Meta-Llama-3.3-70B-Instruct, DeepSeek-V3.x, gpt-oss-120b, gemma-4-31B —
  OpenAI-compatible). WHY: doubles the no-train student capacity beyond Groq's
  RPD ceiling. ENV: `SAMBANOVA_API_KEY`. The router already has it as the #3
  no-train lane.
- **`OPENCODE_API_KEY`** — opencode.ai/zen (OpenAI-compatible gateway; OpenAI/
  Anthropic/Qwen via one key). WHY: another no-train fallback lane per your
  request. ENV: `OPENCODE_API_KEY`. Registered as a fallback after OpenRouter.

---

## ✅ SambaNova key SET but VERIFIED PAYWALLED (2026-08-14)

Your `SAMBANOVA_API_KEY` is configured (gitignored .env.local) and the provider
is registered, but the live API returns `PAYMENT_METHOD_REQUIRED` — SambaNova
now requires a card on file (the "free, no card" research was outdated). So it
is a **paid fallback**, not the free Cerebras replacement.

**The truly-free no-train capacity double is `CEREBRAS_API_KEY`** (free, no
card, ~1M tok/day — the router's #2 student lane). With Groq + Cerebras +
OpenRouter (already live) the 45-DAU target is met. Get a Cerebras key if you
want the free double; SambaNova remains usable if you add a card.

---

## ⚠️ Cerebras VERIFIED PAYWALLED too (2026-08-14, user request)

You tried Cerebras and confirmed: **"we can't without adding payments"** — the
Cerebras platform now requires a payment method to issue a key. So it is a
**paid fallback**, not the free no-train double it was earlier researched as.

**Verified free lanes today (no card):** Groq (live) + OpenRouter (live) are
the student-facing no-train lanes that actually work at $0. Cerebras, SambaNova,
and OpenCode Zen are all paid options that become usable when a card is added.
Until a second no-train free key exists, Groq's ~1,000 RPD is the practical
student-data ceiling (≈25-28 DAU).

---

## ⚠️ OpenCode Zen VERIFIED PAYWALLED too (2026-08-14)

Your `OPENCODE_API_KEY` is configured and the provider is registered (62 models
verified live: claude-sonnet-5/opus-5, gpt-5.4-nano, gemini-3.7-flash,
deepseek-v4, kimi, qwen, glm). But the live API returns
`CreditsError: No payment method` — OpenCode Zen needs billing set up on its
workspace (https://opencode.ai/workspace/.../billing). It's a **paid gateway**,
not free.

**Verified free lanes today (no card):** Groq (live) + OpenRouter (live) are
the student-facing no-train lanes that actually work at $0. The free capacity
double remains `CEREBRAS_API_KEY`. SambaNova + OpenCode are both paid options
that become usable when a card is added.

---

## ☁️ OmniRoute to cloud — one interactive step (2026-08-14)

Everything is ready to deploy OmniRoute to Fly.io so it runs when the laptop is
closed (always-on, no spin-down; the repo ships a deploy-ready fly.toml with
`min_machines_running = 1`). The ONE human step is browser auth:

```
flyctl auth login     # one-time; opens a browser to authenticate your Fly.io account
bash scripts/deploy-omniroute.sh   # does the rest automatically
```

After deploy, set `OMNIROUTE_URL=https://omniroute.fly.dev/v1` in `.env.local`
and the VIBHA app uses the cloud gateway (the router already reads it). flyctl
v0.4.83 is installed; the deploy script sets the provider keys as Fly secrets.

## 🛡️ Security retest access (2026-08-14, SharkVoid scan)

The external scan could not validate admin/API surfaces because Vercel's
Security Checkpoint returns a 403 challenge on every path. Two actions to
enable a real retest + finish agent discovery:

1. **Relax Vercel Security Checkpoint for testing** — Vercel → project →
   Settings → Security → temporarily allow the tester's IP (or generate a
   one-time inspection bypass) so `/admin`, `/api/practice/wall/*`,
   `/api/practice/journal/*`, and the tokenized endpoints can be validated.
   Re-enable the checkpoint after.
2. **DNS-AID records** (optional, completes agent discovery) — add at the
   DNS provider:
   ```
   _a2a._agents.vibhapsychology.com. 3600 IN SVCB 1 vibhapsychology.com. alpn="https" port=443
   _index._agents.vibhapsychology.com. 3600 IN SVCB 1 vibhapsychology.com. alpn="https" port=443
   ```
   Sign the zone with DNSSEC for authenticated data.

Already done this session: CSP hardened (no unsafe-eval in prod),
Math.random→crypto.randomUUID for turn IDs, secrets audit clean (no
service-role/session-secret in bundles), agent-readiness discovery live
(api-catalog, openapi.json, agent-card, oauth-protected-resource, auth.md,
agent-skills index, markdown negotiation, robots.txt Content-Signals).

## 🔌 AI provider offline in production (0.8, 2026-08-14)
Root cause: `AI_ENABLED` is unset AND no provider keys (GROQ_API_KEY etc.) are in
Vercel production env — so `isEnabled()`=false and the sim runs on deterministic
fixtures (the "Offline mode" banner). To go live: `vercel env add AI_ENABLED true`
+ `vercel env add GROQ_API_KEY <key>` (Groq is the verified no-train primary; key
is in .env.local). This is a production AI-enablement + data-policy decision —
deferring to Kavya rather than flipping prod AI unilaterally.

### RUN THE LIVE MOBILE QA (blocked on server + device — 18 QUEUE items)
T54 keyboard QA · T55 gestures · T56 swipe/step · T76 route review · T77
workflow completion · T78 first-time · T79 returning · T80 interruption ·
T81 regression matrix (320-430) · T82 desktop regression · T83 visual
comparison · T84 red-team · T85 cognitive-load · T86 progressive-consistency ·
T87 "what next?" · T88 polish · T89 E2E · T90 final acceptance.
Run `npm run dev` + `npx playwright test e2e/mobile-matrix.spec.ts` (spec is
ready) and walk the flows on a real phone (390px, gesture nav, keyboard).
