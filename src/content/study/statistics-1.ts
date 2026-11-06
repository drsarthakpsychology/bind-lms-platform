/* Module · Statistics for psychology, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: describing data

## 1.1 What statistics is for [core][starting]
A clinical psychologist in Delhi gives a new anxiety scale to 200 college students. She now has 200 numbers. Statistics does two jobs with them:
- **Descriptive statistics** summarise the data you have: the average score, how spread out the scores are, what the distribution looks like.
- **Inferential statistics** use a sample to draw conclusions about a **population** you did not fully measure, and tell you how much to trust those conclusions: is the difference between men and women real, or chance?

### The basic vocabulary
- **Population:** everyone you want to know about (all college students in Delhi). Its summary values are **parameters**, written with Greek letters: μ (mean), σ (standard deviation), ρ (correlation).
- **Sample:** the people you actually measured. Its summary values are **statistics**, written with Latin letters: M or X̄ (mean), s or SD, r.
- **Variable:** anything that varies: score, age, gender, diagnosis. **Quantitative** variables are counts or measurements (marks, reaction time). **Qualitative** (categorical) variables are kinds (religion, diagnosis).
- **Discrete** variables take separate values (number of children); **continuous** variables can take any value in a range (time, height). A continuous score of 24 really stands for the interval 23.5 to 24.5: these are its **exact (real) limits**.

### Scales of measurement decide the statistics
| Scale | Example | Average to use | Spread | Typical tests |
|---|---|---|---|---|
| Nominal | Diagnosis, mother tongue | Mode | None (or the number of categories) | Chi-square |
| Ordinal | Merit rank, a mild–moderate–severe rating | Median | Quartile deviation, range | Spearman, Mann-Whitney, Wilcoxon |
| Interval | IQ, scale totals | Mean | Standard deviation | Pearson, t, ANOVA |
| Ratio | Reaction time, number of errors | Mean (and geometric mean) | SD, coefficient of variation | All of the above |

**Parametric tests** (t, ANOVA, Pearson's r) assume interval or ratio data, roughly normal distributions and similar variances. **Non-parametric (distribution-free) tests** need fewer assumptions and work with ranks or categories.

:::widget sort
{"prompt": "Descriptive or inferential? Place each statement.", "buckets": ["Descriptive", "Inferential"], "items": [{"text": "The 200 students had a mean anxiety score of 34", "bucket": 0}, {"text": "Women in Delhi colleges are probably more anxious than men (p = .01)", "bucket": 1, "why": "It generalises from the sample to a population, with a probability attached."}, {"text": "Scores ranged from 8 to 61", "bucket": 0}, {"text": "We are 95% confident that the population mean lies between 32.1 and 35.9", "bucket": 1}, {"text": "Forty per cent of the sample were first-generation college students", "bucket": 0}, {"text": "Sleep hours predict anxiety in students generally (r = −.30, p below .001)", "bucket": 1}]}
:::

### Symbols you will meet
| Symbol | Meaning |
|---|---|
| N, n | Number of cases (N often for the population or total, n for a group) |
| Σ | "Add up": ΣX is the sum of all X scores |
| X̄ or M | Sample mean |
| s or SD; s² | Sample standard deviation; variance |
| μ, σ | Population mean and SD |
| df | Degrees of freedom |
| α | Alpha, the significance level chosen (usually .05) |
| p | Probability of data this extreme if the null hypothesis were true |

:::recall
1. Descriptive versus inferential statistics in one line each. || Descriptive: summarise the data you have. Inferential: generalise from a sample to a population, with a stated degree of uncertainty.
2. What is a parameter? A statistic? || Parameter: a value describing a population (Greek letters). Statistic: a value describing a sample (Latin letters).
3. What are the exact limits of a score of 24 on a continuous variable? || 23.5 to 24.5.
4. Which average suits nominal, ordinal and interval data? || Mode, median and mean respectively.
:::

:::mcq
Q: σ stands for:
- *The population standard deviation
- The sample mean
- The sample standard deviation
- The sum of scores
> Greek letters are for population parameters.

Q: Which test needs at least interval-level data?
- *Pearson's r
- Chi-square
- Spearman's rho
- Mann-Whitney U
> Pearson's r is parametric and assumes interval or ratio data.
:::

## 1.2 Organising data: frequency distributions and graphs [core][starting]
Raw scores are hard to read. A **frequency distribution** shows how many people got each score or fell in each **class interval**.

### Building a grouped frequency distribution
1. Find the **range**: highest minus lowest.
2. Choose the number of classes, usually **10 to 20** for large data sets (fewer for small ones), and a convenient **class width (i)** such as 2, 5 or 10.
3. Start the lowest class at a multiple of i that includes the lowest score.
4. Tally scores into classes. Each class has **stated limits** (10–19) and **exact limits** (9.5–19.5); its **midpoint** is the average of its limits (14.5).
5. Add **cumulative frequency (cf)**: the running total from the bottom; and **cumulative percentage** (cf ÷ N × 100), which gives percentile ranks.

Here are the scores of 35 trainee counsellors on an empathy test, already grouped. You will use this table again.

| Class | f | Exact limits | Midpoint (x) | cf |
|---|---|---|---|---|
| 50–59 | 5 | 49.5–59.5 | 54.5 | 35 |
| 40–49 | 8 | 39.5–49.5 | 44.5 | 30 |
| 30–39 | 12 | 29.5–39.5 | 34.5 | 22 |
| 20–29 | 7 | 19.5–29.5 | 24.5 | 10 |
| 10–19 | 3 | 9.5–19.5 | 14.5 | 3 |

### Graphs: which one when
| Graph | Use it for | Note |
|---|---|---|
| **Bar chart** | Nominal or ordinal categories | Bars are separated, because categories are separate |
| **Histogram** | Continuous grouped data | Bars touch; area is proportional to frequency |
| **Frequency polygon** | Continuous data; comparing two distributions on one graph | Join the midpoints; close at both ends |
| **Ogive (cumulative frequency curve)** | Reading medians, quartiles and percentiles | Plot cf against **upper exact limits**; S-shaped |
| **Pie chart** | Parts of a whole | Avoid with many slices |
| **Stem-and-leaf plot** | Small data sets, keeping every score visible | Tukey; e.g. 3 | 4 7 8 means 34, 37, 38 |
| **Box plot (box-and-whisker)** | Median, quartiles, spread and outliers at a glance | Tukey; the box runs from Q1 to Q3 |
| **Scatter plot** | The relation between two quantitative variables | First step before computing r |
| **Line graph** | Change over time or across conditions | Interaction plots in ANOVA |

### Shapes of distributions
- **Symmetrical** (normal is the famous one), **positively skewed** (tail to the right: income, number of panic attacks), **negatively skewed** (tail to the left: marks on an easy test), **J-shaped**, **bimodal** (two peaks: perhaps two different groups mixed together), **rectangular** (uniform).

:::widget sort
{"prompt": "Which graph fits each job best?", "buckets": ["Bar chart", "Histogram or polygon", "Ogive", "Scatter plot or box plot"], "items": [{"text": "Number of patients in each diagnostic category at a Lucknow OPD", "bucket": 0, "why": "Nominal categories: separate bars."}, {"text": "Distribution of reaction times of 300 participants", "bucket": 1}, {"text": "Reading off the score below which 75% of students fall", "bucket": 2, "why": "The ogive shows cumulative percentages, so percentiles can be read directly."}, {"text": "Do students who sleep more get higher marks?", "bucket": 3, "why": "Two quantitative variables: a scatter plot."}, {"text": "Comparing the score spread and outliers of three colleges at a glance", "bucket": 3, "why": "Side-by-side box plots."}, {"text": "Comparing two overlapping score distributions on one graph", "bucket": 1, "why": "Two frequency polygons can share one set of axes."}]}
:::

:::recall
1. What are the exact limits and midpoint of the class 30–39? || Exact limits 29.5–39.5; midpoint 34.5.
2. Histogram versus bar chart. || A histogram is for continuous data and its bars touch; a bar chart is for categories and its bars are separate.
3. Against what do you plot an ogive? || Cumulative frequency (or percentage) against the upper exact limit of each class.
4. What does a bimodal distribution often suggest? || Two different groups mixed together.
:::

:::mcq
Q: Marks on a very easy test pile up near the top with a long tail of low scores. The distribution is:
- *Negatively skewed
- Positively skewed
- Rectangular
- Leptokurtic
> The tail points to the low (left) end.

Q: The graph best suited to finding the median and quartiles directly is the:
- Bar chart
- *Ogive
- Pie chart
- Histogram
> Read across from 50% (median), 25% and 75%.
:::

## 1.3 Central tendency: mean, median and mode [core][starting]
An **average** is a single number that best represents a set of scores.

### The three averages
- **Mean (arithmetic mean):** add the scores and divide by their number. M = ΣX ÷ N. It uses every score, so it is the most stable from sample to sample, but it is **pulled by extreme scores**.
- **Median (Md):** the middle score when scores are put in order: the 50th percentile. With an even number of scores, it is the average of the two middle ones. It is **not affected by extreme scores**.
- **Mode (Mo):** the most frequent score. A distribution may have more than one.

Two properties of the mean examiners love: the **sum of deviations from the mean is always zero**, Σ(X − M) = 0; and the **sum of squared deviations is smallest around the mean** (the least-squares property).

:::widget worked
{"title": "The three averages, and what skew does to them", "steps": [{"q": "Seven patients report the number of panic attacks in a month: 3, 5, 5, 6, 8, 9, 20. Find the mean.", "a": "ΣX = 3 + 5 + 5 + 6 + 8 + 9 + 20 = 56. M = 56 ÷ 7 = 8."}, {"q": "Find the median and the mode.", "a": "In order, the 4th of 7 scores is the middle one: median = 6. The most frequent score: mode = 5."}, {"q": "What does mean 8, median 6, mode 5 tell you about the shape?", "a": "Mean greater than median greater than mode: the distribution is positively skewed. The one patient with 20 attacks drags the mean up. For skewed data, report the median."}, {"q": "Replace 20 with 10. What changes?", "a": "ΣX = 46, M = 6.57. The median (6) and mode (5) do not change. The mean is the only average that feels every score."}], "yourTurn": [{"q": "Monthly incomes in a village sample are mostly ₹8,000 to ₹15,000, with two landowners earning ₹4 lakh. Which average best represents a typical household, and why?", "a": "The median. The two very high incomes pull the mean far above what most households earn; the median is unaffected by them."}]}
:::

### From grouped data
Use the empathy table from 1.2 (N = 35).
- **Mean:** M = Σfx ÷ N, using midpoints as x. Σfx = (3 × 14.5) + (7 × 24.5) + (12 × 34.5) + (8 × 44.5) + (5 × 54.5) = 43.5 + 171.5 + 414 + 356 + 272.5 = 1,257.5. M = 1,257.5 ÷ 35 = **35.93**.
- **Median:** Md = L + [(N/2 − F) ÷ f] × i, where L is the exact lower limit of the class containing the median, F the cumulative frequency **below** that class, f the frequency **in** it and i the class width.
- **Mode (crude):** the midpoint of the class with the highest frequency. A refined formula: Mo = L + [(f1 − f0) ÷ (2f1 − f0 − f2)] × i, where f1 is the modal class frequency and f0 and f2 are the frequencies of the classes below and above it. The **empirical relation** Mo = 3Md − 2M holds roughly for moderately skewed data.

:::widget worked
{"title": "The median from a grouped table", "steps": [{"q": "N = 35. Which score position is the median?", "a": "N/2 = 17.5. We need the score with 17.5 cases below it."}, {"q": "Which class holds it?", "a": "Reading up the cf column: 3, 10, 22. The 17.5th case falls in the class whose cf passes 17.5, which is 30–39 (cf 22)."}, {"q": "Write down L, F, f and i.", "a": "L = 29.5 (exact lower limit), F = 10 (cases below the class), f = 12 (cases in the class), i = 10."}, {"q": "Compute the median.", "a": "Md = 29.5 + [(17.5 − 10) ÷ 12] × 10 = 29.5 + (7.5 ÷ 12) × 10 = 29.5 + 6.25 = 35.75."}, {"q": "Now the refined mode, and compare all three.", "a": "Mo = 29.5 + [(12 − 7) ÷ (24 − 7 − 8)] × 10 = 29.5 + (5 ÷ 9) × 10 = 35.06. Mean 35.93, median 35.75, mode 35.06: very close, so the distribution is nearly symmetrical, with a very slight positive skew."}], "yourTurn": [{"q": "In the same table, find Q1 (the 25th percentile) using the same formula with N/4 instead of N/2.", "a": "N/4 = 8.75. It falls in the class 20–29 (cf below = 3, f = 7, L = 19.5). Q1 = 19.5 + [(8.75 − 3) ÷ 7] × 10 = 19.5 + 8.21 = 27.71."}]}
:::

### Which average when
| Use | When |
|---|---|
| **Mean** | Interval or ratio data, roughly symmetrical; when you will go on to SD, t or ANOVA |
| **Median** | Ordinal data, skewed data, open-ended classes ("60 and above"), or extreme scores |
| **Mode** | Nominal data; the most typical category; a quick rough estimate |

In a **normal** distribution, mean = median = mode. In **positive** skew, mean > median > mode (the mean is pulled toward the tail). In **negative** skew, mean < median < mode. The median always sits between the other two.

:::recall
1. Which average is affected by extreme scores? || The mean.
2. Give the formula for the median from grouped data. || Md = L + [(N/2 − F) ÷ f] × i.
3. In a positively skewed distribution, what is the order of the three averages? || Mean, then median, then mode, from highest to lowest.
4. What is the sum of deviations from the mean? || Always zero.
5. State the empirical relation between the three averages. || Mode = 3 × median − 2 × mean (roughly, for moderate skew).
:::

:::mcq
Q: The most appropriate average for "preferred language of counselling" is the:
- Mean
- *Mode
- Median
- Geometric mean
> Nominal data allow only the mode.

Q: In a distribution, the mean is 40 and the median is 46. The distribution is most likely:
- *Negatively skewed
- Positively skewed
- Normal
- Bimodal
> The mean is pulled below the median toward a tail of low scores.

Q: Using the empirical relation, if the median is 50 and the mean is 52, the mode is about:
- 54
- 51
- 48
- *46
> Mo = 3(50) − 2(52) = 150 − 104 = 46.
:::

## 1.4 Variability: how spread out the scores are [core][starting]
Two colleges can both have a mean score of 60, one with everyone between 55 and 65 and the other ranging from 20 to 100. **Measures of variability (dispersion)** capture this.

### The measures
- **Range** = highest − lowest. Quick, but depends on just two (possibly extreme) scores.
- **Quartile deviation (semi-interquartile range):** Q = (Q3 − Q1) ÷ 2. The interquartile range (IQR) is Q3 − Q1, the spread of the middle 50%. Pairs with the median; resistant to extreme scores.
- **Average (mean) deviation:** AD = Σ|X − M| ÷ N, the mean of absolute deviations. Easy to understand, rarely used in further statistics.
- **Variance:** the mean of the **squared** deviations. Population: σ² = Σ(X − μ)² ÷ N. Sample estimate: s² = Σ(X − M)² ÷ (n − 1).
- **Standard deviation (SD):** the square root of the variance, back in the original units. The most used and most stable measure; pairs with the mean.
- **Coefficient of variation:** CV = (SD ÷ M) × 100. A unit-free measure for comparing variability of different variables or of groups with very different means (ratio data only).

:::note Why n − 1?
A sample's scores sit closer to their own mean than to the population mean, so Σ(X − M)² underestimates the population variance. Dividing by **n − 1** (the **degrees of freedom**: once the mean is fixed, only n − 1 scores are free to vary) corrects this bias. SPSS and most calculators' "s" key use n − 1. For large samples it hardly matters.
:::

:::widget worked
{"title": "Computing a standard deviation by hand", "steps": [{"q": "Five students rate their stress (0 to 10): 4, 8, 6, 5, 7. Find the mean.", "a": "ΣX = 30, n = 5, M = 6."}, {"q": "Find each deviation from the mean.", "a": "4 − 6 = −2; 8 − 6 = 2; 6 − 6 = 0; 5 − 6 = −1; 7 − 6 = 1. They sum to zero, as they always must."}, {"q": "Square and add them (the sum of squares, SS).", "a": "4 + 4 + 0 + 1 + 1 = 10. SS = 10."}, {"q": "Variance and SD, treating these five as the whole population.", "a": "σ² = 10 ÷ 5 = 2; σ = √2 = 1.41."}, {"q": "Variance and SD as a sample estimate of a larger population.", "a": "s² = 10 ÷ (5 − 1) = 2.5; s = √2.5 = 1.58. Inferential statistics use this version."}, {"q": "The same SS by the computational (raw-score) formula, SS = ΣX² − (ΣX)² ÷ n.", "a": "ΣX² = 16 + 64 + 36 + 25 + 49 = 190. (ΣX)² ÷ n = 900 ÷ 5 = 180. SS = 190 − 180 = 10. Same answer, and faster with a calculator."}], "yourTurn": [{"q": "Find the sample SD of 2, 4, 4, 6.", "a": "M = 4. Deviations −2, 0, 0, 2; SS = 4 + 0 + 0 + 4 = 8. s² = 8 ÷ 3 = 2.67; s = 1.63."}]}
:::

:::widget worked
{"title": "Comparing spread with the coefficient of variation", "steps": [{"q": "In a Pune study, exam marks have M = 60, SD = 12, and reaction times have M = 400 ms, SD = 60 ms. Which is more variable?", "a": "You cannot compare 12 marks with 60 milliseconds directly; the units differ."}, {"q": "Compute both CVs.", "a": "Marks: (12 ÷ 60) × 100 = 20%. Reaction time: (60 ÷ 400) × 100 = 15%."}, {"q": "Conclusion?", "a": "Relative to their means, marks are more variable than reaction times."}]}
:::

### Effects of changing every score
- **Add or subtract a constant** to every score: the mean moves by that constant; the SD and variance **do not change**.
- **Multiply or divide** every score by a constant: the mean and the SD are multiplied by it; the variance by its square.
- This is why converting scores to z, T or IQ changes the mean and SD to whatever you choose without changing the shape.

:::recall
1. Which measure of variability pairs with the median? || The quartile deviation (or interquartile range).
2. Write the formula for the sample variance. || s² = Σ(X − M)² ÷ (n − 1).
3. If 5 is added to every score, what happens to the SD? || Nothing; it stays the same.
4. When is the coefficient of variation useful? || To compare variability across variables in different units, or groups with very different means.
5. What are degrees of freedom, in plain words? || The number of values free to vary once a statistic (like the mean) is fixed.
:::

:::mcq
Q: The middle 50% of scores lie between 25 and 45. The quartile deviation is:
- 20
- 35
- *10
- 5
> Q = (Q3 − Q1) ÷ 2 = (45 − 25) ÷ 2 = 10.

Q: Every score in a set is multiplied by 3. The variance:
- Stays the same
- Is multiplied by 3
- Is divided by 3
- *Is multiplied by 9
> The SD is multiplied by 3, so the variance by 3² = 9.

Q: The measure of variability most affected by a single extreme score is the:
- Quartile deviation
- Standard deviation
- *Range
- Interquartile range
> It is based only on the two most extreme scores.
:::

## 1.5 Level check · Starting [core][starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. Keep paper and a calculator ready.

:::mcq
Q: A value that describes a whole population is a:
- Statistic
- Variable
- *Parameter
- Frequency
> Parameters describe populations; statistics describe samples.

Q: Which is a continuous variable?
- Number of siblings
- Religion
- *Reaction time
- Blood group
> It can take any value in a range.

Q: The mean of 2, 4, 6, 8, 10 is:
- 5
- *6
- 7
- 30
> 30 ÷ 5 = 6.

Q: The median of 7, 3, 9, 1, 5, 11 is:
- 5
- 7
- *6
- 9
> In order: 1, 3, 5, 7, 9, 11. The two middle scores are 5 and 7; their average is 6.

Q: For data with a few very extreme scores, the best average is the:
- *Median
- Mean
- Mode
- Range
> The median is resistant to extreme scores.

Q: In a positively skewed distribution:
- Mean = median = mode
- The mode is greater than the mean
- The median is greater than the mean
- *The mean is greater than the median
> The tail of high scores pulls the mean up.

Q: The midpoint of the class 40–44 is:
- 40
- *42
- 44
- 41.5
> (40 + 44) ÷ 2 = 42.

Q: The exact limits of the class 40–44 are:
- 40–44
- 40.5–43.5
- *39.5–44.5
- 39–45
> Half a unit below and above the stated limits.

Q: The SD of a set of scores that are all equal to 7 is:
- 7
- 1
- 49
- *0
> No score differs from the mean.

Q: A sample has SS = 36 and n = 10. The sample variance is:
- 3.6
- *4
- 6
- 2
> s² = 36 ÷ (10 − 1) = 4.

Q: Ten points are added to every student's score. The standard deviation:
- Increases by 10
- Doubles
- *Does not change
- Decreases by 10
> Adding a constant shifts the scores without changing their spread.

Q: Bars that touch each other are used in a:
- Bar chart
- Pie chart
- Line graph
- *Histogram
> A histogram shows continuous data.

Q: The sum of deviations of scores from their mean is:
- The variance
- The SD
- N
- *Zero
> Positive and negative deviations cancel.

Q: For ordinal data, the most suitable measure of variability is the:
- Standard deviation
- Variance
- *Quartile deviation
- Coefficient of variation
> It pairs with the median.

Q: Group A: M = 50, SD = 5. Group B: M = 100, SD = 8. Which is relatively more variable?
- *Group A (CV 10% against 8%)
- Group B, because its SD is bigger
- They are equally variable
- It cannot be judged at all
> CV A = 5 ÷ 50 = 10%; CV B = 8 ÷ 100 = 8%.
:::

# Part II · Beginner: the normal curve, inference and the first tests

## 2.1 The normal curve and standard scores [core][beginner]
Many psychological measures, when collected from large groups, form a **normal (Gaussian) distribution**: the bell curve. It matters because many test norms are built on it and many statistical tests assume it.

### Properties of the normal curve
- Symmetrical and bell-shaped; **mean = median = mode**.
- **Asymptotic:** the tails approach but never touch the baseline.
- Defined completely by its mean and SD.
- Fixed areas: about **68.26%** of cases lie within 1 SD of the mean, **95.44%** within 2 SD, and **99.72%** within 3 SD. Also: 95% lie within **±1.96 SD** and 99% within **±2.58 SD**. The points of inflection are at ±1 SD.
- Kurtosis is **mesokurtic**.

### Skewness and kurtosis
- **Skewness** is asymmetry. Pearson's coefficient: Sk = 3(M − Md) ÷ SD. Positive values mean a right tail; negative, a left tail; zero, symmetry.
- **Kurtosis** is peakedness or tail weight. **Leptokurtic**: tall, narrow peak with heavy tails. **Platykurtic**: flat. **Mesokurtic**: normal. The percentile coefficient Ku = Q ÷ (P90 − P10) is about **0.263** for a normal curve: higher means platykurtic, lower means leptokurtic. (Software reports "excess kurtosis", where normal = 0.)

### Standard scores
A **z score** tells you how many SDs a score lies above or below the mean: **z = (X − M) ÷ SD**. z scores have a mean of 0 and an SD of 1, so scores from different tests can be compared. Other standard scores are just z rescaled to avoid negatives and decimals:

| Score | Mean | SD | Formula |
|---|---|---|---|
| z | 0 | 1 | (X − M) ÷ SD |
| **T score** | 50 | 10 | 50 + 10z (MMPI, many personality scales) |
| **Deviation IQ** | 100 | 15 | 100 + 15z (Wechsler, Stanford-Binet 5) |
| **Stanine** ("standard nine") | 5 | 2 | 2z + 5, rounded, limited to 1 to 9 |
| **Sten** ("standard ten") | 5.5 | 2 | 2z + 5.5, rounded, 1 to 10 (16PF) |
| CEEB score | 500 | 100 | 500 + 100z (GRE-style) |

Stanines divide a normal distribution into nine bands holding about **4, 7, 12, 17, 20, 17, 12, 7 and 4%** of cases.

A **percentile rank** is the percentage of cases at or below a score. Percentiles are easy to explain to parents and patients but are **ordinal**: the gap between the 50th and 60th percentile is far smaller in raw-score terms than between the 90th and 99th.

:::widget guess
{"prompt": "On a Wechsler IQ scale (mean 100, SD 15), what percentage of people score between 85 and 115?", "min": 0, "max": 100, "unit": "%", "answer": [66, 70], "reveal": "About 68%: within one SD either side of the mean. Only about 2.3% score above 130 (two SDs up), and about 2.3% below 70."}
:::

:::widget worked
{"title": "z scores, T scores and percentiles", "steps": [{"q": "Meera scores 65 on a reasoning test with mean 50 and SD 10. Find her z score.", "a": "z = (65 − 50) ÷ 10 = 1.5. She is one and a half SDs above the mean."}, {"q": "Convert to a T score, a deviation IQ-style score and a stanine.", "a": "T = 50 + 10(1.5) = 65. IQ-style = 100 + 15(1.5) = 122.5. Stanine = 2(1.5) + 5 = 8."}, {"q": "What percentage of the norm group scored below her? (Table area from the mean to z = 1.50 is .4332.)", "a": "Below the mean: 50%. Between the mean and her score: 43.32%. Total 93.32%, so about the 93rd percentile."}, {"q": "Rahul scored 42 on the same test. Find his z and percentile. (Area from the mean to z = 0.80 is .2881.)", "a": "z = (42 − 50) ÷ 10 = −0.8. Below the mean, so the area below him is 50 − 28.81 = 21.19%: about the 21st percentile. T = 42."}, {"q": "Asha gets 70 in maths (M 60, SD 5) and 80 in English (M 75, SD 10). In which subject did she do better compared with her class?", "a": "Maths z = (70 − 60) ÷ 5 = 2.0; English z = (80 − 75) ÷ 10 = 0.5. She did much better in maths, though her raw English mark is higher."}], "yourTurn": [{"q": "What raw score on the reasoning test (M 50, SD 10) marks the top 2.5% of people?", "a": "The top 2.5% starts at z = 1.96. X = M + z × SD = 50 + 1.96 × 10 = 69.6."}]}
:::

### Reading a z table
Tables give the **area between the mean and z** (some give the area below z). Remember: half the curve (50%) lies on each side. To find the area **between** two z scores on the same side, subtract their table areas; on opposite sides, add them.

| z | Area mean to z | Percentile |
|---|---|---|
| 0.00 | .0000 | 50 |
| 0.50 | .1915 | 69 |
| 1.00 | .3413 | 84 |
| 1.50 | .4332 | 93 |
| 1.645 | .4500 | 95 |
| 1.96 | .4750 | 97.5 |
| 2.00 | .4772 | 98 |
| 2.58 | .4951 | 99.5 |
| 3.00 | .4987 | 99.9 |

:::recall
1. What percentage of cases lies within one, two and three SDs of the mean? || About 68.26%, 95.44% and 99.72%.
2. Give the mean and SD of z, T, deviation IQ, stanine and sten. || z 0 and 1; T 50 and 10; IQ 100 and 15; stanine 5 and 2; sten 5.5 and 2.
3. Write the z score formula. || z = (X − M) ÷ SD.
4. Why are percentile ranks ordinal? || Equal percentile gaps do not correspond to equal raw-score gaps; near the middle they are close together, in the tails far apart.
5. What value of Ku indicates a normal curve? || About 0.263.
:::

:::mcq
Q: A T score of 30 corresponds to a z score of:
- −1
- −3
- *−2
- 3
> T = 50 + 10z, so 30 = 50 + 10z and z = −2.

Q: A deviation IQ of 130 is at about which percentile?
- *98th
- 84th
- 93rd
- 99.9th
> 130 is z = 2; about 97.7% of cases fall below it.

Q: A distribution with a tall, narrow peak and heavy tails is:
- Platykurtic
- Mesokurtic
- *Leptokurtic
- Negatively skewed
> "Lepto" means slender.

Q: Stanine 5 contains about what percentage of a normal group?
- 4%
- 12%
- 17%
- *20%
> The middle band is the largest.
:::

## 2.2 Probability, sampling distributions and confidence intervals [core][beginner]
### Probability in brief
- Probability runs from 0 (impossible) to 1 (certain): p(event) = favourable outcomes ÷ all equally likely outcomes.
- **Addition rule** for mutually exclusive events: p(A or B) = p(A) + p(B). The chance of rolling a 1 or a 6 is 1/6 + 1/6 = 1/3.
- **Multiplication rule** for independent events: p(A and B) = p(A) × p(B). Two heads in two tosses: 1/2 × 1/2 = 1/4.
- **Binomial** situations (two outcomes, fixed number of trials): the number of correct guesses in 20 true–false items follows a binomial distribution. With many trials it approaches the normal curve.

### The sampling distribution and the standard error
Imagine drawing thousands of samples of 100 students and computing each sample's mean. Those means form the **sampling distribution of the mean**. Three facts (the **central limit theorem**):
1. Its mean equals the population mean μ.
2. Its SD, called the **standard error of the mean (SE)**, is **σ ÷ √n** (estimated by s ÷ √n).
3. It is approximately normal for samples of about 30 or more, **even when the population is not normal**.

The standard error measures how much sample means bounce around by chance. **Bigger samples give smaller standard errors**: to halve the SE, you need four times the sample.

:::widget guess
{"prompt": "A survey with 100 people gives a standard error of 2 points. If the team surveys 400 people instead (same SD), what will the standard error be?", "min": 0, "max": 4, "step": 0.5, "unit": "points", "answer": [1, 1], "reveal": "1 point. SE = SD ÷ √n, so multiplying n by 4 multiplies √n by 2 and halves the SE. Precision rises with the square root of the sample size, which is why each extra gain in precision costs more."}
:::

### Confidence intervals
A **confidence interval (CI)** gives a range of plausible values for the population parameter. For a mean with a large sample:
- 95% CI = M ± 1.96 × SE
- 99% CI = M ± 2.58 × SE
(For small samples, replace 1.96 with the t value for n − 1 df.)

The 95% means: **if we repeated the study many times, 95% of the intervals built this way would contain the true mean.** A wider interval (99%) is more confident but less precise.

:::widget worked
{"title": "Building a confidence interval", "steps": [{"q": "A well-being scale given to 100 nursing students in Kochi gives M = 72, SD = 12. Find the standard error.", "a": "SE = 12 ÷ √100 = 12 ÷ 10 = 1.2."}, {"q": "Build the 95% confidence interval.", "a": "72 ± 1.96 × 1.2 = 72 ± 2.35, so 69.65 to 74.35."}, {"q": "Build the 99% interval.", "a": "72 ± 2.58 × 1.2 = 72 ± 3.10, so 68.90 to 75.10. More confidence, wider range."}, {"q": "The state average on the scale is 68. What can you say?", "a": "68 lies outside both intervals, so these students' mean is significantly above 68 at the .05 and .01 levels (a two-tailed one-sample test would agree)."}], "yourTurn": [{"q": "With n = 400 and the same SD of 12 and mean 72, what is the 95% CI?", "a": "SE = 12 ÷ 20 = 0.6. CI = 72 ± 1.18, so 70.82 to 73.18: four times the sample halves the width."}]}
:::

:::trap What a 95% CI is not
It is **not** "a 95% probability that the true mean lies in this particular interval" in the strict frequentist sense; the true mean either is or is not in it. It is a statement about the method's long-run success. And a CI is about the **mean**, not about where 95% of individual scores lie.
:::

:::recall
1. What is the standard error of the mean, and its formula? || The SD of the sampling distribution of means; SE = SD ÷ √n.
2. State the three points of the central limit theorem. || The mean of sample means equals μ; their SD is σ ÷ √n; their distribution is approximately normal for large samples whatever the population shape.
3. Give the formula for a 95% CI for a mean (large sample). || M ± 1.96 × SE.
4. How must n change to halve the standard error? || It must be multiplied by four.
:::

:::mcq
Q: SD = 20 and n = 25. The standard error of the mean is:
- *4
- 0.8
- 5
- 20
> 20 ÷ √25 = 20 ÷ 5 = 4.

Q: Which change makes a confidence interval narrower?
- Moving from 95% to 99% confidence
- A larger SD
- A smaller sample
- *A larger sample
> SE falls as n rises.

Q: The probability of rolling two sixes with two dice is:
- 1/6
- 1/12
- 2/6
- *1/36
> 1/6 × 1/6 for independent events.
:::

## 2.3 The logic of hypothesis testing [core][beginner]
### The steps
1. State the **null hypothesis (H0)**: no difference or no relation in the population. State the **alternative (H1)**.
2. Choose the **significance level (α)**, usually .05 (or .01), **before** seeing the data.
3. Choose the test and compute the **test statistic** (z, t, F, χ²) from the data.
4. Find the **p value** (or compare the statistic with the **critical value** for your df and α).
5. Decide: if p is at or below α, **reject H0** ("statistically significant"); otherwise **fail to reject H0**.
6. Report the effect size and confidence interval, and interpret in plain words.

### What p means, exactly
**p is the probability of getting results at least as extreme as yours if the null hypothesis were true.** That is all.
- p is **not** the probability that the null is true.
- 1 − p is **not** the probability that the result will replicate.
- A small p does **not** mean a large or important effect: with 10,000 people, a trivial difference is "significant".
- A non-significant p does **not** prove no effect.

### Errors in decisions
| | H0 is really true | H0 is really false |
|---|---|---|
| **Reject H0** | **Type I error** (false positive); probability = α | Correct decision; probability = **power** (1 − β) |
| **Fail to reject H0** | Correct decision; probability = 1 − α | **Type II error** (false negative); probability = β |

- Lowering α (from .05 to .01) **reduces Type I errors** but **raises Type II errors** (lowers power), other things equal.
- **Power** is the probability of detecting an effect that is really there. Conventionally we want at least 0.80. It rises with a **larger sample, larger effect size, larger α, a one-tailed test (in the right direction), less variability and more reliable measures**.

:::mnemonic Type I and Type II
Think of a court. H0 = "the accused is innocent". **Type I** = convicting an innocent person (crying wolf). **Type II** = letting a guilty person go (missing the wolf). The first is the "I"nnocent convicted.
:::

### One-tailed and two-tailed tests
- A **two-tailed** test splits α between both ends of the distribution (2.5% each for α = .05). Critical z = ±1.96.
- A **one-tailed** test puts all of α in the predicted tail. Critical z = 1.645. It has more power **in that direction** but cannot detect an effect in the other direction. Use it only when the direction was predicted on strong grounds **before** the data, and an effect in the other direction would be treated like no effect.

:::widget decide
{"scene": "A researcher in Jaipur tests a memory app on 40 students. The result is t(38) = 1.80. She had planned a two-tailed test at .05 (critical value 2.02). She notices that a one-tailed test (critical value 1.69) would be significant.", "ask": "What should she do?", "choices": [{"label": "Report the one-tailed result as significant, since the app was expected to help.", "verdict": "harm", "outcome": "Reviewers spot the switch; the claim is withdrawn.", "why": "Changing the test after seeing the data inflates the Type I error rate. It is a form of p-hacking."}, {"label": "Report the planned two-tailed test as not significant, give the effect size and confidence interval, and note the study may have been underpowered.", "verdict": "best", "outcome": "The honest report shows a possible small effect worth testing in a larger, preregistered study.", "why": "Analyses must follow the plan. Effect sizes and CIs show what the data can and cannot say."}, {"label": "Add 10 more students and test again, repeating until it is significant.", "verdict": "harm", "outcome": "The eventual p value is meaningless.", "why": "Optional stopping inflates false positives far above 5%."}]}
:::

### Degrees of freedom and critical values
Each test's statistic is compared with a distribution that depends on **degrees of freedom (df)**. Two-tailed critical values of t at α = .05:

| df | 1 | 2 | 3 | 4 | 5 | 8 | 10 | 20 | 30 | 60 | ∞ |
|---|---|---|---|---|---|---|---|---|---|---|---|
| t | 12.71 | 4.30 | 3.18 | 2.78 | 2.57 | 2.31 | 2.23 | 2.09 | 2.04 | 2.00 | 1.96 |

As df grows, t approaches z (1.96).

:::recall
1. Define the p value in one sentence. || The probability of results at least as extreme as those observed if the null hypothesis were true.
2. What is a Type I error and its probability? || Rejecting a true null (false positive); probability α.
3. What is power, and its conventional target? || The probability of rejecting a false null (1 − β); usually at least .80.
4. Name five things that increase power. || Larger n, larger effect, larger α, a one-tailed test in the right direction, less error variance (reliable measures, within-subjects designs).
5. Critical z for a two-tailed and a one-tailed test at α = .05? || 1.96 and 1.645.
:::

:::mcq
Q: A drug that does not work is declared effective. This is a:
- Type II error
- *Type I error
- Correct decision
- Power failure
> Rejecting a true null hypothesis.

Q: p = .03 means:
- *If H0 were true, results this extreme would occur about 3% of the time
- There is a 3% chance that the null hypothesis is actually true
- There is a 97% chance that the result will replicate in a new study
- The effect is large enough to matter in practice
> p is conditional on the null being true.

Q: Moving α from .05 to .01, with all else the same, will:
- Increase power, because the test becomes stricter
- Change Type I errors but have no effect on Type II errors
- Increase the rate of Type I errors
- *Decrease power and increase the Type II error rate
> Stricter alpha means fewer false positives but more misses.
:::

## 2.4 Correlation [core][beginner]
A **correlation coefficient** describes the **strength and direction of a linear relation** between two variables. It runs from −1 (perfect negative) through 0 (no linear relation) to +1 (perfect positive).

### Pearson's product-moment correlation (r)
For two interval or ratio variables. Computational formula:

r = [nΣXY − (ΣX)(ΣY)] ÷ √{[nΣX² − (ΣX)²] × [nΣY² − (ΣY)²]}

Conceptually, r is the average product of paired z scores: r = Σ(zX × zY) ÷ n.

:::widget worked
{"title": "Pearson's r by hand", "steps": [{"q": "Five students in Indore report weekly study hours (X) and test marks (Y): (2, 50), (4, 60), (5, 70), (6, 65), (8, 85). Find ΣX, ΣY, ΣXY, ΣX² and ΣY².", "a": "ΣX = 25; ΣY = 330; ΣXY = 100 + 240 + 350 + 390 + 680 = 1,760; ΣX² = 4 + 16 + 25 + 36 + 64 = 145; ΣY² = 2,500 + 3,600 + 4,900 + 4,225 + 7,225 = 22,450."}, {"q": "Compute the numerator, nΣXY − (ΣX)(ΣY).", "a": "5 × 1,760 − 25 × 330 = 8,800 − 8,250 = 550."}, {"q": "Compute the two bracket terms in the denominator.", "a": "nΣX² − (ΣX)² = 725 − 625 = 100. nΣY² − (ΣY)² = 112,250 − 108,900 = 3,350."}, {"q": "Compute r.", "a": "r = 550 ÷ √(100 × 3,350) = 550 ÷ √335,000 = 550 ÷ 578.8 = .95."}, {"q": "Is it significant, and how much variance is shared? (Critical r for df = n − 2 = 3, two-tailed .05, is .878.)", "a": ".95 is above .878, so it is significant at .05. r² = .90: 90% of the variance in marks is shared with study hours in this tiny sample. (Five people is far too few for real research.)"}], "yourTurn": [{"q": "If r = .40 between sleep quality and mood in 200 students, what proportion of variance in mood is shared with sleep quality? Does r = .40 mean 40% of mood is explained?", "a": "r² = .16, so 16% shared variance. No: r itself is not a percentage. And shared variance is not proof that sleep causes mood."}]}
:::

### Interpreting r
- **Size:** Cohen's rough guide: .10 small, .30 medium, .50 large. Context matters: in psychotherapy research, .30 can be important.
- **r² (coefficient of determination):** the proportion of variance shared. The rest, 1 − r², is the **coefficient of non-determination**; its square root, k = √(1 − r²), is the **coefficient of alienation**.
- **Significance:** tested with df = n − 2. With large samples, tiny correlations are significant.
- **Correlation is not causation** (directionality and third variables).

### What distorts r
- **Non-linearity:** a perfect U-shaped relation (arousal and performance, the Yerkes-Dodson pattern) can give r near 0. Always look at the scatter plot. Use **eta (the correlation ratio)** for curvilinear relations.
- **Restriction of range:** correlating entrance scores with later grades only among admitted students lowers r, because the low scorers are missing.
- **Outliers** can create or destroy a correlation.
- **Combining groups** with different means can create a misleading correlation (or hide one).
- **Unreliable measures** lower (attenuate) r.

### Spearman's rank-order correlation (rho)
For ordinal data, or when interval data are skewed or have outliers. Rank each variable, find the differences d, then:

ρ = 1 − (6Σd²) ÷ [n(n² − 1)]

Tied ranks get the average of the ranks they occupy.

:::widget worked
{"title": "Spearman's rho by hand", "steps": [{"q": "Two interviewers at a Hyderabad clinic score six trainees: Interviewer A: 85, 70, 90, 60, 75, 80. Interviewer B: 78, 65, 88, 70, 60, 82. Rank each set (1 = highest).", "a": "A ranks: 2, 5, 1, 6, 4, 3. B ranks: 3, 5, 1, 4, 6, 2."}, {"q": "Find each d (A rank − B rank) and Σd².", "a": "d = −1, 0, 0, 2, −2, 1. d² = 1, 0, 0, 4, 4, 1. Σd² = 10."}, {"q": "Compute rho.", "a": "ρ = 1 − (6 × 10) ÷ [6 × (36 − 1)] = 1 − 60 ÷ 210 = 1 − .286 = .71."}, {"q": "With n = 6 the two-tailed critical value at .05 is .886. Conclusion?", "a": ".71 is a strong positive agreement in this sample, but it does not reach significance with only six trainees. Small n, low power."}]}
:::

### The special correlations
| Coefficient | Variable 1 | Variable 2 | Example |
|---|---|---|---|
| **Pearson r** | Continuous | Continuous | Anxiety and depression scores |
| **Spearman ρ** | Ranks | Ranks | Two judges' rankings |
| **Kendall's τ (tau)** | Ranks | Ranks | Small samples, many ties |
| **Point-biserial (r_pb)** | **True** dichotomy | Continuous | Gender and anxiety score; item right or wrong and total score |
| **Biserial (r_b)** | **Artificial** dichotomy (a continuous variable cut in two) | Continuous | Pass or fail (from marks) and IQ |
| **Phi (φ)** | True dichotomy | True dichotomy | Gender and smoker or non-smoker (from a 2 × 2 table) |
| **Tetrachoric (r_t)** | Artificial dichotomy | Artificial dichotomy | Above or below median on two tests |
| **Contingency coefficient (C)** | Nominal, several categories | Nominal, several categories | Religion and preferred therapy |
| **Eta (η)** | Categories or continuous | Continuous | Curvilinear relations |

:::mnemonic Biserial or point-biserial?
**Point** = a real, natural point split (male or female, alive or dead). **Biserial** = a "made" split of something that is really continuous (pass or fail). Same logic for **phi** (both real) versus **tetrachoric** (both made).
:::

### Partial, part and multiple correlation
- **Partial correlation (r12.3):** the correlation between variables 1 and 2 with variable 3 **held constant (removed from both)**. r12.3 = (r12 − r13 × r23) ÷ √[(1 − r13²)(1 − r23²)].
- **Part (semi-partial) correlation:** variable 3 is removed from only **one** of the two. It is used in regression to show a predictor's unique contribution.
- **Multiple correlation (R):** the correlation between one variable and the best combination of two or more others; R² is the variance explained in regression.

:::widget worked
{"title": "A partial correlation", "steps": [{"q": "In 300 students: social-media hours and anxiety r12 = .50; social-media hours and loneliness r13 = .60; anxiety and loneliness r23 = .70. Does social media relate to anxiety once loneliness is held constant?", "a": "Use r12.3 = (r12 − r13 × r23) ÷ √[(1 − r13²)(1 − r23²)]."}, {"q": "Numerator.", "a": ".50 − (.60 × .70) = .50 − .42 = .08."}, {"q": "Denominator.", "a": "√[(1 − .36)(1 − .49)] = √(.64 × .51) = √.3264 = .571."}, {"q": "Result and meaning.", "a": "r12.3 = .08 ÷ .571 = .14. Most of the link between social media and anxiety runs together with loneliness. Holding loneliness constant leaves only a small relation."}]}
:::

:::widget sort
{"prompt": "Which correlation coefficient fits each pair?", "buckets": ["Point-biserial", "Biserial", "Phi", "Spearman or Kendall"], "items": [{"text": "Gender (male, female) and score on a stigma scale", "bucket": 0}, {"text": "Passed or failed the entrance (from marks) and hours of preparation", "bucket": 1, "why": "Pass or fail is an artificial split of continuous marks."}, {"text": "Gender and whether the person has ever used counselling (yes or no)", "bucket": 2}, {"text": "Ranks given by two coaches to 8 cricketers", "bucket": 3}, {"text": "Item answered right or wrong and total test score (item analysis)", "bucket": 0, "why": "Right or wrong is a true dichotomy at the item level, so item–total correlations are point-biserial."}, {"text": "Class rank and rank in a debate competition", "bucket": 3}]}
:::

:::recall
1. What does r² tell you? || The proportion of variance the two variables share.
2. Write the formula for Spearman's rho. || ρ = 1 − 6Σd² ÷ [n(n² − 1)].
3. Point-biserial versus biserial. || Point-biserial: one true dichotomy. Biserial: one artificial dichotomy of a continuous variable.
4. Which correlation for two true dichotomies? Two artificial ones? || Phi; tetrachoric.
5. Name four things that distort Pearson's r. || Non-linearity, restriction of range, outliers, combining different groups (also unreliable measures).
6. Partial versus part correlation. || Partial removes the third variable from both variables; part removes it from only one.
:::

:::mcq
Q: The correlation between an IQ test and job performance is computed only among employees who were hired because of high IQ. The r will probably be:
- Inflated by restriction of range
- *Lowered by restriction of range
- Unchanged
- Exactly zero
> Restricting the range of one variable usually lowers r.

Q: r = −.80 between hours of sleep loss and attention score means:
- *A strong relation where more sleep loss goes with lower attention
- A weak relation, because the sign is negative
- 80% of the variation in attention is caused by sleep loss
- No relation, since negative values mean none
> The sign shows direction; the size shows strength. r² = .64 is shared variance, not causation.

Q: To correlate two variables that were each split at the median into high and low, use:
- Phi
- Point-biserial
- *Tetrachoric
- Kendall's tau
> Both are artificial dichotomies.

Q: Arousal and performance show an inverted-U relation. Pearson's r is likely to be:
- Close to +1, because the relation is strong
- Close to −1, because performance falls at the end
- *Close to zero, despite a strong relation
- Undefined
> r detects only linear relations; use eta and a scatter plot.
:::

## 2.5 t-tests [core][beginner]
t-tests compare **two means** (or one mean with a known value) when the population SD is unknown, as it nearly always is.

### The three kinds
| Test | Question | df | Example |
|---|---|---|---|
| **One-sample t** | Does a sample mean differ from a known value? | n − 1 | Do these patients' IQs differ from 100? |
| **Independent-samples t** | Do two separate groups differ? | n1 + n2 − 2 | CBT group versus waiting list |
| **Paired (dependent, related) t** | Do two related sets of scores differ? | n − 1 (n pairs) | Before versus after therapy; matched pairs; twins |

### Assumptions
1. The DV is interval or ratio.
2. Scores are independent (within each group for the independent test).
3. The population is roughly normal (t is robust to this with moderate n, especially if group sizes are equal).
4. For the independent test, **homogeneity of variance**: the two populations have similar variances. Checked with **Levene's test**. If violated, use **Welch's t**, which adjusts the df (SPSS prints both rows).

### Formulas
- One-sample: t = (M − μ) ÷ (s ÷ √n).
- Independent, equal n or pooled: s²pooled = (SS1 + SS2) ÷ (n1 + n2 − 2); SE of the difference = √[s²pooled (1/n1 + 1/n2)]; t = (M1 − M2) ÷ SE.
- Paired: compute each difference D, then t = MD ÷ (sD ÷ √n).

:::widget worked
{"title": "Independent-samples t by hand", "steps": [{"q": "Ten students are randomly assigned: five learn a word list with a memory technique (recall 14, 12, 16, 15, 13) and five without (10, 11, 9, 13, 12). Find both means.", "a": "Technique: ΣX = 70, M1 = 14. Control: ΣX = 55, M2 = 11."}, {"q": "Find each group's sum of squares.", "a": "Technique deviations: 0, −2, 2, 1, −1; SS1 = 0 + 4 + 4 + 1 + 1 = 10. Control deviations: −1, 0, −2, 2, 1; SS2 = 1 + 0 + 4 + 4 + 1 = 10."}, {"q": "Pooled variance and the standard error of the difference.", "a": "s²pooled = (10 + 10) ÷ (5 + 5 − 2) = 20 ÷ 8 = 2.5. SE = √[2.5 × (1/5 + 1/5)] = √(2.5 × 0.4) = √1 = 1.0."}, {"q": "Compute t and the df.", "a": "t = (14 − 11) ÷ 1.0 = 3.0; df = 8."}, {"q": "Decide, and give the effect size. (Critical t for df 8, two-tailed .05, is 2.31.)", "a": "3.0 is beyond 2.31, so reject H0: the technique group recalled significantly more. Cohen's d = (M1 − M2) ÷ s pooled = 3 ÷ √2.5 = 3 ÷ 1.58 = 1.90, a very large effect. APA: t(8) = 3.00, p = .017, d = 1.90."}]}
:::

:::widget worked
{"title": "Paired t by hand", "steps": [{"q": "Six clients at a Bengaluru clinic rate anxiety before and after four sessions of relaxation training. Before: 20, 18, 25, 22, 17, 24. After: 15, 16, 19, 20, 14, 18. Find each difference (before − after).", "a": "D = 5, 2, 6, 2, 3, 6. ΣD = 24; MD = 4."}, {"q": "Find the SD of the differences.", "a": "Deviations from 4: 1, −2, 2, −2, −1, 2. Squares: 1, 4, 4, 4, 1, 4; SS = 18. sD = √(18 ÷ 5) = √3.6 = 1.90."}, {"q": "Standard error and t.", "a": "SE = 1.90 ÷ √6 = 1.90 ÷ 2.45 = 0.775. t = 4 ÷ 0.775 = 5.16, df = 5."}, {"q": "Decide. (Critical t for df 5, two-tailed .05, is 2.57.)", "a": "5.16 exceeds 2.57: anxiety fell significantly. But with no control group, history, regression and expectancy could explain the drop: a significant paired t is not proof the training caused it."}], "yourTurn": [{"q": "Why would analysing the before and after scores above with an independent t be wrong, and what would happen to the result?", "a": "The scores are not independent: the same people give both. The independent test leaves the large person-to-person differences in the error term, inflating the SE and usually shrinking t. The paired test removes them by working with differences."}]}
:::

:::recall
1. Name the three kinds of t-test and the df for each. || One-sample (n − 1), independent (n1 + n2 − 2), paired (n − 1, where n is the number of pairs).
2. What does Levene's test check, and what if it is significant? || Equality of variances; if significant, use Welch's t (the 'equal variances not assumed' row).
3. Why is the paired t more powerful than the independent t for the same people? || It removes individual differences from the error term.
4. Give the formula for Cohen's d for two independent groups. || d = (M1 − M2) ÷ pooled SD.
:::

:::mcq
Q: The scores of 20 husbands are compared with those of their own wives. The right test is:
- Independent-samples t
- *Paired t
- One-sample t
- Chi-square
> Matched pairs: each score has a natural partner.

Q: An independent t-test with groups of 15 and 17 has df of:
- 32
- 31
- 16
- *30
> n1 + n2 − 2 = 30.

Q: Levene's test gives p = .01. You should:
- Switch to the paired t-test instead
- *Read the 'equal variances not assumed' (Welch) row
- Abandon the analysis and collect new data
- Use a one-tailed test
> Variances differ, so use the corrected test.
:::

## 2.6 Chi-square [core][beginner]
**Chi-square (χ²)** tests are for **frequencies (counts) in categories**: nominal data. They compare **observed frequencies (O)** with the **expected frequencies (E)** you would get if H0 were true.

χ² = Σ[(O − E)² ÷ E]

### Two uses
1. **Goodness of fit (one variable):** do the frequencies fit an expected pattern (equal, or some theoretical proportions)? df = k − 1, where k is the number of categories.
2. **Test of independence (two variables, a contingency table):** are the two variables related? E for each cell = (row total × column total) ÷ N. df = (rows − 1) × (columns − 1).

:::widget worked
{"title": "Chi-square goodness of fit", "steps": [{"q": "Sixty students choose a counselling format: in person 30, online 18, group 12. Test whether the three are equally preferred. What are the expected frequencies?", "a": "If equally preferred, E = 60 ÷ 3 = 20 for each."}, {"q": "Compute χ².", "a": "(30 − 20)² ÷ 20 + (18 − 20)² ÷ 20 + (12 − 20)² ÷ 20 = 100/20 + 4/20 + 64/20 = 5 + 0.2 + 3.2 = 8.4."}, {"q": "df and decision. (Critical χ² for df 2 at .05 is 5.99.)", "a": "df = 3 − 1 = 2. 8.4 exceeds 5.99: preferences are not equal; in-person sessions are preferred."}]}
:::

:::widget worked
{"title": "Chi-square test of independence (2 × 2)", "steps": [{"q": "Among 100 students in Guwahati: 50 women (30 sought help for distress, 20 did not) and 50 men (15 sought help, 35 did not). Find the row and column totals.", "a": "Rows: women 50, men 50. Columns: sought help 45, did not 55. N = 100."}, {"q": "Compute the four expected frequencies.", "a": "Women, sought: 50 × 45 ÷ 100 = 22.5. Women, not: 50 × 55 ÷ 100 = 27.5. Men, sought: 22.5. Men, not: 27.5."}, {"q": "Compute each (O − E)² ÷ E and sum.", "a": "(30 − 22.5)² ÷ 22.5 = 56.25 ÷ 22.5 = 2.50. (20 − 27.5)² ÷ 27.5 = 2.05. (15 − 22.5)² ÷ 22.5 = 2.50. (35 − 27.5)² ÷ 27.5 = 2.05. χ² = 9.09."}, {"q": "df, decision and effect size. (Critical χ² for df 1 at .05 is 3.84.)", "a": "df = (2 − 1)(2 − 1) = 1. 9.09 exceeds 3.84: help-seeking is related to gender. Effect size phi = √(χ² ÷ N) = √(9.09 ÷ 100) = .30, a medium association. APA: χ²(1, N = 100) = 9.09, p = .003, φ = .30."}], "yourTurn": [{"q": "In a 3 × 4 table, what are the df? And what effect size would you report instead of phi?", "a": "df = (3 − 1)(4 − 1) = 6. For tables bigger than 2 × 2, report Cramér's V = √[χ² ÷ (N × (k − 1))], where k is the smaller of the number of rows and columns."}]}
:::

### Assumptions and cautions
- Observations are **independent**: each person counts **once**, in one cell.
- Use **frequencies**, never percentages or means.
- **Expected** frequencies should be **at least 5** in most cells (a common rule: no cell below 1, and no more than 20% of cells below 5). For small 2 × 2 tables use **Fisher's exact test**; **Yates' correction for continuity** was used for 2 × 2 tables with df 1 but is now thought too conservative.
- For **related** (before–after) dichotomous data on the same people, use **McNemar's test**, not ordinary chi-square.
- Chi-square tells you **whether** there is an association, not its direction or cause; inspect the cells (or standardised residuals) to see where the difference lies.

:::recall
1. Give the chi-square formula. || χ² = Σ[(O − E)² ÷ E].
2. How do you compute an expected frequency in a contingency table? || Row total × column total ÷ N.
3. df for a goodness-of-fit test and for a test of independence? || k − 1; (rows − 1)(columns − 1).
4. What is the usual rule about expected frequencies? || They should be at least 5 in most cells; otherwise combine categories or use Fisher's exact test.
5. Which test for before–after yes/no data on the same people? || McNemar's test.
:::

:::mcq
Q: Chi-square is the right test when the data are:
- Means of two groups
- Ranks of two judges
- *Frequencies in categories
- Paired difference scores
> It compares observed with expected counts.

Q: A 2 × 3 contingency table has df of:
- *2
- 6
- 5
- 1
> (2 − 1)(3 − 1) = 2.

Q: In a 2 × 2 table, row 1 total = 40, column 1 total = 30, N = 120. The expected frequency for cell (1, 1) is:
- 30
- 12
- 40
- *10
> 40 × 30 ÷ 120 = 10.
:::

## 2.7 Level check · Beginner [core][beginner]
Twelve or more right out of fifteen (80%) opens the Advanced level. A calculator is allowed.

:::mcq
Q: A score of 58 on a test with M = 50, SD = 4 has a z score of:
- 0.5
- 1
- 8
- *2
> (58 − 50) ÷ 4 = 2.

Q: A z score of −1 is at about which percentile?
- 34th
- 2nd
- *16th
- 50th
> 50 − 34.13 = about 16%.

Q: A sten scale has a mean and SD of:
- 5 and 2
- 50 and 10
- 100 and 15
- *5.5 and 2
> Sten = standard ten, used in the 16PF.

Q: The 95% confidence interval for a mean of 40 with SE = 2 is about:
- 38 to 42
- 34 to 46
- 39 to 41
- *36.1 to 43.9
> 40 ± 1.96 × 2 = 40 ± 3.92.

Q: Failing to detect a real effect is a:
- *Type II error
- Type I error
- Sampling bias
- Correct decision
> A false negative; its probability is β.

Q: Power equals:
- α
- *1 − β
- β
- 1 − α
> The probability of correctly rejecting a false null.

Q: Which would most increase power?
- Lowering α to .001
- Using a less reliable measure
- *Increasing the sample size
- Switching to a two-tailed test
> More data reduce the standard error.

Q: The critical z for a one-tailed test at α = .05 is:
- *1.645
- 1.96
- 2.58
- 1.00
> All 5% is in one tail.

Q: For a sample of 27 people, the df to test the significance of r are:
- *25
- 27
- 26
- 24
> df = n − 2.

Q: Two judges rank 10 essays. The best index of their agreement in order is:
- Phi
- Point-biserial
- *Spearman's rho
- Chi-square
> Both variables are ranks.

Q: n = 5 pairs, Σd² = 4. Spearman's rho is:
- *.80
- .60
- .70
- .90
> 1 − (6 × 4) ÷ (5 × 24) = 1 − 24/120 = .80.

Q: Before–after scores of 12 patients on a depression scale are best compared with a:
- *Paired t-test
- Independent t-test
- Chi-square test
- Point-biserial correlation
> Same people measured twice.

Q: An independent t-test with 12 people in each group has df of:
- 24
- 23
- *22
- 11
> 12 + 12 − 2.

Q: In a chi-square test, an expected frequency is computed as:
- (O − E)² ÷ E
- Row total ÷ column total
- *Row total × column total ÷ N
- N ÷ number of cells, always
> Under independence, a cell's expected count is (row × column) ÷ N.

Q: Correlating gender (male, female) with a continuous anxiety score needs:
- Biserial r
- *Point-biserial r
- Phi
- Tetrachoric r
> One true dichotomy and one continuous variable.
:::
`;
