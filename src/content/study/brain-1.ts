/* Module · Brain and behaviour, Parts I and II (Starting and Beginner levels). Original text written for VIBHA School of Psychology. */
export const s1Intro = String.raw`

## 1.1 Why a psychology student needs the brain [core][starting]
Every thought, mood and memory you will study in this course happens in a body. When a patient cannot sleep, hears voices or freezes with panic, something is changing in their brain at the same moment as something is changing in their life. You do not need to become a neurologist. You need a clear, working picture so that you can explain symptoms, understand medicines, and talk with doctors as an equal.

### Mind and brain are two views of one thing
A useful way to hold it: the **mind** is what the brain does, described in the language of experience (fear, hope, memory). The **brain** is the same process described in the language of cells and chemicals. Neither view is "more real". A sad memory is both a story and a pattern of firing. Therapy changes the brain; medicines change experience.

:::analogy Music and the instrument
A raga is not "just" vibrating strings, and the strings are not "just" a raga. You can study the music (psychology) or the instrument (neuroscience). A good clinician can talk about both, and knows a broken string sounds different from a sad tune.
:::

### The nervous system at a glance
- The **central nervous system (CNS)** is the brain and the spinal cord. It decides.
- The **peripheral nervous system (PNS)** is every nerve outside them. It carries messages in and out.
- Inside the PNS, the **somatic** part moves the muscles you choose to move and brings in touch, pain and position.
- The **autonomic** part runs the body without asking you: heart, gut, sweat, pupils. It has two arms. The **sympathetic** arm prepares for "fight or flight": fast heart, dry mouth, wide pupils. The **parasympathetic** arm restores "rest and digest": slow heart, saliva, digestion.


:::widget nervoussystem
{"title":"Zoom through the nervous system","start":"map","caption":"Zoom from the whole system down to its divisions, then switch the organs to fight or flight. Where do anticholinergic side effects come from? (Blocking the parasympathetic branch.)"}
:::

:::student
A panic attack is mostly the sympathetic arm firing at full power when there is no tiger. The pounding heart, shaking and sweating are real body events, which is why patients are so sure something is physically wrong.
:::

:::widget sort
{
  "prompt": "Which part of the nervous system is mainly at work?",
  "buckets": ["Central (brain and spinal cord)", "Somatic (voluntary, senses)", "Autonomic (automatic body control)"],
  "items": [
    { "text": "Planning what to say in a viva", "bucket": 0 },
    { "text": "Lifting your hand to answer", "bucket": 1 },
    { "text": "Your heart racing as the examiner calls your name", "bucket": 2 },
    { "text": "Feeling a pin prick on your finger", "bucket": 1, "why": "Touch and pain from the skin travel in somatic sensory nerves." },
    { "text": "Pupils widening in a dark room", "bucket": 2 },
    { "text": "Remembering your roll number", "bucket": 0 },
    { "text": "Dry mouth before a presentation", "bucket": 2, "why": "Sympathetic activity reduces saliva. Many medicines with anticholinergic action cause the same dry mouth." }
  ]
}
:::

:::clinician
Teach the biopsychosocial model as levels of explanation, not as a menu. Kendler's "explanatory pluralism" is the cleanest defence: psychiatric disorders have causes at the genetic, neural, psychological and social levels, none of which reduces cleanly to another. Practically, this frees you from the false question "is it chemical or is it psychological?" that patients and families in India often ask, sometimes because a "chemical" cause feels less shameful and sometimes because it feels more frightening. The honest answer is "both, and we can work at more than one level".
:::

:::recall
1. In one line, how do mind and brain relate? || They are two descriptions of the same process: experience on one side, cells and chemicals on the other.
2. Name the two divisions of the autonomic nervous system and one sign of each. || Sympathetic (fast heart, dilated pupils, dry mouth); parasympathetic (slow heart, saliva, digestion).
3. What does the somatic nervous system do? || Moves voluntary muscles and carries touch, pain and position sense to the CNS.
:::

:::mcq
Q: Ravi, 22, sweats and shakes before every exam, and his heart pounds. Which system explains these body signs?
- The somatic nervous system
- *The sympathetic arm of the autonomic nervous system
- The parasympathetic arm of the autonomic nervous system
- The cerebellum
> Fight-or-flight signs come from sympathetic activation.

Q: A mother asks, "Is my son's depression in his mind or in his brain?" The most accurate reply is:
- Only in his mind, so medicines cannot help
- Only in his brain, so talking cannot help
- *Both: the same illness can be described in psychological and in biological terms, and both kinds of treatment act on it
- Neither; it is a weakness of character
> Mind and brain are two levels of description of one process.
:::

## 1.2 The neuron and how it fires [core][starting]
The brain has around 86 billion **neurons** (nerve cells) and at least as many supporting **glial cells**. A neuron does one main job: it collects signals, decides whether to pass a signal on, and sends it quickly to other cells.

### The parts of a neuron
| Part | What it does | Picture it as |
|---|---|---|
| **Dendrites** | Branches that receive signals from other neurons | The ears |
| **Cell body (soma)** | Holds the nucleus, keeps the cell alive, adds up incoming signals | The brain of the cell |
| **Axon** | A long cable that carries the signal away | The telephone wire |
| **Myelin sheath** | Fatty insulation wrapped around many axons | Plastic coating on the wire |
| **Axon terminals** | Endings that release chemical messengers | The loudspeaker |

### Glial cells: not just glue
- **Astrocytes** feed neurons, mop up excess chemical messengers and help form the blood-brain barrier.
- **Oligodendrocytes** make myelin in the brain and spinal cord (**Schwann cells** do this in peripheral nerves).
- **Microglia** are the brain's immune cells. They clear debris and prune unused connections.


:::widget flow
{
 "title": "The glial cells and their jobs",
 "layout": "tree",
 "nodes": [
  {
   "id": "g",
   "label": "Glia"
  },
  {
   "id": "as",
   "label": "Astrocytes",
   "parent": "g",
   "detail": "Feed neurons, mop up transmitters, help form the blood-brain barrier."
  },
  {
   "id": "ol",
   "label": "Oligodendrocytes",
   "parent": "g",
   "detail": "Make myelin in the brain and spinal cord; damaged in multiple sclerosis."
  },
  {
   "id": "sc",
   "label": "Schwann cells",
   "parent": "g",
   "detail": "Make myelin in peripheral nerves."
  },
  {
   "id": "mi",
   "label": "Microglia",
   "parent": "g",
   "detail": "Immune cells: clear debris, prune unused synapses; studied in schizophrenia and inflammation."
  }
 ],
 "caption": "Glia are about as numerous as neurons and do far more than hold them together."
}
:::

### How a neuron fires
At rest, the inside of a neuron is slightly negative compared with the outside, about minus 70 millivolts. This is the **resting potential**. It is kept up by pumps that push sodium out and pull potassium in.

When enough excitatory signals arrive, the voltage rises to a **threshold** (about minus 55 millivolts). Then sodium channels snap open, sodium rushes in, and the inside briefly turns positive. This spike is the **action potential**. Potassium then flows out and the cell resets. For a brief moment afterwards (the **refractory period**) it cannot fire again.

:::widget neuron
{
 "title": "Fire a neuron yourself",
 "myelinated": false,
 "caption": "Slide the input up slowly. Below threshold nothing travels; at threshold you get a full spike every time, never a half spike. Push harder and the spikes come more often. Then switch myelin on and watch the signal jump from node to node and arrive sooner."
}
:::


:::define All-or-none
An action potential either happens fully or not at all. A stronger stimulus does not make a bigger spike; it makes the neuron fire **more often**.
:::

:::widget guess
{
  "prompt": "In a thick, well-myelinated axon (for example a nerve to a leg muscle), how fast does the signal travel?",
  "min": 1,
  "max": 200,
  "unit": "metres per second",
  "answer": [70, 120],
  "reveal": "Up to about 120 metres per second, roughly the speed of a fast train. A thin axon with no myelin carries signals at only 1 or 2 metres per second, a slow walk. Myelin lets the signal jump from gap to gap instead of crawling along.",
  "clinician": "Saltatory conduction jumps between nodes of Ranvier. Large myelinated A-alpha fibres conduct at roughly 70 to 120 m/s; unmyelinated C fibres (slow, burning pain) at about 0.5 to 2 m/s. This is why a stubbed toe gives a sharp first pain followed a moment later by a dull ache."
}
:::

:::example When the insulation fails
Sneha, 29, a teacher in Pune, develops blurred vision in one eye, then months later numbness in her legs and low mood. MRI shows patches of lost myelin in the brain and spinal cord: **multiple sclerosis**. Signals leak and slow. Depression is common in MS, partly from the illness itself, not only as a reaction to it. A psychologist who knows this will not assume the low mood is "just adjustment".
:::

:::trap The 10 per cent myth
"We only use 10 per cent of our brain" is false. Imaging shows activity across the whole brain over a day, and damage to almost any area causes some problem. Use this as a quick test of popular "brain facts" in the media.
:::

:::clinician
The sodium-potassium ATPase uses a large share of neuronal energy, which is one reason the brain (about 2 per cent of body weight) uses about 20 per cent of resting energy and is so vulnerable to hypoxia and hypoglycaemia. Local anaesthetics and several anticonvulsants (carbamazepine, phenytoin, lamotrigine) block voltage-gated sodium channels, reducing high-frequency firing; this shared mechanism partly explains their mood-stabilising and neuropathic-pain uses. Microglial synaptic pruning (complement-tagged, involving C3 and C4) is now central to neurodevelopmental hypotheses of schizophrenia, discussed at the Advanced level.
:::

:::recall
1. Name the five parts of a neuron and what each does. || Dendrites receive; cell body sums and sustains; axon carries; myelin insulates and speeds; terminals release messengers.
2. What is the resting potential, and roughly what value? || The slight negative charge inside a resting neuron, about minus 70 millivolts.
3. What does "all-or-none" mean? || A neuron either fires a full action potential or none; stronger input raises firing rate, not spike size.
4. Name three types of glia and a job for each. || Astrocytes (support, clear transmitters, blood-brain barrier); oligodendrocytes (myelin in CNS); microglia (immune defence, pruning).
:::

:::mcq
Q: A stronger pain stimulus makes a sensory neuron:
- Fire bigger action potentials
- *Fire action potentials more often
- Stop firing
- Reverse its resting potential permanently
> Spike size is fixed (all-or-none); intensity is coded by firing rate.

Q: Which cells make myelin inside the brain?
- Microglia
- Astrocytes
- *Oligodendrocytes
- Schwann cells
> Oligodendrocytes in the CNS; Schwann cells in peripheral nerves.
:::

## 1.3 The synapse: how neurons talk [core][starting]
Neurons do not touch. Between the end of one and the start of the next is a tiny gap, the **synaptic cleft**. The electrical spike cannot jump it. Instead, the sending neuron releases a chemical messenger, a **neurotransmitter**, which crosses the gap and acts on the receiving neuron.

### Five steps of chemical transmission
1. **Make**: the neuron builds the transmitter from food building blocks (for example, serotonin from the amino acid tryptophan).
2. **Store**: the transmitter is packed into small bubbles called **vesicles**.
3. **Release**: the action potential reaches the terminal, calcium flows in, and vesicles empty into the gap.
4. **Bind**: the transmitter fits **receptors** on the receiving cell like a key in a lock.
5. **Stop**: the signal is ended by **reuptake** (a pump pulls the transmitter back into the sending neuron), by **enzymes** that break it down, or by simply drifting away.

:::mnemonic "Make, Store, Release, Bind, Stop"
Say it as a shopkeeper's day: **make** the sweets, **store** them in boxes, **release** them to customers, the customer **binds** (eats), and the shop **stops** at night and takes back what is left.
:::

:::widget synapse
{"drug": "none", "caption": "This is a serotonin synapse at rest. Follow one dot: released from the sending neuron, some reach the receptors below, and the recycling pump on the right pulls the rest back. Almost every medicine in psychiatry acts on one of these steps."}
:::


:::widget release
{
 "transmitter": "dopamine",
 "caption": "Step through one signal: the spike arrives, calcium enters, vesicles release dopamine, it binds, then the pump recycles it and MAO breaks some down. Now try amphetamine (it pushes dopamine out) and a receptor blocker (an antipsychotic). Which step does each change?"
}
:::

### Excitation and inhibition
Some transmitters make the receiving neuron **more** likely to fire (excitatory). Others make it **less** likely (inhibitory). A neuron receives thousands of inputs and adds them up. Health depends on balance: too much excitation and you get seizures; too much inhibition and you get sedation, slowed breathing and coma.

:::widget reveal
{"prompt": "Alcohol and sleeping pills like diazepam both boost the brain's main inhibitory messenger. Why is it so dangerous to take them together?", "answer": "Their effects add up on the same braking system. Together they can switch off the breathing centres in the brainstem. Many accidental deaths involve alcohol plus a sedative or an opioid."}
:::

:::widget decide
{
  "scene": "Arjun, 19, a student in Delhi, read online that depression is 'a chemical imbalance' and says, 'So I just need a pill to fix my serotonin. Therapy is pointless.'",
  "ask": "What is the most accurate and helpful reply?",
  "choices": [
    { "label": "“Yes, you have low serotonin. A pill will correct it.”", "verdict": "harm", "outcome": "He stops attending sessions and is disappointed when the medicine helps only partly.", "why": "No test measures a person's serotonin level, and the simple 'low serotonin' story is not supported. It also falsely suggests talking cannot change the brain." },
    { "label": "“Depression involves changes in brain chemistry, circuits and life stress together. Medicines and therapy both change the brain, in different ways.”", "verdict": "best", "outcome": "Arjun agrees to try both and asks good questions about how each works.", "why": "This is honest, and it keeps both doors open. Therapy produces measurable brain changes too." },
    { "label": "“Chemistry has nothing to do with it. It is all in your thoughts.”", "verdict": "harm", "outcome": "He feels blamed for being ill and avoids medicine that might have helped.", "why": "This is as wrong as the pill-only story, and it adds shame." }
  ]
}
:::

:::clinician
Calcium entry through voltage-gated calcium channels triggers vesicle fusion via the SNARE complex; botulinum and tetanus toxins cleave SNARE proteins, and gabapentinoids (pregabalin, gabapentin) bind the alpha-2-delta subunit of these channels to reduce release. On the serotonin hypothesis: the 2022 umbrella review by Moncrieff's group found no consistent evidence of reduced serotonin activity in depression. It was widely misreported as "antidepressants don't work". It did not test efficacy, and critics noted methodological limits. The fair position is that monoamine medicines work for many people, but probably not by "correcting a deficiency"; downstream plasticity and changes in emotional processing are better current accounts.
:::

:::recall
1. List the five steps of chemical transmission. || Make, store (vesicles), release (calcium-triggered), bind (receptors), stop (reuptake, enzymes, diffusion).
2. What triggers vesicles to release transmitter? || Calcium entering the terminal when the action potential arrives.
3. What happens if excitation far outweighs inhibition? || Seizures; the reverse gives sedation, slowed breathing and coma.
:::

:::mcq
Q: An SSRI mainly acts at which step of transmission?
- Making the transmitter
- Storing it in vesicles
- *Stopping the signal, by blocking reuptake
- Releasing calcium
> SSRIs block the serotonin reuptake pump, so serotonin stays longer in the gap.

Q: Which statement about "chemical imbalance" is most accurate?
- Doctors measure serotonin in the blood to diagnose depression
- *There is no test of a "serotonin level" for diagnosis, and the simple deficiency idea is not supported, though medicines that act on serotonin help many people
- Depression has no link to brain chemistry
- Therapy cannot change brain chemistry
> Honest science sits between both extremes.
:::

## 1.4 The big areas of the brain [core][starting]
Think of the brain in layers, from the oldest at the bottom to the newest at the top.

### From the bottom up
- **Brainstem** (medulla, pons, midbrain): breathing, heart rate, wakefulness. Damage here can be fatal.
- **Cerebellum**: balance, smooth movement, timing; also some thinking and emotion. Alcohol upsets it first, which is why drunk people sway.
- **Thalamus**: the relay station; almost every sense passes through it to the cortex.
- **Hypothalamus**: hunger, thirst, temperature, sex drive, sleep and the body's hormones (it controls the pituitary gland).
- **Limbic system**: a ring of structures for emotion and memory. The **amygdala** detects threat and emotional importance; the **hippocampus** stores new memories.
- **Basal ganglia**: start and smooth movement, form habits, and help pick which action to do next.
- **Cerebral cortex**: the wrinkled outer layer, divided into four lobes on each side.


:::widget brainmap
{
 "title": "Where the big parts sit",
 "focus": [
  "frontal",
  "parietal",
  "temporal",
  "occipital",
  "cerebellum",
  "brainstem",
  "thalamus",
  "hypothalamus"
 ],
 "notes": {
  "frontal": "Planning, judgement, self-control, movement, speech production on the left.",
  "parietal": "Touch, body sense, where things are in space.",
  "temporal": "Hearing, understanding language (left), memory and emotion.",
  "occipital": "Vision.",
  "cerebellum": "Balance, smooth movement, timing; also some thinking.",
  "brainstem": "Breathing, heart rate, wakefulness.",
  "thalamus": "The relay station for the senses.",
  "hypothalamus": "Hunger, thirst, temperature, sleep, hormones."
 },
 "caption": "Tap each region and say one symptom you would expect if it were damaged."
}
:::


:::widget illusion
{
 "kind": "ponzo",
 "caption": "Judge which line is longer, then measure. The visual cortex uses depth cues and 'corrects' for distance, so perception is a construction, not a camera. Damage to visual areas can change what is constructed."
}
:::

### The four lobes
| Lobe | Main jobs | If damaged |
|---|---|---|
| **Frontal** | Planning, judgement, self-control, movement, speech production (left) | Personality change, poor planning, disinhibition, weakness |
| **Parietal** | Touch, body sense, space, maths and reading-writing links | Neglect of one side, getting lost, trouble dressing |
| **Temporal** | Hearing, language understanding (left), memory, emotion | Memory loss, understanding speech poorly, seizures with odd feelings |
| **Occipital** | Vision | Loss of part of the visual field, visual hallucinations |


:::widget layers
{
 "title": "The brain from bottom to top",
 "shape": "stack",
 "layers": [
  {
   "label": "Cerebral cortex",
   "detail": "Four lobes: thinking, planning, senses, language."
  },
  {
   "label": "Limbic system and basal ganglia",
   "detail": "Emotion, memory, habits, choosing actions."
  },
  {
   "label": "Thalamus and hypothalamus",
   "detail": "Sensory relay; hunger, thirst, temperature, hormones."
  },
  {
   "label": "Cerebellum",
   "detail": "Balance, timing, smooth movement."
  },
  {
   "label": "Brainstem",
   "detail": "Breathing, heart rate, wakefulness. Damage here can be fatal."
  }
 ],
 "caption": "Older, life-support functions sit low; newer, flexible functions sit high. All levels work together."
}
:::

:::example Phineas Gage and a Mumbai bike accident
In 1848 an iron rod passed through the front of railway foreman Phineas Gage's head. He survived, but friends said he was "no longer Gage": rude, impulsive and unable to stick to plans. Today a young man in Mumbai after a bike crash with frontal contusions may show the same: he swears at his mother, spends his salary in a day, and cannot see what has changed. Frontal injury can alter personality while memory and IQ look normal.
:::

:::widget sort
{
  "prompt": "Match each problem to the lobe most likely damaged.",
  "buckets": ["Frontal", "Parietal", "Temporal", "Occipital"],
  "items": [
    { "text": "Eats only from the right half of the plate and ignores people on the left", "bucket": 1, "why": "Neglect of one side is a classic sign of right parietal damage." },
    { "text": "Since a head injury, makes crude jokes and is careless about money", "bucket": 0 },
    { "text": "Cannot form new memories, and has brief spells of déjà vu and lip-smacking", "bucket": 2 },
    { "text": "Sees flashing shapes and has lost the left half of vision in both eyes", "bucket": 3 },
    { "text": "Cannot plan a simple meal although she knows every step", "bucket": 0 },
    { "text": "Speaks fluently but makes no sense and does not understand questions", "bucket": 2, "why": "Wernicke's area, for understanding speech, lies in the left temporal lobe." }
  ]
}
:::

:::student
You will often hear "left brain is logical, right brain is creative". That is a myth. Both sides work together on almost everything. What is true is that, in most people, **language is mainly on the left** and **attention to space is stronger on the right**.
:::

:::clinician
The "triune brain" (reptilian, limbic, neocortex) is a teaching cartoon, not evolutionary fact; the cortex, basal ganglia and limbic structures evolved and work together. Language is left-lateralised in about 95 per cent of right-handers and roughly 70 per cent of left-handers. The cerebellum's role in cognition and affect is well established (Schmahmann's cerebellar cognitive affective syndrome: executive deficits, visuospatial problems, language change and blunted or disinhibited affect after posterior cerebellar lesions). The hypothalamus is the hinge between psychiatry and endocrinology: weight gain with antipsychotics, sleep disruption, and the HPA axis in stress all route through it.
:::

:::recall
1. What do the hippocampus and amygdala each do? || Hippocampus: forming new memories. Amygdala: detecting threat and emotional importance.
2. Name the four lobes with one job each. || Frontal (planning, self-control); parietal (body sense, space); temporal (hearing, memory, language understanding); occipital (vision).
3. What does the hypothalamus control? || Hunger, thirst, temperature, sleep, sex drive and hormones via the pituitary.
4. Why does a drunk person sway? || Alcohol disrupts the cerebellum, which coordinates balance and smooth movement.
:::

:::mcq
Q: After a stroke, Mrs Iyer, 68, ignores the left side of her body and denies anything is wrong. The most likely area affected is:
- Left frontal lobe
- *Right parietal lobe
- Left occipital lobe
- Cerebellum
> Left-sided neglect with denial points to the right (non-dominant) parietal lobe.

Q: Which structure is the main relay station for the senses on the way to the cortex?
- Hypothalamus
- *Thalamus
- Hippocampus
- Pons
> The thalamus relays sensory input to the cortex.
:::

## 1.5 Chemical messengers in plain words [core][starting]
There are over a hundred chemical messengers, but six do most of the work you will meet in psychiatry. Learn what each does in everyday words first.

| Messenger | In everyday words | When it goes wrong (simplified) |
|---|---|---|
| **Glutamate** | The main "go" signal | Too much: seizures, cell damage |
| **GABA** | The main "brake" | Too little: anxiety, seizures |
| **Dopamine** | Wanting, reward, movement, "this matters" | Too much in some paths: psychosis; too little in others: Parkinson's |
| **Serotonin** | Mood, worry, sleep, appetite, gut | Linked to depression, anxiety, OCD |
| **Noradrenaline** | Alertness, energy, stress response | Linked to anxiety, poor attention, low drive |
| **Acetylcholine** | Muscle movement, memory, attention | Lost in Alzheimer's disease |

:::analogy An orchestra, not a solo
No mood is "one chemical". Each messenger is a section of the orchestra. Depression is not "the violins are missing"; it is the whole piece being played differently. Medicines retune one section, and the rest of the orchestra adjusts.
:::

### Hormones are messengers too
Neurotransmitters act across a tiny gap in milliseconds. **Hormones** travel in the blood and act over minutes to days. **Cortisol** (stress), **thyroid hormone** (energy, mood), **melatonin** (sleep timing), **oxytocin** (bonding) and **oestrogen** and **testosterone** all shape mood and behaviour.

:::widget sort
{
  "prompt": "Which messenger is mainly involved?",
  "buckets": ["GABA", "Dopamine", "Acetylcholine", "Serotonin"],
  "items": [
    { "text": "Diazepam calms an anxious patient", "bucket": 0 },
    { "text": "A man with Parkinson's disease has a shuffling walk and tremor", "bucket": 1 },
    { "text": "Memory medicines for Alzheimer's (donepezil) stop this messenger being broken down", "bucket": 2 },
    { "text": "Fluoxetine for depression and OCD", "bucket": 3 },
    { "text": "Antipsychotic medicines block its receptors", "bucket": 1 },
    { "text": "Alcohol withdrawal causes shaking and seizures because this brake is suddenly weak", "bucket": 0 }
  ]
}
:::


:::widget compare
{
 "title": "Neurotransmitters and hormones",
 "a": {
  "label": "Neurotransmitter",
  "points": [
   "Released into the synaptic gap",
   "Acts on the next cell",
   "Milliseconds",
   "Glutamate, GABA, dopamine, serotonin"
  ],
  "summary": "Fast, local messages."
 },
 "b": {
  "label": "Hormone",
  "points": [
   "Released into the blood",
   "Acts throughout the body",
   "Minutes to days",
   "Cortisol, thyroxine, melatonin, oestrogen"
  ],
  "summary": "Slow, widespread messages."
 },
 "caption": "Some chemicals are both: noradrenaline, oxytocin and vasopressin."
}
:::

:::example A thyroid lesson from Lucknow
Shabana, 41, has felt tired, slow, cold and low for a year; she has gained weight and her thinking feels foggy. She was told it was depression. A simple blood test shows an underactive thyroid. With thyroxine, most of her "depression" lifts. Always think of the body's hormones, especially in women in mid-life, and after childbirth.
:::

:::clinician
Distinguish classical small-molecule transmitters (amino acids, monoamines, acetylcholine) from neuropeptides (substance P, neuropeptide Y, orexin, oxytocin, CRH), gaseous messengers (nitric oxide) and lipid messengers (endocannabinoids, which signal backwards from the postsynaptic to the presynaptic neuron). Co-release is the rule: a single neuron may release a small-molecule transmitter and a peptide. Hypothyroidism, hyperparathyroidism (hypercalcaemia), Cushing's syndrome, Addison's disease, B12 deficiency and anaemia are the medical "depression mimics" to screen for; in India add the high prevalence of vitamin D and B12 deficiency, particularly in vegetarians.
:::

:::recall
1. Which messenger is the brain's main "go" signal and which is its main "brake"? || Glutamate is the main excitatory transmitter; GABA is the main inhibitory one.
2. Which messenger is lost in Alzheimer's disease? || Acetylcholine.
3. How do hormones differ from neurotransmitters? || Hormones travel in the blood and act over minutes to days; transmitters act across the synapse in milliseconds.
:::

:::mcq
Q: A patient in alcohol withdrawal is shaky and has a seizure. The best explanation is:
- Too much dopamine
- *Weakened GABA braking after the brain adapted to alcohol
- Too little glutamate
- Too much acetylcholine
> Chronic alcohol boosts GABA; the brain compensates, so stopping suddenly leaves the brakes weak and glutamate unopposed.
:::

`;

export const s1Check = String.raw`
## 1.8 Level check · Starting [core][starting]
Score 80% or more to open the Beginner level.

:::mcq
Q: The brain and spinal cord together form the:
- Peripheral nervous system
- *Central nervous system
- Autonomic nervous system
- Somatic nervous system
> CNS is brain plus spinal cord.

Q: Which part of a neuron receives incoming signals?
- Axon
- *Dendrites
- Myelin
- Axon terminal
> Dendrites are the receiving branches.

Q: The fatty coating that speeds up nerve signals is:
- Synaptic cleft
- Vesicle
- *Myelin
- Dendrite
> Myelin insulates axons and allows signals to jump.

Q: At rest, the inside of a neuron is:
- Strongly positive
- *Slightly negative
- Exactly neutral
- Filled with calcium
> The resting potential is about minus 70 millivolts.

Q: Neurotransmitters are stored in small bubbles called:
- Receptors
- *Vesicles
- Synapses
- Nodes
> Vesicles hold the transmitter until release.

Q: Which is NOT a way a signal at the synapse is stopped?
- Reuptake into the sending neuron
- Breakdown by enzymes
- Drifting away from the gap
- *Myelin wrapping the gap
> Myelin wraps axons, not synapses.

Q: The structure most needed to form new long-term memories is the:
- Cerebellum
- Amygdala
- *Hippocampus
- Occipital lobe
> The hippocampus lays down new memories.

Q: Pounding heart, dilated pupils and dry mouth in fear come from the:
- Parasympathetic system
- *Sympathetic system
- Cerebellum
- Somatic system
> Fight-or-flight is sympathetic.

Q: A man after a frontal head injury becomes impulsive, rude and poor at planning, but his memory tests are normal. This fits damage to the:
- Occipital lobe
- *Frontal lobe
- Cerebellum
- Brainstem
> Frontal lobes govern judgement, planning and self-control.

Q: The brain's main inhibitory (brake) transmitter is:
- Glutamate
- Dopamine
- *GABA
- Noradrenaline
> GABA is the main inhibitory transmitter.

Q: Which messenger is most linked to reward, wanting and movement?
- Acetylcholine
- *Dopamine
- GABA
- Melatonin
> Dopamine carries reward, salience and movement signals.

Q: A stronger stimulus makes a neuron:
- Fire a bigger spike
- *Fire more often
- Change its transmitter
- Lose its myelin
> All-or-none: intensity is coded by rate.

Q: Which gland, controlled by the hypothalamus, directs most other hormone glands?
- Thyroid
- *Pituitary
- Adrenal
- Pineal
> The pituitary is the master gland under hypothalamic control.

Q: A woman's tiredness, weight gain and low mood improve with thyroxine. What lesson does this teach?
- Depression is always a thyroid problem
- *Physical illnesses can look like depression, so screen for them
- Medicines never help mood
- Thyroid hormone is a neurotransmitter
> Hypothyroidism is a classic depression mimic.

Q: Which statement is a myth?
- Language is mainly on the left side in most people
- Damage to almost any brain area causes some problem
- *We use only 10 per cent of our brain
- The cerebellum helps balance
> The 10 per cent claim is false.

Q: The ventricles of the adult brain develop from:
- The neural crest
- *The hollow centre of the neural tube
- The meninges
- The circle of Willis
> The tube's cavity persists as the ventricles and central canal.

Q: Peripheral nerves and their supporting Schwann cells come mostly from the:
- Neural tube
- *Neural crest
- Choroid plexus
- Cerebellum
> Cells that pinch off the folds form most of the peripheral nervous system.

Q: Sensory information enters the spinal cord through the:
- Ventral (front) root
- *Dorsal (back) root
- Vagus nerve
- Corpus callosum
> Back root in, front root out.

Q: Which cranial nerve controls the muscles of facial expression?
- V Trigeminal
- *VII Facial
- X Vagus
- XII Hypoglossal
> The trigeminal gives facial feeling and chewing; the facial nerve moves the face.

Q: CSF is made mainly by the:
- Arachnoid mater
- *Choroid plexus in the ventricles
- Pineal gland
- Liver
> About 500 mL a day, mainly from the choroid plexus.

Q: The commonest type of stroke is caused by:
- Bleeding from a burst artery
- *A blocked artery (ischaemic)
- Infection of the meninges
- Low blood sugar
> About 85 per cent of strokes are ischaemic.

Q: Which method would best show whether a confused older patient is having seizures that nobody can see?
- CT
- *EEG
- Twin study
- Functional MRI
> Only EEG records the brain's electrical activity directly.

Q: Taxi drivers who learned a huge street map had a larger rear hippocampus than bus drivers. The best conclusion is that:
- People with big hippocampi become taxi drivers
- *Experience can change brain structure (neuroplasticity)
- Driving shrinks the brain
- The hippocampus is only for driving
> Growth related to years of navigating, and a trainee study confirmed it came with learning.

Q: A baby with cataracts in both eyes should have surgery early because:
- Cataracts spread to the brain
- *Vision depends on a sensitive period when the visual cortex wires up
- Babies feel no pain from surgery
- Older children cannot be operated on
> Delay leaves lasting visual loss even after the lens is cleared.
:::
`;

export const b2Overview = String.raw`
## 2.3 Neurotransmitters and receptors in depth [core][beginner]
At the Starting level you met six messengers. Now look at **where** each comes from, **what receptors** it acts on and **which medicines** change it. This table is the backbone of psychopharmacology.

| Transmitter | Made from, made where | Key receptors | Medicines and drugs that act on it |
|---|---|---|---|
| **Glutamate** | Glutamine; everywhere in the cortex | NMDA, AMPA, kainate (ion channels); mGluR (slow) | Ketamine and memantine block NMDA; lamotrigine reduces release |
| **GABA** | Glutamate (by the enzyme GAD); interneurons everywhere | GABA-A (chloride channel), GABA-B | Benzodiazepines, Z-drugs, barbiturates, alcohol (GABA-A); baclofen (GABA-B); valproate raises GABA |
| **Dopamine** | Tyrosine to L-DOPA to dopamine; substantia nigra, ventral tegmental area, hypothalamus | D1-like (D1, D5), D2-like (D2, D3, D4) | Antipsychotics block D2; aripiprazole is a partial agonist; stimulants and cocaine raise it; levodopa replaces it |
| **Noradrenaline** | From dopamine; locus coeruleus in the pons | Alpha-1, alpha-2, beta | SNRIs, TCAs, mirtazapine (alpha-2 block), clonidine (alpha-2 agonist), propranolol (beta block) |
| **Serotonin (5-HT)** | Tryptophan; raphe nuclei in the brainstem | 5-HT1A, 5-HT2A, 5-HT2C, 5-HT3 and more (14 types) | SSRIs, SNRIs, buspirone (1A), atypical antipsychotics (2A block), LSD and psilocybin (2A agonists), ondansetron (3 block) |
| **Acetylcholine** | Choline; basal forebrain (nucleus basalis of Meynert), brainstem | Nicotinic (ion channel), muscarinic M1 to M5 | Donepezil, rivastigmine, galantamine (block breakdown); anticholinergics such as trihexyphenidyl; nicotine |
| **Histamine** | Histidine; tuberomammillary nucleus of the hypothalamus | H1 to H4 | Many antipsychotics and antidepressants block H1 (sleepiness, weight gain); promethazine |

### Two kinds of receptor
- **Ion-channel receptors (ionotropic)** are gates. The transmitter binds and the gate opens in milliseconds. GABA-A, NMDA, AMPA and nicotinic receptors work this way. They give fast signals.
- **G-protein receptors (metabotropic)** are switches that start a chain of reactions inside the cell. They are slower (hundreds of milliseconds to minutes) and can change gene activity. Dopamine, serotonin (except 5-HT3), noradrenaline and muscarinic receptors work this way.

:::trap Two traps in one table
**5-HT3** is the only serotonin receptor that is an ion channel (that is why it gives fast nausea, and why ondansetron helps). And noradrenaline is made **from** dopamine, so a problem early in the chain (for example low tyrosine hydroxylase activity) affects both.
:::

:::widget sort
{
  "prompt": "Fast gate or slow switch? Sort each receptor.",
  "buckets": ["Ion channel (fast)", "G-protein (slow)"],
  "items": [
    { "text": "GABA-A", "bucket": 0 },
    { "text": "Dopamine D2", "bucket": 1 },
    { "text": "NMDA glutamate", "bucket": 0 },
    { "text": "Serotonin 5-HT1A", "bucket": 1 },
    { "text": "Serotonin 5-HT3", "bucket": 0, "why": "The odd one out among serotonin receptors, which is why it carries fast nausea signals." },
    { "text": "Muscarinic M1", "bucket": 1 },
    { "text": "Nicotinic acetylcholine", "bucket": 0 }
  ]
}
:::


:::widget receptor
{
 "receptor": "5-HT1A",
 "caption": "Serotonin is the full agonist here. Buspirone, used for anxiety, is a partial agonist: it gives a steadier, smaller signal. Compare how the signal bar changes with an antagonist."
}
:::

### Side effects you can predict from receptors
If you know what a medicine blocks, you can predict much of how it will feel to the patient:
- **H1 block**: sleepiness, weight gain.
- **Muscarinic block** (anticholinergic): dry mouth, blurred vision, constipation, urinary retention, confusion in older people.
- **Alpha-1 block**: dizziness on standing (postural hypotension), falls.
- **D2 block**: stiffness, restlessness, raised prolactin.


:::widget synapse
{
 "drug": "snri",
 "caption": "An SNRI blocks the serotonin pump and, at higher doses, the noradrenaline pump. Noradrenaline adds energy and pain relief, but also sweating and a raised pulse and blood pressure. Let time pass to see why benefit is slow."
}
:::

:::mnemonic Anticholinergic signs: "dry as a bone, red as a beet, blind as a bat, mad as a hatter, hot as a hare"
Dry skin and mouth, flushing, blurred vision (wide pupils), confusion and delirium, fever. Seen in overdose of TCAs, trihexyphenidyl and some herbal "datura" poisonings in rural India.
:::

:::widget worked
{
  "title": "Predicting side effects from the receptor profile",
  "steps": [
    { "q": "Amitriptyline blocks serotonin and noradrenaline reuptake, and also blocks H1, muscarinic and alpha-1 receptors. What will an older patient feel in the first week?", "a": "Sleepy (H1), dry mouth, constipation and possibly confusion (muscarinic), dizzy on standing and at risk of falls (alpha-1). Mood benefit comes later." },
    { "q": "Why is amitriptyline dangerous in overdose?", "a": "It also blocks sodium channels in the heart, widening the QRS complex and causing arrhythmias, on top of anticholinergic delirium and seizures." },
    { "q": "Sertraline blocks serotonin reuptake with little action at H1, muscarinic or alpha-1. What changes?", "a": "Far less sedation, dryness and dizziness; early nausea and loose stools instead (serotonin in the gut, 5-HT3); much safer in overdose." }
  ],
  "yourTurn": [
    { "q": "Olanzapine blocks D2, 5-HT2A, H1, muscarinic and 5-HT2C receptors. Predict two problems a young man will notice in the first month.", "a": "Sleepiness (H1) and increased appetite with weight gain (H1 plus 5-HT2C block). Also possible dry mouth (muscarinic). Stiffness is less common than with older antipsychotics because of 5-HT2A block." }
  ]
}
:::

:::clinician
Receptor affinity is usually quoted as Ki (lower Ki means tighter binding), and clinical effect depends on affinity relative to achieved concentration, so a "weak" H1 affinity can still matter at high doses. Useful clinical patterns: mirtazapine's sedation is more prominent at low doses (H1 dominance) and lessens as noradrenergic effects rise with dose; quetiapine is a sedative antihistamine at 25 to 100 mg but needs 300 mg or more for antipsychotic D2 occupancy; low-dose quetiapine for sleep carries metabolic risk without clear benefit and should not be routine. Serotonin-noradrenaline synthesis: tryptophan hydroxylase is the rate-limiting step for serotonin and tyrosine hydroxylase for catecholamines. MAO-A prefers serotonin and noradrenaline; MAO-B prefers dopamine and phenylethylamine (selegiline, rasagiline in Parkinson's).
:::

:::recall
1. What are the two main kinds of receptor and how do they differ? || Ion channels (ionotropic): fast gates. G-protein (metabotropic): slower switches that start chemical chains and can change gene activity.
2. Which serotonin receptor is an ion channel, and which medicine blocks it? || 5-HT3; ondansetron.
3. Predict the side effects of muscarinic blockade. || Dry mouth, blurred vision, constipation, urinary retention, confusion, especially in the elderly.
4. Where is noradrenaline mainly made in the brain? || The locus coeruleus in the pons.
:::

:::mcq
Q: A 72-year-old started on a medicine becomes dizzy on standing and falls in the bathroom at night. Blockade of which receptor most likely explains this?
- H1
- *Alpha-1
- 5-HT3
- D2
> Alpha-1 blockade causes postural hypotension and falls.

Q: Which pair is correct?
- Raphe nuclei: dopamine
- *Locus coeruleus: noradrenaline
- Substantia nigra: acetylcholine
- Nucleus basalis of Meynert: serotonin
> Raphe makes serotonin; substantia nigra makes dopamine; nucleus basalis makes acetylcholine.

Q: Benzodiazepines mainly act at:
- NMDA receptors
- *GABA-A receptors
- D2 receptors
- 5-HT1A receptors
> They enhance GABA-A chloride channel opening.
:::

`;

export const b2Dopamine = String.raw`
## 2.6 Dopamine pathways and what blocking them does [core][beginner]
Dopamine neurons are few, perhaps a few hundred thousand, but they send long branches across the brain along four main roads. One medicine that blocks D2 receptors blocks them on **all four roads** at once. That is why antipsychotics help some symptoms and cause others.

| Pathway | From, to | Normal job | Too much dopamine | Blocking D2 here |
|---|---|---|---|---|
| **Mesolimbic** | Ventral tegmental area to nucleus accumbens and limbic areas | Reward, salience ("this matters") | Positive symptoms: delusions, hallucinations | Reduces positive symptoms (the wanted effect) |
| **Mesocortical** | Ventral tegmental area to prefrontal cortex | Motivation, thinking, emotion | (Too little here may cause negative and cognitive symptoms) | Can worsen apathy and slowed thinking |
| **Nigrostriatal** | Substantia nigra to striatum (basal ganglia) | Movement | Involuntary movements (for example from levodopa) | Extrapyramidal side effects: stiffness, tremor, restlessness, dystonia |
| **Tuberoinfundibular** | Hypothalamus to pituitary | Keeps prolactin low | | Raised prolactin: breast swelling, milk, missed periods, sexual problems |

:::mnemonic "My Mother Never Talks"
**M**esolimbic, **M**esocortical, **N**igrostriatal, **T**uberoinfundibular. And the effects in the same order: **positive** symptoms, **negative** symptoms, **movement**, **milk** (prolactin).
:::

:::widget guess
{
  "prompt": "Brain scans show antipsychotics work best when they block a certain share of D2 receptors in the striatum. Too little and psychosis persists; too much and stiffness appears. What share works best?",
  "min": 0,
  "max": 100,
  "unit": "per cent of D2 receptors",
  "answer": [60, 80],
  "reveal": "About 65 to 80 per cent. Below that, the medicine often does not work. Above about 80 per cent, stiffness and restlessness become likely, and prolactin rises. This is why higher doses are not automatically better.",
  "clinician": "PET studies found clinical response likely above about 65 per cent striatal D2 occupancy, prolactin elevation above about 72 per cent and extrapyramidal symptoms above about 78 per cent. Clozapine and quetiapine are effective at lower and more transient occupancy, part of the 'fast-off' hypothesis. Aripiprazole reaches very high occupancy without EPS because it is a partial agonist."
}
:::

:::widget decide
{
  "scene": "Kiran, 24, in Hyderabad, was started on haloperidol for a first episode of psychosis three days ago. Today his neck is twisted to one side, his eyes roll upward and he is terrified. His family thinks he is 'possessed'.",
  "ask": "What is happening and what should happen next?",
  "choices": [
    { "label": "Acute dystonia from D2 blockade in the nigrostriatal pathway; urgent anticholinergic injection, then review the medicine", "verdict": "best", "outcome": "An injection of promethazine or an anticholinergic relieves it within minutes. The team explains the cause and switches to a lower-risk antipsychotic. Kiran is willing to keep taking treatment.", "why": "Acute dystonia is a common early side effect of strong D2 blockers, worst in young men. Fast relief and an honest explanation protect future adherence." },
    { "label": "Tell the family it is part of the illness and increase haloperidol", "verdict": "harm", "outcome": "The spasm worsens; Kiran refuses all medicine afterwards.", "why": "Mislabelling a side effect as illness and raising the dose is dangerous. Laryngeal dystonia can block the airway." },
    { "label": "Stop all medicine and wait", "verdict": "ok", "outcome": "The dystonia eases over hours, but his psychosis returns within weeks.", "why": "Stopping removes the cause but leaves him untreated and suffering now. Treat the dystonia, then adjust, do not abandon, treatment." }
  ]
}
:::


:::widget pathways
{
 "system": "dopamine",
 "caption": "Switch on a D2 blocker and watch all four roads change at once: fewer delusions (mesolimbic), more apathy (mesocortical), stiffness (nigrostriatal) and raised prolactin (tuberoinfundibular). Then add serotonin 2A block, as with second-generation drugs, and see which side effects ease."
}
:::

### Extrapyramidal side effects in time order
- **Acute dystonia**: hours to days. Painful muscle spasms of the neck, eyes (oculogyric crisis), tongue or jaw.
- **Parkinsonism**: days to weeks. Stiffness, tremor, slow movement, mask-like face.
- **Akathisia**: days to weeks. A terrible inner restlessness; the patient cannot sit still. It can raise suicide risk and is often missed as "agitation".
- **Tardive dyskinesia**: months to years. Repetitive movements of the mouth, tongue and face; may be permanent.


:::widget brainmap
{
 "title": "Where the dopamine roads start and end",
 "focus": [
  "brainstem",
  "basal-ganglia",
  "prefrontal",
  "hypothalamus"
 ],
 "notes": {
  "brainstem": "The ventral tegmental area and substantia nigra in the midbrain hold the dopamine cell bodies.",
  "basal-ganglia": "The striatum: target of the nigrostriatal road (movement) and part of the mesolimbic road (nucleus accumbens, reward).",
  "prefrontal": "Target of the mesocortical road: motivation and thinking.",
  "hypothalamus": "Start of the tuberoinfundibular road to the pituitary: keeps prolactin low."
 },
 "caption": "Tap each region and name the side effect if D2 receptors there are blocked."
}
:::

:::safety Neuroleptic malignant syndrome
Rare but life-threatening: high fever, severe rigidity, confusion, unstable blood pressure and pulse, and very high creatine kinase. Stop the antipsychotic and send to emergency medical care at once.
:::

:::clinician
Hypotheses beyond the four pathways: Howes and Kapur's revised dopamine hypothesis locates the main abnormality in increased presynaptic dopamine synthesis and release, mainly in the associative (dorsal) striatum rather than the classic limbic striatum, with aberrant salience as the bridge to delusion formation. There is a fifth, often-forgotten pathway: thalamic dopamine. D2 blockade in the pituitary raises prolactin because dopamine is the prolactin-inhibiting factor; risperidone, paliperidone and amisulpride raise prolactin most because they cross the blood-brain barrier poorly and so reach high pituitary occupancy relative to striatal occupancy. Long-term hyperprolactinaemia carries risks of osteoporosis and sexual dysfunction; ask about these directly, since Indian patients rarely volunteer them. Tardive dyskinesia now has licensed VMAT2 inhibitors in some countries (valbenazine, deutetrabenazine; tetrabenazine is older and more widely available).
:::

:::recall
1. Name the four dopamine pathways with origin and target. || Mesolimbic (VTA to nucleus accumbens), mesocortical (VTA to prefrontal cortex), nigrostriatal (substantia nigra to striatum), tuberoinfundibular (hypothalamus to pituitary).
2. Which pathway's blockade gives raised prolactin? || Tuberoinfundibular.
3. List the four extrapyramidal side effects in time order. || Acute dystonia, parkinsonism, akathisia, tardive dyskinesia.
4. Why is akathisia dangerous? || It is distressing, often missed as agitation, and linked with non-adherence and raised suicide risk.
:::

:::mcq
Q: A woman on risperidone has missed her periods and has milk discharge. Which pathway explains this?
- Mesolimbic
- Nigrostriatal
- *Tuberoinfundibular
- Mesocortical
> D2 block at the pituitary removes dopamine's brake on prolactin.

Q: A man on an antipsychotic paces the ward, says he "can't stay in his skin" and keeps standing up. This is most likely:
- Tardive dyskinesia
- *Akathisia
- Worsening psychosis only
- Acute dystonia
> Inner restlessness with an urge to move is akathisia.
:::

`;

export const b3Lobes = String.raw`
## 3.5 The lobes in the clinic: frontal syndromes and language [core][beginner]
When you meet a patient whose personality has changed, whose speech is odd or who gets lost, a rough idea of **where** the problem is helps you decide **who** needs to see them.


:::widget brainmap
{
 "title": "Three parts of the frontal lobe, three syndromes",
 "focus": [
  "prefrontal",
  "frontal",
  "motor",
  "basal-ganglia",
  "thalamus"
 ],
 "notes": {
  "prefrontal": "Dorsolateral prefrontal cortex: planning, working memory, flexible thinking. Underside (orbitofrontal): social judgement and impulse control. Inner surface: drive and initiation.",
  "frontal": "The whole frontal lobe links to deep structures in loops, so a lesion anywhere on the loop can look 'frontal'.",
  "motor": "Primary motor cortex: weakness of the opposite side if damaged.",
  "basal-ganglia": "Part of each frontal loop; caudate damage in Huntington's disease gives frontal-type changes.",
  "thalamus": "Closes the loop back to the cortex; thalamic strokes can cause apathy and memory problems."
 },
 "caption": "Tap each area and link it to one bedside sign: perseveration, disinhibition or apathy."
}
:::

### Three frontal syndromes
| Syndrome | Area | What you see | A quick bedside test |
|---|---|---|---|
| **Dorsolateral (dysexecutive)** | Side of the frontal lobe | Poor planning, rigid thinking, perseveration (stuck on one answer), poor working memory | Verbal fluency (words starting with one letter in a minute); trail making; Luria hand sequence |
| **Orbitofrontal (disinhibited)** | Underside, above the eyes | Impulsive, tactless, joking inappropriately, poor judgement, sexual disinhibition | Observe social behaviour; ask relatives; go/no-go task |
| **Medial (apathetic)** | Inner surface, including the anterior cingulate | Apathy, little speech or movement, reduced initiative; at worst akinetic mutism | Observe; slow responses; ask about initiation at home |

:::student
Frontal problems hide well in a short interview. The person may chat politely and pass a simple memory test, then go home and spend the family's savings. **Always ask someone who knows the person** what has changed.
:::


:::widget brainmap
{
 "title": "The language areas",
 "focus": [
  "broca",
  "wernicke",
  "temporal",
  "frontal"
 ],
 "notes": {
  "broca": "Left inferior frontal gyrus: producing speech. Damage gives slow, effortful, telegraphic speech.",
  "wernicke": "Left posterior superior temporal gyrus: understanding speech. Damage gives fluent but empty speech with poor comprehension.",
  "temporal": "The arcuate fasciculus runs under the cortex from Wernicke's back to Broca's area; damage there spares understanding but ruins repetition (conduction aphasia).",
  "frontal": "Areas around Broca's area, if damaged while Broca's itself is spared, give transcortical motor aphasia with repetition preserved."
 },
 "caption": "Most people's language areas are on the left. Tap Broca's and Wernicke's areas and predict what each patient would sound like."
}
:::

### Language: the aphasias
**Aphasia** is a problem with language itself, not with moving the mouth (that is **dysarthria**). Most aphasias come from left-hemisphere damage.

| Aphasia | Speech | Understanding | Repetition | Lesion |
|---|---|---|---|---|
| **Broca's (expressive)** | Slow, effortful, few words, "telegraphic" | Mostly preserved | Poor | Left inferior frontal gyrus |
| **Wernicke's (receptive)** | Fluent but empty, wrong words, made-up words | Poor | Poor | Left posterior superior temporal gyrus |
| **Conduction** | Fluent, some wrong sounds | Good | Very poor | Arcuate fasciculus (link between the two) |
| **Global** | Almost none | Poor | Poor | Large left hemisphere lesion |
| **Transcortical motor** | Non-fluent | Good | **Preserved** | Around Broca's area |
| **Transcortical sensory** | Fluent | Poor | **Preserved** | Around Wernicke's area |
| **Anomic** | Fluent, word-finding pauses | Good | Good | Many sites; common in early dementia |

:::trap Wernicke's aphasia is often mistaken for psychosis
Fluent nonsense with made-up words can look like the "word salad" of schizophrenia. Clues to aphasia: sudden onset in an older person, vascular risk factors, other neurological signs, poor comprehension of simple commands, and frustration when not understood. This mistake sends stroke patients to psychiatry wards.
:::

:::widget sort
{
  "prompt": "Name the aphasia from the speech sample.",
  "buckets": ["Broca's", "Wernicke's", "Conduction", "Anomic"],
  "items": [
    { "text": "“Walk... dog... park... yesterday.” He understands everything and is frustrated.", "bucket": 0 },
    { "text": "“The flinkle went over the tabber and my sister chooped it fine, you know?” She does not follow simple commands.", "bucket": 1 },
    { "text": "Speaks fluently and understands, but cannot repeat “no ifs, ands or buts”.", "bucket": 2 },
    { "text": "“I need the... the thing you write with... you know... pen!” Otherwise normal.", "bucket": 3 }
  ]
}
:::

### Parietal, temporal and occipital signs
- **Dominant (usually left) parietal**: **Gerstmann syndrome**, four signs: cannot write (agraphia), cannot calculate (acalculia), cannot name fingers (finger agnosia), confuses left and right.
- **Non-dominant (usually right) parietal**: neglect of the left side, dressing apraxia, getting lost, and **anosognosia** (unaware of the deficit).
- **Temporal**: memory problems; temporal lobe seizures with déjà vu, rising feelings in the stomach, smells, lip-smacking; bilateral damage to the amygdala can cause **Klüver-Bucy syndrome** (placidity, putting things in the mouth, hypersexuality).
- **Occipital**: loss of half the visual field; **Anton syndrome** (cortically blind but denies it); vivid visual hallucinations.

:::widget worked
{
  "title": "Localising from the bedside",
  "steps": [
    { "q": "Mr Kapoor, 64, a right-handed retired engineer in Chandigarh, suddenly cannot do simple sums, writes poorly, calls his index finger 'thumb' and confuses left and right. Which syndrome?", "a": "Gerstmann syndrome: agraphia, acalculia, finger agnosia, left-right confusion." },
    { "q": "Where is the lesion?", "a": "Dominant (left) parietal lobe, around the angular gyrus." },
    { "q": "What does the sudden onset suggest, and what should happen?", "a": "A stroke. This needs urgent neurological assessment and imaging, not a psychiatric label." }
  ],
  "yourTurn": [
    { "q": "Mrs Thomas, 70, after a stroke shaves only the right side of her face, cannot put on her blouse correctly, and insists her left arm is fine though it is weak. Localise.", "a": "Non-dominant (right) parietal lobe: left neglect, dressing apraxia and anosognosia." }
  ]
}
:::

:::clinician
Frontal circuits are best understood as frontal-subcortical loops: dorsolateral, orbitofrontal and anterior cingulate circuits each run cortex to striatum to globus pallidus to thalamus and back, so lesions anywhere on the loop (for example the caudate in Huntington's disease, or thalamic strokes) can produce a "frontal" syndrome. Behavioural variant frontotemporal dementia often first presents to psychiatry with disinhibition, apathy, loss of empathy, compulsive behaviour and dietary change (sweet craving), frequently misdiagnosed as late-onset mania or depression; the Rascovsky 2011 criteria require three of six features for possible bvFTD. Executive tests in India need care: verbal fluency norms vary by language and education, and trail making assumes familiarity with the Latin alphabet; the colour trails test is a common alternative.
:::

:::recall
1. Name the three frontal syndromes and their key features. || Dorsolateral (dysexecutive, perseveration); orbitofrontal (disinhibition, poor judgement); medial (apathy, akinetic mutism).
2. In which aphasias is repetition preserved? || Transcortical motor and transcortical sensory (and anomic).
3. List the four signs of Gerstmann syndrome and the lesion site. || Agraphia, acalculia, finger agnosia, left-right disorientation; dominant parietal (angular gyrus).
4. What is anosognosia? || Lack of awareness of one's own deficit, typical of non-dominant parietal lesions.
:::

:::mcq
Q: A 66-year-old with diabetes suddenly speaks in fluent nonsense with made-up words and cannot follow "close your eyes". He is brought to the psychiatry clinic. The best next step is:
- Start an antipsychotic for late-onset schizophrenia
- *Urgent neurological assessment for a possible left temporal stroke (Wernicke's aphasia)
- Reassure that it is age-related forgetfulness
- Refer for psychotherapy
> Sudden fluent aphasia in a vascular-risk patient is a stroke until proved otherwise.

Q: Which test is most sensitive to dorsolateral frontal dysfunction?
- Naming a pen and a watch
- *Verbal fluency and set-shifting tasks
- Reading a sentence aloud
- Visual acuity
> Fluency and shifting tasks probe executive function.
:::

`;

export const b3Memory = String.raw`
## 3.7 Memory systems [core][beginner]
"Memory" is not one thing. Patients can lose one kind and keep another, and the pattern tells you where the damage is.


:::widget memoryflow
{
 "caption": "Follow information from the senses into working memory and long-term memory. Attention lets it in, rehearsal and meaningful encoding keep it, and retrieval brings it back. Henry Molaison lost the encoding step into long-term explicit memory."
}
:::

### The main systems
- **Working memory**: holding something in mind for seconds while using it (a phone number while you dial). Frontal and parietal cortex.
- **Explicit (declarative) memory**: what you can consciously recall.
  - **Episodic**: events from your life (your cousin's wedding). Hippocampus and medial temporal lobe.
  - **Semantic**: facts and meanings (Delhi is the capital). Temporal cortex, especially the front.
- **Implicit (non-declarative) memory**: shown by doing, not telling.
  - **Procedural**: skills such as cycling or typing. Basal ganglia and cerebellum.
  - **Priming** and **conditioning**: learning without awareness. Cortex and amygdala.


:::widget attention
{
 "caption": "Working memory starts with attention. Attend to one ear, then hear your name in the other. Which theory of selective attention explains that?"
}
:::

:::example Henry Molaison, the man who could not make new memories
In 1953 Henry Molaison (known for decades as "H.M.") had both medial temporal lobes removed to treat severe epilepsy. His seizures improved, but he could no longer form new long-term memories of events or facts. He could still learn new skills, such as tracing a star in a mirror, getting better each day while insisting he had never done it. His case proved that memory has separate systems and that the hippocampus is needed to form new explicit memories.
:::


:::widget flow
{
 "title": "The memory systems as a family tree",
 "layout": "tree",
 "nodes": [
  {
   "id": "m",
   "label": "Long-term memory"
  },
  {
   "id": "e",
   "label": "Explicit (declarative)",
   "parent": "m",
   "detail": "What you can consciously recall. Needs the hippocampus to form new memories."
  },
  {
   "id": "i",
   "label": "Implicit (non-declarative)",
   "parent": "m",
   "detail": "Shown by doing, not telling. Survives hippocampal damage."
  },
  {
   "id": "ep",
   "label": "Episodic",
   "parent": "e",
   "detail": "Events from your life, tied to a time and place."
  },
  {
   "id": "se",
   "label": "Semantic",
   "parent": "e",
   "detail": "Facts and meanings, stored widely in the temporal cortex."
  },
  {
   "id": "pr",
   "label": "Procedural",
   "parent": "i",
   "detail": "Skills and habits: basal ganglia and cerebellum."
  },
  {
   "id": "pm",
   "label": "Priming",
   "parent": "i",
   "detail": "Easier processing of something met before, without awareness."
  },
  {
   "id": "cc",
   "label": "Conditioning",
   "parent": "i",
   "detail": "Learned emotional and reflex responses; the amygdala for fear."
  }
 ],
 "caption": "Henry Molaison lost the left branch for new learning but kept the right one. Tap each box for the brain system behind it."
}
:::

### Two kinds of amnesia
- **Anterograde**: cannot form new memories after the injury.
- **Retrograde**: loses memories from before. Usually the most recent memories go first and the oldest survive (**Ribot's law**).

:::widget decide
{
  "scene": "Mohan, 52, a daily-wage labourer in Kolkata who drinks heavily, is brought to the emergency department confused, unsteady on his feet, with abnormal eye movements. The doctor wants to start a glucose drip straight away.",
  "ask": "What should happen first?",
  "choices": [
    { "label": "Give glucose first, then think about vitamins", "verdict": "harm", "outcome": "His confusion worsens and he is later left with lasting memory loss.", "why": "Glucose without thiamine can use up the last thiamine stores and precipitate or worsen Wernicke's encephalopathy." },
    { "label": "Give high-dose thiamine by injection before or with glucose, for suspected Wernicke's encephalopathy", "verdict": "best", "outcome": "His eye signs improve within hours and confusion clears over days.", "why": "Confusion, unsteadiness and eye-movement problems in a drinker suggest Wernicke's encephalopathy. Prompt parenteral thiamine can prevent Korsakoff syndrome." },
    { "label": "Wait for an MRI before any treatment", "verdict": "harm", "outcome": "Precious hours pass; damage becomes permanent.", "why": "This is a clinical diagnosis and treatment is cheap and safe. Do not wait for scans." }
  ]
}
:::


:::widget brainmap
{
 "title": "The memory circuit",
 "focus": [
  "hippocampus",
  "thalamus",
  "temporal",
  "prefrontal"
 ],
 "notes": {
  "hippocampus": "Forms new explicit memories. Removed on both sides in Henry Molaison; damaged early in Alzheimer's disease.",
  "thalamus": "The medial thalamus (with the mammillary bodies just below it) is damaged in Korsakoff syndrome.",
  "temporal": "Stores facts and meanings (semantic memory), especially at the front of the lobe.",
  "prefrontal": "Working memory and strategies for learning and recall; frontal problems cause disorganised remembering."
 },
 "caption": "Damage at different points of the same circuit gives different memory problems. Tap the thalamus and connect it to thiamine deficiency."
}
:::

:::define Korsakoff syndrome
A lasting memory disorder after thiamine deficiency (usually with alcohol): severe anterograde amnesia, some retrograde amnesia, and **confabulation** (filling memory gaps with made-up stories the person believes), with relatively preserved other thinking. Damage to the mammillary bodies and the thalamus.
:::

:::widget guess
{
  "prompt": "Of the classic triad of Wernicke's encephalopathy (confusion, unsteady gait, eye-movement problems), what share of patients show all three when they are first seen?",
  "min": 0,
  "max": 100,
  "unit": "per cent",
  "answer": [10, 25],
  "reveal": "Only a minority, perhaps around 1 in 6. Most have one or two signs. That is why any malnourished or heavy-drinking person who is confused should get thiamine without waiting for the full picture.",
  "clinician": "Autopsy series found the full triad in only about 16 per cent, and most cases were missed in life. The Caine criteria (two of: dietary deficiency, eye signs, cerebellar dysfunction, altered mental state or mild memory impairment) are more sensitive. Treat with high-dose parenteral thiamine; oral thiamine is poorly absorbed in alcohol use disorder."
}
:::

:::clinician
Consolidation and reconsolidation matter clinically. Memories are labile when first formed and again briefly each time they are retrieved; this "reconsolidation window" underlies experimental attempts to weaken traumatic memories (propranolol-paired reactivation, with mixed replication), and is one proposed mechanism of exposure-based therapies. Transient global amnesia (abrupt anterograde amnesia for hours, repetitive questioning, preserved identity, full recovery) and dissociative amnesia (loss of autobiographical memory, often including identity, with preserved new learning) are classic differentials. In depression, memory complaints often exceed measured deficits and reflect poor effort and concentration ("pseudodementia"), but late-life depression also predicts later dementia, so follow up rather than reassure once.
:::

:::recall
1. Distinguish episodic, semantic and procedural memory, with a brain area for each. || Episodic: life events (hippocampus). Semantic: facts (temporal cortex). Procedural: skills (basal ganglia, cerebellum).
2. What did Henry Molaison's case show? || Memory has separate systems; the medial temporal lobe (hippocampus) is needed to form new explicit memories, while skill learning survives.
3. What is Ribot's law? || In retrograde amnesia, recent memories are lost first and old ones are preserved.
4. Define confabulation. || Filling memory gaps with false stories the person believes, typical of Korsakoff syndrome.
:::

:::mcq
Q: A woman with severe amnesia after encephalitis cannot remember meeting her therapist, but each week she types faster on the computer. This shows that:
- Her amnesia is faked
- *Procedural memory can be preserved when episodic memory is lost
- Working memory is the only memory system
- She has semantic dementia
> Separate systems: implicit skill learning survives hippocampal damage.

Q: Korsakoff syndrome is caused mainly by deficiency of:
- Vitamin B12
- Folate
- *Thiamine (vitamin B1)
- Vitamin D
> Thiamine deficiency, usually with alcohol use, damages the mammillary bodies and thalamus.
:::

`;

export const b4Stress = String.raw`
## 4.1 Stress, sleep and the body clock [core][beginner]
### The stress system: the HPA axis
When you face a threat, two systems switch on:
1. **Fast**: the sympathetic nerves and the adrenal glands release adrenaline in seconds.
2. **Slower**: the **HPA axis**. The **hypothalamus** releases CRH, which tells the **pituitary** to release ACTH, which tells the **adrenal** glands to release **cortisol**. Cortisol raises blood sugar, sharpens attention and damps inflammation. It then switches off its own production (negative feedback).


:::widget flow
{
 "title": "The HPA axis and its brake",
 "layout": "cycle",
 "nodes": [
  {
   "id": "h",
   "label": "Hypothalamus",
   "detail": "Senses threat and releases CRH."
  },
  {
   "id": "p",
   "label": "Pituitary",
   "detail": "CRH tells it to release ACTH into the blood."
  },
  {
   "id": "a",
   "label": "Adrenal cortex",
   "detail": "ACTH makes it release cortisol."
  },
  {
   "id": "c",
   "label": "Cortisol acts",
   "detail": "Raises blood sugar, sharpens attention, damps inflammation."
  },
  {
   "id": "f",
   "label": "Negative feedback",
   "detail": "Cortisol acts on the hypothalamus, pituitary and hippocampus to switch the system off. In chronic stress and some depressions this brake works poorly."
  }
 ],
 "edgeLabels": {
  "h>p": "CRH",
  "p>a": "ACTH",
  "a>c": "cortisol"
 },
 "caption": "Press Play to go round the loop. Where does the dexamethasone suppression test check the brake? (At the feedback step: a synthetic steroid should switch cortisol off.)"
}
:::

Short bursts of stress are healthy. Long, uncontrollable stress keeps cortisol high or makes the system misfire. Over time this can harm sleep, mood, memory (the hippocampus is rich in cortisol receptors), blood sugar and the heart.

:::analogy The pressure cooker
The HPA axis is a pressure cooker with a whistle. Normally, rising pressure (cortisol) blows the whistle and the flame turns down (feedback). In chronic stress and in some depressions, the whistle is faulty: the pressure stays high and the flame stays on.
:::

:::example Two kinds of stress in Bengaluru
Nikhil, 28, has a deadline every quarter: tense for a week, then recovers. Lakshmi, 45, has cared for her husband with dementia for three years, sleeps four hours, and has no relief. Both are "stressed", but Lakshmi's stress is chronic, unpredictable and uncontrollable, the kind most linked to depression, raised blood pressure and poor immunity.
:::


:::widget stress
{
 "caption": "Trigger a stressor and watch the chain: amygdala, hypothalamus, pituitary, adrenal. Heart rate jumps first (sympathetic nerves), cortisol rises more slowly, then feedback brings both down. Switch on chronic stress and see the brake fail."
}
:::

### Sleep
Sleep comes in cycles of about 90 minutes, four or five times a night.
- **NREM stage N1**: drowsy, light sleep.
- **NREM stage N2**: true sleep; most of the night. Sleep spindles and K-complexes on EEG.
- **NREM stage N3**: deep, slow-wave sleep; body repair, growth hormone. Mostly in the first half of the night. Sleepwalking and night terrors come from here.
- **REM sleep**: rapid eye movements, vivid dreams, muscles paralysed. More in the second half of the night. Nightmares come from here.

:::widget guess
{
  "prompt": "In a healthy adult, what share of total sleep time is REM sleep?",
  "min": 0,
  "max": 60,
  "unit": "per cent",
  "answer": [20, 25],
  "reveal": "About 20 to 25 per cent. Newborns spend about half their sleep in REM. Older adults have less deep (N3) sleep, which is why their sleep feels lighter.",
  "clinician": "In depression, REM latency (time from sleep onset to the first REM period) is shortened, REM density is increased and slow-wave sleep reduced. Most antidepressants (except agomelatine, bupropion and mirtazapine to varying degrees) suppress REM; abrupt withdrawal can give REM rebound with vivid dreams. REM sleep behaviour disorder (acting out dreams because muscle atonia is lost) in older men is a strong early marker of synucleinopathies such as Parkinson's disease and Lewy body dementia."
}
:::


:::widget hypnogram
{
 "caption": "Drag through a night: deep N3 sleep comes early, REM periods lengthen towards morning. Then switch on depression and watch REM arrive sooner, deep sleep shrink and early waking appear."
}
:::

### The body clock
A small cluster of cells in the hypothalamus, the **suprachiasmatic nucleus (SCN)**, is the master clock. It is set mainly by **morning light** through the eyes. In the evening it tells the **pineal gland** to release **melatonin**, which signals "night". Shift work, late-night screens and jet lag put the clock out of step with life.

:::widget decide
{
  "scene": "Ananya, 20, a college student in Chennai, sleeps at 3 am and wakes at 11 am, missing morning lectures. She feels low and tired. She wants a sleeping pill.",
  "ask": "What is the best first approach?",
  "choices": [
    { "label": "Prescribe a strong sleeping tablet nightly", "verdict": "harm", "outcome": "She sleeps a little earlier but feels groggy in class, and soon needs a higher dose.", "why": "Sedatives do not shift the body clock, and dependence is a real risk." },
    { "label": "Bright light soon after a fixed wake time, dim light and no screens late at night, a regular wake time even on weekends, and gradual earlier bedtimes", "verdict": "best", "outcome": "Over a few weeks her clock shifts earlier, and her mood and attendance improve.", "why": "Morning light and a fixed wake time reset the SCN. This is the first-line approach for a delayed sleep phase." },
    { "label": "Tell her to go to bed at 10 pm from tonight", "verdict": "ok", "outcome": "She lies awake for hours, frustrated, and gives up.", "why": "The intent is right but sudden shifts fail; the clock moves best with light and gradual change." }
  ]
}
:::

:::clinician
HPA findings in depression: about half of people with severe melancholic or psychotic depression fail to suppress cortisol after dexamethasone (the dexamethasone suppression test), but low specificity ended its diagnostic use. Glucocorticoid receptor resistance and the inflammation-HPA interaction remain active research areas. Childhood adversity programmes stress responsivity, and the long-term effect in adults can be blunted as well as heightened cortisol. Allostatic load (McEwen) is the cumulative wear from chronic stress. On sleep: CBT for insomnia (CBT-I) is the first-line treatment in all major guidelines, ahead of hypnotics; digital CBT-I has good evidence. Orexin (hypocretin) neurons in the lateral hypothalamus stabilise wakefulness: their loss causes narcolepsy type 1, and dual orexin receptor antagonists (suvorexant, lemborexant, daridorexant) are a newer class of hypnotics available in some countries.
:::

:::recall
1. Describe the HPA axis in order. || Hypothalamus (CRH) to pituitary (ACTH) to adrenal cortex (cortisol), with cortisol feeding back to switch the system off.
2. Which sleep stage dominates the first half of the night and which the second? || Deep N3 slow-wave sleep in the first half; REM in the second half.
3. Where is the master body clock and what sets it? || The suprachiasmatic nucleus of the hypothalamus, set mainly by morning light.
4. Which sleep stage is linked with sleepwalking and night terrors? || N3 (deep slow-wave sleep).
:::

:::mcq
Q: A sleep study in a depressed patient most typically shows:
- Longer time until the first REM period
- *Shorter time until the first REM period
- More deep slow-wave sleep
- No REM sleep at all
> Reduced REM latency is the classic sleep finding in depression.

Q: A 68-year-old man punches and kicks in his sleep while dreaming of being chased. This raises concern for:
- Night terrors
- *A future synucleinopathy such as Parkinson's disease
- Normal ageing
- Sleep apnoea only
> REM sleep behaviour disorder is an early marker of synucleinopathies.
:::

`;

export const b2Meds = String.raw`
## 2.7 How medicines act and move [core][beginner]
Two questions describe every medicine:
- **Pharmacodynamics**: what the medicine does to the body (which receptor, what effect).
- **Pharmacokinetics**: what the body does to the medicine (absorption, distribution, metabolism, excretion).


:::widget receptor
{
 "receptor": "opioid",
 "caption": "Try each ligand at the same receptor. Morphine (full agonist) drives the signal to the top; buprenorphine (partial agonist) stops part-way and blocks morphine from doing more; naloxone (antagonist) sits in the lock with no signal; an inverse agonist pushes the background signal below zero."
}
:::

### What a medicine does at a receptor
| Term | What it does | Example |
|---|---|---|
| **Agonist** | Switches the receptor fully on, like the natural transmitter | Morphine at opioid receptors |
| **Partial agonist** | Switches it partly on; acts as a brake when transmitter is high and a booster when it is low | Aripiprazole at D2; buprenorphine at opioid receptors |
| **Antagonist** | Sits in the lock without turning it; blocks the natural key | Haloperidol at D2; naloxone at opioid receptors |
| **Inverse agonist** | Turns down the receptor's own background activity | Pimavanserin at 5-HT2A (in some countries) |
| **Reuptake inhibitor** | Blocks the recycling pump | SSRIs, SNRIs |
| **Enzyme inhibitor** | Stops breakdown | MAO inhibitors, donepezil |

:::widget synapse
{"drug": "ssri", "caption": "Press 'Add SSRI' to block the recycling pump, then 'Let time pass'. The chemistry changes in hours; the receptors adapt and the brain rewires over the following weeks. That gap is why antidepressants are judged only after an adequate trial."}
:::


:::widget curve
{
 "kind": "dose-response",
 "title": "Full agonist, partial agonist, antagonist",
 "caption": "Compare the curves. A full agonist reaches the top; a partial agonist like aripiprazole or buprenorphine levels off lower however high the dose (a ceiling), and in the presence of a full agonist it pulls the response down. Potency shifts a curve left or right; efficacy sets its height."
}
:::

### The body's handling of a medicine
- **Absorption**: from the gut into blood. Some medicines are partly destroyed by the liver before they reach the body (**first-pass effect**).
- **Distribution**: most psychiatric medicines are fat-soluble and cross into the brain; many bind to blood proteins.
- **Metabolism**: mainly in the liver, by a family of enzymes called **cytochrome P450 (CYP)**.
- **Excretion**: mostly by the kidneys. **Lithium** is not metabolised at all; it leaves only through the kidneys, so dehydration and kidney problems push levels up.


:::widget journey
{
 "drug": "sertraline",
 "target": "serotonin transporters on serotonin neurons",
 "routes": [
  "oral"
 ],
 "notes": {
  "gut": "Absorbed slowly; taking it with food makes little difference.",
  "liver": "Some is broken down on the first pass through the liver, mainly by CYP enzymes including CYP2C19 and CYP3A4.",
  "blood": "Most of it travels bound to blood proteins; only the free part acts.",
  "brain": "Fat-soluble, so it crosses the blood-brain barrier and blocks the serotonin recycling pump.",
  "elimination": "Half-life about a day, so steady state takes around four to five days of regular doses."
 },
 "caption": "Follow one tablet from mouth to brain to exit. Ask at each stop: what could change the amount reaching the brain here? (Food, liver enzymes, other medicines, protein binding, kidney or liver disease.)"
}
:::

### Half-life and steady state
The **half-life** is the time for the blood level to fall by half. It decides how often to give a medicine and how long it lingers.

:::widget guess
{
  "prompt": "If you start a medicine and give the same dose every day, after about how many half-lives does the blood level settle at a steady level?",
  "min": 1,
  "max": 10,
  "unit": "half-lives",
  "answer": [4, 5],
  "reveal": "About four to five half-lives. The same rule tells you how long a medicine takes to be almost gone after stopping. Fluoxetine and its active breakdown product last so long that it takes weeks to wash out, which matters before switching to a medicine that could interact with it.",
  "clinician": "After one half-life the level is at 50 per cent of steady state, after two 75 per cent, three 87.5 per cent, four about 94 per cent, five about 97 per cent. Norfluoxetine's half-life of one to two weeks is why a five-week washout is required before starting an MAOI after fluoxetine. Loading doses (for example valproate in mania in some protocols) reach target levels faster but do not change the time to true steady state."
}
:::


:::widget curve
{
 "kind": "half-life",
 "title": "Repeated doses build to a steady level",
 "caption": "Move the sliders for half-life and dosing interval. Count how many half-lives it takes for the peaks and troughs to level off (about four to five), then see why a long half-life medicine takes so long to wash out."
}
:::

### Enzymes: inducers and inhibitors
- An **inducer** speeds up the CYP enzymes, so other medicines are broken down faster and their levels **fall**. Examples: carbamazepine, rifampicin, **smoking** (for CYP1A2).
- An **inhibitor** slows the enzymes, so other medicines **build up**. Examples: fluoxetine and paroxetine (CYP2D6), fluvoxamine (CYP1A2), and valproate (which raises lamotrigine levels by blocking its breakdown).

:::example A smoking lesson from Bhopal
Imran, 35, stable on clozapine for two years, is admitted to hospital with pneumonia and cannot smoke. A week later he is very drowsy, drooling and has a seizure. Smoke (not nicotine) induces CYP1A2, which breaks down clozapine. When he stopped smoking, his clozapine level roughly doubled. The fix is to check levels and reduce the dose when a patient stops smoking, and raise it again carefully if they restart.
:::

### Therapeutic index
The **therapeutic index** is the gap between a helpful dose and a toxic one. **Lithium** has a narrow index: a small rise in level can cause toxicity, so levels are monitored. SSRIs have a wide index.

:::safety Lithium toxicity
Coarse tremor, vomiting, diarrhoea, unsteady walk, slurred speech and confusion in someone on lithium need an urgent level and medical care. Common triggers: dehydration (heat, fever, diarrhoea), new painkillers such as ibuprofen, some blood pressure tablets (ACE inhibitors, thiazide diuretics).
:::

:::clinician
Clinically important CYP facts: CYP2D6 (codeine to morphine activation, many antidepressants and antipsychotics; strongly inhibited by fluoxetine, paroxetine and bupropion); CYP3A4 (about half of all drugs; inhibited by clarithromycin, ketoconazole, grapefruit; induced by carbamazepine, rifampicin, St John's wort and modafinil); CYP1A2 (clozapine, olanzapine, duloxetine; induced by smoking and inhibited by fluvoxamine and ciprofloxacin); CYP2C19 (citalopram, escitalopram, sertraline in part, diazepam, clopidogrel). Carbamazepine autoinduces its own metabolism over the first weeks, so levels fall after initial titration, and it reduces the effectiveness of oral contraceptives. Lamotrigine dosing must be halved with valproate and roughly doubled with carbamazepine, and the slow titration is the main protection against serious rash. Therapeutic drug monitoring in routine psychiatry: lithium (12-hour trough), clozapine (with plasma level and norclozapine ratio), valproate, carbamazepine; others mainly to check adherence or unusual response.
:::

:::recall
1. Define pharmacodynamics and pharmacokinetics. || Pharmacodynamics: what the drug does to the body. Pharmacokinetics: what the body does to the drug (absorption, distribution, metabolism, excretion).
2. What is a partial agonist? Give two examples. || Switches the receptor partly on, braking high activity and boosting low; aripiprazole (D2), buprenorphine (opioid).
3. How long does it take to reach steady state? || About four to five half-lives.
4. Why does stopping smoking raise clozapine levels? || Smoke induces CYP1A2, which breaks down clozapine; removing the inducer slows clearance.
5. Why is lithium monitored? || It has a narrow therapeutic index and is cleared only by the kidneys, so levels can rise quickly.
:::

:::mcq
Q: A patient taking lamotrigine is started on valproate. What should happen to the lamotrigine dose?
- Double it, because valproate speeds its breakdown
- *Reduce it (roughly halve it), because valproate slows its breakdown and raises rash risk
- No change is needed
- Stop lamotrigine permanently
> Valproate inhibits lamotrigine metabolism; levels and rash risk rise.

Q: Naloxone reverses an opioid overdose because it is:
- A partial agonist
- *An antagonist at opioid receptors
- An enzyme inducer
- A reuptake inhibitor
> It blocks opioid receptors and displaces the opioid.

Q: A woman on lithium develops diarrhoea and vomiting during a heatwave and becomes unsteady and confused. The most likely problem is:
- Lithium is no longer working
- *Lithium toxicity from dehydration
- A new episode of mania
- Normal side effects that need no action
> Dehydration raises lithium levels; this is an emergency.
:::

`;

export const b4Hormones = String.raw`
## 4.2 Hormones and drives: the endocrine system, hunger, thirst and sex [core][beginner]
### The endocrine system
Glands release **hormones** into the blood. Most are controlled from the brain through the **hypothalamus** and the **pituitary**, and most switch themselves off by **negative feedback** (like a thermostat).

| Gland | Main hormones | What they do | Link to mental health |
|---|---|---|---|
| **Hypothalamus** | Releasing hormones (CRH, TRH, GnRH), dopamine | Commands the pituitary | Stress, appetite, sleep, sex drive |
| **Anterior pituitary** | ACTH, TSH, FSH, LH, growth hormone, prolactin | Controls other glands | Raised prolactin from antipsychotics |
| **Posterior pituitary** | Oxytocin, vasopressin (ADH) | Bonding and labour; water balance | Low sodium with some medicines |
| **Thyroid** | Thyroxine (T4) and T3 | Energy and metabolism | Low: mimics depression; high: mimics anxiety or mania; lithium can lower it |
| **Parathyroid** | Parathyroid hormone | Calcium | High calcium causes low mood and confusion ("stones, bones, groans and psychic moans") |
| **Adrenal cortex** | Cortisol, aldosterone | Stress, blood sugar, salt | Cushing's: depression, psychosis; Addison's: fatigue, low mood |
| **Adrenal medulla** | Adrenaline, noradrenaline | Fight or flight | Panic-like episodes in rare tumours (phaeochromocytoma) |
| **Pancreas** | Insulin, glucagon | Blood sugar | Low sugar mimics anxiety; antipsychotics raise diabetes risk |
| **Pineal** | Melatonin | Signals night | Sleep timing |
| **Gonads** | Testosterone, oestrogen, progesterone | Sexual development and drive | Mood changes around periods, pregnancy, menopause |


:::widget brainmap
{
 "title": "Where drives are controlled",
 "focus": [
  "hypothalamus",
  "brainstem",
  "amygdala"
 ],
 "notes": {
  "hypothalamus": "Arcuate nucleus balances hunger and fullness signals; other nuclei control thirst, temperature, sleep and sexual behaviour, and the pituitary.",
  "brainstem": "Receives gut and vagus nerve signals about stretch and nutrients.",
  "amygdala": "Adds emotional value to food and sex cues."
 },
 "caption": "The hypothalamus is small but runs the body's basic drives. Tap it and list four drives it controls."
}
:::


:::widget compare
{
 "title": "Underactive and overactive thyroid",
 "a": {
  "label": "Underactive (hypothyroid)",
  "points": [
   "Tired, slow, low mood",
   "Weight gain, feeling cold",
   "Constipation, dry skin",
   "Slow pulse; can follow lithium"
  ],
  "summary": "Mimics depression."
 },
 "b": {
  "label": "Overactive (hyperthyroid)",
  "points": [
   "Anxious, restless, irritable",
   "Weight loss, feeling hot",
   "Tremor, palpitations, sweating",
   "Can mimic mania or panic"
  ],
  "summary": "Mimics anxiety or mania."
 },
 "caption": "A thyroid blood test is cheap; check it in new mood or anxiety disorders."
}
:::

### Hunger: what tells us to eat and to stop
Older textbooks describe two "centres": damage to the **lateral hypothalamus** makes animals stop eating, and damage to the **ventromedial hypothalamus** makes them overeat. The modern picture is a balance of signals arriving at the **arcuate nucleus** of the hypothalamus:
- **Hunger signals**: **ghrelin** from the empty stomach (short-term), low blood sugar, and hunger neurons using neuropeptide Y.
- **Fullness signals**: stretch of the stomach, gut hormones (**CCK**, **PYY**, **GLP-1**) after a meal, **insulin**, and **leptin** from fat cells (long-term: "we have enough stored").
- **Reward**: the dopamine system makes tasty food attractive even when we are full ("hedonic" eating).

:::example From a hormone to a medicine
GLP-1 is a fullness hormone from the gut. Medicines that copy it (semaglutide, liraglutide, tirzepatide) reduce appetite and cause large weight loss. Psychiatrists now study them for antipsychotic weight gain and, in research, for alcohol and other cravings (see the Frontiers module).
:::

### Thirst: two kinds
- **Osmotic thirst**: when the blood becomes too salty (after a salty meal or sweating), sensors in the hypothalamus detect it, trigger thirst, and release **vasopressin (ADH)** so the kidneys keep water.
- **Volume (hypovolaemic) thirst**: when blood volume falls (bleeding, vomiting, diarrhoea), the kidneys release renin, producing **angiotensin II**, which triggers thirst and salt craving.


:::widget journey
{
 "drug": "lithium",
 "target": "several signalling pathways inside neurons (for example GSK-3 and inositol)",
 "routes": [
  "oral"
 ],
 "notes": {
  "gut": "Absorbed well; slow-release forms smooth out peaks.",
  "liver": "Not broken down by the liver at all, so liver enzyme interactions do not apply.",
  "blood": "Not bound to proteins; the blood level reflects what reaches the brain fairly directly.",
  "brain": "Enters the brain slowly; brain levels lag behind blood levels.",
  "elimination": "Cleared only by the kidneys, following sodium and water. Dehydration, ibuprofen, ACE inhibitors and thiazides push levels up."
 },
 "caption": "Follow lithium's route and find the stop that explains why heatwaves, diarrhoea and some painkillers cause toxicity."
}
:::

:::safety Water and salt problems in psychiatry
- **Psychogenic polydipsia**: some people with chronic schizophrenia drink huge amounts of water, which can dilute blood sodium and cause confusion and seizures.
- **Lithium** can stop the kidneys responding to vasopressin, causing great thirst and passing large volumes of urine.
- **SSRIs, carbamazepine and oxcarbazepine** can cause low sodium, especially in older adults: watch for confusion, falls and headache.
:::

### Sex: hormones, brain and response
- **Organising effects**: before birth, a gene on the Y chromosome (SRY) leads to testes, and their testosterone shapes body and some brain structures. **Activating effects**: at puberty and in adult life, hormones switch on sexual behaviour.
- **Testosterone** supports sexual desire in both men and women. **Oestrogen** supports vaginal health and arousal. **Oxytocin** rises with touch and orgasm and supports bonding.
- The **medial preoptic area** of the hypothalamus is important for sexual behaviour; dopamine increases desire; serotonin and prolactin tend to reduce it.
- **Masters and Johnson's response cycle**: excitement, plateau, orgasm, resolution. Later models add **desire** before excitement, and **Basson's circular model** notes that for many women, desire often follows arousal and closeness rather than coming first.

:::widget sort
{
  "prompt": "Match each clinical problem to the hormone or signal most involved.",
  "buckets": ["Prolactin", "Vasopressin (ADH)", "Leptin or ghrelin", "Thyroid hormone", "Serotonin"],
  "items": [
    { "text": "A man on risperidone has lost interest in sex and has breast swelling", "bucket": 0 },
    { "text": "A woman on lithium is always thirsty and passes large amounts of urine", "bucket": 1 },
    { "text": "A woman on an SSRI cannot reach orgasm", "bucket": 4, "why": "Raised serotonin delays orgasm and lowers desire, a common and often unasked-about side effect." },
    { "text": "A man feels hungry soon after meals and keeps gaining weight on olanzapine", "bucket": 2, "why": "Antipsychotic weight gain involves appetite signals (and H1 and 5-HT2C block) that override fullness." },
    { "text": "A woman, 45, is slow, cold, constipated and low after starting lithium", "bucket": 3 }
  ]
}
:::

:::widget decide
{
  "scene": "Mr Pillai, 76, in Thiruvananthapuram, started sertraline three weeks ago for depression. His daughter calls: he is confused, unsteady and has had a fall. The family thinks his depression is 'getting worse'.",
  "ask": "What should be checked first?",
  "choices": [
    { "label": "Increase the sertraline dose", "verdict": "harm", "outcome": "His confusion deepens and he has a seizure.", "why": "New confusion and falls soon after starting an SSRI in an older adult suggest low sodium, which a higher dose would worsen." },
    { "label": "Urgent blood test for sodium, and medical review", "verdict": "best", "outcome": "His sodium is very low. The SSRI is stopped, sodium is corrected carefully, and he recovers; a different antidepressant is chosen later.", "why": "SSRI-related hyponatraemia (often via inappropriate vasopressin release) is common in older people and is a medical emergency when severe." },
    { "label": "Wait and see for two weeks", "verdict": "harm", "outcome": "He is admitted after another fall.", "why": "Acute confusion in an older adult always needs prompt medical assessment." }
  ]
}
:::

:::clinician
Arcuate nucleus circuitry: AgRP and NPY neurons drive feeding and are inhibited by leptin and insulin; POMC neurons (producing alpha-MSH acting at MC4 receptors) promote satiety, and MC4R mutations are the commonest monogenic cause of severe childhood obesity. Leptin deficiency is rare, but leptin resistance is the rule in common obesity. Prader-Willi syndrome (hyperphagia, raised ghrelin) is a useful exam link. Antipsychotic weight gain correlates with H1 and 5-HT2C affinity and is greatest with clozapine and olanzapine; metformin and, increasingly, GLP-1 receptor agonists are used for mitigation, with trial evidence for GLP-1 agonists in antipsychotic-treated patients growing as of Nov 2026. Thirst: osmoreceptors in the organum vasculosum of the lamina terminalis and subfornical organ (outside the blood-brain barrier) sense osmolality; angiotensin II acts at the subfornical organ. SIADH with SSRIs is most common in older women in the first weeks. Sexual dysfunction: hyperprolactinaemia (prolactin-raising antipsychotics) and serotonergic antidepressants are the main iatrogenic causes; bupropion, mirtazapine, vortioxetine and agomelatine have lower rates. Ask directly, because patients in India rarely volunteer sexual side effects, and non-adherence often follows silently.
:::

:::recall
1. Name the hormones of the posterior pituitary and what they do. || Oxytocin (bonding, labour, milk let-down) and vasopressin or ADH (water retention by the kidneys).
2. Which hormone from fat cells signals long-term energy stores, and which stomach hormone signals hunger? || Leptin; ghrelin.
3. Distinguish osmotic and volume thirst. || Osmotic: blood too concentrated, sensed in the hypothalamus, vasopressin released. Volume: blood volume falls, renin and angiotensin II trigger thirst and salt appetite.
4. What are organising and activating effects of sex hormones? || Organising: early, lasting effects on body and brain structure. Activating: later effects switching behaviour on at puberty and in adulthood.
5. Name two psychiatric medicines that commonly cause low sodium. || SSRIs and carbamazepine (also oxcarbazepine).
:::

:::mcq
Q: Destroying the ventromedial hypothalamus in classic animal studies caused:
- Refusal to eat
- *Overeating and obesity
- Loss of thirst
- Loss of sleep
> The VMH was called the satiety centre; lesions cause hyperphagia.

Q: A man with chronic schizophrenia drinks over ten litres of water a day and has a seizure. The most likely cause is:
- High sodium
- *Low sodium from psychogenic polydipsia
- Lithium toxicity
- Low thyroid
> Excess water dilutes sodium.

Q: Which stage is NOT part of Masters and Johnson's original response cycle?
- Excitement
- Plateau
- *Desire
- Resolution
> Desire was added by later models.
:::

`;

export const b4Hemispheres = String.raw`
## 4.5 Two hemispheres, and how we study genes and behaviour [core][beginner]

:::widget brainmap
{
 "title": "The two hemispheres and their bridge",
 "focus": [
  "corpus-callosum",
  "broca",
  "wernicke",
  "occipital"
 ],
 "notes": {
  "corpus-callosum": "About 200 million fibres joining the hemispheres. Cut in split-brain surgery for severe epilepsy.",
  "broca": "Speech production, usually on the left, which is why a split-brain patient can name only what the left hemisphere sees.",
  "wernicke": "Speech understanding, usually left.",
  "occipital": "Each occipital lobe sees the opposite half of the visual field."
 },
 "caption": "Trace a word flashed to the left visual field: right occipital lobe, then no route across a cut corpus callosum to the left-hemisphere speech areas."
}
:::

### The split brain
The two cerebral hemispheres are joined by the **corpus callosum**, a thick band of about 200 million nerve fibres. In a few people with severe epilepsy, surgeons cut it to stop seizures spreading (a **corpus callosotomy**). **Roger Sperry** and **Michael Gazzaniga** studied these "split-brain" patients.

Two facts make the experiments work:
- Each hemisphere sees the **opposite half of the visual field** and controls the **opposite hand**.
- In most people, **speech** is produced by the **left** hemisphere.

What they found:
- A word flashed to the **right** visual field (left hemisphere) can be read aloud.
- A word flashed to the **left** visual field (right hemisphere) cannot be named, but the **left hand** can pick out the matching object by touch.
- The **right** hemisphere is better at faces, spatial layout and some emotional tones.
- The left hemisphere acts as an **interpreter**: it makes up a confident explanation for actions started by the right hemisphere that it knows nothing about.

:::example The chicken claw and the snow shovel
In a famous study, a split-brain patient's left hemisphere saw a chicken claw and his right hemisphere saw a snowy scene. His right hand picked a picture of a chicken; his left hand picked a shovel. Asked why, his speaking left hemisphere answered without hesitation: "The chicken claw goes with the chicken, and you need a shovel to clean out the chicken shed." The story was invented on the spot and believed. This is a striking picture of how all of us explain our behaviour after the fact, and of confabulation.
:::

:::widget decide
{
  "scene": "In a lab demonstration, a split-brain patient fixes her eyes on a central dot. The word 'KEY' is flashed briefly to the left of the dot. She is asked what she saw, and then asked to find the object with either hand among items hidden behind a screen.",
  "ask": "What will happen?",
  "choices": [
    { "label": "She says 'key' and picks it with her right hand", "verdict": "harm", "outcome": "This would happen with an intact corpus callosum, not after it is cut.", "why": "The left visual field goes to the right hemisphere, which cannot speak and cannot pass the word to the left hemisphere." },
    { "label": "She says she saw nothing, but her left hand picks out the key", "verdict": "best", "outcome": "Exactly what Sperry and Gazzaniga found.", "why": "The right hemisphere saw the word and controls the left hand; the speaking left hemisphere had no access to it." },
    { "label": "She says 'key' but cannot pick it with either hand", "verdict": "ok", "outcome": "Not what happens.", "why": "Naming requires the left hemisphere, which never received the word." }
  ]
}
:::

### Other ways to study the two hemispheres
- **Wada test**: a short-acting anaesthetic is injected into one carotid artery to "switch off" one hemisphere before epilepsy surgery, checking where language and memory are.
- **Dichotic listening**: different words in each ear; most people report right-ear words better (left hemisphere language).
- Functional imaging and brain stimulation now often replace the Wada test.

### Lateralisation in numbers and named findings
| Finding | What exams expect |
|---|---|
| Language in right-handers | Left hemisphere in about 95 per cent or more |
| Language in left-handers (Theodore Rasmussen and Brenda Milner's Wada data, without early brain damage) | About 70 per cent left, about 15 per cent right, about 15 per cent both sides |
| Dichotic listening for words | A **right-ear advantage**, because the crossed pathway from the right ear to the left hemisphere is stronger |
| Chimeric faces (Jerre Levy, Colwyn Trevarthen and Roger Sperry) | Shown a face made of two different halves, split-brain patients **pointed** (right hemisphere) to the face seen in the **left** visual field, but **named** (left hemisphere) the face in the right visual field |
| **Alien hand** after callosotomy | The left hand acts against the right, for example unbuttoning a shirt the right hand has just buttoned (intermanual conflict) |
| Right-hemisphere strengths | Faces, spatial layout, the emotional tone of speech (prosody), global shape; damage causes neglect and aprosodia |
| Left-hemisphere strengths | Language, sequences, fine detail, the "interpreter" |

:::widget experiment
{
 "title": "Where is language in left-handers?",
 "question": "In the classic Wada-test series of left-handed and ambidextrous patients without early left-hemisphere damage, predict the share with speech in each place.",
 "unit": "%",
 "conditions": [
  { "label": "Left hemisphere", "value": 70 },
  { "label": "Right hemisphere", "value": 15 },
  { "label": "Both hemispheres", "value": 15 }
 ],
 "why": "Most left-handers are still left-lateralised for language. Right-handers are even more so, at about 96 per cent left. Early left-hemisphere damage shifts more people to right or bilateral language."
}
:::

### Behaviour genetics: separating genes and environment
Families share both genes and homes, so "it runs in the family" does not prove genes. Behaviour genetics uses natural experiments.

| Method | The logic | Example finding |
|---|---|---|
| **Family studies** | Is risk higher in closer relatives? | First-degree relatives of a person with schizophrenia have roughly ten times the general risk |
| **Twin studies** | Identical (MZ) twins share all their genes, fraternal (DZ) about half. If MZ twins are more alike than DZ twins, genes matter | MZ concordance for schizophrenia about 40 to 50 per cent, DZ about 10 to 15 per cent |
| **Adoption studies** | Is an adopted child more like the biological parents (genes) or adoptive parents (environment)? | Children of mothers with schizophrenia, adopted at birth into healthy families, still had raised risk |
| **Twins reared apart** | Same genes, different homes | Striking similarities in personality and IQ (Minnesota study) |
| **Molecular studies** | Find the actual DNA variants | GWAS, polygenic scores (see Sections 5.3 and 5.6) |
| **Animal studies** | Selective breeding and gene "knockouts" | Tryon bred "maze-bright" and "maze-dull" rats |


:::widget flow
{
 "title": "The logic of a twin study",
 "layout": "chain",
 "nodes": [
  {
   "id": "m",
   "label": "Identical (MZ) twins share all genes",
   "detail": "Plus a shared home."
  },
  {
   "id": "d",
   "label": "Fraternal (DZ) twins share about half",
   "detail": "Plus a shared home."
  },
  {
   "id": "c",
   "label": "Compare similarity",
   "detail": "Correlate the trait within MZ pairs and within DZ pairs."
  },
  {
   "id": "h",
   "label": "Estimate heritability",
   "detail": "Twice the difference between MZ and DZ correlations (Falconer)."
  },
  {
   "id": "a",
   "label": "Check the assumption",
   "detail": "Equal environments: MZ twins should not be treated more alike for reasons that affect the trait."
  }
 ],
 "caption": "Press Play, then try the worked example below."
}
:::

### Three sources of difference: the "ACE" model
Twin studies split differences between people into:
- **A**: additive genetic effects (heritability).
- **C**: common (shared) environment: what makes siblings alike (same home, same income, same school).
- **E**: unique (non-shared) environment: what makes siblings different (different friends, illnesses, experiences), plus measurement error.

A surprising and repeated finding: for most adult personality traits and many disorders, **shared environment (C) is small**, and unique environment (E) is large. Siblings raised together are often less alike than people expect.

### Genes and environment work together
- **Gene-environment interaction**: a gene variant matters only in certain environments (for example, a stressful one).
- **Gene-environment correlation**: genes shape the environments people get. **Passive** (parents give both genes and home), **evocative** (a child's temperament draws certain reactions), **active** (people choose settings that fit their genes).

:::widget worked
{
  "title": "Estimating heritability from twin correlations",
  "steps": [
    { "q": "In a twin study of anxiety scores, identical twins correlate 0.50 and fraternal twins correlate 0.30. Falconer's formula estimates heritability as twice the difference between the MZ and DZ correlations. What is the estimate?", "a": "2 times (0.50 minus 0.30) = 0.40, so about 40 per cent of the variation is linked to genetic differences." },
    { "q": "Shared environment (C) is estimated as the MZ correlation minus heritability. What is C?", "a": "0.50 minus 0.40 = 0.10: shared family environment explains about 10 per cent." },
    { "q": "Unique environment (E) is 1 minus the MZ correlation. What is E?", "a": "1 minus 0.50 = 0.50: half the variation comes from experiences not shared by twins, plus measurement error." }
  ],
  "yourTurn": [
    { "q": "For a trait, MZ twins correlate 0.80 and DZ twins 0.40. Estimate A, C and E.", "a": "A = 2 times 0.40 = 0.80. C = 0.80 minus 0.80 = 0. E = 1 minus 0.80 = 0.20. A highly heritable trait with no measurable shared environment effect." }
  ]
}
:::

:::clinician
The equal environments assumption (that MZ and DZ twins experience equally similar environments) is the main criticism of twin designs; studies of misclassified zygosity largely support it for most psychiatric traits. Heritability rises with age for IQ (the Wilson effect: from about 0.2 in infancy to about 0.7 or more in adulthood), probably through active gene-environment correlation. Heritability is population-specific: Turkheimer's group found IQ heritability near zero in very poor US families and high in affluent ones, a reminder for Indian contexts with large socioeconomic gradients. The Danish adoption studies (Kety, Rosenthal, Wender) found schizophrenia-spectrum illness concentrated in biological, not adoptive, relatives. Caspi's serotonin-transporter by stress interaction became the textbook example of GxE but failed large-scale replication. The split-brain literature has also been nuanced: some recent studies suggest split-brain patients can respond accurately to stimuli in either visual field with either hand, implying divided perception but less divided awareness than the classic account.
:::

:::recall
1. What structure is cut in split-brain surgery and why? || The corpus callosum, to stop severe epileptic seizures spreading between hemispheres.
2. A word flashed to the left visual field of a split-brain patient: can they name it? What can they do? || They cannot name it, but the left hand can pick out the object.
3. What is the left-hemisphere interpreter? || The left hemisphere's tendency to invent confident explanations for behaviour it did not initiate.
4. Give Falconer's formula. || Heritability equals twice the difference between MZ and DZ twin correlations.
5. What do A, C and E stand for in twin studies? || Additive genetics, common (shared) environment, unique (non-shared) environment.
6. Name the three types of gene-environment correlation. || Passive, evocative and active.
:::

:::mcq
Q: In most split-brain patients, an object felt only by the left hand cannot be named because:
- The left hand has no sensory nerves
- *Touch from the left hand goes to the right hemisphere, which cannot pass it to the speaking left hemisphere
- The corpus callosum controls speech
- The cerebellum is cut
> Information stays in the non-speaking hemisphere.

Q: If identical twins are much more alike for a trait than fraternal twins, this suggests:
- Shared environment is the main cause
- *Genes contribute substantially
- The trait cannot be measured
- Adoption has no effect
> Greater MZ similarity indicates genetic influence.

Q: A child with an outgoing temperament draws more friendly attention from teachers. This is:
- Passive gene-environment correlation
- *Evocative gene-environment correlation
- Active gene-environment correlation
- Gene-environment interaction
> The child's traits evoke responses.
:::

`;

export const b4Check = String.raw`
## 4.6 Level check · Beginner [core][beginner]
Score 80% or more to open the Advanced level.

:::mcq
Q: Which receptor is a fast ion channel?
- Dopamine D2
- Serotonin 5-HT1A
- *GABA-A
- Muscarinic M1
> GABA-A is a chloride channel.

Q: Serotonin-making neurons are found mainly in the:
- Locus coeruleus
- *Raphe nuclei
- Substantia nigra
- Ventral tegmental area
> The raphe nuclei of the brainstem.

Q: Dry mouth, constipation, blurred vision and confusion in an elderly patient point to blockade of:
- H1 receptors
- *Muscarinic receptors
- 5-HT2A receptors
- Beta receptors
> Classic anticholinergic effects.

Q: Blocking D2 receptors in the mesolimbic pathway mainly:
- Raises prolactin
- *Reduces delusions and hallucinations
- Causes tardive dyskinesia
- Worsens memory
> The mesolimbic pathway carries positive symptoms.

Q: The earliest extrapyramidal side effect to appear, often within hours to days, is:
- Tardive dyskinesia
- Parkinsonism
- *Acute dystonia
- Neuroleptic malignant syndrome
> Dystonia is the earliest.

Q: High fever, severe rigidity, confusion and very high creatine kinase in a patient on an antipsychotic suggest:
- Akathisia
- Serotonin syndrome only
- *Neuroleptic malignant syndrome
- Normal response
> A medical emergency; stop the antipsychotic.

Q: A patient speaks slowly with few words, understands well, and cannot repeat a phrase. This is:
- Wernicke's aphasia
- *Broca's aphasia
- Transcortical sensory aphasia
- Dysarthria
> Non-fluent, good comprehension, poor repetition.

Q: Disinhibition, tactlessness and poor judgement after a head injury point most to the:
- Dorsolateral frontal cortex
- *Orbitofrontal cortex
- Occipital cortex
- Cerebellum
> The orbitofrontal syndrome.

Q: Memory for how to ride a bicycle is:
- Episodic
- Semantic
- *Procedural
- Working
> Procedural memory, a form of implicit memory.

Q: A heavy drinker who is confused should receive which treatment before glucose?
- Vitamin C
- *Thiamine
- Folate only
- Benzodiazepine only
> Thiamine prevents Wernicke's worsening and Korsakoff syndrome.

Q: Leptin, released by fat cells, mainly signals:
- Hunger right now
- *That energy stores are sufficient, reducing appetite over the long term
- Thirst
- Sexual desire
> A long-term fullness signal.

Q: The master body clock is in the:
- Pineal gland
- *Suprachiasmatic nucleus of the hypothalamus
- Thalamus
- Cerebellum
> The SCN, set by light.

Q: Fluvoxamine raises clozapine levels because it:
- Induces CYP1A2
- *Inhibits CYP1A2
- Blocks D2 receptors
- Is excreted by the kidney
> Inhibition of CYP1A2 slows clozapine breakdown.

Q: Fraternal twins correlate 0.20 and identical twins 0.60 on a trait. Falconer's estimate of heritability is:
- 0.20
- 0.40
- *0.80
- 0.60
> Twice the difference: 2 times 0.40.

Q: Lithium levels rise with dehydration mainly because lithium:
- Is broken down by the liver
- *Is cleared only by the kidneys
- Induces its own metabolism
- Is stored in fat
> Renal handling of lithium follows sodium and water.

Q: The resting potential lies closer to the potassium equilibrium potential than to that of sodium because at rest the membrane is:
- *Far more permeable to potassium through leak channels
- Completely impermeable to sodium
- Pumping potassium out
- Full of open voltage-gated sodium channels
> Goldman: a permeability-weighted average.

Q: The absolute refractory period is caused mainly by:
- Potassium channels closing
- *Inactivation of voltage-gated sodium channels
- Depletion of neurotransmitter
- The sodium-potassium pump stopping
> Inactivated channels must reset before another spike.

Q: Botulinum toxin causes paralysis by:
- Blocking nicotinic receptors
- *Cleaving SNARE proteins so acetylcholine cannot be released
- Inhibiting acetylcholinesterase
- Blocking glycine receptors
> No fusion, no release.

Q: GABA is synthesised from glutamate by:
- GABA transaminase
- *Glutamic acid decarboxylase
- Tyrosine hydroxylase
- Choline acetyltransferase
> GAD needs vitamin B6.

Q: Match the transmitter with its source nucleus. Which pair is correct?
- Histamine: raphe nuclei
- *Acetylcholine: nucleus basalis of Meynert
- Serotonin: locus coeruleus
- Orexin: substantia nigra
> Histamine: tuberomammillary; serotonin: raphe; orexin: lateral hypothalamus.

Q: Rimonabant was withdrawn from the market mainly because blocking CB1 receptors caused:
- Seizures
- *Depression and suicidal thinking
- Psychosis
- Liver failure
> Evidence that endocannabinoid tone supports mood.

Q: Pain and temperature fibres cross to the opposite side:
- In the medulla
- *In the spinal cord, near where they enter
- In the thalamus
- They do not cross
> Hence contralateral pain loss in Brown-Séquard syndrome.

Q: Hemiballismus follows a lesion of the:
- Caudate nucleus
- Cerebellar vermis
- *Subthalamic nucleus
- Red nucleus
> Contralateral flinging movements.

Q: The thalamic nucleus that relays auditory information is the:
- Lateral geniculate
- *Medial geniculate
- Pulvinar
- Mediodorsal
> "Medial for music".

Q: Brodmann areas 44 and 45 correspond to:
- Primary motor cortex
- Wernicke's area
- *Broca's area
- Primary visual cortex
> Left inferior frontal gyrus.

Q: Bilateral leg weakness, incontinence and abulia point to a stroke in the territory of the:
- Middle cerebral arteries
- *Anterior cerebral arteries
- Posterior cerebral arteries
- Vertebral arteries
> Medial frontal lobes.

Q: The triad of normal pressure hydrocephalus is:
- Fever, neck stiffness, rash
- *Gait disturbance, urinary incontinence, dementia
- Confusion, ataxia, eye-movement palsy
- Tremor, rigidity, slowness
> "Wet, wobbly and wacky".

Q: Prolactin is tonically inhibited by:
- Serotonin
- TRH
- *Dopamine from the arcuate nucleus
- Cortisol
> The tuberoinfundibular pathway.

Q: The stages of Selye's general adaptation syndrome, in order, are:
- Resistance, alarm, exhaustion
- *Alarm, resistance, exhaustion
- Exhaustion, alarm, recovery
- Appraisal, coping, adaptation
> Alarm first.

Q: Which light most strongly suppresses melatonin?
- Red
- Green
- *Blue
- Infrared
> Melanopsin peaks around 460 to 480 nm.

Q: Borbély's two-process model explains sleep timing by:
- *Homeostatic sleep pressure and a circadian signal
- REM-on and REM-off neurons only
- Melatonin and cortisol only
- Dream content
> Process S and Process C.

Q: An event-related potential that appears to a rare attended target about 300 ms later and is smaller in schizophrenia is the:
- P50
- N400
- *P300
- Mismatch negativity
> The oddball P3.

Q: In left-handers without early brain damage, language is most often located in the:
- *Left hemisphere (about 70 per cent)
- Right hemisphere (about 70 per cent)
- Both hemispheres equally in most
- Cerebellum
> Rasmussen and Milner's Wada data.
:::
`;
