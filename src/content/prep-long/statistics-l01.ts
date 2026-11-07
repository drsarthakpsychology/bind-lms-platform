import type { LongQA } from "@/lib/prep/long-types";

const S = "statistics" as const;

export const STATISTICS_L01: LongQA[] = [
  {
    id: "stat-l01-001",
    subject: S,
    topic: "descriptives",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Write a short note on measures of central tendency. When is the median preferred to the mean? Illustrate with an example.",
    plan: ["Define central tendency", "Mean, median, mode with properties", "Worked example with an outlier", "When to use which"],
    answer: `## Meaning
A measure of central tendency is a single value that represents the typical or central score of a distribution.

## The three measures
- Mean: the sum of scores divided by their number. It uses every score and is the basis of most statistics, but it is pulled by extreme scores. Suitable for interval and ratio data.
- Median: the middle score when scores are arranged in order (the 50th percentile). It is not affected by extreme scores, so it suits skewed data and ordinal data.
- Mode: the most frequent score. The only measure for nominal data; a distribution can be bimodal.

## Worked example
Days of absence of seven students: 4, 6, 6, 7, 8, 9, 30.
- Mean = 70 / 7 = 10 days.
- Median = the fourth score in order = 7 days.
- Mode = 6 days.
One student with 30 days of absence pulls the mean above six of the seven scores, so the mean no longer describes a typical student. The median of 7 does.

## Which to use
| Situation | Best measure |
| Symmetrical interval or ratio data | Mean |
| Skewed data or outliers (income, reaction times, hospital stay) | Median |
| Ordinal data (ranks, rating categories) | Median |
| Nominal data (diagnosis, religion) | Mode |
In a normal distribution the three coincide. In a positively skewed distribution the order is usually mode, then median, then mean, with the mean pulled towards the tail.`,
    keyPoints: ["Definition", "Properties of each measure", "Correct worked values", "Effect of an outlier on the mean", "Choice by level of measurement and skew"],
    module: "statistics/1-3",
    visuals: [
      { kind: "worked", data: { title: "Mean versus median with an outlier", steps: [{ q: "Mean of 4, 6, 6, 7, 8, 9, 30?", a: "70 / 7 = 10" }, { q: "Median?", a: "Fourth score in order = 7" }, { q: "Which is more typical?", a: "The median: six of seven students are below the mean." }], yourTurn: [{ q: "Drop the 30. What are the new mean and median?", a: "Mean 40 / 6 = 6.67; median (6 + 7) / 2 = 6.5. They are now close." }] } },
    ],
    ref: "Garrett, Statistics in Psychology and Education ch 3; Gravetter and Wallnau ch 3. Values checked in Python.",
  },
  {
    id: "stat-l01-002",
    subject: S,
    topic: "descriptives",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Discuss the measures of variability. Calculate the variance and standard deviation for the scores 2, 4, 4, 4, 5, 5, 7, 9 and interpret them.",
    plan: ["Why variability matters", "Range, quartile deviation, mean deviation, variance, SD", "Worked calculation of SD (population and sample)", "Coefficient of variation", "Interpretation and conclusion"],
    answer: `## Why variability matters
Two classes can have the same mean mark of 60 but very different spreads: in one, everyone scores between 55 and 65; in the other, scores range from 20 to 100. Measures of variability (dispersion) describe how spread out the scores are, which tells us how well the mean represents the data and is essential for inferential statistics.

## The measures
- Range: highest minus lowest score. Simple, but depends only on two extreme scores.
- Quartile deviation (semi-interquartile range): half the distance between the third and first quartiles, (Q3 minus Q1) / 2. It ignores the extreme quarters at each end, so it suits skewed data and goes with the median.
- Interquartile range: Q3 minus Q1, shown by the box in a box plot.
- Mean (average) deviation: the average of absolute deviations from the mean. Rarely used because absolute values are hard to handle mathematically.
- Variance: the average of squared deviations from the mean.
- Standard deviation (SD): the square root of the variance, in the original units. It is the most used measure and goes with the mean.

## Worked example
Scores: 2, 4, 4, 4, 5, 5, 7, 9. N = 8.
- Mean = 40 / 8 = 5.
- Deviations from the mean: minus 3, minus 1, minus 1, minus 1, 0, 0, 2, 4.
- Squared deviations: 9, 1, 1, 1, 0, 0, 4, 16. Sum of squares (SS) = 32.
- Population variance = SS / N = 32 / 8 = 4. Population SD = 2.
- Sample variance (unbiased estimate of the population) = SS / (N minus 1) = 32 / 7 = 4.57. Sample SD = 2.14.
Dividing by N minus 1 corrects the tendency of a sample to underestimate population variability, because sample scores lie closer to their own mean than to the population mean. N minus 1 is the degrees of freedom.

## Interpretation
On average, scores lie about 2 points from the mean of 5. If the distribution were roughly normal, about 68 percent of scores would fall within one SD of the mean (3 to 7), and about 95 percent within two SDs (1 to 9). Here six of eight scores fall between 3 and 7.

## Coefficient of variation
CV = (SD / mean) x 100 = (2 / 5) x 100 = 40 percent. It compares variability across measures with different units or means, such as height and weight, but only for ratio scales.

## Properties of the SD
- Adding a constant to every score leaves the SD unchanged.
- Multiplying every score by a constant multiplies the SD by that constant.
- It is sensitive to outliers because deviations are squared.

## Conclusion
The SD and variance are the most useful measures of variability because they use all scores and underlie the normal curve, z scores, correlation and ANOVA. For skewed data or ordinal scales, the quartile deviation or interquartile range is safer.`,
    keyPoints: ["Why variability matters", "At least four measures defined", "Correct SS = 32", "Population SD 2 and sample SD 2.14", "Why N minus 1", "Interpretation with the 68 and 95 percent rule", "Coefficient of variation"],
    pitfalls: ["Forgetting to square deviations", "Mixing N and N minus 1 without saying which"],
    module: "statistics/1-4",
    visuals: [
      { kind: "worked", data: { title: "Standard deviation step by step", steps: [{ q: "Mean?", a: "40 / 8 = 5" }, { q: "Sum of squared deviations?", a: "9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = 32" }, { q: "Population SD?", a: "Square root of 32 / 8 = 2" }, { q: "Sample SD?", a: "Square root of 32 / 7 = 2.14" }], yourTurn: [{ q: "Add 10 to every score. What happens to the mean and SD?", a: "Mean becomes 15; SD stays 2." }] } },
    ],
    ref: "Garrett ch 4; Gravetter and Wallnau ch 4. Computed with numpy: var 4.0, sample var 4.571, sample SD 2.138.",
  },
  {
    id: "stat-l01-003",
    subject: S,
    topic: "normal-distribution",
    marks: 15,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Describe the properties of the normal probability curve. Explain its applications in psychology, and discuss the causes and measures of departure from normality.",
    plan: ["Define the normal curve and its history", "Properties", "Areas under the curve and z scores with a worked example", "Applications in psychology", "Skewness and kurtosis, causes of departure", "Conclusion"],
    answer: `## Meaning
The normal probability curve is a symmetrical, bell-shaped distribution in which most scores cluster around the mean and fewer appear towards the extremes. Abraham de Moivre derived it, Carl Friedrich Gauss used it for errors of measurement, and Adolphe Quetelet and Francis Galton applied it to human characteristics. Many psychological variables, such as intelligence test scores, height and reaction time averages, approximately follow it, and it is the basis of most inferential statistics.

## Properties
- Bell-shaped and perfectly symmetrical about the mean.
- Mean, median and mode coincide at the centre.
- Unimodal, with the highest point at the mean.
- Asymptotic: the tails approach but never touch the baseline.
- Defined completely by its mean and standard deviation.
- Points of inflection lie one SD above and below the mean.
- The total area under the curve is 1 (100 percent), so areas represent probabilities.
- Skewness is 0 and kurtosis is 3 (excess kurtosis 0), which is called mesokurtic.

## Areas under the curve
| Range | Area |
| Mean plus or minus 1 SD | About 68.26 percent |
| Mean plus or minus 2 SD | About 95.44 percent |
| Mean plus or minus 3 SD | About 99.73 percent |
| Mean plus or minus 1.96 SD | 95 percent |
| Mean plus or minus 2.58 SD | 99 percent |
Any normal distribution can be converted into the standard normal distribution, with mean 0 and SD 1, using z = (X minus mean) / SD.

## Worked example
Wechsler IQ scores have a mean of 100 and SD of 15.
- A person with IQ 130 has z = (130 minus 100) / 15 = 2.0. The area below z = 2.0 is 0.9772, so this person scores higher than about 97.7 percent of people.
- About 68 percent of people have IQs between 85 and 115.
- An IQ below 70 (z = minus 2.0) is found in about 2.3 percent of people, one reason the cut-off for intellectual disability is about two SDs below the mean.

## Applications in psychology
- Standardising and comparing scores across tests through z scores, T scores (mean 50, SD 10) and stanines.
- Building test norms and converting raw scores to percentiles.
- Classifying people into categories, for example grading students or defining the range of IQ categories.
- Determining the relative difficulty of test items, since the proportion passing can be converted into a distance on the curve.
- Scaling and dividing a group into subgroups of equal ability range.
- Inferential statistics: sampling distributions of means are approximately normal (central limit theorem), so z and t tests, confidence intervals and significance levels depend on it.
- Detecting extreme scores, for example scores beyond 2 SD in clinical screening.

## Departures from normality
- Skewness: lack of symmetry. In positive skew the tail is to the right (most scores are low, as on a very hard test, or in income and reaction times), and the mean is greater than the median. In negative skew the tail is to the left (an easy test where most score high), and the mean is less than the median. A common index is Pearson's: 3 (mean minus median) / SD.
- Kurtosis: peakedness and tail weight. Leptokurtic distributions are tall with heavy tails, platykurtic distributions are flat, and mesokurtic is normal.

## Causes of departure
- Selection of the sample: a group of gifted students will not show a normal spread of IQ.
- Unsuitable tests: too easy (negative skew, ceiling effect) or too hard (positive skew, floor effect).
- Small samples.
- Bias in scoring or administration.
- Variables that are not normally distributed by nature, such as number of panic attacks, income or response times.
- A mixture of two populations, producing a bimodal curve.

## Conclusion
The normal curve is a mathematical ideal that real data only approximate, but it remains central to psychology. It allows scores to be compared, norms to be built and inferences to be drawn. Researchers should check normality with plots, skewness and kurtosis values, or tests such as Shapiro Wilk before applying parametric methods.`,
    keyPoints: ["Definition and history", "At least six properties", "Areas at 1, 2 and 3 SD", "z score formula and worked IQ example", "At least five applications", "Skewness and kurtosis defined with direction of mean and median", "Causes of departure including ceiling and floor effects"],
    pitfalls: ["Saying the tails touch the baseline", "Mixing up the direction of skew"],
    module: "statistics/2-1",
    visuals: [
      { kind: "curve", data: { kind: "normal", title: "The normal curve and IQ", caption: "Set z to 2. What percentile is an IQ of 130?" } },
      { kind: "compare", data: { title: "Two kinds of skew", a: { label: "Positive skew", points: ["Tail to the right", "Mean above median", "Very hard test, floor effect"], summary: "Most scores low." }, b: { label: "Negative skew", points: ["Tail to the left", "Mean below median", "Very easy test, ceiling effect"], summary: "Most scores high." } } },
    ],
    ref: "Garrett ch 5 and 6; Gravetter and Wallnau ch 6. Areas from scipy.stats.norm: cdf(2) = 0.97725; P(-1<z<1) = 0.6827.",
  },
  {
    id: "stat-l01-004",
    subject: S,
    topic: "normal-distribution",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Write short notes on skewness and kurtosis.",
    plan: ["Define skewness, positive and negative", "Measures and examples", "Define kurtosis, three types", "Why they matter"],
    answer: `## Skewness
Skewness is the degree to which a distribution departs from symmetry.
- Positive (right) skew: the long tail points to the higher scores. Most people score low and a few score very high. Examples: income, number of hospital admissions, reaction times, scores on a very difficult test (floor effect). The mean is pulled above the median: mean greater than median greater than mode.
- Negative (left) skew: the long tail points to the lower scores. Most people score high. Example: marks on a very easy test (ceiling effect), age at death in a wealthy country. Here the mean is below the median.
- Measures: Pearson's coefficient, 3 (mean minus median) / SD, and the moment coefficient reported by software. A value of 0 indicates symmetry; values beyond about plus or minus 1 suggest marked skew.

## Kurtosis
Kurtosis describes the peakedness of a distribution and, more precisely, the heaviness of its tails compared with the normal curve.
- Mesokurtic: like the normal curve (kurtosis 3, excess kurtosis 0).
- Leptokurtic: tall and narrow, with heavy tails (positive excess kurtosis). Scores cluster tightly but extreme values are more common.
- Platykurtic: flat with light tails (negative excess kurtosis), as with a group very varied in ability.

## Why they matter
Parametric tests assume approximate normality. Marked skew or heavy tails can distort means and standard deviations and inflate error rates, so researchers may transform data (for example log transformation of reaction times), use the median, or choose non-parametric tests. They also signal problems with a test, such as items that are too easy.`,
    keyPoints: ["Definition of skewness", "Positive and negative with examples", "Mean and median relation", "Kurtosis types", "Practical importance for tests and analysis"],
    module: "statistics/2-1",
    visuals: [
      { kind: "sort", data: { prompt: "Which way is each distribution skewed?", buckets: ["Positive skew", "Negative skew"], items: [{ text: "Monthly income in a city", bucket: 0 }, { text: "Marks on a very easy quiz", bucket: 1 }, { text: "Reaction times in milliseconds", bucket: 0 }, { text: "Age at death in Japan", bucket: 1 }] } },
    ],
    ref: "Garrett ch 5; Gravetter and Wallnau ch 3",
  },
  {
    id: "stat-l01-005",
    subject: S,
    topic: "normal-distribution",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Riya scored 70 in a mathematics test (class mean 60, SD 5) and 80 in an English test (class mean 75, SD 10). In which subject did she do better relative to her class? Explain z scores, T scores and percentiles in answering.",
    plan: ["Explain why raw scores cannot be compared", "Define and calculate z scores", "Convert to percentiles", "Convert to T scores and other standard scores", "Assumptions and conclusion"],
    answer: `## Why raw scores mislead
Riya's English score (80) is higher than her mathematics score (70), but the two tests have different means and spreads. A raw score has meaning only in relation to the distribution it comes from. Standard scores solve this by expressing each score as a distance from the mean in SD units.

## z scores
z = (X minus mean) / SD.
- Mathematics: z = (70 minus 60) / 5 = 10 / 5 = 2.0.
- English: z = (80 minus 75) / 10 = 5 / 10 = 0.5.
Riya is two SDs above the class mean in mathematics but only half an SD above it in English. Relative to her class, she did much better in mathematics.

## Percentiles
If the scores are normally distributed, the area below each z gives her percentile rank.
- z = 2.0: area below is 0.9772, so she scored higher than about 97.7 percent of the class.
- z = 0.5: area below is 0.6915, so she scored higher than about 69 percent.

## T scores and other standard scores
z scores have a mean of 0 and SD of 1, which gives negative values and decimals. Other scales are linear transformations of z:
| Scale | Formula | Riya's maths | Riya's English |
| z | (X minus mean) / SD | 2.0 | 0.5 |
| T score (mean 50, SD 10) | 50 + 10z | 70 | 55 |
| Deviation IQ (mean 100, SD 15) | 100 + 15z | 130 | 107.5 |
| Stanine (mean 5, SD 2) | 5 + 2z, rounded, limited to 1 to 9 | 9 | 6 |
T scores are used in the MMPI, where a T of 65 or more is clinically significant, and deviation IQs in Wechsler scales.

## Properties of z scores
- The mean of z scores is 0 and the SD is 1.
- Converting to z does not change the shape of a distribution; a skewed distribution stays skewed.
- They allow scores from different tests to be combined or compared on a common scale.

## Assumptions and cautions
Converting z to percentiles using the normal table is valid only when the distribution is approximately normal. The comparison also assumes both classes are similar groups. If the mathematics class were weak and the English class strong, a high z in mathematics would mean less.

## Conclusion
Riya did better in mathematics (z = 2.0, about the 98th percentile) than in English (z = 0.5, about the 69th percentile), even though her raw English score was higher. Standard scores make such comparisons possible and form the basis of test norms in psychology.`,
    keyPoints: ["Explains why raw scores cannot be compared", "Correct z scores of 2.0 and 0.5", "Correct percentiles", "T score and IQ conversions", "z keeps distribution shape", "Normality assumption for percentiles", "Clear final answer"],
    module: "statistics/2-1",
    visuals: [
      { kind: "worked", data: { title: "Comparing scores across tests", steps: [{ q: "Maths z?", a: "(70 minus 60) / 5 = 2.0" }, { q: "English z?", a: "(80 minus 75) / 10 = 0.5" }, { q: "Percentiles?", a: "About 97.7 and 69.1" }, { q: "T scores?", a: "50 + 10 x 2 = 70; 50 + 10 x 0.5 = 55" }], yourTurn: [{ q: "An IQ of 85: z and percentile?", a: "z = minus 1.0, about the 16th percentile." }] } },
      { kind: "curve", data: { kind: "normal", caption: "Compare z = 0.5 with z = 2.0." } },
    ],
    ref: "Garrett ch 6; Anastasi ch 3 on standard scores. scipy: cdf(2)=0.9772, cdf(0.5)=0.6915, cdf(-1)=0.1587.",
  },
  {
    id: "stat-l01-006",
    subject: S,
    topic: "probability",
    marks: 10,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "mcp-entrance", "md-psychiatry"],
    question: "Explain the basic rules of probability. Using a screening test for depression with sensitivity 90 percent and specificity 80 percent in a population where 10 percent are depressed, calculate the probability that a person who tests positive is actually depressed.",
    plan: ["Define probability", "Addition, multiplication and conditional probability", "Set up the screening example in a 2 x 2 table", "Calculate positive and negative predictive values", "Explain the base rate effect and Bayes", "Conclusion"],
    answer: `## Probability
Probability is the likelihood of an event, expressed as a number from 0 (impossible) to 1 (certain). In the classical view it is the number of favourable outcomes divided by the total number of equally likely outcomes; in the frequency view it is the long-run proportion of times the event occurs.

## Basic rules
- Addition rule: for mutually exclusive events, P(A or B) = P(A) + P(B). The probability of rolling a 1 or a 6 is 1/6 + 1/6 = 1/3. If events can occur together, subtract the overlap: P(A or B) = P(A) + P(B) minus P(A and B).
- Multiplication rule: for independent events, P(A and B) = P(A) x P(B). The probability of two heads in two tosses is 0.5 x 0.5 = 0.25.
- Conditional probability: P(A given B) = P(A and B) / P(B). This is the probability of A when we know B has happened.
- Complement rule: P(not A) = 1 minus P(A).

## The screening example
Sensitivity is the probability of a positive test when depression is present. Specificity is the probability of a negative test when depression is absent. Consider 1,000 people with a prevalence (base rate) of 10 percent.
| Test result | Depressed | Not depressed | Total |
| Positive | 90 | 180 | 270 |
| Negative | 10 | 720 | 730 |
| Total | 100 | 900 | 1000 |
- 100 are depressed; 90 percent of them, 90 people, test positive (true positives), and 10 are missed (false negatives).
- 900 are not depressed; 80 percent, 720, test negative (true negatives), and 180 test positive (false positives).

## Predictive values
- Positive predictive value = true positives / all positives = 90 / 270 = 0.33. Only one in three people who test positive is actually depressed.
- Negative predictive value = 720 / 730 = 0.986. A negative result is very reassuring.

## Why the answer surprises people
Most people guess about 90 percent, because they confuse the probability of a positive test given depression (sensitivity) with the probability of depression given a positive test. This is base rate neglect, described by Daniel Kahneman and Amos Tversky. Because non-depressed people are nine times as common, even a modest false positive rate produces more false positives than true positives. Bayes' theorem formalises this: P(D given +) = P(+ given D) x P(D) / P(+) = (0.9 x 0.1) / 0.27 = 0.33.

## Implications
- The same test performs better where the base rate is higher, such as a psychiatric clinic, than in the general population.
- Screening in schools or primary care must be followed by a clinical interview before diagnosis.
- Raising specificity reduces false positives.

## Conclusion
The rules of probability show that a test's accuracy depends not only on sensitivity and specificity but on how common the condition is. Clinicians who ignore base rates will over-diagnose.`,
    keyPoints: ["Definition of probability", "Addition and multiplication rules with conditions", "Conditional probability", "Correct 2 x 2 table", "PPV of 33 percent and NPV of 98.6 percent", "Base rate neglect", "Bayes' theorem"],
    pitfalls: ["Confusing sensitivity with PPV", "Applying the multiplication rule to dependent events"],
    module: "statistics/2-2",
    visuals: [
      { kind: "guess", data: { prompt: "A person tests positive. What is the chance they are actually depressed?", min: 0, max: 100, step: 1, unit: "%", answer: [33, 34], reveal: "Only about 33 percent: 90 true positives out of 270 positives. The 900 non-depressed people produce 180 false positives." } },
      { kind: "worked", data: { title: "From sensitivity to predictive value", steps: [{ q: "True positives?", a: "10 percent of 1,000 = 100 depressed; 90 percent of 100 = 90." }, { q: "False positives?", a: "900 not depressed; 20 percent of 900 = 180." }, { q: "PPV?", a: "90 / (90 + 180) = 0.33" }], yourTurn: [{ q: "In a clinic where 50 percent are depressed, what is the PPV?", a: "Of 1,000: 450 true positives, 100 false positives; PPV = 450 / 550 = 0.82." }] } },
    ],
    ref: "Gravetter and Wallnau ch 6; Kahneman and Tversky 1973. PPV 90/270 = 0.333, NPV 720/730 = 0.986; clinic: 450/550 = 0.818.",
  },
  {
    id: "stat-l01-007",
    subject: S,
    topic: "estimation",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "A sample of 36 students has a mean anxiety score of 50 and SD of 12. Calculate the standard error of the mean and the 95 percent confidence interval, and interpret them.",
    plan: ["Define standard error", "Calculate SE", "Calculate the 95 percent CI", "Interpret correctly"],
    answer: `## Standard error of the mean
The standard error (SE) of the mean is the standard deviation of the sampling distribution of means: how much sample means would vary if we drew many samples of the same size from the population. It is estimated as SE = SD / square root of N.

## Calculation
- SE = 12 / square root of 36 = 12 / 6 = 2.
- For a 95 percent confidence interval with a large sample, we use z = 1.96 (strictly, t with 35 degrees of freedom is 2.03, which gives a slightly wider interval of about 45.9 to 54.1).
- Margin of error = 1.96 x 2 = 3.92.
- 95 percent CI = 50 plus or minus 3.92 = 46.08 to 53.92.

## Interpretation
If we repeated this sampling procedure many times and calculated an interval each time, about 95 percent of those intervals would contain the true population mean. It is therefore reasonable to say we are 95 percent confident that the population mean lies between about 46 and 54. It is not correct to say that there is a 95 percent probability that this particular interval contains the mean, because the population mean is fixed; the interval varies from sample to sample.

## What changes the width
- A larger sample shrinks the SE: with N = 144, SE = 1, and the interval halves.
- More variable scores widen it.
- A 99 percent interval uses 2.58 and is wider: 50 plus or minus 5.16.
Confidence intervals show both the estimate and its precision, which is why reporting guidelines prefer them to p values alone.`,
    keyPoints: ["Definition of SE", "SE = 2", "CI 46.08 to 53.92", "Correct frequentist interpretation", "Effect of N and confidence level", "Notes t versus z"],
    module: "statistics/2-2",
    visuals: [
      { kind: "worked", data: { title: "Confidence interval for a mean", steps: [{ q: "SE?", a: "12 / 6 = 2" }, { q: "Margin at 95 percent?", a: "1.96 x 2 = 3.92" }, { q: "Interval?", a: "46.08 to 53.92" }], yourTurn: [{ q: "Same mean and SD, N = 144. New 95 percent CI?", a: "SE = 1, so 48.04 to 51.96." }] } },
    ],
    ref: "Gravetter and Wallnau ch 7 and 9; Cumming 2014 New Statistics. t(35) crit = 2.030.",
  },
  {
    id: "stat-l01-008",
    subject: S,
    topic: "error-types",
    marks: 15,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "mcp-entrance", "md-psychiatry"],
    question: "Explain Type I and Type II errors in hypothesis testing. What is statistical power, and what factors affect it? Illustrate with an example from clinical research.",
    plan: ["Set out the decision table", "Type I error and alpha", "Type II error and beta", "Power and its determinants", "Clinical example and trade-off", "Conclusion"],
    answer: `## The decision problem
In hypothesis testing we decide, on the basis of sample data, whether to reject the null hypothesis (H0) of no effect. Because samples vary by chance, any decision can be wrong. There are four possible outcomes.
| Decision | H0 is true (no real effect) | H0 is false (real effect) |
| Reject H0 | Type I error, probability alpha | Correct decision, probability 1 minus beta (power) |
| Retain H0 | Correct decision, probability 1 minus alpha | Type II error, probability beta |

## Type I error
A Type I error is rejecting a true null hypothesis: concluding there is an effect when there is none, a false positive. Its probability is the significance level alpha, set by the researcher, usually 0.05. If alpha is 0.05 and there is truly no effect, 5 percent of studies will still produce a significant result by chance. Running many tests raises the overall chance of at least one Type I error: with 20 independent tests at alpha 0.05, the familywise error rate is 1 minus 0.95 to the power 20, about 0.64. Corrections such as Bonferroni divide alpha by the number of tests.

## Type II error
A Type II error is failing to reject a false null hypothesis: missing a real effect, a false negative. Its probability is beta. Beta is not fixed by the researcher; it depends on the design.

## Power
Power is the probability of correctly rejecting a false null hypothesis, 1 minus beta. Jacob Cohen recommended a minimum of 0.80, meaning an 80 percent chance of detecting an effect of the expected size.
Factors that increase power:
- Larger effect size: big differences are easier to detect.
- Larger sample size: reduces the standard error.
- Higher alpha: 0.05 rather than 0.01, at the cost of more Type I errors.
- One-tailed test, when the direction is predicted in advance.
- Less error variance: reliable measures, standard procedures, homogeneous samples.
- Within-subjects or matched designs, which remove individual differences from the error term.
- Use of covariates such as baseline scores (ANCOVA).

## Clinical example
A trial tests whether a new brief therapy reduces depression more than usual care.
- Type I error: concluding the therapy works when it does not. Patients would receive a useless treatment, and resources would be wasted.
- Type II error: concluding it does not work when it does. A helpful treatment would be abandoned.
Suppose the true effect is moderate, d = 0.5. With 20 patients per group and alpha 0.05 (two-tailed), power is only about 0.34, so the trial would miss the real effect about two times in three. With 64 patients per group, power reaches 0.80. Many small published trials in psychology have been underpowered, which also means their significant results tend to overestimate the true effect.

## Power analysis in practice
A power analysis can be done before a study (a priori), to find the sample size needed, or used to judge a finished study's sensitivity. Software such as G*Power asks for the test, the expected effect size, alpha and the desired power, and returns the sample size. The expected effect size should come from earlier research or from the smallest effect that would matter clinically, not from an optimistic guess. Calculating "observed power" after a non-significant result adds nothing, because it is simply a restatement of the p value.

## The trade-off
Lowering alpha from 0.05 to 0.01 reduces Type I errors but increases Type II errors, unless the sample is increased. The right balance depends on consequences: in early exploratory research a Type II error may be worse; in testing a risky drug a Type I error may be worse.

## Conclusion
Type I and Type II errors are the two ways of being wrong in hypothesis testing. Alpha controls the first; power, which depends mainly on sample size and effect size, controls the second. Good research plans power in advance through a power analysis rather than discovering after the study that it could not detect the effect it sought.`,
    keyPoints: ["Decision table correct", "Type I as false positive with alpha", "Familywise error and correction", "Type II as false negative with beta", "Power defined, 0.80 standard", "At least five factors affecting power", "Clinical example with numbers", "Trade-off between errors"],
    pitfalls: ["Swapping Type I and II", "Claiming the researcher sets beta directly"],
    module: "statistics/2-3",
    visuals: [
      { kind: "experiment", data: { title: "Power of a trial with a moderate effect", question: "A therapy has a true effect of d = 0.5. How often will a trial detect it at alpha 0.05?", unit: "%", conditions: [{ label: "20 patients per group", value: 34 }, { label: "64 patients per group", value: 80 }, { label: "100 patients per group", value: 94 }], why: "Power rises with sample size; small trials usually miss real moderate effects." } },
      { kind: "curve", data: { kind: "sdt", title: "The same trade-off in signal detection", caption: "Move the criterion: fewer false alarms means more misses, just as lower alpha means more Type II errors." } },
    ],
    ref: "Cohen 1988 Statistical Power Analysis; Gravetter and Wallnau ch 8. Power by noncentral t: n=20 0.338, n=64 0.801, n=100 0.940; familywise 1-0.95^20 = 0.642.",
  },
  {
    id: "stat-l01-009",
    subject: S,
    topic: "error-types",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Distinguish between one-tailed and two-tailed tests of significance. Explain levels of significance and critical regions with examples.",
    plan: ["Level of significance and critical region", "Two-tailed test with critical values", "One-tailed test with critical values", "When each is justified", "Example and conclusion"],
    answer: `## Level of significance
The level of significance (alpha) is the probability of rejecting the null hypothesis when it is true, chosen before data are collected. Common levels are 0.05 and 0.01. At 0.05, we accept a 5 in 100 risk of a Type I error. The critical region (region of rejection) is the set of values of the test statistic so extreme that, if H0 were true, they would occur with probability alpha or less. If the obtained statistic falls in this region, H0 is rejected.

## Two-tailed (non-directional) test
The alternative hypothesis states that a difference exists without specifying direction: H1, mean 1 is not equal to mean 2. The critical region is split between both tails of the sampling distribution, alpha / 2 in each.
- For z at alpha 0.05: critical values are plus and minus 1.96 (2.5 percent in each tail).
- At alpha 0.01: plus and minus 2.58.
Example: a researcher asks whether boys and girls differ in verbal fluency, with no prediction about which group scores higher.

## One-tailed (directional) test
The alternative hypothesis predicts the direction: H1, mean of the yoga group is lower than mean of the control group on anxiety. The whole critical region lies in one tail.
- For z at alpha 0.05: the critical value is 1.645 in the predicted direction.
- At alpha 0.01: 2.33.
Because the critical value is smaller, a one-tailed test is more powerful for detecting an effect in the predicted direction. But it cannot detect an effect in the opposite direction, however large.

## Comparison
| Feature | Two-tailed | One-tailed |
| Hypothesis | Non-directional | Directional |
| Critical region | Both tails, alpha / 2 each | One tail, all of alpha |
| Critical z at 0.05 | Plus or minus 1.96 | 1.645 |
| Critical z at 0.01 | Plus or minus 2.58 | 2.33 |
| Power in predicted direction | Lower | Higher |
| Detects opposite effect | Yes | No |

## When is a one-tailed test justified?
Only when there is a strong theoretical or practical reason to predict the direction, the direction is stated before seeing the data, and an effect in the other direction would be treated the same as no effect. Switching to a one-tailed test after seeing that a two-tailed result just missed significance is a questionable research practice that doubles the real Type I error rate in that direction. Most journals and reviewers expect two-tailed tests by default.

## Worked example
A study obtains z = 1.80 for the difference between a mindfulness group and a control group on anxiety, in the predicted direction.
- Two-tailed at 0.05: 1.80 is less than 1.96, so H0 is retained.
- One-tailed at 0.05: 1.80 is more than 1.645, so H0 is rejected.
The same data lead to different conclusions, which is why the choice must be made in advance.

## Conclusion
The level of significance sets the risk of a Type I error, and the tails of the test decide where that risk is placed. Two-tailed tests are the safer default; one-tailed tests are acceptable only with a firm, preregistered directional prediction.`,
    keyPoints: ["Definition of alpha and critical region", "Two-tailed with plus or minus 1.96 and 2.58", "One-tailed with 1.645 and 2.33", "Power difference", "Conditions justifying a one-tailed test", "Worked example where conclusions differ"],
    module: "statistics/2-3",
    visuals: [
      { kind: "curve", data: { kind: "normal", title: "Where the 5 percent goes", caption: "Two-tailed: beyond plus or minus 1.96. One-tailed: beyond 1.645 on one side only." } },
    ],
    ref: "Garrett ch 9; Gravetter and Wallnau ch 8. z crit: 1.96, 2.576, 1.645, 2.326.",
  },
  {
    id: "stat-l01-010",
    subject: S,
    topic: "correlation",
    marks: 20,
    difficulty: 3,
    exams: ["ma-semester", "ugc-net", "cuet-pg", "mcp-entrance"],
    question: "Explain the concept of correlation. Describe the Pearson product moment correlation, its assumptions and the factors that affect its size. Compute r for the following data on hours of study (X: 2, 4, 6, 8, 10) and test scores (Y: 52, 60, 58, 70, 66) and interpret it.",
    plan: ["Define correlation and its properties", "Pearson r formula and meaning", "Worked calculation step by step", "Testing significance and interpreting r squared", "Assumptions", "Factors affecting r and conclusion"],
    answer: `## Meaning
Correlation is the degree and direction of the relationship between two variables. When two variables change together, they are correlated. The correlation coefficient ranges from minus 1.00 (perfect negative) through 0 (no linear relationship) to plus 1.00 (perfect positive). The sign shows the direction and the absolute size shows the strength. A scatter plot shows the pattern: points close to a straight line indicate a strong correlation.

## Pearson product moment correlation
Developed by Karl Pearson from Francis Galton's work, r is the average product of paired z scores. It measures the strength of the linear relationship between two continuous variables. A computational formula is:
r = [N times the sum of XY minus (sum of X)(sum of Y)] divided by the square root of [N times the sum of X squared minus (sum of X) squared] times [N times the sum of Y squared minus (sum of Y) squared].

## Worked calculation
| Student | X | Y | X squared | Y squared | XY |
| 1 | 2 | 52 | 4 | 2704 | 104 |
| 2 | 4 | 60 | 16 | 3600 | 240 |
| 3 | 6 | 58 | 36 | 3364 | 348 |
| 4 | 8 | 70 | 64 | 4900 | 560 |
| 5 | 10 | 66 | 100 | 4356 | 660 |
| Sum | 30 | 306 | 220 | 18924 | 1912 |
- Numerator = 5 x 1912 minus 30 x 306 = 9560 minus 9180 = 380.
- X part = 5 x 220 minus 30 squared = 1100 minus 900 = 200.
- Y part = 5 x 18924 minus 306 squared = 94620 minus 93636 = 984.
- Denominator = square root of (200 x 984) = square root of 196800 = 443.6.
- r = 380 / 443.6 = 0.857.

## Interpretation
- r = 0.86 is a strong positive correlation: students who study more tend to score higher.
- r squared = 0.73, so about 73 percent of the variance in test scores is shared with study hours (the coefficient of determination).
- Significance: t = r times the square root of (N minus 2) / (1 minus r squared) = 0.857 x square root of (3 / 0.266) = 2.88, with 3 degrees of freedom. The critical t at 0.05 two-tailed is 3.18 (equivalently, the critical r for df = 3 is 0.878). So, despite its size, r is not significant (p is about 0.06), because five pairs are far too few. With a larger sample the same r would be clearly significant. This illustrates that strength and significance are different questions.
- Even if significant, correlation would not show that study causes higher scores; ability or motivation could drive both.

## Common verbal guide
| Size of r | Description (Cohen) |
| 0.10 | Small |
| 0.30 | Medium |
| 0.50 and above | Large |

## Assumptions
- Both variables are measured on interval or ratio scales.
- The relationship is linear.
- The data come from a bivariate normal distribution (for significance testing).
- Homoscedasticity: the spread of Y is similar at all values of X.
- Pairs of observations are independent.
- No extreme outliers.

## Factors that affect the size of r
- Restriction of range: if only high scorers on an entrance test are admitted, the correlation between the test and later grades among those admitted will be lower than in the full population.
- Non-linearity: a curvilinear relation, such as arousal and performance (the Yerkes Dodson inverted U), may give r near zero.
- Outliers: a single extreme point can create or destroy a correlation.
- Unreliability of measures: measurement error lowers (attenuates) r. Spearman's correction for attenuation estimates the true correlation as r divided by the square root of the product of the two reliabilities.
- Heterogeneity of the sample: combining two different groups can produce a misleading overall correlation.
- Sample size affects the stability and significance of r, not its expected size.

## Other correlation coefficients
When Pearson's assumptions are not met, other indices are used: Spearman's rho and Kendall's tau for ranks, point biserial r when one variable is a true dichotomy, phi for two dichotomies, and the biserial and tetrachoric coefficients when dichotomies are thought to hide continuous variables.

## Uses in psychology
Test reliability (test-retest and split-half), validity coefficients, factor analysis, regression and prediction, and studying relationships between variables that cannot be manipulated.

## Conclusion
Pearson's r is a compact index of linear relationship. A full interpretation reports its direction, size, r squared, significance and confidence interval, checks the scatter plot for non-linearity and outliers, considers range and reliability, and avoids causal claims.`,
    keyPoints: ["Definition and range of r", "Formula", "Correct table sums", "r = 0.857", "r squared interpretation", "Significance test showing non-significance with N = 5", "At least five assumptions", "Factors affecting r including restriction of range and attenuation"],
    pitfalls: ["Arithmetic errors in sums", "Calling a strong r automatically significant", "Inferring causation"],
    module: "statistics/2-4",
    visuals: [
      { kind: "worked", data: { title: "Pearson r by the computational formula", steps: [{ q: "Sums?", a: "Sum X 30, sum Y 306, sum X squared 220, sum Y squared 18924, sum XY 1912." }, { q: "Numerator?", a: "5 x 1912 minus 30 x 306 = 380" }, { q: "Denominator?", a: "Square root of (200 x 984) = 443.6" }, { q: "r?", a: "380 / 443.6 = 0.857" }, { q: "Significant with N = 5?", a: "t = 2.88 with df 3; critical 3.18, so no." }] } },
      { kind: "curve", data: { kind: "inverted-u", title: "Why r can miss a strong relationship", caption: "Arousal strongly affects performance, but the curve is not a line, so r is near zero." } },
    ],
    ref: "Garrett ch 6 and 7; Gravetter and Wallnau ch 15. scipy pearsonr: r = 0.8566, p = 0.0638; t = 2.875; t crit df 3 = 3.182.",
  },
];
