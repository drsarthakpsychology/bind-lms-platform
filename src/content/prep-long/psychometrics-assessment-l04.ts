import type { LongQA } from "@/lib/prep/long-types";
import { anchored, brain, chain, compare, timeline, tree, vis } from "./visual";

const S = "psychometrics-assessment" as const;

export const PSYCHOMETRICS_ASSESSMENT_L04: LongQA[] = anchored([
  {
    id: "asmt-l04-001",
    subject: S,
    topic: "sentence-completion",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "mcp-entrance", "cuet-pg"],
    question: "Write short notes on sentence completion tests.",
    plan: ["Nature and place among projective techniques", "Rotter Incomplete Sentences Blank", "Sacks Sentence Completion Test", "Uses and limits"],
    answer: `## Nature
A sentence completion test gives the person the first few words of a sentence, called a stem, and asks them to finish it with their own words, for example "My father..." or "I feel guilty when...". It is a completion technique in Lindzey's classification of projective methods. It is more structured than inkblots, so responses are easier to understand, but less structured than a questionnaire, so people can show their own concerns. Stems written in the first person ("I...") pull for more personal answers than stems in the third person.

## Rotter Incomplete Sentences Blank
Julian Rotter's test of 1950, revised in 1992, has 40 stems for high school, college and adult forms. Each completion is rated on a seven point scale from positive to strong conflict, and the ratings are added to give an overall adjustment score. A total of about 135 or more suggests maladjustment and is used as a screening cut off. Scoring is objective enough to give good inter scorer reliability.

## Sacks Sentence Completion Test
Joseph Sacks and Sidney Levy's test of 1950 has 60 stems covering four areas: family, sex, interpersonal relations and self concept, divided into 15 attitudes such as attitude to mother, fears and guilt. The clinician rates disturbance in each attitude, which gives a quick map of problem areas.

## Uses and limits
Sentence completion tests are quick, cheap, easy to translate into Indian languages and easy to adapt for children, students or specific settings such as de addiction or school counselling. They give topics to explore in interview. Limits: the purpose is fairly obvious, so answers can be guarded or faked; responses depend on literacy and verbal skill; and apart from the Rotter, most versions lack norms and formal scoring.`,
    keyPoints: ["Definition with stems", "Completion type in Lindzey's scheme", "Rotter: 40 stems, seven point rating, cut off about 135", "Sacks: 60 stems, four areas, 15 attitudes", "Uses including Indian adaptations", "Limits: transparency and literacy"],
    module: "assessment/2-4",
    visuals: [vis("sort", { prompt: "Which area of the Sacks test does each stem tap?", buckets: ["Family", "Interpersonal relations", "Self concept"], items: [
      { text: "My mother and I...", bucket: 0 },
      { text: "Compared with most families, mine...", bucket: 0 },
      { text: "The people I work with...", bucket: 1 },
      { text: "My greatest mistake was...", bucket: 2 },
      { text: "I believe I have the ability to...", bucket: 2 },
    ] }, "Sacks Sentence Completion Test")],
    ref: "Rotter and Rafferty 1950 RISB manual; Rotter, Lah and Rafferty 1992 second edition; Sacks and Levy 1950",
  },
  {
    id: "asmt-l04-002",
    subject: S,
    topic: "drawing-tests",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on drawing tests in psychological assessment.",
    plan: ["Rationale", "Main drawing tests", "Scoring approaches", "Evaluation"],
    answer: `## Rationale
Drawing tests ask the person to draw a figure, a house, a tree or a family. They are used in two very different ways: as a rough measure of cognitive development in children, and as an expressive projective technique on the assumption that the drawing reflects the person's self image and feelings.

## Main tests
- Draw a Man: devised by Florence Goodenough in 1926 and scored for details as a measure of intellectual maturity; Dale Harris revised it in 1963 as the Goodenough Harris Drawing Test with man, woman and self drawings.
- Draw a Person: Karen Machover in 1949 interpreted the drawing as a projection of body image; for example, large eyes were read as suspicion.
- House Tree Person: introduced by John Buck in 1948; the house is said to reflect home life, the tree the deeper self and the person the self in relationships.
- Kinetic Family Drawing: devised by Robert Burns and S Harvard Kaufman in 1970, asks the child to draw everyone in the family doing something, to show relationships and roles.

## Scoring approaches
Developmental scoring counts body parts and details against age norms; Elizabeth Koppitz listed emotional indicators in children's drawings, such as tiny figures or missing hands. Projective interpretation of single signs is usually impressionistic.

## Evaluation
Developmental scores correlate moderately with intelligence and are useful for a quick estimate. Interpretations of single signs have little validity, and the Chapmans' work on illusory correlation showed that clinicians see links they expect. Drawings should never be used to "prove" abuse. Their best use is to build rapport with children, start a conversation, and observe motor and planning skills.`,
    keyPoints: ["Two uses: development and projection", "Goodenough 1926 and Harris 1963", "Machover's body image hypothesis", "Buck's House Tree Person", "Kinetic Family Drawing", "Koppitz emotional indicators", "Weak validity of single signs; rapport value"],
    module: "assessment/2-4",
    visuals: [timeline("Put the drawing tests in the order they appeared.", [["Goodenough's Draw a Man", "1926"], ["Buck's House Tree Person", "1948"], ["Machover's Draw a Person", "1949"], ["Goodenough Harris revision", "1963"], ["Kinetic Family Drawing", "1970"]], "Drawing began as a cognitive measure, then was taken up as a projective technique, and later moved into family relationships.")],
    ref: "Goodenough 1926; Harris 1963; Machover 1949; Buck 1948; Burns and Kaufman 1970; Koppitz 1968; Chapman and Chapman 1967",
  },
  {
    id: "asmt-l04-003",
    subject: S,
    topic: "rating-scales",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Discuss the role of rating scales in psychiatry. Describe the commonly used clinician rated and self rated scales for depression, psychosis, mania, anxiety and OCD, and their limitations.",
    plan: ["Definition and uses", "Types: clinician rated, self rated, observer and global", "Scales by disorder with item numbers and scoring", "Psychometric properties and Indian versions", "Limitations and good practice", "Conclusion"],
    answer: `## Definition and uses
A rating scale is a structured tool on which a clinician, the patient or an informant rates the presence or severity of symptoms on a fixed scale. Unlike a diagnostic interview, its main job is to measure how severe a condition is and how it changes, not to make the diagnosis. Uses:
- Screening in clinics and the community.
- Measuring baseline severity and tracking response to treatment.
- Defining response and remission in clinical trials.
- Communicating severity clearly between clinicians.
- Research and audit.

## Types
- Clinician rated: a trained rater interviews and rates, for example the HAM-D, MADRS, BPRS, PANSS, YMRS and Y-BOCS.
- Self rated: the patient completes it, for example the BDI-II, PHQ-9 and GAD-7.
- Observer or informant rated: for children, people with dementia or intellectual disability.
- Global scales: the Clinical Global Impression scale rates overall severity (1 to 7) and improvement (1 to 7).

## Scales by disorder
| Scale | Rated by | Items | Range and key points |
| Hamilton Depression Rating Scale (HAM-D) | Clinician | 17 | Max 52; above 23 is often called severe; heavy on sleep, anxiety and body symptoms |
| Montgomery Asberg Depression Rating Scale (MADRS) | Clinician | 10 | 0 to 60; fewer physical items, sensitive to change with antidepressants |
| Beck Depression Inventory (BDI-II) | Self | 21 | 0 to 63; 0 to 13 minimal, 14 to 19 mild, 20 to 28 moderate, 29 to 63 severe |
| Patient Health Questionnaire (PHQ-9) | Self | 9 | 0 to 27; 5, 10, 15 and 20 mark mild, moderate, moderately severe and severe; item 9 asks about thoughts of death |
| Brief Psychiatric Rating Scale (BPRS) | Clinician | 18 | Each 1 to 7; broad psychotic and mood symptoms |
| Positive and Negative Syndrome Scale (PANSS) | Clinician | 30 | 7 positive, 7 negative, 16 general psychopathology; each 1 to 7, total 30 to 210 |
| Scale for the Assessment of Negative Symptoms (SANS) | Clinician | 25 | Affective flattening, alogia, avolition, anhedonia, attention |
| Young Mania Rating Scale (YMRS) | Clinician | 11 | 0 to 60; four items double weighted |
| Hamilton Anxiety Rating Scale (HAM-A) | Clinician | 14 | 0 to 56; psychic and somatic anxiety |
| Generalised Anxiety Disorder scale (GAD-7) | Self | 7 | 0 to 21; 5, 10 and 15 mark mild, moderate and severe |
| Yale Brown Obsessive Compulsive Scale (Y-BOCS) | Clinician | 10 | 0 to 40; five items for obsessions, five for compulsions; 16 or more usually clinically significant |
Other common tools include the AUDIT for alcohol use, the Clinical Institute Withdrawal Assessment (CIWA-Ar) for alcohol withdrawal, the Abnormal Involuntary Movement Scale for tardive dyskinesia and the Edinburgh Postnatal Depression Scale.

## Psychometric properties and Indian use
Good scales report inter rater reliability (often an intraclass correlation above 0.8 after training), internal consistency, sensitivity to change, and cut offs validated against diagnosis. The HAM-D has been criticised for poor internal consistency and for mixing several factors; the six item Hamilton core (melancholia subscale) is more unidimensional. In India, the PHQ-9 and GAD-7 have been validated in Hindi and other languages for primary care, and WHO's Self Reporting Questionnaire (SRQ-20) and the General Health Questionnaire (GHQ-12) are widely used for screening in community and research. The National Mental Health Survey of 2015 to 2016 used a structured interview, the MINI, rather than rating scales, to reach diagnoses.

## Limitations
- Severity scores are not diagnoses: a high PHQ-9 score can come from grief, a medical illness or another disorder.
- Self rated scales depend on literacy, insight and honesty; people with severe depression or psychosis may under report, while distressed people may over report.
- Clinician rated scales need training and can drift between raters; halo and leniency errors creep in.
- Physical symptom items inflate scores in medically ill people and in older adults.
- Cultural expression of distress (for example, bodily complaints, "sinking heart" or "tension") may not map onto Western items, and translations need validation, not just word for word conversion.
- Cut offs vary with the population and the base rate.
- Scales measure a narrow set of symptoms and may miss function, quality of life and what matters to the patient.

## Good practice
1. Choose a scale validated for the purpose, population and language.
2. Train raters and check reliability.
3. Use the same scale at baseline and follow up, ideally by the same rater.
4. Combine a severity scale with a full interview and, where needed, informant information.
5. Act on safety items such as PHQ-9 item 9 the same day.

## Conclusion
Rating scales make severity and change visible and comparable. Used with a proper diagnosis, trained raters, validated local versions and attention to culture, they are essential tools in modern psychiatry; used alone, they mislead.`,
    keyPoints: ["Definition and difference from diagnostic interviews", "Clinician, self, informant and global scales", "Correct items and ranges for HAM-D, MADRS, BDI-II, PHQ-9", "BPRS, PANSS structure, SANS", "YMRS, HAM-A, GAD-7, Y-BOCS", "Psychometric properties and Indian validated versions", "Limitations including culture and medical illness", "Good practice and safety items"],
    pitfalls: ["Using a rating scale to make the diagnosis", "Wrong PANSS subscale numbers", "Ignoring the suicide item"],
    module: "assessment/2-5",
    visuals: [
      tree("Types", [["Rating scales", "Measure severity and change", -1], ["Clinician rated", "HAM-D, MADRS, BPRS, PANSS, YMRS, Y-BOCS", 0], ["Self rated", "BDI-II, PHQ-9, GAD-7", 0], ["Informant rated", "Children, dementia, intellectual disability", 0], ["Global", "Clinical Global Impression: severity and improvement", 0]]),
      vis("worked", { title: "Scoring a PHQ-9", steps: [
        { q: "Each of nine items is scored 0 (not at all) to 3 (nearly every day) for the last two weeks. Meera's answers add up to 16. What severity band is that?", a: "Moderately severe: 15 to 19." },
        { q: "She scores 1 on item 9 (thoughts of being better off dead). What must happen?", a: "A same day suicide risk assessment, whatever the total score." },
        { q: "After eight weeks of treatment her score is 6. Has she responded?", a: "Yes: a fall of 50 percent or more counts as response; under 5 would usually count as remission." },
      ] }, "Scales by disorder"),
    ],
    ref: "Hamilton 1960; Montgomery and Asberg 1979; Beck BDI-II manual 1996; Kroenke, Spitzer and Williams 2001 PHQ-9; Spitzer 2006 GAD-7; Overall and Gorham 1962; Kay, Fiszbein and Opler 1987; Young 1978; Goodman 1989 Y-BOCS; NMHS 2015-16 methodology; study module assessment 2.5",
  },
  {
    id: "asmt-l04-004",
    subject: S,
    topic: "diagnostic-interviews",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net"],
    question: "Compare unstructured, semi structured and fully structured diagnostic interviews. Describe the main structured instruments and their uses.",
    plan: ["Why structure: sources of unreliable diagnosis", "Three kinds of interview", "Main instruments", "Reliability with kappa", "Strengths, limits and conclusion"],
    answer: `## Why structure
Before the 1970s, psychiatric diagnosis was notoriously unreliable: two clinicians often gave the same patient different labels. Research showed three sources of disagreement: information variance (asking different questions), observation variance (noticing different signs) and criterion variance (using different rules to reach a diagnosis). Explicit criteria in DSM-III and ICD-10 reduced criterion variance; structured interviews reduce information and observation variance.

## Three kinds of interview
| Kind | Who uses it | Features |
| Unstructured | Clinicians in routine practice | Free flowing, flexible, good for rapport and formulation; lowest reliability |
| Semi structured | Trained clinicians | Fixed questions with freedom to probe; clinician judges whether a symptom is clinically significant |
| Fully structured | Lay interviewers or computers | Questions read exactly as written, answers coded as given; suits large surveys |

## Main instruments
- Structured Clinical Interview for DSM-5 (SCID-5): semi structured, clinician administered; the clinician version covers common disorders, and SCID-5-PD covers personality disorders.
- Mini International Neuropsychiatric Interview (MINI): short structured interview of about 15 to 20 minutes for DSM and ICD disorders. India's National Mental Health Survey of 2015 to 2016 used the MINI.
- Schedules for Clinical Assessment in Neuropsychiatry (SCAN): WHO's semi structured system, built on the Present State Examination, for detailed psychopathology; used in WHO cross national studies.
- Composite International Diagnostic Interview (CIDI): WHO's fully structured interview for lay interviewers, used in the World Mental Health Surveys.
- Kiddie Schedule for Affective Disorders and Schizophrenia (K-SADS-PL): semi structured, for children and adolescents, with separate parent and child interviews.
- International Personality Disorder Examination (IPDE): WHO's semi structured interview for personality disorders.

## Reliability
Agreement between raters on categorical diagnoses is measured with Cohen's kappa, which corrects for chance agreement. Values above 0.6 are usually called substantial and above 0.8 almost perfect. Semi structured interviews such as the SCID typically reach kappas of about 0.6 to 0.8 for major disorders, much better than unstructured interviews.

## Strengths and limits
Strengths: reliable, comparable diagnoses for research, trials and surveys; systematic coverage so that comorbidity is not missed; useful training tools. Limits: long; can feel mechanical and harm rapport; fully structured tools cannot judge clinical significance, so they over diagnose in community surveys; reliability does not guarantee validity; translation and cultural adaptation are needed in India, where idioms of distress and somatic presentations are common.

## Conclusion
Structure trades flexibility for reliability. In research and surveys, semi structured or structured interviews are essential; in clinical practice, a good unstructured interview remains the base, with structured tools used where accuracy matters most.`,
    keyPoints: ["Information, observation and criterion variance", "Three kinds of interview compared", "SCID-5 and SCID-5-PD", "MINI and its use in NMHS India", "SCAN with PSE and CIDI", "K-SADS and IPDE", "Kappa values", "Strengths and limits including cultural adaptation"],
    pitfalls: ["Calling the SCID fully structured", "Equating reliability with validity"],
    module: "assessment/2-5",
    visuals: [compare("Three kinds of interview", ["Unstructured", ["Flexible", "Builds rapport", "Follows the patient's story", "Low reliability"], "Clinical practice"], ["Structured or semi structured", ["Fixed questions", "Systematic coverage", "Kappa about 0.6 to 0.8", "Can feel mechanical"], "Research, trials and surveys"])],
    ref: "Spitzer and Fleiss 1974 sources of variance; First SCID-5 2016; Sheehan 1998 MINI; WHO SCAN 2.1; Kessler and Ustun 2004 CIDI; Kaufman 1997 K-SADS-PL; Loranger 1994 IPDE; Gururaj NMHS 2016",
  },
  {
    id: "asmt-l04-005",
    subject: S,
    topic: "rating-scales",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Write short notes on errors in rating scales and how to reduce them.",
    plan: ["Why ratings go wrong", "Main errors with examples", "Ways to reduce them"],
    answer: `## Why ratings go wrong
Ratings by teachers, supervisors, clinicians or parents depend on human judgement, which is open to systematic bias. These biases reduce reliability and validity, and they matter in clinical scales, school reports, performance appraisals and research.

## Main errors
- Halo effect: one strong impression colours all ratings. Edward Thorndike described it in 1920, when officers rated soldiers who looked smart as better at everything. A pleasant, well dressed patient may be rated less ill on every item.
- Leniency or generosity error: rating everyone too favourably; the severity error is the opposite.
- Central tendency error: avoiding the extremes and rating everyone near the middle, often when the rater is unsure.
- Logical error: rating two traits alike because the rater thinks they go together, such as assuming a quiet student is also dull.
- Contrast error: rating a person against oneself or against the previous person rated rather than against the standard.
- Proximity error: items placed close together on a form are rated alike.
- Recency and primacy: overweighting the latest or the first information.

## Reducing errors
1. Define each point of the scale with behavioural anchors, as in behaviourally anchored rating scales, rather than vague labels like "good" or "poor".
2. Train raters with practice cases and feedback, and check inter rater reliability.
3. Rate one trait across all people before moving to the next trait, which weakens halo.
4. Use several independent raters and average their ratings.
5. Use forced distribution or ranking where suitable, and vary the order of items.
6. Base ratings on observed behaviour over a fixed period, recorded at the time.`,
    keyPoints: ["Ratings are open to systematic bias", "Halo effect with Thorndike", "Leniency, severity and central tendency", "Logical, contrast and proximity errors", "Behavioural anchors and rater training", "Multiple raters and rating one trait at a time"],
    module: "assessment/2-5",
    visuals: [vis("sort", { prompt: "Name the rating error.", buckets: ["Halo", "Central tendency", "Leniency", "Contrast"], items: [
      { text: "A supervisor gives every trainee 3 on a 5 point scale", bucket: 1 },
      { text: "A teacher rates a neat, polite child high on maths, sport and honesty", bucket: 0 },
      { text: "A new examiner gives every student top marks to avoid upsetting anyone", bucket: 2 },
      { text: "A very organised manager rates an average colleague as careless", bucket: 3 },
    ] }, "Main errors")],
    ref: "Thorndike 1920 halo effect; Guilford Psychometric Methods; Smith and Kendall 1963 behaviourally anchored rating scales",
  },
  {
    id: "asmt-l04-006",
    subject: S,
    topic: "bender-gestalt",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance"],
    question: "Write short notes on the Bender Visual Motor Gestalt Test.",
    plan: ["Origin and materials", "Administration", "Scoring systems", "Uses and limits"],
    answer: `## Origin and materials
Lauretta Bender, an American child psychiatrist, published the Bender Visual Motor Gestalt Test in 1938. She took nine geometric designs from Max Wertheimer's studies of gestalt perception: card A and cards 1 to 8, made of dots, lines, curves and angles. The idea was that copying them requires perceiving the whole figure and reproducing it with the hand, a visual motor integration task that matures with age and is disturbed by brain dysfunction.

## Administration
The cards are shown one at a time and the person copies each on a blank sheet with a pencil, without a time limit. Variations include a recall phase (drawing from memory) and a tachistoscopic phase. The examiner notes rotation, planning, erasures and behaviour.

## Scoring systems
- Elizabeth Koppitz in 1963 gave developmental scoring for children aged about 5 to 11: errors of distortion, rotation, integration and perseveration are counted and compared with age norms; she also listed emotional indicators.
- Gerald Pascal and Barbara Suttell in 1951 gave scoring for adults.
- Max Hutt's adaptation for projective and clinical use.
- The Bender Gestalt II, 2003, added more designs, norms from age 4 to 85 and over, and motor and perception supplementary tests.

## Uses and limits
It is quick, non verbal and easy to use with children and people with limited literacy, which makes it popular in Indian clinics and part of the PGI Battery of Brain Dysfunction. It screens visual motor maturity and possible organic dysfunction. Limits: it is not a test of "organicity" in general, since many brain lesions leave copying intact and poor motor control, low schooling or poor vision can cause errors; emotional interpretations have weak validity. It should be one part of a fuller neuropsychological assessment.`,
    keyPoints: ["Bender 1938, nine Wertheimer designs", "Visual motor integration", "Copy, recall and other phases", "Koppitz developmental scoring for children", "Pascal Suttell and Hutt for adults", "Bender Gestalt II", "Limits of organicity screening"],
    module: "assessment/2-6",
    visuals: [tree("Scoring systems", [["Bender Gestalt scoring", "Errors in copying nine designs", -1], ["Koppitz", "Children 5 to 11: distortion, rotation, integration, perseveration", 0], ["Pascal and Suttell", "Adults: deviations scored for each design", 0], ["Hutt", "Clinical and projective reading", 0], ["Bender Gestalt II", "Ages 4 to 85 and over, motor and perception supplements", 0]])],
    ref: "Bender 1938; Koppitz 1963 The Bender Gestalt Test for Young Children; Pascal and Suttell 1951; Brannigan and Decker Bender-Gestalt II 2003; Pershad and Verma PGI-BBD",
  },
  {
    id: "asmt-l04-007",
    subject: S,
    topic: "executive-tests",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry", "ma-semester"],
    question: "What are executive functions? Describe the tests used to assess them, with special reference to the Wisconsin Card Sorting Test, and discuss their limitations.",
    plan: ["Definition and components", "Brain basis: prefrontal circuits", "Tests by component, WCST in detail", "Clinical uses", "Limitations including ecological validity", "Conclusion"],
    answer: `## Definition and components
Executive functions are the higher order control processes that let us plan, organise and regulate behaviour towards a goal, especially in new situations where habits are not enough. Akira Miyake and colleagues in 2000 showed three related but separable core components:
- Shifting (cognitive flexibility): moving between tasks or rules.
- Updating (working memory): holding and refreshing information.
- Inhibition: stopping a strong automatic response.
Other functions often included are planning, initiation, abstraction, fluency, judgement and self monitoring.

## Brain basis
Executive functions depend on the prefrontal cortex and its circuits with the basal ganglia, thalamus and parietal cortex. The dorsolateral prefrontal circuit supports planning, working memory and set shifting; the orbitofrontal circuit supports social behaviour and inhibition; the anterior cingulate supports initiation, motivation and error monitoring. Damage to these circuits, as in Phineas Gage's injury, frontotemporal dementia, traumatic brain injury or schizophrenia, causes a "dysexecutive syndrome".

## Tests by component
| Function | Test | What it shows |
| Set shifting and abstraction | Wisconsin Card Sorting Test | Perseveration when rules change |
| Set shifting | Trail Making Test part B | Slowing and errors when alternating numbers and letters |
| Inhibition | Stroop test | Slower naming of ink colour when the word names another colour |
| Inhibition | Go no go tasks, Hayling test | Failure to hold back a response |
| Planning | Tower of London, Tower of Hanoi | Extra moves, rule breaks |
| Fluency and initiation | Verbal fluency (letters such as F, A, S; and animals) | Few words, repetitions |
| Working memory | Digit span backwards, n back | Low span |
| Decision making | Iowa Gambling Task | Choosing risky decks; linked to ventromedial prefrontal damage |
| Screening | Frontal Assessment Battery | Six quick bedside items |

## The Wisconsin Card Sorting Test
David Grant and Esta Berg devised it in 1948; Robert Heaton later published standard norms. Four stimulus cards (one red triangle, two green stars, three yellow crosses and four blue circles) are laid out. The person sorts 128 response cards, one at a time, by placing each under a stimulus card. The examiner says only "right" or "wrong". The hidden rule is colour, then form, then number, and the rule changes without warning after 10 correct sorts in a row. The person must work out the rule from feedback and then switch.
Main scores:
- Categories completed (maximum 6).
- Perseverative responses and perseverative errors: continuing with the old rule after it has changed. This is the key index of poor set shifting.
- Failure to maintain set: losing the rule after five or more correct sorts.
- Trials to complete the first category.
High perseverative errors are seen in frontal lobe lesions, schizophrenia, Parkinson's disease and some cases of OCD. A computerised 64 card version is also used. The NIMHANS Neuropsychology Battery includes the WCST with Indian norms.

## Clinical uses
Executive tests help in diagnosis of dementias (frontotemporal dementia shows early executive and behavioural change), in assessing capacity, return to work and driving after brain injury, in ADHD, and in describing cognitive deficits in schizophrenia, which predict functioning better than positive symptoms.

## Limitations
- Task impurity: every test needs other abilities such as attention, speed, vision and language, so a low score is not purely "executive".
- Low ecological validity: the structured test room removes the very demands (multitasking, self starting) that cause problems in daily life. Some patients with frontal damage pass every test yet cannot run their lives. Tests such as the Multiple Errands Test and the Behavioural Assessment of the Dysexecutive Syndrome were built to address this.
- Novelty: many tests work only the first time, so retesting is difficult.
- Education and culture: verbal fluency and Stroop depend on literacy and language; Indian norms by education and language are needed.
- Poor specificity: abnormal scores occur with lesions outside the frontal lobes and with depression, fatigue or poor effort.

## Conclusion
Executive functions are a family of control processes based in frontal circuits. A battery that samples shifting, inhibition, updating, planning and fluency, led by tests such as the WCST, Trail Making and Stroop, interpreted with local norms and information on everyday functioning, gives the most useful picture.`,
    keyPoints: ["Definition and Miyake's three components", "Prefrontal circuits and the dysexecutive syndrome", "Tests matched to components", "WCST materials, procedure and rule change after 10", "Perseverative errors and categories completed", "Clinical uses", "Task impurity and ecological validity", "Education and Indian norms"],
    pitfalls: ["Calling every frontal test a test of 'frontal lobe' alone", "Missing perseverative errors as the key WCST score"],
    module: "assessment/2-6",
    visuals: [
      brain("Brain basis", { prefrontal: "Dorsolateral circuit: planning, working memory, set shifting; WCST and Trail Making B", frontal: "Orbitofrontal and medial areas: inhibition, social judgement, decision making", "basal-ganglia": "Frontal circuits loop through the striatum and thalamus", thalamus: "Relays the frontal subcortical loops back to cortex" }),
      { kind: "figure", data: { id: "stroop-card" }, caption: "Tests by component: the Stroop card, a test of inhibition." },
    ],
    ref: "Miyake 2000 Cognitive Psychology unity and diversity; Grant and Berg 1948; Heaton WCST manual 1993; Stroop 1935; Shallice 1982 Tower of London; Bechara 1994 Iowa Gambling Task; Dubois 2000 FAB; Rao, Subbakrishna and Gopukumar NIMHANS Neuropsychology Battery 2004",
  },
  {
    id: "asmt-l04-008",
    subject: S,
    topic: "neuropsych-batteries",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe the major neuropsychological test batteries, including those developed in India. Compare the fixed battery and flexible approaches.",
    plan: ["Aims of neuropsychological assessment", "Halstead Reitan Battery", "Luria Nebraska Battery", "Indian batteries: PGI-BBD and NIMHANS", "Fixed, flexible and process approaches compared", "Conclusion"],
    answer: `## Aims
Neuropsychological assessment uses standardised tests to describe how brain dysfunction affects thinking and behaviour. Its aims are to detect impairment, describe the pattern of strengths and weaknesses, help with differential diagnosis (for example dementia versus depression), plan rehabilitation, judge capacity, and track change over time. Imaging shows where the brain is damaged; neuropsychology shows what the person can and cannot do.

## Halstead Reitan Battery
Ward Halstead began building tests of "biological intelligence" at the University of Chicago in the 1940s, and Ralph Reitan developed them into a standard battery with norms. Core tests:
- Category Test: abstraction and learning from feedback.
- Tactual Performance Test: placing blocks in a form board while blindfolded, with each hand and then both, followed by drawing the board from memory.
- Seashore Rhythm Test: comparing pairs of rhythms; attention.
- Speech Sounds Perception Test: matching spoken nonsense words to written ones.
- Finger Tapping Test: motor speed of each hand.
- Trail Making Test parts A and B.
- Aphasia screening and sensory perceptual examination.
The Halstead Impairment Index is the proportion of core scores in the impaired range; 0.5 or more suggests brain dysfunction. Comparing the two sides of the body helps to lateralise lesions. The battery is well validated but takes six hours or more.

## Luria Nebraska Battery
Charles Golden and colleagues in 1980 standardised items drawn from Alexander Luria's bedside methods, as set out by Anne Lise Christensen. It has 269 items in scales for motor, rhythm, tactile, visual, receptive speech, expressive speech, writing, reading, arithmetic, memory and intellectual processes, with localisation scales. It is shorter (about two and a half hours) but was criticised for weak validity of its localisation claims and for mixing very different items within scales.

## Indian batteries
- PGI Battery of Brain Dysfunction (PGI-BBD), from the Postgraduate Institute of Medical Education and Research, Chandigarh, developed by Dwarka Pershad and S K Verma. It brings together the PGI Memory Scale, a verbal adult intelligence scale, a performance intelligence scale, the Nahor Benson test (copying figures) and the Bender Gestalt test. It is designed for Indian adults, including those with limited schooling, and gives a dysfunction rating.
- NIMHANS Neuropsychology Battery, from the National Institute of Mental Health and Neuro Sciences, Bangalore, developed by Shobini Rao and colleagues, with norms for adults by age and education. It samples motor speed, attention (digit vigilance, colour trails), executive functions (verbal fluency, WCST, Stroop, Tower of London, n back), learning and memory (auditory verbal learning, complex figure), and visuospatial skills. A separate NIMHANS battery exists for children.
These batteries address the problem that Western norms misclassify Indian people with less schooling.

## Approaches compared
| Feature | Fixed battery | Flexible battery | Process approach |
| Idea | Same tests for everyone | Tests chosen for the referral question | Watch how the person reaches the answer |
| Example | Halstead Reitan, Luria Nebraska | Core screen plus chosen tests (NIMHANS battery used selectively) | The Boston process approach |
| Strengths | Full coverage, comparable data, good for research | Efficient, focused, less tiring | Rich qualitative data on errors and strategies |
| Weaknesses | Long, costly, tiring for patients | Depends on clinician skill; gaps possible | Harder to standardise |
Most clinicians now use a flexible battery with standardised tests and also note process, as when a patient copies a complex figure piece by piece rather than as a whole.

## Interpretation
Scores are compared with age and education norms. The examiner looks at the level of performance, the pattern across domains, differences between sides of the body, and specific signs (such as neglect or perseveration), and checks effort with performance validity tests. Results are linked to history, imaging and daily functioning.

## Conclusion
The Halstead Reitan and Luria Nebraska batteries founded the field; Indian batteries such as the PGI-BBD and the NIMHANS battery provide culturally fitting norms. Modern practice favours flexible, hypothesis driven batteries with good norms and attention to how, not only how well, the person performs.`,
    keyPoints: ["Aims of neuropsychological assessment", "Halstead Reitan tests named", "Impairment Index 0.5", "Luria Nebraska: Golden 1980, 269 items, scales", "PGI-BBD components and authors", "NIMHANS battery domains and education norms", "Fixed, flexible and process approaches compared", "Interpretation by level, pattern, laterality and effort"],
    pitfalls: ["No Indian battery mentioned", "Describing tests without saying what each measures"],
    module: "assessment/2-6",
    visuals: [
      tree("Halstead Reitan Battery", [["Halstead Reitan", "Fixed battery, about six hours", -1], ["Category Test", "Abstraction, learning from feedback", 0], ["Tactual Performance", "Blindfolded form board: touch, memory, location", 0], ["Rhythm and Speech Sounds", "Attention and auditory discrimination", 0], ["Finger Tapping", "Motor speed, compared across hands", 0], ["Trail Making A and B", "Speed and set shifting", 0]]),
      compare("Approaches compared", ["Fixed battery", ["Same tests for all", "Full coverage", "Good for research", "Long and tiring"], "Halstead Reitan, Luria Nebraska"], ["Flexible battery", ["Tests chosen for the question", "Efficient", "Allows process notes", "Depends on skill"], "Most modern practice"]),
    ],
    ref: "Reitan and Wolfson Halstead-Reitan Neuropsychological Test Battery 1993; Golden, Hammeke and Purisch 1980; Christensen Luria's Neuropsychological Investigation; Pershad and Verma PGI-BBD 1990; Rao, Subbakrishna and Gopukumar NIMHANS Neuropsychology Battery 2004; Lezak Neuropsychological Assessment",
  },
  {
    id: "asmt-l04-009",
    subject: S,
    topic: "memory-tests",
    marks: 10,
    difficulty: 2,
    exams: ["mcp-entrance", "ma-semester", "md-psychiatry"],
    question: "Describe the tests used to assess memory in clinical practice, including Indian tools.",
    plan: ["What aspects of memory are tested", "Wechsler Memory Scale", "PGI Memory Scale", "List learning and visual memory tests", "Interpreting patterns and conclusion"],
    answer: `## What is tested
A good memory assessment separates:
- Immediate span and working memory (digit span).
- New learning and delayed recall of verbal and visual material, which depends on the hippocampus and medial temporal lobes.
- Recognition compared with free recall: poor recall with good recognition suggests a retrieval problem (frontal or subcortical), while poor recall and poor recognition suggest a storage problem (hippocampal).
- Remote memory for past personal and public events.
- Orientation and everyday memory.

## Wechsler Memory Scale
David Wechsler published the first Wechsler Memory Scale in 1945. The fourth edition (WMS-IV, 2009) for ages 16 to 90 includes Logical Memory (stories), Verbal Paired Associates, Designs, Visual Reproduction and Symbol Span, with immediate and delayed trials. It gives index scores for Auditory Memory, Visual Memory, Visual Working Memory, Immediate Memory and Delayed Memory (mean 100, SD 15). Because it is co normed with the WAIS-IV, memory can be compared with general ability.

## PGI Memory Scale
Dwarka Pershad and N N Wig at PGIMER, Chandigarh, developed the PGI Memory Scale in 1977 for Indian adults aged about 20 to 45 with at least some schooling, available in Hindi and English. Its ten subtests are remote memory, recent memory, mental balance, attention and concentration, delayed recall, immediate recall, retention for similar pairs, retention for dissimilar pairs, visual retention and recognition. Scores on each subtest are compared with norms to give a dysfunction rating. It is part of the PGI Battery of Brain Dysfunction and widely used in India, though its norms are now old.

## List learning and visual memory tests
- Rey Auditory Verbal Learning Test: 15 words read over five trials, then an interference list, then recall after a short and a long delay, and recognition. It shows the learning curve, the effects of interference and forgetting.
- Rey Complex Figure Test: the person copies a complex figure, then draws it from memory immediately and after a delay; scored out of 36. The copy also shows planning and visuospatial skill.
- Benton Visual Retention Test: ten designs shown briefly and drawn from memory.
- The NIMHANS Neuropsychology Battery includes auditory verbal learning and complex figure tests with Indian norms by age and education.
- Bedside items in the MMSE, MoCA and ACE-III give a quick screen.

## Interpreting patterns
| Pattern | Suggests |
| Poor delayed recall, poor recognition, rapid forgetting | Hippocampal damage: Alzheimer's disease, Korsakoff syndrome |
| Poor free recall, better recognition, slow learning | Frontal or subcortical problems, depression, vascular disease |
| Verbal worse than visual memory | Left temporal lesion |
| Visual worse than verbal memory | Right temporal lesion |
| Inconsistent, very low scores, failed effort tests | Poor effort or exaggeration |
Mood, attention, education and effort must always be considered before calling memory impaired.

## Conclusion
Memory assessment combines a broad scale such as the WMS-IV or the PGI Memory Scale with list learning and figure tests, so that span, learning, retention, retrieval and recognition can be separated and linked to brain systems.`,
    keyPoints: ["Span, learning, delayed recall, recognition and remote memory separated", "Recall versus recognition logic", "WMS-IV subtests and indices", "PGI Memory Scale authors and ten subtests", "Rey AVLT and Rey Complex Figure", "Benton test and NIMHANS battery", "Patterns linked to brain systems", "Effort, mood and education"],
    module: "assessment/2-6",
    visuals: [brain("What is tested", { hippocampus: "Storage of new memories: delayed recall and recognition both fail when it is damaged", temporal: "Left side for verbal material, right side for visual material", prefrontal: "Organising learning and retrieval: free recall poor, recognition better", thalamus: "Diencephalic memory circuit; damaged in Korsakoff syndrome" })],
    ref: "Wechsler 1945; WMS-IV manual 2009; Pershad and Wig 1977 PGI Memory Scale; Rey 1941 and 1964; Osterrieth 1944; Benton 1974; Lezak Neuropsychological Assessment",
  },
  {
    id: "asmt-l04-010",
    subject: S,
    topic: "cognitive-screening",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "mcp-entrance", "ma-semester"],
    question: "Describe the brief cognitive screening tests used in clinical practice, with their cut offs and limitations, especially in India.",
    plan: ["Purpose of screening", "MMSE and the Hindi Mental State Examination", "MoCA and ACE-III", "Clock drawing and other brief tools", "Limits and good practice in India"],
    answer: `## Purpose
Brief cognitive screens take 5 to 20 minutes and help a clinician decide whether a person needs a fuller assessment for dementia, delirium or other cognitive disorders. They do not diagnose by themselves: a low score shows that something is wrong, not what it is.

## MMSE and HMSE
- Mini Mental State Examination: published by Marshal Folstein and colleagues in 1975. Thirty points covering orientation (10), registration (3), attention and calculation (serial sevens or spelling backwards, 5), recall (3), language (8, including naming, repetition, a three stage command, reading, writing) and copying intersecting pentagons (1). A score below 24 is a common cut off, but scores are strongly affected by education. It is weak at detecting mild impairment and executive problems, and it is now under copyright.
- Hindi Mental State Examination (HMSE): Mary Ganguli and colleagues in 1995 adapted the MMSE for rural, largely non literate older adults in Ballabgarh, Haryana, replacing items that needed reading and writing with tasks that did not.

## MoCA and ACE-III
- Montreal Cognitive Assessment: published by Ziad Nasreddine in 2005. Thirty points covering visuospatial and executive skills (trail making, cube copy, clock drawing), naming, attention, language, abstraction, delayed recall of five words and orientation. A score of 26 or more is normal; one point is added for 12 or fewer years of education. It is more sensitive than the MMSE to mild cognitive impairment and executive problems, but in India its standard cut off over diagnoses impairment in people with little schooling, so education adjusted cut offs are needed.
- Addenbrooke's Cognitive Examination III: 100 points in five domains: attention (18), memory (26), verbal fluency (14), language (26) and visuospatial skills (16). Cut offs of 88 and 82 are commonly used. Domain scores help separate Alzheimer's disease (memory and orientation worst) from frontotemporal dementia (fluency and language worst). Versions have been validated in several Indian languages, including Hindi, Malayalam, Kannada and Telugu.

## Clock drawing and other tools
- Clock drawing: the person draws a clock face with numbers and sets the hands to ten past eleven. It tests planning, visuospatial skill and abstract understanding of time, and is quick and fairly free of language.
- Mini Cog: three word recall plus clock drawing.
- For delirium: the Confusion Assessment Method and the 4AT.
- For informants: the IQCODE, which asks family about change over ten years.

## Limits and good practice
- Education, literacy, language and sensory problems lower scores in the absence of disease. In India, where many older adults have little schooling, use HMSE, education adjusted cut offs or tools validated locally.
- Depression, delirium and poor effort can lower scores.
- Ceiling effects: highly educated people can score normally despite real decline.
- Screens should be followed by history from an informant, assessment of daily functioning, a fuller neuropsychological assessment and medical work up.

## Conclusion
The MMSE, MoCA, ACE-III and clock drawing are useful first steps, but each must be read in the light of education, language and culture, and followed by a full assessment.`,
    keyPoints: ["Screening is not diagnosis", "MMSE domains, 30 points, cut off 24, education effect", "HMSE for low literacy rural India", "MoCA items and education point, cut off 26", "ACE-III domains and points, cut offs 88 and 82", "Clock drawing and other tools", "Indian education adjusted cut offs", "Follow up assessment"],
    pitfalls: ["Using the MMSE cut off of 24 for an unschooled person", "Treating a screen score as a diagnosis"],
    module: "assessment/2-6",
    visuals: [{ kind: "figure", data: { id: "copy-and-clock" }, caption: "Clock drawing and other tools: the pentagon copy from the MMSE and a clock drawn normally and with planning errors." }],
    ref: "Folstein, Folstein and McHugh 1975; Ganguli 1995 HMSE; Nasreddine 2005 MoCA; Hsieh 2013 ACE-III; Mathuranath ACE validation in India; Borson 2000 Mini-Cog",
  },
]);
