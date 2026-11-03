# Maudsley and Stahl: book analysis for VIBHA

Analyst pass for the VIBHA LMS transformation (Phase 2, Academic). Source books: the Maudsley Prescribing Guidelines (14th ed.) and Stahl's Essential Psychopharmacology (5th ed.). Activity specs that go with this file are in `docs/transformation/books/maudsley-stahl-activities.json`.

**Role framing (read first).** VIBHA trains psychologists, and psychologists do not prescribe. Everything below is written for a psychologist's job with medicines: **recognise** a problem, **understand** the mechanism well enough to explain it, **explain** it to the client and family in plain words, **monitor** for change between sessions, and **refer** at the right speed. Neither book is used here as a source for doses, titration, tapering schedules or treatment choice. Where a book gives a dose, this analysis leaves it out.

**Page convention.** All page numbers below are the **printed** page numbers of each book. The PDF offsets were checked against the printed folios throughout each file:

- Maudsley: printed page = PDF page − 21 (e.g., "Akathisia" printed 114 = PDF 135; "Enhancing medication adherence" printed 897 = PDF 918).
- Stahl: printed page = PDF page − 16 (e.g., chapter 1 opens on printed 1 = PDF 17; chapter 7 opens on printed 283 = PDF 299; Index printed 615 = PDF 631).

---

## 1. Bibliographic blocks

### A. Maudsley

| Field | Value |
|---|---|
| Title | *The Maudsley® Prescribing Guidelines in Psychiatry* |
| Edition | **14th edition** (verified on the title page, PDF p. 4; the preface is dated "London, March 2021") |
| Authors | David M. Taylor, Thomas R. E. Barnes, Allan H. Young |
| Publisher | Wiley Blackwell (John Wiley & Sons Ltd), Chichester / Hoboken |
| Year | 2021 ("This edition first published 2021", PDF p. 5) |
| ISBN | Paperback 9781119772224; ePDF 9781119772248; ePub 9781119772231 |
| Extent | 978 PDF pages; printed text runs to p. 942, with the index from p. 943 |
| Audience as written | Prescribers (psychiatrists, pharmacists, nurse prescribers), with a mild UK emphasis (preface) |
| Use at VIBHA | Safety recognition, monitoring logic, special groups, adherence, discontinuation versus relapse. **Not** a dosing source for students. |

### B. Stahl

| Field | Value |
|---|---|
| Title | *Stahl's Essential Psychopharmacology: Neuroscientific Basis and Practical Applications* |
| Edition | **5th edition** (title page PDF p. 3; imprint "Fifth edition published 2021", PDF p. 8) |
| Author | Stephen M. Stahl |
| Publisher | Cambridge University Press |
| Year | 2021 (copyright line "© Stephen M. Stahl 1996, 2000, 2008, 2013, 2021") |
| ISBN | Hardback 978-1-108-83857-3; Paperback 978-1-108-97163-8 |
| Extent | 640 PDF pages; 13 chapters, printed pp. 1–578, then references (p. 579) and index (p. 615) |
| Note | The PDF's outer cover blurb (PDF p. 1) is the *4th* edition back cover, but the title page and imprint are the 5th. Cite as 5th. |
| Use at VIBHA | Mechanism intuition: synapse, transporters, agonist spectrum, receptor occupancy, why antidepressants are delayed, receptor-to-side-effect logic. Stahl's figures are copyrighted "visual language" and **must not be redrawn or traced**. VIBHA builds its own visuals. |

---

## 2. What VIBHA already has (verified before calling anything "New")

I checked the code and docs before labelling any row. Summary:

**The books are already ingested by the psychopharm knowledge system (drug by drug, not by topic).**
- `scripts/psychopharm/extract-text.ts` lists both books as sources: `maudsley_2021` and `stahl_essential_5th`, alongside Stahl's *Prescriber's Guide* 7th ed. (`stahl_pg_7th`), an older and a preview Prescriber's Guide, Kaplan & Sadock, Fish, Ahuja, DSM-5-TR and ICD-11. The paths point to the owner's laptop, so the session copies are new extractions of the same PDFs.
- `src/lib/psychopharm/sources.ts` registers `maudsley_2021` (14th, 2021, Wiley) and `stahl_essential_5th` (5th, 2021, CUP, scope `mechanism, receptor_targets, class, learning_layer`).
- Text caches exist at `scripts/psychopharm/text/maudsley_2021.txt` and `stahl_essential_5th.txt`. There are per-drug passages: **91 Maudsley** and **65 Stahl-5th** files in `scripts/psychopharm/passages/`.
- `docs/psychopharm/LOCATOR_INDEX.json` has **3,467** Maudsley and **508** Stahl-5th locator hits. However, `KNOWLEDGE_BASE.json` cites Maudsley 26 times and Stahl-5th **0** times. `BOOK_FIELD_ROWS.json` cites Maudsley 38 times and Stahl-5th 0 times. `STUDENT_LAYER.json` comes from the *Prescriber's Guide* 7th, not from either of these books.
- **Conclusion:** both books are already inside the platform as indexed text. Maudsley is used to cross-check dose bands and equivalence tables. Stahl 5th is located but not yet mined. The ingestion is **drug-centric** (one monograph per medicine). The **thematic** chapters that matter most to psychologists have not been turned into teaching: the adverse-effect syndromes, special groups, adherence, discontinuation, smoking and CYP, and Stahl's mechanism chapters 1–2. This analysis targets those chapters.

**Study modules** (`src/content/study/`), each with outcomes, recall, MCQs, viva and a module test:
- `antidepressants` (module 10): classes, onset delay, side effects, serotonin syndrome (including an SS-versus-NMS table and MCQ), discontinuation (FINISH, plus "distinguish from relapse"), hyponatraemia, under-25 suicidality, treatment-resistant depression (including pseudo-resistance and adherence).
- `antipsychotics` (module 11): four dopamine pathways, 60–80% D2 occupancy window, EPS (akathisia linked to suicidality), NMS, metabolic monitoring, special groups (dementia stroke risk), clozapine (agranulocytosis, myocarditis, constipation, smoking and CYP1A2 note with MCQ), depots, rapid tranquillisation, "starting clozapine step by step".
- `stabilisers` (module 12): lithium (levels, toxicity, raisers of level), valproate (teratogenicity), carbamazepine (HLA test MCQ), lamotrigine (SJS, slow titration), pregnancy, benzodiazepines (including a taper plan), insomnia.
- `medicine-profiles` (module 23): card per medicine, side-effect medicines, dangerous combinations.
- `brain` (module 2) §1.1 teaches the synapse in text, including the key/lock analogy for agonist, antagonist and partial agonist. §1.3 covers receptor-to-side-effect tables.

**Practice and tools:** `/practice/medicines` (instant search of `src/lib/meds`); `/tools/psychopharm` (drug pages, compare, and **"Browse by mechanism"** learning layer, with no dose drills); 10 branching scenarios in `src/lib/learn/scenarios.ts`, including **`sc-pharm-1`** (lithium plus ibuprofen, so toxicity) and **`sc-ap-1`** (acute dystonia on haloperidol); module scenario "the summer of lithium" (lithium plus stomach bug); quiz units `src/lib/learn/content/pharm.ts`; Clinic detective; Coach: pharmacology. `docs/transformation/CURRICULUM_MAP.md` already plans a synapse **simulation** (row 127, not built) and an adherence branching scenario where a client stops lithium (row 136, marked New).

**What does not exist (checked by grep):**
- Any interactive synapse, receptor or occupancy UI. No `.tsx` component mentions synapse, reuptake or occupancy.
- A triage-speed drill ("routine / prescriber soon / urgent").
- An akathisia-versus-anxiety differential.
- A conversation-skills activity for adherence.
- Any treatment of **metabolic syndrome** as a named concept (0 hits).
- Hyponatraemia severity thresholds (no "125" anywhere in the modules).
- Clozapine hypersalivation.
- The "quitting smoking while on clozapine" conversation as an activity (it exists only as an MCQ).

**Two problems found while checking (for educators):**
1. **Scope drift into prescribing.** Existing medicine modules contain prescriber content: dose-equivalence tables, "Titration", "A taper plan", "Prescribing rules", "Starting clozapine step by step", outcomes worded "treat"/"manage", and the sentence "Propranolol helps" for akathisia. For a psychologist curriculum this should be re-framed as "what the team does, and what you watch for". The recognition content is good and should stay.
2. **Small discrepancy with Maudsley.** `stabilisers.ts` (line ~36) says the lithium level is taken "about 5 days" after a change. Maudsley Table 2.1 (p. 252) says the level is taken after 7 days. Acute-mania target levels also differ in wording. Recommend removing level-timing detail from the psychologist track, or else aligning it to a named source.

---

## 3. Chapter indexes with page ranges

### 3A. Maudsley (14th ed., 2021), printed pages

| Part / Chapter | Pages | Sections most relevant to psychologists (printed page) |
|---|---|---|
| Front matter | i–xvi | Notes on using the guidelines (xiii); abbreviations (xv) |
| **Part 1: Drug treatment of major psychiatric conditions** | 1–536 | |
| Ch 1 Schizophrenia and related psychoses | 3–246 | Monitoring 38; relative adverse effects, a rough guide 41; response: increase, switch, add or wait 51; LAIs 67–95; **stopping antipsychotics 102**; **Adverse effects 109–189**: EPS 109, **akathisia 114**, tardive dyskinesia 117, weight gain 123, **NMS 131**, catatonia 135, QT 141, lipids 149, diabetes 153, BP 160, **hyponatraemia in psychosis 164**, hyperprolactinaemia 168, sexual dysfunction 172, pneumonia 181, switching 183, VTE 187; **Refractory schizophrenia and clozapine 190–211** (optimising 193, alternatives 198, re-starting after a break 207, community initiation 208); **Clozapine adverse effects 212–246**: common 212, uncommon 217, **serious haematological and cardiovascular 222**, **hypersalivation 227**, **gastrointestinal hypomotility 232**, neutropenia and lithium 236, chemotherapy 242, genetic testing 244 |
| Ch 2 Bipolar disorder | 247–304 | **Lithium 247** (side effects and **toxicity 250–251**, Table 2.1 monitoring 252, **interactions 252–254**); valproate 257; carbamazepine 264; antipsychotics 269; physical monitoring 277; acute mania 279; rapid cycling 285; **bipolar depression 288** (lamotrigine and rash 289); prophylaxis 296; **stopping lithium and mood stabilisers 301** |
| Ch 3 Depression and anxiety disorders | 305–450 | Overview 307; **TRD 317–327**; ketamine 328; psychotic depression 332; **switching 336** (serotonin syndrome severity table 337); **withdrawal symptoms 343–347**; **stopping antidepressants 348**; ECT 353; prophylaxis 374; **interactions 378**; cardiac 383–392; **hyponatraemia 393–397**; prolactin 398; diabetes 401; sexual dysfunction 404; **SSRIs and bleeding 409**; St John's Wort 417; relative adverse effects 421; anxiety spectrum 423; **benzodiazepines 436**; **dependence and discontinuation 440**; disinhibition 448 |
| Ch 4 Addictions and substance misuse | 451–536 | Alcohol 453; delirium tremens 472; opioids 474; nicotine 503; stimulants 511; GHB/GBL 514; **benzodiazepine misuse 517**; SCRAs 520; **street drug and psychotropic interactions 526**; substance misuse in pregnancy 535 |
| **Part 2: Special patient groups** | 537–754 | |
| Ch 5 Children and adolescents | 539–600 | **Principles 539**; **depression 541–546** (suicidality 545); bipolar 547; psychosis 554; anxiety 556; OCD/BDD 561; PTSD 567; ADHD 569; autism 578; tics 587; melatonin 593; RT 596 |
| Ch 6 Older people | 601–678 | **General principles 601** (pharmacodynamic sensitivity, falls, clozapine neutropenia, stroke, SSRI bleeding); dementia 604; safer prescribing in physical conditions 631; **BPSD 644**; **covert administration 667**; depression in older people 673 |
| Ch 7 Pregnancy and breastfeeding | 679–722 | Drug choice 679; **what to include in discussions with pregnant women 681** (with postpartum psychosis risk); breastfeeding 702 |
| Ch 8 Hepatic and renal impairment | 723–754 | Hepatic 723 (lamotrigine rash caution in the hepatic table, 728); renal 735 |
| **Part 3: Specialist conditions** | 755–830 | Ch 9: BPD 757, eating disorders 761, delirium 767. Ch 10: HIV 777, epilepsy 785, 22q11.2 794, **learning disabilities 797**, Huntington's 803, MS 808, Parkinson's 814, AF 819, bariatric surgery 822, end of life 829 |
| **Part 4: Other aspects** | 831–942 | Ch 11 Pharmacokinetics 833: plasma levels 833, **CYP function 851**, **smoking 856**, **alcohol interactions 860**. Ch 12 Other substances: **caffeine 865**, nicotine 871. Ch 13 Special conditions: **overdose 875**, **driving 883**, surgery 889. Ch 14 Miscellany: **enhancing medication adherence 897**, **re-starting after non-compliance 905**, biochemical/haematological effects 907, **psychiatric side effects of non-psychotropics 917**, off-label 923, Mental Health Act (England & Wales) 927 |
| Index | 943– | |

### 3B. Stahl (5th ed., 2021), printed pages

| Chapter | Pages | Key sections (printed page) |
|---|---|---|
| Preface, CME | ix–xiii | Recommends reading the graphics first, then the text (programmed-learning design) |
| **1 Chemical Neurotransmission** | 1–28 | Neuron structure 2; neurotransmitters 5; **classic, retrograde and volume neurotransmission 6**; signal transduction 9; second messengers 11; gene expression 15–18; epigenetics 23; RNA 26 |
| **2 Transporters, Receptors, and Enzymes as Targets** | 29–50 | Transporters 29; **monoamine transporters (SERT, NET, DAT) 31**; vesicular transporters 35; **G-protein-linked receptors 36**; **the agonist spectrum 36–45** (full agonist ~38, antagonists ~41, **partial agonists 42–43**, inverse agonists 44); enzymes 45; **CYP450 49** |
| 3 Ion Channels as Targets | 51–76 | Ligand-gated channels; agonist spectrum at ion channels 57–62; **desensitisation states 63–64**; benzodiazepine allosteric site ~66; voltage-gated channels |
| 4 Psychosis, Schizophrenia, and Dopamine/Serotonin/Glutamate | 77–158 | Positive and negative symptoms; dopamine pathways; glutamate (NMDA) hypothesis; serotonin hypothesis; neurodevelopment and synapse pruning ~149–153 |
| **5 Targeting D2 and 5HT Receptors ("Antipsychotics")** | 159–243 | Mesolimbic/mesocortical D2 and secondary negative symptoms 162–163; **prolactin 164**; **motor side effects 165**: drug-induced parkinsonism 166, acute dystonia 169, **akathisia 169**, **NMS 169**, **tardive dyskinesia 170**; 5HT2A regulation of dopamine 183–184; **D2 partial agonism 189–193**; therapeutic actions and side effects 195–197; **cardiometabolic actions 198–201** (metabolic monitoring tool kit ~199; **occupancy convention 60–80% p. 201**); first-generation drugs 201–203; "pines", "dones", "pips and a rip" 204–240 (**clozapine ~224–225**); future treatments 241 |
| 6 Mood Disorders; NE and GABA | 244–282 | Mood spectrum and mixed features; NE and GABA networks; **monoamine hypothesis and receptor downregulation 266–267**; neurotrophic hypothesis |
| **7 Treatments for Mood Disorders ("Antidepressants", "Mood Stabilizers")** | 283–358 | Response/remission definitions 284; how well reuptake blockers work 285; "mood stabilizer" as a label 288; **SSRIs 289** (**5HT1A autoreceptor desensitisation and delayed action 290–292**); SPARIs 296; SNRIs 298; bupropion 303; agomelatine 306; mirtazapine 308; SARIs 311; vortioxetine 315; neuroactive steroids 320; **treatment resistance 323–337** (genetic testing 323, augmentation 325, second-line 333); bipolar 338; **lithium 345**; anticonvulsants 346–353 (**lamotrigine rash and SJS 352**); combinations 353; future treatments incl. hallucinogen-assisted psychotherapy 355 |
| 8 Anxiety, Trauma, and Treatment | 359–378 | Fear circuits (amygdala); benzodiazepines; **combining psychotherapy and medication (fear extinction, reconsolidation)** |
| 9 Chronic Pain | 379–400 | Pain pathways; SNRIs and α2δ ligands |
| 10 Sleep and Wakefulness | 401–448 | Histamine, orexin; hypnotics; **receptor-occupancy threshold over the night (~80% p. 427–428)** |
| 11 ADHD | 449–485 | Stimulant occupancy, abuse liability |
| 12 Dementia | 486–537 | Acetylcholine; BPSD; agitation |
| 13 Impulsivity, Compulsivity, and Addiction | 538–578 | Reward circuitry; substances; behavioural addictions |
| References / Index | 579 / 615 | |

---

## 4. Opportunities table

Status key: **Taught** = already covered adequately (a link or reuse is enough). **Expand** = present but thin, prescriber-framed, or text-only. **New** = not found anywhere in modules, scenarios, quizzes or tools (verified by grep, see §2).
Level: F = Foundation, I = Intermediate, A = Advanced.
Evidence: well established / established, details debated / emerging / theoretical.
Sensitivity: risk of harm if taught wrongly, or emotionally heavy content.

| # | Concept (psychologist framing) | Book ref (chapter, printed page) | VIBHA module | Status (verified) | Best format and why | Level | Evidence | Sensitivity |
|---|---|---|---|---|---|---|---|---|
| 1 | **Synapse basics: reuptake, transporter blockade** (why an SSRI raises synaptic serotonin) | Stahl ch 1, 6–9; ch 2, 31–34 | `brain` 1.1, `antidepressants` 1.1 | Expand (text and key/lock analogy only) | **synapse-sim**: students change one variable and watch the transmitter level change. Mechanism sticks when it is seen and manipulated, not read | F | Well established | Low |
| 2 | **Agonist spectrum: full, partial, antagonist, inverse** | Stahl ch 2, 36–45; ch 3, 57–62 | `brain` 1.1, `antipsychotics` 1.1 | Expand (one-line analogy; inverse agonist absent) | **synapse-sim** "dial" states. Partial agonism is a relative idea (it depends on how much natural transmitter is present), so only an interactive comparison shows it honestly | F→I | Well established | Low |
| 3 | **Receptor occupancy and the "window"** (why more is not better; EPS above the window) | Stahl ch 5, 195, 201; Maudsley ch 1 (minimum effective doses 9; for concept only) | `antipsychotics` 1.1 | Taught as a fact (60–80%), not as an idea | **synapse-sim** occupancy slider with benefit and EPS bands. Shows the shape of the relationship without any dose | I | Established | Low (no doses shown) |
| 4 | **Why antidepressants take weeks** (autoreceptor desensitisation; downregulation) | Stahl ch 6, 266–267; ch 7, 290–292 | `antidepressants` 1.2 | Expand (states the delay; no mechanism visual) | **synapse-sim** timeline (day 1 → week 2–4). Explaining the delay is a core psychoeducation task that supports adherence | I | Established, details debated (hypothesis-level) | Low |
| 5 | **Receptor → side effect logic** (H1 sedation and weight; M1 dry mouth, constipation, confusion; α1 dizziness; D2 motor and prolactin) | Stahl ch 5, 164–170, 195–201 (Fig 5-8 at 169) | `brain` 1.3, `antipsychotics` 1.1 | Taught | Reuse. Add a **matching** drill only if analytics show confusion. Do not duplicate | F | Well established | Low |
| 6 | **Akathisia versus anxiety or agitation** | Maudsley ch 1, 114; Stahl ch 5, 169 | `antipsychotics` 2.1 | Expand (described; no discrimination practice) | **differential** pairs. Psychologists see this misread as "anxiety" or "resistance" in therapy; the cue is timing after a medicine change plus an inner urge to move | I | Well established | **High** (suicidality association postulated, Maudsley 114) |
| 7 | **Other EPS: dystonia, parkinsonism, tardive dyskinesia** | Maudsley ch 1, 109, 117; Stahl ch 5, 165–170 | `antipsychotics` 2.1 | Taught (dystonia also in `sc-ap-1`) | Fold TD and parkinsonism into the **red-flag-triage** bank as "prescriber soon" items. Dystonia is covered already | F | Well established | Medium (stigma from visible movements) |
| 8 | **NMS recognition** | Maudsley ch 1, 131–132 (Table 1.19); Stahl ch 5, 169 | `antipsychotics` 2.2 | Taught (prescriber-framed treatment steps) | **red-flag-triage** plus **differential**. Strip treatment steps from the psychologist track; keep features, risk moments and "same-day emergency" | I | Well established | **High** (fatal if missed) |
| 9 | **Serotonin syndrome and its severity gradient** | Maudsley ch 3, 337 (severity table), 378–379 | `antidepressants` 3.1 | Taught | **red-flag-triage** items, plus mild-to-severe gradient in **differential**. Add the "second prescriber" scenario (a GP or another specialist adds a serotonergic medicine) | I | Well established | **High** |
| 10 | **NMS vs serotonin syndrome vs lithium toxicity vs anticholinergic toxicity** | Maudsley 131–132, 337, 250–251; Stahl 169 | `antidepressants` 3.1, `antipsychotics` 2.2, `stabilisers` 1.1 | Expand (only SS vs NMS exists) | **differential** with four look-alikes. The psychologist does not need to settle the diagnosis, only to see "sick and on medicine = same day" | A | Well established | High |
| 11 | **Lithium toxicity and its triggers** (dehydration, low salt, NSAIDs, diuretics, ACE inhibitors) | Maudsley ch 2, 250–254 (Table 2.2) | `stabilisers` 1.1 | Taught (plus `sc-pharm-1` and "summer of lithium") | **red-flag-triage** with *new* triggers (diuretic, fasting in heat, low-salt diet) to avoid duplicating the two existing cases | I | Well established | **High** |
| 12 | **Hyponatraemia (antidepressants, carbamazepine, psychosis)** | Maudsley ch 3, 393–395 (Table 3.17); ch 1, 164; ch 2, 254 | `antidepressants` 2.6 | Expand (no severity, timing or risk-factor list) | **red-flag-triage**. Older woman, first weeks, confusion or falls. Timing ("highest in the first 2–4 weeks", p. 394) is a teachable monitoring window | I | Well established | High (older adults) |
| 13 | **Metabolic syndrome on antipsychotics** (weight, glucose, lipids, BP; DKA rare but serious) | Stahl ch 5, 198–201; Maudsley ch 1, 123, 149, 153, 160 | `antipsychotics` 2.3 | Expand (monitoring list; "metabolic syndrome" never named; behavioural role absent) | **branching-case** where the psychologist links weight distress, adherence and lifestyle work. This is the psychologist's strongest contribution (behaviour change) | I | Well established | Medium (body image, shame) |
| 14 | **Clozapine monitoring: neutropenia/agranulocytosis, myocarditis, constipation (CIGH), hypersalivation, smoking** | Maudsley ch 1, 212–236; ch 11, 856; Stahl ch 5, ~224–225 | `antipsychotics` 3.1, 3.4 | Taught (prescriber-framed); hypersalivation New; smoking only as MCQ | **branching-case** across months, plus **red-flag-triage** items. Constipation is under-recognised and has a higher case fatality than blood problems (Maudsley 232) | I→A | Well established | **High** |
| 15 | **Lamotrigine rash and SJS** | Maudsley ch 2, 289; ch 8 table, 728; Stahl ch 7, 352 | `stabilisers` 1.4 | Taught | **red-flag-triage**, including the "missed doses then restart" trap (rash risk tracks the speed of increase, Maudsley 289) | I | Well established | High |
| 16 | **Discontinuation symptoms vs relapse** | Maudsley ch 3, 343–348 (Fig 3.3, Tables 3.8–3.9) | `antidepressants` 3.2 | Taught (FINISH plus one rule) | **differential** with paired vignettes (timing, new symptoms, response to restarting). High-yield for therapists, who often see a client after they stop on their own | I | Well established (incidence estimates debated) | Medium |
| 17 | **Benzodiazepine dependence and discontinuation; disinhibition** | Maudsley ch 3, 436–449; ch 4, 517 | `stabilisers` 2.1, 2.4 | Taught (prescriber taper plan) | Reframe the taper plan as "supporting a client through a taper". Add a CBT-for-insomnia link. No new activity in this pass | I | Well established | Medium |
| 18 | **Adherence: rates, hidden non-adherence, collaborative conversations** | Maudsley ch 14, 897–906 | `antipsychotics` 1.3, `stabilisers`; CURRICULUM_MAP row 136 | **New** as a skill (facts only, in TRD context) | **adherence-talk**: choose-your-response conversation scored on exploring beliefs before persuading. The psychologist's core contribution, and practice beats reading | I | Well established (rates); intervention evidence mixed (Maudsley 898) | Medium (autonomy, capacity) |
| 19 | **Treatment resistance concepts: pseudo-resistance, adequacy, clozapine for refractory schizophrenia** | Maudsley ch 1, 51, 190–211; ch 3, 317–327; Stahl ch 7, 323–337 | `antidepressants` 3.4, `antipsychotics` 3.1 | Taught (TRD); refractory schizophrenia prescriber-framed | **branching-case**: what the psychologist checks (diagnosis, substance, adherence, therapy dose, social stressors) before "resistant" is accepted | A | Established | Medium |
| 20 | **Drug interactions at concept level** (enzyme induction and inhibition; smoking and CYP1A2; serotonergic stacking; sodium handling; alcohol plus sedatives; street drugs) | Maudsley ch 11, 851–863; ch 3, 378; ch 2, 252–254; ch 4, 526; Stahl ch 2, 49 | `medicine-profiles` 3.3, `brain` | Expand (lists exist; no mechanism grouping) | **matching**: situation → interaction family → what the psychologist does. Teaches families of risk, not tables | I | Well established | Medium |
| 21 | **Special groups: pregnancy and postpartum** (discussion content; stopping abruptly is also risky; postpartum relapse in bipolar) | Maudsley ch 7, 679–682 | `stabilisers` 1.6 | Taught (drug risks); conversation content Expand | **matching** plus triage items. Psychologists are often first to hear "I'm pregnant, I've stopped everything" | I | Well established | **High** |
| 22 | **Special groups: older people** (sensitivity, falls, hyponatraemia, stroke with antipsychotics in dementia, covert medication) | Maudsley ch 6, 601, 644, 667 | `antipsychotics` 1.4, `neurocognitive` | Taught (stroke); falls and sensitivity Expand | **matching** plus triage items | I | Well established | Medium (covert administration is an ethics topic) |
| 23 | **Special groups: children and young people** (activation and suicidality early on SSRIs; target symptoms, not diagnoses) | Maudsley ch 5, 539, 545 | `child`, `antidepressants` 2.6 | Taught (under-25 warning) | Triage item plus **matching**; link to the suicide module protocol | I | Established, details debated | **High** |
| 24 | **Overdose and toxicity** (relative danger by class, for risk formulation) | Maudsley ch 13, 875–882 | `suicide`, `antidepressants` | Expand | Short **matching** (class → relative overdose risk). Use for means-safety conversations. Defer to the next pass with the suicide-module owner | I | Well established | **High** (method information: keep relative, no amounts) |
| 25 | **Driving and psychotropics** | Maudsley ch 13, 883 | `medicine-profiles` | New | One card or FAQ; not an activity | F | Established | Low |
| 26 | **Psychiatric side effects of non-psychiatric medicines** (e.g., steroids) | Maudsley ch 14, 917 | `assessment`, `depression` | New | **differential** extension in a later pass: "is this mood change a medicine effect?" | I | Established | Medium |
| 27 | **Combining psychotherapy and medication in anxiety** (fear extinction) | Stahl ch 8, 359–378 | `anxiety`, `therapies` | Expand | Concept card linking exposure therapy to extinction learning. Not part of this activity set | A | Established, details debated | Low |
| 28 | **Caffeine, nicotine and mental state** | Maudsley ch 12, 865–874 | `anxiety`, `substance` | New | Brief psychoeducation card | F | Established | Low |

---

## 5. Activities (in `maudsley-stahl-activities.json`)

1. `ms-act-01` **Red-flag triage bank** (red-flag-triage, 27 items): routine / discuss with prescriber soon / urgent same-day medical review. Covers NMS, serotonin syndrome, lithium toxicity (new triggers), clozapine (neutropenia, myocarditis, constipation, smoking), lamotrigine SJS, hyponatraemia, akathisia with suicidal talk, TD, metabolic warning signs, discontinuation, young people, pregnancy and postpartum, older adults.
2. `ms-act-02` **Synapse lab: reuptake and the agonist dial** (synapse-sim).
3. `ms-act-03` **Occupancy window** (synapse-sim, no doses).
4. `ms-act-04` **Why weeks? The antidepressant timeline** (synapse-sim).
5. `ms-act-05` **Four look-alike emergencies** (differential: NMS, serotonin syndrome, lithium toxicity, anticholinergic toxicity).
6. `ms-act-06` **Akathisia or anxiety?** (differential).
7. `ms-act-07` **Stopping or slipping? Discontinuation versus relapse** (differential).
8. `ms-act-08` **"I've stopped my lithium"** (adherence-talk).
9. `ms-act-09` **Clozapine year one** (branching-case).
10. `ms-act-10` **Interaction families** (matching).
11. `ms-act-11` **Special groups sorter** (matching).
12. `ms-act-12` **"Nothing works": checking before calling it resistant** (branching-case).

Each activity's `content` is original VIBHA wording with fictional clients and Indian context where natural. Numbers in explanations carry a printed page. No dosing, titration or tapering instruction appears anywhere.

---

## 6. Review flags (for educator and clinical sign-off)

- **Clinical sign-off required** on the triage bank before release. Triage categories are teaching defaults. Local services (and the client's own care plan) can set different thresholds. Every item tells the student: when in doubt, escalate; if the person is very unwell, call emergency services.
- **Scope language.** Item explanations say what the *team* will do (for example, "the doctor will check a blood count") without telling the student to do it. This keeps psychologists in role.
- **Indian context.** Brand names were avoided. Some Maudsley content is UK-specific (Mental Health Act, clozapine monitoring services). Indian clozapine monitoring arrangements and access vary, so a local reviewer should adapt the "who to call" wording.
- **Figures.** Stahl's figures are copyrighted. The synapse-sim specs describe states for VIBHA's own Neo-Brutalist visuals; none are traced from Stahl.
- **Existing-module fixes** (see §2): prescriber drift and the lithium-level timing discrepancy.
- **Suicide-adjacent content** (akathisia, young people, overdose) should be cross-linked with the `suicide` module's risk protocol, and reviewed together with it.
