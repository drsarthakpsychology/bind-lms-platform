# Data Policy — VIBHA Practice Layer

Last updated: 2026-08-10. Written in plain language so students, faculty and
institutional partners know exactly what happens to practice data.

## The short version

- **Your journal is yours.** Neither faculty nor the platform team can read
  your reflective journal entries unless you choose to share one. There is no
  admin read path, by design.
- **Your sessions are used to debrief you.** Simulated-patient transcripts and
  scores are visible to you and your faculty (coursework, told up front).
  Faculty comments sit on top of the AI score, always labelled.
- **Your reflections and session text never go to a free AI tier that trains
  on it.** Anything you write or say that could identify you is only processed
  by providers that do not use your data for training. If none is configured,
  the feature turns off with an honest message — it never silently downgrades.

## Who processes what

| What | Contains student data? | Allowed providers |
|---|---|---|
| Drafting practice content (cases, cards, quiz items) | No | Any free tier |
| Corpus processing / summarising literature | No | Any free tier |
| Embedding course content | No | Any free tier |
| Live simulated-patient turns | **Yes** | no-train providers only |
| Debrief scoring of your transcript | **Yes** | no-train providers only |
| Journal "help me think about this" | **Yes — most sensitive** | no-train providers only |

"No-train providers" are ones that do not train their models on what you send
them. Free tiers often fund themselves with your prompts, so they are never
allowed near student-identifiable data. The split is enforced in code
(`assertProviderAllowed`) and covered by a test.

## Voice

- Speech recognition uses your **browser's** built-in engine (Web Speech API).
  On Chrome and Safari that means audio is sent to the browser vendor (Google
  or Apple) for transcription — you will see a permission prompt explaining
  this before the mic is used.
- Voice recordings are stored in Cloudflare R2 (not the database) with a
  30-day retention rule, then deleted.

## Access and deletion

- Your data is protected by row-level security in the database. Anonymous wall
  posts never expose your identity to other students (faculty can see it for
  moderation).
- Ask your faculty or the platform team to delete your data at any time.
