import type { LongQA } from "@/lib/prep/long-types";

const S = "research-methods" as const;

export const RESEARCH_METHODS_L02: LongQA[] = [
  {
    id: "rm-l02-011",
    subject: S,
    topic: "quasi-experimental",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What are quasi-experimental designs? Describe the non-equivalent control group design, the interrupted time series design and the regression discontinuity design, with their threats to validity.",
    plan: ["Define quasi-experiment and why it is needed", "Non-equivalent control group design and its threats", "Interrupted time series and its threats", "Regression discontinuity", "Comparison with true experiments", "Conclusion with an Indian policy example"],
    answer: `## Meaning
A quasi-experiment has an intervention and an outcome measure, like a true experiment, but participants are not randomly assigned to conditions. The term was popularised by Donald Campbell. Quasi-experiments are used when random assignment is impossible, unethical or impractical: a new curriculum introduced in some schools, a law passed in one state, or a therapy offered only in one hospital. Because groups may differ before the intervention, the researcher must work harder to rule out alternative explanations.

## Non-equivalent control group design
Two intact groups, such as two sections of Class 9, are pretested; one receives the intervention, and both are post-tested.
| Group | Pretest | Treatment | Post-test |
| Treatment school | O1 | X | O2 |
| Comparison school | O1 | none | O2 |
The pretest lets the researcher check how similar the groups were at the start, and the comparison group controls history, maturation and testing that affect both groups alike.
Main threats:
- Selection: the groups may differ in ability, motivation or socioeconomic status.
- Selection by maturation: one group may be improving faster anyway, such as an elite school.
- Selection by history: an event affects only one school, such as a change of principal.
- Regression: if one group was chosen because of extreme scores.
Remedies include matching schools on key variables, using several pretests, statistical adjustment with analysis of covariance, and propensity score matching.

## Interrupted time series design
A single group is measured many times before and after an intervention, and the researcher looks for a change in level or slope at the point of intervention.
O1 O2 O3 O4 O5 X O6 O7 O8 O9 O10
Example: monthly suicide deaths by pesticide before and after a ban on highly toxic pesticides. Sri Lanka's bans on such pesticides were followed by a large fall in suicide deaths without a matching rise in other methods.
Strengths: the long baseline shows the normal trend, so maturation and regression can be judged. A single pretest cannot do this.
Main threats:
- History: another event at the same time, such as a new helpline.
- Instrumentation: a change in how deaths were recorded.
- Seasonal cycles that happen to coincide.
Adding a control series, such as a neighbouring region without the ban, strengthens the design.

## Regression discontinuity design
People are assigned to treatment strictly by a cut-off on a measured score, such as students scoring below 40 on an entrance test receiving remedial classes. Outcomes are plotted against the assignment score. If the programme works, there is a jump (discontinuity) in the regression line exactly at the cut-off. Because assignment is fully known, this design gives causal estimates close to those of a randomised experiment for people near the cut-off. Its limits are that it needs large samples and strict adherence to the cut-off, and the estimate applies mainly near the cut-off.

## Other quasi-experimental designs
- Untreated control design with switching replications: the comparison group receives the intervention later, so the effect should appear twice, once in each group at the time it is treated. This guards against history.
- Non-equivalent dependent variables: measuring an outcome the intervention should not change. If a reading programme raises reading but not arithmetic scores, general maturation or motivation is less likely.
- Pretest and post-test with removed treatment, which resembles a reversal design.
- Cohort designs, comparing successive batches of students in the same institution, where adjacent cohorts are often similar in background.

## Comparison
| Feature | True experiment | Quasi-experiment |
| Random assignment | Yes | No |
| Control over IV | Full | Often partial |
| Internal validity | High | Moderate, depends on design |
| External validity | Often lower | Often higher, real settings |
| Typical setting | Laboratory, randomised trial | Schools, hospitals, policy |

## Conclusion
Quasi-experiments let psychologists evaluate real programmes, such as school mental health curricula under India's Ayushman Bharat school health initiative, where randomisation is rarely possible. Their value depends on adding design features (pretests, multiple measurements, comparison groups, known assignment rules) that rule out specific threats. Campbell's advice was to name each plausible threat and add a design element to address it.`,
    keyPoints: ["Defines quasi-experiment by lack of random assignment", "Non-equivalent groups design with notation", "Selection and its interactions as main threats", "Interrupted time series with example", "Regression discontinuity logic", "Comparison with true experiments", "Remedies such as matching or a control series"],
    pitfalls: ["Calling any field study a quasi-experiment", "Ignoring selection interactions"],
    module: "research-methods/2-5",
    visuals: [
      {
        kind: "compare",
        data: {
          title: "One pretest versus a time series",
          a: { label: "One-group pretest and post-test", points: ["A single measure before and after", "Cannot see the normal trend", "Maturation and regression look like an effect"], summary: "Weak design." },
          b: { label: "Interrupted time series", points: ["Many measures before and after", "A long baseline shows the trend", "A jump at the intervention point is convincing"], summary: "Much stronger, still open to history." },
        },
      },
    ],
    ref: "Campbell and Stanley 1963; Shadish, Cook and Campbell 2002 ch 4 to 7; Gunnell et al 2007 on Sri Lanka pesticide bans",
  },
  {
    id: "rm-l02-012",
    subject: S,
    topic: "single-case",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Describe single-case experimental designs. Explain the ABAB, multiple baseline and changing criterion designs with clinical examples.",
    plan: ["Define single-case design and its roots", "Baseline logic and visual analysis", "ABAB reversal design", "Multiple baseline designs", "Changing criterion design", "Strengths, limits and conclusion"],
    answer: `## Meaning
Single-case (small-n) experimental designs study one person, or a few, intensively over time, with repeated measurement of a target behaviour and planned changes in conditions. They come from Skinner's experimental analysis of behaviour and are widely used in behaviour therapy, special education and clinical psychology, where a clinician needs to know whether a treatment works for this particular client. They differ from a case study because the IV is deliberately manipulated and the behaviour is measured repeatedly.

## Baseline logic
The baseline (phase A) is a period of repeated measurement before treatment. It should be stable, so that it predicts what would happen without intervention. The treatment phase (B) is then introduced. Causal inference rests on prediction, verification and replication: a change appears when treatment begins and disappears or recurs as conditions change. Results are judged mainly by visual analysis of the graph, looking at level, trend, variability and how quickly the change occurs, often supported by statistics such as non-overlap of all pairs.

## ABAB (reversal or withdrawal) design
Baseline, treatment, withdrawal of treatment, and treatment again. Example: a child with intellectual disability hits his head. During baseline the self-hitting is counted; then attention is given for appropriate play (B); attention is withdrawn (A); then reinstated (B). If self-hitting falls in each B phase and rises in each A phase, the treatment is the likely cause.
Limits: ethically difficult to withdraw a helpful treatment, and impossible when the behaviour cannot reverse, such as a learned skill.

## Multiple baseline designs
Baselines are recorded for several behaviours, settings or people at the same time, and treatment is introduced to each at a different time.
- Across behaviours: a socially anxious adult works first on eye contact, then on starting conversations, then on asking questions.
- Across settings: a child's tantrums at home, then in school.
- Across participants: three children with autism start a communication programme in staggered weeks.
If each behaviour changes only when it is treated, history and maturation are unlikely explanations. No withdrawal is required, which makes this design ethically preferable. It assumes the behaviours are independent.

## Changing criterion design
After a baseline, treatment is applied in steps, each with a stricter criterion, such as reducing cigarettes from 20 to 15, 10 and 5 per day, with rewards for meeting each target. If behaviour tracks each new criterion closely, the treatment is shown to be controlling it. It suits behaviours that change gradually.

## Strengths and limits
| Strengths | Limits |
| Tailored to the individual client | Generalisation to others is uncertain |
| Clinically practical, few resources | Unstable baselines make interpretation hard |
| Shows change over time, not just an average | Visual analysis can be subjective |
| Useful for rare conditions | Reversal raises ethical problems |

## Conclusion
Single-case designs bridge practice and research. They let a clinician in an Indian hospital or a special school test a behavioural plan rigorously with one child, and a series of such replications across clients builds external validity.`,
    keyPoints: ["Definition with repeated measurement and manipulation", "Role of a stable baseline", "ABAB with example and ethical limit", "Three kinds of multiple baseline", "Changing criterion with example", "Visual analysis criteria", "Balanced strengths and limits"],
    pitfalls: ["Equating it with a case study", "Forgetting that multiple baseline avoids withdrawal"],
    module: "research-methods/2-5",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "ABAB design",
          layout: "chain",
          nodes: [
            { id: "a1", label: "A: baseline", detail: "Self-hitting counted daily until stable." },
            { id: "b1", label: "B: treatment", detail: "Attention for appropriate play; hitting falls." },
            { id: "a2", label: "A: withdrawal", detail: "Treatment removed; hitting rises again." },
            { id: "b2", label: "B: treatment again", detail: "Hitting falls again, replicating the effect." },
          ],
        },
      },
    ],
    ref: "Barlow, Nock and Hersen, Single Case Experimental Designs; Kazdin, Single-Case Research Designs",
  },
  {
    id: "rm-l02-013",
    subject: S,
    topic: "developmental-designs",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Compare and contrast cross-sectional, longitudinal and sequential research designs.",
    plan: ["State the problem of studying change with age", "Cross-sectional design", "Longitudinal design", "Sequential design", "Comparison table", "Conclusion with examples"],
    answer: `## The problem
Developmental research asks how people change with age. Age itself cannot be manipulated, so researchers compare people of different ages or follow the same people over time. Three influences are tangled: age (maturation), cohort (the generation one is born into) and time of measurement (the historical moment).

## Cross-sectional design
People of different ages are studied at one point in time, for example 20, 40, 60 and 80-year-olds tested on memory in 2026.
- Advantages: quick, cheap, no dropout, results available immediately.
- Disadvantages: age differences are confounded with cohort differences. Older adults in India today had less schooling and nutrition in childhood than young adults, so lower test scores may reflect cohort rather than ageing. It shows age differences, not change within individuals, and says nothing about stability of individual differences.
- Classic issue: early cross-sectional studies suggested intelligence declines from early adulthood, which later work showed was exaggerated.

## Longitudinal design
The same people are measured repeatedly over a long period, for example a group of infants followed to adulthood.
- Advantages: shows real change within individuals, individual differences in growth, and links between early and later events. Famous examples include the Dunedin study in New Zealand, Emmy Werner's Kauai study of resilience, Terman's study of gifted children, and the Grant study of Harvard men.
- Disadvantages: expensive, slow, selective attrition (those who drop out often differ), practice effects from repeated testing, outdated measures, and confounding of age with time of measurement, since a single cohort experiences particular historical events.

## Sequential (cross-sequential) design
Several cohorts are followed longitudinally, combining both approaches. K. Warner Schaie's Seattle Longitudinal Study began in 1956 and added new cohorts every seven years. It showed that many abilities stay stable until the sixties, and that cohort differences are large: later-born cohorts score higher on inductive reasoning.
- Advantages: separates age, cohort and time effects; checks whether change seen in one cohort holds in others.
- Disadvantages: complex, costly and still affected by attrition.

## Comparison
| Feature | Cross-sectional | Longitudinal | Sequential |
| Who is studied | Different age groups once | One group over time | Several cohorts over time |
| Time needed | Short | Long | Long |
| Shows individual change | No | Yes | Yes |
| Main confound | Age with cohort | Age with time of measurement | Reduced |
| Attrition | None | High | High |
| Cost | Low | High | Highest |

## Conclusion
Cross-sectional studies describe age differences quickly, longitudinal studies reveal individual change, and sequential designs disentangle age from cohort. In India, the Young Lives study, which followed children in Andhra Pradesh and Telangana from 2002, shows how longitudinal data can track poverty, schooling and wellbeing together.`,
    keyPoints: ["Age, cohort and time of measurement distinguished", "Cross-sectional advantages and cohort confound", "Longitudinal advantages and attrition", "Sequential design with Schaie", "Comparison table", "At least one named longitudinal study"],
    pitfalls: ["Saying longitudinal studies have no confound", "Not defining cohort effect"],
    module: "research-methods/2-5",
    visuals: [
      {
        kind: "compare",
        data: {
          title: "Two snapshots of ageing",
          a: { label: "Cross-sectional", points: ["Many ages, one time", "Fast and cheap", "Age confounded with cohort"], summary: "Shows age differences." },
          b: { label: "Longitudinal", points: ["One cohort, many times", "Slow and costly, dropout", "Shows change within people"], summary: "Shows age changes." },
        },
      },
    ],
    ref: "Schaie 2005 Seattle Longitudinal Study; Santrock Life-Span Development ch 1; Young Lives India",
  },
  {
    id: "rm-l02-014",
    subject: S,
    topic: "developmental-designs",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on cohort effects.",
    plan: ["Define cohort and cohort effect", "Examples", "Why they matter for design", "How to control them"],
    answer: `## Definition
A cohort is a group of people born around the same time who therefore share historical and cultural experiences. A cohort effect is a difference between age groups that is caused by their different generational experiences rather than by age or development itself.

## Examples
- Older Indian adults today grew up with less schooling, poorer nutrition and no television, so they may score lower on vocabulary or reasoning tests than younger adults, even if their abilities have not declined with age.
- The Flynn effect: average IQ scores rose by roughly three points per decade across the twentieth century in many countries, so each new cohort outperforms earlier ones on old norms.
- Attitudes to marriage, gender roles and mental health help-seeking differ sharply between people who grew up before and after economic liberalisation in 1991.
- Children growing up with smartphones may differ in attention and social habits for reasons unrelated to age.

## Why it matters
In a cross-sectional design, age and cohort are completely confounded: we cannot tell whether a difference between 25 and 70-year-olds is due to ageing or to growing up in different decades. This led early studies to overstate intellectual decline with age.

## Control
- Longitudinal designs follow one cohort, removing the cohort difference.
- Sequential designs, such as Schaie's Seattle Longitudinal Study, follow several cohorts and separate age, cohort and time of measurement.
- Matching groups on education and health reduces some cohort differences.`,
    keyPoints: ["Definition of cohort and cohort effect", "At least two examples", "Flynn effect", "Confounding with age in cross-sectional designs", "Sequential designs as remedy"],
    module: "research-methods/2-5",
    ref: "Flynn 1987; Schaie 2005; Santrock ch 1",
  },
  {
    id: "rm-l02-015",
    subject: S,
    topic: "correlational-design",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Discuss correlational research. Why does correlation not imply causation, and what designs help move from correlation towards causal inference?",
    plan: ["Define correlational research and what r shows", "Uses and strengths", "Directionality and third-variable problems with examples", "Designs that strengthen inference", "Conclusion"],
    answer: `## Meaning
Correlational research measures two or more variables as they naturally occur, without manipulation, and examines how strongly and in what direction they are related. The correlation coefficient r ranges from minus 1 to plus 1. A positive r means high scores on one variable go with high scores on the other (hours of study and marks); a negative r means high goes with low (stress and sleep quality); r near 0 means no linear relationship. The square of r is the proportion of variance shared, so r of 0.5 means 25 percent shared variance.

## Uses and strengths
- Studying variables that cannot be manipulated, such as gender, trauma, poverty or brain injury.
- Prediction: entrance scores predict later academic performance even without a causal model.
- Establishing reliability and validity of tests.
- Generating hypotheses for later experiments.
- High ecological validity, since behaviour is studied as it occurs.

## Why correlation is not causation
- Directionality problem: if social media use correlates with depression in adolescents, social media may cause low mood, or depressed teenagers may spend more time online.
- Third-variable problem: a hidden variable causes both. Ice cream sales and drowning deaths rise together because of summer heat. Children who are read to at home do better at school, but parental education may cause both.
- Spurious and chance correlations, especially when many variables are tested.
- Restricted range and non-linear relations can hide real associations: the Yerkes Dodson inverted U gives r near 0 although arousal strongly affects performance.

## Designs that strengthen inference
- Partial correlation and multiple regression: statistically holding a suspected third variable constant.
- Cross-lagged panel design: measuring both variables at two times. If TV violence at age 8 predicts aggression at 18 more strongly than aggression at 8 predicts TV viewing at 18, as Leonard Eron and Rowell Huesmann found, the direction is clarified.
- Longitudinal designs establish temporal order.
- Twin and adoption studies separate genetic and environmental causes.
- Natural experiments and instrumental variables.
- Mediation and structural equation models test a proposed causal chain, though they still rest on assumptions.
- Converging evidence from experiments when ethics allow.

## Conclusion
Correlational research is indispensable for studying real-life variables and for prediction, but causal claims need temporal order, control of third variables and, ideally, experimental support. A student should always ask: could it run the other way, and what else could cause both?`,
    keyPoints: ["Definition and meaning of r and r squared", "Strengths and uses", "Directionality problem with example", "Third-variable problem with example", "Non-linear relations", "Cross-lagged panel design", "Statistical control and longitudinal designs"],
    pitfalls: ["Saying a strong correlation proves cause", "Confusing a negative correlation with no relationship"],
    module: "research-methods/2-6",
    visuals: [
      {
        kind: "flow",
        data: {
          title: "The third-variable problem",
          layout: "tree",
          nodes: [
            { id: "h", label: "Hot weather", detail: "The hidden common cause." },
            { id: "i", label: "Ice cream sales rise", parent: "h" },
            { id: "d", label: "Drownings rise", parent: "h" },
          ],
          caption: "Ice cream and drowning correlate, but neither causes the other.",
        },
      },
    ],
    ref: "Shaughnessy ch 5; Eron, Huesmann et al 1972 cross-lagged TV violence study; Atkinson and Hilgard ch 1",
  },
  {
    id: "rm-l02-016",
    subject: S,
    topic: "correlational-design",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss survey research. Describe the steps in constructing a questionnaire and the response biases that threaten survey data.",
    plan: ["Define survey and its purposes", "Modes of administration", "Steps in questionnaire construction", "Item writing rules", "Response biases and remedies", "Indian issues and conclusion"],
    answer: `## Meaning
A survey collects information from a sample of people through questions, in order to describe the attitudes, beliefs, behaviours or characteristics of a population and to study relationships between them. Surveys range from national epidemiological studies such as the National Mental Health Survey of India to small attitude studies in a college. Their value depends on two things: who is asked (sampling) and how they are asked (measurement).

## Modes of administration
| Mode | Advantages | Disadvantages |
| Face-to-face interview | High response, can explain and probe, suits low literacy | Costly, interviewer bias |
| Telephone | Fast, cheaper | Short questions only, declining response rates |
| Mailed or self-administered | Cheap, anonymous | Low response, needs literacy |
| Online | Very cheap and fast | Excludes people without internet, self-selection |

## Steps in questionnaire construction
- Define the constructs and objectives clearly, from theory and literature.
- Decide the format: structured or open, the response scale (Likert, yes or no, rating), and the mode.
- Write an item pool, larger than needed.
- Have experts review items for content validity and clarity.
- Translate and back-translate if used in another language, and check cultural meaning.
- Pilot on a small sample and use cognitive interviewing (asking respondents what they understood).
- Carry out item analysis: item-total correlations, internal consistency (Cronbach's alpha), factor analysis.
- Establish reliability and validity, then finalise layout, instructions and order.

## Rules for writing items
- Use simple, short, familiar words.
- Avoid double-barrelled items: "Do you find your teachers helpful and friendly?" asks two things.
- Avoid leading or loaded questions: "Don't you agree that yoga reduces stress?"
- Avoid double negatives and vague words such as "often" without a reference period.
- Avoid assumptions: "How often do you drink alcohol?" assumes the person drinks; use a filter question first.
- Use balanced response options and include "don't know" when appropriate.
- Order questions from general and easy to specific and sensitive, keeping demographic and sensitive items late.

## Response biases
- Social desirability: answering in a way that looks good, especially on sensitive topics such as caste attitudes, substance use or sexuality. Remedies: anonymity, self-administration, neutral wording, a social desirability scale such as Marlowe Crowne, and indirect or randomised response techniques.
- Acquiescence: tendency to agree regardless of content, common with low education or deference to the interviewer. Remedy: balanced keying with some reverse-scored items.
- Extreme and central tendency responding.
- Order and context effects: earlier questions change answers to later ones.
- Recall bias: errors in remembering past behaviour, reduced by short reference periods and diaries.
- Interviewer effects: the age, gender or caste of the interviewer changes answers.
- Non-response bias: those who reply differ from those who do not.

## Cross-sectional and panel surveys
A cross-sectional survey measures a sample once and describes the population at one time. Successive independent samples, such as repeated national surveys, show how a population changes. A panel survey questions the same people repeatedly, showing change within individuals, but suffers attrition and panel conditioning. Surveys are correlational, so they describe and predict but cannot by themselves establish cause.

## Indian issues
Multiple languages, varied literacy, collective decision-making in households (respondents may want family members present), and suspicion of written forms mean that interviewer-administered surveys, pictorial response scales and careful translation are often needed. Concepts such as "depression" may be expressed as "tension" or bodily complaints, so items must match local idioms of distress.

## Conclusion
A survey is only as good as its sample and its questions. Careful construction, piloting, translation and checks for response bias turn a list of questions into a valid measuring tool.`,
    keyPoints: ["Definition and purposes of survey", "Modes compared", "Ordered steps of construction including piloting", "At least five item-writing rules with examples", "Social desirability and acquiescence with remedies", "Non-response bias", "Indian adaptation issues"],
    pitfalls: ["Listing biases without remedies", "Skipping pilot testing and translation"],
    module: "research-methods/2-6",
    visuals: [
      {
        kind: "sort",
        data: {
          prompt: "What is wrong with each item?",
          buckets: ["Double-barrelled", "Leading", "Assumes behaviour"],
          items: [
            { text: "Are your parents caring and strict?", bucket: 0 },
            { text: "Most experts agree meditation helps. Do you agree?", bucket: 1 },
            { text: "How many cigarettes do you smoke a day?", bucket: 2, why: "Needs a filter question first." },
            { text: "Is your hostel clean and safe?", bucket: 0 },
          ],
        },
      },
    ],
    ref: "Shaughnessy ch 5; Dillman, Mail and Internet Surveys; Paulhus 1991 on response styles",
  },
  {
    id: "rm-l02-017",
    subject: S,
    topic: "qualitative-methods",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the nature of qualitative research in psychology. Describe its major approaches and the criteria used to judge its quality.",
    plan: ["Define qualitative research and its assumptions", "Contrast with quantitative research", "Main approaches: phenomenology and IPA, grounded theory, ethnography, narrative, discourse analysis, thematic analysis", "Data collection and sampling", "Quality criteria", "Critique, Indian use and conclusion"],
    answer: `## Meaning
Qualitative research studies experience, meaning and process through words, images and observations rather than numbers. It asks questions such as "What is it like to care for a family member with schizophrenia?" or "How do young women in a city negotiate marriage and career?" Its roots lie in phenomenology, symbolic interactionism and hermeneutics, and it grew in psychology from the 1980s as a reaction to the narrowness of purely quantitative work.

## Core assumptions
- Reality as experienced is constructed and interpreted, not simply observed.
- The aim is understanding (verstehen) rather than prediction and control.
- Context matters: behaviour is studied in its natural setting.
- The researcher is the main instrument and must reflect on their own role (reflexivity).
- Reasoning is mainly inductive: themes and theory emerge from the data.

## Contrast with quantitative research
| Point | Quantitative | Qualitative |
| Aim | Test hypotheses, measure, generalise | Explore meaning and process |
| Data | Numbers | Words, texts, images |
| Sampling | Large, random | Small, purposive, until saturation |
| Researcher | Detached | Reflexive participant |
| Analysis | Statistical | Interpretive, thematic |
| Output | Effects and relationships | Themes, models, rich description |

## Major approaches
- Phenomenology and interpretative phenomenological analysis (IPA): developed by Jonathan Smith, IPA explores how individuals make sense of major life experiences. It uses small, homogeneous samples (often 3 to 10), semi-structured interviews and a double hermeneutic: the researcher makes sense of the participant making sense of their experience. Example: the lived experience of people recovering from a first episode of psychosis.
- Grounded theory: developed by Barney Glaser and Anselm Strauss in 1967 to build theory from data. Data collection and analysis happen together; open, axial and selective coding, constant comparison, memo-writing and theoretical sampling continue until theoretical saturation. Kathy Charmaz developed a constructivist version.
- Ethnography: long-term immersion in a community through participant observation, interviews and documents, as in anthropological studies of healing at temples and dargahs in India.
- Narrative analysis: studies the stories people tell about their lives, focusing on structure, plot and identity.
- Discourse analysis: examines how language constructs social reality and identity, for example how "mental illness" is talked about in Indian media. It treats talk as action rather than a window into the mind.
- Thematic analysis: a flexible method, set out by Virginia Braun and Victoria Clarke, for identifying patterns of meaning across a dataset through six phases.
- Case study and conversation analysis are further options.

## Data collection and sampling
Data come from in-depth and semi-structured interviews, focus groups, observation, diaries, documents and online texts. Sampling is purposive: people are chosen because they have the experience of interest. Sample size is guided by saturation, information power and the approach; IPA prefers depth with few participants, grounded theory may need 20 to 30 interviews.

## Quality criteria
Reliability and validity in the quantitative sense do not fit easily, so Yvonna Lincoln and Egon Guba proposed trustworthiness:
- Credibility (parallel to internal validity): prolonged engagement, triangulation, member checking, negative case analysis.
- Transferability (parallel to external validity): thick description so readers can judge fit with other settings.
- Dependability (parallel to reliability): an audit trail of decisions.
- Confirmability (parallel to objectivity): reflexive journals and showing that findings are grounded in data.
Lucy Yardley's criteria are also used: sensitivity to context, commitment and rigour, transparency and coherence, and impact and importance.

## Example of a qualitative study
A researcher wants to understand why many families in Gujarat first take a relative with psychosis to a religious healer. Using purposive sampling, she interviews 15 caregivers in Gujarati, records and transcribes the interviews, keeps a reflexive diary on her own assumptions as an urban psychologist, and codes the data. Themes might include "illness as affliction from outside", "the healer as first, trusted contact" and "the hospital as last resort". These themes could then inform a quantitative survey or a culturally adapted psychoeducation programme.

## Critique
- Small samples limit statistical generalisation.
- Analysis can be subjective and hard to replicate.
- Time-consuming transcription and coding.
- Risk of the researcher's views shaping themes.
Defenders reply that the aim is depth and theoretical generalisation, and that transparency and reflexivity make subjectivity visible rather than hidden.

## Relevance in India
Qualitative methods suit Indian contexts where standardised Western scales may miss local meanings. Studies of caregiver burden, explanatory models of illness (such as attributions to spirit possession or black magic), help-seeking from faith healers, and the experiences of transgender communities have relied on interviews and ethnography. Methods must be adapted to language, family presence during interviews and power differences between researcher and participant.

## Conclusion
Qualitative research complements quantitative work: one explains "how much" and "whether", the other "how" and "why". Good qualitative research is systematic, transparent and reflexive, and many questions are best answered by mixed methods.`,
    keyPoints: ["Definition and assumptions including reflexivity", "Comparison with quantitative research", "At least four approaches with founders and an example", "IPA double hermeneutic", "Grounded theory coding and saturation", "Lincoln and Guba trustworthiness criteria", "Balanced critique", "Indian application"],
    pitfalls: ["Describing qualitative research as merely unscientific", "Listing approaches without saying how they differ"],
    module: "research-methods/3-1",
    visuals: [
      {
        kind: "compare",
        data: {
          title: "Two ways of knowing",
          a: { label: "Quantitative", points: ["Numbers and measurement", "Large random samples", "Tests hypotheses"], summary: "How much, how often, whether." },
          b: { label: "Qualitative", points: ["Words and meaning", "Small purposive samples", "Builds understanding and theory"], summary: "How and why." },
        },
      },
      {
        kind: "sort",
        data: {
          prompt: "Match each study aim to the best approach.",
          buckets: ["IPA", "Grounded theory", "Discourse analysis", "Ethnography"],
          items: [
            { text: "What is it like to live with chronic pain?", bucket: 0 },
            { text: "Build a model of how families decide to seek psychiatric help", bucket: 1 },
            { text: "How newspapers construct people with mental illness as dangerous", bucket: 2 },
            { text: "A year living in a village studying healing rituals", bucket: 3 },
          ],
        },
      },
    ],
    ref: "Smith, Flowers and Larkin 2009 IPA; Glaser and Strauss 1967; Lincoln and Guba 1985; Yardley 2000; Braun and Clarke 2006",
  },
  {
    id: "rm-l02-018",
    subject: S,
    topic: "qualitative-methods",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe thematic analysis as a method of qualitative data analysis. Explain its six phases with an example.",
    plan: ["Define thematic analysis and its flexibility", "Inductive versus deductive, semantic versus latent", "The six phases with an example", "Strengths and limits", "Conclusion"],
    answer: `## Meaning
Thematic analysis is a method for identifying, analysing and reporting patterns of meaning (themes) across a qualitative dataset. Virginia Braun and Victoria Clarke described it in 2006 as a flexible method not tied to one theory, which makes it suitable for beginners and for applied research. A theme captures something important about the data in relation to the research question and represents a patterned response or meaning.

## Key choices
- Inductive (data-driven) versus deductive (theory-driven) coding.
- Semantic themes, which stay close to what was said, versus latent themes, which interpret underlying ideas and assumptions.
- Essentialist versus constructionist stance.
Their later work calls the approach reflexive thematic analysis, stressing that themes are generated by the researcher, not found waiting in the data.

## The six phases, with an example
Research question: how do first-year hostel students in an Indian university experience homesickness? Twelve students are interviewed.
- Familiarisation: transcribe the interviews, read them repeatedly and note first impressions, such as frequent mention of food and phone calls home.
- Generating initial codes: label meaningful segments across the whole dataset, for example "missing mother's cooking", "guilt at parents' expense", "calling home daily", "finding friends from the same state".
- Searching for themes: group codes into candidate themes, such as "the body remembers home" (food, sleep), "obligation and guilt" and "building a substitute family".
- Reviewing themes: check that each theme fits its coded extracts and the whole dataset, and that themes are distinct. Some merge or split, and a thematic map is drawn.
- Defining and naming themes: write a clear definition of what each theme captures and give it a concise, vivid name, such as "Carrying home in a tiffin".
- Producing the report: write an analytic narrative with vivid extracts, linking themes to the research question and to existing literature on acculturative stress and collectivist family ties.

## Strengths
- Flexible across theories and research questions.
- Accessible and relatively quick to learn.
- Can summarise large datasets and highlight similarities and differences.
- Results are understandable for policymakers and the public.

## Limits
- Flexibility can lead to vague, descriptive analyses that merely list topics.
- Less interpretive depth about individual cases than IPA.
- Quality depends on the researcher's reflexivity and transparency.
- Themes are sometimes wrongly reported as "emerging" passively.

## Conclusion
Thematic analysis turns raw talk into an organised account of shared meaning. Done well, it is systematic, transparent and theoretically aware, and it is often the first qualitative method taught to MA students.`,
    keyPoints: ["Definition of theme and method", "Inductive or deductive and semantic or latent", "All six phases in order", "A running example", "Strengths and limits", "Reflexivity"],
    pitfalls: ["Saying themes simply emerge", "Confusing codes with themes"],
    module: "research-methods/3-1",
    visuals: [
      {
        kind: "timeline",
        data: {
          prompt: "Put the six phases of thematic analysis in order.",
          events: [
            { label: "Familiarise yourself with the data" },
            { label: "Generate initial codes" },
            { label: "Search for themes" },
            { label: "Review themes" },
            { label: "Define and name themes" },
            { label: "Produce the report" },
          ],
          why: "Analysis moves from close reading to codes, then to themes that are checked, named and written up.",
        },
      },
    ],
    ref: "Braun and Clarke 2006 Qualitative Research in Psychology; Braun and Clarke 2019 reflexive TA",
  },
  {
    id: "rm-l02-019",
    subject: S,
    topic: "mixed-methods",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on triangulation in research.",
    plan: ["Define triangulation", "Denzin's four types with examples", "Purpose and limits"],
    answer: `## Meaning
Triangulation means using more than one method, source, researcher or theory to study the same question, so that the findings can be cross-checked. The term comes from navigation, where two known points are used to locate a third. If different approaches converge on the same answer, confidence in the conclusion rises; if they diverge, the difference itself is informative.

## Types (Norman Denzin)
- Data triangulation: different sources, times or places, for example interviewing patients, caregivers and nurses about ward life.
- Investigator triangulation: more than one researcher codes or interprets the data, reducing individual bias.
- Theory triangulation: interpreting the same data through different theoretical lenses, such as a cognitive and a family systems view of relapse.
- Methodological triangulation: combining methods, such as a questionnaire on stigma plus focus groups. Within-method triangulation uses several scales of one kind; between-method triangulation combines quantitative and qualitative methods.

## Purpose
- Increases credibility in qualitative research and validity in general.
- Gives a fuller picture of complex phenomena.
- Reveals contradictions that point to new questions.

## Limits
Triangulation is time-consuming and expensive. Different methods may answer slightly different questions, so lack of agreement does not always mean error. It also assumes there is one truth to converge on, which some constructionist researchers question; they treat triangulation as a way to add depth rather than to confirm.`,
    keyPoints: ["Definition and origin", "Four types with examples", "Purpose of convergence and completeness", "Limits"],
    module: "research-methods/3-2",
    ref: "Denzin 1978 The Research Act; Flick on triangulation",
  },
  {
    id: "rm-l02-020",
    subject: S,
    topic: "mixed-methods",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is mixed methods research? Describe its main designs and discuss its advantages and challenges.",
    plan: ["Define mixed methods and the pragmatist stance", "Reasons for mixing", "Convergent, explanatory sequential, exploratory sequential and embedded designs with examples", "Advantages", "Challenges and conclusion"],
    answer: `## Meaning
Mixed methods research collects and analyses both quantitative and qualitative data within a single study or programme, and deliberately integrates them to answer the research question. It rests mainly on pragmatism: the research question, not loyalty to one philosophy, decides the methods. John Creswell and Vicki Plano Clark are its best-known writers.

## Why mix
- Triangulation: checking whether different methods agree.
- Complementarity: one method elaborates the other.
- Development: results of one method guide the next, for example interviews generating questionnaire items.
- Expansion: covering different parts of a problem.
- Initiation: discovering contradictions that open new questions.

## Main designs
- Convergent (parallel) design: quantitative and qualitative data are collected at the same time and analysed separately, then merged to compare. Example: a survey of burnout among Indian nurses alongside interviews about their working day, with results compared in a joint display table.
- Explanatory sequential design: quantitative first, then qualitative to explain the results. Example: a trial finds a yoga programme reduced anxiety for some students but not others; follow-up interviews explore why.
- Exploratory sequential design: qualitative first, then quantitative. Example: focus groups with rural women identify local expressions of distress such as "tension" and "sinking heart"; these are turned into a screening questionnaire that is then validated on a large sample.
- Embedded design: one form of data plays a supporting role inside a larger study, such as interviews within a randomised trial to study how participants experienced the intervention.
- Notation: capitals show priority, so QUAN then qual means the quantitative strand dominates.

## Advantages
- Answers complex questions that one method cannot.
- Offsets the weaknesses of each method: numbers give breadth and generality, words give depth and context.
- Useful for developing culturally valid tools and evaluating programmes in real settings.
- Findings are often more persuasive to policymakers.

## Challenges
- Requires skills in both traditions.
- Time and cost are greater.
- Integration is often weak: many studies simply report two separate studies side by side.
- Conflicting results must be explained, not hidden.
- Philosophical tension: some argue the two paradigms rest on incompatible assumptions about reality (the incompatibility thesis).

## Conclusion
Mixed methods treat quantitative and qualitative research as partners. The key test of a good mixed methods study is genuine integration, where each strand shapes the interpretation of the other.`,
    keyPoints: ["Definition stressing integration", "Pragmatism", "At least three designs with examples", "QUAN and qual notation", "Advantages", "Challenges including integration and paradigms"],
    pitfalls: ["Treating any study with an open question as mixed methods", "Not explaining integration"],
    module: "research-methods/3-2",
    visuals: [
      {
        kind: "compare",
        data: {
          title: "Two sequential designs",
          a: { label: "Explanatory sequential", points: ["Numbers first", "Interviews then explain surprising results", "QUAN then qual"], summary: "Explains a result." },
          b: { label: "Exploratory sequential", points: ["Interviews first", "Findings build a questionnaire", "qual then QUAN"], summary: "Builds a tool or theory to test." },
        },
      },
    ],
    ref: "Creswell and Plano Clark 2018 Designing and Conducting Mixed Methods Research; Greene, Caracelli and Graham 1989",
  },
];
