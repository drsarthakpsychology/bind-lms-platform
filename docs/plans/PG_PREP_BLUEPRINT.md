# Postgraduate prep: content blueprint

> **As of 6 Nov 2026.** Plan only, no code. Facts and sources are in [PG_PREP_RESEARCH.md](PG_PREP_RESEARCH.md). Anything here marked **VIBHA DESIGN** is our choice, not an exam fact.
> Follows owner decisions in [STUDENT_LEARNING_PLAN.md](STUDENT_LEARNING_PLAN.md):
> - no week timelines and no week numbers (Q17)
> - 15–20 question placement (Q41)
> - about 70% success target (Q44)
> - 20–30 minute sittings (Q7)
> - citations admin-only (Q10)
> - publish, then review (Q11)

## Contents
1. [Master topic tree](#1-master-topic-tree): exams served, depth, module map, gaps
2. [New material needed](#2-new-material-needed-gap-list-in-build-order): gap list in build order
3. [Question-bank plan](#3-question-bank-plan): counts, difficulty, types, item rules
4. [Mock exam specs](#4-mock-exam-specs)
5. [Mock-interview bank](#5-mock-interview-bank)
6. [**Student pathway**](#6-student-pathway-one-flow-never-more-than-3-next-actions): one flow, never more than 3 next actions

---

## Keys used in the tables

**Exams column**

| Code | Exam |
|---|---|
| **C** | CUET PG HUQP20 |
| **N** | UGC NET Paper 2 (code 04) |
| **P1** | UGC NET Paper 1 |
| **M** | Clinical master's entrances (NIMHANS, CIP, IHBAS, RINPAS, GMCH, LGBRIMH, university M.Clin.Psy) |
| **S** | MA/MSc semester exams |

**Depth** (the highest any served exam needs)

| Level | What the student must do |
|---|---|
| 1 | Recognise: name, define, match a term to a person |
| 2 | Explain: compare look-alikes, give an example |
| 3 | Apply: calculate, choose a test or design, solve a vignette |
| 4 | Integrate: critique, link domains, near-identical options, viva-level |

**Modules column:** existing VIBHA module ids from `src/content/study/*.ts` (number in brackets), with `§` giving the section. **NEW-x** = a module that must be written (see §2).

**Items column:** the target number of MCQs (VIBHA DESIGN).

---

## 1. Master topic tree

### A. Foundations: history, schools, Indian psychology (150 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| A1 | Definition, goals, fields, methods of psychology | C S | 2 | — | Full | 25 |
| A2 | Philosophical roots; early experimental work (Wundt, Fechner, Ebbinghaus, Titchener, James) | C N M | 2 | — | Full | 25 |
| A3 | Schools: structuralism, functionalism, behaviourism, Gestalt, psychoanalysis, humanistic, cognitive | C N M S | 3 | `defences` (3) §1.1–1.3 (Freud, after Freud, learning theories) | Partial: no structuralism, functionalism, Gestalt or cognitive revolution | 40 |
| A4 | Indian psychological thought: Gita, Buddhism, Sufism, Integral Yoga, Yoga, triguna | N S | 3 | `therapies` (13) §3.4 (Indian clients) only | Full | 30 |
| A5 | Indian academic psychology: phases, colonialism, identity, indigenisation | N | 2 | — | Full | 15 |
| A6 | Paradigms (ontology, epistemology, methodology); crisis in experimental psychology; science and spirituality | N | 3 | — | Full | 15 |

### B. Research methods (250 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| B1 | Research problem, variables, hypotheses, operational definitions | C N M S P1 | 3 | `exam-prep` (33) §2.2 practice set A | Teaching text missing (practice items only) | 35 |
| B2 | Sampling: probability and non-probability, sample size | N M S P1 | 3 | `exam-prep` §2.2 | Full | 30 |
| B3 | Experimental designs; controlling variance; internal and external validity; threats | C N M S | 4 | `frontiers` (32) §1.2 (blinding, placebo) | Most | 45 |
| B4 | Quasi-experimental, single-subject (ABAB, multiple baseline), developmental designs | N M S | 3 | — | Full | 30 |
| B5 | Survey, correlational, observation, case study, interview methods | C N S | 2 | — | Full | 25 |
| B6 | Qualitative: grounded theory, phenomenology/IPA, thematic, discourse, narrative, ethnography, focus groups | N S | 3 | — | Full | 40 |
| B7 | Mixed methods, programme evaluation, internet-based research | N S | 2 | — | Full | 15 |
| B8 | Research ethics, consent, plagiarism, APA referencing, article and thesis structure | N M S P1 | 2 | `ethics-law` (21) §1.1–1.2 (clinical ethics) | Research-specific ethics missing | 30 |

### C. Statistics (250 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| C1 | Scales of measurement; frequency distributions; central tendency; dispersion | C N M S P1 | 3 | `assessment` (4) §1.2 (scores and the normal curve) | Most | 35 |
| C2 | Normal curve, skewness, kurtosis, z, T, percentiles, stanines | C N M S | 3 | `assessment` §1.2 | Partial | 30 |
| C3 | Probability, sampling distribution, standard error, confidence interval | N M S | 3 | — | Full | 25 |
| C4 | Hypothesis testing: Type I/II error, α, power, effect size (d, η²), one- vs two-tailed | C N M S | 4 | `frontiers` §1.2 (effect sizes) | Partial | 35 |
| C5 | t-tests; one-way, two-way and repeated-measures ANOVA; post hoc; ANCOVA; MANOVA | C N M S | 3 | — | Full | 45 |
| C6 | Correlation: Pearson, Spearman, point-biserial, biserial, phi, tetrachoric, partial, multiple; regression | C N M S | 3 | — | Full | 40 |
| C7 | Non-parametric: χ², Mann-Whitney, Wilcoxon, Kruskal-Wallis, Friedman, sign test | C N M S | 3 | — | Full | 25 |
| C8 | Factor analysis (EFA, CFA), SEM, mediation and moderation (concepts) | N S | 2 | — | Full | 15 |

### D. Psychometrics and testing (250 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| D1 | Test types and characteristics; history of testing | C N M S | 2 | `assessment` §1.1 | Small | 20 |
| D2 | Test construction; item analysis (difficulty, discrimination); CTT vs IRT | N M S | 3 | `assessment` §1.1 | Most: no item analysis or IRT | 40 |
| D3 | Reliability: test-retest, split-half, Spearman-Brown, KR-20, α, inter-rater; SEM | C N M S | 3 | `assessment` §1.1 | Calculations missing | 40 |
| D4 | Validity: content, criterion (concurrent, predictive), construct (convergent, discriminant), MTMM, face | C N M S | 3 | `assessment` §1.1 | Partial | 30 |
| D5 | Norms, standardisation, derived scores | C N M S | 2 | `assessment` §1.2 | Small | 20 |
| D6 | Intelligence and aptitude tests: Wechsler, Stanford-Binet, Raven, MISIC, Bhatia, Binet-Kamat, DAT | N M S | 3 | `assessment` §2.1, §2.5 | Indian tests thin | 35 |
| D7 | Personality tests: MMPI, 16PF, NEO, EPQ; projectives: Rorschach, TAT, CAT, SCT, draw-a-person | N M S | 3 | `assessment` §2.2, §2.6 | Small | 35 |
| D8 | Interest and aptitude inventories; attitude scales (Likert, Thurstone, Guttman, semantic differential); computer-based testing | N S | 2 | — | Full | 20 |
| D9 | Testing ethics; cultural adaptation; test fairness | N M S | 2 | `assessment` §3.2 | Small | 10 |

### E. Biological bases (230 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| E1 | Neuron, resting and action potential, synapse | C N M | 3 | `brain` (2) §1.1 | Small | 35 |
| E2 | Neurotransmitters and receptors | C N M | 3 | `brain` §1.2–1.3 | Small | 30 |
| E3 | CNS structures, lobes, hemispheric specialisation, split brain | C N M S | 3 | `brain` §2.1, §2.3 | Split-brain and lateralisation thin | 40 |
| E4 | PNS, ANS, endocrine glands and hormones | C N M | 2 | `brain` §2.2 | Endocrine missing | 25 |
| E5 | Brain methods: EEG, ERP, CT, MRI, fMRI, PET, TMS, lesion studies | N M S | 2 | `brain` §2.5 | Small | 20 |
| E6 | Biology of hunger, thirst, sleep (stages, circadian), sex | C N M | 3 | `brain` §2.2; `more-disorders` (20) (sleep) | Hunger, thirst, sex missing | 30 |
| E7 | Biology of emotion and stress: limbic system, HPA axis, psychoneuroimmunology | N M | 3 | `brain` §2.2; `frontiers` §3.1 | Small | 20 |
| E8 | Genetics: chromosomes, anomalies (Down, Turner, Klinefelter, fragile X), twin and adoption studies, epigenetics | C N M | 3 | `child` (18) §2.5; `frontiers` §3.2 | Behaviour-genetics methods missing | 30 |

### F. Sensation, attention, perception (150 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| F1 | Psychophysics: thresholds, Weber, Fechner, Stevens, signal detection theory | C N M | 3 | — | Full | 30 |
| F2 | Sensory systems: vision (colour theories), audition (place, frequency), other senses | C N M | 2 | — | Full | 25 |
| F3 | Attention: selective (Broadbent, Treisman, Deutsch-Norman), capacity (Kahneman), divided, sustained | C N M S | 3 | — | Full | 35 |
| F4 | Perceptual organisation (Gestalt laws), form and pattern recognition | C N M | 2 | — | Full | 25 |
| F5 | Depth cues, movement perception, constancies, illusions | C N M | 2 | — | Full | 25 |
| F6 | Theories (Gibson, Gregory); culture and motivation in perception; perceptual defence | N M | 3 | — | Full | 10 |

### G. Learning (150 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| G1 | Classical conditioning: phenomena, Rescorla-Wagner, taste aversion, preparedness | C N M S | 3 | `defences` §1.3; `therapies` §2.1 | Phenomena and theory thin | 35 |
| G2 | Instrumental and operant conditioning: Thorndike, Skinner, schedules, shaping, punishment, learned helplessness | C N M S | 3 | `defences` §1.3; `therapies` §2.1 | Schedules missing | 40 |
| G3 | Cognitive and social learning: Tolman, Köhler (insight), Bandura | C N M S | 2 | `defences` §1.3 | Partial | 25 |
| G4 | Behaviour modification: token economy, systematic desensitisation, aversion, modelling | N M S | 3 | `therapies` §2.1, §2.4 | Small | 25 |
| G5 | Learning theorists (Hull, Guthrie, Estes); neurophysiology of learning (LTP) | N | 2 | — | Full | 25 |

### H. Memory and forgetting (150 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| H1 | Models: Atkinson-Shiffrin, levels of processing, Baddeley's working memory | C N M S | 3 | `brain` §2.4 (memory systems) | Cognitive models missing | 40 |
| H2 | Encoding, storage, retrieval; episodic, semantic, procedural; implicit vs explicit; priming | C N M S | 3 | `brain` §2.4 | Partial | 35 |
| H3 | Forgetting: decay, interference, retrieval failure, motivated forgetting; Ebbinghaus curve | C N M | 2 | — | Full | 30 |
| H4 | Reconstructive memory, schema, eyewitness testimony, false memory | N M S | 2 | — | Full | 20 |
| H5 | Neural basis; amnesias (anterograde, retrograde, Korsakoff, HM case) | C N M | 3 | `brain` §2.4; `neurocognitive` (17); `substance` (15) | Small | 25 |

### I. Thinking, language, intelligence, creativity (180 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| I1 | Concept formation, deductive and inductive reasoning | N M S | 2 | — | Full | 25 |
| I2 | Problem solving (Newell-Simon, insight, set, functional fixedness), heuristics and biases, decision making, metacognition | N M S | 3 | — | Full | 35 |
| I3 | Language and thought (Whorf, Chomsky, Vygotsky, Piaget); language acquisition | N M S | 2 | `brain` §2.3 (aphasias only) | Full | 25 |
| I4 | Intelligence theories: Spearman, Thurstone, Guilford, Cattell, CHC, Gardner, Sternberg, PASS (Das, Kar & Parrila); emotional intelligence | C N M S | 3 | `assessment` §2.5 | Small | 50 |
| I5 | Creativity: stages, theories, Guilford, Torrance; link with intelligence | C N S | 2 | — | Full | 25 |
| I6 | Heredity and environment in intelligence; Flynn effect; giftedness; intellectual disability levels | C N M | 2 | `child` §2.1 | Partial | 20 |

### J. Personality (200 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| J1 | Freud; neo-Freudians: Jung, Adler, Horney, Erikson, Fromm, Sullivan | C N M S | 3 | `defences` §1.1–1.2; `psychodynamics` (30) §1.2–2.3 | Small | 45 |
| J2 | Type and trait: Allport, Cattell, Eysenck, Big Five, HEXACO | C N M S | 3 | `personality` (14) §1.2, §2.5 | Theorist-level detail thin | 40 |
| J3 | Humanistic and existential: Rogers, Maslow, May | C N M S | 2 | — | Full | 25 |
| J4 | Social-cognitive: Bandura, Rotter (locus of control), Mischel (CAPS), Kelly (PCT) | N M S | 3 | — | Full | 30 |
| J5 | Biological and evolutionary personality; Indian views (triguna, Vedic self) | N S | 2 | — | Full | 20 |
| J6 | Self and self-concept; explanatory style; moral development (Kohlberg, Gilligan) | N S | 2 | `defences` §3.4 (Kohlberg) | Partial | 25 |
| J7 | Personality assessment (links to D7) | C N M S | 3 | `personality` §1.3; `assessment` §2.2 | Small | 15 |

### K. Motivation, emotion, stress, coping (160 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| K1 | Theories of motivation: instinct, drive (Hull), arousal (Yerkes-Dodson), incentive, Maslow, self-determination, McClelland (achievement, affiliation, power) | C N M S | 3 | — | Full | 45 |
| K2 | Curiosity, sensation seeking, flow, self-regulation | N S | 2 | — | Full | 20 |
| K3 | Theories of emotion (James-Lange, Cannon-Bard, Schachter-Singer, Lazarus, facial feedback); emotion regulation (Gross) | C N M S | 3 | — | Full | 40 |
| K4 | Stress: Selye's GAS, Lazarus transactional model, life events (Holmes-Rahe), hassles; Type A–D | N M S | 3 | `brain` §2.2 (biology only) | Psychological models missing | 30 |
| K5 | Coping styles; stress management (relaxation, biofeedback, mindfulness) | N M S | 2 | `therapies` §2.3 | Partial | 25 |

### L. Social psychology (220 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| L1 | History, scope, perspectives, methods | N S | 1 | — | Full | 15 |
| L2 | Social cognition, schemas; attribution (Heider, Jones-Davis, Kelley, Weiner); attribution errors | N M S | 3 | — | Full | 35 |
| L3 | Attitudes: formation, measurement, change (dissonance, ELM, persuasion) | N M S | 3 | — | Full | 35 |
| L4 | Social influence: conformity (Asch, Sherif), compliance techniques, obedience (Milgram) | N M S | 2 | — | Full | 30 |
| L5 | Groups: facilitation, loafing, groupthink, polarisation, deindividuation; leadership | N M S | 2 | — | Full | 30 |
| L6 | Prejudice, stereotypes, discrimination; intergroup theories (social identity, realistic conflict, contact hypothesis) | N M S | 3 | — | Full | 30 |
| L7 | Prosocial behaviour (bystander effect, empathy-altruism); aggression theories | N M S | 2 | — | Full | 25 |
| L8 | Applied: environment, crowding, personal space, territoriality, law; peace psychology | N S | 2 | — | Full | 20 |

### M. Lifespan development (200 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| M1 | Principles; research designs (longitudinal, cross-sectional, sequential); nature and nurture | C N M S | 2 | — | Full | 25 |
| M2 | Prenatal development, teratogens, infancy, reflexes | C N M S | 2 | `child` §1.2 | Partial | 20 |
| M3 | Cognitive development: Piaget, Vygotsky, information processing | C N M S | 3 | `defences` §3.2 | Vygotsky and information processing missing | 40 |
| M4 | Erikson; attachment (Bowlby, Ainsworth, Main); temperament (Thomas & Chess) | C N M S | 3 | `defences` §3.1, §3.3, §3.4; `psychodynamics` §1.4, §2.4 | Small | 35 |
| M5 | Moral development: Piaget, Kohlberg, Gilligan | C N S | 2 | `defences` §3.4 | Small | 20 |
| M6 | Language, emotional and social development; adolescence | C N S | 2 | `child` §3.4 | Partial | 25 |
| M7 | Adulthood (Levinson), ageing, successful ageing, death and dying (Kübler-Ross) | C N S | 2 | `defences` §3.5 | Partial | 25 |
| M8 | Educational applications; school guidance | N S | 2 | — | Full | 10 |

### N. Psychopathology and diagnosis (300 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| N1 | Models of abnormality; history of classification; DSM-5-TR vs ICD-11 | C N M S | 3 | `interview-mse` (1); `frontiers` §3.3 (HiTOP, RDoC) | Models-of-abnormality overview missing | 35 |
| N2 | Neurodevelopmental: ID, autism, ADHD, learning and communication disorders | C N M S | 3 | `child` §2.1–2.4 | — | 25 |
| N3 | Schizophrenia spectrum and catatonia | C N M S | 4 | `psychosis` (9) | — | 30 |
| N4 | Depressive and bipolar disorders | C N M S | 4 | `depression` (5); `bipolar` (6) | — | 35 |
| N5 | Anxiety; OCD and related | C N M S | 4 | `anxiety` (7); `ocd` (8) | — | 30 |
| N6 | Trauma and stressor-related; dissociative; somatic symptom | C N M S | 3 | `trauma` (19); `more-disorders` (20) | — | 30 |
| N7 | Substance use and addictive | C N M S | 3 | `substance` (15) | — | 25 |
| N8 | Personality disorders | C N M S | 3 | `personality` (14) | — | 25 |
| N9 | Neurocognitive: delirium, dementias | N M S | 3 | `neurocognitive` (17) | — | 20 |
| N10 | Eating, sleep-wake, sexual dysfunctions, gender dysphoria, elimination, impulse control | N M S | 2 | `more-disorders` §1–§5; `child` §3.3 | Impulse-control disorders (kleptomania, pyromania, IED) need a short section | 25 |
| N11 | Descriptive psychopathology (signs, symptoms); suicide and risk | M S | 4 | `mse-deep` (31); `suicide` (16) | — | 20 |

### O. Clinical assessment and practice (150 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| O1 | Case history, psychiatric interview | M S | 3 | `interview-mse` | — | 25 |
| O2 | Mental status examination | M S | 4 | `interview-mse`; `mse-deep` | — | 35 |
| O3 | Neuropsychological assessment (lobe functions, batteries incl. NIMHANS battery, Luria-Nebraska, Halstead-Reitan) | N M S | 3 | `assessment` §2.3, §2.7; `brain` §2.3 | Named Indian battery detail thin | 30 |
| O4 | Rating scales (HAM-D, BDI, Y-BOCS, PANSS, BPRS, MMSE, MoCA, CARS, Conners) | M S | 2 | `assessment` §2.4; disorder modules | Small | 25 |
| O5 | Report writing, formulation (5 Ps, psychodynamic) | M S | 3 | `case-sheet` (22); `therapies` §1.2; `psychodynamics` §3.1 | — | 20 |
| O6 | Indian tests and adaptations (VSMS, Binet-Kamat, MISIC, PGI batteries, Bhatia) | M | 2 | `assessment` §2.1 | Partial | 15 |

### P. Interventions: therapy and counselling (200 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| P1 | Common factors, therapeutic alliance, counselling process and microskills | N M S | 3 | `therapies` §1.1, §1.3 | Microskills missing | 30 |
| P2 | Psychodynamic therapies | N M S | 3 | `therapies` §3.1; `psychodynamics` §3.3 | — | 25 |
| P3 | Behaviour therapy, CBT (Beck), REBT (Ellis) | C N M S | 4 | `therapies` §2.1–2.2, §2.4–2.5 (REBT included) | — | 45 |
| P4 | Third wave: ACT, DBT, MBCT, MBSR | N M S | 3 | `therapies` §2.3, §2.5 | — | 25 |
| P5 | Humanistic and existential: person-centred, Gestalt therapy, logotherapy | C N M S | 2 | `therapies` §3.5 | Partial | 20 |
| P6 | Family, couple, group, expressive (art, music, play, drama) therapies | N M S | 2 | `therapies` §3.3 | Expressive therapies missing | 20 |
| P7 | Counselling specialties: career, school, crisis, guidance; assessment in counselling | N S | 2 | — | Full | 20 |
| P8 | Indian approaches (yoga, meditation, cultural adaptation); medicines basics for psychologists | N M S | 2 | `therapies` §3.4; `antidepressants` (10), `antipsychotics` (11), `stabilisers` (12), `medicine-profiles` (23) | — | 15 |

### Q. Ethics, law, mental health systems (100 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| Q1 | Ethical principles and dilemmas (APA, RCI code) | M S | 3 | `ethics-law` §1.1–1.5 | — | 30 |
| Q2 | Mental Healthcare Act 2017 | M S | 3 | `ethics-law` §2.1–2.6 | — | 35 |
| Q3 | RPwD Act 2016, RCI Act 1992, POCSO, NDPS (relevant parts) | M S | 2 | `ethics-law` §1.4, §3.1–3.3 (RCI registration); `child` §4.1 | The M.Clin.Psy / PsyD route and the CRR need adding | 20 |
| Q4 | Systems: NMHP, DMHP, Tele-MANAS, National Suicide Prevention Strategy; the RCI M.Phil → M.Clin.Psy change | M | 2 | — | Full | 15 |

### R. Applied and emerging areas (220 items)
| ID | Topic | Exams | Depth | Maps to | Gap | Items |
|---|---|---|---|---|---|---|
| R1 | Health psychology: HBM, TPB, TTM; PNI; chronic illness; lifestyle | N S | 3 | `frontiers` §3.1 (inflammation only) | Full | 45 |
| R2 | Positive psychology: PERMA, character strengths, resilience, post-traumatic growth | N S | 2 | — | Full | 40 |
| R3 | Organisational: work motivation, leadership, OB, HRD, OD | N S (M for NIMHANS I/O area) | 2 | — | Full | 45 |
| R4 | Community and cultural / cross-cultural psychology | N S | 2 | — | Full | 25 |
| R5 | Gender, poverty, disability, migration; stigma, abuse, violence | N S | 2 | `child` §4.1 (abuse); `ethics-law` §3.1 | Mostly | 25 |
| R6 | Psychology and technology: digital learning, online behaviour, cyberpsychology, parental mediation | N S | 2 | `frontiers` §3.4 (AI, digital phenotyping) | Mostly | 20 |
| R7 | Environmental, sports, forensic (short) | N S | 1 | — | Full | 20 |

### S. UGC NET Paper 1 (500 items)
| ID | Unit | Items | Notes |
|---|---|---|---|
| S1 | Teaching aptitude | 50 | |
| S2 | Research aptitude | 50 | Overlaps B1, B8 |
| S3 | Comprehension | 50 | **10 passages × 5 questions** |
| S4 | Communication | 50 | |
| S5 | Mathematical reasoning and aptitude | 50 | |
| S6 | Logical reasoning (incl. Indian logic, pramanas) | 50 | |
| S7 | Data interpretation | 50 | **10 tables or charts × 5 questions** |
| S8 | ICT | 50 | Must be dated, because it goes stale fast |
| S9 | People, development and environment | 50 | Dated content (SDGs, agreements) |
| S10 | Higher education system | 50 | Dated content (NEP 2020, bodies) |

Exams: P1 only. Depth 2–3. Maps to nothing existing, so **NEW-P1** is needed.

---

## 2. New material needed (gap list, in build order)

Priority = how many exams a topic serves × how many items it carries × how big the gap is.

| Order | New module | Covers | Serves | Why first |
|---|---|---|---|---|
| 1 | **NEW-RM** Research methods | B1–B8 | C N M S P1 | Every exam; CIP interview emphasis; zero teaching text today |
| 2 | **NEW-ST** Statistics for psychology | C1–C8 (+ D3 calculations) | C N M S | Calculation items; CUET has a whole unit; zero today |
| 3 | **NEW-SP** Social psychology | L1–L8 | N M S | 220 items, no coverage |
| 4 | **NEW-CG1** Sensation, attention and perception | F1–F6 | C N M | CUET unit 6, NET unit 5, NIMHANS area |
| 5 | **NEW-CG2** Learning and memory | G1–G5, H1–H5 | C N M S | CUET unit 5; existing coverage is clinical, not cognitive |
| 6 | **NEW-CG3** Thinking, language, intelligence and creativity | I1–I6 | C N M S | NET unit 6 |
| 7 | **NEW-MO** Motivation, emotion and stress | K1–K5 | C N M S | CUET unit 7, NET unit 7 |
| 8 | **NEW-FD** Foundations: history, schools and Indian psychology | A1–A6 | C N S | CUET units 1–3; NET unit 1 (Indian thought) |
| 9 | **NEW-PT** Personality theories | J2–J6 | C N M S | `personality` (14) teaches disorders, not theories |
| 10 | **NEW-LD** Lifespan development | M1–M8 | C N M S | Extends `defences` §3; CUET unit 11 |
| 11 | **NEW-P1** NET Paper 1 | S1–S10 | P1 | NET only, but 100 marks; needs dated facts |
| 12 | **NEW-AP** Applied and emerging | R1–R7 | N S | NET unit 10; university electives |

Extend existing modules (smaller jobs):
- `assessment` (4): item analysis, IRT, reliability and validity calculations, Indian tests (D2, D3, D6, O6).
- `brain` (2): endocrine system, split-brain, behaviour-genetics methods, biology of hunger, thirst and sex (E3, E4, E6, E8).
- `therapies` (13): counselling microskills, career and school counselling, expressive therapies (P1, P6, P7).
- `ethics-law` (21): research ethics, the M.Clin.Psy / PsyD route, mental health programmes (B8, Q3, Q4).
- `exam-prep` (33): link to the new mocks; keep its exam table in sync with the research doc each cycle.

Each new module uses the existing dialect (Starting → Beginner → Advanced, recall cards, `:::mcq`, viva, long answer / short notes, module test), so its built-in items also count toward §3.

---

## 3. Question-bank plan

### 3.1 Totals (VIBHA DESIGN)

| Bank | Items |
|---|---|
| A Foundations | 150 |
| B Research methods | 250 |
| C Statistics | 250 |
| D Psychometrics | 250 |
| E Biological | 230 |
| F Sensation, attention, perception | 150 |
| G Learning | 150 |
| H Memory | 150 |
| I Thinking, intelligence, creativity | 180 |
| J Personality | 200 |
| K Motivation, emotion, stress | 160 |
| L Social | 220 |
| M Development | 200 |
| N Psychopathology | 300 |
| O Clinical assessment | 150 |
| P Interventions | 200 |
| Q Ethics and law | 100 |
| R Applied and emerging | 220 |
| **Psychology MCQs, subtotal** | **3,510** |
| S NET Paper 1 MCQs | 500 |
| **All MCQs** | **4,010** |
| Descriptive prompts: 180 long answers + 260 short notes + 60 case vignettes | 500 |
| Interview prompts (see §5) | 420 |
| **Grand total** | **4,930** |

Items per exam (an item can serve several exams):

| Exam | Items tagged |
|---|---|
| CUET PG | ≈ 1,900 |
| NET Paper 2 | ≈ 3,200 |
| Clinical entrances | ≈ 2,900 |
| Semester exams | ≈ 3,000 MCQs + all 500 descriptive prompts |

### 3.2 Difficulty mix (VIBHA DESIGN; recalibrate from real response data)

| Level | Definition | Whole bank | CUET mocks | NET P2 mocks | NET P1 mocks | Clinical mocks |
|---|---|---|---|---|---|---|
| Easy | One fact, one step | 25% | 35% | 20% | 30% | 15% |
| Medium | Tell two close concepts apart; apply once | 42% | 45% | 45% | 45% | 40% |
| Hard | Multi-step, statement combinations, two-step calculation, vignette with a lure | 23% | 15% | 25% | 20% | 30% |
| Very hard | Near-identical options; links two domains; entrance-level differential | 10% | 5% | 10% | 5% | 15% |

- Labels start as the **author's estimate**. They move to data-driven difficulty after about 30 responses per item, using the Elo/IRT engine already planned (STUDENT_LEARNING_PLAN §3, §4.2).
- Topic quizzes target about 70% success (Q44). Mocks follow the exam's own mix above and are not adaptive.

### 3.3 Question types

| Code | Type | Format |
|---|---|---|
| SBA | Single best answer | 4 options |
| ST | Statement-based | "Statement I / II" or "which of A–E are correct" with answer codes |
| ML | Match List I with List II | 4 × 4, coded options |
| AR | Assertion-reason | Standard 4 codes |
| SEQ | Arrange in correct order | |
| SET | Passage or data set | One stem, 5 questions |
| CALC | Numerical | SEM, Spearman-Brown, z, df, r², effect size, percentile, item difficulty |
| VIG | Clinical or research vignette | 3–6 lines, then a question |

Type mix per exam (VIBHA DESIGN, based on observed styles; real shares are UNVERIFIED):

| Type | CUET PG | NET P2 | NET P1 | Clinical entrances | Semester MCQ papers |
|---|---|---|---|---|---|
| SBA | 65% | 35% | 40% | 50% | 70% |
| ST | 10% | 25% | 15% | 15% | 10% |
| ML | 10% | 15% | 10% | 5% | 10% |
| AR | 8% | 15% | 5% | 5% | 5% |
| SEQ | 5% | 10% | 5% | — | 5% |
| SET | — | — | 20% (RC + DI) | — | — |
| VIG | 2% | — | — | 20% | — |
| CALC | inside SBA, ≈ 4% | inside SBA, ≈ 5% | inside S5/S7 | inside SBA, ≈ 5% | — |

Domain rules:
- Statistics and psychometrics carry about 30% CALC.
- Psychopathology and clinical assessment carry about 35% VIG.
- Paper 1 S3 and S7 are 100% SET.

### 3.4 Item record (fields every item carries)

| Field | Contents |
|---|---|
| `id` | Item identifier |
| `topic` | e.g. `C5`, from §1 |
| `exams[]` | Which exams the item serves |
| `difficulty` | Author estimate, then data |
| `type` | Code from §3.3 |
| `stem`, `options[4]`, `answer` | The question |
| `explanation` | Why the answer is right |
| `whyWrong[3]` | One line per distractor |
| `moduleLink` | `module#section` to learn from |
| `source` | Book and page, **admin-only** (Q10) |
| `status` | `provisional` until about 30 responses; `new` until reviewed (Q11) |
| `mockOnly` | Boolean, see §4.0 |

### 3.5 Item-writing rules (from the 2026-08 item-bank audit lessons)
- **Balance answer positions** across A–D. The audit found 49% of answers at index 0.
- **The right answer must not be the longest option.** 119 of 127 audited items had this tell. Match distractor lengths.
- Each distractor is a real misconception, never filler. No "all of the above" in ST, ML or AR codes unless the exam uses it.
- One idea per stem. Mark negatives in bold ("NOT").
- Indian context where natural (Indian tests, MHCA, Indian samples). The case mix is Indian and global (Q48).
- Clinical items follow DSM-5-TR, with an "ICD-11 says" note where the two differ (Q12).
- Dated facts (Paper 1 ICT, policy, RCI rules) carry an `asOf` date and get re-checked every exam cycle.

---

## 4. Mock exam specs

### 4.0 Rules for all mocks
- Mirror the **pattern exactly** where it is published: number of questions, timer, marking, negative marking, sections, no-break rule.
- Where a value is not published, the mock says so on its start screen and uses a labelled practice default.
- The start screen shows: "Pattern as reported for the {cycle} cycle, checked {date}. Always confirm with the official notice."
- **Mock-only pool:** 25% of the psychology bank (≈ 880) and 125 Paper 1 items never appear in topic quizzes. Mocks draw items the student has not seen. If the unseen pool runs low, warn before the mock starts.
- **Unit distribution:** no exam publishes weightage, so the default spreads items evenly (VIBHA DESIGN). Swap in real frequencies once tagged past papers exist (research §8).
- **Result screen:** score with exam marking; time per question; topic breakdown; every wrong answer goes into the error log with its `moduleLink`.
- No predicted rank or cut-off. NTA cut-offs depend on the session, so we show the published qualifying rule only.

### 4.1 CUET PG Psychology (HUQP20): 6 fixed mocks plus unlimited dynamic mocks
| Spec | Value |
|---|---|
| Questions | 75, all compulsory, one section |
| Timer | 90:00, one block |
| Marking | +4 / −1 / 0 (max 300) |
| Language | English (bilingual toggle later; NTA papers are English + Hindi) |
| Navigation | Free navigation; mark for review (as in NTA CBT) |

Unit distribution (VIBHA DESIGN, even spread):

| Unit | Items | Unit | Items |
|---|---|---|---|
| 1 Introduction | 3 | 8 Intelligence | 5 |
| 2 History | 4 | 9 Personality | 7 |
| 3 Schools | 5 | 10 Testing | 6 |
| 4 Biological bases | 6 | 11 Life-span development | 6 |
| 5 Learning, memory | 8 | 12 Abnormal and clinical | 7 |
| 6 Sensation and perception | 6 | 13 Statistics | 6 |
| 7 Emotion and motivation | 6 | **Total** | **75** |

Plus 13 **unit mini-mocks** of 15 items in 18 minutes each, keeping the same 72 s per item.

### 4.2 UGC NET Psychology (code 04): 6 full mocks, 6 Paper 1 mocks, 10 unit mocks
| Spec | Value |
|---|---|
| Structure | Paper 1 (50 items) then Paper 2 (100 items), **one 180:00 timer, no break**; students may move between papers |
| Marking | +2 per correct; **no negative marking** (max 300) |
| Paper 1 distribution | 5 per unit (VIBHA DESIGN; "5 per unit" is UNVERIFIED). S3 = one 5-item passage; S7 = one 5-item data set |
| Paper 2 distribution | 10 per unit (VIBHA DESIGN) |
| Result | Aggregate %, with the published rule: ≥ 40% General/EWS, ≥ 35% reserved categories to be considered. Plus a note that the actual cut-off (top 6% and category split) is set per session |
| Paper 1 mock | 50 items, 60:00 (practice default, labelled; NTA gives no separate time) |
| Unit mock | 25 items of one Paper 2 unit, 30:00 |

### 4.3 Clinical master's entrances
| Mock | Items | Timer | Marking | Distribution (VIBHA DESIGN unless noted) | Fixed sets | Tag |
|---|---|---|---|---|---|---|
| **NIMHANS M.Clin.Psy** | 100 MCQ | 90:00 | +1 / −0.25 / 0 | 18 areas from the guide's list, about 5–6 each; clinical + abnormal 12; statistics and research methods 8 | 4 | SECONDARY pattern |
| **CIP Ranchi** | 100 MCQ | 60:00 | +1, no negative | Statistics and research methods 15; clinical 15; abnormal 15; cognitive and biopsychology 15; social 10; personality 10; developmental 10; testing 10 | 3 | SECONDARY (2025) |
| **IHBAS** | 100 MCQ | 90:00 | No negative (marks per item not stated; use +1) | **Clinical 25, Abnormal 15; 10 each for General, Personality, Social, Developmental, Physiological, Statistics and Research Methods** | 3 | SECONDARY weightage |
| **RINPAS** | 100 MCQ | **Not published**: practice default 90:00, labelled | +2 / −1 | Even across PG psychology | 2 | OFFICIAL marking (2025) |
| **GMCH Chandigarh** | 100 MCQ | 120:00 | +1, no negative; result shows the 50% (Gen) / 45% (SC) qualifying line | Even across Master's syllabus | 2 | OFFICIAL (2025) |
| **University M.Clin.Psy (CSJMU type)** | 70 MCQ | 60:00 | +1, no negative; then a 30-mark interview (§5) | Even | 2 | OFFICIAL (CSJMU 2026) |
| **LGBRIMH (GU-PGET), PsyD, AIIMS, PGIMER** | — | — | — | **No mock until a pattern is verified** | 0 | UNVERIFIED |

### 4.4 University semester mocks (descriptive)
| Mock | Format | Timer | Marking |
|---|---|---|---|
| **Mumbai-style** | 7 questions × 10 marks, attempt 5 (one may be a short note) | Not published: practice default 2:00 h, labelled | 50; rubric (below) |
| **IGNOU TEE style** | A: 2 of 4 long (~450 words, 10 marks); B: 4 of 5 (~250 words, 6 marks); C: 2 of 3 short notes (~100 words, 3 marks) | 2:00 h | 50 |
| **Mixed (CU Punjab style)** | 70% descriptive + 30% objective | 2:00 h practice default | 50 |
| **Short-note sprint** | 6 short notes × 5 marks | 30 min | 30 |

Descriptive marking rubric. This reuses the long-answer and short-note frames in `exam-prep` §3.3. Each answer is scored on five rows:

| Row | Long answer (10–15 marks) | Short note (5 marks) |
|---|---|---|
| Definition / intro | 10% | 20% |
| Core content (theory, model, components) | 40% | 50% |
| Evidence / study / example (Indian where possible) | 20% | 20% |
| Critique or application | 20% | — |
| Structure, conclusion, command word obeyed | 10% | 10% |

- AI gives a draft score and feedback, labelled "AI feedback".
- The student can self-mark against the rubric.
- An admin samples AI marks to check them (in line with Q47).

---

## 5. Mock-interview bank

For clinical master's goals only (and NIMHANS PhD). It reuses the AI patient / interviewer system (Q46).

### 5.1 Categories and counts (VIBHA DESIGN)
| Category | Prompts | Examples of prompt themes |
|---|---|---|
| Academic core | 140 | Reliability vs validity; psychosis vs neurosis; Piaget vs Vygotsky; Type I vs II error; what an MMPI L-scale elevation means |
| Clinical vignettes (with 2–3 follow-ups) | 90 | A 24-year-old with 3 weeks of muttering and suspiciousness: differential, MSE focus, tests, risk |
| Research | 60 | Defend your MA dissertation; pick a design for a question; spot the flaw; which statistic and why |
| Testing practical | 40 | Explain or administer: Bender-Gestalt, VSMS, MISIC subtest, PGI Memory Scale, TAT card instructions |
| Ethics and law | 40 | Confidentiality vs duty to warn; consent in a minor; MHCA advance directive; suicide-attempt provisions; dual relationships |
| Motivation and fit | 25 | Why clinical psychology; why this institute; what you will do if not selected; handling a distressing case |
| Current affairs in mental health | 25 | Tele-MANAS; National Suicide Prevention Strategy; the RCI M.Clin.Psy change; DSM-5-TR and ICD-11 changes; digital mental health |
| **Total** | **420** | |

### 5.2 What every model answer covers
| Part | Contents |
|---|---|
| **Must-say points** (3–5) | Without these the answer fails, e.g. "risk assessment first" in any suicidality vignette |
| **Good-to-say points** | Depth markers: a named study, an Indian example, an ICD-11 contrast |
| **Red flags** | What loses marks: overclaiming, unsafe advice, breaching confidentiality, bluffing |
| **Likely follow-ups** (2–3) | The panel's next questions, each with a short model answer |
| **Honest-gap line** | How to say "I don't know, but here is how I would find out" |
| **Learn link** | `module#section` for review |
| **Length cue** | 60–90 s spoken for academic prompts; 2–3 min for vignettes |

### 5.3 Evaluation rubric (each row 0–4; total 20)
| Row | 0 | 2 | 4 |
|---|---|---|---|
| Accuracy | Wrong or invented | Mostly right, one error | Fully correct, precise terms |
| Depth and structure | List of words | Ordered but shallow | Defined → explained → example → limit |
| Clinical / research reasoning | No reasoning | Reaches an answer without weighing alternatives | Considers differentials, picks with reasons |
| Ethics and safety | Misses an ethical or risk issue that is present | Mentions it late | Raises it first, correct action |
| Communication | Rambling or bluffing | Clear but unsure | Clear, concise, honest about limits |

- **Gate:** in any vignette with risk, missing risk caps the total at 10.
- **Bands:** 0–7 not ready · 8–13 developing · 14–17 ready · 18–20 strong.
- AI scores are labelled feedback. An admin reviews a sample to calibrate.
- Sessions:
  - **Panel mode:** 8 prompts mixed across categories, about 15 min.
  - **Drill mode:** one category, 5 prompts.
  - **CSJMU-style:** converts the rubric to /30.
  - **CIP-style:** converts the rubric to /50.

---

## 6. Student pathway: one flow, never more than 3 next actions

> **Owner update, 6 Nov 2026: one shared course.** Students no longer pick an exam. The section is "Psychology Entrance & Competitive Exam Preparation" (CUET-PG · UGC-NET · Clinical Psychology Entrances (M.Clin.Psy)). The curriculum is the union of every exam's syllabus, NET Paper 1 included; subject mastery comes first, exam-specific prep later. Step 1 below (pick a goal), the goal seeds in 6.4 and the exam-pattern mocks in §4 stay in the code behind `EXAM_TRACKS_ENABLED` (`src/lib/prep/catalog.ts`, off). While off: the starting check samples every subject (30 questions); the plan weighs each subject by the exams' subject weights averaged over the exams; practice climbs a level each round towards very hard; mocks are a 100-question, 120-minute mixed paper plus 50-question sectionals, marked +1 / -0.25 (practice marking); interviews are open to everyone.

**Principle:** the student sees **one goal, one plan and at most three things to do next**. Everything else is one tap away, never on the first screen. There are no week schedules (Q17). The plan is an ordered list of topics, not a calendar.

### 6.1 The flow
| Step | What the student does | What the platform does | Reuses |
|---|---|---|---|
| **1. Pick a goal** | Chooses one: CUET PG · UGC NET · Clinical entrance (then the institute, or "not sure") · MA semester (then the university, or "other"). Exam date is optional | Stores one active goal. Hides other exams' content. Switching goal is allowed and keeps progress | — |
| **2. Short diagnostic** | 20 questions, about 20 min (Q41, Q7). NET: 15 Paper 2 + 5 Paper 1. Semester: 15 MCQ + 1 short note, self-rated against the rubric | Picks items across the goal's topic list; estimates mastery per topic; untested topics start "unknown" | `/study/placement` |
| **3. Personal plan by topic** | Sees an ordered topic list; only the **next 5** are open; the rest are collapsed as "later" | Orders by **priority = exam weight × (1 − mastery) × prerequisites met**. Prerequisites: statistics C1–C2 before C4–C7; research B1 before B3; N1 before N2–N11 | `/study/map` |
| **4. Learn inside existing modules** | Taps a topic → opens the exact module section (`moduleLink`), Starting / Beginner / Advanced | Topics with no module yet show "coming soon" and fall back to practice plus explanations | `/study/[module]` |
| **5. Topic quiz** | 10 items, adaptive, about 10 min, explained feedback | Targets about 70% success. A topic counts as **practised** at ≥ 70% on a quiz and **mastered** at P ≥ 0.85 with ≥ 3 first-try correct over ≥ 2 days (platform rule) | `/games/quizzes`, Elo engine |
| **6. Timed mocks** | Takes a unit mini-mock any time; full mocks are **suggested** once about 30% of plan topics are practised, then after every further ~20% | Exact pattern (§4); error log; re-ranks the plan from mock results | new mock runner |
| **7. Interview practice** (clinical goal only) | Panel or drill mode | Suggested after the first full mock or once N and O topics are about 50% practised | AI interviewer |
| **8. Review** | Error-log review + spaced recall cards | Wrong answers become review cards (FSRS); the plan re-orders after each mock | `/games/revise` |

### 6.2 The "next 3" rule (Today card)
At any moment the Today screen shows **1 to 3 cards, never more**, picked in this order:
1. **Do now:** the single highest-priority action: the next topic to learn, or the quiz for the topic just read.
2. **Review due:** shown only if review cards are due (cap of 15 per session).
3. **Milestone:** shown only when unlocked: "Take full mock 2", "Try an interview panel", or "Mock tomorrow? Do a 15-item warm-up".

Rules:
- When nothing is due for cards 2 or 3, show **only one card**.
- No streak pressure, leaderboards or other exams on this screen.
- An "Everything" link opens the full plan for students who want it.
- A session ends with "Done for today": one line on what improved and the first card for next time.

### 6.3 What stays hidden, so students are not overwhelmed
- Topics outside the goal (for example Paper 1 for a CUET student).
- More than 5 upcoming topics.
- Raw Elo numbers, until about 30 answers (Q41).
- Full mocks, until the readiness rule in 6.1 is met. A "Take a mock anyway" link stays in the menu: it is never suggested, but never blocked.
- Pattern details beyond one line, behind a "How this exam works" sheet that carries the official-source date.

### 6.4 Goal-specific plan seeds (default topic order before diagnostic adjustment; VIBHA DESIGN)
| Goal | Seed order |
|---|---|
| CUET PG | A1–A3 → E → G, H → F → K → I4 → J → D → M → N1–N5 → C1–C4 |
| UGC NET | B, C (heavy, early) → A (incl. A4–A6) → E → F–H → I → J, K → L → M, P → R; Paper 1 runs in parallel: one P1 unit after every two Paper 2 topics |
| Clinical entrance | N → O → C, B → D → P, Q → E → F–I → J, K, L, M → interview drills |
| MA semester | The chosen university's semester courses mapped to topic IDs (§5 of the research doc), with descriptive practice (long answers and short notes) after every topic |

### 6.5 Success signals to track (for the owner's admin view)
- Diagnostic completion rate; share of students acting on card 1 within a session.
- Topics practised per active student; mock score trend for each student.
- Drop-off by step (where do students stop: plan, learn, quiz, mock?).
- Interview rubric trend for clinical-goal students.
