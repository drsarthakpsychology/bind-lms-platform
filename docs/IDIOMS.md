# Idioms of Distress — the Decoder's reference

Why this exists, what the bank contains, and how the four modes work. Students who can decode "I'm not feeling fresh" have the skill the programme exists to teach.

## The problem

A patient says **"I'm not feeling fresh."** Six things could be true: incomplete bowel evacuation, non-restorative sleep, depressive anergia, medication sedation, anaemia/hypothyroid/B12, or anxiety with somatic tension. A student who writes *low mood* and moves on has lost the case.

Idioms of distress are a formal field — Nichter's founding work was a case study from South India. The literature is blunt: clinicians routinely dismiss these presentations as hysterical, functional, or abnormal illness behaviour; they are the cultural blind spots of clinical practice.

The teaching spine is **Kirmayer & Young**: a somatic complaint can indicate any combination of seven things — disease, intrapsychic conflict, psychopathology, a cultural idiom of distress, a metaphor for experience, social positioning, or protest. Students are taught exactly one of the seven. This product teaches all of them.

## The bank

- **140 entries** in `src/lib/decode/idioms.ts` — this is what every Decoder
  mode, every sim case's opening line, MSE Level 1, and Rounds actually
  read. It ships unconditionally with the code, no approval gate.
- **65 seeded separately in the DB** (`public.idioms`), 18 compulsory-
  approved and the rest queued for faculty review. This table is a
  distinct, admin-reviewable reference corpus — **no gameplay path reads
  it today**; it exists for a future faculty-authoring flow, not the
  current one. Don't confuse the two counts.
- Each entry: phrase + transliteration, register, possible meanings (reading/category/likelihood/clue), disambiguating questions, the trap, sources.

### The families

**Somatic:** ghabrahat · bechaini · kamzori · gas · sar bhari · poora sharir dukhta hai · dil ghabrata hai · garmi lagti hai · sar mein hawa · chakkar · neend nahi aati · dimag kaam nahi karta · haath-pair thande · seene mein jalan

**Documented culture-bound:** Dhat (perceived semen loss distress — young South Asian men) · Koro (genital retraction fear) · sinking heart (Punjabi loss idiom) · white discharge as bodily idiom · possession states — taught as culturally sanctioned distress expression, often for women in restrictive settings, permitting temporary role release. That is a *formulation*, not a curiosity.

**Borrowed-biomedical:** "depression ho gaya" (colloquial sadness) · "BP high ho gaya" (got upset) · "tension hai" · "weakness hai" · "acidity" · "gas ho gaya"

**Attributional:** nazar lag gayi · kisi ne kuch kar diya · vaat/pitta imbalance · graha dosh · previously saw a baba

**English vague:** "not feeling fresh" · "feeling low" · "I'm stressed" · "can't focus" · "feeling weird" · "something is happening to me" · "I'm fine, just tired"

## The four modes

1. **Decode** — phrase shown, student multi-selects plausible meanings. Partial credit; **physical-category misses weigh 1.5×** (students over-psychologise). Reveal shows likelihood weights + the distinguishing clue.
2. **Funnel** — five free-text questions only, scored on efficiency. The funnel is taught in-app as a card: **open → specify → instantiate → quantify → contextualise → attribute**. "Walk me through yesterday morning" (instantiate) is the highest-yield question in clinical interviewing.
3. **Seven Readings** — Kirmayer/Young applied to one complaint; the student assigns which of the seven apply and justifies in one line. Often more than one is right — that is the lesson.
4. **CFI Practice** — the DSM-5 Cultural Formulation Interview's 16 questions, scored on eliciting the explanatory model **without dismissing it**. The failure mode is correcting the belief instead of understanding it.

## Wiring (the idiom is everywhere)

- Every sim case's opening line is an idiom (`opening_idiom`) — the patient never opens with a clean symptom.
- The Consulting Room debrief scores `idiom_decoding` (did the student ask what the phrase meant?).
- MSE Level 1 (describe-don't-diagnose) pulls idiom stimuli.
- Rounds has idiom → meanings cards.
- Two-Minute Clinic has an idiom variant among its 139 prompts.
- The Decoder's `scoreDecode` enforces the physical-miss weighting (tested).

## Sources

Nichter (1981) · Kirmayer & Young (1998) · DSM-5 Cultural Concepts / CFI (2013) · mhGAP-IG 2.0 (2016) · possession-trance literature.
