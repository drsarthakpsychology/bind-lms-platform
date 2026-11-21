# To connect: Notes tab screens (builder "bnotes")

Everything the Notes tab opens (revision notes, quick reference, medicines,
compare). Design phase only: these lines say what a later engineer wires up.

| Screen | File | What is designed | What data it needs | Where the website has it |
|---|---|---|---|---|
| Medicines, "By how they work" | `src/library/list.tsx`, mock in `src/library/mock.ts` | Medicines grouped by what they act on, each group a heading with its rows | Groups of medicine ids per target, with a short qualifier | `GET /library/reference` already answers `byMechanism` (`src/lib/app-api/library.ts`, `mechanismIndex()` in `src/lib/psychopharm/store.ts`). The app has no hook for it and the app's mock server does not answer it. Match its drug slugs to medicine ids. |
| Pinned and Recently opened (notes, quick reference, medicines) | `src/library/pins.ts` | Pin button in the header of a note, a card and a medicine; "Pinned" and "Recently opened" on top of each list | A per-student saved list, so pins follow the student to another phone | Kept on this phone only for now. The audit suggests the learn state store (`src/lib/learn`), no new table. |
| Quick reference disorder card, extra slots | `src/screens/reference/reference.tsx` (`CardExtra`, `EntryBody extra`) | The card already lays out: threshold, age of onset, settings, impairment (facts strip), presentation types (table), the lesson link, practice made for the card | Those fields on the disorder entry of `GET /library/terms/:slug` | Not on the website yet: the typed criteria note in the notes audit (section 4B). Today only `duration` is sent, so only that cell shows. |
| Revision notes search | `src/screens/notes/notes.tsx` (`searchNotes`) | Search box over the notes list | Search inside the note text, not only title and one-line summary | `src/lib/search/everything.ts` indexes titles only; needs a text index from the server. |
| Revision notes filter chips | `src/screens/notes/notes.tsx` | Chips filter by part of the course (the week block the server sends) | A topic and a type per note (Criteria, Compare, Theories ...) | Notes audit section 4A; `src/lib/learn/notes/types.ts` has no type field yet. |
| Note page, "Practise this" | `src/screens/notes/notes.tsx` | Rows for practice and the quick reference | The note's own quiz and patient scenarios, and its lesson | The website note has both (`src/components/learn/note-view.tsx`); `GET /study/notes/:id` does not send them. |
| Medicine page, class of each related medicine and practice | `src/library/medicine.tsx` | "Rx Detective" row on every medicine | Practice tied to this medicine | None yet. |
