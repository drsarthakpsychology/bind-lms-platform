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
- Reaches conclusions that never need changing
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
- Coverage error
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
- CIPP
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
- A ceiling effect
- Perfect reliability
- *A disordinal (crossover) interaction
> The effect of one IV reverses across levels of the other.

Q: In a within-subjects study, performance improves on later conditions simply because of practice. The fix is:
- Random sampling
- A larger sample
- A one-tailed test
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
- Changing-criterion design
> Assignment by cut-off score.

Q: The main advantage of the multiple-baseline design over ABAB is that it:
- Needs no baseline
- Uses random assignment
- *Does not require withdrawing the treatment
- Uses large groups
> Staggered start replaces withdrawal.

Q: The problem of cross-sectional studies of ageing that Schaie's work exposed is:
- Attrition
- *Confounding of age with cohort
- Practice effects
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
- Stratified by age
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
- The Stanford prison study
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
- Six or more authors
- Only one author
> APA 7 simplified the earlier rule.

Q: Bem's 2011 precognition studies are important to research methods mainly because they:
- *Showed that standard methods could produce false positives
- Proved that precognition exists in most people
- Were the first experiments on memory in psychology
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
