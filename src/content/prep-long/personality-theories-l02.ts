import type { LongQA } from "@/lib/prep/long-types";
import type { PrepVisual } from "@/lib/prep/types";
import type { FigureData } from "@/lib/study/types";
import { anchored, chain, compare, layers, tree, vis } from "./visual";

const S = "personality-theories" as const;
const fig = (id: string, caption: string): PrepVisual => ({ kind: "figure", data: { id } satisfies FigureData, caption });

export const PERSONALITY_THEORIES_L02: LongQA[] = anchored([
  {
    id: "pers-l02-001",
    subject: S,
    topic: "trait-theories",
    marks: 15,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Describe Gordon Allport's trait theory of personality. Explain his classification of traits, the proprium and functional autonomy, and evaluate his contribution.",
    plan: ["Allport's definition of personality", "Lexical work", "Cardinal, central and secondary traits", "Proprium and functional autonomy", "Idiographic approach", "Evaluation"],
    answer: `## Allport's definition
Gordon Allport of Harvard is often called the father of trait psychology. In 1937 he defined personality as the dynamic organisation within the individual of those psychophysical systems that determine his characteristic behaviour and thought. Each word mattered: dynamic, because personality changes; organisation, because traits are linked; psychophysical, because mind and body are both involved; determine, because personality causes behaviour.

## Lexical work
In 1936 Allport and Henry Odbert searched an unabridged English dictionary and found about 18,000 words describing people. About 4,500 described stable traits; others described temporary states, evaluations or physical qualities. This list became the starting point for Raymond Cattell's factor analysis and, later, the Big Five, which rest on the lexical hypothesis that important differences between people are encoded in language.

## Kinds of traits
Allport saw traits as real neuropsychic structures that make many stimuli functionally equivalent and guide consistent behaviour. He distinguished:
1. Cardinal traits: a single dominating trait that shapes almost everything a person does. Few people have one. Examples include Mahatma Gandhi's non violence or the Marquis de Sade's cruelty, from which the word sadism comes.
2. Central traits: the five to ten traits that best describe a person, the ones you would mention in a reference letter, such as honest, warm and ambitious.
3. Secondary traits: less consistent dispositions shown only in some situations, such as preferences for food or becoming nervous only when speaking in public.
He also distinguished common traits, shared by many people in a culture and comparable across them, from personal dispositions, unique to the individual.

## The proprium
Allport avoided the word self because of its mystical overtones and used the proprium for all aspects of personality that a person feels are central and their own. He described seven aspects developing from infancy to adolescence: bodily self, self identity, self esteem, self extension, self image, rational coping and propriate striving, the setting of long term goals.

## Functional autonomy
Allport argued that adult motives can become independent of the childhood needs that started them. A boy may learn the tabla to please his father, but as an adult he plays for love of music. He distinguished:
- Perseverative functional autonomy: low level repetitive behaviours, such as routines.
- Propriate functional autonomy: higher motives connected to the self, such as values and interests.
This was a direct challenge to Freud's view that adult motives are disguised childhood drives.

## Idiographic and nomothetic
Allport insisted that psychology should study the unique individual, the idiographic approach, as well as general laws, the nomothetic approach. His analysis of over 300 letters written by a woman he called Jenny Masterson to her son's friends identified central traits such as quarrelsome, possessive and sentimental.

## The mature personality
Allport listed characteristics of the psychologically mature: extension of the sense of self, warm relating to others, emotional security, realistic perception, skills and tasks, self objectification with insight and humour, and a unifying philosophy of life.

## Evaluation
Strengths:
- Laid the foundation of trait psychology and the lexical approach.
- Functional autonomy explains why adult interests seem genuine and current.
- Respect for the individual and for healthy personality influenced humanistic psychology.
- He also studied prejudice, writing a classic work in 1954.
Weaknesses:
- His concepts, such as the proprium and cardinal traits, are hard to measure.
- Functional autonomy describes but does not explain how motives become independent.
- The idiographic method makes it hard to build general laws.
- Later factor analysts, such as Cattell, showed that traits could be studied more precisely by statistics.

## Conclusion
Allport defined personality, launched the study of traits from language and defended the uniqueness and maturity of the individual. His central traits and lexical list remain basic to modern personality psychology.`,
    keyPoints: ["Allport's 1937 definition explained", "Allport and Odbert 1936 lexical list", "Cardinal, central and secondary traits with examples", "Common traits versus personal dispositions", "Proprium and its aspects", "Functional autonomy, perseverative and propriate", "Idiographic study: Letters from Jenny", "Evaluation"],
    pitfalls: ["Confusing central and cardinal traits", "Leaving out functional autonomy"],
    module: "personality-theories/1-2",
    visuals: [layers("Kinds of traits", "pyramid", [["Cardinal traits", "One dominating trait, rare"], ["Central traits", "Five to ten traits that describe a person"], ["Secondary traits", "Shown only in some situations"]])],
    ref: "Allport 1937 Personality: A Psychological Interpretation; Allport and Odbert 1936; Allport 1961; Allport 1965 Letters from Jenny; Allport 1954 The Nature of Prejudice; personality-theories module 1.2",
  },
  {
    id: "pers-l02-002",
    subject: S,
    topic: "trait-theories",
    marks: 15,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Explain Cattell's factor analytic approach to personality. Describe surface and source traits, the three kinds of data and the 16PF, and evaluate the theory.",
    plan: ["Why factor analysis", "L, Q and T data", "Surface and source traits", "The 16 factors and second order factors", "Other ideas: ability, dynamic traits, heritability", "Evaluation"],
    answer: `## Why factor analysis
Raymond Cattell, a British born psychologist working in the United States, wanted to discover the basic units of personality scientifically rather than by intuition. He used factor analysis, a statistical method that finds clusters of correlated variables and reduces them to a smaller number of underlying factors.

## Three kinds of data
1. L data, life record data: ratings by others and records of real life behaviour, such as school grades or number of traffic accidents.
2. Q data, questionnaire data: self reports.
3. T data, objective test data: behaviour in controlled tests where the person does not know what is being measured, such as reaction time or handwriting pressure.
Cattell argued that a true trait should appear across all three kinds of data.

## From words to factors
Starting from Allport and Odbert's list, Cattell reduced about 4,500 trait words to 171 by removing synonyms, then grouped them into 35 clusters based on correlations, and through factor analysis of ratings and questionnaires identified 16 primary factors.

## Surface and source traits
- Surface traits are clusters of behaviours that go together on the surface, such as being talkative, cheerful and sociable, but may have several causes.
- Source traits are the underlying factors that cause surface traits, found through factor analysis. Source traits can be constitutional, from heredity, or environmental mold traits, from experience.

## The 16 personality factors
The Sixteen Personality Factor Questionnaire, first published in 1949 and now in its fifth edition, measures:
| Factor | Low score | High score |
| Warmth | Reserved | Warm |
| Reasoning | Concrete | Abstract |
| Emotional stability | Reactive | Stable |
| Dominance | Deferential | Dominant |
| Liveliness | Serious | Lively |
| Rule consciousness | Expedient | Rule conscious |
| Social boldness | Shy | Bold |
| Sensitivity | Utilitarian | Sensitive |
| Vigilance | Trusting | Vigilant |
| Abstractedness | Grounded | Abstracted |
| Privateness | Forthright | Private |
| Apprehension | Self assured | Apprehensive |
| Openness to change | Traditional | Open to change |
| Self reliance | Group oriented | Self reliant |
| Perfectionism | Tolerates disorder | Perfectionistic |
| Tension | Relaxed | Tense |
Factor analysis of these 16 gives five second order global factors: extraversion, anxiety, tough mindedness, independence and self control, which resemble the Big Five.

## Other ideas
- Ability traits, including fluid and crystallised intelligence, a distinction he introduced.
- Temperament traits and dynamic traits, which include ergs, innate drives such as hunger, sex and curiosity, and sentiments, learned attitudes centred on objects like career or religion.
- The specification equation predicts behaviour in a situation as a weighted sum of traits.
- Multiple abstract variance analysis to estimate the heritability of traits.
The 16PF has been translated and normed in India and is widely used in counselling, selection and research.

## Using the 16PF
A counsellor helping a final year commerce student choose between sales and accounting might find high warmth, liveliness and social boldness with low perfectionism, a profile common in people who enjoy sales, against high rule consciousness and perfectionism, which fit audit and accounting work. Profiles are compared with occupational norms, and the counsellor discusses them with the student rather than deciding for them. In clinical settings, high apprehension, tension and low emotional stability point towards anxiety, to be explored further.

## Evaluation
Strengths:
- Brought statistical rigour and an empirical basis to trait theory.
- The 16PF is a reliable and practical instrument.
- Insistence on multiple data sources was ahead of its time.
Weaknesses:
- Factor analysis depends on the variables put in and on choices of rotation, so different researchers find different numbers of factors.
- Many later researchers could not replicate 16 independent factors and found five broad factors instead.
- The theory is complex, with many new terms.
- T data rarely matched Q data well.

## Conclusion
Cattell made personality a measurable science. His 16 factors are still used in practice, while his second order factors anticipated the Big Five.`,
    keyPoints: ["Use of factor analysis", "L, Q and T data", "Reduction from 4,500 words to 16 factors", "Surface versus source traits; constitutional and environmental mold", "16PF factors and five global factors", "Fluid and crystallised intelligence, ergs and sentiments", "Indian use of the 16PF", "Evaluation"],
    pitfalls: ["Confusing surface and source traits", "Listing factors with no evaluation"],
    module: "personality-theories/1-3",
    visuals: [
      chain("From words to factors", [["About 4,500 trait words", "Allport and Odbert"], ["171 terms", "Synonyms removed"], ["35 clusters", "By correlation"], ["16 source traits", "Factor analysis"], ["5 global factors", "Second order analysis"]]),
      compare("Surface and source traits", ["Surface traits", ["Clusters visible in behaviour", "May have several causes", "Found by simple correlation"], "What we see"], ["Source traits", ["Underlying factors", "Cause surface traits", "Found by factor analysis"], "What lies beneath"]),
    ],
    ref: "Cattell 1946, 1950, 1965 The Scientific Analysis of Personality; Cattell, Eber and Tatsuoka 1970; 16PF fifth edition 1993; personality-theories module 1.3",
  },
  {
    id: "pers-l02-003",
    subject: S,
    topic: "eysenck",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Critically evaluate Eysenck's theory of personality. Describe the hierarchical model, the three dimensions, their biological basis and their relation to behaviour and psychopathology.",
    plan: ["Eysenck's approach", "Hierarchical model", "The three dimensions", "Biological basis and evidence", "Links to behaviour, learning and disorders", "Evaluation"],
    answer: `## Eysenck's approach
Hans Eysenck, a German born psychologist at the Institute of Psychiatry in London, combined factor analysis with experimental and biological research. Unlike Cattell, he favoured a few broad dimensions and insisted that a good theory must explain the causes of traits, not only describe them.

## The hierarchical model
Personality is organised at four levels:
1. Specific responses: single acts, such as talking to a stranger at a bus stop.
2. Habitual responses: acts repeated in similar situations.
3. Traits: correlated habits, such as sociability, liveliness and activity.
4. Types or superfactors: broad dimensions formed by correlated traits, such as extraversion.

## The three dimensions
- Extraversion versus introversion: extraverts are sociable, lively, active, assertive and sensation seeking; introverts are quiet, reserved and reflective.
- Neuroticism versus emotional stability: high scorers are anxious, moody, tense and react strongly to stress; low scorers are calm and even tempered.
- Psychoticism versus impulse control, added in the 1970s: high scorers are aggressive, cold, impulsive, antisocial and tough minded, but also creative.
Dimensions are continuous and independent. Combining E and N gives four quadrants that match the ancient temperaments: unstable extravert, choleric; unstable introvert, melancholic; stable extravert, sanguine; stable introvert, phlegmatic. His measures include an early inventory of E and N from the 1950s, the Eysenck Personality Inventory and the Eysenck Personality Questionnaire, which includes a lie scale.

## Biological basis
- Extraversion: Eysenck proposed that introverts have higher baseline arousal in the ascending reticular activating system, which links the brainstem to the cortex. Since there is an optimal level of arousal, introverts avoid extra stimulation, while extraverts seek it. In the lemon juice test, drops of lemon juice on the tongue produced more saliva in introverts. Introverts also tolerate less noise and prefer quieter study places.
- Neuroticism: linked to the reactivity of the limbic system, the visceral brain, and the autonomic nervous system. High N people respond more strongly and recover more slowly from stress.
- Psychoticism: linked tentatively to high testosterone, low monoamine oxidase activity and dopamine.
- Heritability: twin studies, including his own, suggested that about half the variation in E and N is genetic.

## Links to behaviour
- Conditioning: introverts condition more quickly, for example in eyeblink conditioning, which Eysenck used to explain why they are more socialised.
- Anxiety disorders: high N plus introversion predicts phobias, anxiety and obsessive problems, which he called dysthymic disorders.
- Crime: high E, N and P together predict antisocial behaviour because such people condition poorly and seek stimulation.
- Learning and work: extraverts perform better under noise and in jobs with variety; introverts in quiet, sustained tasks.

## Applying the theory: an example
Two first year students in Delhi share a hostel room. Arjun, a stable extravert, studies with music on, joins every society and gets bored in long lectures. Vikram, an unstable introvert, needs silence to study, worries for days before tests and avoids crowded canteens. Eysenck would predict that Arjun has lower baseline cortical arousal and seeks stimulation to reach his optimal level, while Vikram is already near or above his optimum and reacts strongly to stress through a reactive limbic system. The theory suggests practical advice: quiet study spaces and relaxation training for Vikram, varied tasks and group study for Arjun.

## Evaluation
Strengths:
- Combined description with a testable biological theory, making specific predictions.
- E and N appear in almost every major model, including the Big Five, and show strong heritability.
- The EPQ is brief, reliable and has been adapted in many countries including India.
- Neuroticism is one of the best predictors of mental and physical health problems.
Weaknesses:
- Evidence for arousal differences is mixed; Jeffrey Gray revised the theory, arguing that the basic dimensions are sensitivity to reward and punishment, not arousal.
- Psychoticism is poorly named, since it relates more to antisocial personality than to psychosis, and its scale has low reliability.
- Three dimensions may be too few: the Big Five separates agreeableness and conscientiousness, which roughly correspond to low P.
- Eysenck's claims about personality, smoking and cancer, published with Ronald Grossarth Maticek, have been heavily criticised and some papers were retracted, which damaged parts of his work.

## Conclusion
Eysenck built one of the most scientific theories of personality, linking a few broad dimensions to brain systems, learning and behaviour. Its E and N dimensions remain central, though the biological explanations have been revised.`,
    keyPoints: ["Factor analysis plus biology", "Four level hierarchy", "E, N and P with descriptions", "Four quadrants and the ancient temperaments", "ARAS arousal and the lemon juice test", "Limbic reactivity for N; heritability about half", "Conditioning, anxiety and crime predictions", "Evaluation including Gray's revision and the retraction controversy"],
    pitfalls: ["Saying extraverts have higher arousal", "Equating psychoticism with psychosis"],
    module: "personality-theories/1-3",
    visuals: [
      fig("eysenck-circle", "The three dimensions: extraversion and neuroticism form four quadrants"),
      layers("The hierarchical model", "pyramid", [["Type", "Extraversion as a superfactor"], ["Traits", "Sociability, liveliness, activity"], ["Habitual responses", "Repeated acts in similar situations"], ["Specific responses", "A single act"]]),
      chain("Biological basis", [["Introvert: high baseline arousal", "Reticular activating system"], ["Extra stimulation feels too much", "Above the optimal level"], ["Avoids noise and crowds", "Prefers quiet"], ["More saliva to lemon juice", "Stronger response"]]),
    ],
    ref: "Eysenck 1947, 1967 The Biological Basis of Personality; Eysenck and Eysenck 1975 EPQ, 1985; Corcoran 1964 lemon juice; Gray 1970, 1981; Pelosi 2019 and KCL 2019 inquiry on Grossarth-Maticek papers; personality-theories module 1.3",
  },
  {
    id: "pers-l02-004",
    subject: S,
    topic: "big-five",
    marks: 20,
    difficulty: 3,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Describe the five factor model of personality. Discuss its origins, its measurement, the evidence for its universality, stability and heritability, its prediction of life outcomes and its limitations.",
    plan: ["Origins: lexical and questionnaire traditions", "The five factors and facets", "Measurement", "Universality, stability and heritability", "Prediction of outcomes", "Limitations"],
    answer: `## Origins
The five factor model, or Big Five, emerged from two traditions:
- The lexical tradition: if a difference between people matters, languages will have words for it. Starting from Allport and Odbert's list and Cattell's variables, Ernest Tupes and Raymond Christal in 1961, analysing ratings of air force officers, found five recurring factors. Warren Norman confirmed them in 1963, and Lewis Goldberg in the 1980s and 1990s named them the Big Five.
- The questionnaire tradition: Paul Costa and Robert McCrae developed the NEO Personality Inventory, first measuring neuroticism, extraversion and openness, then adding agreeableness and conscientiousness. They presented it as the five factor model and a theory of personality.

## The five factors
The mnemonic OCEAN gives:
| Factor | High scorers | Low scorers |
| Openness to experience | Imaginative, curious, artistic, unconventional | Practical, conventional |
| Conscientiousness | Organised, dependable, hardworking, self disciplined | Careless, impulsive |
| Extraversion | Sociable, assertive, energetic, positive | Reserved, quiet |
| Agreeableness | Trusting, kind, cooperative, modest | Suspicious, critical, competitive |
| Neuroticism | Anxious, moody, vulnerable to stress | Calm, stable |
In the NEO PI R, published in 1992, each factor has six facets, giving 30. For example, neuroticism includes anxiety, angry hostility, depression, self consciousness, impulsiveness and vulnerability.

## Measurement
- NEO PI R and NEO PI 3 with 240 items; the NEO FFI with 60 items.
- The Big Five Inventory with 44 items, and the BFI 2.
- The International Personality Item Pool, free to use.
- Brief measures such as the Ten Item Personality Inventory for large surveys.
- Observer ratings by spouses or friends agree moderately with self reports.
Indian studies have used translated versions in Hindi, Tamil, Marathi and other languages.

## Universality
Robert McCrae and colleagues tested the NEO PI R in over 50 cultures and found the five factor structure in most, including India. Lexical studies in some languages found additional factors, such as honesty humility, leading to the HEXACO model, and in some less literate samples the structure has been weaker.

## Stability
- Rank order stability increases with age, with test retest correlations of about 0.6 to 0.7 over long periods in adulthood.
- Mean level change follows a maturity principle: Brent Roberts and colleagues' meta analysis in 2006 found that conscientiousness, agreeableness and emotional stability increase from adolescence through middle age, social dominance increases in young adulthood, and openness and social vitality decline in old age.
- Personality can change through life events and therapy; a meta analysis found that psychotherapy reduces neuroticism.

## Heritability
Twin studies estimate that about 40 to 60 per cent of variation in each factor is genetic. Shared family environment contributes little; most environmental influence is non shared. Genome wide studies show that many genes each have tiny effects.

## Prediction of outcomes
- Conscientiousness predicts job performance across occupations, as Murray Barrick and Michael Mount found in 1991, academic grades, health behaviours and longevity.
- Neuroticism predicts depression, anxiety and many other mental disorders, marital dissatisfaction and poor physical health.
- Extraversion predicts positive emotions, leadership emergence and sales performance.
- Agreeableness predicts cooperative relationships and lower aggression.
- Openness predicts creativity, liberal attitudes and success in training.
The effects are often similar in size to those of socioeconomic status and IQ.

## Clinical relevance
Personality disorders can be described as extreme combinations of the five factors. Both DSM 5's alternative model and ICD 11's dimensional system for personality disorders use similar trait domains, such as negative affectivity and detachment.

## Limitations
- It is descriptive, saying what traits are, not why. Costa and McCrae's five factor theory and biological work try to address this.
- Five broad factors miss traits such as honesty, religiosity, sexuality and humour.
- Self report is open to faking and social desirability, especially in selection.
- The model was developed largely in Western, educated samples.
- Traits predict behaviour across many situations better than single behaviours.
- Jack Block criticised the factor analytic basis and argued for more nuanced, person centred approaches.

## Conclusion
The Big Five is the most widely accepted framework for describing personality, with strong evidence for structure, heritability, stability and prediction. It is best used as a map, supplemented by theories that explain the processes behind traits.`,
    keyPoints: ["Lexical and questionnaire origins: Tupes and Christal, Norman, Goldberg, Costa and McCrae", "OCEAN with descriptions", "Six facets each in the NEO PI R", "Measures including NEO, BFI, IPIP", "Cross cultural replication including India", "Rank order stability and the maturity principle", "Heritability 40 to 60 per cent, little shared environment", "Outcomes, clinical links and limitations"],
    pitfalls: ["Listing factors with no evidence", "Saying traits never change"],
    module: "personality-theories/1-4",
    visuals: [
      tree("The five factors", [["Big Five", "OCEAN", -1], ["Openness", "Imaginative, curious", 0], ["Conscientiousness", "Organised, dependable", 0], ["Extraversion", "Sociable, energetic", 0], ["Agreeableness", "Trusting, kind", 0], ["Neuroticism", "Anxious, moody", 0]]),
      vis("sort", { prompt: "Which factor best predicts each outcome?", buckets: ["Conscientiousness", "Neuroticism", "Extraversion"], items: [{ text: "Job performance across occupations", bucket: 0 }, { text: "Risk of depression and anxiety", bucket: 1 }, { text: "Emerging as a leader in a new group", bucket: 2 }, { text: "Living longer", bucket: 0 }, { text: "Frequent positive emotions", bucket: 2 }] }, "Prediction of outcomes"),
    ],
    ref: "Tupes and Christal 1961; Norman 1963; Goldberg 1990; Costa and McCrae 1985, 1992 NEO PI R; McCrae and Terracciano 2005 50 cultures; Roberts, Walton and Viechtbauer 2006; Roberts et al 2017 therapy and change; Barrick and Mount 1991; Block 1995; personality-theories module 1.4",
  },
  {
    id: "pers-l02-005",
    subject: S,
    topic: "hexaco",
    marks: 10,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "What is the HEXACO model of personality? How does it differ from the five factor model, and what is the importance of the honesty humility factor?",
    plan: ["Origin in lexical studies", "The six factors", "Differences from the Big Five", "Honesty humility and outcomes", "Evaluation"],
    answer: `## Origin
In the early 2000s Kibeom Lee and Michael Ashton reanalysed lexical studies of personality in many languages, including Dutch, French, German, Hungarian, Italian, Korean and Polish. They found that six factors, not five, appeared most consistently. They called the model HEXACO, from the initials of the six factors and from hexa, meaning six.

## The six factors
| Factor | Facets |
| Honesty humility | Sincerity, fairness, greed avoidance, modesty |
| Emotionality | Fearfulness, anxiety, dependence, sentimentality |
| Extraversion | Social self esteem, social boldness, sociability, liveliness |
| Agreeableness versus anger | Forgiveness, gentleness, flexibility, patience |
| Conscientiousness | Organisation, diligence, perfectionism, prudence |
| Openness to experience | Aesthetic appreciation, inquisitiveness, creativity, unconventionality |
An interstitial facet, altruism, links honesty humility, emotionality and agreeableness. The HEXACO Personality Inventory Revised measures them.

## Differences from the Big Five
- A sixth factor, honesty humility, is added.
- Emotionality differs from neuroticism: it includes sentimentality and dependence but not anger.
- Agreeableness is redefined around patience and tolerance versus anger, with anger moved out of the emotional factor.
- Extraversion, conscientiousness and openness are similar in both models.
The rotation of emotional and agreeable content means that some Big Five traits are split differently.

## Honesty humility and outcomes
People low in honesty humility are manipulative, greedy, boastful and willing to break rules for gain. Low scores predict:
- Workplace deviance, such as theft and fraud.
- Unethical decisions and cheating in experiments.
- The dark triad traits of narcissism, Machiavellianism and psychopathy, which share low honesty humility as a core.
- Sexual harassment proneness and exploitation in relationships.
High scores predict cooperation in economic games and integrity at work. Honesty humility often predicts these outcomes better than Big Five agreeableness.

## Evaluation
Strengths: a strong lexical basis across languages and useful prediction of ethical behaviour, valuable in selection for positions of trust. Weaknesses: the evidence for six versus five factors depends on analysis choices, and some English lexical studies gave five. In India, HEXACO measures have been used in organisational studies, but lexical work in Indian languages is limited.

## Conclusion
HEXACO adds honesty humility to the Big Five and reorganises emotional traits. It is especially useful for understanding unethical and exploitative behaviour.`,
    keyPoints: ["Lee and Ashton's cross language lexical studies", "Six factors with facets", "Altruism as interstitial facet", "Honesty humility added", "Emotionality versus neuroticism; agreeableness versus anger", "Outcomes of low honesty humility and the dark triad", "Evaluation"],
    pitfalls: ["Saying HEXACO only adds a factor without other changes"],
    module: "personality-theories/1-4",
    visuals: [compare("Differences from the Big Five", ["Big Five", ["Five factors", "Neuroticism includes anger", "Agreeableness includes sincerity and modesty"], "Five broad domains"], ["HEXACO", ["Six factors", "Emotionality without anger, with sentimentality", "Honesty humility separate; agreeableness versus anger"], "Six domains"])],
    ref: "Ashton et al 2004 six-factor lexical structure; Lee and Ashton 2004 HEXACO-PI, 2008 HEXACO-PI-R; Ashton and Lee 2007; Lee et al 2013 dark triad; personality-theories module 1.4",
  },
  {
    id: "pers-l02-006",
    subject: S,
    topic: "big-five",
    marks: 5,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Write a short note on the lexical hypothesis in personality research.",
    plan: ["Definition", "History", "Method", "Strengths and limits"],
    answer: `## The hypothesis
The lexical hypothesis states that the personality characteristics most important in people's lives will become encoded in their language, and the more important a characteristic, the more likely it is to be expressed as a single word and to appear in many languages.

## History
- Francis Galton in 1884 estimated that a dictionary contained about a thousand words expressing character.
- Ludwig Klages in Germany suggested studying language to understand character.
- Gordon Allport and Henry Odbert in 1936 found about 18,000 person descriptive words in an English dictionary, about 4,500 of them stable traits.
- Raymond Cattell reduced these to 16 factors; later researchers found five, leading to the Big Five, and cross language studies found six, leading to HEXACO.

## Method
1. Select person describing adjectives from a dictionary.
2. Remove rare, slang and purely evaluative words.
3. Ask people to rate themselves or others on them.
4. Factor analyse the ratings to find the basic dimensions.

## Strengths and limits
Strengths: it gives an objective, culture based starting point rather than a theorist's guess, and can be tested in any language, including Indian languages.
Limits:
- Language may not contain all scientifically important traits, especially those people do not notice.
- Dictionaries contain many evaluative words, which shape factors.
- Adjectives miss traits expressed through nouns and phrases.
- Results depend on the selection and analysis choices.

## Conclusion
The lexical hypothesis underlies the main modern trait models.`,
    keyPoints: ["Definition of the hypothesis", "Galton's early estimate", "Allport and Odbert 1936", "Cattell to Big Five to HEXACO", "Four step method", "Strengths and limitations"],
    pitfalls: ["Confusing with the Sapir Whorf hypothesis"],
    module: "personality-theories/1-4",
    visuals: [chain("Method", [["Dictionary adjectives", "Person descriptors"], ["Filter", "Remove rare and evaluative words"], ["Ratings", "Self and others"], ["Factor analysis", "Basic dimensions"]])],
    ref: "Galton 1884; Allport and Odbert 1936; Goldberg 1981, 1990; Ashton and Lee 2005; personality-theories module 1.4",
  },
  {
    id: "pers-l02-007",
    subject: S,
    topic: "person-situation",
    marks: 15,
    difficulty: 4,
    exams: ["ugc-net", "ma-semester", "mcp-entrance"],
    question: "Critically discuss the person situation debate in personality psychology. How has it been resolved?",
    plan: ["The challenge", "Early evidence of inconsistency", "Responses: aggregation, interaction, situations", "Density distributions and if then signatures", "Resolution", "Implications"],
    answer: `## The challenge
In 1968 Walter Mischel, reviewing decades of research, argued that correlations between a personality trait measure and behaviour in a particular situation rarely exceeded about 0.30, which he called the personality coefficient. He concluded that behaviour depends heavily on the situation and that traits are weak predictors. This began the person situation debate, which dominated the field for two decades.

## Early evidence of inconsistency
- Hugh Hartshorne and Mark May in the 1920s gave thousands of children chances to lie, cheat and steal in different settings, such as at home, in class and at games. Honesty in one situation correlated only weakly, about 0.2 to 0.3, with honesty in another.
- Social psychology showed powerful situational effects, as in Milgram's obedience and Darley and Latane's bystander studies, where ordinary people behaved in surprising ways.
- Mischel argued that people are consistent only in our perceptions, because observers fill in gaps, and that clinicians overestimate trait predictions.

## Responses
1. Aggregation: Seymour Epstein showed in 1979 that single acts are unreliable, like a single test item. When behaviour is averaged across many occasions, correlations with traits rise substantially, often above 0.6. Traits predict patterns, not single acts.
2. Effect sizes in context: David Funder and Daniel Ozer showed in 1983 that classic situational effects, such as those in Milgram's studies, translate into correlations of about 0.3 to 0.4, no larger than trait effects. Later work found that personality and situational effects are of similar size.
3. Interactionism: behaviour is a function of the person, the situation and their interaction. Some situations are strong, with clear rules, like a temple ceremony, and suppress differences; weak situations, like a party, allow traits to show.
4. People choose and shape situations: extraverts go to parties, conscientious students choose quiet libraries, so traits influence which situations we meet.
5. Longitudinal evidence: traits predict important life outcomes such as divorce, health and job success over years.

## Density distributions and signatures
- William Fleeson in 2001 used experience sampling, asking people several times a day how they were behaving. People varied widely around their own average, but their averages were very stable from week to week. A trait is best seen as a density distribution of states.
- Mischel and Yuichi Shoda in 1995 found that children at a summer camp showed stable if then patterns: one child was aggressive when warned by an adult but not when teased by peers, while another showed the opposite. These behavioural signatures were consistent, showing that variability across situations is itself part of personality.

## Resolution
Most psychologists now accept that:
- Traits are real and predict aggregated behaviour and life outcomes.
- Situations matter, and their effects are comparable in size.
- Person and situation interact; personality includes how one responds to different situations.
- Both trait models, such as the Big Five, and process models, such as Mischel's cognitive affective personality system, are needed.

## Implications
- In assessment and selection, predictions should be made about patterns of behaviour, not single acts.
- In clinical work, behaviour should be understood in context, as in functional analysis.
- In India, where behaviour is often expected to follow roles, such as with elders or at work, situational norms may be especially strong; research on context sensitive selves supports this.

## Conclusion
The debate ended not with a winner but with a synthesis: personality is consistent in patterns and in how people respond to situations, and situations matter too.`,
    keyPoints: ["Mischel 1968 and the 0.30 personality coefficient", "Hartshorne and May honesty studies", "Epstein's aggregation", "Funder and Ozer on situational effect sizes", "Strong and weak situations; selection of situations", "Fleeson's density distributions", "Mischel and Shoda's if then signatures", "Synthesis and implications"],
    pitfalls: ["Saying Mischel showed personality does not exist", "No resolution"],
    module: "personality-theories/2-1",
    visuals: [
      compare("Resolution", ["Situationist challenge", ["Trait behaviour correlations rarely above 0.30", "Honesty not consistent across settings", "Strong situational effects"], "Situations rule"], ["Synthesis", ["Aggregated behaviour is predictable", "Situational effects are similar in size", "Stable if then patterns"], "Person and situation interact"]),
      chain("Density distributions and signatures", [["Many daily reports", "Experience sampling"], ["Wide variation in states", "Within each person"], ["Stable average", "Week to week"], ["Trait as a distribution", "Not a fixed act"]]),
    ],
    ref: "Mischel 1968; Hartshorne and May 1928; Epstein 1979; Funder and Ozer 1983; Kenrick and Funder 1988; Fleeson 2001; Mischel and Shoda 1995; Shoda, Mischel and Wright 1994; personality-theories module 2.1",
  },
  {
    id: "pers-l02-008",
    subject: S,
    topic: "mischel",
    marks: 10,
    difficulty: 3,
    exams: ["ugc-net", "ma-semester", "cuet-pg"],
    question: "Explain Mischel's cognitive affective personality system and his research on delay of gratification. What has later research shown?",
    plan: ["From traits to processes", "Cognitive affective units", "If then signatures", "Delay of gratification studies", "Replication and implications"],
    answer: `## From traits to processes
After his critique of trait psychology, Walter Mischel proposed that personality should be understood as a system of cognitive and emotional processes that interact with situations. With Yuichi Shoda in 1995 he described the cognitive affective personality system, CAPS.

## Cognitive affective units
People differ in:
1. Encodings: how they interpret situations and people, for example seeing a remark as an insult or a joke.
2. Expectancies and beliefs: about outcomes and their own ability, similar to self efficacy.
3. Affects: emotional reactions.
4. Goals and values.
5. Competencies and self regulatory plans: skills and strategies for controlling behaviour.
These units are linked in a network unique to each person. A situation activates certain units, which activate others, producing behaviour.

## If then signatures
Because the network is stable, each person shows a stable pattern of if then relations: if situation A, then behaviour X; if situation B, then behaviour Y. Consistency lies in the pattern, not in identical behaviour everywhere. This explains why a person may be shy with strangers but lively with friends.

## Delay of gratification
In the marshmallow studies at Stanford's Bing nursery school from the late 1960s, preschool children could have one treat now or two if they waited, often up to 15 minutes, while the experimenter was away.
- Waiting was easier when the treats were covered, when children distracted themselves, or when they thought of the marshmallows as clouds, a cool, abstract encoding, rather than as sweet and chewy, a hot encoding.
- This led to the hot and cool system model: a fast emotional hot system and a slower reflective cool system.
- Follow ups found that children who waited longer had higher school aptitude scores in adolescence, better coping and lower body mass in adulthood.

## Replication
Tyler Watts and colleagues in 2018 studied a larger, more diverse American sample. The link between waiting at age 4 and achievement at 15 was about half as strong, and much smaller after controlling for family background and early cognitive ability. Delay ability appears to reflect wider family and cognitive advantages, and trust in the adult also matters: children waited less when the experimenter had earlier broken a promise.

## Implications
CAPS integrates traits with social cognitive processes and supports teaching self regulation strategies, such as distraction and reframing, in schools and therapy.

## Conclusion
Mischel showed that personality is a stable system of processes producing situation specific patterns, and that self control depends on how temptations are mentally represented.`,
    keyPoints: ["CAPS by Mischel and Shoda 1995", "Five kinds of cognitive affective units", "If then behavioural signatures", "Marshmallow test procedure", "Strategies: distraction and cool encoding", "Hot and cool systems", "Watts 2018 replication and trust effects"],
    pitfalls: ["Presenting the marshmallow follow up as unchallenged"],
    module: "personality-theories/2-6",
    visuals: [compare("Delay of gratification", ["Hot encoding", ["Thinking of taste and smell", "Treat in view", "Short waiting"], "Emotional system wins"], ["Cool encoding", ["Thinking of the treat as a picture or cloud", "Distraction", "Longer waiting"], "Reflective system wins"])],
    ref: "Mischel and Shoda 1995; Mischel, Ebbesen and Zeiss 1972; Mischel, Shoda and Rodriguez 1989; Metcalfe and Mischel 1999; Watts, Duncan and Quan 2018; Kidd, Palmeri and Aslin 2013; personality-theories module 2.6",
  },
  {
    id: "pers-l02-009",
    subject: S,
    topic: "humanistic",
    marks: 20,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "mcp-entrance", "ma-semester"],
    question: "Describe Carl Rogers' person centred theory of personality. Explain the self concept, conditions of worth, incongruence and the fully functioning person, and evaluate the theory with its research evidence.",
    plan: ["Humanistic context", "Actualising tendency and organismic valuing", "Self concept and positive regard", "Conditions of worth and incongruence", "Fully functioning person and therapy", "Research and evaluation"],
    answer: `## The humanistic context
Carl Rogers, an American psychologist, was a leader of the humanistic movement, the third force after psychoanalysis and behaviourism. Humanistic psychology sees people as basically good, free and striving to grow. Rogers developed his theory from his work as a therapist.

## The actualising tendency
All living things have an innate tendency to maintain and enhance themselves, the actualising tendency. In humans this includes growth towards autonomy and fulfilment. Through the organismic valuing process, a child naturally values experiences that promote growth, such as food when hungry, and avoids those that do not.

## The self concept
As the child develops, part of experience becomes differentiated as the self: the organised, consistent set of perceptions and beliefs about "I" and "me". There is also an ideal self, the self one would like to be. Rogers measured both using the Q sort, in which people sort statements into piles from most to least like them.

## Positive regard
Children have a strong need for positive regard: love, warmth and acceptance from others. They also develop a need for positive self regard.
- When regard is unconditional, the child is accepted as a person even when behaviour is disapproved, and can trust their own experience.
- When regard is conditional, the child learns that they are loved only if they behave in certain ways.

## Conditions of worth and incongruence
Conditional regard produces conditions of worth: beliefs such as "I am worthwhile only if I top the class" or "only if I never get angry". To keep regard, the child denies or distorts experiences that contradict these conditions. The result is incongruence between the self concept and actual experience, and between the self and ideal self.
- Incongruence produces anxiety and vulnerability, and threatening experiences are defended against by distortion and denial.
- When incongruence becomes severe, the person may break down, which Rogers saw as the root of psychological disorder.
Example: Ananya, a medical student in Pune, was praised by her parents only for marks. She sees herself as a person who must always succeed. When she fails a test, the experience does not fit her self concept; she feels intense anxiety and blames the teachers.

## The fully functioning person
A congruent person, raised with unconditional positive regard, becomes fully functioning:
- Open to experience, without defensiveness.
- Living existentially, in the present moment.
- Trusting their own organism and feelings.
- Experiencing freedom and creativity.
- Living richly and fully.

## Therapy
Rogers' person centred therapy aims to dissolve conditions of worth by providing three core conditions:
1. Congruence or genuineness of the therapist.
2. Unconditional positive regard.
3. Accurate empathic understanding.
In 1957 he proposed that these, with the client's perception of them, are necessary and sufficient for change. Rogers pioneered recording sessions for research.

## Research evidence
- Studies with the Q sort showed that the gap between self and ideal self narrowed during therapy, while it did not in waiting list controls.
- Meta analyses show that empathy, positive regard and genuineness are related to therapy outcome, though they are probably not sufficient on their own.
- Research on contingent self esteem, by Jennifer Crocker and others, supports the idea that self worth based on conditions such as academic success is fragile and linked to stress.
- Self determination theory has given experimental support to the value of autonomy supportive, non controlling parenting.

## Evaluation
Strengths:
- Optimistic, respectful view of people.
- Testable ideas about therapy, which opened psychotherapy to research.
- Huge influence on counselling, education and social work, including in India where person centred skills are basic training for counsellors.
Weaknesses:
- Concepts such as the actualising tendency are vague and hard to test.
- Relies on self report and assumes people can know themselves.
- May be too optimistic about human nature and individualistic; in Indian families, accepting parental expectations is not always a sign of incongruence.
- Core conditions are not sufficient for severe disorders.

## Conclusion
Rogers placed the self and the quality of relationships at the centre of personality. His theory explains how conditional love creates inner conflict and how acceptance helps people grow.`,
    keyPoints: ["Humanistic third force", "Actualising tendency and organismic valuing", "Self concept and ideal self, Q sort", "Unconditional versus conditional positive regard", "Conditions of worth and incongruence with example", "Fully functioning person", "Three core conditions of therapy", "Research and evaluation including cultural critique"],
    pitfalls: ["Confusing positive regard and self regard", "No evaluation or evidence"],
    module: "personality-theories/2-2",
    visuals: [
      chain("Conditions of worth and incongruence", [["Conditional regard", "Love only for marks"], ["Conditions of worth", "I am worthwhile only if I succeed"], ["Denial and distortion", "Failure does not fit"], ["Incongruence", "Self versus experience"], ["Anxiety", "Vulnerability and defence"]]),
      compare("The fully functioning person", ["Incongruent person", ["Defensive", "Lives by others' conditions", "Distrusts own feelings"], "Anxious and rigid"], ["Fully functioning person", ["Open to experience", "Trusts own organism", "Free and creative"], "Congruent and growing"]),
    ],
    ref: "Rogers 1951, 1957, 1959, 1961 On Becoming a Person; Butler and Haigh 1954 Q-sort; Elliott et al 2018 empathy meta-analysis; Crocker and Wolfe 2001; personality-theories module 2.2",
  },
  {
    id: "pers-l02-010",
    subject: S,
    topic: "maslow",
    marks: 15,
    difficulty: 2,
    exams: ["cuet-pg", "ugc-net", "ma-semester"],
    question: "Describe Maslow's hierarchy of needs and his study of self-actualising people. Critically evaluate the theory with reference to research and culture.",
    plan: ["Maslow and humanistic psychology", "The hierarchy", "Deficiency and being needs", "Self actualising people and peak experiences", "Later additions", "Evaluation with research and culture"],
    answer: `## Maslow
Abraham Maslow, an American psychologist, was a founder of humanistic psychology. Disappointed that psychology studied mainly illness, he chose to study the healthiest people to understand human potential.

## The hierarchy
In 1943 Maslow proposed that human needs form a hierarchy:
1. Physiological needs: food, water, sleep, sex.
2. Safety needs: security, stability, freedom from fear, order.
3. Love and belongingness needs: affection, friendship, family, group membership.
4. Esteem needs: self respect, achievement, competence, and respect and recognition from others.
5. Self actualisation: becoming everything one is capable of becoming. "What a man can be, he must be."
Lower needs are more urgent and generally must be partly satisfied before higher ones dominate. Maslow said this was not rigid: a person might have 85 per cent physiological, 70 per cent safety and only 10 per cent self actualisation needs satisfied at once, and some people, such as artists or martyrs, put higher needs first.

## Deficiency and being needs
- The first four are deficiency needs, or D needs: lack of them causes tension, and satisfying them removes it.
- Self actualisation involves being needs, or B values, such as truth, beauty, goodness, justice and wholeness, which are pursued for their own sake and grow as they are satisfied.
- Cognitive needs, to know and understand, and aesthetic needs were also described.

## Self actualising people
Maslow studied a small group of people he judged to be self actualising, including historical figures such as Abraham Lincoln, Thomas Jefferson, Albert Einstein and Eleanor Roosevelt, and some acquaintances. They shared features:
- Efficient, accurate perception of reality.
- Acceptance of self, others and nature.
- Spontaneity and simplicity.
- Focus on problems outside themselves, a mission in life.
- Need for privacy and independence.
- Continued freshness of appreciation.
- Peak experiences: moments of intense joy, wonder and unity.
- Deep but few close relationships.
- Democratic character and a philosophical sense of humour.
- Creativity.
They were not perfect; they could be stubborn or cold. Maslow estimated that less than one per cent of people are self actualising.

## Later additions
In his later work, Maslow added self transcendence beyond self actualisation: going beyond the self to serve others, nature or a spiritual reality. This idea is close to Indian ideals of moksha and seva, and to the transpersonal psychology he helped found.

## Research evidence
- Louis Tay and Ed Diener in 2011 analysed Gallup data from 123 countries. Needs similar to Maslow's, such as basic needs, safety, social support, respect, mastery and autonomy, were universal and related to wellbeing. But people could gain wellbeing from higher needs even when lower needs were unmet, so the order was not strict.
- Studies of poverty in India show that people with unmet basic needs still value family belonging, religion and dignity highly.

## Evaluation
Strengths:
- Simple, intuitive and widely applied in education, nursing, management and marketing.
- Focus on growth and health influenced positive psychology.
- Emphasised the whole person.
Weaknesses:
- Self actualisation was studied in a small, hand picked sample judged by Maslow himself, so the description reflects his own values.
- Concepts are vague and hard to measure.
- The order of needs is not universal. In collectivist cultures, belonging and family may come before personal esteem, and self actualisation may be defined as fulfilling one's role and duty rather than personal potential. Edwin Nevis suggested a Chinese hierarchy with belonging at the base.
- People in extreme deprivation, such as concentration camp survivors described by Viktor Frankl, could still find meaning, against the strict hierarchy.

## Conclusion
Maslow's hierarchy is one of psychology's most famous ideas. Research supports the universality of the needs, but not a fixed order, and its picture of self actualisation reflects a particular culture and time.`,
    keyPoints: ["Study of healthy people", "Five levels in order", "Flexible, partial satisfaction", "Deficiency needs versus being values", "Characteristics of self actualisers and peak experiences", "Self transcendence and Indian parallels", "Tay and Diener 2011 across 123 countries", "Cultural and methodological critique"],
    pitfalls: ["Presenting the hierarchy as rigid", "No research evidence"],
    module: "personality-theories/2-3",
    visuals: [
      fig("maslow-pyramid", "The hierarchy: Maslow's needs from body to self actualisation"),
      compare("Deficiency and being needs", ["Deficiency needs", ["Physiological, safety, love, esteem", "Lack causes tension", "Satisfaction removes the drive"], "D needs"], ["Being needs", ["Truth, beauty, justice, wholeness", "Pursued for their own sake", "Grow as they are met"], "B values"]),
    ],
    ref: "Maslow 1943 A theory of human motivation; Maslow 1954, 1968, 1971; Tay and Diener 2011; Nevis 1983; Frankl 1946; personality-theories module 2.3",
  },
]);
