import type { LongQA } from "@/lib/prep/long-types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "personality-theories" as const;

export const PERSONALITY_THEORIES_L04: LongQA[] = anchored([
  {
    id: "pers-l04-001",
    subject: S,
    topic: "self-concept",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "What is the self concept? Trace its development and discuss major theories, including James, Cooley, Markus's self schemas and Higgins's self discrepancy theory.",
    plan: ["Definition", "William James: I and me", "Social origins: Cooley and Mead", "Development in childhood and adolescence", "Self schemas and possible selves", "Self discrepancy theory and Indian context"],
    answer: `## Definition
The self concept is a person's organised set of beliefs about who they are: their traits, roles, abilities, values, body and relationships. It answers the question "Who am I?" It differs from self esteem, which is the evaluation of oneself, and from self efficacy, belief in one's ability to do specific tasks.

## William James
In 1890 William James distinguished:
- The I: the self as knower, the subject of experience.
- The me: the self as known, the object of thought.
He divided the me into the material self, the body and possessions; the social self, the recognition we get from others, saying a person has as many social selves as there are groups whose opinion they care about; and the spiritual self, inner thoughts, values and dispositions.

## Social origins
- Charles Cooley in 1902 proposed the looking glass self: we come to see ourselves through how we imagine others see and judge us, and we feel pride or shame accordingly.
- George Herbert Mead described how children take the role of others, first specific people in play, then the generalised other, the attitudes of society, in organised games.
- In India, family, caste, religion and region are central in how children learn who they are.

## Development
- Infancy: at about 18 to 24 months, children recognise themselves in a mirror. In the rouge test, a mark is secretly placed on the child's nose; children of this age touch their own nose on seeing the reflection.
- Early childhood: self descriptions are concrete and physical: "I have a red cycle, I can run fast."
- Middle childhood: children describe traits and compare themselves with others: "I am good at maths but not at drawing."
- Adolescence: self descriptions become abstract and psychological, include contradictions, such as being shy with strangers but outgoing with friends, and identity questions become central, as Erikson described.
- Herbert Marsh and Richard Shavelson described the self concept as hierarchical and multidimensional, with academic, social, emotional and physical parts under a general self concept.

## Self schemas and possible selves
- Hazel Markus in 1977 proposed self schemas: cognitive generalisations about the self in particular domains. People who were schematic for independence processed independence related words faster, recalled more examples and resisted contrary information.
- Possible selves are ideas about what one might become, would like to become or is afraid of becoming, such as a future doctor or an unemployed graduate. They motivate behaviour and give meaning to current actions.

## Self discrepancy theory
E Tory Higgins in 1987 described three domains of the self:
1. Actual self: the attributes one believes one has.
2. Ideal self: the attributes one, or a significant other, hopes one would have.
3. Ought self: the attributes one, or a significant other, believes one should have as a duty.
Discrepancies produce different emotions:
| Discrepancy | Emotion |
| Actual versus ideal | Dejection: sadness, disappointment, depression |
| Actual versus ought | Agitation: anxiety, guilt, fear |
Experiments in which ideal or ought discrepancies were primed produced the predicted emotions.

## Indian context
In Indian families, ought selves shaped by parents, such as becoming an engineer or marrying within the community, can be strong, and failures can produce guilt and anxiety more than sadness. Research on Indian students links high parental expectations and perceived discrepancies with academic stress.

## Conclusion
The self concept is a social, developing and multidimensional structure. Schemas and possible selves shape how we process information and act, and discrepancies between selves explain different emotional vulnerabilities.`,
    keyPoints: ["Definition and difference from self esteem and efficacy", "James: I and me; material, social and spiritual selves", "Cooley's looking glass self and Mead's generalised other", "Development from mirror recognition to abstract adolescent self", "Hierarchical multidimensional self concept", "Markus's self schemas and possible selves", "Higgins's three selves and the emotions of discrepancy", "Indian context"],
    pitfalls: ["Confusing self concept and self esteem", "Mixing up ideal and ought discrepancies"],
    module: "personality-theories/3-4",
    visuals: [
      compare("Self discrepancy theory", ["Actual versus ideal", ["I am not who I hoped to be", "Loss of positive outcomes", "Sadness, disappointment"], "Dejection"], ["Actual versus ought", ["I am not who I should be", "Threat of punishment", "Anxiety, guilt"], "Agitation"]),
      chain("Development", [["Mirror recognition", "18 to 24 months"], ["Concrete self", "Early childhood"], ["Trait and comparison", "Middle childhood"], ["Abstract, contradictory self", "Adolescence"]]),
    ],
    ref: "James 1890; Cooley 1902; Mead 1934; Lewis and Brooks-Gunn 1979; Shavelson, Hubner and Stanton 1976; Harter 1999; Markus 1977; Markus and Nurius 1986; Higgins 1987; personality-theories module 3.4",
  },
  {
    id: "pers-l04-002",
    subject: S,
    topic: "self-concept",
    marks: 10,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "What is self esteem? Discuss its measurement, its functions according to sociometer and terror management theories, and the evidence about its benefits.",
    plan: ["Definition", "Measurement", "Theories of its function", "Evidence on benefits", "Healthy self esteem and alternatives"],
    answer: `## Definition
Self esteem is a person's overall evaluation of their own worth. William James expressed it as a ratio: self esteem equals success divided by pretensions, meaning it depends on achievements relative to aspirations. It can be global or domain specific, and trait or state.

## Measurement
- The Rosenberg Self Esteem Scale of 1965 has ten items, such as "On the whole, I am satisfied with myself", rated from strongly agree to strongly disagree. It is the most widely used measure and has been translated into many Indian languages.
- The Coopersmith Self Esteem Inventory is used with children.
- Implicit measures, such as the name letter effect, people's liking for letters in their own name, attempt to measure unconscious self esteem.

## Functions
- Sociometer theory: Mark Leary proposed in 1995 that self esteem is an internal gauge of how much we are accepted and valued by others. Low self esteem signals risk of rejection and motivates repair of relationships. Experiments show that rejection lowers state self esteem.
- Terror management theory: Jeff Greenberg, Sheldon Solomon and Tom Pyszczynski argued that awareness of death creates potential terror, which people manage by believing they are valuable members of a meaningful cultural world. Reminders of death lead people to defend their cultural worldview and boost self esteem.

## Evidence on benefits
Roy Baumeister and colleagues reviewed the research in 2003 and found:
- High self esteem is linked to happiness and initiative, and lower risk of depression.
- It does not cause better school performance; good performance raises self esteem more than the reverse.
- It does not prevent smoking, drinking or early sex in adolescents.
- Programmes that simply boost self esteem have little effect on achievement.
- Very high, unstable or narcissistic self esteem is linked to aggression when threatened.
Longitudinal studies by Ulrich Orth suggest that low self esteem is a risk factor for later depression.

## Healthy self esteem
- Jennifer Crocker found that self worth contingent on approval or academic success is fragile and stressful.
- Kristin Neff proposed self compassion, kindness to oneself in failure, as a healthier alternative, linked to resilience without the costs of ego defence.
- In collectivist cultures, collective self esteem, pride in one's groups, and family honour may matter more than individual self esteem.

## Conclusion
Self esteem reflects acceptance and meaning, contributes to happiness, but is not a cure all. Stable, non contingent self worth and self compassion are more valuable than inflated self esteem.`,
    keyPoints: ["Definition and James's ratio", "Rosenberg scale and other measures", "Sociometer theory", "Terror management theory", "Baumeister 2003 review findings", "Low self esteem as a risk for depression", "Contingent self worth, self compassion, collective self esteem"],
    pitfalls: ["Claiming self esteem causes achievement", "No theories"],
    module: "personality-theories/3-4",
    visuals: [compare("Functions", ["Sociometer theory", ["Self esteem gauges acceptance", "Rejection lowers it", "Motivates repairing ties"], "Belonging"], ["Terror management theory", ["Death awareness causes terror", "Worldview and self esteem buffer it", "Death reminders increase defence"], "Meaning"])],
    ref: "James 1890; Rosenberg 1965; Leary et al 1995; Greenberg, Pyszczynski and Solomon 1986; Baumeister et al 2003; Orth and Robins 2014; Crocker and Wolfe 2001; Neff 2003; personality-theories module 3.4",
  },
  {
    id: "pers-l04-003",
    subject: S,
    topic: "explanatory-style",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Describe the theory of learned helplessness and its reformulation in terms of explanatory style. Discuss the evidence linking explanatory style to depression, health and achievement, and its applications.",
    plan: ["Original learned helplessness experiments", "Human studies and problems", "Reformulated theory: three dimensions", "Hopelessness theory and measurement", "Evidence and applications", "Later revision and evaluation"],
    answer: `## Original experiments
In 1967 Martin Seligman and Steven Maier used a triadic design with dogs:
1. One group received escapable shocks that they could stop by pressing a panel.
2. A yoked group received identical shocks that they could not control.
3. A control group received no shocks.
Later, in a shuttle box where they could escape shock by jumping a barrier, the first and third groups learned quickly, but most dogs from the inescapable group lay down and whined, failing to escape. Seligman called this learned helplessness: after experiencing uncontrollable events, animals learn that responses and outcomes are independent, leading to motivational, cognitive and emotional deficits.

## Human studies
Donald Hiroto found in 1974 that students exposed to inescapable noise later failed to escape noise in a new task. The parallels with depression, passivity, sadness and negative thinking, led Seligman to propose learned helplessness as a model of depression. However, not all people became helpless, and the theory did not explain the low self esteem and self blame of depression.

## The reformulated theory
In 1978 Lyn Abramson, Seligman and John Teasdale argued that what matters is how people explain uncontrollable bad events. Three dimensions of attribution:
| Dimension | Pessimistic explanation | Optimistic explanation |
| Internal versus external | It is my fault | It was the circumstances |
| Stable versus unstable | It will always be this way | It was a one time event |
| Global versus specific | It ruins everything | It affects only this area |
A student who fails a test and thinks "I am stupid, I will always fail, I am useless at everything" has a pessimistic explanatory style and is at risk of depression. One who thinks "That paper was unusually tough, and I did not study enough for this subject" is protected.
- Internal attributions affect self esteem.
- Stable attributions affect how long helplessness lasts.
- Global attributions affect how widely it spreads.

## Hopelessness theory and measurement
Abramson, Gerald Metalsky and Lauren Alloy in 1989 proposed the hopelessness theory: stable, global attributions for negative events lead to hopelessness, which causes a subtype of depression, hopelessness depression.
Measurement:
- The Attributional Style Questionnaire presents hypothetical good and bad events and asks for the main cause, rated on the three dimensions.
- The CAVE technique, content analysis of verbatim explanations, codes explanations from diaries, interviews or speeches, allowing study of historical figures.

## Evidence
- Depression: pessimistic style predicts later depressive symptoms after negative events, especially in children and students, as in the Temple Wisconsin cognitive vulnerability to depression project.
- Health: Christopher Peterson, Seligman and George Vaillant coded essays written by Harvard graduates at age 25; those with a pessimistic style had poorer health between ages 45 and 60.
- Achievement: Seligman found that insurance salesmen with optimistic styles sold more and stayed in the job longer, and optimistic swimmers recovered better after being given false feedback of a poor time.
- Politics: CAVE analyses of election speeches found that more optimistic candidates often won.

## Applications
- Cognitive therapy for depression teaches people to question pessimistic explanations.
- The Penn Resiliency Program teaches school students to identify and dispute pessimistic thoughts, with modest preventive effects on depression.
- Learned optimism training in workplaces and sports.

## Later revision
In 2016 Maier and Seligman revised the original theory using neuroscience: passivity in response to prolonged aversive events is the default, unlearned reaction, driven by the dorsal raphe nucleus; what is learned is control, detected by the medial prefrontal cortex, which inhibits that response. Thus learned helplessness is really failure to learn control.

## Evaluation
Strengths: a strong experimental basis, clear measures and practical applications. Weaknesses: animal studies raise ethical concerns; associations with depression are moderate; attributions are one of many causes; in cultures where external and fate attributions are common, as in India, such attributions may not carry the same risk.

## Conclusion
Learned helplessness began as an animal finding and became a theory of how explanations for bad events shape mood, health and achievement. Explanatory style can be changed, which is the basis of learned optimism.`,
    keyPoints: ["Triadic design with dogs and shuttle box", "Hiroto's human studies", "Reformulation 1978: internal, stable, global", "Worked example of pessimistic and optimistic explanations", "Hopelessness theory 1989", "ASQ and CAVE measurement", "Evidence for depression, health, achievement", "Applications and Maier and Seligman 2016 revision"],
    pitfalls: ["Confusing stable and global", "Missing the reformulation"],
    module: "personality-theories/3-5",
    visuals: [
      chain("Original experiments", [["Inescapable shock", "Yoked group"], ["Learns no control", "Responses do not matter"], ["Shuttle box test", "Escape is possible"], ["Fails to escape", "Learned helplessness"]]),
      vis("sort", { prompt: "Sort each explanation for failing a test.", buckets: ["Pessimistic style", "Optimistic style"], items: [{ text: "I am stupid and always will be", bucket: 0 }, { text: "The paper was unusually tough this time", bucket: 1 }, { text: "I am useless at everything", bucket: 0 }, { text: "I did not revise this one chapter", bucket: 1 }] }, "The reformulated theory"),
    ],
    ref: "Seligman and Maier 1967; Overmier and Seligman 1967; Hiroto 1974; Abramson, Seligman and Teasdale 1978; Abramson, Metalsky and Alloy 1989; Peterson et al 1982 ASQ; Peterson, Seligman and Vaillant 1988; Seligman and Schulman 1986; Maier and Seligman 2016; personality-theories module 3.5",
  },
  {
    id: "pers-l04-004",
    subject: S,
    topic: "personality-assessment",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Describe and evaluate the major methods of personality assessment, including interviews, self report inventories, projective techniques, behavioural assessment and newer methods. Comment on issues in using them in India.",
    plan: ["Purposes and criteria", "Interviews", "Self report inventories and their construction", "Projective techniques", "Behavioural, situational and physiological methods", "Newer methods and Indian issues"],
    answer: `## Purposes and criteria
Personality is assessed for clinical diagnosis and treatment planning, selection and career counselling, research and legal decisions. A good method must be reliable, valid for its purpose, standardised with norms for the population, practical and fair.

## Interviews
- Unstructured interviews are flexible and build rapport but have low reliability and are influenced by the interviewer's biases.
- Structured interviews, such as the Structured Clinical Interview for personality disorders or the International Personality Disorder Examination, ask set questions in set order with scoring rules, improving reliability.
- The mental status examination and case history are central in clinical settings.

## Self report inventories
People answer questions about themselves, usually true or false or on rating scales. Three approaches to construction:
| Approach | Method | Example |
| Rational or theoretical | Items written to reflect a theory | Myers Briggs Type Indicator, Edwards Personal Preference Schedule based on Murray's needs |
| Empirical criterion keying | Items kept if they distinguish criterion groups, whatever their content | MMPI, California Psychological Inventory |
| Factor analytic | Items grouped by correlations | 16PF, EPQ, NEO PI R |
Modern tests combine approaches.
Strengths: objective scoring, norms, efficiency, good reliability and validity for many scales.
Weaknesses: response sets, such as social desirability, acquiescence and extreme responding; deliberate faking good or bad; dependence on self insight and reading ability. Validity scales, such as the lie scale of the EPQ or the F and K scales of the MMPI, detect some distortions. Forced choice formats reduce faking.

## Projective techniques
Based on the projective hypothesis, described by Lawrence Frank in 1939, that people project their needs and conflicts onto ambiguous stimuli:
- Rorschach inkblot test: ten inkblots.
- Thematic Apperception Test: stories about ambiguous pictures.
- Sentence completion tests, such as Rotter's Incomplete Sentences Blank.
- Drawing tests: Draw a Person, House Tree Person.
- Children's Apperception Test with animal figures.
Strengths: hard to fake in obvious ways, rich qualitative data, useful for building rapport, especially with children.
Weaknesses: scoring and interpretation vary, many scores have weak reliability and validity, norms are often poor. The Rorschach's Comprehensive System and the newer R PAS improved standardisation, and some indices, such as those for thought disorder, are well supported.

## Behavioural assessment
- Direct observation in natural or analogue settings, with clear behavioural definitions and recording methods such as frequency or interval recording.
- Self monitoring diaries, such as recording panic attacks and their triggers.
- Functional analysis: antecedents, behaviour and consequences.
- Rating scales completed by parents, teachers or partners.
Strengths: close to real behaviour, useful for treatment planning. Weaknesses: reactivity, the presence of an observer changing behaviour; observer bias; cost.

## Situational and physiological methods
- Situational tests: during the Second World War, the American Office of Strategic Services observed candidates in stressful tasks. Assessment centres for managers use group discussions and in basket exercises, and similar methods are used in Indian defence officer selection at the Services Selection Board.
- Physiological measures, such as heart rate, skin conductance and cortisol, assess emotional reactivity.

## Newer methods
- Implicit measures, such as the Implicit Association Test, assess automatic associations, though their predictive validity is limited.
- Experience sampling with smartphone prompts captures behaviour and mood in daily life.
- Informant and multi rater reports.
- Digital footprints: studies have shown that social media likes predict personality scores moderately, raising privacy issues.
- Computerised adaptive testing.

## Issues in India
- Many tests are Western and need translation, adaptation and local norms. Indian adaptations include the Multiphasic Personality Questionnaire, an Indian version of the MMPI developed at NIMHANS, and Indian versions of the 16PF, EPQ and NEO.
- Linguistic diversity: a test valid in English may not be valid in Odia or Kannada without careful back translation.
- Literacy limits self report use in rural areas; pictorial or interview based methods may be needed.
- Social desirability may be higher, and family members may want to answer for the person.
- Ethical issues: informed consent, confidentiality, avoiding labelling, and competence as required by the RCI.

## Conclusion
No single method is enough. Good assessment combines interviews, validated inventories, behavioural data and, cautiously, projective methods, adapted to the person's culture and purpose.`,
    keyPoints: ["Purposes and quality criteria", "Unstructured versus structured interviews", "Three approaches to inventory construction with examples", "Response sets, faking and validity scales", "Projective hypothesis and main projective tests with evaluation", "Behavioural assessment and functional analysis", "Situational, physiological and newer methods", "Indian adaptation issues and ethics"],
    pitfalls: ["Listing tests without evaluation", "Ignoring Indian adaptation"],
    module: "assessment/2-3",
    visuals: [
      tree("Self report inventories", [["Inventory construction", "Three approaches", -1], ["Rational", "MBTI, EPPS", 0], ["Empirical criterion keying", "MMPI, CPI", 0], ["Factor analytic", "16PF, EPQ, NEO", 0]]),
      compare("Projective techniques", ["Self report inventories", ["Objective scoring", "Good norms", "Open to faking"], "Structured"], ["Projective techniques", ["Ambiguous stimuli", "Rich data, harder to fake", "Weaker reliability"], "Unstructured"]),
    ],
    ref: "Frank 1939; Hathaway and McKinley 1943; Cattell 16PF; Eysenck EPQ; Costa and McCrae NEO; Exner 1974; Meyer et al 2011 R-PAS; OSS 1948; Kosinski, Stillwell and Graepel 2013; Murthy MPQ (NIMHANS); assessment module 2.3 and 3.4",
  },
  {
    id: "pers-l04-005",
    subject: S,
    topic: "personality-assessment",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "md-psychiatry", "ma-semester"],
    question: "Describe the development, structure and interpretation of the MMPI and its revisions. Evaluate its strengths and limitations.",
    plan: ["Development by empirical keying", "Clinical and validity scales", "MMPI 2 and interpretation", "Restructured forms", "Indian versions", "Evaluation"],
    answer: `## Development
Starke Hathaway, a psychologist, and J Charnley McKinley, a psychiatrist, at the University of Minnesota published the Minnesota Multiphasic Personality Inventory in 1943. They wrote about 1,000 statements, reduced them to 504, and gave them to psychiatric patients with known diagnoses and to normal adults, mainly visitors to the hospital. Items were kept for a scale if they distinguished a diagnostic group from normals, whatever their content. This method is empirical criterion keying. An item such as "I prefer a shower to a bath" could end up on a scale if patients answered it differently.

## Scales
The original test had 550 true or false items.
Ten clinical scales:
| Number | Scale |
| 1 | Hypochondriasis |
| 2 | Depression |
| 3 | Hysteria |
| 4 | Psychopathic deviate |
| 5 | Masculinity femininity |
| 6 | Paranoia |
| 7 | Psychasthenia, anxiety and obsessiveness |
| 8 | Schizophrenia |
| 9 | Hypomania |
| 0 | Social introversion |
Validity scales:
- Cannot say: number of items left unanswered.
- L, lie: naive attempts to look good.
- F, infrequency: rare responses, suggesting random answering, exaggeration or severe disturbance.
- K, correction: subtle defensiveness, used to correct some clinical scales.

## MMPI 2 and interpretation
The MMPI 2, published in 1989, has 567 items, rewritten outdated items and new norms from about 2,600 adults chosen to match the American census. It added content scales, such as anxiety and family problems, supplementary scales, such as for addiction, and more validity scales, such as variable response inconsistency, true response inconsistency and back F.
- Scores are converted to T scores with a mean of 50 and standard deviation of 10. T scores of 65 or above are considered clinically significant.
- Interpretation uses validity first, then profiles and code types, the two or three highest clinical scales. For example, a 2 7 code type suggests anxious depression; a 4 9 code suggests impulsivity and antisocial behaviour.
- The MMPI A, with 478 items, is for adolescents.

## Restructured forms
Clinical scales were heterogeneous and highly correlated because they shared a general distress factor. Auke Tellegen and colleagues extracted a demoralisation scale and created Restructured Clinical scales in 2003. The MMPI 2 RF, published in 2008 with 338 items, uses these with higher order and specific problem scales. The MMPI 3, released in 2020 with 335 items and new norms, updates the restructured approach.

## Indian versions
The Multiphasic Personality Questionnaire, developed by H N Murthy at NIMHANS, is an Indian adaptation of the MMPI, with shorter length and Indian norms. Translations of the MMPI 2 have also been used in research, but cultural and linguistic adaptation remains important, since some items about religion or family may be answered differently in India.

## Using the profile: an example
A 40 year old man seeking disability benefits after a back injury produces very high F and very low K scores with elevations on almost every clinical scale. Before interpreting the clinical scales, the psychologist considers over reporting, checks the inconsistency scales and looks for other evidence, since such a profile may reflect exaggeration rather than genuine widespread disorder.

## Evaluation
Strengths:
- One of the most researched psychological tests, with thousands of studies.
- Validity scales detect careless, exaggerated and defensive responding, important in forensic and disability assessments.
- Useful in clinical diagnosis, treatment planning and personnel screening for high risk jobs.
Weaknesses:
- Long and tiring.
- Original scale names reflect outdated diagnostic categories.
- Empirical keying produced overlapping, heterogeneous scales, partly corrected in the restructured forms.
- Norms are American; cultural differences can produce elevations, so local norms are needed.
- Requires reading ability and training to interpret.

## Conclusion
The MMPI pioneered empirical test construction and validity checking. Its revisions keep it the most widely used objective personality test in clinical settings, but it must be interpreted with care across cultures.`,
    keyPoints: ["Hathaway and McKinley 1943, empirical criterion keying", "Ten clinical scales", "Validity scales L, F, K and cannot say", "MMPI 2: 567 items, new norms, T score 65", "Code type interpretation", "MMPI A, MMPI 2 RF and MMPI 3; restructured scales and demoralisation", "Indian MPQ", "Evaluation"],
    pitfalls: ["Saying items were chosen by content", "Wrong T score cut off"],
    module: "assessment/2-3",
    visuals: [chain("Development", [["About 1,000 statements", "Collected from many sources"], ["Give to patients and normals", "Known groups"], ["Keep items that discriminate", "Whatever their content"], ["Clinical scales", "Ten in the original"], ["Revisions", "MMPI 2, 2 RF, 3"]])],
    ref: "Hathaway and McKinley 1943; Butcher et al 1989 MMPI-2; Tellegen et al 2003 RC scales; Ben-Porath and Tellegen 2008 MMPI-2-RF; MMPI-3 2020; Murthy H N MPQ, NIMHANS; assessment module 2.3",
  },
  {
    id: "pers-l04-006",
    subject: S,
    topic: "personality-assessment",
    marks: 15,
    difficulty: 3,
    exams: ["mcp-entrance", "ma-semester", "cuet-pg"],
    question: "Critically evaluate projective techniques of personality assessment, with special reference to the Rorschach and the Thematic Apperception Test.",
    plan: ["Projective hypothesis", "Rorschach: test and scoring", "TAT: test and interpretation", "Other projective tests", "Evidence and criticism", "Use in India and good practice"],
    answer: `## The projective hypothesis
Projective techniques present ambiguous stimuli and ask the person to respond freely. Lawrence Frank in 1939 proposed that, because the stimuli have no fixed meaning, the responses reveal the person's own needs, conflicts and ways of perceiving. The idea draws on Freud's concept of projection.

## The Rorschach
Hermann Rorschach, a Swiss psychiatrist, published his test in 1921, a year before his death. It has ten cards: five black and grey, two black and red, and three multicoloured.
Administration:
1. Response phase: the person says what each card might be.
2. Inquiry phase: the examiner asks where they saw it and what made it look so.
Scoring includes:
- Location: the whole blot, a common detail or an unusual detail.
- Determinants: form, colour, shading or movement, for example human movement suggesting imagination.
- Content: human, animal, anatomy and so on.
- Form quality: how well the response fits the blot, an index of reality testing.
- Popular responses, such as a bat or butterfly on card V.
John Exner's Comprehensive System of 1974 brought standard administration, scoring and norms. The Rorschach Performance Assessment System, published in 2011, refined it using the best supported variables.

## The TAT
Henry Murray and Christiana Morgan developed the Thematic Apperception Test in 1935. It has 31 cards, including one blank, showing ambiguous scenes; examiners usually select 8 to 12. The person tells a story for each, describing what led up to the scene, what is happening, what the characters feel and think, and how it ends.
Interpretation looks at the hero with whom the person identifies, the hero's needs, the press from the environment, themes and outcomes. Murray's needs and press scheme, Leopold Bellak's approach and scoring systems for achievement, affiliation and power motives are used. The Children's Apperception Test uses animal figures. Indian adaptations, such as Uma Chaudhury's, use Indian dress and settings.

## Other projective tests
- Sentence completion, such as "My mother...".
- Draw a Person, House Tree Person and Kinetic Family Drawing.
- Word association.
- The Rosenzweig Picture Frustration Study.

## Evidence and criticism
Criticisms:
- Reliability: scoring of many variables, especially in the TAT, differs between examiners.
- Validity: many interpretations lack support; studies by James Wood, Scott Lilienfeld and others found that some Rorschach indices overpathologise normal people, especially from minority groups.
- Norms: older Exner norms made normal adults appear disturbed; newer international norms corrected this.
- Incremental validity: projective tests often add little beyond interviews and inventories.
- Drawing tests have particularly weak validity for personality and abuse.
Supportive evidence:
- Meta analyses by Joni Mihura and colleagues in 2013 found good validity for some Rorschach variables, especially those assessing thought disorder, perceptual accuracy and cognitive complexity.
- TAT based implicit motive scores predict long term behavioural outcomes, such as career success, better than self reported motives, as David McClelland argued.
- Projective tests can reveal information people cannot or will not report.

## Good practice
- Use well supported scoring systems, not intuition.
- Combine with interviews and objective tests.
- Use local norms and adapted materials.
- Be cautious in high stakes decisions, such as custody or criminal cases.
In India, the Rorschach and TAT are still widely taught and used in clinical psychology training and hospitals, so knowing their strengths and limits is essential.

## Conclusion
Projective techniques give rich, idiographic information and some indices have good support, but many interpretations do not. They are best used as structured tools within a multi method assessment.`,
    keyPoints: ["Projective hypothesis, Frank 1939", "Rorschach 1921: ten cards, response and inquiry", "Scoring: location, determinants, content, form quality, populars", "Exner Comprehensive System and R PAS", "TAT: 31 cards, stories, hero, needs, press", "Other projective tests", "Criticisms: reliability, validity, norms", "Supportive evidence and good practice"],
    pitfalls: ["All praise or all criticism", "Missing scoring categories"],
    module: "assessment/2-4",
    visuals: [
      layers("The Rorschach", "stack", [["Location", "Whole, common detail or unusual detail"], ["Determinants", "Form, colour, shading, movement"], ["Content", "Human, animal, anatomy"], ["Form quality", "Fit to the blot, reality testing"], ["Popular responses", "Common answers such as a bat"]]),
      compare("Evidence and criticism", ["Well supported", ["Thought disorder indices", "Perceptual accuracy", "Implicit motives from TAT stories"], "Use with confidence"], ["Weakly supported", ["Many intuitive interpretations", "Drawing tests for abuse", "Old norms that overpathologise"], "Use with caution"]),
    ],
    ref: "Frank 1939; Rorschach 1921; Exner 1974; Meyer et al 2011 R-PAS; Morgan and Murray 1935; Bellak 1954; Wood, Nezworski, Lilienfeld and Garb 2003; Mihura et al 2013; McClelland, Koestner and Weinberger 1989; Chaudhury 1960; assessment module 2.4",
  },
  {
    id: "pers-l04-007",
    subject: S,
    topic: "personality-assessment",
    marks: 5,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Write a short note on the Q sort technique.",
    plan: ["Origin", "Procedure", "Uses", "Evaluation"],
    answer: `## Origin
The Q sort was introduced by William Stephenson in the 1930s as a way of studying a single person's viewpoint systematically. Carl Rogers and Rosalind Dymond used it in the 1950s to study changes in the self concept during therapy, and Jack Block developed the California Q set.

## Procedure
1. The person is given a set of cards, each with a statement, such as "I am a hard worker" or "I often feel insecure".
2. They sort the cards into piles from "most like me" to "least like me", usually nine piles.
3. The number of cards in each pile is fixed so that the distribution is roughly normal, with few cards at the extremes and many in the middle. This forced distribution prevents everyone from piling cards in the favourable end.
4. The sort can be repeated for different instructions, such as the actual self and the ideal self.
5. Correlations between sorts are calculated.

## Uses
- Rogers found that the correlation between actual and ideal self sorts was low at the start of therapy and rose after successful therapy, showing increased congruence.
- Block's California Q set of 100 items is sorted by observers to describe a person, and has been used in longitudinal studies of ego resiliency and ego control from childhood to adulthood.
- Q methodology in social research identifies groups of people who share viewpoints.

## Evaluation
Strengths: the forced distribution reduces response biases, and it combines idiographic study of one person with quantitative analysis. Limitations: forced distributions may not fit every person's reality, sorting is time consuming, and the item set limits what can be described.

## Conclusion
The Q sort is a flexible method for measuring self concept and personality descriptions with numbers.`,
    keyPoints: ["Stephenson's origin", "Card sorting into piles", "Forced quasi normal distribution", "Actual and ideal self sorts", "Rogers' therapy findings", "Block's California Q set", "Strengths and limitations"],
    pitfalls: ["Calling it a questionnaire with free ratings"],
    module: "personality-theories/2-2",
    visuals: [chain("Procedure", [["Statement cards", "About the self"], ["Sort into piles", "Most to least like me"], ["Forced distribution", "Few at the extremes"], ["Repeat for ideal self", "Second sort"], ["Correlate sorts", "Self ideal congruence"]])],
    ref: "Stephenson 1935, 1953; Rogers and Dymond 1954; Block 1961 California Q-set; Block and Block 1980; personality-theories module 2.2",
  },
  {
    id: "pers-l04-008",
    subject: S,
    topic: "person-situation",
    marks: 10,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "How stable is personality across the life span? Discuss evidence on rank order stability, mean level change and the causes of change.",
    plan: ["Kinds of stability", "Rank order stability", "Mean level change: the maturity principle", "Causes of change", "Can personality be changed deliberately"],
    answer: `## Kinds of stability
Stability can mean different things:
- Rank order stability: whether people keep their positions relative to others over time.
- Mean level change: whether the average level of a trait in a population rises or falls with age.
- Individual differences in change: whether some people change more than others.
- Structural stability: whether the same traits go together at different ages.

## Rank order stability
Brent Roberts and Wendy DelVecchio's meta analysis in 2000 of 152 longitudinal studies found that test retest correlations, over about seven years, rose with age:
| Age | Approximate stability |
| Childhood | 0.31 |
| College years | 0.54 |
| Around 30 | 0.64 |
| 50 to 70 | 0.74 |
Personality becomes more stable with age but never fully fixed, against William James's claim that character is set like plaster by 30. In the Dunedin study in New Zealand, Avshalom Caspi found that temperament observed at age 3 predicted personality and outcomes such as crime and health at 26 and beyond.

## Mean level change
Roberts, Kate Walton and Wolfgang Viechtbauer's meta analysis in 2006 found:
- Conscientiousness, agreeableness and emotional stability increase from adolescence to middle age and later.
- Social dominance, part of extraversion, increases mainly in young adulthood.
- Social vitality and openness rise in adolescence and decline in old age.
This is called the maturity principle: people become more responsible, warm and calm as they age. Adolescence is often a dip in conscientiousness and agreeableness.

## Causes of change
- Social investment theory: taking on adult roles, such as a first job, marriage or parenthood, brings expectations that reward responsibility and warmth.
- Life events: a stable relationship can lower neuroticism, while unemployment can lower conscientiousness.
- Biological maturation and genes contribute to both stability and change.
- Culture: the maturity pattern appears in many countries, with earlier maturity in cultures where adult roles start earlier.

## Deliberate change
- A meta analysis by Roberts and colleagues in 2017 of 207 studies found that clinical interventions produced moderate changes in traits, especially increased emotional stability, within about 24 weeks, and the changes lasted.
- Nathan Hudson and Chris Fraley found that people who wished to change a trait and set concrete goals showed small changes over months.

## Conclusion
Personality is both stable and changeable: rank order consistency grows with age, average levels mature, and roles, events and interventions can produce real change.`,
    keyPoints: ["Rank order, mean level, individual and structural stability", "Roberts and DelVecchio 2000: stability rises with age", "Dunedin study", "Plaster hypothesis rejected", "Maturity principle from 2006 meta analysis", "Social investment theory and life events", "Interventions change traits, especially neuroticism"],
    pitfalls: ["Saying personality is fixed after 30", "Confusing rank order and mean level"],
    module: "personality-theories/2-1",
    visuals: [vis("experiment", { title: "Rank order stability", question: "Average rank order stability of personality over about seven years", unit: "", max: 1, conditions: [{ label: "Childhood", value: 0.31 }, { label: "College", value: 0.54 }, { label: "Around 30", value: 0.64 }, { label: "50 to 70", value: 0.74 }], why: "Stability increases across the life span but never reaches 1." })],
    ref: "Roberts and DelVecchio 2000; Roberts, Walton and Viechtbauer 2006; Caspi et al 2003 Dunedin; Roberts and Wood 2006 social investment; Roberts et al 2017 intervention meta-analysis; Hudson and Fraley 2015; personality-theories module 2.1",
  },
  {
    id: "pers-l04-009",
    subject: S,
    topic: "big-five",
    marks: 10,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Is the five factor model universal? Discuss cross cultural research on personality structure, including Indian studies and the limits of exporting Western measures.",
    plan: ["Etic and emic approaches", "Evidence for universality", "Failures and additional factors", "Indian studies", "Cautions"],
    answer: `## Etic and emic approaches
Cross cultural research uses two approaches:
- Etic: taking a measure developed in one culture, translating it and testing whether the same structure appears elsewhere.
- Emic or indigenous: starting from a culture's own language and concepts, then comparing.
The Big Five has been tested both ways.

## Evidence for universality
- Robert McCrae and colleagues gave translated NEO PI R measures in dozens of cultures and found the five factor structure in most, including India, China, Zimbabwe and Peru.
- In 2005 McCrae, Antonio Terracciano and others collected observer ratings of college aged and adult targets in 50 cultures and again found the five factors.
- David Schmitt and colleagues, using the Big Five Inventory in 56 nations, found the structure in most, with weaker fit in parts of Africa and East Asia.
- Age differences and sex differences, such as women scoring somewhat higher on neuroticism and agreeableness, are broadly similar across cultures.

## Failures and additions
- Among the Tsimane, a forager horticulturalist group in Bolivia, Michael Gurven and colleagues in 2013 found only two broad factors resembling prosociality and industriousness. In small scale societies with limited literacy, item wording and response styles may not work, and social niches may be fewer.
- Indigenous lexical studies sometimes find a sixth factor, honesty humility, or factors not captured well, such as interpersonal relatedness in the Chinese Personality Assessment Inventory developed by Fanny Cheung, which includes harmony and face.
- Country averages on traits often do not match national stereotypes; Terracciano found that perceptions of national character are unfounded.

## Indian studies
- Translated Big Five measures in Hindi and other languages have generally replicated the structure in urban educated samples, with some weaker items.
- Indian researchers have argued for including culturally salient dimensions, such as the gunas, relational harmony and spirituality.
- Response styles such as acquiescence and social desirability can be higher in some Indian samples, affecting scores.

## Cautions
- Translation must be checked by back translation and testing measurement invariance before comparing means across groups.
- Student samples do not represent whole countries.
- A universal structure does not mean that traits have the same meaning or importance everywhere.

## Conclusion
The five factors replicate widely, especially in literate, urban samples, supporting a broad universality, but indigenous research shows additional dimensions and limits in small scale societies.`,
    keyPoints: ["Etic versus emic approaches", "McCrae's cross cultural NEO studies and 50 culture observer ratings", "Schmitt's 56 nations", "Tsimane two factor finding", "Indigenous factors: honesty humility, interpersonal relatedness", "National stereotypes not supported", "Indian replications and proposals", "Measurement invariance cautions"],
    pitfalls: ["Saying the Big Five is found everywhere without exception"],
    module: "personality-theories/1-4",
    visuals: [compare("Evidence for universality", ["Supports universality", ["Replicated in most of 50 cultures", "Observer ratings agree", "Similar age and sex patterns"], "Broadly universal"], ["Limits", ["Two factors among the Tsimane", "Extra indigenous factors", "Translation and response styles"], "Not fully universal"])],
    ref: "McCrae and Costa 1997; McCrae, Terracciano et al 2005; Schmitt et al 2007; Gurven et al 2013; Cheung et al 1996, 2001 CPAI; Terracciano et al 2005 national character; personality-theories module 1.4",
  },
  {
    id: "pers-l04-010",
    subject: S,
    topic: "trait-theories",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Compare the major approaches to personality: psychodynamic, trait, humanistic, social cognitive and biological. How might they be integrated?",
    plan: ["Why many approaches", "Each approach in brief", "Comparison on key issues", "A case seen through each lens", "Integration: McAdams's levels"],
    answer: `## Why many approaches
Personality is complex, and each major approach answers different questions: what people are like, why they behave as they do, how they develop and how they change. Comparing them helps choose the right tool for a purpose.

## The approaches in brief
1. Psychodynamic: personality arises from unconscious conflicts between drives and defences, shaped in early childhood. Freud, Jung, Adler, object relations theorists.
2. Trait: personality is a set of stable dispositions that can be measured and compared. Allport, Cattell, Eysenck, the Big Five.
3. Humanistic and existential: people are free, growth oriented beings; personality reflects the self concept and the search for meaning. Rogers, Maslow, May, Frankl.
4. Social cognitive: personality reflects learned expectations, beliefs, goals and self regulation in interaction with situations. Bandura, Rotter, Mischel, Kelly.
5. Biological: personality reflects genes, brain systems and evolution. Eysenck, Gray, Cloninger, behaviour genetics.

## Comparison on key issues
| Issue | Psychodynamic | Trait | Humanistic | Social cognitive | Biological |
| View of human nature | Driven by conflict | Neutral | Good, growth seeking | Agentic, learning | Evolved organism |
| Main causes | Unconscious, childhood | Dispositions | Self concept, choice | Beliefs and environment | Genes and brain |
| Free will | Limited | Not addressed | Central | Self regulation | Limited |
| Consistency | Deep patterns | High | Changing self | Situation specific patterns | High |
| Main methods | Case studies, free association | Questionnaires, factor analysis | Interviews, Q sort | Experiments | Twin studies, imaging |
| Testability | Low | High | Low to moderate | High | High |
| Therapy | Psychoanalysis, psychodynamic | Few direct | Person centred | CBT, modelling | Medication |

## A case seen through each lens
Rohit, 22, is shy, avoids speaking in class and feels anxious at parties.
- Psychodynamic: early harsh criticism by his father created anxiety and avoidance; he may displace anger inward.
- Trait: he is high in neuroticism and low in extraversion, both partly heritable.
- Humanistic: conditions of worth made him feel acceptable only if perfect, so he hides his true self.
- Social cognitive: low self efficacy for speaking up, learned from few successful experiences, is maintained by avoidance.
- Biological: a sensitive behavioural inhibition system and strong amygdala responses make social threat feel larger.
Each explanation suggests a different, and often complementary, intervention.

## Strengths and weaknesses
- Psychodynamic theories capture the depth and irrationality of human life and the importance of early relationships, but many claims are hard to test.
- Trait theories are the most empirically supported for description and prediction, but they describe rather than explain and say little about change.
- Humanistic theories respect subjective experience and freedom and shaped counselling, but their concepts are vague.
- Social cognitive theories are experimentally grounded and practical, but can neglect biology and deep emotion.
- Biological theories connect personality with brain and genes, but risk reducing persons to mechanisms and often ignore culture.

## Integration
- Dan McAdams proposed three levels of personality:
1. Dispositional traits: broad, stable, comparable across people, such as the Big Five.
2. Characteristic adaptations: goals, values, coping strategies and self beliefs that are more context specific, such as self efficacy or attachment styles.
3. Life narratives: the internalised, evolving stories people tell about their lives that give unity and meaning.
These sit within the biological design of human nature and the cultural context.
- The biopsychosocial model also integrates biological, psychological and social influences.
- Mischel's CAPS links traits with processes, and modern psychodynamic work uses attachment research.

## Conclusion
No approach is complete. Traits describe what people are like, social cognitive and psychodynamic approaches explain how and why, humanistic approaches capture meaning and growth, and biology explains roots. Integrative models like McAdams's levels bring them together.`,
    keyPoints: ["Different questions answered by each approach", "Five approaches with key theorists", "Comparison table on nature, causes, free will, consistency, methods, testability, therapy", "One case analysed through each lens", "McAdams's three levels", "Biopsychosocial integration", "Balanced conclusion"],
    pitfalls: ["Describing approaches without comparing them", "No integration"],
    module: "personality-theories/1-1",
    visuals: [
      layers("Integration", "stack", [["Life narratives", "The story of who I am"], ["Characteristic adaptations", "Goals, values, coping, self beliefs"], ["Dispositional traits", "Broad stable traits such as the Big Five"], ["Human nature and culture", "Biological design and cultural context"]]),
      vis("sort", { prompt: "Which approach does each explanation of Rohit's shyness come from?", buckets: ["Psychodynamic", "Trait", "Social cognitive", "Biological"], items: [{ text: "Anxiety from his father's harsh criticism, kept out of awareness", bucket: 0 }, { text: "High neuroticism and low extraversion", bucket: 1 }, { text: "Low self efficacy for speaking up", bucket: 2 }, { text: "A sensitive behavioural inhibition system", bucket: 3 }] }, "A case seen through each lens"),
    ],
    ref: "McAdams 1995, McAdams and Pals 2006; Engel 1977 biopsychosocial; Mischel and Shoda 1995; personality-theories module 1.1",
  },
]);
