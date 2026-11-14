import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, curve, tree, vis } from "./visual";

export const PSYCHOMETRICS_ASSESSMENT_L01: LongQA[] = anchored([
  {
    id: "asmt-l01-001",
    subject: "psychometrics-assessment",
    topic: "reliability",
    marks: 15,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Define reliability. Describe the methods of estimating reliability and the factors that affect it.",
    plan: ["Definition within classical test theory", "Methods: test retest, parallel forms, split half, internal consistency, inter rater", "Interpreting coefficients and acceptable values", "Factors affecting reliability", "Relation to validity and conclusion"],
    answer: `## Definition
Reliability is the consistency or stability of test scores: the extent to which a test gives the same results under consistent conditions. In classical test theory, an observed score (X) is the sum of a true score (T) and random error (E). Reliability is the proportion of observed score variance that is true score variance:
- Reliability = true score variance divided by observed score variance.
It ranges from 0 (all error) to 1 (no error). A reliability of 0.85 means that 85 percent of the differences between people's scores reflect real differences and 15 percent reflect error. Because no single method captures every kind of error, a test manual should report more than one estimate, each matched to the way the test will be used. A reliable measure is not necessarily valid, but an unreliable one cannot be valid.

## Methods of estimating reliability
Test retest reliability:
- The same test is given to the same people on two occasions and the scores are correlated (coefficient of stability).
- Suitable for stable traits (intelligence); the interval matters: too short gives memory and practice effects, too long allows real change.
Parallel (alternate) forms reliability:
- Two equivalent forms with similar content, difficulty and statistics are given and correlated (coefficient of equivalence).
- Reduces memory effects; constructing truly parallel forms is difficult.
Split half reliability:
- One test is split into two halves (odd and even items, to avoid fatigue and difficulty effects) and the halves are correlated.
- Because each half is shorter, the correlation is corrected using the Spearman Brown prophecy formula: full test reliability = 2r divided by (1 + r).
Internal consistency:
- Cronbach's alpha: the average of all possible split half coefficients, based on item variances and total variance; used for multi point items.
- Kuder Richardson formulas (KR 20 and KR 21) for dichotomous (right or wrong) items.
- McDonald's omega, increasingly preferred because alpha assumes equal item loadings.
Inter rater (inter scorer) reliability:
- Agreement between two or more raters, important for observational scales, projective tests and diagnoses.
- Measured with percentage agreement, Cohen's kappa (corrects for chance agreement; about 0.6 to 0.8 is substantial) and the intraclass correlation coefficient.

| Method | Error source assessed | Coefficient |
| Test retest | Time sampling | Stability |
| Parallel forms | Content sampling | Equivalence |
| Split half and alpha | Content heterogeneity | Internal consistency |
| Inter rater | Scorer differences | Agreement |

## Acceptable values
Roughly 0.7 or more for research and group comparisons, 0.8 or more for most clinical use, and 0.9 or more for important individual decisions (such as diagnosing intellectual disability). Very high alpha (above about 0.95) can mean redundant items.

## Factors affecting reliability
- Test length: longer tests are generally more reliable (Spearman Brown).
- Heterogeneity of the sample: a wider range of ability increases correlation; restricted range lowers reliability.
- Item quality: ambiguous items and poor discrimination reduce reliability.
- Difficulty: items that are too easy or too hard add little.
- Speed: speeded tests inflate split half estimates.
- Testing conditions: noise, fatigue, anxiety, motivation, rapport, clarity of instructions.
- Scoring: objective scoring is more reliable than subjective scoring.
- Time interval in test retest.
- Guessing in multiple choice tests.

## Standard error of measurement
Reliability is used to compute the standard error of measurement (SEM = SD multiplied by the square root of 1 minus reliability), which gives a confidence band around an individual score.

## Conclusion
Reliability reflects freedom from random error. Different methods estimate different sources of error, and the choice depends on the test and its use. High reliability is necessary, though not sufficient, for valid measurement.`,
    keyPoints: ["Definition with X = T + E and variance ratio", "Test retest with interval issues", "Parallel forms", "Split half with Spearman Brown formula", "Cronbach's alpha, KR 20, omega", "Inter rater with kappa and ICC", "Acceptable values", "Factors affecting reliability including length and range"],
    pitfalls: ["Confusing reliability with validity", "Forgetting the Spearman Brown correction", "No acceptable values"],
    visuals: [tree("Methods of estimating reliability", [["Reliability", "Consistency of scores: the share of score variance that is true variance", -1], ["Over time", "Test retest: same people, same test, two occasions", 0], ["Across forms", "Parallel forms: two equivalent versions correlated", 0], ["Within the test", "Internal consistency from a single sitting", 0], ["Split half", "Two halves correlated, then corrected with Spearman Brown", 3], ["Cronbach's alpha, KR 20", "Average of all possible splits; KR 20 for right or wrong items", 3], ["Across raters", "Kappa for categories, ICC for scores", 0]])],
    module: "assessment/1-2",
    ref: "Anastasi and Urbina Psychological Testing; Nunnally and Bernstein 1994; Cronbach 1951",
  },
  {
    id: "asmt-l01-002",
    subject: "psychometrics-assessment",
    topic: "classical-test-theory",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Explain classical test theory and compare it with item response theory.",
    plan: ["CTT assumptions", "Key statistics in CTT", "Limitations of CTT", "IRT basics: parameters and curves", "Comparison table and applications"],
    answer: `## Classical test theory
Classical test theory (CTT), formalised by Spearman and later Gulliksen and Lord and Novick, assumes:
- An observed score equals a true score plus random error (X = T + E).
- The mean of errors is zero over repeated testing.
- Errors are uncorrelated with true scores and with each other.
- The true score is the average score a person would obtain over infinite independent testings.

## Key statistics in CTT
- Reliability coefficients (test retest, alpha) and the standard error of measurement.
- Item difficulty (p value): the proportion of people answering an item correctly.
- Item discrimination: correlation between the item and the total score (point biserial), or the difference in pass rates between high and low scorers.
- Norms based on the total score.

## Limitations of CTT
- Item and test statistics depend on the sample: difficulty and reliability change with the group tested.
- Person scores depend on the specific test: different tests give scores on different scales.
- The SEM is assumed equal for everyone, although measurement is less precise at extremes.
- It assumes parallel tests, which are hard to build.
- It is difficult to compare people who took different items (problem for adaptive testing).

## Item response theory
IRT (latent trait theory, developed by Lord, Rasch and Birnbaum) models the probability of a response to an item as a function of the person's level on an underlying trait (theta) and item parameters. The item characteristic curve is an S shaped (logistic) curve. Models:
- One parameter (Rasch) model: item difficulty (b) only.
- Two parameter model: difficulty and discrimination (a, the slope).
- Three parameter model: adds a guessing parameter (c, the lower asymptote).
Polytomous models (graded response, partial credit) handle rating scale items. The test information function shows where on the trait range the test measures most precisely.

## Comparison
| Feature | CTT | IRT |
| Unit of analysis | Total test score | Item |
| Item statistics | Sample dependent | Sample invariant (if model fits) |
| Person scores | Test dependent | Comparable across item sets |
| Measurement error | One SEM for all | Varies with trait level |
| Sample size needed | Smaller | Larger |
| Assumptions | Weak, easy to meet | Strong (unidimensionality, local independence, model fit) |
| Uses | Most traditional tests | Computerised adaptive testing, item banking, test equating, detecting item bias |

## Applications
IRT underlies computerised adaptive tests (such as the GRE and PROMIS health measures), large scale educational assessments, and analysis of differential item functioning across groups (for example, whether an item is biased against rural Indian test takers). CTT remains useful and simpler for small scale clinical test development.

## Conclusion
CTT is simple and widely used but its statistics depend on the sample and test; IRT models responses at the item level, giving sample independent parameters and precision that varies with ability, at the cost of stronger assumptions and larger samples.`,
    keyPoints: ["CTT assumptions", "Item difficulty and discrimination in CTT", "Limitations of sample and test dependence", "IRT definition with theta", "One, two and three parameter models", "Item characteristic curve and information function", "Comparison table", "Applications including CAT and DIF"],
    visuals: [compare("Comparison", ["Classical test theory", ["Total score", "Sample dependent statistics", "Same error for everyone", "Small samples"], "Simple"], ["Item response theory", ["Each item modelled", "Invariant parameters", "Error varies with ability", "Large samples"], "Precise and adaptive"])],
    module: "assessment/3-2",
    ref: "Lord and Novick 1968; Embretson and Reise 2000 IRT for Psychologists; Hambleton 1991",
  },
  {
    id: "asmt-l01-003",
    subject: "psychometrics-assessment",
    topic: "standard-error-of-measurement",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Write short notes on the standard error of measurement, with a worked example.",
    plan: ["Definition and formula", "Worked example", "Confidence intervals and interpretation", "Related concepts"],
    answer: `## Definition and formula
The standard error of measurement (SEM) estimates how much an individual's observed score would vary around their true score because of measurement error. It is the standard deviation of the error distribution:
- SEM = SD multiplied by the square root of (1 minus reliability).
The higher the reliability, the smaller the SEM.

## Worked example
An IQ test has a standard deviation of 15 and a reliability of 0.96.
- SEM = 15 multiplied by the square root of 0.04 = 15 multiplied by 0.2 = 3.
A child scores 70.
- 68 percent confidence interval: 70 plus or minus 1 SEM = 67 to 73.
- 95 percent confidence interval: 70 plus or minus 1.96 SEM = about 64 to 76.
So we can be 95 percent confident that the child's true IQ lies between about 64 and 76. This matters because a cut off of 70 is used in diagnosing intellectual disability; DSM-5-TR notes that a score of about 65 to 75 may be consistent with intellectual disability when adaptive functioning is impaired.

## Interpretation
- Scores should be reported as bands, not exact points.
- Two scores should not be treated as different unless the difference exceeds measurement error.
- The standard error of the difference between two scores (SEdiff = square root of SEM1 squared plus SEM2 squared) is used for comparing subtest scores or pre and post scores, and is the basis of the reliable change index.

## Related concepts
The standard error of estimate is used in prediction (for example, predicting a criterion from a test), and differs from the SEM. In item response theory, measurement error varies with the trait level rather than being a single value.

## Conclusion
The SEM turns reliability into a practical confidence band around each person's score, preventing over interpretation of small differences.`,
    keyPoints: ["Definition", "Formula", "Correct worked example with SEM of 3", "68 and 95 percent intervals", "Relevance to the IQ 70 cut off", "Standard error of the difference"],
    visuals: [curve("normal", "Confidence intervals and interpretation", "A true score lies within about two SEMs of the observed score 95 percent of the time.")],
    module: "assessment/2-1",
    ref: "Anastasi and Urbina; DSM-5-TR intellectual disability measurement error note",
  },
  {
    id: "asmt-l01-004",
    subject: "psychometrics-assessment",
    topic: "generalizability-theory",
    marks: 5,
    difficulty: 4,
    exams: ["mcp-entrance", "ugc-net"],
    question: "Write short notes on generalisability theory.",
    plan: ["Why it was developed", "Key concepts", "G studies and D studies", "Uses"],
    answer: `## Why it was developed
Classical test theory treats error as a single undifferentiated quantity, and different reliability coefficients (test retest, inter rater, internal consistency) each capture only one source of error. Lee Cronbach and colleagues in 1972 developed generalisability theory (G theory) to estimate several sources of error at once and to ask how well scores generalise across conditions of measurement.

## Key concepts
- Universe of admissible observations: all the conditions under which a measurement could be made.
- Facets: sources of variation, such as items, raters, occasions or settings (like factors in ANOVA).
- Universe score: the average score across all admissible conditions (similar to the true score).
- Variance components: G theory uses analysis of variance to estimate how much score variance comes from persons (the variance we want), from each facet, and from interactions (for example, person by rater).
- Generalisability coefficient: for relative decisions (ranking people), analogous to reliability; dependability (phi) coefficient for absolute decisions (meeting a cut off).

## G studies and D studies
- A G study (generalisability study) estimates the variance components.
- A D study (decision study) uses them to predict reliability under different designs, for example: how many raters and how many occasions are needed to reach a coefficient of 0.8 for a clinical skills examination or a behaviour rating scale.

## Uses
Observational assessments with multiple raters, clinical skills examinations (OSCEs), performance assessments, ratings of psychotherapy sessions, and designing efficient assessment procedures.

## Conclusion
Generalisability theory extends classical reliability by separating multiple sources of error and showing how to design more dependable measurements.`,
    visuals: [compare("G studies and D studies", ["Classical reliability", ["One undivided error term", "Each coefficient sees one error source", "Retest, alpha and inter rater kept separate", "Says nothing about how to improve the design"], "One source of error at a time"], ["Generalisability theory", ["Error split into facets: items, raters, occasions", "Variance components estimated by ANOVA", "G coefficient for ranking, phi for cut offs", "D study shows how many raters or occasions are needed"], "Many sources of error at once"])],
    keyPoints: ["Cronbach 1972", "Limitation of single error term", "Facets, universe score, variance components", "G coefficient and phi coefficient", "G studies and D studies", "Applications such as OSCEs"],
    module: "assessment/1-2",
    ref: "Cronbach, Gleser, Nanda, Rajaratnam 1972; Shavelson and Webb 1991 Generalizability Theory: A Primer",
  },
  {
    id: "asmt-l01-005",
    subject: "psychometrics-assessment",
    topic: "validity",
    marks: 15,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Define validity. Describe the types of validity and how they are established, with reference to modern views of validity.",
    plan: ["Definition", "Traditional types: content, criterion (concurrent, predictive), construct", "Methods for construct validity: convergent, discriminant, MTMM, factor analysis", "Face validity and incremental validity", "Modern unified view and consequences", "Factors affecting validity and conclusion"],
    answer: `## Definition
Validity is the degree to which evidence and theory support the interpretations of test scores for proposed uses. In simpler terms, it is whether a test measures what it claims to measure and whether conclusions drawn from it are justified. Validity belongs to interpretations and uses, not to the test itself: a test may be valid for one purpose and invalid for another. A depression scale may be valid for screening adults in a clinic and still be invalid for diagnosing depression in a person who has had a stroke, because physical symptoms inflate the score. Validity is therefore a matter of degree, judged from many kinds of evidence gathered over time.

## Content validity
- The extent to which test items adequately represent the domain being measured (for example, a depression scale covering all core symptoms; an examination covering the syllabus).
- Established by defining the domain, a test blueprint (table of specifications), and expert judgement; the content validity ratio (Lawshe) quantifies expert agreement.

## Criterion related validity
- The relationship between test scores and an external criterion (outcome or standard).
- Concurrent validity: test and criterion measured at the same time (a new depression screen against a clinician's diagnosis).
- Predictive validity: test predicts a future criterion (an entrance examination predicting later academic performance).
- Expressed as a validity coefficient (correlation); for diagnostic tests, as sensitivity, specificity and predictive values.
- Problems: criterion contamination, unreliable criteria, restriction of range.

## Construct validity
- The extent to which a test measures a theoretical construct (intelligence, anxiety, extraversion). Cronbach and Meehl in 1955 described it as fitting the test into a "nomological network" of predicted relationships.
- Evidence:
- Convergent validity: high correlations with other measures of the same construct.
- Discriminant (divergent) validity: low correlations with measures of different constructs.
- Campbell and Fiske's multitrait multimethod matrix (MTMM), measuring several traits by several methods, to separate trait from method variance.
- Factor analysis: exploratory and confirmatory, showing the expected internal structure.
- Developmental changes (for example, ability scores rising with age).
- Group differences (patients versus controls) and experimental interventions changing scores as predicted.

## Other terms
- Face validity: whether the test appears to measure what it should, to test takers; it affects cooperation but is not scientific evidence, and high face validity can make faking easier.
- Incremental validity: whether a test adds predictive power beyond existing information.
- Ecological validity: whether test results reflect real world functioning (important in neuropsychology).

## Modern unified view
Samuel Messick argued that all validity is construct validity and identified six aspects: content, substantive (theoretical processes), structural, generalisability, external (convergent, discriminant, criterion) and consequential (the social consequences of test use, including fairness and bias). The Standards for Educational and Psychological Testing (AERA, APA, NCME) describe sources of validity evidence: test content, response processes, internal structure, relations to other variables, and consequences of testing. Validation is an ongoing argument rather than a single coefficient (Kane's argument based approach).

## Factors affecting validity
Low reliability (validity cannot exceed the square root of reliability), poor items, inappropriate norms, cultural and language bias (translations without adaptation), response sets (social desirability, acquiescence), faking and malingering, test anxiety, and use beyond the intended population. In India, using Western tests without local adaptation and norms threatens validity.

## Conclusion
Validity is the most important property of a test. It is built from content, criterion and construct evidence, and modern views treat it as a unified, ongoing argument about whether interpretations and uses of scores are justified, including their consequences.`,
    keyPoints: ["Modern definition about interpretations and uses", "Content validity with blueprint and experts", "Concurrent and predictive validity", "Construct validity and nomological network", "Convergent, discriminant and MTMM", "Face, incremental and ecological validity", "Messick's unified view and Standards sources", "Factors affecting validity including culture"],
    pitfalls: ["Treating face validity as real evidence", "Saying a test is valid in general", "Omitting the reliability ceiling"],
    visuals: [tree("Types of validity evidence", [["Validity", "Support for score interpretations", -1], ["Content", "Domain coverage, judged by experts against a blueprint", 0], ["Criterion", "Scores related to an outside standard", 0], ["Concurrent", "Criterion measured at the same time, such as a clinician's diagnosis", 2], ["Predictive", "Criterion measured later, such as grades a year on", 2], ["Construct", "Fits the theory of what is measured", 0], ["Convergent", "High correlation with other measures of the same trait", 5], ["Discriminant", "Low correlation with measures of different traits", 5], ["Factor structure", "Items group as the theory predicts", 5]])],
    module: "assessment/1-3",
    ref: "Cronbach and Meehl 1955; Campbell and Fiske 1959; Messick 1989 and 1995; AERA APA NCME Standards 2014; Kane 2013",
  },
  {
    id: "asmt-l01-006",
    subject: "psychometrics-assessment",
    topic: "clinical-decision",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "md-psychiatry"],
    question: "Discuss the use of tests in clinical decision making, including sensitivity, specificity, predictive values, ROC curves and the clinical versus actuarial prediction debate.",
    plan: ["Tests as decision tools and the two by two table", "Sensitivity, specificity, predictive values and base rates", "Cut off scores and ROC curves", "Clinical versus actuarial prediction", "Conclusion"],
    answer: `## Tests as decision tools
Many test uses are decisions: does this person have dementia, ADHD, or high suicide risk? Outcomes are summarised in a two by two table:
| | Condition present | Condition absent |
| Test positive | True positive (a) | False positive (b) |
| Test negative | False negative (c) | True negative (d) |

## Key indices
- Sensitivity = a divided by (a + c): the proportion of people with the condition who test positive.
- Specificity = d divided by (b + d): the proportion without the condition who test negative.
- Positive predictive value = a divided by (a + b): the proportion of positives who truly have the condition.
- Negative predictive value = d divided by (c + d).
- Likelihood ratios: LR+ = sensitivity divided by (1 minus specificity); LR minus = (1 minus sensitivity) divided by specificity.
- Overall hit rate (accuracy) can be misleading when base rates are extreme.

## Base rates
Predictive values depend on the base rate (prevalence). Meehl and Rosen in 1955 showed that when a condition is rare, even an accurate test produces many false positives; if the base rate is very low, simply predicting "no" for everyone may give more correct decisions than the test. For example, a suicide risk scale with good sensitivity and specificity still produces mostly false positives in a general hospital population where suicide is rare.

## Cut off scores and ROC curves
- Changing the cut off trades sensitivity against specificity: a lower cut off on a dementia screen catches more cases (higher sensitivity) but labels more healthy people (lower specificity).
- A receiver operating characteristic (ROC) curve plots sensitivity against 1 minus specificity for all possible cut offs. The area under the curve (AUC) summarises accuracy: 0.5 is chance, 0.7 to 0.8 acceptable, 0.8 to 0.9 good, above 0.9 excellent.
- The optimal cut off depends on the costs of errors: screening for a serious, treatable condition favours high sensitivity; confirming a diagnosis before an invasive treatment favours high specificity. The Youden index (sensitivity + specificity minus 1) is one way to choose.
- Cut offs should be derived and validated in populations like those in which the test will be used (for example, lower MMSE cut offs for people with little schooling in India).

## Clinical versus actuarial prediction
In 1954 Paul Meehl reviewed about twenty studies comparing the two methods and found that statistical (actuarial) formulas usually predicted outcomes as well as or better than clinicians' judgements. Later meta analyses (Grove and colleagues) confirmed that mechanical prediction is about 10 percent more accurate on average and rarely worse. Reasons: clinicians are influenced by biases (confirmation bias, availability, overconfidence), inconsistently weight information and ignore base rates. However:
- Formulas need validation in local populations and can miss rare, important information ("broken leg" cues).
- Clinical judgement is essential in gathering information, formulation and treatment planning.
- Structured professional judgement (for example, the HCR-20 for violence risk) combines both.

## Conclusion
Good clinical decisions with tests require understanding sensitivity, specificity, base rates and cut offs, and using structured or actuarial methods where they outperform intuition, while keeping clinical judgement for formulation and individual circumstances.`,
    keyPoints: ["Two by two table", "Correct formulas for sensitivity, specificity, PPV, NPV", "Likelihood ratios", "Meehl and Rosen on base rates", "ROC and AUC interpretation", "Choosing cut offs by cost of errors and local norms", "Meehl 1954 and Grove meta analysis", "Structured professional judgement"],
    visuals: [
      vis("curve", { kind: "sdt", title: "Cut off scores and ROC curves" }, "Move the criterion: hits and false alarms change together."),
      { kind: "figure", data: { id: "roc-curve" }, caption: "Clinical versus actuarial prediction: the ROC curve sums up a test over every cut off; the further it bows towards the top left, the larger the area under it." },
    ],
    module: "assessment/2-1",
    ref: "Meehl 1954; Meehl and Rosen 1955; Grove 2000 Psychol Assess; Swets 1988 ROC",
  },
  {
    id: "asmt-l01-007",
    subject: "psychometrics-assessment",
    topic: "norms-standardisation",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Discuss standardisation and norms in psychological testing. Describe the types of norms and derived scores.",
    plan: ["Standardisation meaning", "Normative samples and sampling", "Types of norms", "Derived scores", "Problems and Indian context"],
    answer: `## Standardisation
Standardisation has two meanings:
- Uniformity of procedure: the same instructions, materials, time limits, administration and scoring for everyone, so that scores are comparable.
- Establishing norms: giving the test to a large, representative sample to provide a reference against which an individual's score is interpreted.
A raw score (for example, 32 correct answers) means little until compared with norms.

## Normative samples
- Should represent the population for whom the test is intended in age, sex, education, region, urban or rural residence, language and socioeconomic status.
- Sampling methods: stratified random sampling is ideal; convenience samples limit generalisation.
- Should be large enough for each subgroup and recent enough (norms become outdated; the Flynn effect raised IQ scores over decades, so old norms overestimate IQ).

## Types of norms
- Age norms (age equivalents): the average performance at each age (mental age in early Binet tests).
- Grade norms: average performance for each school grade.
- Percentile norms: the percentage of the norm group scoring below a given score.
- Standard score norms: based on the mean and standard deviation.
- National, local and special group norms (for example, norms for people with little schooling or for a clinical group).
- Criterion referenced interpretation, an alternative, compares performance with a fixed standard (mastery) rather than with other people.

## Derived scores
| Score | Mean | SD | Notes |
| z score | 0 | 1 | (raw score minus mean) divided by SD |
| T score | 50 | 10 | Used in MMPI and many personality scales; 65 or 70 often marks clinical elevation |
| Deviation IQ | 100 | 15 | Wechsler and modern Binet |
| Scaled score | 10 | 3 | Wechsler subtests |
| Stanine | 5 | About 2 | Nine bands |
| Sten | 5.5 | 2 | Ten bands, used in 16PF |
Percentile ranks are easy to understand but unequal in units (differences near the middle are small in raw terms). Standard scores assume or create (normalised standard scores) a normal distribution.

## Problems and Indian context
- Many tests used in India were developed abroad, and using foreign norms misclassifies people; local adaptation and norms are needed (for example, the Malin's Intelligence Scale for Indian Children adapted from the WISC, Bhatia's Battery, the NIMHANS neuropsychology battery with Indian norms, and education adjusted norms for cognitive screening such as the Hindi Mental State Examination).
- India's diversity in language, education, urban and rural life and socioeconomic status means one national norm may not fit all.
- Norms must be updated, and the relevant norm group chosen for each person.

## Conclusion
Standardisation ensures uniform testing and gives scores meaning through representative norms and derived scores. In India, culturally adapted, current and appropriate norms are essential for fair and valid interpretation.`,
    keyPoints: ["Two meanings of standardisation", "Representative, adequate and recent normative samples", "Flynn effect", "Age, grade, percentile and standard score norms", "Derived scores table with means and SDs", "Criterion referenced alternative", "Indian adapted tests and norms", "Choosing the relevant norm group"],
    visuals: [{ kind: "figure", data: { id: "normal-curve-scales" }, caption: "Derived scores: z, T, IQ, percentile and Wechsler scaled scores all lined up under one normal curve." }],
    module: "assessment/1-4",
    ref: "Anastasi and Urbina; Flynn 1987; Malin 1969 MISIC; Rao NIMHANS battery norms",
  },
  {
    id: "asmt-l01-008",
    subject: "psychometrics-assessment",
    topic: "scaling",
    marks: 5,
    difficulty: 2,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Write short notes on levels of measurement and attitude scaling methods.",
    plan: ["Stevens' four levels", "Thurstone scaling", "Likert scaling", "Guttman and semantic differential"],
    answer: `## Levels of measurement
Stanley Stevens in 1946 described four levels:
| Level | Properties | Example | Statistics |
| Nominal | Categories only | Diagnosis, religion | Frequencies, mode, chi square |
| Ordinal | Rank order | Ranks in class, severity mild to severe | Median, rank correlation |
| Interval | Equal intervals, no true zero | Temperature in Celsius, IQ scores (assumed) | Mean, SD, Pearson r, t tests |
| Ratio | Equal intervals and true zero | Reaction time, weight | All, including ratios |
Most psychological scales are strictly ordinal but are treated as interval in practice.

## Thurstone scaling (method of equal appearing intervals)
Louis Thurstone in 1928: a large pool of attitude statements is sorted by many judges into 11 categories from very unfavourable to very favourable. Each statement gets a scale value (median rating); statements with high agreement among judges, spread across the range, are selected. Respondents agree or disagree, and their score is the mean or median scale value of statements endorsed. It is laborious and depends on judges' attitudes.

## Likert scaling (summated ratings)
Rensis Likert in 1932: respondents rate agreement with each statement on a five point (or seven point) scale from strongly disagree to strongly agree; scores are summed after reversing negatively worded items. Item analysis selects items that correlate with the total. It is simple, reliable and the most widely used.

## Guttman and semantic differential
- Guttman scalogram: items form a cumulative hierarchy, so agreeing with a strong item implies agreeing with all weaker ones (coefficient of reproducibility above 0.9).
- Osgood's semantic differential: the concept is rated on bipolar adjective pairs (good versus bad, strong versus weak, active versus passive), measuring evaluation, potency and activity.
- Bogardus social distance scale measures willingness to accept members of a group at different levels of closeness.

## Conclusion
Levels of measurement guide appropriate statistics, and scaling methods, especially Likert scales, turn attitudes into numbers.`,
    visuals: [vis("sort", { prompt: "Sort each variable by its level of measurement.", buckets: ["Nominal", "Ordinal", "Interval", "Ratio"], items: [
      { text: "Diagnosis under ICD-11", bucket: 0, why: "Categories with no order." },
      { text: "Rank in an entrance merit list", bucket: 1, why: "Order is known, but the gaps between ranks are not equal." },
      { text: "Score on a Likert attitude scale", bucket: 1, why: "Strictly ordinal, though often treated as interval." },
      { text: "Temperature in Celsius", bucket: 2, why: "Equal intervals, but zero does not mean no heat." },
      { text: "Reaction time in milliseconds", bucket: 3, why: "Equal intervals and a true zero, so ratios make sense." },
    ] }, "Levels of measurement")],
    keyPoints: ["Stevens' four levels with examples and statistics", "Psychological scales usually ordinal treated as interval", "Thurstone equal appearing intervals", "Likert summated ratings and reversing items", "Guttman cumulative scaling", "Semantic differential and Bogardus"],
    module: "assessment/1-4",
    ref: "Stevens 1946 Science; Thurstone 1928; Likert 1932; Guttman 1944; Osgood 1957",
  },
  {
    id: "asmt-l01-009",
    subject: "psychometrics-assessment",
    topic: "test-types",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Write short notes on the classification of psychological tests.",
    plan: ["By what is measured", "By administration and format", "By interpretation and response", "Examples"],
    answer: `## By what is measured
- Ability tests: intelligence (WAIS, Binet), aptitude (Differential Aptitude Tests), achievement (school tests).
- Personality tests: objective inventories (MMPI, 16PF, NEO PI R) and projective techniques (Rorschach, TAT).
- Interests, attitudes and values (Strong Interest Inventory, Holland's codes).
- Neuropsychological tests (memory, attention, executive function).
- Clinical rating scales and screening tools (PHQ 9, Y-BOCS).

## By administration and format
- Individual tests (WAIS, Rorschach) versus group tests (many aptitude and achievement tests).
- Verbal versus non verbal or performance tests (Raven's Progressive Matrices, Kohs' block design), important for people with limited language or literacy.
- Paper and pencil, oral, performance and computerised or adaptive tests.
- Speed tests (easy items, strict time limits) versus power tests (increasingly difficult items, generous time).

## By interpretation and response
- Norm referenced (compared with others) versus criterion referenced (compared with a standard).
- Maximal performance (what a person can do: ability tests) versus typical performance (what a person usually does: personality and interest tests), as described by Cronbach.
- Structured (fixed responses) versus unstructured (free responses to ambiguous stimuli).
- Self report, observer rating, performance based and physiological measures.
- Culture fair or culture reduced tests (Cattell's Culture Fair Intelligence Test, Raven's) attempt to reduce cultural bias.

## Conclusion
Tests can be classified by content, administration, format and interpretation; knowing the type guides appropriate use and interpretation.`,
    visuals: [tree("By what is measured", [["Psychological tests", "Classified by what they measure", -1], ["Ability", "Intelligence, aptitude, achievement: maximal performance", 0], ["Personality", "Inventories and projective techniques: typical performance", 0], ["Interests and attitudes", "Holland codes, attitude scales", 0], ["Neuropsychological", "Memory, attention, executive function", 0], ["Clinical scales", "Screening and severity ratings such as PHQ 9", 0]])],
    keyPoints: ["Ability, personality, interest, neuropsychological and clinical tests", "Individual versus group", "Verbal versus performance", "Speed versus power", "Norm versus criterion referenced", "Maximal versus typical performance", "Culture fair tests"],
    module: "assessment/1-1",
    ref: "Cronbach Essentials of Psychological Testing; Anastasi and Urbina",
  },
  {
    id: "asmt-l01-010",
    subject: "psychometrics-assessment",
    topic: "item-construction",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Describe the steps in constructing a psychological test, including item analysis.",
    plan: ["Planning and defining the construct", "Item writing", "Try out and item analysis", "Reliability, validity and norms", "Manual and revision; Indian adaptation"],
    answer: `## Planning
- Define the purpose (screening, diagnosis, research), the target population and the construct, based on theory and literature.
- Decide the format (self report, performance), length, time, response type and scoring.
- Prepare a test blueprint mapping content areas and their weight (for example, a depression scale covering mood, cognition, somatic and behavioural symptoms).

## Item writing
- Write more items than needed (often twice as many).
- Use clear, simple, unambiguous language suited to the population; avoid double barrelled items ("I feel sad and tired"), negatives and jargon.
- Balance positively and negatively keyed items to reduce acquiescence.
- Choose item types: multiple choice, true or false, Likert, forced choice (to reduce social desirability), open ended.
- Expert review for content validity; cognitive interviewing of a few target respondents to check understanding.

## Try out and item analysis
- Pilot the items on a sample similar to the target population.
- Item difficulty (p): proportion answering correctly; for ability tests, items with p around 0.3 to 0.7 are most useful, with a range for discrimination at different levels.
- Item discrimination: the discrimination index (difference between upper and lower 27 percent groups) or item total correlation (corrected); values above about 0.3 are good, and negative values mean the item is faulty.
- Distractor analysis in multiple choice items: each wrong option should attract some low scorers.
- Factor analysis to check dimensions; item response theory analysis where samples allow.
- Check for differential item functioning (bias) across groups.
- Revise or remove poor items.

## Reliability, validity and norms
- Estimate reliability (internal consistency, test retest, inter rater as appropriate).
- Gather validity evidence: content, criterion (against clinical diagnosis or another test), construct (convergent, discriminant, factor structure).
- Standardise on a large, representative sample and develop norms (percentiles, standard scores) and cut off scores with ROC analysis.

## Manual and revision
Prepare a manual with purpose, administration, scoring, norms, reliability and validity data, and limits. Revise periodically as norms and content age.

## Indian adaptation
Translating a foreign test needs forward and back translation, expert committee review, cultural adaptation of content (for example, replacing unfamiliar objects or situations), pilot testing, and new reliability, validity and norms. Examples include Indian adaptations of the WISC (MISIC), the Binet (Kamat), the MMPI and the Indian Scale for Assessment of Autism, which was developed locally.

## Conclusion
Test construction is a systematic process of defining the construct, writing and analysing items, and establishing reliability, validity and norms, followed by careful documentation and, in India, cultural adaptation.`,
    keyPoints: ["Defining purpose, population and construct", "Test blueprint", "Item writing rules", "Pilot try out", "Item difficulty and discrimination with values", "Distractor analysis and DIF", "Reliability, validity, norms and cut offs", "Translation and adaptation steps for India"],
    visuals: [chain("Steps in test construction", [["Plan", "Purpose, construct, blueprint"], ["Write items", "More than needed"], ["Try out", "Pilot sample"], ["Item analysis", "Difficulty, discrimination, distractors"], ["Reliability and validity", "Internal consistency, retest, criterion and construct evidence"], ["Norms and manual", "Representative sample, derived scores, cut offs and a written manual"]])],
    module: "assessment/3-1",
    ref: "Anastasi and Urbina; Kaplan and Saccuzzo Psychological Testing; Beaton 2000 cross-cultural adaptation guidelines",
  },
]);
