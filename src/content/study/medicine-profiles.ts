import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "medicine-profiles",
  num: 23,
  title: "Medicines one by one",
  emoji: "💊",
  tagline: "A profile card for every medicine you will meet in clinic: what it is for, what to watch, what to check",
  when: "Revision, any time after Module 12",
  outcomes: [
    "Give a one-line profile of each commonly used psychiatric medicine",
    "Name the side effect that most often stops each one being used",
    "Say what must be checked before and during each medicine",
    "Pick out the medicines that need special care in pregnancy, older age, heart, liver and kidney disease",
    "Recognise the dangerous combinations seen in Indian practice",
  ],
  writeTask:
    "On paper, from memory: for ten medicines of your choice (at least two from each group), write the group, two main uses, the side effect that matters most, and what you check. Then check against the cards and correct in red.",
  activities: [
    act.detective("Clinic detective", "Guess the medicine from its clues."),
    act.lesson("ms-1", "Quiz: lithium", "Levels, toxicity and monitoring."),
    act.coach("pharmacology", "Coach: medicines", "Chai repeats the ones you mix up."),
  ],
};

export const text = String.raw`
# Part I · Antidepressants

## 1.1 SSRIs, card by card [core]
All SSRIs block the serotonin transporter. They share early nausea, jitteriness, headache, sexual side effects, low sodium in older people and bleeding risk with NSAIDs or blood thinners. What differs is below.

| Medicine | Stands out for | Watch for | Notes |
|---|---|---|---|
| **Fluoxetine** | First choice in children and adolescents; bulimia; long half-life, so missed doses matter little | Early agitation, insomnia; strong CYP2D6 inhibitor (raises levels of some drugs) | Few discontinuation symptoms; takes weeks to wash out before an MAOI |
| **Sertraline** | Heart disease; often preferred in pregnancy and breastfeeding | Loose stools early | Few interactions; a good all-round first choice |
| **Escitalopram** | Depression and anxiety disorders; well tolerated | QT prolongation at higher doses (and citalopram) | Respect the maximum dose, especially in older people |
| **Paroxetine** | Anxiety disorders | Most **discontinuation** symptoms, weight gain, sexual side effects, anticholinergic effects; avoided in pregnancy | Taper slowly |
| **Fluvoxamine** | OCD | Strong **CYP1A2** inhibitor: raises clozapine, olanzapine, caffeine and theophylline | Check every co-prescribed medicine |

:::trap The SSRI that changes other medicines
Fluvoxamine can raise clozapine levels several-fold. Fluoxetine and paroxetine raise levels of drugs broken down by CYP2D6 (for example some antipsychotics, tricyclics, beta blockers). Sertraline, escitalopram and citalopram have fewer such interactions.
:::

:::recall
1. Which SSRI is first choice in adolescents? || Fluoxetine.
2. Which SSRI causes the most discontinuation symptoms? || Paroxetine.
3. Which SSRI raises clozapine levels most? || Fluvoxamine (CYP1A2).
4. Which SSRIs need care with QT at higher doses? || Citalopram and escitalopram.
:::

:::mcq
Q: A woman on clozapine is started on fluvoxamine for OCD. A week later she is very sedated and has a seizure. The most likely reason is:
- Clozapine was stopped
- *Fluvoxamine blocked CYP1A2 and raised clozapine levels
- Fluvoxamine causes seizures on its own at any dose
- She stopped smoking
> Check interactions before adding any medicine to clozapine.

Q: A 70-year-old man with depression and heart disease needs an SSRI. Which is usually the safest start?
- Paroxetine
- High-dose citalopram
- *Sertraline
- Fluvoxamine
> Few interactions and good heart safety data.
:::

## 1.2 The other antidepressants, card by card [core]
| Medicine | How it works | Stands out for | Watch for | Check |
|---|---|---|---|---|
| **Venlafaxine** | Serotonin, then noradrenaline reuptake block (SNRI) at higher doses | Depression, GAD, when SSRIs fail | **Raised blood pressure**, sweating, nausea, bad discontinuation, dangerous in overdose | BP |
| **Duloxetine** | SNRI | Depression with **pain** (neuropathy), GAD | Nausea, liver effects (avoid in heavy drinkers) | Liver if risk |
| **Mirtazapine** | Blocks alpha-2, 5-HT2, 5-HT3 and H1 | Poor sleep and appetite, older people, few sexual side effects | **Weight gain, sedation** | Weight |
| **Bupropion** | Noradrenaline and dopamine reuptake block | Fewer sexual side effects, smoking cessation, low energy | **Seizures** (avoid in epilepsy, eating disorders), insomnia, anxiety | Seizure history |
| **Trazodone** | 5-HT2 blocker, weak reuptake block | Insomnia with depression (low dose) | Sedation, postural drop, rarely priapism | |
| **Amitriptyline** | Tricyclic: serotonin and noradrenaline reuptake block plus many receptors | Pain, migraine prevention, sleep (low doses) | **Anticholinergic** effects, postural drop, weight, **heart rhythm**; **lethal in overdose** | ECG if heart disease; small supplies |
| **Clomipramine** | Serotonergic tricyclic | OCD | As amitriptyline, plus seizures at high doses | ECG |
| **Imipramine** | Tricyclic | Older uses include enuresis | As above | |
| **Agomelatine** | Melatonin agonist, 5-HT2C blocker | Sleep and rhythm, few sexual side effects | Liver injury | **Liver tests** before and during |
| **Vortioxetine** | Mixed serotonin actions | Cognitive symptoms, few sexual side effects | Nausea | |
| **Esketamine** (nasal) | NMDA blocker | Treatment-resistant depression, specialist clinic | Dissociation, BP rise, misuse potential | BP, observation after dose |

:::analogy Tricyclics: a key that opens too many locks
A tricyclic fits the serotonin and noradrenaline locks (helpful) but also the histamine, acetylcholine and alpha locks (sleepiness, dry mouth, dizziness) and the heart's sodium channels (dangerous in overdose). Newer medicines fit fewer locks.
:::

:::recall
1. Which antidepressant raises blood pressure at higher doses? || Venlafaxine.
2. Which suits a thin, sleepless older person? || Mirtazapine.
3. Which is avoided in epilepsy and eating disorders, and why? || Bupropion; seizure risk.
4. Which antidepressant needs liver tests? || Agomelatine.
:::

:::mcq
Q: A man with depression and painful diabetic neuropathy. Which antidepressant can help both?
- Fluoxetine
- *Duloxetine
- Bupropion
- Agomelatine
> SNRIs, and low-dose amitriptyline, help neuropathic pain.

Q: A young woman with depression and a past eating disorder with vomiting asks for bupropion to avoid weight gain. The concern is:
- Weight gain
- *Higher seizure risk in eating disorders
- QT prolongation
- Low sodium
> Bupropion is avoided in eating disorders and epilepsy.
:::

# Part II · Antipsychotics

## 2.1 Antipsychotics, card by card [core]
| Medicine | Stands out for | Main problems | Check |
|---|---|---|---|
| **Haloperidol** | Acute agitation, delirium (short term), depot form | **EPS** (dystonia, parkinsonism, akathisia), raised prolactin, QT (IV) | ECG if IV or heart risk; movements |
| **Chlorpromazine** | Old, sedating | Sedation, postural drop, anticholinergic effects, photosensitivity, weight | BP |
| **Trifluoperazine** | Low cost oral typical | EPS | Movements |
| **Risperidone** | Effective, widely used, depot forms | **Prolactin** rise, EPS at higher doses, weight | Prolactin if symptoms, metabolic |
| **Paliperidone** | Monthly or three-monthly injection | As risperidone; kidney clearance | Kidney function |
| **Olanzapine** | Effective, sedating, acute mania | **Weight gain, diabetes, lipids** (high) | Weight, glucose, lipids |
| **Quetiapine** | Bipolar depression, sleep, Parkinson's psychosis (low dose) | Sedation, postural drop, weight; little EPS or prolactin | Metabolic |
| **Aripiprazole** | Partial agonist; weight-friendly; lowers prolactin | **Akathisia**, insomnia, nausea; impulse control problems (gambling, shopping) | Ask about impulse problems |
| **Amisulpride** | Effective, little sedation | Prolactin rise; kidney clearance; QT | Kidney, prolactin |
| **Lurasidone** | Bipolar depression; low metabolic risk | Akathisia; take with food | |
| **Clozapine** | Treatment-resistant schizophrenia; suicidal behaviour | **Agranulocytosis**, myocarditis, seizures, **constipation**, drooling, weight | **Blood counts** on schedule, troponin early, bowels |

:::mnemonic Which one for which worry
Worried about weight: aripiprazole, lurasidone. Worried about periods and milk: not risperidone, paliperidone or amisulpride. Worried about movements: quetiapine, clozapine. Nothing else has worked: clozapine.
:::

:::recall
1. Which antipsychotics raise prolactin most? || Risperidone, paliperidone, amisulpride.
2. Which carry the highest metabolic risk? || Olanzapine and clozapine.
3. Name aripiprazole's main side effect and one unusual one. || Akathisia; impulse control problems.
4. Which antipsychotic is used at low dose in Parkinson's psychosis? || Quetiapine (or clozapine).
:::

:::mcq
Q: A man on aripiprazole starts gambling away his salary, which he never did before. Best step:
- Diagnose gambling disorder only
- *Consider the medicine: aripiprazole can cause impulse control problems; review and switch
- Increase the dose
- Add a benzodiazepine
> Dopamine partial agonists can trigger compulsive gambling and shopping.

Q: A 24-year-old woman with schizophrenia and obesity worries about weight. A reasonable choice is:
- Olanzapine
- Clozapine first-line
- *Aripiprazole or lurasidone
- Chlorpromazine
> Lower metabolic risk.
:::

## 2.2 Medicines that treat side effects [core]
| Medicine | Used for | Caution |
|---|---|---|
| **Trihexyphenidyl**, **benztropine**, **procyclidine** | Acute dystonia, parkinsonism | Memory problems, constipation, misuse ("high"); can worsen tardive dyskinesia; don't give routinely |
| **Propranolol** | Akathisia, performance anxiety, lithium tremor | Avoid in asthma; slow pulse |
| **Metformin** | Antipsychotic weight gain | Kidney function |
| **Hyoscine**, **glycopyrrolate** | Clozapine drooling | Anticholinergic load |
| **Laxatives** (macrogol, senna) | Clozapine constipation | Start early; ask at every visit |
| **Tetrabenazine**, **valbenazine** | Tardive dyskinesia | Depression with tetrabenazine |

:::recall
1. Which medicines treat acute dystonia? || Anticholinergics: procyclidine, benztropine, trihexyphenidyl.
2. Why not give anticholinergics routinely? || Memory problems, misuse, and they can worsen tardive dyskinesia.
3. What treats akathisia best? || Propranolol.
:::

:::mcq
Q: A patient on clozapine has not opened his bowels for 4 days and has abdominal pain. The right response is:
- Wait another week
- *Urgent medical review: clozapine constipation can lead to life-threatening bowel obstruction
- Add an anticholinergic
- Increase clozapine
> Constipation on clozapine is an emergency until proved otherwise.
:::

# Part III · Mood stabilisers, sedatives and others

## 3.1 Mood stabilisers, card by card [core]
| Medicine | Stands out for | Biggest danger | Check |
|---|---|---|---|
| **Lithium** | Mania, maintenance, **suicide prevention**, augmenting antidepressants | Narrow range: **toxicity** with dehydration, NSAIDs, ACE inhibitors, thiazides; kidney and thyroid effects | Levels (12 hours after dose), kidney, thyroid, calcium |
| **Valproate** | Mania, mixed states, rapid cycling | **Birth defects and lower IQ** in exposed children; liver, pancreas, low platelets, weight, hair loss | Liver, blood count; contraception |
| **Carbamazepine** | Second-line mania; epilepsy | **Stevens–Johnson** (HLA-B*1502), low sodium, low blood counts, many interactions (lowers the pill) | Blood count, sodium, liver; HLA test |
| **Oxcarbazepine** | Similar, fewer interactions | **Low sodium** | Sodium |
| **Lamotrigine** | **Preventing bipolar depression** | **Rash** (slow titration; valproate doubles levels) | Skin |

:::recall
1. Name the two medicines that raise lithium levels from the GP's shelf. || NSAIDs (ibuprofen) and ACE inhibitors (also thiazides).
2. Which mood stabiliser is mainly for preventing bipolar depression? || Lamotrigine.
3. Which mood stabiliser needs an HLA test in Asian patients? || Carbamazepine (HLA-B*1502).
:::

:::mcq
Q: A woman on carbamazepine for bipolar disorder gets pregnant while taking the oral contraceptive pill. The likely reason is:
- The pill doesn't work in bipolar disorder
- *Carbamazepine induces liver enzymes and lowers the pill's levels
- Lithium interaction
- She had a rash
> Enzyme inducers make the pill unreliable; advise other contraception.

Q: A man on lithium has a level of 1.9 mmol/L, coarse tremor and vomiting. First step:
- Continue and recheck next month
- *Stop lithium, give fluids, check kidneys and ECG, and consider dialysis if severe
- Halve the dose and continue
- Add propranolol
> Lithium toxicity is an emergency.
:::

## 3.2 Sedatives, sleep, dementia and ADHD medicines [core]
| Medicine | Stands out for | Watch for |
|---|---|---|
| **Lorazepam** | Catatonia, agitation, alcohol withdrawal in liver disease | Dependence, breathing with opioids |
| **Clonazepam** | Panic (short term), akathisia | Dependence, falls |
| **Diazepam**, **chlordiazepoxide** | Alcohol withdrawal; tapering | Long-acting; build up in older people and liver disease |
| **Alprazolam** | Fast relief, but avoid | Strong dependence and rebound; commonly misused |
| **Zolpidem**, **zopiclone** | Short-term insomnia | Dependence; sleepwalking and complex sleep behaviours |
| **Melatonin** | Sleep onset, older people, children with autism or ADHD | Mild |
| **Pregabalin** | GAD | Misuse, dizziness, weight; dangerous with opioids |
| **Buspirone** | GAD; no dependence | Slow onset |
| **Donepezil**, **rivastigmine**, **galantamine** | Alzheimer's (mild to moderate), Lewy body, Parkinson's dementia | Nausea, slow pulse, fainting |
| **Memantine** | Moderate to severe Alzheimer's | Dizziness, confusion |
| **Methylphenidate** | ADHD | Appetite, sleep, growth, pulse and BP; misuse |
| **Atomoxetine** | ADHD with tics, anxiety or misuse risk | Slow onset, liver, suicidal thoughts in young people |
| **Naltrexone** | Alcohol and opioid relapse prevention | Opioid withdrawal if still using; liver |
| **Acamprosate** | Alcohol craving | Kidney failure |
| **Disulfiram** | Alcohol, with consent | Reaction with alcohol; heart disease; never given secretly |
| **Buprenorphine** | Opioid substitution | Start in moderate withdrawal |

:::recall
1. Which benzodiazepine is preferred in liver disease? || Lorazepam (or oxazepam).
2. Which dementia medicine is for moderate to severe Alzheimer's? || Memantine.
3. Which ADHD medicine suits a child with tics? || Atomoxetine.
4. Which alcohol medicine is avoided in kidney failure? || Acamprosate.
:::

:::mcq
Q: A man on donepezil faints twice and his pulse is 44. The most likely cause is:
- Dementia progression
- *Donepezil slowing the heart
- Low sodium from donepezil
- Anxiety
> Cholinesterase inhibitors can cause slow pulse and fainting.

Q: A family asks you to mix disulfiram into their son's food without telling him. The correct response is:
- Agree; it's for his good
- *Refuse: it is unethical and dangerous; offer treatment he can agree to
- Agree if the dose is small
- Ask the chemist to do it
> A disulfiram reaction after drinking can be dangerous; consent is essential.
:::

## 3.3 Dangerous combinations seen in practice [core]
| Combination | What can happen |
|---|---|
| SSRI or SNRI + **tramadol**, triptans, linezolid, St John's wort, MAOI | **Serotonin syndrome** |
| Benzodiazepine or pregabalin + **alcohol** or **opioids** | **Stopped breathing** |
| Lithium + **NSAIDs**, ACE inhibitors, thiazides, dehydration | **Lithium toxicity** |
| Clozapine + **stopping smoking**, fluvoxamine, ciprofloxacin | **High clozapine levels**: sedation, seizures |
| Carbamazepine + the **pill**, other medicines | Lower levels, failed contraception |
| Valproate + **lamotrigine** | Doubled lamotrigine levels: rash |
| Many anticholinergics together (tricyclic + chlorpromazine + trihexyphenidyl + antihistamine) | **Delirium** in older people |
| QT drugs together (citalopram high dose + IV haloperidol + some antibiotics) | Dangerous heart rhythm |
| SSRI + **NSAID**, aspirin, blood thinner | **Bleeding** (stomach) |

:::note Ask about everything
In India many people buy painkillers, cough syrups and sleeping tablets over the counter, and take Ayurvedic or homeopathic preparations. Ask about every tablet, syrup and powder at every visit.
:::

:::recall
1. Name three medicines that cause serotonin syndrome with an SSRI. || Tramadol, triptans, linezolid, MAOIs, St John's wort.
2. Which combination can stop breathing? || Benzodiazepines or pregabalin with alcohol or opioids.
3. Which combination doubles lamotrigine levels? || Valproate with lamotrigine.
:::

:::mcq
Q: A woman on escitalopram is given tramadol for a fracture and becomes agitated, sweaty and tremulous with jerking legs. Diagnosis:
- NMS
- *Serotonin syndrome
- Alcohol withdrawal
- Anxiety attack
> Tramadol is serotonergic; stop the drugs and support.
:::

# Part IV · Exam zone

## 4.1 Viva rapid-fire [core]
:::viva
SSRI first choice in adolescents? :: Fluoxetine.
SSRI with the worst discontinuation? :: Paroxetine.
Antidepressant that raises BP? :: Venlafaxine.
Antidepressant for sleep and appetite in the elderly? :: Mirtazapine.
Antidepressant for smoking cessation? :: Bupropion.
Antidepressant needing liver tests? :: Agomelatine.
Antipsychotic with impulse control side effects? :: Aripiprazole.
Antipsychotic for Parkinson's psychosis? :: Low-dose quetiapine or clozapine.
Clozapine's killer side effects? :: Agranulocytosis, myocarditis, bowel obstruction.
Mood stabiliser for preventing bipolar depression? :: Lamotrigine.
Benzodiazepine in liver disease? :: Lorazepam.
ADHD medicine without misuse potential? :: Atomoxetine.
Alcohol medicine avoided in kidney failure? :: Acamprosate.
:::

## 4.2 Module test [core]
:::mcq
Q: A man with OCD on clozapine. Which SSRI should be avoided?
- Sertraline
- Escitalopram
- *Fluvoxamine
- Fluoxetine at a low dose
> Fluvoxamine raises clozapine levels a lot.

Q: Which medicine is most dangerous in overdose?
- Sertraline
- Mirtazapine
- *Amitriptyline
- Escitalopram
> Tricyclics cause heart rhythm problems and seizures in overdose.

Q: A woman on risperidone has milk from her breasts. Which switch is most likely to help?
- Amisulpride
- Paliperidone
- *Aripiprazole
- Haloperidol
> Aripiprazole lowers prolactin.

Q: A patient starting carbamazepine should have which test first in an Indian population?
- G6PD
- *HLA-B*1502
- TPMT
- HLA-B*5701
> To reduce the risk of Stevens–Johnson syndrome.

Q: A man on lithium is prescribed ramipril for blood pressure. The risk is:
- Low lithium levels
- *Lithium toxicity
- Serotonin syndrome
- Seizures
> ACE inhibitors raise lithium levels.

Q: A child with ADHD and tics needs medicine. A good first choice may be:
- High-dose methylphenidate
- *Atomoxetine
- Haloperidol
- Alprazolam
> Atomoxetine does not worsen tics.

Q: Which medicine needs a blood count on a fixed schedule?
- Sertraline
- *Clozapine
- Quetiapine
- Melatonin
> Weekly for 18 weeks, then less often.

Q: An older man on amitriptyline, chlorpromazine and trihexyphenidyl becomes confused. The most likely cause is:
- Alzheimer's disease
- *Combined anticholinergic load causing delirium
- Serotonin syndrome
- Lithium toxicity
> Add up the anticholinergic burden.
:::
`;
