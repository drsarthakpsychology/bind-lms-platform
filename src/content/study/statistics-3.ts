/* Module · statistics, Part IV (exam zone: Q&A bank, long answers and module test). Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part IV · Exam zone

## 4.1 Q&A bank · Starting [core][starting]
Work each one on paper with a calculator before you open the answer.

:::qa For the scores 6, 8, 10, 10, 16, compute the mean, median, mode, range, sample variance and sample SD. Which average best represents the data? [starting]
### Step 1: order and count
6, 8, 10, 10, 16; n = 5; ΣX = 50.

### Step 2: the three averages
- Mean = 50 ÷ 5 = **10**
- Median = the 3rd score = **10**
- Mode = **10** (it occurs twice)

### Step 3: range
16 − 6 = **10**

### Step 4: variance and SD
| X | X − M | (X − M)² |
|---|---|---|
| 6 | −4 | 16 |
| 8 | −2 | 4 |
| 10 | 0 | 0 |
| 10 | 0 | 0 |
| 16 | 6 | 36 |
| Total | 0 | **SS = 56** |

- Sample variance s² = 56 ÷ (5 − 1) = **14**
- Sample SD s = √14 = **3.74**

### Step 5: interpret
All three averages agree (10), so any would do; the mean is preferred because it uses every score and leads to further statistics. Note how the single score of 16 contributes 36 of the 56 units of SS: squared deviations give extreme scores a lot of weight.
:::

:::qa Compute the mean and SD of the grouped empathy table (from 1.2) by the short (assumed-mean, step-deviation) method. [starting]
### The idea
Instead of multiplying large midpoints, pick a convenient **assumed mean (AM)**, code each class by how many class widths it is from AM (d′), and correct at the end.

### Step 1: set up
AM = 34.5 (midpoint of 30-39), i = 10.

| Class | f | d′ | fd′ | fd′² |
|---|---|---|---|---|
| 50-59 | 5 | +2 | 10 | 20 |
| 40-49 | 8 | +1 | 8 | 8 |
| 30-39 | 12 | 0 | 0 | 0 |
| 20-29 | 7 | −1 | −7 | 7 |
| 10-19 | 3 | −2 | −6 | 12 |
| Total | 35 | | **5** | **47** |

### Step 2: the mean
M = AM + (Σfd′ ÷ N) × i = 34.5 + (5 ÷ 35) × 10 = 34.5 + 1.43 = **35.93**, the same as the long method.

### Step 3: the SD
SD = i × √[Σfd′² ÷ N − (Σfd′ ÷ N)²]
= 10 × √[47 ÷ 35 − (5 ÷ 35)²]
= 10 × √[1.3429 − 0.0204]
= 10 × √1.3225 = 10 × 1.150 = **11.50**

### Why examiners like this method
It reduces arithmetic errors and is the standard method in older Indian statistics texts and in university papers. Note this gives the descriptive (divide by N) SD.
:::

:::qa Show with numbers why adding a constant leaves the SD unchanged, but multiplying by a constant does not. [starting]
### Start
Scores 2, 4, 6: M = 4; deviations −2, 0, 2; SS = 8; population SD = √(8 ÷ 3) = 1.63.

### Add 10 to every score: 12, 14, 16
- M = 14 (the mean moves up by 10)
- Deviations: −2, 0, 2 (unchanged)
- SD = **1.63** (unchanged)

### Multiply every score by 3: 6, 12, 18
- M = 12 (three times the old mean)
- Deviations: −6, 0, 6 (three times larger)
- SS = 72; SD = √(72 ÷ 3) = **4.90** = 3 × 1.63
- Variance = 24 = 9 × 2.67 (multiplied by 3²)

### The rule
| Change to every score | Mean | SD | Variance |
|---|---|---|---|
| Add or subtract c | ± c | Same | Same |
| Multiply or divide by c | × or ÷ c | × or ÷ c | × or ÷ c² |

### Why it matters
This is exactly how standard scores work: z subtracts the mean (centres) and divides by the SD (rescales); T then multiplies by 10 and adds 50. The **shape** of the distribution and every person's relative position stay the same.
:::

:::qa Why is the median often better than the mean for income or symptom-count data? Demonstrate. [starting]
### Example
Monthly incomes (₹ thousand) of five households in a village: 10, 12, 13, 15, 100.
- Mean = 150 ÷ 5 = **30**
- Median = **13**

### What happened
One household earns far more. The mean (30) is higher than four of the five incomes, so it represents nobody. The median (13) sits at the centre of the typical households.

### General rule
| Feature of data | Better average |
|---|---|
| Symmetrical, interval or ratio | Mean |
| Skewed (income, reaction times, number of panic attacks, length of hospital stay) | Median |
| Open-ended classes ("₹1 lakh and above") | Median |
| Nominal categories | Mode |

### Exam phrasing
"The mean is sensitive to extreme scores because every score enters its calculation; the median depends only on the order of scores, so it is resistant." Report both when they differ, with the interquartile range for spread.
:::

:::qa Are Likert-scale totals interval data? Should you use parametric tests on them? [starting]
### Two positions
| View | Argument |
|---|---|
| Strict (Stevens' tradition) | A single item (strongly disagree to strongly agree) is ordinal: the gap between 'agree' and 'strongly agree' may not equal the gap between 'neutral' and 'agree'. Use medians and non-parametric tests |
| Practical (most researchers) | A **total** of many items behaves much like an interval measure; simulations show t-tests and ANOVA are robust here, especially with reasonable samples |

### A sensible rule
1. **Single items:** treat as ordinal; report frequencies or medians; use Mann-Whitney or Wilcoxon if testing.
2. **Multi-item scale totals** with good internal consistency: treat as approximately interval; use means, SDs and parametric tests, after checking the distribution.
3. When results matter and data are odd (strong skew, floor or ceiling effects), run both and report whether conclusions agree.

### Viva tip
Say "ordinal at the item level, treated as interval at the scale level", and give the reason (summation and robustness), not just the rule.
:::

## 4.2 Q&A bank · Beginner [core][beginner]

:::qa On an IQ test (mean 100, SD 15), what percentage of people score between 90 and 120? Show the z and area working. [beginner]
### Step 1: convert both scores to z
- 90: z = (90 − 100) ÷ 15 = **−0.67**
- 120: z = (120 − 100) ÷ 15 = **+1.33**

### Step 2: read the table (area from the mean to z)
- z = 0.67: area = .2486
- z = 1.33: area = .4082

### Step 3: combine
The two scores are on **opposite sides** of the mean, so **add**: .2486 + .4082 = .6568, about **65.7%**.

### Step 4: check by percentiles
- 90 is at about the 25th percentile (50 − 24.9)
- 120 is at about the 91st percentile (50 + 40.8)
- 91 − 25 = about 66%

### Same side of the mean?
For 115 to 130: z = 1.00 (area .3413) and z = 2.00 (area .4772). **Subtract**: .4772 − .3413 = .1359, about 13.6%.
:::

:::qa A sample of 36 students on a stress-management course has a mean resilience score of 105. The population mean is 100 with SD 15. Is the course group different? Test at .05 and .01. [beginner]
### Step 1: hypotheses
- H0: μ = 100
- H1: μ is not 100 (two-tailed)

### Step 2: standard error
SE = σ ÷ √n = 15 ÷ √36 = 15 ÷ 6 = **2.5**

### Step 3: test statistic
z = (M − μ) ÷ SE = (105 − 100) ÷ 2.5 = **2.00**

### Step 4: decide
| α | Two-tailed critical z | Decision |
|---|---|---|
| .05 | 1.96 | 2.00 is beyond 1.96: **reject H0** |
| .01 | 2.58 | 2.00 is short of 2.58: **fail to reject H0** |

Exact two-tailed p = .046.

### Step 5: interpret honestly
The group's mean is significantly above the population mean at .05 but not at .01. Effect size d = (105 − 100) ÷ 15 = 0.33, a small-to-medium effect. With no control group, the course is not shown to have **caused** the difference: the students may have been more resilient to begin with (selection).
:::

:::qa In the previous problem, suppose the true effect is exactly 5 points. What is the power of the test, and how many students would give 80% power? [beginner]
### Step 1: find the critical mean under H0
Two-tailed α = .05, so reject if M is above 100 + 1.96 × 2.5 = **104.9** (or below 95.1).

### Step 2: power is the chance of passing that line if the true mean is 105
z = (104.9 − 105) ÷ 2.5 = **−0.04**. The area above z = −0.04 is about .516. (The chance of falling below 95.1 is negligible.)

**Power is about 52%**: nearly a coin toss. β (Type II risk) is about 48%.

### Step 3: sample size for 80% power
n = [(z for α/2 + z for power) × σ ÷ difference]²
= [(1.96 + 0.84) × 15 ÷ 5]²
= (2.80 × 3)² = 8.4² = **70.6**, so **71 students**.

### What this teaches
| Change | Effect on power |
|---|---|
| n from 36 to 71 | 52% to 80% |
| Larger true effect | Higher |
| α from .05 to .01 | Lower |
| Smaller σ (more reliable measure, more homogeneous sample) | Higher |
:::

:::qa Compute Pearson's r and Spearman's rho for X = 1, 2, 3, 4, 5 and Y = 2, 4, 6, 8, 30. Why do they differ? [beginner]
### Pearson's r
| Sums | Value |
|---|---|
| ΣX | 15 |
| ΣY | 50 |
| ΣXY | 2 + 8 + 18 + 32 + 150 = 210 |
| ΣX² | 55 |
| ΣY² | 4 + 16 + 36 + 64 + 900 = 1,020 |

1. Numerator: 5 × 210 − 15 × 50 = 1,050 − 750 = 300
2. nΣX² − (ΣX)² = 275 − 225 = 50
3. nΣY² − (ΣY)² = 5,100 − 2,500 = 2,600
4. r = 300 ÷ √(50 × 2,600) = 300 ÷ √130,000 = 300 ÷ 360.6 = **.83**

### Spearman's rho
Ranks of X: 1, 2, 3, 4, 5. Ranks of Y: 1, 2, 3, 4, 5. Every d = 0, so Σd² = 0 and ρ = 1 − 0 = **1.00**.

### Why they differ
- The relation is **perfectly monotonic** (Y always rises with X), so rho is perfect.
- It is **not perfectly linear**: the last point (5, 30) is far off the straight line through the others, and Pearson's r measures fit to a straight line.
- The outlier both inflates the variance of Y and bends the line.

### Lesson
Always plot the data. If the relation is monotonic but curved, or has outliers, report Spearman's rho (or transform), and say why.
:::

:::qa Urban and rural patients (50 each) choose among medication only, therapy only, or both. Urban: 20, 15, 15. Rural: 10, 25, 15. Is treatment preference related to area? [beginner]
### Step 1: totals
| | Medication | Therapy | Both | Total |
|---|---|---|---|---|
| Urban | 20 | 15 | 15 | 50 |
| Rural | 10 | 25 | 15 | 50 |
| Total | 30 | 40 | 30 | 100 |

### Step 2: expected frequencies (row × column ÷ N)
- Medication: 50 × 30 ÷ 100 = 15 for each row
- Therapy: 50 × 40 ÷ 100 = 20
- Both: 50 × 30 ÷ 100 = 15

### Step 3: chi-square, cell by cell
| Cell | O | E | (O − E)² ÷ E |
|---|---|---|---|
| Urban, medication | 20 | 15 | 25 ÷ 15 = 1.667 |
| Urban, therapy | 15 | 20 | 25 ÷ 20 = 1.250 |
| Urban, both | 15 | 15 | 0 |
| Rural, medication | 10 | 15 | 1.667 |
| Rural, therapy | 25 | 20 | 1.250 |
| Rural, both | 15 | 15 | 0 |
| Total | | | **χ² = 5.83** |

### Step 4: decide
df = (2 − 1)(3 − 1) = 2. Critical χ² at .05 = 5.99. 5.83 is just below it: **not significant** (p = .054).

### Step 5: interpret
There is a trend (urban patients choosing medication more, rural patients therapy more), but the evidence is not strong enough at .05 with 100 people. Cramér's V = √(5.83 ÷ 100) = .24 suggests a small-to-moderate association that a larger study might confirm. Do not report this as "no difference".
:::

:::qa Analyse the six clients' before and after anxiety scores (from 2.5) wrongly with an independent t-test, and compare with the paired t. What does this show? [beginner]
### The data
Before: 20, 18, 25, 22, 17, 24 (M = 21, s² = 10.4). After: 15, 16, 19, 20, 14, 18 (M = 17, s² = 5.6).

### The wrong analysis: independent t
1. Pooled variance = (10.4 + 5.6) ÷ 2 = 8.0 (equal n)
2. SE = √[8.0 × (1/6 + 1/6)] = √2.667 = 1.633
3. t = (21 − 17) ÷ 1.633 = **2.45**, df = 10, p = .034

### The right analysis: paired t (from 2.5)
t = **5.16**, df = 5, p = .004

### Why the paired test is so much larger
- Clients differ a lot from each other (some anxious, some calm), and that **between-person variation** sits in the error term of the independent test.
- The paired test works on each person's **change**, so those stable differences cancel out. The SD of the differences (1.90) is much smaller than the SDs of the raw scores (3.2 and 2.4).

### Conclusion
Using the wrong test does not just break an assumption (independence); it throws away power. Here both happen to be significant, but in smaller effects the independent test would often miss a real change.
:::

## 4.3 Q&A bank · Advanced [core][advanced]

:::qa Compute a full two-way ANOVA. Feedback (A1 none, A2 praise) is crossed with Task (B1 easy, B2 hard), with three students per cell. Scores: A1B1 4, 5, 6; A1B2 6, 7, 8; A2B1 5, 6, 7; A2B2 10, 11, 12. [advanced]
### Step 1: means
| | B1 easy | B2 hard | Row mean |
|---|---|---|---|
| A1 none | 5 | 7 | 6.0 |
| A2 praise | 6 | 11 | 8.5 |
| Column mean | 5.5 | 9.0 | Grand mean 7.25 |

### Step 2: SS total
Σ(X − 7.25)² across all 12 scores = **70.25**

### Step 3: SS for A (feedback)
Each row mean is based on 6 scores: 6 × [(6.0 − 7.25)² + (8.5 − 7.25)²] = 6 × (1.5625 + 1.5625) = **18.75**

### Step 4: SS for B (task)
6 × [(5.5 − 7.25)² + (9.0 − 7.25)²] = 6 × (3.0625 + 3.0625) = **36.75**

### Step 5: SS for the interaction
SS cells = 3 × [(5 − 7.25)² + (7 − 7.25)² + (6 − 7.25)² + (11 − 7.25)²] = 3 × (5.0625 + 0.0625 + 1.5625 + 14.0625) = 3 × 20.75 = 62.25
SS A × B = SS cells − SS A − SS B = 62.25 − 18.75 − 36.75 = **6.75**

### Step 6: SS within
Each cell's scores deviate from its mean by −1, 0, 1: SS = 2 per cell, 4 cells: **8.00**. Check: 18.75 + 36.75 + 6.75 + 8.00 = 70.25.

### Step 7: the summary table
| Source | SS | df | MS | F |
|---|---|---|---|---|
| Feedback (A) | 18.75 | 1 | 18.75 | 18.75 |
| Task (B) | 36.75 | 1 | 36.75 | 36.75 |
| A × B | 6.75 | 1 | 6.75 | 6.75 |
| Within | 8.00 | 8 | 1.00 | |
| Total | 70.25 | 11 | | |

Critical F(1, 8) at .05 = 5.32. **All three effects are significant.**

### Step 8: interpret
- The interaction comes first: praise adds 1 point on easy tasks (6 versus 5) but 4 points on hard tasks (11 versus 7).
- Partial η² for the interaction = 6.75 ÷ (6.75 + 8) = .46.
- So "praise helps" is true, but mainly for hard tasks: the main effect of feedback is an average of two quite different simple effects.
:::

:::qa A researcher finds that childhood adversity predicts depression through rumination. Path a (adversity to rumination) = 0.40, SE 0.08; path b (rumination to depression, controlling adversity) = 0.50, SE 0.10. Test the indirect effect. [advanced]
### Step 1: the indirect effect
ab = 0.40 × 0.50 = **0.20**: for each unit of adversity, depression rises by 0.20 units through rumination.

### Step 2: the Sobel test (the older method)
SE(ab) = √(b² × SEa² + a² × SEb²)
= √(0.25 × 0.0064 + 0.16 × 0.01)
= √(0.0016 + 0.0016) = √0.0032 = **0.0566**

z = 0.20 ÷ 0.0566 = **3.54**, p below .001.

### Step 3: the modern method
The sampling distribution of ab is usually **skewed**, so the Sobel test's normal assumption is poor. Instead, **bootstrap**: resample the data thousands of times, compute ab each time, and take the middle 95% as the confidence interval. If the interval excludes zero, the indirect effect is significant.

### Step 4: full or partial mediation?
Compare the total effect (c) with the direct effect (c′). If c′ is still significant, mediation is partial. Modern writers prefer to report the size of the indirect effect and its interval rather than the full/partial label.

### Step 5: the limit
With cross-sectional data, mediation is a **statistical** pattern. It cannot prove that adversity came first, rumination second and depression third. Longitudinal data, measuring each variable at a later time point, make the causal story much more credible.
:::

:::qa Two predictors correlate with exam anxiety: sleep problems r = .50, perfectionism r = .40, and with each other r = .30. Compute the standardised betas and R². [advanced]
### The formulas for two predictors
- β1 = (r_y1 − r_y2 × r_12) ÷ (1 − r_12²)
- β2 = (r_y2 − r_y1 × r_12) ÷ (1 − r_12²)
- R² = β1 × r_y1 + β2 × r_y2

### Step 1: the denominator
1 − .30² = 1 − .09 = .91

### Step 2: the betas
- Sleep: β1 = (.50 − .40 × .30) ÷ .91 = (.50 − .12) ÷ .91 = **.42**
- Perfectionism: β2 = (.40 − .50 × .30) ÷ .91 = (.40 − .15) ÷ .91 = **.27**

### Step 3: R²
R² = .42 × .50 + .27 × .40 = .209 + .110 = **.32**

### Step 4: interpret
- Together the predictors explain 32% of the variance in anxiety.
- That is less than .25 + .16 = .41, the sum of their separate r² values, because the predictors **overlap** (r = .30): part of what each explains is shared.
- Each beta is smaller than its simple r for the same reason. If the predictors correlated .90, the betas would become unstable: that is **multicollinearity**.
:::

:::qa A new anxiety scale correlates .40 with a job-performance rating. The scale's reliability is .80 and the rating's is .70. What would the correlation be if both were perfectly reliable? And how much longer must a test with α = .70 be to reach .85? [advanced]
### Part 1: correction for attenuation
r_true = r_xy ÷ √(r_xx × r_yy) = .40 ÷ √(.80 × .70) = .40 ÷ √.56 = .40 ÷ .748 = **.53**

So measurement error has hidden part of the real relation. This is why unreliable measures **attenuate** correlations and reduce power. (Use the corrected value to think about theory, not to claim the prediction you can actually make.)

### Part 2: how much longer for α = .85?
Rearranged Spearman-Brown: k = r_new × (1 − r_old) ÷ [r_old × (1 − r_new)]
= .85 × .30 ÷ (.70 × .15) = .255 ÷ .105 = **2.43**

A 10-item scale would need about 24 items of similar quality.

### Practical judgement
| Option | Cost | Benefit |
|---|---|---|
| Add items | Longer, more fatigue | Higher reliability |
| Improve items (clearer, better translated) | Development time | Higher reliability without extra length |
| Accept .70 | None | Fine for group research, not for decisions about individuals |
:::

:::qa An SPSS two-way ANOVA table reports SS effect = 24, SS error = 96, total SS = 200, with 3 groups for the effect and N = 60. Compute η², partial η² and ω² for the effect, and explain the difference. [advanced]
### The numbers you need
- df effect = 3 − 1 = 2
- Assume the error df = 54 (60 minus 6 cells in a 3 × 2 design), so MS error = 96 ÷ 54 = 1.78

### Step 1: eta squared
η² = SS effect ÷ SS total = 24 ÷ 200 = **.12**

### Step 2: partial eta squared
partial η² = SS effect ÷ (SS effect + SS error) = 24 ÷ (24 + 96) = **.20**

### Step 3: omega squared
ω² = (SS effect − df effect × MS error) ÷ (SS total + MS error) = (24 − 2 × 1.78) ÷ (200 + 1.78) = 20.44 ÷ 201.78 = **.10**

### What the differences mean
| Index | Denominator | Use and caution |
|---|---|---|
| η² | All variance | Shares of the total; sums to at most 1 across effects |
| Partial η² | Effect plus error only | SPSS default; larger; values from different designs are not comparable, and they can sum to more than 1 |
| ω² | Corrected total | Less biased estimate of the population effect; best for small samples |

Always state which one you report.
:::

:::qa How do you decide how many factors to keep in an exploratory factor analysis, and why is the eigenvalue-above-1 rule criticised? [advanced]
### The main methods
| Method | How it works | Strength | Weakness |
|---|---|---|---|
| Kaiser's rule | Keep factors with eigenvalue above 1 (each explains more than one item's worth of variance) | Simple; the SPSS default | Often keeps too many with many items; arbitrary cut |
| Scree test | Plot eigenvalues; keep those before the 'elbow' | Visual, intuitive | Subjective when there is no clear elbow |
| **Parallel analysis** | Compare eigenvalues with those from random data of the same size; keep factors whose eigenvalues are larger | Most accurate in simulation studies | Needs software (freely available) |
| Velicer's MAP test | Keeps factors while the average squared partial correlation falls | Good accuracy | Less familiar |
| Interpretability and theory | Are the factors meaningful, with at least three clean items each? | Keeps the solution useful | Can be abused to fit expectations |

### A sound procedure
1. Check KMO (at least .60) and Bartlett's test (significant).
2. Run parallel analysis and look at the scree plot.
3. Fit the candidate solutions (for example 2, 3 and 4 factors) with an oblique rotation.
4. Choose the solution that is statistically supported **and** interpretable, with simple structure.
5. Confirm it in a **new sample** with CFA.

### Why Kaiser's rule fails
With 40 items, an eigenvalue of 1.1 is only 2.75% of the variance; random data alone produce several eigenvalues above 1. It also ignores sampling error. That is why parallel analysis is now recommended.
:::

## 4.4 Long answers, short notes and viva [core]

### Long answer skeletons (15 to 20 marks)
**1. Describe the normal probability curve, its properties and its uses in psychology.**
- Definition and equation idea (defined by μ and σ); bell shape; asymptotic; mean = median = mode.
- Area table: 68.26, 95.44, 99.72; ±1.96 and ±2.58.
- Skewness (Pearson's Sk) and kurtosis (Ku about .263; lepto, meso, platy) with sketches.
- Uses: standard scores (z, T, stanine, IQ), percentiles from z, norms, grading, ability grouping, testing hypotheses, confidence intervals, the CLT.
- A worked z example and a limitation (not all traits are normal: reaction times, incomes, symptom counts).

**2. What is analysis of variance? Explain its assumptions, computation and interpretation.**
- Why not multiple t-tests (familywise error).
- Partitioning SS: total = between + within; df; MS; F ratio and its logic.
- A small worked example with the summary table.
- Assumptions; Levene; Welch; post hoc tests (Tukey, Scheffé, Bonferroni, LSD, Dunnett).
- Effect sizes (η², ω²); extensions (factorial with interactions, repeated measures with sphericity, ANCOVA, MANOVA).

**3. Discuss correlation: its types, computation and interpretation.**
- Definition; scatter plots; direction and strength; r².
- Pearson computation (worked); significance with df n − 2.
- Spearman (worked) and the special correlations table (point-biserial, biserial, phi, tetrachoric, contingency, Kendall, eta).
- Partial, part and multiple correlation.
- What distorts r; correlation is not causation.

**4. Explain hypothesis testing, Type I and Type II errors, power and effect size.**
- Steps of testing; null and alternative; α; p, and what p is not.
- The 2 × 2 decision table; trade-off between α and β.
- Power and its determinants; a priori analysis (64 per group for d = .5).
- Effect sizes and benchmarks; significance versus importance; confidence intervals; one- versus two-tailed tests.

**5. When are non-parametric tests used? Describe any three.**
- Assumptions of parametric tests and when they fail; ordinal data; small samples; outliers.
- Mann-Whitney, Wilcoxon, Kruskal-Wallis, Friedman, chi-square, sign test (with a small worked example).
- Advantages (few assumptions) and limitations (less power, less suited to complex designs).

### Short notes (5 marks each): outline points
- **Standard error of the mean:** SD of sampling distribution; σ ÷ √n; CLT; CIs.
- **Degrees of freedom:** values free to vary; df for t, χ², F, r.
- **Point-biserial versus biserial r:** true versus artificial dichotomy; examples; item analysis.
- **Partial correlation:** formula; holding a variable constant; a worked number.
- **Chi-square assumptions:** independence, frequencies, expected at least 5, Fisher, Yates, McNemar.
- **Cohen's d:** formula, benchmarks, U3, conversion to r.
- **Spearman-Brown prophecy formula:** split-half correction; lengthening a test; worked number.
- **Cronbach's alpha:** formula; meaning; not unidimensionality; acceptable values.
- **Standard error of measurement:** formula; confidence band; use at cut-offs.
- **ANCOVA:** covariate; adjusted means; homogeneity of regression slopes.
- **Factor rotation:** simple structure; orthogonal versus oblique; varimax, oblimin, promax.
- **Mediation and moderation:** definitions, diagrams, testing (indirect effect, interaction term).

:::viva
Why do we divide by n − 1 for a sample variance? :: Because deviations from the sample mean are slightly smaller than from the population mean, so dividing by n underestimates the population variance. n − 1 (the degrees of freedom) corrects this bias.
Can a result be significant but unimportant? :: Yes. With a very large sample, a tiny effect gives a small p. That is why effect sizes, confidence intervals and clinical significance must be reported.
Why not use several t-tests instead of ANOVA? :: Each test has its own 5% Type I risk, so the chance of at least one false positive rises quickly (about 14% for three tests). ANOVA tests all means at once at the chosen alpha.
What would you do if your data were badly skewed? :: Check for errors and outliers, consider a transformation (log, square root), use a robust or non-parametric test, or bootstrap confidence intervals, and report what was done.
What is the difference between the SD and the standard error? :: The SD describes the spread of individual scores; the standard error describes the spread of a statistic (like the mean) across repeated samples. SE = SD ÷ √n.
Is Cronbach's alpha a measure of unidimensionality? :: No. A long test can have a high alpha even with several factors. Unidimensionality is checked with factor analysis.
:::

## 4.5 Module test [core]
Thirty questions. A calculator is allowed. Aim for 24 or more.

:::mcq
Q: Which scale of measurement has a true zero?
- Nominal
- *Ratio
- Ordinal
- Interval
> A true zero allows ratios.

Q: The mean of five scores is 12. Four of them are 10, 11, 13 and 14. The fifth is:
- 10
- 11
- *12
- 14
> Total must be 60; 10 + 11 + 13 + 14 = 48; so 12.

Q: Which average is most appropriate for the distribution of family incomes in a district?
- Mean
- *Median
- Mode
- Midrange
> Incomes are positively skewed.

Q: A class of 30-39 has a frequency of 10; 15 cases lie below it; N = 50. The median is:
- 34.5
- 35
- *39.5
- 39
> Md = 29.5 + [(25 − 15) ÷ 10] × 10 = 39.5.

Q: The sample SD of 1, 3, 5 is:
- 1.63
- 4
- 3
- *2
> M = 3, SS = 8, s² = 8 ÷ 2 = 4, s = 2.

Q: A z score of 0.5 corresponds to a T score of:
- 50.5
- *55
- 45
- 60
> T = 50 + 10(0.5).

Q: About what percentage of a normal distribution lies more than 1.96 SD from the mean, in either direction?
- 1%
- *5%
- 2.5%
- 32%
> 2.5% in each tail.

Q: Stanine scores have a mean and SD of:
- 50 and 10
- 5.5 and 2
- *5 and 2
- 100 and 15
> Standard nine.

Q: The central limit theorem says that the distribution of sample means is approximately normal:
- Only if the population itself is normal
- Only for samples with fewer than thirty people
- Never, because each sample is different
- *For large samples, whatever the population's shape
> This is why z and t methods work so widely.

Q: Rejecting a true null hypothesis is a:
- Type II error
- *Type I error
- Correct rejection
- Power error
> A false positive.

Q: Power is NOT increased by:
- A larger sample
- *A smaller alpha (for example .01 instead of .05)
- A larger effect size in the population
- More reliable measures of the outcome
> A stricter alpha lowers power.

Q: r = .60 between two tests means the shared variance is:
- 60%
- 40%
- 6%
- *36%
> r² = .36.

Q: The correlation between a true dichotomy and a continuous variable is:
- Biserial
- Tetrachoric
- *Point-biserial
- Phi
> Point-biserial is for a genuine two-category variable.

Q: A partial correlation r12.3 is the relation between 1 and 2:
- Ignoring 3
- *With 3 held constant in both
- With 3 removed from 1 only
- Multiplied by 3
> Removing the third variable from both.

Q: Twenty students are tested before and after a workshop. The df for the paired t-test is:
- 38
- *19
- 20
- 18
> n − 1 pairs.

Q: Two independent groups of 25 give t = 2.10. Which statement is correct? (Critical t for 48 df, two-tailed .05, is about 2.01.)
- Not significant
- Significant at .001
- The df are 50
- *Significant at .05, two-tailed
> 2.10 exceeds 2.01; df = 48.

Q: In a chi-square test of independence with a 4 × 3 table, df =
- 12
- 7
- *6
- 11
> (4 − 1)(3 − 1).

Q: Chi-square should NOT be used when:
- Data are frequencies
- Categories are mutually exclusive
- There are three categories
- *The same person contributes to several cells
> Observations must be independent.

Q: In one-way ANOVA, MS between = 24 and MS within = 6. F =
- 18
- *4
- 30
- 0.25
> F = 24 ÷ 6.

Q: The post hoc test that controls error by dividing alpha by the number of comparisons is:
- Tukey
- *Bonferroni
- Scheffé
- Dunnett
> α ÷ number of tests.

Q: A 2 × 3 factorial ANOVA has how many df for the interaction?
- *2
- 6
- 5
- 1
> (2 − 1)(3 − 1).

Q: The assumption of sphericity applies to:
- Chi-square
- Independent t
- *Repeated-measures ANOVA
- Spearman's rho
> Equal variances of difference scores across conditions.

Q: The non-parametric equivalent of the paired t-test is the:
- Mann-Whitney U
- *Wilcoxon signed-rank test
- Kruskal-Wallis
- Friedman test
> Two related measures, ranks of differences.

Q: In a Mann-Whitney test, the obtained U must be:
- Greater than the critical value to be significant
- Exactly equal to n1 × n2
- *At or below the critical value to be significant
- Positive and above 10
> Small U means the groups are well separated.

Q: Cohen's d of 0.8 is conventionally:
- Small
- Medium
- Trivial
- *Large
> 0.2, 0.5, 0.8.

Q: In Ŷ = a + bX, b represents:
- The predicted value of Y when X is zero
- *The change in predicted Y per one-unit change in X
- The correlation between X and Y
- The error left over in each prediction
> The slope.

Q: A VIF of 15 for a predictor suggests:
- A strong effect
- Non-normal residuals
- *Serious multicollinearity
- An outlier
> Predictors overlap heavily.

Q: The split-half correlation of a test is .70. Its Spearman-Brown reliability is about:
- .70
- .76
- .91
- *.82
> 1.4 ÷ 1.7 = .82.

Q: An item loads .70 on one factor and .00 on the other. Its communality is:
- .70
- .30
- *.49
- 1.00
> .70² = .49.

Q: SPSS shows Sig. = .000 for an F test. The correct report is:
- p = .000
- p = 0
- *p < .001
- Not significant
> p is never exactly zero.
:::
`;
