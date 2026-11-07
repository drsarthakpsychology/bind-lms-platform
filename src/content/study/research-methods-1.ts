/* Module · Research methods, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: what research is and how it begins

## 1.1 Why research, and ways of knowing [core][starting]
Every day you hear claims about the mind. "Mobile phones are ruining children's attention." "Meditation cures anxiety." "Toppers sleep less." Some of these are true, some are half-true and some are false. **Research is the disciplined way of finding out which is which.** It is how psychology earns the right to call itself a science.

### Four ways people fix their beliefs
In 1877 the philosopher Charles Sanders Peirce described four ways people settle what they believe. Kerlinger made this list famous in psychology.

| Method | How the belief is held | Example |
|---|---|---|
| **Tenacity** | "It has always been true, so it is true." Held by habit, even against evidence | "Left-handed children must be corrected." |
| **Authority** | Accepted because an expert, elder, text or institution says so | "The principal says toppers sleep five hours." |
| **A priori (intuition)** | Accepted because it "stands to reason" or feels self-evident | "Of course rewards always increase motivation." |
| **Science** | Tested against observations that anyone can repeat, and open to correction | A controlled study of sleep and marks |

Authority is not bad: you trust a good textbook. The point is that science is the only method that has a **built-in way of discovering its own mistakes**.

:::widget layers
{"title": "How sure can you be? Four ways of knowing", "shape": "stack", "layers": [{"label": "Science", "detail": "Tested against observations anyone can repeat; built-in error correction"}, {"label": "A priori (intuition)", "detail": "Feels self-evident; never tested"}, {"label": "Authority", "detail": "Accepted because of who says it"}, {"label": "Tenacity", "detail": "Held by habit, even against evidence"}], "caption": "From top to bottom: the further down, the less protection against error."}
:::

### What makes a method scientific
- **Empirical:** answers come from observation, not argument alone.
- **Systematic and controlled:** observations are planned so that other explanations can be ruled out.
- **Public and replicable:** methods are described well enough for someone else to repeat the study.
- **Falsifiable:** Karl Popper's test. A scientific claim must say what result would prove it wrong. "Everyone has an unconscious wish that explains every act" cannot be proved wrong by any result, so it is not a scientific claim in Popper's sense.
- **Self-correcting and provisional:** findings are the best current answer, not final truth.

:::widget sort
{"prompt": "How is each belief being held? Place each card.", "buckets": ["Tenacity or authority", "A priori (it just seems obvious)", "Science"], "items": [{"text": "My grandmother always said exams go better after curd and sugar", "bucket": 0, "why": "Tradition and an elder's word: tenacity and authority."}, {"text": "A topper on YouTube says he studies 16 hours a day, so that is the way", "bucket": 0}, {"text": "Obviously, people who smile more must be happier", "bucket": 1, "why": "It feels self-evident, but it was never tested."}, {"text": "Students were randomly given either a sleep routine or usual habits, and marks were compared", "bucket": 2}, {"text": "It stands to reason that punishment always stops bad behaviour", "bucket": 1, "why": "Plausible, but research shows punishment often fails or backfires."}, {"text": "A finding was repeated by three labs in different countries", "bucket": 2, "why": "Replication is the heart of science."}]}
:::

### Kinds of research
- **Basic (fundamental) research** builds theory: how does working memory hold information?
- **Applied research** solves a practical problem: does a memory-training app help children with ADHD in Delhi schools?
- **Action research** (first described by Kurt Lewin in the 1940s) is done by practitioners on their own setting, in cycles of plan, act, observe and reflect. A teacher who changes her feedback style, watches the effect and adjusts is doing action research.
- By purpose: **exploratory** (map a new area), **descriptive** (how common, what kind), **explanatory** (why; cause and effect) and **predictive**.
- By data: **quantitative** (numbers, measurement, statistics), **qualitative** (words, meanings, experience) and **mixed methods** (both, deliberately combined).
- By time: **cross-sectional** (one point in time) and **longitudinal** (the same people followed over time).

:::widget compare
{"title": "Quantitative or qualitative?", "a": {"label": "Quantitative", "points": ["Numbers, measurement and statistics", "Tests hypotheses decided in advance", "Large samples, often random", "Asks how much, how many, does X cause Y", "Aims to generalise"], "summary": "Example: does a sleep programme lower anxiety scores in 300 students?"}, "b": {"label": "Qualitative", "points": ["Words, meanings and experience", "Ideas emerge from the data", "Small samples, chosen on purpose", "Asks what is it like, how do people make sense of it", "Aims for depth"], "summary": "Example: how do 12 students describe living with exam anxiety? Mixed methods combine both on purpose."}}
:::

:::clinician
Kerlinger defined scientific research as "systematic, controlled, empirical, amoral, public and critical investigation of natural phenomena, guided by theory and hypotheses about the presumed relations among such phenomena." Two words in that definition are often missed in exams. **Amoral** means that knowledge itself is neither good nor bad; the ethics lie in how it is obtained and used. **Critical** means that the scientist's own procedures are open to scrutiny. Kerlinger also stressed that the aim of science is **theory**: general explanations, not a pile of facts.
:::

### The research process, step by step
1. Identify a broad area and a specific **problem**.
2. **Review the literature**: what is known, what is contested, where the gap is.
3. State the **research question** and the **hypotheses**.
4. Define the **variables** operationally.
5. Choose the **design**, the **sample** and the **tools**.
6. Get **ethics approval**, then collect the data.
7. **Analyse** the data.
8. **Interpret** the results against the hypotheses and the literature.
9. **Report** (article, thesis), and let others check and repeat it.

:::widget flow
{"title": "The research process", "layout": "chain", "nodes": [{"id": "n0", "label": "Problem", "detail": "Find a specific, researchable question"}, {"id": "n1", "label": "Literature", "detail": "What is known, contested, missing"}, {"id": "n2", "label": "Hypotheses", "detail": "Testable predictions from theory"}, {"id": "n3", "label": "Variables", "detail": "Operational definitions"}, {"id": "n4", "label": "Design, sample, tools", "detail": "Choose how to test fairly"}, {"id": "n5", "label": "Ethics approval", "detail": "Before any data"}, {"id": "n6", "label": "Collect data", "detail": "Follow the plan"}, {"id": "n7", "label": "Analyse", "detail": "The planned tests"}, {"id": "n8", "label": "Interpret", "detail": "Against hypotheses and literature"}, {"id": "n9", "label": "Report", "detail": "So others can check and repeat"}], "caption": "Press Play to walk through it. Each step depends on the one before."}
:::

:::widget flow
{"title": "Action research cycle", "layout": "cycle", "nodes": [{"id": "n0", "label": "Plan", "detail": "Spot a problem in your own practice and plan a change"}, {"id": "n1", "label": "Act", "detail": "Try the change"}, {"id": "n2", "label": "Observe", "detail": "Collect evidence of what happens"}, {"id": "n3", "label": "Reflect", "detail": "Judge what worked and why"}, {"id": "n4", "label": "Revise", "detail": "Adjust the plan and go again"}], "caption": "Kurt Lewin's spiral: practitioners improve their own setting in repeated loops."}
:::

The process is a cycle, not a line: good studies end with new questions.

:::recall
1. Name Peirce's four methods of fixing belief. || Tenacity, authority, a priori (intuition) and science.
2. What is Popper's falsifiability criterion? || A claim is scientific only if some possible observation could show it to be false.
3. How does action research differ from applied research? || Action research is done by practitioners on their own setting, in repeated plan-act-observe-reflect cycles, to improve that practice.
4. Give the four purposes research can serve. || Exploratory, descriptive, explanatory and predictive.
:::

:::mcq
Q: A counsellor says, "Every client's behaviour reflects hidden guilt; if they deny guilt, that is more proof of it." By Popper's criterion, this claim is:
- Scientific, because it explains every single case it meets
- Scientific, because a trained counsellor observed it in many clients
- *Not scientific, because no observation could show it to be wrong
- Not scientific, because emotions cannot ever be measured
> A claim that every possible result confirms is unfalsifiable. Explaining everything means predicting nothing.

Q: A school psychologist in Kochi tries a new homework routine with her own class, reviews the results each month and changes the routine. This is best called:
- Basic research
- Ex post facto research
- A longitudinal cohort study
- *Action research
> Practitioner, own setting, repeated cycles of plan, act, observe, reflect.
:::

## 1.2 The research problem and variables [core][starting]
A good study starts with a good problem. "Social media and youth" is a **topic**. "Is daily Instagram use linked to body dissatisfaction among college women in Ahmedabad?" is a **problem** you can study.

### What makes a good research problem
Kerlinger's criteria: the problem should **express a relation between two or more variables**, be stated **clearly as a question**, and **imply the possibility of empirical testing**. Add practical tests:
- **Feasible:** time, money, access to participants and tools.
- **Significant:** it fills a gap or helps people.
- **Ethical:** it can be studied without harm.
- **Novel enough:** not already answered well; a replication in a new population counts.

### Concepts, constructs and variables
- A **concept** is an abstract idea (anxiety, intelligence, stigma).
- A **construct** is a concept deliberately built for science, defined so it can be measured and linked to theory. "Self-efficacy" is Bandura's construct.
- A **variable** is anything that can take different values across people or conditions: age, marks, anxiety score, type of therapy. A **constant** does not vary within the study.

### The kinds of variable you must know
| Variable | Role | Example (study: does yoga reduce exam anxiety?) |
|---|---|---|
| **Independent (IV)** | What the researcher manipulates or selects to see its effect; the presumed cause | Yoga programme vs no programme |
| **Dependent (DV)** | What is measured; the presumed effect | Exam anxiety score |
| **Extraneous** | Any other variable that could affect the DV | Sleep, caffeine, exam difficulty |
| **Confounding** | An extraneous variable that **varies along with the IV**, so you cannot tell which one caused the change | The yoga group also had a kinder teacher |
| **Moderator** | Changes the **strength or direction** of the IV-DV relation | Yoga helps women more than men |
| **Mediator (intervening)** | The **process through which** the IV affects the DV | Yoga improves sleep, and better sleep lowers anxiety |

Other distinctions:
- **Active** variables can be manipulated (dose, teaching method). **Attribute** (organismic, subject) variables cannot be: age, sex, caste, diagnosis, personality. A study that "compares men and women" has an attribute IV and **cannot by itself prove cause**.
- **Continuous** variables can take any value in a range (reaction time). **Discrete** (categorical) variables take separate values (number of siblings, religion). A **dichotomous** variable has two values.

:::mnemonic Moderator or mediator?
**Moderator = "for whom or when"**: it answers *for whom* or *under what conditions* the effect is stronger. **Mediator = "how or why"**: it is the mechanism in the middle of the chain. Reuben Baron and David Kenny made this distinction standard in the 1980s.
:::

:::widget sort
{"prompt": "Study: 'Does a mindfulness app reduce rumination in depressed outpatients, and does it work better for those who use it at night?' Place each variable.", "buckets": ["Independent variable", "Dependent variable", "Moderator or mediator", "Extraneous or confounding"], "items": [{"text": "Getting the app vs getting usual care", "bucket": 0}, {"text": "Score on a rumination scale after 8 sessions", "bucket": 1}, {"text": "Whether the app is used at night or in the day", "bucket": 2, "why": "It changes the strength of the effect: a moderator."}, {"text": "Improved attention control, through which the app lowers rumination", "bucket": 2, "why": "The 'how' in the middle: a mediator."}, {"text": "Some patients also started an antidepressant during the study", "bucket": 3, "why": "If more of them were in the app group, it confounds the result."}, {"text": "Severity of depression at the start", "bucket": 3, "why": "An extraneous variable to control, for example by randomisation or as a covariate."}]}
:::

:::widget flow
{"title": "Mediation: the 'how' in the middle", "layout": "chain", "nodes": [{"id": "n0", "label": "Yoga programme (IV)", "detail": "What the researcher gives"}, {"id": "n1", "label": "Better sleep (mediator)", "detail": "The mechanism"}, {"id": "n2", "label": "Lower anxiety (DV)", "detail": "The outcome"}], "edgeLabels": {"n0>n1": "improves", "n1>n2": "reduces"}, "caption": "A moderator would instead change the strength of these arrows, for example a stronger effect in women."}
:::

### Operational definitions
An **operational definition** defines a variable by the **operations used to measure or produce it**. It turns a fuzzy idea into something another researcher can repeat exactly.
- **Measured** operational definition: "Exam anxiety = total score on the Westside Test Anxiety Scale."
- **Experimental (manipulated)** operational definition: "Sleep deprivation = being kept awake in the lab from 10 p.m. to 6 a.m., checked by a research assistant every 30 minutes."

:::widget worked
{"title": "Operationalising 'exam stress'", "steps": [{"q": "Start with the construct. What do you mean by exam stress?", "a": "Worry, tension and body arousal felt by students in the days before an exam."}, {"q": "Choose how to measure it. Give a self-report definition.", "a": "Exam stress is the total score on a standard test anxiety scale, given three days before the board exam."}, {"q": "Add a physical measure so you are not relying on one method.", "a": "Resting heart rate, taken with the same digital monitor, sitting, at 9 a.m., on the same day."}, {"q": "If you wanted to manipulate stress instead, how could you define it?", "a": "High stress condition: told the quiz counts for 20 percent of the final mark and that results will be read aloud. Low stress: told it is a practice quiz with no marks."}], "yourTurn": [{"q": "Write a measured operational definition of 'loneliness in older adults'.", "a": "For example: the total score on a standard loneliness scale, given in the person's first language by a trained interviewer at home. Any answer must name the tool, how and when it is given, and by whom."}]}
:::

The physicist Percy Bridgman's **operationism**, from the 1920s, argued that a concept *is* its measuring operations. Psychologists now treat that as too narrow: one construct can and should be measured several ways (converging operations), and no single measure captures it fully.

:::widget decide
{"scene": "Ritika wants to study 'stress among nurses in Mumbai hospitals'. Her guide asks for an operational definition of stress.", "ask": "Which definition is best?", "choices": [{"label": "'Stress is the feeling of pressure that nurses face.'", "verdict": "harm", "outcome": "Her guide sends it back: two researchers could measure this in two different ways.", "why": "It is a conceptual definition, not an operational one. Nothing says how stress will be measured."}, {"label": "'Stress = total score on the Perceived Stress Scale (10-item version) completed at the end of a shift, plus the number of sick days in the last three months from hospital records.'", "verdict": "best", "outcome": "Her guide approves. Another team could repeat it exactly.", "why": "It names the instrument, the version, when it is given and a second converging measure."}, {"label": "'Stress = how stressed a nurse says she is.'", "verdict": "ok", "outcome": "Better, but her guide asks: asked how, on what scale, when?", "why": "It hints at self-report but does not specify the operation, so it cannot be replicated."}]}
:::

:::recall
1. What are Kerlinger's three criteria for a good research problem? || It states a relation between two or more variables, is put clearly as a question, and implies the possibility of empirical testing.
2. What is the difference between a confounding and an extraneous variable? || Any outside variable that could affect the DV is extraneous; it becomes confounding when it varies systematically with the IV, so its effect cannot be separated from the IV's.
3. Moderator versus mediator in one line each. || Moderator: changes when or for whom the effect holds. Mediator: the process through which the IV produces the effect.
4. Why can a study with only attribute variables not prove cause? || The researcher did not manipulate or randomly assign the variable, so groups may differ in many other ways.
:::

:::mcq
Q: In a study of the effect of noise level (quiet, moderate, loud) on typing errors, "typing errors" is the:
- Independent variable
- *Dependent variable
- Moderator variable
- Confounding variable
> It is what is measured to see the effect of the manipulated noise.

Q: A researcher finds that social support reduces depression mainly by increasing a person's sense of control. "Sense of control" is a:
- Moderator
- Confounding variable
- Attribute variable
- *Mediator
> It is the mechanism through which support affects depression.

Q: In a study comparing coping in people with and without diabetes, "diabetes status" is:
- An active independent variable that the researcher manipulates
- A dependent variable
- An operational definition
- *An attribute (organismic) variable
> It cannot be manipulated or randomly assigned; it is a characteristic people already have.
:::

## 1.3 Hypotheses [core][starting]
A **hypothesis** is a tentative, testable statement about the relation between two or more variables. Kerlinger: "a conjectural statement of the relation between two or more variables." It is your best guess, made **before** looking at the data.

### What a good hypothesis has
- It states a **relation between variables**.
- It is **testable** (and so falsifiable).
- It is **clear and specific**: who, which variables, which direction.
- It follows from **theory or past findings**, not from a hunch alone.
- It is **simple** (parsimony) and limited in scope.

:::widget flow
{"title": "Kinds of hypothesis", "layout": "tree", "nodes": [{"id": "h", "label": "Hypothesis", "detail": "A testable statement about a relation"}, {"id": "r", "label": "Research (in words)", "detail": "The researcher's prediction", "parent": "h"}, {"id": "s", "label": "Statistical (in symbols)", "detail": "About population values", "parent": "h"}, {"id": "n", "label": "Null (H0)", "detail": "No difference or relation", "parent": "s"}, {"id": "a", "label": "Alternative (H1)", "detail": "The logical opposite of H0", "parent": "s"}, {"id": "d", "label": "Directional (one-tailed)", "detail": "Says which way", "parent": "a"}, {"id": "nd", "label": "Non-directional (two-tailed)", "detail": "Says only that there is a difference", "parent": "a"}]}
:::

### Kinds of hypothesis
| Kind | Meaning | Example |
|---|---|---|
| **Research (substantive)** | The researcher's prediction in words | Students who sleep 8 hours will recall more words than students who sleep 4 hours |
| **Null (H0)** | No difference or no relation in the population; the hypothesis that statistics directly tests | Mean recall is the same for both sleep groups |
| **Alternative (H1)** | The logical opposite of the null | Mean recall differs between the sleep groups |
| **Directional (one-tailed)** | Predicts which way the difference goes | The 8-hour group will recall **more** |
| **Non-directional (two-tailed)** | Predicts a difference without saying which way | The groups will **differ** in recall |
| **Statistical** | The hypothesis written in symbols about population values | H0: μ1 = μ2; H1: μ1 > μ2 |

Other labels you may meet:
- **Descriptive** hypotheses describe a single variable ("Most first-year students sleep under 7 hours").
- **Relational** hypotheses predict an association; **causal** hypotheses predict cause and effect.
- **Inductive** hypotheses come from observations (bottom-up); **deductive** hypotheses come from a theory (top-down).
- **Working** hypotheses are provisional guides in early exploration.

:::widget sort
{"prompt": "A study compares memory in students who sleep 8 hours with those who sleep 4. What kind of hypothesis is each statement?", "buckets": ["Null", "Directional", "Non-directional"], "items": [{"text": "There is no difference in mean recall between the two sleep groups.", "bucket": 0, "why": "No difference: the null, which statistics directly tests."}, {"text": "The 8-hour group will recall more words than the 4-hour group.", "bucket": 1, "why": "It says which way: one-tailed."}, {"text": "The two groups will differ in recall.", "bucket": 2, "why": "A difference, direction not stated: two-tailed."}, {"text": "Sleep length is unrelated to the number of words recalled.", "bucket": 0, "why": "No relation: a null."}, {"text": "Less sleep will lower recall.", "bucket": 1, "why": "Direction stated."}]}
:::

:::trap You never "prove" a hypothesis
Statistics lets you **reject** or **fail to reject** the null. Failing to reject the null does not prove it true; the study may simply lack power. Rejecting the null **supports** the research hypothesis; it does not prove it, because a design flaw could still explain the result.
:::

:::widget decide
{"scene": "Three students in a research methods class in Lucknow write hypotheses for a study of WhatsApp use and sleep.", "ask": "Whose hypothesis is the best one?", "choices": [{"label": "Asif: 'WhatsApp affects young people in many ways.'", "verdict": "harm", "outcome": "It cannot be tested: no variables, no direction, no measure.", "why": "A vague topic statement is not a hypothesis."}, {"label": "Bhavna: 'College students who use WhatsApp for more than one hour after 10 p.m. will report lower sleep quality on the Pittsburgh Sleep Quality Index than those who use it less.'", "verdict": "best", "outcome": "Testable, directional, specific about population, variables and measure.", "why": "It names the population, the IV, the DV and its measure, and the direction."}, {"label": "Chetan: 'There may or may not be a relation between WhatsApp and sleep.'", "verdict": "harm", "outcome": "Any result fits it, so nothing can falsify it.", "why": "A statement that allows every outcome makes no prediction."}]}
:::

:::recall
1. Define a hypothesis in Kerlinger's words. || A conjectural statement of the relation between two or more variables.
2. What does the null hypothesis state? || That there is no difference or relation in the population.
3. When would you write a directional hypothesis? || When theory or past findings clearly predict which way the difference or relation will go.
4. What can statistics do with the null hypothesis? || Reject it or fail to reject it; never prove it true.
:::

:::mcq
Q: "Children who watch violent cartoons will show more aggressive play than children who watch non-violent cartoons." This is a:
- Null hypothesis
- Non-directional alternative hypothesis
- Descriptive hypothesis
- *Directional research hypothesis
> It predicts the direction of the difference.

Q: A researcher fails to reject the null hypothesis. The correct conclusion is:
- *The data do not give enough evidence of a difference
- The null hypothesis has now been proved true
- The research hypothesis has now been shown to be false
- The study must have used a biased sample
> Absence of evidence is not evidence of absence, especially in a small study.

Q: A hypothesis derived from the predictions of attachment theory, before any data are collected, is best called:
- Inductive
- Working
- *Deductive
- Descriptive
> It runs from theory down to a specific prediction.
:::

## 1.4 Reviewing the literature and writing a proposal [core][starting]
Before you design anything, you find out what is already known. The **review of literature** stops you repeating old work, shows you the gap, gives you tools and designs others have used, and grounds your hypotheses in theory.

### Where to look
- **Primary sources** report original research (a journal article, a thesis). **Secondary sources** summarise others' work (textbooks, review articles). Exams like to ask which is which: a meta-analysis is usually treated as a secondary (review) source, even though it produces new numbers.
- Databases: **PubMed**, **PsycINFO** (APA), **Scopus**, **Web of Science**, **Google Scholar**. Indian sources: **Shodhganga** (Indian PhD theses, run by INFLIBNET), the national journals of Indian psychiatry and clinical psychology.
- **Systematic reviews** search exhaustively with stated rules (and follow the PRISMA reporting guideline); **narrative reviews** are selective summaries.

:::widget flow
{"title": "How a systematic review filters studies", "layout": "chain", "nodes": [{"id": "n0", "label": "Identify", "detail": "Search all databases with a stated strategy"}, {"id": "n1", "label": "Remove duplicates", "detail": "Same study found twice"}, {"id": "n2", "label": "Screen", "detail": "Titles and abstracts against the rules"}, {"id": "n3", "label": "Eligibility", "detail": "Read full texts"}, {"id": "n4", "label": "Include", "detail": "Final studies, combined in a synthesis or meta-analysis"}], "caption": "This is the PRISMA flow that systematic reviews report."}
:::

### A research proposal (synopsis) usually contains
1. Title
2. Introduction and rationale (why this matters, especially in your setting)
3. Review of literature, ending with the **gap**
4. Aim, objectives, research questions and hypotheses
5. Method: design, participants and sampling, tools (with reliability and validity), procedure, analysis plan
6. Ethical considerations
7. Timeline and budget
8. References (APA style in psychology)

:::widget timeline
{"prompt": "Put the sections of a research proposal in their usual order.", "events": [{"label": "Title"}, {"label": "Introduction and rationale"}, {"label": "Review of literature, ending with the gap"}, {"label": "Aim, objectives and hypotheses"}, {"label": "Method: design, sample, tools, procedure, analysis"}, {"label": "Ethical considerations"}, {"label": "Schedule and budget"}, {"label": "References"}], "why": "Each part answers the question the previous one raises: why study this, what is already known, what exactly will you test, how, is it safe, and can it be done."}
:::

:::widget reveal
{"prompt": "Why does a good literature review end with a 'gap', not just a summary?", "answer": "Because the gap is the reason your study exists. A list of past findings says what is known; the gap says what is not yet known, or not known in this population or setting (for example, no study of exam anxiety in first-generation college students in rural Maharashtra). The gap leads straight into your research question and hypotheses."}
:::

:::recall
1. Primary or secondary: a textbook chapter on attachment? || Secondary.
2. Name two databases for psychology articles and one Indian source of theses. || PsycINFO and PubMed (or Scopus, Web of Science); Shodhganga for Indian theses.
3. Name the main sections of a research proposal. || Title, introduction and rationale, review of literature, aims and hypotheses, method (design, sample, tools, procedure, analysis), ethics, timeline and budget, references.
:::

:::mcq
Q: A systematic review differs from a narrative review mainly because it:
- Is always longer and covers more years of work
- *Uses a stated, exhaustive and repeatable search method
- Only includes randomised trials published in the last five years
- Never combines results using any statistics
> Transparency of search and selection is the defining feature.

Q: Which is a primary source?
- An encyclopaedia entry summarising intelligence theories
- A textbook chapter describing CBT trials in India
- A newspaper report summarising a new trial of CBT in Bengaluru
- *A journal article reporting a new trial of CBT in Bengaluru
> It reports original data collected by the authors.
:::

## 1.5 Level check · Starting [core][starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: "The world-famous professor says it, so it must be true." Peirce would call this the method of:
- Tenacity
- A priori (intuition)
- *Authority
- Science
> Belief resting on the standing of the source.

Q: Which feature is central to Popper's view of science?
- *Falsifiability
- Proving theories true
- Collecting as many facts as possible
- Agreement with common sense
> A theory must risk being proved wrong.

Q: Research done mainly to build theory, without an immediate practical use, is:
- Applied research
- *Basic (fundamental) research
- Action research
- Evaluation (programme) research
> Basic research aims at general understanding.

Q: In an experiment on the effect of caffeine dose on reaction time, caffeine dose is the:
- Dependent variable
- Extraneous (nuisance) variable
- Mediator
- *Independent variable
> It is manipulated by the researcher.

Q: A study finds that a parenting programme reduces child aggression, but only in families with low income. Family income is a:
- Mediator
- Dependent variable
- Constant
- *Moderator
> It changes the strength of the effect: for whom it works.

Q: "Intelligence is whatever the WAIS-IV measures, as the Full Scale IQ score." This is:
- *A measured operational definition
- A conceptual definition
- An experimental operational definition
- A hypothesis
> It defines the variable by the measuring operation.

Q: The hypothesis tested directly by a statistical test is the:
- Research hypothesis
- Alternative hypothesis
- *Null hypothesis
- Working hypothesis
> Tests ask how likely the data are if the null were true.

Q: "Boys and girls will differ in reading speed" is:
- Directional
- Null
- Descriptive (one-variable)
- *Non-directional
> It predicts a difference but not its direction.

Q: A teacher's warmth differs between the two classrooms being compared for a new teaching method. Teacher warmth is a:
- Dependent variable
- *Confounding variable
- Moderator
- Operational definition
> It varies along with the IV, so its effect cannot be separated.

Q: Which is an attribute (organismic) variable?
- *Birth order
- Type of feedback given
- Length of a therapy session
- Room temperature set by the researcher
> Birth order cannot be manipulated.

Q: The correct order of the first steps of research is:
- Hypothesis, problem, literature review
- Literature review, data collection, problem
- *Problem, literature review, hypothesis
- Design, hypothesis, problem
> Find the problem, see what is known, then predict.

Q: Shodhganga is:
- A statistics package
- A national ethics committee for research on humans
- A sampling method
- *A repository of Indian theses run by INFLIBNET
> It holds PhD theses from Indian universities.

Q: Which hypothesis is testable?
- *Students given feedback within a day will score higher on the next quiz
- Some people may sometimes feel some anxiety in some situations, depending on many factors
- Life feels meaningful to those who believe that it is meaningful, whatever happens to them
- Anxiety exists
> It names the variables, the groups and the direction.

Q: "Systematic, controlled, empirical, amoral, public and critical" describes scientific research according to:
- Popper
- Wilhelm Wundt
- *Kerlinger
- Freud
> This is Fred Kerlinger's well-known definition.

Q: Failing to reject the null hypothesis means:
- *There is not enough evidence against the null
- The null is proved
- The research hypothesis is proved false
- The study must be repeated with the same sample
> Not proof of no effect.
:::

# Part II · Beginner: sampling, measurement and designs

## 2.1 Sampling: who you study [core][beginner]
You can rarely study everyone. You study a **sample** and generalise to a **population**. How well that works depends on how the sample was chosen.

### The vocabulary
- **Population (universe):** everyone the findings are meant to apply to (all undergraduate psychology students in Gujarat).
- **Target versus accessible population:** the group you want to generalise to versus the group you can actually reach.
- **Sampling frame:** the actual list you sample from (enrolment lists from 40 colleges). A bad frame produces **coverage error**: a telephone directory misses people without landlines.
- **Sampling unit:** the thing chosen at each stage (a college, then a class, then a student).
- **Parameter** (population value) versus **statistic** (sample value).
- **Sampling error:** the chance difference between a sample statistic and the population parameter. It shrinks as the sample grows. **Sampling bias** is a systematic difference caused by the method; it does **not** shrink with a bigger sample.

:::analogy Tasting the dal
To check the salt you taste one spoon. If the dal is well stirred (random sampling), one spoon tells you about the whole pot. If you only skim the top (biased sampling), a bigger spoon will not help. You will just get more of the wrong answer.
:::

### Probability sampling: every unit has a known, non-zero chance
| Method | How | Use and caution |
|---|---|---|
| **Simple random** | Every unit, and every combination, has an equal chance (lottery, random number table, computer) | Needs a complete frame |
| **Systematic** | Pick a random start, then every k-th unit; k = N ÷ n | Easy; dangerous if the list has a repeating pattern (periodicity) |
| **Stratified** | Divide the population into strata (gender, urban or rural), then sample randomly within each | **Proportionate** keeps the population ratios; **disproportionate** oversamples small strata (then weight the results) |
| **Cluster** | Randomly choose whole groups (schools, villages), then study everyone in them | Cheap for spread-out populations; less precise, because people in a cluster resemble each other |
| **Multistage** | Clusters at several levels: districts, then villages, then households | Used in large national surveys |

### Non-probability sampling: chances are unknown
| Method | How | Typical use |
|---|---|---|
| **Convenience (accidental)** | Whoever is easy to reach | Pilot studies; most student projects |
| **Purposive (judgemental)** | Chosen deliberately for a characteristic | Qualitative work; expert panels |
| **Quota** | Fill set numbers per category (50 men, 50 women), but choose people by convenience | Market and opinion research; looks like stratified but is not random |
| **Snowball (chain referral)** | Participants recruit others | Hidden or stigmatised groups: people who inject drugs, transgender communities |
| **Consecutive** | Every eligible patient who walks in during a period | Hospital studies; better than convenience |
| **Theoretical** | Choose next cases to develop an emerging theory | Grounded theory |

:::widget sort
{"prompt": "Name the sampling method.", "buckets": ["Simple random", "Stratified", "Cluster", "Systematic", "Convenience", "Snowball", "Quota"], "items": [{"text": "Every 10th name on the college roll, after a random start", "bucket": 3}, {"text": "Ten villages chosen at random, and every household in them surveyed", "bucket": 2}, {"text": "Separate random samples from urban and rural schools, in proportion to their numbers", "bucket": 1}, {"text": "Names drawn by computer from the full list of 2,000 nurses", "bucket": 0}, {"text": "Students in the canteen who agree to fill in a form", "bucket": 4}, {"text": "People who use drugs are asked to bring friends who also use", "bucket": 5}, {"text": "An interviewer must find 50 men and 50 women, picking whoever is available", "bucket": 6, "why": "It looks stratified, but people are not chosen randomly within each group."}]}
:::

:::example A national survey, the hard way
India's **National Mental Health Survey (2015 to 2016)** interviewed about 35,000 adults across 12 states. It used **multistage, stratified, random cluster sampling**: districts were chosen within each state, then smaller units within districts, then households, with probability proportionate to population size. This is why its prevalence figures can be generalised to the states surveyed, unlike a convenience survey on Instagram.
:::

:::widget worked
{"title": "Drawing a proportionate stratified sample", "steps": [{"q": "A university in Hyderabad has 2,000 undergraduates: 1,200 in arts, 500 in science, 300 in commerce. You want a sample of 200 that mirrors the faculties. What fraction of the population is the sample?", "a": "200 ÷ 2,000 = 0.10, so a 10% sampling fraction in every stratum."}, {"q": "How many students from each faculty?", "a": "Arts 1,200 × 0.10 = 120; science 500 × 0.10 = 50; commerce 300 × 0.10 = 30. Total 200."}, {"q": "How do you pick the 120 arts students?", "a": "Randomly, from the arts enrolment list (the frame for that stratum), for example by computer-generated random numbers. Random selection inside each stratum is what makes it stratified random sampling, not quota sampling."}, {"q": "You also want to compare faculties, but 30 commerce students is too few. What do you do?", "a": "Use disproportionate stratified sampling: for example 70 from each faculty. Then, when estimating whole-university figures, weight each stratum back to its true share (arts 0.60, science 0.25, commerce 0.15)."}], "yourTurn": [{"q": "A district has 600 rural and 400 urban schools. You need 50 schools, proportionately. How many from each? And if you then studied every teacher in each chosen school, what is that stage called?", "a": "Rural 600 ÷ 1,000 × 50 = 30; urban 20. Choosing schools and then studying everyone in them is cluster sampling, so the whole design is stratified cluster sampling."}]}
:::

:::widget flow
{"title": "Sampling methods", "layout": "tree", "nodes": [{"id": "s", "label": "Sampling", "detail": "Choosing who to study"}, {"id": "p", "label": "Probability", "detail": "Every unit has a known chance", "parent": "s"}, {"id": "np", "label": "Non-probability", "detail": "Chances unknown", "parent": "s"}, {"id": "srs", "label": "Simple random", "detail": "Lottery or computer", "parent": "p"}, {"id": "sys", "label": "Systematic", "detail": "Every k-th unit", "parent": "p"}, {"id": "str", "label": "Stratified", "detail": "Random within strata", "parent": "p"}, {"id": "cl", "label": "Cluster and multistage", "detail": "Random groups, then all or some inside", "parent": "p"}, {"id": "con", "label": "Convenience", "detail": "Whoever is easy to reach", "parent": "np"}, {"id": "pur", "label": "Purposive", "detail": "Chosen for a characteristic", "parent": "np"}, {"id": "q", "label": "Quota", "detail": "Fill categories by convenience", "parent": "np"}, {"id": "sn", "label": "Snowball", "detail": "Participants recruit others", "parent": "np"}]}
:::

:::widget curve
{"kind": "normal", "title": "Sampling error: how sample means spread", "caption": "Sample means pile up around the population mean in a normal curve. A bigger sample makes the curve narrower, so a single sample is more likely to be close to the truth. Bias shifts the whole curve and size cannot fix it."}
:::

### What decides sample size
- **Effect size:** small effects need big samples.
- **Desired power** (usually 0.80) and **alpha** (usually .05).
- **Variability** in the population: more variable, larger sample.
- **Design:** within-subjects designs need fewer people than between-subjects designs; cluster samples need more (the **design effect**).
- **Expected drop-out**, number of subgroups to compare, and number of predictors in a regression.
- For a survey estimating a proportion, the required n grows with the precision you want: halving the margin of error needs about four times the sample.

Sample size is planned **before** data collection with a **power analysis** (the statistics module shows how).

:::widget guess
{"prompt": "A survey wants to estimate a percentage (such as how many students have tried counselling) with a margin of error of plus or minus 5 points at 95% confidence, assuming the worst case of 50%. Roughly how many people does it need?", "min": 50, "max": 1500, "step": 10, "unit": "people", "answer": [370, 400], "reveal": "About 385. The formula is n = z² × p × (1 − p) ÷ e² = 1.96² × 0.5 × 0.5 ÷ 0.05² ≈ 384. For plus or minus 3 points you would need about 1,070. Precision is expensive."}
:::

:::recall
1. Sampling error versus sampling bias: which one does a larger sample fix? || Only sampling error. Bias comes from the method and stays however big the sample is.
2. How does quota sampling differ from stratified sampling? || Both fill categories, but quota chooses people within each category by convenience, while stratified chooses them randomly.
3. When is snowball sampling the method of choice? || For hidden or stigmatised populations with no sampling frame.
4. Name four things that raise the sample size you need. || Smaller effect, higher power wanted, stricter alpha, more variability (also clusters, drop-out, many subgroups).
:::

:::mcq
Q: A researcher picks a random number between 1 and 10, then takes every 10th name on the hostel list. This is:
- Simple random sampling
- *Systematic sampling
- Cluster sampling
- Quota sampling
> Random start, then every k-th unit.

Q: To study women who have survived acid attacks, a researcher asks each participant to introduce others she knows. This is:
- Purposive sampling
- *Snowball sampling
- Stratified sampling
- Consecutive sampling
> Chain referral for a hard-to-reach group.

Q: Thirty villages are chosen at random from a district, and every adult in each chosen village is interviewed. This is:
- Stratified sampling
- Systematic sampling
- *Cluster sampling
- Quota sampling
> Whole groups are randomly selected and everyone in them is studied.

Q: A survey of mental health is run only on a free app that requires a smartphone. Doubling its sample size will:
- Remove the bias, because large samples cancel it out
- Turn it into a probability sample of all adults in the region
- *Not remove the bias, though it narrows the interval
- Turn it into a census that covers every adult in the state
> Coverage bias comes from the frame, not the size.
:::

## 2.2 Measurement in research [core][beginner]
To study a variable you must **measure** it: assign numbers or categories by rules. A study can only be as good as its measures.

### Stevens' four scales of measurement
| Scale | What it tells you | Example | Allowed statistics |
|---|---|---|---|
| **Nominal** | Categories only, no order | Religion, diagnosis, blood group | Frequencies, mode, chi-square |
| **Ordinal** | Order, but unequal gaps | Class rank, socioeconomic class, a pain rating of mild, moderate, severe | Median, percentiles, Spearman's rho |
| **Interval** | Equal gaps, **no true zero** | Temperature in Celsius, IQ scores | Mean, SD, Pearson r, t, ANOVA |
| **Ratio** | Equal gaps **and a true zero** | Reaction time, weight, number of errors | All of the above, plus meaningful ratios ("twice as fast") |

:::mnemonic NOIR
**N**ominal, **O**rdinal, **I**nterval, **R**atio: each level adds one property: categories, then order, then equal intervals, then a true zero.
:::

:::trap Likert scales
A single Likert item (strongly disagree to strongly agree) is **ordinal**. A total of many Likert items is usually **treated as interval** in practice, and parametric tests are used. Examiners accept "ordinal, often treated as interval", not "ratio".
:::

:::widget layers
{"title": "Scales of measurement: each level adds a property", "shape": "stack", "layers": [{"label": "Ratio", "detail": "True zero: 'twice as fast' makes sense"}, {"label": "Interval", "detail": "Equal gaps, no true zero"}, {"label": "Ordinal", "detail": "Order, unequal gaps"}, {"label": "Nominal", "detail": "Categories only"}], "caption": "Higher scales allow everything the lower ones do, plus more."}
:::

### Reliability and validity of a measure
- **Reliability** is **consistency**: test-retest, parallel forms, internal consistency (split-half, Cronbach's alpha), inter-rater.
- **Validity** is **accuracy**: does it measure what it claims? Content, criterion-related (concurrent and predictive) and construct (convergent and discriminant) validity.
- A measure can be reliable without being valid (a bathroom scale that always reads 2 kg heavy), but it **cannot be valid without being reliable**.

:::widget compare
{"title": "Reliability and validity: the bathroom scale", "a": {"label": "Reliable, not valid", "points": ["Weigh yourself five times: 62, 62, 62, 62, 62 kg", "Your true weight is 60 kg", "Consistent, but wrong every time", "Like arrows tightly grouped off the target"], "summary": "Reliability is consistency. A biased tool can be perfectly consistent."}, "b": {"label": "Reliable and valid", "points": ["Five readings: 60, 60, 60, 60, 60 kg", "Your true weight is 60 kg", "Consistent and correct", "Like arrows grouped on the bullseye"], "summary": "Validity is accuracy. A measure cannot be valid unless it is reliable, but reliability alone is not enough."}}
:::

The statistics module shows how to compute reliability coefficients, and the assessment module covers test construction.

:::widget sort
{"prompt": "Is each check about reliability or validity, and which kind?", "buckets": ["Test-retest reliability", "Inter-rater reliability", "Internal consistency", "Content validity", "Criterion validity", "Construct validity"], "items": [{"text": "The same students take the scale twice, a fortnight apart, and scores correlate highly", "bucket": 0}, {"text": "Two psychologists rate the same interview tapes and agree closely", "bucket": 1}, {"text": "Cronbach's alpha for the 20 items is 0.86", "bucket": 2}, {"text": "Experts check that the items cover every symptom of depression", "bucket": 3}, {"text": "Scores on a new screening tool match diagnoses made by clinicians", "bucket": 4}, {"text": "The anxiety scale correlates with other anxiety tests but not with an intelligence test", "bucket": 5, "why": "Convergent and discriminant evidence for construct validity."}]}
:::

### Types of measure, and their biases
- **Self-report** (questionnaires, interviews): easy, but open to **social desirability** (looking good), **acquiescence** (agreeing with everything), **extreme or central tendency** responding, and poor insight. Fixes: reverse-keyed items, lie scales, anonymous responding, forced-choice formats.
- **Behavioural** (observed actions, task performance): less faking, but subject to **reactivity** when people know they are watched.
- **Physiological** (heart rate, cortisol, EEG, fMRI): hard to fake, but often non-specific (a fast heart can mean fear or excitement).
- **Implicit** measures (reaction-time tasks such as the Implicit Association Test) aim to bypass deliberate control; their reliability for individuals is modest.

### Attitude scales in brief
- **Thurstone** (equal-appearing intervals): judges place statements on an 11-point scale; respondents agree or disagree with statements of known value.
- **Likert** (summated ratings): agreement on a 5- or 7-point scale, summed.
- **Guttman** (cumulative, scalogram): items ordered so that agreeing with a strong item implies agreeing with all milder ones.
- **Semantic differential** (Osgood): ratings between bipolar adjectives (good-bad), loading on evaluation, potency and activity.
- **Bogardus social distance:** how close a relationship a person would accept with a member of a group.

:::widget sort
{"prompt": "Which scale of measurement is each variable?", "buckets": ["Nominal", "Ordinal", "Interval", "Ratio"], "items": [{"text": "Diagnosis: depression, anxiety, psychosis", "bucket": 0}, {"text": "Rank in the university merit list", "bucket": 1}, {"text": "IQ score on the WAIS", "bucket": 2, "why": "Equal intervals are assumed, but an IQ of 0 is not 'no intelligence', and 140 is not 'twice' 70."}, {"text": "Reaction time in milliseconds", "bucket": 3}, {"text": "Mother tongue", "bucket": 0}, {"text": "Number of panic attacks this month", "bucket": 3, "why": "Zero means none: a true zero."}, {"text": "Socioeconomic class: lower, middle, upper", "bucket": 1}, {"text": "Temperature in Celsius", "bucket": 2}]}
:::

:::recall
1. What property does each step of NOIR add? || Nominal: categories. Ordinal: order. Interval: equal intervals. Ratio: a true zero.
2. Can a measure be reliable but not valid? Valid but not reliable? || Reliable but not valid, yes. Valid but not reliable, no: reliability sets the upper limit for validity.
3. Name three response biases in self-report. || Social desirability, acquiescence, extreme or central tendency responding.
4. Which attitude scale uses judges to place statements on an 11-point scale? || Thurstone's equal-appearing intervals.
:::

:::mcq
Q: The highest scale of measurement on which "twice as much" is meaningful is:
- Nominal
- *Ratio
- Ordinal
- Interval
> Only a true zero makes ratios meaningful.

Q: A scale in which agreeing with "I would marry a member of this group" implies agreeing with all milder items such as "I would work with them" is a:
- Likert scale
- Osgood's semantic differential scale
- *Guttman (cumulative) scale
- Thurstone scale
> Items form a cumulative order.

Q: A respondent agrees with both "I enjoy parties" and "I avoid parties." This is most likely:
- Social desirability
- Central tendency
- Halo effect
- *Acquiescence
> Agreeing regardless of content; reverse-keyed items detect it.
:::

## 2.3 The experiment and how to control variance [core][beginner]
An **experiment** is the only design that can firmly show **cause**. It has three features:
1. **Manipulation:** the researcher actively changes the IV.
2. **Control:** other variables are held constant or balanced.
3. **Random assignment:** each participant has an equal chance of being in any condition, so groups are equal on average in everything, measured or not.

:::trap Random sampling is not random assignment
**Random sampling** (who gets into the study) protects **external validity**: can you generalise? **Random assignment** (who gets which condition) protects **internal validity**: did the IV cause the change? A study can have one without the other.
:::

### Kerlinger's MAXMINCON principle
Total variance in the DV has three sources. A good design:
- **MAX**imises **systematic (experimental) variance**: make the IV conditions really different (a strong manipulation).
- **MIN**imises **error variance**: reliable measures, standard procedures, a homogeneous sample, within-subjects designs.
- **CON**trols **extraneous variance**: so that nothing else varies with the IV.

### Ways to control extraneous variables
| Technique | How it works | Example |
|---|---|---|
| **Randomisation** | Spreads all extraneous variables evenly by chance | Coin toss for each participant |
| **Elimination** | Remove the variable completely | Test in a soundproof room |
| **Holding constant** | Same value for everyone | Only right-handed women aged 18 to 22 |
| **Matching** | Pair people on a variable, then split each pair across conditions | Match on baseline anxiety score |
| **Building it into the design** | Make the extraneous variable a second IV | Add gender as a factor |
| **Statistical control** | Remove its effect in the analysis | ANCOVA with baseline score as covariate |
| **Counterbalancing** | Vary the order of conditions to balance order effects | Half do A then B; half B then A |
| **Blinding** | Hide the condition from participants (single-blind) and from researchers and raters too (double-blind) | Placebo capsules that look identical |

:::widget flow
{"title": "MAXMINCON in three moves", "layout": "chain", "nodes": [{"id": "n0", "label": "Maximise", "detail": "Make the IV conditions really different"}, {"id": "n1", "label": "Minimise", "detail": "Cut error: reliable measures, standard procedure"}, {"id": "n2", "label": "Control", "detail": "Stop anything else varying with the IV"}], "caption": "Kerlinger's recipe for a clean experiment."}
:::

### Between-subjects and within-subjects designs
- **Between-subjects (independent groups):** each person experiences one condition. No carry-over, but groups may differ, and you need more people.
- **Within-subjects (repeated measures):** each person experiences all conditions. Each person is their own control, so error variance falls and fewer people are needed. The cost is **order effects**: practice, fatigue, boredom, sensitisation and **carry-over** (the effect of one condition lingering into the next).
- Order effects are handled by **counterbalancing**: **complete** (all possible orders), **ABBA** (reverse order within each person), or a **Latin square** (each condition appears once in each position).
- **Matched-groups designs** sit between the two.

:::widget compare
{"title": "Between-subjects or within-subjects?", "a": {"label": "Between-subjects", "points": ["Each person does one condition", "No carry-over or practice effects", "Groups may differ by chance", "Needs more participants"], "summary": "Use when doing one condition would spoil the other, such as learning a technique."}, "b": {"label": "Within-subjects", "points": ["Each person does every condition", "Each person is their own control", "Fewer participants, more power", "Order effects: practice, fatigue, carry-over"], "summary": "Use when conditions can be repeated, and counterbalance the order."}}
:::

### Classic designs, in Campbell and Stanley's notation
Notation: **R** = random assignment, **O** = observation (measurement), **X** = treatment.

| Design | Layout | Comment |
|---|---|---|
| One-shot case study (pre-experimental) | X O | No comparison at all |
| One-group pretest-posttest (pre-experimental) | O X O | History, maturation, testing and regression all possible |
| Static-group comparison (pre-experimental) | X O / O, no R | Groups may differ from the start |
| **Posttest-only control group** (true) | R X O / R O | Simple; randomisation makes a pretest unnecessary |
| **Pretest-posttest control group** (true) | R O X O / R O O | Checks equivalence; pretest may sensitise people |
| **Solomon four-group** (true) | R O X O / R O O / R X O / R O | Tests whether the **pretest itself** changes the effect |

:::widget reveal
{"prompt": "Why did Richard Solomon add two extra groups without a pretest?", "answer": "Because a pretest can change how people respond to the treatment (pretest sensitisation, an interaction of testing and treatment). A pretest on attitudes to mental illness, for example, may make people notice the anti-stigma film more. Comparing the pretested and unpretested treatment groups shows whether the pretest altered the effect, which protects external validity. The cost is needing four groups."}
:::

:::widget flow
{"title": "Classifying research designs", "layout": "tree", "nodes": [{"id": "d", "label": "Designs", "detail": "How the study is built"}, {"id": "e", "label": "Experimental", "detail": "Manipulation", "parent": "d"}, {"id": "ne", "label": "Non-experimental", "detail": "No manipulation", "parent": "d"}, {"id": "pre", "label": "Pre-experimental", "detail": "One-shot; one-group pre-post; static group", "parent": "e"}, {"id": "true", "label": "True experimental", "detail": "Random assignment: post-test only, pre-post control, Solomon, factorial", "parent": "e"}, {"id": "quasi", "label": "Quasi-experimental", "detail": "No random assignment: non-equivalent groups, time series, regression discontinuity", "parent": "e"}, {"id": "sc", "label": "Single-case", "detail": "AB, ABAB, multiple baseline, changing criterion", "parent": "e"}, {"id": "cor", "label": "Correlational and survey", "detail": "Measure as variables occur", "parent": "ne"}, {"id": "epf", "label": "Ex post facto", "detail": "The cause has already happened", "parent": "ne"}, {"id": "obs", "label": "Observation and case study", "detail": "Describe in depth", "parent": "ne"}], "caption": "Tap any box for its key idea."}
:::

:::widget decide
{"scene": "Farah, an MSc trainee in Hyderabad, wants to know whether a four-session relaxation programme lowers exam anxiety in Class 10 students. The school will let her work with 120 students from three sections.", "ask": "Which design should she choose?", "choices": [{"label": "Give the programme to all 120 and compare anxiety before and after", "verdict": "harm", "outcome": "Anxiety may fall, but she cannot tell whether the programme did it.", "why": "A one-group pretest-posttest design cannot rule out history, maturation, testing or regression. As boards come closer, anxiety may change for many reasons."}, {"label": "Give it to section A and compare with sections B and C", "verdict": "ok", "outcome": "Better, but the sections may already differ.", "why": "This is a non-equivalent control group design, a quasi-experiment. Selection is the main threat; a pretest helps check it."}, {"label": "Randomly assign the 120 students to the programme or a waitlist, measure both groups before and after, and offer the programme to the waitlist afterwards", "verdict": "best", "outcome": "She can make a causal claim, and no one is denied the programme.", "why": "Random assignment controls selection and makes groups equal on average, so other changes affect both groups. A waitlist control is also ethical."}]}
:::

### Factorial designs
A **factorial design** studies two or more IVs at once, crossing every level of each with every level of the other. A 2 × 3 design has two IVs, one with 2 levels and one with 3, so 6 conditions.
- A **main effect** is the effect of one IV averaged over the levels of the other.
- An **interaction** means the effect of one IV **depends on** the level of the other. On a graph, non-parallel lines suggest an interaction; crossing lines are a **crossover (disordinal) interaction**.
- When an interaction is present, interpret main effects with caution.

Other designs: **randomised block** (people grouped into blocks on a nuisance variable, then randomly assigned within blocks), **Latin square** (controls two nuisance variables, such as order and time of day) and **mixed designs** (one between-subjects and one within-subjects factor, very common in therapy trials: group × time).

:::widget worked
{"title": "Reading a 2 × 2 factorial result", "steps": [{"q": "A study in Chennai crosses Therapy (CBT vs waiting list) with Medication (SSRI vs placebo). Mean improvement on a depression scale (higher is better): CBT + SSRI 12; CBT + placebo 8; waiting list + SSRI 7; waiting list + placebo 3. Is there a main effect of therapy?", "a": "Average over medication: CBT = (12 + 8) ÷ 2 = 10; waiting list = (7 + 3) ÷ 2 = 5. CBT is 5 points better on average: an apparent main effect of therapy."}, {"q": "Is there a main effect of medication?", "a": "SSRI = (12 + 7) ÷ 2 = 9.5; placebo = (8 + 3) ÷ 2 = 5.5. The SSRI is 4 points better on average: an apparent main effect of medication."}, {"q": "Is there an interaction?", "a": "Effect of the SSRI with CBT = 12 − 8 = 4. Effect of the SSRI on the waiting list = 7 − 3 = 4. The same, so the lines are parallel: no interaction. The two treatments add together."}, {"q": "Suppose CBT + SSRI had been 16 instead. What then?", "a": "The SSRI effect with CBT would be 16 − 8 = 8, but only 4 without CBT. The effect of one IV now depends on the other: an interaction (here a synergistic one). Whether it is real is decided by the F test for the interaction."}]}
:::

:::recall
1. Name the three defining features of an experiment. || Manipulation of the IV, control of extraneous variables, random assignment.
2. What does MAXMINCON stand for? || Maximise systematic variance, minimise error variance, control extraneous variance.
3. What problem does counterbalancing solve, and in which design? || Order effects (practice, fatigue, carry-over) in within-subjects designs.
4. What does the Solomon four-group design test that the pretest-posttest design cannot? || Whether the pretest itself interacts with the treatment (pretest sensitisation).
5. In a factorial design, what is an interaction? || The effect of one IV depends on the level of another IV.
:::

:::mcq
Q: Which control technique deals with extraneous variables that the researcher has not even thought of?
- Matching
- *Random assignment
- Holding every variable constant
- Elimination
> Randomisation balances unknown variables, on average.

Q: A 3 × 2 × 2 factorial design has how many conditions?
- 18
- 6
- 3
- *12
> Multiply the levels: 3 × 2 × 2 = 12.

Q: In a design written "R O X O / R O O", the second group is the:
- Experimental group
- Pre-experimental group
- Solomon group
- *Control group
> It is randomly assigned and measured twice, but gets no treatment.

Q: Each participant learns word lists in silence, with music and with traffic noise, in orders arranged so that each condition appears once in each position across groups. This control is:
- Matching
- Elimination of noise
- *A Latin square
- Blinding
> A Latin square balances position across conditions.
:::

## 2.4 Validity and its threats [core][beginner]
**Validity** in research means how far you can trust the conclusions. Thomas Cook and Donald Campbell named four kinds. Learn them as four questions.

| Kind | The question it answers | Main threats |
|---|---|---|
| **Statistical conclusion validity** | Is there really a relation between the variables? | Low power, violated assumptions, many tests (fishing), unreliable measures, restriction of range |
| **Internal validity** | Did the IV **cause** the change in the DV? | The Campbell and Stanley list below |
| **Construct validity** | Do the operations really represent the constructs? | Poor operational definitions, demand characteristics, experimenter expectancy, mono-operation bias |
| **External validity** | Does the result **generalise** to other people, settings and times? | Unrepresentative samples, artificial settings, reactive arrangements |

### Threats to internal validity
Campbell and Stanley's eight classic threats, with an Indian classroom example. A new study-skills programme is given to Class 11 in a school in Nagpur, tested in June and again in December.

| Threat | What it means | In the example |
|---|---|---|
| **History** | An outside event between the measures | A new strict principal joins in August |
| **Maturation** | Natural change inside participants over time | Students simply get older and more serious near board exams |
| **Testing** | The first test changes performance on the second | Students remember the June questions |
| **Instrumentation** | The measuring tool or the raters change | December test is easier, or raters become more lenient |
| **Statistical regression** | Extreme scorers move toward the mean on retest | Only the weakest students were chosen; they would improve somewhat anyway |
| **Selection** | Groups differ before treatment | The programme class was the "A" section |
| **Experimental mortality (attrition)** | Different drop-out across groups | Struggling students left the programme class |
| **Selection-maturation interaction** | Groups were maturing at different rates | The programme class was younger and changing faster |

Later additions by Cook, Campbell and their colleagues arise when the control group learns about the treatment:
- **Diffusion or imitation of treatment:** the control group copies the treatment.
- **Compensatory equalisation:** staff give the control group extras to be fair.
- **Compensatory rivalry (the John Henry effect):** the control group tries harder to beat the treatment group.
- **Resentful demoralisation:** the control group gives up because it feels left out.

:::widget sort
{"prompt": "A memory-training study in a Pune old-age home: which threat to internal validity is each problem?", "buckets": ["History", "Maturation", "Testing", "Regression", "Selection", "Attrition"], "items": [{"text": "A popular brain-games TV show starts during the study", "bucket": 0, "why": "An outside event between the measures."}, {"text": "Over the year, some residents' memory declines with age", "bucket": 1, "why": "Natural change inside participants."}, {"text": "Residents remember the word list from the first test", "bucket": 2, "why": "The pretest changes the post-test."}, {"text": "Only residents with the very worst first scores were chosen", "bucket": 3, "why": "Extreme scorers drift towards the mean on retest anyway."}, {"text": "The training group was mostly retired teachers", "bucket": 4, "why": "Groups differed before training."}, {"text": "The frailest residents drop out of the training group", "bucket": 5, "why": "Different drop-out makes the remaining group look better."}]}
:::

:::mnemonic The eight threats
**"History Makes Testing Instruments Regress, Selecting Mortal Interactions"**: history, maturation, testing, instrumentation, regression, selection, mortality, selection-maturation interaction.
:::

:::widget flow
{"title": "Four kinds of validity, with their main threats", "layout": "tree", "nodes": [{"id": "v", "label": "Validity of conclusions", "detail": "Can we trust them?"}, {"id": "sc", "label": "Statistical conclusion", "detail": "Is there a real relation?", "parent": "v"}, {"id": "in", "label": "Internal", "detail": "Did the IV cause it?", "parent": "v"}, {"id": "co", "label": "Construct", "detail": "Do the measures capture the ideas?", "parent": "v"}, {"id": "ex", "label": "External", "detail": "Does it generalise?", "parent": "v"}, {"id": "sc1", "label": "Low power, many tests", "detail": "Fishing for significance", "parent": "sc"}, {"id": "in1", "label": "History, maturation, testing, regression, selection, attrition", "detail": "The Campbell and Stanley list", "parent": "in"}, {"id": "co1", "label": "Demand characteristics, expectancy, mono-operation", "detail": "", "parent": "co"}, {"id": "ex1", "label": "WEIRD samples, artificial settings", "detail": "", "parent": "ex"}]}
:::

### Threats to construct validity
- **Demand characteristics** (described by Martin Orne): cues that tell participants what the study is about, so they act the part of a "good subject".
- **Experimenter expectancy effect** (studied by Robert Rosenthal): the researcher's expectations subtly shape results. In Rosenthal and Jacobson's classroom study of the 1960s, children labelled as "bloomers" gained more IQ points.
- **Placebo effect:** improvement from expecting help.
- **Hawthorne effect:** behaviour changes because people know they are being studied (named after the Western Electric Hawthorne Works studies, 1920s and 1930s).
- **Mono-operation and mono-method bias:** one measure or one method cannot capture a construct.
- Controls: **single-blind** and **double-blind** procedures, deception with debriefing, standardised scripts, automated instructions, a **placebo control**, multiple measures.

### Threats to external validity
- **Population validity:** does it generalise to other people? Most psychology samples are **WEIRD**: Western, educated, industrialised, rich and democratic, a label coined by Joseph Henrich and colleagues. A finding from American undergraduates may not hold for farmers in Bihar.
- **Ecological validity:** does it generalise to real-life settings? A memory test in a lab is not a student recalling notes in a noisy exam hall.
- **Temporal validity:** does it hold at other times?
- Campbell and Stanley's specific threats: interaction of **testing** and treatment, interaction of **selection** and treatment, **reactive effects of experimental arrangements**, and **multiple-treatment interference**.

:::note The trade-off
Tight control raises internal validity but often lowers external validity, and vice versa. A lab experiment is high on the first; a field study is high on the second. Science needs both, so findings are built up across both kinds of study.
:::

:::widget decide
{"scene": "A private hospital in Kolkata reports that its new 6-week relaxation group cut anxiety scores by 40%. Patients joined because they scored very high on an anxiety screen. There was no control group. Over the same weeks the city's festival season ended and exams finished.", "ask": "As a reviewer, which explanation do you raise first?", "choices": [{"label": "Statistical regression plus history: very high scorers drift down anyway, and the end of festival and exam stress could lower anxiety for everyone.", "verdict": "best", "outcome": "The hospital adds a waiting-list control group randomly assigned from the same high scorers.", "why": "Both threats are strong in a one-group pretest-posttest design that recruits extreme scorers. Only a randomised control group rules them out."}, {"label": "The relaxation group clearly works; a 40% drop is too large to be chance.", "verdict": "harm", "outcome": "The hospital advertises an effect that may not exist.", "why": "Size of change does not protect against systematic threats like regression and history."}, {"label": "Attrition: maybe anxious people dropped out.", "verdict": "ok", "outcome": "Worth checking, but the data show only 2 of 40 dropped out.", "why": "Always check drop-out, but here regression and history are the bigger problems."}]}
:::

:::recall
1. Name Cook and Campbell's four types of validity. || Statistical conclusion, internal, construct and external.
2. List the eight Campbell and Stanley threats to internal validity. || History, maturation, testing, instrumentation, statistical regression, selection, experimental mortality, selection-maturation interaction.
3. What is the John Henry effect? || Compensatory rivalry: the control group works harder to outdo the treatment group.
4. Population validity versus ecological validity. || Population: generalising to other people. Ecological: generalising to real-world settings.
5. What do demand characteristics threaten? || Construct validity (participants act on what they think the study wants).
:::

:::mcq
Q: Children chosen because they scored lowest on a reading test improve on retest, even without help. This is best explained by:
- History
- Maturation
- *Statistical regression
- Instrumentation (a changed test)
> Extreme scores tend to move toward the mean on retest.

Q: Halfway through a study, the researchers replace the observers with a new, more lenient team. The threat is:
- *Instrumentation
- Testing
- Selection of participants
- Mortality
> The measuring "instrument" (the raters) changed.

Q: Workers increase output whenever lighting changes, up or down, because they know they are being studied. This is the:
- *Hawthorne effect
- Pygmalion effect
- John Henry effect
- Placebo effect
> Behaviour changes simply because of being observed.

Q: A double-blind procedure mainly controls:
- Selection of participants and their attrition
- History, maturation and other events outside the study
- *Participant expectations and experimenter expectancy
- Statistical regression toward the mean in retests
> Neither the participant nor the rater knows the condition.

Q: Which kind of validity is most at stake when a lab finding on American undergraduates is applied to elderly villagers in Odisha?
- Internal
- Statistical conclusion
- *External (population)
- Content
> Generalising to different people.
:::

## 2.5 Quasi-experimental, single-case and developmental designs [core][beginner]
Often you cannot randomly assign: you cannot assign people to a school, a flood or a diagnosis. **Quasi-experiments** keep manipulation or comparison but lack random assignment, so the researcher must argue away each threat to internal validity.

### Quasi-experimental designs
- **Non-equivalent control group design:** O X O / O O, with intact groups (two colleges, two wards). The pretest shows how similar the groups were. Main threats: selection and the selection interactions.
- **Interrupted time series:** many measurements before and after an event: O O O O X O O O O. A sudden change in level or slope at the event is evidence. Example: monthly suicide reports before and after a pesticide ban (Sri Lanka's bans of highly toxic pesticides were followed by a large fall in suicide deaths, a famous public-health time series). Main threat: history (something else that happened at the same moment). Adding a comparison series (a **multiple time series**) helps.
- **Regression discontinuity:** people are assigned by a cut-off score (all students below 40% get remedial classes). If outcomes jump at the cut-off, the treatment probably caused it. It is the strongest quasi-experimental design.
- **Ex post facto (causal-comparative) research:** the "cause" has already happened, and the researcher looks back (smokers versus non-smokers; survivors of a cyclone versus others). Kerlinger called it systematic empirical inquiry in which the scientist has no direct control of the IVs. It cannot prove cause; self-selection is the big problem.

### Single-case (small-n) designs
Used in behaviour therapy and clinical research where one person is studied intensively, with **repeated measurement** across **phases**. **A** = baseline (no treatment); **B** = treatment.

| Design | Pattern | Logic and limits |
|---|---|---|
| **AB** | Baseline, then treatment | Weakest: change could be history or maturation |
| **ABA (withdrawal)** | Baseline, treatment, withdraw | If behaviour returns to baseline when treatment is removed, the treatment was working; ends on no treatment, which is ethically awkward |
| **ABAB (reversal)** | Baseline, treatment, withdraw, reinstate | Two demonstrations of effect; ends on treatment. Unsuitable when behaviour cannot reverse (learned skills) or when withdrawal is unsafe (self-injury) |
| **Multiple baseline** | Treatment introduced at **staggered times** across behaviours, settings or people | No withdrawal needed: the effect is shown when each baseline changes only when treatment reaches it |
| **Changing criterion** | The target is raised in steps (cigarettes allowed: 20, then 15, then 10) | Effect shown when behaviour tracks each new criterion |
| **Alternating treatments** | Two treatments rapidly alternated | Compares treatments within one person |

Single-case data are judged mainly by **visual analysis** of graphs: changes in **level**, **trend**, **variability**, **immediacy** of effect and **overlap** between phases (summarised as the percentage of non-overlapping data). A stable baseline is needed before treatment begins.

:::widget decide
{"scene": "Arjun, 8, in a special school in Pune, bangs his head when tasks get hard. A behaviour analyst plans functional communication training, teaching him to say 'help' instead. She wants to show the training causes the change.", "ask": "Which design should she use?", "choices": [{"label": "ABAB: train, then stop training to see if head-banging returns, then train again.", "verdict": "harm", "outcome": "The ethics committee objects: deliberately removing treatment risks injury.", "why": "Withdrawal designs are unsuitable when the behaviour is dangerous."}, {"label": "Multiple baseline across settings: start training in class, then a week later at lunch, then later at home, measuring all three throughout.", "verdict": "best", "outcome": "Head-banging drops in each setting only when training starts there. The case is strong, and treatment is never withdrawn.", "why": "Staggered introduction shows control without withdrawal."}, {"label": "AB: measure for a week, then start training.", "verdict": "ok", "outcome": "Head-banging drops, but a new teacher joined that week, so the cause is unclear.", "why": "AB is clinically fine but weak evidence: history and maturation are not ruled out."}]}
:::

:::widget flow
{"title": "An ABAB reversal design", "layout": "chain", "nodes": [{"id": "n0", "label": "A: baseline", "detail": "Measure the behaviour until stable"}, {"id": "n1", "label": "B: treatment", "detail": "Behaviour should change"}, {"id": "n2", "label": "A: withdraw", "detail": "Behaviour should return toward baseline"}, {"id": "n3", "label": "B: reinstate", "detail": "Behaviour should change again"}], "caption": "Two demonstrations of control. If withdrawal is unsafe, use a multiple baseline instead."}
:::

### Developmental designs
| Design | How | Strength | Weakness |
|---|---|---|---|
| **Cross-sectional** | Different age groups measured once | Quick, cheap | Age is confounded with **cohort** (generation) |
| **Longitudinal** | Same people followed over years | Shows individual change | Slow, costly, attrition, practice effects, time-of-measurement confound |
| **Cross-sequential (cohort-sequential)** | Several cohorts each followed longitudinally | Separates age, cohort and time effects | Complex and expensive |

K. Warner **Schaie's Seattle Longitudinal Study** used sequential designs and showed that cross-sectional studies **exaggerated** intellectual decline with age, because older cohorts had less schooling. **Microgenetic** designs observe the same children very often during a short period of rapid change. A **cohort** is a group born around the same time who share historical experiences (people who were teenagers during the 2020 lockdowns).

:::recall
1. What is the key missing feature in a quasi-experiment? || Random assignment to conditions.
2. Why is the ABAB design stronger than the AB design? || It shows the effect twice, as behaviour changes when treatment is withdrawn and returns when it is reinstated.
3. When should you use a multiple-baseline design instead of ABAB? || When withdrawal is unethical or the behaviour cannot reverse.
4. What does a cross-sectional study of age confound? || Age with cohort.
5. What is the strongest quasi-experimental design? || Regression discontinuity.
:::

:::mcq
Q: A study compares adults who were children during the 2001 Gujarat earthquake with adults from an unaffected district on adult anxiety. This is:
- A true experiment
- *Ex post facto research
- A Solomon four-group design
- A changing-criterion design
> The "cause" occurred before the study; the researcher only compares.

Q: Which feature is essential before starting the treatment phase of a single-case design?
- A large sample
- Random assignment
- A control group
- *A stable baseline
> Without a stable baseline, change cannot be read.

Q: A finding that intelligence falls steeply with age from a one-time comparison of 20-, 40- and 70-year-olds is most likely distorted by:
- *Cohort effects
- Attrition
- Practice effects
- Regression
> Older cohorts had less education; cross-sectional data mix age and cohort.

Q: A smoking-reduction programme sets a lower daily target each fortnight and checks that smoking follows each target. This is a:
- Multiple-baseline design
- Alternating-treatments design
- Reversal design
- *Changing-criterion design
> The criterion is shifted step by step.
:::

## 2.6 Non-experimental methods [core][beginner]
Much important psychology is not experimental. These methods describe, discover and predict, and they study things that cannot be manipulated.

### Correlational research
Measures two or more variables as they occur and asks how they go together. It can show **strength and direction** of a relation and allow **prediction**, but not cause, because of:
- the **directionality problem** (does low mood cause poor sleep, or poor sleep cause low mood?), and
- the **third-variable problem** (ice-cream sales and drownings both rise in summer heat).
Cross-lagged panel designs and statistical controls help but do not fully solve these.

### Survey research
Asks many people questions to describe attitudes, behaviours or prevalence.
- Modes: face to face, telephone, postal, online. Online is cheap but may exclude the poor and elderly, and can attract bots.
- Good questionnaires avoid **double-barrelled** questions ("Is your teacher kind and competent?"), **leading** questions, **loaded** words, jargon, and **double negatives**. They pilot-test, translate and **back-translate** for Indian languages, and order sensitive questions late.
- **Open-ended** questions give rich answers but are hard to code; **closed-ended** questions are easy to analyse but can force choices.
- **Response rate** matters: non-responders often differ from responders (**non-response bias**).

### Interviews
- **Structured:** fixed questions in fixed order, like the SCID or MINI. High reliability.
- **Semi-structured:** a guide of key questions with freedom to probe. The workhorse of qualitative research.
- **Unstructured (in-depth):** a conversation around a topic.
- Interviewer effects: **interviewer bias**, the **halo effect** and status differences (caste, gender, language) can shape what people say. In many Indian settings a family member may want to be present, which changes answers.

:::widget compare
{"title": "Structured or unstructured interview?", "a": {"label": "Structured", "points": ["Fixed questions in a fixed order", "Same for every person", "High reliability, easy to compare", "Can miss what matters to the person"], "summary": "Best for diagnosis and surveys, such as the SCID or MINI."}, "b": {"label": "Unstructured", "points": ["A conversation around a topic", "Follows the person's lead", "Rich, unexpected detail", "Hard to compare, open to interviewer bias"], "summary": "Best for exploring experience. Semi-structured interviews sit in between and are the workhorse of qualitative research."}}
:::

### Observation
- **Naturalistic:** watch behaviour in its natural setting without interfering (Jane Goodall's chimpanzees; children's play in an anganwadi).
- **Participant observation:** the researcher joins the group, **overt** (they know) or **covert** (they do not, which raises ethical problems).
- **Structured (systematic) observation:** predefined categories and coding schemes, often in a lab.
- Recording: **event sampling** (record every instance of the behaviour), **time sampling** (observe at set intervals), **interval recording**, **duration** and **latency**.
- Problems: **observer bias** (seeing what you expect), **reactivity** (people change when watched; reduce by **habituation** or hidden observation), **observer drift**. Check **inter-observer reliability** with percentage agreement or **Cohen's kappa**.

:::widget flow
{"title": "Non-experimental methods", "layout": "tree", "nodes": [{"id": "m", "label": "Non-experimental", "detail": "No manipulation of the IV"}, {"id": "cor", "label": "Correlational", "detail": "Strength and direction of relations", "parent": "m"}, {"id": "sur", "label": "Survey", "detail": "Questionnaires and interviews at scale", "parent": "m"}, {"id": "obs", "label": "Observation", "detail": "Naturalistic, participant, structured", "parent": "m"}, {"id": "cs", "label": "Case study", "detail": "One person or group in depth", "parent": "m"}, {"id": "arc", "label": "Archival and content analysis", "detail": "Existing records and texts", "parent": "m"}]}
:::

### Case study
An intensive study of one person, group or event, using many sources (interviews, records, tests, observation). Famous examples: Phineas Gage, H.M. (Henry Molaison), Little Hans, Genie. Strengths: rich detail, rare conditions, generates hypotheses, can disprove a universal claim. Weaknesses: cannot be generalised alone; open to researcher bias; often relies on memory.

### Archival research and content analysis
- **Archival:** use existing records: hospital files, census data, NCRB reports, court judgements.
- **Content analysis:** systematically code the content of texts or media (how Bollywood films portray psychiatric patients; how often newspapers sensationalise suicide against the Press Council of India guidelines). It can be quantitative (counting categories) or qualitative.

:::widget sort
{"prompt": "Which method is each study using?", "buckets": ["Correlational or survey", "Observation", "Case study", "Archival or content analysis"], "items": [{"text": "Recording every act of sharing among toddlers in a Bengaluru crèche over two weeks", "bucket": 1}, {"text": "Coding 200 Hindi news reports of suicide for whether they mention the method", "bucket": 3}, {"text": "Asking 1,500 teachers in Bihar about burnout and class size by questionnaire", "bucket": 0}, {"text": "A detailed account of one man's recovery of speech after a stroke, using scans, tests and interviews", "bucket": 2}, {"text": "Linking district rainfall data with farmer suicide figures from NCRB reports", "bucket": 3, "why": "Existing records: archival. It is also correlational in design."}, {"text": "A researcher joins a cricket academy as an assistant coach to study team rituals", "bucket": 1, "why": "Participant observation."}]}
:::

:::recall
1. Name the two reasons correlation cannot show cause. || The directionality problem and the third-variable problem.
2. What is a double-barrelled question? || One that asks two things at once, so a single answer is ambiguous.
3. Event sampling versus time sampling. || Event: record every occurrence of the behaviour. Time: observe at pre-set intervals.
4. How do observers reduce reactivity? || Habituation (staying until people stop noticing) or unobtrusive or hidden observation (with ethical safeguards).
5. Give two strengths and two weaknesses of the case study. || Strengths: rich detail, studies rare cases, generates hypotheses, can refute universal claims. Weaknesses: poor generalisability, researcher bias, reliance on memory, no control.
:::

:::mcq
Q: "Do you agree that the government should stop wasting money on useless mental hospitals?" The main problem is that it is:
- Double-barrelled
- Too open-ended
- A double-negative question
- *Leading and loaded
> The wording pushes toward one answer.

Q: Two observers code the same videos and agree well beyond chance. The best index of this is:
- *Cohen's kappa
- Cronbach's alpha
- Test-retest reliability
- Split-half reliability
> Kappa corrects percentage agreement for chance.

Q: Which method is best for generating hypotheses about a rare neurological condition?
- A large survey
- A Solomon four-group design
- *A case study
- Quota sampling
> Rich, intensive study of rare cases.

Q: A survey of student well-being gets a 15% response rate, mostly from students who are doing well. The main threat is:
- Instrumentation
- Experimenter expectancy
- *Non-response bias
- Maturation
> Responders differ systematically from non-responders.
:::

## 2.7 Level check · Beginner [core][beginner]
Twelve or more right out of fifteen (80%) opens the Advanced level.

:::mcq
Q: A researcher divides a city's schools into government and private, then randomly picks schools from each in proportion. This is:
- Quota sampling
- *Proportionate stratified sampling
- Cluster sampling of whole schools
- Purposive (judgement) sampling
> Strata first, then random choice within each, in proportion.

Q: Which one is a probability sampling method?
- Snowball
- Quota
- *Systematic
- Convenience
> Every unit has a known chance.

Q: Room temperature differs between the two rooms where the experimental and control groups are tested. The best fix is to:
- Increase the sample size so the rooms average out
- Use a one-tailed test to make up for the difference between the rooms
- *Hold the temperature constant, or test both groups in the same room
- Change the DV to one that temperature cannot affect at all
> Holding constant removes the confound.

Q: The main advantage of a within-subjects design is:
- *Less error variance, because each person is their own control
- There are no order effects such as practice or fatigue to worry about
- It removes any need for counterbalancing
- Results generalise better to the real world
> Individual differences are removed from the error term.

Q: "R X O / R O" describes the:
- Static-group comparison design
- One-group pretest-posttest design
- *Posttest-only control group design
- Solomon four-group (pretest) design
> Random assignment, treatment, one measurement.

Q: Which threat is a one-group pretest-posttest study of a ten-month school programme most open to?
- Only selection
- Only the demand characteristics of the tests
- Multiple-treatment interference across classes
- *History and maturation
> With no control group and a long gap, outside events and natural growth are prime suspects.

Q: Telling raters which participants got the drug creates a risk of:
- *Experimenter expectancy effects
- Statistical regression in the ratings
- Attrition
- Cohort effects
> Raters' expectations can bias ratings.

Q: An effect found in a lab task that does not hold in real classrooms lacks:
- Internal validity
- Statistical conclusion validity
- Content validity
- *Ecological validity
> Generalising to real-world settings.

Q: Treatment is started on Monday for reading, a week later for spelling and two weeks later for maths. This is a:
- Reversal design
- Changing-criterion design across subjects
- Alternating-treatments design across skills
- *Multiple-baseline design across behaviours
> Staggered introduction across behaviours.

Q: Which developmental design separates age, cohort and time-of-measurement effects best?
- Cross-sectional
- *Cross-sequential
- Longitudinal
- Longitudinal case study
> Several cohorts each followed over time.

Q: A study of adults who were adopted versus not adopted, comparing self-esteem, is:
- A true experiment
- *Ex post facto research
- A single-case (small-n) design
- Action research
> The IV occurred naturally, before the study.

Q: The Hawthorne effect is a threat mainly to:
- Statistical conclusion validity, through low power
- Sampling frames, through coverage error in lists
- *Construct and external validity (reactivity)
- Inter-rater reliability
> Being observed changes behaviour, so the results reflect the study situation.

Q: The scale of a variable "rank in a class of 60" is:
- Nominal
- Interval
- *Ordinal
- Ratio
> Order without equal gaps.

Q: In observation research, "every 15 seconds, record whether the child is on task" is:
- Event sampling
- Duration recording of behaviour
- *Time (interval) sampling
- Latency recording
> Observation at fixed intervals.

Q: The control group in a school study learns about the new method and starts using it. The threat is:
- Resentful demoralisation of the control group
- Statistical regression
- *Diffusion or imitation of treatment
- Instrumentation
> The treatment leaks into the control condition.
:::
`;
