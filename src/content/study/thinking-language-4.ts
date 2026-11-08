/* Module · Thinking, language, intelligence and creativity, Part IV (Advanced) and the exam zone. Original text written for VIBHA School of Psychology. */
export const part4 = String.raw`
# Part IV · Advanced: nature, culture and the clinic

## 4.1 Heredity, environment and the Flynn effect [core][advanced]
### What heritability means, and what it does not
**Heritability** is the proportion of the **variation** in a trait, **within a particular population at a particular time**, that is associated with genetic variation. Three points are tested again and again:
1. It describes **differences between people**, not how much of one person's intelligence is "from genes".
2. It is **specific to a population and its environments**. If every child had identical schooling and nutrition, the heritability of school marks would rise, because only genetic differences would be left.
3. High heritability **within** groups says **nothing** about the causes of average differences **between** groups. Richard Lewontin's analogy: take a handful of genetically varied seeds and plant half in rich soil and half in poor soil. Within each tray, height differences are largely genetic; the difference between the trays is entirely environmental.

:::widget compare
{"title": "What heritability does and does not tell you", "a": {"label": "What it says", "points": ["How much of the variation between people in one population goes with genetic variation", "True only for that population, at that time, in those environments", "Can rise when environments become more equal"], "summary": "Heritability is a statement about differences in a group."}, "b": {"label": "What it does not say", "points": ["How much of one person's IQ is 'from genes'", "That a trait cannot be changed by environment", "Anything about why two groups differ on average", "That the trait is fixed at birth"], "summary": "Height is highly heritable, yet average height rose sharply with better food. Lewontin's seeds make the same point for groups."}}
:::

### Evidence from families, twins and adoption
| Relationship | Approximate correlation in IQ (from large reviews) |
|---|---|
| Identical twins reared together | about 0.85 |
| Identical twins reared apart | about 0.75 |
| Fraternal twins reared together | about 0.60 |
| Siblings reared together | about 0.45 |
| Parent and child living together | about 0.40 |
| Adoptive siblings (unrelated, same home), in childhood | about 0.30, falling towards 0 by adulthood |

Identical twins reared apart, as in the Minnesota study led by Thomas Bouchard, correlate almost as highly as those reared together, pointing to substantial genetic influence. The pattern for adoptive siblings shows that the **shared family environment** affects IQ in childhood but its effect fades by adulthood.

:::widget guess
{
  "prompt": "Twin studies suggest that the heritability of IQ changes with age. In adulthood it is estimated at about 0.6 to 0.8. Roughly what is it in early childhood?",
  "min": 0,
  "max": 1,
  "step": 0.05,
  "unit": "(proportion)",
  "answer": [0.2, 0.45],
  "reveal": "About 0.2 to 0.4. Heritability rises with age, a pattern called the Wilson effect. One explanation is gene-environment correlation: as children grow, they increasingly choose and shape environments that suit their genetic tendencies (a child who enjoys reading seeks out books), so genetic differences are amplified."
}
:::

### Gene-environment interplay
- **Gene-environment correlation**: **passive** (parents provide both genes and a home full of books), **evocative** (a curious child draws more conversation from adults) and **active** (niche-picking: the child seeks out environments that fit).
- **Gene-environment interaction**: in some American studies, heritability was much lower in poor families than in affluent ones, as if poverty kept genetic potential from showing. Large later reviews found this pattern mainly in the United States and not in Western Europe or Australia, perhaps because of stronger social safety nets.
- **Molecular genetics**: intelligence is highly **polygenic**: thousands of variants each with tiny effects. Current polygenic scores predict only a modest share of the variation in educational attainment and less for intelligence, and they predict much less well in populations unlike the (mostly European-ancestry) samples they were built from, including South Asian populations.

:::widget flow
{
 "title": "How genes and environments correlate",
 "layout": "tree",
 "nodes": [
  {
   "id": "r",
   "label": "Gene-environment correlation"
  },
  {
   "id": "pa",
   "label": "Passive",
   "parent": "r",
   "detail": "Parents give both genes and a home: musical parents pass on genes and fill the house with music."
  },
  {
   "id": "ev",
   "label": "Evocative",
   "parent": "r",
   "detail": "A child's traits draw responses: a curious child gets more explanations from adults."
  },
  {
   "id": "ac",
   "label": "Active",
   "parent": "r",
   "detail": "Niche-picking: an older child seeks out friends, books and activities that suit her."
  }
 ],
 "caption": "Active correlation grows with age, one reason heritability rises from childhood to adulthood."
}
:::

### Environments that change intelligence
- **Early deprivation and rescue**: children raised in very depriving orphanages who were placed into foster families before about age two gained far more in IQ than those placed later, in the Bucharest Early Intervention Project, a randomised study in Romania.
- **Schooling**: each extra year of education raises IQ by roughly 1 to 5 points, according to studies that use natural experiments such as school-entry cut-off dates and changes in the school-leaving age.
- **Nutrition and toxins**: **iodine deficiency** is one of the world's leading preventable causes of lowered intelligence; meta-analyses suggest populations with severe deficiency average many IQ points lower. India's universal salt iodisation programme is, in effect, an intelligence intervention. **Lead** exposure, severe anaemia and early malnutrition also lower cognitive scores.
- **Early intervention programmes**: high-quality early childhood programmes produce IQ gains that often fade, but lasting gains in schooling, employment and lower crime (the "fade-out but long-term benefit" pattern). India's Integrated Child Development Services combines nutrition and preschool education on a vast scale.

### The Flynn effect
James Flynn documented that average IQ test scores **rose by about 3 points per decade** across the twentieth century in many countries, with the largest gains on **fluid** tests such as Raven's matrices. Genes cannot change that fast, so the cause must be environmental. Proposed explanations:
- Better **nutrition** and **health**.
- More and better **schooling**.
- **Smaller families** and more parental attention.
- A more **complex, visually rich environment** and more practice with abstract thinking: Flynn argued we now wear "scientific spectacles", classifying things abstractly ("dogs and rabbits are both mammals") rather than practically ("you use a dog to hunt rabbits").
- **Test familiarity**.

In some rich countries, gains have stopped or reversed since the 1990s. A Norwegian study of brothers found the decline **within families**, which points to environmental, not genetic or demographic, causes.

:::widget decide
{
  "scene": "A school in Lucknow is still using a 1960s-normed intelligence test to decide which children need special education support. A child scores 76.",
  "ask": "What is the best interpretation?",
  "choices": [
    { "label": "The score is accurate; tests do not go out of date", "verdict": "harm", "outcome": "The child's needs are misjudged, and others in the school are misclassified too.", "why": "Because of the Flynn effect, old norms make today's children score higher than they would on current norms. The child's true standing may be lower than 76, and the misclassification could mean missing support or, in other settings, wrongly applying a label." },
    { "label": "Old norms inflate scores; retest with a recently normed test suitable for Indian children, and assess adaptive functioning before any decision", "verdict": "best", "outcome": "On current norms with an adaptive behaviour assessment, the child's needs are clearer and support is planned.", "why": "The Flynn effect means norms must be recent. Decisions about support and diagnosis must never rest on an IQ score alone." },
    { "label": "Subtract exactly 3 points per decade and use the corrected score", "verdict": "ok", "outcome": "A rough correction is better than none, but it is imprecise and not accepted for decisions.", "why": "Flynn effects vary by test, country and ability. Correcting old norms is a stopgap; retesting with current norms is the standard." }
  ]
}
:::

:::clinician
In US capital cases, courts have accepted that IQ scores from outdated norms should be interpreted with the Flynn effect in mind, and that a score must be read with its standard error of measurement (typically about plus or minus 5 points for full-scale IQ). In India, disability certification for intellectual disability (under guidelines issued after the RPwD Act 2016) relies on IQ assessed with standardised Indian tests together with adaptive behaviour (for example on the Vineland Social Maturity Scale), and certifying boards should be alert to obsolete norms, language of testing and schooling.
:::

:::recall
1. Define heritability and give two common misunderstandings. || The proportion of trait variation in a population associated with genetic variation. It does not apply to individuals, and it does not explain differences between groups.
2. What is the Wilson effect? || Heritability of IQ rises from childhood to adulthood.
3. Name the three kinds of gene-environment correlation. || Passive, evocative, active.
4. What is the Flynn effect, and why must its cause be environmental? || A rise of about 3 IQ points per decade; genes cannot change that quickly.
5. Name two environmental factors that reliably affect IQ. || Schooling, iodine and nutrition, lead, early deprivation.
:::

:::mcq
Q: Two groups of children differ on average in IQ, and IQ heritability within each group is 0.7. What can be concluded about the cause of the group difference?
- It is 70 percent genetic in origin
- *Nothing about its cause follows
- It is entirely genetic in origin
- It is 30 percent environmental
> Lewontin's seed analogy shows the two are independent.

Q: Adoptive siblings' IQs correlate modestly in childhood but almost not at all in adulthood. This suggests that:
- *Shared family effects fade with age
- Genes have no effect at all on adult IQ
- Being adopted lowers a child's IQ
- The non-shared environment has no effect
> Shared-environment effects decline with age.
:::

## 4.2 Intelligence across cultures, and the big debates [core][advanced]
### What counts as intelligent differs between cultures
- In many African, Asian and Indian communities, ordinary people's ideas of intelligence put more weight on **social competence, responsibility, self-control and wisdom** than Western ideas do, which stress speed and abstract reasoning.
- In India, J. P. Das and his colleagues described indigenous ideas centred on **buddhi**: a discerning understanding that includes knowing right action, self-awareness and thinking about consequences, together with being **samajhdar** (understanding, sensible) in relationships. Intelligence is seen less as a fixed amount and more as a quality of mind that grows with effort, guidance and good conduct.
- Among the Kipsigis of Kenya, the word for a clever child includes obedience and helpfulness; in Zambia, cleverness and social responsibility are linked; Taiwanese Chinese conceptions include interpersonal and intrapersonal understanding and knowing when to show one's intelligence.

:::widget compare
{"title": "Who counts as intelligent?", "a": {"label": "Typical Western idea", "points": ["Speed of thinking", "Abstract reasoning and problem solving", "Verbal fluency", "Individual achievement"], "summary": "Most standard IQ tests grew from this picture, so they reward speed and abstraction."}, "b": {"label": "Many African, Asian and Indian ideas", "points": ["Social competence and responsibility", "Self-control and obedience in children", "Buddhi: discerning right action and its consequences", "Being samajhdar: sensible and understanding"], "summary": "A test built on one picture can underrate ability in people raised with the other. This is a key reason to check test fairness."}}
:::

### Two more theories worth knowing
- **Mike Anderson's theory of the minimal cognitive architecture** (1992) tries to explain both individual differences and development. A **basic processing mechanism**, varying in **speed** between people but not changing much with age, limits two **specific processors** (verbal-propositional and visual-spatial thinking). Separately, **modules** (for example, for perceiving three dimensions, theory of mind, language) mature with age and work regardless of the basic mechanism. This explains why a person with intellectual disability can have normal theory of mind or language, and why savants exist.
- **Stephen Ceci's bioecological theory** (1990) argues that intelligence is **multiple cognitive potentials** shaped by **context** (motivation, social setting, physical setting) and **knowledge**. Ceci found that expert racetrack handicappers in the United States used remarkably complex reasoning to predict odds, and their skill was **unrelated to their IQ**. He also showed how strongly schooling raises IQ.

:::widget neuron
{
 "title": "Processing speed and myelin",
 "myelinated": true,
 "caption": "Switch myelin off and on. Myelinated axons conduct impulses many times faster, jumping between gaps in the sheath. Myelination continues into the twenties, and individual differences in white-matter integrity are linked to processing speed, the 'basic processing mechanism' in Anderson's theory."
}
:::

### Comparing theories
| Theory | Unit of intelligence | Main evidence | Main weakness |
|---|---|---|---|
| Spearman | g plus s | Positive manifold | Ignores structure below g |
| Thurstone | Seven primary abilities | Factor analysis of student data | Abilities correlate; second-order g |
| Guilford | 180 abilities (operations × contents × products) | Rational model with test construction | Abilities correlate; little predictive use |
| Cattell-Horn-Carroll | g, broad and narrow strata | Reanalysis of hundreds of data sets | Mostly descriptive; why these abilities? |
| Gardner | Eight intelligences | Brain damage, savants, development | Weak psychometric support |
| Sternberg | Analytical, creative, practical | Practical intelligence studies | Practical intelligence also correlates with g; mixed replications |
| PASS (Das) | Four cognitive processes | Luria's neuropsychology; CAS profiles in learning disability | Fewer independent replications; overlaps with working memory and executive function |
| Anderson | Processing speed plus modules | Developmental dissociations | Modules hard to specify |
| Ceci | Context-dependent potentials | Expertise unrelated to IQ | Hard to measure |

### Test bias and fairness
- **Cultural loading**: items assume knowledge of particular objects, words or customs. A rural child in Jharkhand may never have seen an escalator in a picture item.
- **Language**: testing in a second language underestimates ability. India's multilingual reality makes this a central problem.
- **Statistical bias** means a test **predicts differently** for different groups. Many major tests show little **predictive** bias in the countries they were built for, but that does not make them fair for groups never included in the norms.
- **Stereotype threat**: reminding people of a negative stereotype about their group's ability can lower their performance (classic studies with Black American and with women's maths performance). Large replication efforts have found smaller effects than first reported, but test settings should still avoid cueing stereotypes.
- "**Culture-fair**" tests (Raven's matrices, Cattell's Culture Fair Intelligence Test) reduce language and knowledge demands, but no test is fully free of culture: even the idea of sitting still and solving abstract puzzles against a clock is culturally learned.

:::widget decide
{
  "scene": "A psychologist in a district hospital in Odisha must assess the intellectual functioning of Laxmi, 14, who speaks Desia (a regional language) and has had irregular schooling. The available tests are in English and Hindi, with norms from urban schoolchildren.",
  "ask": "What is the most defensible approach?",
  "choices": [
    { "label": "Use the Hindi test as it is, and report the score as her IQ", "verdict": "harm", "outcome": "Laxmi is reported as having 'moderate intellectual disability' and is excluded from her school.", "why": "Testing in a language she does not speak, against norms for urban schoolchildren, measures her language and schooling, not her abilities. The label harms her." },
    { "label": "Use mainly non-verbal and performance tasks (for example Raven's matrices or Bhatia-type tasks) with an interpreter for instructions, gather adaptive behaviour and school history from family and teachers, interpret scores cautiously as estimates, and say clearly in the report what limits validity", "verdict": "best", "outcome": "Her non-verbal reasoning is in the average range; her school difficulties are linked to missed schooling and language, and remedial support is planned.", "why": "This reduces language and knowledge bias, adds adaptive information, and is honest about limits, in line with testing ethics and the DSM requirement for clinical judgment alongside tests." },
    { "label": "Refuse to assess her because no perfect test exists", "verdict": "ok", "outcome": "Her school does not get the information needed to support her.", "why": "Imperfect tests used carefully, with stated limits, are better than no assessment. The duty is to reduce bias, not to abandon assessment." }
  ]
}
:::

:::recall
1. What is distinctive about Indian ideas of intelligence, according to J. P. Das? || An emphasis on buddhi: discerning understanding, right action, self-awareness and social sensibility (samajh), more than speed.
2. Summarise Anderson's theory. || A basic processing mechanism (speed) limits two specific processors; separate modules mature with age.
3. What did Ceci's racetrack study show? || Complex reasoning in a domain of expertise was unrelated to IQ.
4. What is stereotype threat? || Lowered performance when people are reminded of a negative stereotype about their group.
5. Why is no test fully culture-free? || Every test assumes some culturally learned content, skills or ways of behaving in a test situation.
:::

:::mcq
Q: Which theory explains why a person with intellectual disability can have intact language or theory of mind?
- Spearman's two-factor theory
- Vernon's hierarchical model
- Thurstone's primary mental abilities
- *Anderson's minimal cognitive architecture
> Modules work independently of the basic processing mechanism.

Q: Expert racetrack handicappers used complex reasoning unrelated to their IQ. This supports:
- Guilford's structure of intellect
- Spearman's g
- *Ceci's bioecological theory
- Jensen's Level I and II
> Context and knowledge shape intelligent performance.
:::

## 4.3 Thinking and language in the clinic [core][advanced]

:::widget figure
{"id": "language-areas", "quiz": true, "caption": "Name each numbered part in your head first, then tap to check."}
:::

### Reasoning biases in psychosis
- **Jumping to conclusions**: in the **beads task**, people see beads drawn one by one from one of two jars (for example, 85 black and 15 white, or the reverse) and decide which jar they come from. People with delusions often decide after only **one or two beads**, much sooner than controls, with high confidence. About half of people with delusions show this "hasty decision" style.
- **Bias against disconfirmatory evidence**: once a belief is formed, contrary evidence is discounted.
- **Theory of mind** difficulties and an **externalising attributional style** (blaming others for bad events) contribute to persecutory delusions.
These findings led to **metacognitive training** and to CBT for psychosis, which help patients slow down, consider alternatives and test beliefs.

:::widget flow
{
 "title": "How a delusion can be maintained",
 "layout": "cycle",
 "nodes": [
  {
   "id": "ex",
   "label": "Unusual experience",
   "detail": "A strange sensation, a coincidence or a feeling that something is significant."
  },
  {
   "id": "jc",
   "label": "Jumping to conclusions",
   "detail": "A firm explanation is chosen on very little evidence ('they are watching me')."
  },
  {
   "id": "cb",
   "label": "Confirmation",
   "detail": "Ambiguous events are read as support; contrary evidence is discounted."
  },
  {
   "id": "st",
   "label": "Stronger belief",
   "detail": "Conviction grows, and attention is drawn to more 'evidence'."
  }
 ],
 "caption": "Metacognitive training and CBT for psychosis slow down the second step and open up the third."
}
:::

:::widget guess
{
  "prompt": "In the beads task, healthy volunteers typically ask to see several beads before deciding which jar they come from. On average, how many beads do many people with delusions request?",
  "min": 1,
  "max": 10,
  "unit": "beads",
  "answer": [1, 2],
  "reveal": "One or two. The style is called jumping to conclusions. It is not simply impulsiveness: these patients reason logically once the evidence is in front of them, but gather less of it before committing. It is linked to delusional conviction and predicts poorer response to some treatments."
}
:::

### Cognitive distortions in depression and anxiety
Aaron Beck's **cognitive distortions** are everyday heuristics that have become rigid and one-sided:
| Distortion | Example | Link to this module |
|---|---|---|
| **All-or-nothing thinking** | "If I don't top the exam, I'm a failure" | Rigid classical categories with no grey zone |
| **Overgeneralisation** | "I failed once; I always fail" | Faulty induction from one case |
| **Mental filter** | Remembering only the one criticism | Biased retrieval (mood-congruent memory) |
| **Catastrophising** | "This headache must be a brain tumour" | Availability and neglect of base rates |
| **Mind reading** | "Everyone thinks I'm boring" | Conclusions without evidence (jumping to conclusions) |
| **Emotional reasoning** | "I feel guilty, so I must have done wrong" | System 1 feelings treated as evidence |

:::widget thoughtrecord
{"situation": "My supervisor read my case report and said 'see me tomorrow'.", "thought": "I have made a terrible mistake and she thinks I am not fit for this course.", "emotion": "anxious", "traps": [{"label": "Mind reading", "right": true, "why": "You are guessing what she thinks of you without any evidence of her view."}, {"label": "Catastrophising", "right": true, "why": "A meeting has become 'not fit for the course': the worst outcome assumed from a neutral event."}, {"label": "All-or-nothing thinking", "why": "Close, but the thought is not about being perfect or a failure on one task; it is about her mind and a disaster."}, {"label": "Emotional reasoning", "why": "Anxiety is present, but the thought rests on her words, not on 'I feel it, so it is true'."}], "forEvidence": ["She did not smile when she said it."], "againstEvidence": ["She asks every trainee to meet after their first report.", "Last month she praised my history-taking.", "'See me' usually means feedback, not failure."], "balanced": "She probably wants to go through the report with me, as she does with everyone. If there are mistakes, feedback is how I learn them."}
:::

**Worry** in generalised anxiety disorder is a verbal, abstract chain of "what if" thinking; it reduces vivid imagery and physical arousal in the short term and is maintained by **intolerance of uncertainty** and beliefs about worry (as in Wells' metacognitive model). **Rumination** in depression is a repetitive, abstract, evaluative style ("why am I like this?") that prolongs low mood; training a more **concrete** style ("what exactly happened, and what could I do next?") helps.

### Disorders of thought form and language
In the mental status examination, **formal thought disorder** describes disorganised connections between ideas, seen in speech. Nancy Andreasen's scale for thought, language and communication describes signs such as:
- **Poverty of speech** and **poverty of content**.
- **Tangentiality** (replies that go off at a tangent and never return) and **circumstantiality** (taking a long, detailed route but reaching the point).
- **Derailment** (loosening of associations), **incoherence** (word salad), **illogicality**, **clanging** (words linked by sound), **neologisms** (new words) and **perseveration**.
**Concrete thinking** (difficulty with abstraction) was traditionally tested with **proverbs** ("What does 'a rolling stone gathers no moss' mean?") and **similarities**. But in India, many people with little schooling, or who never use English proverbs, give concrete answers without any illness, so proverb tests must be used with great caution, in the person's language and with familiar proverbs ("Jaisi karni, waisi bharni"), or not at all.

:::widget sort
{"prompt": "Name the sign of formal thought disorder in each reply.", "buckets": ["Tangentiality", "Circumstantiality", "Clanging", "Neologism", "Perseveration"], "items": [{"text": "Asked how she slept: 'Sleep is what cats do. My aunt in Kochi had cats. Kerala has many coconut trees.'", "bucket": 0, "why": "The reply goes off at a tangent and never returns to the question."}, {"text": "Asked how he got here: a ten-minute account of the auto, the driver's village, the traffic at the signal, his cousin's shop on the way, ending 'so I came by auto'.", "bucket": 1, "why": "Long and over-detailed, but it does reach the point."}, {"text": "'I am the main, the brain, the train, the rain.'", "bucket": 2, "why": "Words chosen for their sound, not their meaning."}, {"text": "'They put a thoughtsplinter in my head through the fan.'", "bucket": 3, "why": "A new, made-up word with private meaning."}, {"text": "'What is your name?' 'Ravi.' 'Where are you now?' 'Ravi.' 'What day is it?' 'Ravi.'", "bucket": 4, "why": "The same response repeated beyond its point, common in organic brain disorders."}]}
:::

### Language disorders
- **Aphasias** after stroke: **Broca's** (non-fluent, effortful, telegraphic speech; comprehension relatively spared; frontal lesion), **Wernicke's** (fluent but meaningless speech, poor comprehension, often unaware; temporal lesion), **conduction** (poor repetition; arcuate fasciculus) and **global** aphasia. These are covered in more depth in the module on the brain.
- **Developmental language disorder**: persistent difficulties with language not explained by hearing loss, intellectual disability or lack of exposure; often missed in multilingual children or mistaken for "just being slow to pick up English".
- **Specific learning disorder with impairment in reading** (dyslexia): often rooted in **phonological** processing (and, in PASS terms, successive processing). Reading difficulties look different in alphabetic English and in alphasyllabic Indian scripts such as Devanagari or Kannada, where each symbol stands for a syllable-like unit.

### Decision-making capacity
Psychology of reasoning matters directly to consent. **The Mental Healthcare Act 2017** (India) presumes that every person with mental illness has the **capacity** to make decisions about their mental health care and treatment, if they can:
1. **Understand** the information relevant to the decision.
2. **Appreciate** the reasonably foreseeable consequences of a decision or of not deciding.
3. **Communicate** the decision, by speech, writing, signs or any other means.
The Act adds that a decision others consider **inappropriate or wrong** does not, by itself, mean the person lacks capacity. Paul Appelbaum and Thomas Grisso's widely used framework adds **reasoning** (comparing options) as a fourth ability, and their structured interview operationalises all four.

:::widget decide
{
  "scene": "Mr Iyer, 67, with moderate depression, refuses a recommended antidepressant. He explains that his late wife had severe side effects on a similar medicine, that he would rather try psychotherapy first, and that he understands his mood may stay low for longer. The ward team says he 'lacks capacity because his choice is irrational'.",
  "ask": "What is the correct position under the MHCA 2017?",
  "choices": [
    { "label": "He lacks capacity, because refusing an effective treatment is irrational", "verdict": "harm", "outcome": "Treatment is imposed; he loses trust in the team and disengages.", "why": "The Act states that a decision others think wrong does not mean incapacity. Capacity is about the decision-making abilities, not the outcome chosen." },
    { "label": "He has capacity: he understands the information, appreciates the consequences and communicates a reasoned choice; respect it, offer psychotherapy, and keep the medicine option open", "verdict": "best", "outcome": "He starts psychotherapy; a few weeks later he agrees to try a different medicine.", "why": "He shows understanding, appreciation and communication, and gives reasons. Capacity must be judged decision by decision, against these abilities." },
    { "label": "Ask his son to decide instead", "verdict": "ok", "outcome": "The son is happy to be involved, but the decision is not his to make.", "why": "A nominated representative or family member supports the person, but does not override a person who has capacity." }
  ]
}
:::

:::clinician
Diagnostic reasoning errors are a leading source of harm in mental health care. Common patterns include **diagnostic overshadowing** (attributing physical symptoms to a known mental illness, so that delirium, thyroid disease or a tumour is missed), **anchoring** on a referral label, **premature closure**, **search satisficing** (stopping once one abnormality is found) and the **framing effect** of how a case is presented at handover. Debiasing strategies with some support include structured checklists, deliberately generating alternatives ("what else could this be?", "what would I not want to miss?"), slowing down at key decision points, and feedback on outcomes.
:::

:::recall
1. What is the jumping-to-conclusions bias, and how is it measured? || Deciding on little evidence; the beads task.
2. Link three of Beck's cognitive distortions to reasoning errors. || All-or-nothing (rigid categories), overgeneralisation (faulty induction), catastrophising (base-rate neglect and availability).
3. Distinguish tangentiality and circumstantiality. || Tangentiality never returns to the point; circumstantiality takes a detailed detour but reaches it.
4. Why should proverb tests be used cautiously in India? || Concrete answers often reflect education, language and unfamiliarity with the proverb, not illness.
5. State the three MHCA 2017 abilities for capacity. || Understand the relevant information, appreciate the foreseeable consequences, communicate the decision.
:::

:::mcq
Q: A patient asked "Where do you live?" talks at length about the history of her neighbourhood, the bus routes and her neighbours, and finally gives her address. This is:
- Tangentiality
- *Circumstantiality
- Flight of ideas
- Derailment
> She reaches the goal after a detailed detour.

Q: Under the MHCA 2017, which statement about capacity is correct?
- *A decision others consider wrong does not by itself show incapacity
- A person with schizophrenia lacks capacity by definition
- Capacity is judged once for all decisions
- Family members decide whenever a patient refuses treatment
> Capacity is presumed and judged against specific abilities, decision by decision.
:::

## 4.4 Creativity, intelligence and mental illness [core][advanced]
### Is creativity the same as intelligence?
- **Jacob Getzels and Philip Jackson** (1962) compared adolescents who were high in IQ but not in creativity with those high in creativity but not IQ. Both groups did equally well at school, but teachers **preferred the high-IQ students**; the creative students were more humorous and unconventional.
- **Michael Wallach and Nathan Kogan** (1965) argued that creativity tests given like exams under time pressure partly measure intelligence. Given in a relaxed, **game-like, untimed** way, creativity and intelligence scores were nearly **independent**. Their four groups (high-high, high-low, low-high, low-low) differed in confidence, social behaviour and anxiety.
- The **threshold hypothesis**: intelligence is necessary for creativity up to an IQ of about **120**; above that, other factors (personality, motivation, knowledge) matter more. Studies find support for a threshold for creative **potential** (divergent thinking), at varying IQ levels, but **creative achievement** keeps rising with intelligence. Overall, the correlation between IQ and divergent thinking is **modest**, around 0.2.

:::widget guess
{
  "prompt": "Across many studies, roughly what is the average correlation between IQ and scores on creativity (divergent thinking) tests?",
  "min": 0,
  "max": 1,
  "step": 0.05,
  "unit": "(r)",
  "answer": [0.1, 0.3],
  "reveal": "Around 0.2: positive but small. Intelligence helps creativity, but most of what makes someone creative lies elsewhere: openness to experience, intrinsic motivation, knowledge of a domain, tolerance of ambiguity and an environment that allows risk."
}
:::

### The creative personality
Across studies, creative people tend to be high in **openness to experience**, **tolerance of ambiguity**, **independence of judgment**, **intrinsic motivation** and **persistence**, and some show a mix of apparently opposite traits (playful and disciplined, humble and proud, as Csikszentmihalyi put it). Creativity in a **domain** also needs about a decade of deep knowledge and practice before major contributions: the "ten-year rule" seen in composers, painters and scientists.

### Creativity and the brain
There is no "creativity centre". Creative thinking involves cooperation between the **default mode network** (generating ideas, mind-wandering, imagination), the **executive control network** (evaluating and refining ideas) and the **salience network** (switching between them). The popular idea of a "right-brained" creative person is a myth.

:::widget brainmap
{
 "title": "Creativity is a network, not a spot",
 "focus": [
  "prefrontal",
  "parietal",
  "temporal"
 ],
 "notes": {
  "prefrontal": "Executive control network: selecting, evaluating and refining ideas.",
  "parietal": "Default mode network hubs: imagination, mind-wandering and idea generation.",
  "temporal": "Memory and meaning stores that supply the material for new combinations."
 },
 "caption": "Creative thinking depends on these networks working together, switched by the salience network."
}
:::

### The "mad genius" question
- Historical studies of famous writers and artists (Kay Redfield Jamison's work on poets, for example) found high rates of **mood disorders**, especially bipolar disorder.
- **Nancy Andreasen's** study of writers at the Iowa Writers' Workshop found about 80 percent had a lifetime mood disorder, against 30 percent of comparison participants, though the sample was small and the diagnoses were not blind.
- **Swedish population registers** covering over a million people found that people with **bipolar disorder**, and the **healthy siblings** of people with bipolar disorder or schizophrenia, were **over-represented in creative professions**; writers had higher rates of several disorders and of suicide. Studies of genetic risk scores for schizophrenia and bipolar disorder found they modestly predicted being in a creative profession.
- **Interpretation**: a **shared vulnerability**, perhaps traits such as openness, unusual associations, reduced latent inhibition (letting in more "irrelevant" information) and high energy, may help creativity in mild forms and contribute to illness in severe forms. But most creative people are **not** mentally ill, severe episodes **impair** creative work, and treatment does not destroy creativity: many artists with bipolar disorder report working better when well.

:::widget decide
{
  "scene": "Siddharth, 26, a promising musician in Kolkata with bipolar I disorder, is reluctant to continue lithium. He says, “When I'm high I write my best songs. Medicine will kill my creativity.”",
  "ask": "What is the best response?",
  "choices": [
    { "label": "Agree that he should stop lithium if music matters more to him than stability", "verdict": "harm", "outcome": "He stops lithium, becomes manic, loses his band and his savings, and is admitted; he writes nothing for a year.", "why": "Mania usually disrupts sustained creative work, and stopping lithium abruptly sharply raises relapse and suicide risk. This response abandons him to a false choice." },
    { "label": "Take his concern seriously: explore what helps his creativity, share evidence that most artists work better when stable, discuss dose and side effects (and alternatives if lithium dulls him), and agree a shared plan to monitor both mood and creative output", "verdict": "best", "outcome": "His dose is adjusted, he keeps a creativity and mood diary, and he finds he still writes well, with more finished songs than before.", "why": "Shared decision-making that respects his values, and that tests the belief with his own data, improves adherence and outcomes." },
    { "label": "Tell him creativity and bipolar disorder have nothing to do with each other", "verdict": "ok", "outcome": "He feels dismissed, because he knows his experience.", "why": "There is a real association at the population level. Denying it damages trust; putting it in context helps." }
  ]
}
:::

:::clinician
The reduced latent inhibition account (Carson, Peterson and Higgins' work with high-achieving creative students) proposes that creative people let more stimuli into awareness, which, combined with high intelligence and good working memory, supports original thought, while combined with poorer cognitive control it may increase vulnerability to psychosis. This "shared vulnerability" model fits the register findings on unaffected relatives. Clinically, the relevant question is rarely "creativity versus treatment" but how to minimise cognitive and emotional blunting: for example, lithium dose and level optimisation, avoiding unnecessary polypharmacy, and treating comorbid depression, which itself suppresses creativity more than any mood stabiliser.
:::

:::recall
1. What did Getzels and Jackson find? || High-IQ and high-creative adolescents did equally well at school, but teachers preferred the high-IQ students.
2. How did Wallach and Kogan change creativity testing, and what did they find? || Relaxed, untimed, game-like testing; creativity and intelligence were nearly independent.
3. State the threshold hypothesis. || Intelligence is necessary for creativity up to about IQ 120; beyond it, other factors matter more.
4. What did Swedish registry studies find about relatives? || Healthy siblings of people with bipolar disorder or schizophrenia were over-represented in creative professions.
5. Name three brain networks involved in creative thinking. || Default mode, executive control and salience networks.
:::

:::mcq
Q: Wallach and Kogan found creativity and intelligence nearly independent mainly because they:
- *Tested creativity in an untimed, game-like way
- Studied only adults, not children
- Used only verbal tests of intelligence
- Excluded all high-IQ children from the sample
> Removing exam-like pressure separated creativity from intelligence.
:::

# Part V · Exam zone

## 5.1 Q&A bank · Starting [starting]
Think each question through, then open the answer and compare.

:::qa What is the difference between an algorithm and a heuristic? When would you use each? [starting]
### Short answer
An algorithm is a step-by-step method that guarantees a correct answer if followed. A heuristic is a quick rule of thumb that usually works but can fail.

| | Algorithm | Heuristic |
|---|---|---|
| Guarantee | Always reaches the solution | No guarantee |
| Speed | Often slow | Fast |
| Effort | High | Low |
| Example | Trying every combination on a three-digit lock | Trying birthdays and 1-2-3 first |
| Best when | Accuracy matters and time allows (drug dose calculations) | Time is short and a good-enough answer will do (choosing a queue at the bank) |

### A clinical note
Diagnostic checklists work like algorithms; a clinician's quick pattern recognition works like a heuristic. Good practice uses the heuristic to generate ideas and the checklist to check them.
:::

:::qa What are mental set and functional fixedness? Give examples and suggest ways to overcome them. [starting]
### Short answer
Both are ways that past experience blocks a new solution. Mental set is sticking to a method that worked before; functional fixedness is seeing an object only in its usual use.

### Examples
- **Mental set**: after solving several water-jar problems with a long formula, people keep using it when a two-step method works.
- **Functional fixedness**: in Duncker's candle problem, people do not see that the box holding the pins can become a shelf.

### Ways to overcome them
1. Take a break (incubation) so the old approach fades.
2. Restate the problem in different words.
3. List an object's parts and properties, not its name ("a cardboard tray", not "a box of pins").
4. Ask someone from a different background; they do not share your set.
5. Warn yourself: simply being told "don't be blind" helped many people in the water-jar task.
:::

:::qa Describe the main milestones of language development in the first five years. [starting]
### Short answer
Children move from crying and cooing to babbling, single words, two-word phrases and then rapidly expanding grammar, at broadly similar ages across languages.

| Age (approximate) | Milestone | Example |
|---|---|---|
| Birth to 2 months | Crying; preference for human voices | Calms to the mother's voice |
| 2 to 4 months | Cooing | "Ooo", "aah" |
| 6 to 10 months | Babbling | "ba-ba", "da-da" |
| Around 12 months | First words | "Amma", "pani" |
| 18 to 24 months | Vocabulary spurt; two-word speech | "Papa go", "more milk" |
| 2 to 5 years | Grammar grows; overregularisation | "I goed", "two mouses" |

### When to be concerned
No babbling by 12 months, no words by 16 months, no two-word phrases by 24 months, or any loss of language at any age needs assessment, including a hearing test.
:::

:::qa What does an IQ score mean, and what are its limitations? [starting]
### Short answer
An IQ score compares a person's performance on a standardised test with others of the same age, on a scale with mean 100 and standard deviation 15. It predicts school and job performance well, but it is a sample of certain abilities on one day, not a measure of worth.

### What a score tells you
- 100 is average; about 68 percent of people score 85 to 115.
- 130 is about the 98th percentile; 70 is about the 2nd.

### Limitations
1. **Measurement error**: a score is best read as a range (roughly plus or minus 5 points).
2. **Culture and language**: tests assume particular knowledge and test-taking habits.
3. **Narrow scope**: little about creativity, wisdom, social skill or motivation.
4. **Outdated norms** inflate scores (the Flynn effect).
5. **Context**: anxiety, illness, poor sleep and unfamiliarity with testing lower scores.
:::

:::qa What is the difference between convergent and divergent thinking? How are they related to intelligence and creativity? [starting]
### Short answer
Convergent thinking narrows to one correct answer; divergent thinking generates many possible answers. IQ tests mostly measure convergent thinking, while creativity tests mostly measure divergent thinking.

| | Convergent | Divergent |
|---|---|---|
| Aim | The single best answer | Many varied answers |
| Typical task | "What comes next: 2, 4, 8, 16?" | "List all the uses of a brick" |
| Linked with | Intelligence tests, MCQs | Creativity tests |
| Scored for | Correctness | Fluency, flexibility, originality, elaboration |

### Both matter
Creative work needs divergent thinking to generate ideas and convergent thinking to choose and refine the best one.
:::

:::qa What are System 1 and System 2 thinking? Give two examples of each. [starting]
| | System 1 | System 2 |
|---|---|---|
| Nature | Fast, automatic, intuitive | Slow, effortful, deliberate |
| Awareness | Mostly unconscious | Conscious |
| Capacity | Runs alongside other tasks | Limited by working memory |
| Examples | Recognising a friend's face; sensing anger in a voice | Solving 17 × 24; checking diagnostic criteria one by one |

### How they interact
System 1 offers quick answers; System 2 is supposed to check them but often does not, which is why the bat-and-ball problem fools so many people.

### Caution
These are types of processing, not two brain organs, and intuition built on real experience is often accurate.
:::

:::qa What is a concept? Why are concepts useful? [starting]
### Short answer
A concept is a mental category that groups objects, events or ideas sharing common properties.

### Why they are useful
1. **Economy**: we do not treat every object as new.
2. **Prediction**: knowing something is a "snake" tells us it may be dangerous.
3. **Communication**: shared concepts let us talk about the world.
4. **Reasoning**: concepts are the units we combine in propositions and arguments.

### Example
Once a child has the concept "fruit", she can expect a new fruit like a rambutan to be sweet and edible.
:::

:::qa What is insight in problem solving? How does it differ from trial-and-error? [starting]
| | Insight | Trial and error |
|---|---|---|
| How the solution comes | Suddenly, after restructuring the problem | Gradually, as wrong attempts drop out |
| Feeling | "Aha!" | No sudden moment |
| After solving | Smooth performance; transfers to similar problems | Slow improvement over trials |
| Classic study | Köhler's chimpanzees joining sticks | Thorndike's cats in puzzle boxes |

### Example
A student stuck on a puzzle takes a walk and suddenly sees a new way to arrange the pieces: insight. Another tries every arrangement until one works: trial and error.
:::

:::qa What is confirmation bias? Give an everyday and a clinical example. [starting]
### Short answer
Confirmation bias is the tendency to seek, notice and remember information that supports what we already believe, and to ignore what contradicts it.

### Examples
- **Everyday**: a cricket fan remembers every match his team won when he wore his lucky shirt and forgets the losses.
- **Clinical**: a clinician who suspects depression asks only about low mood and misses symptoms of thyroid disease.

### Reducing it
1. Ask "what evidence would prove me wrong?"
2. Actively look for alternatives.
3. Ask a colleague to argue the other side.
:::

:::qa Explain the five levels of language with examples. [starting]
| Level | Unit | Example |
|---|---|---|
| Phonology | Phonemes, the sounds that change meaning | "Pin" versus "bin"; Hindi "kal" versus "khal" |
| Morphology | Morphemes, the smallest units of meaning | "Un-kind-ness" has three |
| Syntax | Rules for word order | Hindi: "Ram ne seb khaya" (subject, object, verb) |
| Semantics | Meaning | "Bank" of a river versus a bank |
| Pragmatics | Use in social context | "Can you pass the salt?" is a request |

### Why it matters
Language difficulties can occur at any level: a child may have a speech-sound problem (phonology) but normal understanding (semantics).
:::

:::qa What did Binet and Simon contribute to intelligence testing? [starting]
### Short answer
In 1905 they built the first practical intelligence test, to identify Paris schoolchildren who needed extra help.

### Key ideas
1. **Mental age**: the age level at which a child performs.
2. **Items arranged by age**, based on what typical children could do.
3. Tests of **judgment, reasoning and comprehension**, not just sensory speed (as Galton had used).
4. Binet saw intelligence as improvable through education, not fixed.

### What followed
Stern proposed the ratio IQ; Terman adapted the test as the Stanford-Binet; Wechsler later introduced the deviation IQ.
:::

:::qa Calculation: a 12-year-old has a mental age of 15, and an 8-year-old has a mental age of 6. Find their ratio IQs. Why is ratio IQ not used for adults? [starting]
### Working
- First child: 15 divided by 12, times 100 = **125**.
- Second child: 6 divided by 8, times 100 = **75**.

### Why not for adults
Mental age stops rising in the late teens, but chronological age keeps rising, so ratio IQ would fall every year even if ability stayed the same. Modern tests use the **deviation IQ**, comparing each person with others of the same age (mean 100, SD 15).
:::

:::qa What is the difference between fluid and crystallised intelligence? How do they change with age? [starting]
| | Fluid intelligence | Crystallised intelligence |
|---|---|---|
| Meaning | Reasoning about new problems | Knowledge and skills built up through education and experience |
| Example tasks | Matrices, series, new puzzles | Vocabulary, general knowledge |
| With age | Peaks in early adulthood, then slowly declines | Rises or holds steady into later life |

### Everyday example
A young engineer may solve a new puzzle faster; an experienced judge may understand a complex legal argument better. Both are intelligent in different ways.
:::

:::qa What is creativity, and why is it more than divergent thinking? [starting]
### Short answer
Creativity is producing something both **novel** and **useful or appropriate**. Divergent thinking generates many ideas, but creative work also needs knowledge, judgment, persistence and motivation.

### What creativity needs
1. **Knowledge** of the field.
2. **Divergent thinking** to generate options.
3. **Convergent thinking** to choose and refine.
4. **Motivation**, especially interest and enjoyment.
5. **An environment** that allows risk and accepts new ideas.

### Example
A tailor who designs a new blouse pattern needs skill with cloth, many ideas, judgment about what will fit and sell, and customers willing to try it.
:::

## 5.2 Q&A bank · Beginner [beginner]
Answers here assume the Beginner sections. Write your own outline first.

:::qa Explain the representativeness, availability and anchoring heuristics, with examples of the errors each produces. [beginner]
### Short answer
Tversky and Kahneman showed that people judge probability with three shortcuts. Each saves effort but produces predictable errors.

| Heuristic | How it works | Typical error | Example |
|---|---|---|---|
| Representativeness | Judging by resemblance to a typical case | Conjunction fallacy, base-rate neglect, gambler's fallacy | Judging Linda more likely a "feminist bank teller" than a "bank teller" |
| Availability | Judging frequency by ease of recall | Overestimating vivid, recent or reported events | Fearing flying more than driving after news of a crash |
| Anchoring | Starting from a number and adjusting too little | Estimates pulled towards irrelevant numbers | After a random wheel showed 65, estimates of African countries in the UN were higher |

### In the clinic
- Representativeness: diagnosing by how "typical" a patient looks, ignoring how common the condition is.
- Availability: overestimating a rare diagnosis seen last week.
- Anchoring: sticking to the referral diagnosis.

### Reducing errors
Consider base rates, ask what else could explain the picture, and seek disconfirming evidence.
:::

:::qa Explain prospect theory and the framing effect, using the Asian disease problem. [beginner]
### Short answer
Prospect theory says people judge outcomes as gains or losses from a reference point, feel losses about twice as strongly as gains, are risk-averse for gains and risk-seeking for losses, and overweight small probabilities. Framing the same choice as gains or losses therefore changes decisions.

### The Asian disease problem
- **Gain frame**: save 200 of 600 for sure, or a one-third chance of saving all. Most chose the sure option.
- **Loss frame**: 400 of 600 die for sure, or a one-third chance that nobody dies. Most chose the gamble.
The options are identical; only the description changed.

### Principles
| Principle | Meaning | Everyday example |
|---|---|---|
| Reference dependence | Outcomes judged relative to a starting point | A salary rise feels like a loss if a colleague got more |
| Loss aversion | Losses hurt about twice as much | Refusing a fair 50:50 bet to win or lose ₹1,000 |
| Diminishing sensitivity | Risk-averse in gains, risk-seeking in losses | Gamblers chasing losses |
| Probability weighting | Small chances overweighted | Buying lottery tickets and insurance |

### Application
Health messages framed as losses ("you lose years of life by smoking") or gains ("you gain years by quitting") work differently for prevention and for detection behaviours.
:::

:::qa Compare Piaget, Vygotsky and Chomsky on the relationship between language and thought. [beginner]
### Short answer
Piaget saw thought as coming first, Vygotsky saw thought and language merging and shaping each other through social life, and Chomsky saw language as a separate, innate system.

| | Piaget | Vygotsky | Chomsky |
|---|---|---|---|
| Direction | Thought leads; language reflects it | Separate roots, merging around age 2 | Language is a separate module |
| Children's self-talk | Egocentric speech that fades | Private speech that becomes inner speech and guides action | Not central |
| Role of others | Peers and experience challenge thinking | Adults and culture provide language tools | Input only sets parameters |
| Educational implication | Readiness; discovery learning | Scaffolding in the zone of proximal development | Language develops given exposure |

### Evaluation
Research on private speech supports Vygotsky: children use more self-talk on harder tasks and those who do so tend to perform better. The weak version of linguistic relativity shows language influences some thinking, while colour and number research shows much thought does not depend on words.
:::

:::qa Critically evaluate Gardner's theory of multiple intelligences. [beginner]
### Short answer
Gardner proposed eight relatively independent intelligences, based on neuropsychological, developmental and cultural criteria. The theory broadened ideas of talent and changed education, but its scientific support is weak.

### The eight
Linguistic, logical-mathematical, spatial, musical, bodily-kinaesthetic, interpersonal, intrapersonal, naturalistic.

### Strengths
- Draws on brain damage, savants, prodigies and development, not only test correlations.
- Values abilities that schools and IQ tests often ignore (dance, music, social skill).
- Encourages varied teaching and assessment.

### Weaknesses
1. When measured, most of the intelligences correlate with each other and with g.
2. No standard tests were provided, so the theory is hard to test.
3. Some "intelligences" may be talents or personality traits.
4. Its popular spin-off, matching teaching to "learning styles", has no evidence of benefit.

### Conclusion
A valuable educational idea and a reminder that intelligence is broader than IQ, but not a replacement for hierarchical models supported by data.
:::

:::qa Explain the PASS theory of intelligence and its applications. [beginner]
### Short answer
PASS, developed by J. P. Das with Naglieri and Kirby, and with Kar and Parrila, describes intelligence as four cognitive processes based on Luria's three functional units of the brain: Planning, Attention, Simultaneous and Successive processing.

| Process | Function | Luria's unit |
|---|---|---|
| Planning | Strategy selection, monitoring, self-correction | Third unit (frontal lobes) |
| Attention | Arousal and selective focus | First unit (brainstem, reticular system) |
| Simultaneous | Integrating parts into wholes | Second unit (occipital-parietal) |
| Successive | Processing information in serial order | Second unit (fronto-temporal) |

### Measurement
The Cognitive Assessment System measures each process with specific tasks.

### Applications
- **Learning disability**: many poor readers show weak successive processing; the PASS Reading Enhancement Programme trains it.
- **ADHD**: often weak planning and attention scores.
- **Fairer assessment**: less reliance on vocabulary and general knowledge, with smaller differences between social groups.

### Evaluation
Strong theoretical basis in neuropsychology and clear educational use; fewer independent replications than CHC-based tests, and some overlap with working memory and executive function measures.
:::

:::qa Compare the classical, prototype and exemplar views of concepts, with evidence for each. [beginner]
| View | A concept is | Evidence for | Evidence against |
|---|---|---|---|
| Classical | A set of defining features | Works for formal concepts (triangle, prime number) | No defining features for "game"; fuzzy boundaries; typicality effects |
| Prototype | An average or best example | Typical members verified faster, named first, learned earlier; dot-pattern studies | Ignores variability; cannot explain knowledge of unusual members |
| Exemplar | Many stored members | Captures variability; explains sensitivity to specific cases | Memory-heavy; unclear which exemplars count |

### Synthesis
People probably use prototypes for quick judgments, exemplars for unusual cases, and theories about what makes something what it is when reasoning carefully.
:::

:::qa Explain the Wason selection task and the reasons proposed for why the social version is easier. [beginner]
### The abstract task
Cards: E, K, 4, 7. Rule: "If a card has a vowel on one side, it has an even number on the other." Correct choice: **E and 7**. Fewer than one in ten choose this; most choose E, or E and 4.

### The social version
"If someone is drinking beer, they must be over 18." Cards: beer, cola, 25, 16. Correct: beer and 16. About three-quarters solve it.

### Explanations
| Theory | Claim |
|---|---|
| Familiarity | Real-world experience with the rule |
| Pragmatic reasoning schemas (Cheng and Holyoak) | Learned rules for permission and obligation |
| Cheater detection (Cosmides) | An evolved mechanism for spotting violations of social contracts |
| Matching bias | In the abstract version people choose cards named in the rule |

### Lesson
Human reasoning is not purely formal logic; content and context strongly affect performance.
:::

:::qa Calculation: what is the minimum number of moves to solve a Tower of Hanoi with 4 discs? With 5? Why does hill climbing fail on it? [beginner]
### Working
Minimum moves = 2 raised to n, minus 1.
- 4 discs: 16 minus 1 = **15**.
- 5 discs: 32 minus 1 = **31**.

### Why hill climbing fails
Hill climbing always takes the move that seems closest to the goal. To move the largest disc, you must first move the smaller discs **away** from the goal peg, which looks like moving backwards. Only planning with sub-goals (means-ends analysis) solves it efficiently.

### Clinical link
Tower tasks (Tower of London) measure planning in frontal lobe conditions.
:::

:::qa Describe the major obstacles to problem solving and the classic experiments that demonstrated them. [beginner]
| Obstacle | Meaning | Experiment |
|---|---|---|
| Mental set (Einstellung) | Using a familiar method when a simpler one exists | Luchins' water jars |
| Functional fixedness | Seeing objects only in their usual function | Duncker's candle problem; Maier's two-string problem |
| Confirmation bias | Seeking supporting evidence | Wason's 2-4-6 task |
| Unnecessary constraints | Assuming rules that are not there | The nine-dot problem (lines must go outside the square) |
| Surface focus | Missing a useful analogy | Gick and Holyoak's radiation problem |

### Overcoming them
Breaks and incubation, restating the problem, listing object features, generating alternatives, and comparing several analogies.
:::

:::qa What is the difference between normative and descriptive models of decision making? Explain bounded rationality. [beginner]
| | Normative | Descriptive |
|---|---|---|
| Question | How should a rational person decide? | How do people actually decide? |
| Example | Expected utility theory | Prospect theory; heuristics and biases |

### Bounded rationality
Herbert Simon argued that people have limited time, information and processing capacity, so they **satisfice**: they choose the first option that meets their needs rather than searching for the best.

### Example
Choosing a coaching institute: rather than comparing every one in the city, a student picks the first with good results, a reasonable fee and a convenient location.

### Gigerenzer's view
Simple heuristics can be **ecologically rational**: well matched to real environments, sometimes beating complex models.
:::

:::qa What are the main stages of children's private speech, according to Vygotsky? What does research show? [beginner]
### Stages
1. **Social speech**: adults guide the child's actions with words.
2. **Private speech**: the child talks aloud to guide herself, especially from about 3 to 7 years.
3. **Inner speech**: speech goes silent and abbreviated, becoming verbal thought.

### Research findings
- Children use more private speech on harder tasks.
- Children who use more task-relevant private speech often perform better.
- Private speech becomes quieter and more abbreviated with age.
- Children with ADHD may use private speech later and less effectively.

### Contrast with Piaget
Piaget called it egocentric speech, a sign of immature thought that simply fades. Vygotsky saw it as a tool for self-regulation.
:::

:::qa Explain Chomsky's arguments against Skinner's account of language. How have later researchers responded? [beginner]
### Chomsky's arguments
1. **Productivity**: children say sentences they have never heard.
2. **Poverty of the stimulus**: input is too limited to teach complex grammar.
3. **Rule-based errors**: "goed" and "mouses" are never modelled by adults.
4. **Little correction**: parents rarely correct grammar.
5. **Speed and uniformity**: children everywhere learn grammar fast, at similar ages.

### Later responses
| View | Response |
|---|---|
| Statistical learning | Infants extract patterns from input far better than once thought |
| Usage-based (Tomasello) | Grammar builds from joint attention and reading intentions |
| Social interactionist (Bruner) | Child-directed speech and routines scaffold learning |
| Nativist support | Nicaraguan Sign Language; critical period evidence |

### Current view
Children bring strong learning abilities, and possibly language-specific biases, to rich social input.
:::

:::qa Explain Thurstone's primary mental abilities and how his theory relates to Spearman's g. [beginner]
### The seven abilities
Verbal comprehension, word fluency, number, space, associative memory, perceptual speed and inductive reasoning.

### Relation to g
| Spearman | Thurstone |
|---|---|
| One general factor plus specific factors | Seven separate group factors |
| Based on correlations among school tests | Based on 56 tests with a different factor method |
| Emphasised what tests share | Emphasised how abilities differ |

When Thurstone tested broader samples, his primary abilities correlated with each other, and he accepted a second-order g. The two theories describe different levels of the same hierarchy, as Vernon and later Carroll showed.
:::

:::qa Describe Guilford's structure of intellect model and evaluate it. [beginner]
### The model
Every ability combines three dimensions:
- **Operations**: cognition, memory (later split into recording and retention), divergent production, convergent production, evaluation.
- **Contents**: figural (later visual and auditory), symbolic, semantic, behavioural.
- **Products**: units, classes, relations, systems, transformations, implications.
The total grew from 120 to 150 to 180 abilities.

### Strengths
- Systematic and detailed.
- Introduced **divergent production**, the basis of creativity testing.

### Weaknesses
1. His own data showed many supposedly independent abilities correlated, consistent with g.
2. Many cells were never measured reliably.
3. Little practical value for prediction.
:::

:::qa What is emotional intelligence? Compare ability, mixed and trait models. [beginner]
| Model | Proponents | Definition | Measure |
|---|---|---|---|
| Ability | Mayer and Salovey | Perceiving, using, understanding and managing emotions | MSCEIT, with right and wrong answers |
| Mixed | Goleman; Bar-On | A broad set including self-awareness, motivation, empathy, social skill | Self-report and 360-degree ratings |
| Trait | Petrides | Self-perceived emotional dispositions | Self-report questionnaire |

### Evaluation
- Ability EI is distinct from IQ and personality and predicts some social outcomes modestly.
- Mixed and trait models overlap strongly with personality traits.
- Claims that EI matters "more than IQ" are not supported.
:::

## 5.3 Q&A bank · Advanced [advanced]
These are the long, analytical questions asked in NET Paper 2, clinical entrances and MA examinations.

:::qa Trace the development of intelligence theories from Spearman to the Cattell-Horn-Carroll model. Is there a consensus? [advanced]
### Short answer
Factor-analytic theories moved from a single g, through multiple independent abilities, to hierarchical models in which g sits at the top of broad and narrow abilities. CHC is the closest thing to a consensus.

### The sequence
1. **Spearman (1904)**: the positive manifold explained by g plus specific factors.
2. **Thurstone (1938)**: seven primary mental abilities; later a second-order g.
3. **Guilford (1955 onwards)**: operations × contents × products, up to 180 abilities; no g.
4. **Vernon (1950)**: g, then v:ed and k:m, then minor and specific factors.
5. **Cattell and Horn**: fluid versus crystallised intelligence, then about nine broad abilities.
6. **Carroll (1993)**: three strata from reanalysis of more than 460 data sets.
7. **CHC**: Cattell-Horn and Carroll merged; basis of most modern tests.

### The consensus
| Point of agreement | Remaining debate |
|---|---|
| Abilities are hierarchical | Whether g is a real cause or a statistical summary |
| A general factor exists statistically | How many broad abilities, and which |
| Broad abilities add useful information | Whether CHC explains why these abilities exist |

### Beyond factor analysis
Gardner, Sternberg, PASS, Anderson and Ceci add neuropsychology, development and context, and explain abilities factor analysis misses.
:::

:::qa "Intelligence is largely inherited." Critically evaluate this statement. [advanced]
### Short answer
Genetic differences account for a substantial share of IQ differences within studied populations, especially in adulthood, but "largely inherited" is misleading: heritability is population-specific, environments change IQ substantially, and heritability says nothing about group differences.

### Evidence for genetic influence
- Identical twins reared apart correlate about 0.75.
- Heritability rises from about 0.2 to 0.4 in childhood to 0.6 to 0.8 in adulthood.
- Intelligence is highly polygenic.

### Evidence for environmental influence
- The **Flynn effect**: about 3 points per decade, too fast to be genetic.
- **Schooling** raises IQ by roughly 1 to 5 points per year.
- **Early adoption** from deprived orphanages raises IQ.
- **Iodine, lead and nutrition** affect IQ at population level.
- In some US samples, heritability was lower in poor families.

### Conceptual points
1. Heritability describes variation, not individuals.
2. It depends on the range of environments in the sample.
3. Lewontin's seeds: within-group heritability cannot explain between-group differences.
4. Genes and environments correlate and interact.

### Conclusion
Both genes and environments matter, and they work together. Policies on nutrition, schooling and early childhood remain powerful levers.
:::

:::qa How does the psychology of reasoning and decision making apply to clinical practice? [advanced]
### Short answer
Clinicians use the same heuristics as everyone else, and patients' disorders often involve reasoning biases. Understanding both improves diagnosis, therapy and judgments of capacity.

### Clinician reasoning
| Bias | Clinical form | Countermeasure |
|---|---|---|
| Anchoring | Sticking to the referral diagnosis | Re-derive the diagnosis from the evidence |
| Availability | Overdiagnosing a condition seen recently | Consider base rates |
| Premature closure | Stopping once one explanation fits | Ask "what else could this be?" |
| Diagnostic overshadowing | Blaming physical symptoms on known mental illness | Examine and investigate physical causes |
| Confirmation bias | Asking only questions that fit | Seek disconfirming evidence |

### Patients' reasoning
- **Psychosis**: jumping to conclusions (beads task), bias against disconfirmatory evidence, externalising attributions.
- **Depression**: overgeneralisation, all-or-nothing thinking, rumination.
- **Anxiety**: catastrophising, intolerance of uncertainty, worry as abstract "what if" chains.

### Capacity under the MHCA 2017
The person must be able to understand relevant information, appreciate consequences and communicate a decision. A choice others think wrong does not by itself show incapacity.

### Treatments that target reasoning
CBT, metacognitive therapy, metacognitive training for psychosis and problem-solving therapy.
:::

:::qa Discuss the relationship between creativity, intelligence and mental illness. [advanced]
### Short answer
Creativity relates modestly to intelligence (about 0.2), with intelligence perhaps necessary up to a threshold. Creativity is associated at the population level with mood disorders and with being a relative of people with bipolar disorder or schizophrenia, probably through shared traits, but most creative people are not ill and illness impairs creative work.

### Creativity and intelligence
- Getzels and Jackson: high-IQ and high-creative adolescents did equally well; teachers preferred the high-IQ group.
- Wallach and Kogan: under relaxed, untimed conditions, creativity and intelligence were nearly independent.
- Threshold hypothesis: intelligence matters up to about IQ 120 for creative potential; creative achievement keeps rising with intelligence.

### Creativity and mental illness
| Evidence | Finding | Caution |
|---|---|---|
| Studies of eminent writers and artists | High rates of mood disorder | Biased samples |
| Iowa Writers' Workshop | About 80 percent lifetime mood disorder | Small sample, not blind |
| Swedish population registers | Bipolar disorder and unaffected siblings over-represented in creative jobs | Association, not cause |
| Genetic risk scores | Small prediction of creative professions | Very small effects |

### Explanations
Shared traits such as openness, reduced latent inhibition and unusual associations, helpful with good cognitive control and harmful with poor control.

### Clinical implication
Treat illness while protecting creativity: optimise doses, avoid blunting, and use the person's own records of mood and output.
:::

:::qa Evaluate the Sapir-Whorf hypothesis in the light of research on colour, space and kinship. [advanced]
### Short answer
The strong version (language determines thought) is not supported. The weak version (language influences perception, memory and habits of thought) has good support in specific areas.

### Against the strong version
- Basic colour terms appear in a fairly fixed order across languages (Berlin and Kay).
- Dani speakers, with two colour terms, still remembered focal colours best.
- Whorf's claims about Hopi time were not borne out.
- Hindi "kal" means yesterday and tomorrow, yet speakers do not confuse past and future.

### For the weak version
| Domain | Finding |
|---|---|
| Colour | Berinmo speakers discriminate better across their own naming boundary; Russian speakers discriminate blues faster across "goluboy" and "siniy", an effect removed by verbal interference |
| Space | Speakers of languages using compass directions stay oriented to north, south, east and west |
| Kinship | Hindi and Tamil kinship terms make maternal and paternal relationships habitual to think about |

### Conclusion
Language works as a tool that makes some distinctions quicker and more habitual, especially when words are used during the task. It does not limit what can be thought.
:::

:::qa Compare mental logic and mental models theories of deductive reasoning. Which explains the evidence better? [advanced]
| | Mental logic | Mental models |
|---|---|---|
| Claim | People have formal inference rules in the mind | People build small models of possible situations and check for counterexamples |
| Proponents | Rips, Braine | Johnson-Laird |
| Difficulty predicted by | Number of rule steps | Number of models needed |
| Explains errors as | Missing or misapplied rules | Failing to build all models |

### Evidence
- Problems needing more models are harder and slower, as mental models predicts.
- People draw invalid conclusions that fit the first model they build.
- Content effects (belief bias, the social Wason task) are hard for a pure logic theory.

### Conclusion
Mental models fits more of the data, although dual-process views add that fast intuitive processes often decide before any model is built.
:::

:::qa Explain dual-process theories of reasoning. What are their strengths and criticisms? [advanced]
### Claim
Reasoning involves two kinds of process: Type 1 (fast, automatic, associative, independent of working memory) and Type 2 (slow, deliberate, rule-based, dependent on working memory).

### Evidence
- Belief bias increases under time pressure and with working-memory load.
- People higher in cognitive ability and in the disposition to reflect resist intuitive errors more.
- The Cognitive Reflection Test separates intuitive from reflective answers.

### Criticisms
1. Features may not cluster neatly into two types.
2. Intuition can follow logical rules (people sometimes "feel" a conflict before reasoning).
3. Risk of explaining everything after the fact.

### Applied value
Slowing down at key decisions, checklists and "consider the opposite" strategies all aim to engage Type 2 processing.
:::

:::qa How does expertise change problem solving? Discuss chunking, deliberate practice and the limits of practice. [advanced]
### What experts do differently
| Feature | Evidence |
|---|---|
| Large stores of meaningful chunks | Chess masters recall real but not random positions better |
| Classify problems by deep structure | Physics experts group by principle; novices by surface |
| Work forwards from knowledge | Novices work backwards from the goal |
| Better self-monitoring | Experts notice errors sooner |

### Deliberate practice
Focused, effortful practice with feedback aimed at weaknesses, sustained for years.

### Limits
A large 2014 meta-analysis found deliberate practice explained about 12 percent of performance differences overall, more in games and music and much less in professions. Starting age, working memory, personality and opportunity also matter.

### Clinical example
Experienced clinicians recognise patterns quickly, but this can also produce premature closure; expertise needs structured checking.
:::

:::qa What is metacognition? Explain its role in learning and in psychological disorders. [advanced]
### Definition
Knowledge about one's own thinking (person, task, strategy knowledge) and the regulation of it (planning, monitoring, evaluating).

### In learning
- Accurate monitoring decides what to restudy; immediate judgments of learning are inflated by fluency, delayed ones are accurate.
- Students often mistake familiarity for knowledge; self-testing corrects this.
- Teaching metacognitive strategies improves achievement.

### In disorders
| Condition | Metacognitive feature | Treatment |
|---|---|---|
| Generalised anxiety | Positive and negative beliefs about worry | Metacognitive therapy |
| Psychosis | Overconfidence in errors, jumping to conclusions, reduced insight | Metacognitive training |
| Depression | Rumination maintained by beliefs that it helps | Metacognitive therapy, rumination-focused CBT |
| OCD | Thought-action fusion | CBT targeting beliefs about thoughts |
:::

:::qa Discuss the critical period hypothesis for language. What evidence supports and challenges it? [advanced]
### The hypothesis
Lenneberg proposed that language is acquired most easily before puberty, as the brain matures.

### Supporting evidence
1. Genie, isolated until 13, learned words but not grammar.
2. Immigrants arriving before about 7 reach native-like grammar; later arrivals decline steadily.
3. Deaf children exposed to sign language late show lasting grammatical difficulties.
4. Nicaraguan Sign Language: younger children made the grammar more systematic.

### Challenges
- Genie suffered extreme abuse and deprivation, confounding the result.
- Decline with age is gradual, not a sharp cut-off.
- Adults can learn vocabulary and much grammar well; accent is most age-sensitive.

### Conclusion
A **sensitive period**, strongest for phonology and grammar, fits the evidence better than a strict critical period.
:::

:::qa Evaluate Sternberg's triarchic theory of intelligence. [advanced]
### The theory
- **Analytical**: metacomponents, performance and knowledge-acquisition components.
- **Creative**: dealing with novelty and automatising familiar tasks.
- **Practical**: adapting to, shaping or selecting environments; tacit knowledge.
Later reframed as **successful intelligence**.

### Strengths
- Brings in context, culture and real-world competence.
- Studies such as the Kenyan herbal-knowledge research show practical and academic skills can diverge.
- Useful for education and selection beyond IQ.

### Weaknesses
1. Measures of practical intelligence often correlate with g.
2. Some findings have not replicated.
3. The three parts are hard to measure independently.

### Conclusion
A valuable widening of the concept of intelligence, with mixed empirical support for its distinct parts.
:::

:::qa What is test bias? How should intelligence be assessed fairly in a multilingual country like India? [advanced]
### Kinds of bias
| Kind | Meaning | Example |
|---|---|---|
| Content | Items assume particular knowledge | Pictures of objects unknown in a rural area |
| Language | Testing in a weaker language | A Desia-speaking child tested in English |
| Norms | Norm group unlike the person | Urban English-medium norms for a rural child |
| Predictive | Test predicts differently for groups | Same score predicting different school success |
| Situational | Unfamiliar testing setting, anxiety, stereotype threat | A child never tested under time pressure |

### Fair practice
1. Test in the person's strongest language, with an interpreter for instructions if needed.
2. Prefer recent, local norms.
3. Use non-verbal and performance measures alongside verbal ones.
4. Always assess adaptive functioning and gather history from family and school.
5. Interpret scores as ranges and state the limits in the report.
:::

:::qa A 7-year-old in Class 2 is referred for "low IQ" because she cannot read. Outline your assessment and possible explanations. [advanced]
### Possible explanations
| Explanation | Clues |
|---|---|
| Specific learning disorder (reading) | Average non-verbal reasoning; weak phonological and successive processing |
| Intellectual disability | Global delay in reasoning and adaptive skills; delayed milestones |
| Hearing or vision problem | Missed sounds, squinting, poor speech |
| Language of instruction | Taught in a language not spoken at home |
| Poor or interrupted schooling | Irregular attendance, frequent school changes |
| ADHD or emotional difficulties | Inattention, anxiety, problems at home |

### Assessment
1. History: milestones, schooling, languages, family history.
2. Hearing and vision screening.
3. Intellectual assessment with Indian norms, including non-verbal measures.
4. Reading, phonological awareness and, where available, PASS processes.
5. Adaptive behaviour (for example the Vineland Social Maturity Scale).
6. Observation in class and teacher reports.

### Outcome
A diagnosis is made only when the pattern fits; many children labelled "low IQ" have specific, treatable reading difficulties.
:::

:::qa Discuss the major theories of creativity and evaluate them. [advanced]
| Theory | Key idea | Strength | Limitation |
|---|---|---|---|
| Wallas's stages | Preparation, incubation, illumination, verification | Matches creators' accounts; incubation effect supported | Stages overlap and repeat in practice |
| Guilford's divergent thinking | Creativity as divergent production | Measurable; led to tests | Divergent thinking alone does not equal creative achievement |
| Mednick's associative theory | Remote associations; flat associative hierarchies | Testable with the Remote Associates Test | The test overlaps with verbal ability and insight |
| Amabile's componential model | Skills, creative processes, intrinsic motivation | Explains effects of rewards and environment | Interactions between components unclear |
| Investment theory | Buy low, sell high; six resources | Combines person and environment | Hard to test as a whole |
| Systems model | Individual, domain, field | Shows creativity is socially judged | Less about the creative process itself |
| Four C model | Mini-c to Big-C | Values everyday creativity | Descriptive rather than explanatory |

### Conclusion
Creativity is best understood as an interaction of cognitive processes, personality, motivation, knowledge and social context, which no single theory covers fully.
:::

## 5.4 Long answers and short notes [core]
:::example Q1. Critically discuss the major theories of intelligence from Spearman to the PASS model. (15 marks)
1. Define intelligence; the role of factor analysis.
2. Spearman's g and s; the positive manifold.
3. Thurstone's primary mental abilities; second-order g.
4. Guilford's structure of intellect (draw the cube; 120 to 180).
5. Vernon's hierarchy; Cattell-Horn Gf-Gc with age trends; Carroll's three strata and CHC.
6. Gardner's eight intelligences with criteria; Sternberg's triarchic theory and successful intelligence.
7. PASS: Luria's three functional units mapped to planning, attention, simultaneous and successive processing; CAS; applications to learning disability (PREP).
8. Comparison table; critique; Indian perspectives on buddhi; conclusion on the hierarchical consensus.
:::

:::example Q2. What are heuristics? Explain the major heuristics and biases in judgment and decision making, with examples. (15 marks)
1. Normative versus descriptive models; Simon's bounded rationality and satisficing.
2. Representativeness (Linda, base-rate neglect, gambler's fallacy); availability; anchoring (wheel of fortune).
3. Framing and prospect theory (Asian disease problem; loss aversion; diminishing sensitivity; probability weighting).
4. Other biases: sunk cost, overconfidence, hindsight, confirmation.
5. Dual-process accounts; Gigerenzer's ecological rationality.
6. Applications: clinical diagnosis (anchoring, diagnostic overshadowing), finance, health choices; debiasing.
:::

:::example Q3. Discuss the relationship between language and thought with reference to Whorf, Piaget, Vygotsky and Chomsky. (15 marks)
Strong and weak linguistic relativity; colour research (Berlin and Kay, Dani, Berinmo, Russian blues); space and kinship (Kuuk Thaayorre, Indian kinship terms); Piaget's egocentric speech; Vygotsky's separate roots, private and inner speech; Chomsky's modular view; evaluation and conclusion.
:::

:::example Q4. What is creativity? Describe its stages, measurement and its relation with intelligence. (10 marks)
Definition (novel and useful); Wallas's stages; Guilford's divergent thinking and the four scores; Torrance tests; Indian tests (Baqer Mehdi, Passi); theories (Mednick, Amabile, Sternberg and Lubart, Csikszentmihalyi, the four Cs); Getzels and Jackson; Wallach and Kogan; threshold hypothesis.
:::

### Short notes (5 marks each)
Prototype theory · Basic level categories · Wason selection task · Mental models · Means-ends analysis · Functional fixedness · Einstellung · Representativeness heuristic · Prospect theory · Satisficing · Metacognition · Linguistic relativity · Language acquisition device · Private speech · Critical period for language · Primary mental abilities · Structure of intellect · Fluid and crystallised intelligence · Triarchic theory · PASS model · Emotional intelligence · Flynn effect · Heritability · Threshold hypothesis · Torrance tests.

:::word Short note: PASS model of intelligence
J. P. Das, Jack Naglieri and John Kirby proposed, and Das, Kar and Parrila developed, a model built on Luria's three functional units of the brain. The first unit (brainstem, reticular system) supports attention-arousal; the second (occipital, parietal and temporal regions) supports simultaneous processing (integrating information into wholes) and successive processing (handling serial order); the third (frontal lobes) supports planning (strategy selection, monitoring and self-regulation). The Cognitive Assessment System measures all four. Applications include identifying the cognitive profile behind learning difficulties (for example, weak successive processing in many children with reading disability) and remediation through the PASS Reading Enhancement Programme. Strengths: a neuropsychological basis and smaller group differences than traditional IQ. Limitations: fewer independent replications and overlap with working-memory and executive-function measures.
:::

:::word Short note: prospect theory
Kahneman and Tversky's descriptive theory of decision under risk. Outcomes are evaluated as gains or losses from a reference point rather than as final wealth. The value function is concave for gains (risk aversion) and convex for losses (risk seeking), and steeper for losses: losses weigh about twice as much as equal gains (loss aversion). Decision weights overweight small probabilities and underweight moderate to large ones, explaining why people buy both lottery tickets and insurance. It explains framing effects such as the Asian disease problem, the endowment effect and the disposition to hold losing investments.
:::

:::word Short note: Flynn effect
The rise in average IQ test scores of about 3 points per decade across the twentieth century in many countries, largest on fluid tests such as Raven's matrices. It is too fast to be genetic. Proposed causes are better nutrition and health, more schooling, smaller families, a more cognitively demanding environment and familiarity with abstract classification. Since the 1990s some countries, such as Norway, show stagnation or reversal, found within families and so environmental. Implications: tests need re-norming, outdated norms inflate scores (important in disability and legal decisions), and intelligence is strongly shaped by environment.
:::

## 5.5 Viva rapid-fire [core]
:::viva
Two systems of thinking, popularised by whom? :: Daniel Kahneman.
Who proposed prototype theory? :: Eleanor Rosch.
Wittgenstein's idea against defining features? :: Family resemblance.
Bruner, Goodnow and Austin's safest strategy? :: Conservative focusing.
Correct cards in the abstract Wason task (E, K, 4, 7)? :: E and 7.
Who proposed mental models? :: Philip Johnson-Laird.
Which task revealed confirmation bias in rule discovery? :: Wason's 2-4-6 task.
Five members of Nyaya inference? :: Pratijna, hetu, udaharana, upanaya, nigamana.
Who described productive thinking? :: Max Wertheimer.
Candle problem? :: Karl Duncker, functional fixedness.
Two-string problem? :: Norman Maier.
Water jar problem? :: Abraham Luchins, Einstellung.
General Problem Solver? :: Newell and Simon.
Minimum moves for a three-disc Tower of Hanoi? :: Seven.
Fortress and radiation analogy study? :: Gick and Holyoak.
Who coined satisficing? :: Herbert Simon.
Three heuristics of Tversky and Kahneman? :: Representativeness, availability, anchoring.
Linda problem shows which fallacy? :: The conjunction fallacy.
Loss aversion ratio? :: Losses weigh about twice as much as gains.
Who championed fast and frugal heuristics? :: Gerd Gigerenzer.
Who coined metacognition? :: John Flavell.
Strong form of Sapir-Whorf? :: Linguistic determinism.
Dani colour study? :: Eleanor Rosch Heider.
Basic colour terms study? :: Berlin and Kay.
Private speech becomes what? :: Inner speech (Vygotsky).
LAD and universal grammar? :: Noam Chomsky.
Mands and tacts? :: B. F. Skinner.
Critical period for language? :: Eric Lenneberg.
LASS? :: Jerome Bruner's language acquisition support system.
First practical intelligence test? :: Binet and Simon, 1905.
Who coined IQ? :: William Stern.
Positive manifold explained by? :: Spearman's g.
Number of Thurstone's primary abilities? :: Seven.
Guilford's three dimensions? :: Operations, contents, products.
v:ed and k:m? :: Vernon.
Gf peaks when? :: Early adulthood.
Carroll's model? :: Three-stratum theory.
Gardner's eighth intelligence? :: Naturalistic.
Sternberg's three intelligences? :: Analytical, creative, practical.
PASS stands for? :: Planning, attention, simultaneous, successive.
PASS based on whose model? :: A. R. Luria's three functional units.
Test of PASS processes? :: Cognitive Assessment System.
Four-branch EI model? :: Mayer and Salovey.
Indian adaptation of the WISC? :: MISIC (Malin).
Bhatia Battery subtests? :: Koh's block design, pass-along, pattern drawing, immediate memory, picture construction.
DSM-5-TR basis for ID severity? :: Adaptive functioning.
Renzulli's three rings? :: Ability, creativity, task commitment.
Wallas's four stages? :: Preparation, incubation, illumination, verification.
Four divergent thinking scores? :: Fluency, flexibility, originality, elaboration.
Remote Associates Test? :: Sarnoff Mednick.
Intrinsic motivation principle? :: Teresa Amabile.
Investment theory of creativity? :: Sternberg and Lubart.
Indian tests of creativity? :: Baqer Mehdi's and B. K. Passi's tests.
Threshold IQ for creativity? :: About 120.
Rate of the Flynn effect? :: About 3 IQ points per decade.
Three MHCA 2017 capacity abilities? :: Understand, appreciate, communicate.
:::

## 5.6 Module test [core]
Answer every question before checking. Your best score is saved.

:::mcq
Q: The bat-and-ball problem is used to measure:
- Divergent thinking and originality
- *Cognitive reflection
- Crystallised intelligence and vocabulary
- Successive processing of number
> It is part of the Cognitive Reflection Test.

Q: A "game" has no single feature shared by all games. This argues against which view of concepts?
- The prototype view
- The exemplar view
- *The classical view
- The theory-based view
> Family resemblance undermines necessary and sufficient features.

Q: Which strategy in concept attainment changes only one attribute at a time from a positive instance?
- Simultaneous scanning
- Successive scanning
- Focus gambling
- *Conservative focusing
> One change at a time is conservative focusing.

Q: "If it is a mango, it is a fruit. This is not a fruit. Therefore it is not a mango." This is:
- Affirming the consequent
- Denying the antecedent
- Belief bias
- *Modus tollens
> If P then Q; not Q; therefore not P.

Q: The drinking-age version of the Wason task is solved far more often than the abstract version. Cosmides explained this by:
- Johnson-Laird's mental models
- Cheng and Holyoak's pragmatic schemas
- *An evolved cheater-detection mechanism
- Belief bias in favour of social rules
> She proposed a specialised module for detecting social contract violations.

Q: Match: (a) Duncker, (b) Luchins, (c) Maier, (d) Wertheimer. (i) Productive thinking; (ii) Two-string problem; (iii) Water jars; (iv) Candle problem.
- a-iii, b-iv, c-ii, d-i
- *a-iv, b-iii, c-ii, d-i
- a-iv, b-ii, c-iii, d-i
- a-i, b-iii, c-ii, d-iv
> Candle, jars, strings, productive thinking.

Q: Means-ends analysis is best described as:
- *Cutting the gap to the goal through sub-goals
- Trying every possible move in a fixed order
- Waiting for a sudden insight after incubation
- Starting from the goal and working backwards
> Newell and Simon's key heuristic.

Q: Chess masters recall real game positions much better than novices but random positions no better. This shows that expertise depends on:
- A better general memory for any material
- Faster processing speed on every task
- *Stored, meaningful chunks
- Higher fluid intelligence than novices
> Chunks help only when the material is meaningful.

Q: Statement I: The availability heuristic judges probability by ease of recall. Statement II: It leads people to overestimate dramatic, well-reported causes of death.
- *Both statements are correct
- Only Statement II is correct
- Only Statement I is correct
- Neither statement is correct
> Vivid examples are easier to recall and inflate estimates.

Q: Programme A "saves 200 of 600" is preferred, but Programme C "400 of 600 die" is rejected, although they are identical. This is:
- Anchoring
- The endowment effect
- The sunk cost fallacy
- *A framing effect
> The description, not the outcome, changed the choice.

Q: Continuing a failing business because "we've already invested ₹20 lakh" is:
- Satisficing
- *The sunk cost fallacy
- Loss aversion only
- Hindsight bias
> Past, unrecoverable costs should not drive future decisions.

Q: Nelson and Narens' model of metacognition has two main processes between the meta and object levels:
- Encoding and retrieval
- Planning and evaluation
- *Monitoring and control
- Fluency and accuracy
> The meta level monitors and controls the object level.

Q: Assertion (A): Rosch Heider's Dani study counts against strong linguistic determinism. Reason (R): Dani speakers, with two colour terms, still remembered focal colours better than non-focal colours.
- A is true, R is false
- *Both are true, and R explains A
- Both are true, but R does not explain A
- A is false, R is true
> Memory followed perceptual focal colours, not vocabulary.

Q: According to Vygotsky, thought and language:
- Are identical from the moment of birth
- Are both innate, separate brain modules
- Develop only through reinforcement
- *Have separate roots and merge around age 2
> Separate roots, then merging into verbal thought.

Q: Skinner's term for a verbal response reinforced by obtaining what is asked for is a:
- *Mand
- Echoic
- Tact
- Autoclitic
> Mands are requests.

Q: Which finding supports a sensitive period for language?
- Bilinguals have smaller vocabularies in each language
- Infants babble at about six months in every culture
- *Immigrants' grammar proficiency declines with later age of arrival
- Children overregularise past tenses
> Johnson and Newport's age-of-arrival effect.

Q: Thurstone's primary mental abilities include all EXCEPT:
- *Musical ability
- Perceptual speed
- Word fluency
- Associative memory
> Musical intelligence is Gardner's, not Thurstone's.

Q: Guilford's final structure-of-intellect model contains how many abilities?
- 120
- *180
- 150
- 7
> Six operations, five contents, six products.

Q: Which ability typically declines most with age in adulthood?
- Vocabulary
- General information
- Crystallised knowledge
- *Fluid reasoning
> Gf peaks early and declines; Gc holds.

Q: Carroll's three-stratum theory was based on:
- *Reanalysis of hundreds of data sets
- Brain-lesion studies of adults after stroke
- A single large sample of Indian schoolchildren
- Gardner's criteria for an intelligence
> More than 460 data sets.

Q: Which is NOT one of Gardner's criteria for an intelligence?
- Isolation by brain damage
- Existence of savants and prodigies
- *A high correlation with g
- A distinctive developmental history
> Gardner explicitly sought independence from g.

Q: Sternberg's contextual subtheory concerns:
- Metacomponents and performance components
- *Adapting to, shaping and selecting environments
- Dealing with novelty and automatisation
- Simultaneous and successive processing
> Practical intelligence.

Q: In PASS theory, Luria's first functional unit supports:
- Planning
- Simultaneous processing
- Successive processing
- *Attention-arousal
> The brainstem and reticular system regulate arousal and attention.

Q: Ability-based emotional intelligence is measured by:
- *The MSCEIT
- The TTCT
- The CAS
- Raven's matrices
> Mayer-Salovey-Caruso Emotional Intelligence Test.

Q: The ICD-10 IQ band for moderate intellectual disability is:
- 50 to 69
- 70 to 84
- 20 to 34
- *35 to 49
> Mild 50 to 69; moderate 35 to 49.

Q: In Wallas's model, the stage in which the problem is set aside is:
- Preparation
- Illumination
- *Incubation
- Verification
> Incubation follows preparation.

Q: Arrange chronologically: (1) Gardner's multiple intelligences, (2) Spearman's g, (3) Thurstone's primary abilities, (4) Guilford's structure of intellect.
- 2, 4, 3, 1
- *2, 3, 4, 1
- 3, 2, 4, 1
- 2, 3, 1, 4
> 1904, 1938, 1955, 1983.

Q: Heritability of IQ is best described as:
- The share of one person's IQ caused by genes
- The cause of average differences between groups
- A fixed value across all populations and ages
- *The share of population IQ variation linked to genes
> It is a population statistic that changes with context.

Q: Which explanation of the Flynn effect is ruled out by its speed?
- Better nutrition and health care
- *Genetic change in the population
- More years of schooling for children
- Familiarity with tests and test formats
> Gene frequencies cannot change that fast.

Q: People with delusions often decide which jar beads come from after only one or two beads. This is:
- Belief bias
- The availability heuristic
- *The jumping-to-conclusions bias
- Functional fixedness
> A hasty data-gathering style linked to delusions.
:::
`;
