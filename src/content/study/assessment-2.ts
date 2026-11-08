/* Module · Psychological assessment and testing, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: building, adapting, interpreting and reporting

## 3.1 Building a test, step by step [core][advanced]
Every test you use was once a draft written by someone. Knowing how tests are built tells you what to trust and what to question, and prepares you for MPhil, PhD and NET questions on test construction.

### The ten steps
1. **Define the construct** precisely: what exactly is "exam anxiety"? Which parts (worry, body symptoms, avoidance)? For whom (Indian college students)?
2. **Plan the test** with a **blueprint** (table of specifications): which areas, how many items each, what format, what length.
3. **Write a large item pool**, usually two or three times as many items as you will keep.
4. **Expert review** for content validity, clarity and cultural fit.
5. **Pilot (try-out)** on a small sample like the target group; check instructions, time, confusing words.
6. **Item analysis**: keep items that are of suitable difficulty and discriminate well (Section 3.2).
7. **Check structure**: factor analysis to see whether items group as the theory predicts.
8. **Reliability**: internal consistency, test-retest and, where relevant, inter-rater.
9. **Validity**: content, criterion and construct evidence.
10. **Norms and manual**: standardise on a large representative sample; publish administration, scoring and interpretation rules.


:::widget flow
{
 "title": "The ten steps of test construction",
 "layout": "chain",
 "nodes": [
  {
   "id": "1",
   "label": "Define the construct"
  },
  {
   "id": "2",
   "label": "Blueprint"
  },
  {
   "id": "3",
   "label": "Write item pool",
   "detail": "Two or three times the final number of items."
  },
  {
   "id": "4",
   "label": "Expert review",
   "detail": "Content validity and cultural fit."
  },
  {
   "id": "5",
   "label": "Pilot",
   "detail": "Try-out on a small similar group."
  },
  {
   "id": "6",
   "label": "Item analysis",
   "detail": "Difficulty, discrimination, item-total correlation, distractors."
  },
  {
   "id": "7",
   "label": "Factor structure"
  },
  {
   "id": "8",
   "label": "Reliability"
  },
  {
   "id": "9",
   "label": "Validity"
  },
  {
   "id": "10",
   "label": "Norms and manual"
  }
 ]
}
:::

### Item formats and their traps
| Format | Good for | Watch out for |
|---|---|---|
| **Multiple choice** | Ability and knowledge | Distractors that are obviously wrong; clues in wording |
| **True or false** | Personality symptoms | Guessing; acquiescence (saying "true" to everything) |
| **Likert** (agree to disagree, often five points) | Attitudes, traits, symptoms | Central tendency (always choosing the middle), extreme responding |
| **Forced choice** | Reducing faking | Ipsative scores that cannot be compared between people |
| **Open-ended** | Projective and clinical richness | Scoring reliability |

### Response biases to design against
- **Social desirability**: answering to look good. Use neutral wording; include a lie or social desirability scale.
- **Acquiescence**: agreeing with everything. Mix positively and negatively worded items.
- **Faking bad (malingering)**: exaggerating problems, for example for compensation. Include infrequency or symptom validity items.
- **Halo effect** in rating scales: one good impression colours all ratings. Train raters with clear anchors.

:::widget sort
{
  "prompt": "Which step of test construction is this?",
  "buckets": ["Blueprint", "Expert review", "Pilot", "Item analysis", "Standardisation"],
  "items": [
    { "text": "A table showing 10 items each for worry, body symptoms and avoidance", "bucket": 0 },
    { "text": "Five clinical psychologists rate whether each item fits exam anxiety in Indian students", "bucket": 1 },
    { "text": "Thirty students try the draft and say two Hindi words are confusing", "bucket": 2 },
    { "text": "Dropping items that almost everyone answers the same way", "bucket": 3 },
    { "text": "Testing 2400 students across six states, balanced for sex, region and type of college", "bucket": 4 }
  ]
}
:::

:::widget decide
{
  "scene": "An MPhil scholar in Lucknow is building a 'Family Stress Scale'. All 40 of her items are worded so that 'agree' means more stress, for example 'My family puts pressure on me'.",
  "ask": "What is the main design flaw and the fix?",
  "choices": [
    { "label": "No flaw; consistent wording makes it easier to answer", "verdict": "harm", "outcome": "People who tend to agree with everything get inflated stress scores; reliability looks high but validity suffers.", "why": "All items keyed in one direction confound stress with acquiescence." },
    { "label": "Acquiescence bias; include reverse-keyed items such as 'My family respects my decisions', and check that they correlate negatively with the others", "verdict": "best", "outcome": "The revised scale separates agreeable responders from genuinely stressed ones.", "why": "Balanced keying controls for acquiescence. Reverse items must be clear, not confusing double negatives." },
    { "label": "Make every item a double negative to force careful reading", "verdict": "ok", "outcome": "Many respondents misread items; errors rise.", "why": "Double negatives add noise, especially in translation." }
  ]
}
:::

:::clinician
Construct definition is the step most often skipped and the one most responsible for poor tests: start from a clear theoretical model, write items broader than the construct to define its boundaries, and use exploratory then confirmatory factor analysis on separate samples. Prefer McDonald's omega over alpha when items have unequal loadings. Measurement invariance testing (configural, metric, scalar) across sex, language and region is now expected before comparing group means. For clinical scales, the COSMIN checklist sets standards for content validity (including patient involvement in item generation), structural validity, reliability, measurement error, responsiveness and interpretability. Ethically, a new scale used for decisions about individuals needs far more evidence than one used in a group-level research project.
:::

:::recall
1. List the ten steps of test construction. || Define construct; blueprint; item pool; expert review; pilot; item analysis; structure (factor analysis); reliability; validity; norms and manual.
2. What is a blueprint (table of specifications)? || A plan that sets how many items of which type cover each part of the construct.
3. How do you reduce acquiescence bias? || Mix positively and negatively keyed items.
4. Why include a lie or infrequency scale? || To detect socially desirable responding or exaggeration.
:::

:::mcq
Q: Experts rating whether items represent the full construct provide evidence of:
- Test-retest reliability
- *Content validity
- Predictive validity
- Norms
> Expert judgement of coverage.

Q: A respondent chooses "neither agree nor disagree" for almost every item. This is:
- Acquiescence
- *Central tendency bias
- Faking bad
- Halo effect
> Avoiding extremes.
:::

## 3.2 Item analysis and item response theory [core][advanced]
### Classical item analysis
For each item, two numbers matter most.

**Difficulty index (p)**: the proportion of people who answer the item correctly.
- p of 0.9 means 90 per cent pass: an easy item.
- p of 0.2 means only 20 per cent pass: a hard item.
- For a test meant to spread people out, items with p around **0.3 to 0.7** are most useful; an average near 0.5 gives the most information (adjusted upward for multiple-choice guessing).

**Discrimination index (D)**: does the item separate high scorers from low scorers?
- Rank people by total score. Take the **top 27 per cent** and **bottom 27 per cent**.
- D = (proportion correct in the upper group) minus (proportion correct in the lower group).
- D of 0.40 or more: very good. 0.30 to 0.39: good. 0.20 to 0.29: acceptable, may need revision. Below 0.20: poor, revise or drop. A **negative** D means low scorers do better than high scorers, a sign of a faulty item (ambiguous wording or a wrong key).

**Item-total correlation**: the correlation between the item and the total score of the remaining items. Higher is better.

**Distractor analysis**: in multiple choice, each wrong option should attract some low scorers and few high scorers. An option nobody chooses is not working.

:::widget worked
{
  "title": "Analysing one item",
  "steps": [
    { "q": "200 students take a 40-item test. For item 12, in the top 27 per cent (54 students), 45 answered correctly; in the bottom 27 per cent (54 students), 18 answered correctly. Overall, 110 of 200 got it right. What is the difficulty index?", "a": "p = 110 out of 200 = 0.55. Moderate difficulty, in the useful range." },
    { "q": "What is the discrimination index?", "a": "Upper: 45 out of 54 = 0.83. Lower: 18 out of 54 = 0.33. D = 0.83 minus 0.33 = 0.50. Excellent discrimination." },
    { "q": "Option C was chosen by 0 students in either group. What does that tell you?", "a": "Option C is a non-functioning distractor. Replace it with a plausible wrong answer." }
  ],
  "yourTurn": [
    { "q": "Item 27: upper group 20 out of 54 correct, lower group 26 out of 54 correct. Compute D and decide what to do.", "a": "Upper 0.37, lower 0.48, D = minus 0.11. Negative discrimination: low scorers do better. Check the answer key and wording; revise or drop the item." }
  ]
}
:::

### Item response theory (IRT)
Classical statistics depend on the sample: an item looks "easy" in a bright group and "hard" in a weak one. **Item response theory** models the probability that a person with a given level of the trait (called **theta**) answers an item in a given way.
- The **item characteristic curve (ICC)** is an S-shaped curve: as ability rises, the chance of a correct answer rises.
- **Difficulty (b)**: the ability level at which the chance of success is 50 per cent (where the curve's middle sits).
- **Discrimination (a)**: how steep the curve is. A steep curve separates people sharply around that level.
- **Guessing (c)**: the lower floor of the curve (for example 0.25 for four-option multiple choice).

| Model | Parameters | Use |
|---|---|---|
| **One-parameter (Rasch)** | Difficulty only | Simple, strong measurement properties |
| **Two-parameter** | Difficulty and discrimination | Most personality and symptom scales |
| **Three-parameter** | Plus guessing | Multiple-choice ability tests |


:::widget flow
{
 "title": "Classical test theory or item response theory?",
 "layout": "tree",
 "nodes": [
  {
   "id": "r",
   "label": "Two ways to model a test"
  },
  {
   "id": "c",
   "label": "Classical test theory",
   "parent": "r",
   "detail": "Observed score = true score + error. Statistics such as p and D depend on the sample."
  },
  {
   "id": "i",
   "label": "Item response theory",
   "parent": "r",
   "detail": "Models the chance of each answer from the person's trait level (theta)."
  },
  {
   "id": "c1",
   "label": "One SEM for everyone",
   "parent": "c"
  },
  {
   "id": "c2",
   "label": "Simple, small samples",
   "parent": "c"
  },
  {
   "id": "i1",
   "label": "Precision varies by trait level",
   "parent": "i",
   "detail": "The information function shows where the test measures well."
  },
  {
   "id": "i2",
   "label": "Adaptive testing and DIF",
   "parent": "i",
   "detail": "Needs large samples and model fit."
  }
 ]
}
:::

### What IRT makes possible
- **Item and test information**: shows at which trait levels the test measures precisely. A depression scale may be precise for moderate depression but poor at the mild end.
- **Computerised adaptive testing (CAT)**: the computer picks the next item based on previous answers, giving a precise score with fewer items. Many large exams and some clinical item banks (such as PROMIS) use it.
- **Differential item functioning (DIF)**: checks whether people of the same trait level but different groups (for example Hindi and Tamil speakers, men and women) have different chances of endorsing an item. DIF flags possible item bias.
- **Linking and equating**: putting different forms on the same scale.

:::widget guess
{
  "prompt": "In a four-option multiple-choice test analysed with a three-parameter IRT model, what would you expect the guessing parameter (c) to be for an item where weak candidates simply guess?",
  "min": 0,
  "max": 100,
  "unit": "per cent chance at the lowest ability",
  "answer": [20, 25],
  "reveal": "About 25 per cent (one in four), sometimes a little lower because good distractors attract weak candidates. The c parameter sets the floor of the item curve.",
  "clinician": "In practice c is often estimated somewhat below 1 over the number of options because attractive distractors pull low-ability examinees below chance. Three-parameter models need large samples (often over 1000) to estimate c stably; many test developers fix c or use two-parameter models instead."
}
:::

:::clinician
Classical test theory (CTT) and IRT compared: CTT statistics (p, D, alpha) are sample-dependent and assume one SEM for everyone; IRT parameters are, in principle, invariant across samples once the model fits, and measurement error varies with trait level (the test information function). Assumptions: unidimensionality (or a specified multidimensional model) and local independence. Polytomous models (Samejima's graded response model; partial credit and rating scale Rasch models) are used for Likert-type symptom items. Rasch analysis is common in Indian scale development theses; report fit statistics (infit and outfit mean squares), person and item separation, and DIF. PROMIS item banks (depression, anxiety, anger) show how IRT-based CAT can measure symptoms with four to eight items at precision equivalent to full legacy scales. NET and PhD entrance questions commonly ask for the meaning of the a, b and c parameters and the difference between CTT and IRT.
:::

:::recall
1. Define the difficulty index and the discrimination index. || Difficulty (p): proportion answering correctly. Discrimination (D): proportion correct in the top 27 per cent minus proportion correct in the bottom 27 per cent.
2. What does a negative D suggest? || A faulty item (ambiguous or wrongly keyed): low scorers outperform high scorers.
3. What are the a, b and c parameters in IRT? || a: discrimination (slope); b: difficulty (location where success is 50 per cent); c: guessing (lower asymptote).
4. What is differential item functioning? || When people of equal trait level from different groups have different probabilities of answering an item, flagging possible bias.
5. What does computerised adaptive testing do? || Chooses each next item from previous responses to reach a precise score with fewer items.
:::

:::mcq
Q: An item answered correctly by 90 per cent of test-takers has a difficulty index of:
- 0.10
- *0.90
- 0.50
- Cannot be calculated
> p is the proportion correct; a high p means an easy item.

Q: In IRT, a steep item characteristic curve indicates:
- High guessing
- *High discrimination
- Low difficulty
- Poor reliability
> The a parameter is the slope.

Q: Rasch models estimate:
- Difficulty, discrimination and guessing
- *Difficulty only, with discrimination fixed
- Only reliability
- Only validity
> The one-parameter model.
:::

## 3.3 Calculations you must be able to do [core][advanced]
Entrance exams and viva boards expect a few quick calculations. Practise these until they are automatic.

### Converting scores
- **z = (raw score minus mean) divided by SD.**
- **T = 50 + 10z.** **IQ = 100 + 15z.**

Example: a raw score of 65 on a test with mean 50 and SD 10 gives z = 1.5, T = 65, IQ-equivalent 122.5, about the 93rd percentile.


:::widget curve
{
 "kind": "normal",
 "title": "z-scores and percentiles",
 "caption": "Set z to 1.5 and read the percentile (about 93). Then set it to minus 1 (about 16). Practise converting a few raw scores from the examples on this page before the worked problems below."
}
:::

### Reliability calculations
- **Spearman-Brown (lengthening a test)**: new reliability = (k times r) divided by (1 + (k minus 1) times r), where k is how many times longer the test becomes.
  - Split-half correlation of 0.60 corrected to full length (k = 2): (2 times 0.60) divided by (1 + 0.60) = 1.20 divided by 1.60 = **0.75**.
- **Standard error of measurement** = SD times the square root of (1 minus reliability).
  - SD 15, reliability 0.91: SEM = 15 times 0.3 = **4.5**. A 95 per cent confidence interval is about the score plus or minus 2 SEM (strictly 1.96), so plus or minus 9.
- **Kuder-Richardson formula 20 (KR-20)**: the internal consistency formula for items scored right or wrong; Cronbach's alpha is its generalisation for multi-point items.


:::widget worked
{
 "title": "SEM and a confidence band for an IQ",
 "steps": [
  {
   "q": "A full scale IQ has SD 15 and reliability 0.96. What is the SEM?",
   "a": "15 times the square root of 0.04 = 15 times 0.2 = 3."
  },
  {
   "q": "What is the 95 per cent band around a score of 82?",
   "a": "82 plus or minus 1.96 times 3, about plus or minus 6: roughly 76 to 88."
  },
  {
   "q": "How would you report it?",
   "a": "'Full scale IQ 82 (95 per cent confidence interval 76 to 88), in the low average range.'"
  }
 ],
 "yourTurn": [
  {
   "q": "A subtest has SD 3 and reliability 0.75. Find the SEM and the 95 per cent band around a scaled score of 7.",
   "a": "SEM = 3 times the square root of 0.25 = 1.5. Band about 7 plus or minus 3, so 4 to 10: wide, so single subtests must be read cautiously."
  }
 ]
}
:::

### Validity calculations
- **Coefficient of determination**: square a validity coefficient to get the share of criterion variance explained. A validity of 0.50 explains 0.25, that is **25 per cent** of the variation in the criterion.
- **Reliability limits validity**: a test's validity cannot exceed the **square root of its reliability**. A test with reliability 0.64 can have a maximum validity of 0.80.

### Screening calculations
- **Sensitivity** = true positives divided by (true positives + false negatives).
- **Specificity** = true negatives divided by (true negatives + false positives).
- **PPV** = true positives divided by all positives. **NPV** = true negatives divided by all negatives.

:::widget worked
{
  "title": "Four calculations, one case",
  "steps": [
    { "q": "Ananya's raw score on an anxiety scale is 38. The norm mean is 30 and SD is 4. What is her z-score and T-score?", "a": "z = (38 minus 30) divided by 4 = 2.0. T = 50 + 20 = 70." },
    { "q": "The scale's reliability is 0.84 and its T-score SD is 10. What is the SEM in T-score units, and the 95 per cent band?", "a": "SEM = 10 times the square root of 0.16 = 10 times 0.4 = 4. The 95 per cent band is about 70 plus or minus 8, so roughly 62 to 78." },
    { "q": "The scale's validity against a clinical diagnosis is 0.60. How much of the variation in diagnosis does it explain?", "a": "0.60 squared = 0.36, about 36 per cent." },
    { "q": "What is the maximum validity this scale could have, given its reliability?", "a": "The square root of 0.84, about 0.92." }
  ],
  "yourTurn": [
    { "q": "A 20-item test has reliability 0.70. What would its reliability be if you made it 40 items long with similar items?", "a": "k = 2: (2 times 0.70) divided by (1 + 0.70) = 1.40 divided by 1.70 = about 0.82." },
    { "q": "In a study of 200 people, a screen gives 40 true positives, 10 false negatives, 30 false positives and 120 true negatives. Compute sensitivity, specificity and PPV.", "a": "Sensitivity = 40 out of 50 = 80 per cent. Specificity = 120 out of 150 = 80 per cent. PPV = 40 out of 70 = about 57 per cent." }
  ]
}
:::

:::widget reveal
{"prompt": "A test has a split-half reliability of 0.90 before correction. Will the Spearman-Brown corrected value be higher or lower, and why?", "answer": "Higher, about 0.95. The halves are each only half as long as the full test, and longer tests (with similar items) are more reliable, so the correction estimates the full-length reliability upward."}
:::

:::clinician
Additional formulas examiners like: the correction for attenuation (estimated true correlation equals observed correlation divided by the square root of the product of the two reliabilities); the standard error of estimate in prediction (SD of the criterion multiplied by the square root of 1 minus validity squared); the standard error of the difference between two scores (square root of the sum of the two squared SEMs), which tells you whether two index scores differ beyond chance; and the reliable change index (difference between pre and post scores divided by the standard error of the difference, with 1.96 as the threshold). Taylor-Russell tables show how the practical usefulness of a selection test depends on validity, base rate and selection ratio together, not validity alone.
:::

:::recall
1. Write the formulas for z, T and deviation IQ. || z = (X minus mean) divided by SD; T = 50 + 10z; IQ = 100 + 15z.
2. Write the Spearman-Brown formula. || New r = kr divided by (1 + (k minus 1)r).
3. Write the formula for the SEM. || SD times the square root of (1 minus reliability).
4. What is the ceiling on a test's validity? || The square root of its reliability.
5. What does squaring a validity coefficient give? || The proportion of criterion variance explained.
:::

:::mcq
Q: A test has SD 10 and reliability 0.96. Its SEM is:
- 0.4
- *2
- 4
- 9.6
> 10 times the square root of 0.04, which is 10 times 0.2.

Q: A split-half correlation of 0.50 corrected by Spearman-Brown becomes about:
- 0.25
- 0.50
- *0.67
- 1.00
> 1.0 divided by 1.5.

Q: A validity coefficient of 0.40 means the test explains about what share of criterion variance?
- 40 per cent
- *16 per cent
- 4 per cent
- 60 per cent
> 0.40 squared.
:::

## 3.4 Adapting tests for India and testing fairly [core][advanced]
Most tests in the world were built in North America or Europe, in English, for urban, schooled people. India has 22 scheduled languages, hundreds of dialects, wide gaps in schooling, and very different daily lives between a Mumbai office and a Bastar village. Using a test well here is a skill in itself.

### Three kinds of bias
| Bias | What it is | Example |
|---|---|---|
| **Construct bias** | The concept itself differs across groups | "Assertiveness" valued as healthy in one culture, seen as rudeness in another |
| **Method bias** | The way of testing disadvantages a group | Timed paper-and-pencil tests for someone who has never held a pen; unfamiliarity with multiple choice |
| **Item bias** | Specific items work differently | An item about "snow" or "baseball"; a vocabulary word common in one dialect only |


:::widget flow
{
 "title": "Adapting a test for an Indian language",
 "layout": "chain",
 "nodes": [
  {
   "id": "d",
   "label": "Decide",
   "detail": "Adapt an existing test or build a local one?"
  },
  {
   "id": "t",
   "label": "Translate",
   "detail": "Bilingual experts write the new version."
  },
  {
   "id": "b",
   "label": "Back-translate",
   "detail": "Different translators turn it back into the original; compare meanings."
  },
  {
   "id": "c",
   "label": "Cultural review",
   "detail": "Replace unfamiliar pictures, names, money and food."
  },
  {
   "id": "i",
   "label": "Cognitive interviews",
   "detail": "Ask people what they think each item means."
  },
  {
   "id": "p",
   "label": "Pilot and DIF",
   "detail": "Check item statistics and differential item functioning across groups."
  },
  {
   "id": "n",
   "label": "Local norms",
   "detail": "Reliability, validity and norms stratified by education and region."
  }
 ],
 "caption": "A translation alone is not an adaptation."
}
:::

### Steps in adapting a test
1. **Decide**: adapt an existing test, or build a new local one?
2. **Translate** by bilingual experts, then **back-translate** into the original by different translators, and compare.
3. **Cultural review**: replace unfamiliar content (pictures, names, money, food) with equivalents.
4. **Cognitive interviewing**: ask people from the target group what they think each item means.
5. **Pilot and analyse**: check item statistics and **differential item functioning** across groups.
6. **Establish reliability, validity and local norms**, ideally stratified by education and region.

:::widget decide
{
  "scene": "A district hospital in Odisha wants to use a Western memory test with a picture of a fire hydrant and a list of English words, translated into Odia, to screen older adults for dementia. Most patients have had less than four years of schooling.",
  "ask": "What is the best plan?",
  "choices": [
    { "label": "Use it as translated, with the original cut-off", "verdict": "harm", "outcome": "Many healthy, unschooled elders 'fail' and are wrongly told they have dementia.", "why": "Item content, method and norms are unsuitable; low education alone lowers scores." },
    { "label": "Use a tool designed or adapted for low-education Indian elders (for example the HMSE or an ICMR Neurocognitive Tool Box test in Odia if available), with education-adjusted norms, plus an informant interview on daily functioning", "verdict": "best", "outcome": "Screening becomes fairer and more accurate; the informant interview catches real decline.", "why": "Culturally and educationally appropriate tools and functional history are essential for valid dementia screening in India." },
    { "label": "Lower the cut-off by a few points and use it anyway", "verdict": "ok", "outcome": "Fewer false positives, but item bias (the hydrant, English-origin words) remains.", "why": "Adjusting the cut-off helps a little but does not fix construct, method and item bias." }
  ]
}
:::

### Indian tests and tools you should know
| Tool | Purpose | Note |
|---|---|---|
| **Binet-Kamat Test** | Intelligence (age scale) | Widely used for intellectual disability assessment |
| **MISIC** | Intelligence of school-age children | Malin's adaptation of the WISC |
| **Bhatia's Battery** | Performance intelligence | Useful with low literacy |
| **Vineland Social Maturity Scale (Indian adaptation)** | Adaptive functioning | Social age and social quotient |
| **Developmental Screening Test (DST)** | Development in young children | Indian norms for early milestones |
| **Indian Scale for Assessment of Autism (ISAA)** | Autism severity | Used for autism disability certification under the RPwD Act |
| **Indian Disability Evaluation and Assessment Scale (IDEAS)** | Disability from mental illness | Self-care, interpersonal activities, communication and understanding, work, plus duration of illness; used for disability certification |
| **NIMHANS Index for Specific Learning Disabilities** | Learning disability | Reading, writing, spelling, maths at grade levels |
| **PGI-BBD, PGI Memory Scale, NIMHANS battery, AIIMS battery** | Neuropsychology | See Section 2.6 |
| **HMSE**, **ICMR Neurocognitive Tool Box** | Dementia screening and assessment | Designed for low education and Indian languages |
| **Indian TAT (Uma Chowdhury)** | Projective | Indian settings in pictures |

:::widget guess
{
  "prompt": "The Flynn effect describes a rise in raw IQ test performance across generations in many countries during the twentieth century. Roughly how many IQ points per decade?",
  "min": 0,
  "max": 10,
  "unit": "IQ points per decade",
  "answer": [3, 3],
  "reveal": "About 3 points per decade. This means a test normed 30 years ago will overestimate a child's IQ today by around 9 points, which matters a great deal near the intellectual disability boundary. Many Indian tests in common use have old norms.",
  "clinician": "Meta-analysis estimated gains of about 2.8 full-scale points per decade worldwide from 1909 to 2013, larger for fluid than crystallised measures, with slowing and some reversals in Scandinavian and other high-income countries since the 1990s. Data from India are sparse, but rising schooling and nutrition make norm obsolescence a real concern. Some US courts have accepted Flynn adjustments in capital cases; in Indian disability certification, report the norm date and interpret scores near the cut-off cautiously."
}
:::

:::clinician
The International Test Commission Guidelines for Translating and Adapting Tests (2017 revision) set 18 guidelines across pre-condition, test development, confirmation, administration, scoring and interpretation, and documentation; cite them in any Indian adaptation thesis. Equivalence is hierarchical: construct (functional) equivalence, measurement unit equivalence and full scale (scalar) equivalence, tested statistically via multi-group confirmatory factor analysis or IRT-based DIF. Van de Vijver's bias framework (construct, method, item) is the standard reference. ISAA (developed by the National Institute for the Mentally Handicapped, now NIEPID, around 2009) has 40 items across six domains and is the notified tool for autism certification; IDEAS was developed by an Indian Psychiatric Society task force and adopted for psychiatric disability certification, with the 2018 guidelines (amended 2020) under the RPwD Act specifying the procedures. Many Indian adaptations exist only in theses or institute manuals with small, local, dated norms; always state the norm group, its size and its date in your report.
:::

:::recall
1. Name and define the three types of test bias. || Construct (the concept differs), method (the testing procedure disadvantages a group), item (specific items function differently).
2. List the main steps of adapting a test. || Decide; translate and back-translate; cultural review; cognitive interviewing; pilot and DIF analysis; reliability, validity and local norms.
3. What is ISAA used for? || Assessing autism severity, including for disability certification.
4. What does IDEAS assess? || Disability due to mental illness: self-care, interpersonal activities, communication and understanding, work, and duration of illness.
5. Why does the Flynn effect matter in India? || Old norms inflate IQ scores today, especially important near the intellectual disability cut-off.
:::

:::mcq
Q: Translating a test into Tamil and then having a different translator translate it back into English to check meaning is called:
- Norming
- *Back-translation
- Item analysis
- Equating
> A core step in adaptation.

Q: A timed computer test disadvantages elderly villagers who have never used a computer. This is:
- Construct bias
- *Method bias
- Item bias
- No bias
> The method, not the construct or items, causes the disadvantage.

Q: Disability due to a mental illness for certification in India is commonly assessed with:
- ISAA
- *IDEAS
- MMPI-2
- PANSS
> Indian Disability Evaluation and Assessment Scale.
:::

## 3.5 Interpreting results: profiles, effort and thinking errors [core][advanced]
### Read from the top down
1. **Was the testing valid?** Did the person understand, cooperate, try their best? Were there problems (hearing, vision, language, fatigue, medicines, acute illness)?
2. **Global scores** (full scale IQ, overall profile).
3. **Index or scale level** (strengths and weaknesses).
4. **Item or subtest level**, only as hypotheses.
5. **Integrate** with history, observation, interview and collateral information.


:::widget layers
{
 "title": "Interpret from the top down",
 "shape": "stack",
 "layers": [
  {
   "label": "1. Was testing valid?",
   "detail": "Understanding, cooperation, effort, hearing, vision, language, fatigue, medicines."
  },
  {
   "label": "2. Global scores",
   "detail": "Full scale IQ or overall profile, with confidence intervals."
  },
  {
   "label": "3. Indexes and scales",
   "detail": "Strengths and weaknesses, checked against base rates of normal variation."
  },
  {
   "label": "4. Subtests and items",
   "detail": "Only as hypotheses."
  },
  {
   "label": "5. Integration",
   "detail": "History, observation, interview and informants decide what the numbers mean."
  }
 ],
 "caption": "Most errors in reports come from starting at layer 4."
}
:::

### Effort and performance validity
In compensation claims, criminal cases, disability certification and sometimes in school, people may underperform deliberately or present symptoms that are not genuine (**malingering**), or underperform without conscious intent (fatigue, depression, "why try?").
- **Performance validity tests** (for example the Test of Memory Malingering) look very hard but are easy even for people with real brain injury. Very poor scores suggest poor effort.
- **Embedded indicators**: patterns within ordinary tests (for example very low digit span forwards with otherwise fluent conversation).
- **Symptom validity scales** in personality tests (MMPI F-family scales, the FBS).

:::widget decide
{
  "scene": "Mr Tiwari, 40, is claiming compensation after a minor road accident in Bhopal with no loss of consciousness and a normal CT scan. On testing he scores below chance on a two-choice recognition memory test (worse than if he had guessed randomly), yet he remembered the route to your office and your name.",
  "ask": "What can you conclude and how should you report it?",
  "choices": [
    { "label": "He has severe memory loss from the accident", "verdict": "harm", "outcome": "A false report supports an invalid claim and damages trust in psychological evidence.", "why": "Below-chance performance cannot come from memory loss alone; it means he knew the right answers and avoided them." },
    { "label": "Report that his test performance is invalid for estimating ability because of below-chance responding, which indicates deliberate wrong answers, and that the results cannot support claims of memory impairment; describe facts, not insults", "verdict": "best", "outcome": "The court receives an honest, evidence-based report.", "why": "Below-chance scores are strong evidence of intentional underperformance. Report objectively, avoid moral language, and let the decision-maker weigh it." },
    { "label": "Ignore the effort test and report the memory scores", "verdict": "harm", "outcome": "Your report is later discredited in cross-examination.", "why": "Effort testing exists precisely to tell you whether ability scores can be trusted." }
  ]
}
:::

### Thinking errors in interpretation
- **Confirmation bias**: noticing only findings that fit your first idea.
- **Overinterpreting small differences**: two subtest scores 2 points apart are usually within error.
- **Ignoring base rates**: many healthy people show some "abnormal" score somewhere when 20 tests are given. Expect a few low scores by chance.
- **The Barnum effect**: vague statements that fit almost everyone ("you sometimes doubt yourself") feel personally accurate. Avoid them in reports.
- **Pathologising difference**: reading cultural or educational differences as deficits.

:::widget reveal
{"prompt": "A healthy adult is given 20 different cognitive test scores. If 'impaired' is defined as below the 5th percentile on any single test, roughly how many impaired scores would you expect by chance alone?", "answer": "About one (5 per cent of 20). In fact, studies show that a majority of healthy people have at least one low score across a large battery. A single low score is not evidence of brain dysfunction; look for consistent patterns that fit the history."}
:::

:::clinician
Slick, Sherman and Iverson's (1999) criteria for malingered neurocognitive dysfunction, revised by Slick and Sherman (2013), grade definite, probable and possible malingering, with below-chance performance on a forced-choice test as the strongest single indicator. The American Academy of Clinical Neuropsychology consensus (2009, updated 2021) recommends performance validity testing in all neuropsychological evaluations, not only medicolegal ones. Multivariate base rates of low scores show that 40 to 80 per cent of healthy adults obtain at least one score at or below the 5th percentile across a typical battery, depending on battery size and intelligence. On the MMPI-2-RF and MMPI-3, the overreporting scales (F-r, Fp-r, Fs, FBS-r, RBS) separate exaggerated psychopathology, somatic and cognitive complaints. Use cautious language: "invalid", "non-credible" or "inconsistent with genuine impairment" rather than "faking" or "lying", unless the evidence is overwhelming and the context requires it.
:::

:::recall
1. In what order should test results be interpreted? || Validity of testing, global scores, index or scale level, item or subtest level as hypotheses, then integrate with all other data.
2. What does below-chance performance on a forced-choice test indicate? || Deliberate selection of wrong answers, strong evidence of non-credible performance.
3. What is the Barnum effect? || Vague, general statements feel personally accurate to almost everyone.
4. Why should one low score in a large battery not be over-read? || Many healthy people show at least one low score by chance across many tests.
:::

:::mcq
Q: The Test of Memory Malingering is best described as a:
- Projective test
- *Performance validity test that looks hard but is easy even for most brain-injured patients
- Personality inventory
- Rating scale for depression
> It detects poor effort.

Q: A report says "Mr X is a sensitive person who sometimes worries about what others think". This kind of statement is a problem because:
- It is too long
- *It is a Barnum statement that fits almost anyone
- It uses technical terms
- It violates confidentiality
> Vague statements add no information.
:::

## 3.6 The assessment process and writing the report [core][advanced]
### The process
1. **Clarify the referral question**: what decision does the referrer need to make? ("Is there intellectual disability?" "Is the memory loss due to depression or dementia?" "Is she fit to stand trial?")
2. **Plan**: choose tests that answer that question, suit the person's age, language and education, and have good norms.
3. **Consent and explanation**: purpose, what will happen, who will see the results, limits of confidentiality.
4. **Interview and history**, including informants.
5. **Administer** in standard conditions; note behaviour.
6. **Score** carefully; double-check.
7. **Interpret and integrate** all the data.
8. **Write** the report.
9. **Feedback** to the person (and, with consent, family and referrer) in plain language.


:::widget flow
{
 "title": "The assessment process",
 "layout": "chain",
 "nodes": [
  {
   "id": "1",
   "label": "Clarify the question"
  },
  {
   "id": "2",
   "label": "Plan tests"
  },
  {
   "id": "3",
   "label": "Consent"
  },
  {
   "id": "4",
   "label": "Interview and history"
  },
  {
   "id": "5",
   "label": "Administer"
  },
  {
   "id": "6",
   "label": "Score and check"
  },
  {
   "id": "7",
   "label": "Interpret and integrate"
  },
  {
   "id": "8",
   "label": "Write the report"
  },
  {
   "id": "9",
   "label": "Feedback",
   "detail": "Plain language, strengths included, a clear plan."
  }
 ],
 "caption": "Every heading of the report maps to one of these steps."
}
:::

### Report headings
| Heading | What it contains |
|---|---|
| **Identifying information** | Name, age, sex, education, language, date(s) of testing, referred by |
| **Reason for referral** | The question in the referrer's words, sharpened |
| **Sources of information** | Interviews, informants, records, tests used (full names) |
| **Background** | Brief relevant history only |
| **Behavioural observations** | Appearance, rapport, attention, effort, mood, language, anything that affects validity |
| **Test results** | Scores with ranges and confidence intervals, grouped by domain |
| **Interpretation and integration** | What the pattern means, combining all sources; strengths as well as weaknesses |
| **Summary and impression** | A short paragraph answering the referral question; diagnosis if appropriate |
| **Recommendations** | Specific, practical, prioritised |
| **Signature** | Name, qualification, RCI registration number, date |


:::widget timeline
{
 "prompt": "Put the steps of an assessment in order.",
 "events": [
  {
   "label": "Clarify the referral question"
  },
  {
   "label": "Plan suitable tests"
  },
  {
   "label": "Take consent"
  },
  {
   "label": "Interview and history"
  },
  {
   "label": "Administer tests"
  },
  {
   "label": "Score and check"
  },
  {
   "label": "Interpret and integrate"
  },
  {
   "label": "Write the report"
  },
  {
   "label": "Give feedback"
  }
 ],
 "why": "Every later step depends on the first: a clear question."
}
:::

### Writing well
- Write for the **reader** (a teacher, a judge, a psychiatrist, a parent). Explain technical terms or avoid them.
- **Describe behaviour, not labels**: "She solved puzzles quickly but gave up when items became hard" says more than "low frustration tolerance".
- Report **ranges and confidence intervals**, not just single numbers.
- **Answer the referral question** directly.
- Include **strengths**.
- Make **recommendations specific**: not "needs support" but "extra time of 25 per cent in exams; seating near the front; weekly remedial reading sessions focused on phonics".
- Be careful with words that can harm: avoid "retarded", "abnormal child", "faker".

:::widget worked
{
  "title": "Turning results into a report paragraph",
  "steps": [
    { "q": "Referral: Kabir, 11, Class 6, English-medium school in Pune; poor marks in English and Hindi. Results: MISIC full scale IQ 104 (average); verbal and performance IQs similar; reading two grades below class level on the NIMHANS SLD index; spelling errors; maths at grade level; good attention in testing. How would you open the interpretation?", "a": "Kabir's overall intellectual ability is in the average range, with no significant difference between verbal and performance abilities. This means his difficulties at school are not explained by low general ability." },
    { "q": "Next: describe the specific finding.", "a": "However, his reading and spelling are about two grade levels below his class, while his arithmetic is at grade level. He read slowly, guessed at unfamiliar words from the first letter, and made phonetic spelling errors." },
    { "q": "Then: integrate and answer the question.", "a": "Together with a history of slow reading since Class 1, normal vision and hearing, and adequate schooling, this pattern is consistent with a specific learning disorder with impairment in reading and written expression." },
    { "q": "Finally: recommendations.", "a": "1. Structured phonics-based remedial teaching, two to three sessions a week. 2. Extra time and, where allowed, a reader in exams. 3. Reduced copying load in class. 4. Review in one year. 5. Information on applying for certification and exam accommodations." }
  ],
  "yourTurn": [
    { "q": "Rewrite this weak sentence: 'Patient is a low-functioning case with poor memory and is probably faking.'", "a": "For example: 'Mrs S's scores on memory tests were in the low range. However, her performance on a test of effort was below expected levels, so these scores may underestimate her true memory ability and should be interpreted with caution.'" }
  ]
}
:::

:::widget decide
{
  "scene": "After testing, the parents of 8-year-old Riya in Chandigarh ask, 'Just tell us her IQ number. Is she mentally retarded?' Her full scale IQ is 74 and adaptive functioning is in the low average range.",
  "ask": "How should feedback go?",
  "choices": [
    { "label": "Tell them 'IQ 74, borderline, nothing to do'", "verdict": "harm", "outcome": "The parents leave frightened and confused, and the number circulates among relatives.", "why": "A bare number without meaning, range or a plan is unhelpful and can stigmatise." },
    { "label": "Explain in plain language what the tests showed, including strengths, that she does not have intellectual disability, that she learns more slowly in some areas, and give a concrete plan for school and home; offer a written summary", "verdict": "best", "outcome": "The parents feel informed and work with the school on specific supports.", "why": "Good feedback answers the real question, uses respectful language, gives meaning and a plan." },
    { "label": "Refuse to share results with parents", "verdict": "harm", "outcome": "The family feels shut out; nothing changes for Riya.", "why": "Parents of a child have a right to understandable feedback about their child's assessment." }
  ]
}
:::

:::clinician
Report quality research shows that most psychological reports are written at a postgraduate reading level that parents and teachers cannot use; aim for clear, short sentences and define every technical term. Lichtenberger recommends a question-driven, domain-organised integration rather than test-by-test reporting. Therapeutic assessment (Finn's collaborative model) frames assessment around the client's own questions and uses feedback sessions to produce change, with meta-analytic support for modest therapeutic effects. Retain raw data securely; in India, follow institutional record-keeping rules and the confidentiality provisions of the Mental Healthcare Act 2017 (section 23) for persons with mental illness. Sign with your RCI registration number for any clinical or certification report.
:::

:::recall
1. List the nine steps of the assessment process. || Clarify referral question; plan; consent; interview and history; administer; score; interpret and integrate; write; feedback.
2. Name the main report headings. || Identifying information, reason for referral, sources, background, behavioural observations, results, interpretation and integration, summary and impression, recommendations, signature with registration.
3. What makes a recommendation useful? || It is specific, practical, prioritised and tied to the findings.
4. Why report confidence intervals? || Every score has measurement error; intervals prevent over-precise conclusions.
:::

:::mcq
Q: The most important first step of any assessment is to:
- Choose the longest battery
- *Clarify the referral question
- Score the tests
- Write the recommendations
> Everything follows from the question.

Q: Which is the best way to describe behaviour in a report?
- "Child is hyperactive and oppositional"
- *"He left his seat four times in an hour and refused two tasks, saying they were boring"
- "Typical ADHD child"
- "Very naughty"
> Observable description, not labels.
:::

## 3.7 The ethics and law of testing [core][advanced]
### Core ethical rules
- **Competence**: use only tests you are trained in; clinical diagnosis and certification in India should be done by **RCI-registered** clinical or rehabilitation psychologists.
- **Informed consent**: explain the purpose, process, use of results and limits of confidentiality. For children, parental consent plus the child's assent.
- **Choosing appropriate tests**: valid for this person and purpose, current norms, suitable language.
- **Confidentiality**: results shared only with those who need them, with consent, except where law requires.
- **Test security**: do not copy, post or circulate test items or manuals; it destroys the test's validity for everyone.
- **Fair interpretation**: consider culture, language, disability and context.
- **Feedback**: give understandable results to the person.
- **No misuse**: never use tests to discriminate, label carelessly or support a predetermined conclusion.


:::widget sort
{
 "prompt": "Ethical or unethical testing practice?",
 "buckets": [
  "Ethical",
  "Unethical"
 ],
 "items": [
  {
   "text": "Explaining the purpose and limits of confidentiality before testing",
   "bucket": 0
  },
  {
   "text": "Photocopying a test manual to share with friends",
   "bucket": 1
  },
  {
   "text": "Using a test normed in another country without saying so",
   "bucket": 1
  },
  {
   "text": "Giving feedback in plain language with strengths included",
   "bucket": 0
  },
  {
   "text": "Changing a score so a child gets a disability certificate",
   "bucket": 1
  },
  {
   "text": "Choosing a non-verbal test for a client with little schooling",
   "bucket": 0
  }
 ]
}
:::

### Testing and Indian law
- **Rehabilitation Council of India Act 1992**: regulates the training and registration of rehabilitation professionals, including clinical psychologists; practising as a clinical psychologist without registration is an offence (see the Ethics and law module for sections and the current training route).
- **Mental Healthcare Act 2017**: confidentiality of information about persons with mental illness (section 23); right to access one's own records (section 25).
- **Rights of Persons with Disabilities Act 2016**: disability certification for intellectual disability, autism, specific learning disabilities, mental illness and others, by notified medical boards using the notified guidelines and tools.
- **Courts**: psychological evidence may be requested in criminal responsibility, fitness, custody and compensation cases. Be clear about your role (treating clinician or independent assessor) and stay within your evidence.


:::widget decide
{
 "scene": "After her son's assessment in Jaipur, a mother asks you to give her the original Rorschach cards and the scoring booklet 'to check your work with a friend who studied psychology'.",
 "ask": "What is the best response?",
 "choices": [
  {
   "label": "Give her the cards and booklet; she is the parent",
   "verdict": "harm",
   "outcome": "The materials circulate; the test becomes invalid for future children and you breach copyright and professional rules.",
   "why": "Test materials must be protected. Parents are entitled to understandable results, not the materials."
  },
  {
   "label": "Explain that test materials cannot be released, offer a detailed feedback meeting and a written report, and, with consent, share the raw data with another qualified psychologist if she wants a second opinion",
   "verdict": "best",
   "outcome": "She attends the feedback meeting, feels heard, and requests a second opinion through a registered psychologist.",
   "why": "This separates test data (shareable appropriately) from test materials (protected) and respects her right to understand."
  },
  {
   "label": "Refuse to discuss the results at all",
   "verdict": "harm",
   "outcome": "She files a complaint and loses trust in the service.",
   "why": "Refusing feedback breaches her right to understand her child's assessment."
  }
 ]
}
:::

### Online, computerised and AI-assisted testing
- Computerised tests can be efficient and precise (adaptive testing), but need **evidence of equivalence** with the paper version.
- Remote testing changes standard conditions: check the setting, who is in the room, and internet reliability; report the mode used.
- As of Nov 2026, AI tools are being used to draft reports and score some responses. They must be validated for the task, used under professional supervision, and never receive identifiable data without consent and secure handling. The psychologist remains responsible for every word signed.

:::widget decide
{
  "scene": "A college friend who is now an HR manager in Gurugram asks you to send her the full scoring manual and answer key of a well-known personality test so her company can 'use it for hiring without paying'.",
  "ask": "What should you do?",
  "choices": [
    { "label": "Send it; it is for a friend", "verdict": "harm", "outcome": "The test is copied widely; candidates learn the 'right' answers; the test becomes useless and you face a professional complaint.", "why": "This breaches test security, copyright and professional ethics, and harms candidates through improper use." },
    { "label": "Decline, explain test security and copyright, and suggest she consult a qualified occupational psychologist about valid, licensed selection tools", "verdict": "best", "outcome": "She is irritated but later hires a consultant; the company uses properly validated methods.", "why": "Protecting test security and steering towards appropriate use is the professional duty." },
    { "label": "Send a few sample items only", "verdict": "harm", "outcome": "Still a breach; items circulate.", "why": "Partial release is still a security breach." }
  ]
}
:::

:::clinician
Relevant codes: APA Ethical Principles of Psychologists and Code of Conduct (2002, amended 2010 and 2016), Standard 9 (Assessment) covers bases for assessments, use of assessments, informed consent, release of test data, test construction, interpreting results, assessment by unqualified persons, obsolete tests and outdated results, test scoring and interpretation services, explaining results and maintaining test security. The Indian Association of Clinical Psychologists and RCI codes echo these duties. Distinguish test data (raw scores, responses, notes) from test materials (manuals, items, stimuli): APA 9.04 allows release of test data to the client or a person they designate, while 9.11 requires protection of materials. In court, provide data to another qualified professional where possible. For remote neuropsychological testing, the inter-organisational guidance issued during the COVID-19 period and later teleneuropsychology studies show good equivalence for many verbal tests but poorer equivalence for timed motor and visuo-constructional tasks. Watch the 2025 and 2026 regulatory discussions on AI in health records under India's Digital Personal Data Protection Act 2023 and its rules before adopting AI drafting tools.
:::

:::recall
1. Name six ethical duties in testing. || Competence, informed consent, appropriate test choice, confidentiality, test security, fair interpretation (also feedback and no misuse).
2. Which Indian law protects the confidentiality of a person with mental illness? || The Mental Healthcare Act 2017, section 23.
3. Who should do clinical psychological assessment for diagnosis and certification in India? || RCI-registered clinical or rehabilitation psychologists.
4. What must be shown before replacing a paper test with a computer version? || Evidence of equivalence.
:::

:::mcq
Q: Posting the answer key of a standardised IQ test online mainly violates:
- Informed consent
- *Test security
- Beneficence only
- The right to feedback
> It compromises the test for everyone.

Q: Under the Mental Healthcare Act 2017, a person with mental illness has the right to:
- Have their test results published for research without consent
- *Confidentiality of their information, with defined exceptions
- Refuse to be told their results under any circumstances
- Demand any test they like
> Section 23 protects confidentiality.
:::

# Part IV · Exam zone

## 4.1 Long answers and short notes [core]
### Long answer skeletons
**1. Define reliability and validity. Describe their types and methods of estimation (15 marks).**
Definitions → classical test theory (true score plus error) → reliability types with method and coefficient (test-retest, alternate forms, split-half with Spearman-Brown, internal consistency with KR-20 and alpha, inter-rater with kappa and ICC) → factors affecting reliability (length, heterogeneity, time interval, conditions) → SEM and confidence intervals → validity types (content, criterion: concurrent and predictive, construct: convergent, discriminant, factorial) → modern unified view (Messick) → relation between them (reliability limits validity) → conclusion.

**2. Describe the steps of test construction with special reference to item analysis (15 marks).**
Construct definition → blueprint → item writing and formats → expert review → try-out → item analysis (difficulty, discrimination with the 27 per cent method, item-total correlation, distractor analysis) → IRT approach (ICC, a, b, c, information, DIF) → factor analysis → reliability, validity → standardisation and norms → manual.

**3. Critically evaluate projective techniques with reference to the Rorschach and TAT (15 marks).**
Projective hypothesis → Rorschach (cards, administration, scoring dimensions, Exner, R-PAS) → TAT (cards, needs and press, Indian TAT) → others → evidence (supported and unsupported indices) → criticisms (reliability, norms, incremental validity) → appropriate uses → conclusion.

**4. Neuropsychological assessment: approaches and Indian batteries (10 to 15 marks).**
Aims → bedside screening (MMSE, MoCA, HMSE, ACE-III) → fixed versus flexible batteries (Halstead-Reitan, Luria-Nebraska) → domains and common tests → Indian batteries (PGI-BBD, PGI Memory Scale, NIMHANS, AIIMS, ICMR-NCTB) → effort testing → education and culture → report.

**5. Write a psychological assessment report for a given case (10 marks).**
Use the headings in Section 3.6; answer the referral question; give scores with ranges; integrate; specific recommendations.

### Short notes (5 marks each)
- Standard error of measurement
- Norms and types of standard scores
- Sensitivity, specificity and predictive values
- Wechsler Adult Intelligence Scale
- Binet-Kamat test and MISIC
- MMPI validity scales
- 16PF
- Rorschach scoring
- Thematic Apperception Test
- PANSS
- Y-BOCS
- PGI Battery of Brain Dysfunction
- Item response theory
- Differential item functioning
- Cultural adaptation of tests
- Malingering and effort testing

:::student
In calculation-based questions, show every step and write the formula first. Examiners give method marks even when arithmetic slips.
:::

:::clinician
For NET, MPhil and PsyD entrance-style questions, expect: identification of reliability or validity types from scenarios; Spearman-Brown, SEM and z-to-T conversions; IRT parameter meanings; MMPI code types and validity configurations; Indian test authors (Kamat, Malin, Bhatia, Pershad, Verma, Wig, Chowdhury); and ethics of test use. Postgraduate long answers gain from naming the 2014 Standards, Messick's unified validity, the ITC adaptation guidelines and one meta-analytic finding (for example Mihura 2013 on Rorschach validity).
:::

:::recall
1. What should a long answer on reliability include? || Definition, classical test theory, each type with method and coefficient, influencing factors, SEM, and the link to validity.
2. Name four Indian test developers and their tests. || Kamat (Binet-Kamat), Malin (MISIC), Bhatia (performance battery), Pershad and Verma (PGI-BBD); also Pershad and Wig (PGI Memory Scale), Uma Chowdhury (Indian TAT).
:::

## 4.2 Viva rapid-fire [core]
:::viva
Define a psychological test. :: An objective, standardised sample of behaviour compared with norms.
Reliability versus validity? :: Reliability is consistency; validity is whether score interpretations are justified for a purpose.
Which reliability uses Cronbach's alpha? :: Internal consistency.
What corrects split-half reliability? :: The Spearman-Brown formula.
Formula for SEM? :: SD times the square root of (1 minus reliability).
What is construct validity? :: Evidence that the test behaves as theory predicts, including convergent and discriminant evidence.
Mean and SD of a T-score? :: 50 and 10.
What percentage lies within one SD? :: About 68 per cent.
What is the difficulty index? :: The proportion answering an item correctly.
What is the discrimination index? :: Proportion correct in the upper group minus the lower group (often the top and bottom 27 per cent).
What is the b parameter in IRT? :: Item difficulty: the trait level at which success is 50 per cent.
What is DIF? :: Differential item functioning: an item works differently for groups at the same trait level.
Name the four WAIS-IV indices. :: Verbal Comprehension, Perceptual Reasoning, Working Memory, Processing Speed.
Who developed MISIC? :: A. J. Malin, Nagpur, adapting the WISC.
Who adapted the Binet scale for India? :: V. V. Kamat.
How many MMPI-2 items and clinical scales? :: 567 items; 10 clinical scales.
What does the K scale measure? :: Defensiveness.
How many Rorschach cards? :: Ten.
Who developed the TAT and the Indian TAT? :: Murray and Morgan; Uma Chowdhury.
PANSS structure? :: 30 items: 7 positive, 7 negative, 16 general.
Y-BOCS range? :: 0 to 40.
Name the subtests of PGI-BBD. :: PGI Memory Scale, Verbal Adult Intelligence Scale, Bhatia's short performance tests, Nahor-Benson, Bender-Gestalt.
What does ISAA assess? :: Autism, for severity and certification.
What does IDEAS assess? :: Disability due to mental illness for certification.
What is the Flynn effect? :: Rising raw IQ performance across generations, about 3 points per decade in the last century.
What is the Barnum effect? :: Vague statements that seem personally accurate to almost anyone.
:::

## 4.3 Module test [core]
Score 80% or more to complete the module.

:::mcq
Q: A test always gives the same wrong reading. It is:
- Valid and reliable
- *Reliable but not valid
- Valid but not reliable
- Neither, because reliability requires validity
> Consistent but inaccurate.

Q: Kappa is used to measure:
- Internal consistency
- *Agreement between raters, corrected for chance
- Predictive validity
- Item difficulty
> Cohen's kappa for inter-rater agreement.

Q: A test correlates strongly with other measures of depression and weakly with measures of intelligence. This supports its:
- Face validity
- *Construct validity (convergent and discriminant)
- Test-retest reliability
- Content validity only
> Convergent plus discriminant evidence.

Q: A raw score one SD below the mean equals a T-score of:
- 30
- *40
- 50
- 60
> 50 minus 10.

Q: An IQ of 130 is at about the:
- 50th percentile
- 84th percentile
- *98th percentile
- 99.9th percentile
> Two SDs above the mean.

Q: The best measure of reliability for a test of items scored right or wrong is:
- Kappa
- *KR-20
- Validity coefficient
- PPV
> Kuder-Richardson 20.

Q: The positive predictive value of a screening test is the probability that:
- A person with the disorder tests positive
- *A person who tests positive has the disorder
- A person without the disorder tests negative
- The test is reliable
> PPV is the post-test probability after a positive result.

Q: Doubling the length of a test with reliability 0.60 (with similar items) gives a reliability of about:
- 0.60
- *0.75
- 0.90
- 1.20
> 1.20 divided by 1.60.

Q: If a test's reliability is 0.49, its validity can be no higher than:
- 0.49
- *0.70
- 0.24
- 1.00
> The square root of 0.49.

Q: An item with a discrimination index of minus 0.15 should be:
- Kept as excellent
- *Checked for a wrong key or ambiguity, and revised or dropped
- Used only for the top group
- Made easier
> Negative discrimination signals a faulty item.

Q: In IRT, the c parameter represents:
- Difficulty
- Discrimination
- *Guessing (the lower asymptote)
- Reliability
> The floor of the item curve.

Q: Computerised adaptive testing is made possible mainly by:
- Classical test theory
- *Item response theory
- Projective theory
- Factor analysis alone
> IRT places items and people on a common scale.

Q: Which WAIS-IV composite excludes working memory and processing speed?
- Full scale IQ
- *General Ability Index
- Processing Speed Index
- Working Memory Index
> GAI uses VCI and PRI.

Q: The Binet-Kamat test gives:
- A T-score profile
- *A mental age and IQ
- A personality code type
- A disability rating for mental illness
> An age-scale test.

Q: Which test is best for a quick non-verbal reasoning estimate in an adult with no schooling?
- WAIS-IV Vocabulary
- MMPI-2
- *Raven's Progressive Matrices (or a performance battery such as Bhatia's)
- BDI-II
> Minimal language demand.

Q: The MMPI-2 code type 4-9 is classically associated with:
- Anxious depression
- *Impulsive, acting-out behaviour
- Somatic complaints with denial
- Thought disorder
> Pd and Ma elevations.

Q: The 16PF is based on:
- Empirical criterion keying
- *Factor analysis
- Projective hypothesis
- Psychoanalytic theory
> Cattell's factor analysis.

Q: In the Rorschach, "form quality" refers to:
- The number of responses
- *How well the response fits the actual shape of the blot
- The colour of the card
- The time taken
> Perceptual accuracy.

Q: Murray's interpretation of TAT stories centres on:
- Determinants and location
- *Needs and press
- Id, ego and superego scores
- IQ indices
> Needs of the hero and press of the environment.

Q: PANSS general psychopathology has how many items?
- 7
- 10
- *16
- 30
> 7 positive, 7 negative, 16 general.

Q: A clinician wants to track a patient's OCD over exposure therapy. The best scale is:
- HAM-D
- PANSS
- *Y-BOCS
- YMRS
> Yale-Brown Obsessive Compulsive Scale.

Q: The NIMHANS Neuropsychological Battery provides norms stratified by:
- Religion
- *Age and education
- Income only
- Language only
> Age- and education-based norms.

Q: The AIIMS Comprehensive Neuropsychological Battery is notable for being:
- A projective test
- *A Hindi battery with adult and child forms based on Luria's approach
- A rating scale for mania
- An IQ test for infants
> Developed at AIIMS New Delhi.

Q: Different chances of answering an item for Hindi and Tamil speakers of the same ability indicate:
- High reliability
- *Differential item functioning
- Criterion validity
- Acquiescence
> DIF suggests item bias.

Q: Below-chance performance on a two-choice memory test suggests:
- Severe dementia
- *Deliberate wrong answering (non-credible performance)
- Normal memory
- Depression only
> Even random guessing scores near chance.

Q: A good psychological report should:
- List every raw score without explanation
- *Answer the referral question in plain language with specific recommendations
- Use as many technical terms as possible
- Avoid mentioning strengths
> Clarity and usefulness for the reader.

Q: Sharing a test's items publicly violates:
- Informed consent
- *Test security
- The right to feedback
- Norm-referencing
> Protect test materials.

Q: Which Indian scale is used to certify autism severity?
- IDEAS
- *ISAA
- VSMS
- PGI-BBD
> Indian Scale for Assessment of Autism.
:::
`;
