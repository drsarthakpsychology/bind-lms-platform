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
:::
`;
