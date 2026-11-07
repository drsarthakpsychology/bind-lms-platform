/* Module · research-methods, Part IV (exam zone: Q&A bank, long answers and module test). Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part IV · Exam zone

## 4.1 Q&A bank · Starting [core][starting]
Think each question through, ideally on paper, before you open the answer.

:::qa What is the difference between a concept, a construct and a variable? Operationalise "loneliness" in three different ways. [starting]
### Short answer
A **concept** is any abstract idea. A **construct** is a concept deliberately defined for scientific use and placed in a theory. A **variable** is a construct (or any characteristic) that is measured or manipulated so that it takes different values.

### The three ideas side by side
| Term | What it is | Example |
|---|---|---|
| Concept | An everyday abstract idea | Being alone, feeling cut off |
| Construct | A defined, theory-linked version | Loneliness: the distressing gap between the social relationships a person wants and those they have |
| Variable | Something that varies and is measured or manipulated | Score on a loneliness scale; minutes spent with others per day |

### Three operational definitions of loneliness
1. **Self-report:** the total score on a standardised loneliness questionnaire (for example a 20-item scale with established reliability), translated and back-translated for Gujarati speakers.
2. **Behavioural:** the number of face-to-face social contacts lasting at least 5 minutes in a week, logged in a diary or with experience sampling on a phone.
3. **Informant or physiological:** a hostel warden's rating of how often the student is seen alone at meals; or, in a lab, salivary cortisol after a social exclusion task (an indirect index).

### Why several definitions?
- Each measure captures only part of the construct and has its own biases (self-report is open to social desirability; diaries to forgetting).
- **Converging operations**: if different measures agree, confidence in the construct grows. If they disagree, the construct may have different facets (being alone is not the same as feeling lonely).
:::

:::qa How do you turn a broad topic into a researchable question? Walk through it with an example. [starting]
### Short answer
Narrow the topic to **specific variables in a specific population**, state the expected relation, and check that it is **feasible, interesting, novel, ethical and relevant** (the FINER test).

### Step by step
1. **Start with a topic:** "Mobile phones and students."
2. **Read and find a gap:** many studies link night-time phone use and poor sleep in Western teenagers; few look at Indian college students living in hostels, where lights-out rules differ.
3. **Pick the variables:** phone use after 11 p.m. (IV or predictor); sleep quality (DV); perhaps hostel versus home (moderator).
4. **Pick the population:** first-year undergraduates in Pune.
5. **Write the question:** "Is phone use after 11 p.m. associated with poorer sleep quality among first-year undergraduates in Pune, and is the link stronger in hostel residents than in day scholars?"
6. **Check it against FINER:**

| Test | Question to ask | Here |
|---|---|---|
| Feasible | Can I get participants, tools, time? | Yes: colleges, a sleep questionnaire, phone screen-time logs |
| Interesting | Does it matter to anyone? | Students, wardens, counsellors |
| Novel | Does it add something? | New population and a moderator |
| Ethical | Can it be done without harm? | Yes, with consent and privacy for screen-time data |
| Relevant | Will it change practice or theory? | Could inform hostel policy and sleep education |

7. **Turn it into hypotheses:** H1: More phone use after 11 p.m. predicts poorer sleep quality. H2: The relation is stronger in hostel residents.
:::

:::qa Why does statistics test the null hypothesis rather than the research hypothesis? [starting]
### Short answer
Because the null hypothesis is **exact** (no difference, or a difference of zero), so we can work out how likely our data would be if it were true. The research hypothesis is usually vague about size ("there is some difference"), so there is no single distribution to test it against.

### The logic, step by step
1. Assume H0 is true: for example, the mean recall of the 8-hour and 4-hour sleep groups is the same in the population.
2. Under that assumption, statistics tells us how often a difference as large as ours would arise **by chance** alone.
3. If that probability (p) is small (at or below the chosen α, usually .05), the data are hard to reconcile with H0, so we **reject** it, which **supports** H1.
4. If p is larger, we **fail to reject** H0. We do not "accept" it: the study may have been too small.

### A link to Popper
This mirrors falsification. We cannot prove a general claim true; we can show that the data are unlikely under the opposite claim. Hypothesis testing gives a formal way of trying to knock down the "nothing is happening" position.

### A caution for viva
Rejecting H0 does not tell you the **size** or **importance** of the effect, and it does not rule out a design flaw. That is why effect sizes, confidence intervals and validity checks are reported too.
:::

:::qa Compare basic, applied and action research. Can one study be more than one type? [starting]
### Comparison
| Feature | Basic | Applied | Action |
|---|---|---|---|
| Aim | Build general theory | Solve a practical problem | Improve one's own practice in one setting |
| Who does it | Academic researchers | Researchers, often with practitioners | Practitioners (teachers, counsellors, nurses) |
| Generalisation | Wide | Moderate | Local; little claim to generalise |
| Design | Often controlled experiments | Field studies, trials, evaluations | Repeated cycles: plan, act, observe, reflect |
| Example | How does sleep consolidate memory? | Does a sleep-hygiene app improve marks in Delhi colleges? | A hostel warden changes lights-out rules, watches attendance, adjusts |

### Can one study be more than one type?
Yes. The categories describe **purposes**, not watertight boxes.
- A trial of a memory app (applied) can also test a theory of spaced practice (basic).
- An action research cycle can produce findings that others later test in a controlled applied study.
- Psychology has a long tradition of "use-inspired basic research": work that advances theory **because** it was driven by a real problem (much of the work on learning, stress and attention began this way).
:::

:::qa How do you search the literature efficiently? Show a search strategy. [starting]
### Short answer
Break the question into **concepts**, list **synonyms** for each, combine them with **Boolean operators**, run the search in suitable databases, then screen by title, abstract and full text, keeping a record.

### Step by step for "night-time phone use and sleep in Indian students"
1. **Concepts:** phone use; sleep; students; India.
2. **Synonyms:**
   - phone use: smartphone, mobile phone, screen time, social media
   - sleep: sleep quality, insomnia, sleep duration
   - students: undergraduate, college, university
3. **Combine:**
   - **OR** within a concept (widens): smartphone OR "mobile phone" OR "screen time"
   - **AND** between concepts (narrows): (phone terms) AND (sleep terms) AND (student terms) AND India
   - **NOT** to exclude (use sparingly): NOT children
   - **Truncation** (sleep*) and **phrase marks** ("sleep quality")
4. **Databases:** PsycINFO and PubMed for journals, Google Scholar for breadth, Shodhganga for Indian theses.
5. **Screen:** titles, then abstracts, then full texts, against inclusion rules (age group, country, design, years).
6. **Record:** keep the search strings, dates and numbers at each stage (this is the basis of a PRISMA flow diagram in a systematic review).
7. **Snowball:** check the reference lists of key papers and see who later cited them.
8. **Organise:** a reference manager (Zotero, Mendeley) and a summary table: authors' sample, design, measures, findings, limitations.

### What the review should produce
Not a list of summaries, but a **synthesis**: what is agreed, what conflicts, why studies might disagree (samples, measures), and the **gap** your study fills.
:::

:::qa How do you write a problem statement that convinces a reviewer the study is worth doing? Give a model paragraph. [starting]
### What a problem statement must do
1. Name the **problem** (what is wrong or unknown).
2. Show its **size or impact** (who is affected, how much).
3. Say what is **already known** and what is **missing**.
4. State **why filling the gap matters** (for theory, practice or policy).
5. End with the **purpose** of this study.

### A model paragraph
"Exam-related distress is common among Indian undergraduates and is linked to poor sleep, dropout and, at worst, suicide. Studies of sleep and distress have mostly sampled Western students living at home, while Indian students increasingly live in hostels with different routines and pressures. It is not known whether night-time phone use relates to sleep quality and distress in the same way in hostel residents. Answering this would guide hostel wellbeing policies and sleep education. This study therefore examines the relation between phone use after 11 p.m., sleep quality and distress among first-year hostel residents in Pune."

### Common faults
| Fault | Example |
|---|---|
| Too broad | "Students face many problems" |
| No gap | Summarises studies but never says what is missing |
| Solution disguised as a problem | "There is a lack of yoga classes" (assumes the answer) |
| No population | "People use phones too much" |
:::

:::qa Explain inductive and deductive reasoning in research using the "wheel of science". [starting]
### Two directions of reasoning
| | Deductive | Inductive |
|---|---|---|
| Direction | Theory → hypothesis → observation | Observation → pattern → theory |
| Typical in | Experiments and hypothesis testing | Exploratory, qualitative and grounded theory work |
| Conclusion | Follows necessarily if premises are true | Probable, open to revision |
| Example | Attachment theory predicts insecure students will report more loneliness; test it | Interviews show students describe "not fitting in" during the first term; build a model of belonging |

### The wheel of science
Research moves in a circle:
1. **Theory** suggests hypotheses (deduction).
2. Hypotheses guide **observations**.
3. Observations reveal **empirical generalisations** (induction).
4. Generalisations confirm, revise or replace the **theory**.

### Why both matter
A field that only deduces never discovers new ideas; a field that only induces never tests them rigorously. Psychology's best programmes, such as the study of learned helplessness, moved round the wheel several times.
:::

:::qa What is the difference between a constitutive (conceptual) definition and an operational definition? Give both for "self-esteem". [starting]
### The two kinds
| Kind | What it does | Self-esteem |
|---|---|---|
| **Constitutive** | Defines a construct using other constructs; links it to theory | "A person's overall evaluation of their own worth" |
| **Operational** | Specifies the procedure used to measure or create it | "The total score on a 10-item self-esteem scale (range 10 to 40), completed in the person's first language" |

### Why you need both
- The constitutive definition tells readers **what you mean** and where the idea sits in theory.
- The operational definition tells them **exactly what you did**, so they can replicate it and judge validity.

### A check for validity
Ask whether the operation fits the concept. If self-esteem is defined as global self-worth, then a scale of academic self-confidence alone is a poor operational definition: it measures only one domain.
:::

:::qa Identify the independent and dependent variables in five study descriptions. [starting]
### The descriptions and answers
| Study | IV | DV |
|---|---|---|
| 1. Patients get either 6 or 12 sessions of CBT; depression is measured at the end | Number of sessions (6 or 12) | Depression score |
| 2. Students read a passage in silence, with music or with traffic noise, and answer questions | Noise condition | Comprehension score |
| 3. Researchers compare reaction times of people who slept 4, 6 or 8 hours | Hours of sleep | Reaction time |
| 4. Parents in Bihar and Kerala are compared on attitudes to girls' education | State (an attribute IV) | Attitude score |
| 5. A study tests whether job autonomy predicts burnout among nurses | Job autonomy (a predictor) | Burnout |

### A quick rule
Ask: "What is changed, chosen or used to predict?" (IV) and "What is measured as the outcome?" (DV).

### The trap
In studies 4 and 5 the IV is **not manipulated**: these are attribute or predictor variables. The studies can show differences or associations, not cause. Use "predictor" and "outcome" for correlational designs.
:::

:::qa How do you judge whether a source is trustworthy enough to use in your literature review? [starting]
### Five questions
| Question | What to check |
|---|---|
| Currency | When was it published? Is there newer work that changes the picture? |
| Relevance | Does it address your population, variables and question? |
| Authority | Who wrote it, with what expertise? Was it peer reviewed? |
| Accuracy | Are methods described? Are claims supported by data? Do other studies agree? |
| Purpose | Is it trying to inform, or to sell, persuade or campaign? |

### Red flags
- Claims of cures, or very large effects from tiny samples.
- No method section, or a method too vague to repeat.
- Publication in a venue that charges fees and promises acceptance in days.
- Only the authors' own earlier work is cited.
- Newspaper or social media summaries without the original study.

### What to do with weaker sources
Grey literature (government reports, NGO evaluations, theses) can be valuable, especially in India, where much applied work never reaches journals. Use it, but say what kind of source it is and weigh it accordingly.
:::

:::qa Distinguish aims, objectives, research questions and hypotheses, with one example of each for the same study. [starting]
### Example study: peer support and exam anxiety
| Element | What it is | Example |
|---|---|---|
| Aim | The broad purpose | To examine whether peer support helps first-year students manage exam anxiety |
| Objectives | Specific, measurable tasks | (1) To measure exam anxiety before and after an 8-week peer-support group. (2) To compare change with a waiting-list group. (3) To explore participants' experiences of the group |
| Research question | The question the study answers | Does participation in a peer-support group reduce exam anxiety compared with waiting? |
| Hypothesis | A testable prediction | Students in the peer-support group will show a greater reduction in anxiety scores than waiting-list students |

### How they fit together
Aim → objectives → questions → hypotheses run from broad to specific. Qualitative objectives (like objective 3) have research questions but usually no hypotheses.
:::

:::qa When would you choose a cross-sectional design rather than a longitudinal one? [starting]
### Comparison
| | Cross-sectional | Longitudinal |
|---|---|---|
| Measurement | Once | Repeatedly, same people |
| Time and cost | Low | High |
| What it shows | Prevalence, differences between groups, associations at one time | Change within people, temporal order, development |
| Main weaknesses | Cannot show direction; age and cohort mixed | Attrition, practice effects, slow, costly |

### Choose cross-sectional when
- You need **prevalence** (how many students have insomnia now).
- You are **exploring** associations to justify a larger study.
- Time and budget are short (a Master's dissertation).

### Choose longitudinal when
- The question is about **change** or **development** (how attention develops from 10 to 16).
- You need **temporal order** (does loneliness come before depression, or after?).
- You want to study **predictors of outcomes** (who relapses).

### A middle path
A **panel** study with two or three waves over a year, or a cross-sequential design, gives some longitudinal information at lower cost.
:::

:::qa Why does replication matter, and what is the difference between direct and conceptual replication? [starting]
### Why it matters
A single study can be a fluke (a Type I error), a product of one lab's procedures, or the result of flexible analysis. Repeating it tells us whether the finding is **real and robust**.

### Two kinds
| | Direct (close) replication | Conceptual replication |
|---|---|---|
| What changes | As little as possible: same procedure, new sample | The operations change; the hypothesis stays |
| What it tests | Is the original result reliable? | Does the idea generalise across methods? |
| Example | Repeat a memory experiment exactly in Bengaluru | Test the same theory with a different memory task and an online sample |

### Why both are needed
Conceptual replications alone can hide failures: if one fails, people blame the new method. Direct replications check the original finding itself. Together they build confidence that a result is both real and general.
:::

:::qa Compare quantitative and qualitative research at a first level: aims, data, samples and results. [starting]
### Side by side
| Feature | Quantitative | Qualitative |
|---|---|---|
| Typical question | How many? How much? Does X cause Y? | What is it like? What does it mean? How does it happen? |
| Data | Numbers from scales, tests, counts | Words, images, observations |
| Sample | Larger; often aiming to represent a population | Smaller; chosen for rich information |
| Tools | Questionnaires, experiments, standardised tests | Interviews, focus groups, observation, documents |
| Analysis | Statistics | Coding and interpretation |
| Result | Estimates, tests of hypotheses | Themes, models, rich descriptions |
| Researcher | Kept at a distance | Part of the process; reflects on own influence |

### The same topic, two ways
- **Quantitative:** a survey of 800 students finds that 32% report high exam anxiety, and anxiety correlates with poor sleep.
- **Qualitative:** interviews with 15 students show how family expectations and comparison on social media turn exams into tests of self-worth.

The two answer different questions. Many good studies combine them.
:::

## 4.2 Q&A bank · Beginner [core][beginner]

:::qa Explain the difference between random sampling and random assignment using a two-by-two table of possible studies. [beginner]
### Short answer
**Random sampling** decides **who is in the study** and supports **external validity** (generalisation). **Random assignment** decides **who gets which condition** and supports **internal validity** (causal inference).

### The four combinations
| | Random assignment: yes | Random assignment: no |
|---|---|---|
| **Random sampling: yes** | Ideal and rare: a randomised trial in a random sample of all Delhi colleges. Causal **and** generalisable | A national survey comparing smokers and non-smokers. Generalisable description, but no causal claim |
| **Random sampling: no** | Most lab experiments with volunteer students. Causal within the sample, generalisation uncertain | Comparing two convenient classes. Neither causal nor generalisable without strong arguments |

### Why students mix them up
Both use chance. But they answer different questions. A study can be perfectly randomised in assignment while using a narrow, self-selected sample, which is exactly the "WEIRD sample" problem.
:::

:::qa A one-group pretest-posttest study shows that a mindfulness course reduced exam anxiety. List the threats to internal validity and show how adding a randomised control group deals with each. [beginner]
### The design and its weakness
O X O: measure anxiety, run the course, measure again. Any change could come from things other than the course.

### Threat by threat
| Threat | How it could explain the drop | Does a randomised control group (R O X O / R O O) fix it? |
|---|---|---|
| History | Exams were postponed during the course | Yes: the control group experiences the same event |
| Maturation | Students settle into college over the term | Yes: both groups mature equally |
| Testing | Filling the anxiety scale twice lowers scores | Yes: both groups are tested twice |
| Instrumentation | A different, softer scale was used at post-test | Yes, if the same instrument is used for both groups (and it should be) |
| Statistical regression | Only very anxious students joined | Yes: both groups regress equally, since they come from the same pool |
| Selection |, (only one group) | Randomisation makes groups equal on average |
| Attrition | The most anxious dropped out | Partly: compare drop-out rates and use intention-to-treat analysis |
| Expectancy and demand | Students expect to feel better | Only with an **active, credible control** (for example a study-skills class of equal length) and blind outcome assessment |

### The key lesson
A control group removes threats that affect both groups equally. It does not remove threats that differ between groups (differential attrition, expectancy, diffusion), which need further safeguards.
:::

:::qa How many orders are needed to counterbalance four conditions, and what are the options? [beginner]
### Complete counterbalancing
With k conditions, the number of possible orders is k! (k factorial).
1. For k = 3: 3 × 2 × 1 = 6 orders.
2. For k = 4: 4 × 3 × 2 × 1 = **24 orders**, so you need participants in multiples of 24.
3. For k = 5: 120 orders: impractical.

### Partial counterbalancing
- **Latin square:** k orders in which each condition appears **once in each position**. For four conditions A, B, C, D:

| Order | 1st | 2nd | 3rd | 4th |
|---|---|---|---|---|
| 1 | A | B | D | C |
| 2 | B | C | A | D |
| 3 | C | D | B | A |
| 4 | D | A | C | B |

This **balanced** Latin square also makes each condition **precede every other condition exactly once**, which controls simple carry-over from one condition to the next.
- **Randomised orders:** each person gets a random order; works with large samples.
- **ABBA (reverse) counterbalancing:** for two conditions within each person; it balances **linear** practice effects only.

### When counterbalancing fails
If carry-over is **asymmetric** (a drug in session 1 changes the response to placebo in session 2 more than the other way round), counterbalancing cannot fix it. Use a between-subjects design or long wash-out periods.
:::

:::qa Design a single-case study to test whether a token system reduces classroom tantrums in a 7-year-old. How will you analyse it? [beginner]
### Step by step
1. **Define the behaviour operationally:** a tantrum is crying, shouting or throwing objects lasting at least 10 seconds; count each episode.
2. **Measure reliably:** the teacher records tantrums per school day; a second observer codes a sample of days to check **inter-observer agreement** (aim for kappa of about .80).
3. **Baseline (A):** record daily for at least 5 school days, until the data are **stable** (no clear trend down).
4. **Choose the design:** tantrums can safely return briefly, so an **ABAB** design is acceptable; if the school objects to withdrawal, use a **multiple baseline across settings** (classroom, then lunch, then the school bus).
5. **Intervention (B):** tokens for each tantrum-free period, exchanged for a chosen reward.
6. **Withdrawal (A) and reinstatement (B).**

### Visual analysis
| Feature | What to look for |
|---|---|
| Level | Average tantrums per day drops in B phases |
| Trend | No downward trend already present in baseline |
| Variability | Data become steadier in B |
| Immediacy | Change soon after each phase change |
| Overlap | Few B-phase points as high as any A-phase point |
| Consistency | The same pattern in both AB pairs |

### What makes the conclusion convincing
Behaviour changes **each time** the phase changes, and only then. Two replications of the effect within one child is the core logic of single-case designs.
:::

:::qa A college has 2,000 students. How many do you need for a survey estimating a percentage within plus or minus 5 points? Show the working, including the finite population correction. [beginner]
### Step 1: the infinite-population formula
n0 = z² × p × (1 − p) ÷ e²
- z = 1.96 for 95% confidence
- p = 0.5 (the most cautious guess, which gives the largest n)
- e = 0.05 (plus or minus 5 points)

n0 = 3.8416 × 0.25 ÷ 0.0025 = 0.9604 ÷ 0.0025 = **384**

### Step 2: the finite population correction
When the population is small, you need fewer people:
n = n0 ÷ [1 + (n0 − 1) ÷ N] = 384 ÷ [1 + 383 ÷ 2,000] = 384 ÷ 1.1915 = **about 322**

### Step 3: allow for non-response
If you expect a 70% response rate: 322 ÷ 0.70 = **about 460 invitations**.

### Step 4: check the sampling method
These formulas assume **simple random sampling**. If you sample whole classes (cluster sampling), multiply by the **design effect** (see the Advanced bank). And no formula rescues a biased frame.
:::

:::qa Explain the difference between reliability and validity using the target analogy, and list what you check before choosing a scale for your study. [beginner]
### The target analogy
| Pattern of shots | Reliability | Validity |
|---|---|---|
| Tight cluster on the bullseye | High | High |
| Tight cluster off-centre | High | Low (consistently wrong) |
| Scattered around the bullseye | Low | Low (on average near, but no single shot trustworthy) |
| Scattered everywhere | Low | Low |

Reliability limits validity: a scale cannot be accurate if it is not consistent.

### Before choosing a scale, check
1. **Construct fit:** does its definition match yours?
2. **Reliability:** internal consistency (α about .70 or more for research), test-retest if the trait is stable.
3. **Validity evidence:** content, criterion (does it predict what it should?), construct (convergent and discriminant correlations, factor structure).
4. **Norms and population:** was it developed or validated with people like yours (age, language, culture)?
5. **Language:** is there a validated translation (Hindi, Tamil, Marathi), or will you need to adapt it?
6. **Practicality:** length, scoring, cost, licence.
7. **Response format:** suitable literacy level and response scale.
:::

:::qa Compare matching and random assignment as ways of making groups equivalent. When is matching useful? [beginner]
### Comparison
| | Random assignment | Matching |
|---|---|---|
| How | Chance decides each person's group | Pair people on a variable, then split pairs across groups |
| Controls | All variables, known and unknown, on average | Only the matched variables |
| Needs | Enough people | A pretest or known characteristic; enough people to find pairs |
| Risk | Chance imbalance in small samples | Unmatched variables may still differ; regression if matched on extreme scores |

### When matching helps
- **Small samples:** randomising 20 people may leave groups unequal on a key variable by chance.
- **A strong nuisance variable:** matching on baseline severity reduces error variance and raises power.
- **Best of both:** **matched randomisation** (or a randomised block design): form pairs or blocks, then randomly assign within each.

### The danger in quasi-experiments
Matching non-randomised groups (patients versus healthy controls) on a few variables does **not** make them equivalent on everything else. And matching people from two groups with different means on a pretest leads to regression artefacts.
:::

:::qa A 2 × 3 between-subjects factorial study needs 20 participants per cell. How many people in total? How would the number change in a fully within-subjects version? [beginner]
### Between-subjects
Cells = 2 × 3 = 6. Total = 6 × 20 = **120 people**, each in one condition.

### Fully within-subjects
Each person experiences all 6 conditions, so far fewer are needed, often **20 to 30 people** for similar power, because each person serves as their own control.

### Mixed design
If the first factor (2 levels) is between and the second (3 levels) is within: 2 groups × 20 = **40 people**, each doing all 3 levels.

### Choosing
| Consider | Favours between | Favours within |
|---|---|---|
| Carry-over or learning between conditions | Yes | |
| Limited participants | | Yes |
| Fatigue in long sessions | Yes | |
| Need for high power | | Yes |
| Condition reveals the hypothesis | Yes | |
:::

:::qa List practical ways to reduce demand characteristics and experimenter effects in a lab experiment. [beginner]
### Demand characteristics (from participants)
1. **Cover stories** that give a plausible, less revealing purpose (with debriefing).
2. **Between-subjects designs** so participants see only one condition.
3. **Unobtrusive measures** (behaviour, reaction times) instead of obvious questions.
4. **Post-experiment inquiry**: ask what participants thought the study was about, and check whether guessers behaved differently.
5. **Anonymity**, reducing the wish to please or look good.

### Experimenter effects (from researchers)
1. **Blind the experimenter** to the hypothesis or the condition.
2. **Standardise**: scripts, recorded instructions, computer-delivered tasks.
3. **Use several experimenters** and check that results do not differ by experimenter.
4. **Automate scoring**, or use blind raters with clear criteria.
5. **Double-blind** procedures in drug and therapy trials.

### Why it matters
Both threaten **construct validity**: the effect might come from expectations rather than the variable you meant to study.
:::

:::qa How do you design an interview schedule for a semi-structured interview? [beginner]
### Step by step
1. **Start from the research questions**: list the topics each one needs.
2. **Write open questions** for each topic: "Tell me about…", "How did you…", "What was that like?"
3. **Order them**: easy and descriptive first, sensitive later, a closing question ("Is there anything I have not asked that matters to you?").
4. **Add probes and prompts** under each question: "Can you give an example?", "What happened next?", "How did you feel then?"
5. **Avoid** leading questions, double-barrelled questions, jargon and "why" questions that sound accusing.
6. **Translate and back-translate** if interviewing in another language; check local idioms (for example "tension", "ghabrahat").
7. **Pilot** with two or three people; revise.
8. **Plan the setting**: privacy, family members present or not, recording consent, a distress protocol.

### A small example
Main question: "Can you tell me about the time you first felt you needed help for your mood?"
- Probe: "What made you think it was more than ordinary stress?"
- Probe: "Who did you talk to first?"
:::

:::qa Two observers code a child as on-task or off-task in 50 intervals. Both say on-task 30; A on and B off 5; A off and B on 5; both off 10. Compute percentage agreement and kappa. [beginner]
### Step 1: observed agreement
po = (30 + 10) ÷ 50 = **.80** (80%)

### Step 2: expected (chance) agreement
- A says on-task 35 times, B 35 times.
- A says off-task 15 times, B 15 times.
- pe = (35 × 35 + 15 × 15) ÷ 50² = (1,225 + 225) ÷ 2,500 = **.58**

### Step 3: kappa
κ = (po − pe) ÷ (1 − pe) = (.80 − .58) ÷ (1 − .58) = .22 ÷ .42 = **.52**

### Step 4: interpret
Agreement of 80% sounds high, but because both observers code "on-task" most of the time, much of it would happen by chance. Kappa of .52 is only **moderate**. Retrain observers with clearer definitions and recheck before collecting the main data.
:::

:::qa How does ex post facto research differ from an experiment? Use an example and list its main limitations. [beginner]
### Example
A researcher compares adults who lost a parent before age 10 with those who did not, on adult depression.

### How it differs
| | Experiment | Ex post facto |
|---|---|---|
| IV | Manipulated by the researcher | Already happened; selected |
| Assignment | Random | Self-selected by life |
| Causal claim | Strong | Weak |
| When used | When manipulation is possible and ethical | When it is not: loss, trauma, disease, disaster |

### Limitations
1. **Self-selection**: the groups may differ in many other ways (poverty, family conflict, genetics).
2. **Reverse causation** is sometimes possible.
3. **No control over the IV's timing or strength.**
4. **Retrospective recall** may be biased by current mood.

### Strengthening it
Match or statistically control key confounders, use prospective records instead of recall where possible, test several alternative explanations, and look for dose-response patterns (earlier loss, stronger effect).
:::

:::qa How do you read an interrupted time series? Use the example of a helpline launch and monthly emergency visits for self-harm. [beginner]
### The design
Many monthly observations before the launch (O O O O O O) and many after (O O O O O O).

### What to look for
| Change | Meaning |
|---|---|
| **Level** | A sudden drop right after the launch |
| **Slope** | The trend changes: rising before, flat or falling after |
| Delay | The change appears some months later (plausible if awareness grows slowly) |
| Seasonality | Regular yearly patterns that must not be mistaken for an effect |

### Threats and fixes
- **History**: another event at the same time (a new hospital, a policy, a pandemic). Fix: add a **comparison series** from a district without the helpline.
- **Instrumentation**: a change in how visits were recorded. Fix: check record-keeping.
- **Regression**: if the launch followed an unusual spike. Fix: use many pre-launch points.

### Analysis
Segmented regression estimates the change in level and slope; methods for autocorrelation (neighbouring months resemble each other) are needed.
:::

:::qa How should a scale developed in English be adapted for Marathi-speaking participants? [beginner]
### Step by step
1. **Permission** from the scale's developers.
2. **Forward translation** by two independent bilingual translators, at least one familiar with psychology.
3. **Reconciliation**: compare and agree a single version.
4. **Back-translation** into English by translators who have not seen the original; compare meanings, not words.
5. **Expert committee review**: conceptual, item and semantic equivalence. Replace idioms that do not work ("feeling blue").
6. **Cognitive interviews**: ask 10 to 15 target participants what each item means to them in their own words.
7. **Pilot** and revise.
8. **Psychometric testing**: reliability, factor structure (CFA), and **measurement invariance** if comparing with English speakers.
9. **Local norms** if scores will be interpreted against cut-offs.

### Kinds of equivalence
| Kind | Question |
|---|---|
| Conceptual | Does the construct exist and mean the same here? |
| Item | Is each item relevant and acceptable? |
| Semantic | Do the words carry the same meaning? |
| Operational | Is the format (self-report, Likert) suitable? |
| Measurement | Does the scale behave the same psychometrically? |
:::

:::qa A researcher wants to study how attention control develops between ages 10 and 16 and whether smartphone use affects it. Choose a developmental design and justify it. [beginner]
### Options considered
| Design | Fit |
|---|---|
| Cross-sectional (test 10-, 12-, 14- and 16-year-olds once) | Fast, but confounds age with cohort; today's 16-year-olds got phones later than today's 10-year-olds |
| Longitudinal (follow 10-year-olds for six years) | Shows individual change, but slow, costly, high attrition, and phones change over six years |
| **Cross-sequential** (start with cohorts aged 10, 12 and 14; follow each for two years) | Covers 10 to 16 in two years; separates age from cohort; measures within-person change |

### The choice
A **cross-sequential design** with three cohorts, tested yearly for two years, measuring attention (computerised tasks) and smartphone use (objective screen-time data, not just self-report).

### Analysis and cautions
- Growth-curve (multilevel) models of attention over age.
- Smartphone use is not manipulated, so effects are associations; test whether earlier use predicts later attention controlling for earlier attention (cross-lagged analysis).
- Plan for attrition and practice effects (alternate test forms).
:::

## 4.3 Q&A bank · Advanced [core][advanced]

:::qa Compare grounded theory, interpretative phenomenological analysis and reflexive thematic analysis. How would you choose among them? [advanced]
### Comparison
| Feature | Grounded theory | IPA | Reflexive thematic analysis |
|---|---|---|---|
| Aim | Build an explanatory theory of a process | Understand how particular people make sense of a lived experience | Identify and interpret patterns of meaning across a data set |
| Philosophy | Varies: post-positivist (classic) to constructivist | Phenomenology plus hermeneutics; idiographic | Theoretically flexible; must be stated |
| Sampling | Purposive, then **theoretical** sampling | Small, purposive, **homogeneous** | Purposive; size by information power |
| Data collection and analysis | Alternate, with **constant comparison** | Usually after interviews; case by case | After collection; across the whole set |
| Coding | Open, axial (or focused), selective; memos | Detailed notes on each case, then experiential statements, then cross-case themes | Codes, then generated themes, reviewed and named |
| End product | A core category and a model | Rich account of shared and unique experience with close reading of extracts | A set of themes answering the question |
| Typical question | How do young men in Delhi decide whether to seek help for depression? | What is it like for mothers to receive their child's autism diagnosis? | How do Indian college students talk about exam pressure? |

### How to choose
1. Is the question about a **process** you want to explain? Grounded theory.
2. Is it about the **meaning of one significant experience** for a small, similar group? IPA.
3. Is it about **patterns across many accounts**, perhaps for practice or policy? Reflexive thematic analysis.
4. Then check fit with your resources: grounded theory needs iterative access to participants; IPA needs very detailed interview data; thematic analysis is the most flexible.
:::

:::qa How is rigour established in qualitative research? Give concrete strategies at each stage of a study. [advanced]
### Short answer
Through **trustworthiness** (credibility, transferability, dependability, confirmability) built in at every stage, plus **reflexivity** and transparent reporting.

### Stage by stage
| Stage | Strategy | What it protects |
|---|---|---|
| Design | State the paradigm and approach; justify sample size (information power) | Coherence |
| Sampling | Purposive with clear criteria; seek **negative or deviant cases** | Credibility; avoids cherry-picking |
| Data collection | Prolonged engagement; pilot the interview guide; interview in the participant's language; field notes | Credibility |
| Analysis | Double-coding a portion and discussing differences (not to get a reliability number, but to sharpen interpretation); memos; an **audit trail** of coding decisions | Dependability, confirmability |
| Interpretation | **Triangulation** (data, investigator, theory, method); **member reflections**; peer debriefing | Credibility |
| Reporting | **Thick description**; extracts linked to claims; a reflexivity statement; reporting checklists | Transferability, transparency |

### Reflexivity in practice
Keep a reflexive journal: how did your gender, caste, class, profession and language shape what participants said and what you noticed? A male psychologist interviewing women about domestic violence in a Rajasthan village will hear different things from a local woman researcher; that should be considered and reported, not hidden.
:::

:::qa Design a mixed-methods evaluation of a new college peer-support programme for students' mental health. [advanced]
### Purpose and design
Judge whether the programme is delivered well, whether it helps, and why. Use a **convergent** design within a larger **quasi-experimental** evaluation, plus a short exploratory phase at the start.

### Step by step
1. **Needs assessment (qualitative first):** focus groups with students and counsellors to understand needs and acceptable language (for example how students describe "stress" and "tension").
2. **Logic model:** inputs (trained peers, a room, supervision) → activities (weekly groups, one-to-one listening) → outputs (sessions held, students reached) → outcomes (distress, help-seeking) → impact (fewer crises, better retention).
3. **Process evaluation:** attendance logs, fidelity checklists, supervision notes.
4. **Outcome evaluation (quantitative):** distress and well-being scales at start, end of term and three months later, in the programme college and a comparable college (non-equivalent control group). Analyse with a mixed ANOVA or ANCOVA on baseline scores.
5. **Qualitative strand:** semi-structured interviews with a purposive sample of users, non-users and peer supporters; reflexive thematic analysis.
6. **Integration:** a joint display table setting each quantitative result beside the qualitative themes that explain or challenge it.
7. **Ethics:** consent, confidentiality limits, a risk protocol for disclosures of self-harm, and supervision for peer supporters.

### What the integration might show
| Quantitative finding | Qualitative explanation |
|---|---|
| Distress fell more in the programme college | Students valued being heard by someone their own age |
| No change in help-seeking from counsellors | Peers worried that referring a friend would break trust |
| High drop-out among first-generation students | Group sessions were held at times when they travelled home |
:::

:::qa A researcher wants to use deception in a study of conformity among Indian students. Under what conditions is it acceptable, and what safeguards are needed? [advanced]
### Conditions for acceptable deception
1. The study has **significant scientific, educational or applied value**.
2. **No effective non-deceptive alternative** exists (for example, telling participants it is a conformity study would change their behaviour).
3. The deception does **not** concern anything that would make people unwilling to take part: physical pain, severe emotional distress, or risk to their safety or reputation.
4. Deception is **explained as early as feasible**, at the latest at the end of data collection.
5. Participants may **withdraw their data** after learning the truth.

### Safeguards
| Safeguard | In practice |
|---|---|
| Ethics committee approval | Full review, not expedited, because deception is involved |
| Consent | Consent to a broadly true description ("a study of group judgement"), with no false statements about risks |
| Confederates and scripts | Standardised so that no one is ridiculed |
| Debriefing | Process debriefing in person: explain the purpose, why deception was needed, normalise conforming, check for distress |
| Data withdrawal | Offer withdrawal after debriefing |
| Vulnerable students | Do not recruit the researcher's own students; avoid credit-for-participation pressure |
| Cultural context | Group harmony and respect for seniors may make conformity feel more personal; debriefing should be sensitive to loss of face |

### Viva extension
Distinguish **deception** (active misinformation) from **incomplete disclosure** (withholding the hypothesis). The latter is common and usually acceptable; the former needs justification.
:::

:::qa Why do cluster randomised trials need larger samples? Work out the design effect for a school-based trial. [advanced]
### Why
People in the same cluster (school, clinic, village) resemble each other. Their outcomes are correlated, measured by the **intraclass correlation coefficient (ICC)**. So 20 students from one school give less independent information than 20 students from 20 schools.

### The design effect
DE = 1 + (m − 1) × ICC, where m is the average cluster size.

### Worked example
1. A two-arm trial of a school anti-bullying programme needs **128 students** under individual randomisation (64 per arm, for d = 0.5, power .80, α .05).
2. Each school contributes **m = 20** students; the ICC for the outcome is **0.05**.
3. DE = 1 + (20 − 1) × 0.05 = 1 + 0.95 = **1.95**.
4. Required sample = 128 × 1.95 = **about 250 students**, that is about **13 schools** (round up to 14 so that each arm has 7).
5. Analysis must account for clustering (multilevel models or cluster-level analysis); otherwise standard errors are too small and p values too optimistic.

### Why use clusters at all?
When the intervention works at group level (a teacher training, a school policy), or to avoid **contamination** between students in the same class.
:::

:::qa What should a preregistration contain, and what does it not protect against? [advanced]
### Contents of a good preregistration
| Element | Example |
|---|---|
| Hypotheses | H1: Peer support lowers distress at term end compared with usual care |
| Design | Randomised, two arms, one between-subjects factor, pre and post |
| Sample size and rule | 128 participants, from a power analysis; stop at 128 |
| Measures | Exact scales, scoring, timing |
| Exclusions | Failed attention checks; fewer than two sessions attended (reported both ways) |
| Primary and secondary outcomes | Distress primary; help-seeking secondary |
| Analysis plan | ANCOVA with baseline as covariate; α .05 two-tailed; handling of missing data |
| Exploratory analyses | Labelled as exploratory |

### What it protects against
p-hacking, HARKing, optional stopping, outcome switching and selective reporting, because readers can compare the plan with the paper.

### What it does not protect against
- Poor measures, confounded designs or invalid theory: a preregistered bad study is still bad.
- Fraud.
- Publication bias, unless the journal accepts results-blind (as in registered reports).
- Honest deviations, which are fine **if reported** with reasons.
:::

:::qa Is psychology a science? Discuss with reference to positivism and interpretivism. [advanced]
### The positivist answer: yes, if it follows scientific method
- Psychology studies observable behaviour and measurable processes.
- It uses hypotheses, controlled experiments, statistics and replication.
- Theories make falsifiable predictions (operant conditioning, signal detection, memory models).

### The interpretivist challenge
- Human action is **meaningful**: the same act (a raised hand) means different things in different contexts.
- People reflect on and change in response to theories about them (a "looping effect" that atoms do not show).
- Understanding (**Verstehen**) requires interpretation, not just measurement.

### Critical and post-positivist positions
- Post-positivism accepts that observation is theory-laden and knowledge provisional, but keeps the goal of testing ideas against evidence.
- Critical approaches add that research questions and categories reflect power: for example, who decides what counts as "normal".

### A balanced conclusion
| Area | How scientific in the strict sense |
|---|---|
| Psychophysics, perception, learning, neuroscience | Highly: precise measurement and laws |
| Social, personality, clinical | Partly: probabilistic, context-sensitive, replication problems |
| Meaning, identity, culture | Needs interpretive methods alongside measurement |

Psychology is best seen as a **plural science**: committed to evidence, using different methods for different kinds of question.
:::

:::qa How do you conduct and analyse a focus group? When should you not use one? [advanced]
### Running it
1. **Composition**: 6 to 10 people who share a relevant characteristic (all women caregivers; all first-year students). Mixed status groups silence junior members.
2. **Number of groups**: usually 3 to 6 per segment, until new groups add little.
3. **Moderator**: introduces, keeps time, encourages quiet members, manages dominant ones, probes. An **assistant** takes notes on who speaks and on non-verbal reactions.
4. **Topic guide**: 5 to 8 open questions, from general to specific.
5. **Ground rules**: confidentiality within the group, respect, no right or wrong answers.

### Analysing it
- Transcribe with speaker labels.
- Use thematic analysis, but also analyse **interaction**: where people agreed, disagreed, changed their minds, or joked. The group process is data.
- Report how many groups and which participants supported a theme; avoid treating the group as one voice.

### When not to use one
| Situation | Why not |
|---|---|
| Highly sensitive personal topics (sexual abuse, suicide attempts) | Disclosure is unsafe and confidentiality cannot be guaranteed |
| Need for individual life histories | Groups give shared views, not individual depth |
| Strong hierarchy among participants (staff and their managers) | Conformity and fear distort what is said |
| Very small, scattered populations | Hard to assemble |
:::

:::qa How do you justify sample size in a qualitative study? Contrast saturation with information power. [advanced]
### Saturation
- Originally **theoretical saturation** in grounded theory: data collection continues until new data add no new properties to the categories.
- Often misused as "we stopped when we heard nothing new", without saying how that was judged.

### Information power
The more relevant information each participant gives, the fewer participants are needed. Five dimensions:
| Dimension | Fewer participants needed when… |
|---|---|
| Aim | The aim is narrow |
| Sample specificity | Participants have very specific relevant experience |
| Established theory | The study uses an existing theory |
| Quality of dialogue | Interviews are rich and in depth |
| Analysis strategy | Analysis is case-focused rather than cross-case |

### Rough ranges by approach
| Approach | Typical size |
|---|---|
| IPA | 3 to 10 |
| Phenomenology | 5 to 25 |
| Thematic analysis (interviews) | 10 to 30 |
| Grounded theory | 20 to 30 or more, until theoretical saturation |
| Focus groups | 3 to 6 groups per segment |

### How to write it up
State the approach, the intended range and why, how you will decide to stop, and afterwards report how that decision was actually made.
:::

:::qa A student says, "My family thinks I'm lazy, but they don't understand stress." Compare how thematic analysis and discourse analysis would treat this sentence. [advanced]
### Thematic analysis
- Treats the sentence mainly as a **report of experience**.
- Codes might be: "family misunderstanding", "stress invalidated", "labelled as lazy".
- These join others into a theme such as **"Feeling misunderstood at home"**.
- Question asked: **what** is the participant's experience?

### Discourse analysis
- Treats the sentence as **action**: what is the speaker **doing** with these words?
- Notices the contrast "lazy" versus "stress": the speaker **rejects a moral label** (laziness, a fault of character) and replaces it with a **medical or psychological one** (stress, something that happens to you).
- Notices "they don't understand": positioning the family as lacking knowledge, the speaker as having it.
- Question asked: **how** does talk construct identities and responsibility, and what wider discourses (psychological language spreading among young Indians) does it draw on?

### Why it matters
| | Thematic analysis | Discourse analysis |
|---|---|---|
| View of language | A window onto experience | A tool that builds reality |
| Unit of analysis | Patterns across participants | Fine detail of talk and text |
| Product | Themes | Accounts of discursive strategies |
:::

:::qa What makes a randomised controlled trial rigorous? Explain allocation concealment, blinding, randomisation methods and intention-to-treat. [advanced]
### The key elements
| Element | What it means | What it prevents |
|---|---|---|
| **Random sequence** | Computer-generated, not alternation or birth dates | Selection by predictable patterns |
| **Block randomisation** | Randomise in blocks (for example of 4) so groups stay equal in size | Unequal groups if the trial stops early |
| **Stratified randomisation** | Randomise separately within strata (severity, site) | Imbalance on key prognostic factors |
| **Allocation concealment** | The person enrolling a participant cannot know the next assignment (central telephone or web system, sealed opaque envelopes) | Recruiters steering sicker patients to one arm |
| **Blinding** | Participants, therapists, outcome assessors and analysts kept unaware where possible | Expectancy and assessment bias |
| **Intention-to-treat** | Analyse everyone as randomised | Bias from differential drop-out |
| **Pre-registration** | Outcomes and analysis fixed in advance | Outcome switching |

### Concealment versus blinding
Concealment protects the **assignment process** before allocation and is always possible. Blinding protects **after** allocation; in psychotherapy trials participants and therapists cannot be blinded, so blind outcome assessment becomes essential.

### The flow diagram
A CONSORT diagram shows numbers assessed, excluded, randomised, allocated, lost to follow-up and analysed in each arm, so readers can see attrition at a glance.
:::

:::qa Describe the steps of a systematic review and meta-analysis. What are fixed-effect and random-effects models, and what does I² tell you? [advanced]
### Steps
1. **Question** in a structured form (population, intervention, comparison, outcome).
2. **Protocol** registered in advance.
3. **Search** several databases plus grey literature, with documented strings.
4. **Screen** titles, abstracts and full texts, by two reviewers independently.
5. **Extract data** and **assess risk of bias** in each study.
6. **Synthesise**: meta-analysis if studies are similar enough; narrative synthesis if not.
7. **Assess certainty** of the evidence and **publication bias** (funnel plot).
8. **Report** with a flow diagram.

### Two models
| | Fixed-effect | Random-effects |
|---|---|---|
| Assumption | One true effect; studies differ only by chance | True effects vary between studies (different populations, doses) |
| Weighting | Heavily toward large studies | More even |
| Confidence interval | Narrower | Wider, more honest when studies differ |
| Use when | Studies are near-identical | Usually, in psychology |

### Heterogeneity and I²
I² is the percentage of variation across studies due to **real differences** rather than chance. Rough guide: 25% low, 50% moderate, 75% high. High I² means a single pooled number may mislead; explore why with subgroup analysis or meta-regression.
:::

:::qa What special procedures are needed for research with children, psychiatric inpatients and tribal communities in India? [advanced]
### Children
- **Parental consent plus the child's assent**, appropriate to age.
- Child-friendly information (pictures, simple words).
- Protection from coercion through teachers; a clear route to stop.
- Mandatory reporting duties (for example under child-protection law) must be explained.

### Psychiatric inpatients
- **Capacity** to consent assessed for this decision, at this time.
- Under the Mental Healthcare Act, 2017, research needs **free and informed consent**; for those who cannot consent, permission from the State Mental Health Authority and the nominated representative, and only if the research cannot be done with people able to consent.
- Separate the researcher from the treating team where possible, so care is not seen to depend on participation.
- Extra attention to confidentiality and distress.

### Tribal and marginalised communities
- **Community engagement** first: village elders, gram sabhas or community organisations, alongside individual consent.
- Consent in the local language, read aloud where literacy is low, with an impartial witness.
- **Benefit sharing** and feedback of results in a usable form.
- Avoid extractive research and stigmatising labels; involve community members as co-researchers where possible.

### Common to all
Ethics committee approval, minimal risk, a distress protocol, and the right to withdraw without loss of services.
:::

:::qa Under the UGC 2018 plagiarism regulations, classify three theses with 8%, 34% and 52% similarity, and state what happens to each. [advanced]
### Classification
| Thesis | Similarity | Level | Consequence for a student |
|---|---|---|---|
| A | 8% | Level 0 (up to 10%) | Minor similarity; no penalty |
| B | 34% | Level 1 (above 10% to 40%) | Submit a revised script within six months |
| C | 52% | Level 2 (above 40% to 60%) | Debarred from submitting a revised script for one year |

Above 60% (Level 3): the registration for the programme is cancelled.

### What is excluded from similarity
Quoted work with credit, references and bibliography, common knowledge, generic terms and standard symbols, and properly acknowledged material.

### Zero tolerance in the core work
The abstract, summary, hypotheses, observations, results, conclusions and recommendations must be the researcher's own.

### Beyond the software
A low percentage does not prove originality: paraphrased or translated copying can escape detection. Supervisors and committees must still judge whether ideas are properly credited.
:::

:::qa How do you write a strong discussion section without overclaiming? Give a short model. [advanced]
### Structure
1. **Restate the main finding** in plain words (not statistics).
2. **Relate it to the literature**: where it agrees, where it differs, and possible reasons.
3. **Interpret mechanisms** carefully: offer explanations, labelled as such.
4. **Limitations** honestly: design, sample, measures, analysis.
5. **Implications** for practice, policy and theory, proportionate to the evidence.
6. **Future research** that would address the limitations.
7. A short **conclusion**.

### Overclaiming to avoid
| Overclaim | Better |
|---|---|
| "Proves that yoga cures anxiety" | "Supports a modest reduction in anxiety after eight weeks" |
| "Instagram causes body dissatisfaction" | "Instagram use was associated with body dissatisfaction" |
| "Applies to all Indian youth" | "In urban college students in Pune" |
| "No effect of gender" | "No significant difference was detected; the study had limited power for small effects" |

### A model paragraph
"Students in the peer-support group reported a larger fall in exam anxiety than those on the waiting list, a moderate effect. This fits earlier work on social support as a buffer against stress, though most of that work used Western samples. Because outcome measures were self-reported and participants knew their group, expectancy may have contributed. A trial with an active control and blind assessment is needed before colleges adopt the programme widely."
:::

:::qa Explain the trade-off between internal and external validity, and name designs that try to get both. [advanced]
### The trade-off
| | Lab experiment | Field survey |
|---|---|---|
| Control | High | Low |
| Internal validity | High | Low |
| Realism | Low | High |
| External validity | Often limited | Often higher |

Tight control removes confounds but creates artificial settings and selected samples; realism brings back confounds.

### Designs that bridge the gap
1. **Field experiments**: random assignment in real settings (schools, workplaces, apps).
2. **Pragmatic trials**: test an intervention under everyday conditions, with broad eligibility and usual-care comparison.
3. **Cluster randomised trials** in real organisations.
4. **Natural experiments and regression discontinuity**: real-world assignment that is "as good as random".
5. **Multi-site replications**: the same controlled study in many places and populations.
6. **Experience sampling**: repeated measurement in daily life, sometimes with micro-randomisation of prompts.

### The principle
No single study maximises everything. Knowledge grows from **programmes** of research: lab studies identify mechanisms; field studies test whether they matter in real life.
:::

## 4.4 Long answers, short notes and viva [core]

### Long answer skeletons (15 to 20 marks)
**1. What is an experimental design? Describe the true experimental designs and the threats to internal validity they control.**
- Define an experiment: manipulation, control, random assignment; Kerlinger's MAXMINCON.
- Campbell and Stanley notation (R, O, X), with pre-experimental designs as the contrast.
- Posttest-only control group; pretest-posttest control group; Solomon four-group, each with its diagram, strengths and limits.
- Factorial designs: main effects and interactions, with a 2 × 2 example.
- Table of the eight threats and which design controls each; note that randomisation controls selection and its interactions, the control group controls history, maturation, testing, instrumentation and regression; Solomon additionally controls testing × treatment.
- Conclude with the internal-external validity trade-off.

**2. Discuss probability and non-probability sampling with examples. What decides sample size?**
- Population, frame, unit, parameter versus statistic; sampling error versus bias.
- Four or five probability methods with procedure, example, strengths and limits; four or five non-probability methods likewise.
- When non-probability sampling is the right choice (qualitative work, hidden populations, pilots).
- Determinants of sample size: effect size, power, alpha, variability, design and cluster effects, attrition; a worked survey example (n of about 385).
- Indian example: NMHS multistage stratified cluster design.

**3. Compare quantitative and qualitative research. Describe any two qualitative approaches in detail.**
- Paradigms: positivism, post-positivism, constructivism, critical theory, pragmatism (ontology and epistemology).
- Contrast table: aims, sampling, data, analysis, role of the researcher, quality criteria.
- Two approaches in depth: for example, grounded theory (coding stages, constant comparison, theoretical sampling, saturation) and IPA (idiographic, double hermeneutic, homogeneous samples).
- Trustworthiness (Lincoln and Guba), triangulation (Denzin), reflexivity.
- Mixed methods as integration.

**4. Discuss ethical issues in psychological research with reference to Indian guidelines.**
- History: Nuremberg, Helsinki, Tuskegee, Milgram, Zimbardo.
- Belmont principles; APA Standard 8 (consent, deception, debriefing, credit).
- India: ICMR 2017, ethics committees, CTRI, MHCA 2017 Section 99, DPDP Act 2023.
- Special issues: vulnerable groups, language and literacy, family presence, community consent, online research.
- Integrity: FFP, UGC 2018 plagiarism levels, questionable practices, open science.

**5. What are single-subject designs? Describe their types and how data are analysed.**
- Rationale (idiographic, clinical accountability, rare problems); repeated measurement; baseline logic.
- AB, ABA, ABAB, multiple baseline (three kinds), changing criterion, alternating treatments, each with a sketch.
- Visual analysis: level, trend, variability, immediacy, overlap.
- Strengths and limits; ethical problems of withdrawal.

### Short notes (5 marks each): outline points
- **Operational definition:** Bridgman; measured versus experimental; replicability; converging operations.
- **Hypothesis:** definition; characteristics; null versus alternative; directional versus non-directional; you never prove it.
- **Moderator and mediator:** Baron and Kenny; "when or for whom" versus "how"; one example each.
- **Solomon four-group design:** four groups diagram; controls pretest sensitisation; cost.
- **Hawthorne effect:** origin; reactivity; controls (habituation, placebo-attention controls).
- **Ex post facto research:** Kerlinger's definition; examples; self-selection; cannot prove cause.
- **Interrupted time-series design:** many observations before and after; level and slope; history threat; comparison series.
- **Cross-sequential design:** Schaie; separates age, cohort and time.
- **Thematic analysis:** Braun and Clarke's six phases; semantic versus latent; reflexive approach.
- **Triangulation:** Denzin's four types.
- **Informed consent:** elements; assent; literacy and language in India.
- **APA style referencing:** in-text rules; journal and book formats; digital object identifiers.
- **Replication crisis:** OSC 2015; causes; open-science remedies.

:::viva
What is the difference between random sampling and random assignment? :: Random sampling decides who enters the study and protects external validity. Random assignment decides who gets which condition and protects internal validity.
Can a correlational study ever suggest cause? :: It can make a causal explanation more or less plausible (temporal order in longitudinal data, ruling out measured confounders, dose-response), but without manipulation and random assignment it cannot establish cause.
Why is statistical regression a problem in clinical studies? :: Patients usually seek help when at their worst, so they tend to improve on retest anyway. Without a control group, this natural drift looks like a treatment effect.
How would you decide your sample size for an M.Phil or M.A. dissertation? :: By an a priori power analysis using the expected effect size from past studies, alpha .05 and power .80, adjusted for drop-out; for qualitative work, by information power and the approach (for example, 3 to 10 for IPA).
What is reflexivity, and why does it matter in India? :: The researcher's ongoing examination of how their own position shapes the research. Caste, class, gender, language and urban-rural differences strongly shape access, trust and what people say.
Is a meta-analysis always the best evidence? :: Only if the included studies are good and the search is complete. Combining biased or small studies, or missing unpublished ones, gives a precise but wrong answer (garbage in, garbage out).
:::

## 4.5 Module test [core]
Twenty-eight questions across the module. Aim for 22 or more.

:::mcq
Q: The scientific method differs from other ways of knowing mainly because it:
- *Has built-in ways of finding and fixing its own errors
- Relies on the most qualified experts
- Builds on common sense and tradition
- Reaches final conclusions that never need to be changed later
> Public, replicable testing makes self-correction possible.

Q: Which is NOT one of Kerlinger's criteria for a good research problem?
- It expresses a relation between variables
- *It has already been answered in the literature
- It is stated clearly as a question
- It implies the possibility of empirical testing
> A problem should fill a gap, not repeat answered work.

Q: Researchers find that stress raises blood pressure mainly by increasing cortisol. Cortisol is a:
- Moderator
- *Mediator
- Confounding variable
- Constant
> It is the mechanism in the middle.

Q: "There will be no significant difference in recall between the music and silence groups" is a:
- Directional hypothesis
- *Null hypothesis
- Research hypothesis
- Descriptive hypothesis
> It states no difference.

Q: A list of patients sorted by hospital ward, with every 10th patient chosen, produces a sample made up only of patients in bed 10 of each ward. This problem is:
- Snowballing
- Quota bias
- Coverage error in the hospital's patient list
- *Periodicity in systematic sampling
> A repeating pattern in the list matches the sampling interval.

Q: In disproportionate stratified sampling, small strata are oversampled so that:
- The sample becomes a non-probability sample
- Weighting of the results is never needed afterwards
- Sampling error rises
- *Subgroups have enough people to compare
> Then weights restore population shares for overall estimates.

Q: A sample is chosen to include exactly 40 men and 60 women, with interviewers picking whoever is available. This is:
- Stratified random sampling
- Cluster sampling
- Systematic sampling
- *Quota sampling
> Categories are filled by convenience.

Q: Kerlinger's principle for designing experiments is:
- PICO
- CIPP model
- *MAXMINCON
- IMRaD
> Maximise systematic, minimise error, control extraneous variance.

Q: Which design controls for the interaction of pretesting with the treatment?
- *Solomon four-group
- Pretest-posttest control group
- Static-group comparison
- Posttest-only control group
> Pretested and unpretested treatment groups are compared.

Q: A 2 × 2 graph shows two lines that cross. This indicates:
- No main effects
- A ceiling effect on the outcome measure
- Perfect reliability
- *A disordinal (crossover) interaction
> The effect of one IV reverses across levels of the other.

Q: In a within-subjects study, performance improves on later conditions simply because of practice. The fix is:
- Random sampling
- A larger sample
- A one-tailed test in the predicted direction
- *Counterbalancing the order of conditions
> Counterbalancing spreads order effects across conditions.

Q: A memory study runs from January to June, and the participants (all aged 3) improve on every task. A likely explanation without any treatment is:
- History
- Instrumentation
- *Maturation
- Attrition
> Natural development over months in young children.

Q: In Rosenthal and Jacobson's classroom study, children labelled as likely to "bloom" gained more. This illustrates:
- The Hawthorne effect
- The John Henry effect
- *The expectancy (Pygmalion) effect
- Demand characteristics of participants
> Teachers' expectations shaped outcomes.

Q: WEIRD samples mainly threaten:
- Internal validity
- *External (population) validity
- Statistical conclusion validity
- Inter-rater reliability
> Findings may not generalise beyond such samples.

Q: Students below a cut-off on an entrance score get a bridge course; outcomes are compared just above and below the cut-off. This is a:
- Solomon design
- Case-control design
- *Regression discontinuity design
- Changing-criterion design with a cut-off
> Assignment by cut-off score.

Q: The main advantage of the multiple-baseline design over ABAB is that it:
- Needs no baseline
- Uses random assignment of people to phases
- *Does not require withdrawing the treatment
- Uses large groups
> Staggered start replaces withdrawal.

Q: The problem of cross-sectional studies of ageing that Schaie's work exposed is:
- Attrition
- *Confounding of age with cohort
- Practice effects from repeated testing
- Observer drift
> Different cohorts had different education and experiences.

Q: "Have you stopped skipping classes?" is a poor survey question because it:
- Is open-ended
- Uses a Likert format with too few points
- Is too short to be understood clearly
- *Assumes something that may not be true
> Either answer admits skipping classes.

Q: A researcher spends 18 months living in a fishing community in Odisha to understand its beliefs about illness. The approach is:
- *Ethnography
- Grounded theory
- Discourse analysis
- Narrative analysis
> Long immersion and participant observation.

Q: In IPA, samples are usually:
- Large and random
- *Small, purposive and fairly homogeneous
- Stratified random samples by age and gender
- Made of experts only
> To allow detailed, idiographic analysis.

Q: Grounded theory data collection stops at:
- *Theoretical saturation
- 30 participants
- The end of the budget
- Statistical significance
> When categories are fully developed and new data add nothing.

Q: "Thick description" in qualitative research mainly supports:
- Dependability
- *Transferability
- Credibility only
- Statistical power
> Readers can judge whether findings fit their setting.

Q: A trial gives questionnaires, then interviews a few participants to understand puzzling results. The design is:
- Convergent
- *Explanatory sequential
- Exploratory sequential
- Ethnographic
> Quantitative first, qualitative to explain.

Q: The Belmont Report followed public outrage over:
- The Milgram experiments
- The Stanford prison study in the 1970s
- The Hawthorne studies
- *The Tuskegee syphilis study
> Tuskegee led directly to the National Commission and Belmont.

Q: Under the UGC 2018 plagiarism regulations, similarity of 35% in a thesis falls in:
- Level 0
- *Level 1
- Level 2
- Level 3
> Above 10% and up to 40% is level 1.

Q: In APA 7, the first surname plus the Latin short form for 'and others' is used from the first citation when a work has:
- *Three or more authors
- Two authors
- Six or more authors (as in earlier editions)
- Only one author
> APA 7 simplified the earlier rule.

Q: Bem's 2011 precognition studies are important to research methods mainly because they:
- *Showed that standard methods could produce false positives
- Proved that precognition exists in most people
- Were the first large experiments on memory in social psychology
- Showed that qualitative methods are more valid
> Failed replications highlighted flexible analyses and publication bias.

Q: A preregistered study is one where:
- *Hypotheses, sample size and analysis are fixed publicly in advance
- Participants register online before they can take part
- The ethics committee registers the researcher's name and institution
- Raw results are posted online before any analysis is done
> It limits researcher degrees of freedom and HARKing.
:::
`;
