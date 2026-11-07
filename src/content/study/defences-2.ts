/* Module · Mind, development and defence mechanisms, Parts III and IV (Advanced level and exam zone). Original text written for VIBHA School of Psychology. */
export const part2 = String.raw`
# Part III · Advanced: development in depth, the science of defence, and using it

## 3.1 Morality, temperament and the early self [core][advanced]
### Kohlberg: how moral reasoning develops
Lawrence Kohlberg gave children and adults dilemmas (the best known: should Heinz steal an overpriced medicine to save his dying wife?) and scored **the reasoning**, not the answer.

| Level | Stage | The reason behind a choice |
|---|---|---|
| **Preconventional** | 1. Obedience and punishment | "He'll go to jail" |
| | 2. Self-interest and exchange | "He needs his wife; it's worth it to him" |
| **Conventional** | 3. Good relationships ("good boy, good girl") | "A good husband would do it" |
| | 4. Law and order | "Laws keep society together; he must not steal" |
| **Postconventional** | 5. Social contract | "Laws serve people; a life matters more than property" |
| | 6. Universal ethical principles | "Human life has absolute value, beyond any law" |

:::mnemonic "Punish, Pay, Please, Police, People, Principles"
Stages 1 to 6 in six P words.
:::


:::widget layers
{
 "title": "Kohlberg's levels of moral reasoning",
 "shape": "stack",
 "layers": [
  {
   "label": "Postconventional",
   "detail": "Stage 5 social contract; stage 6 universal ethical principles. Laws serve people and principles."
  },
  {
   "label": "Conventional",
   "detail": "Stage 3 good relationships; stage 4 law and order. Being good in others' eyes, keeping society together."
  },
  {
   "label": "Preconventional",
   "detail": "Stage 1 obedience and punishment; stage 2 self-interest and exchange."
  }
 ],
 "caption": "Reasoning climbs from the bottom. Remember Shweder's warning: duty and community reasoning is not automatically lower."
}
:::

### Critiques that matter
- **Carol Gilligan** (1982) argued that Kohlberg's scheme, built from interviews with boys, ranks an **ethic of justice** above an **ethic of care**, and so made women appear "less developed". Later meta-analyses found only small sex differences, but her point that care is a mature moral voice was widely accepted.
- **Richard Shweder** studied moral reasoning in **Bhubaneswar** and **Chicago** and described three ethics: **autonomy** (rights and harm), **community** (duty, hierarchy, role) and **divinity** (purity, sacredness). Kohlberg's top stages measure only autonomy. A Hindu elder reasoning from dharma and duty is not "stuck at stage 4"; he is using a different, sophisticated ethic.
- Reasoning predicts action only modestly: people who reason at high levels do not always act well.

:::widget decide
{
  "scene": "In an Indore college ethics seminar, a student argues that her grandfather, who says 'one must do one's duty to the family even at personal cost', reasons at a 'lower' moral level than a student who says 'everyone has a right to choose for themselves'.",
  "ask": "What is the most accurate response from the teacher?",
  "choices": [
    { "label": "Agree; autonomy-based reasoning is objectively higher", "verdict": "harm", "outcome": "Students from traditional families feel their values have been called childish.", "why": "That treats one culture's ethic as the universal summit, which Shweder and others showed is not justified." },
    { "label": "Explain that Kohlberg's scale privileges an ethic of autonomy, and that duty-based (community) reasoning can be equally complex; then compare how each would handle a hard case", "verdict": "best", "outcome": "The discussion deepens, and students practise seeing reasoning, not just conclusions.", "why": "This keeps Kohlberg's useful structure while teaching its cultural limits." },
    { "label": "Say moral reasoning cannot be studied", "verdict": "ok", "outcome": "Students lose a useful framework.", "why": "It can be studied; the lesson is to study it with cultural awareness." }
  ]
}
:::

### Temperament: what the baby brings
**Temperament** is the inborn style of reacting: how active, how intense, how quickly soothed. Thomas and Chess's New York Longitudinal Study described three groups:

| Type | Share of children | Description |
|---|---|---|
| **Easy** | About 40 per cent | Regular, adaptable, mostly positive mood |
| **Difficult** | About 10 per cent | Irregular, intense, slow to adapt, often negative |
| **Slow-to-warm-up** | About 15 per cent | Mild, withdraws at first, adapts slowly |
| (Mixed or unclassified) | About 35 per cent | Do not fit neatly |

Their most important idea was **goodness of fit**: outcomes depend on how well a child's temperament matches the demands and responses of the environment. A "difficult" baby with a calm, flexible family may thrive.

**Jerome Kagan** described **behavioural inhibition**: toddlers who become quiet and wary with anything new. They are more likely to develop social anxiety later, though many do not.


:::widget decide
{
 "scene": "Parents in Mysuru bring their 3-year-old, Tanu, who screams at every change: new food, bath time, leaving the park. Her elder brother was 'easy'. The father wants to 'break her stubbornness' with strict punishment.",
 "ask": "What advice fits temperament research best?",
 "choices": [
  {
   "label": "Agree with strict punishment to teach obedience",
   "verdict": "harm",
   "outcome": "Tantrums intensify; Tanu becomes fearful and the parents exhausted.",
   "why": "A temperamentally intense, slow-to-adapt child needs a better fit, not harsher control."
  },
  {
   "label": "Explain goodness of fit: predictable routines, warnings before transitions, calm limits, praise for coping, and patience with slow adaptation",
   "verdict": "best",
   "outcome": "Within months tantrums fall and the parents feel more confident.",
   "why": "Matching the environment to the child's temperament improves outcomes."
  },
  {
   "label": "Tell them she will grow out of it and do nothing",
   "verdict": "ok",
   "outcome": "Some improvement with age, but family stress stays high.",
   "why": "Many children settle, but guidance reduces strain and conflict now."
  }
 ]
}
:::

### Mahler: becoming a separate person
Margaret Mahler, observing mothers and infants, described **separation-individuation** in the first three years:
1. **Differentiation ("hatching")**: the baby begins to notice the world beyond the mother; stranger anxiety.
2. **Practising**: the crawling, then walking toddler explores with delight, returning to the mother for "refuelling".
3. **Rapprochement**: aware of being separate, the toddler swings between wanting independence and clinging; the **rapprochement crisis**.
4. **Object constancy**: an inner image of the caregiver as reliably loving, even when absent or frustrating.

:::widget guess
{
  "prompt": "In Mahler's account, the rapprochement phase, with its swings between clinging and pushing away, is centred around what age?",
  "min": 0,
  "max": 48,
  "unit": "months",
  "answer": [15, 24],
  "reveal": "Roughly from 15 or 16 months to about 2 years. The toddler's new independence frightens as well as excites them. Patient, available caregiving through this 'push and pull' supports later emotional stability.",
  "clinician": "Mahler's phases: an early 'normal autistic' phase (later abandoned in light of infant research showing early social engagement), symbiosis (about 2 to 6 months), differentiation (about 5 to 10 months), practising (about 10 to 16 months), rapprochement (about 16 to 24 months) and the beginnings of object constancy (about 24 to 36 months). Masterson and Kernberg linked failures of rapprochement to borderline pathology, a developmental hypothesis with limited direct empirical support; prospective attachment research has largely superseded it."
}
:::

:::clinician
Kohlberg's stages are measured with the Moral Judgement Interview; Rest's Defining Issues Test (DIT) is the questionnaire alternative. Haidt's social intuitionist model argues that most moral judgement is fast intuition with reasoning added afterwards, and Moral Foundations Theory extends Shweder's three ethics to several foundations (care, fairness, loyalty, authority, sanctity, liberty). Joan Miller's comparative studies found Indian participants more often viewed helping family and others as a moral obligation, where American participants framed it as personal choice. Temperament research has moved to dimensional models (Rothbart: surgency or extraversion, negative affectivity, effortful control). Effortful control predicts self-regulation and later psychopathology; negative affectivity links to internalising disorders; low fear and callous-unemotional traits link to conduct problems. Differential susceptibility (Belsky; Boyce's "orchids and dandelions") proposes that highly reactive children are most harmed by poor environments and benefit most from good ones.
:::

:::recall
1. Name Kohlberg's three levels and six stages. || Preconventional (punishment; self-interest), conventional (good relationships; law and order), postconventional (social contract; universal principles).
2. What was Gilligan's critique? || Kohlberg ranked an ethic of justice above an ethic of care and built the scheme from boys, so undervalued care-based reasoning.
3. What are Shweder's three ethics? || Autonomy, community and divinity.
4. What is goodness of fit? || The match between a child's temperament and the environment's demands and responses, which shapes outcome.
5. List Mahler's subphases of separation-individuation. || Differentiation, practising, rapprochement, object constancy.
:::

:::mcq
Q: A teenager says Heinz should not steal because "a good son and husband should be seen as honest by everyone". Kohlberg's stage is:
- Stage 1
- *Stage 3
- Stage 5
- Stage 6
> Reasoning based on being seen as good in relationships is stage 3.

Q: A toddler who explored happily now clings, then pushes his mother away, then clings again. Mahler would call this:
- Practising
- Differentiation
- *Rapprochement
- Symbiosis
> The rapprochement crisis.
:::

## 3.2 Attachment across life, and when it goes badly wrong [core][advanced]
The starting picture of attachment (Bowlby's secure base, Ainsworth's Strange Situation and the four infant patterns) and its adult forms (the Adult Attachment Interview, intergenerational transmission) are taught in depth in the **Psychodynamics in depth** module, Sections 1.4 and 2.4. Here we focus on what development and clinical work add: who the attachment figures are, what severe deprivation does, and the two attachment disorders.


:::widget strange
{
 "caption": "Step through the episodes and switch between the four infants. Watch the reunions: that is where secure, avoidant, ambivalent and disorganised patterns show most clearly."
}
:::

:::widget figure
{"id": "harlow-mothers"}
:::

### A quick reminder of the four infant patterns
- **Secure**: upset at separation, comforted at reunion, returns to play.
- **Avoidant**: little visible distress; ignores the parent on return.
- **Ambivalent (resistant)**: very distressed; angry and clingy at reunion, hard to soothe.
- **Disorganised**: contradictory, frightened or frozen behaviour; linked to frightening or frightened caregiving, maltreatment and unresolved parental trauma.


:::widget layers
{
 "title": "The circles around a child",
 "shape": "rings",
 "layers": [
  {
   "label": "Child",
   "detail": "Temperament, health, developing attachment."
  },
  {
   "label": "Microsystem",
   "detail": "Parents, grandparents, siblings, crèche, school: the people the child meets directly."
  },
  {
   "label": "Mesosystem",
   "detail": "Links between those settings: how home and school talk to each other."
  },
  {
   "label": "Exosystem",
   "detail": "Settings the child is not in but which affect them: a parent's workplace, the panchayat, health services."
  },
  {
   "label": "Macrosystem",
   "detail": "Culture, religion, economy, laws, beliefs about childhood."
  },
  {
   "label": "Chronosystem",
   "detail": "Change over time: migration, a death, a pandemic year."
  }
 ],
 "caption": "Bronfenbrenner's ecological model. Place one stress and one support for a child you know on each ring."
}
:::


:::widget flow
{
 "title": "From caregiving to attachment pattern",
 "layout": "tree",
 "nodes": [
  {
   "id": "c",
   "label": "Repeated experience of care"
  },
  {
   "id": "s",
   "label": "Sensitive and available",
   "parent": "c",
   "detail": "Leads to secure attachment: seeks comfort and is soothed."
  },
  {
   "id": "r",
   "label": "Rejecting or distant",
   "parent": "c",
   "detail": "Leads to avoidant attachment: hides distress, ignores the parent at reunion."
  },
  {
   "id": "i",
   "label": "Inconsistent",
   "parent": "c",
   "detail": "Leads to ambivalent attachment: clingy and angry, hard to soothe."
  },
  {
   "id": "f",
   "label": "Frightening or frightened",
   "parent": "c",
   "detail": "Leads to disorganised attachment: confused, frozen behaviour."
  }
 ],
 "caption": "Patterns are adaptations to the care a child receives, not faults in the child."
}
:::

### Many caregivers, one secure base
In many Indian homes care is shared by grandparents, aunts, older siblings and domestic helpers. Children can be securely attached to **several figures**, and a grandmother may be the main one. Assess **who actually comforts the child when frightened**, not who the "mother" is on paper.

### What severe deprivation does
Studies of children raised in large orphanages (most famously in Romania after 1989) showed that **early, severe neglect** harms brain growth, IQ, language and attachment. The **Bucharest Early Intervention Project** randomly placed some institutionalised children in good foster care. Those placed **earlier** did much better on IQ, language and attachment security; some effects lasted into adolescence.

:::widget guess
{
  "prompt": "In the Bucharest project, children moved from institutions into good foster homes did best if placed before a certain age. Around what age did the benefit for IQ and attachment drop off most clearly?",
  "min": 0,
  "max": 60,
  "unit": "months",
  "answer": [20, 26],
  "reveal": "Around 2 years (about 24 months). Children placed before then showed the largest gains. Later placement still helped, but less. This is one reason child-protection systems now prefer family-based care and early adoption over institutional care.",
  "clinician": "The Bucharest team (Nelson, Zeanah, Fox): foster care improved IQ, language, EEG power, attachment security and rates of emotional disorders, with sensitive periods for several outcomes around 24 months, though not for all (for example ADHD symptoms and disinhibited social engagement were less responsive). In India, adoption is regulated through the Central Adoption Resource Authority (CARA) under the Juvenile Justice (Care and Protection of Children) Act 2015, and policy has moved towards family-based alternative care (kinship care, foster care) over institutions."
}
:::

### The two attachment disorders
| | Reactive attachment disorder (RAD) | Disinhibited social engagement disorder (DSED) |
|---|---|---|
| **Core picture** | Withdrawn, rarely seeks or responds to comfort; little positive emotion; irritability or fear | Overfriendly with strangers; goes off with them without checking back; no normal wariness |
| **Cause** | Extremely insufficient care (neglect, frequent changes of caregiver, institutions) | Same kind of severe deprivation |
| **Course** | Improves considerably with good caregiving | More persistent, even after good placement |
| **Main differential** | Autism, depression, intellectual disability | ADHD (impulsivity), normal friendliness |

:::widget build
{
  "vignette": "Lakshmi, 4, was adopted from a large children's home a year ago. Her adoptive parents in Bengaluru say she will hold any adult's hand in the mall and walk off with them, hugs the delivery man, and never looks back to check where her parents are. She plays well with toys, speaks in sentences, makes good eye contact and enjoys pretend play. She was in the home from birth with many changing carers.",
  "rule": "Tick the features present. DSED needs a pattern of overfamiliar approach to strangers (at least two kinds of behaviour) and a history of extremely insufficient care.",
  "symptoms": [
    { "label": "Reduced reticence in approaching unfamiliar adults", "present": true, "core": true },
    { "label": "Overly familiar physical or verbal behaviour with strangers", "present": true, "core": true },
    { "label": "Not checking back with caregiver in unfamiliar settings", "present": true },
    { "label": "Willing to go off with an unfamiliar adult", "present": true },
    { "label": "History of extremely insufficient care (institution, changing carers)", "present": true, "core": true },
    { "label": "Restricted interests and repetitive behaviours", "present": false, "why": "Absent, which helps rule out autism." },
    { "label": "Impulsivity across many situations, not just social", "present": false, "why": "Absent, which argues against ADHD as the main explanation." }
  ],
  "need": 3,
  "needCore": true,
  "verdict": "The picture fits disinhibited social engagement disorder: indiscriminate approach, overfamiliarity, no checking back and readiness to go off with strangers, after early institutional care. Good imaginative play and eye contact argue against autism. Safety teaching and an attachment-focused parenting intervention are the next steps; the pattern may persist even with loving care."
}
:::

### Helping attachment
Interventions that improve **caregiver sensitivity** work best. Examples include video feedback for parents (watching short clips of their own play with the child and noticing the child's signals), **Circle of Security**, and **Attachment and Biobehavioral Catch-up** for foster carers. The common thread is helping parents see the child's need under the behaviour.

:::clinician
DSM-5-TR requires for RAD a developmental age of at least nine months and onset before age five; for DSED a developmental age of at least nine months. Both require evidence of extremes of insufficient care. ICD-11 retains both (6B44 reactive attachment disorder; 6B45 disinhibited social engagement disorder). Attachment disorders are not the same as insecure attachment, which is common and not a disorder. The attachment therapies to avoid are coercive "holding therapies" and "rebirthing", which have caused deaths and are explicitly condemned. Evidence: Bakermans-Kranenburg's meta-analyses found that brief, behaviourally focused sensitivity interventions ("less is more") improved sensitivity and, modestly, attachment security; VIPP-SD has replicated across countries, and adaptations have been piloted in South Asia. Disorganised attachment is a risk marker, not a diagnosis, and should never by itself be used as evidence of maltreatment in court.
:::

:::recall
1. Name the four infant attachment patterns. || Secure, avoidant, ambivalent (resistant), disorganised.
2. What did the Bucharest Early Intervention Project show? || Earlier placement in good foster care, especially before about two years, greatly improved IQ, language and attachment after institutional deprivation.
3. Contrast RAD and DSED. || RAD: withdrawn, rarely seeks comfort, improves with good care. DSED: indiscriminate overfriendliness with strangers, more persistent. Both follow severe insufficient care.
4. What do effective attachment interventions target? || Caregiver sensitivity: noticing and responding to the child's signals.
:::

:::mcq
Q: A 3-year-old from an orphanage rarely seeks comfort when hurt, shows little joy, and is withdrawn with his new carers. The best fit is:
- Disinhibited social engagement disorder
- *Reactive attachment disorder
- Normal shyness
- Separation anxiety disorder
> Inhibited, withdrawn pattern after severe deprivation.

Q: Which statement about disorganised attachment is correct?
- It is a psychiatric disorder
- *It is a risk marker linked with frightening caregiving, but should not be used alone as proof of abuse
- It occurs in most children
- It is the same as DSED
> A pattern, not a diagnosis; misuse in court is harmful.
:::

## 3.3 Adult life, ageing and grief [core][advanced]
### Development does not stop at 18
- **Daniel Levinson** described adult "seasons" with transitions in which people rebuild their life structure (the early-adult transition, the age-30 transition, the midlife transition).
- The popular "midlife crisis" is **not** universal. Most surveys find only a minority report a true crisis; many describe midlife as a period of stability and competence.
- **George Vaillant's** long follow-up of adult men found that good relationships and mature defences predicted healthy ageing far better than wealth or early achievement.
- **Paul Baltes's selection, optimisation and compensation (SOC)**: successful ageing means choosing fewer goals, practising what matters, and finding new ways around losses (the pianist who plays fewer pieces, practises them more, and slows before fast passages).
- **Laura Carstensen's socioemotional selectivity**: as time feels shorter, older people choose emotionally meaningful relationships over new ones, and often report **more** emotional well-being than younger adults.

:::student
Older patients are not "younger patients with grey hair". Ask what they are choosing to protect, what they are mourning, and what gives meaning now. In many Indian families, ageing also means a shift in role (from head of the household to dependent), which can hurt more than any illness.
:::

### Grief: what research really shows
**Kübler-Ross's five stages** (denial, anger, bargaining, depression, acceptance) were described for **dying patients**, not for the bereaved, and they are not a fixed sequence. Research on bereavement shows:
- Most people are **resilient**: they feel deep sorrow but continue to function, and recover over months.
- **Yearning** for the dead person is usually the strongest feeling, more than anger or depression.
- People move back and forth. The **dual process model** (Stroebe and Schut) describes oscillation between **loss-oriented** coping (crying, looking at photos, remembering) and **restoration-oriented** coping (learning new roles, taking a break from grief). Both are healthy; the swing between them matters.
- **Continuing bonds**: keeping a connection with the dead person (talking to them, honouring them in rituals) is normal and often helpful, not a failure to "let go".
- **Worden's four tasks of mourning**: accept the reality; work through the pain; adjust to a world without the person; find an enduring connection while moving on with life.

:::example Mourning in three Indian families
- In a Hindu family in Varanasi, the thirteen days of rites end with a meal (terahvi), and yearly rites (shraddha) honour the dead: a structure for both grief and continuing bonds.
- In a Muslim family in Lucknow, a widow observes iddat, a defined period of mourning with community support around her.
- In a Christian family in Kochi, a memorial Mass at forty days and on each anniversary gathers the community.
Rituals give time, company and permission to grieve. But rituals can also hide grief: after the formal mourning ends, the bereaved person, often a widow, may be left alone with it.
:::


:::widget flow
{
 "title": "The dual process model of grief",
 "layout": "cycle",
 "nodes": [
  {
   "id": "l",
   "label": "Loss-oriented coping",
   "detail": "Crying, looking at photographs, remembering, yearning."
  },
  {
   "id": "o1",
   "label": "Oscillation",
   "detail": "Moving away from the pain for a while is healthy, not denial."
  },
  {
   "id": "r",
   "label": "Restoration-oriented coping",
   "detail": "Learning new roles, sorting finances, taking a break from grief, new activities."
  },
  {
   "id": "o2",
   "label": "Oscillation",
   "detail": "Coming back to the loss again. Getting stuck on either side signals trouble."
  }
 ],
 "caption": "Healthy grief swings between both sides. Prolonged grief is often stuck on the loss side; avoidant grief is stuck on the restoration side."
}
:::


:::widget compare
{
 "title": "Normal grief and prolonged grief disorder",
 "a": {
  "label": "Normal grief",
  "points": [
   "Waves of yearning that ease over months",
   "Self-esteem preserved",
   "Can still enjoy some things",
   "Returns to roles and routines",
   "Continuing bonds feel comforting"
  ],
  "summary": "Painful but moving; no treatment needed, only support."
 },
 "b": {
  "label": "Prolonged grief disorder",
  "points": [
   "Intense yearning or preoccupation nearly every day",
   "Feels part of self has died",
   "Avoids reminders or cannot accept the death",
   "Life feels meaningless; marked loneliness",
   "Impairment well beyond cultural norms and time limits"
  ],
  "summary": "Stuck; grief-focused therapy helps."
 },
 "caption": "Slide between the two and list the features you would ask about in an interview."
}
:::

### When grief becomes a disorder
**Prolonged grief disorder** is a newer diagnosis: intense yearning or preoccupation with the dead person, with marked distress such as feeling part of oneself has died, disbelief, avoiding reminders, intense emotional pain, numbness, feeling life is meaningless, or intense loneliness, persisting **well beyond the expected period** for the person's culture, and impairing life.

:::widget guess
{
  "prompt": "DSM-5-TR allows a diagnosis of prolonged grief disorder in adults only when a certain minimum time has passed since the death. What is it?",
  "min": 0,
  "max": 36,
  "unit": "months",
  "answer": [12, 12],
  "reveal": "At least 12 months in adults (6 months for children and adolescents). ICD-11 uses at least 6 months for all ages, but adds that the reaction must clearly exceed what is expected in the person's culture and religion.",
  "clinician": "DSM-5-TR (2022) criteria: death at least 12 months earlier (6 months in children and adolescents); intense yearning or preoccupation nearly every day for at least the last month; at least three of eight symptoms (identity disruption, marked disbelief, avoidance of reminders, intense emotional pain, difficulty reintegrating, emotional numbness, feeling life is meaningless, intense loneliness); clinically significant impairment; exceeds cultural norms. Prevalence is roughly 10 per cent of bereaved adults, higher after sudden, violent or child deaths. Grief-focused therapy (Shear's prolonged grief disorder therapy) outperforms interpersonal therapy alone in trials; antidepressants help comorbid depression but not core yearning."
}
:::

:::widget decide
{
  "scene": "Mr Iyer, 70, in Chennai, lost his wife eight months ago. He visits her photo daily, talks to her each night, and cries when he speaks of her. He has resumed his morning walks, sees friends at the temple, and helps his grandson with homework. His son wants him 'put on medicine because he still talks to Amma'.",
  "ask": "What is the best response?",
  "choices": [
    { "label": "Diagnose prolonged grief disorder and start an antidepressant", "verdict": "harm", "outcome": "He feels his love is being treated as illness, and side effects make his walks harder.", "why": "Talking to the dead and crying are normal continuing bonds; he is functioning well and the time and impairment rules are not met." },
    { "label": "Reassure the family that this is a normal, healthy grief with continuing bonds; explain warning signs to watch for", "verdict": "best", "outcome": "The son relaxes; Mr Iyer feels respected. Both know when to return.", "why": "Normal grief is not treated. Psychoeducation about what is normal, and what is not, is the right intervention." },
    { "label": "Tell him to stop talking to her photo so he can move on", "verdict": "harm", "outcome": "He becomes secretive and lonelier.", "why": "This reflects the outdated idea that health means cutting ties with the dead." }
  ]
}
:::

:::clinician
Bonanno's prospective studies (for example the Changing Lives of Older Couples study) identified common trajectories after spousal loss: resilience (the most common, roughly half or more), recovery, chronic grief, chronic depression (often pre-existing) and depressive improvement (relief after a strained marriage or long caregiving). The Yale Bereavement Study found acceptance was the most frequently endorsed item from the start, with yearning the dominant negative feeling, peaking around four months. In DSM-5 the bereavement exclusion for major depression was removed; clinicians should diagnose a depressive episode during bereavement if criteria are met, while distinguishing grief (waves of yearning, preserved self-esteem, humour possible) from depression (pervasive anhedonia, worthlessness, self-loathing). In India, widowhood (especially for older, poorer women) carries social and economic loss that compounds grief; ask about income, housing and how the family now treats her.
:::

:::recall
1. Why is Kübler-Ross's model not a good model of bereavement? || It was described for dying patients, the stages are not sequential, and research shows yearning and resilience dominate.
2. Describe the dual process model. || Healthy grieving oscillates between loss-oriented coping and restoration-oriented coping.
3. What are Worden's four tasks? || Accept the reality; work through the pain; adjust to a world without the person; find an enduring connection while moving on.
4. What is SOC in ageing? || Selection, optimisation and compensation: fewer goals, practise what matters, and compensate for losses.
5. What are the time rules for prolonged grief disorder? || DSM-5-TR: at least 12 months in adults, 6 in children; ICD-11: at least 6 months, beyond cultural norms.
:::

:::mcq
Q: Research on bereavement shows that the most common course after losing a spouse is:
- Chronic depression
- *Resilience: sorrow with continued functioning and gradual recovery
- Passing through five fixed stages
- Psychosis
> Resilience is the most common trajectory.

Q: Continuing to talk to a dead parent and honour them in rituals is best described as:
- Pathological denial
- *A normal continuing bond
- A psychotic symptom
- Prolonged grief disorder in all cases
> Continuing bonds are normal and often helpful.
:::

## 3.4 Defences as science: measuring and testing them [core][advanced]
Are defences real, or just stories clinicians tell? Over the last forty years, research has given a fairly clear answer: **defensive processes are real and measurable**, but some of Freud's specific claims are not.

### How defences are measured
| Method | How it works | Strengths and limits |
|---|---|---|
| **Self-report questionnaires** (for example the Defense Style Questionnaire) | People rate statements such as "I get through problems by not thinking about them" | Quick; but people cannot easily report what is unconscious, so it measures conscious derivatives |
| **Observer rating scales** (for example the Defense Mechanism Rating Scales) | Trained raters code defences from interview or therapy transcripts | Closer to the concept; time-consuming and needs training |
| **Narrative and projective coding** (for example Cramer's coding of TAT stories) | Defences coded from stories people tell about pictures | Shows developmental change; depends on rater skill |

### What the research shows
- **Defences develop in sequence** in children: denial is common in early childhood, projection rises in later childhood, and identification dominates in adolescence (Cramer).
- **Defences increase under stress**, and decline when stress eases.
- **Mature defences predict better health** and adjustment over decades (Vaillant).
- **Defensive functioning improves with successful psychotherapy**, and the change tracks symptom improvement.

### Cousins in cognitive and social psychology
Mainstream psychology has rediscovered defences under new names:
| Psychoanalytic term | Experimental cousin | Classic finding |
|---|---|---|
| Rationalisation | **Cognitive dissonance reduction** (Festinger) | People paid little to tell a lie came to believe it more than people paid a lot |
| Projection | **False consensus**, **defensive projection** | People who deny a trait in themselves see it more in others |
| Denial | **Motivated reasoning** (Kunda), **optimism bias** | People judge threatening health information as less credible |
| Self-protective distortion | **Self-serving bias** | Successes credited to self, failures to circumstances |
| Defence against death anxiety | **Terror management theory** | Reminders of death strengthen attachment to one's own worldview and group |

:::widget sort
{
  "prompt": "Match the everyday finding to the classic defence it most resembles.",
  "buckets": ["Rationalisation", "Projection", "Denial"],
  "items": [
    { "text": "After buying an expensive phone, a man reads only positive reviews and ignores criticism of it", "bucket": 0, "why": "Reducing dissonance after a decision is the experimental cousin of rationalisation." },
    { "text": "Smokers rate studies showing smoking's harm as 'badly done' more than non-smokers do", "bucket": 2, "why": "Motivated reasoning protects against a threatening fact." },
    { "text": "A manager who cuts corners believes his whole team is dishonest", "bucket": 1 },
    { "text": "Students who failed say 'the questions were out of syllabus'", "bucket": 0 }
  ]
}
:::


:::widget layers
{
 "title": "Coping above, defence below",
 "shape": "iceberg",
 "layers": [
  {
   "label": "Conscious coping",
   "detail": "Problem-solving, seeking support, planning, deliberately setting a worry aside."
  },
  {
   "label": "Near the surface",
   "detail": "Suppression and anticipation: mature defences that look like coping."
  },
  {
   "label": "Unconscious defences",
   "detail": "Repression, projection, splitting, reaction formation: automatic and unseen by the person."
  }
 ],
 "caption": "The deeper the process, the harder it is to measure by asking people directly."
}
:::


:::widget dissonance
{
 "belief": "I am a caring, devoted son.",
 "behaviour": "I have not visited my ageing mother in the village for a year.",
 "caption": "Watch the tension rise, then pick a way to reduce it. Which choices look like rationalisation, and which actually change behaviour?"
}
:::

### Defence and coping
**Coping** (Lazarus and Folkman) is conscious effort to manage stress: **problem-focused** (solving the problem) or **emotion-focused** (managing the feeling). Defences are unconscious. In practice they meet in the middle: suppression and anticipation are mature defences that look very much like deliberate coping.

:::widget decide
{
  "scene": "A research team in Delhi wants to measure defences in 2000 college students in one week, and compare them with depression scores.",
  "ask": "Which approach fits best, and what must they say about its limits?",
  "choices": [
    { "label": "Observer-rated defence coding from two-hour interviews with every student", "verdict": "ok", "outcome": "Rich data, but they finish only 60 interviews in the week.", "why": "Observer rating is closer to the concept but is impractical at this scale." },
    { "label": "A validated self-report defence style questionnaire, reporting clearly that it captures conscious derivatives of defences rather than unconscious processes directly", "verdict": "best", "outcome": "They collect usable data on time, and reviewers accept the honest limitation.", "why": "Matching method to scale is good science, as long as limits are stated." },
    { "label": "Ask students directly, 'Which defence mechanisms do you use?'", "verdict": "harm", "outcome": "Students tick the names they remember from class; the data are meaningless.", "why": "Defences are largely unconscious and labels invite socially desirable answers." }
  ]
}
:::

:::clinician
The Defense Style Questionnaire yields mature, neurotic and immature factors; it has been translated and used in Indian samples, but self-report validity for unconscious processes is limited, and immature-defence scores correlate heavily with general distress. Observer methods (DMRS and its Q-sort version, DMRS-Q) have stronger construct validity and are detailed in the Psychodynamics in depth module. Cramer's Defense Mechanism Manual codes denial, projection and identification in TAT stories and has supported a developmental hierarchy across ages. Falsifiability remains the strongest philosophical objection (Popper, Grünbaum): if both "remembering" and "not remembering" can be fitted to the theory post hoc, it explains too much. The best answer is that research has moved from interpreting single cases to testing defence hypotheses with reliable codes and prospective designs. For teaching, keep a clear line between defence as a well-supported general construct and specific claims (such as robust repression of massive trauma) that are not supported.
:::

:::recall
1. Name three ways of measuring defences and one limit of each. || Self-report (misses the unconscious), observer rating (time and training), narrative or projective coding (rater-dependent).
2. What developmental sequence of defences did Cramer find? || Denial in early childhood, projection in later childhood, identification in adolescence.
3. Which experimental phenomenon is closest to rationalisation? || Cognitive dissonance reduction.
4. How does coping differ from defence? || Coping is conscious and effortful; defences are largely unconscious and automatic.
:::

:::mcq
Q: People who were reminded of their own death then defended their national group's values more strongly. This finding comes from:
- Learned helplessness theory
- *Terror management theory
- Two-factor theory
- Social learning theory
> Death reminders strengthen worldview defence.

Q: The main limitation of self-report defence questionnaires is that:
- They cannot be scored
- *They capture conscious derivatives rather than unconscious processes directly
- They are only available in German
- They measure intelligence instead
> Unconscious processes are hard to self-report.
:::

## 3.5 Working with defences in therapy and in teams [core][advanced]
Knowing a defence's name is easy. Knowing **what to do** with it is the skill. The principles below apply across therapies; the detailed psychodynamic technique (clarification, confrontation, interpretation, working through) is taught in the **Psychodynamics in depth** module, Section 2.5.

### Five principles
1. **Defences protect; respect them first.** Ask "what would happen if this defence suddenly stopped working?"
2. **Assess ego strength before loosening anything.** People with fragile reality testing, poor impulse control or no support need defences **strengthened**, not challenged (supportive work).
3. **Go from surface to depth, and from defence to feeling.** Notice the defence ("you smile when you speak of him"), then the avoided feeling, and only later the reason behind it.
4. **Timing and tone matter as much as content.** A correct comment made too early feels like an attack.
5. **Track the response.** A good intervention deepens the conversation; a bad one brings more defence.


:::widget flow
{
 "title": "From surface to depth in a session",
 "layout": "chain",
 "nodes": [
  {
   "id": "n",
   "label": "Notice the defence",
   "detail": "\"You smile when you talk about him.\""
  },
  {
   "id": "f",
   "label": "Reach for the feeling",
   "detail": "\"I wonder what the smile covers.\""
  },
  {
   "id": "s",
   "label": "Stay with the feeling",
   "detail": "Allow tears or silence; do not rush."
  },
  {
   "id": "r",
   "label": "Later, the reason",
   "detail": "Why this feeling is so hard to bear, perhaps linked to the past."
  }
 ],
 "caption": "Going straight to the last box usually brings more defence, not less."
}
:::

### Defences in other therapies
| Psychodynamic idea | Cognitive-behavioural equivalent | What the therapist does |
|---|---|---|
| Avoidance, denial | **Safety behaviours**, experiential avoidance | Gradually drop safety behaviours during exposure |
| Rationalisation, projection | **Cognitive biases**, thinking traps | Examine the evidence collaboratively |
| Isolation of affect, intellectualisation | **Emotional avoidance** | Emotion-focused and acceptance-based work |
| Splitting | **Dichotomous (black-and-white) thinking** | DBT dialectics: "both-and" instead of "either-or" |

:::widget worked
{
  "title": "Meeting a defence in the session",
  "steps": [
    { "q": "Ms Kaur, 38, a lawyer in Amritsar, comes after her divorce. She talks fluently and wittily about 'the statistics of Indian divorce' and makes jokes about her ex-husband. First step: what do you notice and what is it protecting?", "a": "Intellectualisation and humour. They seem to protect her from grief, humiliation, and perhaps fear about the future." },
    { "q": "Second: assess ego strength. What would you check?", "a": "She works well, has friends, is not using alcohol, sleeps reasonably and has no thoughts of self-harm. Reality testing and impulse control are good. Her defences can be gently explored." },
    { "q": "Third: comment on the surface, not the depth. What might you say?", "a": "Something like: 'You've told me a lot about what divorce is like for women in general. I notice we haven't heard much yet about what it has been like for you.'" },
    { "q": "Fourth: watch the response. She pauses, laughs, then her eyes fill. What next?", "a": "Stay with the feeling quietly, perhaps say 'it's hard to talk about'. Do not rush to interpret why she avoids it. The defence has loosened enough for her to feel, and that is the work for today." }
  ],
  "yourTurn": [
    { "q": "Mr Singh, 55, with recent heart failure, refuses cardiac rehabilitation, saying 'I'm as strong as a horse'. He drinks daily and lives alone. Should you challenge the denial directly? Outline your steps.", "a": "Notice the denial as protection against fear of death and dependence. Ego strength is reduced (alcohol, isolation, health risk). Start supportively: build the alliance, acknowledge his strength, address alcohol, and link rehab to what he values (staying independent) rather than confronting the denial head-on. Involve his cardiologist and family if he agrees." }
  ]
}
:::


:::widget decide
{
 "scene": "Mr Reddy, 50, in Vijayawada, was discharged a week ago after a first manic episode. In counselling he insists he was 'never ill, just tired', and says he will stop medicines. He lives alone and has no close family.",
 "ask": "Supportive or expressive approach first?",
 "choices": [
  {
   "label": "Expressive: interpret his denial as fear of weakness, today",
   "verdict": "harm",
   "outcome": "He feels criticised, misses the next appointment and stops his medicines.",
   "why": "Low ego strength, recent illness and isolation call for supportive work before defences are loosened."
  },
  {
   "label": "Supportive: build the alliance around his own goals (work, sleep), give simple information, agree a relapse plan, and keep regular contact",
   "verdict": "best",
   "outcome": "He agrees to continue medicines 'for sleep' and to come monthly. Over months he begins to talk about the illness himself.",
   "why": "Strengthening coping and trust first makes later exploration possible and safe."
  },
  {
   "label": "Discharge him from counselling until he accepts the diagnosis",
   "verdict": "harm",
   "outcome": "He is left without support at a high-risk time.",
   "why": "Insight often follows engagement, not the other way round."
  }
 ]
}
:::

### Defences in teams and institutions
Defences are not only individual. **Isabel Menzies Lyth** studied nurses in a London teaching hospital (1960) and described **social defence systems**: routines such as rotating nurses often, calling patients by bed number, and checking and re-checking tasks, which protected staff from the anxiety of closeness to suffering and death, at the cost of patient care and staff satisfaction.

:::example A busy ward in Ahmedabad
On a crowded government psychiatry ward, residents start calling patients "the bed 12 schizophrenic" and "the frequent flyer overdose". Ward rounds become rapid lists. Patients feel unseen; staff feel numb. Naming these as **social defences against overwhelming workload and distress**, and bringing in brief reflective practice, often restores warmth without adding time.
:::

:::widget decide
{
  "scene": "You are a trainee psychologist. Over three weeks you notice that you dread sessions with Vikram, 30, who criticises you constantly; you find yourself arriving late and ending sessions early.",
  "ask": "What is the most professional response?",
  "choices": [
    { "label": "Transfer him to another trainee without discussion", "verdict": "harm", "outcome": "Vikram feels rejected again, and you lose a learning opportunity.", "why": "Acting on your feelings without reflection repeats his pattern and avoids your own defence (avoidance)." },
    { "label": "Take it to supervision: notice your avoidance as a possible defence and a clue to what Vikram stirs in others, and plan how to respond", "verdict": "best", "outcome": "Supervision helps you see that he pushes people away before they can leave him. You return on time and name the pattern gently.", "why": "Clinicians defend too. Reflecting on it turns it into understanding and protects the patient." },
    { "label": "Tell Vikram he is making you uncomfortable and must stop", "verdict": "ok", "outcome": "He becomes defensive; the alliance weakens.", "why": "Honest feedback about the relationship can be powerful, but only once you understand it, and with care." }
  ]
}
:::

:::clinician
The supportive-expressive continuum is the practical framework: supportive interventions (affirmation, advice, praise, empathic validation) strengthen adaptive defences in people with low ego strength or in crisis; expressive interventions (clarification, confrontation, interpretation) loosen defences to bring warded-off feelings into awareness. Most real therapy moves along the continuum within a session. Process research shows the accuracy of defence interpretations predicts alliance and outcome when they are pitched at the patient's defensive level, and that interpreting defences before drives (surface before depth) is associated with better process. Staff-level social defences are well documented in nursing, prisons and child protection; Balint groups and reflective practice groups have modest evidence for reducing burnout and improving empathy. For the full repertoire of techniques, transference and countertransference work, see the Psychodynamics in depth module, Part II.
:::

:::recall
1. Name the five principles of working with defences. || Respect them; assess ego strength; go from surface to depth and defence to feeling; mind timing and tone; track the response.
2. When should defences be strengthened rather than loosened? || When ego strength is low: fragile reality testing, poor impulse control, crisis or little support.
3. What CBT idea corresponds most closely to avoidance as a defence? || Safety behaviours and experiential avoidance.
4. What are social defence systems? || Institutional routines that protect staff from anxiety (Menzies Lyth), at a cost to care.
:::

:::mcq
Q: A patient with recent psychosis, poor sleep and no family support uses denial about her illness. The best initial approach is:
- Confront the denial firmly in the first session
- *Supportive work that builds the alliance and strengthens coping, before exploring the denial
- Interpret the unconscious meaning of the denial at once
- Discharge her until she accepts the diagnosis
> Low ego strength calls for supportive work first.

Q: Calling patients by bed number to avoid emotional involvement is an example of:
- Sublimation
- *A social defence system
- Altruism
- Anticipation
> Menzies Lyth's concept.
:::

# Part IV · Exam zone

## 4.1 Long answers and short notes [core]
### Long answer skeletons
**1. Define defence mechanisms. Classify them with examples and discuss their clinical significance (15 marks).**
Definition and properties (unconscious, protect against affect, vary in adaptiveness) → Anna Freud and Vaillant → four levels with two or three defences each, defined, with one example each → defences across disorders (OCD, phobia, paranoia, BPD, substance use) → clinical use (formulation, choosing supportive or expressive work, predicting response to stress) → research (DSQ, DMRS, Vaillant's outcomes) → limits.

**2. Erikson's psychosocial theory: describe and evaluate (15 marks).**
Background (ego psychology; epigenetic principle) → eight stages with crisis, virtue and relationships → comparison with Freud → Marcia's statuses → critiques (Western, male, sequence; Gilligan; emerging adulthood; Indian relational identity) → clinical use.

**3. Piaget's theory of cognitive development (10 to 15 marks).**
Key concepts (schema, assimilation, accommodation, equilibration) → four stages with achievements and limits → experiments (conservation, three mountains) → critiques (underestimating infants, décalage, culture) → Vygotsky's alternative → educational and clinical implications.

**4. Grief and its complications (10 marks).**
Models (Kübler-Ross and its limits, Bowlby, Worden, dual process, continuing bonds) → research (resilience, yearning) → normal versus prolonged grief disorder (criteria and time rules) → grief versus depression → culture and ritual in India → management.

### Short notes (5 marks each)
- Mature defences
- Projective identification
- Reaction formation and undoing
- Marcia's identity statuses
- Kohlberg's stages and their critics
- Temperament and goodness of fit
- Mahler's separation-individuation
- Reactive attachment disorder versus DSED
- Schedules of reinforcement
- Learned helplessness and its reformulation
- Dual process model of grief
- Social defence systems

:::student
For any "classify and give examples" question, a neat table with the level, the defence, a one-line definition and a short Indian example scores more than paragraphs. Add a closing line on clinical use.
:::

:::clinician
At postgraduate level, examiners want evaluation: name one prospective finding (Vaillant's defence maturity predicting health; the Bucharest project's sensitive period; Bonanno's resilience trajectories), one critique (cultural, methodological or falsifiability), and one clinical implication. Link to the Psychodynamics in depth module for questions on defence interpretation, transference or formulation.
:::

:::recall
1. What five elements should a long answer on defences contain? || Definition and properties, classification with examples, clinical patterns, clinical use, research and limits.
2. What extra do postgraduate examiners reward? || Evaluation: a prospective finding, a critique and a clinical implication.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Who first systematised the defence mechanisms, in 1936? :: Anna Freud.
Who classified defences into four levels? :: George Vaillant.
Name the mature defences. :: Altruism, anticipation, asceticism, humour, sublimation, suppression.
Repression or suppression: which is conscious? :: Suppression.
Which defences are typical of OCD? :: Isolation of affect, undoing, reaction formation, intellectualisation.
What is splitting? :: Seeing self or others as all good or all bad, with sudden switches.
What is projective identification? :: Projecting a feeling into another person who is then induced to feel or act it out.
What are the id, ego and superego guided by? :: Pleasure principle, reality principle and moral standards.
Erikson's adolescent crisis? :: Identity versus role confusion; virtue fidelity.
Marcia's two dimensions? :: Exploration and commitment.
Piaget's stage with conservation? :: Concrete operational.
What is egocentrism in Piaget? :: Inability to take another's viewpoint, shown in the three mountains task.
What is the ZPD? :: The gap between what a learner can do alone and with help (Vygotsky).
Who described the ethic of care? :: Carol Gilligan.
Shweder's three ethics? :: Autonomy, community, divinity.
Thomas and Chess temperament types? :: Easy, difficult, slow-to-warm-up.
Mahler's rapprochement crisis? :: The toddler's swing between independence and clinging once aware of separateness.
RAD versus DSED? :: RAD is withdrawn and inhibited; DSED is indiscriminately friendly with strangers.
Most resistant schedule to extinction? :: Variable ratio.
What maintains phobic avoidance? :: Negative reinforcement (two-factor theory).
Reformulated learned helplessness attributions? :: Internal, stable, global.
Prolonged grief disorder time rule in DSM-5-TR? :: At least 12 months in adults, 6 months in children.
Dual process model of grief? :: Oscillation between loss-oriented and restoration-oriented coping.
Who described social defence systems in nursing? :: Isabel Menzies Lyth.
:::

## 4.3 Module test [core]
Score 80% or more to complete the module.

:::mcq
Q: Defences operate mainly through the:
- Id
- *Ego
- Superego
- Preconscious alone
> The ego deploys defences.

Q: The preconscious contains:
- Only repressed wishes
- *Material that can be recalled with effort
- The id
- Only dreams
> Recallable but not currently in awareness.

Q: A man who feels strong hatred for his brother is excessively kind and attentive to him. This is:
- Sublimation
- *Reaction formation
- Altruism
- Projection
> Opposite behaviour hides the true feeling.

Q: Which defence is mature?
- Acting out
- Projection
- Passive aggression
- *Humour
> Facing reality while lightening it.

Q: Which pair is correctly matched with Vaillant's level?
- Sublimation: immature
- *Undoing: neurotic
- Distortion: mature
- Altruism: psychotic
> Undoing is a neurotic defence.

Q: A patient cuts herself whenever she feels rejected, instead of feeling the hurt. The defence is:
- Sublimation
- *Acting out
- Isolation
- Suppression
> An impulse is acted on to avoid feeling.

Q: The key difference between projection and displacement is that in projection:
- The feeling is aimed at a safer target
- *One's own feeling is attributed to another person
- The person is aware of it
- It is always mature
> Displacement redirects; projection attributes.

Q: A widow who lost her son to drowning teaches swimming to village children for free. This is:
- Reaction formation
- *Altruism (with sublimation)
- Denial
- Undoing
> Turning grief into service.

Q: According to Erikson, failure in the toddler stage leads to:
- Mistrust
- *Shame and doubt
- Guilt
- Inferiority
> Autonomy versus shame and doubt.

Q: Erikson's virtue for old age is:
- Care
- Love
- *Wisdom
- Fidelity
> Integrity versus despair gives wisdom.

Q: A college student drifts with no goals and no wish to explore options. Marcia calls this:
- Moratorium
- Foreclosure
- *Diffusion
- Achievement
> Neither exploration nor commitment.

Q: Conservation tasks are typically passed in Piaget's:
- Sensorimotor stage
- Preoperational stage
- *Concrete operational stage
- Formal operational stage
> Conservation marks concrete operations.

Q: A teenager believes no one has ever loved as deeply as he does and that nothing bad can happen to him. This is:
- Animism
- Imaginary audience
- *Personal fable
- Centration
> A form of adolescent egocentrism.

Q: Scaffolding is most closely linked to:
- Freud
- *Vygotsky's zone of proximal development
- Kohlberg
- Mahler
> Support within the ZPD, withdrawn as skill grows.

Q: Shweder's research in Bhubaneswar showed that:
- Indians reason at lower moral stages
- *Moral reasoning can draw on ethics of community and divinity, not only autonomy
- Moral reasoning is identical across cultures
- Kohlberg's stage 6 is universal
> Three ethics, culturally weighted.

Q: Goodness of fit refers to:
- IQ matching school level
- *The match between a child's temperament and the environment
- Matching a defence to a disorder
- Fit between therapist and patient
> Thomas and Chess.

Q: Kagan's behaviourally inhibited toddlers are at raised later risk of:
- Conduct disorder
- *Social anxiety
- Schizophrenia
- ADHD
> Inhibition predicts social anxiety in some children.

Q: A 4-year-old adopted from an institution hugs strangers and wanders off with them without looking back. The most likely diagnosis is:
- Reactive attachment disorder
- *Disinhibited social engagement disorder
- Autism spectrum disorder
- Normal behaviour
> Indiscriminate sociability after severe deprivation.

Q: The Bucharest Early Intervention Project found:
- Institutional care is as good as foster care
- *Earlier placement in foster care led to better IQ and attachment outcomes
- Age of placement had no effect
- Foster care harmed language
> A sensitive period around two years.

Q: Kübler-Ross's stages were originally described in:
- Bereaved spouses
- *Dying patients
- Children in hospital
- Soldiers
> Her work was with terminally ill patients.

Q: Oscillating between crying over photographs and learning to manage the household is described by:
- Kübler-Ross
- *The dual process model
- Two-factor theory
- Mahler
> Loss-oriented and restoration-oriented coping.

Q: Under ICD-11, prolonged grief disorder requires at least:
- 2 weeks
- 1 month
- *6 months
- 2 years
> At least six months, and beyond cultural norms.

Q: A smoker dismisses studies on lung cancer as "biased". The experimental concept closest to this is:
- Learned helplessness
- *Motivated reasoning
- Classical conditioning
- Object permanence
> Threatening information is discounted.

Q: Drinking alcohol to stop withdrawal tremor, which then makes drinking more likely, is:
- Positive punishment
- *Negative reinforcement
- Extinction
- Modelling
> Removing an aversive state reinforces the behaviour.

Q: In a patient with low ego strength in crisis, the therapist should mainly:
- Interpret defences quickly
- *Use supportive techniques that strengthen adaptive defences
- Confront all denial
- Avoid any structure
> Supportive work first.

Q: Menzies Lyth's study of nurses described:
- Learned helplessness
- *Social systems as a defence against anxiety
- Attachment styles
- Moral stages
> Institutional routines protect staff from anxiety.
:::
`;
