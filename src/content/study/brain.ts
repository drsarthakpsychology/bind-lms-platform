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

:::mcq
Q: An SSRI keeps serotonin in the synapse longer. Which step of transmission does it act on?
- Synthesis
- Storage
- *Termination by reuptake
- Release
> It blocks the serotonin transporter that pumps the transmitter back.
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

:::mcq
Q: A man on donepezil improves slightly in memory. Which transmitter does this medicine boost?
- Dopamine
- *Acetylcholine
- GABA
- Glutamate
> Cholinesterase inhibitors slow the breakdown of acetylcholine.
:::

## 1.3 Dopamine pathways and receptor side effects [core]
Most of what psychiatric medicines do, wanted and unwanted, follows from **which receptor they block, in which pathway**. Learn this once and side-effect tables stop being lists to memorise.

### The four dopamine pathways
| Pathway | From → to | Normal role | In schizophrenia | When D2 is blocked |
|---|---|---|---|---|
| **Mesolimbic** | VTA → nucleus accumbens, limbic areas | Reward, salience | **Overactive** → positive symptoms | Antipsychotic effect; can blunt pleasure |
| **Mesocortical** | VTA → prefrontal cortex | Motivation, cognition, emotion | **Underactive** → negative and cognitive symptoms | Can worsen apathy and slowness |
| **Nigrostriatal** | Substantia nigra → striatum | Movement | Normal | **EPS**: dystonia, parkinsonism, akathisia, tardive dyskinesia |
| **Tuberoinfundibular** | Hypothalamus → pituitary | Dopamine **inhibits prolactin** | Normal | **Raised prolactin**: galactorrhoea, amenorrhoea, sexual dysfunction, low bone density |

:::mnemonic Mesolimbic = "more", mesocortical = "missing"
Too **m**uch dopamine in the mesolimbic path gives positive symptoms; too little in the mesocortical path leaves motivation and thinking **m**issing.
:::

:::analogy One tap, four rooms
A typical antipsychotic is like turning down the main water tap to stop one flooded room (mesolimbic). The other three rooms (movement, prolactin, motivation) also lose water. Newer medicines try to turn down the flooded room more than the others, through 5-HT2A blockade, partial agonism or looser binding.
:::

### Receptors and the side effects they explain
| Receptor blocked | Effects you will see | Medicines that do it most |
|---|---|---|
| **D2** | EPS, raised prolactin | Haloperidol, risperidone, amisulpride |
| **H1** (histamine) | Sedation, **weight gain**, appetite | Clozapine, olanzapine, quetiapine, mirtazapine, TCAs |
| **M1** (muscarinic) | Dry mouth, constipation, blurred vision, urinary retention, confusion, memory problems | TCAs, clozapine, trihexyphenidyl |
| **Alpha-1** (adrenergic) | **Postural hypotension**, dizziness, falls, reflex tachycardia | Clozapine, quetiapine, TCAs, risperidone (early) |
| **5-HT2A** | Fewer EPS, may help negative symptoms and sleep | Most atypicals, mirtazapine, trazodone |
| **5-HT2C** | Weight gain, appetite | Olanzapine, clozapine, mirtazapine |

| Receptor stimulated | Effects |
|---|---|
| **5-HT2** (by excess serotonin early in SSRI treatment) | Agitation, insomnia, sexual dysfunction |
| **5-HT3** | Nausea, loose stools (why SSRIs upset the stomach first) |
| **5-HT1A** | Anxiety relief (buspirone is a partial agonist) |

:::trap Anticholinergic load adds up
In an older person, an antidepressant (amitriptyline) plus an antipsychotic plus trihexyphenidyl plus an antihistamine can produce **delirium**. Always total the anticholinergic burden before adding a medicine.
:::

:::recall
1. Name the four dopamine pathways and the effect of blocking D2 in each. || Mesolimbic: antipsychotic; mesocortical: worse negative symptoms; nigrostriatal: EPS; tuberoinfundibular: raised prolactin.
2. Which receptor blockade causes weight gain and sedation? || H1 (with 5-HT2C for weight).
3. List four anticholinergic side effects. || Dry mouth, constipation, blurred vision, urinary retention, confusion.
4. Which receptor blockade causes postural hypotension? || Alpha-1.
:::

:::mcq
Q: An older woman on amitriptyline becomes constipated, can't pass urine and is confused. These effects come from blocking:
- D2 receptors
- H1 receptors
- *Muscarinic (M1) receptors
- 5-HT2A receptors
> Anticholinergic effects; worse in older people.
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

:::mcq
Q: After a head injury, a man becomes impulsive, rude and careless about others' feelings, but his memory is fine. The region most likely damaged is:
- Occipital lobe
- *Frontal (orbitofrontal) lobe
- Cerebellum
- Hippocampus
> Disinhibition and personality change point to the frontal lobe.
:::

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

:::mcq
Q: A student pulls all-nighters, then sleeps until noon on weekends and drinks lots of coffee. Which system is caffeine blocking to keep him awake?
- The suprachiasmatic nucleus
- *Adenosine receptors (sleep pressure)
- Melatonin release
- Cortisol
> Adenosine builds up with time awake (Process S); caffeine blocks it.
:::

## 2.3 The lobes in the clinic: frontal syndromes and language [core]
### Three frontal syndromes
| Syndrome | Area | What you see | Typical causes |
|---|---|---|---|
| **Dysexecutive** | Dorsolateral prefrontal | Poor planning, rigid thinking, perseveration, poor working memory, cannot shift set | Head injury, frontotemporal dementia, schizophrenia (cognitive), vascular |
| **Disinhibited** | Orbitofrontal | Impulsive, tactless, jocular (**witzelsucht**), sexually disinhibited, poor social judgement | Trauma, frontotemporal dementia (behavioural variant), tumours |
| **Apathetic** | Medial frontal and anterior cingulate | Apathy, slowness, little speech (**abulia**, akinetic mutism in the extreme) | Anterior cerebral artery stroke, hydrocephalus |

:::example How it looks
A 52-year-old bank manager starts making crude jokes in meetings, spends savings on lottery tickets and eats sweets constantly. He has no worry about any of it. Mood is not low or high. This is the **disinhibited frontal** picture: think of **behavioural variant frontotemporal dementia** before calling it mania or a personality change.
:::

### Bedside frontal tests
- **Verbal fluency**: words beginning with F in one minute (fewer than about 10 is poor).
- **Luria three-step** (fist, edge, palm): cannot sequence.
- **Go/no-go**: tap once when I tap once, do not tap when I tap twice.
- **Similarities and proverbs**: concrete answers.
- **Primitive reflexes**: grasp, pout, palmomental (frontal release signs).

### Language and the two hemispheres
| Aphasia | Lesion | Speech | Comprehension | Repetition |
|---|---|---|---|---|
| **Broca's** (expressive) | Left inferior frontal | Non-fluent, effortful, telegraphic | Good | Poor |
| **Wernicke's** (receptive) | Left superior temporal | Fluent but empty, paraphasias, word salad-like | Poor | Poor |
| **Conduction** | Arcuate fasciculus | Fluent | Good | **Very poor** |
| **Global** | Large left hemisphere | Little speech | Poor | Poor |

:::trap Wernicke's aphasia is not psychosis
Fluent nonsense with poor understanding can be mistaken for formal thought disorder. Clues to aphasia: sudden onset, older age, vascular risk factors, word-finding errors (paraphasias), frustration at not being understood, other neurological signs. Thought disorder usually comes with other psychotic features and intact naming.
:::

- **Left hemisphere** (in most people): language, sequential logic, calculation.
- **Right hemisphere**: spatial ability, faces, tone of voice (**prosody**), attention to both sides. Right parietal damage gives **left neglect** and often **anosognosia** (unaware of the deficit).
- **Gerstmann syndrome** (left angular gyrus): finger agnosia, left-right confusion, acalculia, agraphia.

:::recall
1. Name the three frontal lobe syndromes and their areas. || Dysexecutive (dorsolateral), disinhibited (orbitofrontal), apathetic (medial frontal).
2. Give three bedside frontal tests. || Verbal fluency, Luria three-step, go/no-go, proverbs, frontal release signs.
3. How does Broca's aphasia differ from Wernicke's? || Broca's: non-fluent, comprehension good. Wernicke's: fluent, comprehension poor.
4. What are the four parts of Gerstmann syndrome? || Finger agnosia, left-right confusion, acalculia, agraphia.
:::

:::mcq
Q: An older man suddenly speaks fluently but makes no sense and cannot follow instructions; he seems unaware. The likely problem is:
- Schizophrenia
- *Wernicke's (receptive) aphasia from a left temporal stroke
- Broca's aphasia
- Mania
> Sudden onset, fluent nonsense and poor comprehension: think stroke.
:::

## 2.4 Memory systems [core]
:::define Memory
The ability to **encode**, **store** and **retrieve** information. Different kinds of memory use different brain systems, so diseases damage them selectively.
:::

| Type | What it holds | Brain system | Lost in |
|---|---|---|---|
| **Working memory** | A few items held for seconds (a phone number) | Dorsolateral prefrontal | Schizophrenia, ADHD, frontal damage |
| **Episodic** (declarative) | Personal events, with time and place | Hippocampus, Papez circuit | Alzheimer's (early), Korsakoff, ECT (temporary) |
| **Semantic** (declarative) | Facts and word meanings | Anterior temporal lobes | Semantic dementia |
| **Procedural** (non-declarative) | Skills and habits (cycling) | Basal ganglia, cerebellum | Parkinson's, Huntington's |
| **Priming and conditioning** | Unconscious learning | Cortex, amygdala | Usually spared |

- **Anterograde amnesia**: cannot form new memories after the injury. **Retrograde amnesia**: loses memories from before it. **Ribot's law**: in retrograde loss, **recent memories go first** and old ones last.
- **Confabulation** (filling gaps with false memories, without intent to deceive) suggests **Korsakoff** or frontal damage.
- In **functional (dissociative) amnesia**, loss of personal identity and autobiographical memory occurs with new learning intact: the opposite of organic patterns.

:::trap Organic or dissociative?
Organic amnesia: new learning poor, identity kept, recent memories lost before old. Dissociative amnesia: identity or a stressful period lost, new learning fine, often a clear trigger.
:::

:::recall
1. Name four memory types and their brain systems. || Working: prefrontal. Episodic: hippocampus. Semantic: anterior temporal. Procedural: basal ganglia and cerebellum.
2. State Ribot's law. || In retrograde amnesia, recent memories are lost first and old ones last.
3. What is confabulation and when is it seen? || Unintended false memories filling gaps; Korsakoff, frontal damage.
:::

:::mcq
Q: After ECT a patient cannot remember the week of treatment but remembers childhood well. Which principle explains this pattern?
- Confabulation
- *Ribot's law: recent memories are lost before old ones
- Procedural memory loss
- Semantic dementia
> Retrograde gaps affect the most recent memories first.
:::

## 2.5 Looking at the brain: EEG and imaging [core]
### EEG rhythms
| Rhythm | Frequency (per second) | When seen |
|---|---|---|
| **Beta** | Above 13 | Alert, anxious; **benzodiazepines increase beta** |
| **Alpha** | 8 to 13 | Relaxed with eyes closed, over the back of the head |
| **Theta** | 4 to 7 | Drowsiness, children; excess in some disorders |
| **Delta** | Below 4 | Deep sleep, infants; **delirium** and encephalopathy when awake |

- **Delirium**: generalised **slowing** (more theta and delta), except alcohol and sedative withdrawal, where fast activity is common.
- **Triphasic waves**: hepatic encephalopathy. **Periodic sharp wave complexes**: Creutzfeldt–Jakob disease.
- **Spikes and sharp waves**: epilepsy (a normal EEG does not rule it out).
- **Sleep EEG (polysomnography)**: **shortened REM latency** in depression and narcolepsy.

### Imaging
| Method | What it shows | Use in psychiatry |
|---|---|---|
| **CT** | Structure; quick; good for bleeding and bone | Acute confusion, head injury, first psychosis in an emergency |
| **MRI** | Structure in fine detail, white matter | First-episode psychosis, dementia (hippocampal atrophy), atypical presentations |
| **PET and SPECT** | Blood flow, metabolism, receptor binding | Dementia subtypes (reduced temporoparietal uptake in Alzheimer's) |
| **fMRI** | Activity changes during tasks | Mainly research |

- Schizophrenia on imaging (groups, not individuals): **enlarged lateral ventricles**, reduced grey matter in temporal and frontal regions.
- Imaging in psychiatry is mainly used to **rule out organic causes**, not to diagnose primary mental illness.

:::recall
1. Name the four EEG rhythms with frequencies. || Beta above 13, alpha 8 to 13, theta 4 to 7, delta below 4 per second.
2. What does the EEG show in delirium? || Generalised slowing (fast activity in alcohol or sedative withdrawal).
3. Which EEG pattern suggests CJD? || Periodic sharp wave complexes.
4. Main purpose of brain imaging in psychiatry? || To exclude organic causes.
:::

:::mcq
Q: An awake patient's EEG shows generalised slowing. This most supports:
- Anxiety
- *Delirium or encephalopathy
- Normal alertness
- Benzodiazepine use
> Slowing is typical of delirium (except alcohol or sedative withdrawal).
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

:::mcq
Q: Aripiprazole lowers dopamine signalling when dopamine is high and raises it when low. It is a:
- Full agonist
- Antagonist
- *Partial agonist
- Inverse agonist
> Like buprenorphine at opioid receptors.
:::

## 3.2 Medicines in special groups and over time [core]
### Tolerance, dependence and withdrawal at the synapse
- **Tolerance**: the same dose gives less effect, because receptors **down-regulate** or become less sensitive, or the liver breaks the drug down faster.
- **Physical dependence**: the body has adapted, so **stopping causes withdrawal**, usually the **opposite** of the drug's effect (benzodiazepines calm; their withdrawal causes anxiety, insomnia, seizures).
- **Discontinuation syndrome** (not addiction): SSRIs with short half-lives (paroxetine, venlafaxine) cause dizziness, "electric shock" sensations, irritability and flu-like feelings if stopped suddenly. Taper.

### Special groups
| Group | What changes | What to do |
|---|---|---|
| **Older adults** | Less liver and kidney clearance, more fat (longer half-lives), more sensitive brains | **Start low, go slow**; avoid anticholinergics and long-acting benzodiazepines; watch falls, low sodium |
| **Children and adolescents** | Faster metabolism; different side-effect risks | Use evidence-based options; monitor suicidal thinking on antidepressants |
| **Pregnancy** | Larger body volume, faster clearance later in pregnancy | Weigh risk of illness against medicine; avoid **valproate**; specialist advice |
| **Liver disease** | Less metabolism | Lower doses; prefer **lorazepam or oxazepam** among benzodiazepines |
| **Kidney disease** | Less excretion | Reduce **lithium**, gabapentin, pregabalin, amisulpride |

### Therapeutic drug monitoring
- Measure levels when the therapeutic index is narrow or effect is hard to judge: **lithium**, **valproate**, **carbamazepine**, **clozapine**.
- Take the sample at **trough** (lithium 12 hours after the last dose) and at **steady state** (5 days for lithium after a change).

:::mnemonic Start low, go slow, but go
In older people, start at a low dose and increase slowly, but keep going to an effective dose. Under-treatment is a common error too.
:::

:::recall
1. Why does benzodiazepine withdrawal cause anxiety and seizures? || Withdrawal is the opposite of the drug's effect after adaptation.
2. Which benzodiazepines are safer in liver disease? || Lorazepam and oxazepam.
3. Name four medicines whose blood levels are monitored. || Lithium, valproate, carbamazepine, clozapine.
4. When is a lithium level taken? || 12 hours after the last dose, at steady state (about 5 days after a change).
:::

:::mcq
Q: An 80-year-old is started on a standard adult dose of a sedating medicine and becomes confused. The best general principle is:
- Older people need higher doses
- *Start low, go slow, but reach an effective dose
- Never treat older people with medicines
- Double the dose if no effect in a day
> Slower clearance and more sensitive brains.
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
Blocking D2 in the tuberoinfundibular pathway causes? :: Raised prolactin.
Blocking D2 in the nigrostriatal pathway causes? :: Extrapyramidal side effects.
Receptor behind antipsychotic weight gain? :: H1 and 5-HT2C.
Receptor behind postural hypotension? :: Alpha-1.
Witzelsucht points to which lobe? :: Orbitofrontal (frontal).
Fluent speech, poor comprehension? :: Wernicke's aphasia.
Ribot's law? :: Recent memories are lost before old ones.
EEG in delirium? :: Generalised slowing.
EEG rhythm increased by benzodiazepines? :: Beta.
Benzodiazepine for liver disease? :: Lorazepam or oxazepam.
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

Q: Galactorrhoea on risperidone is explained by D2 blockade in the:
- Mesolimbic pathway
- Nigrostriatal pathway
- *Tuberoinfundibular pathway
- Mesocortical pathway
> Dopamine normally inhibits prolactin release from the pituitary.

Q: Constipation, dry mouth and confusion in an older man on amitriptyline reflect blockade of:
- H1 receptors
- *Muscarinic receptors
- Alpha-1 receptors
- 5-HT2A receptors
> Anticholinergic effects.

Q: A man makes crude jokes, is sexually disinhibited and shows no concern. The lesion is most likely:
- Dorsolateral prefrontal
- *Orbitofrontal
- Occipital
- Cerebellar
> The disinhibited frontal syndrome.

Q: Poor repetition with fluent speech and good comprehension is:
- Broca's aphasia
- Wernicke's aphasia
- *Conduction aphasia
- Global aphasia
> Damage to the arcuate fasciculus.

Q: Periodic sharp wave complexes on EEG suggest:
- Absence epilepsy
- Hepatic encephalopathy
- *Creutzfeldt–Jakob disease
- Benzodiazepine use
> Triphasic waves suggest hepatic encephalopathy.
:::
`;
