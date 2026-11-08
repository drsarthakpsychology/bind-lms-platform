/* Module · Lifespan development, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: foundations and the first years

## 1.1 What development is, and its principles [core][starting]
**Development** is the pattern of systematic **change and continuity** in a person from conception to death. It includes growth (gaining), but also maintenance and decline (losing). Developmental psychologists study three broad **domains**, which always interact:
- **Physical**: body, brain, senses, motor skills, health.
- **Cognitive**: thinking, memory, language, intelligence, reasoning.
- **Socio-emotional**: emotions, personality, relationships, self, morality.

### The periods of life
| Period | Rough ages | Hallmarks |
|---|---|---|
| **Prenatal** | Conception to birth | From one cell to a baby; most vulnerable to harm |
| **Infancy and toddlerhood** | Birth to 2 years | Reflexes, motor milestones, attachment, first words |
| **Early childhood** | 2 to 6 years | Pretend play, language explosion, self-control begins |
| **Middle childhood** | 6 to 11 years | School skills, logical thinking, friendships |
| **Adolescence** | About 11 to 18 years | Puberty, abstract thought, identity |
| **Emerging adulthood** | About 18 to 25 years | Exploring work and love (mainly in some societies) |
| **Early adulthood** | About 25 to 40 years | Career, partnership, often parenthood |
| **Middle adulthood** | About 40 to 65 years | Peak responsibility, caring for both children and parents |
| **Late adulthood** | 65 onwards | Retirement, ageing, life review |
These ages are social conventions, not natural boundaries. They differ across cultures and history.

:::widget timeline
{"prompt": "Put the periods of the human lifespan in order, from conception onwards.", "events": [{"label": "Prenatal: one cell becomes a baby", "when": "Before birth"}, {"label": "Infancy and toddlerhood: reflexes, attachment, first words", "when": "0 to 2"}, {"label": "Early childhood: pretend play and a language explosion", "when": "2 to 6"}, {"label": "Middle childhood: school skills and logical thinking", "when": "6 to 11"}, {"label": "Adolescence: puberty, abstract thought, identity", "when": "11 to 18"}, {"label": "Early adulthood: career, partnership, often parenthood", "when": "25 to 40"}, {"label": "Middle adulthood: caring for children and parents", "when": "40 to 65"}, {"label": "Late adulthood: retirement and life review", "when": "65 on"}], "why": "The ages are conventions that differ across cultures. Emerging adulthood (about 18 to 25) sits between adolescence and early adulthood in some societies."}
:::

### Paul Baltes's lifespan perspective
Paul Baltes (1987) summarised the modern view in a set of principles. Development is:
1. **Lifelong**: no age dominates; change happens at every age.
2. **Multidimensional**: biological, cognitive and social dimensions develop together.
3. **Multidirectional**: some abilities grow while others decline (vocabulary may rise in old age while processing speed falls).
4. **A balance of gains and losses**: every period brings both.
5. **Plastic**: change is possible at every age, though plasticity narrows.
6. **Embedded in history and context**, shaped by three kinds of influence:
   - **Normative age-graded**: similar for most people of an age (puberty, menopause, starting school).
   - **Normative history-graded**: shared by a generation (the COVID-19 lockdowns, the arrival of smartphones, the 1991 economic liberalisation for Indians who grew up after it).
   - **Non-normative**: unusual events for an individual (a parent's early death, winning a lottery, a disabling accident).
7. **Multidisciplinary**: understood by psychology, biology, sociology, medicine and more.

:::widget sort
{
  "prompt": "Which kind of influence is this, in Baltes's terms?",
  "buckets": ["Normative age-graded", "Normative history-graded", "Non-normative"],
  "items": [
    { "text": "A girl begins menstruating at 12", "bucket": 0 },
    { "text": "Children who were in Class 1 when schools closed for COVID-19 lose months of learning", "bucket": 1 },
    { "text": "A boy's father dies in a road accident when he is 8", "bucket": 2 },
    { "text": "Most Indian children start formal schooling around 6", "bucket": 0 },
    { "text": "A generation grows up with UPI payments and short-video apps", "bucket": 1 },
    { "text": "A 30-year-old wins a scholarship to study abroad", "bucket": 2 }
  ]
}
:::

### Principles of physical growth
- **Cephalocaudal**: growth proceeds from head to tail. Babies control their heads before their legs.
- **Proximodistal**: from the centre of the body outwards. Babies control arms before fingers.
- **Differentiation and integration** (Heinz Werner's **orthogenetic principle**): development moves from global, undifferentiated actions to specific ones, which are then integrated into coordinated wholes.
- **Individual differences in rate**: every child follows a broadly similar sequence, but at their own pace.

### The big issues
| Issue | Question | Example |
|---|---|---|
| **Nature versus nurture** | How much do genes versus experience shape us? | Is shyness inborn or learnt? |
| **Continuity versus discontinuity** | Is change gradual (like a growing tree) or stage-like (like a caterpillar becoming a butterfly)? | Piaget (stages) versus information processing (gradual) |
| **Stability versus change** | Do early traits persist? | Does a fearful toddler become an anxious adult? |
| **Critical versus sensitive periods** | Are there windows when experience must happen? | Imprinting; language; attachment |

:::widget compare
{"title": "Continuous or stage-like change?", "a": {"label": "Continuity", "points": ["Change is gradual, like a tree growing taller", "More of the same: faster, bigger, more efficient", "Example: memory span grows a little each year", "Information-processing and learning views"], "summary": "Development as smooth growth in amount."}, "b": {"label": "Discontinuity", "points": ["Change comes in stages, like a caterpillar becoming a butterfly", "Each stage is different in kind", "Example: Piaget's child suddenly conserves number", "Stage theories: Piaget, Freud, Erikson, Kohlberg"], "summary": "Development as a series of qualitative leaps. Most modern views see both: steady change that can add up to a new way of thinking."}}
:::

A **critical period** is a fixed window when an experience is **essential** for normal development; if it is missed, the ability never develops normally. Konrad Lorenz's goslings **imprinted** on him (following him as if he were their mother) if he was the first moving object they saw shortly after hatching. In humans, true critical periods are rare (some aspects of vision are an example); most are **sensitive periods**: times when learning is easiest, but not impossible later.

:::widget decide
{
  "scene": "After the fall of Ceaușescu in 1989, thousands of children were found in Romanian orphanages with extreme deprivation. The English and Romanian Adoptees (ERA) study followed children adopted into UK families at different ages and compared them with UK-born adoptees, into their twenties.",
  "ask": "Predict the main finding.",
  "choices": [
    { "label": "All children recovered fully once placed in loving homes, whatever their age", "verdict": "ok", "outcome": "Not quite. Age at adoption mattered a lot.", "why": "Plasticity is real, but it has limits." },
    { "label": "Children adopted before about six months did about as well as UK adoptees; those who spent longer in the institutions had more lasting problems, though many still improved a lot", "verdict": "best", "outcome": "Correct. Longer deprivation (beyond about six months) was linked to persistent difficulties into adulthood, such as autism-like features, disinhibited social behaviour, inattention and overactivity, and cognitive problems, despite great catch-up in many areas.", "why": "This is strong human evidence for a sensitive period for early care, and for remarkable but incomplete plasticity." },
    { "label": "No child improved after leaving the orphanage", "verdict": "ok", "outcome": "Most children improved substantially.", "why": "Catch-up in growth and cognition was dramatic for many children." }
  ]
}
:::

:::clinician
ERA findings into young adulthood: children exposed to more than six months of institutional deprivation had higher rates of autism-like symptoms, disinhibited social engagement, inattention and overactivity persisting into young adulthood, and those with less than six months did not differ from UK adoptees; cognitive impairment remitted in many by adulthood, but emotional problems rose in adolescence and adulthood. The Bucharest Early Intervention Project (Nelson, Fox and Zeanah), a randomised trial of foster care versus continued institutional care, showed larger gains when foster placement happened before about 24 months, and has become a key case study in research ethics. In India, the implications reach adoption timelines under the Juvenile Justice (Care and Protection of Children) Act and CARA guidelines, and the quality of care in child-care institutions: early placement in stable family-based care is the evidence-based priority.
:::

:::recall
1. What are the three domains of development? || Physical, cognitive, socio-emotional.
2. Name four of Baltes's principles. || Lifelong, multidimensional, multidirectional, gains and losses, plastic, contextual, multidisciplinary.
3. Give the three kinds of influence on development. || Normative age-graded, normative history-graded, non-normative.
4. Distinguish cephalocaudal and proximodistal. || Head to tail; centre outwards.
5. How does a critical period differ from a sensitive period? || Critical: experience is essential within the window. Sensitive: learning is easiest then but still possible later.
:::

:::mcq
Q: A baby can lift her head well before she can stand. This illustrates the:
- *Cephalocaudal principle
- Proximodistal principle
- Orthogenetic principle
- Principle of plasticity
> Development proceeds from head to tail.

Q: An older woman's vocabulary keeps growing while her reaction time slows. Which lifespan principle does this show?
- *Multidirectionality
- Plasticity
- History-graded influence
- Continuity
> Some abilities rise while others decline.
:::

## 1.2 Nature, nurture and the systems around a child [core][starting]
Modern developmental science doesn't ask "nature **or** nurture?" but "**how** do genes and environments work together?"

### Heritability: a number often misread
**Heritability** is the proportion of the **differences between people** in a trait, in a particular population and environment, that is due to genetic differences. Three common errors:
1. It is **not** about individuals. "Intelligence is 50% heritable" does not mean half of your intelligence comes from genes.
2. It is **not fixed**. It changes with the environment. If everyone gets the same good schooling, more of the remaining differences will be genetic, so heritability goes **up**.
3. High heritability does **not** mean a trait can't change. Height is highly heritable, yet average height rose sharply in many countries as nutrition improved.

:::widget decide
{
  "scene": "Turkheimer and colleagues (2003) studied twins in the United States from families across the income range and estimated the heritability of IQ separately for poor and well-off families.",
  "ask": "Predict what they found.",
  "choices": [
    { "label": "Heritability was the same in all families", "verdict": "ok", "outcome": "It differed sharply by family income.", "why": "Heritability depends on the environment." },
    { "label": "In poor families, heritability of IQ was close to zero and the shared environment mattered most; in well-off families, genes explained most of the differences", "verdict": "best", "outcome": "Correct, in that sample.", "why": "When environments vary a lot and some are poor, environment explains more. When everyone has a good enough environment, genetic differences show. Later studies found this pattern mainly in the US and less outside it (a 2016 meta-analysis), which itself shows heritability is context-bound." },
    { "label": "Heritability was higher in poor families", "verdict": "ok", "outcome": "The reverse was found.", "why": "Deprivation suppressed the expression of genetic differences." }
  ]
}
:::

### Genes and environments work together
**Gene-environment correlation (rGE)**: our genes influence the environments we experience, in Sandra Scarr and Kathleen McCartney's model.
| Type | What happens | Example |
|---|---|---|
| **Passive** | Parents give children both genes and an environment that fits them | Musical parents pass on genes and also fill the home with music |
| **Evocative (reactive)** | A child's genetically influenced traits draw responses from others | A cheerful, smiling baby gets more smiles and play from adults |
| **Active (niche-picking)** | People seek environments that fit their genes | A sporty teenager joins the athletics team |
Passive rGE is strongest in early childhood; active rGE grows with age as children choose their own worlds.

**Gene-environment interaction (GxE)**: the effect of an environment depends on a person's genes, or vice versa. The **diathesis-stress** model says a vulnerability shows only under stress; **differential susceptibility** (Belsky) says some children are more sensitive to **both** bad and good environments ("orchids" versus "dandelions").

**Epigenetics**: chemical marks on DNA (such as methylation) that change how genes are switched on or off, without changing the DNA sequence, and can be shaped by experience. The **Dutch Hunger Winter** (1944 to 1945) is the classic natural experiment: people whose mothers were pregnant during the famine had different methylation of growth-related genes six decades later, and higher rates of obesity and heart disease.

:::widget sort
{
  "prompt": "Which kind of gene-environment correlation is this?",
  "buckets": ["Passive", "Evocative", "Active"],
  "items": [
    { "text": "A bookish father passes on his genes and also fills the house with books", "bucket": 0 },
    { "text": "A very active toddler gets told off more by teachers", "bucket": 1 },
    { "text": "A curious teenager joins a coding club and spends weekends on projects", "bucket": 2 },
    { "text": "An anxious mother with an anxious temperament also protects her child from new situations", "bucket": 0 },
    { "text": "A socially outgoing child is invited to more birthday parties", "bucket": 1 },
    { "text": "A college student who loves risk chooses friends who go trekking in the Himalayas", "bucket": 2 }
  ]
}
:::

### Bronfenbrenner's ecological systems
Urie Bronfenbrenner (1979) pictured the child at the centre of nested systems:
| System | What it is | Indian example |
|---|---|---|
| **Microsystem** | Settings the child is directly in | Home with parents and grandparents, school, anganwadi, friends |
| **Mesosystem** | Links between microsystems | Parent-teacher meetings; grandparents who attend school events |
| **Exosystem** | Settings the child is not in but which affect them | A parent's night-shift job; the local panchayat's decision on a school road |
| **Macrosystem** | Culture, values, laws and economy | Gender norms, caste, the Right to Education Act, national exam culture |
| **Chronosystem** | Change over time, in the child and in history | Parents' divorce; the shift to online classes during the pandemic |
:::widget layers
{
  "title": "Bronfenbrenner's systems around Meera, a 9-year-old in Lucknow",
  "shape": "rings",
  "layers": [
    { "label": "Meera", "detail": "Her temperament, health and abilities (the 'person' in the later bioecological model)." },
    { "label": "Microsystem", "detail": "Parents, grandmother, younger brother, her school, her tuition teacher, her friends in the colony." },
    { "label": "Mesosystem", "detail": "How these settings connect: her grandmother attends parent-teacher meetings; tuition and school teach in different ways." },
    { "label": "Exosystem", "detail": "Settings she is not in that affect her: her father's new job with long hours; the municipal decision to close the park." },
    { "label": "Macrosystem", "detail": "Beliefs, laws and economy: gender norms about girls' education, the RTE Act, the exam-focused school culture." },
    { "label": "Chronosystem", "detail": "Change over time: the move from a village to the city, pandemic school closures, her parents' changing roles." }
  ],
  "caption": "The chronosystem wraps around all the others because every system changes over time."
}
:::

His later **bioecological model** added the person's own biology and summarised it as **Process-Person-Context-Time (PPCT)**, with **proximal processes** (regular, increasingly complex interactions with people and objects) as the engines of development.

:::mnemonic Bronfenbrenner from inside out
"**M**y **M**um **E**ats **M**angoes **C**ontinually": micro, meso, exo, macro, chrono.
:::

:::clinician
Candidate GxE findings illustrate a replication lesson. The MAOA-by-maltreatment interaction for antisocial behaviour, reported in 2002, has had partial meta-analytic support with small effects; the 5-HTTLPR-by-stress interaction for depression (reported in 2003) was not supported by the largest analysis (a 2019 study of over 600,000 participants found no candidate-gene effects). Polygenic scores now replace single candidate genes, but they explain modest variance and are less accurate in non-European ancestries, including South Asians, because training GWAS samples are mostly European. Claims about human transgenerational epigenetic inheritance (beyond intrauterine exposure) remain weak. The Indian developmental-origins literature is strong: the Mysore birth cohort studies linked low birthweight to later coronary heart disease and diabetes, part of the "thin-fat Indian baby" research behind DOHaD (developmental origins of health and disease).
:::

:::recall
1. Define heritability. || The proportion of differences between people in a trait, in a given population and environment, due to genetic differences.
2. Name the three types of gene-environment correlation. || Passive, evocative, active.
3. What is differential susceptibility? || Some children are more sensitive to both bad and good environments.
4. What did the Dutch Hunger Winter show? || Prenatal famine exposure was linked to altered gene methylation and later health problems decades on.
5. List Bronfenbrenner's five systems. || Microsystem, mesosystem, exosystem, macrosystem, chronosystem.
:::

:::mcq
Q: A child's mother is under stress because her employer has cancelled her leave. The child is affected, though she never goes to her mother's office. This is Bronfenbrenner's:
- Microsystem
- Mesosystem
- Macrosystem
- *Exosystem
> A setting the child is not in that still affects her.
:::

## 1.3 How we study change: research designs [core][starting]
Developmental psychology needs designs that can separate the effects of **age** from other things that come with age.

### The three basic designs
| Design | How it works | Strengths | Problems |
|---|---|---|---|
| **Cross-sectional** | Compare different age groups at **one time** (20-, 40-, 60- and 80-year-olds tested this year) | Quick, cheap, no drop-out | Age is confounded with **cohort** (generation); shows age **differences**, not individual change |
| **Longitudinal** | Follow the **same people** over years | Shows individual change and stability; can test early predictors | Slow, expensive; **attrition** (drop-out, often of the less healthy); **practice effects**; **time-of-measurement** effects; findings may apply only to that cohort |
| **Sequential (cohort-sequential)** | Several cohorts are each followed longitudinally (a mix of the two) | Separates age, cohort and time effects | Complex and costly |

A **cohort** is a group born around the same time, who share historical experiences. The **cohort effect** is the influence of being born at a particular time (for example, people born in India in 1950 had far less schooling on average than those born in 2000).

:::widget compare
{"title": "Cross-sectional or longitudinal?", "a": {"label": "Cross-sectional", "points": ["Different age groups tested at one time", "Quick and cheap, no drop-out", "Age is mixed up with cohort", "Cannot show how individuals change"], "summary": "Good for a first look. It made older adults look worse than they are, because older cohorts had less schooling."}, "b": {"label": "Longitudinal", "points": ["The same people followed for years", "Shows real individual change and early predictors", "Slow, costly, and people drop out", "Practice effects from repeated testing"], "summary": "Gold standard for change, but the healthiest tend to stay in the study. A sequential design combines both."}}
:::

### Schaie's Seattle Longitudinal Study
K. Warner Schaie began testing adults' mental abilities in 1956 and retested them every seven years, adding new cohorts each time: a sequential design.

:::widget guess
{
  "prompt": "Cross-sectional comparisons in Schaie's study suggested that some mental abilities began to decline from early adulthood. When the **same people** were followed longitudinally, from about what age did most abilities show reliable decline?",
  "min": 25,
  "max": 85,
  "unit": "years",
  "answer": [58, 67],
  "reveal": "Most abilities stayed fairly stable until about **60**, with clear decline mainly after the mid-60s to 70s. The cross-sectional picture had made older people look worse partly because they belonged to cohorts with less education: a **cohort effect**, not ageing.",
  "clinician": "Seattle Longitudinal Study (Schaie): reliable longitudinal decline in most primary mental abilities was not seen before about age 60, and by 81 fewer than half of participants had declined significantly over the preceding seven years on most abilities. Perceptual speed declined earlier; verbal meaning and inductive reasoning held up longest. Later cohorts performed better at the same ages (Flynn-type cohort gains)."
}
:::

### Other designs
- **Time-lag**: compare people of the **same age** at different times (17-year-olds in 1995 and 2025) to study cohort change.
- **Microgenetic** (Robert Siegler): study children intensively while a change is happening (for example, many sessions while they learn a new maths strategy).
- **Case studies** and **natural experiments** (such as famine, war, or a policy change).
- **Experimental and quasi-experimental** studies, including randomised trials of early interventions.

### Famous long-term studies
- **Dunedin Study** (New Zealand): about 1,000 children born in 1972 to 1973, followed for over 50 years.
- **Young Lives** (India, Ethiopia, Peru and Vietnam): in India, about 3,000 children in Andhra Pradesh and Telangana, in two cohorts, followed since 2002.
- **Longitudinal Ageing Study in India (LASI)**: a national survey of over 70,000 adults aged 45 and above, first wave 2017 to 2018, designed to follow the same people over time.
- **Mysore birth cohort**: adults born at Holdsworth Memorial Hospital whose birth records were linked to adult health.

### Ethics with children
Children cannot give full consent, so research needs **parental permission** and the child's own **assent** (agreement in a form they can understand). Researchers must minimise distress, keep data confidential, and be ready to act on concerns about a child's safety (in India, the POCSO Act 2012 makes reporting sexual abuse mandatory). The **ICMR National Ethical Guidelines (2017)** have specific provisions for research with children.

:::widget worked
{
  "title": "Choosing a design: does smartphone use in early adolescence predict later anxiety?",
  "steps": [
    { "q": "Why is a cross-sectional study of 12-, 15- and 18-year-olds not enough?", "a": "It shows only age differences, mixed up with cohort differences (younger children got phones earlier in a different tech era), and cannot show whether phone use came before anxiety." },
    { "q": "What does a longitudinal design add?", "a": "Measuring the same children at 12, 15 and 18 shows whether phone use at 12 predicts anxiety at 15 and 18, allowing for earlier anxiety (a cross-lagged design)." },
    { "q": "What is the main threat, and how do you reduce it?", "a": "Attrition: anxious or disadvantaged children may drop out. Reduce it with tracking, incentives and statistical methods for missing data, and report who dropped out." },
    { "q": "Can it prove that phones cause anxiety?", "a": "No. It strengthens a causal argument about timing, but other factors (family stress, sleep) could explain both. Only an experiment or a strong natural experiment could test cause directly." }
  ],
  "yourTurn": [
    { "q": "You want to know whether today's 70-year-olds have better memory than 70-year-olds did 30 years ago. Which design?", "a": "A time-lag design: compare people of the same age at different times." }
  ]
}
:::

:::clinician
Advanced terms examiners use: **age, period and cohort effects** cannot all be estimated independently in simple designs because any two determine the third (the identification problem); sequential designs and statistical constraints address this. **Selective attrition** biases longitudinal ageing studies towards healthier survivors, which can make decline look smaller; **terminal decline** (accelerated decline in the few years before death) is better captured by analysing time-to-death rather than age. **Retest effects** inflate apparent stability. Modern analyses use multilevel growth models and latent growth curves to model individual trajectories. India's large cohorts (LASI, its dementia sub-study LASI-DAD, Young Lives, and the National Family Health Survey's repeated cross-sections) are major data sources for Indian dissertations; the NFHS is repeated cross-sectional, not longitudinal.
:::

:::recall
1. What is the main problem with cross-sectional designs? || Age is confounded with cohort; they show age differences, not individual change.
2. Name three problems of longitudinal designs. || Attrition, practice effects, time-of-measurement effects, slow and costly, cohort-specific findings.
3. What does a sequential design do? || Follows several cohorts longitudinally, separating age, cohort and time effects.
4. What did Schaie's longitudinal data show compared with cross-sectional data? || Abilities stayed stable until about 60; cross-sectional decline was partly a cohort effect.
5. What is a time-lag design? || Comparing people of the same age at different historical times.
6. Distinguish assent from consent. || Assent is a child's own agreement; consent (permission) is given by parents or guardians.
:::

:::mcq
Q: A study tests 20-, 40- and 60-year-olds today and finds older groups score lower on a reasoning test. The most important alternative explanation is:
- *Cohort differences
- Practice effects from earlier tests
- Attrition
- Time-of-measurement effects
> Older cohorts often had less schooling; cross-sectional designs confound age and cohort.
:::

## 1.4 Before birth: prenatal development and birth [core][starting]
### Three periods of prenatal development
1. **The germinal period**: from conception, the fertilised egg (zygote) divides rapidly, travels down the fallopian tube and **implants** in the wall of the uterus. The placenta and umbilical cord begin to form.
2. **The embryonic period**: the three layers of cells form all the major organs (**organogenesis**). The heart begins to beat, and the neural tube (which becomes the brain and spinal cord) closes. This is when the developing baby is **most vulnerable** to harmful substances.
3. **The fetal period**: the longest period. Organs grow and mature; the fetus moves, hears, and gains most of its weight in the final months.

:::widget timeline
{"prompt": "Put these events of prenatal development in order, from conception to birth.", "events": [{"label": "The fertilised egg divides and implants in the wall of the uterus", "when": "Germinal"}, {"label": "The neural tube closes and the heart begins to beat", "when": "Embryonic"}, {"label": "All major organs have formed: the most sensitive time for teratogens", "when": "End of embryonic"}, {"label": "The fetus moves and can hear sounds", "when": "Fetal"}, {"label": "Most of the birth weight is gained", "when": "Final months"}], "why": "Structures form early and grow later. That is why harm from alcohol, valproate or rubella is worst when it strikes during the embryonic period, while organs are forming."}
:::

:::widget guess
{
  "prompt": "The embryonic period, when all the major organs form, ends about how many weeks after conception?",
  "min": 2,
  "max": 20,
  "unit": "weeks",
  "answer": [7, 9],
  "reveal": "About **8 weeks** after conception. The germinal period is roughly the first **2 weeks**, the embryonic period runs from about week **3 to 8**, and the fetal period from about week **9 until birth** (about 38 weeks after conception, or 40 weeks counted from the last menstrual period, as obstetricians count). Many women don't yet know they are pregnant during the most sensitive period, which is why advice on alcohol and folic acid applies to anyone who might become pregnant.",
  "clinician": "Neural tube closure occurs by about day 28 after conception, which is why periconceptional folic acid (started before conception) prevents neural tube defects. The age of viability is about 22 to 24 weeks of gestation, with survival depending heavily on neonatal intensive care availability. Thalidomide's limb defects (phocomelia) occurred with exposure roughly between days 20 and 36 after conception, a precise demonstration of critical periods."
}
:::

### Teratogens
A **teratogen** is any environmental agent that can cause birth defects or developmental harm. Four principles of teratology:
- **Timing**: harm depends on **when** exposure happens; each organ has its own sensitive window, most of them in the embryonic period.
- **Dose**: larger doses or longer exposure usually cause more harm.
- **Genetic vulnerability**: the genes of mother and baby affect susceptibility.
- **Specificity**: particular teratogens tend to cause particular defects.

| Teratogen | Possible effects |
|---|---|
| **Alcohol** | **Fetal alcohol spectrum disorder**: small head, distinctive facial features, intellectual disability, attention and behaviour problems. **No safe amount** is known |
| **Tobacco** (smoked and smokeless, and second-hand smoke) | Low birthweight, preterm birth, sudden infant death |
| **Thalidomide** | Limb defects (given for morning sickness in the late 1950s) |
| **Valproate** (an anti-epileptic and mood stabiliser) | Neural tube defects, lower IQ and higher autism risk |
| **Isotretinoin** (an acne medicine) | Severe face, heart and brain defects |
| **Rubella** (German measles) | Deafness, cataracts, heart defects, especially early in pregnancy |
| **Zika virus** | Microcephaly |
| **Iodine deficiency** | Intellectual disability (cretinism in severe cases); India's iodised salt programme targets this |
| **Lead and mercury** | Brain damage (Minamata disease in Japan from mercury) |
| **Severe maternal stress and malnutrition** | Low birthweight; later health risks |
| **Radiation** | Microcephaly, intellectual disability |

:::widget decide
{
  "scene": "Kavita, 27, from Nagpur, has bipolar disorder and is well on valproate. She tells her psychiatrist she and her husband would like to have a baby “sometime next year”.",
  "ask": "What is the best response?",
  "choices": [
    { "label": "“Stop the valproate now, before you try to conceive.”", "verdict": "harm", "outcome": "Kavita relapses into mania within two months.", "why": "Stopping a mood stabiliser abruptly carries a high relapse risk. Changes must be planned." },
    { "label": "“Let's plan this together: valproate carries serious risks for a baby, so we'll discuss switching to a safer option well before you try, start high-dose folic acid, and involve your obstetrician.”", "verdict": "best", "outcome": "Kavita switches medicine under supervision and conceives a year later while stable.", "why": "Valproate is a major teratogen, so pre-conception planning is essential; an abrupt stop is dangerous. This links to the module on mood stabilisers." },
    { "label": "“It's fine; most babies are healthy.”", "verdict": "harm", "outcome": "She conceives on valproate without knowing the risks.", "why": "False reassurance about a known teratogen is unsafe and denies informed choice." }
  ]
}
:::

### Birth
Labour has three stages: **dilation** of the cervix (the longest), **delivery** of the baby, and delivery of the **placenta**. Immediately after birth, the baby is checked with the **Apgar scale**, devised by the anaesthetist **Virginia Apgar** in 1952.

:::mnemonic APGAR
**A**ppearance (skin colour), **P**ulse (heart rate), **G**rimace (reflex response), **A**ctivity (muscle tone), **R**espiration (breathing). Each scored 0, 1 or 2.
:::

:::widget guess
{
  "prompt": "The Apgar score adds five signs, each scored 0 to 2, so it ranges from 0 to 10. A score of at least what usually means the newborn is in good condition?",
  "min": 0,
  "max": 10,
  "unit": "points",
  "answer": [7, 7],
  "reveal": "**7 to 10** is reassuring. **4 to 6** means the baby needs some help (for example, with breathing), and **0 to 3** needs urgent resuscitation. It is done at **1 minute and 5 minutes** after birth.",
  "clinician": "The 5-minute score is more prognostic than the 1-minute score; scores are repeated every five minutes up to 20 minutes if the 5-minute score is below 7. The Apgar is a snapshot of condition, not a test of later intelligence."
}
:::

### Low birthweight and prematurity
A baby is **low birthweight** at under 2,500 grams and **preterm** if born well before the due date. In India, about one in six babies is born with low birthweight (NFHS-5), linked to maternal anaemia (about half of pregnant women in NFHS-5 were anaemic), adolescent pregnancy, poor nutrition and short gaps between births. Risks include infections, breathing problems, developmental delay and, in later life, diabetes and heart disease.

**Kangaroo mother care** (skin-to-skin contact on the mother's chest, plus exclusive breastfeeding), developed in Bogotá, Colombia, in the late 1970s, reduces deaths in small babies. A WHO trial published in 2021, with sites in India and four African countries, found that starting skin-to-skin care **immediately** after birth, rather than after the baby was stable, reduced deaths in the first month by about a quarter.

:::clinician
Perinatal mental health links: maternal depression in pregnancy is associated with preterm birth and low birthweight, and postpartum depression affects about one in five Indian mothers in pooled estimates; screening (for example, with the Edinburgh Postnatal Depression Scale, validated in several Indian languages) and treatment matter for both mother and infant. Prescribing in pregnancy requires a risk-benefit discussion: untreated maternal illness is itself a risk. Valproate should not be prescribed to women of child-bearing potential unless other treatments are ineffective and a pregnancy prevention plan is in place, per regulatory guidance in the UK and Europe; lithium carries a smaller cardiac risk than once thought (Ebstein's anomaly risk is low in absolute terms). Breastfeeding, early stimulation and responsive caregiving are the core of the WHO/UNICEF Nurturing Care Framework (2018), which India's Poshan Abhiyaan and the Integrated Child Development Services (anganwadi) system aim to deliver.
:::

:::recall
1. Name the three prenatal periods in order. || Germinal, embryonic, fetal.
2. In which period is the baby most vulnerable to teratogens, and why? || The embryonic period, because the major organs are forming.
3. List the four principles of teratology. || Timing, dose, genetic vulnerability, specificity.
4. What does APGAR stand for? || Appearance, pulse, grimace, activity, respiration.
5. What is the low birthweight cut-off? || Under 2,500 grams.
6. What did the WHO immediate kangaroo mother care trial find? || Starting skin-to-skin care immediately after birth cut deaths in the first month by about a quarter.
:::

:::mcq
Q: Which statement about alcohol in pregnancy is most accurate?
- A glass of wine a day is safe after the first months
- Alcohol harms only the embryonic period
- Beer is safe but spirits are not
- *No safe amount has been established
> Fetal alcohol spectrum disorder can follow exposure at any stage; no safe level is known.
:::

## 1.5 The newborn and infant: reflexes, senses and motor milestones [core][starting]

:::widget figure
{"id": "reflex-arc"}
:::

### Reflexes
A **reflex** is an automatic, inborn response to a stimulus. Some help survival; others are signs of a healthy nervous system. Most **primitive reflexes** disappear in the first months as the cortex matures; one that persists too long, or is absent, can be a sign of neurological problems.
| Reflex | What you see | Roughly disappears by |
|---|---|---|
| **Rooting** | Stroke the cheek and the baby turns towards it, mouth open | About 3 to 4 months |
| **Sucking** | Sucks anything placed in the mouth | Becomes voluntary in the first months |
| **Moro (startle)** | A sudden loss of support or a loud noise makes the baby fling arms out, then bring them in | About 4 to 6 months |
| **Palmar grasp** | Grips a finger placed in the palm, strongly | About 3 to 4 months |
| **Babinski** | Stroke the sole and the toes fan out and the big toe bends up | About 12 months (in adults, it signals brain or spinal damage) |
| **Stepping** | Held upright with feet on a surface, makes walking movements | About 2 months |
| **Tonic neck (fencing)** | Head turned to one side: that arm extends, the other bends | About 4 months |
| **Swimming** | Placed face down in water, paddles and holds breath | About 4 to 6 months (never a reason to put babies in water) |
Some reflexes are **permanent**: blinking, coughing, sneezing, gagging, yawning.

:::widget sort
{
  "prompt": "Which reflex is being described?",
  "buckets": ["Rooting", "Moro", "Babinski", "Palmar grasp"],
  "items": [
    { "text": "A door slams; the baby's arms fly outwards, then come back to the chest", "bucket": 1 },
    { "text": "The nurse strokes the baby's cheek and he turns his head, mouth open", "bucket": 0 },
    { "text": "A doctor runs a finger up the sole and the toes fan out", "bucket": 2 },
    { "text": "The baby grips her grandmother's finger so tightly she can almost lift her", "bucket": 3 },
    { "text": "In a 40-year-old after a stroke, the big toe bends upward when the sole is stroked", "bucket": 2, "why": "A positive Babinski sign in an adult points to damage of the motor pathways from the brain." },
    { "text": "When the baby's head is lowered suddenly, she startles and extends her arms", "bucket": 1 }
  ]
}
:::

### What newborns can sense
- **Vision** is the least mature sense at birth (blurry, best at about 20 to 30 centimetres, the distance to a feeding parent's face), but improves rapidly over the first year.
- **Faces**: Robert Fantz (1961) used **preferential looking** (showing two pictures and measuring which one the baby looks at longer) and found that even very young babies prefer face-like patterns.
- **Hearing** is well developed. DeCasper and Fifer (1980) showed newborns would change their **sucking rate** to hear their own mother's voice rather than a stranger's: they had learnt it in the womb.
- **Taste and smell**: babies prefer sweet tastes and can recognise their own mother's breast-milk smell within days.
- **Touch and pain**: present from birth. Newborns feel pain, which is why pain relief for procedures matters.

### Methods for studying infants
- **Habituation and dishabituation**: babies look less at a stimulus shown repeatedly (habituation); if they look longer when something changes, they can tell the difference.
- **Preferential looking**.
- **High-amplitude sucking**: babies suck harder or faster to keep a sound or image going.
- **Violation of expectation**: babies look longer at "impossible" events (Renée Baillargeon), used to argue that young infants understand that objects continue to exist.

### Depth perception: the visual cliff
:::widget decide
{
  "scene": "Gibson and Walk (1960) built a 'visual cliff': a glass table with a checkerboard pattern directly under the glass on one side (shallow) and far below the glass on the other (looking like a drop). Babies who could crawl, aged about 6 to 14 months, were placed on the centre, and their mothers called them from each side.",
  "ask": "Predict what most babies did when called from the deep side.",
  "choices": [
    { "label": "Crawled straight across to the mother, since the glass was solid", "verdict": "ok", "outcome": "Only a very small number did.", "why": "They could feel the glass, but they saw a drop." },
    { "label": "Refused to cross the deep side, though most happily crossed the shallow side", "verdict": "best", "outcome": "Correct. Of 36 babies, 27 crawled to the mother on the shallow side, but only 3 crept onto the deep side. Many cried or patted the glass but would not cross.", "why": "Crawling babies perceive depth. Later work by Joseph Campos showed that fear of the drop depends partly on crawling experience: babies who had been crawling longer showed more wariness, an example of motor and perceptual development driving each other." },
    { "label": "Crawled randomly; babies cannot perceive depth before walking", "verdict": "ok", "outcome": "Their behaviour was clearly not random.", "why": "Depth perception was present in crawling infants." }
  ]
}
:::

:::widget figure
{"id": "visual-cliff"}
:::

### Motor milestones
**Gross motor** skills use large muscles (holding the head up, sitting, crawling, standing, walking). **Fine motor** skills use small muscles (reaching, the pincer grasp between thumb and finger, scribbling). The **sequence** is similar for almost all children; the **timing** varies widely.

:::widget timeline
{"prompt": "Put a typical infant's gross motor milestones in order.", "events": [{"label": "Holds the head steady", "when": "About 2 to 3 mo"}, {"label": "Rolls over", "when": "About 4 to 6 mo"}, {"label": "Sits without support", "when": "About 6 mo"}, {"label": "Crawls on hands and knees", "when": "About 8 to 9 mo"}, {"label": "Pulls up to stand", "when": "About 9 to 10 mo"}, {"label": "Walks alone", "when": "About 12 mo"}], "why": "Control spreads from the head downwards (cephalocaudal). The order is very similar across children, but the ages vary widely, and some healthy babies skip crawling."}
:::

:::widget guess
{
  "prompt": "The WHO Multicentre Growth Reference Study, which included healthy children in Delhi, measured when children first walk alone. By about what age (in months) have half of healthy children walked alone?",
  "min": 6,
  "max": 24,
  "unit": "months",
  "answer": [11, 13],
  "reveal": "About **12 months**. But the normal range is wide: roughly **8 to 18 months**. Sitting without support comes at about 6 months (range about 4 to 9). Variation within the range is normal; missing a milestone well beyond its range is a reason for assessment.",
  "clinician": "WHO MGRS motor windows: sitting without support about 3.8 to 9.2 months; standing alone about 6.9 to 16.9 months; walking alone about 8.2 to 17.6 months (1st to 99th percentiles). About 4% of healthy children skipped crawling on hands and knees. Developmental 'red flags' commonly used in Indian paediatric practice include no social smile by about 3 months, no sitting by 9 months, no walking by 18 months, no words by 16 to 18 months, and any loss of skills at any age."
}
:::

### The infant brain
At birth, the brain is about a quarter of its adult weight; by age 2, about three-quarters. **Synaptogenesis** (forming connections) is explosive in the first years; then **synaptic pruning** removes connections that are not used ("use it or lose it"). **Myelination** (insulating nerve fibres) continues into the twenties, with the prefrontal cortex last. **Experience-expectant** development depends on experiences almost every baby gets (light, patterned sound, a caregiver); **experience-dependent** development depends on individual experiences (learning a particular language or skill).

:::clinician
Dynamic systems theory (Esther Thelen) reframed motor development: skills emerge from the interaction of body growth, motivation and environment rather than unfolding by maturation alone. Thelen's demonstration that the 'disappearing' stepping reflex reappears when infants' legs are submerged in water (reducing leg weight) showed the reflex is lost partly because legs get heavier faster than muscles get stronger. Baillargeon's violation-of-expectation findings (such as the 'drawbridge' study with infants of about 5 months) are interpreted by some as early object knowledge (core knowledge, Spelke) and by critics (for example, Haith's 'rich interpretation' critique) as responses to perceptual novelty or familiarity; replication of some looking-time findings has been mixed, and the ManyBabies consortium now runs large multi-lab infant studies. In clinical practice, persistent primitive reflexes are one sign examined in suspected cerebral palsy.
:::

:::recall
1. Name four newborn reflexes and when they fade. || Rooting (about 3 to 4 months), Moro (about 4 to 6 months), palmar grasp (about 3 to 4 months), Babinski (about 12 months).
2. Which sense is least developed at birth? || Vision.
3. What did DeCasper and Fifer show? || Newborns changed their sucking to hear their own mother's voice.
4. What is habituation used for in infant research? || To test whether babies can tell two stimuli apart (they look longer when a change is noticed).
5. What did the visual cliff show? || Crawling babies perceive depth and avoid the deep side.
6. Distinguish experience-expectant and experience-dependent development. || Expectant: relies on experiences nearly all babies get. Dependent: relies on individual experiences.
:::

:::mcq
Q: In an adult, the toes fanning upward when the sole is stroked suggests:
- A normal finding at any age
- *Damage to motor pathways
- Peripheral nerve damage in the foot only
- A sign of good health
> A positive Babinski sign is normal in infants but abnormal in adults.
:::

## 1.6 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: The COVID-19 school closures, which affected one whole generation of children, are an example of:
- *Normative history-graded influence
- Normative age-graded influence on children
- Non-normative influence
- A critical period
> Shared by a cohort at one point in history.

Q: Babies control their arms before their fingers. This illustrates the:
- Cephalocaudal principle
- Principle of discontinuity
- *Proximodistal principle
- Critical period principle
> From the centre of the body outwards.

Q: Lorenz's goslings following him after hatching illustrate:
- Habituation
- Sensitive periods in human language
- Operant conditioning
- *Imprinting in a critical period
> Imprinting on the first moving object seen.

Q: A musical family passes on genes and fills the home with music. This is:
- Evocative gene-environment correlation
- *Passive gene-environment correlation
- Active gene-environment correlation
- Gene-environment interaction
> Parents provide both genes and environment.

Q: Which statement about heritability is correct?
- *It can change when the environment changes
- It tells you how much of one person's trait is genetic
- A highly heritable trait cannot be changed
- It is the same in every population
> Heritability is population- and environment-specific.

Q: In Bronfenbrenner's model, the link between a child's home and school is the:
- Microsystem
- Exosystem
- *Mesosystem
- Chronosystem
> Connections between microsystems.

Q: A design that compares different age groups at one point in time is:
- Longitudinal (repeated measures)
- Sequential
- Time-lag
- *Cross-sectional
> Quick, but confounds age and cohort.

Q: Older participants who are less healthy drop out of a long-term study. This problem is called:
- *Selective attrition
- Cohort effect of generation
- Practice effect
- Time-lag bias
> Drop-out biases longitudinal samples.

Q: The prenatal period in which all major organs form is the:
- Germinal (zygote) period
- Fetal period
- *Embryonic period
- Neonatal period
> Organogenesis happens in the embryonic period.

Q: Which is NOT one of the principles of teratology?
- Timing of exposure
- *Age at marriage
- Dose
- Genetic vulnerability of the baby
> The four principles are timing, dose, genetic vulnerability and specificity.

Q: The "G" in APGAR stands for:
- Gestation
- Growth
- Grip
- *Grimace
> Grimace: reflex irritability.

Q: A newborn turns towards a finger stroking her cheek. This is the:
- *Rooting reflex
- Moro reflex
- Babinski reflex
- Palmar reflex
> Rooting helps the baby find the breast.

Q: Fantz's research showed that young babies:
- Cannot see anything for months
- Prefer plain grey patches
- *Prefer face-like patterns
- See as clearly as adults do
> Using preferential looking.

Q: In the visual cliff study, most crawling babies:
- Crossed the deep side without hesitation
- Could not crawl at all
- Crossed only when no mother was present
- *Would not cross the deep side
> Depth perception was present.
:::

# Part II · Beginner: thinking, bonds and the growing child

## 2.1 Piaget's theory of cognitive development [core][beginner]
Jean Piaget (1896 to 1980), a Swiss biologist turned psychologist, watched his own three children closely and interviewed thousands more. He saw children as **little scientists** who actively build their understanding.

:::widget figure
{"id": "conservation-liquid"}
:::

:::widget figure
{"id": "three-mountains"}
:::

### The building blocks
- **Schemes (schemas)**: organised patterns of action or thought (a baby's "sucking scheme", a child's concept of "dog").
- **Assimilation**: fitting new experience into an existing scheme (a toddler calls a cow a "big dog").
- **Accommodation**: changing a scheme to fit new experience (learning that cows are different from dogs).
- **Equilibration**: the drive to balance assimilation and accommodation. When a scheme doesn't work (disequilibrium), the child is pushed to a new, better understanding.
- **Organisation**: combining schemes into more complex systems.

:::widget flow
{"title": "Piaget's engine of development", "layout": "cycle", "nodes": [{"id": "e", "label": "Equilibrium", "detail": "The child's schemes fit her world. 'Four legs and fur means dog.'"}, {"id": "a", "label": "Assimilation", "detail": "A cow appears. She fits it into her scheme: 'Big dog!'"}, {"id": "d", "label": "Disequilibrium", "detail": "The 'dog' moos and gives milk. The scheme no longer fits, and that feels unsettling."}, {"id": "c", "label": "Accommodation", "detail": "She changes her schemes: dogs and cows are different animals."}], "edgeLabels": {"e>a": "new experience", "a>d": "it does not fit", "d>c": "change the scheme", "c>e": "a better balance"}, "caption": "Each turn of the loop leaves the child with more complex, better organised schemes."}
:::

### The four stages
| Stage | Ages (approximate) | Key achievements | Limits |
|---|---|---|---|
| **Sensorimotor** | Birth to 2 years | Learning through senses and actions; **object permanence**; the beginnings of symbolic thought; deferred imitation | No mental representation at first |
| **Preoperational** | 2 to 7 years | **Symbolic function**: language, pretend play, drawing | **Egocentrism**, **centration**, no **conservation**, irreversibility, **animism**, transductive reasoning |
| **Concrete operational** | 7 to 11 years | Logical operations on real objects: **conservation**, **reversibility**, **classification**, **seriation**, decentration | Struggles with abstract and hypothetical problems |
| **Formal operational** | 11 years onwards | **Abstract** and **hypothetico-deductive** reasoning, systematic testing of variables, propositional logic | Not reached by everyone in every area |

:::widget timeline
{"prompt": "Put Piaget's four stages and their hallmark achievements in order.", "events": [{"label": "Sensorimotor: object permanence, learning through senses and actions", "when": "0 to 2"}, {"label": "Preoperational: language and pretend play, but egocentric and no conservation", "when": "2 to 7"}, {"label": "Concrete operational: conservation, classification and seriation of real objects", "when": "7 to 11"}, {"label": "Formal operational: abstract and hypothetico-deductive reasoning", "when": "11 on"}], "why": "Piaget held that the order is fixed and every child goes through it, though the ages vary. Later research found many abilities appear earlier than he thought when tasks are simpler."}
:::

### The six sensorimotor substages
1. **Reflexes** (the first month).
2. **Primary circular reactions** (about 1 to 4 months): repeating pleasant actions centred on the body (thumb-sucking).
3. **Secondary circular reactions** (about 4 to 8 months): repeating actions that have interesting effects on the world (shaking a rattle).
4. **Coordination of secondary schemes** (about 8 to 12 months): goal-directed behaviour, such as pushing a cushion aside to get a toy; object permanence begins, with the **A-not-B error** (searching where an object was found before, not where it was last hidden).
5. **Tertiary circular reactions** (about 12 to 18 months): experimenting with variations ("what if I drop it from higher?").
6. **Mental representation** (about 18 to 24 months): thinking before acting, deferred imitation, pretend play.

:::mnemonic Sensorimotor substages
"**R**eally **P**retty **S**ecrets **C**an **T**ravel **M**iles": reflexes, primary, secondary, coordination, tertiary, mental representation.
:::

### Classic tasks
- **The three mountains task**: a preoperational child, shown a model of three mountains, chooses a picture of their **own** view when asked what a doll on the other side sees (egocentrism).
- **Conservation**: understanding that quantity stays the same when appearance changes. Number, liquid, mass, length, area and volume are mastered at different ages (**horizontal décalage**): number and liquid around 6 to 7, mass a little later, weight around 9 to 10, volume around 11 to 12.
- **Class inclusion**: shown 7 roses and 3 daisies and asked "Are there more roses or more flowers?", preoperational children say "more roses".
- **The pendulum task** (formal operations): what decides how fast a pendulum swings: the length of the string, the weight, the height of release, or the force of the push? Formal thinkers vary **one thing at a time**.

:::widget decide
{
  "scene": "Five-year-old Tanvi watches as two identical glasses are filled with the same amount of juice. She agrees they are the same. Then, in front of her, juice from one glass is poured into a tall, thin glass.",
  "ask": "Predict what Tanvi says when asked which has more juice.",
  "choices": [
    { "label": "“They're the same, because you didn't add any.”", "verdict": "ok", "outcome": "That is the answer of a child who conserves, usually around 7.", "why": "Tanvi is likely preoperational." },
    { "label": "“The tall one has more, because it's higher.”", "verdict": "best", "outcome": "Correct for most five-year-olds.", "why": "She centres on height and ignores width (centration), focuses on how things look now (states rather than transformations), and can't mentally reverse the pouring (irreversibility)." },
    { "label": "“The short one has more, because it's wider.”", "verdict": "ok", "outcome": "Some children say this, centring on width instead.", "why": "Either way, centring on one dimension shows no conservation." }
  ]
}
:::

:::widget conservation
{"kind": "number", "caption": "Spread out one row of coins. The younger child centres on the length of the row; the older child knows nothing was added or taken away."}
:::

:::widget conservation
{"kind": "liquid", "caption": "Pour the water, then switch between a preoperational and a concrete operational child."}
:::

:::widget sort
{
  "prompt": "Which Piagetian stage does each child show?",
  "buckets": ["Sensorimotor", "Preoperational", "Concrete operational", "Formal operational"],
  "items": [
    { "text": "A 9-month-old looks for a toy hidden under a cloth", "bucket": 0 },
    { "text": "A 4-year-old says the moon follows her because it wants to", "bucket": 1, "why": "Animism and egocentrism." },
    { "text": "An 8-year-old arranges sticks from shortest to longest without trial and error", "bucket": 2, "why": "Seriation." },
    { "text": "A 15-year-old argues about what society would be like if nobody needed money", "bucket": 3 },
    { "text": "A 3-year-old pretends a banana is a phone", "bucket": 1 },
    { "text": "A 10-year-old knows a ball of clay weighs the same when rolled into a sausage", "bucket": 2 },
    { "text": "A 14-year-old tests one variable at a time in a science experiment", "bucket": 3 },
    { "text": "A 6-month-old shakes a rattle again and again to hear the sound", "bucket": 0, "why": "A secondary circular reaction." }
  ]
}
:::

### Critiques
1. **Piaget underestimated young children.** When tasks are made simpler or more meaningful, children succeed earlier:
   - **Baillargeon**: with violation-of-expectation methods, infants of a few months seem surprised when objects vanish.
   - **McGarrigle and Donaldson (1974)**, "naughty teddy": when a puppet "accidentally" messed up a row of counters, many more 4 to 6-year-olds conserved number than when the experimenter deliberately changed it. Asking the same question twice, after an adult's deliberate change, may have signalled that the answer should change.
   - **Hughes's policeman doll study**: when hiding a doll from two "policemen" made sense to them, most 3½ to 5-year-olds could take another's view.
2. **Development is less stage-like** than Piaget claimed: décalage, and children's mixed use of strategies, suggest gradual, domain-specific change.
3. **Culture matters**: Pierre Dasen and others found formal operations much less common in some non-schooled communities; conservation appeared earlier in children from pottery-making families, who handle clay daily. Schooling and experience shape the timing.
4. **Social context is underplayed**, which is Vygotsky's critique (section 2.2).
5. **Neo-Piagetian theories** (Robbie Case, Juan Pascual-Leone) kept the stages but explained them by growth in working-memory capacity.

:::clinician
Applications: Piaget's ideas underpin discovery learning, readiness, and activity-based learning (the 'joyful learning' and Nali Kali multi-grade approaches in Indian primary schools draw partly on this tradition). In clinical work, preoperational thinking explains why young children may blame themselves for parental illness or divorce (egocentrism and immanent justice), why explanations of medical procedures must be concrete, and why children under about 7 may not grasp the permanence of death. Formal-operational thinking is required for cognitive therapy's work on abstract beliefs, so CBT with younger children uses concrete tools (thought bubbles, behavioural experiments). Examiners like décalage and the naughty teddy; also cite the McGarrigle and Donaldson figures: about 62% conserved number in the accidental condition against about 16% in the standard condition.
:::

:::recall
1. Distinguish assimilation from accommodation. || Assimilation fits new experience into an existing scheme; accommodation changes the scheme.
2. Name Piaget's four stages with ages. || Sensorimotor (0 to 2), preoperational (2 to 7), concrete operational (7 to 11), formal operational (11 onwards).
3. What is the A-not-B error? || Searching for an object where it was found before, not where it was last hidden.
4. What is horizontal décalage? || Different kinds of conservation are mastered at different ages.
5. What did the naughty teddy study show? || Many more young children conserved when the change was accidental, suggesting Piaget's task underestimated them.
6. Give one cultural finding that challenges Piaget. || Formal operations less common in non-schooled groups; conservation earlier in pottery-making families.
:::

:::mcq
Q: A child shown 7 roses and 3 daisies says there are "more roses than flowers". She lacks:
- Object permanence
- *Class inclusion
- Seriation
- Deferred imitation
> She can't consider the subclass and the whole class at once.

Q: A 14-month-old drops a spoon from different heights to see what happens. In Piaget's terms, this is a:
- *Tertiary circular reaction
- Primary circular reaction
- Secondary circular reaction
- Reflex
> Experimenting with variations.
:::

## 2.2 Vygotsky and information processing [core][beginner]
### Lev Vygotsky (1896 to 1934)
Vygotsky, a Russian psychologist who died young, argued that thinking develops through **social interaction** and **cultural tools** such as language, number systems and writing. What a child can first do **with others**, they later do **alone** (internalisation).

**The zone of proximal development (ZPD)**: the gap between what a child can do **alone** and what they can do **with guidance** from a more knowledgeable other (an adult or a more skilled peer). Teaching works best inside this zone: too easy and the child learns nothing new; too hard and they can't follow, even with help.

:::widget layers
{"title": "The zone of proximal development", "shape": "rings", "layers": [{"label": "Can do alone", "detail": "What the child has already mastered. Teaching here adds little: Ishaan can do a 10-piece jigsaw by himself."}, {"label": "Can do with help: the ZPD", "detail": "What the child can do with guidance from an adult or a more skilled peer. A 30-piece jigsaw with his sister's hints. This is where teaching works best."}, {"label": "Cannot do yet, even with help", "detail": "Too far beyond the child's present skills. A 500-piece jigsaw would only frustrate him."}], "caption": "With scaffolding, today's ZPD becomes tomorrow's 'can do alone', and the zone moves outwards."}
:::

**Scaffolding** (a term introduced by Wood, Bruner and Ross in 1976, building on Vygotsky): temporary support adjusted to the learner's level and gradually withdrawn as competence grows. Good scaffolding includes recruiting interest, simplifying the task, keeping the goal in view, marking key features, controlling frustration, and demonstrating.

**Private speech**: young children talk aloud to themselves while working. Piaget called it **egocentric speech** and saw it as a sign of immature thinking that simply fades. Vygotsky saw it as **self-guidance**: social speech turned inward, which becomes silent **inner speech**. Research by Laura Berk and others supports Vygotsky: children use more private speech on harder tasks, and those who do often perform better.

:::widget decide
{
  "scene": "Ishaan, 6, can do 10-piece jigsaw puzzles alone. With his older sister's hints (“Find the corners first”, “Look for the blue sky pieces”), he can finish 30-piece puzzles. He cannot do a 100-piece puzzle even with help. His teacher wants to give him the right next challenge.",
  "ask": "Which choice fits Vygotsky's ZPD best?",
  "choices": [
    { "label": "Give him more 10-piece puzzles so he feels successful", "verdict": "ok", "outcome": "He finishes quickly but learns nothing new.", "why": "This is below his ZPD: what he can already do alone." },
    { "label": "Give him 25 to 30-piece puzzles with hints that fade as he gets better", "verdict": "best", "outcome": "Within a month he solves 30-piece puzzles alone.", "why": "This is inside his ZPD with scaffolding that is gradually withdrawn." },
    { "label": "Give him the 100-piece puzzle to stretch him", "verdict": "harm", "outcome": "He gives up in frustration and refuses puzzles for weeks.", "why": "Beyond the ZPD, even help can't bridge the gap." }
  ]
}
:::

**Guided participation** (Barbara Rogoff): children learn by taking part in cultural activities alongside adults, from the margins inwards, like apprentices. Rogoff and colleagues (1993) compared toddlers and caregivers in communities in **Guatemala, India, Turkey and the United States**, showing that how adults guide children differs with culture: in some communities children learn more by close observation of ongoing adult work than by explicit, adult-led lessons.

:::example Teaching at the right level: an Indian application
The NGO Pratham's annual **ASER** surveys showed that many Indian children in Class 5 could not read a Class 2 text. In 2024, about **27%** of Class 3 children in rural India could read at Class 2 level. Pratham's **Teaching at the Right Level** approach groups children by their **current** level for part of the day, rather than by their class, and teaches just above it: a large-scale application of ZPD-like thinking. Randomised evaluations in Bihar, Uttar Pradesh and elsewhere found clear gains in basic reading and arithmetic.
:::

### Piaget and Vygotsky compared
| | Piaget | Vygotsky |
|---|---|---|
| Child as | Lone scientist | Apprentice in a culture |
| Drives development | Individual discovery, equilibration | Social interaction, cultural tools |
| Language | Reflects thought | Shapes thought |
| Private speech | Egocentric, fades | Self-guidance, becomes inner speech |
| Learning and development | Development comes first; learning follows readiness | Learning leads development (within the ZPD) |
| Stages | Universal stages | No fixed stages; development depends on culture |

:::widget compare
{"title": "Piaget and Vygotsky", "a": {"label": "Piaget", "points": ["The child as a lone scientist", "Development drives learning", "Language reflects thought", "Private speech is egocentric and fades", "Universal stages"], "summary": "Piaget: the child builds understanding by acting on the world."}, "b": {"label": "Vygotsky", "points": ["The child as an apprentice in a culture", "Learning, within the ZPD, leads development", "Language shapes thought", "Private speech becomes inner speech", "Development depends on culture and tools"], "summary": "Vygotsky: understanding begins between people and is then taken inside."}}
:::

### Information processing
Information-processing approaches compare the mind to a computer that **takes in, stores and uses** information, and ask how its capacity and efficiency grow. Change is mostly **gradual**, not stage-like.
- **Processing speed** increases steadily through childhood and adolescence (Robert Kail).
- **Working memory** capacity grows: a 4-year-old can hold about 2 to 3 digits; an adolescent about 7.
- **Executive functions** (Adele Diamond): **inhibitory control** (stopping an automatic response), **working memory** and **cognitive flexibility** (switching between rules). They develop with the prefrontal cortex into the twenties and predict school success.
- **Memory strategies**: **rehearsal**, **organisation** (grouping), **elaboration** (making links). Young children show a **production deficiency** (they don't use a strategy spontaneously, though they can if told) and a **utilisation deficiency** (using a new strategy without benefit at first).
- **Metacognition**: knowing about one's own thinking ("I need to read this twice").
- **Siegler's overlapping waves**: children use several strategies at once, and the better ones gradually become more common.

### Theory of mind
**Theory of mind** is understanding that people have beliefs, desires and intentions that may differ from one's own and from reality. It is tested with **false-belief** tasks.

:::widget guess
{
  "prompt": "In the Sally-Anne task, Sally puts her marble in a basket and leaves. Anne moves it to a box. Where will Sally look when she returns? By about what age do most typically developing children answer correctly (“in the basket”)?",
  "min": 1,
  "max": 10,
  "unit": "years",
  "answer": [4, 5],
  "reveal": "By about **4 to 5 years** most children pass; younger children usually say “in the box” (where it really is). In the classic study by Baron-Cohen, Leslie and Frith (1985), about 85% of typically developing children and children with Down syndrome passed, but only about 20% of autistic children of higher mental age.",
  "clinician": "A 2001 meta-analysis found a consistent developmental shift around age 4 across cultures, with some variation in timing. Infant 'implicit' false-belief findings using anticipatory looking have had replication difficulties in large multi-lab studies, so their interpretation remains debated. Theory-of-mind difficulties in autism are real at group level but neither universal nor specific, and newer accounts emphasise differences in social motivation and the 'double empathy problem' (Milton)."
}
:::

:::clinician
Executive function interventions: Adele Diamond's 2011 review found that programmes such as Tools of the Mind (a Vygotskian preschool curriculum built on play planning and private speech), mindfulness and some sports improve executive functions, with gains largest in children who start lowest, though later trials of Tools of the Mind had mixed results. Computerised working-memory training (for example, Cogmed) improves trained tasks but shows little transfer to academic or ADHD outcomes in meta-analyses (Melby-Lervåg and Hulme). The scarcity literature shows that poverty-related worry temporarily reduces measured cognitive capacity in Indian farmers, a reminder that information-processing performance is state-dependent. For assessment, Indian adaptations of executive function tests (for example, in the NIMHANS Neuropsychology Battery for Children) should be used with local norms.
:::

:::recall
1. Define the zone of proximal development. || The gap between what a child can do alone and what they can do with guidance.
2. What is scaffolding, and who named it? || Temporary, adjustable support withdrawn as competence grows; Wood, Bruner and Ross (1976).
3. How did Piaget and Vygotsky differ on private speech? || Piaget: egocentric, fades. Vygotsky: self-guidance that becomes inner speech.
4. Name the three core executive functions. || Inhibitory control, working memory, cognitive flexibility.
5. What is a production deficiency? || Not using a strategy spontaneously, though able to when prompted.
6. By what age do most children pass false-belief tasks? || About 4 to 5 years.
:::

:::mcq
Q: Which statement would Vygotsky most agree with?
- Development must come before learning can occur
- Children develop best when left to discover alone
- *Learning within the ZPD leads development
- Language only reflects thought already formed
> For Vygotsky, guided learning pulls development forward.
:::

## 2.3 Erikson's eight stages and identity [core][beginner]
Erik Erikson (1902 to 1994), a psychoanalyst trained by Anna Freud, extended Freud's stages across the **whole lifespan** and emphasised **social** relationships and culture rather than sexual drives. His theory is **psychosocial**. Each stage has a **crisis** (a turning point) between two poles; resolving it in a mostly positive direction gives a **virtue** (basic strength). Earlier resolutions affect later ones (the **epigenetic principle**: each stage has its time of special ascendancy, but all are present in some form throughout).

| Stage | Age (roughly) | Crisis | Virtue | Key relationship |
|---|---|---|---|---|
| 1 | Infancy (0 to 1) | **Trust versus mistrust** | Hope | Mother or main caregiver |
| 2 | Early childhood (1 to 3) | **Autonomy versus shame and doubt** | Will | Parents |
| 3 | Play age (3 to 6) | **Initiative versus guilt** | Purpose | Family |
| 4 | School age (6 to 12) | **Industry versus inferiority** | Competence | Neighbourhood, school |
| 5 | Adolescence (12 to about 18) | **Identity versus role confusion** | Fidelity | Peer groups, role models |
| 6 | Young adulthood | **Intimacy versus isolation** | Love | Partners, friends |
| 7 | Middle adulthood | **Generativity versus stagnation** | Care | Household, workmates |
| 8 | Late adulthood | **Integrity versus despair** | Wisdom | Humankind |

:::widget timeline
{"prompt": "Put Erikson's eight psychosocial crises in the order they arise across life.", "events": [{"label": "Trust versus mistrust (hope)", "when": "0 to 1"}, {"label": "Autonomy versus shame and doubt (will)", "when": "1 to 3"}, {"label": "Initiative versus guilt (purpose)", "when": "3 to 6"}, {"label": "Industry versus inferiority (competence)", "when": "6 to 12"}, {"label": "Identity versus role confusion (fidelity)", "when": "12 to 18"}, {"label": "Intimacy versus isolation (love)", "when": "Young adult"}, {"label": "Generativity versus stagnation (care)", "when": "Middle adult"}, {"label": "Integrity versus despair (wisdom)", "when": "Late adult"}], "why": "Each crisis builds on the last. A child who never resolves trust, for example, meets later crises with less hope. Use the mnemonic for the virtues: Hope Will Push Children Forward; Love, Care, Wisdom."}
:::

:::mnemonic Erikson's virtues in order
"**H**ope **W**ill **P**ush **C**hildren **F**orward; **L**ove, **C**are, **W**isdom": hope, will, purpose, competence, fidelity, love, care, wisdom.
:::

:::widget sort
{
  "prompt": "Which Erikson crisis is most active?",
  "buckets": ["Autonomy vs shame", "Industry vs inferiority", "Identity vs role confusion", "Generativity vs stagnation", "Integrity vs despair"],
  "items": [
    { "text": "A 2-year-old insists, “Me do it!”, and wants to feed herself", "bucket": 0 },
    { "text": "A 9-year-old feels useless because he can't keep up in maths", "bucket": 1 },
    { "text": "A 17-year-old tries out different styles, friends and career ideas, unsure who she is", "bucket": 2 },
    { "text": "A 50-year-old teacher mentors young colleagues and feels he is leaving something behind", "bucket": 3 },
    { "text": "An 80-year-old reviews his life and feels at peace with it", "bucket": 4 },
    { "text": "A 75-year-old feels bitter that life was wasted and it is too late to change", "bucket": 4 }
  ]
}
:::

### Identity in adolescence: Marcia's statuses
James Marcia (1966) turned Erikson's identity crisis into measurable **statuses**, based on two questions: has the person **explored** alternatives (crisis), and have they made a **commitment**?
| | Commitment: yes | Commitment: no |
|---|---|---|
| **Exploration: yes** | **Identity achievement**: explored and chose | **Moratorium**: actively exploring, not yet committed |
| **Exploration: no** | **Foreclosure**: committed without exploring (often to parents' choices) | **Identity diffusion**: neither exploring nor committed |
Moratorium is often anxious but healthy; diffusion is linked with apathy and poorer adjustment. Statuses can change, and a person can be achieved in one area (career) and foreclosed in another (religion).

:::widget sort
{
  "prompt": "Which identity status does each young person show?",
  "buckets": ["Achievement", "Moratorium", "Foreclosure", "Diffusion"],
  "items": [
    { "text": "Rohan, 20, is studying medicine because his father and grandfather were doctors; he never considered anything else", "bucket": 2 },
    { "text": "Zara, 21, tried journalism and law internships, then chose clinical psychology after much thought", "bucket": 0 },
    { "text": "Abhi, 19, says, “Career? Don't know, don't care,” and drifts between activities", "bucket": 3 },
    { "text": "Neha, 22, is taking a gap year, volunteering and researching three different careers before deciding", "bucket": 1 },
    { "text": "Kiran, 23, holds firmly to his family's political views without ever having questioned them", "bucket": 2 },
    { "text": "Simran, 24, after questioning her faith in college, has chosen her own way of practising it", "bucket": 0 }
  ]
}
:::

:::trap Foreclosure in India is not automatically unhealthy
In families and communities where careers, religion and marriage are shared decisions, a committed choice made without wide personal exploration can be **satisfying and stable**. Marcia's model came from American college men. Ask whether the person is **content and flexible** with the commitment, not only whether they explored.
:::

### Evaluation
- **Strengths**: covers the whole lifespan; integrates culture; generated identity research; useful clinically.
- **Weaknesses**: stage ages are loose; concepts are hard to measure; the model reflects Western, male, middle-class lives; the order of identity and intimacy may differ for many women (Gilligan) and in cultures where marriage comes before personal identity exploration.
- Erikson also wrote psychobiographies, including a study of Gandhi's life and the 1918 Ahmedabad mill strike (1969), which won the Pulitzer Prize.

:::clinician
Joan Erikson later proposed a ninth stage for the very old, in which earlier crises are revisited under the pressure of physical decline, and drew on Lars Tornstam's idea of gerotranscendence (a shift from a materialistic and rational view to a more cosmic and transcendent one, with less interest in superficial social contact). Identity research has moved to process models (Luyckx's dimensions of exploration in breadth and depth, commitment making and identification with commitment, and ruminative exploration, which predicts depression). Eriksonian ideas are clinically useful in adolescent and young adult work: identity distress, and the role-confusion versus identity-diffusion distinction, are relevant to differentiating normal adolescent turmoil from emerging personality pathology (Kernberg's identity diffusion is a different, structural concept). In Indian clinical work, Kakar's and Saraswathi's writings note that identity is often negotiated within the family, so the clinician's question is less "what do you want?" than "how do you and your family each see this choice?".
:::

:::recall
1. List Erikson's eight crises in order. || Trust-mistrust, autonomy-shame, initiative-guilt, industry-inferiority, identity-role confusion, intimacy-isolation, generativity-stagnation, integrity-despair.
2. What is the virtue of stage 5? || Fidelity.
3. What is the epigenetic principle? || Each stage has its time of special importance, but all are present in some form throughout life.
4. Name Marcia's four statuses and the two dimensions. || Achievement, moratorium, foreclosure, diffusion; exploration and commitment.
5. Which status involves commitment without exploration? || Foreclosure.
:::

:::mcq
Q: In Erikson's theory, a school-age child who keeps failing at tasks valued by teachers and peers is at risk of:
- Shame and doubt
- *Inferiority
- Guilt
- Role confusion
> Industry versus inferiority, the crisis of school age.
:::

## 2.4 Attachment and temperament [core][beginner]
Attachment is the deep, lasting emotional bond a child forms with the people who care for them. This section gives the developmental picture; **Psychodynamics in depth** covers the Adult Attachment Interview and clinical work in more detail.

:::widget figure
{"id": "harlow-mothers"}
:::

### Where the bond comes from
- **Psychoanalytic and learning theories** said babies love whoever **feeds** them (cupboard love).
- **Konrad Lorenz** showed imprinting in birds happens without feeding.
- **Harry Harlow** tested this in rhesus monkeys.

:::widget decide
{
  "scene": "Harlow (1958) raised infant rhesus monkeys with two surrogate 'mothers' in their cage: one made of bare wire that held a feeding bottle, and one covered in soft terry cloth that gave no milk.",
  "ask": "Predict where the infant monkeys spent most of their time, and where they ran when frightened.",
  "choices": [
    { "label": "With the wire mother that fed them, in both cases", "verdict": "ok", "outcome": "That is what cupboard-love theory predicted, but it was wrong.", "why": "Feeding did not create the bond." },
    { "label": "Clinging to the cloth mother most of the day, going to the wire mother only to feed, and running to the cloth mother when frightened", "verdict": "best", "outcome": "Correct. The cloth mother was the source of comfort and a secure base for exploring.", "why": "Contact comfort, not food, was central to the bond. Monkeys raised alone or with only surrogates later showed severe social and parenting problems, which also made these studies a landmark in debates about animal research ethics." },
    { "label": "Split their time equally", "verdict": "ok", "outcome": "The preference for the cloth mother was strong.", "why": "Infants spent most of each day on the cloth mother." }
  ]
}
:::

### Bowlby's phases of attachment
John Bowlby described four phases:
1. **Pre-attachment** (the first couple of months): the baby signals (crying, grasping, gazing) to anyone, and is comforted by adults in general.
2. **Attachment in the making** (until about 6 to 8 months): the baby responds differently to familiar people and smiles more at them.
3. **Clear-cut attachment** (about 6 to 8 months to 18 to 24 months): the baby protests when the attachment figure leaves (**separation anxiety**), is wary of strangers (**stranger anxiety**), and uses the figure as a **secure base**.
4. **Formation of a reciprocal relationship** (from about 18 to 24 months): language and understanding of others let the child negotiate ("I'll be back after lunch").
Bowlby also described **monotropy** (one main attachment figure) and the **maternal deprivation hypothesis**. Later research rejected strict monotropy: children form **multiple** attachments, and quality matters more than who provides it. Michael Rutter separated **privation** (never forming a bond) from **deprivation** (losing one).

:::widget timeline
{"prompt": "Put Bowlby's phases of attachment in order.", "events": [{"label": "Pre-attachment: signals to anyone, comforted by any adult", "when": "First months"}, {"label": "Attachment in the making: smiles more at familiar people", "when": "To 6 to 8 mo"}, {"label": "Clear-cut attachment: separation and stranger anxiety, a secure base", "when": "6 to 8 mo to 2 yrs"}, {"label": "Reciprocal relationship: can negotiate a parent's leaving", "when": "2 yrs on"}], "why": "Separation and stranger anxiety arrive together with clear-cut attachment, which is why a 9-month-old often protests at a new carer while a 3-month-old does not."}
:::

:::clinician
Bowlby's phase timings, with weeks as usually stated: pre-attachment from birth to about 6 weeks; attachment in the making from about 6 weeks to 6 to 8 months; clear-cut from 6 to 8 months to 18 months to 2 years; reciprocal relationship from about 18 months to 2 years onwards. Schaffer and Emerson's Glasgow study (1964) found that by 18 months most infants had multiple attachments, and that the main attachment figure was the person most responsive to the infant, not necessarily the one who fed or spent most time with them; at about a third of infants, the main attachment was to someone other than the mother.
:::

### Ainsworth's Strange Situation
Mary Ainsworth's laboratory procedure for children of about 12 to 18 months has a series of short episodes in which the parent leaves and returns, and a stranger enters. The **reunions** matter most for classification.
| Pattern | At separation | At reunion | Typical caregiving |
|---|---|---|---|
| **Secure (B)** | Often upset, uses the parent as a secure base before | Seeks contact, is comforted, returns to play | Sensitive, responsive |
| **Insecure-avoidant (A)** | Little visible distress | Ignores or turns away from the parent | Rejecting or emotionally unavailable |
| **Insecure-resistant (ambivalent) (C)** | Very distressed | Seeks contact but resists it angrily; hard to comfort | Inconsistent |
| **Disorganised (D)** (added by Main and Solomon) | Contradictory, confused | Freezing, approaching with head turned away, fearful | Frightening or frightened caregiving, unresolved trauma, maltreatment |

:::widget strange
{}
:::

:::widget sort
{"prompt": "In the Strange Situation, which attachment pattern does each 14-month-old show?", "buckets": ["Secure", "Insecure-avoidant", "Insecure-resistant", "Disorganised"], "items": [{"text": "Cries when mother leaves; on her return reaches for her, calms within a minute and goes back to the toys", "bucket": 0, "why": "Upset, comforted, returns to exploring: the parent works as a secure base."}, {"text": "Barely looks up when mother leaves; on her return keeps playing and turns away from her", "bucket": 1, "why": "Little visible distress and active avoidance at reunion. The body is often still stressed."}, {"text": "Extremely upset; on reunion clings to mother, then arches and kicks her, and cannot settle", "bucket": 2, "why": "Seeks contact and resists it at the same time."}, {"text": "On reunion walks towards mother with his head turned away, then freezes in place", "bucket": 3, "why": "Contradictory, frightened behaviour with no clear strategy. Linked to frightening caregiving or a parent's unresolved trauma."}, {"text": "Plays happily with the stranger present, glancing at mother from time to time, and greets her warmly on return", "bucket": 0, "why": "Using the parent as a base and welcoming the reunion."}]}
:::

:::widget guess
{
  "prompt": "In large studies of middle-class samples in many countries, roughly what percentage of infants are classified as securely attached?",
  "min": 0,
  "max": 100,
  "unit": "%",
  "answer": [55, 72],
  "reveal": "About **60 to 70%**. Avoidant is usually around 15 to 25%, resistant around 10 to 15%, and disorganised around 15% in low-risk samples (much higher in maltreated children). Secure is the most common pattern in almost every culture studied.",
  "clinician": "A 1988 cross-cultural meta-analysis (32 studies in 8 countries) found variation within countries larger than between them; avoidant classifications were relatively more common in some western European samples, resistant in some Israeli kibbutz and Japanese samples. Disorganised attachment rates rise to the majority in maltreated samples. Attachment classifications show moderate stability; changes follow changes in caregiving and family stress."
}
:::

Long-term studies (for example, the Minnesota longitudinal study led by Alan Sroufe) link secure attachment with better emotion regulation, peer relationships and lower rates of later problems, while disorganised attachment is the strongest attachment predictor of later psychopathology. Adult attachment styles, as described by Cindy Hazan and Phillip Shaver, apply similar ideas to romantic relationships.

:::widget figure
{"id": "strange-situation-room"}
:::

### Temperament
**Temperament** is a baby's inborn style of reacting and regulating: how active, intense, moody or adaptable they are. It is the early, biologically based core of later personality.

**Thomas and Chess's New York Longitudinal Study** (from 1956) rated babies on nine dimensions: **activity level**, **rhythmicity** (regularity of sleep and feeding), **approach or withdrawal** to new things, **adaptability**, **intensity** of reactions, **mood** (positive or negative), **attention span and persistence**, **distractibility** and **sensory threshold**. They found three main types:
- **Easy**: regular, positive, adapts quickly to new situations.
- **Difficult**: irregular, intense, negative, slow to adapt.
- **Slow-to-warm-up**: low activity, mildly negative, withdraws at first but adapts gradually.

:::widget guess
{
  "prompt": "In the New York Longitudinal Study, what percentage of children were classed as 'difficult'?",
  "min": 0,
  "max": 60,
  "unit": "%",
  "answer": [8, 12],
  "reveal": "About **10%**. About **40%** were easy, **15%** slow-to-warm-up, and the remaining **35%** didn't fit any one type: a reminder that most children are mixtures.",
  "clinician": "Thomas and Chess followed 133 children into adulthood. Their key clinical idea, goodness of fit, has influenced parent guidance and child psychiatry; 'difficult' temperament predicted later behaviour problems mainly when parenting was harsh or inconsistent. Modern models (Rothbart) use three broad dimensions with better psychometric support: surgency or extraversion, negative affectivity, and effortful control, the last closely related to executive function and to conscientiousness in adulthood."
}
:::

**Goodness of fit**: what matters is not the temperament alone but the **match** between the child's temperament and the demands and expectations of the environment. A very active child may thrive in a family that loves outdoor play and struggle in a small flat with parents who value quiet.

**Jerome Kagan's behavioural inhibition**: about a fifth of infants are highly reactive to novelty and become shy, cautious children, with a raised risk of later social anxiety.

:::example Attachment in Indian families
In many Indian homes, infants are cared for by grandparents, aunts, older siblings and domestic workers as well as parents, and co-sleeping is the norm. Children often form **secure attachments to several caregivers**. In clinical assessment, ask **who actually cares for the child, day and night**, and whether care is consistent, before drawing conclusions about attachment from the mother alone.
:::

:::recall
1. What did Harlow's monkeys show? || Contact comfort, not feeding, is central to attachment.
2. Name Bowlby's four phases of attachment. || Pre-attachment, attachment in the making, clear-cut attachment, reciprocal relationship.
3. Describe the four attachment patterns at reunion. || Secure seeks and is comforted; avoidant ignores; resistant seeks but resists angrily; disorganised shows contradictory or fearful behaviour.
4. Name Thomas and Chess's three temperament types with their percentages. || Easy (40%), difficult (10%), slow-to-warm-up (15%), with 35% unclassified.
5. What is goodness of fit? || The match between a child's temperament and the environment's demands.
:::

:::mcq
Q: A toddler is very distressed when his mother leaves, but when she returns he clings to her and then pushes her away angrily, and cannot be comforted. His pattern is:
- Secure
- Avoidant
- Disorganised (type D)
- *Insecure-resistant
> Contact-seeking mixed with angry resistance at reunion.
:::

## 2.5 Moral development [core][beginner]
How do children come to know right from wrong, and act on it? Theories look at **moral reasoning** (thinking), **moral emotions** (guilt, empathy) and **moral behaviour**.

### Piaget: from rules as fixed to rules as agreements
Piaget (1932) watched children play marbles and told them pairs of stories.
- **Heteronomous morality** (moral realism; roughly 4 to 7, overlapping with later years): rules are fixed and come from authority; wrongness is judged by **consequences**, not intentions; **immanent justice** (punishment follows wrongdoing automatically: "I fell because I lied").
- **Autonomous morality** (from about 10): rules are social agreements that can be changed; **intentions** matter; punishment should fit the wrong (reciprocity).
Between them is a transitional period. Peer interaction (between equals), more than adult authority, drives the shift.

:::widget decide
{
  "scene": "Piaget told children two stories. John, called for dinner, opens a door and accidentally knocks over a tray behind it, breaking 15 cups. Henry, trying to reach jam his mother forbade him to eat, knocks over and breaks 1 cup.",
  "ask": "Predict what most children of about 6 said about who was naughtier.",
  "choices": [
    { "label": "Henry, because he was doing something forbidden", "verdict": "ok", "outcome": "That is what older children (about 9 or 10 and up) usually said.", "why": "Judging by intention is autonomous morality." },
    { "label": "John, because he broke more cups", "verdict": "best", "outcome": "Correct for most younger children.", "why": "Heteronomous morality judges by the size of the consequences. Later research showed even young children can weigh intentions when stories make intentions clear and consequences equal, so Piaget's method underestimated them." },
    { "label": "Neither; both were accidents", "verdict": "ok", "outcome": "Young children rarely saw it that way.", "why": "Henry's act was not an accident; the story contrasts accident with misbehaviour." }
  ]
}
:::

### Kohlberg: three levels, six stages
Lawrence Kohlberg built on Piaget using dilemmas such as **Heinz** stealing a drug to save his dying wife. The **reasoning** given, not the answer, determines the stage.
| Level | Stage | Basis of "right" |
|---|---|---|
| **Preconventional** (most children under 9) | 1. Punishment and obedience | Avoid punishment |
| | 2. Individualism and exchange | Serve your own interests; fair deals |
| **Conventional** (most adolescents and adults) | 3. Good interpersonal relationships | Be a "good person" in others' eyes |
| | 4. Maintaining the social order | Laws and duties keep society going |
| **Postconventional** (a minority of adults) | 5. Social contract and individual rights | Laws should serve welfare and rights; they can be changed |
| | 6. Universal ethical principles | Self-chosen principles of justice and human dignity |

Key claims and findings:
- Stages are an **invariant sequence**: people move through them in order, without skipping, and rarely go backwards. Colby and colleagues' **20-year longitudinal study** (1983) of Kohlberg's original boys supported this.
- Reasoning advances through **cognitive development** (formal operations help with stages 5 and 6) and **role-taking** opportunities, and through exposure to reasoning **one stage above** one's own (the "plus-one" effect, used in classroom moral discussion programmes and "just community" schools).
- **Stage 6** was so rare that Kohlberg later dropped it from scoring.

:::widget sort
{"prompt": "Heinz has stolen a drug to save his dying wife. Which of Kohlberg's levels does each reason come from?", "buckets": ["Preconventional", "Conventional", "Postconventional"], "items": [{"text": "'He shouldn't steal, because he'll be caught and sent to jail.'", "bucket": 0, "why": "Stage 1: avoiding punishment."}, {"text": "'He should steal it. If she lives, she can look after him.'", "bucket": 0, "why": "Stage 2: what is in his own interest, a fair exchange."}, {"text": "'A good husband would steal it. People would think he was heartless if he didn't.'", "bucket": 1, "why": "Stage 3: being good in others' eyes."}, {"text": "'He shouldn't. If everyone broke the law when they felt like it, society would collapse.'", "bucket": 1, "why": "Stage 4: maintaining the social order."}, {"text": "'He should. The right to life comes before property, and laws exist to protect people's welfare.'", "bucket": 2, "why": "Stage 5: laws serve rights and can be overridden."}, {"text": "'Any life has a value above any law, whatever others think.'", "bucket": 2, "why": "Stage 6: universal ethical principles."}]}
:::

### Criticisms
- **Gilligan's ethic of care** (1982): Kohlberg's original sample was all male, and his scoring placed care-based reasoning (common in women's answers) at stage 3. She proposed a care orientation: **survival** (caring for self), **goodness as self-sacrifice** (caring for others), and the **morality of non-violence** (caring for self and others). Meta-analysis later found only **small** gender differences.
- **Culture**: postconventional reasoning is rare outside urban, educated samples (Snarey). In **Bhubaneswar**, Shweder and colleagues found Indian children and adults treated many duties and purity rules as moral, not merely conventional, which Kohlberg's justice focus misses.
- **Reasoning versus behaviour**: moral reasoning predicts behaviour only modestly; emotions and situation matter (recall the Good Samaritan study in **Social psychology**).

### Other approaches
- **Elliot Turiel's domain theory**: by about age 3 or 4, children distinguish **moral** rules (about harm and fairness: hitting is wrong even if a teacher allows it) from **social conventions** (wearing a uniform: wrong only because the school says so) and **personal** matters.
- **Nancy Eisenberg's prosocial reasoning**: children's reasons for helping move from **hedonistic** (what's in it for me) through **needs-oriented** and **approval-oriented** to **empathic** and **internalised** reasons.
- **Martin Hoffman's empathy development**: from global empathy in infants (crying when another baby cries), through egocentric and then more accurate empathy, to empathy for another's general life condition. **Induction** (explaining to a child how their behaviour affected others) builds empathy and moral internalisation better than power assertion or love withdrawal.

:::widget sort
{
  "prompt": "Turiel's domains: is this a moral rule or a social convention?",
  "buckets": ["Moral", "Social convention"],
  "items": [
    { "text": "Don't hit your little brother", "bucket": 0 },
    { "text": "Call your teacher “ma'am”", "bucket": 1 },
    { "text": "Don't take another child's tiffin", "bucket": 0 },
    { "text": "Wear the school uniform on Mondays", "bucket": 1 },
    { "text": "Don't tease the new girl until she cries", "bucket": 0 },
    { "text": "Eat with your right hand at a family meal", "bucket": 1, "why": "In many Indian families this feels like a strong rule, and children may treat it as moral, which is exactly the cultural point Shweder made." }
  ]
}
:::

:::clinician
Kohlberg's stages and the Heinz dilemma appear in every developmental and personality exam; for depth, cite the Moral Judgment Interview and Rest's Defining Issues Test (which measures recognition and preference rather than production, so it yields earlier and more frequent 'principled' scores). Haidt's social intuitionist model and moral foundations (care, fairness, loyalty, authority, sanctity, liberty) are covered in the Theories of personality module. Clinically, moral development links to conduct problems (deficits in guilt and empathy, callous-unemotional traits), to OCD (scrupulosity and inflated responsibility), and to parenting guidance: induction-based discipline is associated with better moral internalisation than harsh or love-withdrawing discipline (Hoffman), and Grazyna Kochanska's research shows that a mutually responsive orientation between parent and child fosters committed compliance and conscience, moderated by temperament (fearful children respond to gentle discipline, fearless children to a warm, close relationship).
:::

:::recall
1. Contrast heteronomous and autonomous morality. || Heteronomous: fixed rules from authority, judged by consequences, immanent justice. Autonomous: rules as agreements, intentions matter.
2. Name Kohlberg's three levels. || Preconventional, conventional, postconventional.
3. What did Colby and colleagues' 20-year study show? || Stages followed an invariant sequence.
4. What are Gilligan's three levels of care? || Survival, goodness as self-sacrifice, morality of non-violence.
5. What is Turiel's domain theory? || Children distinguish moral rules (harm, fairness) from social conventions and personal matters from early childhood.
6. What kind of discipline best builds empathy, according to Hoffman? || Induction: explaining how one's behaviour affects others.
:::

:::mcq
Q: A 5-year-old who falls off her bicycle says, "That happened because I told a lie this morning." Piaget called this:
- *Immanent justice
- Autonomous morality
- Reciprocity
- Moral relativism
> The belief that punishment follows wrongdoing automatically.
:::

## 2.6 Language, emotional and social development [core][beginner]

:::widget figure
{"id": "language-areas"}
:::

### Language milestones
| Approximate age | Milestone |
|---|---|
| About 2 months | **Cooing** (vowel-like sounds) |
| About 6 months | **Babbling** (consonant-vowel strings: "ba-ba-ba") |
| About 9 to 12 months | **Gestures** (pointing), understanding of familiar words |
| About 12 months | **First words** (holophrases: one word for a whole idea, "milk!") |
| About 18 months | **Vocabulary spurt** (after about 50 words) |
| About 18 to 24 months | **Two-word sentences**, **telegraphic speech** ("Daddy go") |
| 3 to 5 years | Grammar develops fast; **overregularisation** ("I goed", "two mouses") shows the child is applying rules |
Children also show **fast mapping** (learning a word's meaning after one or two exposures), **overextension** (calling all four-legged animals "dog") and **underextension** (only their own pet is a "dog").

### Theories of language
| Theory | Key idea | Evidence for | Against |
|---|---|---|---|
| **Learning (Skinner)** | Language is learnt by imitation and reinforcement | Children learn the language they hear | Parents rarely correct grammar; children say things they have never heard ("goed") |
| **Nativist (Chomsky)** | A **language acquisition device (LAD)** and **universal grammar** are inborn | Universal milestones; fast learning; creativity; critical period evidence | The LAD is hard to define or test |
| **Interactionist** (Bruner and others) | Biology plus social interaction; Bruner's **language acquisition support system (LASS)**: routines, child-directed speech, joint attention | Child-directed speech helps; joint attention predicts vocabulary | Doesn't fully explain grammar |
| **Statistical learning** | Infants extract patterns from the speech they hear | Saffran, Aslin and Newport (1996): 8-month-olds detected word boundaries from syllable patterns after about 2 minutes of listening | Debated how far it explains grammar |

:::widget guess
{
  "prompt": "Werker and Tees (1984) tested whether babies from English-speaking homes in Canada could tell apart two Hindi 't' sounds that English doesn't distinguish (dental and retroflex). At 6 to 8 months most could. By about what age (in months) had most lost this ability?",
  "min": 6,
  "max": 36,
  "unit": "months",
  "answer": [10, 12],
  "reveal": "By about **10 to 12 months**, most English-learning babies could no longer tell the Hindi sounds apart, while Hindi-learning babies kept the ability. This is **perceptual narrowing**: infants tune into the sounds of their own language(s) in the first year.",
  "clinician": "Werker and Tees also tested a Salish (Nthlakampx) contrast with the same pattern. Perceptual narrowing also occurs for faces (other-race and other-species faces) in the first year, and early bilingual exposure keeps more contrasts available. Kuhl's work shows that live social interaction, not video, maintains a foreign contrast in 9-month-olds."
}
:::

**Critical period for language**: Lenneberg argued language is easiest to learn before puberty. Evidence includes **Genie**, found in 1970 at 13 after extreme isolation, who learnt many words but never mastered grammar (though her case is confounded by trauma and possible disability), and Johnson and Newport's (1989) finding that immigrants who arrived in the United States after about age 7 showed lower grammar proficiency the older they arrived. It is better described as a **sensitive** period.

**Multilingual India**: most Indian children grow up hearing two or more languages. Bilingualism does not delay language overall, though vocabulary in each language may be smaller at first. The **National Education Policy 2020** recommends teaching in the home language or mother tongue at least until Class 5, wherever possible, because children learn concepts best in a language they understand. Claims of a large "bilingual advantage" in executive function have weakened in larger studies, but bilingualism's cultural and practical benefits are clear.

### Emotional development
- **Primary emotions** (joy, interest, distress, disgust, anger, fear, surprise, sadness) appear in the first months. The **social smile** (smiling at faces) appears at about 2 months.
- **Stranger anxiety** appears around 8 to 9 months; **separation anxiety** peaks around 12 to 18 months.
- **Social referencing**: from about 9 to 12 months, babies look at a caregiver's face to decide how to react to something uncertain.

:::widget decide
{
  "scene": "Sorce and colleagues (1985) placed 1-year-olds on a visual cliff with a moderate, uncertain drop. Their mother stood on the far side and, as instructed, made either a happy face or a fearful face.",
  "ask": "Predict what happened.",
  "choices": [
    { "label": "Babies crossed or refused regardless of the mother's face", "verdict": "ok", "outcome": "The mother's face made a huge difference.", "why": "With an uncertain drop, babies looked to her for information." },
    { "label": "Most babies crossed when the mother looked happy, and none crossed when she looked afraid", "verdict": "best", "outcome": "Correct. About three-quarters crossed to a happy face; none crossed to a fearful one.", "why": "This is social referencing: by the end of the first year, babies use caregivers' emotions to interpret uncertain situations. It is one reason an anxious parent's reactions can shape a child's fears." },
    { "label": "Babies crossed more often when the mother looked afraid, to reach her", "verdict": "ok", "outcome": "The opposite happened.", "why": "Fear signals danger, and babies read it." }
  ]
}
:::

- **Self-recognition**: in the **rouge test**, a dab of red is put on a baby's nose; babies who touch their own nose (not the mirror) recognise themselves. Most do between 18 and 24 months.
- **Self-conscious emotions** (embarrassment, pride, shame, guilt) follow self-recognition, around 18 to 24 months and beyond.
- **Emotion regulation** develops from relying on caregivers (co-regulation) to self-regulation through childhood.

### Social development
**Parten's stages of play** (1932):
| Type | What it looks like |
|---|---|
| **Unoccupied** | Watching anything interesting, not playing |
| **Solitary** | Playing alone |
| **Onlooker** | Watching others play, perhaps talking, but not joining |
| **Parallel** | Playing beside others with similar toys, but not together |
| **Associative** | Playing together, sharing, but without a common goal or roles |
| **Cooperative** | Organised play with shared goals and roles (a game of house, cricket with teams) |

**Parenting styles** (Diana Baumrind, with Maccoby and Martin's fourth style), based on two dimensions, **demandingness** (control, expectations) and **responsiveness** (warmth):
| | High responsiveness | Low responsiveness |
|---|---|---|
| **High demandingness** | **Authoritative**: warm, clear rules, explains reasons, listens | **Authoritarian**: strict, "because I said so", little warmth |
| **Low demandingness** | **Permissive (indulgent)**: warm, few rules | **Neglectful (uninvolved)**: little warmth or control |
In many Western studies, authoritative parenting predicts the best outcomes and neglectful the worst.

:::widget sort
{
  "prompt": "Which parenting style is this?",
  "buckets": ["Authoritative", "Authoritarian", "Permissive", "Neglectful"],
  "items": [
    { "text": "“Phone off at 9 because sleep matters for exams. If you have a good reason, tell me and we'll discuss it.”", "bucket": 0 },
    { "text": "“No discussion. You'll do what I say.”", "bucket": 1 },
    { "text": "“Stay up as late as you like, beta, you work so hard.”", "bucket": 2 },
    { "text": "Parents rarely know where their 13-year-old is and seldom talk with him", "bucket": 3 },
    { "text": "Parents hug and praise a lot, and give in to every demand", "bucket": 2 },
    { "text": "Clear expectations about homework, with praise for effort and listening to the child's view", "bucket": 0 }
  ]
}
:::

:::trap Parenting styles across cultures
Ruth Chao (1994) argued that Chinese parenting, often classed as authoritarian, reflects **training** (guan) combined with deep involvement and care, and does not have the same negative effects. Indian research similarly finds many parents high on control **and** high on warmth, and that strictness is harmful mainly when it comes with harshness or low warmth. Use Baumrind's styles, but check what control **means** to the family.
:::

:::clinician
Social referencing figures from the 1985 study: 14 of 19 infants (74%) crossed to a joyful face; 0 of 17 crossed to a fearful face. This is the developmental basis for parental modelling of anxiety, targeted in family-based CBT for child anxiety. Joint attention deficits (not following a point or gaze, not pointing to share interest by about 12 to 14 months) are early signs examined in autism screening (for example, the M-CHAT-R/F, the Indian Scale for Assessment of Autism, and the INCLEN diagnostic tool developed for Indian settings). Language delay assessment in India must account for multilingual exposure: count total words across languages and assess in the home language. Parenting style research in India (for example, work by Sriram, Saraswathi and others) emphasises interdependence, respect for elders and shared decision-making; harsh physical punishment remains common and is associated with conduct and emotional problems, and positive parenting programmes have trial support in Indian settings.
:::

:::recall
1. Give the approximate ages for babbling, first words and two-word sentences. || About 6 months, about 12 months, about 18 to 24 months.
2. What is overregularisation, and what does it show? || Applying grammar rules too widely ("goed"); the child is using rules, not just imitating.
3. What is Chomsky's LAD? || An inborn language acquisition device with universal grammar.
4. What is perceptual narrowing? || Losing the ability to distinguish sounds not used in one's own language by about 10 to 12 months.
5. What is social referencing? || Using a caregiver's emotional expression to decide how to react to an uncertain situation.
6. Name Baumrind's styles plus Maccoby and Martin's addition. || Authoritative, authoritarian, permissive; neglectful.
:::

:::mcq
Q: Two 3-year-olds sit side by side, each building a tower with blocks, without interacting. Parten would call this:
- Associative play
- *Parallel play
- Cooperative play
- Onlooker behaviour
> Playing beside, not with, each other.
:::

## 2.7 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: A toddler calls a horse "doggie", then learns horses are different. Learning the difference is:
- Assimilation
- Equilibration
- *Accommodation
- Centration
> Changing an existing scheme to fit new experience.

Q: A preoperational child chooses her own view when asked what a doll sees from the other side of a model. This shows:
- Animism
- Conservation
- Seriation
- *Egocentrism
> Piaget's three mountains task.

Q: Mastering conservation of number before conservation of weight is an example of:
- Vertical décalage
- *Horizontal décalage
- Object permanence
- Hypothetico-deductive reasoning
> Different conservations at different ages.

Q: Systematically testing one variable at a time in the pendulum problem shows:
- *Formal operations
- Concrete operations
- Preoperational thought
- Sensorimotor intelligence
> Hypothetico-deductive reasoning.

Q: The term "scaffolding" was introduced by:
- Lev Vygotsky
- Jean Piaget
- Robert Siegler's group
- *Wood, Bruner and Ross
> 1976, building on Vygotsky's ideas.

Q: A child uses several strategies for adding numbers, with better ones slowly becoming more common. This is described by:
- Piaget's equilibration
- Vygotsky's ZPD
- *Siegler's overlapping waves
- Case's central conceptual structures
> Strategies compete and shift gradually.

Q: The virtue Erikson linked with generativity versus stagnation is:
- *Care
- Wisdom
- Love
- Fidelity
> Generativity gives care.

Q: A young woman who has explored several careers but not yet chosen one is in Marcia's status of:
- Achievement
- Foreclosure
- *Moratorium
- Diffusion
> Exploring without commitment.

Q: Harlow's monkeys ran to the cloth mother when frightened. This supports the role of:
- Feeding
- *Contact comfort
- Imprinting in birds
- Monotropy
> Comfort, not food, underlies attachment.

Q: Main and Solomon added which attachment pattern?
- Secure
- Avoidant
- Resistant (ambivalent)
- *Disorganised
> The fourth category, linked to frightening or frightened care.

Q: Thomas and Chess's slow-to-warm-up children are best described as:
- *Withdrawing at first, then adapting
- Irregular, intense and negative in mood
- Positive and highly adaptable
- Unclassifiable mixtures
> Low activity, mild negativity, slow adaptation.

Q: In Kohlberg's theory, reasoning based on what will make others see you as a good person is stage:
- 2
- *3
- 4
- 5
> The good interpersonal relationships orientation.

Q: Children judging "hitting is wrong even if the teacher allows it" but "uniform rules depend on the school" shows:
- Kohlberg's stage 4
- *Turiel's domain theory
- Gilligan's ethic of care
- Piaget's idea of immanent justice
> Domain theory: moral versus conventional.

Q: A 2-year-old says "I goed to the park." This is:
- Overextension
- Underextension
- *Overregularisation
- Telegraphic speech
> Applying the past tense rule too widely.

Q: Infants looking to a parent's face before approaching an unfamiliar toy are showing:
- Stranger anxiety
- Self-recognition
- Parallel play with others
- *Social referencing
> Using another's emotional signals to guide behaviour.
:::
`;
