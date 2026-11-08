/* Module · Psychological assessment and testing, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: what tests are and how to judge them

## 1.1 What a psychological test is, and is not [core][starting]
A **psychological test** is a standard way of collecting a **sample of behaviour** (answers, drawings, puzzles solved, stories told) under fixed conditions, and comparing it with how other people perform. That is all. A test does not read minds or reveal hidden truth. It gives a carefully gathered piece of evidence.

### Test, assessment and diagnosis are different
- A **test** is one tool (for example an IQ test).
- An **assessment** is the whole process: the referral question, the interview, history from family, observation, tests, and putting it all together.
- A **diagnosis** is a clinical judgement that uses the assessment. No test, on its own, makes a diagnosis.

:::analogy The thermometer and the doctor
A thermometer tells you the temperature. It does not tell you whether the fever is malaria, dengue or a cold. A psychological test is a thermometer for one aspect of behaviour. The clinician is the doctor who puts the reading together with everything else.
:::


:::widget flow
{
 "title": "From a question to a decision",
 "layout": "chain",
 "nodes": [
  {
   "id": "q",
   "label": "Referral question",
   "detail": "What decision does someone need to make? Is there intellectual disability? Depression or dementia?"
  },
  {
   "id": "t",
   "label": "Tests",
   "detail": "Standardised samples of behaviour, compared with norms. Each gives a piece of evidence."
  },
  {
   "id": "a",
   "label": "Assessment",
   "detail": "Tests plus interview, history from family, observation and records, put together by a clinician."
  },
  {
   "id": "d",
   "label": "Diagnosis or opinion",
   "detail": "A clinical judgement that answers the question, with its uncertainty stated."
  }
 ],
 "caption": "No single test jumps straight to the last box."
}
:::

### Three things every good test has
1. **Standard procedure**: the same instructions, materials, timing and scoring for everyone.
2. **Norms**: scores from a large, representative group to compare against.
3. **Evidence of quality**: it gives consistent results (**reliability**) and measures what it claims to measure (**validity**).

### The main families of tests
| Family | What it measures | Examples |
|---|---|---|
| **Intelligence and ability** | Reasoning, knowledge, memory, speed | Wechsler scales, Binet-Kamat, Raven's matrices |
| **Personality (objective)** | Traits and symptoms through questionnaires | MMPI, 16PF |
| **Projective** | Inner themes through responses to unclear material | Rorschach inkblots, Thematic Apperception Test |
| **Neuropsychological** | Brain-based thinking skills: attention, memory, language, planning | PGI Battery of Brain Dysfunction, NIMHANS battery |
| **Rating scales and interviews** | Severity of symptoms | HAM-D for depression, PANSS for schizophrenia, Y-BOCS for OCD |
| **Adaptive behaviour** | Everyday independence | Vineland Social Maturity Scale |

:::widget decide
{
  "scene": "A school principal in Jaipur asks you, a final-year MA psychology student, to 'give IQ tests to all Class 8 children and tell us who is weak, so we can put them in a separate section'.",
  "ask": "What is the most appropriate response?",
  "choices": [
    { "label": "Agree and run a group IQ test this week", "verdict": "harm", "outcome": "Children are labelled and segregated on one test score; parents complain and several children lose confidence.", "why": "Tests should answer a clear, helpful question, be given by qualified people, with consent, and never be the sole basis for a high-stakes decision about a child." },
    { "label": "Explain that testing needs a clear purpose, consent, a qualified (RCI-registered) clinical or rehabilitation psychologist for clinical decisions, and other information; suggest screening for learning difficulties with proper follow-up instead", "verdict": "best", "outcome": "The school agrees to teacher screening for children struggling, with individual assessment by a qualified psychologist where needed.", "why": "This protects children, respects professional limits, and still helps the school." },
    { "label": "Refuse to discuss it", "verdict": "ok", "outcome": "The principal hires someone untrained instead.", "why": "Refusing is safer than misuse, but explaining good practice could have helped the children." }
  ]
}
:::


:::widget sort
{
 "prompt": "Which family does each test belong to?",
 "buckets": [
  "Intelligence",
  "Personality (objective)",
  "Projective",
  "Neuropsychological",
  "Rating scale"
 ],
 "items": [
  {
   "text": "Binet-Kamat",
   "bucket": 0
  },
  {
   "text": "16PF",
   "bucket": 1
  },
  {
   "text": "Thematic Apperception Test",
   "bucket": 2
  },
  {
   "text": "PGI Battery of Brain Dysfunction",
   "bucket": 3
  },
  {
   "text": "Y-BOCS",
   "bucket": 4
  },
  {
   "text": "MISIC",
   "bucket": 0
  },
  {
   "text": "MMPI-2",
   "bucket": 1
  },
  {
   "text": "Rorschach",
   "bucket": 2
  },
  {
   "text": "Wisconsin Card Sorting Test",
   "bucket": 3
  },
  {
   "text": "PANSS",
   "bucket": 4
  }
 ]
}
:::

:::student
You will learn many test names in this module. Do not try to memorise them as a list. For each test, learn **three things**: what it measures, who it is for, and one thing to be careful about.
:::

:::clinician
Anastasi's classic definition, "an objective and standardised measure of a sample of behaviour", still frames the field; the joint professional testing standards of the American educational, psychological and measurement associations (2014 revision) are the governing professional reference, with validity defined as "the degree to which evidence and theory support the interpretations of test scores for proposed uses". The key implication: validity belongs to an interpretation for a purpose, not to a test. Meyer's group showed that the validity of many psychological tests is comparable to that of many medical tests, and that multi-method assessment adds information that interviews alone miss, because patients and observers each see only part of the picture. In India, administration and interpretation of clinical psychological tests for diagnosis and certification is the professional domain of RCI-registered clinical and rehabilitation psychologists (see the Ethics and law module).
:::

:::recall
1. What is a psychological test, in one line? || A standardised sample of behaviour compared against norms.
2. How do a test, an assessment and a diagnosis differ? || A test is one tool; an assessment is the whole process of gathering and integrating information; a diagnosis is the clinical judgement that uses it.
3. Name three features of every good test. || Standard procedure, norms, and evidence of reliability and validity.
:::

:::mcq
Q: Which statement is correct?
- An IQ test can diagnose intellectual disability on its own
- *A test is one source of evidence within a wider assessment
- Projective tests reveal the absolute truth about a person
- Any graduate can give and interpret clinical tests
> Diagnosis needs the whole assessment, including adaptive functioning and history.

Q: The Vineland Social Maturity Scale mainly measures:
- Personality traits
- *Adaptive (everyday) functioning
- Depression severity
- Brain damage
> It measures social and self-help competence.
:::

## 1.2 Reliability: can you trust the score to stay the same? [core][starting]
**Reliability** means **consistency**. If a test is reliable, it gives similar results each time it is used in the same conditions, no matter who scores it.

:::analogy The bathroom scale
If you step on a scale three times in a minute and it says 58, 64 and 51 kg, it is unreliable. You cannot trust any single reading. A reliable scale says 58, 58, 58.5.
:::


:::widget layers
{
 "title": "Observed score = true score + error",
 "shape": "stack",
 "layers": [
  {
   "label": "Observed score",
   "detail": "The number you actually get on the day."
  },
  {
   "label": "True score",
   "detail": "What the person would score with a perfect test: the stable part."
  },
  {
   "label": "Error",
   "detail": "Chance influences: tiredness, guessing, a noisy room, a harsh scorer. Reliability is the share of score differences that is true, not error."
  }
 ],
 "caption": "Classical test theory in one picture. Every type of reliability is a way of estimating how big the error layer is."
}
:::

### Types of reliability
| Type | The question it answers | How it is checked |
|---|---|---|
| **Test-retest** | Is the score stable over time? | Same people, same test, two occasions; correlate |
| **Alternate (parallel) forms** | Do two versions give the same result? | Give Form A and Form B; correlate |
| **Split-half** | Do the two halves of the test agree? | Correlate odd and even items, then correct for length |
| **Internal consistency** | Do all the items measure the same thing? | Cronbach's alpha |
| **Inter-rater** | Do two scorers agree? | Two raters score the same responses; agreement statistics such as kappa |

Reliability is shown as a number from 0 (no consistency) to 1 (perfect). As a rough guide:
- About **0.70**: acceptable for research on groups.
- About **0.90** or higher: needed when making decisions about an **individual** (diagnosis, certification).

:::widget sort
{
  "prompt": "Which type of reliability is being checked?",
  "buckets": ["Test-retest", "Inter-rater", "Internal consistency", "Alternate forms"],
  "items": [
    { "text": "Two psychologists score the same Rorschach protocol and compare", "bucket": 1 },
    { "text": "Students take a memory test in January and again in March", "bucket": 0 },
    { "text": "Checking that all 21 items of a depression questionnaire hang together", "bucket": 2 },
    { "text": "Form A and Form B of a reading test given a week apart", "bucket": 3 },
    { "text": "Two raters use HAM-D on the same videotaped interview", "bucket": 1 },
    { "text": "Calculating Cronbach's alpha for a new anxiety scale", "bucket": 2 }
  ]
}
:::

:::trap Stability depends on what is measured
A mood questionnaire **should** change over two months if the person recovers. Low test-retest reliability for a state measure is not always a flaw. Intelligence, a stable trait, should show high test-retest reliability.
:::


:::widget worked
{
 "title": "Why one score can mislead",
 "steps": [
  {
   "q": "Rohan's IQ test has a standard error of measurement of about 4 points. He scores 68. Roughly what range is his true score likely to fall in (95 per cent)?",
   "a": "About 68 plus or minus 8, so roughly 60 to 76."
  },
  {
   "q": "Does that range cross the usual boundary for intellectual disability (about 70)?",
   "a": "Yes. His true score could be on either side of it."
  },
  {
   "q": "So what must the psychologist do before any label?",
   "a": "Assess adaptive functioning, take a developmental history, consider language and schooling, and report the range, not just 68."
  }
 ],
 "yourTurn": [
  {
   "q": "A test with SEM of 2 gives a score of 68. What is the approximate 95 per cent range, and is the picture clearer?",
   "a": "About 64 to 72. Narrower, but it still touches 70, so adaptive functioning still decides."
  }
 ]
}
:::

:::example Why reliability matters for one child
Rohan, 9, in Nashik, gets an IQ of 68 on one test and 76 on another a month later. If the true reliability is modest, his "real" level could be anywhere across that range. A label of intellectual disability, with its consequences for schooling and benefits, should not rest on a single unreliable number. Use more than one source.
:::

:::clinician
Classical test theory: observed score equals true score plus error; reliability is the proportion of observed-score variance that is true-score variance. The standard error of measurement (SEM) equals SD multiplied by the square root of (1 minus reliability). For a Wechsler full scale IQ (SD 15, reliability about 0.97), SEM is about 2.6, so a 95 per cent confidence interval is roughly plus or minus 5 points; for a subtest (SD 3, reliability about 0.80) it is wide. Split-half coefficients are corrected with the Spearman-Brown formula. Cronbach's alpha rises with the number of items and is a lower bound on reliability only under strict assumptions; McDonald's omega is increasingly preferred. Cohen's kappa corrects inter-rater agreement for chance; the intraclass correlation is used for continuous ratings. Report every individual score with its confidence interval.
:::

:::recall
1. What does reliability mean? || Consistency of measurement across time, forms, items or raters.
2. Name five types of reliability. || Test-retest, alternate forms, split-half, internal consistency, inter-rater.
3. What reliability is needed for individual decisions? || About 0.90 or higher.
4. Why might a valid mood scale have low test-retest reliability? || Because mood genuinely changes; the scale should track that change.
:::

:::mcq
Q: A researcher correlates scores on odd-numbered items with even-numbered items of a test. This checks:
- Test-retest reliability
- *Split-half reliability
- Predictive validity
- Inter-rater reliability
> Two halves of the same test are compared.

Q: Two clinicians independently rate the same patient with PANSS and agree closely. This shows good:
- Content validity
- *Inter-rater reliability
- Alternate forms reliability
- Construct validity
> Agreement between raters.
:::

## 1.3 Validity: does the test measure what it claims? [core][starting]
**Validity** asks a more important question: does the test measure **what it is supposed to measure**, well enough for the purpose it is used for?

:::analogy The clock that is always ten minutes fast
A clock that is always exactly ten minutes fast is **reliable** (consistent) but not **valid** (not accurate). A test can be reliable without being valid. But an unreliable test cannot be valid, because a score that jumps around cannot be accurate.
:::

### Types of validity
| Type | The question | Example |
|---|---|---|
| **Face validity** | Does it look, to the test-taker, as if it measures the thing? | A depression scale asking about sadness looks like a depression test |
| **Content validity** | Do the items cover the whole area? | A maths exam with only addition lacks content validity for "arithmetic" |
| **Criterion validity: concurrent** | Does it agree with a trusted measure taken at the same time? | A new short depression scale agrees with a full clinical interview |
| **Criterion validity: predictive** | Does it predict a future outcome? | An entrance test predicts first-year marks |
| **Construct validity** | Does it behave as the theory of the concept says it should? | An anxiety scale correlates with other anxiety measures (convergent) and not with height (discriminant) |

:::mnemonic "Face, Content, Criterion, Construct": "Four Cups of Chai, Clinically"
**F**ace, **C**ontent, **C**riterion (concurrent and predictive), **C**onstruct (convergent and discriminant).
:::

:::widget sort
{
  "prompt": "Which kind of validity is being shown?",
  "buckets": ["Content", "Concurrent", "Predictive", "Construct"],
  "items": [
    { "text": "A panel of experts checks that a new OCD scale covers obsessions, compulsions, avoidance and insight", "bucket": 0 },
    { "text": "Scores on a new screening test match diagnoses from a psychiatrist's interview done the same day", "bucket": 1 },
    { "text": "An aptitude test given at admission predicts who completes MPhil training", "bucket": 2 },
    { "text": "A new 'resilience' scale correlates with coping measures but not with IQ", "bucket": 3, "why": "Correlating with related measures (convergent) and not with unrelated ones (discriminant) is evidence of construct validity." },
    { "text": "A memory test's scores fall in a sensible order: healthy adults, then mild cognitive impairment, then dementia", "bucket": 3, "why": "Known-groups differences that fit the theory support construct validity." }
  ]
}
:::


:::widget sort
{
 "prompt": "A new 'exam stress' scale is tested. Is each finding convergent or discriminant evidence?",
 "buckets": [
  "Convergent (should correlate, and does)",
  "Discriminant (should not correlate, and does not)"
 ],
 "items": [
  {
   "text": "Correlates strongly with an established anxiety scale",
   "bucket": 0
  },
  {
   "text": "Barely correlates with height",
   "bucket": 1
  },
  {
   "text": "Rises in the week before exams",
   "bucket": 0,
   "why": "Changing as theory predicts with stress is also construct evidence."
  },
  {
   "text": "Unrelated to vocabulary scores",
   "bucket": 1
  },
  {
   "text": "Correlates with self-reported sleep problems during exams",
   "bucket": 0
  }
 ]
}
:::

:::trap Face validity is not real validity
A questionnaire that "looks right" may still be poor. And some good tests deliberately have low face validity (for example items on the MMPI whose purpose is not obvious) to reduce faking.
:::

:::widget decide
{
  "scene": "A start-up in Bengaluru markets an app that claims to 'detect depression from 30 seconds of your voice with 95 per cent accuracy'. A college counselling centre asks if they should use it to screen all students.",
  "ask": "What is the best advice?",
  "choices": [
    { "label": "Yes; 95 per cent accuracy is excellent", "verdict": "harm", "outcome": "Hundreds of students are flagged; most are not depressed, the counsellors are swamped, and some truly depressed students are missed.", "why": "A single accuracy figure hides false positives and false negatives, and depends on the sample it was tested in. Validity must be shown for this use, in this population." },
    { "label": "Ask for independent validation evidence in Indian college students, its sensitivity and specificity, data privacy safeguards, and what happens to students who screen positive; until then use an established validated questionnaire with a clear pathway", "verdict": "best", "outcome": "The company cannot supply local data; the centre uses PHQ-9 with follow-up interviews.", "why": "Validity is about a specific interpretation for a specific use and population. Privacy and a care pathway are also essential." },
    { "label": "Ban all screening", "verdict": "ok", "outcome": "Students who need help are not identified early.", "why": "Screening with a validated tool and a clear pathway can be valuable." }
  ]
}
:::

:::clinician
Modern validity theory (Messick, 1989; the 2014 Standards) treats construct validity as the unifying concept, with five sources of evidence: test content, response processes, internal structure, relations with other variables (convergent, discriminant, criterion) and consequences of testing. Campbell and Fiske's multitrait-multimethod matrix remains the classic design for convergent and discriminant evidence. Incremental validity (does the test add prediction beyond what is already known, such as the interview?) is the practical question for clinicians and is often neglected. Ecological validity (does performance in the clinic reflect real-world functioning?) is the weak point of many neuropsychological tests. Digital phenotyping and voice-based screening are research areas as of Nov 2026; published accuracy often falls substantially on external validation, and none is a validated diagnostic tool in Indian populations.
:::

:::recall
1. What is validity? || The degree to which evidence supports interpreting a score as measuring what it claims, for a given purpose.
2. Can a test be reliable but not valid? || Yes, like a clock always ten minutes fast. But an unreliable test cannot be valid.
3. Distinguish concurrent and predictive validity. || Concurrent: agreement with a criterion measured at the same time. Predictive: forecasting a future criterion.
4. What are convergent and discriminant validity? || Correlating with measures of the same construct, and not correlating with measures of unrelated constructs.
:::

:::mcq
Q: A new IQ test correlates highly with the Wechsler scale given on the same day. This is evidence of:
- Face validity
- *Concurrent validity
- Test-retest reliability
- Content validity
> Agreement with an established measure at the same time.

Q: A weighing scale always shows exactly 2 kg more than the true weight. It is:
- Neither reliable nor valid
- *Reliable but not valid
- Valid but not reliable
- Both reliable and valid
> Consistent, but consistently wrong.
:::

## 1.4 Scores, norms and the normal curve [core][starting]
A raw score (for example 42 correct answers) means little on its own. Is 42 good? It depends on how others score. **Norms** let us compare a person with a **reference group** of similar age, and ideally similar education, language and background.

### The normal curve
Many human abilities form a **bell-shaped** curve: most people near the middle, fewer at the extremes. Two numbers describe it:
- The **mean**: the average.
- The **standard deviation (SD)**: how spread out scores are.

:::widget guess
{
  "prompt": "On a normal curve, what share of people score within one standard deviation of the mean (for IQ, between 85 and 115)?",
  "min": 0,
  "max": 100,
  "unit": "per cent",
  "answer": [66, 70],
  "reveal": "About 68 per cent. About 95 per cent fall within two standard deviations (IQ 70 to 130) and about 99.7 per cent within three (IQ 55 to 145). So an IQ below 70 is in roughly the bottom 2 per cent.",
  "clinician": "Strictly, 68.3, 95.4 and 99.7 per cent for one, two and three SDs. An IQ of 70 is at about the 2nd percentile and 130 at about the 98th. These proportions hold only if the distribution is normal; at the extremes, real IQ distributions have more cases than the curve predicts (for example a 'bump' at the low end from genetic and acquired causes of intellectual disability)."
}
:::


:::widget curve
{
 "kind": "normal",
 "title": "The normal curve: z, percentile and IQ",
 "caption": "Drag the marker. Watch an IQ of 115 become z of plus 1 and about the 84th percentile, and an IQ of 70 become z of minus 2, about the 2nd percentile. Then find the IQ at the 50th percentile."
}
:::

### Kinds of standard scores
| Score | Mean | SD | Where you meet it |
|---|---|---|---|
| **z-score** | 0 | 1 | Statistics |
| **T-score** | 50 | 10 | MMPI scales, many personality tests |
| **IQ (deviation IQ)** | 100 | 15 | Wechsler and most modern IQ tests |
| **Scaled score** | 10 | 3 | Wechsler subtests |
| **Stanine** | 5 | About 2 | School tests (nine bands) |
| **Percentile** | | | Share of the norm group scoring lower |


:::widget curve
{
 "kind": "normal",
 "title": "Find the IQ bands on the curve",
 "caption": "Drag to IQ 130, then 70. Each is two standard deviations from the mean, and each tail holds only about 2 per cent of people. Then find the borderline band (70 to 79) and see how many people sit there."
}
:::

### IQ classification (as commonly used)
| IQ | Description |
|---|---|
| 130 and above | Very superior or gifted |
| 120 to 129 | Superior |
| 110 to 119 | High average (bright normal) |
| 90 to 109 | Average |
| 80 to 89 | Low average (dull normal) |
| 70 to 79 | Borderline |
| 69 and below | Range consistent with intellectual disability, **only if** adaptive functioning is also impaired and onset is in childhood |

:::trap IQ alone never diagnoses intellectual disability
DSM-5-TR and ICD-11 both require **deficits in adaptive functioning** (conceptual, social and practical), not just a low IQ. Severity (mild, moderate, severe, profound) is now set mainly by **adaptive functioning**, with IQ as supporting evidence.
:::

### Norm-referenced and criterion-referenced
- **Norm-referenced**: compares a person with others (an IQ score).
- **Criterion-referenced**: compares with a fixed standard of mastery (passing a driving test, reading a Class 3 text fluently).

:::widget worked
{
  "title": "Turning a raw score into meaning",
  "steps": [
    { "q": "Meena, 32, scores a T-score of 70 on an MMPI depression scale. How far above average is that?", "a": "T-scores have mean 50 and SD 10, so 70 is two SDs above the mean." },
    { "q": "What percentile is that roughly?", "a": "About the 98th percentile: higher than about 98 per cent of the norm group." },
    { "q": "What does it NOT tell you?", "a": "It does not diagnose depression, explain why, or say anything without checking validity scales, the interview and history. It is one strong piece of evidence of distress." }
  ],
  "yourTurn": [
    { "q": "Arjun, 10, gets a scaled score of 4 on a Wechsler subtest. Interpret it.", "a": "Scaled scores have mean 10, SD 3. A 4 is two SDs below the mean, around the 2nd percentile: a clear relative weakness, to be understood alongside his other subtests and his history." }
  ]
}
:::

:::clinician
Norm quality matters as much as the test. Check: when the norms were collected (the Flynn effect raised raw IQ performance by about 3 points per decade across the twentieth century in many countries, so old norms inflate IQ, though gains have slowed or reversed in some high-income countries since the 1990s); who was sampled (urban, educated, English-medium samples misrepresent rural or vernacular-schooled Indians); and whether demographically adjusted norms (for age, education, sometimes sex) exist. Age-equivalent and grade-equivalent scores are easily misread and statistically poor; avoid them in reports except as a parent-friendly illustration with caveats. DSM-5-TR moved intellectual disability severity to adaptive functioning domains and describes an IQ about two SDs below the mean, including the measurement error of roughly plus or minus 5 points, so scores around 65 to 75 may be compatible with the diagnosis when adaptive deficits are clear.
:::

:::recall
1. What are the mean and SD of IQ and of T-scores? || IQ: mean 100, SD 15. T-score: mean 50, SD 10.
2. What share of people fall within one and two SDs of the mean? || About 68 per cent and about 95 per cent.
3. What is a percentile? || The percentage of the norm group scoring below a given score.
4. What else, besides IQ, is needed to diagnose intellectual disability? || Deficits in adaptive functioning with onset in the developmental period.
:::

:::mcq
Q: An IQ of 115 lies:
- Two SDs above the mean
- *One SD above the mean
- At the mean
- One SD below the mean
> 100 plus 15.

Q: A child's reading is compared with a fixed standard of what a Class 3 child should read, regardless of other children. This is:
- Norm-referenced testing
- *Criterion-referenced testing
- A projective test
- A percentile rank
> Mastery against a fixed criterion.
:::

## 1.5 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: A psychological test is best defined as:
- A way of reading the mind
- *A standardised sample of behaviour compared with norms
- A diagnosis
- An interview without structure
> Standardised sample plus norms.

Q: Reliability refers to:
- Accuracy for a purpose
- *Consistency of results
- How pleasant a test is
- How long a test takes
> Reliability is consistency.

Q: Validity refers to:
- Consistency over time
- *Whether the test measures what it claims, for a purpose
- The number of items
- How many people have taken it
> Validity is about accurate, justified interpretation.

Q: A test given twice, a month apart, to the same people is being checked for:
- Inter-rater reliability
- *Test-retest reliability
- Construct validity
- Face validity
> Stability over time.

Q: Cronbach's alpha measures:
- Predictive validity
- *Internal consistency
- Test-retest stability
- Face validity
> Whether items hang together.

Q: An entrance exam that forecasts later academic success shows:
- Content validity
- *Predictive validity
- Inter-rater reliability
- Split-half reliability
> Prediction of a future criterion.

Q: Which is true?
- A valid test can be unreliable
- *A reliable test may not be valid
- Reliability and validity are the same
- Face validity proves real validity
> Consistency does not guarantee accuracy.

Q: The mean and SD of a deviation IQ are:
- 50 and 10
- 10 and 3
- *100 and 15
- 0 and 1
> Standard for Wechsler and most IQ tests.

Q: About what share of people score between IQ 70 and 130?
- 50 per cent
- 68 per cent
- *95 per cent
- 100 per cent
> Two SDs either side.

Q: The MMPI reports scores as:
- IQ scores
- *T-scores
- Stanines
- Raw scores only
> Mean 50, SD 10.

Q: An IQ of 75 is usually described as:
- Average
- Low average
- *Borderline
- Severe intellectual disability
> 70 to 79 is borderline.

Q: Intellectual disability requires:
- An IQ below 70 alone
- *Deficits in both intellectual and adaptive functioning, beginning in the developmental period
- A brain scan
- A projective test
> Adaptive functioning is essential.

Q: The Rorschach is an example of a:
- Rating scale
- *Projective test
- Neuropsychological battery
- Adaptive behaviour scale
> Responses to ambiguous inkblots.

Q: The HAM-D is used to rate:
- Intelligence
- *Severity of depression
- Personality
- Memory
> Hamilton Rating Scale for Depression.

Q: A test whose items seem obviously related to what it measures has high:
- *Face validity
- Predictive validity
- Discriminant validity
- Inter-rater reliability
> It looks right to the test-taker.
:::

# Part II · Beginner: the tests in depth

## 2.1 Psychometrics with numbers: error, cut-offs and base rates [core][beginner]
### Every score has error
No test is perfectly reliable, so every score is an estimate. The **standard error of measurement (SEM)** tells you how much a person's score would vary by chance. From it we build a **confidence interval**: "the true score probably lies between X and Y".

:::example Reporting an IQ honestly
Instead of "Priya's IQ is 72", write: "Priya's full scale IQ is 72 (95 per cent confidence interval 68 to 77), in the borderline range." The interval shows the reader that 72 is not an exact point, and that the score sits near an important boundary.
:::

### Screening tests: sensitivity and specificity
When a test sorts people into "probably has the condition" and "probably does not", four things can happen:
| | Really has it | Really does not |
|---|---|---|
| **Test positive** | True positive | False positive |
| **Test negative** | False negative | True negative |

- **Sensitivity**: of those who really have it, how many test positive? A sensitive test **misses few cases**.
- **Specificity**: of those who do not have it, how many test negative? A specific test **raises few false alarms**.
- **Positive predictive value (PPV)**: if the test is positive, how likely is the person to really have it?
- **Negative predictive value (NPV)**: if negative, how likely to be truly free of it?

:::mnemonic "SnNout and SpPin"
A highly **S**e**n**sitive test, when **N**egative, rules **out**. A highly **Sp**ecific test, when **P**ositive, rules **in**.
:::


:::widget sort
{
 "prompt": "Does each change raise or lower the positive predictive value of a screening test?",
 "buckets": [
  "Raises PPV",
  "Lowers PPV"
 ],
 "items": [
  {
   "text": "Using the test in a specialist clinic instead of the general public",
   "bucket": 0
  },
  {
   "text": "Lowering the cut-off so more people screen positive",
   "bucket": 1,
   "why": "More false positives join the positive group."
  },
  {
   "text": "Improving specificity",
   "bucket": 0
  },
  {
   "text": "Using it in a population where the condition is rare",
   "bucket": 1
  },
  {
   "text": "Screening only people with symptoms",
   "bucket": 0
  }
 ]
}
:::

### Base rates change everything
The **PPV depends on how common the condition is** in the group you are testing. The same test that works well in a psychiatry clinic gives many false positives in the general population.

:::widget worked
{
  "title": "Why a 'good' test gives many false alarms in the community",
  "steps": [
    { "q": "A depression screening test has 90 per cent sensitivity and 90 per cent specificity. You screen 1000 people in a village where 5 per cent are depressed. How many are truly depressed?", "a": "50 people (5 per cent of 1000). 950 are not." },
    { "q": "How many of the 50 depressed people test positive?", "a": "90 per cent of 50 = 45 true positives (5 are missed)." },
    { "q": "How many of the 950 non-depressed people falsely test positive?", "a": "10 per cent of 950 = 95 false positives." },
    { "q": "So if someone tests positive, what is the chance they are really depressed (PPV)?", "a": "45 out of 140 positives (45 plus 95) = about 32 per cent. Two out of three positives are false alarms." }
  ],
  "yourTurn": [
    { "q": "Use the same test in a psychiatry outpatient clinic in Chennai where 40 per cent of 1000 attendees are depressed. What is the PPV now?", "a": "400 depressed: 360 true positives. 600 not depressed: 60 false positives. PPV = 360 out of 420 = about 86 per cent. Same test, very different meaning, because the base rate changed." }
  ]
}
:::


:::widget curve
{
 "kind": "sdt",
 "title": "Moving a cut-off: hits and false alarms",
 "caption": "The two humps are people without and with the condition. Slide the cut-off left: you catch more true cases (sensitivity up) but raise more false alarms (specificity down). Pull the humps apart (better discrimination) and both improve together."
}
:::

### Choosing a cut-off is a trade-off
Lowering a cut-off catches more true cases (higher sensitivity) but raises more false alarms (lower specificity). For a dangerous, treatable condition (suicide risk), we accept more false alarms. For a label with heavy consequences, we want high specificity and a confirmatory assessment.

:::clinician
The receiver operating characteristic (ROC) curve plots sensitivity against 1 minus specificity across cut-offs; the area under the curve (AUC) summarises discrimination (0.5 chance; 0.7 to 0.8 acceptable; 0.8 to 0.9 good). The Youden index (sensitivity plus specificity minus 1) is one method for an "optimal" cut-off, but clinical cost weighting is usually better. Likelihood ratios (LR+ equals sensitivity divided by 1 minus specificity) are independent of prevalence and convert pre-test to post-test odds, which is the formal way to use base rates. Reliable change index tests whether a change between two scores exceeds measurement error; clinically significant change additionally requires moving into the functional range. These matter when you judge whether therapy "worked" from rating scales.
:::

:::recall
1. What is the standard error of measurement used for? || To build a confidence interval around an individual's score.
2. Define sensitivity and specificity. || Sensitivity: proportion of true cases who test positive. Specificity: proportion of non-cases who test negative.
3. What does "SnNout, SpPin" mean? || A negative result on a highly sensitive test rules out; a positive result on a highly specific test rules in.
4. Why does PPV fall in the general population? || Because the condition is rarer (lower base rate), so false positives outnumber true positives.
:::

:::mcq
Q: A dementia screening test rarely misses true cases. It has high:
- Specificity
- *Sensitivity
- Positive predictive value in all settings
- Face validity
> Few false negatives means high sensitivity.

Q: The same screening test is used in a memory clinic and in a general community survey. Its positive predictive value will be:
- The same in both
- *Higher in the memory clinic, where the condition is more common
- Higher in the community
- Zero in the community
> PPV rises with base rate.
:::

## 2.2 Intelligence tests: Wechsler, Binet and the Indian scales [core][beginner]
### What "intelligence" means
- **Spearman**: a general factor (**g**) underlies all mental tasks, plus specific abilities.
- **Thurstone**: several primary mental abilities rather than one g.
- **Cattell and Horn**: **fluid** intelligence (solving new problems; peaks early, declines with age) and **crystallised** intelligence (knowledge and vocabulary; keeps growing).
- **Cattell-Horn-Carroll (CHC) theory**: a three-layer model with g at the top, broad abilities in the middle and narrow skills at the bottom. Most modern tests are built on it.
- **Gardner**: multiple intelligences (linguistic, logical-mathematical, spatial, musical, bodily-kinaesthetic, interpersonal, intrapersonal, naturalistic). Popular in schools, weak research support.
- **Sternberg**: triarchic theory: analytical, creative and practical intelligence.


:::widget layers
{
 "title": "Intelligence as a hierarchy (CHC model)",
 "shape": "pyramid",
 "layers": [
  {
   "label": "g: general ability",
   "detail": "The common factor behind performance on all mental tests."
  },
  {
   "label": "Broad abilities",
   "detail": "Fluid reasoning, crystallised knowledge, visual processing, working memory, processing speed, long-term retrieval and others."
  },
  {
   "label": "Narrow abilities",
   "detail": "Specific skills such as vocabulary, inductive reasoning, digit span, spatial scanning."
  }
 ],
 "caption": "Modern IQ tests are built on this three-level model. The Wechsler index scores sit at the middle level and the full scale IQ estimates g."
}
:::

### The Wechsler scales
David Wechsler built tests that give a **deviation IQ** (mean 100, SD 15) and a profile of strengths and weaknesses.

| Test | Age range | Note |
|---|---|---|
| **WPPSI** | Preschool | For young children |
| **WISC** | About 6 to 16 | WISC-IV India has Indian norms |
| **WAIS** | 16 and above | WAIS-IV India has Indian norms |

**WAIS-IV structure**: four index scores combine into a Full Scale IQ.
| Index | Core subtests | What it taps |
|---|---|---|
| **Verbal Comprehension (VCI)** | Similarities, Vocabulary, Information | Verbal reasoning and knowledge |
| **Perceptual Reasoning (PRI)** | Block Design, Matrix Reasoning, Visual Puzzles | Non-verbal reasoning, visual-spatial skill |
| **Working Memory (WMI)** | Digit Span, Arithmetic | Holding and manipulating information |
| **Processing Speed (PSI)** | Symbol Search, Coding | Speed of simple visual processing |

The **General Ability Index (GAI)** uses only VCI and PRI; it is useful when working memory or speed are pulled down by depression, ADHD or brain injury.

### Binet scales and the Binet-Kamat test
Alfred Binet and Théodore Simon made the first practical intelligence test in Paris (1905) to identify children needing extra help at school. Lewis Terman's **Stanford-Binet** (1916) introduced the ratio IQ (mental age divided by chronological age, times 100). In India, **V. V. Kamat** adapted the Binet scale for Indian children (the **Binet-Kamat Test**, first published in the 1930s and later revised). It is an **age-scale** test: items are arranged by the age at which most children pass them, giving a mental age. It is still widely used in India, especially for assessing intellectual disability.

### Malin's Intelligence Scale for Indian Children (MISIC)
**A. J. Malin** in Nagpur adapted the WISC for Indian children (published 1969). It has **verbal** subtests (information, comprehension, arithmetic, analogies and similarities, vocabulary, digit span) and **performance** subtests (picture completion, block design, object assembly, coding, mazes), giving verbal, performance and full scale IQs for school-age children.


:::widget build
{
 "vignette": "Pooja, 14, in a Marathi-medium school in Nashik, scores a full scale IQ of 64 on MISIC (likely range 60 to 69). Her mother says she cannot travel alone, struggles to handle money or tell time, needs reminders to bathe, and has few friends. She was slow to talk and walk. Vision and hearing are normal.",
 "rule": "Tick what is present. Intellectual disability needs deficits in intellectual functioning and in adaptive functioning (conceptual, social or practical), with onset in the developmental period.",
 "symptoms": [
  {
   "label": "Intellectual functioning about two standard deviations below the mean",
   "present": true,
   "core": true
  },
  {
   "label": "Conceptual adaptive deficits (money, time)",
   "present": true,
   "core": true
  },
  {
   "label": "Social adaptive deficits (few friends)",
   "present": true
  },
  {
   "label": "Practical adaptive deficits (travel, self-care)",
   "present": true
  },
  {
   "label": "Onset in childhood (late milestones)",
   "present": true,
   "core": true
  },
  {
   "label": "Sudden decline after a head injury last year",
   "present": false,
   "why": "Absent; a recent acquired decline would suggest a neurocognitive disorder instead."
  }
 ],
 "need": 3,
 "needCore": true,
 "verdict": "The criteria for intellectual disability are met: low measured ability, adaptive deficits across domains, and childhood onset. Severity is judged mainly from adaptive functioning (here probably mild). Use VSMS or a similar adaptive scale for certification, and plan educational support."
}
:::

### Other Indian and non-verbal tests
- **Bhatia's Battery of Performance Tests** (C. M. Bhatia, 1955): performance tasks such as Koh's block design, Alexander's pass-along, pattern drawing, immediate memory and picture construction. Useful for people with little schooling.
- **Raven's Progressive Matrices**: non-verbal pattern reasoning (Standard, Coloured for children and older adults, Advanced). Reduces, but does not remove, cultural and educational influence.
- **Seguin Form Board**: placing shapes in a board; used with young children and people with intellectual disability.
- **Vineland Social Maturity Scale (VSMS)**, Indian adaptation: measures **adaptive** functioning through an interview with a carer, giving a social age and **social quotient**.

:::widget sort
{
  "prompt": "Choose the best-fitting test for each situation.",
  "buckets": ["WAIS-IV India", "MISIC or WISC", "Binet-Kamat", "Raven's matrices", "VSMS"],
  "items": [
    { "text": "An English-educated 28-year-old engineer after a head injury, needing a full ability profile", "bucket": 0 },
    { "text": "A 4-year-old with delayed speech, to estimate mental age", "bucket": 2 },
    { "text": "A 10-year-old in a Marathi-medium school struggling in Class 5, needing verbal and performance IQ", "bucket": 1 },
    { "text": "A 35-year-old migrant worker who never attended school, needing a quick non-verbal reasoning estimate", "bucket": 3 },
    { "text": "Finding out how independently a 12-year-old with Down syndrome dresses, travels and handles money", "bucket": 4 }
  ]
}
:::

:::widget decide
{
  "scene": "Kavita, 22, from a village near Nanded, studied up to Class 4 in Marathi. She is brought for a disability certificate. A trainee gives the full WAIS-IV India in English through an interpreter and reports a full scale IQ of 61.",
  "ask": "What is the main problem with this result?",
  "choices": [
    { "label": "Nothing; the WAIS is the gold standard", "verdict": "harm", "outcome": "She is labelled as having intellectual disability though she runs a household, manages money and sells vegetables at the market.", "why": "Language, schooling and the norm group all depress her score. A test is only valid for people like those it was normed on, and adaptive functioning was ignored." },
    { "label": "The test, its language and its norms do not suit her background; use a non-verbal or culturally suitable test, adaptive functioning (VSMS or similar), and history before any conclusion", "verdict": "best", "outcome": "On a non-verbal test and adaptive assessment she is in the low average range. No disability certificate is issued; she gets help with literacy instead.", "why": "Validity depends on the person matching the norm group. Intellectual disability needs adaptive deficits." },
    { "label": "Repeat the same test next week for reliability", "verdict": "ok", "outcome": "She scores 63. The problem remains.", "why": "Repeating an unsuitable test gives a reliable but still invalid score." }
  ]
}
:::

:::clinician
Interpretation hierarchy: start with the full scale IQ (or GAI), then index scores, then (cautiously) subtest patterns; base rates of index discrepancies in the standardisation sample matter, since differences of 15 or more points between indices occur in a sizeable minority of healthy people. "Subtest scatter" analysis to diagnose specific disorders (for example the ACID profile for learning disability) has poor validity. WAIS-5 was published in the US in 2024 with a revised index structure (including separate visual spatial and fluid reasoning indices, following the WISC-V model); check Indian norm availability before using any new edition. In Indian practice, Binet-Kamat and MISIC remain common because they are familiar, cheap and accepted by certification boards, but their norms are old; the Flynn effect means they may overestimate current IQ. Under the guidelines notified under the RPwD Act (2018, amended 2020), intellectual disability certification uses standardised intelligence testing together with adaptive assessment (such as VSMS), with the disability percentage assigned by band and certification by a notified medical board including a clinical or rehabilitation psychologist.
:::

:::recall
1. What are fluid and crystallised intelligence? || Fluid: solving new problems (peaks early). Crystallised: accumulated knowledge and vocabulary (keeps growing).
2. Name the four WAIS-IV index scores. || Verbal Comprehension, Perceptual Reasoning, Working Memory, Processing Speed.
3. Who adapted the Binet scale and the WISC for Indian children? || V. V. Kamat (Binet-Kamat) and A. J. Malin (MISIC).
4. When is the General Ability Index useful? || When working memory or processing speed are lowered (for example by depression, ADHD or brain injury) and would pull down the full scale IQ.
5. Which Indian test measures adaptive functioning? || The Vineland Social Maturity Scale (Indian adaptation), giving a social quotient.
:::

:::mcq
Q: Which Wechsler index is most affected by slow, careful working in a depressed patient?
- Verbal Comprehension
- Perceptual Reasoning
- *Processing Speed
- None
> Speeded tasks like Coding and Symbol Search suffer.

Q: The Binet-Kamat test is mainly an:
- Objective personality inventory
- *Age-scale intelligence test giving mental age, adapted for Indian children
- Projective test
- Neuropsychological battery for adults
> Kamat's adaptation of the Binet scale.

Q: The best test of non-verbal reasoning with minimal language demands is:
- WAIS-IV Vocabulary
- *Raven's Progressive Matrices
- MMPI-2
- TAT
> Pattern-based matrices reduce language load.
:::

## 2.3 Objective personality tests: MMPI, 16PF and others [core][beginner]
"Objective" here means the **scoring** is fixed (true or false, multiple choice), not that the test is free of bias.

### The MMPI family
The **Minnesota Multiphasic Personality Inventory** (Hathaway and McKinley, 1940s) was built by **empirical criterion keying**: items were kept if they separated patient groups from healthy people, whatever their content.

- **MMPI-2** (1989): 567 true-or-false items, for adults.
- **MMPI-2-RF** (2008): a shorter, restructured version.
- **MMPI-3** (2020): the newest, with updated norms.
- **MMPI-A**: for adolescents.

**Validity scales** check how the person approached the test:
| Scale | What it detects |
|---|---|
| **L (Lie)** | Presenting oneself as unrealistically virtuous |
| **F (Infrequency)** | Reporting rare, extreme problems: severe distress, random answering or exaggeration |
| **K (Correction)** | Defensiveness, guardedness |
| **VRIN and TRIN** | Inconsistent or all-true or all-false answering |

**The ten clinical scales of the MMPI-2**
| Number | Scale | Main theme |
|---|---|---|
| 1 | Hypochondriasis (Hs) | Bodily concerns |
| 2 | Depression (D) | Low mood, hopelessness |
| 3 | Hysteria (Hy) | Physical symptoms under stress, denial |
| 4 | Psychopathic deviate (Pd) | Rule-breaking, family conflict |
| 5 | Masculinity-femininity (Mf) | Gender-typed interests |
| 6 | Paranoia (Pa) | Suspiciousness |
| 7 | Psychasthenia (Pt) | Anxiety, worry, obsessions |
| 8 | Schizophrenia (Sc) | Unusual thinking, alienation |
| 9 | Hypomania (Ma) | High energy, impulsivity |
| 0 | Social introversion (Si) | Shyness, withdrawal |

On the MMPI-2, a T-score of **65 or above** is usually treated as clinically significant.


:::widget sort
{
 "prompt": "Match the theme to the MMPI-2 clinical scale.",
 "buckets": [
  "2 Depression",
  "4 Psychopathic deviate",
  "6 Paranoia",
  "7 Psychasthenia",
  "8 Schizophrenia"
 ],
 "items": [
  {
   "text": "Hopelessness, low mood, guilt",
   "bucket": 0
  },
  {
   "text": "Rule-breaking and family conflict",
   "bucket": 1
  },
  {
   "text": "Suspiciousness and feeling persecuted",
   "bucket": 2
  },
  {
   "text": "Worry, tension, obsessional thinking",
   "bucket": 3
  },
  {
   "text": "Unusual thoughts, alienation",
   "bucket": 4
  }
 ]
}
:::

:::mnemonic Ten scales: "Hot Dogs Help People Make Perfect Pickles So Many Snack"
**H**s, **D**, **H**y, **P**d, **M**f, **P**a, **P**t, **S**c, **M**a, **S**i.
:::


:::widget flow
{
 "title": "Reading an MMPI profile in order",
 "layout": "chain",
 "nodes": [
  {
   "id": "v",
   "label": "Validity first",
   "detail": "Cannot Say, VRIN and TRIN (consistency), then F family (overreporting) and L and K (underreporting)."
  },
  {
   "id": "d",
   "label": "Decide if interpretable",
   "detail": "If validity is poor, say so and stop; the clinical scales cannot be trusted."
  },
  {
   "id": "c",
   "label": "Clinical scales",
   "detail": "Which are at T 65 or above? Look at the two highest together (code type)."
  },
  {
   "id": "s",
   "label": "Subscales and restructured scales",
   "detail": "Clarify what is driving an elevation."
  },
  {
   "id": "i",
   "label": "Integrate",
   "detail": "Compare with interview, history and other tests before writing anything."
  }
 ],
 "caption": "Skipping the first box is the commonest serious error in personality test reports."
}
:::

### Other questionnaires
| Test | Basis | What it gives |
|---|---|---|
| **16PF** (Raymond Cattell) | Factor analysis of personality words | 16 primary factors (warmth, reasoning, emotional stability, dominance and so on) and five global factors |
| **NEO-PI-3** (Costa and McCrae) | Big Five model | Neuroticism, Extraversion, Openness, Agreeableness, Conscientiousness, with facets |
| **EPQ** (Eysenck) | Biological theory | Extraversion, Neuroticism, Psychoticism, and a Lie scale |
| **MCMI-IV** (Millon) | Millon's theory | Personality patterns and clinical syndromes, aligned to diagnostic categories |

:::mnemonic Big Five: "OCEAN"
**O**penness, **C**onscientiousness, **E**xtraversion, **A**greeableness, **N**euroticism.
:::

:::widget decide
{
  "scene": "In a custody dispute in Pune, Mr Joshi completes the MMPI-2. His L and K scales are very high and all clinical scales are low. His lawyer says the report should state he 'has no psychological problems'.",
  "ask": "What should the report say?",
  "choices": [
    { "label": "State that he has no psychological problems", "verdict": "harm", "outcome": "The court relies on an invalid profile; later evidence contradicts it and your credibility suffers.", "why": "High L and K show strong defensiveness and a wish to look good, which suppresses clinical scales. The profile cannot be read as healthy." },
    { "label": "Report that the profile is of questionable validity because of marked defensiveness, common in custody evaluations, so clinical scales are likely to underestimate any problems; rely on other sources", "verdict": "best", "outcome": "The court understands the limits and weighs interviews, collateral reports and observation.", "why": "Validity scales exist to tell you when to trust the clinical scales. Defensive responding is expected in custody settings and must be reported honestly." },
    { "label": "Rescore the test until it looks normal", "verdict": "harm", "outcome": "Unethical; this is manipulation of evidence.", "why": "Never alter scoring to fit a desired outcome." }
  ]
}
:::

:::clinician
Interpretation of the MMPI-2 relies on validity configuration first (Cannot Say, VRIN, TRIN, F, Fb, Fp, FBS, L, K, S), then two-point code types (for example 2-7 anxious depression; 4-9 impulsive acting out; 6-8 paranoid and thought-disordered; 1-3 "conversion V" with somatic focus and denial), with Harris-Lingoes subscales and the Restructured Clinical scales to clarify. The MMPI-2-RF (338 items) and MMPI-3 (335 items) use restructured scales that remove a general demoralisation factor, improving discriminant validity, and are increasingly preferred in forensic work. Fp (infrequency-psychopathology) is the best scale for detecting overreported psychotic symptoms. Indian use: the MMPI-2 and 16PF have been translated and studied in Indian samples, but published Indian norms are limited and dated, so US norms are often used with caution; cultural item differences (religious content, family items) can elevate certain scales. The NEO-PI-3 and the briefer Big Five Inventory have the strongest cross-cultural replication, including Indian samples (McCrae's 50-culture study).
:::

:::recall
1. How was the MMPI built? || By empirical criterion keying: keeping items that separated clinical groups from controls.
2. Name four MMPI validity scales and what they detect. || L (unrealistic virtue), F (rare extreme responding), K (defensiveness), VRIN and TRIN (inconsistent or all-true or all-false answering).
3. What T-score on the MMPI-2 is usually clinically significant? || 65 or above.
4. What are the Big Five? || Openness, conscientiousness, extraversion, agreeableness, neuroticism.
:::

:::mcq
Q: A very high F scale on the MMPI-2 most likely indicates:
- Defensiveness
- *Severe distress, random responding or exaggeration of problems
- Excellent mental health
- High intelligence
> F detects infrequent, extreme responding.

Q: The 16PF was developed by:
- Hathaway and McKinley
- *Raymond Cattell
- Hans Eysenck
- Theodore Millon
> Cattell's factor-analytic approach.
:::

## 2.4 Projective tests: Rorschach, TAT and others [core][beginner]
Projective tests give **unclear or open material** and ask people to make sense of it. The idea is that people "project" their own ways of perceiving, needs and conflicts into their answers.

### Rorschach inkblot test
- Hermann Rorschach, a Swiss psychiatrist, published it in 1921.
- **Ten cards**: five black and grey, two black-grey with red, three multicoloured.
- Two phases: **response** ("What might this be?") and **inquiry** ("What made it look like that?").
- Responses are coded for **location** (whole blot, large detail, small detail, white space), **determinants** (form, colour, shading, movement), **content** (human, animal, anatomy) and **form quality** (how well the answer fits the blot).
- Main scoring systems: **Exner's Comprehensive System** (1970s onwards) and the newer **Rorschach Performance Assessment System (R-PAS)** (2011).

### Thematic Apperception Test (TAT)
- Henry Murray and Christiana Morgan, Harvard, 1935.
- **31 cards** (including one blank), of which a clinician usually picks around 10.
- The person tells a story for each picture: what is happening, what led up to it, what people feel and think, how it ends.
- Murray interpreted stories in terms of the hero's **needs** and the environment's **press** (pressures).
- **Indian adaptation**: Uma Chowdhury developed an Indian TAT (1960) with pictures showing Indian settings and people.
- The **Children's Apperception Test (CAT)** (Bellak) uses animal pictures for young children.


:::widget layers
{
 "title": "How strong is the evidence? Projective indices",
 "shape": "stack",
 "layers": [
  {
   "label": "Better supported",
   "detail": "Rorschach perceptual accuracy (form quality) and thought disorder indices; some TAT coding systems for object relations."
  },
  {
   "label": "Mixed",
   "detail": "Many other Rorschach variables; dependency indicators; general TAT impressions."
  },
  {
   "label": "Poorly supported",
   "detail": "Single drawing features as signs of abuse or personality; colour preferences; intuitive symbol reading."
  }
 ],
 "caption": "Report only from the top layer with confidence; treat the rest as hypotheses to check."
}
:::


:::widget compare
{
 "title": "Objective and projective tests",
 "a": {
  "label": "Objective",
  "points": [
   "Fixed answer formats",
   "Standard scoring keys",
   "Validity scales detect faking",
   "Generally high reliability"
  ],
  "summary": "Efficient and reliable; limited by self-report."
 },
 "b": {
  "label": "Projective",
  "points": [
   "Open responses to unclear material",
   "Coding systems needing training",
   "Harder to fake consciously",
   "Reliability and validity vary by index"
  ],
  "summary": "Rich but use only well-supported indices."
 },
 "caption": "Slide between them and decide which you would use for a court report, and why."
}
:::

### Other projective methods
- **Sentence completion** ("My mother...", "I am afraid of..."): quick and often clinically rich.
- **Draw-a-Person** and **House-Tree-Person**: drawings, used especially with children.
- **Rosenzweig Picture-Frustration Study**: reactions to cartoon frustrations.

:::widget sort
{
  "prompt": "Rorschach or TAT?",
  "buckets": ["Rorschach", "TAT"],
  "items": [
    { "text": "Ten inkblot cards", "bucket": 0 },
    { "text": "Stories about pictures of people in ambiguous situations", "bucket": 1 },
    { "text": "Scored for location, determinants, content and form quality", "bucket": 0 },
    { "text": "Interpreted through needs and press", "bucket": 1 },
    { "text": "Exner's Comprehensive System", "bucket": 0 },
    { "text": "Indian adaptation by Uma Chowdhury", "bucket": 1 },
    { "text": "Includes one blank card", "bucket": 1 }
  ]
}
:::

:::trap How good are projective tests?
This is a long-running debate. Some Rorschach scores (especially indicators of **thought disorder** and **perceptual accuracy**, and some measures of dependency) have good evidence. Many others, and much of the interpretation of drawings, do not. Projective tests should **never** be used alone to diagnose, to "prove" abuse, or in court without strong justification.
:::

:::widget decide
{
  "scene": "A school counsellor in Kanpur shows you a 7-year-old's drawing of a person with no hands and large eyes and says, 'This proves the child is being sexually abused. We must call the police.'",
  "ask": "What is the most responsible reply?",
  "choices": [
    { "label": "Agree; drawings like this are diagnostic of abuse", "verdict": "harm", "outcome": "A family is falsely accused on the basis of a drawing; the child is traumatised by the process.", "why": "No drawing feature reliably indicates abuse. Treating it as proof is scientifically wrong and harmful." },
    { "label": "Explain that drawings cannot diagnose abuse; ask what else has worried staff (what the child has said, behaviour changes, injuries), and follow the school's child-protection procedure, which under POCSO means reporting any genuine suspicion based on real information", "verdict": "best", "outcome": "The counsellor gathers concrete observations; there is no disclosure or other concern, and the child is supported for anxiety at home after a family bereavement.", "why": "Child safety is taken seriously, through evidence and proper procedure, not test signs. A real disclosure or reasonable suspicion must be reported." },
    { "label": "Tell the counsellor to ignore it", "verdict": "ok", "outcome": "If there were other warning signs, they might be missed.", "why": "The drawing is not evidence, but the counsellor's worry deserves a careful look at other information." }
  ]
}
:::

:::clinician
Meta-analytic evidence: Mihura's group reviewed Comprehensive System variables against external criteria and found good validity for several cognitive and perceptual variables (for example the Perceptual-Thinking Index, form quality minus, weighted special scores) and poor support for many others; these findings shaped R-PAS, which retains supported variables, uses international norms and controls the number of responses (the "R-optimised" procedure). The Exner CS norms were criticised for overpathologising non-patients. TAT has no universally accepted scoring; research systems with reasonable reliability include McClelland's need for achievement, affiliation and power, and Westen's Social Cognition and Object Relations Scale (SCORS), which has supportive validity for personality pathology. Lilienfeld, Wood and Garb remain the key sceptical review. Human figure drawings have weak validity for personality or abuse but some value as rough developmental indicators (Goodenough-Harris). In India, projective use remains common in training and hospital settings; teach students to report only well-supported indices and to frame others as hypotheses.
:::

:::recall
1. How many Rorschach cards are there, and what are the four scoring dimensions? || Ten; location, determinants, content and form quality.
2. Who created the TAT and how is it interpreted? || Murray and Morgan (1935); stories interpreted through the hero's needs and environmental press.
3. Who developed the Indian TAT? || Uma Chowdhury.
4. Which Rorschach indicators have the best support? || Thought disorder and perceptual accuracy measures (form quality), among a few others.
:::

:::mcq
Q: In the Rorschach, "determinants" refer to:
- Which part of the blot is used
- *What features (form, colour, shading, movement) shaped the response
- The person's age
- How long the person took
> Determinants are the blot properties used.

Q: The CAT differs from the TAT mainly in:
- Using inkblots
- *Using animal pictures for young children
- Being a questionnaire
- Measuring IQ
> Bellak's Children's Apperception Test.
:::

## 2.5 Rating scales: HAM-D, BPRS, PANSS, Y-BOCS and more [core][beginner]
Rating scales measure **how severe** symptoms are, and track change over time. Some are **clinician-rated** (the clinician interviews and scores), others are **self-rated** (the patient fills it in).

### The scales you must know
| Scale | Measures | Rated by | Items and range |
|---|---|---|---|
| **HAM-D** (Hamilton Depression) | Depression severity | Clinician | Usually 17 items; 0 to 52 |
| **MADRS** (Montgomery-Åsberg) | Depression, sensitive to change | Clinician | 10 items; 0 to 60 |
| **BDI-II** (Beck Depression Inventory) | Depression | Self | 21 items; 0 to 63 |
| **PHQ-9** | Depression screening and severity | Self | 9 items; 0 to 27 |
| **HAM-A** (Hamilton Anxiety) | Anxiety | Clinician | 14 items; 0 to 56 |
| **GAD-7** | Anxiety screening | Self | 7 items; 0 to 21 |
| **YMRS** (Young Mania) | Mania | Clinician | 11 items; 0 to 60 |
| **BPRS** (Brief Psychiatric Rating Scale) | General psychopathology, especially psychosis | Clinician | 18 items, each 1 to 7 |
| **PANSS** (Positive and Negative Syndrome Scale) | Schizophrenia | Clinician | 30 items: 7 positive, 7 negative, 16 general; each 1 to 7; total 30 to 210 |
| **SANS and SAPS** | Negative and positive symptoms | Clinician | Andreasen's detailed scales |
| **Y-BOCS** (Yale-Brown Obsessive Compulsive Scale) | OCD severity | Clinician | 10 items (5 obsessions, 5 compulsions); 0 to 40 |
| **AUDIT** | Harmful alcohol use | Self or clinician | 10 items; 0 to 40 |
| **CIWA-Ar** | Alcohol withdrawal | Clinician | 10 items; guides treatment |
| **AIMS** | Tardive dyskinesia | Clinician | Body areas rated |
| **MMSE** and **MoCA** | Cognitive screening | Clinician | 30 points each |

:::widget guess
{
  "prompt": "On the PHQ-9 (scored 0 to 27), what score is widely used as the cut-off suggesting at least moderate depression that needs assessment?",
  "min": 0,
  "max": 27,
  "unit": "points",
  "answer": [10, 10],
  "reveal": "10 or more. The bands are 5, 10, 15 and 20 for mild, moderate, moderately severe and severe. Item 9 asks about thoughts of death or self-harm, and any positive answer needs a direct risk conversation the same day, whatever the total.",
  "clinician": "A cut-off of 10 gave sensitivity and specificity of about 85 per cent each in the original primary care validation, with broadly similar performance in individual participant data meta-analysis, though accuracy varies by setting. Hindi and other Indian-language versions are validated; for low-literacy settings it is read aloud."
}
:::


:::widget sort
{
 "prompt": "Clinician-rated or self-rated?",
 "buckets": [
  "Clinician-rated",
  "Self-rated"
 ],
 "items": [
  {
   "text": "HAM-D",
   "bucket": 0
  },
  {
   "text": "PHQ-9",
   "bucket": 1
  },
  {
   "text": "PANSS",
   "bucket": 0
  },
  {
   "text": "BDI-II",
   "bucket": 1
  },
  {
   "text": "YMRS",
   "bucket": 0
  },
  {
   "text": "GAD-7",
   "bucket": 1
  },
  {
   "text": "CIWA-Ar",
   "bucket": 0
  }
 ]
}
:::

### Y-BOCS severity bands
| Total | Severity |
|---|---|
| 0 to 7 | Subclinical |
| 8 to 15 | Mild |
| 16 to 23 | Moderate |
| 24 to 31 | Severe |
| 32 to 40 | Extreme |

:::widget sort
{
  "prompt": "Pick the best scale for each job.",
  "buckets": ["PANSS", "Y-BOCS", "HAM-D or MADRS", "YMRS", "CIWA-Ar"],
  "items": [
    { "text": "Tracking a man's handwashing and checking over a course of exposure therapy", "bucket": 1 },
    { "text": "Measuring positive and negative symptoms in a schizophrenia drug trial", "bucket": 0 },
    { "text": "Deciding how much benzodiazepine to give a man on day two after stopping alcohol", "bucket": 4 },
    { "text": "Rating a woman's pressured speech, irritability and reduced sleep on admission", "bucket": 3 },
    { "text": "Measuring change in depression severity across an antidepressant trial", "bucket": 2 }
  ]
}
:::

:::trap A scale is not a diagnosis
A high HAM-D score shows many depressive symptoms; it does not tell you whether the cause is major depression, bipolar depression, hypothyroidism or grief. Diagnose by interview and criteria; use scales to **measure** and **monitor**.
:::

:::widget decide
{
  "scene": "In an OPD in Kolkata, a busy resident gives every patient a BDI-II to fill in while waiting. Mr Ghosh, 60, who can read only a little Bengali, ticks the first option on every item and scores 0.",
  "ask": "What should happen?",
  "choices": [
    { "label": "Record 'no depression' and move on", "verdict": "harm", "outcome": "His severe depression and suicidal thoughts are missed.", "why": "A self-rated scale is invalid if the person cannot read or understand it. A zero here means nothing." },
    { "label": "Recognise the result as invalid, read a validated Bengali version aloud or use a clinician-rated scale, and interview him", "verdict": "best", "outcome": "On interview he describes three months of low mood and thoughts of ending his life; he is assessed and treated.", "why": "Choose the format to fit the person. Clinician-rated or read-aloud versions suit low literacy." },
    { "label": "Give him the English version instead", "verdict": "harm", "outcome": "The same problem, worse.", "why": "Language barriers invalidate self-report." }
  ]
}
:::

:::clinician
The HAM-D-17's psychometric problems are well documented: multidimensional structure, weak item-level reliability for some items and items (insomnia, weight) that move in opposite directions in atypical depression. The six-item HAM-D (Bech's melancholia subscale) is more unidimensional and sensitive to drug effects. Common bands for HAM-D-17: 0 to 7 normal or remission; 8 to 16 mild; 17 to 23 moderate; 24 and above severe, though thresholds vary between sources. Response in trials is usually a 50 per cent fall from baseline; remission on HAM-D is 7 or less and on MADRS about 10 or less. PANSS was developed by Kay, Fiszbein and Opler (1987); five-factor solutions (positive, negative, disorganised, excited, depressed) are used in research, and a 20 to 25 per cent reduction is a common minimal response criterion in schizophrenia trials. BPRS is quicker and widely used in Indian clinical work. Y-BOCS has a symptom checklist plus the 10-item severity scale; a 35 per cent reduction is the conventional response threshold, and Y-BOCS-II (2010) extended the item scores. Use structured interviews (SCID-5, MINI, and in India the culturally adapted MINI versions) for diagnosis, not severity scales.
:::

:::recall
1. Which scales are clinician-rated for depression, and which are self-rated? || Clinician: HAM-D, MADRS. Self: BDI-II, PHQ-9.
2. How many items does PANSS have and how are they split? || 30: 7 positive, 7 negative, 16 general psychopathology.
3. What is the range and structure of the Y-BOCS? || 0 to 40; 5 obsession and 5 compulsion items.
4. What does CIWA-Ar guide? || Treatment of alcohol withdrawal.
5. Why can a self-report scale give a misleading score? || Low literacy, language, poor understanding, or deliberate under- or over-reporting.
:::

:::mcq
Q: A PANSS total score can range from:
- 0 to 52
- 0 to 40
- *30 to 210
- 18 to 126
> 30 items each scored 1 to 7.

Q: A Y-BOCS score of 28 indicates:
- Subclinical OCD
- Mild OCD
- Moderate OCD
- *Severe OCD
> 24 to 31 is severe.

Q: Which is a clinician-rated mania scale?
- PHQ-9
- BDI-II
- *YMRS
- AUDIT
> Young Mania Rating Scale.
:::

## 2.6 Neuropsychological assessment and the Indian batteries [core][beginner]
Neuropsychological tests measure thinking skills that depend on particular brain systems. They help answer: Is there a cognitive problem? What kind? How severe? How does it affect daily life? Has it changed over time?

:::widget figure
{"id": "brodmann"}
:::

:::widget figure
{"id": "prefrontal"}
:::

### Bedside screening tests
| Test | What it is | Note |
|---|---|---|
| **MMSE** (Mini-Mental State Examination) | 30 points: orientation, registration, attention, recall, language, copying | Insensitive to frontal problems; affected by education |
| **MoCA** (Montreal Cognitive Assessment) | 30 points, more executive and visuospatial items | Better for mild cognitive impairment; 26 or more is usually normal |
| **HMSE** (Hindi Mental State Examination) | Adapted for Hindi speakers with low literacy | Developed in a rural Indian dementia study |
| **ACE-III** (Addenbrooke's) | 100 points across five domains | Several Indian-language versions validated |
| **Clock drawing** | Draw a clock showing ten past eleven | Quick test of planning and visuospatial skill |


:::widget brainmap
{
 "title": "What neuropsychological tests probe",
 "focus": [
  "prefrontal",
  "hippocampus",
  "temporal",
  "parietal",
  "occipital",
  "motor"
 ],
 "notes": {
  "prefrontal": "Executive tests: Wisconsin Card Sorting, Stroop, Trail Making B or Colour Trails, verbal fluency, Tower of London.",
  "hippocampus": "New learning and delayed recall: word list learning, logical memory, complex figure recall.",
  "temporal": "Naming and semantic knowledge; verbal memory on the left.",
  "parietal": "Visuospatial and constructional tasks: figure copy, block design, clock drawing.",
  "occipital": "Visual perception and visual field screening.",
  "motor": "Finger tapping and other motor speed tasks."
 },
 "caption": "Patterns across tests, not single scores, point to where a problem lies."
}
:::

### Fixed and flexible batteries
- **Fixed batteries** give the same set of tests to everyone (the **Halstead-Reitan** and **Luria-Nebraska** batteries are classic Western examples).
- **Flexible (hypothesis-testing) approaches** choose tests to answer the specific question. Most modern practice is flexible, built around a core set.

### Key Indian batteries
| Battery | Developed at | What it includes | Use |
|---|---|---|---|
| **PGI Battery of Brain Dysfunction (PGI-BBD)** | PGIMER Chandigarh (Pershad and Verma) | PGI Memory Scale, Verbal Adult Intelligence Scale, Bhatia's short performance tests, Nahor-Benson test (perceptual), Bender Visual Motor Gestalt Test | Widely used to screen for and grade brain dysfunction in adults |
| **PGI Memory Scale** | PGIMER (Pershad and Wig) | Ten subtests: remote and recent memory, mental balance, attention and concentration, delayed and immediate recall, verbal retention for similar and dissimilar pairs, visual retention, recognition | Memory assessment in Indian adults |
| **NIMHANS Neuropsychological Battery** | NIMHANS Bengaluru (Rao, Subbakrishna, Gopukumar) | Tests of motor speed, attention (for example colour trails, digit vigilance), executive functions (verbal fluency, Tower of London, Wisconsin Card Sorting, Stroop), comprehension, learning and memory (auditory verbal learning, complex figure, logical memory) and visuospatial skill, with Indian norms by age and education | Detailed adult assessment; separate child and elderly versions exist |
| **AIIMS Comprehensive Neuropsychological Battery in Hindi** | AIIMS New Delhi | Adult and child forms; scales for motor, tactile, visual, receptive and expressive speech, reading, writing, arithmetic, memory and intellectual processes, with left and right hemisphere summary scales | Hindi-speaking patients; modelled on Luria's approach |


:::widget build
{
 "vignette": "Mrs Rao, 70, in Hyderabad, complains loudly of poor memory over three months since her husband's death. She often answers 'I don't know' on testing but recalls recent news when chatting. She sleeps poorly, has lost interest and weight, and cries easily. Her daughter says daily functioning is mostly intact.",
 "rule": "Tick features that point more to depression with cognitive complaints (sometimes called pseudodementia) than to early dementia. Three or more favour depression.",
 "symptoms": [
  {
   "label": "Complains more about memory than family notices",
   "present": true,
   "core": true
  },
  {
   "label": "Frequent 'don't know' answers with poor effort",
   "present": true
  },
  {
   "label": "Clear onset after a loss, with depressive symptoms",
   "present": true,
   "core": true
  },
  {
   "label": "Daily functioning mostly preserved",
   "present": true
  },
  {
   "label": "Gets lost in familiar places, unaware of problems",
   "present": false,
   "why": "Absent here; typical of dementia, where insight is often reduced."
  }
 ],
 "need": 3,
 "needCore": true,
 "verdict": "The picture favours a depressive episode with cognitive complaints. Treat the depression and re-test cognition after recovery, because late-life depression can also precede dementia; keep following her up."
}
:::

### Common individual tests
- **Bender Visual Motor Gestalt Test**: copying nine designs; visuo-motor integration.
- **Wisconsin Card Sorting Test**: sorting cards by a rule that changes; tests set-shifting and **perseveration** (frontal).
- **Trail Making Test** (A: numbers; B: alternating numbers and letters) and **Colour Trails** (a language-free version suited to India).
- **Stroop test**: name the ink colour of colour words; tests inhibition.
- **Verbal fluency**: words beginning with a letter, or animals, in one minute.
- **Rey Auditory Verbal Learning Test** and **Rey Complex Figure**: verbal and visual memory.

:::widget decide
{
  "scene": "Mr Reddy, 66, a retired bank manager in Hyderabad, has become forgetful over a year. His MMSE is 28 out of 30. His daughter says he has made serious mistakes with money and got lost driving to a familiar temple.",
  "ask": "What is the best next step?",
  "choices": [
    { "label": "Reassure: an MMSE of 28 is normal", "verdict": "harm", "outcome": "A year later he has lost much of his savings to a scam.", "why": "The MMSE has ceiling effects in highly educated people and misses executive and early memory problems. The history is worrying." },
    { "label": "Do a MoCA or ACE-III and refer for detailed neuropsychological assessment with education-adjusted norms, alongside medical work-up", "verdict": "best", "outcome": "He scores 21 on MoCA; testing shows impaired delayed recall and executive function, consistent with early dementia. Planning, safety and treatment begin.", "why": "A sensitive screen plus detailed testing answers the clinical question. The family history of change is the most important information." },
    { "label": "Start an antidepressant for possible depression", "verdict": "ok", "outcome": "His mood is fine; his memory continues to decline.", "why": "Depression should be screened for, but treating it blindly delays the right diagnosis." }
  ]
}
:::

:::clinician
Interpretation must be norm-referenced to education and language: in India, illiteracy and low schooling strongly lower scores on many tests, causing false positives for dementia. The Indian Council of Medical Research Neurocognitive Tool Box (ICMR-NCTB), developed by a multi-centre consortium and published from 2019 onwards, offers harmonised tests in several Indian languages (including Hindi, Bengali, Telugu, Kannada and Malayalam) with procedures and norms usable by people with low or no education, and is increasingly the reference for dementia research in India. The PGI-BBD yields a dysfunction rating index from ratings across subtests; its norms are old and education-dependent. The NIMHANS battery (2004) provides age- and education-stratified norms for urban adults; its child version supports learning disability assessment. Effort and performance validity must be checked in medicolegal cases (for example the Test of Memory Malingering, embedded measures such as reliable digit span), since poor effort invalidates the profile. Classic localising value of single tests is modest; patterns across domains, together with imaging and history, carry the inference.
:::

:::recall
1. Why can a normal MMSE be falsely reassuring? || It has a ceiling effect in educated people and misses executive and early memory problems.
2. Name the five components of the PGI-BBD. || PGI Memory Scale, Verbal Adult Intelligence Scale, Bhatia's short performance tests, Nahor-Benson test, Bender Visual Motor Gestalt Test.
3. Which test detects perseveration and set-shifting problems? || The Wisconsin Card Sorting Test.
4. Why is Colour Trails often used in India instead of Trail Making B? || It does not depend on knowing the English alphabet.
5. What does the AIIMS battery offer? || A comprehensive Hindi neuropsychological battery with adult and child forms, Luria-based scales and hemisphere summaries.
:::

:::mcq
Q: The PGI Battery of Brain Dysfunction was developed at:
- NIMHANS Bengaluru
- *PGIMER Chandigarh
- AIIMS New Delhi
- CIP Ranchi
> Pershad and Verma at PGIMER.

Q: A test where the patient names the ink colour of the word "RED" printed in blue measures mainly:
- Long-term memory
- *Response inhibition
- Vocabulary
- Visual acuity
> The Stroop test.
:::

## 2.7 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: The standard error of measurement is used to:
- Measure validity
- *Build a confidence interval around a person's score
- Calculate the mean
- Decide which test to use
> It expresses score uncertainty.

Q: A test with high specificity, when positive, helps to:
- Rule out the condition
- *Rule in the condition
- Measure reliability
- Set norms
> SpPin.

Q: The positive predictive value of a test falls when:
- Sensitivity rises
- *The condition becomes rarer in the tested group
- The sample size grows
- Specificity rises
> Base rates drive PPV.

Q: Crystallised intelligence:
- Peaks in adolescence and falls quickly
- *Reflects accumulated knowledge and keeps growing into later life
- Is the same as working memory
- Cannot be measured
> Knowledge and vocabulary.

Q: Which WAIS-IV index includes Digit Span and Arithmetic?
- Verbal Comprehension
- Perceptual Reasoning
- *Working Memory
- Processing Speed
> The working memory index.

Q: MISIC is an Indian adaptation of:
- The Stanford-Binet
- *The WISC
- The MMPI
- Raven's matrices
> Malin's adaptation of the Wechsler children's scale.

Q: The MMPI was developed by:
- Factor analysis of adjectives
- *Empirical criterion keying
- Clinical intuition only
- Projective methods
> Items kept if they discriminated groups.

Q: The MMPI scale that detects defensiveness is:
- F
- *K
- VRIN
- Scale 9
> K, the correction scale.

Q: The Big Five factors are measured by:
- The TAT
- *The NEO personality inventories
- The PGI-BBD
- The Bender-Gestalt
> Costa and McCrae.

Q: The TAT has how many cards in total?
- 10
- 20
- *31
- 9
> 31, including one blank.

Q: Which Rorschach indicators have the best research support?
- Interpretation of drawings
- *Perceptual accuracy and thought disorder indices
- Colour preference
- Number of animals seen
> Mihura's meta-analysis.

Q: HAM-D is mainly used to:
- Diagnose depression
- *Rate the severity of depression and track change
- Measure intelligence
- Screen for psychosis
> A clinician-rated severity scale.

Q: A Y-BOCS score of 12 suggests:
- Extreme OCD
- Severe OCD
- *Mild OCD
- No symptoms
> 8 to 15 is mild.

Q: A rapid cognitive screen more sensitive than the MMSE for mild impairment is:
- PANSS
- *MoCA
- BDI-II
- AUDIT
> It includes more executive tasks.

Q: The Wisconsin Card Sorting Test is most sensitive to:
- Occipital lesions
- *Frontal executive dysfunction
- Hearing loss
- Low mood
> Set-shifting and perseveration.
:::
`;
