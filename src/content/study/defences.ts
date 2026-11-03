import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "defences",
  num: 3,
  title: "Mind, development and defence mechanisms",
  emoji: "🛡️",
  tagline: "Freud to attachment theory: how minds develop and protect themselves",
  when: "Weeks 3 to 4",
  outcomes: [
    "Explain Freud's structural and topographical models in plain words",
    "Define and give examples of the main defence mechanisms, grouped by maturity",
    "Describe Erikson's stages and Piaget's stages",
    "Describe attachment theory and the four attachment styles",
    "Use these ideas carefully in formulation and therapy",
  ],
  writeTask:
    "On paper, from memory: id, ego and superego; the four levels of defences with three examples each and a one-line example; Erikson's eight stages with their crises; Piaget's four stages; the four attachment styles. Then check and correct in red.",
  activities: [
    act.lesson("df-1", "Quiz: defence mechanisms", "Name the defence from the example."),
    act.coach("psychopathology", "Coach: psychology terms", "The terms you mix up."),
    act.coach("counselling", "Coach: counselling", "Using these ideas in sessions."),
  ],
  noteId: "defences",
};

export const text = String.raw`
# Part I · Models of the mind

## 1.1 Freud's models [core]
### Topographical model
| Level | Content |
|---|---|
| Conscious | What we are aware of now |
| Preconscious | Can be brought to awareness easily (a phone number) |
| Unconscious | Kept out of awareness; wishes, memories and conflicts that still influence behaviour (slips of the tongue, dreams, symptoms) |

### Structural model
| Part | Works on | In plain words |
|---|---|---|
| **Id** | Pleasure principle; primary process (illogical, wishful) | “I want it now” |
| **Ego** | Reality principle; secondary process (logical) | The manager balancing wants, rules and reality; uses defences |
| **Superego** | Conscience and ideals | “You should / you mustn't”; source of guilt |

Anxiety signals a conflict between these; **defence mechanisms** are the ego's unconscious ways of reducing that anxiety.

### Psychosexual stages (Freud)
| Stage | Age | Focus | Fixation shows as |
|---|---|---|---|
| Oral | 0 to 1 | Mouth, feeding, dependence | Dependency, smoking, overeating |
| Anal | 1 to 3 | Control, toilet training | Orderliness, stubbornness, stinginess (obsessional traits), or messiness |
| Phallic | 3 to 6 | Genitals; Oedipus complex | Problems with authority and rivalry |
| Latency | 6 to puberty | Skills, friendships | |
| Genital | Puberty on | Mature relationships | |

:::note How to use Freud today
Many specific claims aren't supported by evidence, but key ideas remain useful: much mental life is outside awareness; early relationships shape later ones; people protect themselves from painful feelings in predictable ways; and the relationship with the therapist echoes other relationships (transference).
:::

:::recall
1. Name the three levels of the topographical model. || Conscious, preconscious, unconscious.
2. Describe id, ego and superego in one line each. || Wants (pleasure principle); manager (reality principle); conscience.
3. What do defence mechanisms do? || Unconsciously reduce anxiety from inner conflict.
:::

:::mcq
Q: A man feels guilty for days after a small lie. In Freud's structural model, this harsh guilt comes from the:
- Id
- Ego
- *Superego
- Preconscious
> The superego is the internal moral judge.
:::

## 1.2 After Freud: the other schools [core]
Freud's ideas were extended, argued with and rebuilt by those who followed. Exams ask for the **key idea of each name**, and practice uses many of them every day.

| Thinker | School | Key ideas you should be able to explain |
|---|---|---|
| **Carl Jung** | Analytical psychology | **Collective unconscious** and **archetypes** (persona, shadow, anima/animus); **introversion and extraversion**; individuation |
| **Alfred Adler** | Individual psychology | **Inferiority complex** and striving for superiority; birth order; social interest |
| **Anna Freud** | Ego psychology | Systematised the **defence mechanisms**; child analysis |
| **Heinz Hartmann** | Ego psychology | The **conflict-free sphere** of the ego (perception, memory, thinking work without conflict) |
| **Melanie Klein** | Object relations | **Paranoid-schizoid** and **depressive** positions; splitting; projective identification |
| **Donald Winnicott** | Object relations | **Good-enough mother**, **holding environment**, **transitional object**, true and false self |
| **Margaret Mahler** | Separation-individuation | The child's psychological birth as a separate self (see Part III) |
| **Heinz Kohut** | Self psychology | Needs for **mirroring** and idealising; narcissism as a deficit in self-cohesion |
| **Otto Kernberg** | Object relations | **Borderline personality organisation**: identity diffusion, primitive defences, intact reality testing |
| **Erik Erikson** | Psychosocial | Eight stages across the whole life (Part III) |
| **Karen Horney** | Neo-Freudian | Basic anxiety; moving toward, against, away from people; challenged "penis envy" |
| **Harry Stack Sullivan** | Interpersonal | Personality is shaped in relationships; root of interpersonal therapy |

:::analogy A family tree of ideas
Freud is the trunk. **Ego psychology** grew the branch about how the self copes (defences). **Object relations** grew the branch about relationships inside the mind (the mother we carry inside). **Self psychology** grew the branch about feeling whole and valued. Interpersonal schools moved from inside the mind to between people.
:::

### Transference and countertransference
:::define Transference
The patient unconsciously **redirects feelings and expectations from important past relationships onto the therapist** (or doctor). **Countertransference** is the therapist's emotional reaction to the patient, which can be a useful clue to what the patient evokes in others.
:::
- A patient who was harshly criticised by a father may expect criticism from a male doctor and become defensive at neutral questions.
- Feeling unusually protective, irritated or bored with a patient is countertransference: notice it, use it, do not act it out.

:::recall
1. Give one key idea each for Jung, Adler and Klein. || Collective unconscious and archetypes; inferiority complex; paranoid-schizoid and depressive positions.
2. What did Winnicott mean by the good-enough mother? || A caregiver who meets needs well enough, with small manageable failures that help the child grow.
3. Define transference and countertransference. || Patient's past feelings redirected onto the therapist; therapist's emotional reaction to the patient.
4. Whose concept is borderline personality organisation? || Otto Kernberg.
:::

:::mcq
Q: A patient becomes angry with her doctor, who is an older man, the way she used to with her strict father. This is:
- Countertransference
- *Transference
- Projection
- Sublimation
> Feelings from past relationships redirected to the clinician.
:::

## 1.3 Learning theories [core]
Psychodynamic theory explains behaviour from inside; learning theory explains it from **what happened before and after**. Both are needed to understand symptoms.

### Classical conditioning (Pavlov)
:::define Classical conditioning
A **neutral stimulus** paired repeatedly with an **unconditioned stimulus** (which naturally causes a response) comes to produce a similar **conditioned response** on its own.
:::
- Pavlov's dogs: bell (neutral) + food (unconditioned) → salivation; later the bell alone → salivation.
- **Watson's Little Albert**: a white rat paired with a loud noise → fear of the rat, generalising to furry objects. The origin story of phobias.
- **Generalisation**: similar stimuli trigger the response. **Discrimination**: learning to tell them apart. **Extinction**: the bell without food, repeatedly, weakens the response. **Spontaneous recovery**: an extinguished response returns briefly.

### Operant conditioning (Skinner, Thorndike)
| | Adds something | Removes something |
|---|---|---|
| **Behaviour increases** | **Positive reinforcement** (praise after homework) | **Negative reinforcement** (avoiding a feared lift relieves anxiety) |
| **Behaviour decreases** | **Positive punishment** (a scolding) | **Negative punishment** (losing phone time) |

- **Schedules of reinforcement**: continuous (quick learning, quick extinction); **variable ratio** (gambling, slot machines: most resistant to extinction).
- **Shaping**: rewarding steps closer and closer to the target behaviour.
- **Thorndike's law of effect**: behaviours followed by satisfying results are repeated.

:::trap Negative reinforcement is not punishment
Negative reinforcement **increases** a behaviour by **removing** something unpleasant. This is why avoidance, checking and drinking to calm nerves keep going.
:::

### Social and cognitive learning
- **Bandura**: **observational learning** (modelling); the Bobo doll experiment; **self-efficacy** (belief that one can succeed).
- **Seligman**: **learned helplessness**: dogs exposed to inescapable shocks stopped trying to escape later; a model of depression.
- **Tolman**: cognitive maps; latent learning.
- **Kohler**: insight learning (apes suddenly solving problems).

:::recall
1. Explain classical conditioning using Little Albert. || A rat paired with a loud noise produced a conditioned fear of the rat.
2. Define negative reinforcement with a clinical example. || Removing something unpleasant increases a behaviour; avoidance relieves anxiety so avoidance grows.
3. Which reinforcement schedule is hardest to extinguish? || Variable ratio.
4. What is learned helplessness and who described it? || Giving up after uncontrollable stress; Seligman.
:::

:::mcq
Q: A child gets a sweet each time he does homework, and homework increases. This is:
- Negative reinforcement
- *Positive reinforcement
- Punishment
- Classical conditioning
> Adding something pleasant to increase a behaviour.
:::

# Part II · Defence mechanisms

## 2.1 Defences by level of maturity [core]
Defences are **unconscious** (except suppression), **automatic**, and **everyone uses them**. They become a problem when rigid, immature or overused. Vaillant grouped them by maturity.

### Narcissistic (psychotic) defences
| Defence | Meaning | Example |
|---|---|---|
| **Denial** (psychotic) | Refusing to accept external reality | A mother insists her dead son is just “away” |
| Distortion | Reshaping reality to fit inner needs | Grandiose beliefs |
| **Delusional projection** | Attributing one's unacceptable feelings to others as delusions | Persecutory delusions |

### Immature defences
| Defence | Meaning | Example |
|---|---|---|
| **Projection** | Attributing one's own unacceptable feelings to others | A man who is angry with his boss believes his boss hates him |
| **Splitting** | Seeing people as all good or all bad | Idealising then devaluing a therapist (borderline PD) |
| **Projective identification** | Projecting a feeling and then behaving so the other person actually feels it | A patient's hostility provokes the doctor into anger |
| **Acting out** | Expressing feelings in actions rather than words | Self-harm or fighting after a rejection |
| Passive aggression | Indirect hostility | Always late, “forgetting” tasks |
| Hypochondriasis | Turning reproach into bodily complaints | |
| Schizoid fantasy | Retreat into fantasy to avoid relationships | |

### Neurotic (intermediate) defences
| Defence | Meaning | Example |
|---|---|---|
| **Repression** | Unconsciously pushing thoughts or memories out of awareness | Unable to recall a painful event (the basic defence in Freud) |
| **Displacement** | Shifting feelings onto a safer target | Shouting at your wife after being scolded at work |
| **Reaction formation** | Behaving opposite to an unacceptable feeling | Being excessively sweet to a hated rival |
| **Intellectualisation** | Using abstract thinking to avoid feelings | A doctor discussing her own cancer only in statistics |
| **Rationalisation** | Giving logical-sounding excuses | “I failed because the paper was unfair” |
| **Isolation of affect** | Separating a memory from its feeling | Describing an assault calmly with no emotion |
| **Undoing** | Acting to symbolically cancel a thought or act | Ritual washing after a “bad” thought (OCD) |
| **Regression** | Returning to an earlier stage of behaviour | A toilet-trained child wetting the bed after a sibling's birth |
| Dissociation | Splitting off part of experience | Feeling unreal during trauma |

### Mature defences
| Defence | Meaning | Example |
|---|---|---|
| **Sublimation** | Channelling unacceptable impulses into socially valued activity | Aggression into boxing or surgery |
| **Humour** | Facing painful things with humour that eases tension | |
| **Altruism** | Meeting one's needs by helping others | A recovered patient volunteering as a peer supporter |
| **Suppression** | **Consciously** putting a worry aside to deal with it later | “I'll think about the exam result after this meeting” |
| Anticipation | Realistic planning for future discomfort | Preparing for a hard conversation |

:::mnemonic Mature defences: SHASA
**S**ublimation · **H**umour · **A**ltruism · **S**uppression · **A**nticipation.
:::

:::trap Repression versus suppression
**Repression** is **unconscious** (the person doesn't know they've pushed it away). **Suppression** is **conscious** and is a mature defence. Classic short-note pair.
:::

:::sounds Defences in everyday Indian clinic talk
- “Doctor sahab, mujhe koi problem nahi, bas BP ki wajah se neend nahi aati.” Possible rationalisation or denial.
- “Ghar pe sab theek hai,” said while crying. Isolation or denial; reflect gently.
- After a fight with the mother-in-law, scolding the children: displacement.
:::

:::recall
1. Name the four levels of defences with two examples each. || Narcissistic (denial, distortion), immature (projection, splitting), neurotic (repression, displacement), mature (sublimation, suppression).
2. Distinguish repression from suppression. || Unconscious vs conscious; suppression is mature.
3. Define projective identification. || Projecting a feeling and inducing it in the other person.
4. What is reaction formation? Give an example. || Acting opposite to a feeling; being overly sweet to a hated rival.
5. Expand SHASA. || Sublimation, humour, altruism, suppression, anticipation.
:::

:::mcq
Q: A woman who resents her mother-in-law is excessively sweet and attentive to her. The defence is:
- Displacement
- *Reaction formation
- Projection
- Sublimation
> Behaving in the opposite way to an unacceptable feeling.
:::

## 2.2 Defences in the clinic [core]
Defences are rarely named by patients. You **hear** them in how a story is told. Spotting them helps you understand a patient, predict difficulties, and write a formulation.

| What you notice | Likely defence | Where it is common |
|---|---|---|
| "Everyone is against me; the staff are plotting" | **Projection** | Paranoid states, paranoid personality |
| One doctor is perfect, another useless, and this flips | **Splitting** | Borderline personality |
| A heavy drinker insists there is no problem despite liver damage | **Denial** | Substance use, early in serious illness |
| Talks about a frightening diagnosis only in medical jargon | **Intellectualisation** | Educated patients, health professionals |
| Angry with the boss, shouts at the children at home | **Displacement** | Everyday; phobias (Little Hans) |
| Excessively sweet to a person they resent | **Reaction formation** | OCD (cleanliness against wish to mess) |
| Paralysis or blindness without neurological cause after stress | **Conversion** (somatisation of conflict) | Dissociative (conversion) disorders |
| Bed-wetting in a 6-year-old after a sibling is born | **Regression** | Children under stress; illness in adults |
| Turns the pain of loss into helping others | **Altruism, sublimation** | Healthy coping |
| Jokes about a hard situation without hiding it | **Humour** | Healthy coping |

:::example Spotting defences in a ward round
Mr R, 45, admitted with alcohol withdrawal, says: "I only drink socially, doctor. My wife exaggerates. Actually, the real problem is the stress the hospital staff are putting on me." In two sentences: **denial** (social drinking), **minimisation**, and **projection and displacement** of blame onto his wife and the staff. These are not lies to be argued with; they protect him from shame. Motivational interviewing works with them better than confrontation.
:::

### Using defences well
- **Do not strip defences away abruptly**, especially in fragile or psychotic patients. A defence is protecting something.
- Healthy development means moving from immature to **mature defences** (Vaillant found mature defences predicted better health and life outcomes in adult life).
- In formulation, name the defence and the feeling it protects against: "He uses denial to keep away shame about his drinking."

:::recall
1. Which defence is typical of borderline personality? || Splitting.
2. Name the defence in "angry with the boss, shouts at the children". || Displacement.
3. Why should you not abruptly challenge defences? || They protect against overwhelming feelings; removing them can cause distress or decompensation.
4. Name three mature defences. || Sublimation, altruism, humour, suppression, anticipation.
:::

:::mcq
Q: A heavy drinker says his wife "exaggerates" and blames hospital staff for his stress. The best clinical response is:
- Argue until he admits the truth
- *Recognise denial and projection, and use motivational interviewing rather than confrontation
- Discharge him
- Diagnose antisocial personality
> Defences protect against shame; work with them.
:::

# Part III · Development

## 3.1 Erikson's psychosocial stages [core]
| Age | Crisis | Virtue if resolved |
|---|---|---|
| Infancy | **Trust vs mistrust** | Hope |
| Early childhood | **Autonomy vs shame and doubt** | Will |
| Preschool | **Initiative vs guilt** | Purpose |
| School age | **Industry vs inferiority** | Competence |
| Adolescence | **Identity vs role confusion** | Fidelity |
| Young adulthood | **Intimacy vs isolation** | Love |
| Middle adulthood | **Generativity vs stagnation** | Care |
| Old age | **Integrity vs despair** | Wisdom |

:::mcq
Q: A 45-year-old feels stagnant and starts mentoring young colleagues to feel useful. Erikson would call this stage:
- Identity versus role confusion
- *Generativity versus stagnation
- Integrity versus despair
- Intimacy versus isolation
> Middle adulthood: contributing to the next generation.
:::

## 3.2 Piaget's cognitive stages [core]
| Stage | Age | Key achievements |
|---|---|---|
| Sensorimotor | 0 to 2 | Learning through senses and action; **object permanence** |
| Preoperational | 2 to 7 | Language, pretend play; **egocentrism**; no conservation; magical thinking |
| Concrete operational | 7 to 11 | **Conservation**, logical thinking about concrete things |
| Formal operational | 11 on | **Abstract** and hypothetical thinking |

:::mcq
Q: A 5-year-old says a tall thin glass has "more juice" than a short wide one with the same amount. She is in Piaget's:
- Sensorimotor stage
- *Preoperational stage
- Concrete operational stage
- Formal operational stage
> She has not yet mastered conservation.
:::

## 3.3 Attachment [core]
:::define Attachment theory (Bowlby)
Infants are born with a drive to stay close to a caregiver for safety. Repeated experiences with caregivers form **internal working models** of self and others that shape later relationships.
:::
**Ainsworth's Strange Situation** classified infants' responses to brief separations and reunions:
| Style | Behaviour | Caregiving pattern |
|---|---|---|
| **Secure** | Upset at separation, comforted on reunion, explores freely | Sensitive, responsive |
| **Insecure-avoidant** | Little distress, ignores the parent on return | Rejecting, unavailable |
| **Insecure-ambivalent (resistant)** | Very distressed, clingy and angry on return, hard to soothe | Inconsistent |
| **Disorganised** | Confused, contradictory behaviour (freezing, approaching then retreating) | Frightening or frightened caregiver; linked to abuse and later psychopathology |

### Other names worth knowing [extra]
- **Winnicott**: the “good-enough mother”; the **transitional object** (a teddy or blanket that soothes).
- **Melanie Klein**: object relations; paranoid-schizoid and depressive positions; splitting.
- **Kohut**: self psychology; mirroring and empathy; narcissism.
- **Harlow's monkeys**: infant monkeys preferred a soft cloth “mother” to a wire one with milk: comfort, not just food, drives attachment.

:::recall
1. List Erikson's eight crises in order. || Trust, autonomy, initiative, industry, identity, intimacy, generativity, integrity.
2. Give Piaget's four stages with one achievement each. || Sensorimotor (object permanence), preoperational (language, egocentrism), concrete (conservation), formal (abstract thinking).
3. Name the four attachment styles. || Secure, avoidant, ambivalent, disorganised.
4. Which attachment style is most linked to abuse and later problems? || Disorganised.
:::

:::mcq
Q: In the Strange Situation, an infant is very distressed when the mother leaves, clings but stays angry when she returns, and is hard to soothe. This is:
- Secure
- Avoidant
- *Ambivalent (resistant)
- Disorganised
> Linked to inconsistent caregiving.
:::

## 3.4 More stages: Mahler, Kohlberg, Bowlby and temperament [core]
### Mahler's separation-individuation
| Phase | Age | What happens |
|---|---|---|
| Normal autism (later dropped by Mahler) | 0 to 1 month | Mostly asleep, self-absorbed |
| Symbiosis | 1 to 5 months | Infant and mother experienced as one |
| **Differentiation** | 5 to 10 months | Begins to see mother as separate; stranger anxiety |
| **Practising** | 10 to 16 months | Walks away to explore, returns to "refuel" |
| **Rapprochement** | 16 to 24 months | Wants independence and closeness at once; clingy and pushing away |
| **Object constancy** | 24 to 36 months | Holds a stable inner picture of the mother even when she is absent |

:::note Why rapprochement matters
Mahler's followers linked difficulties at rapprochement to the borderline pattern of fear of abandonment alternating with fear of engulfment.
:::

### Kohlberg's moral development
| Level | Stage | Reasoning |
|---|---|---|
| **Pre-conventional** (children) | 1. Obedience and punishment | Avoid punishment |
| | 2. Self-interest | What is in it for me |
| **Conventional** (adolescents, most adults) | 3. Good boy, good girl | Approval from others |
| | 4. Law and order | Rules and duty |
| **Post-conventional** (some adults) | 5. Social contract | Rules can change for the common good |
| | 6. Universal principles | Conscience and justice |

- **Carol Gilligan** criticised Kohlberg for neglecting an **ethic of care** that is often seen in women's moral reasoning.

### Bowlby on separation and grief
- A young child separated from the caregiver goes through **protest** (crying, searching), **despair** (withdrawn, sad), then **detachment** (seems uninterested on reunion).
- Bowlby's **maternal deprivation** hypothesis: prolonged early separation harms later development. **Rutter** refined it: **privation** (never forming a bond) is more harmful than **deprivation** (losing one), and quality of care matters.

### Temperament (Thomas and Chess)
| Type | Proportion | Description |
|---|---|---|
| **Easy** | About 40% | Regular routines, adapts quickly, positive mood |
| **Difficult** | About 10% | Irregular, intense, slow to adapt, negative mood |
| **Slow to warm up** | About 15% | Withdraws at first, adapts slowly, low intensity |

- The rest are mixed. **Goodness of fit** between the child's temperament and the parents' style predicts outcome better than temperament alone.

:::recall
1. Name Mahler's sub-phases from differentiation onwards. || Differentiation, practising, rapprochement, object constancy.
2. Give Kohlberg's three levels. || Pre-conventional, conventional, post-conventional.
3. What are Bowlby's three stages of separation response? || Protest, despair, detachment.
4. Name Thomas and Chess's three temperaments and the key concept for outcome. || Easy, difficult, slow to warm up; goodness of fit.
:::

:::mcq
Q: A toddler runs off to explore the park, then comes back to touch his mother before going again. Mahler would call this:
- Symbiosis
- Differentiation
- *Practising
- Object constancy
> Exploring and returning to "refuel".
:::

## 3.5 Grief and development across adult life [core]
### Normal grief
- Common features: **shock and numbness**, yearning and searching, sadness, guilt, anger, poor sleep, seeing or hearing the dead person briefly (a **normal** experience, not psychosis), gradual acceptance.
- **Kübler-Ross** described stages in the dying: **denial, anger, bargaining, depression, acceptance**. They are not fixed or in strict order.
- **Bowlby and Parkes**: numbness, yearning, disorganisation, reorganisation.
- **Worden's tasks**: accept the reality of the loss, work through the pain, adjust to a world without the person, find an enduring connection while moving on.

### When grief becomes a disorder
| Normal grief | Prolonged grief disorder | Depression after loss |
|---|---|---|
| Waves of sadness around reminders | Intense yearning or preoccupation **beyond 12 months** (6 in ICD-11 for adults, judged against cultural norms) | Pervasive low mood, not just around the loss |
| Self-esteem intact | Identity disruption, feeling part of oneself died | Worthlessness, guilt beyond the loss |
| Brief sensing of the dead person | Avoidance of reminders, numbness | Suicidal thoughts not linked to joining the dead |

:::note Grief in India
Rituals such as the **terahvin** (13th-day ceremony), shraddh and annual rites give grief a shared structure and are protective. Ask about them: a family unable to perform rites (for example after a death during the pandemic) may grieve harder.
:::

### Adult development
- **Levinson**: life structure and transitions (early adult, mid-life transition around 40 to 45).
- **Vaillant**: maturing defences across adult life.
- **Old age**: Erikson's integrity versus despair; **life review** (Butler) helps older people make sense of their lives.

:::recall
1. List Kübler-Ross's five stages. || Denial, anger, bargaining, depression, acceptance.
2. Is seeing the dead person briefly after a bereavement a sign of psychosis? || No, it can be a normal part of grief.
3. What is Worden's model? || Four tasks of mourning.
4. Name two features that separate depression from normal grief. || Pervasive low mood, worthlessness, guilt beyond the loss.
:::

:::mcq
Q: Three weeks after her husband's death, a woman briefly hears his voice calling her and feels comforted. The best response is:
- Start an antipsychotic
- *Recognise this as a common part of normal grief and support her
- Diagnose schizophrenia
- Diagnose prolonged grief disorder
> Brief sensing of the dead person is common in grief.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. What are defence mechanisms? Classify them with clinical examples. (10 marks)
1. Definition; origin in Freud's structural model; Anna Freud and Vaillant.
2. Features: unconscious (except suppression), automatic, universal, adaptive or maladaptive.
3. Vaillant's four levels with definitions and examples (a table for each).
4. Clinical relevance: splitting in borderline PD, undoing in OCD, projection in paranoia, denial in substance use, regression in illness.
5. Using defences in therapy: identify, understand function, support more mature coping.
:::

:::word Short note: sublimation
Sublimation is a mature defence mechanism in which unacceptable impulses, such as aggression or sexual drives, are unconsciously channelled into socially acceptable and often valued activities. Examples: aggressive drives expressed through competitive sport, surgery or debating; sexual energy into art. Unlike repression, the impulse is not blocked but redirected, and gratification is obtained in a healthy form. It is considered one of the most adaptive defences in Vaillant's hierarchy.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Three parts of Freud's structural model? :: Id, ego, superego.
Principle the id works on? :: Pleasure principle.
Principle the ego works on? :: Reality principle.
The basic defence according to Freud? :: Repression.
Which defence is conscious? :: Suppression.
Splitting is typical of? :: Borderline personality disorder.
Undoing is typical of? :: OCD.
Shouting at your child after a scolding at work? :: Displacement.
Being overly nice to someone you resent? :: Reaction formation.
Excuses that sound logical? :: Rationalisation.
Five mature defences? :: Sublimation, humour, altruism, suppression, anticipation.
Erikson's adolescent crisis? :: Identity vs role confusion.
Piaget: when does object permanence develop? :: Sensorimotor stage.
Piaget: conservation appears in? :: Concrete operational stage.
Four attachment styles? :: Secure, avoidant, ambivalent, disorganised.
Winnicott's term for a comforting teddy? :: Transitional object.
Who described the collective unconscious? :: Carl Jung.
Inferiority complex? :: Alfred Adler.
Good-enough mother and transitional object? :: Donald Winnicott.
Borderline personality organisation? :: Otto Kernberg.
Patient redirects feelings about a parent onto the doctor? :: Transference.
Little Albert experiment? :: Watson; classically conditioned fear.
Learned helplessness? :: Seligman.
Observational learning and self-efficacy? :: Albert Bandura.
Schedule most resistant to extinction? :: Variable ratio.
Rapprochement is part of whose theory? :: Margaret Mahler.
Bowlby's three stages after separation? :: Protest, despair, detachment.
Goodness of fit? :: Thomas and Chess, temperament.
Kübler-Ross stages? :: Denial, anger, bargaining, depression, acceptance.
:::

## 4.3 Module test [core]
:::mcq
Q: A man angry with his boss comes home and kicks the dog. Defence:
- Projection
- *Displacement
- Sublimation
- Regression
> Feelings shifted to a safer target.

Q: Which defence is conscious?
- Repression
- Denial
- *Suppression
- Projection
> And it is mature.

Q: A woman with breast cancer discusses her illness only in terms of statistics, showing no feeling. Defence:
- Denial
- *Intellectualisation
- Acting out
- Regression
> Abstract thinking to avoid emotion.

Q: A 5-year-old starts bedwetting and baby talk after a sibling is born:
- Displacement
- *Regression
- Reaction formation
- Undoing
> A return to an earlier stage.

Q: Channelling aggression into competitive boxing:
- Displacement
- *Sublimation
- Projection
- Acting out
> Socially valued expression.

Q: A patient calls the nurse “an angel” on Monday and “useless” on Tuesday:
- Projection
- *Splitting
- Isolation
- Altruism
> All good or all bad.

Q: In Erikson's model, the crisis of adolescence is:
- Trust vs mistrust
- Industry vs inferiority
- *Identity vs role confusion
- Generativity vs stagnation
> Fidelity is the virtue.

Q: An infant ignores the mother on reunion in the Strange Situation:
- Secure
- *Insecure-avoidant
- Ambivalent
- Disorganised
> Associated with rejecting caregiving.

Q: Conservation is first achieved in Piaget's:
- Sensorimotor stage
- Preoperational stage
- *Concrete operational stage
- Formal operational stage
> Around 7 to 11 years.

Q: A gambler keeps playing despite losses because wins come unpredictably. This is:
- Continuous reinforcement
- Fixed interval schedule
- *Variable ratio schedule
- Negative punishment
> Unpredictable rewards make behaviour the hardest to extinguish.

Q: A patient idealises one nurse and hates another, and switches these views suddenly. The defence is:
- Projection
- *Splitting
- Sublimation
- Reaction formation
> Typical of borderline personality.

Q: The transitional object was described by:
- Klein
- Kohut
- *Winnicott
- Adler
> A teddy or blanket that soothes the child during separation.

Q: A toddler runs off to explore and returns to the mother to "refuel". Mahler's sub-phase:
- Symbiosis
- Differentiation
- *Practising
- Object constancy
> Rapprochement comes next.

Q: Rutter argued that, compared with losing an existing bond, never forming one is:
- Less harmful
- *More harmful
- Equally harmful
- Not harmful if physical care is good
> Privation is worse than deprivation.
:::
`;
