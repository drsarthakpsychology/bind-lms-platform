/* Module · Medicines one by one, Part I (Starting level). Original text written for VIBHA School of Psychology. */
export const part1 = String.raw`
# Part I · Starting: how psychiatric medicines work

## 1.1 Targets, keys and locks [core][starting]
Every psychiatric medicine works by changing how nerve cells signal to each other. Nerve cells pass messages across a tiny gap, the **synapse**, using chemical messengers (**neurotransmitters**) such as serotonin, dopamine, noradrenaline, GABA, glutamate, acetylcholine and histamine. Each messenger fits particular **receptors**, like a key fits a lock.

Medicines act on four main kinds of target:
1. **Receptors**, the locks themselves. A medicine can turn a receptor on, block it, or do something in between.
2. **Transporters** (reuptake pumps), which suck the messenger back into the nerve ending to end the signal. Blocking the pump leaves more messenger in the gap.
3. **Enzymes**, which break messengers down. Blocking the enzyme keeps more messenger available.
4. **Ion channels**, the gates that let charged particles in and out of nerve cells and set how excitable they are.

### Agonists, antagonists and partial agonists
- An **agonist** is a key that fits and turns the lock fully: it switches the receptor **on**.
- An **antagonist** is a key that fits but cannot turn: it sits in the lock and **blocks** the real key.
- A **partial agonist** turns the lock only part of the way. When the messenger is scarce, it **adds** some signal; when the messenger is in excess, it **reduces** the signal by taking the messenger's place. It acts like a **stabiliser**.

:::analogy The dimmer switch
A full agonist turns a light fully on; an antagonist keeps it off; a partial agonist is a dimmer set to about half. In a dark room, half-light is brighter than before. In a dazzling room, half-light is dimmer than before. Aripiprazole and buprenorphine work like this dimmer.
:::

:::widget sort
{"prompt": "How does each medicine mainly act? Place each.", "buckets": ["Blocks a transporter (reuptake)", "Blocks a receptor (antagonist)", "Partial agonist", "Blocks an enzyme"], "items": [{"text": "Sertraline keeps serotonin in the synapse longer", "bucket": 0}, {"text": "Haloperidol blocks dopamine D2 receptors", "bucket": 1}, {"text": "Aripiprazole partly stimulates D2 receptors", "bucket": 2}, {"text": "Donepezil stops acetylcholine being broken down", "bucket": 3}, {"text": "Methylphenidate stops dopamine and noradrenaline being taken back up", "bucket": 0}, {"text": "Buprenorphine partly stimulates opioid receptors", "bucket": 2}, {"text": "Naltrexone blocks opioid receptors", "bucket": 1}, {"text": "Moclobemide and older MAOIs stop monoamines being broken down", "bucket": 3}]}
:::

### The journey of a tablet
:::widget flow
{"title": "From swallowing a tablet to a change in the brain", "layout": "chain", "nodes": [{"id": "a", "label": "Swallowed", "detail": "The tablet dissolves in the stomach and small intestine. Food, acidity and gut speed affect how fast."}, {"id": "b", "label": "Absorbed", "detail": "The medicine crosses the gut wall into the blood that drains to the liver."}, {"id": "c", "label": "First pass through the liver", "detail": "Liver enzymes break down part of the dose before it reaches the rest of the body. Some medicines lose most of their dose here."}, {"id": "d", "label": "Carried in the blood", "detail": "Much of the medicine travels stuck to blood proteins; only the free part can act."}, {"id": "e", "label": "Crosses into the brain", "detail": "Fat-soluble medicines pass the blood-brain barrier. Some are pumped back out, which is why a few reach the brain poorly."}, {"id": "f", "label": "Binds its target", "detail": "Receptors, transporters, enzymes or ion channels. The chemical change starts here."}, {"id": "g", "label": "The brain adapts", "detail": "Over days to weeks, receptors and connections change. Many benefits, and some side effects, come from this stage."}, {"id": "h", "label": "Removed", "detail": "Broken down by the liver and removed by the kidneys or bile. The half-life tells you how fast."}], "caption": "Press Play to follow a dose step by step. Problems can arise at any step: poor absorption, enzyme interactions, kidney disease, or a brain that adapts slowly."}
:::

:::widget receptor
{"receptor": "D2", "title": "Four ways a medicine can sit in a receptor", "caption": "Choose each kind of drug and watch the signal bar. Haloperidol is an antagonist at D2, aripiprazole a partial agonist, dopamine itself the full agonist. Pimavanserin is an inverse agonist at a different receptor (5-HT2A), pushing the signal below baseline."}
:::

### Dose matters
More medicine is not always better. As the dose rises, the effect rises, then **levels off** (a plateau), while side effects may keep climbing. The aim is the dose that gives the most benefit with the fewest problems. For some medicines (lithium is the classic example), the gap between a helpful dose and a harmful one is **narrow**, so blood levels must be checked.

:::widget guess
{"prompt": "For lithium, the usual target blood level for long-term prevention in bipolar disorder lies between about 0.6 and what upper value (mmol/L)?", "min": 0, "max": 3, "step": 0.1, "unit": "mmol/L", "answer": [0.8, 1.0], "reveal": "About 0.6 to 0.8 or 1.0 mmol/L, with higher levels sometimes used for acute mania. Above about 1.5 mmol/L toxicity becomes likely, and above 2.0 it can be life-threatening. That narrow gap is why lithium needs regular blood tests.", "clinician": "Maintenance typically 0.6 to 0.8 mmol/L (some guidelines 0.6 to 1.0); acute mania 0.8 to 1.0 (up to 1.2); older adults often 0.4 to 0.6 or 0.8. Levels drawn 12 hours after the last dose. Toxicity: mild 1.5 to 2.0, moderate to severe above 2.0 (coarse tremor, ataxia, dysarthria, confusion, seizures, arrhythmia); acute and chronic toxicity differ in their relation to serum level."}
:::

:::widget curve
{"kind": "dose-response", "title": "Dose and effect: why more is not always better", "caption": "Slide the dose. The effect rises and then flattens (the plateau), while side effects can keep rising. Compare a full agonist with a partial agonist: the partial agonist has a ceiling, which is why buprenorphine is safer in overdose than methadone."}
:::

:::widget neuron
{"title": "Ion channels: the fourth kind of target", "myelinated": true, "caption": "Move the stimulus past threshold and the neuron fires all or none. Many medicines change this excitability: lamotrigine and carbamazepine block sodium channels, pregabalin acts on calcium channels, and benzodiazepines open chloride channels through GABA-A receptors, making firing harder. Switch myelin off to see how much slower conduction becomes."}
:::

:::clinician
### The pharmacodynamic vocabulary you will need
- **Affinity** (how tightly a drug binds, often expressed as Ki: lower Ki means tighter binding) versus **efficacy** (how much the bound drug activates the receptor). Partial agonists have high affinity and intermediate intrinsic activity.
- **Inverse agonists** reduce the constitutive (baseline) activity of receptors that signal even without a ligand; many "antagonists" at 5-HT2A and H1 (for example pimavanserin, many antihistamines) are in fact inverse agonists.
- **Allosteric modulators** bind at a site distinct from the neurotransmitter's site and change how the receptor responds: benzodiazepines are positive allosteric modulators of the GABA-A receptor (increasing channel opening frequency when GABA binds); barbiturates increase opening duration and at high doses open the channel directly, which explains their lower margin of safety.
- **Therapeutic index**: the ratio between toxic and effective doses. Narrow: lithium, tricyclics in overdose, clozapine in toxicity, carbamazepine. Wide: most SSRIs.
- **Receptor regulation**: chronic blockade tends to up-regulate receptors (for example D2 up-regulation with long-term antagonism, linked to supersensitivity and tardive dyskinesia); chronic stimulation down-regulates or desensitises them (for example 5-HT1A autoreceptor desensitisation with SSRIs, one explanation for the delayed antidepressant effect).
:::

:::recall
1. Name the four main kinds of drug target. || Receptors, transporters, enzymes, ion channels.
2. What is the difference between an agonist and an antagonist? || An agonist activates a receptor; an antagonist binds and blocks it.
3. Why is a partial agonist called a stabiliser? || It adds signal when the messenger is scarce and reduces it when the messenger is in excess.
4. What does a narrow therapeutic index mean? || The helpful and harmful doses are close together, so levels need monitoring.
:::

:::mcq
Q: Aripiprazole acts at dopamine D2 receptors as a:
- Full agonist
- Pure antagonist
- *Partial agonist
- Enzyme inhibitor
> It stabilises dopamine signalling.

Q: Why is lithium monitored with blood tests?
- It is expensive
- *Its helpful and toxic levels are close together
- It never causes side effects
- It works only at very high doses
> Narrow therapeutic index.
:::

## 1.2 What the body does to the medicine [core][starting]
**Pharmacodynamics** is what the medicine does to the body. **Pharmacokinetics** is what the body does to the medicine: how it is absorbed, spread, broken down and removed. Understanding this explains why some medicines are taken once a day and others three times, why some interact, and why stopping some suddenly is risky.

### Four steps
1. **Absorption**: from the gut into the blood. Food, other medicines and gut problems can change it. Some medicines come as injections, patches, sprays or long-acting depot injections.
2. **Distribution**: through the body, and across the **blood-brain barrier** into the brain.
3. **Metabolism**: mostly in the **liver**, by enzymes (the **cytochrome P450** family is the most important). Some medicines are turned into active products.
4. **Elimination**: mostly by the **kidneys** (in urine) or in bile.

### Half-life and steady state
The **half-life** is the time it takes for the blood level to fall by half. It decides:
- **How often** to take the medicine (short half-life: more doses a day, or a slow-release form).
- **How long** it takes to reach a stable level (**steady state**): about **four to five half-lives**.
- **How long** it takes to clear the body after stopping: also about four to five half-lives.

:::widget guess
{"prompt": "A medicine has a half-life of about one day. Roughly how many days of regular dosing does it take to reach a steady level in the blood?", "min": 1, "max": 20, "unit": "days", "answer": [4, 5], "reveal": "About four to five days, because steady state takes about four to five half-lives. Fluoxetine's active product has a half-life of a week or more, so it takes over a month to reach steady state and stays in the body for weeks after stopping.", "clinician": "After each half-life, the concentration covers half the remaining distance to steady state: 50%, 75%, 87.5%, 93.75%, 96.9% after 1 to 5 half-lives. Norfluoxetine half-life about 4 to 16 days; hence the 5-week washout before starting an MAOI after fluoxetine. Loading doses (for example valproate in acute mania) shortcut the wait for drugs with long half-lives."}
:::

:::widget curve
{"kind": "half-life", "title": "Half-life and steady state", "caption": "Try a short half-life (several hours) with once-daily dosing: the level swings high and low. Then try a long half-life: the level climbs slowly and smoothly to a plateau after about four to five half-lives. This is why some medicines need slow-release forms and others are taken once a day."}
:::

:::widget journey
{"drug": "sertraline", "target": "serotonin transporters in the raphe nuclei and their projections to cortex and limbic areas", "routes": ["oral"], "notes": {"liver": "Sertraline is broken down by several CYP enzymes, so few single drugs change its level much. That is one reason it is a safe first choice.", "out": "Half-life about a day, so once daily is enough and steady state comes in about five days."}, "caption": "Follow one dose of sertraline from tablet to target. Each stop is a place where an interaction or an illness can change what happens."}
:::

### Interactions: when medicines meet
Two medicines can affect each other in two broad ways:
- **One changes the other's level**: for example, one medicine blocks the liver enzyme that breaks down another, so the second builds up and causes side effects; or one speeds up the enzyme, so the second falls and stops working.
- **Both act on the same system**: for example, two medicines that both raise serotonin can cause serotonin toxicity; two sedating medicines add up and can stop breathing.

:::widget sort
{"prompt": "Raises or lowers the other medicine's level? Place each interaction.", "buckets": ["Raises the other medicine's level", "Lowers the other medicine's level"], "items": [{"text": "Fluvoxamine added to clozapine", "bucket": 0, "why": "Fluvoxamine strongly blocks CYP1A2, which breaks down clozapine."}, {"text": "Carbamazepine added to quetiapine", "bucket": 1, "why": "Carbamazepine induces CYP3A4, so quetiapine levels can fall sharply."}, {"text": "A smoker on olanzapine quits smoking", "bucket": 0, "why": "Smoke induces CYP1A2; removing it raises olanzapine and clozapine."}, {"text": "Fluoxetine added to risperidone", "bucket": 0, "why": "Fluoxetine and paroxetine strongly block CYP2D6."}, {"text": "Rifampicin (for TB) added to methadone", "bucket": 1, "why": "Rifampicin is a strong enzyme inducer; withdrawal can follow."}, {"text": "Valproate added to lamotrigine", "bucket": 0, "why": "Valproate roughly doubles lamotrigine levels, raising rash risk; halve the lamotrigine dose."}]}
:::

### Why stopping suddenly can be risky
After weeks of a medicine, the brain adapts. Stopping suddenly can cause:
- **Discontinuation symptoms** with many antidepressants (dizziness, "electric shock" feelings, irritability, flu-like symptoms), especially short half-life ones such as paroxetine and venlafaxine.
- **Withdrawal seizures** with benzodiazepines and alcohol.
- **Rebound** worsening of the illness (for example rebound psychosis or mania after stopping clozapine or lithium suddenly).
- **Rebound high blood pressure** after stopping clonidine.

:::clinician
### Pharmacokinetic essentials
- **First-pass metabolism**: oral drugs pass through the liver before reaching the systemic circulation; sublingual buprenorphine and transdermal patches (rivastigmine, rotigotine, nicotine) avoid much of it.
- **Protein binding**: valproate is highly protein-bound with saturable binding; free (unbound) levels rise at higher total concentrations and in hypoalbuminaemia, so total levels can mislead.
- **Volume of distribution**: lithium distributes in total body water; dehydration, older age and lower lean body mass raise levels.
- **Linear versus non-linear kinetics**: paroxetine and fluoxetine inhibit their own metabolism (non-linear rises with dose); carbamazepine induces its own metabolism (auto-induction over the first 2 to 4 weeks), so levels fall after the first weeks and doses must be raised.
- **Active metabolites**: fluoxetine (norfluoxetine), risperidone (9-hydroxyrisperidone, which is paliperidone), clozapine (norclozapine), diazepam (desmethyldiazepam), amitriptyline (nortriptyline), venlafaxine (desvenlafaxine).
- **Renal elimination**: lithium, amisulpride, sulpiride, gabapentin, pregabalin, memantine, paliperidone and acamprosate need dose adjustment in kidney impairment.
- **Long-acting injectables**: paliperidone palmitate (monthly, 3-monthly, 6-monthly), aripiprazole (monthly, 2-monthly), risperidone microspheres, haloperidol, fluphenazine, flupentixol and zuclopenthixol decanoates; steady state may take months, and side effects cannot be "stopped" quickly.
:::

:::recall
1. What is the difference between pharmacodynamics and pharmacokinetics? || Pharmacodynamics is what the drug does to the body; pharmacokinetics is what the body does to the drug.
2. How many half-lives to reach steady state? || About four to five.
3. Name the two broad ways medicines interact. || One changes the other's level; both act on the same system.
4. Why does stopping smoking matter for clozapine? || Smoke induces CYP1A2; on quitting, clozapine levels rise.
5. Give three risks of stopping some medicines suddenly. || Discontinuation symptoms, withdrawal seizures, rebound illness, rebound hypertension.
:::

:::mcq
Q: A medicine with a short half-life is most likely to:
- Need dosing once a week
- *Need several doses a day or a slow-release form
- Never cause discontinuation symptoms
- Take months to reach steady state
> Short half-life means levels fall quickly between doses.

Q: Adding valproate to lamotrigine requires:
- No change
- Doubling the lamotrigine dose
- *Halving the lamotrigine dose and titrating slowly, because levels roughly double and rash risk rises
- Stopping lamotrigine
> Valproate inhibits lamotrigine glucuronidation.
:::

## 1.3 Side effects come from receptors [core][starting]
Most side effects are not random. They come from a medicine acting on receptors **other than** the one it was meant for, or acting on the right receptor in the wrong part of the body. If you know a medicine's receptor profile, you can predict its side effects.

:::widget figure
{"id": "autonomic"}
:::

### The side-effect map
| If a medicine blocks... | Expect... |
|---|---|
| **Histamine H1** receptors | Sleepiness, increased appetite, weight gain |
| **Muscarinic (acetylcholine) M1** receptors | Dry mouth, blurred vision, constipation, urine retention, fast heart, confusion and memory problems (especially in older people) |
| **Alpha-1 adrenergic** receptors | Dizziness on standing (postural low blood pressure), falls, nasal stuffiness |
| **Dopamine D2** receptors (in movement and hormone pathways) | Stiffness, tremor, restlessness (akathisia), raised prolactin (breast changes, periods stopping, sexual problems) |
| **Serotonin 5-HT2C** receptors | Increased appetite and weight gain |

| If a medicine stimulates (or raises)... | Expect... |
|---|---|
| **Serotonin** | Nausea, loose stools, headache, early anxiety, sexual problems, bleeding risk, low sodium in older people |
| **Noradrenaline** | Sweating, raised pulse and blood pressure, tremor |
| **Dopamine** (stimulants) | Reduced appetite, poor sleep, raised pulse |
| **GABA** (benzodiazepines) | Sleepiness, unsteadiness, memory gaps, dependence |

:::widget sort
{"prompt": "Which receptor action best explains each side effect?", "buckets": ["H1 blockade", "M1 (anticholinergic) blockade", "Alpha-1 blockade", "D2 blockade"], "items": [{"text": "An older man on amitriptyline cannot pass urine and becomes confused", "bucket": 1}, {"text": "A woman on quetiapine falls when she stands up quickly at night", "bucket": 2}, {"text": "A young woman on risperidone stops having periods and notices breast discharge", "bucket": 3, "why": "D2 blockade in the tuberoinfundibular pathway raises prolactin."}, {"text": "A man on mirtazapine sleeps heavily and gains weight", "bucket": 0}, {"text": "A student on haloperidol cannot sit still and paces", "bucket": 3, "why": "Akathisia."}, {"text": "A patient on chlorpromazine has a very dry mouth and constipation", "bucket": 1}]}
:::

:::widget brainmap
{"title": "Where common side effects come from", "focus": ["hypothalamus", "basal-ganglia", "brainstem", "hippocampus"], "notes": {"hypothalamus": "Appetite and weight: H1 and 5-HT2C blockade here increase hunger. D2 blockade nearby, in the hypothalamus-pituitary pathway, raises prolactin.", "basal-ganglia": "Movement: D2 blockade in the striatum causes stiffness, tremor, restlessness and, long term, abnormal movements.", "brainstem": "Nausea and alertness: serotonin 5-HT3 receptors in the vomiting centre cause early SSRI nausea; histamine and noradrenaline neurons here set wakefulness.", "hippocampus": "Memory: muscarinic (acetylcholine) blockade and benzodiazepines impair forming new memories, most noticeably in older people."}, "caption": "Tap each highlighted area. The same receptor can have different effects depending on where it sits."}
:::

### Why this matters at the bedside
- An **older person** on several anticholinergic medicines (some antidepressants, bladder drugs, antihistamines, older antipsychotics, trihexyphenidyl) can become **confused or delirious**.
- A person who is **underweight and not sleeping** may welcome a sedating, appetite-raising medicine; a person with **diabetes and obesity** may not.
- A medicine that raises **prolactin** can cause infertility, sexual problems and bone thinning; ask, and check if needed.

:::widget decide
{"scene": "Mr Nair, 78, from Kozhikode, is on amitriptyline 50 mg for back pain, oxybutynin for an overactive bladder, and chlorpheniramine for an itchy rash. His daughter says he has become muddled, constipated and unsteady over the past few weeks.", "ask": "What is the most likely problem, and what do you do?", "choices": [{"label": "Start donepezil for dementia", "verdict": "harm", "outcome": "Donepezil and his anticholinergics work against each other; he stays confused and develops nausea.", "why": "This is a recent change likely caused by his medicines. Starting a cholinesterase inhibitor while giving anticholinergics makes little sense."}, {"label": "Recognise a high anticholinergic burden from three medicines; review and stop or swap them (for example a non-sedating antihistamine, an alternative for pain and bladder), check for other causes of delirium, and review his thinking afterwards", "verdict": "best", "outcome": "After the medicines are changed, his confusion and constipation clear over the following weeks.", "why": "Combined M1 blockade from several drugs commonly causes confusion, constipation, urinary problems and falls in older people. Deprescribing is the treatment."}, {"label": "Add a sleeping tablet because he is restless at night", "verdict": "harm", "outcome": "He falls at night and fractures his hip.", "why": "Adding sedatives to an anticholinergic burden increases delirium and falls."}]}
:::

:::clinician
### Receptor profiles to know (relative binding, simplified)
| Medicine | D2 | 5-HT2A | H1 | M1 | Alpha-1 | Practical consequence |
|---|---|---|---|---|---|---|
| Haloperidol | Very high | Low | Low | Low | Low to moderate | EPS and prolactin, little sedation or weight gain |
| Chlorpromazine | Moderate | High | High | High | High | Sedation, hypotension, anticholinergic effects, weight gain |
| Risperidone | High | Very high | Low to moderate | Negligible | Moderate | Prolactin rise, EPS at higher doses, postural drop when titrating |
| Olanzapine | Moderate | High | High | Moderate | Moderate | Weight gain, sedation, metabolic syndrome |
| Quetiapine | Low (fast dissociation) | Moderate | Very high | Low (norquetiapine higher) | High | Sedation, hypotension, little EPS or prolactin |
| Clozapine | Low | High | Very high | High | High | Sedation, hypersalivation (M4 agonism), constipation, hypotension, weight gain |
| Aripiprazole | High (partial agonist) | Moderate | Low | Negligible | Low | Akathisia, little prolactin or sedation |
| Amitriptyline | Negligible | Moderate | Very high | High | High | Sedation, anticholinergic effects, hypotension; sodium channel block in overdose |
| Mirtazapine | Negligible | Antagonist (also 5-HT2C, 5-HT3) | Very high | Low | Low | Sedation, appetite, weight gain, little nausea or sexual dysfunction |

- **Anticholinergic burden**: tools such as the Anticholinergic Cognitive Burden scale score each medicine (for example amitriptyline, oxybutynin, chlorpheniramine, trihexyphenidyl, olanzapine, clozapine, paroxetine score high). Cumulative burden predicts delirium, falls, cognitive decline and mortality in older adults.
- **H1 and 5-HT2C antagonism** together predict antipsychotic weight gain; clozapine and olanzapine top the list; aripiprazole, lurasidone, ziprasidone and cariprazine are lowest.
- **Prolactin**: rises most with amisulpride, risperidone and paliperidone (which cross the blood-brain barrier poorly, so pituitary D2 occupancy outstrips striatal), and first-generation drugs; least with aripiprazole (which can lower it), quetiapine, clozapine and olanzapine.
:::

:::recall
1. Which receptor blockade causes sedation and weight gain? || Histamine H1 (with 5-HT2C for weight).
2. Name four anticholinergic side effects. || Dry mouth, blurred vision, constipation, urine retention, fast heart, confusion.
3. Which receptor blockade causes dizziness on standing? || Alpha-1 adrenergic.
4. Which receptor blockade raises prolactin? || Dopamine D2.
5. Why are older people especially at risk from anticholinergic medicines? || They are prone to confusion, delirium, falls and urinary retention, and often take several such drugs.
:::

:::mcq
Q: A woman on an antipsychotic develops breast discharge and her periods stop. The receptor action responsible is:
- H1 blockade
- *D2 blockade raising prolactin
- Alpha-1 blockade
- M1 blockade
> Tuberoinfundibular dopamine normally inhibits prolactin.

Q: Which medicine is most likely to cause marked weight gain and sedation?
- Aripiprazole
- Haloperidol
- *Olanzapine
- Lurasidone
> Strong H1 and 5-HT2C antagonism.
:::

## 1.4 Using medicines well, and talking about them [core][starting]
A medicine only helps if it is the right one, at the right dose, for long enough, and actually taken. Many people stop psychiatric medicines early, often because of side effects, fear or misunderstanding.

### Common beliefs in Indian clinics
- **"These are sleeping pills; they will make me addicted."** Most antidepressants and antipsychotics are not addictive in the sense of craving and escalating doses, though some cause discontinuation symptoms if stopped suddenly. Benzodiazepines can cause dependence.
- **"Psychiatric medicines damage the brain or kidneys."** Most do not. Some need monitoring (lithium for kidneys and thyroid, valproate for liver, clozapine for blood counts), which is why tests are done.
- **"Once I start, I can never stop."** Many people take medicines for a limited time; others need longer to stay well. Decisions are made together.
- **"English medicine is too strong; I'll take herbal remedies instead."** Some herbal products interact with medicines (St John's wort lowers many drug levels; some Ayurvedic products contain heavy metals or steroids). Ask about everything a person takes.
- **"I felt better, so I stopped."** Stopping early is a common cause of relapse in depression, bipolar disorder and schizophrenia.

### Good habits when prescribing or advising (for qualified prescribers)
1. **Explain** what the medicine is for, how long it takes, and what side effects to expect.
2. **Start low** in older, medically ill and anxious people; go up step by step.
3. **One change at a time**, so you know what helped or harmed.
4. **Check** the tests the medicine needs, before and during treatment.
5. **Ask** about side effects directly, including sexual ones.
6. **Plan** how long to continue, and how to stop safely.
7. **Avoid** stockpiles in people at risk of overdose.

:::widget decide
{"scene": "Meena, 34, from Indore, has her second episode of depression. She responded well to sertraline last time but stopped it after a month because she 'felt fine' and feared becoming 'dependent'. The depression returned within months. She is reluctant to restart.", "ask": "What is the most helpful conversation?", "choices": [{"label": "Tell her she must take it for life", "verdict": "harm", "outcome": "She is frightened and refuses treatment.", "why": "This is inaccurate and increases fear. The duration depends on her history and is decided together."}, {"label": "Explore her worries, explain that sertraline does not cause addiction but should be reduced slowly rather than stopped suddenly, explain why continuing for several months after recovery lowers the risk of relapse, and agree a plan together with follow-up", "verdict": "best", "outcome": "She restarts sertraline, continues it for the agreed period after recovery, and tapers it slowly with no relapse.", "why": "Addressing beliefs, giving accurate information and shared decision-making improve adherence and outcomes."}, {"label": "Switch her to a herbal remedy she prefers", "verdict": "ok", "outcome": "Her depression does not improve, and she later restarts sertraline.", "why": "Respecting preferences matters, but she has a proven response to sertraline and evidence-based options should be offered."}]}
:::

### Generics, brands and cost
In India, the same medicine is sold under many brand names at very different prices. **The active ingredient and dose are what matter**, not the brand. Government Jan Aushadhi stores sell quality generics at low cost. When a patient's brand changes, check that the ingredient and dose are the same, and whether it is a slow-release form.

:::widget sort
{"prompt": "Accurate or inaccurate? Place each statement about psychiatric medicines.", "buckets": ["Accurate", "Inaccurate"], "items": [{"text": "SSRIs cause craving and the need for ever-higher doses", "bucket": 1}, {"text": "Lithium needs regular blood tests for levels, kidneys and thyroid", "bucket": 0}, {"text": "Benzodiazepines can cause dependence with long-term daily use", "bucket": 0}, {"text": "Herbal products never interact with psychiatric medicines", "bucket": 1}, {"text": "Stopping an antipsychotic suddenly after recovery from a first psychotic episode carries a high relapse risk", "bucket": 0}, {"text": "An expensive brand of sertraline works better than a cheaper one of the same dose", "bucket": 1}]}
:::

:::clinician
### Adherence and prescribing practice
- **Partial adherence** is common (around half of people with schizophrenia, bipolar disorder or depression are partially or non-adherent within a year). Ask non-judgementally ("Many people miss doses; how often does that happen for you?"); use simple regimens, pill organisers, family support, long-acting injectables when appropriate, and address side effects early.
- **Shared decision-making** improves engagement; document capacity and consent.
- **Prescribing rules in India**: psychotropics fall under Schedule H or H1 of the Drugs and Cosmetics Rules (benzodiazepines, Z-drugs, methylphenidate and buprenorphine have additional controls; some also under the NDPS Act); keep prescriptions legible with generic names (encouraged by the National Medical Commission).
- **Herbal and traditional products**: St John's wort induces CYP3A4 and P-glycoprotein and adds serotonergic effects; ginkgo increases bleeding with SSRIs and anticoagulants; some Ayurvedic rasashastra preparations contain lead, mercury or arsenic; ashwagandha has rare reports of liver injury and thyroid effects.
- **Duration**: depression, at least 6 to 12 months after remission for a first episode, longer (often 2 years or more) for recurrent episodes; first-episode psychosis, at least 1 to 2 years after remission with careful discussion of tapering; bipolar disorder, usually long term.
:::

:::recall
1. Name three common beliefs about psychiatric medicines that you should address. || Addiction, brain or kidney damage, lifelong use, herbal remedies are safer, stopping when feeling better.
2. Why make only one medicine change at a time? || To know what helped or harmed.
3. What matters more, the brand or the active ingredient and dose? || The active ingredient and dose (and whether it is slow-release).
4. Why ask about herbal products? || Some interact with medicines or contain harmful substances.
:::

:::mcq
Q: A patient asks whether sertraline is addictive. The most accurate answer is:
- Yes, like sleeping pills
- *No, it does not cause craving or escalating use, but it should be reduced gradually rather than stopped suddenly
- Only at high doses
- Only in women
> Discontinuation symptoms are not addiction.

Q: The best way to reduce relapse after recovery from depression is to:
- Stop the antidepressant as soon as mood improves
- *Continue for several months after recovery, then taper slowly in agreement with the clinician
- Double the dose
- Switch to a herbal remedy
> Continuation treatment prevents relapse.
:::

## 1.5 Level check · Starting [core][starting]
Twelve or more right out of fifteen opens the Beginner level.

:::mcq
Q: A neurotransmitter crosses the:
- Blood vessel
- *Synapse
- Skull
- Bone marrow
> The gap between nerve cells.

Q: A drug that blocks a receptor without activating it is:
- An agonist
- *An antagonist
- A partial agonist
- An enzyme
> It blocks the real messenger.

Q: Sertraline mainly works by:
- Blocking dopamine receptors
- *Blocking the serotonin reuptake transporter
- Blocking an enzyme
- Opening ion channels
> More serotonin in the synapse.

Q: A partial agonist:
- Always blocks the receptor fully
- Always activates the receptor fully
- *Adds signal when the messenger is low and reduces it when the messenger is high
- Has no effect
> A stabiliser.

Q: Steady state is reached after about:
- One half-life
- *Four to five half-lives
- Ten half-lives
- One day for every drug
> Rule of thumb.

Q: Most psychiatric medicines are broken down mainly in the:
- Lungs
- *Liver
- Skin
- Heart
> By cytochrome P450 enzymes.

Q: Fluvoxamine added to clozapine is likely to:
- Lower clozapine levels
- *Raise clozapine levels
- Have no effect
- Stop clozapine working
> CYP1A2 inhibition.

Q: Stopping smoking while on clozapine can:
- Lower clozapine levels
- *Raise clozapine levels and cause toxicity
- Have no effect
- Cure schizophrenia
> Loss of CYP1A2 induction.

Q: H1 blockade causes:
- Stiffness
- *Sleepiness and weight gain
- Dry mouth
- Raised prolactin
> Antihistamine effects.

Q: Anticholinergic side effects include:
- Diarrhoea and excess saliva
- *Dry mouth, constipation and confusion
- Weight loss
- Low prolactin
> Muscarinic blockade.

Q: Dizziness on standing is mainly due to blockade of:
- D2
- H1
- *Alpha-1 adrenergic receptors
- 5-HT3
> Postural hypotension.

Q: Raised prolactin with antipsychotics is due to:
- H1 blockade
- *D2 blockade
- M1 blockade
- Alpha-1 blockade
> Pituitary dopamine blockade.

Q: Stopping paroxetine suddenly may cause:
- Nothing
- *Discontinuation symptoms such as dizziness and 'electric shock' sensations
- Addiction cravings
- Weight loss
> Short half-life SSRI.

Q: Which statement is accurate?
- Expensive brands always work better
- *The active ingredient and dose matter more than the brand
- Generic medicines are unsafe
- Brands never matter for slow-release forms
> Check the ingredient, dose and release form.

Q: Which practice improves adherence?
- Avoiding talk about side effects
- *Explaining the medicine, asking about side effects including sexual ones, and agreeing the plan together
- Changing several medicines at once
- Giving large supplies to people at risk of overdose
> Shared decisions and honest information.
:::
`;
