/* Module · Statistics for psychology, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: ANOVA, models and measurement

## 3.1 One-way analysis of variance (ANOVA) [core][advanced]
To compare **three or more** group means, you could run a t-test for every pair. Do not. Each test carries a 5% risk of a false positive, and the risks pile up.

:::widget guess
{"prompt": "You compare 5 groups with t-tests on every pair (10 tests), each at α = .05. Roughly what is the chance of at least one false positive if no real differences exist?", "min": 0, "max": 100, "unit": "%", "answer": [38, 42], "reveal": "About 40%: the familywise error rate is 1 − (1 − .05)^10 = 1 − .95^10 = .40. With three groups (3 tests) it is already about 14%. ANOVA tests all the means in one test at α = .05."}
:::

### The logic: partitioning variance
ANOVA (R. A. Fisher) splits the total variability of the scores into two parts:
- **Between-groups variability:** how far the group means differ from the grand mean. It reflects the treatment effect **plus** error.
- **Within-groups variability:** how far scores differ from their own group mean. It reflects **error only** (individual differences, measurement error).

**F = MS between ÷ MS within.** If H0 is true, both estimate the same error variance and F is about 1. A large F means the group means differ more than chance would predict.

:::widget flow
{"title": "Partitioning the variance in one-way ANOVA", "layout": "tree", "nodes": [{"id": "t", "label": "Total variability (SS total)", "detail": "Every score's distance from the grand mean"}, {"id": "b", "label": "Between groups", "detail": "Treatment effect plus error", "parent": "t"}, {"id": "w", "label": "Within groups", "detail": "Error only", "parent": "t"}], "caption": "F compares the two branches: MS between divided by MS within."}
:::

### The formulas
- SS total = Σ(X − GM)², where GM is the grand mean. Computational: ΣX² − (ΣX)² ÷ N.
- SS between = Σ n(Mj − GM)². Computational: Σ(Tj² ÷ nj) − (ΣX)² ÷ N, where Tj is each group's total.
- SS within = SS total − SS between (or the sum of each group's SS).
- df between = k − 1; df within = N − k; df total = N − 1.
- MS = SS ÷ df. **F = MS between ÷ MS within**, compared with critical F for (df between, df within).

:::widget worked
{"title": "Computing F by hand", "steps": [{"q": "Twelve students in Bhubaneswar are randomly assigned to three revision methods: re-reading (4, 5, 6, 5), highlighting plus summary (7, 8, 6, 7) and self-testing (9, 10, 11, 10). Score = items recalled. Find the group totals, means and the grand mean.", "a": "Totals: 20, 28, 40. Means: 5, 7, 10. ΣX = 88, N = 12, grand mean = 88 ÷ 12 = 7.33."}, {"q": "Compute SS total using ΣX² − (ΣX)² ÷ N.", "a": "ΣX² = 16 + 25 + 36 + 25 + 49 + 64 + 36 + 49 + 81 + 100 + 121 + 100 = 702. (ΣX)² ÷ N = 7,744 ÷ 12 = 645.33. SS total = 702 − 645.33 = 56.67."}, {"q": "Compute SS between using Σ(T² ÷ n) − (ΣX)² ÷ N.", "a": "(400 + 784 + 1,600) ÷ 4 = 2,784 ÷ 4 = 696. SS between = 696 − 645.33 = 50.67."}, {"q": "Compute SS within, and check it directly.", "a": "SS within = 56.67 − 50.67 = 6.00. Check: re-reading deviations −1, 0, 1, 0 give SS 2; highlighting 0, 1, −1, 0 give 2; self-testing −1, 0, 1, 0 give 2. Total 6. Correct."}, {"q": "Fill in df, MS and F.", "a": "df between = 3 − 1 = 2; df within = 12 − 3 = 9. MS between = 50.67 ÷ 2 = 25.33. MS within = 6 ÷ 9 = 0.667. F = 25.33 ÷ 0.667 = 38.0."}, {"q": "Decide, and give the effect size. (Critical F for 2 and 9 df at .05 is 4.26.)", "a": "38.0 far exceeds 4.26: the methods differ. η² = SS between ÷ SS total = 50.67 ÷ 56.67 = .89 (in real studies, values this large are rare). APA: F(2, 9) = 38.00, p below .001, η² = .89. A post hoc test is needed to see which pairs differ."}], "yourTurn": [{"q": "An ANOVA on 4 groups of 10 gives SS between = 120 and SS within = 360. Fill in the table and find F.", "a": "df between = 3, df within = 36. MS between = 40; MS within = 10. F(3, 36) = 4.00. η² = 120 ÷ 480 = .25."}]}
:::

### The summary table
| Source | SS | df | MS | F |
|---|---|---|---|---|
| Between groups | 50.67 | 2 | 25.33 | 38.00 |
| Within groups (error) | 6.00 | 9 | 0.67 | |
| Total | 56.67 | 11 | | |

### After a significant F: post hoc tests and contrasts
A significant F says **at least one** mean differs, not which.
- **Planned (a priori) contrasts:** specific comparisons decided before the data; more powerful.
- **Post hoc tests** (all pairs, decided after):
  - **Tukey's HSD:** all pairwise comparisons, equal n; the usual choice.
  - **Scheffé:** the most conservative; allows complex comparisons (one mean against the average of two).
  - **Bonferroni:** divide α by the number of comparisons (.05 ÷ 3 = .0167).
  - **Fisher's LSD:** the least conservative (most power, highest Type I risk); only after a significant F.
  - **Dunnett:** each group against one control group.
  - **Games-Howell:** when variances are unequal.

### Assumptions
Independence of observations, normality within groups and **homogeneity of variance** (Levene's test). ANOVA is fairly robust to non-normality and to unequal variances when group sizes are equal. If variances differ, use **Welch's F** or **Brown-Forsythe**.

:::recall
1. What is the formula for F? || F = MS between ÷ MS within.
2. Give the df for between and within groups. || k − 1 and N − k.
3. Why not run several t-tests instead of ANOVA? || The familywise Type I error rate inflates: 1 − (1 − α)^c.
4. Which post hoc test is most conservative? Least? || Scheffé; Fisher's LSD.
5. What does F close to 1 suggest? || The group means differ no more than chance (error) would predict.
:::

:::mcq
Q: In a one-way ANOVA with 4 groups and 40 participants, the df are:
- 4 and 40
- *3 and 36
- 3 and 39
- 4 and 36
> k − 1 = 3; N − k = 36.

Q: SS between = 60, df between = 2, SS within = 270, df within = 27. F is:
- 2.22
- 0.22
- 4.5
- *3.0
> MS between = 30; MS within = 10; F = 3.

Q: The post hoc test that compares each treatment group only with a single control group is:
- *Dunnett
- Tukey
- Scheffé
- LSD
> Dunnett's test is built for many-versus-one comparisons.
:::

## 3.2 Factorial, repeated-measures and multivariate designs [core][advanced]

### Two-way (factorial) ANOVA
With two IVs, A and B, the total SS splits into **A**, **B**, the **A × B interaction** and **within (error)**.

| Source | df |
|---|---|
| A | a − 1 |
| B | b − 1 |
| A × B | (a − 1)(b − 1) |
| Within | N − ab |
| Total | N − 1 |

Each effect has its own F = MS effect ÷ MS within. A significant interaction means the effect of A **depends on** the level of B. Follow it with **simple effects** (the effect of A at each level of B) and an interaction plot.

:::widget worked
{"title": "Reading a two-way ANOVA", "steps": [{"q": "A study in Mumbai crosses Feedback (praise vs none) with Task difficulty (easy vs hard), 10 students per cell (N = 40). SS: Feedback 40, Difficulty 10, Interaction 30, Within 160. Find all the df.", "a": "Feedback 1, Difficulty 1, Interaction (1)(1) = 1, Within 40 − 4 = 36, Total 39."}, {"q": "Compute MS within and the three F ratios.", "a": "MS within = 160 ÷ 36 = 4.44. F Feedback = 40 ÷ 4.44 = 9.0. F Difficulty = 10 ÷ 4.44 = 2.25. F Interaction = 30 ÷ 4.44 = 6.75."}, {"q": "Critical F(1, 36) at .05 is 4.11. Which effects are significant?", "a": "Feedback (9.0) and the interaction (6.75) are; difficulty (2.25) is not."}, {"q": "How do you interpret the significant interaction before the main effect?", "a": "Praise helps more on one kind of task than the other; for example, a big benefit on hard tasks and little on easy ones. Test the simple effect of feedback at each difficulty level and draw the plot. The main effect of feedback is an average that hides this."}]}
:::

:::widget flow
{"title": "The ANOVA family", "layout": "tree", "nodes": [{"id": "a", "label": "Comparing means with ANOVA", "detail": ""}, {"id": "one", "label": "One IV, separate groups", "detail": "One-way ANOVA", "parent": "a"}, {"id": "fac", "label": "Two or more IVs", "detail": "Factorial ANOVA: main effects and interactions", "parent": "a"}, {"id": "rm", "label": "Same people in every condition", "detail": "Repeated-measures ANOVA; check sphericity", "parent": "a"}, {"id": "mix", "label": "One between, one within factor", "detail": "Mixed ANOVA: group × time", "parent": "a"}, {"id": "anc", "label": "Plus a continuous covariate", "detail": "ANCOVA", "parent": "a"}, {"id": "man", "label": "Several correlated DVs", "detail": "MANOVA", "parent": "a"}]}
:::

### Repeated-measures ANOVA
The same people are measured under every condition (or at several time points). Individual differences are removed from the error term, so it is **more powerful**.
- Extra assumption: **sphericity**: the variances of the differences between all pairs of conditions are equal. Tested by **Mauchly's test**. If violated, correct the df with **Greenhouse-Geisser** (conservative) or **Huynh-Feldt**.
- A **mixed (split-plot) ANOVA** has one between-subjects factor (therapy vs control) and one within-subjects factor (time). In most therapy trials the key result is the **group × time interaction**.

### ANCOVA (analysis of covariance)
ANOVA plus a continuous **covariate** (often the pretest score). It:
- **removes** the covariate's effect from the DV, reducing error variance and raising power;
- **adjusts** the group means for small differences on the covariate.
Extra assumptions: the covariate is measured reliably, ideally before treatment, is linearly related to the DV, and **homogeneity of regression slopes** (the covariate-DV relation is the same in every group). ANCOVA cannot "fix" big pre-existing group differences in non-randomised studies.

### MANOVA (multivariate ANOVA)
Two or more **correlated DVs** at once (anxiety, depression and stress scores). It controls the Type I error that separate ANOVAs would inflate and can detect group differences on a combination of DVs.
- Test statistics: **Wilks' lambda** (most common; small values mean big differences), **Pillai's trace** (most robust when assumptions are shaky), **Hotelling's trace**, **Roy's largest root**.
- Extra assumption: homogeneity of covariance matrices (**Box's M** test).
- Follow up a significant MANOVA with separate ANOVAs or discriminant function analysis.

:::widget sort
{"prompt": "Which analysis fits each design?", "buckets": ["One-way ANOVA", "Factorial ANOVA", "Repeated-measures or mixed ANOVA", "ANCOVA or MANOVA"], "items": [{"text": "Compare stress across four hospital departments", "bucket": 0}, {"text": "Gender × type of school on achievement motivation", "bucket": 1}, {"text": "Same patients' craving at baseline, 1 month and 3 months", "bucket": 2}, {"text": "Compare two therapies on post-test depression, adjusting for pre-test depression", "bucket": 3, "why": "The pretest is a covariate: ANCOVA."}, {"text": "Therapy vs control, measured before, after and at follow-up", "bucket": 2, "why": "One between and one within factor: a mixed design."}, {"text": "Three teaching methods compared on reading, writing and comprehension scores together", "bucket": 3, "why": "Several correlated DVs: MANOVA."}]}
:::

:::recall
1. In a 3 × 4 ANOVA with 5 people per cell, what are the df for A, B, A × B and within? || 2, 3, 6 and 60 − 12 = 48.
2. What is sphericity, and what corrections are used if it fails? || Equal variances of all pairwise difference scores in repeated measures; Greenhouse-Geisser or Huynh-Feldt.
3. What two things does ANCOVA do to the DV? || Removes covariate-related error variance and adjusts group means for the covariate.
4. What is homogeneity of regression slopes? || The covariate-DV relation is the same in every group (an ANCOVA assumption).
5. Name the four MANOVA test statistics. Which is most robust? || Wilks' lambda, Pillai's trace, Hotelling's trace, Roy's largest root; Pillai's trace.
:::

:::mcq
Q: In a therapy trial (therapy vs control, measured pre and post), the key test of whether therapy worked is usually the:
- Main effect of group
- *Group × time interaction
- Main effect of time
- Mauchly test of sphericity
> Therapy should change scores over time more than control does.

Q: Mauchly's test is used to check:
- Homogeneity of variance between groups
- Normality
- *Sphericity in repeated measures
- Homogeneity of regression slopes
> It tests the sphericity assumption.

Q: A researcher measures anxiety, depression and stress after three interventions and analyses them together. The analysis is:
- ANCOVA
- Two-way ANOVA
- Kruskal-Wallis
- *MANOVA
> Several DVs at once.
:::

## 3.3 Non-parametric tests [core][advanced]
**Non-parametric (distribution-free) tests** make fewer assumptions about the population. Use them when data are **ordinal**, when samples are **small and clearly non-normal**, or when there are **outliers**. Most work on **ranks**. They are usually **less powerful** than parametric tests when parametric assumptions are met.

### Parametric tests and their non-parametric partners
| Design | Parametric | Non-parametric |
|---|---|---|
| Two independent groups | Independent t | **Mann-Whitney U** (Wilcoxon rank-sum); median test |
| Two related measures | Paired t | **Wilcoxon signed-rank**; **sign test** |
| Three or more independent groups | One-way ANOVA | **Kruskal-Wallis H** |
| Three or more related measures | Repeated-measures ANOVA | **Friedman** test |
| Relation between two variables | Pearson r | **Spearman ρ**, Kendall τ |
| Nominal data, independent | No parametric test | **Chi-square**, Fisher's exact test |
| Nominal data, related (two times) | No parametric test | **McNemar** test; Cochran's Q for three or more |
| Fit to a distribution | No parametric test | Chi-square goodness of fit; **Kolmogorov-Smirnov**; Shapiro-Wilk (normality) |

:::widget sort
{"prompt": "The data break the assumptions of the parametric test. Which non-parametric test should replace it?", "buckets": ["Mann-Whitney U", "Wilcoxon signed-rank", "Kruskal-Wallis", "Friedman", "Spearman's rho"], "items": [{"text": "Independent t: pain ratings in a yoga group and a control group", "bucket": 0}, {"text": "Paired t: the same patients' sleep ratings before and after treatment", "bucket": 1}, {"text": "One-way ANOVA: satisfaction ranks in three separate clinics", "bucket": 2}, {"text": "Repeated-measures ANOVA: the same students rated at three time points", "bucket": 3}, {"text": "Pearson r: merit rank and rank in a sports trial", "bucket": 4}]}
:::

:::widget worked
{"title": "Mann-Whitney U by hand", "steps": [{"q": "Ten children rate enjoyment (0 to 25) after a lesson: new storytelling method 12, 15, 18, 20, 22; usual method 8, 10, 11, 14, 16. Rank all ten together (1 = lowest).", "a": "8 (1), 10 (2), 11 (3), 12 (4), 14 (5), 15 (6), 16 (7), 18 (8), 20 (9), 22 (10)."}, {"q": "Sum the ranks in each group.", "a": "New method: 4 + 6 + 8 + 9 + 10 = 37. Usual: 1 + 2 + 3 + 5 + 7 = 18. Check: the total must be N(N + 1) ÷ 2 = 55. It is."}, {"q": "Compute U for each group: U1 = n1n2 + n1(n1 + 1) ÷ 2 − R1.", "a": "U new = 25 + 15 − 37 = 3. U usual = 25 + 15 − 18 = 22. Check: U1 + U2 = n1n2 = 25."}, {"q": "U is the smaller value. Critical U for n1 = n2 = 5, two-tailed .05, is 2. Decide.", "a": "U = 3. For Mann-Whitney, the result is significant only if U is at or below the critical value. 3 is above 2, so it is not significant (exact p = .056). Unlike t or F, a smaller U means a bigger difference."}], "yourTurn": [{"q": "In a Mann-Whitney test, what would U = 0 mean?", "a": "Complete separation: every score in one group is higher than every score in the other."}]}
:::

:::widget worked
{"title": "Wilcoxon signed-rank and the sign test", "steps": [{"q": "Eight adolescents rate craving before and after a mindfulness module. Before: 10, 14, 9, 12, 15, 11, 13, 8. After: 7, 9, 10, 8, 9, 10, 7, 6. Find the differences (before − after).", "a": "3, 5, −1, 4, 6, 1, 6, 2."}, {"q": "Rank the absolute differences, giving ties the average rank.", "a": "|1| and |1| share ranks 1 and 2, so 1.5 each; 2 gets 3; 3 gets 4; 4 gets 5; 5 gets 6; the two 6s share 7 and 8, so 7.5 each."}, {"q": "Sum the ranks for positive and for negative differences.", "a": "Positive: 4 + 6 + 5 + 7.5 + 1.5 + 7.5 + 3 = 34.5. Negative (the one −1): 1.5. T = the smaller = 1.5."}, {"q": "Critical T for n = 8, two-tailed .05, is 3. Decide.", "a": "T = 1.5 is at or below 3: significant. Craving fell (exact p = .023)."}, {"q": "Now run the cruder sign test on the same data: count the signs only.", "a": "7 pluses and 1 minus. Under H0 each sign has probability 1/2. Two-tailed p = 2 × (1 + 8) ÷ 256 = .07: not significant. The sign test throws away the size of each difference, so it has less power than Wilcoxon."}]}
:::

### Kruskal-Wallis and Friedman
- **Kruskal-Wallis H:** rank all scores together, sum ranks in each group (R), then H = [12 ÷ (N(N + 1))] × Σ(R² ÷ n) − 3(N + 1), compared with χ² on k − 1 df. Example: three groups of four with rank sums 11, 26 and 41 (N = 12): H = (12 ÷ 156) × (121 + 676 + 1,681) ÷ 4 − 39 = 0.0769 × 619.5 − 39 = 8.65, above the χ² critical value of 5.99 for 2 df, so significant.
- **Friedman test:** the same people under three or more conditions; rank within each person, then compare rank sums across conditions; tested against χ² with k − 1 df.

:::recall
1. Name the non-parametric partner of the independent t, paired t, one-way ANOVA and repeated-measures ANOVA. || Mann-Whitney U, Wilcoxon signed-rank, Kruskal-Wallis, Friedman.
2. For Mann-Whitney and Wilcoxon, is a smaller or larger statistic more significant? || Smaller: significant if at or below the critical value.
3. Why is the sign test less powerful than the Wilcoxon test? || It uses only the direction of each difference, ignoring its size.
4. What distribution is Kruskal-Wallis H compared with? || Chi-square with k − 1 df.
:::

:::mcq
Q: Three wards rate patient satisfaction on a 1-to-5 ordinal scale, with small samples. The best test is:
- One-way ANOVA
- *Kruskal-Wallis H
- Friedman test
- Paired-samples t
> Independent groups, ordinal data, three groups.

Q: The same 15 patients rank three therapy styles in order of preference. Use the:
- *Friedman test
- Kruskal-Wallis test
- Mann-Whitney U
- Chi-square goodness of fit
> Related measures, ranks, three conditions.

Q: A main disadvantage of non-parametric tests is that they:
- Need data from a normal population
- Need at least interval-level data
- Cannot be used at all with samples of under thirty people
- *Have less power when parametric assumptions are met
> They use ranks, so some information is lost.
:::

## 3.4 Effect size and power [core][advanced]
A p value tells you whether an effect is likely to be more than chance. An **effect size** tells you **how big** it is. APA requires both.

### The common effect sizes
| Effect size | Used with | Small | Medium | Large (Cohen's labels) |
|---|---|---|---|---|
| **Cohen's d** = (M1 − M2) ÷ pooled SD | t-tests | 0.2 | 0.5 | 0.8 |
| **r** (or φ) | Correlation, chi-square 2 × 2 | .10 | .30 | .50 |
| **η²** = SS effect ÷ SS total | ANOVA | .01 | .06 | .14 |
| **Partial η²** = SS effect ÷ (SS effect + SS error) | Factorial ANOVA (SPSS default) | .01 | .06 | .14 |
| **ω²** (omega squared) | ANOVA; less biased than η² | .01 | .06 | .14 |
| **R², f²** | Regression | .02 (f²) | .15 | .35 |
| **Odds ratio** | Two-by-two outcomes, logistic regression | 1.5 | 2.5 | 4 (rough) |

Cohen himself said these labels are rough defaults for when nothing better is known. A d of 0.3 for a cheap school programme reaching millions may matter more than a d of 1.0 in a lab.

:::widget sort
{"prompt": "Using Cohen's rough labels, is each effect small, medium or large?", "buckets": ["Small", "Medium", "Large"], "items": [{"text": "Cohen's d of 0.2", "bucket": 0}, {"text": "Cohen's d of 0.5", "bucket": 1}, {"text": "Cohen's d of 0.85", "bucket": 2}, {"text": "A correlation of .12", "bucket": 0}, {"text": "A correlation of .30", "bucket": 1}, {"text": "A correlation of .55", "bucket": 2}, {"text": "Eta squared of .15", "bucket": 2, "why": "For ANOVA, .01 is small, .06 medium and .14 large."}]}
:::

### Useful conversions
- d from an independent t: d = t × √(1/n1 + 1/n2).
- r from d (equal groups): r = d ÷ √(d² + 4).
- η² from F: η² = (F × df between) ÷ (F × df between + df within).
- d = 0.5 means the average treated person scores higher than about **69%** of the control group (Cohen's U3).

:::widget worked
{"title": "From a result to its size", "steps": [{"q": "A trial in Chennai: CBT group (n = 30) M = 12, SD = 5; waiting list (n = 30) M = 18, SD = 6, on a depression scale. Compute Cohen's d.", "a": "Pooled SD (equal n) = √[(25 + 36) ÷ 2] = √30.5 = 5.52. d = (18 − 12) ÷ 5.52 = 1.09: a large effect (CBT lower on depression)."}, {"q": "Convert d to r.", "a": "r = 1.09 ÷ √(1.09² + 4) = 1.09 ÷ √5.19 = 1.09 ÷ 2.28 = .48."}, {"q": "The three-group ANOVA in 3.1 gave F(2, 9) = 38. Recover η².", "a": "η² = (38 × 2) ÷ (38 × 2 + 9) = 76 ÷ 85 = .89, matching the SS calculation."}, {"q": "Compute omega squared for the same ANOVA: ω² = (SS between − df between × MS within) ÷ (SS total + MS within).", "a": "(50.67 − 2 × 0.667) ÷ (56.67 + 0.667) = 49.33 ÷ 57.33 = .86. Slightly smaller than η², because η² overestimates the population effect, especially in small samples."}]}
:::

:::widget curve
{"kind": "sdt", "title": "Power as overlap between two distributions", "caption": "Treat one curve as 'no effect' and the other as 'real effect'. The criterion is your critical value. Pull the curves apart (bigger effect or bigger sample) and watch power (hits) rise while α (false alarms) stays the same."}
:::

### Power analysis
Power depends on four linked quantities: **α, power, effect size and n**. Fix any three and you can solve for the fourth.
- **A priori** power analysis (before the study) finds the **n** needed. Free software such as **G*Power** does this.
- **Post hoc ("observed") power** computed from the obtained result adds nothing beyond the p value; reviewers discourage it.
- Plan the expected effect size from past studies, a pilot, or the **smallest effect that would matter in practice**. Effect sizes in published studies are usually inflated, so be conservative.

:::widget guess
{"prompt": "For an independent-samples t-test (two-tailed, α = .05, power .80) to detect a medium effect (d = 0.5), how many people do you need in EACH group?", "min": 10, "max": 200, "unit": "per group", "answer": [60, 68], "reveal": "About 64 per group (128 in all). For a large effect (d = 0.8) you need about 26 per group; for a small effect (d = 0.2), about 394 per group. Many student theses with 30 per group can only reliably detect large effects."}
:::

:::trap Significance is not importance
With 20,000 participants, a d of 0.03 can give p below .001. With 12 participants, a d of 0.9 can give p = .15. Always read p together with the effect size and its confidence interval. In clinical work, also ask about **clinical significance**: did people move into the normal range? (Jacobson and Truax's **reliable change index** answers this for individuals.)
:::

:::recall
1. Give Cohen's benchmarks for d and for r. || d: 0.2, 0.5, 0.8. r: .10, .30, .50.
2. Write the formula for η². || SS effect ÷ SS total.
3. Name the four quantities linked in a power analysis. || Alpha, power, effect size and sample size.
4. About how many people per group are needed to detect d = 0.5 with power .80 at α = .05, two-tailed? || About 64 per group.
5. Why is post hoc observed power uninformative? || It is a direct transformation of the obtained p value, so it adds no new information.
:::

:::mcq
Q: Two groups have means of 50 and 56, with a pooled SD of 12. Cohen's d is:
- 0.2
- 0.8
- *0.5
- 6
> d = 6 ÷ 12 = 0.5, a medium effect.

Q: η² = .14 in a one-way ANOVA means:
- 14% of the participants improved after the treatment ended
- The p value is .14, so it is not significant
- The effect is small by Cohen's guidelines
- *14% of the DV's variance is linked to group membership
> η² is a proportion of variance; .14 is large by Cohen's labels.

Q: The main purpose of an a priori power analysis is to:
- Compute the p value after the data are in
- *Decide the sample size before collecting data
- Check that the data are normally distributed
- Choose the right post hoc test for the design
> It sets n to give a good chance of detecting a meaningful effect.
:::

## 3.5 Regression, mediation and moderation [core][advanced]
Correlation says how strongly two variables go together. **Regression** uses one or more variables (**predictors**) to **predict** another (the **criterion** or outcome).

### Simple linear regression
The regression line is **Ŷ = a + bX** (predicted Y).
- **b (slope)** = the change in predicted Y for each one-unit increase in X. b = r × (SDy ÷ SDx).
- **a (intercept)** = predicted Y when X = 0. a = My − b × Mx.
- The line is fitted by **least squares**: it makes the sum of squared prediction errors (residuals, Y − Ŷ) as small as possible.
- **Standard error of estimate (SEE)** = the typical size of prediction errors, roughly SDy × √(1 − r²).
- In the standardised form, the slope β equals r.
- **Regression toward the mean:** unless r = ±1, predicted scores are always closer to the mean (in SD units) than the predictor scores.

:::widget worked
{"title": "Predicting marks from study hours", "steps": [{"q": "Use the five Indore students from 2.4: X (hours) 2, 4, 5, 6, 8; Y (marks) 50, 60, 70, 65, 85. We found nΣXY − ΣXΣY = 550 and nΣX² − (ΣX)² = 100. Compute the slope b.", "a": "b = 550 ÷ 100 = 5.5 marks per extra weekly hour."}, {"q": "Compute the intercept a.", "a": "Mx = 5, My = 66. a = 66 − 5.5 × 5 = 66 − 27.5 = 38.5."}, {"q": "Write the equation and predict marks for 7 hours.", "a": "Ŷ = 38.5 + 5.5X. For X = 7: 38.5 + 38.5 = 77."}, {"q": "Check b with the other formula. (SDx = 2.24, SDy = 12.94, r = .95.)", "a": "b = .95 × (12.94 ÷ 2.24) = .95 × 5.78 = 5.5. The same."}, {"q": "Why should you not use this line to predict marks for 20 hours a week?", "a": "That is far outside the data (extrapolation). The relation may flatten, and the equation would predict 148 marks out of 100."}]}
:::

### Multiple regression
Ŷ = a + b1X1 + b2X2 + … Several predictors at once.
- **R²** = proportion of variance in Y explained by all predictors together; **adjusted R²** corrects for the number of predictors.
- **Unstandardised b**: change in Y per unit of a predictor, **holding the others constant**. **Standardised β**: the same in SD units, so predictors measured on different scales can be compared.
- The overall model is tested with **F**; each predictor with **t** = b ÷ SE(b).
- **Multicollinearity:** predictors highly correlated with each other make b weights unstable. Check **tolerance** (below .10 is a problem) or the **variance inflation factor, VIF** (above 10, some say above 5).
- Entry methods: **simultaneous (enter)**; **hierarchical** (blocks entered in an order set by theory, reading ΔR² for each block; for example, demographics first, then stress, then coping); **stepwise** (forward, backward; chosen by the computer, capitalises on chance and is widely criticised).
- Rule of thumb for sample size: at least 50 + 8 × (number of predictors) to test the overall model (a common rule of thumb).
- **Logistic regression** predicts a **dichotomous** outcome (relapse or not); coefficients are reported as **odds ratios**, Exp(B).
- **Discriminant function analysis** predicts group membership from several predictors.

:::widget flow
{"title": "Mediation: X affects Y through M", "layout": "chain", "nodes": [{"id": "n0", "label": "Childhood adversity (X)", "detail": "Predictor"}, {"id": "n1", "label": "Rumination (M)", "detail": "Mediator"}, {"id": "n2", "label": "Depression (Y)", "detail": "Outcome"}], "edgeLabels": {"n0>n1": "path a", "n1>n2": "path b"}, "caption": "Indirect effect = a × b. Test it with a bootstrapped confidence interval."}
:::

### Mediation and moderation
- **Mediation:** X affects M, which affects Y (X → M → Y). Example: childhood adversity raises rumination, which raises depression. Baron and Kenny's classic four steps (X predicts Y; X predicts M; M predicts Y controlling X; the X effect shrinks) are now replaced by testing the **indirect effect (a × b)** directly, with **bootstrapped confidence intervals** (Hayes' PROCESS macro). The **Sobel test** is an older, less powerful option. **Full mediation:** the direct effect disappears; **partial:** it shrinks.
- **Moderation:** the X-Y relation depends on a third variable W. Example: stress predicts depression more strongly in people with low social support. Tested with an **interaction term (X × W)** in regression, after **mean-centring** the predictors, and explored with **simple slopes**.
- Cross-sectional data cannot establish the causal order that mediation implies; longitudinal designs are better.

:::widget sort
{"prompt": "Mediation or moderation?", "buckets": ["Mediation (how or why)", "Moderation (when or for whom)"], "items": [{"text": "Exercise lowers depression because it improves sleep", "bucket": 0}, {"text": "A school anti-bullying programme works for boys but not for girls", "bucket": 1}, {"text": "Discrimination raises distress through lowered self-esteem", "bucket": 0}, {"text": "Job demands predict burnout only when control over work is low", "bucket": 1, "why": "Karasek's demand-control idea is a moderation hypothesis."}, {"text": "Mindfulness reduces anxiety by reducing worry", "bucket": 0}, {"text": "The link between screen time and poor sleep is stronger in teenagers than adults", "bucket": 1}]}
:::

:::recall
1. Write the regression equation and the formulas for b and a. || Ŷ = a + bX; b = r(SDy ÷ SDx); a = My − bMx.
2. Unstandardised b versus standardised β. || b is in the original units; β is in SD units, so predictors can be compared.
3. What are tolerance and VIF used for? || Detecting multicollinearity among predictors.
4. How is mediation now tested? || By estimating the indirect effect a × b with a bootstrapped confidence interval.
5. How is moderation tested in regression? || By adding an interaction term (X × W), usually with centred predictors, then probing simple slopes.
:::

:::mcq
Q: In Ŷ = 20 + 3X, the predicted score for X = 5 is:
- 23
- 60
- 25
- *35
> 20 + 3 × 5 = 35.

Q: In hierarchical regression, the change in R² when a block is added tells you:
- How strongly the predictors in that block overlap
- Whether the intercept is significantly above zero
- *The extra variance explained by that block
- Whether the residuals are normally distributed
> ΔR² is the unique gain from that block.

Q: To predict whether a patient will relapse within a year (yes or no) from several predictors, use:
- *Logistic regression
- Simple linear regression
- MANOVA
- Spearman's rho
> The outcome is dichotomous.
:::

## 3.6 Reliability by the numbers [core][advanced]
**Reliability** is consistency of measurement. In classical test theory, an observed score X = true score T + error E, and **reliability = true-score variance ÷ observed-score variance**. A reliability of .90 means 90% of the score variance is true-score variance. The assessment module covers test construction; here are the calculations exams ask for.

### Types and their coefficients
| Type | How | Coefficient | Error it catches |
|---|---|---|---|
| **Test-retest** | Same test twice, a gap apart | Pearson r (coefficient of stability) | Changes over time |
| **Parallel (alternate) forms** | Two equivalent forms | Pearson r (coefficient of equivalence) | Item sampling |
| **Split-half** | One test split (usually odd-even items), halves correlated | r corrected by **Spearman-Brown** | Item sampling within one sitting |
| **Internal consistency** | Item intercorrelations | **KR-20** (right-wrong items), **KR-21** (equal-difficulty shortcut), **Cronbach's α** (any items) | Item heterogeneity |
| **Inter-rater (scorer)** | Two raters score the same responses | % agreement, **Cohen's κ**, intraclass correlation (ICC) | Rater differences |

### The formulas
- **Spearman-Brown** (full test from a half): r_full = 2r_half ÷ (1 + r_half). General form for a test made k times longer: r_k = kr ÷ [1 + (k − 1)r].
- **KR-20** = [k ÷ (k − 1)] × [1 − (Σpq ÷ σ²)], where p is the proportion passing each item, q = 1 − p, and σ² the total-score variance.
- **KR-21** = [k ÷ (k − 1)] × [1 − M(k − M) ÷ (kσ²)]; assumes all items are equally difficult, so it underestimates when they are not.
- **Cronbach's α** = [k ÷ (k − 1)] × [1 − (Σσ²item ÷ σ²total)].
- **Cohen's κ** = (po − pe) ÷ (1 − pe), where po is observed agreement and pe agreement expected by chance.
- **Standard error of measurement (SEM)** = SD × √(1 − r). It is the SD of the errors around a person's true score, used to build a **confidence band** around an individual's score.

:::widget worked
{"title": "Five reliability calculations", "steps": [{"q": "The odd and even halves of a 40-item attention test correlate .60. What is the reliability of the full test?", "a": "Spearman-Brown: 2(.60) ÷ (1 + .60) = 1.20 ÷ 1.60 = .75."}, {"q": "If the test (reliability .60) were made three times as long with similar items, what would its reliability be?", "a": "r = 3(.60) ÷ [1 + 2(.60)] = 1.80 ÷ 2.20 = .82. Longer tests are more reliable, with diminishing returns."}, {"q": "A 4-item scale has item variances .8, .9, 1.0 and 1.1, and a total-score variance of 9.6. Compute Cronbach's α.", "a": "Σ item variances = 3.8. α = (4 ÷ 3) × (1 − 3.8 ÷ 9.6) = 1.333 × (1 − .396) = 1.333 × .604 = .81."}, {"q": "A 20-item right-wrong test has M = 12 and variance = 16. Estimate KR-21.", "a": "KR-21 = (20 ÷ 19) × [1 − 12 × 8 ÷ (20 × 16)] = 1.053 × (1 − 96 ÷ 320) = 1.053 × .70 = .74."}, {"q": "Two clinicians in Ranchi independently judge 100 patients as depressed or not. Both yes 40; A yes, B no 10; A no, B yes 5; both no 45. Compute κ.", "a": "po = (40 + 45) ÷ 100 = .85. A said yes to 50, B to 45; A said no to 50, B to 55. pe = (50 × 45 + 50 × 55) ÷ 100² = (2,250 + 2,750) ÷ 10,000 = .50. κ = (.85 − .50) ÷ (1 − .50) = .70: substantial agreement (Landis and Koch: .61 to .80)."}, {"q": "An IQ test has SD = 15 and reliability .91. Find the SEM and the 95% band for an obtained IQ of 100.", "a": "SEM = 15 × √(1 − .91) = 15 × .30 = 4.5. 95% band = 100 ± 1.96 × 4.5 = 100 ± 8.8, so about 91 to 109. Report a band, not a single number, especially near cut-offs such as 70."}]}
:::

### Factors that affect reliability
- **Test length** (more items, higher reliability: Spearman-Brown).
- **Group heterogeneity** (a wider range of ability gives higher reliability; a restricted group lowers it).
- **Item difficulty** (items that everyone passes or fails add nothing).
- **Speed:** split-half and internal consistency are spuriously high for **speed tests**; use test-retest or parallel forms.
- **Test-retest interval:** too short invites memory; too long allows real change.
- **Objectivity of scoring.**

Rough guides: .70 is acceptable for research, .80 good, and **.90 or more** needed for decisions about individuals. A very high α (above .95) may mean items are redundant. Remember that α is **not** a measure of unidimensionality.

:::recall
1. Write the Spearman-Brown formula for doubling a test. || r_full = 2r_half ÷ (1 + r_half).
2. Which internal-consistency formula is for right-wrong items, and which for any items? || KR-20 for dichotomous items; Cronbach's alpha for any items.
3. Give the formula for the SEM. || SEM = SD × √(1 − r).
4. Why are split-half coefficients misleading for speed tests? || Most people get every attempted item right, so odd and even halves match artificially.
5. What does kappa correct that percentage agreement does not? || Agreement expected by chance.
:::

:::mcq
Q: A half-test reliability of .50 corrected by Spearman-Brown gives:
- .50
- .25
- 1.0
- *.67
> 2(.5) ÷ (1 + .5) = 1 ÷ 1.5 = .67.

Q: A test has SD = 10 and reliability .84. The SEM is:
- 1.6
- 8.4
- 16
- *4
> 10 × √.16 = 10 × .4 = 4.

Q: Restricting a test's norm group to only high scorers will usually make the reliability coefficient:
- Higher
- *Lower
- Unchanged
- Negative
> Less true-score variance means a lower coefficient.
:::

## 3.7 Factor analysis and structural equation modelling [core][advanced]
**Factor analysis** finds a small number of underlying **factors** (latent variables) that explain the correlations among many observed variables. It is how scales are built and how theories of intelligence (Spearman's g, Thurstone's primary mental abilities) and personality (the Big Five) were developed.

### Exploratory factor analysis (EFA)
Used when you **do not** yet know how many factors there are.
1. **Check the data are suitable:** an adequate sample (rules of thumb: at least 5 to 10 people per item, or 200 or more); the **Kaiser-Meyer-Olkin (KMO)** measure of sampling adequacy at least .60 (Kaiser called .90 or above "marvellous"); **Bartlett's test of sphericity** should be **significant** (the correlation matrix is not an identity matrix).
2. **Extract** factors: principal axis factoring or maximum likelihood (true factor analysis, modelling **common** variance). **Principal components analysis (PCA)** analyses **total** variance and is strictly a data-reduction method, not a model of latent variables, though people often treat it as one.
3. **Decide how many factors:** **Kaiser's criterion** (eigenvalue above 1; tends to keep too many), Cattell's **scree test** (keep factors before the elbow), and **parallel analysis** (Horn; keep factors whose eigenvalues beat those from random data; the most accurate).
4. **Rotate** to reach Thurstone's **simple structure** (each item loads highly on one factor and near zero on the others): **orthogonal** rotation keeps factors uncorrelated (**varimax**, the most common; quartimax; equamax); **oblique** rotation lets them correlate (**direct oblimin**, **promax**), which is usually more realistic in psychology.
5. **Interpret and name** the factors from the items that load on them (loadings of about .30 or .40 and above are usually counted).

:::widget flow
{"title": "Running an exploratory factor analysis", "layout": "chain", "nodes": [{"id": "n0", "label": "Check suitability", "detail": "Sample size, KMO at least .60, Bartlett significant"}, {"id": "n1", "label": "Extract", "detail": "Principal axis or maximum likelihood"}, {"id": "n2", "label": "Decide how many", "detail": "Parallel analysis and scree plot"}, {"id": "n3", "label": "Rotate", "detail": "Oblique (oblimin, promax) or orthogonal (varimax)"}, {"id": "n4", "label": "Interpret and name", "detail": "Items loading about .40 or more"}, {"id": "n5", "label": "Confirm", "detail": "CFA in a new sample"}]}
:::

### The key terms
- **Factor loading:** the correlation between an item and a factor (in orthogonal solutions).
- **Communality (h²):** the proportion of an item's variance explained by all the factors together: the sum of its squared loadings across factors. **Uniqueness** = 1 − h².
- **Eigenvalue:** the amount of variance (across all items) explained by a factor: the sum of its squared loadings down the column. Divided by the number of items, it gives the **percentage of variance explained**.

:::widget worked
{"title": "Eigenvalues and communalities from a loading matrix", "steps": [{"q": "A 4-item scale on exam stress gives these rotated loadings. Item 1 (worry about marks): F1 .80, F2 .10. Item 2 (fear of failing): F1 .75, F2 .20. Item 3 (headaches): F1 .15, F2 .70. Item 4 (poor sleep): F1 .05, F2 .85. Name the factors.", "a": "Items 1 and 2 load on F1: a cognitive 'worry' factor. Items 3 and 4 load on F2: a 'bodily symptoms' factor. Simple structure is achieved."}, {"q": "Compute the communality of item 1 and of item 4.", "a": "Item 1: .80² + .10² = .64 + .01 = .65. Item 4: .05² + .85² = .0025 + .7225 = .73. The two factors explain 65% and 73% of these items' variance."}, {"q": "Compute the eigenvalue of F1.", "a": ".80² + .75² + .15² + .05² = .64 + .5625 + .0225 + .0025 = 1.23."}, {"q": "What percentage of the total variance does F1 explain?", "a": "With 4 items, total variance = 4. 1.23 ÷ 4 = 31%. (F2: .01 + .04 + .49 + .7225 = 1.26, so 32%. Together about 63%.)"}]}
:::

### Confirmatory factor analysis (CFA) and SEM
- **CFA** tests a factor structure stated **in advance** (for example, that a Hindi translation of a depression scale has the same two factors as the original). You specify which items load on which factor, then test how well the model fits.
- **Fit indices** (widely used guides from Hu and Bentler's simulation work): **χ²** (should be non-significant, but is almost always significant in large samples); **CFI** and **TLI** about .95 or higher; **RMSEA** about .06 or lower (up to .08 acceptable); **SRMR** about .08 or lower.
- **Measurement invariance** testing (configural, metric, scalar) asks whether a scale measures the same thing in different groups: men and women, Hindi and Tamil versions. Without it, group comparisons on the scale can mislead.
- **Structural equation modelling (SEM)** combines a **measurement model** (CFA: latent variables measured by items) with a **structural model** (paths between latent variables, like a regression among them). **Path analysis** is SEM with observed variables only. SEM is used to test mediation models, theories with several outcomes, and longitudinal models. It needs large samples (often 200 or more) and should be driven by theory, not by chasing modification indices.

:::widget compare
{"title": "Exploratory or confirmatory factor analysis?", "a": {"label": "Exploratory (EFA)", "points": ["No structure assumed in advance", "Every item may load on every factor", "Decide the number of factors from eigenvalues and the scree plot", "Used when building a new scale"], "summary": "EFA asks: what structure is in these data?"}, "b": {"label": "Confirmatory (CFA)", "points": ["The structure is stated in advance", "Each item is set to load on chosen factors only", "Judged by fit indices such as CFI and RMSEA", "Used to test a translated or adapted scale"], "summary": "CFA asks: does this structure fit? Good practice is EFA in one sample and CFA in a fresh one."}}
:::

:::recall
1. EFA versus CFA. || EFA explores how many factors and which items load where; CFA tests a structure specified in advance.
2. What are communality and eigenvalue? || Communality: variance of one item explained by all factors (row sum of squared loadings). Eigenvalue: variance explained by one factor across items (column sum of squared loadings).
3. Name three ways to decide the number of factors. Which is most accurate? || Kaiser's eigenvalue-above-1 rule, the scree test and parallel analysis; parallel analysis.
4. Orthogonal versus oblique rotation, with an example of each. || Orthogonal keeps factors uncorrelated (varimax); oblique allows correlation (oblimin, promax).
5. What KMO and Bartlett results show the data suit factor analysis? || KMO at least .60 and a significant Bartlett's test.
6. Give the usual cut-offs for CFI, RMSEA and SRMR. || CFI about .95 or more; RMSEA about .06 or less; SRMR about .08 or less.
:::

:::mcq
Q: An item has loadings of .60 and .30 on two orthogonal factors. Its communality is:
- .90
- .36
- *.45
- .09
> .36 + .09 = .45.

Q: The rotation that allows factors to correlate is:
- *Promax
- Varimax
- Quartimax
- Equamax
> Promax and direct oblimin are oblique rotations.

Q: A researcher wants to test whether a Marathi version of a scale has the same three-factor structure as the English original. The right method is:
- PCA
- EFA with varimax rotation
- *Confirmatory factor analysis
- Multiple regression on the items
> The structure is specified in advance and tested.
:::

## 3.8 Reading SPSS-style output and choosing the right test [core][advanced]
Exams and theses increasingly show a software output table and ask what it means. The trick is to know where to look.

### An independent-samples t-test
Group statistics: Yoga (n = 30) M = 32.40, SD = 5.80; Control (n = 30) M = 36.60, SD = 5.60.

| | Levene's F | Levene's Sig. | t | df | Sig. (2-tailed) | Mean difference | 95% CI lower | 95% CI upper |
|---|---|---|---|---|---|---|---|---|
| Equal variances assumed | 0.42 | .520 | −2.85 | 58 | .006 | −4.20 | −7.15 | −1.25 |
| Equal variances not assumed | | | −2.85 | 57.93 | .006 | −4.20 | −7.15 | −1.25 |

:::widget worked
{"title": "Reading the t-test output", "steps": [{"q": "Which row do you read?", "a": "Levene's Sig. = .520, which is not significant, so the variances can be treated as equal: read the first row."}, {"q": "Is the difference significant?", "a": "Sig. (2-tailed) = .006, below .05: yes. The yoga group's anxiety was 4.2 points lower."}, {"q": "What does the CI tell you that p does not?", "a": "The true difference is plausibly between 1.25 and 7.15 points. It excludes zero (so significant) and shows the effect could be small or quite large."}, {"q": "Compute d and write the APA sentence.", "a": "Pooled SD about 5.70; d = 4.20 ÷ 5.70 = 0.74. 'The yoga group (M = 32.40, SD = 5.80) reported less anxiety than the control group (M = 36.60, SD = 5.60), t(58) = −2.85, p = .006, d = 0.74, 95% CI of the difference [−7.15, −1.25].'"}]}
:::

### A one-way ANOVA
| Source | Sum of squares | df | Mean square | F | Sig. |
|---|---|---|---|---|---|
| Between groups | 50.667 | 2 | 25.333 | 38.000 | .000 |
| Within groups | 6.000 | 9 | .667 | | |
| Total | 56.667 | 11 | | | |

SPSS prints "Sig. = .000", which means p is below .0005. **Never report p = .000**; write **p < .001**. Follow with the post hoc table (Tukey), which lists each pair, the mean difference and its Sig.

### A multiple regression
Model summary: R = .46, R² = .21, adjusted R² = .20. ANOVA for the model: F(2, 117) = 15.55, Sig. = .000.

| Predictor | B | Std. error | Beta | t | Sig. | VIF |
|---|---|---|---|---|---|---|
| (Constant) | 48.20 | 3.20 | | 15.06 | .000 | |
| Sleep hours | −2.40 | 0.55 | −.41 | −4.36 | .000 | 1.12 |
| Study hours | −0.35 | 0.30 | −.11 | −1.17 | .247 | 1.12 |

:::widget worked
{"title": "Reading the regression output", "steps": [{"q": "How much of the variance in exam anxiety do the two predictors explain together, and is the model significant?", "a": "R² = .21, so 21%. The model F(2, 117) = 15.55 is significant (p below .001)."}, {"q": "Interpret the B for sleep hours.", "a": "Each extra hour of sleep predicts 2.40 points less anxiety, holding study hours constant. t = B ÷ SE = −2.40 ÷ 0.55 = −4.36, significant."}, {"q": "Which predictor matters more, and how do you know?", "a": "Sleep: its standardised Beta (−.41) is much larger than study hours' (−.11), and study hours are not significant (p = .247)."}, {"q": "Is multicollinearity a problem?", "a": "No. VIF = 1.12, far below 5 or 10."}, {"q": "Write the equation.", "a": "Predicted anxiety = 48.20 − 2.40 × sleep − 0.35 × study."}]}
:::

### A correlation matrix
Each cell shows r, its Sig. (2-tailed) and N. The matrix is symmetrical; the diagonal is 1. Look for the pattern, and remember that with many variables some correlations will be "significant" by chance alone (with 20 variables there are 190 correlations, so about 9 or 10 false positives at .05).

:::widget flow
{"title": "Choosing the right test", "layout": "tree", "nodes": [{"id": "q", "label": "What is your aim?", "detail": "Start here"}, {"id": "diff", "label": "Compare groups or conditions", "detail": "", "parent": "q"}, {"id": "rel", "label": "Relate variables", "detail": "", "parent": "q"}, {"id": "cnt", "label": "Counts in categories", "detail": "", "parent": "q"}, {"id": "two", "label": "Two groups", "detail": "", "parent": "diff"}, {"id": "many", "label": "Three or more", "detail": "", "parent": "diff"}, {"id": "ti", "label": "Independent, interval: independent t", "detail": "Ordinal: Mann-Whitney U", "parent": "two"}, {"id": "tp", "label": "Related, interval: paired t", "detail": "Ordinal: Wilcoxon signed-rank", "parent": "two"}, {"id": "ai", "label": "Independent, interval: one-way ANOVA", "detail": "Ordinal: Kruskal-Wallis", "parent": "many"}, {"id": "ar", "label": "Related, interval: repeated-measures ANOVA", "detail": "Ordinal: Friedman", "parent": "many"}, {"id": "pr", "label": "Interval: Pearson r, regression", "detail": "Ordinal: Spearman, Kendall", "parent": "rel"}, {"id": "lg", "label": "Dichotomous outcome: logistic regression", "detail": "", "parent": "rel"}, {"id": "cs", "label": "Chi-square", "detail": "Fisher's exact if small; McNemar if related", "parent": "cnt"}], "caption": "Tap each box. The detail line gives the non-parametric partner."}
:::

### Choosing the right test
Ask four questions: **What is the DV's level of measurement? How many groups or variables? Are the groups independent or related? Are parametric assumptions met?**

| Aim | Independent groups | Related (same or matched people) |
|---|---|---|
| Compare 2 groups, interval data | Independent t | Paired t |
| Compare 2 groups, ordinal or non-normal | Mann-Whitney U | Wilcoxon signed-rank (sign test) |
| Compare 3 or more groups, interval | One-way ANOVA | Repeated-measures ANOVA |
| Compare 3 or more groups, ordinal | Kruskal-Wallis | Friedman |
| Two or more IVs | Factorial ANOVA | Repeated-measures or mixed ANOVA |
| Nominal frequencies | Chi-square (Fisher's exact if small) | McNemar (2 times), Cochran's Q (3 or more) |
| Relation, interval | Pearson r; regression | Not applicable |
| Relation, ordinal | Spearman ρ, Kendall τ | Not applicable |
| Predict a dichotomous outcome | Logistic regression | Not applicable |
| Many items, find structure | EFA (explore), CFA (confirm) | Not applicable |

:::widget sort
{"prompt": "Choose the test for each study.", "buckets": ["t-test (independent or paired)", "ANOVA family", "Chi-square family", "Non-parametric rank test"], "items": [{"text": "Mean empathy scores of male and female nursing students", "bucket": 0}, {"text": "Whether smokers and non-smokers differ in the proportion who relapse to depression", "bucket": 2}, {"text": "Ranks given to five ward climates by the same 12 nurses", "bucket": 3, "why": "Related ranks across several conditions: Friedman."}, {"text": "Reaction time under three doses of caffeine, in three separate groups", "bucket": 1}, {"text": "Pain ratings (ordinal 1 to 5) before and after a procedure in 15 patients", "bucket": 3, "why": "Related, ordinal: Wilcoxon signed-rank."}, {"text": "Depression scores of the same patients before and after 12 sessions", "bucket": 0, "why": "Interval, two related measures: paired t."}, {"text": "Whether the same students pass or fail before and after a coaching course", "bucket": 2, "why": "Related dichotomous data: McNemar."}, {"text": "Anxiety by gender × type of college", "bucket": 1}]}
:::

:::recall
1. In SPSS t-test output, how do you choose which row to read? || By Levene's test: if not significant, read 'equal variances assumed'; if significant, read 'not assumed'.
2. How do you report Sig. = .000? || As p < .001, never p = .000.
3. In a regression table, which column shows the relative importance of predictors? || The standardised Beta column.
4. Name the four questions for choosing a test. || Level of measurement of the DV; number of groups or variables; independent or related; parametric assumptions met?
:::

:::mcq
Q: In an SPSS t-test, Levene's Sig. = .01. You should:
- Read the 'equal variances assumed' row only
- Use chi-square instead
- Ignore Levene's test
- *Read the 'equal variances not assumed' row
> Variances differ significantly.

Q: In a regression output, B = 0.80, SE = 0.20. The t value is:
- 0.16
- 1.0
- 0.25
- *4.0
> t = B ÷ SE.

Q: A study compares the proportion of men and women who prefer online therapy. The test is:
- Independent-samples t-test
- Pearson r
- Paired-samples t-test of the two sexes
- *Chi-square test of independence
> Two nominal variables, frequencies.
:::
`;
