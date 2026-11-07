import type { LongQA } from "@/lib/prep/long-types";

const S = "statistics" as const;

export const STATISTICS_L02: LongQA[] = [
  {
    id: "stat-l02-011",
    subject: S,
    topic: "correlation",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Explain Spearman's rank order correlation. Two judges ranked six dancers as follows: Judge A 1, 2, 3, 4, 5, 6 and Judge B 2, 1, 4, 3, 6, 5. Calculate rho and interpret it. When is rho preferred to Pearson's r?",
    plan: ["Define rho and when it is used", "Formula", "Worked calculation", "Interpretation and significance", "Comparison with Pearson r, ties and Kendall's tau", "Conclusion"],
    answer: `## Meaning
Spearman's rank order correlation coefficient (rho) measures the strength and direction of association between two sets of ranks. Charles Spearman introduced it. It is Pearson's r applied to ranks, and it assesses whether the relationship is monotonic (consistently increasing or decreasing), not necessarily linear. It ranges from minus 1 to plus 1.

## Formula
When there are no tied ranks: rho = 1 minus (6 times the sum of D squared) / [N (N squared minus 1)], where D is the difference between each pair of ranks and N is the number of pairs.

## Worked calculation
| Dancer | Judge A | Judge B | D | D squared |
| P | 1 | 2 | minus 1 | 1 |
| Q | 2 | 1 | 1 | 1 |
| R | 3 | 4 | minus 1 | 1 |
| S | 4 | 3 | 1 | 1 |
| T | 5 | 6 | minus 1 | 1 |
| U | 6 | 5 | 1 | 1 |
| Sum | | | 0 | 6 |
- N = 6, so N (N squared minus 1) = 6 x 35 = 210.
- rho = 1 minus (6 x 6) / 210 = 1 minus 36 / 210 = 1 minus 0.171 = 0.829.

## Interpretation
rho = 0.83 shows strong agreement between the judges: dancers ranked high by one tend to be ranked high by the other, and the judges never differ by more than one place. As an index of inter-judge reliability this is good. For significance, with only six pairs the exact table should be used: the critical value at 0.05 (two-tailed) for N = 6 is 0.886, so rho = 0.83 falls just short. A large-sample t approximation gives p of about 0.04, but this approximation is unreliable with so few pairs. The lesson is that very small samples need very large coefficients to be significant.

## Ties
When two or more scores are tied, each receives the average of the ranks they would occupy: two dancers tied for second and third both receive 2.5. With many ties, the simple formula is inaccurate and Pearson's r should be computed on the ranks.

## When to prefer rho to Pearson's r
| Situation | Use |
| Data are ranks (merit lists, judges' ratings) | rho |
| Ordinal scales such as severity grades | rho |
| Interval data that are badly skewed or have outliers | rho |
| Relationship monotonic but not linear | rho |
| Small samples where normality cannot be assumed | rho |
| Interval or ratio data, linear relationship, roughly normal | Pearson r |
Rho is less affected by outliers because ranks limit the influence of extreme values. When its assumptions hold, Pearson's r is somewhat more powerful because it uses the full information in the scores.

## Kendall's tau
Kendall's tau is another rank correlation, based on the number of concordant and discordant pairs. It handles ties better and has a clearer probabilistic meaning, but is usually smaller in value than rho for the same data.

## Conclusion
Spearman's rho is a simple, robust measure of association for ranked or non-normal data, widely used for inter-rater agreement, item analysis and educational rankings.`,
    keyPoints: ["Definition and monotonic relationship", "Correct formula", "Sum of D squared = 6", "rho = 0.829", "Interpretation as agreement", "Small-sample significance with exact critical value", "Handling ties", "When to prefer rho, and Kendall's tau"],
    module: "statistics/2-4",
    visuals: [
      { kind: "worked", data: { title: "Spearman's rho", steps: [{ q: "Sum of D squared?", a: "Six differences of 1, so 6." }, { q: "Denominator N (N squared minus 1)?", a: "6 x 35 = 210" }, { q: "rho?", a: "1 minus 36 / 210 = 0.829" }], yourTurn: [{ q: "If Judge B reversed every rank (6, 5, 4, 3, 2, 1), what is rho?", a: "Sum of D squared = 70, rho = 1 minus 420 / 210 = minus 1." }] } },
    ],
    ref: "Garrett ch 7; Siegel and Castellan Nonparametric Statistics. scipy spearmanr rho = 0.8286 (t-approx p = 0.042); exact critical value n=6 alpha .05 two-tailed = 0.886 (Zar table).",
  },
  {
    id: "stat-l02-012",
    subject: S,
    topic: "correlation",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on partial and part (semipartial) correlation.",
    plan: ["Define partial correlation with an example", "Formula for first-order partial", "Define part correlation", "Uses"],
    answer: `## Partial correlation
Partial correlation is the correlation between two variables after the influence of one or more other variables has been removed from both. It answers the question: would X and Y still be related if everyone had the same score on Z?
Example: among school children, shoe size correlates with reading ability, but both depend on age. The partial correlation between shoe size and reading, controlling for age, would be close to zero, showing the original correlation was spurious.
The first-order partial correlation, controlling for one variable Z, is:
r(XY.Z) = [r(XY) minus r(XZ) r(YZ)] / square root of [(1 minus r(XZ) squared)(1 minus r(YZ) squared)].
For instance, if r(XY) = 0.50, r(XZ) = 0.60 and r(YZ) = 0.60, then r(XY.Z) = (0.50 minus 0.36) / (0.64) = 0.22. Much of the X and Y relationship was due to Z.

## Part (semipartial) correlation
Part correlation removes the influence of Z from only one of the two variables, usually the predictor. It shows the unique contribution of X to Y, beyond what Z explains. Its square equals the increase in R squared when X is added to a regression that already contains Z, so it is central to interpreting multiple regression.

## Uses
- Testing whether a correlation is spurious or due to a third variable.
- Examining unique contributions of predictors, such as whether self-efficacy predicts exam marks beyond intelligence.
- Building path and mediation models.
Neither technique proves causation; it only controls for the variables that were measured.`,
    keyPoints: ["Definition of partial correlation", "Example with a third variable", "Correct formula and calculation", "Part correlation removes Z from one variable only", "Link to unique variance in regression"],
    module: "statistics/2-4",
    visuals: [
      { kind: "worked", data: { title: "First-order partial correlation", steps: [{ q: "Numerator?", a: "0.50 minus 0.60 x 0.60 = 0.14" }, { q: "Denominator?", a: "Square root of (0.64 x 0.64) = 0.64" }, { q: "Partial r?", a: "0.14 / 0.64 = 0.22" }] } },
    ],
    ref: "Garrett ch 13; Field, Discovering Statistics ch 8. 0.14/0.64 = 0.219.",
  },
  {
    id: "stat-l02-013",
    subject: S,
    topic: "t-test",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe the types of t-tests and their assumptions. Anxiety scores after treatment were: CBT group 12, 14, 11, 15, 13 and wait-list group 18, 16, 17, 19, 15. Test whether the groups differ, calculate the effect size and interpret the result.",
    plan: ["Introduce the t distribution and when t is used", "One-sample, independent and paired t-tests", "Assumptions", "Worked independent t-test", "Effect size and interpretation", "What to do when assumptions fail, conclusion"],
    answer: `## The t distribution
William Gosset, writing as "Student" while working at the Guinness brewery, developed the t distribution for small samples where the population SD is unknown and must be estimated from the sample. The t distribution is symmetrical and bell-shaped like the normal curve but has heavier tails; its exact shape depends on the degrees of freedom, and it approaches the normal curve as samples grow.

## Types of t-test
- One-sample t-test: compares a sample mean with a known or hypothesised population value. Example: is the mean IQ of a group of children different from 100?
- Independent samples t-test: compares the means of two separate groups. Example: CBT versus wait-list.
- Paired (dependent) samples t-test: compares two means from the same or matched people, such as pre and post scores.

## Assumptions
- The DV is measured on an interval or ratio scale.
- Scores are approximately normally distributed in each population (less critical with larger samples).
- Observations are independent (for the independent test, the groups are unrelated).
- Homogeneity of variance: the two populations have equal variances, checked with Levene's test. If violated, Welch's t-test, which does not pool variances, is used.

## Worked independent t-test
H0: the population means are equal. H1: they differ (two-tailed), alpha = 0.05.
| Statistic | CBT | Wait-list |
| N | 5 | 5 |
| Mean | 13 | 17 |
| Sum of squared deviations | 10 | 10 |
| Variance (SS / (N minus 1)) | 2.5 | 2.5 |
- Pooled variance = (10 + 10) / (5 + 5 minus 2) = 20 / 8 = 2.5.
- Standard error of the difference = square root of [2.5 (1/5 + 1/5)] = square root of 1.0 = 1.0.
- t = (13 minus 17) / 1.0 = minus 4.0.
- Degrees of freedom = 5 + 5 minus 2 = 8.
- Critical t at 0.05, two-tailed, df 8 = 2.306. Since the absolute value 4.0 exceeds 2.306, H0 is rejected. The exact p is about 0.004.

## Effect size
Cohen's d = mean difference / pooled SD = 4 / square root of 2.5 = 4 / 1.58 = 2.53. This is a very large effect (Cohen's guide: 0.2 small, 0.5 medium, 0.8 large). Such a large d is typical of tiny invented examples; real therapy trials usually find d of about 0.5 to 0.8 against wait-list.

## Report
The CBT group (M = 13.0, SD = 1.58) reported lower anxiety than the wait-list group (M = 17.0, SD = 1.58), t(8) = minus 4.00, p = .004, d = 2.53.

## Interpretation and cautions
After treatment, the CBT group was significantly less anxious than the wait-list group. Because participants were (we assume) randomly assigned, the difference can be attributed to treatment. But with five people per group, the estimate is imprecise, the normality assumption cannot really be checked, and a wait-list control does not rule out expectancy and attention effects.

## Confidence interval for the difference
The 95 percent confidence interval for the mean difference is the difference plus or minus the critical t times the SE: 4 plus or minus 2.306 x 1.0, that is 1.69 to 6.31 points. Because the interval does not include zero, it agrees with the significant t-test, and it also shows the plausible size of the benefit, which a p value alone does not.

## One-sample and paired versions in brief
In a one-sample test, t = (sample mean minus hypothesised mean) / (SD / square root of N), with N minus 1 df. If 25 children have a mean IQ of 106 and SD 10, t = 6 / 2 = 3.0 with 24 df, which exceeds the critical value of 2.064, so the group differs from 100. The paired test applies the same formula to difference scores.

## When assumptions fail
- Unequal variances: Welch's t-test.
- Non-normal data with small samples, or ordinal data: the Mann Whitney U test (independent) or the Wilcoxon signed rank test (paired).
- More than two groups: ANOVA, because many t-tests inflate the Type I error.

## Conclusion
The t-test is the standard way to compare two means. A full answer chooses the right type, checks assumptions, reports t, df, p and an effect size, and interprets the result in the light of the design.`,
    keyPoints: ["Origin of t and its link to small samples", "Three types with examples", "Four assumptions including Levene's test", "Correct pooled variance and SE", "t = minus 4.0 with df 8 and critical 2.306", "Cohen's d = 2.53", "APA-style report", "Alternatives when assumptions fail"],
    pitfalls: ["Using N instead of N minus 2 for df", "Omitting the effect size", "Using a paired test for independent groups"],
    module: "statistics/2-5",
    visuals: [
      { kind: "worked", data: { title: "Independent samples t-test", steps: [{ q: "Means?", a: "CBT 13, wait-list 17" }, { q: "Pooled variance?", a: "(10 + 10) / 8 = 2.5" }, { q: "SE of the difference?", a: "Square root of 2.5 x 0.4 = 1.0" }, { q: "t and decision?", a: "t(8) = minus 4.0; beyond 2.306, so reject H0." }, { q: "Effect size?", a: "d = 4 / 1.58 = 2.53" }] } },
      { kind: "flow", data: { title: "Which t-test?", layout: "tree", nodes: [{ id: "q", label: "Comparing means" }, { id: "o", label: "One sample against a known value", parent: "q", detail: "One-sample t" }, { id: "t", label: "Two sets of scores", parent: "q" }, { id: "i", label: "Different people", parent: "t", detail: "Independent t, or Welch if variances differ" }, { id: "p", label: "Same or matched people", parent: "t", detail: "Paired t" }] } },
    ],
    ref: "Garrett ch 10; Gravetter and Wallnau ch 10. scipy ttest_ind: t = -4.0, p = 0.00395; t crit df 8 = 2.306; d = 2.53.",
  },
  {
    id: "stat-l02-014",
    subject: S,
    topic: "t-test",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Six patients' anxiety scores before and after a relaxation programme were: before 30, 28, 35, 25, 32, 30; after 24, 25, 28, 24, 26, 23. Test whether the programme reduced anxiety using the appropriate t-test, and discuss why this test is used.",
    plan: ["Identify the design and the test", "Hypotheses", "Compute differences, mean and SD of differences", "Compute t and decide", "Effect size, limitations and conclusion"],
    answer: `## Choice of test
The same six people were measured twice, so the scores are dependent. The paired samples (correlated or dependent) t-test is used. It works on the difference score for each person, which removes stable individual differences in anxiety from the error term and makes the test more powerful than an independent t-test with the same data.

## Hypotheses
- H0: the mean difference in the population is zero.
- H1: the mean difference is greater than zero (anxiety falls). A one-tailed test is defensible if the direction was predicted in advance; here we report both.
- Alpha = 0.05.

## Calculation
| Patient | Before | After | Difference D |
| 1 | 30 | 24 | 6 |
| 2 | 28 | 25 | 3 |
| 3 | 35 | 28 | 7 |
| 4 | 25 | 24 | 1 |
| 5 | 32 | 26 | 6 |
| 6 | 30 | 23 | 7 |
- Sum of D = 30, so mean D = 30 / 6 = 5.
- Deviations of D from 5: 1, minus 2, 2, minus 4, 1, 2. Squared: 1, 4, 4, 16, 1, 4, summing to 30.
- SD of D = square root of [30 / (6 minus 1)] = square root of 6 = 2.45.
- SE of mean D = 2.45 / square root of 6 = 1.0.
- t = 5 / 1.0 = 5.0, with df = N minus 1 = 5.

## Decision
- Critical t (df 5, 0.05 two-tailed) = 2.571; one-tailed = 2.015.
- t = 5.0 exceeds both, so H0 is rejected. The exact two-tailed p is about 0.004.
- Effect size for paired data: d (using the SD of differences) = 5 / 2.45 = 2.04, a very large effect.
- Report: anxiety fell from M = 30.0 to M = 25.0, t(5) = 5.00, p = .004.

## Interpretation and limitations
Anxiety scores fell significantly after the programme. But with no control group, this design cannot show that the programme caused the fall. History, maturation, regression to the mean (if patients were selected when highly anxious), testing effects and expectancy could all explain the change. A randomised controlled design would be needed. The sample is also very small, so normality of the differences cannot be checked well; the Wilcoxon signed rank test is a non-parametric alternative.

## Conclusion
The paired t-test is the right choice for before and after data on the same people. It shows a statistically significant and large reduction here, but the design limits causal conclusions.`,
    keyPoints: ["Correct choice of paired t-test with reason", "Hypotheses stated", "Mean D = 5 and SD of D = 2.45", "t(5) = 5.0", "Critical values and decision", "Effect size", "Limits of a pre and post design without control"],
    module: "statistics/2-5",
    visuals: [
      { kind: "worked", data: { title: "Paired t-test", steps: [{ q: "Mean difference?", a: "30 / 6 = 5" }, { q: "SD of differences?", a: "Square root of 30 / 5 = 2.45" }, { q: "SE?", a: "2.45 / 2.45 = 1.0" }, { q: "t?", a: "5 / 1 = 5.0 with df 5; critical 2.571, so significant." }] } },
    ],
    ref: "Gravetter and Wallnau ch 11. scipy ttest_rel: t = 5.0, p = 0.0041; t crit df 5 = 2.571 (two-tailed), 2.015 (one-tailed).",
  },
  {
    id: "stat-l02-015",
    subject: S,
    topic: "t-test",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "What are degrees of freedom? Explain with examples.",
    plan: ["Define degrees of freedom", "Simple illustration", "df in common tests", "Why it matters"],
    answer: `## Meaning
Degrees of freedom (df) are the number of values in a calculation that are free to vary once certain quantities, such as the mean, have been fixed. Each population parameter estimated from the sample uses up one degree of freedom.

## Illustration
Suppose five numbers must have a mean of 10, so their sum must be 50. You may choose the first four freely, for example 8, 12, 9 and 11, which add to 40. The fifth must then be 10. Only four values were free to vary, so df = N minus 1 = 4. This is why the sample variance is calculated by dividing the sum of squares by N minus 1: one df is lost in estimating the mean.

## df in common tests
| Test | Degrees of freedom |
| One-sample or paired t | N minus 1 |
| Independent t | N1 + N2 minus 2 |
| Pearson r | N minus 2 |
| Chi-square goodness of fit | Number of categories minus 1 |
| Chi-square test of independence | (rows minus 1)(columns minus 1) |
| One-way ANOVA | Between: k minus 1; within: N minus k |

## Why it matters
The shape of the t, chi-square and F distributions depends on df. With fewer df, the t distribution has heavier tails, so a larger t is needed for significance: the critical t at 0.05 two-tailed is 2.571 with 5 df but 1.96 with very large df. Using the wrong df gives the wrong critical value and a wrong decision.`,
    keyPoints: ["Definition", "Worked illustration with a fixed mean", "Link to N minus 1 in variance", "Table of df for common tests", "Effect on critical values"],
    module: "statistics/2-5",
    visuals: [
      { kind: "reveal", data: { prompt: "A 3 x 4 contingency table: how many degrees of freedom for the chi-square test?", answer: "(3 minus 1) x (4 minus 1) = 6." } },
    ],
    ref: "Garrett ch 9; Gravetter and Wallnau ch 9",
  },
  {
    id: "stat-l02-016",
    subject: S,
    topic: "chi-square",
    marks: 15,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Explain the chi-square test, its uses and assumptions. In a survey of 100 male and 100 female college students, 20 men and 40 women had sought help for emotional problems. Test whether help-seeking is related to gender and interpret the result.",
    plan: ["Define chi-square and its logic", "Goodness of fit and test of independence", "Assumptions and limits", "Worked 2 x 2 example with expected frequencies", "Effect size, Yates' correction and interpretation", "Conclusion"],
    answer: `## Meaning
The chi-square test, introduced by Karl Pearson in 1900, is a non-parametric test for frequency (count) data in categories. It compares the observed frequencies with the frequencies expected under the null hypothesis. The statistic is: chi-square = sum of (O minus E) squared / E, where O is the observed and E the expected frequency in each cell. Large values mean the observed pattern departs from what H0 predicts.

## Uses
- Goodness of fit: whether the distribution of one categorical variable fits an expected distribution, such as equal preference for three counselling formats, or a 3:1 ratio.
- Test of independence: whether two categorical variables are related, such as gender and help-seeking, or diagnosis and religion.
- Test of homogeneity: whether several populations have the same distribution of a variable.

## Assumptions
- Data are frequencies, not percentages or means.
- Categories are mutually exclusive and exhaustive: each person is counted once.
- Observations are independent (no repeated measures; McNemar's test is used for paired categorical data).
- Expected frequencies are not too small: a common rule is that no expected frequency should be below 5 (or at least 80 percent of cells at 5 or more and none below 1). For small 2 x 2 tables, Fisher's exact test is used.

## Worked example
H0: help-seeking is independent of gender. Alpha = 0.05.
| Gender | Sought help | Did not | Total |
| Men | 20 | 80 | 100 |
| Women | 40 | 60 | 100 |
| Total | 60 | 140 | 200 |
Expected frequency for each cell = (row total x column total) / grand total.
- Men, sought help: 100 x 60 / 200 = 30. Men, did not: 70.
- Women, sought help: 30. Women, did not: 70.
Chi-square contributions:
- Men, sought: (20 minus 30) squared / 30 = 100 / 30 = 3.33.
- Men, did not: (80 minus 70) squared / 70 = 100 / 70 = 1.43.
- Women, sought: (40 minus 30) squared / 30 = 3.33.
- Women, did not: (60 minus 70) squared / 70 = 1.43.
- Total chi-square = 9.52.
Degrees of freedom = (2 minus 1)(2 minus 1) = 1. The critical value at 0.05 is 3.84 and at 0.01 is 6.63. Since 9.52 exceeds both, H0 is rejected; the exact p is about 0.002.

## Yates' correction
For 2 x 2 tables, Frank Yates proposed subtracting 0.5 from each absolute difference before squaring, to correct for using a continuous distribution for discrete counts. Here the corrected value is 8.60, still significant. The correction is often considered too conservative with large samples, and many statisticians now prefer the uncorrected test or Fisher's exact test.

## Effect size
For a 2 x 2 table, the phi coefficient = square root of (chi-square / N) = square root of (9.52 / 200) = 0.22, a small to medium association. For larger tables, Cramer's V is used. Another useful index is the odds ratio: women's odds of seeking help were (40/60) / (20/80) = 0.667 / 0.25 = 2.67 times those of men.

## Interpretation
Help-seeking was significantly related to gender, chi-square(1, N = 200) = 9.52, p = .002, phi = 0.22. Women (40 percent) were twice as likely as men (20 percent) to have sought help. This fits research showing that masculine norms of self-reliance and stigma reduce help-seeking among men, including in Indian colleges. Chi-square shows association, not cause, and says nothing about the direction of influence.

## Limitations of chi-square
- Sensitive to sample size: with very large samples, trivial associations become significant, so effect sizes must be reported.
- Gives no information about which cells drive a significant result in larger tables; standardised residuals are examined for that.
- Loses information when continuous variables are grouped into categories.

## Conclusion
Chi-square is the main test for categorical data. Correct use requires frequencies, independent observations and adequate expected counts, and a full report includes chi-square, df, N, p and an effect size such as phi, Cramer's V or the odds ratio.`,
    keyPoints: ["Formula and logic of observed versus expected", "Goodness of fit and independence", "Assumptions including expected frequency of 5", "Correct expected frequencies", "Chi-square = 9.52, df 1", "Decision against 3.84", "Phi and odds ratio", "Limitations including sample size sensitivity"],
    pitfalls: ["Using percentages instead of counts", "Wrong df", "Claiming causation"],
    module: "statistics/2-6",
    visuals: [
      { kind: "worked", data: { title: "Chi-square for a 2 x 2 table", steps: [{ q: "Expected for men who sought help?", a: "100 x 60 / 200 = 30" }, { q: "Contributions?", a: "3.33 + 1.43 + 3.33 + 1.43" }, { q: "Chi-square and df?", a: "9.52 with df 1" }, { q: "Decision?", a: "Above 3.84, reject H0. Phi = 0.22." }] } },
      { kind: "experiment", data: { title: "Who sought help?", question: "What share of each group had sought help for emotional problems?", unit: "%", conditions: [{ label: "Men", value: 20 }, { label: "Women", value: 40 }], why: "The difference is too large to be chance in 200 students: chi-square = 9.52, p = .002." } },
    ],
    ref: "Garrett ch 11; Gravetter and Wallnau ch 17. scipy chi2_contingency: 9.524 (no correction), p = 0.0020; Yates 8.595; phi 0.218; OR 2.67.",
  },
  {
    id: "stat-l02-017",
    subject: S,
    topic: "chi-square",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg"],
    question: "Sixty clients chose among three forms of therapy: individual (30), group (18) and online (12). Test whether the forms are equally preferred. Explain the chi-square goodness of fit test in answering.",
    plan: ["State the test and its purpose", "Hypotheses and expected frequencies", "Compute chi-square", "Decision and interpretation", "Assumptions and follow-up"],
    answer: `## The test
The chi-square goodness of fit test examines whether the observed frequencies of one categorical variable match the frequencies expected under a theory or hypothesis. Here the hypothesis is that the three forms of therapy are equally preferred.

## Hypotheses
- H0: the population proportions are equal, one third each.
- H1: the proportions are not all equal.
- Alpha = 0.05.

## Expected frequencies
With 60 clients and three equally likely categories, E = 60 / 3 = 20 for each.

## Calculation
| Form | Observed | Expected | O minus E | (O minus E) squared / E |
| Individual | 30 | 20 | 10 | 100 / 20 = 5.0 |
| Group | 18 | 20 | minus 2 | 4 / 20 = 0.2 |
| Online | 12 | 20 | minus 8 | 64 / 20 = 3.2 |
| Total | 60 | 60 | 0 | 8.4 |
- Chi-square = 8.4.
- df = number of categories minus 1 = 2.
- Critical value at 0.05 with df 2 = 5.99; at 0.01 = 9.21.

## Decision
8.4 exceeds 5.99, so H0 is rejected at the 0.05 level (exact p is about 0.015), though not at 0.01. The three forms of therapy are not equally preferred.

## Interpretation
Individual therapy was chosen far more often than expected (30 against 20), and online therapy less often (12 against 20); group therapy was close to expectation. Looking at each cell's contribution shows where the departure lies: most of the chi-square comes from the individual and online categories. A possible explanation is that clients value privacy and personal attention, and some may distrust online formats, but the test itself cannot tell us why. An effect size such as Cohen's w = square root of (chi-square / N) = square root of (8.4 / 60) = 0.37, a medium effect.

## Assumptions
- Frequencies, not percentages.
- Each client counted once, so observations are independent.
- Expected frequencies of at least 5 in each category (here 20).
- Categories are exhaustive and mutually exclusive.

## Other expected distributions
Expected values need not be equal. If a clinic's records showed that historically 50 percent chose individual, 30 percent group and 20 percent online therapy, the expected values would be 30, 18 and 12, and chi-square would be 0, showing a perfect fit with the past pattern.

## Conclusion
The goodness of fit test compares observed counts with any theoretically expected distribution. Here clients clearly preferred individual therapy, chi-square(2, N = 60) = 8.40, p = .015.`,
    keyPoints: ["Purpose of goodness of fit", "Expected frequencies of 20", "Chi-square = 8.4 with df 2", "Comparison with 5.99", "Cell-by-cell interpretation", "Effect size w", "Assumptions"],
    module: "statistics/2-6",
    visuals: [
      { kind: "worked", data: { title: "Goodness of fit", steps: [{ q: "Expected for each form?", a: "60 / 3 = 20" }, { q: "Chi-square?", a: "5.0 + 0.2 + 3.2 = 8.4" }, { q: "df and critical value?", a: "df 2; 5.99 at 0.05" }, { q: "Decision?", a: "8.4 > 5.99, so the forms are not equally preferred." }] } },
    ],
    ref: "Gravetter and Wallnau ch 17. scipy chisquare: 8.4, p = 0.0150; chi2 crit df2 = 5.991; w = 0.374.",
  },
  {
    id: "stat-l02-018",
    subject: S,
    topic: "anova",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Explain the logic of one-way analysis of variance (ANOVA). Why is it preferred to several t-tests? Test whether three teaching methods differ, using these scores: Method A 3, 5, 4, 4; Method B 6, 7, 5, 6; Method C 9, 8, 10, 9. Interpret the result, including post hoc tests and effect size.",
    plan: ["Why ANOVA instead of many t-tests", "Logic: partitioning variance, the F ratio", "Assumptions", "Worked calculation with ANOVA table", "Post hoc tests and effect size", "Interpretation and conclusion"],
    answer: `## Why not several t-tests?
With three groups, comparing each pair requires three t-tests. Each test carries a 5 percent risk of a Type I error, so the chance of at least one false positive rises to about 1 minus 0.95 cubed, or 14 percent. With five groups (10 comparisons) it reaches 40 percent. Analysis of variance, developed by Ronald Fisher, tests all group means in a single overall test, holding the Type I error at alpha.

## The logic
ANOVA compares two estimates of variance.
- Between-groups variance reflects how much the group means differ from the grand mean. It contains treatment effects plus random error.
- Within-groups variance reflects how much scores differ within each group. It contains only random error (individual differences and measurement error).
The F ratio = mean square between / mean square within. If H0 is true (all population means equal), both estimate the same error variance and F is close to 1. If the treatment has an effect, the between estimate is inflated and F becomes large. The total sum of squares is partitioned: SS total = SS between + SS within.

## Assumptions
- The DV is interval or ratio.
- Independence of observations, achieved by random assignment.
- Normality of scores within each population.
- Homogeneity of variance across groups, checked with Levene's test. ANOVA is fairly robust to mild violations when group sizes are equal; Welch's ANOVA is an alternative when variances differ.

## Worked example
H0: the three methods produce equal mean scores. Alpha = 0.05.
| Group | Scores | Mean | SS within group |
| A | 3, 5, 4, 4 | 4 | 1 + 1 + 0 + 0 = 2 |
| B | 6, 7, 5, 6 | 6 | 0 + 1 + 1 + 0 = 2 |
| C | 9, 8, 10, 9 | 9 | 0 + 1 + 1 + 0 = 2 |
Grand mean = 76 / 12 = 6.33.
- SS between = sum of n (group mean minus grand mean) squared = 4 (4 minus 6.33) squared + 4 (6 minus 6.33) squared + 4 (9 minus 6.33) squared = 4 (5.44) + 4 (0.11) + 4 (7.11) = 21.78 + 0.44 + 28.44 = 50.67.
- SS within = 2 + 2 + 2 = 6.
- SS total = 56.67.
| Source | SS | df | MS | F |
| Between groups | 50.67 | 2 | 25.33 | 38.0 |
| Within groups | 6.00 | 9 | 0.67 | |
| Total | 56.67 | 11 | | |
- df between = k minus 1 = 2; df within = N minus k = 12 minus 3 = 9.
- F = 25.33 / 0.667 = 38.0.
- Critical F (2, 9) at 0.05 = 4.26. Since 38.0 is far larger, H0 is rejected (p below 0.001).

## Post hoc tests
A significant F says that at least one mean differs, not which. Post hoc tests compare pairs while controlling the familywise error rate. Tukey's honestly significant difference (HSD) test is the usual choice with equal group sizes. Here Tukey's test shows:
- B versus A: difference 2, p about 0.02.
- C versus A: difference 5, p below 0.001.
- C versus B: difference 3, p about 0.001.
All three methods differ, with Method C best and Method A worst. Other post hoc tests include Scheffe (most conservative, suits complex comparisons), Bonferroni and Games Howell (when variances are unequal). Planned comparisons, decided in advance, are more powerful than post hoc tests.

## Effect size
Eta squared = SS between / SS total = 50.67 / 56.67 = 0.89: teaching method accounts for about 89 percent of the variance in scores. Omega squared gives a less biased estimate. Cohen suggested 0.01, 0.06 and 0.14 as small, medium and large values for eta squared, so this is enormous, as is common in small textbook examples.

## Report
A one-way ANOVA showed a significant effect of teaching method, F(2, 9) = 38.0, p < .001, eta squared = .89. Tukey tests showed that Method C (M = 9) produced higher scores than Method B (M = 6), which produced higher scores than Method A (M = 4).

## Interpretation
If students were randomly assigned, the methods caused the difference. With only four students per method, the result should be replicated in larger, more varied classes before any recommendation is made.

## Extensions
Factorial ANOVA examines several factors and their interactions; repeated measures ANOVA handles the same people measured several times; ANCOVA adds a covariate; MANOVA handles several DVs.

## Conclusion
ANOVA tests differences among several means at once by comparing systematic and error variance. A complete analysis checks assumptions, reports F, df, p and effect size, and follows a significant F with post hoc or planned comparisons.`,
    keyPoints: ["Type I error inflation from multiple t-tests", "Partition of variance and F ratio logic", "Assumptions with Levene's test", "Correct SS between 50.67 and SS within 6", "Correct df and F = 38.0", "Decision against F crit 4.26", "Tukey post hoc results", "Eta squared = 0.89 and APA report"],
    pitfalls: ["Stopping after a significant F without post hoc tests", "Wrong df within", "Using ANOVA terms without explaining the logic"],
    module: "statistics/3-1",
    visuals: [
      { kind: "worked", data: { title: "One-way ANOVA", steps: [{ q: "Group means and grand mean?", a: "4, 6, 9; grand mean 6.33" }, { q: "SS between?", a: "4 x (5.44 + 0.11 + 7.11) = 50.67" }, { q: "SS within?", a: "2 + 2 + 2 = 6" }, { q: "MS and F?", a: "25.33 / 0.667 = 38.0 with df 2 and 9" }, { q: "Effect size?", a: "Eta squared = 50.67 / 56.67 = 0.89" }] } },
      { kind: "flow", data: { title: "Partitioning the variance", layout: "tree", nodes: [{ id: "t", label: "Total variability, SS 56.67" }, { id: "b", label: "Between groups, SS 50.67", parent: "t", detail: "Treatment effect plus error." }, { id: "w", label: "Within groups, SS 6", parent: "t", detail: "Error only." }] } },
    ],
    ref: "Garrett ch 12; Gravetter and Wallnau ch 12. scipy f_oneway F = 38.0, p = 4.1e-05; F crit (2,9) = 4.256; tukey_hsd p: A-B 0.018, A-C <0.001, B-C 0.001.",
  },
  {
    id: "stat-l02-019",
    subject: S,
    topic: "anova",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "A 2 x 2 between-subjects study examined therapy type (CBT, supportive) and severity (mild, severe) on improvement, with 10 participants per cell. The ANOVA gave SS therapy = 90, SS severity = 40, SS interaction = 160 and SS within = 720. Complete the ANOVA table and interpret the results.",
    plan: ["Identify the design and the sources of variance", "Compute df, MS and F for each source", "Compare with critical values", "Interpret main effects in light of the interaction", "Effect sizes and conclusion"],
    answer: `## The design
Two factors, each with two levels, give four cells with 10 people each, so N = 40. A two-way ANOVA tests three effects: the main effect of therapy, the main effect of severity, and the therapy by severity interaction.

## Completing the table
- df for each factor = levels minus 1 = 1. df interaction = 1 x 1 = 1.
- df within = N minus number of cells = 40 minus 4 = 36. df total = 39.
- MS within = 720 / 36 = 20.
| Source | SS | df | MS | F | p |
| Therapy | 90 | 1 | 90 | 4.50 | .041 |
| Severity | 40 | 1 | 40 | 2.00 | .166 |
| Therapy by severity | 160 | 1 | 160 | 8.00 | .008 |
| Within (error) | 720 | 36 | 20 | | |
| Total | 1010 | 39 | | | |
Critical F (1, 36) at 0.05 is about 4.11.

## Results
- Main effect of therapy: F(1, 36) = 4.50, p = .041, significant. Averaged over severity, one therapy produced more improvement.
- Main effect of severity: F(1, 36) = 2.00, p = .166, not significant. Averaged over therapy type, mild and severe patients improved similarly.
- Interaction: F(1, 36) = 8.00, p = .008, significant. The effect of therapy type depends on severity.

## Interpreting with an interaction
When the interaction is significant, the main effects can mislead and must be interpreted with care. For instance, CBT might be much better than supportive therapy for severe patients but only slightly better, or no better, for mild patients. The overall therapy main effect averages these different effects. The non-significant severity main effect may hide opposite effects within each therapy: severe patients may improve more with CBT but less with supportive therapy. To find out, the researcher examines the cell means, plots them (non-parallel lines show the interaction) and runs simple effects tests: the effect of therapy within mild patients, and within severe patients.

## Effect sizes
Partial eta squared = SS effect / (SS effect + SS within).
- Therapy: 90 / 810 = 0.11.
- Severity: 40 / 760 = 0.05.
- Interaction: 160 / 880 = 0.18, a large effect.
The interaction is the largest effect in the study.

## Clinical meaning
Such findings matter for matching patients to treatments. If CBT is clearly superior only for severe cases, services with limited CBT therapists might prioritise severe patients for CBT and offer supportive therapy to mild cases.

## Conclusion
The completed table shows a significant therapy main effect, a non-significant severity effect and a significant, large interaction. The key finding is that the benefit of therapy type depends on severity, which should be explored with cell means and simple effects before drawing any general conclusion.`,
    keyPoints: ["Three effects named", "Correct df within = 36 and MS within = 20", "Correct F values 4.5, 2.0, 8.0", "Correct significance decisions", "Main effects interpreted in light of the interaction", "Simple effects follow-up", "Partial eta squared values"],
    pitfalls: ["Using N minus 1 for df within", "Interpreting main effects as if there were no interaction"],
    module: "statistics/3-1",
    visuals: [
      { kind: "worked", data: { title: "Completing a two-way ANOVA table", steps: [{ q: "df within?", a: "40 minus 4 cells = 36" }, { q: "MS within?", a: "720 / 36 = 20" }, { q: "F for therapy, severity, interaction?", a: "90 / 20 = 4.5; 40 / 20 = 2.0; 160 / 20 = 8.0" }, { q: "Which are significant at 0.05?", a: "Therapy and the interaction (critical F about 4.11)." }] } },
    ],
    ref: "Gravetter and Wallnau ch 14; Field ch 14. scipy f.sf: 4.5 p = 0.0408; 2.0 p = 0.166; 8.0 p = 0.0076; F crit(1,36) = 4.113.",
  },
  {
    id: "stat-l02-020",
    subject: S,
    topic: "anova",
    marks: 5,
    difficulty: 2,
    exams: ["ugc-net", "ma-semester"],
    question: "Write a short note on post hoc tests and planned comparisons in ANOVA.",
    plan: ["Why follow-up tests are needed", "Planned comparisons", "Post hoc tests with examples", "Choosing among them"],
    answer: `## Why follow-up tests are needed
A significant F in ANOVA shows only that not all group means are equal. It does not say which groups differ. Follow-up tests compare specific means while controlling the familywise error rate, the probability of at least one Type I error across all comparisons.

## Planned (a priori) comparisons
These are decided before the data are collected, based on theory. Example: in a study of placebo, low dose and high dose, the researcher plans to compare placebo with the average of the two doses, and low with high dose. Planned comparisons, often called contrasts, are few and specific, so they need less correction and are more powerful. Orthogonal contrasts (independent of each other) are especially clean.

## Post hoc (a posteriori) tests
These explore all pairwise or complex comparisons after a significant F.
- Tukey's HSD: compares all pairs with equal group sizes; a good balance of power and error control.
- Scheffe test: the most conservative, allows any complex comparison, low power for simple pairs.
- Bonferroni correction: divides alpha by the number of comparisons; simple but conservative when comparisons are many.
- Newman Keuls and Duncan: more liberal, with a higher risk of Type I error.
- Games Howell: used when variances or group sizes are unequal.
- Dunnett's test: compares each treatment group with a single control group.

## Choosing
Use planned contrasts when hypotheses are specific; Tukey for all pairs; Dunnett against a control; Games Howell when homogeneity fails. Running many unplanned tests without correction is a form of fishing that inflates false positives.`,
    keyPoints: ["Reason for follow-up tests", "Familywise error", "Planned comparisons and their power", "At least four post hoc tests with uses", "Guidance on choice"],
    module: "statistics/3-1",
    visuals: [
      { kind: "sort", data: { prompt: "Pick the follow-up test.", buckets: ["Tukey HSD", "Dunnett", "Games Howell"], items: [{ text: "Compare all pairs of four equal groups", bucket: 0 }, { text: "Compare three new drugs only with placebo", bucket: 1 }, { text: "All pairs, but group variances are very unequal", bucket: 2 }] } },
    ],
    ref: "Field ch 12; Howell Statistical Methods for Psychology ch 12",
  },
];
