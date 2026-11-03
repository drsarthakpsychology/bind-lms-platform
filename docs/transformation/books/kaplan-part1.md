# Kaplan & Sadock's Synopsis of Psychiatry (12th ed.), Part 1: curriculum mapping

## 1. Bibliographic block

| Field | Value |
|---|---|
| Title | Kaplan & Sadock's Synopsis of Psychiatry, Twelfth Edition |
| Editors | Robert Joseph Boland, M.D.; Marcia L. Verduin, M.D. Consulting editor: Pedro Ruiz, M.D. Editorial assistant: Arya Shah, M.D. |
| Publisher, year | Wolters Kluwer, Philadelphia, 2022 (copyright page, PDF p.6). ISBN 9781975145569 |
| Source file | Part 1 of a two-file PDF, PDF pages 1-1600. Text extracted with `pdftotext -layout`, one form-feed per page |
| Coverage of Part 1 | Front matter and contents (pp.1-21), Section A "Clinical Psychiatry" chapters 1-14 in full, and chapter 15 (Sleep-Wake Disorders) up to the parasomnias. Chapters 16-35 are in Part 2. That includes psychopharmacology (21), psychotherapy (23), ethics and forensic issues (27-28), global and cultural psychiatry (31), normal development (32), neuroscience (33), the behavioural and social sciences (34, which covers learning theory, Piaget, Erikson, attachment and defences) and history (35) |
| Page convention | **All page numbers below are PDF page numbers** (page N is the Nth form-feed chunk). The extracted text has no running headers or printed folios, so printed page numbers could not be recovered. Table numbers (for example "Table 3-8") are the book's own and give a second, edition-stable reference |

**What this means for VIBHA.** Part 1 is the clinical half of the book: interview and MSE, rating scales and testing, and the disorders. Development theory (Piaget, Erikson, attachment), learning theory and defence mechanisms appear here only as they apply to particular disorders. Their main treatment is in Part 2 (chapters 32-34). The `defences` module should be mapped against the Part 2 analysis.

## 2. Chapter index (PDF pages)

| Ch | Title | PDF pages | Main VIBHA module(s) |
|---|---|---|---|
| 1 | Examination and Diagnosis of the Psychiatric Patient | 23-305 | interview-mse, assessment, case-sheet |
| 1.1 | The Adult Patient: interview, history, MSE (23-79); physical exam (80-96); report and record (97-117); rating scales (118-151); neuropsychology and intellectual assessment (152-179); personality assessment (180-194); laboratory tests (195-218); neuroimaging (219-237) | 23-237 | interview-mse, assessment, brain |
| 1.2 | Children and Adolescents (interviews, instruments, child MSE, testing) | 238-285 | child, assessment |
| 1.3 | Geriatric Patients | 286-305 | neurocognitive, interview-mse |
| 2 | Neurodevelopmental and Other Childhood Disorders | 306-725 | child |
| 2.1-2.6 | Intellectual disability (306), communication (347), autism (392), ADHD (422), specific learning disorder (452), motor and tic disorders (478) | 306-518 | child |
| 2.7-2.17 | Infant feeding (519), trauma in children (533), depression and suicide in youth (555), early bipolar (576), DMDD (587), disruptive behaviours (593), child anxiety (617), selective mutism (639), child OCD (646), early-onset schizophrenia (657), adolescent substance use (672) | 519-725 | child, trauma, suicide, anxiety, ocd, psychosis, substance |
| 3 | Neurocognitive Disorders: delirium (734), dementia (757), amnestic (795), due to medical conditions incl. epilepsy and HIV (807), MCI (848) | 726-867 | neurocognitive |
| 4 | Substance Use and Addictive Disorders: general (868), alcohol (887), cannabis (930), opioids (942), sedatives (960), stimulants (973), tobacco (994), caffeine (1005), hallucinogens (1021), inhalants (1044), steroids (1051), gambling (1060), other incl. internet gaming (1068) | 868-1089 | substance |
| 5 | Schizophrenia Spectrum and Other Psychotic Disorders | 1090-1172 | psychosis |
| 6 | Bipolar Disorders | 1173-1214 | bipolar |
| 7 | Depressive Disorders | 1215-1284 | depression |
| 8 | Anxiety Disorders | 1285-1325 | anxiety |
| 9 | Obsessive-Compulsive and Related Disorders | 1326-1370 | ocd |
| 10 | Trauma- and Stressor-Related Disorders | 1371-1401 | trauma |
| 11 | Dissociative Disorders | 1402-1441 | more-disorders |
| 12 | Somatic Symptom and Related Disorders | 1442-1496 | more-disorders |
| 13 | Feeding and Eating Disorders | 1497-1533 | more-disorders |
| 14 | Elimination Disorders | 1534-1549 | child |
| 15 | Sleep-Wake Disorders (partial; continues in Part 2) | 1550-1600 | more-disorders |

Chapters 2-15 share a fixed skeleton: Clinical presentation, Diagnosis (side-by-side DSM-5 / ICD-10 tables), Differential diagnosis, Comorbidity, Course and prognosis, Treatment, Epidemiology, Etiology. That makes differential-diagnosis activities easy to build. Case vignettes ("Mr. F", "Ms. A" and so on) are most frequent in chapters 4 (about 86 name mentions), 3, 5, 8, 9 and 15. Use them only as **models of structure**; VIBHA vignettes must be original.

## 3. Opportunities by chapter

Key: **Status** is from a grep of `src/content/study/*.ts` (Taught = already covered at comparable depth; Expand = present but thin or missing the book's angle; New = absent). **Level** F = foundation, I = intermediate, A = advanced. **Evidence** is as the book presents it. **Sens** = sensitivity flag.

### Chapter 1.1: Interview, history and MSE (pp.23-79)

VIBHA's `interview-mse` module is already deeper than the book on MSE vocabulary (confusable pairs, worked write-ups, Indian setting). Most items are "Taught". The value lies in **doing**: observation drills, not new text.

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Formal thought disorder: circumstantial vs tangential vs flight of ideas vs loosening, blocking, neologism, clang, perseveration | phenomenon | 1.1, pp.51-53, Table 1-4 | interview-mse | Taught | **MSE scenario**: students read or hear short speech samples and label them. Labels are only learned by hearing the difference | F | established | - |
| Mood vs affect: quality, quantity, range, appropriateness, congruence | phenomenon | 1.1, pp.49-50 | interview-mse | Taught | **MSE observation** with described clips; the five affect dimensions make a ready rubric | F | established (book notes the terms are debated, p.49) | - |
| Insight independent of severity; judgement independent of insight | clinical application | 1.1, pp.55-56 | interview-mse | Expand | **Sort**: case snippets into good/poor insight x good/poor judgement grid. The book's point that a psychotic person may have good insight is counter-intuitive | I | established | - |
| Judgement best tested with the patient's own real situations, not hypotheticals | clinical application | 1.1, p.56 | interview-mse | Expand (no "stamped envelope" critique found) | **Group debate**: hypothetical vs real-life judgement questions | I | presented as expert opinion | - |
| Cognitive screening questions (orientation, serial 7s, recall, abstraction) and cultural/educational bias of proverbs and fund-of-knowledge items | assessment tool | 1.1, pp.53-55, Table 1-5 | interview-mse / assessment | Taught (Indian adaptation in 2.12) | **Role-play** with an adapted Indian item bank. The book's items are US-centric (dollars, US cities), which is itself a teaching point | F | established | culture |
| Suicide and homicide inquiry: ideation, intent, plan, preparation | clinical application | 1.1, p.51 | suicide | Taught | **Branching case** (spec k1-15) | F | established | self-harm |
| Non-auditory hallucinations as a medical/substance clue; culture changes the base rate | phenomenon / cultural | 1.1, p.52 | interview-mse, psychosis | Expand | **Reflection** with culture prompt; link to the organic red-flags section in psychosis 1.4 | I | book presents as culture-dependent | culture |
| Hypnagogic perceptions and hearing one's name called can be normal | phenomenon | 1.1, p.52 | interview-mse | Taught | **Flashcards** (normal vs pathological) | F | established | stigma |
| Parts of the initial interview (I-XV) | clinical application | 1.1, pp.37-38, Table 1-1 | case-sheet | Taught | **Timeline / ordering**: drag the sections into order | F | established | - |
| Interview microskills: open questions, noting slips, confidentiality limits in forensic assessments, recording consent | clinical application | 1.1, pp.24-36 | interview-mse | Taught | **Peer role-play** with an observer checklist (Practice: Peer Role-Play) | F | established | - |
| AIMS screening on antipsychotics | assessment tool | 1.1, p.56 | antipsychotics | Taught | Flashcards | I | established | - |
| Psychiatric review of systems and SIGECAPS mnemonic | clinical application | 1.1, p.40 | depression | New (mnemonic absent) | **Flashcards / mnemonic card** | F | established | - |

### Chapter 1.1: Rating scales, testing, laboratory, imaging (pp.118-237)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Reliability (internal consistency, interrater, test-retest) vs validity | research method | 1.1, pp.119-123 | assessment | Taught (1.1). "Test-retest" found only as "retest" | **Sort** of research scenarios (spec k1-12). Students mix up these concepts, so classification practice works | F | established | - |
| Categorical vs continuous constructs; what a "construct" is | research method | 1.1, p.119 | assessment, personality (2.5 dimensional) | Expand ("categorical" absent) | **Concept map** linking diagnosis, severity scale and dimensional personality | I | established | - |
| Scale goals: diagnosis vs severity tracking vs screening; screening positives need clinical follow-up | research method | 1.1, pp.119, 144 | assessment | Taught | **Reflection**: pick the right instrument for three referral questions | I | established | - |
| BPRS, SAPS/SANS, HAM-D, HAM-A, WHODAS 2.0 | assessment tool | 1.1, pp.125-141, Tables 1-12 to 1-17 | assessment | Expand (WHODAS absent; HAM-D/HAM-A only in depression) | **Matching**: scale to construct and rater type | I | established | - |
| Brain-behaviour: left vs right hemisphere deficit profiles; circuits not single structures | neuroscience | 1.1, p.152, Table 1-19 | brain / assessment | Expand ("hemisphere" only in brain, bipolar) | **Sort**: deficits into left/right hemisphere | I | established, with the book's caveat that localisation now matters less | - |
| Neuropsychological battery (Wechsler, digit span, PASAT, Trail Making, WCST, Halstead-Reitan, Bender) | assessment tool | 1.1, pp.152-179, Table 1-20; 1.2, p.265 | assessment | Taught | **Matching** (spec k1-13); link to Lab "Digit span" and "Stroop" | I | established | - |
| IQ as a range, not a point | research method | 1.1, p.170 | assessment | Taught (normal curve section) | **Simulation**: confidence band around an observed score | I | established | stigma (labels) |
| Objective vs projective personality tests (MMPI, Rorschach, TAT), strengths and weaknesses | assessment tool | 1.1, pp.180-194, Tables 1-21, 1-22 | assessment | Taught | **Group debate** on projective-test validity | I | book lists strengths/weaknesses; validity debated | - |
| Urine drug detection windows | clinical application | 1.1, p.201, Table 1-23 | substance | Expand | Flashcards; do not invent windows, take them from Table 1-23 | A | established | - |
| Neuroimaging (CT, MRI, MRS, PET findings) | neuroscience | 1.1, pp.219-237, Tables 1-24, 1-25 | brain | Taught (2.5) | Concept map | A | emerging for PET/MRS psychiatric findings | - |

### Chapters 1.2-1.3: Children and older adults (pp.238-305)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Child MSE (adds play, separation, relatedness to examiner) | assessment tool | 1.2, p.253, Table 1-27 | child | Expand | **MSE scenario**: observe a described play session | I | established | minors |
| Child instruments (structured interviews, CBCL-type checklists, intelligence tests) | assessment tool | 1.2, pp.242-270, Table 1-29 | child, assessment | Expand (CBCL absent; Indian tools INCLEN/VSMS already present) | Matching | I | established | - |
| Behavioural phenotypes of genetic syndromes | phenomenon | 1.2, p.277, Table 1-30; 2.1 pp.330-345 | child (2.5) | Taught | Flashcards | I | established | stigma |
| Older patient: see the patient alone even when impaired; collateral history; age-associated memory complaints | clinical application | 1.3, pp.286-294 | neurocognitive | Expand | **Role-play** with a family member present | F | established | elder abuse |

### Chapter 2: Neurodevelopmental and childhood disorders (pp.306-725)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Intellectual disability severity by adaptive functioning | clinical application | 2.1, pp.310-312, Table 2-2 | child | Taught | Sort: adaptive descriptions into severity bands | F | established | stigma |
| Language development milestones | phenomenon | 2.2, p.350, Table 2-5 | child (1.2) | Expand | **Timeline** of milestones | F | established | - |
| Autism vs childhood-onset schizophrenia vs intellectual disability vs language disorder | clinical application | 2.3, pp.403-405, Tables 2-13, 2-14 | child | Expand | **Differential game** | I | established | - |
| Adult ADHD (Utah criteria) | assessment tool | 2.4, pp.448-450, Table 2-17 | child (2.6) | Expand ("Utah" absent) | Flashcards | A | debated | - |
| Tic assessment and tic differential | assessment tool | 2.6, pp.503-506, Tables 2-23, 2-24 | child | Expand | Differential game | A | established | - |
| Reactive attachment vs disinhibited social engagement | phenomenon | 2.8, pp.534-544 | trauma (2.3) | Taught | Sort | I | established | child abuse |
| DMDD vs early bipolar | clinical application | 2.10-2.11, pp.576-592 | child, bipolar | Taught | Differential game | A | debated (book: newer category) | - |
| Attenuated psychosis syndrome | phenomenon | 2.16, p.669 | psychosis (2.4 at-risk state) | Expand (term absent) | Reflection | A | emerging | stigma |
| Adolescent substance use and motivational interviewing | clinical application | 2.17, pp.672-725 | substance, therapies | Taught | Role-play | I | established | minors |

### Chapter 3: Neurocognitive disorders (pp.726-867)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Delirium core features: altered consciousness, inattention, fluctuation | phenomenon | 3.1, pp.737-739, Table 3-5 | neurocognitive | Taught | **Differential** (spec k1-01) | F | established | - |
| Delirium vs dementia feature comparison | clinical application | 3.1, p.747, Table 3-8; 3.2, p.770 | neurocognitive | Taught | Differential (k1-01) | F | established | - |
| Predisposing vs precipitating factors (vulnerability x insult model) | theory | 3.1, pp.752-753, Tables 3-11, 3-12 | neurocognitive | Expand | **Sort** of factors into two bins; teaches the stress-diathesis logic | I | established | - |
| Depression-related cognitive dysfunction ("pseudodementia"); the book prefers the newer term | clinical application | 3.2, pp.770-771, Table 3-25; 7, p.1235 | neurocognitive, depression | Taught (2.7) | **Sort** (spec k1-02) | I | established; terminology debated (p.1235) | - |
| Cortical vs subcortical dementia | phenomenon | 3.2, p.789, Table 3-28 | neurocognitive | Expand | Sort | A | debated as a distinction | - |
| Dementia with Lewy bodies criteria; Capgras mentioned | phenomenon | 3.2, pp.788-789, Table 3-27 | neurocognitive | Taught (Capgras absent) | Flashcards | I | established | - |
| Psychogenic nonepileptic vs epileptic seizures | clinical application | 3.4, p.817, Table 3-33; 12, p.1457 | more-disorders | Expand (mentioned, no feature table) | **Sort** (spec k1-05) | I | established | stigma |
| Interictal psychiatric symptoms of epilepsy | phenomenon | 3.4, p.813 | psychosis, brain | Expand | Concept map | A | debated | - |
| HIV neurocognitive disorder | phenomenon | 3.4, pp.833-846 | neurocognitive | Taught | Flashcards | A | established | HIV stigma |
| Mild cognitive impairment: definitions and course | phenomenon | 3.5, pp.848-857, Table 3-40 | neurocognitive | Taught | Flashcards | I | established; treatment trials mixed (Table 3-41) | - |

### Chapter 4: Substance use and addictive disorders (pp.868-1089)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Use disorder, intoxication and withdrawal as separate diagnoses | theory | 4.1, pp.870-877, Tables 4-1 to 4-3 | substance | Taught | Sort | F | established | - |
| Conditioning in addiction (Pavlov cited) | theory | 4.1-4.2, p.887; tobacco p.993 | substance, defences | Expand | **Lab tie-in**: Reward schedules experiment; explain cue reactivity | I | established | - |
| Alcohol withdrawal: time course from tremor to delirium tremens | clinical application | 4.2, p.891, Table 4-5 | substance | Taught | **Timeline** (spec k1-07) | F | established | - |
| Blood alcohol levels and impairment | clinical application | 4.2, p.889, Table 4-4 | substance | Expand | Matching | I | established | - |
| Laboratory state markers of heavy drinking | assessment tool | 4.2, p.902, Table 4-9 | substance | Expand | Flashcards | I | established | - |
| Suicide factors in alcohol use disorder | clinical application | 4.2, p.905, Table 4-10 | suicide | Expand | Reflection | I | established | self-harm |
| Benzodiazepine equivalents and withdrawal | clinical application | 4.5, pp.963-969, Tables 4-24, 4-26, 4-27 | substance, stabilisers | Expand | Flashcards | A | established | - |
| Tobacco brief intervention (5 A's) | clinical application | 4.7, p.997, Table 4-31 | substance (3.3) | Taught | **Role-play** | F | established | - |
| Caffeine intoxication and withdrawal as anxiety mimics | phenomenon | 4.8, pp.1005-1014, Tables 4-33 to 4-36 | anxiety (2.7) | Expand | Differential game | F | established | - |
| Hallucinogen flashbacks and persisting perception disorder | phenomenon | 4.9, pp.1035-1036, Tables 4-43, 4-44 | substance | Taught | Flashcards | I | established | - |
| Four phases of gambling disorder | theory | 4.12, p.1066, Table 4-49 | substance | Taught ("chasing") | **Timeline** (spec k1-08) | I | descriptive model (one author's) | gambling |
| Internet gaming disorder | phenomenon | 4.13, p.1069, Table 4-50 | substance, child | Taught | Group debate (is it a disorder?) | I | debated / emerging | - |

### Chapter 5: Schizophrenia spectrum (pp.1090-1172)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Positive vs negative symptoms | phenomenon | 5, pp.1099-1100, Tables 5-1, 5-2 | psychosis | Taught | Sort | F | established | stigma |
| First-rank symptoms | historical/phenomenon | 5, p.1108 | psychosis | Taught | Flashcards | I | debated diagnostic weight | - |
| Medical causes of delusional syndromes | clinical application | 5, p.1126, Table 5-8 | psychosis (1.4) | Taught | Differential game | I | established | - |
| Objective tests (projective tests in thought disorder) | assessment tool | 5, pp.1124-1125 | assessment | Expand | Reflection | A | debated | - |
| Good vs poor prognostic factors | clinical application | 5, p.1135, Table 5-9 | psychosis (2.2) | Taught | Sort | I | established (book cites outcome ranges on p.1135) | - |
| Shared psychotic disorder (folie a deux) | phenomenon | 5, pp.1122-1123 | psychosis | Taught | Branching case | A | established | family |
| Expressed emotion and relapse | research | 6, p.1206; 5 psychosocial | psychosis, therapies | Taught | Role-play of a family meeting | I | established | family |

### Chapters 6-7: Bipolar and depressive disorders (pp.1173-1284)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Bipolar vs unipolar depression features | clinical application | 6, p.1177, Table 6-1; 7, p.1235, Table 7-5 | bipolar (1.3) | Taught | **Differential** (spec k1-10) | I | debated; book calls the data "inconsistent and controversial" (p.1177) | - |
| Differential of mania, incl. medical causes | clinical application | 6, p.1192, Table 6-5 | bipolar | Taught | Differential (k1-11) | I | established | - |
| Mania misdiagnosed as schizophrenia in minority groups | cultural psychiatry | 6, p.1192; 7, p.1237, Table 7-6 | bipolar, psychosis | New | **Reflection / group debate** on diagnostic bias by caste, class or language in India (k1-11) | A | book presents as an observed tendency | culture, bias |
| Hypomania vs borderline mood lability | clinical application | 6, p.1192 | bipolar, personality (2.7) | Taught | Differential (k1-11) | A | established | - |
| Psychotherapies with evidence in bipolar disorder | clinical application | 6, p.1205, Table 6-8 | bipolar | Taught | Matching | I | established | - |
| Neurovegetative symptoms | phenomenon | 7, p.1217, Table 7-1 | depression | Taught | Flashcards | F | established | - |
| Grief vs depressive disorder (guilt of omission vs commission, reactivity, psychomotor change) | clinical application | 7, p.1239, Table 7-8 | depression | Expand (guilt of omission only in interview-mse) | **Differential** (spec k1-09) | I | established | bereavement |
| Anxiety vs depression cross-sectional profiles | clinical application | 7, p.1237, Table 7-7 | anxiety, depression | Expand | Sort | I | established | - |
| Prognostic indicators; phases of treatment (acute, continuation, maintenance) | clinical application | 7, pp.1244-1246, Tables 7-9, 7-10 | depression (4.2) | Taught | Timeline | I | established | - |
| Beck's cognitive triad and depressogenic schemata | theory | 7, p.1280, Table 7-14 | depression, therapies | Taught | **Sort** of automatic thoughts into self/world/future | F | established | - |
| Learned helplessness (uncontrollable shock, later reformulated with attributions) | historical study | 7, p.1280 | depression, defences | Taught | **Simulation**: a solvable vs unsolvable anagram task in the Lab, with debrief | I | established, with reformulation | animal research ethics |
| Evidence-based psychotherapies and response predictors | clinical application | 7, pp.1258-1260, Tables 7-12, 7-13 | therapies | Taught | Matching | I | established | - |

### Chapters 8-10: Anxiety, OCD-related and trauma (pp.1285-1401)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Pavlovian fear conditioning; extinction is new learning, not forgetting; context and reinstatement | theory / historical study | 8, pp.1313-1314 | anxiety (1.2, 2.8), defences (1.3) | Taught | **Matching** (spec k1-14) plus Lab demonstration; explains relapse after exposure | F | established | - |
| Fear circuitry (amygdala, vmPFC, hippocampus); GAD as weaker fronto-amygdala connectivity | neuroscience | 8, pp.1312-1313 | anxiety, brain | Expand (vmPFC absent) | Concept map | A | emerging ("preliminary", p.1313) | - |
| Panic and suffocation/lactate findings | neuroscience | 8, p.1313 | anxiety | New | Flashcards | A | emerging | - |
| Monotherapy evidence and pharmacotherapy pointers | clinical application | 8, pp.1305-1307, Tables 8-6, 8-7 | anxiety (3.2) | Taught | Flashcards | I | established | - |
| OCD symptom dimensions in adults and children | phenomenon | 9, pp.1328-1330, Tables 9-1, 9-2 | ocd | Taught | Sort | F | established | - |
| Body dysmorphic disorder: body areas of concern | phenomenon | 9, p.1332, Table 9-3 | ocd (2.1) | Taught | MSE scenario | I | established | body image |
| Telling the OC spectrum apart | clinical application | 9, pp.1342-1352 | ocd (2.4) | Taught | Differential game | I | established | - |
| PTSD vs acute stress vs adjustment disorder by timing and stressor | clinical application | 10, pp.1376-1387, Tables 10-1 to 10-5 | trauma (2.1) | Taught | Timeline / differential | F | established | trauma |
| Medical causes of post-traumatic symptoms (head injury, epilepsy, alcohol) | clinical application | 10, p.1385, Table 10-4 | trauma | Expand | Differential game | I | established | trauma |
| Positive prognostic factors and vulnerability factors in PTSD | clinical application | 10, pp.1389, 1395, Tables 10-6, 10-8 | trauma (1.3) | Taught | Sort | I | established | trauma |

### Chapters 11-13: Dissociative, somatic and eating disorders (pp.1402-1533)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Types of dissociative amnesia (localised, selective, generalised, continuous, systematised) | phenomenon | 11, p.1405, Table 11-1 | more-disorders (4.1) | Expand | Matching | I | established | trauma |
| MSE questions for dissociative amnesia and DID | assessment tool | 11, pp.1405, 1419, Tables 11-2, 11-7 | more-disorders (4.3) | Expand | **MSE scenario / role-play** using original question wording | A | established | trauma |
| Ganser syndrome | phenomenon | 11, pp.1419-1439 | more-disorders | New | Flashcards | A | debated | forensic |
| DID differential and phased trauma treatment | clinical application | 11, pp.1422-1431, Table 11-8 | more-disorders | Taught | Reflection | A | debated (book reports the controversy) | trauma |
| Conversion signs: non-dermatomal loss, midline split, Hoover test, hand-drop | clinical application | 12, p.1454, Table 12-5 | more-disorders (3.1) | Expand (Hoover only) | **Demonstration video + sort** | I | established | stigma |
| Primary gain, secondary gain, la belle indifference | theory | 12, p.1457 | more-disorders | Expand (belle indifference absent) | Flashcards with the book's caveat that seriously ill people can show indifference too | I | debated diagnostic value | - |
| Somatic symptom vs conversion vs factitious vs malingering (conscious production, motive) | clinical application | 12, pp.1478-1481 | more-disorders (3.2) | Taught | **Differential** (spec k1-06) | I | established | forensic, stigma |
| Clues to factitious disorder; imposed-on-another warning signs | clinical application | 12, pp.1461, 1474, Tables 12-7, 12-9 | more-disorders, child (4.1) | Expand | Branching case | A | established | child protection |
| Medical complications of eating disorders | clinical application | 13, p.1502, Table 13-2 | more-disorders (1.3) | Taught | Matching | I | established | eating disorders |
| Eating disorder comorbidity | clinical application | 13, p.1516, Table 13-5 | more-disorders | Expand | Concept map | I | established | - |

### Chapters 14-15: Elimination and sleep-wake (pp.1534-1600)

| Concept | Type | Book ref | Module | Status | Best format and why | Lvl | Evidence | Sens |
|---|---|---|---|---|---|---|---|---|
| Enuresis and encopresis (conditioning treatments, e.g., alarm) | clinical application | 14, pp.1535-1549 | child (3.3) | Taught | Branching case for parents | F | established | shame |
| Sleep stages and their EEG criteria | neuroscience | 15, pp.1551-1555, Table 15-1 | brain (2.2), more-disorders (2.3) | Expand | **Matching** of hypnogram stage to EEG feature | I | established | - |
| Psychophysiologic insomnia features; drugs causing insomnia | clinical application | 15, pp.1564-1566, Tables 15-6, 15-7 | more-disorders | Taught | Sort | F | established | - |
| Narcolepsy tetrad incl. cataplexy and SOREMP | phenomenon | 15, pp.1551, 1572-1573 | more-disorders | Taught | Flashcards | I | established | - |
| Restless legs vs akathisia | clinical application | 15, pp.1556, 1600 | more-disorders, antipsychotics | Taught | Differential game | I | established | - |
| NREM vs REM parasomnias | phenomenon | 15, pp.1588-1595, Tables 15-12 to 15-14 | more-disorders (2.2) | Taught | Sort | I | established | - |

## 4. Cross-cutting findings

1. **The curriculum already covers the clinical chapters well.** Most concepts checked are already "Taught". The gaps are mostly **depth angles**, not topics: feature-by-feature tables (PNES, delirium predisposing vs precipitating, cortical vs subcortical), WHODAS, belle indifference, Ganser, the Utah criteria and the categorical/continuous distinction.
2. **The most valuable use of this book is activities, not more reading.** Its side-by-side differential tables (3-8, 3-25, 3-33, 6-1, 7-5, 7-8, 10-4, 12-5) map directly onto the `differential` and `sort` formats in the JSON file.
3. **Cultural psychiatry is thin in Part 1.** The relevant passages are the US-centric cognitive items (p.55), the cultural base rate of visual hallucinations (p.52) and the misdiagnosis of mania in minority groups (p.1192). Each is a useful **prompt to adapt** for Indian settings. Map culture-bound syndromes from chapter 31 (Part 2).
4. **Learning theory appears in applied form**: Pavlov and extinction (pp.1313-1314), learned helplessness (p.1280) and conditioning in addiction (p.887). These pair naturally with the Lab's "Reward schedules" experiment.
5. **Statistics**: the book gives some numbers (alcohol withdrawal timings p.891; ASD vs childhood-onset schizophrenia incidence p.404; schizophrenia outcome ranges p.1135; gambling phase durations p.1066). Any activity that uses one must cite its page. The JSON file follows this rule.
6. **Copyright**: case vignettes and table wording must not be reproduced. Every item in `kaplan-part1-activities.json` is original and uses the book only for **which features discriminate**.

## 5. Ready-to-build activities

See `docs/transformation/books/kaplan-part1-activities.json`, which has 15 specs:

| id | Format | Module | Level |
|---|---|---|---|
| k1-01 delirium-or-dementia | differential | neurocognitive | F |
| k1-02 depression-vs-dementia-sort | sort | neurocognitive | I |
| k1-03 thought-form-ear | mse-observation | interview-mse | F |
| k1-04 affect-insight-judgement | mse-observation | interview-mse | I |
| k1-05 pnes-vs-epilepsy | sort | more-disorders | I |
| k1-06 feigned-or-felt | differential | more-disorders | I |
| k1-07 alcohol-withdrawal-clock | timeline | substance | F |
| k1-08 gambling-phases | timeline | substance | I |
| k1-09 grief-or-depression | differential | depression | I |
| k1-10 hidden-bipolar | differential | bipolar | I |
| k1-11 mania-or-not | differential | bipolar | A |
| k1-12 reliability-validity-sort | sort | assessment | F |
| k1-13 which-test | matching | assessment | I |
| k1-14 fear-conditioning-match | matching | anxiety | F |
| k1-15 asking-about-suicide | branching-case | suicide | F |
