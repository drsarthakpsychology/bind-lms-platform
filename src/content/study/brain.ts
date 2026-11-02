import { act } from "@/lib/study/activities";
import type { ModuleMeta } from "@/lib/study/types";

export const meta: ModuleMeta = {
  id: "brain",
  num: 2,
  title: "Brain and behaviour",
  emoji: "🧬",
  tagline: "The neuroscience behind symptoms, medicines and therapy, explained simply",
  when: "Weeks 1 to 2",
  outcomes: [
    "Explain how a neuron fires and how a synapse passes the message on",
    "Know the main neurotransmitters, where they come from and what they do",
    "Link brain regions and circuits to symptoms",
    "Describe the stress system, sleep regulation and neuroplasticity",
    "Use basic pharmacology terms: agonist, antagonist, half-life, enzyme induction",
  ],
  writeTask:
    "On paper, from memory: a labelled synapse with the five steps of transmission, a table of six neurotransmitters (source, role, linked disorders, drugs), the four lobes with one clinical sign each, the HPA axis, and definitions of agonist, partial agonist, antagonist and half-life. Then check and correct in red.",
  activities: [
    act.coach("neuroscience", "Coach: neuroscience", "Transmitters, regions and pathways."),
    act.coach("pharmacology", "Coach: pharmacology", "How medicines act."),
    act.detective("Clinic detective", "Medicines and disorders from clues."),
  ],
  noteId: "neuroscience",
};

export const text = String.raw`
# Part I · Cells and signals

## 1.1 The neuron and the synapse [core]
:::define The neuron
A nerve cell that receives signals through its **dendrites**, sums them in the **cell body**, and, if the total crosses a threshold, fires an **action potential** down its **axon** to the **terminals**, which release chemical messengers onto the next cell.
:::

### Five steps of chemical transmission
1. **Synthesis**: the neurotransmitter is made (for example tryptophan to serotonin).
2. **Storage**: packed into vesicles.
3. **Release**: the action potential opens calcium channels; vesicles release the transmitter into the **synaptic cleft**.
4. **Receptor binding**: the transmitter binds receptors on the next cell, changing its activity.
5. **Termination**: by **reuptake** (pumped back by transporters), **enzymatic breakdown** (for example monoamine oxidase, acetylcholinesterase) or diffusion.

:::analogy A key and a lock
The neurotransmitter is a key; the receptor is a lock. Medicines can be copies of the key (agonists), keys that fit but don't turn (antagonists), keys that turn halfway (partial agonists), or they can stop old keys being recycled (reuptake inhibitors).
:::

| Receptor type | How it works | Speed | Examples |
|---|---|---|---|
| Ionotropic (ligand-gated channel) | Opens an ion channel directly | Milliseconds | GABA-A, NMDA, nicotinic, 5-HT3 |
| Metabotropic (G-protein-coupled) | Triggers chemical cascades inside the cell | Slower, longer-lasting | Dopamine D1 to D5, most serotonin receptors, muscarinic, opioid |

:::recall
1. Name the five steps of chemical transmission. || Synthesis, storage, release, receptor binding, termination.
2. Name three ways a signal is terminated. || Reuptake, enzymatic breakdown, diffusion.
3. Contrast ionotropic and metabotropic receptors. || Direct ion channel, fast vs G-protein cascade, slower.
:::

## 1.2 The main neurotransmitters [core]
| Transmitter | Main source | Roles | Linked disorders | Medicines acting on it |
|---|---|---|---|---|
| **Glutamate** | Throughout the cortex | Main excitatory signal; learning, memory (NMDA) | Schizophrenia (NMDA hypofunction), excitotoxicity | Ketamine, memantine, lamotrigine (indirect) |
| **GABA** | Interneurons everywhere | Main inhibitory signal; calm, sleep, seizure control | Anxiety, insomnia, epilepsy, alcohol withdrawal | Benzodiazepines, Z-drugs, alcohol, valproate |
| **Dopamine** | Substantia nigra, ventral tegmental area | Reward, motivation, movement, prolactin control | Psychosis, Parkinson's, addiction, ADHD | Antipsychotics (block), stimulants, levodopa, bupropion |
| **Serotonin (5-HT)** | Raphe nuclei | Mood, anxiety, sleep, appetite, impulse control, gut | Depression, anxiety, OCD | SSRIs, SNRIs, TCAs, atypical antipsychotics (5-HT2A) |
| **Noradrenaline** | Locus coeruleus | Alertness, attention, stress response | Depression, anxiety, PTSD, ADHD | SNRIs, TCAs, mirtazapine, atomoxetine, clonidine |
| **Acetylcholine** | Basal forebrain (nucleus basalis), brainstem | Memory, attention, muscle activation | Alzheimer's disease, delirium (anticholinergic drugs) | Donepezil, rivastigmine; anticholinergics |
| Histamine | Hypothalamus | Wakefulness, appetite | | Antihistamines (sedation, weight gain) |
| Endorphins (opioids) | Many areas | Pain relief, reward | Opioid addiction | Morphine, naloxone, naltrexone, buprenorphine |
| Melatonin | Pineal gland | Sleep timing | Circadian disorders | Melatonin, agomelatine |

:::recall
1. Which transmitter is the main excitatory one, and which the main inhibitory? || Glutamate; GABA.
2. Where do serotonin, noradrenaline and dopamine come from? || Raphe nuclei; locus coeruleus; substantia nigra and VTA.
3. Which transmitter falls first in Alzheimer's disease? || Acetylcholine.
:::

# Part II · Regions and systems

## 2.1 Brain regions and what goes wrong [core]
| Region | Normal role | When damaged or disordered |
|---|---|---|
| **Frontal lobe** (prefrontal cortex) | Planning, judgement, inhibition, personality, working memory | Disinhibition, apathy, poor judgement, personality change (frontotemporal dementia, head injury), negative symptoms, ADHD |
| **Temporal lobe** | Memory (hippocampus), language comprehension (Wernicke's area), hearing, emotion (amygdala) | Memory loss, receptive aphasia, temporal lobe epilepsy (déjà vu, smells, automatisms), hallucinations |
| **Parietal lobe** | Sensation, spatial awareness, attention to both sides | Neglect, dressing apraxia, getting lost, inability to recognise objects by touch |
| **Occipital lobe** | Vision | Visual field loss, visual hallucinations |
| **Hippocampus** | Forming new memories, context | Amnesia (Alzheimer's, Korsakoff), shrinks with chronic stress |
| **Amygdala** | Threat detection, fear learning | Overactive in anxiety and PTSD |
| **Basal ganglia** | Movement, habits, reward | Parkinsonism, tics, OCD, addiction, EPS from antipsychotics |
| **Thalamus** | Relay and filter for senses | Confusion, sensory problems |
| **Hypothalamus** | Hunger, thirst, temperature, sleep, hormones | Appetite and sleep changes, HPA axis |
| **Cerebellum** | Coordination, balance | Ataxia (alcohol damage) |
| **Brainstem** | Breathing, heart rate, arousal, monoamine nuclei | Altered consciousness |

:::note Phineas Gage
A railway worker who survived an iron rod through his frontal lobe in 1848 and became impulsive and socially inappropriate: the classic early evidence that the frontal lobe shapes personality and self-control.
:::

### Circuits worth knowing
- **Limbic system and the Papez circuit** (hippocampus, fornix, mammillary bodies, thalamus, cingulate): emotion and memory. Mammillary bodies are damaged in Wernicke–Korsakoff.
- **Fear circuit**: amygdala (alarm) with prefrontal cortex (brake) and hippocampus (context).
- **Reward circuit**: VTA to nucleus accumbens (mesolimbic dopamine): addiction, anhedonia.
- **Cortico-striato-thalamo-cortical loops**: OCD, tics, habits.
- **Default mode network**: active during mind-wandering and self-reflection; linked to rumination in depression.

## 2.2 Stress, sleep and change [core]
### The stress system (HPA axis)
Stress → **hypothalamus** releases CRH → **pituitary** releases ACTH → **adrenal cortex** releases **cortisol** → cortisol prepares the body (glucose, alertness) and then **switches the system off** by negative feedback. Chronic stress leaves it stuck on: linked to depression, poor memory (hippocampal damage), weight gain, low immunity. The fast arm (sympathetic nervous system and adrenaline) gives the racing heart.

### Sleep regulation
- **Process S** (sleep pressure builds the longer we're awake, partly through adenosine; caffeine blocks adenosine) and **Process C** (the circadian clock in the **suprachiasmatic nucleus**, set by light, releasing melatonin at night).
- Sleep cycles of about 90 minutes: light NREM, deep NREM (slow-wave; most in the first half of the night), and **REM** (dreaming; muscles paralysed; more in the second half).

### Neuroplasticity
- The brain rewires with experience: new synapses, stronger or weaker connections, even new neurons in the hippocampus.
- Learning, therapy, exercise, antidepressants and ECT all promote plasticity (BDNF); chronic stress, alcohol and inactivity reduce it.
- This is why **therapy changes the brain** too.

### Genes and environment
- Most mental disorders are **polygenic**: many genes each add small risk.
- **Epigenetics**: experience (stress, trauma, nutrition) changes how genes are switched on, without changing the DNA code.
- **Gene–environment interaction**: genes shape sensitivity to stress; stress shapes gene expression.

:::recall
1. Describe the HPA axis in one line. || Hypothalamus CRH, pituitary ACTH, adrenal cortisol, with negative feedback.
2. What are Process S and Process C? || Sleep pressure (adenosine) and the circadian clock (suprachiasmatic nucleus, melatonin).
3. Define neuroplasticity and name three things that promote it. || The brain's ability to rewire; learning and therapy, exercise, antidepressants, ECT.
4. What does damage to the mammillary bodies cause? || Korsakoff-type memory loss.
:::

# Part III · Basic pharmacology

## 3.1 How medicines act and move [core]
| Term | Meaning | Example |
|---|---|---|
| **Agonist** | Activates a receptor like the natural transmitter | Morphine at opioid receptors |
| **Antagonist** | Binds without activating, blocking the transmitter | Haloperidol at D2, naloxone at opioid receptors |
| **Partial agonist** | Activates partly; acts as an agonist when transmitter is low and an antagonist when high | Aripiprazole (D2), buprenorphine (opioid) |
| **Inverse agonist** | Produces the opposite effect of the agonist | Some antihistamines |
| **Reuptake inhibitor** | Blocks the transporter, keeping transmitter in the synapse longer | SSRIs |
| **Enzyme inhibitor** | Blocks the breakdown enzyme | MAOIs, donepezil |
| **Allosteric modulator** | Binds a different site to change receptor response | Benzodiazepines at GABA-A |

| Pharmacokinetic term | Meaning |
|---|---|
| **Half-life** | Time for the blood level to fall by half. Decides dosing frequency and how long withdrawal effects take |
| **Steady state** | Reached after about **4 to 5 half-lives** of regular dosing (when to check levels) |
| **Bioavailability** | Proportion of a dose reaching the circulation |
| **First-pass metabolism** | Breakdown by the liver before reaching the circulation (oral drugs) |
| **Therapeutic index** | Gap between effective and toxic doses (narrow for lithium) |

### Liver enzymes (cytochrome P450)
- **Inducers** speed up breakdown and **lower** other drugs' levels: carbamazepine, phenytoin, rifampicin, **smoking (CYP1A2)**, St John's wort.
- **Inhibitors** slow breakdown and **raise** levels: fluoxetine and paroxetine (CYP2D6), fluvoxamine (CYP1A2), valproate (raises lamotrigine), erythromycin, ciprofloxacin.

:::recall
1. Define agonist, antagonist and partial agonist, with an example each. || Morphine; haloperidol or naloxone; aripiprazole or buprenorphine.
2. After how many half-lives is steady state reached? || About 4 to 5.
3. Name three enzyme inducers and three inhibitors. || Carbamazepine, smoking, rifampicin; fluoxetine, fluvoxamine, valproate.
:::

# Part IV · Exam zone

## 4.1 Long answer and short notes [core]
:::example Q. Describe the major neurotransmitters and their role in psychiatric disorders. (10 marks)
1. Synaptic transmission in five steps; receptor types.
2. Table: glutamate, GABA, dopamine (four pathways), serotonin, noradrenaline, acetylcholine: source, function, disorders, drugs.
3. Monoamine hypothesis of depression and its limits.
4. Dopamine and glutamate hypotheses of schizophrenia.
5. GABA in anxiety and alcohol withdrawal; acetylcholine in Alzheimer's and delirium.
6. Close with plasticity: why both medicines and therapy work.
:::

:::word Short note: the HPA axis
The hypothalamic–pituitary–adrenal axis is the body's main hormonal stress system. Stress triggers release of corticotropin-releasing hormone from the hypothalamus, adrenocorticotropic hormone from the pituitary, and cortisol from the adrenal cortex; cortisol mobilises energy and then suppresses further release by negative feedback. In depression the axis is often overactive, with raised cortisol and failure to suppress after dexamethasone; chronic overactivity is associated with hippocampal shrinkage and memory problems, linking stress, mood and cognition.
:::

## 4.2 Viva rapid-fire [core]
:::viva
Main excitatory transmitter? :: Glutamate.
Main inhibitory transmitter? :: GABA.
Source of serotonin? :: Raphe nuclei.
Source of noradrenaline? :: Locus coeruleus.
Transmitter lost early in Alzheimer's? :: Acetylcholine.
Brain area for new memories? :: Hippocampus.
Brain area that sounds the fear alarm? :: Amygdala.
Lobe linked to personality and inhibition? :: Frontal.
Classic case of frontal damage? :: Phineas Gage.
Body clock location? :: Suprachiasmatic nucleus.
What does caffeine block? :: Adenosine receptors.
Hormone at the end of the HPA axis? :: Cortisol.
Define partial agonist with an example. :: Partly activates a receptor; aripiprazole, buprenorphine.
Steady state after how many half-lives? :: About 4 to 5.
Effect of smoking on clozapine? :: Lowers levels (CYP1A2 induction).
:::

## 4.3 Module test [core]
:::mcq
Q: Benzodiazepines act at:
- Dopamine D2 receptors
- *GABA-A receptors (allosteric site)
- NMDA receptors
- Serotonin transporters
> They increase GABA's effect.

Q: Which nucleus produces most of the brain's noradrenaline?
- Raphe nuclei
- *Locus coeruleus
- Substantia nigra
- Nucleus basalis
> Linked to arousal and stress.

Q: A patient after head injury becomes impulsive, rude and careless about consequences. The region most likely affected:
- Occipital lobe
- *Frontal lobe
- Cerebellum
- Brainstem
> Prefrontal damage changes personality.

Q: Aripiprazole is best described as a:
- Full D2 agonist
- *D2 partial agonist
- Pure D2 antagonist
- Serotonin reuptake inhibitor
> Hence weight-neutral and prolactin-lowering.

Q: Which drug raises lamotrigine levels?
- Carbamazepine
- *Valproate
- Smoking
- Rifampicin
> Enzyme inhibition.

Q: Steady state is usually reached after about:
- One half-life
- *Four to five half-lives
- Ten half-lives
- One day regardless
> Check drug levels after this.

Q: Chronic stress damages which structure, linking stress to memory problems?
- Cerebellum
- *Hippocampus
- Occipital cortex
- Pons
> Via prolonged high cortisol.

Q: The brain's main body clock is the:
- Pineal gland
- *Suprachiasmatic nucleus
- Amygdala
- Thalamus
> It drives melatonin release.
:::
`;
