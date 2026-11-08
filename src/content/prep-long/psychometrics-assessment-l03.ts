import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, cycle, layers, tree, vis } from "./visual";

const S = "psychometrics-assessment" as const;

export const PSYCHOMETRICS_ASSESSMENT_L03: LongQA[] = anchored([
  {
    id: "asmt-l03-001",
    subject: S,
    topic: "mmpi",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "ugc-net", "md-psychiatry"],
    question: "Describe the development, structure and interpretation of the MMPI-2. Add a note on the MMPI-2-RF and MMPI-3.",
    plan: ["Origin and the method of empirical criterion keying", "Versions and item numbers", "Validity scales and what each detects", "Clinical scales and two point code types", "Restructured versions and Indian use", "Strengths, limits and conclusion"],
    answer: `## Origin and empirical keying
The Minnesota Multiphasic Personality Inventory was built by Starke Hathaway, a psychologist, and J C McKinley, a psychiatrist, at the University of Minnesota and published in 1943. Its key idea was empirical criterion keying. A large pool of true or false statements was given to patient groups (depression, hysteria, schizophrenia and others) and to a normal group of hospital visitors. An item was kept for a scale only if it separated the patient group from the normal group, whatever its content looked like. So an item such as "I prefer a shower to a bath" could land on a scale because patients answered it differently, not because it sounds clinical. This gave the test low face validity for many items, which made faking harder.

## Versions
| Version | Year | Items | Use |
| MMPI | 1943 | 550 | Original adult form |
| MMPI-2 | 1989 | 567 | Restandardised on a new US sample; still widely used |
| MMPI-A | 1992 | 478 | Adolescents aged 14 to 18 |
| MMPI-2-RF | 2008 | 338 | Restructured form |
| MMPI-3 | 2020 | 335 | Newest form with new norms |
Scores are given as uniform T scores (mean 50, SD 10). On the MMPI-2 a T score of 65 or more is treated as clinically significant.

## Validity scales
The profile is read only after checking whether the person answered in a way that can be interpreted.
- Cannot Say (?): number of items left blank or answered both ways; too many make the profile invalid.
- VRIN and TRIN: inconsistency scales. VRIN picks up random answering; TRIN picks up saying "true" or "false" to everything.
- F (infrequency): items rarely endorsed by normal people. High F suggests severe distress, a cry for help, random answering or overreporting. Fb covers the back half of the booklet, Fp (infrequency psychopathology) items are rare even in inpatients and are the best guide to exaggerated psychotic symptoms, and FBS (symptom validity) picks up overreported physical and cognitive complaints.
- L (lie): claims of unrealistic virtue, such as never having been angry.
- K (correction): subtle defensiveness. K is added in fixed proportions to five clinical scales to correct for it. S (superlative self presentation) also measures presenting oneself as very well adjusted.

## Clinical scales
| No | Scale | Main theme |
| 1 | Hypochondriasis (Hs) | Bodily complaints |
| 2 | Depression (D) | Low mood, hopelessness |
| 3 | Hysteria (Hy) | Physical symptoms with denial of problems |
| 4 | Psychopathic deviate (Pd) | Conflict with authority and family, impulsivity |
| 5 | Masculinity femininity (Mf) | Traditional gender interests |
| 6 | Paranoia (Pa) | Suspicion, sensitivity |
| 7 | Psychasthenia (Pt) | Anxiety, worry, obsessions |
| 8 | Schizophrenia (Sc) | Odd thinking, alienation |
| 9 | Hypomania (Ma) | Energy, excitement |
| 0 | Social introversion (Si) | Shyness, withdrawal |
Supplementary and content scales (such as Anxiety, Depression, Anger) and the Harris Lingoes subscales help explain why a clinical scale is raised.

## Interpretation
1. Check test taking conditions, reading level (about class 6 to 8 English) and time taken.
2. Read the validity scales and decide whether the profile is valid, overreported or underreported.
3. Look at the highest clinical scales and the two point code type, for example 2-7 (anxious depression), 4-9 (impulsive acting out), 6-8 (suspicious, disorganised thinking) and 1-3 (the "conversion V", with bodily focus and denial).
4. Use content and supplementary scales to refine.
5. Treat the result as hypotheses and check them against history, interview and other tests.

## Restructured forms and Indian use
The original clinical scales overlap heavily because all of them carry a general distress factor. The Restructured Clinical scales separate a demoralisation scale (RCd) from more specific scales, which improves discriminant validity. The MMPI-2-RF and MMPI-3 are built around these scales and are increasingly preferred in forensic work. In India, the MMPI-2 has been translated and studied, but Indian norms are limited and dated, so US norms are often used with caution. Religious and family items can raise some scales for cultural reasons, and the English reading level excludes many clients.

## Strengths and limits
Strengths: very large research base, strong validity scales, objective scoring and good reliability. Limits: length, reading demands, scale overlap in the original clinical scales, outdated scale names, and limited local norms.

## Conclusion
The MMPI-2 is the most researched objective personality inventory. Its value lies in reading validity first, then code types and content scales, and treating every finding as a hypothesis to be integrated with the rest of the assessment.`,
    keyPoints: ["Hathaway and McKinley, 1943, empirical criterion keying", "Item numbers of MMPI-2, RF and MMPI-3", "T score 65 as clinical cut off", "Validity scales: ?, VRIN, TRIN, F family, L, K", "Ten clinical scales named", "Two point code types with examples", "Restructured clinical scales and demoralisation", "Indian norms and reading level caution"],
    pitfalls: ["Reading clinical scales before validity scales", "Saying items were chosen because they look clinical", "Using a single high scale as a diagnosis"],
    module: "assessment/2-3",
    visuals: [
      chain("Interpretation", [["Conditions", "Reading level, time taken, effort"], ["Validity scales", "?, VRIN, TRIN, F, Fp, L, K: can the profile be read?"], ["Code type", "The two highest clinical scales above T 65"], ["Content scales", "Harris Lingoes and content scales explain the elevation"], ["Hypotheses", "Checked against history, interview and other tests"]]),
      vis("sort", { prompt: "Which kind of MMPI-2 scale is each?", buckets: ["Validity scale", "Clinical scale"], items: [
        { text: "F: rare answers", bucket: 0, why: "Shows overreporting, severe distress or random answers." },
        { text: "K: subtle defensiveness", bucket: 0, why: "Used to correct five clinical scales." },
        { text: "Scale 2: Depression", bucket: 1 },
        { text: "Scale 8: Schizophrenia", bucket: 1 },
        { text: "TRIN: all true or all false", bucket: 0 },
        { text: "Scale 4: Psychopathic deviate", bucket: 1 },
      ] }, "Validity scales"),
    ],
    ref: "Hathaway and McKinley 1943; Butcher MMPI-2 manual 1989; Ben-Porath and Tellegen MMPI-2-RF 2008 and MMPI-3 2020; Graham, MMPI-2 Assessing Personality and Psychopathology; study module assessment 2.3",
  },
  {
    id: "asmt-l03-002",
    subject: S,
    topic: "16pf",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "cuet-pg"],
    question: "Write short notes on the Sixteen Personality Factor Questionnaire (16PF).",
    plan: ["Cattell and the lexical, factor analytic method", "Structure: 16 primary and 5 global factors", "Scoring and uses", "Limits"],
    answer: `## Origin
Raymond B Cattell built the 16PF from the lexical approach: the idea that important traits are coded as words in everyday language. He reduced thousands of trait words to a smaller set, collected life record, questionnaire and objective test data, and used factor analysis to find source traits. The first edition appeared in 1949; the fifth edition, from 1993, has 185 items with three answer choices and is used from age 16.

## Structure
- Sixteen primary factors, each a bipolar scale, for example Warmth (A), Reasoning (B), Emotional Stability (C), Dominance (E), Liveliness (F), Rule Consciousness (G), Social Boldness (H), Sensitivity (I), Vigilance (L), Abstractedness (M), Privateness (N), Apprehension (O), Openness to Change (Q1), Self Reliance (Q2), Perfectionism (Q3) and Tension (Q4).
- Five global factors from second order factor analysis: Extraversion, Anxiety, Tough Mindedness, Independence and Self Control. These resemble the Big Five.
- Factor B is a short reasoning (intelligence) scale inside a personality test.

## Scoring and uses
Raw scores are turned into sten scores (mean 5.5, SD 2, range 1 to 10). Stens of 1 to 3 and 8 to 10 are read as clearly low or high. An impression management index and an acquiescence index check response style. It is used in career and organisational settings, counselling, personnel selection and research, and translated versions are used in India.

## Limits
Some primary factors have modest reliability, the 16 factor structure has not always replicated, and it is a measure of normal personality, not a diagnostic test of psychopathology.`,
    keyPoints: ["Cattell, lexical approach, factor analysis", "Fifth edition 185 items", "Sixteen primary factors with examples", "Five global factors resembling the Big Five", "Sten scores", "Response style indices", "Uses and limits"],
    pitfalls: ["Calling it a clinical diagnostic test", "Confusing sten with stanine"],
    module: "assessment/2-3",
    visuals: [tree("Structure", [["16PF", "185 items, sten scores", -1], ["Extraversion", "Warmth, Liveliness, Social Boldness, Privateness, Self Reliance", 0], ["Anxiety", "Emotional Stability, Vigilance, Apprehension, Tension", 0], ["Tough Mindedness", "Warmth, Sensitivity, Abstractedness, Openness to Change", 0], ["Independence", "Dominance, Social Boldness, Vigilance, Openness to Change", 0], ["Self Control", "Liveliness, Rule Consciousness, Abstractedness, Perfectionism", 0]], "The five global factors and the main primary factors that load on each.")],
    ref: "Cattell, Cattell and Cattell 16PF Fifth Edition 1993; Conn and Rieke 16PF Fifth Edition Technical Manual 1994",
  },
  {
    id: "asmt-l03-003",
    subject: S,
    topic: "neo-pi-r",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "ugc-net", "mcp-entrance"],
    question: "Describe the NEO Personality Inventory and the five factor model it measures. Comment on its cross cultural use.",
    plan: ["The five factor model", "Development and forms of the NEO", "Domains and facets", "Reliability, validity and uses", "Cross cultural and Indian findings"],
    answer: `## The five factor model
The five factor model holds that most individual differences in personality can be described by five broad, largely independent traits: Neuroticism, Extraversion, Openness to experience, Agreeableness and Conscientiousness (remembered as OCEAN). The model came from two lines of work: lexical studies of trait words and factor analysis of questionnaires.

## Development and forms
Paul Costa and Robert McCrae developed the NEO Inventory in 1985 to measure three factors, then added Agreeableness and Conscientiousness. The revised NEO-PI-R, from 1992, has 240 items rated on a five point scale from strongly disagree to strongly agree. The NEO-PI-3 updated items for easier reading, and the NEO Five Factor Inventory (NEO-FFI) has 60 items for a quick domain level score. Form S is for self report; Form R is completed by an observer such as a spouse, which allows a check against another view of the person.

## Domains and facets
Each domain has six facets, giving 30 facet scores.
| Domain | Facets |
| Neuroticism | Anxiety, angry hostility, depression, self consciousness, impulsiveness, vulnerability |
| Extraversion | Warmth, gregariousness, assertiveness, activity, excitement seeking, positive emotions |
| Openness | Fantasy, aesthetics, feelings, actions, ideas, values |
| Agreeableness | Trust, straightforwardness, altruism, compliance, modesty, tender mindedness |
| Conscientiousness | Competence, order, dutifulness, achievement striving, self discipline, deliberation |

## Reliability, validity and uses
Domain scores have high internal consistency (around 0.86 to 0.92) and long term stability in adults. Self and observer ratings agree well, which supports validity. Conscientiousness predicts job and academic performance; Neuroticism predicts anxiety and depressive disorders. The NEO is used in research, counselling, career and organisational settings, and in describing personality disorders in dimensional terms, which fits the trait approach of ICD-11 and the alternative model in DSM-5-TR. It has no validity scales of the MMPI type, only a few check questions, so it assumes honest answering.

## Cross cultural use
In a study of 50 cultures led by McCrae, observer ratings on the NEO gave much the same five factors in almost every culture, including Indian samples. Some facets, especially in Openness, replicate less well, and translations need care with idioms. Indian researchers have also asked whether traits such as relational harmony, or the gunas of Samkhya thought, add something the five factors miss.

## Conclusion
The NEO-PI-R is the standard measure of the five factor model, with strong reliability and broad cross cultural support, but it measures normal personality and depends on honest self report.`,
    keyPoints: ["Five factors named", "Costa and McCrae, 240 items, five point scale", "NEO-PI-3 and NEO-FFI 60 items", "Forms S and R", "Six facets per domain", "Reliability and predictive validity", "Link to dimensional personality disorder models", "Cross cultural replication and Indian caveats"],
    pitfalls: ["Listing facets under the wrong domain", "Claiming it has MMPI style validity scales"],
    module: "assessment/2-3",
    visuals: [tree("Domains and facets", [["Five factor model", "Five broad traits, each with six facets on the NEO-PI-R", -1], ["Neuroticism", "Anxiety, hostility, depression, self consciousness, impulsiveness, vulnerability", 0], ["Extraversion", "Warmth, gregariousness, assertiveness, activity, excitement seeking, positive emotions", 0], ["Openness", "Fantasy, aesthetics, feelings, actions, ideas, values", 0], ["Agreeableness", "Trust, straightforwardness, altruism, compliance, modesty, tender mindedness", 0], ["Conscientiousness", "Competence, order, dutifulness, achievement striving, self discipline, deliberation", 0]])],
    ref: "Costa and McCrae NEO-PI-R Professional Manual 1992; McCrae and Terracciano 2005 personality profiles of cultures project; McCrae, Costa and Martin 2005 NEO-PI-3",
  },
  {
    id: "asmt-l03-004",
    subject: S,
    topic: "mcmi",
    marks: 5,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry", "ugc-net"],
    question: "Write short notes on the Millon Clinical Multiaxial Inventory (MCMI).",
    plan: ["Origin and theory", "Structure of the current version", "Base rate scores", "Uses and cautions"],
    answer: `## Origin and theory
Theodore Millon built the MCMI to measure personality disorders and clinical syndromes in adults seen in mental health settings. It rests on his theory of personality, which describes personality styles from basic polarities such as seeking pleasure or avoiding pain, being active or passive, and focusing on self or others. The test was revised several times to stay in line with the DSM; the MCMI-IV appeared in 2015.

## Structure
The MCMI-IV has 195 true or false items, far fewer than the MMPI-2, and takes about 25 to 30 minutes. Scales fall into groups:
- Personality pattern scales, such as schizoid, avoidant, dependent, histrionic, narcissistic, antisocial, compulsive and negativistic.
- Severe personality pathology scales: schizotypal, borderline and paranoid.
- Clinical syndrome scales, such as generalised anxiety, bipolar spectrum, persistent depression, alcohol use and post traumatic stress.
- Severe clinical syndromes: thought disorder, major depression and delusional disorder.
- Modifying indices (disclosure, desirability, debasement) and validity and inconsistency checks.

## Base rate scores
Raw scores are converted not to T scores but to base rate (BR) scores, which are anchored to how common each disorder is in clinical populations. A BR of 75 suggests the trait or syndrome is present, and 85 or more suggests it is prominent.

## Uses and cautions
It is quick and closely tied to diagnostic categories, which suits treatment planning. But its norms come from patients, so it should not be used with people from the general population or in routine job selection, where it overstates pathology. Scales overlap because items are shared, and Indian norms are lacking.`,
    keyPoints: ["Millon and his theory of personality", "MCMI-IV 2015, 195 items", "Personality and clinical syndrome scale groups", "Base rate scores, 75 and 85", "Normed on clinical samples only", "Item overlap and no Indian norms"],
    module: "assessment/2-3",
    visuals: [compare("Uses and cautions", ["MMPI-2", ["567 items", "T scores, 65 is clinical", "Normed on the general population", "Broad psychopathology"], "Long and broad"], ["MCMI-IV", ["195 items", "Base rate scores, 75 and 85", "Normed on patients only", "Focus on personality disorders"], "Short and diagnostic"], "Two objective inventories compared.")],
    ref: "Millon, Grossman and Millon MCMI-IV Manual 2015; Groth-Marnat Handbook of Psychological Assessment chapter on the MCMI",
  },
  {
    id: "asmt-l03-005",
    subject: S,
    topic: "epq",
    marks: 5,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "ugc-net"],
    question: "Write short notes on the Eysenck Personality Questionnaire.",
    plan: ["Eysenck's theory", "From MPI to EPQ-R", "Scales and scoring", "Evaluation"],
    answer: `## Eysenck's theory
Hans Eysenck described personality with a small number of broad, biologically based dimensions found by factor analysis. Extraversion and introversion was linked to the level of arousal in the ascending reticular activating system: introverts are more easily aroused, so they avoid stimulation, while extraverts seek it. Neuroticism, or emotional instability, was linked to reactivity of the limbic system and autonomic nervous system. Later he added Psychoticism, a dimension of toughness, coldness and impulsivity.

## From MPI to EPQ-R
- 1959: the MPI, Eysenck's first inventory, measured Extraversion and Neuroticism.
- 1964: the Eysenck Personality Inventory added a Lie scale.
- 1975: the Eysenck Personality Questionnaire, written with Sybil Eysenck, added Psychoticism.
- 1985: the EPQ-R revised the Psychoticism items; short forms are also available.

## Scales and scoring
| Scale | High scorer |
| E: Extraversion | Sociable, lively, seeks excitement |
| N: Neuroticism | Anxious, moody, easily upset |
| P: Psychoticism | Tough minded, aggressive, impulsive |
| L: Lie | Answers in a socially desirable way |
Items are answered yes or no, and raw scores are compared with norms. Crossing E and N gives four quadrants that match the ancient temperaments: melancholic, choleric, sanguine and phlegmatic.

## Evaluation
E and N are robust and match two of the Big Five; P is the weakest scale, with low reliability, and is closer to low agreeableness and low conscientiousness than to psychosis. The test is short and easy to use in research and has been used with Indian students.`,
    keyPoints: ["Eysenck's biological theory of E and N", "Sequence MPI, EPI, EPQ, EPQ-R with years", "E, N, P and L scales", "Yes or no items", "Four temperament quadrants", "P scale weakest"],
    module: "assessment/2-3",
    visuals: [{ kind: "figure", data: { id: "eysenck-circle" }, caption: "Scales and scoring: crossing extraversion with stability gives the four classical temperaments." }],
    ref: "Eysenck and Eysenck EPQ Manual 1975; Eysenck, Eysenck and Barrett 1985 EPQ-R",
  },
  {
    id: "asmt-l03-006",
    subject: S,
    topic: "personality-assessment",
    marks: 10,
    difficulty: 3,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "What are response sets and response styles? Discuss how they distort personality inventories and how test developers control them.",
    plan: ["Define response set and response style", "Main types with examples", "Effects on scores and validity", "Methods of control at the stage of building the test", "Methods of detection at the stage of scoring", "Conclusion"],
    answer: `## Meaning
A self report inventory assumes that the person reads each item and answers it truthfully about themselves. A response set is a tendency to answer in a particular way that has nothing to do with the item's content. Lee Cronbach drew attention to response sets in the 1940s. Some writers keep "response set" for a temporary, situation driven bias (such as wanting to look good at a job interview) and "response style" for a lasting habit (such as always agreeing).

## Main types
- Social desirability: choosing the answer that looks good. Allen Edwards showed that how desirable an item sounds strongly predicts how often it is endorsed. Delroy Paulhus split it into self deceptive enhancement (honestly held but inflated self views) and impression management (deliberately polishing one's image).
- Faking good: deliberate positive presentation, common in selection, custody and parole evaluations.
- Faking bad: exaggerating problems, as in seeking compensation, disability benefits or a lighter sentence.
- Acquiescence: agreeing with items regardless of content, which is more common in less educated respondents and in cultures that value politeness; nay saying is the opposite.
- Extreme and midpoint responding: always choosing the ends or the middle of a rating scale.
- Random or careless responding: from poor reading skill, fatigue or lack of interest.

## Effects on scores
Response sets add a source of variance unrelated to the trait. They can raise or lower scores, inflate correlations between scales that share the bias, and lower validity. In Indian settings, reading a translated or English questionnaire with limited literacy and a wish to please the examiner both increase acquiescence and social desirability.

## Control while building the test
- Balanced keying: half the items keyed true and half false, so acquiescence cancels out.
- Subtle items whose purpose is not obvious, as in empirically keyed MMPI items.
- Forced choice formats in which the person chooses between statements matched for desirability, as in the Edwards Personal Preference Schedule. This produces ipsative scores, which compare traits within a person and cannot easily be compared between people.
- Neutral wording, simple language and good translation.
- Clear instructions, assurance of confidentiality and good rapport.

## Detection while scoring
- Validity scales: L, K, F, VRIN and TRIN on the MMPI-2; the impression management index on the 16PF; the Lie scale on the EPQ.
- Separate social desirability scales such as the Marlowe Crowne scale, used in research.
- Checks of consistency between repeated or opposite items, and of time taken.
- Collateral information from informants, records and observation.

## Conclusion
Response sets are a constant threat to self report measures. Good inventories reduce them through item design and detect them through validity indices, and good clinicians interpret scores only after asking how the person approached the test.`,
    keyPoints: ["Definition and set versus style", "Social desirability with Edwards and Paulhus", "Faking good and faking bad with settings", "Acquiescence and extreme responding", "Effect on validity and correlations", "Balanced keying, subtle items, forced choice and ipsative scores", "Validity scales and collateral data"],
    pitfalls: ["Treating every high L score as lying", "Forgetting that forced choice gives ipsative scores"],
    module: "assessment/2-3",
    visuals: [vis("sort", { prompt: "Which response set is most likely in each situation?", buckets: ["Faking good", "Faking bad", "Acquiescence", "Random responding"], items: [
      { text: "A candidate for a bank job answers a personality test", bucket: 0, why: "Selection settings reward looking well adjusted." },
      { text: "A man seeking compensation after a road accident completes a symptom checklist", bucket: 1, why: "Gain from appearing more unwell." },
      { text: "An elderly villager agrees with almost every statement read out by the examiner", bucket: 2, why: "Politeness and limited familiarity with tests increase yes saying." },
      { text: "A bored student finishes a 567 item test in 15 minutes", bucket: 3, why: "Too fast to have read the items." },
    ] }, "Main types")],
    ref: "Cronbach 1946 response sets; Edwards 1957 social desirability; Paulhus 1984 and 2002 two component model; Crowne and Marlowe 1960",
  },
  {
    id: "asmt-l03-007",
    subject: S,
    topic: "interest-inventories",
    marks: 5,
    difficulty: 1,
    exams: ["ma-semester", "cuet-pg"],
    question: "Write short notes on interest inventories used in career guidance.",
    plan: ["What interests are and why they are measured", "Strong Interest Inventory", "Kuder and Holland's Self Directed Search", "Indian tools and limits"],
    answer: `## What they measure
Interests are stable likes and dislikes for activities, school subjects and kinds of work. Interest inventories compare a person's pattern of likes with those of people happily employed in different occupations, or with theoretical types, to guide career and course choice. They measure preference, not ability, so they are used along with aptitude tests and school marks.

## Strong Interest Inventory
E K Strong published the Strong Vocational Interest Blank in 1927 using empirical keying: items were kept if people in an occupation answered them differently from people in general. The modern Strong Interest Inventory gives General Occupational Themes based on Holland's six types, Basic Interest Scales, Occupational Scales and Personal Style Scales (such as work style and leadership style).

## Kuder and Holland
- The Kuder Preference Record, from 1939, used forced choice triads ("which would you most like and least like to do?") and gave scores in areas such as outdoor, mechanical, computational, scientific, persuasive, artistic, literary, musical, social service and clerical.
- John Holland's Self Directed Search, first published in 1971, is self scored and gives a three letter code from the six RIASEC types: Realistic, Investigative, Artistic, Social, Enterprising and Conventional. The code is matched to occupations with the same code.

## Indian tools and limits
Indian counsellors use translated or adapted forms of these tools and Indian measures such as S Chatterji's Non Language Preference Record, which uses pictures and suits students with limited reading. Limits: interests in adolescence are still forming, family and financial pressures shape choices strongly in India, and many inventories list Western jobs. Results should open a conversation, not decide a career.`,
    keyPoints: ["Interests are preferences, not abilities", "Strong 1927 and empirical keying", "Strong Interest Inventory scales", "Kuder forced choice areas", "Holland's SDS and RIASEC code", "Indian tools and cultural limits"],
    module: "therapies/2-6",
    visuals: [cycle("Kuder and Holland", [["Realistic", "Hands on work with tools, machines, animals"], ["Investigative", "Science, analysis, research"], ["Artistic", "Creative, unstructured work"], ["Social", "Teaching, helping, counselling"], ["Enterprising", "Leading, selling, persuading"], ["Conventional", "Order, records, data"]], "Holland's six types sit round a hexagon; types next to each other are most alike.")],
    ref: "Strong 1927; Kuder 1939; Holland Self-Directed Search 1971 and Making Vocational Choices 1997; Donnay Strong Interest Inventory manual 2005",
  },
  {
    id: "asmt-l03-008",
    subject: S,
    topic: "rorschach",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "ugc-net"],
    question: "Describe the Rorschach Inkblot Test: its materials, administration, scoring and interpretation. Evaluate its reliability and validity.",
    plan: ["History and the cards", "Administration: response phase and inquiry", "Scoring categories", "Structural summary and indices; R-PAS", "Reliability and validity evidence", "Conclusion"],
    answer: `## History and materials
Hermann Rorschach, a Swiss psychiatrist, published the inkblot test in 1921, shortly before his early death. He saw it as a test of perception: how a person organises an ambiguous stimulus reveals their style of thinking and feeling. There are ten symmetrical cards. Five are achromatic (I, IV, V, VI, VII), two are black and red (II, III) and three are fully coloured (VIII, IX, X).

## Administration
1. Response phase: the cards are handed over one at a time in order with the question "What might this be?" Every response is written down word for word, along with the time and the position of the card.
2. Inquiry phase: the examiner goes back through the responses, asking where the person saw each one and what made it look that way, without leading. This information is needed for scoring.
In Exner's Comprehensive System, a record with fewer than 14 responses is usually too short to interpret. The newer Rorschach Performance Assessment System (R-PAS) asks for two or three responses to each card and stops at four, which keeps the number of responses within a useful range.

## Scoring categories
| Category | What is coded | Examples |
| Location | Which part of the blot was used | W whole, D common detail, Dd unusual detail, S white space |
| Determinants | What made it look that way | F form, M human movement, FM animal movement, C colour, T texture, V vista, Y shading |
| Form quality | How well the response fits the blot | Ordinary, unusual, minus (poor fit) |
| Content | What was seen | Human, animal, anatomy, nature |
| Populars | Very common responses | A bat or butterfly on card V |
| Special scores | Unusual thinking | Deviant verbalisation, fabulised combination, contamination |

## Structural summary and interpretation
Scores are totalled into ratios, percentages and indices in a structural summary. Examples include the ratio of human movement to colour responses (the experience balance, said to show whether a person deals with problems by thinking or by acting on feeling), the proportion of form responses with poor fit (a measure of distorted reality testing), and indices such as the Perceptual Thinking Index, Depression Index, Coping Deficit Index and Suicide Constellation. Interpretation moves from the structural data to the sequence of responses and their content, and should end with hypotheses linked to the referral question.

## Reliability
With trained scorers, inter rater agreement for Comprehensive System codes is generally good, with kappa or intraclass values mostly above 0.6 and many above 0.8. Test retest stability is good for many ratios in adults but less so in children.

## Validity
The Rorschach has been fiercely debated. Critics such as Scott Lilienfeld, James Wood and Howard Garb argued that the Comprehensive System norms made healthy people look disturbed, that many indices lacked support, and that clinicians overinterpreted content. A large meta analysis by Joni Mihura and colleagues in 2013 found good support for variables tied to perception and thinking, such as poor form quality and the special scores for thought disorder, and some measures of cognitive complexity and stress, but little support for many others. R-PAS was built to keep only the better supported variables, use international norms and control the number of responses. The best evidence is for detecting thought disorder and psychosis; the weakest is for detecting abuse, diagnosing depression or describing personality from content alone.

## Indian context
The Rorschach is still widely taught and used in Indian hospital departments of clinical psychology, often scored with Klopfer or Exner methods and Indian studies of popular responses. Indian examiners should use supported indices and report the rest as tentative.

## Conclusion
The Rorschach is a standardised performance task, not a projective mystery. Scored carefully with modern systems, a few of its variables are valid for thinking and perception, but it should not be used alone to diagnose or to make legal decisions.`,
    keyPoints: ["Hermann Rorschach 1921, ten cards described", "Response phase and inquiry", "Location, determinants, form quality, content, populars, special scores", "Structural summary and named indices", "Comprehensive System and R-PAS with response control", "Inter rater reliability figures", "Mihura meta analysis: thought disorder and form quality supported", "Limits on use for diagnosis and in court"],
    pitfalls: ["Skipping the inquiry phase", "Calling the Rorschach either fully valid or worthless", "Interpreting content symbols without structural data"],
    module: "assessment/2-4",
    visuals: [
      tree("Scoring categories", [["Rorschach response", "Each response is coded on several dimensions", -1], ["Location", "Whole, common detail, unusual detail, white space", 0], ["Determinants", "Form, movement, colour, shading, texture", 0], ["Form quality", "How well the percept fits the blot", 0], ["Content", "Human, animal, anatomy and others", 0], ["Special scores", "Signs of unusual or illogical thinking", 0]]),
      compare("Validity", ["Better supported", ["Poor form quality and distorted perception", "Thought disorder special scores", "Perceptual Thinking Index", "Some measures of complexity and stress"], "Thinking and perception"], ["Poorly supported", ["Many content based symbols", "Detecting child sexual abuse", "Most Depression Index uses", "Many old ratios"], "Personality from content"]),
    ],
    ref: "Rorschach 1921; Exner The Rorschach: A Comprehensive System; Meyer, Viglione, Mihura, Erard and Erdberg R-PAS 2011; Mihura, Meyer, Dumitrascu and Bombel 2013 Psychological Bulletin; Lilienfeld, Wood and Garb 2000; study module assessment 2.4",
  },
  {
    id: "asmt-l03-009",
    subject: S,
    topic: "tat",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "mcp-entrance", "ugc-net"],
    question: "Describe the Thematic Apperception Test. Discuss its administration, analysis and Indian adaptations.",
    plan: ["Origin and theory of needs and press", "Materials and administration", "Methods of analysis", "Variants including the CAT and the Indian adaptation", "Evaluation and conclusion"],
    answer: `## Origin and theory
Christiana Morgan and Henry Murray at the Harvard Psychological Clinic published the Thematic Apperception Test in 1935, and Murray issued the standard set in 1943. It is based on Murray's personology: behaviour comes from inner needs (such as achievement, affiliation, dominance and aggression) meeting environmental pressures, or press (such as rejection, danger or support). Apperception means interpreting a new perception in the light of past experience, so the stories a person tells about ambiguous pictures should reveal their needs, conflicts and ways of seeing relationships.

## Materials and administration
- There are 31 cards: 30 black and white pictures of people in ambiguous situations and one blank card (card 16), on which the person imagines a picture.
- Some cards are meant for men, women, boys or girls. In practice, examiners choose about 8 to 12 cards relevant to the referral.
- Instructions: tell a story with a beginning, a middle and an end; say what is happening, what led up to it, what the characters are thinking and feeling, and how it turns out.
- Stories are recorded word for word, along with pauses and comments.

## Analysis
Murray's method looks at:
1. The hero: the character the storyteller identifies with.
2. The hero's needs and feelings.
3. The press acting on the hero.
4. The thema: the interaction of needs and press, the plot of the story.
5. The outcome: success or failure, happy or unhappy, and whether the hero acts or is acted on.
Leopold Bellak simplified this into the main theme, the hero, needs, conception of the world, relationships, conflicts, anxieties, defences and the strength of the superego and ego. Research scoring systems include David McClelland's codes for the need for achievement, affiliation and power, and Drew Westen's Social Cognition and Object Relations Scale, which rates how people understand others and relationships.

## Variants
- Children's Apperception Test (CAT) by Leopold and Sonya Bellak, in 1949, uses animal figures for children aged about 3 to 10.
- Uma Chowdhury produced an Indian adaptation of the TAT in 1960, redrawing the pictures with Indian people, clothing and settings, and also an Indian version of the CAT.
- Other adaptations exist for older adults and for specific cultures.

## Evaluation
Strengths: rich clinical material on relationships and themes, useful in building rapport and in therapy planning. Limits: no single agreed scoring system, so clinical interpretation varies; long administration; stories are affected by the card's pull, recent events and verbal ability; and norms are weak. Research systems such as McClelland's achievement codes and Westen's object relations scale have shown acceptable reliability and validity.

## Conclusion
The TAT is a story telling method for exploring needs and relationships. It works best with a structured scoring approach, cards chosen for the question, and cautious interpretation integrated with other data.`,
    keyPoints: ["Morgan and Murray 1935, need and press theory", "31 cards including the blank card", "Instructions for a complete story", "Hero, needs, press, thema, outcome", "Bellak's method and research scoring (McClelland, SCORS)", "CAT and Uma Chowdhury's Indian adaptation", "Evaluation of reliability and validity"],
    module: "assessment/2-4",
    visuals: [chain("Analysis", [["Hero", "The character the storyteller identifies with"], ["Needs", "What the hero wants or feels"], ["Press", "Forces acting on the hero from the world"], ["Thema", "How needs and press play out: the plot"], ["Outcome", "How the story ends and who acts"]], "Murray's five steps for reading each story.")],
    ref: "Morgan and Murray 1935; Murray TAT Manual 1943; Bellak The TAT, CAT and SAT in Clinical Use; Chowdhury 1960 Indian adaptation of the TAT; Westen SCORS 1991; McClelland 1953",
  },
  {
    id: "asmt-l03-010",
    subject: S,
    topic: "projective-general",
    marks: 20,
    difficulty: 4,
    exams: ["mcp-entrance", "ugc-net", "ma-semester"],
    question: "Critically evaluate projective techniques of personality assessment. How do they compare with objective inventories, and what is their place in clinical practice today?",
    plan: ["Projective hypothesis and definition", "Lindzey's classification with examples", "Arguments for projective techniques", "Psychometric criticisms and the evidence", "Comparison with objective inventories", "Current place in practice and India; conclusion"],
    answer: `## The projective hypothesis
Lawrence Frank coined the term "projective methods" in 1939. The projective hypothesis is that when a person responds to an ambiguous, unstructured stimulus, they must impose their own meaning on it, and in doing so reveal needs, conflicts, defences and ways of seeing the world that they may not be aware of or willing to report. Projective techniques grew from psychoanalytic ideas, though modern users often describe them as performance based tests: samples of how a person behaves on a standard task.

## Classification
Gardner Lindzey in 1959 grouped them by the kind of response asked for:
| Type | Task | Examples |
| Association | Say what comes to mind | Rorschach inkblots, word association test |
| Construction | Create a story or product | Thematic Apperception Test, Children's Apperception Test |
| Completion | Finish an incomplete stimulus | Rotter Incomplete Sentences Blank, Rosenzweig Picture Frustration Study |
| Choice or ordering | Pick or rank stimuli | Szondi test, picture arrangement |
| Expression | Free creative activity | Draw a Person, House Tree Person, play techniques |

## Arguments in favour
- Hard to fake: the purpose of the task is less obvious than a questionnaire item.
- Less dependent on reading ability and on the person's insight, so they can be used with children and less literate adults.
- They give a rich, individual picture of themes, relationships and defences, useful for formulation and therapy.
- They help build rapport, especially with children who find drawing or story telling easier than direct questions.
- Some scores capture processes that self report cannot, such as distorted perception and disorganised thinking on the Rorschach.

## Criticisms and evidence
- Standardisation: administration and scoring often vary between examiners; many clinicians use no formal scoring at all.
- Reliability: inter scorer agreement is good for well defined systems (Rorschach Comprehensive System, R-PAS, some TAT research codes) but poor for impressionistic interpretation. Test retest reliability is hard to judge because people's stories change.
- Norms: often small, old or unrepresentative. The Exner norms made non patients look disturbed.
- Validity: reviews by Lilienfeld, Wood and Garb in 2000 concluded that most projective indices lack strong validity. A meta analysis by Mihura and colleagues in 2013 found good support for some Rorschach variables tied to perception and thinking, and research TAT codes for achievement motivation and object relations also show validity. Human figure drawings have weak validity for personality or abuse.
- Incremental validity: many indices add little beyond interview and inventories.
- Clinician bias: illusory correlation, shown in the Chapmans' studies in the 1960s, where both students and clinicians "saw" expected links (such as big eyes in drawings and paranoia) that did not exist in the data.
- Cultural fairness: pictures and themes may be unfamiliar, and verbal fluency affects output.

## Comparison with objective inventories
| Feature | Projective techniques | Objective inventories |
| Stimulus | Ambiguous, unstructured | Clear, structured items |
| Response | Free, open | Fixed choice (true or false, rating) |
| Scoring | Often complex, examiner dependent | Simple, objective, computer scored |
| Faking | Harder, but not impossible | Easier, controlled by validity scales |
| Reliability and norms | Variable, often weak | Usually strong |
| Information | Rich, individual themes and processes | Standard trait and symptom profiles |
| Training needed | Long | Shorter |
| Best use | Hypotheses on thinking, relationships, defences | Screening, diagnosis support, research |
Robert Bornstein argued that the two kinds of test tap different levels: implicit, automatic processes on performance based tests and explicit, self attributed qualities on questionnaires. This explains why they often correlate weakly, yet both can predict behaviour.

## Current place in practice
- Use projective methods as one source among several, never as the sole basis for diagnosis, custody decisions or claims of abuse.
- Prefer systems with evidence: R-PAS or the Comprehensive System for the Rorschach, structured TAT coding, and drawings only as rapport builders or rough developmental indicators.
- Report findings as hypotheses, state limitations, and check them against history, interview and inventories.
- Be cautious in court: expert evidence must rest on reliable methods.

## Indian context
In India, the Rorschach, TAT (including Uma Chowdhury's Indian adaptation), sentence completion and drawing tests remain common in training and hospital settings, and they are useful with clients who cannot read English inventories. But Indian norms are scarce. Training should stress supported indices, structured scoring and honest reporting of uncertainty.

## Conclusion
Projective techniques offer depth and resistance to faking, but most traditional interpretations have weak psychometric support. A few well scored variables are valid, especially for thinking and perception. Their rightful place is as standardised performance tasks within a multi method assessment, interpreted with humility.`,
    keyPoints: ["Frank 1939 and the projective hypothesis", "Lindzey's five types with examples", "Arguments for: faking, literacy, richness, rapport", "Criticisms: standardisation, reliability, norms, validity", "Evidence: Lilienfeld review and Mihura meta analysis", "Illusory correlation (Chapman)", "Comparison table with objective tests", "Current multi method place and Indian use"],
    pitfalls: ["One sided answer either praising or dismissing all projectives", "Not naming the classification", "No evidence cited for the evaluation"],
    module: "assessment/2-4",
    visuals: [
      tree("Classification", [["Projective techniques", "Grouped by the kind of response asked for", -1], ["Association", "Rorschach, word association", 0], ["Construction", "TAT, CAT: tell a story", 0], ["Completion", "Sentence completion, Rosenzweig picture frustration", 0], ["Choice or ordering", "Szondi, picture arrangement", 0], ["Expression", "Draw a Person, House Tree Person, play", 0]]),
      compare("Comparison with objective inventories", ["Projective", ["Ambiguous stimulus", "Free response", "Examiner dependent scoring", "Harder to fake"], "Rich but weaker psychometrics"], ["Objective", ["Clear items", "Fixed responses", "Objective scoring", "Validity scales control faking"], "Strong psychometrics but transparent"]),
      layers("Current place in practice", "stack", [["Report as hypotheses", "State limits, link to the referral question"], ["Check against other data", "History, interview, inventories, records"], ["Use supported scoring", "R-PAS or Comprehensive System, structured TAT codes"], ["Never use alone", "Not for diagnosis, custody or abuse claims by itself"]]),
    ],
    ref: "Frank 1939; Lindzey 1959 American Psychologist; Lilienfeld, Wood and Garb 2000 Psychological Science in the Public Interest; Mihura 2013; Chapman and Chapman 1967 illusory correlation; Bornstein 2002 process dissociation",
  },
]);
