import type { LongQA } from "@/lib/prep/long-types";
import type { PrepVisual } from "@/lib/prep/types";
import type { FigureData } from "@/lib/study/types";
import { anchored, chain, compare, vis } from "./visual";

/** A labelled anatomy or chart figure from the Study figure library. */
const fig = (id: string, caption: string, focus?: string[]): PrepVisual => ({ kind: "figure", data: { id, ...(focus ? { focus } : {}) } satisfies FigureData, caption });

export const BIOLOGICAL_L01: LongQA[] = anchored([
  {
    id: "bio-l01-001",
    subject: "biological",
    topic: "neurons",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "ma-semester", "ugc-net"],
    question: "Explain the ionic basis of the resting membrane potential. How do the Nernst and Goldman equations help us understand it?",
    plan: [
      "Define the resting potential and give its value",
      "Explain the two conditions: unequal ion concentrations and selective permeability",
      "Work through the Nernst equation for potassium and sodium",
      "Show how the Goldman equation combines the ions",
      "End with the sodium potassium pump and clinical links",
    ],
    answer: `## What the resting potential is
A neuron at rest is about 70 millivolts more negative inside than outside. This voltage across the membrane is the resting membrane potential, usually written as minus 70 mV. It is the stored charge that every action potential and synaptic potential later spends.

Two things create it. First, ions are unequally spread across the membrane: potassium is high inside the cell, while sodium and chloride are high outside. Second, the resting membrane is selectively permeable: many potassium leak channels are open, but few sodium channels are.

| Ion | Inside (mM) | Outside (mM) | Equilibrium potential |
| Potassium | about 140 | about 5 | about minus 90 mV |
| Sodium | about 15 | about 145 | about plus 60 mV |
| Chloride | about 10 | about 110 | about minus 65 mV |

## The Nernst equation
Potassium flows out down its concentration gradient. Each potassium ion that leaves takes a positive charge with it, so the inside becomes negative. That negative charge pulls potassium back in. At one voltage the electrical pull exactly balances the chemical push: this is the equilibrium potential for that ion.

Walther Nernst gave the formula. At body temperature it simplifies to E = 61.5/z × log10 (concentration outside / concentration inside), where z is the charge on the ion. For potassium, 61.5 × log10 (5/140) gives about minus 90 mV. For sodium, 61.5 × log10 (145/15) gives about plus 60 mV. The Nernst equation deals with one ion at a time.

## The Goldman equation
The real membrane is permeable to several ions at once, so the resting potential lies between their equilibrium potentials, closest to the ion with the highest permeability. David Goldman, Alan Hodgkin and Bernard Katz weighted each ion's concentrations by its relative permeability. At rest the ratio for potassium, sodium and chloride is about 1 : 0.04 : 0.45. Because potassium dominates, the resting value (minus 70 mV) sits near potassium's minus 90 mV, pulled a little upward by the small sodium leak.

The equation also predicts what happens during an action potential: when sodium permeability rises about twentyfold, the membrane swings towards sodium's plus 60 mV.

## The sodium potassium pump
The leak would slowly run the gradients down. The sodium potassium ATPase pushes 3 sodium ions out and brings 2 potassium ions in for each ATP used. This keeps the gradients, and it adds a few millivolts of negativity directly because it moves more positive charge out than in. The brain spends a large share of its energy on this pump.

## Clinical links
- Hyperkalaemia (high blood potassium) makes the resting potential less negative, so cells first become excitable and then inactivate: this is why it causes cardiac arrhythmia.
- Hypokalaemia from vomiting in bulimia nervosa or from diuretic misuse makes cells harder to excite and causes weakness and arrhythmia.
- Lithium enters cells through sodium channels but is a poor substrate for the pump, so it builds up inside cells; in the kidney it is reabsorbed along with sodium, which is why sodium depletion raises lithium levels.`,
    keyPoints: [
      "Resting potential about minus 70 mV, inside negative",
      "Unequal ion distribution plus selective potassium permeability",
      "Nernst equation stated with worked potassium and sodium values",
      "Goldman equation as a permeability weighted average",
      "Permeability ratio roughly 1 : 0.04 : 0.45",
      "Sodium potassium pump with 3 out, 2 in",
      "At least one clinical link such as potassium disorders",
    ],
    pitfalls: [
      "Saying the pump alone creates the resting potential",
      "Confusing equilibrium potential with resting potential",
      "Giving the Nernst equation without explaining what it balances",
    ],
    visuals: [
      fig("neuron", "What the resting potential is: the membrane of the cell body and axon holds the charge", ["soma", "axon", "hillock"]),
      compare(
        "The Nernst equation and the Goldman equation",
        ["Nernst", ["One ion at a time", "Gives the equilibrium potential", "Potassium about minus 90 mV", "Sodium about plus 60 mV"], "Where one ion would settle"],
        ["Goldman", ["All permeable ions together", "Weights each by permeability", "Gives the actual membrane potential", "Predicts the action potential peak"], "Where the membrane really sits"],
      ),
    ],
    module: "brain/2-1",
    ref: "Bear Connors Paradiso Neuroscience ch 3 (resting membrane potential, Nernst and GHK); Kaplan Synopsis ch 1 neural sciences",
  },
  {
    id: "bio-l01-002",
    subject: "biological",
    topic: "neurons",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "ma-semester", "mcp-entrance"],
    question: "Describe the phases of the action potential with their ionic basis. Explain refractory periods, the all or none law and how myelination speeds conduction.",
    plan: [
      "Define the action potential and threshold",
      "Walk through each phase with the ion channel responsible",
      "Explain absolute and relative refractory periods and their purpose",
      "State the all or none law and how intensity is coded",
      "Explain saltatory conduction and demyelinating disorders",
    ],
    answer: `## What an action potential is
An action potential is a brief, self-renewing reversal of the membrane voltage that travels along the axon. It is the neuron's long-distance signal. Synaptic inputs on the dendrites and cell body produce small graded potentials; if their sum depolarises the axon hillock to threshold (about minus 55 mV), an action potential fires. The hillock fires first because it has the densest voltage-gated sodium channels.

## The phases and their ions
1. Resting state: the membrane sits near minus 70 mV, mainly because of potassium leak channels.
2. Depolarisation to threshold: excitatory inputs let positive charge in. At threshold enough voltage-gated sodium channels open to start a positive feedback loop.
3. Rising phase: sodium rushes in down its electrical and chemical gradients. More depolarisation opens more sodium channels. The membrane swings to about plus 30 to plus 40 mV, approaching sodium's equilibrium potential.
4. Peak and sodium inactivation: within about a millisecond the inactivation gate of each sodium channel closes, so sodium entry stops even though the membrane is still depolarised.
5. Falling phase (repolarisation): slower voltage-gated potassium channels have now opened. Potassium leaves the cell and the voltage returns towards negative.
6. Undershoot (after-hyperpolarisation): potassium channels close slowly, so the membrane briefly overshoots to about minus 80 mV, close to potassium's equilibrium potential, before the leak channels and the sodium potassium pump restore rest.

Alan Hodgkin and Andrew Huxley worked this out in the squid giant axon using the voltage clamp, and won the Nobel Prize in 1963.

## Refractory periods
- Absolute refractory period: during the rising phase and most of the falling phase no second action potential can fire, however strong the stimulus, because the sodium channels are inactivated and must first reset at negative voltages.
- Relative refractory period: during the undershoot a stronger than usual stimulus can fire the cell, because some sodium channels have reset but potassium conductance is still high.

Refractoriness does three jobs. It makes the impulse travel one way (the membrane behind it cannot fire again), it separates impulses into discrete events, and it sets a ceiling on firing rate of several hundred per second.

## The all or none law
Once threshold is reached the action potential has the same size whatever the stimulus strength; below threshold nothing travels. So intensity cannot be coded by the size of the spike. The nervous system codes intensity by firing frequency (rate coding) and by the number of neurons recruited (population coding). A light touch gives a few spikes per second from a few receptors; a firm press gives many spikes from many receptors.

## Conduction and myelination
In an unmyelinated axon each patch of membrane depolarises the next patch, so conduction is continuous and slow, about 0.5 to 2 metres per second in thin C fibres. Two things speed conduction: a wider axon (less internal resistance, the squid's solution) and myelin (the vertebrate solution).

Myelin is made by Schwann cells in peripheral nerves and by oligodendrocytes in the brain and spinal cord. One oligodendrocyte myelinates segments of many axons, while each Schwann cell wraps one segment of one axon. Myelin is a fatty insulator that reduces current leak and membrane capacitance. Sodium channels cluster at the gaps between segments, the nodes of Ranvier. Current flows passively and fast under the myelin and regenerates the action potential at each node, so the impulse seems to jump from node to node. This is saltatory conduction, reaching up to about 120 metres per second in large motor fibres, while saving energy because only the nodes pump ions.

| Fibre | Myelin | Speed | Carries |
| A alpha | Thick | Up to about 120 m/s | Motor, muscle spindles |
| A delta | Thin | About 5 to 30 m/s | Sharp, fast pain |
| C | None | About 0.5 to 2 m/s | Dull, slow pain, autonomic |

## Clinical relevance
- Multiple sclerosis strips central myelin, slowing or blocking conduction; depression, euphoria and cognitive slowing are common psychiatric features.
- Guillain-Barre syndrome attacks peripheral myelin after an infection.
- Tetrodotoxin from pufferfish and local anaesthetics such as lidocaine block voltage-gated sodium channels and so stop action potentials.
- Several anticonvulsant mood stabilisers (carbamazepine, lamotrigine) act partly by stabilising the inactivated state of sodium channels, damping repetitive firing.
- Reduced white matter integrity on diffusion imaging is reported in schizophrenia, linking slowed or poorly timed conduction to the idea of disconnection.`,
    keyPoints: [
      "Threshold about minus 55 mV at the axon hillock",
      "Each phase linked to the right channel: sodium in, potassium out",
      "Sodium inactivation explains the absolute refractory period",
      "Relative refractory period and the job refractoriness does",
      "All or none law with rate and population coding",
      "Saltatory conduction at nodes of Ranvier, with Schwann cells and oligodendrocytes",
      "Clinical examples: demyelination and sodium channel drugs",
    ],
    pitfalls: [
      "Saying potassium enters the cell during repolarisation",
      "Claiming the pump repolarises each spike",
      "Mixing up which cell myelinates the brain and which the nerves",
    ],
    visuals: [
      vis("actionpotential", { title: "The phases and their ions", myelinated: false }, "The phases and their ions: watch sodium and potassium channels open in turn"),
      fig("myelin", "Conduction and myelination: nodes of Ranvier and saltatory conduction", ["node", "saltatory", "oligo", "schwann"]),
    ],
    module: "brain/2-1",
    ref: "Bear Connors Paradiso ch 4 action potential; Kaplan Synopsis ch 1; Hodgkin and Huxley 1952",
  },
  {
    id: "bio-l01-003",
    subject: "biological",
    topic: "neurons",
    marks: 10,
    difficulty: 2,
    exams: ["ma-semester", "cuet-pg", "md-psychiatry"],
    question: "Describe the types and functions of glial cells. What is their relevance to psychiatric disorders?",
    plan: [
      "Introduce glia as active partners, not just glue",
      "Describe astrocytes and their jobs",
      "Describe oligodendrocytes, Schwann cells, microglia and ependymal cells",
      "Link each type to psychiatric findings",
      "Conclude on the shift from neuron-only thinking",
    ],
    answer: `## Introduction
Rudolf Virchow named neuroglia, meaning nerve glue, in the 1850s, because he thought they simply held neurons together. Glia are at least as numerous as neurons in the human brain and are now known to shape signalling, metabolism, immunity and development.

## Astrocytes
Star-shaped cells with end-feet on blood vessels and fine processes around synapses.
- Support the blood brain barrier: end-feet wrap capillaries and signal to the endothelial cells that form tight junctions.
- Clear glutamate from the synapse through transporters (EAAT2, also called GLT-1), protecting neurons from excitotoxicity, and convert it to glutamine for return to neurons: the glutamate glutamine cycle.
- Buffer potassium released during firing.
- Supply lactate to active neurons and store glycogen.
- Release their own signalling molecules (gliotransmitters such as D-serine and ATP), so a synapse is better described as tripartite: two neurons plus an astrocyte.
- Form scars (gliosis) after injury.

## Myelinating cells
- Oligodendrocytes myelinate axons in the brain and spinal cord; one cell myelinates segments of up to dozens of axons.
- Schwann cells myelinate peripheral nerves, one segment each, and help peripheral nerves regenerate.

## Microglia
The brain's resident immune cells, derived from yolk sac macrophages. They survey constantly, engulf debris and release cytokines when activated. During development and adolescence they prune unused synapses, guided by complement proteins that tag synapses for removal.

## Ependymal and radial glia
Ependymal cells line the ventricles and, with the choroid plexus, help produce and move cerebrospinal fluid. Radial glia in the fetal brain act as scaffolding for migrating neurons and also give rise to neurons.

## Relevance to psychiatry
| Glial type | Finding | Disorder |
| Oligodendrocytes | Fewer cells, myelin gene changes, reduced white matter integrity | Schizophrenia, bipolar disorder |
| Astrocytes | Reduced density in prefrontal and cingulate cortex post mortem | Major depression |
| Microglia | Complement C4 driven pruning; signs of activation | Schizophrenia, depression with inflammation |
| Astrocytic glutamate uptake | Riluzole and ceftriaxone raise uptake | Research in OCD and depression |
| Schwann cells | Peripheral demyelination | Guillain-Barre syndrome |

The C4 finding is the clearest: the strongest common genetic signal for schizophrenia lies in the complement C4 gene, and higher C4 expression is linked to more synapse elimination, matching the reduced synaptic density and excessive adolescent pruning proposed by Irwin Feinberg. Absence of gliosis in schizophrenia brains also supports a developmental rather than degenerative process.

## Conclusion
Glia are active partners in every synapse. Psychiatric research increasingly treats disorders as problems of neuron and glia networks, which opens targets beyond the monoamine receptors.`,
    keyPoints: [
      "Glia not merely glue: Virchow's name and current view",
      "Astrocyte functions: barrier, glutamate uptake, potassium, metabolism, tripartite synapse",
      "Oligodendrocytes versus Schwann cells",
      "Microglia as immune cells and synaptic pruners",
      "At least three psychiatric links",
      "C4 and pruning in schizophrenia",
    ],
    pitfalls: ["Saying glia cannot signal", "Calling Schwann cells central myelin makers", "Listing cells without any psychiatric relevance"],
    visuals: [fig("glia", "Astrocytes: glial cells of the brain and their partners", ["astrocyte", "endfeet", "oligo", "microglia", "ependyma"])],
    module: "brain/1-6",
    ref: "Bear Connors Paradiso ch 2; Sekar 2016 Nature C4; Rajkowska post mortem glia in depression; brain module 1.6 and 5.3",
  },
  {
    id: "bio-l01-004",
    subject: "biological",
    topic: "neurons",
    marks: 20,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe the steps of chemical synaptic transmission from the arrival of the action potential to the termination of the signal. Illustrate with toxins, drugs and diseases that act at each step.",
    plan: [
      "Contrast chemical and electrical synapses briefly",
      "Synthesis and storage in vesicles",
      "Calcium entry and vesicle fusion through the SNARE proteins",
      "Receptor binding and postsynaptic potentials",
      "Termination by reuptake, breakdown and diffusion",
      "Table of toxins, drugs and diseases step by step",
    ],
    answer: `## Two kinds of synapse
Electrical synapses pass current directly through gap junctions; they are fast and two-way, and they synchronise groups of cells such as the thalamic reticular neurons. Most brain signalling uses chemical synapses, which are slower but can amplify, invert and be modified, which is why nearly all psychiatric medicines act there. Otto Loewi's frog heart experiment in 1921 showed that a nerve releases a chemical (acetylcholine, his vagusstoff).

## Step 1: synthesis and storage
Small molecule transmitters are made in the terminal from precursors by enzymes (tyrosine to dopamine, tryptophan to serotonin, choline plus acetyl-CoA to acetylcholine). Vesicular transporters, such as VMAT2 for monoamines, pump them into vesicles using a proton gradient. Neuropeptides are made in the cell body, packaged into large dense-core vesicles and shipped down the axon.

## Step 2: the action potential and calcium entry
The action potential reaches the terminal and opens voltage-gated calcium channels (mainly N and P/Q types) clustered at the active zone. Calcium concentration near the channels rises a thousandfold within a fraction of a millisecond. Calcium is the trigger: without it there is no release.

## Step 3: docking, priming and fusion
Vesicles are docked at the active zone by SNARE proteins: synaptobrevin (VAMP) on the vesicle, and syntaxin and SNAP-25 on the membrane. These zip together into a tight bundle that pulls the two membranes close. Synaptotagmin, the calcium sensor, binds calcium and triggers fusion. The vesicle opens and releases its contents into the cleft, about 20 nanometres wide. Release is quantal: each vesicle holds a roughly fixed packet, as Bernard Katz showed at the neuromuscular junction.

## Step 4: receptor binding
Transmitter diffuses across the cleft in microseconds and binds receptors:
- Ionotropic receptors are channels that open within a millisecond (nicotinic, GABA-A, AMPA, NMDA, 5-HT3).
- Metabotropic receptors act through G proteins and second messengers over tens of milliseconds to minutes (dopamine, muscarinic, most serotonin and noradrenaline receptors).
Sodium or calcium entry gives an excitatory postsynaptic potential; chloride entry or potassium exit gives an inhibitory one. The postsynaptic cell sums these in space and time at the hillock. Autoreceptors on the terminal feed back to limit further release.

## Step 5: termination
- Reuptake by transporters: DAT, NET and SERT for monoamines; EAATs (mostly astrocytic) for glutamate; GAT for GABA.
- Enzymatic breakdown: acetylcholinesterase splits acetylcholine in the cleft within a millisecond; MAO inside terminals and COMT outside break down monoamines.
- Diffusion away and uptake by glia.

## Step 6: recycling
Fused vesicle membrane is retrieved by clathrin-mediated endocytosis (dynamin pinches it off) and refilled, so a terminal can sustain firing.

## Modulating the synapse
Release is not fixed. Presynaptic autoreceptors (D2, 5-HT1B, alpha-2) reduce release when transmitter builds up, and heteroreceptors let one transmitter control another, as when serotonin acting on 5-HT2C receptors damps dopamine release. Endocannabinoids are made on demand by the postsynaptic cell and travel backwards to CB1 receptors on the terminal, briefly silencing it; this retrograde signal is what cannabis hijacks. Repeated firing can facilitate release (more residual calcium) or depress it (vesicle depletion). These short-term changes, and the longer-term changes of plasticity, mean the same synapse can carry a different message from minute to minute.

## Toxins, drugs and diseases step by step
| Step | Agent or disease | Effect |
| Action potential | Tetrodotoxin, lidocaine | Block sodium channels: no impulse |
| Vesicle filling | Reserpine, tetrabenazine | Block VMAT: monoamine depletion, depression risk with reserpine |
| Calcium entry | Lambert-Eaton syndrome | Antibodies to calcium channels: weakness that improves with use |
| Calcium entry | Gabapentin, pregabalin | Bind alpha-2-delta subunit, reduce release |
| Fusion | Botulinum toxin | Cleaves SNAP-25 or synaptobrevin: flaccid paralysis |
| Fusion | Tetanus toxin | Cleaves synaptobrevin in inhibitory interneurons: spasms |
| Fusion | Black widow venom (alpha-latrotoxin) | Massive release then depletion |
| Release reversal | Amphetamine | Reverses DAT and VMAT2, dumping dopamine |
| Receptor | Myasthenia gravis | Antibodies to nicotinic receptors: fatigable weakness |
| Receptor | Curare | Blocks nicotinic receptors |
| Receptor | Anti-NMDA receptor encephalitis | Antibodies cause psychosis, catatonia, seizures |
| Reuptake | SSRIs, cocaine, methylphenidate | Block SERT or DAT |
| Breakdown | Donepezil, organophosphates, sarin | Block acetylcholinesterase |
| Breakdown | MAO inhibitors | Block MAO: tyramine reaction risk |
| Autoreceptor | Clonidine | Alpha-2 agonist reduces noradrenaline release |

## Conclusion
Each step of the synapse is a control point. Knowing where a toxin, an antibody or a medicine acts lets a student predict its effects, from the paralysis of botulism to the dopamine surge of amphetamine and the delayed therapeutic effect of SSRIs.`,
    keyPoints: [
      "Chemical versus electrical synapses",
      "Synthesis and vesicular loading with VMAT2",
      "Voltage-gated calcium entry as the trigger",
      "SNARE proteins named and synaptotagmin as calcium sensor",
      "Ionotropic versus metabotropic receptors, EPSP and IPSP",
      "Termination by reuptake, enzymes and diffusion",
      "Toxin and drug examples matched to each step",
      "At least one autoimmune disease of the synapse",
    ],
    pitfalls: [
      "Leaving out calcium",
      "Saying botulinum toxin blocks receptors rather than release",
      "Giving drugs without stating the step they act on",
    ],
    visuals: [
      fig("synapse", "Step 3: docking, priming and fusion at a chemical synapse up close", ["cachannel", "fusion", "vesicle", "transporter", "autoreceptor", "receptor"]),
      fig("nmj", "Toxins, drugs and diseases step by step: the neuromuscular junction shows botulinum, curare and myasthenia", ["vesicles", "nachr", "ache"]),
    ],
    module: "brain/2-2",
    ref: "Bear Connors Paradiso ch 5 synaptic transmission; Kaplan Synopsis ch 1; brain module 2.2 toxins table",
  },
  {
    id: "bio-l01-005",
    subject: "biological",
    topic: "neurons-plasticity",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net"],
    question: "What is synaptic plasticity? Describe the mechanisms of long-term potentiation and long-term depression, and discuss their relevance to learning, memory and psychiatric disorders.",
    plan: [
      "Define plasticity and Hebb's rule",
      "Kandel's sea slug work on habituation and sensitisation",
      "LTP: discovery, NMDA receptor as coincidence detector, early and late phases",
      "LTD and its mechanism",
      "Psychiatric relevance: depression, addiction, PTSD, schizophrenia and treatments",
    ],
    answer: `## Synaptic plasticity
Synaptic plasticity is the ability of synapses to strengthen or weaken with use. Donald Hebb proposed in 1949 that when one cell repeatedly helps fire another, the connection between them grows stronger: cells that fire together wire together. Plasticity is the leading cellular explanation of learning and memory.

## Simple learning in a sea slug
Eric Kandel studied the gill withdrawal reflex of the sea slug Aplysia, which has large, identifiable neurons.
- Habituation: repeated gentle touch gave less transmitter release from sensory neurons, because of reduced calcium entry.
- Sensitisation: a shock to the tail made serotonin-releasing interneurons act on the sensory terminals, raising cyclic AMP and protein kinase A, which closed potassium channels and increased release.
- Long-term sensitisation needed new protein synthesis through the transcription factor CREB and the growth of new synapses.
Kandel shared the Nobel Prize in 2000. The key lesson is that short-term memory changes existing proteins, while long-term memory needs genes, new proteins and structural change.

## Long-term potentiation
Timothy Bliss and Terje Lomo reported in 1973 that brief high-frequency stimulation of the perforant path in the rabbit hippocampus increased responses in the dentate gyrus for hours to days. LTP is best studied at the Schaffer collateral synapses onto CA1 cells.

Its properties match memory: it is input specific (only stimulated synapses strengthen), cooperative (needs enough inputs together) and associative (a weak input paired with a strong one is strengthened).

The mechanism centres on the NMDA receptor, a coincidence detector:
1. Glutamate binds both AMPA and NMDA receptors. At rest magnesium plugs the NMDA channel.
2. Strong firing depolarises the postsynaptic cell through AMPA receptors, which expels the magnesium.
3. With both glutamate bound and the cell depolarised, the NMDA channel lets calcium in.
4. A large, fast rise in calcium activates CaMKII and protein kinase C.
5. These phosphorylate AMPA receptors and insert more of them into the membrane, so the next input gives a larger response: early LTP, lasting hours.
6. Late LTP, lasting days or longer, requires CREB-driven gene expression, new proteins and growth of dendritic spines. BDNF supports this phase.

## Long-term depression
Low-frequency stimulation (about 1 per second for several minutes) gives a small, slow calcium rise through NMDA receptors. This activates phosphatases such as calcineurin instead of kinases, which dephosphorylate and remove AMPA receptors. LTD lets networks weaken unused links, preventing saturation. In the cerebellum, LTD at parallel fibre synapses on Purkinje cells underlies motor learning.

| Feature | LTP | LTD |
| Trigger | High-frequency, strong input | Low-frequency input |
| Calcium | Large, fast rise | Small, slow rise |
| Enzymes | Kinases (CaMKII, PKC) | Phosphatases (calcineurin) |
| AMPA receptors | Inserted | Removed |
| Result | Stronger synapse | Weaker synapse |

## Learning and memory
Blocking NMDA receptors in the rat hippocampus with AP5 impaired spatial learning in the water maze, as shown by Richard Morris. Mice lacking CaMKII or NMDA receptors in CA1 also have poor spatial memory. Fear conditioning produces LTP-like changes in the lateral amygdala. These findings link the cellular process to behaviour.

## Psychiatric relevance
- Depression: chronic stress and high cortisol shrink dendrites in the hippocampus and prefrontal cortex and lower BDNF. Ketamine blocks NMDA receptors, triggers a glutamate burst, BDNF release and mTOR signalling, and rapidly restores spines; this is one model of its fast antidepressant effect.
- Addiction: drugs of abuse produce long-lasting LTP-like changes at glutamate synapses on dopamine-receptive cells in the nucleus accumbens, so drug cues come to drive craving: addiction as pathological learning.
- PTSD: overly strong fear memories and weak extinction learning. D-cycloserine, a partial agonist at the NMDA glycine site, was tested to boost extinction during exposure therapy, with mixed results.
- Schizophrenia: NMDA receptor hypofunction and abnormal pruning may disturb plasticity in prefrontal and hippocampal circuits.
- Dementia: amyloid beta impairs LTP early in Alzheimer's disease; memantine blocks excessive NMDA activity while sparing normal signalling.
- ECT and antidepressants increase hippocampal neurogenesis and BDNF in animals.

## Conclusion
LTP and LTD are the brain's write and erase functions. Many psychiatric disorders can be seen as plasticity gone wrong, and newer treatments aim to reopen healthy plasticity rather than simply change transmitter levels.`,
    keyPoints: [
      "Hebb's rule stated",
      "Kandel: short-term versus long-term memory mechanisms, CREB",
      "LTP discovered in the hippocampus; input specific, cooperative, associative",
      "NMDA receptor as coincidence detector with magnesium block",
      "Early versus late LTP",
      "LTD through phosphatases and AMPA removal",
      "Links to ketamine, addiction and PTSD",
    ],
    pitfalls: [
      "Saying AMPA receptors carry the calcium that triggers LTP",
      "Leaving out the magnesium block",
      "No link to any disorder or treatment",
    ],
    visuals: [
      fig("hippocampus", "Long-term potentiation: the hippocampal circuit where it was found", ["perforant", "dg", "mossy", "ca3", "schaffer", "ammon"]),
      fig("nmda-receptor", "The mechanism centres on the NMDA receptor: two keys and a plug"),
    ],
    module: "brain/5-5",
    ref: "Bliss and Lomo 1973; Kandel Nobel lecture 2000; Morris water maze AP5 1986; brain module 5.5; Bear Connors Paradiso ch 25",
  },
  {
    id: "bio-l01-006",
    subject: "biological",
    topic: "neurotransmitters",
    marks: 20,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance", "ugc-net", "ma-semester"],
    question: "Describe the synthesis, receptors and pathways of dopamine. Discuss the role of dopamine in schizophrenia and the actions and side effects of antipsychotic drugs.",
    plan: [
      "Synthesis, storage and breakdown",
      "Receptor families and their second messengers",
      "The four main pathways with the effect of blocking each",
      "The dopamine hypothesis from its first form to the modern version",
      "D2 occupancy, side effects and partial agonists",
      "Conclusion with limits of the hypothesis",
    ],
    answer: `## Synthesis and breakdown
Dopamine is a catecholamine. Tyrosine, from the diet or made from phenylalanine, is converted to L-DOPA by tyrosine hydroxylase, the rate-limiting enzyme. Aromatic amino acid decarboxylase turns L-DOPA into dopamine. VMAT2 packs dopamine into vesicles. After release, the dopamine transporter (DAT) takes it back into the terminal. It is broken down by monoamine oxidase (MAO-B in glia, MAO-A in neurons) and catechol-O-methyltransferase (COMT), mainly in the prefrontal cortex where DAT is scarce. The end product is homovanillic acid (HVA), measured in plasma and CSF.

## Receptors
| Family | Receptors | G protein | Effect on cyclic AMP | Main sites |
| D1-like | D1, D5 | Gs | Increases | Striatum, prefrontal cortex |
| D2-like | D2, D3, D4 | Gi | Decreases | Striatum, pituitary, limbic areas |

D2 receptors also act as autoreceptors on dopamine neurons. D3 is concentrated in the ventral striatum, and D4 drew interest because clozapine binds it.

## The four pathways
Dopamine cell bodies lie in the midbrain and hypothalamus.
1. Nigrostriatal: substantia nigra pars compacta to the dorsal striatum (caudate and putamen). Controls movement. Blocking it causes extrapyramidal side effects; its loss causes Parkinson's disease.
2. Mesolimbic: ventral tegmental area to the nucleus accumbens and limbic areas. Signals reward prediction and salience. Overactivity is linked to positive symptoms; blocking it treats them.
3. Mesocortical: ventral tegmental area to the prefrontal cortex. Underactivity is linked to negative and cognitive symptoms; blocking it may worsen them.
4. Tuberoinfundibular: arcuate nucleus of the hypothalamus to the pituitary portal system. Dopamine tonically inhibits prolactin. Blocking it causes hyperprolactinaemia.
A thalamic projection is sometimes added as a fifth.

## The dopamine hypothesis
- First version: Arvid Carlsson showed that antipsychotics increased dopamine turnover, and in 1975 and 1976 Philip Seeman and Ian Creese showed that the clinical dose of antipsychotics correlated with their affinity for D2 receptors. Amphetamine, which releases dopamine, can cause paranoid psychosis. So the idea was simply too much dopamine.
- Revised version: building on Daniel Weinberger's work, Kenneth Davis and colleagues in 1991 proposed excess subcortical (mesolimbic) dopamine for positive symptoms and deficient prefrontal (mesocortical) dopamine for negative and cognitive symptoms.
- Version III: Oliver Howes and Shitij Kapur in 2009 brought together PET findings. The clearest abnormality is raised presynaptic dopamine synthesis and release in the striatum, especially its associative part, rather than more receptors. Many routes (genes, stress, cannabis, obstetric injury) converge on this final common pathway. Kapur's aberrant salience idea explains the experience: random events feel loaded with meaning, and delusions are the person's attempt to explain them.

## Antipsychotic action and D2 occupancy
PET studies by Shitij Kapur and colleagues showed that about 65 percent D2 occupancy is needed for antipsychotic response, prolactin rises above about 72 percent, and extrapyramidal effects appear above about 78 to 80 percent. This window explains why low to moderate doses of haloperidol work as well as high ones with fewer side effects.

Side effects by pathway:
- Nigrostriatal: acute dystonia (hours to days), parkinsonism and akathisia (days to weeks), tardive dyskinesia (months to years, linked to receptor supersensitivity).
- Tuberoinfundibular: galactorrhoea, amenorrhoea, sexual dysfunction, osteoporosis; most with risperidone, paliperidone and amisulpride.
- Mesocortical: secondary negative symptoms and dysphoria (neuroleptic-induced deficit).
- Neuroleptic malignant syndrome: rigidity, fever, autonomic instability and raised creatine kinase.

Second-generation drugs add 5-HT2A blockade, which releases dopamine in the striatum and cortex and lowers EPS risk. Aripiprazole, brexpiprazole and cariprazine are D2 partial agonists: they reduce dopamine signalling where it is high and support it where it is low, with little effect on prolactin. Clozapine has low D2 occupancy yet works in treatment resistance, showing that dopamine is not the whole story. Xanomeline-trospium, approved in the USA in 2024, treats schizophrenia through muscarinic receptors without blocking D2.

## Other dopamine links
Dopamine also matters in addiction (all addictive drugs raise accumbens dopamine), ADHD (stimulants block DAT), Parkinson's disease and its psychosis, restless legs, and impulse control disorders caused by dopamine agonists.

## Limits
About a third of patients do not respond to D2 blockade, and many of them have normal striatal dopamine synthesis on PET. Negative and cognitive symptoms respond poorly. So dopamine is best seen as the final step for positive symptoms, sitting downstream of glutamate, GABA interneuron and developmental changes.`,
    keyPoints: [
      "Tyrosine hydroxylase as rate-limiting step, HVA as metabolite",
      "D1-like and D2-like families with G proteins",
      "Four pathways with the clinical effect of blocking each",
      "Seeman and Creese D2 affinity and dose correlation",
      "Howes and Kapur version III: presynaptic synthesis capacity",
      "D2 occupancy window 65 to 80 percent",
      "EPS types and hyperprolactinaemia",
      "Partial agonists, clozapine and limits of the hypothesis",
    ],
    pitfalls: [
      "Giving only the 1960s version of the hypothesis",
      "Saying schizophrenia has more D2 receptors as the main finding",
      "Mixing up mesolimbic and mesocortical effects",
    ],
    visuals: [
      fig("dopamine-pathways", "The four pathways: where dopamine cells project", ["snc", "vta", "nigrostriatal", "mesolimbic", "mesocortical", "tuberoinfundibular"]),
      fig("d2-occupancy", "Antipsychotic action and D2 occupancy: the therapeutic window"),
    ],
    module: "brain/2-6",
    ref: "Stahl Essential Psychopharmacology ch 4 and 5; Howes and Kapur 2009 Schizophr Bull; Kapur 2000 occupancy; Seeman 1976; brain module 2.6",
  },
  {
    id: "bio-l01-007",
    subject: "biological",
    topic: "neurotransmitters",
    marks: 15,
    difficulty: 3,
    exams: ["md-psychiatry", "ugc-net", "ma-semester"],
    question: "Describe the serotonergic system: synthesis, raphe projections and receptor subtypes. Critically evaluate the role of serotonin in depression.",
    plan: [
      "Synthesis, storage and breakdown",
      "Raphe nuclei and their projections",
      "Receptor families with drug examples",
      "Functions of serotonin",
      "Evidence for and against the serotonin hypothesis of depression",
    ],
    answer: `## Synthesis and breakdown
Serotonin (5-hydroxytryptamine, 5-HT) is made from the essential amino acid tryptophan. Tryptophan hydroxylase, the rate-limiting enzyme (the TPH2 form in the brain), adds a hydroxyl group to make 5-hydroxytryptophan, and aromatic amino acid decarboxylase turns this into serotonin. Because the enzyme is not saturated, brain serotonin depends on tryptophan supply, which is the basis of tryptophan depletion experiments. VMAT2 stores it in vesicles, the serotonin transporter (SERT) takes it back after release, and MAO-A breaks it down to 5-hydroxyindoleacetic acid (5-HIAA). In the pineal gland serotonin is converted to melatonin. About 90 percent of the body's serotonin is in the gut, made by enterochromaffin cells; it does not cross the blood brain barrier.

## The raphe nuclei
Serotonin neurons sit in the raphe nuclei along the midline of the brainstem.
- The rostral group (dorsal and median raphe in the midbrain and upper pons) projects upward to almost the whole forebrain: cortex, basal ganglia, hippocampus, amygdala, hypothalamus and thalamus.
- The caudal group in the pons and medulla projects to the cerebellum and spinal cord, where it modulates pain and motor tone.
A few thousand cells thus influence nearly every brain area, which explains serotonin's broad, modulating role.

## Receptors
There are 7 families and at least 14 subtypes. All are G protein coupled except 5-HT3, which is an ion channel.
| Receptor | Mechanism | Relevance |
| 5-HT1A | Gi; somatodendritic autoreceptor and postsynaptic | Buspirone; autoreceptor desensitisation explains SSRI delay |
| 5-HT1B/1D | Gi; terminal autoreceptor | Triptans for migraine |
| 5-HT2A | Gq | Psychedelics act here; blocked by atypical antipsychotics, pimavanserin |
| 5-HT2C | Gq | Appetite and weight gain with olanzapine; agomelatine blocks it |
| 5-HT3 | Ion channel | Nausea with SSRIs; ondansetron blocks it |
| 5-HT4, 6, 7 | Gs | Gut motility, cognition, circadian rhythm; vortioxetine and lurasidone act at some |

## Functions
Mood, anxiety, impulse control, sleep and wakefulness, appetite, pain, sexual function, body temperature, nausea and vomiting, and platelet aggregation. Serotonin generally acts as a brake on impulsive and aggressive behaviour.

## The serotonin hypothesis of depression
Evidence that seemed to support it:
- Reserpine depleted monoamines and was reported to cause depression.
- SSRIs and other drugs that raise serotonin treat depression.
- Marie Asberg reported in 1976 low CSF 5-HIAA in depressed patients who made violent suicide attempts.
- Rapid tryptophan depletion causes a brief relapse in many people who have recovered on SSRIs.
- Post mortem studies reported more 5-HT2A receptors in the brains of people who died by suicide.

Evidence against:
- SSRIs block reuptake within hours, but mood improves over weeks. The delay points to downstream changes: 5-HT1A autoreceptor desensitisation, BDNF and neuroplasticity.
- Tryptophan depletion does not cause depression in healthy people without a personal or family history.
- An umbrella review led by Joanna Moncrieff in 2022 found no consistent evidence of low serotonin or SERT changes in depression.
- Depression responds to drugs with other primary targets: ketamine (glutamate), bupropion (dopamine and noradrenaline), mirtazapine.
- Large genetic studies found no reliable effect of the serotonin transporter gene variant on depression.

## Evaluation
The simple chemical imbalance story is not supported, and patients should not be told depression is just low serotonin. But serotonin clearly matters: antidepressants that act on it work better than placebo on average, and serotonin modulates the stress, plasticity and negative bias systems that do change in depression. Catherine Harmer's work shows SSRIs shift emotional processing towards positive cues within hours, before mood lifts. The best current view is that serotonin is one modulator within a wider model involving stress hormones, inflammation, glutamate and neural plasticity.`,
    keyPoints: [
      "Tryptophan hydroxylase as rate-limiting enzyme and 5-HIAA as metabolite",
      "Rostral and caudal raphe groups with targets",
      "Receptor table with 5-HT3 as the only ion channel",
      "Drug examples per receptor",
      "Supporting evidence: reserpine, CSF 5-HIAA, tryptophan depletion",
      "Contrary evidence: delay, 2022 umbrella review, other drug targets",
      "Balanced conclusion beyond chemical imbalance",
    ],
    pitfalls: [
      "Presenting low serotonin as proven",
      "Forgetting 5-HT3 is ionotropic",
      "Not explaining the delay in antidepressant response",
    ],
    visuals: [
      fig("serotonin-projections", "The raphe nuclei: serotonin projections to the forebrain and cord", ["dorsal", "median", "caudal", "cortex", "limbic"]),
      compare(
        "The serotonin hypothesis of depression",
        ["For", ["Reserpine and depression reports", "SSRIs work on average", "Low CSF 5-HIAA in violent suicide", "Tryptophan depletion relapse"], "Serotonin is involved"],
        ["Against", ["Weeks of delay despite hours of reuptake block", "No effect of depletion in healthy people", "2022 umbrella review found no consistent deficit", "Other drug targets also work"], "Not a simple deficiency"],
      ),
    ],
    module: "brain/2-5",
    ref: "Stahl ch 6 and 7; Asberg 1976; Moncrieff 2022 Mol Psychiatry umbrella review; Harmer cognitive neuropsychological model; brain module 2.5",
  },
  {
    id: "bio-l01-008",
    subject: "biological",
    topic: "neurotransmitters",
    marks: 10,
    difficulty: 3,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Write a note on the locus coeruleus noradrenergic system and its role in psychiatric disorders.",
    plan: [
      "Synthesis, receptors and metabolites",
      "Locus coeruleus anatomy and projections",
      "Functions: arousal, attention, stress",
      "Clinical links with drugs",
    ],
    answer: `## Synthesis and receptors
Noradrenaline (norepinephrine) is made along the catecholamine route: tyrosine to L-DOPA by tyrosine hydroxylase, then dopamine, then noradrenaline by dopamine beta-hydroxylase inside the vesicle. It is removed by the noradrenaline transporter (NET) and broken down by MAO and COMT. The main brain metabolite is MHPG; the main peripheral one is vanillylmandelic acid (VMA).

| Receptor | G protein | Example drug |
| Alpha-1 | Gq | Prazosin blocks it; antipsychotics and tricyclics block it (postural hypotension) |
| Alpha-2 | Gi, mostly autoreceptor | Clonidine, guanfacine, lofexidine stimulate it; mirtazapine blocks it |
| Beta-1, beta-2 | Gs | Propranolol blocks them |

## The locus coeruleus
The locus coeruleus, the blue spot, is a small nucleus in the dorsal pons beside the fourth ventricle. It contains only some tens of thousands of neurons on each side but is the main source of noradrenaline for the brain. Its axons branch widely to the whole cortex, thalamus, hypothalamus, amygdala, hippocampus, cerebellum and spinal cord. A second, smaller group in the lateral tegmentum supplies the hypothalamus.

## Functions
- Arousal and wakefulness: it fires fast when awake, slowly in non-REM sleep and is almost silent in REM sleep.
- Attention: Gary Aston-Jones described two modes. Phasic bursts to important stimuli sharpen focused attention; high tonic firing gives scanning, distractible behaviour.
- Stress: CRH from the amygdala drives the locus coeruleus, producing vigilance and sympathetic arousal.
- Memory consolidation of emotional events through noradrenaline in the amygdala.
- Mood and descending pain control.

## Clinical links
- Panic disorder: yohimbine, an alpha-2 blocker that increases locus coeruleus firing, can provoke panic in people with panic disorder.
- PTSD: hyperarousal and nightmares are linked to noradrenergic overactivity; prazosin was used for nightmares, though a large trial in veterans was negative, so evidence is mixed.
- Opioid withdrawal: opioids suppress the locus coeruleus; when they are stopped it rebounds, causing sweating, diarrhoea, gooseflesh and anxiety. Clonidine and lofexidine dampen it.
- Depression: SNRIs, tricyclics, reboxetine and mirtazapine raise noradrenergic signalling.
- ADHD: atomoxetine blocks NET; guanfacine and clonidine act on alpha-2A receptors in prefrontal cortex to strengthen working memory.
- Alzheimer's and Parkinson's diseases: the locus coeruleus degenerates early, possibly contributing to depression and apathy.
- Performance anxiety: propranolol blocks tremor and palpitations without sedation.

## Conclusion
A small brainstem nucleus sets the brain's level of alertness and readiness, and several anxiety, trauma, addiction and attention treatments work by turning its output up or down.`,
    keyPoints: [
      "Dopamine beta-hydroxylase step and MHPG",
      "Receptor types with G proteins and drugs",
      "Locus coeruleus position in the pons and wide projections",
      "Firing across wake, non-REM and REM",
      "Tonic and phasic modes of attention",
      "At least four clinical links with drugs",
    ],
    pitfalls: ["Putting the locus coeruleus in the medulla", "Forgetting alpha-2 is an autoreceptor", "Listing drugs without the receptor they act on"],
    visuals: [fig("noradrenaline-projections", "The locus coeruleus: noradrenaline projections from the pons", ["lc", "cortex", "thalamus", "limbic", "spinal"])],
    module: "brain/2-5",
    ref: "Bear Connors Paradiso ch 15 diffuse modulatory systems; Aston-Jones and Cohen 2005 adaptive gain; Raskind 2018 prazosin trial; Stahl ch 6",
  },
  {
    id: "bio-l01-009",
    subject: "biological",
    topic: "neurotransmitters",
    marks: 15,
    difficulty: 4,
    exams: ["md-psychiatry", "mcp-entrance"],
    question: "Describe glutamate neurotransmission and its receptors. Discuss the glutamate hypothesis of schizophrenia and the clinical significance of excitotoxicity.",
    plan: [
      "Glutamate as the main excitatory transmitter and the glutamate glutamine cycle",
      "Ionotropic and metabotropic receptors, with the NMDA receptor in detail",
      "The NMDA hypofunction hypothesis: evidence and circuit",
      "Excitotoxicity and its disorders",
      "Drugs acting on glutamate",
    ],
    answer: `## Glutamate and its cycle
Glutamate is the main excitatory transmitter of the brain; most cortical pyramidal neurons and thalamic relay cells use it. It cannot be supplied from the blood, so it is made locally. After release, astrocytes take up most of it through the transporters EAAT1 and EAAT2, convert it to glutamine with glutamine synthetase, and send glutamine back to neurons, where glutaminase turns it into glutamate again. This glutamate glutamine cycle protects neurons from excess glutamate.

## Receptors
Ionotropic receptors:
- AMPA: fast sodium entry, carries most ordinary excitatory transmission.
- Kainate: modulates release and excitability.
- NMDA: a slow, calcium-permeable channel, central to plasticity.
Metabotropic receptors (mGluR1 to 8) form three groups. Group I (mGluR1, 5) is Gq coupled and postsynaptic; groups II and III are Gi coupled and mostly presynaptic, reducing release.

## The NMDA receptor in detail
The NMDA receptor is built from two GluN1 subunits and two GluN2 subunits. It opens only when three conditions meet:
1. Glutamate binds the GluN2 subunit.
2. A co-agonist, glycine or D-serine, binds the GluN1 subunit.
3. The membrane is depolarised enough to expel the magnesium ion that plugs the pore.
Then calcium and sodium flow in. Phencyclidine (PCP), ketamine and memantine bind inside the channel pore and block it.

## The glutamate hypothesis of schizophrenia
Evidence:
- PCP and ketamine, NMDA receptor blockers, produce positive symptoms, negative symptoms and cognitive deficits in healthy volunteers and worsen symptoms in patients. Amphetamine reproduces only positive symptoms, so NMDA blockade is a fuller model. John Krystal and Daniel Javitt developed this idea in the 1990s.
- Anti-NMDA receptor encephalitis, described by Josep Dalmau in 2007, often starts with psychosis, catatonia and agitation, usually in young women, sometimes with an ovarian teratoma.
- Large genetic studies implicate GRIN2A (an NMDA subunit) and many genes at glutamate synapses.
- Post mortem studies show reduced dendritic spines on prefrontal pyramidal cells.
- MRS studies report raised glutamate in some brain regions early in illness.

The proposed circuit: NMDA receptors on fast-spiking parvalbumin GABA interneurons are especially sensitive. When they are underactive, these interneurons fail to inhibit pyramidal cells, causing disinhibited, disorganised glutamate release in the cortex and hippocampus. This loss of gamma rhythm timing may explain cognitive deficits, and the excess hippocampal output may drive the raised striatal dopamine described by Anthony Grace. So glutamate sits upstream of dopamine.

Treatment attempts have been disappointing: glycine-site agonists, sarcosine, glycine transporter inhibitors (bitopertin) and mGluR2/3 agonists (pomaglumetad) did not succeed in large trials. The hypothesis remains strong in explanation but weak in therapy so far.

## Excitotoxicity
Too much glutamate, or too much NMDA activation, floods neurons with calcium. This activates proteases, lipases and nitric oxide synthase, damages mitochondria and causes cell death. John Olney named the process in 1969.
- Stroke and head injury: energy failure stops glutamate uptake.
- Status epilepticus.
- Huntington's disease and amyotrophic lateral sclerosis (riluzole reduces glutamate release).
- Alcohol withdrawal: chronic alcohol causes NMDA upregulation; sudden withdrawal leaves an overexcited brain, adding to seizures and possibly to neuronal loss.
- Hypoglycaemia and hepatic encephalopathy.

## Drugs acting on glutamate
| Drug | Action | Use |
| Ketamine, esketamine | NMDA channel block | Treatment-resistant depression, anaesthesia |
| Memantine | Low-affinity NMDA block | Moderate to severe Alzheimer's disease |
| Lamotrigine | Reduces glutamate release | Bipolar depression prevention, epilepsy |
| Acamprosate | Modulates NMDA activity | Alcohol relapse prevention |
| N-acetylcysteine | Boosts cystine glutamate exchange | Researched in addiction and OCD |
| Topiramate | Blocks AMPA and kainate, among other actions | Epilepsy, alcohol use, weight |

## Conclusion
Glutamate signalling, and the NMDA receptor in particular, links plasticity, cognition, psychosis and cell death. Its role in schizophrenia explains features the dopamine hypothesis cannot, and its role in depression produced the first truly fast-acting antidepressant.`,
    keyPoints: [
      "Glutamate glutamine cycle with astrocytes",
      "AMPA, kainate, NMDA and mGluR groups",
      "NMDA needs glutamate, glycine or D-serine and depolarisation to lift magnesium",
      "PCP and ketamine model all three symptom domains",
      "Anti-NMDA receptor encephalitis",
      "Interneuron disinhibition circuit linking glutamate to dopamine",
      "Excitotoxicity with clinical examples",
      "Drug table with ketamine and memantine",
    ],
    pitfalls: [
      "Calling glutamate inhibitory or mixing it with GABA",
      "Leaving out the co-agonist site",
      "Claiming glutamate drugs are proven for schizophrenia",
    ],
    visuals: [
      fig("nmda-receptor", "The NMDA receptor in detail: glutamate, glycine and the magnesium plug"),
      chain("The glutamate hypothesis of schizophrenia", [
        ["NMDA hypofunction", "On parvalbumin GABA interneurons"],
        ["Less inhibition", "Pyramidal cells disinhibited"],
        ["Disorganised glutamate", "Lost gamma timing, cognitive deficits"],
        ["Hippocampal overdrive", "Raises firing of dopamine cells"],
        ["Striatal dopamine excess", "Aberrant salience and positive symptoms"],
      ]),
    ],
    module: "brain/2-4",
    ref: "Stahl ch 4 glutamate; Krystal 1994 ketamine; Dalmau 2007; Lisman and Grace 2008 hippocampal dopamine model; Olney 1969; brain module 2.4",
  },
  {
    id: "bio-l01-010",
    subject: "biological",
    topic: "neurotransmitters",
    marks: 10,
    difficulty: 2,
    exams: ["md-psychiatry", "ma-semester", "cuet-pg"],
    question: "Describe GABA as a neurotransmitter. Explain the structure of the GABA-A receptor and how benzodiazepines, barbiturates, alcohol and newer drugs act on it.",
    plan: [
      "Synthesis and breakdown",
      "GABA-A and GABA-B receptors",
      "Subunits and drug binding sites",
      "Drugs and their clinical uses and risks",
    ],
    answer: `## GABA synthesis and removal
Gamma-aminobutyric acid (GABA) is the main inhibitory transmitter of the brain; about a fifth to a third of cortical synapses use it, mostly from local interneurons. It is made from glutamate by glutamic acid decarboxylase (GAD), which needs vitamin B6. After release it is taken up by GABA transporters (GAT) into neurons and astrocytes and broken down by GABA transaminase. Vigabatrin blocks this enzyme, and tiagabine blocks GAT-1; both treat epilepsy.

## GABA receptors
- GABA-A: a chloride channel. Chloride entry hyperpolarises the cell, giving fast inhibition.
- GABA-B: a G protein coupled receptor (Gi) that opens potassium channels and closes calcium channels, giving slow inhibition. Baclofen is an agonist used for spasticity and alcohol dependence; GHB (sodium oxybate) also acts here.
In the fetal and newborn brain GABA is excitatory because chloride is high inside young neurons; the transporter KCC2 later lowers it.

## Structure of the GABA-A receptor
It is a pentamer, usually two alpha, two beta and one gamma subunit around a central chloride pore. GABA binds at the two alpha beta interfaces. Benzodiazepines bind at a separate alpha gamma interface. Subunit types matter:
| Subunit | Effect of drug acting there |
| Alpha-1 | Sedation, amnesia, anticonvulsant effect; zolpidem prefers it |
| Alpha-2, alpha-3 | Anxiety relief, muscle relaxation |
| Alpha-5 | Learning and memory in the hippocampus |
| Delta (outside synapses) | Tonic inhibition; neurosteroids and alcohol act here |

## Drugs at GABA-A
- Benzodiazepines are positive allosteric modulators: they increase how often the channel opens when GABA is present. Without GABA they do nothing, which gives a ceiling and makes them safer in overdose than barbiturates. Flumazenil is the antagonist.
- Barbiturates increase how long the channel stays open and at high doses open it directly, so overdose can be fatal.
- Z-drugs (zolpidem, zopiclone) bind the benzodiazepine site, preferring alpha-1.
- Alcohol enhances GABA-A (especially delta-containing receptors) and blocks NMDA receptors. Tolerance comes from receptor changes; sudden withdrawal leaves too little inhibition and too much excitation, causing tremor, seizures and delirium tremens. Benzodiazepines treat withdrawal by cross-tolerance.
- Neurosteroids such as allopregnanolone are potent modulators. Brexanolone (intravenous) and zuranolone (oral) were approved in the USA for postpartum depression.
- General anaesthetics such as propofol act largely here.

## Clinical points
Benzodiazepines cause tolerance, dependence and withdrawal, falls and confusion in older adults, and dangerous respiratory depression when combined with opioids or alcohol. They are best used short term. Low GABA has been reported on MRS in depression and panic disorder, and loss of GABA interneuron markers is described in schizophrenia.`,
    keyPoints: [
      "GAD with vitamin B6 makes GABA from glutamate",
      "GABA-A chloride channel versus GABA-B G protein receptor",
      "Pentamer structure with benzodiazepine site at alpha gamma interface",
      "Subunit specific effects",
      "Frequency versus duration: benzodiazepines versus barbiturates",
      "Alcohol, withdrawal and neurosteroids",
    ],
    pitfalls: ["Saying benzodiazepines open the channel without GABA", "Forgetting GABA-B", "Ignoring dependence and overdose risks"],
    visuals: [fig("benzo-gabaa", "Structure of the GABA-A receptor: where GABA and benzodiazepines bind")],
    module: "brain/2-4",
    ref: "Stahl ch 7 anxiety and GABA; Bear Connors Paradiso ch 6; zuranolone FDA approval 2023",
  },
]);
