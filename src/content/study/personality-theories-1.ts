/* Module · Theories of personality, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: types and traits

## 1.1 What a personality theory is for [core][starting]
**Personality** is the relatively stable pattern of thinking, feeling and behaving that makes a person recognisably themselves across time and situations. Gordon Allport's classic definition (1937, revised 1961): personality is "the dynamic organisation within the individual of those psychophysical systems that determine his characteristic behaviour and thought". Every word does work: **dynamic** (it changes and develops), **organisation** (parts fit together), **psychophysical** (mind and body), **determine** (it causes behaviour, not just describes it), **characteristic** (it is yours).

This module is about **normal personality and the theories that explain it**. Disorders of personality (the ten DSM disorders, ICD-11 severity and trait domains, DBT) are in the module **Personality disorders**. Freud and the neo-Freudians are covered in **Psychodynamics in depth** and **Mind, development and defence mechanisms**.

### What shapes personality
- **Heredity**: genes influence temperament and traits (about 40% of the variation between people in most traits, from twin studies).
- **Environment**: mostly **non-shared** experiences (different friends, illnesses, teachers, chance events), more than the family everyone in a household shares.
- **Culture**: what is valued, rewarded and even what counts as a "self".
- **Situation**: what a setting allows and demands.

### What a good theory must do
| Criterion | Question |
|---|---|
| **Comprehensiveness** | Does it explain a wide range of behaviour? |
| **Parsimony** | Does it explain a lot with few ideas? |
| **Testability (falsifiability)** | Could any evidence prove it wrong? |
| **Heuristic value** | Does it generate research and new ideas? |
| **Applied value** | Does it help in therapy, schools, work? |
| **Internal consistency** | Do its parts fit without contradiction? |

Two research strategies run through the field:
- **Nomothetic**: find general laws and dimensions that apply to everyone (trait psychologists such as Cattell and Eysenck).
- **Idiographic**: understand the unique pattern of one person in depth (Allport's case study of "Jenny", Kelly's repertory grid).

### The map of approaches
| Approach | Big question | Key theorists |
|---|---|---|
| **Psychoanalytic and neo-Freudian** | What unconscious conflicts drive us? | Freud, Jung, Adler, Horney, Erikson, Fromm, Sullivan |
| **Type and trait** | What are the basic dimensions on which people differ? | Allport, Cattell, Eysenck, Costa and McCrae, Ashton and Lee |
| **Biological and evolutionary** | What brain systems and genes underlie traits, and why did they evolve? | Eysenck, Gray, Cloninger, Buss |
| **Humanistic** | How do people grow towards their potential? | Rogers, Maslow |
| **Existential** | How do people face freedom, death and meaning? | May, Frankl, Yalom |
| **Social-cognitive** | How do learning, beliefs and situations shape behaviour? | Bandura, Rotter, Mischel |
| **Cognitive (personal construct)** | How does each person interpret the world? | Kelly |
| **Indian** | How do the gunas and the layered self shape a person? | Samkhya and the Bhagavad Gita, Upanishadic thought; modern Indian psychologists |

:::widget sort
{
  "prompt": "Place each theorist in the right approach.",
  "buckets": ["Trait", "Humanistic or existential", "Social-cognitive or cognitive", "Psychoanalytic family"],
  "items": [
    { "text": "Raymond Cattell", "bucket": 0 },
    { "text": "Carl Rogers", "bucket": 1 },
    { "text": "Albert Bandura", "bucket": 2 },
    { "text": "Karen Horney", "bucket": 3 },
    { "text": "Viktor Frankl", "bucket": 1 },
    { "text": "George Kelly", "bucket": 2, "why": "Personal construct theory is usually classed as cognitive: people as scientists testing their own predictions." },
    { "text": "Hans Eysenck", "bucket": 0, "why": "A trait theorist who also proposed biological causes." },
    { "text": "Alfred Adler", "bucket": 3 },
    { "text": "Julian Rotter", "bucket": 2 },
    { "text": "Rollo May", "bucket": 1 }
  ]
}
:::

:::student
Every approach is a different lens, not a rival answer to the same question. A trait theory tells you **what** someone is like ("high in anxiety"); a social-cognitive theory tells you **when and why** they act that way ("anxious when evaluated by seniors, because they expect failure"); a humanistic theory tells you **what they are reaching for**. Good case formulations use more than one lens.
:::

:::clinician
Dan McAdams's three-level framework is a useful integration for postgraduate answers: **Level 1, dispositional traits** (broad, decontextualised, comparative: the Big Five); **Level 2, characteristic adaptations** (goals, values, coping strategies, schemas, attachment styles, contextualised in time and role); **Level 3, integrative life narratives** (the internalised, evolving story a person constructs to give life unity and purpose). The levels are only modestly correlated, so knowing someone's traits does not tell you their life story. McAdams and Pals (American Psychologist, 2006) added evolution and culture as frames around all three. This maps neatly onto the theories in this module: trait theories (level 1), social-cognitive and humanistic theories (level 2), and narrative and existential approaches (level 3).
:::

:::recall
1. Give Allport's definition of personality. || The dynamic organisation within the individual of those psychophysical systems that determine his characteristic behaviour and thought.
2. Name six criteria for judging a personality theory. || Comprehensiveness, parsimony, testability, heuristic value, applied value, internal consistency.
3. Distinguish nomothetic from idiographic. || Nomothetic: general laws and dimensions across people. Idiographic: the unique pattern of one person.
4. Which kind of environment shapes personality most, according to twin research? || Non-shared environment (experiences unique to each sibling).
:::

:::mcq
Q: A theory that explains almost any behaviour after the fact, but makes no prediction that could turn out wrong, is weakest on which criterion?
- *Testability
- Comprehensiveness
- Heuristic value
- Applied value
> Unfalsifiable theories cannot be tested, however much they seem to explain.
:::

## 1.2 Types and early traits: from humours to Allport [core][starting]
A **type** is a category: you are in it or not. A **trait** is a dimension: everyone has some amount. Modern research strongly favours traits, because when you measure most characteristics, scores fall on a continuous curve, not into separate boxes.

### Early type theories
| Theory | Types | Status today |
|---|---|---|
| **Hippocrates and Galen** (humours) | Sanguine (blood: cheerful), choleric (yellow bile: irritable), melancholic (black bile: sad), phlegmatic (phlegm: calm) | Historical; Eysenck mapped them onto his E and N dimensions |
| **Kretschmer** (1921) | Pyknic (stocky), asthenic (thin), athletic, dysplastic, linked to mood and psychotic disorders | Not supported |
| **Sheldon** (1940s) somatotypes | **Endomorph** (round) with **viscerotonia** (relaxed, sociable, loves comfort); **mesomorph** (muscular) with **somatotonia** (assertive, adventurous); **ectomorph** (thin) with **cerebrotonia** (restrained, private, sensitive) | Methodologically flawed (the same person rated body and temperament); not supported |
| **Jung** | Attitudes: **introversion** and **extraversion**; functions: thinking, feeling, sensing, intuition | Introversion-extraversion survives as a dimension; the typology does not |
| **Friedman and Rosenman** (1959) Type A and B | Type A: competitive, hurried, hostile; Type B: relaxed | **Hostility** is the part that predicts heart disease; the global Type A pattern does not reliably |

:::widget decide
{
  "scene": "The HR head of a Bengaluru tech company wants to use the Myers-Briggs Type Indicator (MBTI), based on Jung's types, to decide which applicants get leadership roles. She says, “It sorts people into 16 clear types, so we can match types to jobs.”",
  "ask": "What is the best evidence-based advice?",
  "choices": [
    { "label": "Go ahead; it is the world's most popular personality test", "verdict": "harm", "outcome": "Good applicants are rejected on a type that may change if they retake the test next month.", "why": "Popularity is not validity. A large share of people get a different type when retested within weeks, because the cut-offs split continuous scores near the middle." },
    { "label": "Explain that personality is better measured as continuous traits; the MBTI's types are unstable on retest and predict job performance poorly; use validated trait measures (such as conscientiousness) alongside structured interviews and work samples", "verdict": "best", "outcome": "The company drops type-based selection and uses validated tools.", "why": "Trait measures such as conscientiousness have modest but real links to job performance; structured interviews and work samples predict better still. Using any personality test for selection also raises fairness and legal questions." },
    { "label": "Use the MBTI for team-building workshops only, and say nothing about selection", "verdict": "ok", "outcome": "Workshops are fine for conversation, but the selection problem remains.", "why": "Team discussions are a lower-stakes use, but the question was about hiring." }
  ]
}
:::

### Gordon Allport: the founder of trait psychology
Allport (1897 to 1967) saw traits as **real structures inside the person** (neuropsychic structures) that make many situations functionally equivalent and guide consistent behaviour.

**The lexical start.** Allport and Odbert (1936) searched an unabridged English dictionary and found **17,953** words describing people, of which about **4,500** were stable traits. This **lexical hypothesis**, that important differences between people get encoded in language, later led to the Big Five.

**Three kinds of personal dispositions:**
- **Cardinal**: one dominating trait that colours almost everything (rare; Allport's examples were Machiavellian or quixotic; Gandhi's commitment to non-violence is often given as an Indian example).
- **Central**: the handful (Allport thought about five to ten) you would mention in a reference letter: honest, warm, ambitious.
- **Secondary**: narrower preferences and attitudes that appear only in some situations ("hates waiting in queues").

**Common traits versus personal dispositions**: common traits allow comparison across people (nomothetic); personal dispositions are unique to each person (idiographic). Allport favoured studying the individual, for example through **Letters from Jenny** (1965), an analysis of 301 letters an older woman wrote over eleven years.

**The proprium**: Allport's word for the self, the parts of personality that feel central and "mine". It develops through stages: bodily self, self-identity, self-esteem, self-extension, self-image, self as rational coper, and **propriate striving** (long-term goals).

**Functional autonomy**: adult motives can become **independent of their origins**. A man who became a fisherman to earn a living keeps fishing in retirement because he loves it.
- **Perseverative** functional autonomy: low-level habits and routines that keep going (always taking the same route home).
- **Propriate** functional autonomy: values and interests that belong to the self.

**The mature personality**, in Allport's terms: extension of the sense of self, warm relating to others, emotional security and self-acceptance, realistic perception, skills and commitment to work, self-objectification (insight and humour), and a unifying philosophy of life.

:::widget sort
{
  "prompt": "Cardinal, central or secondary trait?",
  "buckets": ["Cardinal", "Central", "Secondary"],
  "items": [
    { "text": "A social reformer whose every act, from diet to politics, is organised around non-violence", "bucket": 0 },
    { "text": "“Ananya is kind, curious, punctual and quick to laugh.”", "bucket": 1 },
    { "text": "“He gets irritable only when he is hungry.”", "bucket": 2 },
    { "text": "“She prefers window seats on trains.”", "bucket": 2 },
    { "text": "“Generous, outspoken and hard-working” in a reference letter", "bucket": 1 },
    { "text": "A trait so dominant it becomes the person's identity, as rare as Allport said it was", "bucket": 0 }
  ]
}
:::

:::trap Functional autonomy is not "habit"
Exams ask for the two types. **Perseverative** = low-level repetitive habits. **Propriate** = self-related values and interests. And it means the motive is now independent of the **original** motive, not that it has no motive at all.
:::

:::clinician
The lexical hypothesis has been tested across many languages, including Hindi-related and other Indian lexical work, with broadly similar large factors emerging, though the number and content of factors depend on which words are included (for example, whether evaluative terms like "good" and "evil" are retained, which tends to yield a sixth honesty-related factor). On MBTI stability: test-retest studies report that a substantial minority to about half of respondents change at least one of the four letters on retest after short intervals, because type assignment dichotomises continuous scores near the midpoint (Pittenger, 2005). Type A: early prospective studies (the Western Collaborative Group Study) found an association with coronary heart disease that later trials such as MRFIT did not confirm; meta-analyses identify hostility and anger as the toxic component, and modern work emphasises "Type D" (negative affectivity with social inhibition), whose prognostic value in cardiac patients is itself inconsistent across large samples.
:::

:::recall
1. What is the difference between a type and a trait? || A type is a category; a trait is a continuous dimension on which everyone has some amount.
2. Name Sheldon's three somatotypes and their temperaments. || Endomorph and viscerotonia; mesomorph and somatotonia; ectomorph and cerebrotonia.
3. What did Allport and Odbert find? || About 18,000 person-descriptive words in the dictionary, about 4,500 of them stable traits.
4. Name Allport's three kinds of personal dispositions. || Cardinal, central, secondary.
5. What is functional autonomy, and its two types? || Adult motives becoming independent of their origins: perseverative and propriate.
6. Which part of Type A predicts heart disease? || Hostility.
:::

:::mcq
Q: A doctor became a psychiatrist to please his father, but now, decades later, he loves the work for its own sake. Allport would call this:
- A cardinal disposition
- *Propriate functional autonomy
- The lexical hypothesis
- Perseverative functional autonomy
> A self-related interest that has become independent of its original motive.
:::

## 1.3 The factor analysts: Cattell and Eysenck [core][starting]
Both men used **factor analysis**, a statistical method that finds which measures go together. If people who say they are talkative also tend to say they love parties and enjoy meeting strangers, factor analysis groups these into one underlying **factor** (here, extraversion). Factor analysis tells you what clusters; the researcher must still name the cluster and decide how many to keep.

### Raymond Cattell (1905 to 1998)
Cattell wanted a "periodic table" of personality, built from data rather than theory.

**Three kinds of data**:
- **L-data** (life record): ratings by others and real-life records (school reports, accidents, ratings by friends).
- **Q-data** (questionnaire): self-report.
- **T-data** (objective tests): behaviour in a controlled situation where the person cannot easily guess what is measured (for example, reaction times, or how much they sway when told they are falling).

**Surface versus source traits**: **surface traits** are clusters of behaviour that go together (seen in correlations); **source traits** are the deeper factors that cause them. Cattell reduced Allport's list to about 171, then 35 clusters, and finally found **16 source traits**, measured by the **16 Personality Factor Questionnaire (16PF)**: for example warmth, reasoning, emotional stability, dominance, liveliness, rule-consciousness, social boldness, sensitivity, vigilance, abstractedness, privateness, apprehension, openness to change, self-reliance, perfectionism and tension. When these 16 are factor analysed again, five **global factors** appear, close to the Big Five.

**Other kinds of traits**: **ability traits** (including Cattell's famous split of intelligence into **fluid** and **crystallised**), **temperament traits** (style), and **dynamic traits** (motivation: inborn **ergs** such as hunger and curiosity, and learnt **sentiments** organised around objects such as career or family, all linked in a **dynamic lattice**).

**The specification equation**: behaviour in a situation equals the sum of each relevant trait multiplied by how important that trait is in that situation. It anticipated later interactionist ideas.

### Hans Eysenck (1916 to 1997)
Eysenck combined factor analysis with **hypothesis testing** and **biology**. He found just **three superfactors** (PEN):
- **Psychoticism** (P): aggressive, cold, impulsive, antisocial, tough-minded, creative. Versus impulse control.
- **Extraversion** (E): sociable, lively, active, assertive, sensation-seeking. Versus introversion.
- **Neuroticism** (N): anxious, moody, tense, guilt-prone, low self-esteem. Versus emotional stability.

**A hierarchy**: specific responses at the bottom, then habitual responses, then traits, then **types** (superfactors) at the top.

**The four temperaments return**: E and N together recreate the ancient humours: high N and high E = **choleric**; high N, low E = **melancholic**; low N, high E = **sanguine**; low N, low E = **phlegmatic**.

**The biology Eysenck proposed**:
| Dimension | Proposed basis |
|---|---|
| **Extraversion** | Introverts have a higher resting level of **cortical arousal** (the ascending reticular activating system, ARAS), so they avoid extra stimulation; extraverts are under-aroused, so they seek it |
| **Neuroticism** | A more reactive **limbic system** (the "visceral brain"): quicker, stronger emotional responses to stress |
| **Psychoticism** | Linked speculatively to male hormones and dopamine |

:::widget decide
{
  "scene": "A classic test of Eysenck's arousal theory: four drops of concentrated lemon juice are placed on the tongue for 20 seconds, and the saliva produced is weighed using cotton swabs. Participants were also scored on extraversion.",
  "ask": "Predict who produced more saliva.",
  "choices": [
    { "label": "Extraverts, because they respond more strongly to everything", "verdict": "ok", "outcome": "That is the opposite of the result.", "why": "Extraverts seek stimulation because they are under-aroused, not because they react more." },
    { "label": "Introverts", "verdict": "best", "outcome": "Correct. Introverts produced more saliva in response to the lemon juice.", "why": "If introverts start at higher cortical arousal, the same stimulus produces a bigger response, which fits Eysenck's prediction. Later arousal findings were more mixed: introverts and extraverts differ more in arousability (reactivity) than in resting arousal." },
    { "label": "No difference; saliva has nothing to do with personality", "verdict": "ok", "outcome": "Studies found a reliable difference in this paradigm.", "why": "This was one of Eysenck's best-replicated biological predictions." }
  ]
}
:::

**Measures**: the Maudsley Personality Inventory, then the Eysenck Personality Inventory (E and N, with a Lie scale), and the **Eysenck Personality Questionnaire (EPQ)**, which added P.

:::trap Two critiques to write in every Eysenck answer
1. **The P scale is the weakest part**: low reliability, odd item content, and it mixes low agreeableness with low conscientiousness. The Big Five splits it into those two.
2. **Research integrity**: Eysenck's later papers with Ronald Grossarth-Maticek claimed personality caused cancer and heart disease and that therapy could prevent them. In 2019, an enquiry by **King's College London** judged these papers **unsafe**; many have since been retracted or flagged by journals. His trait theory and EPQ are not affected, but his claims about personality and fatal illness should not be cited as evidence.
:::

:::widget sort
{
  "prompt": "Which Eysenck temperament does each person fit?",
  "buckets": ["Choleric (high N, high E)", "Melancholic (high N, low E)", "Sanguine (low N, high E)", "Phlegmatic (low N, low E)"],
  "items": [
    { "text": "A lively, sociable event planner who rarely worries", "bucket": 2 },
    { "text": "A quiet researcher who broods and feels anxious before every deadline", "bucket": 1 },
    { "text": "A restless, touchy salesman who flares up and calms down quickly", "bucket": 0 },
    { "text": "A calm, reserved accountant who seldom gets upset", "bucket": 3 },
    { "text": "An outgoing student leader who becomes tearful and angry under criticism", "bucket": 0 },
    { "text": "A steady, quiet night-shift nurse unbothered by emergencies", "bucket": 3 }
  ]
}
:::

:::clinician
Cattell versus Eysenck is partly a dispute about **factor rotation**: Cattell used **oblique** rotation (allowing correlated factors), which yields many narrower primary factors that correlate; Eysenck emphasised **higher-order orthogonal** factors. Both pictures can be true at different levels of a hierarchy, which is how modern models (for example, the Big Five with facets, and HiTOP for psychopathology) resolve it. On arousal: meta-analytic and EEG evidence for resting differences in cortical arousal between introverts and extraverts is inconsistent; differences in reactivity to stimulation and in reward sensitivity (dopaminergic) are better supported, which moved the field towards Gray's and DeYoung's reward-based accounts of extraversion (section 3.1). Clinically, high N is a broad, non-specific risk factor for almost every common mental disorder and predicts onset of depression and anxiety prospectively, which is why N is sometimes called the general vulnerability factor.
:::

:::recall
1. Name Cattell's three types of data. || L-data (life record), Q-data (questionnaire), T-data (objective tests).
2. What is the difference between surface and source traits? || Surface traits are observed clusters; source traits are the underlying causes.
3. What are ergs and sentiments? || Ergs are inborn motives (such as hunger); sentiments are learnt motive patterns organised around objects (such as career).
4. Name Eysenck's three superfactors. || Psychoticism, extraversion, neuroticism.
5. What biological basis did Eysenck propose for extraversion? || Introverts have higher cortical arousal (ARAS) and avoid stimulation; extraverts are under-aroused and seek it.
6. What do high N and low E give in Eysenck's mapping of the temperaments? || Melancholic.
:::

:::mcq
Q: A researcher measures personality by recording how much a person sways when told to imagine falling, without explaining what is being measured. In Cattell's system this is:
- L-data
- Q-data
- Surface data
- *T-data
> An objective test of behaviour where the purpose is hidden.

Q: In Eysenck's arousal theory, introverts avoid noisy parties mainly because:
- *Their arousal is already high
- They are high in psychoticism and coldness
- They have low limbic reactivity
- They are low in neuroticism
> Introverts start at higher arousal; extra stimulation overshoots their comfort zone.
:::

## 1.4 The Big Five and HEXACO [core][starting]
By the 1980s, two separate routes converged on **five broad factors**:
- The **lexical route**: factor analyses of trait words in ordinary language (Tupes and Christal in the 1960s for the US Air Force, then Warren Norman, then Lewis Goldberg, who named them the "Big Five").
- The **questionnaire route**: Paul Costa and Robert McCrae built the **NEO Personality Inventory** (NEO-PI-R, and later NEO-PI-3) with **six facets** for each factor.

### The five factors (OCEAN)
| Factor | High scorers are | Low scorers are | Two NEO facets |
|---|---|---|---|
| **Openness to experience** | Curious, imaginative, unconventional, broad interests | Practical, conventional, prefer the familiar | Fantasy, ideas (also aesthetics, feelings, actions, values) |
| **Conscientiousness** | Organised, dependable, disciplined, achievement-striving | Spontaneous, careless, disorganised | Order, self-discipline (also competence, dutifulness, achievement striving, deliberation) |
| **Extraversion** | Sociable, energetic, assertive, cheerful | Reserved, quiet, independent | Gregariousness, assertiveness (also warmth, activity, excitement-seeking, positive emotions) |
| **Agreeableness** | Trusting, cooperative, modest, kind | Sceptical, competitive, blunt | Trust, altruism (also straightforwardness, compliance, modesty, tender-mindedness) |
| **Neuroticism** | Anxious, moody, easily upset | Calm, even-tempered, resilient | Anxiety, vulnerability (also angry hostility, depression, self-consciousness, impulsiveness) |

:::mnemonic OCEAN or CANOE
Both spell the five: **O**penness, **C**onscientiousness, **E**xtraversion, **A**greeableness, **N**euroticism.
:::

:::widget sort
{
  "prompt": "Which Big Five factor does each NEO facet belong to?",
  "buckets": ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"],
  "items": [
    { "text": "Deliberation (thinking before acting)", "bucket": 1 },
    { "text": "Excitement-seeking", "bucket": 2 },
    { "text": "Tender-mindedness", "bucket": 3 },
    { "text": "Impulsiveness (giving in to cravings)", "bucket": 4, "why": "In the NEO-PI-R, impulsiveness is a neuroticism facet (difficulty resisting urges when upset). Exam favourite: it is NOT under conscientiousness or extraversion." },
    { "text": "Aesthetics", "bucket": 0 },
    { "text": "Dutifulness", "bucket": 1 },
    { "text": "Modesty", "bucket": 3 },
    { "text": "Self-consciousness", "bucket": 4 },
    { "text": "Warmth", "bucket": 2, "why": "In the NEO, warmth is an extraversion facet, though it overlaps with agreeableness." },
    { "text": "Values (openness to re-examining values)", "bucket": 0 }
  ]
}
:::

### Five-factor theory
McCrae and Costa's **five-factor theory** separates **basic tendencies** (the five traits, which they see as largely biological, like temperament) from **characteristic adaptations** (habits, attitudes, roles, relationships, which are shaped by culture and experience). Traits influence adaptations, not the other way round, in their view. This is a strong and controversial claim, because traits do change somewhat with life experience.

### Is it universal?
McCrae and Terracciano (2005) had people in **50 cultures** (including India) rate someone they knew well. The same five factors appeared in most cultures, supporting a broadly universal structure. Problems appear in some non-literate and rural samples, where five-factor structure replicates less cleanly, and in some Asian languages extra factors appear (for example, an "interpersonal relatedness" factor in Chinese research by Cheung and colleagues).

### HEXACO: a sixth factor
Kibeom Lee and Michael Ashton re-analysed lexical studies in many languages and found **six** factors: **H**onesty-Humility, **E**motionality, e**X**traversion, **A**greeableness, **C**onscientiousness and **O**penness.
- **Honesty-Humility**: sincerity, fairness, greed-avoidance and modesty. Low scorers are manipulative, greedy and entitled. It predicts workplace deviance, cheating and the "dark triad" traits (narcissism, Machiavellianism, psychopathy) better than the Big Five.
- **Emotionality** is like neuroticism but without anger, and includes sentimentality and dependence.
- **Agreeableness** in HEXACO includes patience and anger control (so low HEXACO agreeableness is irritability).

:::widget guess
{
  "prompt": "Twin studies estimate how much of the variation between people in the Big Five traits is due to genetic differences. What is the typical heritability?",
  "min": 0,
  "max": 100,
  "unit": "%",
  "answer": [35, 50],
  "reveal": "About **40%** on average (a meta-analysis by Vukasović and Bratko, 2015). Most of the rest is **non-shared environment** and measurement error. The **shared** family environment adds surprisingly little to adult personality.",
  "clinician": "Heritability is a population statistic: it describes the proportion of variance in a given population and environment, not how much of one person's trait is 'genetic'. Twin estimates (about 40 to 50%) are larger than SNP-based heritability from molecular studies (often 10 to 20%), the 'missing heritability' problem, attributed to many very small effects, rare variants and non-additive effects."
}
:::

### What the Big Five predicts
Roberts and colleagues (2007) reviewed long-term studies and found that personality traits predict **mortality, divorce and occupational success** about as well as socioeconomic status and IQ do.
- **Conscientiousness**: longevity, health behaviours, academic performance, job performance (the most consistent predictor across jobs), and lower risk of dementia.
- **Neuroticism**: depression, anxiety, poorer physical health, marital dissatisfaction.
- **Extraversion**: positive emotion, leadership emergence, sales success.
- **Agreeableness**: relationship quality, low antisocial behaviour.
- **Openness**: creativity, liberal political attitudes, educational attainment.

:::clinician
Correlations are modest at the individual level (typically r of 0.1 to 0.3) but consequential at scale, as Roberts and colleagues (Perspectives on Psychological Science, 2007) argued. The DSM-5 alternative model of personality disorders (Section III) and ICD-11's trait qualifiers both draw on maladaptive versions of the five-factor space: negative affectivity (neuroticism), detachment (low extraversion), antagonism or dissociality (low agreeableness), disinhibition (low conscientiousness), and psychoticism (DSM-5) or anankastia (ICD-11; extreme conscientiousness), which is why trait psychology is now part of diagnosis. In India, the NEO-PI-R, NEO-FFI and the Big Five Inventory have been translated and normed in several languages (Hindi, Marathi, Tamil, Bengali and others), with broadly similar structure but generally lower internal consistencies for openness and agreeableness in some samples; use local norms where available. The Big Five do not capture everything: religiosity, honesty-humility, values, attractiveness and abilities are partly outside the five.
:::

:::recall
1. Name the two routes that led to the Big Five. || The lexical route (trait words) and the questionnaire route (Costa and McCrae's NEO).
2. List the five factors with one facet each. || Openness (ideas), conscientiousness (order), extraversion (gregariousness), agreeableness (trust), neuroticism (anxiety).
3. What does five-factor theory separate? || Basic tendencies (traits) from characteristic adaptations (habits, roles, attitudes).
4. What does HEXACO add? || Honesty-Humility as a sixth factor.
5. What is the typical heritability of Big Five traits? || About 40%.
6. Which trait most consistently predicts job performance? || Conscientiousness.
:::

:::mcq
Q: Under the NEO-PI-R, "impulsiveness" (giving in to cravings when upset) is a facet of:
- Conscientiousness
- *Neuroticism
- Extraversion
- Openness
> A favourite trap: in the NEO, impulsiveness belongs to neuroticism.

Q: An employee is sincere, refuses bribes and does not feel entitled to special treatment. HEXACO would score him high on:
- Emotionality
- Openness
- Agreeableness only
- *Honesty-Humility
> The factor HEXACO adds to the Big Five.
:::

## 1.5 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: Studying one person's unique pattern in depth, such as Allport's analysis of Jenny's letters, is called:
- *Idiographic research
- Nomothetic research
- Factor analysis
- Lexical analysis of trait words
> Idiographic: the individual case.

Q: Which kind of environment contributes most to differences in adult personality, according to twin studies?
- The shared family environment
- Birth order alone
- *The non-shared environment
- Parental income alone
> Experiences unique to each sibling matter more than the shared home.

Q: Sheldon linked the muscular body type with:
- Viscerotonia
- *Somatotonia
- Cerebrotonia
- Melancholia
> Mesomorph with somatotonia: assertive, adventurous.

Q: The component of Type A behaviour most linked to heart disease is:
- Time urgency
- Competitiveness
- Achievement striving
- *Hostility
> Hostility and anger carry the risk.

Q: Allport and Odbert's dictionary search found about how many person-descriptive words?
- 450
- 1,800
- *18,000
- 180,000
> 17,953 words, about 4,500 of them stable traits.

Q: The handful of traits you would list in a reference letter are Allport's:
- *Central traits
- Cardinal traits
- Secondary traits
- Source traits
> Central dispositions: about five to ten.

Q: A man still walks the same route to work every day after his office has moved, though there is a quicker way. This is:
- Propriate functional autonomy of values
- *Perseverative functional autonomy
- A cardinal trait
- Propriate striving
> A low-level habit that keeps going on its own.

Q: Ratings of a student by her teachers and her school records are Cattell's:
- Q-data
- T-data
- *L-data
- Source data
> Life-record data.

Q: Cattell's split of intelligence into fluid and crystallised is an example of:
- Dynamic traits
- Temperament traits
- Surface traits
- *Ability traits
> Ability traits in Cattell's system.

Q: Eysenck's three superfactors are:
- *Psychoticism, extraversion, neuroticism
- Openness, conscientiousness, agreeableness
- Introversion, sensing, thinking
- Warmth, dominance, vigilance
> PEN.

Q: High neuroticism with high extraversion maps onto which classical temperament?
- Sanguine
- *Choleric
- Phlegmatic
- Melancholic
> Touchy, restless and changeable.

Q: Which statement about Eysenck's work is most accurate?
- His papers on personality and cancer remain strong, trusted evidence
- His trait model has been fully replaced
- His P scale is the most reliable part of the EPQ
- *His trait model stands; his disease papers were judged unsafe
> The 2019 King's College London enquiry.

Q: The "Big Five" name was popularised by researchers following which route?
- The physiological route
- The psychoanalytic route
- *The lexical route
- The projective route
> Goldberg's lexical work.

Q: The NEO facet "dutifulness" belongs to:
- *Conscientiousness
- Agreeableness and modesty
- Openness
- Extraversion
> Dutifulness is a conscientiousness facet.

Q: Low scorers on HEXACO Honesty-Humility are most likely to be:
- Shy and anxious
- Disorganised and careless
- *Manipulative and entitled
- Conventional and practical
> Low H links to the dark triad and workplace deviance.
:::

# Part II · Beginner: the person in situations, and the person growing

## 2.1 Traits under test: situations, stability and prediction [core][beginner]
If traits are real, people should behave consistently. Do they?

### The person-situation debate
In **Personality and Assessment** (1968), Walter Mischel argued that the correlation between a trait score and behaviour in any single situation rarely exceeds about 0.30, a ceiling he called the **personality coefficient**. A child who is honest in one test (not cheating on an exam) may not be honest in another (not stealing coins), as Hartshorne and May had found in the 1920s. Mischel concluded that behaviour depends heavily on the situation.

:::widget guess
{
  "prompt": "Mischel said a trait score rarely correlates with behaviour in one situation above a certain value. What is that 'personality coefficient' (as a correlation from 0 to 1)?",
  "min": 0,
  "max": 1,
  "step": 0.05,
  "unit": "r",
  "answer": [0.25, 0.35],
  "reveal": "About **0.30**. That means a trait explains under a tenth of the variation in one behaviour. But Funder and Ozer showed that the classic **situational** effects in social psychology (Milgram, bystanders) are about the same size when converted to correlations: around 0.3 to 0.4.",
  "clinician": "Funder and Ozer (JPSP, 1983) converted famous situational effects to correlations and found values of roughly 0.36 to 0.42, comparable to the 'personality coefficient'. Richard, Bond and Stokes-Zoota (2003) found the average social psychology effect was about r of 0.21. Neither persons nor situations dominate; both matter."
}
:::

### How the debate was resolved
1. **Aggregation** (Seymour Epstein, 1979): one behaviour is a poor sample. Averaged over many occasions, trait-behaviour correlations rise sharply (often to 0.6 or more), just as one exam question is a poor test of knowledge but a full paper is good.
2. **Interactionism**: behaviour = person **and** situation **and** their interaction. Some people are consistent in some areas (Bem and Allen's "predicting some of the people some of the time").
3. **Strong versus weak situations**: in strong situations (a funeral, a red traffic light) everyone behaves alike; in weak, ambiguous ones (a party), traits show.
4. **Whole trait theory** (William Fleeson): people vary a lot from moment to moment, but each person's **average** and **range** across many moments (a "density distribution") is very stable. Traits describe the centre of a distribution of states.
5. **If-then signatures** (Mischel and Shoda, section 2.6): consistency lies in a person's stable **pattern** of reacting to particular situations.

### Are traits stable over life?
- **Rank-order stability** (do you keep your position compared with others?) rises with age: about 0.3 in childhood, about 0.5 in college years, about 0.6 at 30, and peaks around 0.7 to 0.75 between 50 and 70 (Roberts and DelVecchio, 2000). Personality is never "set like plaster", in William James's phrase, but it does become more consistent.
- **Mean-level change**: people on average become **more conscientious, more agreeable and less neurotic** from adolescence into middle age: the **maturity principle** (Roberts, Walton and Viechtbauer, 2006). Social roles (work, partnership, parenting) are thought to drive some of this (social investment theory).
- **Therapy changes traits**: a meta-analysis (Roberts and colleagues, 2017) found that psychological interventions produced noticeable decreases in neuroticism over a few months, with gains that lasted.

:::widget decide
{
  "scene": "Meera, 24, a nursing student, scores very high on neuroticism. She asks you, her counsellor: “Does this mean I'll always be an anxious person? It's my personality, so therapy can't change it, right?”",
  "ask": "What is the most accurate response?",
  "choices": [
    { "label": "“Yes, traits are fixed after adolescence; we can only help you cope.”", "verdict": "harm", "outcome": "Meera feels hopeless and drops out of therapy.", "why": "This is false. Traits are fairly stable but change across life, and therapy reduces neuroticism measurably." },
    { "label": "“Traits are fairly stable, but they do change. People usually become calmer with age, and therapy reduces neuroticism, often within months. Your score describes where you are now, not where you must stay.”", "verdict": "best", "outcome": "Meera engages in CBT; at six months her anxiety and N score have both dropped.", "why": "Accurate, hopeful and evidence-based: the maturity principle and intervention studies both support change." },
    { "label": "“Personality tests aren't real; ignore your score.”", "verdict": "ok", "outcome": "She feels reassured briefly but loses a useful way to track progress.", "why": "Validated trait measures are informative. Dismissing them is not honest either." }
  ]
}
:::

:::clinician
Distinguish four kinds of stability: rank-order (correlations over time), mean-level (group averages), individual-level (reliable change for a given person) and ipsative (stability of a person's profile shape). The cumulative continuity principle (rank-order stability increases with age) and the maturity principle are among the most replicated findings in personality science. The dose-response link between therapy and trait change (Roberts and colleagues, Psychological Bulletin, 2017; 207 studies) showed the largest changes for emotional stability, with changes visible at about four weeks of treatment and maintained at follow-ups, and changes did not differ much by type of therapy. A practical implication: a high N score at intake predicts poorer outcome, but N itself is a legitimate treatment target, as in the Unified Protocol for transdiagnostic treatment of emotional disorders, which explicitly aims at neuroticism.
:::

:::recall
1. What is Mischel's personality coefficient? || The ceiling of about 0.30 on the correlation between a trait and behaviour in one situation.
2. What did Epstein show about aggregation? || Averaging behaviour across many occasions raises trait-behaviour correlations sharply.
3. What is a strong situation? || One whose demands are so clear that most people behave alike, hiding trait differences.
4. When does rank-order stability peak? || Between about 50 and 70 years of age.
5. What is the maturity principle? || With age, people become on average more conscientious and agreeable and less neurotic.
:::

:::mcq
Q: Fleeson's whole trait theory says traits are best thought of as:
- Fixed behaviours shown the same way in every situation
- *Stable distributions of changing states
- Purely situational habits
- Unconscious drives
> People vary a lot moment to moment, but the centre and spread of their states is stable.
:::

## 2.2 Carl Rogers: the self and its conditions [core][beginner]
Humanistic psychology, the "third force" after psychoanalysis and behaviourism, saw people as **basically good, growth-oriented and able to choose**. Carl Rogers (1902 to 1987) built his theory from thousands of hours of therapy.

### Key ideas
- **The actualising tendency**: the single, inborn motive of every living thing to maintain and enhance itself, to grow towards complexity and fulfilment. The **self-actualising tendency** is its expression in the self.
- **The organismic valuing process**: the infant naturally values experiences that enhance growth (food when hungry, comfort when afraid) and rejects those that don't.
- **The phenomenal field**: each person's private world of experience. To understand behaviour, understand how the person sees the situation.
- **The self-concept**: the organised picture of "who I am", built from experience and from how others treat us. The **ideal self** is who I think I should be.
- **The need for positive regard**: everyone needs warmth, acceptance and love from others, and later develops a need for **positive self-regard**.

### How the problem starts: conditions of worth
When love and approval are given **only when** the child behaves in certain ways ("We love you when you come first in class", "Good boys don't cry"), the child learns **conditions of worth**. To keep the love, the child starts to value experiences by others' standards instead of their own organismic valuing. They **disown** feelings and wishes that don't fit.

The result is **incongruence**: a gap between the **self-concept** and actual **experience**. When an experience threatens the self-concept, it causes anxiety, and the person defends by:
- **Distortion**: changing how the experience is perceived ("I only did well because the paper was easy").
- **Denial**: keeping it out of awareness altogether.
When incongruence is large and defences fail, the self-concept can break down (disorganisation).

:::example Conditions of worth in an Indian family
Karthik, 21, is a third-year engineering student in Chennai. His parents' approval has always depended on his ranks. He loves painting but has learnt to see it as "time-pass". He feels flat and anxious, and says, "I don't know what I actually want." His self-concept ("I am a future engineer who should love this") is incongruent with his experience (boredom with engineering, joy in painting). A Rogerian counsellor would not tell him to change courses; she would offer the conditions in which he can hear his own valuing again.
:::

### The fully functioning person
Rogers's picture of psychological health:
1. **Openness to experience**: no need for defences.
2. **Existential living**: living fully in each moment.
3. **Organismic trusting**: trusting one's own judgment.
4. **Experiential freedom**: feeling free to choose.
5. **Creativity**: adapting flexibly and producing new ideas.

### The conditions for change
Rogers (1957) proposed **six necessary and sufficient conditions** for therapeutic change:
1. Two people are in psychological contact.
2. The client is in a state of incongruence (vulnerable or anxious).
3. The therapist is **congruent** (genuine) in the relationship.
4. The therapist feels **unconditional positive regard** for the client.
5. The therapist experiences **empathic understanding** of the client's internal frame of reference.
6. The client perceives, at least to some degree, the therapist's empathy and acceptance.
Conditions 3, 4 and 5 are the famous **core conditions**: **genuineness, unconditional positive regard, empathy**.

:::widget decide
{
  "scene": "Riya, 19, says to her counsellor: “My parents think I'm wasting their money. Maybe they're right. I failed again. I'm just useless.”",
  "ask": "Which response best reflects Rogers's core conditions?",
  "choices": [
    { "label": "“You're not useless; you got into a good college, didn't you?”", "verdict": "ok", "outcome": "Riya says “I suppose” and changes the subject.", "why": "Reassurance argues with her experience instead of understanding it. It is well meant but subtly conditional: you are OK because of your achievements." },
    { "label": "“It sounds like failing again has left you feeling you've let them down, and that maybe you're not good enough at all.”", "verdict": "best", "outcome": "Riya starts to cry and says, “I've never felt good enough for them.” The session deepens.", "why": "Accurate empathy reflects the feeling and its meaning from her frame of reference, without judgment or advice." },
    { "label": "“You should study harder and make a timetable so you don't fail again.”", "verdict": "harm", "outcome": "Riya hears one more adult telling her what to do and feels more worthless.", "why": "Directive advice at this moment repeats the conditions of worth that underlie her distress." }
  ]
}
:::

### Testing Rogers: the Q-sort
William Stephenson's **Q-sort** asks a person to sort about 100 statements about themselves ("I am a hard worker", "I often feel guilty") into piles from "most like me" to "least like me". Sorting the same cards for the **ideal self** lets you correlate self and ideal: a direct measure of congruence.

:::widget guess
{
  "prompt": "Butler and Haigh (1954) had clients do self and ideal-self Q-sorts before and after client-centred therapy. Before therapy, the average correlation between self and ideal self was close to zero. What was it after therapy?",
  "min": -1,
  "max": 1,
  "step": 0.05,
  "unit": "r",
  "answer": [0.25, 0.45],
  "reveal": "About **0.34**, staying around 0.31 at follow-up. A control group who did not have therapy started at about 0.58 and barely changed. Clients' self and ideal became more alike: congruence increased.",
  "clinician": "Butler and Haigh (in Rogers and Dymond, Psychotherapy and Personality Change, 1954): client group pre-therapy r of about minus 0.01, post-therapy 0.34, follow-up 0.31; controls 0.58. A wait-list subgroup did not change during the waiting period. Critics note that increased self-ideal congruence can come from lowering the ideal as well as raising the self, and that very high congruence can reflect defensiveness."
}
:::

:::clinician
Evidence today: the relationship conditions Rogers emphasised are among the best-supported common factors in psychotherapy. Meta-analyses for the APA task force on evidence-based relationships (Norcross and Lambert, 2019) found empathy correlates with outcome at about r of 0.28 (Elliott and colleagues, 2018), positive regard and affirmation at about 0.28 (Farber and colleagues), and congruence or genuineness at about 0.23 (Kolden and colleagues). These are correlational and partly reflect client factors. What is not supported is the claim that the conditions are **sufficient** for all problems: specific techniques add benefit for disorders such as OCD, PTSD and panic. Person-centred counselling has trial evidence for mild to moderate depression (the UK's counselling for depression model), and its skills (reflection, summarising, non-judgmental stance) are the foundation of counselling micro-skills in Indian training programmes. Theoretical critiques: the self-concept and actualising tendency are hard to operationalise; the theory assumes an individualist self that may fit less well in families where decisions are shared, though conditions of worth around marks, marriage and career are vivid in Indian clinical work.
:::

:::recall
1. What is the actualising tendency? || The single inborn motive to maintain and enhance oneself and grow towards fulfilment.
2. What are conditions of worth? || Conditions under which a child receives love and approval, which lead them to disown parts of their experience.
3. What is incongruence, and the two defences against it? || A gap between self-concept and experience; distortion and denial.
4. Name the three core conditions. || Genuineness (congruence), unconditional positive regard, empathy.
5. List the five qualities of the fully functioning person. || Openness to experience, existential living, organismic trusting, experiential freedom, creativity.
6. What did Butler and Haigh find? || Self-ideal correlation rose from about zero to about 0.34 after client-centred therapy.
:::

:::mcq
Q: A woman who thinks of herself as always calm explains away her shouting at her son as "just being firm". In Rogers's theory, she is using:
- Denial
- Projection
- Conditions of worth
- *Distortion
> She perceives the threatening experience in a changed form so it fits her self-concept.

Q: Which of Rogers's six conditions concerns the client rather than the therapist?
- *Perceiving the therapist's empathy
- Congruence
- Empathy
- Unconditional positive regard for the client
> Condition 6: the client must perceive the therapist's attitudes.
:::

## 2.3 Abraham Maslow: needs and self-actualisation [core][beginner]
Abraham Maslow (1908 to 1970) studied healthy, exceptional people rather than patients, and asked what motivates human beings at their best.

### The hierarchy of needs (1943, 1954)
From the most basic to the highest:
1. **Physiological**: food, water, air, sleep, warmth.
2. **Safety**: security, stability, protection from danger, order.
3. **Belongingness and love**: friendship, family, intimacy, acceptance.
4. **Esteem**: self-respect, achievement and competence, and respect and recognition from others.
5. **Self-actualisation**: "What a man can be, he must be": becoming everything one is capable of.
Maslow later added **self-transcendence** (1969): serving something beyond the self (altruism, spirituality), above self-actualisation.

### Two kinds of needs
- **Deficiency needs (D-needs)**: the lower four. They come from a lack; once satisfied they stop motivating. Their lack causes illness.
- **Being needs (B-needs) or metaneeds**: growth needs such as truth, beauty, justice, wholeness and meaning. They don't switch off when met; they grow. Denying them causes **metapathologies** (such as cynicism, apathy and alienation).

Maslow said lower needs are usually **prepotent** (more urgent), but the order is **not rigid**: an artist may starve for her work, and a soldier may give up safety for a cause.

### What self-actualisers are like
Maslow studied figures such as Abraham Lincoln, Albert Einstein and Eleanor Roosevelt, and estimated that fewer than one in a hundred people fully self-actualise. Their characteristics include:
- **Efficient perception of reality** and comfort with uncertainty
- **Acceptance** of self, others and nature
- **Spontaneity** and simplicity
- **Problem-centred** (focused on tasks outside themselves)
- **Detachment** and a need for privacy; **autonomy** from culture
- **Continued freshness of appreciation**
- **Peak experiences**: moments of intense joy, wonder and unity
- **Gemeinschaftsgefühl** (a feeling of kinship with humanity, borrowed from Adler)
- Deep but few close relationships; a **democratic character**; a philosophical, non-hostile **sense of humour**; **creativity**; **resistance to enculturation**

The **Jonah complex**: the fear of one's own greatness, which makes people evade their potential (named after the prophet who fled his calling).

:::widget sort
{
  "prompt": "Which level of Maslow's hierarchy is most at stake?",
  "buckets": ["Physiological", "Safety", "Belongingness", "Esteem", "Self-actualisation"],
  "items": [
    { "text": "A migrant worker in Surat skips meals to send money home", "bucket": 0 },
    { "text": "A woman stays in a violent home because she has nowhere safe to go", "bucket": 1 },
    { "text": "A new hostel student feels lonely and desperate to make friends", "bucket": 2 },
    { "text": "A junior doctor longs for her consultant's recognition of her skill", "bucket": 3 },
    { "text": "A retired banker begins learning the sitar at 65 because he always wanted to make music", "bucket": 4 },
    { "text": "A family whose house was destroyed in floods is anxious about where they will live next month", "bucket": 1 }
  ]
}
:::

:::trap Maslow never drew the pyramid
The famous pyramid was drawn by a management consultant, Charles McDermid, in 1960, and spread through business textbooks (Bridgman, Cummings and Ballard, 2019). Maslow wrote of a hierarchy that is **flexible**, with needs partly met at the same time. Exams still use "Maslow's pyramid"; add a line that the rigid, stepwise version is a later simplification.
:::

### How well does it hold up?
:::widget decide
{
  "scene": "Tay and Diener (2011) used Gallup World Poll data from 123 countries to test whether people's needs are met in Maslow's order, and how each need relates to well-being.",
  "ask": "Predict the main finding.",
  "choices": [
    { "label": "Needs were universal, and people only felt good from higher needs once lower needs were fully met", "verdict": "ok", "outcome": "The first half is right; the second half is not.", "why": "People in poor countries still reported positive feelings from social and respect needs even when basic needs were not fully met." },
    { "label": "Needs were broadly universal, but their fulfilment did not follow a strict order; different needs related to different kinds of well-being", "verdict": "best", "outcome": "Correct. Basic and safety needs related most to life evaluation; social and respect needs to positive feelings; and higher needs were linked to well-being even when lower needs went unmet.", "why": "This supports Maslow's needs but not a rigid stepwise hierarchy." },
    { "label": "Maslow's needs did not exist in most countries", "verdict": "ok", "outcome": "The needs were found across cultures.", "why": "The list of needs held up better than their strict ordering." }
  ]
}
:::

Other critiques: Maslow's sample of self-actualisers was small, hand-picked and defined by his own values; the hierarchy reflects an individualist culture (Nevis, 1983, proposed a Chinese hierarchy with belonging at the base and self-actualisation as service to society); and an early review (Wahba and Bridwell, 1976) found little support for the ranking. In many Indian traditions, the highest aim (moksha, liberation) is closer to **self-transcendence** than to individual self-actualisation.

:::clinician
Maslow's lasting influence is less the hierarchy than the shift to studying health, which seeded positive psychology. Kenrick and colleagues (Perspectives on Psychological Science, 2010) proposed an evolutionary renovation that replaces self-actualisation with mate acquisition, mate retention and parenting, which was controversial. In clinical work, the hierarchy is a pragmatic reminder: in disaster mental health and in severe poverty, psychological first aid begins with safety, food and shelter (the IASC guidelines' intervention pyramid places basic services and security at the base), and in Indian public mental health, social determinants (debt, housing, food insecurity) often must be addressed before talking therapies can help. Measures of need satisfaction in research today usually draw on self-determination theory (autonomy, competence, relatedness), which has stronger empirical support than Maslow's model.
:::

:::recall
1. List Maslow's five levels in order. || Physiological, safety, belongingness and love, esteem, self-actualisation (with self-transcendence added later).
2. Distinguish D-needs from B-needs. || D-needs come from lack and stop motivating once met; B-needs are growth needs that keep motivating.
3. What are metapathologies? || Problems such as cynicism, apathy and alienation from unmet B-needs.
4. What is the Jonah complex? || Fear of one's own greatness, leading people to avoid their potential.
5. Who actually drew the pyramid? || Charles McDermid, a consultant, in 1960.
6. What did Tay and Diener find? || Needs were universal but not fulfilled in a strict order; different needs related to different kinds of well-being.
:::

:::mcq
Q: Which of these is a B-need (being need) rather than a D-need?
- Safety
- *Justice and truth
- Esteem from others
- Belonging
> Metaneeds such as truth, beauty and justice are being needs.
:::

## 2.4 Existential personality: May, Frankl and Yalom [core][beginner]
Existential psychology starts from the hard facts of being human: we will die; we are free and therefore responsible; we are ultimately alone in our experience; and life has no meaning handed to us. Personality, in this view, is how a person **faces** these facts. The roots are in philosophers such as Kierkegaard, Nietzsche, Heidegger and Sartre.

### Rollo May (1909 to 1994)
May brought European existentialism to American psychology.
- **Dasein**: "being-in-the-world": the person and their world cannot be separated.
- **Three modes of world**: **Umwelt** (the biological and physical world: the body, needs, nature), **Mitwelt** (the world of relationships with others) and **Eigenwelt** (the world of one's relationship with oneself). Healthy people live in all three.
- **Normal versus neurotic anxiety**: **normal anxiety** is proportionate to a real threat (including the threat of non-being) and can be faced constructively; it is part of growth. **Neurotic anxiety** is disproportionate and leads to repression and withdrawal.
- **Normal and neurotic guilt**: guilt arises when we fail to fulfil our potential (ontological guilt), separate from others, or are disconnected from nature.
- **The daimonic**: any natural force (sex, anger, the drive for power) that can be creative or destructive depending on whether it is integrated. Repressed, it erupts as violence.
- **Love and will** (1969): four forms of love: **sex** (lust), **eros** (the drive to create and unite), **philia** (friendship), **agape** (selfless love). Will is the capacity to organise oneself towards a goal; modern people, May said, suffer from a split between love and will.
- **Freedom and destiny**: existential freedom (freedom of action) and essential freedom (freedom of being, to think and choose one's attitude), always within the limits of **destiny** (our givens: body, death, history).

### Viktor Frankl (1905 to 1997)
Frankl, a Viennese psychiatrist, survived Auschwitz and other camps, where his wife and parents died. In **Man's Search for Meaning** (1946) he described how prisoners who held on to a purpose were more likely to survive.
- **The will to meaning** is the primary human motive (in contrast to Freud's will to pleasure and Adler's will to power).
- **Three sources of meaning**: **creative** (what we give to the world: work, deeds), **experiential** (what we take from it: love, beauty, nature) and **attitudinal** (the stance we take towards unavoidable suffering).
- **The tragic triad**: pain, guilt and death, which everyone faces.
- **Existential vacuum**: a sense of emptiness and boredom; when it causes illness, Frankl called it **noogenic neurosis**.
- **Logotherapy** techniques: **paradoxical intention** (deliberately wishing for the feared thing: the insomniac tries to stay awake; the man afraid of sweating tries to sweat buckets), **dereflection** (shifting attention from oneself to something meaningful outside) and **Socratic dialogue**.

:::widget decide
{
  "scene": "Arjun, 32, is so anxious about blushing during presentations that he blushes more. He has tried everything to stop it. His logotherapist suggests something unusual before his next team meeting.",
  "ask": "Which suggestion is paradoxical intention?",
  "choices": [
    { "label": "“Before you speak, tell yourself: today I'll show them the reddest face they've ever seen.”", "verdict": "best", "outcome": "Arjun laughs at the idea, feels less tense, and blushes less.", "why": "Paradoxical intention reverses the struggle: wishing for the symptom, often with humour, breaks the cycle of anticipatory anxiety. Similar ideas appear in modern exposure and acceptance-based therapies." },
    { "label": "“Focus your attention on helping your team understand the project, not on your face.”", "verdict": "ok", "outcome": "This helps too.", "why": "That is dereflection, Frankl's other technique: turning attention away from oneself towards something meaningful." },
    { "label": "“Avoid presentations until the blushing stops.”", "verdict": "harm", "outcome": "His avoidance grows and the fear spreads to meetings.", "why": "Avoidance maintains anxiety; neither logotherapy nor exposure-based approaches would advise it." }
  ]
}
:::

### Irvin Yalom: the four givens
Yalom's **Existential Psychotherapy** (1980) organised the field around four **ultimate concerns**, each with a conflict:
| Given | The conflict |
|---|---|
| **Death** | Awareness of death versus the wish to go on living |
| **Freedom** | Being the author of one's life (responsibility) versus the wish for structure and someone else to decide |
| **Isolation** | Existential aloneness versus the wish for contact and to be part of a larger whole |
| **Meaninglessness** | A universe without given meaning versus the need for meaning |

:::widget sort
{
  "prompt": "Which of May's three modes of world is the person struggling with most?",
  "buckets": ["Umwelt (body and nature)", "Mitwelt (others)", "Eigenwelt (self)"],
  "items": [
    { "text": "After a diabetes diagnosis, Suresh feels betrayed by his body", "bucket": 0 },
    { "text": "A woman feels unseen by everyone in her joint family", "bucket": 1 },
    { "text": "A successful lawyer says, “I don't know who I really am under all this.”", "bucket": 2 },
    { "text": "A city-dweller feels cut off from nature and the seasons", "bucket": 0 },
    { "text": "A man cannot let anyone close after a divorce", "bucket": 1 },
    { "text": "A student can't decide what she values once her parents stop telling her", "bucket": 2 }
  ]
}
:::

:::example An existential crisis in the Bhagavad Gita
The Gita opens with Arjuna on the battlefield of Kurukshetra, unable to fight, his limbs trembling, overwhelmed by the meaning of killing his own kin and teachers. Indian psychologists have often read this as an **existential crisis** about duty, freedom and death. Krishna's response is not reassurance but a philosophy of action without attachment to results (nishkama karma), close to Frankl's attitudinal meaning. Pande and Naidu's research on **anasakti** (non-attachment) in the 1990s found that people higher in non-attachment reported less stress from the same life events.
:::

:::clinician
Empirically, meaning in life is now well measured (the Meaning in Life Questionnaire, Steger and colleagues, 2006, with presence and search subscales; the Purpose in Life test, Crumbaugh and Maholick, based on Frankl), and presence of meaning correlates with well-being and lower depression across cultures, including Indian samples. Meaning-centred psychotherapy for patients with advanced cancer (Breitbart and colleagues) has randomised-trial support for improving spiritual well-being and reducing hopelessness and desire for hastened death. Terror management theory (Greenberg, Pyszczynski and Solomon) operationalised Yalom's death anxiety experimentally, but the classic mortality-salience effect failed the Many Labs 4 replication, so treat its laboratory findings cautiously. Paradoxical intention has modest trial support for insomnia and some anxiety problems, and is conceptually close to exposure and to acceptance and commitment therapy's "willingness". Frankl's account of meaning in the camps is testimony and theory, not data, though later research on survivors supports the protective role of purpose.
:::

:::recall
1. Name May's three modes of world. || Umwelt (biological and physical), Mitwelt (others), Eigenwelt (self).
2. Distinguish normal from neurotic anxiety. || Normal: proportionate and faced constructively. Neurotic: disproportionate, leading to repression and withdrawal.
3. What is the daimonic? || A natural force (sex, anger, power) that can create or destroy depending on whether it is integrated.
4. Name May's four forms of love. || Sex, eros, philia, agape.
5. Give Frankl's three sources of meaning. || Creative, experiential, attitudinal.
6. Name Yalom's four givens. || Death, freedom, isolation, meaninglessness.
:::

:::mcq
Q: A man with insomnia is told by his therapist to try as hard as he can to stay awake all night. This is:
- Dereflection
- Socratic dialogue
- *Paradoxical intention
- Systematic desensitisation
> Wishing for the feared symptom breaks anticipatory anxiety.

Q: Frankl's term for illness arising from a lack of meaning is:
- Neurotic anxiety
- Existential guilt
- Metapathology
- *Noogenic neurosis
> Noogenic: of the spirit or meaning dimension.
:::

## 2.5 Bandura and Rotter: learning, expectancy and control [core][beginner]
Social-cognitive theories keep the behaviourists' rigour but add what happens **inside the head**: expectations, beliefs, goals and self-regulation.

### Albert Bandura (1925 to 2021)
**Reciprocal determinism** (triadic reciprocal causation): **person** factors (thoughts, feelings, biology), **behaviour** and the **environment** all influence each other. A shy student avoids class discussions (behaviour), so the teacher stops calling on her (environment), which confirms her belief that she has nothing to say (person).

**Observational learning** (modelling) has four sub-processes:
1. **Attention**: we must notice the model (more likely if the model is attractive, similar, high status or rewarded).
2. **Retention**: we must remember what we saw, in images or words.
3. **Reproduction**: we must be able to perform it.
4. **Motivation**: we must have a reason to do it (direct, vicarious or self-reinforcement).

:::mnemonic Modelling: "ARRM"
**A**ttention, **R**etention, **R**eproduction, **M**otivation. Or remember: you can't copy what you didn't **see**, can't **remember**, can't **do**, or don't **want** to do.
:::

**Self-efficacy** (1977) is the belief in one's capability to organise and carry out the actions needed to achieve a goal. It is **specific** ("I can give an injection", not "I am a capable person") and it is different from **outcome expectancy** ("If I study, I'll pass"). You can believe studying works (outcome) yet doubt you can make yourself study (efficacy). Four sources:
| Source | Example | Strength |
|---|---|---|
| **Mastery experiences** (performance accomplishments) | Successfully doing it yourself | Strongest |
| **Vicarious experience** | Watching a similar person succeed | Moderate |
| **Verbal (social) persuasion** | A supervisor saying "you can do this" | Weaker on its own |
| **Physiological and emotional states** | Reading a racing heart as excitement, not as "I can't cope" | Varies |

:::widget sort
{
  "prompt": "Which source of self-efficacy is being built?",
  "buckets": ["Mastery", "Vicarious", "Verbal persuasion", "Physiological state"],
  "items": [
    { "text": "An intern takes blood successfully from three patients in a row", "bucket": 0 },
    { "text": "A shy student watches a classmate like her give a confident seminar", "bucket": 1 },
    { "text": "A coach tells a nervous athlete, “You've trained for this; you're ready.”", "bucket": 2 },
    { "text": "Before a viva, a student learns to label her pounding heart as energy, not panic", "bucket": 3 },
    { "text": "A man recovering from a heart attack walks a little further each day", "bucket": 0, "why": "Graded tasks that guarantee success are the most powerful builder of self-efficacy, used in cardiac and stroke rehabilitation." },
    { "text": "A diabetic patient sees a video of someone her age learning to inject insulin", "bucket": 1 }
  ]
}
:::

**Self-regulation**: people set standards, monitor their behaviour, and reward or criticise themselves. **Moral disengagement** explains how people do harm while feeling moral, through eight mechanisms: moral justification, euphemistic labelling, advantageous comparison, displacement and diffusion of responsibility, distorting the consequences, dehumanisation and blaming the victim. **Collective efficacy** is a group's shared belief in its ability to act together.

### Julian Rotter (1916 to 2014)
Rotter's **social learning theory** (1954) predicts behaviour with a formula:
**Behaviour potential = f (Expectancy and Reinforcement value)**
- **Behaviour potential**: how likely a behaviour is in a situation.
- **Expectancy**: how likely the person thinks it is that the behaviour will lead to the reinforcement.
- **Reinforcement value**: how much the person wants that reinforcement.
- **The psychological situation**: the situation as the person perceives it.

From many experiences, people form **generalised expectancies**, the best known being **locus of control** (Rotter, 1966):
- **Internal locus**: "What happens to me depends on what I do."
- **External locus**: "What happens to me depends on luck, fate or powerful others."

Rotter's **I-E scale** has 29 forced-choice pairs (23 scored, 6 fillers); a higher score means a more **external** locus. Hanna Levenson's **IPC scale** split external into **powerful others** and **chance**, which is useful in societies with strong hierarchies, and is widely used in Indian research.

Internal locus is generally linked with better health behaviours, academic achievement and coping, but it is not always better: an internal locus in an uncontrollable situation can produce self-blame, and in conditions of real discrimination an external belief may be accurate.

:::widget decide
{
  "scene": "Two farmers in Vidarbha face the same failed monsoon. Ramesh says, “If I switch crops and use drip irrigation, I can get through this.” Govind says, “It's all in God's hands and the moneylender's; what I do changes nothing.”",
  "ask": "Which statement is most accurate about locus of control here?",
  "choices": [
    { "label": "Ramesh has an internal locus and is likely to take active steps; but if the situation is genuinely uncontrollable, his self-blame may grow when things fail", "verdict": "best", "outcome": "This is the nuanced answer.", "why": "Internal locus predicts active coping, but beliefs must fit reality. Interventions should give real control (credit, crop insurance, irrigation) as well as change beliefs." },
    { "label": "Govind's external locus is a symptom of depression", "verdict": "ok", "outcome": "It may be, but not necessarily.", "why": "External locus is a belief pattern, often shaped by real powerlessness, debt and caste; it is not a diagnosis." },
    { "label": "Locus of control doesn't apply to rural communities", "verdict": "harm", "outcome": "Useful insights about agency and support are missed.", "why": "Locus of control has been studied widely in rural India and predicts coping and help-seeking." }
  ]
}
:::

:::clinician
Self-efficacy is among the most-used constructs in health psychology: it predicts adherence, rehabilitation outcomes and smoking cessation, and the four sources map onto intervention techniques (graded tasks, peer modelling, encouragement, and arousal reappraisal). Bandura's 1977 study with snake phobics showed that participant modelling (guided mastery) produced the largest increases in efficacy and in approach behaviour, and that efficacy predicted behaviour better than past performance. Distinguish self-efficacy (capability belief, task-specific), self-esteem (global self-worth), and locus of control (contingency belief about outcomes). Twenge, Zhang and Im's meta-analysis (Personality and Social Psychology Review, 2004) reported a shift towards external locus among young Americans from 1960 to 2002. Bandura's moral disengagement scale has been used in Indian research on bullying, corruption and communal violence. Rotter's formula is an expectancy-value model, the same family as Atkinson's achievement motivation and Vroom's work motivation.
:::

:::recall
1. What is reciprocal determinism? || Person, behaviour and environment all influence each other.
2. Name the four sub-processes of observational learning. || Attention, retention, reproduction, motivation.
3. Distinguish self-efficacy from outcome expectancy. || Self-efficacy: I can do it. Outcome expectancy: doing it will lead to the result.
4. What is the strongest source of self-efficacy? || Mastery experiences.
5. State Rotter's formula. || Behaviour potential = f (expectancy and reinforcement value).
6. What does Levenson's IPC scale add? || It splits external locus into powerful others and chance.
:::

:::mcq
Q: A student is sure that regular revision leads to good marks, but doubts she can stick to a revision schedule. Bandura would say she has:
- *High outcome expectancy but low self-efficacy
- Low outcome expectancy and high self-efficacy
- An external locus of control
- Low reinforcement value
> She believes in the link but not in her ability to act on it.
:::

## 2.6 Mischel and Kelly: the person as a system and as a scientist [core][beginner]
### Walter Mischel (1930 to 2018)
After challenging traits in 1968 (section 2.1), Mischel built a theory of how people can be both **variable and consistent**.

**Delay of gratification**: in the famous "marshmallow test" at Stanford's Bing Nursery School (Mischel, Ebbesen and Zeiss, 1972), a preschool child could eat one treat now, or wait alone (often up to 15 or 20 minutes) for the researcher to return and get two. Children who distracted themselves (singing, covering their eyes, thinking of the marshmallow as a cloud) waited longest: self-control was a **skill of attention and thought**, not just willpower. Follow-ups (Shoda, Mischel and Peake, 1990) reported that children who waited longer had higher SAT scores and better coping in adolescence.

:::widget decide
{
  "scene": "Watts, Duncan and Quan (2018) repeated the marshmallow test with about 900 children from a large, diverse US study, and followed them to age 15. This time they also measured family background and early cognitive ability.",
  "ask": "Predict what they found.",
  "choices": [
    { "label": "The link between waiting and later achievement was as strong as in the original study", "verdict": "ok", "outcome": "The link was much weaker.", "why": "The original follow-ups had small, privileged samples from a university nursery." },
    { "label": "The link was about half the size, and shrank by about two-thirds after accounting for family background and early ability", "verdict": "best", "outcome": "Correct. Waiting predicted achievement modestly, but much of that was explained by social and cognitive factors; and waiting did not predict behaviour problems at 15.", "why": "Delay is partly a marker of the child's circumstances: a child from a home where promises are often broken may sensibly take the treat now (Kidd and colleagues, 2013, showed children waited less after an unreliable experimenter)." },
    { "label": "There was no link at all with any later outcome", "verdict": "ok", "outcome": "A modest link remained for achievement.", "why": "It was a conceptual replication with a smaller, more qualified effect, not a total failure." }
  ]
}
:::

**The cognitive-affective personality system (CAPS)** (Mischel and Shoda, 1995): personality is a stable network of **cognitive-affective units** that become active in particular situations. The five units:
1. **Encodings**: how I categorise situations, people and myself ("this is a test of my competence").
2. **Expectancies and beliefs**: about outcomes and my own efficacy.
3. **Affects**: feelings and emotional reactions.
4. **Goals and values**: what I want and care about.
5. **Competencies and self-regulatory plans**: what I can do and how I manage myself.

**If-then behavioural signatures**: consistency lies in stable patterns such as "**if** teased by peers, **then** aggressive; **if** warned by an adult, **then** compliant". Shoda, Mischel and Wright (1994) observed children at a summer camp hour by hour and found that two children with the same average aggression had very different, but stable, if-then profiles.

### George Kelly (1905 to 1967)
Kelly's **The Psychology of Personal Constructs** (1955) began from his experience as a counsellor in rural Kansas, where he found that his explanations helped clients even when they were made up; what mattered was a new way of seeing.

- **The person as scientist**: everyone forms hypotheses about the world, tests them and revises them.
- **Constructive alternativism**: there are always alternative ways to interpret (construe) events; nobody is a victim of their biography.
- **Personal constructs**: **bipolar** dimensions we use to make sense of people and events (friendly versus cold, safe versus dangerous). Each person has their own set.
- **The fundamental postulate**: "A person's processes are psychologically channelised by the ways in which he anticipates events."
- **Eleven corollaries** elaborate it, including **construction** (we anticipate by construing replications of events), **individuality** (people differ in their constructions), **organisation** (constructs form a hierarchy), **dichotomy** (constructs have two poles), **choice** (we choose the pole that best extends our system), **range** (each construct applies to a limited range of events), **experience** (constructs change as we experience events), **modulation** (how permeable a system is to change), **fragmentation** (we can hold inconsistent subsystems), **commonality** (similar constructions make people psychologically similar) and **sociality** (to relate to someone, we must construe their constructions).

:::mnemonic Kelly's eleven corollaries
"**C**an **I** **O**rganise **D**ichotomous **C**hoices **R**ange **E**xperience **M**odulate **F**ragments **C**ommonly **S**ocially": construction, individuality, organisation, dichotomy, choice, range, experience, modulation, fragmentation, commonality, sociality.
:::

**Emotions redefined** in construct terms:
- **Anxiety**: realising that events lie outside the range of one's constructs.
- **Threat**: awareness of an imminent, comprehensive change in core constructs.
- **Guilt**: being dislodged from one's core role.
- **Hostility**: trying to extort evidence for a prediction that has already failed.

**The Role Construct Repertory Test (Rep test)**: the client lists important people (mother, a teacher, someone they dislike, their ideal self); then, taking them three at a time, says how two are alike and different from the third. The answers reveal the client's constructs. The **repertory grid** turns this into a matrix that can be analysed numerically.

**Fixed-role therapy**: the therapist and client write a sketch of a new character, and the client acts as that person for a short, agreed period, to experiment with new constructs.

:::widget worked
{
  "title": "Eliciting constructs with the Rep test: Sunita, 28",
  "steps": [
    { "q": "Sunita is given three cards: 'My father', 'My best friend', 'A boss I disliked'. How are two alike and different from the third?", "a": "“My father and my old boss both made me feel small. My best friend makes me feel heard.” The construct: makes me feel small versus makes me feel heard." },
    { "q": "Next triad: 'My mother', 'Myself', 'A teacher I admired'. Two alike, one different?", "a": "“My mother and I always put others first. My teacher said no when she needed to.” Construct: self-sacrificing versus able to say no." },
    { "q": "What does the therapist do with these constructs?", "a": "Notice which constructs are core and how Sunita places herself on them. She construes herself at the 'self-sacrificing' pole and links 'able to say no' with people she admires but feels distant from." },
    { "q": "How might fixed-role therapy use this?", "a": "Write a sketch of a character who is warm but can say no, and invite Sunita to experiment by living as that person for a short period, then review what she learnt." }
  ],
  "yourTurn": [
    { "q": "A client puts every person in his grid at the 'trustworthy' or 'betrayer' pole, with no one in between, and he has few other constructs. What does this suggest about his construct system?", "a": "A tight, constricted system dominated by one core construct, so new people can only be seen in these terms. Therapy would aim to loosen and elaborate it with new constructs." }
  ]
}
:::

:::clinician
CAPS anticipated modern idiographic and network approaches to personality and psychopathology (for example, ecological momentary assessment and person-specific network models). Kelly's influence runs through cognitive therapy (Beck acknowledged the parallel between constructs and schemas), constructivist therapies and research methods: repertory grids are still used in clinical research, organisational psychology and market research, and software computes construct correlations and principal components. On the marshmallow research: Mischel himself always emphasised that the strategies, not the child's fixed willpower, were the point; the Watts and colleagues conceptual replication (Psychological Science, 2018) and later analyses refined, rather than refuted, the idea that early self-regulation is one of many predictors of later outcomes. Gratification delay and executive function are also shaped by poverty and scarcity, which links to Indian research on how scarcity taxes cognitive bandwidth (Mani and colleagues, Science 2013, with sugarcane farmers in Tamil Nadu performing worse on cognitive tests before harvest than after).
:::

:::recall
1. What did children who waited longest in the marshmallow test do? || Distracted themselves or changed how they thought about the treat.
2. What did Watts and colleagues find? || The link with later achievement was about half the original, and largely explained by background and early ability.
3. Name Mischel's five cognitive-affective units. || Encodings, expectancies and beliefs, affects, goals and values, competencies and self-regulatory plans.
4. What is an if-then signature? || A stable pattern of behaving in particular ways in particular situations.
5. State Kelly's fundamental postulate. || A person's processes are psychologically channelised by the ways in which he anticipates events.
6. How did Kelly define anxiety? || Recognising that events lie outside the range of convenience of one's constructs.
:::

:::mcq
Q: In Kelly's theory, an emotion defined as "trying to force evidence for a prediction that has already failed" is:
- Anxiety and fear
- *Hostility
- Guilt
- Threat
> Extorting validation for a failed construction.

Q: A child is aggressive when teased by peers but very obedient when corrected by teachers, and this pattern is stable for months. Mischel would describe this as:
- Low trait consistency, so personality doesn't exist
- A cardinal trait
- *A stable if-then behavioural signature
- Reciprocal determinism
> Consistency lies in the situation-behaviour pattern.
:::

## 2.7 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: Averaging behaviour across many occasions to raise trait-behaviour correlations was shown by:
- Walter Mischel
- Gordon Allport
- William Fleeson
- *Seymour Epstein
> Aggregation, 1979.

Q: People becoming, on average, more conscientious and less neurotic with age is called:
- *The maturity principle
- Cumulative continuity
- Rank-order stability of traits
- Functional autonomy
> Roberts and colleagues' mean-level finding.

Q: Rogers called the gap between self-concept and actual experience:
- Conditions of worth
- The phenomenal field
- *Incongruence
- Positive regard
> Incongruence leads to threat and defence.

Q: Which is NOT one of Rogers's core conditions?
- Empathy
- *Interpreting the transference
- Genuineness
- Unconditional positive regard from the therapist
> Interpretation belongs to psychodynamic therapy.

Q: In Maslow's theory, being needs differ from deficiency needs because they:
- Are more urgent than physiological needs
- Appear only in childhood
- Are shared only by animals
- *Continue to motivate after they are met
> B-needs are growth needs.

Q: The fear of one's own greatness, in Maslow's terms, is the:
- *Jonah complex
- Metapathology
- Peak experience
- Existential vacuum
> Named after the prophet who fled his calling.

Q: May's Eigenwelt refers to the:
- Physical and biological world
- *Relationship with oneself
- World of relationships with others
- Collective unconscious
> Eigenwelt: own world.

Q: Frankl's attitudinal source of meaning refers to:
- What we create
- What we experience in love, nature and beauty
- Our relationships with others
- *Our stance towards unavoidable suffering
> Meaning through attitude when suffering cannot be changed.

Q: Yalom's four ultimate concerns are death, freedom, isolation and:
- Guilt and shame
- Anxiety
- *Meaninglessness
- Love and belonging
> The four givens.

Q: The strongest source of self-efficacy in Bandura's theory is:
- *Mastery experiences
- Verbal persuasion
- Vicarious experience
- Physiological states
> Doing it yourself.

Q: Bandura's model where person, behaviour and environment influence each other is:
- Self-regulation
- Observational learning
- *Reciprocal determinism
- Moral disengagement
> Triadic reciprocal causation.

Q: On Rotter's I-E scale, a higher score indicates:
- A more internal locus
- Higher self-efficacy
- Higher reinforcement value
- *A more external locus
> Scored in the external direction.

Q: Which is one of Mischel's five cognitive-affective units?
- Source traits
- *Encodings
- Ergs
- Conditions of worth
> Encodings: how we categorise situations and people.

Q: Kelly's view that events can always be interpreted in alternative ways is called:
- *Constructive alternativism
- The fundamental postulate of anticipation
- The range corollary
- The commonality corollary
> Nobody need be a victim of their biography.

Q: In fixed-role therapy, the client:
- Lies on a couch and free-associates
- *Acts as a newly written character for a while
- Is given tokens and rewards for each new behaviour
- Sorts cards into piles
> An experiment with new constructs.
:::
`;
