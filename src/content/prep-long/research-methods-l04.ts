import type { LongQA } from "@/lib/prep/long-types";

const S = "research-methods" as const;

export const RESEARCH_METHODS_L04: LongQA[] = [
  {
    id: "rm-l04-031",
    subject: S,
    topic: "variables-hypotheses",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "mcp-entrance"],
    question: "What is an operational definition? Why is it important in psychological research?",
    plan: ["Define operational definition", "Give examples for abstract constructs", "State its importance", "Note its limits"],
    answer: `## Meaning
An operational definition defines a variable in terms of the exact procedures used to manipulate or measure it. The idea comes from the physicist Percy Bridgman's operationism, and it was adopted in psychology to make abstract constructs observable and testable.

## Examples
- Anxiety: the score on the Beck Anxiety Inventory, or heart rate during a speech task.
- Aggression in children: number of hits, kicks or pushes in a 20-minute free-play session.
- Hunger: hours since the last meal.
- Memory: number of words correctly recalled from a 20-word list after five minutes.
- Social support: total score on the Multidimensional Scale of Perceived Social Support.

## Importance
- Makes vague concepts measurable, so hypotheses can be tested.
- Allows replication, because another researcher knows exactly what was done.
- Reduces ambiguity when comparing studies.
- Helps judge construct validity: a reader can ask whether counting hits really captures aggression.
- Guides the choice of statistics through the level of measurement.

## Limits
No single operational definition captures a rich construct completely; intelligence is more than an IQ score. Different studies may define the same term differently, which explains some conflicting findings. Researchers therefore use several converging measures of the same construct.`,
    keyPoints: ["Definition based on procedures", "At least three examples", "Replication and testability", "Link to construct validity", "Limits and converging operations"],
    module: "research-methods/1-2",
    visuals: [
      {
        kind: "reveal",
        data: { prompt: "Write an operational definition of exam stress for a study of Class 12 students.", answer: "For example: the total score on a standard perceived stress scale completed one week before the board exams, or salivary cortisol measured on waking on the day of the first exam." },
      },
    ],
    ref: "Bridgman 1927; Shaughnessy ch 2",
  },
  {
    id: "rm-l04-032",
    subject: S,
    topic: "variables-hypotheses",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Describe the steps in the research process, from identifying a problem to reporting results.",
    plan: ["Introduce research as a systematic process", "Problem identification and criteria for a good problem", "Literature review and hypothesis", "Design, sampling, tools and data collection", "Analysis, interpretation and reporting", "Conclusion"],
    answer: `## Research as a process
Scientific research is a systematic, controlled and critical investigation of questions about natural phenomena, as Fred Kerlinger put it. It moves through a series of steps, each building on the last, though in practice researchers often loop back.

## The steps
- Identifying the problem: a researcher notices a gap, a contradiction or a practical need, for example "Why do many college students in India not seek help for depression?" A good problem is researchable, significant, original, feasible in time and cost, ethical, and stated clearly, often as a question about the relation between variables.
- Reviewing the literature: to learn what is known, sharpen the question, find theory and select methods and tools.
- Formulating hypotheses: testable predictions such as "Students with higher perceived stigma will report lower intention to seek help". Variables are operationally defined.
- Choosing the research design: experimental, quasi-experimental, correlational, survey, qualitative or mixed, depending on the question. A causal question needs an experiment; a question about meaning may need interviews.
- Sampling: defining the population, the sampling frame, the method and the size, using power analysis.
- Selecting or developing tools: standardised tests with good reliability and validity, adapted and translated if needed.
- Ethical approval and pilot study: approval from an ethics committee, then a small trial run to check procedures and tools.
- Data collection: following a standard procedure, training data collectors and keeping records.
- Data analysis: coding and cleaning data, descriptive statistics, then inferential tests chosen to fit the hypotheses and the level of measurement; or qualitative analysis.
- Interpretation: deciding whether hypotheses were supported, relating findings to theory and earlier studies, and considering limitations and alternative explanations.
- Reporting: writing up in APA format, presenting at conferences and publishing, so that others can evaluate and replicate the work. Results should also be shared with participants and communities where possible.

## The cycle
Findings raise new questions and lead to further research. Research is therefore a cycle of theory, hypothesis, observation and revised theory, the wheel of science described by Walter Wallace.

## Conclusion
Each step depends on the one before: a vague problem leads to vague hypotheses, poor tools and uninterpretable data. Careful planning at the start is the best guarantee of useful results.`,
    keyPoints: ["Definition of research", "Criteria for a good problem", "Review of literature and hypotheses", "Design and sampling", "Tools, ethics and pilot", "Analysis, interpretation and reporting", "Cyclical nature"],
    module: "research-methods/1-2",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "The research cycle",
          layout: "cycle",
          nodes: [
            { id: "p", label: "Problem" },
            { id: "l", label: "Literature" },
            { id: "h", label: "Hypothesis" },
            { id: "d", label: "Design and sample" },
            { id: "c", label: "Collect data" },
            { id: "a", label: "Analyse and interpret" },
            { id: "r", label: "Report", detail: "Findings raise new problems and the cycle begins again." },
          ],
        },
      },
    ],
    ref: "Kerlinger ch 1 and 2; Wallace 1971 The Logic of Science in Sociology",
  },
  {
    id: "rm-l04-033",
    subject: S,
    topic: "measurement-scales",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Explain the concepts of reliability and validity of measurement in research. How are they related?",
    plan: ["Define measurement error and true score", "Types of reliability with methods", "Types of validity", "Relationship between the two with the target analogy", "Conclusion"],
    answer: `## Measurement error
Every observed score contains the true score plus error. Classical test theory states this as X = T + E. Reliability concerns how much of the observed variation is true variation rather than random error. Validity concerns whether the measure captures the construct it claims to measure.

## Reliability: consistency
- Test-retest: the same test given twice to the same people; the correlation shows stability over time. Suits stable traits, not moods.
- Parallel or alternate forms: two equivalent versions correlated, which avoids memory effects.
- Split-half: one test split into halves (often odd and even items), correlated and corrected with the Spearman Brown formula.
- Internal consistency: Cronbach's alpha, the average of all possible split-halves; values above about 0.70 are usually acceptable for research, higher for clinical decisions. KR-20 is used for yes or no items.
- Inter-rater reliability: agreement between scorers, measured by Cohen's kappa or the intraclass correlation.

## Validity: accuracy
- Face validity: the test looks as if it measures the construct, judged by test-takers. Not a technical form of validity.
- Content validity: items represent the whole domain, judged by experts.
- Criterion validity: scores correlate with an external criterion, either now (concurrent, such as a new depression scale against a psychiatrist's diagnosis) or later (predictive, such as an aptitude test against later job performance).
- Construct validity: the test behaves as theory predicts. Convergent validity means it correlates with measures of the same construct; discriminant validity means it does not correlate highly with measures of different constructs. Donald Campbell and Donald Fiske's multitrait multimethod matrix tests both. Factor analysis checks the internal structure.

## Relationship
| Situation | Reliable? | Valid? |
| A scale that always reads 2 kg too heavy | Yes | No |
| Scores vary randomly from day to day | No | No |
| Consistent and accurate | Yes | Yes |
Reliability is necessary but not sufficient for validity: an unreliable measure cannot be valid, but a reliable one may consistently measure the wrong thing. Mathematically, the validity coefficient cannot exceed the square root of the reliability coefficient. Using the target analogy, reliability is shots grouped closely together; validity is shots grouped on the bullseye.

## In research
Low reliability adds noise, which weakens correlations (attenuation) and reduces statistical power. Low validity means the conclusions concern a different variable from the one named. Translated tools used in India need fresh reliability and validity checks, because a scale valid in one culture may not be valid in another.

## Conclusion
Reliability and validity are the two pillars of good measurement. A researcher must report both, from the original test manual and from the study's own sample.`,
    keyPoints: ["True score model", "At least four types of reliability", "Content, criterion and construct validity", "Convergent and discriminant validity", "Reliability necessary but not sufficient", "Effect on research findings"],
    pitfalls: ["Treating face validity as strong evidence", "Saying a reliable test must be valid"],
    module: "research-methods/2-2",
    visuals: [
      {
        kind: "compare",
        data: {
          title: "Reliability versus validity",
          a: { label: "Reliable but not valid", points: ["Shots tightly grouped", "Grouped away from the bullseye", "Consistent error"], summary: "Consistent, wrong." },
          b: { label: "Reliable and valid", points: ["Shots tightly grouped", "Grouped on the bullseye"], summary: "Consistent and accurate." },
        },
      },
    ],
    ref: "Anastasi and Urbina, Psychological Testing ch 4 to 6; Campbell and Fiske 1959",
  },
  {
    id: "rm-l04-034",
    subject: S,
    topic: "qualitative-methods",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the interview as a method of data collection in psychological research. Compare structured, semi-structured and unstructured interviews and describe focus groups.",
    plan: ["Define the research interview", "Structured, semi-structured and unstructured with examples", "Comparison table", "Focus groups", "Skills, biases and remedies", "Indian considerations and conclusion"],
    answer: `## Meaning
An interview is a purposeful conversation in which the researcher asks questions to obtain information about a person's experiences, attitudes, beliefs or behaviour. It allows probing, clarification and observation of non-verbal cues, and works with people who cannot read or write. Interviews are used in surveys, clinical research (diagnostic interviews) and qualitative studies.

## Types
- Structured interview: the same questions in the same order with fixed response options, read word for word. Example: the Structured Clinical Interview for DSM or the WHO Composite International Diagnostic Interview used in national surveys. Data are easy to quantify and compare, and reliability is high, but there is little room to explore unexpected answers.
- Semi-structured interview: a guide of key questions and possible probes, with flexibility in order and wording, and freedom to follow up. Example: interviewing caregivers of people with dementia about burden. It balances comparability with depth and is the standard method for IPA and thematic analysis.
- Unstructured (in-depth or narrative) interview: few planned questions, often a single opening invitation such as "Tell me about your life since the diagnosis", with the participant guiding the direction. It yields very rich data but is hard to compare across people and depends heavily on the interviewer's skill.

## Comparison
| Feature | Structured | Semi-structured | Unstructured |
| Questions | Fixed, standard | Guide with probes | Open, emergent |
| Flexibility | Low | Moderate | High |
| Data | Quantitative | Mostly qualitative | Qualitative |
| Reliability | High | Moderate | Lower |
| Depth | Low | Good | Highest |
| Interviewer skill needed | Less | More | Most |
| Typical use | Surveys, diagnosis | IPA, thematic analysis | Life histories, ethnography |

## Focus groups
A focus group is a guided discussion among about 6 to 10 people who share a relevant characteristic, led by a moderator, often with an assistant taking notes. The interaction between members is itself data: people react to, agree with and challenge each other, revealing shared norms and language. Example: focus groups with adolescent girls in a district on menstruation and school attendance, or with community health workers on how they recognise depression.
- Advantages: efficient, uses group dynamics, good for exploring community views and for developing questionnaires.
- Limits: dominant members, conformity pressure, less depth on individual experience, and difficulty discussing very private topics.

## Modes and recording
Interviews can be held face to face, by telephone or by video call. Remote interviews reduce cost and reach people in distant districts, but lose some non-verbal information and may exclude people without phones or private space. Since the COVID-19 pandemic, video interviews have become common in Indian qualitative research. Whatever the mode, the interview is audio recorded with permission, transcribed verbatim, translated where needed, and checked against the recording. Field notes record the setting, non-verbal behaviour and the interviewer's impressions.

## Interviewing skills
Building rapport, active listening, neutral and open questions, avoiding leading questions, tolerating silence, using probes ("Can you tell me more?"), summarising, and noting non-verbal cues. Interviews are recorded with consent and transcribed.

## Sources of bias
- Interviewer effects: age, gender, caste, language and status of the interviewer.
- Social desirability, especially on sensitive topics.
- Leading questions and selective note-taking.
- Recall errors.
Remedies: training, standard guides, matching interviewers to participants where appropriate, reflexive notes and recording.

## Indian considerations
Interviews in the participant's language, often with family members nearby, may change what people disclose, so privacy must be negotiated respectfully. Idioms of distress, such as speaking of "tension" or bodily weakness, need careful probing, and in hierarchical settings participants may defer to a professional interviewer.

## Conclusion
The interview is one of psychology's most versatile methods. The choice of structure depends on the aim: comparability and measurement favour structured formats, while meaning and discovery favour semi-structured and unstructured interviews and focus groups.`,
    keyPoints: ["Definition and advantages of interviews", "Three types with examples", "Comparison on flexibility, reliability and depth", "Focus groups with group interaction as data", "Interview skills", "Biases and remedies", "Indian context"],
    module: "research-methods/3-1",
    visuals: [
      {
        kind: "sort",
        data: {
          prompt: "Which interview format fits each study?",
          buckets: ["Structured", "Semi-structured", "Focus group"],
          items: [
            { text: "Estimating the prevalence of depression across 12 states", bucket: 0 },
            { text: "The lived experience of mothers of children with autism", bucket: 1 },
            { text: "How a village community talks about alcohol use", bucket: 2 },
            { text: "Checking DSM criteria for a clinical trial", bucket: 0 },
          ],
        },
      },
    ],
    ref: "Kvale and Brinkmann, InterViews; Krueger and Casey, Focus Groups; Smith et al 2009 IPA ch 4",
  },
  {
    id: "rm-l04-035",
    subject: S,
    topic: "qualitative-methods",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Write a short note on the case study method.",
    plan: ["Define case study", "Famous examples", "Strengths", "Limitations"],
    answer: `## Meaning
A case study is an in-depth investigation of a single individual, group, organisation or event, using several sources of data such as interviews, observation, records, tests and reports from others. It aims to understand the case in its real-life context, often over time.

## Famous examples
- Phineas Gage, whose personality changed after an iron rod passed through his frontal lobe in 1848.
- H.M. (Henry Molaison), whose severe amnesia after removal of parts of both medial temporal lobes showed the role of the hippocampus in forming new long-term memories, while his skill learning was spared.
- Freud's cases such as Little Hans and Anna O, which shaped psychoanalytic theory.
- Genie, a girl raised in extreme isolation, which informed the debate on a critical period for language.

## Strengths
- Rich, detailed and holistic information.
- Studies rare conditions that cannot be studied in groups or created experimentally.
- Generates hypotheses for later research and can challenge a general theory with a single counter-example.
- Useful in clinical training and practice.

## Limitations
- Findings cannot be generalised from one case.
- No control of variables, so cause cannot be established.
- Researcher bias in selecting and interpreting information.
- Reliance on memory and retrospective reports.
- Ethical issues of confidentiality, since rare cases are easy to identify.
A case study differs from a single-case experimental design, which manipulates an IV and measures behaviour repeatedly.`,
    keyPoints: ["Definition with multiple data sources", "At least two famous cases", "Strengths including rare conditions", "Limitations including generalisation", "Distinction from single-case experiments"],
    module: "research-methods/3-1",
    visuals: [
      { kind: "brainmap", data: { title: "What two famous cases taught us", focus: ["prefrontal", "hippocampus"], notes: { prefrontal: "Phineas Gage: damage changed personality and social judgement.", hippocampus: "H.M.: removal of the medial temporal lobes stopped new long-term memories forming." } } },
    ],
    ref: "Yin, Case Study Research; Corkin 2002 on H.M.; Atkinson and Hilgard ch 8",
  },
  {
    id: "rm-l04-036",
    subject: S,
    topic: "experimental-design",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Compare laboratory, field and natural experiments with examples. Which would you choose to study helping behaviour, and why?",
    plan: ["Define each type", "Classic example of each", "Compare on control, realism and ethics", "Apply to helping behaviour", "Conclusion"],
    answer: `## Laboratory experiment
The IV is manipulated in a controlled artificial setting, with random assignment. Example: John Darley and Bibb Latane's intercom study, in which students heard another participant apparently having a seizure. When they believed they were alone, about 85 percent went for help before the end of the seizure; when they believed four others could hear, only about 31 percent did.
- Strengths: high control and internal validity, precise measurement, easy replication.
- Weaknesses: artificial setting, demand characteristics, and limited generalisation.

## Field experiment
The IV is manipulated by the researcher, but in a natural setting, and participants usually do not know they are in a study. Example: Irving Piliavin's New York subway study, in which a confederate collapsed in a train carriage. Help was given in most trials, and more readily when the victim appeared ill than drunk.
- Strengths: high ecological validity, fewer demand characteristics.
- Weaknesses: less control over extraneous variables, difficulty with random assignment, ethical problems of consent and debriefing.

## Natural experiment
The IV varies naturally, not through the researcher, and its effects are studied. Example: studying children's aggression before and after television was introduced to a remote Canadian town, or comparing mental health in districts hit and not hit by a flood.
- Strengths: allows study of variables that could not ethically be manipulated, high realism.
- Weaknesses: no random assignment, so groups may differ; events cannot be repeated.

## Comparison
| Feature | Laboratory | Field | Natural |
| Who manipulates the IV | Researcher | Researcher | Nature or society |
| Setting | Artificial | Natural | Natural |
| Random assignment | Yes | Sometimes | No |
| Control | High | Moderate | Low |
| Ecological validity | Low | High | High |
| Demand characteristics | Higher | Lower | Lowest |
| Ethical issue | Deception | Lack of consent | Usually fewer |

## Choosing a method for helping behaviour
A strong programme would use more than one. A laboratory experiment could isolate a single factor, such as how the number of bystanders affects diffusion of responsibility, with control over the emergency. A field experiment, for example a staged dropped bag at a busy Ahmedabad bus station versus a quiet street, would test whether the effect holds in daily life and in Indian settings where collectivist norms might change helping. Because helping is easily distorted by the wish to appear good, the field experiment's low demand characteristics are a major advantage, provided the emergency is mild, harmless and quickly resolved, and ethics approval is obtained.

## Conclusion
The three types trade control against realism. Laboratory work shows what can cause behaviour; field and natural experiments show what does cause it in real life.`,
    keyPoints: ["Definitions of three types", "Classic example for each", "Darley and Latane figures", "Comparison on control and ecological validity", "Ethical issues of each", "Reasoned choice for helping behaviour"],
    module: "research-methods/2-3",
    visuals: [
      {
        kind: "experiment",
        data: {
          title: "Darley and Latane's seizure study",
          question: "What share of students went for help before the seizure ended?",
          unit: "%",
          conditions: [
            { label: "Believed alone", value: 85 },
            { label: "Believed one other heard", value: 62 },
            { label: "Believed four others heard", value: 31 },
          ],
          why: "The more bystanders, the more responsibility is diffused.",
        },
      },
    ],
    ref: "Darley and Latane 1968 JPSP; Piliavin, Rodin and Piliavin 1969; Williams 1986 Notel study",
  },
  {
    id: "rm-l04-037",
    subject: S,
    topic: "experimental-design",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "mcp-entrance", "ma-semester"],
    question: "\"The experiment is the most powerful method in psychology, yet much of what matters in human life lies outside the laboratory.\" Critically evaluate this statement.",
    plan: ["Unpack the two halves of the statement", "Case for the experiment: causal inference, control, cumulative science", "Case against: ecological validity, WEIRD samples, ethics, reductionism, meaning, replication", "Responses and middle ground", "Indian and cultural perspective", "Balanced conclusion"],
    answer: `## Introduction
The statement makes two claims: that the experiment is psychology's most powerful method, and that its power is limited because much of human life cannot be brought into a laboratory. Evaluating it means asking what "powerful" means, what experiments can and cannot study, and whether other methods fill the gaps.

## The case for the experiment
- Causal inference: only the experiment, through manipulation, control and random assignment, rules out rival explanations and establishes cause. Correlational studies cannot separate cause from effect or from third variables.
- Precision: variables can be measured exactly, from reaction times to brain responses.
- Replicability: standard procedures allow others to repeat and check findings.
- Theory testing: experiments test precise predictions, for example Festinger and Carlsmith's demonstration that a one dollar payment produced more attitude change than twenty dollars, which supported dissonance theory against simple reinforcement.
- Cumulative science: experiments built much of what psychology knows about memory, learning, perception and attention, and randomised controlled trials are the basis of evidence-based therapies such as CBT.
- Experiments can be taken outside the lab: field experiments and large online experiments test effects in natural conditions.

## The case against: what lies outside the laboratory
- Ecological validity: lab tasks are often simple and brief. Memorising word lists differs from remembering one's wedding. Ulric Neisser argued that memory research had learned little about memory in everyday life.
- Mundane realism: participants know they are being studied, so behaviour reflects demand characteristics and evaluation apprehension.
- Ethical limits: the most important influences on life, such as abuse, poverty, war, divorce, caste discrimination and severe illness, cannot ethically be manipulated, so they must be studied through correlational, longitudinal, natural and qualitative research.
- Sampling: most experiments use undergraduates in a few Western countries. Joseph Henrich and colleagues showed that WEIRD samples are unusual on many measures, even visual illusions such as the Muller-Lyer.
- Reductionism: isolating one variable may distort phenomena that depend on many interacting influences, such as personality or relationships.
- Meaning and subjectivity: experiences such as grief, faith or identity are better understood through interpretive methods. Humanistic and qualitative psychologists argue that people are agents who give meaning to events, not just responders to stimuli.
- Time scale: experiments usually capture short-term effects; development, ageing and long-term illness need longitudinal designs.
- Replication crisis: many celebrated experimental effects, especially in social psychology, have failed to replicate, showing that experimental form does not guarantee truth.

## Responses and middle ground
- The trade-off between internal and external validity is real, but not fixed: field experiments, natural experiments, experience sampling and virtual reality bring experimental logic closer to real life.
- Douglas Mook argued that the purpose of many lab studies is to test theory, not to mimic life; a theory confirmed in the lab can then be applied.
- Psychology increasingly uses converging evidence: an effect found in a lab experiment is checked in surveys, longitudinal studies and qualitative work.
- Large multisite and cross-cultural experiments address sampling limits.
- Mixed methods research combines experimental rigour with qualitative understanding of meaning.

## Indian and cultural perspective
Indian psychologists such as Durganand Sinha argued that methods and concepts imported from the West often failed to capture Indian social reality, for example the role of family, community and religion in decisions. Laboratory tasks may also feel unfamiliar to rural participants with less schooling, affecting performance. This supports the claim that what matters in life may lie outside the lab, while also suggesting the solution: experiments designed with local meaning, conducted in natural settings, alongside indigenous and qualitative methods.

## An illustration
Consider stress. In the laboratory, the Trier Social Stress Test reliably raises cortisol by asking people to give a speech and do mental arithmetic before judges, and it has shown how social evaluation drives the stress response. Yet the stress of caring for a parent with dementia for ten years, or of losing a job, cannot be reproduced in a 20-minute task. Longitudinal studies of caregivers and qualitative accounts of their days add what the laboratory cannot. Each method answers part of the question.

## Conclusion
The statement is largely correct. For causal questions the experiment is unmatched, and that is a real form of power. But power to establish cause is not the same as power to understand a life. Psychology needs a toolbox: experiments for cause, correlational and longitudinal studies for real-world variables, and qualitative methods for meaning. The best research programmes move between them, so that what is learned in the laboratory is tested against what happens outside it.`,
    keyPoints: ["Analyses both halves of the statement", "Causal inference as the experiment's core strength", "At least five limitations with examples", "Ethical limits on manipulation", "WEIRD sampling problem", "Mook's defence of artificiality", "Converging methods and mixed methods", "Balanced conclusion with Indian perspective"],
    pitfalls: ["Writing only advantages and disadvantages without a judgement", "Ignoring the quote's wording"],
    module: "research-methods/2-3",
    visuals: [
      {
        kind: "compare",
        data: {
          title: "Power of the experiment versus reach of life",
          a: { label: "What experiments do best", points: ["Show cause and effect", "Precise measurement", "Test theory predictions", "Replicable procedures"], summary: "Unmatched for causal questions." },
          b: { label: "What lies outside", points: ["Abuse, poverty, illness cannot be manipulated", "Long-term development", "Meaning and lived experience", "Non-WEIRD populations"], summary: "Needs other methods." },
        },
      },
    ],
    ref: "Mook 1983 American Psychologist; Neisser 1978; Henrich, Heine and Norenzayan 2010; Sinha 1986 Psychology in a Third World Country",
  },
  {
    id: "rm-l04-038",
    subject: S,
    topic: "experimental-design",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "md-psychiatry", "mcp-entrance"],
    question: "Write short notes on placebo control and the double-blind procedure.",
    plan: ["Define placebo and placebo effect", "Placebo control group", "Single and double blind", "Ethical issues"],
    answer: `## Placebo and placebo effect
A placebo is an inactive treatment, such as a sugar pill or sham procedure, designed to look like the real one. The placebo effect is improvement that results from the person's expectations and the treatment context rather than from the active ingredient. In depression and pain trials, placebo response can be large: Henry Beecher's early reports estimated that about a third of patients improved on placebo.

## Placebo control
A placebo control group receives the placebo instead of the active treatment. Because both groups share expectations, attention and the ritual of treatment, the difference between them shows the specific effect of the treatment. In psychotherapy research, an attention placebo or active control, such as supportive counselling, plays a similar role.

## Blinding
- Single-blind: participants do not know whether they receive the treatment or placebo, which controls their expectations.
- Double-blind: neither participants nor the researchers who give treatment and rate outcomes know the allocation, which also controls experimenter expectancy and rating bias. Allocation is held by a third party until analysis.
- Triple-blind: the data analysts are also blind.
Blinding can fail if side effects reveal who received an active drug, so trials sometimes check whether participants guessed their group.

## Ethical issues
Placebo use requires informed consent explaining that one may receive an inactive treatment. When an effective treatment exists for a serious condition, giving placebo is ethically questioned, so new treatments are often compared with the existing best treatment.`,
    keyPoints: ["Placebo and placebo effect defined", "Logic of a placebo control group", "Single, double and triple blind", "Blinding failure", "Ethical concerns"],
    module: "research-methods/2-3",
    visuals: [
      { kind: "reveal", data: { prompt: "A drug group improves by 12 points and a placebo group by 8 points. What is the specific drug effect?", answer: "About 4 points. The 8 points shared by both groups come from expectation, attention, natural recovery and regression to the mean." } },
    ],
    ref: "Beecher 1955 JAMA; Kirsch 2010 on placebo in depression trials",
  },
  {
    id: "rm-l04-039",
    subject: S,
    topic: "validity-threats",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Explain statistical conclusion validity and construct validity as described by Cook and Campbell. Give the main threats to each.",
    plan: ["Place them among the four validities", "Statistical conclusion validity and threats", "Construct validity and threats", "Example applying both", "Conclusion"],
    answer: `## The four validities
Thomas Cook and Donald Campbell expanded the classic internal and external validity into four types, each asking a different question about a study's conclusion.
| Validity | Question |
| Statistical conclusion | Is there really a relationship between the variables? |
| Internal | Is the relationship causal? |
| Construct | Are the variables what we say they are? |
| External | Does it generalise to other people, settings and times? |

## Statistical conclusion validity
This is the validity of inferences about whether the IV and DV covary and how strongly. It concerns the correct use of statistics.
Threats:
- Low statistical power from small samples or small effects, leading to Type II errors (missing a real effect).
- Violated assumptions of tests, such as non-normality or unequal variances.
- Fishing and error rate problem: running many tests inflates the chance of a Type I error unless corrected (for example with Bonferroni).
- Unreliable measures, which add noise and reduce power.
- Unreliable treatment implementation, where the treatment is delivered differently to different people.
- Random irrelevances in the setting and heterogeneous participants, which increase error variance.
- Restriction of range.

## Construct validity (of a study)
This is the extent to which the operations used (the manipulation and measures) represent the theoretical constructs they are meant to. It applies to causes, effects, people and settings.
Threats:
- Inadequate explication of constructs: a vague definition of the construct.
- Mono-operation bias: using a single measure or a single version of the treatment.
- Mono-method bias: all measures use the same method, such as self-report.
- Construct confounding: the manipulation changes more than intended. A "frustration" manipulation may also cause embarrassment.
- Hypothesis guessing and demand characteristics.
- Evaluation apprehension.
- Experimenter expectancies.
- Novelty and disruption effects.
- Reactivity to the assessment itself.

## Example
A researcher claims that "social exclusion increases aggression" because students left out of an online ball-tossing game (Cyberball) later gave more hot sauce to a stranger. Statistical conclusion validity asks whether the sample was large enough and the analysis appropriate. Construct validity asks whether Cyberball exclusion represents real social exclusion and whether allocating hot sauce represents aggression, and whether participants guessed the hypothesis. Using several measures of aggression and several manipulations of exclusion would improve construct validity.

## Conclusion
A study can be internally valid yet fail on statistical or construct grounds. Good design addresses all four validities, prioritising according to the research question.`,
    keyPoints: ["Four validities with their questions", "Definition of statistical conclusion validity", "At least four statistical threats including low power", "Definition of construct validity of a study", "Mono-operation and mono-method bias", "Worked example"],
    module: "research-methods/2-4",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "Four questions about one conclusion",
          layout: "chain",
          nodes: [
            { id: "s", label: "Statistical", detail: "Do the variables really covary?" },
            { id: "i", label: "Internal", detail: "Is the link causal?" },
            { id: "c", label: "Construct", detail: "Are these the constructs we named?" },
            { id: "e", label: "External", detail: "Does it generalise?" },
          ],
        },
      },
    ],
    ref: "Cook and Campbell 1979 Quasi-Experimentation; Shadish, Cook and Campbell 2002 ch 2 and 3",
  },
  {
    id: "rm-l04-040",
    subject: S,
    topic: "correlational-design",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "A survey of 800 Indian adolescents finds a correlation of r = 0.30 between daily hours of social media use and depressive symptoms. A newspaper reports: \"Social media causes depression in teenagers.\" Evaluate this claim and design a study that could test the causal question better.",
    plan: ["Interpret r = 0.30 and r squared", "Problems with the causal claim: direction, third variables, measurement, sampling", "What the evidence internationally shows", "Better designs: longitudinal panel, experiment, within-person analysis", "A concrete study design with ethics", "Conclusion"],
    answer: `## What the finding shows
A correlation of 0.30 is a modest positive association: adolescents who report more social media use tend to report somewhat more depressive symptoms. r squared is 0.09, so only about 9 percent of the variation in symptoms is shared with social media use; 91 percent is related to other things. With 800 participants, the correlation is statistically significant, but significance is not the same as importance or cause.

## Why the headline goes too far
- Direction: depressed adolescents may withdraw from friends and spend more time scrolling, so depression may cause social media use rather than the reverse.
- Third variables: loneliness, poor sleep, family conflict, bullying, academic stress or low physical activity could increase both. Sleep is a strong candidate, since late-night phone use and short sleep each predict low mood.
- Bidirectional and cyclical effects: each may feed the other.
- Measurement: self-reported hours are inaccurate, and "social media" includes very different activities, from passive scrolling to chatting with close friends. Depressive symptoms measured by a single questionnaire are not a diagnosis.
- Sampling: if the sample was urban, English-speaking and from private schools, it cannot represent all Indian adolescents.
- Common method bias: both measures came from the same self-report questionnaire at the same time, which inflates correlations.
- Average versus individual: an average association may hide that some adolescents are harmed and others helped.

## What wider evidence shows
Large international studies find small average associations between digital technology use and adolescent wellbeing. Amy Orben and Andrew Przybylski's analysis of very large datasets found the association to be about as small as that between wellbeing and eating potatoes, though critics such as Jean Twenge argue that heavy use, especially among girls, shows larger effects. Longitudinal studies suggest effects in both directions and differences between individuals. The honest conclusion is that the evidence is mixed and the effect, if causal, is probably small on average.

## A better study
Research question: Does more time on social media lead to an increase in depressive symptoms over time, after controlling for prior symptoms and key third variables?
Design: a three-wave longitudinal panel study, with an embedded experiment.
- Sample: 1,500 adolescents aged 13 to 16, selected by stratified cluster sampling of government, aided and private schools in urban and rural areas of two states, in local languages.
- Measures at each wave, six months apart: objective screen time from phone usage logs (with consent), type of use (active or passive), depressive symptoms on a validated scale such as the PHQ-A, sleep, loneliness, bullying, family conflict, academic stress and physical activity.
- Analysis: a random-intercept cross-lagged panel model, which separates stable differences between adolescents from changes within each adolescent. If an adolescent's increase in use at wave 1 predicts a later rise in their own symptoms, beyond prior symptoms and covariates, this supports a causal direction from use to symptoms. The reverse path is tested at the same time.
- Embedded experiment: a randomised subsample of volunteers is assigned either to limit social media to 30 minutes a day for three weeks (with app timers) or to continue as usual, with mood measured before and after. This tests causation directly in the short term.
- Qualitative strand: interviews with a subsample on how they use social media and how it affects them.

## Ethics
Consent from parents and assent from adolescents, protection of phone data, a clear plan for referral when symptoms or suicidal ideas are high, and no penalty for refusing.

## Conclusion
The newspaper confuses correlation with causation. The finding is consistent with several causal stories. A longitudinal design with within-person analysis, objective measures and an experimental component can test which story fits, and is likely to show a more nuanced picture than the headline.`,
    keyPoints: ["Correct interpretation of r and r squared", "Directionality problem", "At least three plausible third variables", "Measurement and sampling issues", "Reference to mixed wider evidence", "Longitudinal cross-lagged design with within-person analysis", "Embedded experiment", "Ethics and nuanced conclusion"],
    pitfalls: ["Accepting or rejecting the claim without reasons", "Proposing an unethical experiment that induces depression"],
    module: "research-methods/2-6",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "Three explanations for one correlation",
          layout: "tree",
          nodes: [
            { id: "r", label: "r = 0.30 between use and symptoms" },
            { id: "a", label: "Use causes symptoms", parent: "r", detail: "Comparison, cyberbullying, displaced sleep." },
            { id: "b", label: "Symptoms cause use", parent: "r", detail: "Withdrawn teenagers scroll more." },
            { id: "c", label: "A third variable causes both", parent: "r", detail: "Poor sleep, loneliness, family conflict." },
          ],
        },
      },
      {
        kind: "guess",
        data: { prompt: "With r = 0.30, what percentage of the variation in depressive symptoms is shared with social media use?", min: 0, max: 50, step: 1, unit: "%", answer: [9, 9], reveal: "r squared = 0.30 x 0.30 = 0.09, so 9 percent." },
      },
    ],
    ref: "Orben and Przybylski 2019 Nature Human Behaviour; Twenge et al 2018; Hamaker et al 2015 RI-CLPM",
  },
];
