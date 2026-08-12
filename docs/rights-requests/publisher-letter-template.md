# Publisher permission letter — template

A ready-to-send letter to a publisher's rights department. It requests **two separate grants** in a single letter:

1. **Grant A — reading access** for enrolled students of the programme.
2. **Grant B — TDM / AI processing rights** for one named internal application.

Send one letter per publisher, listing all of their titles you need. Fill the table below, replace every `[bracket]`, then send (email is fine). Keep a PDF of the sent copy and record the outcome in the `rights_registry` (`rights_contact`, `contact_email`, `ask`, `cost_quoted`, `licence_start` / `licence_end`, `licence_terms`, `author_consent` — see `scripts/seed-rights-registry.ts` and `src/migrations_pending/practice_layer_rights.sql`).

## Fill in before sending

| Field | Fill in |
|---|---|
| Date | |
| Publisher / imprint | |
| Rights department contact | (name, if known) |
| Title(s) covered | |
| Author(s) | |
| ISBN(s) | |
| Programme name | Casebook |
| Programme contact | (your name, role, email, phone, city) |

## Letter body

[Date]

[Name], Rights Department
[Publisher]
[Address]

Dear [Name / Rights team],

I'm writing on behalf of **Casebook**, a training programme in India for early-career counselling and mental-health practitioners. Our students train toward counselling roles — the first people a family often turns to — and they learn by doing: each enrolled student conducts guided interviews with simulated patients in a secure practice application, and their technique is assessed against established clinical practice.

To teach well, our teaching materials draw on the published clinical literature, including the title(s) you publish that are listed below. I would like to request **two separate grants of permission**.

### Grant A — reading access for enrolled students

We ask that the enrolled students of the programme (approximately [N] students, [cohort dates]) be permitted to read the title(s) — from print or licensed digital copies — for the duration of their enrolment. Access is limited to enrolled students; nothing is resold, shared, or redistributed.

### Grant B — text-and-data-mining / AI processing rights

We ask permission to process the title(s) for **one named internal application**: the Casebook simulated-patient practice trainer. Concretely, the processing we request is:

- **Indexing and embedding** the text for semantic retrieval;
- **Retrieval-augmented generation (RAG)** — to be explicit: RAG counts as AI use, and this request covers it — in which the application retrieves passages to inform its internal reasoning, scoring, and teaching feedback;
- **Derivation of non-substitutive teaching materials** — summaries, rubrics, and reference patterns written fresh from what the text teaches, which never reproduce your text verbatim beyond short fair-dealing quotations (consistent with Section 52 of India's Copyright Act, 1957).

We commit that all of this is **non-redistributive**: no verbatim passage is ever served to students or any third party; no copy of the work is shared; the derived materials cannot substitute for the book. Use is confined to the one named application, access is limited to enrolled students, and we will delete processed copies on request or at the end of the agreement.

We are glad to pay a standard fee for Grant B, to report usage if you wish, and to acknowledge the publisher and authors in the application's credits.

If any of the above needs adjusting, we are glad to negotiate. We would also welcome your guidance if you prefer Grant B handled through a licensing service.

With thanks for your consideration,

[Your name]
[Role], Casebook
[Email] · [Phone]
[City], India

## Checklist before sending

- [ ] Imprint confirmed on the copyright page of the edition you own (not just the retailer's page)
- [ ] ISBNs and edition numbers filled in
- [ ] Both grants present (A: reading access, B: TDM/AI — RAG stated explicitly)
- [ ] One named internal application stated
- [ ] Contact details of the rights department verified on the publisher's website this week
- [ ] Fee expectations noted so you can respond quickly when they reply
- [ ] Author letter for the same titles sent separately (see `author-letter-template.md`)
