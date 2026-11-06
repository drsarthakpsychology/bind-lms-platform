/* Module · Thinking, language, intelligence and creativity, Part III (Beginner level: intelligence and creativity). Original text written for VIBHA School of Psychology. */
export const part3 = String.raw`
# Part III · Beginner: intelligence and creativity

## 3.1 From one g to a hierarchy: the factor theories [core][beginner]
Most intelligence theories before the 1980s came from **factor analysis**: a statistical method that looks at how scores on many tests correlate, and finds a small number of underlying **factors** that explain the pattern.

### Spearman: g and s (1904)
Charles Spearman noticed that children who did well on one kind of test tended to do well on others: all mental tests correlate positively (the **positive manifold**). He proposed a **two-factor theory**:
- **g** (general intelligence): a single ability shared by every test, which he likened to "mental energy".
- **s** (specific factors): abilities unique to each test.
Tests that are good measures of g ("highly g-loaded") involve **eduction of relations and correlates**: seeing relationships and applying them, as in Raven's Progressive Matrices.

### Thorndike: a multifactor view
E. L. Thorndike argued against a single g, describing **abstract**, **mechanical** and **social** intelligence (1920s), an early forerunner of later "multiple intelligences" ideas.

### Thurstone: primary mental abilities (1938)
Louis Thurstone tested University of Chicago students on 56 tests and, using a different factor-analytic method, found about seven **primary mental abilities** rather than one g:
| Ability | Example task |
|---|---|
| **Verbal comprehension** | Vocabulary, reading |
| **Word fluency** | Listing words beginning with "s" in a minute |
| **Number** | Arithmetic speed and accuracy |
| **Space** | Mentally rotating figures |
| **Associative memory** | Remembering paired words |
| **Perceptual speed** | Spotting small differences quickly |
| **Inductive reasoning** | Finding the rule in a series |
Later, when he tested more varied samples, the primary abilities correlated with one another, and Thurstone accepted a **second-order g**. The g-versus-many debate turned into a question of **levels**.

:::mnemonic Thurstone's seven: "Very Wise Nerds Sit And Play Riddles"
**V**erbal comprehension, **W**ord fluency, **N**umber, **S**pace, **A**ssociative memory, **P**erceptual speed, **R**easoning.
:::

### Guilford: the structure of intellect (1955, 1967)
J. P. Guilford rejected g entirely. He proposed that every intellectual ability is a combination of three dimensions, like a cube:
- **Operations** (what you do): cognition, memory, divergent production, convergent production, evaluation.
- **Contents** (what you think about): figural, symbolic, semantic, behavioural.
- **Products** (the form of the result): units, classes, relations, systems, transformations, implications.
Five operations × four contents × six products = **120 abilities**. Later he split figural content into visual and auditory (150 abilities), then split memory into recording and retention (**180 abilities**, 1988). His lasting contribution was **divergent production**, the basis of creativity testing. Critics note that his own data showed the "independent" abilities correlate, and that many cells were never measured.

:::widget worked
{
  "title": "Placing a task in Guilford's cube",
  "steps": [
    { "q": "Task: 'List as many uses as you can for a newspaper.' What is the operation?", "a": "Divergent production: generating many answers." },
    { "q": "What is the content?", "a": "Semantic: meanings and ideas expressed in words." },
    { "q": "What is the product?", "a": "Units (each separate use) or, if scored for categories of use, classes. Guilford classified 'unusual uses' as divergent production of semantic units, or of semantic classes when flexibility is scored." }
  ],
  "yourTurn": [
    { "q": "Task: 'Which number comes next: 3, 6, 12, 24, ...?' Name the operation, content and product.", "a": "Convergent production (one correct answer), symbolic content (numbers), and a relation or system (the doubling rule). Many textbooks call this 'convergent production of symbolic relations'." }
  ]
}
:::

### Vernon's hierarchical model (1950)
Philip Vernon arranged abilities in levels: **g** at the top; two **major group factors**, **v:ed** (verbal-educational) and **k:m** (practical-mechanical-spatial); then **minor group factors**; then **specific factors**. This reconciled Spearman and Thurstone.

### Cattell and Horn: fluid and crystallised intelligence
Raymond Cattell (1941, 1963) split g into two:
- **Fluid intelligence (Gf)**: reasoning about novel problems, independent of learned knowledge (matrices, series, analogies with unfamiliar material). It rises through childhood, **peaks in early adulthood** and declines gradually after.
- **Crystallised intelligence (Gc)**: knowledge and skills acquired through education and culture (vocabulary, general information). It **keeps rising or holds steady well into later life**.
In Cattell's **investment theory**, fluid ability is "invested" in learning to build crystallised ability. **John Horn** extended the model to about nine broad abilities, including visual processing, auditory processing, short-term memory, long-term retrieval and processing speed.

:::widget sort
{
  "prompt": "Fluid (Gf) or crystallised (Gc)?",
  "buckets": ["Fluid", "Crystallised"],
  "items": [
    { "text": "Solving a matrix puzzle with abstract shapes", "bucket": 0 },
    { "text": "Knowing the meaning of 'ephemeral'", "bucket": 1 },
    { "text": "Working out the rule in a new card game", "bucket": 0 },
    { "text": "Knowing who wrote the Indian Constitution's first draft", "bucket": 1 },
    { "text": "A retired judge's skill in interpreting a complex law", "bucket": 1, "why": "Expert knowledge built over decades is crystallised, and often grows with age." },
    { "text": "Spotting the pattern in a series of unfamiliar symbols", "bucket": 0 }
  ]
}
:::

### Carroll's three-stratum theory (1993) and CHC
John Carroll reanalysed more than 460 data sets collected over 60 years and found a **three-stratum** structure:
- **Stratum III**: g.
- **Stratum II**: about eight **broad abilities** (fluid intelligence, crystallised intelligence, general memory and learning, broad visual perception, broad auditory perception, broad retrieval ability, broad cognitive speediness, and decision or reaction speed).
- **Stratum I**: about 70 **narrow abilities**.
Kevin McGrew merged Cattell-Horn and Carroll into the **Cattell-Horn-Carroll (CHC) theory**, now the most widely used framework for building and interpreting tests (Woodcock-Johnson, Stanford-Binet 5, Kaufman tests, and the index structure of the Wechsler scales).

:::recall
1. What is the positive manifold, and how did Spearman explain it? || All mental tests correlate positively; a general factor g common to all.
2. List Thurstone's seven primary mental abilities. || Verbal comprehension, word fluency, number, space, associative memory, perceptual speed, inductive reasoning.
3. What are Guilford's three dimensions, and how many abilities in the final model? || Operations, contents, products; 180.
4. Contrast fluid and crystallised intelligence, including age trends. || Fluid: novel reasoning, peaks in early adulthood and declines. Crystallised: acquired knowledge, rises or holds into later life.
5. Name the three strata in Carroll's model. || g; about eight broad abilities; about 70 narrow abilities.
:::

:::mcq
Q: Which theorist proposed v:ed and k:m as major group factors?
- *Vernon
- Thurstone
- Spearman
- Carroll
> Vernon's hierarchical model (1950).

Q: In Guilford's model, generating many different solutions to an open problem is classified as which operation?
- Cognition
- Convergent production
- Evaluation
- *Divergent production
> Producing many answers is divergent production.
:::

## 3.2 Beyond factors: Gardner, Sternberg, PASS and emotional intelligence [core][beginner]
From the 1980s, new theories drew on neuropsychology, development and culture, not only on factor analysis.

### Gardner's multiple intelligences (1983)
Howard Gardner (*Frames of Mind*) proposed separate **intelligences**, each meeting criteria such as: it can be **isolated by brain damage**; it shows in **savants and prodigies**; it has a distinct **developmental history** and **core operations**; it has an **evolutionary history**; and it can be encoded in a **symbol system**.
| Intelligence | Example |
|---|---|
| **Linguistic** | A poet, a lawyer arguing in court |
| **Logical-mathematical** | Srinivasa Ramanujan, a software engineer |
| **Spatial** | An architect, a chess player, a kolam artist |
| **Musical** | A Carnatic vocalist |
| **Bodily-kinaesthetic** | A Kathak dancer, a surgeon, a cricketer |
| **Interpersonal** | A counsellor, a politician |
| **Intrapersonal** | Knowing one's own feelings and motives deeply |
| **Naturalistic** (added 1999) | A farmer who reads soil and weather, a botanist |
He has discussed **existential** intelligence (big questions of life and death) as a possible "half" intelligence.

**Evaluation**: hugely popular in schools, and it widens what counts as talent. But most "intelligences" correlate with g when measured (Visser and colleagues, 2006), Gardner offered no standard tests, and some are arguably **talents** rather than intelligences. Its spin-off, teaching to "learning styles", has no supporting evidence.

### Sternberg's triarchic theory (1985) and successful intelligence
Robert Sternberg proposed three aspects:
1. **Analytical (componential)**: the mental components used to process information: **metacomponents** (planning, monitoring, evaluating), **performance components** (carrying out the steps) and **knowledge-acquisition components** (learning new information). Closest to what IQ tests measure.
2. **Creative (experiential)**: dealing with **novelty** and **automatising** familiar tasks.
3. **Practical (contextual)**: **adapting** to the environment, **shaping** it, or **selecting** a new one. It includes **tacit knowledge**, the know-how that is rarely taught.
He later framed **successful intelligence** as the ability to achieve your goals in life, within your sociocultural context, by balancing the three.

:::widget reveal
{
  "prompt": "Sternberg and colleagues (2001) tested rural Luo children in Kenya on their knowledge of the natural herbal medicines used in their villages, and on conventional school-based tests of vocabulary. Predict the correlation between the two.",
  "answer": "It was negative: children with more practical herbal knowledge scored lower on school-type tests. In their community, investing in local practical knowledge, not schooling, was what mattered for adult life. Practical and academic intelligence can diverge, and 'intelligence' partly means adapting to what your setting values. Similarly, Brazilian children selling goods on the street (Carraher and colleagues, 1985) did complex calculations correctly in the market but struggled with the same sums written as school problems."
}
:::

### PASS theory: Das, Naglieri and Kirby; Das, Kar and Parrila
**J. P. Das**, born in Odisha and later a professor at the University of Alberta, built a theory of intelligence on the Russian neuropsychologist **A. R. Luria's** three **functional units** of the brain. The theory was set out by Das, Jack Naglieri and John Kirby (1994) and developed in Das, Kar and Parrila (1996), and it appears by name in the UGC NET syllabus.
| Process | What it does | Luria's unit and brain region |
|---|---|---|
| **Planning** | Deciding how to solve a problem, choosing strategies, monitoring and correcting | Third unit: **frontal lobes** |
| **Attention-arousal** | Staying alert and focusing selectively, resisting distraction | First unit: **brainstem and reticular system** (with frontal links) |
| **Simultaneous processing** | Integrating separate pieces into a **whole** at once: seeing patterns, understanding relationships ("Who is taller: Ram or Shyam?") | Second unit: **occipital-parietal** regions |
| **Successive processing** | Handling information in a **serial order**: sequences, remembering digits, following sounds in a word | Second unit: **fronto-temporal** regions |

The **Cognitive Assessment System** (CAS, Naglieri and Das, 1997; CAS2, 2014) measures the four processes. PASS profiles help explain learning difficulties: many children with reading disability show weak **successive** processing (sounding out words in order), and the **PASS Reading Enhancement Programme (PREP)** trains these processes. PASS claims smaller differences between ethnic groups than traditional IQ tests, because it relies less on acquired knowledge.

:::widget sort
{
  "prompt": "Which PASS process does each task mainly use?",
  "buckets": ["Planning", "Attention", "Simultaneous", "Successive"],
  "items": [
    { "text": "Repeating a string of digits in the same order", "bucket": 3 },
    { "text": "Choosing the best strategy to find all the numbers in a grid quickly", "bucket": 0 },
    { "text": "Crossing out every target shape on a page full of distractors", "bucket": 1 },
    { "text": "Understanding a diagram showing how parts of a machine fit together", "bucket": 2 },
    { "text": "Sounding out the letters of an unfamiliar word in order", "bucket": 3 },
    { "text": "Answering 'The circle is under the square; which is on top?'", "bucket": 2, "why": "Grasping a spatial relationship as a whole is simultaneous processing." }
  ]
}
:::

### Emotional intelligence
- E. L. Thorndike's **social intelligence** (1920) was the forerunner.
- **Peter Salovey and John Mayer** (1990) defined emotional intelligence (EI) as an ability. Their **four-branch model** (1997): **perceiving** emotions, **using** emotions to help thinking, **understanding** emotions, and **managing** emotions. Measured as an ability by the **MSCEIT**, with right and wrong answers.
- **Daniel Goleman's** best-seller *Emotional Intelligence* (1995) popularised a **mixed model** including self-awareness, self-regulation, motivation, empathy and social skills.
- **Trait EI** (K. V. Petrides) treats EI as self-perceived emotional dispositions, measured by questionnaire.
**Evaluation**: ability EI predicts some social and work outcomes beyond IQ and personality, but modestly; mixed and trait models overlap heavily with personality traits (especially emotional stability and agreeableness). Popular claims that "EQ matters more than IQ" are not supported by the evidence.

:::recall
1. Name Gardner's eight intelligences. || Linguistic, logical-mathematical, spatial, musical, bodily-kinaesthetic, interpersonal, intrapersonal, naturalistic.
2. Name Sternberg's three aspects of intelligence. || Analytical (componential), creative (experiential), practical (contextual).
3. What does PASS stand for, and whose model of the brain is it based on? || Planning, Attention, Simultaneous, Successive; Luria's three functional units.
4. Which test measures PASS processes? || The Cognitive Assessment System (CAS), by Naglieri and Das.
5. Name the four branches of the Mayer-Salovey model. || Perceiving, using, understanding and managing emotions.
:::

:::mcq
Q: In PASS theory, remembering a phone number digit by digit in order relies mainly on:
- Planning
- Attention
- *Successive processing
- Simultaneous processing
> Serial order is successive processing.

Q: Sternberg's componential subtheory includes which three kinds of component?
- Fluid, crystallised and visual-spatial
- *Meta, performance and knowledge-acquisition
- Planning, attention and successive coding
- Linguistic, spatial and musical abilities
> These are Sternberg's analytical components.
:::

## 3.3 Measuring intelligence: tests, disability and giftedness [core][beginner]
### The main tests
| Test | Key features |
|---|---|
| **Stanford-Binet** (5th edition, 2003) | Ages 2 to 85-plus; five factors (fluid reasoning, knowledge, quantitative reasoning, visual-spatial processing, working memory), each verbal and non-verbal; mean 100, SD 15 |
| **Wechsler scales** (WAIS-IV for adults, WISC-V for children, WPPSI-IV for young children) | Full-scale IQ plus index scores (verbal comprehension, visual-spatial, fluid reasoning, working memory, processing speed in WISC-V); mean 100, SD 15; subtest scaled scores mean 10, SD 3 |
| **Raven's Progressive Matrices** (Standard, Coloured, Advanced) | Non-verbal, highly g-loaded; less dependent on language; used widely in India |
| **Kaufman Assessment Battery for Children (KABC-II)** | Built on Luria and CHC models; sequential and simultaneous processing |
| **Cognitive Assessment System** | PASS processes |

### Tests developed or adapted in India
- **Bhatia Battery of Performance Tests** (C. M. Bhatia, 1955): Koh's block design, pass-along, pattern drawing, immediate memory and picture construction; designed for Indians with limited schooling.
- **Binet-Kamat test** (V. V. Kamat): an Indian adaptation of the Stanford-Binet in Marathi and Kannada contexts.
- **Malin's Intelligence Scale for Indian Children** (MISIC, 1969): an Indian adaptation of the WISC.
- Indian adaptations of the Wechsler adult scale (for example the PGI's adaptation) and Indian norms for Raven's matrices.
- The **Vineland Social Maturity Scale** (Indian adaptation by A. J. Malin) to measure **adaptive behaviour** alongside IQ.

### Intellectual disability
**DSM-5-TR** requires three things:
1. **Deficits in intellectual functions** (reasoning, problem solving, planning, abstract thinking, judgment, academic and experiential learning), confirmed by clinical assessment **and** individual standardised testing, typically about **two standard deviations below the mean** (an IQ of roughly 65 to 75, allowing for measurement error).
2. **Deficits in adaptive functioning** in **conceptual, social and practical** domains, so that the person needs support at home, school, work or in the community.
3. **Onset during the developmental period**.
Severity (mild, moderate, severe, profound) is set by **adaptive functioning**, not by IQ.

**ICD-11** calls it **disorder of intellectual development**, with mild, moderate, severe and profound levels based on intellectual and adaptive behaviour roughly 2 to 3, 3 to 4, and more than 4 standard deviations below the mean (severe and profound being separated by adaptive behaviour).

Older systems, still used in many Indian certificates and exam questions (ICD-10), used IQ bands:
| Level | IQ band (ICD-10) | Typical adult functioning |
|---|---|---|
| **Mild** | 50 to 69 | Can usually work and live independently with some support; about 85 percent of people with intellectual disability |
| **Moderate** | 35 to 49 | Can learn self-care and simple work with supervision |
| **Severe** | 20 to 34 | Needs extensive support; limited speech |
| **Profound** | below 20 | Needs constant care; often with physical disabilities |

:::widget build
{
  "vignette": "Arjun, 9, from a village near Nashik, is in Class 3 and cannot yet read simple words or add two-digit numbers. On an individually given test with Indian norms his IQ is 62. He dresses and bathes himself, but cannot buy things at the shop or travel alone to school as his younger cousin does. His mother says he was late to walk and talk. He has attended school regularly, speaks Marathi at home and was tested in Marathi.",
  "rule": "Tick what is present for DSM-5-TR intellectual disability. All three criteria are needed: intellectual deficit, adaptive deficit, and onset in the developmental period.",
  "symptoms": [
    { "label": "Intellectual deficit confirmed by standardised testing (about 2 SD below the mean)", "present": true, "core": true, "why": "An IQ of 62 on a properly normed test in his own language." },
    { "label": "Deficits in adaptive functioning (conceptual and practical)", "present": true, "core": true, "why": "Academic skills, money and travel independence lag well behind same-age peers." },
    { "label": "Onset during the developmental period", "present": true, "core": true, "why": "Delayed milestones and current age 9." },
    { "label": "Poor schooling or testing in an unfamiliar language as the explanation", "present": false, "why": "He attended regularly and was tested in his home language, which makes this explanation less likely." },
    { "label": "Severity set mainly by the IQ score", "present": false, "why": "In DSM-5-TR, severity is set by adaptive functioning." }
  ],
  "need": 3,
  "needCore": true,
  "verdict": "All three DSM-5-TR criteria are met, consistent with mild intellectual disability (severity judged by his adaptive functioning). Next: check hearing and vision, screen for causes (genetic, perinatal, iodine deficiency, lead), plan special educational support, and help the family apply for a disability certificate under the RPwD Act 2016 to access benefits."
}
:::

### Giftedness
- **Lewis Terman's** *Genetic Studies of Genius* (from 1921) followed over 1,500 California children with IQs of about 135 and above (later nicknamed "Termites"). As adults they were, on average, healthier, better adjusted and more successful than the general population, which countered the myth of the fragile genius. Yet none won a Nobel Prize, while two children who **narrowly missed** the cut-off did (William Shockley and Luis Alvarez).
- **Joseph Renzulli's three-ring model** (1978): giftedness lies where **above-average ability**, **creativity** and **task commitment** overlap.
- **Françoys Gagné** separates **gifts** (natural abilities) from **talents** (developed skills), with environment, motivation and chance turning one into the other.
- **Twice-exceptional** children are gifted and also have a disability (for example, autism or a specific learning disorder); one can mask the other.

:::recall
1. What are the three DSM-5-TR criteria for intellectual disability? || Intellectual deficits confirmed by testing, adaptive deficits, onset in the developmental period.
2. How is severity determined in DSM-5-TR? || By adaptive functioning, not IQ.
3. Give the ICD-10 IQ bands for mild, moderate, severe and profound. || 50 to 69; 35 to 49; 20 to 34; below 20.
4. Name the five subtests of the Bhatia Battery. || Koh's block design, pass-along, pattern drawing, immediate memory, picture construction.
5. State Renzulli's three-ring model. || Giftedness is the overlap of above-average ability, creativity and task commitment.
:::

:::mcq
Q: Which Indian test is an adaptation of the Wechsler Intelligence Scale for Children?
- Bhatia Battery
- Binet-Kamat test
- Vineland Social Maturity Scale
- *MISIC
> Malin's Intelligence Scale for Indian Children (1969).
:::

## 3.4 Creativity: process, person and product [core][beginner]
### The creative process: Wallas's four stages (1926)
Graham Wallas (*The Art of Thought*), drawing on the mathematician Henri Poincaré's account of discovering a solution as he stepped onto a bus, described:
1. **Preparation**: defining the problem and working hard on it, gathering knowledge.
2. **Incubation**: setting the problem aside; processing continues outside awareness.
3. **Illumination**: the sudden "aha" (Wallas noted a brief **intimation** that it is coming).
4. **Verification**: checking, testing and refining the idea.

:::example Ramanujan and illumination
Srinivasa Ramanujan said that formulae came to him in dreams, given by the goddess Namagiri of Namakkal. Psychologists read such accounts as illumination after years of intense **preparation**: he had filled notebooks with calculations since his teens. The stages describe an experience; they do not mean ideas arrive without work.
:::

### Measuring creativity
- **Guilford's divergent thinking** tests (1950s), such as **Unusual Uses** ("How many uses for a brick?"), scored for:
  - **Fluency**: the number of ideas.
  - **Flexibility**: the number of different categories of idea.
  - **Originality**: how statistically rare the ideas are.
  - **Elaboration**: the amount of detail.
- **The Torrance Tests of Creative Thinking** (TTCT, E. Paul Torrance, 1966): verbal and figural forms (for example, completing incomplete figures and making pictures from circles), scored for fluency, flexibility, originality and elaboration, and in later editions **abstractness of titles** and **resistance to premature closure**. Torrance's long follow-ups found that childhood TTCT scores predicted adult creative achievement.
- **Mednick's Remote Associates Test** (1962): find the word linking three others (cottage, Swiss, cake: **cheese**).
- **The consensual assessment technique** (Teresa Amabile): experts independently rate the creativity of real products (poems, collages); their agreement is high.
- **Indian tests**: **Baqer Mehdi's** Verbal and Non-verbal Tests of Creative Thinking (1973) and **B. K. Passi's** Tests of Creativity are widely used in Indian educational research.

:::widget worked
{
  "title": "Scoring a divergent thinking response",
  "steps": [
    { "q": "Asked for uses of a newspaper, Rohan writes: read news, wrap fish, wrap vegetables, wrap gifts, make a paper boat, swat a fly. What is his fluency score?", "a": "6: the number of relevant ideas." },
    { "q": "What is his flexibility score, if categories are: reading, wrapping, craft, and hitting?", "a": "4 categories: reading (1), wrapping (3), craft (1), hitting (1)." },
    { "q": "Which ideas are likely to score for originality, and why?", "a": "Originality depends on how rare a response is in the norm group. 'Read news' and 'wrap things' are common and score zero; 'paper boat' and 'swat a fly' are moderately common; a truly rare idea (for example 'shred it as bedding for a pet rabbit') would score highest." }
  ],
  "yourTurn": [
    { "q": "Priya lists ten ways to use a brick, all of them building something (a wall, a step, a bench, a barbecue, and so on). Comment on her fluency and flexibility.", "a": "High fluency (10) but low flexibility (one category: building). She generates many ideas but stays within one frame: a sign of mental set in creative thinking." }
  ]
}
:::

### Theories of creativity
| Theory | Key idea |
|---|---|
| **Associative theory** (Sarnoff Mednick, 1962) | Creativity is making **remote associations**. Creative people have a **flat associative hierarchy**: many weaker associations instead of a few strong ones |
| **Componential model** (Teresa Amabile, 1983) | Creativity needs **domain-relevant skills**, **creativity-relevant processes** (flexible thinking, tolerance of ambiguity) and **intrinsic task motivation**. The **intrinsic motivation principle**: people are most creative when motivated by interest and enjoyment, and extrinsic pressure can reduce creativity |
| **Investment theory** (Robert Sternberg and Todd Lubart, 1991) | Creative people **"buy low and sell high"**: they pursue unpopular ideas with potential, then move on once the ideas are accepted. Six resources: intellectual abilities, knowledge, thinking styles, personality, motivation, environment |
| **Systems model** (Mihaly Csikszentmihalyi, 1988) | Creativity arises from the interaction of the **individual**, the **domain** (the body of knowledge and rules) and the **field** (the gatekeepers who decide what counts as creative) |
| **Four C model** (James Kaufman and Ronald Beghetto, 2009) | **Mini-c** (personal insight while learning), **little-c** (everyday creativity), **Pro-c** (professional creativity) and **Big-C** (eminent, field-changing creativity) |

:::widget reveal
{
  "prompt": "Amabile (1985) asked creative-writing students to write a short poem, then to rank reasons for writing. One group ranked extrinsic reasons (getting published, impressing teachers); another ranked intrinsic ones (enjoying words, expressing feelings). Then they wrote a second poem. Predict what experts thought of the second poems.",
  "answer": "The extrinsic group's second poems were rated as less creative than their first, while the intrinsic group's stayed the same. Simply thinking about external rewards for a few minutes lowered creativity. This supports the intrinsic motivation principle, though later work shows that rewards that inform and support autonomy can help."
}
:::

:::recall
1. Name Wallas's four stages. || Preparation, incubation, illumination, verification.
2. Name the four classic scores in divergent thinking tests. || Fluency, flexibility, originality, elaboration.
3. What does Mednick's Remote Associates Test measure? || The ability to find a word linking three remote words (associative creativity).
4. State Amabile's intrinsic motivation principle. || People are most creative when driven by interest and enjoyment rather than external pressure.
5. Name Csikszentmihalyi's three elements. || Individual, domain, field.
:::

:::mcq
Q: In divergent thinking scoring, the number of different categories of response is called:
- Fluency
- *Flexibility
- Originality
- Elaboration
> Shifting between kinds of idea is flexibility.

Q: The idea that creative people pursue undervalued ideas and abandon them once they become popular comes from:
- Mednick's associative theory of creativity
- Amabile's componential model of creativity
- *Sternberg and Lubart's investment theory
- Wallas's four-stage model of creative thought
> "Buy low, sell high."
:::

## 3.5 Level check · Beginner [core][beginner]
Score 80 percent or more to open the Advanced level.

:::mcq
Q: The basic level of categorisation is the level that:
- *Is named first and is the most informative
- Is the level children learn last of all
- Is the most abstract and inclusive level
- Is the level that contains only one member
> Rosch's basic level (chair, mango) is privileged.

Q: Which argument form is valid?
- Affirming the consequent
- Denying the antecedent
- Belief bias
- *Modus tollens
> If P then Q; not Q; therefore not P.

Q: In the Wason selection task (E, K, 4, 7), most people fail to choose:
- *7
- K
- 4
- E
> Turning 7 could falsify the rule, but few choose it.

Q: Herbert Simon's term for choosing an option that is good enough is:
- Optimising
- Anchoring
- *Satisficing
- Framing
> Bounded rationality leads to satisficing.

Q: Judging that Linda is more likely to be a feminist bank teller than a bank teller shows:
- Anchoring on her age and job
- *The conjunction fallacy
- Availability of bank tellers in memory
- Loss aversion about her career
> A conjunction cannot be more probable than its parts.

Q: The finding that losses weigh more heavily than equal gains is part of:
- Expected utility theory
- The recognition heuristic
- *Prospect theory
- Mental models theory
> Loss aversion is central to prospect theory.

Q: According to Flavell, "I know I remember better when I write things down" is metacognitive knowledge about:
- Tasks
- *Persons
- Strategies
- Planning
> Knowledge about oneself as a learner is person knowledge.

Q: Which researcher studied private speech as a tool for self-regulation?
- Piaget
- Chomsky
- Skinner
- *Vygotsky
> Private speech becomes inner speech.

Q: Which concept is linked to Chomsky?
- *The language acquisition device
- Mands and tacts
- The zone of proximal development
- Egocentric speech
> The innate LAD with universal grammar.

Q: Thurstone's work led him to propose:
- *About seven primary mental abilities
- A single g with no group factors
- 180 structure-of-intellect abilities
- Eight multiple intelligences
> Primary mental abilities.

Q: Crystallised intelligence:
- Peaks in adolescence and falls sharply
- Is measured best by abstract matrices
- Is unaffected by education
- *Rises or holds steady well into later adulthood
> Acquired knowledge keeps growing.

Q: In PASS theory, which process depends mainly on the frontal lobes?
- Simultaneous
- *Planning
- Attention
- Successive
> Luria's third functional unit.

Q: Which test of intelligence is non-verbal and highly g-loaded?
- Torrance Tests of Creative Thinking
- Vineland Social Maturity Scale
- *Raven's Progressive Matrices
- MSCEIT
> Raven's matrices measure eduction of relations.

Q: In DSM-5-TR, the severity of intellectual disability is based on:
- The full-scale IQ
- The age at diagnosis
- *Adaptive functioning
- The number of failed subtests
> Severity levels are defined by adaptive functioning.

Q: The four Cs of creativity (Kaufman and Beghetto) are:
- Convergent, creative, critical, curious
- Copy, change, combine, create
- Cognition, content, context, culture
- *Mini-c, little-c, Pro-c and Big-C
> From personal insight to eminent creativity.
:::
`;
