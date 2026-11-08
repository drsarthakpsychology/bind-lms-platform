import type { LongQA } from "@/lib/prep/long-types";
import { anchored, curve, cycle, layers, timeline, tree, vis } from "./visual";

export const PSYCHOMETRICS_ASSESSMENT_L02: LongQA[] = anchored([
  {
    id: "asmt-l02-001",
    subject: "psychometrics-assessment",
    topic: "test-bias",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Discuss test bias and fairness in psychological assessment, with reference to India.",
    plan: ["Bias versus fairness", "Types of bias", "Methods to detect bias", "Reducing bias and culture fair tests", "Indian issues and conclusion"],
    answer: `## Bias versus fairness
- Test bias is a technical property: systematic error in a test's scores or predictions for members of a particular group, so that the test measures or predicts differently for that group.
- Fairness is a broader, social and ethical concept about equitable treatment in testing: access, opportunity to learn, accommodations, and just use of results.
- A group difference in average scores is not itself proof of bias; the question is whether the test measures the same construct equally well in both groups.

## Types of bias
- Content bias: items that rely on knowledge or experiences more familiar to one group (questions about snow or Western foods for rural Indian children).
- Construct bias: the construct itself means something different in different cultures (what counts as intelligent behaviour, or how depression is expressed).
- Method bias: differences in familiarity with testing, response styles (acquiescence, extreme responding), language of administration, or test anxiety; also administrator effects.
- Predictive bias: the test predicts a criterion (such as college grades) differently for different groups. In the Cleary model, a test is biased if the regression lines relating test to criterion differ in slope or intercept between groups.

## Methods to detect bias
- Differential item functioning (DIF): an item functions differently for people of equal ability from different groups. Detected with the Mantel Haenszel procedure, logistic regression or item response theory.
- Measurement invariance testing with confirmatory factor analysis: configural (same structure), metric (same loadings) and scalar (same intercepts) invariance are needed for meaningful group comparisons.
- Comparing reliability and validity coefficients across groups.
- Expert and community review of items.

## Reducing bias
- Careful translation and cultural adaptation (forward and back translation, review committees, pilot testing).
- Local norms and, where appropriate, separate norms for educational levels.
- Non verbal and "culture reduced" tests (Raven's Progressive Matrices, Cattell's Culture Fair Intelligence Test), though no test is culture free: familiarity with abstract figures and timed tasks still depends on schooling.
- Multiple sources of information rather than one test.
- Accommodations for disabilities (extra time, readers, scribes).
- Trained, culturally competent examiners who build rapport.
Historical misuse of tests (such as early US army tests used to argue against immigrants, and court cases about placing minority children in special classes using IQ tests) shows the harm of ignoring bias.

## Indian issues
India has great diversity in language (22 scheduled languages and many more), education, rural and urban life, caste and socioeconomic status, and gender. Problems include using Western tests with foreign norms, testing in English, low exposure to timed paper tasks among rural and first generation learners, and gender differences in schooling. Standardised Indian tests (MISIC, Bhatia's battery, the NIMHANS neuropsychology battery) and education adjusted cut offs for cognitive screening help. Fair use of tests in recruitment and education is linked to constitutional values of equality.

## Conclusion
Test bias is a measurable, technical problem that can be detected through DIF, invariance and predictive analyses; fairness requires wider attention to culture, language, access and use. In India, adaptation and local norms are essential.`,
    keyPoints: ["Bias versus fairness", "Group differences are not proof of bias", "Content, construct, method and predictive bias", "Cleary regression model", "DIF methods and measurement invariance", "Adaptation, local norms and culture reduced tests", "Historical misuse", "Indian diversity and adapted tests"],
    visuals: [tree("Types of bias", [["Test bias", "Systematic error in scores or predictions for one group", -1], ["Content", "Unfamiliar items", 0], ["Construct", "Different meaning across cultures", 0], ["Method", "Language, response style, test familiarity", 0], ["Predictive", "Different regression lines", 0]])],
    module: "assessment/3-4",
    ref: "Cleary 1968; van de Vijver and Tanzer 2004; AERA APA NCME Standards 2014 fairness chapter; Reynolds and Suzuki",
  },
  {
    id: "asmt-l02-002",
    subject: "psychometrics-assessment",
    topic: "item-cat",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net"],
    question: "Write short notes on computerised adaptive testing.",
    plan: ["Definition and basis", "How it works", "Advantages", "Limitations and examples"],
    answer: `## Definition and basis
Computerised adaptive testing (CAT) is a method in which a computer selects each item according to the test taker's previous answers, so that each person receives items matched to their level. It is based on item response theory (IRT), which places items and people on the same trait scale.

## How it works
- Build an item bank with calibrated IRT parameters (difficulty, discrimination, guessing).
- Start with an item of medium difficulty.
- After each response, estimate the person's trait level (theta) and its standard error.
- Choose the next item that gives the most information at the current estimate (usually an item the person has about a 50 percent chance of answering correctly).
- Stop when the standard error falls below a set value or a maximum number of items is reached.

## Advantages
- Shorter tests (often half the items) with equal or better precision.
- Precision is similar across all levels, unlike fixed tests that measure extremes poorly.
- Reduced boredom and frustration.
- Improved security, as each person sees different items.
- Immediate scoring.

## Limitations
- Requires large calibration samples and a big item bank.
- Assumes the IRT model fits (unidimensionality, local independence).
- Test takers usually cannot review or change answers.
- Item exposure must be controlled; technology and access are needed.

## Examples
The Graduate Record Examination (in part), licensing examinations, the PROMIS patient reported outcome measures, and adaptive depression and anxiety measures (CAT Mental Health). Adaptive formats are beginning to be used in Indian competitive examinations and online assessments.

## Conclusion
CAT uses IRT to tailor tests to each person, achieving precise measurement with fewer items.`,
    visuals: [cycle("How it works", [["Start", "An item of middle difficulty from the calibrated bank"], ["Respond", "The person answers right or wrong"], ["Estimate theta", "Trait level and its standard error are updated"], ["Pick next item", "The unused item giving most information at that theta"], ["Check stop rule", "Stop when the standard error is small enough or items run out"]])],
    keyPoints: ["Definition and IRT basis", "Item bank and calibration", "Item selection by maximum information", "Stopping rule by standard error", "Advantages including precision across levels", "Limitations and examples"],
    module: "assessment/3-2",
    ref: "Wainer 2000 Computerized Adaptive Testing; Gibbons 2012 CAT-Mental Health; PROMIS",
  },
  {
    id: "asmt-l02-003",
    subject: "psychometrics-assessment",
    topic: "intelligence-theories",
    marks: 15,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Critically evaluate the major theories of intelligence.",
    plan: ["Definitions of intelligence", "Psychometric theories: Spearman, Thurstone, Cattell and Horn, Carroll, CHC, Guilford, Vernon", "Cognitive and process theories: PASS, Sternberg", "Gardner's multiple intelligences", "Biological views and Indian concepts", "Evaluation and conclusion"],
    answer: `## Definitions
There is no single agreed definition. Wechsler defined intelligence as "the aggregate or global capacity of the individual to act purposefully, to think rationally and to deal effectively with his environment". A widely cited 1994 statement by experts described it as a general mental capability involving reasoning, planning, problem solving, abstract thinking, understanding complex ideas, learning quickly and learning from experience.

## Psychometric theories
- Charles Spearman's two factor theory in 1904: positive correlations among all mental tests (the positive manifold) reflect a general factor (g) plus specific factors (s) for each test. g is best measured by tests of reasoning and the "eduction of relations and correlates".
- Louis Thurstone's primary mental abilities in 1938: factor analysis found about seven abilities: verbal comprehension, word fluency, number, space, associative memory, perceptual speed and reasoning. Later, these abilities were found to correlate, implying a higher order g.
- Philip Vernon's hierarchical model: g at the top, then major group factors (verbal educational and practical mechanical), then minor group and specific factors.
- Raymond Cattell and John Horn: fluid intelligence (Gf), the ability to solve novel problems and reason, which peaks early in adulthood and declines with age; and crystallised intelligence (Gc), accumulated knowledge and vocabulary, which is maintained or rises into later life. Horn added further broad abilities.
- John Carroll's three stratum theory in 1993, from reanalysis of more than 460 datasets: stratum III (g), stratum II (about eight broad abilities) and stratum I (many narrow abilities).
- Cattell Horn Carroll (CHC) theory combines these into the dominant framework today, with broad abilities such as fluid reasoning, comprehension knowledge, visual processing, auditory processing, short term working memory, long term storage and retrieval, processing speed and quantitative knowledge. Modern tests (WISC-V, Woodcock Johnson) are built on it.
- J P Guilford's structure of intellect model rejected g and proposed 120 (later 180) abilities from combinations of operations, contents and products; it included divergent thinking (creativity) but has weak empirical support.

## Cognitive and process theories
- PASS theory (J P Das, Jack Naglieri and Kirby), based on Luria's model of brain functions: planning, attention, simultaneous processing and successive processing, measured by the Cognitive Assessment System. It is useful in diagnosing learning difficulties.
- Robert Sternberg's triarchic theory and later theory of successful intelligence: analytical (academic problem solving), creative (dealing with novelty) and practical (adapting to everyday contexts, "street smarts", tacit knowledge) intelligence.

## Gardner's multiple intelligences
Howard Gardner in 1983 proposed several relatively independent intelligences: linguistic, logical mathematical, spatial, musical, bodily kinaesthetic, interpersonal, intrapersonal and naturalistic (added later; existential was considered). He used criteria such as isolation by brain damage, savants and prodigies, a distinct developmental history and evolutionary plausibility. It is popular in education. Critics argue that the "intelligences" are better called talents, that many correlate with g, and that there are few valid measures.

## Biological views
Heritability of IQ rises from about 0.2 in infancy to about 0.7 to 0.8 in adulthood; brain size, white matter integrity, prefrontal and parietal networks (the parieto frontal integration theory) and neural efficiency correlate modestly with intelligence. Environmental influences include nutrition, schooling, socioeconomic status and the Flynn effect.

## Indian concepts
Indian traditions emphasise wisdom (prajna), discrimination (viveka), social competence and ethical understanding as part of intelligence; studies of folk views in India (such as by Baral and Das) found that intelligence is often seen as including social responsibility and self awareness, not only cognitive speed.

## Evaluation
- g is one of the most replicated findings in psychology and predicts educational and occupational outcomes, supporting hierarchical models.
- CHC theory has strong empirical and practical value.
- Gardner and Sternberg broaden the concept but have weaker measurement.
- All tests are culturally embedded; Western tests may undervalue skills important in other settings.

## Conclusion
Theories of intelligence range from a single general factor to multiple independent abilities. Hierarchical models, especially CHC theory, best fit the data, while broader theories remind us of practical, creative and social competencies and of cultural differences in what intelligence means.`,
    keyPoints: ["Wechsler's and expert definitions", "Spearman's g and s", "Thurstone's primary mental abilities", "Cattell and Horn fluid and crystallised", "Carroll three stratum and CHC", "Guilford structure of intellect", "PASS and Sternberg", "Gardner with critique; biological and Indian views"],
    pitfalls: ["Listing theories without evaluation", "Confusing fluid and crystallised", "Ignoring cultural views"],
    visuals: [layers("Carroll's three strata", "pyramid", [["Stratum III: g", "General intelligence"], ["Stratum II: broad abilities", "Fluid reasoning, comprehension knowledge, processing speed, memory"], ["Stratum I: narrow abilities", "Many specific skills"]])],
    module: "assessment/2-2",
    ref: "Spearman 1904; Thurstone 1938; Cattell 1963; Carroll 1993; McGrew 2009 CHC; Das Naglieri Kirby 1994 PASS; Sternberg 1985; Gardner 1983; Gottfredson 1997 mainstream science",
  },
  {
    id: "asmt-l02-004",
    subject: "psychometrics-assessment",
    topic: "intelligence-wechsler",
    marks: 15,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Describe the Wechsler intelligence scales. Discuss their structure, administration and interpretation.",
    plan: ["History and Wechsler's concept", "Versions and age ranges", "Structure of WAIS-IV and WISC-V", "Scoring and derived scores", "Interpretation steps", "Strengths, limitations and Indian use"],
    answer: `## History and concept
David Wechsler, at Bellevue Hospital in New York, published the Wechsler Bellevue Intelligence Scale in 1939. He saw intelligence as a global capacity expressed through different abilities, so he combined verbal and performance tasks and introduced the deviation IQ (mean 100, SD 15) in place of the ratio IQ (mental age divided by chronological age), which did not work for adults.

## Versions
- Wechsler Adult Intelligence Scale (WAIS): ages 16 to 90; WAIS-IV in 2008 is widely used, and WAIS-5 was published in 2024.
- Wechsler Intelligence Scale for Children (WISC): ages 6 to 16; WISC-V appeared in 2014. In India, Pearson publishes WISC-IV India and WAIS-IV India editions with Indian norms.
- Wechsler Preschool and Primary Scale of Intelligence (WPPSI): about 2 years 6 months to 7 years 7 months.
- Wechsler Abbreviated Scale of Intelligence (WASI) for quick estimates.
In India, Malin's Intelligence Scale for Indian Children (MISIC) is an older adaptation of the WISC.

## Structure of WAIS-IV
Ten core subtests form four index scores:
| Index | Core subtests | Supplementary |
| Verbal Comprehension (VCI) | Similarities, Vocabulary, Information | Comprehension |
| Perceptual Reasoning (PRI) | Block Design, Matrix Reasoning, Visual Puzzles | Figure Weights, Picture Completion |
| Working Memory (WMI) | Digit Span, Arithmetic | Letter Number Sequencing |
| Processing Speed (PSI) | Symbol Search, Coding | Cancellation |
The Full Scale IQ (FSIQ) combines all ten. The General Ability Index (GAI), from VCI and PRI, is less affected by working memory and speed.

## Structure of WISC-V
Based on CHC theory, it has five primary indices: Verbal Comprehension, Visual Spatial (Block Design, Visual Puzzles), Fluid Reasoning (Matrix Reasoning, Figure Weights), Working Memory (Digit Span, Picture Span) and Processing Speed (Coding, Symbol Search), plus ancillary indices such as quantitative reasoning and non verbal ability.

## Administration and scoring
- Individually administered by trained examiners in standard order, with standard instructions, start points, reversal and discontinue rules, and timing; about 60 to 90 minutes.
- Raw scores are converted to age based scaled scores (mean 10, SD 3) for subtests and to composite scores (mean 100, SD 15) with percentiles and confidence intervals.

## Interpretation
A stepwise approach:
- Behaviour observations and validity: rapport, effort, attention, anxiety, language, sensory or motor problems.
- Full Scale IQ with confidence interval and classification (for example 90 to 109 average; 70 to 79 borderline; 69 or below extremely low), noting that a large index discrepancy makes the FSIQ less meaningful.
- Index scores: compare indices to identify relative strengths and weaknesses, using statistical significance and base rates of differences in the norm sample.
- Subtest patterns: interpreted cautiously, as single subtests are less reliable.
- Process observations (types of errors, strategies).
- Integrate with history, academic records, adaptive functioning and other tests; interpret in the light of culture, language and education.
Common clinical patterns (interpreted cautiously): low working memory and processing speed in ADHD and brain injury; relatively low verbal scores in language disorders and limited schooling; uneven profiles in autism; generally low scores across indices in intellectual disability.

## Strengths and limitations
Strengths: excellent standardisation, high reliability (FSIQ around 0.97), strong validity, rich profile information, and wide research base.
Limitations: long administration, cultural and educational loading (especially verbal subtests), need for local norms, cost and copyright, practice effects with retesting, and IQ not capturing creativity, practical or social intelligence. In India, use of foreign norms can underestimate ability; Indian norms or adapted versions should be used.

## Conclusion
The Wechsler scales are the most widely used individual intelligence tests, providing a reliable full scale IQ and index profiles based on modern theory. Skilled, culturally informed interpretation integrating other information is essential.`,
    keyPoints: ["Wechsler 1939 and deviation IQ", "Versions and age ranges", "WAIS-IV four indices with core subtests", "WISC-V five indices and CHC basis", "FSIQ and GAI", "Scaled and composite scores", "Stepwise interpretation including discrepancies", "Strengths, limitations and Indian norms"],
    visuals: [layers("Structure of WAIS-IV", "stack", [["Full Scale IQ", "All ten core subtests"], ["Verbal Comprehension and Perceptual Reasoning", "Together form the General Ability Index"], ["Working Memory and Processing Speed", "Cognitive proficiency"], ["Ten core subtests", "Scaled scores, mean 10, SD 3"]])],
    module: "assessment/2-2",
    ref: "Wechsler 1939; WAIS-IV manual 2008; WISC-V manual 2014; WAIS-5 2024; Flanagan and Kaufman Essentials of WISC-V Assessment; Malin 1969",
  },
  {
    id: "asmt-l02-005",
    subject: "psychometrics-assessment",
    topic: "intelligence-binet",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Write short notes on the Binet scales and the Binet-Kamat test.",
    plan: ["Binet and Simon", "Stanford-Binet and IQ", "Binet-Kamat", "Uses and limits"],
    answer: `## Binet and Simon
Alfred Binet and Theodore Simon published the first practical intelligence test in France in 1905, to identify children who needed special education. It contained 30 items of increasing difficulty testing judgement, comprehension and reasoning. The 1908 revision introduced the concept of mental age: the age level at which a child performs.

## Stanford-Binet and IQ
Lewis Terman at Stanford University revised the scale for American use in 1916 and introduced the intelligence quotient, using William Stern's idea: IQ = mental age divided by chronological age, multiplied by 100. Later revisions replaced the ratio IQ with deviation scores. The fifth edition (SB5, 2003) covers ages 2 to 85 and above, measures five factors (fluid reasoning, knowledge, quantitative reasoning, visual spatial processing, working memory) in verbal and non verbal domains, and is based on CHC theory.

## Binet-Kamat
V V Kamat adapted the Stanford-Binet for Indian children in Kannada and Marathi, first published in 1934 and revised later. It is an age scale for about 3 to 22 years, with items grouped by year levels, from which a mental age and ratio IQ are calculated. It has been widely used in India, including for certifying intellectual disability, often together with the Vineland Social Maturity Scale.

## Uses and limits
Useful for young children and for people with lower ability because of its age level structure. Limits: the Binet-Kamat norms are old, its items are dated and verbally loaded, and the ratio IQ is less precise than deviation IQ, so results should be interpreted cautiously and supported by other measures.

## Conclusion
Binet's scale launched intelligence testing; the Stanford-Binet introduced the IQ, and the Binet-Kamat remains a historic and still used Indian adaptation.`,
    visuals: [timeline("Put the milestones of the Binet scales in order.", [["Binet and Simon publish the first scale in Paris", "1905"], ["Revision introduces mental age", "1908"], ["Terman's Stanford-Binet and the ratio IQ", "1916"], ["Kamat's Indian adaptation", "1934"], ["Fifth edition built on CHC theory", "2003"]], "Each step made the test more usable: mental age gave a yardstick, the IQ allowed comparison across ages, and later deviation scores fixed the problems of the ratio IQ.")],
    keyPoints: ["Binet and Simon 1905 purpose", "Mental age 1908", "Terman 1916 and ratio IQ formula", "SB5 five factors", "Kamat 1934 Indian adaptation and age range", "Limits of old norms and ratio IQ"],
    module: "assessment/2-2",
    ref: "Binet and Simon 1905; Terman 1916; Roid 2003 SB5; Kamat 1934 and 1967 revision",
  },
  {
    id: "asmt-l02-006",
    subject: "psychometrics-assessment",
    topic: "indian-tests",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester"],
    question: "Describe the commonly used Indian tests of intelligence and development.",
    plan: ["Why Indian tests are needed", "Verbal and composite tests", "Performance and non verbal tests", "Developmental and adaptive measures", "Strengths, limits and conclusion"],
    answer: `## Why Indian tests are needed
Tests developed in the West rely on language, culture and schooling that differ from many Indian contexts. Adapted or indigenous tests with Indian norms improve validity and fairness, and are required for many official purposes such as disability certification.

## Verbal and composite tests
- Binet-Kamat Test of Intelligence (V V Kamat): adaptation of the Stanford-Binet, for about 3 to 22 years; yields mental age and IQ.
- Malin's Intelligence Scale for Indian Children (MISIC), published by A J Malin in 1969: adaptation of the WISC for 6 to 15 years, with verbal subtests (information, general comprehension, arithmetic, analogies and similarities, vocabulary, digit span) and performance subtests (picture completion, block design, object assembly, coding, mazes); gives verbal, performance and full scale IQs.
- WISC-IV India and WAIS-IV India editions, which carry Indian norms.
- Wechsler Adult Performance Intelligence Scale (WAPIS, Ramalingaswamy), an Indian adaptation of the performance part of the WAIS.

## Performance and non verbal tests
- Bhatia's Battery of Performance Tests of Intelligence, published by C M Bhatia in 1955: Kohs' block design, Alexander's pass along test, pattern drawing, immediate memory for digits and picture construction; suitable for people with limited literacy, from about 11 years.
- Raven's Progressive Matrices (Standard, Coloured and Advanced), with Indian norms from several studies; non verbal reasoning.
- Seguin Form Board: placing shapes in a board; for young children and those with intellectual disability.
- Draw a Man test (Goodenough and Harris) with Indian norms, quick estimate for children.
- Kohs' block design and other performance tests.

## Developmental and adaptive measures
- Developmental Screening Test (Bharat Raj), for 0 to 15 years, giving a developmental quotient.
- Vineland Social Maturity Scale with Indian adaptation (Malin's VSMS): social age and social quotient; widely used with IQ tests in assessing intellectual disability.
- Bayley Scales of Infant Development with Indian norms (Phatak's adaptation for Indian infants).
- Indian Scale for Assessment of Autism (ISAA), developed by the National Institute for the Mentally Handicapped (now NIEPID), used for autism certification.
- NIMHANS Index for Specific Learning Disabilities and other screening tools.

## Strengths and limits
Strengths: cultural familiarity, Indian norms, accepted for certification. Limits: many norms are decades old and from limited regions, some are available only in a few languages, and older ratio IQ methods are less precise. Multiple tests, observation and adaptive measures should be combined.

## Conclusion
Indian clinicians use a range of adapted and indigenous tests, such as Binet-Kamat, MISIC, Bhatia's battery, Raven's and the VSMS, but should be aware of dated norms and supplement them with modern, well normed tools where available.`,
    keyPoints: ["Need for Indian tests", "Binet-Kamat and MISIC with subtests", "Indian Wechsler editions", "Bhatia's battery components", "Raven's, Seguin Form Board, Draw a Man", "DST, VSMS, Bayley adaptation, ISAA", "Strengths and dated norms"],
    visuals: [tree("Indian tests of intelligence and development", [["Indian tests", "Adapted or built for Indian children and adults, with Indian norms", -1], ["Verbal and composite", "Binet-Kamat, MISIC, WISC-IV India", 0], ["Performance and non verbal", "Bhatia's battery, Raven's, Seguin Form Board", 0], ["Development and adaptation", "DST, VSMS, Bayley adaptation", 0], ["Specific conditions", "ISAA, NIMHANS SLD index", 0]])],
    module: "assessment/2-2",
    ref: "Malin 1969; Bhatia 1955; Kamat 1967; Bharat Raj DST; NIMH ISAA 2009; Kapur Indian tests review",
  },
  {
    id: "asmt-l02-007",
    subject: "psychometrics-assessment",
    topic: "intelligence-id-assessment",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "How is intellectual disability assessed? Describe the criteria, tools and the process of disability certification in India.",
    plan: ["Definitions in DSM-5-TR and ICD-11", "Assessment of intellectual functioning", "Assessment of adaptive functioning", "Severity levels", "Indian certification under the RPwD Act", "Conclusion"],
    answer: `## Definitions
- DSM-5-TR intellectual disability (intellectual developmental disorder) requires: deficits in intellectual functions (reasoning, problem solving, planning, abstract thinking, judgement, academic and experiential learning) confirmed by clinical assessment and standardised testing; deficits in adaptive functioning in conceptual, social and practical domains that limit independence and social responsibility; and onset during the developmental period.
- An IQ about two standard deviations below the mean (about 70, allowing for measurement error a range of about 65 to 75) is typical, but severity is defined by adaptive functioning, not IQ alone.
- ICD-11 disorders of intellectual development use similar criteria, with severity guided by both intellectual and adaptive functioning and behavioural indicators for use when tests are unavailable.

## Assessment of intellectual functioning
- Individually administered, standardised, culturally appropriate tests: Wechsler scales (WISC-V, WAIS-IV with Indian norms), Stanford-Binet, Binet-Kamat, MISIC, Bhatia's battery, Raven's Progressive Matrices for non verbal reasoning.
- Report scores with confidence intervals; consider language, sensory or motor impairments, education, and test familiarity.
- For very young or severely impaired children, developmental scales (Bayley, Developmental Screening Test).

## Assessment of adaptive functioning
- Standardised scales with informants: Vineland Adaptive Behavior Scales (third edition), Adaptive Behavior Assessment System, and in India the Vineland Social Maturity Scale (social age and social quotient) and the Behavioural Assessment Scales for Indian Children with Mental Retardation (BASIC-MR) from NIMH.
- Conceptual domain: language, reading, writing, maths, money, time.
- Social domain: communication, friendships, social judgement, gullibility.
- Practical domain: self care, safety, household tasks, travel, work.

## Additional assessment
History of pregnancy, birth, milestones and regression; family history and consanguinity; physical examination for dysmorphic features; hearing and vision testing; genetic tests (chromosomal microarray, fragile X), thyroid and metabolic screening; and screening for comorbid autism, ADHD, epilepsy and mental illness.

## Severity levels
| Severity | Approximate IQ range (older ICD-10 guide) | Adaptive picture |
| Mild | 50 to 69 | Learns academic skills to about primary level; independent with support |
| Moderate | 35 to 49 | Needs ongoing support for complex tasks; can learn self care and simple work |
| Severe | 20 to 34 | Limited language; needs extensive support |
| Profound | Below 20 | Pervasive support for all activities |
DSM-5-TR defines severity by adaptive functioning in the three domains rather than IQ.

## Certification in India
Under the Rights of Persons with Disabilities Act 2016, intellectual disability is a specified disability, and a certificate of 40 percent or more (benchmark disability) gives access to benefits such as reservation in education and jobs, concessions and schemes. Government guidelines for assessing intellectual disability use standardised IQ tests (such as Binet-Kamat, MISIC, Wechsler or other approved tests, and developmental scales for young children) together with social or adaptive measures (such as the VSMS), with percentage disability linked to the IQ or developmental quotient. The guidelines were first notified in 2018 and revised in 2024; the revision added an Indian intelligence test developed by NIEPID (the national institute for intellectual disabilities in Secunderabad) and allowed boards to include private specialists. Certification is done by a medical board in a government hospital including a psychiatrist, clinical psychologist and paediatrician or physician, and certificates for children may need review as they grow. The National Trust Act 1999 provides for guardianship and support for people with intellectual disability, autism, cerebral palsy and multiple disabilities.

## Conclusion
Intellectual disability is assessed by combining standardised tests of intelligence and adaptive behaviour with a developmental and medical evaluation. In India, certification under the RPwD Act opens access to rights and services.`,
    keyPoints: ["DSM-5-TR three criteria", "IQ around 70 with measurement error", "Severity by adaptive functioning", "Appropriate IQ tests including Indian ones", "Adaptive scales including VSMS and BASIC-MR", "Medical and genetic work up", "Severity table", "RPwD 40 percent benchmark, medical board, National Trust Act"],
    visuals: [curve("normal", "Assessment of intellectual functioning", "An IQ about two standard deviations below the mean, near 70, is the usual intellectual criterion.")],
    module: "child/2-1",
    ref: "DSM-5-TR ID; ICD-11 6A00; RPwD Act 2016; MSJE guidelines for assessment of ID 2018 and March 2024 revision (ThePrint, 18 Mar 2024); NIMH BASIC-MR; National Trust Act 1999",
  },
  {
    id: "asmt-l02-008",
    subject: "psychometrics-assessment",
    topic: "intelligence-raven",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Write short notes on Raven's Progressive Matrices.",
    plan: ["Origin and purpose", "Forms", "Administration and scoring", "Uses and limits"],
    answer: `## Origin and purpose
John C Raven developed the Progressive Matrices in 1938 in the UK as a non verbal test of Spearman's g, specifically "eductive ability": the ability to make meaning out of confusion and see relationships. Each item shows a pattern or matrix with a missing piece, and the person chooses the correct piece from several options.

## Forms
- Standard Progressive Matrices (SPM): 60 items in five sets (A to E) of 12, increasing in difficulty; for about age 6 to adults.
- Coloured Progressive Matrices (CPM): 36 items in sets A, Ab and B, in colour; for children aged 5 to 11, older adults and people with intellectual or physical disabilities.
- Advanced Progressive Matrices (APM): for adolescents and adults of above average ability.
- Newer versions include the SPM Plus and Raven's 2.

## Administration and scoring
Can be given individually or in groups, untimed (power test) or timed. The raw score (number correct) is converted to percentiles, and sometimes estimated IQ, using norms. Indian norms are available from several studies, though they vary by region and are partly dated.

## Uses
Assessing reasoning ability with minimal reliance on language, in people with limited literacy, different languages, hearing or speech impairment, and in cross cultural research; screening in schools; part of disability assessment in India; research on fluid intelligence and the Flynn effect.

## Limits
It measures mainly fluid reasoning, not the full range of intelligence; it is "culture reduced" rather than culture free, since familiarity with abstract shapes and test formats depends on schooling; scores have risen strongly over generations (Flynn effect), so old norms overestimate ability.

## Conclusion
Raven's Matrices are a widely used, non verbal measure of general reasoning ability, valuable in multilingual settings like India when interpreted with appropriate norms.`,
    visuals: [layers("Forms", "stack", [["Advanced Progressive Matrices", "Able adolescents and adults; separates people at the top end"], ["Standard Progressive Matrices", "60 items in sets A to E; about age 6 to adult"], ["Coloured Progressive Matrices", "36 items in sets A, Ab and B; young children, older adults, disability"]], "The three forms, from hardest at the top to easiest at the bottom.")],
    keyPoints: ["Raven 1938 and eductive ability", "SPM 60 items in five sets", "CPM and APM", "Untimed power test and percentiles", "Uses in multilingual and disability settings", "Culture reduced, not culture free; Flynn effect"],
    module: "assessment/2-2",
    ref: "Raven 1938; Raven manual; Flynn 1987; Indian norms studies",
  },
  {
    id: "asmt-l02-009",
    subject: "psychometrics-assessment",
    topic: "intelligence-flynn",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Write short notes on the Flynn effect.",
    plan: ["Definition", "Evidence", "Explanations", "Implications"],
    answer: `## Definition
The Flynn effect is the substantial rise in average IQ test scores over generations in many countries, described by James Flynn in the 1980s. Gains have been about 3 IQ points per decade on average, larger on fluid reasoning tests such as Raven's Matrices than on vocabulary and general knowledge.

## Evidence
Data from military conscripts, school children and norm samples in more than 30 countries show rising raw scores through the twentieth century. Some developed countries (Norway, Denmark, Finland) have shown a plateau or a "reverse Flynn effect" since about the 1990s, while gains continue in many developing countries.

## Explanations
- Better nutrition and health, including reduced infectious disease.
- More and better schooling and greater familiarity with tests.
- More cognitively complex environments, with increasing emphasis on abstract and scientific thinking ("scientific spectacles", in Flynn's phrase).
- Smaller families and more parental investment.
- Reduction in exposure to toxins such as lead.
The gains are too fast to be genetic, which shows the strong role of the environment on test scores.

## Implications
- Test norms become outdated: an old test overestimates IQ in current test takers. This matters in diagnosing intellectual disability (a score of 72 on an old test might be about 66 on current norms) and in legal settings such as death penalty cases in the USA.
- Group differences in IQ are not fixed and can change with environment.
- It raises questions about what IQ tests measure.

## Conclusion
The Flynn effect shows that IQ scores are strongly shaped by environment and that tests must be renormed regularly.`,
    visuals: [vis("guess", { prompt: "On average, by how many IQ points per decade did scores rise across the twentieth century?", min: 0, max: 10, step: 0.5, unit: "points", answer: [2.5, 3.5], reveal: "About 3 points per decade, so a test normed 20 years ago overestimates today's IQ by about 6 points." }, "Definition")],
    keyPoints: ["Definition and Flynn", "About 3 points per decade", "Larger on fluid tests", "Reverse Flynn effect", "Environmental explanations", "Implications for outdated norms and ID diagnosis"],
    module: "assessment/2-2",
    ref: "Flynn 1984 and 1987 Psychol Bull; Pietschnig and Voracek 2015 meta-analysis; Bratsberg and Rogeberg 2018 PNAS",
  },
  {
    id: "asmt-l02-010",
    subject: "psychometrics-assessment",
    topic: "intelligence-emotional",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Write short notes on the concept and measurement of emotional intelligence.",
    plan: ["Definition and origins", "Models", "Measures", "Critique"],
    answer: `## Definition and origins
Emotional intelligence (EI) refers to abilities or tendencies related to perceiving, understanding, using and managing emotions in oneself and others. Peter Salovey and John Mayer introduced the scientific concept in 1990, and Daniel Goleman's 1995 book made it popular.

## Models
- Ability model (Mayer and Salovey): four branches: perceiving emotions, using emotions to facilitate thinking, understanding emotions, and managing emotions. EI is treated as a form of intelligence.
- Mixed models: Goleman (self awareness, self regulation, motivation, empathy and social skills) and Reuven Bar-On (emotional and social competencies), combining abilities with personality traits and motivation.
- Trait EI (Petrides): emotional self perceptions measured by self report, part of personality.

## Measures
- Mayer Salovey Caruso Emotional Intelligence Test (MSCEIT): a performance test with items scored for correctness by expert or consensus scoring.
- Bar-On Emotional Quotient Inventory (EQ-i): self report.
- Trait Emotional Intelligence Questionnaire (TEIQue).
- Indian measures have also been developed for students and employees.

## Critique
- Self report measures overlap strongly with personality (especially neuroticism, extraversion and agreeableness) and are open to faking.
- Ability measures have scoring problems (what is the "correct" emotional answer, especially across cultures).
- Claims that EI matters more than IQ for success were exaggerated; EI shows modest incremental validity for job performance and wellbeing.
- Emotional display rules differ across cultures, including in India.

## Conclusion
Emotional intelligence is a useful but contested construct; ability and trait models differ, and measurement remains a challenge.`,
    visuals: [layers("The four branch ability model", "stack", [["Managing emotions", "Regulating feelings in oneself and others to reach goals"], ["Understanding emotions", "Knowing how emotions blend and change over time"], ["Using emotions", "Harnessing moods to help thinking and problem solving"], ["Perceiving emotions", "Reading emotion in faces, voices and art; the base branch"]], "Models: the branches run from basic perception at the bottom to managing emotions at the top.")],
    keyPoints: ["Definition and Salovey and Mayer 1990", "Goleman popularisation", "Four branch ability model", "Mixed and trait models", "MSCEIT, EQ-i, TEIQue", "Critique including overlap with personality"],
    module: "assessment/2-2",
    ref: "Salovey and Mayer 1990; Mayer 2008 Annu Rev; Goleman 1995; Petrides 2001; Joseph and Newman 2010 meta-analysis",
  },
]);
