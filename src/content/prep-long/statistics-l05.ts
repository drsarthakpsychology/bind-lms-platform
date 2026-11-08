import type { LongQA } from "@/lib/prep/long-types";

const S = "statistics" as const;

export const STATISTICS_L05: LongQA[] = [
  {
    id: "stat-l05-041",
    subject: S,
    topic: "descriptives",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Why is data screening necessary before statistical analysis? Describe how a researcher checks for errors, missing data, outliers and violations of normality, and what can be done about each.",
    plan: ["Purpose of data screening", "Accuracy of data entry", "Missing data: types and handling", "Outliers: detection and decisions", "Normality and other assumptions, transformations", "Conclusion"],
    answer: `## Purpose
Data screening (data cleaning) is the systematic checking of a dataset before the main analysis. Errors, missing values and extreme scores can distort means, inflate or hide correlations, and violate the assumptions of tests, leading to wrong conclusions. Screening is a routine, reported part of good research, not an optional extra.

## Accuracy of data entry
- Run frequency tables and descriptive statistics for every variable and look for impossible values, such as an age of 210 or a response of 7 on a 1 to 5 scale.
- Check minimum, maximum and the number of cases.
- Double-enter a sample of questionnaires, or all of them, and compare.
- Check that reverse-scored items have been reversed.

## Missing data
Types, following Donald Rubin:
- Missing completely at random (MCAR): missingness unrelated to any variable, such as a page lost in the post.
- Missing at random (MAR): missingness related to observed variables, such as younger participants skipping more items.
- Missing not at random (MNAR): missingness related to the missing value itself, such as the most depressed people skipping depression items.
Handling:
- Listwise deletion (dropping cases with any missing value) is simple but wastes data and biases results unless data are MCAR.
- Pairwise deletion uses all available pairs but can give inconsistent matrices.
- Mean substitution reduces variance and should be avoided.
- Multiple imputation and full information maximum likelihood are the recommended modern methods under MAR.
- Report how much data were missing and how they were handled.

## Outliers
An outlier is a score very different from the rest.
- Univariate detection: z scores beyond about plus or minus 3.29, or box plots showing points beyond 1.5 interquartile ranges from the quartiles.
- Multivariate detection: Mahalanobis distance for unusual combinations, and Cook's distance and leverage for cases that strongly influence a regression.
- Decide why the outlier exists. If it is an error, correct or delete it. If it is a genuine but extreme case, options include running the analysis with and without it, transforming the variable, changing the score to one unit beyond the next most extreme score (winsorising), or using robust or non-parametric methods. Deleting inconvenient cases without a rule decided in advance is a questionable practice.

## Normality and other assumptions
- Normality: histograms, Q-Q plots, skewness and kurtosis values (divided by their standard errors), and the Shapiro Wilk or Kolmogorov Smirnov tests. Formal tests are oversensitive with large samples, so plots are given weight.
- Linearity and homoscedasticity: scatter plots and residual plots.
- Homogeneity of variance: Levene's test.
- Multicollinearity: correlations, tolerance and VIF.
Remedies: transformations (square root for moderate positive skew, logarithm for strong positive skew such as reaction times or income, reciprocal for severe skew; reflect first for negative skew), non-parametric tests, robust tests or bootstrapping.

## Conclusion
Screening protects the validity of statistical conclusions. A researcher should check accuracy, handle missing data appropriately, examine outliers with a clear rule, test assumptions, and report every decision so that readers can judge its effect.`,
    keyPoints: ["Purpose of screening", "Checks for entry errors", "MCAR, MAR and MNAR", "Multiple imputation preferred over mean substitution", "Univariate and multivariate outlier detection", "Decisions about outliers", "Normality checks and transformations", "Transparent reporting"],
    module: "statistics/1-3",
    visuals: [
      { kind: "sort", caption: "Missing data", data: { prompt: "What type of missing data is each?", buckets: ["Completely at random", "At random", "Not at random"], items: [{ text: "A data file is corrupted for 20 random participants", bucket: 0 }, { text: "Older people skip the online module more often, and age is recorded", bucket: 1 }, { text: "Heavy drinkers skip the question on alcohol use", bucket: 2 }] } },
    ],
    ref: "Tabachnick and Fidell ch 4; Rubin 1976; Field ch 6",
  },
  {
    id: "stat-l05-042",
    subject: S,
    topic: "estimation",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Write a short note on the central limit theorem and its importance in psychology.",
    plan: ["State the theorem", "Mean and SE of the sampling distribution", "Example", "Importance"],
    answer: `## Statement
The central limit theorem states that, for samples of size N drawn randomly from any population with mean mu and standard deviation sigma, the sampling distribution of the sample mean:
- has a mean equal to the population mean,
- has a standard deviation (the standard error) equal to sigma divided by the square root of N, and
- approaches a normal distribution as N increases, whatever the shape of the population distribution.
A sample size of about 30 is often enough for the approximation to be good, although very skewed populations need larger samples.

## Example
Reaction times are strongly positively skewed. If we repeatedly take samples of 50 reaction times and calculate each sample's mean, the distribution of those means will be approximately normal and much narrower than the original distribution. If the population SD is 100 milliseconds, the standard error of the mean with N = 50 is 100 / 7.07, about 14 milliseconds.

## Importance
- It justifies using z and t tests, confidence intervals and ANOVA on sample means even when individual scores are not normally distributed, provided samples are reasonably large.
- It explains why larger samples give more precise estimates: the standard error shrinks with the square root of N.
- It underlies the normality of many measurement errors, since errors are often the sum of many small independent influences.
- It explains why the normality assumption matters most for small samples.
The theorem applies to means and sums, not to individual scores; a large sample does not make the data themselves normal.`,
    keyPoints: ["Three parts of the theorem", "SE formula", "Example with a skewed variable", "Justification for parametric tests", "Applies to means, not raw scores"],
    module: "statistics/2-2",
    visuals: [
      { kind: "reveal", caption: "Statement", data: { prompt: "Population SD is 20. What sample size halves the standard error obtained with N = 25?", answer: "With N = 25, SE = 20 / 5 = 4. To get 2 you need square root of N = 10, so N = 100. Halving the error needs four times the sample." } },
    ],
    ref: "Gravetter and Wallnau ch 7. 100/sqrt(50) = 14.14.",
  },
  {
    id: "stat-l05-043",
    subject: S,
    topic: "estimation",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "md-psychiatry"],
    question: "Why do modern guidelines recommend confidence intervals in addition to p values? A study of 40 students in each of two groups found mean wellbeing of 24 after a gratitude programme and 20 in the control group, with SD 6 in both. Calculate the 95 percent confidence interval for the difference and interpret it.",
    plan: ["Point and interval estimation", "Limits of p values alone", "Worked CI for the difference", "Interpretation and link with significance", "Conclusion"],
    answer: `## Point and interval estimates
A point estimate is a single best guess of a population value, such as a sample mean difference of 4 points. An interval estimate gives a range of plausible values, a confidence interval (CI), together with a confidence level such as 95 percent. The width of the interval shows the precision of the estimate.

## Why p values alone are not enough
- A p value says only whether a result is surprising under the null hypothesis; it gives no information about the size of the effect.
- The same p can arise from a large effect in a small sample or a trivial effect in a huge sample.
- p values vary greatly from one replication to another, which Geoff Cumming called the "dance of the p values".
- They encourage yes or no thinking around an arbitrary 0.05 line.
A CI shows the size of the effect, its precision and, indirectly, its significance.

## Worked example
- Mean difference = 24 minus 20 = 4.
- SE of the difference = square root of (6 squared / 40 + 6 squared / 40) = square root of (0.9 + 0.9) = square root of 1.8 = 1.34.
- df = 40 + 40 minus 2 = 78; critical t (0.05, two-tailed) = 1.99.
- Margin of error = 1.99 x 1.34 = 2.67.
- 95 percent CI = 4 plus or minus 2.67 = 1.33 to 6.67.
- t = 4 / 1.34 = 2.98, p = .004. Cohen's d = 4 / 6 = 0.67.

## Interpretation
- The programme group's mean wellbeing was 4 points higher, and the data are consistent with a true difference anywhere from about 1.3 to 6.7 points.
- Because the interval excludes zero, the difference is significant at the 0.05 level. In general, a 95 percent CI that excludes the null value corresponds to p below 0.05.
- The lower limit is modest, so the programme may have only a small benefit; the upper limit is fairly large. A larger study would narrow the range.
- Strictly, 95 percent of intervals constructed this way across repeated samples would contain the true difference; this particular interval either does or does not.

## Uses of CIs
- Judging clinical importance: if the smallest worthwhile improvement on the wellbeing scale is 5 points, the CI shows that a worthwhile effect is plausible but not established.
- Comparing studies: overlapping intervals give a quick visual comparison.
- Meta-analysis: forest plots display each study's CI.
- Planning: the width of the interval guides sample size for future studies (precision planning).

## Conclusion
Confidence intervals add what p values lack: the size and precision of an effect. The APA manual recommends reporting them for all main results, alongside effect sizes. In this example the gratitude programme raised wellbeing by about 4 points, with a 95 percent CI of 1.3 to 6.7.`,
    keyPoints: ["Point versus interval estimation", "Limits of p values", "Correct SE 1.34", "Correct CI 1.33 to 6.67", "t and d calculated", "Link between CI excluding zero and significance", "Clinical importance and precision"],
    module: "statistics/2-2",
    visuals: [
      { kind: "worked", caption: "Worked example", data: { title: "CI for a mean difference", steps: [{ q: "SE of the difference?", a: "Square root of (0.9 + 0.9) = 1.34" }, { q: "Margin of error?", a: "1.99 x 1.34 = 2.67" }, { q: "95 percent CI?", a: "4 plus or minus 2.67: 1.33 to 6.67" }, { q: "Does it include zero?", a: "No, so p < .05 (here p = .004)." }] } },
    ],
    ref: "Cumming 2014 Psychological Science New Statistics; APA Manual 7th ed. Python: SE 1.3416, t crit 1.9908, CI 1.329 to 6.671, t 2.981, p 0.0038.",
  },
  {
    id: "stat-l05-044",
    subject: S,
    topic: "anova",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "A researcher compared four relaxation techniques with 10 participants each. The partial ANOVA output reads: SS between = 120, SS within = 360. Complete the ANOVA table, test the null hypothesis at 0.05, calculate the effect size, and explain what further analysis is needed and what the results mean.",
    plan: ["Identify N, k and df", "Calculate MS and F", "Compare with the critical value and decide", "Effect size and its meaning", "Follow-up analysis and assumptions", "Interpretation and limitations"],
    answer: `## Setting up
- Number of groups k = 4, participants per group n = 10, total N = 40.
- df between = k minus 1 = 3.
- df within = N minus k = 36.
- df total = N minus 1 = 39.
- SS total = 120 + 360 = 480.

## Completing the table
| Source | SS | df | MS | F |
| Between groups | 120 | 3 | 40 | 4.00 |
| Within groups | 360 | 36 | 10 | |
| Total | 480 | 39 | | |
- MS between = 120 / 3 = 40.
- MS within = 360 / 36 = 10.
- F = 40 / 10 = 4.00.

## Decision
The critical F for 3 and 36 df at 0.05 is about 2.87; at 0.01 it is about 4.38. The obtained F of 4.00 exceeds 2.87 but not 4.38, so H0 is rejected at the 0.05 level (exact p is about 0.015). At least one technique differs from the others in mean relaxation outcome.

## Effect size
- Eta squared = SS between / SS total = 120 / 480 = 0.25. The technique used accounts for 25 percent of the variation in outcome, a large effect by Cohen's guide (0.14 and above).
- Omega squared, a less biased estimate, = (SS between minus df between x MS within) / (SS total + MS within) = (120 minus 30) / (480 + 10) = 90 / 490 = 0.18, still large.

## What the F means
F is the ratio of variance between groups to variance within groups. An F of 4 means the spread of the group means is four times larger than we would expect from individual differences and error alone. It does not tell us which techniques differ.

## Further analysis needed
- Post hoc tests, such as Tukey's HSD with equal group sizes, to identify which pairs of techniques differ, controlling the familywise error rate. Alternatively, if hypotheses were stated in advance (such as "progressive muscle relaxation will be better than the other three"), planned contrasts.
- Descriptive statistics for each group (means, SDs, CIs) and a plot of means with error bars.
- Assumption checks: Levene's test for equal variances (Welch's ANOVA or Games Howell tests if violated), normality of residuals, independence through random assignment.
- Report: F(3, 36) = 4.00, p = .015, eta squared = .25.

## Interpretation and limitations
The relaxation techniques differ in their effect, and the difference is substantial. But:
- With 10 per group, estimates of each group's mean are imprecise, and the 95 percent CI around eta squared would be wide.
- Unless participants were randomly assigned, group differences could reflect pre-existing differences.
- The outcome measure's reliability affects the result.
- Statistical significance at 0.05 but not 0.01 suggests the evidence is moderate, and a replication would be valuable.

## Conclusion
The completed table gives F(3, 36) = 4.00, which is significant at 0.05 with a large effect size. The next steps are post hoc or planned comparisons, assumption checks and careful reporting of group means.`,
    keyPoints: ["Correct df 3, 36, 39", "MS 40 and 10, F = 4.00", "Critical F 2.87 and decision", "Eta squared 0.25 and omega squared 0.18", "Meaning of F explained", "Post hoc tests and assumption checks", "Limitations and APA report"],
    module: "statistics/3-1",
    visuals: [
      { kind: "worked", caption: "Effect size", data: { title: "Filling an ANOVA table", steps: [{ q: "df between and within?", a: "4 minus 1 = 3; 40 minus 4 = 36" }, { q: "Mean squares?", a: "120 / 3 = 40; 360 / 36 = 10" }, { q: "F?", a: "40 / 10 = 4.00" }, { q: "Effect size?", a: "120 / 480 = 0.25" }], yourTurn: [{ q: "If SS within were 720, what would F be?", a: "MS within = 20, so F = 40 / 20 = 2.00, not significant." }] } },
    ],
    ref: "Gravetter and Wallnau ch 12. Python: F 4.0, p 0.0148, F crit(3,36) .05 = 2.866, .01 = 4.38; omega2 = 90/490 = 0.184.",
  },
  {
    id: "stat-l05-045",
    subject: S,
    topic: "descriptives",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write a short note on percentiles and percentile ranks, with an example.",
    plan: ["Define percentile and percentile rank", "Quartiles and deciles", "Worked percentile rank", "Uses and limitation"],
    answer: `## Meaning
A percentile is a point on the score scale below which a given percentage of scores fall. The 75th percentile is the score below which 75 percent of the group scored. A percentile rank (PR) is the reverse: the percentage of the group scoring below a given score. If Arjun's PR is 80, he scored higher than 80 percent of the group.

## Related points
- Quartiles divide the distribution into four equal parts: Q1 is the 25th percentile, Q2 (the median) is the 50th and Q3 is the 75th.
- Deciles divide it into ten parts.
- The interquartile range (Q3 minus Q1) contains the middle 50 percent of scores.

## Worked example
In a class of 40 students, 28 scored below 65 and 4 scored exactly 65. A common formula is PR = [(number below + half the number at the score) / N] x 100.
- PR = [(28 + 2) / 40] x 100 = 75.
A score of 65 has a percentile rank of 75.

## Uses
- Reporting test results in a form parents and teachers understand, such as school achievement tests and entrance examinations.
- Norm tables in psychological tests.
- Making no assumption about the shape of the distribution.

## Limitation
Percentiles are ordinal: equal differences in percentile do not mean equal differences in score. Near the middle of a normal distribution, a small raw score change moves the percentile a lot; at the extremes, a large raw change moves it only a little. Moving from the 50th to the 60th percentile takes about 0.25 SD, while moving from the 90th to the 99th takes about 1.05 SD. Percentiles should therefore not be averaged.`,
    keyPoints: ["Percentile versus percentile rank", "Quartiles and deciles", "Correct PR = 75", "Practical uses", "Ordinal nature and unequal spacing"],
    module: "statistics/1-4",
    visuals: [
      { kind: "curve", caption: "Limitation", data: { kind: "normal", caption: "Move from z = 0 to z = 0.25: about 10 percentile points. From z = 1.28 to z = 2.33: only 9 more." } },
    ],
    ref: "Garrett ch 4. norm.ppf(.6)=0.253, ppf(.9)=1.2816, ppf(.99)=2.326.",
  },
  {
    id: "stat-l05-046",
    subject: S,
    topic: "correlation",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Describe the special correlation methods: point biserial, biserial, phi, tetrachoric and contingency coefficients. When is each used?",
    plan: ["Why special correlations are needed", "Point biserial and biserial", "Phi and tetrachoric", "Contingency coefficient and Cramer's V", "Summary table and uses in test construction"],
    answer: `## Why special correlations
Pearson's r assumes two continuous variables. Many psychological variables are dichotomous (pass or fail, yes or no, male or female) or categorical. Special coefficients handle these cases. The key question is whether a dichotomous variable is a true dichotomy (genuinely two categories) or an artificial dichotomy (a continuous variable cut into two, such as pass or fail on a continuous test).

## Point biserial correlation
Used when one variable is continuous and the other a true dichotomy. Example: the correlation between gender and an anxiety score, or between answering a test item correctly (1 or 0) and total test score in item analysis. It is mathematically identical to Pearson r with the dichotomy coded 0 and 1, and it is directly related to the independent t-test: r squared = t squared / (t squared + df).

## Biserial correlation
Used when one variable is continuous and the other is an artificial dichotomy assumed to have an underlying normal continuous distribution. Example: correlating a continuous aptitude score with "passed or failed the final exam", where performance is really continuous. The biserial r estimates what the Pearson r would be if the dichotomised variable had been measured continuously; it is larger than the point biserial for the same data and can exceed 1 in odd samples.

## Phi coefficient
Used when both variables are true dichotomies, arranged in a 2 x 2 table. Example: smoker or non-smoker by alcohol user or not. Phi = square root of (chi-square / N) and equals Pearson r for two 0 and 1 variables. Its maximum depends on the marginal proportions, so it can be less than 1 even with the strongest possible association.

## Tetrachoric correlation
Used when both variables are artificial dichotomies of underlying normal variables. Example: two test items scored right or wrong, assumed to reflect continuous abilities. It estimates the correlation between the underlying continuous variables and is used in factor analysis of dichotomous items. The polychoric correlation extends this to ordinal variables with more than two categories, such as Likert items.

## Contingency coefficient and Cramer's V
For two nominal variables with more than two categories, such as religion and preferred type of healer.
- Contingency coefficient C = square root of [chi-square / (chi-square + N)]. Its maximum is below 1 and depends on table size, making comparisons difficult.
- Cramer's V = square root of [chi-square / (N x (k minus 1))], where k is the smaller of rows or columns. It ranges from 0 to 1 and is preferred.

## Summary
| Variable 1 | Variable 2 | Coefficient |
| Continuous | Continuous | Pearson r |
| Ranks | Ranks | Spearman rho, Kendall tau |
| Continuous | True dichotomy | Point biserial |
| Continuous | Artificial dichotomy | Biserial |
| True dichotomy | True dichotomy | Phi |
| Artificial dichotomy | Artificial dichotomy | Tetrachoric |
| Nominal | Nominal | Contingency coefficient, Cramer's V |

## Use in test construction
Item analysis relies on point biserial (item-total) and biserial correlations to judge item discrimination, and on tetrachoric or polychoric correlations for factor analysis of item responses.

## Conclusion
Choosing the right coefficient depends on the scale of each variable and whether dichotomies are natural or artificial. Using Pearson r on Likert items or artificial dichotomies can underestimate relationships and distort factor structures.`,
    keyPoints: ["True versus artificial dichotomy", "Point biserial with example and link to t", "Biserial assumptions", "Phi with formula", "Tetrachoric and polychoric", "Contingency coefficient and Cramer's V", "Summary table", "Use in item analysis"],
    module: "statistics/2-4",
    visuals: [
      { kind: "sort", caption: "Tetrachoric correlation", data: { prompt: "Choose the coefficient.", buckets: ["Point biserial", "Phi", "Tetrachoric", "Cramer's V"], items: [{ text: "Gender and depression score", bucket: 0 }, { text: "Smoker or not and drinker or not", bucket: 1 }, { text: "Two test items scored right or wrong", bucket: 2 }, { text: "State of residence and preferred healer", bucket: 3 }] } },
    ],
    ref: "Garrett ch 14; Guilford and Fruchter Fundamental Statistics ch 14",
  },
  {
    id: "stat-l05-047",
    subject: S,
    topic: "error-types",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "md-psychiatry", "ma-semester"],
    question: "What is the problem of multiple comparisons? A study tests five hypotheses and obtains p values of .001, .012, .020, .035 and .30. Apply the Bonferroni, Holm and Benjamini Hochberg procedures and compare the results.",
    plan: ["Explain familywise error inflation", "Bonferroni correction with the example", "Holm's step-down method with the example", "False discovery rate with the example", "Compare and choose"],
    answer: `## The problem
Each test at alpha 0.05 has a 5 percent chance of a false positive when the null hypothesis is true. With many tests, false positives accumulate. For m independent tests, the familywise error rate (the chance of at least one Type I error) is 1 minus 0.95 to the power m: about 23 percent for five tests and 64 percent for twenty. Studies that test many outcomes, subgroups, brain regions or genes are especially at risk.

## The example
Five p values, sorted: .001, .012, .020, .035, .30. Without correction, four are below .05.

## Bonferroni correction
Divide alpha by the number of tests: 0.05 / 5 = 0.01. Only p values below .01 are significant.
- Result: only .001 is significant (1 of 5).
- Simple and controls the familywise error rate strictly, but conservative, especially with many or correlated tests, so power falls and Type II errors rise.

## Holm's step-down method
Sort p values from smallest to largest and compare the i-th smallest with alpha / (m minus i + 1). Stop at the first non-significant one.
| Rank | p | Threshold | Decision |
| 1 | .001 | .05 / 5 = .010 | Significant |
| 2 | .012 | .05 / 4 = .0125 | Significant |
| 3 | .020 | .05 / 3 = .0167 | Not significant; stop |
| 4 | .035 | | Not significant |
| 5 | .30 | | Not significant |
- Result: 2 of 5 significant. Holm also controls the familywise error rate but is always at least as powerful as Bonferroni, so it is generally preferred.

## Benjamini Hochberg false discovery rate
Instead of controlling the chance of any false positive, this procedure controls the expected proportion of false positives among the results declared significant (the false discovery rate, q, here 0.05). Compare the i-th smallest p with (i / m) x q, and find the largest i for which p is below its threshold; all tests up to that rank are significant.
| Rank | p | Threshold (i / 5) x .05 | p below threshold? |
| 1 | .001 | .010 | Yes |
| 2 | .012 | .020 | Yes |
| 3 | .020 | .030 | Yes |
| 4 | .035 | .040 | Yes |
| 5 | .30 | .050 | No |
- Result: 4 of 5 significant. It is more powerful and suits exploratory research with many tests, such as brain imaging or genetics, where some false discoveries are acceptable.

## Comparison
| Method | Controls | Significant here |
| No correction | Each test only | 4 |
| Bonferroni | Familywise error, strictly | 1 |
| Holm | Familywise error | 2 |
| Benjamini Hochberg | False discovery rate | 4 |

## Choosing
Use familywise control (Holm) for confirmatory tests where any false claim is costly, such as primary outcomes of a clinical trial. Use FDR control for exploratory screening of many variables. Better still, reduce the number of tests by preregistering a single primary hypothesis and treating others as secondary.

## Conclusion
The more tests run, the more false positives appear by chance. Corrections differ in strictness, and the choice should match the research goal and be decided before seeing the data.`,
    keyPoints: ["Familywise error formula and figures", "Bonferroni threshold .01 and result", "Holm's procedure with correct stopping", "Benjamini Hochberg thresholds and result", "Comparison table", "Guidance on choosing"],
    pitfalls: ["Applying Holm thresholds without stopping at the first failure", "Confusing familywise error with false discovery rate"],
    module: "statistics/2-3",
    visuals: [
      { kind: "experiment", caption: "Benjamini Hochberg false discovery rate", data: { title: "How many of five results survive?", question: "Five p values: .001, .012, .020, .035, .30. How many are significant under each method?", unit: " of 5", max: 5, conditions: [{ label: "No correction", value: 4 }, { label: "Bonferroni", value: 1 }, { label: "Holm", value: 2 }, { label: "Benjamini Hochberg", value: 4 }], why: "Stricter control of false positives costs power." } },
    ],
    ref: "Holm 1979; Benjamini and Hochberg 1995; Field ch 2. Checked by hand: 1-0.95^5 = 0.226.",
  },
  {
    id: "stat-l05-048",
    subject: S,
    topic: "error-types",
    marks: 20,
    difficulty: 4,
    exams: ["ugc-net", "mcp-entrance", "ma-semester"],
    question: "\"Statistics in psychology are often used as a drunk uses a lamp post: for support rather than illumination.\" Critically evaluate the use and misuse of statistics in psychological research, and suggest how practice can be improved.",
    plan: ["Unpack the quotation", "Why statistics are essential", "Common misuses: NHST rituals, p-hacking, low power, misreading correlations, ignoring effect sizes and assumptions", "Deeper criticisms: measurement, averages versus individuals, WEIRD samples", "Reforms: estimation, preregistration, Bayesian methods, open data, better training", "Conclusion"],
    answer: `## The quotation
The remark, often attributed to the Scottish writer Andrew Lang, describes a researcher who uses statistics to prop up a conclusion already reached rather than to discover what the data show. Evaluating it requires recognising both the indispensable role of statistics and the many ways they are misused.

## Why statistics are essential
- Psychological measurements are noisy and people vary, so we need methods to separate signal from chance.
- Descriptive statistics summarise large datasets.
- Inferential statistics allow generalisation from samples to populations with known risks of error.
- Experimental design and analysis, such as Ronald Fisher's randomisation and ANOVA, made causal inference possible.
- Psychometrics, built on correlation and factor analysis, underpins every test used in clinics and schools.
- Meta-analysis combines evidence across studies and guides evidence-based practice.
Without statistics, psychology would rest on anecdote and authority.

## Common misuses
- The null ritual: Gerd Gigerenzer described mechanical significance testing in which p below 0.05 means success and p above means failure, without thought about effect size, power or theory.
- Misinterpreting p values: treating p as the probability that H0 is true, or 1 minus p as the probability of replication.
- p-hacking and researcher degrees of freedom: trying different outcomes, covariates, exclusions or stopping points until significance appears. Joseph Simmons and colleagues showed that combining a few such choices can raise the false positive rate from 5 percent to over 60 percent.
- HARKing: presenting a hypothesis invented after seeing the results as if it had been predicted.
- Low power: small samples make real effects hard to detect and make significant effects exaggerated (the winner's curse).
- Ignoring effect size: reporting "significant" differences that are trivially small in large samples.
- Confusing correlation with causation, and using causal language for cross-sectional mediation models.
- Violating assumptions, such as using parametric tests on badly skewed data with tiny samples, or treating repeated measures as independent.
- Multiple testing without correction.
- Selective reporting and publication bias, which make the published literature an overly rosy sample.
- Misleading graphs: truncated axes and missing error bars.
- Overfitting complex models such as SEM and stepwise regression to small samples.

## Deeper criticisms
- Measurement: many constructs, such as self-esteem or wellbeing, are measured with brief scales of uncertain validity; sophisticated analysis cannot rescue poor measurement.
- Group averages versus individuals: a mean effect may describe no actual person. Peter Molenaar argued that between-person findings often do not apply within persons.
- Sampling: statistics from WEIRD samples are generalised to humanity.
- Quantification itself: humanistic and qualitative psychologists argue that meaning and experience are lost when reduced to numbers.
- Statistical significance is not scientific or clinical significance.

## Is the quotation fair?
Partly. The replication crisis showed that statistics have often been used for support: the Open Science Collaboration's replication of 100 studies found only about 36 percent significant replications. Yet the crisis was also discovered and measured by statistics. The problem is not statistics but incentives, training and ritual use. Used well, statistics illuminate, revealing for example that psychotherapy works (Smith and Glass's meta-analysis), that many popular effects were overstated, and that screening tests mislead when base rates are ignored.

## Improving practice
- Estimation over dichotomy: report effect sizes with confidence intervals, and interpret their practical meaning.
- Plan power in advance and use adequate samples, including multisite collaborations.
- Preregistration of hypotheses and analysis plans, and registered reports.
- Correct for multiple comparisons and distinguish confirmatory from exploratory analysis.
- Bayesian methods that quantify evidence for and against hypotheses and incorporate prior knowledge.
- Robust methods and checks of assumptions; report data screening decisions.
- Open data, materials and code so others can verify analyses.
- Better measurement: validate scales in each population, including Indian languages and settings.
- Statistical training that teaches reasoning, not recipes, and makes students comfortable with uncertainty.
- Journals and examiners valuing sound null results and replications.
- Combining quantitative and qualitative methods so numbers are interpreted in context.

## Conclusion
The quotation captures a real danger: statistics used to support conclusions reached in advance. But the remedy is better statistics, not fewer. When questions are clear, measures valid, samples adequate, analyses planned and results reported fully, statistics are psychology's main source of illumination.`,
    keyPoints: ["Interprets the quotation", "Essential roles of statistics", "At least six specific misuses with examples", "p-hacking and low power explained", "Deeper criticisms such as measurement and group versus individual", "Balanced judgement on the quotation", "At least six concrete reforms", "Clear conclusion"],
    pitfalls: ["Writing only a list of misuses without evaluation", "Rejecting statistics altogether"],
    module: "statistics/2-3",
    visuals: [
      { kind: "compare", caption: "Common misuses", data: { title: "Support versus illumination", a: { label: "Statistics as support", points: ["p below .05 as the goal", "Analyses chosen after seeing data", "Effect sizes ignored", "Small samples, selective reporting"], summary: "Confirms what the researcher wanted." }, b: { label: "Statistics as illumination", points: ["Preregistered questions and analyses", "Effect sizes with confidence intervals", "Adequate power", "Open data and full reporting"], summary: "Shows what the data say." } } },
      { kind: "experiment", caption: "Why statistics are essential", data: { title: "How flexible analysis inflates false positives", question: "If there is no real effect, how often does a study find p < .05?", unit: "%", conditions: [{ label: "One planned test", value: 5 }, { label: "With several flexible choices combined", value: 61 }], why: "Choosing among outcomes, covariates, exclusions and stopping rules after seeing the data multiplies chances for a false positive." } },
    ],
    ref: "Gigerenzer 2004 Mindless statistics; Simmons, Nelson and Simonsohn 2011 (60.7 percent with combined flexibility); Open Science Collaboration 2015; Molenaar 2004; Smith and Glass 1977",
  },
  {
    id: "stat-l05-049",
    subject: S,
    topic: "effect-size-power",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry"],
    question: "Interview question: \"A trial reports that group CBT for depression gave p = .03 and d = 0.5 against usual care, with 60 percent responding compared with 40 percent. Explain these results to a patient's family member who has no statistics background, and then to the panel in technical terms.\"",
    plan: ["What the panel is testing", "Plain-language explanation of p, d and response rates", "Technical explanation: p value, d, NNT, CI", "Limits and what else one would want to know", "Model closing statement"],
    answer: `## What the panel is testing
This question checks whether a candidate understands statistics well enough to explain them simply and accurately, an essential clinical skill when discussing treatment options with patients and families. It also tests whether the candidate knows the limits of a single trial.

## Explaining to a family member
"Researchers compared two groups of people with depression. One group attended group CBT sessions, the other received the usual care from their doctor.
- After treatment, 6 out of 10 people in the CBT group had improved clearly, compared with 4 out of 10 in the usual care group. So CBT helped 2 extra people in every 10.
- Another way to say it: if we treat 5 people with CBT, about 1 more will improve than if they had received usual care alone.
- The researchers checked whether this difference could just be luck. It is unlikely to be luck alone; if CBT really made no difference, a gap this large would turn up by chance only about 3 times in 100 trials.
- The size of the benefit is moderate. It is a real, useful improvement on average, but not everyone benefits, and some people improve with usual care too.
- This is one study. We would feel more confident if other studies found the same thing, which for CBT many have."
The explanation avoids jargon, uses natural frequencies ("6 out of 10") rather than percentages or probabilities, gives the absolute benefit, and is honest about uncertainty.

## Explaining to the panel
- p = .03: assuming the null hypothesis of no difference between CBT and usual care, the probability of observing a difference at least this large is 0.03. It is below the conventional alpha of 0.05, so the null is rejected. It is not the probability that the null is true, nor the probability that the result will replicate.
- d = 0.5: the CBT group's mean depression score was half a pooled standard deviation lower than usual care, a medium effect by Cohen's convention. The average CBT patient was better off than about 69 percent of the usual care group. This is in line with meta-analyses of psychotherapy for depression.
- Response rates: absolute risk difference = 0.60 minus 0.40 = 0.20; number needed to treat = 1 / 0.20 = 5; relative response = 1.5; odds ratio = 2.25. The NNT is the most clinically useful figure.
- What is missing: the 95 percent confidence interval for d and for the risk difference. With p = .03 the interval would exclude zero but its lower bound could be small, so the true effect might be modest.
- Sample size: a p of .03 with d = 0.5 implies a trial of only about 40 patients per group, a small trial in which estimates are imprecise.

## Critical questions I would ask
- Was allocation properly randomised and concealed?
- Were outcome assessors blind, and were self-report or clinician-rated outcomes used?
- Was analysis by intention to treat, and how many dropped out?
- Was the trial registered with this outcome as primary?
- What was usual care: attention-matched or minimal?
- How long did the benefit last at follow-up?
- Who were the patients: would results apply to patients in an Indian district hospital, with different severity, language and access?
- Were adverse effects or deterioration reported?

## Closing statement
"In short, the trial suggests group CBT helps about one extra person in every five treated, a moderate and clinically worthwhile benefit. The result is unlikely to be chance alone, but one moderately sized trial cannot give a precise estimate, so I would look at the confidence interval, the trial's risk of bias and the wider evidence before recommending it, and I would discuss it with the patient in terms of their own goals and preferences."

## Conclusion
A strong answer separates statistical significance (p), size of effect (d) and clinical usefulness (NNT); translates them into natural frequencies for the family; and shows critical appraisal skills for the panel.`,
    keyPoints: ["Plain-language explanation with natural frequencies", "Absolute benefit and NNT of 5 explained simply", "Correct technical meaning of p", "Correct meaning of d = 0.5 and 69 percent", "Risk difference, ratio and odds ratio", "Asks for confidence intervals", "Critical appraisal questions", "Concise closing statement"],
    pitfalls: ["Saying p = .03 means a 97 percent chance the treatment works", "Using jargon with the family"],
    module: "statistics/3-4",
    visuals: [
      { kind: "experiment", caption: "Explaining to a family member", data: { title: "Response to treatment", question: "Out of 10 patients, how many improved in each group?", unit: " of 10", max: 10, conditions: [{ label: "Usual care", value: 4 }, { label: "Group CBT", value: 6 }], why: "Two extra people in every ten improve with CBT, so about five must be treated for one extra success." } },
      { kind: "decide", caption: "Explaining to the panel", data: { scene: "A family member asks: does p = .03 mean there is a 97 percent chance CBT works?", ask: "What do you say?", choices: [{ label: "Yes, that is right", verdict: "harm", outcome: "They leave with a false certainty.", why: "p is about the data assuming no effect, not the chance the treatment works." }, { label: "If CBT made no difference, a gap this large would appear by chance about 3 times in 100", verdict: "best", outcome: "Accurate and understandable.", why: "This is what a p value means." }, { label: "It means the result is 3 percent important", verdict: "harm", outcome: "Confuses significance with size.", why: "Importance is judged by the effect size and NNT." }] } },
    ],
    ref: "Gigerenzer 2002 Reckoning with Risk (natural frequencies); Cuijpers et al meta-analyses of psychotherapy for depression (g about 0.6 to 0.7 vs control). n per group for d=0.5 p=.03: t approx 2.2 implies n about 39.",
  },
  {
    id: "stat-l05-050",
    subject: S,
    topic: "probability",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on Bayesian statistics and how it differs from the frequentist approach.",
    plan: ["Bayes' theorem in words", "Prior, likelihood, posterior", "Bayes factors", "Contrast with frequentist approach", "Uses and criticisms"],
    answer: `## Bayes' theorem
Named after Thomas Bayes, the theorem gives the probability of a hypothesis in the light of evidence: posterior probability is proportional to the likelihood of the data under the hypothesis multiplied by the prior probability of the hypothesis. In words: what we believe after seeing data depends on what we believed before and how well the hypothesis predicts the data.

## Key ideas
- Prior: the belief about a parameter before the data, based on earlier research or theory, expressed as a probability distribution.
- Likelihood: how probable the observed data are for each possible parameter value.
- Posterior: the updated belief after the data, which becomes the prior for the next study.
- Credible interval: a range that contains the parameter with a stated probability, such as 95 percent. Unlike a frequentist confidence interval, it can be read directly as "there is a 95 percent probability the effect lies here", given the model and prior.
- Bayes factor: the ratio of how well two hypotheses predict the data. A Bayes factor of 10 for H1 over H0 means the data are 10 times more likely under H1. Values below 1 favour H0, so Bayesian tests can provide evidence for the absence of an effect.

## Contrast with the frequentist approach
| Feature | Frequentist | Bayesian |
| Probability means | Long-run frequency | Degree of belief |
| Parameters | Fixed, unknown | Have probability distributions |
| Main output | p value, confidence interval | Posterior, credible interval, Bayes factor |
| Prior knowledge | Not formally used | Built in through the prior |
| Evidence for H0 | Cannot be shown | Can be quantified |

## Uses and criticisms
Bayesian methods are used in clinical diagnosis (updating the probability of a disorder from test results), adaptive trials and cognitive models of perception and learning. Critics note that priors can be subjective.`,
    keyPoints: ["Bayes' theorem in words", "Prior, likelihood, posterior", "Credible interval interpretation", "Bayes factor and evidence for H0", "Comparison with frequentist approach", "Uses and criticisms"],
    module: "statistics/2-2",
    visuals: [
      { kind: "flow", caption: "Key ideas", data: { title: "Bayesian updating", layout: "cycle", nodes: [{ id: "p", label: "Prior belief" }, { id: "d", label: "New data", detail: "How likely the data are under each hypothesis." }, { id: "q", label: "Posterior belief", detail: "Becomes the prior for the next study." }] } },
    ],
    ref: "Dienes 2011 Perspectives on Psychological Science; Wagenmakers et al 2018 JASP",
  },
];
