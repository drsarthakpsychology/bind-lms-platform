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

:::qa Twenty students score 12, 15, 17, 18, 21, 22, 22, 24, 25, 26, 27, 27, 28, 29, 31, 33, 34, 36, 38, 41 on a test. Build a grouped frequency table with a class width of 5, and find the modal class. [starting]
### Step 1: range and classes
Range = 41 − 12 = 29. With i = 5, start at 10 (a multiple of 5 below the lowest score): 7 classes.

### Step 2: tally
| Class | Exact limits | Midpoint | f | cf |
|---|---|---|---|---|
| 40-44 | 39.5-44.5 | 42 | 1 | 20 |
| 35-39 | 34.5-39.5 | 37 | 2 | 19 |
| 30-34 | 29.5-34.5 | 32 | 3 | 17 |
| 25-29 | 24.5-29.5 | 27 | 6 | 14 |
| 20-24 | 19.5-24.5 | 22 | 4 | 8 |
| 15-19 | 14.5-19.5 | 17 | 3 | 4 |
| 10-14 | 9.5-14.5 | 12 | 1 | 1 |

### Step 3: check and read
- The f column adds to 20 and the top cf equals N: the tally is complete.
- The **modal class** is 25-29 (f = 6); the crude mode is its midpoint, 27.
- The distribution rises to a peak in the middle and tails off on both sides: roughly symmetrical.

### Why grouping costs something
Once grouped, you no longer know the exact scores inside each class. Statistics from grouped data (mean, median) are estimates that assume scores are spread evenly within each class.
:::

:::qa Find the percentile rank of a score of 45 in the empathy table from 1.2. [starting]
### The formula
PR = [cf below + ((X − L) ÷ i) × f] ÷ N × 100
where L is the exact lower limit of the class containing X, f its frequency, and cf below the cases under that class.

### Step 1: locate the class
45 falls in 40-49: L = 39.5, f = 8, cf below = 22, i = 10, N = 35.

### Step 2: the part of the class below 45
(45 − 39.5) ÷ 10 × 8 = 0.55 × 8 = 4.4 cases.

### Step 3: total below and percentage
22 + 4.4 = 26.4 cases. PR = 26.4 ÷ 35 × 100 = **75.4**.

### Interpret
A trainee scoring 45 has more empathy than about 75% of the group. Notice the reverse task (finding the score at a given percentile) uses the median formula with pN in place of N/2.
:::

:::qa Compute the quartile deviation for the empathy table, given Q1 = 27.71. [starting]
### Step 1: find Q3
3N ÷ 4 = 26.25. Reading the cf column (3, 10, 22, 30, 35), the 26.25th case is in 40-49.
Q3 = 39.5 + [(26.25 − 22) ÷ 8] × 10 = 39.5 + 5.31 = **44.81**

### Step 2: quartile deviation
Q = (Q3 − Q1) ÷ 2 = (44.81 − 27.71) ÷ 2 = 17.10 ÷ 2 = **8.55**

### Step 3: compare with the SD
The SD of this table was 11.50. In a normal distribution Q is about two-thirds of the SD (0.6745 × SD = 7.76). Here Q = 8.55 is close, which agrees with the nearly symmetrical shape.
:::

:::qa Two sections of a class have means of 60 (30 students) and 70 (20 students). What is the combined mean? Why is it not 65? [starting]
### Step by step
1. Total of section A = 30 × 60 = 1,800.
2. Total of section B = 20 × 70 = 1,400.
3. Combined total = 3,200; combined N = 50.
4. Combined mean = 3,200 ÷ 50 = **64**.

### Why not 65?
65 is the simple average of the two means, which treats both sections as equal in size. Section A has more students, so it pulls the combined mean toward 60. This is a **weighted mean**: M = (n1M1 + n2M2) ÷ (n1 + n2).

### Where it matters
Pooling results from several colleges, combining survey strata, or averaging marks across courses with different credits (the SGPA in CBCS is a weighted mean).
:::

:::qa Compute the average deviation of 4, 8, 6, 5, 7, and compare it with the SD. Why do statisticians prefer the SD? [starting]
### Average deviation
Mean = 6. Absolute deviations: 2, 2, 0, 1, 1. Sum = 6. AD = 6 ÷ 5 = **1.2**.

### SD for comparison
Population SD = √(10 ÷ 5) = **1.41** (from section 1.4).

### Why the SD wins
| Point | AD | SD |
|---|---|---|
| Ease of understanding | Very easy | Harder |
| Algebra | Absolute values are awkward | Squares are easy to work with |
| Link to the normal curve | None | Defines the curve and its areas |
| Use in further statistics | Rare | Basis of z, t, F, r and regression |
| Sampling stability | Less stable | More stable across samples |

The SD is always at least as large as the AD, because squaring gives extra weight to large deviations.
:::

:::qa A distribution has mean 40, median 46 and SD 12. Compute Pearson's coefficient of skewness and describe the shape. [starting]
### Step 1: the formula
Sk = 3(M − Md) ÷ SD

### Step 2: compute
Sk = 3(40 − 46) ÷ 12 = 3(−6) ÷ 12 = **−1.5**

### Step 3: interpret
- The sign is negative: a **long tail on the left** (low scores).
- The mean has been pulled below the median by a minority of low scorers.
- Values beyond about ±1 indicate marked skew.

### What it might mean in practice
An easy test where most students scored well but a few failed badly; a measure of independence in daily living in a mostly healthy sample. For such data, report the median and IQR, and check before using a test that assumes normality.
:::

:::qa A student cycles to college at 40 km/h and back at 60 km/h. Which kind of mean gives the right average speed, and why? [starting]
### The three means
| Mean | Formula | Here |
|---|---|---|
| Arithmetic | (a + b) ÷ 2 | 50 |
| Geometric | √(a × b) | 48.99 |
| Harmonic | 2 ÷ (1/a + 1/b) | **48** |

### Which is right
For **equal distances** travelled at different speeds, use the **harmonic mean**: 48 km/h.

### Why
Say the trip is 120 km each way. Going takes 3 hours; returning takes 2 hours. Total 240 km in 5 hours = 48 km/h. She spends more **time** at the slower speed, so the true average leans toward 40.

### When each mean is used
- Arithmetic: most scores.
- Geometric: growth rates and ratios (average yearly growth).
- Harmonic: rates over equal amounts (speed over equal distances, price per item over equal spending).
:::

:::qa What is sampling error, and how is it different from a mistake? Illustrate with an example. [starting]
### Definition
Sampling error is the **chance** difference between a sample statistic and the population parameter, which happens simply because a sample is only part of the population.

### Example
A college has 1,000 students whose true mean sleep is 6.5 hours. Five random samples of 50 give means of 6.3, 6.6, 6.8, 6.4 and 6.5. None of these is a mistake; they vary by chance around 6.5.

### How it differs from other errors
| Error | Cause | Fixed by a bigger sample? |
|---|---|---|
| Sampling error | Chance selection | Yes, it shrinks with √n |
| Sampling bias | A flawed method (only hostel students) | No |
| Measurement error | Unreliable tool | No, use a better tool |
| Mistakes | Data entry errors | No, check the data |

### Why it matters for inference
Inferential statistics exists to measure sampling error: the standard error, confidence intervals and p values all describe how far a statistic is likely to wander by chance.
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

:::qa On an IQ test (mean 100, SD 15), what score marks the 90th percentile, and which stanine does an IQ of 91 fall in? [beginner]
### Part 1: the 90th percentile
1. Find the z that has 90% of the curve below it: area from the mean = .40, so z = **1.28**.
2. Convert: X = M + z × SD = 100 + 1.28 × 15 = **119.2**.

### Part 2: the stanine for 91
1. z = (91 − 100) ÷ 15 = −0.60.
2. Stanine = 2z + 5 = −1.2 + 5 = 3.8, which rounds to **4**.
3. Check against the bands: stanine 4 covers z from −0.75 to −0.25, which includes −0.60.

### Why both conversions matter
Clinical reports often give percentiles to families and stanines or scaled scores to schools. Being able to move between raw, z, percentile and stanine lets you check reports for errors.
:::

:::qa Sixteen trainees rate their confidence (M = 52, s = 8). Does this differ from the known average of 48? Then build a 95% confidence interval. [beginner]
### Why t, not z
The population SD is unknown (we only have s), and n is small, so use the **t distribution** with n − 1 df.

### Step 1: standard error
SE = s ÷ √n = 8 ÷ 4 = **2**

### Step 2: t
t = (52 − 48) ÷ 2 = **2.00**, df = 15

### Step 3: decide
Critical t (df 15, two-tailed .05) = **2.13**. 2.00 is short of it: **not significant**.

### Step 4: the 95% CI
52 ± 2.13 × 2 = 52 ± 4.26, so **47.74 to 56.26**.

### Step 5: the link between the two
The interval **includes 48**, which is exactly why the test was not significant. A two-tailed test at .05 and a 95% CI always agree. Note that with z (1.96) the same data would have looked significant; small samples need the wider t.
:::

:::qa A correlation of r = .30 is found between sleep quality and mood in 50 students. Is it significant? Show the t test for r. [beginner]
### The formula
t = r × √(n − 2) ÷ √(1 − r²), with df = n − 2

### Step by step
1. √(n − 2) = √48 = 6.93
2. √(1 − r²) = √(1 − .09) = √.91 = .954
3. t = .30 × 6.93 ÷ .954 = 2.08 ÷ .954 = **2.18**
4. Critical t (df 48, two-tailed .05) ≈ **2.01**

### Decision
2.18 exceeds 2.01, so r = .30 is **significant** at .05. r² = .09: 9% shared variance.

### The bigger lesson
With n = 500, r = .10 would also be significant, but it shares only 1% of variance. With n = 10, r = .60 would not be significant. Always read r alongside n.
:::

:::qa Two groups of unequal size are compared: Group 1 (n = 4): 10, 12, 14, 16. Group 2 (n = 6): 6, 8, 9, 10, 11, 10. Compute the independent t. [beginner]
### Step 1: means and sums of squares
- Group 1: M = 13; deviations −3, −1, 1, 3; SS1 = 9 + 1 + 1 + 9 = **20**
- Group 2: M = 9; deviations −3, −1, 0, 1, 2, 1; SS2 = 9 + 1 + 0 + 1 + 4 + 1 = **16**

### Step 2: pooled variance (weighted by df)
s²pooled = (SS1 + SS2) ÷ (n1 + n2 − 2) = 36 ÷ 8 = **4.5**

### Step 3: standard error of the difference
SE = √[4.5 × (1/4 + 1/6)] = √(4.5 × 0.4167) = √1.875 = **1.369**

### Step 4: t and decision
t = (13 − 9) ÷ 1.369 = **2.92**, df = 8. Critical t = 2.31: **significant** (p = .019).

### Note on unequal n
With unequal groups, the pooled formula weights each group's variance by its df. If the smaller group also had the larger variance, the test would become unreliable: then use Welch's t.
:::

:::qa Theory predicts that 50%, 30% and 20% of clients prefer individual, group and online counselling. In a sample of 100, the counts are 40, 35 and 25. Test the fit. [beginner]
### Step 1: expected frequencies from the theory
E = 50, 30 and 20.

### Step 2: chi-square
| Category | O | E | (O − E)² ÷ E |
|---|---|---|---|
| Individual | 40 | 50 | 100 ÷ 50 = 2.00 |
| Group | 35 | 30 | 25 ÷ 30 = 0.83 |
| Online | 25 | 20 | 25 ÷ 20 = 1.25 |
| Total | 100 | 100 | **4.08** |

### Step 3: decide
df = 3 − 1 = 2; critical χ² = 5.99. 4.08 is below it: the data **fit** the theory (p = .13).

### Note
A goodness-of-fit test can use any expected pattern, not only "all equal". A non-significant result here is the hoped-for outcome: it means the theory is not contradicted.
:::

:::qa For the help-seeking table (women 30 yes, 20 no; men 15 yes, 35 no), compute the odds ratio and explain how it differs from phi. [beginner]
### Step 1: odds in each group
- Women: 30 ÷ 20 = **1.5**
- Men: 15 ÷ 35 = **0.43**

### Step 2: odds ratio
OR = 1.5 ÷ 0.43 = (30 × 35) ÷ (20 × 15) = 1,050 ÷ 300 = **3.5**

Women's odds of seeking help are 3.5 times men's.

### Step 3: compare with phi (.30)
| Index | Range | Meaning | Best for |
|---|---|---|---|
| Phi | −1 to +1 | A correlation between two dichotomies | Describing association strength |
| Odds ratio | 0 to infinity; 1 = no association | Ratio of odds | Epidemiology, logistic regression, case-control studies |

### Why the OR is popular
It is not affected by how the sample was drawn (it works in case-control designs), and it is what logistic regression reports.
:::

:::qa In mental health screening, explain Type I and Type II errors, and link them to sensitivity and specificity. [beginner]
### The screening table
| | Person truly has depression | Person does not |
|---|---|---|
| Screen positive | True positive | **False positive** (like a Type I error) |
| Screen negative | **False negative** (like a Type II error) | True negative |

### The terms
- **Sensitivity** = true positives ÷ all who have it (like power).
- **Specificity** = true negatives ÷ all who do not (like 1 − α).
- **Positive predictive value** = true positives ÷ all positives; it falls when the condition is rare.

### The trade-off
Lowering the cut-off on a questionnaire catches more true cases (higher sensitivity, fewer Type II errors) but flags more healthy people (lower specificity, more Type I errors). Which error is worse depends on the cost: missing suicidal depression is far worse than a second interview for someone who is well, so screening tools usually favour sensitivity.

### Link to signal detection
Moving the cut-off is moving the **criterion**; a better test increases **d′**, separating the two groups so both errors fall.
:::

:::qa Compute Spearman's rho when there are ties: X = 10, 20, 20, 30, 40; Y = 1, 3, 2, 5, 4. [beginner]
### Step 1: rank, sharing tied ranks
- X ranks (lowest = 1): 10 → 1; the two 20s share ranks 2 and 3 → **2.5 each**; 30 → 4; 40 → 5.
- Y ranks: 1 → 1, 3 → 3, 2 → 2, 5 → 5, 4 → 4.

### Step 2: differences
| X rank | Y rank | d | d² |
|---|---|---|---|
| 1 | 1 | 0 | 0 |
| 2.5 | 3 | −0.5 | 0.25 |
| 2.5 | 2 | 0.5 | 0.25 |
| 4 | 5 | −1 | 1 |
| 5 | 4 | 1 | 1 |
| | | Σd² | **2.5** |

### Step 3: rho
ρ = 1 − (6 × 2.5) ÷ [5 × (25 − 1)] = 1 − 15 ÷ 120 = **.875**

### A note on ties
With ties the shortcut formula is slightly off. The exact method is to compute Pearson's r on the ranks, which gives .872 here. With few ties the difference is trivial; with many ties, use the exact method or Kendall's tau.
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

:::qa After the revision-methods ANOVA in 3.1 (means 5, 7, 10; MS within = 0.667; n = 4 per group; df within = 9), run Tukey's HSD. Which pairs differ? [advanced]
### Step 1: the formula
HSD = q × √(MS within ÷ n), where q comes from the studentised range table for k = 3 groups and df = 9 at .05: **q = 3.95**.

### Step 2: compute HSD
√(0.667 ÷ 4) = √0.1667 = 0.408. HSD = 3.95 × 0.408 = **1.61**

### Step 3: compare every pair
| Pair | Difference | Larger than 1.61? |
|---|---|---|
| Highlighting vs re-reading | 7 − 5 = 2 | Yes |
| Self-testing vs highlighting | 10 − 7 = 3 | Yes |
| Self-testing vs re-reading | 10 − 5 = 5 | Yes |

### Step 4: report
All three methods differ: self-testing is best, then highlighting with summary, then re-reading. Tukey keeps the familywise error at .05 across all three comparisons.
:::

:::qa Four people rank three study conditions (1 = best). Ranks: P1 1, 2, 3; P2 1, 3, 2; P3 1, 2, 3; P4 2, 1, 3. Run a Friedman test. [advanced]
### Step 1: rank sums per condition
- Condition A: 1 + 1 + 1 + 2 = **5**
- Condition B: 2 + 3 + 2 + 1 = **8**
- Condition C: 3 + 2 + 3 + 3 = **11**

### Step 2: the formula
χ²F = [12 ÷ (nk(k + 1))] × ΣR² − 3n(k + 1), with n = 4 people and k = 3 conditions.

### Step 3: compute
- 12 ÷ (4 × 3 × 4) = 12 ÷ 48 = 0.25
- ΣR² = 25 + 64 + 121 = 210
- χ²F = 0.25 × 210 − 3 × 4 × 4 = 52.5 − 48 = **4.5**

### Step 4: decide
df = k − 1 = 2; critical value 5.99. Not significant (p = .105). Condition A looks preferred, but four people are too few to be sure. (With samples this small, exact tables are better than the chi-square approximation.)
:::

:::qa In a therapy trial, pre-test means were 20 (therapy) and 24 (control), grand mean 22; post-test means were 30 and 32. The pooled within-group slope of post on pre is 0.8. Compute ANCOVA-adjusted post-test means and explain what happened. [advanced]
### The formula
Adjusted mean = observed post mean − b × (group's pre mean − grand pre mean)

### Step 1: therapy group
30 − 0.8 × (20 − 22) = 30 + 1.6 = **31.6**

### Step 2: control group
32 − 0.8 × (24 − 22) = 32 − 1.6 = **30.4**

### Step 3: interpret
| | Observed post | Adjusted post |
|---|---|---|
| Therapy | 30 | 31.6 |
| Control | 32 | 30.4 |

The control group looked better (32 versus 30), but it **started** higher. After adjusting for the pre-test, the therapy group is ahead. ANCOVA asks: what would the post-test means be if both groups had started at the same level?

### Caution
In randomised trials, this adjustment adds power. In non-randomised groups, it cannot remove all pre-existing differences, especially if the pre-test is unreliable or other unmeasured differences exist (Lord's paradox shows two reasonable analyses can disagree).
:::

:::qa A regression gives Ŷ = 2 + 0.5X + 0.3W + 0.4(X × W), where W (social support) is centred with SD 1. Compute the simple slopes of X (stress) at low and high support, and interpret. [advanced]
### Step 1: the slope of X depends on W
Rearranging: Ŷ = (2 + 0.3W) + (0.5 + 0.4W)X. The slope of X is **0.5 + 0.4W**.

### Step 2: pick values of W
Conventionally one SD below and above the mean: W = −1 and W = +1.
- Low support (W = −1): slope = 0.5 − 0.4 = **0.1**
- Mean support (W = 0): slope = **0.5**
- High support (W = +1): slope = 0.5 + 0.4 = **0.9**

### Step 3: interpret
With this sign, stress predicts depression **more strongly** when support is high, which would be surprising. If the coefficient had been −0.4, support would buffer stress (slope 0.9 at low support, 0.1 at high). Always check the sign before writing the story.

### Reporting
Test each simple slope for significance, plot the lines, and give the region of W where the slope is significant (the Johnson-Neyman method).
:::

:::qa In a logistic regression predicting relapse, B for "number of previous episodes" is 0.69 and the intercept is −2. Interpret B and predict the probability of relapse for a person with 2 previous episodes. [advanced]
### Step 1: B as an odds ratio
Exp(B) = e^0.69 = **2.0**: each additional previous episode **doubles the odds** of relapse.

### Step 2: the logit for 2 episodes
logit = −2 + 0.69 × 2 = −2 + 1.38 = **−0.62**

### Step 3: convert the logit to a probability
p = 1 ÷ (1 + e^0.62) = 1 ÷ (1 + 1.86) = 1 ÷ 2.86 = **.35**

### Step 4: interpret carefully
| Episodes | Logit | Probability |
|---|---|---|
| 0 | −2.00 | .12 |
| 2 | −0.62 | .35 |
| 4 | 0.76 | .68 |

Doubling the odds does not double the probability: the effect on probability depends on where you start. Report odds ratios with confidence intervals, and check model fit (classification table, a pseudo-R², the Hosmer-Lemeshow test).
:::

:::qa A criterion has SD 10 and correlates .60 with a predictor. Compute the standard error of estimate and a rough 95% band around a predicted score of 70. [advanced]
### Step 1: SEE
SEE = SDy × √(1 − r²) = 10 × √(1 − .36) = 10 × √.64 = 10 × 0.8 = **8**

### Step 2: the band
70 ± 1.96 × 8 = 70 ± 15.7, so about **54 to 86**.

### Step 3: interpret
Even a correlation of .60, which is large in psychology, leaves wide uncertainty for an individual: the error is 80% of the original SD. That is why selection decisions should rarely rest on one predictor.

### Note
In small samples the exact prediction interval is wider still, because it also includes uncertainty in the regression line itself.
:::

:::qa In item analysis, 40 students make up the top 27% and 40 the bottom 27%. On an item, 32 of the top group and 12 of the bottom group are correct. Compute the difficulty and discrimination indices and judge the item. [advanced]
### Step 1: difficulty index (p)
p = (U + L) ÷ (nU + nL) = (32 + 12) ÷ 80 = **.55**: 55% answered correctly, a medium-difficulty item.

### Step 2: discrimination index (D)
D = (U − L) ÷ n per group = (32 − 12) ÷ 40 = **.50**

### Step 3: judge
| Index | Rough guide | This item |
|---|---|---|
| p | .30 to .70 is ideal for most tests | Good |
| D | .40 or more: very good; .20 to .39: acceptable; below .20: revise; negative: discard | Very good |

### Why the 27% groups
Kelley showed that the upper and lower 27% give the best balance between extreme groups (sharp contrast) and enough cases (stable estimates). The point-biserial item-total correlation is the modern alternative.
:::

:::qa A five-item right-wrong test has item difficulty values (p) of .8, .6, .5, .4 and .7, and a total-score variance of 2.0. Compute KR-20. [advanced]
### Step 1: pq for each item (q = 1 − p)
| Item | p | q | pq |
|---|---|---|---|
| 1 | .8 | .2 | .16 |
| 2 | .6 | .4 | .24 |
| 3 | .5 | .5 | .25 |
| 4 | .4 | .6 | .24 |
| 5 | .7 | .3 | .21 |
| | | Σpq | **1.10** |

### Step 2: KR-20
KR-20 = [k ÷ (k − 1)] × [1 − Σpq ÷ σ²] = (5 ÷ 4) × (1 − 1.10 ÷ 2.0) = 1.25 × 0.45 = **.56**

### Step 3: interpret
Low reliability, as expected with only five items. Spearman-Brown says a 20-item version of similar items would reach about .84. Note that pq is largest (.25) when p = .5: middle-difficulty items contribute most variance and most to reliability.
:::

:::qa Four people are tested under three conditions: S1 3, 5, 6; S2 2, 4, 7; S3 4, 5, 8; S4 3, 6, 7. Compute a repeated-measures ANOVA and compare it with treating the data as independent groups. [advanced]
### Step 1: means
Condition means: 3, 5, 7. Person means: 4.67, 4.33, 5.67, 5.33. Grand mean = 5. ΣX = 60, ΣX² = 338.

### Step 2: partition the SS
- SS total = 338 − 60² ÷ 12 = 338 − 300 = **38.00**
- SS conditions = 4 × [(3 − 5)² + (5 − 5)² + (7 − 5)²] = 4 × 8 = **32.00**
- SS subjects = 3 × [(4.67 − 5)² + (4.33 − 5)² + (5.67 − 5)² + (5.33 − 5)²] = **3.33**
- SS error = 38 − 32 − 3.33 = **2.67**

### Step 3: the table
| Source | SS | df | MS | F |
|---|---|---|---|---|
| Conditions | 32.00 | 2 | 16.00 | **36.0** |
| Subjects | 3.33 | 3 | 1.11 | |
| Error (conditions × subjects) | 2.67 | 6 | 0.44 | |
| Total | 38.00 | 11 | | |

Critical F(2, 6) = 5.14: significant.

### Step 4: the same data as independent groups
SS within would be 3.33 + 2.67 = 6.00 on 9 df, MS = 0.67, F(2, 9) = 24.0. The repeated-measures F is larger because the 3.33 units of **stable person differences** are removed from the error term. That is the power advantage of within-subjects designs. Check sphericity before trusting the F.
:::

:::qa A study of 103 people finds r = .50. Build a 95% confidence interval for the population correlation using Fisher's z. [advanced]
### Why a transformation
The sampling distribution of r is skewed (it cannot pass 1), so you cannot just add and subtract. Fisher's transformation z′ = ½ ln[(1 + r) ÷ (1 − r)] makes it roughly normal, with SE = 1 ÷ √(n − 3).

### Step 1: transform
z′ for r = .50 is **0.549**.

### Step 2: standard error
SE = 1 ÷ √(103 − 3) = 1 ÷ 10 = **0.10**

### Step 3: interval in z′ units
0.549 ± 1.96 × 0.10 = 0.549 ± 0.196, so 0.353 to 0.745.

### Step 4: back-transform
r = (e^(2z′) − 1) ÷ (e^(2z′) + 1): 0.353 → **.34**; 0.745 → **.63**.

### Interpret
The true correlation is plausibly between .34 and .63. The interval is **not symmetrical** around .50: it stretches further downward, because r is squeezed near 1. The same method compares two independent correlations.
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
- Only for samples with fewer than thirty people in them
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
- A larger true effect size in the population studied
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
- Tetrachoric (both split)
- *Point-biserial
- Phi
> Point-biserial is for a genuine two-category variable.

Q: A partial correlation r12.3 is the relation between 1 and 2:
- Ignoring 3
- *With 3 held constant in both
- With 3 removed from variable 1 only
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
- Significant at .001 and at .05
- The df are 50, not 48
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
- Categories are mutually exclusive and exhaustive
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
- Dunnett (versus control)
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
- Spearman's rank correlation
> Equal variances of difference scores across conditions.

Q: The non-parametric equivalent of the paired t-test is the:
- Mann-Whitney U
- *Wilcoxon signed-rank test
- Kruskal-Wallis H test
- Friedman two-way ANOVA by ranks
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
- The predicted value of Y when X is exactly zero
- *The change in predicted Y per unit of X
- The correlation between X and Y
- The error left over in each prediction of Y
> The slope.

Q: A VIF of 15 for a predictor suggests:
- A strong effect
- Non-normal residuals in the model
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
