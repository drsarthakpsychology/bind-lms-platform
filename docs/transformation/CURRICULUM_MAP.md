# Curriculum map

What VIBHA teaches today, what a psychology student still needs, and the best way to teach each piece.

**Read this first.**
- This map is built from the existing VIBHA curriculum (the files listed below) and well-established psychology knowledge. It does **not** contain page numbers. Chapter and page references for the source books are in the per-book maps (see the bibliography), written by separate reviewers. This file only points to them.
- **The source books are psychiatry texts.** They cover the clinical, psychopathology and psychopharmacology rows. They do **not** cover most general-psychology rows (cognition, perception, memory experiments, social psychology, research methods and statistics, motivation and emotion, positive psychology). Those rows are marked **GP**: they still need a general psychology textbook or checking against the primary literature.
- A primary study is cited (author, year, journal or book) only when the citation is certain. Otherwise the finding is described and marked **citation needed**.
- This is a planning document. "Status", "Level" and "Best format" are recommendations for an educator to accept or change. They are not decisions.

### Bibliography (source books)

| Code | Book | Per-book map (chapter and page refs) |
|---|---|---|
| **K** | Boland, Verduin & Ruiz (eds). *Kaplan & Sadock's Synopsis of Psychiatry*, 12th edition (2021) (supplied as 2 PDFs) | `docs/transformation/books/kaplan-part1.md` and `docs/transformation/books/kaplan-part2.md` (plus `-activities.json`) |
| **FA** | Casey & Kelly (eds). *Fish's Clinical Psychopathology*, 3rd edition; and Ahuja, *A Short Textbook of Psychiatry* (Jaypee, 2010) | `docs/transformation/books/fish-ahuja.md` (plus `-activities.json`) |
| **MS** | Taylor, Barnes & Young. *The Maudsley Prescribing Guidelines in Psychiatry*, 14th edition (2021); and Stahl, *Stahl's Essential Psychopharmacology*, 5th edition | `docs/transformation/books/maudsley-stahl.md` (plus `-activities.json`) |
| **GP** | No book in the current set | Needs a general psychology textbook, or checking against the primary studies cited in the row |

Notes on the set:
- Ahuja (2010) predates the Mental Healthcare Act 2017. Use it for clinical description only. For law, cite the Act itself (row 154 and module `ethics-law`).
- The per-book maps were being written in parallel with this file. Where a row says K, FA or MS, it means that book is *expected* to cover the topic. Confirm the exact chapter in the per-book map, and change the code if it does not.
- Author and edition details above are given as supplied by the coordinator. Confirm them against each title page during review.

Sources read: `docs/STUDY.md`, `src/lib/study/types.ts`, `src/lib/study/plan.ts`, `src/lib/study/checkpoints.ts`, `src/lib/study/activities.ts`, every module in `src/content/study/*.ts` (headings, outcomes and activities), `src/lib/learn/content/*` (quiz units), `src/lib/learn/scenarios.ts`, `src/lib/learn/engine.ts`, `src/lib/learn/adaptive.ts`, `src/lib/practice/tools.ts`, `src/lib/lab/experiments.ts`.

---

## 1. Current coverage

### 1.1 The shape of it

- **23 modules** in curriculum order over about 16 weeks (about 85 hours). Module 1, the interview and MSE, is split into three files.
- Each module follows four steps: read, write it out on paper, practise, test. Checkpoints come after each block of about three sections. The module test is re-taken 3, 7 and 21 days later.
- The curriculum is almost entirely **clinical**: the interview and MSE, disorders, medicines, therapy, risk, and ethics and law. General psychology appears only as background inside modules 2 (brain), 3 (defences, learning theory, development), 4 (assessment) and 14 (personality theory).

### 1.2 Module table

Formats key. **CP** = notes checkpoints (case MCQs plus say-it-aloud cards). **MT** = module test, with re-tests at 3, 7 and 21 days. **Games**: Coach (by domain), Quiz lessons (`/games/play?lesson=`), Clinic detective, What would you do? (`/games/scenarios`), Say it clinically (terms). The MCQ count is the number of `:::mcq` blocks in the file (checkpoint questions plus the test).

| # | Module id | What is taught | Interactive formats now |
|---|---|---|---|
| 1 | `interview-mse` | Psychiatric interview (set-up, rapport, technique, full history, premorbid personality, special situations, errors); full MSE domain by domain; MMSE/MoCA; confusable pairs; worked write-ups; culture, language and literacy in India; exam zone | CP (25 mcq blocks), MT; Quiz lessons (MSE, signs), Coach: psychopathology, Say it clinically. Practice: MSE tagger, OSCE, Consulting Room, Peer Role-Play, Clinic |
| 2 | `brain` | Neuron and synapse, transmitters, dopamine pathways, regions and lobes, frontal syndromes and language, stress and sleep, memory systems, EEG and imaging, basic pharmacology | CP (11), MT; Coach: neuroscience, Coach: pharmacology, Clinic detective |
| 3 | `defences` | Freud's models, later schools, learning theories (Pavlov, Watson, Skinner, Bandura, Seligman), defences by maturity, Erikson, Piaget, attachment, Mahler, Kohlberg, Bowlby, temperament | CP (11), MT; Quiz lessons (defences), Coach: psychopathology, Coach: counselling |
| 4 | `assessment` | Reliability, validity, norms, the normal curve; intelligence, personality, projective and neuropsychological tests (including Indian ones); rating scales; theories of intelligence; MMPI and Rorschach; bedside cognitive screening; test ethics | CP (12), MT; Coach: assessment, Quiz lessons (MSE), Coach: ethics |
| 5 | `depression` | Depressive disorders, criteria, specifiers, biology, psychological and social causes (including learned helplessness), presentation, differential, physical illness, treatment | CP (13), MT; Quiz lessons (mood, antidepressants), Scenarios: depression, Coach: disorders |
| 6 | `bipolar` | Mania, hypomania, mixed features, finding hypomania, bipolar I and II, cyclothymia, causes, special groups, treatment | CP (13), MT; Quiz lessons (mood, stabilisers), Scenarios: bipolar, Coach: pharmacology |
| 7 | `anxiety` | Normal versus disordered anxiety, causes, assessment, GAD, panic, agoraphobia, social anxiety, phobia, separation anxiety, selective mutism, medical causes | CP (15), MT; Quiz lessons (anxiety), Coach: therapy, Coach: disorders, Say it clinically |
| 8 | `ocd` | Obsessions and compulsions, criteria, causes, treatment, a worked ERP case, special groups, resistant OCD, BDD, hoarding, body-focused repetitive behaviours | CP (12), MT; Quiz lessons (anxiety), Scenarios: OCD, Coach: therapy |
| 9 | `psychosis` | Psychosis, schizophrenia criteria, the duration ladder, organic red flags, causes, course, treatment, early intervention, CBTp, catatonia | CP (11), MT; Quiz lessons (psychosis, signs), Scenarios: schizophrenia |
| 10 | `antidepressants` | Mechanisms, onset and efficacy (including placebo comparison), classes, side effects, serotonin syndrome and other safety issues | CP (13), MT; Quiz lessons (antidepressants), Clinic detective, Coach: pharmacology |
| 11 | `antipsychotics` | Dopamine pathways, drugs, dosing, special groups, EPS, NMS, metabolic and cardiac effects, clozapine | CP (13), MT; Quiz lessons (antipsychotics), Scenarios, Clinic detective |
| 12 | `stabilisers` | Lithium, valproate, carbamazepine, lamotrigine, choosing; benzodiazepines, other hypnotics, insomnia treatment, benzodiazepine withdrawal | CP (11), MT; Quiz lessons (stabilisers), Scenarios, Clinic detective |
| 13 | `therapies` | Common factors, 5P formulation, MI, behaviour therapy, CBT, third-wave therapies, exposure and BA, distortions and DBT skills, psychodynamic, family, couple and group therapy, adapting therapy for Indian clients, therapist ethics | CP (14), MT; Coach: therapy, Coach: counselling, Scenarios: depression. Practice: Formulation |
| 14 | `personality` | General criteria, theories of personality (trait including the Big Five, humanistic, social-cognitive), assessment, clusters A to C, BPD in depth, what works, crises | CP (12), MT; Quiz lessons (defences), Coach: counselling, Coach: disorders |
| 15 | `substance` | SUD criteria, substance history, screening and brief intervention, dual diagnosis, alcohol (withdrawal, Wernicke-Korsakoff, relapse prevention), other substances, tobacco and gambling, opioid treatment and harm reduction in India, stages of change | CP (16), MT; Quiz lessons, Scenarios: substance, Coach: counselling, Clinic detective |
| 16 | `suicide` | Facts, risk and protective factors, models, groups at risk, how to ask, what to establish, self-harm in the ED, safety planning, Indian law and helplines, treatments, postvention | CP (12), MT; Quiz lessons (risk), Coach: counselling, Scenarios |
| 17 | `neurocognitive` | Delirium (cause, management, special situations), dementia (types, reversible causes, management, Alzheimer's in depth, other causes) | CP (12), MT; Quiz lessons, Scenarios: dementia, Coach: neuroscience |
| 18 | `child` | Child assessment, development and screening, ID, autism, ADHD, learning disorders, tics, genetic syndromes, disruptive behaviour, elimination disorders, adolescents, abuse and POCSO | CP (14), MT; Quiz lessons, Coach: disorders, Coach: law |
| 19 | `trauma` | Trauma, PTSD clusters, risk, trauma-informed interview, children and disasters, other trauma disorders, complex PTSD, attachment disorders, PFA, trauma therapies, helper care | CP (13), MT; Quiz lessons (anxiety), Scenarios: PTSD, Coach: therapy |
| 20 | `more-disorders` | Eating, sleep, somatic symptom and related disorders, factitious disorder and malingering, dissociation, culture-related presentations in India, sexual dysfunction, gender dysphoria, paraphilic disorders | CP (15), MT; Coach: disorders, Say it clinically, Quiz lessons |
| 21 | `ethics-law` | Principles, consent and capacity, confidentiality, boundaries, dilemmas, MHCA 2017 (rights, advance directives, admissions, treatments, suicide), other Indian laws, telepsychiatry, negligence | CP (16), MT; Quiz lessons (risk), Coach: ethics, Coach: law. Practice: Ethics, law and referral |
| 22 | `case-sheet` | Case sheet principles and structure, MSE write-ups, 5P formulation, diagnosis, the biopsychosocial plan, records, risk, discharge and referral, exam presentation, a full worked example | CP (10), MT; Say it clinically, Scenarios: case sheet, Quiz lessons. Practice: Formulation, Clinic |
| 23 | `medicine-profiles` | Card-by-card profiles of each medicine, side-effect medicines, dangerous combinations | CP (8), MT; Clinic detective, Quiz lessons, Coach: pharmacology |

**Where the source books apply.** The 23 clinical modules map onto the psychiatry set:
- **K** (Kaplan & Sadock) for all disorder modules, `therapies`, `assessment`, `defences`, `child`, `ethics-law` (general principles) and `case-sheet`.
- **FA** for `interview-mse` and the psychopathology of every disorder module. Fish covers description of symptoms; Ahuja is the Indian undergraduate text.
- **MS** for `brain` (pharmacology part), `antidepressants`, `antipsychotics`, `stabilisers` and `medicine-profiles`.
- For Indian law (`ethics-law` part II), cite the Mental Healthcare Act 2017 itself.
- Exact chapters are in `docs/transformation/books/`.

**Other interactive layers:**
- **Quiz units** (`src/lib/learn/content`): Signs and symptoms; Mental status exam; Depression and bipolar; Anxiety, OCD and trauma; Psychosis; Defences and personality; Children, ageing and substances; Risk, ethics and the law; Antidepressants; Antipsychotics; Mood stabilisers and calmers; Case files.
- **Branching scenarios** (`src/lib/learn/scenarios.ts`): 10 of them, covering depression, mania, psychosis, OCD, two on pharmacology, child, alcohol, PTSD and delirium.
- **Practice tools** (`src/lib/practice/tools.ts`): Judgment, Clinic, MSE, OSCE Stations, Formulation, Ethics law and referral, Landmark Cases, Consulting Room, Peer Role-Play, Case Library.
- **Psychology Lab** (`src/lib/lab/experiments.ts`): 7 experiments. Digit span, Serial position, Stroop, Spot the change, Müller-Lyer, Reward schedules, Bias spotter.
- **Lab experiments other agents are adding now**: research methods, classical conditioning, conservation (developmental), conformity (social influence) and an attribution / fundamental-attribution-error activity. In the table these are marked **Lab (in progress)**. Their ids were not final when this was written.

---

## 2. Gap analysis

| Domain | Where it appears now | Verdict | What is missing |
|---|---|---|---|
| Cognition (attention, thinking, problem-solving, language, decision-making) | MSE cognition section; brain 2.3 (language); Lab: Stroop, Spot the change, Bias spotter | **Thin** | Selective and divided attention, dual-process thinking, heuristics outside the clinic, problem-solving, concepts and categorisation, language development, metacognition |
| Memory | brain 2.4 (memory systems); neurocognitive (amnesia); Lab: Digit span, Serial position | **Thin** | Encoding and levels of processing, working memory model, forgetting, reconstructive memory and false memory, eyewitness testimony, the testing and spacing effects, context-dependent memory, autobiographical memory |
| Perception and sensation | MSE perception (hallucinations, illusions); Lab: Müller-Lyer | **Thin** | Psychophysics (thresholds, signal detection), Gestalt organisation, depth and constancy, top-down processing, multisensory integration, pain perception |
| Learning | defences 1.3, therapies 2.1, depression (learned helplessness); Lab: Reward schedules; classical conditioning Lab in progress | **Expand** | Extinction and renewal, generalisation and discrimination, biological preparedness and taste aversion, latent learning, observational learning as an experiment, the Premack principle, shaping |
| Motivation and emotion | Maslow (personality 1.2); Yerkes-Dodson implicit in anxiety | **Missing as a topic** | Theories of emotion (James-Lange, Cannon-Bard, two-factor, appraisal), intrinsic versus extrinsic motivation, self-determination theory, emotion regulation, universal expressions, arousal and performance |
| Social psychology | Mostly absent; conformity and attribution Lab activities in progress | **Missing** | Conformity, obedience, attribution, cognitive dissonance, attitudes, prejudice and intergroup relations, bystander effect, group processes, persuasion, stigma |
| Developmental | defences part III (Erikson, Piaget, attachment, Kohlberg, Mahler); child 1.2 (milestones); conservation Lab in progress | **Expand** | Vygotsky and scaffolding, theory of mind, adolescence, adult development and ageing, Bronfenbrenner's ecological model, self-control in childhood, parenting styles |
| Personality theory | personality 1.2 (theories), assessment 2.2 (tests) | **Expand** | Trait stability and heritability, person-situation debate, locus of control, self-efficacy, Barnum effect, Indian perspectives |
| Research methods and statistics | assessment 1.1 and 1.2 (reliability, validity, normal curve); research methods Lab in progress | **Thin** | Designs (experimental, correlational, case study), variables and confounds, sampling, ethics of research, effect size and p-values, regression to the mean, placebo and blinding, the replication crisis, reading a paper |
| Biological psychology | brain module (good clinical depth) | **Taught, could expand** | Classic lesion and case studies (H.M., Phineas Gage, split brain), reward circuitry, sleep and memory, genes and environment |
| Health psychology | Stress in brain 2.2; somatic disorders | **Missing as a topic** | Stress models (GAS, transactional), life events, stress and immunity, coping, health behaviour change models, adherence, chronic illness and pain |
| Cross-cultural and Indian context | MSE 2.12, therapies 3.4, more-disorders 4.2, ethics-law (MHCA) | **Partly taught** | WEIRD sampling, individualism and collectivism, the family's role in care in India, indigenous psychology, idioms of distress (some there), caste, gender and stigma as social determinants |
| Positive psychology | Absent | **Missing** | Well-being models, strengths, gratitude evidence, hedonic adaptation, resilience, and an honest reading of where the evidence is weak |
| Counselling micro-skills | interview-mse 1.3 and 1.4 (rapport, technique); therapies 1.1 and 1.3 (common factors, MI); Peer Role-Play, Consulting Room | **Expand** | Explicit micro-skills: attending, paraphrasing, reflection of feeling, summarising, open and closed questions, silence, immediacy, challenging; termination; supervision; reflective practice |

In short, the platform trains a strong clinical interviewer but gives little of the general-psychology base that clinical reasoning stands on: memory, social influence, research methods and motivation in particular. The Lab is the natural home for most of it, because these topics are best taught by doing.

---

## 3. Opportunity map

**Status**: *Taught* (covered well enough now); *Expand* (mentioned but thin); *New* (absent).
**Linked module**: an existing id from `src/content/study`. *proposed:x* means a suggested new module. Suggested new module ids: `cognition-memory`, `learning-behaviour`, `social-cultural`, `lifespan`, `research-methods`, `motivation-emotion`, `health-positive`, `counselling-skills`.
**Sensitivity**: *—* none; *Low*, *Med* or *High* (High means it needs a content note, care with personal disclosure, or educator sign-off).
**Book ref**: codes from the bibliography. **K**, **FA** or **MS** mean "see `docs/transformation/books/<file>.md`" for chapter and page. **GP** means not covered by the psychiatry set; it needs a general psychology textbook or checking against the primary literature. Several codes together means "check both". No page numbers are given in this file.
**Implemented?**: *Lab* = one of the 7 live Lab experiments; *Lab (in progress)* = being built by another agent; *Notes* = in a module's notes; *Game* = existing game or scenario; *No*.

### 3.1 Cognition, attention and perception

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Attention | Stroop interference (Stroop 1935, J Exp Psychol; MacLeod 1991, Psychol Bull) | Taught | `assessment`, `brain` | **Experiment**: the effect is felt in your own reaction time, which beats any description | Foundation | Well established | — | GP | Lab |
| 2 | Attention | Change blindness (Rensink, O'Regan & Clark 1997, Psychol Sci) | Taught | `assessment` | **Experiment**: students do not believe they miss changes until they miss one | Intermediate | Well established | — | GP | Lab (Spot the change, built on visual working memory: Luck & Vogel 1997, Nature) |
| 3 | Attention | Inattentional blindness (Simons & Chabris 1999, Perception) | New | `interview-mse`, proposed:`cognition-memory` | **Experiment** (a counting task with an unexpected event), then **reflection** on what an interviewer misses while writing notes | Foundation | Well established | — | GP | No |
| 4 | Attention | Selective attention and the cocktail party effect (Cherry 1953, J Acoust Soc Am) | New | proposed:`cognition-memory` | **Experiment** (dichotic-style audio): students hear their own name break through | Foundation | Well established | — | GP | No |
| 5 | Attention | Feature versus conjunction search (Treisman & Gelade 1980, Cogn Psychol) | New | proposed:`cognition-memory` | **Experiment**: search time grows with set size only for conjunctions, a clean visible result | Intermediate | Established, details debated | — | GP | No |
| 6 | Attention | Spatial cueing (Posner 1980, Q J Exp Psychol) | New | `anxiety` | **Experiment**, then link to attentional bias toward threat in anxiety. Shows how lab tasks inform clinical models | Advanced | Well established (cueing); attentional bias training is Debated | Low | GP | No |
| 7 | Perception | Müller-Lyer and cultural differences in illusion susceptibility (Segall, Campbell & Herskovits 1966) | Taught | `defences`, `case-sheet` | **Experiment** with an adjustable line; the cross-cultural claim goes to **group discussion** | Intermediate | Illusion: Well established; cultural explanation: Debated | — | GP | Lab |
| 8 | Perception | Gestalt grouping principles | New | proposed:`cognition-memory` | **Simulation** (drag dots to see grouping change), then **flashcards** for the principle names | Foundation | Well established | — | GP | No |
| 9 | Perception | Top-down processing and context (ambiguous figures, word superiority) | New | `interview-mse` (perception) | **Experiment**, then **reflection**: why expectation shapes what a clinician "sees" | Foundation | Well established | — | GP | No |
| 10 | Perception | Signal detection theory (hits, false alarms, criterion) | New | `assessment`, `case-sheet` | **Simulation** with a movable criterion slider. It makes sensitivity and specificity tangible, which pays off in screening tests | Advanced | Well established | — | GP | No |
| 11 | Perception | McGurk effect (McGurk & MacDonald 1976, Nature) | New | proposed:`cognition-memory` | **Experiment** (video with sound): a striking demonstration of multisensory integration | Intermediate | Well established (size varies between people) | — | GP | No |
| 12 | Perception | Depth perception and the visual cliff (Gibson & Walk 1960, Sci Am) | New | `child`, proposed:`lifespan` | **Case** plus short video **discussion**: what an infant study can and cannot show | Foundation | Well established (interpretation debated) | — | GP | No |
| 13 | Perception | Pain as perception (gate control idea, expectation, attention) | New | proposed:`health-positive`, `more-disorders` | **Concept map** linking body, attention, mood and pain. It helps with somatic symptom presentations | Intermediate | Gate control: Established, details debated | Med | GP | No |
| 14 | Thinking | Heuristics in clinical judgment (anchoring, availability, representativeness, premature closure, diagnostic overshadowing) (Tversky & Kahneman 1974, Science; Reiss et al. 1982) | Taught | `case-sheet`, `interview-mse` | **Game** (vignette sorting), because recognising a bias inside a case is the skill | Advanced | Established, details debated | Low | GP | Lab (Bias spotter) |
| 15 | Thinking | Framing effect (Tversky & Kahneman 1981, Science) | New | `ethics-law` (consent) | **Experiment** (split-class survey), then **debate** on how risk should be explained to patients | Intermediate | Well established | Low | GP | No |
| 16 | Thinking | Confirmation bias and the Wason selection task (Wason 1968, Q J Exp Psychol) | Expand | `case-sheet` | **Experiment** (the card task), which shows the habit of seeking confirming evidence directly | Intermediate | Well established | — | GP | No (bias named in Bias spotter) |
| 17 | Thinking | Functional fixedness, the candle problem (Duncker 1945, Psychol Monogr) | New | proposed:`cognition-memory` | **Game** (timed puzzle), then **reflection** on rigid thinking | Foundation | Well established | — | GP | No |
| 18 | Thinking | Analogical problem-solving (Gick & Holyoak 1980, Cogn Psychol) | New | `case-sheet` | **Experiment**, then a **mini project**: students build analogies between cases, which mirrors how pattern recognition is learned | Advanced | Well established | — | GP | No |
| 19 | Thinking | Dual-process (fast and slow) thinking | New | `case-sheet` | **Group discussion** using a clinic example. The model is useful but loose, so discussion suits it better than drilling | Intermediate | Debated (as a strict two-system model) | — | GP | No |
| 20 | Thinking | Introspection limits: telling more than we can know (Nisbett & Wilson 1977, Psychol Rev) | New | `interview-mse` | **Reflection**, then **debate**: how far can we trust patients' (and our own) reasons for behaviour? | Advanced | Well established | Low | GP | No |
| 21 | Thinking | Dunning-Kruger effect (Kruger & Dunning 1999, JPSP) | New | `research-methods` (proposed) | **Debate** on what the effect is and whether part of it is a statistical artefact. A good critical-thinking case | Advanced | Debated | — | GP | No |
| 22 | Language | Language areas, aphasias | Taught | `brain` | **Case** (bedside examples) plus **flashcards** | Intermediate | Well established | Low | K; FA | Notes |

### 3.2 Memory

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 23 | Memory | Short-term capacity, digit span (Miller 1956, Psychol Rev) | Taught | `interview-mse`, `neurocognitive`, `assessment` | **Experiment**: students see their own span and then the forward/backward bedside use | Foundation | Well established (later work suggests about 4 chunks) | — | K; FA; GP | Lab |
| 24 | Memory | Serial position, primacy and recency (Murdock 1962; Glanzer & Cunitz 1966) | Taught | `neurocognitive`, `assessment` | **Experiment** with a plotted personal curve | Foundation | Established, details debated | — | GP | Lab |
| 25 | Memory | Brown-Peterson decay (Peterson & Peterson 1959, J Exp Psychol) | New | proposed:`cognition-memory` | **Experiment** with a distractor task, then a **debate**: decay or interference? | Intermediate | Established, details debated | — | GP | No |
| 26 | Memory | Sensory memory, partial report (Sperling 1960, Psychol Monogr) | New | proposed:`cognition-memory` | **Experiment** (brief flash, cued row) | Intermediate | Well established | — | GP | No |
| 27 | Memory | Working memory model (Baddeley & Hitch 1974, in *Psychology of Learning and Motivation*) | Expand | `brain` 2.4 | **Concept map**, then a dual-task **experiment** (verbal plus spatial load) | Intermediate | Established, details debated | — | GP | Notes (memory systems) |
| 28 | Memory | Levels of processing (Craik & Lockhart 1972, J Verb Learn Verb Behav) | New | proposed:`cognition-memory` | **Experiment** (shallow versus deep orienting questions), then a surprise recall | Foundation | Established, details debated | — | GP | No |
| 29 | Memory | Forgetting curve (Ebbinghaus 1885, *Über das Gedächtnis*) | New | proposed:`cognition-memory` | **Timeline** plus a personal **experiment** using the platform's own re-checks | Foundation | Well established | — | GP | No |
| 30 | Memory | Testing effect (Roediger & Karpicke 2006, Psychol Sci) | New | all modules (study skills) | **Experiment** (study-study versus study-test). It explains to students why VIBHA checkpoints work as they do | Foundation | Well established | — | GP | No (but the platform design uses it) |
| 31 | Memory | Spacing effect (Cepeda et al. 2006, Psychol Bull) | New | all modules | **Reflection** using the student's own re-test history, plus **flashcards** | Foundation | Well established | — | GP | No (platform design uses it) |
| 32 | Memory | Interleaving (Kornell & Bjork 2008, Psychol Sci) | New | all modules | **Experiment** (blocked versus mixed category learning). Students feel that it is harder, which is the point | Intermediate | Well established (size varies by material) | — | GP | No |
| 33 | Memory | Generation effect (Slamecka & Graf 1978, J Exp Psychol Hum Learn Mem) | New | proposed:`cognition-memory` | **Experiment** (read versus generate word pairs) | Foundation | Well established | — | GP | No |
| 34 | Memory | Context-dependent memory (Godden & Baddeley 1975, Br J Psychol) | New | proposed:`cognition-memory` | **Case** of the diving study, then **group discussion**: does it matter for exam halls? (Effects are often small) | Intermediate | Established, details debated | — | GP | No |
| 35 | Memory | Schemas and comprehension (Bransford & Johnson 1972, J Verb Learn Verb Behav) | New | `case-sheet` | **Experiment** (passage with and without title). It shows why a framework first helps learning | Foundation | Well established | — | GP | No |
| 36 | Memory | Leading questions and eyewitness memory (Loftus & Palmer 1974, J Verb Learn Verb Behav) | New | `interview-mse` 1.4, `ethics-law` | **Experiment** (video then a reworded question), then **role-play** on neutral questioning | Intermediate | Well established | Low | GP | No |
| 37 | Memory | False memory, DRM lists (Roediger & McDermott 1995, J Exp Psychol Learn Mem Cogn) | New | proposed:`cognition-memory` | **Experiment**: students "remember" a word that was never shown | Intermediate | Well established | — | GP | No |
| 38 | Memory | Recovered-memory debate (Loftus 1993, Am Psychol) | New | `trauma`, `ethics-law` | **Debate** with strict facilitator notes. It is a real professional controversy with harm on both sides | Advanced | Debated | **High** (abuse; survivors may be in the room) | K; GP | No |
| 39 | Memory | Flashbulb memories: vivid but not accurate (Brown & Kulik 1977, Cognition; Talarico & Rubin 2003, Psychol Sci) | New | `trauma` | **Reflection** on a public event, then **discussion** of confidence versus accuracy | Intermediate | Well established (confidence is not accuracy) | Med | GP | No |
| 40 | Memory | Amnesia and H.M. (Scoville & Milner 1957, J Neurol Neurosurg Psychiatry) | Expand | `brain`, `neurocognitive` | **Case**, then a **concept map** of memory systems | Intermediate | Well established | Low | K; FA; GP | Notes (partly) |
| 41 | Memory | Episodic versus semantic, procedural memory | Taught | `brain` 2.4 | **Flashcards** plus a **case** sort (which system fails in which patient) | Foundation | Well established | — | K; GP | Notes |
| 42 | Memory | Sleep and memory consolidation (citation needed) | New | `brain` 2.2, `stabilisers` 2.3 | **Group discussion** linking to insomnia care; the strength of claims needs care | Intermediate | Established, details debated | — | GP | No |
| 43 | Memory | "Learning styles" matching (Pashler et al. 2008, Psychol Sci Public Interest) | New | study skills | **Debate**: a common myth, and a good exercise in evidence | Foundation | Well established that matching lacks support | — | GP | No |

### 3.3 Learning and behaviour change

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 44 | Learning | Classical conditioning: acquisition, extinction, spontaneous recovery (Pavlov 1927, *Conditioned Reflexes*) | Expand | `defences` 1.3, `therapies` 2.1 | **Simulation** (pair stimuli, watch the response curve). The timing rules are best grasped by manipulating them | Foundation | Well established | — | K; GP | Lab (in progress) |
| 45 | Learning | Conditioned fear, Little Albert (Watson & Rayner 1920, J Exp Psychol) | Taught | `defences`, `anxiety` | **Case**, then a **debate** on its ethics and weak data | Intermediate | Debated (method was weak) | Med (child harm) | K; GP | Notes |
| 46 | Learning | Generalisation and discrimination | Expand | `anxiety`, `trauma` | **Simulation** (generalisation gradient), linked to how a phobia spreads | Intermediate | Well established | Low | K; GP | No |
| 47 | Learning | Taste aversion and preparedness (Garcia & Koelling 1966, Psychon Sci) | New | `substance`, `more-disorders` | **Case** (chemotherapy nausea, disulfiram), then **group discussion** | Intermediate | Well established | Low | K; GP | No |
| 48 | Learning | Extinction is new learning: renewal and relapse (citation needed) | New | `anxiety`, `substance`, `ocd` | **Branching scenario**: exposure done in one setting, fear returns in another. It explains relapse prevention | Advanced | Well established (in animal and human lab work) | Low | K; GP | No |
| 49 | Learning | Operant conditioning and reinforcement schedules (Skinner 1938; Ferster & Skinner 1957) | Taught | `therapies`, `substance`, `child` | **Simulation**: response rate under each schedule, plus the extinction burst | Intermediate | Well established | — | K; GP | Lab (Reward schedules) |
| 50 | Learning | Shaping and the Premack principle (Premack 1959, Psychol Rev) | New | `child`, `therapies` | **Game** (shape a virtual animal's behaviour), then a **mini project**: design a home reward chart | Intermediate | Well established | Low | K; GP | No |
| 51 | Learning | Learned helplessness (Seligman & Maier 1967, J Exp Psychol) and the attributional reformulation | Taught | `depression`, `defences` | **Group discussion**: how a lab finding became a depression theory, and what changed when it was revised | Intermediate | Original finding Well established; the later neuroscience reinterpretation is Emerging | Med (animal harm, mood) | K; GP | Notes |
| 52 | Learning | Latent learning and cognitive maps (Tolman 1948, Psychol Rev) | New | proposed:`learning-behaviour` | **Timeline** (behaviourism to cognitive psychology) plus **case** | Intermediate | Well established | — | K; GP | No |
| 53 | Learning | Observational learning, Bobo doll (Bandura, Ross & Ross 1961, J Abnorm Soc Psychol) | Expand | `defences`, `therapies`, `child` | **Case**, then a **debate** on media violence (a live, mixed literature) | Intermediate | Original finding Well established; media effects Debated | Low | K; GP | Notes (named) |
| 54 | Learning | Self-efficacy (Bandura 1977, Psychol Rev) | Expand | `therapies`, `substance` | **Role-play** that builds self-efficacy in an MI conversation | Intermediate | Well established | — | K; GP | Notes (named) |
| 55 | Learning | Systematic desensitisation and exposure hierarchies (Wolpe 1958, *Psychotherapy by Reciprocal Inhibition*) | Taught | `therapies`, `anxiety`, `ocd` | **Mini project**: build a graded hierarchy for a vignette patient | Intermediate | Well established (exposure); reciprocal inhibition as the mechanism is Debated | Low | K | Notes |
| 56 | Learning | Token economies (Ayllon & Azrin 1968, *The Token Economy*) | New | `psychosis` (rehab), `child` | **Group case analysis** with an ethics angle (choice, dignity) | Advanced | Established, details debated | Med (institutional settings) | K; GP | No |
| 57 | Learning | Stages of change (Prochaska & DiClemente 1983, J Consult Clin Psychol) | Taught | `substance` 4.1 | **Branching scenario**: match the response to the stage | Intermediate | Debated (stage boundaries and matched-intervention evidence) | Low | K | Notes |
| 58 | Motivation | Habit formation and cue-routine-reward (citation needed) | New | `substance`, proposed:`health-positive` | **Reflection** (track one habit for a week) plus a **mini project** | Foundation | Established, details debated | — | GP | No |

### 3.4 Motivation and emotion

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 59 | Motivation | Maslow's hierarchy | Taught | `personality` 1.2 | **Debate**: well known but weakly supported as a strict order | Foundation | Debated | — | GP | Notes |
| 60 | Motivation | Intrinsic versus extrinsic motivation and the overjustification effect (Deci 1971, JPSP; Deci, Koestner & Ryan 1999, Psychol Bull) | New | proposed:`motivation-emotion`, `child` | **Experiment** (a puzzle with and without reward), then **discussion** of reward charts | Intermediate | Established, details debated | — | GP | No |
| 61 | Motivation | Self-determination theory (autonomy, competence, relatedness) (citation needed) | New | `therapies` (MI fit) | **Concept map** linking SDT to MI and adherence | Intermediate | Well established framework | — | GP | No |
| 62 | Motivation | Arousal and performance, Yerkes-Dodson (Yerkes & Dodson 1908, J Comp Neurol Psychol) | Expand | `anxiety` 1.1 | **Simulation** (curve with task difficulty), then a **debate** on how much the "law" is really supported | Foundation | Debated (often overstated) | — | GP | No (implicit in notes) |
| 63 | Motivation | Delay of gratification, marshmallow test (Mischel, Ebbesen & Zeiss 1972, JPSP; Watts, Duncan & Quan 2018, Psychol Sci) | New | `child`, proposed:`lifespan` | **Debate**: the replication shows how background factors change the meaning of a famous result | Intermediate | Debated (long-term predictions) | Low (socio-economic framing) | GP | No |
| 64 | Motivation | Ego depletion (Baumeister et al. 1998, JPSP; Hagger et al. 2016 multi-lab replication, Perspect Psychol Sci) | New | `research-methods` (proposed) | **Case** in the replication crisis; **group discussion** | Advanced | Debated (large replication found a near-zero effect) | — | GP | No |
| 65 | Emotion | Theories of emotion: James-Lange, Cannon-Bard, two-factor (Schachter & Singer 1962, Psychol Rev) | New | proposed:`motivation-emotion`, `anxiety` | **Timeline** plus a **concept map**. Panic (body first, then appraisal) makes a good clinical anchor | Intermediate | Theories are historical; two-factor replications were mixed (Debated) | — | GP | No |
| 66 | Emotion | Universal facial expressions (Ekman & Friesen 1971, JPSP) | New | `interview-mse` 2.3 (affect) | **Game** (rate expressions), then a **debate** on universality versus cultural display rules | Intermediate | Debated (degree of universality) | Low | GP | No |
| 67 | Emotion | Facial feedback (Strack, Martin & Stepper 1988, JPSP; Wagenmakers et al. 2016 RRR, Perspect Psychol Sci) | New | `research-methods` (proposed) | **Experiment** (pen-in-mouth) followed by the failed replication as a **case** | Advanced | Debated | — | GP | No |
| 68 | Emotion | Emotion regulation strategies (reappraisal versus suppression) (citation needed) | New | `therapies` 2.5 (DBT skills) | **Role-play** using reappraisal in a peer conversation, then **reflection** | Intermediate | Well established (reappraisal generally adaptive; context matters) | Med (personal disclosure) | K | No |

### 3.5 Social and cultural psychology

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 69 | Social | Conformity, line judgment (Asch 1956, Psychol Monogr) | New | proposed:`social-cultural`, `ethics-law` | **Experiment** (simulated group answers), then **discussion** of ward culture and team decisions | Foundation | Well established (rates vary by culture and era) | — | GP | Lab (in progress) |
| 70 | Social | Obedience to authority (Milgram 1963, J Abnorm Soc Psychol) | New | `ethics-law` 1.4 and 1.5 | **Case** plus a **debate** on research ethics. It is never re-enacted | Intermediate | Established, details debated (later archival critiques) | Med (distress, deception) | GP | No |
| 71 | Social | Stanford Prison Experiment (Haney, Banks & Zimbardo 1973) | New | `ethics-law`, `research-methods` | **Debate**: a famous study whose method and conclusions are now heavily disputed | Advanced | Debated | Med | GP | No |
| 72 | Social | Fundamental attribution error (Jones & Harris 1967, J Exp Soc Psychol; Ross 1977) | New | `case-sheet`, `personality` | **Game** (attribute behaviour in vignettes), linked to labelling a "difficult patient" | Intermediate | Well established (weaker in some cultures) | Low | GP | Lab (in progress) |
| 73 | Social | Actor-observer and self-serving biases | New | `case-sheet` | **Reflection**: your explanations of your own mistakes versus a colleague's | Intermediate | Established, details debated | — | GP | No |
| 74 | Social | Cognitive dissonance (Festinger & Carlsmith 1959, J Abnorm Soc Psychol) | New | `substance`, `therapies` (MI) | **Experiment** (a classroom version), then **discussion**: why MI avoids arguing | Intermediate | Well established | — | GP | No |
| 75 | Social | Bystander effect (Darley & Latané 1968, JPSP) | New | `suicide` (asking directly), `trauma` | **Branching scenario** (a peer in crisis in a group chat) | Foundation | Well established (effect varies with danger level) | Med (suicide context) | GP | No |
| 76 | Social | Social facilitation (Triplett 1898, Am J Psychol; Zajonc 1965, Science) | New | proposed:`social-cultural` | **Experiment** (alone versus observed timed task) | Foundation | Well established | — | GP | No |
| 77 | Social | Groupthink (Janis 1972, *Victims of Groupthink*) | New | `case-sheet`, `personality` 3.2 (team) | **Group case analysis** of a team decision gone wrong | Intermediate | Debated (as a full model) | — | GP | No |
| 78 | Social | Minimal group paradigm (Tajfel 1970, Sci Am) | New | proposed:`social-cultural` | **Experiment** (arbitrary group assignment, then allocation choices) | Intermediate | Well established | Low | GP | No |
| 79 | Social | Robbers Cave and superordinate goals (Sherif et al. 1961) | New | proposed:`social-cultural` | **Case**, then **discussion** of community mental health work across groups | Intermediate | Established, details debated (method critiques) | Low | GP | No |
| 80 | Social | Contact hypothesis (Allport 1954, *The Nature of Prejudice*; Pettigrew & Tropp 2006, JPSP) | New | `psychosis` (stigma), `ethics-law` | **Group discussion** on reducing mental-illness stigma through contact | Intermediate | Well established | Med (stigma) | GP | No |
| 81 | Social | Implicit Association Test (Greenwald, McGhee & Schwartz 1998, JPSP) | New | `research-methods` (proposed) | **Debate** on what implicit measures predict. Students can try one as a **reflection**, not as a verdict on themselves | Advanced | Debated (prediction of behaviour) | Med (identity) | GP | No |
| 82 | Social | Stereotype threat (Steele & Aronson 1995, JPSP) | New | `assessment` (test fairness) | **Debate**: an influential effect with mixed replications | Advanced | Debated | Med (caste, gender, identity) | GP | No |
| 83 | Social | Labelling and diagnosis: "On being sane in insane places" (Rosenhan 1973, Science) | New | `ethics-law`, `case-sheet` | **Debate**: a classic now seriously questioned, and a good lesson in scrutinising a source | Advanced | Debated | Med | GP | No |
| 84 | Social | Mere exposure (Zajonc 1968, JPSP Monogr Suppl) | New | proposed:`social-cultural` | **Experiment** (rate repeated versus new shapes) | Foundation | Well established | — | GP | No |
| 85 | Social | Expectancy effects / Pygmalion (Rosenthal & Jacobson 1968) | New | `child`, `assessment` | **Group discussion**: teacher and clinician expectations; the size of the effect is debated | Intermediate | Debated (size) | Low | GP | No |
| 86 | Cultural | WEIRD samples (Henrich, Heine & Norenzayan 2010, Behav Brain Sci) | New | all general-psychology modules | **Group discussion**: which findings travel to Indian students and patients? | Intermediate | Well established (as a sampling critique) | — | GP | No |
| 87 | Cultural | Independent and interdependent self (Markus & Kitayama 1991, Psychol Rev) | New | `therapies` 3.4, `interview-mse` 2.12 | **Case** (the same symptoms framed differently), then **role-play** with family present | Intermediate | Well established framework, details debated | Low | GP | Notes (partly in 3.4) |
| 88 | Cultural | Individualism and collectivism (Hofstede 1980, *Culture's Consequences*) | New | proposed:`social-cultural` | **Debate**: a useful but blunt tool; warn against national stereotypes | Intermediate | Debated | Low | GP | No |
| 89 | Cultural | Family involvement in Indian mental health care (citation needed) | Expand | `therapies`, `ethics-law` (nominated representative) | **Role-play** (a three-way consultation with family), then **group discussion** | Intermediate | Well established in practice; research base needs educator input | Med | FA; K | Notes (partly) |
| 90 | Cultural | Idioms of distress and culture-bound presentations in India | Taught | `more-disorders` 4.2, `interview-mse` 2.12 | **Case** plus **flashcards** of local expressions (the `:::sounds` blocks already do this) | Intermediate | Well established (descriptive) | Med (avoid exoticising) | FA; K | Notes |
| 91 | Cultural | Indian indigenous psychology (for example, guna-based personality ideas) (citation needed) | New | `personality` 1.2 | **Group discussion** with educator-supplied sources only. It needs expert framing | Advanced | Emerging | Med (religious and cultural framing) | GP | No |
| 92 | Cultural | Caste, gender and poverty as social determinants of mental health (citation needed) | New | `depression` 2.2, `suicide` 1.2 | **Group case analysis** using a fictional composite case | Advanced | Well established (direction); local data need educator input | **High** | FA; GP | No |

### 3.6 Development across the lifespan

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 93 | Development | Piaget's stages and conservation (original works, citation pending) | Taught | `defences` 3.2, `child` | **Simulation** (pour water between glasses, predict a child's answer). It turns stage names into observable reasoning | Foundation | Established, details debated (children often succeed earlier on simplified tasks) | — | K; GP | Lab (in progress) |
| 94 | Development | Vygotsky: zone of proximal development and scaffolding (Vygotsky 1978, *Mind in Society*) | New | `child`, `therapies` | **Role-play** (scaffold a peer through a task), then **reflection** | Intermediate | Well established framework | — | K; GP | No |
| 95 | Development | Theory of mind, Sally-Anne (Baron-Cohen, Leslie & Frith 1985, Cognition) | New | `child` 2.2 (autism) | **Case** with an animated false-belief task, then a **debate** on how much ToM explains autism | Intermediate | Task finding Well established; as an explanation of autism, Debated | Med (neurodiversity language) | K; GP | No |
| 96 | Development | Attachment: Strange Situation (Ainsworth & Bell 1970, Child Dev) | Taught | `defences` 3.3, `trauma` 2.3 | **Case** (video-style vignettes), then **classify** each as a **game** | Intermediate | Well established (cross-cultural distributions vary) | Med (parenting blame) | K; GP | Notes |
| 97 | Development | Contact comfort, Harlow's monkeys (Harlow 1958, Am Psychol) | Expand | `defences` 3.3 | **Case** plus a **debate** on animal research ethics | Intermediate | Well established | Med (animal harm) | K; GP | No (Bowlby named) |
| 98 | Development | Adult attachment (Hazan & Shaver 1987, JPSP) | New | `personality`, `therapies` | **Reflection** (with care), then **group discussion** of the therapeutic relationship | Advanced | Established, details debated | Med (personal disclosure) | K; GP | No |
| 99 | Development | Erikson's psychosocial stages | Taught | `defences` 3.1 | **Timeline** across the lifespan with a patient example at each stage | Foundation | Theory, weakly tested | — | K; GP | Notes |
| 100 | Development | Kohlberg's moral stages, and the Gilligan critique | Taught | `defences` 3.4 | **Debate** using the dilemma format itself | Intermediate | Debated | — | K; GP | Notes |
| 101 | Development | Temperament (New York Longitudinal Study, Thomas & Chess, citation needed) | Taught | `defences` 3.4, `child` | **Case** (three children, three temperaments) plus a **parent-counselling role-play** | Foundation | Well established | Low | K | Notes |
| 102 | Development | Bronfenbrenner's ecological systems (Bronfenbrenner 1979, *The Ecology of Human Development*) | New | `child` 1.1 | **Concept map** of a child's systems for a vignette. It builds the formulation habit | Foundation | Well established framework | — | K; GP | No |
| 103 | Development | Parenting styles (Baumrind, citation needed) | New | `child` 3.1 | **Group discussion**: does the Western typology fit Indian families? | Intermediate | Established, details debated (cultural fit) | Med | K; GP | No |
| 104 | Development | Adolescent brain and risk-taking (citation needed) | New | `child` 3.4, `substance` | **Group discussion** with a peer-influence scenario | Intermediate | Established, details debated | Low | K; GP | No |
| 105 | Development | Ageing: cognitive change, fluid versus crystallised | Expand | `assessment` 2.5, `neurocognitive` | **Case** (normal ageing versus MCI versus dementia), then a **branching scenario** | Intermediate | Well established | Low | K; GP | Notes (partly) |
| 106 | Development | Growth mindset (Sisk et al. 2018, Psychol Sci meta-analysis) | New | study skills | **Debate**: a popular idea with small average effects | Intermediate | Debated | — | GP | No |

### 3.7 Personality theory

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 107 | Personality | Big Five traits | Taught | `personality` 1.2, `assessment` 2.2 | **Game**: sort behaviours into traits, then a self-**reflection** (not a diagnosis) | Foundation | Well established | Low | K; GP | Notes |
| 108 | Personality | Heritability, twins reared apart (Bouchard et al. 1990, Science) | New | `personality` 1.2 | **Group discussion** of what heritability does and does not mean | Advanced | Well established (interpretation often misunderstood) | Low | K; GP | No |
| 109 | Personality | Person-situation debate (Mischel 1968, *Personality and Assessment*) | New | `personality`, `case-sheet` | **Debate** with motion 7 below | Advanced | Debated (largely resolved as interactionism) | — | K; GP | No |
| 110 | Personality | Locus of control (Rotter 1966, Psychol Monogr) | New | `depression`, `therapies` | **Reflection** plus a **case** | Intermediate | Well established | — | K; GP | No |
| 111 | Personality | Barnum effect (Forer 1949, J Abnorm Soc Psychol) | New | `assessment` (test reports) | **Experiment**: everyone gets the same "personal" profile and rates it accurate. A sharp lesson for writing reports | Foundation | Well established | — | GP | No |
| 112 | Personality | Psychodynamic, humanistic and social-cognitive perspectives compared | Taught | `defences`, `personality` | **Concept map** applying each lens to one case | Intermediate | Varies by perspective | — | K; GP | Notes |

### 3.8 Research methods and statistics

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 113 | Methods | Variables, operational definitions, confounds | New | proposed:`research-methods` | **Experiment** (design a fair test of a claim). Practice beats a definitions list | Foundation | Well established | — | GP | Lab (in progress) |
| 114 | Methods | Correlation is not causation | New | proposed:`research-methods` | **Game** (spot the hidden third variable in headlines) | Foundation | Well established | — | GP | Lab (in progress, scope to confirm) |
| 115 | Methods | Sampling and generalisation | New | proposed:`research-methods` | **Simulation** (draw samples, watch the estimate wobble) | Foundation | Well established | — | GP | No |
| 116 | Methods | Reliability and validity | Taught | `assessment` 1.1 | **Game** (classify scenarios), extending the clock analogy already in the notes | Foundation | Well established | — | K; GP | Notes |
| 117 | Methods | Normal curve, z-scores, percentiles | Taught | `assessment` 1.2 | **Simulation** (drag a score, read percentile and IQ band) | Foundation | Well established | — | K; GP | Notes |
| 118 | Methods | Sensitivity, specificity, base rates and predictive value | Expand | `assessment` 2.4, `suicide` (risk tools) | **Simulation** with a population grid. It explains why risk scales predict individuals poorly | Advanced | Well established | Med (suicide risk) | GP | No |
| 119 | Methods | Effect size and p-values (Wasserstein & Lazar 2016, Am Stat) | New | proposed:`research-methods`, `antidepressants` 1.2 | **Simulation** (sample size versus significance), then a **case** on drug-placebo differences | Intermediate | Well established | — | GP | No |
| 120 | Methods | Regression to the mean | New | `therapies`, `antidepressants` | **Simulation** (select extreme scorers, re-test them). It explains part of "improvement" without treatment | Intermediate | Well established | — | GP | No |
| 121 | Methods | Placebo, blinding and expectancy (Beecher 1955, JAMA; Hróbjartsson & Gøtzsche 2001, NEJM) | Expand | `antidepressants` 1.2 | **Debate**: how powerful is the placebo really? | Advanced | Debated (size, especially for objective outcomes) | Low | MS; GP | Notes (placebo mentioned) |
| 122 | Methods | Antidepressant efficacy debate (Kirsch et al. 2008, PLoS Med; Cipriani et al. 2018, Lancet) | Expand | `antidepressants` 1.2 | **Group discussion** with a strict facilitator note: never advise stopping medication | Advanced | Debated (size and clinical meaning) | **High** (patients and students on medication) | MS; GP | Notes (partly) |
| 123 | Methods | Replication crisis (Open Science Collaboration 2015, Science) | New | proposed:`research-methods` | **Case** series (rows 64, 67, 71, 82), then a **mini project**: check a claim's evidence trail | Advanced | Well established (that many findings did not replicate) | — | GP | No |
| 124 | Methods | Case study method (H.M., Phineas Gage) | Expand | `brain`, `neurocognitive` | **Group case analysis**: what a single case can and cannot prove | Intermediate | Well established (as method) | Low | GP | No |
| 125 | Methods | Research ethics: consent, deception, debriefing, the right to withdraw | Expand | `ethics-law` 1.2 | **Debate** using Milgram and Little Albert | Intermediate | Well established (as standards) | Med | K; GP | Notes (clinical consent only) |
| 126 | Methods | Reading a paper: abstract, methods, limitations | New | proposed:`research-methods` | **Mini project** in pairs: a one-page appraisal using a checklist | Advanced | — | — | GP | No |

### 3.9 Biological, health and positive psychology

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 127 | Biological | Neuron, synapse, neurotransmitters | Taught | `brain` 1.1 to 1.3 | **Simulation** (step through transmission; add an agonist or antagonist) | Foundation | Well established | — | MS; K | Notes, Coach |
| 128 | Biological | Phineas Gage and the frontal lobe (case, 19th century) | Expand | `brain` 2.3 | **Case**, then a **debate** on how the story grew over time | Intermediate | Case facts Debated (later embellishment) | — | K; GP | No |
| 129 | Biological | Split-brain studies (citation needed) | New | `brain` | **Simulation** (left versus right visual field presentation) | Intermediate | Well established (details debated) | — | K; GP | No |
| 130 | Biological | Reward circuitry (Olds & Milner 1954, J Comp Physiol Psychol) | Expand | `brain`, `substance` | **Concept map** connecting dopamine, reward and addiction | Intermediate | Well established (simple "pleasure centre" readings are debated) | Low | MS; K | Notes (partly) |
| 131 | Biological | Neuroplasticity | Taught | `brain` 2.2 | **Reflection** linking to therapy and recovery | Foundation | Well established | — | MS; K | Notes |
| 132 | Health | General adaptation syndrome (Selye 1936, Nature) | Expand | `brain` 2.2 | **Timeline** of the stress response, then a **concept map** linking it to the HPA axis | Foundation | Established, details debated | — | K; GP | Notes (HPA) |
| 133 | Health | Transactional stress and coping (Lazarus & Folkman 1984, *Stress, Appraisal, and Coping*) | New | proposed:`health-positive`, `trauma` | **Case**, then **role-play** of a coping conversation | Intermediate | Well established framework | Low | K; GP | No |
| 134 | Health | Life events and illness (Holmes & Rahe 1967, J Psychosom Res) | New | `depression` 2.2 | **Reflection** (with an opt-out), then a **debate** on whether life-event checklists are valid | Intermediate | Debated (measurement) | Med (personal disclosure) | K; GP | No |
| 135 | Health | Stress and immunity (Cohen, Tyrrell & Smith 1991, NEJM) | New | proposed:`health-positive` | **Case**, then **group discussion** of a mind-body formulation | Intermediate | Well established | — | K; GP | No |
| 136 | Health | Health behaviour models and adherence (citation needed) | New | `antipsychotics`, `stabilisers` | **Branching scenario**: a patient stops lithium. Explore beliefs before persuading | Intermediate | Established, details debated | Low | MS; K | No |
| 137 | Positive | Positive psychology as a field (Seligman & Csikszentmihalyi 2000, Am Psychol) | New | proposed:`health-positive` | **Group discussion** that balances its strengths against its critiques | Foundation | Field framework | — | GP | No |
| 138 | Positive | Gratitude interventions (Emmons & McCullough 2003, JPSP) | New | proposed:`health-positive`, `depression` (BA) | **Reflection** (a two-week journal) plus a **discussion** of the small effect sizes | Foundation | Established, details debated (effects modest) | Low | GP | No |
| 139 | Positive | Hedonic adaptation (Brickman, Coates & Janoff-Bulman 1978, JPSP) | New | proposed:`health-positive` | **Debate** using the lottery and injury findings, and their limits | Intermediate | Debated | Med (disability framing) | GP | No |
| 140 | Positive | Resilience after adversity (citation needed) | New | `trauma` 3.1 | **Group discussion**: most people recover without disorder, so do not pathologise normal distress | Intermediate | Well established | Med | K; GP | No |

### 3.10 Counselling micro-skills and clinical reasoning

| # | Domain | Concept / Study | Status | Linked module | Best format and why | Level | Evidence | Sensitivity | Book ref | Implemented? |
|---|---|---|---|---|---|---|---|---|---|---|
| 141 | Counselling | Rogers' core conditions (Rogers 1957, J Consult Psychol) | Expand | `therapies` 1.1, `interview-mse` 1.3 | **Role-play** in triads (client, counsellor, observer with a checklist) | Foundation | Well established as facilitative; "sufficient" is Debated | Low | K; GP | Notes (partly) |
| 142 | Counselling | Attending behaviour and non-verbal skills (microcounselling, Ivey, citation needed) | Expand | `interview-mse` 1.3 and 1.4 | **Role-play** with video self-review (**reflection**) | Foundation | Well established (as training method) | — | K; GP | Practice: Peer Role-Play |
| 143 | Counselling | Paraphrase, reflection of feeling, summarising | Expand | `interview-mse` 1.4, `therapies` 1.3 | **Game** ("Say it clinically" style: pick the best reflection), then **role-play** | Foundation | Well established | — | K; GP | Partly (Coach: counselling) |
| 144 | Counselling | Open versus closed questions; funnelling | Taught | `interview-mse` 1.4 | **Simulation** (Consulting Room), whose debrief flags closed questions | Foundation | Well established | — | K; GP | Practice: Consulting Room |
| 145 | Counselling | Silence, immediacy and challenge | New | `therapies` | **Role-play** with observer feedback | Intermediate | Well established (as practice wisdom) | Low | K; GP | No |
| 146 | Counselling | Motivational interviewing: OARS, change talk | Taught | `therapies` 1.3, `substance` 4.1 | **Branching scenario** plus **role-play** | Intermediate | Well established | Low | K | Notes, Coach |
| 147 | Counselling | Therapeutic alliance and rupture repair (citation needed) | Expand | `therapies` 1.1 | **Role-play** of a rupture (a client says "this isn't helping") | Advanced | Well established (alliance-outcome link) | Low | K | Notes (alliance) |
| 148 | Counselling | Common factors versus specific techniques ("Dodo bird" debate, citation needed) | Expand | `therapies` 1.1 | **Debate** (motion 6) | Advanced | Debated | — | K; GP | Notes (partly) |
| 149 | Counselling | Endings, referral and supervision | Expand | `ethics-law`, `trauma` 3.4 | **Group case analysis** plus **reflection** on self-care | Intermediate | Well established (as practice standards) | Low | K | Practice: Ethics (referral) |
| 150 | Clinical reasoning | Description before labelling (MSE) | Taught | `interview-mse` part II | **Game** (MSE tagger) | Foundation | Well established practice | — | FA; K | Practice: MSE |
| 151 | Clinical reasoning | Bayesian updating of a differential | Taught | `case-sheet` 2.2 | **Simulation** (Judgment slider: new information shifts probability) | Intermediate | Well established | — | GP | Practice: Judgment |
| 152 | Clinical reasoning | 5P formulation | Taught | `case-sheet` 2.1, `therapies` 1.2 | **Mini project** (Formulation tool), then **group case analysis** | Intermediate | Well established practice | Low | K; FA | Practice: Formulation |
| 153 | Clinical reasoning | Suicide risk conversation and safety planning | Taught | `suicide` | **Role-play** with a strict protocol, and **branching scenario** | Advanced | Well established (asking does not increase risk); risk prediction is weak | **High** | K; FA; MS | Notes, Scenarios |
| 154 | Clinical reasoning | Capacity and consent under MHCA 2017 | Taught | `ethics-law` | **Branching scenario** (Ethics tool) | Advanced | Law (fact); application debated case by case | Med | FA (pre-MHCA); Act text | Practice: Ethics |

That makes 154 rows. This is more than the 60 to 90 asked for, because the existing Lab and practice tools needed rows of their own so that "Implemented?" is complete. For a first build, the 90 rows marked **New** or **Expand** at Foundation and Intermediate level are the working set.

---

## 4. Progressive pathways

Each step names a format. Steps marked ✓ exist today; the rest are proposed. A student should not need to finish one track before starting another; the tracks interleave by design (section 6).

### Track A: Cognition and memory
| Level | Step | Format |
|---|---|---|
| Foundation | 1. Digit span (row 23) ✓ | Experiment (Lab) |
| Foundation | 2. Serial position (24) ✓ | Experiment (Lab) |
| Foundation | 3. Levels of processing (28) | Experiment |
| Foundation | 4. Stroop (1) ✓ | Experiment (Lab) |
| Foundation | 5. Testing effect (30) and spacing (31): why VIBHA re-checks you | Experiment and reflection |
| Intermediate | 6. Working memory model (27) | Concept map and dual-task experiment |
| Intermediate | 7. Spot the change (2) ✓ and inattentional blindness (3) | Experiment, then reflection on interviewing |
| Intermediate | 8. DRM false memory (37) and leading questions (36) | Experiment, then role-play of neutral questioning |
| Intermediate | 9. Memory systems in patients (40, 41) | Case sort |
| Advanced | 10. Signal detection (10) and base rates (118) | Simulation |
| Advanced | 11. Bias spotter (14) ✓, then framing (15) | Game, then debate |
| Advanced | 12. Recovered-memory controversy (38) | Debate (facilitated, sensitive) |

### Track B: Learning and behaviour change
| Level | Step | Format |
|---|---|---|
| Foundation | 1. Classical conditioning: acquisition and extinction (44) (in progress) | Simulation (Lab) |
| Foundation | 2. Reward schedules (49) ✓ | Simulation (Lab) |
| Foundation | 3. Habit tracking (58) | Reflection |
| Intermediate | 4. Generalisation (46) and Little Albert (45) | Simulation, then debate |
| Intermediate | 5. Shaping and Premack (50) | Game, then mini project (reward chart) |
| Intermediate | 6. Overjustification (60) | Experiment and discussion |
| Intermediate | 7. Exposure hierarchy (55) | Mini project |
| Advanced | 8. Renewal and relapse (48) | Branching scenario |
| Advanced | 9. Stages of change (57) plus MI (146) | Branching scenario, then role-play |
| Advanced | 10. Token economy ethics (56) | Group case analysis |

### Track C: Social and cultural
| Level | Step | Format |
|---|---|---|
| Foundation | 1. Conformity (69) (in progress) | Experiment (Lab) |
| Foundation | 2. Mere exposure (84) and social facilitation (76) | Experiment |
| Foundation | 3. Bystander effect (75) | Branching scenario |
| Intermediate | 4. Fundamental attribution error (72) (in progress) | Game (Lab) |
| Intermediate | 5. Cognitive dissonance (74), linked to MI | Experiment and discussion |
| Intermediate | 6. Minimal groups (78), Robbers Cave (79), contact (80) | Experiment, case, group discussion |
| Intermediate | 7. WEIRD samples (86) and the interdependent self (87) | Group discussion, role-play with family |
| Advanced | 8. Obedience (70) and the Stanford Prison Experiment (71) | Case and debate (research ethics) |
| Advanced | 9. Rosenhan (83), stereotype threat (82), IAT (81) | Debate |
| Advanced | 10. Social determinants in India (92) | Group case analysis (sensitive) |

### Track D: Development across the lifespan
| Level | Step | Format |
|---|---|---|
| Foundation | 1. Conservation (93) (in progress) | Simulation (Lab) |
| Foundation | 2. Erikson timeline (99) | Timeline |
| Foundation | 3. Bronfenbrenner map of a child (102) | Concept map |
| Foundation | 4. Temperament (101) | Case and parent role-play |
| Intermediate | 5. Strange Situation (96) and Harlow (97) | Classification game, then debate |
| Intermediate | 6. Theory of mind (95) | Case and debate |
| Intermediate | 7. Vygotsky and scaffolding (94) | Role-play |
| Intermediate | 8. Parenting styles in Indian families (103) | Group discussion |
| Advanced | 9. Adolescence and risk (104) and the marshmallow replication (63) | Discussion, then debate |
| Advanced | 10. Ageing versus dementia (105) | Branching scenario |

### Track E: Clinical reasoning
| Level | Step | Format |
|---|---|---|
| Foundation | 1. Interview technique (144) ✓ | Simulation (Consulting Room) |
| Foundation | 2. Describe before you label (150) ✓ | Game (MSE tagger) |
| Foundation | 3. Micro-skills: reflection and summary (143) | Game, then triad role-play |
| Intermediate | 4. Probability updating (151) ✓ | Simulation (Judgment) |
| Intermediate | 5. 5P formulation (152) ✓ | Mini project (Formulation tool) |
| Intermediate | 6. Attribution and "difficult patient" labels (72, 73) | Game, then reflection |
| Advanced | 7. Bias spotter (14) ✓ | Game (Lab) |
| Advanced | 8. Base rates and risk tools (118) | Simulation |
| Advanced | 9. Suicide risk conversation (153) ✓ | Role-play and branching scenario |
| Advanced | 10. Capacity under MHCA (154) ✓ and the OSCE | Branching scenario, then OSCE station |

---

## 5. Collaborative learning plan

Ready to use. Each item lists group size, time, the task, and facilitator notes. Peer Role-Play (`/practice/role-play`) and the Case Library already support pairs; the rest can run in class or on a video call.

**General rules for every item.** Students never have to disclose their own mental health. Every role is fictional. Agree a signal for stepping out of a role. End each session by stepping out of role ("de-roling").

### Group discussions

1. **"Which findings travel?"** (groups of 4 to 6, 30 min; rows 7, 69, 86)
   Task: take three classic findings (Asch conformity, Müller-Lyer, attribution error). For each, predict whether it would replicate with students in your city, and say why.
   Facilitator: push for reasons, not opinions. Record predictions and compare with the cross-cultural evidence at the end. Do not let the discussion slide into national stereotypes.

2. **"Is this normal distress?"** (groups of 4, 25 min; rows 140, 89)
   Task: three fictional vignettes after bereavement, an exam failure and a flood. Decide what support each person needs, and whether any of them needs a diagnosis.
   Facilitator: the point is not over-pathologising, and that family and community are resources. Have the helpline and safety information from `suicide` 3.2 ready.

3. **"What did the interviewer miss?"** (pairs, then the whole class, 20 min; rows 3, 36)
   Task: after the inattentional-blindness experiment, list what a clinician writing notes might miss (affect change, a relative's look). Rewrite three leading questions as neutral ones.
   Facilitator: link to `interview-mse` 1.8 (common errors).

### Debate motions

Format: two teams of 3, 4 minutes each side, 3 minutes of rebuttal, then an open floor. Afterwards the audience votes on the arguments, not on their prior view.

4. **"This house believes the Milgram study should never have been run."** (rows 70, 125)
   Facilitator: separate what was learned from how it was learned. Close with today's ethics standards (consent, debriefing, the right to withdraw). Avoid re-enacting any part of the study.

5. **"This house believes risk-assessment scales should not be used to decide who is admitted."** (rows 118, 153)
   Facilitator: both sides must use base-rate reasoning. Close with the agreed position: scales can structure a conversation but do not predict individuals. **High sensitivity**: run only after the `suicide` module, check in with the group first, and have support details visible.

6. **"This house believes it is the relationship, not the technique, that heals."** (rows 141, 148)
   Facilitator: expect common-factors versus specific-effects evidence. Steer to the synthesis that both matter, and that specific techniques matter more for some disorders (for example ERP for OCD).

7. **"This house believes personality is stable across situations."** (rows 107, 109)
   Facilitator: lead towards interactionism. Link to why premorbid personality is taken from informants (`interview-mse` 1.6).

8. **"This house believes famous findings that failed to replicate should be removed from textbooks."** (rows 64, 67, 71, 83, 123)
   Facilitator: alternative position: teach them as case studies in how science corrects itself. Have students propose how a textbook should present them.

### Peer role-play prompts

Triads: client, counsellor, observer with a checklist. 8 minutes of role-play, 5 minutes of feedback, then rotate roles.

9. **Reflection of feeling.** (row 143)
   Client brief: a second-year student worried about letting parents down after a poor result, who gives facts but not feelings.
   Counsellor task: three reflections of feeling and one summary, with no advice.
   Observer: tick each open question, reflection and summary, and note any advice given.

10. **Family in the room.** (rows 87, 89)
    Client brief: a young adult with low mood attends with a parent who answers for them.
    Counsellor task: include both, get time alone with the client respectfully, and explain confidentiality.
    Facilitator: link to MHCA confidentiality and the nominated representative (`ethics-law` 1.3, 2.2).

11. **Ambivalence about drinking (MI).** (rows 57, 146)
    Client brief: a man who drinks daily and says "everyone in my office drinks".
    Counsellor task: elicit two change-talk statements using OARS. No arguing.
    Observer: count righting-reflex moments.

12. **Rupture and repair.** (row 147)
    Client brief: "These sessions are a waste of time."
    Counsellor task: name the rupture, take responsibility for your part, and invite feedback.
    Facilitator: normalise ruptures as part of therapy, not failure.

### Group case analysis

13. **The "difficult patient" note.** (groups of 4, 30 min; rows 72, 14, 92)
    Task: a fictional ward note describes a patient as "manipulative and attention-seeking". Rewrite it as behaviour description, list alternative explanations (situational, cultural, medical), and name any biases.
    Facilitator: link to diagnostic overshadowing in Bias spotter and to stigma.

14. **The single case.** (groups of 4, 25 min; rows 40, 124, 128)
    Task: using H.M. and Phineas Gage, list what each case proved, what it suggested, and what it could not show.
    Facilitator: end with the general rule about what case studies can tell us.

15. **The medication headline.** (groups of 4, 35 min; rows 119, 120, 121, 122)
    Task: a fictional headline says "Antidepressants barely beat sugar pills". Using effect size, regression to the mean and placebo, write a 150-word balanced note for a fellow student.
    Facilitator, **High sensitivity**: state at the start that no one should change their own medication because of a class exercise, and that such decisions belong with their prescriber. Keep the discussion on evidence, not personal choices.

---

## 6. Retention design

### 6.1 What the platform already does

These mechanisms exist in code today. They are based on well-studied effects (retrieval practice, spacing and interleaving), but none of them guarantees retention for an individual student, and the platform does not yet measure long-term retention.

| Mechanism | Where | What it does |
|---|---|---|
| Delayed retrieval checkpoints | `src/lib/study/checkpoints.ts` | Teaching sections are grouped in blocks of about three (`BLOCK = 3`), never across a Part. A block's checkpoint opens only after every section in it is read **and** the student has finished at least one later section, so recall is delayed rather than immediate. Case MCQs come first, then say-it-aloud recall cards, shuffled deterministically (`seededShuffle`). |
| Module re-tests | `src/lib/study/plan.ts` `RETEST_GAPS = [3, 7, 21]` | After the module test, re-tests fall due 3, 7 and 21 days later and appear first on the Continue card. |
| Leitner review of quiz items | `src/lib/learn/engine.ts` `INTERVALS = [0, 1, 3, 7, 14, 30]` | A wrong answer resets the item to box 1 (due the next day). Each correct review moves it up a box (3, 7, 14, 30 days) until it graduates after box 5. A first-time correct answer is not scheduled. `dueItems` mixes due items from every lesson, lowest box first, so review is interleaved across modules automatically. |
| Coach spacing | `src/lib/learn/adaptive.ts` `COACH_INTERVALS = [0, 1, 2, 4, 7, 14]` | Coach concepts come back at widening gaps by level reached. |
| Lab re-checks | `src/lib/learn/engine.ts` `LAB_RECHECK_DAYS = [3, 10, 30]` | After a run, the experiment's check questions return at 3, 10 and 30 days. A good score (at least two-thirds right) moves the next re-check out a step; a weak score resets it to 3 days; after the last step it returns in 90 days. `labRechecksDue` lists due experiments, oldest first. XP for re-runs is capped at once a day so the Lab rewards doing, not farming. |
| Generation and elaboration | Write-it-out step (`writeTask` in each module) and Lab reflections (`recordLabReflection`) | Students produce the framework from memory on paper, and write a reflection after each experiment. |

### 6.2 Recommended next steps

1. **Interleave Lab with Notes on the Continue card.** When a linked module's re-test is due, offer the related Lab experiment's re-check alongside it (the experiments' `related` field already names the modules).
2. **Mixed module re-tests.** After two or more module tests are passed, add an occasional mixed quiz drawing from several modules (for example depression plus antidepressants plus suicide), so students practise telling topics apart.
3. **Bring checkpoint misses back.** Feed missed checkpoint MCQs into the Leitner deck, so a wrong checkpoint answer returns the next day instead of being lost.
4. **Confidence ratings.** Ask "How sure are you?" before showing the answer, to train calibration and flag confident errors. This links to row 39.
5. **Teach the method.** Add the Lab experiments on the testing effect (30) and interleaving (32) early in Module 1, so students understand why re-checks feel hard.
6. **Measure honestly.** Log re-test scores against first scores per module, and report the honest result (including no gain) on the educator dashboard before claiming any effect.
7. **Keep it humane.** Cap the number of re-checks shown per day and avoid streak pressure around sensitive modules (suicide, trauma).

---

## 7. Educator review checklist

Tick each item before switching the related content on for students.

**Debated evidence: present it as debated, not as fact**
- [ ] Müller-Lyer cultural explanation (row 7)
- [ ] Dual-process model (19), Dunning-Kruger (21)
- [ ] Decay versus interference (25), context-dependent memory size (34)
- [ ] Recovered memories (38)
- [ ] Little Albert data quality (45)
- [ ] Stages of change (57), Maslow (59), Yerkes-Dodson (62)
- [ ] Marshmallow test (63), ego depletion (64), facial feedback (67), two-factor theory (65), universality of expressions (66)
- [ ] Milgram critiques (70), Stanford Prison Experiment (71), groupthink (77), IAT (81), stereotype threat (82), Rosenhan (83), Pygmalion (85), Hofstede (88)
- [ ] Piaget's timing (93), theory of mind and autism (95), Kohlberg (100), growth mindset (106)
- [ ] Placebo size (121), antidepressant efficacy (122), hedonic adaptation (139), the Dodo bird verdict (148), Phineas Gage details (128)

**Clinically or personally sensitive: needs a content note or facilitation plan**
- [ ] High: recovered memories (38), social determinants including caste (92), antidepressant efficacy (122), suicide risk role-play (153) and debate motion 5, medication headline exercise 15
- [ ] Medium: obedience and deception (70, 71), animal research (51, 97), attachment and parenting (96, 98, 103), stigma (80, 83), identity-based measures (81, 82), personal disclosure in reflections (68, 98, 134), the family in Indian care (89), indigenous psychology (91), idioms of distress (90), pain and disability (13, 139), resilience (140)
- [ ] Confirm every reflection task has an opt-out and never requires personal disclosure
- [ ] Confirm helpline and support information is visible on any page linked to suicide, trauma or self-harm content

**Citations and content**
- [ ] Check every primary-study citation in section 3 against the original source
- [ ] Find sources for every row marked **citation needed**
- [ ] Confirm the Indian-context rows (89, 91, 92) with local experts and Indian research
- [ ] Confirm the Lab experiments' `review` items in `src/lib/lab/experiments.ts` (stop rule wording, word pool language, colour-vision options, cultural note, extinction-burst wording, vignette appropriateness)
- [ ] Confirm the final ids and scope of the five in-progress Lab activities, and update the "Implemented?" column
- [ ] Decide which proposed new modules to build, and in what order
- [ ] Check every K, FA or MS code in section 3 against the finished per-book maps in `docs/transformation/books/`
- [ ] Choose a general psychology textbook (and a research-methods text) to cover the GP rows, or assign reviewers to check those rows against the primary studies
- [ ] Make sure no law content relies on Ahuja (2010) where the Mental Healthcare Act 2017 has changed the position

---

## 8. Using the books, and adding more

The psychiatry set (bibliography at the top) has arrived. Separate reviewers are mapping each book in `docs/transformation/books/`. This file holds no page numbers; the per-book maps do.

1. **Do not commit the books.** Copyrighted PDFs stay out of the repository. Keep any local copies in a git-ignored folder.
2. **Link, do not copy.** When a per-book map is finished, check each section 3 row coded K, FA or MS against it. If the book does cover the topic, leave the code as it is; the chapter and page live in the per-book map. If it does not, change the code to **GP** or to the book that does cover it.
3. **Fill the Lab.** Copy the matching per-book references into the `bookRefs` array of each experiment in `src/lib/lab/experiments.ts`. For the current 7 experiments, most rows are **GP**: expect few psychiatry-book references, except the clinical links (digit span in bedside testing, diagnostic overshadowing, reinforcement in behaviour therapy).
4. **Close the GP gap.** Rows coded **GP** (cognition, perception, memory experiments, social, research methods and statistics, motivation and emotion, positive psychology, counselling micro-skills) need either a general psychology textbook (a standard introductory text plus a research-methods text) or checking against the primary study cited in the row. When such a book arrives, add it to the bibliography with a new code and a per-book map in `docs/transformation/books/`, then repeat steps 2 and 3.
5. **Check our claims against the books.** Where a book disagrees with a row's evidence status or description, flag it for educator decision; do not quietly overwrite it. Where a book supplies a citation for a "citation needed" row, verify it in the original study before adding it. Watch for date problems: Ahuja (2010) predates the Mental Healthcare Act 2017, and drug guidance should follow the newest source (Maudsley 2021).
6. **Add new rows.** For concepts in the per-book `-activities.json` files that are missing here, add rows to the right section using the same columns, and continue the numbering (155 onwards). Note which book suggested each one.
7. **Respect copyright.** Keep all explanations in our own words. Do not paste passages, figures, tables or test items from the books into `src/content` or the Lab. Short attributed references only. The `study.test.ts` rule that bans book names inside module notes still applies to the notes; book references live here, in the per-book maps and in `bookRefs`.
8. **Re-run the review.** Re-run the section 7 checklist for every changed row, and record the date and reviewer name in a short change log at the end of this file.
