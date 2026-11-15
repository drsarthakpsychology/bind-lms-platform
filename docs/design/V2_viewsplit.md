# V2: loading screens and the Student / Clinician switch

## Loading
- Every Learn screen opens on a skeleton shaped like the screen being opened (src/components/ds/loading.tsx): soft fills, no borders, the real title where known, a lime stroke under the title drawn once. Nothing loops; reduced motion shows it still.
- The study cat stays only in empty states, drawn still.
- References (Screenrove, captured 2026-10-21/22): plane-pages-loading (list skeleton in the page's own shape), mixpanel-product-replay (quiet placeholder rows), ticktick-loading-splash (one brand mark, nothing else moving). Mobbin was not reachable (paid plan).

## Student / Clinician switch
Shown only where switching changes what is on the screen:
- Study sections that carry `:::student` / `:::clinician` blocks or a guess with a clinician reveal (src/lib/study/views.ts). Hidden on module tests, level checks, viva, Q&A banks and sections written in one voice.
- Lesson, review and blitz explanations; the coach; map practice; summaries; medicine pages; psychopharm bands. A test (src/lib/study/views.test.ts) checks every item there reads differently in the two views.
- Removed from the Quiz path list, where it changed nothing.

Audit: `npx tsx scripts/content-views-audit.ts` (259 of 759 reading sections are still one voice; the switch is hidden on them until a second voice is written).
