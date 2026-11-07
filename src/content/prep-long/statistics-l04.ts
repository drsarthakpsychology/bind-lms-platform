import type { LongQA } from "@/lib/prep/long-types";

const S = "statistics" as const;

export const STATISTICS_L04: LongQA[] = [
  {
    id: "stat-l04-031",
    subject: S,
    topic: "reliability",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Discuss the statistical methods of estimating reliability. Illustrate the split-half method with the Spearman Brown correction and explain Cronbach's alpha, with worked examples.",
    plan: ["Define reliability using classical test theory", "Test-retest and parallel forms", "Split-half and Spearman Brown with example", "Cronbach's alpha and KR-20 with example", "Inter-rater methods and factors affecting reliability", "Interpretation and conclusion"],
    answer: `## Meaning
Reliability is the consistency of a measure: the extent to which it gives the same results under consistent conditions. In classical test theory, an observed score X equals a true score T plus random error E. The reliability coefficient is the proportion of observed score variance that is true score variance: reliability = variance of T / variance of X. It ranges from 0 to 1. A reliability of 0.85 means 85 percent of the variation in scores reflects real differences and 15 percent reflects error.

## Test-retest reliability
The same test is given to the same people on two occasions, and the scores are correlated. It estimates stability over time (the coefficient of stability). The interval matters: too short and people remember answers; too long and real change occurs. It suits stable traits such as intelligence, not states such as mood.

## Parallel (alternate) forms reliability
Two equivalent forms with matched content, difficulty and statistics are given to the same group, and scores are correlated (the coefficient of equivalence). It avoids memory effects, but constructing truly parallel forms is difficult.

## Split-half reliability
The test is given once and split into two comparable halves, usually odd and even items (a first half versus second half split is affected by fatigue and item difficulty). The two half-scores are correlated. Because each half is only half as long as the full test, and longer tests are more reliable, the correlation underestimates the reliability of the full test. The Spearman Brown prophecy formula corrects this:
reliability of full test = 2r / (1 + r), where r is the correlation between the halves.
Worked example: the odd and even halves of a 40-item anxiety scale correlate 0.60. Full-test reliability = (2 x 0.60) / (1 + 0.60) = 1.20 / 1.60 = 0.75.
The general form predicts the effect of lengthening a test n times: n r / [1 + (n minus 1) r]. Doubling a test with reliability 0.70 gives (2 x 0.70) / 1.70 = 0.82.
The Rulon and Guttman formulas are alternatives that do not assume equal variances of the halves.

## Cronbach's alpha
A single split is arbitrary; different splits give different estimates. Lee Cronbach's alpha is, in effect, the average of all possible split-half coefficients. It measures internal consistency: how strongly the items hang together.
Alpha = [k / (k minus 1)] x [1 minus (sum of item variances / variance of total scores)], where k is the number of items.
Worked example: a 4-item scale given to six students has item variances 2.00, 1.47, 1.10 and 2.67 (sum 7.23), and total score variance 25.37.
- Alpha = (4 / 3) x (1 minus 7.23 / 25.37) = 1.333 x (1 minus 0.285) = 1.333 x 0.715 = 0.95.
The high value arises because the items correlate strongly with each other, so total variance is much larger than the sum of item variances.
- KR-20 (Kuder Richardson formula 20) is the special case for dichotomous items scored right or wrong, using p times q for each item's variance. KR-21 assumes equal item difficulty.

## Inter-rater reliability
For scored observations, interviews or projective tests, agreement between raters is assessed with Cohen's kappa (categories) or the intraclass correlation coefficient (continuous ratings).

## Factors affecting reliability
- Test length: more items generally raise reliability (Spearman Brown).
- Heterogeneity of the group: a wider range of ability gives higher correlations; restricted groups give lower reliability.
- Item quality and homogeneity.
- Clear instructions and objective scoring.
- Testing conditions, fatigue, guessing.
- Speeded tests inflate split-half and alpha estimates, so test-retest or separately timed halves are used.

## Interpreting values
| Reliability | Typical judgement |
| 0.90 and above | Excellent, needed for individual clinical decisions |
| 0.80 to 0.89 | Good |
| 0.70 to 0.79 | Acceptable for research |
| Below 0.70 | Questionable |
Alpha has limits: it rises with the number of items even when the items measure different things, it is not evidence that a scale is unidimensional, and very high values (above about 0.95) may indicate redundant items. McDonald's omega, based on factor analysis, is increasingly preferred.

## Conclusion
Each reliability method estimates a different source of error: time (test-retest), content sampling (parallel forms, split-half, alpha) and scorers (inter-rater). A test manual should report the methods relevant to how the test will be used, and the standard error of measurement derived from them.`,
    keyPoints: ["Classical test theory definition", "Test-retest and parallel forms with limits", "Split-half with odd-even split", "Spearman Brown formula and correct 0.75", "Alpha formula and worked value 0.95", "KR-20 for dichotomous items", "Factors affecting reliability", "Interpretation guide and limits of alpha"],
    pitfalls: ["Forgetting the Spearman Brown correction", "Treating high alpha as proof of unidimensionality"],
    module: "statistics/3-6",
    visuals: [
      { kind: "worked", data: { title: "Two reliability calculations", steps: [{ q: "Halves correlate 0.60. Full-test reliability?", a: "2 x 0.60 / 1.60 = 0.75" }, { q: "Alpha with k = 4, item variances summing to 7.23, total variance 25.37?", a: "(4 / 3) x (1 minus 0.285) = 0.95" }], yourTurn: [{ q: "A test with reliability 0.60 is tripled in length. New reliability?", a: "3 x 0.60 / (1 + 2 x 0.60) = 1.80 / 2.20 = 0.82" }] } },
      { kind: "flow", data: { title: "Which error does each method capture?", layout: "tree", nodes: [{ id: "r", label: "Reliability" }, { id: "t", label: "Test-retest", parent: "r", detail: "Error from time." }, { id: "p", label: "Parallel forms", parent: "r", detail: "Error from content sampling and time." }, { id: "i", label: "Split-half and alpha", parent: "r", detail: "Error from content sampling within one test." }, { id: "s", label: "Inter-rater", parent: "r", detail: "Error from scorers." }] } },
    ],
    ref: "Anastasi and Urbina ch 4; Nunnally and Bernstein ch 6 and 7; Cronbach 1951. numpy item data: alpha 0.953, item var sum 7.233, total var 25.367; 1.8/2.2 = 0.818.",
  },
  {
    id: "stat-l04-032",
    subject: S,
    topic: "reliability",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "What is the standard error of measurement? An IQ test has SD 15 and reliability 0.91. Calculate the SEM and the 95 percent confidence band for an obtained IQ of 110.",
    plan: ["Define SEM", "Formula and calculation", "Confidence band", "Clinical significance"],
    answer: `## Meaning
The standard error of measurement (SEM) estimates how much a person's observed scores would vary around their true score if they could be tested many times with the test, with no practice or fatigue effects. It translates a group-level reliability coefficient into the precision of an individual score, in the same units as the test.

## Formula and calculation
SEM = SD x square root of (1 minus reliability).
- SEM = 15 x square root of (1 minus 0.91) = 15 x square root of 0.09 = 15 x 0.3 = 4.5 IQ points.

## Confidence band
If errors are normally distributed, about 95 percent of observed scores fall within 1.96 SEMs of the true score.
- 1.96 x 4.5 = 8.82.
- 95 percent band = 110 plus or minus 8.82 = about 101 to 119.
We can be reasonably confident that the person's true IQ lies somewhere between about 101 and 119. A 68 percent band (plus or minus 1 SEM) would be 105.5 to 114.5.

## Why it matters
- Scores should be reported as bands, not single points, especially near cut-offs. An obtained IQ of 72 has a 95 percent band of about 63 to 81, which crosses the cut-off of 70 used for intellectual disability, so diagnosis must not rest on the number alone.
- To judge whether two scores differ (for example verbal and performance indexes, or before and after scores), the standard error of the difference is used.
- Higher reliability means a smaller SEM and greater precision: with reliability 0.75, SEM would be 7.5 points.`,
    keyPoints: ["Definition", "Formula", "SEM = 4.5", "95 percent band about 101 to 119", "Use near diagnostic cut-offs", "Link between reliability and SEM"],
    module: "statistics/3-6",
    visuals: [
      { kind: "worked", data: { title: "SEM and confidence band", steps: [{ q: "SEM?", a: "15 x 0.3 = 4.5" }, { q: "95 percent margin?", a: "1.96 x 4.5 = 8.82" }, { q: "Band for 110?", a: "101.2 to 118.8" }] } },
    ],
    ref: "Anastasi and Urbina ch 4; Wechsler manuals use estimated true score bands. 15*sqrt(.09) = 4.5.",
  },
  {
    id: "stat-l04-033",
    subject: S,
    topic: "reliability",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "md-psychiatry"],
    question: "Explain Cohen's kappa and the intraclass correlation coefficient as measures of inter-rater reliability. Two clinicians independently assessed 50 patients for depression; both said depressed for 20, both said not depressed for 20, and they disagreed on 10 (5 each way). Calculate kappa and interpret it.",
    plan: ["Why inter-rater reliability matters", "Percent agreement and its weakness", "Kappa formula and worked example", "Weighted kappa and limits", "ICC and its forms", "Conclusion"],
    answer: `## Why it matters
When scores depend on judgement, as in diagnostic interviews, behavioural observation, essay marking or Rorschach scoring, different raters may disagree. Inter-rater reliability shows whether results depend on the patient or on who did the rating. Low agreement was a major problem for psychiatric diagnosis before the operational criteria of DSM-III in 1980.

## Percent agreement
The simplest index is the proportion of cases on which raters agree. Here they agree on 40 of 50 patients, 80 percent. But some agreement happens by chance: two raters who each call half their patients depressed at random would agree about half the time.

## Cohen's kappa
Jacob Cohen's kappa corrects for chance agreement: kappa = (Po minus Pe) / (1 minus Pe), where Po is observed agreement and Pe is the agreement expected by chance from each rater's marginal totals.
| Clinician A by B | B depressed | B not | Total |
| A depressed | 20 | 5 | 25 |
| A not | 5 | 20 | 25 |
| Total | 25 | 25 | 50 |
- Po = (20 + 20) / 50 = 0.80.
- Pe = (25/50 x 25/50) + (25/50 x 25/50) = 0.25 + 0.25 = 0.50.
- Kappa = (0.80 minus 0.50) / (1 minus 0.50) = 0.30 / 0.50 = 0.60.

## Interpretation
Using the guidelines of J. Richard Landis and Gary Koch: below 0 poor, 0 to 0.20 slight, 0.21 to 0.40 fair, 0.41 to 0.60 moderate, 0.61 to 0.80 substantial, above 0.80 almost perfect. A kappa of 0.60 is moderate, at the edge of substantial. Agreement is well above chance, but the clinicians should review the 10 disagreements, clarify criteria and perhaps use a structured interview. For comparison, the DSM-5 field trials reported kappas around 0.2 to 0.3 for major depressive disorder, prompting debate about acceptable standards.

## Weighted kappa and limits
- For ordered categories (mild, moderate, severe), weighted kappa gives partial credit for near-misses.
- Kappa depends on prevalence: when one category is very common, kappa can be low even with high percent agreement (the kappa paradox).
- Fleiss' kappa extends the idea to more than two raters.

## Intraclass correlation coefficient
For continuous ratings, such as scores on the Hamilton Depression Rating Scale given by several raters to the same patients, the intraclass correlation coefficient (ICC) is used. It estimates the proportion of total variance due to real differences between patients rather than differences between raters and error.
- Models: one-way random (each patient rated by different raters), two-way random (raters seen as a sample of all possible raters, generalising to others) and two-way mixed (the specific raters are the only ones of interest).
- Types: consistency (do raters rank patients the same, allowing one to be systematically harsher) versus absolute agreement (do they give the same scores).
- Single measures versus average measures (the reliability of one rater versus the mean of several).
- Guidelines: below 0.50 poor, 0.50 to 0.75 moderate, 0.75 to 0.90 good, above 0.90 excellent.
Pearson r is not suitable for inter-rater reliability because it ignores systematic differences: if one rater always scores 5 points higher, r can be 1.0 although the raters never agree.

## Conclusion
Kappa is the standard chance-corrected index for categorical judgements; the ICC is its counterpart for continuous ratings. In this example kappa = 0.60 shows moderate agreement, a reminder that even trained clinicians need clear criteria and structured tools.`,
    keyPoints: ["Why inter-rater reliability matters", "Weakness of percent agreement", "Kappa formula", "Correct Po 0.80, Pe 0.50, kappa 0.60", "Landis and Koch interpretation", "Weighted kappa and prevalence effects", "ICC models and agreement versus consistency", "Why Pearson r is inadequate"],
    module: "statistics/3-6",
    visuals: [
      { kind: "worked", data: { title: "Cohen's kappa", steps: [{ q: "Observed agreement?", a: "40 / 50 = 0.80" }, { q: "Chance agreement?", a: "0.5 x 0.5 + 0.5 x 0.5 = 0.50" }, { q: "Kappa?", a: "0.30 / 0.50 = 0.60, moderate" }] } },
    ],
    ref: "Cohen 1960; Landis and Koch 1977; Shrout and Fleiss 1979; Koo and Li 2016 ICC guide; Regier et al 2013 DSM-5 field trials (MDD kappa 0.28).",
  },
  {
    id: "stat-l04-034",
    subject: S,
    topic: "factor-analysis",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Discuss factor analysis. Explain the steps of exploratory factor analysis, including extraction, deciding the number of factors and rotation, and compare it with confirmatory factor analysis. Give examples of its use in psychology.",
    plan: ["Define factor analysis and its purpose", "History and examples from intelligence and personality", "Steps of EFA: suitability, extraction, number of factors, rotation, interpretation", "Key terms: loadings, communalities, eigenvalues", "CFA and comparison", "Uses, criticisms and conclusion"],
    answer: `## Meaning
Factor analysis is a family of statistical methods that explain the correlations among many observed variables in terms of a smaller number of underlying, unobserved variables called factors (latent variables). If ten vocabulary, reading and verbal reasoning tests all correlate highly with each other but weakly with spatial tests, factor analysis may reveal a verbal factor and a spatial factor. Its purposes are to reduce data, identify underlying constructs, develop and refine tests, and test theories about structure.

## History and classic uses
- Charles Spearman developed factor analysis in 1904 to explain the positive correlations among school tests, proposing a general factor (g) plus specific factors.
- Louis Thurstone's multiple factor analysis identified seven primary mental abilities, such as verbal comprehension, number and spatial visualisation.
- Raymond Cattell factor analysed trait words and questionnaire data to produce 16 source traits, the basis of the 16PF.
- Hans Eysenck derived extraversion, neuroticism and psychoticism.
- The Big Five model of personality emerged from factor analyses of trait descriptors in many languages.
- Factor analysis underlies the index structure of the Wechsler scales and checks the structure of translated scales in India.

## Key terms
- Factor loading: the correlation between a variable and a factor. Loadings above about 0.30 or 0.40 are usually treated as meaningful.
- Communality (h squared): the proportion of a variable's variance explained by all the common factors, the sum of its squared loadings.
- Eigenvalue: the amount of total variance explained by a factor, the sum of its squared loadings across variables. Divided by the number of variables, it gives the percentage of variance explained.
- Unique variance: the part of a variable's variance not shared with other variables (specific variance plus error).

## Steps of exploratory factor analysis
- Design and sample: include several items for each expected factor; a common guide is at least 5 to 10 participants per variable and at least 200 to 300 overall.
- Check suitability: the correlation matrix should contain many correlations above 0.30. The Kaiser Meyer Olkin (KMO) measure of sampling adequacy should be above 0.60 (above 0.80 is good), and Bartlett's test of sphericity should be significant, showing the correlation matrix is not an identity matrix.
- Extraction: principal axis factoring and maximum likelihood estimate common factors. Principal component analysis, often used in practice, is technically a data reduction method that analyses total variance rather than common variance.
- Decide the number of factors:
| Method | Rule |
| Kaiser criterion | Keep factors with eigenvalues above 1; tends to overestimate |
| Scree test (Cattell) | Plot eigenvalues and keep factors above the elbow where the curve flattens |
| Parallel analysis | Keep factors whose eigenvalues exceed those from random data of the same size; the most accurate |
| Theory and interpretability | Factors should make conceptual sense |
- Rotation: the initial solution is hard to interpret, so axes are rotated to approach simple structure, where each variable loads highly on one factor and near zero on others. Rotation redistributes variance without changing the total explained.
- Orthogonal rotation (varimax is the most common) keeps factors uncorrelated.
- Oblique rotation (direct oblimin, promax) allows factors to correlate, which is usually more realistic in psychology, since abilities and traits are often related. It produces a pattern matrix (unique loadings) and a structure matrix (correlations), plus a factor correlation matrix.
- Interpretation and naming: examine which items load on each factor and name it by their common content. Items with low loadings or cross-loadings may be removed.
- Factor scores can be computed for each person for later analyses.

## Confirmatory factor analysis
In confirmatory factor analysis (CFA), the researcher specifies in advance how many factors exist, which items load on which factor and whether factors correlate, and then tests how well this model fits the data. It is part of structural equation modelling.
- Fit indices include chi-square (ideally non-significant, but sensitive to sample size), the comparative fit index and Tucker Lewis index (above about 0.90 to 0.95), the root mean square error of approximation (below about 0.06 to 0.08) and the standardised root mean square residual (below about 0.08).
- CFA can compare rival models (one factor versus three factors), test whether the structure is the same across groups (measurement invariance, such as across men and women or Hindi and English versions) and build higher-order models.

## EFA versus CFA
| Feature | Exploratory | Confirmatory |
| Purpose | Discover structure | Test a hypothesised structure |
| Prior theory | Little or none required | Essential |
| Loadings | All items may load on all factors | Fixed by the model |
| Output | Loadings, eigenvalues, variance explained | Fit indices, parameter estimates |
| Typical stage | Early test development | Validation, cross-cultural testing |
A common strategy is to run EFA on one half of a sample and CFA on the other.

## Example
A researcher develops a 24-item academic stress scale for Indian college students. EFA on 400 students gives a KMO of 0.86 and a significant Bartlett test. Parallel analysis suggests four factors, and after oblimin rotation the factors are named pressure from family, fear of failure, workload and peer comparison, explaining 58 percent of variance. A CFA in a new sample of 350 confirms the four-factor model with CFI 0.95 and RMSEA 0.05.

## Criticisms
- Subjectivity: choices about extraction, number of factors, rotation and naming can change results.
- Factors are statistical abstractions; naming them does not prove they exist as real entities (the reification problem). Stephen Jay Gould made this criticism of g.
- Results depend on the variables included: you cannot find a factor you did not measure.
- Sample-specific results that may not replicate.
- Assumes linear relations and continuous variables; ordinal items may need polychoric correlations.

## Conclusion
Factor analysis has shaped psychology's major theories of intelligence and personality and is central to test construction. EFA discovers structure; CFA tests it. Good practice uses adequate samples, parallel analysis, oblique rotation when factors may correlate, and confirmation in new samples.`,
    keyPoints: ["Definition and purposes", "Spearman, Thurstone, Cattell and Big Five examples", "Loadings, communalities and eigenvalues defined", "KMO and Bartlett's test", "Number of factors: Kaiser, scree and parallel analysis", "Orthogonal versus oblique rotation", "CFA with fit indices and invariance", "Criticisms including reification"],
    pitfalls: ["Equating PCA with factor analysis without comment", "Relying only on eigenvalues above 1", "Choosing varimax without considering correlated factors"],
    module: "statistics/3-7",
    visuals: [
      { kind: "timeline", data: { prompt: "Put the steps of exploratory factor analysis in order.", events: [{ label: "Collect an adequate sample" }, { label: "Check KMO and Bartlett's test" }, { label: "Extract factors" }, { label: "Decide how many factors to keep" }, { label: "Rotate to simple structure" }, { label: "Interpret and name the factors" }, { label: "Confirm in a new sample with CFA" }] } },
      { kind: "compare", data: { title: "Exploratory versus confirmatory", a: { label: "EFA", points: ["Finds structure from the data", "Every item can load on every factor", "Eigenvalues and scree plot"], summary: "Discovery." }, b: { label: "CFA", points: ["Model set before analysis", "Loadings fixed by theory", "Fit indices such as CFI and RMSEA"], summary: "Testing." } } },
    ],
    ref: "Tabachnick and Fidell ch 13; Field ch 18; Spearman 1904; Thurstone 1938; Hu and Bentler 1999 fit cut-offs; Horn 1965 parallel analysis; Gould 1981",
  },
  {
    id: "stat-l04-035",
    subject: S,
    topic: "factor-analysis",
    marks: 10,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester"],
    question: "Distinguish between principal component analysis and common factor analysis.",
    plan: ["Define each", "Variance analysed and the model", "Diagonal of the matrix and communalities", "Purpose and interpretation", "When results differ, and conclusion"],
    answer: `## Principal component analysis
Principal component analysis (PCA), developed by Karl Pearson and Harold Hotelling, is a data reduction technique. It transforms a set of correlated variables into a smaller set of uncorrelated components, each a weighted sum of the observed variables, chosen so that the first component explains as much of the total variance as possible, the second as much of what remains, and so on.

## Common factor analysis
Common factor analysis (such as principal axis factoring or maximum likelihood factor analysis) is a model of latent variables. It assumes that each observed variable is caused partly by common factors shared with other variables and partly by a unique factor (specific variance plus error). It explains only the shared (common) variance.

## Key differences
| Feature | PCA | Common factor analysis |
| Aim | Summarise data in fewer composites | Identify latent constructs that cause correlations |
| Variance analysed | Total variance (common, specific and error) | Common variance only |
| Diagonal of correlation matrix | 1s | Communality estimates |
| Direction of the model | Components are formed from variables | Variables are caused by factors |
| Error | Not modelled separately | Unique variance modelled explicitly |
| Results | Loadings usually larger, variance explained higher | Loadings somewhat smaller, more conservative |
| Use | Data reduction, creating composite scores, dealing with multicollinearity | Test development, theory of underlying traits |

## Illustration
Suppose a researcher measures six items on worry. PCA would form components that capture as much of the item variance as possible, including random error in each item. Factor analysis would ask what single latent anxiety trait (or two traits) could explain why the items correlate, treating each item's unshared variance as separate. If the aim is to understand the trait of anxiety, factor analysis matches the theory; if the aim is simply to reduce six items to one score for later regression, PCA is adequate.

## When results differ
With many variables and high communalities, PCA and factor analysis give similar solutions. With few variables or low communalities (many weak items), PCA inflates loadings and the variance explained, and the two methods can suggest different numbers of factors. For this reason many methodologists recommend common factor methods for psychological scale development, while PCA remains the default in some software, which explains its frequent use.

## Conclusion
PCA is a mathematical summary of total variance; factor analysis is a statistical model of shared variance caused by latent constructs. The choice should follow the research aim, and authors should state which they used rather than calling PCA "factor analysis".`,
    keyPoints: ["Definition of PCA as data reduction", "Definition of common factor model", "Total versus common variance", "Diagonal 1s versus communalities", "Causal direction difference", "Illustration and when results differ"],
    module: "statistics/3-7",
    visuals: [
      { kind: "compare", data: { title: "PCA versus factor analysis", a: { label: "PCA", points: ["Analyses total variance", "Components built from variables", "Higher loadings"], summary: "Summary of the data." }, b: { label: "Factor analysis", points: ["Analyses shared variance", "Factors cause the variables", "Unique variance kept apart"], summary: "Model of latent constructs." } } },
    ],
    ref: "Fabrigar et al 1999 Psychological Methods; Tabachnick and Fidell ch 13; Costello and Osborne 2005",
  },
  {
    id: "stat-l04-036",
    subject: S,
    topic: "sem",
    marks: 15,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "What is structural equation modelling? Explain its components, the steps in conducting it, the main fit indices and its strengths and limitations.",
    plan: ["Define SEM", "Measurement and structural models; latent and observed variables", "Path analysis as a special case", "Steps: specification, identification, estimation, evaluation, modification", "Fit indices table", "Strengths, limitations and an example"],
    answer: `## Meaning
Structural equation modelling (SEM) is a family of multivariate techniques for testing theories about relationships among observed and latent variables. It combines factor analysis (to measure latent constructs from several indicators) with path analysis or regression (to model the relationships among constructs) in a single model. Karl Joreskog's LISREL program made SEM widely available from the 1970s; today it is run in AMOS, Mplus or R's lavaan.

## Components
- Observed (manifest) variables: what is actually measured, such as items or test scores. Drawn as rectangles.
- Latent variables: unobserved constructs such as depression or self-efficacy, inferred from their indicators. Drawn as ovals.
- Measurement model: links each latent variable to its indicators, as in confirmatory factor analysis.
- Structural model: specifies the paths between latent variables, including direct and indirect (mediated) effects.
- Exogenous variables are not predicted by others in the model; endogenous variables are.
- Error terms for indicators and disturbances for endogenous latent variables.
- Single-headed arrows show hypothesised effects; double-headed arrows show correlations.

## Path analysis
Path analysis, developed by geneticist Sewall Wright, is SEM with observed variables only. It tests a system of regression equations and allows direct and indirect effects to be separated.

## Steps
- Specification: draw the model from theory, deciding which paths exist and which are fixed at zero.
- Identification: the model must have enough information (no more unknown parameters than the number of known variances and covariances) to be estimated. Models with more information than parameters are over-identified and can be tested.
- Estimation: usually by maximum likelihood, which assumes multivariate normality; robust estimators or weighted least squares are used for non-normal or ordinal data.
- Evaluation of fit: does the covariance matrix implied by the model reproduce the observed covariance matrix?
- Interpretation of parameter estimates: standardised path coefficients, R squared for endogenous variables, and indirect effects (often tested with bootstrapped confidence intervals).
- Modification: adding or removing paths using modification indices, done sparingly and only with theoretical justification, then cross-validated.

## Fit indices
| Index | Meaning | Good fit (common guides) |
| Chi-square | Exact fit test | Non-significant, but sensitive to large samples |
| CFI and TLI | Fit relative to a null model | Above 0.90, ideally 0.95 |
| RMSEA | Error of approximation per degree of freedom | Below 0.06 to 0.08 |
| SRMR | Average residual correlation | Below 0.08 |
| AIC and BIC | Compare non-nested models | Lower is better |

## Example
A researcher tests whether academic stress leads to depressive symptoms in Indian adolescents through poor sleep, with social support buffering stress. Latent variables of stress, sleep quality, social support and depression are each measured by three or four questionnaire indicators. The model fits well (CFI 0.96, RMSEA 0.05), the indirect effect of stress on depression through sleep is significant, and the model explains 38 percent of variance in depression.

## Strengths
- Tests whole theories, not single relationships.
- Models measurement error explicitly, giving less biased estimates of relationships between constructs.
- Estimates direct, indirect and total effects in one model.
- Tests measurement invariance across groups, such as genders, cultures or language versions.
- Handles longitudinal models, such as latent growth curves and cross-lagged panels.

## Limitations
- Requires large samples, often 200 or more, depending on model complexity.
- A good fit does not prove the model is correct: many equivalent models with different causal directions can fit equally well.
- With cross-sectional data, causal language is unjustified.
- Fit cut-offs are rules of thumb, not strict tests.
- Over-reliance on modification indices capitalises on chance.
- Technical complexity invites misuse.

## Conclusion
SEM is a powerful way to test theoretical models with latent variables and measurement error. Its conclusions are only as strong as the theory, the design and the data behind it, and fit statistics must be read alongside parameter estimates and alternative models.`,
    keyPoints: ["Definition combining factor and path analysis", "Latent versus observed variables and diagram conventions", "Measurement versus structural model", "Steps from specification to modification", "Identification explained", "Fit indices with cut-offs", "Worked example with mediation", "Equivalent models and causal limits"],
    module: "statistics/3-7",
    visuals: [
      { kind: "flow", data: { title: "A structural model", layout: "chain", nodes: [{ id: "s", label: "Academic stress", detail: "Latent, measured by four items." }, { id: "sl", label: "Poor sleep", detail: "Latent mediator." }, { id: "d", label: "Depressive symptoms", detail: "Latent outcome, R squared 0.38." }], edgeLabels: { "s>sl": "path a", "sl>d": "path b" }, caption: "The indirect effect a x b is tested with bootstrapped confidence intervals." } },
    ],
    ref: "Kline, Principles and Practice of SEM 4th ed; Hu and Bentler 1999; MacCallum et al 1993 equivalent models",
  },
  {
    id: "stat-l04-037",
    subject: S,
    topic: "regression",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Distinguish between mediation and moderation. How is each tested statistically? Give psychological examples.",
    plan: ["Define mediation with example", "Testing mediation: Baron and Kenny, indirect effect, bootstrapping", "Define moderation with example", "Testing moderation: interaction term, simple slopes", "Comparison and moderated mediation", "Conclusion"],
    answer: `## Mediation
A mediator explains how or why an independent variable affects an outcome. It is the mechanism in a causal chain X to M to Y.
Example: childhood adversity (X) increases adult depression (Y) partly by producing negative core beliefs (M). Another: exercise improves mood through better sleep.

## Testing mediation
- Reuben Baron and David Kenny's classic steps: X predicts Y (path c); X predicts M (path a); M predicts Y controlling for X (path b); the effect of X on Y drops when M is controlled (path c prime). Full mediation means c prime is no longer significant; partial mediation means it is reduced.
- Modern approach: the key test is the indirect effect, a x b. The Sobel test assumes the product is normally distributed, which is often false, so bootstrapping (resampling the data thousands of times to build a confidence interval) is preferred. If the 95 percent confidence interval for a x b excludes zero, mediation is supported. Andrew Hayes's PROCESS macro made this routine.
- A significant total effect of X on Y is no longer considered necessary.
- Mediation is a causal claim. It needs a sound theory and ideally temporal order, with X measured before M and M before Y. Cross-sectional mediation is weak evidence.

## Moderation
A moderator changes the strength or direction of the relationship between X and Y. It answers when, for whom or under what conditions an effect holds.
Example: stressful life events (X) predict depression (Y) more strongly in people with low social support (W), the buffering hypothesis of Sheldon Cohen. Another: the effect of a reading intervention depends on children's baseline ability.

## Testing moderation
- Include X, W and their product term (X times W) in a regression, usually after centring X and W to reduce multicollinearity and aid interpretation.
- A significant interaction term indicates moderation. In ANOVA terms, moderation is an interaction.
- Probe the interaction with simple slopes: the effect of X on Y at low (minus 1 SD), average and high (plus 1 SD) values of W, and the Johnson Neyman technique, which finds the values of W at which the effect becomes significant.
- Plot the interaction.

## Comparison
| Feature | Mediator | Moderator |
| Question | How or why? | When or for whom? |
| Causal role | Caused by X, causes Y | Not caused by X; alters the X to Y link |
| Statistical test | Indirect effect a x b, bootstrapped | Interaction term X x W |
| Example | Exercise improves mood via sleep | Stress predicts depression more with low support |

## Combined models
In moderated mediation, an indirect effect depends on a moderator: for instance, adversity leads to depression through negative beliefs more strongly in adolescents than in adults. In mediated moderation, an interaction works through a mediator.

## Conclusion
Mediators reveal mechanisms; moderators reveal boundary conditions. Both are central to testing theories and tailoring interventions, but each requires careful design, appropriate tests and caution about causal language.`,
    keyPoints: ["Mediator defined as mechanism with example", "Baron and Kenny steps", "Indirect effect with bootstrapping", "Moderator defined as condition with example", "Interaction term, centring and simple slopes", "Comparison table", "Moderated mediation and causal cautions"],
    module: "statistics/3-5",
    visuals: [
      { kind: "flow", data: { title: "Mediation", layout: "chain", nodes: [{ id: "x", label: "Childhood adversity" }, { id: "m", label: "Negative core beliefs" }, { id: "y", label: "Adult depression" }], edgeLabels: { "x>m": "a", "m>y": "b" }, caption: "The indirect effect is a x b." } },
      { kind: "compare", data: { title: "Mediator versus moderator", a: { label: "Mediator", points: ["Answers how or why", "Lies between X and Y", "Test the indirect effect"], summary: "Mechanism." }, b: { label: "Moderator", points: ["Answers when or for whom", "Changes the X to Y link", "Test the interaction term"], summary: "Condition." } } },
    ],
    ref: "Baron and Kenny 1986; Hayes 2018 Introduction to Mediation, Moderation and Conditional Process Analysis; Cohen and Wills 1985 buffering",
  },
  {
    id: "stat-l04-038",
    subject: S,
    topic: "spss-output",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Interpret the following output for an independent samples t-test comparing exam stress in male and female students. Group statistics: men N = 30, mean 24.5, SD 5.2; women N = 30, mean 28.1, SD 5.8. Levene's test: F = 0.84, p = .36. t-test (equal variances assumed): t = minus 2.53, df = 58, p (two-tailed) = .014, mean difference minus 3.60, 95 percent CI minus 6.45 to minus 0.75.",
    plan: ["Describe the group statistics", "Interpret Levene's test and choose the row", "Interpret t, df and p", "Interpret the confidence interval", "Calculate effect size and write the APA report", "Cautions"],
    answer: `## Group statistics
Women reported higher exam stress (M = 28.1, SD = 5.8) than men (M = 24.5, SD = 5.2). The groups are equal in size and their SDs are similar. The raw difference is 3.6 points.

## Levene's test
Levene's test checks the assumption of equal variances. Its null hypothesis is that the population variances are equal. Here F = 0.84, p = .36, which is not significant, so the assumption holds and we read the row labelled "equal variances assumed". If p had been below .05, we would read the "equal variances not assumed" row, which gives Welch's t with adjusted df. A common student error is to treat Levene's p as the result of the main test.

## The t-test
- t = minus 2.53. The sign only reflects which group was entered first (men minus women); it does not matter for the conclusion.
- df = N1 + N2 minus 2 = 58.
- p = .014, below .05, so the null hypothesis of equal means is rejected. The difference in stress between men and women is statistically significant.
- Checking by hand: pooled SD = square root of [(29 x 27.04 + 29 x 33.64) / 58] = 5.51; SE of the difference = 5.51 x square root of (2/30) = 1.42; t = minus 3.6 / 1.42 = minus 2.53, as reported.

## Confidence interval
The 95 percent CI for the difference (men minus women) runs from minus 6.45 to minus 0.75. It does not include zero, which matches the significant p. It also shows that the true difference could be as small as about 0.75 points or as large as about 6.45 points, a wide range that reflects the modest sample.

## Effect size
SPSS versions before 27 did not report it, so it is calculated: Cohen's d = 3.60 / 5.51 = 0.65, a medium to large effect.

## APA style report
An independent samples t-test showed that women (M = 28.10, SD = 5.80) reported significantly higher exam stress than men (M = 24.50, SD = 5.20), t(58) = 2.53, p = .014, d = 0.65, 95 percent CI for the difference [0.75, 6.45].

## Cautions
- Gender was not manipulated, so this is a group comparison, not a causal result. Women may report stress more readily (reporting bias), or may face different pressures.
- The sample of 60 from one college may not generalise.
- The stress scale's reliability should be reported.
- Normality within each group should be checked, though with 30 per group the t-test is robust.

## Conclusion
The output shows a significant, medium to large difference in exam stress, with women higher. Reading the output correctly means checking Levene's test first, choosing the right row, and reporting the CI and effect size, not only p.`,
    keyPoints: ["Describes group means and SDs", "Correct use of Levene's test to choose the row", "Interprets t, df and p", "Interprets the CI and links it to p", "Calculates d = 0.65", "Correct APA report", "Non-causal caution"],
    pitfalls: ["Treating Levene's p as the main result", "Worrying about the negative sign of t"],
    module: "statistics/3-8",
    visuals: [
      { kind: "decide", data: { scene: "Levene's test gives F = 6.10, p = .02 for a t-test comparing two groups.", ask: "Which row of the t-test output should you read?", choices: [{ label: "Equal variances assumed", verdict: "harm", outcome: "You use a pooled variance that the data do not support.", why: "A significant Levene's test means the variances differ." }, { label: "Equal variances not assumed", verdict: "best", outcome: "You report Welch's t with adjusted df.", why: "Welch's test does not assume equal variances." }, { label: "Report Levene's p as the answer", verdict: "harm", outcome: "You confuse the assumption check with the main test.", why: "Levene's test is only about variances, not means." }] } },
    ],
    ref: "Field ch 10; Pallant SPSS Survival Manual ch 17. Python check: pooled SD 5.508, SE 1.422, t -2.531, p 0.0141, d 0.654, CI -6.45 to -0.75.",
  },
  {
    id: "stat-l04-039",
    subject: S,
    topic: "spss-output",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "cuet-pg"],
    question: "How does a researcher choose the appropriate statistical test? Describe the decision process and apply it to five research situations.",
    plan: ["The key questions in choosing a test", "Decision guide by purpose, design and data", "Assumption checks", "Apply to five vignettes", "Common errors and conclusion"],
    answer: `## The key questions
Choosing a statistical test follows from the research question and design, not from habit. The researcher asks:
- What is the aim: to describe, to compare groups, to examine a relationship, or to predict?
- What kind of DV: nominal (categories), ordinal (ranks) or interval and ratio (scores)?
- How many IVs or predictors, and how many levels?
- Are the groups independent or related (the same or matched people)?
- Are the assumptions of parametric tests met: normality, equal variances, independence?
- How large is the sample?

## Decision guide
| Aim and design | Interval data meeting assumptions | Ordinal or non-normal | Nominal |
| Two independent groups | Independent t-test | Mann Whitney U | Chi-square (2 x k) |
| Two related measures | Paired t-test | Wilcoxon signed rank | McNemar |
| Three or more independent groups | One-way ANOVA | Kruskal Wallis | Chi-square |
| Three or more related measures | Repeated measures ANOVA | Friedman | Cochran's Q |
| Two or more IVs | Factorial ANOVA | Limited options | Log-linear analysis |
| Relationship between two variables | Pearson r | Spearman rho, Kendall tau | Phi, Cramer's V |
| Prediction of a score from several predictors | Multiple regression | | |
| Prediction of a category | Logistic regression or discriminant analysis | | |
| Group differences with a covariate | ANCOVA | | |
| Several DVs | MANOVA | | |
| Structure of many variables | Factor analysis | | |

## Assumption checks
Normality (histograms, Q-Q plots, Shapiro Wilk test, skewness and kurtosis), homogeneity of variance (Levene's test), linearity and outliers (scatter plots), and independence (from the design). Moderate violations with large, equal groups are often tolerable; otherwise use a non-parametric test, a transformation, a robust method or bootstrapping.

## Applying the guide
- Situation 1: A psychologist compares depression scores of patients receiving CBT, IPT and medication, 40 patients per group, scores roughly normal. Aim: compare three independent groups on interval data. Test: one-way ANOVA, followed by Tukey post hoc tests, with eta squared.
- Situation 2: Researchers record whether 300 students from urban and rural colleges have ever used tobacco (yes or no). Aim: association between two categorical variables. Test: chi-square test of independence (2 x 2), with phi or odds ratio.
- Situation 3: Eight children with autism are rated on social communication (a 1 to 5 rating) before and after a parent training programme. Aim: two related measurements, ordinal data, tiny sample. Test: Wilcoxon signed rank test.
- Situation 4: A study asks whether hours of sleep, screen time and social support together predict wellbeing scores in 250 adolescents. Aim: prediction from several continuous predictors. Test: multiple regression, checking multicollinearity and residuals.
- Situation 5: A trial examines therapy (CBT versus supportive) and gender (male versus female) on anxiety scores. Aim: two IVs and their interaction. Test: two-way between-subjects ANOVA. If baseline anxiety is to be controlled, a two-way ANCOVA.

## After choosing the test
The analysis plan should also state the alpha level, whether tests are one or two-tailed, how outliers and missing data will be handled, which effect size will be reported, and how multiple comparisons will be corrected. For example, for Situation 1 the plan might read: one-way ANOVA with alpha 0.05, Levene's test for homogeneity with Welch's ANOVA as a fallback, Tukey HSD for pairwise comparisons, and eta squared with 95 percent confidence intervals.

## Common errors
- Running several t-tests instead of ANOVA, inflating Type I error.
- Using an independent test for paired data, or the reverse.
- Applying chi-square to percentages or to repeated measures.
- Calculating Pearson r for clearly non-linear or ranked data.
- Choosing a test after seeing which gives a significant result.
- Ignoring effect sizes and confidence intervals.

## Conclusion
A sound choice of test flows from the aim, the type of data, the number of variables and groups, the design and the assumptions. Writing this down before collecting data, ideally in a preregistered analysis plan, prevents both errors and questionable practices.`,
    keyPoints: ["Key questions about aim, data level, design and assumptions", "Accurate decision table", "Assumption checks named", "Five vignettes correctly matched", "Effect sizes or follow-up tests mentioned", "Common errors listed"],
    module: "statistics/3-8",
    visuals: [
      { kind: "flow", data: { title: "Comparing groups: a decision tree", layout: "tree", nodes: [{ id: "q", label: "Comparing groups on a score" }, { id: "two", label: "Two groups", parent: "q" }, { id: "more", label: "Three or more groups", parent: "q" }, { id: "ti", label: "Independent: t-test or Mann Whitney", parent: "two" }, { id: "tr", label: "Related: paired t or Wilcoxon", parent: "two" }, { id: "mi", label: "Independent: ANOVA or Kruskal Wallis", parent: "more" }, { id: "mr", label: "Related: repeated measures ANOVA or Friedman", parent: "more" }] } },
      { kind: "sort", data: { prompt: "Pick the test.", buckets: ["Chi-square", "Paired t-test", "Pearson r", "One-way ANOVA"], items: [{ text: "Smoker or not, by urban or rural", bucket: 0 }, { text: "Anxiety before and after therapy in 40 patients", bucket: 1 }, { text: "Link between IQ and marks in 200 students", bucket: 2 }, { text: "Memory scores under three diets", bucket: 3 }] } },
    ],
    ref: "Field ch 1 and appendix decision chart; Pallant ch 10; Gravetter and Wallnau ch 20",
  },
  {
    id: "stat-l04-040",
    subject: S,
    topic: "spss-output",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "A correlation matrix for 100 students shows: anxiety and self-esteem r = minus 0.45; anxiety and marks r = minus 0.15; self-esteem and marks r = 0.32; anxiety and sleep hours r = minus 0.28. Interpret the matrix.",
    plan: ["Find the critical value", "Interpret each coefficient's direction, size and significance", "Note shared variance", "Caution on causation"],
    answer: `## Critical value
With N = 100, df = 98. The critical value of r at 0.05 (two-tailed) is about 0.197, and at 0.01 about 0.256. Coefficients larger than these in absolute size are significant.

## Interpretation
| Pair | r | Significance | Meaning |
| Anxiety and self-esteem | minus 0.45 | p < .01 | Moderate to strong negative: more anxious students tend to have lower self-esteem; about 20 percent shared variance |
| Anxiety and marks | minus 0.15 | Not significant | A weak negative trend that could be chance; about 2 percent shared variance |
| Self-esteem and marks | 0.32 | p < .01 | Moderate positive: students with higher self-esteem tend to score higher; about 10 percent shared variance |
| Anxiety and sleep | minus 0.28 | p < .01 | Small to moderate negative: anxious students tend to sleep less; about 8 percent shared variance |

## Overall picture
Anxiety is most closely linked to low self-esteem and shorter sleep, while marks relate more to self-esteem than to anxiety. A researcher might next test whether self-esteem explains the weak link between anxiety and marks using partial correlation or regression.

## Cautions
- Correlation does not show cause: poor sleep may raise anxiety, anxiety may disturb sleep, or a third factor such as exam pressure may affect both.
- With several correlations tested, some significant results may arise by chance; a Bonferroni-adjusted alpha would be 0.05 / 4 = 0.0125.
- Scatter plots should be checked for non-linearity and outliers.`,
    keyPoints: ["Correct df and critical r about 0.20", "Each coefficient interpreted for direction, size and significance", "Shared variance r squared", "Overall pattern", "Causation and multiple testing cautions"],
    module: "statistics/3-8",
    visuals: [
      { kind: "reveal", data: { prompt: "Would r = minus 0.15 be significant with 400 students instead of 100?", answer: "Yes. With df = 398 the critical r at 0.05 is about 0.098, so minus 0.15 would be significant, though it would still explain only about 2 percent of the variance." } },
    ],
    ref: "Garrett table of critical r. Python: r crit df 98 = 0.1966 (.05), df 398 = 0.098.",
  },
];
