# AI in the product: reliability and cost review (November 2026)

Written 2026-11-14 on branch `agent/eco`. Recommendations only. No code changed. No new AI features.

Read: `src/lib/ai/*` (router, client, guards, cache, health, student-text, embed), `docs/AI_ARCHITECTURE.md`, `docs/AI_FREE_TIERS.md`, the callers in `src/app`, and two read only queries on the live `ai_usage_log` and `provider_health` tables.

## What is good and should stay

- One client (`aiChat`, `aiChatStream`) for every AI call. 12 call sites, all through it.
- The data policy guard (`assertProviderAllowed`, `src/lib/ai/guards.ts:39`) blocks providers that train on data from student workloads, and it is unit tested.
- Zod validation of JSON output, with a fence and prose stripper (`extractJson`, `client.ts:157`).
- `AI_ENABLED=false` fixture mode, so every feature works with no AI.
- Student text clean up (`student-text.ts`: no dashes, no stock AI phrases, no citations) runs on most outputs.
- Low temperature where it matters: debrief scoring 0.2 (`api/practice/sim/grade/route.ts:20`), tutor 0.3.

## The evidence that something is wrong

- `ai_usage_log` has **no rows at all since 1 September 2026**.
- The last rows (1 September) are every provider failing over (Groq, SambaNova, OpenRouter, OpenCode, 4 each) and 9 requests ending on the scripted fixture.
- `provider_health`: Groq last succeeded on **15 August** (7 failures since). OpenCode (18 failures), OpenRouter (17) and SambaNova (16) have **never** succeeded.
- `router.ts:109-113` itself says SambaNova now needs a payment method, so it is a paid lane that will always fail on a free key.

So either nothing has called the AI since September, or every call fails and the log write fails too. Either way, the AI features students see are probably running on scripts. **First step for the owner:** run `npm run sim:health-check` with the production keys on your laptop, or open `/admin/infra`, and check which keys still work.

## Top improvements, in order

### 1. Remove dead lanes and cap the total wait (reliability, big)

Each provider gets a 20 second timeout (`client.ts:150`) and the loop sleeps between providers (`client.ts:262`, up to 2 seconds). With up to 9 lanes in `PROVIDER_PRIORITY.json` (`router.ts:51`), a student can wait about 3 minutes (9 lanes times 20 seconds, plus sleeps) before the fallback. Most people leave long before that, and a function with a lower time limit is cut off first, so the student sees an error, not the fallback.

- Drop lanes that have never worked or need payment (SambaNova; OpenCode and OpenRouter unless their keys are re-checked).
- Add one overall deadline per request (for example 25 seconds) and shrink each provider's timeout to what is left.
- Do not sleep before trying a **different** provider. The doc says "go sideways, not to sleep" (`AI_ARCHITECTURE.md`), but the code sleeps on every retryable failure.

### 2. Fix the stream failover that can repeat an answer (correctness)

In `aiChatStream` (`client.ts:294-360`) the whole read loop is inside the `try`. If a provider sends some tokens and then fails, the `catch` moves to the next provider, which streams a **second full answer after the half answer**. The comment above the function says "first byte wins", but the code does not do that. Fix: once the first token is sent, stop failing over and end the stream.

Also in the stream: a 4xx (bad key) is recorded as a provider failure that opens the circuit, unlike `aiChat`, which separates outages from bad requests.

### 3. Fix the JSON repair path (correctness, small)

In `aiChat` (`client.ts:222-235`), when the first JSON reply fails validation, it asks once more. If the repair reply also fails, the error escapes as a plain error with no status. The `catch` then treats it as "retryable" and **opens the circuit** for a provider that is up but wrote bad JSON. That is the exact case the `misbehavior` flag was added to prevent. Mark repair failures as misbehavior too. The tokens of the failed first try are also never logged, so cost numbers are low.

### 4. Ask for strict JSON where the provider supports it (cheaper, fewer retries)

`callOpenAI` sends `response_format: { type: "json_object" }` (`client.ts:87`). Cerebras and Groq accept `json_schema` with a schema on some models (check the model list for each; Groq limits it to certain models). Zod 4 (already installed) can make the JSON Schema with `z.toJSONSchema(schema)`. A strict schema means fewer repair calls (each repair is a second full request). Keep `json_object` as the fallback for providers that reject it.

### 5. Count stream tokens properly (cost visibility)

Streams log `tokensOut: total.length` (`client.ts:352`), which is characters, about 4 times the real token count, and `tokensIn: 0`. Send `stream_options: { include_usage: true }` (the OpenAI style option; check each provider accepts it) and read the final usage event. Then `/admin/infra` shows real cost.

### 6. Read the provider health table once per instance, not on every call (cost, small)

`warmProviderCircuit()` (`health.ts:62`) runs a Supabase query on every `aiChat` call, after the routing is already decided, so the first request does not even use it. Run it once per server instance (a module level promise). It also sets `lastFailureAt` to "now" for any provider with old failures (`health.ts:76`), so after every cold start that provider is skipped for a minute even if its last failure was weeks ago. Store and use the real `last_failure_at`.

### 7. One source of truth for "is this student data" (safety, small)

`client.ts:182` and `client.ts:287` repeat a hard coded list of non student workloads. `guards.ts:20` already has `workloadHasStudentData()`. Use it in both places so a new workload cannot be routed wrongly by mistake.

### 8. Model names to re-check

- Gemini `fast` is `gemini-2.0-flash` and embeddings use `text-embedding-004` (`router.ts:72`). Google retires older models on a schedule; check both are still served.
- Anthropic is called through the OpenAI style endpoint with `claude-sonnet-4-5` and `claude-opus-4-5` (`router.ts:187`). If a paid key is ever added, test that endpoint and pick current model names first.

### 9. Smaller notes

- The cache key includes the provider name (`cache.ts:33`), and the tutor route passes the fixed string "grounded", so that is fine. Keep it that way: a real provider name in the key would split the cache.
- `/api/knowledge/ask` tells the model to "Cite sources inline like (Book, Chapter, page)" (`route.ts:100`) and streams the text without the student text clean up. That breaks the owner's "no citations in student text" rule. Today its only UI (`tutor-chat.tsx`) is unused (knip), so this matters only if the tutor comes back.

## Tooling: what to add and what not to

| Option | Verdict | Why |
|---|---|---|
| Vercel AI SDK (`ai`, 27,933 stars) | **Not now** | It would replace `client.ts`, but our client already does routing, the data guard and fixtures. A rewrite costs more than fixes 1 to 7. Revisit only if we add tool calling. |
| OpenRouter or a gateway as the only lane | **No** | One more point of failure, and the free tier is 50 requests a day. |
| Hosted tracing (Langfuse cloud, Helicone, LangSmith) | **No** | They store prompts, and our prompts carry student transcripts and journal text. |
| Prompt test runner (promptfoo, deepeval) | **Maybe later** | We already have `sim:quality-eval` and `sim:actor-prompt-proof`. Use those on fixtures before adding a new tool. |
| A scheduled health check (Vercel cron calling `sim:health-check` logic daily, alert by email) | **Yes, cheap** | It would have caught that Groq stopped working in August. |

## Cost

All current lanes are free tiers. The cheapest reliable setup for student workloads is **Groq plus Cerebras** (both free, both no training, both OpenAI style, both have structured JSON on at least some models). Everything else adds latency more than capacity. No paid service is recommended without the owner's approval.
