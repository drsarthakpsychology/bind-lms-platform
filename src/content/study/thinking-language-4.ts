/* Module · Thinking, language, intelligence and creativity, Part IV (Advanced) and the exam zone. Original text written for VIBHA School of Psychology. */
export const part4 = String.raw`
# Part IV · Advanced: nature, culture and the clinic

## 4.1 Heredity, environment and the Flynn effect [core][advanced]
### What heritability means, and what it does not
**Heritability** is the proportion of the **variation** in a trait, **within a particular population at a particular time**, that is associated with genetic variation. Three points are tested again and again:
1. It describes **differences between people**, not how much of one person's intelligence is "from genes".
2. It is **specific to a population and its environments**. If every child had identical schooling and nutrition, the heritability of school marks would rise, because only genetic differences would be left.
3. High heritability **within** groups says **nothing** about the causes of average differences **between** groups. Richard Lewontin's analogy: take a handful of genetically varied seeds and plant half in rich soil and half in poor soil. Within each tray, height differences are largely genetic; the difference between the trays is entirely environmental.

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

### Two more theories worth knowing
- **Mike Anderson's theory of the minimal cognitive architecture** (1992) tries to explain both individual differences and development. A **basic processing mechanism**, varying in **speed** between people but not changing much with age, limits two **specific processors** (verbal-propositional and visual-spatial thinking). Separately, **modules** (for example, for perceiving three dimensions, theory of mind, language) mature with age and work regardless of the basic mechanism. This explains why a person with intellectual disability can have normal theory of mind or language, and why savants exist.
- **Stephen Ceci's bioecological theory** (1990) argues that intelligence is **multiple cognitive potentials** shaped by **context** (motivation, social setting, physical setting) and **knowledge**. Ceci found that expert racetrack handicappers in the United States used remarkably complex reasoning to predict odds, and their skill was **unrelated to their IQ**. He also showed how strongly schooling raises IQ.

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
### Reasoning biases in psychosis
- **Jumping to conclusions**: in the **beads task**, people see beads drawn one by one from one of two jars (for example, 85 black and 15 white, or the reverse) and decide which jar they come from. People with delusions often decide after only **one or two beads**, much sooner than controls, with high confidence. About half of people with delusions show this "hasty decision" style.
- **Bias against disconfirmatory evidence**: once a belief is formed, contrary evidence is discounted.
- **Theory of mind** difficulties and an **externalising attributional style** (blaming others for bad events) contribute to persecutory delusions.
These findings led to **metacognitive training** and to CBT for psychosis, which help patients slow down, consider alternatives and test beliefs.

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

**Worry** in generalised anxiety disorder is a verbal, abstract chain of "what if" thinking; it reduces vivid imagery and physical arousal in the short term and is maintained by **intolerance of uncertainty** and beliefs about worry (as in Wells' metacognitive model). **Rumination** in depression is a repetitive, abstract, evaluative style ("why am I like this?") that prolongs low mood; training a more **concrete** style ("what exactly happened, and what could I do next?") helps.

### Disorders of thought form and language
In the mental status examination, **formal thought disorder** describes disorganised connections between ideas, seen in speech. Nancy Andreasen's scale for thought, language and communication describes signs such as:
- **Poverty of speech** and **poverty of content**.
- **Tangentiality** (replies that go off at a tangent and never return) and **circumstantiality** (taking a long, detailed route but reaching the point).
- **Derailment** (loosening of associations), **incoherence** (word salad), **illogicality**, **clanging** (words linked by sound), **neologisms** (new words) and **perseveration**.
**Concrete thinking** (difficulty with abstraction) was traditionally tested with **proverbs** ("What does 'a rolling stone gathers no moss' mean?") and **similarities**. But in India, many people with little schooling, or who never use English proverbs, give concrete answers without any illness, so proverb tests must be used with great caution, in the person's language and with familiar proverbs ("Jaisi karni, waisi bharni"), or not at all.

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

## 5.1 Long answers and short notes [core]
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

## 5.2 Viva rapid-fire [core]
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

## 5.3 Module test [core]
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
