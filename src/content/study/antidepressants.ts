import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";
import { qaBank } from "./antidepressants-qa";

export const meta: ModuleMeta = {
  id: "antidepressants",
  num: 10,
  title: "Antidepressants",
  emoji: "💊",
  tagline: "From what a receptor is, to every class and its risks, to binding profiles, genes and the newest fast-acting treatments",
  when: "Psychopharmacology",
  outcomes: [
    "Explain in plain words what a neurotransmitter, a receptor and a synapse are, and how a tablet reaches the brain",
    "Name every antidepressant class with examples and common Indian brands, how each works, and its common and dangerous side effects",
    "Recognise and manage serotonin syndrome, discontinuation symptoms, hyponatraemia, QT risk and tricyclic overdose, and tell serotonin syndrome from NMS",
    "Choose and switch antidepressants for real patients, including pregnancy, older age, heart disease and young people",
    "Explain side effects from receptor binding profiles, use CYP2D6 and CYP2C19 results, and describe esketamine, zuranolone and the treatment-resistant depression pathway",
  ],
  writeTask:
    "On paper, from memory: a table of classes (mechanism, two examples, two Indian brands, two key side effects); the receptor that explains each of sedation, weight gain, dry mouth, dizziness on standing, nausea and sexual dysfunction; the serotonin syndrome features set against NMS; FINISH; the MAOI washout rules; and a treatment-resistant depression pathway from optimising to esketamine and ECT. Then check and correct in red.",
  activities: [
    act.lesson("ad-1", "Quiz: classes and timing", "Mechanisms, onset and how long to continue."),
    act.lesson("ad-2", "Quiz: safety and emergencies", "Serotonin syndrome, overdose, hyponatraemia."),
    act.detective("Clinic detective", "Guess the medicine from its clues."),
    act.coach("pharmacology", "Coach: pharmacology", "The medicines and effects you confuse."),
  ],
  noteId: "antidepressants",
};

const p1 = String.raw`

# Part 0 · Starting: how medicines talk to the brain

## 0.1 Nerve cells, messengers and receptors [core][starting]
Your brain is made of about 86 billion nerve cells, called **neurons**. A neuron is a long, thin cell that carries a tiny electrical signal from one end to the other. But neurons do not touch each other. Between one neuron and the next there is a microscopic gap. To get a message across that gap, the first neuron releases a chemical. That chemical is a **neurotransmitter**: a chemical messenger.

On the far side of the gap, the next neuron has special proteins sitting in its surface, like little docking stations. These are **receptors**. When the right messenger fits into a receptor, the receiving neuron changes: it may become more likely to fire, less likely to fire, or switch on genes inside the cell.

:::analogy Lock and key
A neurotransmitter is a key. A receptor is a lock. Only the right key fits the right lock, and when it turns, a door opens inside the receiving cell. Medicines are often **copied keys** (they turn the lock themselves) or **broken keys** (they sit in the lock and stop the real key getting in).
:::

:::widget figure
{"id": "receptor-families"}
:::

### The messengers that matter for mood
| Messenger | What it helps with, in plain words | Where you will meet it |
|---|---|---|
| **Serotonin** (also written 5-HT) | Mood, worry, sleep, appetite, gut movement, sexual function | Most antidepressants |
| **Noradrenaline** (norepinephrine) | Alertness, energy, attention, blood pressure, pain control | SNRIs, tricyclics, bupropion |
| **Dopamine** | Drive, reward, motivation, movement; too much in some circuits links to psychosis | Bupropion, antipsychotics |
| **Histamine** | Wakefulness, appetite; also allergy | Sedating antidepressants block it |
| **Acetylcholine** | Memory, saliva, bowel and bladder movement, focusing the eye | Tricyclics block it (dry mouth, constipation) |
| **GABA** | The main brake: calming, sleep | Benzodiazepines, zuranolone |
| **Glutamate** | The main accelerator: learning, plasticity | Ketamine and esketamine |

### Three words for what a medicine does at a receptor
- An **agonist** turns the lock fully, like the body's own messenger.
- A **partial agonist** turns it only part of the way. It is a dimmer switch rather than an on-off switch.
- An **antagonist** (a blocker) sits in the lock and turns nothing. It stops the real messenger working.

One messenger can have many receptor types. Serotonin alone has more than a dozen (5-HT1A, 5-HT2A, 5-HT2C, 5-HT3 and others). Each sits in different places and does different jobs. This is why one medicine can help mood but upset the stomach: it is acting on serotonin receptors in both the brain and the gut.

:::widget receptor
{"receptor": "5-HT1A", "title": "Try each kind of key in a serotonin lock", "caption": "Tap each option and watch the signal bar. Serotonin itself is the full agonist. Buspirone, and the extra action of vilazodone and vortioxetine, are partial agonists here. Keep the inverse agonist in mind: it pushes a receptor below its resting level, which a plain blocker cannot do."}
:::

:::widget figure
{"id": "partial-agonist"}
:::

### Where serotonin comes from
Almost all the serotonin in the brain is made by a small cluster of cells in the **brainstem**, called the **raphe nuclei**. Their long fibres spread upwards like the branches of a tree to nearly every part of the brain. So a medicine that changes serotonin at the raphe changes it in mood, fear, sleep and appetite circuits all at once.

:::widget brainmap
{"title": "One small source, many destinations", "focus": ["brainstem", "prefrontal", "amygdala", "hippocampus", "hypothalamus", "basal-ganglia"], "notes": {"brainstem": "The raphe nuclei make the brain's serotonin; the locus coeruleus nearby makes its noradrenaline. Antidepressants act first on the cell bodies here.", "prefrontal": "Planning, mood control and how we judge ourselves. Serotonin and noradrenaline here shape concentration and negative thinking.", "amygdala": "The alarm centre. In depression and anxiety it over-reacts to sad or threatening faces; antidepressants calm this bias within days.", "hippocampus": "Memory and the stress brake. Long stress shrinks its connections; antidepressants raise growth factors that help them regrow.", "hypothalamus": "Sleep, appetite, body clock and stress hormones. Many early changes on antidepressants (sleep, appetite) start here.", "basal-ganglia": "Reward and drive, through dopamine. Serotonin can damp this down, which may explain emotional blunting on SSRIs."}, "caption": "Tap each region. Notice that the same messenger does different jobs in different places, which is why benefits and side effects arrive together."}
:::

:::widget sort
{"prompt": "Messenger, receptor, or medicine action? Place each card.", "buckets": ["A messenger (neurotransmitter)", "A receptor (the lock)", "What a medicine does"], "items": [{"text": "Serotonin", "bucket": 0}, {"text": "5-HT2C", "bucket": 1, "why": "5-HT2C is one of the serotonin receptor types. The letters and numbers name the lock, not the key."}, {"text": "Blocks the receptor so the real messenger cannot act", "bucket": 2, "why": "That is an antagonist."}, {"text": "Dopamine", "bucket": 0}, {"text": "Histamine H1", "bucket": 1}, {"text": "Turns the receptor on only part of the way", "bucket": 2, "why": "That is a partial agonist, like aripiprazole at dopamine receptors."}, {"text": "Noradrenaline", "bucket": 0}, {"text": "Muscarinic M1", "bucket": 1, "why": "M1 is an acetylcholine receptor. Blocking it causes dry mouth and confusion."}]}
:::

:::widget reveal
{"prompt": "A medicine blocks histamine receptors in the brain. Using what you just read, predict two things the person might notice.", "answer": "Histamine helps keep us awake and controls appetite. Block it and the person feels **sleepy** and **hungrier**, and may gain weight. This is exactly what happens with mirtazapine and many antipsychotics, and why old allergy tablets made people drowsy."}
:::

:::recall
1. What is a neurotransmitter? || A chemical messenger released by one neuron to pass a signal across the gap to the next.
2. What is a receptor? || A protein on the receiving cell that a messenger (or medicine) fits into, changing what the cell does.
3. Define agonist, partial agonist and antagonist. || Turns the receptor fully on; partly on; blocks it and turns nothing.
4. Name the messenger linked to each: drive and reward; the main calming brake; alertness and blood pressure. || Dopamine; GABA; noradrenaline.
:::

:::mcq
Q: Why can one antidepressant both help mood and cause nausea?
- It is a poison to the stomach
- *The same messenger (serotonin) acts on receptors in the gut as well as the brain
- Nausea means it is working
- It is absorbed too fast
> One messenger, many receptors, many places. Early nausea comes from extra serotonin acting on gut 5-HT3 receptors.
:::

## 0.2 The synapse: release, the recycling pump and the enzyme [core][starting]
The gap between two neurons, together with the two cell surfaces on either side, is called a **synapse**. Every antidepressant works somewhere in this tiny space, so it is worth knowing its parts well.

### What happens at a serotonin synapse
1. The sending neuron stores serotonin in little bags (vesicles).
2. An electrical signal arrives. The bags empty into the gap.
3. Serotonin drifts across and fits into receptors on the receiving neuron. A message is passed.
4. The message must then stop, or the receiving cell would be stuck "on". Two clean-up systems do this:
   - A **recycling pump** on the sending neuron (the serotonin transporter, **SERT**) sucks serotonin back in to be reused. This is called **reuptake**.
   - An **enzyme** inside the neuron, **monoamine oxidase** (MAO), breaks spare serotonin down.
5. The sending neuron also has its own receptors, called **autoreceptors**. They sense how much serotonin is around and act as a brake: "plenty out there, release less".

Noradrenaline and dopamine synapses work the same way, each with its own pump (NET for noradrenaline, DAT for dopamine).

:::widget synapse
{"drug": "none", "caption": "No medicine yet. Watch the cycle: release into the gap, some molecules reach receptors, and the pump on the sending neuron recycles the rest."}
:::

:::widget figure
{"id": "ssri-synapse"}
:::

### Two ways to raise a messenger
- **Block the pump.** Serotonin stays in the gap longer. This is how SSRIs, SNRIs and tricyclics work.
- **Block the enzyme.** Less serotonin is destroyed, so more is stored and released. This is how MAOIs work.

:::widget synapse
{"drug": "ssri", "caption": "Now press 'Add SSRI'. The pump is blocked and serotonin builds up in the gap within hours. Then let time pass and notice that the important changes come later."}
:::

:::widget sort
{"prompt": "Which part of the synapse does each card describe?", "buckets": ["Sending neuron", "The gap", "Receiving neuron"], "items": [{"text": "The recycling pump (SERT)", "bucket": 0, "why": "The pump pulls serotonin back into the cell that released it."}, {"text": "Vesicles full of serotonin", "bucket": 0}, {"text": "Serotonin drifting across", "bucket": 1}, {"text": "5-HT2A receptors that pass the message on", "bucket": 2}, {"text": "Autoreceptors that act as a brake on release", "bucket": 0, "why": "Autoreceptors sit on the sender and tell it to release less."}, {"text": "Monoamine oxidase breaking serotonin down", "bucket": 0, "why": "MAO sits inside the sending neuron (on its mitochondria)."}]}
:::

:::recall
1. Name the two clean-up systems at a serotonin synapse. || The recycling pump (SERT, reuptake) and the enzyme monoamine oxidase.
2. What does an autoreceptor do? || Senses the messenger level and brakes further release.
3. Which pump does each of SSRIs, SNRIs and bupropion block? || SERT; SERT and NET; NET and DAT.
:::

:::mcq
Q: A medicine stops monoamine oxidase working. What happens to serotonin?
- It falls, because it cannot be made
- *More is preserved, so more is available to release
- Nothing changes
- It turns into dopamine
> MAO destroys spare monoamines. Block it and more serotonin, noradrenaline and dopamine survive.
:::

## 0.3 How a tablet reaches the brain: the plain basics [core][starting]
A tablet swallowed in Chennai has a long journey before it reaches a receptor in the brain. **Pharmacokinetics** is the study of that journey: what the body does to the medicine. (Its partner word, **pharmacodynamics**, is what the medicine does to the body. You will meet both again in the Advanced level and in their own module.)

### The four stages
1. **Absorption.** The tablet dissolves, and the medicine passes through the gut wall into the blood. Some medicines need food to be absorbed well; others are slowed by it.
2. **Distribution.** The blood carries it round the body. To act on the brain it must cross the **blood-brain barrier**, a tight wall of cells that keeps many substances out.
3. **Metabolism.** The liver changes the medicine, usually into forms that are easier to remove. The main workers are a family of liver enzymes called **cytochrome P450**, shortened to **CYP** (say "sip"). Each has a code name: CYP2D6, CYP2C19, CYP3A4, CYP1A2.
4. **Excretion.** The kidneys (and sometimes bile) remove the medicine and its leftovers.

:::analogy The train journey
Absorption is boarding the train. Distribution is travelling to every station, though only some passengers get through the strict gate at the brain station. Metabolism is the ticket inspector changing your ticket so you must get off. Excretion is leaving the station.
:::

:::widget journey
{"drug": "sertraline", "target": "serotonin pumps (SERT) on serotonin nerve endings in the cortex and limbic system, and on the cell bodies in the raphe", "routes": ["oral"], "notes": {"mouth": "A 50 mg sertraline tablet is swallowed, ideally after breakfast or dinner. Food does not stop it working but makes nausea less likely.", "gut": "The tablet dissolves and sertraline passes slowly through the wall of the small intestine. Levels in the blood peak several hours later, not straight away.", "liver": "On its first pass, liver CYP enzymes (several of them share the work) turn part of the dose into a much weaker leftover. Because many enzymes share the job, one blocked enzyme rarely changes sertraline levels much.", "blood": "Most of the sertraline in the blood is stuck to proteins. Only the small free part can leave the blood. It also reaches platelets, where it blocks their serotonin pump too.", "bbb": "Sertraline is fat-soluble, so it slips through the tight wall of brain blood vessels easily.", "out": "Liver changes leave a product the kidneys can remove. Half the drug is gone in about a day, so one dose a day keeps levels steady."}, "caption": "Press Play and follow one dose from mouth to synapse. Then think: at which stops could another medicine, food or liver disease change how much arrives?"}
:::

### Half-life: the one number to understand
The **half-life** is the time it takes for the amount of medicine in the blood to fall by half. If a medicine has a half-life of one day, then a day after the last dose half is left; after two days a quarter; after three days an eighth.

Half-life tells you three practical things:
- **How often to take it.** Short half-life: often twice a day. Long half-life: once a day is plenty.
- **How long until it builds up.** With regular doses, the level climbs and then levels off. This plateau is called **steady state**.
- **How long it takes to leave**, and how rough stopping may be. Short half-life medicines drop fast, and stopping them suddenly feels worse.

:::widget curve
{"kind": "half-life", "title": "Take a tablet every day and watch the level climb", "caption": "Slide the half-life. A short one (like venlafaxine) gives spiky levels that settle quickly and fall quickly. A long one (like fluoxetine) gives smooth levels that take a long time to settle and a long time to leave."}
:::

:::widget guess
{"prompt": "With regular daily doses, how many half-lives does it take for a medicine to reach (nearly) steady state?", "min": 1, "max": 10, "unit": "half-lives", "answer": [4, 5], "reveal": "About 4 to 5 half-lives. After one half-life the level is half way to the plateau, after two it is three-quarters, after three seven-eighths, and after four or five it is close enough to call steady. The same rule tells you how long a medicine takes to wash out after stopping.", "clinician": "Accumulation follows 1 minus 0.5 to the power n, where n is the number of half-lives: 50%, 75%, 87.5%, 93.75%, 96.9%. Plasma levels drawn before about 4 to 5 half-lives after a dose change underestimate the eventual steady state."}
:::

:::widget worked
{"title": "Halving a dose in your head", "steps": [{"q": "A patient has 80 units of a medicine in the blood. Its half-life is 1 day. How much is left after 1 day?", "a": "Half of 80: **40 units**."}, {"q": "And after 3 days?", "a": "40, then 20, then **10 units**. Each half-life halves what is left."}, {"q": "Roughly when is it almost all gone?", "a": "After about 5 half-lives (here, about 5 days) only about 3% remains. That is the usual rule for 'washed out'."}], "yourTurn": [{"q": "A medicine with a half-life of 2 days is stopped. Roughly how long until it has washed out?", "a": "About 5 half-lives: around 10 days."}]}
:::

:::widget figure
{"id": "pk-steady-state"}
:::

### CYP enzymes and why other medicines matter
Because the liver's CYP enzymes clear many medicines, two medicines can collide:
- An **inhibitor** slows a CYP enzyme. The other medicine is cleared more slowly, so its level **rises** (risk of side effects or toxicity).
- An **inducer** speeds a CYP enzyme up. The other medicine is cleared faster, so its level **falls** (risk of it stopping working).

Smoking tobacco is a common inducer of CYP1A2. Some antidepressants (fluoxetine, paroxetine, fluvoxamine) are strong inhibitors. People also inherit faster or slower versions of these enzymes. This is part of why the same dose suits one person and not another.

:::recall
1. What are the four stages of pharmacokinetics? || Absorption, distribution, metabolism, excretion.
2. Define half-life. || The time for the blood level to fall by half.
3. How many half-lives to reach steady state, or to wash out? || About 4 to 5.
4. What does a CYP inhibitor do to another medicine's level? An inducer? || Raises it; lowers it.
:::

:::mcq
Q: Medicine A has a half-life of 6 hours; medicine B has a half-life of 4 days. Which statement is TRUE?
- A will take longer to reach steady state
- *B will take longer to reach steady state and to wash out after stopping
- Both reach steady state after the first dose
- Half-life does not affect dosing
> Steady state and washout both take about 4 to 5 half-lives, so the long half-life medicine is slower both ways.
:::

:::widget figure
{"id": "liver-cell-cyp"}
:::

## 0.4 What antidepressants are, and what they are not [core][starting]
Antidepressants are medicines that treat depression. Despite the name, they are also used for anxiety disorders, OCD, PTSD, some eating disorders, chronic pain and more. Almost all of them raise the activity of **serotonin, noradrenaline or both** at synapses.

### What they do not do
- They are **not "happy pills"**. A well person given an antidepressant does not become euphoric.
- They **do not change personality**. People often say they feel "like myself again".
- They are **not addictive** in the way sleeping pills or alcohol are: there is no craving and no need for ever-higher doses to get the same effect. But the brain does adapt to them, so stopping suddenly can cause unpleasant symptoms. They should be reduced slowly with a doctor.
- They **are not instant**. Side effects can come first; the benefit builds more slowly.

:::widget guess
{"prompt": "In people who will respond, how soon does some improvement usually begin after starting an antidepressant at a good dose?", "min": 0, "max": 8, "unit": "weeks", "answer": [1, 2], "reveal": "Often within the first 1 to 2 weeks, with fuller benefit building over the following weeks. Sleep, appetite and energy often improve before mood itself. The old belief that nothing happens for a month is not quite right.", "clinician": "Pooled data show most of the drug-placebo separation emerges in weeks 1 to 2; absence of any improvement (under 20% symptom reduction) by weeks 3 to 4 at a therapeutic dose strongly predicts non-response."}
:::

### Why the delay, in one picture
The pump is blocked within hours, yet mood takes longer. The receiving and sending neurons must **adapt**: brake receptors switch off, the cell makes new proteins, and connections are rebuilt. The synapse widget above showed this in stages.

:::widget sort
{"prompt": "Myth or fact? Place each statement.", "buckets": ["Myth", "Fact"], "items": [{"text": "Antidepressants make anyone who takes them happy", "bucket": 0, "why": "They lift depression; they do not create euphoria in well people."}, {"text": "Side effects often come before the benefit", "bucket": 1}, {"text": "You can stop as soon as you feel better", "bucket": 0, "why": "Stopping early brings a high chance of relapse. Treatment continues for months after recovery."}, {"text": "They can cause craving, like alcohol", "bucket": 0}, {"text": "Stopping suddenly can cause dizziness and 'electric shock' feelings", "bucket": 1, "why": "These are discontinuation symptoms, not addiction."}, {"text": "They are also used for OCD, panic and some pain", "bucket": 1}, {"text": "If the first one fails, none will work", "bucket": 0, "why": "Many people who do not respond to the first respond to the next step."}]}
:::

:::widget decide
{"scene": "Your aunt in Jaipur started sertraline for depression. After ten days she phones you: 'I feel a bit sick and jittery, and I'm not happier. These tablets are useless. I'm stopping them today.' You are a psychology student.", "ask": "What do you say?", "choices": [{"label": "'Yes, stop them. Try some herbal tea instead.'", "verdict": "harm", "outcome": "She stops, feels dizzy and low, and decides 'all medicines are bad'.", "why": "Advising someone to stop a prescribed medicine is outside your role, and early side effects often fade."}, {"label": "'Early side effects are common and often settle, and the benefit takes a little longer. Please don't stop suddenly. Can you call your doctor today and tell them exactly this?'", "verdict": "best", "outcome": "Her doctor reassures her, adjusts the timing to after food, and her nausea settles. A few weeks later she is sleeping and eating better.", "why": "You gave accurate general information, stayed in your role and sent her back to the prescriber."}, {"label": "'Double the dose so it works faster.'", "verdict": "harm", "outcome": "Her jitteriness and nausea get worse.", "why": "Never suggest dose changes. Only the prescriber decides."}]}
:::

:::note This is a place to learn
This platform teaches pharmacology. It is not a prescribing service. Doses shown are for learning; always check current guidelines and the prescriber's advice.
:::

:::recall
1. Name four conditions besides depression treated with antidepressants. || Anxiety disorders, OCD, PTSD, chronic pain (also bulimia, PMDD).
2. Give three myths about antidepressants. || Happy pills; change personality; addictive like sleeping pills.
3. Why do antidepressants take time? || The brain must adapt: receptors, proteins and connections change after the pump is blocked.
:::

:::mcq
Q: Which statement about antidepressants is TRUE?
- They work fully on the first day
- *Stopping them suddenly can cause unpleasant symptoms, so they are reduced slowly
- They cause craving and dose escalation
- They are only used for depression
> The brain adapts to them; sudden stopping causes discontinuation symptoms.
:::

## 0.5 Level check · Starting [starting]
Twelve or more right out of fifteen (80%) opens the Beginner level. If you already know this, take it now to skip ahead.

:::mcq
Q: A neurotransmitter is best described as:
- A type of nerve cell
- *A chemical messenger that carries a signal across the gap between neurons
- A brain region
- A hormone made by the kidney
> Neurons talk across synapses using chemical messengers.

Q: A receptor is:
- The gap between neurons
- *A protein on a cell that a messenger or medicine fits into
- An enzyme that breaks down serotonin
- A blood vessel
> The lock that the key fits.

Q: A medicine that sits in a receptor and stops the real messenger acting is:
- An agonist
- A partial agonist
- *An antagonist
- An enzyme
> Antagonists block.

Q: A partial agonist:
- Blocks the receptor completely
- *Switches the receptor on only part of the way
- Destroys the receptor
- Works only in the gut
> A dimmer switch rather than an on-off switch.

Q: What does the serotonin transporter (SERT) do?
- Makes serotonin
- *Recycles serotonin back into the sending neuron
- Breaks serotonin down
- Carries serotonin in the blood
> Reuptake. SSRIs block it.

Q: Which enzyme breaks down serotonin, noradrenaline and dopamine inside neurons?
- CYP2D6
- *Monoamine oxidase
- Acetylcholinesterase
- Lactase
> MAOIs block it.

Q: Autoreceptors on the sending neuron:
- Speed up release without limit
- *Act as a brake when plenty of messenger is around
- Are found only in the gut
- Are blocked by every antidepressant
> They sense the level and turn release down.

Q: Blocking histamine receptors in the brain usually causes:
- Alertness and weight loss
- *Sleepiness and increased appetite
- Tremor
- Dry mouth only
> Histamine keeps us awake and controls appetite.

Q: Which organ does most medicine metabolism?
- Kidney
- *Liver
- Lungs
- Spleen
> CYP enzymes are mainly in the liver.

Q: A medicine's half-life is 1 day. After 2 days without a dose, what fraction is left?
- Half
- *A quarter
- An eighth
- None
> Half, then half again.

Q: About how many half-lives does it take to reach steady state?
- One
- Two
- *Four to five
- Twenty
> The same rule applies to washout.

Q: A CYP inhibitor added to a patient's regular medicine will usually:
- Lower the regular medicine's level
- *Raise the regular medicine's level
- Have no effect
- Stop absorption
> Slower clearance means higher levels.

Q: Which is TRUE about antidepressants?
- They are happy pills
- They change personality
- *Side effects can come before benefit
- They work only in mild sadness
> The brain needs time to adapt.

Q: Stopping an antidepressant suddenly is a problem mainly because:
- It is illegal
- *It can cause discontinuation symptoms and relapse
- It causes craving
- It damages the liver
> Reduce slowly with the prescriber.

Q: Which messenger is the brain's main calming brake?
- Glutamate
- Dopamine
- *GABA
- Noradrenaline
> Benzodiazepines and zuranolone act on GABA-A receptors.
:::

# Part I · How they work

## 1.1 The big picture [core][beginner]
Antidepressants are grouped by **what they do at the synapse**. Learn the classes as a table first; the rest of the module fills in each row.

| Class | How it works | Examples (common Indian brands) |
|---|---|---|
| SSRIs | Block the serotonin pump (SERT) | Sertraline (Serta, Daxid), escitalopram (Nexito, Stalopam), fluoxetine (Fludac, Prodep), paroxetine (Pexep), fluvoxamine (Fluvoxin), citalopram |
| SNRIs | Block serotonin and noradrenaline pumps | Venlafaxine (Venlor, Veniz XR), desvenlafaxine (Desvenlor), duloxetine (Duvanta, Dulane) |
| NDRI | Blocks noradrenaline and dopamine pumps | Bupropion (Bupron SR, Smoquit) |
| Alpha-2 antagonist (NaSSA) | Blocks alpha-2 brake receptors, so more serotonin and noradrenaline are released; blocks 5-HT2A, 5-HT2C, 5-HT3 and H1 | Mirtazapine (Mirtaz, Mirnite) |
| Tricyclics (TCAs) | Block serotonin and noradrenaline pumps, plus many unwanted receptors | Amitriptyline (Tryptomer), imipramine (Depsonil), clomipramine (Clofranil), nortriptyline, dothiepin |
| MAOIs | Block monoamine oxidase | Phenelzine, tranylcypromine; moclobemide (reversible, MAO-A only) |
| Serotonin modulators | Pump block plus direct receptor actions | Trazodone (Trazonil), vortioxetine (Brintellix, Vortidep), vilazodone |
| Melatonergic | Melatonin receptor agonist and 5-HT2C antagonist | Agomelatine (Agoprex, Valdoxan) |
| Glutamate-acting and neurosteroid (newer) | NMDA receptor block; GABA-A positive modulation | Esketamine nasal spray; dextromethorphan-bupropion; zuranolone, brexanolone (Advanced level) |

Brand names are examples to help you recognise prescriptions in Indian clinics; brands change and many companies make each medicine.

:::widget sort
{"prompt": "Place each medicine in its class.", "buckets": ["SSRI", "SNRI", "Tricyclic", "Other"], "items": [{"text": "Escitalopram", "bucket": 0}, {"text": "Duloxetine", "bucket": 1}, {"text": "Amitriptyline", "bucket": 2}, {"text": "Mirtazapine", "bucket": 3, "why": "Mirtazapine is an alpha-2 antagonist (NaSSA), not a pump blocker."}, {"text": "Fluvoxamine", "bucket": 0}, {"text": "Venlafaxine", "bucket": 1}, {"text": "Clomipramine", "bucket": 2, "why": "The most serotonergic tricyclic, used in OCD."}, {"text": "Bupropion", "bucket": 3, "why": "An NDRI: it blocks noradrenaline and dopamine pumps, not serotonin."}, {"text": "Agomelatine", "bucket": 3}, {"text": "Paroxetine", "bucket": 0}]}
:::

:::widget synapse
{"drug": "ssri", "caption": "Every SSRI does this one thing at its main target. The differences between SSRIs come from their half-lives, their effects on liver enzymes and the few extra receptors some of them touch."}
:::

### Two depths of explanation
Throughout this module you will see two layers:
- **Clinical use**: who gets it, at what dose, what to watch for.
- **Receptor level**: which receptors a medicine binds and how that explains both benefit and side effects. The Beginner level gives the headline; the Advanced level gives the full binding profile.

:::recall
1. Name the class and mechanism of: sertraline, venlafaxine, bupropion, mirtazapine. || SSRI (SERT block); SNRI (SERT and NET); NDRI (NET and DAT); alpha-2 antagonist.
2. Give two Indian brands each for sertraline and escitalopram. || Serta, Daxid; Nexito, Stalopam.
3. Which antidepressant is a melatonin agonist? || Agomelatine.
4. Which MAOI is reversible and MAO-A selective? || Moclobemide.
:::

:::mcq
Q: A prescription from a Delhi clinic says "Tab Nexito 10 mg OD". The medicine is:
- Sertraline
- *Escitalopram
- Fluoxetine
- Mirtazapine
> Nexito is a common Indian brand of escitalopram.

Q: Which antidepressant does NOT act on the serotonin pump?
- Sertraline
- Venlafaxine
- Amitriptyline
- *Bupropion
> Bupropion blocks noradrenaline and dopamine pumps only.
:::

## 1.2 Why they take time, and how well they work [core][beginner]
### The delay explained
An SSRI blocks reuptake within hours, yet mood lifts more slowly. So the immediate rise in serotonin cannot be the whole story. Three processes fill the gap:
- **Autoreceptor desensitisation.** At first, extra serotonin around the cell bodies in the raphe nuclei stimulates **5-HT1A autoreceptors**. These are brakes, so firing actually falls. Over time the autoreceptors **down-regulate**; the brake comes off and serotonin release in the cortex and limbic system rises properly.
- **Neuroplasticity.** Antidepressants raise **BDNF** (a growth factor), new synapses and new neurons in the hippocampus, reversing some effects of chronic stress.
- **Emotional bias shift.** Within days, people on antidepressants begin to notice positive faces and words more. Mood follows as the world starts to feel different.

:::analogy The thermostat
The autoreceptor is a thermostat. The medicine first fights the thermostat, which turns the heater down. Once the thermostat is reset, the heater can warm the room.
:::

:::widget flow
{"title": "From the first tablet to a lifted mood", "layout": "chain", "nodes": [{"id": "a", "label": "SERT blocked", "detail": "Within hours of the first dose, the serotonin pump is mostly blocked, both at nerve endings and around the cell bodies in the raphe."}, {"id": "b", "label": "Serotonin rises at the raphe", "detail": "Extra serotonin builds up first around the cell bodies, where 5-HT1A autoreceptors sit."}, {"id": "c", "label": "The brake bites", "detail": "The 5-HT1A autoreceptors sense the rise and slow the neurons' firing. Release in the cortex barely changes at first. Side effects from gut and spinal receptors arrive now."}, {"id": "d", "label": "The brake wears out", "detail": "With constant stimulation the autoreceptors desensitise and are reduced in number. Firing returns to normal while the pump is still blocked."}, {"id": "e", "label": "More release where it matters", "detail": "Now serotonin release in the prefrontal cortex, hippocampus and amygdala rises properly."}, {"id": "f", "label": "Genes and growth", "detail": "Changed signalling switches on genes such as BDNF. New dendritic spines and synapses grow; the hippocampus recovers some of what stress took."}, {"id": "g", "label": "Mood lifts", "detail": "Biased attention to bad news fades first, then sleep, energy and interest return, and mood follows."}], "edgeLabels": {"a>b": "hours", "c>d": "days to weeks", "e>f": "slow"}, "caption": "Press Play. The early steps explain the early side effects; the later steps explain the delay in benefit."}
:::

:::widget guess
{"prompt": "At a good dose, if a patient has shown NO improvement at all, after how many weeks is it reasonable to say this medicine at this dose is unlikely to work?", "min": 1, "max": 12, "unit": "weeks", "answer": [3, 4], "reveal": "About 3 to 4 weeks with no improvement at all suggests that medicine at that dose will not work, so the plan should change (raise the dose or switch). If there is partial improvement, it is usually worth continuing longer, because response can keep building.", "clinician": "Non-improvement (under 20% reduction on a rating scale) at 2 to 4 weeks predicts non-response with high sensitivity. Partial response at 4 weeks: continue to 6 to 8 weeks before judging. In older adults, allow longer before deciding."}
:::

### The honest evidence
- Antidepressants beat placebo, with the clearest benefit in **moderate to severe** depression. In mild depression the advantage is small, so psychological help and active monitoring come first.
- About **half** of people respond to the first antidepressant, and about a **third** reach full remission. Many more respond with the next steps.
- Differences in effectiveness between antidepressants are **small**. Choice is guided by side effects, interactions, safety in overdose, other illnesses, past response and preference.
- Medicine plus psychotherapy is better than either alone for moderate to severe or chronic depression.

### Uses beyond depression
| Condition | Notes |
|---|---|
| Panic disorder, GAD, social anxiety, PTSD | Start at **half** the usual dose to avoid early jitteriness, then increase |
| OCD | **Higher doses and longer trials**; clomipramine also works |
| Bulimia nervosa | Fluoxetine at a higher dose |
| Neuropathic pain, migraine prevention, tension headache | Low-dose amitriptyline, duloxetine |
| Premenstrual dysphoric disorder | SSRIs, even in the second half of the cycle only |
| Premature ejaculation | Dapoxetine and other SSRIs (a side effect used deliberately) |
| Smoking cessation | Bupropion |
| Insomnia with depression | Mirtazapine, low-dose trazodone |

:::widget guess
{"prompt": "OCD needs longer trials than depression. How many weeks at a good dose before judging an SSRI in OCD?", "min": 2, "max": 20, "unit": "weeks", "answer": [8, 12], "reveal": "About 8 to 12 weeks, often at the higher end of the dose range. Improvement in OCD is slower and more gradual than in depression.", "clinician": "Guidelines suggest at least 12 weeks at maximum tolerated dose before declaring SSRI non-response in OCD; doses above licensed maxima are sometimes used under specialist care."}
:::

:::widget sort
{"prompt": "Which antidepressant suits each extra use?", "buckets": ["Bupropion", "Duloxetine", "Fluoxetine", "Mirtazapine"], "items": [{"text": "Stopping smoking", "bucket": 0}, {"text": "Diabetic nerve pain with depression", "bucket": 1}, {"text": "Bulimia nervosa", "bucket": 2}, {"text": "Depression with poor sleep and weight loss in an older adult", "bucket": 3}, {"text": "Depression in a teenager", "bucket": 2, "why": "Fluoxetine has the best evidence in young people."}, {"text": "Fibromyalgia with low mood", "bucket": 1}]}
:::

:::recall
1. Why does the antidepressant effect take time? || 5-HT1A autoreceptors must desensitise, and plasticity (BDNF, new synapses) takes time.
2. In which severity is the benefit over placebo clearest? || Moderate to severe.
3. Roughly what proportion respond to, and remit on, the first antidepressant? || About half respond; about a third remit.
4. How is dosing different in panic disorder and in OCD? || Panic: start at half dose. OCD: higher doses and longer trials.
5. What guides the choice between antidepressants? || Side effects, interactions, overdose safety, other illnesses, past response and preference.
:::

:::mcq
Q: A man with mild depression, no risk, wants "a quick tablet". Evidence suggests:
- Antidepressants work best in mild depression
- *The gain over placebo is small in mild depression; offer psychological help and review
- All patients need medicine
- Benzodiazepines are better
> The clearest benefit is in moderate to severe depression.

Q: The receptor that first brakes serotonin firing when an SSRI is started is:
- 5-HT3
- *5-HT1A autoreceptor
- 5-HT2C
- H1
> Its gradual desensitisation is one explanation for the delay.
:::

# Part II · The classes

## 2.1 SSRIs [core][beginner]
SSRIs are first-line for depression and most anxiety disorders: effective, reasonably well tolerated, once daily, and **much safer in overdose** than tricyclics.


:::widget release
{
 "transmitter": "serotonin",
 "title": "What an SSRI changes at the synapse",
 "caption": "Play one signal with No drug, then pick SSRI. Release and binding look the same; the difference is at the recycling pump, which is blocked, so serotonin stays in the gap and the message lasts longer. Every SSRI side effect comes from that extra serotonin reaching receptors in the gut, the spinal cord and elsewhere, not just the mood circuits."
}
:::

:::widget figure
{"id": "ssri-synapse", "quiz": true}
:::

### Side effects, and the receptor behind each
| Side effect | Why (receptor level) | Practical point |
|---|---|---|
| Nausea, loose stools, stomach upset | Extra serotonin at gut and brainstem **5-HT3** receptors | Early; take after food; usually fades |
| Jitteriness, anxiety, insomnia | Stimulation of **5-HT2A and 5-HT2C** before adaptation | Start low in anxiety; morning dosing |
| **Sexual dysfunction** (low desire, delayed orgasm or ejaculation) | 5-HT2A stimulation in spinal and brain pathways, and dampened dopamine | Common, under-reported: ask directly |
| Emotional blunting | Serotonin dampening dopamine-driven reward | Lower dose or switch |
| Sweating, yawning | Central serotonin effects | |
| Bleeding | Platelets need SERT to take up serotonin for clotting | With NSAIDs, aspirin, anticoagulants |
| Low sodium | Excess antidiuretic hormone (SIADH) | Older adults, diuretics |


:::widget compare
{
 "title": "Two SSRIs at opposite ends",
 "a": {
  "label": "Fluoxetine",
  "points": [
   "Very long half-life, plus a long-lived active metabolite",
   "Missed doses barely matter; almost tapers itself",
   "Strong CYP2D6 inhibitor: raises many other medicines",
   "Long washout before an MAOI",
   "Can feel activating early on"
  ],
  "summary": "Forgiving to stop, awkward to combine."
 },
 "b": {
  "label": "Paroxetine",
  "points": [
   "Short half-life, and it slows its own breakdown",
   "Levels collapse when stopped: worst discontinuation",
   "Also a strong CYP2D6 inhibitor",
   "The most anticholinergic SSRI: dry mouth, constipation",
   "More weight gain; avoided in pregnancy"
  ],
  "summary": "Effective, but hard to come off."
 },
 "caption": "Both block the same serotonin pump. Slide between them: nearly every practical difference comes from how long they stay in the body and which extra targets they touch."
}
:::

### Telling the SSRIs apart
| SSRI | What makes it different |
|---|---|
| Fluoxetine | Very long half-life with an active metabolite (norfluoxetine): fewest discontinuation symptoms, long washout; strong **CYP2D6** inhibitor; best evidence in children and adolescents; can be activating |
| Sertraline | Widely used, including after a heart attack and around pregnancy and breastfeeding; mild dopamine pump action; more loose stools |
| Escitalopram | Well tolerated, few interactions; dose-related **QT** effect |
| Citalopram | QT prolongation limits the dose, especially in older adults |
| Paroxetine | Short half-life: **worst discontinuation**; the most anticholinergic SSRI; weight gain; avoided in pregnancy; strong CYP2D6 inhibitor |
| Fluvoxamine | Used in OCD; strong **CYP1A2** and CYP2C19 inhibitor (raises clozapine, olanzapine, theophylline, caffeine) |

:::widget guess
{"prompt": "Fluoxetine's active metabolite, norfluoxetine, has a very long half-life. About how many days?", "min": 0, "max": 30, "unit": "days", "answer": [4, 16], "reveal": "Somewhere between about 4 and 16 days. That is why fluoxetine almost tapers itself when stopped, and why its effects on other medicines and its risk with MAOIs last for weeks after the last dose.", "clinician": "Fluoxetine half-life is 1 to 3 days after a single dose and 4 to 6 days with chronic use; norfluoxetine 4 to 16 days. Steady state takes about a month or more; washout before an MAOI is at least 5 weeks."}
:::

:::student
### Typical adult daily doses (for learning; check current guidelines)
These ranges are for understanding prescriptions. They are not advice for anyone to take or change a medicine.

| Medicine | Typical adult daily range |
|---|---|
| Sertraline | 50 to 200 mg |
| Escitalopram | 10 to 20 mg |
| Fluoxetine | 20 to 60 mg |
| Paroxetine | 20 to 50 mg |
| Fluvoxamine | 100 to 300 mg |
| Citalopram | 20 to 40 mg |
:::

:::clinician
### SSRI dosing (for learning; check current guidelines)
| Medicine | Start | Usual | Maximum | Indian brands | Titration and notes |
|---|---|---|---|---|---|
| Sertraline | 50 mg (25 mg in panic, frail or elderly) | 50 to 150 mg | 200 mg | Serta, Daxid, Zosert | Raise by 25 to 50 mg steps once tolerated and if response partial; take with food |
| Escitalopram | 10 mg (5 mg if anxious or over 65) | 10 to 20 mg | 20 mg (10 mg over 65 in UK labels) | Nexito, Stalopam, Rexipra | Single step to 20 mg if needed; ECG if cardiac risk or other QT drugs |
| Citalopram | 20 mg | 20 to 40 mg | 40 mg (20 mg over 65, or with CYP2C19 inhibitors) | | Avoid with other QT-prolonging drugs |
| Fluoxetine | 20 mg (10 mg in young people or panic) | 20 to 40 mg | 60 mg (higher in bulimia) | Fludac, Flunil, Prodep | Morning; slow to reach steady state, so dose increases are judged later; strong CYP2D6 inhibitor |
| Paroxetine | 20 mg (10 mg in panic) | 20 to 40 mg | 50 mg (CR formulations differ) | Pexep, Xet, Paxidep | Morning; taper very slowly on stopping |
| Fluvoxamine | 50 mg at night | 100 to 200 mg | 300 mg (divide doses above 150 mg) | Fluvoxin, Uvox | Raise by 50 mg steps; check clozapine, olanzapine and theophylline levels |

**Before starting:** ask about past mania or hypomania; current medicines (NSAIDs, anticoagulants, tramadol, triptans, other serotonergic drugs); sodium in older adults or those on diuretics; ECG if cardiac disease or before higher-dose citalopram or escitalopram.
:::

:::widget decide
{"scene": "Sneha, 19, a first-year engineering student in Kota, has moderate depression and has been started on fluoxetine 20 mg. She returns a few days later and says she feels restless, can't sit still and has had new thoughts that 'it would be easier not to wake up'.", "ask": "What do you do?", "choices": [{"label": "Reassure her that this is normal and review in a month", "verdict": "harm", "outcome": "Days later her roommate finds her with a stockpile of tablets.", "why": "New or worse suicidal thinking and agitation early in treatment, in someone under 25, needs same-day review."}, {"label": "Assess suicide risk now, involve family with her consent, review the medicine (lower dose or change), see her again within days and limit supplies", "verdict": "best", "outcome": "Her risk is moderate. The dose is lowered, her sister keeps the tablets, and she is seen twice in the next week. The restlessness settles and her mood improves.", "why": "Activation and emergent suicidal thinking in young people is a known early risk. The answer is close monitoring and safety planning, not abandoning treatment altogether."}, {"label": "Double the dose so it works faster", "verdict": "harm", "outcome": "Her agitation worsens.", "why": "Activation is dose-related; increasing makes it worse."}]}
:::

:::widget guess
{"prompt": "After starting an antidepressant in someone under 25, how soon should they be reviewed?", "min": 0, "max": 8, "unit": "weeks", "answer": [1, 1], "reveal": "Within about 1 week, then often during the first month. Young people have a small rise in suicidal thinking early in treatment, so early, frequent contact is the rule.", "clinician": "NICE advises review after 1 week for those under 25 or at increased suicide risk, and after 2 weeks for others, then regularly (for example every 2 to 4 weeks) for the first 3 months."}
:::

:::recall
1. Name five common SSRI side effects and the receptor behind nausea. || Nausea, jitteriness, insomnia, sexual dysfunction, sweating; 5-HT3.
2. Which SSRI has the worst discontinuation and is avoided in pregnancy? || Paroxetine.
3. Which SSRI is first choice in adolescents, and why? || Fluoxetine: best evidence; long half-life.
4. Which SSRI strongly inhibits CYP1A2? || Fluvoxamine.
5. Which SSRIs carry a dose-related QT risk? || Citalopram and escitalopram.
:::

:::mcq
Q: A woman on fluoxetine starts a migraine medicine and within a day has tremor, sweating, agitation and twitching legs. Which medicine was most likely added?
- Paracetamol
- *Sumatriptan
- Propranolol
- Domperidone
> Combining serotonergic drugs can cause serotonin syndrome; triptans add a small risk.

Q: Why do SSRIs increase bleeding risk?
- They lower platelet count
- *Platelets use SERT to take up serotonin for clotting, and SSRIs block it
- They thin the blood like warfarin
- They damage the stomach directly
> Platelet serotonin is depleted; the risk rises with NSAIDs, aspirin and anticoagulants.
:::

## 2.2 SNRIs, bupropion and mirtazapine [core][beginner]
### SNRIs: a second pump
:::widget synapse
{"drug": "snri", "caption": "An SNRI blocks the serotonin pump and, increasingly at higher doses, the noradrenaline pump. Noradrenaline adds energy and pain relief, and also sweating, raised blood pressure and a faster pulse."}
:::

| Medicine | Useful when | Watch for |
|---|---|---|
| Venlafaxine | Depression, GAD, panic, social anxiety | Behaves like an SSRI at low doses and adds noradrenaline at higher doses; **raised blood pressure** at higher doses; marked discontinuation; more toxic in overdose than SSRIs |
| Desvenlafaxine | As venlafaxine (its active metabolite) | Fewer CYP2D6 issues; blood pressure |
| Duloxetine | Depression with **pain** (diabetic neuropathy, fibromyalgia, back pain), GAD | Nausea; avoid in liver disease and heavy alcohol use; urinary hesitancy |

### Bupropion: the energising one
- Blocks **noradrenaline and dopamine** pumps (weakly), with no serotonin action.
- Good for fatigue, low drive, oversleeping, avoiding sexual side effects and weight gain, and **stopping smoking**.
- Main risk: **seizures**, dose-related. Avoid in epilepsy, eating disorders (bulimia, anorexia), alcohol or benzodiazepine withdrawal, and head injury.
- Can worsen anxiety and insomnia; no use on its own for anxiety disorders.
- Strong CYP2D6 inhibitor.


:::widget release
{
 "transmitter": "dopamine",
 "title": "Bupropion and amphetamine: blocking the pump or reversing it",
 "caption": "Pick SSRI to stand in for bupropion here: it blocks the dopamine and noradrenaline pumps, so released dopamine lingers, but only when the neuron fires. Now pick Amphetamine: the pump runs backwards and pushes dopamine out even without a signal. That is why bupropion is a mild, slow antidepressant and amphetamine is a strong stimulant with misuse potential."
}
:::

### Mirtazapine: the sleepy, hungry one
- Blocks **alpha-2** autoreceptors (taking the brake off noradrenaline and serotonin release), and blocks **5-HT2A, 5-HT2C and 5-HT3** receptors (less anxiety, insomnia, nausea and sexual dysfunction).
- Strongly blocks **H1**: **sedation and weight gain**. Oddly, lower doses are often more sedating than higher ones, because at higher doses the noradrenaline effect partly balances the antihistamine effect.
- Useful in older adults, insomnia, poor appetite; little sexual dysfunction; safe in heart disease.
- Rare low white cell count: report sore throat and fever.

:::widget receptor
{"receptor": "alpha-2", "title": "Mirtazapine at the brake receptor", "caption": "Noradrenaline normally acts as the full agonist at its own alpha-2 brake, telling the neuron to release less. Choose Antagonist: that is mirtazapine. The brake signal drops to background, so the neuron releases more noradrenaline, and more serotonin too, because alpha-2 brakes also sit on serotonin nerve endings."}
:::

:::student
### Typical adult daily doses (for learning; check current guidelines)
| Medicine | Typical adult daily range |
|---|---|
| Venlafaxine (slow release) | 75 to 225 mg |
| Desvenlafaxine | 50 to 100 mg |
| Duloxetine | 60 mg (up to 120 mg) |
| Bupropion (slow release) | 150 to 300 mg |
| Mirtazapine | 15 to 45 mg at night |
:::

:::clinician
### Dosing (for learning; check current guidelines)
| Medicine | Start | Usual | Maximum | Indian brands | Titration and notes |
|---|---|---|---|---|---|
| Venlafaxine XR | 37.5 to 75 mg once daily | 75 to 225 mg | 375 mg (specialist; immediate-release divided) | Venlor, Veniz XR, Ventab XL | Raise by 75 mg steps; check blood pressure at baseline and with each increase; taper very slowly |
| Desvenlafaxine | 50 mg | 50 mg | 100 mg (higher doses add side effects, little benefit) | Desvenlor, D-Venz, Pristiq | Reduce in renal impairment |
| Duloxetine | 30 mg for a few days, then 60 mg | 60 mg | 120 mg | Duvanta, Dulane, Duzela | Starting at 30 mg reduces nausea; avoid if liver disease or heavy drinking; avoid with strong CYP1A2 inhibitors (fluvoxamine, ciprofloxacin) |
| Bupropion SR | 150 mg in the morning | 150 mg twice daily (doses at least 8 hours apart) | 450 mg (XL) | Bupron SR, Smoquit | Second dose not late in the day (insomnia); single doses not above 150 mg SR to limit seizure risk |
| Mirtazapine | 15 mg at night (7.5 mg in frail elderly) | 15 to 45 mg | 45 mg | Mirtaz, Mirnite, Mirt | Raise in 15 mg steps; often combined with an SNRI in resistant depression |
:::

:::widget decide
{"scene": "Mr Iyer, 74, a retired schoolteacher in Coimbatore, has moderate depression. He sleeps three hours a night, has lost 6 kg, has type 2 diabetes with painful feet, takes a water tablet for blood pressure, and had a small heart attack last year.", "ask": "Which first choice fits his whole picture best?", "choices": [{"label": "Amitriptyline at night, for sleep and nerve pain", "verdict": "harm", "outcome": "He becomes confused, constipated, dizzy when standing and falls in the bathroom.", "why": "Tricyclics in an older man with heart disease bring anticholinergic, alpha-1 and cardiac risks."}, {"label": "Mirtazapine 7.5 to 15 mg at night, with a sodium check and pain review", "verdict": "best", "outcome": "He sleeps better within days, his appetite returns, and his mood lifts over the following weeks. Sodium stays normal.", "why": "Sedation and appetite help his main problems, it is safe after a heart attack, has little effect on sodium compared with SSRIs, and causes few interactions."}, {"label": "Duloxetine for the pain, plus his water tablet", "verdict": "ok", "outcome": "His pain eases somewhat, but his sleep is still poor and he loses more weight; his sodium drifts down.", "why": "Reasonable for pain, but it does not help sleep or appetite, and it carries an SSRI-like sodium risk with the diuretic. Sertraline or mirtazapine fit better."}]}
:::

:::recall
1. What happens to blood pressure on venlafaxine at higher doses, and why? || It rises, because noradrenaline reuptake is blocked more at higher doses.
2. Which antidepressant for depression with diabetic neuropathy? || Duloxetine.
3. Name four situations where bupropion is avoided. || Epilepsy, eating disorders, alcohol or benzodiazepine withdrawal, head injury.
4. Which receptor explains mirtazapine's sedation and weight gain? || Histamine H1.
5. Why does mirtazapine cause little sexual dysfunction or nausea? || It blocks 5-HT2A, 5-HT2C and 5-HT3 receptors rather than stimulating them.
:::

:::mcq
Q: A 30-year-old man with depression, low energy and oversleeping wants to quit smoking and is worried about sexual side effects. He had a seizure after a head injury two years ago. The best response is:
- Bupropion is ideal for all his needs
- *Bupropion fits his symptoms, but the seizure history makes it unsuitable; choose another
- Mirtazapine, for energy
- Paroxetine, for smoking
> Seizure history is a key contraindication to bupropion.

Q: Which antidepressant is LEAST likely to cause sexual dysfunction?
- Paroxetine
- Venlafaxine
- *Mirtazapine
- Sertraline
> Mirtazapine and bupropion are the classic low-sexual-side-effect choices.
:::

## 2.3 Tricyclics [core][beginner]
Tricyclics are effective, cheap and widely available in India, but toxic in overdose, so they are now second-line for depression. Low doses (amitriptyline 10 to 25 mg at night) are commonly used for pain, headache and poor sleep.

:::mnemonic The four extra blocks that explain every tricyclic side effect
| Receptor blocked | Effects |
|---|---|
| Muscarinic (anticholinergic) | Dry mouth, constipation, urinary retention, blurred vision, fast pulse, confusion in older adults |
| Histamine H1 | Sedation, weight gain |
| Alpha-1 adrenergic | Dizziness on standing, falls |
| Cardiac sodium channels | Slowed heart conduction, arrhythmias: lethal in overdose |
:::

:::safety Tricyclic overdose
A small number of days' supply can kill. Features: anticholinergic signs (dry flushed skin, dilated pupils, retention, ileus), drowsiness then coma, seizures, low blood pressure, and **ECG changes: wide QRS** and arrhythmias. Emergency treatment: airway, cardiac monitoring, activated charcoal if early and airway safe, **intravenous sodium bicarbonate** for wide QRS or arrhythmia, benzodiazepines for seizures, and avoid flumazenil. Prescribe small quantities to anyone at risk.
:::

- Avoid after a recent heart attack, in heart block, narrow-angle glaucoma, prostate enlargement, and in older adults where possible.
- **Clomipramine** is the most serotonergic tricyclic: used in OCD. **Nortriptyline** (a secondary amine) is less anticholinergic and less sedating than amitriptyline.
- Dothiepin (dosulepin) has particularly high toxicity in overdose.

:::widget compare
{"title": "An SSRI and a tricyclic, side by side", "a": {"label": "Sertraline (SSRI)", "points": ["Blocks the serotonin pump, little else", "Early nausea, loose stools, sexual side effects", "Little sedation, no dry mouth", "Rarely dangerous in overdose on its own", "Usable after a heart attack and in older adults"], "summary": "First-line: as effective for most, easier to live with and far safer."}, "b": {"label": "Amitriptyline (tricyclic)", "points": ["Blocks serotonin and noradrenaline pumps plus muscarinic, H1, alpha-1 and sodium channels", "Dry mouth, constipation, sedation, weight gain, dizziness on standing", "Confusion and falls in older adults", "A few days' supply can be fatal in overdose", "Low doses still useful for pain and migraine"], "summary": "Second-line for depression; keep supplies small and avoid in heart disease and older adults."}, "caption": "Slide between the two. The benefit for mood is similar; almost every difference comes from the extra receptors the tricyclic blocks."}
:::

:::student
### Typical adult daily doses (for learning; check current guidelines)
| Medicine | Typical daily range |
|---|---|
| Amitriptyline for depression | 75 to 150 mg at night |
| Amitriptyline for pain | 10 to 50 mg at night |
| Imipramine | 75 to 200 mg |
| Clomipramine | 75 to 250 mg |
:::

:::clinician
### Tricyclic dosing (for learning; check current guidelines)
| Medicine | Start | Usual | Maximum | Indian brands | Titration and notes |
|---|---|---|---|---|---|
| Amitriptyline | 25 to 50 mg at night | 75 to 150 mg | 200 mg outpatient (higher only as inpatient) | Tryptomer, Amitone, Sarotena | Raise by 25 mg steps every few days as tolerated; ECG if over 50 or cardiac risk |
| Imipramine | 25 to 75 mg | 100 to 200 mg | 300 mg (inpatient) | Depsonil, Antidep | As above |
| Clomipramine | 25 mg | 100 to 150 mg | 250 mg | Clofranil, Anafranil | Seizure risk rises with dose; strongly serotonergic |
| Nortriptyline | 25 mg | 75 to 100 mg | 150 mg | | Therapeutic window: levels useful |

Combination tablets with a tricyclic and a benzodiazepine or antipsychotic are widely sold in India (for example amitriptyline with chlordiazepoxide). Prefer single agents so each dose can be adjusted and stopped separately.
:::

:::widget build
{"vignette": "A 26-year-old woman is brought in 3 hours after swallowing her mother's amitriptyline strip. She is drowsy, her skin is hot and dry, pupils are dilated, pulse is 128, BP 88/50, and she has not passed urine. Her ECG shows a QRS of 140 ms. Her temperature is normal and she has no clonus.", "rule": "Tick every feature of tricyclic toxicity that is present. Two or more, including one core cardiac sign, means treat as severe.", "symptoms": [{"label": "Wide QRS on ECG", "present": true, "core": true, "why": "Sodium-channel block: the most important sign; predicts seizures and arrhythmia."}, {"label": "Low blood pressure", "present": true, "core": true, "why": "Alpha-1 block plus myocardial depression."}, {"label": "Dry, hot skin and dilated pupils", "present": true, "why": "Anticholinergic signs."}, {"label": "Fast pulse", "present": true}, {"label": "Urinary retention", "present": true}, {"label": "Clonus and very brisk reflexes", "present": false, "why": "That points to serotonin syndrome, not tricyclic toxicity."}, {"label": "Pinpoint pupils", "present": false, "why": "Pinpoint pupils suggest opioids."}, {"label": "Profuse sweating", "present": false, "why": "Anticholinergic toxicity gives dry skin."}], "need": 2, "needCore": true, "verdict": "This is severe tricyclic toxicity: sodium-channel block (wide QRS, hypotension) with an anticholinergic picture. Give intravenous sodium bicarbonate, monitor continuously, and be ready to treat seizures with a benzodiazepine."}
:::

:::recall
1. List the four receptor blocks of tricyclics with one effect each. || Muscarinic (dry mouth), H1 (sedation), alpha-1 (dizziness on standing), sodium channel (arrhythmia).
2. What is the treatment for wide QRS in tricyclic overdose? || Intravenous sodium bicarbonate.
3. Which tricyclic is used in OCD? || Clomipramine.
4. Name three conditions in which tricyclics are avoided. || Recent heart attack or heart block, narrow-angle glaucoma, prostate enlargement.
:::

:::mcq
Q: A young man on amitriptyline for back pain swallows his month's supply. The most dangerous effect to watch for is:
- Weight gain
- *Heart rhythm problems (wide QRS) and seizures
- Sexual dysfunction
- Hair loss
> Sodium-channel block drives the lethality.
:::

:::widget figure
{"id": "tca-synapse"}
:::

## 2.4 MAOIs [extra][beginner]
:::widget synapse
{"drug": "maoi", "caption": "An MAOI does not touch the pump. It stops the enzyme that destroys serotonin, noradrenaline and dopamine, so more is stored and released. The same enzyme in the gut normally destroys tyramine from food."}
:::

- Rarely used now in India; reserved for resistant or atypical depression under specialist care.
- **Tyramine ("cheese") reaction**: with gut and liver MAO-A blocked, tyramine from aged cheese, cured or fermented meat and fish, soy sauce, yeast extracts, broad bean pods and some draught beers enters the blood and releases noradrenaline: a **hypertensive crisis** (pounding headache, stiff neck, palpitations, risk of stroke).
- Dangerous interactions: other antidepressants, tramadol, pethidine, dextromethorphan (cough syrups), linezolid, methylene blue, decongestants and stimulants.
- **Moclobemide** is reversible and MAO-A selective, with much lower tyramine risk at usual doses.
- **Selegiline** (MAO-B at low doses) is used in Parkinson's disease; a skin patch form is used for depression in some countries.


:::widget release
{
 "transmitter": "serotonin",
 "title": "An MAOI: the enzyme switched off",
 "caption": "Pick MAOI and play the signal. The pump still works, but the enzyme that breaks down recycled serotonin is blocked, so the stores fill and each signal releases more. In the gut the same enzyme normally destroys tyramine from food, which is why diet matters on the older, irreversible MAOIs."
}
:::

:::widget guess
{"prompt": "After stopping fluoxetine, how many weeks should pass before starting an irreversible MAOI?", "min": 0, "max": 10, "unit": "weeks", "answer": [5, 6], "reveal": "At least 5 weeks, because fluoxetine and norfluoxetine linger. After most other SSRIs and SNRIs the gap is about 1 to 2 weeks. After stopping an irreversible MAOI, wait 2 weeks before starting another antidepressant, because the body must make new enzyme.", "clinician": "Washouts: fluoxetine to MAOI at least 5 weeks; other SSRIs and venlafaxine to MAOI at least 1 week (2 weeks for sertraline per some labels); irreversible MAOI to any serotonergic drug 2 weeks; moclobemide 24 hours."}
:::

:::recall
1. What is the tyramine reaction? || A hypertensive crisis from tyramine-rich foods when MAO-A in the gut is blocked.
2. Name five foods to avoid on an irreversible MAOI. || Aged cheese, cured meats, soy sauce, yeast extract, fermented fish, broad bean pods, some draught beers.
3. Name four drugs dangerous with MAOIs. || Other antidepressants, tramadol, pethidine, dextromethorphan (also linezolid, decongestants).
:::

:::mcq
Q: A patient on phenelzine eats aged cheese and develops a sudden severe headache with very high blood pressure. This is:
- Serotonin syndrome
- *A tyramine (hypertensive) reaction
- NMS
- Migraine
> Dietary rules prevent it.
:::

:::widget figure
{"id": "maoi-synapse"}
:::

## 2.5 The others [extra][beginner]
| Medicine | How it works | Notes |
|---|---|---|
| Trazodone | Blocks 5-HT2A and H1 and alpha-1; weak SERT block | Sedating; used at low dose for sleep; dizziness on standing; rare **priapism** (painful erection lasting hours: an emergency) |
| Vortioxetine | SERT block plus several serotonin receptors (5-HT3, 5-HT7, 5-HT1D antagonist; 5-HT1B partial agonist; 5-HT1A agonist) | May help thinking and concentration; nausea common; less sexual dysfunction than SSRIs |
| Agomelatine | Melatonin MT1 and MT2 agonist; 5-HT2C antagonist | Helps sleep timing; no sexual side effects or discontinuation; **liver tests** needed |
| Vilazodone | SERT block plus 5-HT1A partial agonist | Take with food |
| Esketamine | NMDA receptor antagonist | Nasal spray for treatment-resistant depression: see the Advanced level |

:::widget receptor
{"receptor": "5-HT1A", "title": "Vilazodone and vortioxetine: a pump blocker with a partial key", "caption": "Pick Partial agonist: that is vilazodone at 5-HT1A. Then pick Full agonist, which is closer to vortioxetine's action there. Both medicines block SERT and also switch on 5-HT1A receptors directly. The idea is to turn the autoreceptor brake down sooner, so release rises without waiting so long. Whether this truly speeds recovery is still argued."}
:::

:::student
### Typical adult daily doses (for learning; check current guidelines)
| Medicine | Typical daily range |
|---|---|
| Trazodone for depression | 150 to 300 mg |
| Trazodone for sleep | 25 to 100 mg at night |
| Vortioxetine | 5 to 20 mg |
| Agomelatine | 25 to 50 mg at bedtime |
:::

:::clinician
### Dosing (for learning; check current guidelines)
| Medicine | Start | Usual | Maximum | Indian brands | Titration and notes |
|---|---|---|---|---|---|
| Trazodone | 50 to 100 mg at night | 150 to 300 mg | 400 mg outpatient (600 mg inpatient) | Trazonil, Trazalon | Raise by 50 mg steps; warn about priapism and dizziness |
| Vortioxetine | 10 mg (5 mg over 65 or if nauseated) | 10 to 20 mg | 20 mg | Brintellix, Vortidep, Vorrexa | Halve the dose with strong CYP2D6 inhibitors (bupropion, fluoxetine, paroxetine) |
| Agomelatine | 25 mg at bedtime | 25 to 50 mg | 50 mg | Agoprex, Agomelin, Valdoxan | Liver tests at baseline and repeatedly early on, and at each dose increase; stop if transaminases rise threefold; avoid in liver disease and over 75 |
:::

:::widget guess
{"prompt": "Agomelatine needs repeated liver tests. Over roughly how many weeks after starting (or raising the dose) are they repeated?", "min": 0, "max": 52, "unit": "weeks", "answer": [24, 24], "reveal": "Tests are done at baseline and then repeatedly over about the first 24 weeks (around weeks 3, 6, 12 and 24), and again after any dose increase, then when clinically indicated.", "clinician": "Liver function tests at baseline, then at about 3, 6, 12 and 24 weeks, repeating the schedule after a dose increase. Stop if transaminases exceed 3 times the upper limit of normal or if jaundice appears."}
:::

:::recall
1. Which antidepressant can cause priapism? || Trazodone (alpha-1 block).
2. What blood test must be monitored on agomelatine? || Liver function tests.
3. Which antidepressant has the broadest set of direct serotonin receptor actions? || Vortioxetine.
:::

:::mcq
Q: A man on trazodone for sleep has a painful erection that has lasted 4 hours. The correct advice is:
- Wait until morning
- Take an extra dose
- *Go to an emergency department now
- Drink water
> Priapism is a urological emergency.
:::

## 2.6 Side effects that matter in practice [core][beginner]
| Side effect | Who is at risk | What to do |
|---|---|---|
| **Low sodium** (SIADH) | Older adults, women, diuretics, low body weight, also with SNRIs | Check sodium at baseline and early on in those at risk; warning signs are confusion, falls, headache, nausea; mirtazapine and bupropion carry lower risk |
| **Bleeding** | With NSAIDs, aspirin, anticoagulants; older age; past ulcer | Avoid the combination or add a stomach-protecting medicine (PPI) |
| **Sexual dysfunction** | Common with SSRIs and SNRIs; often unreported | Ask directly; wait, lower the dose, or switch to bupropion, mirtazapine, vortioxetine or agomelatine |
| **Switch to mania** | Bipolar disorder, family history, young onset | Screen for past highs; avoid antidepressant without a mood stabiliser in bipolar disorder |
| **Early suicidal thinking** | Under 25 | Warn, review early and often, dispense small amounts |
| **QT prolongation** | Citalopram, escitalopram at higher doses, tricyclics; more with other QT drugs, low potassium or magnesium | Respect dose limits; ECG when risk factors |
| **Emotional blunting** | Long-term SSRIs | "I don't feel sad, but I don't feel happy either" |
| **Weight gain** | Mirtazapine, tricyclics, long-term paroxetine | Weigh, advise, choose another |
| **Falls** | Older adults: dizziness on standing, sedation, low sodium | Lowest effective dose, review all medicines |

:::widget guess
{"prompt": "SSRI-related low sodium usually appears early. Within roughly how many weeks of starting does it most often show up?", "min": 0, "max": 12, "unit": "weeks", "answer": [2, 4], "reveal": "Most cases appear within the first 2 to 4 weeks, so a sodium check at baseline and again within the first month is wise in older adults and anyone on a diuretic.", "clinician": "Hyponatraemia usually develops within 30 days of starting. Check sodium at baseline and at 2 and 4 weeks in high-risk patients (over 65, diuretics, low weight, previous hyponatraemia), and if confusion, falls or seizures occur."}
:::

:::widget decide
{"scene": "Mrs D'Souza, 78, in Mangalore, takes a water tablet. She started citalopram recently. Her son says she is drowsy, muddled, and fell twice this week. The GP wonders about dementia.", "ask": "What first?", "choices": [{"label": "Increase citalopram, because her depression is worse", "verdict": "harm", "outcome": "Her sodium falls further and she has a seizure.", "why": "Confusion and falls soon after an SSRI in an older person on a diuretic must be checked for hyponatraemia first."}, {"label": "Check serum sodium today", "verdict": "best", "outcome": "Sodium is 121 mmol/L. Citalopram is stopped, fluids restricted, and she recovers over days. Later, mirtazapine is started.", "why": "SSRI-induced SIADH is common and dangerous at this age."}, {"label": "Refer for a memory clinic appointment in three months", "verdict": "harm", "outcome": "She is admitted with a fractured hip the following week.", "why": "Acute confusion is delirium until proved otherwise, and this has a reversible cause."}]}
:::

:::recall
1. Who is at highest risk of antidepressant-induced low sodium? || Older adults, women, people on diuretics, low body weight.
2. Which antidepressants cause least sexual dysfunction? || Bupropion, mirtazapine, vortioxetine, agomelatine.
3. In which age group is early suicidal thinking a particular concern? || Under 25.
4. Name four things that add to QT risk. || High-dose citalopram or escitalopram, tricyclics, other QT drugs, low potassium or magnesium.
:::

:::mcq
Q: An older woman on a water tablet becomes drowsy and confused soon after starting citalopram. The first test is:
- Brain MRI
- *Serum sodium
- Lithium level
- Lumbar puncture
> SSRI-induced hyponatraemia is common in older people on diuretics.
:::

# Part III · Safety

## 3.1 Serotonin syndrome, and how it differs from NMS [core][beginner]
:::define Serotonin syndrome
Too much serotonin activity, usually from **combining** serotonergic drugs or an overdose. Three groups of signs:
- **Mental**: agitation, restlessness, confusion.
- **Autonomic**: sweating, fever, fast heart, raised blood pressure, diarrhoea, dilated pupils.
- **Neuromuscular**: **clonus** (rhythmic jerks, especially at the ankle, and of the eyes), **overactive reflexes**, tremor, rigidity in the legs more than the arms.
:::

### Common culprits
SSRIs or SNRIs with: MAOIs (the most dangerous), **tramadol**, pethidine, fentanyl, methadone, **linezolid**, methylene blue, triptans (small risk), lithium, dextromethorphan, St John's wort, ondansetron (rare), MDMA ("ecstasy"), and high doses of two antidepressants together.

### Management
1. Stop all serotonergic drugs.
2. Supportive care: fluids, cooling, benzodiazepines for agitation and muscle activity.
3. **Cyproheptadine** (a 5-HT2A blocker) in moderate cases, under specialist guidance.
4. Severe cases (temperature very high, rigidity): intensive care, sedation, paralysis and ventilation. Avoid physical restraint, which worsens heat and muscle breakdown.

:::widget guess
{"prompt": "After a serotonergic drug is added or increased, how soon does serotonin syndrome usually start?", "min": 0, "max": 72, "unit": "hours", "answer": [0, 24], "reveal": "Usually within hours: most cases begin within 24 hours, many within 6. NMS, by contrast, usually develops over days. Speed of onset is one of the best clues to tell them apart.", "clinician": "Most serotonin toxicity presents within 6 to 24 hours of a dose change or new combination, and usually resolves within 24 to 72 hours once the agents are stopped (longer with long half-life drugs or irreversible MAOIs). NMS develops over 1 to 3 days and can last 1 to 2 weeks."}
:::

### Serotonin syndrome or NMS?
| | Serotonin syndrome | Neuroleptic malignant syndrome (NMS) |
|---|---|---|
| Drug | Serotonergic drugs, often a new combination | Dopamine blockers (antipsychotics, metoclopramide) or stopping a dopamine drug in Parkinson's |
| Onset | Fast | Slower |
| Muscles | **Clonus, hyperreflexia**, tremor; rigidity mostly in legs | **Lead-pipe rigidity** throughout, slow movements, reflexes reduced |
| Pupils, gut | Dilated pupils; diarrhoea, active bowel sounds | Normal pupils; bowel sounds normal or reduced |
| Course | Usually settles quickly once drugs are stopped | Slower to resolve |
| Blood tests | CK may rise in severe cases | **CK very high**, white cells raised, iron low |
| Treatment | Stop drugs, benzodiazepines, cyproheptadine | Stop antipsychotic, cooling, fluids, benzodiazepines, dantrolene or bromocriptine |

:::widget flow
{"title": "Hot, confused and on psychiatric medicines: sorting it out", "layout": "tree", "nodes": [{"id": "r", "label": "Fever, confusion and abnormal muscles on psychiatric medicines", "detail": "Treat as a medical emergency first: airway, temperature, fluids, bloods including CK, sodium and glucose. Then use the examination to sort the cause."}, {"id": "q1", "label": "Clonus and very brisk reflexes, came on over hours", "parent": "r", "detail": "Neuromuscular excitement, worse in the legs. Look for a new serotonergic drug or dose rise."}, {"id": "q2", "label": "Lead-pipe rigidity everywhere, came on over days", "parent": "r", "detail": "Slow, stiff, mute, sweating, blood pressure swinging. Look for a dopamine blocker or a stopped Parkinson's medicine."}, {"id": "q3", "label": "Hot, dry, flushed, big pupils, full bladder, quiet bowel", "parent": "r", "detail": "Muscles normal. Look for stacked anticholinergic medicines."}, {"id": "ss", "label": "Serotonin syndrome", "parent": "q1", "detail": "Stop serotonergic drugs, benzodiazepines, cooling, cyproheptadine if moderate; intensive care if severe."}, {"id": "nms", "label": "Neuroleptic malignant syndrome", "parent": "q2", "detail": "Stop the antipsychotic, cool, fluids, benzodiazepines; dantrolene or bromocriptine in severe cases; watch kidneys."}, {"id": "ach", "label": "Anticholinergic toxicity", "parent": "q3", "detail": "Stop the culprits, catheterise if retained, cool; specialist physostigmine only in selected cases."}], "caption": "Tap each branch. The muscles and the speed of onset sort most cases before any blood test comes back."}
:::

:::widget decide
{"scene": "Mr Khan, 45, in Hyderabad, takes escitalopram 20 mg and olanzapine 10 mg. He had dental surgery yesterday and was given tramadol. This evening he is agitated, sweating heavily, temperature 38.6 °C, pulse 124, with jerking at both ankles when the feet are flexed and very brisk reflexes. His pupils are large. The junior doctor says 'He's on olanzapine and has a fever: this is NMS, start bromocriptine.'", "ask": "What is the best interpretation and plan?", "choices": [{"label": "Agree it is NMS: stop olanzapine and give bromocriptine", "verdict": "harm", "outcome": "Bromocriptine adds dopamine and serotonin effects; his agitation and clonus worsen.", "why": "Fast onset after tramadol, clonus, hyperreflexia, sweating and large pupils point to serotonin syndrome, not NMS."}, {"label": "Serotonin syndrome from tramadol plus escitalopram: stop both, give fluids, cooling and a benzodiazepine, and consider cyproheptadine; monitor closely", "verdict": "best", "outcome": "Within a day his temperature and clonus settle. Escitalopram is restarted later; tramadol is listed as an interaction to avoid.", "why": "Rapid onset after a new serotonergic drug with neuromuscular excitation (clonus, hyperreflexia) is the signature of serotonin toxicity."}, {"label": "Give paracetamol and review in the morning", "verdict": "harm", "outcome": "His temperature rises overnight and he needs intensive care.", "why": "This is a medical emergency, and antipyretics do not treat muscle-generated heat."}]}
:::

:::recall
1. Give the three groups of serotonin syndrome signs with two examples each. || Mental (agitation, confusion); autonomic (sweating, fever); neuromuscular (clonus, hyperreflexia).
2. Name five drugs that can cause it with an SSRI. || MAOIs, tramadol, pethidine, linezolid, triptans (also lithium, dextromethorphan, St John's wort, MDMA).
3. Which antidote is used in serotonin syndrome? || Cyproheptadine.
4. Give three differences between serotonin syndrome and NMS. || Fast vs slow onset; clonus and hyperreflexia vs lead-pipe rigidity; settles quickly vs slowly; CK very high in NMS.
:::

:::mcq
Q: Which sign best distinguishes serotonin syndrome from NMS?
- Fever
- Confusion
- *Clonus with very brisk reflexes
- Raised pulse
> Clonus and hyperreflexia are the neuromuscular signature of serotonin toxicity.

Q: A patient on sertraline is given linezolid for a resistant infection. The concern is:
- Kidney damage
- *Serotonin syndrome, because linezolid is a weak MAOI
- Low blood sugar
- Low platelets
> Linezolid inhibits MAO.
:::

## 3.2 Discontinuation symptoms [core][beginner]
Stopping an antidepressant suddenly, or missing doses, can cause **discontinuation symptoms**. They are not addiction, but they are real, can be severe and long-lasting in some people, and are often mistaken for relapse.

:::mnemonic FINISH
**F**lu-like feelings (aches, tiredness), **I**nsomnia and vivid dreams, **N**ausea, **I**mbalance (dizziness, vertigo), **S**ensory disturbances ("electric shocks", "brain zaps"), **H**yperarousal (anxiety, irritability, agitation).
:::

- Worst with **paroxetine** and **venlafaxine** (short half-lives); least with **fluoxetine** (long half-life).
- Risk is higher after longer treatment and higher doses.

:::widget guess
{"prompt": "After a sudden stop of a short half-life antidepressant, within how many days do discontinuation symptoms usually begin?", "min": 0, "max": 14, "unit": "days", "answer": [1, 5], "reveal": "Usually within a few days (often 1 to 3, almost always within 5). Relapse of depression tends to come later and more gradually, with mood symptoms rather than dizziness and 'zaps'.", "clinician": "Onset is typically within 2 to 4 days (sooner with paroxetine and venlafaxine). Symptoms usually last 1 to 2 weeks, but can persist for months in some people. Reinstating the previous dose usually relieves them within about 24 to 72 hours, which helps distinguish them from relapse."}
:::

:::clinician
### Tapering
- Reduce gradually, in steps the patient can tolerate, with the timing of each step guided by symptoms.
- The relationship between dose and SERT occupancy is **curved (hyperbolic)**: going from 20 mg to 10 mg citalopram changes occupancy much less than going from 5 mg to 0. So the **final steps should be the smallest**, for example proportional reductions of 10 to 25% of the current dose, and very low final doses using liquids or tablet fractions.
- If symptoms are troublesome, return to the previous dose and taper more slowly.
- For paroxetine or venlafaxine that cannot be tapered, a cross-over to fluoxetine (which then tapers itself) is an option.
- Distinguish discontinuation (soon after, physical symptoms, settles fast on reinstatement) from relapse (later, gradual, mood symptoms).
:::


:::widget curve
{
 "kind": "half-life",
 "title": "Why a short half-life makes stopping harder",
 "caption": "Set a short half-life (paroxetine, venlafaxine) and stop the doses: the level falls off a cliff within a few days, and the brain, adapted to high serotonin, feels the drop. Now set a very long half-life (fluoxetine): the level glides down on its own, a built-in taper."
}
:::

:::widget reveal
{"prompt": "Why does paroxetine cause worse discontinuation symptoms than fluoxetine, even though both are SSRIs?", "answer": "Half-life. Paroxetine is cleared fast (and inhibits its own metabolism, so levels collapse sharply once stopped), so SERT occupancy drops suddenly. Fluoxetine and norfluoxetine have very long half-lives, so levels fall slowly: the drug effectively tapers itself. Paroxetine's anticholinergic action adds a cholinergic rebound."}
:::

:::recall
1. Expand FINISH. || Flu-like, insomnia, nausea, imbalance, sensory disturbances, hyperarousal.
2. Which antidepressants cause the worst, and the least, discontinuation symptoms? || Paroxetine and venlafaxine; fluoxetine.
3. How do you tell discontinuation from relapse? || Discontinuation is early, physical, and settles quickly on reinstating; relapse is later, gradual and mood-based.
4. Why should the final taper steps be the smallest? || Occupancy changes most at low doses (hyperbolic curve).
:::

:::mcq
Q: Three days after a patient ran out of venlafaxine, she has dizziness, nausea and "electric shocks" in her head. Most likely:
- Relapse of depression
- *Discontinuation symptoms
- Serotonin syndrome
- A stroke
> Early, physical and typical: restart and taper slowly.
:::

## 3.3 Choosing an antidepressant for the person in front of you [core][beginner]
| Situation | Good choices | Avoid or take care |
|---|---|---|
| Most adults | Sertraline, escitalopram, fluoxetine | |
| Children and adolescents | **Fluoxetine** first (then sertraline or escitalopram) | Tricyclics, paroxetine, venlafaxine |
| Older adults | Sertraline, mirtazapine, escitalopram (lower dose) | Tricyclics, paroxetine (anticholinergic); check sodium |
| Heart disease | **Sertraline**, mirtazapine | Tricyclics; high-dose citalopram and escitalopram |
| Epilepsy | SSRIs (sertraline, escitalopram) | Bupropion, clomipramine, high-dose tricyclics |
| Liver disease | Sertraline or escitalopram at lower doses | Duloxetine, agomelatine |
| Kidney disease | Sertraline, escitalopram, mirtazapine (lower dose) | Desvenlafaxine and venlafaxine need dose reduction |
| Overdose risk | SSRIs, mirtazapine | **Tricyclics**, venlafaxine; dispense small amounts |
| Sexual side effects matter | Bupropion, mirtazapine, vortioxetine, agomelatine | Paroxetine, other SSRIs, SNRIs |
| Poor sleep and appetite | Mirtazapine | Bupropion, fluoxetine (activating) |
| Pain | Duloxetine, low-dose amitriptyline | |
| On tamoxifen | Sertraline (weak), escitalopram, venlafaxine, mirtazapine | **Fluoxetine, paroxetine, bupropion** (block tamoxifen's activation by CYP2D6) |
| On blood thinners or NSAIDs | Mirtazapine | SSRIs without stomach protection |

### Pregnancy and breastfeeding
Untreated depression also harms mother and baby. Decisions are shared with the woman, ideally with an obstetrician and a perinatal psychiatrist.
- **Sertraline** is often preferred in pregnancy and breastfeeding; the medicine that worked before is also a sensible choice.
- **Paroxetine** is avoided in the first trimester (heart malformation concerns).
- Late-pregnancy SSRIs carry a small risk of **neonatal adaptation symptoms** (jitteriness, feeding problems) and a small absolute risk of persistent pulmonary hypertension of the newborn.
- Valproate-like dangers do not apply to SSRIs; the absolute risks are low.

:::widget decide
{"scene": "Ayesha, 29, from Lucknow, has just found out she is pregnant (first trimester). She has had three depressive episodes; the last was severe with suicidal thoughts. She has been well for a year on paroxetine 30 mg. She asks, 'Should I just stop it now that I'm pregnant?'", "ask": "What is the best plan?", "choices": [{"label": "Stop paroxetine today: medicines and pregnancy don't mix", "verdict": "harm", "outcome": "She has severe discontinuation symptoms, then relapses in the second trimester and stops eating.", "why": "Abrupt stopping risks discontinuation and relapse; with three past episodes, her risk of relapse off treatment is high."}, {"label": "Discuss risks of both options; plan a gradual switch to sertraline with close monitoring, involve her obstetrician and a perinatal team", "verdict": "best", "outcome": "She switches carefully over the next weeks, stays well, and delivers a healthy baby. She breastfeeds on sertraline.", "why": "Continuing treatment protects her; sertraline has more reassuring data than paroxetine; the switch is gradual and shared."}, {"label": "Continue paroxetine unchanged without discussion", "verdict": "ok", "outcome": "She stays well, but the conversation about options never happens.", "why": "Continuing a working medicine can be reasonable, but she deserved an informed discussion, and paroxetine is the SSRI most often avoided early in pregnancy."}]}
:::

### QT risk
The QT interval on the ECG is the time the heart takes to reset between beats. When it is too long, a dangerous rhythm (torsades de pointes) can occur. Risk adds up: a QT drug, plus another QT drug, plus low potassium, plus heart disease, plus older age.

:::widget decide
{"scene": "Mr Gill, 66, in Amritsar, takes methadone for opioid dependence and has heart failure. He is on furosemide and his potassium was low last month. He now has moderate depression.", "ask": "Which antidepressant plan is safest for his heart rhythm?", "choices": [{"label": "Citalopram 40 mg", "verdict": "harm", "outcome": "His ECG shows a QTc of 530 ms and he has an episode of fainting.", "why": "Citalopram adds dose-related QT prolongation to methadone, low potassium and heart failure, and 40 mg exceeds the older-adult maximum."}, {"label": "Sertraline at a low starting dose, after correcting potassium and with a baseline and follow-up ECG", "verdict": "best", "outcome": "His QTc stays stable and his mood improves.", "why": "Sertraline has the most reassuring cardiac data among SSRIs. Correct electrolytes and check the ECG because his other risks remain."}, {"label": "Amitriptyline at night for sleep and mood", "verdict": "harm", "outcome": "He develops a fast irregular rhythm and dizziness on standing.", "why": "Tricyclics slow cardiac conduction and are avoided in heart disease."}]}
:::

:::recall
1. Which antidepressant is first choice in adolescents? || Fluoxetine.
2. Which antidepressant has the best cardiac safety data? || Sertraline.
3. Which antidepressants should be avoided with tamoxifen, and why? || Fluoxetine, paroxetine, bupropion: CYP2D6 inhibition stops tamoxifen being activated.
4. Which SSRI is avoided in early pregnancy? || Paroxetine.
5. Name four things that add up to raise QT risk. || A QT drug, a second QT drug, low potassium or magnesium, heart disease, older age.
:::

:::mcq
Q: A 15-year-old girl has moderate depression that has not improved with psychological therapy. The first-choice antidepressant is:
- Paroxetine
- Amitriptyline
- *Fluoxetine
- Venlafaxine
> Fluoxetine has the best evidence of benefit over risk in young people.
:::

## 3.4 When depression does not respond, and switching safely [core][beginner]
### First, ask "is this really non-response?"
1. Is the diagnosis right? Consider bipolar depression, a medical cause (thyroid, anaemia, B12), substance use, personality factors or ongoing stress or abuse.
2. Is the medicine being taken? Ask kindly; check for side effects that led to missed doses.
3. Was the dose high enough, for long enough?
4. Are other medicines lowering levels (an inducer such as carbamazepine), or is the person a fast metaboliser?

### Then, the next steps (in rough order)
1. **Increase the dose** if tolerated and response is partial.
2. **Switch** to another antidepressant: within class (another SSRI) or to a different class (SNRI, mirtazapine, bupropion).
3. **Augment**: add lithium, or a second-generation antipsychotic such as aripiprazole or quetiapine.
4. **Combine** antidepressants, for example mirtazapine added to an SSRI or SNRI.
5. Add or switch to an evidence-based **psychological therapy**.
6. **ECT** for severe, psychotic, life-threatening or resistant depression; esketamine and rTMS where available (Advanced level).

:::widget flow
{"title": "Choosing how to switch", "layout": "tree", "nodes": [{"id": "s", "label": "Switching from one antidepressant to another", "detail": "First ask why: no response, side effects, or a new medical problem. The reason guides the next choice."}, {"id": "m", "label": "Is either drug an irreversible MAOI?", "parent": "s", "detail": "Phenelzine or tranylcypromine on either side changes every rule."}, {"id": "mw", "label": "Yes: full washout", "parent": "m", "detail": "Stop the first drug and wait. After fluoxetine the wait before an MAOI is long; after an irreversible MAOI, wait for the body to make new enzyme before any serotonergic drug."}, {"id": "f", "label": "No: is the old drug fluoxetine?", "parent": "s", "detail": "Its long-lived metabolite keeps working and keeps blocking CYP2D6 after the last dose."}, {"id": "fy", "label": "Yes: stop, short gap, start the new drug low", "parent": "f", "detail": "Fluoxetine tapers itself. Start the new drug at a low dose and watch for interactions and serotonin toxicity."}, {"id": "same", "label": "Same target (SSRI to SSRI, SSRI to SNRI)", "parent": "s", "detail": "Usually a direct switch or a short cross-taper: the new drug covers the old one, so discontinuation is mild."}, {"id": "diff", "label": "Different target (SSRI to mirtazapine, bupropion, agomelatine, a tricyclic)", "parent": "s", "detail": "Cross-taper: lower the old one in steps while the new one builds up. Watch for discontinuation as the old one falls, and for added side effects while both overlap."}], "caption": "Tap through the branches. Every switch has two dangers to watch: too much serotonin while both are on board, and discontinuation as the old drug leaves."}
:::

:::widget decide
{"scene": "Ms Fernandes, 42, a nurse in Goa, has OCD and depression. Fluoxetine 40 mg for several months helped only a little. Her psychiatrist wants to move her to clomipramine. The resident writes: 'Stop fluoxetine tonight, start clomipramine 150 mg tomorrow.'", "ask": "What do you advise?", "choices": [{"label": "Follow the plan as written", "verdict": "harm", "outcome": "Within days she is shaky, sweating and confused, with a racing pulse. Her clomipramine level is several times the expected value, and her ECG shows a widened QRS.", "why": "Fluoxetine and norfluoxetine stay for weeks and strongly block CYP2D6, so clomipramine builds up. Two serotonergic drugs overlapping, at a full tricyclic dose from day one, risks both serotonin toxicity and tricyclic cardiotoxicity."}, {"label": "Stop fluoxetine, then start clomipramine at 25 mg after a gap, rise slowly, check an ECG and, where available, a clomipramine level, and warn her about serotonin toxicity", "verdict": "best", "outcome": "She tolerates the slow build-up. Her OCD improves over the following months on a moderate dose.", "why": "The switch respects fluoxetine's long tail: a low start, slow climb and monitoring cover the CYP2D6 interaction and the serotonergic overlap."}, {"label": "Keep fluoxetine and add clomipramine 150 mg on top", "verdict": "harm", "outcome": "She develops serotonin toxicity and is admitted.", "why": "Combining a strongly serotonergic tricyclic at full dose with an SSRI that raises its level is the worst of both options."}]}
:::

:::widget worked
{"title": "Switching from an SSRI to another antidepressant", "steps": [{"q": "Rani has had no response to escitalopram 20 mg after a fair trial. You plan to switch to venlafaxine. What are the three ways to switch?", "a": "**Direct switch** (stop one, start the other the next day), **taper and switch** (reduce, then start), or **cross-taper** (reduce one while building the other)."}, {"q": "Which is usually chosen between two SSRIs, or from an SSRI to venlafaxine?", "a": "Often a **direct switch** or short cross-taper, because they act on the same target, so discontinuation is covered. Start the new drug at a low dose."}, {"q": "What must you watch for during any cross-taper of two serotonergic drugs?", "a": "**Serotonin syndrome** (both are on board) and **discontinuation symptoms** (as the old one falls)."}, {"q": "When is a cross-taper NOT allowed?", "a": "To or from an **irreversible MAOI**: a full washout is required. From **fluoxetine**, its long half-life means the new drug often starts low after a short gap, with extra care for interactions (CYP2D6) and serotonin toxicity."}], "yourTurn": [{"q": "A man on paroxetine 40 mg needs to switch to mirtazapine. Paroxetine causes bad discontinuation. Outline a safe plan.", "a": "Cross-taper: start mirtazapine 15 mg at night while reducing paroxetine slowly in steps; mirtazapine's 5-HT2A and 5-HT3 block may soften discontinuation. Watch for discontinuation symptoms and sedation; review regularly."}]}
:::

:::widget decide
{"scene": "Vikram, 38, a bank manager in Pune, has taken sertraline 100 mg for some time with only slight improvement. He reports taking it 'most days', has started drinking four pegs of whisky most nights to sleep, and his thyroid has never been checked.", "ask": "What is your next step?", "choices": [{"label": "Add aripiprazole immediately: this is treatment-resistant depression", "verdict": "harm", "outcome": "He develops restlessness, keeps drinking, and his mood is unchanged.", "why": "Partial adherence, alcohol and an unchecked thyroid mean this is not yet true treatment resistance."}, {"label": "Review adherence, address alcohol, check thyroid and other bloods, then optimise the sertraline dose", "verdict": "best", "outcome": "His TSH is high: he has hypothyroidism. With thyroxine, regular doses, less alcohol and sertraline 150 mg, he improves.", "why": "Always check pseudo-resistance (adherence, substances, medical causes, dose) before escalating."}, {"label": "Switch to a tricyclic, which is stronger", "verdict": "harm", "outcome": "He gets dizzy and sedated; mixed with alcohol this is dangerous.", "why": "Tricyclics are not stronger in outpatients, and are risky with alcohol and in overdose."}]}
:::

:::recall
1. List four causes of 'pseudo-resistance'. || Wrong diagnosis, poor adherence, inadequate dose or duration, substance use or medical cause (also interacting drugs).
2. Name the main next-step strategies after a first antidepressant fails. || Increase, switch, augment, combine, add therapy, ECT.
3. Name two augmenting agents with strong evidence. || Lithium and aripiprazole (also quetiapine).
4. When is a cross-taper never allowed? || To or from an irreversible MAOI.
:::

:::mcq
Q: A depressed woman on an SSRI is to be switched to phenelzine. The correct approach is:
- Cross-taper over a few days
- Start phenelzine the next morning
- *Stop the SSRI and wait for a full washout before starting phenelzine
- Combine them for a month
> Irreversible MAOIs require a washout; with fluoxetine it is especially long.
:::

## 3.5 Level check · Beginner [beginner]
Twelve or more right out of fifteen (80%) opens the Advanced level.

:::mcq
Q: Which SSRI is a strong CYP1A2 inhibitor that can raise clozapine levels?
- Sertraline
- Escitalopram
- *Fluvoxamine
- Citalopram
> Fluvoxamine inhibits CYP1A2 and CYP2C19.

Q: Which antidepressant has the most reassuring cardiac safety data?
- Amitriptyline
- Citalopram at high dose
- *Sertraline
- Venlafaxine
> Studied after heart attack.

Q: Which receptor explains SSRI-induced nausea?
- H1
- M1
- *5-HT3
- Alpha-1
> Gut and brainstem 5-HT3.

Q: Which antidepressant raises blood pressure at higher doses?
- Mirtazapine
- *Venlafaxine
- Sertraline
- Agomelatine
> Noradrenaline reuptake block increases with dose.

Q: A patient with epilepsy needs an antidepressant. Which should be avoided?
- Sertraline
- Escitalopram
- *Bupropion
- Mirtazapine
> Dose-related seizure risk.

Q: The four extra receptor blocks of tricyclics are muscarinic, H1, alpha-1 and:
- Dopamine D2
- *Cardiac sodium channels
- 5-HT3
- GABA-A
> The sodium channel block makes overdose lethal.

Q: Treatment for a wide QRS in tricyclic overdose:
- Flumazenil
- Naloxone
- *Intravenous sodium bicarbonate
- Physostigmine
> Bicarbonate narrows the QRS and protects against arrhythmia.

Q: Which food reaction is linked with irreversible MAOIs?
- Gluten sensitivity
- *Tyramine hypertensive crisis
- Lactose intolerance
- Hypoglycaemia
> Aged cheese, cured meats, soy sauce.

Q: Which sign points to serotonin syndrome rather than NMS?
- Lead-pipe rigidity
- Very high CK only
- *Inducible clonus and hyperreflexia
- Slow onset over days
> Neuromuscular excitation.

Q: Which drug commonly causes serotonin syndrome when added to an SSRI after surgery?
- Paracetamol
- *Tramadol
- Ibuprofen
- Ondansetron in a single dose
> Tramadol is serotonergic and lowers the seizure threshold.

Q: Which antidepressant causes the worst discontinuation symptoms?
- Fluoxetine
- *Paroxetine
- Mirtazapine
- Agomelatine
> Short half-life.

Q: Which antidepressant needs liver tests?
- Sertraline
- *Agomelatine
- Mirtazapine
- Escitalopram
> Agomelatine can raise transaminases.

Q: A woman on tamoxifen needs an antidepressant. Which should be avoided?
- Venlafaxine
- Mirtazapine
- *Paroxetine
- Escitalopram
> Strong CYP2D6 inhibition blocks tamoxifen activation.

Q: The first step when a patient seems not to respond to an antidepressant is to:
- Add an antipsychotic
- Start ECT
- *Check diagnosis, adherence, dose, substances and medical causes
- Switch to a tricyclic
> Rule out pseudo-resistance.

Q: Which switch requires a full washout?
- Sertraline to escitalopram
- Escitalopram to venlafaxine
- *Sertraline to phenelzine
- Fluoxetine to sertraline
> Irreversible MAOIs never overlap with serotonergic drugs.
:::
`;

const p2 = String.raw`

# Part V · Advanced: receptors, kinetics and genes

## 5.1 Binding profiles: why each antidepressant feels different [core][advanced]
Every antidepressant has a **binding profile**: the list of targets it attaches to, and how strongly. Strength of binding is called **affinity**. A medicine with high affinity for a receptor occupies it at low doses; one with low affinity needs much higher doses to occupy it. Side effects are not random: almost each one maps onto a target.

### The translation table: target to effect
| Target and action | What the patient notices | Medicines where this matters |
|---|---|---|
| **SERT block** | Benefit in depression, anxiety, OCD; early nausea, jitteriness; sexual dysfunction; bleeding; low sodium | All SSRIs, SNRIs, clomipramine, vortioxetine |
| **NET block** | Energy, pain relief; sweating, fast pulse, raised blood pressure, tremor, urinary hesitancy, constipation | SNRIs (dose-dependent), tricyclics, bupropion, reboxetine |
| **DAT block** (weak) | Drive, alertness; insomnia; less sexual dysfunction | Bupropion, sertraline (slight) |
| **H1 block** | **Sedation, weight gain** | Mirtazapine, tricyclics, trazodone |
| **M1 (muscarinic) block** | Dry mouth, blurred vision, constipation, urinary retention, fast pulse, poor memory, **confusion and delirium in older adults** | Tricyclics (amitriptyline most), paroxetine (some) |
| **Alpha-1 block** | **Dizziness on standing (orthostasis)**, falls, nasal stuffiness, priapism | Tricyclics, trazodone |
| **Alpha-2 block** | More noradrenaline and serotonin release (antidepressant effect) | Mirtazapine, mianserin |
| **5-HT2A block** | Better sleep, less anxiety and sexual dysfunction | Mirtazapine, trazodone |
| **5-HT2C block** | Releases dopamine and noradrenaline in the prefrontal cortex (energy, mood); with H1 block adds appetite and weight | Agomelatine, mirtazapine, fluoxetine (weak) |
| **5-HT3 block** | Less nausea | Mirtazapine, vortioxetine |
| **Cardiac sodium channel block** | Slowed conduction, wide QRS, arrhythmia in overdose | Tricyclics, high-dose venlafaxine (less) |


:::widget receptor
{
 "receptor": "histamine H1",
 "title": "Why some antidepressants make you sleepy and hungry",
 "caption": "Histamine keeps the brain awake and curbs appetite through H1 receptors. Pick Antagonist (strictly, most of these drugs are inverse agonists): the waking signal falls. Mirtazapine, trazodone at low doses and the tricyclics block H1 strongly, so they sedate and add weight; most SSRIs barely touch it."
}
:::

### Who binds what (simplified)
Strength: +++ strong, ++ moderate, + weak, 0 negligible at usual doses.

| Medicine | SERT | NET | H1 | M1 | Alpha-1 | Other key actions |
|---|---|---|---|---|---|---|
| Escitalopram | +++ | 0 | 0 | 0 | 0 | The most selective SSRI |
| Sertraline | +++ | 0 | 0 | 0 | 0 | Weak DAT block, sigma-1 |
| Paroxetine | +++ | + | 0 | + | 0 | Mild anticholinergic; strong CYP2D6 inhibitor |
| Fluoxetine | +++ | 0 | 0 | 0 | 0 | Weak 5-HT2C block (activation) |
| Venlafaxine | +++ | + to ++ (rises with dose) | 0 | 0 | 0 | Serotonin first, noradrenaline at higher doses |
| Duloxetine | +++ | ++ | 0 | 0 | 0 | More balanced at usual doses |
| Amitriptyline | ++ | ++ | +++ | +++ | +++ | Sodium channel block |
| Nortriptyline | + | +++ | ++ | ++ | ++ | Less anticholinergic than amitriptyline |
| Clomipramine | +++ | ++ | ++ | ++ | ++ | Most serotonergic tricyclic |
| Mirtazapine | 0 | 0 | +++ | 0 | 0 | Alpha-2, 5-HT2A, 5-HT2C, 5-HT3 block |
| Trazodone | + | 0 | ++ | 0 | ++ | Strong 5-HT2A block |
| Bupropion | 0 | + | 0 | 0 | 0 | Weak NET and DAT block |

:::widget sort
{"prompt": "Which receptor explains each side effect?", "buckets": ["H1 block", "M1 block", "Alpha-1 block", "SERT block or 5-HT stimulation"], "items": [{"text": "Weight gain and daytime sleepiness on mirtazapine", "bucket": 0}, {"text": "Constipation and urinary retention on amitriptyline", "bucket": 1}, {"text": "Dizziness on standing on trazodone", "bucket": 2}, {"text": "Delayed orgasm on sertraline", "bucket": 3}, {"text": "Blurred vision and dry mouth", "bucket": 1}, {"text": "Falls at night in an older adult on a tricyclic", "bucket": 2, "why": "Alpha-1 block drops blood pressure on standing; sedation (H1) and confusion (M1) add to it."}, {"text": "Early nausea", "bucket": 3, "why": "Extra serotonin at 5-HT3 receptors."}, {"text": "Confusion and memory slips in an 80-year-old", "bucket": 1}]}
:::

### The anticholinergic burden
Many common medicines block muscarinic receptors a little: tricyclics, paroxetine, older antihistamines (chlorpheniramine, promethazine), bladder medicines (oxybutynin), trihexyphenidyl, some antipsychotics (chlorpromazine, clozapine, olanzapine), antispasmodics and some cough syrups. **Anticholinergic burden scales** give each medicine a score; the total predicts delirium, falls, constipation, urinary retention and, with long use, cognitive decline in older adults.

:::widget decide
{"scene": "Mrs Banerjee, 81, in Kolkata, has become confused over the past few days. She takes amitriptyline 50 mg at night 'for sleep and nerves', oxybutynin for bladder urgency, trihexyphenidyl started by another doctor 'for hand tremor', and chlorpheniramine for a cold. She is constipated, has not passed urine since morning, her pulse is 110 and her pupils are wide.", "ask": "What do you do first?", "choices": [{"label": "Add haloperidol at night for the confusion", "verdict": "harm", "outcome": "She becomes stiffer and more drowsy, and falls trying to get to the toilet.", "why": "This is anticholinergic delirium. Adding a medicine treats the symptom while the cause continues."}, {"label": "Recognise anticholinergic toxicity from a stacked burden: check for urinary retention (catheter if needed), stop or reduce the anticholinergic medicines, treat constipation, review the indication for each, and find safer alternatives", "verdict": "best", "outcome": "After catheterisation and stopping chlorpheniramine, trihexyphenidyl and amitriptyline (tapered), her confusion clears over a few days. Her tremor turns out to be essential tremor, and her mood is later treated with sertraline.", "why": "Four anticholinergic drugs add up. The burden, not one drug, caused the delirium."}, {"label": "Start donepezil for dementia", "verdict": "harm", "outcome": "Her urinary retention continues and she remains delirious.", "why": "Acute confusion over days is delirium until proved otherwise; here the cause is reversible."}]}
:::

:::widget reveal
{"prompt": "Mirtazapine is more sedating at 15 mg than at 45 mg. Use its binding profile to explain this odd fact.", "answer": "Mirtazapine has very high affinity for H1, so even 7.5 to 15 mg nearly saturates histamine receptors: full sedation. Its alpha-2 block needs more drug. As the dose rises, more alpha-2 block releases more noradrenaline, which is alerting and partly offsets the H1 sedation. The H1 effect is already maximal, so only the alerting effect grows."}
:::

:::recall
1. Name the receptor behind each: sedation, dry mouth, dizziness on standing, priapism, early nausea. || H1; M1; alpha-1; alpha-1; 5-HT3 (stimulation).
2. Why does mirtazapine cause little nausea or sexual dysfunction? || It blocks 5-HT3, 5-HT2A and 5-HT2C rather than stimulating them.
3. What does 5-HT2C antagonism do in the prefrontal cortex? || Releases dopamine and noradrenaline (the 'disinhibition' effect), helping energy and mood.
4. Name five medicines that add to anticholinergic burden. || Amitriptyline, paroxetine, chlorpheniramine, oxybutynin, trihexyphenidyl (also chlorpromazine, clozapine, olanzapine).
:::

:::mcq
Q: Which antidepressant would most worsen an older man's urinary retention from an enlarged prostate?
- Sertraline
- Mirtazapine
- *Amitriptyline
- Bupropion
> Strong M1 block, plus noradrenergic effects on the bladder neck.

Q: Agomelatine's 5-HT2C antagonism is thought to help mood mainly by:
- Blocking serotonin reuptake
- *Disinhibiting dopamine and noradrenaline release in the prefrontal cortex
- Blocking histamine
- Activating GABA-A receptors
> 5-HT2C receptors normally brake dopamine and noradrenaline release.
:::

## 5.2 Pharmacodynamics and pharmacokinetics: two different questions [core][advanced]
- **Pharmacokinetics (PK)**: what the body does to the drug. Absorption, distribution, metabolism, excretion; half-life; blood levels; CYP interactions.
- **Pharmacodynamics (PD)**: what the drug does to the body. Binding, affinity, occupancy, agonist or antagonist action, downstream adaptation, therapeutic and toxic effects.

A patient's poor response can be a PK problem (the drug never reaches enough of the target) or a PD problem (the target is reached but blocking it does not help this person). The fixes differ.

:::widget figure
{"id": "pk-single-dose"}
:::

### Occupancy and the flat dose-response curve
Positron emission tomography (PET) studies show that the usual starting doses of SSRIs already occupy about **80% of SERT**. Occupancy follows a **hyperbolic** curve: each extra milligram adds less occupancy than the one before. So:
- For depression, the dose-response curve for SSRIs is fairly **flat** above the starting dose. Raising the dose helps some people, but adds side effects more than benefit on average.
- In **OCD**, higher doses help more, suggesting other mechanisms or targets.
- When **tapering**, the last few milligrams change occupancy the most, which is why final steps must be smallest.

:::widget curve
{"kind": "dose-response", "title": "Potency, efficacy and the plateau", "caption": "Move the sliders. Potency shifts the curve left or right (how many milligrams you need). Efficacy sets how high it can climb. For SSRIs in depression we start close to the top of the curve already, which is why doubling the dose often adds side effects more than benefit."}
:::

:::widget worked
{"title": "Why doubling the dose does not double the effect", "steps": [{"q": "A simple model: occupancy = dose divided by (dose plus D50), where D50 is the dose that gives 50% occupancy. Suppose D50 for an SSRI is 10 mg. What is the occupancy at 10 mg?", "a": "10 divided by (10 plus 10) = **50%**."}, {"q": "At 40 mg?", "a": "40 divided by 50 = **80%**. Four times the dose gave only 30 more percentage points."}, {"q": "At 80 mg?", "a": "80 divided by 90 = about **89%**. Doubling from 40 to 80 adds only 9 points."}, {"q": "Now taper from 10 mg to 5 mg, then 5 mg to 0. Which step drops occupancy more?", "a": "10 mg gives 50%; 5 mg gives 5 divided by 15, about 33%; 0 gives 0. The final step (33 to 0) is twice as big as the first (50 to 33). This is the arithmetic behind hyperbolic tapering."}], "yourTurn": [{"q": "With D50 of 10 mg, what dose gives 75% occupancy?", "a": "Occupancy 0.75 = dose divided by (dose plus 10), so dose = 30 mg."}]}
:::

### Two kinds of interaction
| | Pharmacokinetic interaction | Pharmacodynamic interaction |
|---|---|---|
| What happens | One drug changes the **level** of another | Two drugs **add or oppose** at the same target or effect |
| Examples | Fluoxetine or paroxetine (CYP2D6 inhibitors) raise tricyclic, metoprolol, atomoxetine and some antipsychotic levels; fluvoxamine (CYP1A2) raises clozapine, olanzapine, caffeine and theophylline, and agomelatine to dangerous levels; omeprazole (CYP2C19) raises citalopram; carbamazepine (inducer) lowers many antidepressants | SSRI plus tramadol or an MAOI: serotonin toxicity; citalopram plus methadone: additive QT; mirtazapine plus alcohol: sedation; SSRI plus NSAID: bleeding |
| How to manage | Choose a non-interacting drug, adjust the dose, measure levels | Avoid the combination, monitor the shared effect |

:::widget sort
{"prompt": "Pharmacokinetic or pharmacodynamic interaction?", "buckets": ["Pharmacokinetic (changes levels)", "Pharmacodynamic (adds effects)"], "items": [{"text": "Fluvoxamine raises clozapine levels", "bucket": 0}, {"text": "Escitalopram plus tramadol causes serotonin toxicity", "bucket": 1}, {"text": "Paroxetine reduces tamoxifen's activation to endoxifen", "bucket": 0}, {"text": "Citalopram plus ondansetron plus methadone lengthen the QT interval", "bucket": 1}, {"text": "Carbamazepine lowers sertraline levels", "bucket": 0, "why": "CYP3A4 induction."}, {"text": "Mirtazapine plus alcohol causes heavy sedation", "bucket": 1}, {"text": "Bupropion doubles vortioxetine exposure", "bucket": 0, "why": "CYP2D6 inhibition: halve the vortioxetine dose."}]}
:::

### Adaptation: the PD of time
Chronic SSRI exposure causes **receptor adaptation**: 5-HT1A autoreceptor desensitisation and postsynaptic receptor changes. This adaptation is why benefits take time, why side effects fade (tolerance to nausea), and why stopping causes discontinuation (the system has adjusted to the drug's presence).

:::recall
1. Define pharmacokinetics and pharmacodynamics in one line each. || What the body does to the drug; what the drug does to the body.
2. What SERT occupancy do usual starting SSRI doses achieve? || About 80%.
3. Why is the SSRI dose-response curve in depression fairly flat? || Occupancy is already near the plateau of a hyperbolic curve at starting doses.
4. Give one PK and one PD interaction involving SSRIs. || Fluvoxamine raising clozapine (PK); SSRI plus tramadol serotonin toxicity (PD).
:::

:::mcq
Q: A patient on escitalopram 10 mg has a partial response. Doubling to 20 mg will most likely:
- Double the SERT occupancy
- *Add a modest increase in occupancy, helping some patients but adding side effects
- Have no effect at all
- Halve the side effects
> The occupancy curve is hyperbolic.

Q: Which combination is contraindicated because of a pharmacokinetic interaction?
- Sertraline and mirtazapine
- *Fluvoxamine and agomelatine
- Escitalopram and bupropion
- Venlafaxine and mirtazapine
> Fluvoxamine (CYP1A2) raises agomelatine levels many-fold.
:::

## 5.3 Pharmacogenomics: CYP2D6 and CYP2C19 [core][advanced]
People inherit different versions of CYP genes. The version you carry decides how fast you clear medicines that use that enzyme. Four **metaboliser types** are described:
| Type | Enzyme activity | Effect on a drug cleared by that enzyme |
|---|---|---|
| Poor metaboliser (PM) | Little or none | High levels: more side effects at normal doses |
| Intermediate metaboliser (IM) | Reduced | Somewhat higher levels |
| Normal metaboliser (NM) | Usual | Standard dosing |
| Ultrarapid metaboliser (UM) | Increased (extra gene copies for CYP2D6; the *17 allele for CYP2C19) | Low levels: may not work at normal doses |

:::widget figure
{"id": "liver-cell-cyp", "quiz": true}
:::

### Who carries what
- **CYP2D6** poor metabolisers: about 3 to 5% of people of European origin; less common in South and East Asians, who more often carry reduced-function variants (intermediate). Ultrarapid metabolisers are more common in parts of North Africa and the Middle East.
- **CYP2C19** poor metabolisers: about 3 to 5% of Europeans but around 15 to 20% of East and South Asians, so this matters in Indian clinics.

### Which antidepressants depend on which enzyme
- **CYP2D6**: paroxetine, fluoxetine, vortioxetine, venlafaxine (to desvenlafaxine), tricyclics (hydroxylation), and many antipsychotics and beta-blockers.
- **CYP2C19**: citalopram, escitalopram, sertraline (partly), and the conversion of tertiary tricyclics (amitriptyline to nortriptyline, clomipramine).


:::widget journey
{
 "drug": "Escitalopram",
 "target": "the serotonin pump",
 "route": "oral",
 "notes": {
  "liver": "Cleared mainly by CYP2C19. A poor metaboliser clears it slowly, so a normal dose gives high blood levels and more side effects; an ultrarapid metaboliser clears it so fast that the usual dose may do too little.",
  "blood": "Blood levels for the same dose can differ several-fold between people, largely because of the liver step.",
  "target": "Blocks the serotonin pump. Occupancy, not the dose on the label, is what the brain responds to."
 },
 "caption": "Follow the tablet and stop at the liver. The gene result does not change what escitalopram does in the brain; it changes how much arrives there."
}
:::

:::clinician
### How guidelines use results (international pharmacogenetic consensus, outline)
| Result | Medicine | Suggested action |
|---|---|---|
| CYP2C19 poor metaboliser | Citalopram, escitalopram | Consider a lower starting dose (about half) and slower titration, or an alternative not mainly cleared by CYP2C19; respect QT limits |
| CYP2C19 ultrarapid metaboliser | Citalopram, escitalopram | Consider an alternative (may be under-exposed) |
| CYP2C19 poor metaboliser | Sertraline | Lower starting dose and slower titration |
| CYP2D6 poor metaboliser | Paroxetine | Lower starting dose (about half) |
| CYP2D6 poor metaboliser | Vortioxetine | Start low; maximum about half the usual |
| CYP2D6 ultrarapid metaboliser | Paroxetine, vortioxetine | Consider an alternative |
| CYP2D6 ultrarapid or poor | Tricyclics | Avoid or, if needed, adjust dose and use plasma levels (nortriptyline) |
:::

### Phenoconversion: when the medicine changes the gene's effect
A genetically normal CYP2D6 metaboliser taking fluoxetine, paroxetine or bupropion **behaves like a poor metaboliser** while on it. Always read a genetic result alongside the current medicine list.

### What the evidence shows
Randomised trials of genotype-guided prescribing show a **modest** increase in response and remission, mainly by avoiding drug-gene mismatches. Testing is not yet routine in most guidelines, but can help after several failed trials or intolerable side effects at low doses. Commercial panels are available in India; their reports vary in quality, and they do not predict which antidepressant will work, only how it will be cleared.

:::widget decide
{"scene": "Dr Mehta refers Kavita, 34, from Ahmedabad, who has tried escitalopram twice and stopped both times within days because of severe nausea, dizziness and palpitations at 10 mg. A pharmacogenomic report shows CYP2C19 *2/*2 (poor metaboliser) and CYP2D6 *1/*1 (normal metaboliser). She is not on other medicines.", "ask": "Which plan makes most use of the result?", "choices": [{"label": "Escitalopram 20 mg, because she 'needs a bigger dose to get through it'", "verdict": "harm", "outcome": "Her levels are very high; her QTc lengthens and she is admitted with palpitations.", "why": "As a CYP2C19 poor metaboliser, she already had high levels at 10 mg."}, {"label": "Choose an antidepressant that does not rely on CYP2C19, for example vortioxetine or a carefully started SNRI or mirtazapine, or use a much lower citalopram-type dose only if needed, and monitor", "verdict": "best", "outcome": "She tolerates vortioxetine 10 mg and improves over the following weeks.", "why": "Her intolerance has a kinetic explanation. A drug cleared mainly by a normal enzyme (CYP2D6) avoids the problem."}, {"label": "Tell her she has 'antidepressant intolerance' and stop all medicines", "verdict": "harm", "outcome": "Her depression worsens.", "why": "The test explains the problem and points to a solution."}]}
:::

:::widget sort
{"prompt": "Which enzyme matters most for each medicine?", "buckets": ["CYP2D6", "CYP2C19", "CYP1A2"], "items": [{"text": "Escitalopram", "bucket": 1}, {"text": "Paroxetine", "bucket": 0}, {"text": "Vortioxetine", "bucket": 0}, {"text": "Citalopram", "bucket": 1}, {"text": "Agomelatine", "bucket": 2, "why": "Which is why fluvoxamine and ciprofloxacin are dangerous with it."}, {"text": "Duloxetine", "bucket": 2, "why": "Duloxetine is cleared by CYP1A2 and CYP2D6; strong 1A2 inhibitors are avoided."}, {"text": "Nortriptyline", "bucket": 0}]}
:::

:::recall
1. Name the four metaboliser types. || Poor, intermediate, normal, ultrarapid.
2. Which enzyme clears escitalopram, and which population has more poor metabolisers? || CYP2C19; East and South Asians.
3. What is phenoconversion? || A drug (such as fluoxetine or paroxetine) making a normal metaboliser behave like a poor one.
4. What does pharmacogenomic testing NOT tell you? || Which antidepressant will work; it tells you how the drug will be cleared.
:::

:::mcq
Q: A CYP2D6 normal metaboliser takes paroxetine 40 mg and is started on nortriptyline. She becomes drowsy with a dry mouth and a fast pulse. The best explanation is:
- She is really an ultrarapid metaboliser
- *Paroxetine inhibits CYP2D6, so she now behaves like a poor metaboliser and nortriptyline levels are high
- Nortriptyline does not use CYP2D6
- Paroxetine lowers nortriptyline levels
> Phenoconversion by a strong CYP2D6 inhibitor.
:::

## 5.4 New and fast-acting mechanisms: glutamate and neurosteroids [core][advanced]
Classic antidepressants all work through monoamines. Since 2019, medicines that act on **glutamate** and on **GABA-A receptors via neurosteroids** have reached the clinic.

### Ketamine and esketamine: the glutamate surge
- Ketamine blocks **NMDA receptors**, preferentially on inhibitory interneurons. The brake on pyramidal neurons is released, producing a burst of **glutamate**, which stimulates **AMPA** receptors, triggers **BDNF** release and the **mTOR** pathway, and leads to rapid growth of new synaptic connections.
- **Esketamine** is the S-enantiomer of ketamine, given as a **nasal spray** in a clinic.

:::widget flow
{"title": "Ketamine: from a blocked channel to new synapses", "layout": "chain", "nodes": [{"id": "k1", "label": "NMDA block on interneurons", "detail": "Ketamine plugs the NMDA channel. Tonically firing GABA interneurons are hit hardest, so their brake on pyramidal neurons weakens."}, {"id": "k2", "label": "Glutamate surge", "detail": "Released from the brake, pyramidal neurons fire a burst of glutamate in the prefrontal cortex."}, {"id": "k3", "label": "AMPA receptors switch on", "detail": "The glutamate acts on AMPA receptors (the NMDA ones are blocked). Blocking AMPA in animals removes the antidepressant effect."}, {"id": "k4", "label": "BDNF release and mTOR signalling", "detail": "Calcium entry releases BDNF, which activates the mTOR pathway and protein synthesis at synapses."}, {"id": "k5", "label": "New spines within hours", "detail": "Dendritic spines lost under chronic stress regrow in the prefrontal cortex within about a day in animal studies."}, {"id": "k6", "label": "Rapid relief that fades", "detail": "Mood and suicidal thinking can ease within hours, but the new connections are fragile; without repeated dosing or other treatment, benefit usually fades within days."}], "caption": "Press Play. Compare this with the slow SSRI chain earlier: here the growth step comes first and fast."}
:::

:::widget journey
{"drug": "esketamine or ketamine", "target": "NMDA receptors on GABA interneurons in the prefrontal cortex", "routes": ["nasal", "iv"], "notes": {"nose": "Each device sprays a small dose into both nostrils; the patient waits a few minutes between devices. The medicine soaks into the blood-rich lining of the nose, so the gut and much of the liver's first pass are skipped. Swallowed ketamine, by contrast, is largely destroyed by the liver.", "vein": "Racemic ketamine for depression is given as a slow drip into a vein over about 40 minutes, in a monitored setting. All of it reaches the blood.", "blood": "Levels rise within minutes. Dissociation and a rise in blood pressure peak soon after, which is why patients stay for observation.", "out": "The liver turns it into norketamine and other products, cleared over hours. The effect on mood outlasts the drug, because the synapses it helps grow remain for a while."}, "caption": "Switch between Nasal spray and Into a vein. Both skip the gut, which is the point: oral ketamine loses most of the dose on its first pass through the liver."}
:::
- Regulatory history (US FDA): approved 5 March 2019 for treatment-resistant depression together with an oral antidepressant; extended in 2020 to depression with acute suicidal ideation or behaviour; approved on 21 January 2025 as a stand-alone treatment for treatment-resistant depression. Approval and availability differ by country; check local status.
- Typical regimen: 56 mg or 84 mg per session, given more often at first, then less often for maintenance. Each dose is supervised.
- Side effects: **dissociation** (feeling unreal or detached), dizziness, sedation, nausea, **raised blood pressure**, and a potential for **misuse**. Not for people with uncontrolled hypertension, aneurysm or recent bleeding in the brain.

:::widget guess
{"prompt": "After each esketamine dose, the patient must be observed in the clinic before going home. For at least how many hours?", "min": 0, "max": 8, "unit": "hours", "answer": [2, 2], "reveal": "At least 2 hours, until sedation and dissociation have settled. The patient must not drive until the next day after a restful sleep. Blood pressure is checked before the dose and again about 40 minutes after, when the rise peaks.", "clinician": "Induction: twice weekly for weeks 1 to 4 (start 56 mg, then 56 or 84 mg); maintenance: weekly for weeks 5 to 8, then weekly or every 2 weeks. Observe for at least 2 hours; check BP before and about 40 minutes after dosing; withhold if BP above 140/90 before dosing. No driving until the next day."}
:::

:::widget guess
{"prompt": "When an IV ketamine infusion helps depression, how soon does the improvement usually appear?", "min": 0, "max": 72, "unit": "hours", "answer": [2, 24], "reveal": "Within hours, often by the next day. The catch is that a single dose usually wears off within days to about a week, so repeated dosing or a bridge to other treatment is needed.", "clinician": "Off-label IV racemic ketamine (commonly 0.5 mg/kg over 40 minutes) shows response from about 4 to 24 hours, with relapse typically within 1 to 2 weeks after a single infusion."}
:::


:::widget timeline
{"prompt": "Put these moments in antidepressant history in order.", "events": [{"label": "Iproniazid, a tuberculosis drug, is noticed to lift mood: the first MAOI", "when": "1950s"}, {"label": "Imipramine, the first tricyclic, is found to treat depression", "when": "late 1950s"}, {"label": "Fluoxetine, the first widely used SSRI, is approved in the US", "when": "1987"}, {"label": "Esketamine nasal spray is approved in the US for treatment-resistant depression", "when": "2019"}, {"label": "Zuranolone becomes the first oral medicine approved for postpartum depression in the US", "when": "2023"}, {"label": "Lumateperone is approved in the US as an add-on in major depression", "when": "2025"}], "why": "Each step widened the targets: from enzymes, to pumps, to glutamate and GABA-A receptors. Several early discoveries were accidents noticed by careful clinicians."}
:::

:::widget figure
{"id": "nmda-receptor"}
:::
### Dextromethorphan with bupropion: kinetics used on purpose
Dextromethorphan (the cough suppressant) is an NMDA antagonist and sigma-1 agonist, but it is cleared so fast by CYP2D6 that it barely acts. Combining it with **bupropion**, a strong CYP2D6 inhibitor, keeps its levels high. This combination was approved in the US on 18 August 2022 for major depressive disorder. It is a neat example of a pharmacokinetic interaction turned into a treatment. It carries bupropion's seizure risk and dextromethorphan's serotonergic risk. In April 2026 the same combination was also approved in the US for agitation in Alzheimer's dementia.

### Antipsychotics as add-on treatments
Several second-generation antipsychotics are approved in the US as add-ons to an antidepressant: aripiprazole, quetiapine extended release, brexpiprazole and, from November 2025, lumateperone. Their benefit is real but modest, and they bring akathisia, weight and metabolic risks, so they are chosen after weighing those costs.


:::widget receptor
{
 "receptor": "dopamine D2",
 "title": "Aripiprazole as an add-on: a partial agonist",
 "caption": "Compare Full agonist (dopamine itself), Antagonist and Partial agonist. Aripiprazole sits in the middle: where dopamine is low it nudges the signal up, where it is high it holds it down. At the low doses used as an add-on in depression, that partial action, together with its serotonin effects, is thought to explain the modest extra benefit; restlessness (akathisia) is the common cost."
}
:::

### Neurosteroids: brexanolone and zuranolone
- **Allopregnanolone** is a natural metabolite of progesterone. It is a **positive allosteric modulator of GABA-A receptors**, including the extrasynaptic receptors that give a steady, tonic calming current. Levels fall sharply after childbirth, one proposed contributor to postpartum depression.
- **Brexanolone** is intravenous allopregnanolone, approved in the US in March 2019 for postpartum depression. It is given as a continuous infusion in hospital because it can cause excessive sedation and sudden loss of consciousness.
- **Zuranolone** is an oral neuroactive steroid with the same action. The US FDA approved it on 4 August 2023 for **postpartum depression**, as the first oral medicine for that condition. It was **not** approved for major depressive disorder in general.
- Zuranolone is taken once daily in the evening with fat-containing food, as a short fixed course. It carries a boxed warning about impaired driving. Effective contraception is advised during treatment.

:::widget journey
{"drug": "zuranolone and brexanolone", "target": "GABA-A receptors, including the extrasynaptic ones that set the brain's steady background calm", "routes": ["oral", "iv"], "notes": {"mouth": "Zuranolone capsules are taken in the evening with a meal that contains some fat.", "gut": "Fat in the meal clearly increases how much is absorbed, which is why the label insists on food.", "liver": "CYP3A4 does most of the work. Strong CYP3A4 blockers raise the level, so the dose is lowered; strong inducers such as rifampicin or carbamazepine drop it too far to work.", "vein": "Brexanolone is the same natural neurosteroid given as a continuous drip in hospital, because by mouth it would be destroyed quickly.", "blood": "Both are fat-soluble and largely protein-bound. Brexanolone is given with continuous oxygen monitoring because of the risk of sudden heavy sedation.", "out": "Zuranolone's half-life is long enough for once-a-day dosing, but sedation the next morning is common, so driving is not allowed for at least 12 hours after a dose."}, "caption": "Switch between Tablet and Into a vein. Same target, two very different journeys: a two-week home course versus a long hospital drip."}
:::

:::widget guess
{"prompt": "How long is a single course of zuranolone for postpartum depression?", "min": 1, "max": 60, "unit": "days", "answer": [14, 14], "reveal": "14 days, taken once each evening. Improvement can appear within days, which is very different from classic antidepressants. Patients must not drive for at least 12 hours after each dose.", "clinician": "50 mg once daily in the evening with fat-containing food for 14 days; reduce to 40 mg if CNS depressant effects occur; 30 mg with strong CYP3A4 inhibitors; avoid CYP3A4 inducers. Boxed warning: no driving or hazardous activity for at least 12 hours after each dose. Brexanolone, by contrast, is a 60-hour continuous IV infusion with continuous pulse oximetry."}
:::

:::widget decide
{"scene": "Priya, 31, in Bengaluru, delivered her first baby last month. She has severe depression, cannot sleep even when the baby sleeps, and feels she is 'a terrible mother'. She has no thoughts of harming the baby or herself. She read online about 'the new two-week pill' and asks for it. She is breastfeeding and lives alone with the baby while her husband travels for work.", "ask": "What is your approach?", "choices": [{"label": "Prescribe zuranolone and send her home", "verdict": "harm", "outcome": "She is drowsy all evening and alone with the baby; she nearly falls on the stairs carrying him.", "why": "Zuranolone may not be approved or available locally, data in breastfeeding are limited, and its sedation needs a safe home plan; she lives alone with a newborn."}, {"label": "Assess fully (risk to her and the baby, bipolarity, thyroid, support), explain the evidence and the local status of new options, and plan established treatment (for example sertraline, which is compatible with breastfeeding, plus psychological support), arranging help at home", "verdict": "best", "outcome": "Her mother comes to stay. Sertraline and weekly counselling help over the following weeks, and she keeps breastfeeding.", "why": "New medicines are exciting, but the plan must fit the person: safety, breastfeeding, availability and support all count."}, {"label": "Tell her it is just baby blues and will pass", "verdict": "harm", "outcome": "Her depression deepens over the next month.", "why": "Severe symptoms beyond the first days after birth are not baby blues."}]}
:::

:::recall
1. Explain the ketamine mechanism in four steps. || NMDA block on interneurons, glutamate surge, AMPA stimulation with BDNF and mTOR signalling, rapid synapse growth.
2. Name three side effects of esketamine that require clinic observation. || Dissociation, sedation, raised blood pressure (also dizziness, nausea).
3. Why is bupropion combined with dextromethorphan? || Bupropion inhibits CYP2D6, keeping dextromethorphan levels high enough to act.
4. What receptor do brexanolone and zuranolone act on, and how? || GABA-A, as positive allosteric modulators (including extrasynaptic receptors).
5. For what condition is zuranolone approved in the US, and what was it not approved for? || Postpartum depression; not major depressive disorder in general.
:::

:::mcq
Q: Which statement about esketamine is TRUE?
- It is an SSRI given by nose
- *It blocks NMDA receptors and must be given under observation because of dissociation and blood pressure rises
- It is taken daily at home
- It has no misuse potential
> It is supervised in a clinic.

Q: Zuranolone differs from SSRIs because it:
- Blocks the serotonin pump more strongly
- *Enhances GABA-A receptor function as a neurosteroid, given as a short course
- Is an MAOI
- Must be injected
> A neuroactive steroid GABA-A positive modulator.
:::

## 5.5 Treatment-resistant depression: the pathway [core][advanced]
:::define Treatment-resistant depression (working definition)
Depression that has not responded to **at least two adequate trials** of antidepressants (right dose, long enough, actually taken) in the current episode. Many services also stage resistance by how many treatments have failed, including augmentation and ECT.
:::

:::widget flow
{"title": "The treatment-resistant depression pathway", "layout": "tree", "nodes": [{"id": "t0", "label": "Not better after a fair trial", "detail": "Use a rating scale to be sure. Partial response and no response lead to different next steps."}, {"id": "t1", "label": "Check for pseudo-resistance", "parent": "t0", "detail": "Wrong diagnosis (bipolar, psychotic, medical), missed doses, too low a dose or too short a time, alcohol or other substances, interacting drugs, ongoing abuse or stress."}, {"id": "t2", "label": "Partial response", "parent": "t0", "detail": "Something is working. Raise the dose if possible, then augment or combine rather than throw it away."}, {"id": "t2a", "label": "Augment", "parent": "t2", "detail": "Aripiprazole, quetiapine, brexpiprazole or lithium; in the US, lumateperone was added to this list in November 2025."}, {"id": "t2b", "label": "Combine", "parent": "t2", "detail": "Add mirtazapine to an SSRI or SNRI; or bupropion to an SSRI."}, {"id": "t3", "label": "No response at all", "parent": "t0", "detail": "Switch, often to a different class."}, {"id": "t4", "label": "Two or more failures, or severe and urgent", "parent": "t0", "detail": "Treatment-resistant depression. Consider ECT, esketamine, rTMS, a specialist review, and lithium if not yet tried. Psychological therapy runs alongside at every step."}], "caption": "Tap each branch. The tree shows the order of thinking, not a fixed timetable: severity and risk can move a person straight to the last branch."}
:::

### The large studies, honestly
The large US STAR*D study gave people up to four treatment steps. It was long quoted as showing about two-thirds eventually remitting. Later re-analyses using the study's original outcome measures suggest the true cumulative remission was considerably lower, and relapse after each later step was higher. The lesson: each further step helps fewer people, so the **early** steps must be done well.

:::widget worked
{"title": "Building a treatment-resistant depression plan", "steps": [{"q": "Step 1. Before calling it resistant, what four things do you check?", "a": "**Diagnosis** (bipolar? psychotic? medical cause?), **adherence**, **dose and duration** of each trial, and **substances or interacting drugs** (alcohol, inducers)."}, {"q": "Step 2. The first trial failed despite all that. What are the options?", "a": "**Switch** (another SSRI, or a different class such as an SNRI, mirtazapine, bupropion or vortioxetine) or, after a partial response, **augment** or **combine**."}, {"q": "Step 3. Which augmenting medicines have the best evidence?", "a": "**Lithium** and second-generation antipsychotics: **aripiprazole**, **quetiapine** (extended release), **brexpiprazole**; also combining an SSRI or SNRI with **mirtazapine**. Thyroid hormone (liothyronine) has some support."}, {"q": "Step 4. What do you add at every step, not just at the end?", "a": "A **psychological therapy** (CBT, behavioural activation, interpersonal therapy), work on sleep, activity and social stressors."}, {"q": "Step 5. When severe, psychotic, life-threatening (not eating or drinking, high suicide risk) or after several failures?", "a": "**ECT**, which has the highest response rates. **Esketamine**, **rTMS** and ketamine are options where available. For chronic, highly resistant cases, specialist services consider further options."}], "yourTurn": [{"q": "A 50-year-old man has failed two SSRIs at full dose; he takes them, has no alcohol use, and his bloods are normal. He has partial response to sertraline 200 mg. Outline your next two options.", "a": "Augment sertraline with lithium (with levels and monitoring) or aripiprazole at a low dose; or combine with mirtazapine. Add CBT or behavioural activation. If severe or worsening, discuss ECT or esketamine."}]}
:::

:::student
### Augmenting doses (for learning; check current guidelines)
| Medicine | Typical augmenting dose |
|---|---|
| Aripiprazole | 2 to 10 mg |
| Quetiapine (extended release) | 150 to 300 mg at night |
| Lithium | Dose adjusted to a blood level |
| Mirtazapine (combined) | 15 to 45 mg at night |
:::

:::clinician
### Augmentation and combination (for learning; check current guidelines)
| Strategy | Dose | Indian brands | Monitoring and cautions |
|---|---|---|---|
| Lithium augmentation | Start 200 to 400 mg at night; adjust to a plasma level at the lower end of the bipolar range | Licab, Lithosun SR, Intalith CR | Renal, thyroid, calcium baseline; levels after each change; interactions with NSAIDs, ACE inhibitors, thiazides; serotonin toxicity rare |
| Aripiprazole | Start 2 to 5 mg; usual 5 to 10 mg; up to 15 mg | Arip MT, Aripra | Akathisia (the commonest reason to stop); halve with strong CYP2D6 inhibitors (fluoxetine, paroxetine, bupropion) |
| Quetiapine XR | 50 mg, then 150 to 300 mg at night | Qutipin, Seroquin | Sedation, weight, glucose and lipids, dizziness on standing |
| Brexpiprazole | 0.5 to 1 mg, up to 2 to 3 mg | | Akathisia less than aripiprazole; weight |
| Mirtazapine plus SNRI ("California rocket fuel") | Mirtazapine 15 to 45 mg added to venlafaxine or duloxetine | | Sedation, weight; monitor serotonin toxicity and blood pressure |
| Liothyronine (T3) | 25 to 50 micrograms | | Cardiac history; thyroid function |
| ECT | Twice to three times weekly course | | Modified ECT (anaesthesia and muscle relaxant) is required under India's Mental Healthcare Act 2017; consent; cognitive side effects |
:::

:::widget guess
{"prompt": "For lithium augmentation of an antidepressant, what plasma level is usually aimed for (mmol/L)?", "min": 0, "max": 1.5, "step": 0.1, "unit": "mmol/L", "answer": [0.4, 0.8], "reveal": "Usually 0.4 to 0.8 mmol/L, lower than the level used in bipolar disorder. Levels are drawn 12 hours after the last dose and checked after each change.", "clinician": "Aim for 0.4 to 0.8 mmol/L (some responders need up to 1.0); judge response after about 4 weeks at a therapeutic level. Check levels 5 to 7 days after each dose change, 12 hours post-dose."}
:::

:::widget decide
{"scene": "Mr Rao, 68, in Visakhapatnam, has severe depression with psychotic features. He believes he has committed a terrible sin and must die. He has stopped eating and drinking for three days, is dehydrated, and refuses medicines. Two previous antidepressant trials in this episode failed.", "ask": "What is the most appropriate treatment now?", "choices": [{"label": "Start a third antidepressant and review after a month", "verdict": "harm", "outcome": "He develops kidney injury from dehydration within days.", "why": "Not eating or drinking with psychotic depression is life-threatening; medicines act too slowly."}, {"label": "Urgent modified ECT, with medical care for dehydration and the legal and consent safeguards required", "verdict": "best", "outcome": "After a course of ECT he begins eating, his delusions fade, and he is later maintained on an antidepressant with an antipsychotic.", "why": "ECT is the treatment of choice for psychotic depression with refusal of food and fluids: it is fast and highly effective, especially in older adults."}, {"label": "Esketamine nasal spray at home", "verdict": "harm", "outcome": "Esketamine is not suitable in active psychosis, and his dehydration continues.", "why": "Esketamine is not used in psychotic depression and is never given at home."}]}
:::

:::recall
1. Define treatment-resistant depression. || Failure of at least two adequate antidepressant trials in the current episode.
2. Name four augmenting or combining options with good evidence. || Lithium, aripiprazole, quetiapine, mirtazapine combination (also brexpiprazole, T3).
3. What is the commonest side effect that limits aripiprazole augmentation? || Akathisia.
4. When is ECT the first choice? || Severe or psychotic depression, refusal of food or fluids, high suicide risk, catatonia, or after several failures.
5. What does India's Mental Healthcare Act 2017 require for ECT? || Modified ECT, with anaesthesia and a muscle relaxant.
:::

:::mcq
Q: The main lesson of re-analyses of the STAR*D study is:
- Antidepressants never work
- *Each later treatment step helps fewer people, so early steps must be done well
- Everyone eventually remits
- Augmentation is always better than switching
> Cumulative remission was lower than first reported.
:::

## 5.6 ICD-11 and guidelines say [core][advanced]
Diagnostic systems do not tell you which medicine to prescribe, but they shape decisions. Guidelines translate evidence into steps. Here are the notes that matter for antidepressant use.

:::note ICD-11 says
- ICD-11 codes depressive episodes as mild, moderate or severe, and adds "with or without psychotic symptoms" to moderate and severe episodes. Severity drives the choice between psychological treatment first and medicine plus therapy.
- ICD-11 includes **mixed depressive and anxiety disorder**, which DSM-5-TR does not; antidepressants that treat both (SSRIs, SNRIs) are often chosen.
- ICD-11 places **prolonged grief disorder** separately; antidepressants do not treat grief itself.
- **Bodily distress disorder** in ICD-11 replaces much of the old somatoform group; low-dose tricyclics or SNRIs are sometimes used for pain within a wider plan.
- "Treatment-resistant depression" is not an ICD-11 diagnosis. It is a clinical description.
:::

:::note Guidelines say
- **NICE (UK, 2022)** separates **less severe** from **more severe** depression. For less severe depression it offers a menu of options and does not suggest an antidepressant routinely first unless the person prefers it. For more severe depression it suggests combining an individual psychological therapy with an antidepressant.
- **CANMAT (Canada, 2023 update)** lists SSRIs, SNRIs, bupropion, mirtazapine, vortioxetine and agomelatine as first-line choices, and stresses measurement-based care (using rating scales at every visit).
- **Indian Psychiatric Society clinical practice guidelines** emphasise SSRIs as first-line, attention to cost and availability, the role of family, and ECT for severe and psychotic depression.
- All guidelines agree on: screen for bipolarity before starting; review early; treat to remission, not just response; continue after recovery; taper slowly.
:::

:::widget guess
{"prompt": "After a first episode has fully remitted, how many months should the antidepressant usually continue at the same dose?", "min": 0, "max": 36, "unit": "months", "answer": [6, 12], "reveal": "At least 6 months, often up to a year, at the dose that worked. People with recurrent episodes or high relapse risk often continue for 2 years or more.", "clinician": "Continue for at least 6 to 9 months after remission (NICE and CANMAT); at least 2 years for those at high risk of recurrence (two or more episodes, residual symptoms, severe or psychotic episodes). Maintenance at full dose."}
:::

:::widget sort
{"prompt": "Which source says it? Place each statement.", "buckets": ["ICD-11", "Treatment guideline"], "items": [{"text": "Mixed depressive and anxiety disorder is a diagnosis", "bucket": 0}, {"text": "Use rating scales at every visit (measurement-based care)", "bucket": 1}, {"text": "Depressive episodes are graded mild, moderate or severe, with or without psychotic symptoms", "bucket": 0}, {"text": "For less severe depression, an antidepressant is not routinely first-line unless preferred", "bucket": 1}, {"text": "Prolonged grief disorder is a separate diagnosis", "bucket": 0}, {"text": "Treat to remission, then continue", "bucket": 1}]}
:::

:::recall
1. Which mixed diagnosis exists in ICD-11 but not DSM-5-TR? || Mixed depressive and anxiety disorder.
2. How does NICE (2022) divide depression for treatment? || Less severe and more severe.
3. What does measurement-based care mean? || Using rating scales at every visit to guide changes.
4. Name four points that all guidelines agree on. || Screen for bipolarity; review early; treat to remission; continue after recovery; taper slowly.
:::

:::mcq
Q: Under NICE (2022), a man with less severe depression who prefers not to take medicine should be:
- Told an SSRI is essential
- *Offered a choice of psychological and other options first
- Given a tricyclic
- Referred for ECT
> Preference and severity guide the first step.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Classify antidepressants. Discuss SSRIs in detail. (15 marks)
1. Classification table: class, mechanism, examples (with Indian brands if asked).
2. SSRIs: mechanism (SERT block; delayed adaptation via 5-HT1A autoreceptor desensitisation and plasticity); the occupancy argument.
3. Pharmacokinetic differences: fluoxetine's half-life; CYP2D6 inhibition (fluoxetine, paroxetine); CYP1A2 (fluvoxamine); CYP2C19 (citalopram, escitalopram).
4. Indications: depression, anxiety disorders, OCD (higher doses, longer trials), PTSD, bulimia, PMDD.
5. Side effects with receptor explanations: 5-HT3 nausea, 5-HT2 activation and sexual dysfunction, platelet SERT bleeding, SIADH, QT, early suicidality in the young, switch to mania.
6. Serious reactions: serotonin syndrome (versus NMS); discontinuation (FINISH).
7. Special groups: children, older adults, pregnancy and breastfeeding, heart disease, tamoxifen.
8. Practical use: start, review, dose increase, duration, switching, tapering.
:::

:::example Q. Discuss the management of treatment-resistant depression. (15 marks)
1. Definition and staging; why "pseudo-resistance" must be excluded first.
2. Optimise: diagnosis, adherence, dose, duration, substances, medical illness, interactions.
3. Switch: within class, across class; how to switch safely (MAOI washout).
4. Augment: lithium (levels), aripiprazole, quetiapine, brexpiprazole, T3; combine with mirtazapine.
5. Psychological therapy at every step.
6. Physical treatments: ECT (indications, Mental Healthcare Act 2017 requirement for modified ECT), rTMS.
7. Newer options: esketamine, ketamine; their mechanism and limits.
8. Evidence: STAR*D and its re-analysis; measurement-based care.
:::

:::word Short note: tricyclic overdose
Tricyclics are highly toxic in overdose because they block cardiac sodium channels as well as muscarinic, histamine and alpha-1 receptors. Features include anticholinergic signs (dry flushed skin, dilated pupils, urinary retention, ileus), sedation progressing to coma, seizures, hypotension and arrhythmias, with QRS widening predicting seizures and arrhythmia. Management: airway and breathing, cardiac monitoring, activated charcoal if early and the airway is safe, intravenous sodium bicarbonate for QRS widening or arrhythmia, benzodiazepines for seizures, and avoiding flumazenil. Prevention: small prescriptions and safer antidepressants for patients at risk.
:::

:::word Short note: receptor basis of antidepressant side effects
Side effects follow binding. SERT block and extra serotonin cause early nausea (5-HT3), activation and sexual dysfunction (5-HT2), bleeding (platelet SERT) and SIADH. NET block causes sweating, tachycardia and raised blood pressure. H1 block causes sedation and weight gain; M1 block causes dry mouth, constipation, urinary retention, blurred vision and confusion; alpha-1 block causes orthostatic hypotension and priapism; cardiac sodium-channel block makes tricyclics lethal in overdose. Blocking 5-HT2A, 5-HT2C and 5-HT3 (mirtazapine) reduces nausea and sexual dysfunction, while 5-HT2C antagonism (agomelatine) releases prefrontal dopamine and noradrenaline.
:::

## 4.2 Viva rapid-fire [core]
:::viva
How do SSRIs work? :: Block the serotonin reuptake pump (SERT).
Why is the antidepressant effect delayed? :: 5-HT1A autoreceptor desensitisation and neuroplastic change take time.
SSRI with the longest half-life? :: Fluoxetine (with norfluoxetine).
SSRI with the worst discontinuation? :: Paroxetine.
SSRI preferred in heart disease? :: Sertraline.
SSRI that strongly inhibits CYP1A2? :: Fluvoxamine.
SSRIs with dose-related QT prolongation? :: Citalopram and escitalopram.
Receptor behind SSRI nausea? :: 5-HT3.
Receptor behind mirtazapine's sedation and weight gain? :: H1.
Receptor behind dizziness on standing with trazodone? :: Alpha-1.
Receptor behind dry mouth and constipation with amitriptyline? :: Muscarinic M1.
Antidepressant that raises blood pressure at higher doses? :: Venlafaxine.
Antidepressant for depression with neuropathic pain? :: Duloxetine.
Main risk of bupropion? :: Seizures.
Antidepressant used to stop smoking? :: Bupropion.
Antidote for wide QRS in tricyclic overdose? :: Sodium bicarbonate.
Food reaction with MAOIs? :: Tyramine hypertensive crisis.
Rare emergency with trazodone? :: Priapism.
Test to monitor with agomelatine? :: Liver function.
Key sign of serotonin syndrome? :: Clonus and hyperreflexia.
Antidote used in serotonin syndrome? :: Cyproheptadine.
Expand FINISH. :: Flu-like, insomnia, nausea, imbalance, sensory, hyperarousal.
Antidepressants to avoid with tamoxifen? :: Fluoxetine, paroxetine, bupropion.
What SERT occupancy do starting SSRI doses give? :: About 80%.
Enzyme that clears escitalopram? :: CYP2C19.
What is phenoconversion? :: A drug making a normal metaboliser behave like a poor metaboliser.
Definition of treatment-resistant depression? :: Two failed adequate trials in the current episode.
Augmenting agents with strong evidence? :: Lithium and aripiprazole (also quetiapine).
Mechanism of esketamine? :: NMDA receptor antagonist (glutamate surge, AMPA, BDNF).
Mechanism of zuranolone? :: Neurosteroid positive modulator of GABA-A receptors.
Zuranolone's approved use in the US? :: Postpartum depression.
Why add bupropion to dextromethorphan? :: CYP2D6 inhibition keeps dextromethorphan levels up.
Mental Healthcare Act 2017 rule for ECT? :: Only modified ECT (anaesthesia and muscle relaxant).
:::

`;

const p3 = String.raw`
## 4.3 Module test [core]
:::mcq
Q: A patient asks why his mood hasn't improved after 4 days on sertraline. The best answer is:
- The dose is wrong
- *The pump is blocked quickly, but the brain's adaptation that lifts mood takes longer
- Sertraline only works with therapy
- He is resistant
> Early side effects, later benefit.

Q: Which antidepressant is an alpha-2 antagonist?
- Venlafaxine
- *Mirtazapine
- Bupropion
- Agomelatine
> It takes the brake off noradrenaline and serotonin release.

Q: A prescription reads "Tab Daxid 50 mg". The medicine is:
- Escitalopram
- *Sertraline
- Duloxetine
- Paroxetine
> Daxid is a common Indian sertraline brand.

Q: Which antidepressant is a melatonin agonist and 5-HT2C antagonist?
- Vortioxetine
- Trazodone
- *Agomelatine
- Mirtazapine
> Agomelatine.

Q: A 70-year-old on a diuretic becomes confused after starting escitalopram. Check first:
- Calcium
- *Sodium
- Lithium
- Glucose only
> SIADH.

Q: Which is most dangerous in overdose?
- Sertraline
- Mirtazapine
- *Amitriptyline
- Escitalopram
> Sodium-channel block.

Q: A patient on phenelzine is prescribed a decongestant cough syrup with dextromethorphan. The risk is:
- None
- *Hypertensive crisis and serotonin toxicity
- Low sodium only
- Hypoglycaemia
> Both are dangerous with MAOIs.

Q: Which receptor explains orthostatic hypotension on tricyclics?
- H1
- M1
- *Alpha-1
- 5-HT3
> Alpha-1 block.

Q: Which is NOT a feature of serotonin syndrome?
- Clonus
- Sweating
- *Lead-pipe rigidity with very slow onset over days
- Agitation
> That describes NMS.

Q: Which drug most commonly causes serotonin syndrome when given for pain to someone on an SSRI?
- Paracetamol
- *Tramadol
- Diclofenac
- Gabapentin
> Tramadol is serotonergic.

Q: Which antidepressant is first choice in adolescents?
- Paroxetine
- Venlafaxine
- *Fluoxetine
- Amitriptyline
> Best benefit-risk evidence.

Q: A man on fluoxetine is to start an irreversible MAOI. The washout must be:
- 1 day
- Short, a few days
- *Much longer than for other SSRIs, because norfluoxetine lingers
- Not needed
> Fluoxetine's very long-lived metabolite.

Q: The SSRI dose-response curve in depression is fairly flat because:
- SSRIs are not absorbed
- *Starting doses already give about 80% SERT occupancy on a hyperbolic curve
- Higher doses block dopamine
- SSRIs work only in mild depression
> Occupancy plateaus.

Q: A CYP2C19 poor metaboliser starting escitalopram should get:
- Double the usual dose
- *A lower starting dose or an alternative not mainly cleared by CYP2C19
- No change
- An MAOI instead
> Higher exposure at standard doses.

Q: Which interaction is pharmacodynamic?
- Fluvoxamine raising clozapine
- Paroxetine reducing tamoxifen activation
- *Citalopram plus methadone lengthening the QT interval
- Carbamazepine lowering sertraline
> Additive effects at the same physiological endpoint.

Q: An 80-year-old on amitriptyline, oxybutynin and chlorpheniramine becomes acutely confused with urinary retention. The most likely cause is:
- Alzheimer's disease
- *Anticholinergic burden (delirium)
- Serotonin syndrome
- Hyponatraemia only
> Stacked muscarinic block.

Q: Ketamine's antidepressant action is thought to begin with:
- SERT block
- *NMDA receptor block on inhibitory interneurons, causing a glutamate surge
- Dopamine D2 block
- GABA-A modulation
> Then AMPA, BDNF and mTOR.

Q: After esketamine, the patient must:
- Drive straight home
- *Be observed in clinic until sedation and dissociation settle, and not drive until the next day
- Take a second dose at home
- Fast for 24 hours
> Supervised administration.

Q: Zuranolone acts by:
- Blocking NMDA receptors
- *Positive allosteric modulation of GABA-A receptors
- Blocking SERT
- Melatonin agonism
> A neuroactive steroid.

Q: A woman with a severe past depression, well on paroxetine, finds she is pregnant. The best course is:
- Stop paroxetine at once
- *Discuss risks and benefits and consider a gradual switch to sertraline with close monitoring
- Double the paroxetine
- Start lithium
> Avoid abrupt stopping; sertraline has more reassuring data.

Q: The best first step when depression "doesn't respond" is:
- Add lithium immediately
- *Check diagnosis, adherence, dose, duration, substances and medical causes
- ECT
- Switch to an MAOI
> Exclude pseudo-resistance.

Q: Which augmenting agent most often causes akathisia?
- Lithium
- *Aripiprazole
- Mirtazapine
- Liothyronine
> A D2 partial agonist effect.

Q: A depressed 68-year-old with nihilistic delusions has stopped eating and drinking. The best treatment is:
- A third antidepressant
- Esketamine at home
- *Urgent modified ECT with medical care
- Psychotherapy alone
> Fast, effective, life-saving.

Q: Which antidepressant needs its dose halved when bupropion is added?
- Sertraline
- *Vortioxetine
- Mirtazapine
- Escitalopram
> Bupropion inhibits CYP2D6, doubling vortioxetine exposure.

Q: Which statement about pharmacogenomic testing is TRUE?
- It tells you which antidepressant will work
- *It shows how a medicine will be cleared, and must be read with the current medicine list
- It is required before every prescription
- It replaces clinical judgement
> Phenoconversion and modest benefit.

Q: In ICD-11, which diagnosis exists that DSM-5-TR lacks?
- Major depressive disorder
- *Mixed depressive and anxiety disorder
- Persistent depressive disorder
- Premenstrual dysphoric disorder
> ICD-11 includes it.

Q: Discontinuation symptoms are best distinguished from relapse by:
- Their severity
- *Early onset, physical symptoms and quick relief when the medicine is restarted
- A blood test
- Their occurrence only with fluoxetine
> Relapse is later and mood-based.

Q: Venlafaxine's noradrenaline effect:
- Is strongest at the lowest dose
- *Increases with dose, which is why blood pressure rises at higher doses
- Does not exist
- Causes sedation
> Serotonin first, noradrenaline at higher doses.
:::
`;

export const text = p1 + p2 + qaBank + p3;
