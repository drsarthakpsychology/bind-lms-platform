import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "anxiety",
  num: 7,
  title: "Anxiety disorders",
  emoji: "⚡",
  tagline: "Panic, worry, phobias and social fear: what keeps them going and how exposure breaks the loop",
  when: "Weeks 5 to 6",
  outcomes: [
    "Tell normal anxiety from an anxiety disorder",
    "State the criteria for GAD, panic disorder, agoraphobia, social anxiety, specific phobia, separation anxiety and selective mutism",
    "Explain the fear circuit, the cognitive model of panic and how avoidance maintains anxiety",
    "Rule out medical and substance causes",
    "Plan treatment with CBT and exposure first, and medicines used safely",
  ],
  writeTask:
    "On paper, from memory: the 6 GAD symptoms and the 6-month rule, the 13 panic attack symptoms with the 4-symptom threshold, the 5 agoraphobic situations, the 5 types of specific phobia, Clark's vicious circle of panic, and a treatment plan for panic disorder. Then check and correct in red.",
  activities: [
    act.lesson("anx-1", "Quiz: anxiety disorders", "Criteria and durations."),
    act.coach("therapy", "Coach: therapies", "Exposure, desensitisation and CBT terms."),
    act.coach("disorders", "Coach: disorders", "The diagnoses you mix up."),
    act.terms("Say it clinically", "Ghabrahat, tension, dil ghabrana into case-sheet language."),
  ],
  noteId: "anxiety",
};

export const text = String.raw`
# Part I · Understanding anxiety

## 1.1 Normal anxiety and anxiety disorders [core]
Anxiety is a normal, useful alarm. It prepares the body to fight or flee: heart rate and breathing rise, muscles tense, attention narrows onto threat.

:::define When anxiety becomes a disorder
Anxiety disorders involve **excessive fear or anxiety and related avoidance** that is out of proportion to the actual danger, **persistent** (usually 6 months or more), and causes **distress or impairment**.
:::

| Term | Meaning |
|---|---|
| Fear | Response to a present, real or perceived threat (alarm now) |
| Anxiety | Anticipation of a future threat (worry about what might happen) |
| Panic attack | A sudden surge of intense fear or discomfort peaking within minutes |
| Avoidance | Staying away from feared situations; brings short relief and keeps the fear alive |

:::analogy The smoke alarm
An anxiety disorder is a smoke alarm that rings when someone makes toast. The alarm works, but it is set too sensitive. Treatment doesn't remove the alarm; it re-sets the threshold, mostly by showing the brain that the toast is harmless.
:::

### How common?
- Together, anxiety disorders are the commonest group of mental disorders.
- About twice as common in women.
- Often start in childhood or early adulthood and run with depression and substance use.

:::sounds How anxiety is voiced in Indian clinics
- “Ghabrahat hoti hai, dil zor se dhadakta hai.” (Panicky feeling, heart pounding.)
- “Dil baith jaata hai.” (My heart sinks.)
- “Bas tension rehti hai har cheez ki.” (Tension about everything.) Possible GAD.
- “Gas chadh jaati hai, saans nahi aati.” Body framing of panic.
- “Kuch ho na jaaye.” (What if something happens?) Worry about the future.
:::

:::recall
1. Distinguish fear from anxiety. || Fear is about a present threat; anxiety anticipates a future one.
2. What three features make anxiety a disorder? || Out of proportion, persistent, causing distress or impairment.
3. Why does avoidance keep anxiety going? || It brings short relief, so the brain never learns the situation is safe.
:::

## 1.2 Why anxiety happens [core]
### The fear circuit
- The **amygdala** detects threat and triggers the alarm through the hypothalamus (HPA axis, cortisol) and brainstem (**locus coeruleus**, noradrenaline: racing heart, sweating).
- The **prefrontal cortex** normally calms the amygdala; in anxiety this brake is weaker.
- The **hippocampus** provides context (“this is a safe place”).
- **GABA** is the main calming transmitter (benzodiazepines boost it); serotonin modulates the circuit (SSRIs).

### Learning: how fear is acquired and kept (two-factor theory)
1. **Classical conditioning acquires fear**: a neutral cue (a crowded bus) is paired with a frightening experience (a first panic attack).
2. **Operant conditioning maintains it**: avoiding the bus reduces anxiety, which rewards avoidance.

### Cognitive models
- **Panic (Clark's vicious circle)**: a trigger, then perceived threat, anxiety, **body sensations** (palpitations), **catastrophic misinterpretation** (“I'm having a heart attack”), more anxiety, more sensations, a spiral into panic.
- **GAD**: worry is used to try to prepare for and control the future; intolerance of uncertainty; positive beliefs (“worrying keeps me safe”) and negative beliefs (“worry will make me ill”) about worry.
- **Social anxiety**: excessive focus on oneself, imagining how one looks, and **safety behaviours** (avoiding eye contact, rehearsing) that prevent disconfirmation.

### Other contributors
- Genetics (moderate heritability), behavioural inhibition in temperament (shy, cautious toddlers).
- Stressful events, childhood adversity, over-protective parenting.
- Caffeine, nicotine, alcohol and cannabis use or withdrawal.

:::recall
1. Which structure sounds the alarm, and which applies the brake? || Amygdala; prefrontal cortex.
2. Explain the two-factor theory. || Classical conditioning acquires fear; avoidance (operant) maintains it.
3. Draw Clark's circle in words. || Trigger, threat, anxiety, body sensations, catastrophic misinterpretation, more anxiety.
4. What keeps social anxiety going? || Self-focus and safety behaviours.
:::

# Part II · The disorders

## 2.1 Generalised anxiety disorder [core]
:::define Criteria
Excessive anxiety and worry, occurring **more days than not for at least 6 months**, about **a number of events or activities**. The person finds the worry **hard to control**. At least **3 of 6** symptoms (only 1 in children):
:::
1. Restlessness or feeling keyed up
2. Being easily fatigued
3. Difficulty concentrating or mind going blank
4. Irritability
5. Muscle tension
6. Sleep disturbance

:::mnemonic The six GAD symptoms
Restless, tired, blank, irritable, tense, sleepless.
:::

- Worries are about everyday things: health, family, money, work, small matters. Often long-standing (“I've always been a worrier”).
- Commonly presents with body symptoms: headaches, muscle aches, stomach upset, tiredness.
- Frequently with depression.

## 2.2 Panic attacks and panic disorder [core]
:::define Panic attack
An abrupt surge of intense fear or discomfort that **peaks within minutes**, with **at least 4 of 13** symptoms.
:::
| Body | Mind |
|---|---|
| Palpitations, pounding heart | Derealisation or depersonalisation |
| Sweating | Fear of losing control or “going crazy” |
| Trembling or shaking | Fear of dying |
| Shortness of breath, smothering | |
| Feeling of choking | |
| Chest pain or discomfort | |
| Nausea or abdominal distress | |
| Dizziness, light-headedness, faintness | |
| Chills or heat sensations | |
| Numbness or tingling | |

:::define Panic disorder
**Recurrent unexpected** panic attacks, and at least one followed by **1 month or more** of persistent worry about more attacks or their consequences (“I'll have a heart attack”), or a significant change in behaviour to avoid them.
:::

:::trap A panic attack is not a diagnosis
Panic attacks can occur in any anxiety disorder, depression, PTSD, substance use or medical illness. They become **panic disorder** only when they are recurrent, unexpected and followed by a month of worry or avoidance. Elsewhere, add the specifier “with panic attacks”.
:::

## 2.3 Agoraphobia [core]
- Marked fear about **at least 2 of 5** situations:
  1. Public transport
  2. Open spaces (markets, parking lots, bridges)
  3. Enclosed places (shops, cinemas, lifts)
  4. Standing in line or being in a crowd
  5. Being outside the home alone
- Feared because **escape might be difficult or help unavailable** if panic or embarrassing symptoms occur.
- Situations are avoided, need a companion, or are endured with intense fear; lasting **6 months or more**.
- Diagnosed independently of panic disorder (both may be given).

## 2.4 Social anxiety disorder [core]
- Marked fear of social situations where the person may be **scrutinised** by others: conversations, meeting new people, eating or drinking in front of others, performing or speaking.
- Fears acting in a way, or showing symptoms (blushing, trembling), that will be **negatively evaluated**.
- Situations avoided or endured with intense fear; **6 months or more**.
- Specifier: **performance only** (for example only public speaking).
- In children, the fear must occur with peers, not just with adults.
- Differ from shyness by severity and impairment; from avoidant personality by being more situation-specific.

## 2.5 Specific phobia [core]
- Marked fear of a **specific object or situation**, almost always provoking immediate fear; actively avoided; **6 months or more**.
| Type | Examples |
|---|---|
| Animal | Dogs, snakes, spiders, insects |
| Natural environment | Heights, storms, water |
| Blood–injection–injury | Needles, blood, medical procedures |
| Situational | Flying, lifts, enclosed spaces, driving |
| Other | Choking, vomiting, loud sounds, costumed characters (children) |

:::note The fainting phobia
Blood–injection–injury phobia is unusual: heart rate rises then **drops** (a vasovagal response), so people can **faint**. Treatment includes **applied tension** (tensing muscles to raise blood pressure) along with exposure.
:::

## 2.6 Separation anxiety and selective mutism [core]
### Separation anxiety disorder
- Developmentally inappropriate, excessive fear of separation from attachment figures, with **at least 3 of 8** features: distress at separation, worry about harm to them, worry about an event causing separation (getting lost, kidnapped), refusal to go out or to school, fear of being alone, refusal to sleep away, nightmares about separation, physical complaints when separation is expected.
- Duration: **at least 4 weeks** in children and adolescents, typically **6 months** in adults. Can begin in adulthood.

### Selective mutism
- Consistent failure to speak in specific situations where speech is expected (school), **despite speaking normally** in others (home).
- Lasts **at least 1 month**, not limited to the first month of school.
- Not due to lack of language knowledge or a communication disorder. Closely linked with social anxiety.

## 2.7 Medical and substance causes [core]
| Category | Examples |
|---|---|
| Endocrine | **Hyperthyroidism**, hypoglycaemia, phaeochromocytoma, hyperparathyroidism |
| Heart and lungs | Arrhythmias, angina, asthma, COPD, pulmonary embolism |
| Neurological | Temporal lobe epilepsy, vestibular problems |
| Substances | Caffeine, nicotine, stimulants, cannabis; **withdrawal** from alcohol and benzodiazepines |
| Medicines | Salbutamol, steroids, thyroxine excess, decongestants |

:::safety Rule out the heart
A first “panic attack” with chest pain in someone with cardiac risk factors needs an ECG and medical review. Panic disorder is diagnosed after medical causes are reasonably excluded.
:::

:::recall
1. GAD: duration, number of symptoms, and the six symptoms. || 6 months; 3 of 6 (1 in children); restless, fatigue, concentration, irritable, tension, sleep.
2. Panic attack: how fast and how many symptoms? || Peaks within minutes; at least 4 of 13.
3. What turns panic attacks into panic disorder? || Recurrent unexpected attacks plus 1 month of worry or avoidance.
4. Name the 5 agoraphobic situations. || Transport, open spaces, enclosed places, queues or crowds, alone outside home.
5. Which phobia causes fainting, and what treats it? || Blood–injection–injury; applied tension plus exposure.
6. Give the durations for separation anxiety and selective mutism. || 4 weeks in children (6 months adults); 1 month, not the first month of school.
7. Name six medical or substance causes of anxiety. || Hyperthyroidism, hypoglycaemia, phaeochromocytoma, arrhythmia, asthma, caffeine, alcohol withdrawal, salbutamol.
:::

# Part III · Treatment

## 3.1 Psychological treatment: exposure is the engine [core]
:::define Exposure
Repeated, prolonged contact with feared situations, sensations or thoughts **without escape or safety behaviours**, until fear falls and new learning (“it's safe”) takes hold.
:::

| Technique | How it works |
|---|---|
| Graded exposure | Build a ladder (hierarchy) from least to most feared; climb step by step |
| Systematic desensitisation (Wolpe) | Relaxation paired with imagined or real steps up the hierarchy (reciprocal inhibition) |
| Flooding | Prolonged exposure at the top of the hierarchy from the start |
| Interoceptive exposure | Bringing on feared body sensations deliberately (spinning, breathing through a straw) for panic |
| Cognitive restructuring | Testing catastrophic beliefs against evidence |
| Behavioural experiments | Dropping safety behaviours to see what really happens |
| Applied relaxation, worry time, problem-solving | GAD |

### By disorder
- **Panic disorder**: psychoeducation (panic is not dangerous), Clark's model, interoceptive exposure, situational exposure, drop safety behaviours.
- **GAD**: CBT for worry, intolerance of uncertainty, applied relaxation.
- **Social anxiety**: cognitive therapy with video feedback, attention retraining, exposure without safety behaviours.
- **Specific phobia**: exposure is highly effective, sometimes in a single long session.
- **Children**: CBT with parental involvement.

## 3.2 Medicines [core]
| Medicine | Use | Notes |
|---|---|---|
| **SSRIs** (sertraline, escitalopram, paroxetine, fluoxetine) | First-line for panic, GAD, social anxiety | **Start low** in panic (early jitteriness); takes 2 to 6 weeks; continue **6 to 12 months** after response |
| **SNRIs** (venlafaxine, duloxetine) | GAD, panic, social anxiety | Monitor blood pressure with venlafaxine |
| Pregabalin | GAD | Can be misused |
| Buspirone | GAD | Slow onset; no dependence |
| **Benzodiazepines** (clonazepam, lorazepam) | Short-term relief only | **2 to 4 weeks**; dependence, tolerance, falls, interact with alcohol; avoid long-term |
| Propranolol | Performance anxiety (tremor, palpitations) | Not for asthma; doesn't treat the worry |

:::trap The benzodiazepine trap
Benzodiazepines work fast, so patients love them, but long-term use brings dependence and withdrawal anxiety that looks like the original disorder. They also block learning from exposure. Use briefly, as a bridge while an SSRI and CBT take effect.
:::

:::word Psychoeducation for panic
“What you felt was a panic attack: your body's alarm firing at full volume. It feels terrifying but it isn't dangerous; it can't make your heart stop or make you go mad. It peaks within about ten minutes and settles on its own. The more we avoid, the louder the alarm gets; we'll turn it down step by step.”
:::

:::recall
1. Define exposure and name four techniques. || Contact with feared things without escape; graded exposure, systematic desensitisation, flooding, interoceptive exposure.
2. What is interoceptive exposure, and for which disorder? || Bringing on feared body sensations deliberately; panic disorder.
3. What is first-line medicine for most anxiety disorders, and what's special about starting it in panic? || SSRIs; start low because of early jitteriness.
4. How long should benzodiazepines be used? || Short term, about 2 to 4 weeks.
5. When is propranolol useful? || Performance anxiety with tremor and palpitations.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Discuss the aetiology, clinical features and management of panic disorder. (10 marks)
1. Definitions: panic attack (4 of 13, peak in minutes) and panic disorder (recurrent unexpected plus 1 month of worry or avoidance).
2. Epidemiology and association with agoraphobia and depression.
3. Aetiology: fear circuit, noradrenaline and GABA, genetics, two-factor theory, Clark's cognitive model.
4. Clinical features with an example; Indian body-framed presentations.
5. Differential: cardiac, thyroid, hypoglycaemia, phaeochromocytoma, asthma, substances and withdrawal.
6. Management: psychoeducation, CBT with interoceptive and situational exposure, SSRIs (start low), short benzodiazepine bridge only; duration.
7. Prognosis: chronic but treatable; worse with agoraphobia and comorbid depression.
:::

:::word Short note: systematic desensitisation
Developed by Wolpe on the principle of reciprocal inhibition: a person cannot be relaxed and anxious at once. Steps: training in deep muscle relaxation; building an anxiety hierarchy from least to most feared; then gradually pairing relaxation with each step, imagined or real, moving up only when anxiety at the current step is low. Used for specific phobias. Contrast flooding, which starts at the top of the hierarchy without graded steps.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Duration for GAD? :: At least 6 months.
How many GAD symptoms are needed in adults and in children? :: Three of six in adults; one in children.
How quickly does a panic attack peak? :: Within minutes.
How many symptoms define a panic attack? :: At least 4 of 13.
What makes it panic disorder? :: Recurrent unexpected attacks plus a month of worry or avoidance.
How many agoraphobic situations are required? :: Two of five.
Duration for social anxiety, phobia and agoraphobia? :: Six months.
Which phobia causes fainting? :: Blood–injection–injury.
Treatment for fainting in that phobia? :: Applied tension with exposure.
Duration of separation anxiety in children? :: At least four weeks.
Duration of selective mutism? :: One month, not the first month of school.
Clark's model in one line? :: Catastrophic misinterpretation of body sensations.
Two-factor theory? :: Fear acquired by classical conditioning, maintained by avoidance.
Who developed systematic desensitisation? :: Joseph Wolpe.
First-line medicine for anxiety disorders? :: SSRIs.
Why start SSRIs low in panic? :: Early jitteriness can worsen anxiety.
Limit for benzodiazepine use? :: About two to four weeks.
Endocrine mimic of panic? :: Hyperthyroidism (also phaeochromocytoma, hypoglycaemia).
:::

## 4.3 Module test [core]
:::mcq
Q: A woman has worried about many things for 8 months, with restlessness, fatigue and poor sleep. Diagnosis:
- Panic disorder
- *Generalised anxiety disorder
- Social anxiety disorder
- Adjustment disorder
> Six months of hard-to-control worry about many things with at least three symptoms.

Q: A panic attack must peak within:
- An hour
- *Minutes
- A day
- Seconds only
> An abrupt surge that peaks within minutes.

Q: After three unexpected panic attacks a man avoids exercise for 6 weeks for fear of another. Diagnosis:
- Agoraphobia
- *Panic disorder
- Specific phobia
- GAD
> Recurrent unexpected attacks with over a month of behaviour change.

Q: Fear of buses, markets and queues because escape would be hard during panic is:
- Social anxiety
- *Agoraphobia
- Claustrophobia only
- GAD
> At least two of the five agoraphobic situations.

Q: A student faints at the sight of blood. The recommended technique is:
- Flooding without precautions
- *Applied tension with exposure
- Benzodiazepines long term
- Propranolol
> Counteracts the vasovagal drop in blood pressure.

Q: A child talks freely at home but has not spoken at school for 3 months. Diagnosis:
- Autism
- *Selective mutism
- Separation anxiety
- Language disorder
> Failure to speak in specific settings despite normal speech elsewhere.

Q: Which is the core cognitive feature of panic disorder in Clark's model?
- Intolerance of uncertainty
- *Catastrophic misinterpretation of body sensations
- Fear of negative evaluation
- Intrusive images of trauma
> Palpitations read as a heart attack.

Q: Which is first-line long-term medicine for panic disorder?
- Clonazepam
- *An SSRI started at a low dose
- Haloperidol
- Propranolol
> SSRIs; benzodiazepines only briefly.

Q: Which condition most commonly mimics an anxiety disorder?
- Hypothyroidism
- *Hyperthyroidism
- Addison's disease
- Hypercalcaemia
> Tremor, palpitations, sweating and weight loss.

Q: Systematic desensitisation is based on:
- Flooding
- *Reciprocal inhibition
- Aversive conditioning
- Free association
> Relaxation and anxiety can't coexist.

Q: A violinist has tremor and palpitations only before concerts. Most useful as-needed medicine:
- Clonazepam daily
- *Propranolol before performance
- An antipsychotic
- Lithium
> For performance-only symptoms.

Q: Why do long-term benzodiazepines hinder recovery?
- They cause psychosis
- *They cause dependence and block learning from exposure
- They raise blood pressure
- They are too slow
> Short relief, long-term trap.
:::
`;
