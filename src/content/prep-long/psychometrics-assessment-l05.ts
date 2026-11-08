import type { LongQA } from "@/lib/prep/long-types";
import { anchored, brain, chain, compare, tree, vis } from "./visual";

const S = "psychometrics-assessment" as const;

export const PSYCHOMETRICS_ASSESSMENT_L05: LongQA[] = anchored([
  {
    id: "asmt-l05-001",
    subject: S,
    topic: "performance-validity",
    marks: 10,
    difficulty: 4,
    exams: ["mcp-entrance", "md-psychiatry", "ugc-net"],
    question: "How do psychologists assess effort and detect feigned impairment? Describe performance validity and symptom validity tests and the criteria for malingered neurocognitive dysfunction.",
    plan: ["Why effort must be measured", "Performance validity tests with examples and logic", "Embedded indicators", "Symptom validity scales", "Slick criteria and DSM-5-TR clues", "Ethics of reporting and conclusion"],
    answer: `## Why effort matters
Every ability test assumes the person is trying their best. If they are not, low scores reflect effort, not brain function. Poor effort is common where there is something to gain: compensation after a road accident or head injury, disability benefits, avoiding work or examinations, or criminal proceedings. Studies in medicolegal settings have found poor effort in a large minority of cases. Effort cannot be judged reliably from clinical impression alone, so objective tests are needed.

## Performance validity tests
Performance validity tests (PVTs) look hard but are in fact easy, even for people with genuine brain injury or dementia of mild degree.
- Test of Memory Malingering (TOMM): 50 line drawings are shown, then the person picks each from a pair. Patients with real moderate brain injury usually score 45 or more on the second trial; lower scores suggest poor effort.
- Rey 15 Item Test: 15 simple items in five rows of three (such as A B C, 1 2 3) to be reproduced from memory; very low scores are a warning sign.
- Word Memory Test and Medical Symptom Validity Test: computerised verbal tests with effort and memory measures.
- Forced choice testing: on a two choice task, pure guessing gives about 50 percent. A score significantly below chance means the person knew the answer and chose the wrong one, which is strong evidence of deliberate deception.

## Embedded indicators
Signs built into standard tests, such as Reliable Digit Span (the longest forward plus backward spans given correctly on both trials; 7 or less raises concern), very poor recognition with better recall, and unusual error patterns. They cost no extra time but are less accurate than stand alone tests.

## Symptom validity
Symptom validity tests check whether reported symptoms are exaggerated.
- MMPI-2 and MMPI-2-RF scales: F, Fp (psychotic symptoms), FBS (physical and cognitive complaints) and the Response Bias Scale.
- Structured Inventory of Malingered Symptomatology (SIMS), a short screen.
- Structured Interview of Reported Symptoms (SIRS-2), which asks about rare, absurd or improbable symptoms.

## Criteria for malingering
Daniel Slick, Elisabeth Sherman and Grant Iverson in 1999 proposed criteria for malingered neurocognitive dysfunction:
1. A clear external incentive.
2. Evidence from testing: below chance performance (definite), or failed well validated PVTs, or test patterns that do not fit known brain function.
3. Evidence from self report that does not fit history, observation or records.
4. These are not fully explained by psychiatric, neurological or developmental factors.
They grade the conclusion as possible, probable or definite. DSM-5-TR lists malingering as a condition that may need attention, with warning signs: a medicolegal context, a marked gap between claimed distress and objective findings, poor cooperation and antisocial personality disorder.

## Reporting
- Use more than one PVT, spread through the session; failing two or more is much more meaningful than failing one.
- Poor effort is a finding about the test session, not a diagnosis. It can come from fatigue, depression, pain, anxiety or a functional disorder as well as from deliberate exaggeration.
- Report that ability scores are not valid as a measure of true ability, without labelling the person a liar unless the evidence is definite.
- In India, many PVTs lack local norms and need care in people with little schooling.

## Conclusion
Valid assessment requires valid effort. Stand alone and embedded PVTs and symptom validity scales, read with criteria such as Slick's, allow cautious, evidence based conclusions about feigning.`,
    keyPoints: ["Why effort must be tested objectively", "PVT logic: easy tests that look hard", "TOMM, Rey 15, WMT and forced choice below chance", "Embedded indicators such as Reliable Digit Span", "Symptom validity: MMPI scales, SIMS, SIRS-2", "Slick criteria and levels", "DSM-5-TR warning signs", "Careful reporting and multiple PVTs"],
    pitfalls: ["Calling a single failed PVT proof of malingering", "Diagnosing malingering from impression"],
    module: "assessment/3-5",
    visuals: [vis("decide", {
      scene: "Ravi, 34, a driver from Nagpur, claims severe memory loss after a minor road accident with no loss of consciousness and a normal CT scan. He is claiming compensation. On a two choice recognition test he scores 14 of 50 correct.",
      ask: "How should the psychologist interpret this?",
      choices: [
        { label: "Report severe amnesia, since his scores are very low", verdict: "harm", outcome: "An invalid report goes to court.", why: "Low scores do not prove impairment when effort has not been checked." },
        { label: "Note that 14 of 50 is well below chance, which means he recognised the right answers and avoided them; report the ability scores as invalid and state that the pattern meets Slick's definite level, alongside history and incentive", verdict: "best", outcome: "The report is accurate, cautious and defensible.", why: "Guessing gives about 25 of 50. Scoring far below chance requires knowing the answer." },
        { label: "Tell Ravi he is lying and stop the session", verdict: "harm", outcome: "Rapport is lost and the assessment is incomplete.", why: "Findings are reported in writing with evidence, not as a confrontation." },
      ],
    }, "Performance validity tests")],
    ref: "Slick, Sherman and Iverson 1999 Clinical Neuropsychologist; Tombaugh 1996 TOMM; Rey 1964; Greiffenstein 1994 Reliable Digit Span; Larrabee 2012 PVT and SVT terminology; DSM-5-TR malingering",
  },
  {
    id: "asmt-l05-002",
    subject: S,
    topic: "report-writing",
    marks: 20,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe the process of psychological assessment from referral to report. What are the features of a good psychological report?",
    plan: ["Assessment versus testing", "Steps: referral question to feedback", "Structure of the report section by section", "Features of a good report", "Common errors and ethical points in India", "Conclusion"],
    answer: `## Assessment versus testing
Testing is giving a test and getting a score. Assessment is a wider problem solving process: it uses tests, interview, observation, records and informants to answer a specific question about a person and to guide decisions. A test score is one piece of evidence; the assessment is the clinician's integrated judgement.

## The process
1. Clarify the referral question. "Psychological testing please" is not a question. "Is this 9 year old's reading difficulty due to intellectual disability, a specific learning disorder or ADHD?" is. The clinician talks to the referrer to learn what decision depends on the answer.
2. Gather background: history from the person and informants, school or work records, medical and medication history, previous reports, and cultural and language background.
3. Plan the battery: choose tests that answer the question, are valid for the person's age, language and education, and have suitable norms. Include effort measures where relevant.
4. Obtain informed consent: purpose, procedures, who will see the results, limits of confidentiality and the right to refuse. For a child, consent from the parent and assent from the child.
5. Administer and score according to the manual, noting behaviour: rapport, attention, motivation, anxiety, fatigue, sensory or motor problems.
6. Interpret: compare scores with norms using confidence intervals, look for consistent patterns across tests and sources, consider alternative explanations (education, culture, mood, effort), and form a conclusion that answers the question.
7. Write the report.
8. Give feedback in plain language to the person, family and referrer, and agree next steps.

## Structure of the report
| Section | Content |
| Identifying details | Name, age, sex, education, language, dates of assessment, examiner |
| Reason for referral | The specific question and who asked it |
| Background information | Relevant history, briefly; sources named |
| Tests administered | Full names of tests and versions used |
| Behavioural observations | Appearance, rapport, effort, attention, language, anything affecting validity |
| Results | Scores with descriptive ranges and confidence intervals, grouped by domain |
| Interpretation and integration | What the results mean together, linked to history and observation |
| Summary and diagnostic impression | Short answer to the referral question, with diagnosis if appropriate |
| Recommendations | Specific, practical, prioritised next steps |
| Signature | Name, qualification and RCI registration number |

## Features of a good report
- Answers the referral question directly, in the summary as well as the body.
- Written for the reader: a teacher, a parent, a judge and a psychiatrist need different language. Technical terms are explained or avoided.
- Organised by domain or by theme, not test by test. "Her working memory is weak, which shows in digit span, arithmetic and her teacher's reports" is more useful than a list of subtest scores.
- Integrates data from several sources and explains any contradictions.
- Describes the person, not just the scores, including strengths.
- States limitations: a test given in a second language, poor effort, a short session, the absence of Indian norms.
- Gives scores as ranges with confidence intervals, avoiding false precision.
- Makes concrete recommendations: "extra time of 20 minutes per hour in board examinations and a special educator twice weekly for reading", not "remedial help may be considered".
- Is concise; length is not quality.
- Is honest, objective and free of jargon, stigma and speculation.

## Common errors
- The "Barnum" report: vague statements true of almost anyone ("she has some insecurity in relationships").
- Overinterpreting a single score or a projective sign.
- Copying test manual text or computer narratives without judgement.
- Ignoring culture, language and education when comparing with foreign norms.
- Giving a diagnosis that the data do not support, or that the referral did not need.

## Ethical points in India
- Only qualified, RCI registered clinical psychologists should carry out clinical assessments and sign such reports; the RCI Act makes practice without registration an offence.
- The Mental Healthcare Act 2017 protects the confidentiality of information about a person's mental health, and the Digital Personal Data Protection Act 2023 governs how digital personal data, including reports, are collected, stored and shared.
- Raw test data and test materials should be protected for test security, while the person has a right to understand the results.
- Reports for certification under the RPwD Act must use the notified tools and formats.

## Conclusion
A psychological assessment begins with a clear question and ends with a report that answers it. The best reports integrate several sources, speak to their reader, acknowledge limits and give recommendations that someone can act on the next day.`,
    keyPoints: ["Testing versus assessment", "Referral question clarified first", "Steps from background to feedback", "Informed consent and assent", "Report sections in order", "Features: answers the question, reader focused, integrated, limits stated", "Common errors including Barnum statements", "RCI registration, MHCA confidentiality, DPDP Act"],
    pitfalls: ["Writing test by test without integration", "No recommendations or vague ones", "Not stating limitations"],
    module: "assessment/3-6",
    visuals: [
      chain("The process", [["Referral question", "What decision depends on the answer?"], ["Background", "History, records, informants, culture"], ["Plan and consent", "Valid tests for this person; informed consent"], ["Test and observe", "Standard administration, behaviour noted"], ["Interpret", "Patterns across sources, alternatives ruled out"], ["Report and feedback", "Answer the question in plain words"]]),
      vis("sort", { prompt: "Good report or poor report practice?", buckets: ["Good practice", "Poor practice"], items: [
        { text: "Results organised by memory, attention and language, drawing on several tests", bucket: 0 },
        { text: "A list of every subtest score with no comment", bucket: 1 },
        { text: "Full scale IQ 84 (95 percent interval 79 to 90), low average range", bucket: 0 },
        { text: "\"She has a need for others to like her\"", bucket: 1, why: "A Barnum statement, true of almost everyone." },
        { text: "\"Testing was done in English, her second language, so verbal scores may underestimate her\"", bucket: 0 },
      ] }, "Features of a good report"),
    ],
    ref: "Groth-Marnat and Wright Handbook of Psychological Assessment, report chapter; Lichtenberger Essentials of Assessment Report Writing; Meyer 2001 testing versus assessment; RCI Act 1992 s13; MHCA 2017 s23; DPDP Act 2023; study module assessment 3.6",
  },
  {
    id: "asmt-l05-003",
    subject: S,
    topic: "test-ethics",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Discuss the ethical and legal issues in psychological testing, with reference to India.",
    plan: ["Why testing raises ethical issues", "Competence and user qualifications", "Consent, confidentiality and data", "Fairness and accommodations", "Test security, obsolete tests and feedback", "Indian legal framework and conclusion"],
    answer: `## Why testing raises ethical issues
Test results can open or close doors: school placement, disability benefits, a job, a custody decision, a diagnosis. Misused tests can harm people, and the history of testing includes the use of intelligence tests to justify discrimination. Professional codes, such as section 9 of the American Psychological Association's ethics code on assessment, and Indian laws set out the duties of test users.

## Competence and user qualifications
- Tests should be used only by people trained in their administration, scoring and interpretation, and in the limits of the test. Publishers often grade tests by the training needed (simple questionnaires, then tests needing knowledge of psychometrics, then individual intelligence and personality tests needing supervised clinical training).
- In India, clinical assessment for diagnosis and certification falls to RCI registered clinical psychologists; section 13 of the RCI Act makes practice without registration an offence.
- Using unqualified staff to give or interpret tests, or selling "IQ certificates", is unethical.

## Consent, confidentiality and data
- Informed consent: purpose, nature of the tests, who will receive the results, fees and the right to refuse. Exceptions include testing ordered by a court. Children give assent while parents consent.
- Confidentiality: results go only to those the person agreed to, or as required by law. The Mental Healthcare Act 2017 gives every person with mental illness the right to confidentiality of information about their mental health and treatment.
- The Digital Personal Data Protection Act 2023 applies to digital personal data, including online test results and stored reports: data must be collected for a stated purpose with consent, kept secure, and not used for other purposes.

## Fairness and accommodations
- Choose tests valid for the person's language, culture, education and disability; do not use foreign norms uncritically.
- Provide reasonable accommodations, as required by the Rights of Persons with Disabilities Act 2016: large print, extra time, a reader or scribe, or a non verbal test, while noting how this affects interpretation.
- Avoid using a single test score for high stakes decisions.

## Security, obsolete tests and feedback
- Test security: test items, manuals and protocols should not be copied, posted online or given to untrained people, because this destroys their validity. Coaching books that publish real items are a problem in India.
- Do not base decisions on obsolete tests or outdated norms; the Flynn effect makes old IQ norms inflate scores.
- Use copyrighted tests legally; photocopying protected forms is common but unethical.
- Explain results in language the person understands, including strengths, and give them a chance to ask questions.
- Computer scored narratives remain the responsibility of the psychologist who signs the report.

## Conclusion
Ethical testing rests on competence, consent, confidentiality, fairness, security and honest communication. In India these duties are backed by the RCI Act, the MHCA 2017, the RPwD Act 2016 and the DPDP Act 2023.`,
    keyPoints: ["Stakes of testing and history of misuse", "Competence and graded user qualifications", "RCI registration and section 13", "Informed consent and assent", "Confidentiality under MHCA and DPDP Act", "Fairness and reasonable accommodation under RPwD", "Test security and obsolete tests", "Feedback and responsibility for computer reports"],
    module: "assessment/3-7",
    visuals: [vis("decide", {
      scene: "A coaching centre in Kota asks a psychologist to give 300 students an online aptitude test, email each family a 'personality and IQ certificate', and share all results with the centre for marketing.",
      ask: "What should the psychologist do?",
      choices: [
        { label: "Agree; the centre has paid and parents will be pleased", verdict: "harm", outcome: "Data are used without consent and students are labelled by a screening tool.", why: "Breaches consent, confidentiality, data protection and the limits of group screening." },
        { label: "Offer screening only with informed consent from families and assent from students, explain that results are not certificates, share only with each family, and refuse use for marketing", verdict: "best", outcome: "Students get useful career guidance and their data stay protected.", why: "Meets consent, confidentiality and purpose limits under the DPDP Act and professional codes." },
        { label: "Refuse to test any students at all", verdict: "ok", outcome: "No harm is done, but students lose access to guidance.", why: "Ethical, but a properly designed service could help them." },
      ],
    }, "Consent, confidentiality and data")],
    ref: "APA Ethical Principles of Psychologists and Code of Conduct 2017 section 9; RCI Act 1992 s13; MHCA 2017 s23; RPwD Act 2016; DPDP Act 2023; study module assessment 3.7 and ethics-law 1.5",
  },
  {
    id: "asmt-l05-004",
    subject: S,
    topic: "neuropsych-assessment",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry", "ma-semester"],
    question: "Describe the cognitive deficits expected after damage to different lobes of the brain and how a neuropsychologist tests for them.",
    plan: ["Principles of brain behaviour relationships", "Frontal lobe signs and tests", "Temporal lobe signs and tests", "Parietal and occipital signs and tests", "Lateralisation and limits"],
    answer: `## Principles
Each region of the cortex supports particular functions, but most complex abilities depend on networks. Damage to a region produces typical deficits, and the side of the damage matters: in most right handed people (and most left handed people) the left hemisphere is dominant for language, while the right is specialised for visuospatial skills and attention to the left side of space.

## Frontal lobes
- Signs: poor planning and organisation, rigidity and perseveration, poor inhibition and impulsivity, apathy or disinhibition, poor judgement, reduced verbal fluency, and on the left, non fluent (Broca's) aphasia.
- Tests: Wisconsin Card Sorting Test, Trail Making part B, Stroop, Tower of London, verbal fluency, the Frontal Assessment Battery, and for social decision making the Iowa Gambling Task.

## Temporal lobes
- Signs: memory loss for new learning (medial temporal lobe and hippocampus), with verbal memory worse after left damage and visual memory worse after right damage; on the left, fluent (Wernicke's) aphasia with poor comprehension; naming and semantic problems in the anterior left temporal lobe; problems recognising faces or music on the right.
- Tests: Rey Auditory Verbal Learning Test, Logical Memory and other Wechsler Memory Scale subtests, the PGI Memory Scale, Rey Complex Figure recall, naming tests, comprehension tasks.

## Parietal lobes
- Left: Gerstmann syndrome (finger agnosia, left right confusion, acalculia and agraphia), apraxia, reading and writing problems.
- Right: neglect of the left side of space, dressing apraxia, poor construction and spatial judgement, denial of illness.
- Tests: line bisection and cancellation tasks for neglect, block design, figure copying, the Bender Gestalt and clock drawing, finger naming and calculation tasks.

## Occipital lobes
- Signs: visual field loss, visual agnosia (cannot recognise objects though vision is intact), prosopagnosia with damage on the underside of the occipital and temporal lobes, and difficulty reading.
- Tests: visual field testing, object and face recognition tasks, visual organisation tests.

## Lateralisation and limits
| Left hemisphere damage | Right hemisphere damage |
| Language problems, aphasia | Visuospatial and constructional problems |
| Verbal memory worse | Visual memory worse |
| Slow, careful, anxious style | Neglect, poor insight, impulsive style |
Limits: networks cross lobes; subcortical damage mimics cortical damage; mood, education, effort and sensory problems lower scores; and imaging now locates lesions, so neuropsychology's main job is to describe function, not to find the lesion.

## Conclusion
Knowing the classic lobe syndromes lets the clinician choose tests that probe each region and interpret patterns, while remembering that function lives in networks.`,
    keyPoints: ["Localisation with network caveat", "Left language and right visuospatial dominance", "Frontal signs and executive tests", "Temporal memory and language deficits by side", "Parietal: Gerstmann and neglect", "Occipital: agnosia and prosopagnosia", "Lateralisation table", "Limits and modern role"],
    module: "assessment/2-6",
    visuals: [brain("Principles", { frontal: "Planning, inhibition, flexibility: WCST, Trail Making B, fluency", broca: "Left: non fluent aphasia", temporal: "Memory and language: Rey AVLT, Logical Memory, naming", wernicke: "Left: fluent aphasia with poor comprehension", parietal: "Left: Gerstmann syndrome; right: neglect, constructional apraxia", occipital: "Visual fields, object and face recognition", hippocampus: "New learning and delayed recall" })],
    ref: "Lezak Neuropsychological Assessment 5th ed; Kolb and Whishaw Fundamentals of Human Neuropsychology; Gerstmann 1940",
  },
  {
    id: "asmt-l05-005",
    subject: S,
    topic: "reliability",
    marks: 10,
    difficulty: 4,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "With worked numerical examples, explain the Spearman Brown formula, Cronbach's alpha, the standard error of measurement, correction for attenuation and the reliable change index.",
    plan: ["Spearman Brown for split half and test length", "Cronbach's alpha and KR 20", "SEM and confidence band", "Correction for attenuation and the validity ceiling", "Reliable change index", "One line on interpretation"],
    answer: `## Spearman Brown formula
When a test is split into two halves, the correlation between halves underestimates the reliability of the full length test. The Spearman Brown formula corrects this:
- Full test reliability = 2r divided by (1 + r).
Example: odd and even halves correlate 0.70. Full reliability = 1.40 divided by 1.70 = 0.82.
The general form predicts reliability when a test is made k times longer: new reliability = kr divided by (1 + (k minus 1) r). A 20 item test with reliability 0.60 doubled to 40 items: 1.20 divided by 1.60 = 0.75.

## Cronbach's alpha and KR 20
Alpha = (k divided by (k minus 1)) multiplied by (1 minus the sum of item variances divided by the total score variance), where k is the number of items.
Example: a 5 item anxiety scale has item variances adding up to 5.0 and a total score variance of 15.0.
- k divided by (k minus 1) = 5 divided by 4 = 1.25.
- 1 minus 5 divided by 15 = 0.667.
- Alpha = 1.25 multiplied by 0.667 = 0.83.
For right or wrong items, KR 20 uses the sum of pq (proportion passing multiplied by proportion failing) in place of item variances. A 10 item test with sum of pq = 2.0 and total variance 8.0 gives 10 divided by 9 multiplied by 0.75 = 0.83.

## Standard error of measurement
SEM = SD multiplied by the square root of (1 minus reliability).
Example: a scale with T scores (SD 10) and reliability 0.84. SEM = 10 multiplied by 0.4 = 4. A person scoring 68 has a 95 percent band of 68 plus or minus 1.96 multiplied by 4, about 60 to 76. So we cannot be confident that the true score is above the clinical cut off of 65.

## Correction for attenuation
Unreliable measures weaken observed correlations. The corrected correlation = observed r divided by the square root of (reliability of X multiplied by reliability of Y).
Example: a new test correlates 0.40 with a criterion; reliabilities are 0.64 and 0.81. Corrected r = 0.40 divided by (0.8 multiplied by 0.9) = 0.40 divided by 0.72 = 0.56.
The same logic sets a ceiling: a test's validity coefficient cannot exceed the square root of its reliability. A test with reliability 0.49 cannot correlate above 0.70 with anything.

## Reliable change index
Neil Jacobson and Paul Truax proposed the reliable change index to judge whether a change between two testings is larger than measurement error.
- Standard error of the difference = square root of (2 multiplied by SEM squared).
- RCI = (score after minus score before) divided by the standard error of the difference.
Example: with SEM 4, the standard error of the difference = square root of 32 = 5.66. A patient's depression score falls from 30 to 18, a change of 12. RCI = 12 divided by 5.66 = 2.12, which exceeds 1.96, so the change is reliable at the 95 percent level.

## Interpretation
Reliability is a property of scores in a particular sample, so these values should be calculated for the population tested, and the right coefficient chosen for the type of error that matters.`,
    keyPoints: ["Spearman Brown formula and correct worked example", "General formula for test length", "Alpha formula with each part explained", "KR 20 for dichotomous items", "SEM calculation and 95 percent band against a cut off", "Correction for attenuation and validity ceiling", "Reliable change index with standard error of difference", "Reliability belongs to scores in a sample"],
    pitfalls: ["Forgetting to take square roots", "Using 1 minus r instead of the square root of 1 minus r in the SEM"],
    module: "assessment/3-3",
    visuals: [vis("worked", { title: "Reliable change index", steps: [
      { q: "SEM is 4. What is the standard error of the difference between two testings?", a: "Square root of (2 multiplied by 16) = square root of 32 = 5.66." },
      { q: "Score falls from 30 to 18. What is the RCI?", a: "12 divided by 5.66 = 2.12." },
      { q: "Is the change reliable?", a: "Yes. 2.12 is above 1.96, so it is unlikely to be measurement error alone." },
    ], yourTurn: [
      { q: "Halves correlate 0.60. What is the full test reliability?", a: "1.20 divided by 1.60 = 0.75." },
      { q: "SD 15, reliability 0.91. What is the SEM?", a: "15 multiplied by the square root of 0.09 = 15 multiplied by 0.3 = 4.5." },
    ] }, "Reliable change index")],
    ref: "Spearman 1910 and Brown 1910; Cronbach 1951; Kuder and Richardson 1937; Jacobson and Truax 1991 J Consult Clin Psychol; Nunnally and Bernstein Psychometric Theory",
  },
  {
    id: "asmt-l05-006",
    subject: S,
    topic: "clinical-decision",
    marks: 10,
    difficulty: 4,
    exams: ["mcp-entrance", "md-psychiatry", "ugc-net"],
    question: "A depression screening questionnaire has a sensitivity of 90 percent and a specificity of 80 percent. Work out its positive and negative predictive values in a clinic where 10 percent of patients are depressed and in a community where 1 percent are. Discuss what the results show.",
    plan: ["Set up the two by two table for 1,000 people", "Calculate PPV and NPV at 10 percent prevalence", "Repeat at 1 percent prevalence", "Likelihood ratios", "Lessons for screening and cut offs"],
    answer: `## Setting up the table
Work with 1,000 people and fill a two by two table: true positives (a), false positives (b), false negatives (c) and true negatives (d).
- Sensitivity = a divided by (a + c).
- Specificity = d divided by (b + d).
- Positive predictive value (PPV) = a divided by (a + b).
- Negative predictive value (NPV) = d divided by (c + d).

## Clinic with 10 percent prevalence
- 100 people are depressed and 900 are not.
- Sensitivity 90 percent: 90 true positives, 10 false negatives.
- Specificity 80 percent: 720 true negatives, 180 false positives.
| | Depressed | Not depressed | Total |
| Screen positive | 90 | 180 | 270 |
| Screen negative | 10 | 720 | 730 |
- PPV = 90 divided by 270 = 33 percent.
- NPV = 720 divided by 730 = 98.6 percent.
Two of every three positive screens are false alarms, but a negative screen is very reassuring.

## Community with 1 percent prevalence
- 10 people are depressed and 990 are not.
- True positives 9, false negatives 1.
- True negatives 792 (80 percent of 990), false positives 198.
- PPV = 9 divided by 207 = 4.3 percent.
- NPV = 792 divided by 793 = 99.9 percent.
Now about 22 of every 23 positives are false.

## Likelihood ratios
Likelihood ratios do not change with prevalence.
- LR positive = sensitivity divided by (1 minus specificity) = 0.90 divided by 0.20 = 4.5.
- LR negative = (1 minus sensitivity) divided by specificity = 0.10 divided by 0.80 = 0.125.
A positive result multiplies the odds of depression by 4.5. At 10 percent prevalence the pre test odds are 1 to 9 (0.111); post test odds are 0.5, which is a probability of 33 percent, matching the table.

## What this shows
- Sensitivity and specificity belong to the test; predictive values belong to the test in a setting. The same questionnaire is far less useful in a low prevalence population, which is what Paul Meehl and Albert Rosen warned about in 1955 when they wrote on base rates.
- Screening in the community needs a second stage: a positive screen should lead to a clinical interview, not to a diagnosis or treatment.
- Raising the cut off increases specificity and PPV but misses more cases; the choice depends on the cost of a missed case compared with a false alarm.
- In India's primary care and community programmes, two stage screening (for example a short questionnaire followed by a trained health worker's or doctor's assessment) is the practical answer.

## Conclusion
A good test can still give mostly false positives when a condition is rare. Calculating predictive values for the actual setting, and using likelihood ratios, prevents this common error.`,
    keyPoints: ["Correct formulas for the four indices", "Table for 10 percent prevalence filled correctly", "PPV 33 percent and NPV 98.6 percent", "PPV 4.3 percent at 1 percent prevalence", "Likelihood ratios 4.5 and 0.125 with odds conversion", "Predictive values depend on base rate (Meehl and Rosen)", "Two stage screening and cut off choice"],
    pitfalls: ["Confusing sensitivity with PPV", "Calculating with percentages without a fixed population"],
    module: "assessment/2-1",
    visuals: [vis("worked", { title: "Clinic with 10 percent prevalence", steps: [
      { q: "Of 1,000 patients, 100 are depressed. How many does the screen catch?", a: "90 percent of 100 = 90 true positives; 10 are missed." },
      { q: "Of the 900 who are not depressed, how many screen positive?", a: "20 percent of 900 = 180 false positives." },
      { q: "What is the PPV?", a: "90 divided by (90 + 180) = 33 percent." },
    ], yourTurn: [
      { q: "Same test, prevalence 50 percent. What is the PPV?", a: "450 true positives and 100 false positives: 450 divided by 550 = 82 percent." },
    ] }), { kind: "figure", data: { id: "signal-detection" }, caption: "What this shows: moving the cut off trades hits against false alarms." }],
    ref: "Meehl and Rosen 1955 Psychological Bulletin base rates; Altman and Bland 1994 BMJ diagnostic tests; Kroenke 2001 PHQ-9 accuracy; study module assessment 2.1",
  },
  {
    id: "asmt-l05-007",
    subject: S,
    topic: "item-factor-analysis",
    marks: 10,
    difficulty: 4,
    exams: ["mcp-entrance", "ugc-net"],
    question: "Explain the use of factor analysis in test construction. Distinguish exploratory and confirmatory factor analysis and describe how the number of factors is decided.",
    plan: ["Purpose of factor analysis", "Suitability checks", "Exploratory factor analysis steps and deciding the number of factors", "Rotation and loadings", "Confirmatory factor analysis and fit indices", "Comparison and conclusion"],
    answer: `## Purpose
Factor analysis is a set of statistical methods that explain the correlations among many items by a smaller number of underlying variables called factors. In test construction it is used to:
- Find out how many dimensions a set of items measures.
- Decide which items belong to which subscale and drop items that do not fit.
- Provide evidence of construct validity (internal structure).
- Test whether a translated test has the same structure in a new population.

## Suitability checks
The sample should be large (often 5 to 10 people per item and at least 200 to 300). The Kaiser Meyer Olkin measure should be above about 0.6, and Bartlett's test of sphericity should be significant, showing that the items correlate enough to be factored.

## Exploratory factor analysis
EFA is used when the structure is not known in advance.
1. Extract factors (principal axis factoring or maximum likelihood; principal components analysis is related but not strictly factor analysis).
2. Decide how many factors to keep:
- Kaiser's rule: keep factors with eigenvalues above 1. It is simple but usually keeps too many.
- Raymond Cattell's scree plot: plot eigenvalues and keep the factors before the "elbow" where the line flattens.
- John Horn's parallel analysis: keep factors whose eigenvalues are larger than those from random data of the same size. This is the most accurate method.
- Theory and interpretability: each factor should make sense.
3. Rotate the factors to make them easier to interpret. Orthogonal rotation (varimax) keeps factors uncorrelated; oblique rotation (promax, oblimin) allows them to correlate, which is usually more realistic in psychology.
4. Read the loadings: the correlation of each item with each factor. Loadings of about 0.4 or above are usually taken as meaningful; items loading on two factors (cross loading) or none are revised or dropped.
5. Name the factors from the content of high loading items.

## Confirmatory factor analysis
CFA tests a structure stated in advance, for example that a depression scale has a cognitive and a somatic factor with specified items on each. It is done with structural equation modelling and judged by fit indices:
| Index | Good fit |
| Comparative Fit Index (CFI) | 0.95 or above |
| Tucker Lewis Index (TLI) | 0.95 or above |
| Root Mean Square Error of Approximation (RMSEA) | 0.06 or below |
| Standardised Root Mean Square Residual (SRMR) | 0.08 or below |
The chi square test is reported but is almost always significant in large samples. CFA is also used to test measurement invariance across groups, such as men and women, or Hindi and English versions.

## Comparison
| EFA | CFA |
| Structure discovered from data | Structure specified from theory |
| All items may load on all factors | Each item loads only where specified |
| Used early in test development | Used to confirm, often on a new sample |
| Number of factors decided by scree and parallel analysis | Model fit judged by indices |

## Conclusion
EFA uncovers the structure of a new set of items; CFA tests whether a theorised structure holds, including across groups. Good practice is to explore on one sample and confirm on another.`,
    keyPoints: ["Purpose in test construction and construct validity", "Sample size, KMO and Bartlett", "Kaiser, scree and parallel analysis", "Orthogonal versus oblique rotation", "Loadings about 0.4 and cross loadings", "CFA fit indices with cut offs", "Measurement invariance", "Explore on one sample, confirm on another"],
    module: "assessment/3-2",
    visuals: [chain("Exploratory factor analysis", [["Check suitability", "Sample size, KMO above 0.6, Bartlett significant"], ["Extract", "Principal axis or maximum likelihood"], ["Decide number", "Scree plot and parallel analysis, not eigenvalue 1 alone"], ["Rotate", "Oblique if factors are expected to correlate"], ["Interpret", "Loadings 0.4 or above; drop cross loading items"]]), compare("Comparison", ["Exploratory", ["No structure assumed", "Items free to load anywhere", "Number of factors found from data", "Early development"], "Discovery"], ["Confirmatory", ["Structure stated first", "Loadings fixed where theory says", "Fit indices: CFI, RMSEA, SRMR", "Validation and invariance"], "Testing theory"])],
    ref: "Cattell 1966 scree test; Horn 1965 parallel analysis; Fabrigar 1999 evaluating EFA; Hu and Bentler 1999 cut-off criteria; Brown Confirmatory Factor Analysis for Applied Research",
  },
  {
    id: "asmt-l05-008",
    subject: S,
    topic: "indian-tests-sld",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "How is a specific learning disorder assessed in India? Describe the criteria, the tools and the process of certification and accommodation.",
    plan: ["Definition and DSM-5-TR criteria", "Ruling out other causes", "Assessment tools including Indian tools", "Certification under the RPwD Act", "Accommodations and remediation"],
    answer: `## Definition and criteria
A specific learning disorder is a neurodevelopmental difficulty in learning and using academic skills (reading, written expression or mathematics) in a person whose general intelligence is usually in the average range. DSM-5-TR requires:
1. Difficulties lasting at least six months despite targeted help, such as slow, effortful reading, poor spelling or weak number sense.
2. Skills substantially and measurably below what is expected for age on standardised, individually given achievement tests, causing problems at school, work or daily life.
3. Onset during the school years, though it may become fully obvious only when demands rise.
4. Not better explained by intellectual disability, uncorrected vision or hearing problems, other mental or neurological disorders, lack of proficiency in the language of instruction, or inadequate teaching.
Severity is rated as mild, moderate or severe.

## Ruling out other causes
- Vision and hearing tests.
- An intelligence test (such as MISIC, WISC-IV India or the Binet-Kamat) to exclude intellectual disability.
- History of schooling: attendance, change of school, language of instruction. In India many children learn in a second or third language, and poor teaching is common, so lack of opportunity must be excluded.
- Screening for ADHD, anxiety, depression, bullying and family stress, which can both cause and accompany poor school work.

## Tools
- NIMHANS Index for Specific Learning Disabilities, with level I for younger children and level II for older children, testing reading, writing, spelling, comprehension and arithmetic against class level. It is widely used for certification.
- Diagnostic Test of Learning Disability and the Grade Level Assessment Device, along with curriculum based tests in each language the child studies.
- Tests of phonological awareness, rapid naming, visual motor skills (Bender Gestalt) and memory.
- Teacher reports, school notebooks and examination papers.
- Tools for adults over 18 were added in the 2024 revision of the national guidelines.

## Certification
Specific learning disabilities are one of the 21 specified disabilities under the Rights of Persons with Disabilities Act 2016. Assessment for a disability certificate follows the government guidelines for assessing specified disabilities, using notified tools, by a medical authority that includes a clinical psychologist. A certificate allows the person to apply for a Unique Disability ID card and to claim accommodations; a benchmark disability of 40 percent or more gives access to further benefits.

## Accommodations and remediation
- Examination accommodations given by boards such as CBSE and state boards: extra time, a reader or scribe, exemption from a third language, and in some boards use of a calculator.
- Remedial teaching by a trained special educator, based on structured, multisensory teaching of reading and spelling, which works better than more ordinary tuition.
- Classroom support: seating, oral testing, reduced copying, assistive technology.
- Counselling for self esteem and family guidance, since children are often labelled lazy.

## Conclusion
Assessing a specific learning disorder means showing a persistent, narrow academic deficit with adequate intelligence and opportunity. In India, the NIMHANS index and related tools, certification under the RPwD Act and board accommodations turn the diagnosis into real help.`,
    keyPoints: ["Definition with average intelligence", "Four DSM-5-TR criteria including six months despite help", "Exclusion of ID, sensory problems, language of instruction and poor teaching", "NIMHANS SLD index levels I and II", "Other tools and school records", "RPwD specified disability, guidelines, UDID", "Board accommodations", "Remediation and counselling"],
    module: "child/1-5",
    visuals: [tree("Ruling out other causes", [["Poor school performance", "Start by asking why", -1], ["Vision or hearing", "Test before anything else", 0], ["Intellectual disability", "Low IQ and low adaptive skills across the board", 0], ["Language and teaching", "Taught in an unfamiliar language or poorly taught", 0], ["Emotional or attention problems", "ADHD, anxiety, bullying, family stress", 0], ["Specific learning disorder", "One skill far behind despite average ability and help", 0]])],
    ref: "DSM-5-TR specific learning disorder; Kapur, John, Rozario and Oommen NIMHANS Index for SLD 2002; RPwD Act 2016 schedule; DEPwD guidelines for assessing specified disabilities 2018, revised March 2024 (ThePrint 18 Mar 2024 on adult SLD tools); IPS clinical practice guideline on SLD; CBSE exam concessions circulars; study module child 1.5",
  },
  {
    id: "asmt-l05-009",
    subject: S,
    topic: "norms-standardisation",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "cuet-pg"],
    question: "A test has a mean of 50 and a standard deviation of 10. Convert raw scores of 62 and 41 into z scores, T scores, deviation IQ equivalents, percentiles and stanines, and explain each step.",
    plan: ["Formula for z", "Convert to T and IQ", "Percentiles from the normal curve", "Stanines", "Comment"],
    answer: `## The z score
The z score tells how many standard deviations a raw score lies from the mean: z = (raw score minus mean) divided by SD.
- Raw 62: z = (62 minus 50) divided by 10 = 1.2.
- Raw 41: z = (41 minus 50) divided by 10 = minus 0.9.

## T scores and IQ equivalents
Any standard score = new mean + (z multiplied by new SD).
- T score (mean 50, SD 10): 62 gives 50 + 12 = 62; 41 gives 50 minus 9 = 41. T equals the raw score here because the test already has mean 50 and SD 10.
- Deviation IQ equivalent (mean 100, SD 15): z 1.2 gives 100 + 18 = 118; z minus 0.9 gives 100 minus 13.5 = 86.5, about 87.

## Percentiles
Using normal curve tables, the proportion below z = 1.2 is 0.885, so a score of 62 is at about the 88th or 89th percentile. The proportion below z = minus 0.9 is 0.184, so a score of 41 is at about the 18th percentile.

## Stanines
Stanines are nine bands, each half an SD wide except the two ends (mean 5, SD about 2). Stanine 5 covers z from minus 0.25 to plus 0.25.
- z = 1.2 falls between 0.75 and 1.25: stanine 7.
- z = minus 0.9 falls between minus 1.25 and minus 0.75: stanine 3.

## Summary table
| Raw | z | T | IQ equivalent | Percentile | Stanine |
| 62 | 1.2 | 62 | 118 | About 88 | 7 |
| 41 | minus 0.9 | 41 | About 87 | About 18 | 3 |

## Comment
All these scores carry the same information in different units. Percentiles are easy to explain but have unequal units, and the conversions assume a normal distribution.`,
    keyPoints: ["z formula and correct z values", "General conversion formula", "Correct T and IQ equivalents", "Percentiles from normal tables", "Stanine bands and correct stanines", "Unequal percentile units and normality assumption"],
    pitfalls: ["Forgetting the minus sign for scores below the mean", "Reading the percentile for the wrong tail"],
    module: "assessment/3-3",
    visuals: [{ kind: "figure", data: { id: "normal-curve-scales" }, caption: "Percentiles: find z 1.2 and z minus 0.9 on the curve and read down to the other scales." }],
    ref: "Anastasi and Urbina Psychological Testing ch 3 norms; standard normal table values 0.8849 and 0.1841",
  },
  {
    id: "asmt-l05-010",
    subject: S,
    topic: "neuropsych-dementia",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the neuropsychological profiles that help distinguish Alzheimer's disease, frontotemporal dementia, vascular cognitive impairment, dementia with Lewy bodies and depression related cognitive impairment.",
    plan: ["Role of neuropsychology in dementia diagnosis", "Cortical and subcortical patterns", "Profile of each condition", "Comparison table", "Tests and Indian considerations", "Conclusion"],
    answer: `## Role of neuropsychology
Imaging and blood tests show disease processes, but the diagnosis of dementia rests on a decline in cognition and daily function. Neuropsychological testing documents which domains are affected, how severely, and how they change over time. The pattern of deficits points to the likely cause, separates dementia from depression and normal ageing, establishes a baseline, and guides care and capacity decisions.

## Two broad patterns
- A "cortical" pattern, typical of Alzheimer's disease: amnesia with rapid forgetting, aphasia, apraxia and agnosia.
- A "subcortical" pattern, typical of vascular disease, Parkinson's disease and depression: slowed thinking, poor attention and executive function, and a retrieval problem in memory, with relatively preserved language.
These are tendencies, not rules.

## Alzheimer's disease
- Earliest and most marked: episodic memory. Patients learn poorly over trials, forget rapidly after a delay, and do not improve much with cues or recognition, because storage in the hippocampus fails.
- Next: naming and semantic fluency (animals fall more than letter fluency), then visuospatial and executive problems.
- Orientation to time is lost early. Insight is often reduced. Social manners are kept until later.

## Frontotemporal dementia
- Behavioural variant: early change in personality and behaviour (disinhibition, apathy, loss of empathy, compulsive or ritual behaviour, change in food preference) with executive dysfunction. Memory and visuospatial skills are relatively spared early, so the MMSE may be normal.
- Language variants: in semantic variant primary progressive aphasia, loss of word meaning with fluent empty speech and poor naming; in non fluent variant, effortful speech with grammatical errors.
- Letter fluency is poor; social cognition tests (recognising emotions, understanding faux pas) are impaired.

## Vascular cognitive impairment
- Slowed processing speed, poor attention and executive function, often from small vessel disease affecting frontal subcortical circuits.
- Memory problem of retrieval: free recall is poor but recognition and cued recall are much better.
- Stepwise decline after strokes, focal signs, mood change. Mixed Alzheimer's and vascular disease is common in older Indians with diabetes and hypertension.

## Dementia with Lewy bodies
- Fluctuating attention and alertness, with marked variation from day to day.
- Early and severe visuospatial and visuoperceptual deficits (poor copying of pentagons and clocks), out of proportion to memory loss.
- Executive dysfunction; recognition memory relatively better than in Alzheimer's.
- Clinical features: recurrent well formed visual hallucinations, parkinsonism, REM sleep behaviour disorder and severe sensitivity to antipsychotics.

## Depression related cognitive impairment
- Complaints of poor memory often exceed what testing shows; patients say "I don't know" and give up, while people with Alzheimer's often attempt answers and make errors.
- Slowing, poor concentration and effortful tasks are affected; recognition is preserved; performance improves with encouragement.
- Onset is often rapid with clear mood symptoms and a past history of depression. Cognition improves with treatment, though in older adults depression can be an early sign of later dementia and needs follow up.

## Comparison
| Feature | Alzheimer's | Behavioural FTD | Vascular | Lewy body | Depression |
| Memory | Storage failure, rapid forgetting | Relatively spared early | Retrieval problem | Moderate, retrieval type | Retrieval and effort problem |
| Recognition | Poor | Fair | Better than recall | Better than recall | Good |
| Executive | Later | Early, severe | Early | Early | Mild to moderate |
| Visuospatial | Later | Spared | Variable | Early, severe | Usually spared |
| Language | Naming, semantic fluency | Variable; language variants | Mild | Mild | Normal |
| Other | Poor insight | Behaviour change | Stepwise, focal signs | Fluctuation, hallucinations | Low mood, "don't know" |

## Tests and Indian considerations
Useful tools include ACE-III (domain profile), list learning with recognition (Rey AVLT), story recall, verbal fluency (letter and category), Trail Making, clock and figure copying, naming tests and social cognition tasks, plus depression scales such as the Geriatric Depression Scale. In India, low literacy, multilingualism and limited norms complicate interpretation, so education adjusted norms, the HMSE, the NIMHANS battery and informant reports of change are essential. The 10/66 Dementia Research Group showed that culture and education fair assessment combining cognitive tests and informant interview works well in Indian communities.

## Conclusion
Distinguishing the dementias depends on the pattern of memory (storage or retrieval), executive, visuospatial, language and behavioural change, together with history and imaging. Careful, culturally fair testing makes this possible and also catches treatable depression.`,
    keyPoints: ["Role of testing in diagnosis and baseline", "Cortical versus subcortical patterns", "Alzheimer's: storage memory failure and poor recognition", "Behavioural FTD: executive and behaviour change, memory spared; language variants", "Vascular: slowing, executive, retrieval pattern", "Lewy body: fluctuation and early visuospatial deficits", "Depression: effort, 'don't know', preserved recognition", "Indian issues: literacy, norms, 10/66 approach"],
    pitfalls: ["Relying on MMSE to exclude frontotemporal dementia", "Missing recall versus recognition as the key memory contrast"],
    module: "neurocognitive",
    visuals: [
      compare("Two broad patterns", ["Cortical pattern", ["Rapid forgetting", "Poor recognition", "Aphasia, apraxia, agnosia", "Typical of Alzheimer's"], "Storage failure"], ["Subcortical pattern", ["Slowed thinking", "Poor free recall, good recognition", "Executive problems", "Vascular, Parkinson's, depression"], "Retrieval and speed failure"]),
      brain("Frontotemporal dementia", { hippocampus: "Alzheimer's: early atrophy, storage failure", frontal: "Behavioural FTD: disinhibition, apathy, executive loss", temporal: "Semantic variant: loss of word meaning; Alzheimer's: naming", parietal: "Alzheimer's and Lewy body: visuospatial problems", occipital: "Lewy body: visual hallucinations, visuoperceptual deficits", "basal-ganglia": "Vascular and Lewy body: slowing, parkinsonism" }),
    ],
    ref: "McKhann 2011 NIA-AA criteria; Rascovsky 2011 bvFTD criteria; Gorno-Tempini 2011 PPA; McKeith 2017 DLB consensus; Skrobot 2018 VICCCS; Prince 10/66 Dementia Research Group 2003; Lezak Neuropsychological Assessment dementia chapter",
  },
]);
