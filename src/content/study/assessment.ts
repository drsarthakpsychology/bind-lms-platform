import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "assessment",
  num: 4,
  title: "Psychological assessment and testing",
  emoji: "📏",
  tagline: "Reliability, validity, IQ, personality and projective tests, rating scales, and writing a test report",
  when: "Weeks 3 to 4",
  outcomes: [
    "Explain reliability, validity, standardisation and norms",
    "Know the main intelligence, personality, projective and neuropsychological tests, including Indian ones",
    "Use common rating scales correctly and know their score ranges",
    "Interpret an IQ score and its classification",
    "Write a clear, ethical psychological test report",
  ],
  writeTask:
    "On paper, from memory: types of reliability and validity with one line each, the IQ classification bands, two tests each for intelligence, personality, projective and neuropsychological assessment (with one Indian test), ten rating scales with what they measure, and the headings of a test report. Then check and correct in red.",
  activities: [
    act.coach("assessment", "Coach: assessment", "Tests and scales you confuse."),
    act.lesson("mse-2", "Quiz: describe it right", "Observation and description skills."),
    act.coach("ethics", "Coach: ethics", "Ethics of testing."),
  ],
  noteId: "assessment",
};

export const text = String.raw`
# Part I · Measurement basics

## 1.1 What makes a good test [core]
:::define Psychological test
A **standardised** procedure for sampling behaviour and describing it with scores or categories, compared against **norms**.
:::

### Reliability: is it consistent?
| Type | Question |
|---|---|
| **Test–retest** | Same person, same test, two times: similar scores? |
| **Inter-rater** | Two raters scoring the same responses: do they agree? (kappa) |
| **Internal consistency** | Do items measure the same thing? (Cronbach's alpha) |
| **Parallel forms** | Do two equivalent versions give similar scores? |
| Split-half | Do two halves of the test agree? |

### Validity: does it measure what it claims?
| Type | Question |
|---|---|
| **Face** | Does it look like it measures the trait? |
| **Content** | Does it cover all aspects of the trait? |
| **Criterion** (concurrent, predictive) | Does it agree with a gold standard now, or predict future outcomes? |
| **Construct** (convergent, discriminant) | Does it relate to similar measures and not to unrelated ones? |

:::mnemonic Reliability vs validity
A clock that is always 10 minutes fast is **reliable** (consistent) but **not valid** (wrong). Validity needs reliability; reliability doesn't guarantee validity.
:::

### Standardisation and norms
- **Standardisation**: same instructions, materials, timing and scoring for everyone.
- **Norms**: scores from a representative sample, so an individual can be compared. **Indian norms matter**: tests normed elsewhere can mislabel people of different language, education and culture.
- Scores: raw score, percentile, standard scores (z, T scores, IQ with **mean 100 and SD 15**).

### Screening versus diagnosis
- **Sensitivity**: proportion of true cases the test detects (few false negatives).
- **Specificity**: proportion of non-cases correctly excluded (few false positives).
- A screening test (PHQ-9, M-CHAT) flags who needs a full assessment; it is not a diagnosis.

:::recall
1. Name four types of reliability. || Test–retest, inter-rater, internal consistency, parallel forms.
2. Name four types of validity. || Face, content, criterion, construct.
3. Can a test be reliable but not valid? || Yes; a consistently wrong clock.
4. What are the mean and SD of IQ scores? || 100 and 15.
5. Define sensitivity and specificity. || True positives detected; true negatives correctly excluded.
:::

## 1.2 Scores and the normal curve [core]
Every standardised test turns a raw score into a position on a distribution. If you can read that position, you can read any report.

:::define The normal distribution
A symmetrical, bell-shaped spread of scores around the **mean**. About **68%** of people fall within **1 standard deviation (SD)** of the mean, about **95%** within 2 SD, and about **99.7%** within 3 SD.
:::

| Score type | Mean | SD | Example |
|---|---|---|---|
| **z score** | 0 | 1 | z of minus 2 = 2 SD below the mean |
| **T score** | 50 | 10 | MMPI scales; T of 65 or more is usually clinically significant |
| **IQ (deviation IQ)** | 100 | 15 | IQ 70 = 2 SD below the mean |
| **Percentile** | 50th | | 84th percentile = 1 SD above the mean |
| Stanine | 5 | about 2 | Nine bands, used in schools |

:::analogy A school class lined up by height
A percentile tells you how many classmates are shorter than you. A z score tells you how many "standard steps" you are from the middle of the line. IQ is the same line, just relabelled so the middle is 100 and each step is 15.
:::

### Error and confidence
- **Standard error of measurement (SEM)**: no test is perfectly reliable, so every score has a band of error. A reported IQ of 72 may truly lie between about 67 and 77.
- Always report a **confidence interval**, especially near cut-offs (IQ 70) where a diagnosis or legal decision may depend on it.
- **Flynn effect**: average IQ scores rose over the twentieth century, so old norms inflate scores. Use recent norms.

### Building a test
- **Item analysis**: each item's **difficulty** (how many pass it) and **discrimination** (does it separate high and low scorers?).
- **Factor analysis**: finds groups of items that measure the same underlying trait (used to build the 16PF and the Big Five).
- **Norms** must come from a sample like the person being tested: age, education, language, urban or rural.

:::recall
1. What percentage of people fall within 1 and 2 SD of the mean? || About 68% and 95%.
2. Give the mean and SD of T scores and of IQ. || T: 50 and 10. IQ: 100 and 15.
3. What is the standard error of measurement and why does it matter? || The error band around a score; it matters near cut-offs.
4. What is the Flynn effect? || Rising population IQ scores, so old norms overestimate IQ.
:::

# Part II · The tests

## 2.1 Intelligence [core]
| Test | Notes |
|---|---|
| **WAIS** (Wechsler Adult Intelligence Scale) | Adults; full-scale IQ with index scores (verbal comprehension, perceptual reasoning, working memory, processing speed) |
| **WISC** (children); **Malin's Intelligence Scale for Indian Children (MISIC)** | Indian adaptation of WISC |
| **Binet–Kamat Test** | Indian adaptation of Stanford–Binet; widely used for intellectual disability assessment |
| **Bhatia's Battery of Performance Tests** | Indian performance-based battery; less language-dependent |
| Raven's Progressive Matrices | Non-verbal reasoning; less culture-bound |
| **Vineland Social Maturity Scale (VSMS)** | Social and adaptive functioning (social quotient); essential for intellectual disability |

| IQ | Classification (approximate) |
|---|---|
| 130 and above | Very superior |
| 110 to 129 | Above average to superior |
| 90 to 109 | Average |
| 80 to 89 | Low average |
| 70 to 79 | Borderline intellectual functioning |
| Below 70 | Range of intellectual disability (if adaptive functioning is also impaired) |

:::trap IQ is not the diagnosis
Intellectual disability needs **adaptive deficits** too, and severity is set by adaptive functioning. Interpret IQ against education, language and culture, and remember the measurement error (a confidence interval of several points).
:::

## 2.2 Personality and projective tests [core]
### Objective (self-report) personality tests
| Test | Measures |
|---|---|
| **MMPI-2** (Minnesota Multiphasic Personality Inventory) | Clinical scales (depression, paranoia, schizophrenia and others) plus **validity scales** detecting faking good, faking bad or random answering |
| **16PF** (Cattell) | Sixteen personality factors |
| **NEO-PI** | The **Big Five**: openness, conscientiousness, extraversion, agreeableness, neuroticism (**OCEAN**) |
| EPQ (Eysenck) | Extraversion, neuroticism, psychoticism, lie scale |

### Projective tests
Ambiguous stimuli onto which a person “projects” inner needs and conflicts.
| Test | What the person does |
|---|---|
| **Rorschach inkblot test** | Describes what ten inkblots look like; scored for location, determinants, content |
| **Thematic Apperception Test (TAT)** | Tells stories about ambiguous pictures; reveals needs, conflicts, relationships |
| Children's Apperception Test | Animal pictures for children |
| **Sentence Completion Test** | Completes stems like “My mother…” |
| Draw-a-Person, House-Tree-Person | Drawings interpreted for self-image and emotions |

:::note Strengths and limits
Projective tests can open up themes for discussion, but scoring reliability and validity are weaker than objective tests. Never base a diagnosis on a projective test alone.
:::

## 2.3 Neuropsychological tests [core]
| Test | Assesses |
|---|---|
| **Wisconsin Card Sorting Test** | Executive function, set-shifting (frontal lobes) |
| Trail Making Test A and B | Attention, processing speed, set-shifting |
| Stroop Test | Inhibition, attention |
| **Wechsler Memory Scale**; **PGI Memory Scale** (Indian) | Memory |
| **Bender Visual-Motor Gestalt Test** | Visuoconstruction; organicity screening |
| Benton Visual Retention Test | Visual memory |
| **PGI Battery of Brain Dysfunction** | Indian battery for organic impairment |
| **NIMHANS Neuropsychology Battery** | Indian battery for adults and children |
| Luria–Nebraska, Halstead–Reitan | Comprehensive batteries |

## 2.4 Rating scales and interviews [core]
| Scale | Measures | Notes |
|---|---|---|
| PHQ-9 | Depression | 0 to 27; self-report |
| GAD-7 | Anxiety | 0 to 21 |
| HAM-D, MADRS | Depression severity | Clinician-rated |
| BDI-II | Depression | Self-report |
| **BPRS**, **PANSS** | Psychotic symptoms | PANSS has positive, negative and general subscales |
| **YMRS** | Mania | Young Mania Rating Scale |
| **Y-BOCS** | OCD severity | 0 to 40 |
| MMSE, MoCA | Cognition | Out of 30 |
| AUDIT; CIWA-Ar | Alcohol use; withdrawal | |
| Columbia Suicide Severity Rating Scale | Suicidal ideation and behaviour | |
| M-CHAT; Vanderbilt or Conners | Autism screen; ADHD | |
| **SCID**, MINI | Structured diagnostic interviews | Research and careful diagnosis |

:::recall
1. Name two Indian intelligence tests and the Indian adaptive scale. || Binet–Kamat, MISIC (or Bhatia's); Vineland Social Maturity Scale.
2. What does the MMPI's validity scales detect? || Faking good, faking bad, random answering.
3. Name the Big Five. || Openness, conscientiousness, extraversion, agreeableness, neuroticism.
4. Name three projective tests. || Rorschach, TAT, sentence completion (also Draw-a-Person).
5. Which test assesses set-shifting and the frontal lobes? || Wisconsin Card Sorting Test.
6. Which scales measure mania and OCD severity? || YMRS; Y-BOCS.
:::

## 2.5 Theories of intelligence [core]
:::define Intelligence
The capacity to learn from experience, reason, solve problems, and adapt to the environment. How it is structured is a long-running debate.
:::

| Theorist | Model | Key idea |
|---|---|---|
| **Spearman** | Two-factor | A **general factor (g)** underlies all abilities, plus specific factors (s) |
| **Thurstone** | Primary mental abilities | Seven separate abilities (verbal, numerical, spatial, memory, reasoning and others) |
| **Cattell and Horn** | Fluid and crystallised | **Fluid (Gf)**: reasoning with new problems, peaks early and declines with age. **Crystallised (Gc)**: knowledge and vocabulary, kept into old age |
| **Gardner** | Multiple intelligences | Linguistic, logical-mathematical, spatial, musical, bodily-kinaesthetic, interpersonal, intrapersonal, naturalistic |
| **Sternberg** | Triarchic | Analytical, creative, practical intelligence |
| **Goleman (popularised)** | Emotional intelligence | Recognising and managing one's own and others' emotions |
| **Binet** | Mental age | Ratio IQ = mental age divided by chronological age, times 100 (replaced by deviation IQ) |

:::trap Fluid falls, crystallised stays
In normal ageing, **fluid** intelligence (speed, new problem-solving) declines while **crystallised** intelligence (vocabulary, knowledge) holds. A sudden fall in vocabulary or general knowledge suggests disease, not age.
:::

### Interpreting a profile
- A big gap between index scores (for example verbal comprehension much higher than processing speed) matters more than the full-scale IQ: think of specific learning disorder, ADHD, brain injury or depression slowing processing.
- Depression, anxiety, poor sleep, hearing or vision problems, and an unfamiliar language all **lower scores**. Note them in the report.

:::recall
1. What is Spearman's g? || A general intelligence factor underlying all abilities.
2. Contrast fluid and crystallised intelligence. || Fluid: new problem-solving, declines with age. Crystallised: knowledge, preserved.
3. Name four of Gardner's intelligences. || Linguistic, logical-mathematical, spatial, musical, bodily-kinaesthetic, interpersonal, intrapersonal, naturalistic.
4. How was ratio IQ calculated? || Mental age divided by chronological age, times 100.
:::

## 2.6 Reading the MMPI and the Rorschach [core]
### MMPI-2 validity scales
| Scale | What a high score suggests |
|---|---|
| **L (Lie)** | Presenting oneself as unrealistically virtuous |
| **F (Infrequency)** | Endorsing rare symptoms: severe distress, **faking bad**, or random answering |
| **K (Correction)** | Defensiveness, **faking good** |
| **?** (Cannot say) | Many unanswered items; the profile may be invalid |
| VRIN, TRIN | Inconsistent or yes-saying and no-saying patterns |

### MMPI-2 clinical scales
| No. | Scale | No. | Scale |
|---|---|---|---|
| 1 | Hypochondriasis (Hs) | 6 | Paranoia (Pa) |
| 2 | Depression (D) | 7 | Psychasthenia (Pt): anxiety, obsessions |
| 3 | Hysteria (Hy) | 8 | Schizophrenia (Sc) |
| 4 | Psychopathic deviate (Pd) | 9 | Hypomania (Ma) |
| 5 | Masculinity-femininity (Mf) | 0 | Social introversion (Si) |

- Interpreted as **profiles and code types** (the two highest scales), not single scales. For example a **1-3 code type** with low 2 is the "**conversion V**" (somatic complaints with denial of distress).
- T of 65 or more is clinically significant.

### Rorschach basics
- Ten inkblots (five achromatic, five with colour). The person says what each might be (**free association**), then the examiner asks where and why (**inquiry**).
- Scored for **location** (whole, detail, unusual detail, white space), **determinants** (form, colour, movement, shading), **content** (human, animal, anatomy), **popular responses** and **form quality**.
- Poor form quality and odd combinations suggest disordered thinking. Many human movement responses suggest an active inner life. The **Exner Comprehensive System** standardised the scoring.

:::recall
1. Which MMPI validity scales suggest faking good and faking bad? || K (and L) for faking good; F for faking bad.
2. Name the MMPI scale for anxiety and obsessions. || Scale 7, psychasthenia.
3. What is the conversion V? || High scales 1 and 3 with a lower scale 2.
4. Name the four main Rorschach scoring categories. || Location, determinants, content, form quality (and popular responses).
:::

## 2.7 Bedside cognitive screening [core]
### MMSE (out of 30)
| Domain | Points |
|---|---|
| Orientation to time | 5 |
| Orientation to place | 5 |
| Registration (three words) | 3 |
| Attention: serial 7s or spell WORLD backwards | 5 |
| Recall of the three words | 3 |
| Naming two objects | 2 |
| Repeating "No ifs, ands or buts" | 1 |
| Three-stage command | 3 |
| Reading and obeying "Close your eyes" | 1 |
| Writing a sentence | 1 |
| Copying intersecting pentagons | 1 |

- Common cut-off: **23 or below** suggests impairment, but adjust for **education**: in India the **Hindi Mental State Examination (HMSE)** and education-adjusted cut-offs are used for people with little schooling.
- MMSE is weak for **executive** problems and mild impairment.

### MoCA (out of 30)
- Covers **executive function** (trail making, clock drawing, cube copy), naming, attention, language, abstraction, delayed recall, orientation.
- **26 or above is normal**; add 1 point if 12 years of education or fewer. Better than MMSE for **mild cognitive impairment**.

### Quick bedside tests
- **Clock drawing**: planning, visuospatial skills.
- **Addenbrooke's Cognitive Examination (ACE-III)**: out of 100; more detail on language and visuospatial skills.
- **Digit span**: attention (normal forward span about 7, plus or minus 2).

:::recall
1. What is the MMSE out of, and what does the pentagon copy test? || 30; visuoconstruction.
2. Why is MoCA preferred for mild cognitive impairment? || It tests executive function and is more sensitive.
3. What Indian adaptation is used for people with little schooling? || The Hindi Mental State Examination.
4. Normal forward digit span? || About 7, plus or minus 2.
:::

# Part III · Using tests well

## 3.1 The process and the report [core]
1. **Referral question**: what exactly needs answering? (“Is there intellectual disability for certification?” “Is memory impairment organic or depressive?”)
2. **Informed consent**: purpose, who will see the report, limits of confidentiality.
3. **Choose tests** that fit the question, age, language and education; use Indian norms where possible.
4. **Administer** in standard conditions; observe behaviour (effort, attention, anxiety).
5. **Score and interpret** in the context of history and observation; consider effort and validity.
6. **Write the report** and give feedback in plain language.

:::define Headings of a test report
Identifying data · Referral question · Tests administered · Behavioural observations · Results (with scores and their meaning) · Impression or formulation · Recommendations · Signature and registration.
:::

:::trap Ethics of testing
- Only qualified, **RCI-registered** professionals should administer and interpret clinical tests.
- Keep test materials secure; don't reproduce copyrighted items.
- Report results in plain language; avoid labels that harm; state limitations (language, education, culture, effort).
- Results belong to the assessment purpose; share only with consent or legal requirement.
:::

:::word Plain-language result
Instead of “FSIQ 68, below 2nd percentile”, write: “On the intelligence test his overall score was 68, which is lower than about 98 of every 100 people his age. Together with the difficulties his parents describe in self-care and money handling, this fits mild intellectual disability. He learns best with short, practical steps.”
:::

:::recall
1. List the six steps of the assessment process. || Referral question, consent, test choice, administration, interpretation, report and feedback.
2. List the headings of a test report. || Identification, referral question, tests, observations, results, impression, recommendations, signature.
3. Who may administer clinical psychological tests in India? || Qualified, RCI-registered professionals.
:::

## 3.2 Choosing tests and testing ethically [core]
### From referral question to test battery
| Referral question | Useful tests |
|---|---|
| "Does this child have intellectual disability?" | Binet–Kamat or MISIC **and** Vineland Social Maturity Scale; developmental history |
| "Is this a specific learning disorder?" | IQ test plus **NIMHANS SLD battery**; reading, writing and arithmetic attainment |
| "Is there organic brain damage?" | Bender Gestalt, PGI Battery of Brain Dysfunction, Trail Making, Wisconsin Card Sorting |
| "Is this early dementia or depression?" | MMSE or MoCA, ACE-III, memory scales, depression scale, retest after treatment |
| "Personality issues behind repeated crises?" | MMPI-2 or a structured personality interview, with clinical history |
| "Is this person faking?" | MMPI validity scales, symptom validity tests, consistency across tests and observation |

### Ethics of testing
- **Informed consent**: explain the purpose, what will happen, who will see the results.
- **Competence**: only trained people administer and interpret tests.
- **Test security**: do not share test items, or the test becomes useless.
- **Cultural fairness**: use Indian norms where they exist; note language and schooling; avoid labelling on scores alone.
- **Confidentiality** and **feedback**: give results in plain language, with strengths as well as weaknesses.
- Under the **RPwD Act**, disability certification relies on standard assessments (for example IQ with adaptive functioning for intellectual disability).

:::example A short report extract
"Ms A, 9 years, was referred for poor school performance. On MISIC her full-scale IQ was 94 (average range, 95% confidence interval 89 to 99). Her reading attainment was two years below her grade, with letter reversals and slow decoding, while arithmetic was age-appropriate. Social quotient on VSMS was 98. The profile is consistent with a **specific learning disorder with impairment in reading**, not intellectual disability. Recommendations: remedial education, extra exam time, and review after one year."
:::

:::recall
1. Which two tests are essential for diagnosing intellectual disability? || An IQ test and an adaptive functioning scale (VSMS).
2. Name four ethical principles of psychological testing. || Informed consent, competence, test security, cultural fairness, confidentiality and feedback.
3. What tests help separate dementia from depression? || Cognitive screens plus a depression scale, and retesting after treatment.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Describe the assessment of intelligence. (10 marks)
1. Definition of intelligence; theories in one line (g factor, multiple intelligences).
2. Test properties: reliability, validity, standardisation, norms.
3. Tests: WAIS and WISC, Binet–Kamat, MISIC, Bhatia's, Raven's; adaptive scale (VSMS).
4. IQ: mean 100, SD 15; classification table.
5. Uses: intellectual disability, learning problems, neuropsychological assessment, certification.
6. Limitations: culture, language, education, effort; IQ alone doesn't diagnose.
:::

:::word Short note: projective tests
Projective tests present ambiguous stimuli, such as inkblots (Rorschach), pictures (Thematic Apperception Test) or sentence stems, on the assumption that people project their own needs, conflicts and perceptions onto them. They can reveal themes, relationships and coping styles and are useful to open discussion, especially when self-report is guarded. Limitations: complex scoring, lower reliability and validity than objective tests, and strong examiner influence; they should never be used alone for diagnosis.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Define reliability. :: Consistency of a test's results.
Define validity. :: Whether a test measures what it claims.
Statistic for internal consistency? :: Cronbach's alpha.
Mean and SD of IQ? :: 100 and 15.
IQ range for borderline intellectual functioning? :: About 70 to 79.
Indian adaptation of Stanford–Binet? :: Binet–Kamat Test.
Indian adaptation of WISC? :: Malin's Intelligence Scale for Indian Children.
Scale for social quotient? :: Vineland Social Maturity Scale.
Big Five? :: Openness, conscientiousness, extraversion, agreeableness, neuroticism.
Test with validity scales for faking? :: MMPI-2.
Inkblot test? :: Rorschach.
Story-telling picture test? :: Thematic Apperception Test.
Test of frontal set-shifting? :: Wisconsin Card Sorting Test.
Indian memory scale? :: PGI Memory Scale.
Scale for positive and negative symptoms? :: PANSS.
Mania rating scale? :: YMRS.
Mean and SD of IQ? :: 100 and 15.
Mean and SD of T scores? :: 50 and 10.
Percent within 2 SD of the mean? :: About 95%.
Spearman's general factor? :: g.
Intelligence that falls with age? :: Fluid.
Multiple intelligences? :: Howard Gardner.
MMPI scale for faking bad? :: F (infrequency).
MMPI scale 7? :: Psychasthenia.
Conversion V? :: High scales 1 and 3, lower 2.
MMSE cut-off commonly used? :: 23 or below suggests impairment.
MoCA normal score? :: 26 or above.
Indian MMSE for low schooling? :: Hindi Mental State Examination.
:::

## 4.3 Module test [core]
:::mcq
Q: Two psychologists scoring the same Rorschach protocol get similar results. This shows good:
- Test–retest reliability
- *Inter-rater reliability
- Content validity
- Predictive validity
> Agreement between raters.

Q: A scale is consistent but doesn't measure what it claims. It is:
- Valid but not reliable
- *Reliable but not valid
- Both
- Neither
> Like a clock that is always 10 minutes fast.

Q: An IQ of 115 lies:
- Two SD below the mean
- *One SD above the mean
- At the mean
- In the intellectual disability range
> Mean 100, SD 15.

Q: Which test is most useful for adaptive functioning in Indian children?
- Rorschach
- *Vineland Social Maturity Scale
- MMPI
- TAT
> Gives a social quotient.

Q: Which test includes scales to detect faking good or bad?
- Rorschach
- *MMPI-2
- Bender Gestalt
- Raven's Matrices
> Validity scales.

Q: Executive set-shifting is best assessed by:
- Rorschach
- *Wisconsin Card Sorting Test
- Vineland
- Sentence Completion Test
> A frontal-lobe test.

Q: Which is a projective test?
- 16PF
- NEO-PI
- *Thematic Apperception Test
- WAIS
> Stories about ambiguous pictures.

Q: A screening test that misses few true cases has high:
- Specificity
- *Sensitivity
- Reliability only
- Face validity only
> Few false negatives.

Q: An IQ of 85 lies at about which percentile?
- 2nd
- *16th
- 50th
- 84th
> One SD below the mean.

Q: A 70-year-old's vocabulary is unchanged but problem-solving speed is slower. This fits:
- Early dementia
- *Normal ageing: crystallised kept, fluid declines
- Depression only
- Intellectual disability
> Crystallised intelligence is preserved in normal ageing.

Q: A high F scale on the MMPI-2 most suggests:
- Defensiveness
- *Severe distress, faking bad or random answering
- Social introversion
- Hypomania
> K and L suggest faking good.

Q: The MoCA is preferred over the MMSE for mild cognitive impairment because it:
- Is shorter
- Has no education adjustment
- *Tests executive function and is more sensitive
- Is out of 100
> It includes trail making, clock and abstraction.

Q: Reporting a 95% confidence interval around an IQ score reflects:
- Test security
- *Standard error of measurement
- Flynn effect
- Factor analysis
> No test is perfectly reliable.
:::
`;
