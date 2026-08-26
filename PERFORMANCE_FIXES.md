# PERFORMANCE FIXES — 2026-08-27 (16-part performance pass)

Every finding below was produced by a 9-agent read-only audit (structured
findings + real measurements) and verified against the live production DB/app.
Where a part found nothing wrong, it says so plainly. All changes are on
`worktree-night-rights-roster-video`, gated green before each commit (lint 0,
tsc clean, 535 tests, build green), merged to main via PRs.

---

## Part 1 — One-row-at-a-time fetches (N+1)

**Found:** No per-row N+1 loops in the student path. The course/lesson progress
computation (course-overview.tsx) fetches all progress for the user in ONE
query + joins in memory — already correct. The audit's N+1 hits were all
"fetch a big list then derive counts in JS" (see Part 3), not true N+1 loops.

**Changed:** Nothing to fix in Part 1 proper. The unbounded-list derives were
addressed in Part 3.

## Part 2 — Missing database indexes

**Found (EXPLAIN ANALYZE, prod):**
- `sim_scores` had NO user index — the student learning-profile/weak-spots hot
  path ran `Seq Scan on sim_scores … Rows Removed by Filter` on every read.
- `sim_sessions` filtered `status` AFTER the user index scan.
- `sim_turns` sorted after the session index on every transcript load.
- `scoring_corrections`, `wall_replies`, `wall_posts`(author), `wall_reports`,
  `supervision_entries`, `submissions`(status), `profiles`(role/scope),
  `lesson_transcripts`, `sim_branches` all seq-scanned their filter/sort.

**Changed:** `supabase/migrations_pending/perf_indexes.sql` — 15 indexes,
applied to prod, verified used. Before: `Seq Scan`; after: `Index Scan using
idx_sim_scores_user_created` (0.9ms). Intentionally NOT indexed: lessons.status,
feature_flags.status, credential_invites.status, profiles.status (only SELECTed,
never filtered — dead-index avoidance per the "don't over-index" rule).

**Numbers:** sim_scores hot query 0.895ms post-index; plan flips seq→index.

## Part 3 — Pagination

**Found:** 9 unbounded admin queries (submissions, pulse sim_sessions+checkins,
triage, supervision, student list, enquiries, courses lesson-count, modules,
cards). Data grows with the cohort (submissions/wall/journal fastest).

**Changed:** Safety `.limit()` caps on all of them (submissions 200 newest,
students 200, enquiries 200, lessons count 5000, pulse 500, triage 1000,
supervision 100, cards 500, module grants 1000). Full cursor pagination with
"load more" is **deferred** — the cohort is ~64 students today and cursor UI
pays off past a few hundred rows; the caps already stop unbounded growth.

## Part 4 — Images

**Found: nothing to fix.** The app serves zero static raster images — the
Neo-Brutalist Pastel world is 100% vector (lucide SVG) + CSS + text. Only 5
unused boilerplate SVGs in public/. Two raw `<img>` tags (materials viewer,
submission preview) load signed per-request URLs and correctly bypass
next/image; they already use `object-contain` (no layout shift).

## Part 5 — Lazy-load heavy components

**Found:** `livekit-client` (557KB minified) was statically imported into the
student consulting-room route; admin AssignmentEditor + MaterialUploader were
statically imported into the student lesson route.

**Changed:** Voice screens now `next/dynamic({ssr:false})` — the livekit chunk
only fetches when voice mode starts. The two admin editors move into a lazy
client wrapper (`admin-tools-lazy.tsx`) — students never download the authoring
bundle. hls.js + pdfjs were already code-split (reference pattern kept).

## Part 6 — Streaming AI responses

**Found:** `aiChat()` is fully buffered; the patient turn, debrief, and tutor
all awaited the complete payload (the patient turn faked a typewriter after a
full JSON).

**Changed:** Added `aiChatStream()` (OpenAI-compatible SSE, first-byte-wins
failover, circuit + usage aware). The **Psychology Tutor** now streams:
`/api/knowledge/ask` returns `text/event-stream` (meta with sources → deltas →
done, cached on completion); tutor-chat renders tokens incrementally. The
patient turn keeps its delivery-cue typewriter for now — real token streaming
there needs the route to persist on stream-completion (state + delivery are
persisted before responding today); documented as the remaining streaming
surface. Debrief is structured JSON — streaming is the wrong tool for it.

## Part 7 — Compression

**Found: already good.** Vercel edge compresses with Brotli: `/api/health`
→ `content-encoding: br` (79 B), landing HTML → `br` (10,669 B). No
app-level gzip (would double-compress).

**Changed:** None.

## Part 8 — Batch inserts (roster importer)

**Found:** `importRoster` looped 3 round-trips per student (~192 for 64):
createUser (unavoidable — GoTrue has no batch endpoint) + 1× profiles.update +
1× credential_invites.upsert, with write errors silently ignored. Card reorder
did N single UPDATEs per move.

**Changed:** profiles-scope + credential rows now batch as ONE call each;
write errors surface in the import report instead of silently counting clean.
Card reorder upserts the whole re-sequenced queue in one call.

## Part 9 — AI circuit breaker

**Found:** breaker tripped ONLY on consecutive exceptions — a provider
returning 200 in 19s never tripped and stalled every request up to the 20s
timeout. Circuit state was in-memory only (lost on serverless cold start);
schema-parse + 4xx failures counted as provider outages.

**Changed:** rolling latency EMA per provider — sustained >8s opens the
circuit (warmup 5 samples); `warmProviderCircuit()` seeds from
`provider_health` on cold start; only transport failures (429/5xx/timeout)
trip the breaker (schema/4xx logged separately). Latency persisted via
`ai_circuit_latency.sql` (avg_latency_ms + latency_samples).

## Part 10 — Optimistic UI

**Found:** wall reaction/post/reply + journal entry waited for the full server
round-trip before updating; roster send did a full `window.location.reload()`.

**Changed:** wall reaction flips instantly + rolls back on failure; wall
post/reply + journal prepend with a temp id, reconcile to the real id, restore
the draft on failure. Roster send shows an in-flight "Sending…" and reconciles
each row from the server's per-email result (no reload); **"failed" always comes
from the server result, never assumed.** Lesson-complete + the BLOCKED-status
gate stay server-checked (making them optimistic would show a false success or
false unblock).

## Part 11 — Caching

**Found:** the landing page was already ISR-cached (revalidate 3600) — good.
But case-library docs, landmark cases, and psychopharm published documents were
re-read per request on every serverless instance. The dashboard layout reads
cookies()/getSession(), so page-level ISR on dashboard children is inert (they
must stay per-request — they contain personal data).

**Changed:** `getLibraryDocs` + the psychopharm published-doc lookup now serve
from `unstable_cache` (1h, cross-instance); the psychopharm publish route
revalidates the tag. Personal pages (dashboard, journal, wall) remain
per-request — no cross-user cache key exists, leak risk assessed low.

## Part 12 — Mobile horizontal overflow

**Found:** wall post/reply bodies, journal entries, peer-wall case titles,
lesson descriptions, assignment instructions, and submission notes all lacked
`break-words` (a long Devanagari/Gujarati word or URL overflowed at 375/390px).

**Changed:** `break-words` added to all of them + `min-w-0` on the peer-wall
case title (UI_RULES §1). MobileListItem/PageHeader were already compliant.

## Part 13 — Unnecessary re-renders

**Found:** the patient typewriter rebuilt the `turns` array ~25×/sec and
re-rendered the whole session tree (every bubble, header, composer, sheets).
ChatMessage had no `React.memo`.

**Changed:** `React.memo` on ChatMessage/ChatList/SimulationHeader/ChatComposer/
NotesSheet/HintSheet; `useCallback` on send + stable toggle/open; `useMemo` for
patientReply + patientVoicePrefs (killed a double affectToVoice call). Now a
typewriter tick repaints only the changed bubble. (Verified by inspection; a
React DevTools profile pass is the follow-up measurement.)

## Part 14 — Type-weight tokens

**Found:** `font-black` (900) used 17× — the token scale tops at 700;
`font-medium` (500) used 262× (off-scale); 2 `font-normal` usages.

**Changed:** all `font-black` → `font-bold` (700). The 2 `font-normal` usages
are intentional de-emphasis inside bold labels — kept. The 262 `font-medium`
sites need a per-site design judgment (emphasis→600, quiet→400) — a blanket
sweep would change visual hierarchy app-wide; documented as the remaining token
violation rather than risk a 262-site visual regression blind.

## Part 15 — LCP / entrance animation

**Found:** the landing hero h1 (the LCP element) started at `opacity: 0` on
hydration via KineticHeadline — invisible until the word-rise entrance played.
The dashboard LCP (course h1 / Continue card) already renders immediately
(Reveal uses `initial={false}`).

**Changed:** KineticHeadline animates `y` only (never opacity) — the headline is
opaque from first paint; the rise effect is preserved. (Live Lighthouse LCP is
the follow-up measurement.)

## Part 16 — Prefetch on clear intent

**Found:** the next-lesson link, dashboard Continue card, and course cards
relied on default viewport prefetch only; assignment uploads started on Submit
not file-select.

**Changed:** explicit `prefetch` on the next-lesson link, the Continue card,
and the course cards. The file-select upload prefetch is documented — signed
URLs expire, so the safe version starts the byte upload to a scratch path on
select; deferred to avoid uploading files the student then removes.

---

## Verified already-good (honest)
- **Part 4 images**, **Part 7 compression** — nothing to fix.
- Lesson-complete + BLOCKED-status (Part 10) — correctly server-checked, kept.

## Numbers recorded
- sim_scores hot query: seq scan → index scan, 0.9ms.
- livekit-client chunk (557KB) removed from the student route's eager bundle.
- /api/health + landing HTML already brotli (br).
- 46 QUEUE.md items remain unchecked (12 verified-DONE ticked); the rest are
  the AI/voice product + mobile-acceptance workstream (12 LARGE, 10 BLOCKED,
  21 TRACTABLE — see NIGHT_LOG for the triage).
