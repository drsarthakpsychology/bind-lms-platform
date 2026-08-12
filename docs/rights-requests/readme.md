# rights-requests — publisher and author permission letters

This folder holds ready-to-send letters asking permission to use Casebook's licensed corpus titles. They live here so every permission request is consistent, traceable, and easy to improve. The outcome of each letter belongs in the `rights_registry` table (see `scripts/seed-rights-registry.ts` and `src/migrations_pending/practice_layer_rights.sql`).

## What's here

| File | Purpose |
|---|---|
| `publisher-letter-template.md` | The main letter: **two separate grants** in one request |
| `author-letter-template.md` | A separate letter to each author, sent independently of the publisher |
| `jaypee-letter.md` | Pre-filled example for Jaypee Brothers Medical Publishers (Delhi) |
| `alexander-street-letter.md` | Pre-filled example for Alexander Street / ProQuest (transcripts) |

## The two-grant structure

Each publisher letter asks for **two separate grants**:

1. **Grant A — reading access.** Enrolled students of the programme may read the title for the duration of their enrolment. This is the ordinary, familiar grant.
2. **Grant B — TDM / AI processing rights.** The publisher's explicit permission to index, embed, retrieve (RAG), and derive non-substitutive teaching materials from the title for **one named internal application** (the Casebook simulated-patient practice trainer). The letter states plainly that **RAG counts as AI use and is covered by the request**, and commits to non-redistributive use: no verbatim output beyond fair-dealing quotation (Section 52 of India's Copyright Act, 1957), no sharing, no substitute for the book.

Two grants, one letter: the reader gets one document to approve, and each grant can be accepted or negotiated separately without restarting the conversation.

## Why we also ask the author directly

We seek the author's **own consent** independently of the publisher's. The rationale is the position of the **Authors Guild**: the right to authorise AI training uses of a work belongs to the **author** and is not automatically transferred to a publisher with a book contract. The Guild has called for prior consent from authors before AI uses of their works, has drafted model contract clauses requiring an author's express permission for AI training, and supports licensing as the path to controlled, permissioned use.

So for every copyrighted title in the corpus we need both permissions:

- the **publisher's** — for the text itself, institutional access, and licensing; and
- the **author's** — for the AI training use of their work.

The `rights_registry` tracks each separately (`licence_terms` for the publisher grant, `author_consent` for the author's).

## Per-publisher fill-in checklist

For each publisher below: copy `publisher-letter-template.md`, fill the fields, send, and record the outcome. Titles in parentheses are from the current registry seed — confirm the exact edition you own before sending.

### Jaypee Brothers Medical Publishers (Delhi)
- [ ] Titles: *A Short Textbook of Psychiatry* (Ahuja) · *Textbook of Postgraduate Psychiatry* (Vyas & Ahuja)
- [ ] Address: 4838/24, Ansari Road, Daryaganj, New Delhi 110 002, India · email jaypee@jaypeebrothers.com · phone +91-11-43574357
- [ ] Pre-filled letter: `jaypee-letter.md`
- [ ] Authors to contact separately: Niraj Ahuja; J. N. Vyas (through the publisher's address if no direct route)

### Guilford Press
- [ ] Titles: *Motivational Interviewing* (Miller & Rollnick) · *Handbook of Psychotherapy Case Formulation* (Eells) · *The Body Keeps the Score* (van der Kolk) — confirm each edition
- [ ] Contact: Rights and Permissions via the Guilford website (permissions form; no dedicated permissions email published — use the form, keep the confirmation)
- [ ] Authors to contact separately: Miller; Rollnick; Eells; van der Kolk

### American Psychiatric Association Publishing (APA)
- [ ] Titles: *DSM-5-TR Handbook on the Cultural Formulation Interview* · *APA Psychotherapy Video Series* (transcripts/videos)
- [ ] Contact: Permissions via the APA Publishing website (permissions portal; rights enquiries) — confirm the exact channel before sending
- [ ] Authors to contact separately: CFI handbook authors as credited on the volume

### Alexander Street / ProQuest (Clarivate)
- [ ] Titles: *Counseling and Psychotherapy Transcripts Vols I & II* — institutional tier **plus TDM rights**
- [ ] Contact: Alexander Street product enquiries via ProQuest/Clarivate; the published channels are the **ProQuest "Contact Us" sales form** (about.proquest.com) and the **support portal** (support.proquest.com → Clarivate Support Center). No published sales email; use the form, keep the reference number
- [ ] Pre-filled letter: `alexander-street-letter.md`
- [ ] This is the highest-value asset in the corpus — real-session move patterns for the simulated-patient trainer. Ask for a trial alongside the letter if one is offered

### Elsevier
- [ ] Titles: any Elsevier titles in the registry (confirm against the current edition's imprint page)
- [ ] Contact: Rights and Permissions via the Elsevier permissions page (their standard TDM/access workflows; ask specifically about RAG and non-substitutive derivation — their standard terms may not cover it)

### Oxford University Press (OUP)
- [ ] Titles: any OUP titles in the registry (confirm against the current edition's imprint page)
- [ ] Contact: OUP Permissions — global permissions portal (permissions.oup.com) and regional offices; India office for local titles

### Cambridge University Press (CUP)
- [ ] Titles: any CUP titles in the registry (confirm against the current edition's imprint page)
- [ ] Contact: CUP Permissions — permissions portal (cambridge.org/permissions); confirm whether TDM is included or needs a separate licence

### Wiley
- [ ] Titles: any Wiley titles in the registry (confirm against the current edition's imprint page)
- [ ] Contact: Wiley Permissions — RightsLink + permissions forms (wiley.com); note their TDM policy separately from standard reuse

### Routledge (Taylor & Francis)
- [ ] Titles: any Routledge titles in the registry (confirm against the current edition's imprint page)
- [ ] Contact: T&F Permissions — permissions portal (taylorandfrancis.com); confirm the TDM and AI policy, which has changed repeatedly

### American Academy of Sleep Medicine (AASM)
- [ ] Titles: *ICSD-3-TR* (Kryger's *Principles and Practice of Sleep Medicine* is Elsevier — keep the letters separate)
- [ ] Contact: AASM, 2510 North Frontage Road, Darien, IL 60561, USA · phone +1-630-737-9700 · general contact via aasm.org (help centre support.aasm.org); no published permissions email — ask via the contact form and record the reply address

## After sending

- [ ] Log the letter (date sent, address, reference number) in `rights_registry` (`rights_contact`, `contact_email`, `ask`, `notes`)
- [ ] When a grant comes back, record `licence_start` / `licence_end`, `licence_terms`, `cost_quoted` / `cost_paid`, and flip `rights_status` to `licensed` only after the grant is in writing
- [ ] Record `author_consent = true` only when the author has replied personally
- [ ] Keep a PDF of every sent letter and every reply — the ingester gate depends on the paper trail
