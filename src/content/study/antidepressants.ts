import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "antidepressants",
  num: 10,
  title: "Antidepressants",
  emoji: "💊",
  tagline: "How each class works, what it does to the body, and how to use them safely",
  when: "Weeks 7 to 8",
  outcomes: [
    "Name the main antidepressant classes, how each works and examples used in India",
    "Describe the common and dangerous side effects of each class",
    "Recognise and manage serotonin syndrome, discontinuation symptoms, hyponatraemia and tricyclic overdose",
    "Choose an antidepressant for a patient's profile, including pregnancy, older age and young people",
    "Explain timing, dose, duration, switching and the MAOI washout rules",
  ],
  writeTask:
    "On paper, from memory: a table of classes (mechanism, two examples, two key side effects), the serotonin syndrome triad, the FINISH discontinuation symptoms, the four receptor blocks behind tricyclic side effects, the tyramine reaction, and the washout rules. Then check and correct in red.",
  activities: [
    act.lesson("ad-1", "Quiz: classes and timing", "Mechanisms and the 2 to 6 week rule."),
    act.lesson("ad-2", "Quiz: safety and emergencies", "Serotonin syndrome, overdose, hyponatraemia."),
    act.detective("Clinic detective", "Guess the medicine from its clues."),
    act.coach("pharmacology", "Coach: pharmacology", "The medicines and effects you confuse."),
  ],
  noteId: "antidepressants",
};

export const text = String.raw`
# Part I · How they work

## 1.1 The big picture [core]
Antidepressants are used for depression, anxiety disorders, OCD, PTSD, bulimia, chronic pain and more. Almost all of them **increase signalling by serotonin, noradrenaline or both**, but mood improves only after **2 to 6 weeks**, as the brain adapts (receptor changes, BDNF, new connections).

:::define The timing rule patients must hear
Side effects come in the first days; benefit builds over 2 to 6 weeks; full effect by about 4 to 8 weeks. Sleep and energy often improve before mood. Don't stop early, and never stop suddenly.
:::

| Class | How it works | Examples |
|---|---|---|
| SSRIs | Block the serotonin reuptake pump (SERT) | Fluoxetine, sertraline, escitalopram, paroxetine, fluvoxamine, citalopram |
| SNRIs | Block serotonin and noradrenaline reuptake | Venlafaxine, desvenlafaxine, duloxetine |
| NDRI | Blocks noradrenaline and dopamine reuptake | Bupropion |
| Alpha-2 antagonist (NaSSA) | Blocks alpha-2 autoreceptors, releasing serotonin and noradrenaline; blocks 5-HT2, 5-HT3 and H1 | Mirtazapine |
| Tricyclics (TCAs) | Block serotonin and noradrenaline reuptake; also block many other receptors | Amitriptyline, imipramine, clomipramine, nortriptyline, dothiepin |
| MAOIs | Block monoamine oxidase, the enzyme that breaks down monoamines | Phenelzine, tranylcypromine; moclobemide (reversible, MAO-A) |
| Serotonin modulators | Mixed reuptake block and receptor effects | Trazodone, vortioxetine, vilazodone |
| Melatonergic | Melatonin agonist and 5-HT2C antagonist | Agomelatine |
| Rapid-acting | NMDA receptor antagonist | Esketamine (nasal), ketamine |

:::recall
1. What do almost all antidepressants increase? || Serotonin and/or noradrenaline signalling.
2. When does benefit start, and when is full effect expected? || 2 to 6 weeks; about 4 to 8 weeks.
3. Name the class and two examples for: SSRI, SNRI, NDRI, NaSSA. || Sertraline, escitalopram; venlafaxine, duloxetine; bupropion; mirtazapine.
:::

# Part II · The classes

## 2.1 SSRIs [core]
First-line for depression and most anxiety disorders: effective, safer in overdose, once daily.

| Common side effects | Why |
|---|---|
| Nausea, loose stools, stomach upset (early) | Gut 5-HT3 receptors |
| Headache, jitteriness, anxiety, insomnia (early) | Activation; start low in anxiety |
| **Sexual dysfunction** (low libido, delayed orgasm or ejaculation) | 5-HT2 effects; common and under-reported: ask |
| Sweating, yawning | |
| Emotional blunting | |

| Important risks | Who and what to do |
|---|---|
| **Hyponatraemia** (SIADH) | Older adults, diuretics. Confusion, falls. Check sodium |
| **Bleeding** | With NSAIDs, aspirin, anticoagulants. Platelets need serotonin. Consider gastric protection |
| **QT prolongation** | Citalopram and escitalopram at higher doses |
| **Suicidal thinking in under-25s** | In the first weeks; review early |
| Switch to mania | In bipolar disorder |
| Serotonin syndrome | With other serotonergic drugs (see 3.1) |

### Differences between SSRIs
| SSRI | Distinguishing point |
|---|---|
| Fluoxetine | Very long half-life (active metabolite): fewer discontinuation symptoms; first choice in children and adolescents; many drug interactions (CYP2D6) |
| Sertraline | Commonly used, including in heart disease and pregnancy |
| Escitalopram | Well tolerated; dose-related QT effect |
| Paroxetine | Short half-life: **worst discontinuation**; more anticholinergic and weight gain; avoid in pregnancy (cardiac defects) |
| Fluvoxamine | Used in OCD; strong CYP1A2 inhibitor (raises clozapine, theophylline, caffeine) |
| Citalopram | QT prolongation limits dose |

## 2.2 SNRIs, bupropion and mirtazapine [core]
| Medicine | Useful when | Watch for |
|---|---|---|
| Venlafaxine | Depression, GAD, panic | **Raised blood pressure** at higher doses; bad discontinuation; dangerous in overdose compared with SSRIs |
| Duloxetine | Depression with **pain** (neuropathy, fibromyalgia), GAD | Nausea; liver caution |
| Bupropion | Fatigue, low energy; avoiding sexual side effects; **smoking cessation** | **Seizures** (avoid in epilepsy, eating disorders, alcohol withdrawal); insomnia, anxiety; no help for anxiety disorders |
| Mirtazapine | Insomnia, poor appetite, older adults; few sexual side effects | **Sedation and weight gain**; rare low white cell count |

## 2.3 Tricyclics [core]
Effective but toxic in overdose; now second-line. Low doses (amitriptyline 10 to 25 mg) are widely used for pain and headache.

:::mnemonic Why tricyclics have so many side effects: four extra blocks
| Receptor blocked | Effects |
|---|---|
| Muscarinic (anticholinergic) | Dry mouth, constipation, urinary retention, blurred vision, confusion in the elderly |
| Histamine H1 | Sedation, weight gain |
| Alpha-1 adrenergic | Postural hypotension, dizziness, falls |
| Cardiac sodium channels | Slowed conduction, arrhythmias: **lethal in overdose** |
:::

:::safety Tricyclic overdose
Even a week's supply can kill. Features: anticholinergic signs (dry skin, dilated pupils, retention), drowsiness then coma, seizures, low BP, and **ECG changes: wide QRS**, arrhythmias. Emergency treatment: airway, ECG monitoring, **sodium bicarbonate** for wide QRS or arrhythmia, treat seizures with benzodiazepines. Prescribe small quantities to patients at risk.
:::

- Avoid in recent heart attack, heart block, glaucoma (narrow angle), prostate enlargement, and in older adults where possible.
- Clomipramine is especially serotonergic: used in OCD.

## 2.4 MAOIs [extra]
- Rarely used now; reserved for resistant or atypical depression.
- **Tyramine (“cheese”) reaction**: with MAO in the gut blocked, tyramine from aged cheese, cured meats, soy sauce, fermented foods, draught beer and some wines enters the blood and causes a **hypertensive crisis** (pounding headache, stiff neck, palpitations, stroke risk).
- Dangerous interactions with other antidepressants, pethidine, tramadol, dextromethorphan, decongestants and stimulants.
- Moclobemide is reversible and MAO-A selective: much lower tyramine risk.

:::define Washout rules
Stop an SSRI or other antidepressant and wait **about 2 weeks** before starting an MAOI; wait **at least 5 weeks after fluoxetine** because of its long half-life. After stopping an irreversible MAOI, wait 2 weeks before starting another antidepressant.
:::

## 2.5 The others [extra]
| Medicine | Notes |
|---|---|
| Trazodone | Sedating; used at low dose for sleep; rare **priapism** (painful erection: emergency) |
| Vortioxetine | Multimodal; may help cognitive symptoms; nausea |
| Agomelatine | Helps sleep; no sexual side effects; **check liver tests** |
| Esketamine (nasal) | Treatment-resistant depression; given in clinic, monitored for dissociation and blood pressure; potential misuse |

:::recall
1. Name five common SSRI side effects. || Nausea, jitteriness, insomnia, sexual dysfunction, sweating.
2. Who is at risk of SSRI-induced hyponatraemia? || Older adults, especially on diuretics.
3. Which SSRI has the worst discontinuation and should be avoided in pregnancy? || Paroxetine.
4. Which SSRI is first choice in adolescents and why? || Fluoxetine: best evidence, long half-life.
5. When is bupropion avoided? || Epilepsy, eating disorders, alcohol or benzodiazepine withdrawal (seizure risk).
6. List the four receptor blocks of TCAs and an effect of each. || Muscarinic (dry mouth), H1 (sedation), alpha-1 (postural drop), sodium channel (arrhythmia).
7. How is a wide QRS in TCA overdose treated? || Sodium bicarbonate.
8. What is the tyramine reaction? || Hypertensive crisis from tyramine-rich foods on an MAOI.
:::

# Part III · Safety

## 3.1 Serotonin syndrome [core]
:::define Serotonin syndrome
Toxicity from too much serotonin, usually after combining serotonergic drugs or raising a dose. Develops within **hours**.
:::
| Domain | Signs |
|---|---|
| Mental state | Agitation, restlessness, confusion |
| Autonomic | Fever, sweating, fast heart rate, high BP, diarrhoea, dilated pupils |
| Neuromuscular | **Clonus** (especially inducible and ocular), **hyperreflexia**, tremor, rigidity (legs more than arms) |

- Common culprits: SSRIs or SNRIs with **tramadol**, triptans, linezolid, MAOIs, St John's wort, lithium, fentanyl, ondansetron in high doses, MDMA.
- Treatment: stop all serotonergic drugs, supportive care, benzodiazepines for agitation, cooling; **cyproheptadine** in moderate cases; ICU for severe (high fever).

:::trap Serotonin syndrome versus neuroleptic malignant syndrome
| | Serotonin syndrome | NMS |
|---|---|---|
| Drug | Serotonergic | Dopamine blocker (antipsychotic) |
| Onset | Hours | Days |
| Muscles | **Clonus, hyperreflexia** | **Lead-pipe rigidity**, slow reflexes |
| Pupils | Dilated | Normal |
| Gut | Diarrhoea, increased bowel sounds | Normal or reduced |
| Course | Resolves within about a day once stopped | Lasts days |
:::

## 3.2 Discontinuation symptoms [core]
Stopping suddenly (especially paroxetine and venlafaxine) causes symptoms within days, lasting up to a few weeks.

:::mnemonic FINISH
**F**lu-like symptoms · **I**nsomnia and vivid dreams · **N**ausea · **I**mbalance (dizziness) · **S**ensory disturbance (“brain zaps”, electric shocks) · **H**yperarousal (anxiety, irritability).
:::
- Prevent by **tapering** over weeks (longer for short half-life drugs). Fluoxetine rarely causes them.
- Distinguish from relapse: discontinuation starts within days and has body symptoms like brain zaps; relapse comes later and looks like the original illness.

## 3.3 Choosing an antidepressant [core]
| Situation | Reasonable choice | Avoid or take care |
|---|---|---|
| Most adults | An SSRI (sertraline, escitalopram) | |
| Adolescents | **Fluoxetine** (with therapy, close review) | Paroxetine, venlafaxine, TCAs |
| Older adults | Sertraline, escitalopram, mirtazapine | TCAs (falls, confusion); check sodium |
| Heart disease | Sertraline | TCAs, high-dose citalopram |
| Insomnia and weight loss | Mirtazapine | |
| Sexual side effects a concern | Bupropion, mirtazapine, agomelatine, vortioxetine | Paroxetine |
| Pain | Duloxetine, low-dose amitriptyline | |
| Pregnancy | Sertraline is commonly preferred; weigh risks and benefits | Paroxetine |
| Breastfeeding | Sertraline | |
| Overdose risk | SSRIs; dispense small amounts | TCAs, venlafaxine |
| Epilepsy | SSRIs at usual doses | Bupropion, high-dose TCAs, clomipramine |
| Bipolar depression | Mood stabiliser first; avoid antidepressant alone | |

### Dose, review and switching
- Start, review at 1 to 2 weeks for side effects and suicidality; increase if partial response by 4 weeks.
- Judge an adequate trial at about **4 to 6 weeks** at a therapeutic dose (longer in OCD and older adults).
- **Switching**: direct switch between most SSRIs; cross-taper when moving to a different class; observe washouts with MAOIs.
- Continue at least **6 to 12 months** after remission (longer for recurrent illness).

:::word Explaining to a patient
“This medicine isn't addictive and doesn't change who you are. For the first week you might feel a little sick or restless; that usually settles. The real benefit comes after two to six weeks. Keep taking it every day, even when you feel better, and when it's time to stop we'll reduce it slowly together.”
:::

:::recall
1. State the three domains of serotonin syndrome, and the key neuromuscular sign. || Mental, autonomic, neuromuscular; clonus with hyperreflexia.
2. Name four drugs that commonly cause serotonin syndrome with an SSRI. || Tramadol, triptans, linezolid, MAOIs, St John's wort.
3. Give five differences between serotonin syndrome and NMS. || Drug, onset, clonus vs rigidity, pupils, gut, duration.
4. Expand FINISH. || Flu-like, insomnia, nausea, imbalance, sensory (brain zaps), hyperarousal.
5. Which antidepressant suits an underweight older adult with insomnia? || Mirtazapine.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Classify antidepressants. Discuss SSRIs in detail. (15 marks)
1. Classification table: class, mechanism, examples.
2. SSRIs: mechanism (SERT block, delayed downstream changes), examples, pharmacokinetic differences (fluoxetine half-life; fluvoxamine and fluoxetine interactions).
3. Indications: depression, anxiety disorders, OCD (higher doses), PTSD, bulimia, PMDD.
4. Side effects: early (gut, activation), sexual, hyponatraemia, bleeding, QT, suicidality in young people, switch to mania.
5. Serious reactions: serotonin syndrome; discontinuation (FINISH).
6. Special groups: children, elderly, pregnancy, heart disease.
7. Practical use: timing, dose, duration, switching.
:::

:::word Short note: tricyclic overdose
Tricyclic antidepressants are highly toxic in overdose because they block cardiac sodium channels, muscarinic, histamine and alpha-1 receptors. Features include anticholinergic signs (dry flushed skin, dilated pupils, urinary retention, ileus), sedation progressing to coma, seizures, hypotension and arrhythmias, with QRS widening on ECG predicting seizures and arrhythmia. Management: airway and breathing, cardiac monitoring, activated charcoal if early and airway safe, intravenous sodium bicarbonate for QRS widening or arrhythmia, benzodiazepines for seizures, and avoid flumazenil. Prevention: small prescriptions and safer antidepressants in patients at risk.
:::

## 4.2 Viva rapid-fire [core]
:::viva
When do antidepressants start to work? :: 2 to 6 weeks; side effects come first.
How do SSRIs work? :: Block the serotonin reuptake pump.
SSRI with the longest half-life? :: Fluoxetine.
SSRI with the worst discontinuation? :: Paroxetine.
SSRI preferred in heart disease? :: Sertraline.
SSRI risk in older adults on diuretics? :: Hyponatraemia.
Why are SSRIs plus NSAIDs risky? :: Bleeding, especially gastrointestinal.
Antidepressant that raises blood pressure at high doses? :: Venlafaxine.
Antidepressant for depression with neuropathic pain? :: Duloxetine.
Antidepressant used to stop smoking? :: Bupropion.
Main risk of bupropion? :: Seizures.
Antidepressant causing sedation and weight gain? :: Mirtazapine.
Antidote for wide QRS in TCA overdose? :: Sodium bicarbonate.
Food reaction with MAOIs? :: Tyramine hypertensive crisis.
Wait after fluoxetine before an MAOI? :: At least 5 weeks.
Rare emergency with trazodone? :: Priapism.
Test to monitor with agomelatine? :: Liver function.
Key sign of serotonin syndrome? :: Clonus and hyperreflexia.
Antidote used in serotonin syndrome? :: Cyproheptadine.
Expand FINISH. :: Flu-like, insomnia, nausea, imbalance, sensory, hyperarousal.
:::

## 4.3 Module test [core]
:::mcq
Q: A patient asks why his mood hasn't improved after 4 days on sertraline. Best answer:
- The dose is wrong
- *Benefit usually builds over 2 to 6 weeks
- He needs a second antidepressant
- It doesn't work in men
> Side effects first; benefit later.

Q: A 78-year-old on sertraline and a thiazide becomes confused and falls. First test:
- Thyroid function
- *Serum sodium
- CT head only
- Lithium level
> SSRI-induced SIADH and hyponatraemia.

Q: Which antidepressant is most dangerous in overdose?
- Sertraline
- Mirtazapine
- *Amitriptyline
- Escitalopram
> TCAs block cardiac sodium channels.

Q: A man on escitalopram is given tramadol and develops agitation, sweating, fever and clonus within hours. Diagnosis:
- Neuroleptic malignant syndrome
- *Serotonin syndrome
- Anticholinergic toxicity
- Alcohol withdrawal
> Serotonergic combination with clonus.

Q: A patient who stopped paroxetine suddenly has dizziness, “electric shocks” in the head and irritability after 3 days. Most likely:
- Relapse of depression
- *Discontinuation syndrome
- Serotonin syndrome
- Stroke
> Early onset with brain zaps after abrupt stop.

Q: Which antidepressant should be avoided in a patient with epilepsy?
- Sertraline
- *Bupropion
- Mirtazapine
- Escitalopram
> Lowers seizure threshold.

Q: An underweight 70-year-old with depression, poor sleep and poor appetite. A sensible choice:
- Bupropion
- *Mirtazapine
- Venlafaxine at high dose
- Amitriptyline
> Sedating, appetite-raising, safe in older adults.

Q: Before starting an MAOI after fluoxetine, wait at least:
- 24 hours
- 1 week
- *5 weeks
- 6 months
> Fluoxetine's active metabolite lasts weeks.

Q: First-choice antidepressant for a 15-year-old with moderate depression, alongside therapy:
- Paroxetine
- Venlafaxine
- *Fluoxetine
- Imipramine
> Best evidence in young people; review closely.

Q: Sexual dysfunction on an SSRI. Which alternative is least likely to cause it?
- Paroxetine
- *Bupropion
- Sertraline at a higher dose
- Clomipramine
> No serotonergic sexual side effects.

Q: Postural hypotension with tricyclics is due to blockade of:
- Muscarinic receptors
- H1 receptors
- *Alpha-1 receptors
- Sodium channels
> Alpha-1 block lowers vascular tone.

Q: A patient on an MAOI eats aged cheese and develops a pounding headache with very high blood pressure. This is:
- Serotonin syndrome
- *Tyramine hypertensive crisis
- Migraine
- NMS
> The classic “cheese reaction”.
:::
`;
