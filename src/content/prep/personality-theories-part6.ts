import type { PrepExam, PrepQuestion } from "@/lib/prep/types";

/** Personality · part 6: biological approaches (temperament, Cloninger, Zuckerman, molecular and evolutionary views) and links to personality assessment. */

const C: PrepExam = "cuet-pg";
const N: PrepExam = "ugc-net";
const M: PrepExam = "mcp-entrance";
const S: PrepExam = "ma-semester";

const AR: [string, string, string, string] = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is not the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

type Q = Omit<PrepQuestion, "subject" | "topic"> & { topic?: string };
const p = (q: Q): PrepQuestion => ({ subject: "personality-theories", topic: "biological-approaches", ...q });

export const QUESTIONS: PrepQuestion[] = [
  // ── Biological approaches ──────────────────────────────────────────────────
  p({
    id: "per-bio-0238",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "Temperament is usually defined as:",
    options: [
      "A set of values and attitudes learned in adulthood from one's culture",
      "Early, biologically based differences in emotional reactivity and self-regulation",
      "A person's moral character",
      "A personality disorder",
    ],
    answer: 1,
    explanation:
      "Temperament refers to differences seen from infancy, such as how easily a baby is upset, how active it is and how well it can be soothed. These are partly inherited and fairly stable, and they are thought to develop into adult traits such as neuroticism and extraversion, shaped by experience. Values and moral character are learned later. Temperament is a normal variation, not a disorder.",
    ref: "Rothbart & Bates 2006; Kagan 1994",
  }),
  p({
    id: "per-bio-0239",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Jerome Kagan's research on 'behavioural inhibition' found that infants who were highly reactive to unfamiliar stimuli at 4 months (crying and thrashing):",
    options: [
      "Showed no differences from other children later",
      "Always became highly extraverted adults who sought out novelty and risk",
      "Were more likely to be shy and cautious as children, though many became less inhibited",
      "Were all diagnosed with anxiety disorders",
    ],
    answer: 2,
    explanation:
      "About a fifth of Kagan's infants were high-reactive. As a group they were more inhibited and fearful in new situations as children, showed greater amygdala reactivity to novel faces as adults, and had a somewhat higher risk of social anxiety. But many changed, especially with supportive parenting, so temperament is a tendency, not a destiny. They did not all become extraverts, they did differ from other children, and only a minority developed anxiety disorders.",
    ref: "Kagan & Snidman 2004; Schwartz et al. 2003",
  }),
  p({
    id: "per-bio-0240",
    exams: [N, M],
    difficulty: 3,
    type: "match",
    stem: "Match Cloninger's temperament dimension in List I with the neurotransmitter system he originally linked it to in List II.",
    lists: {
      left: ["A. Novelty seeking", "B. Harm avoidance", "C. Reward dependence"],
      right: ["i. Serotonin", "ii. Noradrenaline", "iii. Dopamine"],
    },
    options: [
      "A-i, B-iii, C-ii",
      "A-iii, B-i, C-ii",
      "A-iii, B-ii, C-i",
      "A-ii, B-i, C-iii",
    ],
    answer: 1,
    explanation:
      "Cloninger's psychobiological model proposed that novelty seeking reflects dopamine-based behavioural activation (iii), harm avoidance reflects serotonin-based behavioural inhibition (i), and reward dependence reflects noradrenaline-based maintenance of rewarded behaviour (ii). Later he added persistence as a fourth temperament and three character dimensions. Direct evidence for these one-to-one links has been weak. The other codes swap these systems.",
    ref: "Cloninger 1987; Cloninger, Svrakic & Przybeck 1993",
  }),
  p({
    id: "per-bio-0241",
    exams: [N, M, S],
    difficulty: 3,
    type: "statement",
    stem: "Which statements about Cloninger's Temperament and Character Inventory (TCI) are correct?",
    statements: [
      "A. It measures four temperament dimensions: novelty seeking, harm avoidance, reward dependence and persistence.",
      "B. It measures three character dimensions: self-directedness, cooperativeness and self-transcendence.",
      "C. Low self-directedness and low cooperativeness are associated with personality disorders.",
      "D. Character dimensions were proposed to be entirely inherited and unchangeable.",
    ],
    options: [
      "B and D only",
      "A and D only",
      "A, B and C only",
      "A, B, C and D",
    ],
    answer: 2,
    explanation:
      "A and B describe the TCI's seven dimensions. C is correct: Cloninger proposed that low self-directedness and cooperativeness indicate the presence of a personality disorder, while the temperament profile suggests its type. D is wrong: character dimensions were described as developing through learning and insight across life, in contrast with temperament, which was seen as more heritable.",
    ref: "Cloninger, Svrakic & Przybeck 1993",
  }),
  p({
    id: "per-bio-0242",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Marvin Zuckerman's 'sensation seeking' trait includes thrill and adventure seeking, experience seeking, disinhibition and:",
    options: [
      "Social anxiety",
      "Harm avoidance",
      "Conscientiousness",
      "Boredom susceptibility",
    ],
    answer: 3,
    explanation:
      "Zuckerman's Sensation Seeking Scale has four subscales: thrill and adventure seeking (risky sports), experience seeking (new experiences through travel, music or lifestyle), disinhibition (parties, drinking) and boredom susceptibility (dislike of routine). High sensation seeking has been linked to risky driving, substance use and low levels of the enzyme MAO. Harm avoidance is Cloninger's opposite tendency. Conscientiousness and social anxiety are not subscales.",
    ref: "Zuckerman 1979, 1994",
  }),
  p({
    id: "per-bio-0243",
    exams: [N, M],
    difficulty: 4,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Early studies reporting that a single variant of the dopamine D4 receptor gene (DRD4) strongly explains novelty seeking have not been reliably confirmed.",
      "R: Personality traits are highly polygenic, with many genetic variants each having very small effects.",
    ],
    options: AR,
    answer: 0,
    explanation:
      "Both are true and R explains A. Two 1996 studies linked the long form of DRD4 to novelty seeking, but later meta-analyses found small or inconsistent effects. Genome-wide studies of personality show that traits are influenced by thousands of variants of tiny effect, so single-gene findings from small samples were usually false positives. This mirrors the history of candidate genes in psychiatry.",
    ref: "Ebstein et al. 1996; Munafò et al. 2008; Lo et al. 2017",
  }),
  p({
    id: "per-bio-0244",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "Evolutionary personality psychologists such as David Buss explain individual differences in traits partly by proposing that:",
    options: [
      "All personality differences are random noise with no function, left over from mutation",
      "Different levels of a trait can be adaptive in different environments, so selection keeps variation",
      "Only one level of each trait is ever adaptive",
      "Personality is unrelated to survival or reproduction",
    ],
    answer: 1,
    explanation:
      "For example, high extraversion may bring more mates and allies but also more risk of injury, so its benefits depend on the environment; when the best level changes over time and place, variation persists. Nettle and Buss have argued this for several traits. Saying differences are pure noise or have no link to survival ignores this view. Saying only one level is adaptive would predict that variation disappears, which it has not.",
    ref: "Buss 1991; Nettle 2006, Am Psychol",
  }),
  p({
    id: "per-bio-0245",
    exams: [N, M],
    difficulty: 3,
    type: "match",
    stem: "Match the temperament model in List I with its dimensions in List II.",
    lists: {
      left: ["A. Buss and Plomin", "B. Rothbart", "C. Thomas and Chess", "D. Gray"],
      right: [
        "i. Surgency (extraversion), negative affectivity and effortful control",
        "ii. Behavioural inhibition and behavioural activation systems",
        "iii. Easy, difficult and slow-to-warm-up children",
        "iv. Emotionality, activity and sociability (EAS)",
      ],
    },
    options: [
      "A-iv, B-iii, C-i, D-ii",
      "A-i, B-iv, C-iii, D-ii",
      "A-iv, B-i, C-iii, D-ii",
      "A-iv, B-i, C-ii, D-iii",
    ],
    answer: 2,
    explanation:
      "Buss and Plomin proposed three heritable temperaments: emotionality, activity and sociability (iv). Rothbart's model has surgency, negative affectivity and effortful control (i); effortful control links to later conscientiousness. Thomas and Chess described easy, difficult and slow-to-warm-up children (iii). Gray proposed the BIS and BAS (ii). The other codes swap these.",
    ref: "Buss & Plomin 1984; Rothbart 2007; Thomas & Chess 1977; Gray 1987",
  }),
  p({
    id: "per-bio-0246",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Brain imaging studies of personality have most consistently linked extraversion to:",
    options: [
      "A smaller amygdala and weaker responses to threatening faces and sounds",
      "A smaller cerebellum",
      "Damage to Broca's area",
      "Greater responsiveness of reward regions such as the ventral striatum to rewarding stimuli",
    ],
    answer: 3,
    explanation:
      "DeYoung and others have found that extraversion relates to the volume of medial orbitofrontal cortex and to striatal responses to reward, consistent with the view that extraversion reflects sensitivity to reward, linked to dopamine. Neuroticism has been linked to regions involved in threat and self-evaluation. A smaller amygdala with weaker threat responses, a smaller cerebellum and damage to Broca's area are not established correlates of extraversion; amygdala and threat findings relate more to neuroticism.",
    ref: "DeYoung et al. 2010; Canli et al. 2001",
  }),
  p({
    id: "per-bio-0247",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: Researchers have found stable personality-like differences in many animals, from chimpanzees and dogs to octopuses.",
      "R: Gosling and colleagues found that observers can rate animal personality reliably, and these ratings predict the animals' behaviour.",
    ],
    options: AR,
    answer: 0,
    explanation:
      "Both are true and R explains A. Studies of animal personality show traits resembling extraversion, neuroticism and agreeableness in many species, and conscientiousness mainly in chimpanzees. Reliable ratings that predict later behaviour are what allow researchers to claim stable personality in animals. This supports a biological and evolutionary basis for traits.",
    ref: "Gosling 2001, Psychol Bull; Gosling & John 1999",
  }),
  // ── Assessment links ───────────────────────────────────────────────────────
  p({
    id: "per-assess-0248",
    topic: "personality-assessment",
    module: "assessment",
    exams: [C, N, S],
    difficulty: 1,
    type: "mcq",
    stem: "A projective test of personality is one in which:",
    options: [
      "The person responds to ambiguous stimuli and is assumed to project inner needs onto them",
      "The person answers true or false to clear statements about their behaviour",
      "The person's reaction time is measured",
      "The person's brain activity is recorded",
    ],
    answer: 0,
    explanation:
      "Lawrence Frank named this the 'projective hypothesis': when a stimulus has no single meaning, the person's interpretation reveals their personality. Examples are the Rorschach, TAT, sentence completion and drawing tests. True-false self-report items describe objective inventories such as the MMPI. Reaction times and brain recordings are other kinds of measures.",
    ref: "Frank 1939; Anastasi & Urbina, ch. 15",
  }),
  p({
    id: "per-assess-0249",
    topic: "personality-assessment",
    module: "assessment",
    exams: [C, N, M, S],
    difficulty: 2,
    type: "match",
    stem: "Match the personality test in List I with its theoretical or methodological basis in List II.",
    lists: {
      left: ["A. MMPI", "B. 16PF", "C. TAT", "D. NEO-PI-R"],
      right: [
        "i. Factor analysis of trait terms and data",
        "ii. Murray's theory of needs and press",
        "iii. Empirical criterion keying: items chosen because they separated patient groups from non-patients",
        "iv. The five-factor model, with six facets per domain",
      ],
    },
    options: [
      "A-i, B-iii, C-ii, D-iv",
      "A-iii, B-i, C-ii, D-iv",
      "A-iii, B-ii, C-i, D-iv",
      "A-iii, B-i, C-iv, D-ii",
    ],
    answer: 1,
    explanation:
      "Hathaway and McKinley built the MMPI by keeping items that statistically distinguished clinical groups from normal controls, whatever their content (iii). Cattell built the 16PF through factor analysis (i). The TAT grew out of Murray's need-press theory (ii). Costa and McCrae built the NEO-PI-R around the five-factor model (iv). These illustrate the empirical, factor-analytic and theory-based strategies of test construction. The other codes swap these.",
    ref: "Hathaway & McKinley 1943; Cattell 1949; Morgan & Murray 1935; Costa & McCrae 1992",
  }),
  p({
    id: "per-assess-0250",
    topic: "personality-assessment",
    module: "assessment",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "On the MMPI-2, the F (infrequency) scale is mainly used to detect:",
    options: [
      "Depression",
      "Defensiveness and under-reporting ('faking good')",
      "Random responding or over-reporting of symptoms ('faking bad')",
      "Masculinity-femininity",
    ],
    answer: 2,
    explanation:
      "F items are rarely endorsed by most people, so a high F score suggests careless or random answering, severe distress, or exaggeration of problems. The L and K scales detect defensiveness or presenting oneself too favourably. Depression is clinical scale 2, and masculinity-femininity is scale 5. Validity scales are interpreted before the clinical scales.",
    ref: "Butcher et al. 2001, MMPI-2 manual; Graham 2012",
  }),
  p({
    id: "per-assess-0251",
    topic: "personality-assessment",
    module: "assessment",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: People tend to rate vague, general personality descriptions as poor descriptions of themselves, because they notice the statements could fit anyone.",
      "R: Such statements apply to almost everyone, and people focus on the parts that fit them.",
    ],
    options: AR,
    answer: 3,
    explanation:
      "A is false and R is true. Forer's classroom demonstration showed the opposite: students rated an identical, generic sketch ('You have a need for other people to like you') as highly accurate, around 4.3 on a 5-point scale. This Barnum or Forer effect explains why horoscopes and some unvalidated tests seem convincing. R gives the reason correctly: the statements fit nearly everyone, and people attend selectively to the parts that apply to them. Since A is false, options in which A is true are wrong.",
    ref: "Forer 1949; Dickson & Kelly 1985",
  }),
  p({
    id: "per-assess-0252",
    topic: "personality-assessment",
    module: "assessment",
    exams: [N, M, S],
    difficulty: 3,
    type: "statement",
    stem: "Which statements about response biases in self-report personality inventories are correct?",
    statements: [
      "A. Social desirability is the tendency to present oneself in a favourable light.",
      "B. Acquiescence is the tendency to agree with statements regardless of their content.",
      "C. Balancing the keying of items (some worded positively, some negatively) helps control acquiescence.",
      "D. The Marlowe-Crowne scale is designed to measure intelligence.",
    ],
    options: [
      "A, B, C and D",
      "A and D only",
      "B and D only",
      "A, B and C only",
    ],
    answer: 3,
    explanation:
      "A and B describe two major response styles. C is a standard remedy: if half the items are reverse-keyed, simple 'yes-saying' cancels out, a lesson learned partly from the all-positive wording of the original F-scale. D is wrong: the Marlowe-Crowne Social Desirability Scale measures the need to give socially approved answers, not intelligence.",
    ref: "Crowne & Marlowe 1960; Paulhus 1991",
  }),
  p({
    id: "per-assess-0253",
    topic: "personality-assessment",
    module: "assessment",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "Which conclusion is best supported by these findings?",
    passage:
      "A clinic compares two methods of assessing personality for treatment planning. Method X uses inkblot responses scored by trained clinicians; inter-rater agreement for some indices is good, but norms for many scores were found to over-identify pathology in community samples, and validity is strong for only some indices, such as those related to thought disorder. Method Y uses a structured self-report inventory with validity scales, large normative samples and extensive evidence linking scales to outcomes.",
    options: [
      "Method Y has broader evidence of reliability and validity, while Method X may be useful for specific purposes if validated indices and updated norms are used",
      "Method X is clearly superior for all purposes",
      "Neither method has any evidence of validity",
      "Self-report inventories are always invalid because people lie",
    ],
    answer: 0,
    explanation:
      "Reviews of the Rorschach (for example by Mihura and colleagues, which led to the R-PAS system) found good support for some indices, such as perceptual-thinking problems, but weak support for many others, and older norms over-pathologised normal people. Structured inventories such as the MMPI-2 or NEO have large norms and validity scales. So X is not better for all purposes, both have some evidence, and validity scales and research show that self-report is not always invalid.",
    ref: "Mihura et al. 2013, Psychol Bull; Garb et al. 2005",
  }),
  p({
    id: "per-assess-0254",
    topic: "personality-assessment",
    module: "assessment",
    exams: [N, M, S],
    difficulty: 2,
    type: "match",
    stem: "Match the strategy of test construction in List I with its description in List II.",
    lists: {
      left: ["A. Rational (theoretical)", "B. Empirical (criterion-keyed)", "C. Factor-analytic"],
      right: [
        "i. Items are grouped according to how they statistically cluster together",
        "ii. Items are written to match a theory's definition of a trait",
        "iii. Items are kept if they distinguish a criterion group from a comparison group",
      ],
    },
    options: [
      "A-iii, B-ii, C-i",
      "A-ii, B-iii, C-i",
      "A-ii, B-i, C-iii",
      "A-i, B-iii, C-ii",
    ],
    answer: 1,
    explanation:
      "In the rational approach the test author writes items that fit a theory, as in the Edwards Personal Preference Schedule based on Murray's needs (ii). In the empirical approach items are chosen only for their ability to separate groups, as in the MMPI and the Strong interest inventory (iii). In the factor-analytic approach items are grouped by their correlations, as in the 16PF and NEO (i). Many modern tests combine all three. The other codes swap these.",
    ref: "Anastasi & Urbina; Burisch 1984",
  }),
  p({
    id: "per-assess-0255",
    topic: "personality-assessment",
    module: "assessment",
    exams: [C, N, S],
    difficulty: 2,
    type: "mcq",
    stem: "The MMPI-2 has how many items?",
    options: [
      "16",
      "100",
      "567",
      "60",
    ],
    answer: 2,
    explanation:
      "The MMPI-2, a revision of the original MMPI with new US norms, has 567 true-false items, with the basic clinical and validity scales scored from the first 370. The shorter MMPI-2-RF has 338 items, and the newer MMPI-3 has 335. Sixty items describes the NEO-FFI. Sixteen is the number of 16PF primary factors. A hundred is not a standard MMPI length.",
    ref: "Butcher et al. 2001; Ben-Porath & Tellegen 2008",
  }),
  p({
    id: "per-assess-0256",
    topic: "personality-assessment",
    module: "assessment",
    exams: [N, M, S],
    difficulty: 2,
    type: "mcq",
    stem: "Which pairing of personality theory and assessment method is correct?",
    options: [
      "Rogers: repertory grid; Kelly: TAT; Murray: Q-sort; Cattell: MMPI",
      "Rogers: Rorschach; Kelly: MMPI; Murray: 16PF; Cattell: TAT",
      "Rogers: EPQ; Kelly: Q-sort; Murray: repertory grid; Cattell: NEO",
      "Rogers: Q-sort; Kelly: repertory grid; Murray: TAT; Cattell: 16PF",
    ],
    answer: 3,
    explanation:
      "Each theory led to a method that fitted its ideas: Rogers' focus on self-ideal congruence fitted the Q-sort, Kelly's constructs were measured by the repertory grid, Murray's needs by the TAT, and Cattell's source traits by the 16PF. Pairings that give Kelly the TAT, MMPI or Q-sort, or give Cattell the MMPI, TAT or NEO, swap each theorist's method.",
    ref: "Feist & Feist; Anastasi & Urbina",
  }),
  p({
    id: "per-assess-0257",
    topic: "personality-assessment",
    module: "assessment",
    exams: [N, M],
    difficulty: 3,
    type: "assertion-reason",
    stem: "Read the Assertion (A) and Reason (R) and choose the correct option.",
    statements: [
      "A: The MMPI was designed mainly to measure normal personality traits such as the Big Five.",
      "R: The original MMPI scales were built by comparing the answers of psychiatric patient groups with those of non-patients.",
    ],
    options: AR,
    answer: 3,
    explanation:
      "A is false and R is true. The MMPI was developed in the late 1930s and 1940s at the University of Minnesota hospitals to assist psychiatric diagnosis, with clinical scales such as hypochondriasis, depression and schizophrenia. R correctly describes its empirical construction, which is exactly why it is a clinical instrument rather than a measure of normal traits. Normal traits are better assessed with instruments such as the NEO-PI or 16PF.",
    ref: "Hathaway & McKinley 1943; Graham 2012",
  }),
  p({
    id: "per-assess-0258",
    topic: "personality-assessment",
    module: "assessment",
    exams: [N, M, S],
    difficulty: 3,
    type: "statement",
    stem: "Which statements about the Rorschach test are correct?",
    statements: [
      "A. It uses 10 inkblot cards, five with colour and five in black and grey.",
      "B. Exner's Comprehensive System and the later R-PAS standardised its administration and scoring.",
      "C. Responses are scored for location, determinants (such as form, colour and movement) and content.",
      "D. It was developed by Henry Murray.",
    ],
    options: [
      "A, B and C only",
      "A and D only",
      "B and D only",
      "A, B, C and D",
    ],
    answer: 0,
    explanation:
      "A: Hermann Rorschach's 10 cards include five achromatic and five with colour (two of them with red and black). B: Exner's system unified competing scoring methods, and R-PAS updated it with evidence-based indices and international norms. C: location (whole, detail), determinants and content are core scoring categories, alongside form quality and popular responses. D is wrong: Murray co-developed the TAT, not the Rorschach.",
    ref: "Rorschach 1921; Exner 2003; Meyer et al. 2011",
  }),
  p({
    id: "per-bio-0259",
    exams: [N, M],
    difficulty: 4,
    type: "statement",
    stem: "Which statements about biological and environmental influences on personality are consistent with current evidence?",
    statements: [
      "A. Most personality traits are moderately heritable, at about 40 to 50%.",
      "B. Shared family environment explains relatively little of the variation in adult traits.",
      "C. Life experiences such as entering a committed relationship or starting a first job are linked to modest trait changes.",
      "D. Because traits are heritable, they cannot change at all across adulthood.",
    ],
    options: [
      "A and D only",
      "A, B and C only",
      "B and D only",
      "A, B, C and D",
    ],
    answer: 1,
    explanation:
      "A and B come from twin and adoption studies. C reflects the 'social investment principle': taking on adult roles is linked to increases in conscientiousness and emotional stability. D is wrong: heritability does not mean fixity; traits show both rank-order stability and real mean-level change, and interventions such as therapy can shift traits like neuroticism.",
    ref: "Roberts, Wood & Smith 2005; Roberts et al. 2017, Psychol Bull",
  }),
  p({
    id: "per-bio-0260",
    exams: [N, M, S],
    difficulty: 3,
    type: "mcq",
    stem: "A meta-analysis by Roberts and colleagues of intervention studies found that clinical interventions such as psychotherapy were associated with:",
    options: [
      "Large increases in neuroticism as clients confronted painful material in therapy",
      "No change in any trait",
      "Meaningful decreases in neuroticism and smaller increases in extraversion that largely lasted",
      "Changes only in intelligence",
    ],
    answer: 2,
    explanation:
      "Across more than 200 studies, treatments (especially for anxiety and depression) were followed by a reduction in neuroticism of about half a standard deviation, and some increase in extraversion, often within about 24 weeks, with changes largely maintained. This suggests traits are more open to change than once thought, though it is debated how far this reflects real trait change or symptom relief. Therapy was linked to decreases, not large increases, in neuroticism; traits did change; and the changes were in personality, not intelligence.",
    ref: "Roberts et al. 2017, Psychol Bull",
  }),
  p({
    id: "per-assess-0261",
    topic: "personality-assessment",
    module: "assessment",
    exams: [N, M],
    difficulty: 3,
    type: "match",
    stem: "Match the MMPI-2 clinical scale number in List I with its name in List II.",
    lists: {
      left: ["A. Scale 1", "B. Scale 2", "C. Scale 4", "D. Scale 8"],
      right: ["i. Psychopathic deviate", "ii. Schizophrenia", "iii. Hypochondriasis", "iv. Depression"],
    },
    options: [
      "A-iii, B-iv, C-ii, D-i",
      "A-iv, B-iii, C-i, D-ii",
      "A-iii, B-i, C-iv, D-ii",
      "A-iii, B-iv, C-i, D-ii",
    ],
    answer: 3,
    explanation:
      "The 10 clinical scales are 1 Hypochondriasis (iii), 2 Depression (iv), 3 Hysteria, 4 Psychopathic deviate (i), 5 Masculinity-femininity, 6 Paranoia, 7 Psychasthenia, 8 Schizophrenia (ii), 9 Hypomania and 0 Social introversion. Clinicians usually refer to them by number because the original names are outdated, and they interpret code types such as 2-7. The other codes swap these.",
    ref: "Graham 2012; Butcher et al. 2001",
  }),
  p({
    id: "per-bio-0262",
    exams: [N, M],
    difficulty: 4,
    type: "passage",
    stem: "Which interpretation best fits the research findings?",
    passage:
      "In a longitudinal study, infants classified as highly reactive at 4 months are followed. At age 18, as a group, they show greater amygdala responses to unfamiliar faces and are more likely to describe themselves as cautious. Among high-reactive infants whose parents gently encouraged them to approach new situations, rather than overprotecting them, inhibition declined more by school age.",
    options: [
      "Temperament provides a biological starting point, but parenting and experience shape how it develops into personality",
      "Temperament is fixed and parenting has no effect",
      "Parenting alone creates temperament",
      "Amygdala responses are unrelated to temperament",
    ],
    answer: 0,
    explanation:
      "The persistence of amygdala reactivity into adulthood shows continuity of a biological tendency, while the effect of encouraging versus overprotective parenting shows that environment modifies it, an example of gene-environment interplay and 'goodness of fit'. Fixed temperament ignores the parenting effect. Parenting alone cannot explain the early-appearing reactivity. The amygdala findings directly link brain function to temperament.",
    ref: "Schwartz et al. 2003, Science; Rubin, Burgess & Hastings 2002",
  }),
];
