import type { LongQA } from "@/lib/prep/long-types";

const S = "statistics" as const;

export const STATISTICS_L03: LongQA[] = [
  {
    id: "stat-l03-021",
    subject: S,
    topic: "anova",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Explain repeated measures ANOVA. What is the sphericity assumption, how is it tested, and what is done when it is violated?",
    plan: ["Define repeated measures ANOVA and when it is used", "How it partitions variance and why it is more powerful", "Sphericity and Mauchly's test", "Corrections: Greenhouse Geisser, Huynh Feldt, multivariate approach", "Other issues and conclusion"],
    answer: `## Meaning
Repeated measures (within-subjects) ANOVA compares three or more means obtained from the same participants, for example anxiety measured at baseline, after four weeks and after eight weeks of treatment, or reaction time under three levels of noise. It extends the paired t-test to more than two conditions.

## Partitioning variance
In a between-subjects ANOVA, individual differences between people form part of the error term. In repeated measures ANOVA, each person serves in every condition, so the variability due to stable differences between people can be measured and removed.
- SS total = SS between conditions + SS within conditions.
- SS within conditions is split into SS between subjects (individual differences) and SS error (the condition by subject interaction).
- F = MS conditions / MS error.
Because the error term no longer contains individual differences, it is smaller and the test is more powerful, needing fewer participants. Degrees of freedom: conditions k minus 1; error (k minus 1)(n minus 1).

## Sphericity
Repeated measures ANOVA assumes sphericity: the variances of the differences between every pair of conditions are equal. With three time points, the variance of (T1 minus T2), (T1 minus T3) and (T2 minus T3) should be about the same. Sphericity is often violated with time series, because measurements close in time correlate more strongly than distant ones. With only two conditions there is only one difference, so sphericity is automatically met.

## Testing sphericity
Mauchly's test checks the null hypothesis that sphericity holds. A significant result (p below 0.05) suggests violation. However, it has low power in small samples and is oversensitive in large ones, so many statisticians recommend applying a correction routinely rather than relying on the test.

## What happens if it is violated
Violation makes the F test too liberal: the actual Type I error rate exceeds alpha.

## Corrections
- Greenhouse Geisser correction: estimates epsilon (from 1/(k minus 1) at worst to 1 for perfect sphericity) and multiplies both df by it, giving a larger critical F. It is somewhat conservative.
- Huynh Feldt correction: a less conservative estimate of epsilon, preferred when epsilon is above about 0.75.
- Lower bound correction: uses the most extreme epsilon, very conservative.
- Multivariate approach (MANOVA on difference scores), which does not assume sphericity but needs more participants than conditions.
- Linear mixed models, which allow flexible covariance structures and handle missing data, are now widely used for longitudinal data.

## Other issues
- Order and carry-over effects must be controlled by counterbalancing.
- Missing data: a participant missing one time point is dropped entirely in classic repeated measures ANOVA, which is another reason to use mixed models.
- Follow-up tests: pairwise comparisons with Bonferroni correction, or polynomial contrasts to test linear or quadratic trends over time.

## Example of reporting
Mauchly's test indicated that sphericity was violated, so Greenhouse Geisser corrected values are reported: anxiety changed significantly over time, F(1.42, 39.8) = 12.5, p < .001, partial eta squared = .31.

## Conclusion
Repeated measures ANOVA is efficient and powerful because it removes individual differences from the error, but it depends on sphericity. Checking and correcting for violations, and controlling order effects, are essential.`,
    keyPoints: ["Definition and example", "Partition including SS subjects and why power is higher", "Correct df for conditions and error", "Definition of sphericity", "Mauchly's test and its limits", "Greenhouse Geisser and Huynh Feldt corrections", "Mixed models alternative"],
    module: "statistics/3-1",
    visuals: [
      { kind: "flow", data: { title: "Partitioning in repeated measures ANOVA", layout: "tree", nodes: [{ id: "t", label: "Total variability" }, { id: "c", label: "Between conditions", parent: "t", detail: "Effect of time or treatment." }, { id: "w", label: "Within conditions", parent: "t" }, { id: "s", label: "Between subjects", parent: "w", detail: "Stable individual differences, removed." }, { id: "e", label: "Error", parent: "w", detail: "Condition by subject interaction: the F denominator." }] } },
    ],
    ref: "Field ch 15; Howell ch 14; Greenhouse and Geisser 1959; Huynh and Feldt 1976",
  },
  {
    id: "stat-l03-022",
    subject: S,
    topic: "non-parametric",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Compare and contrast parametric and non-parametric tests. Give the non-parametric equivalent of each common parametric test, and discuss when non-parametric tests should be used.",
    plan: ["Define parametric and non-parametric tests", "Assumptions of parametric tests", "Features of non-parametric tests", "Equivalents table", "Advantages and disadvantages of each", "When to use which, and conclusion"],
    answer: `## Meaning
Parametric tests make assumptions about the parameters of the population distribution from which the sample is drawn, most often that it is normal with a certain mean and variance. Examples are the t-test, ANOVA and Pearson's r. Non-parametric tests make fewer or no assumptions about the shape of the population distribution, and many work with ranks or frequencies rather than raw scores. They are sometimes called distribution-free tests.

## Assumptions of parametric tests
- The DV is measured on an interval or ratio scale.
- Scores are drawn from normally distributed populations (or samples are large enough for the central limit theorem to apply).
- Homogeneity of variance across groups.
- Independence of observations.
- For correlation and regression, linearity and homoscedasticity.

## Features of non-parametric tests
- Used with nominal or ordinal data, or interval data that violate assumptions.
- Most convert scores to ranks, which reduces the influence of outliers and skew.
- Test hypotheses about medians, distributions or frequencies rather than means.
- Usually simpler to calculate by hand.

## Equivalents
| Purpose | Parametric | Non-parametric |
| Two independent groups | Independent t-test | Mann Whitney U (Wilcoxon rank sum) |
| Two related measures | Paired t-test | Wilcoxon signed rank; sign test |
| Three or more independent groups | One-way ANOVA | Kruskal Wallis H |
| Three or more related measures | Repeated measures ANOVA | Friedman test |
| Association between two variables | Pearson r | Spearman rho; Kendall tau |
| Categorical association | No direct equivalent | Chi-square; Fisher's exact test |
| One sample against a value | One-sample t-test | Wilcoxon one-sample, sign test, chi-square goodness of fit |
| Paired categorical data | No direct equivalent | McNemar's test |

## Advantages of parametric tests
- More powerful when their assumptions are met, so they are more likely to detect a real effect with the same sample size. The Mann Whitney U, for instance, has about 95 percent of the efficiency of the t-test with normal data.
- Use all the information in the scores.
- Allow complex designs: factorial ANOVA, interactions, ANCOVA, multiple regression.
- Robust to moderate violations of normality, especially with equal and reasonably large samples.

## Advantages of non-parametric tests
- Valid with small samples where normality cannot be checked.
- Appropriate for ordinal and nominal data, such as ranks, ratings and categories.
- Robust to outliers and skew.
- Fewer assumptions mean conclusions depend less on whether those assumptions hold.
- Can be more powerful than parametric tests when distributions are heavy-tailed.

## Disadvantages of non-parametric tests
- Less power when parametric assumptions are met.
- Limited range of designs; interactions are hard to test.
- Converting scores to ranks discards information about the size of differences.
- Effect sizes and confidence intervals are less familiar and less often reported.
- Many ties reduce accuracy.

## When to use non-parametric tests
- Data are ordinal (such as Likert items, ranks, severity grades) or nominal.
- Interval data are clearly non-normal, with small samples, for example reaction times or symptom counts with strong skew.
- Extreme outliers that cannot be justified for removal.
- Very unequal variances with unequal group sizes.
- Very small samples, such as pilot studies or rare clinical groups.
When in doubt, a researcher can run both; if the conclusions agree, the result is robust. Transformations such as logarithms or bootstrapping are other options for non-normal interval data.

## Example
A researcher compares pain ratings (0 to 10) of eight patients receiving music therapy with eight receiving usual care. The ratings are ordinal and the sample is tiny, so the Mann Whitney U test is the appropriate choice rather than the t-test.

## Conclusion
Parametric tests are powerful and flexible but depend on assumptions about the data; non-parametric tests are robust and suit ranked, categorical or awkward data. The level of measurement, the shape of the distribution, the sample size and the design should guide the choice.`,
    keyPoints: ["Definitions of both types", "Parametric assumptions listed", "Non-parametric features including ranks", "Correct equivalents table", "Power and relative efficiency", "Advantages and disadvantages of each", "Clear criteria for choosing", "Example"],
    pitfalls: ["Saying non-parametric tests have no assumptions at all", "Calling non-parametric tests always weaker"],
    module: "statistics/3-3",
    visuals: [
      { kind: "sort", data: { prompt: "Pick the non-parametric partner of each test.", buckets: ["Mann Whitney U", "Wilcoxon signed rank", "Kruskal Wallis", "Friedman"], items: [{ text: "Independent t-test", bucket: 0 }, { text: "Paired t-test", bucket: 1 }, { text: "One-way ANOVA", bucket: 2 }, { text: "Repeated measures ANOVA", bucket: 3 }] } },
      { kind: "compare", data: { title: "Parametric versus non-parametric", a: { label: "Parametric", points: ["Assumes normality and equal variances", "Interval or ratio data", "More power when assumptions hold"], summary: "Powerful and flexible." }, b: { label: "Non-parametric", points: ["Few distribution assumptions", "Ranks or frequencies", "Robust to outliers and skew"], summary: "Safe with awkward data." } } },
    ],
    ref: "Siegel and Castellan 1988; Garrett ch 11; Field ch 7. ARE of Mann-Whitney vs t under normality = 3/pi = 0.955.",
  },
  {
    id: "stat-l03-023",
    subject: S,
    topic: "non-parametric",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Pain ratings of patients given usual care (12, 15, 9, 20, 18) and music therapy (25, 22, 30, 19, 28) are shown, where higher scores mean more comfort. Use the Mann Whitney U test to find whether the groups differ, and explain the test.",
    plan: ["Explain the Mann Whitney U test and when it is used", "Rank all scores together", "Sum ranks and calculate U", "Compare with the critical value", "Interpret and report"],
    answer: `## The test
The Mann Whitney U test, developed by Henry Mann and Donald Whitney (and equivalent to Frank Wilcoxon's rank sum test), compares two independent groups when data are ordinal or when interval data do not meet the assumptions of the t-test. It asks whether scores in one group tend to be higher than scores in the other, by comparing the ranks of the two groups.

## Hypotheses
- H0: the two populations have the same distribution (neither tends to have higher scores).
- H1: the distributions differ. Two-tailed, alpha = 0.05.

## Step 1: rank all scores together
| Score | 9 | 12 | 15 | 18 | 19 | 20 | 22 | 25 | 28 | 30 |
| Group | Usual | Usual | Usual | Usual | Music | Usual | Music | Music | Music | Music |
| Rank | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |

## Step 2: sum the ranks
- Usual care (n1 = 5): ranks 2, 3, 1, 6, 4. R1 = 16.
- Music therapy (n2 = 5): ranks 8, 7, 10, 5, 9. R2 = 39.
- Check: R1 + R2 = 55 = N (N + 1) / 2 = 10 x 11 / 2.

## Step 3: calculate U
- U1 = R1 minus n1 (n1 + 1) / 2 = 16 minus 15 = 1.
- U2 = R2 minus n2 (n2 + 1) / 2 = 39 minus 15 = 24.
- Check: U1 + U2 = n1 x n2 = 25.
- The test statistic U is the smaller value, 1.
U1 = 1 means that in only one of the 25 possible pairs of one usual care patient and one music patient did the usual care patient have the higher score (20 against 19).

## Step 4: decision
For n1 = n2 = 5, the critical value of U at 0.05 (two-tailed) is 2. For the Mann Whitney test, H0 is rejected when U is equal to or less than the critical value. Since U = 1 is less than 2, H0 is rejected. The exact p is about 0.016.

## Interpretation
Patients receiving music therapy reported significantly greater comfort than those receiving usual care, U = 1, p = .016. The median comfort was 25 in the music group and 15 in the usual care group. A rank-biserial correlation, r = 1 minus 2U / (n1 n2) = 1 minus 2 / 25 = 0.92, shows a very large effect.

## Large samples and ties
With larger groups (above about 20 each), U is converted to a z score and compared with the normal distribution. Tied scores receive the average of the ranks they would occupy, and a correction for ties is applied.

## Why not the t-test?
With five patients per group, normality cannot be checked, and comfort ratings are at best ordinal. The Mann Whitney test makes no assumption of normality and is robust to outliers.

## Conclusion
The Mann Whitney U test compares two independent groups using ranks. Here it shows clearly that music therapy was associated with greater comfort.`,
    keyPoints: ["Purpose and when used", "Correct joint ranking", "R1 = 16 and R2 = 39 with check", "U = 1 with check that U1 + U2 = n1 n2", "Decision rule: reject when U is at or below critical 2", "Effect size and report", "Handling of ties and large samples"],
    pitfalls: ["Ranking groups separately", "Rejecting H0 when U is above the critical value"],
    module: "statistics/3-3",
    visuals: [
      { kind: "worked", data: { title: "Mann Whitney U", steps: [{ q: "Rank sums?", a: "Usual care 16, music 39" }, { q: "U for each group?", a: "16 minus 15 = 1; 39 minus 15 = 24" }, { q: "Decision?", a: "U = 1 is at or below the critical 2, so reject H0." }] } },
    ],
    ref: "Siegel and Castellan ch 6; Gravetter and Wallnau ch 18. scipy mannwhitneyu U = 1, p = 0.0159; critical U(5,5) two-tailed .05 = 2.",
  },
  {
    id: "stat-l03-024",
    subject: S,
    topic: "non-parametric",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net"],
    question: "Write a short note on the Wilcoxon signed rank test, with an example.",
    plan: ["Purpose", "Steps", "Small example", "Comparison with the sign test"],
    answer: `## Purpose
The Wilcoxon signed rank test, devised by Frank Wilcoxon, compares two related measurements, such as before and after scores of the same people. It is the non-parametric alternative to the paired t-test, used when difference scores are not normally distributed or are ordinal.

## Steps
- Find the difference for each pair; drop pairs with zero difference.
- Rank the absolute differences from smallest to largest, averaging tied ranks.
- Attach the sign of each difference to its rank.
- Sum the positive ranks and the negative ranks separately. T is the smaller sum.
- Compare T with the critical value for the number of non-zero pairs; reject H0 if T is equal to or less than the critical value.

## Example
Six patients' anxiety before and after relaxation: differences of 6, 3, 7, 1, 6 and 7 points, all reductions.
- Ranks of absolute differences: 1 gets rank 1, 3 gets rank 2, the two 6s share ranks 3 and 4 (3.5 each), and the two 7s share ranks 5 and 6 (5.5 each).
- All differences are in the same direction, so the sum of negative ranks is 0 and T = 0.
- For six pairs, the critical T at 0.05 (two-tailed) is 0, so H0 is rejected (exact p = 0.031). Anxiety fell significantly.

## Comparison with the sign test
The sign test counts only how many differences are positive or negative, ignoring their size. The Wilcoxon test uses the size of differences through their ranks, so it is more powerful. Both make fewer assumptions than the paired t-test.`,
    keyPoints: ["Purpose and parametric equivalent", "Steps including dropping zeros and signed ranks", "Correct T = 0 in example", "Decision rule", "Advantage over the sign test"],
    module: "statistics/3-3",
    visuals: [
      { kind: "reveal", data: { prompt: "If one patient's anxiety had risen by 1 point and all others fell, what would T be?", answer: "The rise of 1 is the smallest absolute difference, rank 1, so the sum of negative ranks would be 1 and T = 1." } },
    ],
    ref: "Siegel and Castellan ch 5. scipy wilcoxon statistic 0, p = 0.03125 (exact).",
  },
  {
    id: "stat-l03-025",
    subject: S,
    topic: "non-parametric",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "Explain the Kruskal Wallis and Friedman tests. Calculate H for three groups with scores A: 3, 5, 4, 4; B: 6, 7, 5, 6; C: 9, 8, 10, 9.",
    plan: ["Kruskal Wallis: purpose and formula", "Worked H with ties", "Friedman: purpose, formula and example", "Follow-up tests and conclusion"],
    answer: `## Kruskal Wallis H test
The Kruskal Wallis test, by William Kruskal and Allen Wallis, compares three or more independent groups using ranks. It is the non-parametric equivalent of one-way ANOVA, used with ordinal data or non-normal interval data. All scores are ranked together, and the test asks whether the mean ranks of the groups differ more than chance would allow.
H = [12 / (N (N + 1))] x sum of (R squared / n) minus 3 (N + 1), where R is each group's rank sum, n its size and N the total. With more than about five per group, H follows a chi-square distribution with k minus 1 df.

## Worked example
All 12 scores ranked together, with tied scores given average ranks:
| Score | 3 | 4 | 4 | 5 | 5 | 6 | 6 | 7 | 8 | 9 | 9 | 10 |
| Rank | 1 | 2.5 | 2.5 | 4.5 | 4.5 | 6.5 | 6.5 | 8 | 9 | 10.5 | 10.5 | 12 |
- Group A (3, 5, 4, 4): ranks 1, 4.5, 2.5, 2.5. RA = 10.5.
- Group B (6, 7, 5, 6): ranks 6.5, 8, 4.5, 6.5. RB = 25.5.
- Group C (9, 8, 10, 9): ranks 10.5, 9, 12, 10.5. RC = 42.
- Check: 10.5 + 25.5 + 42 = 78 = 12 x 13 / 2.
- Sum of R squared / n = (110.25 + 650.25 + 1764) / 4 = 631.13.
- H = (12 / 156) x 631.13 minus 39 = 48.55 minus 39 = 9.55.
- With the correction for ties, H = 9.68.
- df = 2; critical chi-square at 0.05 = 5.99. H exceeds it, so the groups differ significantly (p about 0.008). The parametric ANOVA on the same data was also significant.

## Friedman test
The Friedman test, by Milton Friedman, compares three or more related conditions, such as the same patients rated under three treatments. It is the non-parametric equivalent of repeated measures ANOVA. Scores are ranked within each participant across conditions, then rank sums are compared.
Chi-square (Friedman) = [12 / (n k (k + 1))] x sum of R squared minus 3 n (k + 1), where n is the number of participants and k the number of conditions.
Example: five patients rate mood under three conditions, and every patient ranks condition 3 highest and condition 1 lowest. Rank sums are 5, 10 and 15. Friedman chi-square = [12 / (5 x 3 x 4)] x (25 + 100 + 225) minus 60 = 0.2 x 350 minus 60 = 10.0, df = 2, p about 0.007.

## Follow-up tests
A significant result shows that at least one group differs. Pairwise Mann Whitney tests (after Kruskal Wallis) or Wilcoxon tests (after Friedman), with a Bonferroni correction, or Dunn's test, identify which.

## Conclusion
Kruskal Wallis and Friedman extend rank-based testing to several groups or conditions, offering robust alternatives to ANOVA when assumptions fail or data are ordinal.`,
    keyPoints: ["Kruskal Wallis purpose and formula", "Correct ranking with ties", "Rank sums 10.5, 25.5, 42", "H = 9.55, about 9.68 with tie correction", "Comparison with chi-square 5.99", "Friedman purpose, formula and worked value of 10", "Follow-up tests"],
    module: "statistics/3-3",
    visuals: [
      { kind: "worked", data: { title: "Kruskal Wallis H", steps: [{ q: "Rank sums?", a: "A 10.5, B 25.5, C 42" }, { q: "Sum of R squared / n?", a: "(110.25 + 650.25 + 1764) / 4 = 631.13" }, { q: "H?", a: "(12 / 156) x 631.13 minus 39 = 9.55" }, { q: "Decision?", a: "Above 5.99 with df 2, so significant." }] } },
    ],
    ref: "Siegel and Castellan ch 8 and 7. scipy kruskal H = 9.684 (tie-corrected), p = 0.0079; uncorrected by formula 9.548; friedmanchisquare 10.0, p = 0.0067.",
  },
  {
    id: "stat-l03-026",
    subject: S,
    topic: "effect-size-power",
    marks: 15,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "What is effect size? Why should it be reported alongside significance tests? Describe the main measures of effect size with worked examples.",
    plan: ["Define effect size and contrast with significance", "Reasons to report it", "Standardised mean difference d and g with example", "r, eta squared and omega squared", "Odds ratio, risk ratio and number needed to treat", "Interpretation guides, cautions and conclusion"],
    answer: `## Meaning
An effect size is a quantitative measure of the magnitude of a phenomenon: how large a difference between groups is, or how strong a relationship is. A significance test answers whether an effect is likely to be more than chance; an effect size answers how big it is. The two are linked through sample size: test statistic = effect size x a function of sample size.

## Why report effect sizes
- Statistical significance depends heavily on sample size. With 10,000 participants, a difference of half an IQ point can be significant; with 10 participants, a large and important difference may not be.
- Effect sizes indicate practical and clinical importance.
- They allow results to be compared across studies using different measures and combined in meta-analysis.
- They are needed for power analysis when planning studies.
- The APA publication manual requires them, preferably with confidence intervals.

## Standardised mean difference
Cohen's d = (mean 1 minus mean 2) / pooled SD. It expresses the difference in SD units.
Example: a yoga group has a mean stress score of 20 and a control group 25, with pooled SD 10. d = (25 minus 20) / 10 = 0.5. The average yoga participant scores lower than about 69 percent of the control group (the area below z = 0.5).
Hedges' g applies a small-sample correction and is preferred in meta-analysis. Glass's delta uses only the control group SD.

## Correlation-based measures
- r: the correlation coefficient itself is an effect size, and r squared is the proportion of variance shared.
- d can be converted to r: r = d / square root of (d squared + 4). For d = 0.5, r is about 0.24.
- Eta squared = SS effect / SS total, the proportion of total variance in the DV explained by a factor in ANOVA. Partial eta squared = SS effect / (SS effect + SS error), used in factorial designs.
- Omega squared corrects the upward bias of eta squared in small samples.
- R squared in regression, and Cohen's f squared = R squared / (1 minus R squared).

## Measures for categorical outcomes
Suppose 60 percent of patients respond to a new therapy and 40 percent to usual care.
- Risk difference = 0.60 minus 0.40 = 0.20.
- Number needed to treat (NNT) = 1 / 0.20 = 5: five patients must receive the new therapy for one extra patient to respond.
- Risk ratio = 0.60 / 0.40 = 1.5.
- Odds ratio = (0.60 / 0.40) / (0.40 / 0.60) = 1.5 / 0.667 = 2.25.
- For chi-square tables, phi (2 x 2) and Cramer's V.

## Interpretation guides
| Measure | Small | Medium | Large |
| d | 0.2 | 0.5 | 0.8 |
| r | 0.1 | 0.3 | 0.5 |
| Eta squared | 0.01 | 0.06 | 0.14 |
| f squared | 0.02 | 0.15 | 0.35 |
Jacob Cohen offered these only as rough conventions for when nothing better is known. A "small" effect can matter greatly when the outcome is serious and the intervention cheap, as with aspirin and heart attacks, while a "large" effect on a trivial outcome may not matter.

## Effect sizes in clinical practice
Clinicians also judge change in individual patients. The reliable change index, proposed by Neil Jacobson and Paula Truax, asks whether a patient's change is larger than measurement error would produce, and clinical significance asks whether the patient has moved into the range of the healthy population. A trial can show a medium average effect while only some patients show reliable, clinically significant change, so both kinds of information are useful.

## Cautions
- Effect sizes from small studies are imprecise; report confidence intervals.
- Published effects are inflated by publication bias.
- Different designs (within versus between subjects) give d values that are not directly comparable.
- Effect sizes depend on the reliability of measures and the range of the sample.

## Conclusion
Effect sizes turn "is there an effect?" into "how large is the effect, and does it matter?". Together with confidence intervals and p values, they give a complete account of results, and they are the basis of meta-analysis and evidence-based practice.`,
    keyPoints: ["Definition and contrast with significance", "At least four reasons to report", "Cohen's d formula with worked example", "Eta squared and partial eta squared", "NNT, risk ratio and odds ratio worked", "Cohen's benchmarks with caveat", "Cautions such as imprecision and publication bias"],
    pitfalls: ["Treating Cohen's benchmarks as fixed rules", "Confusing odds ratio and risk ratio"],
    module: "statistics/3-4",
    visuals: [
      { kind: "worked", data: { title: "Three effect sizes from one trial", steps: [{ q: "d for means 20 and 25, SD 10?", a: "5 / 10 = 0.5" }, { q: "NNT for response 60 versus 40 percent?", a: "1 / 0.20 = 5" }, { q: "Odds ratio?", a: "1.5 / 0.667 = 2.25" }], yourTurn: [{ q: "Response 50 versus 25 percent: NNT?", a: "1 / 0.25 = 4" }] } },
      { kind: "guess", data: { prompt: "With d = 0.5, what percentage of the control group does the average treated person score better than?", min: 50, max: 100, step: 1, unit: "%", answer: [69, 69], reveal: "About 69 percent, the area below z = 0.5." } },
    ],
    ref: "Cohen 1988; APA Manual 7th ed; Lakens 2013 effect sizes. norm.cdf(0.5) = 0.691; d to r 0.2425; OR 2.25.",
  },
  {
    id: "stat-l03-027",
    subject: S,
    topic: "effect-size-power",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "mcp-entrance", "ma-semester"],
    question: "What is power analysis? Estimate the sample size needed per group to detect small, medium and large effects with an independent t-test, and discuss the factors involved.",
    plan: ["Define power and power analysis", "The four linked quantities", "Worked sample size estimates", "Factors and practical issues", "Conclusion"],
    answer: `## Meaning
Statistical power is the probability that a test will reject a false null hypothesis, that is, detect an effect that really exists. Power analysis is the use of the relationship between power, effect size, alpha and sample size to plan a study (a priori analysis) or judge what a study could detect (sensitivity analysis).

## Four linked quantities
- Alpha: the Type I error rate, usually 0.05.
- Power (1 minus beta): conventionally at least 0.80.
- Effect size: the expected size of the effect, such as Cohen's d.
- Sample size.
Fixing any three determines the fourth.

## Worked estimates
For an independent t-test, two-tailed, alpha 0.05 and power 0.80, a normal approximation gives n per group = 2 x [(1.96 + 0.84) / d] squared, where 1.96 is the critical z for alpha and 0.84 the z for 80 percent power. The exact t-based values are about one more per group.
| Effect | d | n per group (approximate) | n per group (exact t) | Total |
| Small | 0.2 | 2 x (2.80 / 0.2) squared = 392 | 394 | about 788 |
| Medium | 0.5 | 2 x (2.80 / 0.5) squared = 63 | 64 | about 128 |
| Large | 0.8 | 2 x (2.80 / 0.8) squared = 25 | 26 | about 52 |
Halving the effect size roughly quadruples the sample needed. With 20 per group, power to detect d = 0.5 is only about 0.34.

## Choosing the effect size
- From previous research or meta-analyses, adjusted downward because published effects tend to be inflated.
- The smallest effect of clinical or practical interest, such as a 5-point change on a depression scale.
- Pilot studies give unreliable estimates and should not be used alone.

## Factors that change the sample needed
- Smaller alpha (0.01) needs more participants.
- Higher power (0.90) needs more.
- One-tailed tests need fewer.
- Within-subjects designs and covariates need fewer, because they reduce error variance.
- Unreliable measures need more.
- Expected dropout: the target must be inflated, for example by 20 percent.
- Cluster designs (such as classes or schools) need more because of the design effect.

## Practical points
- Software such as G*Power or R packages perform these calculations for many tests.
- Ethics committees and funders expect a justified sample size.
- Underpowered studies waste resources, expose participants to research without much chance of a clear answer, and produce inflated estimates when they do find an effect.

## Conclusion
Power analysis ensures that a study is large enough to answer its question. For a medium effect in a two-group design, about 64 participants per group are needed; for a small effect, nearly 400 per group.`,
    keyPoints: ["Definition of power and power analysis", "Four linked quantities", "Correct formula", "Sample sizes about 394, 64 and 26 per group", "Choosing the effect size", "Factors affecting the sample", "Ethical and practical importance"],
    module: "statistics/3-4",
    visuals: [
      { kind: "experiment", data: { title: "Participants needed per group for 80 percent power", question: "How many people per group to detect each effect size?", unit: " per group", max: 400, conditions: [{ label: "Large, d = 0.8", value: 26 }, { label: "Medium, d = 0.5", value: 64 }, { label: "Small, d = 0.2", value: 394 }], why: "Halving the effect roughly quadruples the sample needed." } },
    ],
    ref: "Cohen 1988 Table 2.4.1; Faul et al 2007 G*Power. Python: normal approx 392.4, 62.8, 24.5; noncentral t power at n=394 (0.2), 64 (0.5), 26 (0.8) each about 0.80.",
  },
  {
    id: "stat-l03-028",
    subject: S,
    topic: "regression",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Explain simple and multiple linear regression. Using the data on hours of study (X: 2, 4, 6, 8, 10) and test scores (Y: 52, 60, 58, 70, 66), find the regression equation, predict the score for 7 hours of study and calculate the standard error of estimate. Discuss the assumptions of regression and how multiple regression extends the model.",
    plan: ["Purpose of regression and the least squares line", "Worked slope, intercept and prediction", "R squared and standard error of estimate", "Assumptions and diagnostics", "Multiple regression: coefficients, R squared, standardised betas", "Uses, cautions and conclusion"],
    answer: `## Purpose
Regression predicts the value of a criterion (dependent) variable from one or more predictor variables. Correlation tells us how strongly two variables are related; regression gives the equation for predicting one from the other. Francis Galton introduced the term after noticing that tall parents had children who were tall but closer to the average, which he called regression towards mediocrity.

## The simple regression equation
Y predicted = a + bX, where b is the slope (the change in Y for each one-unit increase in X) and a is the intercept (predicted Y when X is 0). The method of least squares chooses a and b to make the sum of squared prediction errors (residuals) as small as possible.
- b = SP / SSx, where SP is the sum of products of deviations and SSx the sum of squared deviations of X.
- a = mean of Y minus b x mean of X.

## Worked example
| X | Y | X minus 6 | Y minus 61.2 | Product | (X minus 6) squared |
| 2 | 52 | minus 4 | minus 9.2 | 36.8 | 16 |
| 4 | 60 | minus 2 | minus 1.2 | 2.4 | 4 |
| 6 | 58 | 0 | minus 3.2 | 0 | 0 |
| 8 | 70 | 2 | 8.8 | 17.6 | 4 |
| 10 | 66 | 4 | 4.8 | 19.2 | 16 |
| Sum | | | | SP = 76 | SSx = 40 |
- Mean X = 6, mean Y = 61.2.
- b = 76 / 40 = 1.9.
- a = 61.2 minus 1.9 x 6 = 61.2 minus 11.4 = 49.8.
- Regression equation: Y predicted = 49.8 + 1.9X.
- Each extra hour of study predicts 1.9 more marks; with zero hours the predicted score is 49.8 (an extrapolation, since no one studied zero hours).
- Prediction for 7 hours: 49.8 + 1.9 x 7 = 49.8 + 13.3 = 63.1.

## Accuracy of prediction
- Residuals (Y minus predicted Y): minus 1.6, 2.6, minus 3.2, 5.0, minus 2.8. Their squares sum to SS residual = 52.4.
- Total SS of Y = 196.8. R squared = 1 minus 52.4 / 196.8 = 0.73, the same as r squared (0.857 squared). Study time accounts for about 73 percent of the variance in scores.
- Standard error of estimate = square root of [SS residual / (N minus 2)] = square root of (52.4 / 3) = 4.18. Predictions are typically off by about 4 marks. A rough 95 percent band around a prediction is about plus or minus 2 standard errors, so the 7-hour prediction of 63 could easily range from about 55 to 71.
- The slope's t = 1.9 / 0.66 = 2.88 with 3 df, p about 0.06: not significant with only five students, matching the correlation test.

## Assumptions
- Linearity between predictors and criterion.
- Independence of errors (checked with the Durbin Watson statistic in time-ordered data).
- Homoscedasticity: residuals have equal spread at all predicted values.
- Normality of residuals.
- No influential outliers (checked with Cook's distance and leverage).
- For multiple regression, no severe multicollinearity.
Residual plots are the main diagnostic tool.

## Multiple regression
Multiple regression predicts Y from two or more predictors: Y predicted = a + b1X1 + b2X2 + ... + bkXk. Example: predicting first-year university marks from school marks, an aptitude test and conscientiousness.
- Each b is a partial regression coefficient: the change in Y for a one-unit change in that predictor, holding the others constant.
- Standardised coefficients (beta weights) put predictors on the same scale and help compare their relative contributions.
- Multiple R is the correlation between observed and predicted Y; R squared is the proportion of variance explained by all predictors together. Adjusted R squared corrects for the number of predictors.
- The overall F test asks whether the predictors together explain significant variance; t tests examine each coefficient.
- Methods of entry: simultaneous (all at once), hierarchical (blocks entered in an order set by theory, testing the change in R squared), and stepwise (entry decided by statistics, which capitalises on chance and is generally discouraged).
- Sample size rules of thumb: at least 10 to 15 cases per predictor, or 50 + 8k for testing the overall model.

## Uses in psychology
Selection and admission decisions, predicting relapse or treatment response, identifying risk factors for depression, and testing theories with mediation and moderation models.

## Cautions
- Prediction is not causation.
- Do not extrapolate beyond the range of the data.
- Coefficients are unstable when predictors are highly correlated.
- Overfitting: a model may fit the sample well but predict new samples poorly; cross-validation helps.

## Conclusion
Regression turns a correlation into a prediction rule and, in its multiple form, estimates the unique contribution of several predictors. A good analysis reports the equation, R squared, the standard error of estimate, tests of coefficients and checks of assumptions.`,
    keyPoints: ["Purpose and least squares", "Correct SP = 76 and SSx = 40", "b = 1.9, a = 49.8", "Prediction 63.1 for 7 hours", "R squared 0.73 and SE of estimate 4.18", "At least five assumptions with diagnostics", "Multiple regression with partial coefficients, betas and R squared", "Hierarchical versus stepwise entry and cautions"],
    pitfalls: ["Swapping slope and intercept", "Extrapolating far outside the data", "Inferring cause from a regression coefficient"],
    module: "statistics/3-5",
    visuals: [
      { kind: "worked", data: { title: "Fitting the regression line", steps: [{ q: "Slope?", a: "SP / SSx = 76 / 40 = 1.9" }, { q: "Intercept?", a: "61.2 minus 1.9 x 6 = 49.8" }, { q: "Predict 7 hours?", a: "49.8 + 13.3 = 63.1" }, { q: "Standard error of estimate?", a: "Square root of 52.4 / 3 = 4.18" }], yourTurn: [{ q: "Predict the score for 5 hours.", a: "49.8 + 9.5 = 59.3" }] } },
    ],
    ref: "Garrett ch 7; Field ch 9; Tabachnick and Fidell ch 5. scipy linregress slope 1.9, intercept 49.8, r2 0.7337, SSres 52.4, SEest 4.179, slope SE 0.661, t 2.875.",
  },
  {
    id: "stat-l03-029",
    subject: S,
    topic: "regression",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester"],
    question: "What is multicollinearity in multiple regression? How is it detected and handled? Compare hierarchical and stepwise regression.",
    plan: ["Define multicollinearity and its effects", "Detection: correlations, VIF, tolerance", "Remedies", "Hierarchical regression with example", "Stepwise regression and its problems", "Conclusion"],
    answer: `## Multicollinearity
Multicollinearity occurs when two or more predictors in a multiple regression are highly correlated with each other. Perfect multicollinearity (one predictor is an exact combination of others) makes the model impossible to estimate; high but imperfect multicollinearity creates practical problems.

## Effects
- Regression coefficients become unstable: small changes in the data change them greatly, and their signs can flip.
- Standard errors of coefficients are inflated, so individual predictors may be non-significant even when the overall R squared is large.
- It becomes difficult to judge the unique importance of each predictor, because they share variance.
- Prediction from the whole model is not necessarily harmed, but interpretation is.
Example: predicting depression from both a stress scale and an anxiety scale that correlate at 0.85; neither may appear significant on its own although together they predict well.

## Detection
- Correlation matrix: predictor correlations above about 0.80 or 0.90 are warning signs, though multicollinearity can involve several predictors together.
- Tolerance = 1 minus R squared of a predictor regressed on all other predictors. Values below about 0.10 to 0.20 indicate a problem.
- Variance inflation factor (VIF) = 1 / tolerance. VIF above 10 is a common warning threshold; some use 5.
- Condition indices and variance proportions from collinearity diagnostics.

## Remedies
- Remove one of the redundant predictors, guided by theory.
- Combine correlated predictors into a single composite or factor score.
- Use principal component regression or ridge regression.
- Collect more data or centre variables (centring helps when interaction or squared terms are included).

## Hierarchical regression
Predictors are entered in blocks in an order determined by theory. At each step the change in R squared is tested.
Example: predicting post-traumatic stress symptoms in flood survivors. Step 1: age and gender (R squared = 0.05). Step 2: trauma exposure (R squared = 0.20, change 0.15). Step 3: social support (R squared = 0.28, change 0.08). The significant R squared change at step 3 shows that social support predicts symptoms beyond demographics and exposure.
- Advantages: theory-driven, tests specific hypotheses about incremental validity, controls for confounders.

## Stepwise regression
The computer adds or removes predictors based purely on statistical criteria, such as the predictor that most increases R squared (forward), removing the least useful (backward), or both (stepwise).
- Problems: capitalises on chance features of the sample; results often fail to replicate; standard errors and p values are biased; the chosen model can change with tiny changes in data; it replaces thinking with an algorithm. Most methodologists advise against it except for pure exploratory prediction with cross-validation.

## Comparison
| Feature | Hierarchical | Stepwise |
| Order of entry | Researcher, by theory | Computer, by statistics |
| Purpose | Test hypotheses, incremental validity | Find a compact predictive set |
| Replicability | Higher | Lower |
| Risk of chance findings | Lower | High |

## Conclusion
Multicollinearity blurs the contribution of individual predictors and should be checked with tolerance and VIF. Theory-based hierarchical regression is generally preferred to stepwise methods in psychological research.`,
    keyPoints: ["Definition and effects of multicollinearity", "Tolerance and VIF with thresholds", "At least three remedies", "Hierarchical regression with R squared change example", "Problems of stepwise regression", "Comparison table"],
    module: "statistics/3-5",
    visuals: [
      { kind: "compare", data: { title: "Two ways to enter predictors", a: { label: "Hierarchical", points: ["Order set by theory", "Tests change in R squared", "More replicable"], summary: "Hypothesis testing." }, b: { label: "Stepwise", points: ["Order set by the computer", "Capitalises on chance", "Often fails to replicate"], summary: "Exploratory at best." } } },
    ],
    ref: "Tabachnick and Fidell ch 5; Field ch 9; Thompson 1995 on stepwise",
  },
  {
    id: "stat-l03-030",
    subject: S,
    topic: "regression",
    marks: 5,
    difficulty: 3,
    exams: ["ugc-net", "md-psychiatry", "ma-semester"],
    question: "Write a short note on logistic regression.",
    plan: ["When it is used", "Logit and odds", "Interpreting odds ratios with an example", "Fit and assumptions"],
    answer: `## When it is used
Logistic regression predicts a categorical outcome, usually binary (such as relapse or no relapse, diagnosis present or absent, passed or failed), from one or more predictors that can be continuous or categorical. Ordinary linear regression is unsuitable because it can predict probabilities below 0 or above 1 and its assumptions of normal, equal-variance errors are violated.

## The model
Logistic regression models the log of the odds (the logit) of the outcome as a linear function of the predictors: log [p / (1 minus p)] = a + b1X1 + b2X2 ... The predicted probability follows an S-shaped curve between 0 and 1. Coefficients are estimated by maximum likelihood rather than least squares.

## Interpreting odds ratios
The exponent of a coefficient, Exp(B), is an odds ratio: the factor by which the odds of the outcome change for a one-unit increase in the predictor, holding others constant.
Example: in predicting relapse in schizophrenia, Exp(B) for high expressed emotion in the family = 3.0 means that patients in high expressed emotion families have three times the odds of relapse. An odds ratio of 1 means no effect; below 1 means lower odds, such as 0.6 for medication adherence.

## Fit and assumptions
- Overall fit: the likelihood ratio chi-square, pseudo R squared values (Nagelkerke, Cox and Snell) and the Hosmer Lemeshow test.
- Classification table: percentage of cases correctly predicted, sensitivity and specificity.
- Assumptions: independent observations, linearity between continuous predictors and the logit, no severe multicollinearity, and enough cases (at least about 10 events per predictor).
Multinomial and ordinal logistic regression handle outcomes with more than two categories.`,
    keyPoints: ["Binary outcome use case", "Why linear regression fails", "Logit and maximum likelihood", "Odds ratio interpretation with example", "Fit indices and assumptions"],
    module: "statistics/3-5",
    visuals: [
      { kind: "reveal", data: { prompt: "Exp(B) for daily cannabis use predicting psychosis is 2.5. What does this mean?", answer: "Daily users have 2.5 times the odds of psychosis compared with non-users, holding the other predictors constant. It is an association, not proof of cause." } },
    ],
    ref: "Field ch 20; Tabachnick and Fidell ch 10; Peduzzi et al 1996 events per variable",
  },
];
