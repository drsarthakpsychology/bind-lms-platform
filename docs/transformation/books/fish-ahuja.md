# Fish's Clinical Psychopathology + Ahuja: opportunities for VIBHA

Analyst pass for the VIBHA LMS transformation. Companion data file: `docs/transformation/books/fish-ahuja-activities.json` (3 activities: a 64-item "Symptom Spotter" bank, a "Then and now" law sorter, and "Culture or symptom?").

**Bottom line.** Module 1 (`interview-mse-1/2/3.ts`) already teaches most of Fish's descriptive phenomenology, often closely following it: Jaspers vs Hare on pseudohallucination, the "Kingstanding" flight-of-ideas example, Schneider's five formal thought disorder features, two-memberedness, pareidolia and the psychological pillow are all in `interview-mse-2.ts`. So Fish's main value is **not new content** but a **new practice format**: drills where students recognise a phenomenon from the patient's own words (the Symptom Spotter). The existing trainers (`src/lib/mse/confusable.ts`, `ladder.ts`, `mse4-stimuli.ts`) use pair choices, short prompts and full vignettes. None of them drills recognition from verbatim speech across about 30 phenomena. Truly **New** content is a small set: delusional misidentification (Capgras/Fregoli), Vorbeireden/Ganser, retrospective falsification, delusional memory, distortions of time and size (micropsia, Lilliputian), sense of presence, la belle indifférence/dissociation of affect, Jaspers' four aspects of self-experience, disturbances of self-unity, twilight/torpor states, Mitgehen/Mitmachen/Gegenhalten/obstruction, and the cognitive neuropsychiatry of delusions (jumping-to-conclusions). Ahuja (2010) adds nothing to phenomenology that VIBHA lacks. Its value is **Indian context** (dhat, koro, possession, Indian civil law) and a **cautionary example of outdated legal content**.

---

## 1. Bibliographic blocks

### A. Fish's Clinical Psychopathology
| Field | Value |
|---|---|
| Title | *Fish's Clinical Psychopathology: Signs and Symptoms in Psychiatry*, third edition |
| Authors | Patricia Casey and Brendan Kelly (revising Frank Fish 1967 and Max Hamilton's 1974/1985 editions) |
| Publisher | Gaskell (Royal College of Psychiatrists), London |
| Year | **Not present in the extracted text** (the copyright page is missing). Publisher records give 2007, and the latest references cited are from 2005. **Verify** against the physical copy. |
| Source file | `scratchpad/books/txt/Fish's Clinical Psychopathology, 3rd Edition_230806_023436.txt` (137 PDF pages, about 57k words) |
| Page mapping | Book page = PDF page − 4 for the body text (book p.14 = PDF 18). |
| Currency flags | Uses ICD-10 and DSM-IV-TR throughout (Ch 1 and Ch 9 classification content is outdated: DSM-5-TR 2022, ICD-11 in effect 2022). The phenomenology itself is durable. |
| Character | Concise European (Jaspers/Schneider) descriptive psychopathology, with clinical examples, and with the debates shown openly (pseudohallucination, broadcasting definitions, FRS specificity). |

### B. Ahuja, A Short Textbook of Psychiatry
| Field | Value |
|---|---|
| Title | *A Short Textbook of Psychiatry* |
| Author | Niraj Ahuja (contributing editor Savita Ahuja) |
| Publisher | Jaypee Brothers Medical Publishers, New Delhi |
| Edition | **Conflict, flag for verification.** The title page (PDF 4) says **Seventh Edition**. The copyright page (PDF 5) says "© 2011", "Seventh Edition: 2011", ISBN 978-93-80704-66-1. The preface is dated **July 2010**. The source filename says "20th Year Edition … (2010)", which is a marketing label (1990 to 2010), **not** an edition number. Cite it as the 7th ed., Jaypee, 2011 (preface 2010). |
| Source file | `scratchpad/books/txt/Niraj Ahuja-A Short Textbook of Psychiatry_ 20th Year Edition-Jaypee Brothers Med. Pub. (2010).txt` (273 PDF pages) |
| Page mapping | Book page = PDF page − 12 (book p.1 = PDF 13; p.229 = PDF 241). |
| Currency flags | **Legal content is outdated.** It describes the Mental Health Act 1987 (repealed by the MHCA 2017), IPC s.84/s.309 (now the BNS 2023), the Indian Evidence Act (now the Bharatiya Sakshya Adhiniyam 2023), the MCI 2002 Code (MCI replaced by the NMC), ICMR 2000 (replaced by ICMR 2017), and "DSM-V/ICD-11 likely 2012-14". It uses "mental retardation" and "culture-bound syndrome". See §4. |

---

## 2. Chapter indexes

### A. Fish (book pages → PDF pages)
| Ch | Title | Book pp. | PDF pp. | Main subsections (PDF page) |
|---|---|---|---|---|
| 1 | Classification of psychiatric disorders | 1-13 | 5-17 | organic and functional (7-8), personality (9), DSM-IV vs ICD-10 boxes (11-13), multiaxial (14-15), structured interviews (16) |
| 2 | Disorders of perception | 14-31 | 18-35 | hyper/hypoaesthesia (18), quality changes (19), dysmegalopsia (19-20), time (20), illusions (20-22), hallucination definitions and pseudohallucination (22-23), causes (23-25), auditory (25-27), visual (27-28), smell/taste/touch (28-29), presence (29-30), hallucinoses (30), functional/reflex/extracampine/autoscopy (30-31), hypnagogic (32), organic (32-33), body image and anosognosia (34-35) |
| 3 | Disorders of thought and speech | 32-54 | 36-58 | intelligence (36-37), autistic thinking (37), classification (38), flight of ideas and prolixity (38-39), slowing (39), circumstantiality (39), perseveration and blocking (40), obsessions (40-42), thought alienation (42-43), delusions: definition, overvalued idea, primary (43-44), secondary (44-45), persecution/infidelity/love/grandiose/ill-health/guilt/nihilism/poverty (45-49), pathology of delusions (49-50), formal thought disorder (50-52), speech disorders, mutism, Vorbeireden, neologism, schizophasia, aphasias (52-56) |
| 4 | Disorders of memory | 55-64 | 59-68 | memory types (59-61), organic amnesias (62), retrospective falsification and false memory (63-64), confabulation (64), pseudologia, Munchausen, approximate answers (65-66), retrospective and delusional memories, déjà vu (66), misidentification and Capgras, hyperamnesia and flashbacks (67) |
| 5 | Disorders of emotion | 65-74 | 69-78 | feelings vs emotions (69), normal and abnormal reactions (70-72), dissociation of affect and belle indifférence (72), apathy, perplexity, blunting, incongruity (73), lability (74), morbid depression and anhedonia (75-76), mania (77) |
| 6 | Disorders of the experience of self | 75-80 | 79-84 | Jaspers' four aspects (79), depersonalisation/derealisation (79-81), loss of emotional resonance (81), self-unity (81), continuity and DID (81-82), ego boundaries (82-83), passivity and made experiences (83), theory of mind (83-84) |
| 7 | Disorders of consciousness | 81-86 | 85-90 | attention and vigilance (85-86), clouding and delirium (87-88), lowering (torpor) (88), restriction and twilight states (88-89) |
| 8 | Motor disorders | 87-105 | 91-109 | subjective motor alienation and "as if" (91-92), expressive and goal-directed movements (92-95), mannerisms, stereotypies, tics (95-97), induced movements: automatic obedience, echo, Mitgehen, Mitmachen, Gegenhalten, negativism, ambitendency (98-100), obstruction (100-101), motor speech, verbigeration (101-102), posture, waxy flexibility, psychological pillow (102-103), stupor and excitement (104-106), goal-directed patterns (107), antipsychotic movement disorders (108) |
| 9 | Personality disorders | 106-120 | 110-124 | dimensions vs categories (111), assessment (SAPAS, PDE) (113-114), ICD/DSM categories (115-122) |
| App I | Psychiatric syndromes (eponyms A-Z) | 121-125 | 125-129 | Capgras, Fregoli, intermetamorphosis (125), Cotard, reduplicative paramnesia (126), Korsakoff (129) … |
| App II | Defences and distortions | 126-131 | 130-135 | defence mechanisms (130-132), cognitive distortions (133-134) |
| — | Index | 132+ | 136-138 | |

### B. Ahuja (book pages → PDF pages)
| Ch | Title | Book pp. | PDF pp. | Phenomenology/India relevance |
|---|---|---|---|---|
| 1 | Diagnosis and Classification | 1-4 | 13-16 | ICD-10/DSM-IV-TR, models of normality (outdated classification) |
| 2 | Psychiatric History and Examination | 5-18 | 17-30 | MSE headings (23-25). Puts somatic passivity under Perception (25), as VIBHA does |
| 3 | Organic Mental Disorders | 19-32 | 31-44 | delirium, dementia, Korsakoff |
| 4 | Psychoactive Substance Use | 33-53 | 45-65 | |
| 5 | Schizophrenia | 54-68 | 66-80 | Bleuler's 4 A's, Schneider FRS table (67, "not specific"), von Domarus with a Hindu deity example (67), neologism vs paraphasia (68) |
| 6 | Mood Disorders | 69-82 | 81-94 | |
| 7 | Other Psychotic Disorders | 83-88 | 95-100 | delusional disorder subtypes, de Clérambault, Othello (96), Capgras and misidentification (99) |
| 8 | Neurotic, Stress-related and Somatoform | 89-112 | 101-124 | dissociative and Ganser (114), trance/possession "very commonly seen in India" (114), depersonalisation causes (122), culture-bound: dhat, amok, koro, latah, Indian syndromes (122-123) |
| 9 | Adult Personality and Behaviour | 113-120 | 125-132 | |
| 10 | Sexual Disorders | 121-132 | 133-144 | dhat in sexual dysfunction (140) |
| 11 | Sleep Disorders | 133-141 | 145-153 | |
| 12 | Behavioural Syndromes (eating etc.) | 142-152 | 154-164 | |
| 13 | Mental Retardation | 153-161 | 165-173 | outdated term |
| 14 | Child Psychiatry | 162-171 | 174-183 | |
| 15 | Psychopharmacology | 172-198 | 184-210 | doses are 2010 vintage; do not use |
| 16 | Other Biological Treatments | 199-204 | 211-216 | describes direct (unmodified) ECT (214), now prohibited by MHCA s.95 |
| 17 | Psychoanalysis | 205-212 | 217-224 | |
| 18 | Psychological Treatments | 213-220 | 225-232 | |
| 19 | Emergency Psychiatry | 221-228 | 233-240 | IPC 309 "suicide punishable" (236), outdated |
| 20 | Legal and Ethical Issues | 229-234 | 241-246 | McNaughten/IPC 84, marriage/adoption/witness/will/contract, Lunacy Act 1912, **MHA 1987**, NDPS, IPS code, ICMR 2000, MCI 2002 |
| 21 | Community Psychiatry | 235-240 | 247-252 | NMHP history |
| App | Nobel prizes, contributors, glossary | 241-248 | 253-260 | |
| — | Further reading, Index | 249+ | 261-273 | cites Hamilton's *Fish* 3rd edn 1983 (262) |

---

## 3. Opportunities by chapter (Fish)

Status key: **Taught** = already covered at comparable depth (only a drill would add value); **Expand** = mentioned but thin, or not drilled; **New** = no grep hit across `src/content/study/*.ts`, `src/lib/mse/*`, `src/lib/lab/experiments.ts`, `src/lib/practice/tools.ts`. Levels: F = foundation, C = core, A = advanced/[extra]. All statuses come from case-insensitive grep on 2026-11-03. Parallel agents may change files.

### Ch 2 Disorders of perception
| Phenomenon / concept | Book ref | VIBHA module | Status (grep evidence) | Best format & why | Level | Evidence / controversy | Sensitivity |
|---|---|---|---|---|---|---|---|
| Hallucination vs illusion vs functional hallucination | p.16-18, 26 (PDF 20-22, 30) | interview-mse §2.5, §2.10 | **Taught** (master table; `confusable.ts` illusion-vs-hallucination) | Symptom Spotter items (stimulus transformed vs coexisting is easiest to grasp from the patient's own words) | F | Jaspers' definition is needed to cover functional hallucinations | — |
| Pseudohallucination (Jaspers' space vs Hare's insight) | p.18-19 (PDF 22-23) | §2.5B | **Taught** (full debate present) | Spotter items plus one "argue both sides" viva card | C/A | **Contested**: SCAN drops the term and rates location and insight separately; Fish argues for a continuum (Leff 1968) | Grief voices are normal; avoid pathologising |
| Imperative, third-person and running-commentary voices; thought echo | p.22 (PDF 26) | §2.5, §2.4b FRS | **Taught** (Gedankenlautwerden not named) | Spotter; add the German/French names to the glossary only | C | Fish: FRS are "no longer" diagnostic, being described in mania (Gonzalez-Pinto 2003). SCAN files echo under thought | Command voices mean a risk assessment |
| Voices attributed to real people ("everyone speaks Greek") | p.23 (PDF 27) | §2.5 | **Expand** | Case vignette in Clinic detective: hallucination hidden behind "people talk about me" | A | Fish's case shows unprovoked aggression explained by hidden voices | Violence risk |
| Hyper/hypoaesthesia, hyperacusis | p.14 (PDF 18) | — | **New** (no hit for hyperacusis/hyperaesthesia) | Glossary card plus one MCQ (depression and hangover vs mania and LSD) | A | Descriptive | — |
| Dysmegalopsia: micropsia, macropsia, porropsia, metamorphopsia; Lilliputian | p.15, 23, 29 (PDF 19, 27, 33) | — | **New** (no hit) | "Organic red flag" sorter: which perceptual changes point to neurology or the eye? | A | Mostly temporal/parietal and retinal; rarely schizophrenia | — |
| Distortions of the experience of time | p.16 (PDF 20) | depression, bipolar | **New** as an MSE item (no hit for time phrases) | Viva card; Spotter extension later ("the clock has stopped for me") | C | Schizophrenia time-estimation research (Tapp 1993; Manschreck 2000) | — |
| Sense of presence | p.25-26 (PDF 29-30) | — | **New** (the "presence" hits are unrelated) | Spotter extension; normal-vs-abnormal discussion | A | Occurs in healthy people, organic states, schizophrenia | Religious "presence" may be normal |
| Olfactory: hallucination vs delusion of emitting a smell | p.24 (PDF 28) | §2.5 | **Expand** | Spotter item hal-03 | C | Ask "do you actually smell it?" | Shame about body odour |
| Formication, cocaine bugs; visceral/somatic | p.24-25 (PDF 28-29) | §2.5, substance | **Taught** | Spotter hal-04 | C | — | — |
| Reflex hallucination, extracampine, autoscopy, hypnagogic | p.26-28 (PDF 30-32) | §2.5, §3.3b glossary | **Taught** | Glossary flip cards are enough | A | Hypnagogic occurs in healthy people | Reassure about normal hypnagogia |
| Charles Bonnet syndrome | p.20, 29 (PDF 24, 33) | §2.5 | **Taught** | One Clinic detective case (elderly with cataract) | C | Clear consciousness, no psychopathology | Elderly, not "psychotic" |
| Hallucinoses (alcoholic, organic) | p.26 (PDF 30) | substance, neurocognitive | **Taught** | — | C | — | — |
| Body image: hyperschemazia, phantom limb, anosognosia | p.30-31 (PDF 34-35) | brain (anosognosia only) | **Expand** (no hit for hyperschemazia/phantom limb) | Brain-and-behaviour card | A | — | — |

### Ch 3 Disorders of thought and speech
| Phenomenon / concept | Book ref | VIBHA module | Status | Best format & why | Level | Evidence / controversy | Sensitivity |
|---|---|---|---|---|---|---|---|
| Stream / possession / content / form framework | p.34 (PDF 38) | §2.4 | **Taught** | — | F | Fish calls any division "arbitrary" | — |
| Flight of ideas vs prolixity vs incoherence | p.34-35 (PDF 38-39) | §2.4, §2.10, `confusable.ts` | **Taught** (Fish's own example is reused) | Spotter foi-01/02 (original Indian examples) | F | Flight without pressure in mixed states | — |
| Circumstantiality vs tangentiality vs derailment | p.35, 47 (PDF 39, 51) | §2.4, §2.10, `confusable.ts` thought-form-set | **Taught** | Spotter items with the interviewer `prompt` shown (tangentiality only makes sense against the question) | F/C | Fish does **not** use "tangentiality" (a later rating-scale term) | — |
| Slowing/inhibition of thinking leading to pseudodementia | p.35 (PDF 39) | depression, neurocognitive | **Taught** | — | C | — | — |
| Perseveration vs verbal stereotypy; thought block vs normal losing the thread | p.36 (PDF 40) | §2.10 | **Taught** | Spotter blk-01; perseveration needs a two-question format (not in v1) | C | Block is "highly suggestive" but anxiety mimics it | — |
| Obsessions: ego-dystonic, resisted; obsessional images vs pseudohallucination; contrast thinking | p.36-38 (PDF 40-42) | §2.4b, ocd | **Taught**, **Expand** (contrast thinking, obsessional image vs pseudohallucination: no hit) | Spotter obs-01..03 | C | Up to 14% of OCD report psychotic-like phenomena (Eisen & Rasmussen 1993, cited) | Harm-to-baby and blasphemous obsessions: shame; reassure |
| Thought insertion / withdrawal ("deprivation") / broadcasting | p.38 (PDF 42) | §2.4b, psychosis | **Taught**; **Expand** on the point that broadcasting has several definitions, so record it verbatim | Spotter; the explanations stress definitional variation | C | Insertion "not unique to schizophrenia" (Mullins & Spence 2003). Broadcasting definitions vary (Pawar & Spence 2003) | Sorcery attributions are common in India: assess, do not mock |
| Delusion definition; delusion-like idea; overvalued idea | p.39 (PDF 43) | §2.4b, §2.10 | **Taught** | Spotter (overvalued-idea vs delusion vs obsession is the hardest triad) | C | Overvalued vs delusion "difficult" (McKenna 1984) | BDD and anorexia items |
| Primary delusional experience: mood, perception, autochthonous; two-memberedness; misinterpretation | p.39-40 (PDF 43-44) | §2.4b | **Taught** | Spotter dlp-01/02 vs del-04 (misinterpretation trap) | C/A | Primary delusions are no longer held to be diagnostic of schizophrenia | — |
| Delusional memory (two-membered vs sudden idea) | p.40, 62 (PDF 44, 66) | — | **New** (no hit) | Two-card A/B drill: "the spoon with a crown" logic, using an original example | A | Definitions vary | — |
| Content: persecution, infidelity (morbid jealousy), love, grandiose, ill health, guilt, nihilism, poverty | p.41-45 (PDF 45-49) | §2.4b, psychosis | **Taught** | Spotter del-02..05 | C | "Delusion of jealousy" is a misnomer: delusion of infidelity (Munro 1999) | Partner risk in jealousy; stalking in erotomania; suicide in guilt/nihilism |
| Cognitive neuropsychiatry of delusions: jumping to conclusions (Huq 1988; Garety 1991), Bentall | p.45-46 (PDF 49-50) | lab | **New** (no hit; `experiments.ts` has stroop, muller-lyer, etc.) | **Lab experiment**: a beads-task simulation (draws to decision), with an honest caveat that it is a group-level bias, not diagnostic | A | JTC is replicated at group level but effect sizes and specificity are debated (the book cites only early studies) | Do not imply a student "has" delusional thinking |
| Formal thought disorder: Bleuler, Cameron (asyndesis, metonyms, over-inclusion), Goldstein (concrete), Schneider's 5 features; transitory, drivelling, desultory | p.46-48 (PDF 50-52) | §2.4 [extra] | **Taught** (5 features, metonyms, over-inclusion present); **Expand** (transitory/drivelling/desultory: no hit) | Reading only, [extra]; low clinical yield | A | Hard to tell apart clinically (Fish says so) | — |
| Mutism, elective mutism, akinetic mutism | p.48-49 (PDF 52-53) | child, anxiety, §2.2 | **Taught** | — | C | — | — |
| Vorbeireden / approximate answers / Ganser | p.49, 61-62 (PDF 53, 65-66) | — | **New** (no hit for Ganser, Vorbeireden, approximate answer) | Spotter apx-01/02 (needs `prompt`), plus a short note in more-disorders (dissociative) | A | Psychogenic vs organic causes disputed (Ungvari & Mullen; Latcham, cited) | Avoid "malingering" labels; prison context |
| Neologism (technical, stock-word), paraphasia, malapropism | p.49-50 (PDF 53-54) | §2.2 | **Taught** | Spotter neo-01/02 | C | — | Check dialect and code-mixing first (Hinglish is not neologism) |
| Schizophasia / word salad; aphasias | p.50-52 (PDF 54-56) | §2.2, brain | **Taught** | — | C | — | — |

### Ch 4 Disorders of memory
| Phenomenon / concept | Book ref | VIBHA module | Status | Best format & why | Level | Evidence / controversy | Sensitivity |
|---|---|---|---|---|---|---|---|
| Retrospective falsification | p.59 (PDF 63) | — | **New** (no hit) | Spotter rtf-01/02 (with context `prompt`); a link in depression notes | C | Any illness can colour recall | History-taking: corroborate with family |
| False memory | p.59-60 (PDF 63-64) | brain, §2.6 | **Taught** | — | A | **Controversial** (recovered-memory debates; Gudjonsson 1997 cited) | Trauma disclosure: neutral stance |
| Confabulation (embarrassed vs fantastic) | p.60 (PDF 64) | §2.6, neurocognitive, substance | **Taught** | Spotter cnf-01/02 | C | — | Korsakoff/alcohol stigma |
| Pseudologia fantastica | p.61 (PDF 65) | personality | **Taught** | — | A | — | — |
| Munchausen | p.61 (PDF 65) | more-disorders (factitious) | **Taught** | — | A | — | — |
| Retrospective delusions; delusional memory | p.62 (PDF 66) | — | **New** | Viva card | A | Definitions vary | — |
| Déjà vu / jamais vu | p.62 (PDF 66) | §2.6, §2.10 | **Taught** | — | F | Common in healthy people; temporal lobe | — |
| Delusional misidentification: Capgras, Fregoli, intermetamorphosis, reduplicative paramnesia | p.63, 121-122 (PDF 67, 125-126) | — | **New** (no hit for Capgras, Fregoli, misidentification, reduplicative) | Spotter mis-01/02, plus a short [core] subsection in psychosis or neurocognitive | C | Occurs in schizophrenia **and dementia** (organic screen) | Risk to the "impostor" relative |
| Hyperamnesia, flashbulb memories, flashbacks | p.63 (PDF 67) | trauma | **Taught** (flashbacks) | — | C | — | Trauma |

### Ch 5 Disorders of emotion
| Phenomenon / concept | Book ref | VIBHA module | Status | Best format & why | Level | Evidence / controversy | Sensitivity |
|---|---|---|---|---|---|---|---|
| Normal vs abnormal emotional reactions; adjustment | p.66-68 (PDF 70-72) | trauma | **Taught** | — | F | — | — |
| Dissociation of affect; la belle indifférence | p.68 (PDF 72) | — | **New** (no hit) | One viva card; the Spotter could add it later | A | Fish: "rare nowadays". It is a poor discriminator of conversion disorder (later literature) | Do not use it to dismiss symptoms |
| Apathy vs dissociation of affect; perplexity | p.69 (PDF 73) | §2.3 (perplexity) | **Expand** | Affect-set drill (extend `confusable.ts` affect-qualities) | C | — | — |
| Blunting, flattening, incongruity (parathymia) | p.69 (PDF 73) | §2.3, §2.10, `confusable.ts` | **Taught** | — | C | Affect is observed, so it is not suited to quote-only items | — |
| Lability; emotional incontinence | p.70 (PDF 74) | §2.3 | **Taught** | Spotter lab-01 (self-reported) | C | — | — |
| Anhedonia; diurnal variation; morbid depression | p.71-72 (PDF 75-76) | depression | **Taught** | Spotter lof-02 | F | — | Suicide screen |

### Ch 6 Disorders of the experience of self
| Phenomenon / concept | Book ref | VIBHA module | Status | Best format & why | Level | Evidence / controversy | Sensitivity |
|---|---|---|---|---|---|---|---|
| Jaspers' four aspects of self-experience (activity, unity, continuity, boundaries) | p.75 (PDF 79) | — | **New** (no hit for self-experience / ego consciousness) | Organising card: sort the Spotter's self/passivity items onto the four aspects | A | — | — |
| Depersonalisation vs derealisation; vs nihilistic delusion | p.75-77 (PDF 79-81) | §2.5D, §2.10, anxiety, more-disorders | **Taught** | Spotter dep/drl, del-02 | F | Common: once in 30-70% of young adults (Freeman 1996, cited) | Very frightening; "am I going mad?" reassurance |
| Loss of emotional resonance ("feeling of not feeling") | p.77 (PDF 81) | depression (anhedonia) | **Expand** | Spotter lof-01 | C | — | Guilt about not feeling love for children |
| Self-unity ("as if two persons"); continuity ("died under the old name"); DID | p.77-78 (PDF 81-82) | more-disorders (DID) | **Expand** (unity and continuity: no hit) | Viva cards | A | DID "rare and controversial" (ICD-10) | Possession beliefs: cultural framing |
| Ego boundaries; passivity / made experiences; apophanous "made" world | p.78-79 (PDF 82-83) | §2.4b, §2.5E, psychosis | **Taught** (passivity); **Expand** (boundary framing) | Spotter pas-01..03 | C | — | — |
| Theory of mind in psychosis | p.79-80 (PDF 83-84) | child (autism only) | **Expand** | Brain/psychosis note | A | Not specific to paranoia (Langdon 1997, cited) | — |

### Ch 7 Disorders of consciousness
| Phenomenon / concept | Book ref | VIBHA module | Status | Best format & why | Level | Evidence / controversy | Sensitivity |
|---|---|---|---|---|---|---|---|
| Attention, vigilance, mind-set | p.81-82 (PDF 85-86) | §2.6 | **Taught** | — | F | — | — |
| Clouding; delirium (dream-like, perplexed) | p.83-84 (PDF 87-88) | §2.6, neurocognitive | **Taught** | — | C | — | Medical emergency |
| Lowering of consciousness (torpor); restriction and twilight states | p.84-85 (PDF 88-89) | — | **New** (no hit for torpor or twilight) | Short note in neurocognitive, plus one Clinic detective case (post-ictal twilight vs dissociative fugue) | A | Organic vs dissociative "twilight" usage differs (Sims; ICD-10) | Epilepsy stigma; forensic angle (violence in twilight states) |

### Ch 8 Motor disorders
| Phenomenon / concept | Book ref | VIBHA module | Status | Best format & why | Level | Evidence / controversy | Sensitivity |
|---|---|---|---|---|---|---|---|
| Subjective motor alienation: "as if" (depersonalisation, obsessional) vs true passivity | p.87-88 (PDF 91-92) | §2.4b | **Expand** | Spotter pas-01 vs dep-01 vs cmp-01 | C | Fish: this distinction is "crucial" to avoid misdiagnosis | — |
| Expressive movements; mannerisms; stereotypies; tics | p.88-93 (PDF 92-97) | §2.1, psychosis | **Taught** | Video/observation (not quotes) | C | — | — |
| Automatic obedience, echopraxia/echolalia | p.94 (PDF 98) | §2.1 | **Taught** | — | C | — | — |
| Mitgehen, Mitmachen, Gegenhalten; obstruction vs ambitendency | p.95-97 (PDF 99-101) | §2.1 (ambitendency only) | **New** (no hit for Mitgehen/Mitmachen/Gegenhalten; "obstruction" only in drug files) | Short animated demos (an examiner's hand and the patient's arm), better than text because these are *elicited* signs | A | Catatonia scales (Bush-Francis) use some of them; Fish does not cite scales | Examination needs consent and gentleness |
| Verbigeration, motor speech mannerisms | p.97-98 (PDF 101-102) | §2.2 | **Taught** | — | A | — | — |
| Posture: waxy flexibility, catalepsy, psychological pillow | p.98-99 (PDF 102-103) | §2.1, psychosis | **Taught** | — | C | — | — |
| Stupor, excitement | p.100-102 (PDF 104-106) | psychosis, bipolar | **Taught** | — | C | — | Medical risk in stupor |
| Antipsychotic movement disorders; subjective akathisia | p.104 (PDF 108) | antipsychotics, `confusable.ts` akathisia-vs-anxiety | **Taught** | Spotter aka-01/02 | C | Some abnormal movements are present before medication (Gervin 1998, cited) | Akathisia distress; tell the prescriber |

### Ch 9, Appendices
| Phenomenon / concept | Book ref | VIBHA module | Status | Best format & why | Level | Evidence / controversy | Sensitivity |
|---|---|---|---|---|---|---|---|
| Personality: dimensions vs categories; SAPAS/PDE | p.107-110 (PDF 111-114) | personality | **Taught** | — | C | Book is DSM-IV/ICD-10. ICD-11 is now dimensional (severity plus trait domains), so **flag outdated** | Labels are stigmatising |
| Eponymous syndromes (Capgras, Fregoli, Cotard, de Clérambault, Othello, Ekbom, Ganser, Korsakoff…) | App I p.121-125 (PDF 125-129) | partly (Cotard, Clérambault, Korsakoff taught; Capgras, Fregoli, Ekbom, Ganser **New**) | **Expand** | **Match game** (eponym ↔ one-line description ↔ an original patient quote). Good for vivas | C | — | — |
| Defence mechanisms; cognitive distortions | App II p.126-130 (PDF 130-134) | defences, therapies, depression | **Taught** | — | F | — | — |

---

## 4. Ahuja: what is usable, and what is outdated

| Topic | Ahuja ref | VIBHA module | Status | Best format & why | Level | Evidence / controversy | Sensitivity |
|---|---|---|---|---|---|---|---|
| Schneider's FRS table; "not specific" | Ch 5 p.54-55 (PDF 66-67) | psychosis, §2.4b | **Taught** | — | C | FRS specificity is **debated**: they occur in mania and organic states; ICD-11 and DSM-5 no longer give them special weight | — |
| von Domarus law, illustrated with a Hindu deity | Ch 5 p.55 (PDF 67) | — | **New** (no hit) | If taught, use a **neutral** original example | A | Paleological thinking is a historical concept | **Religious example: do not reuse** |
| Somatic passivity filed under Perception | Ch 2 p.13 (PDF 25) | §2.5E | **Taught** (VIBHA matches) | — | C | Fish files passivity under self (Ch 6), so filing varies by textbook | — |
| Delusional disorder subtypes; Othello, de Clérambault; Capgras | Ch 7 p.84, 87 (PDF 96, 99) | psychosis | **Expand** (Capgras **New**) | Spotter mis-01/02 | C | — | Partner risk |
| Trance and possession disorder ("very commonly seen in India"); Ganser | Ch 8 p.102 (PDF 114) | more-disorders | **Taught**/**Expand** | Activity 3 "Culture or symptom?" | C | Possession is a recognised ICD-11 dissociative category; cultural sanction decides normality | Respect religious frameworks |
| Dhat, koro, amok, latah; Indian syndromes (Suchi-bai, Jhinjhinia…) | Ch 8 p.110-111 (PDF 122-123) | more-disorders, §2.12 | **Taught** (dhat, koro) | Activity 3 | C | **Outdated framing**: "culture-bound syndrome" became DSM-5 "cultural concepts of distress"; dhat often co-occurs with depression | Sexual shame; avoid ridicule |
| MHA 1987, IPC 84/309, Evidence Act, marriage/adoption/will/contract, NDPS, IPS code, ICMR 2000, MCI 2002 | Ch 20 p.229-234 (PDF 241-246); Ch 19 p.224 (PDF 236) | ethics-law | **Taught** (the module is already on the MHCA 2017 and BNS s.22) | Activity 2 "Then and now", which teaches students to **date-check textbooks** | C | See below | Suicide decriminalisation is a sensitive topic |
| Direct (unmodified) ECT | Ch 16 p.202 (PDF 214) | ethics-law §2.4 | **Taught** (s.95) | Activity 2 law-11 | C | Prohibited under MHCA s.95 | — |

**Outdated legal content in Ahuja (2010). Do not import it into VIBHA as current:**
- **Mental Health Act 1987** (Ch 20): repealed by the **Mental Healthcare Act 2017** (in force 29 May 2018). The admission routes (90-day "special circumstances", reception orders), the "mentally ill person" definition, licensing, and the rights chapter have all been replaced (supported admission up to 30 days s.89 / beyond s.90, advance directive, nominated representative, Review Boards, Chapter V rights, s.95 ECT, s.115 suicide).
- **IPC s.84** → **BNS 2023 s.22** (same test, in force 1 July 2024). **IPC s.309** "suicide punishable" (Ch 19): overridden by MHCA s.115; the BNS has no general offence of attempting suicide (*verify the exact BNS position before release*).
- **Indian Evidence Act 1872 s.118** → Bharatiya Sakshya Adhiniyam 2023 (*verify the new section number*).
- **Hindu Marriage Act s.5(ii)(c)**: "epilepsy" was removed by amendment (*verify year, reported as 1999*).
- **MCI Code 2002** → National Medical Commission (NMC Act 2019). **ICMR 2000** → ICMR National Ethical Guidelines 2017.
- **NDPS 1985**: still in force but amended many times (penalties and quantities: *verify current*).
- Terminology: "mental retardation", "lunatic"/"idiot" (quoted historical law), "culture-bound syndrome", "DSM-V likely 2012-14".
- Psychopharmacology doses (Ch 15) are 2010 vintage and should not be used.

---

## 5. Recommended builds (in priority order)

1. **Symptom Spotter game** (`format: "phenomenon-spotter"`, module interview-mse): data ready in the JSON. It has 64 original quotes, 29 categories in 8 groups (16 flagged `core` for a starter round), 2-3 classic distractors per item, a one- or two-sentence explanation, a Fish page reference, a level (1-3), an optional interviewer `prompt`, and an optional `sensitivity` note. Fits next to MSE ladder Level 3 (`src/lib/mse/confusable.ts`) as "Level 3b: from the patient's mouth". Suggested UI: show the quote (and prompt), offer answer plus distractors in shuffled order, show the explanation after each answer, and track mistakes per pair of confused categories so `weak-spots.ts` can resurface them.
2. **Small content additions** (New items, each about one paragraph, written in our own words): delusional misidentification (psychosis or neurocognitive), Vorbeireden/Ganser (more-disorders), retrospective falsification (interview-mse §1.5 history caveats or depression), twilight/torpor (neurocognitive), Mitgehen/Gegenhalten/obstruction (psychosis catatonia), sense of presence and micropsia/Lilliputian as "organic red flags" (§2.5 [extra]).
3. **Lab experiment: beads task (jumping to conclusions)** for `src/lib/lab/experiments.ts`. Present it as a group-level reasoning bias, with honest caveats.
4. **Eponym match** from Fish Appendix I.
5. **Then and now** law sorter (Ahuja) and **Culture or symptom?** (Ahuja plus Fish's definition of delusion) in the JSON. Both reinforce existing modules rather than adding new content.

## 6. Integrity notes
- Every Spotter quote is written new for VIBHA (Indian settings: Dadar station, dabba, puja, tantrik, pressure cooker). No patient wording from Fish is reused. Fish's own examples (Kingstanding, John Major, the Greek patient, the crown spoon, "guided missile") are deliberately **not** used, because §2.4 of the module already uses the Kingstanding example.
- Explanations paraphrase Fish's criteria. The only direct borrowings are short technical terms (two-memberedness, "thought deprivation", "obsessional motor acts", "feeling of not feeling").
- `src/lib/study/study.test.ts` rejects **book names inside module text**, so `bookRef` and `ref` must stay as metadata and never be shown in module Markdown.
- Statuses are grep-based. A "Taught" term may still be shallow, and parallel agents may have edited modules since 2026-11-03.
- Legal items marked `verify: true` in the JSON need checking by the ethics-law content owner against gazetted texts. I have not invented any section numbers beyond those already used in `ethics-law.ts` (BNS s.22, MHCA s.89/90/95/115), apart from MHCA s.2(1)(s) and s.103, which are flagged for verification.
