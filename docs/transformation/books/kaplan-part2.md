# Kaplan & Sadock's Synopsis of Psychiatry (12th ed.), Part 2: curriculum opportunities

Analyst pass over the second half of the book for the VIBHA School of Psychology LMS.
Companion file: `kaplan-part2-activities.json` (14 ready-to-build activities).

## 1. Bibliographic block and page convention

| Field | Value |
|---|---|
| Title | Kaplan & Sadock's Synopsis of Psychiatry, 12th edition |
| Editors | Robert Boland, Marcia L. Verduin; Pedro Ruiz (senior consulting editor) |
| Publisher | Wolters Kluwer |
| Source analysed | PDF part 2 of 2 ("1601-3768"): global PDF pages 1601-3768; file pages 1-2169 |
| Text extraction | `pdftotext -layout`, pages split on form feed |
| Chapters covered | end of Ch 15 (Sleep) through Ch 35 (History), then timeline table and index |

**Page convention.** The extracted text carries **no printed page numbers in the running heads**, so all
references below are **PDF pages**. `p.N` means *file 2, PDF page N*; the global PDF page is **N + 1600**
(written `gN` where it matters, e.g. `p.159 / g1759`). The book's own index (file 2 pp. ~1920-2169) uses
printed page numbers that do not match PDF pages; do not mix the two.

**Method.** Chapter starts were located from the chapter-number banners and ALL-CAPS section heads; every
"Status" below was checked by grepping `src/content/study/*.ts` for the concept (terms and synonyms)
before marking it Taught / Expand / New. Clinical modules already cover the core disorders well, so
this half of the book is most valuable for **process skills** (emergency, liaison, end-of-life, ethics,
therapy technique) and **less-common categories** the modules skip.

## 2. Chapter index (file 2 PDF pages; add 1600 for global)

| Ch | Title | File pp. | Global pp. | Relevance to VIBHA |
|---|---|---|---|---|
| 15 (tail) | Sleep-wake disorders (RLS, PLMD, bruxism, clinical tools, treatment) | 1-42 | 1601-1642 | Low (taught in `more-disorders` 2.x) |
| 16 | Human sexuality and sexual dysfunctions; paraphilic disorders; normal sexuality | 43-140 | 1643-1740 | Medium (taught 5.1/5.3) |
| 17 | Gender dysphoria, gender identity | 141-157 | 1741-1757 | Medium (taught 5.2) |
| 18 | Disruptive, impulse-control and conduct disorders (IED, kleptomania, pyromania) | 158-177 | 1758-1777 | **High - not taught** |
| 19 | Personality disorders | 178-239 | 1778-1839 | Medium (taught; vignettes useful) |
| 20 | Other conditions that may be a focus of clinical attention (malingering, bereavement, occupational, adult antisocial, religious/spiritual, acculturation, phase of life, noncompliance, relational) | 240-274 | 1840-1874 | **High - mostly not taught** |
| 21 | Psychopharmacology: general principles 275-325; 21.1 antipsychotics 326; 21.2 antidepressants 374; 21.3 mood stabilisers 447; 21.4 anxiolytics 512; 21.5 sleep drugs 542; 21.6 stimulants 551; 21.7 substance-use drugs 564; 21.8 cognitive 596; 21.9 sexual 603; 21.10 side-effect drugs 611; 21.11 supplements 637 | 275-693 | 1875-2293 | Medium (drugs taught; principles partly new) |
| 22 | Other somatic therapies (ECT 694, other brain stimulation 715, neurosurgery/DBS 726) | 694-742 | 2294-2342 | Low (taught `depression` 4.3) |
| 23 | Psychotherapy (psychoanalysis 743, brief psychodynamic 769, group/psychodrama 777, family and couples 792, DBT 801, biofeedback 805, cognitive 812, behaviour 821, hypnosis 835, IPT 842, narrative 856, combined 861, MBT 871, psychoeducation 874) | 743-891 | 2343-2491 | **High - technique depth** |
| 24 | Psychiatric rehabilitation (supported employment 892) and genetic counselling (900) | 892-911 | 2492-2511 | Medium |
| 25 | Consultation to other disciplines: 25.1 C-L psychiatry 912; 25.2 geriatric 928; 25.3 emergencies 947 (children 963-1002) | 912-1002 | 2512-2602 | **High - largely new** |
| 26 | Level of care (inpatient, partial, IOP, outpatient, residential) | 1003-1011 | 2603-2611 | Low-medium (US-system framing) |
| 27 | Ethics and professionalism (principles 1012, specific issues incl. sexual and nonsexual boundary violations 1014-1016) | 1012-1033 | 2612-2633 | High (taught; expand with dilemmas) |
| 28 | Forensic and legal issues (malpractice 1034, split treatment 1036, privilege 1039, Tarasoff 1043, hospitalisation 1045, restraint 1051, consent 1052, custody 1053, capacity 1054, criminal law/M'Naghten 1056) | 1034-1065 | 2634-2665 | Medium (US law; map to MHCA 2017) |
| 29 | End-of-life: 29.1 death, dying, bereavement 1066; 29.2 palliative care 1087; 29.3 euthanasia and PAS 1118 | 1066-1128 | 2666-2728 | **High - not taught** |
| 30 | Community psychiatry | 1129-1159 | 2729-2759 | Low-medium |
| 31 | Global and cultural issues (treatment gap 1162, resources 1165, stigma 1171) | 1160-1181 | 2760-2781 | Medium |
| 32 | Normal development and aging (32.1 child 1182; 32.2 adulthood 1253; 32.3 old age 1277) | 1182-1304 | 2782-2904 | Low (taught `defences` 3.x) |
| 33 | Contributions from the neurosciences | 1305-1561 | 2905-3161 | Low (taught `brain`) |
| 34 | Behavioural and social sciences (Piaget 1562, attachment 1574, learning 1583, memory 1608, normality 1644, sociobiology 1663, transcultural psychiatry 1684, culture-bound syndromes 1701, Freud 1715, other schools 1784, positive psychology 1828) | 1562-1848 | 3162-3448 | Medium (culture sections new) |
| 35 | A brief history of psychiatry | 1849-~1875 | 3449-~3475 | Low (enrichment) |
| - | Historical timeline table, then index | ~1876-2169 | ~3476-3768 | Reference only |

Note: child and adolescent *disorders* (ADHD, autism, etc.) are in Part 1 of the book; Part 2 has only
child *emergencies* (Ch 25.3) and *normal development* (Ch 32).

## 3. Opportunities by chapter

Legend - **Type**: C concept, Ph phenomenon, Dx diagnostic distinction, Tx treatment, Sk clinical skill,
Eth ethics/law, V vignette. **Status**: Taught (already covered; at most a new activity format),
Expand (partly covered), New (absent from all modules). **Level**: F foundation, I intermediate,
A advanced. **Sens**: sensitivity flag (none / low / med / high + reason).

### Ch 18 - Impulse-control disorders (pp. 158-177)

Grep result: `intermittent explosive`, `kleptomania`, `pyromania` - zero hits in any module.

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence as the book presents it | Sens |
|---|---|---|---|---|---|---|---|---|
| Shared arc of impulse-control disorders: rising tension, act, relief, then remorse and secrecy | Ph | 18, p.158 | more-disorders | New | Flashcards + reflection: a single cycle students can reuse across IED, kleptomania, gambling | F | Descriptive clinical account | low |
| Intermittent explosive disorder: discrete outbursts out of proportion, rapid remission, genuine regret, no aggression between episodes | Dx | 18, pp.158-160 (case p.159) | more-disorders / personality | New | **Differential game** (vs ASPD, BPD, intoxication, epilepsy, mania, psychosis, frontal lesion) - diagnosis is by exclusion | I | Book lists the exclusions explicitly (p.166) | low |
| Kleptomania vs ordinary theft (object not needed, act itself is the goal, items hidden/returned) | Dx | 18, p.160 | more-disorders | New | Matching / sort: motive cues | F | Descriptive; case "Jane" p.160 | med (legal) |
| Pyromania vs arson (no gain, revenge, ideology or concealment) | Dx | 18, pp.164-167 (Table 18-3) | more-disorders | New | Sort: "motive excludes pyromania" cards | I | DSM-5 vs ICD-10 table p.166-167 | med |
| Impulse vs compulsion: pleasure-seeking vs ego-dystonic; overlap acknowledged | C | 18, p.166 | ocd (2.4) | Expand | Sort task paired with OCD spectrum; book stresses the line is blurry | I | Conceptual; book notes exceptions both ways | none |
| Work-up for aggression: bloods, toxicology, syphilis serology, MRI frontal changes | Sk | 18, p.165 | more-disorders | New | Treatment-planning discussion | I | Recommended tests listed, no outcome data | none |
| IED treatment: combined drugs + therapy; anticonvulsants "mixed results"; SSRIs, lithium, beta-blockers reported; countertransference and limit-setting hard | Tx | 18, pp.171-172 | more-disorders | New | Treatment-planning discussion (weak evidence = good debate) | A | Book presents mostly case reports/small series; psychosurgery "no evidence" | low |
| Kleptomania treatment: insight-oriented therapy if guilt motivates; CBT case series; one controlled antidepressant trial negative | Tx | 18, p.172 | more-disorders | New | Group debate on thin evidence | A | Case reports; small open-label naltrexone data | low |

### Ch 19 - Personality disorders (pp. 178-239)

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Cluster descriptions, differential, comorbidity, course | Dx | 19, pp.178-222 | personality | Taught | Use book vignettes only as models for new original cases | I | Clinical + DSM/ICD tables | med (labelling) |
| Personality vignettes for "telling apart" drills | V | 19, pp.181-205 | personality (2.7) | Expand | Differential game with 6 short original cases | I | Illustrative cases | med |

### Ch 20 - Other conditions that may be a focus of clinical attention (pp. 240-274)

Grep: `acculturation`, `phase of life`, `religious or spiritual problem`, `relational problem` - zero hits.
`malingering` is taught in six modules; `adherence` widely mentioned but never as a clinical focus.

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Malingering: four red flags (medicolegal context, mismatch claim vs findings, poor cooperation, ASPD) | Dx | 20, p.241; case p.242 | more-disorders (3.2) | Taught/Expand | Differential with forensic slant; book case of inconsistent "memory loss" p.242 | I | Clinical heuristics, not validated cut-offs | med (accusation harm) |
| Table 20-1: Z-code style "conditions" (relational, abuse/neglect, educational, occupational, housing, legal) | C | 20, p.242ff | case-sheet (2.2) | New | Matching: complaint -> correct non-disorder code; teaches that not all distress is a disorder | F | Classification list | none |
| Religious or spiritual problem; separating faith experience from psychopathology | Dx | 20, p.259 | interview-mse (2.12) | New | Reflection + branching case (Indian devotional practice vs grandiosity) | I | Clinical guidance; case p.259 | **high (religion)** |
| Acculturation problem and culture shock; young adapt faster | Ph | 20, pp.260-261 | therapies (3.4) | New | Reflection / role-play: hostel student from another state | F | Descriptive | med |
| Phase-of-life problems; protective factors (flexibility, mature defences, sublimation) | C | 20, pp.262-263 | defences (3.5) | New | Reflection journal | F | Descriptive | low |
| Noncompliance with treatment as a focus of attention (side effects, cost, values, denial) | Sk | 20, p.263 | antipsychotics / stabilisers | Expand | **Therapy-skill practice** (respond to "I want to stop my tablets") | I | Listed causes; no data | low |
| Relational problems: distress in a relational unit can precede or follow illness | C | 20, p.264 | therapies (3.3) | Expand | Case discussion with family-therapy lens | I | Conceptual | med (family) |

### Ch 21 - Psychopharmacology (pp. 275-693)

Drug-by-drug content is thoroughly taught (`antidepressants`, `antipsychotics`, `stabilisers`, `medicine-profiles`).
Gaps are in the *general principles* section. Grep: `nocebo` 0 hits; `placebo` 1 module.

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Drug selection: drug factors, side effects, patient factors | Sk | 21, pp.276-307 | medicine-profiles | Taught | - | I | Clinical principles | none |
| Informed consent and patient education; patient preference respected unless clear efficacy/safety advantage | Eth/Sk | 21, p.308 | antidepressants (3.3) | Expand | Therapy-skill role-play: explaining a medicine | I | Principle statement | low |
| Combined psychotherapy and pharmacotherapy | Tx | 21, p.318; 23, p.861 | therapies | Expand | Treatment-planning discussion | I | Principles and practical issues described; verify any efficacy claim at pp.318, 861 before quoting | none |
| Special populations (children, elderly, pregnancy, medically ill) | Sk | 21, pp.319-323 | brain (3.2) | Taught | - | I | - | low |
| Placebo response varies by disorder; nocebo phenomenon; placebo without consent damages trust | C/Eth | 21, pp.325-326 | antidepressants (1.2) | Expand | Ethics dilemma ("can I give a sugar pill?") + flashcards | I | Book gives a placebo-response figure for some anxiety/depression samples (p.326) - quote only with page | low |
| Lithium toxicity, clozapine, serotonin syndrome details | Tx | 21, pp.342-345, 459-462, 390-393 | stabilisers, antipsychotics | Taught | - | I | - | none |

### Ch 22 - Other somatic therapies (pp. 694-742)

ECT, rTMS and DBS are taught in `depression` 4.3. No new unit needed; use pp.694-714 to verify module facts.

### Ch 23 - Psychotherapy (pp. 743-891)

Grep: Yalom factors, family/structural, DBT chain analysis, IPT role disputes, narrative, biofeedback,
hypnosis, MBT (one table row in `personality`) are all present; `Malan`/`Sifneos`/`Davanloo` 0 hits;
`Mann` only as Hindi word; `psychodrama` 0 hits.

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Psychoanalytic process: recollection, repetition, working through; indications | C | 23, pp.743-768 | therapies (3.1) | Taught | Flashcards only | I | Theory | none |
| Brief psychodynamic models: Malan (focal, ~20-30 sessions, set end date), Mann (exactly 12 sessions, central issue), Sifneos (STAPP, strict selection), Davanloo (broad, anxiety-provoking) | Tx | 23, pp.769-777 | therapies (3.1) | **New** | **Matching** model to defining feature; selection criteria as a sort | A | Book describes models and selection criteria; Malan session numbers p.771 | none |
| Selection criteria for brief dynamic work (circumscribed complaint, one give-and-take relationship, psychological mindedness, motivation, response to trial interpretation) | Sk | 23, pp.772, 774 | therapies | New | Branching case: "is this client suitable?" | A | Clinical criteria | low |
| Dynamic formulation laid out as life problems / dynamics / pathogenic foci (case "Ana") | Sk | 23, pp.772-774 | case-sheet (2.1) | Expand | Formulation-writing exercise, compare with 5P | A | Single case | med (orphanage, grief) |
| Group therapy: 20 therapeutic factors (Table 23-5), group as microcosm; inpatient groups (heterogeneity, rapid turnover); psychodrama | Tx | 23, pp.777-791 | therapies (3.3) | Expand | Matching factor -> group moment; reflection after peer role-play | I | Table of factors (p.782) | low |
| Family and couples therapy models | Tx | 23, pp.792-800 | therapies (3.3) | Taught | Role-play (joint family, Indian context) | I | - | med |
| DBT | Tx | 23, pp.801-805 | therapies (2.5), personality | Taught | - | I | - | med |
| Cognitive and behaviour therapy | Tx | 23, pp.812-835 | therapies (2.1-2.4) | Taught | - | I | - | none |
| IPT phases: initial (1-5: name syndrome, interpersonal inventory, choose problem area), middle (6-15), termination (16-20: grief over ending, relapse signs) | Tx | 23, p.844 (Table 23-13) | therapies (3.2) | Expand | **Sort** tasks into phases | I | Manualised structure | none |
| Narrative psychotherapy | Tx | 23, pp.856-860 | therapies | Taught | - | I | - | none |
| Mentalization-based treatment: collaborative, curious stance; non-mentalizing cycles; shared formulation; designed for BPD, may not suit psychosis | Tx | 23, pp.871-874 | personality (3.1) | Expand | **Therapy-skill**: mentalizing vs interpreting vs reassuring responses | A | Book reports trials in severe BPD with high comorbidity (p.874) | med (self-harm) |
| Psychoeducational interventions | Tx | 23, p.874ff | psychosis, bipolar | Taught | - | F | - | none |

### Ch 24 - Rehabilitation and genetic counselling (pp. 892-911)

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Supported employment: no work-readiness screening, no sheltered step, rapid job search, ongoing support (case "Antonio") | Tx | 24, pp.892-893 | psychosis (2.3) | Expand | Therapy-skill: motivational conversation about part-time work | I | Program principles described; case illustration p.893 | low |
| Genetic counselling in psychiatry | Sk | 24, pp.900-911 | brain / psychosis | New | Role-play: family asks "will my child get it?" | A | Read pp.900-911 before writing numbers | med |

### Ch 25.1 - Consultation-liaison psychiatry (pp. 912-927)

Grep: `consultation-liaison`/`liaison` only in `suicide`; `psycho-oncology` 0.

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Types of C-L problem: reaction to illness, complication of treatment, psychological factors causing symptoms, capacity, pre-transplant (Table 25-1) | C | 25, p.915 | case-sheet / depression (3.3) | New | Matching referral -> category | I | Classification table | none |
| Psychiatric illness worsens medical outcomes (cardiac, diabetes, stroke, delirium) | C | 25, p.916 | depression (3.3) | Expand | Flashcards | F | Book states associations; cites a prevalence range (p.915) | none |
| C-L evaluation ends with a written report and a conversation with the referring doctor | Sk | 25, p.917 | case-sheet (2.5) | Expand | Writing exercise: a 6-line consult note | I | Practice guidance | none |
| Common ward problems: suicide risk in medically ill, hallucinations (DTs day 3-4, ICU), insomnia from pain, confusion, "no physiologic basis" (conversion vs somatic symptom vs factitious vs malingering) | Dx | 25, pp.918-920 | neurocognitive, more-disorders | Expand | **Differential game**: four ward referrals | I | Clinical teaching | med |
| Delirium causes needing urgent action (Table 25-2: hypoglycaemia, sodium, calcium, hypoxia, Wernicke - thiamine before glucose, thyroid) | Dx | 25, pp.921-922 | neurocognitive (1.2) | Taught | Matching clue -> cause | I | Table | none |
| ICU, dialysis, surgery, oncology special situations | Ph | 25, pp.920-927 | depression (3.3) | New | Reflection | I | Descriptive | med |

### Ch 25.2 - Geriatric psychiatry (pp. 928-946)

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Late-life depression: more somatic, melancholic, self-accusatory | Ph | 25, p.934 | depression | Taught | - | I | - | low |
| Depression-related cognitive dysfunction ("pseudodementia"): variable attention, "I don't know", recall worse than recognition, less language loss/confabulation | Dx | 25, p.934 | neurocognitive | Taught/Expand | **Branching case** (older parent brought by son) | I | Book gives proportions (p.934) - quote with page | low |
| Elder abuse: definition, types incl. financial and neglect by omission | Eth | 25, p.942 | neurocognitive / ethics-law | **New** (0 hits) | Branching case decision point | I | Book cites a prevalence estimate (p.942) | **high (abuse)** |
| Spousal bereavement and later mortality | Ph | 25, pp.943-944 | defences (3.5) | Expand | Reflection | F | Association stated | med |
| Prescribing in older adults: medical work-up incl. ECG, bring all medicines, divided doses, reassess, washout | Tx | 25, pp.944-945 | brain (3.2) | Expand | Treatment-planning discussion | I | Practice guidance | none |
| Psychotherapy for older patients | Tx | 25, pp.945-946 | therapies | Expand | Role-play | I | - | low |

### Ch 25.3 - Psychiatric emergencies (pp. 947-1002)

Grep: `triage` 0 hits; `de-escalation` only in `bipolar`; ED self-harm taught in `suicide` 2.3.

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Five questions before any disposition: safe here? physiological or functional? psychotic? suicidal/homicidal? able to self-care? | Sk | 25, p.951 | interview-mse (1.7) | **New** | **Branching case** built on the five questions | I | Clinical algorithm | med |
| Triage into emergency / urgent / non-urgent; handover across shifts; request old records; avoid family as interpreters | Sk | 25, pp.950-951 | interview-mse | New | Sort: triage cards | F | Practice model | low |
| General strategy (Table 25-7): self-protection, prevent harm, rule out medical, rule out impending psychosis; stepwise options from verbal limit-setting to restraint | Sk | 25, pp.952-953 | psychosis / ethics-law | Expand | Branching case with de-escalation choices | I | Practice guidance | **high (restraint)** |
| Features pointing to a medical cause (acute onset, first episode, older age, non-auditory hallucinations, disorientation, neurological signs) | Dx | 25, pp.953-954 | psychosis (1.4) | Taught | Reuse in branching case | I | Table | none |
| Suicide risk signs (Table 25-9); a suddenly calm previously agitated patient as warning | Dx | 25, p.955 | suicide | Taught | - | I | Book gives a warning-before-suicide figure (p.955) | **high** |
| Violence: differential, predictors (alcohol, past violence, childhood abuse), Table 25-10 signs of impending violence | Dx | 25, pp.956-957 | suicide (3.3 risk to others) | Expand | Differential game + flashcards | I | Book names "best predictors" (p.956) | high |
| Sexual assault survivor in ED: private, non-judgemental, consent before evidence, validate avoidance | Sk | 25, pp.957-958 | trauma (1.4) | Expand | Therapy-skill (communication only; no graphic detail) | A | Practice guidance | **high** |
| When unsure what to say, listen; crisis needs support, ventilation, meaning | Sk | 25, p.960 | interview-mse | Taught | - | F | - | none |
| ED pharmacotherapy indications (violence, panic, acute dystonia/akathisia) | Tx | 25, p.960 | antipsychotics (3.3) | Taught | - | I | Doses quoted in book (p.960) - not for VIBHA students to memorise | med |
| Documentation in emergencies | Sk | 25, p.963 | case-sheet (2.5) | Expand | Writing exercise | I | - | low |
| Child emergencies: who refers; overwhelmed adult vs genuine risk; assess the system | Sk | 25, pp.963-1002 | child | Expand | Branching case | I | - | high (child) |
| School refusal: urgent because it entrenches; separation anxiety vs school phobia; return next school day with a school contact person | Tx | 25, pp.995-996 | child (3.2), anxiety (2.6) | Expand | **Branching case** | I | Practice guidance | med |

### Ch 26 - Level of care (pp. 1003-1011)

US-framed (managed care). Use only the concept ladder (inpatient, partial hospital, IOP, outpatient, residential)
as a **sort** activity in `case-sheet` 2.5; status New (0 hits for "partial hospital"/"day hospital"). Level I. Sens none.

### Ch 27 - Ethics and professionalism (pp. 1012-1033)

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Principles; weak vs strong paternalism; justice in resource allocation | Eth | 27, pp.1012-1014 | ethics-law (1.1) | Expand (paternalism terms 0 hits) | Group debate | I | Ethical reasoning | low |
| Sexual relations with patients always unethical; debate over ex-patients | Eth | 27, p.1015 | therapies (3.5) | Taught | Reflection | I | - | high |
| Boundary *crossing* vs boundary *violation* (exploitative, gratifies clinician's needs) | Eth | 27, p.1016 | ethics-law (1.4) | Expand | **Ethics dilemma** with graded crossings | I | Conceptual | med |

### Ch 28 - Forensic and legal issues (pp. 1034-1065)

US law; every item must be translated to MHCA 2017 / Indian law (already taught in `ethics-law`).

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Split treatment (prescriber + therapist) responsibilities; consent with each new drug; follow-up interval | Eth | 28, pp.1036-1038 | ethics-law (3.5) | New | Treatment-planning discussion | A | Practice opinion | low |
| Tarasoff facts and the duty to protect; identifiable victim, imminent serious harm, clinically reasonable action; violence cannot be predicted reliably | Eth | 28, pp.1043-1045 | ethics-law (1.3) | Taught | **Ethics dilemma** with Indian setting | I | Case law; book notes poor predictive accuracy | high |
| Involuntary hospitalisation, right to treatment / to refuse, seclusion and restraint, informed consent | Eth | 28, pp.1045-1053 | ethics-law (2.3-2.4) | Taught | - | I | US statute | med |
| Testamentary and contractual capacity | Eth | 28, p.1054 | ethics-law (3.3) | Expand | Branching case (property dispute in a joint family) | A | - | med |
| Criminal responsibility, M'Naghten | Eth | 28, pp.1056-1059 | ethics-law (3.3) | Taught | - | I | - | med |

### Ch 29 - End-of-life care (pp. 1066-1128)

Grep: `palliative` 0, `euthanasia`/`assisted` 0, `bad news` 0, `chronic grief`/`delayed grief` 0. Kübler-Ross and
prolonged grief are taught in `defences` 3.5.

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Kübler-Ross stages, book stresses no fixed sequence; denial adaptive if treatment continues | C | 29, p.1068 | defences (3.5) | Taught | - | F | Descriptive model | med |
| Clinician reactions that distort end-of-life care (identifying with patient, own loss, fear of death, intolerance of uncertainty) | Sk | 29, pp.1096-1097 | therapies (3.5) | New | **Reflection** | I | Adapted table (p.1097) | med |
| Breaking bad news: prepare, private, seated, simple language, over several meetings, ask how much they want to know, avoid survival estimates, promise non-abandonment | Sk | 29, pp.1097-1099 | interview-mse (1.7) | **New** | **Therapy-skill practice** + role-play | I | Practice guidance; book reports a survey figure on wanting diagnosis (p.1099) | **high** |
| Bereavement vs major depression (Table 29-2): guilt/worthlessness, retardation, triggers by reminders, timing | Dx | 29, p.1077 | depression (3.2) | Expand | **Differential game** | I | Clinical comparison | high |
| Complicated grief patterns: chronic, hypertrophic, delayed; DSM-5 persistent complex bereavement vs ICD-10 (Table 29-3) | Dx | 29, pp.1077-1080 | defences (3.5), trauma | Expand | Matching pattern -> description | A | Descriptive syndromes, "not diagnostic categories" | high |
| Anxiety, depression, confusion in advanced disease | Dx | 29, pp.1089-1091 | depression (3.3) | New | Treatment-planning discussion | A | Book gives a wide prevalence range for depression (p.1090) | high |
| **Endicott substitution criteria**: replace somatic criteria with psychological ones in the medically ill | Dx | 29, p.1090 (Table 29-5) | depression (3.3) | **New** | **Matching** | A | Book says they performed as well as DSM criteria | med |
| Advance directives, proxies, surrogates; terminal-care decisions | Eth | 29, pp.1093-1103 | ethics-law (2.2) | Expand | Ethics dilemma | A | US framing; map to MHCA AD | high |
| Palliative care, hospice, children's end-of-life care, spirituality | Tx | 29, pp.1106-1117 | - | New | Reflection; guest-lecture prompt | I | - | high |
| Euthanasia vs physician-assisted suicide; arguments for/against; depression may drive requests and is treatable | Eth | 29.3, pp.1118-1125 | ethics-law / suicide | **New** | **Ethics dilemma** + group debate | A | Positions of professional bodies; Oregon data (p.1121) | **high (suicide, death)** |

### Ch 30-31 - Community and global psychiatry (pp. 1129-1181)

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Treatment gap worldwide; India named in resource discussion | C | 31, pp.1162-1166 | depression (1.1), substance | Taught (2 hits) | Flashcards | F | Book gives global treatment-gap figures (p.1162); cite page | low |
| Barriers to mental-health policy and suggested solutions (pilot projects, link to other priorities, show primary care the hidden burden) | C | 31, p.1171 | therapies (3.4) | New | Group debate | A | Policy analysis | none |
| Stigmatising attitudes | C | 31, pp.1171-1172 | many | Taught | - | F | - | med |

### Ch 32-35 - Development, neuroscience, behavioural sciences, history (pp. 1182-1875)

Mostly taught (`defences`, `brain`, `assessment`). New/expand items:

| Concept | Type | Ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Test translation: ethnocentric, pragmatic, emic+etic approaches; norms differ | C | 34, p.1701 | assessment (3.2) | New | Matching | A | Methodological | low |
| Culture-bound syndromes: amok, ataque de nervios, shenjing shuairuo | Ph | 34, pp.1702-1708 | more-disorders (4.2) | New (`amok` 0 hits) | Flashcards | I | Descriptive | med |
| **Possession syndrome (South Asia)**: stress/family-conflict precipitants (e.g. new bride in in-laws' home), altered state, amnesia, role of family and healers; female predominance | Ph/Dx | 34, pp.1708-1710 | more-disorders (4.2, 4.3) | Expand | **Differential game** (vs psychosis, epilepsy, malingering) | I | Book gives sex ratio and age of onset (p.1709) and notes weak epidemiology | **high (religion, gender)** |
| Positive psychology | C | 34, pp.1828-1848 | therapies | New (0 hits) | Reflection | F | - | none |
| History incl. Charaka Samhita and early Indian hospitals | C | 35, p.1849 | brain / intro | New | Timeline sort (enrichment) | F | Historical | none |

## 4. Priorities for build (highest value first)

1. **Emergency evaluation branching case** (Ch 25.3) - fills the biggest process-skill gap.
2. **End-of-life pack** (Ch 29): breaking bad news skill, grief-vs-depression differential, Endicott matching, euthanasia dilemma.
3. **Impulse-control disorders** (Ch 18): new short section in `more-disorders` plus differential game.
4. **Brief dynamic therapies and IPT phases** (Ch 23): matching and sort in `therapies`.
5. **C-L referral differential** and **elder abuse** branching case (Ch 25.1-25.2).
6. **Possession syndrome differential** (Ch 34) - culturally central for Indian students; handle with care.

## 5. Cautions for writers

- Book law and service structure are **US-specific** (Tarasoff, Oregon, managed care, levels of care). Always map to MHCA 2017 and Indian practice; legal statements need faculty review.
- Several numbers in this half are survey or prevalence figures; **quote only with the page number** and never round or extrapolate.
- `study.test.ts` forbids book names in module text: cite Kaplan in metadata/review notes, not in student-facing copy.
- Vignettes in the JSON are original and fictional; book cases were used only to understand the phenomenon.
