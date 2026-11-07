# Practice tools review, November 2026

> Branch `agent/research2` (with `admin-redesign` at 275edce merged in). Written 7 Nov 2026.
> Live switches and content counts were read **read-only** from the live database (project `hojhzwvuccojqkvkkslw`). No switch was changed.
> Owner instruction: fit tools into the current structure, merge where they overlap, and add a tool only if it meets the standard.

## The standard each tool was judged against

1. Works end to end with real data (tables exist, saves, no crash when AI is down).
2. Enough content to be useful more than once.
3. Clean, minimal screen; mobile friendly.
4. No dead ends (no links to switched-off screens).
5. No dashes and no references in student text.
6. Clearly different from the other tools.

## Summary table

| Tool | Verdict | Reason | Switch to turn on |
|---|---|---|---|
| **AI patient interview** (Consulting Room) | **Switch on as is** | 71 approved, published cases (38 cooperative, 27 guarded, 6 resistant), no dashes in the stored text. 31 sessions already finished with debriefs. When no AI provider answers, the turn falls back to the scripted case-aware patient, so a session never dead-ends. | `consulting_room` |
| **MSE** (Practice MSE trainer) | **Switch on after the fix I made** | Five-level ladder, 30 published stimuli plus built-in banks, saves attempts and Passport evidence. Gaps fixed: 11 stored stimuli carried em dashes, so their text is now cleaned before display; the end-of-level check showed citations ("WHO mhGAP-IG 2.0 (2016)" and similar), which are now hidden. | `mse` |
| **Formulation** | **Switch on as is** | 6 full built-in cases (10 to 12 factor cards each, model 5P narrative), plus a "formulate from your own interview" stage and an anonymised peer wall. The one database row duplicates built-in case 1 and is already skipped, so its dashes never show. | `formulation` |
| **Journal** (`/reflect`, already in the student menu) | **Switch on after the fix I made** | Private journal with per-entry, revocable sharing; works today (entries exist). Fix: the optional "Help me think" AI reply was not cleaned, so it could show dashes; it now goes through the same student-text cleaner as every other AI output. Without a no-train AI provider it shows an honest "not available yet" line and the entry still saves. Turning this on also removes the "Not unlocked yet" dead end from the menu. | `journal` |
| **Judgment** (5 Judgment Calls) | **Keep off** | The "expert panel" answers are not real: they are generated from a hash of the item id, so the feedback a student gets is effectively random. The expert-response table is empty. The page also always serves the same first 5 items, and about two thirds of its 197 items are copies with a stock sentence added ("She has a supportive family." even for male patients). It needs a real clinician-keyed panel before it can teach anything. | `judgment` (leave off) |
| **Two-minute clinic** | **Merged into Clinic detective** (fixed) | 139 strong expert one-liners (differential, best next question, lesson), set in Indian practice. It overlaps with Clinic detective (both are "reason from the presentation"), so it is now a second mode on the Clinic detective page ("Clues" or "Two-minute clinic") instead of its own tile. Fix: it used to open on prompt 1 every visit; it now starts on a random prompt. The old address redirects to the new mode. | `two_minute_clinic` (shows the mode tab inside Clinic detective) |
| **OSCE stations** | **Switch on after the fix I made** | 12 timed stations with weighted checklists, optional voice transcript, self-assessment, saves attempts and Passport evidence (tables exist, the same 12 stations are in the database). Fix: the "check what stuck" quiz below the station printed book and guideline citations; those are now hidden (only Act and section numbers, which are content, still show). | `osce` |
| **Peer role-play** | **Keep off** | Far below standard. The "patient" student gets no case brief or script, so there is nothing to play. The partner is not notified; they only see the session if they happen to open the page. You must type a classmate's exact email. The "matched partner" suggestion shows another student's email address. The AI patient interview already covers this job well. | `peer_roleplay` (leave off) |
| **Weak spots drill** | **Merged into AI patient interview** (fixed) | It reads the student's own interview debriefs, so it belongs with the Consulting Room, not with Exam Prep's Smart practice (which is about exam knowledge). It no longer has its own tile; the Consulting Room shows "Your weak spots and a drill from your debriefs" once the student has a scored interview, and the page has a Back link to the Consulting Room. Fixes: a "the card that teaches this" link opened an unrelated quiz screen, so it is now a plain "Key idea" line; one remedy pointed at the Two-minute clinic for reflective listening (wrong tool) and now points at the Consulting Room; remedies that would open a switched-off tool (MSE, OSCE) fall back to the Consulting Room. | `weak_spots` (turn on with or after `consulting_room`) |
| **Landmark cases** | **Switch on after the fix I made**; it is now the one cases library | 23 original teaching narratives (Gage, H.M., Little Albert, Genie, Rosenhan, Milgram, Genovese, Erwadi and others), each with "what was believed, what held up" and a quiz. Facts fixed: the Ranchi asylum history (the European asylum became today's Central Institute of Psychiatry; Indian patients went to a separate asylum); the Erwadi death toll and what the MHA 2017 actually bans (chaining, seclusion, solitary confinement); Rosenhan (all pseudopatients were admitted; the critique now matches what later checks found); Anna O and Stanford claims softened to what is known; an author-in-brackets citation removed; a paper title replaced by a plain name. Two entries whose history I could not verify (a colonial "beriberi insanity" story and a 1918 "influenza psychosis" in Indian asylums) were removed rather than risk teaching invented history. | `landmark` |
| **Case library** | **Keep off; merged into Landmark cases** | It is 188 raw open-access journal articles shown as unformatted text, starting with author lists, journal and publisher names, DOIs and dashes, and some are conference abstract books, not case reports. That breaks the no-references rule on every page, and it is not curated. Landmark cases is the curated cases library, so the Case library tile has been removed from Practice. | `case_library` (leave off) |
| **Skills Passport** (`/passport`) | **Switch on after the fix I made** | Collects evidence from the AI patient interview, MSE, Formulation, OSCE and supervision; 11 competencies, PDF download works. Fix: it said signed-off hours "underpin your certificate", which contradicts the approved certificate rule (pass every module test at 80 percent); that line is gone. | `skills_passport` |
| **Supervision log and weekly check-in** (`/record`) | **Switch on as is** | Logging works end to end: a sign-off request reaches the admin Sign-offs queue, tagged hours feed the Passport, and the weekly check-in feeds the anonymous wellbeing view. Each switch can be on alone; the page shows only the tabs that are on. Most useful for MPhil and RCI trainees. | `supervision`, `checkin` |

### Switches to flip, in one list

Turn on: `consulting_room`, `mse`, `formulation`, `journal`, `osce`, `landmark`, `skills_passport`, `supervision`, `checkin`, `two_minute_clinic`, `weak_spots`.

Leave off: `judgment`, `peer_roleplay`, `case_library`.

Suggested order: `consulting_room` first (Weak spots and the Passport draw on it), then the rest together.

## What changed in the code

| Change | Files |
|---|---|
| Practice hub: removed the Two-minute clinic, Weak spots and Case library tiles (merged); footer links to Skills Passport and the supervision log now show only when their switches are on (this was a P0 dead end in the UX audit) | `src/components/practice/practice-hub.tsx`, `src/app/(dashboard)/practice/page.tsx` |
| Clinic detective gains a "Two-minute clinic" mode (only when `two_minute_clinic` is on); the old `/practice/two-minute-clinic` redirects to it; the clinic starts on a random prompt | `src/app/(dashboard)/games/detective/page.tsx`, `src/app/(dashboard)/practice/two-minute-clinic/*`, `src/lib/practice/clinic.ts` |
| Weak spots opens from the Consulting Room; remedies never open an off tool; the misleading "card" link became a plain line | `src/app/(dashboard)/practice/consulting-room/page.tsx`, `src/app/(dashboard)/practice/weak-spots/*`, `src/lib/practice/weak-spots.ts` |
| Quiz checks show only legal sources (Act and section); book, paper, author-year and guideline citations are hidden; "every item carries its source" lines removed | `src/components/practice/quiz-check.tsx` (+ test), OSCE, MSE and Ethics pages |
| MSE stimuli from the database are cleaned of dashes before display | `src/app/(dashboard)/practice/mse/page.tsx` |
| Journal AI reply cleaned | `src/app/api/practice/journal/help/route.ts` |
| Passport certificate wording | `src/app/(dashboard)/passport/*` |
| Landmark fact corrections, two unverified entries removed | `src/lib/landmark/cases.ts` |

Checks: type check clean; lint clean on every changed file; 42 test files (343 tests) pass in the practice, landmark, quiz, games, search, student-text and no-references suites.

## Left for the navigation and shell owner (not touched, by instruction)

1. **Search palette** still lists "Two-minute clinic" at its old address (it redirects, so it works) and "Case library" (which will show "Not unlocked yet" while it stays off). Suggest: drop the Case library entry and point the clinic entry at `/games/detective?mode=clinic`. File: `src/lib/search/palette.ts`.
2. **Back from Practice tools** still says "Back to Games" for Clinic detective (audit finding 5). The new clinic mode inherits that until the tools move out of `/games`.
3. **MSE Lab** in Games overlaps with the Practice MSE trainer (audit finding 9). With `mse` on, Practice MSE is the full version; MSE Lab could go once the Games list is trimmed.
4. **Consulting Room safety sheet** shows on every visit; the audit suggests once per student.

## Notes for later

- Judgment could come back as a strong tool once about 60 base items have real answers from 5 or more clinicians (the scoring code and tables already exist).
- Peer role-play would need: a patient brief per session (the 71 Consulting Room cases could supply it), an in-app notice to the invited partner, and picking classmates by name within the cohort instead of by email.
