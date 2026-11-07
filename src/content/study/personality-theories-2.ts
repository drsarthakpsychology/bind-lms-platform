/* Module · Theories of personality, Part III (Advanced) and the exam zone. Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: biology, evolution, Indian views and the self

## 3.1 Biological personality: brain systems and genes [core][advanced]
Eysenck opened the door (section 1.3). Later theorists replaced his arousal idea with models of **reward and threat systems**, and behaviour genetics asked how much of personality is inherited and how.

### Jeffrey Gray's reinforcement sensitivity theory (RST)
Gray, Eysenck's student, rotated Eysenck's E and N by about 30 degrees and proposed two (later three) brain systems:
| System | Responds to | Personality outcome |
|---|---|---|
| **Behavioural activation (approach) system, BAS** | Signals of reward and non-punishment | High BAS: impulsivity, reward-seeking, positive emotion (dopamine pathways) |
| **Behavioural inhibition system, BIS** | In the revised theory of 2000: **conflict** between approach and avoidance, novelty | High BIS: anxiety, worry, rumination, risk assessment (septo-hippocampal system) |
| **Fight-flight-freeze system, FFFS** | Punishment and clear threat | High FFFS: fear, active avoidance, panic (amygdala, periaqueductal grey) |
Gray's model separates **fear** (FFFS: getting away from a clear threat) from **anxiety** (BIS: approaching a threat with caution), which maps onto the difference between panic or phobia and generalised worry. Carver and White's **BIS/BAS scales** (1994) measure the systems.

:::widget brainmap
{
 "title": "Where Gray's three systems are thought to live",
 "focus": [
  "basal-ganglia",
  "hippocampus",
  "amygdala"
 ],
 "notes": {
  "basal-ganglia": "BAS: dopamine reward pathways through the striatum drive approach and reward seeking.",
  "hippocampus": "BIS: the septo-hippocampal system detects conflict between approach and avoidance and drives anxious risk assessment.",
  "amygdala": "FFFS: with the periaqueductal grey, drives fear, escape and freezing in the face of clear threat."
 },
 "caption": "Fear (FFFS) gets you away from danger; anxiety (BIS) makes you approach it cautiously. Anxiolytic medicines act more on BIS-type anxiety."
}
:::

### Robert Cloninger's psychobiological model
Cloninger's **Temperament and Character Inventory (TCI)** has four inherited **temperaments**, each originally tied to a neurotransmitter, and three learnt **character** dimensions:
| Temperament | Description | Proposed transmitter |
|---|---|---|
| **Novelty seeking** | Exploratory, impulsive, easily bored | Dopamine |
| **Harm avoidance** | Worrying, shy, fearful, easily tired | Serotonin |
| **Reward dependence** | Sentimental, warm, sensitive to social approval | Noradrenaline |
| **Persistence** | Industrious, determined despite frustration | (Partial reinforcement) |
**Character**: **self-directedness** (responsibility, purpose), **cooperativeness** (empathy, helpfulness) and **self-transcendence** (spiritual acceptance, feeling part of a larger whole). Low self-directedness and low cooperativeness together are a good marker of personality disorder.

### Sensation seeking and behavioural inhibition
- **Marvin Zuckerman's sensation seeking**: the need for varied, novel, complex and intense experience, with four subscales: **thrill and adventure seeking**, **experience seeking**, **disinhibition** and **boredom susceptibility**. It predicts risky driving, substance use and extreme sports.
- **Jerome Kagan's behavioural inhibition**: about one in five infants are "high-reactive" at four months (much crying and limb movement to new sights and sounds). Many become shy, cautious toddlers. As adults, the inhibited group showed stronger amygdala responses to unfamiliar faces. Most inhibited children become less shy over time, but they remain at higher risk of social anxiety.

### Behaviour genetics
**How it works**: identical (MZ) twins share almost all their genes; non-identical (DZ) twins share about half. If MZ twins are much more similar than DZ twins, genes matter. **Adoption studies** compare children with their biological and adoptive parents.

:::widget decide
{
  "scene": "The Minnesota Study of Twins Reared Apart, led by Thomas Bouchard, found identical twins separated in infancy and raised in different families, sometimes different countries, and compared them with identical twins raised together.",
  "ask": "Predict how similar the separated twins were in personality.",
  "choices": [
    { "label": "Much less similar than twins raised together, because family environment shapes personality", "verdict": "ok", "outcome": "That is the intuitive guess, but not the result.", "why": "If the shared home mattered a lot, being raised together should make twins much more alike." },
    { "label": "About as similar as identical twins raised together", "verdict": "best", "outcome": "Correct. On personality questionnaires, MZ twins reared apart correlated about as highly (around 0.5) as MZ twins reared together.", "why": "Genes contribute substantially; and growing up in the same family adds surprisingly little to similarity. The rest is non-shared environment and error." },
    { "label": "Not similar at all", "verdict": "ok", "outcome": "They were clearly similar.", "why": "Correlations of around 0.5 are substantial for personality measures." }
  ]
}
:::

Three key conclusions (Plomin's "laws"):
1. Most traits are **moderately heritable** (about 40 to 50%).
2. The **shared environment** (what siblings have in common) explains little of adult personality.
3. The **non-shared environment** (unique experiences) explains a lot.

:::widget flow
{
 "title": "How twin studies estimate heritability",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "Measure the trait in MZ and DZ twin pairs",
   "detail": "Identical twins share almost all genes; non-identical twins about half."
  },
  {
   "id": "b",
   "label": "Compare the correlations",
   "detail": "If MZ twins correlate much more than DZ twins, genes matter."
  },
  {
   "id": "c",
   "label": "Estimate heritability",
   "detail": "A rough rule doubles the difference: 2 x (MZ correlation minus DZ correlation). For personality this gives about 40%."
  },
  {
   "id": "d",
   "label": "Split the environment",
   "detail": "Shared environment (what siblings have in common) comes out near zero; non-shared environment and error are large."
  }
 ],
 "caption": "Adoption studies and twins reared apart check the same conclusions with different assumptions."
}
:::

### The search for personality genes
In 1996, two studies reported that a variant of the dopamine D4 receptor gene (**DRD4**) was linked to **novelty seeking**. It caused great excitement, but meta-analyses found the link **did not replicate**. The same happened with the serotonin transporter gene and neuroticism. Today's genome-wide studies, with hundreds of thousands of people, find **hundreds of genetic variants each with tiny effects** on traits such as neuroticism. Personality is **polygenic**: no "anxiety gene" exists.

:::trap The candidate-gene lesson
Exams may ask about "the gene for novelty seeking". The right answer is that early **candidate-gene** findings (DRD4 and novelty seeking; 5-HTTLPR and neuroticism) failed to replicate. Personality, like most psychological traits, is influenced by thousands of variants of very small effect, plus environment.
:::

:::widget sort
{
  "prompt": "Gray's revised RST: which system is most active?",
  "buckets": ["BAS (approach)", "BIS (conflict, anxiety)", "FFFS (fear)"],
  "items": [
    { "text": "A trader excitedly chases a big win after a small profit", "bucket": 0 },
    { "text": "A student circles the exam hall door, wanting to go in and dreading it", "bucket": 1, "why": "Approach-avoidance conflict with cautious risk assessment is BIS." },
    { "text": "A woman runs from a snake on a forest path", "bucket": 2 },
    { "text": "A man lies awake ruminating about whether to propose", "bucket": 1 },
    { "text": "A teenager can't resist trying every new street food stall", "bucket": 0 },
    { "text": "A soldier freezes at a sudden gunshot", "bucket": 2 }
  ]
}
:::

:::clinician
Neuroscience of the Big Five: Colin DeYoung's 2010 study reported structural correlates (for example, extraversion with medial orbitofrontal volume, neuroticism with regions involved in threat and punishment), the basis of DeYoung's cybernetic Big Five theory. Larger, preregistered analyses have been sobering: a 2020 study of over 1,100 participants, with replication samples, found no robust associations between Big Five traits and brain structure. Treat single-sample brain-trait findings with caution. Molecular: the 2018 neuroticism GWAS (about 449,000 participants) identified 136 loci, with genetic correlations between neuroticism and depression, anxiety and schizophrenia. Clinically, Cloninger's TCI is used in Indian psychiatric research (for example, in studies of bipolar disorder and substance use), and harm avoidance is consistently raised in depression and anxiety disorders, partly as a state effect. The RST distinction between fear and anxiety has pharmacological support: anxiolytics affect BIS-type risk assessment more than FFFS-type escape.
:::

:::recall
1. Name the three systems in Gray's revised RST. || BAS (approach), BIS (conflict and anxiety), FFFS (fight-flight-freeze, fear).
2. Name Cloninger's four temperaments and their proposed transmitters. || Novelty seeking (dopamine), harm avoidance (serotonin), reward dependence (noradrenaline), persistence.
3. Name Cloninger's three character dimensions. || Self-directedness, cooperativeness, self-transcendence.
4. Name Zuckerman's four sensation-seeking subscales. || Thrill and adventure seeking, experience seeking, disinhibition, boredom susceptibility.
5. What did the Minnesota twins-reared-apart study find? || Identical twins reared apart were about as similar in personality as those reared together.
6. What happened to the DRD4-novelty seeking link? || It failed to replicate.
:::

:::mcq
Q: A worried student keeps weighing the pros and cons of approaching her supervisor, unable to decide. In Gray's revised theory, this most reflects:
- BAS activity
- FFFS activity
- Low harm avoidance
- *BIS activity
> Approach-avoidance conflict and risk assessment are BIS functions.

Q: In behaviour-genetic studies of adult personality, which source of variation is usually the smallest?
- Genes
- The non-shared environment
- *The shared family environment
- Measurement error in questionnaires
> Siblings raised together are little more alike than those raised apart.
:::

## 3.2 Evolutionary personality [extra][advanced]
Evolutionary psychology asks two questions about personality: **Why do we have the traits we do?** and **why do people differ so much**, if natural selection favours the best design?

### David Buss: personality as solutions to adaptive problems
Buss argues that humans faced recurring **adaptive problems** (finding mates, forming alliances, getting status, avoiding danger, caring for children), and that the Big Five correspond to the most important differences people track in others when solving them: **Who is dominant and active? (extraversion) Who is cooperative? (agreeableness) Who is reliable? (conscientiousness) Who is emotionally stable? (neuroticism) Who is creative and knowledgeable? (openness).** That is why these traits are so heavily coded in language.

### Why does variation persist?
1. **Balancing selection through trade-offs**, an argument made by Daniel Nettle: each trait has costs and benefits, and the balance depends on the environment, so no single level is best.
| Trait | Benefits | Costs |
|---|---|---|
| **Extraversion** | Mating success, social allies, exploration | Physical risk, accidents, family instability |
| **Neuroticism** | Vigilance to danger, striving | Stress, depression, poorer health |
| **Openness** | Creativity, attractiveness to mates | Unusual beliefs, risk of psychosis-like experiences |
| **Conscientiousness** | Long-term planning, health, longevity | Rigidity, missed short-term opportunities |
| **Agreeableness** | Cooperation and trust | Being exploited; lower status-seeking |
2. **Frequency-dependent selection**: a strategy does well when it is rare. If most people are cooperative, a few cheaters gain; as cheaters become common, the advantage disappears.
3. **Environmental variation**: different environments (stable or unpredictable, rich or scarce) favour different traits.
4. **Mutation-selection balance**: many small harmful mutations accumulate, adding variation.

### Life history theory
Life history strategies range from **fast** (early sexual maturity, more partners, less parental investment, more risk-taking: favoured in harsh, unpredictable environments) to **slow** (later maturity, fewer children, high investment, long-term planning). Some researchers link personality profiles to these strategies.

### Sex differences
David Buss's team (1992) asked students which would upset them more: a partner forming a deep **emotional** attachment to someone else, or a partner enjoying **sexual** intercourse with someone else. Men more often chose sexual infidelity and women emotional infidelity, which Buss explained by men's uncertainty about paternity and women's need for a partner's investment.

:::widget decide
{
  "scene": "You are writing a 15-mark answer on evolutionary explanations of sex differences in jealousy, using the Buss (1992) finding.",
  "ask": "Which evaluation is strongest?",
  "choices": [
    { "label": "This proves men and women evolved different jealousy modules", "verdict": "harm", "outcome": "The examiner marks you down for overclaiming.", "why": "One forced-choice finding cannot prove an evolved module." },
    { "label": "Report the finding, then note that the difference depends heavily on the forced-choice method, shrinks with continuous ratings, varies across cultures, and can be explained by beliefs that one type of infidelity implies the other; present the evolutionary account as one plausible explanation", "verdict": "best", "outcome": "A balanced, high-scoring answer.", "why": "Critics (DeSteno, Harris and others) showed the effect is method-dependent. Good answers weigh evolutionary, social-role and cognitive explanations." },
    { "label": "Dismiss evolutionary psychology as unscientific", "verdict": "ok", "outcome": "Too sweeping.", "why": "Some evolutionary predictions are testable and supported; the problem is overclaiming from weak data." }
  ]
}
:::

### Animal personality
Personality is not only human. Gosling (2001) reviewed studies showing that observers can reliably rate animals (from chimpanzees and hyenas to octopuses and fish) on dimensions resembling extraversion, neuroticism and agreeableness. Bold and shy guppies differ in how they inspect predators, with survival costs and benefits. This supports the idea that personality differences have deep biological roots.

:::clinician
Critiques of evolutionary personality psychology centre on "just-so stories" (post hoc adaptive explanations), the difficulty of testing claims about ancestral environments, and the risk of naturalising social inequalities. Life-history accounts of personality have weakened: recent analyses found that the "fast-slow" personality factor does not hold together as predicted, and that associations with childhood adversity are weak or inconsistent. Better-supported clinical links are the trade-off accounts: for example, the association of openness and creativity with schizotypy and the familial co-aggregation of creativity with bipolar disorder (Swedish registry studies), and the vigilance benefits that may help explain why high neuroticism persists despite its health costs.
:::

:::recall
1. What is Buss's explanation of why the Big Five exist? || They are the most important differences people track in others when solving adaptive problems such as mating and alliances.
2. Give three reasons variation in traits persists. || Trade-offs (balancing selection), frequency-dependent selection, environmental variation, mutation-selection balance.
3. Give one benefit and one cost of extraversion. || Benefit: mating success or social allies. Cost: physical risk or family instability.
4. What is a fast life history strategy? || Early maturity, more partners, less parental investment, more risk-taking.
5. Give one critique of the Buss jealousy finding. || It depends on the forced-choice method and shrinks with continuous ratings.
:::

:::mcq
Q: Cheaters do well when they are rare but poorly when common. This explanation of trait variation is:
- *Frequency-dependent selection
- Mutation-selection balance
- Kin selection among relatives
- Life history theory
> The payoff of a strategy depends on how common it is.
:::

## 3.3 Indian views of personality: the gunas, prakriti and the self [core][advanced]
Indian thought offers some of the oldest systematic theories of personality. They were developed for living well and for liberation (moksha), not for laboratory prediction, so we should study them on their own terms and also ask what the evidence says.

### The three gunas
In **Samkhya** philosophy, all of nature (**prakriti**), including mind, is made of three **gunas** ("strands" or qualities). The **Bhagavad Gita** describes them in chapters 14, 17 and 18.
| Guna | Qualities | Typical behaviour |
|---|---|---|
| **Sattva** | Lightness, clarity, knowledge, calm, purity, harmony | Truthful, self-controlled, content, compassionate, steady in success and failure |
| **Rajas** | Activity, passion, desire, restlessness, attachment | Ambitious, driven, greedy for results, easily agitated, seeking pleasure and power |
| **Tamas** | Heaviness, inertia, darkness, dullness, delusion | Lethargic, careless, confused, sleeping too much, procrastinating, rigid |

Key ideas that make this a **personality theory**:
- **All three gunas are present in everyone**; their **relative balance** defines a person's nature at a given time.
- The balance is **dynamic**, not fixed. It can shift with food, company, habits, practice and spiritual discipline.
- The Gita applies the gunas to almost everything: kinds of faith, food, charity, knowledge, action and happiness. For example, **sattvic** food is fresh and nourishing; **rajasic** food is very spicy, sour or hot; **tamasic** food is stale or rotten.
- The aim is not simply to become sattvic but ultimately to go **beyond all three** (gunatita).

:::widget sort
{
  "prompt": "Which guna dominates in each description?",
  "buckets": ["Sattva", "Rajas", "Tamas"],
  "items": [
    { "text": "Remains calm and fair whether she wins or loses the election", "bucket": 0 },
    { "text": "Works day and night for promotion, restless and irritable when others succeed", "bucket": 1 },
    { "text": "Sleeps until noon, keeps postponing tasks and feels heavy and confused", "bucket": 2 },
    { "text": "Gives charity to show off at a public function", "bucket": 1, "why": "In the Gita, charity given expecting return or recognition is rajasic." },
    { "text": "Gives charity quietly, to a worthy person, at the right time, expecting nothing", "bucket": 0 },
    { "text": "Clings stubbornly to a mistaken belief and refuses to look at the facts", "bucket": 2 }
  ]
}
:::

:::widget layers
{
 "title": "The three gunas in the Bhagavad Gita",
 "shape": "stack",
 "layers": [
  {
   "label": "Sattva",
   "detail": "Clarity, calm, knowledge, harmony. Food: fresh and nourishing. Charity: given quietly, expecting nothing."
  },
  {
   "label": "Rajas",
   "detail": "Activity, passion, desire, restlessness. Food: very spicy, sour, hot. Charity: given for show or return."
  },
  {
   "label": "Tamas",
   "detail": "Inertia, dullness, confusion. Food: stale. Charity: given to the unworthy, at the wrong time."
  }
 ],
 "caption": "All three are present in everyone in a changing balance; the ideal is to go beyond them (gunatita)."
}
:::

### Measuring the gunas
Psychologists have built scales such as the **Vedic Personality Inventory** (developed by David Wolf) and Indian scales including the **Mysore Triguna Scale** and the related **Mysore Tridosha Scale** for Ayurvedic constitution (both developed in Mysore). Studies report that **sattva** scores go with emotional stability, conscientiousness and agreeableness; **tamas** with neuroticism and low conscientiousness; and **rajas** with extraversion and some neuroticism. Sattva scores also relate to well-being and lower stress. The cautions are that samples are often small, items can overlap with Big Five wording, and some scales have only content validity.

### Prakriti in Ayurveda
Ayurveda describes each person's constitution (**prakriti**) by three **doshas**: **vata** (air and space: quick, changeable, creative, anxious when imbalanced), **pitta** (fire: sharp, intense, ambitious, irritable when imbalanced) and **kapha** (earth and water: steady, calm, loyal, sluggish when imbalanced). A research programme called **Ayurgenomics** (for example, CSIR studies from 2008 onwards) has reported differences in gene expression and biochemistry between people classed as extreme vata, pitta and kapha types. These are early, interesting findings; they do not yet establish prakriti as a validated personality classification.

### The layered self in the Upanishads
The **Taittiriya Upanishad** describes five sheaths (**pancha kosha**) around the true self (**atman**), from outer to inner:
1. **Annamaya kosha**: the physical body (made of food).
2. **Pranamaya kosha**: the vital energy, breath.
3. **Manomaya kosha**: the mind of perception, feeling and desire.
4. **Vijnanamaya kosha**: the intellect, discrimination and judgment.
5. **Anandamaya kosha**: the sheath of bliss.

:::widget layers
{
 "title": "The pancha kosha: five sheaths around the self",
 "shape": "rings",
 "layers": [
  {
   "label": "Atman (the self)",
   "detail": "The true self at the centre, beyond all sheaths."
  },
  {
   "label": "Anandamaya kosha",
   "detail": "The sheath of bliss."
  },
  {
   "label": "Vijnanamaya kosha",
   "detail": "Intellect, discrimination and judgment."
  },
  {
   "label": "Manomaya kosha",
   "detail": "The mind of perception, feeling and desire."
  },
  {
   "label": "Pranamaya kosha",
   "detail": "Vital energy and breath."
  },
  {
   "label": "Annamaya kosha",
   "detail": "The physical body, 'made of food'."
  }
 ],
 "caption": "Tap from the outside in. Yoga-based therapies in India often use this model to organise practices from body to breath to mind."
}
:::

Vedantic thought also describes the **antahkarana** (the inner instrument) with four functions: **manas** (the mind that receives sensations and doubts), **buddhi** (the intellect that decides), **chitta** (the store of memories and impressions) and **ahamkara** (the "I-maker", the ego that claims experiences as "mine"). Suffering comes from identifying with the outer sheaths and the ego; liberation comes from realising the atman.

**Buddhist** psychology, by contrast, teaches **anatta** (no permanent self): what we call a person is a changing combination of five **skandhas** (form, sensation, perception, mental formations and consciousness).

:::mnemonic The five koshas, outside in
"**A**ll **P**eople **M**ust **V**alue **A**nanda": annamaya, pranamaya, manomaya, vijnanamaya, anandamaya.
:::

### Modern Indian personality psychology
- **Anasakti** (non-attachment, from the Gita): Naidu and Pande developed measures in the 1990s and found it buffered the effects of stress on well-being.
- **Durganand Sinha** and **Girishwar Misra** argued for indigenous concepts of self and well-being.
- **Anand Paranjpe** compared Western identity theories (Erikson) with Vedantic views of the self.
- **J. B. P. Sinha and R. C. Tripathi** (1994) showed that Indians hold **individualist and collectivist** values together, choosing between them by context: the "coexistence of opposites".
- Sudhir Kakar's psychoanalytic work on the Indian inner world, and Roland's "familial self", are covered in the module **Psychodynamics in depth**.

:::widget decide
{
  "scene": "A psychologist in Pune wants to include a triguna score in a clinical report for a man with depression, writing: “Patient is tamasic by nature; prognosis poor.”",
  "ask": "What is the best professional judgment?",
  "choices": [
    { "label": "Write it; triguna is part of Indian tradition, so it is valid", "verdict": "harm", "outcome": "The report labels the patient in a way that sounds fixed and moralising, and may lower expectations of recovery.", "why": "Depression itself raises 'tamasic' qualities (lethargy, heaviness). The gunas are dynamic in the tradition itself, and the scales are not validated for prognosis." },
    { "label": "If used at all, report it as a research measure describing current state, note that guna balance is dynamic, and base prognosis on validated clinical evidence", "verdict": "best", "outcome": "The report respects the patient's cultural framework without overstating the science.", "why": "Culturally meaningful concepts can aid engagement and formulation; claims in reports must match the evidence." },
    { "label": "Never mention Indian concepts in any clinical work", "verdict": "ok", "outcome": "You may lose a way to connect with patients who think in these terms.", "why": "Using the patient's own language can help engagement; the problem is misuse, not the concept." }
  ]
}
:::

:::clinician
Indian concepts are increasingly used in research and practice: yoga-based interventions grounded in the kosha model (for example, NIMHANS and S-VYASA studies on yoga for depression and schizophrenia, with promising but methodologically mixed trials), sattva-related constructs in well-being scales, and Gita-based counselling frameworks. Good scholarship separates three things: the philosophical system (to be understood in its own terms, including its goal of liberation rather than adjustment), psychological constructs derived from it (to be operationalised and validated like any construct, with convergent and discriminant validity against Big Five and well-being measures), and clinical applications (to be tested in trials). Avoid both romanticising and dismissing. For exams: be ready to compare triguna with Eysenck's or the Big Five model (dynamic balance versus stable traits; moral and spiritual valence versus value-neutral description; a goal of transcendence versus adaptation).
:::

:::recall
1. Name the three gunas with two qualities each. || Sattva (clarity, calm), rajas (activity, desire), tamas (inertia, dullness).
2. Which Gita chapters describe the gunas? || Chapters 14, 17 and 18.
3. How does the triguna model differ from Western trait models? || The balance is dynamic and changeable, it has moral and spiritual meaning, and the aim is to go beyond all three.
4. Name the five koshas from outer to inner. || Annamaya, pranamaya, manomaya, vijnanamaya, anandamaya.
5. Name the four functions of the antahkarana. || Manas, buddhi, chitta, ahamkara.
6. What does anasakti mean, and what did research find? || Non-attachment; it buffered the effect of stress on well-being.
:::

:::mcq
Q: In Vedantic psychology, the function of the inner instrument that decides and discriminates is:
- Manas
- Chitta
- *Buddhi
- Ahamkara
> Buddhi: the intellect that judges and decides.

Q: Which statement about the gunas is most consistent with the Bhagavad Gita?
- Each person has only one guna for life
- *All three are in everyone, in a shifting balance
- Tamas is the highest guna to cultivate
- The gunas apply only to food and diet, not to the mind
> Their balance shifts with habits, food, company and practice.
:::

## 3.4 The self and self-concept [core][advanced]
The **self-concept** is the set of beliefs a person holds about who they are. **Self-esteem** is how they **evaluate** that self. Both are central to personality, motivation and mental health.

### Classic ideas
- **William James** (1890) separated the **I** (the self as knower, the subject of experience) from the **Me** (the self as known, the object). The Me has a **material self** (body, possessions, family), a **social self** ("a man has as many social selves as there are individuals who recognise him") and a **spiritual self** (inner thoughts, values, conscience). His formula: **self-esteem = success divided by pretensions** (what we achieve relative to what we aspire to).
- **Charles Cooley's looking-glass self** (1902): we see ourselves as we imagine others see us.
- **George Herbert Mead** (1934): the self grows through social interaction, play and games, by taking the role of the **generalised other**.

### The self as knowledge
- **Self-schemas**, Hazel Markus's idea: organised beliefs about the self in specific areas ("I am independent"). People who are **schematic** for a trait process related information faster and remember it better.
- **Possible selves**, also from Markus: images of who we might become (hoped-for selves and feared selves) that guide motivation.
- **Self-discrepancy theory**, from E. Tory Higgins: we compare the **actual self** with two standards.
| Discrepancy | Feelings | Example |
|---|---|---|
| **Actual versus ideal** (who I hope to be) | **Dejection**: sadness, disappointment, depression | "I wanted to be a doctor and I'm not" |
| **Actual versus ought** (who I should be, duty) | **Agitation**: anxiety, guilt, fear | "I should be looking after my parents and I'm not" |
Higgins later added **regulatory focus**: a **promotion** focus (towards ideals, gains) and a **prevention** focus (towards duties, avoiding losses).

:::widget sort
{
  "prompt": "Self-discrepancy theory: which feeling is most likely?",
  "buckets": ["Dejection (actual versus ideal)", "Agitation (actual versus ought)"],
  "items": [
    { "text": "Nisha always dreamed of becoming a singer but works in a call centre", "bucket": 0 },
    { "text": "A son feels he has failed his duty by moving abroad and leaving his ageing parents", "bucket": 1 },
    { "text": "A doctor hoped to publish research but never found the time", "bucket": 0 },
    { "text": "A daughter-in-law believes she should cook for the whole family daily but cannot manage with her job", "bucket": 1 },
    { "text": "A runner wished to finish the marathon in under four hours and didn't", "bucket": 0 },
    { "text": "A trainee feels he should never make mistakes in front of the consultant", "bucket": 1 }
  ]
}
:::

:::widget flow
{
 "title": "Higgins's self-discrepancy theory",
 "layout": "tree",
 "nodes": [
  {
   "id": "a",
   "label": "Actual self compared with..."
  },
  {
   "id": "i",
   "label": "Ideal self (hopes and wishes)",
   "parent": "a",
   "detail": "Gap brings dejection: sadness, disappointment, depression. Linked to a promotion focus on gains."
  },
  {
   "id": "o",
   "label": "Ought self (duties and obligations)",
   "parent": "a",
   "detail": "Gap brings agitation: anxiety, guilt, fear. Linked to a prevention focus on avoiding losses."
  }
 ],
 "caption": "Ask a client which kind of gap hurts: it guides whether to work on hopes or on duties."
}
:::

### Self-esteem
- Measured most often by the **Rosenberg Self-Esteem Scale** (1965), a 10-item questionnaire.
- **Does high self-esteem cause success?** Baumeister and colleagues' major review (2003) found high self-esteem is linked to **feeling happier** and to **persistence after failure**, but it **does not cause** better school performance, better job performance or healthier behaviour; often good outcomes raise self-esteem instead. Programmes that boost self-esteem directly have not improved achievement.
- **Sociometer theory** (Mark Leary): self-esteem is an internal gauge of how accepted and valued we are by others. It drops when we sense rejection.
- **Contingencies of self-worth** (Jennifer Crocker): self-esteem based on external sources (appearance, others' approval, marks) is fragile and swings with events.
- **High self-esteem is not narcissism**: narcissists have inflated, fragile self-views and need admiration; secure high self-esteem does not.

### Self-monitoring and self-verification
- **Self-monitoring**, Mark Snyder's idea: high self-monitors adjust their behaviour to fit each situation; low self-monitors act on their inner attitudes consistently.
- **Self-verification** (William Swann): people want others to see them as they see themselves, even when that view is negative. A depressed person may prefer a partner who confirms their low self-view.

### Culture and the self
Hazel Markus and Shinobu Kitayama (1991) contrasted the **independent self** (unique, separate, defined by personal traits; common in North America and western Europe) with the **interdependent self** (defined by relationships, roles and group membership; common in East and South Asia). In interdependent cultures, self-criticism and fitting in may be valued over self-enhancement. Indian research complicates the neat contrast: **Sinha and Tripathi** showed Indians hold both orientations and switch between them by context, and in large Indian cities the two sit side by side in the same person.

:::clinician
Self-esteem and depression: prospective meta-analyses support a vulnerability model in which low self-esteem predicts later depression more than depression predicts later low self-esteem, while for anxiety the effects are more balanced. Self-discrepancy has clinical support: actual-ideal discrepancies are relatively specific to dysphoria and actual-ought to anxiety, though the specificity is weaker in later studies. Compassion-focused approaches (Gilbert) and self-compassion (Neff) offer an alternative to boosting self-esteem: self-compassion predicts resilience without the contingency and comparison costs of high self-esteem. The self-enhancement debate: some researchers argued that Japanese culture shows little self-enhancement; others argued that people in all cultures self-enhance on the traits their culture values (individualists on agentic traits, collectivists on communal ones). In India, both patterns appear depending on domain.
:::

:::recall
1. Distinguish James's I and Me. || I: the self as knower. Me: the self as known (material, social, spiritual).
2. Give James's formula for self-esteem. || Success divided by pretensions.
3. What feelings follow actual-ideal and actual-ought discrepancies? || Actual-ideal: dejection. Actual-ought: agitation.
4. What did Baumeister's 2003 review conclude? || High self-esteem relates to happiness and persistence but does not cause better performance or health.
5. What is sociometer theory? || Self-esteem is a gauge of social acceptance.
6. Contrast independent and interdependent selves. || Independent: separate and defined by personal traits. Interdependent: defined by relationships and roles.
:::

:::mcq
Q: A depressed man feels more comfortable with a friend who agrees he is "a failure" than with one who praises him. This is predicted by:
- Self-enhancement theory of motivation
- Sociometer theory
- Self-monitoring
- *Self-verification theory
> Swann: people seek confirmation of their existing self-views.
:::

## 3.5 Explanatory style and learned helplessness [core][advanced]
### Learned helplessness: the dog studies
:::widget decide
{
  "scene": "Seligman and Maier (1967) used a 'triadic' design. One group of dogs received shocks they could stop by pressing a panel. A second, 'yoked' group received exactly the same shocks but nothing they did could stop them. A third group got no shocks. Later, all dogs were placed in a shuttle box where they could escape shock simply by jumping over a low barrier.",
  "ask": "Predict what the yoked dogs did in the shuttle box.",
  "choices": [
    { "label": "They learnt to jump fastest, because they had the most experience of shock", "verdict": "ok", "outcome": "The opposite happened.", "why": "Exposure to shock alone did not explain the result: the escape group had the same shocks." },
    { "label": "Most of them lay down and whined, and failed to escape, while most dogs in the other two groups learnt quickly", "verdict": "best", "outcome": "Correct. Dogs that had experienced uncontrollable shock became passive.", "why": "The key variable was not shock but lack of control. Seligman called this learned helplessness and proposed it as a model of depression." },
    { "label": "All three groups behaved the same", "verdict": "ok", "outcome": "The yoked group was clearly different.", "why": "Controllability, not the shock itself, produced passivity." }
  ]
}
:::

Hiroto (1974) showed similar effects in humans using unescapable loud noise. People who had experienced uncontrollable noise were later slower to learn how to turn off noise that was controllable.

### The reformulated model
Humans don't respond to uncontrollable events in the same way. Abramson, Seligman and Teasdale (1978) said what matters is **how people explain** bad events. Three dimensions make up **explanatory (attributional) style**:
| Dimension | Pessimistic explanation of a bad event | Optimistic explanation |
|---|---|---|
| **Internal versus external** | "It's me" | "It was the situation" |
| **Stable versus unstable** | "It will always be like this" | "It was a one-off" |
| **Global versus specific** | "It ruins everything" | "It affects only this area" |
A **pessimistic** style (internal, stable, global for bad events) leads to helplessness and depression after setbacks. It is measured by the **Attributional Style Questionnaire (ASQ)** or, from written or spoken material, by **content analysis of verbatim explanations (CAVE)**.

The **hopelessness theory** of Lyn Abramson and her colleagues narrowed this: a specific "hopelessness depression" arises when stable and global attributions, inferences about consequences and inferences about the self lead to the expectation that bad things will happen and that nothing can be done.

:::widget worked
{
  "title": "Spotting and reframing explanatory style: Aman fails his first MBBS anatomy exam",
  "steps": [
    { "q": "Aman says: “I failed because I'm stupid; I'll never be a doctor; I'm useless at everything.” Score it on the three dimensions.", "a": "Internal (“I'm stupid”), stable (“never”), global (“everything”): the classic pessimistic style." },
    { "q": "What would a more realistic but still honest explanation sound like?", "a": "“I failed anatomy this time (unstable) because I left revision too late and anatomy needs a lot of memorising (partly internal, but about effort and strategy, not ability). I'm doing fine in physiology (specific).”" },
    { "q": "Why aim for 'realistic', not just 'optimistic'?", "a": "Making every failure external (“the examiner was unfair”) removes responsibility and the chance to change. Seligman's 'flexible optimism' keeps accountability for controllable causes." },
    { "q": "What practical step follows from the new explanation?", "a": "A revision plan with spaced practice and a study group, which tests and builds self-efficacy." }
  ],
  "yourTurn": [
    { "q": "Priya's marriage proposal is rejected. She says: “It's because I'm dark-skinned; nobody will ever want me.” Score it, and say what makes it particularly painful.", "a": "Internal, stable and global. It is also tied to a social prejudice (colourism), so a good response validates the real unfairness while challenging the 'nobody ever' generalisation; it is not only a thinking error." }
  ]
}
:::

:::widget flow
{
 "title": "From a bad event to helplessness: the reformulated model",
 "layout": "chain",
 "nodes": [
  {
   "id": "a",
   "label": "Bad event",
   "detail": "Failing first-year anatomy."
  },
  {
   "id": "b",
   "label": "Explanation",
   "detail": "Internal (“I'm stupid”), stable (“always”), global (“at everything”)."
  },
  {
   "id": "c",
   "label": "Expectation",
   "detail": "“Nothing I do will make a difference”: hopelessness."
  },
  {
   "id": "d",
   "label": "Helplessness and depression",
   "detail": "Passivity, low mood, low self-esteem, giving up."
  }
 ],
 "caption": "CBT and attribution retraining work on the second box: realistic, specific, changeable explanations."
}
:::

### What explanatory style predicts
- **Depression** after negative events, in adults and children.
- **Health**: Peterson, Seligman and Vaillant (1988) coded essays written at age 25 by Harvard graduates; a pessimistic style predicted poorer physical health from age 45 to 60.
- **Achievement**: in a study of insurance salespeople, optimists sold more and stayed in the job longer.
**Dispositional optimism** (Scheier and Carver; measured by the **Life Orientation Test, LOT-R**) is a related but different construct: a general expectation that good things will happen, rather than a way of explaining events.

### The 2016 reversal
Fifty years after the dog studies, Maier and Seligman (2016) revised their own theory using neuroscience: **passivity is the default** response to prolonged bad events (driven by brainstem serotonin systems); what animals **learn** is **control**, detected by the medial prefrontal cortex, which then switches off the passive default. In other words, it is not helplessness that is learnt, but **hope** (or control) that must be learnt.

:::trap Explanatory style and depression: what the evidence allows
The diathesis-stress pattern (pessimistic style + negative events = depression) has reasonable support, but effects are modest and the ASQ has only moderate reliability. Resilience programmes built on this theory, such as the **Penn Resiliency Program**, show **small** effects on depressive symptoms in school children that tend to fade. Present it as one vulnerability factor among many.
:::

:::clinician
Clinical links: CBT for depression directly targets the content captured by explanatory style (Beck's negative cognitive triad overlaps with internal-stable-global attributions); attribution retraining is a component of several CBT protocols. In India, studies of students facing board and entrance exams have linked pessimistic attributional style and external locus of control to higher depressive symptoms after poor results; culturally, attributions to fate or karma can be either fatalistic (helplessness) or consoling and protective, depending on how they are used, so explore their function rather than assume. Learned helplessness has also been used as a model of the passivity seen in prolonged abuse and in institutional settings, and the 2016 neuroscience revision implies interventions should build experiences of control (behavioural activation, graded mastery tasks), not only change beliefs.
:::

:::recall
1. What was the key variable in Seligman and Maier's triadic study? || Controllability of the shock, not the shock itself.
2. Name the three dimensions of explanatory style. || Internal-external, stable-unstable, global-specific.
3. Describe the pessimistic explanatory style. || Bad events explained as internal, stable and global.
4. What is CAVE? || Content analysis of verbatim explanations: scoring explanatory style from written or spoken material.
5. What did Peterson, Seligman and Vaillant find? || Pessimistic style at 25 predicted poorer health from 45 to 60.
6. What did Maier and Seligman's 2016 revision say? || Passivity is the default; what is learnt is control, detected by the medial prefrontal cortex.
:::

:::mcq
Q: After losing his job, Ravi says, "It was the company's restructuring; it's a bad year for the industry, but my skills are still good for other work." His explanation is:
- *External, unstable, specific
- Internal, stable, global
- Internal, unstable, specific
- External, stable, global
> The situation, temporary, and limited to one area: an optimistic style.
:::

## 3.6 Moral character: Kohlberg, Gilligan and moral intuitions [core][advanced]
Moral reasoning is part of personality and character. This section gives the theories at the level personality exams ask; the module **Lifespan development** covers how moral thinking develops from early childhood.

### Kohlberg's six stages
Lawrence Kohlberg (1958 onwards) asked boys and men to reason about dilemmas, such as the **Heinz dilemma** (should Heinz steal an overpriced drug to save his dying wife?). What mattered was the **reasoning**, not the yes or no answer.
| Level | Stage | Reasoning |
|---|---|---|
| **Preconventional** | 1. Punishment and obedience | "Don't steal; you'll go to jail." |
| | 2. Instrumental exchange (individualism) | "Steal; he'll be happier with his wife alive." |
| **Conventional** | 3. Good interpersonal relationships ("good boy, good girl") | "A good husband would steal to save her." |
| | 4. Law and order (maintaining the social order) | "Stealing is against the law; if everyone did it, society would collapse." |
| **Postconventional** | 5. Social contract and individual rights | "Laws should serve human welfare; the right to life comes before property." |
| | 6. Universal ethical principles | "Justice and the value of every life require him to act, whatever the law says." |
Stages are meant to be **invariant** in order, **universal** across cultures and **hierarchical** (each more adequate). Measured by the **Moral Judgment Interview**, and later by James Rest's **Defining Issues Test** (DIT), which gives a "P" (principled reasoning) score.

:::widget sort
{
  "prompt": "Which Kohlberg stage best fits each answer to the Heinz dilemma?",
  "buckets": ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"],
  "items": [
    { "text": "“He shouldn't steal because the police will beat him.”", "bucket": 0 },
    { "text": "“He should steal; one day his wife can do the same for him.”", "bucket": 1 },
    { "text": "“His family and friends would think he was heartless if he let her die.”", "bucket": 2 },
    { "text": "“Duty to the law matters, or there would be chaos; he must find a legal way.”", "bucket": 3 },
    { "text": "“A law that lets a person die for profit fails its purpose; the right to life is more basic.”", "bucket": 4 },
    { "text": "“The chemist will be angry and might hurt him.”", "bucket": 0 }
  ]
}
:::

:::widget flow
{
 "title": "Kohlberg's six stages",
 "layout": "chain",
 "nodes": [
  {
   "id": "s1",
   "label": "1. Punishment and obedience",
   "detail": "Avoid punishment."
  },
  {
   "id": "s2",
   "label": "2. Instrumental exchange",
   "detail": "Serve your own interests; fair deals."
  },
  {
   "id": "s3",
   "label": "3. Good interpersonal relationships",
   "detail": "Be seen as a good person."
  },
  {
   "id": "s4",
   "label": "4. Law and order",
   "detail": "Keep the social system going."
  },
  {
   "id": "s5",
   "label": "5. Social contract",
   "detail": "Laws serve welfare and rights and can be changed."
  },
  {
   "id": "s6",
   "label": "6. Universal principles",
   "detail": "Self-chosen principles of justice and dignity. Later dropped from scoring as too rare."
  }
 ],
 "caption": "Preconventional (1, 2), conventional (3, 4), postconventional (5, 6). The order is invariant; few adults reach 5."
}
:::

### The critiques
- **Gilligan's ethic of care**: Carol Gilligan argued in 1982 that Kohlberg's original all-male sample and justice-centred scoring undervalued an **ethic of care** (responsibility, relationships, avoiding hurt) more often voiced by women. She described three levels: **orientation to individual survival**, **goodness as self-sacrifice**, and the **morality of non-violence** (care for self and others).
- **But**: a 2000 meta-analysis found only **small** gender differences in care and justice orientations; both sexes use both, depending on the dilemma.
- **Culture**: Snarey's review (1985) of studies in 27 countries found stages 1 to 4 almost everywhere, but stage 5 was rare and found mainly in urban, educated samples, which suggests the top of the scale reflects Western liberal values.

### An Indian challenge: Shweder's three ethics
Richard Shweder, Manamohan Mahapatra and Joan Miller (1987) interviewed children and adults in **Bhubaneswar, Odisha**, and in Chicago about everyday practices. Many practices Americans saw as matters of personal choice or convention (for example, a widow eating fish, or an eldest son eating chicken the day after his father's death) were seen by Oriya Hindus as serious **moral** wrongs. Shweder proposed three ethics:
- **Autonomy**: harm, rights and justice (dominant in Western middle-class ethics).
- **Community**: duty, hierarchy, loyalty and interdependence.
- **Divinity**: purity, sanctity and the sacred order.
**Miller and Bersoff** (1992) similarly found Indians treated interpersonal obligations (helping a friend in need) as **moral duties**, while Americans treated them more as personal choices.

### Moral intuitions
Jonathan Haidt's **social intuitionist model** (2001) argues that most moral judgments come from fast **intuitions**, with reasoning often a lawyer arguing for a verdict already reached. In **moral dumbfounding** studies, people insist that a harmless taboo act is wrong but cannot say why. **Moral foundations theory** (Haidt and Graham) lists foundations such as **care, fairness, loyalty, authority, sanctity** and **liberty**, which map onto Shweder's three ethics.

:::widget decide
{
  "scene": "In an MA viva, the examiner asks: “Is Kohlberg's theory culturally biased? Use Indian evidence.”",
  "ask": "Which answer would score best?",
  "choices": [
    { "label": "“Yes; Kohlberg is irrelevant to India.”", "verdict": "ok", "outcome": "The examiner asks you to justify such a sweeping claim.", "why": "Stages 1 to 4 appear widely across cultures, so the theory is not irrelevant." },
    { "label": "“Partly. Lower stages appear across cultures, but stage 5 is rare outside educated Western samples. Shweder's Bhubaneswar studies and Miller and Bersoff show Indians moralise duty, community and purity, which Kohlberg's justice focus misses. Haidt's foundations and Gilligan's care ethic widen the picture.”", "verdict": "best", "outcome": "The examiner nods and moves on to Gilligan's levels.", "why": "Balanced, evidence-based and Indian-specific." },
    { "label": "“No; justice is the same everywhere.”", "verdict": "ok", "outcome": "You have ignored the main cross-cultural evidence.", "why": "Universality of justice concerns doesn't mean universality of Kohlberg's scoring." }
  ]
}
:::

:::clinician
Distinguish moral reasoning (Kohlberg, DIT), moral emotions (guilt, shame, empathy), moral intuitions (Haidt), moral identity (Blasi; the centrality of being moral to one's self-concept, which predicts moral behaviour better than reasoning level), and Turiel's domain theory (children distinguish moral rules about harm and fairness from social conventions by early childhood). Reasoning level correlates only modestly with behaviour (Blasi's 1980 review). Clinical relevance: deficits in moral emotion (for example, callous-unemotional traits) predict antisocial behaviour more than reasoning level; in forensic and adolescent work, moral reconation therapy and moral reasoning programmes have mixed evidence. Moral foundations theory's measurement (the Moral Foundations Questionnaire) has shown variable factor structure across cultures, including Indian samples, so treat its specific number of foundations as provisional.
:::

:::recall
1. Name Kohlberg's three levels and six stages. || Preconventional (punishment-obedience, instrumental exchange); conventional (interpersonal, law and order); postconventional (social contract, universal principles).
2. What did Gilligan argue? || Kohlberg undervalued an ethic of care, with three levels: survival, goodness as self-sacrifice, non-violence.
3. What did Jaffee and Hyde's meta-analysis find? || Only small gender differences in care and justice reasoning.
4. Name Shweder's three ethics. || Autonomy, community, divinity.
5. What does the social intuitionist model say? || Moral judgments come mostly from fast intuitions; reasoning usually follows to justify them.
:::

:::mcq
Q: An elder in Bhubaneswar says it is a serious wrong for a widow to eat fish, because it violates sacred order and purity. In Shweder's scheme, this is the ethic of:
- Autonomy
- *Divinity
- Community
- Care
> Purity and sanctity belong to the ethic of divinity.
:::
`;

export const exam = String.raw`
## 4.4 Long answers, short notes and viva [core]
### Long answer skeletons
**Q1. Compare the trait theories of Allport, Cattell and Eysenck. How does the five-factor model integrate them? (15 marks)**
1. Define trait; type versus trait.
2. Allport: lexical work, cardinal, central and secondary dispositions, common versus personal, proprium, functional autonomy, idiographic emphasis.
3. Cattell: L, Q and T data; surface and source traits; 16PF; ability, temperament and dynamic traits; specification equation.
4. Eysenck: PEN, hierarchy, biological bases (ARAS, limbic system), EPQ, mapping to the four temperaments; critique of P and the 2019 integrity findings.
5. The Big Five: two routes, OCEAN with facets, five-factor theory, universality, HEXACO.
6. Evaluation: person-situation debate, aggregation, stability, heritability, prediction of life outcomes; conclusion.

**Q2. Critically evaluate the humanistic approach to personality with reference to Rogers and Maslow. (15 marks)**
Rogers: actualising tendency, self-concept, conditions of worth, incongruence and defences, fully functioning person, six conditions and Q-sort evidence. Maslow: hierarchy, D- and B-needs, characteristics of self-actualisers, Jonah complex; the pyramid myth; Tay and Diener. Evaluation: optimism and influence on counselling; testability; individualist bias and Indian perspectives; relationship-factor meta-analyses.

**Q3. Explain social-cognitive theories of personality. (15 marks)**
Bandura (reciprocal determinism, modelling, self-efficacy and its four sources, moral disengagement), Rotter (formula, locus of control, I-E and IPC scales), Mischel (personality coefficient, delay of gratification with the 2018 replication, CAPS and if-then signatures), Kelly (constructive alternativism, postulate and corollaries, Rep test). Evaluate: testable, linked to therapy; less attention to biology and emotion.

**Q4. Discuss Indian perspectives on personality. (10 marks)**
Triguna (Samkhya, Gita chapters, dynamic balance, measurement and correlates), prakriti and Ayurgenomics, pancha kosha and antahkarana, anatta; modern work (anasakti, coexistence of individualism and collectivism); evaluation and comparison with trait models.

**Q5. Explain learned helplessness and explanatory style. (10 marks)**
Triadic design; Hiroto; reformulation (three dimensions); hopelessness theory; ASQ and CAVE; health and achievement findings; 2016 revision; resilience programmes and evidence.

### Short notes (5 marks each)
Functional autonomy · Cattell's 16PF · Eysenck's biological theory · HEXACO · Person-situation debate · Conditions of worth · Q-sort · B-needs · Paradoxical intention · Self-efficacy · Locus of control · CAPS · Repertory grid · Gray's RST · Cloninger's TCI · Triguna · Pancha kosha · Self-discrepancy theory · Explanatory style · Gilligan's ethic of care · Shweder's three ethics.

:::viva
What is the lexical hypothesis? :: Important individual differences become encoded as words in language.
What is the specification equation? :: Cattell's formula: behaviour equals the sum of traits weighted by their relevance to the situation.
Why did Eysenck say introverts avoid stimulation? :: Their cortical arousal is already high.
What is the personality coefficient? :: Mischel's ceiling of about 0.30 for trait-behaviour correlations in one situation.
What resolved the person-situation debate? :: Aggregation, interactionism, strong versus weak situations, density distributions and if-then signatures.
What is unconditional positive regard? :: Acceptance of the person without conditions of worth.
Who drew Maslow's pyramid? :: Charles McDermid, a consultant, in 1960.
Name Frankl's three sources of meaning. :: Creative, experiential, attitudinal.
What is dereflection? :: Turning attention away from oneself towards something meaningful outside.
Self-efficacy versus outcome expectancy? :: Belief I can do it versus belief that doing it brings the result.
What does a higher Rotter I-E score mean? :: A more external locus of control.
What is constructive alternativism? :: There are always alternative ways to construe events.
Which gene finding for novelty seeking failed to replicate? :: DRD4.
What is the gunatita ideal? :: Going beyond all three gunas.
What feelings follow an actual-ought discrepancy? :: Agitation: anxiety, guilt, fear.
What does the 2016 revision of learned helplessness say? :: Passivity is the default; control is what is learnt.
:::

## 4.5 Module test [core]
:::mcq
Q: "Dynamic organisation within the individual of those psychophysical systems that determine his characteristic behaviour and thought" is the definition of personality by:
- Raymond Cattell
- Hans Eysenck
- *Gordon Allport
- Walter Mischel
> Allport, 1937 and 1961.

Q: Match the theorist with the concept: (a) Allport (b) Cattell (c) Eysenck (d) Kelly. (1) ergs and sentiments (2) repertory grid (3) functional autonomy (4) ascending reticular activating system.
- a-1, b-3, c-4, d-2
- *a-3, b-1, c-4, d-2
- a-3, b-4, c-1, d-2
- a-2, b-1, c-4, d-3
> Allport: functional autonomy; Cattell: ergs; Eysenck: ARAS; Kelly: repertory grid.

Q: Q-data in Cattell's system refers to:
- Ratings by others
- Behaviour in objective tests
- Life records such as school reports
- *Self-report questionnaires
> Q for questionnaire.

Q: Statement I: Eysenck's P scale is the most reliable of his three scales. Statement II: The Big Five splits Eysenck's psychoticism into low agreeableness and low conscientiousness.
- Both are true
- Both are false
- Statement I is true, II is false
- *Statement I is false, II is true
> P is the weakest scale; it mixes low A and low C.

Q: In the NEO-PI-R, "angry hostility" is a facet of:
- *Neuroticism
- Agreeableness
- Extraversion
- Conscientiousness
> Angry hostility sits under neuroticism.

Q: The sixth factor added by the HEXACO model is:
- Religiosity
- *Honesty-Humility
- Intellect
- Emotional intelligence
> HEXACO's H factor.

Q: Funder and Ozer's reply to Mischel showed that classic situational effects:
- Were far larger than trait effects
- Could not be converted to correlations at all
- *Were about the same size as trait effects
- Disappeared on replication
> Both persons and situations matter.

Q: Rank-order stability of personality peaks at about which age range?
- Early childhood
- The college years
- Around age 30
- *Between 50 and 70
> The cumulative continuity principle.

Q: A child learns to hide her anger because her parents show love only when she is "sweet". Rogers would call this:
- An organismic valuing process
- *A condition of worth
- A peak experience
- Self-actualisation
> Love made conditional on approved behaviour.

Q: Which statement about Maslow's hierarchy is best supported by Tay and Diener's 123-country study?
- *Needs are universal but not met in strict order
- Needs must be met in strict order
- Only physiological needs relate to any form of well-being
- The needs do not exist outside the West
> Universal needs, flexible ordering.

Q: Assertion (A): May distinguished normal from neurotic anxiety. Reason (R): Normal anxiety is proportionate to a real threat and can be used constructively.
- *Both A and R are true, and R explains A
- Both are true, but R does not explain A
- A is true, R is false
- A is false, R is true
> The distinction rests on proportion and constructive use.

Q: Frankl's "tragic triad" consists of:
- Death, freedom and isolation
- Anxiety, guilt and shame
- Love, will and destiny
- *Pain, guilt and death
> The tragic triad everyone faces.

Q: A student gains confidence in giving injections after watching a classmate of similar skill succeed. Bandura calls this source:
- Mastery experience of her own
- Verbal persuasion
- *Vicarious experience
- Physiological state
> Seeing a similar other succeed.

Q: Rotter's formula predicts behaviour from:
- *Expectancy and reward value
- Traits and situations
- Drives and habits
- Self-efficacy and outcome expectancy
> Behaviour potential = f (E and RV).

Q: Levenson's IPC scale divides the external locus into:
- Fate and karma
- *Powerful others, chance
- Luck and effort
- Family and wider society
> I (internal), P (powerful others), C (chance).

Q: Arrange Mischel's work in time order: (1) CAPS (2) the 1968 critique of traits (3) the large marshmallow replication (4) Bing Nursery delay studies.
- 4, 2, 1, 3
- 2, 1, 4, 3
- *2, 4, 1, 3
- 1, 2, 4, 3
> 1968 critique, 1972 delay studies, 1995 CAPS, 2018 replication.

Q: Kelly defined threat as:
- Events outside the range of convenience of one's constructs
- Being dislodged from one's core role
- *An imminent comprehensive change in core constructs
- Forcing evidence for a failed prediction
> The other three define anxiety, guilt and hostility.

Q: In Gray's revised RST, the system that handles approach-avoidance conflict is:
- BAS
- FFFS
- ARAS
- *BIS
> The BIS resolves conflicts and drives anxiety.

Q: Cloninger linked harm avoidance mainly with:
- *Serotonin
- Dopamine
- Noradrenaline
- Acetylcholine
> Harm avoidance and serotonin.

Q: Which statement about personality genetics is most accurate today?
- A single gene controls each of the Big Five traits fully
- Shared family environment explains most variation
- *Traits are polygenic: many tiny genetic effects
- DRD4 reliably predicts novelty seeking
> Genome-wide studies point to many tiny effects.

Q: Nettle's trade-off account says high neuroticism persists partly because it brings:
- Better mating success
- Longer life
- Greater creativity
- *Vigilance to danger
> Its cost is stress; its benefit is vigilance.

Q: In Samkhya and the Gita, the guna of activity, passion and restlessness is:
- Sattva
- *Rajas
- Tamas
- Prakriti
> Rajas.

Q: The sheath of the intellect and discrimination in the pancha kosha model is:
- *Vijnanamaya kosha
- Manomaya kosha (the mind)
- Pranamaya kosha
- Anandamaya kosha
> Vijnanamaya: the sheath of knowing and judgment.

Q: According to Higgins, a gap between the actual self and the ought self mainly produces:
- Dejection, such as sadness and disappointment
- *Agitation (anxiety, guilt)
- Pride
- Boredom
> Actual-ought gives agitation; actual-ideal gives dejection.

Q: Baumeister's 2003 review concluded that high self-esteem:
- Causes better school grades and exam results
- Prevents adolescent smoking and drinking
- Is the same thing as narcissism, only milder
- *Goes with happiness but doesn't cause success
> Self-esteem follows success more than it causes it.

Q: A pessimistic explanatory style explains bad events as:
- External, unstable and specific
- Internal, unstable and specific
- *Internal, stable and global
- External, stable and global
> "It's me, it's forever, it affects everything."

Q: In Kohlberg's theory, "I must obey the law, otherwise society will fall apart" reflects stage:
- 2
- 3
- *4
- 5
> Law-and-order orientation.

Q: Gilligan's highest level of the ethic of care is:
- *The morality of non-violence
- Orientation to individual survival
- Goodness as self-sacrifice
- Universal ethical principles
> Care for both self and others.
:::
`;
