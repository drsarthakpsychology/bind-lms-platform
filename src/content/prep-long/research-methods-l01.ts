import type { LongQA } from "@/lib/prep/long-types";

const S = "research-methods" as const;

export const RESEARCH_METHODS_L01: LongQA[] = [
  {
    id: "rm-l01-001",
    subject: S,
    topic: "variables-hypotheses",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "mcp-entrance"],
    question: "Write short notes on the types of variables in psychological research.",
    plan: ["Define a variable", "Independent and dependent variables with one example", "Extraneous and confounding variables", "Moderator and mediator", "One line on operational definition"],
    answer: `## Meaning
A variable is any characteristic that can take more than one value across people, situations or time, such as anxiety, reaction time, gender or dose of a drug.

## Main types
- Independent variable (IV): the variable the researcher manipulates or uses to form groups, for example the type of feedback given to students.
- Dependent variable (DV): the outcome measured to see the effect of the IV, for example test performance.
- Extraneous variable: any other variable that could influence the DV, such as time of day or noise in the room. It is controlled by holding it constant, randomising or measuring it.
- Confounding variable: an extraneous variable that changes systematically along with the IV, so its effect cannot be separated from the IV. Confounds destroy internal validity.
- Moderator: a variable that changes the strength or direction of the IV and DV relationship, for example stress predicts depression more strongly in people with low social support.
- Mediator: the mechanism through which the IV affects the DV, for example exercise improves mood through better sleep.
- Organismic or subject variables: fixed features such as age or sex that cannot be manipulated, only selected.

## Conclusion
Every variable must be given an operational definition, a statement of exactly how it will be manipulated or measured, so that the study can be checked and repeated.`,
    keyPoints: ["Clear definition of a variable", "IV and DV with an example", "Extraneous versus confounding distinguished", "Moderator versus mediator distinguished", "Operational definition mentioned"],
    pitfalls: ["Calling every extraneous variable a confound", "Mixing up moderator (when) and mediator (how)"],
    module: "research-methods/1-2",
    visuals: [
      {
        kind: "sort",
        data: {
          prompt: "A study tests whether music while studying changes recall. Sort each variable.",
          buckets: ["Independent variable", "Dependent variable", "Extraneous or confounding"],
          items: [
            { text: "Music versus silence", bucket: 0, why: "This is what the researcher changes." },
            { text: "Number of words recalled", bucket: 1, why: "This is the measured outcome." },
            { text: "The music group was tested in the evening, the silence group in the morning", bucket: 2, why: "Time of day changes along with the IV, so it is a confound." },
            { text: "Room temperature", bucket: 2, why: "Could affect recall, so it is held constant." },
          ],
        },
      },
    ],
    ref: "Shaughnessy, Zechmeister and Zechmeister, Research Methods in Psychology, ch 1 and 6; Baron and Kenny 1986 on moderators and mediators",
  },
  {
    id: "rm-l01-002",
    subject: S,
    topic: "variables-hypotheses",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is a hypothesis? Discuss its types, sources and the characteristics of a good hypothesis.",
    plan: ["Define hypothesis and its role", "Types: research, null, alternative, directional, non-directional", "Sources of hypotheses", "Characteristics of a good hypothesis", "Example and conclusion"],
    answer: `## Definition
A hypothesis is a tentative, testable statement about the relationship between two or more variables. It is derived from theory, earlier findings or observation, and it tells the researcher what to look for and what data to collect. A hypothesis is not proved; it is supported or not supported by evidence.

## Types of hypothesis
- Research (substantive) hypothesis: a statement in words of the expected relationship, for example "Students who sleep less than six hours will recall fewer words than those who sleep eight hours."
- Null hypothesis (H0): states no difference or no relationship in the population, for example the mean recall of the two groups is equal. Statistical tests are carried out on the null.
- Alternative hypothesis (H1): states that a difference or relationship exists. It is accepted when the null is rejected.
- Directional (one-tailed): predicts the direction of the effect, for example sleep-deprived students will score lower.
- Non-directional (two-tailed): predicts a difference without stating which way.
- Descriptive, relational and causal hypotheses describe a state, a relationship or a cause and effect respectively.

## Sources
- Theory: a hypothesis deduced from a theory, as Festinger's dissonance theory predicted that a small reward produces more attitude change than a large one.
- Previous research, especially contradictions and gaps.
- Everyday observation and clinical experience.
- Analogy with other fields and intuition.

## Characteristics of a good hypothesis
| Feature | What it means |
| Testable | Variables can be measured and the statement can be shown to be wrong (Popper's falsifiability) |
| Clear and specific | Terms are operationally defined |
| States a relationship | Names at least two variables and how they relate |
| Consistent with known facts | Fits existing knowledge or explains why it differs |
| Parsimonious | No more assumptions than needed |
| Has scope | Leads to further predictions and explains more than one finding |

## Example
Theory: the Yerkes Dodson principle says moderate arousal is best for performance. Hypothesis: students with moderate test anxiety will score higher than those with low or high anxiety. H0: mean scores are equal across the three anxiety groups.

## Conclusion
The hypothesis links theory to data. A good one is precise, falsifiable and grounded in theory, so that whatever the result, the researcher learns something.`,
    keyPoints: ["Definition stresses testability and tentativeness", "Null versus alternative clearly stated", "Directional versus non-directional", "At least three sources", "At least four characteristics with falsifiability", "Worked example with H0"],
    pitfalls: ["Saying a hypothesis is proved", "Writing a hypothesis that names only one variable"],
    module: "research-methods/1-2",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "From theory to a tested hypothesis",
          layout: "chain",
          nodes: [
            { id: "t", label: "Theory", detail: "A general explanation, such as the Yerkes Dodson principle." },
            { id: "h", label: "Research hypothesis", detail: "A specific testable prediction derived from the theory." },
            { id: "o", label: "Operational definitions", detail: "Exactly how each variable will be measured or manipulated." },
            { id: "n", label: "Null and alternative", detail: "H0 states no effect; the test asks whether the data are unlikely if H0 were true." },
            { id: "d", label: "Data and decision", detail: "Reject or retain H0; the theory gains or loses support." },
          ],
        },
      },
    ],
    ref: "Kerlinger, Foundations of Behavioral Research ch 2; Atkinson and Hilgard appendix on research; Popper 1959",
  },
  {
    id: "rm-l01-003",
    subject: S,
    topic: "sampling",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Compare and contrast probability and non-probability sampling. Describe the main techniques under each with examples.",
    plan: ["Define population, sampling frame and sample", "Logic of probability sampling and its techniques", "Logic of non-probability sampling and its techniques", "Comparison table", "Choosing a method, Indian examples", "Conclusion"],
    answer: `## Basic terms
A population is the whole group a researcher wants to draw conclusions about. A sampling frame is the actual list from which the sample is drawn, such as a school register or voter list. A sample is the subset studied. Sampling matters because the conclusions of a study can only be generalised to the population the sample truly represents.

## Probability sampling
In probability sampling every member of the population has a known, non-zero chance of selection, and selection is left to chance. This allows sampling error to be estimated and makes inferential statistics meaningful.
- Simple random sampling: every member has an equal chance, using a lottery or random number table. Example: drawing 200 roll numbers at random from 2,000 students. Needs a complete frame.
- Systematic sampling: every kth person after a random start, where k is population size divided by sample size. Easy, but biased if the list has a cycle.
- Stratified random sampling: the population is divided into strata (such as gender, urban and rural, or school board) and random samples are drawn from each, either in proportion to size or equally. It guarantees representation of subgroups and reduces sampling error.
- Cluster sampling: naturally occurring groups such as villages, wards or schools are randomly chosen and everyone in them, or a random subset, is studied. Cheap for spread-out populations, but people within a cluster are alike, so error is larger.
- Multistage sampling: combines stages, for example states, then districts, then villages, then households. India's National Mental Health Survey of 2015 to 2016 used multistage, stratified, random cluster sampling across 12 states.

## Non-probability sampling
Here the chance of any person being chosen is unknown, and selection depends on convenience or judgement. It is faster and cheaper but the sample may be biased, and generalisation is weak.
- Convenience (accidental) sampling: whoever is available, such as students in one's own class. Most psychology experiments use it.
- Purposive (judgement) sampling: the researcher chooses people who fit the aims, such as patients with first-episode psychosis, or experts. Common in qualitative work.
- Quota sampling: the researcher fills fixed quotas (for example 50 men, 50 women) but chooses people within each quota non-randomly. It looks like stratified sampling without the randomness.
- Snowball sampling: participants recruit others like themselves. Useful for hidden groups such as people who inject drugs or transgender communities.
- Theoretical sampling: in grounded theory, cases are chosen to develop emerging concepts until saturation.

## Comparison
| Point | Probability | Non-probability |
| Selection | Random, known chance | Judgement or availability |
| Sampling frame | Needed | Not needed |
| Representativeness | High, if response rate is good | Uncertain |
| Sampling error | Can be estimated | Cannot be estimated |
| Cost and time | Higher | Lower |
| Typical use | Surveys, epidemiology, test norms | Pilot studies, clinical and qualitative research |
| Generalisation | Statistical | Theoretical or to similar cases |

## Sample size
Larger samples reduce sampling error but do not remove bias. Size is decided by a power analysis, using the expected effect size, the alpha level and the desired power, usually 0.80. Qualitative studies instead sample until saturation, when new cases add no new themes.

## Choosing a method
The choice depends on the aim. Estimating the prevalence of depression in Gujarat needs probability sampling, whereas exploring how caregivers of people with schizophrenia make meaning of illness calls for purposive sampling. In India, the lack of complete frames, language diversity, low literacy in some regions and gatekeepers such as village heads often push researchers toward cluster and multistage designs. Even a perfect random design fails if many people refuse, so response rate and non-response bias must be reported.

## Conclusion
Probability sampling supports statistical generalisation; non-probability sampling trades representativeness for feasibility and depth. A good report states the method, the frame, the response rate and the limits on generalisation.`,
    keyPoints: ["Defines population, frame and sample", "Explains the logic of known chance of selection", "At least four probability techniques with examples", "At least four non-probability techniques", "Comparison on representativeness and sampling error", "Indian example such as the National Mental Health Survey", "Mentions non-response bias"],
    pitfalls: ["Confusing quota with stratified sampling", "Calling convenience sampling random", "Forgetting that a random method with poor response rate is still biased"],
    module: "research-methods/2-1",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "Sampling methods",
          layout: "tree",
          nodes: [
            { id: "s", label: "Sampling" },
            { id: "p", label: "Probability", parent: "s", detail: "Every member has a known chance." },
            { id: "n", label: "Non-probability", parent: "s", detail: "Chance of selection unknown." },
            { id: "sr", label: "Simple random", parent: "p" },
            { id: "sy", label: "Systematic", parent: "p" },
            { id: "st", label: "Stratified", parent: "p" },
            { id: "cl", label: "Cluster and multistage", parent: "p" },
            { id: "co", label: "Convenience", parent: "n" },
            { id: "pu", label: "Purposive", parent: "n" },
            { id: "qu", label: "Quota", parent: "n" },
            { id: "sn", label: "Snowball", parent: "n" },
          ],
        },
      },
      {
        kind: "compare",
        data: {
          title: "Stratified versus quota sampling",
          a: { label: "Stratified", points: ["Population split into strata", "Random selection within each stratum", "Sampling error can be estimated"], summary: "Representative of each subgroup by chance." },
          b: { label: "Quota", points: ["Population split into quotas", "Interviewer picks people within each quota", "Selection bias possible"], summary: "Looks similar but is not random." },
        },
      },
    ],
    ref: "Kerlinger ch 8; Shaughnessy ch 5; Gururaj et al 2016 NMHS methodology report (NIMHANS)",
  },
  {
    id: "rm-l01-004",
    subject: S,
    topic: "sampling",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write short notes on sampling error and sampling bias.",
    plan: ["Define sampling error", "How it shrinks with sample size", "Define sampling bias with examples", "Contrast the two and state remedies"],
    answer: `## Sampling error
Sampling error is the chance difference between a sample statistic and the population value it estimates. If we draw many random samples of 100 students and calculate the mean anxiety score in each, the means will vary around the true population mean. This spread is measured by the standard error, which equals the standard deviation divided by the square root of the sample size. Sampling error is unavoidable, but it is random, it can be estimated, and it shrinks as the sample grows: quadrupling the sample size halves the standard error.

## Sampling bias
Sampling bias is a systematic error that makes the sample differ from the population in a consistent direction. It arises from the method, not from chance. Examples:
- Using only English-medium urban college students to draw conclusions about Indian youth.
- Online surveys that miss people without internet access.
- Volunteer bias: people who agree to take part are often more educated and more interested in the topic.
- Non-response bias: those who do not return a questionnaire may be the most distressed.

## Key contrast
| Point | Sampling error | Sampling bias |
| Nature | Random | Systematic |
| Effect of larger sample | Reduces it | Does not remove it |
| Remedy | Larger sample, stratification | Better frame, random selection, follow-up of non-responders |

A huge biased sample is still wrong; the 1936 Literary Digest poll of over two million people wrongly predicted the US election because its frame favoured richer voters.`,
    keyPoints: ["Sampling error as chance difference", "Standard error and sample size", "Sampling bias as systematic", "At least two examples of bias", "Bigger samples do not cure bias"],
    pitfalls: ["Treating the two terms as synonyms", "Claiming a large sample guarantees representativeness"],
    module: "research-methods/2-1",
    ref: "Shaughnessy ch 5; Squire 1988 on the Literary Digest poll",
  },
  {
    id: "rm-l01-005",
    subject: S,
    topic: "measurement-scales",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Discuss Stevens' scales of measurement with examples from psychology and the statistics permitted at each level.",
    plan: ["Define measurement", "Nominal, ordinal, interval, ratio with properties", "Psychological examples", "Permissible statistics table", "Debate on treating rating scales as interval", "Conclusion"],
    answer: `## Measurement
Measurement is the assignment of numbers to objects or events according to rules. In 1946 S. S. Stevens proposed four levels of measurement, each with more mathematical properties than the one before. The level decides which statistics are meaningful.

## The four scales
- Nominal: numbers or labels only name categories, with no order. Examples: gender, diagnosis (schizophrenia, bipolar disorder), religion, jersey numbers. The only operation is counting how many fall in each category.
- Ordinal: categories are ranked, but the distances between ranks are unknown. Examples: class rank, socioeconomic class, severity rated as mild, moderate or severe, finishing position in a race. The gap between first and second need not equal the gap between second and third.
- Interval: equal distances represent equal differences, but there is no true zero. Examples: temperature in Celsius, and by convention IQ and most standardised test scores. An IQ of 0 does not mean no intelligence, so we cannot say an IQ of 140 is twice an IQ of 70.
- Ratio: equal intervals and a true zero, so ratios are meaningful. Examples: reaction time, number of words recalled, age, weight, number of panic attacks per week. A reaction time of 600 milliseconds is twice 300 milliseconds.

## Properties and statistics
| Scale | Identity | Order | Equal intervals | True zero | Central tendency | Typical tests |
| Nominal | Yes | No | No | No | Mode | Chi-square, phi, contingency coefficient |
| Ordinal | Yes | Yes | No | No | Median | Spearman rho, Mann Whitney, Kruskal Wallis |
| Interval | Yes | Yes | Yes | No | Mean | Pearson r, t-test, ANOVA |
| Ratio | Yes | Yes | Yes | Yes | Mean, geometric mean | All of the above plus coefficient of variation |

Each higher scale allows all the statistics of the lower ones.

## The rating scale debate
Likert scales are strictly ordinal, because we cannot be sure the step from "agree" to "strongly agree" equals the step from "neutral" to "agree". Yet psychologists routinely sum items and use means and t-tests. The defence is that a total of many items behaves almost like an interval scale, and that parametric tests are robust. Critics argue that treating ordinal data as interval can distort results, especially with single items and skewed responses.

## Conclusion
Knowing the level of measurement prevents absurd conclusions, such as averaging diagnostic codes, and guides the choice between parametric and non-parametric statistics.`,
    keyPoints: ["Definition of measurement", "Four scales with correct properties", "Correct psychological examples, IQ as interval", "Permissible statistics per scale", "Mentions the Likert debate", "Higher scales include lower operations"],
    pitfalls: ["Calling IQ a ratio scale", "Using the mean for nominal data"],
    module: "research-methods/2-2",
    visuals: [
      {
        kind: "layers",
        data: {
          title: "Each level adds a property",
          shape: "stack",
          layers: [
            { label: "Ratio", detail: "Adds a true zero: reaction time, number recalled." },
            { label: "Interval", detail: "Adds equal intervals: Celsius, IQ scores." },
            { label: "Ordinal", detail: "Adds order: ranks, severity grades." },
            { label: "Nominal", detail: "Names only: diagnosis, gender." },
          ],
        },
      },
      {
        kind: "sort",
        data: {
          prompt: "Place each measure on its scale.",
          buckets: ["Nominal", "Ordinal", "Interval", "Ratio"],
          items: [
            { text: "Blood group", bucket: 0 },
            { text: "Rank in a merit list", bucket: 1 },
            { text: "WAIS full scale IQ", bucket: 2, why: "Equal steps by convention, but no true zero." },
            { text: "Reaction time in milliseconds", bucket: 3 },
            { text: "Pain rated none, mild, moderate, severe", bucket: 1 },
          ],
        },
      },
    ],
    ref: "Stevens 1946 Science; Atkinson and Hilgard appendix; Kerlinger ch 25",
  },
  {
    id: "rm-l01-006",
    subject: S,
    topic: "observation-reliability",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe the observational method in psychology. How is inter-observer reliability established? Work out Cohen's kappa for an example.",
    plan: ["Define observation and its types", "Recording methods", "Problems: reactivity, observer bias, drift", "Inter-observer reliability: percent agreement and kappa", "Worked kappa example", "Conclusion"],
    answer: `## Observation
Observation is the systematic watching and recording of behaviour as it happens. It is used when self-report is not possible, such as with infants or people with autism, and when what people do matters more than what they say.

## Types
- Naturalistic: behaviour in its everyday setting without intervention, such as recording playground aggression.
- Controlled or structured: in a set situation such as Ainsworth's Strange Situation.
- Participant: the observer joins the group, overtly or covertly, as in ethnography.
- Non-participant: the observer stays outside the group.

## Recording methods
- Event sampling: record each time a defined behaviour occurs.
- Time sampling: observe at fixed intervals, for example 10 seconds every minute.
- Narrative records, checklists and rating scales.
Behaviours must be operationally defined in a coding scheme so that two observers mean the same thing.

## Problems
- Reactivity: people change when watched. Remedies are habituation, hidden observers and unobtrusive measures.
- Observer bias: expectations shape what is seen. Remedies are blind observers and clear codes.
- Observer drift: definitions shift over time, so retraining and periodic checks are needed.
- Ethical issues in covert observation.

## Inter-observer reliability
Two observers code the same sessions independently and their agreement is calculated. Percent agreement is simple but inflated by chance agreement. Cohen's kappa corrects for chance: kappa equals observed agreement minus chance agreement, divided by one minus chance agreement.

## Worked example
Two observers code 100 intervals as aggression present or absent.
| Observer A by B | B present | B absent | Total |
| A present | 20 | 10 | 30 |
| A absent | 5 | 65 | 70 |
| Total | 25 | 75 | 100 |
- Observed agreement = (20 + 65) / 100 = 0.85.
- Chance agreement = (0.30 x 0.25) + (0.70 x 0.75) = 0.075 + 0.525 = 0.60.
- Kappa = (0.85 minus 0.60) / (1 minus 0.60) = 0.25 / 0.40 = 0.625.
Percent agreement looked excellent at 85 percent, but kappa of about 0.63 is only substantial on the Landis and Koch guide (0.41 to 0.60 moderate, 0.61 to 0.80 substantial, above 0.80 almost perfect).

## Indian application
Observation is widely used in Indian child development research, for example in anganwadi centres to record play and mother-child interaction, where questionnaires would be unreliable because of literacy and social desirability. Coding schemes developed abroad must first be checked for local meaning: eye contact or touch carry different social meanings across communities.

## Conclusion
Observation gives rich, real-world data, and its scientific value rests on clear coding, trained blind observers and chance-corrected reliability.`,
    keyPoints: ["Types of observation", "Event and time sampling", "Reactivity and observer bias with remedies", "Why percent agreement is inflated", "Kappa formula", "Correct kappa calculation", "Interpretation using a standard guide"],
    pitfalls: ["Reporting only percent agreement", "Arithmetic error in expected agreement"],
    module: "research-methods/2-2",
    visuals: [
      {
        kind: "worked",
        data: {
          title: "Cohen's kappa step by step",
          steps: [
            { q: "Observed agreement?", a: "(20 + 65) / 100 = 0.85" },
            { q: "Chance agreement?", a: "0.30 x 0.25 + 0.70 x 0.75 = 0.60" },
            { q: "Kappa?", a: "(0.85 minus 0.60) / (1 minus 0.60) = 0.625" },
          ],
          yourTurn: [{ q: "Observers agree on 90 of 100 intervals and chance agreement is 0.50. Kappa?", a: "(0.90 minus 0.50) / 0.50 = 0.80" }],
        },
      },
    ],
    ref: "Cohen 1960; Landis and Koch 1977; Shaughnessy ch 4. Kappa verified: (0.85-0.60)/0.40=0.625",
  },
  {
    id: "rm-l01-007",
    subject: S,
    topic: "experimental-design",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the experimental method in psychology. Describe the main techniques of experimental control and evaluate the strengths and limitations of experiments.",
    plan: ["Define an experiment and its three features", "Logic of causal inference", "Techniques of control one by one", "Types of experiment", "Strengths, limitations and modern responses", "Conclusion"],
    answer: `## Definition
An experiment is a research method in which the researcher deliberately manipulates one or more independent variables, measures the effect on a dependent variable, and controls other variables, so that a change in the dependent variable can be attributed to the manipulation. Its three defining features are manipulation, control and random assignment. It is the only method that allows firm cause and effect conclusions.

## The logic
John Stuart Mill's method of difference states that if two situations are alike in every way except one, any difference in outcome is due to that one factor. An experiment tries to create exactly that: two or more groups equal in all respects except the level of the IV. If the groups then differ on the DV beyond what chance would produce, the IV is the cause. The three conditions for causation are covariation, temporal order (the cause comes first) and elimination of alternative explanations. Experiments meet all three.

## Techniques of control
- Random assignment: each participant has an equal chance of being placed in any condition. This spreads individual differences such as intelligence and motivation evenly across groups, on average, so they cannot become confounds. It is different from random sampling, which concerns generalisation.
- Holding constant: keeping extraneous variables the same for everyone, such as instructions, room, time of day and experimenter.
- Elimination: removing a variable altogether, such as noise, by using a sound-proof room.
- Matching: pairing participants on a variable related to the DV (for example baseline IQ) and assigning one of each pair to each condition. Useful with small samples.
- Counterbalancing: in within-subjects designs, varying the order of conditions (AB for half, BA for half, or a Latin square) so that practice and fatigue effects are balanced.
- Control group: a group that does not receive the treatment, or receives a placebo, giving a baseline.
- Blinding: in a single-blind study participants do not know their condition, which controls demand characteristics; in a double-blind study the experimenter also does not know, which controls experimenter expectancy effects, shown by Robert Rosenthal.
- Standardised procedures and automated instructions reduce experimenter variation.
- Statistical control: measuring a variable and removing its influence, as in analysis of covariance.

## Types of experiment
| Type | Setting | Example | Trade-off |
| Laboratory | Controlled lab | Stroop task under time pressure | High internal, lower external validity |
| Field | Natural setting, IV manipulated | Piliavin's subway helping study | More realistic, less control |
| Natural or quasi | IV not assigned by researcher | Effect of a cyclone on children's stress | Real events, but groups may differ |

## Strengths
- Establishes cause and effect, the main goal of explanatory science.
- Precise control and measurement permit replication.
- Allows study of interactions between variables through factorial designs.
- Has produced foundational findings, from Ebbinghaus on memory to Bandura's Bobo doll studies and modern randomised trials of psychotherapy.

## Limitations
- Artificiality and low ecological validity: lab tasks such as memorising nonsense syllables may not reflect real memory.
- Demand characteristics: Martin Orne showed participants try to work out and fulfil the hypothesis.
- Experimenter effects, despite blinding.
- Sampling: most experiments use undergraduates from Western, educated, industrialised, rich and democratic (WEIRD) societies, so findings may not generalise to Indian villages or other cultures.
- Ethical limits: many important variables, such as abuse, bereavement or brain injury, cannot be manipulated.
- Reductionism: isolating one variable may miss the complex interplay in real life.
- Replication problems: many famous findings have failed to replicate, partly due to small samples and flexible analysis.

## A note on internal and external validity
The features that create control, such as a quiet laboratory, a standard task and a homogeneous sample of students, are the same features that limit generalisation. This is why a single experiment is never the last word. Mook argued that external validity is not always the goal: some experiments test whether a theory's prediction holds under any conditions, and for that purpose artificiality is acceptable. Others, such as trials of a school intervention, must work in real classrooms, so their settings and samples must resemble the target population.

## Responses to the limits
Researchers combine lab and field experiments, use large multisite samples (such as the Many Labs projects), preregister hypotheses, use deception sparingly with debriefing, and add qualitative work to understand meaning. Cross-cultural replication, including in India, tests generality.

## Conclusion
The experiment remains the strongest method for causal questions because random assignment and control rule out rival explanations. Its weakness is the gap between the controlled setting and real life, so the best evidence comes from converging methods: experiments for causation, correlational and field studies for generality, and qualitative work for meaning.`,
    keyPoints: ["Definition with manipulation, control, random assignment", "Causal logic and three conditions of causation", "At least six control techniques explained", "Random assignment distinguished from random sampling", "Lab, field and natural experiments compared", "Balanced strengths and limitations including WEIRD and ethics", "Modern responses such as preregistration", "Conclusion on converging methods"],
    pitfalls: ["Listing control techniques without saying what each controls", "Confusing random assignment with random sampling", "Only praising or only criticising the method"],
    module: "research-methods/2-3",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "The logic of a true experiment",
          layout: "chain",
          nodes: [
            { id: "a", label: "Sample", detail: "Participants recruited." },
            { id: "b", label: "Random assignment", detail: "Individual differences spread evenly across groups." },
            { id: "c", label: "Manipulate IV", detail: "Only the treatment differs between groups." },
            { id: "d", label: "Measure DV", detail: "Same measure, same conditions, ideally by a blind rater." },
            { id: "e", label: "Compare groups", detail: "A difference beyond chance is attributed to the IV." },
          ],
        },
      },
      {
        kind: "compare",
        data: {
          title: "Laboratory versus field experiment",
          a: { label: "Laboratory", points: ["Tight control of extraneous variables", "Easy to replicate", "Risk of demand characteristics and artificial tasks"], summary: "High internal validity." },
          b: { label: "Field", points: ["Natural setting, people often unaware", "Less control over noise and confounds", "Consent and debriefing harder"], summary: "Higher ecological validity." },
        },
      },
    ],
    ref: "Shaughnessy ch 6 to 8; Atkinson and Hilgard ch 1 and appendix; Orne 1962; Rosenthal 1966; Henrich, Heine and Norenzayan 2010 on WEIRD",
  },
  {
    id: "rm-l01-008",
    subject: S,
    topic: "validity-threats",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Explain internal and external validity. Discuss the major threats to each and how research designs control them.",
    plan: ["Define internal and external validity", "Campbell and Stanley's threats to internal validity with examples", "Threats to external validity", "How designs control them", "The trade-off", "Conclusion"],
    answer: `## Definitions
Internal validity is the degree to which a study allows us to conclude that the independent variable, and not something else, caused the change in the dependent variable. External validity is the degree to which the findings generalise to other people, settings, times and measures. Donald Campbell and Julian Stanley set out the classic list of threats, later expanded by Thomas Cook into four kinds of validity (adding statistical conclusion and construct validity).

## Threats to internal validity
Imagine a one-group study: depressed students are tested, given eight weeks of counselling and tested again, and their scores improve.
- History: events outside the study between pre and post, such as exams ending or a festival holiday.
- Maturation: natural change with time, such as spontaneous recovery from depression.
- Testing: taking the pretest itself changes scores on the post-test through practice or sensitisation.
- Instrumentation: changes in the measure or the raters, such as a tired interviewer at follow-up.
- Statistical regression: people selected for extreme scores tend to score closer to the mean when retested, even with no treatment.
- Selection: groups differ before treatment, for example volunteers for counselling are more motivated.
- Attrition (mortality): people drop out unevenly, such as the least improved leaving the counselling group.
- Selection interactions: for example selection by maturation, where one group is maturing faster.
- Diffusion or imitation of treatment: the control group learns about the treatment.
- Compensatory rivalry and resentful demoralisation of the control group.
- Experimenter expectancy and demand characteristics.

## Threats to external validity
- Population validity: the sample is unusual, such as urban college students standing for all Indian adults.
- Ecological validity: the lab setting and tasks differ from real life.
- Temporal validity: findings tied to a particular era, such as conformity rates in the 1950s.
- Interaction of testing and treatment: the pretest sensitises people so the treatment works only with a pretest.
- Reactive arrangements, including the Hawthorne effect, where being studied changes behaviour.
- Multiple treatment interference: earlier treatments affect later ones.

## How designs control the threats
| Design feature | Threats controlled |
| Control group | History, maturation, testing, instrumentation, regression |
| Random assignment | Selection and its interactions |
| Blinding | Expectancy and demand characteristics |
| Solomon four-group design | Testing and testing by treatment interaction |
| Intention-to-treat analysis and follow-up | Attrition |
| Field settings, diverse samples, replication | External validity threats |

The pretest-post-test control group design, with random assignment, rules out most internal threats. The one-group pretest-post-test design, by contrast, rules out almost none of them.

## Worked illustration
Suppose a college tests whether a peer-mentoring scheme reduces first-year dropout. In a weak version, all mentored students are compared with last year's batch. History (a new fee waiver this year), selection (only keen students signed up) and instrumentation (a new attendance system) all offer rival explanations. In a strong version, volunteers are randomly assigned to mentoring now or mentoring next term (a wait-list control), outcomes are recorded by staff blind to group, and everyone who was randomised is analysed. Now history and maturation affect both groups equally, selection is handled by randomisation, and attrition can be checked. External validity is then tested by repeating the scheme in a rural college and a women's college.

## Validity in Indian research
Indian studies face particular threats: translated tools may not measure the same construct (a construct validity issue), samples drawn from metropolitan colleges limit population validity, and the presence of a senior researcher can raise social desirability among respondents who defer to authority. Back translation, local norms and multi-site sampling are the usual remedies.

## The trade-off
Greater control usually means a more artificial setting, so internal and external validity pull against each other. Laboratory studies favour internal validity; field and survey studies favour external validity. Programmes of research balance the two, first showing an effect under control, then testing it in real settings and with varied populations.

## Conclusion
Validity is not a property of a method in general but of a particular conclusion. A good researcher anticipates each threat, chooses a design to rule it out, and states honestly what the study cannot claim.`,
    keyPoints: ["Clear definitions of both validities", "At least seven internal threats with examples", "At least four external threats", "Regression to the mean explained", "Design features linked to threats", "Trade-off between the two", "Mentions Campbell and Stanley or Cook"],
    pitfalls: ["Listing threats without examples", "Saying random sampling protects internal validity"],
    module: "research-methods/2-4",
    visuals: [
      {
        kind: "sort",
        data: {
          prompt: "A counselling study finds improvement from pre to post-test without a control group. Which threat is each explanation?",
          buckets: ["History", "Maturation", "Regression to the mean", "Attrition"],
          items: [
            { text: "Board exams ended during the eight weeks", bucket: 0 },
            { text: "Mild depression often lifts on its own", bucket: 1 },
            { text: "Only students with the highest scores were chosen", bucket: 2 },
            { text: "The students who felt worse stopped coming", bucket: 3 },
          ],
        },
      },
    ],
    ref: "Campbell and Stanley 1963; Shadish, Cook and Campbell 2002; Shaughnessy ch 8",
  },
  {
    id: "rm-l01-009",
    subject: S,
    topic: "validity-threats",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write short notes on demand characteristics and experimenter effects.",
    plan: ["Define demand characteristics with Orne", "Define experimenter effects with Rosenthal", "Controls for each"],
    answer: `## Demand characteristics
Demand characteristics are cues in a study that tell participants what the researcher expects, so they change their behaviour to fit (or defy) the hypothesis. Martin Orne coined the term after finding that participants would carry out a pointless task, such as adding numbers on hundreds of sheets and tearing them up, for hours simply because they were in an experiment. Participants may play the good subject, the negativistic subject or the apprehensive subject worried about being judged.

## Experimenter effects
Experimenter effects are changes in results caused by the researcher's own expectations or characteristics. Robert Rosenthal showed that students told their rats were "maze bright" got better maze performance than those told their rats were "maze dull", although the rats were identical. In the classroom version, the Pygmalion study, teachers' raised expectations were followed by IQ gains in some young children. Effects run through subtle cues such as tone, smiling and recording errors. Attributes such as age, gender and caste of the researcher can also change responses.

## Controls
- Single-blind procedures and cover stories hide the hypothesis.
- Double-blind procedures, where the person running the session does not know the condition.
- Standardised and recorded instructions, or computer delivery.
- Post-experimental inquiry to check what participants guessed.
- Deception, used sparingly and followed by debriefing.

Both effects threaten internal validity because the outcome may reflect expectations rather than the IV.`,
    keyPoints: ["Orne's definition and example", "Rosenthal's rat or Pygmalion study", "Mechanisms of influence", "Single and double blind controls", "Link to internal validity"],
    module: "research-methods/2-4",
    ref: "Orne 1962 American Psychologist; Rosenthal and Fode 1963; Rosenthal and Jacobson 1968",
  },
  {
    id: "rm-l01-010",
    subject: S,
    topic: "experimental-design",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Compare between-subjects and within-subjects designs. What are order effects and how is counterbalancing used to control them?",
    plan: ["Define both designs", "Advantages and disadvantages of each", "Order effects: practice, fatigue, carry-over", "Counterbalancing methods", "Choosing a design and conclusion"],
    answer: `## Between-subjects design
Each participant takes part in only one condition, so the comparison is between different groups of people. Example: one group learns a word list with imagery, another with rote rehearsal.
- Advantages: no order or carry-over effects, each participant is naive, sessions are short.
- Disadvantages: needs more participants, and individual differences add error variance, which lowers power. Groups must be equalised by random assignment or matching.

## Within-subjects (repeated measures) design
Each participant takes part in every condition, so each person acts as their own control. Example: the same students learn one list with imagery and another with rote rehearsal.
- Advantages: fewer participants, individual differences are removed from the error term, so power is higher.
- Disadvantages: order effects, possible sensitisation to the hypothesis, and impossible when a condition has a lasting effect (for example learning a skill or receiving therapy).

## Order effects
- Practice effects: performance improves in later conditions through familiarity.
- Fatigue or boredom effects: performance declines later.
- Carry-over effects: the effect of one condition persists into the next, such as a drug not fully cleared.
- Differential carry-over: when A affects B more than B affects A; counterbalancing cannot fix this.

## Counterbalancing
- Complete counterbalancing: every possible order is used equally. With two conditions there are two orders (AB and BA); with four conditions there are 24 orders.
- Partial counterbalancing with a Latin square: each condition appears once in each position. With four conditions, four orders suffice: ABCD, BCDA, CDAB, DABC. A balanced Latin square also ensures each condition follows every other condition equally often.
- ABBA (reverse) counterbalancing: each participant receives A, B, B, A, which balances linear practice effects within a person.
- Randomised order for each participant across many trials.

## Matched pairs
A middle option: participants are matched on a relevant variable and one of each pair goes to each condition, giving some of the power of within-subjects designs without order effects.

## Choosing
| Question | Prefer |
| Condition has a lasting effect, such as training | Between-subjects |
| Few participants available, large individual differences | Within-subjects |
| Hypothesis easy to guess when all conditions are seen | Between-subjects |

## Conclusion
Within-subjects designs are more economical and powerful; between-subjects designs are cleaner when order effects or lasting changes are likely. Counterbalancing spreads order effects evenly but does not remove differential carry-over.`,
    keyPoints: ["Both designs defined with examples", "Power and individual differences explained", "Three kinds of order effects", "Complete and Latin square counterbalancing", "Differential carry-over limit", "Matched pairs as middle option"],
    pitfalls: ["Claiming counterbalancing eliminates order effects", "Forgetting to mention power"],
    module: "research-methods/2-3",
    visuals: [
      {
        kind: "compare",
        data: {
          title: "Two ways to compare conditions",
          a: { label: "Between-subjects", points: ["Different people in each condition", "No order effects", "Needs more people"], summary: "Cleaner, less powerful." },
          b: { label: "Within-subjects", points: ["Same people in all conditions", "Order effects need counterbalancing", "Each person is their own control"], summary: "Economical, more powerful." },
        },
      },
    ],
    ref: "Shaughnessy ch 7; Kerlinger ch 19",
  },
];
