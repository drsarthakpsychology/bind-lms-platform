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

## 3.2 Piaget's cognitive stages [core]
| Stage | Age | Key achievements |
|---|---|---|
| Sensorimotor | 0 to 2 | Learning through senses and action; **object permanence** |
| Preoperational | 2 to 7 | Language, pretend play; **egocentrism**; no conservation; magical thinking |
| Concrete operational | 7 to 11 | **Conservation**, logical thinking about concrete things |
| Formal operational | 11 on | **Abstract** and hypothetical thinking |

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
:::
`;
